shr.defineClass("shr.ats.TurnShiftList", shr.ats.AtsMaintainBasicItemList, {
	 
	initalizeDOM : function () {
		shr.ats.TurnShiftList.superClass.initalizeDOM.call(this);
		//var that = this;
	},
	copyAction: function() {		
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length == 0) {
			shr.showWarning({message: jsBizMultLan.atsManager_atsTurnShiftList_i18n_0});
			return ;
		}else if(selectedIds.length > 1) {
			shr.showWarning({message: jsBizMultLan.atsManager_atsTurnShiftList_i18n_1});
			return ;
		}
		
		var _self = this;
		var model = jsBinder.view_model;
		//var billType = $("#grid").jqGrid("getRowData",selectedIds).billType;
		//var currentUipk = jsBinder.uipk;
	
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