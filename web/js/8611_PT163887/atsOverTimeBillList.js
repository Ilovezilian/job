shr.defineClass("shr.ats.AtsOverTimeBillList", shr.framework.List, {
//  屏蔽列表中中单击事件
//	viewAction: function(billId) {
//	}
	initalizeDOM : function () {
		shr.ats.AtsOverTimeBillList.superClass.initalizeDOM.call(this);
		var that = this;
		that.setNavigateLine();
		jsBinder.gridLoadComplete=function(data){
			$("#grid_description").find(".s-ico").remove();//审批人字段数据库值全为空，不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_description").removeClass("ui-jqgrid-sortable");
			$("#grid").closest(".ui-jqgrid-bdiv").css('height','650px');
			$("#gview_grid .frozen-bdiv.ui-jqgrid-bdiv").css("height", ($(".ui-jqgrid-bdiv:first").height() - 10) + "px");
		};
	}
	
	//返回到加班单个人列表,还需要复写"创建","查看"的方法 跳转到"个人加班单的form试图"
	/**
	 * 新增
	 */
	,addNewAction: function() {
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.AtsOverTimeBillForm",
			method: 'addNew'
		});
	},
	addNewBatchAction: function() {
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.AtsOverTimeBillForm.PersonnalBatch",
			method: 'addNew'
		});
	}
	
	/**
	 * 个人列表-查看功能
	 */
	,viewAction: function(billId) {
		var _self = this;
		var billSubmitType = $("#grid").jqGrid("getRowData",billId).billSubmitType;
		var fromPage = shr.getCurrentViewPage().uipk;
		// 批量提交 
		if(billSubmitType=="2" || billSubmitType=="3"){
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllBatchFormForPer",
				billId: billId,
				method: 'view',
				fromPage: fromPage
			});	
		// 普通提交	
		}else{
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsOverTimeBillForm",
				billId: billId,
				method: 'view',
				fromPage: fromPage
			});		
		}			
	}
	
	/**
	 * 初始化页面时查询表格数据
	 * 重写此方法：从员工考勤看板日历跳转的单据页面取消默认查询条件，只显示日历单元格所在日的单据
	 */
	,initalizeQueryGrid: function(){
		var empFlag = shr.getUrlParam('empFlag');
		if(empFlag){
			this.inEmpFlagChangeSearchOtDate();
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
	}

	,inEmpFlagChangeSearchOtDate:function(){
		var dateValue = shr.getUrlParam('dateValue');
		if(dateValue){
			var lastChild = $("#entries--otDate-dateselect_down li:last-child");
			var temp = $("#fastFilter-area").shrFastFilter("option", "fastFilterItems");
			temp['entries.otDate'].values.startDate=dateValue;
			temp['entries.otDate'].values.endDate=dateValue;
			temp['entries.otDate'].values.selectDate=lastChild.attr("data-value");
			$("#fastFilter-area").shrFastFilter("option", "fastFilterItems",temp);
			atsMlUtile.setTransDateValue("#entries--otDate-datestart",dateValue);
			atsMlUtile.setTransDateValue("#entries--otDate-dateend",dateValue);
			atsMlUtile.setTransDateValue("#entries--otDate-dateselect",lastChild.attr("title"));
			$("#entries--otDate-datestart").trigger("change");
		}
	}
	
	 /**
	 * 套打模板名称
	 * 重写此方法
	 */
	,getTemplateName: function() {
		return '/s-HR/Attendance/OverTimeBill';
	},
	
	/**
	 * 套打dataProvider
	 * 重写此方法
	 */
	getTemplateDataProvider: function() {
		return 'com.kingdee.shr.ats.web.templatePrint.OverTimeBillPrintHelpDataProvider';
	},
    getTemplatePrintId: function() {
		var templatePrintId = "";
		var selectedRows = $('#grid input:checked').parents("tr").children("td[aria-describedby='grid_entries.id']");
		
		var selectedRowsLen = selectedRows.length;
		if (selectedRowsLen==0){
			shr.showWarning({
			message: jsBizMultLan.atsManager_atsOverTimeBillList_i18n_2
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
    	if(billId == undefined || billId.length<=0 || (billId && billId.length == 1 && billId[0] == "")){
    	    shr.showWarning({message : jsBizMultLan.atsManager_atsOverTimeBillList_i18n_3});
    	    return false;
    	}
		var selectedIds = shr.atsBillUtil.getSelectedIds();
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillList_i18n_4, function() {
				top.Messenger().hideAll();
				shr.atsBillUtil.abortWorkFlow(selectedIds);//撤回未提交且已绑定流程的单据
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
		
	}
	/**
	 * 初始化工具栏按钮
	 */
	,initToolBars: function(){
	   $('<button id="submit" type="button" name="submit" class="shrbtn-primary shrbtn">' +
		   jsBizMultLan.atsManager_atsOverTimeBillList_i18n_5 +
		   '</button>').insertAfter($(".shr-toolbar #addNew"));
	   $('#submit').shrButton({
					actionBinding: 'submitAction',
					subAction: '',
					customData: ""
	   });		
	}
	/**
	 * 批量提交
	 */
	,
	actSubmit: function(realIds,action,nextPers){
		var _self = this;
		if(!realIds){
			return;
		}
		data = $.extend(_self.prepareParam(), {
					method: action,
					billId: realIds,
					nextPers:nextPers
				});
		openLoader(1,jsBizMultLan.atsManager_atsOverTimeBillList_i18n_8); 
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(res) {
				closeLoader();
				if(res.alreadyInProcessQueueException == 1){
					shr.showError({message: jsBizMultLan.atsManager_atsOverTimeBillList_i18n_0});
				}else{
					var failMsg = "";
					if(res.submitNum - res.submitSuccessNum>0){
					   failMsg = "，" 
						   + jsBizMultLan.atsManager_atsOverTimeBillList_i18n_7 + (res.submitNum - res.submitSuccessNum)
					}
					shr.showInfo({message:jsBizMultLan.atsManager_atsOverTimeBillList_i18n_10 
						+ res.submitNum + "，" 
						+ jsBizMultLan.atsManager_atsOverTimeBillList_i18n_6 
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
	assembleSaveData: function(action,realBillId) {
		var _self = this;
		var billId = realBillId;
		var data = _self.prepareParam(action + 'Action');
		data.method = action;
		data.operateState = "LIST";
		data.billId = billId.join(",");
		data.fromSrc = "personnal";
		return data;
	},
	setNavigateLine: function(){
		var parentUipk = parent.window.shr.getCurrentViewPage().uipk;
	    var empolyeeBoardFlag =	sessionStorage.getItem("empolyeeBoardFlag");
		if("empolyeeBoardFlag" == empolyeeBoardFlag && "com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop" == parentUipk)
		{
	        $("#breadcrumb").remove();
	        window.parent.changeDialogTitle(jsBizMultLan.atsManager_atsOverTimeBillList_i18n_1);
	    }
	}
	,abortBillAction : function (event) {
		var _self = this;
		shr.atsBillUtil.abortBill(_self);	
	},
	submitAction: function() {
		var _self = this;
		var selectedRowData = _self.selectedRowData;
		if(undefined != selectedRowData && selectedRowData.length > 0){
			var personId = "";
			for(var i=0;i<selectedRowData.length; i++){
				if(personId == ""){
					personId = selectedRowData[i]["entries.person.id"];
				}
				if(personId != "" && undefined != selectedRowData[i]["proposer.id"] && personId != selectedRowData[i]["proposer.id"]){
					shr.showError({message: jsBizMultLan.atsManager_atsOverTimeBillList_i18n_9, hiddenAfter: 5});
		    		return;
				}
			}
		}
		shr.ats.AtsOverTimeBillList.superClass.submitAction.call(_self);
	}
});