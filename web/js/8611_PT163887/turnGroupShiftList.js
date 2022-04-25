shr.defineClass("shr.ats.turnGroupShiftList", shr.framework.Core, {
	initalizeDOM:function(){
		var that = this;
		shr.ats.turnGroupShiftList.superClass.initalizeDOM.call(this);
//		$('#turnShiftMainInfo').empty();
//		$('#breadcrumb').parent().parent().empty();
//		var row_fields_work = ''
//		+ '<div class="row-fluid row-block ">' 
//		 		+ '<div data-ctrlrole="labelContainer">' 
//	   		        + '	 <div class="col-lg-4"><div class="field_label" title="考勤业务组织">轮班规则</div></div>' 
//	   		        + '  <div class="col-lg-6 field-ctrl"> <input name="turnShift" class="input-height cell-input"/></div>'
//	   		        + '</div>'
//	   		        + '<div data-ctrlrole="labelContainer">' 
//					+ '	 <div class="col-lg-4"><span class="field_label">轮班规则开始于</span></div>'
//					+ '  <div class="col-lg-6 field-ctrl" id="segment">' 
//					+		'<input  value ="1" readonly="readonly" type="text" name="TextNum"   validate="{required:true}"/></div>'
//				+ '</div>'
//				+ '<div class="row-fluid row-block">' 
//	   		        + '	 <div class="span"><span readonly="readonly" validate="{required:true}" class="field_label">开始日期</span></div>' 
//	   		        + '  <div class="span"><input name="beginDate"  class="input-height cell-input"/></div>'
//					+ '	 <div class="span"><span readonly="readonly" validate="{required:true}" class="field_label">结束日期</span></div>'
//					+ '  <div class="span"><input name="endDate"  class="input-height cell-input"/></div>'
//				+ '</div>'
//				+ '</div>'
//				+ '<div class="row-fluid row-block">'  
//					+ '	 <div class="span"><span class="field_label">节假日处理</span></div>'
//					+ '  <div class="span"><input name="holidayHandle" class="input-height cell-input"/></div>'  
//				+ '</div>';		
//		var row_fields_work ='<div class="row-fluid row-block " id="">'
//		+ '<div data-ctrlrole="labelContainer">'
//			+ '<div class="col-lg-4">'
//			+ '	<div class="field_label" title="考勤业务组织">考勤业务组织</div>'
//			+ '</div>'				
//			+ '<div class="col-lg-6 field-ctrl">'
//	+ '<div class="ui-promptBox-frame required"><div class="ui-promptBox-layout"><div class="ui-promptBox-inputframe">'
//	+ '<input type="hidden" id="hrOrgUnit_el" name="hidd_name_hrOrgUnit" value="">'
//	+ '<input id="hrOrgUnit" name="hrOrgUnit" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title=""></div><div class="ui-promptBox-icon">'
//	+ '<img style="cursor:pointer;" src="/shr/styles/images/seniorf7.png"></div></div></div>'
//		+ '	</div>'
//		+ '	<div class="col-lg-2 field-desc"></div>'
//		+ '</div>'
//		
//		
//		+ '<div data-ctrlrole="labelContainer">'
//		+ '	<div class="col-lg-4">'
//		+ '		<div class="field_label" title="考勤组">考勤组</div>'
//		+ '	</div>'				
//		+ '	<div class="col-lg-6 field-ctrl">'
//	+ '<div class="ui-promptBox-frame required error"><div class="ui-promptBox-layout"><div class="ui-promptBox-inputframe">'
//	+ '<input type="hidden" id="attenceGroup_el" name="hidd_name_attenceGroup" value="">'
//	+ '<input id="attenceGroup" name="attenceGroup" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title="">'
//	+ '</div><div class="ui-promptBox-icon"><img style="cursor:pointer;" src="/shr/styles/images/seniorf7.png"></div></div></div>'
//
//		+ '	<label for="attenceGroup" generated="true" class="error" style="display: block;">必录字段</label></div>'
//			+ '<div class="col-lg-2 field-desc"></div>'
//		+ '</div>'
//		
//  + '	</div>';
  
		 var row_fields_work ='<div class="row-fluid row-block flex-r" id="">'
 
// +'<div class="row-fluid row-block " id="">'
//		
//	+'	<div data-ctrlrole="labelContainer">'
//		+'	<div class="col-lg-4">'
//			+'	<div class="field_label" title="后延排班">后延排班</div>'
//		+'	</div>				'
//		+'	<div class="col-lg-6 field-ctrl">'
//	+'<div class="icheckbox_minimal-grey" style="position: relative;"><input type="checkbox" id="putOff" name="putOff" value="1" dataextenal="" style="position: absolute; top: -20%; left: -20%;' +'display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"><ins class="iCheck-helper" style="position: absolute; top: -20%;' +'left: -20%; display: block; width: 140%; height: 140%; margin: 0px; padding: 0px; background: rgb(255, 255, 255); border: 0px; opacity: 0;"></ins></div> <span></span>'
//	
//		+'	</div>'
//			+'<div class="col-lg-2 field-desc"></div>'
//	+'	</div>'
//		
//	+'<div class="col-lg-12"></div>'
//  +'	</div>'
// 
// 
//		+'<div class="row-fluid row-block " id="">'
//		+ '<div data-ctrlrole="labelContainer">'
//			+ '<div class="col-lg-4">'
//			+ '	<div class="field_label" title="轮班规则">轮班规则</div>'
//			+ '</div>'				
//			+ '<div class="col-lg-6 field-ctrl">'
//	+ '<div style="position: relative;"><input id="turnShift" name="turnShift" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title=""></div>'
//	
//			+ '</div>'
//			+ '<div class="col-lg-2 field-desc"></div>'
//		+ '</div>'
		
		
		+ '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
			+ '<div class="col-lg-24">'
			+ '	<div class="field_label" title="'
			 + jsBizMultLan.atsManager_turnGroupShiftList_i18n_16
			 + '">'
			 + jsBizMultLan.atsManager_turnGroupShiftList_i18n_15
			 + '</div>'
			+ '</div>'				
			+ '<div class="col-lg-20 field-ctrl" id="segment">'
	+ '<div class="ui-text-frame valid" id="segments" style="background-color:#D9EDF7"><input  id="TextNum" required="true"  value ="1" readonly="readonly" type="text" name="TextNum" ctrlrole="text"   validate="{required:true}"/></div>'	
			+ '</div>'
		+ '</div>'
		
  	+ '</div>'
	
	+'<div class="row-fluid row-block flex-r" id="">'
		
		+ '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
			+ '<div class="col-lg-24">'
			+ '	<div class="field_label" title="'
			 + jsBizMultLan.atsManager_turnGroupShiftList_i18n_16
			 + '">'
			 + jsBizMultLan.atsManager_turnGroupShiftList_i18n_11
			 + '</div>'
			+ '</div>'				
			+ '<div class="col-lg-20 field-ctrl">'
	+ '<div style="position: relative;" ><input name="beginDate" id="beginDate"  class="input-height cell-input"/></div>'
			+ '</div>'
		+ '</div>'
		
		
		+ '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
			+ '<div class="col-lg-24">'
			+ '	<div class="field_label" title="'
			 + jsBizMultLan.atsManager_turnGroupShiftList_i18n_16
			 + '">'
			 + jsBizMultLan.atsManager_turnGroupShiftList_i18n_8
			 + '</div>'
			+ '</div>'				
			+ '<div class="col-lg-20 field-ctrl" >'
	+ '<div style="position: relative;" ><input name="endDate" id="endDate" class="input-height cell-input"/></div>'
			+ '</div>'
		+ '</div>'	
  	+ '</div>'
	+'<div class="row-fluid row-block flex-r" id="">'
		
		+ '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
			+ '<div class="col-lg-24">'
			+ '	<div class="field_label" title="'
			 + jsBizMultLan.atsManager_turnGroupShiftList_i18n_16
			 + '">'
			 + jsBizMultLan.atsManager_turnGroupShiftList_i18n_7
			 + '</div>'
			+ '</div>'				
			+ '<div class="col-lg-20 field-ctrl">'
	+ '<div style="position: relative;" ><input name="holidayHandle" class="input-height cell-input"/></div>'
	
			+ '</div>'
		+ '</div>'
		+ '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
			+ '<div class="col-lg-24">'
			+ '	<div class="field_label" title="'
			 + jsBizMultLan.atsManager_turnGroupShiftList_i18n_16
			 + '">'
			 + jsBizMultLan.atsManager_turnGroupShiftList_i18n_5
			 + '</div>'
			+ '</div>'				
			+ '<div class="col-lg-20 field-ctrl">'
	+ '<div style="position: relative;" ><input name="workCalendar" class="input-height cell-input"/></div>'
	
			+ '</div>'
		+ '</div>'
		
		+ '</div>'
  	+ '</div>';
		$('#turnShiftMainInfo').append(row_fields_work);
		$('#turnShiftMainInfo').css("width","100%");
//	    $("#turnShiftInfoDetail").find("h5").css("font-size", "14px");
		that.turnShiftInfo();
////		//初始化时,设置行政turnShift传入业务组织hrOrgUnit的值
////		var hrOrgUnitObj = shr.getUrlRequestParam("hrOrgUnitObj");
////		$('#hrOrgUnit_el').val(JSON.parse(hrOrgUnitObj).id);//行政组织Id
////		$('#hrOrgUnit').val(JSON.parse(hrOrgUnitObj).name);//行政组织name
//		$('#beginDate').shrPromptBox('disable');
		 $("#putOff").bind("change", function(){
		 var putOff = $("#putOff").is(":checked");
		 if(!putOff){
		 $("input[name=TextNum]").removeAttr("disabled");
		$("#segments").css("background-color", "#D9EDF7");
		 $("#turnShift").shrPromptBox("enable");
		 $("#beginDate").shrDateTimePicker("enable");
	
		 }else{
		 $("#segments").css("background-color", "rgb(235, 235, 228)");
		$("input[name=TextNum]").attr("disabled", "disabled");
		 $("#turnShift").shrPromptBox("disable");
		 $("#beginDate").shrDateTimePicker("disable");
	
		 }
		 
		 });
		 $("#attenceGroup").parent().css({position:"relative"});
		$("#attenceGroup").bind("change", function(){
		  $("#zdyShow").each(function(index,ele){
			(ele).remove();	
		})
		var title=$("#attenceGroup").attr("title");
		$("#attenceGroup").attr("title","");
		$("#attenceGroup").each(function(index,ele){
		$(ele).after('<span id="zdyShows"><span class="tips">'+title+'</span></span>');
			
		})
		$("#zdyShows .tips").hide();
		$("#attenceGroup").each(function(index,ele){
			$(ele).mouseover(function(){
				$("#zdyShows .tips").eq(index).show()
			})
			$(ele).mouseleave(function(){
				$("#zdyShows .tips").eq(index).hide()
			})
		})
		  	
		  });
		 $('#hrOrgUnit').bind('change',function(){
		 	var hrOrgUnitId=$("#hrOrgUnit_el").val();
		 	$.ajax({
				url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsGroupShiftListHandler&method=getWorkCalendar",
				data: {hrOrgUnitId:hrOrgUnitId},
				dataType:'json',
				type: "POST",
				cache: false,
				success: function(res) {
					info =  res;
					if(res.workCalendarId && res.workCalendarName){
					$("#workCalendar_el").val(res.workCalendarId);
					$("#workCalendar").val(res.workCalendarName);
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					
				}
		 });		
		});
//		$('[title="后延排班"]').attr('title', '勾选时，在已排班的最大排班日期的基础上后延排班到结束日期。');
//		$('[title="后延排班"]').attr('id', 'workShiftSources');
		that.initFd();
		that.initPersonFy();
	}
	
		/*
	 * 当点击【轮班规则新增按钮】时，公共区域才会出现
	 */
	,turnShiftInfo:function(){
		var _self = this;
		var hrorgunits = $("#hrOrgUnit_el").val();
	   	//【轮班规则】组装F7回调式对话框	 
//	    var grid_f7_json = {id:"turnShift",name:"turnShift"};
//		grid_f7_json.subWidgetName = 'shrPromptGrid';
//		
//		grid_f7_json.subWidgetOptions = {title:"轮班规则",uipk:"com.kingdee.eas.hr.ats.app.AtsTurnShift.AvailableList.F7",query:""};
//		grid_f7_json.validate = '{required:true}';
//		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
//		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrorgunits ;		
//		grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,alias: jsBizMultLan.atsManager_turnGroupShiftList_i18n_26,widgetType: 'checkbox'}];
//		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
//		grid_f7_json.subWidgetName = 'specialPromptGrid';
//		
//		var objects = $('input[name="turnShift"]');
//		objects.shrPromptBox(grid_f7_json);
//		objects.shrPromptBox("setBizFilterFieldsValues",hrorgunits);
		
		var grid_f7_json = {id:"workCalendar",name:"workCalendar"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_turnGroupShiftList_i18n_5,uipk:"com.kingdee.eas.hr.ats.app.WorkCalendar.AvailableList.F7",query:""};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrorgunits ;
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_turnGroupShiftList_i18n_26,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		
		var objec= $('input[name="workCalendar"]');
		objec.shrPromptBox(grid_f7_json);
		objec.shrPromptBox("setBizFilterFieldsValues",hrorgunits);
	  	$("#hrOrgUnit").bind("change", function(){
	  	var hrorgunit = $("#hrOrgUnit_el").val();
	   	//【轮班规则】组装F7回调式对话框	 
//	    var grid_f7_json = {id:"turnShift",name:"turnShift"};
//		grid_f7_json.subWidgetName = 'shrPromptGrid';
//		
//		grid_f7_json.subWidgetOptions = {title:"轮班规则",uipk:"com.kingdee.eas.hr.ats.app.AtsTurnShift.AvailableList.F7",query:""};
//		grid_f7_json.validate = '{required:true}';
//		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
//		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrorgunit ;		
//		grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,alias: jsBizMultLan.atsManager_turnGroupShiftList_i18n_26,widgetType: 'checkbox'}];
//		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
//		grid_f7_json.subWidgetName = 'specialPromptGrid';
//		
		var object = $('input[name="turnShift"]');
//		object.shrPromptBox(grid_f7_json);
//		object.shrPromptBox("setBizFilterFieldsValues",hrorgunit);
		
		var grid_f7_json = {id:"workCalendar",name:"workCalendar"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_turnGroupShiftList_i18n_5,uipk:"com.kingdee.eas.hr.ats.app.WorkCalendar.AvailableList.F7",query:""};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrorgunit ;
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_turnGroupShiftList_i18n_26,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		
		var objectss = $('input[name="workCalendar"]');
		objectss.shrPromptBox(grid_f7_json);
		objectss.shrPromptBox("setBizFilterFieldsValues",hrorgunit);
       //由于在获取F7选择的信息时，要查出对应的班次明细表，所以绑定事件
		object.bind("change", function(){
			var info = object.shrPromptBox('getValue');
			if(info != null && info.id != null && info.id.length > 0){
				$.ajax({
						url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsTurnShiftEditHandler&method=getItemsJson",
						data: {id:info.id},
						dataType:'json',
					    type: "POST",
						beforeSend: function(){
							openLoader(1);
						},
						success: function(rst){
							$('#turnShiftEntryInfo').empty();
							//得到最大的值
							if(rst.records!= null && rst.records>0 && rst.rows!=null && rst.rows.length>0){
								var defaultShift_number,defaultShift_name,remark,workTime,dateType_key,dateType_value;
	  							for(var i=1;i<=rst.rows.length;i++){
									row = rst.rows[i-1];
									id = row["id"],defaultShift_id=row["defaultShift_id"],defaultShift_number=row["defaultShift_number"],
									defaultShift_name = row["defaultShift_name"],workTime = row["workTime"],
									dateType_key = row["type.key"],dateType_value = row["type.value"];
									_self.addTurnShiftInfoDetail(i,dateType_key,defaultShift_number,defaultShift_name,workTime);
	  							}
	  							$('#segment').off();
								$('#segment').empty();
								//组装NumberSpinner
								var options = {  
              						maxValue: rst.rows[rst.rows.length - 1].segment,  
               						minValue: 1,  
               						defValue: 1,  
            						txtWidth: 100 
          						};  
         						$.fineTuning.addTxt($("#segment"),options); 
         						$("input[name=TextNum]").css("width", "82%");
         						$('#turnShiftEntryInfo').attr("maxSegment", options.maxValue);
//         						$("input[name=TextNum]").attr("disabled",true)
							}
						},
						error: function(){
							closeLoader();
						},
						complete: function(){
							closeLoader();
						}
				   		
					});
			}
		});
		});
       
        //【开始日期】	
		$('input[name="beginDate"]').shrDateTimePicker({
					id : "beginDate",
					tagClass : 'block-father input-height',
					readonly : '',
					yearRange : '',
					ctrlType: "Date",
					isAutoTimeZoneTrans:false,
					validate : '{dateISO:true,required:true}'
		});
		
	    //【结束日期】
	   $('input[name="endDate"]').shrDateTimePicker({
					id : "endDate",
					tagClass : 'block-father input-height',
					readonly : '',
					yearRange : '',
					ctrlType: "Date",
					isAutoTimeZoneTrans:false,
					validate : '{dateISO:true,required:true}'
		});
		
		//组装下拉框--输入框节假日处理
		var segment = { id:"holidayHandle",
	    			    readonly: "",
	    				value: "1", //设置默认值
					 	onChange: null,
						validate: "{required:true}",
						filter: ""
	    				};
	    					
		segment.data = [{value:"1",alias:jsBizMultLan.atsManager_turnGroupShiftList_i18n_22},
		                {value:"2",alias:jsBizMultLan.atsManager_turnGroupShiftList_i18n_24},
		                {value:"3",alias:jsBizMultLan.atsManager_turnGroupShiftList_i18n_3}]
    	$('input[name="holidayHandle"]').shrSelect(segment); 
    	
    	var explain = [];
		explain.push('<div id="popTips_1" class="popTips">'
            + jsBizMultLan.atsManager_turnGroupShiftList_i18n_23
			+ '</div>');
  
		explain.push('<div id="popTips_2" class="popTips">'
			+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_25
			+ '</div>');

		explain.push('<div id="popTips_3" class="popTips">'
			+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_4
			+ '</div>');
  
		//获取div的位置
//		var offset = $('#holidayHandle').offset();
//		//创建弹出浮层，定位在div的位置
//		var tips = $(explain.join("")).css("top",offset.top).css("left",offset.left + 200);
//		//弹出浮层
//		$('#holidayHandle_down').append(tips);
//		
//		$('div[id^="popTips_"]').attr('style','top:' + offset.top + 'px !important').css("left",offset.left + 200);

		$('ul[id="holidayHandle_down"] li').hover(function(event) { 
	 			$('div[id="popTips_' + $(this).val() + '"]').show('fast');
		},function() { 
	 			$('div[id="popTips_' + $(this).val() + '"]').hide();
		});
		var nowdays = new Date();
    	var year = nowdays.getFullYear();
   		var month = nowdays.getMonth()+1;
   		if(month==12) {
			month="01";
			year=year+1;
    	} else if (month < 10) {
			month=month+1;
			month = "0" + month;
    	} else if(12>month >= 10){
			month=month+1;
    	}
    	var firstDay = year + "-" + month + "-" + "01";//下个月的第一天
    	var myDate = new Date(year, month, 0);
    	var lastDay = year + "-" + month + "-" + myDate.getDate();//上个月的最后一
        atsMlUtile.setTransDateValue("beginDate", firstDay);
        atsMlUtile.setTransDateValue("endDate", lastDay);

	},initPersonFy:function(){
		var s=$("#turnShiftCommon").find(".field_label").eq(0);
//		s.overflow="inherit";
		s.css({overflow:"inherit"});
		$("#personFy").each(function(index,ele){
			(ele).remove();	
		})
		
		s.each(function(index,ele){
		$(ele).append('<span id="personFy"><span style="font-size: 12px;font-weight: 500;"  class="more">?<span class="tips">'
			+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_6
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
	,initFd:function(){
		var explain = [];
			explain.push('<div id="popTips_1" class="popTips">'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_23
				+ '</div>');
			explain.push('<div id="popTips_2" class="popTips">'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_25
				+ '</div>');
			explain.push('<div id="popTips_3" class="popTips">'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_4
				+ '</div>');
			//获取div的位置
			var targetObj=$("#holidayHandle");
			var offset = targetObj.offset();
			var targetWidth  = targetObj.width() + 24;
			var downId = '#' + targetObj.attr("id") + '_down';
			$(downId,targetObj.context).css("overflow-y","visible");//样式bug
			$(downId,targetObj.context).append($(explain.join("")));
			$('div[id^="popTips_"]',targetObj.context).css("left", offset.left + targetWidth);
			$(downId + ' li',targetObj.context).hover(function(event) {
				$('div[id="popTips_' + $(this).data("value") + '"]',targetObj.context).show('fast').css("top",$(this).offset().top);
			}, function() {
				$('div[id="popTips_' + $(this).data("value") + '"]',targetObj.context).hide();
			});
	},
	/*
	 * 说明：不管是日历排班还是列表排表都要用到公用的轮班信息
	 */
	addTurnShiftInfoDetail:function(i,dateType_value,defaultShift_number,defaultShift_name,workTime){
		var  row_fields_work = '';
		if(i == 1){
			row_fields_work =  '<div style="padding-top:15px;" class="row-fluid row-block row_field flex-r">'
				+ '<div class="spanSelf_01"><div class="field_label" title="'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_27
				+ '"  style="width:40px;">'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_27
				+ '</div></div>'
				+ '<div class="spanSelf_02"><div class="field_label" title="'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_20
				+ '">'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_20
				+ '</div></div>'
				+ '<div class="spanSelf_03"><div class="field_label" title="'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_1
				+ '">'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_1
				+ '</div></div>'
				+ '<div class="spanSelf_04"><div class="field_label" title="'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_2
				+ '">'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_0
				+ '</div></div>'
				+ '<div class="spanSelf_05"><div class="field_label" title="'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_21
				+ '">'
				+ jsBizMultLan.atsManager_turnGroupShiftList_i18n_21
				+ '</div></div>'
	  	 	+ '</div>';
	  	 	$('#turnShiftEntryInfo').append(row_fields_work);
		}
	  	row_fields_work =  '<div class="row-fluid row-block row_field flex-r">'
							+ '<div class="spanSelf_01"><div class="field_label" >' + correctValue(i) + '</div></div>'
							
							+ '<div class="spanSelf_02"><div class="field_label">' + correctValue(dateType_value) + '</div></div>'
							
							+ '<div class="spanSelf_03"><div class="field_label">' + correctValue(defaultShift_number) + '</div></div>'

							+ '<div class="spanSelf_04"><div class="field_label">' + correctValue(defaultShift_name) + '</div></div>'
						
							+ '<div class="spanSelf_05"><div class="field_label">' + correctValue(workTime) + '</div></div>'
							
						+ '</div>';
		$('#turnShiftEntryInfo').append(row_fields_work);
	},
	selectOkAction:function(){
		var turnShiftName = $('input[name="turnShift"]').val();
		if(turnShiftName.length < 1){
			shr.showWarning({message: jsBizMultLan.atsManager_turnGroupShiftList_i18n_19});
			return;
		}
		var strBeginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		if(strBeginDate.length < 1){
			shr.showWarning({message: jsBizMultLan.atsManager_turnGroupShiftList_i18n_18});
			return;
		}
		
		var strEndDate = atsMlUtile.getFieldOriginalValue("endDate");
		if(strEndDate.length < 1){
			shr.showWarning({message: jsBizMultLan.atsManager_turnGroupShiftList_i18n_17});
			return;
		}
		var beginDate = new Date(strBeginDate.replace(/-/g, "/"));
		var reBeginDate = new Date(strBeginDate.replace(/-/g, "/"));
		var endDate  = new Date(strEndDate.replace(/-/g, "/"));
		
		reBeginDate.setMonth(reBeginDate.getMonth() + 1);
		var leftsecond = endDate.getTime() - beginDate.getTime();
		var rightsecond = reBeginDate.getTime() - beginDate.getTime();
		

		if(beginDate.getTime() > beginDate.getTime()){
			shr.showWarning({message: jsBizMultLan.atsManager_turnGroupShiftList_i18n_12});
			return;
		}
		else if(leftsecond  > rightsecond){
			shr.showWarning({message: jsBizMultLan.atsManager_turnGroupShiftList_i18n_14});
			return;
		}
		else{
			//nothing
		}
		
	   var flag = $.getUrlParam('flag');
	   var firstBeginDate = $.getUrlParam('firstBeginDate');
	   var firstBegin = new Date(firstBeginDate.replace(/-/g, "/"));
	   var firstEndDate = $.getUrlParam('firstEndDate');
	   var firstEnd = new Date(firstEndDate.replace(/-/g, "/"));
	   var policyId = $.getUrlParam('policyId');
	   var noShift = $.getUrlParam('noShift');
	   var personIds = window.localStorage? localStorage.getItem("shiftPersonIds"): Cookie.read("shiftPersonIds");
	   var personIdAndRowNum = window.localStorage? localStorage.getItem("shiftPersonIdAndRowNum"): Cookie.read("shiftPersonIdAndRowNum");
	
	   /*
	    * 选择的开始日期比传递进来的开始日期要大，结束日期小
	    */
	   if(beginDate.getTime() < firstBegin.getTime()){
	   		shr.showWarning({message: jsBizMultLan.atsManager_turnGroupShiftList_i18n_13  + firstBeginDate});
			return;
	   }
	   else if(beginDate.getTime() > firstEnd.getTime()){
	   		shr.showWarning({message: jsBizMultLan.atsManager_turnGroupShiftList_i18n_9  + firstEndDate});
			return;
	   }
	   else if(endDate.getTime() < firstBegin.getTime()){
	   		shr.showWarning({message: jsBizMultLan.atsManager_turnGroupShiftList_i18n_10  + firstBeginDate});
			return;
	   }
	   else if(endDate.getTime() > firstEnd.getTime()){
	   		shr.showWarning({message: jsBizMultLan.atsManager_turnGroupShiftList_i18n_9  + firstEndDate});
			return;
	   }
	   else{
	   	//nothing
	   }
	   /*
	    * 选择的结束日期比传递进来的开始日期要大，结束日期小
	    */
       if("1" == noShift){
       	 shr.doAjax({
					url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CalendarShiftHandler&method=getShiftByDateForNoShift",
					data: {
						beginDate :strBeginDate,
						endDate :strEndDate,
						turnShift:$('#turnShift_el').val(),
						textNum: $('input[name="TextNum"]').val(),
						holidayHandle:$('#holidayHandle_el').val(),
						policyId: policyId,
						noShift: noShift,
						personIds: personIds,
						personIdAndRowNum: personIdAndRowNum
					},
					
					dataType:'json',
					type: "POST",
					cache: false,
					success: function(data) {
						 if("list" == flag){
							var beginCol = parseInt((beginDate.getTime() - firstBegin.getTime())/(1 * 24 * 60 * 60 * 1000));
							var endCol = parseInt((endDate.getTime() - firstBegin.getTime())/(1 * 24 * 60 * 60 * 1000));
							window.parent.closeListFrameDlgForNoShift('iframe1',data.rows,beginCol + 4,endCol + 4);
						  }
					}
			})
		   
       }else{
           shr.doAjax({
					url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CalendarShiftHandler&method=getShiftByDate",
					data: {
						beginDate :strBeginDate,
						endDate :strEndDate,
						turnShift:$('#turnShift_el').val(),
						textNum: $('input[name="TextNum"]').val(),
						holidayHandle:$('#holidayHandle_el').val(),
						policyId: policyId
					},
					
					dataType:'json',
					type: "POST",
					cache: false,
					success: function(data) {
						if("calendar" == flag)  {
							window.parent.closeCalendarFrameDlg('iframe1',data.rows);
						}
						else if("list" == flag){
						
							var beginCol = parseInt((beginDate.getTime() - firstBegin.getTime())/(1 * 24 * 60 * 60 * 1000));
							var endCol = parseInt((endDate.getTime() - firstBegin.getTime())/(1 * 24 * 60 * 60 * 1000));
							window.parent.closeListFrameDlg('iframe1',data.rows,beginCol + 4,endCol + 4);
						}
						else{
	
						}
					}
			})
       }
	}

	
	

});
function correctValue(value){
	if(value == undefined || value == null){
		return "";
	}
	else{
		return value;
	}
}
