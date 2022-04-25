shr.defineClass("shr.ats.AttendanceLogList", shr.framework.List, {
	
	editViewDisable:true,//不跳转到编辑界面
	initalizeDOM : function () {
		shr.ats.AttendanceLogList.superClass.initalizeDOM.call(this);
		var _self = this;
	}
	,getCustomFilterItems: function() {
		var _self = this;
		var filterStr =  "jobId ='"+shr.getUrlRequestParam("jobInsId")+"' and entries.id is not null";
		return filterStr;
	}
});