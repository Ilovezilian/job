shr.defineClass("shr.ats.AttCenterAdminOrgList", shr.framework.List, {
	
	
	initalizeDOM : function () {
		shr.ats.AttCenterAdminOrgList.superClass.initalizeDOM.call(this);
		var that = this;
		
	}
	,addNewAction:function(){
		var that = this;
		var attendCenterId=$('#attendCenterId').val();
		if(attendCenterId==''){
			return false;
		}
		$("#iframe1").attr("src",shr.getContextPath()+'/dynamic.do?method=initalize&checkLicense=true&uipk=shr.ats.adminOrgListForADC');
		$("#iframe1").dialog({
	 		 modal: true,
	 		 width:850,
	 		 minWidth:850,
	 		 height:500,
	 		 minHeight:500,
	 		 title:jsBizMultLan.atsManager_attCenterAdminOrgList_i18n_0,
	 		 open: function( event, ui ) {
	 		 },
	 		 close:function(){
				var url = $("#grid").getGridParam("url");
				$("#grid").jqGrid("option","datatype","json");
				if(that.defaultUrl == ""){
					that.defaultUrl = url;
				}
				$("#grid").setGridParam({
					url :  that.defaultUrl 
				});
				var myPostData={
					  attendCenterId:attendCenterId
					};
				$("#grid").jqGrid("option","page",1);
				$("#grid").jqGrid("option",'postData', myPostData);//postData来传递我们  定制的参数 jquery.jqGrid.extend.js
				$("#grid").jqGrid("reloadGrid");
	 		 }
 		});
    	$("#iframe1").attr("style","width:850px;height:500px;");
	}
	,viewAction: function(billId) {
		
	}
});	