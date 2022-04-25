shr.defineClass("shr.ats.CancelLeaveBillList", shr.framework.List, {
	 
	initalizeDOM : function () {
		shr.ats.CancelLeaveBillList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initToolBars();
		jsBinder.gridLoadComplete=function(data){
			$("#grid_description").find(".s-ico").remove();//审批人字段数据库值全为空，不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_description").removeClass("ui-jqgrid-sortable");
		};
	}
	
	//返回到请假确认单个人列表,还需要复写"创建","查看"的方法 跳转到"个人请假确认单的form试图"
	/**
	 * 新增
	 */
	,addNewAction: function() {
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.CancelLeaveBillForm",
			method: 'addNew'
		});
	}
	
	/**
	 * 个人列表-查看功能
	 */
	,viewAction: function(billId) {
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.CancelLeaveBillForm",
			billId: billId,
			method: 'view'
		});			
	}
	/**
	 * 描述:删除操作
	 * @action 
	 */
	,deleteAction:function(){
    	var _self = this;
    	var billId = $("#grid").jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({"message" : jsBizMultLan.atsManager_cancelLeaveBillList_i18n_3});
				return false;
		}
		var selectedIds = shr.atsBillUtil.getSelectedIds();
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_cancelLeaveBillList_i18n_4, function() {
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
	/**
	 * 初始化工具栏按钮
	 */
	,initToolBars: function(){
	   $('<button id="submit" type="button" name="submit" class="shrbtn-primary shrbtn">'
		   + jsBizMultLan.atsManager_cancelLeaveBillList_i18n_5
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
		openLoader(1,jsBizMultLan.atsManager_cancelLeaveBillList_i18n_6);
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(res) {
				closeLoader();
				if(res.alreadyInProcessQueueException == 1){
					shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillList_i18n_2});
				}else{
					var failMsg = "";
					if(res.submitNum - res.submitSuccessNum>0){
					   failMsg = jsBizMultLan.atsManager_cancelLeaveBillList_i18n_1 + (res.submitNum - res.submitSuccessNum)
					}
					shr.showInfo({message:jsBizMultLan.atsManager_cancelLeaveBillList_i18n_8 + res.submitNum
							+ jsBizMultLan.atsManager_cancelLeaveBillList_i18n_0 + res.submitSuccessNum + failMsg});
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
					shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillList_i18n_7, hiddenAfter: 5});
		    		return;
				}
			}
		}
		shr.ats.CancelLeaveBillList.superClass.submitAction.call(_self);
	}
});

