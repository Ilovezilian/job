//变动规则考勤js
shr.defineClass("shr.ats.AtsPCRuleSetForAttEdit", shr.ats.AtsPCRuleSetEdit, {
	initalizeDOM : function () {
		var _self = this;
		shr.ats.AtsPCRuleSetForAttEdit.superClass.initalizeDOM.call(this);
		if(_self.getOperateState() == 'ADDNEW'){
			$("#bizManageType_id").val('a1XVAx7aQEiqGkQqicFzfmWJ1dE=');
			$("#isLeaveDelSchedule").shrCheckbox("check");	
			$("#isLeaveDelResult").shrCheckbox("check");	
		}
		if(_self.getOperateState() == 'ADDNEW'||'EDIT'){
			var title = jsBizMultLan.atsManager_atsPCRuleSetForAttEdit_i18n_2;
			$("#isCreateFileByEMP").parents('.field-ctrl').siblings('.col-lg-4').find('.field_label').attr("title",title);
			$("#isCreateFileByEMP").parent().attr("title",title);
			title = jsBizMultLan.atsManager_atsPCRuleSetForAttEdit_i18n_1;
			$("#isLeaveDelSchedule").parents('.field-ctrl').siblings('.col-lg-4').find('.field_label').attr("title",title);
			$("#isLeaveDelSchedule").parent().attr("title",title);
			title = jsBizMultLan.atsManager_atsPCRuleSetForAttEdit_i18n_0;
			$("#isLeaveDelResult").parents('.field-ctrl').siblings('.col-lg-4').find('.field_label').attr("title",title);
			$("#isLeaveDelResult").parent().attr("title",title);
		}
	}
	,viewAction: function(billId) {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsPCRuleForAtt.form',
			relatedFieldId: billId,
			tab: 1,
			method: 'initalizeData'
		});	
	}
});

