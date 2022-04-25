function WorkShiftStrategy() {
	var that = this;
	this.name = "WorkShiftStrategy";

	var _shifChanged = false;
	var _currentShiftWay = undefined;
	var _currentDataFrom = that.DATA_FROM_SCHEDULELIST;
	var _dayType = [
		$.attendmanageI18n.workShiftStrategy.dayType1,
		$.attendmanageI18n.workShiftStrategy.dayType2,
		$.attendmanageI18n.workShiftStrategy.dayType3
	];
	var _dayTypeMap = { //@ref com.kingdee.eas.hr.ats.DayTypeEnum
		workDay: 0,
		restDay: 1,
		legalHoliday: 2,
	};
	var _baseArrangeUrl = shr.getContextPath() + "/dynamic.do";
	_baseArrangeUrl += "?handler=com.kingdee.shr.ats.web.handler.workshift.ArrangeShiftHandler";
	_baseArrangeUrl += '&serviceId='+encodeURIComponent(shr.getUrlRequestParam("serviceId"));
	_baseArrangeUrl += "&method=";

	that.CLASS_ARRANGE = 'arrange';
	that.CLASS_SELECTED = 'cell-select-color';
	that.CLASS_GRAY = 'gray-color';
	that.CLASS_FORBIDDEN_GRAY = 'forbidden-gray-color';
	that.CLASS_REST = 'list-Green-color';
	that.CLASS_HOLIDAY = 'list-pink-color';

	that.SHIFT_TYPE_NOSHIFT = 1;
	that.SHIFT_TYPE_LIST = 2;
	that.SHIFT_TYPE_CALENDAR = 3;
	that.SHIFT_TYPE_SAVE = 4;
	that.SHIFT_TYPE_OTHER = 5;
	that.SHIFT_TYPE_VER_SHIFT = 6;
	that.SHIFT_WAY_TURN = 1;
	that.SHIFT_WAY_SCHEDULE = 2;
	that.SHIFT_WAY_COPY_SPECIFIC = 3;
	that.SHIFT_WAY_COPY_SELF = 4;
	that.SHIFT_WAY_OTHER = 5;

	that.DATA_FROM_ARRANGE = 1;
	that.DATA_FROM_SCHEDULELIST = 2;

	that.getArrangeShiftType = function() {
		if($("#noShiftQuery").length > 0) {
			if ($("#noShiftQuery").parent().hasClass("ui-state-active")) {
				return that.SHIFT_TYPE_NOSHIFT;
			} else if ($("#verticaliQuery").parent().hasClass("ui-state-active")) {
				return that.SHIFT_TYPE_VER_SHIFT;
			}
			// 这个地方也是颇为无奈啊！坑太多，填不过来就使用之前的逻辑吧@_@
			return that.SHIFT_TYPE_NOSHIFT;
		}
		var radios = $("input[name=shiftType][type=radio]");
		if(radios.length > 0) {
			return radios.parent(".checked").next("label").attr("for") == "shiftType3" ? that.SHIFT_TYPE_LIST : that.SHIFT_TYPE_CALENDAR;
		}
		return that.SHIFT_TYPE_OTHER;
	}

	that.setShifChanged = function() {
		_shifChanged = true;
	}

	that.getArrangeShiftWay = function() {
		return _currentShiftWay;
	}

	that.setArrangeShiftWay = function(shifWay) {
		_currentShiftWay = shifWay;
	}

	/**
	 * 所有手动排班的入口
	 * @param {Object} params
	 */
	that.arrangeWorkShift = function(params) {
		that.setDataFrom(that.DATA_FROM_ARRANGE);
		var arrangeShiftWay = that.getArrangeShiftWay();
		var arrangeType = that.getArrangeShiftType(); 
		var personNums = that.getSelectedPersonNum();
		var hrOrgUnit = that.getHrOrgUnit();
		if((arrangeType != that.SHIFT_TYPE_NOSHIFT || arrangeType != that.SHIFT_TYPE_VER_SHIFT) && hrOrgUnit.length == 0){
			atsCommonUtile.showWarning($.attendmanageI18n.workShiftStrategy.msg1);
			that.getArrangeManager().resetSelectStatus();
			return;
		}
		if(arrangeType == that.SHIFT_TYPE_CALENDAR && (!personNums || personNums.length == 0)){
			atsCommonUtile.showWarning( $.attendmanageI18n.workShiftStrategy.msg2);
			return;
		}
		if(arrangeShiftWay === that.SHIFT_WAY_SCHEDULE && arrangeType != that.SHIFT_TYPE_CALENDAR) {
			if(listWorkShift.getSelectedCellInfo().length == 0 && personNums.length == 0){
				atsCommonUtile.showWarning( $.attendmanageI18n.workShiftStrategy.msg3);
				return;
			}
		}
		if(hrOrgUnit.length > 1){
			atsCommonUtile.showWarning($.attendmanageI18n.workShiftStrategy.msg4);
			that.getArrangeManager().resetSelectStatus();
			return;
		}
		hrOrgUnit = hrOrgUnit[0];
		if(arrangeShiftWay === that.SHIFT_WAY_SCHEDULE) {
			_arrangeByshift(personNums,hrOrgUnit);
			return;
		}
    	if(personNums.length == 0){
			atsCommonUtile.showWarning( $.attendmanageI18n.workShiftStrategy.msg5);
			return;
		}
		if(arrangeShiftWay === that.SHIFT_WAY_TURN) {
			_arrangeByTurn(personNums,hrOrgUnit);
		}
		if(arrangeShiftWay === that.SHIFT_WAY_COPY_SELF || arrangeShiftWay === that.SHIFT_WAY_COPY_SPECIFIC) {
			_arrangeByCopy(personNums,hrOrgUnit);
		}
	}
	
	that.updateSchedule = function(shrCompoment,updateInfo){
		atsCommonUtile.httpRequest({
			url :_baseArrangeUrl + "updateSchedule",
			data : updateInfo,
			errorMsgProcess: function(errorMsg){
				if(errorMsg.totalCount){
					atsCommonUtile.showMessageTips($(shrCompoment),{
						tableModel : _getUpdateDetailColModel(),
						tableData: JSON.parse("[" + errorMsg.errorDetail.join() + "]"),
						successCount: errorMsg.totalCount - errorMsg.errorDetail.length,
						failureCount: errorMsg.errorDetail.length,
						closeCallback:function(){
							listWorkShift.renderListTable();
						}
					});
				}else{
					atsCommonUtile.showError(errorMsg);
				}
			}
		})
	}

	var _arrangeByTurn = function(personNums,hrOrgUnit) {
		var url = shr.getContextPath() + '/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsTurnShiftForListShift.list';
		url += '&firstBeginDate=' + that.getBeginDate() + '&firstEndDate=' + that.getEndDate();
		url += '&serviceId=' + encodeURIComponent(shr.getUrlRequestParam("serviceId"));
		url += '&hrOrgUnitObj=' + encodeURIComponent(JSON.stringify(hrOrgUnit));
		$("#iframe1").attr("src", url);
		$("#iframe1").dialog({
			modal: true,
			width: 800,
			minWidth: 800,
			height: 460,
			minHeight: 460,
			title: $.attendmanageI18n.workShiftStrategy.title1,
			open: function(event, ui) {},
			close: function() {
				_afterSelectTurns(personNums);
			}
		});
		$("#iframe1").attr("style", "width:800px;height:460px;");
		$("#iframe1").attr("scrolling","auto");
	}

	// 设置key到data里面，这也是坑。
	var _addKeyToDataAccordingPeronNum = function (data) {
		that.getSelectedKeys().forEach(function (key) {
			data.forEach(function (k) {
				if (key && k && key.split("@_@")[0] === k["personNum"]) {
					k["key"] = key;
				}
			});
		});
	}

	var _afterSelectTurns = function(personNums) {
		var ajaxParams = {
			success :function(data) {
				_addKeyToDataAccordingPeronNum(data);
				_rerenderShiftView(data);
			},
			url : _baseArrangeUrl + "arrangeShiftByTurn",
			data: atsGlobalDataCarrier.getData("SHIFT_WAY_TURN")
		}
		if(!ajaxParams.data) {
			return
		}
		ajaxParams.data.personNums = personNums;
		atsCommonUtile.httpRequest(ajaxParams);
	}

	var _arrangeByCopy = function(personNums,hrOrgUnit) {
		var url = shr.getContextPath() + '/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.arrangeByCopyWorkShift.form';
		url += '&originBeginDate=' + that.getBeginDate() + '&originEndDate=' + that.getEndDate();
		url += '&hrOrgUnitObj=' + encodeURIComponent(JSON.stringify(hrOrgUnit));
		url += '&serviceId=' + encodeURIComponent(shr.getUrlRequestParam("serviceId"));
		$("#iframe1").attr("src", url);
		$("#iframe1").dialog({
			modal: true,
			width: 1100,
			minWidth: 800,
			height: 300,
			minHeight: 300,
			title: $.attendmanageI18n.workShiftStrategy.title2,
			open: function(event, ui) {},
			close: function(){
				_afterSelectCopySoure(personNums,hrOrgUnit);
			}
		});
		$("#iframe1").attr("style", "width:1000px;height:500px;");
		$("#iframe1").attr("scrolling","no");
	}
	

	var _afterSelectCopySoure = function(personNums,hrOrgUnit) {
		var copyParam = atsGlobalDataCarrier.getData("SHIFT_WAY_COPY");
		if(!copyParam) {
			return
		}
		copyParam.personNums = personNums;
		copyParam.hrOrgUnitID = hrOrgUnit.id;
		that.setArrangeShiftWay(copyParam.sourcePersonId ? that.SHIFT_WAY_COPY_SELF : that.SHIFT_WAY_COPY_SPECIFIC);
		atsCommonUtile.httpRequest({
			data : copyParam,
			url: _baseArrangeUrl + "arrangeShiftByCopy",
			success : function(data) {
				_addKeyToDataAccordingPeronNum(data);
				_rerenderShiftView(data);
			}
		});
	}

	var _arrangeByshift = function(personNums,hrOrgUnit) {
		var serviceId = shr.getUrlRequestParam("serviceId");
		var url = shr.getContextPath() + '/dynamic.do?method=initalize&flag=turnShift&serviceId=';
		url += encodeURIComponent(serviceId);
		url += '&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list&hrOrgUnitObj=';
		url += encodeURIComponent(JSON.stringify(hrOrgUnit));
		$("#iframe1").attr("src", url);
		$("#iframe1").dialog({
			modal: false,
			title: $.attendmanageI18n.workShiftStrategy.title3,
			width: 1035,
			minWidth: 1035,
			height: 505,
			minHeight: 505,
			open: function(event, ui) {},
			close: function() {
				var title = $("#iframe1").attr('title');
				if(title) {
					$("#iframe1").removeAttr("title");
					_rerenderShiftView(title);
					return;
				} 
				that.getArrangeManager().resetSelectStatus();
				_afterArrangeShift();
			}
		});
		$("#iframe1").attr("style", "width:1035px;height:505px;");
	}
	
	that.save = function(){
		var schedules;
		that.setArrangeShiftWay(that.SHIFT_TYPE_SAVE);
		var arrangeType = that.getArrangeShiftType();
		if(arrangeType == that.SHIFT_TYPE_CALENDAR){
			schedules = calandarWorkShift.getDateData().filter(function(shift){
				return !shift.hasSaved && undefined !== shift.dayType && null != shift.dayType;
			}).map(function(shift){
				return {
					dayType : shift.dayType,
					attendDate : atsCommonUtile.formateDate(shift.start),
					segment : shift.segment,
					turnShiftId : shift.turnShiftId,
					shiftName : shift.shiftName
				}
			});
		}else if(arrangeType === that.SHIFT_TYPE_LIST ||
			arrangeType === that.SHIFT_TYPE_VER_SHIFT ||
			arrangeType === that.SHIFT_TYPE_NOSHIFT){
			var allShift = listWorkShift.getListData();
			var shift;
			var personShift;
			for(var shiftKey in allShift){
				if(allShift[shiftKey]){
					personShift = undefined;
					for(var attendDate in allShift[shiftKey]){
						shift = allShift[shiftKey][attendDate];
						if(shift && undefined !== shift.dayType && null != shift.dayType && !shift.hasSaved){
							personShift || (personShift = []);
							personShift.push(
								{
									attendDate : attendDate,
									dayType : shift.dayType,
									turnShiftId : shift.turnShiftId,
									segment : shift.segment,
									shiftName : shift.shiftName
								});
						}
					}
					personShift && !schedules && (schedules = {});
					// 横向排班列表的时候 结构就: 人员编码@_@xxId@_@xxId@_@xxId 所以取第一个就好了
					personShift && (schedules[shiftKey.split("@_@")[0]] = personShift);
				}
			}
		}
		if(!schedules || schedules.length == 0){
			atsCommonUtile.showWarning($.attendmanageI18n.workShiftStrategy.msg6);
			return;
		}
		_saveShiftData(schedules);
	}
	
	var _saveShiftData = function(shiftData) {
		var url = _baseArrangeUrl + "saveArrangeShiftResult";
		var sendDatas = {schedules: shr.toJSON(shiftData)};
		var shiftType = that.getArrangeShiftType();
		shiftType === that.SHIFT_TYPE_CALENDAR && (sendDatas.calendarPersonNums = shr.toJSON(that.getSelectedStaffNum()));
		var hrOrgUnitId = that.getHrOrgUnit();
		//如果有多个hr业务组织，说明是未完善排班列表的保存
		if(hrOrgUnitId.length > 1 &&
			(shiftType === that.SHIFT_TYPE_NOSHIFT || shiftType === that.SHIFT_TYPE_VER_SHIFT)){
			sendDatas.hrOrgUnitPersonNums = that.getHrOrgUnitPersonNums(shiftData)
		}else {
			sendDatas.hrOrgUnitId = hrOrgUnitId[0].id;
		}
		openLoader(1,$.attendmanageI18n.workShiftStrategy.msg9);
		atsCommonUtile.httpRequest({
			url: url,
			dataType: 'json',
			type: "POST",
			data: sendDatas,
			beforeSend: function() {
				openLoader(1, $.attendmanageI18n.workShiftStrategy.msg9);
			},
			cache: false,
			success: function(data) {
				atsCommonUtile.showInfo($.attendmanageI18n.workShiftStrategy.msg7);
				if(data && data.errorMsg){
					atsCommonUtile.showWarning(data.errorMsg);
				}
			},
			error: function(data) {
				atsCommonUtile.showError(data);
				console.error(shr.formatMsg($.attendmanageI18n.workShiftStrategy.msg8, [that.getArrangeShiftType(), that.getArrangeShiftWay()]));
				console.error(data);
			},
			complete: function() {
				closeLoader();
				_afterSaveShiftData();
			}
		});
		_shifChanged = false;
	}

	var _rerenderShiftView = function(shiftData) {
		that.getArrangeManager().updateShiftData(shiftData);
		_afterArrangeShift();
	}
	
	var _afterArrangeShift = function(){
		if(that.getArrangeShiftType() != that.SHIFT_TYPE_CALENDAR){
			$(listWorkShift.getTableSelector()).jqGrid('resetSelection')
		}
	}

	that.changeShiftResultsToObj = function(shiftResults) {
		if(that.getArrangeShiftWay() == that.SHIFT_WAY_COPY_SELF) {
			shiftResults.forEach(function(personShift, index, arr) {
				arr[index] = atsArrayUtile.toObj(arr[index], "start", "title");
			})
			return atsArrayUtile.toObj(shiftResults, "personNum");
		}
		return atsArrayUtile.toObj(shiftResults, "start", "title");
	}

	that.getFetchShiftDataUrl = function() {
		//var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ListShiftHandler&method=getPersonShiftNew";
		var url = _baseArrangeUrl + "getScheduleShiftList";
		url += "&beginDate=" + encodeURIComponent(that.getBeginDate());
		url += "&endDate=" + encodeURIComponent(that.getEndDate());
		return url;
	}

	that.resetSaveStatus = function() {
		that.getArrangeManager().resetSaveStatus();
	}
	that.getHrOrgUnit = function(){
		var hrOrgs = [];
		var arrangeShiftType = that.getArrangeShiftType();
		if(arrangeShiftType === that.SHIFT_TYPE_NOSHIFT || arrangeShiftType === that.SHIFT_TYPE_VER_SHIFT){
			hrOrgs =  _getSelectedHrOrg();
		}else{
			hrOrgs.push($("#hrOrgUnit").shrPromptBox('getValue'));
		}
		return atsArrayUtile.deleteRepeatAndNull(hrOrgs,"id");
	}
	
	var _getSelectedHrOrg = function(){
		var hrOrgs = [];
		$("#dataGrid tr[aria-selected=true]").each(function(){
			hrOrgs.push(_getHrOrgFromRow(this));
		});
		if(hrOrgs.length > 0){
			return hrOrgs;
		}
		var selector = that.getArrangeShiftWay() == that.SHIFT_TYPE_SAVE ? that.CLASS_ARRANGE : that.CLASS_SELECTED;
		$("#dataGrid tr").each(function(){
			if($(this).find("." + selector).length > 0){
				hrOrgs.push(_getHrOrgFromRow(this));
			}
		})
		return hrOrgs;
	}
	
	var _getHrOrgFromRow = function(rowSelector){
		var hrOrgId;
		var hrOrgName;
		hrOrgId = $(rowSelector).children("[aria-describedby=dataGrid_hrOrgUnit_id]");
		hrOrgId.length > 0 || (hrOrgId = $(rowSelector).children("[aria-describedby=dataGrid_hrOrgUnitId]"));
		hrOrgName = $(rowSelector).children("[aria-describedby=dataGrid_hrOrgUnit_name]")
		hrOrgName.length > 0 || (hrOrgName = $(rowSelector).children("[aria-describedby=dataGrid_adminOrgName]"));
		return {id:hrOrgId.text(),name:hrOrgName.text()};
	}

	
	var _afterSaveShiftData = function(){
		if(that.getArrangeShiftType() == that.SHIFT_TYPE_CALENDAR){
			that.rerenderCalandarWhenOnly();
		}else{
			that.resetSaveStatus();
			listWorkShift.renderListTable();
		}
	}

	that.rerenderCalandarWhenOnly = function() {
		if(that.getSelectedStaffNum().length == 1) {
			calandarWorkShift.fetchCanlendarShiftData(that.getSelectedStaffNum());
		}else{
			calandarWorkShift.clearAllShow();
		}
	}

	that.getBeginDate = function(isDataFormat) {
		var beginDate;
		var arrangeShiftType = that.getArrangeShiftType();
		if(arrangeShiftType === that.SHIFT_TYPE_NOSHIFT || arrangeShiftType === that.SHIFT_TYPE_VER_SHIFT){
			beginDate = $("span[data-id=beginDate_endDate]").data("value").split($.attendmanageI18n.workShiftStrategy.text)[0].trim();
		}else{
			beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		}
		return isDataFormat === true ? atsCommonUtile.getDateObj(beginDate) : beginDate;
	}

	that.getEndDate = function(isDataFormat) {
		var endDate;
		var arrangeShiftType = that.getArrangeShiftType();
		if(arrangeShiftType === that.SHIFT_TYPE_NOSHIFT || arrangeShiftType === that.SHIFT_TYPE_VER_SHIFT){
			endDate = $("span[data-id=beginDate_endDate]").data("value").split($.attendmanageI18n.workShiftStrategy.text)[1].trim();
		}else{
			endDate = atsMlUtile.getFieldOriginalValue("endDate");
		}
		return isDataFormat === true ? atsCommonUtile.getDateObj(endDate) : endDate;
	}
	
	that.getHrOrgUnitPersonNums = function(shiftData){
		var hrOrgUnitPersonNums = {};
		var hrOrg;
		var personNum;
		$("#dataGrid tr:gt(0)").each(function(){
			personNum = $(this).children("[aria-describedby=dataGrid_proposer_number]").text();
			personNum || (personNum = $(this).children("[aria-describedby=dataGrid_personNum]").text());
			if(shiftData[personNum]){
				hrOrg = $(this).children("[aria-describedby=dataGrid_hrOrgUnit_id]").text();
				hrOrg || (hrOrg = $(this).children("[aria-describedby=dataGrid_hrOrgUnitId]").text());
				!hrOrgUnitPersonNums[hrOrg] && (hrOrgUnitPersonNums[hrOrg] = []);
				hrOrgUnitPersonNums[hrOrg].push(personNum);
			}
		});
		return hrOrgUnitPersonNums;
	}

	that.getDataFrom = function() {
		return _currentDataFrom;
	}

	that.setDataFrom = function(dataFrom) {
		_currentDataFrom = dataFrom;
	}
	
	that.getDayType = function(){
		return _dayType;
	}
	
	that.setDayType = function(dayType){
		return _dayType = dayType;
	}

	that.getDayTypeMap = function() {
		return _dayTypeMap;
	}
	
	that.getDayTypeIndex = function(alias){
		return _dayType.indexOf(alias);
	}

	that.getSelectedStaffNum = function() {
		var selectedStaffNum = [];
		$(".field_list").find(".text-tag").each(function(index, value) {
			selectedStaffNum.push(value["id"]);
		});
		return selectedStaffNum;
	}
	
	that.getSelectedPersonNum = function(){
		return that.getArrangeManager().getSelectedPersonNum();
	}

	that.getSelectedKeys = function(){
		return that.getArrangeManager().getSelectedKeys();
	}

	that.getShiftTitle = function(shiftObj){
		if(undefined == shiftObj.dayType || null == shiftObj.dayType || !that.getDayType()[shiftObj.dayType]){
			return "";
		}
		var title = "[" + that.getDayType()[shiftObj.dayType] + "]";
		return shiftObj.shiftName ? title + shiftObj.shiftName : title;
	}
	
	that.getShiftName = function(shiftName,showLen){
		var shiftLen = showLen || 14;
		if(!shiftName){
			return "";
		}
		return shiftName.length < shiftLen ? shiftName : shiftName.substr(0,shiftLen - 1) + "...";
	}

	that.resetCellColor = function(selector, shiftObj) {
		var ele = $(selector);
		shiftObj && !shiftObj.hasSaved ? ele.addClass(that.CLASS_ARRANGE) : ele.removeClass(that.CLASS_ARRANGE);
		shiftObj && shiftObj.dayType == this.getDayTypeMap().restDay ? ele.addClass(that.CLASS_REST) : ele.removeClass(that.CLASS_REST);
		shiftObj && shiftObj.dayType == this.getDayTypeMap().legalHoliday ? ele.addClass(that.CLASS_HOLIDAY) : ele.removeClass(that.CLASS_HOLIDAY);
		shiftObj && shiftObj.shiftName == jsBizMultLan.atsManager_workShiftStrategy_26522369_i18n_0 ? ele.addClass(that.CLASS_FORBIDDEN_GRAY) : ele.removeClass(that.CLASS_FORBIDDEN_GRAY);
	}

	that.getArrangeManager = function(){
		return that.getArrangeShiftType() == that.SHIFT_TYPE_CALENDAR ? calandarWorkShift : listWorkShift;
	}
	
	that.resolvServerShiftData = function(shiftData){
		if(!shiftData || !atsArrayUtile.isArray(shiftData)){
			return shiftData;
		}
		var scheduleData;
		for(var person in shiftData){
			scheduleData = shiftData[person].scheduleData;
			if(scheduleData && atsArrayUtile.isArray(scheduleData)){
				shiftData[person].scheduleData = atsArrayUtile.toObj(scheduleData,"attendDate");
			}
		}
		return shiftData;
	}
	
	var _getUpdateDetailColModel = function(){
		var colModel = [{
			label:$.attendmanageI18n.workShiftStrategy.label1,
			name:"personName",
			width:86
		},{
			label:$.attendmanageI18n.workShiftStrategy.label2,
			name:"attendDate",
			width:70
		},{
			label:$.attendmanageI18n.workShiftStrategy.label3,
			name:"errorMsg",
			width:280
		}];
		colModel.forEach(function(col){
			$.extend(col ,{
				align:"left",
				frozen:false,
				hidden:false,
				key:false,
				isBatchTipsColumn: true,
				resizable:true
			});
		})
		return colModel;
	}
}
var workShiftStrategy = new WorkShiftStrategy();