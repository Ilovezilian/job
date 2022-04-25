shr.defineClass("shr.ats.AtsHolidayFileDisPersonList", shr.framework.List, {
    pageStep: 0,
	initalizeDOM : function () {
		shr.ats.AtsHolidayFileDisPersonList.superClass.initalizeDOM.call(this);
		var that = this;
		that.divDialog();
		that.initTabPages();
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
	
    initTabPages: function(){ },
    changePageLabelColor:function(){ },
 	 
	// 批量赋值
	addValsAction : function(){ }
});