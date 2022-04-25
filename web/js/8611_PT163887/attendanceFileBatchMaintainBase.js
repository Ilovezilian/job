var isEdit=false;
shr.defineClass("shr.ats.attendanceFileBatchMaintainBase", shr.framework.List, {
	initalizeDOM:function(){
		$(this.gridId).jqGrid("option","rowNum",200);
		shr.ats.attendanceFileBatchMaintainBase.superClass.initalizeDOM.call(this);
		var self = this ;
		var $grid = $(self.gridId);
		$grid.jqGrid('option', {
			onPaging: function(pgButton) {
				if(isEdit==false){
					return '';
				}
				shr.showConfirm(jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_16, function(){
					isEdit=false;
					if(pgButton=='prev_gridPager'){
						$("#prev_gridPager").click();
					}
					else if(pgButton=='next_gridPager'){
						$("#next_gridPager").click();
					}
					//手动输入页数
					else if(pgButton=='user'){
						var page=$('.ui-pg-input').val();
						$grid.setGridParam({page:page}).reloadGrid();
					}
					//修改每页显示个数
					else if(pgButton=='records'){
						var rowNum =$('.ui-pg-selbox').val();
						$grid.setGridParam({rowNum:rowNum}).reloadGrid();
					}
				});
				var $table = $(_self).shrPromptGrid("getTable");
				return 'stop';
			}			
		});
	},
	/**
	 * 表格加载完成
	 */
	gridLoadComplete: function(ret) {
		var viewPage = shr.getCurrentViewPage();
		if (viewPage.selectedRowId) {
			$(viewPage.gridId).jqGrid('setSelection', viewPage.selectedRowId);
			viewPage.selectedRowId = null;
		}
		
		// setGridHeight
		viewPage.setGridHeight();
		//把不可编辑的列背景色置为淡灰色
		$("td[aria-describedby='grid_person.number']").css("background-color","lightgrey");
		$("td[aria-describedby='grid_person.name']").css("background-color","lightgrey");
		$("td[aria-describedby='grid_adminOrgUnit.displayName']").css("background-color","lightgrey");
		$("td[aria-describedby='grid_position.name']").css("background-color","lightgrey");
		$("td[aria-describedby='grid_attAdminOrgUnit.displayName']").css("background-color","lightgrey");
	},
	onCellSelect:function(rowid,iCol,cellcontent,e){
		var _self = this ;
		//可编辑字段有：考勤业务组织、考勤地点、考勤职位、考勤编号、是否打卡考勤、考勤制度、默认班次、是否自动排班、生效日期
		var colName = $('#grid').jqGrid('getGridParam', 'colModel')[iCol].name;
		colName = colName.substr(0,colName.lastIndexOf('.'));
		colName && "workCalendar,calendar,".indexOf(colName) > -1 && _self.setWorkCalendarF7ToGridCell(rowid,colName,cellcontent,e);
		if(iCol==5||iCol==7||iCol==8||iCol==9||iCol==10||iCol==13||iCol==14||iCol==15){
			
			if(iCol == 8){//考勤编码，如果有编码规则，不允许修改
				var isCodingRule=_self.initData.custom_params.isCodingRule;
				if(isCodingRule!=undefined && !(isCodingRule=="false")){
					return;
				}
			}

			if(iCol == 5){//考勤业务组织
				_self.setHrOrgUnitF7ToGridCell(rowid,iCol,cellcontent,e);
			}else if(iCol == 7){//职位，并由考勤职位带出考勤地点
				_self.setPositionF7ToGridCell(rowid,iCol,cellcontent,e);
			}else if(iCol == 10){//考勤制度
				_self.setAttendancePolicyF7ToGridCell(rowid,iCol,cellcontent,e);
			}else if(iCol == 13){//默认班次
				_self.setDefaultShiftF7ToGridCell(rowid,iCol,cellcontent,e);
			}
			/*else if(iCol == 9){ //打卡考勤
				_self.setIsAttendanceToGridCell(rowid,iCol,cellcontent,e);
			}else if(iCol == 13){ //生效日期
				_self.setEFFDTToGridCell(rowid,iCol,cellcontent,e);
			}*/
			else{
			 	_self.addValsOnCellSelectPublicAction(this,iCol,rowid);
			}
			
			
		}
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
	
	cancelAllAction : function(){
		history.back();
	},
	setHrOrgUnitF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//考勤业务组织
		
		//<field name="hrOrgUnit" label="考勤业务组织"  required="true"  
		//uipk="com.kingdee.eas.basedata.org.app.HROrgUnit.F7" 
		//filterConfig="[{name: 'isSealUp',value:0,alias: '显示已封存业务组织',widgetType: 'checkbox'}]" 
		//afterOnchangeClearFields="entries.tripType" ></field>
		
		var grid_f7_json = {id:"hrOrgUnit",name:"hrOrgUnit"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_5,
			//uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",
			uipk:"com.kingdee.eas.basedata.org.app.AttHROrgUnit.F7",
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
		var $table;
		if(columnNum == 10 || columnNum == 13||columnNum==7){
		   $table = $(_self).specialPromptGrid("getTable");			
		}else{
		   $table = $(_self).shrPromptGrid("getTable");
		}
		var ret = $table.jqGrid('getRowData',ids);
		var clz = this;
		var $grid = $(clz.gridId);
		if(columnNum == 5){
			var hrOrgUnitId = ret.id;
			var hrOrgUnitName = ret.name;
			if(hrOrgUnitId != null && hrOrgUnitId != ""){
				$grid.jqGrid("setCell",rowid,"hrOrgUnit.name",hrOrgUnitName); // displayName
				$grid.jqGrid("setCell",rowid,"hrOrgUnit.id",hrOrgUnitId);
				if(ret.name != cellcontent){
					$grid.jqGrid("setCell",rowid,"attAdminOrgUnit.id",null);
					$grid.jqGrid("setCell",rowid,"attAdminOrgUnit.displayName",null);	
					$grid.jqGrid("setCell",rowid,"attPosition.id",null);
					$grid.jqGrid("setCell",rowid,"attPosition.name",null);
					$grid.jqGrid("setCell",rowid,"attencePolicy.id",null);
					$grid.jqGrid("setCell",rowid,"attencePolicy.name",null);	
					$grid.jqGrid("setCell",rowid,"atsShift.id",null);
					$grid.jqGrid("setCell",rowid,"atsShift.name",null);
				}
			}
		}
		if(columnNum==7){
			 	var attPositionId = ret.id;
				var attPositionName = ret.name;
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
				$grid.jqGrid("setCell",rowid,"attAdminOrgUnit.displayName",adminOrgUnitName);	
				$grid.jqGrid("setCell",rowid,"attPosition.id",attPositionId);
				$grid.jqGrid("setCell",rowid,"attPosition.name",attPositionName);
		}
		if(columnNum == 10){
			var attencePolicyId   = ret["BaseInfo.id"];
			var attencePolicyName = ret["BaseInfo.name"];
			if(attencePolicyId!=null&&attencePolicyId!=""){
				$grid.jqGrid("setCell",rowid,"attencePolicy.id",attencePolicyId);
				$grid.jqGrid("setCell",rowid,"attencePolicy.name",attencePolicyName);
			}
		}
		if(columnNum==13){
			var atsShiftId    = ret["BaseInfo.id"];;
			var atsShiftName  = ret["BaseInfo.name"];
			if(atsShiftId!=null&&atsShiftId!=""){
				$grid.jqGrid("setCell",rowid,"atsShift.id",atsShiftId);
				$grid.jqGrid("setCell",rowid,"atsShift.name",atsShiftName);
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
			title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_6,
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
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"];		
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";
		grid_f7_json.subWidgetOptions.filterConfig = {name: '',value: true,alias: '',widgetType: 'no'};
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
			title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_7,
			uipk:"com.kingdee.eas.hr.ats.app.AttencePolicy.AvailableList.F7",
			query:"",
			filter:"",
			domain:"",
			multiselect:false,
			onclikFunction: function (ids) {
				_self.setSelectValueToGridCell(rowid,columnNum,cellcontent,e,ids);
			}
		};
		//grid_f7_json.readonly = '';
		//grid_f7_json.value = {id:"",name:""};
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_19,widgetType: "checkbox"}];
//		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"];	
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		$(_self).shrPromptBox(grid_f7_json);
		$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"]);
		$(_self).shrPromptBox("open");
		
	},
	
	setDefaultShiftF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//默认班次
		var grid_f7_json = {id:"atsShift",name:"atsShift"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_10,
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
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_19,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"];		
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		$(_self).shrPromptBox(grid_f7_json);
		$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"]);
		$(_self).shrPromptBox("open");
		
	},
	//打卡考勤
	setIsAttendanceToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
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
	},
	//生效日期
	setEFFDTToGridCell: function(rowid,columnNum,cellcontent,e){
		 var _self = this ;
		 var $effdt = $("table tr[id=1] td[aria-describedby='grid_EFFDT'] ");
		 
		 $effdt.shrDateTimePicker({
				id: "EFFDT",
				tagClass: 'block-father input-height',
				readonly: '',
				yearRange: '',
				ctrlType:'Date',
				validate: '{dateISO:true}'
			});	
	},
	
	assginValueAction : function(pageUipk)
	{
		var _self = this ;
		if (_self.validate() && _self.verify()) 
		{
			isEdit=true;
			var hrOrgUnit = $("#hrOrgUnit_el").val();
			var hrOrgUnitName = $("#hrOrgUnit").val();
			var attPositionId = $("#attPosition_el").val();
			var attPositionName = $("#attPosition").val();
			//var attendanceNum = $("#attendanceNum").val();
			var atsShift  = $("#atsShift_el").val();
			var atsShiftName  = $("#atsShift").val();
			var pageUipk = pageUipk;
			var attencePolicy = $("#attencePolicy_el").val();
			var attencePolicyName = $("#attencePolicy").val();
			var isAttendance = $("#isAttendance_el").val();
			var isAttendanceName = $("#isAttendance").val();
			var isAutoShift = $("#isAutoShift_el").val();
			var isAutoShiftName = $("#isAutoShift").val();
            var calendar = $("#calendar_el").val();
            var calendarName = $("#calendar").val();
			var effdt = atsMlUtile.getFieldOriginalValue("EFFDT");
			var clz = this;
			var $grid = $(clz.gridId);
			var ids = $grid.jqGrid('getDataIDs');
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
			for(var i=0;i<ids.length;i++){
				// if($grid.jqGrid("getCell",ids[i],"hrOrgUnit.id")== hrOrgUnit){//批量赋值必须选择业务组织，只对列表为该业务组织的记录进行赋值
				
					if(hrOrgUnit!=null&&hrOrgUnit!=""){
						$grid.jqGrid("setCell",ids[i],"hrOrgUnit.name",hrOrgUnitName); // displayName
						$grid.jqGrid("setCell",ids[i],"hrOrgUnit.id",hrOrgUnit);
					}
					if(attPositionId!=null&&attPositionId!=""){
						$grid.jqGrid("setCell",ids[i],"attAdminOrgUnit.id",adminOrgUnitId);
						$grid.jqGrid("setCell",ids[i],"attAdminOrgUnit.displayName",adminOrgUnitName);	
						$grid.jqGrid("setCell",ids[i],"attPosition.id",attPositionId);
						$grid.jqGrid("setCell",ids[i],"attPosition.name",attPositionName);
					}
					/*if(attendanceNum!=null&&attendanceNum!=""){
						$grid.jqGrid("setCell",ids[i],"attendanceNum",attendanceNum);
					}*/
					if(atsShift!=null&&atsShift!=""){
						$grid.jqGrid("setCell",ids[i],"atsShift.id",atsShift);
						$grid.jqGrid("setCell",ids[i],"atsShift.name",atsShiftName);
					}
					if(attencePolicy!=null&&attencePolicy!=""){
						$grid.jqGrid("setCell",ids[i],"attencePolicy.id",attencePolicy);
						$grid.jqGrid("setCell",ids[i],"attencePolicy.name",attencePolicyName);
                    }
					if(calendar!=null&&calendar!=""){
						$grid.jqGrid("setCell",ids[i],"workCalendar.id",calendar);
						$grid.jqGrid("setCell",ids[i],"workCalendar.name",calendarName);
                        $grid.jqGrid("setCell",ids[i],"calendar.id",calendar);
                        $grid.jqGrid("setCell",ids[i],"calendar.name",calendarName);
					}
					if(isAttendance!=null&&isAttendance!=""){
						$grid.jqGrid("setCell",ids[i],"isAttendance",{value:isAttendance,alias:isAttendanceName});		
					}
					if(isAutoShift!=null&&isAutoShift!=""){
						$grid.jqGrid("setCell",ids[i],"isAutoShift",{value:isAutoShift,alias:isAutoShiftName});		
					}
					if(effdt!=null&&effdt!=""){
						var oldEffdt=$grid.jqGrid("getCell",ids[i],"EFFDT");
						if(pageUipk=='com.kingdee.eas.hr.ats.app.AttendanceFileBatchMaintain.list'){
							if(new Date(effdt)<new Date(oldEffdt)){
								var personName=$grid.jqGrid("getCell",ids[i],"person.name");
								var personNumber=$grid.jqGrid("getCell",ids[i],"person.number");
								shr.showInfo({message: shr.formatMsg(jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_0,[personName+personNumber,oldEffdt])});
								return;
							}
						}
						$grid.jqGrid("setCell",ids[i],"EFFDT",effdt);
					}
				// }
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
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"hrOrgUnit.name",hrOrgUnitName); // displayName
					$grid.jqGrid("setCell",rowid,"hrOrgUnit.id",hrOrgUnit);
				}
			}
			if(columnNum==7){
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
				isEdit=true;
				$grid.jqGrid("setCell",rowid,"attAdminOrgUnit.id",adminOrgUnitId);
				$grid.jqGrid("setCell",rowid,"attAdminOrgUnit.displayName",adminOrgUnitName);	
				$grid.jqGrid("setCell",rowid,"attPosition.id",attPositionId);
				$grid.jqGrid("setCell",rowid,"attPosition.name",attPositionName);
			}
			if(columnNum==8){
				var attendanceNum = $("#attendanceNum").val();
				if(attendanceNum!=null&&attendanceNum!=""){
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"attendanceNum",attendanceNum);
				}
			}
			if(columnNum==9){
				var isAttendance = $("#isAttendance_el").val();
				var isAttendanceName = $("#isAttendance").val();
				if(isAttendance!=null&&isAttendance!=""){
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"isAttendance",{value:isAttendance,alias:isAttendanceName});		
				}
			}
			if(columnNum==10){
				var attencePolicy = $("#attencePolicy_el").val();
				var attencePolicyName = $("#attencePolicy").val();
				if(attencePolicy!=null&&attencePolicy!=""){
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"attencePolicy.id",attencePolicy);
					$grid.jqGrid("setCell",rowid,"attencePolicy.name",attencePolicyName);
				}
			}
			if(columnNum==13){
				var atsShift  = $("#atsShift_el").val();
				var atsShiftName  = $("#atsShift").val();
				if(atsShift!=null&&atsShift!=""){
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"atsShift.id",atsShift);
					$grid.jqGrid("setCell",rowid,"atsShift.name",atsShiftName);
				}
			}
			if(columnNum==14){
				var isAutoShift = $("#isAutoShift_el").val();
				var isAutoShiftName = $("#isAutoShift").val();
				if(isAutoShift!=null&&isAutoShift!=""){
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"isAutoShift",{value:isAutoShift,alias:isAutoShiftName});		
				}
			}
			if(columnNum==15){
				var effdt = atsMlUtile.getFieldOriginalValue("EFFDT");
				if(effdt!=null&&effdt!=""){
					var oldEffdt=$grid.jqGrid("getCell",rowid,"EFFDT");
					if(pageUipk.uipk=='com.kingdee.eas.hr.ats.app.AttendanceFileBatchMaintain.list'){
						if(new Date(effdt)<new Date(oldEffdt)){
							var personName=$grid.jqGrid("getCell",rowid,"person.name");
							var personNumber=$grid.jqGrid("getCell",rowid,"person.number");
							shr.showInfo({message: shr.formatMsg(jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_0,[personName+personNumber,oldEffdt])});
							return;
						}
					}
					isEdit=true;
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
		var attPosition = $("#attPosition_el").val();
		var attendanceNum = $("#attendanceNum").val();
		var atsShift  = $("#atsShift_el").val();
		var attencePolicy = $("#attencePolicy_el").val();
		var isAttendance = $("#isAttendance_el").val();
		var isAutoShift = $("#isAutoShift_el").val();
		var effdt = atsMlUtile.getFieldOriginalValue("EFFDT");
		// if(hrOrgUnit){
			if( hrOrgUnit || attPosition || attendanceNum || atsShift || attencePolicy || isAttendance || isAutoShift || effdt){
				return true;
			}else{
				shr.showWarning({message: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_9});
				return false;
			}
		// }else{
		// 	    shr.showWarning({message: "考勤业务组织必填"});
		// 		return false;
		// }
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
			    title: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_11,
				width:1050,
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
			   /* ,buttons:{
					"批量赋值": function(){
						$(this).disabled = true;
						_self.assginValueAction(pageUipk);
						$("#iframe2").empty();
						$("#iframe2").dialog("close");
					},
					"取消": function(){
						$("#iframe2").empty();
						$("#iframe2").dialog("close");
					}
			    }*/
			});	
			$("#iframe2").css({"height":"250px"});
			$("#iframe2").css({"margin-top":"5px"});
	},
	addValsOnCellSelectPublicAction : function(pageUipk,columnNum,rowid){
		var _self = this;
		$("#iframe2").dialog({
			    title: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_2,
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
						text: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_2,
						click: function(){
							$(this).disabled = true;
							_self.assginValueOnCellSelectAction(pageUipk,columnNum,rowid);
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					},{
						text: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_12,
						click: function(){
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					}]
			});	
			$("#iframe2").css({"height":"250px"});
			$("#iframe2").css({"margin-top":"5px"});
	}, addCalendar: function () {
        var grid_f7_json = {id: "calendar", name: "calendar"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {
            title: jsBizMultLan.atsManager_lackAttendanceFileList_i18n_5,
            uipk: "com.kingdee.eas.hr.ats.app.WorkCalendar.AvailableList.F7",
            query: "",
            filter: "",
            domain: "",
            multiselect: false,
            treeFilterConfig: '',
            permItemId: "",
            isHasMultileDialog: false,
            isTree: false,
            treeUrl: "",
            isContainLowerOrg: false,
            isAdminOrg: false
        };
        grid_f7_json.readonly = '';
        grid_f7_json.validate = '{required:true}';

        grid_f7_json.value = {'id': "", 'name': ""};
        grid_f7_json.isHROrg = "false";
        grid_f7_json.isAdminOrg = "false";
        grid_f7_json.searchLikePattern = "any";

        grid_f7_json.subWidgetOptions.isHRBaseItem = true;
        grid_f7_json.subWidgetOptions.filterConfig = [{
            name: 'isComUse',
            value: true,
            alias: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_19,
            widgetType: 'checkbox'
        }];
        grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";

        grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
        grid_f7_json.subWidgetName = 'specialPromptGrid';

        $('#calendar').shrPromptBox(grid_f7_json);
    },
	appendDynamicHTML: function(object,pageUipk){
		var hrorgid="00000000-0000-0000-0000-000000000000CCE7AED4";
		var that = this;
		var tip= pageUipk=="com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonSaveAll.list"
			? jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_18
			: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_17;
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
			 + '<div style=" padding-left: 50px; color: red; ">'+tip+'</div>'
			 + '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_3
			+ '</div></div>'
			 + '</div>'
			 + '<div class="row-fluid row-block "><div class="row-fluid row-block ">'
			 + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_5
			+ '">'
			+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_5
			+ '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="hrOrgUnit" name="hrOrgUnit" class="block-father input-height" type="text"  ctrlrole="promptBox" autocomplete="off" title="" ></div>'
			 + '</div>'
			 + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_6
			+ '">'
			+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_6
			+ '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="attPosition" name="attPosition" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
			 + '</div>'

			 + '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_1
		+ '">'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_1
		+ '</div> </div>'
			 + '<div class="col-lg-6 field-ctrl"> <input class="block-father input-height cursor-pointer" id="isAttendance" name="isAttendance" validate="" placeholder="" type="text" dataextenal="" ctrlrole="select">  </div>'
			 //+ '<div class="col-lg-4"> <div class="field_label" title="考勤编号">考勤编号</div> </div>'
			 //+ '<div class="col-lg-6 field-ctrl"> <input id="attendanceNum" name="attendanceNum" class="block-father input-height" type="text"  ctrlrole="text" autocomplete="off" title="" > </div>'
			 + '</div>'

			 + '<div class="row-fluid row-block "><div class="row-fluid row-block ">'
			 + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_7
		+ '">'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_7
		+ '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="attencePolicy" name="attencePolicy" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
			 + '</div>'
			 + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_10
		+ '">'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_10
		+ '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="atsShift" name="atsShift" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
			 + '</div>'
			 + '<div class="row-fluid row-block "><div class="row-fluid row-block ">'
			 + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_14
		+ '">'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_14
		+ '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input class="block-father input-height cursor-pointer" id="isAutoShift" name="isAutoShift" validate="" placeholder="" type="text" dataextenal="" ctrlrole="select"></div>'
			 + '</div>'


        + '<div class="row-fluid row-block "><div class="row-fluid row-block ">'
        + '<div class="col-lg-4"><div style="text-align:center;" class="field_label" title="'
        + jsBizMultLan.atsManager_lackAttendanceFileList_i18n_5
        + '">'
        + jsBizMultLan.atsManager_lackAttendanceFileList_i18n_5
        + '</div></div>'
        + '<div class="col-lg-6 field-ctrl"><input id="calendar" name="calendar" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
        + '</div>'

			 + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_13
		+ '">'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_13
		+ '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="EFFDT" name="EFFDT" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker"></div>'
			 + '</div>'

			  + '<div class="row-fluid" align="right">'
			  + '<div  style="padding-right:8%;">'
			 + '<button type="button" class="shrbtn-primary shrbtn" name="'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_11
		+ '" id="batchAddVal">'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_11
		+ ' </button>'
			 + '<button type="button" class="shrbtn-primary shrbtn" name="'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_12
		+ '" id="cancle">'
		+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_12
		+ ' </button>'
			 + '</div>'
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
		
		//考勤业务组织
		grid_f7_json=null;
	    grid_f7_json = {id:"hrOrgUnit",name:"hrOrgUnit"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_5,uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",query:"",filter:"",domain:"",multiselect:false};
		grid_f7_json.readonly = '';
		grid_f7_json.value = {id:"",name:""};
		$('#hrOrgUnit').shrPromptBox(grid_f7_json);		
		//考勤职位
		grid_f7_json=null;
	    grid_f7_json = {id:"attPosition",name:"attPosition"};
	    grid_f7_json.subWidgetName = 'shrPromptGrid';
	    grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_6,uipk:"com.kingdee.eas.hr.ats.app.AttendanceRange.Position.F7",query:"",filter:"",domain:"",multiselect:false};
		grid_f7_json.validate = '';
		grid_f7_json.subWidgetOptions.isHRBaseItem = false;
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";
		grid_f7_json.subWidgetOptions.filterConfig = {name: '',value: true,alias: '',widgetType: 'no'};
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.readonly = '';
		grid_f7_json.value = {id:"",name:""};
		$('#attPosition').shrPromptBox(grid_f7_json);

		//考勤制度
		grid_f7_json = null;
		grid_f7_json = {id:"attencePolicy",name:"attencePolicy"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_7,uipk:"com.kingdee.eas.hr.ats.app.AttencePolicy.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '';
			grid_f7_json.value = {id:"",name:""};
			grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_19,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		$('#attencePolicy').shrPromptBox(grid_f7_json);
		$('#attencePolicy').shrPromptBox("setBizFilterFieldsValues",hrorgid);
		
		
		
		//默认班次
		grid_f7_json = null;
	    grid_f7_json = {id:"atsShift",name:"atsShift"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_10,uipk:"com.kingdee.eas.hr.ats.app.AtsShift.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '';
			grid_f7_json.value = {id:"",name:""};
			grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_19,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		$('#atsShift').shrPromptBox(grid_f7_json);
		$('#atsShift').shrPromptBox("setBizFilterFieldsValues",hrorgid);
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
		$('#EFFDT').shrDateTimePicker({
			id: "EFFDT",
			tagClass: 'block-father input-height',
			readonly: '',
			yearRange: '',
			ctrlType:'Date',
			validate: '{dateISO:true}'
		});

		that.addCalendar();
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
			+ jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_3
			+ '</div></div>'
				 + '</div>'
				 + '<div class="row-fluid row-block ">';
		if(columnNum==5){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_8
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_8
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="hrOrgUnit" name="hrOrgUnit" class="block-father input-height" type="text"  ctrlrole="promptBox" autocomplete="off" title="" ></div>'
		}
		if(columnNum==7){
			 html+='<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_6
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_6
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="attPosition" name="attPosition" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
		}
		if(columnNum==8){
			 html+='<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_4
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_4
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="attendanceNum" name="attendanceNum" class="block-father input-height" type="text"  ctrlrole="text" autocomplete="off" title="" ></div>'
		}
		if(columnNum==9){
			 html+='<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_1
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_1
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input class="block-father input-height cursor-pointer" id="isAttendance" name="isAttendance" validate="" placeholder="" type="text" dataextenal="" ctrlrole="select"></div>'
		}
		if(columnNum==10){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_7
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_7
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="attencePolicy" name="attencePolicy" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
		}
		if(columnNum==13){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_10
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_10
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="atsShift" name="atsShift" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
		}
		if(columnNum==14){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_14
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_14
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input class="block-father input-height cursor-pointer" id="isAutoShift" name="isAutoShift" validate="" placeholder="" type="text" dataextenal="" ctrlrole="select"></div>'
		}
		if(columnNum==15){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_13
				 + '">'
				 + jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_13
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
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_8,uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",query:"",filter:"",domain:"",multiselect:false};
			grid_f7_json.readonly = '';
			grid_f7_json.value = {id:"",name:""};
			$('#hrOrgUnit').shrPromptBox(grid_f7_json);	
		}
		if(columnNum==7){
			//考勤职位
			grid_f7_json=null;
		    grid_f7_json = {id:"attPosition",name:"attPosition"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_6,uipk:"com.kingdee.eas.basedata.org.app.Position.F7",query:"",filter:"",domain:"",multiselect:false};
			grid_f7_json.readonly = '';
			grid_f7_json.value = {id:"",name:""};
			$('#attPosition').shrPromptBox(grid_f7_json);	
		}
		if(columnNum==9){
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
		if(columnNum==10){
			//考勤制度
			grid_f7_json = null;
			grid_f7_json = {id:"attencePolicy",name:"attencePolicy"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_7,uipk:"com.kingdee.eas.hr.ats.app.AttencePolicy.list",query:"",filter:"",domain:"",multiselect:false};
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
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_10,uipk:"com.kingdee.eas.hr.ats.app.AtsShift.list",query:"",filter:"",domain:"",multiselect:false};
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
		if(columnNum==15){
			$('#EFFDT').shrDateTimePicker({
				id: "EFFDT",
				tagClass: 'block-father input-height',
				readonly: '',
				yearRange: '',
				ctrlType:'Date',
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
				message: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_15,
				hideAfter: 5
			});
		}
		
		return flag;
	}
	 /**
	 * 获得查询字段
	 */
	,getSelector: function() {
		return "  ";
	}
});



