/**
 * ats通用工具类
 */

function AtsCommonUtile() {
	var that = this;
	this.name = "AtsCommonUtile";

	that.DAY_LONG = 24 * 60 * 60 * 1000;
	that.HOUR_LONG = 60 * 60 * 1000;
	that.MINUTE_LONG = 60 * 1000;
	that.SECOND_LONG = 1000;
	that.WEEKDAY = [
		$.attendmanageI18n.atsCommonUtile.weekday1,
		$.attendmanageI18n.atsCommonUtile.weekday2,
		$.attendmanageI18n.atsCommonUtile.weekday3,
		$.attendmanageI18n.atsCommonUtile.weekday4,
		$.attendmanageI18n.atsCommonUtile.weekday5,
		$.attendmanageI18n.atsCommonUtile.weekday6,
		$.attendmanageI18n.atsCommonUtile.weekday7
	];
	/**
	 * 表示先后顺序中的先
	 */
	that.SEQUENCE_BEFORE = 1;
	/**
	 * 表示先后顺序中的任意
	 */
	that.SEQUENCE_NO_ORDER = 5;
	/**
	 * 表示先后顺序中的后
	 */
	that.SEQUENCE_AFTER = 10;
	
	that.getDateSelectRange = function(needDateValue) {
		!needDateValue && (needDateValue = ["prevWeek","thisWeek","nextWeek","thisMonth","prevMonth","nextMonth"]);
		return [{
				"value" : "today",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias1
			}, {
				"value" : "tomorrow",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias2
			}, {
				"value" : "thisWeek",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias3
			}, {
				"value" : "lastWeek",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias4
			}, {
				"value" : "prevWeek",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias5
			}, {
				"value" : "nextWeek",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias6
			}, {
				"value" : "futureWeek",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias7
			}, {
				"value" : "thisMonth",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias8
			}, {
				"value" : "lastHalfMonth",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias9
			}, {
				"value" : "lastMonth",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias10
			}, {
				"value" : "lastThreeMonths",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias11
			}, {
				"value" : "prevMonth",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias12
			}, {
				"value" : "nextMonth",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias13
			}, {
				"value" : "futureMonth",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias14
			}, {
				"value" : "futureTwoMonths",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias15
			}, {
				"value" : "futureThreeMonths",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias16
			}, {
				"value" : "lastHalfYear",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias17
			}, {
				"value" : "prevHalfYear",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias18
			}, {
				"value" : "nextHalfYear",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias19
			}, {
				"value" : "thisYear",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias20
			}, {
				"value" : "prevYear",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias21
			}, {
				"value" : "thisQuarter",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias22
			}, {
				"value" : "prevQuarter",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias23
			}, {
				"value" : "custom",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias24
			}, {
				"value" : "serverData",
				"alias" : $.attendmanageI18n.atsCommonUtile.alias25
			}
		].filter(function(current){
			return atsArrayUtile.contains(needDataValue,current,"value");
		});
	};
	
	
	
	that.getAtsCache = function(key){
		var cacheData = sessionStorage.getItem("ATS_CACHE_DATA");
		if(!cacheData){
			cacheData = JSON.stringify({});
			sessionStorage.setItem("ATS_CACHE_DATA",cacheData);
		}
		cacheData = JSON.parse(cacheData);
		return key === undefined ? cacheData : cacheData[key];
	}
	
	that.saveToAtsCache = function(key,value){
		var cacheData = that.getAtsCache();
		if(value || value === 0 || value === false){
			cacheData[key] = value;
		}else if(typeof key == "object"){
			for(var field in key){
				cacheData[field] = key[field];
			}
		}
		sessionStorage.setItem("ATS_CACHE_DATA",cacheData);
	}
	
	
	that.get = function(obj,field,defaulValue){
		if(obj && (obj[field] || obj[field] === 0 || obj[field] === false)){
			return obj[field];
		}
		if(defaulValue || defaulValue === 0 || defaulValue === false){
			return defaulValue;
		}
		return  "";
	}
	
	that.getId = function(obj){
		for(var field in obj){
			if(field.toLowerCase() == "id" || field.toLowerCase() == "fid" ){
				return obj[field] || obj[field] === 0 || obj[field] === false ? obj[field] : "";
			}
		}
		return ""
	}
	
	/**
	 * 复制
	 * @param {Object} arr
	 */
	that.copy = function(obj) {
		return JSON.parse(JSON.stringify(obj || ""));
	}

	/**
	 * 基于传入日期计算当月第一天
	 * @param {Object} baseDate 传入日期，不传时为当前日期
	 * @param {Object} nextCount 传入日期后推月数 ，负数时向前推，0为当月
	 * @param {Object} isDateFormat 返回值格式控制参数，当且仅当为true时返回时间对象
	 */
	that.getNextMonthstartDate = function(baseDate, nextCount, isDateFormat) {
		!nextCount && nextCount !== 0 && (nextCount = 1);
		nextCount -= 0;
		var yearCount = parseInt(nextCount / 12);//@
		var monthRemainder = nextCount % 12
		var currentDate = that.getDateObj(baseDate);
		if(currentDate.getMonth() + monthRemainder > 11) {
			currentDate = new Date(currentDate.getFullYear() + yearCount + 1, currentDate.getMonth() + monthRemainder - 12, 1);
		} else {
			currentDate = new Date(currentDate.getFullYear() + yearCount, currentDate.getMonth() + monthRemainder, 1);
		}
		return isDateFormat === true ? currentDate : that.formateDate(currentDate);
	}

	/**
	 * 基于传入日期计算当月最后一天
	 * @param {Object} baseDate 传入日期，不传时为当前日期
	 * @param {Object} nextCount 传入日期后推月数 ，负数时向前推，0为当月
	 * @param {Object} isDateFormat 返回值格式控制参数，当且仅当为true时返回时间对象
	 */
	that.getNextMonthEndDate = function(baseDate, nextCount, isDateFormat) {
		!nextCount && nextCount !== 0 && (nextCount = 1);
		nextCount -= 0;
		currentDate = that.getNextMonthstartDate(baseDate, nextCount + 1, true);
		currentDate.setDate(0);
		return isDateFormat === true ? currentDate : that.formateDate(currentDate);
	}

	/**
	 * 计算一个月后的日期，下个月不存在当天，取月末
	 * 如：3月31日一个月后是4月30日
	 * @param {Object} baseDate 传入日期，不传时为当前日期
	 * @param {Object} nextCount 传入日期后推月数 ，负数时向前推，0为当月
	 * @param {Object} isDateFormat 返回值格式控制参数，当且仅当为true时返回时间对象
	 */
	that.getNextMonthDate = function(baseDate, nextCount, isDateFormat) {
		var newBaseDate = that.getDateObj(baseDate);
		var nextMonthEndDate = that.getNextMonthEndDate(newBaseDate, nextCount, true);
		nextMonthEndDate.setDate(Math.min(nextMonthEndDate.getDate(), newBaseDate.getDate()));
		return isDateFormat === true ? nextMonthEndDate : that.formateDate(nextMonthEndDate);
	}
	
	that.getNextMonthBeforeDate = function(baseDate, nextCount, isDateFormat){
		return that.getNextDate(that.getNextMonthDate(baseDate, nextCount, true),-1, isDateFormat);
	}
	
	that.getNextDate = function(baseDate, nextCount, isDateFormat){
		!nextCount && nextCount !== 0 && (nextCount = 1);
		nextCount -= 0;
		var newBaseDate = that.getDateObj(baseDate);
		newBaseDate.setTime(newBaseDate.getTime() + nextCount * that.DAY_LONG);
		return isDateFormat === true ? newBaseDate : that.formateDate(newBaseDate);
	}
	
	that.getNextWeekStartDate = function(baseDate, nextCount, isDateFormat){
		!nextCount && nextCount !== 0 && (nextCount = 1);
		nextCount -= 0;
		var newBaseDate = that.getDateObj(baseDate);
		newBaseDate.setTime(newBaseDate.getTime() + that.DAY_LONG * (7 * nextCount - newBaseDate.getDay()))
		return isDateFormat === true ? newBaseDate : that.formateDate(newBaseDate);
	}
	
	that.getNextWeekEndDate = function(baseDate, nextCount, isDateFormat){
		var newBaseDate = that.getNextWeekStartDate(baseDate, nextCount, true);
		newBaseDate.setTime(newBaseDate.getTime() + 6 * that.DAY_LONG);
		return isDateFormat === true ? newBaseDate : that.formateDate(newBaseDate);
	}

	/**
	 * 将传入日期 baseDate 转化为时间对象
	 * @param {Object} baseDate 为空时取当前日期
	 */
	that.getDateObj = function(baseDate) {
		var currentDate = baseDate ? baseDate : new Date();
		typeof currentDate == "string" && (currentDate = new Date(currentDate.replace(/-/g, "/")));
		return currentDate;
	}

	/**
	 * 将日期转化为 2010-09-01格式
	 * @param {Object} baseDate 要转化的日期 ，不传时为当前日期
	 */
	that.formateDate = function(baseDate) {
		var date = that.getDateObj(baseDate);
		return date.getFullYear() + '-' + that.formateNum(date.getMonth() + 1) + '-' + that.formateNum(date.getDate());
	}

	/**
	 * 时间比较
	 * 比较结果为 firstDate.getTime() - secondDate.getTime()
	 * @param {Object} firstDate 比较的第一个值，必须要有
	 * @param {Object} secondDate 比较的第二个值 不传时为当前日期
	 */
	that.compareDate = function(firstDate, secondDate) {
		if(!firstDate) {
			console.error(jsBizMultLan.atsManager_atsCommonUtile_i18n_0);
		}
		firstDate = that.getDateObj(firstDate);
		secondDate = that.getDateObj(secondDate);
		return firstDate.getTime() - secondDate.getTime();
	}

	/**
	 * 验证时间baseDate是否无效，无效时返回提升信息，有效返回false
	 * @param {Object} baseDate
	 */
	that.isInvalidateDate = function(baseDate, name, showErroeMessage) {
		if(!baseDate) {
			showErroeMessage && that.showWarning(name + $.attendmanageI18n.atsCommonUtile.msg1);
			return name + $.attendmanageI18n.atsCommonUtile.msg1;
		}
		if(typeof baseDate == "string") {
			baseDate = baseDate.replace(/\s+/gi, "").replace(/\.|\-|\//gi, "/"); //为了兼容IE
			var dateArr = baseDate.split("/");
			if(dateArr.length != 3) {
				showErroeMessage && that.showWarning(name + $.attendmanageI18n.atsCommonUtile.msg2);
				return name + $.attendmanageI18n.atsCommonUtile.msg2;
			}
			transformedDate = new Date(baseDate);//@
			if(transformedDate == "Invalid Date") {
				showErroeMessage && that.showWarning(name + $.attendmanageI18n.atsCommonUtile.msg2);
				return name + $.attendmanageI18n.atsCommonUtile.msg2;
			}
			if(transformedDate.getDate() != dateArr[dateArr.length - 1]) {
				showErroeMessage && that.showWarning(name + $.attendmanageI18n.atsCommonUtile.msg3);
				return name + $.attendmanageI18n.atsCommonUtile.msg3;
			}
		}
		if(baseDate == "Invalid Date") {
			showErroeMessage && that.showWarning(name + $.attendmanageI18n.atsCommonUtile.msg4);
			return name + $.attendmanageI18n.atsCommonUtile.msg4;
		}
		return false;
	}

	/**
	 * 验证日期合法性
	 * 配置:{baseData : baseDate,name: "结束日期",startRange : firstBegin,endRange : firstEnd}
	 * @param {Object} config
	 * @param {Object} showErroeMessage
	 */
	that.isInvalidateDateByConfig = function(config, showErroeMessage) {
		if(that.isInvalidateDate(config.baseDate, config.name, showErroeMessage)) {
			return true;
		}
		if(config.startRange && that.compareDate(config.baseDate, config.startRange) < 0) {
			showErroeMessage && that.showWarning(config.name + $.attendmanageI18n.atsCommonUtile.msg5 + that.formateDate(config.startRange));
			return true;
		}
		if(config.endRange && that.compareDate(config.baseDate, config.endRange) > 0) {
			showErroeMessage && that.showWarning(config.name + $.attendmanageI18n.atsCommonUtile.msg6 + that.formateDate(config.endRange));
			return true;
		}
		return false;
	}

	/**
	 * 
	 * @param {Object} smallDate
	 * @param {Object} bigDate
	 * @param {Object} compareConfig
	 * compareConfig{
	 * 	smallName : "开始",
	 * 	bigName : "结束",
	 * 	interval :毫秒数或者6d7h3m4s格式 ，表示"6天7个小时3分钟4s",也可以配置1M表示一个月
	 * }
	 */
	that.validateDateByConfig = function(smallDate, bigDate, compareConfig, showErroeMessage) {
		!compareConfig && (compareConfig = {});
		!compareConfig.smallName && (compareConfig.smallName = $.attendmanageI18n.atsCommonUtile.msg7);
		!compareConfig.bigName && (compareConfig.bigName = $.attendmanageI18n.atsCommonUtile.msg8);
		compareConfig.baseDate = smallDate;
		compareConfig.name = compareConfig.smallName;
		if(that.isInvalidateDateByConfig(compareConfig, showErroeMessage)) {
			return false;
		}
		compareConfig.baseDate = bigDate;
		compareConfig.name = compareConfig.bigName;
		if(that.isInvalidateDateByConfig(compareConfig, showErroeMessage)) {
			return false;
		}
		var interval = that.compareDate(bigDate, smallDate);
		if(interval < 0) {
			showErroeMessage && that.showWarning(compareConfig.bigName + $.attendmanageI18n.atsCommonUtile.msg5 + compareConfig.smallName);
			return false;
		}
		if(compareConfig.interval) {
			if(compareConfig.interval.substr(-1) == "M") {
				var nextCount = compareConfig.interval.substr(0, compareConfig.interval.length - 1);
				if(that.compareDate(bigDate, that.getNextMonthBeforeDate(smallDate, nextCount, true)) > 0) {
					showErroeMessage && that.showWarning(shr.formatMsg($.attendmanageI18n.atsCommonUtile.msg9,
						[compareConfig.smallName, compareConfig.bigName, nextCount]));
					return false;
				}
				return true;
			}
		}
		if(compareConfig.interval && interval > that.getLongFromTimeDescripe(compareConfig.interval)) {
			showErroeMessage && that.showWarning(shr.formatMsg($.attendmanageI18n.atsCommonUtile.msg10,
				[compareConfig.smallName, compareConfig.bigName]));
			return false;
		}
		return true;
	}

	/**
	 * 6d7h3m4s 转换为6天+7个小时+3分钟+4s的毫秒数long类型
	 * D、d表示天
	 * H、h表示小时
	 * m表示分钟
	 * s表示秒
	 * @param {Object} timeDescripeStr
	 */
	that.getLongFromTimeDescripe = function(timeDescripeStr) {
		var timeLong = 0
		var index = timeDescripeStr.indexOf("d") || timeDescripeStr.indexOf("D");
		if(index > 0) {
			timeLong += timeDescripeStr.substring(0, index) * that.DAY_LONG;
			timeDescripeStr = timeDescripeStr.substring(index + 1);
		}
		index = timeDescripeStr.indexOf("h") || timeDescripeStr.indexOf("H");
		if(index > 0) {
			timeLong += timeDescripeStr.substring(0, index) * that.HOUR_LONG;
			timeDescripeStr = timeDescripeStr.substring(index + 1);
		}
		index = timeDescripeStr.indexOf("m");
		if(index > 0) {
			timeLong += timeDescripeStr.substring(0, index) * that.MINUTE_LONG;
			timeDescripeStr = timeDescripeStr.substring(index + 1);
		}
		index = timeDescripeStr.indexOf("s") || timeDescripeStr.indexOf("S");
		if(index > 0) {
			timeLong += timeDescripeStr.substring(0, index) * that.SECOND_LONG;
			timeDescripeStr = timeDescripeStr.substring(index + 1);
		}
		return timeLong + (timeDescripeStr - 0);
	}

	/**
	 * 6d7h3m4s 转换为"6天7个小时3分钟4s"
	 * @param {Object} timeDescripe
	 */
	that.getTextFromTimeDescripe = function(timeDescripe) {
		if(!isNaN(timeDescripe - 0)) {
			return timeDescripe + $.attendmanageI18n.atsCommonUtile.msg11
		}
		timeDescripe = timeDescripe.replace(/D|d/, $.attendmanageI18n.atsCommonUtile.msg12)
		.replace(/H|h/, $.attendmanageI18n.atsCommonUtile.msg13)
		.replace("m", $.attendmanageI18n.atsCommonUtile.msg14)
		.replace(/S|s/, $.attendmanageI18n.atsCommonUtile.msg15);
		return isNaN(timeDescripe.substr(-1) - 0) ? timeDescripe : timeDescripe + $.attendmanageI18n.atsCommonUtile.msg11;
	}

	/**
	 * 格式化数字 formateNum(9,2)返回"09"; formateNum(9.2565,2)返回"9.26"
	 * @param {Object} num 要格式化的数字
	 * @param {Object} decimal 格式化精度
	 */
	that.formateNum = function(num, decimal) {
		!decimal && (decimal = 2);
		num += "";
		if(num.indexOf(".") > -1) {
			num = num * Math.pow(10, decimal) + "";
			if(num.indexOf(".") > -1) {
				num = num.split(".")[1].charAt(0) >= 5 ? Math.ceil(num) : Math.floor(num);
			}
			num = num + "";
			while(num.length < decimal) {
				num = "0" + num;
			}
			num = num.substr(0, num.length - decimal) + "." + num.substr(num.length - decimal, num.length);
			return num.charAt(0) == "." ? "0" + num : num;
		} else {
			while(num.length < decimal) {
				num = "0" + num;
			}
			return num;
		}
	}
	
	that.assembleFn = function(obj,configure,curentScop){
		for(var property in configure){
			if(configure[property] && typeof configure[property].fn == "function" && configure[property].sequence && typeof obj[property] == "function"){
				var oldFn = obj[property];
				if(configure[property].sequence == that.SEQUENCE_BEFORE){
					obj[property] = function(args){
						configure[property].fn.call(configure[property].scope || this,args);
						oldFn.call(curentScop || this);
					}
				}else{
					obj[property] = function(args){
						oldFn.call(curentScop || this,args);
						configure[property].fn.call(configure[property].scope || this,args);
					}
				}
			}else{
				obj[property] = configure[property];
				obj[property].fn && (obj[property] = obj[property].fn);
			}
		}
	}

	/**
	 * 将null,undefined转化为空字符串
	 * @param {Object} value
	 */
	that.correctValue = function(value) {
		return value === null || value === undefined ? "" : value;
	}
	
	that.hasContent = function(value){
		return value != null && value != "null" && value != "undefined" && value != "";
	}

	/**
	 * @param {Object} selector
	 */
	that.closeSelfFrame = function(selector) {
		parent.$(selector).dialog('close');
	}

	that.closeFrameInParent = function(selector) {
		$(selector).dialog('close');
	}

	/**
	 * 以优先级：id>class>html元素选择器返回选择的元素，否则直接返回ele
	 * @param {Object} ele
	 */
	that.getElement = function(ele, win) {
		win = win || window;
		var eleObj;
		if(typeof ele === "string") {
			eleObj = win.$("#" + ele);
			eleObj.length == 0 && (eleObj = win.$("." + ele));
			eleObj.length == 0 && (eleObj = win.$(ele));
		}!eleObj || eleObj.length == 0 && (eleObj = ele);
		return eleObj;
	}

	/**
	 * result encodeURIComponent(shr.getUrlRequestParam(name))
	 * @param {Object} name
	 */
	that.getUrlParamAndEncode = function(name) {
		return encodeURIComponent(shr.getUrlRequestParam(name));
	}

	/**
	 * 创建F7
	 * @param {Object} element
	 * @param {Object} options
	 * @param {Object} isOpenNow
	 */
	that.createSpecialF7 = function(element, options, isOpenNow) {
		var grid_f7_json = {
			id: options.name,
			name: options.name
		};
		grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title: options.title || $.attendmanageI18n.atsCommonUtile.msg16,
			uipk: options.uipk,
			query: options.query || "",
			filter: options.filter || "",
			domain: options.domain || "",
			multiselect: options.multiselect || false,
			isHRBaseItem: options.isHRBaseItem || true,
			treeFilterConfig: options.treeFilterConfig || "",
			filterConfig: options.filterConfig || [{
				name: 'isComUse',
				value: true,
				alias: $.attendmanageI18n.atsCommonUtile.alias26,
				widgetType: 'checkbox'
			}],
			f7ReKeyValue: "BaseInfo.id:BaseInfo.name",
			onclikFunction: function(ids) {
				options.onclikFunction && typeof options.onclikFunction == "function" && options.onclikFunction(ids);
			}
		};

		grid_f7_json.readonly = options.readonly || "";
		grid_f7_json.validate = options.validate || "";
		grid_f7_json.value = {
			id: "",
			name: ""
		};
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";
		element.shrPromptBox(grid_f7_json);
		options.bizFilterFieldsValues && element.shrPromptBox("setBizFilterFieldsValues", options.bizFilterFieldsValues);
		options.bizFilterFields && element.shrPromptBox("setBizFilterFields", options.bizFilterFields);
		isOpenNow !== false && element.shrPromptBox("open");
	}
	
	that.createPersonOtherFilter = function(conditionId,$appendToEle){
		var conditionHtml = ['<div id ="'+ conditionId + '" name = "condition_item" class="row-fluid row-block row_field" style="width: 115%">']
		conditionHtml.push('	<div class="span1">')
		conditionHtml.push('		<input type="hidden" name="conditionId" />');
		conditionHtml.push('		<span class="cell-RlStdType"></span>');
		conditionHtml.push('	</div>');
		conditionHtml.push(' 	<div class="span2 field-ctrl">');
		conditionHtml.push('		<input name_value = "prop_field_html"/>' );
		conditionHtml.push('	</div>');
		conditionHtml.push('    <div class="span2">');
		conditionHtml.push('		<input id="prop_op" type="text" name="prop_op" class="input-height cell-input" style="width:140px"/>');
		conditionHtml.push('	</div>');
		conditionHtml.push('    <div class="span2 field-ctrl">')
		conditionHtml.push('		<input type="text" name="prop_value" class="input-height cursor-pointer" style="width:126px" />');
		conditionHtml.push('	</div>')
		conditionHtml.push('    <span class="span1 field_add" style="display: table-cell;width:126px">');
		conditionHtml.push('		<i class="icon-remove" style="padding:10px"></i>');
		conditionHtml.push('	</span>');
		conditionHtml.push('</div>');
		$appendToEle.append(conditionHtml.join(""));
		that.createPersonTreeF7($appendToEle.find("#" + conditionId + " input[name_value='prop_field_html']"));
		$appendToEle.find("#" + conditionId +' i[class="icon-remove"]').unbind('click').bind('click',function(){
			$(this).closest("div.row_field").remove();
		});
		$appendToEle.find("#" + conditionId +' input[name_value="prop_field_html"]').shrPromptBox("option",{onchange:function(e,value){
			var prop_op_ctrl =  $(this).closest('.row-fluid').find('input[name="prop_op"]');
			var prop_value_ctrl =  $(this).closest('.row-fluid').find('input[name="prop_value"]');
			prop_op_ctrl.wrap("<div style='width:90px'></div>");
			$(this).addClass("input-height");
			if(value.current){
				var type = value.current.type;
				var field = value.current.field;
				$(this).data('fieldValue', value.current);
				$(this).attr("prop_field",field);
				$(this).attr("field_type",type);
				that.buildCompareSelect($.extend(true, {}, value.current, {
					componentId:conditionId,
					comparator : prop_op_ctrl,
					compareVal : prop_value_ctrl
				}));
				if(type == "String"){
					prop_value_ctrl.css("width","126px");
					prop_value_ctrl.attr("placeholder",$.attendmanageI18n.atsCommonUtile.msg17);
				}
				prop_value_ctrl.css("width","90px");
				$(".select_field >div").addClass("search-emp-field");
			}
		}})
	}
	
	/**
	 * 根据数据字段类型创建相应的高级过滤比较方式和比较值
	 * @param {Object} dataTypeInfo
	 */
	that.buildCompareSelect = function(dataTypeInfo){
		var componentId = dataTypeInfo.componentId;
		var type = dataTypeInfo.type;
		var uipk = dataTypeInfo.uipk;
		var enumSource = dataTypeInfo.enumSource;
		var comparator = dataTypeInfo.comparator;
		var compareVal = dataTypeInfo.compareVal;
		if(that.hasContent(enumSource)){
			$(this).attr("enumSource",enumSource);
		}
		if(type == "Date" || type == "TimeStamp"){
			that.createNumRangeSelect(comparator)
			compareVal && compareVal.shrDateTimePicker({id : componentId,ctrlType:type,isAutoTimeZoneTrans:false});
		}
		if(type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int"){
			that.createNumRangeSelect(comparator)
		}
		if(type == "StringEnum" || type == "IntEnum"){
			that.createIsEqualSelect(comparator)
			compareVal && compareVal.shrSelect({id : componentId,enumSource : enumSource});
		}
		if(type == "Boolean"){
			that.createIsEqualSelect(comparator)
			compareVal && that.createBooleanSelect(compareVal);
		}
		if(type == "String"){
			that.createStrRangeSelect(comparator);
		}
		if(compareVal && that.hasContent(uipk)){
			var f7FieldName = dataTypeInfo.f7FieldName;
			var f7Json = {id:componentId,name:"prop_value"};
			f7FieldName && (f7Json.displayFormat = "{"+f7FieldName+"}");
			f7Json.subWidgetName = 'shrPromptGrid';
			f7Json.subWidgetOptions = {title:dataTypeInfo.name,uipk:uipk,multiselect:true};
			compareVal.shrPromptBox(f7Json);
			compareVal.unbind("keydown.shrPromptGrid");
			compareVal.unbind("keyup.shrPromptGrid");
			compareVal.attr("placeholder","");
			compareVal.attr("uipk",uipk);
		}
		compareVal && comparator.shrSelect("option",{onChange:function(e,value){
			$(this).parents(".ui-select-frame").removeClass("oe_focused");
			compareVal.focus();
			if(type == "Boolean" || type == "StringEnum" || type == "IntEnum"){
				compareVal.shrSelect("selectClick");
			}
		}});
	}
	
	/**
	 * 获取$containerEle内部所有高级过滤条件
	 * @param {Object} $containerEle
	 */
	that.getCompareSelectVals = function($containerEle){
		var compareSelectResults = [];
		var selectResult;
		!$containerEle && ($containerEle = $(document));
		$containerEle.find("div[name=condition_item]").each(function(){
			selectResult = that.getCompareSelectVal(this.id);
			selectResult && compareSelectResults.push(selectResult);
		})
		return compareSelectResults;
	}
	
	/**
	 * 获取指定高级过滤条件
	 * @param {Object} conditionId
	 */
	that.getCompareSelectVal = function(conditionId){
		var conditionContainer = $('#'+conditionId);
		var conditionEle = conditionContainer.find("input[id = 'prop_field']");
		if(!that.hasContent(conditionEle.val())){
			return;
		}
		var value = conditionContainer.find("input[name = 'prop_value_el']").val();
		var valueLabel = conditionContainer.find("input[name = 'prop_value']").val();
		return {
			name : conditionEle.attr('prop_field'),
			type : conditionEle.attr('field_type'),
			label : conditionEle.attr('title'),
			enumSource : conditionEle.attr('enumSource'),
			compareType : conditionContainer.find("input[name = 'prop_op_el']").val(),
			compareTypeLabel : conditionContainer.find("input[name = 'prop_op']").val(),
			uipk :conditionContainer.find("input[name = 'prop_value']").attr('uipk'),
			valueLabel : valueLabel,
			value : that.hasContent(value) ? value : valueLabel
		};
	}
	
	that.createPersonTreeF7 = function($selector){
		var personTree = that.getAtsCache("common.personTree");
		if(!personTree){
			shr.remoteCall({
				type:"post",
				method:"getPersonDynamicList",
				param:{handler:"com.kingdee.shr.ats.web.handler.AtsCommonHandler"},
				success:function(response){
					var personTree = {id:"prop_field",name:"prop_field"};
					personTree.subWidgetName = 'shrPromptTree';
					personTree.subWidgetOptions = {
						treeSettings:{},
						width:250,
						zNodes : response
					};
					$selector.shrPromptBox(personTree);
					that.saveToAtsCache("common.personTree",personTree)
				}
			});
		}else{
			$selector.shrPromptBox(personTree);
		}
	}
	
	that.createIsEqualSelect = function($selector){
		that.createSelect($selector,{
			id : "prop_op",
			data : [
						{value:"=",alias:$.attendmanageI18n.atsCommonUtile.equal},
						{value:"<>",alias:$.attendmanageI18n.atsCommonUtile.not_equal}
					]
		})
	}
	
	that.createBooleanSelect = function($selector){
		that.createSelect($selector,{
			id : "prop_op",
			data : [
						{value:"1",alias:$.attendmanageI18n.atsCommonUtile.yes},
					    {value:"0",alias:$.attendmanageI18n.atsCommonUtile.no}
					]
		})
	}
	
	that.createNumRangeSelect = function($selector){
		that.createSelect($selector,{
			id : "prop_op",
			data : [
						{value:"=",alias:$.attendmanageI18n.atsCommonUtile.equal},
                    	{value:"<>",alias:$.attendmanageI18n.atsCommonUtile.not_equal},
                   	 	{value:">",alias:$.attendmanageI18n.atsCommonUtile.gt},
                    	{value:"<",alias:$.attendmanageI18n.atsCommonUtile.lt},
                    	{value:">=",alias:$.attendmanageI18n.atsCommonUtile.gt_or_eq},
                    	{value:"<=",alias:$.attendmanageI18n.atsCommonUtile.lt_or_eq}
            		]
		})
	}
	
	
	that.createStrRangeSelect = function($selector){
		that.createSelect($selector,{
			id : "prop_op",
			data : [
						{value:"like",alias:$.attendmanageI18n.atsCommonUtile.like},
                    	{value:"not like",alias:$.attendmanageI18n.atsCommonUtile.not_like},
						{value:"=",alias:$.attendmanageI18n.atsCommonUtile.equal},
                    	{value:"<>",alias:$.attendmanageI18n.atsCommonUtile.not_equal},
                   	 	{value:">",alias:$.attendmanageI18n.atsCommonUtile.gt},
                    	{value:"<",alias:$.attendmanageI18n.atsCommonUtile.lt}
            		]
		})
	}
	

	/**
	 * 创建下拉框
	 * configure = {id: "holidayHandle",readonly: "",value: "POSTPONE", onChange: null,validate: "{required:true}",filter: ""};
	 * configure.data = [{value: "POSTPONE",alias: "顺延"}]
	 * @param {Object} element
	 * @param {Object} configure
	 */
	that.createSelect = function(targetObj, configure) {
		if(!configure || !configure.data || configure.data.length == 0) {
			that.showError($.attendmanageI18n.atsCommonUtile.msg18);
			console.info($.attendmanageI18n.atsCommonUtile.msg19);
			console.info(configure);
			return;
		}!configure.id && (configure.id = new date().toLocaleString());
		!configure.value && (configure.value = configure.data[0].value);
		!configure.filter && (configure.filter = "");
		!configure.readonly && (configure.readonly = "");
		!configure.onChange && (configure.onChange = null);
		targetObj.shrSelect(configure);
	}
	
	that.createHolidayHandleSelect = function(targetObj){
		var segment = {
			id: "holidayHandle",
			validate: "{required:true}",
			data : [{
				value: "postpone",
				alias: $.attendmanageI18n.atsCommonUtile.alias27
			},
			{
				value: "replace",
				alias: $.attendmanageI18n.atsCommonUtile.alias28
			},
			{
				value: "unprocess",
				alias: $.attendmanageI18n.atsCommonUtile.alias29
			}]
		};
		that.createSelect(targetObj,segment);
		setTimeout(function(){
			var explain = [];
			explain.push('<div id="popTips_postpone" class="popTips">' 
					+ $.attendmanageI18n.atsCommonUtile.text1 
					+ '</div>');
			explain.push('<div id="popTips_replace" class="popTips">' 
					+ $.attendmanageI18n.atsCommonUtile.text2
					+ '</div>');
			explain.push('<div id="popTips_unprocess" class="popTips">' 
					+ $.attendmanageI18n.atsCommonUtile.text3
					+ '</div>');
			//获取div的位置
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
		},1000)
	}
	/**
	 * 给jqEle添加提升信息
	 * @param {Object} jqEle
	 * @param {Object} tips
	 */
	that.createTips = function(jqEle,tips){
		var tipEle = $('<span id="tipEle"></span>');
		var tipMark = $('<span style="font-size: 12px;font-weight: 500;"  class="more">?</span>');
		var tipContent = $('<span class="tips" style="display:none">' + tips + '</span>');
		tipMark.append(tipContent);
		tipEle.append(tipMark);
		jqEle.append(tipEle);
		tipMark.mouseover(function(){
			tipContent.show()
		});
		tipMark.mouseleave(function(){
			tipContent.hide();
		});
	}
	
	that.createShiftSegSelect = function(targetObj,defaultVal){
		var segment = {
			id: "shiftSegment",
			validate: "{required:true}",
			value:defaultVal,
			data : [{
				value: workShiftConst.SHIFT_SEGMENT_ONE,
				alias: $.attendmanageI18n.atsCommonUtile.alias30
			},
			{
				value: workShiftConst.SHIFT_SEGMENT_TWO,
				alias: $.attendmanageI18n.atsCommonUtile.alias31
			},
			{
				value: workShiftConst.SHIFT_SEGMENT_THREE,
				alias: $.attendmanageI18n.atsCommonUtile.alias32
			}]
		};
		atsCommonUtile.createSelect(targetObj,segment);
	}
	
	that.createDateSelect = function(targetObj,configure){
		var segment = {
			id: configure.id || "dateSelecteId",
			validate: "{required:true}",
			value:configure.defaultVal,
			data : that.getDateSelectRange(configure.needDateValue)
		};
		atsCommonUtile.createSelect(targetObj,segment);
	}
	
	that.httpRequest = function(params){
		var ajaxParams = $.extend(true, {}, params);
		if(!params.success){
			params.success = function(serverData){
				console.info(serverData);
			}
		}
		ajaxParams.success = function(serverData) {
			if(!serverData){
				reutrn;
			}
			if(serverData.success) {
				serverData.rows && typeof params.success == "function" && params.success.call(this,serverData.rows);
			}else{
				if(params.falseProcess && params.falseProcess == "function" ){
					serverData.rows && params.falseProcess .call(this,serverData.rows);
				}else{
					serverData.rows && typeof params.success == "function" && params.success.call(this,serverData.rows);
				}
			}
			if(serverData.errorMsg) {
				if(params.errorMsgProcess && typeof params.errorMsgProcess == "function"){
					params.errorMsgProcess.call(params.scope || this,serverData.errorMsg);
				}else{
					atsCommonUtile.showError(serverData.errorMsg,null,serverData.errorMsg);
				}
				
			}
		}
		if(ajaxParams.data && ajaxParams.data.stringify !== false){
			for(var property in ajaxParams.data){
				if(typeof ajaxParams.data[property] === "object"){
					ajaxParams.data[property] = JSON.stringify(ajaxParams.data[property]);
				}
			}
		}
		shr.doAjax(ajaxParams);
	}
	
	$.widget("ui.atsDetailTips",$.ui.shrDetailTips, {
		_addStateAndRusultToGrid : function (colNames, colModel){
            return {
                colNames: colNames,
                colModel: colModel
            };
        },
	});
	
	that.showMessageTips = function(selector,messageConfig){
		selector.shrMessageTips({
			isSuccess: messageConfig.failureCount == 0,
			successCount: messageConfig.successCount,
			failureCount: messageConfig.failureCount,
			confirmCallback: function () {
				selector.atsDetailTips({
					tableData: messageConfig.tableData,
					successCount: messageConfig.successCount,
					failureCount: messageConfig.failureCount,
					colNamesData: messageConfig.tableModel,
					isSortable : true,
					modalWidth: messageConfig.modalWidth || ''
				}).atsDetailTips("open");					
			},
		
			closeCallback: function () {
				typeof messageConfig.closeCallback == "function" && messageConfig.closeCallback.call(messageConfig.scope || this);
			}
		}).shrMessageTips("open");
		if(messageConfig.failureCount == 0){
			setTimeout(function(){
				that.disableMessageTips(selector);
			},50);
		}
	}
	
	that.disableMessageTips = function(selector){
		//selector.shrMessageTips("_setDetailDisable");
		var detailBtn = $("#message-tips").find("p#tips-detail button.detail");
		detailBtn.addClass("disabled");
		detailBtn.unbind();
	}

	that.showInfo = function(message, hideAfter, consoleData) {
		var hideAfterCla = hideAfter ? hideAfter : 2;
		hideAfterCla = Math.max(Math.ceil(message.length / 2), hideAfterCla);
		shr.showInfo({
			message: message,
			hideAfter: hideAfter || hideAfterCla
		});
		if(consoleData) {
			console.log(message);
			console.log(consoleData);
		}
	}

	that.showSuccess = function(message, hideAfter, consoleData) {
		var hideAfterCla = hideAfter ? hideAfter : 2;
		hideAfterCla = Math.max(Math.ceil(message.length / 2), hideAfterCla);
		shr.showSuccess({
			message: message,
			hideAfter: hideAfter || hideAfterCla
		});
		if(consoleData) {
			console.log(message);
			console.log(consoleData);
		}
	}

	that.showWarning = function(message, hideAfter, consoleData) {
		var hideAfterCla = hideAfter ? hideAfter : 2;
		hideAfterCla = Math.max(Math.ceil(message.length / 2), hideAfterCla);
		shr.showWarning({
			message: message,
			hideAfter: hideAfter || hideAfterCla
		});
		if(consoleData) {
			console.log(message);
			console.log(consoleData);
		}
	}

	that.showError = function(message, hideAfter, consoleData) {
		var hideAfterCla = hideAfter ? hideAfter : 2;
		hideAfterCla = Math.max(Math.ceil(message.length / 2), hideAfterCla);
		shr.showError({
			message: message,
			hideAfter: hideAfter || hideAfterCla
		});
		if(consoleData) {
			console.log(message);
			console.log(consoleData);
		}
	}
	
	that.showConfirm = function(message, action, cancel, args){
		return shr.showConfirm(message, action, cancel, args);
	}
	
	that.generateSearchConditionsByUrl = function(atsComponent,triggerField){
		if(!atsComponent){
			return;
		}
		//["billId","proposer.name","proposer.number"]
		var billObj = shr.getUrlRequestParam("billObj");
		if(!billObj){
			return;
		}
		triggerField = triggerField || billObj.triggerField || "proposer.number";
		atsComponent.billObj = JSON.parse(decodeURIComponent(billObj));
		if($(".oe_searchview .relative .typeahead li").length == 0){
			var fields = that.getQuickSearchFields();
			for(var i=0;i<fields.length;i++){
				$(".oe_searchview").find(".typeahead").append("<li class name='"+fields[i].columnName+"' text='"+fields[i].label+"'><a href='javascript:void(0)'>"
					+ $.attendmanageI18n.atsCommonUtile.text4
					+ "  "+fields[i].label+": <strong title=''></strong></a></li>");
			}
		}
		$(".oe_searchview .relative .typeahead li").each(function(ind,ele){
			$(ele).find("strong").html(atsComponent.billObj[$(ele).attr("name")]);
			$(ele).attr("name")== triggerField  && setTimeout(function(){
				$(ele).click();
				$(".oe_searchview_facets .oe_searchview_facet .oe_facet_remove").on("click",function(){
					delete atsComponent.billObj;
					atsComponent.billId = "";
				});
			})
		})
		if(!$(".filter-containers").is(":hidden")){
			$("#filter-slideToggle").click();
		}
	}

	that.getQuickSearchFields = function(){
		var fields = $("#searcher").shrSearchBar('option', 'fields');
		if(!fields || fields.length == 0){
			var uipk = $("#searcher").shrSearchBar('option', 'uipk');
			if(!uipk){
				console.error("initial default search conditions faild!")
				return;
			}
			$.ajax({
				url: shr.getContextPath()+"/promptF7.do?method=getQuickSearch",
				data: {
					uipk : uipk
				},
				async: false,
				success: function(data) {
					if(data.length!=0){
						fields = data;
					}
				}
	    	});
		}
		return fields;
	}
}

var atsCommonUtile = getTop().atsCommonUtile
if(!atsCommonUtile){
	getTop().atsCommonUtile = atsCommonUtile = new AtsCommonUtile();
}
/**
 * 数组工具类
 */
function AtsArrayUtile() {
	var that = this;
	that.name = "ArrayUtile";

	/**
	 * 将数组转换为对象
	 * @param {Object} arr 待转换数组
	 * @param {Object} keyField  转换为对象的关键字
	 * @param {Object} valueField  转换为对象字段的值,不传入时为整个数组元素
	 * var person = [{name:"jone",age：12},{name:"anni",age:1}]
	 * 例如： AtsArrayUtile.toObj(person,"name","age")
	 * 其结果为：{jone:12,anni:13}
	 */
	that.toObj = function(arr, keyField, valueField) {
		if(!that.isArray(arr)) {
			return arr;
		}
		var returnObj = {};
		if(typeof keyField === "function"){
			arr.forEach(function(value) {
				keyField(value,returnObj);
			})
			return returnObj;
		}
		arr.forEach(function(value) {
			if(value && typeof value == "object") {
				returnObj[value[keyField]] = valueField ? value[valueField] : value;
			}
		})
		return returnObj;
	}

	/**
	 * 去重
	 * @param {Object} arr 待去重数组
	 * @param {Object} keyField 判断相等的关键字或者函数
	 * 去重关键字，存在时其相等即认为
	 * 两个元素重复，不存在时要整个元素相等才算重复,如果keyField为函数，则
	 * 根据两个元素通过它后返回true即认为相等
	 */
	that.deleteRepeat = function(arr, keyField) {
		if(!that.isArray(arr)) {
			return arr;
		}
		var returnArr = [];
		arr.forEach(function(value) {
			if(that.indexOf(returnArr, value, keyField) == -1) {
				returnArr.push(value);
			}
		})
		return returnArr;
	}
	
	that.deleteRepeatAndNull = function(arr, keyField) {
		if(!that.isArray(arr)) {
			return arr;
		}
		var returnArr = [];
		arr.forEach(function(value) {
			if((value || value === 0 || value === false) && that.indexOf(returnArr, value, keyField) == -1) {
				returnArr.push(value);
			}
		})
		return returnArr;
	}

	/**
	 * 获取对应元素在数组中的下标，可用于存在判断
	 * @param {Object} arr 源数组
	 * @param {Object} element 待寻找下标的关键字
	 * @param {Object} keyField  判断相等的关键字或者函数
	 * keyField存在时，元素的keyField值相等即认为相等，如果它是函数，
	 * 当两个元素通过它的计算得到true即认为相等，
	 * 不存在时直接用不严格等号"=="判断相等
	 */
	that.indexOf = function(arr, element, keyField) {
		if(!that.isArray(arr)) {
			return arr;
		}
		if(!keyField) {
			for(var i = 0; i < arr.length; i++) {
				if(arr[i] == element) {
					return i;
				}
			}
			return -1
		}
		var isFunction = typeof keyField == "function";
		for(var i = 0; i < arr.length; i++) {
			if(isFunction && keyField(arr[i], element)) {
				return i;
			} else if(arr[i][keyField] == element[keyField]) {
				return i;
			}
		}
		return -1;
	}
	
	that.contains = function(arr, element, keyField){
		return that.indexOf(arr, element, keyField) != -1;
	}
	
	that.hasElement = function(arr){
		if(!that.isArray(arr)){
			return false;
		}
		return arr.length > 0;
	}


	/**
	 * 获取两个数组的不含重复数据的交集
	 * @param {Object} arr1
	 * @param {Object} arr2
	 */
	that.getIntersection = function(arr1, arr2) {
		if(!that.isArray(arr1) || !that.isArray(arr1)) {
			return [];
		}
		var intersection = [];
		arr1.forEach(function(value) {
			if(that.indexOf(arr2, value) > -1 && that.indexOf(intersection, value) == -1) {
				intersection.push(value);
			}
		})
		return intersection;
	}

	/**
	 * 判断两个数组是否相等
	 * @param {Object} arr1
	 * @param {Object} arr2
	 */
	that.isEqual = function(arr1, arr2) {
		if(!that.isArray(arr1) || !that.isArray(arr1)) {
			return;
		}
		if(arr1.length != arr2.length) {
			return false;
		}
		return that.getIntersection().length == arr1.length;
	}

	/**
	 * 判断obj是否为数组
	 * @param {Object} obj
	 */
	that.isArray = function(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}
}

var atsArrayUtile = getTop().atsArrayUtile
if(!atsArrayUtile){
	getTop().atsArrayUtile = atsArrayUtile = new AtsArrayUtile();
}

/**
 * 全局数据临时传送器，可以供子父窗口parent或opener之间传送数据
 * 数据在存储最大时间{_maxRemainTime}后即会被清楚
 */
function AtsGlobalDataCarrier() {

	var that = this;
	var _key = "ATS_GOLBALD_DATA_CARRIER";
	var _maxRemainTime = 60 * 1000;

	/**
	 * 通过关键字key获取对应的临时传送值
	 * @param {Object} key  传送关键字
	 */
	that.getData = function(key) {
		var golbalData = _getData();
		_clearInvalidateData(golbalData);
		var returnData = golbalData[key] ? golbalData[key].data : undefined;
		delete golbalData[key];
		_saveData();
		return returnData;
	}

	/**
	 * 将待传送的数据保存到传送器中
	 * @param {Object} key    传送关键字，获取数据还要用它
	 * @param {Object} value  传送值
	 */
	that.setData = function(key, value) {
		var golbalData = _getData();
		if(key || key == 0 || key == false) {
			golbalData[key] = {
				data: value,
				depositTime: new Date().getTime()
			};
			_clearInvalidateData(golbalData);
			_saveData(golbalData);
		}
	}
	
	var _saveData = function(globalDatas){
		getTop().sessionStorage.setItem(_key,JSON.stringify(globalDatas || {}));
	}
	
	var _getData = function(){
		return JSON.parse(getTop().sessionStorage.getItem(_key)) || {};
	}

	var _clearInvalidateData = function(globalData) {
		var nowTime = new Date().getTime();
		for(var key in globalData) {
			if(!globalData[key] || nowTime - globalData[key].depositTime > _maxRemainTime) {
				delete globalData[key];
			}
		}
	}
}

var atsGlobalDataCarrier = getTop().atsGlobalDataCarrier
if(!atsGlobalDataCarrier){
	getTop().atsGlobalDataCarrier = atsGlobalDataCarrier = new AtsGlobalDataCarrier();
}

//子窗口注册getTop().registCompoment(window);
getTop().registCompoment = function(pointWindow) {
	var _top = getTop();
	for(var property in _top) {
		if(property.substr(0, 3).toLowerCase() == "ats") {
			pointWindow[property] = _top[property];
		}
	}
}
