shr.defineClass("shr.ats.workCalendarAppendEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.workCalendarAppendEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		that.initEditForm();

	}
	
	//日历模板是根据工作日历中自动携带，不可编辑。开始日期字段不可编辑，默认为工作日历最后一日+1
	,initEditForm:function(){
		var that = this;
		$("#breadcrumb li").html(jsBizMultLan.atsManager_workCalendarAppendEdit_i18n_4);
		$("#save").hide();
		$("#cancel").hide();
		//设置开始日期
		var endDate = "";
		var billId = parent.$("#id").val();
		that.remoteCall({
			 type:"post",
			 async:false,
			 method:"getRealEndDate",
			 param:{billId: billId
			 },
			 success:function(res){
			    endDate = res.endDate;
			 }
		});
		//var endDate = parent.$("#endDate").val();
		var endDate = new Date(endDate);//@
		var n = 1;
		var nextDay = new Date(endDate - 0 + n * 86400000);
		beginDate = nextDay.getFullYear() + "-" + ("0" + (nextDay.getMonth() + 1)).slice(-2) + "-" 
					+ ("0" + nextDay.getDate()).slice(-2);
		atsMlUtile.setTransDateTimeValue("beginDate",beginDate);
		$("#beginDate").attr("disabled", true);
		//that.getField("beginDate").shrDateTimePicker('disable');
		$("#beginDate").shrDateTimePicker("disable");
		var endDay = (nextDay.getFullYear() + 1) + "-" + ("0" + (nextDay.getMonth() + 1)).slice(-2) + "-" 
					+ ("0" + nextDay.getDate()).slice(-2);
		if(nextDay.getMonth() == 1){
			if((nextDay.getFullYear()%4 == 0 && nextDay.getFullYear()%100 != 0) || 
				(nextDay.getFullYear()%100 == 0 && nextDay.getFullYear()%400 == 0)){
					if(nextDay.getDate() == 29){
						endDay = (nextDay.getFullYear() + 1) + "-" + ("0" + (nextDay.getMonth() + 1)).slice(-2) + "-" 
								+ ("0" + (nextDay.getDate()-1)).slice(-2);
					}
				}else{
					if(nextDay.getDate() == 28){
						endDay = (nextDay.getFullYear() + 1) + "-" + ("0" + (nextDay.getMonth() + 1)).slice(-2) + "-" 
								+ ("0" + (nextDay.getDate()+1)).slice(-2);
					}
				}
		}
		var endDayDate = new Date(endDay.replace(/-/g, "/"));
		var endDayYesterday = new Date(endDayDate - 0 -  n * 86400000);
		var endDayStr = (endDayYesterday.getFullYear()) + "-" + ("0" + (endDayYesterday.getMonth() + 1)).slice(-2) + "-" 
					+ ("0" + endDayYesterday.getDate()).slice(-2);
		atsMlUtile.setTransDateTimeValue("endDate",endDayStr);
		//设置日历模板
		workCalendarId = parent.$("#id").val();
		that.remoteCall({
				type:"post",
				method:"getCalendarTemplById",
				param:{workCalendarId:workCalendarId},
				success:function(result){
					var result = result;
					if(result.tag == "1"){
						$("#calendarTempl").val(result.name);
						$("#calendarTempl_el").val((result.calendarTempl));
						//$("#calendarTempl").attr("disabled", true);
						//$("#calendarTempl").shrPromptBox("disable");
					}
				}	
				})
	}
	//取消，直接关闭弹框
	,doCancelAction:function(){
		var that = this;
		parent.$("#operationDialog").dialog("close");
	}
	
	//保存追加的数据
	,doSaveAction:function(){
		openLoader(1,jsBizMultLan.atsManager_workCalendarAppendEdit_i18n_3);
		var that = this;
		//that.doSave(event,"save"); //--model没法通过这种方式传到后台，需要传Id
		var workCalendarId = parent.$("#id").val();
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		var calendarTemplId = $("#calendarTempl_el").val();
		var legalHolidayId = $("#items_legalHoliday_el").val();
		if(endDate != "" && legalHolidayId != ""){
			//校验开始日期和结束日期
			var regEx = new RegExp("\\-","gi");
			var beginDateStr = beginDate.replace(regEx,"/");
			var endDateStr = endDate.replace(regEx,"/");
			var beginDateTemp = new Date(beginDateStr);//@
			var endDateTemp = new Date(endDateStr);	//@
			var beginTimes = beginDateTemp.getTime();
			var endTimes = endDateTemp.getTime();
			if(beginTimes >= endTimes){
				closeLoader();
				shr.showError({message:jsBizMultLan.atsManager_workCalendarAppendEdit_i18n_2});
				return;
			}else{
				that.remoteCall({
				type:"post",
				method:"appendWorkCalendarById",
				param:{workCalendarId:workCalendarId,beginDate:beginDate,endDate:endDate,
						legalHolidayId:legalHolidayId,calendarTemplId:calendarTemplId},
				success:function(res){
					closeLoader();
					top.Messenger().post({message:jsBizMultLan.atsManager_workCalendarAppendEdit_i18n_0});
					parent.$("#operationDialog").dialog("close");
					parent.location.reload();
				}
				})
			}
		}else{
			closeLoader();
			shr.showError({message:jsBizMultLan.atsManager_workCalendarAppendEdit_i18n_1});
		}
	}
})
