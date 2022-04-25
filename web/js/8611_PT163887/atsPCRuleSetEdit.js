//变动规则基类js
shr.defineClass("shr.ats.AtsPCRuleSetEdit", shr.framework.Edit, {
	initalizeDOM : function () {
		shr.ats.AtsPCRuleSetEdit.superClass.initalizeDOM.call(this);
		var _self = this;
		if(_self.getOperateState() == 'ADDNEW'){
			$("#isCreateFileByEMP").shrCheckbox("check");			
		}
		if(_self.getOperateState() == 'ADDNEW' || _self.getOperateState() == 'EDIT'){
			$("#creator_name").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#createTime").closest('div[data-ctrlrole="labelContainer"]').hide();
		}
		if(_self.getOperateState() == 'EDIT'){
			$('#hrOrgUnit').shrPromptBox('disable');
		}
	},
	assembleSaveData: function(action) {
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		data.method = action;
		data.operateState = _self.getOperateState();
		data.model = shr.toJSON(_self.assembleModel()); 
		
		var modelTemp = shr.parseJSON(data.model);
		delete modelTemp.creator;//要把creator取代哦，否则修改的时候字段会被清空
		data.model = shr.toJSON(modelTemp);
		// relatedFieldId
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		
		return data;
	}
});

