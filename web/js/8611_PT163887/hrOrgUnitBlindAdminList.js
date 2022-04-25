shr.defineClass("shr.ats.HrOrgUnitBlindAdminList", shr.framework.List, {
	cache_key:"BlindAdmin",
	rowNumPerPage: 30,
	initalizeDOM : function () {
		shr.ats.HrOrgUnitBlindAdminList.superClass.initalizeDOM.call(this);
		var that = this;
		var look = shr.getUrlRequestParam("look");
		
		if(look !='look'){
		that.inilzeView();
		//that.initsetSelectValueToGridCell();
		}
		that.getVerticaliQueryParam();
		that.addF7Event();
		// 快速查询添加事件
		$('#searcher').shrSearchBar('option', {
			afterSearchClick: this.queryGridByEvent
		});
	},
	blindAdminerAction: function() {
	var clz = this;
	var billIds = $("#grid").jqGrid("getSelectedRows");
	var Arrays = new Array();
	var gridData= $("#grid").jqGrid("getSelectedRows");
	for(var i = 0 ; i < gridData.length ; i++){
	var data = $("#grid").jqGrid("getRowData", gridData[i]);
	Arrays.push(data);
	}
		var _self = this;
		$('#importDivs').remove();
		
			// 未生成dialog
		var importDiv = $('<div id="importDivs"></div>').appendTo($('body'));
			
		importDiv.dialog({
				modal : false,
				
				width : 2035,
				minWidth : 2035,
				height : 1005,
				minHeight : 1005,
				open: function(event, ui) {
						var url = shr.assembleURL('com.kingdee.eas.basedata.org.app.AdminOrgUnitblind.list', 'view', {
						//serviceId : shr.getUrlParam('serviceId')
						});
						var content = '<iframe id="importFrame" name="importFrame" width="100%" height="100%" frameborder="0"  allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					//	$("#importFrame").attr("style", "width:1035px;height:505px;");
				},
				close: function(event, ui) {
					importDiv.empty();
//					$(_self.gridId).jqGrid("reloadGrid");
				}  
			});
			$(".ui-dialog-titlebar-close").bind("click" , function(){
				importDiv.dialog("close");
			});	
	},inilzeView : function(){
		$('#breadcrumb').empty();
		var that = this;
		var serviceId = shr.getUrlRequestParam("serviceId");
		var parentgridData=  parent.$("#grid").jqGrid("getSelectedRows");
		var parentArray = new Array();
		var data="";
		for(var i = 0 ; i < parentgridData.length ; i++){
			var number = parent.$("#grid").jqGrid("getCell", parentgridData[i],"BaseInfo.number");
			var name = parent.$("#grid").jqGrid("getCell", parentgridData[i],"BaseInfo.name");
			
			if(i==parentgridData.length-1){
			data=data+name+"("+number+")"+" ";
			}else{
			data=data+name+"("+number+")"+" ";
			}
			parentArray.push(data);
		}
		//var html='<div style=" width: 870px;height: 70px; border: 1px solid;overflow: scroll;margin: 0 0 10px 10px;">'+data+'</div>';
		//var html='<div id="content-header" class="" style="min-height: 0px; padding: 0px 12px 10px; clear: both;"><div id="baseInfo-area" ctrlrole="dynamicDataCollector"><div class="dc-containers"><div class="dc-container"><div class="dc-category"><span name="待分配数据" value="distributeData" index="0">待分配数据：</span></div><div class="dc-data" style="overflow-y: hidden;"><span class="dc-common" checked="false" id="jpoAAAAMq+YAvuEy" name="假期制度12" number="假期制度12" title="假期制度12( 假期制度12 )">假期制度12( 假期制度12 )<img class="dc-remove" src="/shr/styles/images/cha.png"></span></div></div></div></div></div>';
		//$("#blindAdmin").before(html);
		//$("#blindAdmin").after(html);
	},receiveAction : function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var gridData= $grid.jqGrid("getSelectedRows");
		var gridDataArray = new Array();
		if(gridData.length<=0){
			shr.showWarning({message : jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_7});
			return;
		}
		for(var i = 0 ; i < gridData.length ; i++){
			var data = $grid.jqGrid("getRowData", gridData[i]);
			gridDataArray.push(data);
		}
		var parentgridData= parent.$grid.jqGrid("getSelectedRows");
		var parentArray = new Array();
		
		for(var i = 0 ; i < parentgridData.length ; i++){
			var data = parent.$grid.jqGrid("getRowData", parentgridData[i]);
			parentArray.push(data);
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsHrOrgBlindAdminHandler&method=receive";
		openLoader(1,jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_13);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridDataArray),"parentArray":JSON.stringify(parentArray),"type":"1"},
			success:function(res){
				//清除本地缓存
				//localStorage.removeItem(clz.cache_key);
				closeLoader();
				parent.location.reload();
			}
		});		 
	},
	addF7Event: function(){
		var that = this;
		//高级过滤先屏蔽掉,以后需要放出
		var look = shr.getUrlRequestParam("look");
		
		if(look =='look'){
		that.initalSearch();
		}
		//加载数据
		
	},
	setHolidayPolicyF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//假期制度
		var grid_f7_json = {id:"holidayPolicy",name:"holidayPolicy"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_5,
			uipk:"com.kingdee.eas.basedata.org.app.AdminOrgUnitblind.list",
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
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_11,widgetType: "checkbox"}];
//		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		$(_self).shrPromptBox(grid_f7_json);
		$(_self).shrPromptBox("setBizFilterFieldsValues",$(_self.gridId).jqGrid("getRowData",rowid)["hrOrgUnit.id"]);
		$(_self).shrPromptBox("open");
		
	},blindAdminAction: function() {
	var _self = this ;
		
		var grid_f7_json = {id:"adminOrgUnit",name:"adminOrgUnit"};
	    grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_12,
			uipk:"com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",
			query:"",
			filter:"",
			domain:"",
			multiselect:true,
			beforeCommitClick: function (ids) {
			_self.setSelectValueToGridCell(ids);
			}
		};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name:"isComUse",value:true,alias:jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_10,widgetType:"checkbox"}];
		grid_f7_json.readonly = '';
		grid_f7_json.value = {id:"",name:""};
		$(_self).shrPromptBox(grid_f7_json);
		$(_self).shrPromptBox("open");
	},
    
	getCurPage:function(){
		//(1-4)/4
		var self = this,
		rowNum = self.rowNumPerPage;
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		var curPageNum = (parseInt(temp.substring(1, temp.indexOf('-')))-1)/rowNum+1;
		return curPageNum;
	},
	/*
	 * 
	 */
	getVerticaliQueryParam : function(){
		var that = this;
		var serviceId = shr.getUrlRequestParam("serviceId");
		var parentgridData=  parent.$("#grid").jqGrid("getSelectedRows");
		var parentArray = new Array();
		var data="";
		for(var i = 0 ; i < parentgridData.length ; i++){
			var number = parent.$("#grid").jqGrid("getCell", parentgridData[i],"BaseInfo.number");
			var name = parent.$("#grid").jqGrid("getCell", parentgridData[i],"BaseInfo.name");
			
			if(i==parentgridData.length-1){
			data=data+name+"("+number+")";
			}else{
			data=data+name+"("+number+")";
			}
			parentArray.push(data);
		}
		//$("#description").val(data);
		$("#description").align="";
		if($('#gridPager1').length > 0){
			$('#listInfo').empty();
		}
		$('#listInfo').append('<div id="gridPager1"></div>');
		$('#listInfo').append('<table id="dataGrid"></table>');
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsBlindAdminHandler&method=getPersonShift";
		//url += '&serviceId='+encodeURIComponent(serviceId);
		var resObject={url:url,colChineseNames:null,colModel:null};
		shr.ajax({
			type:"post",
			async: false,
			data: {beginDate:"2012"},
			url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsBlindAdminHandler&method=getGridColModel",
			success:function(res){
			resObject.colChineseNames = res.colNames;
			resObject.colModel = res.colModel;
			}
		});
		var colChineseNames = null;
		var colModel = null;
		colChineseNames = resObject.colChineseNames;
	    colModel = resObject.colModel;
		var options = {
			url : url,
			postData: that.assembleParam(), 
			datatype : "json",
			multiselect : true,
			rownumbers : false,
			colNames : colChineseNames,
			colModel : colModel,
			rowNum : that.rowNumPerPage,
			// pager : '#gridPager1',
			height : 'auto',
			rowList : [30,50,100,200],
			recordpos : 'left',
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			pginput : true,
			footerrow:true,
			viewrecords : true,
			customPager : '#gridPager1',  
			pagerpos:"center",
			pginputpos:"right",
			afterInsertRow:function(rowid,rowdata){
			},
			onSelectRow:function(rowid,status){
			},
			onCellSelect:function(rowid,iCol,cellcontent,e){
			}
		};

		options.loadComplete = function (data) {
			if($("#gridPager1").html() == "" && "true" == "true"){
				$("#dataGrid").setCustomPager("#gridPager1");
			}
			
			shr.setIframeHeight();
			
			$('#gridPager1_left').click(function(){
				$('.ui-pg-selbox').show();
				$('.ui-pg-selbox').css({"left":"-40px",})
				$(this).children('.ui-paging-info').hide();
			});
			$("#gridPager1").parent().css({"position":"relative"})  
			$("#gridPager1").addClass("shrPage").css({
				"position":"absolute",
				"top":"-25px",
				"right":"0px",
				"background":"#FFF"
			}) 
			$("#gridPager1").show();
		    // that.handleMicroToolbarInfo();
		};
		$("#gridPager1").hide();
		var table = $('#dataGrid');
		table.jqGrid(options);
		jQuery('#dataGrid').jqGrid('setFrozenColumns');
		
	},
	searchParam: function(){
		var that = this;
		var searchsField = [];
		
		searchsField.push({
			label: jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_6,
			columnName: 'holidayPolicy.fname_l2',
			type: "String"
		});
		searchsField.push({
			label: jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_1,
			columnName: 'holidayPolicy.fnumber',
			type: "String"
		});
		searchsField.push({
			label: jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_9,
			columnName: 'uro.fname_l2',
			type: "String"
		});
		searchsField.push({
			label: jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_0,
			columnName: 'admin.fname_l2',
			type: "String"
		});
		searchsField.push({
			label: jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_4,
			columnName: 'holidayPolicy.fusePolicy',
			type: "String"
		});
		searchsField.push({
			label: jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_3,
			columnName: 'hro.fname_l2',
			type: "String"
		});
		return searchsField;
	},
	initalSearch : function(){
		
		var _self = this;
		//由于高级过滤是自定义的，所以框架的必须去除掉
		//$('#searcher').parent().remove();
		$('#grid-toolbar').children().eq(1).append('<div id="searcher" class="pull-right"/>');
		var searcherFields = [];
		searcherFields[0] = {columnName:"holidayPolicy.fname_l2",label:jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_6};
		searcherFields[1] = {columnName:"holidayPolicy.fnumber",label:jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_1};
		
		var options = {
			gridId: "grid",
			// uipk: "com.kingdee.eas.hr.ats.app.AttenceResult.list",
			// query: "" ,
			fields :searcherFields
			// propertiesUrl: shr.getContextPath()+'/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttenceResult.list&method=getProperField'
		};
	
		$("#searcher").shrSearchBar(options);
		
	},
	/**
	 * 选择导航节点
	 */
	queryGridByEvent: function(e) {				
		var viewPage;
		var self=this;
		if (e.target) {
			viewPage = shr.getCurrentViewPage(e.target);
		} else {
			viewPage = shr.getCurrentViewPage(e);
		}
		// 将页码恢复为第1页
		$(viewPage.gridId).jqGrid('option', 'page', 1);
		viewPage.queryAction();
	}
	,
	doRenderDataGrid : function () {
	
	
	},
	queryAction:function(){
		var that = this;
		that.getVerticaliQueryParam();
	},
	assembleParam:function(){
		var that = this;
		var _self = this;
	    var selectedIds = parent.$("#grid").jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
		var bills;
		for (var i = 0;i<selectedIds.length; i++) {
		var item = selectedIds[i];
		if(bills){
		bills = bills+','+selectedIds[i];
		}else{
		bills = selectedIds[i];
		}
		}
		}
		var filterStr =  bills;
		var param = {};
		param.billId=filterStr;
		param.filterItems = that.getQuickFilterItems();
		var type=parent.$('#blindCurrent').attr('values');
		var lx = shr.getUrlRequestParam("type");
		if(type=='holiday' || lx =='holiday'){
		param.available = 'T_ATS_HolidayPoliSetAvailable';
		param.holidayPolicy = 'T_HR_ATS_HolidayPolicySet';
		}else if(type=='attend'){
		param.available = 'T_ATS_AttencePolicyAvailable';
		param.holidayPolicy = 'T_HR_ATS_AttencePolicy';
		}else if(type=='takeWork'){
		param.available = 'T_ATS_AtsTakeWorkingAvailable';
		param.holidayPolicy = 'T_HR_ATS_TakeWorking';
		}else if(type=='atsShift'){
		param.available = 'T_ATS_AtsShiftAvaliable';
		param.holidayPolicy = 'T_HR_ATS_Shift';
		}else if(type=='atsTurnShift'){
		param.available = 'T_ATS_AtsTurnShiftAvailable';
		param.holidayPolicy = 'T_HR_ATS_TurnShift';
		}else if(type=='attenceGroup'){
		param.available = 'T_ATS_AttGroupAvailable';
		param.holidayPolicy = 'T_HR_ATS_AttenceGroup';
		}
		
		return param;
	},
	/**
	 * 获得快速查询和高级查询条件
	 */
	getQuickFilterItems: function() {
		var filter = $('#searcher').shrSearchBar('option', 'filterView');
		if (filter && filter.filterItems) {
			var quickItems = filter.filterItems;
			if(quickItems.indexOf('.name') > -1){
				//只替换第一个
				filter.filterItems = quickItems.replace('.name','.fname_l2')
			}
			else{
				if(quickItems.indexOf('.f') > -1){
					//nothing
				}
				else{
					filter.filterItems = quickItems.replace('.','.f')
				}
			}
			return filter.filterItems;
		}
	},handleMicroToolbarInfo : function () {
		var that = this;
		var html = "";
		html += "<div class='shrPage page-Title'>";
		html += "<span id='gripage' class='ui-paging-info' style='cursor: default;display: inline-block;font-size: 13px;padding: 2px 5px 0 0;'></span>";
		html += "<span id='prevId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-prev'></span>";
		html += "<span id='nextId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-next'></span></div>";
		html += '<span id="rowNum" style="display:none"><select id="selectRowNum" class="ui-pg-selbox" role="listbox"><option role="option" value="30">30</option>';
		html += '<option role="option" value="50" >50</option>';
		html += '<option role="option" value="100">100</option>';
		html += '<option role="option" value="200">200</option></select></span>';
		$('#microToolbar').html("");
		$('#microToolbar').append(html);
		$("#selectRowNum").val(that.rowNumPerPage);
		$("#gripage").on("click", that.selectRowNumPerPage);
		$("#prevId").on("click", that.prePage);
		$("#nextId").on("click", that.nextPage);
		//页码 (1-4)/4
		that.updatePageEnable();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
		$("#gridPager1").hide();
		shr.setIframeHeight();
	},
	selectRowNumPerPage:function(){
		$('#gripage').hide();
		$('#rowNum').show();
		var that = this;
		var currentViewPage = shr.getCurrentViewPage();
		$("#selectRowNum").change(function() {
			var reRows = parseInt($("#selectRowNum option:selected").text());
			currentViewPage.rowNumPerPage = reRows;
			currentViewPage.queryAction();
		});
		
		$(document).click(function (e) { 
			if($('#gripage').is(":visible")){
				$('#rowNum').hide();
			}
			else{
				$('#rowNum').show();
			}
		}); 
	},
	updatePageEnable:function () {
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		if (temp.substring(1, temp.indexOf('-')) == '1') {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}
        //上了1000的时候要把逗号替换掉，否则会出错。分页按钮置灰有问题。
		if (parseInt(temp.substring(temp.indexOf('-') + 1, temp.indexOf(')'))) >= parseInt(temp.substring(temp.indexOf('/') + 1).replace(new RegExp(",","gm"),""))) {
			$("#nextId").addClass("ui-state-disabled");
		} else {
			$("#nextId").removeClass("ui-state-disabled");
		}
	},
	setSelectValueToGridCell: function(ids){
		var _self = this ;
		var ids  = [] , rows = [];
		var $table =  $(_self).shrPromptGrid("getTable");
		var ret =  $table.jqGrid('getSelectedRows');
		if (ret.length > 0) {
		var adminOrgId;
		for (var i = 0;i<ret.length; i++) {
		var item = ret[i];
		if(adminOrgId){
		adminOrgId = adminOrgId+','+ret[i];
		}else{
		adminOrgId = ret[i];
		}
		}
		}
		var gridData=  $table.jqGrid('getSelectedRows');
		var gridDataArray = new Array();
		for(var i = 0 ; i < gridData.length ; i++){
			var data = $table.jqGrid("getRowData", gridData[i]);
			gridDataArray.push(data);
		}
		var parentgridData= parent.$("#grid").jqGrid("getSelectedRows");
		var parentArray = new Array();
		
		for(var i = 0 ; i < parentgridData.length ; i++){
			var data = parent.$("#grid").jqGrid("getRowData", parentgridData[i]);
			parentArray.push(data);
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsBlindAdminHandler&method=receive";
		openLoader(1,jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_13);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridDataArray),"parentArray":JSON.stringify(parentArray),"type":"1"},
			success:function(res){
			shr.showInfo({message: jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_2, hideAfter: 3});
			_self.getVerticaliQueryParam();
			closeLoader();
				//parent.location.reload();
			}
		});	
	},
	initsetSelectValueToGridCell: function(){
		var _self = this ;
		var parentgridData= parent.$("#grid").jqGrid("getSelectedRows");
		var parentArray = new Array();
		for(var i = 0 ; i < parentgridData.length ; i++){
			var data =parent.$("#grid").jqGrid("getRowData", parentgridData[i]);
			parentArray.push(data);
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsBlindAdminHandler&method=initreceive";
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"parentArray":JSON.stringify(parentArray),"type":"1"},
			success:function(res){
			}
		});	
	},deleteAction:function(){
		var that = this;
		var gridData=$("#dataGrid").jqGrid("getSelectedRows");
		var arrays = new Array();
		var bills;
		if(gridData.length<=0){
		shr.showWarning({message : jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_7});
		return;
		}
		for(var i = 0 ; i < gridData.length ; i++){
		var data = $("#dataGrid").jqGrid("getRowData", gridData[i]);
		if(bills){
		bills = bills+','+data.blindId;
		}else{
		bills = data.blindId;
		}
		}
		var filterStr =  " IN ( '"+bills.replace(/,/g,"','")+"' ) ";
		shr.showConfirm(jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_8, function(){
			that.remoteCall({method: "deletes", param: {param:filterStr}, 
			beforeSend: function(){
				openLoader(1, jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_14);
			},
			success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_hrOrgUnitBlindAdminList_i18n_2, hideAfter: 3});
			that.getVerticaliQueryParam();
		    },error:function(data)
			{     
			that.getVerticaliQueryParam();
			}
		   });
		});	
	},

	prePage : function () {
		$("#prev_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	},

	nextPage : function () {
		$("#next_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	}
	
});