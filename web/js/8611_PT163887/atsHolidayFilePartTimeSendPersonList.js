shr.defineClass("shr.ats.AtsHolidayFilePartTimeSendPersonList", shr.ats.holidayFileChangeList, {
    pageStep: 5,
	cache_key:"atsPersonChangeList_bill",
	initalizeDOM : function () {
		shr.ats.AtsHolidayFilePartTimeSendPersonList.superClass.initalizeDOM.call(this);
		var that = this;
		that.divDialog();
		that.initTabPages();
		localStorage.removeItem(that.cache_key);
	},
	onCellSelect: function(rowid, colIndex, cellcontent, e) {
		var _self = this;
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
	},
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
	}
});