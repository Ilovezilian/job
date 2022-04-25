var atsMlUtile = atsMlUtile || {};



atsMlUtile = $.extend({
	printErrorLog:shr.getUrlRequestParam('debug') == 'false',
	utcData : undefined,
	getFieldOriginalValue: function(fieldName, uuid, context){
		var $element = this.getTargetElement(fieldName, uuid, context);
		if(!$element || $element.length == 0){
			return;
		}
		var returnValue = $element.attr('original-value');
		var isInputEle = $element[0].tagName.toLowerCase() == 'input';
		!returnValue && returnValue !== 0 && returnValue !== false && (returnValue = isInputEle ?  $element.val() : $element.text());
		try{
			if($element.parents('.field-ctrl.flex-c').hasClass('dateWithSelectPicker')){
				returnValue = $element.shrDateWithSelectPicker('getValue');
			}else{
				returnValue = isInputEle ? shr.getFieldValue(fieldName, uuid, context) : $element.shrFieldDisplay("getOriginalValue");
			}
		}catch(e){
		}
		!returnValue && returnValue !== 0 && returnValue !== false && (returnValue = "");
		return returnValue;
	}
	
	,setTransDateTimeValue : function(fieldName,dateTimeStr,ctrlType,isRemoveDay,isRemoveSeconds,uuid, context,utcData){
		var $element = this.getTargetElement(fieldName, uuid, context);
		if(!$element || $element.length == 0){
			return;
		}
		if($element.parents('.field-ctrl.flex-c').hasClass('dateWithSelectPicker')){
			return $element.shrDateWithSelectPicker('setValue',dateTimeStr);
		}
		var role = $element.attr('ctrlrole');
		var handler = {'datetimepicker': 'shrDateTimePicker'};
		if (handler.hasOwnProperty(role)) {
			try{
				return $element[handler[role]]("setValue",dateTimeStr);
			}catch(e){
				console.info(this.printErrorLog ? e : 'setTransDateTimeValue e');
			}
		}
		var userFormatValue = this.dateTimeToUserFormat(dateTimeStr,ctrlType,isRemoveDay,isRemoveSeconds);
		dateTimeStr.split(":").length == 2 && (dateTimeStr += ":00");
		dateTimeStr.split("-").length == 2 && (dateTimeStr = dateTimeStr.replace(" ","-01 "));
		this.setValueByEleType($element,userFormatValue,dateTimeStr);
	}
	
	,setTransDateValue :function(fieldName,dateStr,isRemoveDay){
		return this.setTransDateTimeValue(fieldName,dateStr,"date",isRemoveDay);
	}
	
	,setTransTimeValue :function(fieldName,timeStr,isRemoveSeconds){
		return this.setTransDateTimeValue(fieldName,timeStr,"time",false,isRemoveSeconds);
	}
	
	,setTransNumValue: function(fieldName,numStr,numberOptions,uuid, context){
		var $element = this.getTargetElement(fieldName, uuid, context);
		if(!$element || $element.length == 0){
			return;
		}
		var role = $element.attr('ctrlrole');
		var handler = {'numberField': 'shrNumberField'};
		if (handler.hasOwnProperty(role)) {
			try{
				return $element[handler[role]]("setValue",numStr);
			}catch(e){
				console.info(this.printErrorLog ? e : 'setTransNumValue e');
			}
		}
		var decimalPrecision = this.getSysDecimalPlace();
		var numberOptions = $.extend({'ignoreDecimalFormatter':false,'roundType':'round','decimalPrecision':decimalPrecision},numberOptions);
		var userFormatValue = numberfieldService.format(numStr,numberOptions);
		this.setValueByEleType($element,userFormatValue,numStr,true);
	}
	
	
	,numberToUserFormat :function(numStr,numberOptions){
		var decimalPrecision = this.getSysDecimalPlace();
		var numberOptions = $.extend({'ignoreDecimalFormatter':false,'roundType':'round','decimalPrecision':decimalPrecision},numberOptions || {});
		return numberfieldService.format(numStr,numberOptions);
	}
	
	,setValueByEleType: function($element,userFormatValue,originalValue,enableChangeFn){
		var that = this;
		var isInputEle = $element[0].tagName.toLowerCase() == 'input';
		$element.attr('original-value',originalValue);
		if(isInputEle){
			$element.val(userFormatValue);
			if(enableChangeFn !== false ){
				$element.off('change.atsMlUtile').on('change.atsMlUtile',function(){
					$(this).attr('original-value',that.numberToUserFormat($(this).val()));
				});
				var allChange = $element.data('events');
				var events = allChange.change;
				var mlChange = events && events.length && events.splice(events.length - 1);
				mlChange && events.splice(0,0,mlChange[0]);
				$element.data('events',allChange);
			}
		}else{
			$element.text(userFormatValue);
		}
	}
	
	,getTargetElement : function(fieldName, uuid, context){
		if(fieldName instanceof jQuery){
			return fieldName;
		}
		var targetEle = $(fieldName,context);
		if(targetEle.length){
			return targetEle;
		}
		fieldName = fieldName.charAt(0) == '#' ? fieldName.substr(1) : fieldName;
		var id = shr.getRealId(fieldName, uuid);
		return $('#' + id, context);
	}
	
	,dateTimeToUserFormat : function(dateTimeStr, ctrlType, isRemoveDay, isRemoveSeconds,utcData){
		ctrlType && (ctrlType = ctrlType.toLowerCase());
		ctrlType = 'time' == ctrlType ? 'Time' : 'date' == ctrlType ? 'Date' : "TimeStamp";
		isRemoveDay = isRemoveDay || dateTimeStr.split("-").length == 2;
		isRemoveSeconds = isRemoveSeconds || dateTimeStr.split(":").length == 2;
		var options = this._getUtcData(utcData);
		options = $.extend({},options,{
			ctrlType:ctrlType,
			isShowUTC:false,
			isRemoveDay:isRemoveDay,
			isRemoveSeconds:isRemoveSeconds,
			showTimeZoneForCtrl:false,
			isAutoTimeZoneTrans:false
		});
		var userFormatValue = dateTimePickerService.getUTCClientDate(dateTimeStr,options);
		return userFormatValue;
	}
	
	
	
	,dateToUserFormat :function(dateStr,isRemoveDay){
		return this.dateTimeToUserFormat(dateStr,"date",isRemoveDay);
	}
	
	,timeToUserFormat :function(timeStr,isRemoveSeconds){
		return this.dateTimeToUserFormat(timeStr,"time",null,isRemoveSeconds);
	}
	
	,_getUtcData : function(utcData){
		utcData = utcData || this.utcData || window.utcData;
		if(utcData){
			return utcData;
		}
		var self = this;
		$.ajax({
			type:"get",
			async: false,
			url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsCommonHandler&method=getUtcData",
			success:function(res){
				if(res && res.result == 'success'){
					self.utcData = JSON.parse(res.data);
				}
			},
			error:function(res){
				console.error(res);
			}
		})
		return self.utcData;
	}
		
	,isFunction : function(obj){
		return Object.prototype.toString.call(obj) === '[object Function]';
	}
	,getSysDecimalPlace : function () {
    	var _self = this;
    	var localFixedNum = _self.localFixedNum;
    	if(localFixedNum){
    	    return localFixedNum;
    	}
    	var fixedNum;
    	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsBillBaseEditHandler&method=getDecimalPlace";
    	shr.ajax({
        		type:"post",
        		async:false,
        		url:url,
        		success:function(res){
        			if(res.result == "success"){
                    	fixedNum =  res.data;
                    }
        	    }
        });
        _self.localFixedNum = fixedNum;
    	return fixedNum;
    }

	,removeCellClass : function(grid,cellName,className,rowid){
		var colModel = grid.jqGrid('getGridParam', 'colModel');
		for (var iCol = 0; iCol < colModel.length; iCol++) {
			if (colModel[iCol].name === cellName) {
				var row = grid[0].rows.namedItem(rowid);
				var cell = row.cells[iCol];
				$(cell).removeClass(className);
				break;
			}
		}
	}
});

window.atsMlUtile = atsMlUtile;