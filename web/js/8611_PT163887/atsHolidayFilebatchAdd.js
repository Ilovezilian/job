shr.defineClass("shr.ats.atsHolidayFilebatchAdd", shr.ats.AtsBatchTipList,{
    changeRowIds : [],
	holidayPolicySetCol : 8 ,
	initalizeDOM : function () {
		shr.ats.atsHolidayFilebatchAdd.superClass.initalizeDOM.call(this);
		var _self = this;
		_self.inilzeView();
	}
	
	,onCellSelect:function(rowid,iCol,cellcontent,e){
		var _self = this ;
		var colName = $('#grid').jqGrid('getGridParam', 'colModel')[iCol].name
		colName = colName.indexOf('.') < 0 ? colName : colName.substr(0,colName.lastIndexOf('.'));
		colName == "workCalendar" && _self.setWorkCalendarF7ToGridCell(rowid,iCol,cellcontent,e);
		if(_self.holidayPolicySetCol == iCol){
			_self.setHolidayPolicySetF7ToGridCell(rowid,iCol,cellcontent,e);
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
		var isFromReceive = parent.shr.getUrlRequestParam('uipk') == "com.kingdee.shr.base.bizmanage.app.AtsHolidayPersonBURelation"
		var hrField = isFromReceive ? "hrOrgUnit.id" : "newHROrgUnit.id";
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)[hrField];		
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";
		grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,
			alias: jsBizMultLan.atsManager_atsHolidayFileBatchMaintainBase_i18n_10,
			widgetType: 'checkbox'}];
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		$(_self).shrPromptBox(grid_f7_json);
		
		$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)[hrField]);
		$(_self).shrPromptBox("open");
		
	},
	
	setHolidayPolicySetF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		var hrorgid = $(_self.gridId).jqGrid("getRowData",rowid)["newHROrgUnit.id"];  //假期业务组织设置--批量设置，创建档案时
		if(!hrorgid){
			hrorgid = $(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"];		//假期业务组织设置接收时
		}
		//考勤制度
		var grid_f7_json = {id:"holidayPolicySet",name:"holidayPolicySet"};
		grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_atsHolidayFilebatchAdd_i18n_0,  
			//uipk:"com.kingdee.eas.hr.ats.app.HolidayPolicySet.list",
			uipk:"com.kingdee.eas.hr.ats.app.HolidayPolicySet.AvailableList.F7",
			query:"",filter:"",
			domain:"",
			multiselect:false,
		//	isHRBaseItem : true,
			treeFilterConfig: '',
		//	bizOrgField:"hrOrgUnit",
		//	filterConfig:[{name: 'isComUse',value: true,alias: '显示非常用基础资料',widgetType: 'checkbox'}],
		//	f7ReKeyValue: "BaseInfo.id:BaseInfo.name",
			onclikFunction: function (ids) {
				_self.setSelectValueToGridCell(rowid,columnNum,cellcontent,e,ids);
			}
		};
		grid_f7_json.readonly = '';   
		grid_f7_json.validate = '';
	
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;	
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = hrorgid;		
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";
		grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,
			alias: jsBizMultLan.atsManager_atsHolidayFilebatchAdd_i18n_1,
			widgetType: 'checkbox'}];
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		$(_self).shrPromptBox(grid_f7_json);
		
		
		
		$(_self).shrPromptBox("setBizFilterFieldsValues",hrorgid);
		$(_self).shrPromptBox("open");
	},






	setSelectValueToGridCell: function(rowid,columnNum,cellcontent,e,ids){
		var _self = this ;
		//var $table = $(_self).shrPromptGrid("getTable");
		var $table = _self.getTable();
		var ret = $table.jqGrid('getRowData',ids);
		var clz = this;
		var $grid = $(clz.gridId);
		if(_self.holidayPolicySetCol == columnNum){
			var holidayPolicySetId   = ret["BaseInfo.id"];
			//var holidayPolicySetName = ret.name;
			var holidayPolicySetName = ret["BaseInfo.name"];
			if(holidayPolicySetId != null && holidayPolicySetName != ""){
				$grid.jqGrid("setCell",rowid,"holidayPolicySet.id",holidayPolicySetId);
					$grid.jqGrid("setCell",rowid,"holidayPolicySet.name",holidayPolicySetName);
				_self.storeChangeIds(rowid);
			}
		}
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
	,submitAndRecievedAction:function(){
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
			
			var realRowData = [] ; 
			for(var i=0;i < clz.changeRowIds.length; i++){
			    realRowData.push($grid.getRowData(clz.changeRowIds[i]));
			}
			for(var i=0;i<gridData.length;i++){
			var holiday=gridData[i];
			if(!holiday["holidayPolicySet.id"]){
				shr.showError({message: jsBizMultLan.atsManager_atsHolidayFilebatchAdd_i18n_3, hiddenAfter: 5});
				return;
			}
			}
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsHolidayPersonBUBrowseListHandler&method=submitAndRecieved";
			openLoader(1,jsBizMultLan.atsManager_atsHolidayFilebatchAdd_i18n_2);
			shr.ajax({
				type:"post",
				async:true,
				url:url,
				data:{"models":JSON.stringify(gridData)},
				success: clz.getBatchTipSuccessFun(clz,function(){closeLoader();})
		});		 
	}
	,getTable : function(){
        	return   $("#list2").length == 0 ? $("#list2",parent.dialog_F7grid) : $("#list2") ;
        }
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