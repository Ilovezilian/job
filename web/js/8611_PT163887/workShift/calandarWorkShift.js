function CalandarWorkShift() {
	var that = this;
	that.name = "calandarWorkShift";

	var _isOnlyShowCurrentMonth = false;
	var DAY_NAMES_SHORT = [$.attendmanageI18n.calandarWorkShift.weekday1, 
	                       $.attendmanageI18n.calandarWorkShift.weekday2, 
	                       $.attendmanageI18n.calandarWorkShift.weekday3, 
	                       $.attendmanageI18n.calandarWorkShift.weekday4, 
	                       $.attendmanageI18n.calandarWorkShift.weekday5, 
	                       $.attendmanageI18n.calandarWorkShift.weekday6, 
	                       $.attendmanageI18n.calandarWorkShift.weekday7];
	var MONTH_NAMES_SHORT = [$.attendmanageI18n.calandarWorkShift.month1, 
	                         $.attendmanageI18n.calandarWorkShift.month2, 
	                         $.attendmanageI18n.calandarWorkShift.month3, 
	                         $.attendmanageI18n.calandarWorkShift.month4, 
	                         $.attendmanageI18n.calandarWorkShift.month5, 
	                         $.attendmanageI18n.calandarWorkShift.month6, 
	                         $.attendmanageI18n.calandarWorkShift.month7, 
	                         $.attendmanageI18n.calandarWorkShift.month8, 
	                         $.attendmanageI18n.calandarWorkShift.month9, 
	                         $.attendmanageI18n.calandarWorkShift.month10, 
	                         $.attendmanageI18n.calandarWorkShift.month11, 
	                         $.attendmanageI18n.calandarWorkShift.month12];
	var _dateData = [];
	var _calandarElementId = "#calendar_info";
	var _eventSelector = _calandarElementId + " .fc-event-container div";

	that.initCalandar = function(initClandarDatas) {
		$(_calandarElementId).empty();
		$(_calandarElementId).fullCalendar({
			header: {
				left: '',
				center: '',
				right: ''
			},
			year: that.getCalandarYear(),
			month: that.getCalandarMonth(),
			dayNamesShort: DAY_NAMES_SHORT,
			monthNamesShort: MONTH_NAMES_SHORT,
			monthNames: MONTH_NAMES_SHORT,
			editable: true,
			aspectRatio: 1.35,
			disableDragging: true,
			events: (initClandarDatas || _dateData.length == 0) ? _initClandarData() : _dateData,
			eventAfterAllRender: _eventAfterAllRender,
			eventRender: function(event, element) {},
			eventClick: function(event, e) {},
			dayClick: function(date, allDay, jsEvent, view) {}
		});
		_initMouseEvent();

	}

	var _initMouseEvent = function() {
		$('#monthSelector').find('i').unbind().click(function(e) {
			var changedDate;
			var curentCalandarDate = new Date(that.getCalandarYear(), that.getCalandarMonth(), 1);
			var beginDate = workShiftStrategy.getBeginDate(true);
			var endDate = workShiftStrategy.getEndDate(true);
			if($(e.target).hasClass('icon-caret-left')) {
				changedDate = atsCommonUtile.getNextMonthEndDate(curentCalandarDate, -1, true);
			} else if($(e.target).hasClass('icon-caret-right')) {
				changedDate = atsCommonUtile.getNextMonthstartDate(curentCalandarDate, 1, true);
			}
			if(changedDate && atsCommonUtile.compareDate(beginDate, changedDate) <= 0 && atsCommonUtile.compareDate(endDate, changedDate) >= 0) {
				$('#monthInfo').html(atsCommonUtile.formateNum(changedDate.getMonth() + 1));
				$('#yearInfo').html(changedDate.getFullYear() 
						+ $.attendmanageI18n.calandarWorkShift.year);
				that.initCalandar();
			}
		});
		$(_calandarElementId + ' table tr:gt(1)').mousedown(function() {
			var beginDate = workShiftStrategy.getBeginDate(true);
			var endDate = that.getIsOnlyShowCurrentMonth() ? atsCommonUtile.getNextMonthEndDate(beginDate, 0, true) : parent.workShiftStrategy.getEndDate(true);
			$(_calandarElementId + ' table tr:gt(1) td').mouseup(function(e) {
				var cellDate = that.getCellDate(e.currentTarget);
				if(atsCommonUtile.compareDate(cellDate, beginDate) >= 0 && atsCommonUtile.compareDate(cellDate, endDate) <= 0) {
					$(this).addClass('cell-select-color');
					workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_SCHEDULE);
					workShiftStrategy.arrangeWorkShift();
				}
			});

			$(_calandarElementId + ' table tr:gt(1) td').mousemove(function(e) {
				var cellDate = that.getCellDate(e.currentTarget);
				if(atsCommonUtile.compareDate(cellDate, beginDate) >= 0 && atsCommonUtile.compareDate(cellDate, endDate) <= 0) {
					$(this).addClass('cell-select-color');
				}
			});
			//对document进行mouseup事件的监听,当鼠标松开的时候，取消td的移动事件， 同时保留td:gt(2)的鼠标松开事件
			$(document).mouseup(function() {
				$(_calandarElementId + " table td").unbind('mousemove');
			});
		});
	}

	var _eventAfterAllRender = function(view) {
		var beginDate = workShiftStrategy.getBeginDate(true);
		var endDate = workShiftStrategy.getEndDate(true);
		var compareStartDate = beginDate;
		var compareEndDate = endDate;
		if(that.getIsOnlyShowCurrentMonth()) {
			var selectMonthStartDate = new Date(that.getCalandarYear(), that.getCalandarMonth(), 1);
			var selectMontEndDate = atsCommonUtile.getNextMonthEndDate(selectMonthStartDate, 0, true);
			compareStartDate = atsCommonUtile.compareDate(beginDate, selectMonthStartDate) > 0 ? beginDate : selectMonthStartDate;
			compareEndDate = atsCommonUtile.compareDate(endDate, selectMontEndDate) > 0 ? selectMontEndDate : endDate;
		}
		var dataContent;
		var shiftObj;
		var dateData = atsArrayUtile.toObj(that.getDateData(),function(value,returnObj){
			returnObj[atsCommonUtile.formateDate(value.start)] = value;
		});
		$(".fc-event").html("");
		view.element.find("td").each(function(index, ele) {
			var dateStr = $(ele).attr("data-date");
			shiftObj = dateData[dateStr];
			if(dateStr && shiftObj) {
				if(atsCommonUtile.compareDate(dateStr, compareStartDate) >= 0 && atsCommonUtile.compareDate(dateStr, compareEndDate) <= 0) {
					$(ele).children().find(".fc-day-number").css("opacity", 0.7);
					dataContent = $(ele).children().find(".fc-day-content>div");
					var normalWidth = dataContent.width() + 'px';
					dataContent.attr("title", workShiftStrategy.getShiftTitle(shiftObj));
					dataContent.html(workShiftStrategy.getShiftName(shiftObj.shiftName));
					workShiftStrategy.resetCellColor(ele, shiftObj);
					dataContent.css({
						"width":normalWidth,
						"overflow":"hidden",
						"white-space":"nowrap",
						"text-overflow":"ellipsis",
						"-o-text-overflow":"ellipsis",
						"-moz-text-overflow": "ellipsis",
						"-webkit-text-overflow": "ellipsis",
					});
				}
			}
		});
	}


	that.updateShiftData = function(shiftResults) {
		var shiftResut = {};
		if(typeof shiftResults == "string") { //班次排班来源
			var shiftObj = {
				shiftName: shiftResults.substr(shiftResults.indexOf("]") + 1),
				dayType: shiftResults.substr(1, shiftResults.indexOf("]") - 1),
			};
			that.getSelectDates().forEach(function(dateString) {
				shiftResut[dateString] = shiftObj;
			});
		} else if(atsArrayUtile.isArray(shiftResults)) { //获取到的已排班的数据
			shiftResut = atsArrayUtile.toObj(shiftResults[0].scheduleData, "attendDate");
		} else {
			atsCommonUtile.showError($.attendmanageI18n.calandarWorkShift.msg1 + shiftResults);
			return;
		}
		var dateData = that.getDateData();
		var timeStr;
		var shiftObj;
		for(var j = 0; j < dateData.length; j++) {
			timeStr = atsCommonUtile.formateDate(dateData[j]["start"]);
			if(shiftResut[timeStr]) {
				delete dateData[j].turnShiftId;
				delete dateData[j].segment;
				$.extend(true, dateData[j], shiftResut[timeStr]);
				dateData[j].hasSaved = workShiftStrategy.getDataFrom() == workShiftStrategy.DATA_FROM_SCHEDULELIST;
			}
		}
		that.initCalandar();
	}

	that.resetSaveStatus = function() {
		that.getDateData().forEach(function(value) {
			if(typeof value == "object") {
				value.hasSaved = false;
			}
		})
	}
	
	that.clearAllShow = function(){
		$(_calandarElementId).find("td .fc-day-content>div").each(function(){
			$(this).attr("title","");
			$(this).html("");
		});
		$("#calendar_info").find("td.list-Green-color,td.list-pink-color").removeClass("list-Green-color list-pink-color");
	}
	
	that.getSelectedPersonNum = function() {
		var selecte = $("#personInfo").find(".text-tag").eq(0).attr("id");
		return selecte ? [selecte] :[];
	}

	/**
	 *  得到选择的日期值
	 */
	that.getSelectDates = function() {
		$(_calandarElementId + " table td").unbind('mousemove');
		var selectCellColor = [];
		$(_calandarElementId + " table td").each(function() {
			if($(this).hasClass("cell-select-color")) {
				selectCellColor.push(atsCommonUtile.formateDate(that.getCellDate(this)));
			}
		})
		return selectCellColor;
	}

	that.getSelectedKeys = function(){
		return [];
	}

	that.resetSelectStatus = function() {
		$(_calandarElementId + " table td").each(function() {
			$(this).removeClass("cell-select-color")
		})
	}

	that.getIsOnlyShowCurrentMonth = function() {
		return _isOnlyShowCurrentMonth;
	}

	that.getCellDate = function(cellSelector) {
		var dateValue = $(cellSelector).attr('data-date');
		return atsCommonUtile.getDateObj(dateValue);
	}

	that.getDateData = function() {
		return _dateData;
	}

	that.getCalandarYear = function() {
		return $('#yearInfo').html().substr(0, 4);
	}

	that.getCalandarMonth = function() {
		return $('#monthInfo').html() - 1;
	}

	that.fetchCanlendarShiftData = function(personNums) {
		atsCommonUtile.httpRequest({
			url: workShiftStrategy.getFetchShiftDataUrl(),
			data: {
				"personNums": personNums,
				rows: 20,
				page: 1
			},
			async: false,
			beforeSend: function() {
				openLoader(1, $.attendmanageI18n.calandarWorkShift.msg2);
			},
			//result.rows = [{personName:"",personNum:"",scheduleData:[segment:"",turnshiftId:"",shiftName:"",dayType:""]}];
			success: function(result) {
				workShiftStrategy.setDataFrom(workShiftStrategy.DATA_FROM_SCHEDULELIST);
				if(atsArrayUtile.isArray(result) && result.length > 0) {
					setTimeout(function() {
						that.updateShiftData(result);
					}, 50);
				}
			},
			error: closeLoader,
			complete: closeLoader
		})
	}

	var _initClandarData = function(beginDate, endDate) {
		var beginDate = workShiftStrategy.getBeginDate(true);
		var endDate = workShiftStrategy.getEndDate(true);
		_dateData = [];
		var tempDate;
		while(beginDate.getTime() <= endDate.getTime()) {
			tempDate = atsCommonUtile.formateDate(beginDate);
			_dateData.push({
				start: tempDate,
				end: tempDate,
				dayType: "",
				shiftName:"",
				hasSaved:true
			});
			beginDate.setDate(beginDate.getDate() + 1);
		}
		return _dateData;
	}
}

var calandarWorkShift = new CalandarWorkShift();