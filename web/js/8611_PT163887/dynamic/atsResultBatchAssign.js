shr.defineClass("shr.ats.atsResultBatchAssign", shr.framework.List, {
	attendProjectList : [],
	initalizeDOM:function(){
		shr.ats.atsResultBatchAssign.superClass.initalizeDOM.call(this);
		
		var _self = this;
		
		_self.setAttendanceProject();
		
		_self.projectChangeEvent();
		
		$("#workAreaDiv .view_manager_header").remove();
		$("input[name=attendanceName]").css("background-color","white");
		
		
		
		$("#proposer").shrPromptBox("option", {
			afterOK : function(value, e) {
				var info = value;
				if(info != null && info.length > 0){
					var proposerName = "";
					var proposerIds = "";
					for(var i=0;i<info.length;i++){
						if(i > 0){
							proposerName += ",";
							proposerIds += ",";
						}
						proposerName += info[i]["name"];
						proposerIds += encodeURIComponent(info[i]["person.id"]);
					}
					$("#proposer").val(proposerName);//员工编码
					$('#proposer_el').val(proposerIds);
				}
			}
		});
		
		$("#empRange").find('.spanSelf').eq(0).css("width","auto");
		$("#personScope").find('.col-lg-4').eq(0).remove();
		if(window.contextLanguage == 'en_US'){
			$(".photoCtrlRadio").next().css("width","auto");
			$(".field_label").css("display","block");
			$(".photoCtrlRadio").parent().prev().remove();
		}
	},
	
	addAtsProjectDiv : function(index){
		var atsProjectDiv ='<div class="row-fluid row-block row_field">'
	        + '<span class="spanSelf" style="width:auto;text-align: right;">' 
	        + jsBizMultLan.atsManager_atsResultBatchAssign_i18n_7 
	        + '</span>'
	        + '<span class="spanSelf" style="width:25%">'
	            + '<input type="text" name="attendanceName" class="input-height cell-input" />'
	        + '</span>'
	        + '<span class="spanSelf" style="width:5%;text-align: right;">' 
	        + jsBizMultLan.atsManager_atsResultBatchAssign_i18n_13 
	        + '</span>'
	        + '<span class="spanSelf" style="width:80px" name="showInput">'
	            + '<input type="text" name="attendanceValue" class="input-height cell-input" style="width:80px" />'
	        + '</span>'
	        + '<span style="margin-left: 20px;">'
	            + '<i id="condition_add" class="icon-plus" style="padding:10px"></i>'
	        + '</span>'
	        + '<span>'
	            + '<i class="icon-remove" style="padding:10px" ></i>'
	        + '</span>'
   		+ '</div>'
    
 		return atsProjectDiv;
 	},
 	projectChangeEvent: function(){
 		var _self = this;
 		$(".icon-remove").die().live('click',function(){
			$(this).closest("div.row_field").remove();
		});
		
		$('.icon-plus').die().live('click',function(){
			var content = _self.addAtsProjectDiv();
			$("#empRange").append(content);
			$('input[name=attendanceName]').shrSelect(_self.attendProjectList);
			$('.overflow-select').css("max-height","150px").css("overflow-y","auto");
			$("input[name=attendanceName]").css("background-color","white");
		});
		
		$("#empRange > .groupToggle > #slideToggle").die().live('click',function(){
			if($('.row-fluid .row-block .row_field').is(':hidden')){
				$('.row-fluid .row-block .row_field').show();
			}else {
				$('.row-fluid .row-block .row_field').hide();
			}
		})
		
		
		
		//设置初始化选中
		$('#selectedCondition').shrRadio();
		$('#customCondition').shrRadio();
		if(window.parent.bactchAssignResultIds && window.parent.bactchAssignResultIds.length > 0){
			$('#selectedCondition').shrRadio('check');
			$("#hrOrgUnit").shrPromptBox('disable');
			$("#proposer").shrPromptBox('disable');
			$("#attenceStartDate").shrDateTimePicker('disable');
			$("#attenceEndDate").shrDateTimePicker('disable');
		}else {
			$('#customCondition').shrRadio('check');
			$("#hrOrgUnit").addClass("required");
			$("#proposer").addClass("required");
			$("#attenceStartDate").addClass("required");
			$("#attenceEndDate").addClass("required");
		}
		
		//radiochange事件
		$('#selectedCondition').shrRadio('onChange',function(){
			$("#attenceStartDate").val('');
			$("#attenceEndDate").val('');
			$("#hrOrgUnit").shrPromptBox('setValue','');
			$("#proposer").shrPromptBox('setValue','');
			$("#hrOrgUnit").removeClass("required");
			$("#proposer").removeClass("required");
			$("#attenceStartDate").removeClass("required");
			$("#attenceEndDate").removeClass("required");
			
			$("#hrOrgUnit").shrPromptBox('disable');
			$("#proposer").shrPromptBox('disable');
			$("#attenceStartDate").shrDateTimePicker('disable');
			$("#attenceEndDate").shrDateTimePicker('disable');
		});
		
		$('#customCondition').shrRadio('onChange',function(){
			$("#hrOrgUnit").addClass("required");
			$("#proposer").addClass("required");
			$("#attenceStartDate").addClass("required");
			$("#attenceEndDate").addClass("required");
			
			$("#hrOrgUnit").shrPromptBox('enable');
			$("#proposer").shrPromptBox('enable');
			$("#attenceStartDate").shrDateTimePicker('enable');
			$("#attenceEndDate").shrDateTimePicker('enable');
		});
 	},
	setAttendanceProject: function(){
		var _self = this;
		var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList";
		shr.remoteCall({  
				type : "post",
				async:true,
				url : url,
				method : "getAttendanceProject",
				success : function(res){
					var len = res.attendProjectList.length ;
					var atsProjectList = "";
					if(len > 0 )
					{
						var attend_json = 
						{
							id: "type",
							readonly: "",
							value: "0",
							onChange: null,
							validate: "{required:true}",
							filter: ""
						};
						var attend=[];
						for(var j=0;j<len;j++)
						{
						  var attendProjectInfo = res.attendProjectList[j];
						  //去掉S1~S6
						  if(!(attendProjectInfo.attendNo == "S1" || attendProjectInfo.attendNo == "S2"  || attendProjectInfo.attendNo == "S3"  
						  || attendProjectInfo.attendNo == "S4"  || attendProjectInfo.attendNo == "S5"  || attendProjectInfo.attendNo == "S6")){
							  attend.push({'value':attendProjectInfo.attendNo,'alias':attendProjectInfo.attendName,'dataType':attendProjectInfo.dataType});
						  }
						} 
						attend_json.data=attend;
						_self.attendProjectList = attend_json;
						$('input[name="attendanceName"]').shrSelect(attend_json);
						$('.overflow-select').css("max-height","150px").css("overflow-y","auto");
					}
				}
		})
	},
	confirmAction: function(flag){
		var _self = this;
		//校验
		if(!_self.verify()){
			return;
		}
		
		var personScope =  $("input[type='radio']:checked").val();
		var hrOrgUnitId = "";
		var proposerIds = "";
		var attenceStartDate = "";
		var attenceEndDate = "";
		var atsResultIds = "";
		if(personScope == "CUSTOM"){
			hrOrgUnitId = $("#hrOrgUnit_el").val();
			proposerIds = $("#proposer_el").val();
			attenceStartDate = $("#attenceStartDate").val();
			attenceEndDate = $("#attenceEndDate").val();
		}else {
			atsResultIds = window.parent.bactchAssignResultIds;
		}
		var adminOrgUnitId = $("#adminOrgUnit_el").val();
		var attAdminOrgUnitId = $("#attAdminOrgUnit_el").val();
		
		var attendanceValues = $("input[name='attendanceValue']");
		var atsProjectValues = '';
		var atsProjectNames = $("input[name='attendanceName_el']");
		var atsProjectNOs = '';
		if(atsProjectNames && atsProjectNames.length > 0){
			for(var i=0;i<atsProjectNames.length;i++){
				if(atsProjectNames[i].value != 0){//如果有选项目
					if(atsProjectNOs.length > 0)
					{
						atsProjectNOs +=",";
						atsProjectValues +=",";
					}
					atsProjectNOs += atsProjectNames[i].value;
					atsProjectValues += attendanceValues[i].value;
				}
			}
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.AttendanceResultBatchAssignHander&method=batchAssign";
		shr.ajax({
			url: url,
			dataType:'json',
			type: "POST",
			data: {
				attenceStartDate :attenceStartDate,
	    		attenceEndDate : attenceEndDate,
	    		proposerIds : proposerIds,
	    		adminOrgUnitId : encodeURIComponent(adminOrgUnitId),
	    		attAdminOrgUnitId: encodeURIComponent(attAdminOrgUnitId),
	    		hrOrgUnitId: encodeURIComponent(hrOrgUnitId),
	    		atsProjectNOs: atsProjectNOs,
	    		atsProjectValues: atsProjectValues,
	    		personScope: personScope,
	    		atsResultIds: atsResultIds
	    		
			},
			beforeSend: function(){
				openLoader(1);
			},
			cache: false,
			success: function(res) {
				//location.reload();
				shr.showInfo({message: jsBizMultLan.atsManager_atsResultBatchAssign_i18n_0, hideAfter: 3});
			},
			error: function(){
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});
	},
	
	verify:function(){
		var _self = this;
		var personScope =  $("input[type='radio']:checked").val();
		var hrOrgUnitId = "";
		var proposerIds = "";
		var attenceStartDate = "";
		var attenceEndDate = "";
		if(personScope == "SELECTED"){
			var atsResultIds = window.parent.bactchAssignResultIds;
			if(atsResultIds && atsResultIds.length ==0){
				shr.showInfo({message: jsBizMultLan.atsManager_atsResultBatchAssign_i18n_6, hideAfter: 3});
				return false;
			}
		}else {
			hrOrgUnitId = $("#hrOrgUnit_el").val();
			proposerIds = $("#proposer_el").val();
			attenceStartDate = $("#attenceStartDate").val();
			attenceEndDate = $("#attenceEndDate").val();
			
			if(hrOrgUnitId == null || hrOrgUnitId.length == 0){
				shr.showInfo({message: jsBizMultLan.atsManager_atsResultBatchAssign_i18n_4, hideAfter: 3});
				return false;
			}
			
			if(proposerIds == null || proposerIds.length == 0){
				shr.showInfo({message: jsBizMultLan.atsManager_atsResultBatchAssign_i18n_12, hideAfter: 3});
				return false;
			}
			
			if(attenceStartDate == null || attenceStartDate.length == 0){
				shr.showInfo({message: jsBizMultLan.atsManager_atsResultBatchAssign_i18n_3, hideAfter: 3});
				return false;
			}
			
			if(attenceEndDate == null || attenceEndDate.length == 0){
				shr.showInfo({message: jsBizMultLan.atsManager_atsResultBatchAssign_i18n_1, hideAfter: 3});
				return false;
			}
			
			var beginDate = new Date(attenceStartDate.replace(/-/g, "/"));
			var endDate  = new Date(attenceEndDate.replace(/-/g, "/"));
			if(beginDate.getTime() > endDate.getTime()){
				shr.showInfo({message: jsBizMultLan.atsManager_atsResultBatchAssign_i18n_2, hideAfter: 3});
				return false;
			}
		}
		
		var attendanceValues = $("input[name='attendanceValue']");
		var atsProjectNames = $("input[name='attendanceName_el']");
		var atsProjectNOs = '';
		if(atsProjectNames && atsProjectNames.length > 0){
			for(var i=0;i<atsProjectNames.length;i++){
				if(atsProjectNames[i].value != 0){
					atsProjectNOs = atsProjectNames[i].value;
					var projectAssignValue = attendanceValues[i].value;
					if(projectAssignValue != ""){
						var atsProjectInfo = _self.getAtsProjectInfo(atsProjectNames[i].value);
						switch(atsProjectInfo[1])
						{
						case "Date":
						  if(!_self.isDate(projectAssignValue)){
						  	shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsResultBatchAssign_i18n_9, [atsProjectInfo[0]])});
						  	return false;
						  }
						  break;
						case "Int":
						  if(!_self.isInt(projectAssignValue)){
						  	shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsResultBatchAssign_i18n_11, [atsProjectInfo[0]])});
						  	return false;
						  }
						  break;
					    case "Float":
						  if(!_self.isFloat(projectAssignValue)){
						  	shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsResultBatchAssign_i18n_10, [atsProjectInfo[0]])});
						  	return false;
						  }
						  break;
					    case "Boolean":
						  if(typeof(projectAssignValue) != "boolean"){
						  	shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsResultBatchAssign_i18n_8, [atsProjectInfo[0]])});
						  	return false;
						  }
						  break;
						default:
						}
					}
				}
			}
		}
		
		var adminOrgUnitId = $("#adminOrgUnit_el").val();
		var attAdminOrgUnitId = $("#attAdminOrgUnit_el").val();
		if(adminOrgUnitId == '' && attAdminOrgUnitId == '' && atsProjectNOs == ''){
			shr.showInfo({message: jsBizMultLan.atsManager_atsResultBatchAssign_i18n_5, hideAfter: 3});
			return false;
		}
		return true;
	},
	getAtsProjectInfo: function(projectNo){
		var self = this;
		if(projectNo != ''){
			var len = self.attendProjectList.data.length;
			for(var i=0;i<len;i++){
				var atsProjectInfo = self.attendProjectList.data[i];
				if(atsProjectInfo.value == projectNo){
					return [atsProjectInfo.alias,atsProjectInfo.dataType];
				}
			}
		}
		return null;
	},
	
	isInt: function(number) {
	　　var re = /^[1-9]+[0-9]*]*$/ ; 
	　　if (!re.test(number)) {
	　　　　return false;
	　　}
	  return true;
	},
	isFloat: function(number) {
	　　var re = /^[0-9]+.?[0-9]*$/; 
	　　if (!re.test(number)) {
	　　　　return false;
	　　}
	  return true;
	},
	isDate: function(number) {
	  var re=/^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01])$/;
	  if (re.test(number)) {
	　　　　return true;
	　　}
	　　re=/^(\d{4})-(0\d{1}|1[0-2])-(0\d{1}|[12]\d{1}|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/; 
	　　if (!re.test(number)) {
	　　　　return false;
	　　}
	  return true;
	},
	/**
	 * 重写list.js的这个方法,解决调用this.reloadPage方法报错的问题。
	 */
	reloadPage: function(param, url) {
		shr.framework.List.superClass.reloadPage.call(this, param, url);
	},
	prepareParam: function(action) {
		var param = shr.framework.List.superClass.prepareParam.call(this);
		return param;
	}
});