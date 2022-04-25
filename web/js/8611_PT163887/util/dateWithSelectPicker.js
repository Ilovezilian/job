
;var shrDateWithSelectPicker = function(select,options){
	var $element = $(select);
	!$(select).length && ['#','.'].forEach(function(value){
		if($(value + select).length > 0){
			$element = $(value + select);
			return;
		}
	})
	if($element.length == 0){
		return $.error( "cannot find element by select: " + select );
	}
	var originalOptions = $element.shrDateTimePicker('option');
	originalOptions.ctrlType = options.selectModel ? 'Date' : options.ctrlType ? options.ctrlType : 'Timestamp';
	$.data($element.get(0),'ui-shrDateWithSelectPicker',null);
	$element.shrDateWithSelectPicker($.extend({},originalOptions,options));
};
$.widget( "ui.shrDateWithSelectPicker", $.ui.shrctrl, {
	
	 options: {
		selectModel:true,
		value: "",
		ctrlType:"",
		isBeginTime : true,
		onchange: null,
		onDateChange:null,
		onSelectChange:null,
		enumOptions: ""
     },
     selectElement:"",
     
	 _init: function() {
		 var self = this;
		 var options = self.options;
		 var curValue = self.options.value || self.element.shrDateTimePicker('getValue');
		 options.value = curValue;
		 options.id = options.id || options.name || self.element.attr('id');
		 options.onChange = function(args){
		 	self.isFn(self.options.onDateChange) && self.options.onDateChange(args);
			self.isFn(self.options.onchange) && self.options.onchange(args);
		 }
		 $.data(self.element,'ui-shrDateWithSelectPicker',null);
		 var fieldCtrlEle = self.element.parents('.field-ctrl.flex-c');
		 self.element.off().appendTo(fieldCtrlEle.empty().removeClass('dateWithSelectPicker')).shrDateTimePicker(options);
		 self.element.parents('.ui-datepicker-frame').css({width:self.options.selectModel ? '65%' : '100%'});
		 self.options.selectModel && self._createSelector(curValue,fieldCtrlEle);
	 },
	 
	 _createSelector:function(curValue,fieldCtrlEle){
	 	 var self = this;
		 var selectDatas = self._formatSelectItem(self.options.enumOptions,true);
		 var selectValue = selectDatas[0] && selectDatas[0].value || '';
		 curValue = curValue && curValue.length > 10 ? curValue.split(' ')[1] : curValue;
		 selectDatas.forEach(function(item){
		 	if(item && item.value == curValue){
		 		selectValue = curValue;
		 	}
		 });
		 
	 	 var selectId = this.element.attr('id') + "_select";
		 fieldCtrlEle.addClass('dateWithSelectPicker').append('<input id="' + selectId + '" />');
		 self.selectElement = $('#' + selectId).off().shrSelect({
			id: selectId,
			name:selectId,
			readonly: self.options.readonly,
			required: self.options.required,
			value: selectValue,
			onChange: function(args){
				self.isFn(self.options.onSelectChange) && self.options.onSelectChange(args);
				self.isFn(self.options.onchange) && self.options.onchange(args);
			},
			data : selectDatas
		 });
		 self.selectElement.parents('.ui-select-frame').css({width:'30%',margin : '-25px 0 0 70%'});
	 }
	 
	 ,addSelectItem : function(items,isInit){
	 	if(!items || !this.options.selectModel){
	 		return;
	 	}
	 	this.selectElement.shrSelect('addOption',this._formatSelectItem(items,isInit));
	 },
	 
	 _formatSelectItem : function(items,isInit){
	 	var self = this;
	 	items = typeof items == "String" ? JSON.parse(enumOptionStr) : items;
	 	if(!items && isInit){
	 		items = [
		    	 	 	{"value": "09:00-12:00", "alias": $.shrI18n.widget.shrDatePicker.title.morning},
		    	 	 	{"value": "14:00-18:00", "alias": $.shrI18n.widget.shrDatePicker.title.afternoon}
	    	 	 	]
	 	}
	 	var enumOptions = [];
	 	if(!items || !$.isArray(items)){
	 		return enumOptions;
	 	}
	 	var curItem;
	 	var curValue;
	 	items.forEach(function(item){
	 		curItem = item.value.split('-');
	 		curValue = !self.options.isBeginTime && curItem[1] ? curItem[1] : curItem[0];
	 		curValue = curValue.length > 5 ? curValue : curValue;
	 		enumOptions.push({value : curValue + ':00',alias : item.alias + ' ' + curValue})
	 	});
	 	return enumOptions;
	 },
	 
	 getSelectItems : function(value){
	 	value = value && value.length > 10 ? value.split(' ')[1] : value;
	 	var allItem = this.selectElement.shrSelect('getData');
	 	var item = allItem ? allItem[0] : null;
	 	item && allItem.forEach(function(itemTemp){
	 		if(itemTemp.value == value){
	 			item = itemTemp;
	 			return;
	 		}
	 	});
	 	return item ? item.value : null;
	 },
	 
	 isFn:function(obj){
	 	return Object.prototype.toString.call(obj)==='[object Function]';
	 },
	 
	 destroy: function() {
         $.Widget.prototype.destroy.call( this );
     },

     setValue: function(value){
     	value = value || '';
    	this.element.shrDateTimePicker('setValue',value);
        this.options.selectModel && this.selectElement.shrSelect('setValue',this.getSelectItems(value));
     },
     
     disable:function(){
     	this.element.shrDateTimePicker('disable');
     	this.options.selectModel && this.selectElement.shrSelect('disable');
     },

     enable:function(){
    	this.element.shrDateTimePicker('enable');
    	this.options.selectModel && this.selectElement.shrSelect('enable');
     },       
     
     getValue: function(){
     	var date = this.element.shrDateTimePicker('getValue');
     	if(!date || !this.options.selectModel){
     		return !date || date.length > 10 ? date : date + ' 00:00:00' ;
     	}
     	var time = this.selectElement.shrSelect('getValue');
     	time = time && time.value;
     	return time ? date + ' ' + time : '';
     }
});