shr.defineClass("shr.ats.HolidayRuleList", shr.ats.AtsMaintainBasicItemList, {
	initalizeDOM : function () {
		shr.ats.HolidayRuleList.superClass.initalizeDOM.call(this);
		var that = this;
	}
	
	,limitFoumulaAction:function(){
		console.info('dfdsdf');
		this.reloadPage({
			//uipk: 'com.kingdee.eas.hr.ats.app.HolidayRule.formula',
			uipk : 'com.kingdee.eas.hr.ats.app.HolidayRule.formula.add.form',
			method: 'addNew'
		});
	}
	
	,viewAction: function(billId,rowId){
		// 编辑界面禁用，则直接返回
		if (this.editViewDisable) {
			return;
		}
		 var data = $(this.gridId).jqGrid('getRowData',rowId);
		 var isFormulaView =$('#grid_delayDate[role=columnheader]').length && data && data.delayDate === "";
		 this.reloadPage({
			uipk: isFormulaView ? "com.kingdee.eas.hr.ats.app.HolidayRule.formula" : this.getEditUIPK(),
			billId: billId,
			method: isFormulaView ? 'initalizeData' : 'view'
		});	
	}
	
	
	,copyAction: function() {		
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length == 0) {
			shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleList_i18n_0});
			return ;
		}else if(selectedIds.length > 1) {
			shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleList_i18n_1});
			return ;
		}
		
		var _self = this;
		var model = jsBinder.view_model;
//		var billType = $("#grid").jqGrid("getRowData",selectedIds).billType;
//		var currentUipk = jsBinder.uipk;
	
		var toUipk = model+".form";
		var url = shr.getContextPath()+ "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayPolicy4SetMulitRowHandler";
			url +="&uipk="+toUipk;
			
			
			_self.reloadPage({
											uipk: toUipk,
											billId: selectedIds[0],
											method: 'copy'
									});		
			
	
	}
});	