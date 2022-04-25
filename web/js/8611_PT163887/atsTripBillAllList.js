var atsCalFlag = false ;//从考勤计算进入标志

shr.defineClass("shr.ats.AtsTripBillAllList", shr.framework.List, {
	initalizeDOM : function () {
		var that = this;
		atsTimeZoneService.initTimeZoneForList("timeZone.name");
		that.atsCalTriger();
		//考勤计算页面，不响应列表点击事件
		if(atsCalFlag){
			that.editViewDisable = true;
			
			var colModel = $(this.gridId).get(0).p.colModel;
			for(var i = 0;i < colModel.length;i++) {
				if(colModel[i].formatterForShowlink == 'showlink') {
					colModel[i].formatterForShowlink = '';
					break;
				}
			}
		}
		that.initialFromAtsCalculate();//重考勤计算进入，改变查询范围
		shr.ats.AtsTripBillAllList.superClass.initalizeDOM.call(this);
		//$('#addNew').eq(0).remove();
		//$('.btn-group').eq(0).insertBefore($('#delete').eq(0));	
		jsBinder.gridLoadComplete=function(data){
			$("#grid_description").find(".s-ico").remove();//审批人字段数据库值全为空，不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_description").removeClass("ui-jqgrid-sortable");
			var $grid = $(this);
			var offset = 55;
			var newGridHeight = $(window).height() - $('#gbox_grid').offset().top - offset;
			var gridHeight = $grid.height() + $('.ui-jqgrid-htable').height();
			var ht;
			if(gridHeight >= $(window).height() || gridHeight>newGridHeight){
				ht = newGridHeight;
				$grid.jqGrid("setGridHeight", ht);
				$grid.jqGrid("resizeGrid",{ base: $grid, offset:0 });
				shr.setIframeHeight();
			}
			
		}
		$("#pushToAssBill").hide();
	}
	/*,importAction: function(){
		var _self = this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil";
			    url +='&uipk=com.kingdee.eas.hr.ats.app.AtsTripBillAllList';
			   shr.remoteCall({
				type:"post",
				method:"checkImportPermssion",
				url:url,
				success:function(res){
				_self.doImportData("showImportPage"); 
				//	shr.ats.AtsTripBillAllList.superClass.importAction.call(this);
				}
			});
		
	}*/
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
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"entries.tripStartTime_entries.tripEndTime","errorMessage":jsBizMultLan.atsManager_atsTripBillAllList_i18n_10});
		if(dateRequiredValidate){
			shr.ats.AtsTripBillAllList.superClass.queryGrid.call(this);
			setTimeout(function() {
				var $grid = $(this.gridId);
				var offset = 45;
				var newGridHeight = $(window).height() - $('#gbox_grid').offset().top - offset;
				var gridHeight = $grid.height() + $('.ui-jqgrid-htable').height();
				var ht = gridHeight > newGridHeight ? gridHeight : newGridHeight
				$grid.jqGrid("setGridHeight", ht);
				$grid.jqGrid("resizeGrid",{ base: $grid, offset:0 });
				shr.setIframeHeight();
			}, 500);
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
			if(fastFilterItems && fastFilterItems['entries.tripStartTime_entries.tripEndTime'] && fastFilterItems['entries.tripStartTime_entries.tripEndTime'].values){
				params["beginDate"] = this.getFastFilterItems()['entries.tripStartTime_entries.tripEndTime'].values["startDate"];
				params["endDate"] = this.getFastFilterItems()['entries.tripStartTime_entries.tripEndTime'].values["endDate"];
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
	
	//返回到出差单专员列表,还需要复写"创建","查看"的方法 跳转到"专员出差单的form试图"
	/**
	 * 新增
	 */
	,addNewAction: function() {
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillAllForm",
			method: 'addNew'
		});
	}
	
	,batchNewAction: function() {
		var _self = this;
		_self.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillBatchNew",
			method: 'addNew'
		});
	}
	
	/*
	//excel导入
	,importAction: function(){
		var that = this ;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil";
			    url +='&uipk=com.kingdee.eas.hr.ats.app.AtsTripBillAllList';
			   shr.remoteCall({
				type:"post",
				method:"checkImportPermssion",
				url:url,
				success:function(res){
					var curIOModelString = "com.kingdee.eas.hr.ats.app.AtsTripBillEntry";
					//that.doImportData(curIOModelString);
					_self.doImportData("showImportPage"); 
				}
			});
		
	}
	*/
	/**
	 * 个人列表-查看功能
	 */
	,viewAction: function(billId) {
		var _self = this;
		var billType = $("#grid").jqGrid("getRowData",billId).billType;
		// 批量提交 
		if(billType=="2"){
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillBatchNew",
				billId: billId,
				method: 'view'
			});	
		// 	普通提交
		}else{
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillAllForm",
				billId: billId,
				method: 'view'
			});		
		}	
	}
	/*,downloadExcelTmplAction:function(){
		var _self = this;
		var data = {
			method: "downloadExcelTmpl" 
		};
		data = $.extend(_self.prepareParam(), data);
		var url=_self.dynamicPage_url;
		//window.location.href= shr.getContextPath()+"/dynamic.do?method=downloadExcelTmpl&uipk=com.kingdee.eas.hr.ats.app.AtsTripBillAllList";
		window.location.href=url+"?method=downloadExcelTmpl&uipk="+data.uipk;
	}
	,importFromExcelAction:function(){
		var _self = this;
		$('#photoCtrl').remove();
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
			+			'<div class="photoCtrlUpload"><span>下载出差单导入模板 </span></div>'  
			+		    '<div style="clear: both;"></div>'
			+   '</div>'
			+ '</div>';
		$('#containerDiv').append(importDiv);
		$('#importRadio, #exportRadio').shrRadio();
		
		var data = {
			method: "importFromExcel" 
		};
		data = $.extend(_self.prepareParam(), data);
		var url=_self.dynamicPage_url + "?method=importFromExcel&uipk="+data.uipk;
		
		var data = {
			method: "uploadTxtData" 
		};
		data = $.extend(_self.prepareParam(), data);
		var url=_self.dynamicPage_url + "?method=uploadTxtData&uipk="+data.uipk;
		var handleFlag = false;	
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
			onUploadSuccess: function(file, data, response) {//上传导入数据
				handleFlag = true;
				closeLoader();
				$("#txtFileName").val(data);
				$("#grid").jqGrid().jqGrid("reloadGrid");
				
				top.Messenger().hideAll();
				
				console.log(data)
				var msg=jQuery.parseJSON(data);
				msg.data=jQuery.parseJSON(msg.data);
				if (msg.data.occurException) {
					var options={
					   message: msg.data.exceptionMsg
					};
					$.extend(options, {
						type: 'info',
						hideAfter: null,
						showCloseButton: true
					});
					top.Messenger().post(options);
				} else {
					var tip ="数据导入完毕<br/>";
					tip = tip +  "导入的文件中共" + msg.data.totalCount + "条记录<br/>" ;
					tip = tip +  "导入成功" + msg.data.successCount + "条<br/>" ;
					if(msg.data.failCount>0){
						tip = tip +  "导入失败" + msg.data.failCount + "条<br/>" ;
						tip = tip +  "导入失败的原因如下：<br/>" ;
						tip = tip +  "数据格式不对、缺失必填项的数据有" + msg.data.notValidateCount + "条<br/>" ;
						tip = tip +  "重复的数据有" + msg.data.repeatCount + "条<br/>" ;
						tip = tip +  "详细信息如下：<br/>" ;
						tip = tip +  msg.data.detailMsg ;
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
				}
				
				$('#photoCtrl').dialog('close');
				$('#photoCtrl').remove();
				
			}
		});
		
		$('#photoCtrl').dialog({
			title: ' 出差单数据导入',
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
				
		        "确认": function() {
		        	if($('#importRadio').shrRadio('isSelected')){
		        		 
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
	}
	
	// 校验 数据 并保存到数据库里
	,importFileData: function(){
		//alert("读取服务器目录文件 解析");
		var that=this;
		
		var atsImportPlan = $('#AtsImportPlan').shrPromptBox('getValue');
		if ( atsImportPlan == null) {
			shr.showInfo({message: '请选择数据导入方案！'}); 
			return false;
		}
		var txtFileName = $("#txtFileName").val();
		
		//shr.getContextPath()+ "/atsPunchCardRecord.do?method=importTxtData",
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsTripBillListHandler&method=importFromExcel";
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
			success: function(res){
				top.Messenger().hideAll();
				
				console.log(res)
				var msg=jQuery.parseJSON(res);
				var msg=jQuery.parseJSON(res.data);
			//	var s=msg.data.occurException ;
			//	var s2=msg.data.exceptionMsg ;
			//	var s3=msg.data.totalCount ;
				//msg=jQuery.parseJSON(msg.data);
				debugger;
				if (msg.occurException != undefined) {
					var options={
					   message: msg.exceptionMsg
					};
					$.extend(options, {
						type: 'info',
						hideAfter: null,
						showCloseButton: true
					});
					top.Messenger().post(options);
				} else {
					var tip ="数据导入完毕<br/>";
					tip = tip +  "导入的文件中共" + msg.totalCount + "条记录<br/>" ;
					tip = tip +  "导入成功" + msg.successCount + "条<br/>" ;
					if(msg.failCount>0){
						tip = tip +  "导入失败" + msg.failCount + "条<br/>" ;
						tip = tip +  "导入失败的原因如下：<br/>" ;
						tip = tip +  "数据格式不对、缺失必填项的数据有" + msg.notValidateCount + "条<br/>" ;
						tip = tip +  "重复的数据有" + msg.repeatCount + "条<br/>" ;
						tip = tip +  "详细信息如下：<br/>" ;
						tip = tip +  msg.detailMsg ;
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
				}
				
				$('#photoCtrl').dialog('close');
				$('#photoCtrl').remove();
				
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
	,abortBillAction : function (event) {
		
		    var realBillId = [];
			var billId = $("#grid").jqGrid("getSelectedRows");
			
			if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({"message" : jsBizMultLan.atsManager_atsTripBillAllList_i18n_9});
				return false;
		    }

			var billLength = billId.length;
			for(var i=0;i<billLength;i++){
				//去除重复处理
				if($.inArray(billId[i], realBillId) == -1){
					realBillId.push(billId[i]);
				}
			}
			
			var _self = this;
			shr.showConfirm(jsBizMultLan.atsManager_atsTripBillAllList_i18n_7, function(){
				top.Messenger().hideAll();
				
				_self.remoteCall({
					type:"post",
					method:"abortBill",
					param:{billId:realBillId.toString()},
					success:function(res){
						shr.showInfo({message: jsBizMultLan.atsManager_atsTripBillAllList_i18n_2});
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
		return '/s-HR/Attendance/TripBill';
	},
	
	/**
	 * 套打dataProvider
	 * 重写此方法
	 */
	getTemplateDataProvider: function() {
		return 'com.kingdee.shr.ats.web.templatePrint.TripBillPrintHelpDataProvider';
	}
	
	
	/**
	 * 套打获取套打ID
	 * 重写此方法：获取当前页选中行的分录ID
	 * 解决当以主表ID作为套打ID时，多分录场景下，只有第一条单据审批意见完整，其余都只显示一条的问题
	 */
	,getTemplatePrintId: function() {
		var templatePrintId = "";
		var selectedRows = $('#grid input:checked').parents("tr").children("td[aria-describedby='grid_entries.id']");
		
		var selectedRowsLen = selectedRows.length;
		if (selectedRowsLen==0){
			shr.showWarning({
			message: jsBizMultLan.atsManager_atsTripBillAllList_i18n_8
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
		
	
//	,getTemplatePrintId: function() {
//		var templatePrintId = "";
//		var rows = $('#grid').getGridParam("reccount");
//		for (var i = 1;i<=rows;i++){
//			if ( $("#grid tr:eq("+i+")").attr("aria-selected")=="true"){
//				templatePrintId += ($("#grid tr:eq("+i+")").attr("id")+",");
//			}
//		}
//		if (templatePrintId!=""){
//			templatePrintId = templatePrintId.substring(0,templatePrintId.length-1);
//			return templatePrintId;
//		}else {
//			shr.showWarning({
//			message: "请先选中表格中的数据!"
//			});
//		}
//		
//	}
	
	/**
	 * add by aniskin_guosj 2015-07-21
	 * 反审批出差单
	 * 支持同时多个反审批
	 */
	,againstApproveAction : function () {
		var _self = this;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length==0 || (billIds && billIds.length == 1 && billIds[0] == "")) {
			shr.showWarning({message: jsBizMultLan.atsManager_atsTripBillAllList_i18n_9});
			return false;
	    }
	    
	    billIds = unique(billIds);//去除重复项目（批量单据）
	    var rows = billIds.length;
	    var actualRows = 0;
	    var billIdString = "";
		var checkBillId = "";
		var realBillId = "";
	    
		var selectLength = billIds.length;
	    for (var i in billIds){
	    	var tempBillState = $("#grid").jqGrid("getRowData", billIds[i]).billState;
			var billType = $("#grid").jqGrid("getRowData", billIds[i]).billType;
	    	if (tempBillState==3) {
	    		actualRows++;
	    		billIdString+=billIds[i]+",";
	    	}
			
			if(tempBillState == 3){
				//审批通过并且是单人出差的才要校验是否已经确认过。
				checkBillId += billIds[i]+",";
			}
	    }
		billIdString = billIdString.substring(0,billIdString.length-1);
		checkBillId = checkBillId.substring(0,checkBillId.length-1);
		var errorTripBillNum = "";
		var isCalOtTripBill = "";
		_self.remoteCall({
			type:"post",
			async: false,
			method:"checkAgainst",
			param:{checkBillId:checkBillId},
			success:function(res){
				var billIdArr = billIdString.split(",");
				var billIdArrLength = billIdArr.length;
				isCalOtTripBill = res.isCalOtTripBill;
				for(var i = 0; i < billIdArrLength; i++){
					var billId = billIdArr[i];
					var tripBillNum = res[billId];
					if(tripBillNum){
						actualRows--;
						errorTripBillNum += tripBillNum + ",";
					}else{
						realBillId += billIdArr[i] + ",";
					}
				}
			}
		});

		
		var msg = "";
		errorTripBillNum = errorTripBillNum.substring(0,errorTripBillNum.length-1);
	    var tips=jsBizMultLan.atsManager_atsTripBillAllList_i18n_6;
	    if (actualRows==0) {
			msg = jsBizMultLan.atsManager_atsTripBillAllList_i18n_22;
	    	shr.showWarning({message: msg});
			return;
	    }else if (actualRows!=rows){
			if(!errorTripBillNum || errorTripBillNum.length == 0){
				//tips = "选中记录中有部分单据处于非“审批通过”状态，您确认对选中单据进行反审批吗？";
				tips = jsBizMultLan.atsManager_atsTripBillAllList_i18n_24 + "<br/>";
				if(isCalOtTripBill){
				tips += jsBizMultLan.atsManager_atsTripBillAllList_i18n_23 + "<br/>"
					 + isCalOtTripBill + 
					 "<br/>" + jsBizMultLan.atsManager_atsTripBillAllList_i18n_16;
				}
			}else if(errorTripBillNum.length > 0){
				tips = jsBizMultLan.atsManager_atsTripBillAllList_i18n_25 + "[" + errorTripBillNum + "]<br/>"
				if(isCalOtTripBill){
					tips += jsBizMultLan.atsManager_atsTripBillAllList_i18n_23 + "<br/>"
					 + isCalOtTripBill + 
					 "<br/>" + jsBizMultLan.atsManager_atsTripBillAllList_i18n_16;
				}else{
					tips+=jsBizMultLan.atsManager_atsTripBillAllList_i18n_16
				}
				
			}
	    }else if(isCalOtTripBill && isCalOtTripBill.length > 0){
			tips = jsBizMultLan.atsManager_atsTripBillAllList_i18n_23 + isCalOtTripBill
				+ jsBizMultLan.atsManager_atsTripBillAllList_i18n_16;
		}
		
	    realBillId = realBillId.substring(0,realBillId.length-1);
		
		//新增反审批原因	    
	    var serviceId = shr.getUrlRequestParam("serviceId");
		$("#orgFillDiv").attr("src", shr.getContextPath() + '/dynamic.do?checkLicense=true&uipk=com.kingdee.eas.hr.ats.app.AtsBill.reason' + '&serviceId=' + encodeURIComponent(serviceId));
		$('#orgFillDiv').dialog({
			title: jsBizMultLan.atsManager_atsTripBillAllList_i18n_29,
			width: 900,
			height: 400,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+20%',
				of: window
			},
			open: function (event, ui) {
			},
			buttons: [{
				text: jsBizMultLan.atsManager_atsTripBillAllList_i18n_15,
				click: function() {						
					$(this).dialog( "close" );
					var reason = $("#orgFillDiv #reason").val();
					if (reason) {		
						shr.showConfirm(tips, function(){
								top.Messenger().hideAll();

								var data = {
									method: 'againstApprove',
									billId: billIdString,
									reason:reason.substring(0,400)
								};
								data = $.extend(_self.prepareParam(), data);

								shr.doAction({
									url: _self.dynamicPage_url,
									type: 'post', 
										data: data,
										success : function(response) {					
											_self.reloadGrid();
										}
								});	

							});	
					} else {
						shr.showError({message: jsBizMultLan.atsManager_atsTripBillAllList_i18n_30});
						return;
					}  
				}
			},{
				text: jsBizMultLan.atsManager_atsTripBillAllList_i18n_14,
				click: function(){
					$(this).dialog( "close" );
				}
			}],
			close : function() {
				
			}
		});	
		var addWorkString ='<div style=" margin: 35px; ">'
			+'<div id="allCalculateDatePicker" style=" margin-top: 19px;">'
			+'<textarea id="reason" type="text" class="block-father valid" name="remark" cols="3" rows="3" placeholder="" dataextenal="" istotemplate="true" ctrlrole="textarea" validate="{maxlength:255}"></textarea>'
			+''
			+'</div>'
			+'</div>' ;
			
		$("#orgFillDiv").html("").append(addWorkString);			
	}
	
	,showConfirm: function(message, action, cancel) {
		shr.msgHideAll();

		var msg = top.Messenger().post({
			type:'error',
			message: message,
			hideAfter: null,
			actions: {
				retry: {
					label: jsBizMultLan.atsManager_atsTripBillAllList_i18n_15,
					auto: false,
					delay: 0,
					showCloseButton: true,
					action: function() {
						shr.msgHideAll();
						if (action && $.isFunction(action)) {
							action.call(this);
						}
					}
				},
				cancel: {
					label: jsBizMultLan.atsManager_atsTripBillAllList_i18n_14,
					action: function() {
						if (cancel && $.isFunction(cancel)) {
							cancel.call(this);
						} else {
							return msg.cancel();
						}
					}
				}
			}
		});
		return msg;
	}
	
	
	/**
	 * 描述:删除操作
	 * @action 
	 */
	,deleteAction:function(){
    	var _self = this;
    	var billId = $("#grid").jqGrid("getSelectedRows");
    	if(billId == undefined || billId.length<=0 || (billId && billId.length == 1 && billId[0] == "")){
    	    shr.showWarning({message : jsBizMultLan.atsManager_atsTripBillAllList_i18n_9});
    	    return false;
    	}
		var selectedIds = shr.atsBillUtil.getSelectedIds();
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_atsTripBillAllList_i18n_17, function() {
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
		openLoader(1,jsBizMultLan.atsManager_atsTripBillAllList_i18n_26);
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(res) {
				closeLoader();
				if(res.alreadyInProcessQueueException == 1){
					shr.showError({message: jsBizMultLan.atsManager_atsTripBillAllList_i18n_3});
				}else{
					var failMsg = "";
					if(res.error !="" && res.error!=null && res.error!=undefined ){
					    shr.showError({message: res.error});
					}else{
						if(res.submitNum - res.submitSuccessNum>0){
						   failMsg = jsBizMultLan.atsManager_atsTripBillAllList_i18n_1 + (res.submitNum - res.submitSuccessNum)
						}
						shr.showInfo({message:jsBizMultLan.atsManager_atsTripBillAllList_i18n_27 + res.submitNum
								+ jsBizMultLan.atsManager_atsTripBillAllList_i18n_0 + res.submitSuccessNum + failMsg});
						_self.reloadGrid();
				   }
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
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({"message" : jsBizMultLan.atsManager_atsTripBillAllList_i18n_9});
				return false;
		}
		shr.showConfirm(jsBizMultLan.atsManager_atsTripBillAllList_i18n_20, function() {
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
		   if(jsBizMultLan.atsManager_atsTripBillAllList_i18n_19 == billState && $.inArray(billId[i], realBillId) == -1){
		      realBillId.push(billId[i]);
		   }
		}
		if(realBillId.length == 0){
		    shr.showError({message: jsBizMultLan.atsManager_atsTripBillAllList_i18n_5, hiddenAfter: 5});
		    return;
		}
		var data = _self.assembleSaveData(action, realBillId);
		
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		openLoader(1,jsBizMultLan.atsManager_atsTripBillAllList_i18n_26);
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
					   failMsg = jsBizMultLan.atsManager_atsTripBillAllList_i18n_1 + (res.submitNum - res.submitSuccessNum)
					}
					shr.showInfo({message:jsBizMultLan.atsManager_atsTripBillAllList_i18n_18 + res.submitNum
							+ jsBizMultLan.atsManager_atsTripBillAllList_i18n_0 + res.submitSuccessNum + failMsg});
					_self.reloadGrid();
				}
			},
			complete: function() {
				closeLoader();
			}
		});
	},
	/**出差确认列表**/
	canTripBillListAction : function(){
		var that = this;
		 that.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.CanTripBillAllList"
		});
	},
	/**出差确认**/
	canTripBillAction : function(){
		var that = this;
		var billId = $("#grid").jqGrid("getSelectedRows");
		
		if((billId && billId.length == 0) || !billId){
			that.reloadPage({
	             uipk: "com.kingdee.eas.hr.ats.app.CanTripBillAllForm",
	             method: 'addNew',
	             isFromPage: "Trip"
			});
			return true;
		} 
		if(billId.length>1){
                shr.showWarning({message:jsBizMultLan.atsManager_atsTripBillAllList_i18n_13});
				return false;
		}
		if(billId != ""){
			var tripBillId = "";
			var billType = 1;
			tripBillId = billId[0];
			var billType = $("#grid").jqGrid("getRowData", tripBillId).billType;	
			if(billType == 2){
				shr.showConfirm(jsBizMultLan.atsManager_atsTripBillAllList_i18n_28, function() {
				  that.reloadPage({
			             uipk: "com.kingdee.eas.hr.ats.app.CanTripBillAllForm",
			             method: 'addNew'
		           });
			});
			}else{
				var billState = $("#grid").jqGrid("getRowData", tripBillId).billState;
				
				if(billState != 3){
					shr.showWarning({message: jsBizMultLan.atsManager_atsTripBillAllList_i18n_12});
				}else{
					var isHavenCanTrip = false;
					that.remoteCall({
				      type: "post",
				      async: false,
				      method:"isHavenCanTrip",
				      param:{billId:billId[0]},
				      success: function(res){
					    isHavenCanTrip = res.isHavenCanTrip;
				    }
			       });
				   if(isHavenCanTrip == false){
					    var isCalOtTripBill = "";
						that.remoteCall({
								  type: "post",
								  async: false,
								  method:"checkIsCalOt",
								  param:{checkBillId:billId[0]},
								  success: function(res){
									isCalOtTripBill = res.isCalOtTripBill;
								}
						});
//						 tripBillId=$("#grid").jqGrid("getRowData")[0]["entries.id"];
						tripBillId=$("#grid").jqGrid("getSelectedRowsData")[0]["entries.id"]; //2020-5-15 20:23 修改
//						var arr = $('#grid').find('.cbox');
//						var list = [];
//						$.each(arr, function (index, value) {
//						                var id = $(value).attr('id');
//						                if (!id || id != 'cb_grid') {
//						                    var checked = $(value).attr('checked');
//						                    if (checked === 'checked') {
//						                        list.push($(value).parents('tr')[0]);
//						                    }
//						                }
//						            });
//						console.log(list);
						var billId = $("#grid").jqGrid("getSelectedRows");
						that.remoteCall({
								  type: "post",
								  async: false,
								  method:"getEntryId",
								  param:{tripBillId:tripBillId,billId:billId[0]},
								  success: function(res){
									tripBillId=res.entryID;
								}
						});
						if(isCalOtTripBill && isCalOtTripBill.length > 0){
							var tipMsg = jsBizMultLan.atsManager_atsTripBillAllList_i18n_21;
							shr.showConfirm(tipMsg, function(){
								top.Messenger().hideAll();
								that.reloadPage({
									 uipk: "com.kingdee.eas.hr.ats.app.CanTripBillAllForm",
									 method: 'addNew',
									 tripBillId: tripBillId,
									 isFromPage: "Trip"
							   });
						    });
						}else{
							   that.reloadPage({
									 uipk: "com.kingdee.eas.hr.ats.app.CanTripBillAllForm",
									 method: 'addNew',
									 tripBillId: tripBillId,
									 isFromPage: "Trip"
							   });
						}
				        
				   }else{
					   shr.showWarning({message:jsBizMultLan.atsManager_atsTripBillAllList_i18n_4});
				   }
			  }
			  
			}
		
		}
		
		
	},
    scheduleRecalculateAction: function() {
        this.reloadPage({
            uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillRecalculate"
        });
    }
	,initialFromAtsCalculate:function(){
		if( typeof ats_beginDate !="undefined" && typeof ats_endDate !="undefined" && ats_beginDate && ats_beginDate!="" && ats_endDate!=""){
			var temp = $("#fastFilter-area").shrFastFilter("option", "fastFilterItems");
			temp['entries.tripStartTime_entries.tripEndTime'].values.startDate=ats_beginDate;
			temp['entries.tripStartTime_entries.tripEndTime'].values.endDate=ats_endDate;
			$("#fastFilter-area").shrFastFilter("option", "fastFilterItems",temp);
			$("#entries--tripStartTime_entries--tripEndTime-datestart").val(ats_beginDate);
			$("#entries--tripStartTime_entries--tripEndTime-dateend").val(ats_endDate);
			$("#entries--tripStartTime_entries--tripEndTime-datestart").trigger("change");
		}
	}
	//重写onCellSelect方法，通过流程单据查询进入页面点击事件无效
	,onCellSelect: function(rowid, colIndex, cellcontent, e) {
		if (!atsCalFlag){
			shr.ats.AtsTripBillAllList.superClass.onCellSelect.call(this,rowid, colIndex, cellcontent, e);
		}else {
			return true;	
		}	
	}
		
});

//去除数组重复项
function unique(arr) {
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}
