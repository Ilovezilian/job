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
easNames.importPackage(Packages.com.kingdee.bos.util);
easNames.importPackage(Packages.com.kingdee.bos.dao.ormapping);

//获取服务端上下文
with(easNames){
    var ctx = context.getBosContext();
    var paramLength = context.getParamCount();
    var personInfo = com.kingdee.eas.hr.ats.lightapp.util.SHRBillUtil.getCurrPersonInfoNew(ctx);
    var personId = personInfo.getId().toString();
    var resultMap = new java.util.HashMap();
    var hrOrgUnit = null;
    var adminOrgUnit = null;
    var atsOverTimeBillEditHandler = new  com.kingdee.eas.hr.ats.lightapp.util.AtsOverTimeBillEditHandler();

    var otDateFileHis = context.getParamAsMap(0).get("otDate");
    var attendanceFileHISColl = AttendanceFileHISFactory.getLocalInstance(ctx).getAttendanceFileHISCollection(" where proposer.id='"+personId+"' and (EFFDT <='"+otDateFileHis+"' and LEFFDT >='"+otDateFileHis+"') and attendFileState='1' order by effdt desc ");
    if(null === attendanceFileHISColl || attendanceFileHISColl.size() === 0){
        throw "找不到考勤业务组织!";
    }else {
        hrOrgUnit = attendanceFileHISColl.get(0).getHrOrgUnit();
        adminOrgUnit = attendanceFileHISColl.get(0).getAdminOrgUnit();
    }

    //加班单主表实体
    var atsOverTimeBillInfo = new AtsOverTimeBillInfo();
    atsOverTimeBillInfo.setProposer(personInfo);
    atsOverTimeBillInfo.setHrOrgUnit(hrOrgUnit);
    for(var i = 0;i<paramLength;i++){
        var param = context.getParamAsMap(i);
        //加班单分录实体
        var atsOverTimeBillEntryInfo = new AtsOverTimeBillEntryInfo();

        var otDate = param.get("otDate");
        var realStartTime = param.get("realStartTime");
        var realEndTime = param.get("realEndTime");
        var restTime = param.get("restTime");
        var applyOTTime = param.get("applyOTTime");
        var otType = param.get("otType");
        var otReason = param.get("otReason");
        var otCompens = param.get("otCompens");
        var description = param.get("description");


        atsOverTimeBillEntryInfo.setStartTime(HRTimeWebUtils.stringToTimestamp(realStartTime));
        atsOverTimeBillEntryInfo.setEndTime(HRTimeWebUtils.stringToTimestamp(realEndTime));
        atsOverTimeBillEntryInfo.setRealStartTime(HRTimeWebUtils.stringToTimestamp(realStartTime));
        atsOverTimeBillEntryInfo.setRealEndTime(HRTimeWebUtils.stringToTimestamp(realEndTime));
        atsOverTimeBillEntryInfo.setRestTime(Integer.parseInt(restTime));
        atsOverTimeBillEntryInfo.setApplyOTTime(new BigDecimal(applyOTTime));
        atsOverTimeBillEntryInfo.setRealOTTime(new BigDecimal(applyOTTime));
        atsOverTimeBillEntryInfo.setOtDate(HRTimeWebUtils.stringToShortDate(otDate));
        atsOverTimeBillEntryInfo.setPerson(personInfo);
        atsOverTimeBillEntryInfo.setDescription(description);
        atsOverTimeBillEntryInfo.setAdminOrgUnit(adminOrgUnit);

        //加班类型
        var overTimeTypeCollection = OverTimeTypeFactory.getLocalInstance(ctx).getOverTimeTypeCollection("where id='"+otType+"'");
        if(overTimeTypeCollection.size() > 0){
            atsOverTimeBillEntryInfo.setOtType(overTimeTypeCollection.get(0));
        }

        //加班原因
        if(otReason != null && otReason != ''){
            var overTimeReasonCollection = OverTimeReasonFactory.getLocalInstance(ctx).getOverTimeReasonCollection("where id='"+otReason+"'");
            if(overTimeReasonCollection.size() > 0){
                atsOverTimeBillEntryInfo.setOtReason(overTimeReasonCollection.get(0));
            }
        }

        //加班补偿方式
        var overTimeCompensCollection = OverTimeCompensFactory.getLocalInstance(ctx).getOverTimeCompensCollection("where id='"+otCompens+"'");
        if(overTimeCompensCollection.size() > 0){
            atsOverTimeBillEntryInfo.setOtCompens(overTimeCompensCollection.get(0));
        }
        //检查是否超过调休假
        if(otCompens.equalsIgnoreCase("AERg0TIcSnaM40EKvJCdRKlrTmA=")){
            var res = new HashMap();
            var atsOverTimeHelper = com.kingdee.eas.hr.ats.lightapp.util.AtsOverTimeBillMobileHelper();
            res =  atsOverTimeHelper.checkMaxQuotaCore(ctx,personId,otDate,applyOTTime);
            if(null != res.get("resFlag") && res.get("resFlag").toString().equalsIgnoreCase("false")){
                resMsg = res.get("resMsg").toString();
                // throw resMsg;
                resultMap.put("errorMsg",resMsg);
                throw resMsg;
            }
        }
        //添加分录
        atsOverTimeBillInfo.getEntries().add(atsOverTimeBillEntryInfo);
    }

    //如果系统启用了加班管控 则需要校验管控规则
    if(SHRBillServerUtil.overTimeControl(personId,otDate,ctx)){
        //返回的错误信息
        var BillBizUtil = new BillBizUtil();
        resMsg = BillBizUtil.checkOTLimit(ctx,atsOverTimeBillInfo)+"";
        if(resMsg!=""){
            resultMap.put("errorMsg",resMsg);
            context.setResult(resMsg);
        }
    }
    var checkMap = atsOverTimeBillEditHandler.checkOTBatchBill(ctx,atsOverTimeBillInfo);
    context.setResult(checkMap);
}
