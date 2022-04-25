shr.defineClass("shr.ats.AtsBatchTipList", shr.framework.List, {
	initalizeDOM : function () {
		var that = this;
        shr.ats.AtsBatchTipList.superClass.initalizeDOM.call(this);
	},
	/**
	 * 如果重写过getBatchTipsRowDatas方法，则需要增加对应的列配置属性
	 */
	getBatchTipsTableModel:function(){
		var _self = this;
		var tableModel;
		try {
			tableModel = shr.ats.HolidayResultSumList.superClass.getBatchTipsTableModel.call(this);
		} catch (e) {
			tableModel = $(_self.gridId).jqGrid("getGridConfig").colModel;
		}
		return tableModel;
	},
	 /**
	 * 批量提示行数据，方便子类覆写
	 */
	getBatchTipsRowDatas:function(ids, options){
		var _self = this;
		var $table = $(_self.gridId);
		var selectedIds = $table.jqGrid("getGridParam", "selarrrow");
		var rowDatas = []; //获取选中的表格数据,这种方法只能获取到当前页数据   bug编号：BT1155539
		selectedIds.forEach(function(id){
			rowDatas.push($table.jqGrid('getOriginalRowData',id));
		});
		if(selectedIds.length==0 
		&& (_self.uipk== "com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.bacthAttFile" || _self.uipk== "com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.bacthAttHolidayFile")){
			var allData = $table.jqGrid("getRowData");
			allData.forEach(function(data){
				rowDatas.push(data);
			});
		}
		// for (var i = 0, l = ids.length; i < l; i++) {
		// 	rowDatas.push($table.jqGrid('getOriginalRowData', ids[i]));
		// }
		return rowDatas;
	},
	/**
	 * 
	 * @param {} self,this对象
	 * @param {} callback,回调函数
	 * @param {} params,回调函数参数
	 * @return {} 函数
	 */
	getBatchTipSuccessFun : function(self,callback,params){
		var fun = function(res) {
				if(res==null||res==undefined){
					callback.apply(self,params);
				}
				var response = res;
				if(res.data !=null && res.data!=undefined){
					response = res.data;
				}
				closeLoader();
				if (response!=null && response.billId!=undefined && response.billId!="") {
					var batchTipsData = self.batchTipsDataHandler(response);

					$(self).shrMessageTips({
						isSuccess: batchTipsData.isSuccess,
						successCount: batchTipsData.successCount,
						failureCount: batchTipsData.failureCount,
						confirmCallback: function () {	
							$(self).shrDetailTips({
								tableData: batchTipsData.tmp,
								successCount: batchTipsData.successCount,
            					failureCount: batchTipsData.failureCount,
								colNamesData: batchTipsData.tableModel,
								modalWidth: ''
							}).shrDetailTips("open");					
						},

						closeCallback: function () {
							callback.apply(self,params);
						}
					}).shrMessageTips("open");				
				} else {
					if(response){
						shr.showError({message: response.result == "error" && response.summary ? response.summary : response});
					}
					callback.apply(self,params);
				}	
			};
		return  fun ;
	}
	
});	

