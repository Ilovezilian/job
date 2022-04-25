shr.defineClass("shr.ats.atsShiftAvailableList", shr.ats.AtsAvailableBasicItemList, {
	initalizeDOM : function () {
		shr.ats.atsShiftAvailableList.superClass.initalizeDOM.call(this);
		var that = this;
	},
	blindCurrentAction: function() {
	var clz = this;
	var billIds = $("#grid").jqGrid("getSelectedRows");
	if (billIds == undefined || billIds.length == 0) {
	shr.showWarning({message : jsBizMultLan.atsManager_atsShiftAvailableList_i18n_0});
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
	$('#blindCurrent').attr('values','atsShift');
	$('#importDiv').remove();
	var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));	
	importDiv.dialog({
	modal : false,
	title : jsBizMultLan.atsManager_atsShiftAvailableList_i18n_3,
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
	},receiveAction : function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var gridData= $grid.jqGrid("getSelectedRows");
		var gridDataArray = new Array();
		if(gridData.length<=0){
			shr.showWarning({message : jsBizMultLan.atsManager_atsShiftAvailableList_i18n_2});
			return;
		}
		for(var i = 0 ; i < gridData.length ; i++){
			var data = $grid.jqGrid("getRowData", gridData[i]);
			gridDataArray.push(data);
		}
		var parentgridData= parent.$grid.jqGrid("getSelectedRows");
		var parentArray = new Array();
		
		for(var i = 0 ; i < parentgridData.length ; i++){
			var data = parent.$grid.jqGrid("getRowData", parentgridData[i]);
			parentArray.push(data);
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsHrOrgBlindAdminHandler&method=receive";
		openLoader(1,jsBizMultLan.atsManager_atsShiftAvailableList_i18n_4);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridDataArray),"parentArray":JSON.stringify(parentArray),"type":"1"},
			success:function(res){
				//清除本地缓存
				//localStorage.removeItem(clz.cache_key);
				closeLoader();
				parent.location.reload();
			}
		});		 
	},blindLookAction: function() {
		var that = this;
		var _self = this;
	    var selectedIds = parent.$("#grid").jqGrid("getSelectedRows");
		if (selectedIds == undefined || selectedIds.length == 0) {
		shr.showWarning({message : jsBizMultLan.atsManager_atsShiftAvailableList_i18n_1});
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
			  type:'atsShift',
			  billId:bills
		});		
	}
});