var _isHalfDayOff = false;
var _defaultAmBeginTime = "09:00";
var _defaultAmEndTime = "12:00";
var _defaultPmBeginTime = "14:00";
var _defaultPmEndTime = "18:00";
var _isCancelLeave = true;
var _shiftTime;
var _personId;
var _policyId;
var leaveBillId=shr.getUrlRequestParam("leaveBillId");
var isFromPage=shr.getUrlRequestParam("isFromPage");
shr.defineClass("shr.ats.team.TeamCancelLeaveBillEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.team.TeamCancelLeaveBillEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		that.processLeaveBillF7ChangeEvent();
		that.initElasticCalCtrl();
		that.showLeaveBillInfoView();//查看界面也要显示请假单信息
		that.setButtonVisible(); //初始化页面安装状态,如果是已经提交的或者审批通过的单据编辑按钮不显示
		if(that.getOperateState() == 'EDIT'){
		//that.EditShowStartEndTime();
			if(that.isFromWF()){ // 来自任务中心
				$('#cancel').hide();
				$("#entries_leaveEntryBill").shrPromptBox("disable");
			}
		}
		
		//计算请假确认 时间长度,查看,修改界面不计算
		if (that.getOperateState().toUpperCase() != 'VIEW') {
			that.calculateCancelLeaveLength();
		}
		
		that.setNumberFieldEnable();
		that.isInitialLeaveLengthEdit();
		if(leaveBillId){
			$("#breadcrumb li:eq(2)").html(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_18);
			$("#cancel").text(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_17);
			that.initDefaultLeaveBill();
		}
		
		if(that.getOperateState() == "VIEW"){//不显示秒
			if(atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_realLeaBeginTime",atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime").substring(0,16));
			}
			if(atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_realLeaEndTime",atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime").substring(0,16));
			}
		}
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.CancelLeaveBillForm") {
			if (shrDataManager.pageNavigationStore.getDatas().length == 2) {
				$("#breadcrumb").find("li.active").html(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_42);
				var a = shrDataManager.pageNavigationStore.getDatas()[1];
				a.name = jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_42;
				shrDataManager.pageNavigationStore.pop();
				shrDataManager.pageNavigationStore.addItem(a);
			}
			if (shrDataManager.pageNavigationStore.getDatas().length == 3) {
				$("#breadcrumb li")[2].remove();
				$("#breadcrumb").find("li.active").html(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_42);
				shrDataManager.pageNavigationStore.pop();
			}

			if (shrDataManager.pageNavigationStore.getDatas().length == 4) {
				$($("#breadcrumb li")[3]).html(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_0);
			}

		}
		if(that.isFromWF()){
			$("#addInstanceToDeskItem").css('display','none');
		}
		if(that.isFromWF() && that.getOperateState() == "EDIT"){//流程中打回编辑没有serviceId
			$("#entries_leaveEntryBill").shrPromptBox("option","subWidgetOptions.otherParams",{serviceId:"5L3cnB8HSta4vQ/lBrHWlvI9KRA="});
		}
		var paramMethod = shr.getUrlRequestParam("method");
     	//从我要请假菜单中点击进来的URL上没有method参数
     	if(paramMethod == null){
     	    $("#breadcrumb").find(".active").text(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_42);
     	    if(shrDataManager.pageNavigationStore.getDatas().length==0){
     	    	var object_bread_1 = {
     	    			name: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_42,
     	    			url: window.location.href,
     	    			workPlatformId: "Qz9UfhLqB0+vmMJ4+80EykRLkh4="
     	    	}
     	    	shrDataManager.pageNavigationStore.pop();
				shrDataManager.pageNavigationStore.addItem(object_bread_1); 
     	    }
     	}
     	
        that.showTips();
		that.addSocQueryTips();
        that.initCcPersonPrompt();
     	
	},
    clearCCPersonIdsPrompt :function() {
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
                    handler: "com.kingdee.shr.ats.web.handler.team.F7.TeamPersonForEmpOrgF7ListHandler",
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
		if (that.getOperateState().toUpperCase() == 'EDIT' ||　that.getOperateState().toUpperCase() == 'ADDNEW') {
			var cancelLeaveBillNumberFieldCanEdit = that.initData.cancelLeaveBillNumberFieldCanEdit;
			if (typeof cancelLeaveBillNumberFieldCanEdit != 'undefined' && !cancelLeaveBillNumberFieldCanEdit) {
				that.getField('number').shrTextField('option', 'readonly', true);
			}
		}
	}
	 
	 //提交即生效
	,submitEffectAction : function (event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		if (_self.validate() && _self.verify()) {
			_self.billCheckAct(function(res){
				var result = res.result;
				if(result==""){
					if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
						shr.showConfirm(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_7, function() {
							_self.prepareSubmitEffect(event, 'submitEffect');
						});
					}else{
						shr.showConfirm(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_11, function() {
							_self.prepareSubmitEffect(event, 'submitEffect');
						});
					}	
				}else{
					shr.showConfirm(result+jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_39,function(){
						if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
							shr.showConfirm(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_7, function() {
								_self.prepareSubmitEffect(event, 'submitEffect');
							});
						}else{
							shr.showConfirm(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_11, function() {
								_self.prepareSubmitEffect(event, 'submitEffect');
							});
						}	
					});
				}
			});
		}	
	}
	/**
	 * 保存
	 */
	,saveAction: function(event) {
		var _self = this;
		if (_self.validate() && _self.verify()) {
			_self.billCheckAct(function(res){
				var result = res.result;
				if(result==""){
					_self.doSave(event, 'save');
				}else{
					shr.showConfirm(result+jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_39,function(){
						_self.doSave(event, 'save');
					});
				}
			});
		}	
	}
	,billCheckAct:function(afterCheckFn,async){
		var beginDate = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime").split(" ")[0];
		var endDate = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime").split(" ")[0];
		var personId = $("#entries_person_el").val();
		if(personId==null){
			personId =$("#entries_person").val();
		}
		_self.remoteCall({
			type:"post",
			method:"billCheck",
			param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:"cancel"},
			async: async === false ? false : true,
			success:function(res){
				afterCheckFn && afterCheckFn(res);
			}
		});	
	}
	,getRealLeaveTime:function(isHalfDayOff,flag){
	
		
	}
	,submitAction: function(event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		//来自员工自助
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.CancelLeaveBillForm") {
			var personId = $('#entries_person_el').val();
			var proposerId = $('#proposer_id').val();
			if(undefined != personId && undefined != proposerId && personId != "" && proposerId != "" && personId != proposerId){
				shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_49, hiddenAfter: 5});
				return;
			}
		}
		
		if ( _self.validate() && $form.valid() &&  _self.verify()) {
			_self.billCheckAct(function(res){
				var result = res.result;
				if(result==""){
					shr.showConfirm(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_10, function() {
					_self.doSubmit(event, 'submit');
					});	
				}else{
					shr.showConfirm(result+jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_39,function(){
						shr.showConfirm(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_10, function() {
								_self.doSubmit(event, 'submit');
						});	
					});
				}
			},false);
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
		if(_self.getOperateState() =='VIEW'){   
			model.entries={};
		}else{
			model.entries.realLeaBeginTime = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime");
			model.entries.realLeaEndTime = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime")
		}

        model.ccPerson = model.ccPersonIds;
		data.model = shr.toJSON(model); 
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		return data;
	}
	
	/**
	 * 点击取消按钮 返回到个人请假确认列表list(个人) || com.kingdee.eas.hr.ats.app.CancelLeaveBillList
	 */
	,cancelAction:function(){
	 	if(isFromPage == "Leave"){//来自请假单的请假确认
		 this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsLeaveBillList'
		 });
		}else{
	 	 this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.CancelLeaveBillList',
			serviceId:	'vA0Y5XHfR8eJESywHpQQSPI9KRA='
		 });
		}
	}
	//专员的取消按钮 返回专员的列表
	,cancelAllAction:function(){
	 	if(isFromPage == "Leave"){
			this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.team.AtsLeaveBillAll.list'
		});
		}else{
	 	  this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.team.CancelLeaveBillAllList'
		  });
		}
	}
	
	//根据时间填写的 实际请假开始时间 和 实际请假结束时间 计算请假确认的时间长度
	,calculateCancelLeaveLength:function(){
		var that = this ;
		$("#entries_realLeaEndTime").change(function(){
			that.getRealLeaveLengthOfDay();
		});
		$("#entries_realLeaBeginTime").change(function(){
			that.getRealLeaveLengthOfDay();
		});
	}
	/**
	 * 增加保存验证
	 * @return {Boolean}
	 */
	,verify:function(){
		var that = this;
		var realbeginTime = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime");
		var realendTime = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime");
		var realLeaLength = atsMlUtile.getFieldOriginalValue("entries_realLeaLength");
		if(!_isCancelLeave){
			that.validateIsCancelLeave();
			return false;	
		}
		if(realLeaLength<0){
			 shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_38});
			 return false;	
		}
		//entries_cancelLeaveLength
		//请假确认开始时间不能大于请假确认 结束时间
		var regEx = new RegExp("\\-","gi");
		realbeginTime = realbeginTime.replace(regEx,"/");
	 	realendTime = 	realendTime.replace(regEx,"/");
	 	var beginTimeOfDate = new Date(realbeginTime); 
	 	var endTimeOfDate = new Date(realendTime);
		var longTime = endTimeOfDate.getTime() - beginTimeOfDate.getTime();
		if (longTime < 0) {
			shr.showInfo({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_25});
			return false;
		}
		//请假确认时间重复校验处理 这里先简单处理下 明天写个公共的方法一起调用 参考之前k3考勤集成的方法 包括时间交叉的情况
		var info = that.getCancelLeaveBillInfo();
		if(info.leaveBillExist==true){
		  shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_19});
		  return false;	
		}else if (info.isOverRange == 1) {
		  shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_23});
		  return false;	
		}else if (info.isOverRange == 2) {
		  shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_22});
		  return false;	
		}else if (info.isOverRange == 3) {
		  shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_21});
		  return false;
		}else if (info.isOverRange == 4) {
		  shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_20});
		  return false;	
		}else if (info.isOverRange == 5) {
		  shr.showError({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_24});
		  return false;	
		}
		return true;
	}
	//新增界面选择请假单的时候触发的函数
	,processLeaveBillF7ChangeEvent : function(){
		var that = this;
		if (that.getOperateState() == 'VIEW') {
			return;
		}
		$("#hrOrgUnit").shrPromptBox("option", {
			onchange : function(e, value) {
				var info = value.current;
				$("#entries_leaveEntryBill").shrPromptBox("setFilter"," ( hrOrgUnit.id = '"+info.id+"' )");
			}
		});
		
		$("#entries_leaveEntryBill").change(function(){
			//that.showIsElasticCalCtrl();
		});
		
		$("#entries_leaveEntryBill").shrPromptBox("option", {
			onchange : function(e, value) {
				_isCancelLeave = false;
				var info = value.current;
				if(!info || !info.hasOwnProperty("id")){
					return;
				}
				var billId = info.id;
				atsMlUtile.setTransNumValue("entries_realLeaLength","");
				$("#entries_leaveEntryBill").val("");
				$("#viewLeaveBillInfo_table").html("");
				that.remoteCall({
					type:"post",
					async: false,
					method:"validateIsCancelLeave",
					param:{billId:billId},
					success:function(res){
						_isCancelLeave = true;
						that.remoteCall({
							type:"post",
							async: false,
							method:"getLeaveBillInfoById",
							param:{billId:billId},
							success:function(res){
								that.refreshHROrgUnit(res);
								that.getSetIsCtrlHalfDayOff(res);
								that.setBeginAndEndTime(res);
								that.setBillPerson(res);
								that.showLeaveBillInfo(res);
								that.showAttachInfo(res);
								that.isLeaveLengthEdit(res);
								if(res.unit){
									$("#entries_leaveEntryBill_realUnit").val(res.unit);
								}
								shr.atsBillUtil.showIsElasticCalCtrl(that,res.personId,_policyId,res.realLeaBeginTime,res.realLeaEndTime);
							}
						});
					}
				});
					
			}
		});
	}
	//新建、编辑请假确认单，选择请假单时，根据请假单刷新假期业务在氐
	,refreshHROrgUnit:function(res){
		var hrOrgUnitName = res.hrOrgUnitName;
		var hrOrgUnitId = res.hrOrgUnitId;
		$("#hrOrgUnit").shrPromptBox("setValue",{id:hrOrgUnitId,name:hrOrgUnitName});
	}
	,getCancelLeaveBillInfo:function(){
		var that = this;
		var realLeaLength = atsMlUtile.getFieldOriginalValue("entries_realLeaLength");
		var leaveBillId = $("#entries_leaveEntryBill_el").val();//请假单的ID
		if(that.getOperateState() == 'VIEW'){
			leaveBillId = $("#entries_leaveEntryBill").attr("value");//请假单的ID
		}
		var info ;
		that.remoteCall({
			type:"post",
			async: false,
			method:"getCancelLeaveBillInfoByPersonIdAndCancelLeaveTime",
			param:{
				personId:$("#entries_person_el").val(),
				begin_Time:atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime"),
				end_Time:atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime"),
				billId:$("#id").val(),
				realLeaLength:realLeaLength,
				leaveBillId:leaveBillId
			},
			success:function(res){
				info = res;
			}
		});
		return info;
	}
	
	,goNextPage: function(source) {
		if(isFromPage == "Leave"){//来自请假单页面的请假确认
				// 普通提交，返回上一页面
			if ($("#bill_flag").val() == "commissioner"){
				_self.reloadPage({
					uipk: "com.kingdee.eas.hr.ats.app.team.AtsLeaveBillAll.list"
				});
			}else{
				_self.reloadPage({
					uipk: "com.kingdee.eas.hr.ats.app.AtsLeaveBillList"
				});
			}
		}else{
			// 普通提交，返回上一页面
			if ($("#bill_flag").val() == "commissioner"){
				_self.reloadPage({
					uipk: "com.kingdee.eas.hr.ats.app.team.CancelLeaveBillAllList"
				});
			}else{
				_self.reloadPage({
					uipk: "com.kingdee.eas.hr.ats.app.CancelLeaveBillList"
				});
			}
		}
	}
	//查看界面也要显示请假单信息
	,showLeaveBillInfoView : function(){
		var that = this;
		if (that.getOperateState() == 'VIEW' ||　that.getOperateState() == 'EDIT') {
			var leaveBillId = this.getFieldValue("entries_leaveEntryBill_id");//workflow
			if(!leaveBillId){
				leaveBillId = this.getFieldValue("entries_leaveEntryBill");
			}
			if(that.getOperateState() == 'EDIT')
			{
				leaveBillId=$("#entries_leaveEntryBill_el").val();
			}
			var billId = leaveBillId;
			if (billId != "") {
				that.remoteCall({
					type:"post",
					async: false,
					method:"getLeaveBillInfoById",
					param:{billId:billId},
					success:function(res){
						that.showLeaveBillInfo(res);
						that.showAttachInfo(res);
						if(that.getOperateState() == 'EDIT'){
                            // 编辑界面 是否启动半天假  并设置时间
                            that.getSetIsCtrlHalfDayOff(res);
                            that.EditShowStartEndTime();
						}
					}
				});
			}
		}
	}
	// 获取 是否启动半天假   加载界面
	,getSetIsCtrlHalfDayOff : function(res){
		var that = this;
		var personId = res.personId;
		var holidayPolicyId = res.holidayPolicyId;
		_personId = res.personId;
		that.remoteCall({
			type:"post",
			async: false,
			method:"getSetIsCtrlHalfDayOff",
			param:{personId:personId,holidayPolicyId:holidayPolicyId},
			success:function(response){
				info =  response;
				info.realLeaBeginTime = res.realLeaBeginTime;
				info.realLeaEndTime = res.realLeaEndTime;
				_isHalfDayOff = info.isHalfDayOff;
				that.setHalfDayOff(info);
			}
		});
		
	}
		// 判断是否启动半天假  并相应加载对应页面
	,setHalfDayOff : function(info){
		var that = this;
			//设置 上下午上下班默认时间
		_defaultAmBeginTime = info.amBeginTime;
		_defaultAmEndTime = info.amEndTime;
		_defaultPmBeginTime = info.pmBeginTime;
		_defaultPmEndTime = info.pmEndTime;
		var enumOptions = [{value : _defaultAmBeginTime + "-" + _defaultAmEndTime,alias : jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_31},
						   {value : _defaultPmBeginTime + "-" + _defaultPmEndTime,alias : jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_44}];
		
		shrDateWithSelectPicker('entries_realLeaBeginTime',{
			selectModel:info.isHalfDayOff,
			value:  info.realLeaBeginTime,
			onchange:function(args){that.getRealLeaveLengthOfDay(args)},
			enumOptions:enumOptions
		});
		enumOptions = JSON.parse(JSON.stringify(enumOptions));
		enumOptions.splice(0,0,{value : _defaultAmBeginTime + "-" + _defaultAmBeginTime,alias : jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_31});
		enumOptions.splice(2,0,{value : _defaultPmBeginTime + "-" + _defaultPmBeginTime,alias : jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_44});
		shrDateWithSelectPicker('entries_realLeaEndTime',{
			selectModel:info.isHalfDayOff,
			value:  info.realLeaEndTime,
			isBeginTime:false,
			onchange:function(args){that.getRealLeaveLengthOfDay(args)},
			enumOptions: enumOptions
		});
	}
			
			
	// 计算 设置 请假确认单 中 实际请假开始时间  实际请假结束时间  之间的 时长
	,getRealLeaveLengthOfDay:function(){
	    var that = this;
		var personId = _personId;
		var beginTime = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime");
		var endTime = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime");
		if(!beginTime || !endTime){
			return;
		}
		beginTime = beginTime.length > 10 ? beginTime : beginTime + " 00:00:00";
		endTime = endTime.length > 10 ? endTime : endTime + " 00:00:00";
		if(beginTime>endTime){
			shr.showInfo({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_25});
			return;
		}
		var beginDate;
		var endDate;
		var leaveBillId = $('#entries_leaveEntryBill_el').val();
		if(!leaveBillId){
			return ;
		}
		if(!_isHalfDayOff){
			that.remoteCall({
				type:"post",
				async: false,
				method:"getRealLeaveLengthInfo",
				param:{beginTime:beginTime,
					endTime:endTime,
					leaveBillId:leaveBillId,
					isElasticCalLen:$("#entries_isElasticCalLen").shrCheckbox("isSelected")
				},
				success:function(res){
					info =  res;
					var day = parseFloat(info.leaveBillDays);
					day = day.toFixed(atsMlUtile.getSysDecimalPlace());
					atsMlUtile.setTransNumValue("entries_realLeaLength",day);
				}
			});
			return;
		}
		var param = {
			leaveBillId:leaveBillId,
			beginDate:beginTime.substring(0,10),
			endDate:endTime.substring(0,10),
			endTimetag:""
		}
		 beginTime = beginTime.substring(11,16);
		 endTime = endTime.substring(11,16);
		 if(beginTime == _defaultAmBeginTime){
			param.beginTime = jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_30
		 }else{
			param.beginTime = jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_43
		 };
		 if(endTime == _defaultAmEndTime){
			param.endTime  =  jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_30
		 }else{
		   param.endTime   = jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_43
		 };
		 //13:00  --- 13:00
		 var endTimetagObj = {};
		 endTimetagObj[_defaultAmBeginTime] = jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_33;
		 endTimetagObj[_defaultAmEndTime] =  jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_32;
		 endTimetagObj[_defaultPmBeginTime] =  jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_46;
		 endTimetagObj[_defaultPmEndTime] =  jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_45;
		 param.endTimetag  =  endTimetagObj[endTime] || "";
		that.remoteCall({
			type:"post",
			async: false,
			method:"getRealLeaveLengthOfDay",
			param:param,
			success:function(res){
				info =  res;
				var day = parseFloat(info.leaveBillDays);
				day = day.toFixed(atsMlUtile.getSysDecimalPlace());
				atsMlUtile.setTransNumValue("entries_realLeaLength",day);
			}
		});
		
	}
	,getShiftTime:function(date,beginOrEnd,amOrPm){
		var that = this;
		var personId = _personId;
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
	
	
	,setBillPerson:function(res){
        this.clearCCPersonIdsPrompt();
        $("#entries_person").shrPromptBox("setValue", {id: res.personId, name: res.person});
        this.initCcPersonPrompt();
	 	$("#entries_adminOrgUnit").attr('title',res.adminOrgUnit);
	 	$("#entries_adminOrgUnit").val(res.adminOrgUnit);
	 	
	}
	,setBeginAndEndTime:function(res){
		 atsMlUtile.setTransNumValue("entries_cancelLeaveLength",res.realLeaLength);
		 atsMlUtile.setTransNumValue("entries_realLeaLength",res.realLeaLength);
	}
	
	,EditShowStartEndTime:function(){
		 var that = this;
		var billId =  $("#id").val(); //新增和编辑界面都需要判断
		var info ;
		that.remoteCall({
			type:"post",
			method:"getCancelLeaveBillInfo",
			param:{billId:billId},
			success:function(res){
				info = res;
				atsMlUtile.setTransDateTimeValue('entries_realLeaBeginTime',res.realLeaBeginTime);
				atsMlUtile.setTransDateTimeValue('entries_realLeaEndTime',res.realLeaEndTime);
				atsMlUtile.setTransNumValue("entries_cancelLeaveLength",res.realLeaLength);
				atsMlUtile.setTransNumValue("entries_realLeaLength",res.realLeaLength);
			}
		});
		
	}
	,showAttachInfo:function(res){
		$("#viewAttatch_table").empty();
		var leaveBillId = res.id ;	
		var attach = res.attach ;		
		if(parseInt(attach) > 0)
		{
			var html = '';
			html += '<div class="row-fluid row-block " id="">';
			html += '	<div id="" class="span12 offset0 ">';
			html += '		<div>';
			html += '			<h5 class="groupTitle">'
				+ jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_5
				+ '</h5>';
			html += '			<div class="row-fluid row-block">';
			html += '				<div class="attachmentUploadArea">';
			html += '					<p><input id="attachment" formid="'+leaveBillId+'" class="attachment_style" type="file" name="uploadAttach"></p>';
			html += '					<div id="attachment_attachList">';
			html += '					</div>';
			html += '				</div>';
			html += '			</div>';
			html += '		</div>';
			html += '	</div>';
			html += '</div>';
			$("#viewAttatch_table").html(html);
			
			var attachJson = {
					id: "attachment",
					formId: leaveBillId,
					readonly: "true",
					name: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_29,
					onlyone: "false"
				};
			$('#attachment').shrAttachment(attachJson); 
		}
	},
	addALabelContainerHtml: function (labelName, labelValue) {
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
	}, 
	addARowBlockHtml: function (labelContainers_html) {
		return '<div class="row-fluid row-block">'
			+ '    <div class="row-fluid row-block flex-r flex-rw " >'
			+ labelContainers_html
			+ '   </div>'
			+ '</div>';
	}, 
	addLeaveBillInfoHtml: function (res) {
		var that = this ;
		var rowBlockHtml = '';
		rowBlockHtml += that.addALabelContainerHtml(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_12, res.number);
		rowBlockHtml += that.addALabelContainerHtml(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_48, res.person);
		var applyDate = atsMlUtile.dateToUserFormat(res.applyDate);
		rowBlockHtml += that.addALabelContainerHtml(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_26, applyDate);
		rowBlockHtml += that.addALabelContainerHtml(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_16, res.holidayPolicy);
		rowBlockHtml += that.addALabelContainerHtml(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_27, res.leaveLength);
		rowBlockHtml += that.addALabelContainerHtml(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_13, res.unit);
		var beginTime = atsMlUtile.dateTimeToUserFormat(res.beginTime, "TimeStamp", false, true);
		rowBlockHtml += that.addALabelContainerHtml(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_15, beginTime);
		var endTime = atsMlUtile.dateTimeToUserFormat(res.endTime, "TimeStamp", false, true);
		rowBlockHtml += that.addALabelContainerHtml(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_14, endTime);
		rowBlockHtml += that.addALabelContainerHtml(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_8, res.hrOrgUnitName);
		rowBlockHtml += that.addALabelContainerHtml(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_28, res.reason);
		rowBlockHtml = that.addARowBlockHtml(rowBlockHtml);
		return rowBlockHtml;
	}, 
	showLeaveBillInfo:function(res){
		var that = this ;
		_policyId = res.holidayPolicyId;
		if(that.getOperateState() !='VIEW')
		{   
			try{
			if(res.isElasticCalLen){
				$("#entries_isElasticCalLen").shrCheckbox("check");			
			}else{
				$("#entries_isElasticCalLen").shrCheckbox("unCheck");		
			}
			}catch(error){
			
			}
		}

		$("#viewLeaveBillInfo_table").html(that.addLeaveBillInfoHtml(res));
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
			if (billState==3 || jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_35==billState || billState ==4
				||jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_34==billState || billState ==2
				||jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_36==billState ) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1==billState || jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_41== billState || 2 == billState
				|| jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_36==billState ) { //未审批或审批中
				if(!this.isFromWF()){
					$("#edit").hide();
					$("#submit").hide();
					$("#submitEffect").hide();
				}
			}
		}
		// 团队-按钮控制
		if (!this.initData.teamEditAble) {
			$("#edit").hide();
			$("#submit").hide();
			$("#submitEffect").hide();
		}
		//隐藏提交生效按钮
		if (this.getOperateState().toUpperCase() == 'VIEW') {			
			$("#submitEffect").hide();
			if(billState == 0)
			{
		        $("#submit").show();
		    } else {
		    	$("#submit").hide();
		    }
			if(this.isFromWF()){ // 来自任务中心
				$('#workFlowDiagram').show();
				$('#auditResult').show();
				$('#cancelAll').hide();
				$("#submit").text(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_40);
				$('#edit').hide();
			}
		}
		//新增和编辑状态隐藏返回XX列表
		if (this.getOperateState().toUpperCase() == 'ADDNEW' || this.getOperateState().toUpperCase() == 'EDIT' ) {
			$("#returnToCancelLeaveBillList").hide();
		}
		
		//如果是工作流打回,界面上的"返回XX列表"不显示
		if (this.isFromWF()) {
			$("#returnToCancelLeaveBillList").hide(); 
			$("#cancel").hide(); 
		}
	}
	
	,returnToCancelLeaveBillListAction:function(){
	   this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.CancelLeaveBillList'
		});
	},
	initDefaultLeaveBill: function(){
		var that = this;
		that.remoteCall({
			type:"post",
			async: true,
			method:"getLeaveBillInfoById",
			param:{billId:leaveBillId},
			success:function(res){
				var defalutValue = {'id':leaveBillId, 'bill.number':res.number};
				if(shr.getUrlRequestParam("method") != "view"){
					$('#entries_leaveEntryBill').shrPromptBox("setValue",defalutValue);
				}
			}
		});
	},
	/*
	 *重写查看页面
	 */
	viewAction: function(options) {
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
		if(isFromPage == "Leave"){//如果请假确认是从请假单列表中点击进入的话，要带上参数。
		   param.isFromPage = "Leave";
		}
		if(leaveBillId){
			 param.leaveBillId = leaveBillId;
		}
		this.reloadPage(param);
	},
	/**重写编辑，当请假确认来自请假单列表的时候要带上参数*/
	doEdit: function(method, options) {
		if (!$.isPlainObject(options)) {
			options = {};
		}
		options.method = method;
		if ($.isEmptyObject(this.billId)) {
			options.method = 'addNew'; 
		}	
		if(isFromPage == "Leave"){//如果请假确认是从请假单列表中点击进入的话，要带上参数。
		   options.isFromPage = "Leave";
		}
		if(leaveBillId){
			 options.leaveBillId = leaveBillId;
		}
		// 加载内容
		this.reloadPage(options);	
	}
	,isInitialLeaveLengthEdit : function(){
		var that = this ;
		if (that.getOperateState() != 'VIEW'){
			if($("#entries_leaveEntryBill").val()!=""){
				var billId = $("#entries_leaveEntryBill_el").val();
				that.remoteCall({
					type:"post",
					method:"isInitialLeaveLengthEdit",
					param:{billId:billId},
					async: true,
					success:function(res){
						var info = res;
						if(info.errorString){
							shr.showWarning({message: info.errorString});
						}else{
							if(info.editable=='true'){
								$("#entries_realLeaLength").removeAttr('readonly').removeAttr('disabled');
								$("#entries_realLeaLength").parent().removeClass("disabled");
							}else{
								$("#entries_realLeaLength").attr("readonly","readonly");
								$("#entries_realLeaLength").parent().addClass("disabled");
							}
						}
					}
				});
			}
		}
	}
	//请假长度可否编辑
	,isLeaveLengthEdit : function(res){
		var that = this ;
		if (that.getOperateState() != 'VIEW'){
			var personId = res.personId;
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
							$("#entries_realLeaLength").removeAttr('readonly').removeAttr('disabled');
							$("#entries_realLeaLength").parent().removeClass("disabled");
						}else{
							$("#entries_realLeaLength").attr("readonly","readonly");
							$("#entries_realLeaLength").parent().addClass("disabled");
						}
					}
				}
			});
		}
	 }
	,beforeSubmit :function(){
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		var validateResult = false;
		if (($form.valid() && _self.verify())) {
			_self.billCheckAct(function(res){
				var result = res.result;
				if(result==""){
					validateResult = true;
				}else{
					shr.showConfirm(result+jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_39,function(){
						return true;
					});
				}
			},false);
		}
		return validateResult ;
	}
	
	,getCurrentModel : function(){
		
		var that = this ;
		var model = shr.ats.team.TeamCancelLeaveBillEdit.superClass.getCurrentModel.call(this);
		var realLeaBeginTime = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime");
		var realLeaEndTime = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime");
		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(realLeaBeginTime)))
		{
		  model.entries[0].realLeaBeginTime = realLeaBeginTime+":00";
		}
		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(realLeaEndTime)))
		{
		  model.entries[0].realLeaEndTime = realLeaEndTime+":00";
		}
        model.ccPersonIds = model.ccPersonIds && model.ccPersonIds.id || "";
        model.ccPerson = model.ccPersonIds;
		return model ;
	}
	,validateIsCancelLeave : function(){
		var that = this;
		that.remoteCall({
			type:"post",
			async: false,
			method:"validateIsCancelLeave",
			param:{billId:$("#entries_leaveEntryBill_el").val()},
			success:function(res){
				
			}
		});
	}
	,isExistsAttanceFile : function(){
		var _self = this ;
		var personNum = "";
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.CancelLeaveBillForm") {
			if("ADDNEW" == this.getOperateState() || "EDIT" == this.getOperateState()){
		 		personId = $("#entries_person_el").val();
		 	}else if("VIEW" == this.getOperateState()){
		 		personId = $($("#entries_person").prop("outerHTML")).attr('value');
		 	}
		}else{
			personId = _personId;////专员请假确认单校验档案取请假单上申请人的id
		}
		
	 	var isExistsFile = true;
		_self.remoteCall({
			type:"post",
			method:"isExistsAttanceFile",
			async: false,
			param:{personId: personId},
			success:function(res){
				var info =  res;
				if (!info.isExistsFile){
					if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.CancelLeaveBillForm") {
						shr.showWarning({message:jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_3});
					}else{
						shr.showWarning({message:jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_6});
					}
					isExistsFile =  false;
				}
			}
		});
		return isExistsFile;
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
				 if($('#entries_leaveEntryBill_el').val()){
					that.getRealLeaveLengthOfDay();
				 }
			});
	    }
	}
	,showIsElasticCalCtrl:function(){
		var that = this ;
    	var personId = $("#entries_person_el").val() || $("#entries_person").val();
    	var beginTime = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime")|| '';
	    var endTime = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime") || '';
    	shr.atsBillUtil.showIsElasticCalCtrl(that,personId,_policyId,beginTime,endTime);
		    
	}
	,addSocQueryTips:function(){
		var that = this;
		shr.atsBillUtil.addSocQueryTipA("tipsIsElasticCal");
	}
	,showTips:function(){
		//此处选择器中用中文括号，页面上是中文
		$("[title='" + jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_2 + "']")
			.append('<span id="tipsIsElasticCal"></span>');
		var tipsIsElasticCalText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_9
			+ '<br/>';
		var tipsIsElasticCalLog = '<div id="tipsIsElasticCal-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;height:100px;position:absolute;left:15%;z-index:1;margin-top:0px;background: aliceblue;"><div style="position:absolute"><font color="gray">'+tipsIsElasticCalText+'</font></div></div>';
		//此处选择器中用中文括号，页面上是中文
		$("[title='" + jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_2 + "']").after(tipsIsElasticCalLog);
	}

});

 
 








