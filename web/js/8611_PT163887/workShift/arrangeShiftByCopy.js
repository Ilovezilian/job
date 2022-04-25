getTop().registCompoment(window);
shr.defineClass("shr.ats.arrangeByCopyWorkShift", shr.framework.Core, {
	hrOrgUnit:null,
	initalizeDOM: function() {
		var that = this;
		shr.ats.arrangeByCopyWorkShift.superClass.initalizeDOM.call(this);
		$("#person").attr("placeholder", jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_14);
		that.hrOrgUnit = shr.getUrlRequestParam("hrOrgUnitObj");
		that.hrOrgUnit && (that.hrOrgUnit = JSON.parse(that.hrOrgUnit).id);
		var beginDateOfSource = atsCommonUtile.getNextMonthstartDate(null, -1);
		var endDateOfSource = atsCommonUtile.getNextMonthEndDate(null, -1);
		that.hrOrgUnit && $("#person").shrPromptBox().attr("data-params",that.hrOrgUnit);
		atsMlUtile.setTransDateValue('beginDateOfSource', beginDateOfSource,false)
		atsMlUtile.setTransDateValue('endDateOfSource', endDateOfSource,false)
		atsMlUtile.setTransDateValue('beginDateOfTarget', shr.getUrlRequestParam("originBeginDate"),false)
		atsMlUtile.setTransDateValue('endDateOfTarget', shr.getUrlRequestParam("originEndDate"),false)
		$('#holidayWithWorkDayShift').shrCheckbox('check');
		$('#holidayWithWorkDayUnshift').shrCheckbox('check');
		$('#holidayWithRestDayShift').shrCheckbox('check');
		$('#holidayWithRestDayUnshift').shrCheckbox('check');
		that.initEvent(that);
		that.initShowDateInterval();
		that.initHolidayProcessSelect();
		that.iniStyle();
	},
	initEvent: function(that) {
		var that = this;
		$("#beginDateOfSource").change(that.setDateIntever);
		$("#endDateOfSource").change(that.setDateIntever);
		$("#beginDateOfTarget").change(that.setDateIntever);
		$("#endDateOfTarget").change(that.setDateIntever);
		$("#person").on("focus",function(){
			$(this).blur();
		});
		$("#person").shrPromptBox("option", {
			onchange : function(e, value) {
				var hrOrgUnit = value.current["hrOrgUnit.id"];
				$("#person_el").before('<input type="hidden" id="selectedHrOrg_el" value="' + hrOrgUnit + '">');
				if(that.hrOrgUnit !== hrOrgUnit){
					atsCommonUtile.showError(jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_12);
				}
			}
		});
		var tips = [
		  jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_0 
		  + '</br>',
		  jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_1 
		  + '</br>',
		  jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_2 
		  + '</br>',
		  jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_3 
		  + '</br>',
		  jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_4 
		  + '</br>',
		  jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_5
		].join("");
		atsCommonUtile.createTips($("#targetPerson h5"),tips);
	},
	initHolidayProcessSelect: function() {
		var selectHtml = ['<div class="row-fluid row-block hollyDayArea" id=""><div id="" class="span12 offset0 "><div id="holidayHandle" class="marginTop10">'];
		selectHtml.push('<div class="row-fluid row-block"><div class="row-fluid row-block " id=""><div data-ctrlrole="labelContainer">');
		selectHtml.push('<div class="col-lg-24"><div class="field_label" title="'
				+ jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_7 
				+ '">' 
				+ jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_7 
				+ '</div></div><div class="col-lg-6 field-ctrl" style="width: 273px;margin-left: 6px;">');
		selectHtml.push('<input  id="holidayProcess" name="holidayProcess">');
		selectHtml.push('</div><div class="col-lg-2 field-desc"></div></div></div></div></div></div></div>');
		$("#workShiftTarget").parent().parent().after(selectHtml.join(""));
		atsCommonUtile.createHolidayHandleSelect($('#holidayProcess'));
		$("#btnGroup").css({"margin-top":"70px","margin-right":"50px"})
	},
	initShowDateInterval: function() {
		["workShiftSource", "workShiftTarget"].forEach(function(id) {
			$("#" + id + ">div>div").append("<div style='margin-top: 45px;'><span>" 
					+ jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_13 
					+ "&nbsp;&nbsp;</span><span class='dateInterval'></span></div>")
		});
		this.setDateIntever();
	},
	setDateIntever: function() {
		var beginDateOfSource = atsMlUtile.getFieldOriginalValue('beginDateOfSource');
		var endDateOfSource = atsMlUtile.getFieldOriginalValue('endDateOfSource');
		var sourceNum = Math.ceil(atsCommonUtile.compareDate(endDateOfSource, beginDateOfSource) / atsCommonUtile.DAY_LONG) + 1;
		$("#workShiftSource").find(".dateInterval").text(sourceNum);
		var beginDateOfTarget = atsMlUtile.getFieldOriginalValue('beginDateOfTarget');
		var endDateOfTarget = atsMlUtile.getFieldOriginalValue('endDateOfTarget');
		var targetNum = Math.ceil(atsCommonUtile.compareDate(endDateOfTarget, beginDateOfTarget) / atsCommonUtile.DAY_LONG) + 1;
		var targetNumCell = $("#workShiftTarget").find(".dateInterval");
		targetNumCell.text(targetNum);
		if(targetNum !== sourceNum){
			targetNumCell.css({"color":"red"});
		}else{
			targetNumCell.css({"color":"black"});
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
			atsCommonUtile.showError(jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_6);
			return;
		}
		var beginDateOfSource = atsMlUtile.getFieldOriginalValue('beginDateOfSource');
		var endDateOfSource = atsMlUtile.getFieldOriginalValue('endDateOfSource');
		var beginDateOfTarget = atsMlUtile.getFieldOriginalValue('beginDateOfTarget');
		var endDateOfTarget = atsMlUtile.getFieldOriginalValue('endDateOfTarget');
		if(!atsCommonUtile.validateDateByConfig(beginDateOfSource, endDateOfSource, {
				smallName: jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_9,
				bigName: jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_8
			}, true)) {
			return;
		}
		var startRange = shr.getUrlRequestParam("originBeginDate");
		var endRange = shr.getUrlRequestParam("originEndDate");
		if(!atsCommonUtile.validateDateByConfig(beginDateOfTarget, endDateOfTarget, {
				smallName: jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_11,
				bigName: jsBizMultLan.atsManager_arrangeShiftByCopy_i18n_10,
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
	}
});