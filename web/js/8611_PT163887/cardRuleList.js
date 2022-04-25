shr.defineClass("shr.ats.CardRuleList", shr.ats.AtsMaintainBasicItemList, {
	 
	initalizeDOM : function () {
		shr.ats.CardRuleList.superClass.initalizeDOM.call(this);
		//var that = this;
		
	},
	
//	flag:"flag",
//	before : function(){
//	  var that = this;
//	   var $grid = $("#grid");
//		$grid.jqGrid('option', {
//			onCellSelect : function (rowid, iCol, cellcontent, e) {
//				if (iCol == 0) {
//					return;
//				}
//				//alert(cellcontent);
//				//var billId = $(that.gridId).jqGrid("getCell", rowid, "cmpEmpFiles.id");
//				//that.personId = $("#grid").jqGrid("getCell", rowid, "person.id");
//				//that.flag = $grid.jqGrid("getCell",rowid,"flag");
//				//alert( $grid.jqGrid("getCell",rowid,"flag") );
//			}
//		});
//	},
	
//	deleteAction:function(){
//		var that = this;
//		var  selectIds = $(this.gridId).jqGrid("getSelectedRows");
//		var  test = "test";
//		shr.doAjax({
//			url: "/easweb/atsCardRule.do?method=getCardRuleInfos",
//			data: {
//				selectIds: JSON.stringify(selectIds),//["11","22","33"]
//				test:test
//			},
//			success: function(data){
//				if (data.sum >= 1) {
//					 top.Messenger().post({
//						message: "系统预设数据不能删除!",
//						showCloseButton: true
//					 });
//					 return ;
//				}else{
//					that.deleteLastAction();
//				}
//			}
//		});
//	},
	
	/**
	 * 描述:删除操作
	 * @action 
	 */
	deleteLastAction:function(){		
		var selectedIds = $(this.gridId).jqGrid("getSelectedRows");
		if (selectedIds.length <= 0) {
	        top.Messenger().post({
				message: jsBizMultLan.atsManager_cardRuleList_i18n_1,
				showCloseButton: true
			});
			return ;
	    }
	    //需要数组 转 字符串
	    var selectedIds_str=selectedIds.join(",")
		this.deleteRecord(selectedIds_str);
	}
	
	
	,copyAction: function() {		
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length == 0) {
			shr.showWarning({message: jsBizMultLan.atsManager_cardRuleList_i18n_0});
			return ;
		}else if(selectedIds.length > 1) {
			shr.showWarning({message: jsBizMultLan.atsManager_cardRuleList_i18n_2});
			return ;
		}
		
		var _self = this;
		var model = jsBinder.view_model;
//		var billType = $("#grid").jqGrid("getRowData",selectedIds).billType;
//		var currentUipk = jsBinder.uipk;
	
//		var toUipk = model+".form";
		var toUipk = "com.kingdee.eas.hr.ats.app.CardRule.form";
		var url = shr.getContextPath()+ "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CardRuleListHandler";
			url +="&uipk="+toUipk;
			
			
			_self.reloadPage({
											uipk: toUipk,
											billId: selectedIds[0],
											method: 'copy'
									});		
			
	
	},

	disableAction:function(){
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		var isDefault;
		if (selectedIds.length > 0) {
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				isDefault = $grid.jqGrid("getCell", selectedIds[i], 'isDefault');
				if (!isDefault || parseInt(isDefault) == 1 ) {
					shr.showError({message:jsBizMultLan.atsManager_cardRuleList_i18n_6});
					return;
				}
			}
		}

		this.doBatchEnable('batchDisable');
	}
	
	
});