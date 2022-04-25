//变动规则考勤js
shr.defineClass("shr.ats.atsSchedulePlanSetEdit", shr.framework.Edit, {
	initalizeDOM : function () {
		shr.ats.atsSchedulePlanSetEdit.superClass.initalizeDOM.call(this);
		
		if(_self.getOperateState() == 'EDIT'){
			$('#hrOrgUnit').shrPromptBox('disable');
		}
		if(_self.getOperateState() == 'ADDNEW'){
			$("#automatic").shrCheckbox("check");
		}
		var that=this;
		this.setInputPlaceholder();
		that.myExtendValidate();//使用自定义的校验扩展校验 
		$('#frontDate').attr("validate","{maxlength:9,required:true,number:true,my24Vldt:true}");
		if($("#breadcrumb").children().length ==4){
		var list=document.getElementById("breadcrumb");
		list.removeChild(list.childNodes[3]);
		}
		if($("#breadcrumb").children().length ==2){
		$("#breadcrumb").find(".homepage").after('<li><a href="/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsSchedulePlanSet.list&serviceId='+shr.getUrlParam("serviceId")+'&inFrame=true">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSetEdit_i18n_0
			+ '</a> <span class="divider">/</span></li>');
		}
		if($("#breadcrumb").children().length ==3){
			if($($("#breadcrumb").find("a")[1]).html()==$("#breadcrumb").find(".active").html()){
			var list=document.getElementById("breadcrumb");
			list.removeChild(list.childNodes[2]);
		$("#breadcrumb").find(".homepage").after('<li><a href="/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsSchedulePlanSet.list&serviceId='+shr.getUrlParam("serviceId")+'&inFrame=true">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSetEdit_i18n_0
			+ '</a> <span class="divider">/</span></li>');
			}
		}
	}
	,viewAction: function(billId) {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsSchedulePlanSet.form',
			relatedFieldId: billId,
			tab: 1,
			method: 'initalizeData'
		});	
	},
	setInputPlaceholder:function(){
		$("#hrOrgUnit").attr("placeholder",jsBizMultLan.atsManager_atsSchedulePlanSetEdit_i18n_1)
	},myExtendValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {  
    		my24Vldt:jsBizMultLan.atsManager_atsSchedulePlanSetEdit_i18n_2
		  });
		   jQuery.validator.addMethod("my24Vldt", function(value, element) {
	       var vn=value||'';
	       if ("string" === typeof vn) {
  				 vn=new Number(vn.trim());
  			 }
	    	 if ( vn < 0 || vn>45) {
	    	 	return false;
	    	 }else {
		     	return true;
		     }
	      });
	}
});

