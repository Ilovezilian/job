var deletedList = "";//用于存储在数据库中还存在，但是在页面上已删除的分录ID
var defaultTirpType = null;
var allDayRemote = 0;
shr.defineClass("shr.ats.atsTripBillBatchNewForPerEdit", shr.ats.atttenceEditFormImport, {

	rowid : "" ,
    cellname : "" ,
    value : "" ,
    iRow : "" ,
	iCol : "" ,

	initalizeDOM : function () {
		var _self = this;
		shr.ats.atsTripBillBatchNewForPerEdit.superClass.initalizeDOM.call(this);
		//_self.initUIFormatter();
		_self.setNumberFieldEnable();
		_self.processF7ChangeEvent();
		_self.setButtonVisible();//隐藏按钮
		_self.setDefaultValue();//设置默认值
		
		_self.processF7ChangeEventHrOrgUnit();
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		_self.initCurrentHrOrgUnit(hrOrgUnitId);
		
//		_self.processF7ChangeEventHrOrgUnitV1();
		
		//隐藏提交生效按钮
		if (_self.getOperateState() == 'EDIT') {			
			if(_self.isFromWF()){ // 来自流程中心
				$('#submitEffect').hide();
				$("#submit").text(jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_16);
				$("#hrOrgUnit").shrPromptBox("disable");
			}
			$("#entries tbody tr").each(function(ele){
				$("#entries").jqGrid("setCell", $(this).attr("id"), 2,"","not-editable-cell");
				
			});
		}
		
		
		//审核编辑界面
		if(_self.isFromWF() && _self.getOperateState() == 'EDIT' && $("#billState").val() != 0)
		{
			$('#deleteRow_entries').unbind("click").attr("onclick","").css("cursor","default");
			$('#addRow_entries').unbind("click").attr("onclick","").css("cursor","default");
			$('#import').unbind("click").attr("onclick","").css("cursor","default");
			$(".editGrid-toolbar").hide();
			$("#submit").hide();
			var lastRowNum = $('#entries').getGridParam("reccount");
			for (var i = 1;i<= lastRowNum;i++) {
				var temp_id = $("#entries tr:eq("+ i +")").attr("id");
				$("#entries").jqGrid('setCell',temp_id,'person','','not-editable-cell');
			}	
		}
		//考勤计算--已计算页签--明细显示模式--补签卡按钮进来，只显示提交生效按钮
		if(shr.getUrlParam('fromCalDetail')!=null && shr.getUrlParam('fromCalDetail')=="1"){
			$("#save").hide();
			$("#submit").hide();
			$("#cancelAll").hide();
			$("#import").hide();
			$(".view_manager_header > div > div").eq(0).remove();
			$("#submitEffect").addClass("shrbtn-primary");
		}
		_self.initCcPersonPrompt();
		_self.initByIsAllDay();
	},
    initCcPersonPrompt:function() {
        atsCcPersonUtils.initCCPersonIdsPrompt(this);
        if (this.getOperateState() != 'VIEW') {
            var person = $("#proposer").shrPromptBox("getValue");
            if (!person) {
               //  shr.showWarning({message:"Please select people."});
            } else {
                $('#ccPersonIds').shrPromptBox("setOtherParams", {
                    personId: person.id
                });
            }
        }
    }
	,addRowAction:function(event){
		shr.ats.atsTripBillBatchNewForPerEdit.superClass.addRowAction.call(this,event);
		var ind = $("#entries tbody tr:last-child td[aria-describedby=entries_cb]").text();
		$("#" + ind + "_person").shrPromptBox("setValue",$("#proposer").shrPromptBox("getValue"));
		$("#entries").jqGrid("saveCell", ind, 2);
		ind = $("#entries tbody tr:last-child").attr('id');
		$("#entries").jqGrid("setCell", ind, 2,"","not-editable-cell");
	}
	
	,processF7ChangeEventHrOrgUnit : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
//					var rows = $('#entries').getGridParam("reccount");
//					for (var i = rows; i >= 1; i--){
//						if(that.getOperateState()!='VIEW'){
//							$("#entries tr").eq(i).find("td").eq(2).html("");
//						}
//					}
					that.initCurrentHrOrgUnit(info.id);
					//$("#entries_person_number").val("");
				}
			});
		}
	}
	,initCurrentHrOrgUnit: function(hrOrgUnitId) {
		var that = this; 		
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
	
	
	,entries_gridRemove : function (rowId){
		if (rowId) {
			waf("#entries").wafGrid('delRow', rowId);
		}
	}
	
	,processF7ChangeEventHrOrgUnitV1 : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					var rows = $('#entries').getGridParam("reccount");
					for (var i=rows; i>=1; i--){
						var tempId = $("#entries tr").eq(i).attr("id");
						that.entries_gridRemove(tempId);
					}
				}
			});
		}
	}
	
	
	
	//对界面进行格式化
	,initUIFormatter : function(){
		var _self = this;
		//界面微调
		$("#breadcrumb li").eq(2).text(jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_9);
		if(_self.isFromWF()){
			$("#breadcrumb li").eq(0).text(jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_0);
		}
	}
	
	//编辑页面按钮隐藏
	,setButtonVisible:function(){
		var billState = $("#billState").val();
		//alert(billState);
		if (billState) {
			if (billState==3 || jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_13==billState
				|| billState ==4||jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_12==billState
				|| billState ==2||jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_14==billState ) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1==billState || jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_17== billState
				|| 2 == billState || jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_14==billState ) { //未审批或审批中
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
		}
		if(this.isFromWF()){
			$("#cancelAll").hide();
		}
	}
	,assembleModel: function() {
	    
		var model = shr.ats.atsTripBillBatchNewForPerEdit.superClass.assembleModel.call(this);
		//审核编辑界面重新点击出差类型 josn 转换出错
		if(this.isFromWF() || shr.getUrlParam('fromCalDetail')=="1")
		{
		  var lastRowNum = $('#entries').getGridParam("reccount");
		     
		    for(var i = 0; i < lastRowNum; i++ )
		    {
		       if(model.entries[i] != undefined){
				  delete  model.entries[i].tripType.state
			   }
		    }
		    
		}
		var len = model.entries.length;
		var personDateStr = '';
		for (var i = 0; i < len; i++) {
			var personId = model.entries[i].person.id;
			var date = model.entries[i].tripStartTime;
			if(date && personId){
				if(i > 0){
					personDateStr +=",";
				}
				personDateStr += personId +"_"+date.substring(0,10);
			}
			
		}
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
				for (var i = 0; i < len; i++) {
					var personId = model.entries[i].person.id;
					var date = model.entries[i].tripStartTime;
					if(date && personId){
						var person_date = personId +"_"+date.substring(0,10);						
						if(res[person_date] && res[person_date].adminOrgUnit){
							model.entries[i]["adminOrgUnit"] = res[person_date].adminOrgUnit;
							model.entries[i]["position"] = res[person_date].position;
						}						
					}
				}
			}
		});
        model.ccPerson = model.ccPersonIds;
		for (var i = 0; i < len; i++) {
			model.entries[i].startTimeHMS = model.entries[i].startTimeDate +" "+ model.entries[i].startTimeHMS;
			model.entries[i].endTimeHMS = model.entries[i].endTimeDate +" "+ model.entries[i].endTimeHMS;
		}
		return model ;		
	}
	/**
	 * 点击取消按钮 返回到个人出差列表list(专员) ||  com.kingdee.eas.hr.ats.app.AtsTripBillAllList
	 */
	,cancelAllAction:function(){	
	 	/*window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsTripBillList";*/
		var _self = this ;
	 	_self.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsTripBillList',
			serviceId: shr.getUrlRequestParam("serviceId")
		});
	}
	
	/**
	 * 提交生效
	 * 重写此方法的校验调用方法
	 */
	,submitEffectAction : function (event) {
		var _self = this;
		if (_self.validate() && _self.verify()) {
			if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
				shr.showConfirm(jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_5, function() {
					_self.prepareSubmitEffect(event, 'submitEffect');
				});
			}else{
				shr.showConfirm(jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_7, function() {
					_self.prepareSubmitEffect(event, 'submitEffect');
				});
			}
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
				//考勤计算--已计算页签--明细显示模式--请假按钮进来，提交生效后直接返回列表
				if(shr.getUrlParam('fromCalDetail')!=null && shr.getUrlParam('fromCalDetail')=="1"){
					_self.cancelAllAction();
				}
				else{
					_self.back();
				}
			}
		});	
	}
	
	
	/**
	 * 提交工作流
	 * 重写此方法的校验调用方法
	 */
	,submitAction: function(event) {
		var _self = this;
		if (_self.validate() && _self.verify()) {
			shr.showConfirm(jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_6, function() {
				_self.doSubmit(event, 'submit');
			});
		}		
	}
	
	/**
	 * 设置分录行的默认值。重写框架此方法
	 * 规则：依据上一条复制除了员工信息、出差天数之外的基础信息
	 * 100条最大值设置
	 */
	,createNewEntryModel: function() {
		var _self = this;
		var lastRowNum = $('#entries').getGridParam("reccount");
		if (lastRowNum>=100) {
			shr.showWarning({message:jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_18,hideAfter:5});
			return false;
		}
		else {
//			defaultTirpType = {id:"0kB0QjzlQDG7EhWQJo2p3Re3I9k=",name:"国内",number:"001",state:2};//国内
//			if (!_self.isTripTypeEffective("0kB0QjzlQDG7EhWQJo2p3Re3I9k=")){
//				defaultTirpType = null;
//			}
			$("#entries").editCell(lastRowNum, 5, true);//需要将编辑焦点移动到不需复制的字段，否则会出现异常
			if (lastRowNum<1) return {tripType:defaultTirpType};
			else {
				var temp_id = $("#entries tr:eq("+ lastRowNum +")").attr("id");
				var lastTripType = $("#entries").jqGrid("getRowData", temp_id).tripType;
				var lastTripReason = $("#entries").jqGrid("getRowData", temp_id).tripReason;
				var lastTripStartTime = $("#entries").jqGrid("getRowData", temp_id).tripStartTime;
				var lastTripEndTime = $("#entries").jqGrid("getRowData", temp_id).tripEndTime;
				var lastTripStartPlace = $("#entries").jqGrid("getRowData", temp_id).tripStartPlace;
				var lastTripEndPlace = $("#entries").jqGrid("getRowData", temp_id).tripEndPlace;
				var lastRemark = $("#entries").jqGrid("getRowData", temp_id).remark;
				return {tripType:lastTripType,tripReason:lastTripReason,tripStartPlace:lastTripStartPlace,tripEndPlace:lastTripEndPlace,remark:lastRemark};
			}
		}	
	}
	
	
	
	/**
	 * 删除行
	 * 重写此方法，删除前先保存分录ID（只保存已存在数据库分录）
	 */
	,deleteRowAction: function(event) {
		var _self = this;	
		var $editGrid = this.getEditGrid(event.currentTarget);
		var ids = $editGrid.jqGrid('getSelectedRows');
		if (ids) {
			_self.beforeDeleteRow(ids);
			for (var i = ids.length - 1; i >= 0; i--) {
				$editGrid.jqGrid('delRow', ids[i]);
			}
		}		
	}
	
	//删除前做保存操作，只保存存在数据库中的（未保存的数据id位数不会超过100）
	,beforeDeleteRow : function(ids) {
		for (var i = ids.length - 1; i >= 0; i--) {
			if (ids[i].length>3){
				deletedList += (ids[i]+",");
			}
		}
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
		}
	}
	,processF7ChangeEvent : function(){
	    var _self=this;
		var tripBillGrid=$("#entries");
		tripBillGrid.jqGrid("option", {
			  afterEditCell:function (rowid, cellname, value, iRow, iCol) {
					if(cellname=="person"){
					var hrOrgUnitId=$("#hrOrgUnit_el").val();
						$("#"+rowid+"_person").shrPromptBox("option",{
						verifyBeforeOpenCallback: function(event){
						if( $("#hrOrgUnit").val() == ""){
							shr.showError({
								message:jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_10,
								hideAfter:6
							});
							return false;
						}else{
							return true;							
						}
					
				}
			});
					$("#"+rowid+"_person").shrPromptBox().attr("data-params",hrOrgUnitId);
					}
					if(cellname=="person"){
						$("#"+iRow+"_person").shrPromptBox("option",{
								onchange : function(e, value) {
									//tripBillGrid.jqGrid("setCell",rowid,"tripStartTime","");
									//tripBillGrid.jqGrid("setCell",rowid,"tripEndTime","");
									//tripBillGrid.jqGrid("setCell",rowid,"tripDays","");
									/* var personId = value.current.id;
									_self.loadPersonInfo(personId,rowid); */
								}
								,afterOnSelectRowHandler:function(e,object){
									var person = object && object.value;
									if(!person){
										return;
									}
									var tripStartTime = $("#entries").jqGrid("getCell", rowid,"tripStartTime");
									tripStartTime && HRTimeZoneService.getHRTimeZone(person.id,function(data, eObj){
										 $("#entries").jqGrid("setCell",rowid, "timeZone",data[person.id] || {});
									},tripStartTime);
								}
						});
					}

				  if(cellname=="tripStartTime" || cellname=="tripEndTime"){
					  //_self.setAllDayToNot(rowid);
				  }

				  if(cellname == "isAllDay"){
					  if(rowid != null && rowid != ""){
						  var rowidChange = rowid.replace("/","");
						  rowidChange = rowidChange.replace("+","");
						  $("#chk_entries_isAllDay_"+rowidChange).change( function (){
							  _self.allDayOnChange(rowid);
						  });
					  }
				  }
					
					_self.saveEditCellValue(rowid,cellname, value,iRow,iCol) ;
			  }
			  ,afterSaveCell:function(rowid, cellname, value, iRow, iCol) {
//				  if(cellname=="tripStartTime" || cellname=="tripEndTime" ){
//						var formatValue=value.trim().replace("/","-");
//						tripBillGrid.jqGrid("setCell",rowid,cellname,formatValue);
//				  }
//				  
				  	  _self.afterSaveCellTrigger(rowid, cellname, value, iRow, iCol);
				  
			  }
			  , beforeEditCell: function (rowid, cellname, value, iRow, iCol) { // 切换成文本的时候触发
				if(cellname == "isElasticCalLen"){
					var $entries_isElasticCalLen="#entries tr[id='" + rowid + "'] td[aria-describedby='entries_isElasticCalLen'] input";
					$($entries_isElasticCalLen).unbind("change");
					$($entries_isElasticCalLen).change(function(){
						var cal_days = _self.calculataTripDays(rowid);
						if (cal_days!=null && cal_days>=0) {
							$("#entries").jqGrid("setCell", rowid,"tripDays",cal_days);
						}
					});
				}

				/*if(cellname == "startTimeDate" || cellname == "startTimeHMS"){
					_self.startChange(rowid);
					_self.tripTimeChange(iRow,rowid,cellname);
				}

				if(cellname == "endTimeDate" || cellname == "endTimeHMS"){
					_self.endChange(rowid);
					_self.tripTimeChange(iRow,rowid,cellname);
				}*/
			  }
		});
			
	}
	,calTripCrossTimeZone:function(rowid,isStartTimeChanged,iRow){
		var tripStartTime = $("#entries").jqGrid("getCell", rowid,"tripStartTime");
		var tripEndTime = $("#entries").jqGrid("getCell", rowid,"tripEndTime");
		var person = $("#entries").jqGrid("getCell", rowid,"person");
		if(person && person.id && tripStartTime && isStartTimeChanged){
			HRTimeZoneService.getHRTimeZone(person.id,function(data, eObj){
					 $("#entries").jqGrid("setCell",rowid, "timeZone",data[person.id] || {});
			},$("#entries").jqGrid("getCell", rowid,"tripStartTime"));
		}
		if(!person || !tripStartTime || !tripEndTime || !_self.dateVerify(tripStartTime,tripEndTime)){
			return
		}
		var data = _self.prepareParam();
		var model = _self.assembleModel();
		model.entries = [model.entries[iRow - 1]];
		model.entries[0].startTimeHMS = model.entries[0].tripStartTime;
		model.entries[0].startTimeDate = model.entries[0].tripStartTime;
		model.entries[0].endTimeDate = model.entries[0].tripEndTime;
		model.entries[0].endTimeHMS = model.entries[0].tripEndTime;
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
						$("#entries").jqGrid("setCell", rowid,isStartTimeChanged ? "tripStartTime" : "tripEndTime"," ");
						shr.showError({message:
						jsBizMultLan.atsManager_atsTrip_crossTimezoneTip
						+ crossTimezoneDate[field],hideAfter:5});
					}
				}
			}
		});
	}
	,afterSaveCellTrigger : function(rowid, cellname, value, iRow, iCol)
	{
		var _self = this;
		var tripBillGrid=$("#entries");
		if(cellname=="tripStartTime" || cellname=="tripEndTime" || cellname=="person" || cellname == "isAllDay"){
			_self.tripTimeChange(iRow,rowid,cellname);
		}
				  
		if(cellname=="tripDays"){
			var cal_days = _self.calculataTripDays(rowid);
			if (cal_days!=null && cal_days>=0){
				if (value!=cal_days){
					_self.tripDaysNotEqualsActualValueStyleOn(iRow);
				}else {
					_self.tripDaysLessThanActualValueStyleOff(iRow);
				}
			} 
		}

		if(cellname == "startTimeDate" || cellname == "startTimeHMS"){
			_self.startChange(rowid);
			_self.tripTimeChange(iRow,rowid,cellname);
		}

		if(cellname == "endTimeDate" || cellname == "endTimeHMS"){
			_self.endChange(rowid);
			_self.tripTimeChange(iRow,rowid,cellname);
		}
		  
		if(cellname=="remark" || cellname=="tripReason" || cellname=="tripStartPlace" || cellname=="tripEndPlace"){
			var remarkLen = value.length;					    
			if (remarkLen>80){
				shr.showWarning({message:jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_8,hideAfter:5});
				tripBillGrid.jqGrid("setCell",rowid,cellname,"","","",true);
			}
		}	
	}

	,tripTimeChange : function(iRow,rowid,cellname){
		var _self = this;
		_self.tripDaysLessThanActualValueStyleOff(iRow);
		var cal_days = _self.calculataTripDays(rowid);
		if (cal_days!=null && cal_days>=0) {
			$("#entries").jqGrid("setCell", rowid,"tripDays",cal_days);
		}
		var flag = false;
		if(cellname == "tripStartTime"){
			flag = true;
		}
		if(cellname == "startTimeDate" || cellname == "startTimeHMS"){
			flag = true;
		}

		_self.calTripCrossTimeZone(rowid,flag,iRow);
	}
	//	判断出差类型是否有效（存在且生效）
	,isTripTypeEffective : function (tripType) {
		var _self = this;
		var flag = true;
		_self.remoteCall({
			type:"post",
			method:"isTripTypeEffective",
			param:{
				tripType:tripType
			},
			async: false,
			success:function(res){
				var info =  res;
				if (info.resFlag == false){
					flag = false;
				}else {
					flag = true;
					_self.setDefaultTripTypeName(info.typeName);
				}
			}
		});
		return flag;
		
	}

	//当开始出差时间日期或者是开始出差时间点发生变化的时候触发的操作
	,startChange : function(rowid){
		var that = this ;
		var startTimeDate =  $("#entries").jqGrid("getCell", rowid,"startTimeDate");
		var startTimeHMS =  $("#entries").jqGrid("getCell", rowid,"startTimeHMS");
		var allDay = $("#entries").jqGrid("getCell", rowid,"isAllDay");
		allDay = parseInt(allDay);

		if(startTimeDate == null || startTimeDate == ''){
			return;
		}
		if(startTimeHMS == null || startTimeHMS == ''){
			startTimeHMS = "00:00:00";
		}
		if(startTimeHMS.length > 8){
			startTimeHMS = startTimeHMS.split(" ")[1];
		}
		var startTime = startTimeDate +" "+startTimeHMS;

		if(allDay){
			allDayRemote = rowid;
			var end_Time = $("#entries").jqGrid("getCell", rowid,"tripEndTime");
			var personId = $("#entries").jqGrid("getCell", rowid,"person").id;
			that.remoteTripTimeByAllDay(personId,startTime ,end_Time,rowid);
		}else {
			$("#entries").jqGrid("setCell", rowid,"tripStartTime",startTime);
		}
	}


	//当结束出差时间日期或者是结束出差时间点发生变化的时候触发的操作
	,endChange : function(rowid){
		var that = this ;
		var endTimeDate = $("#entries").jqGrid("getCell", rowid,"endTimeDate");
		var endTimeHMS = $("#entries").jqGrid("getCell", rowid,"endTimeHMS");
		var allDay = $("#entries").jqGrid("getCell", rowid,"isAllDay");
		allDay = parseInt(allDay);
		if(endTimeDate == null || endTimeDate == ''){
			return;
		}
		if(endTimeHMS == null || endTimeHMS == ''){
			endTimeHMS = "00:00:00";
		}
		if(endTimeHMS.length > 8){
			endTimeHMS = endTimeHMS.split(" ")[1];
		}
		var endTime = endTimeDate +" "+endTimeHMS;

		if(allDay){
			allDayRemote = rowid;
			var begin_Time = $("#entries").jqGrid("getCell", rowid,"tripStartTime");
			var personId = $("#entries").jqGrid("getCell", rowid,"person").id;
			that.remoteTripTimeByAllDay(personId,begin_Time ,endTime,rowid);
		}else {
			$("#entries").jqGrid("setCell", rowid,"tripEndTime",endTime);
		}
	}



	//获得今天的日期 yyyy-mm-dd
	,getToday : function(){
		var date = new Date();
		var today = "" + date.getFullYear() + "-";
		today += (date.getMonth()+1) + "-";
		today += date.getDate() ;
		return today;
	}

	,setAllDayToNot : function(rowid){
		$("#entries").jqGrid("setCell", rowid,"isAllDay",0);
	}

	,allDayOnChange : function(rowid){
		var _self = this;
		var allDay = $("#entries").jqGrid("getCell", rowid,"isAllDay");
		allDay = parseInt(allDay);
		if(allDay){
			if(allDayRemote != rowid){
				var personId = $("#entries").jqGrid("getCell", rowid,"person").id;
				var begin_Time = $("#entries").jqGrid("getCell", rowid,"tripStartTime");
				var end_Time = $("#entries").jqGrid("getCell", rowid,"tripEndTime");
				if(begin_Time != null || end_Time != null){
					_self.remoteTripTimeByAllDay(personId,begin_Time,end_Time,rowid);
				}
			}else {
				allDayRemote = 0;
			}
		}else {
			if(allDayRemote == rowid){
				allDayRemote = 0;
			}
			atsMlUtile.removeCellClass($("#entries"),"tripStartTime","disabled",rowid);
			atsMlUtile.removeCellClass($("#entries"),"tripStartTime","not-editable-cell",rowid);
			atsMlUtile.removeCellClass($("#entries"),"tripEndTime","disabled",rowid);
			atsMlUtile.removeCellClass($("#entries"),"tripEndTime","not-editable-cell",rowid);

			atsMlUtile.removeCellClass($("#entries"),"startTimeHMS","disabled",rowid);
			atsMlUtile.removeCellClass($("#entries"),"startTimeHMS","not-editable-cell",rowid);

			atsMlUtile.removeCellClass($("#entries"),"endTimeHMS","disabled",rowid);
			atsMlUtile.removeCellClass($("#entries"),"endTimeHMS","not-editable-cell",rowid);
			var cal_days = _self.calculataTripDays(rowid);
			if (cal_days!=null && cal_days>=0) {
				$("#entries").jqGrid("setCell", rowid,"tripDays",cal_days);
			}
		}

	}

	,remoteTripTimeByAllDay : function(personId,begin_Time,end_Time,rowid){
		var _self = this;
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
				$("#entries").jqGrid("setCell", rowid,"tripStartTime",info.beginTime,"disabled");
				$("#entries").jqGrid('setCell', rowid, 'tripStartTime', info.beginTime, 'not-editable-cell');
				$("#entries").jqGrid("setCell", rowid,"tripEndTime",info.endTime,"disabled");
				$("#entries").jqGrid('setCell', rowid, 'tripEndTime', info.endTime, 'not-editable-cell');

				$("#entries tr").eq(rowid).find('td[aria-describedby=entries_tripStartTime]').trigger("change");
				$("#entries tr").eq(rowid).find('td[aria-describedby=entries_tripEndTime]').trigger("change");
				_self.setDateAndHMS(info.beginTime,info.endTime,rowid,1);
			}
		});
		var cal_days = _self.calculataTripDays(rowid);
		if (cal_days!=null && cal_days>=0) {
			$("#entries").jqGrid("setCell", rowid,"tripDays",cal_days);
		}
	}

	,setDateAndHMS:function(begin_Time,end_Time,rowid,allDay){
		if(begin_Time != null && begin_Time != ''){
			$("#entries").jqGrid("setCell", rowid,"startTimeDate",begin_Time.split(" ")[0]);
			if(allDay){
				$("#entries").jqGrid("setCell", rowid,"startTimeHMS",begin_Time,"disabled");
				$("#entries").jqGrid('setCell', rowid, 'startTimeHMS', begin_Time, 'not-editable-cell');
			}else {
				$("#entries").jqGrid("setCell", rowid,"startTimeHMS",begin_Time);
			}
		}else {
			if(allDay){
				$("#entries").jqGrid("setCell", rowid,"startTimeHMS",'',"disabled");
				$("#entries").jqGrid('setCell', rowid, 'startTimeHMS', '', 'not-editable-cell');
			}
		}
		if(end_Time != null && end_Time != ''){
			$("#entries").jqGrid("setCell", rowid,"endTimeDate",end_Time.split(" ")[0]);
			if(allDay){
				$("#entries").jqGrid("setCell", rowid,"endTimeHMS",end_Time,"disabled");
				$("#entries").jqGrid('setCell', rowid,'endTimeHMS',end_Time, 'not-editable-cell');
			}else {
				$("#entries").jqGrid("setCell", rowid,"endTimeHMS",end_Time);
			}
		}else {
			if(allDay){
				$("#entries").jqGrid("setCell", rowid,"endTimeHMS",'',"disabled");
				$("#entries").jqGrid('setCell', rowid,'endTimeHMS','', 'not-editable-cell');
			}
		}
	}

	,initByIsAllDay:function(){
		var that = this;


		var rowCount = $('#entries').jqGrid('getRowCount');
		var rowData = $("#entries").jqGrid('getRowData');
		for(var index = 0; index < rowCount ; index ++){
			var  monthlyStatementDate = rowData[index].monthlyStatementDate;
			if(monthlyStatementDate == null || monthlyStatementDate == ""){
				var begin_Time = $("#entries").jqGrid("getCell", rowData[index].id,"tripStartTime");
				var end_Time = $("#entries").jqGrid("getCell", rowData[index].id,"tripEndTime");
				var allDay = $("#entries").jqGrid("getCell", rowData[index].id,"isAllDay");
				allDay = parseInt(allDay);
				that.setDateAndHMS(begin_Time,end_Time,rowData[index].id,allDay);
				if(allDay && that.getOperateState() != 'VIEW'){
					$("#entries").jqGrid("setCell", rowData[index].id,"tripStartTime","","disabled");
					$("#entries").jqGrid('setCell', rowData[index].id, 'tripStartTime',"", 'not-editable-cell');
					$("#entries").jqGrid("setCell", rowData[index].id,"tripEndTime","","disabled");
					$("#entries").jqGrid('setCell', rowData[index].id, 'tripEndTime', "", 'not-editable-cell');
				}
			}
		}
	}



	
	//根据起止时间计算出差时长
	,calculataTripDays : function(rowid){ 
		var _self=this;
		var resTripDays = -1;
		var tripStartTime = $("#entries").jqGrid("getCell", rowid,"tripStartTime");
		var tripEndTime = $("#entries").jqGrid("getCell", rowid,"tripEndTime");
		var tripPersonId = $("#entries").jqGrid("getCell", rowid,"person").id;
		var isElasticCalLen = $("#entries").jqGrid('getCell', rowid, "isElasticCalLen")=="1";
		if ( tripPersonId!="" && tripPersonId!=null && tripStartTime!="" && tripStartTime!=null && tripEndTime!=""&&tripEndTime!=null && _self.dateVerify(tripStartTime,tripEndTime)) {
			//tripStartTime = tripStartTime.substr(0,tripStartTime.indexOf(" "));
			//tripEndTime   = tripEndTime.substr(0,tripEndTime.indexOf(" "));
			tripStartTime = tripStartTime.replace("\\-","/");
		 	tripEndTime = 	tripEndTime.replace("\\-","/");
		 	var tripStartTimeOfDate = new Date(tripStartTime);
		 	var tripEndTimeOfDate = new Date(tripEndTime);
		 	var longTime = tripEndTimeOfDate.getTime() - tripStartTimeOfDate.getTime();
		 	var dayTime = 24 * 60 * 60 * 1000.0;
		 	//计算出除去非工作日的出差时间
		 	
		 	var personId = $("#entries").jqGrid("getCell",rowid,"person").id
			var isAllDay = $("#entries").jqGrid("getCell",rowid,"isAllDay");
		 	_self.remoteCall({
			type:"post",
			async: false,
			method:"getRealLeaveLengthInfo",
			param:{personId:personId,
				beginTime:tripStartTime,
				endTime:tripEndTime,
				isAllDay:isAllDay,
				isElasticCalLen:isElasticCalLen},
			success:function(res){
				info =  res;
				
				var day = parseFloat(info.leaveBillDays);
			 	resTripDays = day.toFixed(atsMlUtile.getSysDecimalPlace());
			}
			}); 	
		}
		return resTripDays;
	}
	
	//重写表单验证方法
	,verify:function(){
			var _self = this;
			return _self.rowCountVerify() && _self.dateVerifyAll() && _self.dateInterleaveVerify() && _self.getCrossTripMsgsAction() && _self.DBdateInterleaveVerify() ;
	}
	,validateIsFillTripVerify:function(){
		var that = this;
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
	}
	
	//至少录入一条分录
	,rowCountVerify:function(){
			var _self = this;
			var rows = $('#entries').getGridParam("reccount");
			if  (rows<1) {
				shr.showWarning({message:jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_11,hideAfter:5});
				return false;			
			} 
			else return true;
			
	}
	
	//点保存时全部校验
	,dateVerifyAll:function (){
		var rows = $('#entries').getGridParam("reccount");
		var flag = true;
		var tripDaysFlag = true;
		var errorMessage  ="";
		for (var i=1;i<=rows;i++){
			var tempId = $("#entries tr").eq(i).attr("id");
			var tripStartTime = $("#entries").jqGrid("getCell", tempId,"tripStartTime");
			var tripEndTime = $("#entries").jqGrid("getCell", tempId,"tripEndTime");
			var regEx = new RegExp("\\-","gi"); //i不区分大小写 g匹配所有
			tripStartTime = tripStartTime.replace(regEx,"/");
			tripEndTime = tripEndTime.replace(regEx,"/");
			var tripStartTimeOfDate = new Date(tripStartTime); 
			var tripEndTimeOfDate = new Date(tripEndTime);
			var longTime = tripEndTimeOfDate.getTime() - tripStartTimeOfDate.getTime();
				if (longTime <= 0) {	
					flag = flag && false;
					errorMessage+= (i+",");
				} 
			var tripDays = $("#entries").jqGrid("getCell", tempId,"tripDays");
			if(parseFloat(tripDays)<=0){
				tripDaysFlag = tripDaysFlag && false;
				errorMessage+= (i+",");
			}		
		}
		if  (!flag) {
			shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_4,[errorMessage]),hideAfter:5});
			return false;
		} 
		if(!tripDaysFlag){
			shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_3,[errorMessage]),hideAfter:5});
			return false;
		} 
		return true;
	}
	
	//当前表单远程校验，出差单同一个人开始结束时间段不能有重叠	
	,dateInterleaveVerify:function (){
		var _self = this;
		var info;
		_self.removeInterleaveStyleChange();//先去除原本的个性化提示，以免提示出现覆盖
		var rows = $('#entries').getGridParam("reccount");
		if  (rows>1){
			var id="",rowNum="",personID="",tripStartTime="",tripEndTime="",delimiter=",";
			//封装校验表单数组对象
			for (var i=1;i<=rows;i++){
				var tempId=$("#entries tr").eq(i).attr("id");
				var tempPersonId=$("#entries").jqGrid("getCell", tempId,"person").id;
				var temptripStartTime = $("#entries").jqGrid("getCell", tempId,"tripStartTime");
				var temptripEndTime = $("#entries").jqGrid("getCell", tempId,"tripEndTime");
				id +=(tempId+delimiter);
				rowNum += (i+delimiter);
				personID += (tempPersonId+delimiter);
				tripStartTime +=(temptripStartTime+delimiter);
				tripEndTime += (temptripEndTime+delimiter);
					
			}
			//把最后一个分隔符去掉
			id = id.substring(0,id.length-1);
			rowNum = rowNum.substring(0,rowNum.length-1);
			personID = personID.substring(0,personID.length-1);
			tripStartTime = tripStartTime.substring(0,tripStartTime.length-1);
			tripEndTime = tripEndTime.substring(0,tripEndTime.length-1);
			/* var obj =[];
			for (var i=1;i<=rows;i++){
				var tempId=$("#entries tr").eq(i).attr("id");
				var personId=$("#entries").jqGrid("getCell", tempId,"person").id;
				var tripStartTime = $("#entries").jqGrid("getCell", tempId,"tripStartTime");
				var tripEndTime = $("#entries").jqGrid("getCell", tempId,"tripEndTime");
				obj[i-1]={rowNum:i,id:tempId,personID:personId,tripStartTime:tripStartTime,tripEndTime:tripEndTime};
			} */
		
			_self.remoteCall({
				type:"post",
				method:"dateInterleaveVerify",
				async: false,
				param:{
					delimiter:delimiter,
					id:id,
					rowNum:rowNum,
					personID:personID,
					tripStartTime:tripStartTime,
					tripEndTime:tripEndTime		
				},
				success:function(res){
					info =  res;
					
				}
				});
				if (!info.errorTag) {
						var showMes="";
						_self.dateInterleaveStyleChange(info);
						showMes+=info.errorLog.replace(/!/g,"!</br>");
					    shr.showWarning({message:showMes,hideAfter:5});
						return false;
					} else {
						return true;
				}
		}else return true;
	}
	
	//数据库远程校验，出差单同一个人开始结束时间段不能有重叠	
	,DBdateInterleaveVerify:function (){
		var _self = this;
		var info;
		_self.removeInterleaveStyleChange();//先去除原本的个性化提示，以免提示出现覆盖
		var rows = $('#entries').getGridParam("reccount");
		if  (rows>0){
			var id="",rowNum="",tripDays="",personID="",tripStartTime="",tripEndTime="",allDays="",delimiter=",";
			//封装校验表单数组对象
			for (var i=1;i<=rows;i++){
				var tempId=$("#entries tr").eq(i).attr("id");
				var tempPersonId=$("#entries").jqGrid("getCell", tempId,"person").id;
				var temptripStartTime = $("#entries").jqGrid("getCell", tempId,"tripStartTime");
				var temptripEndTime = $("#entries").jqGrid("getCell", tempId,"tripEndTime");
				var tripDay = $("#entries").jqGrid("getCell", tempId,"tripDays");
				var isElasticCalLen = $("#entries").jqGrid('getCell', tempId, "isElasticCalLen")=="1";
				var allDay = $("#entries").jqGrid("getCell", tempId,"isAllDay");
				id +=(tempId+delimiter);
				rowNum += (i+delimiter);
				personID += (tempPersonId+delimiter);
				tripStartTime +=(temptripStartTime+delimiter);
				tripEndTime += (temptripEndTime+delimiter);
				tripDays += (tripDay+delimiter);
				allDays +=(allDay+delimiter);
			}
			//把最后一个分隔符去掉
			id = id.substring(0,id.length-1);
			rowNum = rowNum.substring(0,rowNum.length-1);
			personID = personID.substring(0,personID.length-1);
			tripStartTime = tripStartTime.substring(0,tripStartTime.length-1);
			tripEndTime = tripEndTime.substring(0,tripEndTime.length-1);
			tripDays = tripDays.substring(0,tripDays.length-1);
			allDays = allDays.substring(0,allDays.length-1);
			var deletedFlag = false;
			if (deletedList!=""){
				deletedList = deletedList.substring(0,deletedList.length-1);
				deletedFlag = true;
			}
			
			_self.remoteCall({
				type:"post",
				method:"DBRepeatDataChecked",
				async: false,
				param:{
					delimiter:delimiter,
					id:id,
					rowNum:rowNum,
					personID:personID,
					tripStartTime:tripStartTime,
					tripEndTime:tripEndTime,
					tripDays:tripDays,
					deletedFlag : deletedFlag,
					deletedList:deletedList,
					isElasticCalLen:isElasticCalLen,
					allDays:allDays
				},
				success:function(res){
					info =  res;
				}
				});
				if (!info.errorTag) {
						var showMes="";
						_self.dateInterleaveStyleChangeTwo(info);
						showMes+=info.errorLog.replace(/!/g,"!</br>");
					    shr.showWarning({message:showMes,hideAfter:5});
						return false;
					} else {
						return true;
			}
		} else return true;
	}

	,getCrossTripMsgsAction:function (){
		var _self = this;
		var info;
		_self.removeInterleaveStyleChange();//先去除原本的个性化提示，以免提示出现覆盖
		var rows = $('#entries').getGridParam("reccount");
		if  (rows>0){
			var id="",rowNum="",personID="",tripStartTime="",tripEndTime="",allDays="",delimiter=",";
			//封装校验表单数组对象
			for (var i=1;i<=rows;i++){
				var tempId=$("#entries tr").eq(i).attr("id");
				var tempPersonId=$("#entries").jqGrid("getCell", tempId,"person").id;
				var temptripStartTime = $("#entries").jqGrid("getCell", tempId,"tripStartTime");
				var temptripEndTime = $("#entries").jqGrid("getCell", tempId,"tripEndTime");
				var allDay = $("#entries").jqGrid("getCell", tempId,"isAllDay");
				id +=(tempId+delimiter);
				rowNum += (i+delimiter);
				personID += (tempPersonId+delimiter);
				tripStartTime +=(temptripStartTime+delimiter);
				tripEndTime += (temptripEndTime+delimiter);
				allDays +=(allDay+delimiter);
			}
			//把最后一个分隔符去掉
			id = id.substring(0,id.length-1);
			rowNum = rowNum.substring(0,rowNum.length-1);
			personID = personID.substring(0,personID.length-1);
			tripStartTime = tripStartTime.substring(0,tripStartTime.length-1);
			tripEndTime = tripEndTime.substring(0,tripEndTime.length-1);
			allDays = allDays.substring(0,allDays.length-1);
			_self.remoteCall({
				type:"post",
				method:"getCrossTripMsgs",
				async: false,
				param:{
					delimiter:delimiter,
					id:id,
					rowNum:rowNum,
					personID:personID,
					tripStartTime:tripStartTime,
					tripEndTime:tripEndTime,
					allDays:allDays,
					handler:"com.kingdee.shr.ats.web.handler.AtsTripBillBatchNewEditHandler",
				},
				success:function(res){
					info =  res;
				}
			});
			if (!info.errorTag) {
				var showMes="";
				_self.dateInterleaveStyleChangeTwo(info);
				showMes+=info.errorLog.replace(/!/g,"!</br>");
				shr.showWarning({message:showMes,hideAfter:5});
				return false;
			} else {
				return true;
			}
		} else return true;
	}
	
	//时间校验实现函数(开始时间得小于结束时间)
	,dateVerify:function(tripStartTime,tripEndTime){
			var regEx = new RegExp("\\-","gi"); //i不区分大小写 g匹配所有
			tripStartTime = tripStartTime.replace(regEx,"/");
			tripEndTime = tripEndTime.replace(regEx,"/");
			var tripStartTimeOfDate = new Date(tripStartTime); 
			var tripEndTimeOfDate = new Date(tripEndTime);
			var longTime = tripEndTimeOfDate.getTime() - tripStartTimeOfDate.getTime();
				if (longTime <= 0) {
					shr.showWarning({message: jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_1,hideAfter:5});
					return false;
				}
			return true;
			
	},
	// 获取表格序号列，修复平台表格序号列位置移动导致的提示列位置错误导致的显示异常bug
	getColNumIndex:function(){
		var _self = this;
		if(_self.colNumIndex){
			return _self.colNumIndex
		}
		$.each($("#entries").jqGrid("getAllColumn"),function(index,item){
			if(item.name=="rn"){
				_self.colNumIndex=index	
			}
		})
		return _self.colNumIndex
	}
	//对校验结果进行页面个性化提示
	 ,dateInterleaveStyleChange:function(res){
		var rnColNum=this.getColNumIndex()
		var data = res.errorLog.split("!");
		for (var i = 0;i<data.length;i++){
			if (data[i]!=null &&data[i]!=""){
				var dataSplit = data[i].split(" ");
				var errorRow = dataSplit[1];
				var interleaveRow="";
				for (j=3;j<dataSplit.length-1;j++){
					interleaveRow+=dataSplit[j]+",";
				}
				interleaveRow=interleaveRow.substring(0,interleaveRow.length-1);
				$("#entries tr:eq("+errorRow+") td:eq("+rnColNum+")").html("！").css("color","red")
					.attr({"data-toggle":"tooltip","data-placement":"left","title":shr.formatMsg(jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_19,[interleaveRow])});
				$("#entries tr:eq("+errorRow+") td:eq(2)").css("color","red");
				$("#entries tr:eq("+errorRow+") td:eq(3)").css("color","red");
				$("#entries tr:eq("+errorRow+") td:eq(4)").css("color","red");		
			}
		}
	}
	//对校验结果进行页面个性化提示
	 ,dateInterleaveStyleChangeTwo:function(res){
		var rnColNum=this.getColNumIndex()
		var data = res.errorLog.split("!");
		for (var i = 0;i<data.length;i++){
			if (data[i]!=null &&data[i]!=""){
				var dataSplit = data[i].split(" ");
				var errorRow = dataSplit[1];
				$("#entries tr:eq("+errorRow+") td:eq("+rnColNum+")").html("！").css("color","red").attr({"data-toggle":"tooltip","data-placement":"left","title":data[i]});
				$("#entries tr:eq("+errorRow+") td:eq(2)").css("color","red");
				$("#entries tr:eq("+errorRow+") td:eq(3)").css("color","red");
				$("#entries tr:eq("+errorRow+") td:eq(4)").css("color","red");		
			}
		}
	}

	//去除个性化展示，每次校验前去除
	//不去除问号的提示
	,removeInterleaveStyleChange:function(){
		var rnColNum=this.getColNumIndex()
		var rows = $('#entries').getGridParam("reccount");
		for (var i=1;i<=rows;i++){
			if ($("#entries tr:eq("+i+") td:eq("+rnColNum+")").html()!="？"){
				$("#entries tr:eq("+i+") td:eq("+rnColNum+")").html(i).removeAttr("data-toggle").removeAttr("data-placement").removeAttr("title");
				$("#entries tr:eq("+i+") td").css("color","rgb(51, 51, 51)");//如果设置成css("color","initial")会变成黑色，而原界面为灰色
			}	
		}
		
	}
	
	/**
	 *  成功导入数据后执行
	 *  可重写
	 */
	,afterUploadSuccess :function(){
		var _self = this ;
		jsBinder.updatePageTripDays.call(this);
		//_self.updatePageTripDays();
	}

	//导入完成后，若出差天数留空，自动计算出差天数
	//若不为空，取导入模板中填写的值
	,updatePageTripDays :function(){
		var _self = this ;
		var beginRow = selfParam;
		var endRow = $('#entries').getGridParam("reccount");
		for (var i = beginRow+1;i<=endRow;i++) {
			var temp_id = $("#entries tr:eq("+ i +")").attr("id");
			$("#entries").editCell(1, 7, true);//需要将编辑焦点移动到不需复制的字段，否则会出现异常
			var cal_days = jsBinder.calculataTripDays(temp_id);
			var temp_days = $("#entries").jqGrid("getCell", temp_id,"tripDays");
				if (temp_days!="" && temp_days!=cal_days){
					jsBinder.tripDaysNotEqualsActualValueStyleOn(i);
				}
				final_days=temp_days==""?cal_days:temp_days;
				$("#entries").jqGrid("setCell", temp_id,"tripDays",final_days);
		}	
	}

	
//	BT885189:出差单批量导入，所填出差天数与实际计算出差时间不一致时，不需要取小值填充
//	//导入完成后，若出差天数留空，自动计算出差天数
//	//若存在出差天数，依然计算实际出差天数，与当天页面出差天数做比较，取较小的作为出差天数
//	,updatePageTripDays :function(){
//		var _self = this ;
//		var beginRow = selfParam;
//		var endRow = $('#entries').getGridParam("reccount");
//		for (var i = beginRow+1;i<=endRow;i++) {
//			var temp_id = $("#entries tr:eq("+ i +")").attr("id");
//			$("#entries").editCell(1, 7, true);//需要将编辑焦点移动到不需复制的字段，否则会出现异常
//			var cal_days = jsBinder.calculataTripDays(temp_id);
//			var temp_days = $("#entries").jqGrid("getCell", temp_id,"tripDays");
//				if (temp_days!="" && temp_days!=cal_days){
//					jsBinder.tripDaysNotEqualsActualValueStyleOn(i);
//				}
//				final_days=temp_days==""?cal_days:cal_days<temp_days?cal_days:temp_days;
//				$("#entries").jqGrid("setCell", temp_id,"tripDays",final_days);
//		}	
//	}
		
	//设置导入前的传入参数：当前页面已有数据条数
	,setImportSelfParam : function(){
		return $('#entries').getGridParam("reccount");
	}
	
	//出差时长比实际值小的时候，行首会有个性化展示
	//触发时机：手动修改出差天数，导入完成之后
	,tripDaysNotEqualsActualValueStyleOn : function (iRow){
		var rnColNum=this.getColNumIndex()
		$("#entries tr:eq("+iRow+") td:eq("+rnColNum+")").html("？").css("color","red")
			.attr({"data-toggle":"tooltip","data-placement":"left","title":jsBizMultLan.atsManager_atsTripBillBatchNewEdit_i18n_15});
		
	}
	
	//出差时长和真实值一样，去除个性化展示
	,tripDaysLessThanActualValueStyleOff : function (iRow){
		var rnColNum=this.getColNumIndex()
		$("#entries tr:eq("+iRow+") td:eq("+rnColNum+")").html(iRow).removeAttr("data-toggle").removeAttr("data-placement").removeAttr("title").css("color","rgb(51, 51, 51)");
	}
	
	//设置默认出差方式
	,setDefaultTripTypeName : function (typeName){
		defaultTirpType = {id:"0kB0QjzlQDG7EhWQJo2p3Re3I9k=",name:typeName,number:"001",state:2};//国内
	}
	
	//设置默认值
	,setDefaultValue : function(){
		_self = this;
		if (!_self.isTripTypeEffective("0kB0QjzlQDG7EhWQJo2p3Re3I9k=")){//warnning:id写死，国内
			defaultTirpType = null;
		}
	}
	
	,beforeSubmit :function(){
		
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		_self.beforeWFValidStoreCellValue();
		if (($form.valid() && _self.verify())) {
			return true ;
		}
		// return false 也能保存，固让js报错，后续让eas修改 return false 逻辑
		var len = workArea.length() ;
		return false ;
	}
	
	,saveEditCellValue :function(rowid,cellname, value,iRow,iCol) {
		var _self = this;
		// 工作流界面且是编辑状态且不是未提交界面
		if(_self.isFromWF() && _self.getOperateState() == 'EDIT' && $("#billState").val() != 0)
		{
			this.rowid = rowid ;
			this.cellname = cellname ;
			this.value = value ;
			this.iRow = iRow ;
			this.iCol = iCol ;
		}
	}
	
	,beforeWFValidStoreCellValue :function() {
		var _self = this;
		
		if(this.rowid && this.cellname && this.iRow && this.iCol)
		{
			$("#entries").jqGrid("saveCell",this.rowid,this.iCol);
			//_self.afterSaveCellTrigger(this.rowid, this.cellname, this.value, this.iRow , this.iCol) ;
		}
	}
	
	,getCurrentModel : function(){
	
		var model = shr.ats.atsTripBillBatchNewForPerEdit.superClass.getCurrentModel.call(this);
		//审核编辑界面重新点击出差类型 josn 转换出错
		if(this.isFromWF())
		{
		  var lastRowNum = $('#entries').getGridParam("reccount");
		     
		    for(var i = 0; i < lastRowNum; i++ )
		    {
		       delete  model.entries[i].tripType.state 
		    }
		    
		}
		model.ccPersonIds = model.ccPersonIds && model.ccPersonIds.id || "";
        model.ccPerson = model.ccPersonIds;
		return model ;
	
	}
	,back: function(){
		if(this!=top){
			this.cancelAllAction();
		}
	}
});

