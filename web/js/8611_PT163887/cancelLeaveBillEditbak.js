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
shr.defineClass("shr.ats.CancelLeaveBillEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.CancelLeaveBillEdit.superClass.initalizeDOM.call(this);
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
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.CancelLeaveBillForm"){
			//that.isExistsAttanceFile();
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
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime").split(" ")[0];
			var personId = $("#entries_person_el").val();	
			var billType = "cancel";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: true,
				success:function(res){
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
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime").split(" ")[0];
			var personId = $("#entries_person_el").val();	
			var billType = "cancel";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: true,
				success:function(res){
					var result = res.result;
					if(result==""){
						if(_isHalfDayOff){
							atsMlUtile.setTransDateTimeValue('entries_realLeaBeginTime',$('#entries_realLeaBeginTime-time').val()+" "+$('#entries_realLeaBeginTime-ap_el').val());
							atsMlUtile.setTransDateTimeValue('entries_realLeaEndTime',$('#entries_realLeaEndTime-time').val()+" "+$('#entries_realLeaEndTime-ap_el').val());
							//alert($('#entries_realLeaBeginTime').val());
						}	
						_self.doSave(event, 'save');
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_39,function(){
							if(_isHalfDayOff){
								atsMlUtile.setTransDateTimeValue('entries_realLeaBeginTime',$('#entries_realLeaBeginTime-time').val()+" "+$('#entries_realLeaBeginTime-ap_el').val());
								atsMlUtile.setTransDateTimeValue('entries_realLeaEndTime',$('#entries_realLeaEndTime-time').val()+" "+$('#entries_realLeaEndTime-ap_el').val());
								//alert($('#entries_realLeaBeginTime').val());
							}	
							_self.doSave(event, 'save');
						});
					}
				}
			});	
		}	
	}
	,submitAction: function(event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		var flag = false ;
		
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
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime").split(" ")[0];
			var billType = "cancel";
			var personId = $("#entries_person_el").val();	
			if(personId==null){
				personId =$("#entries_person").val();
			}
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: false,
				success:function(res){
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
				}
			});
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
		if(_self.getOperateState() =='VIEW')
		{   
			model.entries={};
		}
		data.model = shr.toJSON(model); 

		
		
		// relatedFieldId
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
		/*var that = this ;
	 	window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.CancelLeaveBillList";*/
	 	if(isFromPage == "Leave"){//来自请假单的请假确认
		 
		 this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsLeaveBillList'
		 });
		}else{
	 	 this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.CancelLeaveBillList',
			serviceId:	'5L3cnB8HSta4vQ/lBrHWlvI9KRA='
		 });
		}
	}
	//专员的取消按钮 返回专员的列表
	,cancelAllAction:function(){
		/*var that = this ;
	 	window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.CancelLeaveBillAllList";*/
	 	if(isFromPage == "Leave"){
			this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList'
		});
		}else{
	 	  this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.CancelLeaveBillAllList'
		  });
		}
	}
	
	//根据时间填写的 实际请假开始时间 和 实际请假结束时间 计算请假确认的时间长度
	,calculateCancelLeaveLength:function(){
		var that = this ;
		$("#entries_realLeaEndTime").change(function(){
			//that.calculateCancelLeaveLengthSub();
			that.getRealLeaveLengthOfDay();
		});
		$("#entries_realLeaBeginTime").change(function(){
			//that.calculateCancelLeaveLengthSub();
			that.getRealLeaveLengthOfDay();
		});
	}
	,calculateCancelLeaveLengthSub:function(){
		var begintime = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime");
		var endtime = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime");
		if ( begintime!=""&&begintime!=null && endtime!=""&& endtime!=null ) {
			var regEx = new RegExp("\\-","gi");
			begintime = begintime.replace(regEx,"/");
		 	endtime = 	endtime.replace(regEx,"/");
		 	var beginTimeOfDate = new Date(begintime); 
		 	var endTimeOfDate = new Date(endtime);
		 	var longTime = endTimeOfDate.getTime() - beginTimeOfDate.getTime();
		 	//以天为单位
		 	var day = parseFloat(longTime)/1000.0/60/60/24;
		 	day = day.toFixed(atsMlUtile.getSysDecimalPlace());
		 	atsMlUtile.setTransNumValue("entries_cancelLeaveLength",day);
		 	atsMlUtile.setTransNumValue("entries_realLeaLength",day);
		}
	}
	/**
	 * 增加保存验证
	 * @return {Boolean}
	 */
	,verify:function(){
		var that = this;
		var realbeginTime = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime");
		var realendTime = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime");
		if(_isHalfDayOff){
			beginDate = $("#entries_realLeaBeginTime-time").val();
			endDate   = $("#entries_realLeaEndTime-time").val();
			beginTime = $("#entries_realLeaBeginTime-ap").val().substring(3);
			endTime = $("#entries_realLeaEndTime-ap").val().substring(3);
			realbeginTime =  beginDate +" "+ beginTime + ":00";
			realendTime   =  endDate   +" "+ endTime   + ":00";
		}
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
	    //if(info.addFlag > 0) {
		  //shr.showError({message: "在编号为["+info.billNo+"]的请假确认单中,存在时间重叠的记录：["+info.personName+",开始时间："+info.realBeginDate+" 结束时间："+info.realEndDate+" ]"});
		  //return false;
		//}else 
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
		else{
			return true;
		}
	}
	//新增界面选择请假单的时候触发的函数
	,processLeaveBillF7ChangeEvent : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					$("#entries_leaveEntryBill").shrPromptBox("setFilter"," ( hrOrgUnit.id = '"+info.id+"' )");
				}
			});
			
			$("#entries_leaveEntryBill").shrPromptBox("option", {
				onchange : function(e, value) {
				_isCancelLeave = false;
				var info = value.current;
				if(info != null){

				    if(info.hasOwnProperty("id")){
						//value.current = Object {number: "2222", applyDate: "2013-11-11", id: "VbjxMCd0RNGa8Q96A36yaaDzlng="}
						var billId = info.id;
						atsMlUtile.setTransDateTimeValue("entries_realLeaBeginTime","");
						atsMlUtile.setTransDateTimeValue("entries_realLeaEndTime","");
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
									}
								});
							}
						});
				    }
				}
					
				}
			});
			$("#entries_leaveEntryBill").change(function(){
				that.showIsElasticCalCtrl();
			});
		}
	}
	//新建、编辑请假确认单，选择请假单时，根据请假单刷新假期业务在氐
	,refreshHROrgUnit:function(res){
		var hrOrgUnitName = res.hrOrgUnitName;
		var hrOrgUnitId = res.hrOrgUnitId;
		$("#hrOrgUnit").shrPromptBox("setValue",{id:hrOrgUnitId,name:hrOrgUnitName});
	}
	,getCancelLeaveBillInfo:function(){
		var that = this;
		var personId = $("#entries_person_el").val();
		var begin_Time = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime");
		var end_Time = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime");
		if(_isHalfDayOff){		
			begin_Time = $('#entries_realLeaBeginTime-time').val()+" "+$('#entries_realLeaBeginTime-ap').val().substring(3);			
			end_Time = $('#entries_realLeaEndTime-time').val()+" "+$('#entries_realLeaEndTime-ap').val().substring(3);
		}
		var realLeaLength = atsMlUtile.getFieldOriginalValue("entries_realLeaLength");
		var leaveBillId = $("#entries_leaveEntryBill_el").val();//请假单的ID
		if(that.getOperateState() == 'VIEW')
		{
			realLeaLength = atsMlUtile.getFieldOriginalValue("entries_realLeaLength");
			leaveBillId = $("#entries_leaveEntryBill").attr("value");//请假单的ID
		}

		var billId =  $("#id").val(); //新增和编辑界面都需要判断

		var info ;
		that.remoteCall({
			type:"post",
			async: false,
			method:"getCancelLeaveBillInfoByPersonIdAndCancelLeaveTime",
			param:{personId:personId,begin_Time:begin_Time,end_Time:end_Time,billId:billId,realLeaLength:realLeaLength,leaveBillId:leaveBillId},
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
					uipk: "com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList"
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
					uipk: "com.kingdee.eas.hr.ats.app.CancelLeaveBillAllList"
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
						that.setBillPerson(res);
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
					
					//屏蔽   上下午 那种请假单开始结束时间
					//_isHalfDayOff = false;
					//info.isHalfDayOff = false;
					
					that.setHalfDayOff(info);
				}
			});
		
		}
		// 判断是否启动半天假  并相应加载对应页面
		,setHalfDayOff : function(info){
				var that = this;
				if(info.isHalfDayOff){
					//设置 上下午上下班默认时间
				_defaultAmBeginTime = info.amBeginTime;
				_defaultAmEndTime = info.amEndTime;
				_defaultPmBeginTime = info.pmBeginTime;
				_defaultPmEndTime = info.pmEndTime;
				
				$('#entries_realLeaBeginTime').closest('.field-ctrl').eq(0).html('<div id="entries_realLeaBeginTime" ctrlrole="dateSpanPicker" >'
					+'<div class="dataSpan-time">'
					+'<div class="ui-datepicker-layout">'
					+'<input id="entries_realLeaBeginTime-time" class="input-height" type="text" validate="{required:true}" name="entries.realLeaBeginTime-time" ctrlrole="datepicker">'
					+'</div>'
					+'</div>'
					+'<div class="dataSpan-ap">'
					//+'<div class="ui-select-layout">'
					//+'<input id="entries_realLeaBeginTime-ap_el" type="hidden"  name="entries.realLeaBeginTime-ap_el">'
					+'<input id="entries_realLeaBeginTime-ap" class="input-height cursor-pointer" type="text" validate="{required:true}" name="entries.realLeaBeginTime-ap" ctrlrole="select">'
					//+'</div>'
					+'</div>'
					+'<input class="dateSpanPicker" type="hidden" name="entries.realLeaBeginTime">'
					+'</div>'
					+'<script type="text/javascript">'
					+'$(function() {'
					+'var dateSpanPicker_json = {'
					+'id: "entries_realLeaBeginTime",'
					+'readonly: "",'
					+'value: "' + info.realLeaBeginTime + '",'
					+'onChange: null,'
					+'ctrlType: "Date",'
					+'isAutoTimeZoneTrans: false,'
					+'beginOrEnd: "begin",'
					+'enumOptions: "[{\\"value\\": \\"09:00-12:00\\", \\"alias\\": \\"'
					+ jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_31
					+ " " + _defaultAmBeginTime+'\\"},{\\"value\\": \\"12:00-13:00\\", \\"alias\\": \\"'
					+ jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_44
					+ " " + _defaultPmBeginTime+'\\"}]",'
					+'validate: "{required:true}"'
					+'};'
					+'$("#entries_realLeaBeginTime").shrDateSpanPicker(dateSpanPicker_json);'
					+'});'
					+'</script>');
					
					$('#entries_realLeaEndTime').closest('.field-ctrl').eq(0).html('<div id="entries_realLeaEndTime" ctrlrole="dateSpanPicker" >'
					+'<div class="dataSpan-time">'
					+'<div class="ui-datepicker-layout">'
					+'<input id="entries_realLeaEndTime-time" class="input-height" type="text" validate="{required:true}" name="entries.realLeaEndTime-time" ctrlrole="datepicker">'
					+'</div>'
					+'</div>'
					+'<div class="dataSpan-ap">'
					//+'<div class="ui-select-layout">'
					//+'<input id="entries_realLeaEndTime-ap_el" type="hidden"  name="entries.realLeaEndTime-ap_el">'
					+'<input id="entries_realLeaEndTime-ap" class="input-height cursor-pointer" type="text" validate="{required:true}" name="entries.realLeaEndTime-ap" ctrlrole="select">'
					//+'</div>'
					+'</div>'
					+'<input class="dateSpanPicker" type="hidden" name="entries.realLeaEndTime">'
					+'</div>'
					+'<script type="text/javascript">'
					+'$(function() {'
					+'var dateSpanPicker_json = {'
					+'id: "entries_realLeaEndTime",'
					+'readonly: "",'
					+'value: "' + info.realLeaEndTime + '",'
					+'onChange: null,'
					+'ctrlType: "Date",'
					+'isAutoTimeZoneTrans: false,'
					+'beginOrEnd: "end",'
					+'enumOptions: "[{\\"value\\": \\"09:00-12:00\\", \\"alias\\": \\"'
						+ jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_31
						+ " " +  _defaultAmBeginTime+'\\"},{\\"value\\": \\"09:00-12:00\\", \\"alias\\": \\"'
						+ jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_31
						+ " " + _defaultAmEndTime+'\\"},{\\"value\\": \\"12:00-13:00\\", \\"alias\\": \\"'
						+ jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_44
						+ " " + _defaultPmBeginTime+'\\"},{\\"value\\": \\"12:00-13:00\\", \\"alias\\": \\"'
						+ jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_44
						+ " " + _defaultPmEndTime+'\\"}]",'
					+'validate: "{required:true}"'
					+'};'
					+'$("#entries_realLeaEndTime").shrDateSpanPicker(dateSpanPicker_json);'
					+'});'
					+'</script>');
				
				//选择时间自动带出上午和下午 设置控件监听事件
				that.setBeginOrEnd();	
				}else {
					$('#entries_realLeaBeginTime').closest('.field-ctrl').eq(0).html('<div class="ui-datepicker-frame required" style="border: none">'
					+'<input id="entries_realLeaBeginTime" class="block-father input-height" type="text" dataextenal="" placeholder=""' 
					+' value="" name="entries.realLeaBeginTime" ctrlrole="datetimepicker">'
					+'<div class="ui-datepicker-icon">'
					+'</div>'
					);
					
					$('#entries_realLeaEndTime').closest('.field-ctrl').eq(0).html('<div class="ui-datepicker-frame required" style="border: none">'
					+'<input id="entries_realLeaEndTime" class="block-father input-height" type="text" dataextenal="" placeholder=""' 
					+'value="" name="entries.realLeaEndTime" ctrlrole="datetimepicker">'
					+'<div class="ui-datepicker-icon">'
					+'</div>'
					);
					var dateTimePicker_json = {};
					dateTimePicker_json.readonly = '';
					dateTimePicker_json.validate = '{required:true}';
					dateTimePicker_json.ctrlType = "TimeStamp";
					dateTimePicker_json.isAutoTimeZoneTrans = false;
					dateTimePicker_json.validate = "{required:true}";
					$('#entries_realLeaBeginTime').shrDateTimePicker(dateTimePicker_json);
					$('#entries_realLeaEndTime').shrDateTimePicker(dateTimePicker_json);
					// 监听控件改变事件
				that.calculateCancelLeaveLength();
				}
			
			
	}
			
			
	// 计算 设置 请假确认单 中 实际请假开始时间  实际请假结束时间  之间的 时长
	,getRealLeaveLengthOfDay:function(){
	    var that = this;
		var personId = _personId;
		var beginTime;
		var endTime;
		var beginDate;
		var endDate;
		var leaveBillId = $('#entries_leaveEntryBill_el').val();
		if(_isHalfDayOff){
		 beginDate = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime-time");
		 endDate = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime-time");
		 beginTime = $("#entries_realLeaBeginTime-ap").val().substring(3);
		 endTime = $("#entries_realLeaEndTime-ap").val().substring(3);
		 endTimetag = "";
		 //beginDate = $("#entries_beginTime-time").val();
		 // endDate = $("#entries_endTime-time").val();
		 if($("#entries_realLeaBeginTime-ap").val()!=""&& $("#entries_realLeaBeginTime-ap").val()!=null 
				&& $("#entries_realLeaEndTime-ap").val()!=""&& $("#entries_realLeaEndTime-ap").val()!=null){
		 	
		 	 if($("#entries_realLeaBeginTime-ap").val().substring(3) == _defaultAmBeginTime){
		 	 	beginTime = jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_30
		 	 }else{
		 	 	beginTime = jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_43
		 	 };
		 	 if($("#entries_realLeaEndTime-ap").val().substring(3) == _defaultAmEndTime){
		 	 	endTime  =  jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_30
		 	 }else{
		 	   endTime   = jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_43
		 	 };
		 	 //13:00  --- 13:00
		 	 if($("#entries_realLeaEndTime-ap").val().substring(3) == _defaultAmBeginTime){
		 	 	endTimetag  =  jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_33
		 	 }else if($("#entries_realLeaEndTime-ap").val().substring(3) == _defaultAmEndTime){
		 	 	endTimetag  =  jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_32
		 	 }else if($("#entries_realLeaEndTime-ap").val().substring(3) == _defaultPmBeginTime){
		 	 	endTimetag  =  jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_46
		 	 }else if($("#entries_realLeaEndTime-ap").val().substring(3) == _defaultPmEndTime){
		 	 	endTimetag  =  jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_45
		 	 }
		    //  endTime = $("#entries_endTime-ap").val();
					
		 }
		//if ( beginTime!=""&&beginTime!=null && endTime!=""&& endTime!=null ) {
		if($("#entries_realLeaBeginTime-time").val()!=""&&$("#entries_realLeaBeginTime-time").val()!=null 
				&& $("#entries_realLeaEndTime-time").val()!=""&& $("#entries_realLeaEndTime-time").val()!=null 
				&& $("#entries_realLeaBeginTime-ap").val()!=""&& $("#entries_realLeaBeginTime-ap").val()!=null 
				&& $("#entries_realLeaEndTime-ap").val()!=""&& $("#entries_realLeaEndTime-ap").val()!=null){ 
			
		 	
			var regEx = new RegExp("\\/","gi");
			//beginTime = beginTime.replace(regEx,"-");
		 	//endTime = 	endTime.replace(regEx,"-");
			if(beginDate>endDate){
				shr.showInfo({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_25});
				return;
			}
		 	that.remoteCall({
			type:"post",
			async: false,
			method:"getRealLeaveLengthOfDay",
			param:{beginDate:beginDate,endDate:endDate,beginTime:beginTime,endTime:endTime,leaveBillId:leaveBillId,endTimetag:endTimetag},
			success:function(res){
				info =  res;
			var day = parseFloat(info.leaveBillDays);
		 	day = day.toFixed(atsMlUtile.getSysDecimalPlace());
		 	atsMlUtile.setTransNumValue("entries_realLeaLength",day);
			}
		});
		
		}
		
		}else{
		if(atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime")!=""&&atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime")!=null
				&& atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime")!=""&& atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime")!=null){
			beginTime = atsMlUtile.getFieldOriginalValue('entries_realLeaBeginTime');
			endTime = atsMlUtile.getFieldOriginalValue('entries_realLeaEndTime');
			beginTime = beginTime.replace("\\/","-");
		 	endTime = 	endTime.replace("\\/","-");
		 	
		 	if(beginTime>endTime){
		 		shr.showInfo({message: jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_25});
				return;
			}
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
		}
		
		}
		
		
	}		
	,setBeginOrEnd:function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#entries_realLeaBeginTime-time").change(function(){
				if (that._unitType == 2||$("#entries_remark").val()==jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_47 ||
					that._unitType == 3||$("#entries_remark").val()==jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_4 ||
					that._unitType == 4 || $("#entries_remark").val()==jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_1 ) {
					//alert($("#entries_remark").val()+that._unitType);
					$("#entries_realLeaBeginTime-ap").val("");
					$("#entries_realLeaBeginTime-ap_el").val("");
				}else{
					
					
					$("#entries_realLeaBeginTime-ap").val(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_31 + " " +_defaultAmBeginTime);
					$("#entries_realLeaBeginTime-ap_el").val(_defaultAmBeginTime);
				}
				that.getRealLeaveLengthOfDay();
			});
			$("#entries_realLeaEndTime-time").change(function(){
				if (that._unitType == 2||$("#entries_remark").val()==jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_47 ||
					that._unitType == 3||$("#entries_remark").val()==jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_4 ||
					that._unitType == 4 || $("#entries_remark").val()==jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_1 ) {
					$("#entries_realLeaEndTime-ap").val("");
					$("#entries_realLeaEndTime-ap_el").val("");
				}else{
					
					
					$("#entries_realLeaEndTime-ap").val(jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_44 + " " + _defaultPmEndTime);
					$("#entries_realLeaEndTime-ap_el").val(_defaultPmEndTime);
					
				}
				that.getRealLeaveLengthOfDay();
			});
			$("#entries_realLeaBeginTime-ap").change(function(){
				$("#entries_realLeaBeginTime-ap_el").val($("#entries_realLeaBeginTime-ap").val().substring(3));
				that.getRealLeaveLengthOfDay();
			});
			//实际结束时间触发事件
			$("#entries_realLeaEndTime-ap").change(function(){
			
			$("#entries_realLeaEndTime-ap_el").val($("#entries_realLeaEndTime-ap").val().substring(3));
				that.getRealLeaveLengthOfDay();
			});
			
		}
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
	 	$("#entries_person").val(res.person);
	 	$("#entries_person_el").val(res.personId);
	 	$("#entries_adminOrgUnit").attr('title',res.adminOrgUnit);
	 	$("#entries_adminOrgUnit").val(res.adminOrgUnit);
	 	
	}
	,setBeginAndEndTime:function(res){
		 var that = this;
		 
	 	  if(_isHalfDayOff){
		  $('#entries_realLeaBeginTime-time_el').val(res.realLeaBeginTime.substring(0,10));
		  $('#entries_realLeaEndTime-time_el').val(res.realLeaEndTime.substring(0,10));
		  $('#entries_realLeaBeginTime-time').val(res.realLeaBeginTime.substring(0,10));
		  $('#entries_realLeaEndTime-time').val(res.realLeaEndTime.substring(0,10));
		   
		  $('#entries_realLeaBeginTime-ap_el').val(res.realLeaBeginTime.substring(11,16));
		  $('#entries_realLeaEndTime-ap_el').val(res.realLeaEndTime.substring(11,16));
		  
		  var preBeginTime = res.realLeaBeginTime.substring(11,13)<=12?jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_31
			  :jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_44;
		  var preEndTime = res.realLeaEndTime.substring(11,13)<=12?jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_31
			  :jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_44;
		  $('#entries_realLeaBeginTime-ap').val(preBeginTime + " " + res.realLeaBeginTime.substring(11,16));
		  $('#entries_realLeaEndTime-ap').val(preEndTime + " " +  res.realLeaEndTime.substring(11,16));
		  }else{
		atsMlUtile.setTransDateTimeValue("entries_realLeaBeginTime",res.realLeaBeginTime.substring(0,16));
		atsMlUtile.setTransDateTimeValue("entries_realLeaEndTime",res.realLeaEndTime.substring(0,16));
		  }
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
				
	 	  if(_isHalfDayOff){
		  
		   $('#entries_realLeaBeginTime-time_el').val(res.realLeaBeginTime.substring(0,10));
		  $('#entries_realLeaEndTime-time_el').val(res.realLeaEndTime.substring(0,10));
		  $('#entries_realLeaBeginTime-time').val(res.realLeaBeginTime.substring(0,10));
		  $('#entries_realLeaEndTime-time').val(res.realLeaEndTime.substring(0,10));
		   
		  $('#entries_realLeaBeginTime-ap_el').val(res.realLeaBeginTime.substring(11,16));
		  $('#entries_realLeaEndTime-ap_el').val(res.realLeaEndTime.substring(11,16));
		  
		  
		  var preBeginTime = res.realLeaBeginTime.substring(11,13)<=12?jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_31
			  :jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_44;
		  var preEndTime = res.realLeaEndTime.substring(11,13)<=12?jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_31
			  :jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_44;
		  $('#entries_realLeaBeginTime-ap').val(preBeginTime + res.realLeaBeginTime.substring(11,16));
		  $('#entries_realLeaEndTime-ap').val(preEndTime + res.realLeaEndTime.substring(11,16));

		  }else{
			atsMlUtile.setTransDateTimeValue("entries_realLeaBeginTime",res.realLeaBeginTime.substring(0,16));
			atsMlUtile.setTransDateTimeValue("entries_realLeaEndTime",res.realLeaEndTime.substring(0,16));
		  }
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
	}
	, addALabelContainerHtml: function (labelName, labelValue) {
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
	}, addARowBlockHtml: function (labelContainers_html) {
		return '<div class="row-fluid row-block">'
			+ '    <div class="row-fluid row-block flex-r flex-rw " >'
			+ labelContainers_html
			+ '   </div>'
			+ '</div>';
	}, addLeaveBillInfoHtml: function (res) {
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
	}, showLeaveBillInfo:function(res){
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
//		if (billState) {
//			if (billState==3 || "审批通过"==billState || billState ==4||"审批不通过"==billState || billState ==2||"审批中"==billState ) {
//				$("#edit").hide();
//				$("#submit").hide();
//				$("#submitEffect").hide();
//			} else if (1==billState || "未审批"== billState ) { //未审批 
//				if(!this.isFromWF()){//未审批 _不是来自workflow（提交者） 不能修改 ；未审批 _来自workflow（审批者） 可修改
//					$("#edit").hide();
//					$("#submit").hide();
//					$("#submitEffect").hide();
//				}
//			}
//			
//			if(0==billState || "未提交"== billState){
//			      $("#workFlowDiagram").hide();
//				  $("#auditResult").hide();
//			}else if(1==billState || "未审批"== billState){
//				  $("#auditResult").hide();
//			}
//			
//		}
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
				$('#entries_leaveEntryBill').shrPromptBox("setValue",defalutValue);
				
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
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime").split(" ")[0];
			var personId = $("#entries_person_el").val();	
			var billType = "cancel";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: false,
				success:function(res){
					var result = res.result;
					if(result==""){
						validateResult = true;
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_cancelLeaveBillEdit_i18n_39,function(){
							return true;
						});
					}
				}
			});
		}
		// return false 也能保存，固让js报错，后续让eas修改 return false 逻辑
		//var len = workArea.length() ;
		return validateResult ;
	}
	
	,getCurrentModel : function(){
		
		var that = this ;
		var model = shr.ats.CancelLeaveBillEdit.superClass.getCurrentModel.call(this);
		var realLeaBeginTime = model.entries[0].realLeaBeginTime ;
		var realLeaEndTime = model.entries[0].realLeaEndTime;
		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(realLeaBeginTime)))
		{
		  model.entries[0].realLeaBeginTime = realLeaBeginTime+":00";
		}
		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(realLeaEndTime)))
		{
		  model.entries[0].realLeaEndTime = realLeaEndTime+":00";
		}
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
		
    	var personId = $("#entries_person_el").val()==""||$("#entries_person_el").val()==undefined?$("#entries_person").val():$("#entries_person_el").val();
    	var beginTime = atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime") ==""?atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime-time"):atsMlUtile.getFieldOriginalValue("entries_realLeaBeginTime");
	    var endTime = atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime") ==""?atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime-time"):atsMlUtile.getFieldOriginalValue("entries_realLeaEndTime");
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

 
 








