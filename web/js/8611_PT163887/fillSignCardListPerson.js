//我要补卡--个人列表js
shr.defineClass("shr.ats.FillSignCardList", shr.framework.List, {
	listToAddFlag : "",
	initalizeDOM : function () {
		shr.ats.FillSignCardList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initToolBars();
        that.setNavigateLine();
        jsBinder.gridLoadComplete=function(data){
			$("#grid_description").find(".s-ico").remove();//审批人字段数据库值全为空，不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_description").removeClass("ui-jqgrid-sortable");
		};
	}
    ,/**
	 * 描述:删除操作
	 * @action 
	 */
	deleteAction:function(){		
		var _self = this;
		var billId = $("#grid").jqGrid("getSelectedRows");
    	if(billId == undefined || billId.length<=0 || (billId && billId.length == 1 && billId[0] == "")){
    	    shr.showWarning({message : jsBizMultLan.atsManager_fillSignCardListPerson_i18n_7});
    	    return false;
    	}
		var selectedIds = this.getSelectedIds();
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_fillSignCardListPerson_i18n_8, function() {
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
	 * 获得选中的id,且满足选中的数据仅是未提交的数据。
	 */
	getSelectedIds: function() {
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
				return billIds.toString();
			}
	    }
		
		shr.showWarning({
			message: jsBizMultLan.atsManager_fillSignCardListPerson_i18n_14
		});
	}
	/**
	 * 查看
	 */
	,viewAction: function(billId) {
		var _self = this;
		var billSubmitType = $("#grid").jqGrid("getRowData",billId).billType;
		// 批量提交
		if(billSubmitType=="2"){
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.FillSignCardBatchFormForPer",
				billId: billId,
				method: 'view'
			});	
		// 1 普通提交 	
		}else{
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.FillSignCardForm",
				billId: billId,
				method: 'view'
			});		
		}			
	},
	/**
	 * 新增
	 */
	addNewAction: function() {
		/*var that = this;
		that.remoteCall({
				type:"post",
				method:"getAttandenceFileByPerson",
				param:{},
				success:function(res){		
					var flag = res.flag;
					if(flag == "true"){
						that.reloadPage({
							uipk: "com.kingdee.eas.hr.ats.app.FillSignCardForm",
							method: 'addNew'
						});
					}else{
						shr.showWarning({
							message: "您是非打卡考勤员工，无需补签卡!"
						});
						return;
					}
					
				}
			})*/
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.FillSignCardForm",
			method: 'addNew'
		});
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
	},

	inEmpFlagChangeSearchOtDate:function(){
		var dateValue = shr.getUrlParam('dateValue');
		if(dateValue){
		var lastChild = $("#entries--attendDate-dateselect_down li:last-child");
			var temp = $("#fastFilter-area").shrFastFilter("option", "fastFilterItems");
			temp['entries.attendDate'].values.startDate=dateValue;
			temp['entries.attendDate'].values.endDate=dateValue;
			temp['entries.attendDate'].values.selectDate=lastChild.attr("data-value");
			$("#fastFilter-area").shrFastFilter("option", "fastFilterItems",temp);
			atsMlUtile.setTransDateValue("#entries--attendDate-datestart",dateValue);
			atsMlUtile.setTransDateValue("#entries--attendDate-dateend",dateValue);
			atsMlUtile.setTransDateValue("#entries--attendDate-dateselect",lastChild.attr("title"));
			$("#entries--attendDate-datestart").trigger("change");
		}
	} ,
	/**
	 * 初始化工具栏按钮
	 */
	initToolBars: function(){
	   $('<button id="submit" type="button" name="submit" class="shrbtn-primary shrbtn">'
		   + jsBizMultLan.atsManager_fillSignCardListPerson_i18n_9
		   + '</button>').insertAfter($(".shr-toolbar #addNew"));
	   $('#submit').shrButton({
					actionBinding: 'submitAction',
					subAction: '',
					customData: ""
	   });		
	}
	
	/**
	 * 批量提交
	 */
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
		openLoader(1,jsBizMultLan.atsManager_fillSignCardListPerson_i18n_13);
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(res) {
				closeLoader();
				if(res.alreadyInProcessQueueException == 1){
					shr.showError({message: jsBizMultLan.atsManager_fillSignCardListPerson_i18n_3});
				}else{
					var failMsg = "";
					if(res.submitNum - res.submitSuccessNum>0){
					   failMsg = jsBizMultLan.atsManager_fillSignCardListPerson_i18n_1 + (res.submitNum - res.submitSuccessNum)
					}
					shr.showInfo({message:jsBizMultLan.atsManager_fillSignCardListPerson_i18n_16 + res.submitNum
							+ jsBizMultLan.atsManager_fillSignCardListPerson_i18n_0 + res.submitSuccessNum + failMsg});
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
	/**
	 * 提交生效 
	 */
	,submitEffectAction : function (event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		shr.showConfirm(jsBizMultLan.atsManager_fillSignCardListPerson_i18n_12, function() {
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
		   var billStateGetVar = "tr[id='" + billId[i] + "'] td[aria-describedby='grid_billState']";
		   var billState = $(billStateGetVar).text();
		   var billTypeGetVar = "tr[id='" + billId[i] + "'] td[aria-describedby='grid_billType']";
		   var billType = $(billTypeGetVar).val();
		   if(jsBizMultLan.atsManager_fillSignCardListPerson_i18n_11 == billState
			   && !jsBizMultLan.atsManager_fillSignCardListPerson_i18n_6 == billType){
		   	  //员工自助要过滤掉状态不是未提交的和批量提交的，个人不能提交批量的单据。
		      realBillId.push(billId[i]);
		   }
		}
		if(realBillId.length == 0){
		    shr.showError({message: jsBizMultLan.atsManager_fillSignCardListPerson_i18n_4, hiddenAfter: 5});
		    return;
		}
		var data = _self.assembleSaveData(action, realBillId);
		
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		_self.remoteCall({
			type:"post",
			method:"submitEffect",
			param:data,
			success : function(res) {
				 var failMsg = "";
				if(res.submitNum - res.submitSuccessNum>0){
				   failMsg = jsBizMultLan.atsManager_fillSignCardListPerson_i18n_1 + (res.submitNum - res.submitSuccessNum)
				}
				shr.showInfo({message:jsBizMultLan.atsManager_fillSignCardListPerson_i18n_10 + res.submitNum
						+ jsBizMultLan.atsManager_fillSignCardListPerson_i18n_0 + res.submitSuccessNum + failMsg});
			    $("#grid").jqGrid().jqGrid("reloadGrid");
			}
		});
	},
	setNavigateLine: function(){
	    var parentUipk = parent.window.shr.getCurrentViewPage().uipk;
	    var punchCardFlag = sessionStorage.getItem("punchCardFlag");
		if("fromPunchCard" == punchCardFlag 
		&& "com.kingdee.eas.hr.ats.app.WorkCalendarItem.listSelf" == parentUipk){//来自打卡记录弹出框的时候
	        $("#breadcrumb").remove();
	        window.parent.changeDialogTitle(jsBizMultLan.atsManager_fillSignCardListPerson_i18n_2);
		}
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
			shr.showError({message: jsBizMultLan.atsManager_fillSignCardListPerson_i18n_4, hiddenAfter: 5});
		    return;
		}
		var selectedRowData = _self.selectedRowData;
		if(undefined != selectedRowData && selectedRowData.length > 0){
			var personId = "";
			for(var i=0;i<selectedRowData.length; i++){
				if(personId == ""){
					personId = selectedRowData[i]["entries.person.id"];
				}
				if(personId != "" && undefined != selectedRowData[i]["proposer.id"] && personId != selectedRowData[i]["proposer.id"]){
					shr.showError({message: jsBizMultLan.atsManager_fillSignCardListPerson_i18n_15, hiddenAfter: 5});
		    		return;
				}
			}
		}
		//调用以下方法校验补签次数
		if (!_self.fillSignCardTimesControl(realIds)){
			return;
		}
		//调用OSF获取所选未提交单据的下一步参与人信息
		var response = _self.getBillsNextPersonInfo(realIds,uipk);
		shr.showConfirm(jsBizMultLan.atsManager_fillSignCardListPerson_i18n_5, function() {
		        _self.doSubmit(event, 'submit',response,realIds);
			});
		
		/*this.defaultActionHandle({
			methodName: 'submit',
			requireConfirm: true,
			message: jsBizMultLan.atsManager_fillSignCardListPerson_i18n_5
		});*/
	}
	,abortBillAction : function (event) {
		var _self = this;
		shr.atsBillUtil.abortBill(_self);	
	}
});