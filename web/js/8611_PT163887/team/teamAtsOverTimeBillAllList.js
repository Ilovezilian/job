//专员的列表需要的js 

var atsCalFlag = false ;//从考勤计算进入标志
shr.defineClass("shr.ats.team.TeamAtsOverTimeBillAllList", shr.framework.List, {

	initalizeDOM : function () {
		var that = this;
		that.atsCalTriger();
		//考勤计算页面，不响应列表点击事件
		if(atsCalFlag){
			that.editViewDisable = true;
			
			if($(this.gridId).get(0)){
			var colModel = $(this.gridId).get(0).p.colModel;
				for(var i = 0;i < colModel.length;i++) {
					if(colModel[i].formatter == 'showlink') {
						colModel[i].formatter = '';
						break;
					}
				}
			}
		}
		that.initialFromAtsCalculate();//重考勤计算进入，改变查询范围
		shr.ats.team.TeamAtsOverTimeBillAllList.superClass.initalizeDOM.call(this);
		jsBinder.gridLoadComplete=function(data){
			$("#grid_description").find(".s-ico").remove();//审批人字段数据库值全为空，不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_description").removeClass("ui-jqgrid-sortable");
			shr.ats.team.TeamAtsOverTimeBillAllList.superClass.gridLoadComplete.call(that,data);
			// $("#grid").closest(".ui-jqgrid-bdiv").css('height','650px');
			// $("#gview_grid .frozen-bdiv.ui-jqgrid-bdiv").css("height", ($(".ui-jqgrid-bdiv:first").height() - 10) + "px");
		}

	}
	
	
	,atsCalTriger: function() {
		if (typeof(atsCalGobalParam)!="undefined")
		{
		    atsCalFlag=true;
		}
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
	},
	queryGrid: function(){
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"entries.otDate","errorMessage":jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_8});
		if(dateRequiredValidate){
			shr.ats.team.TeamAtsOverTimeBillAllList.superClass.queryGrid.call(this);
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
	
	//返回到加班单专员列表,还需要复写"创建","查看"的方法 跳转到"专员加班单的form试图"
	/**
	 * 新增
	 */
	,addNewAction: function() {
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.team.AtsOverTimeBillAllForm",
			method: 'addNew'
		});
	}
	,addNewBatchAction: function() {
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.team.AtsOverTimeBillAllBatchForm",
			method: 'addNew'
		});
	}
	/**
	 * 个人列表-查看功能
	 */
	,viewAction: function(billId) {
		var _self = this;
		var billSubmitType = $("#grid").jqGrid("getRowData",billId).billSubmitType;
		// 批量提交
		if(billSubmitType=="2" || billSubmitType == "3"){
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.team.AtsOverTimeBillAllBatchForm",
				billId: billId,
				method: 'view'
			});	
		// 普通提交
		}else{
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.team.AtsOverTimeBillAllForm",
				billId: billId,
				method: 'view'
			});		
		}
		
	}
	/**
	 * 撤回单据
	 */
	,abortBillAction : function (event) {
		    var realBillId = [];
			var billId = $("#grid").jqGrid("getSelectedRows");
			if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_7});
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
			shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_5, function(){
				top.Messenger().hideAll();
				 _self.remoteCall({
				 	type:"post",
					method:"abortBill",
					param:{billId:realBillId.toString()},
					success:function(res){
						shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_1});
						_self.reloadGrid(); 
					}
				});
				
			});
		}
	/**
	 * 反审批单据
	 */
	,againstApproveAction : function () {
		var _self = this;
		_self.beforeAgainstApproveAction();
	}
	/**
	 * 反审批前动作
	 */
	,beforeAgainstApproveAction : function () {
		var billId = $("#grid").jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
			shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_7});
			return ;
		}
		var realBillId = [];
		var billLength = billId.length;
		for(var i=0;i<billLength;i++){
			//去除重复处理
			if($.inArray(billId[i], realBillId) == -1){
				realBillId.push(billId[i]);
			}
		}
		//支持批量反审批
		// if(realBillId.length>1){
		// 	shr.showWarning({message: "请选中一行！"});
		// 	return ;
		// }
		var _self = this;
		shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_4, function(){
			top.Messenger().hideAll();
			
			var data = {
				method: 'beforeAgainstApprove'
			};
			data = $.extend(_self.prepareParam(), data);
			data.billId = realBillId.join(",")
			
			// shr.doAction({
			// 	url: _self.dynamicPage_url,
			// 	type: 'post', 
			// 	data: data,
			// 	success : function(response) {
			// 		var confirmMessage = "";
			// 		if(response.turned == "1"){
			// 			confirmMessage = "该加班单参与了加班转调休计算，反审批可能会影响调休额度，确认反审批吗？";
			// 		}else if(response.turned == "2"){
			// 			var turnedInfos = response.turnedInfos;
			// 			var infos = "";
			// 			for(var i=0; i<turnedinfos.length; i++){
			// 				var infos = infos + turnedInfos[i] + "、";
			// 			}
			// 			infos = infos.substring(0,infos.length-1);
			// 			confirmMessage = "选中记录中存在加班单参与了加班转调休计算，反审批可能会影响调休额度。\n参与了加班转调休的加班单：" + infos + "\n确认反审批吗？";
			// 		}
			// 		if(confirmMessage != ""){
			// 			shr.showConfirm(confirmMessage, function(){
			// 				_self.doAgainstApproveAction(billId);
			// 			});
			// 		}else{
			// 			_self.doAgainstApproveAction(billId);
			// 		}
			// 	}
			// });	
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsOverTimeBillListHandler";
			shr.remoteCall({
				url: url,
				type:"post",
				method:"beforeAgainstApprove",
				param: data,
				success:function(res){
					var confirmMessage = "";
					// if(res.turned == "1"){
					// 	confirmMessage = "该加班单参与了加班转调休计算，反审批可能会影响调休额度，确认反审批吗？";
					// }else if(res.turned == "2"){
					// 	var turnedInfos = res.turnedInfos;
					// 	var infos = "";
					// 	for(var i=0; i<turnedinfos.length; i++){
					// 		var infos = infos + turnedInfos[i] + "、";
					// 	}
					// 	infos = infos.substring(0,infos.length-1);
					// 	confirmMessage = "选中记录中存在加班单参与了加班转调休计算，反审批可能会影响调休额度。\n参与了加班转调休的加班单：" + infos + "\n确认反审批吗？";
					// }
					var turned = res.turned;
					var turnedInfos = res.turnedInfos;
					if(turnedInfos != undefined && turnedInfos != ""){
						// var infos = "";
						// for(var i=0; i<turnedInfos.length; i++){
						// 	var infos = infos + turnedInfos[i] + "、";
						// }
						// infos = infos.substring(0,infos.length-1);
						confirmMessage = jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_16 
							+ '<br>' 
							+ jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_0 
							+ turnedInfos + "<br>" 
							+ jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_9;
					}
					if(res.errorMsgList && res.errorMsgList != ''){
						shr.showWarning({message: res.errorMsgList});
						return ;
					}else {
						if(confirmMessage != ""){
							shr.showConfirm(confirmMessage, function(){
								_self.doAgainstApproveAction(billId);
							});
						}else{
							_self.doAgainstApproveAction(billId);
						}
					}
				}
			});
			
		});
	}
	,doAgainstApproveAction: function(billId){
		var _self = this;
		top.Messenger().hideAll();
		var billIds = "";
		for(var i=0; i<billId.length; i++){
			billIds += billId[i] + ",";
		}
		billIds = billIds.substring(0,billIds.length-1);
		var data = {
			method: 'againstApprove',
			billId: billIds
		};
		data = $.extend(_self.prepareParam(), data);
		data.billId = billIds;
		shr.remoteCall({
			url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsOverTimeBillListHandler",
			type:"post",
			method:"againstApprove",
			param: data,
			success:function(res){
				if(res && res.msg !== ''){
					shr.showInfo({message:res.msg});
				}
				_self.reloadGrid();
			}
		});
	}
	/*
	//excel导入
	,importAction: function(){
		var that = this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil";
			    url +='&uipk=com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllList';
			   shr.remoteCall({
				type:"post",
				method:"checkImportPermssion",
				url:url,
				success:function(res){
					var curIOModelString = "com.kingdee.eas.hr.ats.app.AtsOverTimeBillEntry";
					that.doImportData(curIOModelString);
				}
			});
	}
	*/
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
			message: jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_6
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
    	    shr.showWarning({message : jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_7});
    	    return false;
    	}
		var selectedIds = shr.atsBillUtil.getSelectedIds();
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_10, function() {
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
		openLoader(1,jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_17); 
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(res) {
				closeLoader();
				if(res.alreadyInProcessQueueException == 1){
					shr.showError({message: jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_2});
				}else{
					var failMsg = "";
					if(res.submitNum - res.submitSuccessNum>0){
					   failMsg = "，" 
						   + jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_12 + (res.submitNum - res.submitSuccessNum)
					}
					shr.showInfo({message:jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_18 + res.submitNum 
						+ "，" 
						+ jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_11 
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
	}
	,submitEffectAction : function (event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		var billId = $("#grid").jqGrid("getSelectedRows");
    	if(billId == undefined || billId.length<=0 || (billId && billId.length == 1 && billId[0] == "")){
    	    shr.showWarning({message : jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_7});
    	    return false;
    	}
		shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_15, function() {
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
		   if(jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_14 == billState && $.inArray(billId[i], realBillId) == -1){
		      realBillId.push(billId[i]);
		   }
		}
		if(realBillId.length == 0){
		    shr.showError({message: jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_3, hiddenAfter: 5});
		    return;
		}
		var data = _self.assembleSaveData(action, realBillId);
		
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		openLoader(1,jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_17); 
		_self.remoteCall({
			type:"post",
			method:"submitEffect",
			param:data,
			success : function(res) {
				closeLoader();
				var failMsg = "";
				if(res.submitNum - res.submitSuccessNum>0){
				   failMsg = "，" 
					   + jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_12 
					   + (res.submitNum - res.submitSuccessNum)
				}
				shr.showInfo({message:jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_13 + res.submitNum 
					+ "，" 
					+ jsBizMultLan.atsManager_atsOverTimeBillAllList_i18n_11 
				+ res.submitSuccessNum + failMsg});
			    $("#grid").jqGrid().jqGrid("reloadGrid");
			}
		});
		closeLoader();
	}
	/*,downloadExcelTmplAction:function(){
		var _self = this;
		var data = {
			method: "downloadExcelTmpl" 
		};
		data = $.extend(_self.prepareParam(), data);
		var url=_self.dynamicPage_url;
		 url = this.dynamicPage_url + "?method=downloadExcelTmpl" + "&uipk=" + data.uipk;  
		//标题		
		url += "&title=加班申请";
		//window.location.href= shr.getContextPath()+"/dynamic.do?method=downloadExcelTmpl&uipk=com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllList";
		window.location.href=url;
	}
	,importFromExcelAction:function(){
	 
		var _self = this;
		$('#photoCtrl').remove();
		var handleFlag=false;
		var importDiv = ''
			+ '<div id="photoCtrl">' 
			+	'<p>导入说明</p>'
			+	'<div class="photoState">1. 注意导入数据的格式</div>'
			+	'<div class="photoState">2. 支持导入格式为xls,xlsx的excel文件</div>'
			+ 	'<p>请选择所需要的操作</p>'
			+ 	'<div class="photoCtrlBox">'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked></div>'
			+		'<div class="photoCtrlUpload"><span>选择导入的文件</span></div>'
			+		'<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+   '<input type="hidden" name="importFileName" id="importFileName">'
			+ 	'<div class="photoCtrlBox">'
			+			'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="exportRadio"></div>'
			+			'<div class="photoCtrlUpload"><span>下载加班单导入模板 </span></div>'  
			+		    '<div style="clear: both;"></div>'
			+   '</div>'
			+ '</div>';
		$(document.body).append(importDiv);
		$('#importRadio, #exportRadio').shrRadio();
		var data = {
			method: "uploadTxtData" 
		};
		data = $.extend(_self.prepareParam(), data);
		var url=_self.dynamicPage_url + "?method=uploadTxtData&uipk="+data.uipk;
			
		// 初始化上传按钮
		
		    swf: "jslib/uploadify/uploadify.swf",
		    uploader: url,
		    buttonText: "选择文件",
		    buttonClass: "shrbtn-primary shrbtn-upload",
		    fileTypeDesc: "Excel文件",
		    fileTypeExts: "*.xls;*.xlsx",
		    async: false,
		    multi: false,
		    removeCompleted: false,
		    //fileObjName:'file_upload',
		    onUploadStart: function() {
		    	//openLoader(0); //遮罩层
			},
			onUploadSuccess: function(file, data, response) {
				//alert("onUploadSuccess 导入成功=="+JSON.stringify(data));
				handleFlag = true;
			//	$("#txtFileName").val(data);
			
				//shr.showInfo({message: '上传成功'});
			//$('#photoCtrl').dialog('close');
			//$('#photoCtrl').remove();
				//$(this).dialog( "close" );
				//刷新表格
				$("#grid").jqGrid().jqGrid("reloadGrid");
			}
		});
		
		$('#photoCtrl').dialog({
			title: ' 加班单数据导入',
			width: 600,
			height: 480,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+20%',
				of: window
			}
			,buttons: {
		        "确认": function() {
		        	if($('#importRadio').shrRadio('isSelected')){
		        		 if(handleFlag){
						 _self.importFileData();
						 }else{
						 	shr.showError({
									message : "未选择导入的文件！"
									});
						 }
		        	}else if($('#exportRadio').shrRadio('isSelected')){
		        		 _self.downloadExcelTmplAction();
		        	}
		        },
		        "关闭": function() {
		        	$(this).dialog( "close" );
		        	$('#photoCtrl').remove();
		        }
		    }
		});
	},
	
	// 校验 数据 并保存到数据库里
	importFileData: function(){
		//alert("读取服务器目录文件 解析");
		var that=this;
		
		var atsImportPlan = $('#AtsImportPlan').shrPromptBox('getValue');
		if ( atsImportPlan == null) {
			shr.showInfo({message: '请选择数据导入方案！'}); 
			return false;
		}
		var txtFileName = $("#txtFileName").val();
		
		//shr.getContextPath()+ "/atsPunchCardRecord.do?method=importTxtData",
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsOverTimeBillListHandler&method=importOverTimeBill";
		//url += "&calSchemeId=" + encodeURIComponent($cmpschemeid);
		
		$.ajax({
			url: url,
			data: {
				importPlanId:atsImportPlan.id, 
				txtFileName: txtFileName
			},
			beforeSend: function(){
				openLoader(1);
			},
			success: function(msg){
				closeLoader();
				var tip="";				
				if((msg.importantError==null||msg.importantError=="")&&(msg.realTotalNum==null||msg.realTotalNum=="")){
				shr.showError({message: "导入异常，请检查您的导入模板和导入数据"});
				}else{
				if(msg.importantError!=null&&msg.importantError!=""){
				shr.showError({message: msg.importantError});
				}else{
				 realTotalNum = msg.realTotalNum;
				 successTotalNum = msg.successTotalNum;
				 failTotalNum = msg.failTotalNum;
				var tip="";
					tip ="打卡数据导入完毕<br/>";
					tip = tip +  " 导入的文件中共" + realTotalNum+ "条记录<br/>" ;
					tip = tip +  " 导入成功的记录有" + successTotalNum + "条<br/>" ;
				
				if (msg.failTotalNum > 0) {
						tip = tip +  " <font color='red'>导入失败" + failTotalNum + "条</font><br/>" ;
						tip = tip +  "导入失败的原因如下：<br/>" ;
						for(i=0;i<msg.errorStringList.length;i++){
							tip = tip + "  <font color='red'> " +　msg.errorStringList[i] + "</font><br/>" ;
						}
					}
				var options={
				   message:tip
				};
				$.extend(options, {
					type: 'info',
					hideAfter: null,
					showCloseButton: true
				});
				top.Messenger().post(options);
				$('#photoCtrl').remove();
				// 刷新表格
				$("#grid").jqGrid().jqGrid("reloadGrid");
				}
				}
			},
			error: function(){
			
				closeLoader();
			},
			complete: function(){
			
				closeLoader();
			}
		});
	}*/
	,initialFromAtsCalculate:function(){
		if( typeof ats_beginDate !="undefined" && typeof ats_endDate !="undefined" && ats_beginDate && ats_beginDate!="" && ats_endDate!=""){
			var temp = $("#fastFilter-area").shrFastFilter("option", "fastFilterItems");
			temp['entries.otDate'].values.startDate=ats_beginDate;
			temp['entries.otDate'].values.endDate=ats_endDate;
			$("#fastFilter-area").shrFastFilter("option", "fastFilterItems",temp);
			$("#entries--otDate-datestart").val(ats_beginDate);
			$("#entries--otDate-dateend").val(ats_endDate);
			$("#entries--otDate-datestart").trigger("change");
		}
	}
	//重写onCellSelect方法，通过流程单据查询进入页面点击事件无效
	,onCellSelect: function(rowid, colIndex, cellcontent, e) {
		if (!atsCalFlag){
			shr.ats.team.TeamAtsOverTimeBillAllList.superClass.onCellSelect.call(this,rowid, colIndex, cellcontent, e);
		}else {
			return true;	
		}
	}
});