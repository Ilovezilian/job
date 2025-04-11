var easNames = JavaImporter();//定义引入变量
easNames.importPackage(Packages.com.kingdee.shr.base.syssetting.app.osf);
easNames.importPackage(Packages.com.kingdee.eas.hr.base);
easNames.importPackage(Packages.com.kingdee.eas.hr.ats.lightapp.util);
easNames.importPackage(Packages.com.kingdee.eas.hr.emp);
easNames.importPackage(Packages.com.kingdee.eas.util.app);
easNames.importPackage(Packages.com.kingdee.eas.hr.base.util);
easNames.importPackage(Packages.java.lang);
easNames.importPackage(Packages.java.math);
easNames.importPackage(Packages.java.util);
easNames.importPackage(Packages.org.apache.commons.lang);
easNames.importPackage(Packages.com.kingdee.eas.basedata.person);
easNames.importPackage(Packages.com.kingdee.eas.hr.ats);
easNames.importPackage(Packages.com.kingdee.eas.hr.ats.util);
easNames.importPackage(Packages.com.kingdee.eas.basedata.org);

//获取服务端上下文
with(easNames){
    function getCurrentHrUnit(ctx,personId,startDate,endDate){
        return AttendanceFileHISFactory.getLocalInstance(ctx).getAttendanceFileHISCollection(" where proposer.id='"+personId+"' and ((EFFDT <='"+startDate+"' and LEFFDT >='"+startDate+"') or (EFFDT <='"+endDate+"' and LEFFDT >='"+endDate+"')) and attendFileState='1' order by effdt desc ");
    }
    var result = new HashMap();

    var ctx = context.getBosContext();
    var param = context.getParamAsMap(0);
    var tripStartTime = param.get("tripStartTime");//.toString(); //出差开始时间
    var tripEndTime = param.get("tripEndTime");//.toString();//出差结束时间
    var tripType = param.get("tripType");//.toString(); //出差类型
    var tripStartPlace = param.get("tripStartPlace");//.toString();//出发地点
    var tripEndPlace = param.get("tripEndPlace");//.toString();//目的地点
    var tripStartTransport = param.get("tripStartTransport");//交通工具去程
    var tripEndTransport = param.get("tripEndTransport");//交通工具返程
    var tripDays = param.get("tripDays");//.toString();//出差天数
    var tripReason = param.get("tripReason");//.toString();//出差原因
    var id = param.get("id");//.toString();//出差单id
    var nowDate = DateTimeUtils.truncateDate(new Date());
    var atsTripBillUtils = new AtsTripBillUtils();
    var atsTripBillInfo1 = new AtsTripBillInfo();
    var atsTripBillInfo = new HashMap();
    var shrBillUtil = new SHRBillUtil();
    var personInfo = SHRBillUtil.getCurrPersonInfoNew(ctx);
    var personId = personInfo.getId().toString();
    var personPositionInfo = SHRBillUtil.getAdminOrgUnit(personId,ctx);

    atsTripBillInfo1.setProposer(personInfo);//申请人
    atsTripBillInfo1.setApplyDate(nowDate);//申请日期
    atsTripBillInfo1.setAdminOrg(personPositionInfo.getPersonDep());//行政组织
    atsTripBillInfo.put("proposer",personInfo);//申请人
    atsTripBillInfo.put("applyDate",nowDate);//申请日期
    atsTripBillInfo.put("adminOrg",personPositionInfo.getPersonDep());//行政组织
    var errorMsg = new java.lang.String("");
    //var hrInfo = ContextUtil.getCurrentHRUnit(ctx);
    var hrInfo = "";
    var adminOrgUnit = null;
    var attAdminOrgUnit = null;
    var attendanceFileHISColl = getCurrentHrUnit(ctx,personId,tripStartTime.substring(0,10),tripEndTime.substring(0,10));
    if(null === attendanceFileHISColl || attendanceFileHISColl.size() === 0){
        errorMsg = "找不到考勤业务组织!";
        throw errorMsg;
    }else {
        if(attendanceFileHISColl.size() > 0 && attendanceFileHISColl.get(0) !== null){
            var attendanceFileHIS = attendanceFileHISColl.get(0);
            hrInfo = attendanceFileHIS.getHrOrgUnit();
            adminOrgUnit = attendanceFileHIS.getAdminOrgUnit();
            attAdminOrgUnit = attendanceFileHIS.getAttAdminOrgUnit();
        }
    }
    atsTripBillInfo1.setHrOrgUnit(hrInfo);//hr组织
    atsTripBillInfo1.setBizDate(nowDate);//业务时间
    atsTripBillInfo1.setBillType(BillSubmitTypeEnum.common);//提交方式
    atsTripBillInfo.put("hrOrgUnit",hrInfo);//hr组织
    atsTripBillInfo.put("bizDate",nowDate);//业务时间
    atsTripBillInfo.put("billType",BillSubmitTypeEnum.common);//提交方式

    //判断时间重叠
    var leaveType = id;
    var res = new HashMap();
    res = atsTripBillUtils.getDateOverlappingData(ctx, personId, tripStartTime, tripEndTime, leaveType);
    var addFlag = res.get("addFlag");
    if(res != null && addFlag > 0){
        errorMsg = "在编号为" + res.get("billNo") + "]的出差单中,存在时间重叠的记录：[" + res.get("personName") + ",开始时间：" + res.get("tripBeginDate") + " 结束时间：" + res.get("tripEndDate") + " ]";
        result.put("errorMsg",errorMsg);
        context.setResult(result);
    }else{
        //判断是否能补出差单
        errorMsg = atsTripBillUtils.validData(ctx,personId,tripStartTime,tripEndTime,"");
        var tripBill = new AtsTripBillInfo();
        if(errorMsg.length()<= 0){
            var billNumber = "";
            try{
                billNumber = NumberCodeRule.readCodeRuleNumber(tripBill, NumberCodeRule.getMainOrgByCu(ctx),ctx);
            }catch(e){
                throw e;
            }
            if (org.apache.commons.lang.StringUtils.isNotBlank(billNumber)) {

                atsTripBillInfo1.setNumber(billNumber);
                atsTripBillInfo.put("number",billNumber);
            }else{
                var empNumber = ContextUtil.getCurrentUserInfo(ctx).getPerson().getNumber();
                billNumber = "M-"+empNumber+"-"+ DateTimeUtils.format(new Date(), "yyyyMMddHHmmss");

                atsTripBillInfo1.setNumber(billNumber);
                atsTripBillInfo.put("number",billNumber);
            }
            //分录信息
            var  entryInfo1 = new AtsTripBillEntryInfo();
            var  entryInfo = new HashMap();

            //entryInfo1.setAdminOrgUnit(personPositionInfo.getPersonDep());	//执行人所在部门
            entryInfo1.setAdminOrgUnit(adminOrgUnit);	//执行人所在部门
            entryInfo1.setPerson(personInfo);								//事务执行人(如加班人、出差人等)
            entryInfo1.setPosition(personPositionInfo.getPrimaryPosition()); //执行人职位-在分录上边
            entryInfo1.setTripStartPlace(tripStartPlace);
            entryInfo1.setTripEndPlace(tripEndPlace);
            entryInfo1.setTripStartTransport(tripStartTransport);
            entryInfo1.setTripEndTransport(tripEndTransport);
            //entryInfo.put("adminOrgUnit",personPositionInfo.getPersonDep());	//执行人所在部门
            entryInfo.put("adminOrgUnit",adminOrgUnit);	//执行人所在部门
            entryInfo.put("attAdminOrgUnit",attAdminOrgUnit);			//考勤地点
            entryInfo.put("person",personInfo);								//事务执行人(如加班人、出差人等)
            entryInfo.put("position",personPositionInfo.getPrimaryPosition()); //执行人职位-在分录上边
            entryInfo.put("tripStartPlace",tripStartPlace);
            entryInfo.put("tripEndPlace",tripEndPlace);
            entryInfo.put("tripStartTransport",tripStartTransport);
            entryInfo.put("tripEndTransport",tripEndTransport);

            if(!tripType.equals("")){
                //出差类型
                var tripTypeCollection = TripTypeFactory.getLocalInstance(ctx).getTripTypeCollection(" where id = '" + tripType + "'");
                if(tripTypeCollection != null && tripTypeCollection.size() > 0){
                    entryInfo1.setTripType(tripTypeCollection.get(0));
                    entryInfo.put("tripType",tripTypeCollection.get(0));
                }
            }

            entryInfo1.setTripStartTime(HRTimeWebUtils.stringToTimestamp(tripStartTime));
            entryInfo1.setTripEndTime(HRTimeWebUtils.stringToTimestamp(tripEndTime));
            entryInfo1.setTripDays(new BigDecimal(tripDays));
            entryInfo1.setTripReason(tripReason != null ? tripReason : "");
            entryInfo.put("tripStartTime",HRTimeWebUtils.stringToTimestamp(tripStartTime));
            entryInfo.put("tripEndTime",HRTimeWebUtils.stringToTimestamp(tripEndTime));
            entryInfo.put("tripDays",new BigDecimal(tripDays));
            entryInfo.put("tripReason",tripReason);

            atsTripBillInfo1.getEntries().add(entryInfo1);
            atsTripBillInfo.put("entries",entryInfo);

            atsTripBillInfo1.setBillState(HRBillStateEnum.SUBMITED);//提交未审批
            atsTripBillInfo.put("billState",HRBillStateEnum.SUBMITED);//提交未审批

            atsTripBillInfo1.setExtendedProperty("isAddNew", "isAddNew");//移动只有新增提交，没有从保存的编辑提交
            //保存到数据库
            //AtsTripBillFactory.getLocalInstance(ctx).submit(atsTripBillInfo);
            result = atsTripBillInfo;
        }else{
            result.put("errorMsg",errorMsg);
        }
        context.setResult(result);
    }

}

