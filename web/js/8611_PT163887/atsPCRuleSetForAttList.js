//变动规则考勤js
shr.defineClass("shr.ats.AtsPCRuleSetForAttList", shr.ats.AtsPCRuleSetList, {
	initalizeDOM : function () {
		shr.ats.AtsPCRuleSetForAttList.superClass.initalizeDOM.call(this);
	}
	,viewAction: function(billId) {
		
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsPCRuleForAtt.form',
			billId: billId,
			relatedFieldId: billId,
			tab:1,
			method: 'initalizeData'
		});			
		
	}
	,addNewAction: function() {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsPCRuleSet.form',
			method: 'addNew'
		});			
	}
});

