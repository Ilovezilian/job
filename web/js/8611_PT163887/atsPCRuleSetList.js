//变动规则基类js
shr.defineClass("shr.ats.AtsPCRuleSetList", shr.framework.List, {
	initalizeDOM : function () {
		shr.ats.AtsPCRuleSetList.superClass.initalizeDOM.call(this);
		
	},
	enableAction : function() {
		var clz = this;
		var hasConfirm=false;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_atsPCRuleSetList_i18n_4});
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
		shr.showConfirm(jsBizMultLan.atsManager_atsPCRuleSetList_i18n_2, function(){
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
			shr.showWarning({message : jsBizMultLan.atsManager_atsPCRuleSetList_i18n_4});
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
		shr.showConfirm(jsBizMultLan.atsManager_atsPCRuleSetList_i18n_1, function(){
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
			shr.showWarning({message : jsBizMultLan.atsManager_atsPCRuleSetList_i18n_4});
			return;
		}
		var bills;
		var selectedIds = $("#grid").jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			for (var i = 0;i<selectedIds.length; i++) {
				var item = selectedIds[i];
				var data = $("#grid").jqGrid("getRowData", item);
				var confirmState=data["state"];
				if(confirmState ==0 || confirmState ==2){
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
				}
				if(confirmState ==1){
				hasConfirm=true;
				}
//				if(confirmState ==2){
//				hasConfirms=true;
//				}
			}
		}
		if(hasConfirm){
		shr.showWarning({message : jsBizMultLan.atsManager_atsPCRuleSetList_i18n_0});
		return;
		}
//		if(hasConfirms){
//		shr.showWarning({message : '"禁用"状态的记录不能删除'});
//		return;
//		}
		shr.showConfirm(jsBizMultLan.atsManager_atsPCRuleSetList_i18n_3, function(){
			clz.doRemoteWithBatchAction({
				method: "deletes",
				billId: bills
			});
		});	
	},viewAction: function(billId) {
		if($('#selectOk1').size()>0){
		
		}else{
			this.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.AtsPCRule.form',
				billId: billId,
				relatedFieldId: billId,
				tab: 1,
				method: 'initalizeData'
			});			
		}
	}
});

