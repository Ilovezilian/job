//变动规则假期js
shr.defineClass("shr.ats.AtsPCRuleSetForHolList", shr.ats.AtsPCRuleSetList, {
	initalizeDOM : function () {
		shr.ats.AtsPCRuleSetForHolList.superClass.initalizeDOM.call(this);
	}
	,addNewAction: function() {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsPCRuleSetForHol.form',
			method: 'addNew'
		});			
	}

});

