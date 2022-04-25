shr.defineClass("shr.ats.AttendanceProjectEdit", shr.ats.AtsMaintainBasicItemEdit, {
	
      
      
      initalizeDOM:function(){
		shr.ats.AttendanceProjectEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		that.setDecimalDigitState();
		that.initDefaultValue();
		that.addChange();
		that.setAttenceProjectCategory();
		that.setReadOnly();
		//that.ShowInAttendance();
		that.valueIsdisable();
		//系统内置的项目类别不让编辑
		if(that.getOperateState()=='EDIT' && $("#isInternal_el").val()=="1")
		{
			that.getField('projectCategory').shrPromptBox("disable");
		}
		//将数据类型的逻辑类型去掉
		$("#dataType_down li").eq(3).css('display','none');
		
		//$("#isDisplay_down > li").each(function(){
		//			if($(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_0||$(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_2){
		//				$(this).css('display','none');
		//			}
		//			else{
		//				$(this).css('display','block');
		//			}	
		
	  },
	  
	  valueIsdisable : function(){
	  if($("#isShowInAttendance").shrCheckbox("getValue") == false){
			$("#attendanceValue").shrSelect("disable");
		  	$("#attendanceIndex").shrTextField("disable");	
	  }
	  		
	  		$("#isShowInAttendance").change(function(){
	  		    if($("#isShowInAttendance").shrCheckbox("getValue") == false){
	  			
		  			$("#attendanceValue").shrSelect("disable");
		  			$("#attendanceIndex").shrTextField("disable");	
	  		}else{
		  			$("#attendanceValue").parents(".field-basis1").show();
					$("#attendanceIndex").parents(".field-basis1").show();
			  		$("#attendanceValue").shrSelect("enable");
			  		$("#attendanceIndex").shrTextField("enable");
	  		}	
	  			
	  			
	  		});
	  		
	  },
	  //设置小数位数状态
	  setDecimalDigitState:function(){
	  	var that = this ;
	  	if (that.getOperateState() != 'VIEW') {
	  		
	  		var value = $("#dataType_el").val();
	  		if (value == 2) {
	  			this.getField('decimalDigit').shrTextField("enable");//实数启用
	  		}else{
	  			this.getField('decimalDigit').shrTextField("disable");
	  		}
		  	
		  	$("#dataType").change(function(){
		  		//这里需要用that才可以
		  		var dataTypeValue = $("#dataType_el").val();
				if(dataTypeValue == 1 || dataTypeValue == 2){
					$("#isShowInAttendance").parents(".field-basis1").show();
					$("#attendanceValue").parents(".field-basis1").show();
					$("#attendanceIndex").parents(".field-basis1").show();
					//$("#attendanceValue").parents(".field-basis1").hide();
					//$("#attendanceIndex").parents(".field-basis1").hide();
					$("#isShowInAttendance").change(function(){
	  				$("#attendanceValue").parents(".field-basis1").show();
					$("#attendanceIndex").parents(".field-basis1").show();
	  			});
				}else{
					$("#isShowInAttendance").parents(".field-basis1").hide();
					$("#attendanceValue").parents(".field-basis1").hide();
					$("#attendanceIndex").parents(".field-basis1").hide();
				}
		  		if (dataTypeValue == 2 ) {//实数
		  			that.getField('decimalDigit').shrTextField("enable");
		  			atsMlUtile.setTransNumValue("decimalDigit",2,{'decimalPrecision':0});
		  		}else{
		  			that.getField('decimalDigit').shrTextField("disable");
		  			atsMlUtile.setTransNumValue("decimalDigit",0,{'decimalPrecision':0});
		  		}
		  	});
	  	}
	  },
	  
	  setAttenceProjectCategory: function(){
	  	if(this.getOperateState() == 'ADDNEW'){
		  	var categoryId = shr.getUrlRequestParam("categoryId");
		  	var categoryName = shr.getUrlRequestParam("categoryName");
		  	var dataValue = {id:categoryId, name:categoryName}
		  	if(categoryId != "" && categoryName !=""){
		  		$('#projectCategory').shrPromptBox("setValue", dataValue);
		  	}
	  	}
	  }
	  
	  ,initDefaultValue : function (){
		  var that = this ;
		  
		  //创建时，项目类型默认：明细计算项目;是否显示默认：明细显示，并屏蔽是否显示中的汇总显示，明细汇总显示两项
		  if(that.getOperateState() == 'ADDNEW'){
			  $("#itemType").val($("#itemType_down li[value=0]").text());
			  $("#itemType_el").val(0);
			  $("#isDisplay").val($("#isDisplay_down li[value=1]").text());
			  $("#isDisplay_el").val(1);
			  $("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_0
						||$(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_2){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
			});
		  }
		  
		  
		  //编辑时，不改变默认值，只对 是否显示中 的项目进行屏蔽
		  if(that.getOperateState() == 'EDIT'){
			    var curValue = $("#itemType_el").val();
			    if (curValue == 0 ) {//明细计算项目
				$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_0
						||$(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_2){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
			}else if (curValue == 1 ){
				$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_3
						||$(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_2){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
			}else {
				$("#isDisplay_down > li").each(function(){
						$(this).css('display','block');
				});
			}
		  }
	  }
	  
	  ,addChange:function(){
    	var that = this ;
		//类型项目
	  	$("#itemType").change(function(){
	  		var curValue = $("#itemType_el").val();
	  		if (curValue == 0 ) {//明细计算项目
				$("#isDisplay").val($("#isDisplay_down li[value=1]").text());
	  			$("#isDisplay_el").val(1);
				$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_0
						||$(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_2){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
	  		}else{
				if(curValue == 1){
					$("#isDisplay").val($("#isDisplay_down li[value=2]").text());
					$("#isDisplay_el").val(2);
					$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_3
						||$(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_2){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
				}else{
					$("#isDisplay").val($("#isDisplay_down li[value=3]").text());
					$("#isDisplay_el").val(3);
					$("#isDisplay_down > li").each(function(){
						$(this).css('display','block');
					});
				}
	  		}
	  	});
		//是否显示
		$("#isDisplay").change(function(){
  		var curValue1 = $("#isDisplay_el").val();
  		if (curValue1 == 1 && $("#itemType_el").val()==1) {//
			$("#isDisplay").val($("#isDisplay_down li[value=2]").text());
  			$("#isDisplay_el").val(2);
  		}
		if (curValue1 == 2 && $("#itemType_el").val()==0) {//
			$("#isDisplay").val($("#isDisplay_down li[value=1]").text());
  			$("#isDisplay_el").val(1);
  		}
		if (curValue1 == 3 && $("#itemType_el").val()==0) {//
			$("#isDisplay").val($("#isDisplay_down li[value=1]").text());
  			$("#isDisplay_el").val(1);
  		}
		if (curValue1 == 3 && $("#itemType_el").val()==1) {//
			$("#isDisplay").val($("#isDisplay_down li[value=2]").text());
  			$("#isDisplay_el").val(2);
  		}
  		});
	  	$("#enable").change(function(){
	 	  if (that.getFieldValue('isInternal') == 2) {
	 			if (that.getFieldValue('enable') == 2) {
	 				//设置为不显示
	 				$("#isDisplay").val($("#isDisplay_down li[value=4]").text());
					$("#isDisplay_el").val(4);
	 			}else{
	 					  		var curValue = $("#itemType_el").val();
	  		if (curValue == 0 ) {//明细计算项目
				$("#isDisplay").val($("#isDisplay_down li[value=1]").text());
	  			$("#isDisplay_el").val(1);
				$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_0
						||$(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_2){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
	  		}else{
				if(curValue == 1){
					$("#isDisplay").val($("#isDisplay_down li[value=2]").text());
					$("#isDisplay_el").val(2);
					$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_3
						||$(this).text()==jsBizMultLan.atsManager_attendanceProjectEdit_i18n_2){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
				}else{
					$("#isDisplay").val($("#isDisplay_down li[value=3]").text());
					$("#isDisplay_el").val(3);
					$("#isDisplay_down > li").each(function(){
						$(this).css('display','block');
					});
				}
	  		}
	 			}
	 	 }
	    })
	 },
		
	 editAction: function() {
		var billId = $("#isInternal").val();
		//if(billId != '1'){
		if(true){
			this.doEdit('edit');
		}else{
			shr.showError({message: jsBizMultLan.atsManager_attendanceProjectEdit_i18n_4, hideAfter: 3});
		}
	 },
		
	 verify:function(){
		var isInternal = this.getFieldValue('isInternal');
	 	if (isInternal == 1 && this.getFieldValue('enable') == 2 ) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_attendanceProjectEdit_i18n_5});
			return false;
	 	}
	 	var name = $("#name").val();
	 	var reg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
	 	/*if(!reg.test(name) && isInternal != 1){
	 		//系统内置项目不校验。
	 	    shr.showError({message: jsBizMultLan.atsManager_attendanceProjectEdit_i18n_1});
	 	    return false;
	 	}*/
		return true;
	 },
	 setReadOnly: function(){
	    var isInternal = $("#isInternal_el").val();
	    if("1" == isInternal){
	       $("#dataType").shrSelect("disable");
	    }
	 }
		  
});





 
