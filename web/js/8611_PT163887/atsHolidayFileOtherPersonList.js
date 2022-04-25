shr.defineClass("shr.ats.atsHolidayFileOtherPersonList", shr.ats.holidayFileChangeList, {
    pageStep: 6,
	cache_key:"atsPersonChangeList_bill",
	msgIdMap:{},
	initalizeDOM : function () {
		shr.ats.atsHolidayFileOtherPersonList.superClass.initalizeDOM.call(this);
		var that = this;
		that.divDialog();
		that.initTabPages();
		localStorage.removeItem(that.cache_key);
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