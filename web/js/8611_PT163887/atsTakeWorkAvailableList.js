shr.defineClass("shr.ats.atsTakeWorkAvailableList", shr.ats.AtsAvailableBasicItemList, {
	initalizeDOM : function () {
		shr.ats.atsTakeWorkAvailableList.superClass.initalizeDOM.call(this);
		var that = this;
	},
	blindCurrentAction: function() {
	var clz = this;
	var billIds = $("#grid").jqGrid("getSelectedRows");
	if (billIds == undefined || billIds.length == 0) {
	shr.showWarning({message : jsBizMultLan.atsManager_atsTakeWorkAvailableList_i18n_0});
	return;
	}
	var selectedIds = $("#grid").jqGrid("getSelectedRows");
    if (selectedIds.length > 0) {
    var bills;
	for (var i = 0;i<selectedIds.length; i++) {
	var item = selectedIds[i];
	var data = $("#grid").jqGrid("getRowData", item);
	if(bills){
	bills = bills+','+selectedIds[i];
	}else{
	bills = selectedIds[i];
	}
	}
	}
	var _self = this;
	$('#blindCurrent').attr('values','takeWork');
	$('#importDiv').remove();
	var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));	
	importDiv.dialog({
	modal : false,
	title : jsBizMultLan.atsManager_atsTakeWorkAvailableList_i18n_2,
	width : 1035,
	minWidth : 1035,
	height : 505,
	minHeight : 505,
	open: function(event, ui) {
	var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.BlindAdmin.list', 'view', {
	});
	var content = '<iframe id="importFrame" name="importFrame" width="100%" height="100%" frameborder="0"  allowtransparency="true" src="' + url + '"></iframe>';
	importDiv.append(content);
	},
	close: function(event, ui) {
	importDiv.empty();
	}  
	});
	$(".ui-dialog-titlebar-close").bind("click" , function(){
	importDiv.dialog("close");
	});	
	},blindLookAction: function() {
		var that = this;
		var _self = this;
	    var selectedIds = parent.$("#grid").jqGrid("getSelectedRows");
		if (selectedIds == undefined || selectedIds.length == 0) {
		shr.showWarning({message : jsBizMultLan.atsManager_atsTakeWorkAvailableList_i18n_1});
		return;
		}
		if (selectedIds.length > 0) {
		var bills;
		for (var i = 0;i<selectedIds.length; i++) {
		var item = selectedIds[i];
		if(bills){
		bills = bills+','+selectedIds[i];
		}else{
		bills = selectedIds[i];
		}
		}
		}
		var filterStr =  " IN ( '"+bills.replace(/,/g,"','")+"' ) ";
		this.reloadPage({
			//uipk: 'com.kingdee.eas.hr.ats.app.HrOrgUnitBlindAdmin.list'
			  uipk: 'com.kingdee.eas.hr.ats.app.BlindOrgAdmin.list',
			  look:'look',
			  type:'takeWork',
			  billId:bills
		});		
	}
});