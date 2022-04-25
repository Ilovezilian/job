/*!
 *
 */
;
(function($) {
	$.fn.shrDateYearMonthPicker = function(options) {
		 var self = this;
		 var originalValue = self.attr('value') ;
		 var originalReadonly = self.readonly;
		 var id = this.attr('id');
		 var year_id = id+"-year";
		 var month_id = id + "-month";
		 var curContainer = self.closest('[data-ctrlrole=labelContainer]');
		 $(".field-label",curContainer).attr("title",options.cycleYearLable).text(options.cycleYearLable);
		 self.closest('.field-ctrl').html('<input id = "'+year_id+'" type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/>');
		 var monthEle = curContainer.clone();// 覆盖原来控件
		 $(".field-label",monthEle).attr("title",options.cycleMonthLable).text(options.cycleMonthLable);
		 $("#" + year_id,monthEle).attr("id",month_id).attr("name","MONTH");
		 curContainer.after(monthEle);
		 curContainer.before('<input id=' + id + ' style="display:none">');
		// 给年赋值
	     
		 var curDate = new Date(); // 取当前年  前五年 后十年
         var curDateY = curDate.getFullYear();
         var curDateM = curDate.getMonth()+1;
		var yearValue=[];
		for(var i=curDateY - 5;i<curDateY + 10;i++)
		{
		  yearValue.push({'value':i,'alias':i});
		}	
		  $('#'+year_id).shrSelect({
			id: year_id,
			readonly: originalReadonly,
			value: originalValue ? parseInt(originalValue.substring(0,4)) : curDateY,//@
			onChange: null,
			data : yearValue,
			validate: "{required:false}"
		 });
    		 
	  //给 月 赋值
		var monthValue=[];
		for(var j=1;j<13;j++){
		  monthValue.push({'value':j,'alias':j});
		}
	 	 $('#'+month_id).shrSelect({
			id: month_id,
			readonly: originalReadonly,
			value: originalValue ? parseInt(originalValue.substring(4,6)) : curDateM,//@
			onChange: null,
			data : monthValue,
			validate: "{required:false}"
		  });
		 
         setOriginalVal();
        
         	$('#'+year_id).unbind("change");
        	$('#'+year_id).bind("change",function(){
        		setOriginalVal()
        	});
        	
        	//当子下拉框改变  给主控件赋值
        	$('#'+month_id).unbind("change");
        	$('#'+month_id).bind("change",function(){
				setOriginalVal();
        	});
        	
        	function setOriginalVal(){
        	
        		var showYear = $('#'+year_id).val().toString();
        		var showMonth = $('#'+month_id).val().toString();
				if(showMonth.length==1){
					showMonth = "0"+showMonth;
				}
				$('#' + id ).val(showYear+showMonth);
        	}
	};
		
}(jQuery, window));
