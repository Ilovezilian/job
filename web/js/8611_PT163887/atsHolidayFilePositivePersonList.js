shr.defineClass("shr.ats.AtsHolidayFilePositivePersonList", shr.ats.holidayFileChangeList, {
    pageStep: 2,
	cache_key:"atsPersonChangeList_bill",
	initalizeDOM : function () {
		shr.ats.AtsHolidayFilePositivePersonList.superClass.initalizeDOM.call(this);
		var that = this;
		that.divDialog();
		that.initTabPages();
		localStorage.removeItem(that.cache_key);
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
	,importDataAction:function(){}
	,importFileData: function(){}	
	,exportFileData: function(){
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=downloadFile";
		 location.href = url;
	}
    ,
   
 	 
	// 批量赋值
	addValsAction : function(){
		var pageUipk = "com.kingdee.eas.hr.ats.app.AttendanceFile.list";//考勤档案列表
		var _self = this;
	    _self.addValsPublicAction(pageUipk);
	}
	
	
});