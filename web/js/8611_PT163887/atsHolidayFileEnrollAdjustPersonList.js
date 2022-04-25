shr.defineClass("shr.ats.AtsHolidayFileEnrollAdjustPersonList", shr.ats.holidayFileChangeList, {
    pageStep: 1,
	cache_key:"atsPersonChangeList_bill",
	initalizeDOM : function () {
		shr.ats.AtsHolidayFileEnrollAdjustPersonList.superClass.initalizeDOM.call(this);
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
 	 
	// 批量赋值
	,addValsAction : function(){
		var pageUipk = "com.kingdee.eas.hr.ats.app.AttendanceFile.list";//考勤档案列表
		var _self = this;
	    _self.addValsPublicAction(pageUipk);
	}
	
	,createDialogDiv : function(){
		var _self = this;
		$('#importDiv').remove();
		
		//入错职调整，同一个人有多条确认消息的，要提示会只处理最新的一条，其他的作废
		var ids = $("#grid").jqGrid("getSelectedRows");
		var multiMsg = _self.checkMultiMsg(ids);
		if(multiMsg.ignore.id.length != 0){
			shr.showConfirm(jsBizMultLan.atsManager_atsHolidayFileEnrollAdjustPersonList_i18n_1, function(){
				top.Messenger().hideAll();
				
				//part0 作废(异步的，跟确认并创建档案不是一个事务，不可回滚)
				_self.doIgnore(multiMsg.ignore.id);
				//part1 确认并创建
				_self.selectedRowId = multiMsg.confirm.id;
				_self.selectedRowData = multiMsg.confirm.data;
				_self.doCreateDialogDiv();
			});
			
		}else{
			_self.doCreateDialogDiv();
		}
	}
	
	//检查是否存在一个人有多个消息的情况
	//返回 part1 更新的；part2 作废的
	,checkMultiMsg : function(ids){
		var _self = this;
		var multiMsg;
		_self.remoteCall({
			type:"post",
			method:"checkMultiMsg",
			param:{
				ids:ids.join(",")
			},
			async: false,//同步
			success : function(res) {
				multiMsg = res.multiMsg;
			} 
		});
		return multiMsg;
	}
	
	,doCreateDialogDiv : function(){
		var _self = this;
		$('#importDiv').remove();
		var pageTag = _self.pageStep;
			// 未生成dialog
		var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
			
		importDiv.dialog({
				modal : false,
				title : jsBizMultLan.atsManager_atsHolidayFileEnrollAdjustPersonList_i18n_0,
				width : 1035,
				minWidth : 1035,
				height : 505,
				minHeight : 505,
				open: function(event, ui) {
						var url = shr.assembleURL('com.kingdee.shr.base.bizmanage.app.atsHolidayFilePerson.list.createFile', 'view', {
						serviceId : shr.getUrlParam('serviceId'),
						state : 1,
						pageTag : pageTag
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
	
	,doIgnore : function(ids){
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayBURelaConfirmCFListHandler&method=ignore";
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{ids:ids.join(",")},
			success:function(res){
				//window.location.reload();
			}
		});	
	}
});