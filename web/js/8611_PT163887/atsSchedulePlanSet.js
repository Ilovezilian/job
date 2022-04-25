//变动规则基类js
var _ruleDetail_num = 0;
var remberuuid;
var remberAdminOrgUnit;
var beforeId;
shr.defineClass("shr.ats.atsSchedulePlanSet", shr.framework.MultiRow, {
	initalizeDOM : function () {
		shr.ats.atsSchedulePlanSet.superClass.initalizeDOM.call(this);
		var _self = this;
		if(!remberAdminOrgUnit){
		_self.getAdminOrgUnit();
		}
		_self.initPCRuleMultDom();
		 //隐藏第一条记录的删除按钮
		if($(".view_mainPage.row-fluid").length==2){
		   var uuid = $(".view_mainPage.row-fluid")[1].id;
		   $("#delete"+uuid).hide();
		}
		if(_self.getOperateState() !="VIEW"){
		_self.initCurrentHrOrgUnit($("#hrOrgUnit").val());
		}
		_self.initPersonFy();
		if(_self.getOperateState() !="VIEW"){
		_self.initFd();
		}
		if($("#breadcrumb").children().length ==4){
		var list=document.getElementById("breadcrumb");
		list.removeChild(list.childNodes[1]);
		}
		if($("#breadcrumb").children().length ==2){
		$("#breadcrumb").find(".homepage").after('<li><a href="/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsSchedulePlanSet.list&serviceId='+shr.getUrlParam("serviceId")+'&inFrame=true">' 
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_11 
				+ '</a> <span class="divider">/</span></li>');
		}
		if($("#breadcrumb").children().length ==3){
			if($($("#breadcrumb").find("a")[1]).html()==$("#breadcrumb").find(".active").html()){
			var list=document.getElementById("breadcrumb");
			list.removeChild(list.childNodes[2]);
		$("#breadcrumb").find(".homepage").after('<li><a href="/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsSchedulePlanSet.list&serviceId='+shr.getUrlParam("serviceId")+'&inFrame=true">' 
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_11 
				+ '</a> <span class="divider">/</span></li>');
			}
		}
		var stateIs=$("#state").val();
		if(stateIs=="1"){
		$("#enable").hide();
		}
	},initFd:function(){
		var that = this;
		var explain = [];
		explain.push('<div id="popTips'+that.uuid+'_1" class="popTips">' 
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_65 
				+ '</div>');
  
		explain.push('<div id="popTips'+that.uuid+'_2" class="popTips">' 
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_66 
				+ '</div>');

		explain.push('<div id="popTips'+that.uuid+'_3" class="popTips">' 
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_18 
				+ '</div>');
  		var targetWidth  = $('#Postpone'+that.uuid).width() + 35;
		//获取div的位置
		var offset = $('#Postpone'+that.uuid).offset();
		//创建弹出浮层，定位在div的位置
		var tips = $(explain.join("")).css("top",offset.top).css("left",offset.left + 200);
//		var tips = $(explain.join("")).css("left",offset.left + 200);
		//弹出浮层
		$('#Postpone'+that.uuid+'_down').append(tips);
		$('div[id^="popTips"]').css("left", offset.left + targetWidth);
//		$('div[id^="popTips_"]').attr('style','top:' + offset.top + 'px !important').css("left",offset.left + 200);

		$('ul[id="Postpone'+that.uuid+'_down"] li').hover(function(event) { 
	 			$('div[id="popTips'+that.uuid+'_' + $(this).val() + '"]').show('fast').css("top",$(this).offset().top);
		},function() { 
	 			$('div[id="popTips'+that.uuid+'_' + $(this).val() + '"]').hide();
		});
	
	}
	,initPersonFy:function(){
		$("#employeesScope #personFy").each(function(index,ele){
			(ele).remove();	
		})
		$("#employeesScope h5").each(function(index,ele){
		$(ele).append('<span id="personFy"><span style="font-size: 12px;font-weight: 500;"  class="more">?<span class="tips">' 
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_88 
				+ '</span></span></span>');
			
		})
		$("#personFy .tips").hide();
		$("#personFy .more").each(function(index,ele){
			$(ele).mouseover(function(){
				$("#personFy .tips").eq(index).show()
			})
			$(ele).mouseleave(function(){
				$("#personFy .tips").eq(index).hide()
			})
		})
		
	}
	,editMainAction: function() {
	 	var  options = {};
	 	options.method='edit';
	 	options.uipk= 'com.kingdee.eas.hr.ats.app.AtsSchedulePlanSetAdd.form';
	 	options.billId=$('#form #id').val();
	 	this.reloadPage(options);		
				
	},initPCRuleMultDom:function(){
		var _self = this;
		var uuid=_self.uuid;
		remberuuid=uuid;
		if(""==uuid){
		return;
		}
		var serviceAge_num = 0;			 
		var htmls = '<style></style>'
			 +'<ul id="SmartRulesNav">'
			 +'<li style="float:left;width:150px;list-style:none;" data-index=0 d><input style="width: 15%;float:left;" id="isHanduuid'+uuid+'" value="0" name="isHanduuid'+uuid+'" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><div  title="">'
			 + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_36
			 + '<span class="more">?<span class="tips">'
			 + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_63
			 + '</span></span></div></li>'
			 +'<li style="float:left;width:150px;list-style:none;" data-index=1 ><input style="width: 15%;float:left;" id="isHanduuid'+uuid+'" name="isHanduuid'+uuid+'" value="1" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><div  title="">'
			 + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_30
			 + '<span class="more">?<span class="tips">'
			 + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_61
			 + '</span></span></div></li>'
			 +'<li style="float:left;width:150px;list-style:none;" data-index=2 ><input style="width: 15%;float:left;" id="isHanduuid'+uuid+'" name="isHanduuid'+uuid+'" value="2" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><div title="">'
			 + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_3
			 + '<span class="more">?<span class="tips">'
			 + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_60
			 + '</span></span></div></li>'
			 +'<li style="float:left;width:150px;list-style:none;" data-index=3 ><input style="width: 15%;float:left;" id="isHanduuid'+uuid+'" name="isHanduuid'+uuid+'" value="3" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><div title="">'
			 + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_90
			 + '<span class="more">?<span class="tips">'
			 + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_62
			 + '</span></span></div></li>'
			 +'<li style="float:left;width:150px;list-style:none; " data-index=4 ><input style="width: 15%;float:left;" id="isHanduuid'+uuid+'" name="isHanduuid'+uuid+'" value="4" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><div><div title="'
			 + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_95
			 + '">'
			 + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_95
			 + '</div></div></li>'
		 	+'</ul>'

			+'<div id="SmartRulesContent">'
        	+ '<div class="row-fluid row-block content" id="turnShiftClick'+uuid+'">'
            + '<span  title="' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_37 
            + '">' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_37 
            + '</span>'
            + '<input id="turnTime'+uuid+'" name="turnTime'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47 
            + '">'
            + '<span  title="' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_26 
            + '">' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_26 
            + '</span>'
            + '<input id="turnShift'+uuid+'" name="turnShift'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47 
            + '">'
//            + '<label for="number" generated="true" class="error" style="display: block;position:absolute">必录字段</label>'
            + '<span title="' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_24 
            + '">' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_24 
            + '</span>'
            + '<div><input id="turnShiftXh'+uuid+'" name="turnShiftXh'+uuid+'" class="block-father input-height" type="text" style="background-color:#D9EDF7"  ctrlrole="promptBox" autocomplete="off" title="" validate="{required:true}"  placeholder="' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_45 
            + '"></div>'
            + '<span  title="' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_85 
            + '">' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_85 
            + '</span>'
            + '<input id="shiftMonth'+uuid+'" name="shiftMonth'+uuid+'" class="block-father input-height" type="text" validate=""  ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47 
            + '">'
            + '<span title="' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_89 
            + '">' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_89 
            + '</span>'
            + '<div><input id="shiftDay'+uuid+'" name="shiftDay'+uuid+'" class="block-father input-height" type="text" style="background-color:#D9EDF7"  ctrlrole="promptBox" autocomplete="off" title="" validate="{required:true}"  placeholder="' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_45 
            + '"></div>'
            + '<span  title="' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_54 
            + '">' 
            + jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_54 
            + '</span></div>'

        	+ '<div class="row-fluid row-block content" id="isHandCopyShowOrHide'+uuid+'" >'
            + '<div class="col-lg-24 field-desc" ><input style="float:left;"  id="isHandCopy'+uuid+'" name="isHandCopy'+uuid+'" value="0"  type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<span  title="">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_9 ,[
				'</span>'
				+ '<input id="shiftWeek'+uuid+'" name="shiftWeek'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span  title="">'
				,
				'</span>'
				+ '<input id="nextWeek'+uuid+'" name="nextWeek'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span  title="">'
				,
				 '</span>'
				+ '<input id="weekDay'+uuid+'" name="weekDay'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span title="">'
			])
			+ '</span></div><br/><br/>'

        
        	+ '<div class="col-lg-24 field-desc"><input style="float:left;"  id="isHandCopy'+uuid+'" name="isHandCopy'+uuid+'" value="1"  type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
            + '<span  title="">'
            + shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_7 ,[
				 '</span>'
				+ '<input id="shiftMonths'+uuid+'" name="shiftMonths'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span  title="">'
				,
				'</span>'
				+ '<input id="nextMonth'+uuid+'" name="nextMonth'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span  title="">'
				,
				'</span>'
				+ '<div><input id="monthDay'+uuid+'"  name="monthDay'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '"></div>'
				+ '<span  title="">'
			])
			+ '</span></div><br/><br/>'
			+ '<div ><input style="float:left;"   id="isHandCopy'+uuid+'" name="isHandCopy'+uuid+'" value="2"  type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><span  title="">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_6
			+ '</span></div>'
			+ ''
			+ '</div>'

			+ '<div class="row-fluid row-block content" id="isHandSummerShowOrHide'+uuid+'">'
			+ '<div class="col-lg-24 field-desc" >'
			+ '<span title="">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_21,[
				'</span>'
				+ '<input id="summerMonth'+uuid+'" style="background-color:#D9EDF7" name="summerMonth" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_46
				+ '">'
				+ '<span  title="">'
				,
				'</span>'
				+ '<input id="summerToMonth'+uuid+'" style="background-color:#D9EDF7" name="summerToMonth" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_46
				+ '">'
				+ '<span  title="">'
				,
				'</span>'
				+ '<input id="summerShift'+uuid+'" name="summerShift" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span  title="">'
			])
			+ '</span>'
			+ '<span ><i id="serviceAge_adds'+uuid+'" class="icon-plus" style="padding:10px"></i></span>'

			+ '</div><br/>'
			+ '<div  id="summerAge_'+_ruleDetail_num+uuid+'" ><div class="row-fluid row-block row_field">'
			+ '</div></div>'

			+ '<div class="col-lg-24 field-desc">'
			+ '<span  title="'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_85
			+ '">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_99,[
				'</span>'
				+ '<input id="summerShiftMonth'+uuid+'" name="summerShiftMonth'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span  title="">'
				,
				'</span>'
				+ '<input id="summerDay'+uuid+'" name="summerDay'+uuid+'" style="background-color:#D9EDF7" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span  title="">'
			])
			+ '</span>'
			+ '</div>'
			+ '</div>'

			+ '<div class="row-fluid row-block content" id="isHandAutoShowOrHide'+uuid+'">'
			+ '<div class="col-lg-24 field-desc" ><input style="float:left;"  id="isHandShift'+uuid+'" name="isHandShift'+uuid+'" value="0"  type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<span title="">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_2, [
				'</span>'
				+ '<input id="autoMonth'+uuid+'" name="autoMonth'+uuid+'" validate="{required:true}"  class="block-father input-height" type="text" validate="" ctrlrole="text" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span  title="">'
				,
				'</span>'
				+ '<div><input id="autoMonthDay'+uuid+'"  name="autoMonthDay'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="text" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '"></div>'
				+ '<span  title="">'
			])
			+ '</span>'
			+ '</div><br/><br/>'


			+ '<div class="col-lg-24 field-desc"><input style="float:left;"  id="isHandShift'+uuid+'" name="isHandShift'+uuid+'" value="1"  type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<span  title="">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_8,[
				'</span>'
				+ '<input id="AppointShift'+uuid+'" name="AppointShift'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span  title="">'
				,
				'</span>'
				+ '<input id="AppointMonth'+uuid+'" name="AppointMonth'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '">'
				+ '<span  title="">'
				,
				'</span>'
				+ '<div><input id="AppointDay'+uuid+'" name="AppointDay'+uuid+'"  class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '"></div>'
				+ '<span  title="">'
			])
			+ '</span></div><br/>'

			+ '</div>'

			+'<div class="row-fluid row-block content" id="zdyShow" style="display:none;"><div class="col-lg-24 field-ctrl"><span style="margin-left:50px">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_43
			+ '</span><input id="custom'+uuid+'" name="custom'+uuid+'" class="block-father input-height" type="text" validate="" style="background-color:#D9EDF7" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_45
			+ '"><span class="more">?<span class="tips">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_67
			+ '</span></span></div><div class="col-lg-24 field-ctrl"><span style="margin-left:50px">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_42
			+ '</span><input id="custom1'+uuid+'" name="custom1'+uuid+'" style="background-color:#D9EDF7" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_45
			+ '"><span class="more">?<span class="tips">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_69
			+ '</span></span></div><div class="col-lg-24 field-ctrl"><span>'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_97
			+ '</span><input id="custom2'+uuid+'" name="custom2'+uuid+'" style="background-color:#D9EDF7" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_45
			+ '"><span class="more">?<span class="tips">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_68
			+ '</span></span></div></div>'
			+'</div>'
//				 $('#html').append(htmls);
					
			if(_self.getOperateState() =="VIEW"){
				var ItemsJson = _self.getItemsJosn();
				if(ItemsJson){
				var viewRes=ItemsJson.result;
				var getConfig=eval("("+viewRes.atsPCRuleInfo["config"]+")");
				var viewHtml=_self.getViewHtml(getConfig,viewRes);

				var viewHtmlStyle="<style>#"+uuid+" #html div{margin-left:50px;}</style>"
				viewHtml=viewHtmlStyle+"<div>"+viewHtml+"</div>"
				console.log(viewHtml);
				$("#"+uuid).find('#html').append(viewHtml);
				}
			}else{
			 	$("#form"+uuid).find('#html').append(htmls);

			}
					
				_self.getF7(res);
				_self.blindShowDom();
				_self.getShowDom();
				$('#serviceAge_adds'+uuid).bind('click',function(){
				serviceAge_num = serviceAge_num + 1;
				_self.addConditionHtmls(_ruleDetail_num,serviceAge_num);
				});
				_self.defaultHtml(uuid);
				var serviceAge_nums=0;
				$('#serviceAge_add').bind('click',function(){
				serviceAge_nums = serviceAge_nums + 1;
				_self.addConditionHtml(uuid,serviceAge_nums);
				});
				//赋值
				var res;
				if(_self.getOperateState() == 'EDIT' && uuid !=''){
				var ItemsJson = _self.getItemsJosn();
				res=ItemsJson.result;
				$("#adminOrgUni"+uuid+"_el").val(res.atsPCRuleInfo["adminOrgUnitString"]);
			 	$("#adminOrgUni"+uuid+"").val(res.atsPCRuleInfo["adminOrgUnitString.name"]);
				$("#attenceGrou"+uuid+"_el").val(res.atsPCRuleInfo["attenceGroupString"]);
				$("#perso"+uuid+"_el").val(res.atsPCRuleInfo["personString"]);
				$("#attenceGrou"+uuid+"").val(res.atsPCRuleInfo["AttenceGroup.name"]);
				$("#perso"+uuid+"").val(res.atsPCRuleInfo["personString.name"]);
				$("#Postpone"+uuid+"_el").val(res.atsPCRuleInfo["PostponeValue"]);
				$("#Postpone"+uuid).val(res.atsPCRuleInfo["Postpone"]);
				var getConfig=eval("("+res.atsPCRuleInfo["config"]+")");
				_self.setConfigs(getConfig,res);
				for(var i = 0;i<ItemsJson.rows.length;i++){
				_self.setItemHtml(ItemsJson.rows[i],uuid);
			}
			
//			$(function() {
//			var text_json = {
//				id:"autoMonthDay"+uuid,
//				name: "autoMonthDay"+uuid,
//				readonly: "",
//				value: "",
//				validate: "{maxlength:10,required:true}",
//				onChange: null
//			};
//			$('#autoMonthDay'+uuid).shrTextField(text_json);
//				});		
		}
		if(_self.getOperateState() != 'VIEW' && uuid !=''){
		$('#adminOrgUni'+uuid).shrPromptBox("setFilter","longNumber like '" + remberAdminOrgUnit+"!%' or longNumber = '" + remberAdminOrgUnit+"'");
		}
		if(_self.getOperateState() == 'VIEW' && uuid !=''){
				var ItemsJson = _self.getItemsJosn();
				if(ItemsJson){
				res=ItemsJson.result;
				// 员工范围设置-名字只显示一行
				$("#perso"+uuid+"").html(res.atsPCRuleInfo["personString.name"]);
				$("#perso"+uuid+"").addClass("personName")
				$("#perso"+uuid+"").parent().addClass("personNameBox")
				$("#perso"+uuid+"").parent().parent().css({"overflow":"visible"})
				$("#perso"+uuid+"").after("<span class='fullPersonName'>"+res.atsPCRuleInfo["personString.name"]+"</span>")	
			 	$("#adminOrgUni"+uuid+"").html(res.atsPCRuleInfo["adminOrgUnitString.name"]);
				
				$("#attenceGrou"+uuid+"").html(res.atsPCRuleInfo["AttenceGroup.name"]);
				for(var i = 0;i<ItemsJson.rows.length;i++){
				_self.showItemHtml(ItemsJson.rows[i],uuid);
			}
				}
			}
		// 判断员工范围的姓名字段是否大于一行
		if($(".personName").text().length<=20){
			$(".fullPersonName").addClass("oneRow")
		}
		if((_self.getOperateState() == 'EDIT'||_self.getOperateState() == 'ADDNEW') && uuid !=''){
			
			 $("#shiftDay"+uuid).click(function () {
				_self.getShowKj('shiftDay');
			 });
			$("#monthDay"+uuid).click(function () {
				_self.getShowKj('monthDay');
			 });
			 $("#summerDay"+uuid).click(function () {
				_self.getShowKj('summerDay');
			 });
			 $("#autoMonthDay"+uuid).click(function () {
				_self.getShowKj('autoMonthDay');
			 });
			  $("#AppointDay"+uuid).click(function () {
				_self.getShowKj('AppointDay');
			 });
			var slength=$('input[name="summerShift"]').length;
			if(slength>1){
			var sid=$('input[name="summerShift"]')[slength-1].id;
			serviceAge_num=sid.split("_")[1];
			serviceAge_num=Number(serviceAge_num);
			}
		}
	},
	getShowKj:function(idName){
		var uuid=this.uuid;
		$("#"+idName+uuid).parent().find(".calendar").remove();
	 	var dayNum = 31; //月份天数
		  var calendar =
		    '<div class="calendar" style="position:absolute"><ul></ul><button class="confirm">' +
			  jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_52 +
			  '</button><button class="closes">' +
			  jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_51 +
			  '</button></div>';
			$("#"+idName+uuid).after(calendar);
			calendar=	$("#"+idName+uuid).parent().find(".calendar")		
		  for (var i = 0; i < dayNum; i++) {
		    var str = "<li>" +
		      '<input type="checkbox" name="" id="dayNum' + (i + 1) + '">' +
		      '<label for="dayNum' + (i + 1) + '">' + (i + 1) + '</label>' +
		      "</li>"
					calendar.find("ul").append(str)
		  }
		  calendar.find(".closes").on("click", function (e) {
				calendar.remove()
				e.preventDefault()
		  });
		  calendar.find(".confirm").on("click", function (e) {
		    // 下面写要执行的任务
		    var result='';
		    for (var i = 0; i < dayNum; i++) {
		    	if(calendar.find("#dayNum" + (i + 1)).is(":checked")){
		    	result=result+(i + 1)+",";
		    	}
		    	
		    }
		    result=result.substring(0,result.length-1);
		     $("#"+idName+uuid).val(result);
		    
				 calendar.remove();
				e.preventDefault()
		  });
	}
	
	,getShowDom:function(){
		var uuid=this.uuid;
		 //【开始日期】	
		$('input[name="turnTime'+uuid+'"]').shrDateTimePicker({
					id : "turnTime",
					tagClass : 'block-father input-height',
					readonly : '',
					yearRange : '',
					ctrlType: "Date",
					isAutoTimeZoneTrans:false,
					validate : '{dateISO:true,required:true}'
		});
		var select_json = {
			name: "shiftMonth" ,
			readonly: "",
			onChange: null,
		
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_month", 'alias': '1'},
							{'value': "2_month", 'alias': '2'},
							{'value': "3_month", 'alias': '3'}
							];
		$('#shiftMonth'+uuid).shrSelect(select_json);
		$('input[name="shiftMonth'+uuid+'"]').shrSelect(select_json);
		$('input[name="autoMonth'+uuid+'"]').shrSelect(select_json);
		$('input[name="AppointMonth'+uuid+'"]').shrSelect(select_json);
		$('input[name="summerShiftMonth'+uuid+'"]').shrSelect(select_json);
		// // 联级选择按月复制排班
		var shiftMonthsSelectJson = {
			id:"shiftMonths"+uuid,
			name: "shiftMonths" ,
			readonly: "",
			validate: "{required:true}",
			filter: "",
			data : [{"value": "-2_month", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_55},
					{"value": "-1_month", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_57},
					{"value": "0_month", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_13},
					{"value": "1_month", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_72}],
			onChange:null
		};
		$('input[name="shiftMonths'+uuid+'"]').shrSelect(shiftMonthsSelectJson);
		// 动态修改结束月的下拉菜单值
		$('input[name="shiftMonths'+uuid+'"]').on("change",function(e){
			var that=this
			$('input[name="nextMonth'+uuid+'"]').shrSelect("enable");
			var strHtml=""
			if($(e.target).val()==jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_55){
				strHtml='<li value="-1_month" data-value="-1_month"><a>'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_57
				+ '</a></li>'
				+'<li value="0_month" data-value="0_month"><a>' +
					jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_13 +
					'</a></li>'
				+'<li value="1_month" data-value="1_month"><a>' +
					jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_72 +
					'</a></li>'
				+'<li value="2_month" data-value="2_month"><a>' +
					jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_70 +
					'</a></li>'
			}else if($(e.target).val()==jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_57){
				strHtml='<li value="0_month" data-value="0_month"><a>' +
					jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_13 +
					'</a></li>'
				+'<li value="1_month" data-value="1_month"><a>' +
					jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_72 +
					'</a></li>'
				+'<li value="2_month" data-value="2_month"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_70
					+ '</a></li>'
			}else if($(e.target).val()==jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_13){
				strHtml='<li value="1_month" data-value="1_month"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_72
					+ '</a></li>'
				+'<li value="2_month" data-value="2_month"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_70
					+ '</a></li>'
			}else if($(e.target).val()==jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_72){
				strHtml='<li value="2_month" data-value="2_month"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_70
					+ '</a></li>'
			}
			$(".selectPage #nextMonth"+uuid+"_down").html(strHtml)
			$(".selectPage #nextMonth"+uuid+"_down").find("li").click(function(e){
				var nextMonth=$('input[name="nextMonth'+uuid+'"]')
        		e.stopPropagation(); 
        		$(this).parent().hide();
        		nextMonth.val($(this).text());
				var key = $(this)[0].getAttribute('data-value');
				nextMonth.prev('input').val(key);
				nextMonth.attr('title',$(this).text());
        		nextMonth.change();
        		nextMonth.blur();
        		nextMonth.parent().parent().parent().addClass("oe_focused");
 			});
		})

		var nextMonthsSelectJson = {
			id:"nextMonth"+uuid,
			name: "nextMonth" ,
			readonly: "",
			onChange: null,
			
			validate: "{required:true}",
			filter: "",
			data : [{"value": "-1_month", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_57},
					{"value": "0_month", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_13},
					{"value": "1_month", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_72},
					{"value": "2_month", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_70}]
		};
		$('input[name="nextMonth'+uuid+'"]').shrSelect(nextMonthsSelectJson);

		// 联级选择按周复制排班
		var shiftWeekSelectJson = {
			name: "shiftWeek" ,
			id: "shiftWeek"+uuid ,
			readonly: "",
			validate: "{required:true}",
			filter: "",
			data : [{"value": "-2_week", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_56},
					{"value": "-1_week", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_58},
					{"value": "0_week", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_14},
					{"value": "1_week", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_73}],
			onChange:null
	
		};		
		$('input[name="shiftWeek'+uuid+'"]').shrSelect(shiftWeekSelectJson);
		// 动态修改结束周的下拉菜单值
		$('input[name="shiftWeek'+uuid+'"]').on("change",function(e){
			var that=this
			$('input[name="nextWeek'+uuid+'"]').shrSelect("enable");
			var strHtml=""
			if($(e.target).val()==jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_56){
				strHtml='<li value="-1_week" data-value="-1_week"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_58
					+ '</a></li>'
						+'<li value="0_week" data-value="0_week"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_14
					+ '</a></li>'
						+'<li value="1_week" data-value="1_week"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_73
					+ '</a></li>'
						+'<li value="2_week" data-value="2_week"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_71
					+ '</a></li>'
			}else if($(e.target).val()==jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_58){
				strHtml='<li value="0_week" data-value="0_week"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_14
					+ '</a></li>'
						+'<li value="1_week" data-value="1_week"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_73
					+ '</a></li>'
						+'<li value="2_week" data-value="2_week"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_71
					+ '</a></li>'
			}else if($(e.target).val()==jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_14){
				strHtml='<li value="1_week" data-value="1_week"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_73
					+ '</a></li>'
						+'<li value="2_week" data-value="2_week"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_71
					+ '</a></li>'
			}else if($(e.target).val()==jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_73){
				strHtml='<li value="2_week" data-value="2_week"><a>'
					+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_71
					+ '</a></li>'
			}
			$(".selectPage #nextWeek"+uuid+"_down").html(strHtml)
			$(".selectPage #nextWeek"+uuid+"_down").find("li").click(function(e){
				var nextWeek=$('input[name="nextWeek'+uuid+'"]')
        		e.stopPropagation(); 
        		$(this).parent().hide();
        		nextWeek.val($(this).text());
				var key = $(this)[0].getAttribute('data-value');				
				nextWeek.prev('input').val(key);
				nextWeek.attr('title',$(this).text());
        		nextWeek.change();
        		nextWeek.blur();
        		nextWeek.parent().parent().parent().addClass("oe_focused");
 			});
		})


		var nexttWeekSelectJson = {
			name: "nextWeek" ,
			id: "nextWeek"+uuid ,
			readonly: "",
			validate: "{required:true}",
			filter: "",
			data : [{"value": "-2_week", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_56},
					{"value": "-1_week", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_58},
					{"value": "0_week", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_14},
					{"value": "1_week", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_73},
					{"value": "2_week", "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_71}],
			onChange:null
	
		};	
		$('input[name="nextWeek'+uuid+'"]').shrSelect(nexttWeekSelectJson);

		var select_json = {
			name: "weekDay" ,
			readonly: "",
		
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{"value": 1, "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_83},
							{"value": 2, "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_77},
							{"value": 3, "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_79},
							{"value": 4, "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_80},
							{"value": 5, "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_82},
							{"value": 6, "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_78},
							{"value": 7, "alias": jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_81}];
		
		$('input[name="weekDay'+uuid+'"]').shrSelect(select_json);

	},blindShowDom:function(){
		var uuid=this.uuid;
		// 智能排班编辑状态的问号提示内容显示与隐藏
		$("#SmartRulesNav .tips").hide()
		$("#SmartRulesNav .more").each(function(index,ele){
			$(ele).mouseover(function(){
				$("#SmartRulesNav .tips").eq(index).show()
			})
			$(ele).mouseleave(function(){
				$("#SmartRulesNav .tips").eq(index).hide()
			})
		})
		//
		$("#zdyShow .tips").hide();
		$("#zdyShow .more").each(function(index,ele){
			$(ele).mouseover(function(){
				$("#zdyShow .tips").eq(index).show()
			})
			$(ele).mouseleave(function(){
				$("#zdyShow .tips").eq(index).hide()
			})
		})
		
		// 智能排班编辑状态的tab切换
		$("#SmartRulesNav li").each(function(index,ele){
			$(ele).off('click').on("click",function(){
				var nowRule=$(this).parents().filter(".view_mainPage").eq(0)
				var nowUuid=nowRule.attr("id")
				var SmartRulesContent=nowRule.find("#SmartRulesContent>div")
				var SmartRulesNav=$(this).parent().children()
				var liNum=$(this).data('index')				
				SmartRulesContent.eq(liNum).show().siblings().hide()
				// .siblings.hide()
				SmartRulesNav.eq(liNum).find("input[type='radio']").prop("checked",true)
				SmartRulesNav.eq(liNum).siblings().find("input[type='radio']").prop("checked",false)
				SmartRulesNav.eq(liNum).addClass("active").siblings().removeClass("active")

				// 输入框全部禁用
				var inputs=	SmartRulesContent.find("input")
				disableInput(inputs)
				// 选中的解除禁用
				if(liNum===0){
					$("#turnTime"+nowUuid).shrDateTimePicker("enable")
					$("#turnShift"+nowUuid).shrPromptBox("enable")
					$("input[name=shiftMonth"+nowUuid+"]").shrSelect("enable")
					$("#turnShiftXh"+nowUuid).prop("disabled",false)
					$("#shiftDay"+nowUuid).prop("disabled",false)
				}else if(liNum===1){
					// $("#isHandCopy"+uuid).prop("disabled",false)
					$("input[name=isHandCopy"+nowUuid+"]").prop("disabled",false)
					$("input[name=isHandCopy"+nowUuid+"]").off('click').on("click",function(){
						var value=$(this).val()
						if(value==='0'){
							$("input[name=shiftWeek"+nowUuid+"]").shrSelect("enable")
							$("input[name=nextWeek"+nowUuid+"]").shrSelect("enable")
							$("input[name=weekDay"+nowUuid+"]").shrSelect("enable")
							$("input[name=shiftMonths"+nowUuid+"]").shrSelect("disable")					
							$("input[name=nextMonth"+nowUuid+"]").shrSelect("disable")
							$("#monthDay"+nowUuid).prop("disabled",true)
						}else if(value==='1'){
							$("input[name=shiftWeek"+nowUuid+"]").shrSelect("disable")
							$("input[name=nextWeek"+nowUuid+"]").shrSelect("disable")	
							$("input[name=weekDay"+nowUuid+"]").shrSelect("disable")	
							$("input[name=shiftMonths"+nowUuid+"]").shrSelect("enable")			
							$("input[name=nextMonth"+nowUuid+"]").shrSelect("enable")
							$("#monthDay"+nowUuid).prop("disabled",false)
						}else if(value==='2'){
							$("input[name=shiftWeek"+nowUuid+"]").shrSelect("disable")	
							$("input[name=nextWeek"+nowUuid+"]").shrSelect("disable")
							$("input[name=weekDay"+nowUuid+"]").shrSelect("disable")	
							$("input[name=shiftMonths"+nowUuid+"]").shrSelect("disable")					
							$("input[name=nextMonth"+nowUuid+"]").shrSelect("disable")
							$("#monthDay"+nowUuid).prop("disabled",true)
						}
						
					})
					$("input[name=isHandCopy"+nowUuid+"]").eq(0).trigger("click")
				}	else if(liNum===2){
					$("input[name=summerMonth]").prop("disabled",false)
					$("input[name=summerToMonth]").prop("disabled",false)
					$("input[name=summerShift]").shrPromptBox("enable")
					$("input[name=summerShiftMonth"+nowUuid+"]").shrSelect("enable")
					$("input[name=summerDay"+nowUuid+"]").prop("disabled",false)
				}else if(liNum===3){
					$("input[name=isHandShift"+nowUuid+"]").prop("disabled",false)
					$("input[name=isHandShift"+nowUuid+"]").off('click').on("click",function(){
						var value=$(this).val()
						if(value==='0'){
							$("input[name=autoMonth"+nowUuid+"]").shrSelect("enable")
							$("input[name=autoMonthDay"+nowUuid+"]").prop("disabled",false)
							$("input[name=AppointShift"+nowUuid+"]").shrPromptBox("disable")
							$("input[name=AppointMonth"+nowUuid+"]").shrSelect("disable")
							$("input[name=AppointDay"+nowUuid+"]").prop("disabled",true)
						}else if(value==='1'){
							$("input[name=autoMonth"+nowUuid+"]").shrSelect("disable")
							$("input[name=autoMonthDay"+nowUuid+"]").prop("disabled",true)
							$("input[name=AppointShift"+nowUuid+"]").shrPromptBox("enable")
							$("input[name=AppointMonth"+nowUuid+"]").shrSelect("enable")
							$("input[name=AppointDay"+nowUuid+"]").prop("disabled",false)
						}
					})
					$("input[name=isHandShift"+nowUuid+"]").eq(0).trigger("click")
				}else if(liNum===4){
					$("input[name=custom"+nowUuid+"]").prop("disabled",false)
					$("input[name=custom1"+nowUuid+"]").prop("disabled",false)
					$("input[name=custom2"+nowUuid+"]").prop("disabled",false)
				}
			})
		})

		function disableInput(inputArr){
			inputArr.each(function(index,ele){
				var type=$(ele).attr("ctrlrole")
				try {
					if(type==="datepicker"){
						$(ele).shrDateTimePicker("disable")
					}else if(type==="promptBox"){
						$(ele).shrPromptBox("disable")
					}else if(type==="select"){
						$(ele).shrSelect("disable")
					}else{
						$(ele).prop("disabled",true)
					}
				} catch (error) {
					$(ele).prop("disabled",true)
				}
				if($(ele).attr("type")=="radio"){
					$(ele).prop("checked",false)
				}
			})
		}


	},getF7:function(res){
		var uuid =this.uuid;
		var hrorgunit = $("#hrOrgUnit").val();
		var grid_f7_json = {id:"turnShift"+uuid,name:"turnShift"+uuid};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_35,uipk:"com.kingdee.eas.hr.ats.app.AtsTurnShift.AvailableList.F7",query:""};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
//		if(_self.getOperateState() == 'EDIT' && uuid !=''){
//		grid_f7_json.value = {id:res.atsPCRuleInfo["adminOrgUnitString"],name:res.atsPCRuleInfo["adminOrgUnitString.name"]};
//		}
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrorgunit ;		
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_74,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		var object = $('input[name="turnShift'+uuid+'"]');
		object.shrPromptBox(grid_f7_json);
		object.shrPromptBox("setBizFilterFieldsValues",hrorgunit);

		grid_f7_json = {id:"AppointShift"+uuid,name:"AppointShift"+uuid};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_10,uipk:"com.kingdee.eas.hr.ats.app.AtsShift.AvailableList.F7",query:""};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrorgunit ;		
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_74,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		var object = $('input[name="AppointShift'+uuid+'"]');
		object.shrPromptBox(grid_f7_json);
		object.shrPromptBox("setBizFilterFieldsValues",hrorgunit);
		
		grid_f7_json = {id:"summerShift"+uuid,name:"summerShift"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_10,uipk:"com.kingdee.eas.hr.ats.app.AtsShift.AvailableList.F7",query:""};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrorgunit ;		
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_74,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		var object = $('#summerShift'+uuid);
		object.shrPromptBox(grid_f7_json);
		object.shrPromptBox("setBizFilterFieldsValues",hrorgunit);
	
	},addConditionHtmls:function(ruleDetail_num,condition_num){
		var hrorgunit = $("#hrOrgUnit").val();
		var that = this;
		var uuid=that.uuid;
		var pre_prop_value = "summer_"+ruleDetail_num+'_'+condition_num;
		var pre_prop_shift = "summerShift"+uuid+'_'+condition_num;
		var con_tpl =  shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_0,[
				'<div id ="condition_item_'+ruleDetail_num+'_'+condition_num+'" name = "condition_item" class="row-fluid row-block row_field addItem" style="width: 115%">'
				+ '<input type="hidden" name="conditionId"  /><span class="cell-RlStdType"></span>'
				+ '<span title="">',
				'</span>'
				// + '<div class="span2 field-ctrl">' 
				+ '<input name_value = "prop_field_html" id="summerMonth'+uuid+'_'+condition_num+'" name="summerMonth" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_46
				+ '"/>'
				// + '</div>'
				+ '<span >',
				'<input  type="text" name="summerToMonth" id="summerToMonth'+uuid+'_'+condition_num+'" class="input-height cell-input" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_46
				+ '"/></span>'
				+ '<span >',
				'<input id='+pre_prop_shift+' type="text" name="summerShift" class="input-height cursor-pointer" placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
				+ '"></span>'
				+ '<span  title="">',
				'</span>'
				+'<span><i class="icon-remove" style="padding:10px"></i></span>'
				+ '</div>'
		]);
		$("#summerAge_"+ruleDetail_num+uuid).append(con_tpl);
			
		var grid_f7_json = {id:pre_prop_shift,name:"summerShift"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_10,uipk:"com.kingdee.eas.hr.ats.app.AtsShift.AvailableList.F7",query:""};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrorgunit ;		
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_74,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		var object = $('#'+pre_prop_shift);
		object.shrPromptBox(grid_f7_json);
		object.shrPromptBox("setBizFilterFieldsValues",hrorgunit);

			//删除
		$('#condition_item_'+ruleDetail_num+'_'+condition_num+' i[class="icon-remove"]').unbind('click').bind('click',function(){
			$(this).closest("div.row_field").remove();
		});
	},defaultHtml:function(uuid){
		var _self=this;
		var html=''
	 			 + '<div class="row-fluid row-block">'
				 + '<div  id="serviceAge_'+uuid+'" ><div class="row-fluid row-block row_field">'
				 + '<div class="col-lg-3"><div style=" text-align: right;" class="field_label" title="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_44
				+ '">'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_44
				+ '</div></div>';
				  if(_self.getOperateState() !="VIEW"){
				 html=html+ '<div><i id="serviceAge_add" class="icon-plus" style="padding:2px" ></i></div>'
				  }
				html=html + '</div></div>'
				 + '</div>';
				 if(_self.getOperateState() =="VIEW"){
					 $("#"+uuid).find('#otherHtml').append(html);
					}else{
					 $("#form"+uuid).find('#otherHtml').append(html);
					 
					}
	
	},addConditionHtml:function(ruleDetail_num,condition_num){
		
		var that = this;
		var pre_prop_value = "prop_value_"+ruleDetail_num+'_'+condition_num;
		var con_tpl =  
			'<div id ="condition_item_'+ruleDetail_num+'_'+condition_num+'" name = "condition_item" class="row-fluid row-block row_field addItem" style="width: 100%">'
			+ '<div class="col-lg-3"><input type="hidden" name="conditionId"  /><span class="cell-RlStdType"></span></div>'
			+ '<div class="span2 field-ctrl firstItem">' 
			+ '<input name_value = "prop_field_html" placeholder="'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_47
			+ '"/>'
			+ '</div>'
			+ '<div class="span2"><input id="prop_op" type="text" name="prop_op" class="input-height cell-input" /></div>'
			+ '<div class="span2 field-ctrl"><input id='+pre_prop_value+' type="text" name="prop_value" class="input-height cursor-pointer" ></div>'
			+'<span class="span1 field_add" style="display: table-cell;width:126px"><i class="icon-remove" style="padding:10px"></i></span>'
			+ '</div>';
			$("#serviceAge_"+ruleDetail_num).append(con_tpl);
			
			var tree_f7_json = {id:"prop_field",name:"prop_field"};
			
			var that = this;
			that.remoteCall({
				type:"post",
				async: false,
				method:"getFields",
				param:{handler:"com.kingdee.shr.ats.web.handler.HolidayRuleEditHandler"},
				success:function(response){
					_treeNode = response;
				}
			});
		
			tree_f7_json.subWidgetName = 'shrPromptTree';
			tree_f7_json.subWidgetOptions = 
				{
					treeSettings:{},
					width:250,
					zNodes : _treeNode
				};
		$("#condition_item_"+ruleDetail_num+"_"+condition_num+" input[name_value='prop_field_html']").shrPromptBox(tree_f7_json);
		that._addItemEventListener(ruleDetail_num,condition_num);
		
		//删除
		$('#condition_item_'+ruleDetail_num+'_'+condition_num+' i[class="icon-remove"]').unbind('click').bind('click',function(){
			$(this).closest("div.row_field").remove();
		});
		
						
		
	},_addItemEventListener:function(ruleDetail_num,condition_num){
			var pre_prop_value = "prop_value_"+ruleDetail_num+"_"+condition_num;
			var prop_op_json = {id:"prop_op"};
			prop_op_json.data = [{value:"like",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_12},
			                    {value:"not like",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_16},
			                    {value:"=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_25},
			                    {value:"<>",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_17},
			                    {value:">",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_22},
			                    {value:"<",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_75}
			            		];
			
			var prop_op_date_json = {id:"prop_op"};
			prop_op_date_json.data = [{value:"=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_25},
			                    {value:"<>",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_17},
			                    {value:">",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_22},
			                    {value:"<",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_75},
			                    {value:">=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_23},
			                    {value:"<=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_76}
			            		];
			
			var prop_boolean_json = {id:"prop_op"};
			prop_boolean_json.data = [
			                    {value:"=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_25},
			                    {value:"<>",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_17}
			            		];
			$('input[id="prop_field"]').shrPromptBox("option",{onchange:function(e,value){
//				$(this).parents(".ui-promptBox-frame").next().replaceWith('<input id="prop_op" type="text" name="prop_op" class="search-input-length input-height"/>');
				$(this).parents("div[name='condition_item']").find(".span2").eq(1).children().replaceWith('<input id="prop_op" type="text" name="prop_op" class="input-height cell-input">');
				$(this).parents("div[name='condition_item']").find(".span2").eq(2).children().replaceWith('<input id='+pre_prop_value+' type="text" name="prop_value" class="input-height cursor-pointer" style="width:126px">');
				var prop_op_ctrl =  $(this).closest('.row-fluid').find('input[id="prop_op"]');
				var prop_value_ctrl =  $(this).closest('.row-fluid').find('input[id^="prop_value"]');
				prop_op_ctrl.css("width","");
				prop_op_ctrl.wrap("<div></div>");
				$(this).addClass("input-height");
				if(value.current != null){
					var id = value.current.id;
					var name = value.current.name;
					var type = value.current.type;
					var uipk = value.current.uipk;
					var enumSource = value.current.enumSource;
					var field = value.current.field;
					$(this).data('fieldValue', value.current);
					$(this).attr("prop_field",field);
					$(this).attr("field_type",type);
					if(enumSource!=undefined
						&&enumSource!=null
						&&enumSource!=""){
						$(this).attr("enumSource",enumSource);
					}else{
						$(this).removeAttr("enumSource");
					}
					if(type == "Date" || type == "TimeStamp"){
						prop_op_ctrl.shrSelect(prop_op_date_json);
						prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
						
						var picker_json = {};
						picker_json.id = pre_prop_value;
						prop_value_ctrl.shrDateTimePicker($.extend(picker_json,{ctrlType: type,isAutoTimeZoneTrans:false}));
						prop_value_ctrl.css("width","90px");
					}
					if(type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int"){
						prop_op_ctrl.shrSelect(prop_op_date_json);
						prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
					}
					if(type == "StringEnum" || type == "IntEnum"){
						prop_op_ctrl.shrSelect(prop_boolean_json);
						prop_op_ctrl.shrSelect("setValue", prop_boolean_json.data[0].value);
						
						var select_json = {};
						select_json.id = pre_prop_value;
						select_json.enumSource = enumSource;
						prop_value_ctrl.shrSelect(select_json);
						prop_value_ctrl.css("width","90px");
					}
					if(type == "Boolean"){
						prop_op_ctrl.shrSelect(prop_boolean_json);
						prop_op_ctrl.shrSelect("setValue", prop_boolean_json.data[0].value);
						
						var select_json = {id:pre_prop_value};
						select_json.data = [{value:"1",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_59},
						                    {value:"0",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_28}
						            		];
						prop_value_ctrl.shrSelect(select_json);
						prop_value_ctrl.css("width","90px");
					}
					if(type == "String"){
						prop_op_ctrl.shrSelect(prop_op_json);
						prop_op_ctrl.shrSelect("setValue", prop_op_json.data[0].value);
						prop_value_ctrl.css("width","126px");
						prop_value_ctrl.attr("placeholder",jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_27);
					}
					if(uipk!=null && uipk!="null" && uipk!="undefined"){
						var f7FieldName = value.current.f7FieldName;
						var f7Json = {id:pre_prop_value,name:"prop_value"};
						if(f7FieldName!=undefined){
							f7Json.displayFormat = "{"+f7FieldName+"}";
						}
						f7Json.subWidgetName = 'shrPromptGrid';
						f7Json.subWidgetOptions = {title:name,uipk:uipk,multiselect:true};
						prop_value_ctrl.shrPromptBox(f7Json);
						prop_value_ctrl.unbind("keydown.shrPromptGrid");
						prop_value_ctrl.unbind("keyup.shrPromptGrid");
						prop_value_ctrl.attr("placeholder","");
						prop_value_ctrl.attr("uipk",uipk);
						prop_value_ctrl.css("width","90px");
					}
					$(".select_field >div").addClass("search-emp-field");
					prop_op_ctrl.shrSelect("option",{onChange:function(e,value){
						$(this).parents(".ui-select-frame").removeClass("oe_focused");
						prop_value_ctrl.focus();
						if(type == "Boolean" || type == "StringEnum" || type == "IntEnum"){
							prop_value_ctrl.shrSelect("selectClick");
						}
					}});
					
				}
			}});
		}
	,
	addServiceItem:function(ruleDetail_num,serviceAge_num){
		
		var prop_pre_json = { id:"preCmpType",
	    					 readonly: "",
	    					 value: ">=",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
		prop_pre_json.data = [{value:">",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_22},
		                    {value:">=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_23}
		            		];
		var prop_next_json = {id:"nextCmpType",
							 readonly: "",
	    					 value: "<",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
							};
		prop_next_json.data = [
		                    {value:"<",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_75},
		                    {value:"<=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_76}
		            		];
		var position = {id:"position",
							 readonly: "",
	    					 value: "<",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
							};
		position.data = [
		                    {value:"<",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_94},
		                    {value:"<=",alias:"ceo"}
		            		];
							
		var work_item_label = 
			 '<div id = "service_item_'+ruleDetail_num+'_'+serviceAge_num+'" name="service_item" class="row-fluid row-block row_field" style="width: 115%">'
			//	+ '<div class="span1"><span class="cell-RlStdType">司龄</span></div>'
				+ '<div class="span2" id><input type="text" name="preCmpType" class="input-height cursor-pointer"  placeholder="'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_53
				+ '"/></div>'
			//	+ '<div class="span2"><input type="hidden" name="itemId"  /><input type="text"  name = "pre" class="input-height cell-input" /><span class="cell-lable">年</span></div>'
				+ '<div class="span2"><input type="text" name="nextCmpType"class="input-height cursor-pointer" dataextenal="" placeholder=""   "/></div>'
			//	+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_1
				+ '<div class="span2"><input type="text"   name = "position" class="input-height cell-input" /></div>'
				+ '<div class="span2"><i class="icon-remove" style="padding:10px"></i></div>'
			+ '</div>';
		$('#serviceAge_'+ruleDetail_num).append(work_item_label);	
		
		$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' input[name=position]').shrSelect(position);    
		$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' input[name=nextCmpType]').shrSelect(prop_next_json);
		var grid_f7_json = null;
		grid_f7_json = {id:"preCmpType",name:"preCmpType"};
		grid_f7_json = {id:"preCmpType",name:"preCmpType"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:"",uipk:"com.kingdee.eas.basedata.org.app.HROrgPosition.f7",query:"",filter:"",domain:"",multiselect:true};
		grid_f7_json.readonly = '';
		$("input[name='preCmpType']").shrPromptBox(grid_f7_json);
		//删除
		$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' i[class="icon-remove"]').unbind('click').bind('click',function(){
			$(this).closest("div.row_field").remove();
		});
		
	},assembleSaveData: function(action) {
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		data.method = action;
		data.operateState = _self.getOperateState();
		//组装新的model   
		asmodel=_self.assembleModel();
		var cc;
		if($.type($("#adminOrgUni"+_self.uuid).shrPromptBox("getValue")) === "array"){
		cc=$("#adminOrgUni"+_self.uuid).shrPromptBox("getValue").map(function(adminOrgUniE){
			return adminOrgUniE.longNumber;
		}).join(",");
		}else{
		cc=$("#adminOrgUni"+_self.uuid).shrPromptBox("getValue").longNumber;
		}
		if(!cc){
			cc=$("#adminOrgUni"+_self.uuid+"_el").val();
		}
		var adminOrgUnit=$("#adminOrgUni"+this.uuid+"_el").val();
		asmodel.adminOrgUnitString=cc;
		var attenceGroup_el=$("#attenceGrou"+this.uuid+"_el").val();
		asmodel.attenceGroupString=attenceGroup_el;
		
		var proposer_el=$("#perso"+this.uuid+"_el").val();
		asmodel.personString=proposer_el;
		
		if($("#isSub"+this.uuid).is(":checked")){
			asmodel.isSub=1;
		}else{
			asmodel.isSub=0;
		}

		if($("#isEscrow"+this.uuid).is(":checked")){
			asmodel.isEscrow=1;
		}else{
			asmodel.isEscrow=0;
		}
		asmodel.description=beforeId;
		
		var config = this.getConfig();
		JSON.stringify(config);
		asmodel.config=JSON.stringify(config);
		
		var rule_item = [];var condition_item = [];
		//
		var condition_item_length=$("#form"+this.uuid).find("div[name = 'condition_item']").length;
		for(var j = 0;j<condition_item_length;j++){
		var config=_self.getFilterData($("#form"+this.uuid).find("div[name = 'condition_item']").eq(j).attr('id'));
		if(!config){
		continue; 
		}
		var condition_item_one = {
			config: JSON.stringify(config)
		};
		condition_item.push(condition_item_one);	
		}
		//
		var rule_item_json = 
				{
					
					items:condition_item
				};
				
				
		rule_item.push(rule_item_json);
		asmodel.conditionItems=rule_item;
//		delete asmodel.hrOrgUnit;
		
		data.model = shr.toJSON(asmodel); 
		
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		
		return data;
	},getConfig:function(){
		var uuid=this.uuid;
	var type=$('input[name="isHanduuid'+uuid+'"]:checked').val();
//	var config = {name:"zhu",arr:[]};
		var config = {};
		if(type==0){
		var turnTime= atsMlUtile.getFieldOriginalValue("turnTime"+uuid);
		
		var turnShift_el=$("#turnShift"+uuid+"_el").val();
		
		var turnShiftXh=$("#turnShiftXh"+uuid).val();
		
		var shiftMonth_el=$('input[name="shiftMonth'+uuid+'_el"]').val();
		
		var shiftDay=$('input[name="shiftDay'+uuid+'"]').val();
		config ={"arrangeClass":"com.kingdee.eas.hr.ats.workShift.arrange.ArrangeShiftByTurns",type:"0",calStartDate:turnTime
		,turnShiftId:turnShift_el,startSegmnet:turnShiftXh,scheduleDate:shiftMonth_el,excuteDay:shiftDay};
		}else if(type==1){
			var isHandCopy=$('input[name="isHandCopy'+uuid+'"]:checked').val();
			var shiftWeek_el=$('input[name="shiftWeek'+uuid+'_el"]').val();
			var nextWeek_el=$('input[name="nextWeek'+uuid+'_el"]').val();
			var weekDay_el=$('input[name="weekDay'+uuid+'_el"]').val();
			
			var shiftMonths_el=$('input[name="shiftMonths'+uuid+'_el"]').val();
			var nextMonth_el=$('input[name="nextMonth'+uuid+'_el"]').val();
			var monthDay=$('input[name="monthDay'+uuid+'"]').val();
			if(isHandCopy==0){
			config ={arrangeClass:"com.kingdee.eas.hr.ats.workShift.arrange.ArrangeShiftByCopy",type:"1",isHandCopy:"0",copySourceDate:shiftWeek_el,scheduleDate:nextWeek_el,excuteDay:weekDay_el};
			}else if(isHandCopy==1){
			config ={arrangeClass:"com.kingdee.eas.hr.ats.workShift.arrange.ArrangeShiftByCopy",type:"1",isHandCopy:"1",copySourceDate:shiftMonths_el,scheduleDate:nextMonth_el,excuteDay:monthDay};
			}else if(isHandCopy==2){
			config ={arrangeClass:"com.kingdee.eas.hr.ats.workShift.arrange.ArrangeShiftByCopy",type:"1",isHandCopy:"2",copySourceDate:"0_day",scheduleDate:"1_day"};
			}
		}else if(type==2){
			var length=$("#form"+uuid).find($("input[name='summerToMonth']")).length;
			var summerMonth=$("#summerMonth"+uuid).val();
			var summerToMonth=$("#summerToMonth"+uuid).val();
			var summerShift=$("#summerShift"+uuid).val();
			var summerDay=$("#summerDay"+uuid).val();
			var summerShiftMonth=$("input[name='summerShiftMonth"+uuid+"_el']").val();
			var condition_item = [];
			for(var i=0;i<length;i++){
			var summerMonthid=$("#form"+uuid).find($("input[name='summerMonth']")).eq(i).attr('id');
			var summerToMonthid=$("#form"+uuid).find($("input[name='summerToMonth']")).eq(i).attr('id');
			var summerShiftid=$("#form"+uuid).find($("input[name='summerShift']")).eq(i).attr('id');
			var summerMonth=$("#"+summerMonthid).val();
			var summerToMonth=$("#"+summerToMonthid).val();
			var summerShift=$("#"+summerShiftid+"_el").val();
			var summerShiftName=$("#"+summerShiftid).val();
			if(summerShift==undefined || summerShift==null || summerShift==""){
					return ;   	
			}
			var configItems ={"arrangeClass":"com.kingdee.eas.hr.ats.workShift.arrange.ArrangeShiftByShift",excuteDay:summerDay,shiftName:summerShiftName,scheduleDate:summerShiftMonth,beginDate:summerMonth,endDate:summerToMonth,atsShiftId:summerShift};
			condition_item.push(configItems);
			}
			config={type:"2",conditionItem:condition_item};
		}else if(type==3){
			var isHandShift=$('input[name="isHandShift'+uuid+'"]:checked').val();
			var autoMonth_el=$('input[name="autoMonth'+uuid+'_el"]').val();
			var autoMonthDay=$('input[name="autoMonthDay'+uuid+'"]').val();
			var AppointShift_el=$('#AppointShift'+uuid+'_el').val();
			var AppointMonth_el=$('input[name="AppointMonth'+uuid+'_el"]').val();
			var AppointDay=$('input[name="AppointDay'+uuid+'"]').val();
			if(isHandShift==0){
			config ={"arrangeClass":"com.kingdee.eas.hr.ats.workShift.arrange.ArrangeShiftByShift",type:"3",isHandShift:"0",scheduleDate:autoMonth_el,excuteDay:autoMonthDay};
			}else if(isHandShift==1){
			config ={"arrangeClass":"com.kingdee.eas.hr.ats.workShift.arrange.ArrangeShiftByShift",type:"3",isHandShift:"1",atsShiftId:AppointShift_el,scheduleDate:AppointMonth_el,excuteDay:AppointDay};
			}
		}else if(type==4){
			
			var custom=$('input[name="custom'+uuid+'"]').val();
			var custom1=$('input[name="custom1'+uuid+'"]').val();
			var custom2=$('input[name="custom2'+uuid+'"]').val();
			config ={type:type,arrangeClass:custom,arrangeManageClass:custom1,scheduleParamAnalysorClass:custom2};
			
		}
		return config;
	},
	//
	getItemsJosn : function(){
		var atsPCRuleId=_self.billId;
		var returnVal ;
		var data = {
					atsPCRuleId:atsPCRuleId
		};
		shr.doAjax({
					url: shr.getContextPath()+"/dynamic.do?method=getItemsJson&handler=com.kingdee.shr.ats.web.handler.AtsSchedulePlanMulitRowHandler",
					dataType:'json',
					type: "POST",
					async:false,
					data: data,
					success: function(response){ 
						var rst= response||{};
						returnVal =  rst;
						
					}
				});	
		return returnVal;		
				
	},setConfigs:function(res,result){
	var that=this;
	var uuid=that.uuid;
	var type=res.type;
	var turnTime=res.calStartDate;
	var turnShiftXh=res.startSegmnet;
	var shiftDay=res.excuteDay;
	$('input[name="isHanduuid'+uuid+'"]').get(type).checked=true
	// 展开配置中选中的智能排班类型
	$("#SmartRulesNav li").each(function(index,ele){	
		if($(ele).find("input").prop("checked")){
			$(ele).triggerHandler("click")
		}
	})
	if(type==0){
	var shiftMonth_el=res.scheduleDate;
	var turnShiftId=res.turnShiftId;
	var turnShiftName=result.atsTurnShiftName;
	atsMlUtile.setTransDateValue("turnTime"+uuid, turnTime)
	$("#turnShiftXh"+uuid).val(turnShiftXh);
	$("#shiftDay"+uuid).val(shiftDay);
	
	$("#turnShift"+uuid).val(turnShiftName);
	$("#turnShift"+uuid+"_el").val(turnShiftId);
	
	$('input[name="shiftMonth'+uuid+'_el"]').val(shiftMonth_el);
	$('input[name="shiftMonth'+uuid+'"]').val(that.getSelectAlias("month",shiftMonth_el));
	}else if(type==1){
		var scheduleDate=res.scheduleDate;
		var copySourceDate=res.copySourceDate;
		var isHandCopy=res.isHandCopy;
		var excuteDay=res.excuteDay;
		$('input[name="isHandCopy'+uuid+'"]').eq(isHandCopy).trigger("click");
		if(isHandCopy==0){
		$('input[name="shiftWeek'+uuid+'_el"]').val(copySourceDate);
		$('input[name="shiftWeek'+uuid+'"]').val(that.getSelectAlias("sweek",copySourceDate)).trigger("change");
		$('input[name="nextWeek'+uuid+'_el"]').val(scheduleDate);
		$('input[name="nextWeek'+uuid+'"]').val(that.getSelectAlias("sweek",scheduleDate));
		$('input[name="weekDay'+uuid+'_el"]').val(excuteDay);
		$('input[name="weekDay'+uuid+'"]').val(that.getSelectAlias("week",excuteDay));
		}else if(isHandCopy==1){	
		$('input[name="shiftMonths'+uuid+'_el"]').val(copySourceDate);
		$('input[name="shiftMonths'+uuid+'"]').val(that.getSelectAlias("smonth",copySourceDate)).trigger("change");
		$('input[name="nextMonth'+uuid+'_el"]').val(scheduleDate);
		$('input[name="nextMonth'+uuid+'"]').val(that.getSelectAlias("smonth",scheduleDate));
		$('input[name="monthDay'+uuid+'_el"]').val(excuteDay);
		$('input[name="monthDay'+uuid+'"]').val(excuteDay);
		}
	}else if(type==2){
			var timeShift=res.conditionItem;
			var length=timeShift.length;
			var excuteDay=timeShift[0].excuteDay;
			var scheduleDate=timeShift[0].scheduleDate;
			for(var i=0;i<length;i++){
			if(i != 0){
			that.addConditionHtmls(_ruleDetail_num,i);
			}
			var beginDate=timeShift[i].beginDate;
			var endDate=timeShift[i].endDate;
			var atsShiftId=timeShift[i].atsShiftId;
			var shiftName=timeShift[i].shiftName;
			var summerMonthid=$("#form"+uuid).find($("input[name='summerMonth']")).eq(i).attr('id');
			var summerToMonthid=$("#form"+uuid).find($("input[name='summerToMonth']")).eq(i).attr('id');
			var summerShiftid=$("#form"+uuid).find($("input[name='summerShift']")).eq(i).attr('id');
			$("#"+summerMonthid).val(beginDate);
			$("#"+summerToMonthid).val(endDate);
			$("#"+summerShiftid+"_el").val(atsShiftId);
			$("#"+summerShiftid).val(shiftName);
			}
			$("#summerDay"+uuid).val(excuteDay);
			$("input[name='summerShiftMonth"+uuid+"_el']").val(scheduleDate);
			$("input[name='summerShiftMonth"+uuid+"']").val(that.getSelectAlias("month",scheduleDate));
	}else if(type==3){
	var isHandShift=res.isHandShift;
	$('input[name="isHandShift'+uuid+'"]').eq(isHandShift).trigger("click");
	var autoMonth=res.scheduleDate;
	var autoMonthDay=res.excuteDay;
	var turnShiftId=res.atsShiftId;
	if(isHandShift==0){
	$('input[name="autoMonth'+uuid+'_el"]').val(autoMonth);
	$('input[name="autoMonth'+uuid+'"]').val(that.getSelectAlias("month",autoMonth));
	$('input[name="autoMonthDay'+uuid+'"]').val(autoMonthDay);
	$('input[name="autoMonthDay'+uuid+'_el"]').val(autoMonthDay);
	
	}else if(isHandShift==1){
	$('input[name="AppointShift'+uuid+'"]').val(result.atsShiftName);
	$('#AppointShift'+uuid+'_el').val(turnShiftId);
	$('input[name="AppointMonth'+uuid+'_el"]').val(autoMonth);
	$('input[name="AppointMonth'+uuid+'"]').val(that.getSelectAlias("month",autoMonth));
	$('input[name="AppointDay'+uuid+'"]').val(autoMonthDay);
	$('input[name="AppointDay'+uuid+'_el"]').val(autoMonthDay);
	}
	}else if(type==4){
	var arrangeClass=res.arrangeClass;
	var arrangeManageClass=res.arrangeManageClass;
	var scheduleParamAnalysorClass=res.scheduleParamAnalysorClass;
	$('input[name="custom'+uuid+'"]').val(arrangeClass);
	$('input[name="custom1'+uuid+'"]').val(arrangeManageClass);
	$('input[name="custom2'+uuid+'"]').val(scheduleParamAnalysorClass);
	}
	},getSelectAlias:function(type,ts){
	if(type=="month"){
	if(ts=="1_month"){
	return '1';
	}else if(ts== "2_month"){
	return '2';
	}else if(ts=="3_month"){
	return '3';
	}
	}
	
	if(type=="smonth"){
	if(ts=="-2_month"){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_55;
	}else if(ts=="-1_month"){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_57;
	}else if(ts=="0_month"){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_13;
	}else if(ts=="1_month"){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_72;
	}else if(ts=="2_month"){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_70;
	}
	}
	
	if(type=="sweek"){
	if(ts=="-2_week"){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_56;
	}else if(ts=="-1_week"){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_58;
	}else if(ts=="0_week"){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_14;
	}else if(ts=="1_week"){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_73;
	}else if(ts=="2_week"){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_71;
	}
	}
	if(type=="week"){
	if(ts==1){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_83;
	}else if(ts==2){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_77;
	}else if(ts==3){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_79;
	}else if(ts==4){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_80;
	}else if(ts==5){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_82;
	}else if(ts==6){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_78;
	}else if(ts==7){
	return jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_81;
	}
	}
	return ts;
	},getFilterData : function(condition_item_id){
				var filterInfo = {};
			
				if($('#'+condition_item_id).find("input[id = 'prop_field']").val()==undefined
				   ||$('#'+condition_item_id).find("input[id = 'prop_field']").val()==null
				   ||$('#'+condition_item_id).find("input[id = 'prop_field']").val()==""){
					return ;   	
				   }
				filterInfo.name = $('#'+condition_item_id).find("input[id = 'prop_field']").attr('prop_field');
				filterInfo.label = $('#'+condition_item_id).find("input[id = 'prop_field']").attr('title');
				filterInfo.compareType = $('#'+condition_item_id).find("input[name = 'prop_op_el']").val();
				filterInfo.compareTypeLabel = $('#'+condition_item_id).find("input[name = 'prop_op']").val();
				if($('#'+condition_item_id).find("input[name = 'prop_value_el']").val()==undefined
				   ||$('#'+condition_item_id).find("input[name = 'prop_value_el']").val()==null
				   ||$('#'+condition_item_id).find("input[name = 'prop_value_el']").val()==""){
   				    filterInfo.value = $('#'+condition_item_id).find("input[name = 'prop_value']").val();
				   }else{
					filterInfo.value = $('#'+condition_item_id).find("input[name = 'prop_value_el']").val();
				   }
   				filterInfo.uipk = $('#'+condition_item_id).find("input[name = 'prop_value']").attr('uipk');
				filterInfo.valueLabel = $('#'+condition_item_id).find("input[name = 'prop_value']").val();
				filterInfo.type = $('#'+condition_item_id).find("input[id = 'prop_field']").attr('field_type');
				filterInfo.enumSource = $('#'+condition_item_id).find("input[id = 'prop_field']").attr('enumSource');
		return filterInfo;	
		}
	,setItemHtml:function(rule_items,ruleDetail_num){
		var that = this;
			var workAge_num = 0;
			var serviceAge_num = 0;
			var condition_num = 0;
		$('#condition_'+ruleDetail_num+' #condition_add').unbind('click').bind('click',function(){
			condition_num = condition_num + 1;
			that.addConditionHtml(ruleDetail_num,condition_num);
		});
		
		$('#delete_'+ruleDetail_num).unbind('click').bind('click',function(){
			$(this).closest("div[id^='rule_item']").remove();
		});
		
		$('#add_'+ruleDetail_num).unbind('click').bind('click',function(){
			_ruleDetail_num = _ruleDetail_num + 1;
			that.addItemHtml(_ruleDetail_num);
		});
		
		
		$('#rule_item_'+ruleDetail_num).find('input[name=conditionGroupId]').val(rule_items.id);
			for(var i=0;i<rule_items.ruleItems.length;i++){
				condition_num = condition_num + 1;
				that.addConditionHtml(ruleDetail_num,condition_num);
				that.setConditionHtml(rule_items.ruleItems[i],ruleDetail_num,condition_num);
			}
			
			var work_object_array=[],service_object_array=[];
	},setConditionHtml:function(ruleItems,ruleDetail_num,condition_num){
		var pre_prop_value = "prop_value_"+ruleDetail_num+'_'+condition_num;
		var filterInfo = eval('('+ruleItems.config+')');
		var pre_id = $('#condition_item_'+ruleDetail_num+'_'+condition_num); 
		$('#condition_item_'+ruleDetail_num+'_'+condition_num).find('input[name="conditionId"]').val(ruleItems.id);
		var prop_op_json = {id:"prop_op"};
		prop_op_json.data = [{value:"like",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_12},
		                    {value:"not like",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_16},
		                    {value:"=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_25},
		                    {value:"<>",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_17},
		                    {value:">",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_22},
		                    {value:"<",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_75}
		            		];
		
		var prop_op_date_json = {id:"prop_op"};
		prop_op_date_json.data = [{value:"=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_25},
		                    {value:"<>",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_17},
		                    {value:">",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_22},
		                    {value:"<",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_75},
		                    {value:">=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_23},
		                    {value:"<=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_76}
		            		];
		
		var prop_boolean_json = {id:"prop_op"};
		prop_boolean_json.data = [
		                    {value:"=",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_25},
		                    {value:"<>",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_17}
		            		];
            		
		var demo = {name: filterInfo.label,field: filterInfo.name,type:filterInfo.type,enumSource:filterInfo.enumSource};
		var type = filterInfo.type;
		var enumSource = filterInfo.enumSource;
		var uipk = filterInfo.uipk;
		var name = filterInfo.label;
			
			var prop_op_ctrl = pre_id.find("#prop_op");
			prop_op_ctrl.css("width","");
			var prop_value_ctrl =  pre_id.find("input[name='prop_value']");
			prop_op_ctrl.wrap("<div></div>");
		if(type == "Date" || type == "TimeStamp"){
			prop_op_ctrl.shrSelect(prop_op_date_json);
			prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
			
			var picker_json = {};
			picker_json.id = pre_prop_value;
			prop_value_ctrl.shrDateTimePicker($.extend(picker_json,{ctrlType: type,isAutoTimeZoneTrans:false}));
			prop_value_ctrl.css("width","90px");
		}
		if(type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int"){
			prop_op_ctrl.shrSelect(prop_op_date_json);
			prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
		}
		if(type == "StringEnum" || type == "IntEnum"){
			
			prop_op_ctrl.shrSelect(prop_boolean_json);
			prop_op_ctrl.shrSelect("setValue", filterInfo.compareType);
			
			var select_json = {};
			select_json.id = pre_prop_value;
			select_json.enumSource = enumSource;
			prop_value_ctrl.shrSelect(select_json);
			prop_value_ctrl.css("width","90px");
		}
		if(type == "Boolean"){
			prop_op_ctrl.shrSelect(prop_boolean_json);
			prop_op_ctrl.shrSelect("setValue", prop_boolean_json.data[0].value);
			
			var select_json = {id:pre_prop_value};
			select_json.data = [{value:"1",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_59},
			                    {value:"0",alias:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_28}
			            		];
			prop_value_ctrl.shrSelect(select_json);
			prop_value_ctrl.css("width","90px");
		}
		if(type == "String"){
			prop_op_ctrl.shrSelect(prop_op_json);
			prop_op_ctrl.shrSelect("setValue", prop_op_json.data[0].value);
			prop_value_ctrl.css("width","126px");
			prop_value_ctrl.attr("placeholder",jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_27);
		}
		if(uipk!=null && uipk!="null" && uipk!="undefined"){
			var f7Json = {id:pre_prop_value,name:"prop_value"};
			f7Json.subWidgetName = 'shrPromptGrid';
			f7Json.subWidgetOptions = {title:name,uipk:uipk,multiselect:true};
			prop_value_ctrl.shrPromptBox(f7Json);
			prop_value_ctrl.unbind("keydown.shrPromptGrid");
			prop_value_ctrl.unbind("keyup.shrPromptGrid");
			prop_value_ctrl.css("width","90px");
		}
		$(".select_field >div").addClass("search-emp-field");
		
			pre_id.find("#prop_field").attr('enumSource',enumSource);
			pre_id.find("#prop_field").val(filterInfo.label);
			pre_id.find("#prop_field").attr('prop_field',filterInfo.name);
			pre_id.find("#prop_field").attr('title',filterInfo.label);
			pre_id.find("#prop_field").addClass("input-height");
		    pre_id.find("#prop_field").attr('field_type',filterInfo.type);
			pre_id.find("input[name='prop_op_el']").val(filterInfo.compareType);
			pre_id.find("input[name='prop_op']").val(filterInfo.compareTypeLabel);
			pre_id.find("input[name='prop_value_el']").val(filterInfo.value);
			pre_id.find("input[name='prop_value']").val(filterInfo.valueLabel);
			pre_id.find("input[name='prop_value']").attr('uipk',filterInfo.uipk);
		
		
	},
	setConditionRuleHtml:function(rule_items,ruleDetail_num){
		var that = this;
		var condition_num = 0;
			
		var head_condition_label='<div id="condition_'+ruleDetail_num+'"><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><input type="hidden" name="conditionGroupId"  /><span class="">'
				+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_87
				+ ' </span></div>'
				+ '<div class="span2"><i id="condition_add" class="icon-plus" style="padding:10px" ></i></div>'
				+ '</div></div>';	
					
		var html = 	head_condition_label ;
		
		var rule_item_label = '<div id = "rule_item_'+ruleDetail_num+'" class = "item_css"></div>';
		$('#conditionDetail').append(rule_item_label);
		$('#rule_item_'+ruleDetail_num).append(html);
		
		
		$('#condition_'+ruleDetail_num+' #condition_add').unbind('click').bind('click',function(){
			condition_num = condition_num + 1;
			that.addConditionHtml(ruleDetail_num,condition_num);
		});
		
		
		
		$('#rule_item_'+ruleDetail_num).find('input[name=conditionGroupId]').val(rule_items.id);
			for(var i=0;i<rule_items.ruleItems.length;i++){
				condition_num = condition_num + 1;
				that.addConditionHtml(ruleDetail_num,condition_num);
				that.setConditionHtml(rule_items.ruleItems[i],ruleDetail_num,condition_num);
			}	
	} ,showItemHtml:function(rule_items,ruleDetail_num){
		var that = this;
		var work_object_array=[],service_object_array=[];
	
		for(var i = 0 ; i<rule_items.ruleItems.length;i++){

		that.showConditionHtml(rule_items.ruleItems[i],ruleDetail_num);
		}			
	}
	,showConditionHtml:function(ruleItems,ruleDetail_num){
		var that = this;
		var filterInfo = eval('('+ruleItems.config+')');
		var	con_tpl =  
			 	'<div id="condition_coll" name = "condition_coll">' +
					'<div name ="condition_item" class="row-fluid row-block row_field" style="width: 115%">'
				+ '<div class="span1"><span class="cell-RlStdType"></span></div>'
				+ '<div class="span2 field-ctrl">' 
				+ filterInfo.label
				+'</div>'
				+ '<div class="span2">'+filterInfo.compareTypeLabel+' </div>'
				+ '<div class="span2 field-ctrl">'+filterInfo.valueLabel+'</div>'
				+ '</div></div>';
		$("#serviceAge_"+ruleDetail_num).append(con_tpl);	
	},checkConfig:function(){
	var uuid=this.uuid;
	var adminOrgUnit=$("#adminOrgUni"+uuid+"_el").val();
	var attenceGrou=$("#attenceGrou"+uuid+"_el").val();
	var perso=$("#perso"+uuid+"_el").val();
//	if(!adminOrgUnit && !attenceGrou && !perso){
//	shr.showWarning({message : "所属行政组织、考勤组、姓名不能同时为空!"});
//	return false;
//	}
	var type=$('input[name="isHanduuid'+uuid+'"]:checked').val();
	if(!type){
	shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_50});
	return false;
	}
	if(type ==0){
		var yz=true;
		if(!$("#turnShift"+uuid).val()){
		$("#turnShift"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+ '</label>');
		yz= false;
		}
		if(!$("#turnTime"+uuid).val()){
		$("#turnTime"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+ '</label>');
		yz= false;
		}
		if(!$("#turnShiftXh"+uuid).val()){
		$("#turnShiftXh"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+ '</label>');
		yz= false;
		}
		if(!$("#shiftDay"+uuid).val()){
		$("#shiftDay"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+ '</label>');
		yz= false;
		}
		if(!$("input[name=shiftMonth"+uuid+"]").val()){
		$("input[name=shiftMonth"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+ '</label>');
		yz= false;
		}
		var turnShiftXh=$("#turnShiftXh"+uuid).val();
		if (!(/(^[1-9]\d*$)/.test(turnShiftXh))) { 
	　　　　　　shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_39});
	　　　　　　	return false; 
　　　　	}
		if(!yz){
		return false;
		}
	}
	if(type ==2){
		var yz=true;
		var startTimeArr = [];
   		 var endTimeArr = [];
		$("input[name=summerMonth]").each(function(index,ele){	
		var resultVal=$(ele).val();
		dateFormat =/^(\d{4})-(\d{2})-(\d{2})$/;
		resultVal='2019-'+resultVal;
//		if(dateFormat.test(resultVal)){
//  			$(ele)[0].style.border="1px solid Silver"
// 		}else{
// 			$(ele)[0].style.border="1px solid red"
//   　　			shr.showWarning({message : "输入格式错误，请输入类似03-01格式",hideAfter: 20});
//	　　　　　　yz=false;
// 		}
 		 var r=resultVal.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); 
          if(r==null){
          	$(ele)[0].style.border="1px solid red"
             shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_64,hideAfter: 20});
             yz=false;
          }else{
            var d=new Date(r[1],r[3]-1,r[4]);   
          var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
          if(num==0){
          	$(ele)[0].style.border="1px solid red"
          	shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_64,hideAfter: 20});
            yz=false;
          }else{
          $(ele)[0].style.border="1px solid Silver"
           startTimeArr.push(resultVal);
          }
          }
        
		});
		$("input[name=summerToMonth]").each(function(index,ele){	
		var resultVal=$(ele).val();
		dateFormat =/^(\d{4})-(\d{2})-(\d{2})$/;
		resultVal='2019-'+resultVal;
//		if(dateFormat.test(resultVal)){
//  			$(ele)[0].style.border="1px solid Silver"
// 		}else{
// 			$(ele)[0].style.border="1px solid red";
//   　　			shr.showWarning({message : "输入格式错误，请输入类似03-01格式",hideAfter: 20});
//	　　　　　　yz=false;
// 		}
		 var r=resultVal.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); 
          if(r==null){
          	$(ele)[0].style.border="1px solid red"
             shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_64,hideAfter: 20});
             yz=false;
          }else{
            var d=new Date(r[1],r[3]-1,r[4]);   
          var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
          if(num==0){
          	$(ele)[0].style.border="1px solid red"
          	shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_64,hideAfter: 20});
            yz=false;
          }else{
          $(ele)[0].style.border="1px solid Silver";
          endTimeArr.push(resultVal);
          }
          }
		});
		$("input[name=summerMonth]").each(function(index,ele){
			var start=$(ele).val();
			start='2019-'+start;
			var end=$($("input[name=summerToMonth]")[index]).val();
			end='2019-'+end;
			 var oDate1 = new Date(start);
		    var oDate2 = new Date(end);
		    if(oDate1.getTime() > oDate2.getTime()){
		        	shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_34,hideAfter: 20});
		        	yz=false;
		        	 return false;
		    }
		});
		var begin = startTimeArr.sort();
    	var over = endTimeArr.sort();
    	for(var k=1;k<begin.length;k++){
        if (begin[k] <= over[k-1]){
            	shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_5,hideAfter: 20});
             yz=false;
            return false;
        }
    }
		if(!yz){
		return false;
		}
		
	}
	if(type ==1){
		var yz=true;
		var isHandCopy=$('input[name="isHandCopy'+uuid+'"]:checked').val();
		if(!isHandCopy){
			shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_48});
			return false;
		}
		if(isHandCopy==0){
		if(!$("input[name=shiftWeek"+uuid+"]").val()){
		$("input[name=shiftWeek"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+ '</label>');
		yz= false;
		}
		if(!$("input[name=nextWeek"+uuid+"]").val()){
		$("input[name=nextWeek"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!$("input[name=weekDay"+uuid+"]").val()){
		$("input[name=weekDay"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!yz){
		return false;
		}
		}
		if(isHandCopy==1){
		if(!$("input[name=shiftMonths"+uuid+"]").val()){
		$("input[name=shiftMonths"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!$("input[name=nextMonth"+uuid+"]").val()){
		$("input[name=nextMonth"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!$("input[name=monthDay"+uuid+"]").val()){
		$("input[name=monthDay"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!yz){
		return false;
		}
		}
		
	}
	if(type ==3){
		var yz=true;
		var isHandShift=$('input[name="isHandShift'+uuid+'"]:checked').val();
		if(!isHandShift){
			shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_49});
			return false;
		}
		if(isHandShift ==0){
		if(!$("input[name=autoMonth"+uuid+"]").val()){
		$("input[name=autoMonth"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!$("input[name=autoMonthDay"+uuid+"]").val()){
		$("input[name=autoMonthDay"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!yz){
		return false;
		}
		}
		if(isHandShift ==1){
		if(!$("input[name=AppointShift"+uuid+"]").val()){
		$("input[name=AppointShift"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!$("input[name=AppointMonth"+uuid+"]").val()){
		$("input[name=AppointMonth"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!$("input[name=AppointDay"+uuid+"]").val()){
		$("input[name=AppointDay"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!yz){
		return false;
		}
		}
	}
	if(type ==4){
		var yz=true;
		if(!$("input[name=custom"+uuid+"]").val()){
		$("input[name=custom"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!$("input[name=custom1"+uuid+"]").val()){
		$("input[name=custom1"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!$("input[name=custom2"+uuid+"]").val()){
		$("input[name=custom2"+uuid+"]").after('<label for="number" generated="true" class="error" style="display: block;position:absolute">'
			+jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_15
			+'</label>');
		yz= false;
		}
		if(!yz){
		return false;
		}
	}
	
	if(type==0){
	var turnId=$("#turnShift"+uuid+"_el").val();
	if(turnId){
	var maxValue;
	$.ajax({
						url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsTurnShiftEditHandler&method=getItemsJson",
						data: {id:turnId},
						dataType:'json',
						async:false, 
					    type: "POST",
					
						success: function(rst){
							maxValue=rst.rows[rst.rows.length - 1].segment;
						}
						});
						var segment=$("#turnShiftXh"+uuid).val();
						if(segment>maxValue){
							shr.showWarning({message : jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_86});
							return false;
						}
	}
	}
	return true;
	}
	,	
	setButtonVisible:function(){
		shr.ats.atsSchedulePlanSet.superClass.setButtonVisible.call(this);
		var $workarea = this.getWorkarea();  
		$workarea.unbind('mouseenter').unbind('mouseleave')
		var workAreaDiv=$("#workAreaDiv")
		workAreaDiv.find('.entry-button-top').addClass("hover")
		console.log(this.getOperateState(),$workarea);

		if(this.getOperateState() != "VIEW"){
			$workarea.find('.entry-button-top').removeClass("hover")
			$workarea.find('.entry-button-top').show();
		}else{
			workAreaDiv.unbind('mouseenter').unbind('mouseleave').hover(
				function() {
					workAreaDiv.find('.hover').show();
				},
				function() {
					workAreaDiv.find('.hover').hide();
				}
			);
		}
	},
	verify: function(event, action) {
		var that = this;
		if(!that.checkConfig()){
		return false;
		}
		return true;
	},
	getViewHtml:function(res,result){
		var that=this;
		var uuid=that.uuid;
		var type=res.type;
		var turnTime=res.calStartDate;
		var turnShiftXh=res.startSegmnet;
		var shiftDay=res.excuteDay;
		var shiftMonth_el=res.scheduleDate;
		var turnShiftId=res.turnShiftId;
		var turnShiftName=result.atsTurnShiftName;
		var receiveStr = '<h5 class="groupTitle">'
			+ jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_93
			+ '</h5>';
		if(type==0){
			turnTime = atsMlUtile.dateToUserFormat(turnTime);
			receiveStr = shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_38,
				[turnTime,turnShiftName,turnShiftXh,that.getSelectAlias("month",shiftMonth_el),shiftDay]);
		}else if(type==1){
			var scheduleDate=res.scheduleDate;
			var copySourceDate=res.copySourceDate;
			var isHandCopy=res.isHandCopy;
			var excuteDay=res.excuteDay;
			if(isHandCopy==0){
				receiveStr = shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_33,
					[that.getSelectAlias("sweek",copySourceDate),that.getSelectAlias("sweek",scheduleDate),that.getSelectAlias("week",excuteDay)]);
			}else if(isHandCopy==1){
				receiveStr = shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_32,
					[that.getSelectAlias("smonth",copySourceDate),that.getSelectAlias("smonth",scheduleDate),excuteDay]);
			}else if(isHandCopy==2){
				receiveStr = shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_31);
			}
		}else if(type==2){
			receiveStr =jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_4;
			for(var i=0;i<res.conditionItem.length;i++){
				var atsShiftId=res.conditionItem[i].atsShiftId;
				var beginDate=res.conditionItem[i].beginDate;
				var endDate=res.conditionItem[i].endDate;
				var excuteDay=res.conditionItem[i].excuteDay;
				var scheduleDate=res.conditionItem[i].scheduleDate;
				var shiftName=res.conditionItem[i].shiftName;
				receiveStr = receiveStr + shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_20, [beginDate,endDate,shiftName]);
			}

			receiveStr = receiveStr+shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_98
				,[parseInt(res.conditionItem[0].scheduleDate),res.conditionItem[0].excuteDay]);
		}else if(type==3){
			var isHandShift=res.isHandShift;
			var autoMonth=res.scheduleDate;
			var autoMonthDay=res.excuteDay;
			var turnShiftId=res.atsShiftId;
			if(isHandShift==0){
				receiveStr = shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_91,
					[that.getSelectAlias("month",autoMonth),autoMonthDay]);
			}else if(isHandShift==1){
				receiveStr = shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_92
					,[result.atsShiftName,that.getSelectAlias("month",autoMonth),autoMonthDay]);
			}
		}else if(type==4){
			var arrangeClass=res.arrangeClass;
			var arrangeManageClass=res.arrangeManageClass;
			var scheduleParamAnalysorClass=res.scheduleParamAnalysorClass;
			receiveStr = shr.formatMsg(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_96
				,[arrangeClass,arrangeManageClass,scheduleParamAnalysorClass]);
		}

		return receiveStr;
	},inspectAction:function(){
			var clz = this;
			var billId=clz.billId;
			clz.remoteCall({
			type:"post",
			method:"newAutoScheduleInstance",
			
			param:{billId:billId},
			async: false,
			success:function(res){
				var info =  res;
				if (info.result){
					shr.showWarning({message:info.result,hideAfter: 50});
					
				}
				
			}
		});
	
	},


	
	validate: function() {
		var workArea = this.getWorkarea(),
			$form = $('form', workArea);
		var uuid=this.uuid;
		// return $form.valid();
		
		
		flag = this.checkAttachment();
		if (!flag) {
			shr.showWarning({
				message: jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_29,
				hideAfter: 5
			});
		}
		var adminOrg=$("#adminOrgUni"+uuid).val();
		var attenceGrou=$("#attenceGrou"+uuid).val();
		var perso=$("#perso"+uuid).val();
//		if(adminOrg=="" && attenceGrou=="" && perso==""){
//			flag=false;
//			shr.showWarning({
//				message: jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_84,
//				hideAfter: 5
//			});
//			return flag;
//		}
		return flag;
	},
	
	/**
	 * 描述:删除操作
	 * @action 
	 */
	deleteAction:function(){
		if (typeof this.billId === 'undefined' || this.billId == '') {
			this.removeWorkarea();
			return;
		}
		
		var _self = this;
		shr.showConfirm(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_41, function(){
			var data = {
				method: 'delete',
				billId: _self.billId
			};
			var relatedFieldId = _self.getRelatedFieldId();
			if (relatedFieldId) {
				data.relatedFieldId = relatedFieldId;
			}
			data = $.extend(_self.prepareParam(), data);
			
			shr.doAction({
				url: _self.dynamicPage_url,
				type: 'post', 
				data: data,
				success : function(response) {					
					_self.afterRemoveAction();
					 	if($(".view_mainPage.row-fluid").length == 3){
				   	 	$("[name=delete]").hide();
				   	}else{
				   		 $("[name=delete]").show();
				   	}
				}
			});	
		});
	},getAdminOrgUnit:function(){
			var clz = this;
			var billId=$('#adminOrgUnit').val();
			clz.remoteCall({
			type:"post",
			method:"getAdminOrgUnit",
			
			param:{billId:billId},
			async: false,
			success:function(res){
				var info =  res;
				remberAdminOrgUnit=res.result;
				
			}
		});
	
	},
	
	/**
	 * 新增
	 */
	addNewAction: function() {		
		var params = this.prepareParam();
		
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			params.relatedFieldId = relatedFieldId;
		}
		params.method = 'addNew';
		
		// 片断
		var _self = this;
		beforeId=_self.billId;
		shr.doGet({
			url: _self.dynamicPage_url,
			data: params,
			success: function(response) {
				var next;
				if (_self.isEmpty()) {
					$('.shr-multiRow').append(response);
				} else {
					var $workarea = _self.getWorkarea();
					$workarea.after(response);
					next = $workarea.next();
					while(next.length > 0) {
						if (next.hasClass('view_mainPage')) {
							break;
						}
						next = next.next();
					}
				}
				
				_self.afterMultiRowRender();
				_self.adjustIframeHeight();
				
				if (next) {
					shr.locateTo(next);
				}
				// 新增默认展开第一个tab
				setTimeout(function() {
					if(!next){
						$("#SmartRulesNav li").eq(0).triggerHandler("click");
					}else{
						$(next).find("#SmartRulesNav li").eq(0).triggerHandler("click");
					}
				}, 100);
			}
		});
	},initCurrentHrOrgUnit: function(hrOrgUnitId) {
		var that = this;
		$("#perso"+that.uuid).shrPromptBox().attr("data-params",hrOrgUnitId);
	
	},
	enableAction : function() {
		var clz = this;
		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsSchedulePlanListHandler';
		var bills=this.getRelatedFieldId();
		shr.showConfirm(jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_40, function(){
			clz.remoteCall({
				type:"post",
				method:"enables",
				url:url,
				param:{billId: bills},
				async: false,
				success:function(res){
				shr.showInfo({message:jsBizMultLan.atsManager_atsSchedulePlanSet_i18n_19,hideAfter: 3});
				$("#enable").hide();
			}
			});
		});			
	}
});

