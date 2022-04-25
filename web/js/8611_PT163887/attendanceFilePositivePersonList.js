shr.defineClass("shr.ats.AttendanceFilePositivePersonList", shr.ats.FilePersonChangeList, {
    pageStep: 2,
    cache_key:"atsPersonChangeList_bill",
	initalizeDOM : function () {
		shr.ats.AttendanceFilePositivePersonList.superClass.initalizeDOM.call(this);
		var that = this;
	},
	createDialogDiv : function(){
		var _self = this;
		$('#importDiv').remove();
		var pageTag = _self.pageStep;
			// 未生成dialog
		var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
			
		importDiv.dialog({
				modal : false,
				title : jsBizMultLan.atsManager_attendanceFilePositivePersonList_i18n_0,
				width : 1035,
				minWidth : 1035,
				height : 505,
				minHeight : 505,
				open: function(event, ui) {
				
						var url = shr.assembleURL('com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.list.createFile', 'view', {
						serviceId : shr.getUrlParam('serviceId'),
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