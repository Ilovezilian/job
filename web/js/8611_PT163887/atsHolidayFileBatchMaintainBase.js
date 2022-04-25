shr.defineClass("shr.ats.atsHolidayFileBatchMaintainBase", shr.framework.List, {
	initalizeDOM:function(){
		shr.ats.atsHolidayFileBatchMaintainBase.superClass.initalizeDOM.call(this);
	},
	 
	onCellSelect:function(rowid,iCol,cellcontent,e){
		var _self = this ;
		var colName = $('#grid').jqGrid('getGridParam', 'colModel')[iCol].name
		colName = colName.indexOf('.') < 0 ? colName : colName.substr(0,colName.lastIndexOf('.'));
		colName && "workCalendar,calendar,".indexOf(colName) > -1 && _self.setWorkCalendarF7ToGridCell(rowid,colName,cellcontent,e);
		if(iCol==5||iCol==6||iCol==9){
			if(iCol == 5){
				_self.setHrOrgUnitF7ToGridCell(rowid,iCol,cellcontent,e);
			}else if(iCol==6 ){
				_self.setHolidayPolicySetF7ToGridCell(rowid,iCol,cellcontent,e);
			}else{
			 	_self.addValsOnCellSelectPublicAction(this,iCol,rowid);
			}
		}
	},
	
	setHrOrgUnitF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//假期业务组织
		var grid_f7_json = {id:"hrOrgUnit",name:"hrOrgUnit"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_3,
			uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",
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
		$(_self).shrPromptBox(grid_f7_json);
		$(_self).shrPromptBox("open");
	},
	setSelectValueToGridCell: function(rowid,columnNum,cellcontent,e,ids){
		var _self = this ;
		if(columnNum==6){
			var $table = $(_self).specialPromptGrid("getTable");
		}else{
			var $table = $(_self).shrPromptGrid("getTable");			
		}
		var ret = $table.jqGrid('getRowData',ids);
		var clz = this;
		var $grid = $(clz.gridId);
		if(columnNum == 5){
			var hrOrgUnitId = ret.id;
			var hrOrgUnitName = ret.name;
			if(hrOrgUnitId != null && hrOrgUnitId != ""){
				$grid.jqGrid("setCell",rowid,"hrOrgUnit.name",hrOrgUnitName); //displayName
				$grid.jqGrid("setCell",rowid,"hrOrgUnit.id",hrOrgUnitId);
				$grid.jqGrid("setCell",rowid,"holidayPolicySet.name",null);
				$grid.jqGrid("setCell",rowid,"holidayPolicySet.id",null);
			}
		}
		if(columnNum==6){
			var holidayPolicySetId = ret["BaseInfo.id"];;
			var holidayPolicySetName = ret["BaseInfo.name"];;
			if(holidayPolicySetId != null && holidayPolicySetId != ""){
				$grid.jqGrid("setCell",rowid,"holidayPolicySet.id",holidayPolicySetId);
				$grid.jqGrid("setCell",rowid,"holidayPolicySet.name",holidayPolicySetName);
			}
		}
	},
	setHolidayPolicySetF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//考勤制度
		var grid_f7_json = {id:"holidayPolicySet",name:"holidayPolicySet"};
		grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_5,
			uipk:"com.kingdee.eas.hr.ats.app.HolidayPolicySet.F7",
			query:"",filter:"",
			domain:"",
			multiselect:false,
			onclikFunction: function (ids) {
				_self.setSelectValueToGridCell(rowid,columnNum,cellcontent,e,ids);
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
	
	setWorkCalendarF7ToGridCell: function(rowid,colName,cellcontent,e){
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
				$grid.jqGrid("setCell",rowid,colName + ".id",ret["BaseInfo.id"]);
				$grid.jqGrid("setCell",rowid,colName + ".name",ret["BaseInfo.name"]);
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
	
	assginValueAction : function(pageUipk)
	{
		var _self = this ;
		if (_self.validate() && _self.verify()) 
		{
			var hrOrgUnit = $("#hrOrgUnit_el").val();
			var hrOrgUnitName = $("#hrOrgUnit").val();
			var pageUipk = pageUipk;
			var holidayPolicy = $("#holidayPolicySet_el").val();
			var holidayPolicyName = $("#holidayPolicySet").val();
			var effdt = atsMlUtile.getFieldOriginalValue("EFFDT");
			var clz = this;
			var $grid = $(clz.gridId);
			var ids = $grid.jqGrid('getDataIDs');
			for(var i=0;i<ids.length;i++){
				if(hrOrgUnit!=null&&hrOrgUnit!=""){
					$grid.jqGrid("setCell",ids[i],"hrOrgUnit.name",hrOrgUnitName); //displayName
					$grid.jqGrid("setCell",ids[i],"hrOrgUnit.id",hrOrgUnit);
				}
				if(holidayPolicy!=null&&holidayPolicy!=""){
					$grid.jqGrid("setCell",ids[i],"holidayPolicySet.id",holidayPolicy);
					$grid.jqGrid("setCell",ids[i],"holidayPolicySet.name",holidayPolicyName);
				}
				if(effdt!=null&&effdt!=""){
					var oldEffdt=$grid.jqGrid("getCell",ids[i],"EFFDT");
					if(pageUipk=='com.kingdee.eas.hr.ats.app.AtsHolidayFileBatchMaintain.list'){
						if(new Date(effdt)<new Date(oldEffdt)){
							var personName=$grid.jqGrid("getCell",ids[i],"person.name");
							var personNumber=$grid.jqGrid("getCell",ids[i],"person.number");
							shr.showInfo({message: shr.formatMsg(jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_0, [personName, personNumber, oldEffdt])});
							return;
						}
					}
					$grid.jqGrid("setCell",ids[i],"EFFDT",effdt);
				}
			}
		}
	},
	assginValueOnCellSelectAction : function(pageUipk,columnNum,rowid)
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
					$grid.jqGrid("setCell",rowid,"hrOrgUnit.name",hrOrgUnitName);//displayName
					$grid.jqGrid("setCell",rowid,"hrOrgUnit.id",hrOrgUnit);
				}
			}
			if(columnNum==6){
				var holidayPolicySet = $("#holidayPolicySet_el").val();
				var holidayPolicySetName = $("#holidayPolicySet").val();
				if(holidayPolicySet!=null&&holidayPolicySet!=""){
					$grid.jqGrid("setCell",rowid,"holidayPolicySet.id",holidayPolicySet);
					$grid.jqGrid("setCell",rowid,"holidayPolicySet.name",holidayPolicySetName);
				}
			}
			if(columnNum==9){
				var effdt = atsMlUtile.getFieldOriginalValue("EFFDT");
				if(effdt!=null&&effdt!=""){
					var oldEffdt=$grid.jqGrid("getCell",rowid,"EFFDT");
					if(pageUipk.uipk=='com.kingdee.eas.hr.ats.app.AtsHolidayFileBatchMaintain.list'){
						if(new Date(effdt)<new Date(oldEffdt)){
							var personName=$grid.jqGrid("getCell",rowid,"person.name");
							var personNumber=$grid.jqGrid("getCell",rowid,"person.number");
							shr.showInfo({message: shr.formatMsg(jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_0, [personName, personNumber, oldEffdt])});
							return;
						}
					}
					$grid.jqGrid("setCell",rowid,"EFFDT",effdt);
				}
			}
		}
	},
	/**
	 * 对保存、提交的数据进行确认
	 */
	verify: function() {
		var hrOrgUnit = $("#hrOrgUnit_el").val();
		var holidayPolicySet = $("#holidayPolicySet_el").val();
		var effdt = atsMlUtile.getFieldOriginalValue("EFFDT");
		if(hrOrgUnit || holidayPolicySet || effdt){
			return true;
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_4});
			return false;
		}
	},
	processF7ChangeEvent : function(){ 
		var that = this;
		/*$('input[name=adminOrgUnit]').shrPromptBox("option", {
			onchange : function(e, value) {
			   var info = value.current;
			   if(info!=null){
			   if(info.longNumber !=null && info.longNumber!=''){ 
			   		$("#adminOrgUnit_longNumber").val(info.longNumber);
			   }
			 }
			}
		});*/
	},
	/*
	* 弹出批量赋值的框
	*/
	addValsPublicAction : function(pageUipk){
		var _self = this;
		$(".ui-dialog-buttonset").parent().remove();
		$("#iframe2").dialog({
			    title: jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_6,
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
				   _self.appendDynamicHTML(this,pageUipk);
			    },
			    close : function() {
				    $("#iframe2").empty();
			    }
			});	
			$("#iframe2").css({"height":"200px"});
			$("#iframe2").css({"margin-top":"5px"});
	},
	addValsOnCellSelectPublicAction : function(pageUipk,columnNum,rowid){
		var _self = this;
		$("#iframe2").dialog({
			    title: jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_1,
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
					buttons:[{
						text: jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_1,
						click: function(){
							$(this).disabled = true;
							_self.assginValueOnCellSelectAction(pageUipk,columnNum,rowid);
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					},{
						text: jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_7,
						click: function(){
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					}]
			});	
			$("#iframe2").css({"height":"250px"});
			$("#iframe2").css({"margin-top":"5px"});
	},
	appendDynamicHTML: function(object,pageUipk){
		var that = this;
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate" style="padding-left:50px;">'
				 + '<div class="row-fluid row-block ">'
				 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_2 
				 + '</div></div>'
				 + '</div>'
				 + '<div class="row-fluid row-block "><div class="row-fluid row-block ">'
				 + '<div class="col-lg-4" style="text-align:center;"><div class="field_label" title="' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_3 
				 + '">' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_3 
				 + '</div></div>'
				 + '<div class="col-lg-6 field-ctrl"><input id="hrOrgUnit" name="hrOrgUnit" class="block-father input-height" type="text"  ctrlrole="promptBox" autocomplete="off" title="" ></div>'
				 + '</div>'
				 + '<div class="col-lg-4" style="text-align:center;"><div class="field_label" title="' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_5 
				 + '">' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_5 
				 + '</div></div>'
				 + '<div class="col-lg-6 field-ctrl"><input id="holidayPolicySet" name="holidayPolicySet" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
				 + '</div>'
				 + '<div class="row-fluid row-block ">'
				 + '<div class="col-lg-4" style="text-align:center;"><div class="field_label" title="' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_8 
				 + '">' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_8 
				 + '</div></div>'
				 + '<div class="col-lg-6 field-ctrl"><input id="EFFDT" name="EFFDT" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker"></div>'
				 + '</div>'
				 + '<div class="row-fluid row-block" style="height:30px"></div>'
				 + '<div class="row-fluid row-block " style="display: flex;justify-content: flex-end;padding-right: 80px;">'
				 + '<button type="button" class="shrbtn-primary shrbtn" name="' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_6
				 + '" id="batchAddVal">' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_6 
				 + ' </button>'
				 + '<button type="button" class="shrbtn-primary shrbtn" name="' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_7 
				 + '" id="cancle">' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_7 
				 + '</button>'
				 + '</div>'
				 
				 + '</form>'
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
			
			
		$('button[id^=batchAddVal]').click(function() {
			jsBinder.disabled = true;
			jsBinder.assginValueAction(pageUipk);
			$("#iframe2").empty();
			$("#iframe2").dialog("close");
		});
		
		$('button[id^=cancle]').click(function() {
			$("#iframe2").empty();
			$("#iframe2").dialog("close");
		});	
				
			
		//假期业务组织
		grid_f7_json=null;
	    grid_f7_json = {id:"hrOrgUnit",name:"hrOrgUnit"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_3,
				uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",query:"",filter:"",domain:"",multiselect:false};
		grid_f7_json.readonly = '';
		grid_f7_json.value = {id:"",name:""};
		$('#hrOrgUnit').shrPromptBox(grid_f7_json);		
		//考勤制度
		grid_f7_json = null;
		grid_f7_json = {id:"holidayPolicySet",name:"holidayPolicySet"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_5,
				uipk:"com.kingdee.eas.hr.ats.app.HolidayPolicySet.F7",query:"",filter:"",domain:"",multiselect:false};
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,
			alias: jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_10,
			widgetType: 'checkbox'}];
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '';
		grid_f7_json.value = {id:"",name:""};
		grid_f7_json.subWidgetName = 'specialPromptGrid';	
		$('#holidayPolicySet').shrPromptBox(grid_f7_json);

		$('#EFFDT').shrDateTimePicker({
			id: "EFFDT",
			tagClass: 'block-father input-height',
			readonly: '',
			yearRange: '',
			ctrlType: "Date",
			isAutoTimeZoneTrans:false,
			validate: '{dateISO:true}'
		});	
		//要将form加上，数据校验才有用。
	    var formJson = {
			id: "form"
		};
		$('#form').shrForm(formJson);
		that.processF7ChangeEvent();
	},
	appendDynamicHTMLOnCellSelect: function(object,columnNum){
		var that = this;
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
				 + '<div class="row-fluid row-block ">'
				 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_2 
				 + '</div></div>'
				 + '</div>'
				 + '<div class="row-fluid row-block ">';
		if(columnNum==5){
			 html+= '<div class="col-lg-4"><div class="field_label" title="' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_3 
				 + '">' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_3 
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="hrOrgUnit" name="hrOrgUnit" class="block-father input-height" type="text"  ctrlrole="promptBox" autocomplete="off" title="" ></div>'
		}
		if(columnNum==6){
			 html+= '<div class="col-lg-4"><div class="field_label" title="' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_5 
				 + '">' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_5 
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="holidayPolicySet" name="holidayPolicySet" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
		}
		if(columnNum==9){
			 html+= '<div class="col-lg-4"><div class="field_label" title="' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_8 
				 + '">' 
				 + jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_8 
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="EFFDT" name="EFFDT" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker"></div>'
		}
		 	html+=  '</div>'
				 + '</form>';
		$(object).append(html);
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
			//假期业务组织
			grid_f7_json=null;
		    grid_f7_json = {id:"hrOrgUnit",name:"hrOrgUnit"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_3,
					uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",query:"",filter:"",domain:"",multiselect:false};
			grid_f7_json.readonly = '';
			grid_f7_json.value = {id:"",name:""};
			$('#hrOrgUnit').shrPromptBox(grid_f7_json); 	
			//$('#grid_hrOrgUnit.displayName').shrPromptBox(grid_f7_json);	
		}
		if(columnNum==6){
			//考勤制度
			grid_f7_json = null;
			grid_f7_json = {id:"holidayPolicySet",name:"holidayPolicySet"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_5,
					uipk:"com.kingdee.eas.hr.ats.app.HolidayPolicySet.list",query:"",filter:"",domain:"",multiselect:false};
			grid_f7_json.readonly = '';
			grid_f7_json.validate = '';
				grid_f7_json.value = {id:"",name:""};
			$('#holidayPolicySet').shrPromptBox(grid_f7_json);
		}
		if(columnNum==9){
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
		that.processF7ChangeEvent();
	},
	/*
	*原来是继承edit的，改成集成list了没有这个方法了，所以手动加上。
	*/
	validate: function() {
		$form = $("#form");
		var flag = $form.wafFormValidator("validateForm", true);
		if (!flag) {
			shr.showWarning({
				message: jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_9,
				hideAfter: 5
			});
		}
		
		return flag;
	},
	/**
	 * 表格加载完成
	 */
	gridLoadComplete: function(ret) {
		//把不可编辑的列背景色置为淡灰色
		$("td[aria-describedby='grid_person.number']").css("background-color","lightgrey");
		$("td[aria-describedby='grid_person.name']").css("background-color","lightgrey");
		$("td[aria-describedby='grid_adminOrgUnit.displayName']").css("background-color","lightgrey");
		$("td[aria-describedby='grid_primaryPosition.name']").css("background-color","lightgrey");//批量维护列表
		$("td[aria-describedby='grid_position.name']").css("background-color","lightgrey");//假期档案、未建档案>生成档案列表
	}
});



