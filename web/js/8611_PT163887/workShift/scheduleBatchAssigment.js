getTop().registCompoment(window);
shr.defineClass("shr.ats.scheduleBatchAssigment", shr.framework.Core, {
	NAME: "SCHEDULE_BATCH_ASSIGMENT",
	RANGE_SELECT: 1,
	RANGE_CHECKED: 2,
	selectedInfo: null,
	initalizeDOM: function() {
		var that = this;
		shr.ats.scheduleBatchAssigment.superClass.initalizeDOM.call(that);
		$('input[name^=range]').shrRadio();
		$($(".iradio_minimal-grey")).css("float", "left");
		$(".view_manager_header").addClass("disNone");
		$(".view_manager_body").css("margin-top", "-20px");
		$("#setType").css("margin-top","0");
		that.selectedInfo = atsGlobalDataCarrier.getData(that.NAME) || {};
		if(that.selectedInfo.hrOrgObj) {
			that.selectModelChange();
			$("label[for='rangeChecked']").click();
		}
		that.initEvent();
	},
	initEvent: function() {
		var that = this;
		$('input[name^=range]').shrRadio("onChange", function() {
			that.selectModelChange(true)
		});
		$("#defaultShift").shrPromptBox("option", {
			onchange: that.cardRuleRelateShift
		});
		$("#person").shrPromptBox("option", {
			verifyBeforeOpenCallback: that.validateRequired
		});
		$('#hrOrgUnit').shrPromptBox("option", {
			onchange: function(e, value) {
				$("#person").shrPromptBox("setValue", {});
				if(value && value.current) {
					$("#person").shrPromptBox().attr("data-params", value.current.id);
				} else {
					$("#person").shrPromptBox().attr("data-params", "");
				}
			}
		});
		$('#cleanShift').shrCheckbox("onChange", function(e) {
			var cleanShiftIsChecked = $(this).is(":checked") ? "disable" : "enable";;
			$('#defaultShift').shrPromptBox(cleanShiftIsChecked);
	        $('#shiftType').shrPromptBox(cleanShiftIsChecked);
		});
		$('#dayType').bind("change", function() {
			if($('#dayType').shrSelect("getValue").value == 0) {
				$('#cleanShift').shrCheckbox("disable");
				$("#cleanShift").closest(".row-fluid").attr("hidden", true);
			} else {
				$('#cleanShift').shrCheckbox("enable");
				$("#cleanShift").closest(".row-fluid").attr("hidden", false);
			}

		});
		$('#cleanShift').shrCheckbox("disable");
		$("#cleanShift").closest(".row-fluid").attr("hidden", true);
	},
	cardRuleRelateShift: function(e, value) {
		if(value && value.current) {
			var info = value.current;
			var url = shr.getContextPath() + "/dynamic.do";
			url += "?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler";
			url += "&method=getShiftItemInfo";
			$.ajax({
				url: url,
				data: {
					atsShiftId: info.id
				},
				success: function(res) {
					if(res) {
						res = JSON.parse(res);
						$('#cardRule').shrPromptBox("setFilter", "startSegmentNum = " + res.records);
						$('#cardRule_el').val(res.cardRuleId);
						$('#cardRule').val(res.cardRuleName);
					}
				}
			});
		} else {
			$('#cardRule').shrPromptBox("setFilter", "");
		}
	},
	initSelectedInfo: function(isChangOperation) {
		var that = this;
		var selectedInfo = that.selectedInfo;
		if(selectedInfo.hrOrgObj) {
			var hrOrgId = selectedInfo.hrOrgObj.id;
			$("#hrOrgUnit").shrPromptBox("setValue", atsCommonUtile.copy(selectedInfo.hrOrgObj));
			hrOrgId && $("#person").shrPromptBox().attr("data-params", hrOrgId);
			if(selectedInfo.persons) {
				$("#person").shrPromptBox("setValue", atsCommonUtile.copy(selectedInfo.persons));
				var showPersons = selectedInfo.persons.map(function(person) {
					return person.name;
				}).join();
				$("#person").attr("title", showPersons);
			}
		}
		if(!selectedInfo.hrOrgObj && isChangOperation) {
			atsCommonUtile.showWarning(jsBizMultLan.atsManager_scheduleBatchAssigment_i18n_1)
		}
	},
	selectModelChange: function(isChangOperation) {
		var that = this
		var enableState = that.getCurrentRange() != that.RANGE_CHECKED ? "disable" : "enable";
		//$("#person").shrPromptBox("setValue",{});
		$('#hrOrgUnit').shrPromptBox(enableState);
		$('#adminOrgUnit').shrPromptBox(enableState);
		$('#person').shrPromptBox(enableState);
		$('#beginDate').shrDateTimePicker(enableState);
		$('#endDate').shrDateTimePicker(enableState);
		if(enableState === "disable") {
			that.initSelectedInfo(isChangOperation);
		}
	},
	getCurrentRange: function() {
		var radios = $("input[name=range][type=radio]");
		return radios.parent(".checked").next("label").attr("for") == "rangeSelect" ? this.RANGE_SELECT : this.RANGE_CHECKED;
	},
	okBtnAction: function() {
		var that = this;
		var rangeSetting;
		if(that.getCurrentRange() == that.RANGE_SELECT) {
			if(!(rangeSetting = that.getRangeSetting())) {
				return;
			}
		}
		var updateFields;
		if(!(updateFields = that.getUpdateFields())) {
			return;
		}
		atsGlobalDataCarrier.setData(that.NAME, {
			rangeSetting: rangeSetting,
			updateFields: updateFields
		});
		that.closeCurrentFrame();
	},
	getRangeSetting: function() {
		var that = this;
		if(!that.validateRequired()) {
			return;
		}
		var personNums = $("#person").shrPromptBox("getValue");
		return {
			beginDate: atsMlUtile.getFieldOriginalValue("beginDate"),
			endDate: atsMlUtile.getFieldOriginalValue("endDate"),
			hrOrgUnitID: atsCommonUtile.getId($("#hrOrgUnit").shrPromptBox("getValue")),
			adminOrgUnitNum: atsCommonUtile.get($("#adminOrgUnit").shrPromptBox("getValue"), "longNumber"),
			originDayType: atsCommonUtile.get($("#originDayType").shrSelect("getValue"), "value"),
			personNums: personNums && atsArrayUtile.isArray(personNums) ? personNums.map(function(person) {
				return person["person.number"];
			}) : "",
		}
	},
	validateRequired: function() {
		var that = this;
		if(!atsCommonUtile.validateDateByConfig(atsMlUtile.getFieldOriginalValue("beginDate"), atsMlUtile.getFieldOriginalValue("endDate"), null, true)) {
			return false;
		}
		if(!$("#hrOrgUnit_el").val()) {
			atsCommonUtile.showWarning(jsBizMultLan.atsManager_scheduleBatchAssigment_i18n_0);
			return false;
		}
		return true;
	},
	getUpdateFields: function() {
		var updateFields = {
			defaultShiftID: atsCommonUtile.getId($("#defaultShift").shrPromptBox("getValue")),
			shiftTypeID: atsCommonUtile.getId($("#shiftType").shrPromptBox("getValue")),
			cardRuleID: atsCommonUtile.getId($("#cardRule").shrPromptBox("getValue")),
			otCompensID: atsCommonUtile.getId($("#otCompens").shrPromptBox("getValue")),
			adminOrgUnitID: atsCommonUtile.getId($("#adminOrgUnitAssigment").shrPromptBox("getValue")),
			dayType: atsCommonUtile.get($("#dayType").shrSelect("getValue"), "value")
		}
		var needToUpdate = false;
		for(var field in updateFields) {
			updateFields[field] && (needToUpdate = true)
		}
		if(!needToUpdate) {
			atsCommonUtile.showWarning(jsBizMultLan.atsManager_scheduleBatchAssigment_i18n_2);
			return;
		}
		return updateFields;
	},
	cancelBtnAction: function() {
		var that = this;
		atsGlobalDataCarrier.setData(that.NAME, undefined);
		that.closeCurrentFrame();
	},
	closeCurrentFrame: function() {
		atsCommonUtile.closeSelfFrame("#iframe1");
	}
})
