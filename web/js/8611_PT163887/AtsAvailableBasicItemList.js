shr.defineClass("shr.ats.AtsAvailableBasicItemList",shr.shrBaseData.available.AvailableList, {
	initalizeDOM : function () {
		shr.ats.AtsAvailableBasicItemList.superClass.initalizeDOM.call(this);
		//var that = this;AtsAvailableBasicItemList
	}
	,viewAction: function(billId) {
		var _self = this;
		var model = jsBinder.view_model;
		var billType = $("#grid").jqGrid("getRowData",billId).billType;
		_self.reloadPage({
			uipk: model+".AvailableForm",
			billId: billId,
			method: 'view'
		});		
	}
	,addNewAction: function() {
		var model = jsBinder.view_model;		
		this.reloadPage({
			uipk: model+".AvailableForm",
			method: 'addNew'
		});
	}

});