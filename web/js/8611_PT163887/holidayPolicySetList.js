shr.defineClass("shr.ats.HolidayPolicySetList", shr.ats.AtsMaintainBasicItemList, {
	initalizeDOM : function () {
		shr.ats.HolidayPolicySetList.superClass.initalizeDOM.call(this);
		var that = this;
	}
	,copyAction: function() {		
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length == 0) {
			shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetList_i18n_0});
			return ;
		}else if(selectedIds.length > 1) {
			shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetList_i18n_1});
			return ;
		}
		
		var _self = this;
		var model = jsBinder.view_model;
	
		var toUipk = "com.kingdee.eas.hr.ats.app.HolidayPolicy4Set.form";
		var url = shr.getContextPath()+ "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayPolicy4SetMulitRowHandler";
			url +="&uipk="+toUipk;
			
		_self.reloadPage({
			uipk: toUipk,
			billId: selectedIds[0],
			relatedFieldId: selectedIds[0],
			method: 'copy'
		});		
		
	
	}
	,viewAction: function(billId) {
		if($('#selectOk1').size()>0){
		
		}else{
			this.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.HolidayPolicy4Set.form',
				billId: billId,
				relatedFieldId: billId,
				method: 'initalizeData'
			});			
		}
	}
});