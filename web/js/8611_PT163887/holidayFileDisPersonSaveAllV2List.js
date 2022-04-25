var _adminOrgId = "";
shr.defineClass("shr.ats.HolidayFileDisPersonSaveAllV2List", shr.ats.atsHolidayFileBatchMaintainBase,{
	initalizeDOM : function() {
		shr.ats.HolidayFileDisPersonSaveAllV2List.superClass.initalizeDOM.call(this);
		var that = this;

		//隐藏精确搜索框
		$('#searcher').closest(".span12").hide();
	},
	// 批量赋值
	addValsAction : function(){
		var pageUipk = "com.kingdee.eas.hr.ats.app.HolidayFileDisPersonSaveAll.list";//假期档案列表
		var _self = this;
	    _self.addValsPublicAction(pageUipk);
	},
	cancelAllAction:function(){	
		history.back();
	},
	saveAllAction:function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var gridData= $grid.jqGrid("getRowData");
		for(var i=0;i<gridData.length;i++){
			if(gridData[i]['hrOrgUnit.id']==null || gridData[i]['hrOrgUnit.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_holidayFileDisPersonSaveAllV2List_i18n_2});
				return false;
			}
			if(gridData[i]['holidayPolicySet.id']==null || gridData[i]['holidayPolicySet.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_holidayFileDisPersonSaveAllV2List_i18n_1});
				return false;
			}
			if(gridData[i]['EFFDT']==null || gridData[i]['EFFDT']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_holidayFileDisPersonSaveAllV2List_i18n_3});
				return false;
			}
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsHolidayFileBatchMaintainHandler&method=batchMaintain";
		openLoader(1,jsBizMultLan.atsManager_holidayFileDisPersonSaveAllV2List_i18n_4);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridData)},
			success:function(res){
				closeLoader();
				shr.showInfo({message: jsBizMultLan.atsManager_holidayFileDisPersonSaveAllV2List_i18n_0});
				$grid.trigger("reloadGrid");
				//parent.location.reload();
		    }
	});		 
	}
	,getSelector: function() {
		return "  ";
	}
});