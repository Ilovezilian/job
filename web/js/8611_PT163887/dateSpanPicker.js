/**
 * shrDateSpanPicker 只供考勤的特殊场景：请假单的请假信息部分 * 
 */
(function( $ ) {
	
	var timeValue = null,
	selectValue = null;
    $.widget( "ui.shrDateSpanPicker", $.ui.shrctrl, {
    	 options: {
    		id: "",
 			readonly: "",
 			value: "",
 			onChange: null,
 			beginOrEnd: "",
 			enumOptions: "",
 			validate: "$"
         },   
    	 _create: function() {
    		 var self = this;
    		 var id = this.element.attr('id');
    		 this.element.attr("ctrlrole", "dateSpanPicker");
    		 
    		 var picker_json = {id: id+"-time"};
    		 picker_json.readonly = self.options.readonly;
			 picker_json.validate = self.options.validate;
			 picker_json.ctrlType = 'Date';
    		 $('#'+id+"-time").shrDateTimePicker(picker_json);	
    		 $('#'+id+"-time").val(self.options.value.split(' ')[0]);
			
    		 var data;
    		 if (self.options.enumOptions) {
    			 data = $.parseJSON(self.options.enumOptions);
    		 } else {
    			 data = $.parseJSON('[{"value": "09:00-12:00", "alias": "'+$.shrI18n.widget.shrDatePicker.title.morning+'"},{"value": "14:00-18:00", "alias": "'+$.shrI18n.widget.shrDatePicker.title.afternoon+'"}]');
    		 }
 
    		 var value = self.options.value.split(' ')[1];
    		 var valueTime;
    		 for(var i=0; i<data.length; i++){
    			 var tempDate = data[i].value;
    			 var beginTime = tempDate.split('-')[0];//8:30
    			 var endTime = tempDate.split('-')[1];//12:30
    			 var beginDate = new Date('2013-8-20 '+ beginTime); //UTC 2013-8-20 8:30
    			 var endDate = new Date('2013-8-20 '+ endTime); //UTC 2013-8-20 12:00
				
    			 var valueDate = new Date('2013-8-20 '+ value); //UTC 2013-8-20 10:00
    			 if(beginDate <= valueDate && valueDate<= endDate){
    				 if(self.options.beginOrEnd === 'begin'){
    					 valueTime = beginTime;
    				 }else if(self.options.beginOrEnd === 'end'){
    					 valueTime = endTime;
    				 }		
    			 }
    		 }
    		  if(self.options.beginOrEnd === 'begin'){
    			 for(var i=0; i<data.length; i++){
    				 data[i].value = data[i].value.split('-')[0];
    				 data[i].alias +=  data[i].value 
    			 }
    		 }else if(self.options.beginOrEnd === 'end'){
    			 for(var i=0; i<data.length; i++){
    				 data[i].value = data[i].value.split('-')[1];
    				 data[i].alias +=  data[i].value 
    			 }
    		 }
			
    		 var select_json = {
				id: id+"-ap",
				readonly: self.options.readonly,
				value: valueTime,
				onChange: null,
				validate: self.options.validate
    		 };
    		 select_json.data = data;
    		 $('#'+id+"-ap").shrSelect(select_json);
    			
    		 $('#'+id+'-time').change(function(){
    			timeValue = $(this).shrDateTimePicker('getValue');
    			if(selectValue!=null && timeValue!=null)
    				self.element.find('.dateSpanPicker').val(timeValue + ' ' + selectValue);
    		 });
    		 
    		 $('#'+id+'-ap').change(function(){
    			 var selectVal = $(this).shrSelect('getValue');
    			 selectValue = selectVal.value;
    			 if(selectValue!=null && timeValue!=null)
    				 self.element.find('.dateSpanPicker').val(timeValue + ' ' + selectValue);
    		 });
    	 },
    	 
    	 destroy: function() {
             $.Widget.prototype.destroy.call( this );
         },

         setValue: function(value, dateFormat){
        	 var val = value.split(' ')[0];
         	if(!dateFormat)
         		dateFormat = 'yyyy-mm-dd';
         	var divider = dateFormat.replace(/[a-zA-Z]/gi, '').substring(0,1);
             var regexp = '^';
             var formatParts = dateFormat.split(divider);
             for(var i=0; i < formatParts.length; i++) {
                 regexp += (i > 0 ? '\\'+divider:'') + '(\\d{'+formatParts[i].length+'})';
             }
             regexp += '$';
             
             var matches = val.match(new RegExp(regexp));
             if (matches === null) {
             	var date = val.split(' ')[0];
         		this.element.val(date);
             }else{
             	this.element.val(val);
             }
             
             value = value.split(' ')[1];
             if(value == null){
         		this.element.prev('input').val(null);
     			this.element.val(null).change();
         	}else{
 	        	var data = this.options.data;
 	        	for(var i= 0, len = data.length; i<len; i++ ){
 	        		if(value == data[i].value){
 	        			this.element.prev('input').val(data[i].value);
 	        			this.element.val(data[i].alias).change();
 	        		}
 	        	}
         	}
         },
         
         disable:function(){
         	this.element.find('#'+this.options.id +'-time').shrDateTimePicker('disable');
         	this.element.find('#'+this.options.id +'-ap').shrSelect('disable');
         },

         enable:function(){
        	this.element.find('#'+this.options.id +'-time').shrDateTimePicker('enable');
          	this.element.find('#'+this.options.id +'-ap').shrSelect('enable');
         },       
         
         getValue: function(){
         	var date = this.element.find('#'+this.options.id +'-time').shrDateTimePicker('getValue');
         	var timeOptions = this.element.find('#'+this.options.id +'-ap').shrSelect('getValue');
         	return date + ' ' + timeOptions.value;
         }
    });
}( jQuery ));