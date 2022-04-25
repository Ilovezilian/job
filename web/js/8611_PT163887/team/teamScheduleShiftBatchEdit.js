shr.defineClass("shr.ats.team.TeamScheduleShiftBatchEdit", shr.framework.Edit, {
	attendDate : "",
	endDate : "",
	defaultShiftId : "",
	filter1 : "",
	filter2 : "",
	filter3 : "",
	filter4 : "",
	filter5 : "",
	initalizeDOM:function(){
		shr.ats.team.TeamScheduleShiftBatchEdit.superClass.initalizeDOM.call(this);
		var that = this;
		that.initEditGrid();
		that.initAddtendDateDom();//生成并初始化排班时间按钮
		that.processF7ChangeEvent();
		that.myExtendValidate();
		that.setPersonValue();
		
		//带出默认的班次that.setDefaultShift();
	}
	,initAddtendDateDom: function(){//生成并初始化排班时间按钮
		var that = this;
		var startDateHtml =  '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
			+ '<div class="label-ctrl flex-cc">'
			+	'<div class="field-label" title="'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_21
			+ '">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_21
			+ '</div>'
			+	'<div class="field-desc"></div>'
			+ '</div>'				
			+ '<div class="field-ctrl flex-c">'
	        + '<div class="ui-text-frame" style="border:0px;"><input id="attendDate" class="block-father input-height" type="text" name="attendDate" validate="" '+'value="" placeholder="" dataextenal="" ctrlrole="text" style="position: relative;"></div>'
			+	'</div>'
			
			+ '</div>"';
		var endDateHtml =  '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
			+ '<div class="label-ctrl flex-cc">'
			+	'<div class="field-label" title="'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_19
			+ '">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_19
			+ '</div>'
			+	'<div class="field-desc"></div>'
			+ '</div>'				
			+ '<div class="field-ctrl flex-c">'
	        + '<div class="ui-text-frame" style="border:0px;"><input id="endDate" class="block-father input-height" type="text" name="endDate" validate="" '+'value="" placeholder="" dataextenal="" ctrlrole="text" style="position: relative;"></div>'
			+	'</div>'
			
			+ '</div>"';		
		var personHtml =  '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
			+ '<div class="label-ctrl flex-cc">'
			+	'<div class="field-label" title="'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_37
			+ '">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_37
			+ '</div>'
			+	'<div class="field-desc"></div>'
			+ '</div>'				
			+ '<div class="field-ctrl flex-c">'
	        + '<div id="personSelect"><input id="proposer" name="proposer" class="block-father input-height" type="text" name="endDate" validate="" '+'value="" placeholder="" dataextenal="" ></div>'
			+	'</div>'
			
			+ '</div>"';
		var divLabelObj = $(endDateHtml);
		divLabelObj.insertBefore($('#form div')[0]);
		$(startDateHtml).insertBefore($('#form div')[0]);
		$(personHtml).insertAfter($('#form').children()[5].children[0].children[1]);
		
		//为考勤开始日期、考勤结束日期增加F7控件 触发的动作
		that.addDatepick("attendDate");
		that.addDatepick("endDate");
		
		$($('#form div[class="row-fluid row-block "]')[0]).attr('id','shift_name');
		$('#shift_name div:eq(0)').attr('style','margin-top:0px !important;');
		
		$($('#form div[class="row-fluid row-block "]')[2]).attr('id','shift_line2');
		$('#shift_line2').attr('style','margin-top:10px !important;');
		
		//【姓名】
		var grid_f7_json = {id : "proposer"  ,name:"proposer"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		var proposerObject = $('input[name="proposer"]');
		grid_f7_json.subWidgetOptions = {
			title : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_37,
			uipk : "com.kingdee.eas.hr.ats.app.team.ExistFileForAdmin.F7",
			query : "",
			multiselect:true
		};
		grid_f7_json.validate = '{required:false}';
		proposerObject.shrPromptBox(grid_f7_json);
		
		$("#hrOrgUnit").shrPromptBox("option", {
			onchange : function(e, value) {
				var info = value.current;
				if(info != undefined && info.length > 0){
					var hrOrgUnitIds = "";
					for(var i=0; i<info.length; i++){
						hrOrgUnitIds += "'"+info[i].id+"',";
					}
					that.filter5 = " and hrOrgUnit.id in ("+hrOrgUnitIds.substring(0,hrOrgUnitIds.length-1)+")";
					$("#proposer").shrPromptBox("setFilter",that.filter1 + that.filter2 + that.filter3 +that.filter4 + that.filter5);
				}
			}
		});
	}
	,addDatepick: function(id){
		var that = this;
		var picker_json = {id:id};
		picker_json.tagClass = 'block-father input-height';
		picker_json.readonly = '';
		picker_json.yearRange = '';
		picker_json.validate = '{dateISO:true,required:true}';
		picker_json.ctrlType= "Date";
		picker_json.isAutoTimeZoneTrans=false;
		picker_json.onChange = function(){
			$('label[for='+id+']').remove();
			that.validDate(that);
		};
		$("#" + id).shrDateTimePicker(picker_json);
	}
	,setPersonValue : function(){
		var that = this;
		var urlAttendDate = $.getUrlParam('attendDate');

		if(urlAttendDate == undefined || urlAttendDate == "" || urlAttendDate.trim().length == 0){
			return;
		}
		else{
			//从考勤档案过来的时候，并且选中了横向排班某一行的时候。
			$('#attendDate').unbind();
			//$('#attendDate').parent().parent().parent().removeClass("required");
			//$('#attendDate').parent().next().hide();
			$('#attendDate').attr("readonly","readonly");
			$('#endDate').attr("readonly","readonly");
			
			//$('#defaultShift').parent().parent().parent().removeClass("required");
			//$('#defaultShift').parent().next().hide();
			$('#defaultShift').attr("readonly","readonly");
			
			//$("#AdminOrgUnit").parent().next().hide();
			//$("#proposer").parent().next().hide();
			$('#AdminOrgUnit').attr("readonly","readonly");
			$('#proposer').attr("readonly","readonly");
			
			//$('#attendDate').val(decodeURIComponent(urlAttendDate));
			$('#attendDate').shrDateTimePicker("setValue", urlAttendDate, 'yyyy-MM-dd');
			$('#endDate').shrDateTimePicker("setValue", urlAttendDate, 'yyyy-MM-dd')
		}
		
		var urlDefaultShiftId = $.getUrlParam('defaultShiftId');
		var defaultShiftName = $.getUrlParam('defaultShiftName');

		if(urlDefaultShiftId == undefined || urlDefaultShiftId == "" || urlDefaultShiftId.trim().length == 0){
		}
		else{
			$('#defaultShift_el').val(decodeURIComponent(urlDefaultShiftId));
			$('#defaultShift').val(decodeURIComponent(defaultShiftName));
			that.setDefaultShift(decodeURIComponent(urlDefaultShiftId));
		}
		
		var adminOrgUnitId = $.getUrlParam('adminOrgUnitId');
		var displayName = $.getUrlParam('displayName');
		if(adminOrgUnitId == undefined || adminOrgUnitId == "" || adminOrgUnitId.trim().lenght == 0){
		}
		else{
			//$('#AdminOrgUnit').val(decodeURIComponent(displayName));
			//$('#AdminOrgUnit_el').val(decodeURIComponent(adminOrgUnitId));
			$("#AdminOrgUnit").shrPromptBox("setValue", {"id" : adminOrgUnitId, "name" : decodeURIComponent(displayName)});
		}
		
		var hrOrgUnitId = $.getUrlParam('hrOrgUnitId');
		var hrOrgUnitName = $.getUrlParam('hrOrgUnitName');
		if(hrOrgUnitId != undefined || hrOrgUnitId != "" || hrOrgUnitId.trim().lenght != 0){
			$("#hrOrgUnit").shrPromptBox("setValue", {"id" : hrOrgUnitId, "name" : decodeURIComponent(hrOrgUnitName)});
		}
		
		var personId = $.getUrlParam('personId');
		var personName = $.getUrlParam('personName');
		if(personId == undefined || personId == "" || personId.trim().length == 0){
		}
		else{
			$("#proposer").shrPromptBox("setValue", {"id" : decodeURIComponent(personId), "name" : decodeURIComponent(personName)});
		}
		
	}
	,validDate: function(sour){
		var that = sour;
		that.attendDate = atsMlUtile.getFieldOriginalValue('attendDate');
		that.endDate = atsMlUtile.getFieldOriginalValue('endDate');
		
		$('label[for="endDate"]').remove();
		if(that.attendDate == "" || that.attendDate.length == 0 || that.endDate.length == 0 || that.endDate == ""){
			return;
		}
		if(that.attendDate.length > 0 && that.endDate.length > 0){
			var attendDateVal = new Date(Date.parse(that.attendDate));
			var endDateVal = new Date(Date.parse(that.endDate));
			if(endDateVal.getTime() < attendDateVal.getTime()){				
				var err = "<label for='endDate' class='error' style='display:block;'>"
					+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_20
					+ "</label>";
				$('#endDate').parent().parent().parent().parent().after(err);
				return;
			}
		}
		
		that.filter1 = " scheduleShift.attendDate >= '" + that.attendDate + "'" ;
		that.filter4 = " and scheduleShift.attendDate <= '" + that.endDate + "'" ;
		//初始化字段名列表
		$('#itemInfo').empty();
		that.initEditGrid();
	
		if($("#defaultShift_el").val()){
			that.defaultShiftId = "";
			$("#defaultShift").shrPromptBox("setValue",null);
		}
			
		 $.ajax({
				url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftBatchEditHander&method=getAtsShift",
				data: {attendDate:that.attendDate,endDate:that.endDate},
				dataType:'json',
				type: "POST",
				beforeSend: function(){
					openLoader(1);
				},
				success: function(msg){
					if(msg.fnumber){
						$('#defaultShift').shrPromptBox("setFilter"," number in(" + msg.fnumber + ")");
					}
					else{
						$('#defaultShift').shrPromptBox("setFilter","1=2");
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
	,processF7ChangeEvent : function(){
		var that = this;
		//考勤日期
		atsMlUtile.setTransDateTimeValue('attendDate','');
		atsMlUtile.setTransDateTimeValue('endDate','');
		
		$("#defaultShift").shrPromptBox("option", {
			onchange : function(e, value) {
				 if(that.attendDate == "" || that.attendDate.length < 1 || that.endDate == "" || that.endDate.length < 1){
			  	    if(shr.getUrlRequestParam("uipk") !="com.kingdee.eas.hr.ats.team.ScheduleShiftItemModify"){
			  	    shiftObject.shrPromptBox('setValue',null);
			  		shr.showWarning({message: jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_24});
			  	    }
				 }
				var attendDateVal = new Date(Date.parse(that.attendDate));
				var endDateVal = new Date(Date.parse(that.endDate));
				if(endDateVal.getTime() < attendDateVal.getTime()){
					if(shr.getUrlRequestParam("uipk") !="com.kingdee.eas.hr.ats.team.ScheduleShiftItemModify"){
					shiftObject.shrPromptBox('setValue',null);
					shr.showWarning({message: jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_20});
					 }
				}
				 else{ 
				  	var info =  value.current;
				   	if(info != null && info.id !=null && info.id!=''){
				   		that.defaultShiftId = info.id;
				   		that.filter2 = " and scheduleShift.defaultShift.id ='" + info.id + "' ";
				   		
				   		if($("#AdminOrgUnit_el").val()){
				   			$("#AdminOrgUnit").shrPromptBox("setValue",null);
				   		}
				   		if($("#proposer_el").val()){
				   			$("#proposer").shrPromptBox("setValue",null);
				   		}
				   		$('#proposer').shrPromptBox("setFilter",that.filter1 + that.filter2 + that.filter3 + that.filter4 + that.filter5);
				   		//动态改变段次信息
						that.setDefaultShift(info.id);
				   		$.ajax({
							url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftBatchEditHander&method=getOrgUnit",
							data: {attendDate:that.attendDate,endDate:that.endDate,defaultShiftId:that.defaultShiftId},
							dataType:'json',
						    type: "POST",
							beforeSend: function(){
								openLoader(1);
							},
							success: function(msg){
								if(msg.fnumber){
									$('#AdminOrgUnit').shrPromptBox("setFilter", " number in(" + msg.fnumber + ")");
									var defaultAdminOrgUnit = msg.defaultAdminOrgUnit;
									var defaultValueArr = [];
									var defauleValue = {"id" : defaultAdminOrgUnit.split(",")[0], "name" : defaultAdminOrgUnit.split(",")[1], "longNumber" : defaultAdminOrgUnit.split(",")[2]}
									defaultValueArr.push(defauleValue);
									$('#AdminOrgUnit').shrPromptBox("setValue",defaultValueArr);
								}
								else{
									$('#AdminOrgUnit').shrPromptBox("setFilter","1=2");
									var defaultAdminOrgUnit = msg.defaultAdminOrgUnit;
									var defauleValueArr = [];
									var defalueValue = {"id" : defaultAdminOrgUnit.split(",")[0], "name" : defaultAdminOrgUnit.split(",")[1], "longNumber" : defaultAdminOrgUnit.split(",")[2]};
									defauleValueArr.push(defalueValue);
									$('#AdminOrgUnit').shrPromptBox("setValue",defauleValueArr);
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
				 }
			}	 
		});
		
		//行政组织
		$("#AdminOrgUnit").shrPromptBox("option", {
			onchange : function(e, value) {
				if(that.defaultShiftId == null || that.defaultShiftId == undefined || that.defaultShiftId.length < 1){
					var workArea = that.getWorkarea(),
					$form = $('form', workArea);
					var flag = $form.valid();
					if(!flag){
						return;
					}
				}
			  	else{
				 	$("#proposer").shrPromptBox("setValue",null);
				  	var info =  value.current;
				   	if(info && info.length>0){
				   		that.filter3 = " and ( ";
				   		for(var i=0;i<info.length;i++){
				   		    if(info[i].id){
				   		       that.filter3 += " (adminOrgUnit.longNumber = '" + info[i].longNumber + "' or  adminOrgUnit.longNumber like '" + info[i].longNumber + "!%')";
				   		       if(i!=info.length-1){
				   		          that.filter3 += " or ";
				   		       }
				   		    }
				   		}
				   		that.filter3 += " )";
				   		$('#proposer').shrPromptBox("setFilter",that.filter1 + that.filter2 + that.filter3 + that.filter4 + that.filter5);
				    }
				    else{
				    	that.filter3 = "";
				    	$('#proposer').shrPromptBox("setFilter","1=2");
				    }
			    }
			}
		});
		
		
		//人员
		$("#proposer").shrPromptBox("option", {
			onchange : function(e, value) {
				if( that.attendDate == null || that.attendDate == undefined || that.attendDate.length < 1 ){
					var workArea = that.getWorkarea(),
					$form = $('form', workArea);
					var flag = $form.valid();
					if(!flag){
						return;
					}
				}
				if(that.defaultShiftId == null || that.defaultShiftId == undefined || that.defaultShiftId.length < 1){
					var workArea = that.getWorkarea(),
					$form = $('form', workArea);
					var flag = $form.valid();
					if(!flag){
						return;
					}
				}
			}
		});
	}
	,myExtendValidate:function(){ //扩展自定义校验
		  jQuery.validator.addMethod("myTmVldt", function(value, element) {  
	    	   var v=value||'';
	    	   if(/[0-2][0-9]:[0-5][0-9]/.test(v)&&v.length==5){
	    	   	  var h=new Number(v.substr(0,2));
	    	   	  if(h<24){
	    	   	    return true;
	    	   	  }
	    	   	  else
	    	   	    return false;
	    	   }else{
	    	   	  return false;
	    	   }
		  }, jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_23);//msg:错误提示文本。已验证
		   jQuery.validator.addMethod("myRestVldt", function(value, element) {
	    	   var v=value||'';
	    	   if(v == '' || v == undefined){
	    	   	  return true;
	    	   }
	    	   else{
		    	  v=v.trim();
		    	  var vn=new Number(v);
		    	  var opre=$('input[name="preTime' + element['name'].substr(13,1) + '"]').val();
				  var onext=$('input[name="nextTime' + element['name'].substr(13,1)+ '"]').val();
				 
				  var time1=new Number(opre.substring(0,2)) * 60 + new Number(opre.substring(3,5));
				  var time2=new Number(onext.substring(0,2)) * 60 + new Number(onext.substring(3,5));
				 
				  var timeDayType = $('input[name="preTimeDayType' + element['name'].substr(13,1) + '_el"]').val();
				  time1 = getRealTimeByType(time1,timeDayType);
				  
				  timeDayType =  $('input[name="nextTimeDayType' + element['name'].substr(13,1) + '_el"]').val();
				  time2 = getRealTimeByType(time2,timeDayType);
				  var total= time2 -time1; 
				  if (total<vn) {
					 return false;
				  } 
				  else {
				 	 $(element).val(vn);
					 return true;
				  }
			  	}
		   }, jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_10);//msg:错误提示文本。已验证
		  
	},setDefaultShift:function(id){
		var that = this;
			  $.ajax({
					url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftBatchEditHander&method=addItemJson",
					data: {id:id},
					dataType:'json',
				    type: "POST",
					beforeSend: function(){
						openLoader(1);
					},
					success: function(msg){
						that.addRowData(msg);
					},
					error: function(){
						closeLoader();
					},
					complete: function(){
					closeLoader();
					that.InitsegmentInRest1();
					}
				});
	},initEditGrid :function(){
	  	var row_fields_work =  '<div style="padding-top:15px;" class="row-fluid row-block row_field">'
			+ '<div class="spanSelf_01"><span class="cell-RlStdType"></span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_7
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_2
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_1
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_31
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_32
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_15
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_1
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_35
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_36
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_15
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_40
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_38
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_9
			+ '</span></div>'
	  	 	+ '</div>';
	  	 $('#itemInfo').append(row_fields_work);
	}
	,addRowData:function(rst){
		var that = this;
		$('#itemInfo').empty();
		that.initEditGrid();
		if(rst != null && rst.records != null && rst.records>0){
	  		var segment_key,segment_value,attendanceType_key,attendanceType_value,preTime,preIsPunchCard_key,preIsPunchCard_value;
	  		var preFloatAdjusted,preUnit_key,preUnit_value,segmentInRest,nextTime,nextIsPunchCard_key,nextIsPunchCard_value,nextFloatAdjusted;
	  		var shiftItemId,preTimeDayType_key,nextTimeDayType_key;
	  		var preTimeDayType_value,nextTimeDayType_value,restPreTime,restNextTime;
	  		for(var i=1;i<=rst.rows.length;i++){
				var row = rst.rows[i-1];
				segment_key = row["segment.key"],segment_value = row["segment.value"],attendanceType_key=row["attendanceType.key"],attendanceType_value = row["attendanceType.value"];
				preTime = row["preTime"],preIsPunchCard_key = row["preIsPunchCard.key"],preIsPunchCard_value = row["preIsPunchCard.value"],preFloatAdjusted = row["preFloatAdjusted"];
				preUnit_key = row["preUnit.key"],preUnit_value = row["preUnit.value"];
				segmentInRest = row["segmentInRest"],nextTime = row["nextTime"],nextIsPunchCard_key = row["nextIsPunchCard.key"];
				nextIsPunchCard_value = row["nextIsPunchCard.value"],nextFloatAdjusted = row["nextFloatAdjusted"];
				preTimeDayType_key = row["preTimeDayType.key"],nextTimeDayType_key = row["nextTimeDayType.key"];
				preTimeDayType_value = row["preTimeDayType.value"],nextTimeDayType_value = row["nextTimeDayType.value"];
				restPreTime = row["restPreTime"],restNextTime = row["restNextTime"];
				shiftItemId = row["shiftItemId"];
    			var row_fields_work = '<div  class="row-fluid row-block row_field">'
					    //+ '<div class="spanSelf_01"><input type="hidden" name="shiftItemId' + i + '" value="' + shiftItemId + '"/> <span>' + correctValue(i) + '<span/></div>'
					   + '<div class="spanSelf_01"><input type="hidden" name="shiftItemId' + i + '" value="' + shiftItemId + '"/> </div>'
					    
    			        + '<div class="spanSelf"><input type="text" name="segment' + i + '" value="" class="input-height cell-input"/></div>'
					    + '<div class="spanSelf"><input type="text" name="attendanceType' + i + '" value="" class="input-height cell-input"/></div>'
					    + '<div class="spanSelf"><input type="text" name="preTimeDayType' + i + '" value="" class="input-height cell-input"/></div>'
					    + '<div class="spanSelf"><input type="text" style="background-color:#daeef8"  name="preTime' + i + '" value="' + correctValue(preTime) + '" class="input-height cell-input"  validate="{required:true,myTmVldt:true}"/></div>'
					    + '<div class="spanSelf"><input type="text" name="preIsPunchCard' + i + '" value="" class="input-height cell-input"/></div>'
					    + '<div class="spanSelf"><input type="text" name="preFloatAdjusted' + i + '" value="' + correctValue(preFloatAdjusted) + '" class="input-height cell-input" validate="{number:true}" /></div>' 
					    
					    + '<input type="hidden" name="preUnit' + i + '" value="' + correctValue(preUnit_key) + '"/><input type="hidden" name = "preUnit' + i + '_el" value="' + correctValue(preUnit_value) + '"/>'
						+ '<div class="spanSelf"><input type="text" name="nextTimeDayType' + i + '" value="" class="input-height cell-input"/></div>'
					        
					    + '<div class="spanSelf"><input type="text" style="background-color:#daeef8" name="nextTime' + i + '" value="' + correctValue(nextTime) + '" class="input-height cell-input"  validate="{required:true,myTmVldt:true}"/></div>' 
					    + '<div class="spanSelf"><input type="text" name="nextIsPunchCard' + i + '" value="" class="input-height cell-input" /></div>'
					    + '<div class="spanSelf"><input type="text" name="nextFloatAdjusted' + i + '" value="' + correctValue(nextFloatAdjusted) + '" class="input-height cell-input" validate="{number:true}"/></div>'
						+ '<div class="spanSelf"><input type="text" name="restPreTime' + i + '" value="' + correctValue(restPreTime) + '" class="input-height cell-input"  validate="{myTmVldt:true}"/></div>' 
					    + '<div class="spanSelf"><input type="text" name="restNextTime' + i + '" value="' + correctValue(restNextTime) + '" class="input-height cell-input"  validate="{myTmVldt:true}"/></div>' 
						+ '<div class="spanSelf"><input type="text" name="segmentInRest' + i + '" value="' + correctValue(segmentInRest) + '" class="input-height cell-input"  validate="{myRestVldt:true,number:true}"/></div>' 
					   
				+ '</div>';
				$('#itemInfo').append(row_fields_work);
				that.packageF7Value(i,segment_value,attendanceType_value,preIsPunchCard_value,nextIsPunchCard_value,preTimeDayType_value,nextTimeDayType_value);
	  		}
	  		//段次大于1段
	  		if(rst.rows.length > 1){
	  			$('input[name ^="restPreTime"]').attr("disabled",'true');
	  			$('input[name ^="restNextTime"]').attr("disabled",'true');
	  		}
	  		if(rst.isElastic){
	  			if(rst.elasticType == jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_33){
	  				$('input[name ^="preFloatAdjusted"]').attr("disabled",'true');
	  				$('input[name ^="nextFloatAdjusted"]').attr("disabled",'true');
	  			}else if(rst.elasticType == jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_25){
	  				$('input[name ^="restPreTime"]').attr("disabled",'true');
	  				$('input[name ^="restNextTime"]').attr("disabled",'true');
	  				$('input[name ^="preFloatAdjusted"]').attr("disabled",'true');
	  				$('input[name ^="nextFloatAdjusted"]').attr("disabled",'true');
	  			}
	  		}
		}
		
	}
	,packageF7Value:function(rowNum,segment_value,attendanceType_value,preIsPunchCard_value,nextIsPunchCard_value,preTimeDayType_value,nextTimeDayType_value){	
		    //将【段次】 【出勤类型】【上班是否打卡】【下班是否打卡】封装成F7
			//$('input[name="fillCardTimeStr' + i + '"]').attr("validate","{required:true,myTmVldt:true}");
			var segment = { id:"segment",
	    					 readonly: "true",
	    					 value: "1",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
		   segment.data = [{value:"1",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_6},
		                    {value:"2",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_4},
		            		{value:"3",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_5}];
		            		
		   var attendanceType = { id:"attendanceType",
	    					 readonly: "",
	    					 value: "1",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
	    					
		   attendanceType.data = [{value:"1",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_46},
		                    	  {value:"2",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_16},
		            			  {value:"3",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_47},
		            		      {value:"4",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_17}];
		            		      
		  var timeDayType = {id: "timeDayType",
	    					 readonly: "",
	    					 value: "1",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
	    					
		  timeDayType.data = [{value:"0",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_22},
		                    	  {value:"1",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_3},
		            			  {value:"2",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_18}];
		            		      
		            		      
		   var preIsPunchCard = { id:"punchCard",
	    					 readonly: "",
	    					 value: "1",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
		   preIsPunchCard.data = [{value:"1",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_34},
		                    	  {value:"0",alias:jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_14}];
		                    	 

		    if(segment_value == null){
		    	segment_value = rowNum;	
		    }
    	 	segment.value = segment_value;
    	 	$('#itemInfo input[name=segment'+rowNum+']').shrSelect(segment);
    	 	if(attendanceType_value == null){
    	 		attendanceType_value = "1";
    	 	}
    	 	attendanceType.value = attendanceType_value;
    	 	$('#itemInfo input[name=attendanceType'+rowNum+']').shrSelect(attendanceType);
    	 	
    	 	if(preIsPunchCard_value == null){
    	 		preIsPunchCard_value = "1";
    	 	}
    	 	preIsPunchCard.value = preIsPunchCard_value;
    	 	$('#itemInfo input[name=preIsPunchCard'+rowNum+']').shrSelect(preIsPunchCard);
    	 	
    	 	if(nextIsPunchCard_value == null){
    	 		nextIsPunchCard_value = "1";
    	 	}
	     	preIsPunchCard.value = nextIsPunchCard_value;
    	 	$('#itemInfo input[name=nextIsPunchCard'+rowNum+']').shrSelect(preIsPunchCard);
    	 	
    	 	if(nextIsPunchCard_value == null){
    	 		nextIsPunchCard_value = "1";
    	 	}
	     	preIsPunchCard.value = nextIsPunchCard_value;
    	 	$('#itemInfo input[name=nextIsPunchCard'+rowNum+']').shrSelect(preIsPunchCard);
    	 	
    	 	if(nextIsPunchCard_value == null){
    	 		nextIsPunchCard_value = "1";
    	 	}
	     	preIsPunchCard.value = nextIsPunchCard_value;
    	 	$('#itemInfo input[name=nextIsPunchCard'+rowNum+']').shrSelect(preIsPunchCard);
    	 	
    	 	if(preTimeDayType_value == null){
    	 		preTimeDayType_value = "1";
    	 	}
    	 	//设置参考日期
    	 	timeDayType.value = preTimeDayType_value + "";
    	 	$('#itemInfo input[name=preTimeDayType'+rowNum+']').shrSelect(timeDayType);
    	 	
    	 	if(nextTimeDayType_value == null){
    	 		nextTimeDayType_value = "1";
    	 	}
    	 	timeDayType.value = nextTimeDayType_value + "";
    	 	$('#itemInfo input[name=nextTimeDayType'+rowNum+']').shrSelect(timeDayType);
    	 	
    	 	
    }	/**参数要求vo为一个数组，数组元素为一个对象{pre:x,next:y,name:nnn,val:vvv} .
	 * 返回一个对象{"valid":bool,"info":'',"vo":vo}
	 * 时间轴验证:第n+1段，必须是在第n段的时间轴之后。
	 * */
	,validateTimeAxis:function( vo ){
		  var that=this;
		  var rt={"valid":false,"info":'',"vo":vo};
		  var a=vo||[];
		  
	      if(a.length<2){
	      	rt.valid=true;
	        return rt;
	      }else{
	      	//摔下检查同名
	      	var min1,max1;//min:时间轴上段次应该排在前的，max:时间轴上段次应该排在后的
	        for(var i=0;i<a.length-1;i++){
	           for(var j=i+1;j<a.length;j++){
	           	   if (a[i].segment<=a[j].segment) {
	           	   	  min1=a[i];
	           	   	  max1=a[j];
	           	   } else {
	           	   	  min1=a[j];
	           	   	  max1=a[i];
	           	   }
	              if (min1.segment==max1.segment) {
	              	 rt.valid=false;
	                 rt.info=jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_0+getSegmentNameByValue(min1.segment);
	                 return rt;
	              }
	           }
	        }   
	      	
	      	var min,max;//min:时间轴上段次应该排在前的，max:时间轴上段次应该排在后的
	        for(var i=0;i<a.length-1;i++){
	           for(var j=i+1;j<a.length;j++){
	           	   if (a[i].segment<=a[j].segment) {
	           	   	  min=a[i];
	           	   	  max=a[j];
	           	   } else {
	           	   	  min=a[j];
	           	   	  max=a[i];
	           	   }
	           	
	              //时间轴上min应该在max前面
	              if( that.validateTimeLegal(min,max))
	              {
	                 rt.valid=true;
	                 rt.info='';
	              }else{
	                 rt.valid=false;
	                 //rt.info= jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_8;
	                 rt.info=jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_49;
	                 return rt;
	              }
	           }
	        }
	      }
	     return rt; 
	},
	/**对象格式{pre:x,next:y,name:nnn,val:vvv}，其中x,y值格式为 hh:mi 时分,其中必须确定0<=hh<24,0<=mi<60
	 * min:时间轴上段次应该排在前的，max:时间轴上段次应该排在后的,现在比较是否符合这个规则。
	 * */
	validateTimeLegal:function(min,max){
		var min_pre_h=new Number(min.preTime.substr(0,2)) * 60 + (new Number(min.preTime.substr(3,2)));
		var max_next_h=new Number(max.nextTime.substr(0,2)) * 60 + (new Number(max.nextTime.substr(3,2)));
		min_pre_h = getRealTimeByType(min_pre_h,min.preTimeDayType);
		
		max_next_h = getRealTimeByType(max_next_h,max.nextTimeDayType);
		
		//经过以上调整 ，再做判断
		if(parseInt(max_next_h) - parseInt(min_pre_h) > (24 * 60)){
			return false;
		}else{
			return true;
		}
		/*var min_pre_h=new Number(min.preTime.substr(0,2))+ (new Number(min.preTime.substr(3,2)))/60;
		var min_next_h=new Number(min.nextTime.substr(0,2))+ (new Number(min.nextTime.substr(3,2)))/60;
		var max_pre_h=new Number(max.preTime.substr(0,2))+ (new Number(max.preTime.substr(3,2)))/60;
		var max_next_h=new Number(max.nextTime.substr(0,2))+ (new Number(max.nextTime.substr(3,2)))/60;
		//如果pre_h>=next_h,则认为next_h为第二天的,需调整
		//传入的参数为hh:mi，已经确保了hh不会超过24
		if(min_pre_h>=min_next_h){
		   min_next_h+=24;
		}
		if(max_pre_h>=max_next_h){
		   max_next_h+=24;
		}
		
		//max_pre_h<min_next_h,认为max是min的第二天的，需调整
		if(max_pre_h<min_next_h){ 
		   max_pre_h+=24;
		   max_next_h+=24;
		}
		
		//经过以上调整 ，再做判断
		if(max_next_h-min_pre_h>24){
			return false;
		}else{
			return true;
		}*/
		
	}
	/**
	 * 排班时间修正方法
	 */
	,doAdjustAction: function() {
		var that = this;
		//1：首先数据的合法性
		if (that.validate() &&  that.verify()) {
	    }
	    else{
	    	return;
	    }
	    
	    //2: 休息开始时间和休息结束时间成对出现
	    var disableFlag = $('input[name ^="restPreTime"]').attr("disabled");
	    if(disableFlag != null && (disableFlag == "true" || disableFlag == "disabled")){
	    	
	    }
	    else{
	    	 //一段班
	    	var restPreTime1 = $('input[name ="restPreTime1"]').val();
	    	var restNextTime1 = $('input[name ="restNextTime1"]').val();
	    	var disabledRestPreTime = $('input[name ="restPreTime1"]').attr("disabled");
	    	var disabledRestNextTime = $('input[name ="restNextTime1"]').attr("disabled");
	    	if(restPreTime1.length == restNextTime1.length && restPreTime1.length>0 && disabledRestPreTime!="disabled" && disabledRestNextTime!="disabled"){
	    		//成对出现
	    		var errorInfo = that.calSegmentInRestValue(restPreTime1,restNextTime1, $($("input[name='preTime1']")).val(),$($("input[name='nextTime1']")).val(), $($("input[name='preTimeDayType1_el']")).val(),$($("input[name='nextTimeDayType1_el']")).val());
	    	    if(!errorInfo.valid){
				 	shr.showWarning({message: errorInfo.info});
					return false;
			     }
	    	}
	    	else{
	    		
	    	}
	    	
	    }
	    
	    //3：验证数据的有效性
	    var data = that.assembleSaveData();
		if(data == null){
			return;
		}
		
		var res = that.valideTimeOfCompareNew(data);
		if(!res){
		   return false;
		}
		
		var returnInfo = that.validateTimeAxis(data);
		if(!returnInfo.valid){
		 	shr.showWarning({message: returnInfo.info});
			return;
		}

		//需要重新计算当天的标准时长
		var standardHour=that.calcutlateStandardHour(returnInfo.vo);
		data = shr.toJSON(data);
		var  attendDate = atsMlUtile.getFieldOriginalValue('attendDate');
		var endDate = atsMlUtile.getFieldOriginalValue('endDate');
		if(attendDate != endDate){
			attendDate = attendDate + "," + endDate;
		}
		var proposer = $('#proposer_el').val(),defaultShift = $('#defaultShift_el').val();
		var hrOrgUnitId= $('#hrOrgUnit_el').val();
		var  adminOrgUnitid = $('#AdminOrgUnit_el').val();
		$.ajax({
				url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftBatchEditHander&method=updateShiftItem",
				data: {
					data:data,
					attendDate:attendDate,
					proposer: proposer,
					adminOrgUnitid:adminOrgUnitid,
					hrOrgUnitId:hrOrgUnitId,
					defaultShift : defaultShift,
					standardHour:standardHour
					},
				dataType:'json',
				type: "POST",
				beforeSend: function(){
					openLoader(1);
				},
				success: function(msg){
					shr.showInfo({message: jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_43});
				},
				error: function(){
					closeLoader();
					shr.showError({message: jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_44});
				},
				complete: function(){
					closeLoader();
				}
		});
	}
	
	,calcutlateStandardHour:function(vo)
	{   
		var standardHour=0;
	    if(!vo)
		{
			return standardHour;
		}
		var total1=0,total2=0;
		for(var j=0;j<vo.length;j++){
		   	if (vo[j].attendanceType==1 ||vo[j].attendanceType=='1 ' || vo[j].attendanceType==3|| vo[j].attendanceType=='3') {
			   	 	//正常出勤1  正常出勤不计异常3
			     var time1 = new Number(vo[j].preTime.substring(0,2)) * 60 + new Number(vo[j].preTime.substring(3,5));
			     var time2 = new Number(vo[j].nextTime.substring(0,2)) * 60 + new Number(vo[j].nextTime.substring(3,5));
			     var rest = new Number(vo[j].segmentInRest);
			     
			     time1 = getRealTimeByType(time1,vo[j].preTimeDayType);
			     time2 = getRealTimeByType(time2,vo[j].nextTimeDayType);
			      
			     total2 += (time2 - time1)-rest;
		   	} 
		}
		standardHour=(new Number(total2)/60).toFixed(2);
		return standardHour;
	}
	
	,assembleSaveData:function(){
		var _self = this;
		var dataArray = [];
	 	$('#itemInfo input[name^=nextFloatAdjusted]').each(function(i,domEle) {
			  var length = $(domEle).attr("name").substring("nextFloatAdjusted".length);
	 	      dataArray.push(parseInt(length));
	 	});
	 	
	 	//将数组由小到大排列
	 	if(dataArray.length > 0){
	 		dataArray.sort(sortNumber);
	 	}
	 	
	 	//构造分录数据
	 	var entries = [];
	 	for(var i=0;i<dataArray.length;i++){
	 		var entrie = {
	 			segment: correctValue($('#itemInfo input[name="segment' + dataArray[i] + '_el"]').val()),
				attendanceType: correctValue($('#itemInfo input[name="attendanceType' + dataArray[i] + '_el"]').val()),
				preTimeDayType: correctValue($('#itemInfo input[name="preTimeDayType' + dataArray[i] + '_el"]').val()),
				preTime: correctValue($('#itemInfo input[name="preTime' + dataArray[i] +'"]').val()),
				preIsPunchCard:correctValue($('#itemInfo input[name="preIsPunchCard' + dataArray[i] +'_el"]').val()),
				preFloatAdjusted:correctValue($('#itemInfo input[name="preFloatAdjusted' + dataArray[i] +'"]').val()),
				//preUnit:	correctValue($('#itemInfo input[name="preUnit' + dataArray[i] +'_el"]').val()),

				nextTimeDayType: correctValue($('#itemInfo input[name="nextTimeDayType' + dataArray[i] +'_el"]').val()),
				nextTime:	correctValue($('#itemInfo input[name="nextTime' + dataArray[i] +'"]').val()),
				nextIsPunchCard:	correctValue($('#itemInfo input[name="nextIsPunchCard' + dataArray[i] +'_el"]').val()),
				nextFloatAdjusted: correctValue($('#itemInfo input[name="nextFloatAdjusted' + dataArray[i] + '"]').val()),
				restPreTime: correctValue($('#itemInfo input[name="restPreTime' + dataArray[i] + '"]').val()),
				restNextTime: correctValue($('#itemInfo input[name="restNextTime' + dataArray[i] + '"]').val()),
				segmentInRest:	correctValue($('#itemInfo input[name="segmentInRest' + dataArray[i] +'"]').val()),
				shiftItemId: correctValue($('#itemInfo input[name="shiftItemId' + dataArray[i] + '"]').val())
	 		}
	 		entries.push(entrie);
	 	}
	 	
	 	if(entries.length<1){
	 		shr.showError({message: jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_48});
	 		return null;
	 	}
	 	
		return entries;
	},
	/**
	 * 一段班的时候要重新根据休息开始休息结束时间来计算段内休息
	 */
	calSegmentInRestValue : function(restPreTime,restNextTime,preTime,nextTime,predaytype,nextdaytype) {
		//注意month是从0开始的。
		var restPreTimeObj = $($("input[name='restPreTime1']"));
		var restNextTimeObj = $($("input[name='restNextTime1']"));
		if(restPreTimeObj.val()){
		    restPreTimeObj.attr("validate","myTmVldt:true");
		}
		if(restNextTimeObj.val()){
			restNextTimeObj.attr("validate","myTmVldt:true");
		}
		var restPreTimeValue = restPreTimeObj.val();
		var restNextTimeValue = restNextTimeObj.val();
		if(restPreTimeValue!=null){
		   restPreTimeValue = restPreTimeValue.trim();
		}
		if(restNextTimeValue!=null){
			restNextTimeValue = restNextTimeValue.trim();
		}
		
		if((restPreTimeValue==null || restPreTimeValue=="") 
		&& restNextTimeValue==null || restNextTimeValue==""){
			return;
		}
		var that = this;
		var rt = {"valid":true,"info":''};
		if (restPreTimeObj.val() == '' && restNextTimeObj.val() == '') {
			$(("input[name='segmentInRest1']")).val(0);
			rt.valid = true;
			return rt;
		}
		var mydate  = new Date();
		var myyear  = mydate.getFullYear();
		var mymonth = mydate.getMonth();
		var myday   = mydate.getDate();
		if(mymonth < 10){mymonth = "0" + mymonth;}
		if(myday < 10){myday = "0" + myday;}
		var prea = restPreTimeObj.val();
		if (restPreTime != null) {
			prea = restPreTime;
		}
		var nexta = restNextTimeObj.val();
		if (restNextTime != null) {
			nexta = restNextTime;
		}
		var srarttime = myyear + "-" + mymonth + "-" + myday + " " + prea  + ":00";
		var sendtime  = myyear + "-" + mymonth + "-" + myday + " " + nexta + ":00";
		//上班时间
		var pretimea = $($("input[name='preTime1']")).val();
		if (preTime != null) {
			pretimea = preTime;
		}
		var nexttimea = $($("input[name='nextTime1']")).val();
		if (nextTime != null) {
			nexttimea = nextTime;
		}
		var pretime  = myyear + "-" + mymonth + "-" + myday + " " + pretimea  + ":00";
		var nexttime = myyear + "-" + mymonth + "-" + myday + " " + nexttimea + ":00";
		
		var pretimedaytype = $($("input[name='preTimeDayType1_el']")).val();
		if (predaytype != null) {
			pretimedaytype = predaytype;
		}
		var nexttimedaytype = $($("input[name='nextTimeDayType1_el']")).val();
		if (nextdaytype != null) {
			nexttimedaytype = nextdaytype;
		}
		//休息开始
		var srartdate = new Date(myyear,mymonth,myday,prea.split(":")[0],prea.split(":")[1],"00");//解决ie不兼容的问题
		//休息结束
		var senddate = new Date(myyear,mymonth,myday,nexta.split(":")[0],nexta.split(":")[1],"00");//解决ie不兼容问题
		//上班时间,下班时间
		var predate = new Date(myyear,mymonth,myday,pretimea.split(":")[0],pretimea.split(":")[1],"00");//解决ie不兼容的问题
		var nextdate = new Date(myyear,mymonth,myday,nexttimea.split(":")[0],nexttimea.split(":")[1],"00");//解决ie不兼容的问题
		if ("0" == pretimedaytype) {
			predate.setTime(predate.getTime() - 1*24*60*60*1000);
		}else if("2" == pretimedaytype){
			predate.setTime(predate.getTime() + 1*24*60*60*1000);
		}
		if ("0" == nexttimedaytype) {
			nextdate.setTime(nextdate.getTime() - 1*24*60*60*1000);
		}else if("2" == nexttimedaytype){
			nextdate.setTime(nextdate.getTime() + 1*24*60*60*1000);
		}
		//旧的判断逻辑，不仅不全面，而且复杂。再也不用了。不过还是先留着吧。edit by chenah
		/*if (pretimedaytype == "前一天") {
			if (prea != "" && nexta != "") {
				var restStartValue = parseFloat(prea.substring(0,2));
				var restEndValue   = parseFloat(nexta.substring(0,2));
				var predateValue   = parseFloat(pretimea.substring(0,2));
				if (restStartValue < predateValue &&  restEndValue < predateValue) {
					//休息开始 休息结束 都是 当天
					srartdate.setTime(srartdate.getTime() + 0*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 0*24*60*60*1000);
				}else if (restEndValue > predateValue &&  restStartValue > predateValue){
					//休息开始 休息结束 都是 前一天
					srartdate.setTime(srartdate.getTime() - 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  - 1*24*60*60*1000);
				}else if (restStartValue > predateValue && restEndValue < predateValue){
					//休息开始-前一天 	休息结束 都是 当天
					srartdate.setTime(srartdate.getTime() - 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 0*24*60*60*1000);
				}
			}
		}
		if (pretimedaytype == "当天") {
			if (prea != "" && nexta != "") {
				var restStartValue = parseFloat(prea.substring(0,2));
				var restEndValue   = parseFloat(nexta.substring(0,2));
				var predateValue   = parseFloat(pretimea.substring(0,2));
				if (restStartValue < predateValue &&  restEndValue < predateValue) {
					//休息开始 休息结束 都是第二天
					srartdate.setTime(srartdate.getTime() + 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 1*24*60*60*1000);
				}else if (restEndValue > predateValue &&  restStartValue > predateValue){
					//休息开始 休息结束 都是当天
					srartdate.setTime(srartdate.getTime() + 0*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 0*24*60*60*1000);
				}else if (restStartValue > predateValue && restEndValue < predateValue){
					//休息开始-当天 	休息结束 都是第二天
					srartdate.setTime(srartdate.getTime() + 0*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 1*24*60*60*1000);
				}
			}
		}
		if (pretimedaytype == "后一天") {
			if (prea != "" && nexta != "") {
				var restStartValue = parseFloat(prea.substring(0,2));
				var restEndValue   = parseFloat(nexta.substring(0,2));
				var predateValue   = parseFloat(pretimea.substring(0,2));
				if (restStartValue < predateValue &&  restEndValue < predateValue) {
					//休息开始 休息结束 都是 第三天
					srartdate.setTime(srartdate.getTime() + 2*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 2*24*60*60*1000);
				}else if (restEndValue > predateValue &&  restStartValue > predateValue){
					//休息开始 休息结束 都是 后一天
					srartdate.setTime(srartdate.getTime() + 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 1*24*60*60*1000);
				}else if (restStartValue > predateValue && restEndValue < predateValue){
					//休息开始-后一天 	休息结束 都是 第三天
					srartdate.setTime(srartdate.getTime() + 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 2*24*60*60*1000);
				}
			}
		}*/
		
		var currdate    =  new Date();
		var currDateStr = currdate.getFullYear() + "-" + (currdate.getMonth()) + "-" + currdate.getDate();
		var preTimeValue = pretimedaytype;
		//上班开始时间
		var preTimeStrValue = parseInt(pretimea.substring(0, 2))*60+parseInt(pretimea.substring(3, 5));
		//休息开始时间
		var restPreTimeValue = parseInt(prea.substring(0, 2))*60+parseInt(prea.substring(3, 5));
		//休息结束时间
		var restNextTimeValue = parseInt(nexta.substring(0, 2))*60+parseInt(nexta.substring(3, 5));
		var restPreDateTime = "";//休息开始（有时分秒的字符串）
		var resrNextDateTime = "";//休息结束（有时分秒的字符串）
		var restPreDate = null;//休息开始日期（没有时分秒的日期）
		var restNextDate = null;//休息开始日期（没有时分秒的日期）
		//1.计算休息开始时间
		if(restPreTimeValue >= preTimeStrValue){//休息开始>=开始上班 ，同一天
			restPreDate = getDateByTypeNew(preTimeValue, currDateStr);
		    restPreDateTime = getVirDateStr(restPreDate) + " " + prea + ":00";
		}else{//加一天
			preTimeValue= parseInt(preTimeValue) + 1;
			restPreDate = getDateByTypeNew(preTimeValue, currDateStr);
			restPreDateTime = getVirDateStr(restPreDate) + " " + prea + ":00";
		}
		srartdate = NewLongDate(restPreDateTime);
		//2.算休息结束时间
		preTimeValue = pretimedaytype;//要重新赋值
		if(restNextTimeValue >= preTimeStrValue){//休息结束>=开始上班 ，同一天
			var restNextDate = getDateByTypeNew(preTimeValue, currDateStr);
			resrNextDateTime = getVirDateStr(restNextDate) + " " + nexta + ":00";
		}else{
			preTimeValue= parseInt(preTimeValue) + 1;
			var restNextDate = getDateByTypeNew(preTimeValue, currDateStr);
			resrNextDateTime = getVirDateStr(restNextDate) + " " + nexta + ":00";
		}
		senddate = NewLongDate(resrNextDateTime);
		/*if (senddate.getTime() < srartdate.getTime()) {
			senddate.setTime(senddate.getTime() + 1*24*60*60*1000);
		}*/
		var longTime = senddate.getTime() - srartdate.getTime();
		//alert( "senddate==　" 　+　　senddate);
		if (srartdate.getTime()<predate.getTime() && senddate.getTime()<predate.getTime()) {
			rt.valid = false;
			rt.info = jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_41;
		}
		
		if (srartdate.getTime()<predate.getTime() || srartdate.getTime()>nextdate.getTime()) {
			//shr.showWarning({message:"休息开始时间必须大于等于第一段上班时间，小于等于第一段下班时间！"});
			rt.valid = false;
			rt.info = jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_42;
		}
		if (senddate.getTime()<predate.getTime() || senddate.getTime()>nextdate.getTime()) {
			//shr.showWarning({message:"休息结束时间必须大于等于第一段上班时间，小于等于第一段下班时间！"});
			rt.info = jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_39;
			rt.valid = false;
		}
		
		$($("input[name='segmentInRest1']")).val(longTime/(60*1000));
		
		
		return rt;
	},
	InitsegmentInRest1 : function(){
		//只针对一段班
		var that = this;
		var restPreTimeObj = $($("input[name='restPreTime1']"));
		var restNextTimeObj = $($("input[name='restNextTime1']"));
		//刚进入要把验证去掉。
		restPreTimeObj.attr("validate","myTmVldt:false");
        restNextTimeObj.attr("validate","myTmVldt:false");
        
		restPreTimeObj.blur(function(){
    			if (restPreTimeObj.val() == '' && restNextTimeObj.val() == '') {
        			restPreTimeObj .attr("validate","myTmVldt:false");
        			restNextTimeObj.attr("validate","myTmVldt:false");
        		}
        		that.calSegmentInRestValue(null,null,null,null,null,null);
        		
    		});
    		restNextTimeObj.blur(function(){
    			if (restPreTimeObj.val() == '' && restNextTimeObj.val() == '') {
        			restPreTimeObj.attr("validate","myTmVldt:false");
        			restNextTimeObj.attr("validate","myTmVldt:false");
        		}
        		that.calSegmentInRestValue(null,null,null,null,null,null);
    		});
	},
	/**
	 * 限制班次时间问题，只要一直递增并且不超过24小时就是合理的。
	 * 
	 */
	valideTimeOfCompareNew: function(vo){
            var newVo = [];		
		    var TIME_COLON_SUFF = "00";
			var SPACE = " ";
			var regEx = new RegExp("\\-","gi");
			//改造vo将vo变成带前一天当天后一天的实际日期+时分秒的时间。
			var currdate    =  new Date();
			var currDateStr = currdate.getFullYear() + "-" + (currdate.getMonth() + 1) + "-" + currdate.getDate();
			for(var i=0;i<vo.length;i++){
                var newObj = {};				
				var temp = vo[i];
				var preDate = getDateByType(parseInt(temp.preTimeDayType),currDateStr);
				var preYear = preDate.getFullYear();
				var preMonth = preDate.getMonth();
				var preDay = preDate.getDate();
				var preHour = temp.preTime.split(":")[0];
				var preMinute = temp.preTime.split(":")[1];
				var preSecond = TIME_COLON_SUFF;
				var preDateTime = new Date(preYear,preMonth,preDay,preHour,preMinute,preSecond);
				
				var nextDate = getDateByType(parseInt(temp.nextTimeDayType),currDateStr);
				var nextYear = nextDate.getFullYear();
				var nextMonth = nextDate.getMonth();
				var nextDay = nextDate.getDate();
				var nextHour = temp.nextTime.split(":")[0];
				var nextMinute = temp.nextTime.split(":")[1];
				var nextSecond = TIME_COLON_SUFF;
				var nextDateTime = new Date(nextYear,nextMonth,nextDay,nextHour,nextMinute,nextSecond);
				newObj.preDateTime = preDateTime;
				newObj.nextDateTime = nextDateTime;
				newVo.push(newObj);
			}
			
		    //一段班
			if (newVo.length == 1) {
				var temp = newVo[0];
				if(temp.preDateTime.getTime()>temp.nextDateTime.getTime()){
				  shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_45});
				  return false;
				}
				//加上不能大于24小时的判断
				if(temp.nextDateTime.getTime()-temp.preDateTime.getTime()>1*24*60*60*1000){
				  shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_49});
				  return false;
				}
			}
			
			//二段班
			if (newVo.length == 2) {
				var temp1 = newVo[0];
				var temp2 = newVo[1];
				var preDateTime1  = temp1.preDateTime;
				var nextDateTime1 = temp1.nextDateTime;
				
				var preDateTime2  = temp2.preDateTime;
				var nextDateTime2 = temp2.nextDateTime;
				if(preDateTime1.getTime()>nextDateTime1.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_13});
				   return false;
				}
				
				if(preDateTime2.getTime()<nextDateTime1.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_12});
				   return false;
				}
				
				if(preDateTime2.getTime()>nextDateTime2.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_11});
				   return false;
				}
				//加上不能大于24小时的判断
				if((nextDateTime2.getTime()-preDateTime1.getTime())>1*24*60*60*1000){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_49});
				   return false;
				}
		    }
		  
		  if (newVo.length == 3) {
		  	   var temp1 = newVo[0];
			   var temp2 = newVo[1];
			   var temp3 = newVo[2];
			   var preDateTime1  = temp1.preDateTime;
			   var nextDateTime1 = temp1.nextDateTime;
				
			   var preDateTime2  = temp2.preDateTime;
			   var nextDateTime2 = temp2.nextDateTime;
			   
			   var preDateTime3  = temp3.preDateTime;
			   var nextDateTime3 = temp3.nextDateTime;
			   
			   if(preDateTime1.getTime()>nextDateTime1.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_30});
				   return false;
				}
				
				if(preDateTime2.getTime()<nextDateTime1.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_27});
				   return false;
				}
				
				if(preDateTime2.getTime()>nextDateTime2.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_26});
				   return false;
				}
				
				if(preDateTime3.getTime()<nextDateTime2.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_29});
				   return false;
				}
				
				if(preDateTime3.getTime()>nextDateTime3.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_28});
				   return false;
				}
				
				if(nextDateTime3.getTime()-preDateTime1.getTime()>1*24*60*60*1000){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_49});
				   return false;
				}
		  }
		  return true;
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
/*
 * 升序
 */
function sortNumber(value1,value2){
	if(value1 < value2){
		return -1;
	}
	else if(value1 > value2){
		return 1
	}
	else{
		return 0;
	}
}

function getRealTimeByType(value,type){
	if(parseInt(type) == 0){
		value -= 24 * 60;
	}
	else if(parseInt(type) == 1){
		
	}
	else if(parseInt(type) == 2){
		value += 24 * 60;
	}
	else{
		
	}
	return value;
}

function getSegmentNameByValue(val){
   if("1" == val){
     return jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_6;
   }else if("2" == val){
     return jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_4;
   }else if("3" == jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_5){
     return jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_5;
   }
}

function getVirDateStr(date){
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var tMonth = month > 9 ? month : ('0' + month);
	var tDay = day > 9 ? day : ('0' + day);
	return year + '-' + tMonth + '-' + tDay;
}

function getDateByType(type, currDateStr){
	var regEx = new RegExp("\\-","gi");
	currDateStr = currDateStr.replace(regEx,"/");
	var curDate = new Date(currDateStr);
	if(parseInt(type) == 0){//前一天
		var preDate = new Date(curDate.getTime()-24*60*60*1000);
		return preDate;
	}else if(parseInt(type) == 1){//当天
		return curDate;
	}else{//后一天
		var nextDate = new Date(curDate.getTime()+24*60*60*1000);
		return nextDate;
	}
}

function getDateByTypeNew(type, currDateStr){
	/*var regEx = new RegExp("\\-","gi");
	currDateStr = currDateStr.replace(regEx,"/");*/
	var curDate = NewShortDate(currDateStr);
	if(parseInt(type) == 0){//前一天
		var preDate = new Date(curDate.getTime()-24*60*60*1000);
		return preDate;
	}else if(parseInt(type) == 1){//当天
		return curDate;
	}else{//后一天
		var nextDate = new Date(curDate.getTime()+24*60*60*1000);
		return nextDate;
	}
}

function NewLongDate(dateTime){
	var dateTimeArr = dateTime.split(" ");
	var dateStr = dateTimeArr[0];
	var timeStr = dateTimeArr[1];
	var dateArr = dateStr.split("-");
	var year = dateArr[0];
	var month = dateArr[1];
	var day = dateArr[2];
	var timeArr = timeStr.split(":");
	var hour = timeArr[0];
	var minute = timeArr[1];
	var second = timeArr[2];
	var date = new Date(year,month,day,hour,minute,second);
	return date;
}

function NewShortDate(date){
    var dateTimeArr = date.split(" ");
	var dateStr = dateTimeArr[0];
	var dateArr = dateStr.split("-");
	var year = dateArr[0];
	var month = dateArr[1];
	var day = dateArr[2];
	var date = new Date(year,month,day);
	return date;
}

function getDayTypeValueByName(typeName){
   if(jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_22 == typeName){
        return "0";
   }else if(jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_3 == typeName){
   	    return "1";
   }else if(jsBizMultLan.atsManager_scheduleShiftBatchEdit_i18n_18 == typeName){
   	    return "2"
   }else{
        return "";
   }
}