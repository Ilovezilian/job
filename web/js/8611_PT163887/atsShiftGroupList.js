shr.defineClass("shr.ats.atsShiftGroupList", shr.framework.List, {
	 
	initalizeDOM : function () {
		shr.ats.atsShiftGroupList.superClass.initalizeDOM.call(this);
		var that = this;
		var serviceId = shr.getUrlRequestParam("serviceId");
		var url=shr.getContextPath()+'/dynamic.do?checkLicense=true&uipk=com.kingdee.eas.hr.ats.app.AttendanceGroupShiftForm';
		url += '&serviceId='+encodeURIComponent(serviceId);
		$('#groupAdd').click(function(){
				$("#orgFillDiv").attr("src",url);
//				var gridNum = $("#entries").getGridParam("reccount");
//				$('#hasNum').val(gridNum);
				$('#orgFillDiv').dialog({
						title: jsBizMultLan.atsManager_atsShiftGroupList_i18n_12,
						width: 1020,
						height: 450,
						modal: true,
						resizable: false,
						position: {
							my: 'center',
							at: 'top+20%',
							of: window
						},
						open: function( event, ui ) {
				 		     
				 		},
						buttons:[{
							text: jsBizMultLan.atsManager_atsShiftGroupList_i18n_31,
							click: function() {
								//校验F7数据
								that.savaUpdateDateAction();
							}
						},{
							text: jsBizMultLan.atsManager_atsShiftGroupList_i18n_3,
							click: function() {
								$(this).dialog( "close" );
							}
						}]
				 		
				});
				
			$("#orgFillDiv").attr("style","width:1020px;height:550px;");
			
			
		});
		var hrOrgUnit=shr.shrFastFilter.getFastFilterItemByItemName("hrOrgUnit").values;
		var useId='';
		if(hrOrgUnit){
			
			for(var i=0;i<hrOrgUnit.split(",").length;i++){
				useId=useId+"'"+hrOrgUnit.split(",")[i]+"',";
			}
		}
		if(useId != ''){
		$('#f7-attenceGroup').shrPromptBox("setFilter","hrOrgUse.id in( "+useId.substring(0,useId.length-1)+" )");
		}
		
	},groupAddAction: function(){
	
	
	},addFormAction: function(){
		var that = this;
		that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceGroupShiftAddForm',
			type: 'another'
		});
	
	},atsShiftCopyAction: function(){
		var that = this;
		var beginDateOfSource=$('#attendDate-datestart').shrDateTimePicker('getValue');
		var endDateOfSource=$('#attendDate-dateend').shrDateTimePicker('getValue')
		var serviceId = shr.getUrlRequestParam("serviceId");
		var url=shr.getContextPath()+'/dynamic.do?checkLicense=true&uipk=com.kingdee.eas.hr.ats.app.AttendanceGroupShiftCopy';
		url += '&serviceId='+encodeURIComponent(serviceId);
		url += '&originBeginDate='+encodeURIComponent(beginDateOfSource);
		url += '&originEndDate='+encodeURIComponent(endDateOfSource);
				$("#orgFillDiv").attr("src",url);
//				var gridNum = $("#entries").getGridParam("reccount");
//				$('#hasNum').val(gridNum);
				$('#orgFillDiv').dialog({
						title: jsBizMultLan.atsManager_atsShiftGroupList_i18n_11,
						width: 1100,
						height: 650,
						modal: true,
						resizable: false,
						position: {
							my: 'center',
							at: 'top+20%',
							of: window
						},
						open: function( event, ui ) {
				 		     
				 		},
						buttons:[{
							text: jsBizMultLan.atsManager_atsShiftGroupList_i18n_31,
							click: function() {
								//校验F7数据
								that.copyUpdateDateAction();
							}
						},{
							text: jsBizMultLan.atsManager_atsShiftGroupList_i18n_3,
							click: function() {
								$(this).dialog( "close" );
							}
						}]
				 		
				});
				
			$("#orgFillDiv").attr("style","width:1020px;height:600px;");
		
	
	},
	
	savaUpdateDateAction: function(){
		var that = this;
		var a = /^(\d{4})-(\d{2})-(\d{2})$/;
		var attenceGroup_el = $(window.frames["orgFillDiv"].document).find("#attenceGroup_el").val();
//		var attenceGroup_el = window.frames["orgFillDiv"].document.$("#attenceGroup").shrPromptBox("getValue").map(function(select){
//			return select.id;
//		});
		var workCalendar= $(window.frames["orgFillDiv"].document).find("#workCalendar_el").val();
		var putOff = $(window.frames["orgFillDiv"].document).find("#putOff").is(":checked");
		var hrOrgUnit_el = $(window.frames["orgFillDiv"].document).find("#hrOrgUnit_el").val();
		var adminOrgUnit_el = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit_el").val();
		var startTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("beginDate");
		var endTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("endDate");
		var Postpone_el = $(window.frames["orgFillDiv"].document).find("#holidayHandle_el").val();
		var turnShift_el = $(window.frames["orgFillDiv"].document).find("#turnShift_el").val();
		var shiftByTurnSegment = $(window.frames["orgFillDiv"].document).find("input[name=TextNum]").val();
		if(attenceGroup_el == null || attenceGroup_el.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_10, hideAfter: 3});
			return false
		}
//		if(number == null || number.length == 0){
//			shr.showInfo({message: "编码不能为空!", hideAfter: 3});
//			return false
//		}
		if(hrOrgUnit_el == null || hrOrgUnit_el.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_9, hideAfter: 3});
			return false
		}
//		if(adminOrgUnit_el == null || adminOrgUnit_el.length == 0){
//			shr.showInfo({message: "行政组织不能为空!", hideAfter: 3});
//			return false
//		}
		if(putOff==false){
		if(startTime == null || startTime.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_7, hideAfter: 3});
			return false
		}
		if (!a.test(startTime)) { 
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_8, hideAfter: 3});
			return false
		}
	
		if(turnShift_el == null || turnShift_el.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_15, hideAfter: 3});
			return false
		}
		if(!shiftByTurnSegment.trim() || shiftByTurnSegment == 0){
				shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_18, hideAfter: 3});
				return;
			}
			
		if(isNaN(shiftByTurnSegment)){
				shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_16, hideAfter: 3});
				return;
			}
		if(shiftByTurnSegment.trim() - 0 > $(window.frames["orgFillDiv"].document).find("#turnShiftEntryInfo").attr("maxSegment") - 0) {
				shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_17, hideAfter: 3});
				return;
			}
		}
		if(endTime == null || endTime.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_4, hideAfter: 3});
			return false
		}
		if (!a.test(endTime)) { 
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_5, hideAfter: 3});
			return false
		}
		var regEx = new RegExp("\\-","gi"); //i不区分大小写 g匹配所有
	 	var tripStartTime = startTime;
		var tripEndTime = endTime;
		tripStartTime = tripStartTime.replace(regEx,"/");
		tripEndTime = tripEndTime.replace(regEx,"/");
		 
		var tripStartTimeOfDate = new Date(tripStartTime); 
	 	var tripEndTimeOfDate = new Date(tripEndTime);
	 	var longTime = tripEndTimeOfDate.getTime() - tripStartTimeOfDate.getTime();
	 	if (longTime < 0) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_6});
			return false;
	 	}
		if(workCalendar == null || workCalendar.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_2, hideAfter: 3});
			return false
		}
//		if(workCalendar_el == null || workCalendar_el.length == 0){
//			shr.showInfo({message: "工作日历不能为空!", hideAfter: 3});
//			return false
//		}
//		if(atsShift_el == null || atsShift_el.length == 0){
//			shr.showInfo({message: "班次不能为空!", hideAfter: 3});
//			return false
//		}
		openLoader(1,jsBizMultLan.atsManager_atsShiftGroupList_i18n_32);
		that.remoteCall({
				type:"post",
				method:"arrangeShiftByTurn",
				param:{
				hrOrgUnit_el :hrOrgUnit_el,
	    		adminOrgUnit_el : adminOrgUnit_el,
	    		startTime : startTime,
	    		endTime:endTime,
	    		attenceGroup_el:shr.toJSON(attenceGroup_el.split(",")),
	    		putOff:putOff,
	    		Postpone_el:Postpone_el,
	    		workCalendar:workCalendar,
	    		turnShift_el:turnShift_el,
	    		shiftByTurnSegment:shiftByTurnSegment
				},
				async: false, 
				success:function(res){
					closeLoader();
					if(res.errorMsg !=""){
					
					shr.showWarning({message: res.errorMsg,hideAfter:6});
					}else{
					jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
					$("#orgFillDiv").dialog("close");
//					parent.location.reload();
					$(that.gridId).jqGrid("reloadGrid");
					shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_0,hideAfter:6});
					}
				}
			});

	
	},
	
	copyUpdateDateAction: function(){
		var that = this;
		var a = /^(\d{4})-(\d{2})-(\d{2})$/;
		var hrOrgUnit = $(window.frames["orgFillDiv"].document).find("#hrOrgUnit_el").val();
		var beginDateOfSource= window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("beginDateOfSource");
		var endDateOfSource= window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("endDateOfSource");
		var attenceGroup = $(window.frames["orgFillDiv"].document).find("#attenceGroup_el").val();
		var attenceGroupSource = $(window.frames["orgFillDiv"].document).find("#attenceGroupSource_el").val();
		var beginDateOfTarget= window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("beginDateOfTarget");
		var endDateOfTarget= window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("endDateOfTarget");
		var Postpone = $(window.frames["orgFillDiv"].document).find("#Postpone_el").val();
		var workCalendar = $(window.frames["orgFillDiv"].document).find("#workCalendar_el").val();
		if(attenceGroupSource == null || attenceGroupSource.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_24, hideAfter: 3});
			return false
		}
		if(attenceGroup == null || attenceGroup.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_30, hideAfter: 3});
			return false
		}
		if(hrOrgUnit == null || hrOrgUnit.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_9, hideAfter: 3});
			return false
		}
		if(beginDateOfSource == null || beginDateOfSource.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_23, hideAfter: 3});
			return false
		}
		if(endDateOfSource == null || endDateOfSource.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_21, hideAfter: 3});
			return false
		}
		if(beginDateOfTarget == null || beginDateOfTarget.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_29, hideAfter: 3});
			return false
		}
		if(endDateOfTarget == null || endDateOfTarget.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_27, hideAfter: 3});
			return false
		}
		if(Postpone == null || Postpone.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_26, hideAfter: 3});
			return false
		}
		if(workCalendar == null || workCalendar.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_25, hideAfter: 3});
			return false
		}
		if(!atsCommonUtile.validateDateByConfig(beginDateOfTarget, endDateOfTarget, {
				smallName: jsBizMultLan.atsManager_atsShiftGroupList_i18n_20,
				bigName: jsBizMultLan.atsManager_atsShiftGroupList_i18n_19
			}, true)) {
			return;
		}
		if(!atsCommonUtile.validateDateByConfig(beginDateOfSource, endDateOfSource, {
				smallName: jsBizMultLan.atsManager_atsShiftGroupList_i18n_14,
				bigName: jsBizMultLan.atsManager_atsShiftGroupList_i18n_13
			}, true)) {
			return;
		}
		var regEx = new RegExp("\\-","gi"); //i不区分大小写 g匹配所有
	 	var tripStartTime = beginDateOfSource;
		var tripEndTime = endDateOfSource;
		tripStartTime = tripStartTime.replace(regEx,"/");
		tripEndTime = tripEndTime.replace(regEx,"/");
		 
		var tripStartTimeOfDate = new Date(tripStartTime); 
	 	var tripEndTimeOfDate = new Date(tripEndTime);
	 	var longTime = tripEndTimeOfDate.getTime() - tripStartTimeOfDate.getTime();
	 	if (longTime < 0) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_22});
			return false;
	 	}
	 	var tripStartTime = beginDateOfTarget;
		var tripEndTime = endDateOfTarget;
		tripStartTime = tripStartTime.replace(regEx,"/");
		tripEndTime = tripEndTime.replace(regEx,"/");
		 
		var tripStartTimeOfDate = new Date(tripStartTime); 
	 	var tripEndTimeOfDate = new Date(tripEndTime);
	 	var longTime = tripEndTimeOfDate.getTime() - tripStartTimeOfDate.getTime();
	 	if (longTime < 0) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_28});
			return false;
	 	}
		that.remoteCall({
				type:"post",
				method:"arrangeShiftByCopy",
				param:{
				hrOrgUnit :hrOrgUnit,
	    		attenceGroup_el : shr.toJSON(attenceGroup.split(",")),
	    		attenceGroupSource : attenceGroupSource,
//	    		attenceGroup : shr.toJSON(attenceGroup.split(",")),
	    		beginDateOfTarget:beginDateOfTarget,
	    		endDateOfTarget:endDateOfTarget,
	    		beginDateOfSource:beginDateOfSource,
	    		Postpone:Postpone,
	    		workCalendar:workCalendar,
	    		endDateOfSource:endDateOfSource
	    		
				},
				async: false, 
				success:function(res){
					if(res.errorMsg !=""){
					jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
					$("#orgFillDiv").dialog("close");
					
					shr.showWarning({message: res.errorMsg,hideAfter:10});
					$('#fastFilter-area').find('button#filter-search').trigger('click');
//					parent.location.reload();
					}else{
					jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
					$("#orgFillDiv").dialog("close");
//					parent.location.reload();
//					shr.showInfo({message: "复制排班成功!"});
					$(that.gridId).jqGrid("reloadGrid");
					shr.showInfo({message: jsBizMultLan.atsManager_atsShiftGroupList_i18n_1,hideAfter:6});
					$('#fastFilter-area').find('button#filter-search').trigger('click');
					}
				}
			});

	
	}
	
	
});

