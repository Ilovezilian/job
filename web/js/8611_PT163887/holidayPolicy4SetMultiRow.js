var takeWorkingId = '+ZM5jTmrS0KHCjDSYGcFLf0tUpg='; //调休id
var yearlyVacationId='3T54RtSQRIqAL6cffMh60P0tUpg=';//年假id
var editOrginHolidayTypeId ={};
var isEdit = isEdit ? true : false;
var preStr = "";
var count = 0;

shr.defineClass("shr.ats.HolidayPolicy4Set", shr.framework.MultiRow, {
	  maintainEditObject:null,
      initalizeDOM:function(){
		  var that = this;
	//   修改请假控制性参数样式
		$('.line3').find('.col-lg-2').removeClass('col-lg-2').addClass('col-lg-4');
		
		/* start 假期制度样式调整 by chengli 2018-07-30 */
		setTimeout(function(){
			$('#shadow').hide();
			if(!$('#menu')[0]){
				var holidayTypeentries = '';
				[].slice.call($('[id^=holidayTypeentry]')).forEach(function(item, index){
					holidayTypeentries += '<li class=menuItem data-id='+(index+1)+'>'+item.innerHTML+'</li>';
				})
				var menu = (shr.getUrlRequestParam("uipk") === "com.kingdee.eas.hr.ats.app.HolidayPolicySet.AvailableForm") ? 
				    '<ul id=menu><li class=menuItem id=form0 data-id=0>'
					+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_39
					+ '</li>'+holidayTypeentries+ '</ul>' :
					'<ul id=menu><li class=menuItem id=form0 data-id=0>'
					+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_39
					+ '</li>'+holidayTypeentries+'<li class=menuItem data-id=add>'
					+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_111
					+ '</li></ul>'
				$('.view_manager_body').before(menu);
				$('#form0').addClass('activeMenu');
				$('.view_manager_body').css('cssText','float: right;width: 80%;min-height:525px;padding: 0 34px 0 0!important;');
				$('.form-horizontal').css({paddingTop: '15px'});
				var $forms = [].slice.call($('#form'));
				var $entries = [].slice.call($('.view_mainPage'), 1);
				$('.view_mainPage').slice(1).hide();
				$('.col-lg-3').removeClass('col-lg-3').addClass('col-lg-4');
				$('[title="' + jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_12 + '"]')
					.parent().parent().find($('.col-lg-1')).show();
				$('[title="' + jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_19 + '"]')
					.text(jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_92);
				$('[title="' + jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_65 + '"]')
					.attr("title", jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_47);
                $('[title="' + jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_112 + '"]')
					.attr("title", jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_109);
				$('#menu').css("padding-top","125px");
				$('#menu').delegate('li','click',function(li){
					if(isEdit){
						// shr.showConfirm('还未保存是否保存离开', function(){
						// 	// that.saveAction();
						// 	$('[name=save]').trigger('click');
						// })
						shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_74});
						return false;
					}

					var $entries = [].slice.call($('.view_mainPage'), 1);
					$('.activeMenu').removeClass('activeMenu');
					$(this).addClass('activeMenu');
					var id = $(this).data().id;
					var thisInnerText = $(this)[0].innerText;
					if(id===0){
						$($('#form')[0]).show();
						$('.view_mainPage').slice(1).hide();
					}else if(id!=='add'){
						// that.isAdd = true;
						$($('#form')[0]).hide();
						$entries.forEach(function(item, index){
//							BT1342869【8.5补丁测试】 【PT139815】假期制度-左边列删除中间的假期类型，再点下一个假期类型后信息显示有误。删除倒数第二个假期类型，再点最后一个假期类型，详情变空白。
							var itemId = $(item)[0].id;
							if($("#"+itemId+" #holidayType"+itemId+"")[0].innerText == thisInnerText){
//							if(index+1 === id){
								$(item).show();
							}else{
								$(item).hide();
							}
							if(index === 0){
								$('#otherInfo').show();
							}else{
								$('#otherInfo').hide();
							}
						})
					}else{
						if(!isEdit){
							that.addNewAction();
						}
					}
					that.showTips();
					that.addSocQueryTips();
					// $('.groupTitle').css({'cssText': 'color: #555!important; font-size: 12px!important'});
				})
				$(".shr-multiRow").show()
				//增加参数说明
				window.tipsTimer=setTimeout(function(){
					//增加参数说明,并节流触发
					that.showTips();
					that.addSocQueryTips();
				},100)
			}
			closeLoader();
		})
		// setTimeout(function(){
			//增加参数说明
			window.tipsTimer=setTimeout(function(){
				//增加参数说明,并节流触发
				that.showTips();
				that.addSocQueryTips();
			},100)
		// },500)
		/* end */
		openLoader(1);
		shr.ats.HolidayPolicy4Set.superClass.initalizeDOM.call(this);
		var that = this ;
		
		//隐藏部分field 用于布局
		$('div [title="hiddenField"]').closest('div [data-ctrlrole="labelContainer"]').attr('style','display:none');
		
		//"目前没有记录  新增"格式调整
		$('.shr-multiRow .shr-multiRow-empty').css('padding-left','60px');
		$('#addNew').css('cssText','padding:2px 5px !important');
		//处理分割线颜色
		// $(".line1").find("h5").css("color","#ddd");
		// $(".line2").find("h5").css("color","#ddd");
		// $(".line3").find("h5").css("color","#ddd");
		
		that.validateSelectValue();
		that.processF7ChangeEvent();
		that.initViewPage();

		//主要是处理fillHolidayAmount与fillHolidayAmountUnit这种包含情况
		that.initEveryFillHolidayView("entry");
		//刚保存完的当前那个还是uuid后缀
		that.initEveryFillHolidayView("uuid");
		//隐藏参数
		that.hideParams("entry");
		//刚保存完的当前那个还是uuid后缀
		that.hideParams("uuid");
		
		//that.holidayRuleF7Init();
		//增加参数说明弹出div
		that.addCaptionDiv();	
		
		//当点击编辑的时候：如果假期类型是调休假：调用
		if (that.getOperateState() == 'VIEW'){
			if($("#deductRule").html().trim()!=jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_107){
				$("#allowDeductHour").parent().parent().remove();

			}
			
			var allowDeductHour=atsMlUtile.getFieldOriginalValue("allowDeductHour");
			if(allowDeductHour&&allowDeductHour.length<=2){
				$("#allowDeductHour").html(allowDeductHour+jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_0);//@
			}
			$('span[id^="holidayType"]').each(function(i,temp) {
				var __uuid = this['id'].substr('holidayType'.length);
				//隐藏调休假
//				$('#takeWorkingRule' + __uuid).parents('.one_of_three').eq(0).hide();
				$('#takeWorkingRule' + __uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:none');
				if(takeWorkingId == $(temp).val()){
					//初始化假期控制开关：将所有开关全部打开
					//根据假期类型来设置属性的开关
//					$('#holidayRule' + __uuid).parents('.one_of_three').eq(0).hide();
//					$('#takeWorkingRule' + __uuid).parents('.one_of_three').eq(0).show();
					$('#holidayRule' + __uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:none');
					$('#takeWorkingRule' + __uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:block');
				}
			});
		}
		else{
			//隐藏调休假
//			$('#takeWorkingRule' + that.uuid).parents('.one_of_three').eq(0).hide();
			$('#takeWorkingRule' + that.uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:none');
					
			if(takeWorkingId == $('#holidayType' + that.uuid + '_el').val()){
				that.takeWorkingRule();
			}
			//
			$("#fillHolidayAmount"+that.uuid).attr("validate","{maxlength:9}");
			$("#periodLength"+that.uuid).attr("validate","{maxlength:9,digits:true}");
			$("#cancelLeaveAmount"+that.uuid).attr("validate","{maxlength:9,digits:true}");
			editOrginHolidayTypeId[that.uuid]=$('#holidayType' + that.uuid + '_el').val();
		}
		
		
			  
		if($('#onlyView').val()=='true'){
		   if($(".entry-button-top"))
		   {
			 $(".entry-button-top").remove();
		   }
		   if($(".shr-multiRow-empty button[id='addNew']"))
		   {
			 $(".shr-multiRow-empty button[id='addNew']").remove();
		   }
		   //$('form span.shr-toolbar button').hide();
		}
		
		that.defaultDeal();//默认不可选
		that.initEditOrAddNewFillHoliday();
		 var v_uuid=this.uuid;//checkbox
	     $('input[type="checkbox"]').on('change',function(){
	     	 if($(this).attr('checked')=='checked'){
	     	 	 if($(this).attr('id')==('enablePeriod'+v_uuid)){
                     var self1=$('#periodLength'+v_uuid);
                     self1.attr("disabled", false);
                     self1.closest(".ui-text-frame").eq(0).removeClass('disabled');
                     self1.shrTextField('setValue','1');
                     
                     var self2=$('#periodLengthUnit'+v_uuid);
                     self2.shrSelect("enable");
                     self2.attr("value", jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_49);
					 $('#periodLengthUnit'+v_uuid+'_el').attr("value",'1');
					 self2.parent().next('.ui-select-icon').show();

					 //根据是否控制假期额度 来设置分期发放方式是否可编辑
					 that.limitGrantStyleChange();
				 }else if($(this).attr('id')==('enableMinAmt'+v_uuid)){
	     	     	 var self1=$('#minAmt'+v_uuid);
                     self1.attr("disabled", false);
                     self1.closest(".ui-text-frame").eq(0).removeClass('disabled');
                     self1.attr("value", '0.5');
					 //添加控制单位额度取值方式
					 var self2=$('#minAmtValueMtd'+v_uuid);
               	     self2.shrSelect("enable");
                     self2.attr("value",jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_110);
					 $('#minAmtValueMtd'+v_uuid+'_el').attr('value','1');	
					 self2.parent().next('.ui-select-icon').show();
	     	     }else if($(this).attr('id')==('enableLeaveLength'+v_uuid)){//控制控制请假单位时长
					 var self1=$('#minLeaveLength'+v_uuid);
                     self1.attr("disabled", false);
                     self1.closest(".ui-text-frame").eq(0).removeClass('disabled');
                     //self1.attr("value", '0.5');
                     self1.shrTextField("setValue",0.5)
					 var self2=$('#minLeaveLengthVMtd'+v_uuid);
               	     self2.shrSelect("enable");
                     self2.attr("value",jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_110);
					 $('#minLeaveLengthVMtd'+v_uuid+'_el').attr('value','1');	
					 self2.parent().next('.ui-select-icon').show();
					 var self3=$('#isRoundSum'+v_uuid);
					 self3.attr("disabled", false);
					 self3.closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
				 }else if($(this).attr('id')==('isCancelLeave'+v_uuid)){
	     	     	 var self1=$('#cancelLeaveAmount'+v_uuid);
                     self1.attr("disabled", false);
                     self1.closest(".ui-text-frame").eq(0).removeClass('disabled');
                     self1.attr("value", '3');
                     var self2=$('#cancelLeaveAmountUnit'+v_uuid);
                     self2.shrSelect("enable");
                     self2.attr("value", jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_117);
					 $('#cancelLeaveAmountUnit'+v_uuid+'_el').attr("value",'2');
					 self2.parent().next('.ui-select-icon').show();
	     	     }
	     	 }else{
	     	     if($(this).attr('id')==('enablePeriod'+v_uuid)){
	     	     	 var self1=$('#periodLength'+v_uuid);
                     self1.attr("disabled", true);
                     self1.closest(".ui-text-frame").eq(0).addClass("disabled");
                     self1.shrTextField('setValue','');
                     
                     var self2=$('#periodLengthUnit'+v_uuid);
                     self2.shrSelect("disable");
                     //self2.closest(".ui-select-frame").eq(0).unbind('click');
                     self2.attr("value", '');
					 $('#periodLengthUnit'+v_uuid+'_el').attr("value",'');
					 self2.parent().next('.ui-select-icon').hide();

					 //根据是否控制假期额度 来设置分期发放方式是否可编辑
					 that.limitGrantStyleChange();
	     	     }else if($(this).attr('id')==('enableMinAmt'+v_uuid)){
					 var self1=$('#minAmt'+v_uuid);
                     self1.attr("disabled", true);
                     self1.closest(".ui-text-frame").eq(0).addClass("disabled");
                     self1.attr("value", '');	
					 var self2=$('#minAmtValueMtd'+v_uuid);
               	     self2.shrSelect("disable");
                     self2.attr('value','');
					 $('#minAmtValueMtd'+v_uuid+'_el').attr('value','');	
					 self2.parent().next('.ui-select-icon').hide();
	     	     }else if($(this).attr('id')==('enableLeaveLength'+v_uuid)){
					 var self1=$('#minLeaveLength'+v_uuid);
                     self1.attr("disabled", true);
                     self1.closest(".ui-text-frame").eq(0).addClass("disabled");
                     self1.attr("value", '');
                     $("#minLeaveLengthVMtd" + v_uuid).attr("readonly", true);	
                     var self2=$('#minLeaveLengthVMtd'+v_uuid);
               	     self2.shrSelect("disable");
                     self2.attr('value','');
					 $('#minLeaveLengthVMtd'+v_uuid+'_el').attr('value','');
					 self2.parent().next('.ui-select-icon').hide();		
					 
					//是否先取整再汇总
					 var self3=$('#isRoundSum'+v_uuid);
					 self3.attr("disabled", true);
					 self3.closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
				 }else if($(this).attr('id')==('isCancelLeave'+v_uuid)){
	     	         var self1=$('#cancelLeaveAmount'+v_uuid);
                     self1.attr("disabled", true);
                     self1.closest(".ui-text-frame").eq(0).addClass("disabled");
                     self1.attr('value','');
                     
                     var self2=$('#cancelLeaveAmountUnit'+v_uuid);
                       self2.shrSelect("disable");
                     self2.attr('value','');
					 $('#cancelLeaveAmountUnit'+v_uuid+'_el').attr('value','');
					 self2.parent().next('.ui-select-icon').hide();
	     	     }
	     	 }
	     });

	     if (this.getOperateState() != "VIEW") {
			 $('#periodLength' + v_uuid).shrTextField("option", "onchange", function () {
				 //根据是否控制假期额度 来设置分期发放方式是否可编辑
				 that.limitGrantStyleChange();
			 });
			 $('#periodLengthUnit' + v_uuid).shrSelect("option", "onChange", function () {
				 //根据是否控制假期额度 来设置分期发放方式是否可编辑
				 that.limitGrantStyleChange();
			 });
		 }

	     if(this.uipk=="com.kingdee.eas.hr.ats.app.HolidayPolicy4Set.form"){
	    	 maintainEditObject = shr.createObject(shr.shrBaseData.maintain.MaintainEdit);
	 		maintainEditObject.operateState = this.getOperateState() ;
	 		//maintainEditObject._someInit();
	 		maintainEditObject._initMaintainDOM();
	 		//maintainEditObject._initSomeDOM();
	 		maintainEditObject.billId = jsBinder.billId;
	     }
	   

	
		 
		 
	     //如果是非启用半天假为否 不显示 上午下午上下班时间
	     
	     if($('#isHalfDayOff').val()==0){
				// $('#amStartWorkTime').closest(".row-fluid").eq(0).attr('style','display:none');
				// $('#pmStartWorkTime').closest(".row-fluid").eq(0).attr('style','display:none');
				$('#amStartWorkTime').closest(".field-area").eq(0).attr('style','display:none');
				$('#amEndWorkTime').closest(".field-area").eq(0).attr('style','display:none');
				$('#pmStartWorkTime').closest(".field-area").eq(0).attr('style','display:none'); 
				$('#pmEndWorkTime').closest(".field-area").eq(0).attr('style','display:none');
	     }else{
				// $('#amStartWorkTime').closest(".row-fluid").eq(0).attr('style','display:block');
				// $('#pmStartWorkTime').closest(".row-fluid").eq(0).attr('style','display:block');
				$('#amStartWorkTime').closest(".field-area").eq(0).attr('style','display:block');
				$('#amEndWorkTime').closest(".field-area").eq(0).attr('style','display:block');
				$('#pmStartWorkTime').closest(".field-area").eq(0).attr('style','display:block'); 
				$('#pmEndWorkTime').closest(".field-area").eq(0).attr('style','display:block'); 
		}
	     
		
		
		  that.showPreHOlidayTypes();
		  count++;
		
		  if($("#breadcrumb.breadcrumb")[0].baseURI){
			var baseUriMethod = $("#breadcrumb.breadcrumb")[0].baseURI.split("method=")[1];
			if(baseUriMethod.startsWith("copy")){
				that.copyEditMainAction();
//				data.model = data.model.replace(data.billId,"");
//				data.billId = "";
			};
		}
			
		that.myExtendValidate();//使用自定义的校验扩展校验 
	  },myExtendValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {  
    		my24Vldt:jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_300
		  });
		   jQuery.validator.addMethod("my24Vldt", function(value, element) {
	       var vn=value||'';
	       if ("string" === typeof vn) {
  				 vn=new Number(vn.trim());
  			 }
	    	 if ( vn%1 == 0 ) {
	    	 	return true;
	    	 }else {
		     	return false;
		     }
	      });
	},
	   copyEditMainAction: function() {
	 	var  options = {};
	 	options.method='copyEdit';
	 	options.uipk= 'com.kingdee.eas.hr.ats.app.HolidayPolicySet.form';
	 	options.billId=$('#form #id').val();
	 	this.reloadPage(options);		
				
	},
	  
	  backAction: function(){
	  this.back();
	  }
	  		
		// 跳转到修订日志界面
	,reviseLogAction: function(){
		maintainEditObject.reviseLogAction();

	},

	// 分配	
	distributeAction: function(){
		maintainEditObject.distributeAction();
	},
	
	// 查看分配情况
	viewDistributionAction: function(){
		var _self = this, billId = this.billId,urlUipk = _self.getViewDistributeUipk();
		if(!urlUipk || urlUipk.length <= 0){
			shr.showError({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_4});
			return;
		}
		maintainEditObject._distributeUrlLocate({
			uipk : urlUipk,
			billId: billId
		});
	}
	 
	,addCaptionDiv: function() {
	var that = this;
	 if($('#pmEndWorkTime').closest(".row-fluid").eq(0).children('div[data-ctrlrole="labelContainer"]').length<3){
		 //不要出现多个“参数说明”
		 if($('#caption').length < 1){
			$('#pmEndWorkTime').closest(".row-fluid").eq(0).after('<div data-ctrlrole="labelContainer">'
				+'<div class="col-lg-4">'
				+'<div class="field_label" title="'
				+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_16
				+ '"><a id = "caption" href="#">'
				+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_16
				+ '</a></div>'
				+'</div></div>');
			
			$('#caption').live('click', that.reasonOnClick);
			$('body').append(this.getCaptionDivHtml());
			$('div[title="' + jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_16 + '"]').parent().parent().addClass("row-fluid row-block ");//调整"参数说明的格式"
		}
	}
	}

	
	,getCaptionDivHtml: function() {		
		return ['<div id="caption_div" class="modal hide fade">',
				    '<div class="modal-header">',
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
						'<h5>'
						+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_16
						+ '</h5>',
					'</div>',
					'<div id="caption-content"  class="modal-body">',
					'</div>',
				'</div>'].join('');
	}
	,reasonOnClick: function() {
		
		$('#caption-content').html('<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_113
			+ '</br>&nbsp;&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_116
            + '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_52
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_46
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_21
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_77
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_44
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_22
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_76
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_98
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_6
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_8
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_102
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_94
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_28
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_100
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_18
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_20
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_104
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_119
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_11
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_9
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_96
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_38
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_26
			+ '</li></br>'
//			+'<li>请假优先级：该参数控制请假单提交时的优先级，可设置从1到100的正整数。数字越小优先级越高，如设置年假、调休假优先级为1，事假优先级为2，则当年假或者调休假还有剩余额度时，不能请事假。</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_54
			+ '</li></br>'
			+'<li>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_60
			+ '</li></br>');
		/*
		$('#caption-content').html('<li>启动周期：若勾选，可编辑假期额度对应的周期，年假的额度周期默认1年，且不可编辑；</li></br>'
			+'<li>控制单位额度：若不勾选，请假申请时则不控制请假时长是否是单位额度倍数，假期额度生成时也不按单位额度截取；若勾选，请假申请或导入时请假时长必须是单位额度的整数倍；假期额度生成时自动截取单位额度的整数倍值，如单位额度为0.5，计算出的额度值是1.7，则系统自动保留结果为1.5，假期额度导入也必须是单位额度的整数倍；</li></br>'
			+'<li>是否允许补请假：若不勾选，则不允许补请假，则请假申请日期大于请假的开始日期，则不能申请；若勾选，则允许补请假，则请假的申请日期在请假的结束日期到补请假期限的结束日期内，均可以提交申请，超过期限则不可以申请；设置的允许补请假的期限不能超过1年/365天/12月</li></br>'
			+'<li>是否允许请假确认：若不勾选，则该假期类型不允许请假确认；若勾选，则请假确认申请日期在请假结束日期到请假确认期限的结束日期内，均可以提交请假确认，超过期限则不可以申请请假确认；设置的允许请假确认的期限不能超过1年/365天/12月</li></br>'
			+'<li>是否控制假期额度：若不勾选，该假期类型即使有导入的假期额度，请假时也不会对假期额度进行扣减；若勾选，请假时会做相应的额度扣减；年假默认勾选，且不可编辑；只有勾选方可选择额度规则，方可勾选是否允许超额请假，方可勾选超出额度下期扣减；</li></br>'
			+'<li>额度规则：若不勾选控制假期额度，则不可以设置假期类型对应的额度计算规则；若勾选控制假期额度，可以选择该假期类型对应的额度计算规则；</li></br>'
			+'<li>是否允许超额请假：若不勾选，则该假期类型的剩余额度等于0，则不允许提交请假单；若勾选，则该假期类型对应的剩余额度小于0，仍可提交请假申请；目前只有年假支持超额请假</li></br>'
			+'<li>超出额度下期扣减：若不勾选，下期额度生成时不会对上期超额请假的额度做处理；目前只有年假支持超出额度下期扣减；若勾选，下期额度生成时会自动扣减上期剩余额度为负的额度值，即请超额的假期额度；</li></br>' 
			+'<li>是否允许修改额度：若不勾选，则额度列表的实际额度无法编辑；若勾选，在额度列表导入时可进行修改导入修改最新周期的额度值，也可以新增导入额度值，否则不可以；</li></br>'
			+'<li>包括公休日：若勾选，则请假申请时请假时长计算时会包含公休日；若不勾选，则计算时长时会扣除公休日；</li></br>'
			+'<li>包含法定假日：若勾选，则请假申请时请假时长计算时会包含法定假日；若不勾选时，则计算请假时长时会扣除法定假日；</li>');
		*/	
		$('#caption_div').modal('show');
	}
	  
	,holidayRuleF7Init:function(){
	   var v_uuid = this.uuid;
			   var info = $('#holidayType' + v_uuid+'_el').attr('value');
			   if(info && info!=''){ 
				  var filter=" holidayType.id='"+info+"' ";
				  $("#holidayRule"+ v_uuid).shrPromptBox("setFilter",filter);
			   }
	}
	
	,processF7ChangeEvent : function(){
		var that = this;
		var v_uuid = this.uuid;
		if (that.getOperateState() != 'VIEW') {
			var holidayType = $("#holidayType" + v_uuid);
			holidayType.shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					if(info != null){
					    if(info.hasOwnProperty("name")){
							//var name = info.name;
							var id = info.id;
							if(id){
							 if(takeWorkingId == id){//调休假
											//$("#enablePeriod" + v_uuid).closest(".row-fluid").hide();
											$("#enablePeriod" + v_uuid).closest('div[data-ctrlrole="labelContainer"]').hide();
											$("#periodLength" + v_uuid).closest('div[data-ctrlrole="labelContainer"]').hide();
											$("#periodLengthUnit" + v_uuid).closest('div[data-ctrlrole="labelContainer"]').hide();
					    	       $("#isOver" + v_uuid).closest(".row-fluid").show();
				    	      }else if(yearlyVacationId == id){//年假
					    	       $("#enablePeriod" + v_uuid).closest(".row-fluid").show();
					    	       $("#isOver" + v_uuid).closest(".row-fluid").show();
				    	      }else{
				    	           $("#enablePeriod" + v_uuid).closest(".row-fluid").show();
					    	       $("#isOver" + v_uuid).closest(".row-fluid").show();
				    	      }
							}
					    }
					}
				}
			});
		}
			
	},
	defaultDeal:function(){
		var v_uuid=this.uuid;
		
		if($('#enablePeriod'+v_uuid+':checked').length>0){
		}else{
	     	 var self1=$('#periodLength'+v_uuid);
	         self1.attr("disabled", true);
	         self1.closest(".ui-text-frame").eq(0).addClass("disabled");
	         
	         var self2=$('#periodLengthUnit'+v_uuid);
	         self2.attr("disabled", true);
	         self2.closest(".ui-select-frame").eq(0).addClass("disabled");
			 self2.parent().next('.ui-select-icon').hide();
	       	//  self2.shrSelect("disable");
	         self2.closest(".ui-select-frame").eq(0).unbind('click');
		}
         
		if($('#enableMinAmt'+v_uuid+':checked').length>0){
		}else{
			 var self1=$('#minAmt'+v_uuid);
	         self1.attr("disabled", true);
	         self1.closest(".ui-text-frame").eq(0).addClass("disabled");	
			 var self2=$('#minAmtValueMtd'+v_uuid);
	         self2.attr("disabled", true);
			 self2.attr("value", '');
	         self2.closest(".ui-select-frame").eq(0).addClass("disabled");
			 self2.parent().next('.ui-select-icon').hide();
	         self2.closest(".ui-select-frame").eq(0).unbind('click');
		}
		
		if($('#enableLeaveLength'+v_uuid+':checked').length>0){
		}else{
			 var self1=$('#minLeaveLength'+v_uuid);
	         self1.attr("disabled", true);
	         self1.closest(".ui-text-frame").eq(0).addClass("disabled");
			 var self2=$('#minLeaveLengthVMtd'+v_uuid);
	         self2.attr("disabled", true);
			 self2.attr("value", '');
	         self2.closest(".ui-select-frame").eq(0).addClass("disabled");
			 self2.parent().next('.ui-select-icon').hide();
	         self2.closest(".ui-select-frame").eq(0).unbind('click');
	         var self3=$('#isRoundSum'+v_uuid);
	         self3.attr("disabled", true);
	         self3.closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		}
         
        if($('#isCancelLeave'+v_uuid+':checked').length>0){
		}else{
	         var self1=$('#cancelLeaveAmount'+v_uuid);
	         self1.attr("disabled", true);
	         self1.closest(".ui-text-frame").eq(0).addClass("disabled");
	         self1.attr('value','');
	         
	         var self2=$('#cancelLeaveAmountUnit'+v_uuid);
	         self2.attr("disabled", true);
	         self2.closest(".ui-select-frame").eq(0).addClass("disabled");
			 self2.parent().next('.ui-select-icon').hide();
	       //  self2.shrSelect("disable");
	         self2.closest(".ui-select-frame").eq(0).unbind('click');
	         self2.attr('value','');
		}
		
		
		//如果是年假 单位只能为天
		var that = this;
		// that.initYearVacationDeal();
		//年假和调休假可以设置是否启用超额请假
		that.initYearOrTakeWorkVacationDeal();
		that.isCtrlLimitDeal();
		that.isOverDeal();
	},
	initEditOrAddNewFillHoliday : function(){
		var v_uuid=this.uuid;
		var operateState = this.getOperateState();
		if ('EDIT' == operateState || 'ADDNEW' == operateState) {
		//请假确认
			$("#fillHolidayCelAmount"+ v_uuid).attr("validate","{maxlength:9,required:true,number:true,my24Vldt:true}");
			$("#fillHolidayAmount"+ v_uuid).attr("validate","{maxlength:9,required:true,number:true,my24Vldt:true}");
				var  isFillHolidayParentDiv = $("#isCancelLeave" + v_uuid).closest(".field-ctrl");
			    var fillHolidayByTimeCtlParentDiv = $("#fillHolidayCelByTimeCtl" + v_uuid).closest(".field-ctrl");
			    var fillHolidayAmountParentDiv = $("#fillHolidayCelAmount" + v_uuid).closest(".field-ctrl");
			    var fillHolidayAmountUnitParentDiv = $("#fillHolidayCelAmountUnit" + v_uuid).closest(".field-ctrl");
			    var fillHolidayAmount = $("#fillHolidayCelAmount" + v_uuid);
			    var fillHolidayAmountUnit = $("#fillHolidayCelAmountUnit" + v_uuid);
			    var fillHolidayByCycleCtlParentDiv = $("#fillHolidayCelByCycleCtl" + v_uuid).closest(".field-ctrl");
			    var fillHolidayByCycleCtl = $("#fillHolidayCelByCycleCtl" + v_uuid)
			    var fillHolidayAfterDay = $("#fillHolidayCelAfterDay" + v_uuid);

				var isFillHolidayParentPrevDiv = isFillHolidayParentDiv.prev();

				var fillHolidayByTimeCtlParentPrevDiv = fillHolidayByTimeCtlParentDiv.prev();
				var fillHolidayAmountUnitParentPrevDiv = fillHolidayAmountUnitParentDiv.prev();
				
				var fillHolidayAmountUnitParentDiv = fillHolidayAmountUnit.closest(".field-ctrl");
						
				var fillHolidayAmountHtml = "<div class='field-ctrl col-lg-2' style='margin-right:20px;display:block'>" + fillHolidayAmount.closest(".field-ctrl").html() + "<div>";
					
				var fillHolidayAmountUnitNextDiv = fillHolidayAmountUnitParentDiv.next();
				
				
				var fillHolidayByCycleCtl = fillHolidayByCycleCtl.closest(".field-ctrl");

				var fillHolidayByCycleCtlParentPrevDiv = fillHolidayByCycleCtl.prev();
				
				var fillHolidayCycleType = $("#fillHolidayCelCycleType" + v_uuid).closest(".field-ctrl");
				var fillHolidayCycleTypeParentPrevDiv = fillHolidayCycleType.prev();
				
				
		}
		if ('EDIT' == operateState || 'ADDNEW' == operateState) {
				var  isFillHolidayParentDiv = $("#isFillHoliday" + v_uuid).closest(".field-ctrl");
				var fillHolidayByTimeCtlParentDiv = $("#fillHolidayByTimeCtl" + v_uuid).closest(".field-ctrl");
				var fillHolidayAmountParentDiv = $("#fillHolidayAmount" + v_uuid).closest(".field-ctrl");
				var fillHolidayAmountUnitParentDiv = $("#fillHolidayAmountUnit" + v_uuid).closest(".field-ctrl");
				var fillHolidayAmount = $("#fillHolidayAmount" + v_uuid);
				var fillHolidayAmountUnit = $("#fillHolidayAmountUnit" + v_uuid);
				var fillHolidayByCycleCtlParentDiv = $("#fillHolidayByCycleCtl" + v_uuid).closest(".field-ctrl");
				var fillHolidayByCycleCtl = $("#fillHolidayByCycleCtl" + v_uuid)
				var fillHolidayAfterDay = $("#fillHolidayAfterDay" + v_uuid);
				var isFillHolidayParentPrevDiv = isFillHolidayParentDiv.prev();
				var fillHolidayByTimeCtlParentPrevDiv = fillHolidayByTimeCtlParentDiv.prev();
				var fillHolidayAmountUnitParentPrevDiv = fillHolidayAmountUnitParentDiv.prev();
				var fillHolidayAmountUnitParentDiv = fillHolidayAmountUnit.closest(".field-ctrl");
						
				var fillHolidayAmountHtml = "<div class='col-lg-1 field-ctrl' style='margin-right:20px;'>" + fillHolidayAmount.closest(".field-ctrl").html() + "<div>";
					
				var fillHolidayAmountUnitNextDiv = fillHolidayAmountUnitParentDiv.next();
				if(fillHolidayAmountUnitNextDiv.html() != null){
					if(fillHolidayAmountUnitNextDiv.html().indexOf("fillHolidayAmount") == -1){
						$(fillHolidayAmountHtml).insertBefore(fillHolidayAmountUnitParentDiv);
							fillHolidayAmount.closest("div [data-ctrlrole = 'labelContainer']").remove();
					}
				}
				this.initailValueLabelEdit(v_uuid);
		}else{
			this.initailValueLabelView(v_uuid);
		}
		var that=this
		clearTimeout(window.tipsTimer)
		window.tipsTimer=setTimeout(function(){
			//增加参数说明,并节流触发
			that.showTips();
			that.addSocQueryTips();
		},100)
	},  
	deleteAction:function(){
		if (typeof this.billId === 'undefined' || this.billId == '') {
			this.removeWorkarea();
			return;
		}
		var _self = this;
		var holidayPolicyId = _self.billId;
		shr.showConfirm(jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_50, function(){
			var data = {
				method: 'delete',
				billId: holidayPolicyId
			};
			var relatedFieldId = _self.getRelatedFieldId();
			if (relatedFieldId) {
				data.relatedFieldId = relatedFieldId;
			}
			data = $.extend(_self.prepareParam(), data);
			
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayPolicy4SetMulitRowHandler&method=hasReference";
			shr.ajax({
				dataType:'json',
				type:"post",
				async: false,
				data: {holidayPolicyId:holidayPolicyId},
				url:  url,
				success:function(res){
					if(res && !res.data){
						shr.doAction({
							url: _self.dynamicPage_url,
							type: 'post', 
							data: data,
							success : function(response) {					
								_self.afterRemoveAction();
							}
						});
						var $active = $('.activeMenu').prev();	
						$('.activeMenu').remove();
						$active.trigger('click');
					}else {
						shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_35});
					}
				}
			});
			
		});
	},
	doSave: function(event, action, foo) {
		var _self = this;
		var data = _self.assembleSaveData(action);
		
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		shr.doAction({
			target: target,
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(response) {
				if (_self.isFromF7()) {
					// 来自F7，关闭当前界面，并给F7设置
					var dataF7 = {
						id : response,
						name : $.parseJSON(data.model).name
					};
					dialogClose(dataF7);
				} else {
					// 普通保存，去除最后一个面包屑，防止修改名字造成面包屑重复
					shrDataManager.pageNavigationStore.pop();
					
					_self.viewAction(response);
				}
				foo && foo();
			}
		});	
	},
	 saveAction: function(event) {
		var _self = this;
		// if($('.activeMenu').data().id === 'add'){
		// 	_self.isAdd = true;
		// }
		
		// if(!$('name="holidayType"').attr('disabled') && $('.activeMenu').data().id === 'add'){
		// 	isEdit = true;
		// }
		if (_self.validate() && _self.verify()) {	//界面校验通过
			isEdit = false;	
			if($('.activeMenu').data().id === 'add'){
				var id = $('.menuItem').length-1;
				var appendedMenu = '<li class="menuItem activeMenu" data-id='+id+'>';
				// var holidayTextEle = $('[id^=holidayTypeuuid]').last().next();
				// appendedMenu += holidayTextEle.find('span.unHide').text() + '</li>';
				var holidayTextEle = $('[id^=holidayTypeuuid]').last().val();
				appendedMenu += holidayTextEle+ '</li>';
				_self.doSave(event, 'save', function(){
					$('[data-id=add]').before(appendedMenu);
					$('[data-id=add]').removeClass('activeMenu');
				});
			}else{
				_self.doSave(event, 'save');
			}
			
		
			 
		}	
		
		
		
	  },
	  
	   
	  /**
	   * 前置假显示
	   */
	   showPreHOlidayTypes: function(){
			var v_uuid = this.uuid;
			var that = this;
			if(v_uuid){
				
			var pre = $("#preHolidayTypes"+v_uuid).val();
			var bid = $('#id' + v_uuid).val();
			if(pre){
				var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayPolicy4SetMulitRowHandler&method=showPreHolidayTypes";
					shr.ajax({
							dataType:'json',
							type:"post",
							async: false,
							data: {preIds:pre},
							url:  url,
							success:function(res){
								var arr = [];
								preStr="";
							Object.keys(res.data).map(function(item){
								preStr += res.data[item]+",";
							})
		
							preStr = preStr.slice(0,-1);
//							console.log($("#preHolidayTypesf7"+v_uuid));
//							console.log($("#preHolidayTypes"+v_uuid));
							
							if(document.getElementById("preHolidayTypesf7"+v_uuid).tagName=="INPUT"){//编辑状态下设置显示
								var preHolidayTypeIds = $("#preHolidayTypes"+v_uuid).val();
								$("#preHolidayTypesf7"+v_uuid+"_el").val(preHolidayTypeIds);
								$("#preHolidayTypesf7"+v_uuid).val(preStr);
							}else if(document.getElementById("preHolidayTypesf7"+v_uuid).tagName=="SPAN"){//进入页面时的显示
								preStr && $("#preHolidayTypesf7"+v_uuid).removeClass('text-Unfilled').text(preStr).attr('title',preStr);
							}
							
						    }
						});
						
					}
			}

		},
	  
	  
	  validate: function() {
		var workArea = this.getWorkarea(),
			$form = $('form', workArea);
		
		var flag = $form.valid();
		
		//自己添加的校验
		var v_uuid = this.uuid;
		//
		if(editOrginHolidayTypeId[v_uuid]!="" && editOrginHolidayTypeId[v_uuid] != $('#holidayType' + v_uuid + '_el').val()){
			 var checkHolidayFalse=true;
			_self .remoteCall({
			 	type:"post",
			 	async: false,
			 	method:"checkHoliday",
			 	param:{holidaytypeId:editOrginHolidayTypeId[v_uuid],billID:$('#id' + v_uuid).val()},
			 	success:function(res){
			 		var errorSring =  res.errorSring;
			 		if(errorSring){
			 			shr.showWarning({message: errorSring}); 
			 			checkHolidayFalse =false;
						
			 		}
					
			 	}
			 });
			if(!checkHolidayFalse){
				return checkHolidayFalse;
			}
		}
		// 启动周期
		var enablePeriod = $('#enablePeriod' + v_uuid).attr('checked');		
		if(enablePeriod=="checked"
		&&($('#periodLength' + v_uuid).val()==""
		||$('#periodLengthUnit' + v_uuid).val()=="")){
		shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_70});
		return false;
		}
		
		if(enablePeriod=="checked" && $('#periodLength' + v_uuid).val()<=0){
			shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_122});
			return false;
		}
		
		// 启动周期 控制  只能为年的整数倍   月 只能为 1  2  3 4 6 被12整除的
		//是否允许补请假
		if($('#periodLengthUnit' + v_uuid+"_el").val()=="2"){
		if($('#periodLength' + v_uuid).val()!="1"
		  	&&$('#periodLength' + v_uuid).val()!="2"
		  	&&$('#periodLength' + v_uuid).val()!="3"
		  	&&$('#periodLength' + v_uuid).val()!="4"
		  	&&$('#periodLength' + v_uuid).val()!="6"){
		  	shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_123});
			return false;
			
		}
		}
		
		
		var enableMinAmt = $('#enableMinAmt' + v_uuid).attr('checked');
		if(enableMinAmt=="checked"
			&&($('#minAmt' + v_uuid).val()=="")){
			shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_72});
			return false;
				}
		if(enableMinAmt=="checked" && $('#minAmt' + v_uuid).val()<=0){
			shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_91});
			return false;
		}
		var isCtrlLimit = $('#isCtrlLimit' + v_uuid).attr('checked');
		if(isCtrlLimit && $('#holidayRule' + v_uuid).val()=="" && $('#takeWorkingRule' + v_uuid).val()=="") {
			shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_360});
			return false;
		}
		
		var enableLeaveLenght = $('#enableLeaveLength' + v_uuid).attr('checked');
		if(enableLeaveLenght=="checked" && $('#minLeaveLength' + v_uuid).val()<=0){
			shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_23});
			return false;
		}
		
		var isFillHoliday = $('#isFillHoliday' + v_uuid).attr("checked");
		
		if("checked" == isFillHoliday){
			var fillHolidayByTimeCtl = $('#fillHolidayByTimeCtl' + v_uuid).attr("checked");
			var fillHolidayByCycleCtl = $('#fillHolidayByCycleCtl' + v_uuid).attr("checked");
			if((!fillHolidayByTimeCtl || !"checked" == fillHolidayByTimeCtl) && (!fillHolidayByCycleCtl || !"checked" == fillHolidayByCycleCtl)){
				shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_75});
			    return false;
			}
			if("checked" == fillHolidayByTimeCtl){
			   if(($('#fillHolidayAmount' + v_uuid).val()=="" ||$('#fillHolidayAmountUnit' + v_uuid).val()=="")){
				shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_68});
			    return false;
			}else{
				var amount = $('#fillHolidayAmount' + v_uuid).val();
				var unit = $('#fillHolidayAmountUnit' + v_uuid).val();
				var info = this.isMoreOneYear(amount,unit);
				if(info!=""){
					shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_13+info});
				    return false;
			     }
			}
			/*if($('#fillHolidayAmount' + v_uuid).val()<=0){
				shr.showWarning({message: "补请假期限必须大于0！"}); 
			   return false;
			}*/
		   }
		   
		   if("checked" == fillHolidayByCycleCtl){
	            var fillHolidayBeforeDay = $('#fillHolidayAfterDay' + v_uuid).val();
				var fillHolidayCycleType = $('#fillHolidayCycleType' + v_uuid + '_el').val();
				var fillHolidayBeforeDayIntValue = parseInt(fillHolidayBeforeDay);
				if(fillHolidayCycleType == ""){
					shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_73});
				    return false;
				}else if(fillHolidayBeforeDay == ""){
					shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_69});
				    return false;
				}else if(fillHolidayBeforeDayIntValue < 0 || fillHolidayBeforeDayIntValue > 31){
					shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_42});
					return false;
				}		   
			}
		}
		var isCancelLeave = $('#isCancelLeave' + v_uuid).attr("checked");
		if("checked" == isCancelLeave){
			var fillHolidayByCelTimeCtl = $('#fillHolidayCelByTimeCtl' + v_uuid).attr("checked");
			var fillHolidayByCelCycleCtl = $('#fillHolidayCelByCycleCtl' + v_uuid).attr("checked");
			if((!fillHolidayByCelTimeCtl || !"checked" == fillHolidayByCelTimeCtl) && (!fillHolidayByCelCycleCtl || !"checked" == fillHolidayByCelCycleCtl)){
				shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_361});
			    return false;
			}
		}
		var isCancelLeave = $('#isCancelLeave' + v_uuid).attr('checked');
	//是否允许请假确认
		
		if(isCancelLeave=="checked"
		&&($('#cancelLeaveAmount' + v_uuid).val()==""
		||$('#cancelLeaveAmountUnit' + v_uuid).val()=="")){
	
		shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_71});
		return false;
		}else{
		var amount = $('#cancelLeaveAmount' + v_uuid).val();
		var unit = $('#cancelLeaveAmountUnit' + v_uuid).val();
		var info = this.isMoreOneYear(amount,unit);
		if(info!=""){
			shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_63+info});
		return false;
		}
		}
		if(isCancelLeave=="checked" && $('#cancelLeaveAmount' + v_uuid).val()<=0){
			shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_62});
			return false;
		}
		
		if($('#allowLeaveTimes' + v_uuid).val()!=null && $('#allowLeaveTimes' + v_uuid).val()!=""){
			if($('#allowLeaveTimes' + v_uuid).val()<0){
				shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_120});
				return false;
			}
		}
		if($('#initialValue' + v_uuid).val()!=null && $('#initialValue' + v_uuid).val()!=""){
			if($('#initialValue' + v_uuid).val()<0){
				shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_61});
				return false;
			}
		}
		
		//  请假优先级校验：必须为1-100正整数
		var isPriority = $('#isPriority').attr('value');
		if(isPriority=="1"){
			var leavePriority = $('#leavePriority' + v_uuid).val();
			if(leavePriority==null||leavePriority==""){
				shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_66});
				return false; 
			}else{
				// 匹配0到99的正则表达式
				var type = /^\d{1,2}$/;
				var re = new RegExp(type);
            	if (leavePriority.match(re) == null) {
					if(leavePriority!=100){// 为100的时候
						shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_67});
						return false;
					}
            	}else if(leavePriority == 0){// 为0的时候
					shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_67});
					return false;
				}
			}

		}
		if($('#isHalfDayOff' + v_uuid).shrCheckbox("isSelected") && $("#isHalfDayOff").val() ==0 ){
			shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_40});
			return false;
		}
		//验证假期额度参数上的小数精度是否超过系统设置的精度
		var sysDecimalPlace = atsMlUtile. getSysDecimalPlace();
		var value = $("#minAmt" + v_uuid).val();
		//求小数位数
		var enableMinAmt = $('#enableMinAmt' + v_uuid).attr('checked');
		if(enableMinAmt =="checked"){
		var number = value.toString().split(".")[1].length || 0;
		if(number > sysDecimalPlace ){
			shr.showWarning({message:shr.formatMsg(jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_26752880_i18n_1,[sysDecimalPlace,sysDecimalPlace])});
			return false;	
		}
		}
		
		//校验请假单位时长小数位精度
		var minLeaveValue = $("#minLeaveLength" + v_uuid).val();
		//求小数位数
		var enableLeave = $('#enableLeaveLength' + v_uuid).attr('checked');
		if(enableLeave =="checked"){
		var minLeaveNumber = minLeaveValue.toString().split(".")[1].length || 0;
		if(minLeaveNumber > sysDecimalPlace ){
			shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_26752880_i18n_0,[sysDecimalPlace,sysDecimalPlace])});
			return false;	
		}
		}
		return flag;
	},
	setButtonVisible: function() {
		var $workarea = this.getWorkarea();
		$workarea.find('.entry-button-top').show();
	},
	/**
	 * 取消
	 */
	cancelAction:function() {	
		isEdit = false;	
		if (this.getOperateState().toUpperCase() == 'ADDNEW') {
			console.log(1)
			this.removeWorkarea();
			$('[data-id="0"]').trigger('click');
		} else {
			// console.log(2)
			this.viewAction();
		}
	},
	/**
	 * 新增
	 */
	addNewAction: function() {	
		isEdit = true;
		var params = this.prepareParam();
		
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			params.relatedFieldId = relatedFieldId;
		}
		params.holidayPolicySetId=$('#form #id').val();
		params.method = 'addNew';
		
		// 片断
		var _self = this;
		shr.doGet({
			url: _self.dynamicPage_url,
			data: params,
			success: function(response) {
				$('#form').first().hide();
				$('[id^=entry]').hide();
				$('[id^=uuid]').hide();
				$('.shr-multiRow').append(response);
				_self.afterMultiRowRender();
				_self.adjustIframeHeight();
			}
		});
	}
	/**
	 * 编辑
	 */
	,editAction: function(options) {
		isEdit = true;
		this.doEdit('edit', options);
	}
	,
	 editMainAction: function() {
	 	var  options = {};
	 	options.method='edit';
	 	options.uipk= 'com.kingdee.eas.hr.ats.app.HolidayPolicySet.form';
	 	options.billId=$('#form #id').val();
	 	this.reloadPage(options);		
				
	},validateSelectValue: function(){
		var v_uuid = this.uuid;
		$('#unit' + v_uuid).bind("change", function(){
			var holiayName = $('#holidayType' + v_uuid).val();
			var holiayTypeId = $('#holidayType' + v_uuid+'_el').val();
			if(holiayTypeId == yearlyVacationId){
				if($(this).attr("value") != jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_105){
					$(this).attr("value",'');
					shr.showWarning({message: jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_55});
				}
			}
			
		});
		
		var that = this;
		//如果是年假 单位只为天
		$('#holidayType' + v_uuid).bind("change", function(){
			  var _self = this;
			  //初始化假期控制开关：将所有开关全部打开
			  that.initControlProperty();
			  //根据假期类型来设置属性的开关 
			//   that.yearVacationDeal();
				that.yearOrTakeWorkVacationDeal();
			   var info = $('#holidayType' + v_uuid+'_el').attr('value');
			   if(info && info!='' && info != takeWorkingId){ 
				  var filter=" holidayType.id='"+info+"' ";
				  $("#holidayRule"+ v_uuid).shrPromptBox("setFilter",filter);
				  //重选假期类型后，清除额度规则值，需重选 
				  $('#takeWorkingRule' + v_uuid).removeAttr('validate');
				  $('#takeWorkingRule' + v_uuid).closest(".ui-promptBox-frame").removeClass("required");
			   }
			   else if(info && info!='' && info == takeWorkingId){
			   	 $('#takeWorkingRule' + v_uuid).attr('validate','{required:true}');
				 $('#takeWorkingRule' + v_uuid).closest(".ui-promptBox-frame").addClass("required");
			   }
			   
			$("#holidayRule"+ v_uuid).shrPromptBox("setValue",{
				id : "",
				name : ""
			});
		});
		
		$('#isCtrlLimit' + v_uuid).bind("change", function(){
			that.isCtrlLimitDeal();
		});
		var viewState = that.getOperateState();
		if('ADDNEW' == viewState){
			$('#isFillHoliday' + v_uuid).shrCheckbox("unCheck");
			$('#fillHolidayByTimeCtl' + v_uuid).attr("disabled", true);	 
			$('#fillHolidayByTimeCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			   
			$('#fillHolidayByCycleCtl' + v_uuid).attr("disabled", true);	 
			$('#fillHolidayByCycleCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			   
			var fillHolidayAmount = $("#fillHolidayAmount" + v_uuid);
			fillHolidayAmount.attr("disabled", true);	 
			fillHolidayAmount.closest("div").addClass("disabled");
			fillHolidayAmount.attr("value", "");
			var fillHolidayAmountUnit = $('#fillHolidayAmountUnit'+v_uuid);
		    fillHolidayAmountUnit.shrSelect("disable");
			fillHolidayAmountUnit.attr("value", "");
			$('#fillHolidayAmountUnit'+v_uuid + '_el').attr("value", "");
		    
		    var fillHolidayCycleType = $('#fillHolidayCycleType' + v_uuid);
			fillHolidayCycleType.shrSelect("disable");
			fillHolidayCycleType.attr("value", '');
			$('#fillHolidayCycleType' + v_uuid + '_el').attr("value", "");
		    var fillHolidayAfterDay = $('#fillHolidayAfterDay' + v_uuid);
		    fillHolidayAfterDay.attr("disabled", true);
		    fillHolidayAfterDay.closest("div").addClass("disabled");
			fillHolidayAfterDay.attr("value", "");
		}
		if('ADDNEW' == viewState){
			$('#isCancelLeave' + v_uuid).shrCheckbox("unCheck");
			$('#fillHolidayCelByTimeCtl' + v_uuid).attr("disabled", true);	 
			$('#fillHolidayCelByTimeCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			   
			$('#fillHolidayCelByCycleCtl' + v_uuid).attr("disabled", true);	 
			$('#fillHolidayCelByCycleCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			   
			var fillHolidayAmount = $("#fillHolidayCelAmount" + v_uuid);
			fillHolidayAmount.attr("disabled", true);	 
			fillHolidayAmount.closest("div").addClass("disabled");
			fillHolidayAmount.shrTextField("setValue","")
			var fillHolidayAmountUnit = $('#fillHolidayCelAmountUnit'+v_uuid);
		    fillHolidayAmountUnit.shrSelect("disable");
			fillHolidayAmountUnit.attr("value", "");
			$('#fillHolidayCelAmountUnit'+v_uuid + '_el').attr("value", "");
		    
		    var fillHolidayCycleType = $('#fillHolidayCelCycleType' + v_uuid);
			fillHolidayCycleType.shrSelect("disable");
			fillHolidayCycleType.attr("value", '');
			$('#fillHolidayCelCycleType' + v_uuid + '_el').attr("value", "");
		    var fillHolidayAfterDay = $('#fillHolidayCelAfterDay' + v_uuid);
		    fillHolidayAfterDay.attr("disabled", true);
		    fillHolidayAfterDay.closest("div").addClass("disabled");
			fillHolidayAfterDay.attr("value", "");
		}
		if('EDIT' == viewState){
			var isFillHoliday = $('#isFillHoliday' + v_uuid).attr("checked");
			if(!"checked" == isFillHoliday || !isFillHoliday){
			    $('#fillHolidayByTimeCtl' + v_uuid).attr("disabled", true);	 
			    $('#fillHolidayByTimeCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			   
			    $('#fillHolidayByCycleCtl' + v_uuid).attr("disabled", true);	 
			    $('#fillHolidayByCycleCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			}
			var fillHolidayByTimeCtlValue = $('#fillHolidayByTimeCtl' + v_uuid).attr("checked");
			if(!"checked" == fillHolidayByTimeCtlValue || !fillHolidayByTimeCtlValue){
				var fillHolidayAmount = $("#fillHolidayAmount" + v_uuid);
				fillHolidayAmount.attr("disabled", true);	 
				fillHolidayAmount.closest("div").addClass("disabled");
				fillHolidayAmount.attr("value", "");
				var fillHolidayAmountUnit = $('#fillHolidayAmountUnit'+v_uuid);
				fillHolidayAmountUnit.shrSelect("disable");
				fillHolidayAmountUnit.attr("value", "");
				$('#fillHolidayAmountUnit'+v_uuid + '_el').attr("value", "");
			}
			
			var fillHolidayByCycleCtl = $('#fillHolidayByCycleCtl' + v_uuid);
			var fillHolidayByCycleCtlValue = fillHolidayByCycleCtl.attr("checked");
			if(!"checked" == fillHolidayByCycleCtlValue || !fillHolidayByCycleCtlValue){
				var fillHolidayCycleType = $('#fillHolidayCycleType' + v_uuid);
				fillHolidayCycleType.shrSelect("disable");
				fillHolidayCycleType.attr("value", "");
				$('#fillHolidayCycleType' + v_uuid + "_el").attr("value", "")
				var fillHolidayAfterDay = $('#fillHolidayAfterDay' + v_uuid);
				fillHolidayAfterDay.attr("disabled", true);
				fillHolidayAfterDay.closest("div").addClass("disabled");
				fillHolidayAfterDay.attr("value", "");
			}
			var isFillHoliday = $('#isCancelLeave' + v_uuid).attr("checked");
			if(!"checked" == isFillHoliday || !isFillHoliday){
			    $('#fillHolidayCelByTimeCtl' + v_uuid).attr("disabled", true);	 
			    $('#fillHolidayCelByTimeCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			   
			    $('#fillHolidayCelByCycleCtl' + v_uuid).attr("disabled", true);	 
			    $('#fillHolidayCelByCycleCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			}
			var fillHolidayByTimeCtlValue = $('#fillHolidayCelByTimeCtl' + v_uuid).attr("checked");
			if(!"checked" == fillHolidayByTimeCtlValue || !fillHolidayByTimeCtlValue){
				var fillHolidayAmount = $("#fillHolidayCelAmount" + v_uuid);
				fillHolidayAmount.attr("disabled", true);	 
				fillHolidayAmount.closest("div").addClass("disabled");
				fillHolidayAmount.shrTextField("setValue","")
				var fillHolidayAmountUnit = $('#fillHolidayCelAmountUnit'+v_uuid);
				fillHolidayAmountUnit.shrSelect("disable");
				fillHolidayAmountUnit.attr("value", "");
				$('#fillHolidayCelAmountUnit'+v_uuid + '_el').attr("value", "");
			}
			
			var fillHolidayByCycleCtl = $('#fillHolidayCelByCycleCtl' + v_uuid);
			var fillHolidayByCycleCtlValue = fillHolidayByCycleCtl.attr("checked");
			if(!"checked" == fillHolidayByCycleCtlValue || !fillHolidayByCycleCtlValue){
				var fillHolidayCycleType = $('#fillHolidayCelCycleType' + v_uuid);
				fillHolidayCycleType.shrSelect("disable");
				fillHolidayCycleType.attr("value", "");
				$('#fillHolidayCelCycleType' + v_uuid + "_el").attr("value", "")
				var fillHolidayAfterDay = $('#fillHolidayCelAfterDay' + v_uuid);
				fillHolidayAfterDay.attr("disabled", true);
				fillHolidayAfterDay.closest("div").addClass("disabled");
				fillHolidayAfterDay.attr("value", "");
			}
		}
		that.bindSubFillHolidayCtl();
		$("#isFillHoliday" + v_uuid).bind("change", function(){
		    that.isFillHolidayDeal();
		});
		$("#isCancelLeave" + v_uuid).bind("change", function(){
		    that.isCancelLeaveDeal();
		});

		$('#isOver' + v_uuid).shrCheckbox();
		$('#isOver' + v_uuid).shrCheckbox("onChange", function(){
			that.isOverDeal();
		});
		
		$('#unit' + v_uuid).bind("change", function(){
			that.initailValueLabelEdit(v_uuid);
		});

	},
	/*
	 * function:每次当选择假期类型的时候：首先将所有控制属性就保持可编辑状态
	 */
	initControlProperty : function(){
		var v_uuid = this.uuid;
	    //已弃用--当选择了调休假的时候：将调休假的单位设置为小时--
		//调休假可以设置为天
		//$('#unit' + v_uuid).val();
		//$('#unit' + v_uuid + '_el').val();
		//$('#unit' + v_uuid).shrSelect("enable");
		
		//是否启动周期
		$('#enablePeriod' + v_uuid).attr('disabled', false);
		$('#enablePeriod' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		$('#enablePeriod' + v_uuid).attr("checked", false);
		$('#enablePeriod' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
		
		//周期长度
		$('#periodLength' + v_uuid).val();
		$('#periodLength' + v_uuid).attr('disabled', false);
		
		
		//周期单位
		$('#periodLengthUnit' + v_uuid).val('');
		$('#periodLengthUnit' + v_uuid + '_el').val('');
		$('#periodLengthUnit' + v_uuid).shrSelect("enable");
		
		//控制单位额度
		$('#enableMinAmt' + v_uuid).attr('disabled', false);
		$('#enableMinAmt' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		$('#enableMinAmt' + v_uuid).attr("checked", false);
		$('#enableMinAmt' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
			
		//单位额度
		$('#minAmt' + v_uuid).val('');
		$('#minAmt' + v_uuid).attr("disabled", false);
		
		
	 	//控制假期额度不许修改
		$('#isCtrlLimit' + v_uuid).attr('disabled', false);
		$('#isCtrlLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		$('#isCtrlLimit' + v_uuid).attr("checked", false);
		$('#isCtrlLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
		
		
		//出现额度规则
//		$('#holidayRule' + v_uuid).parents('.one_of_three').eq(0).show();
		$('#holidayRule' + v_uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:block');
		$('#holidayRule' + v_uuid + '_el').val('');
		$('#holidayRule' + v_uuid).val('');
       
		//置空调休规则
//		$('#takeWorkingRule' + v_uuid).parents('.one_of_three').eq(0).hide();
		$('#takeWorkingRule' + v_uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:none');
		$('#takeWorkingRule' + v_uuid + '_el').val('');
		$('#takeWorkingRule' + v_uuid).val('');
 
		// 是否允许超额请假
		$('#isOver' + v_uuid).shrCheckbox("enable");
		$('#isOver' + v_uuid).shrCheckbox("unCheck");

		//超出额度下期扣减
		$('#isOverAutoSub' + v_uuid).attr("disabled", false);
		$('#isOverAutoSub' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		$('#isOverAutoSub' + v_uuid).attr("checked", false);
		$('#isOverAutoSub' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");

		//是否允许修改额度
		$('#isCanModifyLimit' + v_uuid).attr("disabled", false);
		$('#isCanModifyLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		$('#isCanModifyLimit' + v_uuid).attr("checked", false);
		$('#isCanModifyLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");

		//包括法定假日
		$('#isIncludeLegal' + v_uuid).attr("disabled", false);
		$('#isIncludeLegal' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		$('#isIncludeLegal' + v_uuid).attr("checked", false);
		$('#isIncludeLegal' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");

		//包括公休日
		$('#isIncludeRest' + v_uuid).attr("disabled", false);
		$('#isIncludeRest' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		$('#isIncludeRest' + v_uuid).attr("checked", false);
		$('#isIncludeRest' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");

	}
	,initYearOrTakeWorkVacationDeal: function(){
		var that = this;
		var v_uuid = this.uuid;
		var holiayName = $('#holidayType' + v_uuid).val();
		var holiayTypeId = $('#holidayType' + v_uuid+'_el').val();
		if(holiayTypeId == yearlyVacationId){
			$('#unit' + v_uuid)
				.attr("value",jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_105);
			$('#unit' + v_uuid).shrSelect("disable");

			//启动周期”参数自动勾选，周期长度自动赋值为"1"，单位“年” 且不可编辑   是否控制假期额度 选中 且不可编辑
			$('#enablePeriod' + v_uuid).attr("checked", true);
			$('#enablePeriod' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("checked");
			$('#enablePeriod' + v_uuid).attr('disabled',true);


			$('#periodLength'+v_uuid).shrTextField('setValue','1');
			$('#periodLength'+v_uuid).attr('disabled',true);
			$('#periodLength'+v_uuid).closest(".ui-text-frame").eq(0).addClass('disabled');

			$('#periodLengthUnit'+v_uuid)
				.attr("value",jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_49);
			$('#periodLengthUnit' + v_uuid+'_el').attr('value','1');
			$('#periodLengthUnit' + v_uuid).shrSelect("disable");

			$('#isCtrlLimit' + v_uuid).attr("checked", true);
			$('#isCtrlLimit' + v_uuid).attr('disabled',true);
			$('#isCtrlLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("checked");
		}

		var that = this;
		that.isCtrlLimitDeal();
		
	}
	,yearOrTakeWorkVacationDeal: function(){
		var that = this;
		var v_uuid = that.uuid;
		var holiayName = $('#holidayType' + v_uuid).val();
		var holiayTypeId = $('#holidayType' + v_uuid+'_el').val();
		if(holiayTypeId == yearlyVacationId){
			$('#unit' + v_uuid)
				.attr("value",jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_105);
			$('#unit' + v_uuid+'_el').attr('value','1');
			$('#unit' + v_uuid).shrSelect("disable");
			that.initailValueLabelEdit(v_uuid);
			//“启动周期”参数自动勾选，周期长度自动赋值为"1"，单位“年” 且不可编辑   是否控制假期额度 选中 且不可编辑
			$('#enablePeriod' + v_uuid).attr("checked", true);	 
			$('#enablePeriod' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("checked");
			$('#enablePeriod' + v_uuid).attr('disabled',true);
			
						
			$('#periodLength'+v_uuid).shrTextField('setValue','1');
			$('#periodLength'+v_uuid).attr('disabled',true);
			$('#periodLength'+v_uuid).closest(".ui-text-frame").eq(0).addClass('disabled');
			
			$('#periodLengthUnit'+v_uuid)
				.attr("value",jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_49);
			$('#periodLengthUnit' + v_uuid+'_el').attr('value','1');
			$('#periodLengthUnit' + v_uuid).shrSelect("disable");
			$('#isCtrlLimit' + v_uuid).attr("checked", true);
			$('#isCtrlLimit' + v_uuid).attr('disabled',true);	
			$('#isCtrlLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("checked");
		} else {
			$('#unit' + v_uuid).shrSelect("enable");
		
			// 启动周期 周期长度 单位
			$('#enablePeriod' + v_uuid).attr("checked", false);	 
			$('#enablePeriod' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
			$('#enablePeriod' + v_uuid).attr('disabled',false);
			
			$('#periodLength'+v_uuid).shrTextField('setValue','');
			$('#periodLength'+v_uuid).attr('disabled',false);
			$('#periodLength'+v_uuid).closest(".ui-text-frame").eq(0).removeClass('disabled');
			
			$('#periodLengthUnit'+v_uuid).attr('value','');
			$('#periodLengthUnit' + v_uuid).shrSelect("enable");
			
			$('#isCtrlLimit' + v_uuid).attr("checked", false);
			$('#isCtrlLimit' + v_uuid).attr('disabled',false);
			$('#isCtrlLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
			
			if(takeWorkingId == $('#holidayType' + v_uuid +　"_el").val()){
				this.takeWorkingRule();
			}
			else{
				$('#isOver' + v_uuid).shrCheckbox("disable");	 
				$('#isOver' + v_uuid).shrCheckbox("unCheck");

				$('#holidayRule' + v_uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:block');
				$('#takeWorkingRule' + v_uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:none');
				
			}
		}
		
		var that = this;
		that.isCtrlLimitDeal();
	}
	/**
	*当假期类型为：调休假时：只有请假单位；是否允许请假确认；是否控制假期额度来控制
	*/
	,takeWorkingRule: function(){
		var v_uuid = this.uuid;
		//已弃用--当选择了调休假的时候：将调休假的单位设置为小时--
		//调休假可以设置为天
		//$('#unit' + v_uuid).val();
		//$('#unit' + v_uuid + '_el').val();
		//$('#unit' + v_uuid).shrSelect("enable");
		
		//是否启动周期
		$('#enablePeriod' + v_uuid).attr('disabled', true);
		$('#enablePeriod' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		$('#enablePeriod' + v_uuid).attr("checked", false);
		$('#enablePeriod' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
		
		
		//周期长度
		$('#periodLength' + v_uuid).val('');
		$('#periodLength' + v_uuid).attr('disabled', true);
		
		//周期单位
		$('#periodLengthUnit' + v_uuid).val('');
		$('#periodLengthUnit' + v_uuid + '_el').val('');
		$('#periodLengthUnit' + v_uuid).shrSelect("disable");
		
		//控制假期额度默认是不勾选的 
		if (this.getOperateState() == 'ADDNEW')
		{
			$('#isCtrlLimit' + v_uuid).attr("checked", false);
		    $('#isCtrlLimit' + v_uuid).attr('disabled', false);
		    $('#isCtrlLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
		
			// 是否允许超额请假
			$('#isOver' + v_uuid).shrCheckbox("enable"); 
			$('#isOver' + v_uuid).shrCheckbox("unCheck");

			//超出额度下期扣减
			$('#isOverAutoSub' + v_uuid).attr("disabled", false);	 
			// $('#isOverAutoSub' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			$('#isOverAutoSub' + v_uuid).attr("checked", false);
			$('#isOverAutoSub' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
		}
		
		//当选择调休假的时候出现的是调休的规则
		$('#holidayRule' + v_uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:none');
		$('#holidayRule' + v_uuid + '_el').val('');
		$('#holidayRule' + v_uuid).val('');

		$('#takeWorkingRule' + v_uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:block');
		$('#takeWorkingRule' + v_uuid).attr('validate','{required:true}');
		$('#takeWorkingRule' + v_uuid).closest(".ui-promptBox-frame").addClass("required");
		
		//是否允许修改额度
		/**
		$('#isCanModifyLimit' + v_uuid).attr("disabled", true);
		$('#isCanModifyLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		$('#isCanModifyLimit' + v_uuid).attr("checked", false);
		$('#isCanModifyLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
		**/
		//包括法定假日
		$('#isIncludeLegal' + v_uuid).attr("disabled", true);
		$('#isIncludeLegal' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		$('#isIncludeLegal' + v_uuid).attr("checked", false);
		$('#isIncludeLegal' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
      
		//包括公休日
		$('#isIncludeRest' + v_uuid).attr("disabled", true);
		$('#isIncludeRest' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		$('#isIncludeRest' + v_uuid).attr("checked", false);
		$('#isIncludeRest' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");

		
	},
	_islimitGrantStyleChange: function () {
	    // 启动周期 && 周期长度为1 周期单位为年 && 启动是否控制假期额度
		var v_uuid = this.uuid;
		return $('#enablePeriod' + v_uuid).attr('checked') == "checked" &&
			$('#periodLength' + v_uuid).shrTextField("getValue") == "1" &&
			$('#periodLengthUnit' + v_uuid).shrSelect("getValue").value == "1" &&
			$('#isCtrlLimit' + v_uuid).attr('checked') == "checked";
	},
	limitGrantStyleChange: function () {
		var that = this;
        if (this._islimitGrantStyleChange()) {
			$("#limitGrantStyle" + that.uuid).shrSelect("enable");
		} else {
			$("#limitGrantStyle" + that.uuid).shrSelect("disable");
			$("#limitGrantStyle" + that.uuid).shrSelect("setValue", 1); // 禁用的时候默认是不分配
		}

	}, isCtrlLimitDeal: function(){
		var that = this;
		if (that.getOperateState() == 'VIEW') {
			return
		}

		var v_uuid = this.uuid;
		var isCtrlLimit = $('#isCtrlLimit' + v_uuid).attr('checked') == "checked";
		if(isCtrlLimit){
			$('#isOver' + v_uuid).shrCheckbox("enable");
		} else {
			$('#isOver' + v_uuid).shrCheckbox("disable");
			$('#isOver' + v_uuid).shrCheckbox("unCheck");
		}

		that.isOverDeal();

		//根据是否控制假期额度 来设置分期发放方式是否可编辑
        this.limitGrantStyleChange();

		$('#holidayRule' + v_uuid).attr("disabled", false);
		$('#holidayRule' + v_uuid).parent().next('.ui-promptBox-icon').css("display","");

		//通过假期类型过滤额度规则  其实并没有啥卵用，保持一下
		var info = $('#holidayType' + v_uuid+'_el').attr('value');
		if(info && info!='') {
			var filter=" holidayType.id='"+info+"' ";
			$("#holidayRule"+ v_uuid).shrPromptBox("setFilter",filter);
	   }
	},
	bindSubFillHolidayCtl : function(){
		var that = this;
		var v_uuid = this.uuid;
		$('#fillHolidayByTimeCtl' + v_uuid).bind("change", function(){
	       	  var fillHolidayByTimeCtl = $('#fillHolidayByTimeCtl' + v_uuid).attr('checked');
	       	  if("checked" == fillHolidayByTimeCtl){
			       var fillHolidayAmount = $("#fillHolidayAmount" + v_uuid);
				   fillHolidayAmount.attr("disabled", false);	
				   fillHolidayAmount.closest("div").removeClass("disabled");
				   //fillHolidayAmount.attr("value", '3');
				   fillHolidayAmount.shrTextField("setValue",3)
				   var fillHolidayAmountUnit = $('#fillHolidayAmountUnit'+v_uuid);
			       fillHolidayAmountUnit.shrSelect("enable");
				   fillHolidayAmountUnit.attr("value", jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_117);
                   $('#fillHolidayAmountUnit'+v_uuid+'_el').attr("value",'2');
	       	  }else{
	       	  	   var fillHolidayAmount = $("#fillHolidayAmount" + v_uuid);
				   fillHolidayAmount.attr("disabled", true);	
				   fillHolidayAmount.closest("div").addClass("disabled");
				   fillHolidayAmount.attr("value", '');
			       var fillHolidayAmountUnit = $('#fillHolidayAmountUnit'+v_uuid);
			       fillHolidayAmountUnit.shrSelect("disable"); 
                   fillHolidayAmountUnit.attr('value','');
                   $('#fillHolidayAmountUnit'+v_uuid+'_el').attr('value','');
	       	  }
	           
	    });
		   
		$('#fillHolidayByCycleCtl' + v_uuid).bind("change", function(){
	          var fillHolidayByCycleCtl = $('#fillHolidayByCycleCtl' + v_uuid).attr('checked');
	          if("checked" == fillHolidayByCycleCtl){
				   var fillHolidayCycleType = $('#fillHolidayCycleType' + v_uuid);
	       	       fillHolidayCycleType.shrSelect("enable");
				   fillHolidayCycleType.attr("value", jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_124);
				   $('#fillHolidayCycleType' + v_uuid + '_el').attr("value", "0");
	               var fillHolidayAfterDay = $('#fillHolidayAfterDay' + v_uuid);
	               fillHolidayAfterDay.attr("disabled", false);
	               fillHolidayAfterDay.closest("div").removeClass("disabled");
				   fillHolidayAfterDay.attr("value", '0');
	       	  }else{
				  var  fillHolidayCycleType = $('#fillHolidayCycleType' + v_uuid);
	       	      fillHolidayCycleType.shrSelect("disable");
				  fillHolidayCycleType.attr("value", '');
				  $('#fillHolidayCycleType' + v_uuid + '_el').attr("value", '');
			       var fillHolidayAfterDay = $('#fillHolidayAfterDay' + v_uuid);
			       fillHolidayAfterDay.attr("disabled", true);
			       fillHolidayAfterDay.closest("div").addClass("disabled");
				   fillHolidayAfterDay.attr("value", '');
	       	  }
	    });
	    $('#fillHolidayCelByTimeCtl' + v_uuid).bind("change", function(){
	       	  var fillHolidayByTimeCtl = $('#fillHolidayCelByTimeCtl' + v_uuid).attr('checked');
	       	  if("checked" == fillHolidayByTimeCtl){
			       var fillHolidayAmount = $("#fillHolidayCelAmount" + v_uuid);
				   fillHolidayAmount.attr("disabled", false);	
				   fillHolidayAmount.closest("div").removeClass("disabled");
				   fillHolidayAmount.shrTextField("setValue",3)
				   //fillHolidayAmount.attr("value", '3');
				   var fillHolidayAmountUnit = $('#fillHolidayCelAmountUnit'+v_uuid);
			       fillHolidayAmountUnit.shrSelect("enable");
				   fillHolidayAmountUnit.attr("value", jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_117);
                   $('#fillHolidayCelAmountUnit'+v_uuid+'_el').attr("value",'2');
	       	  }else{
	       	  	   var fillHolidayAmount = $("#fillHolidayCelAmount" + v_uuid);
				   fillHolidayAmount.attr("disabled", true);	
				   fillHolidayAmount.closest("div").addClass("disabled");
				   fillHolidayAmount.shrTextField("setValue",'')
			       var fillHolidayAmountUnit = $('#fillHolidayCelAmountUnit'+v_uuid);
			       fillHolidayAmountUnit.shrSelect("disable"); 
                   fillHolidayAmountUnit.attr('value','');
                   $('#fillHolidayCelAmountUnit'+v_uuid+'_el').attr('value','');
                   //没有选中，隐藏label
				   $("[for='fillHolidayCelAmount" + v_uuid  + "']").hide();
	       	  }
	           
	    });
		   
		$('#fillHolidayCelByCycleCtl' + v_uuid).bind("change", function(){
	          var fillHolidayByCycleCtl = $('#fillHolidayCelByCycleCtl' + v_uuid).attr('checked');
	          if("checked" == fillHolidayByCycleCtl){
				   var fillHolidayCycleType = $('#fillHolidayCelCycleType' + v_uuid);
	       	       fillHolidayCycleType.shrSelect("enable");
				   fillHolidayCycleType.attr("value", jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_124);
				   $('#fillHolidayCelCycleType' + v_uuid + '_el').attr("value", "0");
	               var fillHolidayAfterDay = $('#fillHolidayCelAfterDay' + v_uuid);
	               fillHolidayAfterDay.attr("disabled", false);
	               fillHolidayAfterDay.closest("div").removeClass("disabled");
				   fillHolidayAfterDay.attr("value", '0');
				   fillHolidayAfterDay.shrTextField("setValue", '0');
	       	  }else{
				  var  fillHolidayCycleType = $('#fillHolidayCelCycleType' + v_uuid);
	       	      fillHolidayCycleType.shrSelect("disable");
				  fillHolidayCycleType.attr("value", '');
				  $('#fillHolidayCelCycleType' + v_uuid + '_el').attr("value", '');
			       var fillHolidayAfterDay = $('#fillHolidayCelAfterDay' + v_uuid);
			       fillHolidayAfterDay.attr("disabled", true);
			       fillHolidayAfterDay.closest("div").addClass("disabled");
				   fillHolidayAfterDay.attr("value", '');
				   fillHolidayAfterDay.shrTextField("setValue", '');
	       	  }
	    });
	},
	isCancelLeaveDeal : function(){
		 var v_uuid = this.uuid;
	var isCancelLeave = $('#isCancelLeave' + v_uuid).attr('checked');
		if("checked" == isCancelLeave){
		   $('#fillHolidayCelByTimeCtl' + v_uuid).attr("disabled", false);	 
		   $('#fillHolidayCelByTimeCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		   
		   $('#fillHolidayCelByCycleCtl' + v_uuid).attr("disabled", false);	 
		   $('#fillHolidayCelByCycleCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
	       
		}else{
		   $('#fillHolidayCelByTimeCtl' + v_uuid).attr("disabled", true);	 
		   $('#fillHolidayCelByTimeCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		   
		   $('#fillHolidayCelByCycleCtl' + v_uuid).attr("disabled", true);	 
		   $('#fillHolidayCelByCycleCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		   
		   $('#fillHolidayCelByTimeCtl' + v_uuid).shrCheckbox("unCheck");
		   $('#fillHolidayCelByCycleCtl' + v_uuid).shrCheckbox("unCheck");
		}
	
	},
	isFillHolidayDeal : function(){
	    var v_uuid = this.uuid;
		var isFillHoliday = $('#isFillHoliday' + v_uuid).attr('checked');
		if("checked" == isFillHoliday){
		   $('#fillHolidayByTimeCtl' + v_uuid).attr("disabled", false);	 
		   $('#fillHolidayByTimeCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		   
		   $('#fillHolidayByCycleCtl' + v_uuid).attr("disabled", false);	 
		   $('#fillHolidayByCycleCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
	       
		}else{
		   $('#fillHolidayByTimeCtl' + v_uuid).attr("disabled", true);	 
		   $('#fillHolidayByTimeCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		   
		   $('#fillHolidayByCycleCtl' + v_uuid).attr("disabled", true);	 
		   $('#fillHolidayByCycleCtl' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		   
		   $('#fillHolidayByTimeCtl' + v_uuid).shrCheckbox("unCheck");
		   $('#fillHolidayByCycleCtl' + v_uuid).shrCheckbox("unCheck");
		}
		
	}
	,isOverDeal: function(){
		var v_uuid = this.uuid;
		//过滤调休假
		if($('#isOver' + v_uuid).shrCheckbox("getValue")){
			$('#isOverAutoSub' + v_uuid).attr("disabled", false);
			$('#isOverAutoSub' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");

			$('#isNeedAttachOver' + v_uuid).attr("disabled", false);
			$('#isNeedAttachOver' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		}else{
			$('#isOverAutoSub' + v_uuid).attr("disabled", true);
			$('#isOverAutoSub' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			$('#isOverAutoSub' + v_uuid).attr("checked", false);
			$('#isOverAutoSub' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");

			$('#isNeedAttachOver' + v_uuid).attr("disabled", true);
			$('#isNeedAttachOver' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			$('#isNeedAttachOver' + v_uuid).attr("checked", false);
			$('#isNeedAttachOver' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
		}
	}
	,isMoreOneYear: function(amount,unit){
		if(unit==jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_49&&amount>1){
		return jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_2;
		}else if(unit==jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_117&&amount>12){
		return jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_1;
		}else if(unit==jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_105&&amount>365){
		return jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_3;
		}else{
		return "";
		}
	}
	,showTakeWorkingRule: function(){
		var v_uuid = this.uuid;
	    //已弃用--当选择了调休假的时候：将调休假的单位设置为小时--
		//调休假可以设置为天
		//$('#unit' + v_uuid + "_el").val(2);
		//$('#unit' + v_uuid).val("小时");
		//$('#unit' + v_uuid).shrSelect("disable");
		
		//是否启动周期
		$('#enablePeriod' + v_uuid).attr('disabled', true);
		$('#enablePeriod' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		$('#enablePeriod' + v_uuid).attr("checked", false);
		$('#enablePeriod' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
		
		//周期长度
		$('#periodLength' + v_uuid).val('');
		$('#periodLength' + v_uuid).attr('disabled', true);
		
		//周期单位
		$('#periodLengthUnit' + v_uuid).val('');
		$('#periodLengthUnit' + v_uuid + '_el').val('');
		$('#periodLengthUnit' + v_uuid).shrSelect("disable");
		
		//控制单位额度
		$('#enableMinAmt' + v_uuid).attr('disabled', true);
		$('#enableMinAmt' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		$('#enablePeriod' + v_uuid).attr("checked", false);
		$('#enableMinAmt' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
			
		//单位额度
		$('#minAmt' + v_uuid).val('');
		$('#minAmt' + v_uuid).attr("disabled", true);
		
		//是否允许补请假
		$('#isFillHoliday' + v_uuid).attr("disabled", true);
		$('#isFillHoliday' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		$('#isFillHoliday' + v_uuid).attr("checked", false);
		$('#isFillHoliday' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
		
		//补请假期限
		$('#fillHolidayAmount' + v_uuid).val('');
		$('#fillHolidayAmount' + v_uuid).attr("disabled", true);

		//补请假期限单位
		$('#fillHolidayAmountUnit' + v_uuid).val('');
		$('#fillHolidayAmountUnit' + v_uuid + "_el").val('');
		$('#fillHolidayAmountUnit' + v_uuid).shrSelect("disable");
		
	 	//控制假期额度不许修改
		$('#isCtrlLimit' + v_uuid).attr("checked", false);
		$('#isCtrlLimit' + v_uuid).attr('disabled', false);
		$('#isCtrlLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
	 
		
		//当选择调休假的时候出现的是调休的规则
//		$('#holidayRule' + v_uuid).parents('.one_of_three').eq(0).hide();
		$('#holidayRule' + v_uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:none');
		$('#holidayRule' + v_uuid + '_el').val('');
		$('#holidayRule' + v_uuid).val('');

//		$('#takeWorkingRule' + v_uuid).parents('.one_of_three').eq(0).show();
 		$('#takeWorkingRule' + v_uuid).closest('div [data-ctrlrole="labelContainer"]').attr('style','display:block');
		// 是否允许超额请假
		$('#isOver' + v_uuid).shrCheckbox("enable"); 
		$('#isOver' + v_uuid).shrCheckbox("unCheck");

		//是否允许修改额度
		$('#isCanModifyLimit' + v_uuid).attr("disabled", true);
		$('#isCanModifyLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		$('#isCanModifyLimit' + v_uuid).attr("checked", false);
		$('#isCanModifyLimit' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
		
		//包括法定假日
		$('#isIncludeLegal' + v_uuid).attr("disabled", true);
		$('#isIncludeLegal' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		$('#isIncludeLegal' + v_uuid).attr("checked", false);
		$('#isIncludeLegal' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
      
		//包括公休日
		$('#isIncludeRest' + v_uuid).attr("disabled", true);
		$('#isIncludeRest' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		$('#isIncludeRest' + v_uuid).attr("checked", false);
		$('#isIncludeRest' + v_uuid).closest(".icheckbox_minimal-grey").eq(0).removeClass("checked");
	},
	initViewPage: function(){
		var that = this;
		if (that.getOperateState() == 'VIEW') {
			//控制单位额度
			var enableMinAmtArr = $('span[id ^= "enableMinAmt"]');
			for(var i=0;i<enableMinAmtArr.length;i++){
				var enableMinAmt = $(enableMinAmtArr[i]).attr("value");
				var curId = $(enableMinAmtArr[i]).attr("id");
				var uuid = curId.substring("enableMinAmt".length,curId.length);
				if(enableMinAmt == "0"){
					$("#minAmtValueMtd" + uuid).text("");
				}
			}
			//控制请假单位时长
			var enableLeaveLengthArr = $('span[id ^= "enableLeaveLength"]');
			for(var i=0;i<enableLeaveLengthArr.length;i++){
				var enableLeaveLength = $(enableLeaveLengthArr[i]).attr("value");
				var curId = $(enableLeaveLengthArr[i]).attr("id");
				var uuid = curId.substring("enableLeaveLength".length,curId.length);
				if(enableLeaveLength == "0"){
					$("#minLeaveLengthVMtd" + uuid).text("");
				}
			}
		}
		// groupTitle兼容
		$('.groupTitle').before("<i style='width: 100%;border-top: 1px dashed #ccc;display: block;position: absolute;top: 1.3rem'></i>");
        $('.groupTitle').parent().css({position:'relative', paddingTop: '50px'});
		$('.groupTitle').css({position:'absolute', top: 0,left: "50px",background: '#fff',marginLeft: 0, color: '#555',fontSize: '12px'});
		$('[name=addNew]').hide();
		setTimeout(function(){
			$('.col-lg-3').removeClass('col-lg-3').addClass('col-lg-4');
			$('.col-lg-1').hide();
			$('.col-lg-8').remove();
			$('[title="' + jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_19 + '"]')
				.text(jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_92);
			$('[title="' + jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_12 + '"]')
				.parent().parent().find($('.col-lg-1')).show();
		},0)
	},
	initEveryFillHolidayView : function(lastValue){
		    var that = this;
			//保证只执行一次，因为有几个类型就会执行几次initalizeDOM方法
			if (that.getOperateState() == 'VIEW') {
				//是否允许补请假
				    var isFillHolidayArr =  $('span[id ^= "isFillHoliday' + lastValue + '"]');
				    var fillHolidayByTimeCtlArr = $('span[id ^= "fillHolidayByTimeCtl' + lastValue + '"]');
				    var fillHolidayAmountArr = $('span[id ^= "fillHolidayAmount' + lastValue + '"]');
				    var fillHolidayAmountUnitArr = $('span[id ^= "fillHolidayAmountUnit' + lastValue + '"]');
				    var fillHolidayByCycleCtlArr = $('span[id ^= "fillHolidayByCycleCtl' + lastValue + '"]');
				    var fillHolidayCycleTypeArr = $('span[id ^= "fillHolidayCycleType' + lastValue + '"]');
				    var fillHolidayAfterDayArr = $('span[id ^= "fillHolidayAfterDay' + lastValue + '"]');
					for(var i=0;i<isFillHolidayArr.length;i++){
						var isFillHolidayParentDiv = $(isFillHolidayArr[i]).closest("div");
						var isFillHolidayParentPrevDiv = isFillHolidayParentDiv.prev();
						
						var fillHolidayByTimeCtlVale = $(fillHolidayByTimeCtlArr[i]).attr("value");
						var fillHolidayByTimeCtlParentDiv = $(fillHolidayByTimeCtlArr[i]).closest("div");
						var fillHolidayByTimeCtlParentPrevDiv = fillHolidayByTimeCtlParentDiv.prev();
						
						var fillHolidayAmountParentDiv = $(fillHolidayAmountArr[i]).closest("div");
						var fillHolidayAmountParentPrevDiv = fillHolidayAmountParentDiv.prev();
						
						if("0" == fillHolidayByTimeCtlVale){
						   fillHolidayAmountParentDiv.hide();
						   fillHolidayAmountParentDiv.next().hide();
						}
						
						var fillHolidayByCycleCtlValue = $(fillHolidayByCycleCtlArr[i]).attr("value");

						var fillHolidayByCycleCtl = $(fillHolidayByCycleCtlArr[i]).closest("div");

						var fillHolidayByCycleCtlParentPrevDiv = fillHolidayByCycleCtl.prev();

						
						var fillHolidayCycleType = $(fillHolidayCycleTypeArr[i]).closest("div");

						var fillHolidayCycleTypeParentPrevDiv = fillHolidayCycleType.prev();

						
						if("0" == fillHolidayByCycleCtlValue){
						    fillHolidayCycleType.hide();
						    fillHolidayCycleType.next().hide();
						}
						
					}
					
			}
			if (that.getOperateState() == 'VIEW') {
				//是否允许补请假
				    var isFillHolidayArr =  $('span[id ^= "isCancelLeave' + lastValue + '"]');
				    var fillHolidayByTimeCtlArr = $('span[id ^= "fillHolidayCelByTimeCtl' + lastValue + '"]');
				    var fillHolidayAmountArr = $('span[id ^= "fillHolidayCelAmount' + lastValue + '"]');
				    var fillHolidayAmountUnitArr = $('span[id ^= "fillHolidayCelAmountUnit' + lastValue + '"]');
				    var fillHolidayByCycleCtlArr = $('span[id ^= "fillHolidayCelByCycleCtl' + lastValue + '"]');
				    var fillHolidayCycleTypeArr = $('span[id ^= "fillHolidayCelCycleType' + lastValue + '"]');
				    var fillHolidayAfterDayArr = $('span[id ^= "fillHolidayCelAfterDay' + lastValue + '"]');
					for(var i=0;i<isFillHolidayArr.length;i++){
						var isFillHolidayParentDiv = $(isFillHolidayArr[i]).closest("div");
						var isFillHolidayParentPrevDiv = isFillHolidayParentDiv.prev();
						
						var fillHolidayByTimeCtlVale = $(fillHolidayByTimeCtlArr[i]).attr("value");
						var fillHolidayByTimeCtlParentDiv = $(fillHolidayByTimeCtlArr[i]).closest("div");
						var fillHolidayByTimeCtlParentPrevDiv = fillHolidayByTimeCtlParentDiv.prev();
						
						var fillHolidayAmountParentDiv = $(fillHolidayAmountArr[i]).closest("div");
						var fillHolidayAmountParentPrevDiv = fillHolidayAmountParentDiv.prev();
						if("0" == fillHolidayByTimeCtlVale){
						   fillHolidayAmountParentDiv.hide();
						   fillHolidayAmountParentDiv.next().hide();
						}
						
						var fillHolidayByCycleCtlValue = $(fillHolidayByCycleCtlArr[i]).attr("value");
						var fillHolidayByCycleCtl = $(fillHolidayByCycleCtlArr[i]).closest("div");
						var fillHolidayByCycleCtlParentPrevDiv = fillHolidayByCycleCtl.prev();
						
						var fillHolidayCycleType = $(fillHolidayCycleTypeArr[i]).closest("div");
						var fillHolidayCycleTypeParentPrevDiv = fillHolidayCycleType.prev();
						if("0" == fillHolidayByCycleCtlValue){
						    fillHolidayCycleType.hide();
						    fillHolidayCycleType.next().hide();
						}
						
					}
					
			}
    },
    hideParams : function(lastParam){
    	var that = this;
    	var viewState = that.getOperateState();
    	if ('VIEW' == viewState) {
              var holidayTypeArr =  $('span[id ^= "holidayType' + lastParam + '"]');
              var enablePeriodeArr = $('span[id ^= "enablePeriod' + lastParam + '"]');
              var periodLengthArr = $('span[id ^= "periodLength' + lastParam + '"]');
              var periodLengthUniteArr = $('span[id ^= "periodLengthUnit' + lastParam + '"]');
              var isOverArr = $('span[id ^= "isOver' + lastParam + '"]');
              for(var i=0;i<holidayTypeArr.length;i++){
                   //var holidayTypeName = $(holidayTypeArr[i]).text();
				    var holidayTypeid = $(holidayTypeArr[i]).attr("value");
                   if(holidayTypeid){

	                   if(takeWorkingId == holidayTypeid){//调休假
												//$(enablePeriodeArr[i]).closest(".row-fluid").hide();
												$(enablePeriodeArr[i]).closest('div[data-ctrlrole="labelContainer"]').hide();
												$(periodLengthArr[i]).closest('div[data-ctrlrole="labelContainer"]').hide();
												$(periodLengthUniteArr[i]).closest('div[data-ctrlrole="labelContainer"]').hide();
	                      $(isOverArr[i]).closest(".row-fluid").show();
	                      //$(limitGrantStyleArr[i]).closest(".row-fluid").hide();
	                   }else if(yearlyVacationId == holidayTypeid){//年假
	                      $(enablePeriodeArr[i]).closest(".row-fluid").show();
	                      $(isOverArr[i]).closest(".row-fluid").show();
	                       //$(limitGrantStyleArr[i]).closest(".row-fluid").show();
	                   }else{
	                      $(enablePeriodeArr[i]).closest(".row-fluid").show();
	                      $(isOverArr[i]).closest(".row-fluid").show();
	                      //$(limitGrantStyleArr[i]).closest(".row-fluid").hide();
	                   }
                   }
              }
    	}else if('EDIT' == viewState || 'ADDNEW' == viewState){
    	   var v_uuid=this.uuid;
    	  // var holidayType = $('#holidayType' + v_uuid).attr("title");
			var holidayTypeId = $('#holidayType' + v_uuid).shrPromptBox("getValue").id;
			 if(takeWorkingId == holidayTypeId){
					 $("#enablePeriod" + v_uuid).closest('div[data-ctrlrole="labelContainer"]').hide();
					 $("#periodLength" + v_uuid).closest('div[data-ctrlrole="labelContainer"]').hide();
					 $("#periodLengthUnit" + v_uuid).closest('div[data-ctrlrole="labelContainer"]').hide();
					 $("#isOver" + v_uuid).closest(".row-fluid").show();
			  }else if(yearlyVacationId == holidayTypeId){
					 $("#enablePeriod" + v_uuid).closest(".row-fluid").show();
					 $("#isOver" + v_uuid).closest(".row-fluid").show();
			  }else{
					 $("#enablePeriod" + v_uuid).closest(".row-fluid").show();
					 $("#isOver" + v_uuid).closest(".row-fluid").show();
			  }
    	}
		// 根据是否勾选“启用请假优先级控制”复选框，对“请假优先级”标签及输入框设置显示或隐藏
		if($('#isPriority').attr('value') == "1"){
			$("#leavePriority" + this.uuid).closest(".row-fluid").children().eq(2).attr("hidden",false);
		}else{
			$("#leavePriority" + this.uuid).closest(".row-fluid").children().eq(2).attr("hidden",true);
		}
    },
	initailValueLabelEdit : function(uuid){
    	var labelValue;
		if($("#unit"+uuid+"_el").val()==1){
			labelValue = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_58;
		}else{
			labelValue = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_59;
		}
		$("#initialValue"+uuid).parent().parent().parent().find(".field_label").html(labelValue);
    },
    initailValueLabelView : function(uuid){
    	var labelValue;
		if($("#unit"+uuid).val()==1){
			labelValue = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_58;
		}else{
			labelValue = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_59;
		}
		$("#initialValue"+uuid).parent().parent().find(".field_label").html(labelValue);
    }
    ,doEnable: function(methodName) {	
		var _self = this;
		var data = {
			method: methodName,
			billId: _self.billId
		};
		data = $.extend(_self.prepareParam(), data);
		
		shr.doAction({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(response) {					
				window.location.reload();
			}
		});		
	}
	,prepareParam: function() {
		var param = shr.ats.HolidayPolicy4Set.superClass.prepareParam.call(this);
		param.holidayTypeId=$("#holidayType"+this.uuid).val();
		return param;
	}
	,getViewDistributeUipk : function(){
		return "com.kingdee.eas.hr.ats.app.HolidayPolicySet.viewDistribute";
	}
	,addSocQueryTips:function(){
		var that = this;
		var totalTipsCount = $(".view_mainPage").length;
		for(var showTipsCount=0;showTipsCount<=totalTipsCount;showTipsCount++){
			that.addSocQueryTipA("tipsRest"+showTipsCount);
			that.addSocQueryTipA("tipsHour"+showTipsCount);
			that.addSocQueryTipA("tipsPeriod"+showTipsCount);
			that.addSocQueryTipA("tipsLimit"+showTipsCount);
			that.addSocQueryTipA("tipsLeaveLen"+showTipsCount);
			that.addSocQueryTipA("tipsLeaveR"+showTipsCount);
			that.addSocQueryTipA("tipsTime"+showTipsCount);
			that.addSocQueryTipA("tipsPeriodContrl"+showTipsCount);
			that.addSocQueryTipA("tipsLeaveCancel"+showTipsCount);
			that.addSocQueryTipA("tipsHoliLimit"+showTipsCount);
			that.addSocQueryTipA("tipsRule"+showTipsCount);
			that.addSocQueryTipA("tipsOverLimit"+showTipsCount);
			that.addSocQueryTipA("tipsOverDeduct"+showTipsCount);
			that.addSocQueryTipA("tipsAttach"+showTipsCount);
			that.addSocQueryTipA("tipsModifyLimit"+showTipsCount);
			that.addSocQueryTipA("tipsLeaveFre"+showTipsCount);
			that.addSocQueryTipA("tipsWH"+showTipsCount);
			that.addSocQueryTipA("tipsLH"+showTipsCount);
			that.addSocQueryTipA("tipsAttachNeed"+showTipsCount);
			that.addSocQueryTipA("tipsFixedleave"+showTipsCount);
			that.addSocQueryTipA("tipsLimitDelegate"+showTipsCount);
			that.addSocQueryTipA("tipsPreHoli"+showTipsCount);
			that.addSocQueryTipA("tipsLeaveStart"+showTipsCount);
			that.addSocQueryTipA("tipsWorkCalendar"+showTipsCount);
			that.addSocQueryTipA("tipsRoundSum"+showTipsCount);
		}


		
	},

	/**
	 * 同意平台调用处理
	 * 给所有需要加tips标签调用平台组件
	 * titleMap = {0:['title1','title2'],1:['title1','title2']}
	 * tipsContentMap = {'title1':'tips1','title2':'tips2'}
	 */
	_showTips: function (titleMap, tipsCotentMap) {
		if (typeof titleMap == 'object') {
			for (var key in titleMap) {
				var tittleArr = titleMap[key][0];
				if (tittleArr && tittleArr.length > 0) {
					$.each(tittleArr, function (index, title) {
						var $label = $($('[title="' + title + '"]')[key])
						if ($label.length > 0) {
							var $tips = $label.parents(".label-ctrl").children('.field-desc');
							var content = tipsCotentMap[title];
							var options = {
								content: content
							}
							$tips.shrTooltip(options);
							$tips.shrTooltip('autoContentDirection');
						}
					});
				}
			}
		}
	},


	//添加tips说明
	showTips: function () {
		var titleMap = {}, titleArr = [], tipsContenMap = {};
		var tipsRestText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_121
			+ '</br>'
			+ '&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_108
			+ '</br>'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_15
			+ '</br>'
			+ '&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_115;


		var tipsHourText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_64
			+ '<br/>';

		var tipsPeriodText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_80
			+ '<br/>';

		var tipsLimitText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_86
			+ '<br/>';
		var tipsLeaveLenText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_79
			+ '<br/>';

		var tipsLeaveRText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_82
			+ '<br/>';

		var tipsTimeText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_56
			+ '<br/>';

		var tipsPeriodContrlText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_114
			+ '<br/>';

		var tipsLeaveCancelText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_84
			+ '<br/>';

		var tipsHoliLimitText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_78
			+ '<br/>';
		var tipsRuleText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_90
			+ '<br/>';

		var tipsOverLimitText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_85
			+ '<br/>';

		var tipsOverDeductText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_81
			+ '<br/>';
		var tipsAttachText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_34
			+ '<br/>';
		var tipsModifyLimitText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_83
			+ '<br/>';

		var tipsLeaveFreText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_48
			+ '<br/>';
		var tipsWHText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_88
			+ '<br/>';
		var tipsLHText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_87
			+ '<br/>';

		var tipsAttachNeedText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_33
			+ '<br/>';
		var tipsFixedleaveText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_30
			+ '<br/>';
		var tipsLimitDelegateText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_29
			+ '<br/>';
		var tipsPreHoliText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_32
			+ '<br/>';
		var tipsLeaveStartText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_31
			+ '<br/>'
			var tipsRoundSumText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_NX_2
				+ '<br/>'
//		var tipsWorkCalendarText = '&nbsp;&nbsp;'
//			+ jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_89
//			+ '</br>'


		var totalTipsCount = $(".view_mainPage").length;
		var label1 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_109,
			label2 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_47,
			label3 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_51,
			label4 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_45,
			label5 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_43,
			label6 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_97,
			label7 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_5,
			label8 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_7,
			label9 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_101,
			label10 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_93,
			label11 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_27,
			label12 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_99,
			label13 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_17,
			label14 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_19,
			label15 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_103,
			label16 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_118,
			label17 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_10,
			label18 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_95,
			label19 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_37,
			label20 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_25,
			label21 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_53,
			label22 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_57,
			label23 = jsBizMultLan.atsManager_holidayPolicy4SetMultiRow_i18n_NX_1;
		tipsContenMap[label1] = tipsRestText;
		tipsContenMap[label2] = tipsHourText;
		tipsContenMap[label3] = tipsPeriodText;
		tipsContenMap[label4] = tipsLimitText;
		tipsContenMap[label5] = tipsLeaveLenText;
		tipsContenMap[label6] = tipsLeaveRText;
		tipsContenMap[label7] = tipsTimeText;
		tipsContenMap[label8] = tipsPeriodContrlText;
		tipsContenMap[label9] = tipsLeaveCancelText;
		tipsContenMap[label10] = tipsHoliLimitText;
		tipsContenMap[label11] = tipsRuleText;
		tipsContenMap[label12] = tipsOverLimitText;
		tipsContenMap[label13] = tipsOverDeductText;
		tipsContenMap[label14] = tipsAttachText;
		tipsContenMap[label15] = tipsModifyLimitText;
		tipsContenMap[label16] = tipsLeaveFreText;
		tipsContenMap[label17] = tipsWHText;
		tipsContenMap[label18] = tipsAttachNeedText;
		tipsContenMap[label19] = tipsFixedleaveText;
		tipsContenMap[label20] = tipsLimitDelegateText;
		tipsContenMap[label21] = tipsPreHoliText;
		tipsContenMap[label22] = tipsLeaveStartText;
		tipsContenMap[label23] = tipsRoundSumText;
		titleArr.push([label1, label2, label3, label4, label5, label6, label7, label8, label9, label10, label11, label12, label13, label14, label15, label16, label17, label18, label19,
			label20, label21, label22,label23]);
		for (var showTipsCount = 0; showTipsCount <= totalTipsCount; showTipsCount++) {
			titleMap[showTipsCount] = titleArr;
			var $label = $($("span[id^='isIncludeLegal']").parent().parent().find(".field_label")[showTipsCount]);
			var $tips = $label.parents(".label-ctrl").children('.field-desc');
			var options = {
				content: tipsLHText
			}
			$tips.shrTooltip(options);
			$tips.shrTooltip('autoContentDirection');
		}
		this._showTips(titleMap, tipsContenMap);
	},

	// 添加 tips 说明（？图片显示以及隐藏）
	addSocQueryTipA: function (tip) {
		var _self = this;
		var tips = $("#" + tip);
		var tipLog = tip + "-dialog";
		tips.prop("title", "");
		tips.css({ "display": "inline-block" });
		var tipsLayout = $("#" + tipLog);
	}

});
