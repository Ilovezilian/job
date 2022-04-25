shr.defineClass("shr.ats.turnShiftTime", shr.ats.turnInitBreadCrumb, {
	initalizeDOM:function(){
		var that = this;
		shr.ats.turnShiftTime.superClass.initalizeDOM.call(this);
		
		/*$('input[name="beginDate"]').attr("readonly",true);
		$('input[name="endDate"]').attr("readonly",true);*/
		
		that.setSystemTime();
	},
	onNext:function(_wizard){
		var index = $('.wz_navi_step.enabled.selected').attr('index');
		var beginDate = $('input[name="beginDate"]').val();
		
		if(_wizard._index > index && (beginDate.length < 1)){
			var options={message:jsBizMultLan.atsManager_turnShiftTime_i18n_7};
			$.extend(options, {
							type: 'error',
							hideAfter: 3,
							showCloseButton: true
			});
			top.Messenger().post(options);
			return {status: 0};
		}
		var endDate = $('input[name="endDate"]').val();
		if(_wizard._index > index && endDate.length < 1){
			var options={message:jsBizMultLan.atsManager_turnShiftTime_i18n_0};
			$.extend(options, {
							type: 'error',
							hideAfter: 3,
							showCloseButton: true
			});
			top.Messenger().post(options);
			return {status: 0};
		}
		var regEx = new RegExp("\\-","gi");
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
		if((_wizard._index > index)  && !beginDate.match(reg)){
		    shr.showError({message: jsBizMultLan.atsManager_turnShiftTime_i18n_4,hideAfter:3});
		    return {status: 0};
		}else{
		   if((_wizard._index > index) && !this.isdate(beginDate.split("-")[0],beginDate.split("-")[1], beginDate.split("-")[2])){
			    shr.showError({message: jsBizMultLan.atsManager_turnShiftTime_i18n_3,hideAfter:3});
			    return {status: 0};
		   }
		}
		if((_wizard._index > index) && !endDate.match(reg)){
		    shr.showError({message: jsBizMultLan.atsManager_turnShiftTime_i18n_2,hideAfter:3});
		    return {status: 0};
		}else{
		   if((_wizard._index > index)  && !this.isdate(endDate.split("-")[0],endDate.split("-")[1], endDate.split("-")[2])){
			    shr.showError({message: jsBizMultLan.atsManager_turnShiftTime_i18n_1,hideAfter:3});
			    return {status: 0};
			}
		}
		
		var beginDate_01 = new Date(beginDate.replace(/-/g, "/"));
		var endDate_01  = new Date(endDate.replace(/-/g, "/"));
		if((_wizard._index > index) && (beginDate_01.getTime() > endDate_01.getTime())){
			var options={message:jsBizMultLan.atsManager_turnShiftTime_i18n_6};
			$.extend(options, {
							type: 'error',
							hideAfter: 3,
							showCloseButton: true
			});
			top.Messenger().post(options);
			return {status: 0};
		}
		var reBeginDate_01 = new Date(beginDate.replace(/-/g, "/"));
		reBeginDate_01.setMonth(reBeginDate_01.getMonth() + 1);
		var leftsecond = endDate_01.getTime() - beginDate_01.getTime();
		var rightsecond = reBeginDate_01.getTime() - beginDate_01.getTime();
		if(leftsecond  > rightsecond){
			shr.showWarning({message: jsBizMultLan.atsManager_turnShiftTime_i18n_5});
			return;
		}	
		_wizard.setParm("beginDate",beginDate);
		_wizard.setParm("endDate",endDate);
	    return {status: 1};
	},
	
	onNaviLoad:function(_navi){
		var that = this;
		var beginDate = _navi.getParm("beginDate");
		if(beginDate != null && beginDate != undefined){
			$('input[name="beginDate"]').attr("value",beginDate);
		}
	
		var endDate = _navi.getParm("endDate");
		if(endDate != null && endDate != undefined){
			$('input[name="endDate"]').attr("value",endDate);
		}
	},
	setSystemTime:function(){
		var currentDate = new Date();
		var year = currentDate.getFullYear();    //获取完整的年份(4位,1970-????)
		var month = currentDate.getMonth();       //获取当前月份(0-11,0代表1月)
		var day = currentDate.getDate();        //获取当前日(1-31)
		$('input[name="endDate"]').val(getUpDate(year,month,day));
		
		month = (parseInt(month) + 1);
		if( month < 10){
			month = '0' + month;
		}
		if(day < 10){
			day = '0' + day;
		}
		$('input[name="beginDate"]').val(year + '-'+ month + '-' + day);
	},
	isdate: function(intYear,intMonth,intDay){  
		if(isNaN(intYear)||isNaN(intMonth)||isNaN(intDay)) 
		    return false;  
		if(intMonth>12||intMonth<1) 
		     return false;   
		if ( intDay<1||intDay>31)
		     return false;   
		if((intMonth==4||intMonth==6||intMonth==9||intMonth==11)&&(intDay>30)) 
		     return false;   
		if(intMonth==2){     
			if(intDay>29) 
			return false;     
			if((((intYear%100==0)&&(intYear%400!=0))||(intYear%4!=0))&&(intDay>28))
			return false;   
	    }  
	    return true;  
  }
});

function getUpDate(year,month,day){

    var lastYear = year;
    var lastMonth = parseInt(month) + 2;
    
    if(lastMonth > 12) {
        lastYear = parseInt(lastYear) + 1;
        lastMonth = 1;
    }
    var lastDay = day;
    var lastDays = new Date(lastYear,lastMonth,0);
    lastDays = lastDays.getDate();
    if(lastDay > lastDays) {
        lastDay = lastDays;
    }
    if(lastMonth < 10) {
        lastMonth = '0'+lastMonth;
    }
    if(lastDay < 10){
    	lastDay = '0' + lastDay;
    }
    return lastYear + '-'+ lastMonth + '-' + lastDay;
}

