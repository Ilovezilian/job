shr.defineClass("shr.ats.AttendanceFilePartTimeSendPersonList", shr.ats.FilePersonChangeList, {
    pageStep: 5,
    cache_key:"atsPersonChangeList_bill",
	initalizeDOM : function () {
		shr.ats.AttendanceFilePartTimeSendPersonList.superClass.initalizeDOM.call(this);
		var that = this;
	},
	onCellSelect: function(rowid, colIndex, cellcontent, e) {
		var _self = this;
//		_self.selectedRowId = rowid;
		
		// 选择的是选择框
		if (colIndex == 0) {
			var changeMsgId = $("#grid").jqGrid('getRowData',rowid).changeMsgId
			var listData = $("#grid").jqGrid("getRowData");
			for(var i=0;i < listData.length ; i++){
				if($("#grid").jqGrid("getRowData")[i].id != rowid &&
				   $("#grid").jqGrid("getRowData")[i].changeMsgId == changeMsgId){
					$("#grid").setSelection($("#grid").jqGrid("getRowData")[i].id);
				}	
			}
			return;
		}
		
		var billId = $(_self.gridId).jqGrid("getCell", rowid, _self.getBillIdFieldName());
		if( billId !="" && billId != undefined ){
			_self.viewAction(billId, rowid);
		}
	},
	createDialogDiv : function(){
		var _self = this;
		$('#importDiv').remove();
		var pageTag = _self.pageStep;
			// 未生成dialog
		var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
			
		importDiv.dialog({
				modal : false,
				title : jsBizMultLan.atsManager_attendanceFilePartTimeSendPersonList_i18n_0,
				width : 1035,
				minWidth : 1035,
				height : 505,
				minHeight : 505,
				open: function(event, ui) {
				
						var url = shr.assembleURL('com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.list.createFile', 'view', {
						serviceId : shr.getUrlParam('serviceId'),
						pageStep : _self.pageStep,
						pageTag : pageTag
						});
						var content = '<iframe id="importFrame" name="importFrame" width="100%" height="100%" frameborder="0"  allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					//	$("#importFrame").attr("style", "width:1035px;height:505px;");
				},
				close: function(event, ui) {
					importDiv.empty();
					$(_self.gridId).jqGrid("reloadGrid");
				}  
			});
			
			$(".ui-dialog-titlebar-close").bind("click" , function(){
				importDiv.dialog("close");
			});	
	
	}
});