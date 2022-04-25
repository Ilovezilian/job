//getTop().registCompoment(window);
shr.defineClass("shr.ats.atsAttendanceGroupCopy", shr.framework.Core, {
	hrOrgUnit:null,
	initalizeDOM: function() {
		var that = this;
		shr.ats.atsAttendanceGroupCopy.superClass.initalizeDOM.call(this);
		that.hrOrgUnit = shr.getUrlRequestParam("hrOrgUnitObj");
		that.hrOrgUnit && (that.hrOrgUnit = JSON.parse(that.hrOrgUnit).id);
		var beginDateOfSource = atsCommonUtile.getNextMonthstartDate(null, -1);
		var endDateOfSource = atsCommonUtile.getNextMonthEndDate(null, -1);
		that.hrOrgUnit && $("#person").shrPromptBox().attr("data-params",that.hrOrgUnit);
		atsMlUtile.setTransDateValue("beginDateOfSource", beginDateOfSource);
		atsMlUtile.setTransDateValue("endDateOfSource", endDateOfSource);
		if(shr.getUrlRequestParam("originBeginDate") && shr.getUrlRequestParam("originBeginDate") !="null"){
			atsMlUtile.setTransDateValue("beginDateOfTarget", shr.getUrlRequestParam("originBeginDate"));
		}
		if(shr.getUrlRequestParam("originEndDate") && shr.getUrlRequestParam("originBeginDate") !="null"){
			atsMlUtile.setTransDateValue("endDateOfTarget", shr.getUrlRequestParam("originEndDate"));
		}
		$('#holidayWithWorkDayShift').shrCheckbox('check');
		$('#holidayWithWorkDayUnshift').shrCheckbox('check');
		$('#holidayWithRestDayShift').shrCheckbox('check');
		$('#holidayWithRestDayUnshift').shrCheckbox('check');
		that.initEvent(that);
		that.initShowDateInterval();
		that.initHolidayProcessSelect();
		that.iniStyle();
		that.changeOverTimeType();
		that.initFd();
		that.initPersonFy();
		$("#Postpone").closest(".row-fluid.row-block").css("margin-left","16px");
	},changeOverTimeType:function(){
		var that=this;
	   
	    $('#hrOrgUnit').change(function(){ //加班日期
	    	 var hrOrgUnit=$('#hrOrgUnit_el').val();
	    	var data = {
					hrOrgUnitId:hrOrgUnit
		};
		shr.doAjax({
					url: shr.getContextPath()+"/dynamic.do?method=getWorkCalendar&handler=com.kingdee.shr.ats.web.handler.AtsGroupShiftListHandler",
					dataType:'json',
					type: "POST",
					async:false,
					data: data,
					success: function(response){ 
						var rst= response||{};
						$('#workCalendar_el').val(response.workCalendarId);
						$('#workCalendar').val(response.workCalendarName);
						
					}
				});	
			
	    });
	    
		
	},
	initEvent: function(that) {
		var that = this;
		$("#beginDateOfSource").change(that.setDateIntever);
		$("#endDateOfSource").change(that.setDateIntever);
		$("#beginDateOfTarget").change(that.setDateIntever);
		$("#endDateOfTarget").change(that.setDateIntever);
		$("#person").shrPromptBox("option", {
			onchange : function(e, value) {
				var hrOrgUnit = value.current["hrOrgUnit.id"];
				$("#person_el").before('<input type="hidden" id="selectedHrOrg_el" value="' + hrOrgUnit + '">');
				if(that.hrOrgUnit !== hrOrgUnit){
					atsCommonUtile.showError(jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_12);
				}
			}
		});
	},
	initHolidayProcessSelect: function() {
		

	},
	initShowDateInterval: function() {
		["workShiftSource", "workShiftTarget"].forEach(function(id) {
			$("#" + id + ">div>div").append("<div style='float:right;margin-top:45px'><span>" +
				jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_15 +
				":&nbsp;&nbsp;</span><span class='dateInterval'></span></div>")
		});
		this.setDateIntever();
	},

	setDateIntever: function() {
		 function setBeginEndDateInterval(beginDateElementId, endDateElementId, id) {
			var beginDate = atsMlUtile.getFieldOriginalValue(beginDateElementId);
			var endDate = atsMlUtile.getFieldOriginalValue(endDateElementId);
			var dateInterval = 0;
			if (beginDate != "" && endDate != "") {
				dateInterval = Math.ceil(atsCommonUtile.compareDate(endDate, beginDate) / atsCommonUtile.DAY_LONG) + 1;
			}
			$("#" + id).find(".dateInterval").text(dateInterval);
			return dateInterval;
		}
		var sourceInterval = setBeginEndDateInterval("beginDateOfSource", "endDateOfSource", "workShiftSource");
		var targetInterval = setBeginEndDateInterval("beginDateOfTarget", "endDateOfTarget", "workShiftTarget");
		var targetNum = $("#workShiftTarget").find(".dateInterval");
		if(sourceInterval != targetInterval) {
			targetNum.css({"color":"red"});
		} else {
			targetNum.css({"color":"black"});
		}
	},
	iniStyle: function() {
		$(".view_manager_header").addClass("disNone");
		$(".view_core").css("margin-top","-20px");
		$("#config .field_label").parent().attr("class", "col-lg-20");
		$("#config .field_label").css({
			"text-align": "left",
			"padding-left": "30px",
			"padding-right": "0px"
		});
		$("#config .field-desc").attr("class", "col-lg-1");
		$("#config .field-ctrl").attr("class", "field-ctrl col-lg-3");
		$("#config .labelContainer").append($("#config .field-ctrl"));
		$("#config .field-ctrl>div").css({
			"float": "right",
			"margin-top": "3px"
		});
		$("#config .field-ctrl").each(function() {
			$(this).prependTo($(this).parent());
		});
	},
	okBtnAction: function() {
		var that = this;
		if($("#selectedHrOrg_el").length > 0 && that.hrOrgUnit != $("#selectedHrOrg_el").val()){
			atsCommonUtile.showError(jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_7);
			return;
		}
		var beginDateOfSource = atsMlUtile.getFieldOriginalValue("beginDateOfSource");
		var endDateOfSource = atsMlUtile.getFieldOriginalValue("endDateOfSource");
		var beginDateOfTarget = atsMlUtile.getFieldOriginalValue("beginDateOfTarget");
		var endDateOfTarget = atsMlUtile.getFieldOriginalValue("endDateOfTarget");

		if(!atsCommonUtile.validateDateByConfig(beginDateOfSource, endDateOfSource, {
				smallName: jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_9,
				bigName: jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_8
			}, true)) {
			return;
		}
		var startRange = shr.getUrlRequestParam("originBeginDate");
		var endRange = shr.getUrlRequestParam("originEndDate");
		if(!atsCommonUtile.validateDateByConfig(beginDateOfTarget, endDateOfTarget, {
				smallName: jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_11,
				bigName: jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_10,
				startRange: startRange,
				endRange: endRange
			}, true)) {
			return;
		}
		atsGlobalDataCarrier.setData("SHIFT_WAY_COPY", {
			sourcePersonId: $("#person_el").val().trim(),
			beginDateOfSource: beginDateOfSource,
			endDateOfSource: endDateOfSource,
			beginDateOfTarget: beginDateOfTarget,
			endDateOfTarget: endDateOfTarget,
			holidayHandle: $("#holidayHandle_el").val(),
			holidayWithWorkDayShift: $("#holidayWithWorkDayShift").parent().hasClass("checked"),
			holidayWithWorkDayUnshift: $("#holidayWithWorkDayUnshift").parent().hasClass("checked"),
			holidayWithRestDayShift: $("#holidayWithRestDayShift").parent().hasClass("checked"),
			holidayWithRestDayUnshift: $("#holidayWithRestDayUnshift").parent().hasClass("checked")
		});
		this.closeCurrentFrame();
	},
	cancelBtnAction: function() {
		atsGlobalDataCarrier.setData("SHIFT_WAY_COPY", undefined);
		this.closeCurrentFrame();
	},
	closeCurrentFrame: function() {
		atsCommonUtile.closeSelfFrame("#iframe1");
	},initFd:function(){
		var explain = [];
			explain.push('<div id="popTips_1" class="popTips">' 
					+ jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_13 
					+ '</div>');
			explain.push('<div id="popTips_2" class="popTips">' 
					+ jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_14 
					+ '</div>');
			explain.push('<div id="popTips_3" class="popTips">' 
					+ jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_6 
					+ '</div>');
			//获取div的位置
			var targetObj=$("#Postpone");
			var offset = targetObj.offset();
			var targetWidth  = targetObj.width() + 24;
			var downId = '#' + targetObj.attr("id") + '_down';
			$(downId,targetObj.context).css("overflow-y","visible");//样式bug
			$(downId,targetObj.context).append($(explain.join("")));
			$('div[id^="popTips_"]',targetObj.context).css("left", offset.left + targetWidth);
			$(downId + ' li',targetObj.context).hover(function(event) {
				$('div[id="popTips_' + $(this).data("value") + '"]',targetObj.context).show('fast').css("top",$(this).offset().top);
			}, function() {
				$('div[id="popTips_' + $(this).data("value") + '"]',targetObj.context).hide();
			});
	},initPersonFy:function(){
		$("#workShiftSources #personFy").each(function(index,ele){
			(ele).remove();	
		})
		$("#workShiftSources h5").each(function(index,ele){
		$(ele).append('<span id="personFy"><span style="font-size: 12px;font-weight: 500;"  class="more">?<span class="tips">' 
				+ jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_0 
				+ '</br>' 
				+ jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_1 
				+ '</br>' 
				+ jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_2 
				+ '</br>' 
				+ jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_3 
				+ '</br>' 
				+ jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_4 
				+ '</br>' 
				+ jsBizMultLan.atsManager_atsAttendanceGroupCopy_i18n_5 
				+ '</span></span></span>');
			
		})
		$("#personFy .tips").hide();
		$("#personFy .more").each(function(index,ele){
			$(ele).mouseover(function(){
				$("#personFy .tips").eq(index).show()
			})
			$(ele).mouseleave(function(){
				$("#personFy .tips").eq(index).hide()
			})
		})
		
	}
});