shr.defineClass("shr.ats.noneCalAttendPersonList", shr.framework.List, {
	isLeaveIsCal : true ,
	initalizeDOM:function(){
		var that = this;
		shr.ats.noneCalAttendPersonList.superClass.initalizeDOM.call(this);
		$('#datagrid').find('#searcher').parent().parent().parent().hide();//去除精确搜索
	},
	getCurrentAttencePolicy : function(){
		var self = this;
	    if (attendPolicyId != "") 
		{
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryResultHelper"+'&serviceId='+ encodeURIComponent(shr.getUrlRequestParam("serviceId"));
			 shr.remoteCall({
					type:"post",
					async:false,  
					url:url, 
					method : "getCurrentAttencePolicy" ,
					param : {  
						attencePolicyId:attendPolicyId
					},
					success : function(res)
					{
						self.isLeaveIsCal =  res.isLeaveIsCal ;
						//self.showAttenceCycleItem(res);
					}
			});
		}	
	},
	
	getGridCustomParam: function() {
		
		var isLeaveIsCal = this.isLeaveIsCal;
		var beginDate	= $("input[name=beginDate]").val()+" 00:00:00";
		var endDate		= $("input[name=endDate]").val()+" 00:00:00"; 
		// var attendPolicyId = "";
		return {
				'isLeaveIsCal':isLeaveIsCal,
				'beginDate':beginDate,
				'endDate':endDate,
				'attendPolicyId':attendPolicyId,
				'hrOrgUnit':$("#hrOrgUnit").shrPromptBox("getValue").id
			};
	},
	
	
	getCustomFilterItems: function() {
	     
		var that = this;
		var array = new Array();
		var filterStr = "";
		var filterStr1 ="";
		var filterStr2="";
		var filterStr4 ="";
		var filterStr5 ="";
		var proposerName = $("input[name=proposer]").val();
		var beginDate	= $("input[name=beginDate]").val()+" 00:00:00";
		var endDate		= $("input[name=endDate]").val()+" 00:00:00"; 
		that.getCurrentAttencePolicy();
		if (proposerName != "") {
			filterStr1 += " and  PERSON.NAME like '%"+$.trim(proposerName)+"%' "; 
		} 
 		if(attendanceGroupID!="") 
		{
			filterStr2=" and ATTENCEGROUP.id='"+attendanceGroupID+"'";
		} 
		filterStr = " ATTENDANCEFILE.attendFileState = 1 "
	          + filterStr1
			  + filterStr2;
			  
				  
		return filterStr;
	},
	onCellSelect: function(rowid, colIndex, cellcontent, e){
		return ;
	},
	/**
	 * 将导航树选中的节点在表格查询时传递至服务端
	 */
	setGridTreeParam: function() {		
		var adminOrgUnit = orgLongNum ;
//		var adminOrgUnit = $("input[name='adminOrgUnit.longNumber']").val() ;
		if (adminOrgUnit) {
			var adminOrgUnitArr=adminOrgUnit.split("@");
			var tree_params="";
			for(var i in adminOrgUnitArr){
				tree_params+="  ( ADMINORGUNIT.longNumber = '"+adminOrgUnitArr[i]+"' or";
				tree_params+=" ADMINORGUNIT.longNumber like '"+adminOrgUnitArr[i]+"!%' )"+" or";
			}
			tree_params=tree_params.substring(1,tree_params.length-2);
			$(this.gridId).setGridParam({ 
				tree_params: tree_params
			});	
		}
	}
	
	
});
	
