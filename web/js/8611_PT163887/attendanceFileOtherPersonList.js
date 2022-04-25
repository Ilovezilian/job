shr.defineClass("shr.ats.AttendanceFileOtherPersonList", shr.ats.FilePersonChangeList, {
    pageStep: 6,
    cache_key:"atsPersonChangeList_bill",
    msgIdMap:{},
	initalizeDOM : function () {
		shr.ats.AttendanceFileOtherPersonList.superClass.initalizeDOM.call(this);
		var that = this;
		jsBinder.gridLoadComplete=function(data){
			console.log(data);
			msgIdMap = {};
			if(data.rows.length>0){
				for(var i = 0 ;i<data.rows.length;i++){
					var key = data.rows[i]["changeMsgId"] +"_"+data.rows[i]["person.id"];
					if(msgIdMap[key]){
						msgIdMap[key].push(data.rows[i]["id"]);
					}else{
						msgIdMap[key] = new Array();
						msgIdMap[key].push(data.rows[i]["id"]);
					}
				}
			}
		};
	},
	onCellSelect: function(rowid, colIndex, cellcontent, e) {
		var _self = this;
//		_self.selectedRowId = rowid;
		
		// 选择的是选择框
		if (colIndex == 0) {
			var changeMsgId = $("#grid").jqGrid('getRowData',rowid).changeMsgId;
			var personId = $("#grid").jqGrid('getRowData',rowid)["person.id"];
			var key = changeMsgId + "_" + personId;
			var listData = msgIdMap[key];
			for(var i=0;i < listData.length ; i++){
				if(listData[i]!= $("#grid").jqGrid('getRowData',rowid).id){
					$("#grid").setSelection(listData[i]);
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
		var pageTag  = _self.pageStep;
			// 未生成dialog
		var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
			
		importDiv.dialog({
				modal : false,
				title : jsBizMultLan.atsManager_attendanceFileOtherPersonList_i18n_0,
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