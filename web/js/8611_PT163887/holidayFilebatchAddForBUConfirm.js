shr.defineClass("shr.ats.holidayFilebatchAddForBUConfirm", shr.framework.List,{
    changeRowIds : [],
	holidayPolicyCol : 9 ,
	orginalChangeDate : '',
	listColNum:[7,9,12],
	listColName:["hrOrgUnit","holidayPolicy","effectDate"],
	initalizeDOM : function () {
		shr.ats.holidayFilebatchAddForBUConfirm.superClass.initalizeDOM.call(this);
		var _self = this;
		_self.inilzeView();
	}
	
	,onCellSelect:function(rowid,iCol,cellcontent,e){
		var _self = this ;
		var colName = _self.searchColName(iCol);
		if(colName == "hrOrgUnit"){//假期业务组织
			_self.setHrOrgUnitF7ToGridCell(rowid,iCol,cellcontent,e);
		}else if(colName == "holidayPolicy"){//假期制度
			_self.setHolidayPolicyF7ToGridCell(rowid,iCol,cellcontent,e);
		}else if(colName != ""){//其他字段
			_self.addValsOnCellSelectPublicAction(this,iCol,rowid);
		}
		colName = $('#grid').jqGrid('getGridParam', 'colModel')[iCol].name;
		colName = colName.substr(0,colName.lastIndexOf('.'));
		'workCalendar' == colName && _self.setWorkCalendarF7ToGridCell(rowid,iCol,cellcontent,e);
	},
	setHrOrgUnitF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		
		var grid_f7_json = {id:"hrOrgUnit",name:"hrOrgUnit"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_5,
			uipk:"com.kingdee.eas.basedata.org.app.HROrgUnit.F7",
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
	setWorkCalendarF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//假期制度
		var grid_f7_json = {id:"workCalendar",name:"workCalendar"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:$.attendmanageI18n.commonRes.calendar,
			uipk:"com.kingdee.eas.hr.ats.app.WorkCalendar.AvailableList.F7",
			query:"",
			filter:"", 
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
		grid_f7_json.readonly = '';
		grid_f7_json.value = {id:"",name:""};
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"];
		grid_f7_json.subWidgetOptions.isHRBaseItem = false;//若为true,specialPromptGrid控件不触发onclikFunction
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_10,widgetType: "checkbox"}];
//		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		$(_self).shrPromptBox(grid_f7_json);
		$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"]);
		$(_self).shrPromptBox("open");
		
	},
	
	setHolidayPolicyF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//假期制度
		var grid_f7_json = {id:"holidayPolicy",name:"holidayPolicy"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_6,
			uipk:"com.kingdee.eas.hr.ats.app.HolidayPolicySet.AvailableList.F7",
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
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"];
		grid_f7_json.subWidgetOptions.isHRBaseItem = false;//若为true,specialPromptGrid控件不触发onclikFunction
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_10,widgetType: "checkbox"}];
//		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		$(_self).shrPromptBox(grid_f7_json);
		$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"]);
		$(_self).shrPromptBox("open");
		
	},
	setSelectValueToGridCell: function(rowid,columnNum,cellcontent,e,ids){
		var _self = this ;
//		var $table = $(_self).shrPromptGrid("getTable");//dialog弹出框再去弹出F7后，shrPromptGrid，gettable调用出错
		var $table = _self.getTable();
		var ret = $table.jqGrid('getRowData',ids);
		var clz = this;
		var $grid = $(clz.gridId);
		if(_self.searchColName(columnNum) == "hrOrgUnit"){
			var hrOrgUnitId = ret.id;
			var hrOrgUnitName = ret.name;
			if(hrOrgUnitId != null && hrOrgUnitId != ""){
				
				if($grid.jqGrid("getCell",rowid,"hrOrgUnit.id") != hrOrgUnitId){
					$grid.jqGrid("setCell",rowid,"holidayPolicy.id",null);
					$grid.jqGrid("setCell",rowid,"holidayPolicy.name",null);
				}
				$grid.jqGrid("setCell",rowid,"hrOrgUnit.name",hrOrgUnitName); // displayName
				$grid.jqGrid("setCell",rowid,"hrOrgUnit.id",hrOrgUnitId);
			}
		}
		if(_self.holidayPolicyCol == columnNum){
			var holidayPolicyId   = ret["BaseInfo.id"]; 
			var holidayPolicyName = ret["BaseInfo.name"];
			if(holidayPolicyId != null && holidayPolicyId != ""){
				$grid.jqGrid("setCell",rowid,"holidayPolicy.id",holidayPolicyId);
				$grid.jqGrid("setCell",rowid,"holidayPolicy.name",holidayPolicyName);
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
	,saveAndSubmitAction:function(){
			var clz = this;
			var $grid = $(clz.gridId);
			var gridData = $grid.jqGrid("getRowData");
			var realRowData = [] ; 
			for(var i=0;i < clz.changeRowIds.length; i++){
			    realRowData.push($grid.getRowData(clz.changeRowIds[i]));
			}
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsPersonBUBrowseListHandler&method=saveAndSubmit";
			openLoader(1,jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_11);
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
			    title: jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_3,
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
						text: jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_3,
						click: function(){
							$(this).disabled = true;
							_self.assginValueOnCellSelectAction(pageUipk,columnNum,rowid);
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					},{
						text: jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_7,
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
		var colName = _self.searchColName(columnNum);
		if (_self.validate()) 
		{
			var clz = this;
			var $grid = $(clz.gridId);	
			var ids = $grid.jqGrid('getDataIDs');
			if(colName=='hrOrgUnit'){
				var hrOrgUnit = $("#hrOrgUnit_el").val();
				var hrOrgUnitName = $("#hrOrgUnit").val();
				if(hrOrgUnit!=null&&hrOrgUnit!=""){
					$grid.jqGrid("setCell",rowid,"hrOrgUnit.name",hrOrgUnitName); // displayName
					$grid.jqGrid("setCell",rowid,"hrOrgUnit.id",hrOrgUnit);
				}
			}
			var effdt = atsMlUtile.getFieldOriginalValue("EFFDT");
			var personName=$grid.jqGrid("getCell",rowid,"person.name");
			var personNumber=$grid.jqGrid("getCell",rowid,"person.number");
			var uipk=shr.getUrlRequestParam("state");
			var up="2";
			if(colName=='effectDate' && uipk != up){
				var personId=$grid.jqGrid("getCell",rowid,"person.id");
				var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayBURelaConfirmCFListHandler&method=getChangeDate";
				shr.ajax({
				type:"post",
				async:true,
				url:url,
				data:{personId:personId},
				success:function(res){
				var orginalChangeDate= res.effdate;
				if(effdt!=null&&effdt!=""){
					if(new Date(effdt)<new Date(orginalChangeDate)){
					shr.showInfo({message:personName+"("+personNumber+")"+jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_2
							+orginalChangeDate+jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_0});
					return;
					}
					$grid.jqGrid("setCell",rowid,"changeDate",effdt);
				}
			    }
				});	
				
			}
			if(colName=='effectDate' && uipk==up){
				if(_self.orginalChangeDate==''){
					_self.orginalChangeDate= $grid.jqGrid("getCell",rowid,"changeDate").substring(0,10);				
				}
				var effdt = atsMlUtile.getFieldOriginalValue("EFFDT");
				if(effdt!=null&&effdt!=""){
					
					if(new Date(effdt)<new Date(_self.orginalChangeDate)){
						var personName=$grid.jqGrid("getCell",rowid,"person.name");
						var personNumber=$grid.jqGrid("getCell",rowid,"person.number");
						shr.showInfo({message: personName+personNumber+jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_1+_self.orginalChangeDate});
						return;
					}
					$grid.jqGrid("setCell",rowid,"changeDate",effdt);
				}
			}
		}
	}
	,appendDynamicHTMLOnCellSelect: function(object,columnNum){
		var that = this;
		var colName = that.searchColName(columnNum);
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
			 + '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_4
			+ '</div></div>'
			 + '</div>'
			 + '<div class="row-fluid row-block ">';
		if(colName=="effectDate"){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_8
				 + '">'
				 + jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_8
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="EFFDT" name="EFFDT" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker"></div>'
		}
		 	html+=  '</div>'
				 + '</form>';
		$(object).append(
				 html
				 );
		if(colName=="effectDate"){
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
				message: jsBizMultLan.atsManager_holidayFilebatchAddForBUConfirm_i18n_9,
				hideAfter: 5
			});
		}
		
		return flag;
	}
	,getTable : function(){
        	return   $("#list2").length == 0 ? $("#list2",parent.dialog_F7grid) : $("#list2") ;
    }
    ,searchColName: function(col){ 
       var _self = this;
       var i = _self.listColNum.length; 
       i++;
       while(i-=1){
	       	if (_self.listColNum[i-1] == col){
	       		return _self.listColName[i-1]; 
	       	} 
       } 
       return "";
    }
     /**
	 * 获得查询字段
	 */
	,getSelector: function() {
		return "  ";
	}
});
