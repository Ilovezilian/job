//变动规则假期js
shr.defineClass("shr.ats.AtsPCRuleSetForHolEdit", shr.ats.AtsPCRuleSetEdit, {
	initalizeDOM : function () {
		var _self = this;
		shr.ats.AtsPCRuleSetForHolEdit.superClass.initalizeDOM.call(this);
		if(_self.getOperateState() == 'ADDNEW'){
			$("#bizManageType_id").val('WMwl/vtBvkmbWdGELoP6Y2WJ1dE=');
			$("#isTransferReCal").shrCheckbox("check");	
			$("#isLeaveReCal").shrCheckbox("check");
		}
		if(_self.getOperateState() == 'ADDNEW'||'EDIT'){
			var title = jsBizMultLan.atsManager_atsPCRuleSetForHolEdit_i18n_2;
			$("#isCreateFileByEMP").parents('.field-ctrl').siblings('.col-lg-4').find('.field_label').attr("title",title);
			$("#isCreateFileByEMP").parent().attr("title",title);
			title = jsBizMultLan.atsManager_atsPCRuleSetForHolEdit_i18n_0;
			$("#isTransferReCal").parents('.field-ctrl').siblings('.col-lg-4').find('.field_label').attr("title",title);
			$("#isTransferReCal").parent().attr("title",title);
			title = jsBizMultLan.atsManager_atsPCRuleSetForHolEdit_i18n_1;
			$("#isLeaveReCal").parents('.field-ctrl').siblings('.col-lg-4').find('.field_label').attr("title",title);
			$("#isLeaveReCal").parent().attr("title",title);
		}
	}
	,viewAction: function(billId) {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsPCRule.form',
			relatedFieldId: billId,
			tab: 1,
			method: 'initalizeData'
		});		
	}
});

