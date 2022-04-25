shr.defineClass("shr.ats.atsPersonBUListHolidayFilebatch", shr.ats.atsHolidayFilebatchAdd,{
	initalizeDOM : function () {
		shr.ats.atsPersonBUListHolidayFilebatch.superClass.initalizeDOM.call(this);
		var _self = this;
	}
	
	,getCustomFilterItems: function() {
	    var billIds = localStorage.getItem('atsHolidayReceive_bill');
		var filterStr =  "Id IN ( '"+billIds.replace(new RegExp(",","gm"),"','")+"' ) ";
		return filterStr;
	}
	/**
	 * 获得排序字段,若不重写该方法，平台默认按number字段处理，而PersonBURelation实体没有该字段，导致query报错
	 */
	,getSorterItems: function() {
		return "person.number ASC";
	}
	,receiveAction : function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var gridData= $grid.jqGrid("getRowData");
		for(var i = 0 ; i < gridData.length ; i++){
			if(gridData[i]['hrOrgUnit.id']==null || gridData[i]['hrOrgUnit.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsPersonBUListHolidayFilebatch_i18n_1});
				return false;
			}
			/*
			if(gridData[i]['Position.id']==null || gridData[i]['aPosition.id']==''){
				shr.showInfo({message: "职位字段必填!"});
				return false;
			}
			*/
			if(gridData[i]['holidayPolicySet.id']==null || gridData[i]['holidayPolicySet.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsPersonBUListHolidayFilebatch_i18n_0});
				return false;
			}
			if(gridData[i]['EFFDT']==null || gridData[i]['EFFDT']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsPersonBUListHolidayFilebatch_i18n_2});
				return false;
			}
		}
		
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsHolidayPersonBURelationListHandler&method=receive";
		openLoader(1,jsBizMultLan.atsManager_atsPersonBUListHolidayFilebatch_i18n_3);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridData),"ids":localStorage.getItem('atsHolidayReceive_bill')},
			success:function(res){
				//清楚本地缓存
				localStorage.removeItem('atsHolidayReceive_bill');
				closeLoader();
				parent.location.reload();
			}
		});		 
	}
});