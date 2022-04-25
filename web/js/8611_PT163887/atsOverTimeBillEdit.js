shr.defineClass("shr.ats.AtsOverTimeBillEdit", shr.framework.Edit, {
	_uiClass:"",
	effectiveFlag:true,
	isOTControl:false,
	isOtrolByDateType:false,
	defaultOTCompens:null,
	personId : "",
	_ATS_OVERTIME_LEGALHOLIDAYDAY_OVERTIME_ID: "sRWUOt7sRpOY0TCo6NMqGY6C/nU=", //法定节假日id   来源于AtsServerUtils.java
	_ATS_OVERTIMECOMPENS_OVERTIME_ID: "zkbt5bMLQ3ehUivmKbtBOqlrTmA=", //加班费id
	_invariantVale: {id:"zkbt5bMLQ3ehUivmKbtBOqlrTmA=",
		name:jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_8},
	initalizeDOM:function(){
		shr.ats.AtsOverTimeBillEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		that.setNavigateLine();
		var paramMethod = shr.getUrlRequestParam("method");
     	//从我要加班菜单中点击进来的URL上没有method参数
     	if(paramMethod == null){
			$("#breadcrumb").find(".active").text(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_24);
			if(shrDataManager.pageNavigationStore.getDatas().length==0){
     	    	//  var url = window.location.protocol +"//" + window.location.host + ":" + window.location.port
				//  		+ "/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.CancelLeaveBillForm&inFrame=true&fromHeader=true";
				 var object_bread_1 = {
     	    			name: jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_24,
     	    			url: window.location.href,
     	    			workPlatformId: "Qz9UfhLqB0+vmMJ4+80EykRLkh4="
     	    	}
     	    	shrDataManager.pageNavigationStore.pop();
				shrDataManager.pageNavigationStore.addItem(object_bread_1);
     	    }
     	}
		that.getOTContrlParams();
		that.setButtonVisible(); //初始化页面安装状态,如果是已经提交的或者审批通过的单据编辑按钮不显示
		//隐藏加班列表按钮
		if (that.getOperateState() == 'EDIT' || that.getOperateState() == 'VIEW') {
			if(that.isFromWF()){ // 来自流程中心
				$('#cancel').hide();
				$('#cancelAll').hide();
				if (that.getOperateState() == 'EDIT'){
					$("#hrOrgUnit").shrPromptBox("disable");
				}
			}
		}
		that.processF7ChangeEvent();

		//增加业务组织处理
		that.processF7ChangeEventHrOrgUnit();

		that.processApplyOTTime();

		if(that.getOperateState() == "VIEW"){//不显示秒
			if(atsMlUtile.getFieldOriginalValue("entries_startTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_startTime",atsMlUtile.getFieldOriginalValue("entries_startTime").substring(0,16));
			}
			if(atsMlUtile.getFieldOriginalValue("entries_endTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_endTime",atsMlUtile.getFieldOriginalValue("entries_endTime").substring(0,16));
			}
			if(atsMlUtile.getFieldOriginalValue("entries_realStartTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_realStartTime",atsMlUtile.getFieldOriginalValue("entries_realStartTime").substring(0,16));
			}
			if(atsMlUtile.getFieldOriginalValue("entries_realEndTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_realEndTime",atsMlUtile.getFieldOriginalValue("entries_realEndTime").substring(0,16));
			}
		}else{
			if(atsMlUtile.getFieldOriginalValue("entries_startTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_startTime",atsMlUtile.getFieldOriginalValue("entries_startTime").substring(0,16));
			}
			if(atsMlUtile.getFieldOriginalValue("entries_endTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_endTime",atsMlUtile.getFieldOriginalValue("entries_endTime").substring(0,16));
			}
			if(atsMlUtile.getFieldOriginalValue("entries_realStartTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_realStartTime",atsMlUtile.getFieldOriginalValue("entries_realStartTime").substring(0,16));
			}
			if(atsMlUtile.getFieldOriginalValue("entries_realEndTime")!=""){
				atsMlUtile.setTransDateTimeValue("entries_realEndTime",atsMlUtile.getFieldOriginalValue("entries_realEndTime").substring(0,16));
			}
		}
		//新增页面的时候默认算出,编辑页面不计算
		if ( that.getOperateState() == "ADDNEW" ) {
			//默认值为当前申请天
			//var otDate=$('#applyDate').val()||'';
			//默认值为工作日
			var otDate=atsMlUtile.getFieldOriginalValue('entries_otDate')||'';
	    	var personId=$('#entries_person_el').val()||'';
	    	that.getOverTimeType(otDate,personId);
			that.calculataApplyOTTime();
		}
		/*$("#entries_restTime").blur(function(){
			that.calculataApplyOTTime();
		});*/

		//处理时间加班开始时间与加班开始时间一致
		that.realOverTimeSynOverTime();
		that.changeOverTimeType();
		that.setNumberFieldEnable();

		var personId = $('#entries_person_el').val();
		var otTypeId = $("#entries_otType_el").val();
		if ( that.getOperateState()=="VIEW"){
			personId = $('#entries_person').val();
			otTypeId = $("#entries_otType").val();
		}
		// that.getDefaultOTCompens(personId,otTypeId);
		//设置默认的补偿方式
		if(!that.billId){
			that.setDefaultOTCompens();
		}
//		判断【加班费】是否有效（存在且生效）
		that.effectiveFlag = that.isOTCompensEffective(that._ATS_OVERTIMECOMPENS_OVERTIME_ID);
		//当加班类型为法定节假日加班时
		if(that.getOperateState() != "VIEW"){
			that.handleLegalHoliday();
			that.otCompensChange();
		}

		that.isOverWarnValue(this.getFieldValue('entries_otType'),this.getFieldValue('entries_otCompens'));
		//启用加班管控 且加班类型受日期控制，加班类型不能编辑
		if( that.isOtrolByDateType){
			$("#entries_otType").shrPromptBox("disable");
		}
		/*面包屑问题*/
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.AtsOverTimeBillForm") {


			if (shrDataManager.pageNavigationStore.getDatas().length == 2) {
				$("#breadcrumb").find("li.active")
				.html(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_24);
				var a = shrDataManager.pageNavigationStore.getDatas()[1];
				a.name = jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_24;
				shrDataManager.pageNavigationStore.pop();
				shrDataManager.pageNavigationStore.addItem(a);
			}else if (shrDataManager.pageNavigationStore.getDatas().length == 3) {
				$("#breadcrumb li")[2].remove();
				$("#breadcrumb").find("li.active")
				.html(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_24);
				shrDataManager.pageNavigationStore.pop();
			}else if (shrDataManager.pageNavigationStore.getDatas().length == 4) {
				$($("#breadcrumb li")[3])
				.html(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_3);
			}

		}


		if(that.isFromWF()){
			$("#addInstanceToDeskItem").css('display','none');
		}
			//审核编辑界面
		if(that.isFromWF() && that.getOperateState() == 'EDIT')
		{
			$("#entries_person").shrPromptBox("disable");
		}
		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.AtsOverTimeBillForm"){
			that.isHaveEffectiveFile();
		}
		if(that.getOperateState() == 'EDIT')
		{
			var otCompensIds = that.getOTCompensByOTType($('#entries_person_el').val(),$('#entries_otType').shrPromptBox("getValue").id).replace(/(,)/g, "','") ;
			if(otCompensIds && otCompensIds != ''){
				$('#entries_otCompens').shrPromptBox("setFilter","BaseInfo.id in ('"+otCompensIds+"')");
			}
		}
		that.processTripDays();
		if(that.getOperateState() != 'VIEW'){
			$('#entries_person').bind('change',function(){
				that.initPersonMess();

			});
		}
		if(that.getOperateState() != 'VIEW'){
			$('#entries_otDate').bind('change',function(){
				var otDate=atsMlUtile.getFieldOriginalValue('entries_otDate');
				$('#entries_startTime').shrDateTimePicker('setValue', otDate);
				$('#entries_endTime').shrDateTimePicker('setValue', otDate);
			});
		}
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
                // shr.showWarning({message:"Please select people."});
            } else {
                $('#ccPersonIds').shrPromptBox("setOtherParams", {
                    // handler: "com.kingdee.shr.ats.web.handler.team.F7.TeamPersonForEmpOrgF7ListHandler",
                    personId: person.id
                });
            }
        }
    }
    ,initPersonMess : function(){
		var that = this ;

		$('#entries_person_el').val(that.personId);

	},processTripDays : function(){
		var that = this ;

		$("#entries_otDate").change(function(){
			 that.changeOverHrOrgUnit();

			 //判断是否存在有效的考勤档案
			 that.isExistsEffectiveAtsFile();

		});

	},
	//判断是否存在有效的考勤档案
	isExistsEffectiveAtsFile: function(){
		var that = this;
		var otDate = atsMlUtile.getFieldOriginalValue("entries_otDate");
		var personId = $("#entries_person_el").val();
		if (otDate && otDate!=""&&otDate!=null && personId && personId != "") {
			that.remoteCall({
				type:"post",
				async: false,
				method:"isExistsEffectiveAtsFile",
				param:{personId:personId,otDate:otDate},
				success:function(res){
					//如果没有有效的考勤档案，后台会抛出异常
				}
			});
		}
	},
	changeOverHrOrgUnit : function(){
		var that = this;
		var overStartTime = atsMlUtile.getFieldOriginalValue("entries_otDate");
		if ( overStartTime!=""&&overStartTime!=null ) {
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
				$("#hrOrgUnit").val(res.hrOrgUnitname);
				$("#hrOrgUnit_el").val(res.hrOrgUnitId);
				}

			}
		});
		}
	}

	,processF7ChangeEventHrOrgUnit : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					that.initCurrentHrOrgUnit(info.id);
					$("#entries_person_el").val("");
					$("#entries_person").val("");
					$("#entries_person_number").val("");//@
					$("#entries_adminOrgUnit").val("");
					$("#entries_position").val("");

				}
			});
		}
	}
	,initCurrentHrOrgUnit: function(hrOrgUnitId) {
		var that = this;

		//---？？
//		$("#entries_tripType").shrPromptBox().attr("data-params",hrOrgUnitId);
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
					shr.showWarning({message:jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_5});
				}
			}
		});
	}
	,handleLegalHoliday: function(){
		var that = this;
		//BT883973：编辑模式下 补偿方式可以开放选择
//		if(that.getOperateState() == "EDIT"){
//			if($("#entries_otType_el").val() == that._ATS_OVERTIME_LEGALHOLIDAYDAY_OVERTIME_ID){
//				$('#entries_otCompens').attr("readonly",true);
//				$('#entries_otCompens').parent().next().css("display","none");
//			}
//		}

		$("#entries_otType").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					var typeId = info.id != undefined && info.id != "" ? info.id : info.submitFormat;
					var otCompensIds = that.getOTCompensByOTType($('#entries_person_el').val(),typeId);
					if(otCompensIds == null || otCompensIds == undefined){
						otCompensIds = "";
					}else{
						otCompensIds = otCompensIds.replace(/(,)/g, "','") ;
					}
					that.getDefaultOTCompens($('#entries_person_el').val(),typeId);

					/*if(info!=null && info.id == that._ATS_OVERTIME_LEGALHOLIDAYDAY_OVERTIME_ID && that.effectiveFlag){
						$('#entries_otCompens').shrPromptBox("setValue",that._invariantVale);
//						$('#entries_otCompens').attr("readonly",true);
//						$('#entries_otCompens').parent().next().css("display","none");
						that.isOverWarnValue(info.id,$("#entries_otCompens_el").val());
					}
					else{
						//$('#entries_otCompens_el').val('');
						//$('#entries_otCompens').val('');
						that.setDefaultOTCompens();
						$('#entries_otCompens').attr("readonly",false);
						$('#entries_otCompens').parent().next().css("display","");
					}*/
					that.setDefaultOTCompens();
					if(otCompensIds && otCompensIds != ""){
						$('#entries_otCompens').shrPromptBox("setFilter","BaseInfo.id in ('"+otCompensIds+"')");
					}

			}
		});

	}



	//获取默认的加班补偿方式
	,getDefaultOTCompens : function ( personId, otTypeId) {
		var _self = this;
		//var personId = $('#entries_person_el').val();
		//var otTypeId = $("#entries_otType_el").val();
		var otDate = atsMlUtile.getFieldOriginalValue('entries_otDate');
		if(otDate && otDate != '' && personId != '' && otTypeId != ''){
			_self.remoteCall({
				type:"post",
				method:"getDefaultOTCompens",
				param:{personId:personId,otTypeId:otTypeId,otDate:otDate},
				async: false,
				success:function(res){
					var info =  res;
					if (info.defaultId == "" || info.defaultId ==undefined ){
						shr.showWarning({message:jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_29});
					}else {
						_self.defaultOTCompens = {id:info.defaultId,name:info.defaultName};
						if(!info.otrolByDateType){
						$("#entries_otType").shrPromptBox("enable");
						}else{
						$("#entries_otType").shrPromptBox("disable");
						}
					}
				}
			});
		}
	}

	//获取当前加班类型的加班补偿方式
	,getOTCompensByOTType : function ( personId, otTypeId) {
		var _self = this;
		var otCompens="";
		var otDate = atsMlUtile.getFieldOriginalValue('entries_otDate');
		if(otDate && otDate != '' && personId != '' && otTypeId != ''){
			_self.remoteCall({
				type:"post",
				method:"getOTCompensByOTType",
				param:{personId:personId,otTypeId:otTypeId,hrOrgUnit:$("#hrOrgUnit").shrPromptBox("getValue").id,otDate:atsMlUtile.getFieldOriginalValue('entries_otDate')},
				async: false,
				success:function(res){
					otCompens =  res.otCompens;

				}
			});
		}
		return otCompens;
	}

	//设置默认的加班补偿方式
	,setDefaultOTCompens : function () {
		var _self = this;
		if (_self.defaultOTCompens!=null && _self.defaultOTCompens != ""){
			$('#entries_otCompens').shrPromptBox("setValue",_self.defaultOTCompens);
		}
	}


//	判断加班补偿方式是否有效（存在且生效）
	,isOTCompensEffective : function (OTCompens) {
		var _self = this;
		var flag = true;
		_self.remoteCall({
			type:"post",
			method:"isOTCompensEffective",
			param:{
				OTCompens:OTCompens
			},
			async: false,
			success:function(res){
				var info =  res;
				if (info.resFlag == false){
					flag = false;
				}else {
					flag = true;
				}
			}
		});
		return flag;

	}

	//	判断加班补偿方式是否有效（存在且生效）
	,isOtTypeEffective : function (OtType) {
		var _self = this;
		var flag = true;
		_self.remoteCall({
			type:"post",
			method:"isOtTypeEffective",
			param:{
				OtType:OtType
			},
			async: false,
			success:function(res){
				var info =  res;
				if (info.resFlag == false){
					flag = false;
				}else {
					flag = true;
				}
			}
		});
		return flag;
	}

	/**
	 * 设置编码字段是否可编辑
	 */
	,setNumberFieldEnable : function() {
		var that = this ;
		if (that.getOperateState().toUpperCase() == 'EDIT' ||　that.getOperateState().toUpperCase() == 'ADDNEW') {
			var overtimeBillNumberFieldCanEdit = that.initData.overtimeBillNumberFieldCanEdit;
			if (typeof overtimeBillNumberFieldCanEdit != 'undefined' && !overtimeBillNumberFieldCanEdit) {
				that.getField('number').shrTextField('option', 'readonly', true);
			}
			//初始化HR组织ID
			var hrOrgUnitID = that.initData.initCurrentHrOrgUnit;
			if (typeof hrOrgUnitID != 'undefined' && hrOrgUnitID) {
				that.initCurrentHrOrgUnit(hrOrgUnitID);
			}
		}
	}

	//提交即生效
	,submitEffectAction : function (event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);

		if ($form.valid() && _self.verify()) {
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_startTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_endTime").split(" ")[0];
			var billType = "overTime";
			var personId = $('#entries_person_el').val()
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: true,
				success:function(res){
					var result = res.result;
					if(result==""){
						if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
							shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_6, function() {
								_self.prepareSubmitEffect(event, 'submitEffect');
							});
						}else{
							shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_14, function() {
								_self.prepareSubmitEffect(event, 'submitEffect');
							});
						}
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_20,function(){
							if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
								shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_6, function() {
									_self.prepareSubmitEffect(event, 'submitEffect');
								});
							}else{
								shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_14, function() {
									_self.prepareSubmitEffect(event, 'submitEffect');
								});
							}
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
	}

	/**
	 * 点击取消按钮 返回到个人请假列表list(个人) || com.kingdee.eas.hr.ats.app.AtsOverTimeBillList
	 */
	,cancelAction:function(){
		/*var that = this ;
	 	window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsOverTimeBillList";*/
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsOverTimeBillList'
		});
	}
	/**
	 * 专员列表点击取消的方法
	 * 这里有点特殊,采用屏蔽按钮,增加专员取消按钮的方法 替代 维护2次 atsOverTimeBillEdit.js 的方式
	 */
	,cancelAllAction:function(){
		/*var that = this ;
	 	window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllList";*/
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllList'
		});
	}
	,getOverTimeType:function(otDate,personId){
		var _self = this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsOverTimeBillEditHandler&method=getOverTimeType";
		url += '&otDate=' + encodeURIComponent(otDate) + '&personId=' + encodeURIComponent(personId);
		if(otDate != "" && personId != ""){
			$.ajax({
				url: url,
				async:false,
				//data:{otDate:,personId:encodeURIComponent(personId)},
				//data:{otDate:encodeURIComponent(otDate),personId:encodeURIComponent(personId)},
				success: function(response){
					if(response.otTypeValue!=null && response.otTypeValue !=undefined && response.otTypeValue!=''){
						if (_self.isOtTypeEffective(response.otTypeValue)){
							var responseObejct = {id:response.otTypeValue,name:response.otTypeText }
							$('#entries_otType').shrPromptBox("setValue",responseObejct);
						}else {
							$('#entries_otType').shrPromptBox("setValue","");
						}

					}else {
						$('#entries_otType').shrPromptBox("setValue","");
					}
				}
				,error: function(response) {
				}
			})
		};

	}
	,changeOverTimeType:function(){
		var that=this;
	    $('#entries_otDate').change(function(){ //加班日期
//	    	var otDate=$(this).val()||'';
	    	var otDate = atsMlUtile.getFieldOriginalValue("entries_otDate")||'';
	    	var personId=$('#entries_person_el').val()||'';
    		that.getOverTimeType(otDate,personId);
			that.isOverWarnValue($("#entries_otType_el").val(),$("#entries_otCompens_el").val());

			//获取休息时长
			var startTime = atsMlUtile.getFieldOriginalValue("entries_startTime");
			var endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
			if(startTime == "" || startTime == undefined){
				return ;
			}
			if(endTime == "" || endTime == undefined){
				return ;
			}
			var startTimeOfDate = new Date(startTime);
		 	var endTimeOfDate = new Date(endTime);
		 	var longTime = endTimeOfDate.getTime() - startTimeOfDate.getTime();
		 	if(longTime <= 0)
		 	{
		 		 atsMlUtile.setTransNumValue("entries_applyOTTime",0);
		 		 atsMlUtile.setTransNumValue("entries_restTime",0,{'decimalPrecision':0});
		 		 return ;
		 	}else{
		 		that.calculataApplyRestTime();
		 	}
	    });


	},

	//获取系统小数位长度
	getDecimalPlace : function (floatTime, otTimeType ) {
		 var fixeNum =  atsMlUtile.getSysDecimalPlace();
        floatTime = floatTime.toFixed(fixeNum);
        if(floatTime < 0){
            atsMlUtile.setTransNumValue(otTimeType,0);
        }else{
            atsMlUtile.setTransNumValue(otTimeType,floatTime);
        }
	}
    ,getJsonLength:function(jsonData){
		var jsonLength = 0;
		for(var item in jsonData){
			jsonLength++;
		}
		return jsonLength;
	},

	processF7ChangeEvent:function(){
		var that = this;
		//that.initActionF7();
		if (that.getOperateState() != 'VIEW') {
			$("#entries_person").shrPromptBox("option", {
				onchange : function(e, value) {
					//alert( JSON.stringify( value ) );
					var info = value.current;
						if(info != null){
					    if(info.hasOwnProperty("id")){
							$("#entries_person_number").val(info["person.number"]);//@
							$("#entries_adminOrgUnit").val(info["adminUnit.name"]);//行政组织
							$("#entries_position").val(info["position.name"]);//职位
							$('#entries_person_el').val(info["person.id"]);
							that.personId=info["person.id"];
							var otDate=atsMlUtile.getFieldOriginalValue('entries_otDate')||'';
							that.getOverTimeType(otDate,info["id"]);
							that.getOTContrlParams();
							if( that.isOtrolByDateType){
								$("#entries_otType").shrPromptBox("disable");
							}
							/*that.remoteCall({
								type:"post",
								method:"getPersonInfosByPersonId",
								param:{personId: info.id},
								success:function(res){
									var info = res;
                                    $("#entries_person_number").val(info.number);//员工编码
									$('#entries_adminOrgUnit_el').val( info.positionDepId );	//部门ID
									$('#entries_adminOrgUnit').val( info.positionDepName.name);	//部门

									$("#entries_position_el").val(info.positionId);				//职位
									$("#entries_position").val(info.positionName.name);			//职位名称
									$("#entries_person_number").val(info.personNumber); 		//员工编码
									that.isOverWarnValue($("#entries_otType_el").val(),$("#entries_otCompens_el").val());
								}
							});*/
						}
						}
                }, afterOnSelectRowHandler: function (e, value) {
                    that.clearCCPersonIdsPrompt();
                    that.initCcPersonPrompt();
				}
			});
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
	//处理申请加班小时数,申请加班小时数默认等于实际加班小时数
	processApplyOTTime : function(){
		var that = this ;
		/*$("#entries_applyOTTime").keyup(function(){
			 $("#entries_realOTTime").val($("#entries_applyOTTime").val());
		});*/
		$("#entries_restTime").change(function(){
			that.calculataApplyOTTime();
			that.calculataRealOTTime();
		}) ;
		//加班结束时间选择完后 计算申请加班小时数
		$("#entries_endTime,#entries_startTime").change(function(){

			var startTime = atsMlUtile.getFieldOriginalValue("entries_startTime");
			var endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
			if(startTime == "" || startTime == undefined){
				return ;
			}
			if(endTime == "" || endTime == undefined){
				return ;
			}
			var startTimeOfDate = new Date(startTime);
		 	var endTimeOfDate = new Date(endTime);
		 	var longTime = endTimeOfDate.getTime() - startTimeOfDate.getTime();
		 	if(longTime <= 0)
		 	{
		 		 atsMlUtile.setTransNumValue("entries_applyOTTime",0);
		 		 atsMlUtile.setTransNumValue("entries_restTime",0,{'decimalPrecision':0});
		 		 return ;
		 	}else{
		 		that.calculataApplyRestTime();
		 	}
			that.calculataApplyOTTime();
			that.calculataRealOTTime();
			//that.calculataApplyRestTime();
		});
        function calculataRestTime() {
            var regEx = new RegExp("\\-", "gi"); //i不区分大小写 g匹配所有
            var restTime =0;
            var restStartTime = atsMlUtile.getFieldOriginalValue("entries_restStartTime");
            var restEndTime = atsMlUtile.getFieldOriginalValue("entries_restEndTime");

            if (restStartTime!=undefined && restStartTime!="" && restEndTime!=undefined && restEndTime!="") {
                restStartTime = restStartTime.replace(regEx, "/");
                restEndTime = restEndTime.replace(regEx, "/");
                var startTimeOfDate = new Date(restStartTime);
                var endTimeOfDate = new Date(restEndTime);
                var longTime = endTimeOfDate.getTime() - startTimeOfDate.getTime();
                restTime += longTime / 1000.0 / 60;//分钟
            }

            var restStartTime2 = atsMlUtile.getFieldOriginalValue("entries_restStartTime2");
            var restEndTime2 = atsMlUtile.getFieldOriginalValue("entries_restEndTime2");

            if (restStartTime2!=undefined && restStartTime2!="" && restEndTime2!=undefined && restEndTime2!="") {
                restStartTime2 = restStartTime2.replace(regEx, "/");
                restEndTime2 = restEndTime2.replace(regEx, "/");
                var startTimeOfDate2 = new Date(restStartTime2);
                var endTimeOfDate2 = new Date(restEndTime2);
                var longTime2 = endTimeOfDate2.getTime() - startTimeOfDate2.getTime();
                restTime += longTime2 / 1000.0 / 60;//分钟
            }
            atsMlUtile.setTransNumValue("entries_restTime",restTime,{'decimalPrecision':0});
            that.calculataRealOTTime();
            that.calculataApplyOTTime();
            // that.calculataApplyRestTime();
        }

        $("#entries_restStartTime,#entries_restEndTime,#entries_restStartTime2,#entries_restEndTime2").change(function(){//开始休息时间1
            that.disableRestTime();
            if (! that.verifyRestTime(false)){
            	return
			}
            calculataRestTime();
        });
		//实际加班结束时间选择完后 计算实际小时数
		$("#entries_realEndTime,#entries_realStartTime").change(function(){
			 that.calculataRealOTTime();
		});
	},
    disableRestTime:function (){
    var restStartTime = atsMlUtile.getFieldOriginalValue("entries_restStartTime");
    var restEndTime = atsMlUtile.getFieldOriginalValue("entries_restEndTime");
    var restStartTime2 = atsMlUtile.getFieldOriginalValue("entries_restStartTime2");
    var restEndTime2 = atsMlUtile.getFieldOriginalValue("entries_restEndTime2");
    if (
        (restStartTime ==undefined || restStartTime=="")
        &&(restStartTime2 ==undefined || restStartTime2=="")
        &&(restEndTime ==undefined || restEndTime=="")
        &&(restEndTime2 ==undefined || restEndTime2=="")
    ){
        $("#entries_restTime").shrTextField("enable");
        atsMlUtile.setTransNumValue("entries_restTime",0,{'decimalPrecision':0});
        this.calculataApplyOTTime();
        this.calculataRealOTTime();
    } else {
        $("#entries_restTime").shrTextField("disable");
    }
	},
	calculataApplyOTTime : function(){
		var startTime = atsMlUtile.getFieldOriginalValue("entries_startTime");
		var endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
		var restTime = atsMlUtile.getFieldOriginalValue("entries_restTime");
		if( (new String(restTime)).trim()=='' ){
		  restTime=0;
		  atsMlUtile.setTransNumValue("entries_restTime",0,{'decimalPrecision':0});
		}else{
			restTime=parseFloat(restTime);
			if(restTime<0.0){
				atsMlUtile.setTransNumValue("entries_restTime",0,{'decimalPrecision':0});
				restTime=0.0;
			}
		}

		if ( startTime!=""&&startTime!=null && endTime!=""&&endTime!=null ) {

			var regEx = new RegExp("\\-","gi");
			startTime = startTime.replace(regEx,"/");
		 	endTime = endTime.replace(regEx,"/");

		 	var startTimeOfDate = new Date(startTime);
		 	var endTimeOfDate = new Date(endTime);
		 	var longTime = endTimeOfDate.getTime() - startTimeOfDate.getTime();
		 	if (longTime <= 0) {
		 		atsMlUtile.setTransNumValue("entries_applyOTTime",0);
		 		//$("#entries_realOTTime").val(0);//时刻根据  实际的止-实际的起-休息通过在调用that.calculataApplyOTTime()后调用that.calculataRealOTTime()来达到的
		 	}else{
			 	t1 = parseFloat(longTime)/1000.0/60/60;
			 	t1 = t1 - parseFloat(restTime)/60;
			 	var that = this;
				that.getDecimalPlace(t1,"entries_applyOTTime");
		 	}
		}
	},
	calculataRealOTTime : function(){
		var realStartTime = atsMlUtile.getFieldOriginalValue("entries_realStartTime");
		var realEndTime = atsMlUtile.getFieldOriginalValue("entries_realEndTime");
		var restTime = atsMlUtile.getFieldOriginalValue("entries_restTime")||'';
		if( (new String(restTime)).trim()=='' ){
		  restTime=0;
		  atsMlUtile.setTransNumValue("entries_restTime",0,{'decimalPrecision':0});
		}else{
			restTime=parseFloat(restTime);
			if(restTime<0.0){
				atsMlUtile.setTransNumValue("entries_restTime",0,{'decimalPrecision':0});
				restTime=0.0;
			}
		}
		if ( realStartTime!=""&&realStartTime!=null && realEndTime!=""&&realEndTime!=null ) {
			var regEx = new RegExp("\\-","gi");
			realStartTime = realStartTime.replace(regEx,"/");
		 	realEndTime = realEndTime.replace(regEx,"/");
		 	var realStartTimeOfDate = new Date(realStartTime);
		 	var realEndTimeOfDate = new Date(realEndTime);
		 	//lzq 加上减去休息时间
		 	var floatTime = parseFloat( realEndTimeOfDate.getTime() - realStartTimeOfDate.getTime() )/1000.0/60/60 - parseFloat(restTime)/60;;
		 	if (floatTime <= 0.0) {
		 		atsMlUtile.setTransNumValue("entries_realOTTime",0);
		 	}else{
			 	//t1 = parseFloat(longTime)/1000.0/60/60;\
			 	var that = this;
				that.getDecimalPlace(floatTime,"entries_realOTTime");
		 	}
		}
	},
	realOverTimeSynOverTime : function(){
	  	var that = this ;
		$("#entries_startTime").change(function(){
			var startTime = atsMlUtile.getFieldOriginalValue("entries_startTime");
			atsMlUtile.setTransDateTimeValue("entries_realStartTime",startTime);
			that.calculataRealOTTime();
		});
	 	$("#entries_endTime").change(function(){
			var endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
			atsMlUtile.setTransDateTimeValue("entries_realEndTime",endTime);

            var startTime = atsMlUtile.getFieldOriginalValue("entries_startTime");
            if (startTime!="" && startTime!=undefined){
                atsMlUtile.setTransDateTimeValue("entries_realStartTime",startTime);
            }
			that.calculataRealOTTime();
		});

		$("#entries_applyOTTime").change(function(){
		    atsMlUtile.setTransNumValue("entries_realOTTime",atsMlUtile.getFieldOriginalValue('entries_applyOTTime'));
		})
	},
	calculataApplyRestTime : function(){
			var that = this ;
			var otDate = atsMlUtile.getFieldOriginalValue("entries_otDate");
			var personId=$('#entries_person_el').val() ;
	    	var realStartTime = atsMlUtile.getFieldOriginalValue("entries_startTime");
			var realEndTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsOverTimeBillEditHandler&method=getMyRestTime";
				url += '&tDay=' + encodeURIComponent(otDate) + '&personId=' + encodeURIComponent(personId);
				url +='&realStartTime=' + encodeURIComponent(realStartTime) + '&realEndTime=' + encodeURIComponent(realEndTime);
			$.ajax({
				url: url,
				async:false,
				success: function(response){
                    var restTime = response.restTime ;
                    var restStartTime = response.restStartTime ;
                    var restStartTime2 = response.restStartTime2 ;
                    var restEndTime = response.restEndTime ;
                    var restEndTime2 = response.restEndTime2 ;
                    atsMlUtile.setTransNumValue("entries_restTime",restTime,{'decimalPrecision':0});
                    atsMlUtile.setTransDateTimeValue("entries_restStartTime",restStartTime);
                    atsMlUtile.setTransDateTimeValue("entries_restEndTime",restEndTime);
                    atsMlUtile.setTransDateTimeValue("entries_restStartTime2", restStartTime2);
                    atsMlUtile.setTransDateTimeValue("entries_restEndTime2", restEndTime2);

                    that.disableRestTime()
				}
			,error: function(response) {
			}
		});

	},


	verify:function(){
		var _self = this ;

		var workArea = _self.getWorkarea();
		$form = $('form', workArea);
		if (!$form.valid()) {
			return false;
		}
		if ( !_self.verifyRestTime(true)) {
			return
		}

	 	var startTime = atsMlUtile.getFieldOriginalValue("entries_startTime");
		var endTime = atsMlUtile.getFieldOriginalValue("entries_endTime");
        var regEx = new RegExp("\\-","gi"); //i不区分大小写 g匹配所有
		startTime = startTime.replace(regEx,"/");
		endTime = endTime.replace(regEx,"/");
		var startTimeOfDate = new Date(startTime);
	 	var endTimeOfDate = new Date(endTime);
	 	var longTime = endTimeOfDate.getTime() - startTimeOfDate.getTime();

	 	var realstartTime = atsMlUtile.getFieldOriginalValue("entries_realStartTime");
		var realendTime = atsMlUtile.getFieldOriginalValue("entries_realEndTime");
		var realstartTimeOfDate = new Date( realstartTime.replace(regEx,"/") );
	 	var realendTimeOfDate = new Date( realendTime.replace(regEx,"/") );
	 	var longTime_real = realendTimeOfDate.getTime() - realstartTimeOfDate.getTime();

	 	//处理加班日期 与 加班开始时间 和结束时间的日期保持一致
	 	var overDate = atsMlUtile.getFieldOriginalValue("entries_otDate");
	 	var overTimeBegin = atsMlUtile.getFieldOriginalValue("entries_startTime");
	 	overTimeBegin = overTimeBegin.substring(0,10); //2014-01-02 00:00
	 	var overTimeEnd = atsMlUtile.getFieldOriginalValue("entries_endTime");
	 	overTimeEnd = overTimeEnd.substring(0,10);

	 	var overTimeDate = new Date(overDate.replace(regEx,"/"));
	 	var overTimeStartDate = new Date(overTimeBegin.replace(regEx,"/"));
	 	var overTimeEndDate = new Date(overTimeEnd.replace(regEx,"/"));

	 	//var longTime_start = overTimeStartDate.getTime() - overTimeDate.getTime()-24*60*60*1000 ;
	 	//var longTime_end  = overTimeEndDate.getTime() - overTimeDate.getTime()-24*60*60*1000;


	 	var otTypeId = "";
	 	if (_self.getOperateState().toUpperCase() == 'VIEW') {
	 		otTypeId = $("#entries_otType").val();
	 	}else {
	 		otTypeId = $("#entries_otType_el").val();
	 	}
	 	if(otTypeId == null || otTypeId == undefined || otTypeId.length == 0){
	 		shr.showInfo({message: overDate + jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_12});
	 		return false;
	 	}

	 	//检查人员是否有考勤档案
	 	var isExistsFile = true;
	 	var personNum = "";
	 	if("ADDNEW" == this.getOperateState() || "EDIT" == this.getOperateState()){
	 	    personNum = $("#entries_person_number").val()//@
	 	}else if("VIEW" == this.getOperateState()){
	 	    personNum = $("#entries_person_number").text()//@
	 	}
/*	 	_self.remoteCall({
			type:"post",
			method:"isExistsAttanceFile",
			async: false,
			param:{personNum: personNum},
			success:function(res){
				var info =  res;
				if (!info.isExistsFile){
					shr.showWarning({message:"该员工还没有生效的假期档案/考勤档案！"});
					isExistsFile = false;
				}
			}
		});
		if(!isExistsFile){
		   return false;
		}*/

		if ( overTimeStartDate.getTime() <overTimeDate.getTime()-24*60*60*1000  ) {//longTime_start != 0 &&  longTime_end != 0
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_2});
			return false;
	 	}
	 	if ( overTimeEndDate.getTime()-24*60*60*1000  > overTimeDate.getTime() ) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_2});
			return false;
	 	}
		if ( overTimeEndDate.getTime()- overTimeStartDate.getTime() >=2*24*60*60*1000) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_2});
			return false;
	 	}

	 	if (longTime <= 0) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_10});
			return false;
	 	}else if (longTime_real <= 0) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_19});
			return false;
		 }else if ($("#entries_otCompens").attr("title")
				 ==jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_4 && !_self.isOverMaxQuota()){
			return false;
		}
		var otTime = atsMlUtile.getFieldOriginalValue("entries_applyOTTime");
		if(parseFloat(otTime) < 0){
		   shr.showWarning({message:jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_11});
		    return false;
		}
	 	var personId = $('#entries_person_el').val();
		if (_self.getOperateState().toUpperCase() == 'VIEW') {
			personId = $('#entries_person').val();
		}
	 	var flag = true ;
	 	_self.remoteCall({
			type:"post",
			method:"isWorkTime",
			async: false,
			param:{personId: personId,overDate:overDate,overTimeBegin:atsMlUtile.getFieldOriginalValue("entries_startTime")+":00",overTimeEnd:atsMlUtile.getFieldOriginalValue("entries_endTime")+":00"},
			success:function(res){
				var info =  res;
				if (info.isWorkTime){
					shr.showWarning({message:jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_9});
					flag = false ;
				}
			}
		});
		_self.remoteCall({
			type:"post",
			method:"isAtFixedOverTimeOrExcep",
			async: false,
			param:{personId: personId,overDate:overDate,overTimeBegin:atsMlUtile.getFieldOriginalValue("entries_startTime")+":00",overTimeEnd:atsMlUtile.getFieldOriginalValue("entries_endTime")+":00"},
			success:function(res){
				var info =  res;
				if (info.isAtFixedOverTimeOrExcep){
					shr.showWarning({message:jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_1});
					flag = false ;
				}
			}
		});
		//工作流审批中编辑校验补提加班单
		if(_self.isFromWF())
		{
			var model = _self.getCurrentModel();
			_self.remoteCall({
			    method:"validateIsFillOt",
			    param:{model:model},
				async: false,
			    success:function(res){
					info =  res;
					if(res.errorString){
						  shr.showError({message:res.errorString});
						  flag = false;
						 // return false;
					}
			    }
			});

			_self.remoteCall({
				method:"validOtStart",
				param:{personId:personId,applyOTTime:otTime},
				async: false,
				success:function(res){
					info =  res;
					if(res.info){
						shr.showError({message:res.info});
						flag = false ;
					}
				}
			});
		}

		return flag;

	},
	verifyRestTime: function( beforeSubmit){
        var startTime0 = atsMlUtile.getFieldOriginalValue("entries_startTime");
        var endTime0 = atsMlUtile.getFieldOriginalValue("entries_endTime");
        if(startTime0 == "" || startTime0 == undefined){
            shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_2});
            return false;
        }
        if(endTime0 == "" || endTime0 == undefined){
            shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_1});
            return false;
        }
        var startTimeOfDate = new Date(startTime0);
        var endTimeOfDate = new Date(endTime0);
        var restStartTime = atsMlUtile.getFieldOriginalValue("entries_restStartTime");
        var restEndTime = atsMlUtile.getFieldOriginalValue("entries_restEndTime");
        var restStartTime2 = atsMlUtile.getFieldOriginalValue("entries_restStartTime2");
        var restEndTime2 = atsMlUtile.getFieldOriginalValue("entries_restEndTime2");
        var restStartTimeOfDate = new Date(restStartTime);
        var restEndTimeOfDateOfDate = new Date(restEndTime);
        if (restStartTime!=undefined && restStartTime!=""){
            if (restStartTimeOfDate.getTime()<startTimeOfDate.getTime() ||restStartTimeOfDate.getTime()>endTimeOfDate.getTime()){
                shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_6});
                return false;
            }
		}
        if (restEndTime!=undefined && restEndTime!="") {
            if (restEndTimeOfDateOfDate.getTime() < startTimeOfDate.getTime() || restEndTimeOfDateOfDate.getTime() > endTimeOfDate.getTime()
					||restEndTimeOfDateOfDate.getTime() < restStartTimeOfDate.getTime()) {
                shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_3});
                return false;
            }
        }
        var restStartTimeOfDate2 = new Date(restStartTime2);
        var restEndTimeOfDateOfDate2 = new Date(restEndTime2);
        if (restStartTime2!=undefined && restStartTime2!=""){
            if (restStartTimeOfDate2.getTime()<startTimeOfDate.getTime() ||restStartTimeOfDate2.getTime()>endTimeOfDate.getTime()){
                shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_8});
                return false
            }
        }
        if (restEndTime2!=undefined && restEndTime2!="") {
            if (restEndTimeOfDateOfDate2.getTime() < startTimeOfDate.getTime() || restEndTimeOfDateOfDate2.getTime() > endTimeOfDate.getTime()
            ||restEndTimeOfDateOfDate2.getTime() < restStartTimeOfDate2.getTime()){
                shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_4});
                return false;
            }
        }
        if( (restStartTime!="" && restStartTime!=undefined && (restEndTime==""||restEndTime==undefined))
            || (restEndTime!="" && restEndTime!=undefined && (restStartTime==""||restStartTime==undefined))
        )
        {
        	if (beforeSubmit){
                shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_5});
			}
            return false;
        }
        if( (restStartTime2!="" && restStartTime2!=undefined && (restEndTime2==""||restEndTime2==undefined))
            || (restEndTime2!="" && restEndTime2!=undefined && (restStartTime2==""||restStartTime2==undefined))
        )
        {
            if (beforeSubmit) {
                shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_7});
            }
            return false;
        }
        if (restStartTime != "" && restStartTime != undefined && restStartTime2 != "" && restStartTime2 != undefined) {
        	//两个加班休息时间都填了，那么判断不能交叉
        	if((restStartTimeOfDate.getTime()<restEndTimeOfDateOfDate2.getTime() && restStartTimeOfDate.getTime()>=restStartTimeOfDate2.getTime())
			||(restStartTimeOfDate2.getTime()<restEndTimeOfDateOfDate.getTime() && restStartTimeOfDate2.getTime()>=restStartTimeOfDate.getTime())
			){
                shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_0});
                return false;
			}
		}
		return true;
	},
//	verify:function(){
//		var regEx = new RegExp("\\-","gi");//i不区分大小写 g匹配所有
//	 	var msgValue = this.getFieldValue("entries_msgValue");
//	 	
//	 	var beginTime = this.getFieldValue("entries_beginTime");
//	 	var endTime = this.getFieldValue("entries.endTime");
//	 	beginTime = beginTime.replace(regEx,"/");//2013/6/12 19:38:02
//	 	endTime = endTime.replace(regEx,"/");
//	 	var beginTimeOfDate = new Date(beginTime); 
//	 	var endTimeOfDate = new Date(endTime);
//	 	if(beginTimeOfDate.getTime()>endTimeOfDate.getTime()){
//			shr.showInfo({message: "请假开始日期不能大于请假结束日期"});
//			return false;
//		}else if(parseFloat(msgValue) == 0  ){
//			shr.showInfo({message: "当前人的可用年假为"+msgValue+"天,不能提交或保存"});
//			return false;
//		}
//		else{
//			return true;
//		}
//	},

	/**
	 * HRBillStateEnum(与转正,调动,离职单据的一致) || BizStateEnum 这个是 EAS7.5版的请假单使用的审批状态值,后续不用这个了<br/>
	 * 后续的加班,出差,请假,补签卡都用HRBillStateEnum这个单据状态,以便可以统一修改<br/>
	 * view: <field name="billState"  label="单据状态" type="text"></field>	   <br/>
	 * 查看页面取值 var billState = $("#billState").html();
	 * view: <field name="billState"  label="单据状态" type="text"></field>	   <br/>
	 * 查看页面取值 var billState = $("#billState").val();
	 *
	 * 设置编辑按钮是否隐藏		|| 对应EAS7.5 Version 审批状态字段值<br/>
	 * 0-save  未提交			||  -1  未提交					   <br/>
	 * 1-submited 未审批			||   0  未审核					   <br/>
	 * 2-auditing 审批中			||   1  审核中					   <br/>
	 * 3-audited  审批通过		||   3  审核完成					   <br/>
	 * 4-auditend 审批不通过		||   4  审核终止					   <br/>
	 */
	setButtonVisible:function(){
		var that = this;
		var billState = $("#billState").val();
		//alert(billState);
		if (billState) {
			if (billState==3 ||
					jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_17==billState ||
					billState ==4||
					jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_16==billState ||
					billState ==2||
					jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_18==billState ) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1==billState ||
					jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_22== billState ||
					2 == billState ||
					jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_18==billState ) { //未审批或审批中
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
				$('#submit')
				.text(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_21);
				$('#edit').hide();
			}
		}

		//新增和编辑状态隐藏返回XX列表
		if (this.getOperateState().toUpperCase() == 'ADDNEW' || this.getOperateState().toUpperCase() == 'EDIT' ) {
			$("#returnToOverTimeBillList").hide();
		}

		//如果是工作流打回,界面上的"返回XX列表"不显示
		if (this.isFromWF()) {
			$("#returnToOverTimeBillList").hide();
			$("#cancel").hide();
		}
		/*
		if(billState){
			if(!this.isFromWF()){
				if("审批通过" == billState || "审批中" == billState || "未审批" == billState){
					$("#edit").hide();
					$("#submit").hide();
					$("#submitEffect").hide();
				}
			}
		}
		*/
	}
	//没有找到调休规则
	,isOverMaxQuota : function(){
		var resFlag = true;
		var _self = this;
		if($('#hrOrgUnit_el')==null || $('#hrOrgUnit_el') ==""){
			shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_15});
			return;
		}
		_self.remoteCall({
				type:"post",
				method:"isOverMaxQuota",
				async: false,
				param:{
					personId:$('#entries_person_el').val()|| $('#entries_person').val() || '',
					otDate:atsMlUtile.getFieldOriginalValue('entries_otDate')||'',
					currentValue:atsMlUtile.getFieldOriginalValue('entries_applyOTTime'),
					otType:$('#entries_otType_el').val() || $('#entries_otType').val() || '',
					hrOrgUnitId:$('#hrOrgUnit_el').val()

				},
				success:function(res){
					var info =  res;
					if (!info.resFlag) {
						shr.showWarning({message:info.resMsg});
						resFlag = false;
					}
				}
				});
		return resFlag;
	},
	isOverWarnValue:function(otType,otCompens)
	{
		//add by aniskin_guosj，otType、otCompens非空限制
		if (otType!=null && otType!=undefined && otType!="" &&
			otCompens!=null && otCompens!=undefined && otCompens!="")
		{
			if(!this.isOTControl)
					{
						return;
					}
					var data={
					personId: this.getFieldValue('entries_person'),
					otDate:  this.getFieldValue('entries_otDate'),
					otType:otType,
					otCompens:otCompens
					}
					this.remoteCall({
						type:"post",
						method:"getPersonOTLimitInfo",
						param:data,
						success:function(res){
							var info = res;
							if(info.isOverWarnValue)
							{
								var html="";
								if(info.cycleDateType!=3)
								{
									html=jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_23
									+ shr.formatMsg(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_0, [info.personName, info.dateValue, info.used])
									+jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_26
									+"<span style='color:red'>"+info.substract
									+jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_25
									+ "</span>"
									+"【"
									+ jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_27
									+ info.warnValue+","
									+ jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_7
									+ info.limitValue+"】";
								}
								else
								{
									html=jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_23
									+ shr.formatMsg(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_28, [info.dateValue, info.startDate, info.endDate, info.used])
									+ info.personName+""
									+ jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_26
									+"<span style='color:red'>"+info.substract
									+jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_25
									+ "</span>"
									+"【"
									+ jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_27
									+info.warnValue+","
									+ jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_7
									+info.limitValue+"】";
								}
									$("#show_info").html(html);
									$("#message_head").show();
							}
							else
							{
								$("#message_head").hide();
							}

						}
					});
		}

	},otCompensChange:function()
	{
		var that=this;
		$("#entries_otCompens").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					var comId = info.id != undefined && info.id != "" ? info.id : info.submitFormat;
					if (info!=null){
						that.isOverWarnValue($("#entries_otType_el").val(),comId);
					}

			}
		});
	},getOTContrlParams:function()
	{
	    var that=this;
		if( that.getOperateState() == 'VIEW' ){
           return;
       }
		
		var personId = $('#entries_person_el').val();
        if(personId == null || personId == ''){
            personId = $('#entries_person').val();
        }

		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=getOTContrlParams';
		shr.ajax({
			type:"post",
			async:false,
			url:url,
			data:{personId:personId},
			success:function(res){
				if(res)
				{
					that.isOTControl=res.isOTControl;
					that.isOtrolByDateType=res.isOtrolByDateType;

				}
			}
			});
	}

	//返回个人加班单链接跳转
	,returnToOverTimeBillListAction:function(){
	  // window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsLeaveBillList";
	   this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsOverTimeBillList'
		});
	},

	goNextPage: function(source) {
		// 普通提交，返回上一页面
		if ($("#bill_flag").val() == "employeeself"){
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsOverTimeBillList"
			});
		}else{
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllList"
			});
		}
	},

	setNavigateLine : function(){
	   	var fromFlag = localStorage.getItem("fromFlag");
	   	var empolyeeBoardFlag =	sessionStorage.getItem("empolyeeBoardFlag");

		var parentUipk = "";
		if(parent.window.shr==null){
     		parentUipk = shr.getCurrentViewPage().uipk;
     	}else{
     		parentUipk = parent.window.shr.getCurrentViewPage().uipk;
     	}
		if(fromFlag == "employeeBoard"){//来自我的考勤的时候。将导航条删除掉。
	      $("#breadcrumb").parent().parent().remove();
	      localStorage.removeItem("fromFlag");
	    }
	    if(("empolyeeBoardFlag" == empolyeeBoardFlag && "com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop" == parentUipk)){
	        $("#breadcrumb").remove();
	        window.parent.changeDialogTitle(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_24);
	    }
	}
	,getCurrentModel : function(){

		var that = this ;
		var model = shr.ats.AtsOverTimeBillEdit.superClass.getCurrentModel.call(this);
		var startTime = model.entries[0].startTime ;
		var endTime = model.entries[0].endTime;

		var realStartTime = model.entries[0].realStartTime ;
		var realEndTime = model.entries[0].realEndTime;

		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(startTime)))
		{
		  model.entries[0].startTime = startTime+":00";
		}
		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(endTime)))
		{
		  model.entries[0].endTime = endTime+":00";
		}

		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(realStartTime)))
		{
		  if(!(realStartTime.trim() == "")){
		  	model.entries[0].realStartTime = realStartTime+":00";
		  }
		}
		if(!(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.test(realEndTime)))
		{
		  if(!(realEndTime.trim() == "")){
		  	model.entries[0].realEndTime = realEndTime+":00";
		  }
		}


		var personId = model.entries[0].person;
		var date = model.entries[0].otDate;
		var personDateStr = personId +"_"+date.substring(0,10);

		if(personDateStr){
			_self.remoteCall({
				type:"post",
				method:"getPersonAdminOrgUnit",
				param:{ personDateStr:personDateStr},
				async: false,
				success:function(res){
					var info =  res;
					var personAtsInfo = res[personDateStr];
					if(personAtsInfo && personAtsInfo.adminOrgUnit){
						model.entries[0]["adminOrgUnit"]= personAtsInfo.adminOrgUnit;
						model.entries[0]["position"]= personAtsInfo.position;
					}
				}
			});
		}

        model.ccPersonIds = model.ccPersonIds && model.ccPersonIds.id || "";
        model.ccPerson = model.ccPersonIds;
		return model ;
	}
	,saveAction: function(event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		if (_self.validate()&&_self.verify()&&($form.valid())) {
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_startTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_endTime").split(" ")[0];
			var billType = "overTime";
			var personId = $('#entries_person_el').val()
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
						shr.showConfirm(result+jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_20,function(){
							_self.doSave(event, 'save');
						});
					}
				}
			});
		}
	},
	assembleSaveData: function(action) {
		var data = shr.ats.AtsOverTimeBillEdit.superClass.assembleSaveData.call(this,action);
		var model = JSON.parse(data.model);
		var personDateStr = '';
		var personId = model.entries.person;
		var date = model.entries.otDate;
		if(date && personId){
			personDateStr += personId +"_"+date.substring(0,10);
		}
		_self.remoteCall({
			type:"post",
			method:"getPersonAdminOrgUnit",
			param:{
				personDateStr:personDateStr
			},
			async: false,
			success:function(res){
				var info =  res;
				var person_date = personId +"_"+date.substring(0,10);
				if(res[person_date] != null){
					model.entries["adminOrgUnit"] = res[person_date].adminOrgUnit;
					model.entries["position"] = res[person_date].position;
				}
			}
		});
        model.ccPerson = model.ccPersonIds;
		var assModeljson = $.toJSON(model) ;
		data.model = assModeljson ;
		return data;
	}
	,submitAction: function(event) {

		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		var flag = false ;

		if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.AtsOverTimeBillForm") {
			var personId = $('#entries_person_id').val();
			var proposerId = $('#proposer_id').val();
			if(undefined != personId && undefined != proposerId && personId != "" && proposerId != "" && personId != proposerId){
				shr.showError({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_30, hiddenAfter: 5});
				return;
			}
		}

		if (_self.validate()&&_self.verify()&&($form.valid())) {
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_startTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_endTime").split(" ")[0];
			var billType = "overTime";
			var personId = $('#entries_person_el').val()
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: false,
				success:function(res){
					var result = res.result;
					if(result==""){
						shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_13, function() {
						_self.doSubmit(event, 'submit');
						});
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_20,function(){
							shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_13, function() {
									_self.doSubmit(event, 'submit');
							});
						});
					}
				}
			});
		}

	}
	,before :function(){

		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		var flag = false ;
		if (_self.validate()&&($form.valid())) {
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_startTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_endTime").split(" ")[0];
			var billType = "overTime";
			var personId = $('#entries_person_el').val()
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: false,
				success:function(res){
					var result = res.result;
					if(result==""){
						flag= true;
					}else{
					 	shr.showConfirm(result+jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_20,function(){
					 		flag= true;
					 	});
					}
				}
			});
		}
		// return false 也能保存，固让js报错，后续让eas修改 return false 逻辑
		//var len = workArea.length() ;
		return flag ;
	}
	,beforeSave:function(){
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		if (($form.valid() && _self.verify())) {
			var beginDate = atsMlUtile.getFieldOriginalValue("entries_startTime").split(" ")[0];
			var endDate = atsMlUtile.getFieldOriginalValue("entries_endTime").split(" ")[0];
			var billType = "overTime";
			var personId = $('#entries_person_el').val()
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: true,
				success:function(res){
					var result = res.result;
					if(result==""){
						return true;
					}else{
					 	shr.showConfirm(result+jsBizMultLan.atsManager_atsOverTimeBillEdit_i18n_20,function(){
					 		return true;
					 	});
					}
				}
			});
		}
		// return false 也能保存，固让js报错，后续让eas修改 return false 逻辑
		var len = workArea.length() ;
		return false ;
	}

});
