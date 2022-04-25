$().ready(function() {
	//解决新增可以动态校验而编辑不可以动态校验的问题
	$.validator.messages.maxlength = $.validator.format( jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_63 );
	$("#entries_reason").attr("validate","{maxlength:255}");
});
var _unitType = 0;
var yearGolbal = new Date().getFullYear();
var ev_ev = [];
var yearVacationId = '3T54RtSQRIqAL6cffMh60P0tUpg=';
var _shiftTime;
var _isHalfDayOff = false;
var _isHalfDayOffFirst=true
var _defaultAmBeginTime = "09:00";
var _defaultAmEndTime = "12:00";
var _defaultPmBeginTime = "13:00";
var _defaultPmEndTime = "17:00";
var _viewBeginLeaveTime = "";
var _viewEndLeaveTime = "";
var _attendanceFileMark="";
var  pageUipk = "com.kingdee.eas.hr.ats.app.AtsLeaveBillAllForm";
var  yearHolidayTypeId = "3T54RtSQRIqAL6cffMh60P0tUpg="
var holidayFileHisId = "";//假期档案历史。后台查档案历史后，要给该字段赋值；而页面的业务组织、人员、请假开始、结束时间改变时，要清空该值
var _endTimes ="";
var _startTimes ="";
var customizeBF = "8r0AAAA09p9IT3K3";
var bfHolidayTypeId = "8r0AAAAMhrv9LVKY";
shr.defineClass("shr.ats.AtsLeaveBillEdit", shr.framework.Edit, {
	_unitType:0,
	initalizeDOM:function(){
		shr.ats.AtsLeaveBillEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		that.setNavigateLine();
		that.setButtonVisible(); //初始化页面安装状态,如果是已经提交的或者审批通过的单据编辑按钮不显示
		
		// 将温馨提醒 加入专员中
		$("#message_head").show();
		if (that.getOperateState() == 'EDIT'){
			_startTimes = atsMlUtile.getFieldOriginalValue('entries_beginTime');
			_endTimes = atsMlUtile.getFieldOriginalValue('entries_endTime');
			
			//能否修改请假长度
			that.isLeaveLengthEdit();
			//初始化 是否启动半天假
			that.getSetIsCtrlHalfDayOff();
			that.loadTimeAttendanceType();
			
			//哺乳假
			var bfTypeId = $("#entries_bFType").val();
			if(bfTypeId != null && bfTypeId != ""){
				$("#bfInfo").show();				
				if(bfTypeId == customizeBF){
					$("#entries_childbirthday").parents(".field-basis1").hide();	
					$("#entries_mLEndTime").parents(".field-basis1").hide();					
				}
			}			
		}
		if (that.getOperateState() != 'VIEW' && shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.AtsLeaveBillForm") {
			that.initPersonalLeaveMess();
			//能否修改请假长度
			that.isLeaveLengthEdit();
			//初始化 是否启动半天假
			that.getSetIsCtrlHalfDayOff();
			//创建和编辑界面隐藏是否请假确认
			$("#entries_isCancelLeave").closest("div[data-ctrlrole='labelContainer']").hide();
			that.loadTimeAttendanceType();
		}		
		if (that.getOperateState() != 'VIEW' ){
			//定制校验
			that.myExtendValidate();
			that.myDefaultValidate();
			//选择人员的时候，人员的组织信息和电话信息变动的处理方法
			that.processPersonF7ChangeEvent();
			that.processBFTypeF7ChangeEvent();
		}
		that.initAttendanceType();
		that.initPersonalHolidayLimit();
		
		//初始化页面设置请假长度单位描述
		that.setLeaveLengthUnit();
		that.initDialog();
		//展示请假单下边的请假确认单信息
		if (that.getOperateState() == 'VIEW') {
			//哺乳假
			var bfTypeId = $("#entries_bFType").val();
			if(bfTypeId != null && bfTypeId != ""){
				$("#bfInfo").show();				
				if(bfTypeId == customizeBF){
					$("#entries_childbirthday").parents(".field-basis1").hide();
					$("#entries_mLEndTime").parents(".field-basis1").hide();					
				}
			}			
			//给请假时长后面加上请假单位
			if($('#entries_realUnit').val() == 1 ){
				$('#entries_leaveLength').append('&nbsp;&nbsp;'
						+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_52);				
			}else{
				$('#entries_leaveLength').append('&nbsp;&nbsp;'
						+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_58);		
			}
			that.getPolicyRemark($('#entries_policy').val());
			that.getCancelLeaveBillInfo();
			//隐藏提交生效按钮
			$("#submitEffect").hide();
			$("#leaveRemark").closest('[class="group-panel"]').hide();
			$("#extraBfType .row-fluid.row-block").eq(0).css("padding-left","0");
			$(".attachmentUploadArea").parent().parent().parent().parent().parent().css("padding-left","0");
			$("#entries_childbirthday").parent().parent().parent().parent().css("padding-left","16px");
		}
		if (that.getOperateState() == 'VIEW' || that.getOperateState() == 'ADDNEW' || that.getOperateState() == 'EDIT') {
			$("#cancelLeaveBillInfoDes").hide();
		}
		
		that.setNumberFieldEnable();
		
		if(that.getOperateState() != 'VIEW'){
			$('#entries_person').bind('change',function(){
				that.initPersonalLeaveMess();
				that.getSetIsCtrlHalfDayOff();
				that.leaveTimeChangeDealOfDay();
				that.showIsElasticCalCtrl(); //弹性段是否算时长
			});
			
			//业务组织onchange事件
			that.processF7ChangeEventHrOrgUnit();
			var hrOrgUnitId = $("#hrOrgUnit_el").val();
			that.initCurrentHrOrgUnit(hrOrgUnitId);
			that.leaveTimeChangeDealOfDay();
			if(that.isFromWF()){ // 来自任务中心
				$('#cancelAll').hide();
			}
			//初始化设置选择人员的时候带上HR组织ID 
			that.initHROrgUnitValueToPerson();
			that.addPageListener();
		}
		
		//隐藏提交生效按钮
		if (that.getOperateState() == 'VIEW') {			
			if(that.isFromWF()){ // 来自任务中心
				$('#submitEffect').hide();
				$('#cancelAll').hide();
				$('#submit').text(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_51);
				$('#edit').hide();
			}
		}
		
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.AtsLeaveBillForm") {
			if (shrDataManager.pageNavigationStore.getDatas().length == 2) {
				$("#breadcrumb").find("li.active").html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_55);
				var a = shrDataManager.pageNavigationStore.getDatas()[1];
				a.name = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_55;
				shrDataManager.pageNavigationStore.pop();
				shrDataManager.pageNavigationStore.addItem(a);
			}
			if (shrDataManager.pageNavigationStore.getDatas().length == 3) {
				$("#breadcrumb li")[2].remove();
				$("#breadcrumb").find("li.active")
				.html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_55);
				shrDataManager.pageNavigationStore.pop();
			}

			if (shrDataManager.pageNavigationStore.getDatas().length == 4) {
				$($("#breadcrumb li")[3]).html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_9);
			}
		}
		
		if(that.isFromWF()){
			$("#addInstanceToDeskItem").css('display','none');
		}
		
		var paramMethod = shr.getUrlRequestParam("method");
     	if(paramMethod == null){
     	    $("#breadcrumb").find(".active").text(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_55);
     	    if(shrDataManager.pageNavigationStore.getDatas().length==0){
     	    	var object_bread_1 = {
     	    			name: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_55,
						url: window.location.href,
     	    			workPlatformId: "Qz9UfhLqB0+vmMJ4+80EykRLkh4="
     	    	}
     	    	shrDataManager.pageNavigationStore.pop();
				shrDataManager.pageNavigationStore.addItem(object_bread_1);
     	    }
     	}
	     	
	    $("#entries_policy_el").on("change",function(){
	    	that.getSetIsCtrlHalfDayOff($("#entries_policy_el").val());
	    	that.leaveTimeChangeDealOfDay();
	    });
	    that.initElasticCalCtrl();	
	    that.showTips();
		that.addSocQueryTips();
		$("#entries_leaveLength").on("change",function(){
	    	that.getEndTime();
		});
		$("#entries_leaveLength").closest("div[data-ctrlrole='labelContainer']").css("margin-right","30px");
		$(".attachmentUploadArea").closest(".group-panel").css("border","0");
		$("#orgunit").hide();
	}
	
	,initStartAndEnd : function(){
		var that = this ;
		var startTime=shr.getUrlRequestParam("startAndEnd");
		if(!startTime){
			return;	
		}
		var personId = $('#entries_person_el').val() ||  $('#entries_person').val();
		var hrOrgUnitId =  $("#hrOrgUnit_el").val() || $("#hrOrgUnit").val();
		if(!hrOrgUnitId || !personId){
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
				atsMlUtile.setTransDateTimeValue("entries_beginTime",res.beginDate);
				atsMlUtile.setTransDateTimeValue("entries_endTime",res.endDate);
				that.getRealLeaveLengthOfDay();
			}
		});
	},
	
	getEndTime : function(){
		var that=this;
		var leavelength=atsMlUtile.getFieldOriginalValue("entries_leaveLength");
		var startTime=atsMlUtile.getFieldOriginalValue("entries_beginTime");
		var endTime = atsMlUtile.getFieldOriginalValue("entries_endTime")
		var holidayTypeId=$("#entries_policy_holidayType_el").val();
		var personId=$("#entries_person_el").val();
		if(!personId || !startTime || endTime){
			return;
		}else{
			startTime = startTime + " 00:00:00";
		}
		that.remoteCall({
			type:"post",
			async: false,
			method:"getLeaveEndTime",
			param:{leavelength:leavelength,startTime:startTime,personId:personId,holidayTypeId:holidayTypeId},
			success:function(res){
				info =  res;
				atsMlUtile.setTransDateTimeValue("entries_endTime",res.atsLeaveEndTime.substring(0,16));
			}
		});
	},
	
	changeOverHrOrgUnit : function(){
		var that = this;
		var overStartTime = atsMlUtile.getFieldOriginalValue("entries_beginTime");
		if (overStartTime) {
			overStartTime = overStartTime.replace("\\-","/");
			var personId = $("#entries_person_el").val();
			that.remoteCall({
				type:"post",
				async: false,
				method:"getHrOrgUnit",
				param:{personId:personId,beginTime:overStartTime},
				success:function(res){
					info =  res;
					if(res.hrOrgUnitname && res.hrOrgUnitId){
					$("#hrOrgUnit").attr("value",res.hrOrgUnitname);
					$("#hrOrgUnit_el").attr("value",res.hrOrgUnitId);
					$("#entries_adminOrgUnit_el").attr("value",res.adminOrgUnitId);
					$("#entries_adminOrgUnit").attr("value",res.adminOrgUnitname);
					}
				}
			});
		}
	}
	
	,processF7ChangeEventHrOrgUnit: function () {
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange: function (e, value) {
					shr.msgHideAll();
					$("#entries_person_number").val("");//@
					$("#entries_person_el").val("");
					$("#entries_person").val("");
					$('#entries_adminOrgUnit').shrPromptBox("setValue",null);	//清空行政组织
					var info = value.current;
					that.initCurrentHrOrgUnit(info.id);
				}
			});
		}
	}
	
	, initCurrentHrOrgUnit: function (hrOrgUnitId) {
		var that = this;
		$("#entries_person").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
	}
	
	, initQuerySolutionHrOrgUnit: function (hrOrgUnitId) {
		var that = this;
		that.remoteCall({
			type: "post",
			method: "initQuerySolution",
			param: {
				hrOrgUnitId: hrOrgUnitId
			},
			async: true,
			success: function (res) {

			}
		});
	}
	
	,initHROrgUnitValueToPerson : function(){
		var hrOrgUnit_el = $("#hrOrgUnit_el").val();
		if(hrOrgUnit_el){
			$("#entries_person").shrPromptBox().attr("data-params",hrOrgUnit_el);
		}
	},
	
	addPageListener : function(){
		var that = this ;
		$('#hrOrgUnit').change(function(){
			that.initHROrgUnitValueToPerson();
		});
	}
	
	,getSetIsCtrlHalfDayOff : function(policyId){
		var that = this;
		var personId = $("#entries_person_el").val();
		if(!personId){
			return;
		}
		that.remoteCall({
			type:"post",
			async: false,
			method:"getSetIsCtrlHalfDayOff",
			param:{personId:personId,policyId:policyId},
			success:function(res){
				info =  res;
				var beforeHalfDayOff=_isHalfDayOff
				_isHalfDayOff = info.isHalfDayOff;
				_isHalfDayOffFirst=false
				that.setHalfDayOff(info);
			}
		});
	}
	,
	bfHolidayProcess : function(info) {
		if (info.isHalfDayOff) {
			$("#entries_childbirthday").shrDateTimePicker('setValue', "");
			$("#entries_mLEndTime").shrDateTimePicker('setValue', "")
		}
		$("#entries_childbirthday").parents("div[data-ctrlrole=labelContainer]").show();
		$("#entries_mLEndTime").parents("div[data-ctrlrole=labelContainer]").show();
		this.resetBeginEndTimeComponent(info,'Date');
		$("#entries_beginTime").parents(".field-ctrl").prev()
				.find(".field-label").prop("title", jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_65).html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_65);
		$("#entries_endTime").parents(".field-ctrl").prev()
				.find(".field-label").prop("title", jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_66).html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_66);

	},
	setHalfDayOff : function(info) {
		var that = this;
		var holidayTypeId = $("#entries_policy_el").val(); // 假期分类ID
		var bfTypeId = $("#entries_bFType_el").val();
		that.isHalfDayOff = info.isHalfDayOff;
		if (bfHolidayTypeId == holidayTypeId && bfTypeId != null && bfTypeId != "" && bfTypeId != customizeBF) {
			this.bfHolidayProcess(info);
			return;
		} 
		if (info.isHalfDayOff) {
			_defaultAmBeginTime = info.amBeginTime;
			_defaultAmEndTime = info.amEndTime;
			_defaultPmBeginTime = info.pmBeginTime;
			_defaultPmEndTime = info.pmEndTime;
		}
		that.resetBeginEndTimeComponent(info);
		//编辑界面 设置请假开始结束时间
		that.getSetBeginEndTime();
	}
	,resetBeginEndTimeComponent: function(info,ctrlType){
		var self = this;
		var enumOptions = [{value : _defaultAmBeginTime + "-" + _defaultAmEndTime,alias : jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_41},
			  			   {value : _defaultPmBeginTime + "-" + _defaultPmEndTime,alias : jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_57}];
		var dateTimePicker_json = {
			selectModel:info.isHalfDayOff,
			ctrlType : ctrlType,
			value:  _startTimes,
			onDateChange:function(args){
				!(self.isFromWF() && self.getOperateState() == 'EDIT') && self.getRemainLimit();
				self.setBeginOrEnd(args);
			},
			onchange:function(args){
				holidayFileHisId = "";
				self.getRealLeaveLengthOfDay(args)
			},
			enumOptions:enumOptions
		};
		shrDateWithSelectPicker('entries_beginTime',dateTimePicker_json);
		shrDateWithSelectPicker('entries_endTime',$.extend({},dateTimePicker_json,{value:_endTimes,isBeginTime:false}));
	}
	
	,getSetBeginEndTime:function(){
		var that = this;
		//赋值请假开始结束时间
		if(that.getOperateState() == 'EDIT'){
			  that.remoteCall({
				type:"post",
				async: false,
				method:"getLeaveBillInfoByBillId",
				param:{billId:$('#id').val()},
				success:function(res){
						_viewBeginLeaveTime = res.beginTime;
						_viewEndLeaveTime = res.endTime;
						atsMlUtile.setTransDateTimeValue('entries_beginTime',res.beginTime);
						atsMlUtile.setTransDateTimeValue('entries_endTime',res.endTime);
				}
			});
			that.getRemainLimit();
		}
	}
	/**
	 * 设置编码字段是否可编辑
	 */
	,setNumberFieldEnable : function() {
		var that = this ;
		if (that.getOperateState().toUpperCase() == 'EDIT' ||　that.getOperateState().toUpperCase() == 'ADDNEW') {
			var leaveBillNumberFieldCanEdit = that.initData.leaveBillNumberFieldCanEdit;
			if (typeof leaveBillNumberFieldCanEdit != 'undefined' && !leaveBillNumberFieldCanEdit) {
				that.getField('number').shrTextField('option', 'readonly', true);
			}
		}
	}
	
	,setBeginOrEnd:function(args){
		var that = this ;
		var changeEle = args.target.id || 'entries_beginTime';
		var isBeginTimeChange = changeEle == 'entries_beginTime';
		var needChangeEle = isBeginTimeChange ? 'entries_endTime' : 'entries_beginTime';
		if (that.getOperateState() != 'VIEW') {
			var changeTime = atsMlUtile.getFieldOriginalValue(changeEle);
			var needChangeTime = atsMlUtile.getFieldOriginalValue(needChangeEle);
			var diff = needChangeTime && changeTime ? new Date(changeTime).getTime() - new Date(needChangeTime).getTime() : 0;
			var changeDefaulTime = ' ' + (isBeginTimeChange ? _defaultPmEndTime : _defaultAmBeginTime) + ':00'
			if(!needChangeTime) {
				atsMlUtile.setTransDateTimeValue(needChangeEle,changeTime.substring(0,10) + changeDefaulTime);
			}else if(isBeginTimeChange ? diff > 0 : diff < 0 ){
				atsMlUtile.setTransDateTimeValue(needChangeEle,changeTime.substring(0,10) + changeDefaulTime);
			}
			atsMlUtile.setTransDateTimeValue(changeEle,changeTime.substring(0,10) + ' ' + (isBeginTimeChange ? _defaultAmBeginTime : _defaultPmEndTime) + ':00');
		}
	}
	,getPolicyRemark:function(policyId){
		var _self = this;
		_self.remoteCall({
			type:"post",
			async: true,
			method:"getPolicyRemark",
			param:{policyId:policyId},
			success:function(res){
				info =  res;
				var remark = "";
				if(info.policyRemark){
					remark = "" + info.policyRemark ;
				}
				$('#entries_policy').attr('title',remark);
			}
		});
		
	}
	,getShiftTime:function(date,beginOrEnd,amOrPm){
		var that = this;
		var personId = $("#entries_person_el").val();
		that.remoteCall({
			type:"post",
			async: true,
			method:"getShiftTime",
			param:{personId:personId,date:date,beginOrEnd:beginOrEnd,amOrPm:amOrPm},
			success:function(res){
				info =  res;
				_shiftTime = info.shiftTime;
			}
		});
	}
	//提交即生效
	,submitEffectAction : function (event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		
		if(_attendanceFileMark !=""){
			shr.showWarning({message: _attendanceFileMark});
			return;
		}
		if (_self.validate() && $form.valid() && _self.verify("submit")) {
			var holidayTypeId = $("#entries_policy_holidayType_el").val(); //假期分类ID
			var bfTypeId = $("#entries_bFType_el").val();
			if(holidayTypeId == bfHolidayTypeId && bfTypeId != "" && bfTypeId != customizeBF){	
				
			}else if(bfTypeId == customizeBF){
				$("#entries_childbirthday").shrDateTimePicker('setValue', "");
				$("#entries_mLEndTime").shrDateTimePicker('setValue', "");				
			}
			else{
				$("#entries_bFType_el").val("");
				$("#entries_childbirthday").shrDateTimePicker('setValue', "");
				$("#entries_mLEndTime").shrDateTimePicker('setValue', "");	
			}
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_beginTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_endTime").split(" ")[0];
			var personId = $("#entries_person_el").val();	
			var billType = "leave";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: true,
				success:function(res){
					var result = res.result;
					if(result==""){
						if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
							shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_14, function() {
								//start 如果是否启动半天假为是  处理上下午的请假时间 合成为时间
								if(_isHalfDayOff){
								var halfTime = _self.getHalfTime();
									atsMlUtile.setTransDateTimeValue('entries_beginTime',halfTime.beginTime);
									atsMlUtile.setTransDateTimeValue('entries_endTime',halfTime.endTime);
								}
								//end	
								
								_self.prepareSubmitEffect(event, 'submitEffect');
							});
						}else{
							shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_22, function() {
								//start 如果是否启动半天假为是  处理上下午的请假时间 合成为时间
								if(_isHalfDayOff){
								var halfTime = _self.getHalfTime();
									atsMlUtile.setTransDateTimeValue('entries_beginTime',halfTime.beginTime);
									atsMlUtile.setTransDateTimeValue('entries_endTime',halfTime.endTime);
								}
								//end	
								
								_self.prepareSubmitEffect(event, 'submitEffect');
							});
						}						
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_50,function(){
							if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
								shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_14, function() {
									//start 如果是否启动半天假为是  处理上下午的请假时间 合成为时间
									if(_isHalfDayOff){
									var halfTime = _self.getHalfTime();
									atsMlUtile.setTransDateTimeValue('entries_beginTime',halfTime.beginTime);
									atsMlUtile.setTransDateTimeValue('entries_endTime',halfTime.endTime);
									}
									//end	
									
									_self.prepareSubmitEffect(event, 'submitEffect');
								});
							}else{
								shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_22, function() {
									//start 如果是否启动半天假为是  处理上下午的请假时间 合成为时间
									if(_isHalfDayOff){
									var halfTime = _self.getHalfTime();
									atsMlUtile.setTransDateTimeValue('entries_beginTime',halfTime.beginTime);
									atsMlUtile.setTransDateTimeValue('entries_endTime',halfTime.endTime);
									}
									//end	
									
									_self.prepareSubmitEffect(event, 'submitEffect');
								});
							}
						});
					}
				}
			});
		}	
	}
	/**
	 * 提交
	 */
	,submitAction: function(event) {
		var _self = this,
			workArea = _self.getWorkarea(),
			$form = $('form', workArea);
		
		if(_attendanceFileMark !=""){
			shr.showWarning({message: _attendanceFileMark});
			return;
		}
		
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.AtsLeaveBillForm") {
			var personId = $('#entries_person_id').val();
			var proposerId = $('#proposer_id').val();
			if(undefined != personId && undefined != proposerId && personId != "" && proposerId != "" && personId != proposerId){
				shr.showError({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_62, hiddenAfter: 5});
				return;
			}
		}
		
		if ((_self.validate() && _self.verify("submit"))) {
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_beginTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_endTime").split(" ")[0];
			var personId = $("#entries_person_el").val();	
			var billType = "leave";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: true,
				success:function(res){
					var result = res.result;
					if(result==""){
						shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_21, function() {
							_self.doSubmit(event, 'submit');
						});	
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_50,function(){
							shr.showConfirm(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_21, function() {
								_self.doSubmit(event, 'submit');
							});	
						});
					}
				}
			});
		}		
	}
	,assembleSaveData: function(action) {
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		data.method = action;
		data.operateState = _self.getOperateState();
		var model = _self.assembleModel();
		if(_self.getOperateState() =='VIEW'){
			var entries = [] ;
			var curEntrie = model.entries;
			model.entries = {
	 			adminOrgUnit: $("#entries_adminOrgUnit").val(),
				leaveLength: atsMlUtile.getFieldOriginalValue("entries_leaveLength").replace(/[^0-9.]/ig,""),
				person : $("#entries_person").val(),
				policy:  $("#entries_policy").val(),
			    realLeaveLength : atsMlUtile.getFieldOriginalValue("entries_realLeaveLength"),
			    realUnit : $("#entries_realUnit").val(),
			    reason :$("#entries_reason").text(),
			    remark :$("#entries_remark").val()
	 		};
	 		var id = $("#id").val() 
			var number = atsMlUtile.getFieldOriginalValue("number")
			var proposer = $("#proposer").val();
	 		model.id = id;
	 		model.number = number;
	 		model.proposer = proposer;
		}
		model.entries.beginTime = model.entries.realBeginTime = atsMlUtile.getFieldOriginalValue("entries_beginTime");
		model.entries.endTime = model.entries.realEndTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
		data.model = shr.toJSON(model); 
		
		// relatedFieldId
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		var jsonModel = JSON.parse(data.model);
		if(jsonModel.entries.bFType && jsonModel.entries.bFType != customizeBF && $("#entries_policy_holidayType_el").val() == bfHolidayTypeId){
			jsonModel.entries.beginTime +=" 00:00:00";
			jsonModel.entries.endTime += " 23:59:59";
			data.model = JSON.stringify(jsonModel);
		}
		
		return data;
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
	 ,createBatchAction:function(event){
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsLeaveBillFormNew',
			method: 'addNew'
		});
 	}
 	,saveAction: function(event) {
		var _self = this;
		var workArea = _self.getWorkarea();
		$form = $('form', workArea);
		
		if(_attendanceFileMark !=""){
			shr.showWarning({message: _attendanceFileMark});
			return;
		}
			
		if (_self.validate() && $form.valid() && _self.verify("save")) {
			var holidayTypeId = $("#entries_policy_holidayType_el").val(); //假期分类ID
			var bfTypeId = $("#entries_bFType_el").val();
			if(holidayTypeId == bfHolidayTypeId && bfTypeId != "" && bfTypeId != customizeBF){
				
			}else if(bfTypeId == customizeBF){
				$("#entries_childbirthday").shrDateTimePicker('setValue', "");
				$("#entries_mLEndTime").shrDateTimePicker('setValue', "");
			}
			else{
				$("#entries_bFType_el").val("");
				$("#entries_childbirthday").shrDateTimePicker('setValue', "");
				$("#entries_mLEndTime").shrDateTimePicker('setValue', "");
			}
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_beginTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_endTime").split(" ")[0];
			var personId = $("#entries_person_el").val();	
			var billType = "leave";
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
						shr.showConfirm(result+jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_50,function(){		
							_self.doSave(event, 'save');
						});
					}
				}
			});
		}	
	}
	,myExtendValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {
			myTmVldt: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_34 //日期的格式和有效性
		  });  
	}
	,myDefaultValidate:function(){
		$('#entries_endTime,#entries_beginTime').attr("validate","{required:true}");
	}
	/**
	 * 点击取消按钮 返回到个人请假列表list(个人) ||  com.kingdee.eas.hr.ats.app.AtsLeaveBill
	 */
	,cancelAction:function(){
		if (!this.isFromWF()) {
			this.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.AtsLeaveBillList',
				serviceId : "vA0Y5XHfR8eJESywHpQQSPI9KRA="
			});
		}
		
	 }
	//专员返回专员列表的取消按钮
	,cancelAllAction:function(){
	 	this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList'
		});
	}
	
	//返回个人请假列表链接跳转
	,returnToLeaveBillListAction:function(){
	   this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsLeaveBillList'
		});
	}
	
	,processPersonF7ChangeEvent : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#entries_person").shrPromptBox("option", {
				onchange : function(e, value) {
					shr.msgHideAll();
					var info = value.current;
					if(info != null){
				    if(info.hasOwnProperty("holidayFileHis.id")){
						var holidayFileHisId=info["holidayFileHis.id"];
						that.remoteCall({
							type:"post",
							method:"getPersonInfos",
							param:{holidayFileHisId: holidayFileHisId},
							success:function(res){
								$("#entries_person_number").val("");//@
								$('#entries_adminOrgUnit').shrPromptBox("setValue",null);	//清空行政组织
								$("#entries_person_number").val(res.personNum);//@
								$('#entries_adminOrgUnit').shrPromptBox("setValue",{id:res.adminOrgUnitId,name:res.adminOrgUnitDisplayName});
								that.reloadTimeAttendanceType();
								that.isLeaveLengthEdit();
							},
							error:function(){
								$("#entries_person_number").val("");//@
								$('#entries_adminOrgUnit').shrPromptBox("setValue",null);//清空行政组织
							}
						});
				    }
					}
				}
			});
		}
	}
	,reloadTimeAttendanceType:function(){
		var that = this;
		if ($("#bill_flag").val() == "commissioner") {
			that.loadTimeAttendanceType();
		}
	}
	
	,goNextPage: function(source) {
		if ($("#bill_flag").val() == "commissioner"){
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList"
			});
		}else{
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsLeaveBillList"
			});
		}
	}
	//哺乳假假期类型选择
	,processBFTypeF7ChangeEvent: function () {
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#entries_bFType").shrPromptBox("option", {
				onchange: function (e, value) {
					that.changeBFType(value);
				}
			});
		}			
	}
	//view状态下显示哺乳假隐藏内容
	,changeBFType:function(value){
		var that = this;	
		//自定义类型
		if (value.current == null || value.current.id == customizeBF) {
			if(value.current == null){
				$("#entries_bFType_el").val("");
				$("#entries_bFType").val("");
				$("#entries_bFType").attr("titile","");
				$("#entries_leaveLength").val("");
			}
			$("#entries_childbirthday").parents(".field-basis1").hide();	
			$("#entries_mLEndTime").parents(".field-basis1").hide();
			if (that.isHalfDayOff) {
				that.resetBeginEndTimeComponent({isHalfDayOff:that.isHalfDayOff});
			} else {
				that.resetBeginEndTimeComponent();							
			}
			//编辑界面 设置请假开始结束时间
			that.getSetBeginEndTime();							
		}else {
			$("#entries_childbirthday").val("").parents(".field-basis1").show();	
			$("#entries_mLEndTime").val("").parents(".field-basis1").show();
			that.resetBeginEndTimeComponent();
			$("#entries_beginTime").parents(".field-ctrl").prev().find(".field-label").prop("title",jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_65).html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_65);
			$("#entries_endTime").parents(".field-ctrl").prev().find(".field-label").prop("title",jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_66).html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_66);
		}
		that.leaveTimeChangeDealOfDay();
		that.bfTimeChange();
		//查询产假结束日期
		var personId = $("#entries_person_el").val();
		that.remoteCall({
				type: "post",
				async: false,
				method: "getMaternityEndTime",
				param: {
					personId: personId							
				},
				success: function (res) {
					if(res.maternityEndTime != null && res.maternityEndTime != ""){
						$("#entries_mLEndTime").shrDateTimePicker('setValue',res.maternityEndTime);
						$("#entries_mLEndTime").change();
					}
				}
		});
	}
	,bfTimeChange: function () {
		var that = this;
		//产假结束日期
		$("#entries_mLEndTime").change(function () {		
			var mlEndDate = new Date(atsMlUtile.getFieldOriginalValue("entries_mLEndTime"));
			var date = new Date(mlEndDate.setDate(mlEndDate.getDate() + 1));

			var month = (date.getMonth() + 1).toString();
			if (month.length == 1) {
				month = "0" + month;
			}
			var day = date.getDate().toString();
			if (day.length == 1) {
				day = "0" + day;
			}			
			$("#entries_beginTime").shrDateTimePicker('setValue', date.getFullYear() + "-" + month + "-" + day);
			//计算请假时长
			that.getRealLeaveLengthOfDay()
		});
		//子女出生日期
		$("#entries_childbirthday").change(function () {
			var childbirthday = new Date(atsMlUtile.getFieldOriginalValue("entries_childbirthday"));
			var date = new Date(childbirthday.setFullYear(childbirthday.getFullYear() + 1));
			date = new Date(childbirthday.setDate(childbirthday.getDate() + 1));
			var month = (date.getMonth() + 1).toString();
			if (month.length == 1) {
				month = "0" + month;
			}
			var day = date.getDate().toString();
			if (day.length == 1) {
				day = "0" + day;
			}			
			$("#entries_endTime").shrDateTimePicker('setValue', date.getFullYear() + "-" + month + "-" + day);
			//计算请假时长
			that.getRealLeaveLengthOfDay()
		});
	}
	,initDialog:function(){
		var that = this ;
		var dialog_Html = "<div id='dialogViewMore' title=''>" +
				"<p id='ppppp'></p>" +
				"<div class='longDemo demo'>" +
				"	<h2 style='font: 14px Microsoft Yahei; text-align: center; margin-left:95px; width:700px;'>" +
				"		<font style=' font-size:0px;'>test</font>" +
				"		<span style='float:left; display:block;'><a id='a_pre' style='cursor:pointer'>" 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_24 
				+ "</a></span>" + //onClick='pre()' 
				"		<span style='float:right;display:block;'><a id='a_next' style='cursor:pointer'>" 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_15 
				+ "</a></span>" + //onClick='next()'
				"	</h2>" +
				"	<div id='longTimeLine'></div>" +
				"</div>" +
				"</div>";
			//审核界面  特殊处理
		if($('#breadcrumb').attr('id')!='breadcrumb' && parent.window.shr.getCurrentViewPage().uipk!="com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop"
			&& parent.window.shr.getCurrentViewPage().uipk!="com.kingdee.eas.hr.ats.app.WorkCalendarItem.listSelf"){
			$("#message_info").hide();
		}else{
			$(document.body).append(dialog_Html);
		}
		$(".longDemo").hide();
		if($('#breadcrumb').attr('id')!='breadcrumb' && parent.window.shr.getCurrentViewPage().uipk!="com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop"
			&& parent.window.shr.getCurrentViewPage().uipk!="com.kingdee.eas.hr.ats.app.WorkCalendarItem.listSelf"){
	    	that.showMoreBindClick();
		}else{
		//点击更多请假信息的方法
		    $('#showMoreLeaveInfo').click(function(e){
		    	var personId = that.getFieldValue("entries_person");
		    	yearGolbal = new Date().getFullYear();
		  		if(personId!=null&&personId!=''){
		  			$(".longDemo").show();
		  			that.clearEventDataInfos();
		    		that.showViewMoreDialog();
		    		that.ajaxLoadAllLeaveBillDatas(yearGolbal);
		    	}else{
		    		shr.showError({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_16});
		    	}
		    });
	    
		}
	    //绑定点击事件--放在里边会出现绑定多次点击事件
        $('#a_pre').click(function(e){
        	that.clearEventDataInfos();
        	that.loadPreLeaveBillDatas();
        });
        $('#a_next').click(function(e){
        	that.clearEventDataInfos();
        	that.loadNextLeaveBillDatas();
        });
	}
 	/**
	 * 清空ev_ev数据 否则会有重复数据
	 */
	,clearEventDataInfos:function(){
		ev_ev.splice(0,ev_ev.length);//由于ev_ev是全局变量 所以要清空下数据
	}
	/**
     * 默认第一次点击弹出框的时候,默认加载系统当前年份的所有请假记录信息
     * 获取任何一年的所有请假单数据信息
     */
	,ajaxLoadAllLeaveBillDatas:function(yeargolbal){
		var that = this ;
        var personId = that.getFieldValue("entries_person");
		that.remoteCall({
				type:"post",
				method:"getAnyYearLeaveBillDataInfos",
				param:{personId:personId,currentYear:yeargolbal},
				success:function(res){
					var info = res;
					var leaveBillColls = JSON.parse(info.AllAtsLeaveBillList);
					var len = leaveBillColls.length;
					for(var i = 0;i<len;i++){
						var applyDate = leaveBillColls[i].applyDate;//"2013-06-08 00:00:00"
						var beginTime = leaveBillColls[i].entries[0].beginTime;//2013-09-15 08:30:00
						var endTime = leaveBillColls[i].entries[0].endTime;
						var typeName = leaveBillColls[i].entries[0].policy.holidayType.name;
						var length = "";
						if ( typeof(leaveBillColls[i].entries[0].leaveLength) != "undefined" ) {
							length = leaveBillColls[i].entries[0].leaveLength;
						}
						var unitType = "";
						if ( typeof(leaveBillColls[i].entries[0].remark) != "undefined" ) {
							unitType = leaveBillColls[i].entries[0].remark ;
						}
						var reason = "";
						if (typeof(leaveBillColls[i].entries[0].reason) != "undefined") {
							reason = leaveBillColls[i].entries[0].reason;
						}
						var state = leaveBillColls[i].billState.alias;
						var rowi={};
						rowi.id=i+1;	//编号
						rowi.beginTime = beginTime;//开始时间
						rowi.endTime = endTime;//结束时间
						rowi.typeName = typeName;//事假
						rowi.length = length;//1
						rowi.unitType = unitType;//天
						rowi.reason = reason;//原因
						rowi.state = state;//审批状态
						rowi.applyDate = applyDate;//申请日期
						//rowi.name="5555";
						var regEx = new RegExp("\\-","gi");
						applyDate = applyDate.replace(regEx,"/");
						beginTime = beginTime.replace(regEx,"/");
						rowi.on= new Date(beginTime);//记录的是请假的开始时间
						ev_ev.push(rowi);
					}
					$('.gt-timeline').remove();
			        /*默认函数值*/
					/*groupEventWithinPx 参数是将显示在此范围内PX的共同提示事件，为了防止很近节点重叠问题。设置小点。
					  设置为0，框架默认值是6.完全重合的时候，才叠加。
					*/
					$('#longTimeLine').jqtimeline({
						events : ev_ev,
						numYears:1,
						gap : 55, 
						groupEventWithinPx : 0,
						startYear:yeargolbal
					
					});
			}//success end 
		});//remoteCall end 
	}
	
	,showViewMoreDialog:function(){
	 	$("#dialogViewMore").dialog({
	 		autoOpen: true,
			title: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_25,
			width:  850,
			height: 550,
			modal: true,
			resizable: true,
			position: {
				my: 'center',
				at: 'top+47%',
				of: window
			}
		});
	}
	//dialog框 加载前一年的请假单数据
	,loadPreLeaveBillDatas : function(){
		var that = this ;
		yearGolbal = yearGolbal - 1 ;
		that.ajaxLoadAllLeaveBillDatas(yearGolbal);
	}
	//dialog框 加载后一年的请假单数据
	,loadNextLeaveBillDatas : function(){
		var that = this ;
		yearGolbal = yearGolbal + 1 ;
		that.ajaxLoadAllLeaveBillDatas(yearGolbal);
	}
	//请假长度可否编辑
	,isLeaveLengthEdit : function(){
		var that = this ;
		if (that.getOperateState() != 'VIEW'){
			//集团管控后，personId其实是档案历史id
			var personId =  $("#entries_person_el").val();	
			if(personId==null||personId==""){
				shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_38});
				return;
			}
			that.remoteCall({
				type:"post",
				method:"isLeaveLengthEdit",
				param:{personId:personId},
				async: true,
				success:function(res){
					var info = res;
					if(info.errorString){
						shr.showWarning({message: info.errorString});
					}else{
						if(info.editable=='true'){
							$("#entries_leaveLength").removeAttr('readonly').removeAttr('disabled');
							$("#entries_leaveLength").parent().removeClass("disabled");
						}else{
							$("#entries_leaveLength").attr("readonly","readonly");
							$("#entries_leaveLength").parent().addClass("disabled");
						}
					}
				}
			});
		}
	}
	
	/**
	 * 	  加载所有的假期类型<br/>
	 * 1. 假勤项目ID 是 FAttendCatalogID ='00000000-0000-0000-0000-000000000002BE0D0183'<br/>
	 * 2. FHROrgUnitID is null or FHROrgUnitID=jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_12<br/>
	 * 3. FEnable = 1 启用状态的<br/>
	 */
	,loadTimeAttendanceType : function(){
		var that = this ;
		//如果新增或者编辑页面,直接从后台返回该人员的可用年假
		if (that.getOperateState() != 'VIEW') {
			//先将假期类型框清空
			$("#message_holidayType").html("");
			$("#attend_type").hide();
			//集团管控后，personId其实是档案历史id -- ???什么意思???
			var personId =  $("#entries_person_el").val();
			var hrOrgUnitId =  $("#hrOrgUnit_el").val();
			var beginTime = "",endTime = "";
			beginTime =  atsMlUtile.getFieldOriginalValue("entries_beginTime");
			endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
			if(!hrOrgUnitId || !personId){
				return;
			}
			_attendanceFileMark = "";
			that.remoteCall({
				type:"post",
				method:"getTimeAttendanceType",
				param:{
					personId : personId,
					startTime : beginTime,
					endTime : endTime,
					hrOrgUnitId : hrOrgUnitId,
					holidayFileHisId : holidayFileHisId//如果业务组织、人员、请假开始结束时间都没变，后台就不用重新查假期档案历史
				},
				async: true,
				success:function(res){
					var info = res;
					holidayFileHisId = info.holidayFileHisId;
					if(info.errorString){
						_attendanceFileMark = info.errorString;
						shr.showWarning({message: info.errorString});
					}else{
						that.initTableAndDiv(info);
						that.initStartAndEnd();
					}
				}
			});
		}else if (that.getOperateState() == 'VIEW') {
			$("#attend_type").show();
			$("#entries_policy_holidayType").closest("div[data-ctrlrole='labelContainer']").hide();
			//获取当前单据的人员ID 查询该人员的可用年假
		}
	}
	//初始化假期类型框框信息,包括名称,单位,额度
	,initTableAndDiv : function(info){
		var that = this ;
		var attendColl = JSON.parse(info.timeAttendanceCollection);
		var size = info.timeAttendanceCollectionSize;
		var remainValue = info.timeAttendRemainValue;//年假的剩余额度
		//年假剩余额度赋给隐藏域 在保存的时候做判断使用
		$("#entries_msgValue").val(remainValue);
		$("#message_holidayType").html("<table ><tr> <td id='info_mess' class='td_typeinfo'> </td></tr> </table> ");	
		 
		var td_div = "";
		for(var j = 0; j<size; j++){
			holidayPolicyId = attendColl[j].id;
			attendTypeId = attendColl[j].holidayType.id;
			attendTypeName = attendColl[j].name;
			var leaveRemark = "" ;
			if(attendColl[j].remark){
				leaveRemark = attendColl[j].remark ;
			}
			var unitTypeName="";
			var unitTypeValue="";//保存的时候 做个校验???? 
			if (attendColl[j].unit != undefined) {
				unitTypeName = attendColl[j].unit.alias;
				unitTypeValue = attendColl[j].unit.value;
			}
			remainValue_mess = "";
			 vacationRemain = info.vacationRemain;
			  freeRemain = info.freeRemain;
			var proposerId =  $('#entries_person_el').val();
			var hrOrgUnitId = $("#hrOrgUnit_el").val();
			
			//循环map
			for (var prop in vacationRemain) {
				if (vacationRemain.hasOwnProperty(prop) && prop==attendTypeId) {
					remainValue_mess = "<font class='remain_info'  onclick='showHolidayLimit("
					+"\""+proposerId+"\",\""+hrOrgUnitId+"\",\""+holidayPolicyId+"\")' "
					+ (vacationRemain[prop] ? ">" : "style='display:none;'>")
					+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_45 
					+ "[<span class='remain_info_params'>"+ vacationRemain[prop]  +"</span>]"+"," 
					+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_60 
					+ "[<span class='remain_info_params'>"+freeRemain[prop]+"</span>]</font>";
				}  
			}  
			
			td_div = td_div + "<div id='div"+j+"' " + ( j >= 4 ? "style='display:none'" : "")
							+ " title = '"+leaveRemark+"' class='div_blockinfo' onclick='changeColor("
							+ j + ","+size+",\""+holidayPolicyId+"\",\""+attendTypeId+"\",\""+attendTypeName
							+ "\",\""+unitTypeName+"\",\""+unitTypeValue
							+ "\")'><font class='attendTypeName_info'>"
							+ attendTypeName+"</font>&nbsp;&nbsp;("
							+ unitTypeName+" )<br/> "+remainValue_mess+"</div>"
		}
		// 更多按钮
		if(size>4){
			td_div = td_div  + 
			"<div id='div"+(size)+"' class='div_blockinfo' class='attendTypeName_info'><div style='font-size: 16px;'>" 
			+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_23 
			+ "&gt;&gt;</div> </div>"
		}
		$("#info_mess").html(td_div);
		
		for(var i = 0;i<size ; i++){
			$('#div'+ i).bind('click',function(){
				atsMlUtile.setTransNumValue("entries_leaveLength",'');
				//重新计算请假时长
				that.getRealLeaveLengthOfDay();
			});
		}
		//审核界面为编辑状态时
		if(that.isFromWF() && that.getOperateState() == 'EDIT' &&  $("#billState").val() != 0){
			$("#info_mess .div_blockinfo").attr("onclick","").css("cursor","default");
		}
		
		// 注册更多按钮事件
		$('#div'+(size)).bind('click',function(){
			for(var i = 4;i<size;i++ ){
				// 显示大于4的假期类型
				$('#div'+i).attr('style','display:block');
			}
			//隐藏更多按钮
			$('#div'+(size)).attr('style','display:none');
		
			if(that.isFromWF() && that.getOperateState() == 'EDIT' && $("#billState").val() != 0){
				$("#info_mess .div_blockinfo").attr("onclick","").css("cursor","default");
			}
			//设置默认假期类型
			that.setAttendTypeDefault(attendColl,size,unitTypeName);
		});
		//首次进来 设置默认选中年休假 这个假期类型
		that.setAttendTypeDefault(attendColl,size,unitTypeName);//所有假期类型集合,集合大小
		
	}
	/**
	 * 初始化设置假期默认年假的假期类型
	 * 再写个方法 返回所有的假期 类型 ----放在json里
	 * unitTypeName:假期类型名称
	 */
	,setAttendTypeDefault:function(attendColl,size,unitTypeName){
		var that = this ;
		if (that.getOperateState() == 'ADDNEW') {
			  for(var i=0; i<size; i++){ 
		  		if(attendColl[i].holidayType.id == attendColl[0].holidayType.id){
		  		holidayPolicyId = attendColl[i].id;
				attendTypeId = attendColl[i].holidayType.id;
				attendTypeName = attendColl[i].name;
				var unitTypeName="";
				var unitTypeValue="";
				if (attendColl[i].unit != undefined) {
					unitTypeName = attendColl[i].unit.alias;
					unitTypeValue = attendColl[i].unit.value;
				}
  			  changeColorDefault(0,size,attendColl,holidayPolicyId,attendTypeId,attendTypeName,unitTypeName,unitTypeValue);
			  }
			}
		}else if(that.getOperateState() == 'EDIT'){
			var temp = 0;
			for(var i=0; i<size; i++){
				  if($("#entries_policy").val()==attendColl[i].name){
					  temp = 1;
				  	holidayPolicyId = attendColl[i].id;
					attendTypeId = attendColl[i].holidayType.id;
					attendTypeName = attendColl[i].name;
					var unitTypeName="";
					var unitTypeValue="";//保存的时候 做个校验???? 
					if (attendColl[i].unit != undefined) {
						unitTypeName = attendColl[i].unit.alias;
						unitTypeValue = attendColl[i].unit.value;
					}
				   changeColorDefault(0,size,attendColl,holidayPolicyId,attendTypeId,attendTypeName,unitTypeName,unitTypeValue);
			  }
			}
			if(temp==0){
				$("#entries_policy").attr('value','');
				shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_39}); 
			}
		}
	}
	,setLeaveLengthUnit:function(){
		var that = this ;
		var unit_info = "<div class='appendUnit'>" 
			+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_52 
			+ "</div>";
		$("#entries_leaveLength").parents(".ui-text-frame").append(unit_info);
		if (that.getOperateState() == 'ADDNEW') {
			//默认填充单位天
		}else if (that.getOperateState() == 'EDIT') {
			$(".appendUnit").html($("#entries_remark").val());
		}else if (that.getOperateState() == 'VIEW') {
			var unit_view_info = "<span class='appendUnit_ViewPage'></span>";
			$("#entries_leaveLength").parents(".span3").append(unit_view_info);
			$(".appendUnit_ViewPage").html($("#entries_remark").val());
		}
	}
	
	
	
	/**
	 * 初始化人员的额度信息
	 */
	,initPersonalHolidayLimit : function(){
		var that = this ;
		var wenxin_tip = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_54;
		$("#message_info").addClass('message_info');
		//集团管控后，personId其实是档案历史id
		var personId = $('#entries_person_el').val() ||  $('#entries_person').val();
		var hrOrgUnitId =  $("#hrOrgUnit_el").val() || $("#hrOrgUnit").val();
		if(!personId || !hrOrgUnitId){
			return;
		}
		var billNumber=$('span#number').attr('original-value');
		that.remoteCall({
			type:"post",
			method:"getLeaveTimesAndDateInfo",
			param:{personId:personId,hrOrgUnitId:hrOrgUnitId,billNumber:billNumber},
			success:function(res){
				var info = res;
				if(info == null){
					return ;
				}
				if(!info.hasOwnProperty("personName")){return;}
				var leaveDate = info.lastLeaveDate;
				var personShowName = "";
				if($('#breadcrumb').attr('id')!='breadcrumb'){
					if($('#entries_person').attr('title')==null
						||$('#entries_person').attr('title')==""){
						personShowName = $('#entries_person').text();
					}else{
						personShowName = $('#entries_person').attr('title');
					}
				}else{
					if ($("#bill_flag").val() != "commissioner") {
						personShowName = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_20;
					}else if ($("#bill_flag").val() == "commissioner") {
						if($('#entries_person').attr('title')==null
						||$('#entries_person').attr('title')==""){
						personShowName = $('#entries_person').text();
						}else{
						personShowName = $('#entries_person').attr('title');
						}
					}
				}
				if (leaveDate != "") {
					leaveDate = leaveDate.substr(0,10);
					var leaveTimes = info.leaveTimes;
					if (leaveTimes == 0) {
						var mes = "&nbsp;&nbsp; "+wenxin_tip+"：" 
							+ shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_7,[
								personShowName , "<font id='leaveDes'>", leaveTimes, "</font>，",
								"<font id='leaveDes_Time'> "+leaveDate + "</font> "
							]);
					}else if (info.leaveAuditMidTimes > 0 || info.leaveNotAuditTimes > 0) {
						//info.data.personName
						var mes = "&nbsp;&nbsp; "+wenxin_tip+"：" 
							+ shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_7 ,[
								personShowName, "<font id='leaveDes'>", leaveTimes, "</font>，",
								"<font id='leaveDes_Time'>"+leaveDate+"</font>"
							]);
					}else{
						var mes = "&nbsp;&nbsp; "+wenxin_tip+"：" 
							+ shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_6 ,[
								 personShowName, "<font id='leaveDes'>", leaveTimes , "</font>，",
								"<font id='leaveDes_Time'>"+leaveDate+"</font> "
							]);
					}

					$("#show_info").html("");
					$("#show_info").append(mes);
					$("#leaveDes").addClass('leaveDes');
					$("#leaveDes_Time").addClass('leaveDes_Time');
				}else{
					//info.data.personName
					var mes = "&nbsp;&nbsp; "+wenxin_tip+"： " 
					+ shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_5 ,[
							personShowName, "<font id='leaveDes'>", info.leaveTimes
						])
					+ "</font>" 
					$("#show_info").html("");
					$("#show_info").append(mes);
					$("#leaveDes").addClass('leaveDes');
				}
			}
		});
		//如果是查看界面,这里不显示"温馨提示"
		if (that.getOperateState() == 'VIEW') {
			$("#message_head").hide();
		}
		
		//判断页面来源  来自于审核页面 特殊处理
		if(that.isFromWF()){
			$("#message_head").show();
		}
		if(that.isFromWF()){
			
			var personId ;
			var holidayPolicyId;
			var billId ;
			if(that.getOperateState() == "VIEW")
			{
				personId = $('#entries_person').val();
				holidayPolicyId = $('#entries_policy').val();
				billId = $('#id').val();
			}else if(that.getOperateState() == "EDIT"){
				personId = $('#entries_person_el').val();
				holidayPolicyId = $('#entries_policy_el').val();
				billId = $('#id').val();
			}
			that.remoteCall({
				type:"post",
				async: false,
				method:"validateIsControlHolidayInfo",
				param:{holidayPolicyId:holidayPolicyId},
				success:function(res){
					var message  =  res.Validate;
					
					if(message == "TRUE")
					{ 
						var info = that.getRealAndRemainLimit(personId,holidayPolicyId,billId);
						$('#entries_policy').closest(".span3").eq(0).attr('style','width:400px');	
						$('#entries_policy').append('(' 
								+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_64
								+ info.realLimit+''+info.unit
								+',' 
								+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_46
								+info.remainLimitWithoutLeaveLength+''+info.unit
								+',' 
								+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_61
								+info.freezeLimit+''+info.unit+')');
					}
				}
			});
	
			
		}
	
	}
	
	
	/**
	 * 初始化人员的请假次数信息和上次的请假时间 					<br/>
	 * 查看更多写在里边会有问题,因为这个时候dom还没有初始化完全 	<br/>
	 * 绑定click事件 无效果	
	 */
	,initPersonalLeaveMess : function(){
		var that = this ;
		var wenxin_tip = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_54;
		$("#message_info").addClass('message_info');
		//集团管控后，personId其实是档案历史id
		var personId = "";
		if($('#entries_person_el').val()!=null&&$('#entries_person_el').val()!=""){
		 personId = $('#entries_person_el').val();
		}
		var hrOrgUnitId =  $("#hrOrgUnit_el").val();
		if(hrOrgUnitId==null || hrOrgUnitId==""){
			hrOrgUnitId=$("#hrOrgUnit").val();
			if(hrOrgUnitId==null || hrOrgUnitId==""){
//				shr.showWarning({message: "请选择假期组织！"});
				return;	
			}	
		}
		if(personId == ""){
			return;
		}
		that.remoteCall({
			type:"post",
			method:"getLeaveTimesAndDateInfo",
			param:{personId:personId,hrOrgUnitId:hrOrgUnitId},
			success:function(res){
				var info = res;
				if(info == null){
					return ;
				}
				if(!info.hasOwnProperty("personName")){return;}
				//alert(JSON.stringify(info));
				var leaveDate = info.lastLeaveDate;
				
				var personShowName = "";
					if($('#breadcrumb').attr('id')!='breadcrumb'){
					if($('#entries_person').attr('title')==null
						||$('#entries_person').attr('title')==""){
						personShowName = $('#entries_person').text();
						}else{
						personShowName = $('#entries_person').attr('title');
						}
					}else{
					if ($("#bill_flag").val() != "commissioner") {
						personShowName = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_20;
					}else if ($("#bill_flag").val() == "commissioner") {
						if($('#entries_person').attr('title')==null
						||$('#entries_person').attr('title')==""){
						personShowName = $('#entries_person').text();
						}else{
						personShowName = $('#entries_person').attr('title');
						}
					}
					}
					
				if (leaveDate != "") {
					leaveDate = leaveDate.substr(0,10);
					var leaveTimes = info.leaveTimes;
					
					
		
					if (leaveTimes == 0) {
						var mes = "&nbsp;&nbsp; "+wenxin_tip+"： " 
							+ shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_7 ,[
								personShowName, "<font id='leaveDes'>", leaveTimes, "</font>，",
								"<font id='leaveDes_Time'> "+leaveDate+"</font> "
							]); //+
					}else if (info.leaveAuditMidTimes > 0 || info.leaveNotAuditTimes > 0) {
						var mes = "&nbsp;&nbsp; "+wenxin_tip+"：" 
							+ shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_7 ,[
								//"其中 未审核单据"+info.data.leaveNotAuditTimes+"条，审核中单据"+info.data.leaveAuditMidTimes+"条，" +
								//"审核完成单据"+info.data.leaveAuditCompleteTimes+"条，" +
								personShowName, "<font id='leaveDes'>", leaveTimes, "</font>，",
									"<font id='leaveDes_Time'>"+leaveDate+"</font> "
							]);
					}else{
						//info.data.personName
						var mes = "&nbsp;&nbsp; "+wenxin_tip+"： " 
							+ shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_7,[
							//"全部审核通过，" +
								personShowName, "<font id='leaveDes'>", leaveTimes, "</font>，",
								"<font id='leaveDes_Time'>"+leaveDate+"</font> "
							]);
					}

					$("#show_info").html("");
					$("#show_info").append(mes);
					$("#leaveDes").addClass('leaveDes');
					$("#leaveDes_Time").addClass('leaveDes_Time');
				}else{
					//info.data.personName
					var mes = "&nbsp;&nbsp; "+wenxin_tip+"： " 
					+ shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_5,[
							personShowName, "<font id='leaveDes'>", info.leaveTimes
						])
					+ "</font>" 
					$("#show_info").html("");
					$("#show_info").append(mes);
					$("#leaveDes").addClass('leaveDes');
				}
			}
		});
		//如果是查看界面,这里不显示"温馨提示"
		if (that.getOperateState() == 'VIEW') {
			$("#message_head").hide();
		}
		
		//判断页面来源  来自于审核页面 特殊处理
		if(that.isFromWF()){
			$("#message_head").show();
		}
		
		if(that.isFromWF()){
			
			var personId ;
			var holidayPolicyId;
			var billId ;
			if(that.getOperateState() == "VIEW")
			{
				personId = $('#entries_person').val();
				holidayPolicyId = $('#entries_policy').val();
				billId = $('#id').val();
			}else if(that.getOperateState() == "EDIT"){
				personId = $('#entries_person_el').val();
				holidayPolicyId = $('#entries_policy_el').val();
				billId = $('#id').val();
			}
			that.remoteCall({
				type:"post",
				async: false,
				method:"validateIsControlHolidayInfo",
				param:{holidayPolicyId:holidayPolicyId},
				success:function(res){
					var message  =  res.Validate;
					
					if(message == "TRUE")
					{ 
						var info = that.getRealAndRemainLimit(personId,holidayPolicyId,billId);
						$('#entries_policy').closest(".span3").eq(0).attr('style','width:400px');	
//						$('#entries_policy').append('(总额度：'+info.realLimit+''+info.unit+',剩余额度：'+info.remainLimit+''+info.unit+')');
						$('#entries_policy').append('('
							+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_64
							+info.realLimit+''+info.unit+','
							+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_46
							+info.remainLimit+''+info.unit+','
							+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_61
							+ info.freezeLimit+')'
						);
					}
				}
			});
		}
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
		$("#createBatch").html("创建多条单据");
		var billState = $("#billState").val();
		if (billState) {
			if (billState==3 ||
					jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_43==billState ||
					billState ==4||
					jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_42==billState ||
					billState ==2||
					jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_44==billState ) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1==billState ||
					jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_53== billState ||
					2 == billState ||
					jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_44==billState ) { //未审批或审批中
				if(!this.isFromWF()){
					$("#edit").hide();
					$("#submit").hide();
					$("#submitEffect").hide();
				}
			}
		}
		if (this.getOperateState().toUpperCase() == 'VIEW') { //查看状态下不允许提交
			$("#submit").hide();
			$("#submitEffect").hide();
			if(billState == 0)
			{
		         $("#submit").show();
		    }
		}
		//如果是工作流打回,界面上的"返回请假列表"不显示
		if (this.isFromWF()) {
			$("#returnToLeaveBillList").hide(); 
			$("#cancel").hide(); 
		}
		//增加员工编码,再流程审批的时候显示员工编码
		$("#entries-person-number").hide();
		if (this.isFromWF()) {
			$("#entries-person-number").show();
		}
		if (this.getOperateState().toUpperCase() == 'ADDNEW' || this.getOperateState().toUpperCase() == 'EDIT' ) {
			$("#returnToLeaveBillList").hide();
		}
	}
	
	//获取请假单下边的请假确认单信息
	,getCancelLeaveBillInfo:function(){
		var that = this;
		//var billId = $("#id").val();//请假单的id
		var billId = $('form').find('input[id^=id]').val(); // 为了在专员看板能访问id 
		that.remoteCall({
			type:"post",
			method:"getCancelLeaveBillInfoById",
			param:{billId:billId},
			success:function(res){
				that.showCancelLeaveBillInfo(res);
			}
		});
	}
	
	//展示请假确认单的信息
	,showCancelLeaveBillInfo:function(res){
		if (res.cancelLeaveBillCollSize > 0) {
			$("#cancelLeaveBillInfoDes").show();	
		}
		var infoColl = JSON.parse(res.cancelLeaveBillColl);
		var size = res.cancelLeaveBillCollSize;
		var html = '';
		for (var i = 0; i < size; i++) {
			
			html +='<h5 class="groupTitle">' 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_28 
				+ '</h5>';
			html += '<div class="row-fluid row-block " id="">';
			html += '<div data-ctrlrole="labelContainer">';
			html += '<div class="col-lg-4">';
			html += '<div class="field_label">' 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_48 
				+ '</div>';
			html += '</div>';				
			html += '<div class="col-lg-6 field-ctrl">';
			html += '<span class="field_input">'+infoColl[i].realLeaBeginTime+'</span>';
		
			html += '</div>';
			html += '<div class="col-lg-2 field-desc"></div>';
			html += '</div>';
	
			html += '<div data-ctrlrole="labelContainer">';
			html += '<div class="col-lg-4">';
			html += '<div class="field_label">' 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_47 
				+ '</div>';
			html += '</div>';				
			html += '<div class="col-lg-6 field-ctrl">';
			html += '<span class="field_input">'+infoColl[i].realLeaEndTime+'</span>';
			html += '</div>';
			html += '<div class="col-lg-2 field-desc"></div>';
			html += '</div>';
	  		html += '</div>'; 
		
			html += '<div class="row-fluid row-block " id="">';
			html += '<div data-ctrlrole="labelContainer">';
			html += '<div class="col-lg-4">';
			html += '<div class="field_label">' 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_49 
				+ '</div>';
			html += '</div>';				
			html += '<div class="col-lg-6 field-ctrl">';
			html += '<span class="field_input">'+infoColl[i].cancelLeaveLength+' '+infoColl[i].remark+'</span>';
	
			html += '</div>';
			html += '<div class="col-lg-2 field-desc"></div>';
			html += '</div>';
	
			html += '<div data-ctrlrole="labelContainer">';
			html += '<div class="col-lg-4">';
			html += '<div class="field_label">' 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_29 
				+ '</div>';
			html += '</div>';				
			html += '<div class="col-lg-6 field-ctrl">';
			html += '<span class="field_input">'+infoColl[i].bill.applyDate.substring(0,10)+'</span>';
			html += '</div>';
			html += '<div class="col-lg-2 field-desc"></div>';
			html += '</div>';
	  		html += '</div>'; 
		    
		    
		}
		$("#cancelLeaveBillInfoDes").html(html);
	}
	
	//请假时间改变  绑定 事件
	,leaveTimeChangeDealOfDay:function(){
		var that = this;
		$("#entries_beginTime").change(function(){
			 that.changeOverHrOrgUnit();
		});
	}/*
		当改变时间时动态改变剩余额度
	*/
	,getRemainLimit:function(){
		var that = this;
		var personId =  $("#entries_person_el").val();
		var beginTime = "",endTime = "";
		beginTime = atsMlUtile.getFieldOriginalValue("entries_beginTime");
		endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
		if(!beginTime){
			beginTime = endTime;
		}
		else if(!endTime){
			endTime = beginTime;
		}
		var hrOrgUnitId =  $("#hrOrgUnit_el").val() || $("#hrOrgUnit").val();
		if(!hrOrgUnitId){
			shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_35});
			return;	
		}
		
		if(personId==null||personId==""){
			shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_37});
			return;
		}
		
		that.remoteCall({
			type:"post",
			method:"getTimeAttendanceType",
			param:{personId:personId,startTime: beginTime, endTime: endTime,hrOrgUnitId:hrOrgUnitId},
			async: true,
			success:function(res){
				if(info.errorString){
					shr.showWarning({message: info.errorString});
				}else{
					that.changeTableAndDiv(res);
				}
		}
		});
	}
	,changeTableAndDiv: function(res){
	    if(!res){return}
		var vacationRemain = res.vacationRemain;
		var freeRemain = res.freeRemain;
		for(var i=0;i <$('div[id^="div"]').size();i++){
			var divObject = $($('div[id^="div"]').eq(i));
			var fontObject = divObject.find(".remain_info");
			var indexOfProp = divObject.attr("onclick");
			var  hasProp = false;
			if(indexOfProp){
				for (var prop in vacationRemain){
					if(indexOfProp.indexOf(prop) > -1){
						hasProp = true ;
						if(vacationRemain[prop] == ''){
							fontObject.css('display','none')
						}else{
							fontObject.css('display','inline');
						    var newString = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_45 
						    	+ "[<span class='remain_info_params'>"+ vacationRemain[prop]  +"</span>]"+"," 
						    	+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_60 
						    	+ "[<span class='remain_info_params'>"+freeRemain[prop]+"</span>]";
							if(fontObject.length != 0){
								fontObject.html(newString);    
							}else{
							    divObject.append("<font class='remain_info'>"+newString +"</font>");
							}
						}
						break;
					}
				}
			}
			if(!hasProp && this.uipk !="com.kingdee.eas.hr.ats.app.AtsLeaveBillFormWorkflow"){
				if(fontObject.length != 0){
					fontObject.text("");
				}else{
					divObject.append("<font class='remain_info'></font>");
				}
			}	
		}
	}
	
	
	// 通过 公休日 法定节假日 获得 除去非工作日的实际时长  （天）
	,getRealLeaveLengthOfDay:function(){
	    var that = this;
		var personId = $("#entries_person_el").val();
		if(personId==null||personId==""){
			shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_37});
			return;
		}
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		
		var beginTime = atsMlUtile.getFieldOriginalValue("entries_beginTime");
		var	endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
		if(!beginTime || !endTime){
			return false;
		}
		var beginDate = beginTime.substring(0,10);
		var endDate = endTime.substring(0,10);
		var billId =  $("#id").val();
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		var policyId = $("#entries_policy_el").val();//假期制度的ID 
		var holidayTypeId = $("#entries_policy_holidayType_el").val();//假期分类ID
		var leaveLength = parseFloat( atsMlUtile.getFieldOriginalValue("entries_leaveLength"));
		//新增哺乳假，半天假和非半天假计算方式不变
		var bfTypeId = $("#entries_bFType_el").val();
		if (holidayTypeId == bfHolidayTypeId && bfTypeId != "" && bfTypeId != customizeBF) {
			that.remoteCall({
				type: "post",
				async: false,
				method: "getRealLeaveLengthInfo",
				param: {
					personId: personId,
					bfTypeId: bfTypeId,
					beginTime: beginTime,
					endTime: endTime,
					billId: billId,
					holidayTypeId: holidayTypeId,
					hrOrgUnitId: hrOrgUnitId,
					isElasticCalLen: $("#entries_isElasticCalLen").shrCheckbox("isSelected")
				},
				success: function (res) {
					info = res;
					if (info.errorString) {
						shr.showError({
							message: info.errorString
						});
					} else {
						var day = parseFloat(info.leaveBillDays);
						day = day.toFixed(atsMlUtile.getSysDecimalPlace());						
						atsMlUtile.setTransNumValue("entries_leaveLength",day);
						$("#entries_realLeaveLength").val(day);
					}
				}
			});
		} else if(_isHalfDayOff){
		 	
		 	 if(beginTime.indexOf(_defaultAmBeginTime) > 0){
		 	 	beginTime = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_40
		 	 }else{
		 	 	beginTime = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_56
		 	 };
		 	 if(endTime.indexOf(_defaultAmEndTime) > 0){
		 	 	endTime  =  jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_40
		 	 }else{
		 	   endTime   = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_56
		 	 };
			that.remoteCall({
				type:"post",
				async: false,
				method:"getRealLeaveLengthOfDay",
				param:{
					personId:personId,
					beginDate:beginDate,
					endDate:endDate,
					beginTime:beginTime,
					endTime:endTime,
					billId:billId,
					holidayTypeId:holidayTypeId,
					hrOrgUnitId:hrOrgUnitId
				},
				success:function(res){
					info =  res;
					var day = parseFloat(info.leaveBillDays);
					day = day.toFixed(atsMlUtile.getSysDecimalPlace());
					atsMlUtile.setTransNumValue("entries_leaveLength",day);
					$("#entries_realLeaveLength").val(day);
				}
			});
		}else{
		 	that.remoteCall({
				type:"post",
				async: false,
				method:"getRealLeaveLengthInfo",
				param:{
					personId:personId,
					beginTime:beginTime,
					endTime:endTime,
					billId:billId,
					bfTypeId: bfTypeId,
					holidayTypeId:holidayTypeId,
					hrOrgUnitId:hrOrgUnitId,
					isElasticCalLen:$("#entries_isElasticCalLen").shrCheckbox("isSelected")
					},
				success:function(res){
					info =  res;
					if(info.errorString){
						shr.showError({message: info.errorString});
					}else{
						var day = parseFloat(info.leaveBillDays);
						day = day.toFixed(atsMlUtile.getSysDecimalPlace());
						atsMlUtile.setTransNumValue("entries_leaveLength",day);
						$("#entries_realLeaveLength").val(day);
					}
				}
			});
		}
		
		
		
		
	}
	,getRestDayAndLegalHoliday:function(){
	    var that = this;
		//获取请假的时间包含的公休日和法定节假日 的时间
		var personId = $("#entries_person_el").val();
		//龙光需求 请假时间为上午下午 时  请假开始结束时间取法
		var beginTime = atsMlUtile.getFieldOriginalValue("entries_beginTime");
		var endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
		var billId =  $("#id").val();
		var policyId = $("#entries_policy_el").val();//假期制度的ID 
		var holidayTypeId = $("#entries_policy_holidayType_el").val();//假期分类ID
		var leaveLength = parseFloat( atsMlUtile.getFieldOriginalValue("entries_leaveLength"));
		if(beginTime && endTime){
		 	that.remoteCall({
			type:"post",
			async: false,
			method:"getRestDayAndLegalHoliday",
			param:{personId:personId,beginTime:beginTime,endTime:endTime,billId:billId,holidayTypeId:holidayTypeId},
			success:function(res){
				info =  res;
				var day = parseFloat(info.leaveBillLength)/1000.0/60/60/24;
				day = day.toFixed(atsMlUtile.getSysDecimalPlace());
				atsMlUtile.setTransNumValue("entries_leaveLength",day);
				atsMlUtile.setTransNumValue("entries_realLeaveLength",day);
			}
		});
		}
		
		
	}
	,getSplitString:function(val){
		
		var attr = val.split("-");
		var monthStr = attr[1];
		var dayttr = attr[2].split(" ");
		var dayStr = dayttr[0];
		var hour = dayttr[1].split(":")[0];
		
		if(parseInt(monthStr) < 10){
			monthStr = "0"+monthStr;
		}
		if(parseInt(dayStr) < 10){
			dayStr = "0"+dayStr;
		}
		if(parseInt(hour) < 10){
			hour = "0"+hour;
		}
		return attr[0]+"-"+monthStr+"-"+dayStr+" "+hour+":00:00";
	}
	
	,verifyView: function(actionType){
		var that = this;
		var holidayTypeId = $("#entries_policy").val();
		var bfType= $("#entries_bFType").val();
		var beginTime = that.getSplitString(atsMlUtile.getFieldOriginalValue("entries_beginTime"));
		var endTime = that.getSplitString(atsMlUtile.getFieldOriginalValue("entries_endTime"));
		var personId  = $("#entries_person").val();
		var leaveLength = atsMlUtile.getFieldOriginalValue("entries_leaveLength").replace(/[^0-9.]/ig,"");			
		var regEx = new RegExp("\\/","gi");
		var billId = $("#id").val();
		var operateState = that.getOperateState();
		beginTime = beginTime.replace(regEx,"-");
		endTime = 	endTime.replace(regEx,"-");
		var info_res ;
		
		//前置假校验
		info_res = that.validatePreHolidayType(personId,beginTime,endTime,holidayTypeId);
		if(info_res!=null&&info_res.errorString!="")
		{
			shr.showError({message: info_res.errorString});
			return false;
		}
		
		that.remoteCall({
			type:"post",
			async: false,
			method:"validateLeaveBillCycle",
			param:{personId:personId,beginTime:beginTime,endTime:endTime,holidayTypeId:holidayTypeId,leaveLength:leaveLength,billId:billId,pageUipk:pageUipk,operateState:operateState,bfType:bfType},
			success:function(res){
				info_res =  res;
			}
		});
		
		if(info_res!=null&&info_res.errorString!="")
		{
			shr.showInfo({message: info_res.errorString });
			return false;
		}

		var info_res = that.validateHolidayPolicyControl(personId,holidayTypeId,beginTime,endTime,leaveLength);
		if(info_res!=null&&info_res.errorString!="")
		{
			shr.showInfo({message: info_res.errorString });
			return false;
		}
		return true;
	}
	/**
	 * 验证,校验方法 
	 * 保存前各种验证方法
	 * 保存请假单之前需要做比较多的控制
	 * 需要按照假期制度的参数来控制请假单的提交逻辑
	 */
	,verify:function(actionType){
		var that = this;
		if(that.getOperateState() == 'VIEW'){
			return that.verifyView(actionType);
		}
		var holidayTypeId = $("#entries_policy_holidayType_el").val();
		//哺乳假类型非自定义时校验时间
		if (holidayTypeId == bfHolidayTypeId) {
			var msg = "";
			!$("#entries_bFType_el") && (msg = "请选择哺乳假类型，保存失败！");
			if ($("#entries_bFType_el").val() != customizeBF) {
				var childbirthday = atsMlUtile.getFieldOriginalValue("entries_childbirthday");
				var mlEndTime = atsMlUtile.getFieldOriginalValue("entries_mLEndTime");
				var beginTime = atsMlUtile.getFieldOriginalValue("entries_beginTime");
				var endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
				if (!msg && beginTime && mlEndTime && new Date(mlEndTime) >= new Date(beginTime)) {
					msg = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_68;
				}			
				if(childbirthday && endTime){
					var date1 = new Date(childbirthday);
					var date2 = new Date(endTime);
					date1 = date1.addMonths(12);
					date1 = date1.addDays(1);
					if (!msg && date1 < date2) {
						msg = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_69;
					}
					if(!msg && beginTime && new Date(childbirthday) > new Date(beginTime)){
						msg = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_70;
					}
				}
			}
			if (msg) {
				shr.showInfo({message: msg});
				return false;
			} 
		}
		var existHolidayType = $("#entries_policy").val();
		//判断是否有选中的假期类型
		if(existHolidayType==""||existHolidayType==null){
			shr.showInfo({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_36}); 
			return false;
		}
		//判断某人 再开始时间和结束时间之内有没有重复的请假单
		var personId = $("#entries_person_el").val();
		var holidayTypeId = $("#entries_policy_holidayType_el").val();
		var bfTypeId = $("#entries_bFType_el").val();
		var beginTime = atsMlUtile.getFieldOriginalValue("entries_beginTime");
		var endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
		if (holidayTypeId == bfHolidayTypeId && bfTypeId != "" && bfTypeId != customizeBF) {
			//哺乳假需求
			beginTime = beginTime + " 00:00:00";
			endTime = endTime + " 00:00:00";
		} 
		
		beginTime = beginTime.replace("\\-","/");
	 	endTime = 	endTime.replace("\\-","/");
		 
		var billId =  $("#id").val();
		if(that.getOperateState() == 'ADDNEW'){//附件设置了id导致后台校验报错，找不到单据
			billId = "";
		}
		var policyId = $("#entries_policy_el").val();//假期制度的ID 
		var holidayTypeId = $("#entries_policy_holidayType_el").val();//假期分类ID
		
		var leaveLength = parseFloat( atsMlUtile.getFieldOriginalValue("entries_leaveLength"));
	
	 	var beginTimeOfDate = new Date(beginTime); 
	 	var endTimeOfDate = new Date(endTime);
		var longTime = endTimeOfDate.getTime() - beginTimeOfDate.getTime();
		if (longTime <= 0) {
			if (holidayTypeId != bfHolidayTypeId || bfTypeId == "" || bfTypeId == customizeBF){
				shr.showWarning({
					message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_27
				});
				return false;
			}
		}
		if (leaveLength <= 0) {
			shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_33}); 
			return false;
		}
		if (longTime > 365 * 24 * 60 * 60 * 1000 ) {
			shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_32}); 
			return false;
		}
		if (holidayTypeId == bfHolidayTypeId && bfTypeId != "" && bfTypeId != customizeBF) {
			// 时间 通过排班 工作日历 计算后的实际时间
			var realLengthInfo;
			that.remoteCall({
				type: "post",
				async: false,
				method: "getRealLeaveLengthInfo",
				param: {
					personId: personId,
					beginTime: beginTime,
					endTime: endTime,
					bfTypeId: bfTypeId,
					holidayTypeId: holidayTypeId,
					hrOrgUnitId: hrOrgUnitId,
					isElasticCalLen: $("#entries_isElasticCalLen").shrCheckbox("isSelected")
				},
				success: function (res) {
					info = res;
					if (info.errorString) {
						shr.showError({
							message: info.errorString
						});
					} else {
						realLengthInfo = info;
					}
				}
			});
			if (realLengthInfo.leaveBillDays + realLengthInfo.segRest < leaveLength && (that._unitType == 1 || $("#entries_remark").val() == "天")) {
				shr.showError({
					message: "请假时间不能超过" + (realLengthInfo.wholeLen).toFixed(atsMlUtile.getSysDecimalPlace()) + "天"
				});
				return false;
			} else if (realLengthInfo.leaveBillDays + realLengthInfo.segRest < leaveLength && (that._unitType == 0 || $("#entries_remark").val() == "小时")) {
				shr.showError({
					message: "请假时间不能超过" + (realLengthInfo.wholeLen).toFixed(atsMlUtile.getSysDecimalPlace()) + "小时"
				});
				return false;
			}

		}
		//启动半天假
		else if(_isHalfDayOff){
			// 时间 通过排班 工作日历 计算后的实际时间
			 var realLengthInfo ;
			 var beginDateTemp = atsMlUtile.getFieldOriginalValue("entries_beginTime");
			 var endDateTemp =atsMlUtile.getFieldOriginalValue("entries_endTime");
			 var beginTimeTemp,endTimeTemp;
			 var hrOrgUnitId =  $("#hrOrgUnit_el").val()|| $("#hrOrgUnit").val();
			if(!hrOrgUnitId){
				shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_35});
				return;	
			}
			  if (beginDateTemp.indexOf(_defaultAmBeginTime) > 0){
					beginTimeTemp = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_40
			   }else{
					beginTimeTemp = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_56
			   };
			   if(endDateTemp.indexOf(_defaultAmEndTime) > 0){
					endTimeTemp  =  jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_40
			   }else{
				   endTimeTemp   = jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_56
			   };
			 that.remoteCall({
				type:"post",
				async: false,
				method:"getRealLeaveLengthOfDay",
				param:{personId:personId,beginDate:beginDateTemp.substring(0,10),endDate:endDateTemp.substring(0,10),beginTime:beginTimeTemp,endTime:endTimeTemp,billId:billId,holidayTypeId:holidayTypeId,hrOrgUnitId:hrOrgUnitId},
				success:function(res){
					realLengthInfo =  res;
				}
			 });
			 if(realLengthInfo.leaveBillDays < leaveLength ){
				
				if(that._unitType == 1 || $("#entries_remark").val()==jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_52)
				{
					shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_30, [realLengthInfo.leaveBillDays])}); 
					return false;
				}else if(that._unitType == 0 || $("#entries_remark").val()==jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_58){
				
					shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_31, [realLengthInfo.leaveBillDays])}); 
					return false;
				}
			}
		
		}else{
		// 时间 通过排班 工作日历 计算后的实际时间
			var realLengthInfo ;
			that.remoteCall({
				type:"post",
				async: false,
				method:"getRealLeaveLengthInfo",
				param:{personId:personId,
					beginTime:beginTime,
					endTime:endTime,
					holidayTypeId:holidayTypeId,
					hrOrgUnitId:hrOrgUnitId,
					bfTypeId: bfTypeId,
					isElasticCalLen:$("#entries_isElasticCalLen").shrCheckbox("isSelected")
				},
				success:function(res){
					info = res ;
					if(info.errorString){
						shr.showError({message: info.errorString});
					}else{
						realLengthInfo =  info;
					}
				}
			});
			if (realLengthInfo.leaveBillDays + realLengthInfo.segRest < leaveLength && (that._unitType == 1 || $("#entries_remark").val()==jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_52) ) {
				shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_30, [(realLengthInfo.wholeLen).toFixed(atsMlUtile.getSysDecimalPlace())])}); 
				return false;
			}else if(realLengthInfo.leaveBillDays + realLengthInfo.segRest < leaveLength && (that._unitType == 0 || $("#entries_remark").val()==jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_58) ){
				shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_31, [(realLengthInfo.wholeLen).toFixed(atsMlUtile.getSysDecimalPlace())])}); 
				return false;
			} 
			
		}
		    billId =  $("#id").val();
			var info_res = that.validateLeaveBillCycleNew(personId,beginTime,endTime,holidayTypeId,leaveLength,billId);
			if(info_res!=null&&info_res.errorString!=""){
				shr.showError({message: info_res.errorString });
			return false;
		}
		
		
		var info_res = that.validateHolidayPolicyControl(personId,holidayTypeId,beginTime,endTime,leaveLength);
			if(info_res!=null&&info_res.errorString!=""){
				shr.showError({message: info_res.errorString });
				return false;
			}
		
		var info ;
		var bfTypeId = $("#entries_bFType_el").val();
		if (holidayTypeId == bfHolidayTypeId && bfTypeId != "" && bfTypeId != customizeBF) {
			beginTime = atsMlUtile.getFieldOriginalValue('entries_beginTime');
			endTime = atsMlUtile.getFieldOriginalValue('entries_endTime');
		}		
		if(actionType == "submit"){
			that.remoteCall({
				type:"post",
				async: false,
				method:"getLeaveBillInfoByPersonIdAndLeaveTime",
				param:{personId:personId,beginTime:beginTime,endTime:endTime,billId:billId,holidayTypeId:holidayTypeId,bfTypeId: bfTypeId},
				success:function(res){
					info =  res;
				}
			});
		}
		
		var hrOrgUnitId =  $("#hrOrgUnit_el").val();
		if(hrOrgUnitId==null || hrOrgUnitId==""){
			hrOrgUnitId=$("#hrOrgUnit").val();
			if(hrOrgUnitId==null || hrOrgUnitId==""){
				shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_35});
				return;	
			}	
		}
		operateState = that.getOperateState();
	    var validateInfo;
		that.remoteCall({
			type:"post",
			async: false,
			method:"validateHrOrgUnitAndHolidayType",
			param:{personId:personId,beginTime: beginTime.length == 10 ? beginTime + " 00:00:00" : beginTime,endTime: endTime.length == 10 ? endTime + " 00:00:00" : endTime,holidayTypeId:holidayTypeId,leaveLength:leaveLength,billId:billId,pageUipk:pageUipk,operateState:operateState,hrOrgUnitId:hrOrgUnitId},
			success:function(res){
				validateInfo =  res;
			}
		});
		if(validateInfo!=null && validateInfo.errorString!=undefined && validateInfo.errorString!=""){
			shr.showError({message: validateInfo.errorString });
			return   false;
		}
		
	    if (info && info.addFlag > 0) {
		  shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_59,
				  [info.billNo, info.personName, info.realBeginDate, info.realendDate])});
		  return false;
		}
	    
		//校验前置假
		info_res = that.validatePreHolidayType(personId,beginTime,endTime,holidayTypeId);
		if(info_res!=null&&info_res.errorString!="")
		{
			shr.showError({message: info_res.errorString});
			return false;
		}
		return true;
	}
	
	,validateHolidayPolicyControl:function(personId,holidayTypeId,beginTime,endTime,leaveLength){
		var that = this;
		var info ;
		var bfTypeId = $("#entries_bFType_el").val();
		beginTime = atsMlUtile.getFieldOriginalValue('entries_beginTime');
		endTime = atsMlUtile.getFieldOriginalValue('entries_endTime');
		that.remoteCall({
			type:"post",
			async: false,
			method:"validateHolidayPolicyControl",
			param:{
				bfTypeId: bfTypeId,
				personId:personId,
				holidayTypeId:holidayTypeId,
				beginTime: beginTime.length == 10 ? beginTime + " 00:00:00" : beginTime,
				endTime: endTime.length == 10 ? endTime + " 00:00:00" : endTime,
				leaveLength:leaveLength,
				billId:$("#id").val(),
				hrOrgUnitId:$("#hrOrgUnit_el").val()
			},
			success:function(res){
				info =  res;
			}
		});
		return info;
	},
	
	/**
	 * 校验前置假
	 */
	validatePreHolidayType: function(personId,beginTime,endTime,holidayTypeId){
	   var that = this;
	   var info ;
	   that.remoteCall({
					type:"post",
					async: false,
					method:"validatePreHolidayType",
					param:{
					personId:personId,
					beginTime:beginTime,
					endTime:endTime,
					holidayTypeId:holidayTypeId,
					hrOrgUnitId:$("#hrOrgUnit_el").val()
				},
				success:function(res){
					info =  res;
				}
		});
		return info;
	}
	
	//验证请假周期
	,validateLeaveBillCycleNew:function(personId,beginTime,endTime,holidayTypeId,leaveLength,billId){
		var that = this;
		var beginTime;
		var endTime
		var operateState = that.getOperateState();
		var bfTypeId = $("#entries_bFType_el").val();
		beginTime = atsMlUtile.getFieldOriginalValue('entries_beginTime');
		endTime = atsMlUtile.getFieldOriginalValue('entries_endTime');
		var workFlow="";
		if(shr.getUrlRequestParam('uipk')=="com.kingdee.eas.hr.ats.app.AtsLeaveBillFormWorkflow"){
			workFlow=shr.getUrlRequestParam('uipk');
		}
		var regEx = new RegExp("\\/","gi");
		beginTime = beginTime.replace(regEx,"-");
	 	endTime = 	endTime.replace(regEx,"-");
		var info ;
		that.remoteCall({
			type:"post",
			async: false,
			method:"validateLeaveBillCycleNew",
			param:{ personId:personId,
					beginTime:beginTime,
					bfTypeId: bfTypeId,
					endTime:endTime,
					holidayTypeId:holidayTypeId,
					leaveLength:leaveLength,
					billId:billId,
					workFlow:workFlow,
					pageUipk:pageUipk,
					isElasticCalLen:$("#entries_isElasticCalLen").shrCheckbox("isSelected"),
					operateState:operateState
			},
			success:function(res){
				info =  res;
			}
		});
		return info;
	}
	
	
	//验证请假周期
	,validateLeaveBillCycle:function(personId,beginTime,endTime,holidayTypeId,leaveLength,billId){
		var that = this;
		var beginTime;
		var endTime
		var operateState = that.getOperateState();
		if(_isHalfDayOff){
		//龙光需求 请假时间为上午下午 时  请假开始结束时间取法
		 var halfTime = this.getHalfTime();
		 	beginTime = halfTime.beginTime;
		 	endTime = halfTime.endTime;
		}else{
		beginTime = atsMlUtile.getFieldOriginalValue('entries_beginTime');
		endTime = atsMlUtile.getFieldOriginalValue('entries_endTime');
		}
		
		var regEx = new RegExp("\\/","gi");
		beginTime = beginTime.replace(regEx,"-");
	 	endTime = 	endTime.replace(regEx,"-");
		var info ;
		that.remoteCall({
			type:"post",
			async: false,
			method:"validateLeaveBillCycle",
			param:{personId:personId,beginTime:beginTime,endTime:endTime,holidayTypeId:holidayTypeId,leaveLength:leaveLength,billId:billId,pageUipk:pageUipk,operateState:operateState},
			success:function(res){
				info =  res;
			}
		});
		return info;
	}
	
	//通过人员ID 获取年假剩余额度信息
	,getYearVacationRemainInfo:function(personId){
		var that = this;
		var info ;
		that.remoteCall({
			type:"post",
			async: false,
			method:"getYearVacationRemain",
			param:{personId:personId},
			success:function(res){
				info =  res;
			}
		});
		return info;
	}
	
	
	//获取请假开始时间和结束时间
	,getBeginTimeAndEndTime:function(){
		var that = this;
		var retuenValue = {};
		var beginTime;
		var endTime
		if(_isHalfDayOff){
			var halfTime = this.getHalfTime();
		 	beginTime = halfTime.beginTime;
		 	endTime = halfTime.endTime;
		}else{
			beginTime = atsMlUtile.getFieldOriginalValue('entries_beginTime');
			endTime = atsMlUtile.getFieldOriginalValue('entries_endTime');
		}
		var regEx = new RegExp("\\/","gi");
		beginTime = beginTime.replace(regEx,"-");
	 	endTime   = endTime.replace(regEx,"-");
	 	retuenValue.beginTime = beginTime;
	 	retuenValue.endTime = endTime;
		return retuenValue;
	}
	
	//通过人员ID 获取年假  是否可以超额请假 和 超期额度下期扣减
	,getIsOverAndIsOverAutoSubByPersonId:function(personId){
		var that = this;
		var timevalue = that.getBeginTimeAndEndTime();
		var info ;
		that.remoteCall({
			type:"post",
			async: false,
			method:"getIsOverAndIsOverAutoSubByPersonId",
			param:{personId:personId, beginTime:timevalue.beginTime,endTime:timevalue.endTime},
			success:function(res){
				info =  res;
			}
		});
		return info;
	}
	
	//通过人员ID 获取年假  是否可以超额请假 和 超期额度下期扣减
	,getRealAndRemainLimit:function(personId,holidayPolicyId,billId){
		var that = this;
		var info ;
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		that.remoteCall({
			type:"post",
			async: false,
			method:"getRealAndRemainLimit",
			param:{personId:personId,holidayPolicyId:holidayPolicyId,billId:billId,hrOrgUnitId:hrOrgUnitId},
			success:function(res){
				info =  res;
			}
		});
		return info;
	}
	
	/**
	 * 龙光需求
	 * @return {Boolean}
	 */
	,calculateLeaveLength_Longon : function(){
		var that = this ;
		/**
		 * 0-天 1-小时 2- 分钟 3-次 hr-time Version
		 * 1-天 2-小时 3- 分钟 4-次 ats Version
		 */
		that._unitType = _unitType;
		var begintime = atsMlUtile.getFieldOriginalValue('entries_beginTime');
		var endtime =   atsMlUtile.getFieldOriginalValue('entries_endTime');
		
		if ( !begintime || !endtime) {
			return;
		}
		var beginTimeOfDate = new Date(begintime); 
		var endTimeOfDate = new Date(endtime);
		var longTime = endTimeOfDate.getTime() - beginTimeOfDate.getTime();
		if (longTime <= 0) {
			shr.showInfo({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_26});
			return false;
		 }
		 var leaveLen = -1;
		if (that._unitType == 2) { //单位为小时
			 var leaveLen = parseFloat(longTime)/1000.0/60/60;
			 atsMlUtile.setTransNumValue("entries_leaveLength",leaveLen.toFixed(atsMlUtile.getSysDecimalPlace()));
			 return;
		}
		var begintime_ap_day = $("#entries_beginTime_select").val().substring(0,3);//开始时间的 上午和下午
		var endtime_ap_day = $("#entries_endTime_select").val().substring(0,3);	//结束时间的上午和下午
		var beginTimeDayOfDate = new Date(begintime.subString(0,10)).getTime(); 
		var endTimeDayOfDate = new Date(endtime.subString(0,10)).getTime();
		var day = parseFloat(endTimeDayOfDate - beginTimeDayOfDate)/1000.0/60/60/24;
		var resDay = 0;
	    if (begintime_ap_day == endtime_ap_day) {
			resDay = parseFloat(day)+0.5;
		}else if (begintime_ap_day == jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_40) {
			resDay = parseFloat(day)+1;
		}
		atsMlUtile.setTransNumValue("entries_leaveLength",resDay);
	}
	
	,showMoreBindClick:function(){
		var that = this;
	    		yearGolbal = new Date().getFullYear();
	    		$(".longDemo").show();
	    		that.clearEventDataInfos();
		    	that.ajaxLoadAllLeaveBillDatas(yearGolbal);
		    	dialog_Html = "<div id='dialogViewMore' style = 'font-size: 12px; padding: 10px; width: 93%' title=''>" +
				"<div>" + 
				"	<h2 style='font: 14px Microsoft Yahei; margin:0 auto; margin-left:5px;'>" +
				"		<font style=' font-size:0px;'>test</font>" +
				"		<span style='float:left; display:block;'><a id='a_pre' style='cursor:pointer'>" 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_24 
				+ "</a></span>" + //onClick='pre()' 
				"		<span style='float:right;display:block;'><a id='a_next' style='cursor:pointer'>" 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_15 
				+ "</a></span>" + //onClick='next()'
				"	</h2>" +
				"	<div id='longTimeLine' style='margin:0 auto;'></div>" +
				"</div>" +
				"</div>";
				
			$('#message_head').append("<div id='showViewMore'></div>");
			$('#showViewMore').html(dialog_Html);
			
			//绑定点击事件--放在里边会出现绑定多次点击事件
	        $('#a_pre').click(function(e){
	        	that.clearEventDataInfos();
	        	that.loadPreLeaveBillDatas();
	        });
	        $('#a_next').click(function(e){
	        	that.clearEventDataInfos();
	        	that.loadNextLeaveBillDatas();
	        });
        
	},
	setNavigateLine: function(){
	    var fromFlag = localStorage.getItem("fromFlag");
		var punchCardFlag = sessionStorage.getItem("punchCardFlag");
		var empolyeeBoardFlag =	sessionStorage.getItem("empolyeeBoardFlag");
		var parentUipk = "";
		if(parent.window.shr==null){
     		parentUipk = shr.getCurrentViewPage().uipk;
     	}else{
     		parentUipk = parent.window.shr.getCurrentViewPage().uipk;
     	}
		if(fromFlag == "employeeBoard" || fromFlag == "punchCard" 	|| ("fromPunchCard" == punchCardFlag && 
	     	"com.kingdee.eas.hr.ats.app.WorkCalendarItem.listSelf" == parentUipk) ||
	     	("empolyeeBoardFlag" == empolyeeBoardFlag && "com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop" == parentUipk)){//来自我的考勤的时候。将导航条删除掉。
		   $("#breadcrumb").parent().parent().remove();
		   localStorage.removeItem("fromFlag");
		   window.parent.changeDialogTitle(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_55);
		}
	}
	
	,beforeSubmit :function(){
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		if (($form.valid() && _self.verify("submt"))) {
			return true ;
		}
		// return false 也能保存，固让js报错 
		var len = workArea.length() ;
		return false ;
	}
	,getCurrentModel : function(){
		var that = this ;
		var model = shr.ats.AtsLeaveBillEdit.superClass.getCurrentModel.call(this);
		var beginTime = atsMlUtile.getFieldOriginalValue("entries_beginTime");
		var realLeaEndTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
		model.entries[0].beginTime = atsMlUtile.getFieldOriginalValue("entries_beginTime");
		model.entries[0].endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
		model.entries[0].realBeginTime =  model.entries[0].beginTime ;
		model.entries[0].realEndTime =  model.entries[0].endTime ;
		model.entries[0].realLeaveLength =  model.entries[0].leaveLength ;
		return model ;
	}
	,getHalfTime:function(){
		return {
			beginTime:atsMlUtile.getFieldOriginalValue('entries_beginTime'),
			endTime : atsMlUtile.getFieldOriginalValue('entries_endTime')
		}
	}
	,initAttendanceType : function(){
		var that = this ;
		//如果新增或者编辑页面,直接从后台返回该人员的可用年假
		if (that.getOperateState() != 'VIEW') {
			//先将假期类型框清空
			$("#message_holidayType").html("");
			$("#attend_type").hide();
			
		}else if (that.getOperateState() == 'VIEW') {
			$("#attend_type").show();
			$("#entries_policy_holidayType").closest("div[data-ctrlrole='labelContainer']").hide();
			//获取当前单据的人员ID 查询该人员的可用年假
		}
	}
	,initElasticCalCtrl:function(){
		var that = this ;
	    //弹性段是否算时长
	    if( that.getOperateState() == 'VIEW'|| that.getOperateState() == 'EDIT'){
	    	var personId = $("#entries_person_el").val() || $("#entries_person").val();
	    	var holidayPolicyId = $("#entries_policy_el").val() || $("#entries_policy").val();
	    	var beginTime = _viewBeginLeaveTime ==""?atsMlUtile.getFieldOriginalValue("entries_beginTime"):_viewBeginLeaveTime;
	    	var endTime = _viewEndLeaveTime ==""?atsMlUtile.getFieldOriginalValue("entries_endTime"):_viewEndLeaveTime;
	    	shr.atsBillUtil.showIsElasticCalCtrl(that,personId,holidayPolicyId,beginTime,endTime);
	    }else{
	    	$("#entries_isElasticCalLen").parent().parent().parent().hide();
	    }
	    if( that.getOperateState() != 'VIEW'){
		    $("#entries_isElasticCalLen").change(function(){//弹性段算时长change事件
				that.getRealLeaveLengthOfDay();
			});
	    }
	}
	,showIsElasticCalCtrl:function(){
		var that = this ;
    	var personId = $("#entries_person_el").val()==""||$("#entries_person_el").val()==undefined?$("#entries_person").val():$("#entries_person_el").val();
    	var holidayPolicyId = $("#entries_policy_el").val()==""||$("#entries_policy_el").val()==undefined?$("#entries_policy").val():$("#entries_policy_el").val();
    	var beginTime = atsMlUtile.getFieldOriginalValue("entries_beginTime");
    	var endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
    	shr.atsBillUtil.showIsElasticCalCtrl(that,personId,holidayPolicyId,beginTime,endTime);
		    
	}
	 ,addSocQueryTips:function(){
		var that = this;
		shr.atsBillUtil.addSocQueryTipA("tipsIsElasticCal");
	}
	,showTips:function(){
		//此处选择器中用中文括号，页面上是中文
		$('[title="' 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_11
				+ '"]').append('<span id="tipsIsElasticCal"></span>');
		var tipsIsElasticCalText = '&nbsp;&nbsp;' 
			+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_19 
			+ '<br/>';
		var tipsIsElasticCalLog = '<div id="tipsIsElasticCal-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;height:100px;position:absolute;left:15%;z-index:1;margin-top:0px;background: aliceblue;"><div style="position:absolute"><font color="gray">'+tipsIsElasticCalText+'</font></div></div>';
		//此处选择器中用中文括号，页面上是中文
		$('[title="' 
				+ jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_11 
				+ '"]').after(tipsIsElasticCalLog);
	}
});


	showHolidayLimit = function(proposerId,hrOrgUnitId,holidayPolicyId){
		var url = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.HolidayLimitPerself.list&flag=perself&type=day";
		url += '&proposerId='+encodeURIComponent(proposerId);
		$("#operationDialog").remove();
		var dialogHtml='<div id="operationDialog" style="overflow:hidden;display:none;">'+
            '<iframe id="operationDialog-frame" name="operationDialog-frame" width="100%" height="100%" frameborder="0" allowtransparency="true" scrolling="no" />'+
        	'</div>';
        $("#workAreaDiv").append(dialogHtml);
		var selectDialog = $("#operationDialog");
		selectDialog.children("iframe").attr('src',url);
		selectDialog.dialog({
	 		autoOpen: true,
			title: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_17,
			width:950,
	 		minWidth:950,
	 		height:650,
	 		minHeight:650,
			modal: true,
			resizable: true,
			position: {
				my: 'center center',
				at: 'center center',
				of: window
			}
		});
	};




/**
 * k 循环下标
 * size 类型个数
 * changeColor(0,1,"","3T54RtSQRIqAL6cffMh60P0tUpg=","年休假","天",0);
 */
changeColor = function(k,size,holidayPolicyId,attendTypeId,attendTypeName,unitTypeName,unitTypeValue){
	if (unitTypeName=="" || unitTypeValue=="") {
		shr.showInfo({message: jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_18});
		return false;
	}
	$("#leaveRemark").html($("#div" + k).attr("title").replace(/\\n/g,'<br>') || "");
	_unitType = unitTypeValue;
	for(var i=0;i<size;i++){
	  if(k==i){
	  	//$("#type_test").hide();
		$("#div"+i).css({ "background-color":"#E4E4E4" }); //#F2F2F2  98bf21  #F39814-橙色   D9EDF7-浅蓝色  #E4E4E4-浅灰
		$("#div"+i).css({ "border":"1px solid #428BCA" }); //#79BEF0
		//其他div颜色变白
		for(var m=0;m<size;m++){
			if(m!=i){
				$("#div"+m).css({ "background-color":"#FFFFFF" });
				$("#div"+m).css({ "border":"1px solid #E4E4E4" }); //边框变灰
			}
		}
		//设置假期类型字段的值
		$("#entries_policy").val(attendTypeName);
		if($("#entries_policy_el").val()!=holidayPolicyId){
			$("#entries_policy_el").val(holidayPolicyId).change();//attendTypeId
		}
		//再设置隐藏域(假期分类)的值
		$("#entries_policy_holidayType").val(attendTypeName);
		$("#entries_policy_holidayType_el").val(attendTypeId);
	  }
	}
	var that = this ;
 	//填充假期类型的单位
	setLeaveLengthType(unitTypeValue,unitTypeName);
	//哺乳假选中
	if ($("#entries_policy_holidayType_el").val() == bfHolidayTypeId) {
		$("#bfInfo").show();
		$("#entries_bFType").val("")
		$("#entries_bFType_el").val("");
		$("#entries_bFType").closest(".ui-promptBox-frame").css({backgroundColor: "#d9edf7 !important"});
		$("#entries_childbirthday").parents(".field-basis1").hide();	
		$("#entries_mLEndTime").parents(".field-basis1").hide();
	} else {		
		$("#entries_beginTime").parents(".field-ctrl").prev().find(".field-label").prop("title","请假开始时间").html("请假开始时间");
		$("#entries_endTime").parents(".field-ctrl").prev().find(".field-label").prop("title","请假结束时间").html("请假结束时间");		
		$("#bfInfo").hide();						
	}
};

/**
 * 设置默认选中项
 * entries.policy 假期制度(假期类型)
 * attendColl[i].holidayType.id 假期类型ID
 * attendColl[i].id				假期制度ID
 */
changeColorDefault  = function(k,size,attendColl,holidayPolicyId,attendTypeId,attendTypeName,unitTypeName,unitTypeValue){
	_unitType = unitTypeValue;
	// 假期类型默认选中    原来的假期类型   - 年假  - 第一个假期类型 
	
	for(var i=0; i<size; i++){
	  if(attendTypeName==attendColl[i].name){
	  	$("#leaveRemark").html($("#div" + i).attr("title").replace(/\\n/g,'<br>') || "");
	  	//灰色背景 蓝色边框
		$("#div"+i).css({ "background-color":"#E4E4E4" });
		$("#div"+i).css({ "border":"1px solid #428BCA" });
		//其他div颜色变白
		for(var m=0;m<size;m++){
			if(m!=i){
				$("#div"+m).css({ "background-color":"#FFFFFF" }); //白色背景
				$("#div"+m).css({ "border":"1px solid #E4E4E4" }); //边框变灰
			}
		}
		//设置假期类型字段的值
		$("#entries_policy").val(attendTypeName);
		$("#entries_policy_el").val(holidayPolicyId).change();//holidayPolicyId  attendTypeId
		//再设置隐藏域(假期分类)的值
		$("#entries_policy_holidayType").val(attendTypeName);
		$("#entries_policy_holidayType_el").val(attendTypeId);
		setLeaveLengthType(unitTypeValue,unitTypeName);
		return;
		}
	  }
	  for(var i=0; i<size; i++){ 
	  if(attendColl[i].holidayType.id == "3T54RtSQRIqAL6cffMh60P0tUpg="){
	  	var holidayPolicy_Id = attendColl[i].id;//年假对应的假期制度ID
	  	
	  	//灰色背景 蓝色边框
		$("#div"+i).css({ "background-color":"#E4E4E4" });
		$("#div"+i).css({ "border":"1px solid #428BCA" });
		//其他div颜色变白
		for(var m=0;m<size;m++){
			if(m!=i){
				$("#div"+m).css({ "background-color":"#FFFFFF" }); //白色背景
				$("#div"+m).css({ "border":"1px solid #E4E4E4" }); //边框变灰
			}
		}
		//设置假期类型字段的值
		$("#entries_policy").val(attendTypeName);
		$("#entries_policy_el").val(holidayPolicyId).change();//holidayPolicyId  attendTypeId
		//再设置隐藏域(假期分类)的值
		$("#entries_policy_holidayType").val(attendTypeName);
		$("#entries_policy_holidayType_el").val(attendTypeId);
		setLeaveLengthType(unitTypeValue,unitTypeName);
		return;
		}
	  }
	  for(var i=0; i<size; i++){ 
	  	//var holidayPolicy_Id = attendColl[0].id;
  		if(attendColl[i].holidayType.id == attendColl[0].holidayType.id){
	  	//灰色背景 蓝色边框
		$("#div"+i).css({ "background-color":"#E4E4E4" });
		$("#div"+i).css({ "border":"1px solid #428BCA" });
		//其他div颜色变白
		for(var m=0;m<size;m++){
			if(m!=i){
				$("#div"+m).css({ "background-color":"#FFFFFF" }); //白色背景
				$("#div"+m).css({ "border":"1px solid #E4E4E4" }); //边框变灰
			}
		}
		//设置假期类型字段的值
		$("#entries_policy").val(attendTypeName);
		$("#entries_policy_el").val(holidayPolicyId).change();//holidayPolicyId  attendTypeId
		//再设置隐藏域(假期分类)的值
		$("#entries_policy_holidayType").val(attendTypeName);
		$("#entries_policy_holidayType_el").val(attendTypeId);
		setLeaveLengthType(unitTypeValue,unitTypeName);
		return;
	  }
	}
	
	
};
/**
 * 1-天   2-小时   3-分钟  4-次
 */
setLeaveLengthType = function(unitTypeValue,unitTypeName){
	var _type = unitTypeValue;
	if (_type == 1) {
		$("#entries_remark").val(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_52);
		$(".appendUnit").html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_52);
		$("#entries_realUnit").val(_type);
		$("#entries_realUnit_el").val(_type);
	}else if (_type == 2) {
		$("#entries_remark").val(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_58);
		$(".appendUnit").html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_58);
		$("#entries_realUnit").val(_type);
		$("#entries_realUnit_el").val(_type);
	}else if (_type == 3) {
		$("#entries_remark").val(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_13);
		$(".appendUnit").html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_13);
		$("#entries_realUnit").val(_type);
		$("#entries_realUnit_el").val(_type);
	}else if (_type == 4) {
		$("#entries_remark").val(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_10);
		$(".appendUnit").html(jsBizMultLan.atsManager_atsLeaveBillEdit_i18n_10);
		$("#entries_realUnit").val(_type);
		$("#entries_realUnit_el").val(_type);
	}
};