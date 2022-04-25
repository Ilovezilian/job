shr.defineClass("shr.ats.AtsScheduleShiftList", shr.framework.List, {
//  屏蔽列表中中单击事件
//	viewAction: function(billId) {
//	}
	initalizeDOM : function () {
		shr.ats.AtsScheduleShiftList.superClass.initalizeDOM.call(this);
		var that = this;
	}
	/**
	 * 描述:删除操作
	 * @action 
	 */
	,deleteAction:function(){
    	var _self = this;
    	var billId = $("#grid").jqGrid("getSelectedRows");
    	if(billId == undefined || billId.length<=0 || (billId && billId.length == 1 && billId[0] == "")){
    	    shr.showWarning({message : jsBizMultLan.atsManager_atsScheduleShiftList_i18n_2});
    	    return false;
    	}
		var selectedIds = shr.atsBillUtil.getSelectedIds();
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_atsScheduleShiftList_i18n_3, function() {
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

	,abortBillAction : function (event) {
		    var realBillId = [];
			var billId = $("#grid").jqGrid("getSelectedRows");
			if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
		        shr.showWarning({message: jsBizMultLan.atsManager_atsScheduleShiftList_i18n_2});
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
			shr.showConfirm(jsBizMultLan.atsManager_atsScheduleShiftList_i18n_1, function(){
				top.Messenger().hideAll();
				 _self.remoteCall({
				 	type:"post",
					method:"abortBill",
					param:{billId:realBillId.toString()},
					success:function(res){
						shr.showInfo({message: jsBizMultLan.atsManager_atsScheduleShiftList_i18n_0});
						_self.reloadGrid(); 
					}
				});
				
			});
		}
	/**
	 * 初始化页面时查询表格数据
	 * 重写此方法：从员工考勤看板日历跳转的单据页面取消默认查询条件，只显示日历单元格所在日的单据
	 */	
	,initalizeQueryGrid: function(){
		var empFlag = shr.getUrlParam('empFlag');
		if(empFlag){
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

});