//变动规则基类js
var remberAdminOrgUnit;
var beforeId;
shr.defineClass("shr.ats.atsScheduleIntelMultSet", shr.framework.MultiRow, {
	initalizeDOM : function () {
		shr.ats.atsScheduleIntelMultSet.superClass.initalizeDOM.call(this);
		var _self = this;
		if(!remberAdminOrgUnit){
		_self.getAdminOrgUnit();
		}
		_self.initMultDom();
		var uuid=this.uuid;
	
		if($("#hideInformation").val()!="0"){
			$("#turnShiftEntryInfo").append('<div class="turnShiftEntryInfoView"></div>')
			$("#turnShiftEntryInfo").append('<div class="turnShiftEntryInfoEdit"></div>')
			_self.getAtsScheduleIntelSetHtml();
			_self.initPCRuleMultDom();	
			if(_self.getOperateState() =="VIEW"){
				$("#turnShiftEntryInfo .turnShiftEntryInfoView").show()
				$("#turnShiftEntryInfo .turnShiftEntryInfoEdit").hide()
			}else{
				$("#turnShiftEntryInfo .turnShiftEntryInfoEdit").show()	 
				$("#turnShiftEntryInfo .turnShiftEntryInfoView").hide()	 
			}
			_self.initInformation();
			_self.initPCRuleMultControlBtn()
			// 判断多行表是否有内容，以决定是否显示常用参数控制和其他规则说明
			if(this.isEmpty()){
				$(".shr-multiRow").nextAll().hide()
			}else{
				var temp = $(".shr-multiRow").nextAll();
				for (var i = 0; i < temp.length; i++) {
					if(temp[i].tagName !='SCRIPT'){
						$(temp[i]).show();
					}
				}
			}
			
		}
		//隐藏第一条记录的删除按钮
		if($(".view_mainPage.row-fluid").length==2){
		   var uuid = $(".view_mainPage.row-fluid")[1].id;
		   $("#delete"+uuid).hide();
		}
		// 解决“常用参数控制”和“其他规则说明”开始时无法下拉的问题
		var $toggles = $("div.groupToggle");
		$toggles.each(function (i, element) {
			var $toggle = $(element);
			var isToggleExpand = $toggle.attr('data-value');
			var contentConfig = {
				$toggleContent: $toggle.siblings('div'), iconUpName: '', iconDownName: '', iconUpImgUrl: '/shr/styles/images/icon_angle_down.png',
				iconDownImgUrl: '/shr/styles/images/icon_angle_right.png', isOnlyImg: true, isToggleExpand: isToggleExpand
			};
			$toggle.shrShowToggle(contentConfig);
			//title也可点击
			$toggle.siblings('h5.groupTitle').off("click").click(function (event) {
				$("span#slideToggle", $toggle).click();
			});
		});
		$("input[name=isHandCopy]").off('click').on("click",function(){
			if($("input[name=isHandCopy]").is(":checked")){
			$("input[name=atsShiftSegment1]").shrSelect("enable")
			$("input[name=atsShiftSegment2]").shrSelect("enable")
			$("input[name=atsShiftSegment3]").shrSelect("enable")
			$("input[name=atsShiftSegment4]").shrSelect("enable")
			$("input[name=atsShiftSegment5]").shrSelect("enable")
			$("input[name=atsShiftSegment6]").shrSelect("enable")
			$("input[name=atsShiftSegment7]").shrSelect("enable")
			$("input[name=atsShiftSegment8]").shrSelect("enable")
			$("input[name=atsShiftSegment9]").shrSelect("enable")
			
			}else{
			try{
			$("input[name=atsShiftSegment1]").shrSelect("disable")
			}
		    catch (e) {
		    }
			try{
			$("input[name=atsShiftSegment2]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment3]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment4]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment5]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment6]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment7]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment8]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment9]").shrSelect("disable")
			}
		    catch (e) {
		    }
			
			}
			
		})
		_self.initPersonFy();
		_self.initEditHtml();
		if($("#breadcrumb").children().length ==4){
		var list=document.getElementById("breadcrumb");
		list.removeChild(list.childNodes[1]);
		}
		if($("#breadcrumb").children().length ==2){
		$("#breadcrumb").find(".homepage").after('<li><a href="/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsScheduleIntelSet.list&serviceId='+shr.getUrlParam("serviceId")+'&inFrame=true">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_14 
				+ '</a> <span class="divider">/</span></li>');
		}
		if($("#breadcrumb").children().length ==3){
			if($($("#breadcrumb").find("a")[1]).html()==$("#breadcrumb").find(".active").html()){
			var list=document.getElementById("breadcrumb");
			list.removeChild(list.childNodes[2]);
			$("#breadcrumb").find(".homepage").after('<li><a href="/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsScheduleIntelSet.list&serviceId='+shr.getUrlParam("serviceId")+'&inFrame=true">' 
					+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_14 
					+ '</a> <span class="divider">/</span></li>');
			}
		}
		var stateIs=$("#state").val();
		if(stateIs=="1"){
		$("#enable").hide();
		}
	},initPersonFy:function(){
		$("#base #personFy").each(function(index,ele){
			(ele).remove();	
		})
		$("#base h5").each(function(index,ele){
		$(ele).append('<span id="personFy"><span style="font-size: 12px;font-weight: 500;"  class="more">?<span class="tips">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_91 
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
		
	},
	afterMultiRowRender:function(){
		if (this.isEmpty()) {
			$('.shr-multiRow .shr-multiRow-empty').show();
		} else {
			$('.shr-multiRow .shr-multiRow-empty').hide();
		}
		// 判断多行表是否有内容，以决定是否显示常用参数控制和其他规则说明
		if(this.isEmpty()){
			$(".shr-multiRow").nextAll().hide()
		}else{
			var temp = $(".shr-multiRow").nextAll();
			for (var i = 0; i < temp.length; i++) {
				if(temp[i].tagName !='SCRIPT'){
					$(temp[i]).show();
				}
			}
		}
	}
	,initMultDom:function(){
		var _self = this;
		var uuid=_self.uuid;
		if(""==uuid){
		return;
		}
		 var htmls = '<ul id="SmartRulesNav">'
			+'<li style="float:left;width:170px;list-style:none;" data-index=0><input style="float:left;" id="isHanduuid'+uuid+'" name="isHanduuid'+uuid+'" value="2_1" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><div  title="">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_75
			+ '<span class="more">?<span class="tips">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_20
			+ '</span></span></div></li>'
			+'<li style="float:left;width:150px;list-style:none;" data-index=1><input style="float:left;" id="isHanduuid'+uuid+'" value="0" name="isHanduuid'+uuid+'" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><div  title="">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_37
			+ '<span class="more">?<span class="tips">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_21
			+ '</span></span></div></li>'
			+'<li style="float:left;width:190px;list-style:none;" data-index=2><input style="float:left;" id="isHanduuid'+uuid+'" name="isHanduuid'+uuid+'" value="3_1" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><div title="">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_49
			+ '<span class="more">?<span class="tips">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_19
			+ '</span></span></div></li>'
			+'<li style="float:left;width:150px;list-style:none;" data-index=3><input style="float:left;" id="isHanduuid'+uuid+'" name="isHanduuid'+uuid+'" value="3" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><div title="">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_64
			+ '</div></li>'
			+'<li style="float:left;width:150px;list-style:none; " data-index=4><input style="float:left;" id="isHanduuid'+uuid+'" name="isHanduuid'+uuid+'" value="5_1" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title=""><div><div title="'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_101
			+ '">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_101
			+ '</div></div></li>'
			+'</ul>'
			+'<div id="SmartRulesContent">'
        	+ '<div class="row-fluid row-block content" id="turnShiftClick'+uuid+'">'
            + '<span  title="' 
            + jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60 
            + '">' 
            + shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_12, [
            	'</span>'
				+ '<div><input id="turnTime'+uuid+'" name="turnTime'+uuid+'" class="block-father input-height" type="text"  validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
				+ '"></div>'
				+ '<span  title="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_40
				+ '">'
			 ])
            + '</span>'            
            + '</div>'
        	+ '<div class="row-fluid row-block content" id="isHandCopyShowOrHide'+uuid+'" >'
            + '<div class="col-lg-24 field-desc" ><input style="float:left;"  id="isHandCopy'+uuid+'" name="isHandCopy'+uuid+'" value="1_1"  type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<span  title="">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_78,[
				'</span>'
				+ '<div><input id="shiftWeek'+uuid+'" name="shiftWeek'+uuid+'" class="block-father input-height" type="text" validate=""  ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
				+ '"></div>'
				+ '<span  title="">'
			 ])
			+ '</span>'
			+ '</div><br/><br/>'
        
        
        	+ '<div class="col-lg-24 field-desc"><input style="float:left;"  id="isHandCopy'+uuid+'" name="isHandCopy'+uuid+'" value="1_2"  type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
            + '<span  title="">' 
            + jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_71 
            + '</span>'
			+ '</div><br/>'
			+ ''
			+ '</div>'

			+ '<div class="row-fluid row-block content" id="isHandSummerShowOrHide'+uuid+'">'
			+ '<div class="col-lg-24 field-desc" >'
			+ '<span title="">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_96,[
				'</span>'
				+ '<div><input id="atsShift'+uuid+'" name="atsShift'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69
				+ '"></div>'
				+ '<span  title="">'
				,
				'</span>'
				+ '<div><input id="summerToMonth'+uuid+'"  name="summerToMonth" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
				+ '"></div>'
				+ '<span  title="">'
			])
			+ '</span>'
			+ '</div><br/>'
			+ '</div>'

			+ '<div class="row-fluid row-block content" id="isHandAutoShowOrHide'+uuid+'">'
			+ '<div class="col-lg-24 field-desc" ><input style="float:left;"  id="isHandShift'+uuid+'" name="isHandShift'+uuid+'" value="4_1"  type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<span title="">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_94,[
				'</span>'
				+ '<div><input id="autoMonth'+uuid+'"  name="autoMonth'+uuid+'" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
				+ '"></div>'
				+ '<span  title="">'
				,
				'</span>'
				+ '<div><input id="autoMonthDay'+uuid+'" name="autoMonthDay'+uuid+'"  class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
				+ '"></div>'
				+ '<span  title="">'
			])
			+ '</span>'
			+ '</div><br/><br/>'


			+ '<div class="col-lg-24 field-desc"><input style="float:left;"  id="isHandShift'+uuid+'" name="isHandShift'+uuid+'" value="4_2"  type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<span  title="">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_93,[
				'</span>'
				+ '<div><input id="AppointShift'+uuid+'" name="AppointShift'+uuid+'"  class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
				+ '"></div>'
				+ '<span  title="">'
				,
				'</span>'
				+ '<div><input id="AppointMonth'+uuid+'" name="AppointMonth'+uuid+'"  class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
				+ '"></div>'
				+ '<span  title="">'
			])
			+ '</span>'
			+ '</div><br/><br/>'
			 + '<div class="col-lg-24 field-desc"><input style="float:left;"  id="isHandShift'+uuid+'" name="isHandShift'+uuid+'" value="4_3"  type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<span  title="">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_92,[
				'</span>'
				+ '<div><input id="AppointShiftDepart'+uuid+'" name="AppointShiftDepart'+uuid+'"  class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
				+ '"></div>'
				+ '<span  title="">'
				,
				'</span>'
				+ '<div><input id="AppointMonthDepart'+uuid+'" name="AppointMonthDepart'+uuid+'"  class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
				+ '"></div>'
				+ '<span  title="">'
			])
			+ '</span>'
			+ '</div><br/>'
			+ '</div>'
			+'<div class="row-fluid row-block content" id="zdyShow" style="display:none;"><div class="col-lg-24 field-ctrl"><span style="margin-left:50px">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_97
			+ '</span><input id="custom'+uuid+'" name="custom'+uuid+'" class="block-father input-height"  type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
			+ '"><span class="more">?<span class="tips">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_51, ["MatchAnalysorManager","getUserDefinedTargetShift","doMatch"])
			+ '</span></span></div></div>'
			+'</div>';
//		$("#form"+uuid).find('#html').append(htmls);
		if(_self.getOperateState() =="VIEW"){
		
		}else{
			$("#form"+uuid).find('#html').append(htmls);
					 
		}
		
		_self.blindShowDom();
		_self.getF7();
		//赋值
		_self.defaultHtml(uuid);
		var serviceAge_nums=0;
		$('#serviceAge_add').bind('click',function(){
		serviceAge_nums = serviceAge_nums + 1;
		_self.addConditionHtml(uuid,serviceAge_nums);
		});
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
		var getConfig=eval("("+res.atsPCRuleInfo["config"]+")");
		_self.setConfigs(getConfig,res);
		for(var i = 0;i<ItemsJson.rows.length;i++){
		_self.setItemHtml(ItemsJson.rows[i],uuid);
			}
		
		}
		if(_self.getOperateState() != 'VIEW' && uuid !=''){
		$('#adminOrgUni'+uuid).shrPromptBox("setFilter","longNumber like '" + remberAdminOrgUnit+"!%' or longNumber = '" + remberAdminOrgUnit+"'");	
		}
		if(_self.getOperateState() == 'VIEW' && uuid !=''){
				var ItemsJson = _self.getItemsJosn();
//				var ItemsJson = _self.getItemsJosn();
				if(ItemsJson){
				var viewRes=ItemsJson.result;
				var getConfig=eval("("+viewRes.atsPCRuleInfo["config"]+")");
				var viewHtml=_self.getViewHtml(getConfig,viewRes);
				var htmlZngz = ''
				viewHtml="<div class='marginLeft'>"+viewHtml+"</div>"
				$("#"+uuid).find('#html').append(htmlZngz);
				$("#"+uuid).find('#html').append(viewHtml);
				}
				if(ItemsJson){
				res=ItemsJson.result;
				
				 $("#adminOrgUni"+uuid+"").html(res.atsPCRuleInfo["adminOrgUnitString.name"]);
				//  var personName=res.atsPCRuleInfo["personString.name"]
				//  console.log(personName);
				 
				// $("#perso"+uuid+"").html(personName);

				// 员工范围设置-名字只显示一行
				$("#perso"+uuid+"").html(res.atsPCRuleInfo["personString.name"]);
				$("#perso"+uuid+"").addClass("personName")
				$("#perso"+uuid+"").parent().addClass("personNameBox")
				$("#perso"+uuid+"").parent().parent().css({"overflow":"visible"})
				$("#perso"+uuid+"").after("<span class='fullPersonName'>"+res.atsPCRuleInfo["personString.name"]+"</span>")	
				// 判断员工范围的姓名字段是否大于一行
				if(res.atsPCRuleInfo["personString.name"].length<=20){
					$(".fullPersonName").addClass("oneRow")
				}

				$("#attenceGrou"+uuid+"").html(res.atsPCRuleInfo["AttenceGroup.name"]);
				var getConfig=eval("("+res.atsPCRuleInfo["config"]+")");
				_self.setConfigs(getConfig,res);
				for(var i = 0;i<ItemsJson.rows.length;i++){
				_self.showItemHtml(ItemsJson.rows[i],uuid);
				}
				}
			}

			// 样式调整
			$("#otherHtml .col-lg-2.field-desc").remove()
			$("#otherHtml .col-lg-4").removeClass("col-lg-4").addClass("col-lg-3")

			// 此处在8.6sp1中已无用
			// 员工范围设置与上部组织信息对齐
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_80 
			// 		+ '"]').parent().removeClass("col-lg-3").addClass("col-lg-4")
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_80 
			// 		+ '"]').parent().next().next().remove()
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_80 
			// 		+ '"]').parent().css({marginLeft:"-2.564%"})
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_17 
			// 		+ '"]').parent().next().removeClass("col-lg-4").addClass("col-lg-1")
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_17 
			// 		+ '"]').parent().next().next().remove()
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_57 
			// 		+ '"]').parent().removeClass("col-lg-3").addClass("col-lg-4")
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_84 
			// 		+ '"]').parent().removeClass("col-lg-3").addClass("col-lg-4")
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_84 
			// 		+ '"]').parent().next().next().remove()
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_84 
			// 		+ '"]').parent().css({marginLeft:"-2.564%"})
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_16 
			// 		+ '"]').parent().next().removeClass("col-lg-4").addClass("col-lg-1")
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_16 
			// 		+ '"]').parent().next().next().remove()
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_63 
			// 		+ '"]').parent().removeClass("col-lg-3").addClass("col-lg-4")
			// $('div[title="' 
			// 		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_63 
			// 		+ '"]').parent().css({marginLeft:"-2.564%"})

		if(_self.getOperateState() =="ADDNEW"){
			$("#form"+uuid).find('#html').find("#SmartRulesNav li").eq(0).triggerHandler("click")
		}
		if(_self.getOperateState() !="VIEW" && uuid !=''){
		_self.initCurrentHrOrgUnit(uuid);
		}
	}
	,setConfigs:function(res,result){
	var that=this;
	var uuid=that.uuid;
	var intelType=result.atsPCRuleInfo["intelType"];
	var type=intelType;
	var preTime=result.atsPCRuleInfo["preTime"];
	var withinDate=result.atsPCRuleInfo["withinDate"];
	var atsShifts=result.atsPCRuleInfo["atsShifts"];
	var atsShiftName=result.atsPCRuleInfo["atsShiftName"];
	var machAnalyzeClass=result.atsPCRuleInfo["machAnalyzeClass"];
	
	if(intelType=="1_1" || intelType=="1_2"){
		type=0;
		$('input[name="isHanduuid'+uuid+'"][value="'+type+'"]').trigger("click")
		$('input[name="isHandCopy'+uuid+'"][value="'+intelType+'"]').prop("checked", "checked");
		if(intelType=="1_1"){
		$('input[name="shiftWeek'+uuid+'"]').val(preTime);
		}
//		$("input[name=isHanduuid"+uuid+"]").eq(1).trigger("click");
	}else if(intelType=="4_1" || intelType=="4_2" || intelType=="4_3"){
		type=3;
		$('input[name="isHanduuid'+uuid+'"][value="'+type+'"]').trigger("click")
		$('input[name="isHandShift'+uuid+'"][value="'+intelType+'"]').prop("checked", "checked");
		if(intelType=="4_1"){
		$("input[name=isHandShift"+uuid+"]").eq(0).trigger("click");
		$('#autoMonth'+uuid).val(withinDate);
		$('#autoMonthDay'+uuid).val(preTime);
		}else if(intelType=="4_2"){
		$("input[name=isHandShift"+uuid+"]").eq(1).trigger("click");
		$('#AppointShift'+uuid).val(withinDate);
		$('#AppointMonth'+uuid).val(preTime);
		
		}else if(intelType=="4_3"){
		$("input[name=isHandShift"+uuid+"]").eq(2).trigger("click");
		$('#AppointShiftDepart'+uuid).val(withinDate);
		$('#AppointMonthDepart'+uuid).val(preTime);
		}
//		$("input[name=isHanduuid"+uuid+"]").eq(3).trigger("click");
	}else if(intelType=="2_1"){
		$('input[name="isHanduuid'+uuid+'"][value="'+type+'"]').trigger("click")
		$('input[name="turnTime'+uuid+'"]').val(preTime);
//		$("input[name=isHanduuid"+uuid+"]").eq(0).trigger("click");
	}else if(intelType=="3_1"){
		$('input[name="isHanduuid'+uuid+'"][value="'+type+'"]').trigger("click")
		$('#atsShift'+uuid+'_el').val(atsShifts);
		$('input[name="atsShift'+uuid+'"]').val(atsShiftName);
		$('#summerToMonth'+uuid).val(preTime);
//		$("input[name=isHanduuid"+uuid+"]").eq(2).trigger("click");
	}else if(intelType=="5_1"){
		$('input[name="isHanduuid'+uuid+'"][value="'+type+'"]').trigger("click")
		$('#custom'+uuid).val(machAnalyzeClass);
//		$("input[name=isHanduuid"+uuid+"]").eq(4).trigger("click");
	}
		// $('input[name="isHanduuid'+uuid+'"][value="'+type+'"]').prop("checked", "checked");
		
	},
	//
	getItemsJosn : function(){
		var atsPCRuleId=_self.billId;
		var returnVal ;
		var data = {
					atsPCRuleId:atsPCRuleId
		};
		shr.doAjax({
					url: shr.getContextPath()+"/dynamic.do?method=getItemsJson&handler=com.kingdee.shr.ats.web.handler.AtsScheduleIntelMulitRowHandler",
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
				
	},
	//
	getAtsScheduleIntelSetJosn : function(){
		var atsPCRuleId=shr.getUrlRequestParam("billId");
		if(atsPCRuleId == ""){
		atsPCRuleId=_self.billId;
		}
		var returnVal ;
		var data = {
					atsPCRuleId:atsPCRuleId
		};
		shr.doAjax({
					url: shr.getContextPath()+"/dynamic.do?method=getAtsScheduleIntelSet&handler=com.kingdee.shr.ats.web.handler.AtsScheduleIntelMulitRowHandler",
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
				
	},initInformation:function(){
		var html=''
		+ '<div class="row-fluid row-block" title="' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_37 
		+ '">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_1 
		+ '</div>'
		+ '<div class="row-fluid row-block"  title="' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_75 
		+ '">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_2 
		+ '</div>'
		+ '<div class="row-fluid row-block"  title="' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_49 
		+ '">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_6 
		+ '</div>'
		+ '<div class="row-fluid row-block" title="' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_64 
		+ '">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_8 
		+ '</div>'
		+ '<div class="row-fluid row-block"  title="' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_101 
		+ '">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_11 
		+ '</div>'
		$("#information").append(html);
	},
	initPCRuleMultControlBtn:function(){
		var _self = this;
		var btnBar='<div class="generalParamsBtns">'
						+'<button id="generalParamsEdit" class="show">' 
						+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_23
						+ '</button>'
						+'<button id="generalParamsCancel">' 
						+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_70
						+ '</button>'
						+'<button id="generalParamsSave">' 
						+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_18 
						+ '</button>'
					+'</div>'
		$("#turnShiftEntryInfo").parent().parent().prepend(btnBar)
		
		// $("#workAreaDiv>.view_mainPage").hover(function(){
			$(".generalParamsBtns .show").addClass("hover")
		// },function(){
			// $(".generalParamsBtns .show").css({display:"none"})
		// })
		$("#generalParamsEdit").off('click').on("click",function(event){
			event.stopPropagation()
			$(this).removeClass("show")
			$(this).hide()
			$("#generalParamsSave").addClass("show")
			$("#generalParamsSave").show()
			$("#generalParamsCancel").addClass("show")
			$("#generalParamsCancel").show()
			$("#turnShiftEntryInfo .turnShiftEntryInfoView").hide()
			$("#turnShiftEntryInfo .turnShiftEntryInfoEdit").show()
			$(".generalParamsBtns button").removeClass("hover")
		})
		$("#generalParamsSave").off('click').on("click",function(event){
			event.stopPropagation()
			_self.generalParamsSubmit(function(_self){
				$("#generalParamsSave").removeClass("show")
				$("#generalParamsSave").hide()
				$("#generalParamsCancel").removeClass("show")
				$("#generalParamsCancel").hide()
				$("#generalParamsEdit").addClass("show")
				$("#generalParamsEdit").show()
				$("#turnShiftEntryInfo .turnShiftEntryInfoView").show()
				$("#turnShiftEntryInfo .turnShiftEntryInfoEdit").hide()
				_self.getAtsScheduleIntelSetHtml()
			})
			$(".generalParamsBtns .show").addClass("hover")
		})
		$("#generalParamsCancel").off('click').on("click",function(event){
			event.stopPropagation()
			$(this).removeClass("show")
			$(this).hide()
			$("#generalParamsSave").removeClass("show")
			$("#generalParamsSave").hide()
			$("#generalParamsEdit").addClass("show")
			$("#generalParamsEdit").show()
			$("#turnShiftEntryInfo .turnShiftEntryInfoView").show()
			$("#turnShiftEntryInfo .turnShiftEntryInfoEdit").hide()
			$(".generalParamsBtns .show").addClass("hover")
		})
	},generalParamsSubmit:function(callBack){
		var _self=this
		// 常用参数保存需要的操作！
		var intervalTime=atsMlUtile.getFieldOriginalValue("intervalTime");
        intervalTime = parseFloat(intervalTime)
		if ((!(/(^[1-9]\d*$)/.test(intervalTime)) && intervalTime !=0) || intervalTime =="" ) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_98,hideAfter: 50});
　　　　　　		return false; 
　　　　	}
		if ( intervalTime > 60) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_99,hideAfter: 50});
　　　　　　		return false; 
　　　　	}
		var atsShiftSegment1=$("input[name='atsShiftSegment1_el']").val().substring(0,1);
		var atsShiftSegment2=$("input[name='atsShiftSegment2_el']").val().substring(0,1);
		var atsShiftSegment3=$("input[name='atsShiftSegment3_el']").val().substring(0,1);
		var atsShiftSegment4=$("input[name='atsShiftSegment4_el']").val().substring(0,1);
		var atsShiftSegment5=$("input[name='atsShiftSegment5_el']").val().substring(0,1);
		var atsShiftSegment6=$("input[name='atsShiftSegment6_el']").val().substring(0,1);
		var atsShiftSegment7=$("input[name='atsShiftSegment7_el']").val().substring(0,1);
		var atsShiftSegment8=$("input[name='atsShiftSegment8_el']").val().substring(0,1);
		var atsShiftSegment9=$("input[name='atsShiftSegment9_el']").val().substring(0,1);
		if(atsShiftSegment1 == atsShiftSegment2 || atsShiftSegment1 == atsShiftSegment3 || atsShiftSegment2 == atsShiftSegment3){
			shr.showWarning({message: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_31,hideAfter: 50});
			return false;
		}
		if(atsShiftSegment4 == atsShiftSegment5 || atsShiftSegment4 == atsShiftSegment6 || atsShiftSegment5 == atsShiftSegment6){
			shr.showWarning({message: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_29,hideAfter: 50});
			return false;
		}
		if(atsShiftSegment7 == atsShiftSegment8 || atsShiftSegment7 == atsShiftSegment9 || atsShiftSegment8 == atsShiftSegment9){
			shr.showWarning({message: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_33,hideAfter: 50});
			return false;
		}
		var atsShiftRest=$("input[name='atsShiftRest_el']").val();
	
		var atsShiftLegal=$("input[name='atsShiftLegal_el']").val();
		
		var atsWorkRest=$("input[name='atsWorkRest_el']").val();
	
		var atsLegalShift=$("input[name='atsLegalShift_el']").val();
		var sameCard;
		if($("#sameCard").is(":checked")){
			sameCard=1;
		}else{
			sameCard=0;
		}
		var config = this.getConfig();
		var punchCardShift=JSON.stringify(config);
		if(!$("#isHandCopy").is(":checked")){
			punchCardShift="";
		}
		var billId=shr.getUrlRequestParam("billId");
			_self.remoteCall({
			type:"post",
			method:"updateFy",
			param:{billId:billId,punchCardShift:punchCardShift,intervalTime:intervalTime,sameCard:sameCard
			,atsShiftRest:atsShiftRest,atsShiftLegal:atsShiftLegal,atsWorkRest:atsWorkRest,atsLegalShift:atsLegalShift},
			async: false,
			success:function(res){
				var info =  res;
				
				
			}
		});
		// 常用参数保存后的回调函数！
		callBack(_self)
	},getConfig:function(){
	var config = {};
	var atsShiftSegment1=$("input[name='atsShiftSegment1_el']").val();
	var atsShiftSegment2=$("input[name='atsShiftSegment2_el']").val();
	var atsShiftSegment3=$("input[name='atsShiftSegment3_el']").val();
	var atsShiftSegment4=$("input[name='atsShiftSegment4_el']").val();
	var atsShiftSegment5=$("input[name='atsShiftSegment5_el']").val();
	var atsShiftSegment6=$("input[name='atsShiftSegment6_el']").val();
	var atsShiftSegment7=$("input[name='atsShiftSegment7_el']").val();
	var atsShiftSegment8=$("input[name='atsShiftSegment8_el']").val();
	var atsShiftSegment9=$("input[name='atsShiftSegment9_el']").val();
	config ={"atsShiftSegment1":atsShiftSegment1,"atsShiftSegment2":atsShiftSegment2
	,"atsShiftSegment3":atsShiftSegment3,"atsShiftSegment4":atsShiftSegment4
	,"atsShiftSegment5":atsShiftSegment5,"atsShiftSegment6":atsShiftSegment6
	,"atsShiftSegment7":atsShiftSegment7,"atsShiftSegment8":atsShiftSegment8
	,"atsShiftSegment9":atsShiftSegment9};
	
	var c = [atsShiftSegment1,atsShiftSegment2,atsShiftSegment3];
	var cc = [atsShiftSegment4,atsShiftSegment5,atsShiftSegment6];
	var ccc = [atsShiftSegment7,atsShiftSegment8,atsShiftSegment9];
	var re = [{"cardTimeRange" : "0_2","data" : c},{cardTimeRange: "3_4","data" : cc},{"cardTimeRange":"5_99999" ,"data": ccc}];
	return re;
	}
	,initPCRuleMultDom:function(){
	
		var html=''
			+ '<div class="row-fluid row-block" id="isHandCopyShowOrHide" >'
			+ '<span title="">'
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_34 ,[
				' </span>'
				+ '<div class="w100"><input id="intervalTime" name="intervalTime" style="background-color:#D9EDF7" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_68
				+ '"></div>'
				+ '<span title="">'
			])
			+ '</span>'
			+ '</div>'
			+ '<div><input style="float:left;"  id="sameCard" name="sameCard" value="1"  type="checkBox" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<div style=" text-align: left;padding-left: 10px;" class="field_label" title="">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_67
			+ ' </div></div>'
			+ '<div><input style="float:left;"  id="isHandCopy" name="isHandCopy" value="1"  type="checkBox" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<div style=" text-align: left;padding-left: 10px;" class="field_label" title="">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_66
			+ ' </div></div>'
			+ '<div class="row-fluid row-block left20" id="turnShiftClick">'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60 
			+ '">' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_30 
			+ '</span>'
			+ '<div class="w100 "><input id="atsShiftSegment1" name="atsShiftSegment1" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69
			+ '"></div>'
			+ '<span  class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_40 
			+ '"></span>'	
			+ '<div class="w100"><input id="atsShiftSegment2" name="atsShiftSegment2" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69 
			+ '"></div>'
			+ '<span class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_87
			+ '"></span>'
			+ '<div class="w100"><input id="atsShiftSegment3" name="atsShiftSegment3" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69 
			+ '"></div>'	
			+'</div>'



			+ '<div class="row-fluid row-block left20" id="turnShiftClick">'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60 
			+ '">' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_28 
			+ '</span>'
			+ '<div class="w100"><input id="atsShiftSegment4" name="atsShiftSegment4" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69 
			+ '"></div>'
			+ '<span  class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_40 
			+ '"></span>'
			+ '<div class="w100"><input id="atsShiftSegment5" name="atsShiftSegment5" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69 
			+ '"></div>'
			+ '<span class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_87 
			+ '"></span>'
			+ '<div class="w100"><input id="atsShiftSegment6" name="atsShiftSegment6" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69 
			+ '"></div>'
			+'</div>'


			+ '<div class="row-fluid row-block left20" id="turnShiftClick">'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60 
			+ '">' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_32 
			+ '</span>'
			+ '<div class="w100"><input id="atsShiftSegment7" name="atsShiftSegment7" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69 
			+ '"></div>'
			+ '<span class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_40 
			+ '"></span>'
			+ '<div class="w100"><input id="atsShiftSegment8" name="atsShiftSegment8" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69 
			+ '"></div>'
			+ '<span class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_87 
			+ '"></span>'
			+ '<div class="w100"><input id="atsShiftSegment9" name="atsShiftSegment9" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69 
			+ '"></div>'
			+'</div>'


			+ '<div style=" text-align: left;" class="field_label" title="">'
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_89
			+ ' </div>'

			+ '<div class="row-fluid row-block" >'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60 
			+ '">' 
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_56 ,[
				'</span>'
				+ '<div class="w120"><input id="atsShiftRest" name="atsShiftRest" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69
				+ '"></div>'
				+ '<span  title="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60
				+ '">'
			])
			+ '</span>'
			+ '</div>'
			+ '<div class="row-fluid row-block" >'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60 
			+ '">' 
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_53,[
				'</span>'
				+ '<div class="w120"><input id="atsShiftLegal" name="atsShiftLegal" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69
				+ '"></div>'
				+ '<span title="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60
				+ '">'
			])
			+ '</span>'
			+ '</div>'
			+ '<div class="row-fluid row-block" >'
			+ '<span title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60 
			+ '">' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_54 
			+ '</span>'
			+ '</div>'

			+ '<div class="row-fluid row-block" >'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60 
			+ '">' 
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_48 ,[
				'</span>'
				+ '<div class="w120"><input id="atsWorkRest" name="atsWorkRest" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69
				+ '"></div>'
				+ '<span  title="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60
				+ '">'
			])
			+ '</span>'
			+ '</div>'

			+ '<div class="row-fluid row-block" >'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60 
			+ '">' 
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_47,[
				'</span>'
				+ '<div class="w120"><input id="atsLegalShift" name="atsLegalShift" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69
				+ '"></div>'
				+ '<span  title="'
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_60
				+ '">'
			])
			+ '</span>'
			+ '</div>'
		$("#turnShiftEntryInfo .turnShiftEntryInfoEdit").html(html);
		var _self = this;
		_self.getShowDom();
	
	},getShowDom:function(){
		var select_json = {
			name: "atsShiftRest" ,
			readonly: "",
			value: "1_0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_0", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_85},
							{'value': "1_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_86}
							];					
		$('#atsShiftRest').shrSelect(select_json);
		
		var select_json = {
			name: "atsShiftLegal" ,
			readonly: "",
			value: "2_0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "2_0", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_42},
							{'value': "2_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_43}
							];
		$('#atsShiftLegal').shrSelect(select_json);
		
		var select_json = {
			name: "atsWorkRest" ,
			readonly: "",
			onChange: null,
			value: "1_0",
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_0", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_85},
							{'value': "0_0", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_45},
							{'value': "1_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_86}
							];
		$('#atsWorkRest').shrSelect(select_json);
		
		var select_json = {
			name: "atsLegalShift" ,
			readonly: "",
			value: "2_0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "2_0", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_42},
							{'value': "2_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_43}
							];
		$('#atsLegalShift').shrSelect(select_json);
		
			var select_json = {
			name: "atsShiftSegmentOne" ,
			readonly: "",
			value: "1",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{"value": "1", "alias": jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88},
							{"value": "2", "alias": jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59},
							{"value": "3", "alias": jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73}
							];
		$('input[name="atsShiftSegmentOne"]').shrSelect(select_json);
		var select_json = {
			name: "atsShiftSegment1" ,
			readonly: "",
			value: "1_1",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_1",
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88},
							{'value': "2_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59},
							{'value': "3_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73}
							];
		$('#atsShiftSegment1').shrSelect(select_json);
		var select_json = {
			name: "atsShiftSegment2" ,
			readonly: "",
			value: "2_2",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88},
							{'value': "2_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59},
							{'value': "3_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73}
							];
		$('#atsShiftSegment2').shrSelect(select_json);
		var select_json = {
			name: "atsShiftSegment3" ,
			readonly: "",
			value: "3_3",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_3",
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88},
							{'value': "2_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59},
							{'value': "3_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73}
							];
		$('#atsShiftSegment3').shrSelect(select_json);
		
		var select_json = {
			name: "atsShiftSegment4" ,
			readonly: "",
			value: "2_1",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88},
							{'value': "2_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59},
							{'value': "3_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73}
							];
		$('#atsShiftSegment4').shrSelect(select_json);
		
		
		var select_json = {
			name: "atsShiftSegment5" ,
			readonly: "",
			value: "3_2",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_2",
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88},
							{'value': "2_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59},
							{'value': "3_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73}
							];
		$('#atsShiftSegment5').shrSelect(select_json);
		
		var select_json = {
			name: "atsShiftSegment6" ,
			readonly: "",
			value: "1_3",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88},
							{'value': "2_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59},
							{'value': "3_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73}
							];
		$('#atsShiftSegment6').shrSelect(select_json);
		
		var select_json = {
			name: "atsShiftSegment7" ,
			readonly: "",
			value: "3_1",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88},
							{'value': "2_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59},
							{'value': "3_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73}
							];
		$('#atsShiftSegment7').shrSelect(select_json);
		
		var select_json = {
			name: "atsShiftSegment8" ,
			readonly: "",
			value: "2_2",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88},
							{'value': "2_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59},
							{'value': "3_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73}
							];
		$('#atsShiftSegment8').shrSelect(select_json);
		
			var select_json = {
			name: "atsShiftSegment9" ,
			readonly: "",
			value: "1_3",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88},
							{'value': "2_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59},
							{'value': "3_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73}
							];
		$('#atsShiftSegment9').shrSelect(select_json);
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
		var type=$('input[name="isHanduuid'+_self.uuid+'"]:checked').val();
		if(type=="0"){
		var isHandCopy=$('input[name="isHandCopy'+_self.uuid+'"]:checked').val();
		asmodel.intelType=isHandCopy;
		if(isHandCopy=="1_1"){
		var shiftWeek=$("#shiftWeek"+_self.uuid).val();
		asmodel.preTime=shiftWeek;
		}
		}else if(type=="3"){
		var isHandShift=$('input[name="isHandShift'+_self.uuid+'"]:checked').val();
		asmodel.intelType=isHandShift;
		if(isHandShift=="4_1"){
		var autoMonth=$("#autoMonth"+this.uuid).val();
		var autoMonthDay=$("#autoMonthDay"+this.uuid).val();
		asmodel.withinDate=autoMonth;
		asmodel.preTime=autoMonthDay;
		}else if(isHandShift=="4_2"){
		var AppointShift=$("#AppointShift"+this.uuid).val();
		var AppointMonth=$("#AppointMonth"+this.uuid).val();
		asmodel.withinDate=AppointShift;
		asmodel.preTime=AppointMonth;
		}else if(isHandShift=="4_3"){
		var AppointShiftDepart=$("#AppointShiftDepart"+this.uuid).val();
		var autoMonthDayDepart=$("#AppointMonthDepart"+this.uuid).val();
		asmodel.withinDate=AppointShiftDepart;
		asmodel.preTime=autoMonthDayDepart;
		}
		}else{
		asmodel.intelType=type;
		if(type=="2_1"){
		var turnTime=$("#turnTime"+this.uuid).val();
		asmodel.preTime=turnTime;
		}else if(type=="3_1"){
		var summerToMonth=$("#summerToMonth"+this.uuid).val();
		asmodel.preTime=summerToMonth;
		var atsShifts=$("#atsShift"+this.uuid+"_el").val();
		asmodel.atsShifts=atsShifts;
		}
		}
		if(type=="5_1"){
		var custom=$("#custom"+this.uuid).val();
		asmodel.machAnalyzeClass=custom;
		}else{
		asmodel.machAnalyzeClass="com.kingdee.eas.hr.ats.workShift.plan.matchSchedule.MatchAnalysorManager";
		}
//		var config = this.getConfig();
//		JSON.stringify(config);
//		asmodel.config=JSON.stringify(config);
		
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
	},defaultHtml:function(uuid){
		var _self=this;
		var html=''
	 			 + '<div class="row-fluid row-block">'
				 + '<div class="col-lg-2 field-desc"></div>'
				 + '<div  id="serviceAge_'+uuid+'" ><div class="row-fluid row-block row_field">'
				 + '<div class="col-lg-4"><div class="field_label" title="' 
				 + jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_63 
				 + '">' 
				 + jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_63 
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
			'<div id ="condition_item_'+ruleDetail_num+'_'+condition_num+'" name = "condition_item" class="row-fluid row-block row_field" style="width: 115%">'
				+ '<div class="span1"><input type="hidden" name="conditionId"  /><span class="cell-RlStdType"></span></div>'
				+ '<div class="span2 field-ctrl">' 
				+ '<input name_value = "prop_field_html"/>' 
				+ '</div>'
				+ '<div class="span2"><input id="prop_op" type="text" name="prop_op" class="input-height cell-input" style="width:140px"/></div>'
				+ '<div class="span2 field-ctrl"><input id='+pre_prop_value+' type="text" name="prop_value" class="input-height cursor-pointer" style="width:126px"></div>'
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
			prop_op_json.data = [{value:"like",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_15},
			                    {value:"not like",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_24},
			                    {value:"=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_39},
			                    {value:"<>",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_25},
			                    {value:">",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_35},
			                    {value:"<",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_82}
			            		];
			
			var prop_op_date_json = {id:"prop_op"};
			prop_op_date_json.data = [{value:"=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_39},
			                    {value:"<>",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_25},
			                    {value:">",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_35},
			                    {value:"<",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_82},
			                    {value:">=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_36},
			                    {value:"<=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_83}
			            		];
			
			var prop_boolean_json = {id:"prop_op"};
			prop_boolean_json.data = [
			                    {value:"=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_39},
			                    {value:"<>",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_25}
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
						select_json.data = [{value:"1",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_79},
						                    {value:"0",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_44}
						            		];
						prop_value_ctrl.shrSelect(select_json);
						prop_value_ctrl.css("width","90px");
					}
					if(type == "String"){
						prop_op_ctrl.shrSelect(prop_op_json);
						prop_op_ctrl.shrSelect("setValue", prop_op_json.data[0].value);
						prop_value_ctrl.css("width","126px");
						prop_value_ctrl.attr("placeholder",jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_41);
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
		prop_pre_json.data = [{value:">",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_35},
		                    {value:">=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_36}
		            		];
		var prop_next_json = {id:"nextCmpType",
							 readonly: "",
	    					 value: "<",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
							};
		prop_next_json.data = [
		                    {value:"<",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_82},
		                    {value:"<=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_83}
		            		];
		var position = {id:"position",
							 readonly: "",
	    					 value: "<",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
							};
		position.data = [
		                    {value:"<",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_100},
		                    {value:"<=",alias:"ceo"}
		            		];
							
		var work_item_label = 
			 '<div id = "service_item_'+ruleDetail_num+'_'+serviceAge_num+'" name="service_item" class="row-fluid row-block row_field" style="width: 115%">'
				+ '<div class="span2" id><input type="text" name="preCmpType" class="input-height cursor-pointer"  placeholder="' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_72 
				+ '"  "/></div>'
				+ '<div class="span2"><input type="text" name="nextCmpType"class="input-height cursor-pointer" dataextenal="" placeholder=""   "/></div>'
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
		prop_op_json.data = [{value:"like",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_15},
		                    {value:"not like",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_24},
		                    {value:"=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_39},
		                    {value:"<>",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_25},
		                    {value:">",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_35},
		                    {value:"<",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_82}
		            		];
		
		var prop_op_date_json = {id:"prop_op"};
		prop_op_date_json.data = [{value:"=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_39},
		                    {value:"<>",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_25},
		                    {value:">",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_35},
		                    {value:"<",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_82},
		                    {value:">=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_36},
		                    {value:"<=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_83}
		            		];
		
		var prop_boolean_json = {id:"prop_op"};
		prop_boolean_json.data = [
		                    {value:"=",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_39},
		                    {value:"<>",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_25}
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
			select_json.data = [{value:"1",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_79},
			                    {value:"0",alias:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_44}
			            		];
			prop_value_ctrl.shrSelect(select_json);
			prop_value_ctrl.css("width","90px");
		}
		if(type == "String"){
			prop_op_ctrl.shrSelect(prop_op_json);
			prop_op_ctrl.shrSelect("setValue", prop_op_json.data[0].value);
			prop_value_ctrl.css("width","126px");
			prop_value_ctrl.attr("placeholder",jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_41);
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
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_90  
				+ '</span></div>'
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
	},
	setButtonVisible:function(){
        shr.ats.atsScheduleIntelMultSet.superClass.setButtonVisible.call(this);
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
								workAreaDiv.find('.hover').css('visibility','');
							},
							function() {
								workAreaDiv.find('.hover').css('visibility','hidden');
							}
						);
        }
    },
	showConditionHtml:function(ruleItems,ruleDetail_num){
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
				console.log("123456");
				
				var nowRule=$(this).parents().filter(".view_mainPage").eq(0)
				console.log(nowRule);
				
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
					$("#turnTime"+nowUuid).prop("disabled",false)
				}else if(liNum===1){
					// $("#isHandCopy"+uuid).prop("disabled",false)
					$("input[name=isHandCopy"+nowUuid+"]").prop("disabled",false)
					$("input[name=isHandCopy"+nowUuid+"]").off('click').on("click",function(){
						var value=$(this).val()
						if(value==='1_1'){
							$("input[name=shiftWeek"+nowUuid+"]").prop("disabled",false)
						}else if(value==='1_2'){
							$("input[name=shiftWeek"+nowUuid+"]").prop("disabled",true)
						}	
					})
					$("input[name=isHandCopy"+nowUuid+"]").eq(0).trigger("click")
				}	else if(liNum===2){
					$("input[name=atsShift"+nowUuid+"]").shrPromptBox("enable")
					$("input[name=summerToMonth]").prop("disabled",false)
					
				}else if(liNum===3){
					$("input[name=isHandShift"+nowUuid+"]").prop("disabled",false)
					$("input[name=isHandShift"+nowUuid+"]").off('click').on("click",function(){
						var value=$(this).val()
						if(value==='4_1'){
							$("input[name=autoMonth"+nowUuid+"]").prop("disabled",false)
							$("input[name=autoMonthDay"+nowUuid+"]").prop("disabled",false)
							$("input[name=AppointShift"+nowUuid+"]").prop("disabled",true)
							$("input[name=AppointMonth"+nowUuid+"]").prop("disabled",true)
							$("input[name=AppointShiftDepart"+nowUuid+"]").prop("disabled",true)
							$("input[name=AppointMonthDepart"+nowUuid+"]").prop("disabled",true)
						}else if(value==='4_2'){
							$("input[name=autoMonth"+nowUuid+"]").prop("disabled",true)
							$("input[name=autoMonthDay"+nowUuid+"]").prop("disabled",true)
							$("input[name=AppointShift"+nowUuid+"]").prop("disabled",false)
							$("input[name=AppointMonth"+nowUuid+"]").prop("disabled",false)
							$("input[name=AppointShiftDepart"+nowUuid+"]").prop("disabled",true)
							$("input[name=AppointMonthDepart"+nowUuid+"]").prop("disabled",true)
						}else if(value==='4_3'){
							$("input[name=autoMonth"+nowUuid+"]").prop("disabled",true)
							$("input[name=autoMonthDay"+nowUuid+"]").prop("disabled",true)
							$("input[name=AppointShift"+nowUuid+"]").prop("disabled",true)
							$("input[name=AppointMonth"+nowUuid+"]").prop("disabled",true)
							$("input[name=AppointShiftDepart"+nowUuid+"]").prop("disabled",false)
							$("input[name=AppointMonthDepart"+nowUuid+"]").prop("disabled",false)
						}
					})
					$("input[name=isHandShift"+nowUuid+"]").eq(0).trigger("click")
				}else if(liNum===4){
					$("input[name=custom"+nowUuid+"]").prop("disabled",false)
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
	},getF7:function(){
		var uuid =this.uuid;
		var hrorgunit = $("#hrOrgUnit").val();
		var grid_f7_json = {id:"atsShift"+uuid,name:"atsShift"+uuid};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_13,uipk:"com.kingdee.eas.hr.ats.app.AtsShift.AvailableList.F7",query:"",multiselect:true};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrorgunit ;		
		grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,
			alias: jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_81,
			widgetType: 'checkbox'}];
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		var object = $('input[name="atsShift'+uuid+'"]');
		object.shrPromptBox(grid_f7_json);
		object.shrPromptBox("setBizFilterFieldsValues",hrorgunit);
	},getViewHtml:function(res,result){
		var that=this;
		var uuid=that.uuid;
		var intelType=result.atsPCRuleInfo["intelType"];
		var type=intelType;
		var preTime=result.atsPCRuleInfo["preTime"];
		var withinDate=result.atsPCRuleInfo["withinDate"];
		var atsShifts=result.atsPCRuleInfo["atsShifts"];
		var atsShiftName=result.atsPCRuleInfo["atsShiftName"];
		var machAnalyzeClass=result.atsPCRuleInfo["machAnalyzeClass"];
		var html='';
		if(intelType=="1_1" || intelType=="1_2"){
			html=html+jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_38;
			if(intelType=="1_1"){
			html=html+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_77, [preTime]);
			}else{
			html=html+jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_71;
			}
		}else if(intelType=="4_1" || intelType=="4_2" || intelType=="4_3"){
			html=html+jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_65;
			if(intelType=="4_1"){
				html=html+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_94, [withinDate, preTime]);
			}else if(intelType=="4_2"){
				html=html+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_93, [withinDate, preTime]);
			}else if(intelType=="4_3"){
				html=html+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_92, [withinDate, preTime]);
			}
		}else if(intelType=="2_1"){
			html=html+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_76, [preTime]);
		}else if(intelType=="3_1"){
			html=html+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_50, [atsShiftName, preTime]);
		}else if(intelType=="5_1"){
			html=html+jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_102 
			+ '"'+machAnalyzeClass+'"';
		}
		return html;
	},getAtsScheduleIntelSetHtml:function(){
		var that=this;
		var result=that.getAtsScheduleIntelSetJosn();
	
		var html='<input id="hideInformation" name="hideInformation" type="hidden" value="0" class="block-father input-height"  validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' +
			jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_69 +
			'">';
		html=html+'<p>' 
		+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_0, [result.atsScheduleIntelSet["intervalTime"]]) 
		+ '</p>';
		var sameCard=result.atsScheduleIntelSet["sameCard"];
		if(sameCard==='1'||sameCard===true){
		html=html+'<p>' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_4 
		+ '</p>';
		}else{
		html=html+'<p>' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_3 
		+ '</p>';
		}
		if( result.atsScheduleIntelSet["punchCardShift"] !=""){
		var jsonObj = JSON.parse(result.atsScheduleIntelSet["punchCardShift"]);
		jsonObj = jsonObj.sort(function(range1,range2){
		return range1.cardTimeRange - range2.cardTimeRange;
		});
		html=html+'<p>' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_7 
		+ '</p>'
		html=html+'<p class="left20">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_30 
		+ '"'+that.getHtml(jsonObj[0].data[0])+'" > "'+that.getHtml(jsonObj[0].data[1])+'" > "'+that.getHtml(jsonObj[0].data[2])+'"</p>';
		html=html+'<p class="left20">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_28 
		+ '"'+that.getHtml(jsonObj[1].data[0])+'" > "'+that.getHtml(jsonObj[1].data[1])+'" > "'+that.getHtml(jsonObj[1].data[2])+'"</p>';
		html=html+'<p class="left20">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_32 
		+ '"'+that.getHtml(jsonObj[2].data[0])+'" > "'+that.getHtml(jsonObj[2].data[1])+'" > "'+that.getHtml(jsonObj[2].data[2])+'"</p>';
		}else{
		html=html+'<p>' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_5 
		+ '</p>'
		}
		html=html+'<p>' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_9 
		+ '</p>';
		html=html+'<p class="left20">' 
		+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_55, [result.atsScheduleIntelSet["atsShiftRest"]])  
		+ '</p>';
		html=html+'<p class="left20">' 
		+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_52, [result.atsScheduleIntelSet["atsShiftLegal"]]) 
		+ '</p>';
		html=html+'<p class="left20">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_54 
		+ '</p>';
		html=html+'<p>' 
		+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_10, [result.atsScheduleIntelSet["atsWorkRest"]]) 
		+ '</p>';
		html=html+'<p class="left20">' 
		+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_46, [result.atsScheduleIntelSet["atsLegalShift"]]) 
		+ '</p>';
		$("#turnShiftEntryInfo .turnShiftEntryInfoView").html(html);
	},initEditHtml:function(){
		var that=this;
		var result=that.getAtsScheduleIntelSetJosn();
		atsMlUtile.setTransNumValue("intervalTime",result.atsScheduleIntelSet["intervalTime"],{'decimalPrecision':0});
		var atsShiftRest=result.atsScheduleIntelSet["atsShiftRest"];
		var atsShiftRestValue=result.atsScheduleIntelSet["atsShiftRestValue"];
		$('input[name="atsShiftRest_el"]').val(atsShiftRestValue);
		$('input[name="atsShiftRest"]').val(atsShiftRest);
		
		var atsShiftLegal=result.atsScheduleIntelSet["atsShiftLegal"];
		var atsShiftLegalValue=result.atsScheduleIntelSet["atsShiftLegalValue"];
		$('input[name="atsShiftLegal_el"]').val(atsShiftLegalValue);
		$('input[name="atsShiftLegal"]').val(atsShiftLegal);
		
		var atsWorkRest=result.atsScheduleIntelSet["atsWorkRest"];
		var atsWorkRestValue=result.atsScheduleIntelSet["atsWorkRestValue"];
		$('input[name="atsWorkRest_el"]').val(atsWorkRestValue);
		$('input[name="atsWorkRest"]').val(atsWorkRest);
		
		var atsLegalShift=result.atsScheduleIntelSet["atsLegalShift"];
		var atsLegalShiftValue=result.atsScheduleIntelSet["atsLegalShiftValue"];
		$('input[name="atsLegalShift_el"]').val(atsLegalShiftValue);
		$('input[name="atsLegalShift"]').val(atsLegalShift);
		var sameCard=result.atsScheduleIntelSet["sameCard"];
		if(sameCard==='1'||sameCard===true){
		document.getElementById("sameCard").checked=true
		}
		if( result.atsScheduleIntelSet["punchCardShift"] !=""){
		document.getElementById("isHandCopy").checked=true
		}
		if(result.atsScheduleIntelSet["punchCardShift"] != ""){
		var jsonObj = JSON.parse(result.atsScheduleIntelSet["punchCardShift"]);
		jsonObj = jsonObj.sort(function(range1,range2){
		return range1.cardTimeRange - range2.cardTimeRange;
		});
		}else{
		try{
			$("input[name=atsShiftSegment1]").shrSelect("disable")
			}
		    catch (e) {
		    }
			try{
			$("input[name=atsShiftSegment2]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment3]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment4]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment5]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment6]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment7]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment8]").shrSelect("disable")
			}
		    catch (e) {
		    }
		    try{
			$("input[name=atsShiftSegment9]").shrSelect("disable")
			}
		    catch (e) {
		    }
		}
	},
	getHtml:function(type){
	var result;
	if(type=='1_1' || type=='1_2' || type=='1_3'){
	result=jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_88;
	}else if(type=='2_1' || type=='2_2' || type=='2_3'){
	result=jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_59;
	}else if(type=='3_1' || type=='3_2' || type=='3_3'){
	result=jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_73;
	}
	return result;
	},editMainAction: function() {
	 	var  options = {};
	 	options.method='edit';
	 	options.uipk= 'com.kingdee.eas.hr.ats.app.AtsScheduleIntelSetAdd.form';
	 	options.billId=$('#form #id').val();
	 	this.reloadPage(options);		
				
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
	verify: function(event, action) {
		var that = this;
		if(!that.checkConfig()){
		return false;
		}
		return true;
	},checkConfig:function(){
	var uuid=this.uuid;
	var adminOrgUnit=$("#adminOrgUni"+uuid+"_el").val();
	var attenceGrou=$("#attenceGrou"+uuid+"_el").val();
	var perso=$("#perso"+uuid+"_el").val();
//	if(!adminOrgUnit && !attenceGrou && !perso){
//	shr.showWarning({message : "所属行政组织、考勤组、姓名不能同时为空!"});
//	return false;
//	}
	var isHanduuid=$('input[name="isHanduuid'+uuid+'"]:checked').val();
	if(isHanduuid=="2_1"){
	var yz=true;
	var turnTime=$("#turnTime"+uuid).val();
	if(!turnTime){
		$("#turnTime"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' +
			jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 +
			'</label>');
		yz= false;
	}
	if(!yz){
	return false;
	}
	if ((!(/(^[1-9]\d*$)/.test(turnTime)) && turnTime !=0) || turnTime =="" || turnTime > 240) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_74+"240",hideAfter: 50});
　　　　　　		return false; 
　　　　}
	}
	var isHandCopy=$('input[name="isHandCopy'+uuid+'"]:checked').val();
	if(isHanduuid=="0" && isHandCopy=="1_1"){
	var yz=true;
	var shiftWeek=$("#shiftWeek"+uuid).val();
	if(!shiftWeek){
		$("#shiftWeek"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 
				+ '</label>');
		yz= false;
	}
	if(!yz){
	return false;
	}
		if ((!(/(^[1-9]\d*$)/.test(shiftWeek)) && shiftWeek !=0) || shiftWeek =="" || shiftWeek > 240) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_74+"240",hideAfter: 50});
　　　　　　		return false; 
　　　　	}
		
	}
	if(isHanduuid=="3_1" ){
	var yz=true;
	var atsShift=$("#atsShift"+uuid).val();
	if(!atsShift){
		$("#atsShift"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 
				+ '</label>');
		yz= false;
	}
	var summerToMonth=$("#summerToMonth"+uuid).val();
	if(!summerToMonth){
		$("#summerToMonth"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 
				+ '</label>');
		yz= false;
	}
	if(!yz){
	return false;
	}
	if ((!(/(^[1-9]\d*$)/.test(summerToMonth)) && summerToMonth !=0) || summerToMonth =="" || summerToMonth > 240) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_74+"240",hideAfter: 50});
　　　　　　		return false; 
　　　　}
	}
	if(isHanduuid=="5_1" ){
	var yz=true;
	var custom=$("#custom"+uuid).val();
	if(!custom){
		$("#custom"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 
				+ '</label>');
		yz= false;
	}
	
	if(!yz){
	return false;
	}
	}
	if(isHanduuid=="3" ){
	var yz=true;
	var isHandShift=$('input[name="isHandShift'+uuid+'"]:checked').val();
	if(isHandShift=="4_1" ){
	var autoMonth=$("#autoMonth"+uuid).val();
	if(!autoMonth){
		$("#autoMonth"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 
				+ '</label>');
		yz= false;
	}
	if ((!(/(^[1-9]\d*$)/.test(autoMonth)) && autoMonth !=0)  || autoMonth > 30) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_95+"30",hideAfter: 50});
　　　　　　		return false; 
　　　　}
	var autoMonthDay=$("#autoMonthDay"+uuid).val();
	if(!autoMonthDay){
		$("#autoMonthDay"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 
				+ '</label>');
		yz= false;
	}
		if ((!(/(^[1-9]\d*$)/.test(autoMonthDay)) && autoMonthDay !=0)  || autoMonthDay > 240) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_74+"240",hideAfter: 50});
　　　　　　		return false; 
　　　　}
	}
	if(isHandShift=="4_2" ){
	var AppointShift=$("#AppointShift"+uuid).val();
	if(!AppointShift){
		$("#AppointShift"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 
				+ '</label>');
		yz= false;
	}
	if ((!(/(^[1-9]\d*$)/.test(AppointShift)) && AppointShift !=0)  || AppointShift > 30) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_58+"30",hideAfter: 50});
　　　　　　		return false; 
　　　　}
	var AppointMonth=$("#AppointMonth"+uuid).val();
	if(!AppointMonth){
		$("#AppointMonth"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 
				+ '</label>');
		yz= false;
	}
	if ((!(/(^[1-9]\d*$)/.test(AppointMonth)) && AppointMonth !=0)  || AppointMonth > 240) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_74+"240",hideAfter: 50});
　　　　　　		return false; 
　　　　}
	}
	if(isHandShift=="4_3" ){
	var AppointShiftDepart=$("#AppointShiftDepart"+uuid).val();
	if(!AppointShiftDepart){
		$("#AppointShiftDepart"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 
				+ '</label>');
		yz= false;
	}
	if ((!(/(^[1-9]\d*$)/.test(AppointShiftDepart)) && AppointShiftDepart !=0)  || AppointShiftDepart > 30) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_26+"30",hideAfter: 50});
　　　　　　		return false; 
　　　　}
	var AppointMonthDepart=$("#AppointMonthDepart"+uuid).val();
	if(!AppointMonthDepart){
		$("#AppointMonthDepart"+uuid).after('<label for="number" generated="true" class="error" style="display: block;position:absolute">' 
				+ jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_22 
				+ '</label>');
		yz= false;
	}
	if ((!(/(^[1-9]\d*$)/.test(AppointMonthDepart)) && AppointMonthDepart !=0)  || AppointMonthDepart > 240) { 
　　　　　		shr.showWarning({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_74+"240",hideAfter: 50});
　　　　　　		return false; 
　　　　}
	}
	if(!yz){
	return false;
	}
	}
	return true;
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
	enableAction : function() {
		var clz = this;
		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsScheduleIntelListHandler';
		var bills=shr.getUrlRequestParam("billId");
		shr.showConfirm(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_61, function(){
			clz.remoteCall({
				type:"post",
				method:"enables",
				url:url,
				param:{billId: bills},
				async: false,
				success:function(res){
				shr.showInfo({message:jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_27,hideAfter: 3});
				$("#enable").hide();
				}
			});
		});			
	},
	initCurrentHrOrgUnit: function(uuid) {
		var that = this;
		var hrOrgUnitId=$("#hrOrgUnit").val();
		//---？？
//		$("#entries_tripType").shrPromptBox().attr("data-params",hrOrgUnitId);
		$("#perso"+uuid).shrPromptBox().attr("data-params",hrOrgUnitId);
//		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
		
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
		shr.showConfirm(jsBizMultLan.atsManager_atsScheduleIntelMultSet_i18n_62, function(){
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
				
				if(!next){
				$("#SmartRulesNav li").eq(0).triggerHandler("click");
				}else{
				$(next).find("#SmartRulesNav li").eq(0).triggerHandler("click");
				}
			}
		});
	}
});

