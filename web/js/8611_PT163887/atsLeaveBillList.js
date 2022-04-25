shr.defineClass("shr.ats.AtsLeaveBillList", shr.framework.List, {
	 
	initalizeDOM : function () {
		shr.ats.AtsLeaveBillList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initToolBars();
	    var parentUipk = parent.window.shr.getCurrentViewPage().uipk;
	    var punchCardFlag = sessionStorage.getItem("punchCardFlag");
	    var empolyeeBoardFlag =	sessionStorage.getItem("empolyeeBoardFlag");
		if(("fromPunchCard" == punchCardFlag 
		&& "com.kingdee.eas.hr.ats.app.WorkCalendarItem.listSelf" == parentUipk) ||
		("empolyeeBoardFlag" == empolyeeBoardFlag && "com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop" == parentUipk)
		){//来自打卡记录弹出框的时候
	        $("#breadcrumb").remove();
	        window.parent.changeDialogTitle(jsBizMultLan.atsManager_atsLeaveBillList_i18n_2);
	    }
		jsBinder.gridLoadComplete=function(data){
			$("#grid_description").find(".s-ico").remove();//审批人字段数据库值全为空，不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_description").removeClass("ui-jqgrid-sortable");
		};
	}
	,inEmpFlagChangeSearchOtDate:function(){
		var dateValue = shr.getUrlParam('dateValue');
		if(dateValue){
			var lastChild = $("#entries--beginTime_entries--endTime-dateselect_down li:last-child");
			var temp = $("#fastFilter-area").shrFastFilter("option", "fastFilterItems");
			temp["entries.beginTime_entries.endTime"].values.startDate=dateValue;
			temp["entries.beginTime_entries.endTime"].values.endDate=dateValue;
			temp["entries.beginTime_entries.endTime"].values.selectDate=lastChild.attr("data-value");
			$("#fastFilter-area").shrFastFilter("option", "fastFilterItems",temp);
			atsMlUtile.setTransDateValue("#entries--beginTime_entries--endTime-datestart",dateValue);
			atsMlUtile.setTransDateValue("#entries--beginTime_entries--endTime-dateend",dateValue);
			atsMlUtile.setTransDateValue("#entries--beginTime_entries--endTime-dateselect",lastChild.attr("title"));
			$("#entries--beginTime_entries--endTime-datestart").trigger("change");
		}
	}
	//返回到请假单个人列表,还需要复写"创建","查看"的方法 跳转到"个人请假单的form试图"
	/**
	 * 新增
	 */
	,addNewAction: function() {
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.AtsLeaveBillForm",
			method: 'addNew'
		});
	}
	,batchNewAction:function(){
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.AtsLeaveBillFormNew",
			method: 'addNew',
			serviceId:'vA0Y5XHfR8eJESywHpQQSPI9KRA='
		});
	}
	
	/**
	 * 个人列表-查看功能
	 */
	,viewAction: function(billId) {
		var _self = this;
		var billType = $("#grid").jqGrid("getRowData",billId).billType;
		// 批量提交
		if(billType=="2"){
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsLeaveBillAllBatchFormForPer",
				billId: billId,
				method: 'view'
			});	
		// 普通提交	
		}else{
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsLeaveBillForm",
				billId: billId,
				method: 'view'
			});		
		}		
	}
	
	/**
	 * 初始化页面时查询表格数据
	 * 重写此方法：从员工考勤看板日历跳转的单据页面取消默认查询条件，只显示日历单元格所在日的单据
	 */
	,initalizeQueryGrid: function(){
		var empFlag = shr.getUrlParam('empFlag');
		var that=this;
		if(empFlag){
			that.inEmpFlagChangeSearchOtDate();
			$("#searchId").next().remove();
			this.queryGrid();
		}else{
			var $search = $('#searcher');
			var filter = $search.shrSearchBar('option', 'filterView');
			if ($.isEmptyObject(filter)) {
				// 如果filter为空
				if (!$.isEmptyObject($search.shrSearchBar('option', 'defaultViewId'))) {
					// 加载默认过滤方案触发表格取数
					$search.shrSearchBar('chooseDefaultView');
				} else {
					this.queryGrid();
				}
			} else {
				// 如果filter为非空，则直接查询表格数据
				this.queryGrid();
			}
		}
	},
	cancelLeaveAction: function(){
		var that = this;
		var billId = $("#grid").jqGrid("getSelectedRows");
		var leaveBillId = "";
		var submitType = 1;
		that.remoteCall({
			type: "post",
			async: false,
			method:"getSubmitType",
			param:{billId:billId[0]},
			success: function(data){
				submitType = data;
			}
		});
		leaveBillId = billId[0];
		if(submitType == 2){
			if(shr.getUrlRequestParam("uipk")=="com.kingdee.eas.hr.ats.app.AtsLeaveBillList"){
			shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_48, function() {
				  that.reloadPage({
			             uipk: "com.kingdee.eas.hr.ats.app.CancelLeaveBillForm",
			             method: 'addNew'
		           });
			});
			}else{
			shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_48, function() {
				  that.reloadPage({
			             uipk: "com.kingdee.eas.hr.ats.app.CancelLeaveBillAllForm",
			             method: 'addNew'
		           });
			});
			}
//			shr.showWarning({message:jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_29});
//			return false;
		}else{
			if(billId.length>1){
                shr.showWarning({message:jsBizMultLan.atsManager_atsLeaveBillList_i18n_7});
				return false;
			}
			var isPass = false;
			that.remoteCall({
			      type: "post",
			      async: false,
			      method:"getLeaveBillState",
			      param:{billId:billId[0]},
			      success: function(res){
				     if(res.billState == 3){
						 isPass = true;
					 }
			    }
		    });
			if(!isPass){
				shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillList_i18n_6});
			}else{
			 leaveBillId=$("#grid").jqGrid("getRowData", billId)["entries.id"];
			var errorString = "";
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CancelLeaveBillEditHandler&method=validateIsCancelLeave";
		     $.ajax({
				dataType: "json",
		        url: url,
				async: false,
				data: {
					billId:leaveBillId
				},
				success: function(res){
					errorString = res.summary;
				}
		    });
			if(errorString){
				shr.showWarning({message:errorString});
			}else{
				var isHavenCancelLeave = false;
				that.remoteCall({
			      type: "post",
			      async: false,
			      method:"isHavenCancelLeave",
			      param:{billId:billId[0]},
			      success: function(res){
				    isHavenCancelLeave = res.isHavenCancelLeave;
			    }
		       });
			   if(isHavenCancelLeave == false){
			   		parent.$('#operationDialog').parent().find('.ui-dialog-title').text($('#cancelLeave').text());
			         this.reloadPage({
			             uipk: "com.kingdee.eas.hr.ats.app.CancelLeaveBillForm",
			             method: 'addNew',
			             leaveBillId: leaveBillId,
			             isFromPage: "Leave"
		           });
			   }else{
				   shr.showWarning({message:jsBizMultLan.atsManager_atsLeaveBillList_i18n_1});
			   }
			}
		  }
			}
		//}
	}
	
	,abortBillAction : function (event) {
		
//		
//		var _self = this;
//		shr.atsBillUtil.abortBill(_self);	
		 var realBillId = [];
			//var billId = this.selectedRowId;
		    var billId = $(this.gridId).jqGrid("getSelectedRows");
			if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({"message" : jsBizMultLan.atsManager_atsLeaveBillList_i18n_4});
				return ;
		    }
			var billLength = billId.length;
			for(var i=0;i<billLength;i++){
				//去除重复处理
				if($.inArray(billId[i], realBillId) == -1){
					realBillId.push(billId[i]);
				}
			}
			var _self = this;
			shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_49, function(){
				top.Messenger().hideAll();			
				_self.remoteCall({
					type:"post",
					method:"abortBill",
					param:{billId:realBillId.toString()},
					success:function(res){
						shr.showInfo({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_50});
						_self.reloadGrid(); 
					}
				});
				
			});
	}
		
	/**
	 * 套打模板名称
	 * 重写此方法
	 */
	,getTemplateName: function() {
		return '/s-HR/Attendance/LeaveBill';
	},
	
	/**
	 * 套打dataProvider
	 * 重写此方法
	 */
	getTemplateDataProvider: function() {
		return 'com.kingdee.shr.ats.web.templatePrint.LeaveBillPrintHelpDataProvider';
	},
    
        getTemplatePrintId: function() {
		var templatePrintId = "";
		var selectedRows = $('#grid input:checked').parents("tr").children("td[aria-describedby='grid_entries.id']");
		
		var selectedRowsLen = selectedRows.length;
		if (selectedRowsLen==0){
			shr.showWarning({
			message: jsBizMultLan.atsManager_atsLeaveBillList_i18n_3
			});
			
		}else {
			//获取的数组是倒序的
			for (var i = selectedRowsLen-1;i>=0;i--){
				templatePrintId += selectedRows[i].title+",";
			}
			templatePrintId = templatePrintId.substring(0,templatePrintId.length-1);
			return templatePrintId;
		}
		
	}	
	/**
	 * 描述:删除操作
	 * @action 
	 */
	,deleteAction:function(){
    	var _self = this;
    	var billId = $("#grid").jqGrid("getSelectedRows");
    	if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({"message" : jsBizMultLan.atsManager_atsLeaveBillList_i18n_4});
				return false;
		}
		var selectedIds = shr.atsBillUtil.getSelectedIds();
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillList_i18n_8, function() {
				top.Messenger().hideAll();
				shr.atsBillUtil.abortWorkFlow(selectedIds);//废弃未提交且已绑定流程的单据
				_self.doRemoteAction({
					method: 'delete',
					billId: selectedIds
				});
			});
		}else{
			if (selectedIds) {
				this.deleteRecord(selectedIds);
			} 
		}
	},
	/**
	 * 初始化工具栏按钮
	 */
	initToolBars: function(){	  
	   $('#submit').shrButton({
						actionBinding: 'submitAction',
						subAction: '',
						customData: ""
	   });		
	}
	
	,actSubmit: function(realIds,action,nextPers){
		var _self = this;
		if(!realIds){
			return;
		}
		data = $.extend(_self.prepareParam(), {
					method: action,
					billId: realIds,
					nextPers:nextPers
				});
		openLoader(1,jsBizMultLan.atsManager_atsLeaveBillList_i18n_12); 
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(res) {
				closeLoader();
				if(res.alreadyInProcessQueueException == 1){
					shr.showError({message: jsBizMultLan.atsManager_atsLeaveBillList_i18n_0});
				}else if(res.error !="" && res.error!=null && res.error!=undefined ){
					shr.showError({message: res.error});
				}else{ 
					var failMsg = "";
					if(res.submitNum - res.submitSuccessNum>0){
					   failMsg = "，" 
						   + jsBizMultLan.atsManager_atsLeaveBillList_i18n_11 
						   + (res.submitNum - res.submitSuccessNum)
					}
					shr.showInfo({message:jsBizMultLan.atsManager_atsLeaveBillList_i18n_14 
						+ res.submitNum + "，" 
						+ jsBizMultLan.atsManager_atsLeaveBillList_i18n_10 
					+ res.submitSuccessNum + failMsg});
				    $("#grid").jqGrid().jqGrid("reloadGrid");
				}
			},
			error: function(response) {
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});	
				
	},
	submitAction: function() {
		var _self = this;
		var selectedRowData = _self.selectedRowData;
		if(null != selectedRowData && selectedRowData.length > 0){
			var personId = "";
			for(var i=0;i<selectedRowData.length; i++){
				if(personId == ""){
					personId = selectedRowData[i]["entries.person.id"];
				}
				if(personId != null && null != selectedRowData[i]["proposer.id"] && personId != selectedRowData[i]["proposer.id"]){
					shr.showError({message: jsBizMultLan.atsManager_atsLeaveBillList_i18n_13, hiddenAfter: 5});
		    		return;
				}
			}
		}
		shr.ats.AtsLeaveBillList.superClass.submitAction.call(_self);
	}
});

