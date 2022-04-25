//请假确认单 专员使用的js

var atsCalFlag = false ;//从考勤计算进入标志
shr.defineClass("shr.ats.team.TeamCancelLeaveBillAllList", shr.framework.List, {
	 
	initalizeDOM : function () {
		var that = this;
		that.atsCalTriger();
		//考勤计算页面，不响应列表点击事件
		if(atsCalFlag){
			that.editViewDisable = true;
			
			var colModel = $(this.gridId).get(0).p.colModel;
			for(var i = 0;i < colModel.length;i++) {
				if(colModel[i].formatter == 'showlink') {
					colModel[i].formatter = '';
					break;
				}
			}
		}
		that.initialFromAtsCalculate();//重考勤计算进入，改变查询范围
        shr.ats.team.TeamCancelLeaveBillAllList.superClass.initalizeDOM.call(this);
	//	that.initToolBars();	
		jsBinder.gridLoadComplete=function(data){
			shr.ats.team.TeamCancelLeaveBillAllList.superClass.gridLoadComplete.call(that,data);
			$("#grid_description").find(".s-ico").remove();//审批人字段数据库值全为空，不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_description").removeClass("ui-jqgrid-sortable");
		}
	}
	,importAction: function(){
		
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil";
        url +='&uipk=com.kingdee.eas.hr.ats.app.team.CancelLeaveBillAllList';
			   shr.remoteCall({
				type:"post",
				method:"checkImportPermssion",
				url:url,
				success:function(res){
                shr.ats.team.TeamCancelLeaveBillAllList.superClass.importAction.call(this);
				}
			});
		
	},
	/**
	 * 提交
	 */
	submitAction: function() {
		var _self = this;
		if(!_self.isSame()){
			return;
		}
	shr.ats.team.TeamCancelLeaveBillAllList.superClass.submitAction.call(this);
	}
	,atsCalTriger: function() {
		if (typeof(atsCalGobalParam)!="undefined")
		{
		    atsCalFlag=true;
		}
	},isSame: function(){
	var array=[];
	var sameData=$("#grid").jqGrid("getSelectedRowsData");
	for(var i=0;i<sameData.length;i++){
	var isCancelLeave=sameData[i].isCancelLeave;
	var entryId=sameData[i].entryId;
	if(isCancelLeave != 0){
	shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_51});
	return false;
	}
	if(array.includes(entryId)){
	shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_50});
	return false;
	}
	array.push(entryId);
	}
	return true;
	}
	,againstApproveAction : function(){
		
		var that = this ;
	
		var billId = $("#grid").jqGrid("getSelectedRows");
			
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
			shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_10});
			return ;
		}else if(billId.length > 1){
			shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_16});
			return ;
		}else if(billId.length == 1){
		
			var billState = $("#grid").jqGrid("getCell", $("#grid").jqGrid("getSelectedRows").join(),'billState');
			if(billState != 3)
			{
				shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_16});
				return ;
			}
		}
		
		var billIds = $("#grid").jqGrid("getSelectedRows").join(",");
		//校验请假明细有没有生成汇总记录
		var hasSummary = false;
		var hasSalary = false;
		var msg = "";
		var salaryMsg = "";
        var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamCancelLeaveBillListHandler&method=checkDetailSummary";
		   shr.ajax({
			type:"post",
			async:false,
			data :{billIds:billIds} ,
			url:url,
			success:function(res){
				hasSummary = res.hasSummary=="true"?true:false;
				hasSalary  = res.hasSalary=="true"?true:false;
				msg = res.msg;
				salaryMsg = res.salaryMsg;
			}
		});
		
		if(hasSalary){
			shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_6+salaryMsg});
			return;
		}
		
		//
		var confirmStr = jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_9;
		if(hasSummary){
			confirmStr = msg;
		}
		
        var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.team.CancelLeaveBillAllList";
		shr.showConfirm(confirmStr, function(){
			   shr.remoteCall({
				type:"post",
				url:url,
				method:"againstApprove",
				param :{billIds:billIds},
				success:function(res){
					if(res.flag == "1")
					{
						shr.showInfo({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_4});
						that.queryGrid();
					}else{
						shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_5});
					} 
				}
			});
		});
	}
	/**
	 * 初始化页面时查询表格数据
	 * 重写此方法：从考勤计算进入页面不带高级搜索默认条件
	 */
	,initalizeQueryGrid: function(){
		if(!atsCalFlag){
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
		}else{
			$("#searchId").next().remove();
			this.queryGrid();
		}
	}
	/**
	 * 将URL中的参数在表格查询时传递至服务端
	 * 重写此方法
	 */
	,setGridCustomParam: function() {
		var params = $.extend(this.initData.custom_params, this.getGridCustomParam());
		this.atsCalTriger();
		if (atsCalFlag){
			params["atsCalFalg"] = "1";
			params["adminOrgUnit_longNumber"] = atsCalGobalParam.adminOrgUnit_longNumber;
			params["adminOrgUnitId"] = atsCalGobalParam.adminOrgUnitId;
			params["proposerName"] = atsCalGobalParam.proposerName;
			params["attencePolicyId"] = atsCalGobalParam.attencePolicyId;
			params["beginDate"] = atsCalGobalParam.beginDate;
			params["endDate"] = atsCalGobalParam.endDate;
			params["attendanceGroupID"] = atsCalGobalParam.attendanceGroupID;
		}else {
			params["atsCalFalg"] = "0";
		}
		$(this.gridId).setGridParam({
			custom_params: shr.toJSON(params)
		});	
	}
	
	//返回到请假确认单专员列表,还需要复写"创建","查看"的方法 跳转到"专员请假确认单的form试图"
	/**
	 * 新增
	 */
	,addNewAction: function() {
		this.reloadPage({
            uipk: "com.kingdee.eas.hr.ats.app.team.CancelLeaveBillAllForm",
			method: 'addNew'
		});
	}
	
	/**
	 * 个人列表-查看功能
	 */
	,viewAction: function(billId) {
		// 编辑界面禁用，则直接返回
		if (this.editViewDisable) {
			return;
		}
		this.reloadPage({
            uipk: "com.kingdee.eas.hr.ats.app.team.CancelLeaveBillAllForm",
			billId: billId,
			method: 'view'
		});			
	}
	
 
 	/**
	 * 废弃单据
	 */
	,abortBillAction : function (event) {
			var billId = $("#grid").jqGrid("getSelectedRows");
			
			if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({"message" : jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_10});
				return ;
		    }
//		    else if(billId.length>1){
//				alert('请选中一行');
//				return ;
//			}
			var _self = this;
			shr.showConfirm(jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_8, function(){
				top.Messenger().hideAll();
//				var data = {
//					method: 'abortBill',
//					billId: billId[0]
//				};
//				data = $.extend(_self.prepareParam(), data);
//				shr.doAction({
//					url: _self.dynamicPage_url,
//					type: 'post', 
//						data: data,
//						success : function(response) {					
//							_self.reloadGrid();
//						}
//				});
				_self.remoteCall({
					type:"post",
					method:"abortBill",
					param:{billId:billId.toString()},
					success:function(res){
						shr.showInfo({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_2});
						_self.reloadGrid(); 
					}
				});
				
			});
		}

	/**
	 * 描述:删除操作
	 * @action 
	 */
	,deleteAction:function(){
    	var _self = this;
    	var billId = $("#grid").jqGrid("getSelectedRows");
    	if(billId == undefined || billId.length<=0 || (billId && billId.length == 1 && billId[0] == "")){
    	    shr.showWarning({message : jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_10});
    	    return false;
    	}
		var selectedIds = shr.atsBillUtil.getSelectedIds();
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_11, function() {
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
		openLoader(1,jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_15);
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(res) {
				closeLoader();
				if(res.alreadyInProcessQueueException == 1){
					shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_3});
				}else{
					var failMsg = "";
					if(res.submitNum - res.submitSuccessNum>0){
					   failMsg = jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_1 + (res.submitNum - res.submitSuccessNum)
					}
					shr.showInfo({message:jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_17 + res.submitNum +
							jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_0 + res.submitSuccessNum + failMsg});
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
	}
	,submitEffectAction : function (event) {
		var _self = this;
		if(!_self.isSame()){
			return;
		}
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		var billId = $("#grid").jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({"message" : jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_10});
				return false;
		}
		shr.showConfirm(jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_14, function() {
		    _self.prepareSubmitEffect(event, 'submitEffect');
		});
	}
	/**
	 * 提交生效 
	 */
	,prepareSubmitEffect : function (event, action){
		var _self = this;
		var billId = $("#grid").jqGrid("getSelectedRows");
		var realBillId = [];
		for(var i=0;i<billId.length;i++){
		   var billState = "";
		    if($("tr[id='" + billId[i] + "']").length>1){//多人单据
			    billState = $($("tr[id='" + billId[i] + "']")[0]).find("td[aria-describedby='grid_billState']").text();
		    }else{
			    billState = $("tr[id='" + billId[i] + "'] td[aria-describedby='grid_billState']").text();
		    }
		   if(jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_13 == billState && $.inArray(billId[i], realBillId) == -1){
		      realBillId.push(billId[i]);
		   }
		}
		if(realBillId.length == 0){
		    shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_7, hiddenAfter: 5});
		    return;
		}
		var data = _self.assembleSaveData(action, realBillId);
		
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		openLoader(1,jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_15);
		_self.remoteCall({
			type:"post",
			method:"submitEffect",
			param:data,
			success : function(res) {
				closeLoader();
				var failMsg = "";
				if(res.submitNum - res.submitSuccessNum>0){
				   failMsg = jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_1 + (res.submitNum - res.submitSuccessNum)
				}
				shr.showInfo({message:jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_12 + res.submitNum
						+ jsBizMultLan.atsManager_cancelLeaveBillAllList_i18n_0 + res.submitSuccessNum + failMsg});
			    $("#grid").jqGrid().jqGrid("reloadGrid");
			}
		});
	}
	,initialFromAtsCalculate:function(){
		if( typeof ats_beginDate !="undefined" && typeof ats_endDate !="undefined" && ats_beginDate && ats_beginDate!="" && ats_endDate!=""){
			var temp = $("#fastFilter-area").shrFastFilter("option", "fastFilterItems");
			temp['entries.realLeaBeginTime_entries.realLeaEndTime'].values.startDate=ats_beginDate;
			temp['entries.realLeaBeginTime_entries.realLeaEndTime'].values.endDate=ats_endDate;
			$("#fastFilter-area").shrFastFilter("option", "fastFilterItems",temp);
			$("#entries--realLeaBeginTime_entries--realLeaEndTime-datestart").val(ats_beginDate);
			$("#entries--realLeaBeginTime_entries--realLeaEndTime-dateend").val(ats_endDate);
			$("#entries--realLeaBeginTime_entries--realLeaEndTime-datestart").trigger("change");
		}
	}	
	//重写onCellSelect方法，通过流程单据查询进入页面点击事件无效
	,onCellSelect: function(rowid, colIndex, cellcontent, e) {
		if (colIndex == 0) {
		if (!atsCalFlag){
			var _self = this;
			_self.selectedRowId = rowid;
			
			//选择的是选择框
			if (colIndex == 0) {
				return;
			}
			
			var billId = $(_self.gridId).jqGrid("getCell", rowid, _self.getBillIdFieldName());
			if( billId !="" && billId != undefined ){
				_self.viewAction(billId, rowid);
			}
			
		}else {
			return true;	
		}
		}
	}
	/*,initToolBars : function(){
	    var toolsHtml = '<div id="" class="btn-group"><button class=" shrbtn dropdown-toggle" data-toggle="dropdown" type="button">提交  '
		+'<span class="caret"></span></button><ul class="dropdown-menu pull-"><li id="submit" name="submit" type="" uipk=""><a href="javascript:;">提交工作流</a></li>'
		+  '<li id="submitEffect" name="submitEffect" type="" uipk=""><a href="javascript:;">提交生效</a></li>'
		+ '</ul></div>';
		
	   $(toolsHtml).insertAfter($(".shr-toolbar #addNew"));
	   $('#submit').shrButton({
						actionBinding: 'submitAction',
						subAction: '',
						customData: ""
	   });
	   $('#submitEffect').shrButton({
							actionBinding: 'customAction',
							subAction: 'submitEffectAction',
							customData: ''
	   });		
	}*/
});

