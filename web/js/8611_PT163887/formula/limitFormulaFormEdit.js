shr.defineClass("shr.ats.LimitFormulaFormEdit", shr.framework.MultiRow, {
	initalizeDOM : function(){
		shr.ats.LimitFormulaFormEdit.superClass.initalizeDOM.call(this);
		this.uuid && registFormulaFormService(this);
	}
	
	,editAction: function(e){
		if(e.currentTarget.id == 'edit'){
			return this.reloadPage({
				billId:	this.billId,
				method : "edit",
				uipk : 'com.kingdee.eas.hr.ats.app.HolidayRule.formula.add.form'
			});
		}
		this.superClass.editAction.call(this,e);
	}
})