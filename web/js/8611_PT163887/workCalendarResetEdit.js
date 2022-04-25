shr.defineClass("shr.ats.workCalendarResetEdit", shr.framework.Edit, {
	beginDate:"",
	endDate:"",
	isAppendCalendar:false,
	initalizeDOM:function(){
		shr.ats.workCalendarResetEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		that.initEditForm();
		that.isAppendCalendar();
		$("#show_info").text(jsBizMultLan.atsManager_workCalendarResetEdit_i18n_4);
		$("#show_info").css("color","#FF0000");
		$("#message_info").css("background-color", "#E4E4E4");
		$("#message_info").css("width", "98%");
		$("#message_info").css("padding", "8px");
		$("#message_info").css("font-size", "12px");

	}
	
	//日历模板是根据工作日历中自动携带，不可编辑。开始日期字段不可编辑，默认为工作日历最后一日+1
	,initEditForm:function(){
		var that = this;
		$("#breadcrumb li").html(jsBizMultLan.atsManager_workCalendarResetEdit_i18n_6);
		$("#save").hide();
		$("#cancel").hide();
		//设置开始日期
		var endDate = "";
		var beginDate = "";
		var billId = parent.$("#id").val();
       
		that.remoteCall({
			 type:"post",
			 async:false,
			 method:"isAppendCalendar",
			 param:{billId: billId
			 },
			 success:function(res){
			   isAppendCalendar = res.isAppendCalendar;
			 }
		});
		
		if(isAppendCalendar){
			that.remoteCall({
				 type:"post",
				 async:false,
				 method:"getNewBeginDate",
				 param:{billId: billId
				 },
				 success:function(res){
					beginDate = res.newBeginDateStr;
					endDate = res.newEndDateStr;
					that.beginDate = beginDate;
					that.endDate = endDate;
				 }
			});
		}else{
			that.remoteCall({
				 type:"post",
				 async:false,
				 method:"getWorkCalendarById",
				 param:{id: billId
				 },
				 success:function(res){
					endDate = res.endDate;
					beginDate = res.beginDate;
					that.beginDate = beginDate;
					that.endDate = endDate;
				 }
			});
		}
		atsMlUtile.setTransDateTimeValue("beginDate",beginDate);
		atsMlUtile.setTransDateTimeValue("endDate",endDate);
	
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
					}
				}	
			});
		//设置法定节假日
		that.remoteCall({
			   type: "post",
			   method: "getLegalHolidayInfoByCalId",
			   param:{billId:workCalendarId},
			   success:function(result){
			   	        $("#items_legalHoliday").val(result.name);
						$("#items_legalHoliday_el").val((result.id));
			   }
		});
	}
	//取消，直接关闭弹框
	,doCancelAction:function(){
		var that = this;
		parent.$("#operationDialog").dialog("close");
	}
	
	//保存追加的数据
	,doSaveAction:function(){
		var that = this;
		if(isAppendCalendar){//如果追加过
		   var beginDate = new Date(Date.parse(atsMlUtile.getFieldOriginalValue("beginDate").replace(/-/g,   "/")));
	       var defaultBeginDate = new Date(Date.parse(that.beginDate.replace(/-/g,   "/")));  
		   if(beginDate.getTime()<defaultBeginDate.getTime()){
			   shr.showError({message:jsBizMultLan.atsManager_workCalendarResetEdit_i18n_1});
			   return false;
		   }
		}
		openLoader(1,jsBizMultLan.atsManager_workCalendarResetEdit_i18n_5);
		
		var workCalendarId = parent.$("#id").val();
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		var calendarTemplId = $("#calendarTempl_el").val();
		var legalHolidayId = $("#items_legalHoliday_el").val();
		if(endDate != "" && legalHolidayId != ""){
			//校验开始日期和结束日期
			var beginDateArr = beginDate.split("-");
			var beginDateTemp = new Date(beginDateArr[0], beginDateArr[1], beginDateArr[2]);
			var beginTimes = beginDateTemp.getTime();
			var endDateArr = endDate.split("-");
			var endDateTemp = new Date(endDateArr[0], endDateArr[1], endDateArr[2]);
			var endTimes = endDateTemp.getTime();
			if(beginTimes >= endTimes){
				shr.showError({message:jsBizMultLan.atsManager_workCalendarResetEdit_i18n_3});
				closeLoader();
				return;
			}else{
				that.remoteCall({
				type:"post",
				method:"createNewByModel",
				param:{billId:workCalendarId,beginDate:beginDate,endDate:endDate,
						legalHoliday:legalHolidayId,calendarTempl:calendarTemplId},
				success:function(res){
					closeLoader();
					top.Messenger().post({message:jsBizMultLan.atsManager_workCalendarResetEdit_i18n_0});
					parent.$("#operationDialog").dialog("close");
					parent.location.reload();
				}
				})
			}
		}else{
			closeLoader();
			shr.showError({message:jsBizMultLan.atsManager_workCalendarResetEdit_i18n_2});
		}
	},
	isAppendCalendar: function(){
		var that = this;
		var workCalendarId = parent.$("#id").val();
		that.remoteCall({
				type:"post",
				async:false,
				method:"isAppendCalendar",
				param:{billId:workCalendarId},
				success:function(res){
					that.isAppendCalendar = res.isAppendCalendar;
				}
		});
	}
})
