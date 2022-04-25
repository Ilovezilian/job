var _endTimes ="";
var _startTimes ="";
shr.defineClass("shr.ats.AtsTripBillEdit", shr.framework.Edit, {
	_uiClass:"",
	initalizeDOM:function(){
		shr.ats.AtsTripBillEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		var startTime=shr.getUrlRequestParam("startAndEnd");
		atsTimeZoneService.initTimeZoneForEdit("entries.timeZone");
		that.setNavigateLine();
		that.setButtonVisible(); //初始化页面安装状态,如果是已经提交的或者审批通过的单据编辑按钮不显示
		that.processF7ChangeEvent();
		//处理出差天数-增加change事件
		that.processTripDays();
		if(startTime != ""){
			_startTimes=startTime;
			_endTimes=startTime;
			that.initStartAndEnd();
		}
		that.processF7ChangeEventHrOrgUnit();
//		that.setDefaultValue();
		//计算出差天数
		//if ($("#ui_operateparam_status").val() == "ADDNEW" ) {
		if ( that.getOperateState() == "ADDNEW" ) {
			that.calculataTripDays(); 
		}
		var operateState = that.getOperateState();
		if (operateState == 'VIEW' || operateState == 'ADDNEW' || operateState == 'EDIT') {
			$("#canTripBillInfoDes").hide();
		}
		if(operateState == 'ADDNEW' || operateState == 'EDIT'){
			$("#entries_isCancelTrip").closest("div[data-ctrlrole='labelContainer']").hide();
		}
		if(that.getOperateState() == "VIEW"){
			that.getCancelLeaveBillInfo();
		}
		that.setNumberFieldEnable();
		//alert(that.getOperateState());//ADDNEW 新增页面   VIEW 查看页面  EDIT 编辑页面
		that.initTripDaysValidate();
		//that.isHaveEffectiveFile();
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.AtsTripBillForm") {

			
		 	if (shrDataManager.pageNavigationStore.getDatas().length == 2) {
		 		$("#breadcrumb").find("li.active").html(jsBizMultLan.atsManager_atsTripBillEdit_i18n_22);
		 		var a = shrDataManager.pageNavigationStore.getDatas()[1];
		 		a.name = jsBizMultLan.atsManager_atsTripBillEdit_i18n_22;
		 		shrDataManager.pageNavigationStore.pop();
				shrDataManager.pageNavigationStore.addItem(a);
		 	}
		 	if (shrDataManager.pageNavigationStore.getDatas().length == 3) {
				$("#breadcrumb li")[2].remove();
		 		$("#breadcrumb").find("li.active").html(jsBizMultLan.atsManager_atsTripBillEdit_i18n_22);
		 		shrDataManager.pageNavigationStore.pop();
		 	}

		 	if (shrDataManager.pageNavigationStore.getDatas().length == 4) {
				$($("#breadcrumb li")[3]).html(jsBizMultLan.atsManager_atsTripBillEdit_i18n_4);
			}
			that.getOperateState() != "VIEW" && $('#entries_person').shrPromptBox('disable');
		 }
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.AtsTripBillForm"){
			that.isHaveEffectiveFile();
		}
		if(that.isFromWF()){
			$("#addInstanceToDeskItem").css('display','none');
		}
		var paramMethod = shr.getUrlRequestParam("method");
     	//从我要请假菜单中点击进来的URL上没有method参数
	
     	if(paramMethod == null){
     	    $("#breadcrumb").find(".active").text(jsBizMultLan.atsManager_atsTripBillEdit_i18n_22);
     	    if(shrDataManager.pageNavigationStore.getDatas().length==0){
     	    	var object_bread_1 = {
     	    			name: jsBizMultLan.atsManager_atsTripBillEdit_i18n_22,
     	    			
						url: window.location.href,
     	    			workPlatformId: "Qz9UfhLqB0+vmMJ4+80EykRLkh4="
     	    	}
     	    	shrDataManager.pageNavigationStore.pop();
				shrDataManager.pageNavigationStore.addItem(object_bread_1);
     	    }
     	}
     	that.initElasticCalCtrl();	
     	that.showTips();
		that.addSocQueryTips();
		$("#entries_tripDays").on("change",function(){
			if(!$("#entries_tripEndTime").val()){
			that.getEndTime();
			}
		});

		that.initCcPersonPrompt();
		that.allDayOnChange();
		that.initByIsAllDay();
	}
	
	/*,setDefaultValue : function (){
		var _self = this;
		_self.remoteCall({
			type:"post",
			method:"setDefaultValue",
			param:{
				personid:""
			},
			async: false,
			success:function(res){
				 $("#entries_tripType").shrPromptBox("setValue",{'BaseInfo.id':res.id,'BaseInfo.name':res.name});
			}
		});
	}*/
	
	,processF7ChangeEventHrOrgUnit : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					
					that.initCurrentHrOrgUnit(info.id);
					that.clearEntriesTripType();
					
					$("#entries_person_number").val("");//@
					
					$("#entries_person").val("");
				}
			});
		}
	},
	positionF7ChangeEvent:function(){
		var self = this;
		if (self.getOperateState() != 'VIEW') {
			
			self.getField("entries.person").shrPromptBox("option",{
				verifyBeforeOpenCallback: function(event){
					
						var hrOrgUnitF7Value = self.getField("hrOrgUnit").shrPromptBox("getValue");
						if(!hrOrgUnitF7Value || $("#hrOrgUnit").val() == ""){
							shr.showError({
								message:jsBizMultLan.atsManager_atsTripBillEdit_i18n_12,
								hideAfter:6
							});
							return false;
						}else{
							return true;							
						}
					
				}
			});
			}
	}
	
	,clearEntriesTripType: function() {
		//$("#entries_tripType").shrPromptBox("setValue",{id:"",name:""});
		//$('#entries_person').shrPromptBox("setValue",{id:"",name:""});
		//$("label[for='entries_person']")[0].style.display = 'none';
	}
	
	,initCurrentHrOrgUnit: function(hrOrgUnitId) {
		var that = this;
		$("#entries_tripType").shrPromptBox().attr("data-params",hrOrgUnitId);
		$("#entries_person").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
	}
	
	,initQuerySolutionHrOrgUnit: function(hrOrgUnitId) {
		 var that = this;
		 that.remoteCall({
			type:"post",
			method:"initQuerySolution",
			param:{
				hrOrgUnitId : hrOrgUnitId
			},
			async: true, //false
			success:function(res){
				
			}
		});
	}
	
	,isHaveEffectiveFile : function() {
		var _self = this;
		_self.remoteCall({
			type:"post",
			method:"isHaveEffectiveFile",
			param:{
				personid:""
			},
			async: false,
			success:function(res){
				var info =  res;
				if (!info.isHaveFile){
					shr.showWarning({message:jsBizMultLan.atsManager_atsTripBillEdit_i18n_7});
				}	
			}
		});
	}
	
	/**
	 * 设置编码字段是否可编辑
	 */
	,setNumberFieldEnable : function() {
		var that = this ;
		if (that.getOperateState().toUpperCase() == 'EDIT' ||　that.getOperateState().toUpperCase() == 'ADDNEW') {
			var tripBillNumberFieldCanEdit = that.initData.tripBillNumberFieldCanEdit;
			if (typeof tripBillNumberFieldCanEdit != 'undefined' && !tripBillNumberFieldCanEdit) {
				that.getField('number').shrTextField('option', 'readonly', true);
			}
			//初始化HR组织ID
			var hrOrgUnitID = that.initData.initCurrentHrOrgUnit;
			if (typeof hrOrgUnitID != 'undefined' && hrOrgUnitID) {
				that.initCurrentHrOrgUnit(hrOrgUnitID);
			}else{
				that.initCurrentHrOrgUnit($("#hrOrgUnit").shrPromptBox("getValue").id);
			}
		}
	}
	//提交即生效
	,submitEffectAction : function (event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		if ($form.valid() && _self.verify()) {
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_tripStartTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_tripEndTime").split(" ")[0];
			var personId = $("#entries_person_el").val();	
			var billType = "trip";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: true,
				success:function(res){
					var result = res.result;
					if(result==""){
						if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
							shr.showConfirm(jsBizMultLan.atsManager_atsTripBillEdit_i18n_8, function() {
								_self.prepareSubmitEffect(event, 'submitEffect');
							});
						}else{
							shr.showConfirm(jsBizMultLan.atsManager_atsTripBillEdit_i18n_11, function() {
								_self.prepareSubmitEffect(event, 'submitEffect');
							});
						}
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_atsTripBillEdit_i18n_19,function(){
							if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
								shr.showConfirm(jsBizMultLan.atsManager_atsTripBillEdit_i18n_8, function() {
									_self.prepareSubmitEffect(event, 'submitEffect');
								});
							}else{
								shr.showConfirm(jsBizMultLan.atsManager_atsTripBillEdit_i18n_11, function() {
									_self.prepareSubmitEffect(event, 'submitEffect');
								});
							}
						});
					}
				}
			});
		}	
	}
	,assembleModel: function() {	    
		var model = shr.ats.AtsTripBillEdit.superClass.assembleModel.call(this);		
		var personId = model.entries.person;
		var date = model.entries.tripStartTime;			
		var personDateStr = personId +"_"+date.substring(0,10);		
		_self.remoteCall({
			type:"post",
			method:"getPersonAdminOrgUnit",
			handler:"com.kingdee.shr.ats.web.handler.AtsBillBaseEditHandler",
			param:{
				personDateStr:personDateStr
			},
			async: false,
			success:function(res){
				var info =  res;																				
				if(res[personDateStr] && res[personDateStr].adminOrgUnit){
					model.entries["adminOrgUnit"] = res[personDateStr].adminOrgUnit;
					model.entries["position"] = res[personDateStr].position;
				}
			}
		});
        model.ccPerson = model.ccPersonIds;
		return model ;
	}
	,prepareSubmitEffect : function (event, action){
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
				_self.back();
			}
		});	
	}
	/**
	 * 点击取消按钮 返回到个人出差列表list(个人) ||  com.kingdee.eas.hr.ats.app.AtsTripBillList
	 */
	,cancelAction:function(){
		/*var that = this ;
	 	window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsTripBillList";*/
	 	var that = this ;
	 	var serviceId;
	 	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsTripBillEditHandler";
	 	var currentPagePermItemId=that.currentPagePermItemId;
	 	that.remoteCall({
		type:"post",
		async: false,
		url: url,
		method:"getCurrentPagePermItemId",
		param:{currentPagePermItemId:currentPagePermItemId},
		success:function(res){
		if(res.serviceId){
			serviceId=res.serviceId;
		}
		}
		});
	 	this.reloadPage({
	 		serviceId:serviceId,
			uipk: 'com.kingdee.eas.hr.ats.app.AtsTripBillList'
		});
	}
	//给专员用的取消
	,cancelAllAction:function(){
		/*var that = this ;
	 	window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsTripBillAllList";*/
	 	this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsTripBillAllList'
		});
	}
	
	,calTripCrossTimeZone:function(changeEle,flag){
		var tripStartTime = $("#entries_tripStartTime").shrDateTimePicker("getValue");
		var tripEndTime = $("#entries_tripEndTime").shrDateTimePicker("getValue");
		var person = $("#entries_person").shrPromptBox("getValue");
		if(!person || !tripStartTime || !tripEndTime){
			return
		}
	 	var longTime = new Date(tripEndTime).getTime();
	 	longTime -= new Date(tripStartTime).getTime();
	 	if (longTime <= 0 && flag) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsTripBillEdit_i18n_0});
			return false;
	 	}
		var data = _self.prepareParam();
		var model = _self.assembleModel();
		model.entries && delete model.entries.position;
		model.entries && delete model.entries.adminOrgUnit;
		data.model = shr.toJSON(model);
		data.handler = "com.kingdee.shr.ats.web.handler.AtsTripBillCommonHandler";
		data.method = "calTripCrossTimeZone";
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(crossTimezoneDate) {
				console.info(crossTimezoneDate);
				if(crossTimezoneDate){
					for(var field in crossTimezoneDate){
						atsMlUtile.setTransDateTimeValue("entries_tripEndTime","");
						shr.showError({message:
						jsBizMultLan.atsManager_atsTrip_crossTimezoneTip
						+ crossTimezoneDate[field],hideAfter:5});
					}
				}
			}
		});
	}
	
	//处理出差天数,出差结束时间-出差开始时间+1 = 出差天数
	,processTripDays : function(){
		var that = this ;
		//加班开始时间选择完后 计算申请加班小时数
		$("#entries_tripStartTime").change(function(){
			that.tripStartTimeChange();
		});
		//加班结束时间选择完后 计算申请加班小时数
		$("#entries_tripEndTime").change(function(){
			that.tripEndTimeChange();
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
		var that = this ;
		that.showIsElasticCalCtrl();
		//that.setAllDayToNot();
		that.calculataTripDays();
		if(shr.getUrlRequestParam('method') == ""){
			that.changeTripHrOrgUnit();
		}
		that.calTripCrossTimeZone(this,false);
		var personInfo = $("#entries_person").shrPromptBox("getValue") || {};
		var tripStartTime = $("#entries_tripStartTime").shrDateTimePicker("getValue");
		personInfo.id && tripStartTime && HRTimeZoneService.getHRTimeZone(personInfo.id,"#entries_timeZone",tripStartTime);
	},

	tripEndTimeChange:function(){
		var that = this ;
		//that.setAllDayToNot();
		that.calculataTripDays();
		that.calTripCrossTimeZone(this,true);
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
		var that = this;
		if(begin_Time != null && begin_Time != ''){
			$("#entries_startTimeDate").shrDateTimePicker('setValue', begin_Time.split(" ")[0]);
			$("#entries_startTimeHMS").shrDateTimePicker('setValue', begin_Time);
			//that.setDateDetial($("#entries_startTimeDate"),begin_Time);
			//that.setHMSDetial($("#entries_startTimeHMS"),begin_Time);
		}
		if(end_Time != null && end_Time != ''){
			$("#entries_endTimeDate").shrDateTimePicker('setValue', end_Time.split(" ")[0]);
			$("#entries_endTimeHMS").shrDateTimePicker('setValue', end_Time);
			//that.setDateDetial($("#entries_endTimeDate"),end_Time);
			//that.setHMSDetial($("#entries_endTimeHMS"),end_Time);
		}
	},

	setHMSDetial:function(element,datetime){
		if(datetime != null && datetime != ''){
			element.text(datetime.split(" ")[1]);
			element.attr("original-value",datetime.split(" ")[1]);
			element.attr("value",datetime.split(" ")[1]);
			element.attr("title",datetime.split(" ")[1]);
		}
	},

	setDateDetial:function(element,datetime){
		if(datetime != null && datetime != ''){
			element.text(datetime.split(" ")[0]);
			element.attr("original-value",datetime.split(" ")[0]);
			element.attr("value",datetime.split(" ")[0]);
			element.attr("title",datetime.split(" ")[0]);
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
		}else if (that.getOperateState() == "EDIT") {
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



	changeTripHrOrgUnit : function(){
		var that = this;
		var tripStartTime = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
		if ( tripStartTime!=""&&tripStartTime!=null ) {
		tripStartTime = tripStartTime.replace("\\-","/");
		var personId = $("#entries_person_el").val();
		that.remoteCall({
			type:"post",
			async: false,
			method:"getHrOrgUnit",
			param:{personId:personId,beginTime:tripStartTime},
			success:function(res){
				info =  res;
				if(res.hrOrgUnitname && res.hrOrgUnitId){
				$("#hrOrgUnit").val(res.hrOrgUnitname);
				$("#hrOrgUnit_el").val(res.hrOrgUnitId);
				$("#entries_adminOrgUnit").val(res.adminOrgUnitName);
				$("#entries_adminOrgUnit_el").val(res.adminOrgUnitId);
				$("#entries_position").val(res.attPositionName);
				$("#entries_position_el").val(res.attPositionId);
				}
				
			}
		});
		}
	},
	calculataTripDays : function(){ 
		var that = this;
		var tripStartTime = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
		var tripEndTime = atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
		
		if ( tripStartTime!=""&&tripStartTime!=null && tripEndTime!=""&&tripEndTime!=null ) {
			//tripStartTime = tripStartTime.substr(0,tripStartTime.indexOf(" "));
			//tripEndTime   = tripEndTime.substr(0,tripEndTime.indexOf(" "));
			tripStartTime = tripStartTime.replace("\\-","/");
		 	tripEndTime = 	tripEndTime.replace("\\-","/");
		 	var tripStartTimeOfDate = new Date(tripStartTime);
		 	var tripEndTimeOfDate = new Date(tripEndTime);
		 	var longTime = tripEndTimeOfDate.getTime() - tripStartTimeOfDate.getTime();
		 	var dayTime = 24 * 60 * 60 * 1000.0;
		 	//计算出除去非工作日的出差时间
		 	
		 	var personId = $("#entries_person_el").val();
			var isAllDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
		 	that.remoteCall({
			type:"post",
			async: false,
			method:"getRealLeaveLengthInfo",
			param:{personId:personId,
				beginTime:tripStartTime,
				endTime:tripEndTime,
				isAllDay:isAllDay,
				isElasticCalLen:$("#entries_isElasticCalLen").shrCheckbox("isSelected")},
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
		if (that.getOperateState() != 'VIEW') {
			$("#entries_person").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					if(info != null){
						if(info.hasOwnProperty("id") && info.id != ""){
//							$('#hrOrgUnit').shrPromptBox("setValueNoTrigger",{"id":info["hrOrgUnit.id"], "name":info["hrOrgUnit.name"]});
							$('#entries_adminOrgUnit').shrPromptBox("setValueNoTrigger",{"id":info["adminOrgUnit.id"], "name":info["adminOrgUnit.displayName"]}); 
							$('#entries_position').shrPromptBox("setValueNoTrigger",{"id":info["primaryPosition.id"], "name":info["position.name"]});
							$("#entries_person_number").val(info["person.number"]);//@
						}

						$("#entries_position_name").length > 0 && $("#entries_position_name").val(info["position.name"]);
					}
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
			$("#entries_person").change(function(){
				that.showIsElasticCalCtrl();
                that.initCcPersonPrompt();
                that.clearCCPersonIdsPrompt();
			});
		}
	},
    clearCCPersonIdsPrompt:function() {
        atsCcPersonUtils.clearCCPersonIdsPrompt(this);
    },
    initCcPersonPrompt :function() {
        atsCcPersonUtils.initCCPersonIdsPrompt(this);
		if (this.getOperateState() != 'VIEW') {
            var person = $('#entries_person').shrPromptBox("getValue");
            if (!person) {
               //  shr.showWarning({message:"Please select people."});
            } else {
                $('#ccPersonIds').shrPromptBox("setOtherParams", {
                    personId: person.id
                });
            }
		}
	},
	/**
	 * 初始化ActionFilter,过滤用工状态,把离职的去掉   
	 */
	/*initActionF7 : function () {
		var that = this;
		var fliter = " employeeType.number != 'S09' "; //001正式 002试用 003停薪留职  004离退休   s09 离职 
		$("#entries_person").shrPromptBox("setFilter",fliter);
	},*/
	
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
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsTripBillEdit_i18n_0});
			return false;
	 	}
		var tripDays = parseFloat(atsMlUtile.getFieldOriginalValue("entries_tripDays"));
		if(tripDays<=0){
			if($("#tripDaysValidate")){
				   $("#tripDaysValidate").remove();
				}
				$('<label for="entries_tripDays" generated="true" class="error" style="display: block;" id="tripDaysValidate">'
					+ jsBizMultLan.atsManager_atsTripBillEdit_i18n_3
					+ '</label>').insertAfter($("#entries_tripDays").parent());
			return false;
		}
		//出差时间重复校验处理 这里先简单处理下 后续写个公共的方法一起调用 参考之前k3考勤集成的方法 包括时间交叉的情况
//		var info = that.getTripBillInfo();
//	    if (info.collSize > 0) {
//		  shr.showInfo({message: "出差时间重复,不能重复提交出差单。"});
//		  return false;
//		}
		var info ;
		var personId = $("#entries_person_el").val();
		if(that.getOperateState() =='VIEW'){
			personId = $("#entries_person").attr('value');
		}
		var begin_Time = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
		var end_Time 	= atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
		var billId =  $("#id").val();
		var billState = $("#billState").val();
		var allDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
		if(billState && billState != 0){
			that.remoteCall({
				type:"post",
				async: false,
				method:"getTripBillInfoByPersonIdAndTripTime",
				param:{personId:personId,begin_Time:begin_Time,end_Time:end_Time,billId:billId,allDay:allDay},
				success:function(res){
					info =  res;
				}
			});
			if(info && info.addFlag > 0) {
			  shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsTripBillEdit_i18n_23
				  ,[info.billNo,"<br/>",info.personName,info.tripBeginDate,info.tripEndDate])});
			  return false;
			}
		}
		
		var flag = true;
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
						shr.showError({
							message:res.errorString
						});
						//so weired！直接return false在portal报错信息一闪而过，然后竟提交上去了；
						//flag = false，再return flag就可以
						flag = false;
					}
			    }
			}); 
			
		}

		var isCross =  that.getCrossTripMsg();
		if(isCross){
			shr.showError({message: isCross});
			flag = false;
		}

		return flag;
	},
	
	/*getTripBillInfo:function(){
		var that = this;
		var personId = $("#entries_person_el").val();
		var realBeginTime = $("#entries_tripStartTime").val();
		if(realBeginTime.length<=16){
			realBeginTime=realBeginTime+":00"
		}
		var realEndTime = $("#entries_tripEndTime").val();
		if(realEndTime.length<=16){
			realEndTime=realEndTime+":00"
		}
		var billId =  $("#id").val(); //新增和编辑界面都需要判断
		var info ;
		that.remoteCall({
			type:"post",
			async: false,
			method:"getCancelTripBillInfoByPersonIdAndTripTime",
			param:{personId:personId,beginTime:realBeginTime,endTime:realEndTime,billId:billId},
			success:function(res){
				info = res;
			}
		});
		return info;
	},*/
	
	/**
	 * 设置编辑按钮是否隐藏 这几个单据的跟 转正 调动  离职的 保持一致 以便后续方便统一修改
	 * 比较详细的状态说明 参见 加班单的 setButtonVisible() 方法
	 */
	setButtonVisible : function(){
		var that = this;
		
		//隐藏出差列表按钮
		if (that.getOperateState() == 'EDIT') {			
			if(that.isFromWF()){ // 来自流程中心
				$('#cancel').hide();
			}
		}
		
		//隐藏提交生效按钮
		if (that.getOperateState() == 'VIEW') {			
			$("#submitEffect").hide();
		}
		
		var billState = $("#billState").val();
		if (billState) {
			if (billState==3 || jsBizMultLan.atsManager_atsTripBillEdit_i18n_14==billState
				|| billState ==4||jsBizMultLan.atsManager_atsTripBillEdit_i18n_13==billState
				|| billState ==2||jsBizMultLan.atsManager_atsTripBillEdit_i18n_15==billState ) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1==billState || jsBizMultLan.atsManager_atsTripBillEdit_i18n_21== billState
				|| 2 == billState || jsBizMultLan.atsManager_atsTripBillEdit_i18n_15==billState ) { //未审批或审批中
				if(!this.isFromWF()){
					$("#edit").hide();
					$("#submit").hide();
					$("#submitEffect").hide();
				}
			}
		}
		if (this.getOperateState().toUpperCase() == 'VIEW') { //查看状态下不允许提交
			//不允许提交生效
			$("#submitEffect").hide();
			if(billState == 0)
			{
		        $("#submit").show();
		    }else {
		    	$("#submit").hide();
		    }
			if(this.isFromWF()){ // 来自任务中心
				$('#cancelAll').hide();
				$("#submit").text(jsBizMultLan.atsManager_atsTripBillEdit_i18n_20);
				$('#edit').hide();
			}
		}
		
		//新增和编辑状态隐藏返回XX列表
		if (this.getOperateState().toUpperCase() == 'ADDNEW' || this.getOperateState().toUpperCase() == 'EDIT' ) {
			$("#returnToTripBillList").hide();
		}
		//如果是工作流打回,界面上的"返回XX列表"不显示
		if (this.isFromWF()) {
			$("#returnToTripBillList").hide(); 
			$("#cancel").hide(); 
		}
		/*
		if(billState){
			if(!this.isFromWF()){
				if("审批通过" == billState || "审批中" == billState || "未审批" == billState ){
					$("#edit").hide();
					$("#submit").hide(); 
					$("#submitEffect").hide();
				}
			}
		}*/
	}
	
	,returnToTripBillListAction:function(){
	   this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsTripBillList'
		});
	},
	initTripDaysValidate: function(){
	    $("#entries_tripDays").blur(function(){
	        var tripDays = parseFloat(atsMlUtile.getFieldOriginalValue("entries_tripDays"));
			if(tripDays<=0){
				if($("#tripDaysValidate")){
				   $("#tripDaysValidate").remove();
				}
				$('<label for="entries_tripDays" generated="true" class="error" style="display: block;" id="tripDaysValidate">'
					+ jsBizMultLan.atsManager_atsTripBillEdit_i18n_3
					+ '</label>').insertAfter($("#entries_tripDays").parent());
			}
	    });
	},
	/**
	 * 设置导航条
	 */
	setNavigateLine: function(){
	    var fromFlag = localStorage.getItem("fromFlag");
		var empolyeeBoardFlag =	sessionStorage.getItem("empolyeeBoardFlag");
		var parentUipk = "";
		if(parent.window.shr==null){
     		parentUipk = shr.getCurrentViewPage().uipk;
     	}else{
     		parentUipk = parent.window.shr.getCurrentViewPage().uipk;
     	}
		var punchCardFlag = sessionStorage.getItem("punchCardFlag");
		if(fromFlag == "employeeBoard" || fromFlag == "punchCard" 
		){//来自我的考勤或者我的打卡记录的时候。将导航条删除掉。
	        $("#breadcrumb").parent().parent().remove();
	        localStorage.removeItem("fromFlag");
	    }
		if(("fromPunchCard" == punchCardFlag 
		&& "com.kingdee.eas.hr.ats.app.WorkCalendarItem.listSelf" == parentUipk) 
		|| ("empolyeeBoardFlag" == empolyeeBoardFlag && "com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop" == parentUipk)){//来自打卡记录弹出框的时候
	        $("#breadcrumb").remove();
	        window.parent.changeDialogTitle(jsBizMultLan.atsManager_atsTripBillEdit_i18n_22);
	    }
		
		var paramMethod = shr.getUrlRequestParam("method");
     	//从我要出差菜单中点击进来的URL上没有method参数
     	if(paramMethod == null){
     	    $("#breadcrumb").find(".active").text(jsBizMultLan.atsManager_atsTripBillEdit_i18n_22);
     	}
	}
	
	,goNextPage: function(source) {
		// 普通提交，返回上一页面
		if ($("#bill_flag").val() == "employeeself"){
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillList"
			});
		}else{
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillAllList"
			});
		}
	}
	,beforeSubmit :function(){
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		if (($form.valid() && _self.verify())) {
			if(_self.isFromWF()){
				return true;//流程界面不做billcheck提示
			}
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_tripStartTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_tripEndTime").split(" ")[0];
			var personId = $("#entries_person_el").val();	
			var billType = "trip";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: false,//同步
				success:function(res){
					var result = res.result;
					if(result==""){
						return true;
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_atsTripBillEdit_i18n_19, function(){
							return true;
						});
					}
				}
			});
		}
		// return false 也能保存，固让js报错，后续让eas修改 return false 逻辑
//		var len = workArea.length() ;
		return false ;
	}
	
	,getCurrentModel : function(){
		
		var that = this ;
		var model = shr.ats.AtsTripBillEdit.superClass.getCurrentModel.call(this);
		var tripStartTime = model.entries[0].tripStartTime ;
		var tripEndTime = model.entries[0].tripEndTime;
		var realTripStartTime = model.entries[0].realTripStartTime;
		var realTripEndTime = model.entries[0].realTripEndTime;
		
		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(tripStartTime)))
		{
		  model.entries[0].tripStartTime = tripStartTime+":00";
		}
		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(tripEndTime)))
		{
		  model.entries[0].tripEndTime = tripEndTime+":00";
		}

		if(realTripStartTime && !(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(realTripStartTime))){
			 model.entries[0].realTripStartTime = realTripStartTime+":00";
		}
		
		if(realTripEndTime && !(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(realTripEndTime))){
			 model.entries[0].realTripEndTime = realTripEndTime+":00";
		}
		
		if(!model.entries[0].realTripStartTime){
			model.entries[0].realTripStartTime = model.entries[0].tripStartTime;
		}
		
		if(!model.entries[0].realTripEndTime){
			model.entries[0].realTripEndTime = model.entries[0].tripEndTime;
		}
		
		if(!model.entries[0].realTripDays){
			model.entries[0].realTripDays = model.entries[0].tripDays;
		}
		model.ccPersonIds = model.ccPersonIds && model.ccPersonIds.id || "";
        model.ccPerson = model.ccPersonIds;
		return model ;
	}
	//获取出差单下边的出差确认单信息
	,getCancelLeaveBillInfo:function(){
		var that = this;
		var billId = $('form').find('input[id^=id]').val(); // 为了在专员看板能访问id 
		that.remoteCall({
			type:"post",
			method:"getCanTripBillInfoById",
			param:{billId:billId},
			success:function(res){
				that.showCanTripBillInfo(res);
			}
		});
	}	
	//展示出差确认单的信息
	,showCanTripBillInfo:function(res){
		if (res.canTripBillCollSize > 0) {
			$("#canTripBillInfoDes").show();	
		}
		var infoColl = JSON.parse(res.canTripBillColl);
		var size = res.canTripBillCollSize;
		var html = '';
		for (var i = 0; i < size; i++) {
			html +='<h5 class="groupTitle">'
				+ jsBizMultLan.atsManager_atsTripBillEdit_i18n_1
				+ '</h5>';
			html += '<div class="row-fluid row-block " id="">';
			html += '<div data-ctrlrole="labelContainer">';
			html += '<div class="col-lg-4">';
			html += '<div class="field_label">'
				+ jsBizMultLan.atsManager_atsTripBillEdit_i18n_18
				+ '</div>';
			html += '</div>';				
			html += '<div class="col-lg-6 field-ctrl">';
			html += '<span class="field_input">'+ (infoColl[i].realStartTime) ? infoColl[i].realStartTime.substring(0,16) : '' + '</span>';
		
			html += '</div>';
			html += '<div class="col-lg-2 field-desc"></div>';
			html += '</div>';
	
			html += '<div data-ctrlrole="labelContainer">';
			html += '<div class="col-lg-4">';
			html += '<div class="field_label">'
				+ jsBizMultLan.atsManager_atsTripBillEdit_i18n_17
				+ '</div>';
			html += '</div>';				
			html += '<div class="col-lg-6 field-ctrl">';
			html += '<span class="field_input">'+ (infoColl[i].realEndTime) ? infoColl[i].realEndTime.substring(0,16) : '' +'</span>';
			html += '</div>';
			html += '<div class="col-lg-2 field-desc"></div>';
			html += '</div>';
	  		html += '</div>'; 
		
			html += '<div class="row-fluid row-block " id="">';
			html += '<div data-ctrlrole="labelContainer">';
			html += '<div class="col-lg-4">';
			html += '<div class="field_label">'
				+ jsBizMultLan.atsManager_atsTripBillEdit_i18n_16
				+ '</div>';
			html += '</div>';				
			html += '<div class="col-lg-6 field-ctrl">';
			html += '<span class="field_input">' + (infoColl[i].realTripDays) ? infoColl[i].realTripDays : 0 + '</span>';
	
			html += '</div>';
			html += '<div class="col-lg-2 field-desc"></div>';
			html += '</div>';
	
			html += '<div data-ctrlrole="labelContainer">';
			html += '<div class="col-lg-4">';
			html += '<div class="field_label">'
				+ jsBizMultLan.atsManager_atsTripBillEdit_i18n_2
				+ '</div>';
			html += '</div>';				
			html += '<div class="col-lg-6 field-ctrl">';
			html += '<span class="field_input">'+ infoColl[i].bill.applyDate ? infoColl[i].bill.applyDate.substring(0,10) : '' + '</span>';
			html += '</div>';
			html += '<div class="col-lg-2 field-desc"></div>';
			html += '</div>';
	  		html += '</div>'; 
		}
		$("#canTripBillInfoDes").html(html);
	},
	setRealValue : function(){
		var startTime = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
		var endTime = atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
		var tripDays = atsMlUtile.getFieldOriginalValue("entries_tripDays");
		atsMlUtile.setTransDateTimeValue("entries_realTripStartTime",startTime);
		atsMlUtile.setTransDateTimeValue("entries_realTripEndTime",endTime);
		atsMlUtile.setTransNumValue("entries_realTripDays",tripDays);
	}
	/**
	 * 保存
	 */
	,saveAction: function(event) {
		var _self = this;
		var workArea = _self.getWorkarea();
		$form = $('form', workArea);
		if ( _self.validate() && $form.valid() &&  _self.verify()) {	
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_tripStartTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_tripEndTime").split(" ")[0];
			var personId = $("#entries_person_el").val();	
			var billType = "trip";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: true,
				success:function(res){
					var result = res.result;
					if(result==""){
						_self.doSave(event, 'save');
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_atsTripBillEdit_i18n_19,function(){
						  _self.doSave(event, 'save');
						});
					}
				}
			});
		}else{
			if(_self != top){// in iframe
				shr.setIframeHeight(window.name);
			} 
		}	
	}
	,submitAction: function(event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		var flag = false ;
		
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.AtsTripBillForm") {
			var personId = $('#entries_person_id').val();
			var proposerId = $('#proposer_id').val();
			if(undefined != personId && undefined != proposerId && personId != "" && proposerId != "" && personId != proposerId){
				shr.showError({message: jsBizMultLan.atsManager_atsTripBillEdit_i18n_24, hiddenAfter: 5});
				return;
			}
		}
		
		if ( _self.validate() && $form.valid() &&  _self.verify()) {	
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_tripStartTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_tripEndTime").split(" ")[0];
			var personId = $("#entries_person_el").val();	
			if(personId==null){
				personId =$("#entries_person").val();
			}
			var billType = "trip";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: false,
				success:function(res){
					var result = res.result;
					if(result==""){
						shr.showConfirm(jsBizMultLan.atsManager_atsTripBillEdit_i18n_10, function() {
						_self.doSubmit(event, 'submit');
						});	
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_atsTripBillEdit_i18n_19,function(){
							shr.showConfirm(jsBizMultLan.atsManager_atsTripBillEdit_i18n_10, function() {
									_self.doSubmit(event, 'submit');
							});	
						});
					}
				}
			});
		}		
		
	}
	,isHaveEffectiveFile : function() {
		var _self = this;
		_self.remoteCall({
			type:"post",
			method:"isHaveEffectiveFile",
			param:{
				personid:"",
				uipk:"com.kingdee.eas.hr.ats.app.AtsTripBillForm"
			},
			async: false,
			success:function(res){
				var info =  res;
				if (!info.isHaveFile){
					shr.showWarning({message:jsBizMultLan.atsManager_atsTripBillEdit_i18n_6});
				}	
			}
		});
	}
	,initElasticCalCtrl:function(){
		var that = this;
     	//弹性段是否算时长
	    if( that.getOperateState() == 'VIEW'|| that.getOperateState() == 'EDIT'){
	    	 that.showIsElasticCalCtrl();
	    }else{
	    	$("#entries_isElasticCalLen").parent().parent().parent().hide();
	    }
	    if( that.getOperateState() != 'VIEW'){
		    $("#entries_isElasticCalLen").change(function(){//弹性段算时长change事件 
				that.calculataTripDays();
		    });
	    }
	}
	,showIsElasticCalCtrl:function(){
		var that = this ;
		
    	var personId = $("#entries_person_el").val()==""||$("#entries_person_el").val()==undefined?$("#entries_person").val():$("#entries_person_el").val();
    	var beginTime = atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
    	var endTime = atsMlUtile.getFieldOriginalValue("entries_tripEndTime");
    	shr.atsBillUtil.showIsElasticCalCtrl(that,personId,"",beginTime,endTime);
	    
	}
	 ,addSocQueryTips:function(){
		var that = this;
		shr.atsBillUtil.addSocQueryTipA("tipsIsElasticCal");
	}
	,showTips:function(){
		//此处选择器中用中文括号，页面上是中文
		$("[title='"+jsBizMultLan.atsManager_atsTripBillEdit_i18n_5 +"']")
      .append('<span id="tipsIsElasticCal"></span>');
		var tipsIsElasticCalText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_atsTripBillEdit_i18n_9 + "<br/>";
		var tipsIsElasticCalLog = '<div id="tipsIsElasticCal-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;height:100px;position:absolute;left:15%;z-index:1;margin-top:0px;background: aliceblue;"><div style="position:absolute"><font color="gray">'+tipsIsElasticCalText+'</font></div></div>';
		//此处选择器中用中文括号，页面上是中文
		$("[title='"+jsBizMultLan.atsManager_atsTripBillEdit_i18n_5+"']").after(tipsIsElasticCalLog);
	},initStartAndEnd : function(){
		var that = this ;
		var startTime=shr.getUrlRequestParam("startAndEnd");
		if(!startTime){
		return;	
		}
		var personId = "";
		if($('#entries_person_el').val()!=null&&$('#entries_person_el').val()!=""){
		 personId = $('#entries_person_el').val();
		}else{
		 personId = $('#entries_person').val();
		}
		var hrOrgUnitId =  $("#hrOrgUnit_el").val();
		if(hrOrgUnitId==null || hrOrgUnitId==""){
			hrOrgUnitId=$("#hrOrgUnit").val();
			if(hrOrgUnitId==null || hrOrgUnitId==""){
				return;	
			}	
		}
		if(personId == ""){
			return;
		}
		that.remoteCall({
			type:"post",
			async: true,
			method:"getStartAndEnd",
			param:{personId:personId,hrOrgUnitId:hrOrgUnitId,startTime:startTime},
			success:function(res){
				var info = res;
				if(info == null){
					return ;
				}
				atsMlUtile.setTransDateTimeValue("entries_tripStartTime",res.beginDate);
				atsMlUtile.setTransDateTimeValue("entries_tripEndTime",res.endDate);
				
				var personInfo = $("#entries_person").shrPromptBox("getValue") || {};
				personInfo.id && res.beginDate && HRTimeZoneService.getHRTimeZone(personInfo.id,"#entries_timeZone",res.beginDate);
				that.calculataTripDays();
			}
		});
	},
	getEndTime : function(){
		var that=this;
		var leavelength=atsMlUtile.getFieldOriginalValue("entries_tripDays");
		var startTime=atsMlUtile.getFieldOriginalValue("entries_tripStartTime");
		var holidayTypeId="";
		var personId=$("#entries_person_el").val();
		if(!personId || !startTime  || !leavelength){
			return;
		}
		that.remoteCall({
			type:"post",
			async: false,
			method:"getTripEndTime",
			param:{leavelength:leavelength,startTime:startTime,personId:personId,holidayTypeId:holidayTypeId},
			success:function(res){
				info =  res;
				//$("#entries_tripEndTime").val(res.atsLeaveEndTime.substring(0,16));
				atsMlUtile.setTransDateTimeValue("entries_tripEndTime",res.atsLeaveEndTime.substring(0,16));
			}
		});
	}
	
});
