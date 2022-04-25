shr.defineClass("shr.ats.LimitFormulaEdit", shr.framework.Edit, {
	
	viewAction: function(billId) {
		this.reloadPage({uipk: 'com.kingdee.eas.hr.ats.app.HolidayRule.formula',billId: billId,tab: 1,method: 'initalizeData'});	
	}
})