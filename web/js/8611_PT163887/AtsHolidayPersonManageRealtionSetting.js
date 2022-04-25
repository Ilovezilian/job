shr.defineClass("shr.ats.AtsHolidayPersonManageRealtionSetting", shr.ats.AtsBasePersonManageRealtionSetting, {
    bizManageTypeID:"WMwl/vtBvkmbWdGELoP6Y2WJ1dE=",//假期业务管理类型ID
    category:"ATS",
	//批量设置uipk
	batchUipk : "com.kingdee.shr.base.bizmanage.app.PersonBURelationBatchAdd.AtsHoliday",
	CACHE_KEY : 'atsHolidayReceive_bill',
	TitleContent : jsBizMultLan.atsManager_AtsHolidayPersonManageRealtionSetting_i18n_0,
	dialogUipk : 'com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.holidayFileReceive',
	initalizeDOM : function () {
		shr.ats.AtsHolidayPersonManageRealtionSetting.superClass.initalizeDOM.call(this);
		var _self = this;
	}
    ,extendParam : function(){
	     return {number:"ATS01"} ;
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
		var dataParam = { "category": _self.category, "tab": tabID, "tabs" : parseInt(tabs),"number":"ATS01"};//@
		$.extend(params, dataParam);
		$(this.gridId).setGridParam({
			custom_params: shr.toJSON(params)
		});	
	}
	 , getCurrentListUipk:function(tabs){
    	var currentListUipk;
    	if(tabs==0){//行政组织范围内
    		currentListUipk= "com.kingdee.shr.base.bizmanage.app.PersonBURelation.Ats.list1$page";
    	}else if(tabs==1){//行政权限范围外
    		currentListUipk= "com.kingdee.shr.base.bizmanage.app.PersonBURelation.Ats.list2$page";
    	}else if(tabs==2){//行政权限范围内转交其他业务组织
    		currentListUipk= "com.kingdee.shr.base.bizmanage.app.PersonBURelation.Ats.list3$page";
    	}
    	return currentListUipk;
    	
    }
     /**
	 * 查看员工业务组织 权限校验
	 */
    ,checkViewRelationButtonIsVisable: function () {
    	var _self = this;
		shr.callHandler({
			handler:"com.kingdee.shr.ats.web.handler.HolidayManageRealtionSettingHandler",
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
	 , queryRelationAction: function () {
        var _self = this;
        this.reloadPage({
            uipk: "com.kingdee.shr.base.bizmanage.app.PersonBURelationViewList",
            itemState: "all",
            state: "",
            category: "ATS",
            number:"ATS01"
        });
    }
});
