shr.defineClass("shr.ats.attendanceFilebatchAdd", shr.ats.AtsBatchTipList,{
    changeRowIds : [],
	attendancePolicyCol : 8 ,
	shiftCol : 14 ,
	attPosition : 18 ,
	initalizeDOM : function () {
		shr.ats.attendanceFilebatchAdd.superClass.initalizeDOM.call(this);
		var _self = this;
		_self.inilzeView();
	}
	
	,onCellSelect:function(rowid,iCol,cellcontent,e){
		var _self = this ;
		var colName = $('#grid').jqGrid('getGridParam', 'colModel')[iCol].name
		colName = colName.indexOf('.') < 0 ? colName : colName.substr(0,colName.lastIndexOf('.'));
		colName == "workCalendar" && _self.setWorkCalendarF7ToGridCell(rowid,iCol,cellcontent,e);
		if(_self.attendancePolicyCol == iCol){
			_self.setAttendancePolicyF7ToGridCell(rowid,iCol,cellcontent,e);
		}else if(_self.shiftCol == iCol){
			_self.setDefaultShiftF7ToGridCell(rowid,iCol,cellcontent,e);
		}else if(16==iCol){
			_self.setPositionF7ToGridCell(rowid,iCol,cellcontent,e);
		}
		else if(11 == iCol||13 == iCol||14 == iCol||18 == iCol){
			_self.addValsOnCellSelectPublicAction(this,iCol,rowid);
		}
	},
	setWorkCalendarF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//考勤制度
		var grid_f7_json = {id:"workCalendar",name:"workCalendar"};
		grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:$.attendmanageI18n.commonRes.calendar,
			uipk:"com.kingdee.eas.hr.ats.app.WorkCalendar.AvailableList.F7",
			query:"",filter:"",
			domain:"",
			multiselect:false,
			onclikFunction: function (ids) {
				var subWidgetName = $(_self).shrPromptBox('option').subWidgetName;
				var $table = $(_self)[subWidgetName]('getTable');
				var ret = $table.jqGrid('getRowData',ids);
				var $grid = $(_self.gridId);
				$grid.jqGrid("setCell",rowid,"workCalendar.id",ret["BaseInfo.id"]);
				$grid.jqGrid("setCell",rowid,"workCalendar.name",ret["BaseInfo.name"]);
			}
		};
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"];		
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";
		grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,
			alias: jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_10,
			widgetType: 'checkbox'}];
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		$(_self).shrPromptBox(grid_f7_json);
		
		$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"]);
		$(_self).shrPromptBox("open");
		
	},
	setAttendancePolicyF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//考勤制度
		var grid_f7_json = {id:"attencePolicy",name:"attencePolicy"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_6,
//			uipk:"com.kingdee.eas.hr.ats.app.AttencePolicy.list",
			uipk:"com.kingdee.eas.hr.ats.app.AttencePolicy.AvailableList.F7",
			query:"",
			filter:"", 
			domain:"",
			multiselect:false, 
			onclikFunction: function (ids) {
				_self.setSelectValueToGridCell(rowid,columnNum,cellcontent,e,ids);
			}
		};
		grid_f7_json.readonly = '';
		grid_f7_json.value = {id:"",name:""};
		grid_f7_json.subWidgetOptions.isHRBaseItem = false;//若为true,specialPromptGrid控件不触发onclikFunction
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["newHROrgUnit.id"];		
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_13,widgetType: "checkbox"}];
		if(_self.uipk == "com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.bacthAttFile"){
			grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["newHROrgUnit.id"];	
		}else{
			grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"];	
		}	
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		$(_self).shrPromptBox(grid_f7_json);
		if(_self.uipk == "com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.bacthAttFile"){
			$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["newHROrgUnit.id"]);
		}else{
			$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"]);
		}
		$(_self).shrPromptBox("open");
		
	/*	
		//【补签卡原因】
		var grid_f7_json = {id : "reason" + i ,name:"reason" + i };
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		var object = $('input[name="reason' + i + '"]');
		grid_f7_json.subWidgetOptions = {
			title : "补签卡原因",
			uipk : "com.kingdee.eas.hr.ats.app.FillSignReason.AvailableList.F7",
			query : ""
		};
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,alias: '显示非常用基础资料',widgetType: 'checkbox'}];
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		object.shrPromptBox(grid_f7_json);
		*/
		
		
		
		
		
	},
	setDefaultShiftF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//默认班次
		
		var grid_f7_json = {id:"atsShift",name:"atsShift"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_8,
//			uipk:"com.kingdee.eas.hr.ats.app.AtsShift.list",
			uipk:"com.kingdee.eas.hr.ats.app.AtsShift.AvailableList.F7",
			query:"",
			filter:"",
			domain:"",
			multiselect:false,
			onclikFunction: function (ids) {
				_self.setSelectValueToGridCell(rowid,columnNum,cellcontent,e,ids);
			}
		};
		grid_f7_json.readonly = '';
		grid_f7_json.value = {id:"",name:""}; 
		grid_f7_json.subWidgetOptions.isHRBaseItem = false;//若为true,specialPromptGrid控件不触发onclikFunction
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_13,widgetType: "checkbox"}];
//		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";
	
		if(_self.uipk == "com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.bacthAttFile"){
			grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["newHROrgUnit.id"];	
		}else{
			grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"];	
		}					
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		
		$(_self).shrPromptBox(grid_f7_json);
		
		if(_self.uipk == "com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.bacthAttFile"){
			$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["newHROrgUnit.id"]);
		}else{
			$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"]);
		}
		$(_self).shrPromptBox("open");
	},
	setSelectValueToGridCell: function(rowid,columnNum,cellcontent,e,ids){
		var _self = this ;
//		var $table = $(_self).shrPromptGrid("getTable");//dialog弹出框再去弹出F7后，shrPromptGrid，gettable调用出错
		var $table = _self.getTable();
		var ret = $table.jqGrid('getRowData',ids);
		var clz = this;
		var $grid = $(clz.gridId);
		if(_self.attendancePolicyCol == columnNum){
			var attencePolicyId   = ret["BaseInfo.id"]; 
			var attencePolicyName = ret["BaseInfo.name"];
			if(attencePolicyId != null && attencePolicyId != ""){
				$grid.jqGrid("setCell",rowid,"AttencePolicy.id",attencePolicyId);
				$grid.jqGrid("setCell",rowid,"AttencePolicy.name",attencePolicyName);
				_self.storeChangeIds(rowid);
			}
		}
		if(_self.shiftCol  == columnNum){ 
			var atsShiftId    = ret["BaseInfo.id"]; 
			var atsShiftName  = ret["BaseInfo.name"];
			if(atsShiftId != null && atsShiftId != ""){
				$grid.jqGrid("setCell",rowid,"AtsShift.id",atsShiftId);
				$grid.jqGrid("setCell",rowid,"AtsShift.name",atsShiftName);
				_self.storeChangeIds(rowid);
			}
		}
		if(_self.attPosition  == columnNum){ 
			var attPositionId    = ret["id"]; 
			var attPositionName  = ret["name"];
			var adminOrgUnitId = "";
			var adminOrgUnitName = "";
			if(attPositionId != null && attPositionName != ""){
				_self.storeChangeIds(rowid);
				var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileEditHandler&method=getOrgUnitByPosition";
				shr.ajax({
					type:"post",
					async:false,
					url:url,
					data:{"positionId": attPositionId},
					success:function(res){
						var info = res;
						adminOrgUnitId=info.adminOrgUnitId;
						adminOrgUnitName=info.adminOrgUnitName;
				    }
				});	
				$grid.jqGrid("setCell",rowid,"attAdminOrgUnit.id",adminOrgUnitId);
				$grid.jqGrid("setCell",rowid,"attAdminOrgUnit.name",adminOrgUnitName);	
				$grid.jqGrid("setCell",rowid,"attPosition.id",attPositionId);
				$grid.jqGrid("setCell",rowid,"attPosition.name",attPositionName);
			}
		}
	},
	setPositionF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//考勤职位
		var grid_f7_json = {id:"attPosition",name:"attPosition"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_5,
			uipk:"com.kingdee.eas.hr.ats.app.AttendanceRange.Position.F7",
			query:"",
			filter:"",
			domain:"",
			multiselect:false,
			onclikFunction: function (ids) {
				_self.setSelectValueToGridCell(rowid,columnNum,cellcontent,e,ids);
			}
		};
		grid_f7_json.subWidgetOptions.isHRBaseItem = false;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["newHROrgUnit.id"];		
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";
		grid_f7_json.subWidgetOptions.filterConfig = {name: '',value: true,alias: '',widgetType: 'no'};
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		$(_self).shrPromptBox(grid_f7_json);
		$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["newHROrgUnit.id"]);
		$(_self).shrPromptBox("open");
	},
	// 先去重
	storeChangeIds : function(rowid){
	    var _self = this ;
		if(_self.changeRowIds.indexOf(rowid) < 0){
		   _self.changeRowIds.push(rowid); 
		}
	}
	
	,inilzeView : function(){
		$('#breadcrumb').empty();
	}
	,saveAndSubmitAction:function(){
			var clz = this;
			var $grid = $(clz.gridId);
			var gridData = $grid.jqGrid("getRowData");
			var realRowData = [] ; 
			for(var i=0;i < clz.changeRowIds.length; i++){
			    realRowData.push($grid.getRowData(clz.changeRowIds[i]));
			}
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsPersonBUBrowseListHandler&method=saveAndSubmit";
			openLoader(1,jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_14);
			shr.ajax({
				type:"post",
				async:true,
				url:url,
				data:{"models":JSON.stringify(realRowData)},
				success:function(res){
					closeLoader();
					var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.shr.base.bizmanage.app.AtsHolidayPersonBURelation&serviceId="+serviceId+"&inFrame=true" ;
					parent.location.href = url ;
			    }
		});		 
		}
		,addValsOnCellSelectPublicAction : function(pageUipk,columnNum,rowid){
		var _self = this;
		$("#iframe2").dialog({
			    title: jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_2,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+55%',
					of: window
				},
				open : function(event, ui) {
				   _self.appendDynamicHTMLOnCellSelect(this,columnNum);
			    },
			    close : function() {
				    $("#iframe2").empty();
			    },
					buttons: [{
						text: jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_2,
						click: function(){
							$(this).disabled = true;
							_self.assginValueOnCellSelectAction(pageUipk,columnNum,rowid);
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					},{
						text: jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_9,
						click: function(){
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					}]
			});	
			$("#iframe2").css({"height":"250px"});
			$("#iframe2").css({"margin-top":"5px"});
	}
	,assginValueOnCellSelectAction : function(pageUipk,columnNum,rowid)
	{
		var _self = this ;
		if (_self.validate()) 
		{
			var clz = this;
			var $grid = $(clz.gridId);	
			var ids = $grid.jqGrid('getDataIDs');
			if(columnNum==5){
				var hrOrgUnit = $("#hrOrgUnit_el").val();
				var hrOrgUnitName = $("#hrOrgUnit").val();
				if(hrOrgUnit!=null&&hrOrgUnit!=""){
					$grid.jqGrid("setCell",rowid,"hrOrgUnit.name",hrOrgUnitName); // displayName
					$grid.jqGrid("setCell",rowid,"hrOrgUnit.id",hrOrgUnit);
				}
			}
			if(columnNum==16){
				var attPositionId = $("#attPosition_el").val();
				var attPositionName = $("#attPosition").val();
				if(attPositionId==null || attPositionId=="" ){
					return false;
				}
				var adminOrgUnitId='';
				var adminOrgUnitName='';
				//根据考勤职位获取考勤地点
				if(attPositionId!=null&&attPositionId!=""){
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileEditHandler&method=getOrgUnitByPosition";
					shr.ajax({
						type:"post",
						async:false,
						url:url,
						data:{"positionId": attPositionId},
						success:function(res){
							var info = res;
							adminOrgUnitId=info.adminOrgUnitId;
							adminOrgUnitName=info.adminOrgUnitName;
					    }
					});		
				}
				$grid.jqGrid("setCell",rowid,"attAdminOrgUnit.id",adminOrgUnitId);
				$grid.jqGrid("setCell",rowid,"attAdminOrgUnit.name",adminOrgUnitName);	
				$grid.jqGrid("setCell",rowid,"attPosition.id",attPositionId);
				$grid.jqGrid("setCell",rowid,"attPosition.name",attPositionName);
			}
			if(columnNum==11){
				var attendanceNum = $("#attendanceNum").val();
				if(attendanceNum!=null&&attendanceNum!=""){
					$grid.jqGrid("setCell",rowid,"file.attendanceNum",attendanceNum);
				}
			}
			if(columnNum==13){
				var isAttendance = $("#isAttendance_el").val();
				var isAttendanceName = $("#isAttendance").val();
				if(isAttendance!=null&&isAttendance!=""){
					$grid.jqGrid("setCell",rowid,"file.isAttendance",{value:isAttendance,alias:isAttendanceName});		
				}
			}
			if(columnNum==12){
				var attencePolicy = $("#attencePolicy_el").val();
				var attencePolicyName = $("#attencePolicy").val();
				if(attencePolicy!=null&&attencePolicy!=""){
					$grid.jqGrid("setCell",rowid,"attencePolicy.id",attencePolicy);
					$grid.jqGrid("setCell",rowid,"attencePolicy.name",attencePolicyName);
				}
			}
//			if(columnNum==13){
//				var atsShift  = $("#atsShift_el").val();
//				var atsShiftName  = $("#atsShift").val();
//				if(atsShift!=null&&atsShift!=""){
//					$grid.jqGrid("setCell",rowid,"atsShift.id",atsShift);
//					$grid.jqGrid("setCell",rowid,"atsShift.name",atsShiftName);
//				}
//			}
			if(columnNum==14){
				var isAutoShift = $("#isAutoShift_el").val();
				var isAutoShiftName = $("#isAutoShift").val();
				if(isAutoShift!=null&&isAutoShift!=""){
					$grid.jqGrid("setCell",rowid,"file.isAutoShift",{value:isAutoShift,alias:isAutoShiftName});		
				}
			}
			if(columnNum==18){
				var effdt = atsMlUtile.getFieldOriginalValue("EFFDT");
				if(effdt!=null&&effdt!=""){
					var oldEffdt=$grid.jqGrid("getCell",rowid,"EFFDT");
					if(pageUipk.uipk=='com.kingdee.eas.hr.ats.app.AttendanceFileBatchMaintain.list'){
						if(new Date(effdt)<new Date(oldEffdt)){
							var personName=$grid.jqGrid("getCell",rowid,"person.name");
							var personNumber=$grid.jqGrid("getCell",rowid,"person.number");
							shr.showInfo({message: shr.formatMsg(jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_0,[personName+personNumber, oldEffdt])});
							return;
						}
					}
					$grid.jqGrid("setCell",rowid,"EFFDT",effdt);
				}
			}
		}
	}
	,appendDynamicHTMLOnCellSelect: function(object,columnNum){
		var that = this;
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
				 + '<div class="row-fluid row-block ">'
				 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_3
			+ '</div></div>'
				 + '</div>'
				 + '<div class="row-fluid row-block ">';
		if(columnNum==5){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_7
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_7
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="hrOrgUnit" name="hrOrgUnit" class="block-father input-height" type="text"  ctrlrole="promptBox" autocomplete="off" title="" ></div>'
		}
		if(columnNum==16){
			 html+='<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_5
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_5
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="attPosition" name="attPosition" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
		}
		if(columnNum==11){
			 html+='<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_4
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_4
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="attendanceNum" name="attendanceNum" class="block-father input-height" type="text"  ctrlrole="text" autocomplete="off" title="" ></div>'
		}
		if(columnNum==13){
			 html+='<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_1
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_1
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input class="block-father input-height cursor-pointer" id="isAttendance" name="isAttendance" validate="" placeholder="" type="text" dataextenal="" ctrlrole="select"></div>'
		}
		if(columnNum==12){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_6
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_6
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="attencePolicy" name="attencePolicy" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
		}
//		if(columnNum==11){
//			 html+= '<div class="col-lg-4"><div class="field_label" title="默认班次">默认班次</div></div>'
//			 + '<div class="col-lg-6 field-ctrl"><input id="atsShift" name="atsShift" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
//		}
		if(columnNum==14){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_11
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_11
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input class="block-father input-height cursor-pointer" id="isAutoShift" name="isAutoShift" validate="" placeholder="" type="text" dataextenal="" ctrlrole="select"></div>'
		}
		if(columnNum==18){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_10
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_10
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="EFFDT" name="EFFDT" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker"></div>'
		}
		 	html+=  '</div>'
				 + '</form>';
		$(object).append(
				 html
				 );
		var defaultAdminOrg = {};
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=getControlAdminOrgUnit";
			shr.ajax({
				type:"post",
				async:false,
				url:url,
				success:function(res){
					defaultAdminOrg.id = res.id;
					defaultAdminOrg.name = res.name;
					$("#adminOrgUnit_longNumber").val(res.longNumber);
			    }
		});
		if(columnNum==5){
			//考勤组织
			grid_f7_json=null;
		    grid_f7_json = {id:"hrOrgUnit",name:"hrOrgUnit"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_7,uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",query:"",filter:"",domain:"",multiselect:false};
			grid_f7_json.readonly = '';
			grid_f7_json.value = {id:"",name:""};
			$('#hrOrgUnit').shrPromptBox(grid_f7_json);	
		}
		if(columnNum==16){
			//考勤职位
			grid_f7_json=null;
		    grid_f7_json = {id:"attPosition",name:"attPosition"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_5,uipk:"com.kingdee.eas.basedata.org.app.Position.F7",query:"",filter:"",domain:"",multiselect:false};
			grid_f7_json.readonly = '';
			grid_f7_json.value = {id:"",name:""};
			$('#attPosition').shrPromptBox(grid_f7_json);	
		}
		if(columnNum==13){
			//打卡考勤
			var select_json = {
				id: "isAttendance",
				readonly: "",
				value: "",
				onChange: null,
				validate: "",
				filter: ""
			};
			select_json.enumSource = 'com.kingdee.eas.hr.ats.IsAttendanceEnum';
			$('#isAttendance').shrSelect(select_json);	
		}
		if(columnNum==12){
			//考勤制度
			grid_f7_json = null;
			grid_f7_json = {id:"attencePolicy",name:"attencePolicy"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_6,uipk:"com.kingdee.eas.hr.ats.app.AttencePolicy.list",query:"",filter:"",domain:"",multiselect:false};
			grid_f7_json.readonly = '';
			grid_f7_json.validate = '';
				grid_f7_json.value = {id:"",name:""};
			$('#attencePolicy').shrPromptBox(grid_f7_json);
		}
		if(columnNum==13){
			//默认班次
			grid_f7_json = null;
		    grid_f7_json = {id:"atsShift",name:"atsShift"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_8,uipk:"com.kingdee.eas.hr.ats.app.AtsShift.list",query:"",filter:"",domain:"",multiselect:false};
			grid_f7_json.readonly = '';
			grid_f7_json.validate = '';
				grid_f7_json.value = {id:"",name:""};
			$('#atsShift').shrPromptBox(grid_f7_json);
		}
		if(columnNum==14){
			//是否自动排班
			select_json = {};
		    select_json = {
				id: "isAutoShift",
				readonly: "",
				value: "",
				onChange: null,
				validate: "",
				filter: ""
			};
			select_json.enumSource = 'com.kingdee.eas.hr.ats.IsAutoShiftEnum';
			$('#isAutoShift').shrSelect(select_json);
		}	
		if(columnNum==18){
			$('#EFFDT').shrDateTimePicker({
				id: "EFFDT",
				tagClass: 'block-father input-height',
				readonly: '',
				yearRange: '',
				ctrlType: "Date",
				isAutoTimeZoneTrans:false,
				validate: '{dateISO:true}'
			});	
		}	
		//要将form加上，数据校验才有用。
	    var formJson = {
			id: "form"
		};
		$('#form').shrForm(formJson);
//		that.processF7ChangeEvent();
	}
	/*
	*原来是继承edit的，改成集成list了没有这个方法了，所以手动加上。
	*/
	,validate: function() {
		$form = $("#form");
		var flag = $form.wafFormValidator("validateForm", true);
		if (!flag) {
			shr.showWarning({
				message: jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_12,
				hideAfter: 5
			});
		}
		
		return flag;
	}
	,submitAndRecievedAction: function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var gridData = [];
		if($grid.jqGrid("getSelectedRows")==0){
			gridData = $grid.jqGrid("getRowData");
		}else{
			var selRowIds = $grid.jqGrid("getSelectedRows");
			for(var i=0;i < selRowIds.length; i++){
		   	  gridData.push($grid.jqGrid("getRowData",selRowIds[i]));
			}
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsPersonBUBrowseListHandler&method=submitAndRecieved";
		openLoader(1,jsBizMultLan.atsManager_attendanceFilebatchAdd_i18n_14);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridData)},
			success: clz.getBatchTipSuccessFun(clz,function(){closeLoader();})
			
//			function(res){
//				closeLoader();
//				if(res.errorMsg != undefined){
//					shr.showError({message: res.errorMsg});
//				}else{
//					localStorage.setItem("marin_attsuccessMsg","成功:"+res.sum+"条,失败:"+res.lose+"条") ;
//					closeLoader();
//					var serviceId = shr.getUrlParam('serviceId') ;
//					var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.shr.base.bizmanage.app.AtsPersonBURelationView&serviceId="+serviceId+"&inFrame=true" ;
//					parent.location.href = url ;
//				}
//		    }
		});		 
	}
	,getTable : function(){
        	return   $("#list2").length == 0 ? $("#list2",parent.dialog_F7grid) : $("#list2") ;
        }
        
        
     /**
	 * 获得查询字段
	 * 没有selector 会取columnmodel导致跟query上的不一致是的列表查询报错，selector给他两个空格就可以了，应该是平台改了列表查询的逻辑，之前都没问题的
	 */
	,getSelector: function() {
		return "  ";
	}
	,getCustomFilterItems: function() {
		if(shr.getUrlParams().selectedID != undefined && shr.getUrlParams().selectedID!="" && shr.getUrlParams().selectedID.length >0){
			return "id in ("+shr.getUrlParams().selectedID+")";		
		}else{
			return null;
		}
	}
});
