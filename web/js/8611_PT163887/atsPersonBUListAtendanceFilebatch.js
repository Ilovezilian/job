shr.defineClass("shr.ats.atsPersonBUListAtendanceFilebatch", shr.ats.attendanceFilebatchAdd,{
    
	initalizeDOM : function () {
		shr.ats.atsPersonBUListAtendanceFilebatch.superClass.initalizeDOM.call(this);
		var _self = this;
	}
	,
	getCustomFilterItems: function() {
	    var billIds = localStorage.getItem('atsfileReceive_bill');
		var filterStr =  "Id IN ( '"+billIds.replace(/,/g,"','")+"' ) ";
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
				shr.showInfo({message: jsBizMultLan.atsManager_atsPersonBUListAtendanceFilebatch_i18n_3});
				return false;
			}
			/*
			if(gridData[i]['Position.id']==null || gridData[i]['aPosition.id']==''){
				shr.showInfo({message: "职位字段必填!"});
				return false;
			}
			*/
			if(gridData[i]['file.attendanceNum']==null || gridData[i]['file.attendanceNum']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsPersonBUListAtendanceFilebatch_i18n_1});
				return false;
			}
			if(gridData[i]['AtsShift.id']==null || gridData[i]['AtsShift.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsPersonBUListAtendanceFilebatch_i18n_4});
				return false;
			}
			if(gridData[i]['AttencePolicy.id']==null || gridData[i]['AttencePolicy.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsPersonBUListAtendanceFilebatch_i18n_2});
				return false;
			}
			if(gridData[i]['file.isAttendance']==null || gridData[i]['file.isAttendance']===''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsPersonBUListAtendanceFilebatch_i18n_0});
				return false;
			}
			if(gridData[i]['file.isAutoShift']==null || gridData[i]['file.isAutoShift']===''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsPersonBUListAtendanceFilebatch_i18n_6});
				return false;
			}
			if(gridData[i]['EFFDT']==null || gridData[i]['EFFDT']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_atsPersonBUListAtendanceFilebatch_i18n_5});
				return false;
			}
			
		}
		
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsPersonBURelationListHandler&method=receive";
		openLoader(1,jsBizMultLan.atsManager_atsPersonBUListAtendanceFilebatch_i18n_7);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridData),"ids":localStorage.getItem('atsfileReceive_bill')},
			success:function(res){
				//清楚本地缓存
				localStorage.removeItem('atsfileReceive_bill');
				closeLoader();
				parent.location.reload();
			}
		});		 
	}
});