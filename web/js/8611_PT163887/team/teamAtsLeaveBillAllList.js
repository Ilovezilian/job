
var atsCalFlag = false ;//从考勤计算进入标志
shr.defineClass("shr.ats.team.TeamAtsLeaveBillAllList", shr.framework.List, {
	 
	initalizeDOM : function () {
		var that = this;
		that.atsCalTriger();
		//考勤计算页面，不响应列表点击事件
		if(atsCalFlag){
			that.editViewDisable = true;
			//$(this.gridId).get(0).p.colModel[1].formatter = '';
			
			var colModel = $(this.gridId).get(0).p.colModel;
			for(var i = 0;i < colModel.length;i++) {
				if(colModel[i].formatter == 'showlink') {
					colModel[i].formatter = '';
					break;
				}
			}
		}
		that.initialFromAtsCalculate();//重考勤计算进入，改变查询范围
        shr.ats.team.TeamAtsLeaveBillAllList.superClass.initalizeDOM.call(that);
        jsBinder.gridLoadComplete=function(data){
            shr.ats.team.TeamAtsLeaveBillAllList.superClass.gridLoadComplete.call(that,data);
			$("#grid_description").find(".s-ico").remove();//审批人字段数据库值全为空，不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_description").removeClass("ui-jqgrid-sortable");
			
//			if(atsCalFlag){
//				$('td[aria-describedby="grid_number"] a').css({"color": "#777","text-decoration": "none"});
//			}
		};
		setTimeout(function(){
			//为iframe添加高度重设
			if(this != top){
				$(window.parent.document.getElementById('detailOperationDialog-frame')).css('height','inherit');
			}
		}, 500);
	}
	
	,againstApproveAction : function(){
		
		var that = this ;
	
		var billId =  $(this.gridId).jqGrid("getSelectedRows");;
			
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
			shr.showError({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_33});
			return ;
		// }else if(billId.length > 1){
		// 	shr.showError({message: "只能选中一条记录进行反审批！"});
		// 	return ;
		}else{
			var billIds = that.getSelectedIds();
		
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.AtsBillAgainstApproveHelper&method=checkAgainstInfo";
			   shr.ajax({
				type:"post",
				async:false,
				data :{billIds:billIds} ,
				url:url,
				success:function(res){
					info = res;
					
				}
			});
			if(info!=null)
			{
				var error = jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_0 + "<br/>";
				var type = 1;
				
				if(info.auditInfo)
				{
					error = error + jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_21 + "[" +　info.auditInfo + " ]<br/>" ;	
					type = 2;
				}
				
				if(info.cancelInfoList)
				{
					error = error + jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_46 + "[" +　info.cancelInfoList + " ]<br/>" ;	
					type = 2;
				}
				
				if(type == 2)
				{
					shr.showError({message: error});
					return ;
				}
			}
		}
		
		//校验请假明细有没有生成汇总记录
		var hasSummary = false;
		var hasSalary = false;
		var msg = "";
		var salaryMsg = "";
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamAtsLeaveBillListHandler&method=checkDetailSummary";
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
			shr.showError({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_11+salaryMsg});
			return;
		}
		
		//
		var confirmStr = jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_23;
		if(hasSummary){
			confirmStr = msg;
		}
		shr.showConfirm(confirmStr, function(){
			var billIds = that.getSelectedIds();
            var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.team.AtsLeaveBillAll.list";
			   shr.remoteCall({
				type:"post",
				method:"againstApprove",
				param :{billIds:billIds} ,
				url:url,
				success:function(res){
					if(res.flag == "1")
					{
						shr.showInfo({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_9});
						that.queryGrid();
					}else{
						shr.showError({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_10});
					} 
				}
			});
		});
	}
	,atsCalTriger: function() {
		if (typeof(atsCalGobalParam)!="undefined")
		{
		    atsCalFlag=true;
		    
		}
	},
	/**
	 * 初始化页面时查询表格数据
	 * 重写此方法：从考勤计算进入页面不带高级搜索默认条件
	 */
	initalizeQueryGrid: function(){
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
	,
	queryGrid: function(){
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"entries.beginTime_entries.endTime","errorMessage":jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_30});
		if(dateRequiredValidate){
            shr.ats.team.TeamAtsLeaveBillAllList.superClass.queryGrid.call(this);
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
			var fastFilterItems = this.getFastFilterItems();
			if(fastFilterItems && fastFilterItems['entries.beginTime_entries.endTime'] && fastFilterItems['entries.beginTime_entries.endTime'].values){
				if(atsCalGobalParam.beginDate && atsCalGobalParam.beginDate != ""){
					params["beginDate"] = atsCalGobalParam.beginDate;
				}else {
					params["beginDate"] = this.getFastFilterItems()['entries.beginTime_entries.endTime'].values["startDate"];
				}
				if(atsCalGobalParam.endDate && atsCalGobalParam.endDate != ""){
					params["endDate"] = atsCalGobalParam.endDate;
				}else {
					params["endDate"] = this.getFastFilterItems()['entries.beginTime_entries.endTime'].values["endDate"];
				}
			} else {
				params["beginDate"] = atsCalGobalParam.beginDate;
				params["endDate"] = atsCalGobalParam.endDate;
			}
			params["attendanceGroupID"] = atsCalGobalParam.attendanceGroupID;
		}else {
			params["atsCalFalg"] = "0";
		}
		$(this.gridId).setGridParam({
			custom_params: shr.toJSON(params)
		});	
	}
	
	//返回到请假单专员列表,还需要复写"创建","查看"的方法 跳转到"专员请假单的form试图"
	/**
	 * 新增
	 */
	,addNewAction: function() {
		this.reloadPage({
            uipk: "com.kingdee.eas.hr.ats.app.team.AtsLeaveBillAllForm",
			method: 'addNew'
		});
	}
	,addNewBatchAction: function() {
		this.reloadPage({
            uipk: "com.kingdee.eas.hr.ats.app.team.AtsLeaveBillAllBatchForm",
			method: 'addNew'
		});
	}
	/**
	 * 个人列表-查看功能
	 */
	,viewAction: function(billId) {
		var _self = this;
		// 编辑界面禁用，则直接返回
		if (this.editViewDisable) {
			return;
		}
		var billType = $("#grid").jqGrid("getRowData",billId).billType;
		// 批量提交 
		if(billType=="2"){
			_self.reloadPage({
                uipk: "com.kingdee.eas.hr.ats.app.team.AtsLeaveBillAllBatchForm",
				billId: billId,
				method: 'view'
			});	
		// 普通提交	
		}else{
			_self.reloadPage({
                uipk: "com.kingdee.eas.hr.ats.app.team.AtsLeaveBillAllForm",
				billId: billId,
				method: 'view'
			});		
		}	
		
			
	}
	
	
	
	
	,abortBillAction : function (event) {
		
		    var realBillId = [];
			//var billId = this.selectedRowId;
		    var billId = $(this.gridId).jqGrid("getSelectedRows");
			if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({"message" : jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_28});
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
			shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_22, function(){
				top.Messenger().hideAll();			
				_self.remoteCall({
					type:"post",
					method:"abortBill",
					param:{billId:realBillId.toString()},
					success:function(res){
						shr.showInfo({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_3});
						_self.reloadGrid(); 
					}
				});
				
			});
		}
		,importDataAction:function(){
			//修改导入按钮为调用平台的方法
			this.doImportData('import');
		}
//	,importDataAction:function(){
//		var self = this ;
//		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil";
//			    url +='&uipk=com.kingdee.eas.hr.ats.app.team.AtsLeaveBillAll.list';
//			   shr.remoteCall({
//				type:"post",
//				method:"checkImportPermssion",
//				url:url,
//				success:function(res){
//					
//					self.doImportData('importData');//调用导入新方法
//					
////					self.doImportData("com.kingdee.eas.hr.ats.app.AtsLeaveBillEntry",undefined,undefined);
////					var  importHTML= ''
////						+ '<div id="photoCtrl">' 
////						+	'<p style="color:red;font-weight:400">温馨提示：为避免长时间等待，建议导入数据量不超过500条</p>'
////			/* 			+	'<div class="photoState">1. 上传文件不能修改模板文件的格式</div>'
////						+	'<div class="photoState">2. 支持上传文件格式为xls,xlsx的excel文件</div>'
////						+   '<br>'
////						+ 	'<p>请选择所需要的操作</p>'
////						+ 	'<div class="photoCtrlBox">'
////						+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked ></span></div>'
////						+       '<div class="photoCtrlUpload"><span>请选择上传文件</span></div>'
////						+		'<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
////						+ 		'<div style="clear:both"><span style="color:red;display:none" id="file_warring">未选择上传文件</span></div>'
////						+       '<br>'
////						+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="exportRadio" ></div>'
////						+       '<div class="photoCtrlUpload"><span>请假单模板下载 </span></div>'
////						+		'<div style="clear: both;"></div>'
////						+	'</div>' */
////						+ '</div>';
////					if ($.browser.msie) {  // 通过iframe 等方式来填充页面的
////						setTimeout(function(){
////							$('iframe')[0].contentWindow.$('#container').before(importHTML);
////						},3500); 
////						//this.addListenerNing(importHTML);
////					}else{  // 通过 div 等方式来填充页面的 
////						setTimeout(function(){
////							$('#container').before(importHTML);
////						},1000);
////					}
//				}
//			});
//		
//	    // 初始化上传按钮
//	/* 	$('#importRadio').shrRadio();
//		$('#exportRadio').shrRadio();
//	
//		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamAtsLeaveBillEditHandler&method=uploadFile";
//		//在点击确定前，对文件进行上传处理
//		var handleFlag = false;
//		   	swf: "jslib/uploadify/uploadify.swf",
//		    uploader: url,
//		    buttonText: "选择文件",
//		    buttonClass: "shrbtn-primary shrbtn-upload",
//		    fileTypeDesc: "Excel",
//		    fileTypeExts: "*.xls;*.xlsx",
//		    async: false,
//		    multi: false,
//		    removeCompleted: false,
//		    onUploadStart: function() {
//		    	//openLoader(0); //遮罩层
//			},
//			onUploadComplete: function(file) {
//				handleFlag = true;
//				$('#file_warring').hide();
//				//alert("onUploadSuccess 导入成功=="+JSON.stringify(data));
//				//shr.showInfo({message: '上传成功'});
//				//error_path = data;
//				//$('#photoCtrl').dialog('close');
//				//$(this).dialog( "close" );
//				//刷新表格
//				//$("#grid").jqGrid().jqGrid("reloadGrid");
//			}
//		});
//
//		$('#photoCtrl').dialog({
//			title: '请假单数据',
//			width: 600,
//			height: 450,
//			modal: true,
//			resizable: false,
//			position: {
//				my: 'center',
//				at: 'top+20%',
//				of: window
//			},
//			buttons: {
//		        "确认": function() {
//		        	if($('#exportRadio').shrRadio('isSelected')){
//		        		that.exportFileData();
//		        	}
//		        	else if($('#importRadio').shrRadio('isSelected')){
//		        		if(handleFlag){
//		        			that.importFileData();
//		        			$(this).dialog( "close" );
//		        			$('#photoCtrl').remove();
//		        			//window.location.reload();
//		        		}
//		        		else{
//		        			$('#file_warring').show();
//		        		}
//		        	}
//		        },
//		        "关闭": function() {
//		        	//var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=deleteFile";
//		        	//$.ajax({
//		        	//	url: url
//		        	//})
//		        	$(this).dialog( "close" );
//		        	$('#photoCtrl').remove();
//		        }
//		    }
//		}); */
//	}
	,importFileData: function(){
		//alert("读取服务器目录文件 解析");
		var that=this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamAtsLeaveBillEditHandler&method=importFileData";
		$.ajax({
			url: url,
			beforeSend: function(){
				openLoader(1);
			},
			success: function(msg){
				closeLoader();
				var tip="";
					tip =jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_24 + "<br/>";
					tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_6, [msg.totalNum]) + " <br/>" ;
					tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_5, [msg.successNum]) + " <br/>" ;
					if (msg.errorNum > 0) {
						tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_7, [msg.errorNum]) + " <br/>";
						tip = tip +  jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_8 + "<br/>" ;
						if (msg.personErrorNum > 0) {
							tip = tip +  "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_19, [msg.personErrorNum]) + " <br/>";
						}
						if (msg.dateErrorNum > 0) {
							tip = tip +  "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_35, [msg.dateErrorNum]) + " <br/>" ;
						}
						if (msg.typeAndUnitNum > 0) {
							tip = tip +  "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_15, [msg.typeAndUnitNum]) + " <br/>" ;
						}
						if(msg.beginDateErrorNum > 0){
							tip = tip +  "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_18, [msg.beginDateErrorNum]) + " <br/>" ;
						}
					    if(msg.endDateErrorNum > 0){
							tip = tip +  "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_16, [msg.endDateErrorNum]) + " <br/>" ;
						}
						if(msg.timePlusError > 0){
							tip = tip +  "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_17, [msg.timePlusError]) + " <br/>";
						}
						if(msg.leaveLengthError > 0){
							tip = tip +  "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_26, [msg.leaveLengthError]) + " <br/>" ;
						}
						if(msg.limitMessage > 0){
							if(msg.holidPNotError > 0){
								tip = tip +  " " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_41, [msg.holidPNotError]) + " <br/>";
							}
							if(msg.limitNoFindError > 0){
								tip = tip + "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_40, [msg.limitNoFindError]) + " <br/>";
							}
							if(msg.notEnoughError > 0){
								tip = tip + "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_1, [msg.notEnoughError]) + " <br/>";
							}
							if(msg.leapOverError > 0){
								tip = tip + "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_2, [msg.leapOverError]) + " <br/>" ;
							}
							
							if(msg.notDivideError > 0){
								tip = tip + "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_25, [msg.notDivideError]) + " <br/>" ;
							}
							if(msg.notApplySupperError > 0){
								tip = tip + "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_14, [msg.notApplySuppeError]) + " <br/>";
							}
							if(msg.notApplyError > 0){
								tip = tip + "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_13, [msg.notApplyError]) + " <br/>" ;
							}
							tip += jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_44 + "<br>" + msg.limitMessageStr;
						}
						
						if(msg.repeatNum > 0){
							tip = tip + "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_42, [msg.repeatNum]) + "<br/>" ;
							tip = tip + msg.repeatStr;
						}
						if(msg.intMessage > 0){
							tip = tip + "  " + shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_43, [msg.intMessage]) + "<br/>" ;
							tip = tip + jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_45 + "<br/>"
							tip = tip + msg.message;
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
				/*that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.ScheduleShift.list'
				});	
				*/
			},
			 error: function (XMLHttpRequest, textStatus, errorThrown) { 
                 alert(errorThrown); 
             } 
			/*
			error: function(){
				alert("error");
				closeLoader();
			}
			*/,
			complete: function(){
				closeLoader();
			}
		});
	}	
	,exportFileData: function(){
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamAtsLeaveBillListHandler&method=downloadFile";
		 location.href = url;
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
			message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_27
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
  ,cancelLeaveAction: function(){
		var that = this;
		var billId =  $(that.gridId).jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
			shr.showWarning({"message" : jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_28});
			return false;
		}
		that.remoteCall({
			type: "post",
			async: false,
			method:"getSubmitType",
			param:{billId:billId[0]},
			success: function(submitType) {
				if (submitType == 2) {
					that.dealWithBatchLeaveBill();
				} else {
					that.dealWithSingleLeaveBill();
				}
			},
			error:function(e) {
				shr.showWarning({message: e.summary});
			}
		});
	}	
	, dealWithBatchLeaveBill: function () {
	    var that = this;
		shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_48, function () {
			that.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.team.CancelLeaveBillAllForm",
				method: 'addNew'
			});
		});
	}, dealWithSingleLeaveBill: function () {
	    var that = this;
		var billIds = $(that.gridId).jqGrid("getSelectedRows");
		var leaveBillId = billIds[0];
		if (billIds.length > 1) {
			shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_32});
			return;
		}

		var isPass = false;
		that.remoteCall({
			type: "post",
			async: false,
			method: "getLeaveBillState",
			param: {billId: billIds[0]},
			success: function (res) {
				if (res.billState == 3) {
					isPass = true;
				}
			}
		});
		if (!isPass) {
			shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_31});
			return;
		}
		leaveBillId = $("#grid").jqGrid("getRowData", billIds)["entries.id"];
		var errorString = "";
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamCancelLeaveBillEditHandler&method=validateIsCancelLeave";
		$.ajax({
			dataType: "json",
			url: url,
			async: false,
			data: {
				billId: leaveBillId
			},
			success: function (res) {
				errorString = res.errorString;
			},error:function(e) {
				errorString =  e.summary;
			}
		});
		if (errorString) {
			shr.showWarning({message: errorString});
			return;
		}

		that.remoteCall({
			type: "post",
			async: false,
			method: "isHavenCancelLeave",
			param: {billId: leaveBillId},
			success: function (res) {
				if (res.isHavenCancelLeave == false) {
					that.reloadPage({
						uipk: "com.kingdee.eas.hr.ats.app.team.CancelLeaveBillAllForm",
						method: 'addNew',
						leaveBillId: leaveBillId,
						isFromPage: "Leave"
					});
				} else {
					shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_12});
				}
			},
			error: function(e) {
				shr.showWarning({message: e.summary});
			}
		});
	}
	/**
	 * 描述:删除操作
	 * @action 
	 */
	,deleteAction:function(){
    	var _self = this;
    	var billId = $(this.gridId).jqGrid("getSelectedRows");;
    	if(billId == undefined || billId.length<=0 || (billId && billId.length == 1 && billId[0] == "")){
    	    shr.showWarning({message : jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_28});
    	    return false;
    	}
		//var selectedIds = _self.getSelectedIds();
    	var selectedIds = shr.atsBillUtil.getSelectedIds();
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_34, function() {
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
		openLoader(1,jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_47); 
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(res) {
				closeLoader();
				if(res.alreadyInProcessQueueException == 1){
					shr.showError({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_4});
				}else if(res.error !="" && res.error!=null && res.error!=undefined ){
					shr.showError({message: res.error});
				}else{
					var failMsg = "";
					if(res.submitNum - res.submitSuccessNum>0){
					   failMsg = "，" + jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_36 + (res.submitNum - res.submitSuccessNum)
					}
					shr.showInfo({message: shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_37, [res.submitNum, res.submitSuccessNum]) + failMsg,hiddenAfter: 5});
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
				
	}
	
	,assembleSaveData: function(action,realBillId) {
		var _self = this;
		var billId = realBillId;
		var data = _self.prepareParam(action + 'Action');
		data.method = action;
		data.operateState = "LIST";
		data.billId = billId.join(",");
		return data;
	}
	/**
	 * 提交生效 
	 */
	,submitEffectAction : function (event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		var billId = $("#grid").jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({"message" : jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_28});
				return false;
		}
		shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_39, function() {
		    _self.prepareSubmitEffect(event, 'submitEffect');
		});
	}
	/**
	 * 提交生效 
	 */
	,prepareSubmitEffect : function (event, action){
//		var _self = this;
//		var billData = _self.selectedRowData;
//		var realBillId = [];
//		for(var i=0;i<billData.length;i++){
//		    var billState = billData[i]['billState'];
//		   if("未提交" == billState.alias && $.inArray(billData[i].id, realBillId) == -1){
//		      realBillId.push(billData[i].id);
//		   }
//		}
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
		   if(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_38 == billState && $.inArray(billId[i], realBillId) == -1){
		      realBillId.push(billId[i]);
		   }
		}
		if(realBillId.length == 0){
		    shr.showError({message: jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_20});
		    return;
		}
		var data = _self.assembleSaveData(action, realBillId);
		
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		openLoader(1,jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_47); 
		_self.remoteCall({
			type:"post",
			method:"submitEffect",
			param:data,
			success : function(res) {
				closeLoader();
				var failMsg = "";
				if(res.error !="" && res.error!=null && res.error!=undefined ){
					shr.showError({message: res.error});
				}else{
					if(res.submitNum - res.submitSuccessNum>0){
						failMsg = "，" + jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_36 + (res.submitNum - res.submitSuccessNum)
					}
					shr.showInfo({message: shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllList_i18n_37, [res.submitNum, res.submitSuccessNum]) + failMsg,hiddenAfter: 5});
					$("#grid").jqGrid().jqGrid("reloadGrid");					
				}
			}
		});
	}
	/**
	 * 排班修改请假重算
	 */
	,schedualRecalculateAction :function(){
		var _self = this;
		_self.reloadPage({
			uipk:"com.kingdee.eas.hr.ats.app.AtsLeaveBillRecalculate"
		});
	}
	,initialFromAtsCalculate:function(){
		if( typeof ats_beginDate !="undefined" && typeof ats_endDate !="undefined" && ats_beginDate && ats_beginDate!="" && ats_endDate!=""){
			var temp = $("#fastFilter-area").shrFastFilter("option", "fastFilterItems");
			temp['entries.beginTime_entries.endTime'].values.startDate=ats_beginDate;
			temp['entries.beginTime_entries.endTime'].values.endDate=ats_endDate;
			$("#fastFilter-area").shrFastFilter("option", "fastFilterItems",temp);
			atsMlUtile.setTransDateValue("#entries--beginTime_entries--endTime-datestart",ats_beginDate);
			atsMlUtile.setTransDateValue("#entries--beginTime_entries--endTime-dateend",ats_endDate);
//			$("#entries--beginTime_entries--endTime-datestart").val(ats_beginDate);
//			$("#entries--beginTime_entries--endTime-dateend").val(ats_endDate);
			$("#entries--beginTime_entries--endTime-datestart").trigger("change");
		}
	}
	//重写onCellSelect方法，通过流程单据查询进入页面点击事件无效
	,onCellSelect: function(rowid, colIndex, cellcontent, e) {
		if (colIndex == 0) {
		if (!atsCalFlag){
			var _self = this;
			_self.selectedRowId = rowid;
			
			// 选择的是选择框
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
});

