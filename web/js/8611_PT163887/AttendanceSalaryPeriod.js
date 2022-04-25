shr.defineClass("shr.ats.AttendanceSalaryPeriod", shr.framework.List, {
	initalizeDOM : function () {
		shr.ats.AttendanceSalaryPeriod.superClass.initalizeDOM.call(this);
		var self = this;
		this.initJsontype(); 
	},
     initJsontype:function(){
	 	var _self = this;
        var year_json = {
			id: "type" + i,
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		var Month_json = {
			id: "type" + i,
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		
		var yearValue=[];
		for(var i=1990;i<2050;i++){
		  yearValue.push({'value':i,'alias':i});
		}
		var monthValue=[];
		for(var j=1;j<13;j++){
		  monthValue.push({'value':j,'alias':j});
		}
		year_json.data = yearValue;
		Month_json.data=monthValue;
	     var row_fields_work = '<div  class="row-fluid row-block row_field">'
			  + '<div class="spanSelf">'
			 + jsBizMultLan.atsManager_AttendanceSalaryPeriod_i18n_2
			 + ' <input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></div>'
			  + '<div class="spanSelf">'
			 + jsBizMultLan.atsManager_AttendanceSalaryPeriod_i18n_5
			 + ' <input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></div>'
			  +'</DIV>'
		$('#attendanceSalaryPeriod').append(row_fields_work);
		$('input[name=YEAR]').shrSelect(year_json);	
		$('input[name=MONTH]').shrSelect(Month_json);	
	 }, 
	saveDataRowAction : function(){
		var that = this;
		var periodYear = $('input[name=YEAR]').val();
		var periodMonth = $('input[name=MONTH]').val();
		var beginDate=window.parent.atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate=window.parent.atsMlUtile.getFieldOriginalValue("endDate");
		var	adminOrgId =window.parent.$("#AdminOrgUnit_el").val();
		var proposerId =window.parent.$("#proposer_id").val();
	    if (periodYear == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_AttendanceSalaryPeriod_i18n_3});
			return false;
		}
		
		if (periodMonth == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_AttendanceSalaryPeriod_i18n_4});
			return false;
		}
		if(!that.verifyStartTime()){
			shr.showInfo({message: jsBizMultLan.atsManager_AttendanceSalaryPeriod_i18n_1, hideAfter: 3});
			return ;
		}
		if(!that.verifyEndTime()){
		   	shr.showError({message: jsBizMultLan.atsManager_AttendanceSalaryPeriod_i18n_0, hideAfter: 3});
			return ;
		}
		var  period=periodYear+"-"+periodMonth ;
		that.remoteCall({
			type:"post",
			//async: false,
			method:"save",
			param:{beginDate:beginDate ,endDate:endDate,adminOrgId:adminOrgId,proposerId:proposerId,period:period},
			//param:{begin_Date:beginDate,end_Date:endDate,isAgainFetchCard:isAgainFetchCard},
			//openLoader(1);
			success:function(res){
				if (res.flag == 1) {
				//    closeLoader();
					window.parent.$("#operationDialog").dialog('close');
				    window.parent.jQuery('#reportGrid').jqGrid("reloadGrid");	
				}
			}
		});
	} ,
	verifyStartTime :function(){
	  	var beginDate=window.parent.atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate=window.parent.atsMlUtile.getFieldOriginalValue("endDate");
	   if(beginDate>endDate){
	      return false;
	   }else{
	      return true;
	   }
	},
	verifyEndTime:function(){
	    var beginDate=window.parent.atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate=window.parent.atsMlUtile.getFieldOriginalValue("endDate");
		var curDate = new Date();
		var curDateY = curDate.getFullYear();
		var curDateM = curDate.getMonth()+1;
		curDateM = curDateM<10?"0"+curDateM:curDateM;
		var curDateD = curDate.getDate()-1;
		curDateD = curDateD<10?"0"+curDateD:curDateD;
		var curDateStr = curDateY+"-"+curDateM+"-"+curDateD;
		if(endDate > curDateStr){
			return false;
		}else{
			return true;
		}
	}
	
	 

});

 
