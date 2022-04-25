shr.defineClass("shr.ats.blindOrgAdminList", shr.ats.HrOrgUnitBlindAdminList, {
	initalizeDOM : function () {
		shr.ats.blindOrgAdminList.superClass.initalizeDOM.call(this);
		var that = this;
		//that.getVerticaliQueryParam();
		$("[title='"+jsBizMultLan.atsManager_BlindOrgAdminList_i18n_3+"']").remove();
	},
	assembleParam:function(){
		var that = this;
		var _self = this;
		var bills=shr.getUrlParam("billId");
		var filterStr =  bills;
		var param = {};
		param.billId=filterStr;
		param.filterItems = that.getQuickFilterItems();
		var type = shr.getUrlRequestParam("type");
		if(type=='holiday'){
		param.available = 'T_ATS_HolidayPoliSetAvailable';
		param.holidayPolicy = 'T_HR_ATS_HolidayPolicySet';
		}else if(type=='attend'){
		param.available = 'T_ATS_AttencePolicyAvailable';
		param.holidayPolicy = 'T_HR_ATS_AttencePolicy';
		}else if(type=='takeWork'){
		param.available = 'T_ATS_AtsTakeWorkingAvailable';
		param.holidayPolicy = 'T_HR_ATS_TakeWorking';
		}else if(type=='atsShift'){
		param.available = 'T_ATS_AtsShiftAvaliable';
		param.holidayPolicy = 'T_HR_ATS_Shift';
		}else if(type=='atsTurnShift'){
		param.available = 'T_ATS_AtsTurnShiftAvailable';
		param.holidayPolicy = 'T_HR_ATS_TurnShift';
		}else if(type=='attenceGroup'){
		param.available = 'T_ATS_AttGroupAvailable';
		param.holidayPolicy = 'T_HR_ATS_AttenceGroup';
		}
		return param;
	}
	,
	exportCurrentAction : function(){
	var that = this;
	var gridData=$("#dataGrid").jqGrid("getSelectedRows");
	var arrays = new Array();
	var bills;
	if(gridData.length<=0){
	shr.showWarning({message : jsBizMultLan.atsManager_BlindOrgAdminList_i18n_1});
	return;
	}
	for(var i = 0 ; i < gridData.length ; i++){
	var data = $("#dataGrid").jqGrid("getRowData", gridData[i]);
	if(bills){
	bills = bills+','+data.blindId;
	}else{
	bills = data.blindId;
	}
	}
//	var filterStr =  " IN ( '"+bills.replace(/,/g,"','")+"' ) ";
	var filterStr =  bills;
	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsBlindAdminHandler&method=exportToExcel";
	var type = shr.getUrlRequestParam("type");
	var available = '';
	var holidayPolicy = '';
	if(type=='holiday'){
	available = 'T_ATS_HolidayPoliSetAvailable';
	holidayPolicy = 'T_HR_ATS_HolidayPolicySet';
	}else if(type=='attend'){
	available = 'T_ATS_AttencePolicyAvailable';
	holidayPolicy = 'T_HR_ATS_AttencePolicy';
	}else if(type=='takeWork'){
	available = 'T_ATS_AtsTakeWorkingAvailable';
	holidayPolicy = 'T_HR_ATS_TakeWorking';
	}else if(type=='atsShift'){
	available = 'T_ATS_AtsShiftAvaliable';
	holidayPolicy = 'T_HR_ATS_Shift';
	}else if(type=='atsTurnShift'){
	available = 'T_ATS_AtsTurnShiftAvailable';
	holidayPolicy = 'T_HR_ATS_TurnShift';
	}else if(type=='attenceGroup'){
	available = 'T_ATS_AttGroupAvailable';
	holidayPolicy = 'T_HR_ATS_AttenceGroup';
	}
	url = url+'&billId='+encodeURIComponent(filterStr);
	url = url+'&available='+encodeURIComponent(available);
	url = url+'&holidayPolicy='+encodeURIComponent(holidayPolicy);
	url = url+'&exportType='+encodeURIComponent('exportSelect');
	openLoader(1,jsBizMultLan.atsManager_BlindOrgAdminList_i18n_2);
		  	shr.ajax({ 
				type:"post",
				url:url, 
				success:function(res){ 
					closeLoader();    
					document.location.href = url;
			    }, 
			    error : function(res){
			    	shr.showError({message: jsBizMultLan.atsManager_BlindOrgAdminList_i18n_0});
			    	closeLoader(); 
			    } 
		});
	
	},
	exportToExcelAction : function(){
	var that = this;
	var available = '';
	var holidayPolicy = '';
	var type = shr.getUrlRequestParam("type");
	var gridData=$("#dataGrid").jqGrid("getRowData");
	var bills;
	for(var i = 0 ; i < gridData.length ; i++){
	if(bills){
	bills = bills+','+gridData[i].blindId;
	}else{
	bills = gridData[i].blindId;
	}
	}
	var bills=shr.getUrlParam("billId");
	var filterStr =  bills;
//	var filterStr =  " IN ( '"+bills.replace(/,/g,"','")+"' ) ";
//	var filterStr =  bills;
	if(type=='holiday'){
	available = 'T_ATS_HolidayPoliSetAvailable';
	holidayPolicy = 'T_HR_ATS_HolidayPolicySet';
	}else if(type=='attend'){
	available = 'T_ATS_AttencePolicyAvailable';
	holidayPolicy = 'T_HR_ATS_AttencePolicy';
	}else if(type=='takeWork'){
	available = 'T_ATS_AtsTakeWorkingAvailable';
	holidayPolicy = 'T_HR_ATS_TakeWorking';
	}else if(type=='atsShift'){
	available = 'T_ATS_AtsShiftAvaliable';
	holidayPolicy = 'T_HR_ATS_Shift';
	}else if(type=='atsTurnShift'){
	available = 'T_ATS_AtsTurnShiftAvailable';
	holidayPolicy = 'T_HR_ATS_TurnShift';
	}else if(type=='attenceGroup'){
	available = 'T_ATS_AttGroupAvailable';
	holidayPolicy = 'T_HR_ATS_AttenceGroup';
	}
	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsBlindAdminHandler&method=exportToExcel";
	url = url+'&billId='+encodeURIComponent(filterStr);
	url = url+'&available='+encodeURIComponent(available);
	url = url+'&holidayPolicy='+encodeURIComponent(holidayPolicy);
	url = url+'&exportType='+encodeURIComponent('exportAll');
	openLoader(1,jsBizMultLan.atsManager_BlindOrgAdminList_i18n_2);
		  	shr.ajax({ 
				type:"post",
				url:url, 
				success:function(res){ 
					closeLoader();    
					document.location.href = url;
			    }, 
			    error : function(res){
			    	shr.showError({message: jsBizMultLan.atsManager_BlindOrgAdminList_i18n_0});
			    	closeLoader(); 
			    } 
		});
	
	}
});