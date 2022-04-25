//专员的补签卡列表js 
var atsCalFlag = false ;//从考勤计算进入标志

shr.defineClass("shr.ats.team.TeamFillSignCardList", shr.framework.List, {
	isFirstTimeLoad: true,
	initalizeDOM : function () {
		var that = this;
		that.atsCalTriger();
		//考勤计算页面，不响应列表点击事件
		if(atsCalFlag){
			that.editViewDisable = true;
			that.isFirstTimeLoad = false;
			
			var colModel = $(this.gridId).get(0).p.colModel;
			for(var i = 0;i < colModel.length;i++) {
				if(colModel[i].formatter == 'showlink') {
					colModel[i].formatter = '';
					break;
				}
			}
		}
		that.initialFromAtsCalculate();//重考勤计算进入，改变查询范围
		shr.ats.team.TeamFillSignCardList.superClass.initalizeDOM.call(this);
		jsBinder.gridLoadComplete=function(data){
			shr.ats.team.TeamFillSignCardList.superClass.gridLoadComplete.call(this)
			$("#grid_description").find(".s-ico").remove();//审批人字段数据库值全为空，不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_description").removeClass("ui-jqgrid-sortable");
		}
		setTimeout(function(){
			//为iframe添加高度重设
			if(this != top){
				$(window.parent.document.getElementById('detailOperationDialog-frame')).css('height','inherit');
			}
		}, 500);
		
		// $('#delete').eq(0).remove();
		//快速过滤展开
		if($(".filter-containers").is(":hidden") && !atsCalFlag){
			$("#filter-slideToggle").click();
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
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"entries.attendDate","errorMessage":jsBizMultLan.atsManager_fillSignCardList_i18n_9});
		if(dateRequiredValidate){
//			shr.ats.FillSignCardList.superClass.queryGrid.call(this);
			var _self = this;
			var $grid = $(this.gridId);
			_self.setFastFilterMap();
			this.setGridTreeParam();
			this.setGridCustomParam();
			this.setBotpFilterItems($grid);
			
			this.queryFastFilterGrid();
			
			// selector
			var selector = this.getSelector();
			if (typeof selector !== 'undefined') {
				$grid.setGridParam({ selector: selector	});
			}
			// filter
			var filterItems = this.getFilterItems();
			$grid.jqGrid("option", "filterItems", filterItems);
			
			// fastFilter
			var fastFilterItems = this.getFastFilterItems();
			if (fastFilterItems) {
				$grid.jqGrid("option", "fastFilterItems", JSON.stringifyOnce(fastFilterItems));
			}
	
			//seniorFilter
			var advancedFilter = this.getAdvancedFilterItems();
			if(_self.fastFilterMap && _self.fastFilterMap.fastFilterItems && _self.isReturn){
				advancedFilter = _self.fastFilterMap.fastFilterItems.advancedFilter;			
			}
			if(advancedFilter){
				$grid.jqGrid("option", "advancedFilter", JSON.stringify(advancedFilter));
			}else{
				$grid.jqGrid("option", "advancedFilter", null);
			}	
	
			// sorter
			var sorterItems = this.getSorterItems();
			if (sorterItems) {
				$grid.jqGrid("option", "sorterItems", sorterItems);
			}
			var keyField = this.getBillIdFieldName();
			if (keyField) {
				$grid.jqGrid("option", "keyField", keyField);
			}
			// 修改为通过URL取数
			$grid.jqGrid('setGridParam', {datatype:'json'});
			// reload
			if(!this.isFirstTimeLoad){
				$grid.jqGrid("reloadGrid");
			}else{
				this.isFirstTimeLoad = false;
			}
			var filtertype = 'normal';
			var filterValue = filterItems;
			if(this.getQuickFilterItems()){
				filtertype = 'QuickFilter';
				filterValue = this.getQuickFilterItems();
			}
			if(this.getCustomFilterItems()){
				filtertype = 'CustomFilter';
				filterValue = this.getCustomFilterItems();
			}
			var text = {id:this.uipk,text:this.title,filtertype:filtertype,filter:filterValue};
			var value = {type:2,msg:text};
			shr.operateLogger(value);
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
	
    ,/**
	 * 描述:删除操作
	 * @action 
	 */
	deleteAction:function(){		
    	var _self = this;
		var selectedIds = this.getSelectedId();
		var billId = $("#grid").jqGrid("getSelectedRows");
    	if(billId == undefined || billId.length<=0 || (billId && billId.length == 1 && billId[0] == "")){
    	    shr.showWarning({message : jsBizMultLan.atsManager_fillSignCardList_i18n_8});
    	    return false;
    	}
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_fillSignCardList_i18n_10, function() {
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
	},
	/**
	 * 获得选中的id,且满足选中的数据仅是未提交的数据。
	 */
	getSelectedId: function() {
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var billIds = [];
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var billState=$grid.jqGrid("getCell", selectedIds[i], "billState")||0;
				if(billState==0){
					billIds.push($grid.jqGrid("getCell", selectedIds[i], "id"));
				}
			}
			if(billIds.length>0){
//				if(billIds.length!=selectedIds.length){
//				  shr.showInfo({
//							message: "只能删除未提交状态的数据，“非未提交状态”的数据将忽略",
//							hideAfter: 7
//						});
//				}
				return billIds.toString();
			}
	    }
		
		shr.showWarning({
			message: jsBizMultLan.atsManager_fillSignCardList_i18n_17
		});
	}
	
	
	//返回到补签卡单专员列表,还需要复写"创建","查看"的方法 跳转到"专员补签卡单的form试图"
	/**
	 * 新增
	 */
	,addNewAction: function() {
		
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.team.FillSignCardAllForm",
			method: 'addNew'
		});
	}
	
	/**
	 * 批量新增
	 */
	,batchNewAction: function() {
		var _self = this;
		_self.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.team.FillSignCardBatchNew",
			method: 'addNew'
		});
	}
	
	/**
	 * 缺卡检查
	 */
	,checkedCardAction: function() {
		var _self = this;
		_self.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.LackPunchCardChecked.list"
		});
	}
	
	/**
	 * 个人列表-查看功能
	 */
	,viewAction: function(billId) {
		var _self = this;
		var billType = $("#grid").jqGrid("getRowData",billId).billType;
		//  批量提交
		if(billType=="2"){
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.team.FillSignCardBatchNew",
				billId: billId,
				method: 'view'
			});	
		// 1 普通提交	
		}else{
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.team.FillSignCardAllForm",
				billId: billId,
				method: 'view'
			});		
		}
	}
	
	,abortBillAction : function (event) {
			var billId = $("#grid").jqGrid("getSelectedRows");
			var realBillId = [];
			if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		         shr.showWarning({message : jsBizMultLan.atsManager_fillSignCardList_i18n_8});
    	         return false;
		    }
		    for(var i=0;i<billId.length;i++){
			    if($.inArray(billId[i], realBillId) == -1){
			       realBillId.push(billId[i]);
			    }
		    }
		    
		    /*else if(billId.length>1){
				alert('请选中一行');
				return ;
			}*/
			var _self = this;
			shr.showConfirm(jsBizMultLan.atsManager_fillSignCardList_i18n_6, function(){
				top.Messenger().hideAll();
				/*var data = {
					method: 'abortBill',
					billId: billId[0]
				};
				data = $.extend(_self.prepareParam(), data);
				shr.doAction({
					url: _self.dynamicPage_url,
					type: 'post', 
						data: data,
						success : function(response) {					
							_self.reloadGrid();
						}
				});*/	
				_self.remoteCall({
					type:"post",
					method:"abortBill",
					param:{billId:realBillId.toString()},
					success:function(res){
						shr.showInfo({message: jsBizMultLan.atsManager_fillSignCardList_i18n_2});
						_self.reloadGrid(); 
					}
				});
				
			});
		}
	/*	,importDataAction:function(){
		var  that = this;
		var  importHTML= ''
			+ '<div id="photoCtrl">' 
			+	'<p>补签卡数据引入说明</p>'
			+	'<div class="photoState">1. 上传文件不能修改模板文件的格式</div>'
			+	'<div class="photoState">2. 支持上传文件格式为xls,xlsx的excel文件</div>'
			+   '<br>'
			+ 	'<p>请选择所需要的操作</p>'
			+ 	'<div class="photoCtrlBox">'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked ></span></div>'
			+       '<div class="photoCtrlUpload"><span>请选择上传文件</span></div>'
			+		'<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			+ 		'<div style="clear:both"><span style="color:red;display:none" id="file_warring">未选择上传文件</span></div>'
			+       '<br>'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="exportRadio" ></div>'
			+       '<div class="photoCtrlUpload"><span>补签卡模板下载 </span></div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+ '</div>';
		$(document.body).append(importHTML);
	    // 初始化上传按钮
		$('#importRadio').shrRadio();
		$('#exportRadio').shrRadio();
	
		var data = {
			method: "downloadFile" 
		};
			
		data = $.extend(that.prepareParam(), data);
		var url = that.dynamicPage_url + "?method=uploadFile&uipk="+data.uipk;
		url += "&" + getJSessionCookie();
		//在点击确定前，对文件进行上传处理
		var handleFlag = false;
		
		   	swf: "jslib/uploadify/uploadify.swf",
		    uploader: url,
		    buttonText: "选择文件",
		    buttonClass: "shrbtn-primary shrbtn-upload",
		    fileTypeDesc: "Excel",
		    fileTypeExts: "*.xls;*.xlsx",
		    async: false,
		    multi: false,
		    removeCompleted: false,
		    onUploadStart: function() {
		    	//openLoader(0); //遮罩层
			},
			onUploadComplete: function(file) {
				handleFlag = true;
				$('#file_warring').hide();
				//alert("onUploadSuccess 导入成功=="+JSON.stringify(data));
				//shr.showInfo({message: '上传成功'});
				//error_path = data;
				//$('#photoCtrl').dialog('close');
				//$(this).dialog( "close" );
				//刷新表格
				//$("#grid").jqGrid().jqGrid("reloadGrid");
			}
		});

		$('#photoCtrl').dialog({
			title: '补签卡数据',
			width: 600,
			height: 450,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+20%',
				of: window
			},
			buttons: {
		        "确认": function() {
		        	if($('#exportRadio').shrRadio('isSelected')){
		        		that.exportFileData();
		        	}
		        	else if($('#importRadio').shrRadio('isSelected')){
		        		if(handleFlag){
		        			that.importFileData();
		        			$(this).dialog( "close" );
		        			$('#photoCtrl').remove();
		        			//window.location.reload();
		        		}
		        		else{
		        			$('#file_warring').show();
		        		}
		        	}
		        },
		        "关闭": function() {
		        	//var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=deleteFile";
		        	//$.ajax({
		        	//	url: url
		        	//})
		        	$(this).dialog( "close" );
		        	$('#photoCtrl').remove();
		        }
		    }
		});
	},importFileData: function(){
		//alert("读取服务器目录文件 解析");
		var that=this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.FillSignCardListHandler&method=importFileData";
		$.ajax({
			url: url,
			beforeSend: function(){
				openLoader(1);
			},
			success: function(msg){
				closeLoader();
				var tip="";
     			if(true) {
					//alert(JSON.stringify(msg));
					tip ="补签卡数据导入完毕<br/>";
					tip = tip +  " 导入的文件中共" + msg.totalNum+ "条记录<br/>" ;
					tip = tip +  " 导入成功的记录有" + msg.successNum + "条<br/>" ;
					if (msg.errorNum > 0) {
						tip = tip +  " 导入失败" + msg.errorNum + "条<br/>" ;
						tip = tip +  "导入失败的原因如下：<br/>" ;
						if (msg.personErrorNum > 0) {
							tip = tip +  "  没有建立有效的考勤档案的人员有" + msg.personErrorNum + "条<br/>" ;
						}
						if (msg.isAttendanceNum > 0) {
							tip = tip +  "  非打卡考勤的人员有" + msg.isAttendanceNum + "条<br/>" ;
						}
						if (msg.dateErrorNum > 0) {
							tip = tip +  "  考勤日期格式错误的记录有" + msg.dateErrorNum + "条<br/>" ;
						}
						if (msg.fillCardTypeNum > 0) {
							tip = tip +  "  补签卡类型系统中不匹配的有" + msg.fillCardTypeNum + "条<br/>" ;
						}
						if(msg.fillCardReasonNum > 0){
							tip = tip +  "  补签卡原因系统中不匹配的有" + msg.fillCardReasonNum + "条<br/>" ;
						}
					    if(msg.fillCardTimeStrNum > 0){
							tip = tip +  "  补签卡时间点错误的记录有" + msg.fillCardTimeStrNum + "条<br/>" ;
						}
						if(msg.fileRepeatNum > 0){
							tip = tip +  "  文件中重复的记录有" + msg.fileRepeatNum + "条<br/>" ;
						}
						if(msg.dbExistNum > 0){
							tip = tip +  "  数据已存在的记录有" + msg.dbExistNum + "条<br/>" ;
						}
						if(msg.fileRepeatNum > 0 || msg.dbExistNum ){
							tip = tip + "       详细信息如下：<br/>";
							tip = tip + msg.strBuffer;
						}
							
							
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
				that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.ScheduleShift.list'
				});	
				
			},
			error: function(){
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});
	}	
	,exportFileData: function(){
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.FillSignCardListHandler&method=downloadFile";
		 location.href = url;
	}*/
	
	/*,importAction: function(){
		var that = this ;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil";
			    url +='&uipk=com.kingdee.eas.hr.ats.app.FillSignCardAllList';
			   shr.remoteCall({
				type:"post",
				method:"checkImportPermssion",
				url:url,
				success:function(res){
						var curIOModelString = "com.kingdee.eas.hr.ats.app.FillSignCardEntry"
						that.doImportData(curIOModelString);
				}
			});
		
	}
	*/
	
	/**
	 * add by aniskin_guosj 2015-07-21
	 * 反审批补签卡
	 * 支持同时多个反审批
	 */
	,againstApproveAction : function () {
		var _self = this;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length==0 || (billIds && billIds.length == 1 && billIds[0] == "")) {
			shr.showWarning({message: jsBizMultLan.atsManager_fillSignCardList_i18n_8});
			return ;
	    }
	    
	    billIds = unique(billIds);//去除重复项目（批量单据）
	    var rows = billIds.length;
	    var actualRows = 0;
	    var billIdString = "";
	    
	    for (var i in billIds){
	    	var tempBillState = $("#grid").jqGrid("getRowData", billIds[i]).billState;
	    	if (tempBillState==3) {
	    		actualRows++;
	    		billIdString+=billIds[i]+",";
	    	}
	    }
		
	    var tips="";
	    if (actualRows==0) {
	    	shr.showWarning({message: jsBizMultLan.atsManager_fillSignCardList_i18n_14});
			return ;
	    }else if (actualRows!=rows){
	    	tips = jsBizMultLan.atsManager_fillSignCardList_i18n_15;
	    }
	    
	    billIdString = billIdString.substring(0,billIdString.length-1);
	    
		shr.showConfirm(tips + jsBizMultLan.atsManager_fillSignCardList_i18n_5, function(){
			top.Messenger().hideAll();
			
			var data = {
				method: 'againstApprove',
				billId: billIdString
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
	}
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
		openLoader(1,jsBizMultLan.atsManager_fillSignCardList_i18n_16);
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(res) {
				closeLoader();
				if(res.alreadyInProcessQueueException == 1){
					shr.showError({message: jsBizMultLan.atsManager_fillSignCardList_i18n_3});
				}else{
					if(res.error !="" && res.error!=null && res.error!=undefined ){
						shr.showError({message: res.error});
					}else{
						var failMsg = "";
						if(res.submitNum - res.submitSuccessNum>0){
						failMsg = jsBizMultLan.atsManager_fillSignCardList_i18n_1 + (res.submitNum - res.submitSuccessNum)
						}
						shr.showInfo({message:jsBizMultLan.atsManager_fillSignCardList_i18n_18 + res.submitNum
								+ jsBizMultLan.atsManager_fillSignCardList_i18n_0 + res.submitSuccessNum + failMsg});
						$("#grid").jqGrid().jqGrid("reloadGrid");
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
				
	}
	,assembleSaveData: function(action,realBillId) {
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
    	    shr.showWarning({message : jsBizMultLan.atsManager_fillSignCardList_i18n_8});
    	    return false;
    	}
		shr.showConfirm(jsBizMultLan.atsManager_fillSignCardList_i18n_13, function() {
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
		   if(jsBizMultLan.atsManager_fillSignCardList_i18n_12 == billState && $.inArray(billId[i], realBillId) == -1){
		      realBillId.push(billId[i]);
		   }
		}
		if(realBillId.length == 0){
		    shr.showError({message: jsBizMultLan.atsManager_fillSignCardList_i18n_4, hiddenAfter: 5});
		    return;
		}

		//调用以下方法校验补签次数
		if (!this.fillSignCardTimesControl(realBillId.join(","))){
			return;
		}

		var data = _self.assembleSaveData(action, realBillId);
		
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		openLoader(1,jsBizMultLan.atsManager_fillSignCardList_i18n_16);
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
					   failMsg = jsBizMultLan.atsManager_fillSignCardList_i18n_1 + (res.submitNum - res.submitSuccessNum)
					}
					shr.showInfo({message:jsBizMultLan.atsManager_fillSignCardList_i18n_11 + res.submitNum
							+ jsBizMultLan.atsManager_fillSignCardList_i18n_0 + res.submitSuccessNum + failMsg});
					$("#grid").jqGrid().jqGrid("reloadGrid");
				}
			}
		});
	}


	/**
	 * 提交工作流
	 * 默认的action处理方法
	 * 重写此方法，添加补签次数的校验
	 */
	,defaultActionHandle: function(option) {
		var selectedIds = this.getSelectedIds();
		if (!selectedIds) {
			return;
		}
		
		//调用以下方法校验补签次数
		if (!this.fillSignCardTimesControl(selectedIds)){
			return;
		}

		if (typeof option == 'string') {
			option = { methodName: option };
		}
		
		if (option.requireConfirm && option.message) {
			// 需要提示信息
			var _self = this;
			shr.showConfirm(option.message, function(){
				top.Messenger().hideAll();
				_self.doRemoteAction({
					method: option.methodName,
					billId: selectedIds
				});
			});
		} else {
			this.doRemoteAction({
				method: option.methodName,
				billId: selectedIds
			});
			
		}
	},	

	//补签次数限制校验
	fillSignCardTimesControl:function (selectedIds){
		var _self = this;
		var info;
		if  (selectedIds.length>0){
			_self.remoteCall({
				type:"post",
				method:"fillSignCradTimesControl",
				async: false,
				param:{
					billId:selectedIds
				},
				success:function(res){
					info =  res;	
				}
			});
			if (info.errorFlag) return true;
			else{
				var result = new Array();
				for (var key in info.errorMap){
	 				var value = info.errorMap[key];
	 				result.push(value);
	 			}
				 shr.showWarning({message:result.join("<br/>"),hideAfter:15});
				 return false;		
			}
		}
							
	}

	/**
	 * 提交
	 */
	,submitAction: function() {
		var _self = this;
		_self.beforeSubmit();
		var realIds = _self.getSelectedRealIds();
		var uipk = _self.getUrlParams('uipk');
		if(!realIds){
			shr.showError({message: jsBizMultLan.atsManager_fillSignCardList_i18n_4, hiddenAfter: 5});
		    return;
		}
		//调用以下方法校验补签次数
		if (!_self.fillSignCardTimesControl(realIds)){
			return;
		}
		//调用OSF获取所选未提交单据的下一步参与人信息
		var response = _self.getBillsNextPersonInfo(realIds,uipk);
		shr.showConfirm(jsBizMultLan.atsManager_fillSignCardList_i18n_7, function() {
		        _self.doSubmit(event, 'submit',response,realIds);
			});
		
		/*this.defaultActionHandle({
			methodName: 'submit',
			requireConfirm: true,
			message: jsBizMultLan.atsManager_fillSignCardList_i18n_7
		});*/
	}
	,initialFromAtsCalculate:function(){
		if( typeof ats_beginDate !="undefined" && typeof ats_endDate !="undefined" && ats_beginDate && ats_beginDate!="" && ats_endDate!=""){
			var temp = $("#fastFilter-area").shrFastFilter("option", "fastFilterItems");
			temp['entries.attendDate'].values.startDate=ats_beginDate;
			temp['entries.attendDate'].values.endDate=ats_endDate;
			$("#fastFilter-area").shrFastFilter("option", "fastFilterItems",temp);
			$("#entries--attendDate-datestart").val(ats_beginDate);
			$("#entries--attendDate-dateend").val(ats_endDate);
			$("#entries--attendDate-datestart").trigger("change");
		}
	}			
	//重写onCellSelect方法，通过流程单据查询进入页面点击事件无效
	,onCellSelect: function(rowid, colIndex, cellcontent, e) {
		if (!atsCalFlag){
			shr.ats.team.TeamFillSignCardList.superClass.onCellSelect.call(this,rowid, colIndex, cellcontent, e);
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