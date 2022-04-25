//变动规则考勤js
shr.defineClass("shr.ats.atsSchedulePlanSetList",  shr.framework.List, {
	initalizeDOM : function () {
		shr.ats.atsSchedulePlanSetList.superClass.initalizeDOM.call(this);
		this.setMb();
	},setMb: function() {
		if($("#breadcrumb").children().length >=3){
		var list=document.getElementById("breadcrumb");
		list.removeChild(list.childNodes[1]);
		this.setMb();
		}
	}
	,addNewAction: function() {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsSchedulePlanSetAdd.form',
			method: 'addNew'
		});			
	},viewAction: function(billId) {
		
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsSchedulePlanSet.form',
			billId: billId,
			
			relatedFieldId: billId,
			tab:1,
			method: 'initalizeData'
		});			
		
	},
	enableAction : function() {
		var clz = this;
		var hasConfirm=false;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSetList_i18n_6});
			return;
		}
		var bills;
		var selectedIds = $("#grid").jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			for (var i = 0;i<selectedIds.length; i++) {
				var item = selectedIds[i];
				var data = $("#grid").jqGrid("getRowData", item);
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
			}
		}
		shr.showConfirm(jsBizMultLan.atsManager_atsSchedulePlanSetList_i18n_2, function(){
			clz.doRemoteWithBatchAction({
				method: "enables",
				billId: bills
			});
		});			
	},
	disableAction : function() {
		var clz = this;
		var hasConfirm=false;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSetList_i18n_6});
			return;
		}
		var bills;
		var selectedIds = $("#grid").jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			for (var i = 0;i<selectedIds.length; i++) {
				var item = selectedIds[i];
				var data = $("#grid").jqGrid("getRowData", item);
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
			}
		}
		shr.showConfirm(jsBizMultLan.atsManager_atsSchedulePlanSetList_i18n_1, function(){
			clz.doRemoteWithBatchAction({
				method: "disables",
				billId: bills
			});
		});			
	},
	deleteAction : function() {
		var clz = this;
		var hasConfirm=false;
		var hasConfirms=false;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSetList_i18n_6});
			return;
		}
		var bills;
		var selectedIds = $("#grid").jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			for (var i = 0;i<selectedIds.length; i++) {
				var item = selectedIds[i];
				var data = $("#grid").jqGrid("getRowData", item);
				var confirmState=data["state"];
				
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
				
				if(confirmState ==1){
				hasConfirm=true;
				}
			}
		}
	
		shr.showConfirm(jsBizMultLan.atsManager_atsSchedulePlanSetList_i18n_3, function(){
			clz.doRemoteWithBatchAction({
				method: "deletes",
				billId: bills
			});
		});	
	},
	automaticAction: function() {
		var clz = this;
		var hasConfirm=false;
		var hasConfirms=false;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSetList_i18n_6});
			return;
		}
		var bills;
		var selectedIds = $("#grid").jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			for (var i = 0;i<selectedIds.length; i++) {
				var item = selectedIds[i];
				var data = $("#grid").jqGrid("getRowData", item);
				var confirmState=data["state"];
				if(confirmState ==1 ){
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
				}
				if(confirmState !=1){
				hasConfirm=true;
				}
			}
		}
		if(hasConfirm){
		shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSetList_i18n_0});
		return;
		}
		
		clz.remoteCall({
			type:"post",
			method:"newAutoScheduleInstance",
			
			param:{billId:bills},
			async: false,
			success:function(res){
				var info =  res;
				if (info.error){
					shr.showError({message:jsBizMultLan.atsManager_atsSchedulePlanSetList_i18n_5+info.error,hideAfter: 50});
					
				}else{
					shr.showWarning({message:jsBizMultLan.atsManager_atsSchedulePlanSetList_i18n_4,hideAfter: 50});
				
				}	
				
			}
		});
	}
});

