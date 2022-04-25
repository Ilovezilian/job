shr.defineClass("shr.ats.AtsPersonManageRealtionSetting", shr.ats.AtsBasePersonManageRealtionSetting, {
    bizManageTypeID:"a1XVAx7aQEiqGkQqicFzfmWJ1dE=",//考勤业务管理类型ID
    category:"ATS",
	batchUipk : "com.kingdee.shr.base.bizmanage.app.PersonBURelationBatchAdd.Ats",
	CACHE_KEY : 'atsfileReceive_bill',
	TitleContent : jsBizMultLan.atsManager_AtsPersonManageRealtionSetting_i18n_3,
	dialogUipk : 'com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.atsfileReceive',
	initalizeDOM : function () {
		shr.ats.AtsPersonManageRealtionSetting.superClass.initalizeDOM.call(this);
		var _self = this;
		if(localStorage.getItem("marin_attsuccessMsg")){
		shr.showWarning({message:""+localStorage.getItem("marin_attsuccessMsg"),hideAfter: 5});
		localStorage.removeItem("marin_attsuccessMsg");
		}
	}
    ,extendParam : function(){
	     return {number:"ATS02"} ;
	}
     /**
	 * 查看员工业务组织 权限校验
	 */
    ,checkViewRelationButtonIsVisable: function () {
    	var _self = this;
		shr.callHandler({
			handler:"com.kingdee.shr.ats.web.handler.AttendManageRealtionSettingHandler",
			action:"checkViewRelationButtonIsVisable",
			param:{},
			type:"POST",
			success:function(res){
				if(res.isVisable == false){
					$("#viewRelation").hide();
				}
			}
		});
    }
    
    , getCurrentListUipk:function(tabs){
    	var currentListUipk;
    	if(tabs==0){//行政组织范围内
    		currentListUipk= "com.kingdee.shr.base.bizmanage.app.PersonBURelation.AtsAttend.list1$page";
    	}else if(tabs==1){//行政权限范围外
    		currentListUipk= "com.kingdee.shr.base.bizmanage.app.PersonBURelation.AtsAttend.list2$page";
    	}else if(tabs==2){//行政权限范围内转交其他业务组织
    		currentListUipk= "com.kingdee.shr.base.bizmanage.app.PersonBURelation.AtsAttend.list3$page";
    	}
    	return currentListUipk;
    	
    }
	/**
	 * 描述: 全部导出excel
	 * @action 
	 */
	,exportToExcelAction: function(){
		var $grid = $(this.gridId),
			maxExport = 10000,
			theMaxExport = 100000,
			totalRecords = $grid.jqGrid('getGridParam', 'records');
		
		var title = jsBizMultLan.atsManager_AtsPersonManageRealtionSetting_i18n_2;
		if (totalRecords > theMaxExport){
			var message = shr.formatMsg(jsBizMultLan.atsManager_AtsPersonManageRealtionSetting_i18n_1, [theMaxExport]);
			shr.showConfirm(juicer(message, {theMaxExport: theMaxExport}), function(){
				$grid.jqGrid("exportToExcel", { 
					isAll: true,
					supportQueryUuid: false,
					totalRecords: totalRecords,
					title:title
				});
			});
		}else if (totalRecords > maxExport) {
			var message = shr.formatMsg(jsBizMultLan.atsManager_AtsPersonManageRealtionSetting_i18n_0, [maxExport]);
			shr.showConfirm(juicer(message, {maxExport: maxExport}), function(){
				$grid.jqGrid("exportToExcel", { 
					isAll: true,
					supportQueryUuid: false,
					totalRecords: totalRecords,
					title:title
				});
			});
		} else {
			$grid.jqGrid("exportToExcel", { 
				isAll: true,
				supportQueryUuid: false,
				totalRecords: totalRecords,
				title:title
			});
		}
	},
	setGridCustomParam: function() {
		var _self = this;
		var params = $.extend(this.initData.custom_params, this.getGridCustomParam());
		try {
			var tabs = $("#tabs").tabs("option", "active");
		} catch(e) {
			return;
		}
		var tabID = "HrOrgManage";
		if (tabs == 1) {
			tabID = "AdminOrgManage";
		}
		if (tabs == 2) {
			tabID = "AdminOrgOtherManage";
		}
		var dataParam = { "category": _self.category, "tab": tabID, "tabs" : parseInt(tabs),"number":"ATS02"};//@
		$.extend(params, dataParam);
		$(this.gridId).setGridParam({
			custom_params: shr.toJSON(params)
		});	
	}
	
	/**
	 * 描述: 导出选择行
	 * @action 
	 */
	,exportCurrentAction:function(){
		var fieldName = this.getExportFieldName();
		var ids = this.getSelectedIds(fieldName);
		var title = jsBizMultLan.atsManager_AtsPersonManageRealtionSetting_i18n_2;
		if (ids) {
			$(this.gridId).jqGrid("exportToExcel", {
				supportQueryUuid: false,
				selectedData: ids,
				fieldName_key: fieldName,
				title:title
			});
		}
	}
	 , queryRelationAction: function () {
        var _self = this;
        this.reloadPage({
            uipk: "com.kingdee.shr.base.bizmanage.app.PersonBURelationViewList",
            itemState: "all",
            state: "",
            category: "ATS",
            number:"ATS02"
        });
    }
});
