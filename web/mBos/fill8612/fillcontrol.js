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
with (easNames) {
    var resultMap = new HashMap();
    var ctx = context.getBosContext();
    var response = "";
    //申请人
    var personInfo = SHRBillUtil.getCurrPersonInfoNew(ctx);
    var personId = personInfo.getId().toString();

    var i = 0;
    while (true) {
        var param = null;
        try {
            param = context.getParamAsMap(i);
        } catch (e) {

        }
        if (param == null) break;
        i ++;
        var fillcardDate = param.get("filecardTimeString").substring(0,10);

        //判断是否能补签
        try {
            var fillCardBillUtil = new AtsFillCardBillUtils();
            response = fillCardBillUtil.validData(ctx, personId, fillcardDate, "00:00:00", "");
        } catch (e) {
            //e.fillInStackTrace() ;
        } finally {
            resultMap.put("msg", response);
        }
    }
    context.setResult(resultMap);
}
