var margin_left = 10 + 5;
shr.defineClass("shr.ats.takeWorkingEdit", shr.ats.AtsMaintainBasicItemEdit, {
	initalizeDOM:function(){
		var that = this;
		shr.ats.takeWorkingEdit.superClass.initalizeDOM.call(this);
		that.selfDefineOTConPri();//改一下请调休假扣减优先级的样式
		//当视图是VIEW状态时
		if(that.getOperateState()=="VIEW"){
			that.setViewView();
		}
		else{
			that.setEditView();
		}
		that.setButtonVisable();
		that.addSelectedEvent();
		that.initF7Color();
		that.myExtendValidate();
		/*新增调休规则时，设置默认值计算器、调休扣减优先顺序*/
		if(that.getOperateState()=="ADDNEW"){
			var ruleNum = atsMlUtile.getFieldOriginalValue('number');
			if(ruleNum==''){
				that.setDefaultValue();
			}
		}
		/*当调休单位转换方式是“按排班标准工时转换”，隐藏...*/
		if(that.getOperateState()!="VIEW"){
			that.unitConvertRuleChangeEvent();
			that.setUnitConvertRuleChangeEvent();
		}
		that.addWarning();
	},cancelAction:function(){
			this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsTakeWorking.list'
			});	
	}
	,selfDefineOTConPri : function(){
		if(this.getOperateState()!="VIEW"){
			var options =  [];
			for(var i=1; i<=3; i++){
				options.push({value:i,alias:jsBizMultLan.atsManager_takeWorkingEdit_i18n_3+i});
			}
			var fcp = $("#firstConsumePriority").shrSelect("getValue").value;
			$("#firstConsumePriority").shrSelect("clearOptions");//清空下拉选项，自己填值
			$("#firstConsumePriority").shrSelect("addOption",options);
			$("#firstConsumePriority").val(jsBizMultLan.atsManager_takeWorkingEdit_i18n_3+ fcp);
			$("#firstConsumePriority_el").val(fcp);
			$("[for]").eq(0).hide();

			var scp = $("#secondConsumePriority").shrSelect("getValue").value;
			$("#secondConsumePriority").shrSelect("clearOptions");//清空下拉选项，自己填值
			$("#secondConsumePriority").shrSelect("addOption",options);
			$("#secondConsumePriority").val(jsBizMultLan.atsManager_takeWorkingEdit_i18n_3+ scp);
			$("#secondConsumePriority_el").val(scp);
			$("[for]").eq(1).hide();

			var tcp = $("#thirdConsumePriority").shrSelect("getValue").value;
			$("#thirdConsumePriority").shrSelect("clearOptions");//清空下拉选项，自己填值
			$("#thirdConsumePriority").shrSelect("addOption",options);
			$("#thirdConsumePriority").val(jsBizMultLan.atsManager_takeWorkingEdit_i18n_3+ tcp);
			$("#thirdConsumePriority_el").val(tcp);
			$("[for]").eq(2).hide();

		}else{
			$("#firstConsumePriority").text(jsBizMultLan.atsManager_takeWorkingEdit_i18n_3+$("#firstConsumePriority").val());
			$("#secondConsumePriority").text(jsBizMultLan.atsManager_takeWorkingEdit_i18n_3+$("#secondConsumePriority").val());
			$("#thirdConsumePriority").text(jsBizMultLan.atsManager_takeWorkingEdit_i18n_3+$("#thirdConsumePriority").val());
		}
	}
	//设置新建的调休规则部分字段的默认值
	,setDefaultValue: function(){
		$("#takeWorkSource").val(jsBizMultLan.atsManager_takeWorkingEdit_i18n_8);
		$("#takeWorkSource_el").val('1');
		$("#unitConvertRule").val(jsBizMultLan.atsManager_takeWorkingEdit_i18n_2);
		$("#unitConvertRule_el").val('1');
		$("#firstConsumePriority").val(jsBizMultLan.atsManager_takeWorkingEdit_i18n_6);
		$("#firstConsumePriority_el").val('3');
		$("#secondConsumePriority").val(jsBizMultLan.atsManager_takeWorkingEdit_i18n_5);
		$("#secondConsumePriority_el").val('2');
		$("#thirdConsumePriority").val(jsBizMultLan.atsManager_takeWorkingEdit_i18n_4);
		$("#thirdConsumePriority_el").val('1');
		atsMlUtile.setTransNumValue("fixedHour",'8');
	}
	//温馨提示
	,addWarning: function() {
		var that = this;
		//不要出现多个“温馨提示”
		if($('#warning').length < 1){
			$('#description').parent().parent().parent().parent().after('<div style="color: red;">'
				+'<div>'
				+'<div id="warning" title="'
				+ jsBizMultLan.atsManager_takeWorkingEdit_i18n_14
				+ '" style="padding-left:70px; padding-right:100px; padding-top:20px; padding-bottom:20px;">'
				+jsBizMultLan.atsManager_takeWorkingEdit_i18n_0
				+jsBizMultLan.atsManager_takeWorkingEdit_i18n_1
				+ '</div></div></div>');
		}
	}
	,setUnitConvertRuleChangeEvent: function(){
		$('#unitConvertRule').bind('change',function(){
			if($('#unitConvertRule').val()
				==jsBizMultLan.atsManager_takeWorkingEdit_i18n_2){
				$("#fixedHour").attr("validate","{required:false,myPosValueVldt:false}");
				$('#fixedHour').closest('div[data-ctrlrole="labelContainer"]').hide();
			}else{//按固定值转换时
				$('#fixedHour').closest('div[data-ctrlrole="labelContainer"]').show();
				$("#fixedHour").attr("validate","{maxlength:3,required:true,myPosValueVldt:true}");
			}
		});
	}
	,unitConvertRuleChangeEvent: function(){
		if($('#unitConvertRule').val()
			==jsBizMultLan.atsManager_takeWorkingEdit_i18n_2){
			$("#fixedHour").attr("validate","{required:false,myPosValueVldt:false}");
			$('#fixedHour').closest('div[data-ctrlrole="labelContainer"]').hide();
		}else{//按固定值转换时
			$("#fixedHour").attr("validate","{maxlength:3,required:true,myPosValueVldt:true}");
			$('#fixedHour').closest('div[data-ctrlrole="labelContainer"]').show();
		}
	}
	,setViewView: function(){
		$("#description").parent().parent().css("padding-top","20px");
	}
	,setEditView: function(){
		var validate = $('#workDayRate').attr("validate");
		if(validate != null && validate != ""){
			validate = validate.substring(0,validate.length - 1);
		}
		$('#workDayRate').attr("validate",validate == null || validate.trim()=='' ? "myValueVldt:true" :validate+",myValueVldt:true}");
		
		validate = $('#restDayRate').attr("validate");
		if(validate != null && validate != ""){
			validate = validate.substring(0,validate.length - 1);
		}
		$('#restDayRate').attr("validate",validate == null || validate.trim()=='' ? "myValueVldt:true" :validate+",myValueVldt:true}");
		
		validate = $('#legalHolidayRate').attr("validate");
		if(validate != null && validate != ""){
			validate = validate.substring(0,validate.length - 1);
		}
		$('#legalHolidayRate').attr("validate",validate == null || validate.trim()=='' ? "myValueVldt:true" :validate+",myValueVldt:true}");
		

		$("#isDefault").closest(".field-ctrl.flex-c").css("margin-top","10px");
		$("#isSysPreset").closest(".field-ctrl.flex-c").css("margin-top","10px");
		
	}
	
	,myExtendValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {  
    		myTmVldt: jsBizMultLan.atsManager_takeWorkingEdit_i18n_11
		  });  
		  jQuery.validator.addMethod("myTmVldt", function(value, element) {  
	    	   var v=value;
	    	   if(v !== '' && parseInt(v) >= 0){
	    	   	  return true;
	    	   }else{
	    	   	  return false;
	    	   }
		  }, jsBizMultLan.atsManager_takeWorkingEdit_i18n_11);//msg:错误提示文本。已验证
		  
		   jQuery.extend(jQuery.validator.messages, {  
    		myValueVldt: jsBizMultLan.atsManager_takeWorkingEdit_i18n_11
		  }); 
		  
		  jQuery.validator.addMethod("myValueVldt", function(value, element) {  
	    	   var v=value||'';
	    	   if(v != '' && v >= 0){
	    	   	  return true;
	    	   }else{
	    	   	  return false;
	    	   }
		  }, jsBizMultLan.atsManager_takeWorkingEdit_i18n_13);//msg:错误提示文本。已验证
		  
		  $("#delayLength").attr("validate","{maxlength:9,required:true,myTmVldt:true}");

		  jQuery.extend(jQuery.validator.messages, {  
    		myPosValueVldt: jsBizMultLan.atsManager_takeWorkingEdit_i18n_10
		  }); 
		  
		  jQuery.validator.addMethod("myPosValueVldt", function(value, element) {  
	    	   var v=value||'';
	    	   if(v != '' && v > 0){
	    	   	  return true;
	    	   }else{
	    	   	  return false;
	    	   }
		  }, jsBizMultLan.atsManager_takeWorkingEdit_i18n_12);//msg:错误提示文本。已验证
	}
	/*保存前动作*/
	,saveAction:function(even){
		var _self = this;
		if(_self.validate() && _self.verify() && _self.limitConsumePriorityVerify()){
			_self.changeCycleTypeConfirm(even);
		}
	},
	/**
	 * 组装保存时传至服务端的数据
	 */
	assembleSaveData: function(action) {
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		data.method = action;
		data.operateState = _self.getOperateState();
		data.model = shr.toJSON(_self.assembleModel()); 
		
		// relatedFieldId
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		
		
		//复制功能使用
		if($("#breadcrumb.breadcrumb")[0].baseURI){
			var baseUriMethod = $("#breadcrumb.breadcrumb")[0].baseURI.split("method=")[1];
			if(baseUriMethod.startsWith("copy")){
				data.model = data.model.replace(data.billId,"");
				data.billId = "";
			};
		}
		
		return data;
	}
	,changeCycleTypeConfirm : function(even){
		var _self = this;
		var id = $("#id").val();
			if(id != undefined && id != ""){//非新增
				var newCycleType = $("#taskWorkingType_el").val();
				_self.remoteCall({
					method: "changeCycleTypeWarning", 
					param: {id:id, newCycleType:newCycleType},
					success: function(result) {
						if(result != null && result.flag == true){
							shr.showConfirm(result.msg,function(){
								/*执行保存动作 edit.js*/
								_self.doSave(even, 'save');
							});
						}else{
							_self.doSave(even, 'save');
						}
					}
				});
			}else{
				_self.doSave(even, 'save');
			}
	}
	/*校验三个OT优先级是不是各不相同*/
	,limitConsumePriorityVerify:function(){
		var firstConsumePriority = $("#firstConsumePriority_el").val();
		var secondConsumePriority = $("#secondConsumePriority_el").val();
		var thirdConsumePriority = $("#thirdConsumePriority_el").val();
		if(firstConsumePriority == secondConsumePriority || firstConsumePriority == thirdConsumePriority || secondConsumePriority == thirdConsumePriority){
			shr.showError({message: jsBizMultLan.atsManager_takeWorkingEdit_i18n_9});
			return false;
		}
		return true;
	}
	//权限控制-从上级继承过来的调休规则不允许修改
	,setButtonVisable:function(){
		var that = this;
		//var relateOrgUnit = $("#relateOrgUnit").val();
		var relateOrgUnit = $("#hrOrgUnit").val();
		var serviceIdStr = shr.getServiceId();
		that.remoteCall({
			method: "getUserAdminRangeRoot", 
			param: {relateOrgUnitId:relateOrgUnit,serviceId:serviceIdStr},
			success: function(result) {
			   var flag = result.flag;
			   if(flag == false){
			   		$('#edit').hide();
			   }
		    }
		    ,error:function(result)
			{    
			    shr.showInfo({message: jsBizMultLan.atsManager_takeWorkingEdit_i18n_7, hideAfter: 3});
			}
		});
	}
	,addSelectedEvent:function(){
		$("#taskWorkingType").change( function() {
  			if('2' == $("#taskWorkingType_el").val()){
  				$("#attenceCycle").attr("validate","{required:true}");
  				//增加颜色
  				
  				$('#attenceCycle').closest('div[data-ctrlrole="labelContainer"]').show();
  			}
  			else{
  				$("#attenceCycle").val('');
  				$("#attenceCycle_el").val('');
  				$("#attenceCycle").attr("validate","{required:false}");
  				$('#attenceCycle').closest('div[data-ctrlrole="labelContainer"]').hide();
  			}
  			//周期类型变成天,延期日期默认带出1
  			if('3' == $("#taskWorkingType_el").val()){
  				atsMlUtile.setTransNumValue("delayLength",1);
  			}
  			
  			
		});
	}
	,initF7Color: function(){
		var that = this;
		$('#attenceCycle').closest('div[data-ctrlrole="labelContainer"]').hide();
		$("#attenceCycle").parents('.ui-promptBox-layout').eq(0).addClass("required");
		if('2' == $("#taskWorkingType_el").val() || '2' == $("#taskWorkingType").val()){
			$('#attenceCycle').closest('div[data-ctrlrole="labelContainer"]').show();
			$("#attenceCycle").parents('.ui-promptBox-layout').eq(0).addClass("required");
		}
		
	}
});
	
