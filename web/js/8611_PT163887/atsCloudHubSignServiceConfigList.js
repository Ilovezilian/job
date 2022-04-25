shr.defineClass("shr.ats.AtsCloudHubSignServiceConfigList", shr.framework.List, {
	initalizeDOM : function () {
		shr.ats.AtsCloudHubSignServiceConfigList.superClass.initalizeDOM.call(this);
		var that = this;
		 $("#grid").jqGrid("option",{
			 beforeSelectRow:function(){
				 $("#grid").jqGrid("resetSelection");
			 }
		 })
	}
	,enableFileAction: function() {
		var _self = this;
		var selectedIds = $(_self.gridId).jqGrid("getSelectedRows");
		if(!selectedIds || selectedIds.length == 0){
			shr.showError({message: jsBizMultLan.atsManager_atsCloudHubSignServiceConfigList_i18n_3, hideAfter: 3});
			return;
		}
		if($(_self.gridId).getRowData(selectedIds[0])["state"] == 1){
			shr.showInfo({message: jsBizMultLan.atsManager_atsCloudHubSignServiceConfigList_i18n_1, hideAfter: 3});
			_self.reloadGrid();
		}else{
			_self.enableAction();
			var dataIds = [];
			$(_self.gridId).getRowData().forEach(function(rowData){
				rowData["state"] == 1 && dataIds.push(rowData["id"]);
			})
			_self.doRemoteAction({
				method: "disable",
				billId: dataIds.join(",")
			});
		}
		_self.resetSelction();
		
	}
	,disableFileAction: function() {
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			if (selectedIds.length > 1){
				shr.showError({message: jsBizMultLan.atsManager_atsCloudHubSignServiceConfigList_i18n_5, hideAfter: 3});
				return;
			}
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var state=$grid.jqGrid("getCell", selectedIds[i], "state");
				if(state==2){
					shr.showError({message: jsBizMultLan.atsManager_atsCloudHubSignServiceConfigList_i18n_0, hideAfter: 3});
					return;
				}
			}
		}else{
			shr.showError({message: jsBizMultLan.atsManager_atsCloudHubSignServiceConfigList_i18n_4, hideAfter: 3});
			return;
		}
		clz.remoteCall({method: "disableFile", param: {billId:selectedIds[0]}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_atsCloudHubSignServiceConfigList_i18n_2, hideAfter: 3});
			clz.reloadGrid();
			clz.resetSelction();
		}});
		
	},
	resetSelction:function(){
		 setTimeout(function(){
			 $("#grid").jqGrid("resetSelection");
		 },1000);
	}
	
});