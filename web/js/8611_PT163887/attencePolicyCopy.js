shr.defineClass("shr.ats.AttencePolicyCopy", shr.ats.AtsMaintainBasicItemEdit, {
	pageStep: 0 ,
	storage : "pageStep" ,
	globalFillSignCardAmount: 0,
	globalFillSignCardAmountUnit :0,
	globalFillSignCardCycleType: 0,
	globalFillSignCardAfterDay: 0,
	globalFillTripAmount: 0,
	globalFillTripAmountUnit :0,
	globalFillTripCycleType: 0,
	globalFillTripAfterDay: 0,
	globalFillOtAmount: 0,
	globalFillOtAmountUnit: 0,
	globalFillOtCycleType: 0,
	globalFillOtAfterDay: 0,
	globalFillOtAfterDayUnit:0,
	
	globalConfirmTimeDayType: 0,
	globalConfirmCycleAfterDay: 0,
	globalConfirmCycleType:0,
	globalConfirmCycleDayType:0,
	globalConfirmTimeAfterDay:0,
	
	initalizeDOM:function(){
		shr.ats.AttencePolicyCopy.superClass.initalizeDOM.call(this);
		this.initalizeAtsDom();
	},
	initalizeAtsDom : function(){
		//如果编辑页面的选项是默认考勤制度。那么就将改checked置为disabled
		if($('#isDefault').attr("checked") == true || $('#isDefault').attr("checked") == 'checked'){
			$('input[id="isDefault"]').attr("disabled","disabled");
		}
		
		var that = this ;
		that.storageLastOpera();
		that.pageFormatter();
		that.myExtendValidate();
		that.myExtendFillCtrlValidate();
		that.addClicklistener();
		
		that.adjustAllView();
		var pageState = that.getOperateState();
		if(pageState == "VIEW"){
			that.adjustView();
			that.hideViewControle();
		}
    if(pageState != "VIEW"){
			that.initiateFillView();
			//调整占行
			
			if($('#handOtRule').shrSelect("getValue").value==1){
				$("#handOtBefore").closest(".row-fluid").attr("hidden",false);
				$("#handOtAfter").closest(".row-fluid").attr("hidden",false);
			}else{
				$("#handOtBefore").closest(".row-fluid").attr("hidden",true);
				$("#handOtAfter").closest(".row-fluid").attr("hidden",true);
				
			}
			
			
			
			//设置出差算加班默认值
			if(!$("#tripCalOt").shrSelect("getValue").value){
				$("#tripCalOt").shrSelect("setValue",1);
			}
			that.adjustEditView();
		}
    that.initDefaultInfo();
    that.initShowPage();
    that.addListener();
    //参数获取，存储全局变量
		that.globalFillSignCardAmount = atsMlUtile.getFieldOriginalValue('fillSignCardAmount' );
		that.globalFillSignCardAmountUnit = $('#fillSignCardAmountUnit_el' ).val();
		that.globalFillSignCardCycleType = $('#fillSignCardCycleType_el').val();
		that.globalFillSignCardAfterDay = atsMlUtile.getFieldOriginalValue('fillSignCardAfterDay');
		
		that.globalFillTripAmount = atsMlUtile.getFieldOriginalValue('fillTripAmount' );
		that.globalFillTripAmountUnit = $('#fillTripAmountUnit_el' ).val();
		that.globalFillTripCycleType = $('#fillTripCycleType_el').val();
		that.globalFillTripAfterDay = atsMlUtile.getFieldOriginalValue('fillTripAfterDay');

		that.globalFillOtAmount = atsMlUtile.getFieldOriginalValue('fillOtAmount');
		that.globalFillOtAmountUnit = $('#fillOtAmountUnit_el');
		that.globalFillOtCycleType = $('#fillOtCycleType_el');
		that.globalFillOtAfterDayUnit = $('#fillOtAfterDayUnit_el').val();
		that.globalFillOtAfterDay = atsMlUtile.getFieldOriginalValue('fillOtAfterDay');
		

		that.globalConfirmTimeDayType = $("#comfirmTimeDayType_el").val();
		that.globalConfirmTimeAfterDay = atsMlUtile.getFieldOriginalValue("confirmTimeAfterDay");
		that.globalConfirmCycleType = $("#confirmCycleType_el").val();
		that.globalConfirmCycleDayType = $("#confirmCycleDayType_el").val();
		that.globalConfirmCycleAfterDay = atsMlUtile.getFieldOriginalValue("confirmCycleAfterDay");
		

		
		  jQuery.validator.addMethod("minNumber",function(value, element){
	            var returnVal = true;
	            inputZ=value;
	            var ArrMen= inputZ.split(".");    //截取字符串
	            if(ArrMen.length==2){
	                if(ArrMen[1].length>2){    //判断小数点后面的字符串长度
	                    returnVal = false;
	                    return false;
	                }
	            }
	            return returnVal;
	        },jsBizMultLan.atsManager_attencePolicyCopy_i18n_41);         //验证错误信息
		

		$.extend($.validator.messages, {
			min: $.validator.format(jsBizMultLan.atsManager_attencePolicyCopy_i18n_37),
			range:$.validator.format(jsBizMultLan.atsManager_attencePolicyCopy_i18n_38)
			//minNumber: $("#defaultStandardHour").val() 
		});
		//班次结束n小时后开始允许加班
		$("#afterAllowOT").attr("validate", "{number:true,range:[0,9],minNumber: atsMlUtile.getFieldOriginalValue('defaultStandardHour') }");
	
		//設置加班起始值最小值為0
		$("#otStart").attr("validate","{maxlength:9,digits:true,min:0}");

		$("#leaveAllow").attr("validate", "{maxlength:9,digits:true,min:0}");
		$("#lateAllow").attr("validate", "{maxlength:9,digits:true,min:0}");
		$("#absentAllow").attr("validate", "{maxlength:9,digits:true,min:0}");
	
		$("#weekHour").attr("validate", "{maxlength:9,digits:false,min:0}");
		$("#dayHour").attr("validate", "{maxlength:9,digits:false,min:0}");
		$("#monthDay").attr("validate", "{maxlength:9,digits:false,min:0}");
		
		that.addCaptionDiv();
		that.addTips();

		/**
		 * 20171011 段间加班相关参数设置
		 */
		that.setGapOTDefaultParams();
		that.bindGapOTChangeEvent();
		if(pageState == "VIEW"){//查看模式
			that.setGapOTViewView();
		}else{//编辑模式
			that.setGapOTEditView();
		}
		//设置出差算加班默认值
		if(pageState != "VIEW"){
			if(!$("#tripCalOt").shrSelect("getValue").value){
				$("#tripCalOt").shrSelect("setValue",1);
			}
		}

		/* start | optimize by chengli 2018-06-27 */
		$('#g2').css({float: 'left',width: '19%'});
		$('.view_manager_body').css("cssText", "background: transparent; padding: 0!important");
		$('#pageTabs').css({height: '580px',padding: 0,borderRadius: 0});
		$('#pageTabs li,#pageTabs a').css({width: '100%',textAlign: 'center',border: 'none',padding: 0,cursor: 'pointer',color: '#777',fontSize: '15px',lineHeight: '46px',boxSizing: 'border-box',
		borderRadius: 0});
		$('.ui-tabs-active a').css({background: '#edf7ff',borderLeft: '6px solid #388cff',color: '#4f5154',fontWeight: 'bold'});
		$('#pageTabs ul').css({border: 'none',padding: '25px 0'});
		$('.fontGray').css({padding: 0});
		$('.relatedPanel').css({position: 'static',margin: 0,width: 'auto',height: '580px',border: 'none'});
		$('.span2').css({'marginLeft':'0',float: 'right'});
		$('#showDetailParam').parent().css({background: '#fff',marginLeft: '10px',display:'flex'});
		$('#showDetailParam').css({"width":"80%","margin-top":"20px"});
		if(pageState == "VIEW"){
			$('.span10').css({width: '85%'});
			$('.groupTitle').css({marginLeft: '-4px'});
			$('#allowOT').css({marginLeft: '110px'});
			$('.field-tips').parent().hide();
		}else{
			$('.span10').css({width: '100%'});
		}
		Array.prototype.slice.call($('.col-lg-2')).forEach(function(item){
			if(item.innerHTML===''){
			   $(item).remove();
			}
		});
		$("div[title='"+ jsBizMultLan.atsManager_attencePolicyCopy_i18n_65+"']")[0].title
			=jsBizMultLan.atsManager_attencePolicyCopy_i18n_66;
		// $('#form.form-horizontal .row-block').css('cssText','marginBottom: 0!important');
		// $($('#part1').children()[0]).before('<i style="width: 0;height: 0;border-width: 6px;border-style: solid;border-color: #388cff transparent transparent transparent;position: absolute;top: 143px;left: 250px;"></i>');
		// $($('#part2').children()[0]).before('<i style="width: 0;height: 0;border-width: 6px;border-style: solid;border-color: #388cff transparent transparent transparent;position: absolute;top: 751px;left: 250px;"></i>');
		$($('#part1').children()[0]).toggle(function(){
			$(this).next().children().fadeOut(500);
			$('#part2').parent().parent().fadeIn(0);
			$('#noPunchCalOTParam').parent().parent().fadeIn(0);
			$('.groupTitle').last().parent().parent().parent().fadeIn(0);
		},function(){
			$(this).next().children().fadeIn(500);
			$('#part2').parent().parent().fadeIn(0);
			$('#noPunchCalOTParam').parent().parent().fadeIn(0);
			$('.groupTitle').last().parent().parent().parent().fadeIn(0);
		})
		$($('#part2').children()[0]).toggle(function(){
			$(this).next().fadeOut(500);
		},function(){
			$(this).next().fadeIn(500);
		});
		$($('#noPunchCalOTParam').children()[0]).toggle(function(){
			$(this).next().fadeOut(500);
		},function(){
			$(this).next().fadeIn(500);
		});
		$('.groupTitle').last().toggle(function(){
			$(this).next().fadeOut(500);
		},function(){
			$(this).next().fadeIn(500);
		});
		$('#part1').find($('.col-lg-14')).remove();
		$('.groupTitle').css({
			width: 'auto',
			textAlign: 'left',
			fontSize: '12px'
		});
		$($('#part1').children()[0]).css({color: '#388cff',fontSize: '15px',textAlign: 'left'});
		$($('#part2').children()[0]).css({color: '#388cff',fontSize: '15px',textAlign: 'left',width: 'auto'});
		$($('#noPunchCalOTParam').children()[0]).css({color: '#388cff',fontSize: '15px',textAlign: 'left',width: 'auto'});
		$('.groupTitle').last().css({color: '#388cff',fontSize: '12px',textAlign: 'left',width: 'auto'});
		$('#restOt').find('.span12').css({width: '72%',marginLeft: '25%',color:'#999'});
		$('#fixOt').find('.row-fluid').css({width: '72%',marginLeft: '25%',color:'#999'});
		$('#noPunchCalOTParam').find('.row-fluid').css({width: '72%',marginLeft: '25%',color:'#999'});
		$('#part2').find($('.ui-text-frame')).css({width: '90%'});
		$("[title^='"+jsBizMultLan.atsManager_attencePolicyCopy_i18n_7+"']")
			.text(jsBizMultLan.atsManager_attencePolicyCopy_i18n_57);
		$("[title^='"+jsBizMultLan.atsManager_attencePolicyCopy_i18n_6+"']")
			.text(jsBizMultLan.atsManager_attencePolicyCopy_i18n_62);
		$("[title^='"+jsBizMultLan.atsManager_attencePolicyCopy_i18n_36+"']")
			.text(jsBizMultLan.atsManager_attencePolicyCopy_i18n_52);
		$('#handRestOtRuleTipSpan').parent().prev().append($('#handRestOtRuleTipSpan'));
		$('#handRestOtRuleTipSpan').css('float','none');
		$('.ui-select-frame .ui-select-layout .ui-select-inputframe').width(215);
		$(".secondaryTitle").css({
			fontSize: "12px",
			fontWeight: 600,
			color: "#333",
			height: "20px",
			clear: "both"
		})
		$('#confirmByCycle').attr('class', 'col-lg-17')
		$('#pageTabs').show();
		/* end | by chengli */
	}
	//设置段间加班默认参数
	,setGapOTDefaultParams : function(){
		//设置“前段下班卡或后段上班卡无卡时不算加班”默认值：默认勾选，且不可修改
		$("#gapOtIsLackCardNotCal").attr("checked", true);//默认勾选
		$("#gapOtIsLackCardNotCal").closest(".icheckbox_minimal-grey").eq(0).addClass("checked");
		$("#gapOtIsLackCardNotCal").attr("disabled", true);//不可修改
		// $("#gapOtIsLackCardNotCal").closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		if($('#gapOtCalMethod').val() == undefined || $('#gapOtCalMethod').val() == ""){//新建考勤制度的情况，才没有值
			$("#gapOtCalMethod").attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_3);
			$('#gapOtCalMethod_el').attr("value",1);
			$("#gapOtNotLackCard").attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_16);
			$('#gapOtNotLackCard_el').attr("value",2);
			$("#gapOtBillAndPunchcard").attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_21);
			$('#gapOtBillAndPunchcard_el').attr("value",1);
		}
	}
	//绑定事件 段间加班参数可见性
	,bindGapOTChangeEvent : function(){
		var pageState = this.getOperateState();
		$('#gapOtCalMethod').bind("change", function(){
			if($('#gapOtCalMethod_el').val() == '1' || $('#gapOtCalMethod').val() == '1'){//1-按申请时间和打卡计算，其余段间加班参数要显示
				$('#gapOtPunchcardRelatedParams').parent().attr('style','display:block');
			}else{//2-按申请时间计算，其余段间加班参数要隐藏
				$('#gapOtPunchcardRelatedParams').parent().attr('style','display:none');
			}
		});
		$('#gapOtNotLackCard').bind("change", function(){
			if(pageState == "VIEW"){//查看模式
				if($('#gapOtNotLackCard').val() == '1'){//1-取单据算加班，参数“取交集方式”要显示
					$('#gapOtBillAndPunchcard').parent().parent().attr('style','display:none');
				}else{//2-单据与打卡时间取交集算加班，参数“取交集方式”要隐藏
					$('#gapOtBillAndPunchcard').parent().parent().attr('style','display:block');
				}
			}else{
				if($('#gapOtNotLackCard_el').val() == '1'){//1-取单据算加班，参数“取交集方式”要显示
					$('#gapOtBillAndPunchcard').parent().parent().parent().parent().parent().attr('style','display:none');
				}else{//2-单据与打卡时间取交集算加班，参数“取交集方式”要隐藏
					$('#gapOtBillAndPunchcard').parent().parent().parent().parent().parent().attr('style','display:block');
				}
			}
		});
		$('#gapOtNotLackCard').change();//手动触发一下
		$('#gapOtCalMethod').change();
	}
	//段间加班参数 编辑模式样式
	,setGapOTEditView : function(){

		// $("#gapOtPunchcardRelatedParams").find('div[data-ctrlrole="labelContainer"]').eq(0).children().eq(2).remove();
		
		// $("#gapOtPunchcardRelatedParams").find('div[data-ctrlrole="labelContainer"]').eq(1).children().eq(0).empty();
		// $("#gapOtPunchcardRelatedParams").find('div[data-ctrlrole="labelContainer"]').eq(1).children().eq(2).remove();


	}
	//段间加班参数 查看模式样式
	,setGapOTViewView : function(){
		$("#gapOtPunchcardRelatedParams").find('div[data-ctrlrole="labelContainer"]').eq(0).children().eq(2).remove();
		
		$("#gapOtPunchcardRelatedParams").find('div[data-ctrlrole="labelContainer"]').eq(1).children().eq(0).empty();
		$("#gapOtPunchcardRelatedParams").find('div[data-ctrlrole="labelContainer"]').eq(1).children().eq(2).remove();
	}
	,initDefaultInfo:function(){
		var that = this ;
		
		
		// 工作日提前几天申请
		var appOT1 = atsMlUtile.getFieldOriginalValue('billBefAppOT1');
		
		$('#BeforeAppOT1').val(that.initDate(appOT1));
		// 休息日提前几天申请
		var appOT2 = atsMlUtile.getFieldOriginalValue('billBefAppOT2');
		
		$('#BeforeAppOT2').val(that.initDate(appOT2));
		// 节假日提前几天申请
		var appOT3 = atsMlUtile.getFieldOriginalValue('billBefAppOT3');
	
		$('#BeforeAppOT3').val(that.initDate(appOT3));
	}
	
	 ,initDate : function(appOT3){
		if(appOT3 ==null || appOT3 =="" || appOT3==undefined){
				appOT3 = 1 ;
		 }
		 return appOT3;
	}
	,addListener : function(){
		var that = this ;
		if (that.getOperateState() != 'VIEW') {

			//加班单提前申请控制
			$('#billBefAppContrl').shrCheckbox('onChange',function(){
				if($(this).shrCheckbox('isSelected'))
				{
					// $('#BeforeAppOT1').parent().show();
					// $('#BeforeAppOT2').parent().show();
					// $('#BeforeAppOT3').parent().show();
					$('#BeforeAppOT1').attr('disabled', false);
					$('#BeforeAppOT2').attr('disabled', false);
					$('#BeforeAppOT3').attr('disabled', false);
				}else{
					// $('#BeforeAppOT1').parent().hide();
					// $('#BeforeAppOT2').parent().hide();
					// $('#BeforeAppOT3').parent().hide();	
					$('#BeforeAppOT1').attr('disabled', true);
					$('#BeforeAppOT2').attr('disabled', true);
					$('#BeforeAppOT3').attr('disabled', true);
				}
			});
			
			//加班补偿方式
			$('#otCompens1F7').shrPromptBox('option', {
				onchange : function(e, value) {
						var info = value.current;
						var filter="";
						var otCompensIds="";
						for(var i=0;i< info.length;i++){
							/*info[i]["name"]=info[i]["BaseInfo.name"];
							info[i]["id"]=info[i]["BaseInfo.id"];*/
							otCompensIds+="'"+info[i].id+"',";
						}
						filter +="BaseInfo.id in("+otCompensIds+"'')";
						$("#defaultotCompens1").shrPromptBox("setFilter",filter);
				}
			});
			
			$('#otCompens2F7').shrPromptBox('option', {
				onchange : function(e, value) {
						var info = value.current;
						var filter="";
						var otCompensIds="";
						for(var i=0;i< info.length;i++){
							/*info[i]["name"]=info[i]["BaseInfo.name"];
							info[i]["id"]=info[i]["BaseInfo.id"];*/
							otCompensIds+="'"+info[i].id+"',";
						}
						filter +="BaseInfo.id in("+otCompensIds+"'')";
						$("#defaultotCompens2").shrPromptBox("setFilter",filter);
					
				}
			});
			
			$('#otCompens3F7').shrPromptBox('option', {
				onchange : function(e, value) {
						var info = value.current;
						var filter="";
						var otCompensIds="";
						for(var i=0;i< info.length;i++){
							/*info[i]["name"]=info[i]["BaseInfo.name"];
							info[i]["id"]=info[i]["BaseInfo.id"];*/
							otCompensIds+="'"+info[i].id+"',";
						}
						filter +="BaseInfo.id in("+otCompensIds+"'')";
						$("#defaultotCompens3").shrPromptBox("setFilter",filter);
				}
			});
		
		}
	}
	,adjustAllView:function(){
		var _self = this;
		$("#showDetailParam").show();
		$("#fillSignCardAmountUnit_down li").eq(0).remove();
		$("#fillTripAmountUnit_down li").eq(0).remove();
		$("#fillOtAmountUnit_down li").eq(0).remove();
		
		$("div[title='"+jsBizMultLan.atsManager_attencePolicyCopy_i18n_29+"']").css({"color":"#333333"});
		$("#fillOtAfterDayUnit").parents(".field-ctrl").eq(0).next().remove()
		//按时间段控制   补签期限  补卡
		$("#fillSignCard").find('div[data-ctrlrole="labelContainer"]').eq(0).children().eq(2).remove();
		//按周期控制  补签期限 自然月 补卡
		$("#SignCardCycleType").find('div[data-ctrlrole="labelContainer"]').eq(0).children().eq(2).remove();
		$("#SignCardCycleType").find('div[data-ctrlrole="labelContainer"]').eq(1).children().eq(2).remove();

		//加班单补提
		$("#otAmount").find('div[data-ctrlrole="labelContainer"]').eq(0).children().eq(2).remove();
		$("#otCycleType").find('div[data-ctrlrole="labelContainer"]').eq(0).children().eq(2).remove();
		$("#otCycleType").find('div[data-ctrlrole="labelContainer"]').eq(1).children().eq(2).remove();

		//员工确认考勤
		$('#confirmByTime').find('.field_label').eq(1).parent().remove();
		$('#confirmByTime').find('.field-desc').remove();
		$('#confirmByTime').find('.field_label').parent().attr("class","col-lg-11");
		
		$("#confirmByCycle").find('div[data-ctrlrole="labelContainer"]').eq(0).children().eq(2).remove();
		$("#confirmByCycle").find('div[data-ctrlrole="labelContainer"]').eq(1).children().eq(2).remove();
		
		$("#confirmByCycle").find('div[data-ctrlrole="labelContainer"]').eq(2).children().eq(0).remove();
		$("#confirmByCycle").find('div[data-ctrlrole="labelContainer"]').eq(1).children().eq(2).remove();
//		var htmlStr = $('#confirmByCycle').find('.row-fluid').eq(1).html();
//		$('#confirmByCycle').find('.row-fluid').eq(1).empty();
//		$("#confirmByCycle").find('.row-fluid').eq(0).append(htmlStr);
//		$("#confirmByCycle").find('.row-fluid').eq(0).find('div[data-ctrlrole="labelContainer"]').eq(2).find('.field-ctrl')[0].appendChild(scr[0]);
		
		$("#otCycleType").find('div[data-ctrlrole="labelContainer"]').eq(2).children().eq(0).remove()

		if(_self.getOperateState() != "VIEW"){
		    _self.isControlFillOtByTimeCtl();
		}
		
			//设置加班补偿方式
			var otCompens1 = $("#otCompens1").val();
			var otCompens2 = $("#otCompens2").val();
			var otCompens3 = $("#otCompens3").val();
			
			//根据id获取加班补偿方式名称
			_self.remoteCall({
				uipk:"com.kingdee.eas.hr.ats.app.AttencePolicy.form",
				type:"post",
				method:"getOtCompensById",
				param:{otCompens1:otCompens1,otCompens2:otCompens2,otCompens3:otCompens3},
				success:function(res){	
					if(_self.getOperateState() == "VIEW"){
						$("#otCompens1F7").html(res.otCompens1.substring(0,res.otCompens1.length-1));
						$("#otCompens2F7").html(res.otCompens2.substring(0,res.otCompens2.length-1));
						$("#otCompens3F7").html(res.otCompens3.substring(0,res.otCompens3.length-1));
					}else{

						var otCompens1Collection =JSON.parse( res.otCompens1Collection);
						var otCompens1 = [];
						for(var i = 0;i<otCompens1Collection.length;i++){
							var otCompens={};
							otCompens.id=otCompens1Collection[i].id;
							otCompens.name=otCompens1Collection[i].name;
							otCompens["BaseInfo.name"]=otCompens1Collection[i].name;
							otCompens["BaseInfo.id"]=otCompens1Collection[i].id;
							otCompens1.push(otCompens); 
						}
						
						$("#otCompens1F7").shrPromptBox("setValue", otCompens1);
						

						var otCompens2Collection =JSON.parse( res.otCompens2Collection);
						var otCompens2 = [];
						for(var i = 0;i<otCompens2Collection.length;i++){
							var otCompens={};
							otCompens.id=otCompens2Collection[i].id;
							otCompens.name=otCompens2Collection[i].name;
							otCompens["BaseInfo.name"]=otCompens2Collection[i].name;
							otCompens["BaseInfo.id"]=otCompens2Collection[i].id;
							otCompens2.push(otCompens); 
						}
						
						$("#otCompens2F7").shrPromptBox("setValue", otCompens2);
						
						

						var otCompens3Collection =JSON.parse( res.otCompens3Collection);
						var otCompens3 = [];
						for(var i = 0;i<otCompens3Collection.length;i++){
							var otCompens={};
							otCompens.id=otCompens3Collection[i].id;
							otCompens.name=otCompens3Collection[i].name;
							otCompens["BaseInfo.name"]=otCompens3Collection[i].name;
							otCompens["BaseInfo.id"]=otCompens3Collection[i].id;
							otCompens3.push(otCompens); 
						}
						
						$("#otCompens3F7").shrPromptBox("setValue", otCompens3);
					}
					
				
				}
			});
		
			
			
			

			$("#allowOT").find('div[data-ctrlrole="labelContainer"]').eq(0).children().eq(2).remove();
			
			$("#allowOT").find('div[data-ctrlrole="labelContainer"]').eq(1).children().eq(2).remove();

			//文字空格调整
			// $("#fixOt").children().eq(1).css("padding-left","30px");
			// $("#noPunchCalOTParam").children().eq(1).css("padding-left","30px");
			// $("#noPunchCal").children().eq(1).css("padding-left","30px");
			// $("#restOt").children().eq(1).children().eq(1).css("padding-left","30px");
	}
	,adjustView:function(){
		var that = this;
		$('span[id="fillSignCardAmountUnit"]').css({"margin-left":"-75px"});
		$("div[title='"+jsBizMultLan.atsManager_attencePolicyCopy_i18n_29+"']").css({"padding-right":" 3px"});
		$('span[id="fillSignCardAfterDay"]').attr("margin-left","5px");
		$('span[id="afterDay"]').attr("margin-top","1px");
		$('span[id="fillSignCardAfterDay"]').css({"padding-left":"4px"});
		
		$('span[id="fillTripAmountUnit"]').css({"margin-left":"-75px"});
		$('span[id="fillTripAfterDay"]').attr("margin-left","5px");
		$('div[id="afterDay"]').css({"margin-top":"1px"});
		$('span[id="fillTripAfterDay"]').css({"padding-left":"4px"});
		
		$('span[id="fillOtAmountUnit"]').css({"margin-left":"-75px"});
		$('span[id="fillOtAfterDay"]').attr("margin-left","5px");
		$('div[id="afterDay"]').css({"margin-top":"1px"});
		$('span[id="fillOtAfterDay"]').css({"padding-left":"4px"});
		
		if($('#handOtRule').val()==1){
			$("#handOtBefore").closest(".row-fluid").attr("hidden",false);
			$("#handOtAfter").closest(".row-fluid").attr("hidden",false);
		}else{
			$("#handOtBefore").closest(".row-fluid").attr("hidden",true);
			$("#handOtAfter").closest(".row-fluid").attr("hidden",true);
		}
		
		if($("#billBefAppContrl").val()==1){
			$("#BeforeAppOT1").val(atsMlUtile.getFieldOriginalValue("billBefAppOT1"));
			$("#BeforeAppOT2").val(atsMlUtile.getFieldOriginalValue("billBefAppOT1"));
			$("#BeforeAppOT3").val(atsMlUtile.getFieldOriginalValue("billBefAppOT1"));
		}
		$("#preNotBill").parent().parent().children().eq(2).remove()
	},
	adjustEditView:function(){
		$("#fillOtAfterDayUnit").closest('[data-ctrlrole="labelContainer"]').css("margin-top","20px");
		$("#fillOtAmount").parent().css("height","24px");
		$("#otCycleType #afterDay").css("margin-top","24px");
		$("#SignCardCycleType #afterDay").css("margin-top","24px");
		$("#tripCycleType #afterDay").css("margin-top","24px");
		$("#allowOT #afterDay").css("margin-top","24px");

		$('#beforeAfter .row-fluid.row-block').css('padding-left','0');
		$('#allowOT').closest('.row-fluid.row-block').css('padding-left','0');
		$('#confirmAfterDay1').css("margin-top","24px");
		$("#confirmAfterDay").css("margin-top","24px");
		$("#confirmCycleDayType").closest('[data-ctrlrole="labelContainer"]').css("flex-direction","column-reverse");
	},
	 
	initShowPage:function(){
	
		var that = this ;		
		if (that.getOperateState() == 'VIEW') { // 查看状态的话 就不编辑
		
			if($('#billBefAppContrl').val() == 0){
				$("#BeforeAppOT1").parent().parent().parent().children().remove();
				$("#BeforeAppOT2").parent().parent().parent().children().remove();
				$("#BeforeAppOT3").parent().parent().parent().children().remove();
				
			}
	
			$('#billBefAppContrl').parent().parent().next().empty();
		
			
			$('#BeforeAppOT1').attr('readOnly',true);
			$('#BeforeAppOT2').attr('readOnly',true);
			$('#BeforeAppOT3').attr('readOnly',true);
			
		}else{
			if($('#billBefAppContrl').attr('checked') != "checked"){
				// $('#BeforeAppOT1').parent().hide();
				// $('#BeforeAppOT2').parent().hide();
				// $('#BeforeAppOT3').parent().hide();
			}
			
			$('#billBefAppContrl').parent().parent().prev().empty();
			//按周期控制单位去掉年和月
			var data = $("#fillOtAfterDayUnit").shrSelect('getData');
			data.splice(0,2);
			var curvalue = $("#fillOtAfterDayUnit").shrSelect('getValue');
			$("#fillOtAfterDayUnit").shrSelect('clearOptions');
			$("#fillOtAfterDayUnit").shrSelect('setValue',curvalue);
			$("#fillOtAfterDayUnit").attr("value",curvalue.alias);
			$("#fillOtAfterDayUnit_el").attr("value",curvalue.value);
			$("#fillOtAfterDayUnit").shrSelect('addOption',data);
			
		
		}
		//说明文字提示
		$("#beforeAfter").find("h5").attr("title",jsBizMultLan.atsManager_attencePolicyCopy_i18n_56);
		$("#handOtBefore_down li").eq(0).attr("title",jsBizMultLan.atsManager_attencePolicyCopy_i18n_68);
		$("#handOtBefore_down li").eq(1).attr("title",jsBizMultLan.atsManager_attencePolicyCopy_i18n_25);
		
		$("#handOtAfter_down li").eq(0).attr("title",jsBizMultLan.atsManager_attencePolicyCopy_i18n_67);
		$("#handOtAfter_down li").eq(1).attr("title",jsBizMultLan.atsManager_attencePolicyCopy_i18n_26);
		$("#handOtAfter_down li").eq(2).attr("title",jsBizMultLan.atsManager_attencePolicyCopy_i18n_59);
		/*
		//加?提示
		var descNode = $("#handRestOtRule").parents(".field-ctrl").siblings(".field-desc");//休息日法定假日加班
		var descNode2 = $("#isCalDeductLeave").parents(".field-ctrl").siblings(".field-desc");//加班计算扣除请假部分
		var descNode3 = $("#otrolByDateType").parents(".field-ctrl").siblings(".field-desc");//加班类型受日期控制
		var descNode4 = $("#tripCalOt").parents(".field-ctrl").siblings(".field-desc");//出差算加班
		
		descNode.html("<div class = 'warn-btn'><img src = '/shr/addon/attendmanage/web/resource/tips.png'></div>");
		descNode2.html("<div class = 'warn-btn'><img src = '/shr/addon/attendmanage/web/resource/tips.png'></div>");
		descNode3.html("<div class = 'warn-btn'><img src = '/shr/addon/attendmanage/web/resource/tips.png'></div>");
		descNode4.html("<div class = 'warn-btn'><img src = '/shr/addon/attendmanage/web/resource/tips.png'></div>");
		

		$body = $(document.body);

		$(document.body).append(warnDiv);
		$(document.body).append(warnDiv2);
		$(document.body).append(warnDiv3);
		$(document.body).append(warnDiv4);
		var descNodeOffset = descNode.offset();
		var descNodeOffset2 = descNode2.offset();
		var descNodeOffset3 = descNode3.offset();
		var descNodeOffset4 = descNode4.offset();
		var warnDiv = "<div id='warn' ><p class = 'warn-style'>" + "针对休息日/法定假日排班不关联班次的手提加班单，"
		+"以及排班关联班次且与班次有交集的手提加班单（完全是班前、段间、班后的手提加班单，则按照上面班前、段间、班后的计算规则计算）。"
		+"按申请时间和打卡计算时，以加班单申请开始、结束时间为基准，根据取卡规则取加班卡，进行加班计算。" + "</p></div>";
		var warnDiv2 = "<div id='warn2' ><p class = 'warn-style'>" + "说明：对于手提加班单，若选择了按申请时间计算加班，则忽略此参数；"
		+"对于自动计算加班的部分，该参数任生效。示例：若法定假日排班08:00-18:00，打卡10:00、19:00，请假单08:00-11:00，"
		+"若不勾选该参数，自动计算的加班时长为10:00-18:00，若勾选该参数，则自动计算加班时长为11:00-18:00。" + "</p></div>";
		var warnDiv3 = "<div id='warn3' ><p class = 'warn-style'>" + "勾选后，加班类型将不能修改，比如改天是工作日，则是工作日加班，不能改为休息日加班" + "</p></div>";
		var warnDiv4 = "<div id='warn4' ><p class = 'warn-style'>" + "说明：若手提加班单选择了按申请时间计算加班，则忽略此参数" + "</p></div>";
		$(document.body).append(warnDiv);
		$(document.body).append(warnDiv2);
		$(document.body).append(warnDiv3);
		$(document.body).append(warnDiv4);
		var warnBox = $("#warn");
		var warnBox2 = $("#warn2");
		var warnBox3 = $("#warn3");
		var warnBox4 = $("#warn4");
		warnBox.css({
			left: descNodeOffset.left + 40 +"px",
			top: descNodeOffset.top + "px"

		});
		warnBox2.css({
			left: descNodeOffset2.left + 40 +"px",
			top: descNodeOffset2.top + "px"

		});
		warnBox3.css({
			left: descNodeOffset3.left + 40 +"px",
			top: descNodeOffset3.top + "px"

		});
		warnBox4.css({
			left: descNodeOffset4.left + 40 +"px",
			top: descNodeOffset4.top + "px"

		});

		$("#warn").css({"width": "300px","min-height": "70px","background-color":"rgb(255, 255, 255)","position": "absolute","border":" 1px solid rgb(199, 199, 199)"});
		$("#warn2").css({"width": "300px","min-height": "70px","background-color":"rgb(255, 255, 255)","position": "absolute","border":" 1px solid rgb(199, 199, 199)"});
		$("#warn3").css({"width": "300px","min-height": "70px","background-color":"rgb(255, 255, 255)","position": "absolute","border":" 1px solid rgb(199, 199, 199)"});
		$("#warn4").css({"width": "300px","min-height": "70px","background-color":"rgb(255, 255, 255)","position": "absolute","border":" 1px solid rgb(199, 199, 199)"});
		$(".warn-btn img").css({"width": "20px","height":"20px","padding-left": "10px","cursor":"pointer"});
		$(".warn-style").css({"padding": "10px","text-indent": "0em"});
		//$(".hide").css({"display":"none"});
		$("#warn").css({"display":"none"});
		$("#warn2").css({"display":"none"});
		$("#warn3").css({"display":"none"});
		$("#warn4").css({"display":"none"});
		descNode.hover(function(){
			$("#warn").css({"display":""});
			
		},function(){
			
			$("#warn").css({"display":"none"});
		});
		descNode2.hover(function(){
			$("#warn2").css({"display":""});
			
		},function(){
			
			$("#warn2").css({"display":"none"});
		});
		descNode3.hover(function(){
			$("#warn3").css({"display":""});
			
		},function(){
			
			$("#warn3").css({"display":"none"});
		});
		descNode4.hover(function(){
			$("#warn4").css({"display":""});
			
		},function(){
			
			$("#warn4").css({"display":"none"});
		});*/
	}	
	,hideViewControle:function(){
		var that = this;
		var isFillTrip = $("#isFillTrip").attr("value");
		var isFillSignCard = $('#isFillSignCard' ).attr("value");
		var isFillOt = $("#isFillOt").attr("value");
		var isConfirm = $("#isConfirm").attr("value");
		if(isFillTrip == 0){
			$("#fillTripByTimeCtl").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#fillTripAmount").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#fillTripAmountUnit").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#fillTripByCycleCtl").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#tripCycleType").hide();
		}else{
			if($("#fillTripByCycleCtl").attr('value') == 0){
				$('#tripCycleType').children().children().eq(2).empty()
				$('#tripCycleType').children().children().eq(1).empty()
			}
		}
		
		if(isFillSignCard == 0 ){
			$("#fillSignCardByTimeCtl").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#fillSignCardByCycleCtl").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#fillSignCard").hide();
			$("#SignCardCycleType").hide();
		}else{
			if($("#fillSignCardByCycleCtl").attr('value') == 0){
				$('#SignCardCycleType').children().children().eq(2).empty()
				$('#SignCardCycleType').children().children().eq(1).empty()
			}
		}

		if(isFillOt == 0){
			$("#fillOtByTimeCtl").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#fillOtByCycleCtl").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#otAmount").hide();
			$("#otCycleType").hide();
		}else{
			if($("#fillOtByCycleCtl").attr('value') == 0){
				$("#fillOtAfterDay").parent().parent().remove();
				$("#fillOtAfterDayUnit").remove();
				$("span[id='afterDay']").remove();
			}
			if($("#fillOtByTimeCtl").attr("value")==0){
				$("#fillOtAmount").remove();
			}
		}
		
		if(isConfirm== 0){
			$("#confirmByTimeCtl").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#confirmByCycleCtl").closest('div[data-ctrlrole="labelContainer"]').hide();
			$('#confirmByCycle').hide();
			$('#confirmByTime').hide();
		}else{
			if($("#confirmByCycleCtl").attr('value') == 0){
				$('#confirmByCycle').css("opacity",0);
			}
			if($("#confirmByTimeCtl").attr('value') == 0){
				$('#confirmByTime').css("opacity",0);
			}
		}
	}
	/**
		初始化补控参数和事件（出差单补提，补签卡、加班单补提,考勤确认）
	*/
	,initiateFillView:function(){
		var that = this;

		that.initiateFillParameter();
		//出差单补提事件绑定
		$("#isFillTrip").bind("change", function() {
			that.isFillTripTriger();
		});	
		
		$("#fillTripByCycleCtl").bind("change", function() {
			that.fillTripByCycleCtlTriger();
		});	
		
		$("#fillTripByTimeCtl").bind("change", function() {
			that.fillTripByTimeCtlTriger();
		});	
		//补签卡事件绑定
		$("#isFillSignCard").bind("change", function() {
			that.isFillSignCardTriger();
		});	
		
		$("#fillSignCardByCycleCtl").bind("change", function() {
			that.fillSignCardByCycleCtlTriger();
		});	
		
		$("#fillSignCardByTimeCtl").bind("change", function() {
			that.fillSignCardByTimeCtlTriger();
		});	

		//加班单补提事件绑定
		$("#isFillOt").bind("change", function() {
			that.isFillOtTriger();
		});	
		
		$("#fillOtByCycleCtl").bind("change", function() {
			that.fillOtByCycleCtlTriger();
		});	
		
		$("#fillOtByTimeCtl").bind("change", function() {
			that.fillOtByTimeCtlTriger();
		});
		//员工确认考勤事件绑定
		$("#isConfirm").bind("change", function() {
			that.isConfirmTriger();
		});	
		
		$("#confirmByTimeCtl").bind("change", function() {
			that.confirmByTimeCtlTriger();
		});
		
		$("#confirmByCycleCtl").bind("change", function() {
			that.confirmByCycleCtlTriger();
		});
		
	},
	/**
	初始化补控参数（出差单补提，补签卡）
	*/
	initiateFillParameter:function(){
		var that = this;
		that.initiateFillTripParameter();
		that.initiateFillSignCardParameter();
		that.initiateFillOtParameter();
		that.initiateConfirmParameter();
	},
	initiateFillTripParameter:function(){
		//出差单补提
		var isFillTrip = $('#isFillTrip' ).attr("checked");
		if("checked" != isFillTrip){
			$('#fillTripByCycleCtl' ).attr("disabled", "disabled");
			$('#fillTripByTimeCtl' ).attr("disabled", "disabled");
	/* 		$('#fillTripByCycleCtl').shrCheckbox("unCheck");
			$('#fillTripByTimeCtl').shrCheckbox("unCheck"); */

			$('#fillTripAmount' ).attr("value", "");
			$('#fillTripAmount' ).attr("disabled", "disabled");
			$('input[id="fillTripAmount"]').parent().css({"background-color":"#ECECEC"})
			
			$('#fillTripAmountUnit' ).attr("value", "");
			$('#fillTripAmountUnit_el' ).attr("value", "");
			var fillTripAmountUnit = $('#fillTripAmountUnit');
			fillTripAmountUnit.shrSelect("disable");
			
			$('#fillTripAfterDay' ).attr("value", "");
			$('#fillTripAfterDay' ).attr("disabled", "disabled");
			$('input[id="fillTripAfterDay"]').parent().css({"background-color":"#ECECEC"})
			
			$('#fillTripCycleType' ).attr("value", "");
			$('#fillTripCycleType_el' ).attr("value", "");
			var fillTripCycleType = $('#fillTripCycleType');
			fillTripCycleType.shrSelect("disable");

			$('#fillTripByTimeCtl').closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			$('#fillTripByCycleCtl').closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			
		}else{
			if($("#fillTripByCycleCtl").attr('checked') != "checked"){
				$('#fillTripAfterDay' ).attr("value", "");
				$('#fillTripAfterDay' ).attr("disabled", "disabled");
				$('input[id="fillTripAfterDay"]').parent().css({"background-color":"#ECECEC"})
				$('#fillTripCycleType' ).attr("value", "");
				$('#fillTripCycleType_el' ).attr("value", "");
				var fillTripCycleType = $('#fillTripCycleType');
				fillTripCycleType.shrSelect("disable");
			}
			if($("#fillTripByTimeCtl").attr('checked') != "checked"){
				$('#fillTripAmount' ).attr("value", "");
				$('#fillTripAmount' ).attr("disabled", "disabled");
				$('input[id="fillTripAmount"]').parent().css({"background-color":"#ECECEC"})
				$('#fillTripAmountUnit' ).attr("value", "");
				$('#fillTripAmountUnit_el' ).attr("value", "");
				var fillTripAmountUnit = $('#fillTripAmountUnit');
				fillTripAmountUnit.shrSelect("disable");
			}
			
		}

		
	},
	initiateFillSignCardParameter:function(){
		var isFillSignCard = $('#isFillSignCard' ).attr("checked");
		
		if("checked" != isFillSignCard){
			 //补签卡
			$('#fillSignCardByCycleCtl' ).attr("disabled", "disabled");
			$('#fillSignCardByTimeCtl' ).attr("disabled", "disabled");
	/* 		$('#fillSignCardByCycleCtl').shrCheckbox("unCheck");
			$('#fillSignCardByTimeCtl').shrCheckbox("unCheck"); */

			$('#fillSignCardAmount' ).attr("value", "");
			$('#fillSignCardAmount' ).attr("disabled", "disabled");
			$('input[id="fillSignCardAmount"]').parent().css({"background-color":"#ECECEC"})
			
			$('#fillSignCardAmountUnit' ).attr("value", "");
			$('#fillSignCardAmountUnit_el' ).attr("value", "");
			var fillSignCardAmountUnit = $('#fillSignCardAmountUnit');
			fillSignCardAmountUnit.shrSelect("disable");
			
			$('#fillSignCardAfterDay' ).attr("value", "");
			$('#fillSignCardAfterDay' ).attr("disabled", "disabled");
			$('input[id="fillSignCardAfterDay"]').parent().css({"background-color":"#ECECEC"})
			
			$('#fillSignCardCycleType' ).attr("value", "");
			$('#fillSignCardCycleType_el' ).attr("value", "");
			var fillSignCardCycleType = $('#fillSignCardCycleType');
			fillSignCardCycleType.shrSelect("disable");
			
			$('#fillSignCardByTimeCtl').closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
            $('#fillSignCardByCycleCtl').closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		}else{
			if($("#fillSignCardByCycleCtl").attr('checked') != "checked"){
				$('#fillSignCardAfterDay' ).attr("value", "");
				$('#fillSignCardAfterDay' ).attr("disabled", "disabled");
				$('input[id="fillSignCardAfterDay"]').parent().css({"background-color":"#ECECEC"})
				$('#fillSignCardCycleType' ).attr("value", "");
				$('#fillSignCardCycleType_el' ).attr("value", "");
				var fillSignCardCycleType = $('#fillSignCardCycleType');
				fillSignCardCycleType.shrSelect("disable");
			}
			if($("#fillSignCardByTimeCtl").attr('checked') != "checked"){
				$('#fillSignCardAmount' ).attr("value", "");
				$('#fillSignCardAmount' ).attr("disabled", "disabled");
				$('input[id="fillSignCardAmount"]').parent().css({"background-color":"#ECECEC"})
				$('#fillSignCardAmountUnit' ).attr("value", "");
				$('#fillSignCardAmountUnit_el' ).attr("value", "");
				var fillSignCardAmountUnit = $('#fillSignCardAmountUnit');
				fillSignCardAmountUnit.shrSelect("disable");
			}
		}
	}
	,initiateFillOtParameter : function(){
		//加班单单补提
		var isFillOt = $('#isFillOt' ).attr("checked");
		if("checked" != isFillOt){
			$('#fillOtByCycleCtl' ).attr("disabled", "disabled");
			$('#fillOtByTimeCtl' ).attr("disabled", "disabled");

			$('#fillOtAmount' ).attr("value", "");
			$('#fillOtAmount' ).attr("disabled", "disabled");
			$('input[id="fillOtAmount"]').parent().css({"background-color":"#ECECEC"})
			
			$('#fillOtAmountUnit' ).attr("value", "");
			$('#fillOtAmountUnit_el' ).attr("value", "");
			var fillOtAmountUnit = $('#fillOtAmountUnit');
			fillOtAmountUnit.shrSelect("disable");
			
			$('#fillOtAfterDay' ).attr("value", "");
			$('#fillOtAfterDay' ).attr("disabled", "disabled");
			$('input[id="fillOtAfterDay"]').parent().css({"background-color":"#ECECEC"})
			
			$("#fillOtAfterDayUnit").shrSelect("disable");
			$('#fillOtAfterDayUnit' ).attr("value", "");
			
			$('#fillOtCycleType' ).attr("value", "");
			$('#fillOtCycleType_el' ).attr("value", "");
			var fillTripCycleType = $('#fillOtCycleType');
			fillTripCycleType.shrSelect("disable");

			$('#fillOtByTimeCtl').closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			$('#fillOtByCycleCtl').closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
			
		}else{
			if($("#fillOtByCycleCtl").attr('checked') != "checked"){
				$('#fillOtAfterDay' ).attr("value", "");
				$('#fillOtAfterDay' ).attr("disabled", "disabled");
				$('input[id="fillOtAfterDay"]').parent().css({"background-color":"#ECECEC"})
				$('#fillOtCycleType' ).attr("value", "");
				$('#fillOtCycleType_el' ).attr("value", "");
				var fillOtCycleType = $('#fillOtCycleType');
				fillOtCycleType.shrSelect("disable");
			}
			if($("#fillOtByTimeCtl").attr('checked') != "checked"){
				$('#fillOtAmount' ).attr("value", "");
				$('#fillOtAmount' ).attr("disabled", "disabled");
				$('input[id="fillOtAmount"]').parent().css({"background-color":"#ECECEC"})
				$('#fillOtAmountUnit' ).attr("value", "");
				$('#fillOtAmountUnit_el' ).attr("value", "");
				var fillOtAmountUnit = $('#fillOtAmountUnit');
				fillOtAmountUnit.shrSelect("disable");
			}
			
		}
	}
	,initiateConfirmParameter : function(){
		//员工确认考勤
		var isConfirm = $('#isConfirm').attr("checked");
		
		if("checked" != isConfirm){
			 //员工考勤确认
			$('#confirmByCycleCtl').attr("disabled","disabled");
			$("#confirmByTimeCtl").attr("disabled","disabled");

			$('#confirmTimeAfterDay').attr("value", "");
			$('#confirmTimeAfterDay').attr("disabled", "disabled");
			$('input[id="confirmTimeAfterDay"]').parent().css({"background-color":"#ECECEC"})
			
			$('#confirmCycleAfterDay').attr("value", "");
			$('#confirmCycleAfterDay').attr("disabled", "disabled");
			$('input[id="confirmCycleAfterDay"]').parent().css({"background-color":"#ECECEC"})
			
			$('#confirmCycleType').attr("value", "");
			$('#confirmCycleType_el').attr("value", "");
			var confirmCycleType = $('#confirmCycleType');
			confirmCycleType.shrSelect("disable");

			$('#comfirmTimeDayType').attr("value", "");
			$('#comfirmTimeDayType_el').attr("value", "");
			var comfirmTimeDayType = $('#comfirmTimeDayType');
			comfirmTimeDayType.shrSelect("disable");
			
			$('#confirmCycleDayType').attr("value", "");
			$('#confirmCycleDayType_el').attr("value", "");
			var confirmCycleDayType = $('#confirmCycleDayType');
			confirmCycleDayType.shrSelect("disable");

			$('#confirmByTimeCtl').closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
            $('#confirmByCycleCtl').closest(".icheckbox_minimal-grey").eq(0).addClass("disabled");
		}else{
			if($("#confirmByCycleCtl").attr('checked') != "checked"){
				$('#confirmCycleAfterDay' ).attr("value", "");
				$('#confirmCycleAfterDay' ).attr("disabled", "disabled");
				$('input[id="confirmCycleAfterDay"]').parent().css({"background-color":"#ECECEC"})
				$('#confirmCycleType').attr("value", "");
				$('#confirmCycleType_el').attr("value", "");
				var confirmCycleType = $('#confirmCycleType');
				confirmCycleType.shrSelect("disable");
				$('#confirmCycleDayType').attr("value", "");
				$('#confirmCycleDayType_el').attr("value", "");
				var confirmCycleDayType = $('#confirmCycleDayType');
				confirmCycleDayType.shrSelect("disable");
			}
			if($("#confirmByTimeCtl").attr('checked') != "checked"){
				$('#confirmTimeAfterDay' ).attr("value", "");
				$('#confirmTimeAfterDay' ).attr("disabled", "disabled");
				$('input[id="confirmTimeAfterDay"]').parent().css({"background-color":"#ECECEC"})
				$('#comfirmTimeDayType' ).attr("value", "");
				$('#comfirmTimeDayType_el' ).attr("value", "");
				var comfirmTimeDayType = $('#comfirmTimeDayType');
				comfirmTimeDayType.shrSelect("disable");
			}
		}
	}
	,destroyAction:function(){		
		var that = this;
		shr.ats.AttencePolicyEdit.superClass.destroyAction.call(this);
		var userNumber = $('#userNumber').val();
		sessionStorage.setItem(userNumber+that.storage,that.pageStep);
	},
	
	storageLastOpera :function(){
	// document.cookie 
		var that = this;
		var state = this.getOperateState();
		var userNumber = $('#userNumber').val();
		if('VIEW' == state || 'EDIT' == state)
		{
		 var step = sessionStorage.getItem(userNumber+that.storage);
		 if(step)
		 {
			that.pageStep = step ;
		 }
		}else{
			sessionStorage.removeItem(userNumber+that.storage);
		}
	},
	addClicklistener:function(){
		var that = this ;
		that.changePageLabelColor();
		that.changePageLabelShow();
		$('#baseInfo, #exception ,#leaveBill ,#tripBill ,#overTime ,#fetchCard ,#other').click(
		  function(){ 
			if (this.id == "other") {
				$.extend($.validator.messages, {
					min: $.validator.format(jsBizMultLan.atsManager_attencePolicyCopy_i18n_40)
				});
			} else {
				$.extend($.validator.messages, {

					min: $.validator.format(jsBizMultLan.atsManager_attencePolicyCopy_i18n_37)
				});
			}
			var pos      = $(this).parent().nextUntil().length;
			var allCount = $('#pageTabs').find('li').length ;
			that.pageStep = (allCount - 1) - pos ;
			that.changePageLabelColor();
			that.changePageLabelShow();
		}
		);
		

	
		
		
		$('#handOtRule').bind("change", function(){
			if($('#handOtRule').shrSelect("getValue").value==1){
				$("#handOtBefore").closest(".row-fluid").attr("hidden",false);
				$("#handOtAfter").closest(".row-fluid").attr("hidden",false);
			}else{
				$("#handOtBefore").closest(".row-fluid").attr("hidden",true);
				$("#handOtAfter").closest(".row-fluid").attr("hidden",true);
				
			}
			
		});
		
		
		
	},
	changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.pageStep).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.pageStep).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
		// optimize by chengli 2018-06-27
		$('#pageTabs a').css({background: '#fff',border: 'none',color: '#777',fontWeight: 'normal'});
		$('.ui-tabs-active a').css({background: '#edf7ff',borderLeft: '6px solid #388cff',color: '#4f5154',fontWeight: 'bold'});
	},
	changePageLabelShow:function(){
		var that = this;
		$('#showDetailParam').children('div[class="group-panel bg_group"]').hide();
		$('#showDetailParam').children('div[class="group-panel bg_group"]').eq(that.pageStep).show();
	}
	
 	/*,setButtonVisible:function(){
 		var that = this ;
		var auditState = $("#auditState").val();
		if(auditState){
			//if(!this.isFromWF()){
				if("已审核" == auditState ){
					$("#edit").hide();
					$("#audit").hide();
				}
				if("反审核" == auditState ){
					$("#antiaudit").hide();
				}
				if("未审核" == auditState ){
					$("#antiaudit").hide();
				}
			//}
		}
		if ( that.getOperateState() == "ADDNEW" || that.getOperateState() == "EDIT" ) {
			$("#audit").hide();
			$("#antiaudit").hide();
		}
	} 
 	,auditAction: function (even){
 		 var that=this;
 		 var  billId = $("#billId").val();
 		 that.remoteCall({
			type:"post",
			method:"setAuditStatePass",
			param:{billId: billId}, //JSON.stringify(billId)
			success:function(res){
				var data = res;
				 if (data.result == 1) {
					 top.Messenger().post({
						message: "审核完成!",
						showCloseButton: true
					 });
					 that.viewAction(billId);
					 return false;
				 }else{
					 top.Messenger().post({
						message: "审核失败!",
						showCloseButton: true
					 });
					 return false; 
				}
			}
		});
	},
	antiauditAction: function (even){
		 var that=this;
		 var  billId = $("#billId").val();
		 that.remoteCall({
			type:"post",
			method:"setAntiAuditState",
			param:{billId: billId},
			success:function(res){
				var data = res;
				if (data.result == 1) {
					 top.Messenger().post({
						message: "反审核完成!",
						showCloseButton: true
					 });
					 that.viewAction(billId);
					 return false;
				 }else{
					 top.Messenger().post({
						message: "反审核失败!",
						showCloseButton: true
					 });
					 return false; 
				}
			}
		});
	}*/
	/**
	 * 包装model
	 */
	,warpModel:function(model){
		//model.entries = model.billEntry;
		//delete model.billEntry;
		return model;
	},
	
	
	
	
	// copy  from edit.js 
	//----------------------------------------------------------------------------------------------------------------
	
	
	/**
	 * 覆盖保存方法  校验名称和ID是否重复
	 */
	saveAction:function(event){
	 var that = this ;
	 
	 if(!that.initLimitModelData()){ 
			shr.showError({message: errorMessage , hideAfter: 5});
			return ;
		} ;
	 
	 
	 var name = $("#name").val();
     var billId  = $("#id").val();
	 var number  = atsMlUtile.getFieldOriginalValue("number");
	 workArea = that.getWorkarea(),
		$form = $('form', workArea);
		if(!($form.valid() && that.verify())){
			shr.showError({message:jsBizMultLan.atsManager_attencePolicyCopy_i18n_55});
		} else if(that.tripValidate() && that.signCardValidate() && that.otValidate()&&that.confirmValidate()) {
         	that.remoteCall({
				type:"post",
				method:"checkNameAndIdIsExist",
				param:{name: name,billId:billId,number:number},
				success:function(res){		
				if(res.checkNameIsExist=="exist"){
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_attencePolicyCopy_i18n_32,[name])});
				}else if(res.checkIdIsExist=="exist"){			
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_attencePolicyCopy_i18n_8,[number])});
				}else{
					that.doSave(event, 'save');		
				}					
				
				}
			});
		 }
	},
	
	initLimitModelData :function(){
		var _self = this ;
		var flag =true ;
		
		//如果选中了加班单提前申请控制   则校验  否则置零
		if($('#billBefAppContrl').shrCheckbox('isSelected')){
				// 工作日提前几天申请
			var appOT1 = $('#BeforeAppOT1').val();
			if(!_self.isVlidateDate(appOT1,jsBizMultLan.atsManager_attencePolicyCopy_i18n_18)){
				errorMessage=jsBizMultLan.atsManager_attencePolicyCopy_i18n_19;
				flag=false;
			}

			atsMlUtile.setTransNumValue('billBefAppOT1',appOT1,{'decimalPrecision':0});
				// 休息日提前几天申请
			var appOT2 = $('#BeforeAppOT2').val();
			if(!_self.isVlidateDate(appOT2,jsBizMultLan.atsManager_attencePolicyCopy_i18n_60)){
				errorMessage=jsBizMultLan.atsManager_attencePolicyCopy_i18n_61;
				flag=false;
			}
			
			atsMlUtile.setTransNumValue('billBefAppOT2',appOT2,{'decimalPrecision':0});
				// 节假日提前几天申请
			var appOT3 = $('#BeforeAppOT3').val();
			if(!_self.isVlidateDate(appOT3,jsBizMultLan.atsManager_attencePolicyCopy_i18n_27)){
				errorMessage=jsBizMultLan.atsManager_attencePolicyCopy_i18n_28;
				flag=false;
			}
			atsMlUtile.setTransNumValue('billBefAppOT3',appOT3,{'decimalPrecision':0});
		}else{
			atsMlUtile.setTransNumValue('billBefAppOT1',1,{'decimalPrecision':0});
			atsMlUtile.setTransNumValue('billBefAppOT2',1,{'decimalPrecision':0});
			atsMlUtile.setTransNumValue('billBefAppOT3',1,{'decimalPrecision':0});
		}
		return flag ;
	},
	isVlidateDate:function(appOT3,name){
		
		if(!/^[0-9]*$/.test(appOT3) || appOT3=="" || parseInt(appOT3)<0){
			
			return false;
	    }
	    return true ;
	},
	tripValidate:function(){
			
		var isFillTrip = $('#isFillTrip' ).attr("checked");
		
		if("checked" == isFillTrip){
			var fillTripByTimeCtl = $('#fillTripByTimeCtl' ).attr("checked");
			var fillTripByCycleCtl = $('#fillTripByCycleCtl').attr("checked");
			if((!fillTripByTimeCtl || !"checked" == fillTripByTimeCtl) && (!fillTripByCycleCtl || !"checked" == fillTripByCycleCtl)){
				shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_48});
			    return false;
			}
			if("checked" == fillTripByTimeCtl){
			   if((atsMlUtile.getFieldOriginalValue('fillTripAmount')=="" ||$('#fillTripAmountUnit').val()=="")){
				shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_43});
			    return false;
			}else{
				var amount = atsMlUtile.getFieldOriginalValue('fillTripAmount' );
				if(!(/^(\+|-)?\d+$/.test( amount )) ){					
				    shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_10});
					return false;
				 }
				var unit = $('#fillTripAmountUnit' ).val();
				var info = this.isMoreOneYear(amount,unit);
				if(info!=""){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_9+info});
				    return false;
			     }
			}
			if(atsMlUtile.getFieldOriginalValue('fillTripAmount')<0){
				shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_15});
			   return false;
			}
		   }
		   
		   if("checked" == fillTripByCycleCtl){
	            var fillTripAfterDay = atsMlUtile.getFieldOriginalValue('fillTripAfterDay');
				var fillTripCycleType = $('#fillTripCycleType_el').val();
				if(!((/^(\+|-)?\d+$/.test( fillTripAfterDay )) && fillTripAfterDay >= 0 && fillTripAfterDay<=31)){					
				    shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_31});
					return false;
				 }
				var fillTripAfterDayIntValue = parseInt(fillTripAfterDay);
				if(fillTripCycleType == ""){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_47});
				    return false;
				}else if(fillTripAfterDay == ""){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_46});
				    return false;
				}else if(fillTripAfterDayIntValue < 0 || fillTripAfterDayIntValue > 31){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_31});
					return false;
				}		   
			}
		}
			return true;
		
	},
	otValidate:function(){
			
		var isFillOt = $('#isFillOt' ).attr("checked");
		if("checked" == isFillOt){
			var fillOtByTimeCtl = $('#fillOtByTimeCtl' ).attr("checked");
			var fillOtByCycleCtl = $('#fillOtByCycleCtl').attr("checked");
			if((!fillOtByTimeCtl || !"checked" == fillOtByTimeCtl) && (!fillOtByCycleCtl || !"checked" == fillOtByCycleCtl)){
				shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_49});
			    return false;
			}
			if("checked" == fillOtByTimeCtl){
			   if((atsMlUtile.getFieldOriginalValue('fillOtAmount')=="" ||$('#fillOtAmountUnit').val()=="")){
				shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_44});
			    return false;
			}else{
				var amount = atsMlUtile.getFieldOriginalValue('fillOtAmount' );
				if(!(/^(\+|-)?\d+$/.test( amount )) ){					
				    shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_24});
					return false;
				 }
				var unit = $('#fillOtAmountUnit' ).val();
				var info = this.isMoreOneYear(amount,unit);
				if(info!=""){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_11+info});
				    return false;
			     }
			}
			if(atsMlUtile.getFieldOriginalValue('fillOtAmount')<0){
				shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_22});
			   return false;
			}
		   }
		   
		   if("checked" == fillOtByCycleCtl){
	            var fillOtAfterDay = atsMlUtile.getFieldOriginalValue('fillOtAfterDay');
				var fillOtCycleType = $('#fillOtCycleType_el').val();
				if(!((/^(\+|-)?\d+$/.test( fillOtAfterDay )) && fillOtAfterDay >= 0 && fillOtAfterDay<=31)){					
				    shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_31});
					return false;
				 }
				var fillOtAfterDayIntValue = parseInt(fillOtAfterDay);
				if(fillOtCycleType == ""){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_47});
				    return false;
				}else if(fillOtAfterDay == ""){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_46});
				    return false;
				}else if(fillOtAfterDayIntValue < 0 || fillOtAfterDayIntValue > 31){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_31});
					return false;
				}		   
			}
		}
		return true;
		
	},
	signCardValidate:function(){
			
		var isFillSignCard = $('#isFillSignCard' ).attr("checked");
		
		if("checked" == isFillSignCard){
			var fillSignCardByTimeCtl = $('#fillSignCardByTimeCtl' ).attr("checked");
			var fillSignCardByCycleCtl = $('#fillSignCardByCycleCtl').attr("checked");
			if((!fillSignCardByTimeCtl || !"checked" == fillSignCardByTimeCtl) && (!fillSignCardByCycleCtl || !"checked" == fillSignCardByCycleCtl)){
				shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_50});
				return false;
			}
			if("checked" == fillSignCardByTimeCtl){
			   if((atsMlUtile.getFieldOriginalValue('fillSignCardAmount')=="" ||$('#fillSignCardAmountUnit').val()=="")){
				shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_45});
				return false;
			}else{
				var amount = atsMlUtile.getFieldOriginalValue('fillSignCardAmount' );
				if(!(/^(\+|-)?\d+$/.test( amount )) ){					
				    shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_14});
					return false;
				 }
				var unit = $('#fillSignCardAmountUnit' ).val();
				var info = this.isMoreOneYear(amount,unit);
				if(info!=""){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_13+info});
					return false;
				 }
			}
			if(atsMlUtile.getFieldOriginalValue('fillSignCardAmount')<0){
				shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_12});
			   return false;
			}
		   }
		   
		   if("checked" == fillSignCardByCycleCtl){
				var fillSignCardAfterDay = atsMlUtile.getFieldOriginalValue('fillSignCardAfterDay');
				var fillSignCardCycleType = $('#fillSignCardCycleType_el').val();
				if(!((/^(\+|-)?\d+$/.test( fillSignCardAfterDay )) && fillSignCardAfterDay >= 0 && fillSignCardAfterDay<=31)){					
				    shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_31});
					return false;
				}
				var fillSignCardAfterDayIntValue = parseInt(fillSignCardAfterDay);
				if(fillSignCardCycleType == ""){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_47});
					return false;
				}else if(fillSignCardAfterDay == ""){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_46});
					return false;
				}else if(fillSignCardAfterDayIntValue < 0 || fillSignCardAfterDayIntValue > 31){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_31});
					return false;
				}		   
			}
		}
			return true;
		
	},
	confirmValidate:function(){
			var isConfirm = $('#isConfirm' ).attr("checked");
			if("checked"==isConfirm){
				var confirmByTimeCtl = $('#confirmByTimeCtl' ).attr("checked");
				var confirmByCycleCtl = $('#confirmByCycleCtl').attr("checked");
				if((!confirmByTimeCtl || !"checked" == confirmByTimeCtl) && (!confirmByCycleCtl || !"checked" == confirmByCycleCtl)){
					shr.showWarning({message: jsBizMultLan.atsManager_attencePolicyCopy_i18n_51});
					return false;
				}
			}
			return true;
	},
	isMoreOneYear: function(amount,unit){
		if(unit==jsBizMultLan.atsManager_attencePolicyCopy_i18n_34&&amount>1){
			return jsBizMultLan.atsManager_attencePolicyCopy_i18n_1;
		}else if( (unit==jsBizMultLan.atsManager_attencePolicyCopy_i18n_63
			||unit==jsBizMultLan.atsManager_attencePolicyCopy_i18n_70) &&amount>12){
			return jsBizMultLan.atsManager_attencePolicyCopy_i18n_0;
		}else if( (unit==jsBizMultLan.atsManager_attencePolicyCopy_i18n_58
			||unit==jsBizMultLan.atsManager_attencePolicyCopy_i18n_69
			||unit==jsBizMultLan.atsManager_attencePolicyCopy_i18n_20)&&amount>365){
			return jsBizMultLan.atsManager_attencePolicyCopy_i18n_2;
		}else{
			return "";
		}
	},
	
	
	/**
	 * 保存真正执行方法
	 */
	doSave: function(event, action) {
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		var model = shr.assembleModel(_self.fields, _self.getWorkarea(), _self.uuid);
		
		// TODO
		model =_self.warpModel(model);
		
		data.model = shr.toJSON(model);
		data.method = action;
		if(!data.billId || data.billId == ""){
			data.billId = shr.getUrlParam("billId");
		}
		
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
					
					_self.reloadPage({
						billId: response.id,
						method: 'view'
					});
				}
			}
		});	
	},	
	
	/**
	 * 提交
	 */
	submitAction: function(event) {
		var _self = this,
			workArea = _self.getWorkarea(),
			$form = $('form', workArea);
		
		if ($form.valid() && _self.verify()) {
			shr.showConfirm(jsBizMultLan.atsManager_attencePolicyCopy_i18n_35, function() {
				_self.doSubmit(event, 'submit');
			});
		}		
	},
	
	/**
	 * 提交真正执行方法
	 */
	doSubmit: function(event, action) {
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		var model = shr.assembleModel(_self.fields, _self.getWorkarea(), _self.uuid);
		
		// TODO
		model =_self.warpModel(model);
		
		data.model = shr.toJSON(model);
		data.method = action;
		
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
				if (_self.isFromWF()) {
					// 来自任务中心
					var parent = window.parent,
						submitSuccess = parent.submitSuccess;
					
					if ($.isFunction(submitSuccess)) {
						// 回调父页面方法
						var assignmentID = shr.getUrlRequestParam('assignmentID');
						submitSuccess.call(parent, assignmentID);
					} else {
						// 查看状态
						_self.reloadPage({
							method: 'view'
						});
					}
				} else {
					// 普通提交，返回上一页面
					_self.back();
				}
			}
		});	
	}
	
	,pageFormatter: function() {
		var _self = this;
		_self.isControlFSCTriger();
		
		$("#isControlFSCTimes").bind("change", function() {
			_self.isControlFSCTriger();
		});	
		addValidate($("#weekHour"),"required");
		addValidate($("#dayHour"),"required");
		addValidate($("#monthDay"),"required");
		if(_self.getOperateState() != "VIEW"){
			$("#fillOtByTimeCtl").bind("change", function(){
				_self.isControlFillOtByTimeCtl();
			});
		}
	}
	
	,isControlFSCTriger:function() {
		var obj = $("#fillSignCardTimesAllow");
		if ($("#isControlFSCTimes").attr('checked') == "checked") {
				obj.attr("disabled", false);
				obj.closest(".ui-text-frame").eq(0).removeClass("disabled");
				addValidate(obj,"required");
				addValidate(obj,"myTmVldt");
			} else {
				obj.val(0);
				obj.attr("disabled", true);
				obj.attr("validate", "{maxlength:9,digits:true}");
				obj.closest(".ui-text-frame").eq(0).addClass("disabled");
				removeValidate(obj,"required");
				removeValidate(obj,"myTmVldt");
				$("label[for='fillSignCardTimesAllow']").remove();
			}
	}
	,isControlFillOtByTimeCtl:function() {
		var obj = $("#fillOtAmount");
		if ($("#fillOtByTimeCtl").attr('checked') == "checked") {
				addValidate(obj,"required");
				// addValidate(obj,"myFillCtlVldt");
			} else {
				removeValidate(obj,"required");
				// removeValidate(obj,"myFillCtlVldt");
			}
	}
	/**
	补签卡控制
	*/
	,isFillSignCardTriger:function() {
        var that = this;
		if ($("#isFillSignCard").attr('checked') == "checked") {
			$('#fillSignCardByCycleCtl' ).attr("disabled", false);
			$('#fillSignCardByTimeCtl' ).attr("disabled", false);
			$('#fillSignCardByTimeCtl').closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
            $('#fillSignCardByCycleCtl').closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		} else {

		   that.initiateFillSignCardParameter();

			
 			var fillSignCardByCycleCtl = $('#fillSignCardByCycleCtl');
			fillSignCardByCycleCtl.shrCheckbox("unCheck"); 
			
 			var fillSignCardByTimeCtl = $('#fillSignCardByTimeCtl');
			fillSignCardByTimeCtl.shrCheckbox("unCheck"); 
		}
	},
	/**
	按周期（补签卡）
	*/
	fillSignCardByCycleCtlTriger:function() {
		var that = this;
		if ($("#fillSignCardByCycleCtl").attr('checked') == "checked") {
			if(that.globalFillSignCardAfterDay !=""){
				$('#fillSignCardAfterDay' ).attr("value", that.globalFillSignCardAfterDay);
			}else{
				$('#fillSignCardAfterDay' ).attr("value", 0);
			}
			
			$('#fillSignCardAfterDay' ).attr("disabled", false);
			$('input[id="fillSignCardAfterDay"]').parent().css({"background-color":""})
			
			//$('#fillSignCardCycleType_el' ).attr("value", that.globalFillSignCardCycleType);
			if(that.globalFillSignCardCycleType==2){
			  $("#fillSignCardCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_30 );
			  $('#fillSignCardCycleType_el' ).attr("value", that.globalFillSignCardCycleType);
			}else if(that.globalFillSignCardCycleType==1){
			  $("#fillSignCardCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_70 );
			  $('#fillSignCardCycleType_el' ).attr("value", that.globalFillSignCardCycleType);
			}else{
			  $("#fillSignCardCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_30 );
			  $('#fillSignCardCycleType_el' ).attr("value", 2);
			}
			//$('#fillSignCardCycleType' ).attr("value", );
			var fillSignCardCycleType = $('#fillSignCardCycleType');
			fillSignCardCycleType.shrSelect("enable");

		} else {
			$('#fillSignCardAfterDay' ).attr("value", "");
			$('#fillSignCardAfterDay' ).attr("disabled", "disabled");
			$('input[id="fillSignCardAfterDay"]').parent().css({"background-color":"#ECECEC"})
			
			$('#fillSignCardCycleType' ).attr("value", "");
			$('#fillSignCardCycleType_el' ).attr("value", "");
			var fillSignCardCycleType = $('#fillSignCardCycleType');
			fillSignCardCycleType.shrSelect("disable");
		}
	},
	/**
	按时间段控制（补签卡）
	*/
	fillSignCardByTimeCtlTriger:function() {
	    var that = this;
		if ($("#fillSignCardByTimeCtl").attr('checked') == "checked") {
			if(that.globalFillSignCardAmount !=""){
				$('#fillSignCardAmount' ).attr("value", that.globalFillSignCardAmount);
			}else{
				$('#fillSignCardAmount' ).attr("value", 1);
			}
			
			$('#fillSignCardAmount' ).attr("disabled", false);
			$('input[id="fillSignCardAmount"]').parent().css({"background-color":""})

			//$('#fillSignCardAmountUnit_el' ).attr("value", that.globalFillSignCardAmountUnit);
			if(that.globalFillSignCardAmountUnit==1){
				$("#fillSignCardAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_34);
				$('#fillSignCardAmountUnit_el' ).attr("value", that.globalFillSignCardAmountUnit);
			}else if(that.globalFillSignCardAmountUnit==2){
				$("#fillSignCardAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_63);
				$('#fillSignCardAmountUnit_el' ).attr("value", that.globalFillSignCardAmountUnit);
			}else if(that.globalFillSignCardAmountUnit==3){
				$("#fillSignCardAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_58);
				$('#fillSignCardAmountUnit_el' ).attr("value", that.globalFillSignCardAmountUnit);
			}else {
				$("#fillSignCardAmountUnit" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_63 );
				$('#fillSignCardAmountUnit_el' ).attr("value",2 );
			}
			//$('#fillSignCardAmountUnit' ).attr("value", "月");
			var fillSignCardAmountUnit = $('#fillSignCardAmountUnit');
			fillSignCardAmountUnit.shrSelect("enable");

		} else {
			
			$('#fillSignCardAmount' ).attr("value", "");
			$('#fillSignCardAmount' ).attr("disabled", "disabled");
			$('input[id="fillSignCardAmount"]').parent().css({"background-color":"#ECECEC"})

			$('#fillSignCardAmountUnit' ).attr("value", "");
			$('#fillSignCardAmountUnit_el' ).attr("value", "");
			var fillSignCardAmountUnit = $('#fillSignCardAmountUnit');
			fillSignCardAmountUnit.shrSelect("disable");

		}
	},
	
	/**
	出差单控制
	*/
	isFillTripTriger:function() {
        var that = this;
		if ($("#isFillTrip").attr('checked') == "checked") {
			$('#fillTripByCycleCtl' ).attr("disabled", false);
			$('#fillTripByTimeCtl' ).attr("disabled", false);
			$('#fillTripByTimeCtl').closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
			$('#fillTripByCycleCtl').closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		} else {
	        that.initiateFillTripParameter();

 			var fillTripByCycleCtl = $('#fillTripByCycleCtl');
			fillTripByCycleCtl.shrCheckbox("unCheck");
			
			var fillTripByTimeCtl = $('#fillTripByTimeCtl');
			fillTripByTimeCtl.shrCheckbox("unCheck"); 
		}
	},
	/**
	按周期（出差单）
	*/
	fillTripByCycleCtlTriger:function() {
		var that = this;
		if ($("#fillTripByCycleCtl").attr('checked') == "checked") {
			if(that.globalFillTripAfterDay!=""){
				$('#fillTripAfterDay' ).attr("value", that.globalFillTripAfterDay);
			}else{
				$('#fillTripAfterDay' ).attr("value", 0);
			}
			//$('#fillTripAfterDay' ).attr("value", that.globalFillTripAfterDay);
			$('#fillTripAfterDay' ).attr("disabled", false);
			$('input[id="fillTripAfterDay"]').parent().css({"background-color":""})
			
			//$('#fillTripCycleType_el' ).attr("value", that.globalFillTripCycleType);
			if(that.globalFillTripCycleType==2){
			  $("#fillTripCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_30 );
			  $('#fillTripCycleType_el' ).attr("value", that.globalFillTripCycleType);
			}else if(that.globalFillTripCycleType==1){
			  $("#fillTripCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_70 );
			  $('#fillTripCycleType_el' ).attr("value", that.globalFillTripCycleType);
			}else{
			   $("#fillTripCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_30);
			   $('#fillTripCycleType_el' ).attr("value", 2);
			}
			//$('#fillTripCycleType' ).attr("value", "考勤周期");
			var fillTripCycleType = $('#fillTripCycleType');
			fillTripCycleType.shrSelect("enable");


		} else {
			$('#fillTripAfterDay' ).attr("value", "");
			$('#fillTripAfterDay' ).attr("disabled", "disabled");
			$('input[id="fillTripAfterDay"]').parent().css({"background-color":"#ECECEC"})
			
			$('#fillTripCycleType' ).attr("value", "");
			$('#fillTripCycleType_el' ).attr("value", "");
			var fillTripCycleType = $('#fillTripCycleType');
			fillTripCycleType.shrSelect("disable");
		}
	},
	/**
	按时间段控制（出差单）
	*/
	fillTripByTimeCtlTriger:function() {
	    var that = this;
		if ($("#fillTripByTimeCtl").attr('checked') == "checked") {
			
			//$('#fillTripAmount' ).attr("value", 1);
			if( that.globalFillTripAmount!=""){
				$('#fillTripAmount' ).attr("value", that.globalFillTripAmount);
			}else{
				$('#fillTripAmount' ).attr("value", 1);
			}
			
			$('#fillTripAmount' ).attr("disabled", false);
			$('input[id="fillTripAmount"]').parent().css({"background-color":""})
			//$('#fillTripAmountUnit_el' ).attr("value", that.globalFillTripAmountUnit);
			if(that.globalFillTripAmountUnit==1){
				$("#fillTripAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_34);
				$('#fillTripAmountUnit_el' ).attr("value", that.globalFillTripAmountUnit);
			}else if(that.globalFillTripAmountUnit==2){
				$("#fillTripAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_63);
				$('#fillTripAmountUnit_el' ).attr("value", that.globalFillTripAmountUnit);
			}else if(that.globalFillTripAmountUnit==3){
				$("#fillTripAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_58);
				$('#fillTripAmountUnit_el' ).attr("value", that.globalFillTripAmountUnit);
			}else {
				$("#fillTripAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_63);
				$('#fillTripAmountUnit_el' ).attr("value", 2);
			}
			//$('#fillTripAmountUnit' ).attr("value", "月");
			var fillTripAmountUnit = $('#fillTripAmountUnit');
			fillTripAmountUnit.shrSelect("enable");

		} else {
			
			$('#fillTripAmount' ).attr("value", "");
			$('#fillTripAmount' ).attr("disabled", "disabled");
			$('input[id="fillTripAmount"]').parent().css({"background-color":"#ECECEC"})

			$('#fillTripAmountUnit' ).attr("value", "");
			$('#fillTripAmountUnit_el' ).attr("value", "");
			var fillTripAmountUnit = $('#fillTripAmountUnit');
			fillTripAmountUnit.shrSelect("disable");

		}
	}
	/**
	加班单控制
	*/
	,isFillOtTriger:function() {
        var that = this;
		if ($("#isFillOt").attr('checked') == "checked") {
			$('#fillOtByCycleCtl' ).attr("disabled", false);
			$('#fillOtByTimeCtl' ).attr("disabled", false);
			
			$('#fillOtByTimeCtl').closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
			$('#fillOtByCycleCtl').closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		} else {
	        that.initiateFillOtParameter();

 			var fillOtByCycleCtl = $('#fillOtByCycleCtl');
			fillOtByCycleCtl.shrCheckbox("unCheck");
			
			var fillOtByTimeCtl = $('#fillOtByTimeCtl');
			fillOtByTimeCtl.shrCheckbox("unCheck"); 
		}
	},
	/**
	按周期（加班单）
	*/
	fillOtByCycleCtlTriger:function() {
		var that = this;
		if ($("#fillOtByCycleCtl").attr('checked') == "checked") {
			if(that.globalFillOtAfterDay!=""){
				$('#fillOtAfterDay' ).attr("value", that.globalFillOtAfterDay);
			}else{
				$('#fillOtAfterDay' ).attr("value", 0);
			}
			$('#fillOtAfterDay' ).attr("disabled", false);
			$('input[id="fillOtAfterDay"]').parent().css({"background-color":""})
			
			if(that.globalFillOtCycleType==2){
			  $("#fillOtCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_30 );
			  $('#fillOtCycleType_el' ).attr("value", that.globalFillOtCycleType);
			}else if(that.globalFillOtCycleType==1){
			  $("#fillOtCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_70 );
			  $('#fillOtCycleType_el' ).attr("value", that.globalFillOtCycleType);
			}else{
			   $("#fillOtCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_30);
			   $('#fillOtCycleType_el' ).attr("value", 2);
			}
			
			if(that.globalFillOtAfterDayUnit==3){
				$("#fillOtAfterDayUnit" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_69 );
				$('#fillOtAfterDayUnit_el' ).attr("value", that.FillOtAfterDayUnit);
			}else if(that.globalFillOtAfterDayUnit==4){
				$("#fillOtAfterDayUnit" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_20 );
				$('#fillOtAfterDayUnit_el' ).attr("value", that.FillOtAfterDayUnit);
			}else{
				$("#fillOtAfterDayUnit" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_69 );
				$('#fillOtAfterDayUnit_el' ).attr("value", that.FillOtAfterDayUnit);
			}
			
			var fillOtCycleType = $('#fillOtCycleType');
			fillOtCycleType.shrSelect("enable");
			$("#fillOtAfterDayUnit").shrSelect("enable");


		} else {
			$('#fillOtAfterDay' ).attr("value", "");
			$('#fillOtAfterDay' ).attr("disabled", "disabled");
			$('input[id="fillOtAfterDay"]').parent().css({"background-color":"#ECECEC"})
			
			$('#fillOtCycleType' ).attr("value", "");
			$('#fillOtCycleType_el' ).attr("value", "");
			var fillOtCycleType = $('#fillOtCycleType');
			fillOtCycleType.shrSelect("disable");
			
			$('#fillOtAfterDayUnit' ).attr("value", "");
			$("#fillOtAfterDayUnit").shrSelect("disable");
		}
	},
	/**
	按时间段控制（加班单）
	*/
	fillOtByTimeCtlTriger:function() {
	    var that = this;
		if ($("#fillOtByTimeCtl").attr('checked') == "checked") {
			if( that.globalFillOtAmount!=""){
				$('#fillOtAmount' ).attr("value", that.globalFillOtAmount);
			}else{
				$('#fillOtAmount' ).attr("value", 1);
			}
			
			$('#fillOtAmount' ).attr("disabled", false);
			$('input[id="fillOtAmount"]').parent().css({"background-color":""})
			
			if(that.globalFillOtAmountUnit==1){
				$("#fillOtAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_34);
				$('#fillOtAmountUnit_el' ).attr("value", that.globalFillOtAmountUnit);
			}else if(that.globalFillOtAmountUnit==2){
				$("#fillOtAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_63);
				$('#fillOtAmountUnit_el' ).attr("value", that.globalFillOtAmountUnit);
			}else if(that.globalFillOtAmountUnit==3){
				$("#fillOtAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_58);
				$('#fillOtAmountUnit_el' ).attr("value", that.globalFillOtAmountUnit);
			}else {
				$("#fillOtAmountUnit" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_63);
				$('#fillOtAmountUnit_el' ).attr("value", 2);
			}
			
			var fillOtAmountUnit = $('#fillOtAmountUnit');
			fillOtAmountUnit.shrSelect("enable");

		} else {
			
			$('#fillOtAmount' ).attr("value", "");
			$('#fillOtAmount' ).attr("disabled", "disabled");
			$('input[id="fillOtAmount"]').parent().css({"background-color":"#ECECEC"})

			$('#fillOtAmountUnit' ).attr("value", "");
			$('#fillOtAmountUnit_el' ).attr("value", "");
			var fillOtAmountUnit = $('#fillOtAmountUnit');
			fillOtAmountUnit.shrSelect("disable");

		}
	},
	/**
	员工确认考勤控制
	*/
	isConfirmTriger:function() {
        var that = this;
		if ($("#isConfirm").attr('checked') == "checked") {
			$('#confirmByTimeCtl' ).attr("disabled", false);
			$('#confirmByCycleCtl' ).attr("disabled", false);
			$('#confirmByTimeCtl').closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
			$('#confirmByCycleCtl').closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
		} else {
	        that.initiateConfirmParameter();

 			var confirmByCycleCtl = $('#confirmByCycleCtl');
			confirmByCycleCtl.shrCheckbox("unCheck");
			
			var confirmByTimeCtl = $('#confirmByTimeCtl');
			confirmByTimeCtl.shrCheckbox("unCheck"); 
		}
	},
	/**
	按周期（员工确认考勤）
	*/
	confirmByCycleCtlTriger:function() {
		var that = this;
		if ($("#confirmByCycleCtl").attr('checked') == "checked") {
			if(that.globalConfirmCycleAfterDay !=""){
				$('#confirmCycleAfterDay' ).attr("value", that.globalConfirmCycleAfterDay);
			}else{
				$('#confirmCycleAfterDay' ).attr("value", 5);
			}
			
			$('#confirmCycleAfterDay' ).attr("disabled", false);
			$('input[id="confirmCycleAfterDay"]').parent().css({"background-color":""})
			
			if(that.globalConfirmCycleType==2){
			  $("#confirmCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_30 );
			  $('#confirmCycleType_el' ).attr("value", that.globalConfirmCycleType);
			}else if(that.globalConfirmCycleType==1){
			  $("#confirmCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_70 );
			  $('#confirmCycleType_el' ).attr("value", that.globalConfirmCycleType);
			}else{
			  $("#confirmCycleType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_30 );
			  $('#confirmCycleType_el' ).attr("value", 2);
			}
			//$('#fillSignCardCycleType' ).attr("value", );
			var confirmCycleType = $('#confirmCycleType');
			confirmCycleType.shrSelect("enable");
			
			if(that.globalConfirmCycleDayType==0){
			  $("#confirmCycleDayType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_69 );
			  $('#confirmCycleDayType_el' ).attr("value", that.globalConfirmCycleDayType);
			}else if(that.globalConfirmCycleDayType==1){
			  $("#confirmCycleDayType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_17 );
			  $('#confirmCycleDayType_el' ).attr("value", that.globalConfirmCycleDayType);
			}else{
			  $("#confirmCycleDayType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_69 );
			  $('#confirmCycleDayType_el' ).attr("value", 0);
			}
			//$('#fillSignCardCycleType' ).attr("value", );
			var confirmCycleDayType = $('#confirmCycleDayType');
			confirmCycleDayType.shrSelect("enable");
		} else {
			$('#confirmCycleAfterDay' ).attr("value", "");
			$('#confirmCycleAfterDay' ).attr("disabled", "disabled");
			$('input[id="confirmCycleAfterDay"]').parent().css({"background-color":"#ECECEC"})
			
			$('#confirmCycleDayType' ).attr("value", "");
			$('#confirmCycleDayType_el' ).attr("value", "");
			var confirmCycleDayType = $('#confirmCycleDayType');
			confirmCycleDayType.shrSelect("disable");
			
			$('#confirmCycleType' ).attr("value", "");
			$('#confirmCycleType_el' ).attr("value", "");
			var confirmCycleType = $('#confirmCycleType');
			confirmCycleType.shrSelect("disable");
		}
	},
	/**
	按时间段控制（补签卡）
	*/
	confirmByTimeCtlTriger:function() {
	    var that = this;
		if ($("#confirmByTimeCtl").attr('checked') == "checked") {
			if(that.globalConfirmTimeAfterDay !=""){
				$('#confirmTimeAfterDay' ).attr("value", that.globalConfirmTimeAfterDay);
			}else{
				$('#confirmTimeAfterDay' ).attr("value", 5);
			}
			
			$('#confirmTimeAfterDay' ).attr("disabled", false);
			$('input[id="confirmTimeAfterDay"]').parent().css({"background-color":""})

			if(that.globalConfirmTimeDayType==0){
				$("#comfirmTimeDayType" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_69);
				$('#comfirmTimeDayType_el' ).attr("value", that.globalConfirmTimeDayType);
			}else if(that.globalConfirmTimeDayType==1){
				$("#comfirmTimeDayType" ).attr("value", jsBizMultLan.atsManager_attencePolicyCopy_i18n_17);
				$('#comfirmTimeDayType_el' ).attr("value", that.globalConfirmTimeDayType);
			}else {
				$("#comfirmTimeDayType" ).attr("value",jsBizMultLan.atsManager_attencePolicyCopy_i18n_69 );
				$('#comfirmTimeDayType_el' ).attr("value",0 );
			}
			//$('#fillSignCardAmountUnit' ).attr("value", "月");
			var comfirmTimeDayType = $('#comfirmTimeDayType');
			comfirmTimeDayType.shrSelect("enable");

		} else {
			
			$('#confirmTimeAfterDay' ).attr("value", "");
			$('#confirmTimeAfterDay' ).attr("disabled", "disabled");
			$('input[id="confirmTimeAfterDay"]').parent().css({"background-color":"#ECECEC"})

			$('#comfirmTimeDayType' ).attr("value", "");
			$('#comfirmTimeDayType_el' ).attr("value", "");
			var comfirmTimeDayType = $('#comfirmTimeDayType');
			comfirmTimeDayType.shrSelect("disable");
		}
	}
	,myExtendValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {  
    		myTmVldt: jsBizMultLan.atsManager_attencePolicyCopy_i18n_39
		  });  
		  jQuery.validator.addMethod("myTmVldt", function(value, element) {  
	    	   var v=value||'';
	    	   if(/^(0|[1-9]\d*)$/.test(v)){
	    	   	  return true;
	    	   }else{
	    	   	  return false;
	    	   }
		  }, jsBizMultLan.atsManager_attencePolicyCopy_i18n_39);//msg:错误提示文本。已验证
	   
	 }
	  ,myExtendFillCtrlValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {  
    		myTmVldt: jsBizMultLan.atsManager_attencePolicyCopy_i18n_42
		  });  
		  jQuery.validator.addMethod("myFillCtlVldt", function(value, element) {  
	    	   var v=value||'';
	    	   if(/^[0-9]*[1-9][0-9]*$/.test(v)){
	    	   	  return true;
	    	   }else{
	    	   	  return false;
	    	   }
		  }, jsBizMultLan.atsManager_attencePolicyCopy_i18n_42);//msg:错误提示文本。已验证
	   
	 }
	 	
});

//增加Validate
function addValidate(obj,validator){
	var validateType = obj.attr("validate");
	//case1：非空增加
	if (validateType!="" && validateType!=undefined){
		var validateTypeAfter = validateType.substring(0,validateType.length-1).concat(","+validator+":true}");
		obj.attr("validate",validateTypeAfter);
	}else{
		//case2：空增加
		obj.attr("validate",validator+":true");
	}
	
}

//删除Validate
function removeValidate(obj,validator){
	var validateType = obj.attr("validate");
	var validateTypeAfter = "";
	//存在此validate
	if (validateType.indexOf(validator)>=0){
		//首validate删除
		if (validateType.indexOf(validator) == 1){
			validateTypeAfter = validateType.replace(validator+":true","");
		}
		else {
			//非首validate删除
			validateTypeAfter = validateType.replace(","+ validator +":true","");
		}
		obj.attr("validate",validateTypeAfter);
	}else return;
}
