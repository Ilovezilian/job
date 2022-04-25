shr.defineClass("shr.ats.AtsTripBillEditForDialog", shr.framework.Edit, {
	_uiClass:"",
	initalizeDOM:function(){
		shr.ats.AtsTripBillEditForDialog.superClass.initalizeDOM.call(this);
		var that = this ;
		var fromFlag = localStorage.getItem("fromFlag");
		if(fromFlag == "employeeBoard" || fromFlag == "punchCard"){//来自我的考勤或者我的打卡记录的时候。将导航条删除掉。
	        $("#breadcrumb").parent().parent().remove();
	        localStorage.removeItem("fromFlag");
	    }
		$('#list').die();
		$('#list').shrButton({
						actionBinding: 'cancelAction',
						subAction: ''
		});
		atsTimeZoneService.initTimeZoneForEdit("entries.timeZone");
		that.setButtonVisible(); //初始化页面安装状态,如果是已经提交的或者审批通过的单据编辑按钮不显示
		that.processF7ChangeEvent();
		//处理出差天数-增加change事件
		that.processTripDays();
		//计算出差天数
		//if ($("#ui_operateparam_status").val() == "ADDNEW" ) {
		if ( that.getOperateState() == "ADDNEW" ) {
			that.calculataTripDays(); 
		}
		that.allDayOnChange();
		that.initByIsAllDay();
        that.initCcPersonPrompt();
		//alert(that.getOperateState());//ADDNEW 新增页面   VIEW 查看页面  EDIT 编辑页面
	},
    initCcPersonPrompt() {
        if ($('#ccPersonIds').length == 0) {
            return;
        }
        atsCcPersonUtils.initCCPersonIdsPrompt(this);
        if (this.getOperateState() != 'VIEW') {
            var person = $('#entries_person').shrPromptBox("getValue");
            if (!person) {
                // shr.showWarning({message:"请先选择人员"});
            } else {
                $('#ccPersonIds').shrPromptBox("setOtherParams", {
                    personId: person.id
                });
            }
        }
    },
    assembleModel: function() {
        var model = shr.ats.AtsTripBillEditForDialog.superClass.assembleModel.call(this);
        model.ccPerson = model.ccPersonIds;
        return model;
    },
	//处理出差天数,出差结束时间-出差开始时间+1 = 出差天数
	processTripDays : function(){
		var that = this ;
		//加班结束时间选择完后 计算申请加班小时数
		$("#entries_tripEndTime").change(function(){
			that.tripEndTimeChange();
		});
		$("#entries_tripStartTime").change(function(){
			that.tripStartTimeChange();
		});

		if(that.getOperateState() != 'VIEW'){
			$("#entries_startTimeDate").shrDateTimePicker('option',{onChange : function(){
					that.startChange();
				}});
			$("#entries_startTimeHMS").shrDateTimePicker('option',{onChange : function(){
					that.startChange();
				}});
			$("#entries_endTimeDate").blur(function(){
				that.endChange();
			});
			$("#entries_endTimeDate").focus(function(){
				that.saveNowEndDate();
			});
			$("#entries_endTimeHMS").shrDateTimePicker('option',{onChange : function(){
					that.endChange();
				}});
		}
	},

	saveNowEndDate:function(){
		var endTimeDate = atsMlUtile.getFieldOriginalValue("entries_endTimeDate");
		_blurEndDate = endTimeDate;
	},

	tripStartTimeChange:function(){
		var tripStartTime = $("#entries_tripStartTime").shrDateTimePicker("getValue");
		var person = $("#entries_person").shrPromptBox('getValue');
		tripStartTime && HRTimeZoneService.getHRTimeZone(person.id,"#entries_timeZone",tripStartTime);
	},

	tripEndTimeChange:function(){
		var that = this ;
		that.calculataTripDays();
	},

	//当开始出差时间日期或者是开始出差时间点发生变化的时候触发的操作
	startChange : function(){
		var that = this ;
		var startTimeDate = atsMlUtile.getFieldOriginalValue("entries_startTimeDate");
		var startTimeHMS = atsMlUtile.getFieldOriginalValue("entries_startTimeHMS");
		var allDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
		if(startTimeDate == null || startTimeDate == ''){
			startTimeDate = that.getToday();
		}
		if(startTimeHMS == null || startTimeHMS == ''){
			startTimeHMS = "00:00:00";
		}else {
			startTimeHMS = startTimeHMS.split(" ")[1];
		}
		var startTime = startTimeDate +" "+startTimeHMS;

		if(allDay){
			var end_Time = atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
			var personId = atsMlUtile.getFieldOriginalValue("entries_person");
			that.remoteTripTimeByAllDay(personId,startTime ,end_Time);
			that.tripStartTimeChange();
		}else {
			$("#entries_tripStartTime").shrDateTimePicker('setValue', startTime);
			$("#entries_startTimeHMS").shrDateTimePicker('setValue', startTime);
			that.tripStartTimeChange();
		}
	},

	//当结束出差时间日期或者是结束出差时间点发生变化的时候触发的操作
	endChange : function(){
		var that = this ;
		var endTimeDate = atsMlUtile.getFieldOriginalValue("entries_endTimeDate");
		var endTimeHMS = atsMlUtile.getFieldOriginalValue("entries_endTimeHMS");
		var allDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
		if(endTimeDate == null || endTimeDate == ''){
			endTimeDate = that.getToday();
		}
		if(endTimeHMS == null || endTimeHMS == ''){
			endTimeHMS = "00:00:00";
		}else {
			endTimeHMS = endTimeHMS.split(" ")[1];
		}
		var endTime = endTimeDate +" "+endTimeHMS;

		if(allDay){
			if(_blurEndDate == endTimeDate){
				return;
			}
			var begin_Time = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
			var personId = atsMlUtile.getFieldOriginalValue("entries_person");
			that.remoteTripTimeByAllDay(personId,begin_Time ,endTime);
			that.tripEndTimeChange();
		}else {
			$("#entries_tripEndTime").shrDateTimePicker('setValue', endTime);
			$("#entries_endTimeHMS").shrDateTimePicker('setValue', endTime);
			that.tripEndTimeChange();
		}
	},
	//获得今天的日期 yyyy-mm-dd
	getToday : function(){
		var date = new Date();
		var today = "" + date.getFullYear() + "-";
		today += (date.getMonth()+1) + "-";
		today += date.getDate() ;
		return today;
	},

	setAllDayToNot:function(){
		$("#entries_isAllDay").shrCheckbox("unCheck");
	},

	allDayOnChange:function(){
		var that = this;
		if(that.getOperateState() == 'VIEW'){
			return;
		}
		$('#entries_isAllDay').shrCheckbox('onChange', function () {
			var allDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
			if(allDay){
				var personId = atsMlUtile.getFieldOriginalValue("entries_person");
				var begin_Time = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
				var end_Time = atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
				if(begin_Time != null || end_Time != null){
					that.remoteTripTimeByAllDay(personId,begin_Time,end_Time);
				}
				$("#entries_startTimeHMS").shrDateTimePicker("disable");
				$("#entries_endTimeHMS").shrDateTimePicker("disable");
			}else {
				$("#entries_startTimeHMS").shrDateTimePicker("enable");
				$("#entries_endTimeHMS").shrDateTimePicker("enable");
			}
		});
	},

	//远程获取整天出差时间
	remoteTripTimeByAllDay : function(personId,begin_Time,end_Time){
		var that = this;
		_self.remoteCall({
			type:"post",
			method:"getAllDayBeginAndEndTime",
			handler:"com.kingdee.shr.ats.web.handler.AtsTripBillEditHandler",
			param:{
				personId:personId,
				begin_Time:begin_Time,
				end_Time:end_Time,
			},
			async: false,
			success:function(res){
				var info =  res;
				$("#entries_tripStartTime").shrDateTimePicker('setValue', info.beginTime);
				$("#entries_tripEndTime").shrDateTimePicker('setValue', info.endTime);
				that.setDateAndHMS(info.beginTime,info.endTime);
			}
		});
		that.calculataTripDays();
	},

	setDateAndHMS:function(begin_Time,end_Time){
		if(begin_Time != null && begin_Time != ''){
			$("#entries_startTimeDate").shrDateTimePicker('setValue', begin_Time.split(" ")[0]);
			$("#entries_startTimeHMS").shrDateTimePicker('setValue', begin_Time);
		}
		if(end_Time != null && end_Time != ''){
			$("#entries_endTimeDate").shrDateTimePicker('setValue', end_Time.split(" ")[0]);
			$("#entries_endTimeHMS").shrDateTimePicker('setValue', end_Time);
		}
	},

	setDateAndHMSVIEW:function(begin_Time,end_Time){
		var that = this;
		that.setDateVIEWDetial($("#entries_startTimeDate"),begin_Time);
		that.setHMSVIEWDetial($("#entries_startTimeHMS"),begin_Time);

		that.setDateVIEWDetial($("#entries_endTimeDate"),end_Time);
		that.setHMSVIEWDetial($("#entries_endTimeHMS"),end_Time);
	},

	setHMSVIEWDetial:function(element,datetime){
		if(datetime != null && datetime != ''){
			element.text(datetime.split(" ")[1]);
			element.attr("original-value",datetime.split(" ")[1]);
			element.attr("value",datetime.split(" ")[1]);
			element.attr("title",datetime.split(" ")[0]);
			element.removeClass("text-Unfilled");
		}
	},

	setDateVIEWDetial:function(element,datetime){
		if(datetime != null && datetime != ''){
			element.text(datetime.split(" ")[0]);
			element.attr("original-value",datetime.split(" ")[0]);
			element.attr("value",datetime.split(" ")[0]);
			element.attr("title",datetime.split(" ")[0]);
			element.removeClass("text-Unfilled");
		}
	},

	initByIsAllDay:function(){
		var that = this;

		var begin_Time = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
		var end_Time = atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
		if(that.getOperateState() == 'VIEW'){
			that.setDateAndHMSVIEW(begin_Time,end_Time);
		} else if (that.getOperateState() == "EDIT") {
			that.setDateAndHMS(begin_Time,end_Time);
			var allDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
			if(allDay){
				$("#entries_startTimeHMS").shrDateTimePicker("disable");
				$("#entries_endTimeHMS").shrDateTimePicker("disable");
			}
		}
	},




	getCrossTripMsg:function(){
		var allDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
		if(!allDay){
			var info = false;
			var personId = atsMlUtile.getFieldOriginalValue("entries_person");
			var begin_Time = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
			var end_Time = atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
			_self.remoteCall({
				type:"post",
				method:"getCrossTripMsg",
				handler:"com.kingdee.shr.ats.web.handler.AtsTripBillEditHandler",
				param:{
					personId:personId,
					begin_Time:begin_Time,
					end_Time:end_Time,
				},
				async: false,
				success:function(res){
					info =  res.crossTrip;
				}
			});
			return info;
		}
		return false;
	},
	
	calculataTripDays : function(){ 
		var that = this;
		var tripStartTime = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
		var tripEndTime = atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
		
		if ( tripStartTime!=""&&tripStartTime!=null && tripEndTime!=""&&tripEndTime!=null ) {
			tripStartTime = tripStartTime.replace("\\-","/");
		 	tripEndTime = 	tripEndTime.replace("\\-","/");
		 	var tripStartTimeOfDate = new Date(tripStartTime);
		 	var tripEndTimeOfDate = new Date(tripEndTime);
		 	var longTime = tripEndTimeOfDate.getTime() - tripStartTimeOfDate.getTime();
		 	var dayTime = 24 * 60 * 60 * 1000.0;
		 	var personId = $("#entries_person_el").val();
			var isAllDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
		 	that.remoteCall({
			type:"post",
			async: false,
			method:"getRealLeaveLengthInfo",
			param:{personId:personId,beginTime:tripStartTime,endTime:tripEndTime,isAllDay:isAllDay},
			success:function(res){
				info =  res;
				
				var day = parseFloat(info.leaveBillDays);
			 	day = day.toFixed(atsMlUtile.getSysDecimalPlace());
			 	atsMlUtile.setTransNumValue("entries_tripDays",day);
			}
		});
		 	
		}
	},
	processF7ChangeEvent : function(){
		var that = this;
		that.initActionF7();
		if (that.getOperateState() != 'VIEW') {
			$("#entries_person").shrPromptBox("option", {
				onchange : function(e, value) {
					//alert( JSON.stringify( value ) );
					var info = value.current;
					$("#entries_person_number").val(info.number);//@
					
					that.remoteCall({
						type:"post",
						method:"getPersonInfosByPersonId",
						param:{personId: info.id},
						success:function(res){
							var info = res;
							$('#entries_adminOrgUnit_el').val( info.positionDepId );		//部门ID
							$('#entries_adminOrgUnit').val( info.positionDepName.name);	//部门名称  
							
							$("#entries_position_el").val(info.positionId);		//职位ID
							$("#entries_position").val(info.positionName.name);  //职位名称
						}
					});
					
				}
				,afterOnSelectRowHandler:function(e,object){
					var person = object && object.value;
					if(!person){
						return;
					}
					var tripStartTime = $("#entries_tripStartTime").shrDateTimePicker("getValue");
					tripStartTime && HRTimeZoneService.getHRTimeZone(person.id,"#entries_timeZone",tripStartTime);
				}
			});
		}
	},
	cancelAction:function(){

	 	this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsTripBillList'
		});
	},
	/**
	 * 提交真正执行方法
	 */
	doSubmit: function(event, action) {
		var _self = this;
		var data = _self.assembleSaveData(action);
		
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		shr.doAction({
			target: target,
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(response) {
				if (_self.isFromWF()) {
					// 来自任务中心
					var parent = window.parent,
						submitSuccess = parent.submitSuccess;
					
					if ($.isFunction(submitSuccess)) {
						// 回调父页面方法
						var assignmentID = shr.getUrlRequestParam('assignmentID');
						submitSuccess.call(parent, assignmentID);
					} else {
						// 查看状态
						_self.reloadPage({
							method: 'view'
						});
					}
				} else {
					// 普通提交，返回上一页面
					//_self.back();
					//提交完之后再返回列表
					_self.reloadPage({
				 		uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillList"
				 	});
				}
			}
		});
		
	},
	/**
	 * 初始化ActionFilter,过滤用工状态,把离职的去掉   
	 */
	initActionF7 : function () {
		var that = this;
		var fliter = " employeeType.number != 'S09' "; //001正式 002试用 003停薪留职  004离退休   s09 离职 
		$("#entries_person").shrPromptBox("setFilter",fliter);
	},
	
	verify:function(){
		var that = this;
		var regEx = new RegExp("\\-","gi"); //i不区分大小写 g匹配所有
	 	var tripStartTime = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
		var tripEndTime = atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
		tripStartTime = tripStartTime.replace(regEx,"/");
		tripEndTime = tripEndTime.replace(regEx,"/");
		 
		var tripStartTimeOfDate = new Date(tripStartTime); 
	 	var tripEndTimeOfDate = new Date(tripEndTime);
	 	var longTime = tripEndTimeOfDate.getTime() - tripStartTimeOfDate.getTime();
	 	if (longTime <= 0) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsTripBillEditForDialog_i18n_0});
			return false;
	 	} 
		
		var info ;
		var personId = $("#entries_person_el").val();
		var begin_Time = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
		var end_Time = atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
		var billId =  $("#id").val();
		var allDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
		that.remoteCall({
			type:"post",
			async: false,
			method:"getTripBillInfoByPersonIdAndTripTime",
			param:{personId:personId,begin_Time:begin_Time,end_Time:end_Time,billId:billId,allDay:allDay},
			success:function(res){
				info =  res;
			}
		});
		if(info.addFlag > 0) {
		  shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsTripBillEditForDialog_i18n_5
			  ,[info.billNo,"<br/>",info.personName,info.tripBeginDate,info.tripEndDate])});
		  return false;
		}
		if(that.isFromWF()) 
		{
			var model = that.getCurrentModel(); 
			that.remoteCall({
			    method:"validateIsFillTrip",
			    param:{model:model},
				async: false,
			    success:function(res){
					info =  res;
					if(res.errorString){
						  shr.showError({message:res.errorString});
						  return false;
					}
			    }
			}); 
			
		}
		return true;
	} ,getCurrentModel : function(){
        var model = shr.ats.AtsTripBillEditForDialog.superClass.getCurrentModel.call(this);
        model.ccPersonIds = model.ccPersonIds && model.ccPersonIds.id || "";
        model.ccPerson = model.ccPersonIds;
        return model ;
    },

/**
	 * 设置编辑按钮是否隐藏 这几个单据的跟 转正 调动  离职的 保持一致 以便后续方便统一修改
	 * 比较详细的状态说明 参见 加班单的 setButtonVisible() 方法
	 */
	setButtonVisible : function(){
		var billState = $("#billState").val();
		if (billState) {
			if (billState==3 || jsBizMultLan.atsManager_atsTripBillEditForDialog_i18n_2==billState
				|| billState ==4||jsBizMultLan.atsManager_atsTripBillEditForDialog_i18n_1==billState
				|| billState ==2||jsBizMultLan.atsManager_atsTripBillEditForDialog_i18n_3==billState ) {
				$("#edit").hide();
				$("#submit").hide();
			} else if (1==billState || jsBizMultLan.atsManager_atsTripBillEditForDialog_i18n_4== billState
				|| 2 == billState || jsBizMultLan.atsManager_atsTripBillEditForDialog_i18n_3==billState ) { //未审批或审批中
				if(!this.isFromWF()){
					$("#edit").hide();
					$("#submit").hide();
				}
			}
		}
		if (this.getOperateState().toUpperCase() == 'VIEW') { //查看状态下不允许提交
			$("#submit").hide();
		}
		/*
		if(billState){
			if(!this.isFromWF()){
				if("审批通过" == billState || "审批中" == billState || "未审批" == billState ){
					$("#edit").hide();
					$("#submit").hide(); 
				}
			}
		}*/
	}
	
 
	
});
