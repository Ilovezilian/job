var easNames = JavaImporter();//定义引入变量
easNames.importPackage(Packages.com.kingdee.shr.base.syssetting.app.osf);
easNames.importPackage(Packages.com.kingdee.eas.hr.base);
easNames.importPackage(Packages.com.kingdee.eas.hr.ats.lightapp.util);
easNames.importPackage(Packages.com.kingdee.eas.hr.emp);
easNames.importPackage(Packages.com.kingdee.eas.util.app);
easNames.importPackage(Packages.com.kingdee.eas.hr.base.util);
easNames.importPackage(Packages.java.lang);
easNames.importPackage(Packages.java.math);
easNames.importPackage(Packages.org.apache.commons.lang);
easNames.importPackage(Packages.com.kingdee.eas.basedata.person);
easNames.importPackage(Packages.com.kingdee.eas.hr.ats);
easNames.importPackage(Packages.com.kingdee.eas.hr.ats.util);
easNames.importPackage(Packages.com.kingdee.eas.basedata.org);

//获取服务端上下文
with(easNames){
    function getCurrentHrUnit(ctx,personId,startDate,endDate){
        return AttendanceFileHISFactory.getLocalInstance(ctx).getAttendanceFileHISCollection("select hrOrgUnit where proposer.id='"+personId+"' and ((EFFDT <='"+startDate+"' and LEFFDT >='"+startDate+"') or (EFFDT <='"+endDate+"' and LEFFDT >='"+endDate+"')) and attendFileState='1' order by effdt desc ");
    }
    var result = new HashMap();

    var ctx = context.getBosContext();
    var param = context.getParamAsMap(0);
    //var result = OSFAppUtil.callService(ctx,serviceName,param);
    var tripStartTime = param.get("tripStartTime").toString(); //出差开始时间
    var tripEndTime = param.get("tripEndTime").toString();//出差结束时间
    var tripType = param.get("tripType").toString(); //出差类型
    var tripStartPlace = param.get("tripStartPlace").toString();//出发地点
    var tripEndPlace = param.get("tripEndPlace").toString();//目的地点
    var tripDays = param.get("tripDays").toString();//出差天数
    var tripReason = param.get("tripReason").toString();//出差原因
    var nowDate = DateTimeUtils.truncateDate(new Date());

    var atsTripBillUtils = new AtsTripBillUtils();
    var atsTripBillInfo = new AtsTripBillInfo();

    var shrBillUtil = new SHRBillUtil();
    var personInfo = SHRBillUtil.getCurrPersonInfoNew(ctx);
    var personId = personInfo.getId().toString();
    var personPositionInfo = SHRBillUtil.getAdminOrgUnit(personId,ctx);
    atsTripBillInfo.setProposer(personInfo);//申请人
    atsTripBillInfo.setApplyDate(nowDate);//申请日期
    atsTripBillInfo.setAdminOrg(personPositionInfo.getPersonDep());//行政组织
    //var hrInfo = ContextUtil.getCurrentHRUnit(ctx);
    var hrInfo = "";
    var attendanceFileHISColl = getCurrentHrUnit(ctx,personId,realStartTime.substring(0,10),realEndTime.substring(0,10));
    if(null === attendanceFileHISColl || attendanceFileHISColl.size() === 0){
        errorMsg = "找不到考勤业务组织!";
        throw errorMsg;
    }else {
        if(attendanceFileHISColl.size() > 1){
            errorMsg = "不能跨考勤业务组织申请出差单!";
            throw errorMsg;
        }else if(attendanceFileHISColl.get(0) !== null){
            var attendanceFileHIS = attendanceFileHISColl.get(0);
            hrInfo = attendanceFileHIS.getHrOrgUnit();
        }
    }
    atsTripBillInfo.setHrOrgUnit(hrInfo);//hr组织
    atsTripBillInfo.setHrOrgUnit(hrInfo);//hr组织
    atsTripBillInfo.setBizDate(nowDate);//业务时间
    atsTripBillInfo.setBillType(BillSubmitTypeEnum.common);//提交方式


    var errorMsg = "";
    //判断时间重叠
    var leaveType = null;
    var res = atsTripBillUtils.getDateOverlappingData(ctx, personId, tripStartTime, tripEndTime, leaveType);
    var addFlag = res.get("addFlag");
    if(res != null && res.size() > 0 && addFlag > 0){
        errorMsg = "在编号为" + res.get("billNo") + "]的出差单中,存在时间重叠的记录：[" + res.get("personName") + ",开始时间：" + res.get("tripBeginDate") + " 结束时间：" + res.get("tripEndDate") + " ]";
        throw errorMsg;
        //result.put("errorMsg",errorMsg);
        //context.setResult(result);
    }

    var tripBill = new AtsTripBillInfo();
    if(errorMsg.length() <= 0){
        var billNumber = NumberCodeRule.readCodeRuleNumber(tripBill, NumberCodeRule.getMainOrgByCu(ctx),ctx);
        if (org.apache.commons.lang.StringUtils.isNotBlank(billNumber)) {
            atsTripBillInfo.setNumber(billNumber);
        }else{
            var empNumber = ContextUtil.getCurrentUserInfo(ctx).getPerson().getNumber();
            billNumber = "M-"+empNumber+"-"+ DateTimeUtils.format(new Date(), "yyyyMMddHHmmss");
            atsTripBillInfo.setNumber(billNumber);
        }
        //分录信息
        var  entryInfo = new AtsTripBillEntryInfo();
        entryInfo.setAdminOrgUnit(personPositionInfo.getPersonDep());	//执行人所在部门
        entryInfo.setPerson(personInfo);								//事务执行人(如加班人、出差人等)
        entryInfo.setPosition(personPositionInfo.getPrimaryPosition()); //执行人职位-在分录上边
        entryInfo.setTripStartPlace(tripStartPlace);
        entryInfo.setTripEndPlace(tripEndPlace);
        //出差类型
        var tripTypeCollection = TripTypeFactory.getLocalInstance(ctx).getTripTypeCollection(" where id = '" + tripType + "'");
        if(tripTypeCollection != null && tripTypeCollection.size() > 0){
            entryInfo.setTripType(tripTypeCollection.get(0));
        }
        entryInfo.setTripStartTime(HRTimeWebUtils.stringToTimestamp(tripStartTime));
        entryInfo.setTripEndTime(HRTimeWebUtils.stringToTimestamp(tripEndTime));
        entryInfo.setTripDays(new BigDecimal(tripDays));
        entryInfo.setTripReason(tripReason);
        atsTripBillInfo.getEntries().add(entryInfo);

        atsTripBillInfo.setBillState(HRBillStateEnum.SUBMITED);//提交未审批
        atsTripBillInfo.setExtendedProperty("isAddNew", "isAddNew");//移动只有新增提交，没有从保存的编辑提交
        //保存到数据库
        AtsTripBillFactory.getLocalInstance(ctx).submit(atsTripBillInfo);
    }
    //result.put("errorMsg",errorMsg);
    context.setResult(result);
}

