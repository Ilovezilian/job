//
var easNames = JavaImporter();
easNames.importPackage(Packages.com.kingdee.shr.base.syssetting.app.osf);
with(easNames){
    var serviceName = "getSimpleSubOrgService";
    var ctx = context.getBosContext();
    var param = context.getParamAsMap(0);
    var result = OSFAppUtil.callService(ctx,serviceName,param);
    var list = result.get("subOrg");

    if(list.size() > 1){
        var orgIds = "('" + list.get(0).get("subOrgId") + "','" + list.get(1).get("subOrgId") + "')";

        var sql = "select flongNumber from t_org_Admin where fid in " + orgIds ;
        var row =  com.kingdee.eas.util.app.DbUtil.executeQuery(ctx, sql);
        var numList = new java.util.ArrayList();
        while(row.next()){
            var longNumber = row.getString("flongNumber");
            numList.add(longNumber);
        }

        if(numList.size() > 1){
            if(numList.get(0).indexOf(numList.get(1)) > -1 || numList.get(1).indexOf(numList.get(0)) > -1){
                list.remove(0);
                result.put("subOrg",list);
            }
        }
        for(var i = 1;i<list.size();i ++){
            if(list.get(0).get("subOrgId").toString() == list.get(i).get("subOrgId").toString()){
                list.remove(0);
                result.put("subOrg",list);
                break;
            }
        }
    }

    context.setResult(result);
}
