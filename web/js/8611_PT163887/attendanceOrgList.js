shr.defineClass("shr.ats.AttendanceOrgList", shr.framework.List, {
	//DynamicList List
	initalizeDOM:function(){
		shr.ats.AttendanceOrgList.superClass.initalizeDOM.call(this);
	},
	savaUpdateDateAction: function(flag){
		var _self = this;
		var iframe2Object = $("#iframe2").contents();
		var attenceStartDate = iframe2Object.find('#attenceStartDate').val();
		var attenceEndDate = iframe2Object.find('#attenceEndDate').val();
		var proposerIds = iframe2Object.find('#proposer_el').val();
		var adminOrgUnitId = iframe2Object.find('#adminOrgUnit_el').val();
		
		if(attenceStartDate == null || attenceStartDate.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceOrgList_i18n_7, hideAfter: 3});
			return false
		}
		
		if(attenceEndDate == null || attenceEndDate.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceOrgList_i18n_4, hideAfter: 3});
			return false
		}
		
		if(proposerIds == null || proposerIds.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceOrgList_i18n_14, hideAfter: 3});
			return false
		}
		if(adminOrgUnitId == null || adminOrgUnitId.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceOrgList_i18n_8, hideAfter: 3});
			return false
		}
		var beginDate = new Date(attenceStartDate.replace(/-/g, "/"));
		var endDate  = new Date(attenceEndDate.replace(/-/g, "/"));
		if(beginDate.getTime() > endDate.getTime()){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceOrgList_i18n_6, hideAfter: 3});
			return false
		}
		
		var url = "";
		if(flag == 'schShift'){
			url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceOrgEditHander&method=schShiftOrgEdit";
		}
		else if(flag = 'attendanceResult'){
			url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceOrgEditHander&method=attenceResultOrgEdit";
		}
		else{
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceOrgList_i18n_0, hideAfter: 3});
			return false
		}
		
		shr.ajax({
			url: url,
			dataType:'json',
			type: "POST",
			data: {
				attenceStartDate :attenceStartDate,
	    		attenceEndDate : attenceEndDate,
	    		proposerIds : proposerIds,
	    		attAdminOrgUnitId : adminOrgUnitId
			},
			beforeSend: function(){
				openLoader(1);
			},
			cache: false,
			success: function(res) {
				location.reload(); 
			},
			error: function(){
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});
	},
	changeAttenceOrg:function(flag){
		var _self = this;
		var uipk = shr.getUrlRequestParam("uipk");
		if(uipk.indexOf("ScheduleShift.list")>-1){
		   flag = "schShift";
		}else if(uipk.indexOf("AttenceResult.list")>-1){
			flag = "attendanceResult";
		}else{
		}
		//$("#iframe2").attr("src",shr.getContextPath()+ '/dynamic.do?method=initalize&attencetype=attenceResult&uipk=com.kingdee.eas.hr.ats.AttendanceOrgEdit');
		$("div#iframe2").dialog({
			modal : true,
			position: [250, 200],
			title : jsBizMultLan.atsManager_attendanceOrgList_i18n_2,
			width : 855,
			minWidth : 825,
			height :220,
			minHeight : 220,
			overlay: {overflow:'auto'}, 
			open : function(event, ui) {
				_self.appendDynamicHTML(this);
				if(flag == "attendanceResult"){
						//考勤结果明细表中原来查询中的姓名就是id=propsoer，弹出的框中员工也是这个id.会导致原来的也变成f7所以要恢复原来的。
						$("#proposer").closest(".ui-text-frame").html('<input id="proposer" class="block-father input-height" ' +
								'type="text" name="proposer" validate="{maxlength:44}" value="" placeholder="" dataextenal="" ' +
								'ctrlrole="text" maxlength="44" style="width: 276px;">');
				}
			},
			close : function() {
				$("#iframe2").empty();
			},
			buttons: [{
				text: jsBizMultLan.atsManager_attendanceOrgList_i18n_12,
				click: function(){
					$(this).disabled = true;
					_self.savaUpdateDateAction(flag);
				}
			},{
				text: jsBizMultLan.atsManager_attendanceOrgList_i18n_9,
				click: function(){
					$("#iframe2").empty();
					$("#iframe2").dialog("close");
				}
			}]
		});
		$("#iframe2").attr("style", "width:850px;height:220px;");
	},
	appendDynamicHTML: function(object){
		var self = this;
		$(object).append('<div class="row-fluid row-block "><div class="col-lg-4"><div class="field_label">'
			+ jsBizMultLan.atsManager_attendanceOrgList_i18n_5
			+ '</div></div><div class="col-lg-6 field-ctrl">'
			 + '<input type="text" dataType="date"  id="attenceStartDate" name="attenceStartDate" value=""/></div>'
			 + '<div class="col-lg-2 field-desc"/>'
			 + '<div class="col-lg-4"><div class="field_label">'
			+ jsBizMultLan.atsManager_attendanceOrgList_i18n_3
			+ '</div></div><div class="col-lg-6 field-ctrl">'
			 + '<input type="text" dataType="date"  id= "attenceEndDate" name="attenceEndDate" value=""/></div></div>'

			 + '<div class="row-fluid row-block "><div class="col-lg-4"><div class="field_label">'
			+ jsBizMultLan.atsManager_attendanceOrgList_i18n_13
			+ '</div></div><div class="col-lg-6 field-ctrl">'
			 + '<input type="text" id="proposer" name="proposer" class="input-height cell-input"  validate="{required:true}"  value=""/></div>'
			 + '<div class="col-lg-2 field-desc"/>'
			 + '<div class="col-lg-4"><div class="field_label">'
			+ jsBizMultLan.atsManager_attendanceOrgList_i18n_1
			+ '</div></div><div class="col-lg-6 field-ctrl">'
			 + '<input type="text" id="adminOrgUnit" name="adminOrgUnit" value="" class="input-height cell-input" validate="{required:true}"/></div></div>'
		 );
					    
	    //【考勤日期】	
		$('input[name="attenceStartDate"]').shrDateTimePicker({
				id : "attenceStartDate",
				tagClass : 'block-father input-height',
				readonly : '',
				yearRange : '',
				ctrlType: "Date",
				isAutoTimeZoneTrans:false,
				validate : '{dateISO:true,required:true}'
		});
		
		 //【考勤日期】	
		$('input[name="attenceEndDate"]').shrDateTimePicker({
				id : "attenceEndDate",
				tagClass : 'block-father input-height',
				readonly : '',
				yearRange : '',
				ctrlType: "Date",
				isAutoTimeZoneTrans:false,
				validate : '{dateISO:true,required:true}'
		});
		
		//【员工】
		var grid_f7_json = {id : "proposer"  ,name:"proposer"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		var proposerObject = $('input[name="proposer"]');
		grid_f7_json.subWidgetOptions = {
			title : jsBizMultLan.atsManager_attendanceOrgList_i18n_11,
			uipk : "com.kingdee.eas.hr.ats.app.ExistFileForAdmin.F7",
			query : "",
			multiselect:true
		};
		grid_f7_json.validate = '{required:true}';
		proposerObject.shrPromptBox(grid_f7_json);
		
		$("#attenceStartDate").change(function(){
			self.changeEvent4AttenceDate();
		});
		$("#attenceEndDate").change(function(e){
			self.changeEvent4AttenceDate();
		});
		
		//组装F7回调式对话框	 
		grid_f7_json= null;
	    grid_f7_json = {id:"adminOrgUnit",name:"adminOrgUnit"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_attendanceOrgList_i18n_10,
			uipk:"com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",
			query:"",
			filter:"", 
			domain:""
		};
		grid_f7_json.validate = '{required:true}';
		var orgUntiObject = $('input[name="adminOrgUnit"]');
		orgUntiObject.shrPromptBox(grid_f7_json);
		
	},
	changeEvent4AttenceDate: function(){
		var startDate = $("#attenceStartDate").val();
		var endDate = $("#attenceEndDate").val();
		var filterStr = "";
		if(startDate != undefined && startDate != "" && endDate != undefined && endDate != ""){
			filterStr = "( scheduleShift.attendDate >= '"+startDate+"' and scheduleShift.attendDate <= '"+endDate+"')";
		}else if(startDate != undefined && startDate != ""){
			filterStr = "( scheduleShift.attendDate >= '"+startDate+"')";
		}else if(endDate != undefined && endDate != ""){
			filterStr = "( scheduleShift.attendDate <= '"+endDate+"')";
		}
		$("#proposer").shrPromptBox("setFilter",filterStr);
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