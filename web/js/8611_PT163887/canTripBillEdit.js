var _personId;
var tripBillId=shr.getUrlRequestParam("tripBillId");
var isFromPage=shr.getUrlRequestParam("isFromPage");
var _blurEndDate = '';
var _blurEndHMS = '';
var _blurStartDate = '';
var _blurStartHMS = '';
shr.defineClass("shr.ats.CanTripBillEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.CanTripBillEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		that.processTripBillF7ChangeEvent();
		that.initElasticCalCtrl();
		that.showTripBillInfoView();//查看界面显示出差单信息
		that.setButtonVisible(); //初始化页面安装状态,如果是已经提交的或者审批通过的单据编辑按钮不显示
		if(that.getOperateState() == 'EDIT'){
			if(that.isFromWF()){ // 来自任务中心
				$('#cancel').hide();
				$("#entries_tripEntryBill").shrPromptBox("disable");
			}
		}
		
		//计算请假确认 时间长度,查看,修改界面不计算
		if (that.getOperateState() != 'VIEW') {
			that.calculateCanTripLength();
		}
//		//隐藏提交生效按钮
//		if (that.getOperateState() == 'VIEW') {			
//			$("#submitEffect").hide();
//			if(that.isFromWF()){ // 来自任务中心
//				$('#workFlowDiagram').show();
//				$('#auditResult').show();
//
//			}
//		}
		
		that.setNumberFieldEnable();
		if(shr.getUrlRequestParam("uipk") == "com.kingdee.eas.hr.ats.app.CanTripBillForm" && that.getOperateState() != 'VIEW'){
			$("#entries_tripEntryBill").shrPromptBox().attr("data-params","isPerson:true," + $("#proposer_el").val());
		}
		if(isFromPage == "Trip"){
			$("#breadcrumb li:eq(2)").html(jsBizMultLan.atsManager_canTripBillEdit_i18n_6);
			$("#cancel").text(jsBizMultLan.atsManager_canTripBillEdit_i18n_2);
			if(tripBillId){
			   that.initDefaultTripBill();
			}
		}else{
			$("#cancel").text(jsBizMultLan.atsManager_canTripBillEdit_i18n_10);
		}
		
		if(that.getOperateState() == "VIEW"){//不显示秒
			if(atsMlUtile.getFieldOriginalValue("entries_realStartTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_realStartTime",atsMlUtile.getFieldOriginalValue("entries_realStartTime").substring(0,16));
			}
			if(atsMlUtile.getFieldOriginalValue("entries_realEndTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_realEndTime",atsMlUtile.getFieldOriginalValue("entries_realEndTime").substring(0,16));
			}
		}
		
		if(that.isFromWF()){
			$("#addInstanceToDeskItem").css('display','none');
		}
		that.processF7ChangeEventHrOrgUnit();
		
		that.showTips();
		that.addSocQueryTips();
		that.allDayOnChange();
		that.initByIsAllDay();
		that.initCcPersonPrompt();
	},
    clearCCPersonIdsPrompt :function() {
        if ($('#ccPersonIds').length == 0) {
            return;
        }
        atsCcPersonUtils.clearCCPersonIdsPrompt(this);
    },
    initCcPersonPrompt :function() {
        if ($('#ccPersonIds').length == 0) {
            return;
        }
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
    }

	/**
	 * 设置编码字段是否可编辑
	 */
	,setNumberFieldEnable : function() {
		var that = this ;
		var operateState = that.getOperateState().toUpperCase();
		if (operateState == 'EDIT' ||　operateState == 'ADDNEW') {
			var canTripBillNumberFieldCanEdit = that.initData.canTripBillNumberFieldCanEdit;
			if (typeof canTripBillNumberFieldCanEdit != 'undefined' && !canTripBillNumberFieldCanEdit) {
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
	},processF7ChangeEventHrOrgUnit : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					
					that.initCurrentHrOrgUnit(info.id);
				}
			});
		}
	}
	,calTripCrossTimeZone:function(){
		var tripStartTime = $("#entries_realStartTime").shrDateTimePicker("getValue");
		var tripEndTime = $("#entries_realEndTime").shrDateTimePicker("getValue");
		var person = $("#tripPersonId").text();
		if(!person || !tripStartTime || !tripEndTime){
			
			return
		}
	 	var longTime = new Date(tripEndTime).getTime();
	 	longTime -= new Date(tripStartTime).getTime();
	 	if (longTime < 0) {
	 		shr.showWarning({message: jsBizMultLan.atsManager_canTripBillEdit_i18n_9});
	 	}
	 	if (longTime <= 0) {
			return false;
	 	}
		var data = _self.prepareParam();
		data.uipk= "com.kingdee.eas.hr.ats.app.AtsTripBillAllForm";//使后台拿到的是出差单的模型
		var model = {"_entityName":"com.kingdee.eas.hr.ats.app.AtsTripBill"};
		model.entries=[{
			"person":{id:person.id || person},
			"tripStartTime":tripStartTime,
			"tripEndTime":tripEndTime
		
		}];
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
						atsMlUtile.setTransDateTimeValue("entries_realEndTime","");
						shr.showError({message:
						jsBizMultLan.atsManager_atsTrip_crossTimezoneTip
						+ crossTimezoneDate[field],hideAfter:5});
					}
				}
			}
		});
	}
	 ,initCurrentHrOrgUnit: function(hrOrgUnitId) {
		var that = this;
		$("#entries_tripEntryBill").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
	},initQuerySolutionHrOrgUnit: function(hrOrgUnitId) {
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
	 //提交即生效
	,submitEffectAction : function (event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		
		if (_self.validate() && _self.verify()) {
			if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
				shr.showConfirm(jsBizMultLan.atsManager_canTripBillEdit_i18n_16, function() {
					_self.prepareSubmitEffect(event, 'submitEffect');
				});
			}else{
				shr.showConfirm(jsBizMultLan.atsManager_canTripBillEdit_i18n_19, function() {
					_self.prepareSubmitEffect(event, 'submitEffect');
				});
			}	
		}	
	}
	/**
	 * 保存
	 */
	,saveAction: function(event) {
		var _self = this;
		
		if (_self.validate() && _self.verify()) {	
			_self.doSave(event, 'save');
		}	
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
	},
	assembleSaveData:function(action)
	{
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		data.method = action;
		data.operateState = _self.getOperateState();
		var model=_self.assembleModel();
		model.applyDate = atsMlUtile.getFieldOriginalValue("applyDate");
		if(_self.getOperateState() =='VIEW')
		{   
			model.entries={};
		}
		
		
		//获取行政组织
		var personDateStr = '';
		var personId = model.entries.person;
		var date = model.entries.realStartTime;
		if(date && personId){
			personDateStr += personId +"_"+date.substring(0,10);
			
		}
		if(personDateStr){
			_self.remoteCall({
				type:"post",
				method:"getPersonAdminOrgUnit",
				handler:"com.kingdee.shr.ats.web.handler.AtsBillBaseEditHandler",
				param:{ personDateStr:personDateStr},
				async: false,
				success:function(res){
					var info =  res;
					var person_date = personId +"_"+date.substring(0,10);
					var personAtsInfo = res[person_date];
					if(personAtsInfo && personAtsInfo.adminOrgUnit){
						model.entries["adminOrgUnit"]= personAtsInfo.adminOrgUnit;
						model.entries["position"]= personAtsInfo.position;
					}
				}
			});
		}
		//获取行政组织

        model.ccPerson = model.ccPersonIds;
		data.model = shr.toJSON(model); 
		// relatedFieldId
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		
		return data;
	}
	
	/**
	 * 员工自助取消按钮
	 */
	,cancelAction:function(){
	 	if(isFromPage == "Trip"){//来自出差单的出差确认
		 this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsTripBillList'
		 });
		}else{
	 	 this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.CanTripBillList'
		 });
		}
	}
	//专员取消按钮
	,cancelAllAction:function(){
	 	if(isFromPage == "Trip"){
			this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsTripBillAllList'
		});
		}else{
	 	  this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.CanTripBillAllList'
		  });
		}
	}
	
	//根据时间填写的 实际请假开始时间 和 实际请假结束时间 计算请假确认的时间长度
	,calculateCanTripLength:function(){
		var that = this ;
		$("#entries_realStartTime").change(function(){
			that.timeChange();
		});
		$("#entries_realEndTime").change(function(){
			that.timeChange();
		});

		if(that.getOperateState() != 'VIEW'){
			/*$("#entries_startTimeDate").shrDateTimePicker('option',{onChange : function(){
					that.startChange();
				}});
			$("#entries_startTimeHMS").shrDateTimePicker('option',{onChange : function(){
					that.startChange();
				}});*/

			$("#entries_startTimeDate").blur(function(){
				that.startChange();
			});
			$("#entries_startTimeDate").focus(function(){
				that.saveNowStartDate();
			});

			$("#entries_startTimeHMS").blur(function(){
				that.startChange();
			});
			$("#entries_startTimeHMS").focus(function(){
				that.saveNowStartDate();
			});



			$("#entries_endTimeDate").blur(function(){
				that.endChange();
			});
			$("#entries_endTimeDate").focus(function(){
				that.saveNowEndDate();
			});

			$("#entries_endTimeHMS").blur(function(){
				that.endChange();
			});
			$("#entries_endTimeHMS").focus(function(){
				that.saveNowEndDate();
			});
			/*$("#entries_endTimeHMS").shrDateTimePicker('option',{onChange : function(){
				that.endChange();
			}});*/
		}
	}


	,saveNowEndDate:function(){
		var endTimeDate = atsMlUtile.getFieldOriginalValue("entries_endTimeDate");
		_blurEndDate = endTimeDate;
	}
	,saveNowEndHMS:function(){
		var endTimeDate = atsMlUtile.getFieldOriginalValue("entries_endTimeHMS");
		_blurEndHMS = endTimeDate;
	}
	,saveNowStartDate:function(){
		var endTimeDate = atsMlUtile.getFieldOriginalValue("entries_startTimeDate");
		_blurStartDate = endTimeDate;
	}
	,saveNowStartHMS:function(){
		var endTimeDate = atsMlUtile.getFieldOriginalValue("entries_startTimeHMS");
		_blurStartHMS = endTimeDate;
	}

	,timeChange:function(){
		var that = this ;
		//that.setAllDayToNot();
		that.getRealTripLength();
		that.calTripCrossTimeZone();
	}

	//当开始出差时间日期或者是开始出差时间点发生变化的时候触发的操作
	,startChange : function(){
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
			if(_blurStartDate == startTimeDate){
				return;
			}
			var end_Time = atsMlUtile.getFieldOriginalValue("entries_realEndTime");
			var personId = atsMlUtile.getFieldOriginalValue("entries_person");
			that.remoteTripTimeByAllDay(personId,startTime ,end_Time);
		}else {
			$("#entries_realStartTime").shrDateTimePicker('setValue', startTime);
			$("#entries_startTimeHMS").shrDateTimePicker('setValue', startTime);
		}
        that.timeChange();
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
			var begin_Time = atsMlUtile.getFieldOriginalValue("entries_realStartTime");
			var personId = atsMlUtile.getFieldOriginalValue("entries_person");
			that.remoteTripTimeByAllDay(personId,begin_Time ,endTime);
		}else {
			$("#entries_realEndTime").shrDateTimePicker('setValue', endTime);
			$("#entries_endTimeHMS").shrDateTimePicker('setValue', endTime);
		}
        that.timeChange();
	},
	//获得今天的日期 yyyy-mm-dd
	getToday : function(){
		var date = new Date();
		var today = "" + date.getFullYear() + "-";
		today += (date.getMonth()+1) + "-";
		today += date.getDate() ;
		return today;
	}

	,setAllDayToNot:function(){
		$("#entries_isAllDay").shrCheckbox("unCheck");
	}


	,allDayOnChange:function(){
		var that = this;
		if(that.getOperateState() == 'VIEW'){
			return;
		}
		$('#entries_isAllDay').shrCheckbox('onChange', function () {
			var allDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
			if(allDay){
				var personId = atsMlUtile.getFieldOriginalValue("entries_person");
				var begin_Time = atsMlUtile.getFieldOriginalValue("entries_realStartTime");
				var end_Time = atsMlUtile.getFieldOriginalValue("entries_realEndTime");
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
                handler: "com.kingdee.shr.ats.web.handler.AtsTripBillEditHandler",
			},
			async: false,
			success:function(res){
				var info =  res;
				$("#entries_realStartTime").shrDateTimePicker('setValue', info.beginTime);
				$("#entries_realEndTime").shrDateTimePicker('setValue', info.endTime);
				that.setDateAndHMS(info.beginTime,info.endTime);
			}
		});
		that.getRealTripLength();
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

		var begin_Time = atsMlUtile.getFieldOriginalValue("entries_realStartTime");
		var end_Time = atsMlUtile.getFieldOriginalValue("entries_realEndTime");
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
	}

	,getCrossTripMsg:function(){
		var allDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
		if(!allDay){
			var info = false;
			var personId = atsMlUtile.getFieldOriginalValue("entries_person");
			var begin_Time = atsMlUtile.getFieldOriginalValue("entries_realStartTime");
			var end_Time = atsMlUtile.getFieldOriginalValue("entries_realEndTime");
			_self.remoteCall({
				type:"post",
				method:"getCrossTripMsg",
				handler:"com.kingdee.shr.ats.web.handler.AtsTripBillEditHandler",
				param:{
					personId:personId,
					begin_Time:begin_Time,
					end_Time:end_Time,
					handler:"com.kingdee.shr.ats.web.handler.AtsTripBillEditHandler",
				},
				async: false,
				success:function(res){
					info =  res.crossTrip;
				}
			});
			return info;
		}
		return false;
	}


	/**
	 * 增加保存验证
	 * @return {Boolean}
	 */
	,verify:function(){
		var that = this;
		var workArea = that.getWorkarea();
		$form = $('form', workArea);
		if (!$form.valid()) {	
			return false;
		}
		
		var realbeginTime = atsMlUtile.getFieldOriginalValue("entries_realStartTime");
		var realendTime = atsMlUtile.getFieldOriginalValue("entries_realEndTime");
		var realTripDays = atsMlUtile.getFieldOriginalValue("entries_realTripDays");
	
		if(realTripDays<0){
			 shr.showError({message: jsBizMultLan.atsManager_canTripBillEdit_i18n_24});
			 return false;	
		}
		
		//出差确认开始时间不能大于请假确认 结束时间
		var regEx = new RegExp("\\-","gi");
		realbeginTime = realbeginTime.replace(regEx,"/");
	 	realendTime = 	realendTime.replace(regEx,"/");
	 	var beginTimeOfDate = new Date(realbeginTime); 
	 	var endTimeOfDate = new Date(realendTime);
		var longTime = endTimeOfDate.getTime() - beginTimeOfDate.getTime();
		if (longTime < 0) {
			shr.showWarning({message: jsBizMultLan.atsManager_canTripBillEdit_i18n_9});
			return false;
		}

		var isCross =  that.getCrossTripMsg();
		if(isCross){
			shr.showError({message: isCross});
			return  false;
		}

		var info = that.getCanTripBillInfo();
	   
		if(info.tripBillExist==true){
		  shr.showError({message: jsBizMultLan.atsManager_canTripBillEdit_i18n_11});
		  return false;	
		}else if (info.isOverRange == 1) {
		  shr.showError({message: info.isOverRangeMsg});
		  return false;	
		}else if (info.addFlag == 1) {
		  shr.showError({message: jsBizMultLan.atsManager_canTripBillEdit_i18n_7});
		  return false;	
		}else if(info.currentFix == 0){
			shr.showError({message: jsBizMultLan.atsManager_canTripBillEdit_i18n_8});
			return false;
		}else{
			return true;
		}




	}
	//新增界面选择出差单的时候触发的函数
	,processTripBillF7ChangeEvent : function(){
		var that = this;
		var operate = that.getOperateState();
		if (operate != 'VIEW') {
			$("#entries_tripEntryBill").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					if(info != null){
						if(info.hasOwnProperty("id")){
							var billId = info.id;
							atsMlUtile.setTransDateTimeValue("entries_realStartTime","");
							atsMlUtile.setTransDateTimeValue("entries_realEndTime","");
							atsMlUtile.setTransNumValue("entries_realTripDays","");
							$("#entries_tripEntryBill").val("");
							$("#viewTripBillInfo_table").html("");
							that.remoteCall({
									type:"post",
									async: false,
									method:"getTripBillInfoById",
									param:{billId:billId},
									success:function(res){
											that.setBillPerson(res);
											that.showTripBillInfo(res);

											that.setIsAllDay(res);
										    that.setRealStartAndEndTime(res);
									}
							});
						}
					}
				}
			});
			$("#entries_tripEntryBill").change(function(){
				that.showIsElasticCalCtrl();
			});
		}
	}
	,getCanTripBillInfo:function(){
		var that = this;
		var personId = $("#entries_person_el").val();
		var begin_Time = atsMlUtile.getFieldOriginalValue("entries_realStartTime");
		var end_Time = atsMlUtile.getFieldOriginalValue("entries_realEndTime");
	
		var realTripDays = atsMlUtile.getFieldOriginalValue("entries_realTripDays");
		var tripBillId = $("#entries_tripEntryBill_el").val();//请假单的ID
		if(that.getOperateState() == 'VIEW'){
			realTripDays = atsMlUtile.getFieldOriginalValue("entries_realTripDays");
			tripBillId = $("#entries_tripEntryBill").attr("value");//请假单的ID
			personId = $("#entries_person").val();
		}
		var billId =  $("#id").val(); //新增和编辑界面都需要判断
		var info ;
		that.remoteCall({
			type:"post",
			async: false,
			method:"getCanTripBillInfoByPersonIdAndTripBillTime",
			param:{personId:personId,begin_Time:begin_Time,end_Time:end_Time,billId:billId,realTripDays:realTripDays,tripBillId:tripBillId},
			success:function(res){
				info = res;
			}
		});
		return info;
	}
	
	,goNextPage: function(source) {
		if(isFromPage == "Trip"){//来自出差单页面的出差确认
				// 普通提交，返回上一页面
			if ($("#bill_flag").val() == "commissioner"){
				_self.reloadPage({
					uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillAllList"
				});
			}else{
				_self.reloadPage({
					uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillList"
				});
			}
		}else{
			// 普通提交，返回上一页面
			if ($("#bill_flag").val() == "commissioner"){
				_self.reloadPage({
					uipk: "com.kingdee.eas.hr.ats.app.CanTripBillAllList"
				});
			}else{
				_self.reloadPage({
					uipk: "com.kingdee.eas.hr.ats.app.CanTripBillList"
				});
			}
		}
	}
	//查看界面也要显示出差单信息
	,showTripBillInfoView : function(){
		var that = this;
		var operateState = that.getOperateState();
		if (operateState == 'VIEW' ||　operateState == 'EDIT') {
			var tripBillId = this.getFieldValue("entries_tripEntryBill");
			if(operateState == 'EDIT')
			{
				tripBillId=$("#entries_tripEntryBill_el").val();
			}
			var billId = tripBillId;
			if (billId != "") {
				that.remoteCall({
					type:"post",
					async: false,
					method:"getTripBillInfoById",
					param:{billId:billId},
					success:function(res){
						if(operateState != 'VIEW'){
							that.setBillPerson(res);
						}
						that.showTripBillInfo(res);
					}
				});
			}
		}
	}
	/**
	* 计算 设置出差确认单中，实际出差开始时间，实际出差结束时间之间的时长
	*/
	,getRealTripLength:function(){
	    var that = this;
		var personId = $("#entries_person_el").val();
		var startTime;
		var endTime;
		var startDate;
		var endDate;
		var tripBillId = $('#entries_tripEntryBill_el').val();
		var startTimeStr = atsMlUtile.getFieldOriginalValue("entries_realStartTime");
		var endTimeStr = atsMlUtile.getFieldOriginalValue("entries_realEndTime");
	   
		if(startTimeStr!="" && startTimeStr!=null && endTimeStr!="" && endTimeStr!=null){
			startTime = startTimeStr.replace("\\/","-");
		 	endTime = 	endTimeStr.replace("\\/","-");
		 	if(startTime.substring(0,16)>endTime.substring(0,16)){
				return;
			}
			var isAllDay = atsMlUtile.getFieldOriginalValue("entries_isAllDay");
		 	that.remoteCall({
			type:"post",
			async: false,
			method:"getRealLeaveLengthInfo",
			param:{
				    personId : personId,
					beginTime:startTime,
					endTime:endTime,
					tripBillId:tripBillId,
					isAllDay:isAllDay,
					isElasticCalLen:$("#entries_isElasticCalLen").shrCheckbox("isSelected")
			},
			success:function(res){
				info =  res;
				var day = parseFloat(info.leaveBillDays);
				day = day.toFixed(atsMlUtile.getSysDecimalPlace());
				atsMlUtile.setTransNumValue("entries_realTripDays",day);
			}
		});
		}
	}			
	,setBillPerson:function(res){
        this.clearCCPersonIdsPrompt();
		var personVal = {"id" : res.personId, "name" : res.person};
	 	$("#entries_person").shrPromptBox("setValue", personVal);
	 	this.initCcPersonPrompt();
		var adminOrgUnitVal = {"id" : res.adminOrgUnitId, "name" : res.adminOrgUnit};
		$("#entries_adminOrgUnit").shrPromptBox("setValue", adminOrgUnitVal);
	}
	,showTripBillInfo:function(res){
		var _self = this;
		if(res.isElasticCalLen){
			$("#entries_isElasticCalLen").shrCheckbox("check");			
		}else{
			if(shr.getUrlRequestParam("method") != 'view' && shr.getUrlRequestParam("method") != ""){
			$("#entries_isElasticCalLen").shrCheckbox("unCheck");	
			}
		}
		var html = '';
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_1,res.number);
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_27,res.person);
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_5,res.tripType);
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_13,res.tripReason);
		var startTime = atsMlUtile.dateTimeToUserFormat(res.startTime, "TimeStamp", false, true);
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_4, startTime);
		var endTime = atsMlUtile.dateTimeToUserFormat(res.endTime, "TimeStamp", false, true);
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_3,endTime);
		var tripDays = atsMlUtile.numberToUserFormat(res.tripDays);
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_12,tripDays);
		if(atsTimeZoneService.showTimeZone()) {
			html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_50,res.timeZone);
		}
		var applyDate = atsMlUtile.dateToUserFormat(res.applyDate);
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_20,applyDate);
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_14,res.tripStartPlace);
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_18,res.tripEndPlace);
		html += _self.createTripField(jsBizMultLan.atsManager_canTripBillEdit_i18n_0,res.remark);
		html += '<div id="tripPersonId" style="display:none">' + res.personId + '</div>';
		$("#viewTripBillInfo_table").html(_self.createRowField(html));
	}
		
	,createRowField:function(labelContainers_html){
		return '<div class="row-fluid row-block">'
			+ '    <div class="row-fluid row-block flex-r flex-rw " >'
			+ labelContainers_html
			+ '   </div>'
			+ '</div>';
	}
	
	,createTripField:function(labelName, labelValue){
		labelValue = labelValue || '';
		return '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1" style="">'
			+ '    <div class="label-ctrl flex-cc">'
			+ '        <div class="field-label" title="' + labelName + '">' + labelName + '</div>'
			+ '        <div class="field-desc"></div>'
			+ '    </div>'
			+ '    <div class="field-ctrl flex-c">'
			+ '        <span class="field_input" id="entries_person" title="' + labelValue + '" ctrlrole="shrFieldDisplay"'
			+ '        >' + labelValue + '</span>'
			+ '    </div>'
			+ '</div>';
	}
	
	/**
	 * HRBillStateEnum(与转正,调动,离职单据的一致) || BizStateEnum 这个是 EAS7.5版的请假单使用的审批状态值,后续不用这个了<br/>
	 * 后续的加班,出差,请假,补签卡都用HRBillStateEnum这个单据状态,以便可以统一修改<br/>
	 * view: <field name="billState"  label="单据状态" type="text"></field>	   <br/>
	 * 查看页面取值 var billState = $("#billState").html(); 
	 * view: <field name="billState"  label="单据状态" type="text"></field>	   <br/>
	 * 查看页面取值 var billState = $("#billState").val();
	 * 
	 * (HRBillStateEnum)		||  (BizStateEnum)
	 * 设置编辑按钮是否隐藏		||  对应EAS7.5 Version 审批状态字段值<br/>
	 * 0-save  	  未提交			||  -1  未提交					   	<br/>
	 * 1-submited 未审批			||   0  未审核					   	<br/>
	 * 2-auditing 审批中			||   1  审核中					   	<br/>
	 * 3-audited  审批通过		||   3  审核完成					   	<br/>
	 * 4-auditend 审批不通过		||   4  审核终止					   	<br/>
	 */
	,setButtonVisible:function(){
		var that = this;
		var billState = $("#billState").val();
		if (billState) {
			if (billState==3 || jsBizMultLan.atsManager_canTripBillEdit_i18n_22==billState || billState ==4
				||jsBizMultLan.atsManager_canTripBillEdit_i18n_21==billState || billState ==2
				||jsBizMultLan.atsManager_canTripBillEdit_i18n_23==billState ) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1==billState || jsBizMultLan.atsManager_canTripBillEdit_i18n_26== billState || 2 == billState
				|| jsBizMultLan.atsManager_canTripBillEdit_i18n_23==billState ) { //未审批或审批中
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
				$('#workFlowDiagram').show();
				$('#auditResult').show();
				$('#cancelAll').hide();
				$('#submit')
				.text(jsBizMultLan.atsManager_canTripBillEdit_i18n_25);
				$('#edit').hide();
			}
		}

		//新增和编辑状态隐藏返回XX列表
		if (this.getOperateState().toUpperCase() == 'ADDNEW' || this.getOperateState().toUpperCase() == 'EDIT' ) {
			$("#returnToCanTripBillList").hide();
		}
		
		//如果是工作流打回,界面上的"返回XX列表"不显示
		if (this.isFromWF()) {
			$("#returnToCanTripBillList").hide(); 
			$("#cancel").hide(); 
		}
	}
	
	,returnToCanTripBillListAction:function(){
	   this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.CanTripBillList'
		});
	},
	/**初始化下方的出差单列表**/
	initDefaultTripBill: function(){
		var that = this;
		that.remoteCall({
			type:"post",
			async: true,
			method:"getTripBillInfoById",
			param:{billId:tripBillId},
			success:function(res){
				var defalutValue = {'id':tripBillId, 'bill.number':res.number};
				$('#entries_tripEntryBill').shrPromptBox("setValue",defalutValue);
			}
		});
	}
	/*
	 *重写查看页面
	 */
	/*,viewAction: function(options) {
		var param;
		if ($.isPlainObject(options)) {
			param = options;
		} else {
			param = {method: 'view'};
		}
		// 兼容以前参数为billId的情况
		if (options) {
			param.billId = options;
		}
		var isShrBill = shr.getUrlParam("isShrBill");
		if(isShrBill != null && isShrBill == "true"){
			param.isShrBill = true;
		}
		if(isFromPage == "Trip"){//如果请假确认是从请假单列表中点击进入的话，要带上参数。
		   param.isFromPage = "Trip";
		}
		if(tripBillId){
			 param.tripBillId = tripBillId;
		}
		this.reloadPage(param);
	},*/
	/**重写编辑，当出差确认来自出差单列表的时候要带上参数*/
	
	/*doEdit: function(method, options) {
		if (!$.isPlainObject(options)) {
			options = {};
		}
		options.method = method;
		if ($.isEmptyObject(this.billId)) {
			options.method = 'addNew'; 
		}	
		if(isFromPage == "Trip"){//如果请假确认是从请假单列表中点击进入的话，要带上参数。
		   options.isFromPage = "Trip";
		}
		if(tripBillId){
			 options.tripBillId = tripBillId;
		}
		// 加载内容
		this.reloadPage(options);	
	}*/
	,beforeSubmit :function(){
		
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		if (($form.valid() && _self.verify())) {
			return true ;
		}
		// return false 也能保存，固让js报错，后续让eas修改 return false 逻辑
		var len = workArea.length() ;
		return false ;
	}
	/**
	 *   portal审批界面点击提交按钮的时候调用此方法
	 */
	,getCurrentModel : function(){
		
		var that = this ;
		var model = shr.ats.CanTripBillEdit.superClass.getCurrentModel.call(this);
		var realStartTime = model.entries[0].realStartTime ;
		var realEndTime = model.entries[0].realEndTime;
		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(realStartTime)))
		{
		  model.entries[0].realStartTime = realStartTime+":00";
		}
		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(realEndTime)))
		{
		  model.entries[0].realEndTime = realEndTime+":00";
		}
        model.ccPersonIds = model.ccPersonIds && model.ccPersonIds.id || "";
        model.ccPerson = model.ccPersonIds;
		return model ;
	},
	setRealStartAndEndTime : function(res){
		var that = this ;
		atsMlUtile.setTransDateTimeValue("entries_realStartTime",res.startTime);
		atsMlUtile.setTransDateTimeValue("entries_realEndTime",res.endTime);
		atsMlUtile.setTransNumValue("entries_realTripDays",res.tripDays);
		that.setDateAndHMS(res.startTime,res.endTime);
	}
	,setIsAllDay:function(res){
		var allDay = res.isAllDay;
		if(allDay){
			$("#entries_isAllDay").shrCheckbox("check");
		}else {
			$("#entries_isAllDay").shrCheckbox("unCheck");
		}
	}
	,initElasticCalCtrl:function(){
		var that = this ;
	    //弹性段是否算时长
	    if( that.getOperateState() == 'VIEW'|| that.getOperateState() == 'EDIT'){
	    	that.showIsElasticCalCtrl();
	    }else{
	    	$("#entries_isElasticCalLen").parent().parent().parent().hide();
	    }
	    if( that.getOperateState() != 'VIEW'){
		    $("#entries_isElasticCalLen").change(function(){//弹性段算时长change事件
				 if($('#entries_tripEntryBill_el').val()){
					that.getRealTripLength();
				 }
			});
	    }
	}
	,showIsElasticCalCtrl:function(){
		var that = this ;
		
    	var personId = $("#entries_person_el").val()==""||$("#entries_person_el").val()==undefined?$("#entries_person").val():$("#entries_person_el").val();
    	var beginTime = atsMlUtile.getFieldOriginalValue("entries_realStartTime") ==""?atsMlUtile.getFieldOriginalValue("entries_realStartTime"):atsMlUtile.getFieldOriginalValue("entries_realStartTime");
	    var endTime = atsMlUtile.getFieldOriginalValue("entries_realEndTime") ==""?atsMlUtile.getFieldOriginalValue("entries_realEndTime"):atsMlUtile.getFieldOriginalValue("entries_realEndTime");
    	shr.atsBillUtil.showIsElasticCalCtrl(that,personId,"",beginTime,endTime);
		    
	}
	
	,addSocQueryTips:function(){
		var that = this;
		shr.atsBillUtil.addSocQueryTipA("tipsIsElasticCal");
	}
	,showTips:function(){
		//此处选择器中用中文括号，页面上是中文
		$("[title='" + jsBizMultLan.atsManager_canTripBillEdit_i18n_15 + "']")
			.append('<span id="tipsIsElasticCal"></span>');
		var tipsIsElasticCalText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_canTripBillEdit_i18n_17
			+ '<br/>';
		var tipsIsElasticCalLog = '<div id="tipsIsElasticCal-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;height:100px;position:absolute;left:15%;z-index:1;margin-top:0px;background: aliceblue;"><div style="position:absolute"><font color="gray">'+tipsIsElasticCalText+'</font></div></div>';
		//此处选择器中用中文括号，页面上是中文
		$("[title='"+jsBizMultLan.atsManager_canTripBillEdit_i18n_15+"']").after(tipsIsElasticCalLog);
	}
});

 
 








