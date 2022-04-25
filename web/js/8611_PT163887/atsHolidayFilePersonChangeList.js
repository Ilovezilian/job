shr.defineClass("shr.ats.AtsHolidayFilePersonChangeList", shr.ats.holidayFileChangeList, {
    pageStep: 0,
    cache_key:"atsPersonChangeList_bill",
	initalizeDOM : function () {
		shr.ats.AtsHolidayFilePersonChangeList.superClass.initalizeDOM.call(this);
		var that = this;
		that.divDialog();
		that.initTabPages();
		localStorage.removeItem(that.cache_key);
		$("[title='"
				+ jsBizMultLan.atsManager_atsHolidayFilePersonChangeList_i18n_1 
				+ "']").parent().remove();
	},
	
	viewAction: function(billId) {
		/*this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileView.form',
			billId: billId,
			method: 'view' 
		});	*/	
	}, 
	
	enableFileAction: function() {},
	deleteAction:function(){},
	
	disableFileAction: function() {},
	
	disAttendanceFilePersonAction:function(){},
		
	
	matchPunchCardRecordAction: function(){},
	
	divDialog:function(){},
	
	verifyDiv: function() {},
	
	matchPunchCardRecord: function() {}	
	,importDataAction:function(){},importFileData: function(){}	
	,exportFileData: function(){
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=downloadFile";
		 location.href = url;
	}
	/*
	 * 考勤档案中考勤组织和考勤岗位变动检测方法
	 */
	,checkChangeAction:function(){
		var that = this;
		that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileCheck'
		});
	}
	/**
	 * 描述: 导入action
	 */
	,importAction: function() {
		this.doImportData('',null,'attendanceFile');
	},
	// 批量赋值
	addValsAction : function(){
		var pageUipk = "com.kingdee.eas.hr.ats.app.AttendanceFile.list";//考勤档案列表
		var _self = this;
	    _self.addValsPublicAction(pageUipk);
	},
	createDialogDiv : function(){
		var _self = this;
		$('#importDiv').remove();
		var pageTag = _self.pageStep;
			// 未生成dialog
		var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
			
		importDiv.dialog({
				modal : false,
				title : jsBizMultLan.atsManager_atsHolidayFilePersonChangeList_i18n_0,
				width : 1035,
				minWidth : 1035,
				height : 505,
				minHeight : 505,
				open: function(event, ui) {
						var url = shr.assembleURL('com.kingdee.shr.base.bizmanage.app.atsHolidayFilePerson.list.createFile', 'view', {
						serviceId : shr.getUrlParam('serviceId'),
						state:2,
						pageTag:pageTag
						});
						var content = '<iframe id="importFrame" name="importFrame" width="100%" height="100%" frameborder="0"  allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					//	$("#importFrame").attr("style", "width:1035px;height:505px;");
				},
				close: function(event, ui) {
					importDiv.empty();
//					$(_self.gridId).jqGrid("reloadGrid");
				}  
			});
			$(".ui-dialog-titlebar-close").bind("click" , function(){
				importDiv.dialog("close");
			});	
	}
});