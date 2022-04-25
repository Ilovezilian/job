shr.defineClass("shr.ats.AttencePolicyList", shr.ats.AtsMaintainBasicItemList, {
	 
	initalizeDOM : function () {
		shr.ats.AttencePolicyList.superClass.initalizeDOM.call(this);
		//var that = this;
	},
	copyAction:function(){		
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length == 0) {
			shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyList_i18n_2});
			return ;
		}else if(selectedIds.length > 1) {
			shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyList_i18n_3});
			return ;
		}
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttencePolicyCopy.form',
			copy:1,
			method: 'addNew'
		});
	},
	
	//禁用操作
	disableAction:function(){
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		var isDefault;
	     if (selectedIds.length > 0) {
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				isDefault = $grid.jqGrid("getCell", selectedIds[i], "isDefault");
				if(parseInt(isDefault) == 1 ){
					shr.showError({message: jsBizMultLan.atsManager_attencePolicyList_i18n_4});
					return;
				}
			}
	   }
		this.doBatchEnable('batchDisable');
	},
	//清除基础数据缓存
	clearBaseDataAction: function(){
		var _self= this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.AttendanceResultCalDynamicListHandler&method=clearBaseData";
		openLoader(1);
		shr.ajax({
			type:"post",
			url:url,
			data:{},
			success:function(res){
				closeLoader();
				if(res.flag=true)
				{
					 shr.showInfo({message : jsBizMultLan.atsManager_attencePolicyList_i18n_0});
				}else{
					 shr.showInfo({message : jsBizMultLan.atsManager_attencePolicyList_i18n_1});
				}
			}
		}); 
	}
});