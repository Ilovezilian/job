var easNames = JavaImporter(); //定义引入变量
easNames.importPackage(Packages.com.kingdee.shr.base.syssetting.app.osf);
easNames.importPackage(Packages.java.util);
easNames.importPackage(Packages.java.lang);
easNames.importPackage(Packages.com.kingdee.eas.hr.ats.lightapp.util);
easNames.importPackage(Packages.com.kingdee.eas.hr.ats);
easNames.importPackage(Packages.com.kingdee.eas.util.app);
easNames.importPackage(Packages.com.kingdee.eas.hr.base);
easNames.importPackage(Packages.com.kingdee.eas.base.codingrule);
//获取服务端上下文
with(easNames){
    function getCurrentHrUnit(ctx,personId,attendDate){
        return AttendanceFileHISFactory.getLocalInstance(ctx).getAttendanceFileHISCollection(" where proposer.id='"+personId+"' and EFFDT <='"+attendDate+"' and LEFFDT >='"+attendDate+"' and attendFileState='1' order by effdt desc ");
    }
    var resultMap = new HashMap();
    var ctx = context.getBosContext();
    //封装补签卡主表信息
    var fillSignCardInfo = new FillSignCardInfo();
    var fillSignCardType = FillSignCardType.getEnum(FillSignCardType.FILLCARD_VALUE);
    //申请人
    var personInfo = SHRBillUtil.getCurrPersonInfoNew(ctx);
    var personId = personInfo.getId().toString();
    //var attendanceFileInfo = AttendanceFileFactory.getLocalInstance(ctx).getAttendanceFileCollection(" where proposer.id='"+personId+"' and attendFileState='1' ").get(0);
    //职位
    var personPositionInfo = SHRBillUtil.getAdminOrgUnit(personId.toString(),ctx);
    //var hrUnitId = TimeUtil.getHRUnitId(ctx);
    var hrUnit = null;
    var adminOrgUnit = null;
    var attAdminOrgUnit = null;
    var positionInfo = null;
    var codingRuleManager = CodingRuleManagerFactory.getLocalInstance(ctx);
    var billNumber = NumberCodeRule.readCodeRuleNumber(fillSignCardInfo,NumberCodeRule.getMainOrgByCu(ctx),ctx);
    if(org.apache.commons.lang.StringUtils.isNotBlank(billNumber)){
        fillSignCardInfo.setNumber(billNumber);
    }else{
        billNumber = "M-BQK"+com.kingdee.util.DateTimeUtils.format(new Date(),"yyyyMMdd")+System.currentTimeMillis();
        fillSignCardInfo.setNumber(billNumber);
    }
    fillSignCardInfo.setBillState(HRBillStateEnum.SUBMITED);
    fillSignCardInfo.setAdminOrg(personPositionInfo.getPersonDep());
    fillSignCardInfo.setProposer(personInfo);
    fillSignCardInfo.setApplyDate(new Date());
    //补签卡分录信息
    var i = 0;
    while(true){
        var param = null;
        try{
            param = context.getParamAsMap(i);
        }catch(e){

        }
        if(param!=null){
            i++;
            var filecardTimeString = param.get("filecardTimeString")+":00";
            var fillcardReason = param.get("fillcardReason");
            var fillcardRemark = param.get("fillcardRemark");
            var fillcardDate = param.get("filecardTimeString").substring(0,10);
            var filecardTime = param.get("filecardTimeString").substring(11);
            var billId = param.get("billId");

            var nowTime =  param.get("nowTime");
            var attendDate = HRTimeWebUtils.stringToShortDate(fillcardDate);
            var fillSignCardEntryInfo = new FillSignCardEntryInfo();
            var reason = null;
            var fillSignReason = FillSignReasonFactory.getLocalInstance(ctx);
            var sql = "where name='"+fillcardReason+"'and state=1 ";
            var fillSignReasonCollection = fillSignReason.getFillSignReasonCollection(sql);

            var attendanceFileHISColl = getCurrentHrUnit(ctx,personId,fillcardDate);
            if(null === attendanceFileHISColl || attendanceFileHISColl.size() === 0){
                errorMsg = "找不到考勤业务组织!";
                throw errorMsg;
            }else {
                if(attendanceFileHISColl.size() > 1){
                    errorMsg = "不能跨考勤业务组织申请出差单!";
                    throw errorMsg;
                }else if(attendanceFileHISColl.get(0) !== null){
                    var attendanceFileHIS = attendanceFileHISColl.get(0);
                    if(attendanceFileHIS.isAttendance.toString().equals("否")){
                        resultMap.put("msg","考勤档案已设置不需要打卡考勤!");
                        throw resultMap;
                    }
                    hrUnit = attendanceFileHIS.getHrOrgUnit();
                    adminOrgUnit = attendanceFileHIS.getAdminOrgUnit();
                    attAdminOrgUnit = attendanceFileHIS.getAttAdminOrgUnit();
                    positionInfo = attendanceFileHIS.getPosition();
                }
            }

            /*
              if(null === hrUnit){
                hrUnit = getCurrentHrUnit(ctx,personId,fillcardDate);
              }else {
                var entry_hrUnit = getCurrentHrUnit(ctx,personId,fillcardDate);
                if(entry_hrUnit === null || !entry_hrUnit.getId().toString().equals(hrUnit.getId().toString())){
                   resultMap.put("msg","不允许跨业务组织申请补签卡业务！");
                  throw resultMap;
                }
              }
              */

            // resultMap.put("msg",fillSignReasonCollection.get(0));
            //  throw resultMap;
            if(fillSignReasonCollection==null||fillSignReasonCollection.isEmpty()){
                fillSignReasonCollection = fillSignReason.getFillSignReasonCollection(" where state=1 ");
            }
            if(fillSignReasonCollection!=null&&!fillSignReasonCollection.isEmpty()){
                reason = fillSignReasonCollection.get(0);
            }
            var ts = com.kingdee.eas.hr.ats.util.AtsDateUtils.stringToTimestamp(filecardTimeString);
            var isAdvanceAllow = false;
            try{
                isAdvanceAllow = reason.isIsAdvanceAllow();

            }catch(e){

            }
            if(!isAdvanceAllow) {
                if( ts.getTime() > new Date().getTime() ){
                    resultMap.put("msg","该补签卡原因不允许提前申请补签卡业务！");
                    throw resultMap;
                }
            }

            if(reason!=null){
                var r = new FillSignReasonInfo();
                r.setName(reason.getName());
                r.setId(reason.getId());
                fillSignCardEntryInfo.setReason(r);
            }

            //重复数据判断：同一个人且同时间点
            var fillCardTimeStrsSB = new StringBuilder("''");
            fillCardTimeStrsSB.append(",'"+filecardTimeString+"'");
            var sql = "select t.fnumber,e.fattenddate,e.fillcardtimestr,e.fillcardtime,t.fid as leaveBillId,e.fid from t_Hr_Ats_Fillsigncardentry e , T_HR_ATS_FillSignCard t"
                + " where e.fbillid=t.fid and e.FPERSONID='"+personId+"' "
                + " and to_Char(e.FILLCARDTIME,'yyyy-mm-dd hh24:mi:ss') in ("+fillCardTimeStrsSB.toString()+") "
                + " and t.fbillstate != 4 and t.fbillstate != 0";
            var infoSB = new StringBuilder();
            var row =  DbUtil.executeQuery(ctx,sql);
            while(row.next()){
                var time = row.getString("fillcardtime");
                time = time.substring(0,16);
                var number = row.getString("fnumber");
                var id = row.getString("fid");
                var leaveBillId = row.getString("leaveBillId");

                //针对编辑剔除自己
                if(id!=null&&!id.equals("")){
                    if(billId!=null&&billId.equals(leaveBillId)){

                    }else{
                        if(null!=number){
                            resultMap.put("msg","单号为"+number+"的补签卡单，已存在"+time+"的补签卡数据");
                            throw resultMap;
                        }else{
                            resultMap.put("msg","已存在"+time+"的补签卡数据");
                            throw resultMap;
                        }
                    }
                }
            }
            if(infoSB.length()>0){
                resultMap.put("msg",infoSB.toString());
                throw resultMap;
            }
            var response ="" ;
            //判断是否能补签
            try{
                var  fillCardBillUtil = new AtsFillCardBillUtils();
                response = fillCardBillUtil.validData(ctx,personId,fillcardDate,"00:00:00","");
            }catch(e){

                //e.fillInStackTrace() ;
            }finally{
                // console.log("fillCardBillUtil.validData i="+i+ " personId" + personId + " fillcardDate" + fillcardDate + " " + response);
                resultMap.put("myMsg", "personId" + personId + " fillcardDate" + fillcardDate + " " + response);
                if(null != response && !response.equals("")){
                    resultMap.put("msg",response);
                    context.setResult(resultMap);
                    throw resultMap;
                }
            }
            //补卡分录
            fillSignCardEntryInfo.setPerson(personInfo);
            //fillSignCardEntryInfo.setAdminOrgUnit(personPositionInfo.getPersonDep());
            fillSignCardEntryInfo.setAdminOrgUnit(adminOrgUnit);
            fillSignCardEntryInfo.setAttAdminOrgUnit(attAdminOrgUnit);
            fillSignCardEntryInfo.setPosition(positionInfo);
            fillSignCardEntryInfo.setAttendDate(attendDate);
            fillSignCardEntryInfo.setRemark(fillcardRemark);
            fillSignCardEntryInfo.setType(fillSignCardType);
            fillSignCardEntryInfo.setFillCardTimeStr(filecardTime);
            fillSignCardEntryInfo.setFillCardTime(HRTimeWebUtils.stringToTimestamp(filecardTimeString));
            //补卡实体
            fillSignCardInfo.setHrOrgUnit(hrUnit);
            fillSignCardInfo.getEntries().add(fillSignCardEntryInfo);
        }else{
            break;
        }
    }
    //校验补卡次数是否超限
    var billBizUtil = new BillBizUtil();
    //8.2客户报错，暂时注释掉，等sp1再改回来
    var fSCTimesControlResult ="";
    try{
        fSCTimesControlResult = billBizUtil.fillSignCradTimesControl(ctx,fillSignCardInfo);
    }catch(e){

    }finally{
        if(fSCTimesControlResult.length() > 0){
            if(fSCTimesControlResult.indexOf("。") > -1){
                fSCTimesControlResult = fSCTimesControlResult.split("。")[0];
            }
            resultMap.put("msg",fSCTimesControlResult);
            context.setResult(resultMap);
            throw resultMap;
        }
    }
    //FillSignCardFactory.getLocalInstance(ctx).submit(fillSignCardInfo);
    resultMap.put("msg","提交成功");
    resultMap.put("fillSignCardInfo",fillSignCardInfo);
    context.setResult(resultMap);
}


