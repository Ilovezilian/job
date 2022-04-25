shr.defineClass("shr.ats.HolidayPolicyEdit", shr.framework.Edit, {
      initalizeDOM:function(){
		shr.ats.HolidayPolicyEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		
		//移除不必要的标签文本
		//$("#group2-2 div[title='补请假期限单位'],#forDelBlank div[title='周期单位']").parent().remove();
		//$("#group2-2 div div div.span2").attr('class','span4');
		
		$("#group2-1 div div.row-fluid div.field_label").parent().attr('class','span9');
		$("#group2 div.field-desc").remove();
		$("#group2 div div div.row-fluid div.span2").attr('class','span3'); 
		
		that.processF7ChangeEvent();
		
		//默认不可选
		that.defaultDeal();
		
		/*根据$('input[name="enableReplenish"]').shrCheckbox(checkbox_json); 读源码checkbox.js,看清做了什么(如加了css 类)，
		 * 依据这些东西我们来做处理，self.element.on('ifChanged', function(){self.element.change(); }); 此处触发了change事件：
		 *	 在页面$('input[name="enableMinAmt"]').shrCheckbox()创建的对象就是checkbox.js中的self(即this),
		 * 	$('input[name="enableMinAmt"]').shrCheckbox()对$('input[name="enableMinAmt"]')做了shrCheckbox增强/扩展
		 * 	进而self.element就是$('input[name="enableMinAmt"]')
		 */
	     $('#enablePeriod,#enableMinAmt,#isFillHoliday,#isCancelLeave').on('change',function(){
	     	 if($(this).attr('checked')=='checked'){
	     	 	 if($(this).attr('id')=='enablePeriod'){
                     var self1=$('#periodLength');
                     self1.attr("disabled", false);
                     self1.closest(".ui-text-frame").eq(0).removeClass('disabled');
                     var self2=$('#periodLengthUnit');
                     self2.attr("disabled", false);
                     self2.closest(".ui-select-frame").eq(0).removeClass("disabled");
                     self2.parent().next('.ui-select-icon').css("display","table-cell");
	     	     }else if($(this).attr('id')=='enableMinAmt'){
	     	     	 var self1=$('#minAmt');
                     self1.attr("disabled", false);
                     self1.closest(".ui-text-frame").eq(0).removeClass('disabled');
	     	     }else if($(this).attr('id')=='isFillHoliday'){
	     	     	 var self1=$('#fillHolidayAmount');
                     self1.attr("disabled", false);
                     self1.closest(".ui-text-frame").eq(0).removeClass('disabled');
                     var self2=$('#fillHolidayAmountUnit');
                     self2.attr("disabled", false);
                     self2.closest(".ui-select-frame").eq(0).removeClass("disabled");
                     self2.parent().next('.ui-select-icon').css("display","table-cell");
	     	     }else if($(this).attr('id')=='isCancelLeave'){
	     	     	 var self1=$('#cancelLeaveAmount');
                     self1.attr("disabled", false);
                     self1.closest(".ui-text-frame").eq(0).removeClass('disabled');
                     var self2=$('#cancelLeaveAmountUnit');
                     self2.attr("disabled", false);
                     self2.closest(".ui-select-frame").eq(0).removeClass("disabled");
                     self2.parent().next('.ui-select-icon').css("display","table-cell");
	     	     }
	     	 }else{
	     	     if($(this).attr('id')=='enablePeriod'){
	     	     	 var self1=$('#periodLength');
                     self1.attr("disabled", true);
                     self1.closest(".ui-text-frame").eq(0).addClass("disabled");
                     var self2=$('#periodLengthUnit');
                     self2.attr("disabled", true);
                     self2.closest(".ui-select-frame").eq(0).addClass("disabled");
                     self2.parent().next('.ui-select-icon').hide();
	     	     }else if($(this).attr('id')=='enableMinAmt'){
					 var self1=$('#minAmt');
                     self1.attr("disabled", true);
                     self1.closest(".ui-text-frame").eq(0).addClass("disabled");	
	     	     }else if($(this).attr('id')=='isFillHoliday'){
	     	         var self1=$('#fillHolidayAmount');
                     self1.attr("disabled", true);
                     self1.closest(".ui-text-frame").eq(0).addClass("disabled");
                     var self2=$('#fillHolidayAmountUnit');
                     self2.attr("disabled", true);
                     self2.closest(".ui-select-frame").eq(0).addClass("disabled");
                     self2.parent().next('.ui-select-icon').hide();
	     	     }else if($(this).attr('id')=='isCancelLeave'){
	     	         var self1=$('#cancelLeaveAmount');
                     self1.attr("disabled", true);
                     self1.closest(".ui-text-frame").eq(0).addClass("disabled");
                     var self2=$('#cancelLeaveAmountUnit');
                     self2.attr("disabled", true);
                     self2.closest(".ui-select-frame").eq(0).addClass("disabled");
                     self2.parent().next('.ui-select-icon').hide();
	     	     }
	     	 }
	     });
	     /* 以下两个处理，也是可以捕获的$('input[name="enableMinAmt"]').shrCheckbox()对$('input[name="enableMinAmt"]')做了shrCheckbox增强/扩展
	     $('input[name="enableMinAmt"]').shrCheckbox().on('change',function(){
	         alert('aaa123');
	     });
	     $('input[name="enableMinAmt"]').shrCheckbox().on('ifChanged',function(){
	         alert('aaa321');
	     }); 
	     //以下两种也是可以处理变化的
	     $('input[name="enableMinAmt"]').parent().on('ifChanged',function(){
	     	  alert($('#enableMinAmt').attr('checked')||'aa111');
	     });
	     $('input[name="enableMinAmt"]').parent().on('change',function(){
	     	  alert($('#enableMinAmt').attr('checked')||'aa222');
	     });
	     */
	  }
	  ,processF7ChangeEvent : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#holidayType").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					//$("#hldTypNbr").val(info.number); 
					$("#holidayType_number").val(info.number);//@
					$("#name").val(info.name); 
				}
			});
		}
	}
	,defaultDeal:function(){
		if($('#enablePeriod:checked').length>0){
		}else{
	     	 var self1=$('#periodLength');
	         self1.attr("disabled", true);
	         self1.closest(".ui-text-frame").eq(0).addClass("disabled");
	         var self2=$('#periodLengthUnit');
	         self2.attr("disabled", true);
	         self2.closest(".ui-select-frame").eq(0).addClass("disabled");
	         self2.parent().next('.ui-select-icon').hide();
		}
         
		if($('#enableMinAmt:checked').length>0){
		}else{
		 var self1=$('#minAmt');
         self1.attr("disabled", true);
         self1.closest(".ui-text-frame").eq(0).addClass("disabled");	
		}
         
        if($('#isFillHoliday:checked').length>0){
		}else{
	         var self1=$('#fillHolidayAmount');
	         self1.attr("disabled", true);
	         self1.closest(".ui-text-frame").eq(0).addClass("disabled");
	         var self2=$('#fillHolidayAmountUnit');
	         self2.attr("disabled", true);
	         self2.closest(".ui-select-frame").eq(0).addClass("disabled");
	         self2.parent().next('.ui-select-icon').hide();
		}
         
        if($('#isCancelLeave:checked').length>0){
		}else{
	         var self1=$('#cancelLeaveAmount');
	         self1.attr("disabled", true);
	         self1.closest(".ui-text-frame").eq(0).addClass("disabled");
	         var self2=$('#cancelLeaveAmountUnit');
	         self2.attr("disabled", true);
	         self2.closest(".ui-select-frame").eq(0).addClass("disabled");
	         self2.parent().next('.ui-select-icon').hide();
		}
	}
	, /**
	 *重载 保存
	 */
	 saveAction: function(event) {
		var _self = this;
		
		if (_self.validate() && _self.verify()) {	//界面校验通过	
			 _self.doSave(event, 'save');
		}	
	  }
	 ,/**
	 * 编辑
	 */
	editAction: function() {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('#form', workArea);
		var isSysPreset=parseInt( $('#isSysPreset',$form).val());
		if(isSysPreset!=0){
			shr.showWarning({
			  message: jsBizMultLan.atsManager_holidayPolicyEdit_i18n_0
		    });
			return ;
		}
		this.doEdit('edit');
	}
	
});	  


