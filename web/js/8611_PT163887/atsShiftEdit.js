
var norecord = "";
var editLength;
shr.defineClass("shr.ats.AtsShiftEdit", shr.ats.AtsMaintainBasicItemEdit, {
	initalizeDOM: function () {
		shr.ats.AtsShiftEdit.superClass.initalizeDOM.call(this);
		var that = this;

		if (that.getOperateState() == "VIEW") {
			this.initViewWeb();
		} else if (that.getOperateState() == "EDIT") {
			this.initEditWeb();
		} else if (that.getOperateState() == "ADDNEW") {
			this.initAddNewWeb();
		}
		//增加参数说明弹出div
		that.addCaptionDiv();
		$("#info").find('[data-ctrlrole="labelContainer"]').eq(1).css("width","100%");

		that.myExtendValidate();//使用自定义的校验扩展校验
		//that.processApplyOTTime();
		$('#standardHour').attr("validate", "{maxlength:9,required:true,number:true,my24Vldt:true}");

		that.hideDelLink();
		// 初始化分录事件
		that.initItemsEventListener();

	}, initViewWeb: function () {
		if ($("#isElastic").val() == 0) {
			$("#elasticType").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#elasticDirection").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#elasticValue").closest('div[data-ctrlrole="labelContainer"]').hide();
		}

		if ($("#elasticType").val() == 0) {
			$("#elasticDirection").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#elasticValue").closest('div[data-ctrlrole="labelContainer"]').hide();
		}
	}, addWarmPrompt: function () {
		var innertHtml = '<div id="message_head" style="padding:2px;padding-left:58px;">'
			+ '<div id="message_info" style="background-color:#E4E4E4;width:89%;padding:4px;padding-left:24px;">'
			+ '<span id="show_info"><font color="#FF0000">'
			+ jsBizMultLan.atsManager_atsShiftEdit_i18n_37
			+ '</font></span>'
			+ '</div></div>';
		$(innertHtml).insertBefore($(form).find(".row-fluid")[0]);
	}, initEditWeb: function () {
		var that = this;
		that.addWarmPrompt();

		var itemCount = that.validateItems().vo.length;
		var filter = " startSegmentNum = '" + itemCount + "' ";
		$("#cardRule").shrPromptBox("setFilter", filter);
		that.addElasticDoc();//设置弹性班浮动提示
		that.addElasticHtml();
		$("#cardRule").closest(".ui-promptBox-frame").addClass("required valid");
	}, initAddNewWeb: function () {
		var that = this;
		if (shr.getUrlRequestParam("method") != "copy") {
			atsMlUtile.setTransNumValue('standardHour', '0.00');
			that.setCardRule(0);//设置取卡规则
		}
		that.addElasticDoc();//设置弹性班浮动提示
		that.addElasticHtml();
	}, initItemsEventListener: function () {
		var that = this;
		//新增或编辑分录时，不能删除。 新增建addRowAction
		/*$('#addRow_items').click(function(){
		 that.hideAllDelLink();
		});*/
		$('td span[id$="editButton"]').live('click', function () {
			that.hideAllDelLink();
		});
		$('td span[id$="removeButton"]').live('click', function () {

		});

		$('#items_cont').live("change", function () {
			that.setStandardHour();
		});


		document.addEventListener('editComplete_items', function (event) {
			shr.msgHideAll();
			$('#items_editGrid').show();
			var item = $("#items");
			var count = item.getRowCount();

			var item = $("#items");
			var count = item.getRowCount();
			var datas = item.getAllRowData();

			if ((count == 0 || count == 1)) {
				//段内休息-开始时间校验
				$("#restPreTime")
					.attr("placeholder", jsBizMultLan.atsManager_atsShiftEdit_i18n_23);
				$('#restPreTime').attr("validate",
					$('#restPreTime').attr("validate") == null || $('#restPreTime').attr("validate").trim() == ''
						? "myRestTmVldt:true"
						: $('#restPreTime').attr("validate") + ",myRestTmVldt:true");


				//段内休息-结束时间校验
				$("#restNextTime").attr("placeholder", jsBizMultLan.atsManager_atsShiftEdit_i18n_24);
				$('#restNextTime').attr("validate",
					$('#restNextTime').attr("validate") == null || $('#restNextTime').attr("validate").trim() == ''
						? "myRestTmVldt:true"
						: $('#restNextTime').attr("validate") + ",myRestTmVldt:true");

			}

			if (count > 1) {
				that.hideRestTime();
			}

			$('#restPreTime').blur(function () {
				if ($("#restPreTime").val() == '' && $("#restNextTime").val() == '') {
					$('#restPreTime').attr("validate", "myRestTmVldt:false");
					$('#restNextTime').attr("validate", "myRestTmVldt:false");
				}
				that.calSegmentInRestValue(null, null, null, null, null, null);

			});
			$('#restNextTime').blur(function () {
				if ($("#restPreTime").val() == '' && $("#restNextTime").val() == '') {
					$('#restPreTime').attr("validate", "myRestTmVldt:false");
					$('#restNextTime').attr("validate", "myRestTmVldt:false");
				}
				that.calSegmentInRestValue(null, null, null, null, null, null);
			});


			//完成要合法，才能显示最后一条的删除
			$('#items_save').click(function () {
				//debugger;
				that.hideDelLink();//解决问题:在保存班次如果时间超过24小时会再多出个删除按钮
				shr.msgHideAll();
				var rt = that.validateItems();
				if (rt.valid == false) {
					shr.showWarning({ message: rt.info });
					return false;
				} else {//更改标准工时
					var vo = rt.vo;
					var standardHour = 0;
					if (!vo) {
						return standardHour;
					}
					var total2 = 0, time1 = 0, time2 = 0, rest;
					for (var j = 0; j < vo.length; j++) {
						if (vo[j].attendanceTypeVal == 1 || vo[j].attendanceTypeVal == '1 ' || vo[j].attendanceTypeVal == 3 || vo[j].attendanceTypeVal == '3') {
							//正常出勤1  正常出勤不计异常3
							time1 = new Number(vo[j].pre.substring(0, 2)) * 60 + new Number(vo[j].pre.substring(3, 5));
							time2 = new Number(vo[j].next.substring(0, 2)) * 60 + new Number(vo[j].next.substring(3, 5));
							rest = new Number(vo[j].rest);

							time1 = getRealTimeByType(time1, vo[j].preDayType);
							time2 = getRealTimeByType(time2, vo[j].nextDayType);

							total2 += (time2 - time1) - rest;
						}
					}
					standardHour = (new Number(total2) / 60).toFixed(2);
					atsMlUtile.setTransNumValue('standardHour',standardHour);
					//编辑完分录后 改变 取卡规则中的过滤 
					that.setCardRule(vo.length);
					var workArea = that.getWorkarea();
					$form = $('form', workArea);
					var flag = $form.valid();
					if (flag) {
						that.hideDelLink();
					}
				}

				var countt = $("#items").getRowCount();
				if (countt > 1) {
					var records = $('#items tr.jqgrow');
					var restpretime = $('td[aria-describedby="items_restPreTime"]', records[0]).text('');
					var restnexttime = $('td[aria-describedby="items_restNextTime"]', records[0]).text('');
				}

			});

			$('#items_cancel').click(function () {
				that.hideDelLinks();
			});

			var self2 = $('#segment');
			self2.attr("disabled", true);
			self2.closest(".ui-select-frame").eq(0).unbind("click");
			self2.closest(".ui-select-frame").eq(0).addClass("disabled");
			self2.closest(".ui-select-layout").eq(0).unbind("click");
			self2.closest(".ui-select-layout").eq(0).addClass("disabled");
			self2.parent().next('.ui-select-icon').hide();

			//上班时间校验
			$("#preTime").attr("placeholder", jsBizMultLan.atsManager_atsShiftEdit_i18n_22);//如08:30,18:00
			$('#preTime').attr("validate",
				$('#preTime').attr("validate") == null || $('#preTime').attr("validate").trim() == ''
					? "myTmVldt:true"
					: $('#preTime').attr("validate") + ",myTmVldt:true"
			);
			//下班时间校验				
			$("#nextTime").attr("placeholder", jsBizMultLan.atsManager_atsShiftEdit_i18n_25);//如08:30,18:00
			$('#nextTime').attr("validate",
				$('#nextTime').attr("validate") == null || $('#nextTime').attr("validate").trim() == ''
					? "myTmVldt:true"
					: $('#nextTime').attr("validate") + ",myTmVldt:true"
			);

			$('#segmentInRest').attr("validate",
				$('#segmentInRest').attr("validate") == null || $('#segmentInRest').attr("validate").trim() == ''
					? "number:true,myRestVldt:true,myRestInSegmentValidate:true"
					: $('#segmentInRest').attr("validate") + ",number:true,myRestVldt:true"
			);
			$('#preFloatAdjusted').attr("validate",
				$('#preFloatAdjusted').attr("validate") == null || $('#preFloatAdjusted').attr("validate").trim() == ''
					? "number:true"
					: $('#preFloatAdjusted').attr("validate") + ",number:true"
			);
			$('#nextFloatAdjusted').attr("validate",
				$('#nextFloatAdjusted').attr("validate") == null || $('#nextFloatAdjusted').attr("validate").trim() == ''
					? "number:true"
					: $('#nextFloatAdjusted').attr("validate") + ",number:true"
			);

			if ($('#isElastic').shrCheckbox("isSelected")) {//选中弹性班时相关字段要隐藏
				that.hideEditFormElastic();
				//
			}

		}, false);

		$('tr[role="rowheader"] th').click(function () {//处理列表排序后的显示
			that.hideDelLink();
		});

		if (that.getOperateState() == "EDIT") {
			editLength = $('#items tr.jqgrow').length;
		}
	},
	addCaptionDiv: function () {
		var that = this;
		$('div[title="' + jsBizMultLan.atsManager_atsShiftEdit_i18n_4 + '"]').closest(".row-fluid").eq(0)
			.append('<div data-ctrlrole="labelContainer">'
				+ '<div class="col-lg-4">'
				+ '<div class="field_label" title="'
				+ jsBizMultLan.atsManager_atsShiftEdit_i18n_2
				+ '"><a id = "caption" href="#">'
				+ jsBizMultLan.atsManager_atsShiftEdit_i18n_2
				+ '</a></div>'
				+ '</div></div>');

		$('#caption').live('click', that.reasonOnClick);
		$('body').append(that.getCaptionDivHtml());
		//}
	}, reasonOnClick: function () {
      /** 有其它语言再加吧*/
        if ("en_US" == contextLanguage) {
          document.location.href = "/shr/addon/attendmanage/web/resource/atsShift_example_EN.docx";
        } else {
          document.location.href = "/shr/addon/attendmanage/web/resource/atsShift_example.docx";
        }
	}
	, calSegmentInRestValue: function (restPreTime, restNextTime, preTime, nextTime, predaytype, nextdaytype) {
		//注意month是从0开始的
		var rt = { "valid": true, "info": '' };

		if ($("#restPreTime").val() == '' && $("#restNextTime").val() == '') {
			atsMlUtile.setTransNumValue("segmentInRest",0,{'decimalPrecision':0});
			rt.valid = true;
			return rt;
		}
		var mydate = new Date();
		var myyear = mydate.getFullYear();
		var mymonth = mydate.getMonth();
		var myday = mydate.getDate();
		if (mymonth < 10) { mymonth = "0" + mymonth; }
		if (myday < 10) { myday = "0" + myday; }

		var prea = $("#restPreTime").val();
		if (restPreTime != null) {
			prea = restPreTime;
		}
		var nexta = $("#restNextTime").val();
		if (restNextTime != null) {
			nexta = restNextTime;
		}
		var srarttime = myyear + "-" + mymonth + "-" + myday + " " + prea + ":00";
		var sendtime = myyear + "-" + mymonth + "-" + myday + " " + nexta + ":00";
		//上班时间
		var pretimea = atsMlUtile.getFieldOriginalValue("preTime");
		if (preTime != null) {
			pretimea = preTime;
		}
		var nexttimea = $("#nextTime").val();
		if (nextTime != null) {
			nexttimea = nextTime;
		}
		var pretime = myyear + "-" + mymonth + "-" + myday + " " + pretimea + ":00";
		var nexttime = myyear + "-" + mymonth + "-" + myday + " " + nexttimea + ":00";

		var pretimedaytype = $("#preTimeDayType").val();
		if (predaytype != null) {
			pretimedaytype = predaytype;
		}
		var nexttimedaytype = $("#nextTimeDayType").val();
		if (nextdaytype != null) {
			nexttimedaytype = nextdaytype;
		}

		//休息开始
		var srartdate = new Date(myyear, mymonth, myday, prea.split(":")[0], prea.split(":")[1], "00");//解决ie不支持的问题
		//休息结束
		var senddate = new Date(myyear, mymonth, myday, nexta.split(":")[0], nexta.split(":")[1], "00");

		//上班时间,下班时间
		var predate = new Date(myyear, mymonth, myday, pretimea.split(":")[0], pretimea.split(":")[1], "00");//解决ie不支持的问题
		var nextdate = new Date(myyear, mymonth, myday, nexttimea.split(":")[0], nexttimea.split(":")[1], "00");
		if (pretimedaytype == jsBizMultLan.atsManager_atsShiftEdit_i18n_21) {
			predate.setTime(predate.getTime() - 1 * 24 * 60 * 60 * 1000);
		} else if (pretimedaytype == jsBizMultLan.atsManager_atsShiftEdit_i18n_20) {
			predate.setTime(predate.getTime() + 1 * 24 * 60 * 60 * 1000);
		}
		if (nexttimedaytype == jsBizMultLan.atsManager_atsShiftEdit_i18n_21) {
			nextdate.setTime(nextdate.getTime() - 1 * 24 * 60 * 60 * 1000);
		} else if (nexttimedaytype == jsBizMultLan.atsManager_atsShiftEdit_i18n_20) {
			nextdate.setTime(nextdate.getTime() + 1 * 24 * 60 * 60 * 1000);
		}
		//旧的判断逻辑，不仅不全面，而且复杂。再也不用了。不过还是先留着吧。edit by chenah
		/*if (pretimedaytype == "前一天") {
			if (prea != "" && nexta != "") {
				var restStartValue = parseFloat(prea.substring(0,2));
				var restEndValue   = parseFloat(nexta.substring(0,2));
				var predateValue   = parseFloat(pretimea.substring(0,2));
				if (restStartValue < predateValue &&  restEndValue < predateValue) {
					//休息开始 休息结束 都是 当天
					srartdate.setTime(srartdate.getTime() + 0*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 0*24*60*60*1000);
				}else if (restEndValue > predateValue &&  restStartValue > predateValue){
					//休息开始 休息结束 都是 前一天
					srartdate.setTime(srartdate.getTime() - 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  - 1*24*60*60*1000);
				}else if (restStartValue > predateValue && restEndValue < predateValue){
					//休息开始-前一天 	休息结束 都是 当天
					srartdate.setTime(srartdate.getTime() - 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 0*24*60*60*1000);
				}
			}
		}
		if (pretimedaytype == "当天") {
			if (prea != "" && nexta != "") {
				var restStartValue = parseFloat(prea.substring(0,2));
				var restEndValue   = parseFloat(nexta.substring(0,2));
				var predateValue   = parseFloat(pretimea.substring(0,2));
				if (restStartValue < predateValue &&  restEndValue < predateValue) {
					//休息开始 休息结束 都是第二天
					srartdate.setTime(srartdate.getTime() + 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 1*24*60*60*1000);
				}else if (restEndValue > predateValue &&  restStartValue > predateValue){
					//休息开始 休息结束 都是当天
					srartdate.setTime(srartdate.getTime() + 0*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 0*24*60*60*1000);
				}else if (restStartValue > predateValue && restEndValue < predateValue){
					//休息开始-当天 	休息结束 都是第二天
					srartdate.setTime(srartdate.getTime() + 0*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 1*24*60*60*1000);
				}
			}
		}
		if (pretimedaytype == "后一天") {
			if (prea != "" && nexta != "") {
				var restStartValue = parseFloat(prea.substring(0,2));
				var restEndValue   = parseFloat(nexta.substring(0,2));
				var predateValue   = parseFloat(pretimea.substring(0,2));
				if (restStartValue < predateValue &&  restEndValue < predateValue) {
					//休息开始 休息结束 都是 第三天
					srartdate.setTime(srartdate.getTime() + 2*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 2*24*60*60*1000);
				}else if (restEndValue > predateValue &&  restStartValue > predateValue){
					//休息开始 休息结束 都是 后一天
					srartdate.setTime(srartdate.getTime() + 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 1*24*60*60*1000);
				}else if (restStartValue > predateValue && restEndValue < predateValue){
					//休息开始-后一天 	休息结束 都是 第三天
					srartdate.setTime(srartdate.getTime() + 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 2*24*60*60*1000);
				}
			}
		}*/
		var currdate = new Date();
		var currDateStr = currdate.getFullYear() + "-" + (currdate.getMonth()) + "-" + currdate.getDate();
		var preTimeValue = parseInt(getDayTypeValueByName(pretimedaytype));
		//上班开始时间
		var preTimeStrValue = parseInt(pretimea.substring(0, 2)) * 60 + parseInt(pretimea.substring(3, 5));
		//休息开始时间
		var restPreTimeValue = parseInt(prea.substring(0, 2)) * 60 + parseInt(prea.substring(3, 5));
		//休息结束时间
		var restNextTimeValue = parseInt(nexta.substring(0, 2)) * 60 + parseInt(nexta.substring(3, 5));
		var restPreDateTime = "";//休息开始（有时分秒的字符串）
		var resrNextDateTime = "";//休息结束（有时分秒的字符串）
		var restPreDate = null;//休息开始日期（没有时分秒的日期）
		var restNextDate = null;//休息开始日期（没有时分秒的日期）
		//1.计算休息开始时间
		if (restPreTimeValue >= preTimeStrValue) {//休息开始>=开始上班 ，同一天
			restPreDate = getDateByType(preTimeValue, currDateStr);
			restPreDateTime = getVirDateStr(restPreDate) + " " + prea + ":00";
		} else {//加一天
			preTimeValue = parseInt(preTimeValue) + 1;
			restPreDate = getDateByType(preTimeValue, currDateStr);
			restPreDateTime = getVirDateStr(restPreDate) + " " + prea + ":00";
		}
		srartdate = NewLongDate(restPreDateTime);
		//2.算休息结束时间
		preTimeValue = parseInt(getDayTypeValueByName(pretimedaytype));//要重新赋值
		if (restNextTimeValue >= preTimeStrValue) {//休息结束>=开始上班 ，同一天
			var restNextDate = getDateByType(preTimeValue, currDateStr);
			resrNextDateTime = getVirDateStr(restNextDate) + " " + nexta + ":00";
		} else {
			preTimeValue = parseInt(preTimeValue) + 1;
			var restNextDate = getDateByType(preTimeValue, currDateStr);
			resrNextDateTime = getVirDateStr(restNextDate) + " " + nexta + ":00";
		}
		senddate = NewLongDate(resrNextDateTime);
		var longTime = senddate.getTime() - srartdate.getTime();
		if (srartdate.getTime() < predate.getTime() && senddate.getTime() < predate.getTime()) {
			rt.valid = false;
			rt.info = jsBizMultLan.atsManager_atsShiftEdit_i18n_41;
		}
		if (srartdate.getTime() < predate.getTime() || srartdate.getTime() > nextdate.getTime()) {
			rt.valid = false;
			rt.info = jsBizMultLan.atsManager_atsShiftEdit_i18n_42;
		}
		if (senddate.getTime() < predate.getTime() || senddate.getTime() > nextdate.getTime()) {
			rt.info = jsBizMultLan.atsManager_atsShiftEdit_i18n_40;
			rt.valid = false;
		}
		if (isNaN(longTime)) {
			atsMlUtile.getFieldOriginalValue("segmentInRest");
		} else {
			atsMlUtile.setTransNumValue("segmentInRest",longTime / (60 * 1000),{'decimalPrecision':0});

		}

		return rt;
	}


	//重写父类
	/**
 * 保存
 */
	, saveAction: function (event) {
		var _self = this;

		if (atsMlUtile.getFieldOriginalValue("standardHour") <= 0 || atsMlUtile.getFieldOriginalValue("standardHour") > 24) {
			shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_6 });
			return;
		}

		if (_self.validate() && _self.verify() && _self.myValidate()) {
			this.doStorageSomething();
			now_usePolicyValue = parseInt($('#usePolicy_el').val(), 10);
			if (_self.usePolicyOptions.old_usePolicyValue !== -1 && now_usePolicyValue !== _self.usePolicyOptions.old_usePolicyValue) {
				shr.showConfirm(jsBizMultLan.atsManager_atsShiftEdit_i18n_0, function () {
					shr.shrBaseData.maintain.MaintainEdit.superClass.saveAction.call(_self, event);
				});
			} else {
				shr.shrBaseData.maintain.MaintainEdit.superClass.saveAction.call(_self, event);
			}
		}
	}
	, myValidate: function () {
		var cardobject = $('#cardRule').shrPromptBox('getValue');
		if (cardobject == null || cardobject.length == 0 ||
			cardobject.id == null || cardobject.id.length == 0) {
			shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_26 });
			return false;
		}

		var name = $('input[name="name"]').val();
		var simpleName = $('input[name="simpleName"]').val();
		if (name && simpleName) {
			if (name.length < simpleName.length) {
				shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_1, hideAfter: 9 });
				return false;
			}
		}
		return true;
	}
	,/**
	 * 删除行 重写
	 */
	deleteRowAction: function (event) {
		var $editGrid = this.getEditGrid(event.currentTarget);
		var allIds = $editGrid.getDataIDs();
		var selIds = $editGrid.jqGrid('getSelectedRows');

		if (selIds) {
			var len = allIds.length;
			var tempLen = selIds.length - 1;
			for (j = len - 1; j >= 0; j--) {
				if (tempLen < 0) {
					break;
				}
				var flag = false;
				for (var i = selIds.length - 1; i >= 0; i--) {
					if (selIds[i] == allIds[j]) {
						tempLen--;
						flag = true;
					}
				}
				if (!flag) {
					shr.showInfo({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_15 });
					return;
				}
			}
		}
		if (selIds) {
			for (var i = selIds.length - 1; i >= 0; i--) {
				$editGrid.jqGrid('delRow', selIds[i]);
			}
		}

		//增加触发事件 设置取卡规则
		var that = this;
		that.setCardRule(that.validateItems().vo.length);

		// 计算标准工时
		that.setStandardHour();

	}
	, setStandardHour: function () {
		var that = this;
		//更改标准工时	
		var rt = that.validateItems();
		var vo = rt.vo;
		var standardHour = 0;
		if (!vo) {
			return standardHour;
		}
		var total2 = 0, time1 = 0, time2 = 0, rest;
		for (var j = 0; j < vo.length; j++) {
			if (vo[j].attendanceTypeVal == 1 || vo[j].attendanceTypeVal == '1 ' || vo[j].attendanceTypeVal == 3 || vo[j].attendanceTypeVal == '3') {
				//正常出勤1  正常出勤不计异常3
				time1 = new Number(vo[j].pre.substring(0, 2)) * 60 + new Number(vo[j].pre.substring(3, 5));
				time2 = new Number(vo[j].next.substring(0, 2)) * 60 + new Number(vo[j].next.substring(3, 5));
				rest = new Number(vo[j].rest);

				time1 = getRealTimeByType(time1, vo[j].preDayType);
				time2 = getRealTimeByType(time2, vo[j].nextDayType);
				total2 += (time2 - time1) - rest;
			}
		}
		standardHour = (new Number(total2) / 60).toFixed(2);
		atsMlUtile.setTransNumValue('standardHour',standardHour);
		//编辑完分录后 改变 取卡规则中的过滤 
		that.setCardRule(vo.length);
		that.hideDelLink();
	},
	addRowAction: function (event) {
		var that = this;
		shr.msgHideAll();
		var item = $("#items");
		var count = item.getRowCount();
		var datas = item.getAllRowData();
		if (count == 0) {
			//    	norecord=$('.norecord');
			//    	$('.norecord').remove();
			$('.ui-jqgrid-bdiv').css({ minHeight: 0 });
		}
		if (count > 0 && $('#isElastic').shrCheckbox("isSelected") && $("input#elasticType").shrSelect("getValue").value == 0) {
			shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_28 });
			return false;
		}

		if (count == 3) {
			shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_38 });
			return false;
		}

		var $editGrid = this.getEditGrid(event.currentTarget);
		$editGrid.wafGrid('addForm');
		var event = document.createEvent('HTMLEvents');
		event.initEvent("editComplete_" + $editGrid.attr("id"), true, true);
		event.eventType = 'message';
		document.dispatchEvent(event);

		//重写新增，放在document.addEventListener('editComplete_items', function (event) {}中会出问题，执行顺序问题
		$("#preIsPunchCard").val(jsBizMultLan.atsManager_atsShiftEdit_i18n_31);
		$("#preIsPunchCard_el").val("1");
		$("#nextIsPunchCard").val(jsBizMultLan.atsManager_atsShiftEdit_i18n_31);
		$("#nextIsPunchCard_el").val("1");
		$("#attendanceType").val(jsBizMultLan.atsManager_atsShiftEdit_i18n_45);
		$("#attendanceType_el").val("1");


		$("#preTimeDayType").val(jsBizMultLan.atsManager_atsShiftEdit_i18n_11);
		$("#preTimeDayType_el").val("1");

		$("#nextTimeDayType").val(jsBizMultLan.atsManager_atsShiftEdit_i18n_11);
		$("#nextTimeDayType_el").val("1");

		//item.getRowCount() 3  segment
		//item.getDataIDs() //["1", "2", "3"]
		if (count == 0) {
			$("#segment").val(jsBizMultLan.atsManager_atsShiftEdit_i18n_14);//@
			$("#segment_el").val("1");//@
			that.hideAllDelLink();
		} else if (count == 1 && datas[0].segment == 1) {
			$("#segment").val(jsBizMultLan.atsManager_atsShiftEdit_i18n_12);//@
			$("#segment_el").val("2");//@
			that.hideAllDelLink();
		} else if (count == 2 && datas[1].segment == 2) {
			$("#segment").val(jsBizMultLan.atsManager_atsShiftEdit_i18n_13);//@
			$("#segment_el").val("3");//@
			that.hideAllDelLink();
		} else {
		}

		if (count == 1 || count == 2) {
			that.hideRestTime();
		}

		return true;
	},

	hideRestTime: function () {
		$("#restPreTime").val("");
		$("#restPreTime").hide();
		//$("#restPreTime").parent().hide();
		$("#restPreTime").parent().parent().parent().hide();
		//that.getField('restPreTime').hide();

		$("#restNextTime").val("");
		$("#restNextTime").hide();
	},

	//当改变班次设置分录段次时   设置取卡规则
	setCardRule: function (itemCount) {
		var that = this;
		var flag = true;
		if (that.getOperateState() == "EDIT" && itemCount == editLength && itemCount != 0) {
			flag = false;

		}
		if (flag) {
			$("#cardRule").shrPromptBox("setValue", {
				id: "",
				name: ""
			});
		}
		if (itemCount == 0) {
			$("#cardRule").shrPromptBox('disable');
		} else {

			$("#cardRule").shrPromptBox('enable');
			var hrOrgUse = $('#hrOrgUnit_el').val();
			$("#cardRule").closest(".ui-promptBox-frame").addClass("required valid");
			if (itemCount && itemCount != '' && flag) {
				var filter = " startSegmentNum = '" + itemCount + "' ";
				$("#cardRule").shrPromptBox("setFilter", filter);
				that.remoteCall({
					type: "post",
					async: false,
					method: "getDefaultCardRuleInfoInfo",
					param: { startSegmentNum: itemCount, hrOrgUse: hrOrgUse },
					success: function (res) {
						var info = res;
						//&& info.length > 0
						if (info != null) {
							$("#cardRule").shrPromptBox("setValue", {
								id: info.cardRule.id,
								name: info.cardRule.name
							});
							editLength = $('#items tr.jqgrow').length;
						}

					}
				});
			}
		}

	},
	hideDelLink: function () {
		//最好按上面的规则，找到字面对应的val，但是现在三段定死了，先就按定死的三段来吧。
		$('td span[id$="removeButton"]').hide();
		$("td[aria-describedby$=items_operatorColumn]").attr("title", jsBizMultLan.atsManager_atsShiftEdit_i18n_5);
		var tempMax;
		var tempMaxVal;
		var tds = $('td[aria-describedby="items_segment"]');
		for (var i = 0; i < tds.length; i++) {
			var td = tds[i];
			var val = 1;
			if ($(td).text() == jsBizMultLan.atsManager_atsShiftEdit_i18n_14) {
				val = 1;
			} else if ($(td).text() == jsBizMultLan.atsManager_atsShiftEdit_i18n_12) {
				val = 2;
			} if ($(td).text() == jsBizMultLan.atsManager_atsShiftEdit_i18n_13) {
				val = 3;
			}

			if (i == 0) {
				tempMax = tds[i];//引用，不要td，因为引用td在变，与建单类型i变不一样
				tempMaxVal = val;
			} else {
				if (tempMaxVal < val) {
					tempMax = tds[i];
					tempMaxVal = val;
				}
			}
		}
		//      $(tempMax).parent("tr").show();
	},
	hideDelLinks: function () {
		//最好按上面的规则，找到字面对应的val，但是现在三段定死了，先就按定死的三段来吧。
		$('td span[id$="removeButton"]').hide();
		$("td[aria-describedby$=items_operatorColumn]").attr("title", jsBizMultLan.atsManager_atsShiftEdit_i18n_5);
		var tempMax;
		var tempMaxVal;
		var tds = $('td[aria-describedby="items_segment"]');
		for (var i = 0; i < tds.length; i++) {
			var td = tds[i];
			var val = 1;
			if ($(td).text() == jsBizMultLan.atsManager_atsShiftEdit_i18n_14) {
				val = 1;
			} else if ($(td).text() == jsBizMultLan.atsManager_atsShiftEdit_i18n_12) {
				val = 2;
			} if ($(td).text() == jsBizMultLan.atsManager_atsShiftEdit_i18n_13) {
				val = 3;
			}

			if (i == 0) {
				tempMax = tds[i];//引用，不要td，因为引用td在变，与建单类型i变不一样
				tempMaxVal = val;
			} else {
				if (tempMaxVal < val) {
					tempMax = tds[i];
					tempMaxVal = val;
				}
			}
		}
		$(tempMax).parent("tr").show();
		if (tds.length == 0) {
			$('.jqgfirstrow').after(norecord);
		}
	},
	//bug:在录第二段的时候不点完成，删除第一段，导致出问题。 解决思路，在新增/编辑分录数据时，不显示删除链接.
	hideAllDelLink: function () {
		$('td span[id$="removeButton"]').hide();
	}
	, processApplyOTTime: function () {
		$("#preTime").blur(function () {
		});
	}
	, myExtendValidate: function () { //扩展自定义校验
		jQuery.extend(jQuery.validator.messages, {
			myTmVldt: jsBizMultLan.atsManager_atsShiftEdit_i18n_22,	//如08:30,18:00
			myRestTmVldt: jsBizMultLan.atsManager_atsShiftEdit_i18n_22,
			myRestVldt: jsBizMultLan.atsManager_atsShiftEdit_i18n_16,
			my24Vldt: jsBizMultLan.atsManager_atsShiftEdit_i18n_32
		});
		jQuery.validator.addMethod("myTmVldt", function (value, element) {
			var v = value || '';
			if (/[0-5][0-9][0-5][0-9]/.test(v) && v.length == 4) {
				v = value.substring(0, 2) + ":" + value.substring(2, 4);
			}
			if (/[0-5][0-9]:[0-5][0-9]/.test(v) && v.length == 5) {
				var h = new Number(v.substr(0, 2));
				if (h < 24 && h >= 0) {
					if (element.name == "preTime") {
						$("#preTime").val(v);
					} else if (element.name == "nextTime") {
						$("#nextTime").val(v);
					}
					return true;
				}
				else {
					return false;
				}
			} else {
				return false;
			}
		}, jsBizMultLan.atsManager_atsShiftEdit_i18n_22);//msg:错误提示文本。已验证 	如08:30,18:00
		jQuery.validator.addMethod("myRestTmVldt", function (value, element) {
			//休息开始，休息结束。可以为空，这里区分上班下班时间。空的时候校验通过。
			var v = value || '';
			if (v == "" || v == null) {
				return true;
			}
			if (/[0-5][0-9][0-5][0-9]/.test(v) && v.length == 4) {
				v = value.substring(0, 2) + ":" + value.substring(2, 4);
			}
			if (/[0-5][0-9]:[0-5][0-9]/.test(v) && v.length == 5) {
				var h = new Number(v.substr(0, 2));
				if (h < 24 && h >= 0) {
					if (element.name == "restPreTime") {
						$("#restPreTime").val(v);
					} else if (element.name == "restNextTime") {
						$("#restNextTime").val(v);
					}
					return true;
				}
				else {
					return false;
				}
			} else {
				return false;
			}
		}, jsBizMultLan.atsManager_atsShiftEdit_i18n_22);//msg:错误提示文本。已验证 	如08:30,18:00
		jQuery.validator.addMethod("myRestVldt", function (value, element) {
			var v = value || '';
			var v = v.trim();
			var vn = new Number(v);
			var opre = atsMlUtile.getFieldOriginalValue('preTime');
			var onext = $('#nextTime').val();
			var onePreDayType = $("#preTimeDayType").val();
			var oneNextDayType = $("#nextTimeDayType").val();
			var time1 = new Number(opre.substring(0, 2)) * 60 + new Number(opre.substring(3, 5));
			var time2 = new Number(onext.substring(0, 2)) * 60 + new Number(onext.substring(3, 5));
			time1 = getRealTimeByType(time1, onePreDayType);
			time2 = getRealTimeByType(time2, oneNextDayType);
			var total = time2 - time1
			if (total < vn) {
				jQuery.validator.messages.myRestVldt = jsBizMultLan.atsManager_atsShiftEdit_i18n_17;
				return false;
			} else if (total > 1440) {
				jQuery.validator.messages.myRestVldt = jsBizMultLan.atsManager_atsShiftEdit_i18n_48;
				return false;
			} else {
				return true;
			}
		}, jQuery.validator.messages.myRestVldt);//msg:错误提示文本。已验证 

		jQuery.validator.addMethod("myRestInSegmentValidate", function (value, element) {
			var v = value || '';
			var v = v.trim();
			var vn = new Number(v);
			if (vn < 0) {
				return false;
			} else {
				return true;
			}
		}, jsBizMultLan.atsManager_atsShiftEdit_i18n_18);

		jQuery.validator.addMethod("my24Vldt", function (value, element) {
			var vn = value;
			if ("number" !== typeof value) {
				var v = value || '';
				var v = v.trim();
				vn = new Number(v);
			}
			if (24 < vn || vn < 0) {
				return false;
			} else {
				return true;
			}
		});
	}
	//校验弹性班
	, validateElastic: function (vo) {
		var that = this;
		var rt = { "valid": true, "info": '', "vo": vo };
		var a = vo || [];
		for (var i = 0; i < a.length; i++) {
			var attendanceTypeVal = a[i].attendanceTypeVal;
			if ((attendanceTypeVal == "2" || attendanceTypeVal == "4")
				&& $('#isElastic').shrCheckbox("isSelected") && $("input#elasticType").shrSelect("getValue").value == 0) {
				rt.valid = false;
				rt.info = jsBizMultLan.atsManager_atsShiftEdit_i18n_29;
				return rt;
			}
		}
		return rt;
	}
	/**参数要求vo为一个数组，数组元素为一个对象{pre:x,next:y,name:nnn,val:vvv} .
	 * 返回一个对象{"valid":bool,"info":'',"vo":vo}
	 * 时间轴验证:第n+1段，必须是在第n段的时间轴之后。
	 * */
	, validateTimeAxis: function (vo) {
		var that = this;
		var rt = { "valid": false, "info": '', "vo": vo };
		var a = vo || [];

		if (a.length < 2) {
			rt.valid = true;
			return rt;
		} else {
			//摔下检查同名
			var min1, max1;//min:时间轴上段次应该排在前的，max:时间轴上段次应该排在后的
			for (var i = 0; i < a.length - 1; i++) {
				for (var j = i + 1; j < a.length; j++) {
					if (a[i].val <= a[j].val) {
						min1 = a[i];
						max1 = a[j];
					} else {
						min1 = a[j];
						max1 = a[i];
					}
					if (min1.name == max1.name) {
						rt.valid = false;
						rt.info = jsBizMultLan.atsManager_atsShiftEdit_i18n_7 + min1.name;
						return rt;
					}
				}
			}

			var min, max;//min:时间轴上段次应该排在前的，max:时间轴上段次应该排在后的
			for (var i = 0; i < a.length - 1; i++) {
				for (var j = i + 1; j < a.length; j++) {
					if (a[i].val <= a[j].val) {
						min = a[i];
						max = a[j];
					} else {
						min = a[j];
						max = a[i];
					}

					//时间轴上min应该在max前面
					if (that.validateTimeLegal(min, max)) {
						rt.valid = true;
						rt.info = '';
					} else {
						rt.valid = false;
						//rt.info= '段次时间设置有问题，段次'+max.name+'与'+min.name+'之间的跨度不能超过24小时(即一天)';
						rt.info = jsBizMultLan.atsManager_atsShiftEdit_i18n_49;
						return rt;
					}
				}
			}
		}

		return rt;
	},
	/**对象格式{pre:x,next:y,name:nnn,val:vvv}，其中x,y值格式为 hh:mi 时分,其中必须确定0<=hh<24,0<=mi<60
	 * min:时间轴上段次应该排在前的，max:时间轴上段次应该排在后的,现在比较是否符合这个规则。
	 * */
	validateTimeLegal: function (min, max) {
		var min_pre_h = new Number(min.pre.substr(0, 2)) + (new Number(min.pre.substr(3, 2))) / 60;
		var min_next_h = new Number(min.next.substr(0, 2)) + (new Number(min.next.substr(3, 2))) / 60;
		var max_pre_h = new Number(max.pre.substr(0, 2)) + (new Number(max.pre.substr(3, 2))) / 60;
		var max_next_h = new Number(max.next.substr(0, 2)) + (new Number(max.next.substr(3, 2))) / 60;
		//如果pre_h>=next_h,则认为next_h为第二天的,需调整
		//传入的参数为hh:mi，已经确保了hh不会超过24
		if (min_pre_h >= min_next_h) {
			min_next_h += 24;
		}
		if (max_pre_h >= max_next_h) {
			max_next_h += 24;
		}

		//max_pre_h<min_next_h,认为max是min的第二天的，需调整
		if (max_pre_h < min_next_h) {
			max_pre_h += 24;
			max_next_h += 24;
		}

		//经过以上调整 ，再做判断
		if (max_next_h - min_pre_h > 24) {
			return false;
		} else {
			return true;
		}

	}
	/**返回一个对象{"valid":bool,"info":'',"vo":vo}*/
	, validateItems: function () {

		var that = this;
		var records = $('#items tr.jqgrow');
		var recordLen = records.length;

		var segmentEnumStr = $('#segmentEnumStr').text();
		var attendanceTypeEnumStr = $('#attendanceTypeEnumStr').text();
		var segmentEnumJson = jQuery.parseJSON(segmentEnumStr);
		var attendanceTypeEnumJson = jQuery.parseJSON(attendanceTypeEnumStr);

		var vo = [];
		for (var i = 0; i < recordLen; i++) {
			var rowId = records[i].id;
			var name = $('td[aria-describedby="items_segment"]', records[i]).text();
			var attendanceTypeName =$('td[aria-describedby="items_attendanceType"]', records[i]).text();
			var o = {
				name: name,
				val: segmentEnumJson[name], //段次的时间，按时间轴进行，谁在前谁在后，由此处的val来决定
				attendanceTypeName: attendanceTypeName,
				attendanceTypeVal: attendanceTypeEnumJson[attendanceTypeName],
				pre : $("#items").jqGrid("getCell", rowId, "preTime"), //hh:mi 时:分
				next: $("#items").jqGrid("getCell", rowId, "nextTime"),//hh:mi
				rest: $("#items").jqGrid("getCell", rowId, "segmentInRest"),//hh:mi
				preTimeDayType: $("#items").jqGrid("getCell", rowId, "preTimeDayType"),
				nextTimeDayType: $("#items").jqGrid("getCell", rowId, "nextTimeDayType"),
				preDayType: $('td[aria-describedby="items_preTimeDayType"]', records[i]).text(),
				nextDayType: $('td[aria-describedby="items_nextTimeDayType"]', records[i]).text(),
			};
			vo.push(o);
		}

		var rt = that.validateTimeAxis(vo);
		if (rt.valid) {
			rt = that.validateElastic(vo);
		}
		return rt;
	}
	, validate: function () {
		shr.msgHideAll();

		var that = this;
		var workArea = that.getWorkarea(),
			$form = $('form', workArea);

		var flag = $form.valid();
		//至少一条分录数据
		var records = $('#items tr.jqgrow');
		var recordLen = records.length;
		flag = flag && (recordLen > 0);
		if (recordLen == 0) {
			shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_46 });
			return false;
		}

		var rt = that.validateItems();
		if (rt.valid == false) {
			shr.showWarning({ message: rt.info });
			return false;
		} else {

		}

		//校验分录上时间点是否正确,只针对一段班才校验
		if (recordLen == 1) {
			var records = $('#items tr.jqgrow');
			var restpretime = $('td[aria-describedby="items_restPreTime"]', records[0]).text(); //hh:mi
			var restnexttime = $('td[aria-describedby="items_restNextTime"]', records[0]).text();

			var predaytype = $('td[aria-describedby="items_preTimeDayType"]', records[0]).text();
			var nextdaytype = $('td[aria-describedby="items_nextTimeDayType"]', records[0]).text();

			var pretime = $('td[aria-describedby="items_preTime"]', records[0]).text();
			var nexttime = $('td[aria-describedby="items_nextTime"]', records[0]).text();

			var attendanceType = $('td[aria-describedby="items_attendanceType"]', records[0]).text();

			///////
			var mydate = new Date();
			var myyear = mydate.getFullYear();
			var mymonth = mydate.getMonth() + 1;
			var myday = mydate.getDate();
			if (mymonth < 10) { mymonth = "0" + mymonth; }
			if (myday < 10) { myday = "0" + myday; }

			var ontime = myyear + "-" + mymonth + "-" + myday + " " + pretime + ":00";
			var offtime = myyear + "-" + mymonth + "-" + myday + " " + nexttime + ":00";

			var ondate = new Date(ontime.replace("\\-", "/"));
			var offdate = new Date(offtime.replace("\\-", "/"));
			///////
			if (predaytype == jsBizMultLan.atsManager_atsShiftEdit_i18n_21) {
				ondate.setTime(ondate.getTime() - 1 * 24 * 60 * 60 * 1000);
			} else if (predaytype == jsBizMultLan.atsManager_atsShiftEdit_i18n_11) {
				ondate.setTime(ondate.getTime() + 0);
			} else {
				ondate.setTime(ondate.getTime() + 1 * 24 * 60 * 60 * 1000);
			}

			if (nextdaytype == jsBizMultLan.atsManager_atsShiftEdit_i18n_21) {
				offdate.setTime(offdate.getTime() - 1 * 24 * 60 * 60 * 1000);
			} else if (nextdaytype == jsBizMultLan.atsManager_atsShiftEdit_i18n_11) {
				offdate.setTime(offdate.getTime() + 0);
			} else {
				offdate.setTime(offdate.getTime() + 1 * 24 * 60 * 60 * 1000);
			}

			if (offdate.getTime() <= ondate.getTime()) {
				shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_43 });
				return false;
			}
			if (offdate.getTime() - ondate.getTime() > 1 * 24 * 60 * 60 * 1000) {
				shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_3 });
				return false;
			}
			if ((restpretime.trim() == "" && restnexttime.trim() != "") || (restpretime.trim() != "" && restnexttime.trim() == "")) {
				shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_44 });
				return false;
			}

			var calrt = that.calSegmentInRestValue(restpretime, restnexttime, pretime, nexttime, predaytype, nextdaytype);
			if (calrt.valid == false) {
				shr.showWarning({ message: calrt.info });
				return false;
			}


			if (attendanceType.indexOf(jsBizMultLan.atsManager_atsShiftEdit_i18n_19) >= 0
				&& $('#isElastic').shrCheckbox("isSelected")
				&& $("input#elasticType").shrSelect("getValue").value == 0) {
				shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_29 });
				return false;
			}
			if (!(restpretime.trim() == "")) {
				var pretimeVal = parseInt(pretime.split(":")[0]) + parseInt(pretime.split(":")[1]) / 60;
				var restpretimeVal = parseInt(restpretime.split(":")[0]) + parseInt(restpretime.split(":")[1]) / 60;
				if (restpretimeVal > pretimeVal && parseFloat(atsMlUtile.getFieldOriginalValue("elasticValue")) >= (restpretimeVal - pretimeVal)) {
					shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_47 });
					return false;
				}
				if (restpretimeVal <= pretimeVal && parseFloat(atsMlUtile.getFieldOriginalValue("elasticValue")) >= (24 + restpretimeVal - pretimeVal)) {
					shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_47 });
					return false;
				}
			}
		}
		if (recordLen > 1 && $('#isElastic').shrCheckbox("isSelected") && $("input#elasticType").shrSelect("getValue").value == 0) {
			shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_28 });
			return false;
		}
		if ($('#isElastic').shrCheckbox("isSelected") && $("input#elasticType").shrSelect("getValue").value == 1) {
			if (!(parseFloat(atsMlUtile.getFieldOriginalValue("elasticValue")) > 0)) {
				shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_9 });
				return false;
			}
			if (!(/^-?\d+\.?\d{0,2}$/.test(atsMlUtile.getFieldOriginalValue("elasticValue")))) {
				shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_10 });
				return false;
			}
			if (parseFloat(atsMlUtile.getFieldOriginalValue("elasticValue")) >= parseFloat(atsMlUtile.getFieldOriginalValue("standardHour"))) {
				shr.showWarning({ message: jsBizMultLan.atsManager_atsShiftEdit_i18n_35 });
				return false;
			}
		}
		//flag =  false;
		//alert("保存");
		return flag;
	}
	, addElasticDoc: function () {
		$("#elasticType_down").find("a").eq(0).attr("title", jsBizMultLan.atsManager_atsShiftEdit_i18n_27);
		$("#elasticType_down").find("a").eq(1).attr("title", jsBizMultLan.atsManager_atsShiftEdit_i18n_30);
	}
	, addElasticHtml: function () {
		var that = this;

		$($("#elasticDirection_down").find("li")[0]).remove()//暂时只支持往后延
		$("#elasticDirection").shrSelect("setValue","1") // 也设置为后延

		$("#elasticType").change(function () {
			if ($(this).shrSelect("getValue").value == 0) {
				$("#elasticDirection").closest('div[data-ctrlrole="labelContainer"]').hide();
				$("#elasticValue").closest('div[data-ctrlrole="labelContainer"]').hide();
			} else {
				$("#elasticDirection").closest('div[data-ctrlrole="labelContainer"]').show();
				$("#elasticValue").closest('div[data-ctrlrole="labelContainer"]').show();
			}
			that.hideEditFormElastic();
		});

		$("#isElastic").shrCheckbox('onChange', function () {
			if ($('#isElastic').shrCheckbox("isSelected")) {
				$("#elasticType").closest('div[data-ctrlrole="labelContainer"]').show();
				$("#elasticType").change(); // 触发change事件
				that.hideEditFormElastic();
			} else {
				$("#elasticType").closest('div[data-ctrlrole="labelContainer"]').hide();
				$("#elasticDirection").closest('div[data-ctrlrole="labelContainer"]').hide();
				$("#elasticValue").closest('div[data-ctrlrole="labelContainer"]').hide();
				that.showEditFormElastic();
			}
		});

		// 触发一次作为初始化
		$("#isElastic").change();

	}
	, showEditFormElastic: function () {
		$("#preFloatAdjusted").parent().parent().show();
		$("#preFloatAdjusted").parent().parent().prev().show();
		$("#nextFloatAdjusted").parent().parent().show();
		$("#nextFloatAdjusted").parent().parent().prev().show();
		$("#restPreTime").parent().parent().show();
		$("#restPreTime").parent().parent().prev().show();
		$("#restNextTime").parent().parent().show();
		$("#restNextTime").parent().parent().prev().show();
	}
	, hideEditFormElastic: function () {
		$("#preFloatAdjusted").parent().parent().hide();
		$("#preFloatAdjusted").parent().parent().prev().hide();
		$("#nextFloatAdjusted").parent().parent().hide();
		$("#nextFloatAdjusted").parent().parent().prev().hide();

		if ($("input#elasticType").shrSelect("getValue").value == 0) {
			$("#restPreTime").parent().parent().hide();
			$("#restPreTime").parent().parent().prev().hide();
			$("#restNextTime").parent().parent().hide();
			$("#restNextTime").parent().parent().prev().hide();
		} else {
			$("#restPreTime").parent().parent().show();
			$("#restPreTime").parent().parent().prev().show();
			$("#restNextTime").parent().parent().show();
			$("#restNextTime").parent().parent().prev().show();
		}
	}
});

function getVirDateStr(date) {
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var tMonth = month > 9 ? month : ('0' + month);
	var tDay = day > 9 ? day : ('0' + day);
	return year + '-' + tMonth + '-' + tDay;
}

function NewLongDate(dateTime) {
	var dateTimeArr = dateTime.split(" ");
	var dateStr = dateTimeArr[0];
	var timeStr = dateTimeArr[1];
	var dateArr = dateStr.split("-");
	var year = dateArr[0];
	var month = dateArr[1];
	var day = dateArr[2];
	var timeArr = timeStr.split(":");
	var hour = timeArr[0];
	var minute = timeArr[1];
	var second = timeArr[2];
	var date = new Date(year, month, day, hour, minute, second);
	return date;
}

function NewShortDate(date) {
	var dateTimeArr = date.split(" ");
	var dateStr = dateTimeArr[0];
	var dateArr = dateStr.split("-");
	var year = dateArr[0];
	var month = dateArr[1];
	var day = dateArr[2];
	var date = new Date(year, month, day);
	return date;
}

function getDayTypeValueByName(typeName) {
	if (jsBizMultLan.atsManager_atsShiftEdit_i18n_21 == typeName) {
		return "0";
	} else if (jsBizMultLan.atsManager_atsShiftEdit_i18n_11 == typeName) {
		return "1";
	} else if (jsBizMultLan.atsManager_atsShiftEdit_i18n_20 == typeName) {
		return "2"
	} else {
		return "";
	}
}

function getDateByType(type, currDateStr) {
	/*var regEx = new RegExp("\\-","gi");
	currDateStr = currDateStr.replace(regEx,"/");*/
	var curDate = NewShortDate(currDateStr);
	if (parseInt(type) == 0) {//前一天
		var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000);
		return preDate;
	} else if (parseInt(type) == 1) {//当天
		return curDate;
	} else {//后一天
		var nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000);
		return nextDate;
	}
}

function getRealTimeByType(value, type) {
	if (jsBizMultLan.atsManager_atsShiftEdit_i18n_21 == type) {
		value -= 24 * 60;
	}
	else if (jsBizMultLan.atsManager_atsShiftEdit_i18n_11 == type) {

	}
	else if (jsBizMultLan.atsManager_atsShiftEdit_i18n_20 == type) {
		value += 24 * 60;
	}
	else {

	}
	return value;
}

