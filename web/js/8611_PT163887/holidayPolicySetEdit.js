shr.defineClass("shr.ats.HolidayPolicySetEdit", shr.ats.AtsMaintainBasicItemEdit, {
  initalizeDOM:function(){
		shr.ats.HolidayPolicySetEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		
		that.initAtsDOM() ;
		
	     jQuery.validator.addMethod("minNumber",function(value, element){
	            var returnVal = true;
	            var inputZ=value || '';
	            var ArrMen= String(inputZ).split(".");    //截取字符串
	            if(ArrMen.length==2){
	                if(ArrMen[1].length>2){    //判断小数点后面的字符串长度
	                    returnVal = false;
	                    return false;
	                }
	            }
	            return returnVal;
	        },jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_4);         //验证错误信息
		
		$.extend($.validator.messages, {
		//	min: $.validator.format("请输入不小于 {0} 的整数"),
			range:$.validator.format(jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_3)
			//minNumber: $("#defaultStandardHour").val() 
		});
		
		
		
		$("#defaultStandardHour").attr("validate", "{number:true,range:[0,24],minNumber: atsMlUtile.getFieldOriginalValue('defaultStandardHour') }");
		that.addTips();
		if(shr.getUrlRequestParam("method") == "copyEdit"){
		$("#hrOrgUnit").shrPromptBox("enable");
		}
    }, 
	initAtsDOM : function(){
		var that = this ;
		//如果编辑页面的选项是默认假期制度。那么就将改checked置为disabled
		if($('#isDefault').attr("checked") == true || $('#isDefault').attr("checked") == 'checked'){
			$('input[id="isDefault"]').attr("disabled","disabled");
		}
		
		
		$("#amStartWorkTime").attr("placeholder",jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_5);
		
		$("#amEndWorkTime").attr("placeholder",jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_5);
		
		$("#pmStartWorkTime").attr("placeholder",jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_5);
		
		$("#pmEndWorkTime").attr("placeholder",jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_5);
		
		$("[title='"+jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_20+"']")
			.attr("title",jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_13);
		
		that.isHalfDayOffDeal();
		that.isAllowDeductHourDeal();
		$('#isHalfDayOff').bind("change", function(){
			that.isHalfDayOffDeal();
		});
		
		$('#deductRule').bind("change", function(){
			that.isAllowDeductHourDeal();
			
			
		});
		
		
//		that.changeCheckboxPosition("isEditHolidayLength");
//		that.changeCheckboxPosition("isDefault");
//		that.changeCheckboxPosition("isHalfDayOff");
//		that.changeCheckboxPosition("isSysPreset");
		that.setDefaultCheck();
		
		//增加问号参数说明
		that.showTips();
		that.addSocQueryTips();
		
  } 
	
	,isAllowDeductHourDeal:function(){
		var fun = $('#deductRule').shrSelect("getValue").value == "2" ? 'show' : 'hide';
		$("#allowDeductHour").closest("[data-ctrlrole=labelContainer]")[fun]();
	}
	,isHalfDayOffDeal: function(){
		var isHalfDayOff = $('#isHalfDayOff').attr('checked');
		var selector = '#amStartWorkTime,#amEndWorkTime,#pmStartWorkTime,#pmEndWorkTime';
		if(isHalfDayOff=="checked"){
			$(selector).closest("[data-ctrlrole=labelContainer]").show();
			$(selector).attr("validate","{maxlength:80,required:true}");
			$(selector).closest(".ui-text-frame").addClass('required');
		}else{
			$(selector).val('');
			$(selector).closest("[data-ctrlrole=labelContainer]").hide();
			$(selector).attr("validate","{maxlength:80}");
			$(selector).closest(".ui-text-frame").removeClass('required');
		}
	},cancelAction:function(){
			this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayPolicySet.list'
			});	
	}
	//系统自带校验
	,validate: function() {
		var that = this;
		var isHalfDayOff = $('#isHalfDayOff').attr('checked');
		if(isHalfDayOff=="checked"){
		var amStartWorkTime = $('#amStartWorkTime').val();
		var amEndWorkTime = $('#amEndWorkTime').val();
		var pmStartWorkTime = $('#pmStartWorkTime').val();
		var pmEndWorkTime = $('#pmEndWorkTime').val();
		if(amStartWorkTime==null||amStartWorkTime==""){
		shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_7});
		return false; 
		}
		
		if(amEndWorkTime==null||amEndWorkTime==""){
		shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_10});
		return false; 
		}
		
		if(pmStartWorkTime==null||pmStartWorkTime==""){
		shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_15});
		return false; 
		}
		
		if(pmEndWorkTime==null||pmEndWorkTime==""){
		shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_18});
		return false; 
		}
		
		if(!that.validateWorkTime(amStartWorkTime)){
		shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_8});
		return false;
		}
		
		if(!that.validateWorkTime(amEndWorkTime)){
		shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_11});
		return false;
		}
		
		if(!that.validateWorkTime(pmStartWorkTime)){
		shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_16});
		return false;
		}
		
		if(!that.validateWorkTime(pmEndWorkTime)){
		shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_19});
		return false;
		}
		
		 	 
		 	 var am_h1=new Number(amStartWorkTime.substring(0,2));
		     var am_m1=new Number(amStartWorkTime.substring(3,5));
		     var s_am1 = am_h1*60+am_m1;
		      
		     var am_h2=new Number(amEndWorkTime.substring(0,2));
		     var am_m2=new Number(amEndWorkTime.substring(3,5));
		     var s_am2 = am_h2*60+am_m2;
		     
		     var pm_h1=new Number(pmStartWorkTime.substring(0,2));
		     var pm_m1=new Number(pmStartWorkTime.substring(3,5));
		     var s_pm1 = pm_h1*60+pm_m1;
		     
		     var pm_h2=new Number(pmEndWorkTime.substring(0,2));
		     var pm_m2=new Number(pmEndWorkTime.substring(3,5));
		     var s_pm2 = pm_h2*60+pm_m2;
		     
	     if(s_am1>s_am2){
	     shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_9});
		 return false;
	     }
	     
	     if(s_am2>s_pm1){
	     shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_14});
		 return false;
	     }
	     
	     if(s_pm1>s_pm2){
	     shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_17});
		 return false;
	     }
		     
		     
		}
		
		//父类校验 start
		var workArea = this.getWorkarea(),
			$form = $('form', workArea);
		
		var flag = $form.valid();
		return flag;
		//父类校验 end
		
		return true;
		}
/**
	 * 查看
	 */
	,viewAction: function(billId) {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayPolicy4Set.form',
			relatedFieldId: billId,
			method: 'initalizeData'
		});		
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
				data.copyId = data.billId;//原纪录的id，用于复制其分录
				data.billId = "";
			};
		}
		
		return data;
	}
	
	,validateWorkTime:function(value){
		var v=value||'';
	    	   if(/[0-5][0-9]:[0-5][0-9]/.test(v)&&v.length==5){
	    	   	  var h=new Number(v.substr(0,2));
	    	   	  if(h<24)
	    	   	    return true;
	    	   	  else
	    	   	    return false;
	    	   }else{
	    	   	  return false;
	    	   }
	}
	,validateTimeFirstAfter:function(am1,am2,pm1,pm2){
	
	    	
		     
		     
		     
	}
	,setDefaultCheck:function(){
		var that=this;
		$(function() {
			if (that.getOperateState().toUpperCase() == 'ADDNEW'){
				$("#isEditHolidayLength").shrCheckbox("check");
			}
		});
		
	}
	,changeCheckboxPosition:function(id){
		var that=this;
		var inputID="#"+id;
		var $pdiv=$(inputID).parent().parent().parent();
		var arr=$pdiv.children().toArray();
		var temp=arr[1].outerHTML;
		var begin=temp.indexOf("<ins");
		var end=temp.lastIndexOf("ins>")+4
		
		//取input元素
		var inputIndex=temp.indexOf("<input");
		var inputHtml=temp.substring(inputIndex,begin);
		
		//去除脚本和脚本生成的html元素
		begin=temp.indexOf("<div class="+'"'+"icheckbox_minimal-grey");
		end=temp.indexOf("</div>")+6;
		temp=temp.substring(0,begin)+inputHtml+temp.substring(end,temp.length);
		
//		temp=temp.substring(0,begin)+temp.substring(end,temp.length);
		
		begin=temp.indexOf("<script");
	    end=temp.lastIndexOf("script>")+7;
	    temp=temp.substring(0,begin)+temp.substring(end,temp.length);
	    
	    //交换位置
		$pdiv.html(temp+arr[0].outerHTML+arr[0].outerHTML);
//		if(id=="isHalfDayOff"){
//			$(inputID).parent().parent()
//			.removeClass("col-lg-18").addClass("col-lg-4");
//			$(inputID).parent().parent().next()
//			.removeClass("col-lg-4").addClass("col-lg-18");
//		}else{
//			$(inputID).parent().parent()
//			.removeClass("col-lg-6").addClass("col-lg-4");
//			
//			$(inputID).parent().parent().next()
//			.removeClass("col-lg-4").addClass("col-lg-6");
//		}
//		$(inputID).parent().parent().next().children()
//		.css({"float":"left","padding-left":"0px"});
//		$(inputID).parent().css({"float":"right","margin-right":"20px"});
		

		//重新执行脚本，并调整样式
		$(function() {
			var checkbox_json = {
				id:id,
				readonly: "",
				value: "1"
			};
			$('input[name="'+id+'"]').shrCheckbox(checkbox_json);
			if(id=="isHalfDayOff"){
				$('#isHalfDayOff').bind("change", function(){
					that.isHalfDayOffDeal();
				});
			}
			
			//调整系统默认isSysPreset的位置,与是否为半天假平行,是否默认在同一列
//			if(id=="isHalfDayOff"){
//				$(inputID).parent().parent()
//				.removeClass("col-lg-18").addClass("col-lg-4");
//				$(inputID).parent().parent().next()
//				.removeClass("col-lg-4").addClass("col-lg-18");
//			}
//			else{
//				$(inputID).parent().parent()
//				.removeClass("col-lg-6").addClass("col-lg-4");
//				
//				$(inputID).parent().parent().next()
//				.removeClass("col-lg-4").addClass("col-lg-6");
//			}
			
				$(inputID).parent().parent()
				.removeClass("col-lg-6").addClass("col-lg-4");
				
				$(inputID).parent().parent().next()
				.removeClass("col-lg-4").addClass("col-lg-6");

			$(inputID).parent().parent().next().children()
			.css({"float":"left","padding-left":"0px"});
			$(inputID).parent().css({"float":"right","margin-right":"20px"});
		});
	}
	
	,addSocQueryTips:function(){
		var that = this;
		var showTipsCount ="";
//		var totalTipsCount = $(jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_0).length;
//		for(var showTipsCount=0;showTipsCount<=count;showTipsCount++){
			that.addSocQueryTipA("tipsRest"+showTipsCount);
			that.addSocQueryTipA("tipsWorkCalendar"+showTipsCount);
//		}

	},
	
	//添加tips说明
	showTips:function(){
			//此处选择器中用中文括号，页面上是中文
			var tipsRestText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_22
				+ '</br>'
			+'&nbsp;'
				+ jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_12
				+ '</br>'
				+ jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_1
				+ '</br>'
			+'&nbsp;'
				+ jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_21;

			var tipsWorkCalendarText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_6
				+ '</br>'

			var showTipsCount ="";
			
//		for(var showTipsCount=0;showTipsCount<=count;showTipsCount++){
			$("[title='"+jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_13+"']")
				.append('<span id="tipsRest'+showTipsCount+'"></span>');
//			$("[title='"+jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_2+"']")
//				.append('<span id="tipsWorkCalendar'+showTipsCount+'"></span>');

			//基本信息			
			var tipsRestLog = '<div id="tipsRest'+showTipsCount+'-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;min-height:200px;position:absolute;left:15%;z-index:1;margin-top:0px;background: aliceblue;padding:5px;"><div><font color="gray">'+tipsRestText+'</font></div></div>';
			var tipsWorkCalendarLog = '<div id="tipsWorkCalendar'+showTipsCount+'-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:32%;min-height:40px;position:absolute;left:15%;z-index:1;margin-top:0px;background: aliceblue;padding:5px;"><div><font color="gray">'+tipsWorkCalendarText+'</font></div></div>';//前置假
			
			//此处选择器中用中文括号，页面上是中文
			$("[title='"+jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_13+"']").after(tipsRestLog);
			$("[title='"+jsBizMultLan.atsManager_holidayPolicySetEdit_i18n_2+"']").after(tipsWorkCalendarLog);
			
			
			
//			}
			
			
		},
		// 添加 tips 说明（？图片显示以及隐藏）
	addSocQueryTipA: function(tip) {
		var _self = this;
		var tips = $("#"+tip);
	
		var tipLog = tip+"-dialog";
		tips.prop("title", "");
		tips.css({"display": "inline-block"});
		var tipsLayout = $("#"+tipLog);
		tips.hover(function(event){
			event.stopImmediatePropagation();
			event.returnValue = false;
			tipsLayout.stop(true,true).fadeIn()
		},function(event){
			event.stopImmediatePropagation();
			event.returnValue = false;
			tipsLayout.stop(true,true).fadeOut()
		})	
	}
});
