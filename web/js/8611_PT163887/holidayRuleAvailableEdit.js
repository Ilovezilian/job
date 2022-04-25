
shr.defineClass("shr.ats.holidayRuleAvailableEdit", shr.ats.AtsAvailableBasicItemEdit, {
	
	initalizeDOM:function(){
		shr.ats.holidayRuleAvailableEdit.superClass.initalizeDOM.call(this);
		var that = this;
		
		holidayRuleEditObject = shr.createObject(shr.ats.HolidayRuleEdit);
		holidayRuleEditObject.operateState =this.getOperateState() ;
		holidayRuleEditObject.initHolidayDom();  
		that.setFieldDisable();
		
	},
	
	setFieldDisable:function(){
		
	
		if(this.getOperateState()=="EDIT"){
			// 工龄司龄计算规则
			$("input[name='pre']").attr('disabled','disabled');
			$("input[name='next']").attr('disabled','disabled');
			$("input[name='val']").attr('disabled','disabled');
			$("input[name='preCmpType']").shrSelect("disable");
			$("input[name='nextCmpType']").shrSelect("disable");
			$("input[name_value='prop_field_html']").shrPromptBox('disable');
			
			//员工范围
			$("input[name='prop_op']").shrSelect("disable");
			$("input[name='prop_value']").attr('disabled','disabled');
			
			$(".ui-datepicker-frame").addClass('disabled');
			$(".ui-datepicker-icon").empty();
			
			//去掉增加、删除按钮
			$(".icon-remove").hide();
			$(".icon-plus").hide();
			
				//计算标准
			$(".ui-select-frame").addClass('disabled');
			//$("#holidayRlStdType").shrSelect("disable");
			
			//$("#holidayRlStdType").attr("disabled", true);
			
				setTimeout(function(){
				 $("#holidayRlStdType").shrSelect("disable");
				}, 500 );
        //	this.frame.addClass("disabled");
			
	/* 		$("#holidayRlStdType").attr('disabled','disabled');
			$(".ui-select-icon").empty(); */
			
		}

		
	}
});	