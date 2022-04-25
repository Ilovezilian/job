getTop().registCompoment(window);
shr.defineClass("shr.ats.TurnShiftChoose", shr.framework.Core, {
	initalizeDOM: function() {
			var that = this;
			shr.ats.TurnShiftChoose.superClass.initalizeDOM.call(this);
			$('#turnShiftMainInfo').empty();
			$('#breadcrumb').parent().parent().empty();
			var row_fields_work = '' +
				'<div class="row-fluid row-block" id="postponeTurn">' +
				'	<div class="span firstLabel" ><span class="field_label" id="workShiftSources" style="display: inline-block;overflow: inherit;">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_3 + 
				'</span></div>' +
				' <div class="col-lg-14 field-ctrl"><div id="checkCtrl" class="icheckbox_minimal-grey" style="margin-left:20px">' +
				' <input type="checkbox" value="1" checked="" style="position: absolute; top: -20%; left: -20%; display: block; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;">' +
				' <ins class="iCheck-helper" style="position: absolute; top: -20%; left: -20%; display: block; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins>' +
				' </div><span style="display:inline-block;margin:-50px 0 0 10px;top:-5px;position:relative;"></span></div>' +
				'</div>' +
				'<div class="row-fluid row-block">' +
				'	 <div class="span firstLabel" ><span class="field_label">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_10 
				+ '</span></div>' +
				'  <div class="span" ><input name="turnShift" class="input-height cell-input"/></div>' +
				'	 <div class="span" style="margin-left: 7%;"><span class="field_label">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_11 + 
				'</span></div>' +
				'  <div class="span" id="segment">' +
				'   <input style="float:left;width:91%;background-color:#daeef8;" value ="1" readonly="readonly" type="text" name="TextNum" class="input-height cell-input"  validate="{required:true}"/></div>' +
				'</div>' +
				'<div class="row-fluid row-block">' +
				'	 <div class="span firstLabel"><span class="field_label">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_6 + 
				'</span></div>' +
				'  <div class="span"><input id="beginDate" name="beginDate" ctrlType="Date" ctrlrole="datetimepicker" class="input-height cell-input"/></div>' +
				'	 <div class="span" style="margin-left: 7%;"><span class="field_label">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_5 + 
				'</span></div>' +
				'  <div class="span"><input id="endDate" name="endDate" ctrlType="Date" ctrlrole="datetimepicker" class="input-height cell-input"/></div>' +
				'</div>' +
				'<div class="row-fluid row-block">' +
				'	 <div class="span firstLabel"><span class="field_label">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_4 + 
				'</span></div>' +
				'  <div class="span"><input name="holidayHandle" class="input-height cell-input"/></div>' +
				'</div>';
			$('#turnShiftMainInfo').append(row_fields_work);
			that.turnShiftInfo();
			//初始化时,设置行政turnShift传入业务组织hrOrgUnit的值
			if(parent.workShiftStrategy.getArrangeShiftType() == parent.workShiftStrategy.SHIFT_TYPE_CALENDAR) {
				$("#postponeTurn").hide();
			}		
			$('.span').css('width', '22.5%');
			$('.firstLabel').css('width', '13%');
			$('#turnShiftEntryInfo').css("margin-top","-20px");
			$("#turnShiftInfoDetail").find("h5").css({"font-size":"14px","margin-left": "-10px"});
			var hrOrgUnitObj = shr.getUrlRequestParam("hrOrgUnitObj");
			$('#hrOrgUnit_el').val(JSON.parse(hrOrgUnitObj).id); //行政组织Id
			$('#hrOrgUnit').val(JSON.parse(hrOrgUnitObj).name); //行政组织name
			$("#checkCtrl").on("click", function() {
				if($(this).hasClass("checked")) {
					$(this).removeClass("checked");
					$("input[name=TextNum]").css("background-color", "#daeef8");
					$("input[name=TextNum]").attr("disabled", "disabled");
					$('input[name="beginDate"]').shrDateTimePicker("enable");
					$('input[name="turnShift"]').shrPromptBox("enable");
				} else {
					$(this).addClass("checked");
					$("input[name=TextNum]").removeAttr("disabled");
					$("input[name=TextNum]").css("background-color", "rgb(235, 235, 228)");
					$('input[name="beginDate"]').shrDateTimePicker("disable");
					$('input[name="turnShift"]').shrPromptBox("disable");
				}
			})
			that.initPersonFy();
		}

		/*
		 * 当点击【轮班规则新增按钮】时，公共区域才会出现
		 */
		,
	turnShiftInfo: function() {
		var _self = this;
		var hrOrgUnitObj = shr.getUrlRequestParam("hrOrgUnitObj");
		var hrorgunit = JSON.parse(hrOrgUnitObj).id;
		//【轮班规则】组装F7回调式对话框	 
		var grid_f7_json = {
			id: "turnShift",
			name: "turnShift"
		};
		grid_f7_json.subWidgetName = 'shrPromptGrid';

		grid_f7_json.subWidgetOptions = {
			title: jsBizMultLan.atsManager_turnShiftChoose_i18n_10,
			uipk: "com.kingdee.eas.hr.ats.app.AtsTurnShift.AvailableList.F7",
			query: ""
		};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = hrorgunit;
		grid_f7_json.subWidgetOptions.filterConfig = [{
			name: 'isComUse',
			value: true,
			alias: jsBizMultLan.atsManager_turnShiftChoose_i18n_15,
			widgetType: 'checkbox'
		}];
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';

		var object = $('input[name="turnShift"]');
		object.shrPromptBox(grid_f7_json);
		object.shrPromptBox("setBizFilterFieldsValues", hrorgunit);

		//由于在获取F7选择的信息时，要查出对应的班次明细表，所以绑定事件
		object.bind("change", function() {
			var info = object.shrPromptBox('getValue');
			if(info != null && info.id != null && info.id.length > 0) {
				$.ajax({
					url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsTurnShiftEditHandler&method=getItemsJson",
					data: {
						id: info.id
					},
					dataType: 'json',
					type: "POST",
					beforeSend: function() {
						openLoader(1);
					},
					success: function(rst) {
						$('#turnShiftEntryInfo').empty();
						//得到最大的值
						if(rst.records != null && rst.records > 0 && rst.rows != null && rst.rows.length > 0) {
							var defaultShift_number, defaultShift_name, remark, workTime, dateType_key, dateType_value;
							for(var i = 1; i <= rst.rows.length; i++) {
								row = rst.rows[i - 1];
								id = row["id"], defaultShift_id = row["defaultShift_id"], defaultShift_number = row["defaultShift_number"],
									defaultShift_name = row["defaultShift_name"], workTime = row["workTime"],
									dateType_key = row["type.key"], dateType_value = row["type.value"];
								_self.addTurnShiftInfoDetail(i, dateType_key, defaultShift_number, defaultShift_name, workTime);
							}

							$('#segment').empty();
							$('#segment').off();
							//组装NumberSpinner
							var options = {
								maxValue: rst.rows[rst.rows.length - 1].segment,
								minValue: 1,
								defValue: 1,
								txtWidth: 100
							};
							$('#turnShiftEntryInfo').attr("maxSegment", options.maxValue);
							$.fineTuning.addTxt($("#segment"), options);
							$("input[name=TextNum]").css("width", "78%");
						}
					},
					error: function() {
						closeLoader();
					},
					complete: function() {
						closeLoader();
					}

				});
			}
		});

		//【开始日期】	
		$('input[name="beginDate"]').shrDateTimePicker({
			id: "beginDate",
			tagClass: 'block-father input-height',
			readonly: '',
			yearRange: '',
			ctrlType: "Date",
			isAutoTimeZoneTrans:false,
			validate: '{dateISO:true,required:true}'
		});

		//【结束日期】
		$('input[name="endDate"]').shrDateTimePicker({
			id: "endDate",
			tagClass: 'block-father input-height',
			readonly: '',
			yearRange: '',
			ctrlType: "Date",
			isAutoTimeZoneTrans:false,
			validate: '{dateISO:true,required:true}'
		});

		atsCommonUtile.createHolidayHandleSelect($('input[name="holidayHandle"]'));
		var firstBeginDate = $.getUrlParam('firstBeginDate');
		if(firstBeginDate != null && firstBeginDate.length > 0) {
			atsMlUtile.setTransDateValue("beginDate", firstBeginDate);
		}

		var firstEndDate = $.getUrlParam('firstEndDate');
		if(firstEndDate != null && firstEndDate.length > 0) {
		    atsMlUtile.setTransDateValue("endDate", firstEndDate);
		}
	},
	/*
	 * 说明：不管是日历排班还是列表排表都要用到公用的轮班信息
	 */
	addTurnShiftInfoDetail: function(i, dateType_value, defaultShift_number, defaultShift_name, workTime) {
		var row_fields_work = '';
		if(i == 1) {
			row_fields_work = '<div style="padding-top:15px;" class="row-fluid row-block row_field">' +
				'<div class="spanSelf_01"><div class="field_label" title="' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_16 +
				' style="width:40px;">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_16 + 
				'</div></div>' +
				'<div class="spanSelf_02"><div class="field_label" title="' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_13 + 
				'">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_13 + 
				'</div></div>' +
				'<div class="spanSelf_03"><div class="field_label" title="' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_0 + 
				'">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_0 + 
				'</div></div>' +
				'<div class="spanSelf_04"><div class="field_label" title="' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_1 + 
				'">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_1 + 
				'</div></div>' +
				'<div class="spanSelf_05"><div class="field_label" title="'+ 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_14 + 
				'">' + 
				jsBizMultLan.atsManager_turnShiftChoose_i18n_14 + 
				'</div></div>' +
				'</div>';
			$('#turnShiftEntryInfo').append(row_fields_work);
		}
		row_fields_work = '<div class="row-fluid row-block row_field">' +
			'<div class="spanSelf_01"><div class="field_label" style="width:40px;">' + correctValue(i) + '</div></div>'

			+
			'<div class="spanSelf_02"><div class="field_label">' + correctValue(dateType_value) + '</div></div>'

			+
			'<div class="spanSelf_03"><div class="field_label">' + correctValue(defaultShift_number) + '</div></div>'

			+
			'<div class="spanSelf_04"><div class="field_label">' + correctValue(defaultShift_name) + '</div></div>'

			+
			'<div class="spanSelf_05"><div class="field_label">' + correctValue(workTime) + '</div></div>'

			+
			'</div>';
		$('#turnShiftEntryInfo').append(row_fields_work);
	},
	selectOkAction: function() {
		var strBeginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var strEndDate = atsMlUtile.getFieldOriginalValue("endDate");
		var beginDate = atsCommonUtile.getDateObj(strBeginDate);
		var endDate = atsCommonUtile.getDateObj(strEndDate);
		var firstBegin = atsCommonUtile.getDateObj($.getUrlParam('firstBeginDate'));
		var firstEnd = atsCommonUtile.getDateObj($.getUrlParam('firstEndDate'));

		if(!$("#checkCtrl").hasClass("checked")) {
			if($('input[name="turnShift"]').val().length < 1) {
				atsCommonUtile.showWarning(jsBizMultLan.atsManager_turnShiftChoose_i18n_12);
				return;
			}
			if(!atsCommonUtile.validateDateByConfig(strBeginDate, strEndDate, 
					{smallName: jsBizMultLan.atsManager_turnShiftChoose_i18n_6,
					bigName: jsBizMultLan.atsManager_turnShiftChoose_i18n_5,
					interval: "1M",startRange:firstBegin,endRange : firstEnd}, true)) {
				return;
			}
			if(!$('input[name="TextNum"]').val().trim()){
				atsCommonUtile.showWarning( jsBizMultLan.atsManager_turnShiftChoose_i18n_9);
				return;
			}
			
			if(isNaN($('input[name="TextNum"]').val())){
				atsCommonUtile.showWarning( jsBizMultLan.atsManager_turnShiftChoose_i18n_7);
				return;
			}
			if($('input[name="TextNum"]').val().trim() - 0 > $('#turnShiftEntryInfo').attr("maxSegment") - 0) {
				atsCommonUtile.showWarning( jsBizMultLan.atsManager_turnShiftChoose_i18n_8);
				return;
			}
		}
		if(atsCommonUtile.isInvalidateDateByConfig({baseDate : strEndDate,name: jsBizMultLan.atsManager_turnShiftChoose_i18n_5,startRange : firstBegin,endRange : firstEnd}, true)) {
			return;
		}
		atsGlobalDataCarrier.setData("SHIFT_WAY_TURN", {
			beginDate: strBeginDate,
			endDate: strEndDate,
			turnShift: $('#turnShift_el').val(),
			textNum: $('input[name="TextNum"]').val(),
			holidayHandle: $('#holidayHandle_el').val(),
			policyId: sessionStorage.getItem("policyId"),
			isPostponeTurn: $("#checkCtrl").hasClass("checked")
		});
		parent.$('#iframe1').dialog('close');
	},initPersonFy:function(){
		$("#workShiftSources #SmartRulesNavs").each(function(index,ele){
			(ele).remove();	
		})
		$("#workShiftSources").each(function(index,ele){
		$(ele).append('<span id="SmartRulesNavs"><span style="font-size: 12px;font-weight: 500;"  class="more">?<span class="tips">' 
				+ jsBizMultLan.atsManager_turnShiftChoose_i18n_2 
				+ '</span></span></span>');
			
		})
		$("#SmartRulesNavs .tips").hide();
		$("#SmartRulesNavs .more").each(function(index,ele){
			$(ele).mouseover(function(){
				$("#SmartRulesNavs .tips").eq(index).show()
			})
			$(ele).mouseleave(function(){
				$("#SmartRulesNavs .tips").eq(index).hide()
			})
		})
		
	}

});

function correctValue(value) {
	if(value == undefined || value == null) {
		return "";
	} else {
		return value;
	}
}