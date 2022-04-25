shr.defineClass("shr.ats.atsHolidayFileBatchMaintain", shr.ats.atsHolidayFileBatchMaintainBase, {
	
	 // 让调用方提供节点 
		lastUipk : "" ,
		viewModel : "",
		grid : "" ,
		className : "" ,
		initalizeDOM : function () {
		shr.ats.atsHolidayFileBatchMaintain.superClass.initalizeDOM.call(this)
		},
		// 批量赋值
		addValsAction : function(){
			var pageUipk = "com.kingdee.eas.hr.ats.app.AtsHolidayFileBatchMaintain.list";//假期档案列表
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
					shr.showInfo({message: jsBizMultLan.atsManager_atsHolidayFileBatchMaintain_i18n_2});
					return false;
				}
				if(gridData[i]['holidayPolicySet.id']==null || gridData[i]['holidayPolicySet.id']==''){
					shr.showInfo({message: jsBizMultLan.atsManager_atsHolidayFileBatchMaintain_i18n_1});
					return false;
				}
				if(gridData[i]['EFFDT']==null || gridData[i]['EFFDT']==''){
					shr.showInfo({message: jsBizMultLan.atsManager_atsHolidayFileBatchMaintain_i18n_3});
					return false;
				}
			}
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsHolidayFileBatchMaintainHandler&method=batchMaintain";
			openLoader(1,jsBizMultLan.atsManager_atsHolidayFileBatchMaintain_i18n_4);
			shr.ajax({
				type:"post",
				async:true,
				url:url,
				data:{"models":JSON.stringify(gridData)},
				success:function(res){
					if(res.data!=null && res.data!=""){
						shr.showError({message: res.data});
					}
					closeLoader();
					$grid.trigger("reloadGrid");
					//parent.location.reload();
					shr.showInfo({message:jsBizMultLan.atsManager_atsHolidayFileBatchMaintain_i18n_0 });
			    }
		});		 
		}
});