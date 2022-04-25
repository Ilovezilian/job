shr.defineClass("shr.ats.AtsHolidayFileTransferPersonList", shr.ats.holidayFileChangeList, {
    pageStep: 3,
	cache_key:"atsPersonChangeList_bill",
	initalizeDOM : function () {
		shr.ats.AtsHolidayFileTransferPersonList.superClass.initalizeDOM.call(this);
		var that = this;
		that.divDialog();
		that.initTabPages();
		$("[title='"
				+ jsBizMultLan.atsManager_atsHolidayFileTransferPersonList_i18n_7 
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
	,importDataAction:function(){}
	,importFileData: function(){}	
	,exportFileData: function(){
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=downloadFile";
		 location.href = url;
	}
    ,
    changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.pageStep).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.pageStep).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
	},
 	 
	// 批量赋值
	addValsAction : function(){
		var pageUipk = "com.kingdee.eas.hr.ats.app.AttendanceFile.list";//考勤档案列表
		var _self = this;
	    _self.addValsPublicAction(pageUipk);
	},receiveAction : function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var gridData= $grid.jqGrid("getSelectedRows");
		var gridDataArray = new Array();
		if(gridData.length<=0){
			shr.showWarning({message : jsBizMultLan.atsManager_atsHolidayFileTransferPersonList_i18n_2});
			return;
		}
		for(var i = 0 ; i < gridData.length ; i++){
			var data = $grid.jqGrid("getRowData", gridData[i]);
			if(data['hrOrgUnit.id']==null || data['hrOrgUnit.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsHolidayFileTransferPersonList_i18n_1});
				return false;
			}
			if(data['position.id']==null || data['position.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsHolidayFileTransferPersonList_i18n_6});
				return false;
			}
			if(data['holidayPolicy.id']==null || data['holidayPolicy.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsHolidayFileTransferPersonList_i18n_0});
				return false;
			}
			if(data['changeDate']==null || data['changeDate']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsHolidayFileTransferPersonList_i18n_3});
				return false;
			}
			if(data['adminOrgUnit.id']==null || data['adminOrgUnit.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsHolidayFileTransferPersonList_i18n_4});
				return false;
			}
			gridDataArray.push(data);
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayBURelaConfirmCFListHandler&method=receive";
		openLoader(1,jsBizMultLan.atsManager_atsHolidayFileTransferPersonList_i18n_5);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridDataArray),"ids":localStorage.getItem(clz.cache_key)},
			success:function(res){
				//清除本地缓存
				localStorage.removeItem(clz.cache_key);
				closeLoader();
				parent.location.reload();
			}
		});		 
	}
});