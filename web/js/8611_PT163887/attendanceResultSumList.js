var sidValue = [];
var orgLongNum="";
var sumType = "1";
shr.defineClass("shr.ats.attendanceResultSumList", shr.framework.List, {
	gridId: '#reportGrid',
    reportUipk :   "com.kingdee.eas.hr.ats.app.AttendanceResultSumList" ,
    rowNumPerPage : 15,
    colModelData: null,
    isFirstTimeLoad: 0,
	initalizeDOM : function () {
		var that = this;
		that.processF7ChangeEvent();
		that.clearAdminOrgUnitVal();
		// that.initFilterDate(); 
//		that.renderDataGrid();
		that.setColModelData();
        that.initalSearch();
		shr.ats.attendanceResultSumList.superClass.initalizeDOM.call(this);
		
		// 快速查询添加事件
		$('#searcher').shrSearchBar('option', {
			afterSearchClick: this.queryGridByEvent
		});
		
		$("#proposer").attr("maxlength","").attr("validate","");
		
		//快速过滤展开
		if($(".filter-containers").is(":hidden")){
			$("#filter-slideToggle").click();
		}
	} 
	 ,processF7ChangeEvent : function(){
		var that = this;
		$('#AdminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
			   var info = value.current;
			   	if(info!=null){
			   	
				   if (info.length != undefined) {
				   		orgLongNum = "";
				   		for (var index = 0; index < info.length; index++) {
				   			orgLongNum = orgLongNum + info[index].longNumber + "@" ;
				   		}
				   		if (orgLongNum.length > 0) {
				   			orgLongNum = orgLongNum.substring(0,orgLongNum.length -1);
				   		}
				   }else{
					   	if(info.longNumber !=null && info.longNumber!=''){ 
					   		orgLongNum = info.longNumber;
					   	}
				   }
				}
			}
		});
  	 }
  	 /**
	 * 选择导航节点
	 */
	,queryGridByEvent: function(e) {
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
	},
  	 //设置高级查询 
	initalSearch : function(){
		$('#grid-toolbar').children().eq(1).append('<div id="searcher" class="pull-right"/>');
		var searcherFields = [];
		searcherFields[0] = {columnName:"name",label:jsBizMultLan.atsManager_attendanceResultSumList_i18n_23};
		searcherFields[1] = {columnName:"number",label:jsBizMultLan.atsManager_attendanceResultSumList_i18n_26};
		var options = {
			gridId: "reportGrid",
			// uipk: "com.kingdee.eas.hr.ats.app.AttendanceResultSumList",
			// query: "" ,
			fields :searcherFields
			// propertiesUrl: shr.getContextPath()+'/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttendanceResultSumList&method=getProperField'
		};
	
		$("#searcher").shrSearchBar(options);
		//设置其默认的过滤方案
		// var filter = $("#searcher").shrSearchBar('option', 'filterView');
		// if ($.isEmptyObject(filter)) {
		// 	// 如果filter为空
		// 	if (!$.isEmptyObject($("#searcher").shrSearchBar('option', 'defaultViewId'))) {
		// 		// 加载默认过滤方案触发表格取数
		// 		$("#searcher").shrSearchBar('chooseDefaultView');
		// 	}
		// }	
	}
	,sumByAdminOrgAction : function () {
		sumType = "1";
		$("#sumByperson").parent().parent().find("button").eq(0).text($("#sumByAdminOrg").text()+" ").append("<span class='caret'></span>");
		this.queryAction();
	}
	,sumByAttenceOrgAction : function () {
		sumType = "2";
		$("#sumByperson").parent().parent().find("button").eq(0).text($("#sumByAttenceOrg").text()+" ").append("<span class='caret'></span>");
		this.queryAction();
	}
	,sumBypersonAction : function () {
		sumType = "3";
		$("#sumByperson").parent().parent().find("button").eq(0).text($("#sumByperson").text()+" ").append("<span class='caret'></span>");
		this.queryAction();
		
	}
	/**
	 * 获得search查询条件
	 */
	,getSearchFilterItems: function() {
		var filter = $('#searcher').shrSearchBar('option', 'filterView');
		if (filter && filter.filterItems) {
			return filter.filterItems;
		}
	}
	,queryAction : function () {
		var self = this;
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attenceDate","errorMessage":jsBizMultLan.atsManager_attendanceResultSumList_i18n_15});
		if(!dateRequiredValidate){
			return ;
		}
		//search搜索
		var searchFilterItems = self.getSearchFilterItems();
		if( searchFilterItems == undefined)
			searchFilterItems = "" ;
		//快速过滤
		var fastFilterItems = self.getFastFilterItems();
		if(fastFilterItems == undefined){
			fastFilterItems = "";
		}
		if(fastFilterItems["add"] == ""){
			fastFilterItems["add"] = null;
		}
		
		//R20190625-2369保存方案后，其它条件设置的条件被清空
		//需把视图的filterItem其他条件name="add"改成name="advancedFilter" 
		var advancedFilterItems = self.getAdvancedFilterItems();
		if(advancedFilterItems != undefined){
			fastFilterItems["add"] = advancedFilterItems;
		}
		
		$("#reportGrid").jqGrid('setGridParam', {
			datatype : 'json',
			postData : {
				'NewRearch'   : 'newRearch',
				'fastFilterItems' : $.toJSON(fastFilterItems),
				'searchFilterItems' : searchFilterItems,
				'sumType' : sumType,
				'page' : 1
			},
			page : 0
		});
		self.doRenderDataGrid();
//		$("#reportGrid").trigger("reloadGrid");
	}
	,initFilterDate : function () {
		var serviceId = shr.getUrlRequestParam("serviceId");
		//设置默认的查询组织 这边必须的用同步的请求，不然无法过滤。
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=getDefaultOrg";
		url += '&serviceId='+encodeURIComponent(serviceId);
		shr.ajax({
		type:"post",
		async:false,
		url:url,
		success:function(res){
			var info = res;
			if(info!=null){
				var dataValue = {
					id : info.orgID,
					name : info.orgName,
					longNumber:info.longNumber
				};
				$('#AdminOrgUnit').shrPromptBox("setValue", dataValue);
			}
		}
	});
		
	},
//	renderDataGrid : function () {
//		var self = this,
//		schemaId = shr.getUrlRequestParam("schemaId"),
//		periodId = shr.getUrlRequestParam("periodId");
//		self.remoteCall({
//			method : "getGridColModel",
//			param : {
//				"schemaId" : schemaId,
//				"periodId" : periodId,
//				"tempTableName" : shr.getUrlRequestParam("tempTableName"),
//				"serviceId" : shr.getUrlRequestParam("serviceId"),
//				"hrOrgUnitId":$.shrFastFilter.getFastFilterItems().hrOrgUnit.values
//			},
//			success : function (reponse) {
//				self.doRenderDataGrid(reponse);
//				
//			}
//		});
//	},
	setColModelData: function () {
		var self = this,
		schemaId = shr.getUrlRequestParam("schemaId"),
		periodId = shr.getUrlRequestParam("periodId");
		self.remoteCall({
			method : "getGridColModel",
			param : {
				"schemaId" : schemaId,
				"periodId" : periodId,
				"tempTableName" : shr.getUrlRequestParam("tempTableName"),
				"serviceId" : shr.getUrlRequestParam("serviceId")
			},
			
			success : function (reponse) {
				self.colModelData = reponse;
			}
		});
	},
	  
	/**
	 * 表格数据请求URL
	 */
	getGridDataRequestURL : function () {
		var serviceId = shr.getUrlRequestParam("serviceId");
		return this.dynamicPage_url + "?method=getGridData" + "&uipk=" + this.reportUipk + '&serviceId='+encodeURIComponent(serviceId); 
	},

   doRenderDataGrid : function () {
		var self = this, table = $("#reportGrid");
   		var reponse = self.colModelData;
		var colNames = reponse.colNames;
		var colModel = reponse.colModel;
		var searchFilterItems = self.getSearchFilterItems();
		var fastFilterItems = self.getFastFilterItems();
		if( searchFilterItems == undefined)
			searchFilterItems = "" ;
		if( fastFilterItems == undefined)
			fastFilterItems = "" ;
		if(fastFilterItems["add"] == ""){
			fastFilterItems["add"] = null;
		}
		
		//R20190625-2369保存方案后，其它条件设置的条件被清空
		//需把视图的filterItem其他条件name="add"改成name="advancedFilter" 
		var advancedFilterItems = self.getAdvancedFilterItems();
		if(advancedFilterItems != undefined){
			fastFilterItems["add"] = advancedFilterItems;
		}
		
		postData = {
			'searchFilterItems' : searchFilterItems,
			'fastFilterItems' : $.toJSON(fastFilterItems),
			'page1' : 1
		};

		var url = self.getGridDataRequestURL();        
		var	options = {
			url : url ,
			datatype : "json",
			multiselect : true,
			rownumbers : false,
			colNames : colNames,
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			// pager : '#gridPager1',
			mtype: 'POST',
			postData: postData ,
//			height : 'auto',
			height : '600px',
//			height : self.rowNumPerPage > 21 ? '600px' : 'auto',
			rowList : [30,45,60],
			recordpos : 'left',
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			// pginput : true,
			shrinkToFit :reponse.colModel.length>10?false:true,
			viewrecords : true,
			//cellEdit:true,
            cellsubmit:"clientArray" ,	
			sortname : "sumsql.fproposerid",
			//caption: "Frozen Header",
			customPager : '#gridPager1',  
			pagerpos:"center",
			pginputpos:"right",
			pginput:true,     
			synchTotal:"true",
			onSelectRow: function(id){ 
				jQuery('#reportGrid').jqGrid('editRow', id, false, function(){
			});
			sidValue.push(id);
			lastsel2 = id;
			$("#reportGrid").attr("sid", sidValue.join(","));
		},
		editurl: this.dynamicPage_url+ "?method=editRowData"+"&uipk=" + this.reportUipk 
		};

		options.loadComplete = function (data) {
			if($("#gridPager1").html() == "" && "true" == "true"){
				$("#reportGrid").setCustomPager("#gridPager1");
			}
			
			shr.setIframeHeight();
			
			$('#gridPager1_left').click(function(){
				$('.ui-pg-selbox').show();
				$('.ui-pg-selbox').css({"left":"-40px"})
				$(this).children('.ui-paging-info').hide();
			});
			$("#microToolbar").parent().hide()
			$("#gridPager1").parent().css({"position":"relative"})  
			$("#gridPager1").addClass("shrPage").css({
				"position":"absolute",
				"top":"-25px",
				"right":"0px",
				"background":"#FFF"
			})
			shr.ats.attendanceResultSumList.superClass.gridLoadComplete.call(this,data);
			// self.handleMicroToolbarInfo();
			//$("#reportGrid_frozen").parent().height('597px');
			//$("#reportGrid").parent().height('600px');
		};
		table.html();
		table.jqGrid(options);
		jQuery("#reportGrid").jqGrid(options).jqGrid("reloadGrid");
		jQuery('#reportGrid').jqGrid('setFrozenColumns');
		self.firstTime = 1;
		
		
	},
	handleMicroToolbarInfo : function () {

		
		var self = this;
		var html = "";
		html += "<div class='shrPage page-Title' >";
		html += "<span id='gripage' class='ui-paging-info' style='cursor: default;display: inline-block;font-size: 13px;padding: 2px 5px 0 0;'></span>";
		html += "<span id='prevId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-prev'></span>";
		html += "<span id='nextId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-next'></span></div>";
		
		$('#microToolbar').html("");
		$('#microToolbar').append(html);

		$("#gripage").on("click", self.selectRowNumPerPage);
		$("#prevId").on("click", self.prePage);
		$("#nextId").on("click", self.nextPage);

		//页码 (1-4)/4
		self.updatePageEnable();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
		$("#gridPager1").hide();
		 var ids=jQuery("#reportGrid").jqGrid('getDataIDs');
         var rowdata=jQuery("#reportGrid").jqGrid('getRowData',ids[0]);  
		
		shr.setIframeHeight();
		$("#reportGrid_frozen").parent().height('583px');
	},
	updatePageEnable:function () {
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		if (temp.substring(1, temp.indexOf('-')) == '1') {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}

		if (parseInt(temp.substring(temp.indexOf('-') + 1, temp.indexOf(')'))) >= parseInt(temp.substring(temp.indexOf('/') + 1).replace(new RegExp(",","gm"),""))) {
			$("#nextId").addClass("ui-state-disabled");
		} else {
			$("#nextId").removeClass("ui-state-disabled");
		}
	},
    
	getCurPage:function(){
		//(1-4)/4
		var self = this,
		rowNum = self.rowNumPerPage;
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		var curPageNum = (parseInt(temp.substring(1, temp.indexOf('-')))-1)/rowNum+1;
		return curPageNum;
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
	},
		
	selectRowNumPerPage:function(){
			
	}
	
	,
	exportToExcelAction : function () {
		openLoader
  		var _self = this ;
  		var url = _self.exportCommonParam();
  		var fastFilterItems = _self.getFastFilterItems();
		if( fastFilterItems == undefined)
			fastFilterItems = "" ;
		if(fastFilterItems["add"] == ""){
			fastFilterItems["add"] = null;
		}
				
  		 var serviceId = shr.getUrlRequestParam("serviceId");
  		url += '&serviceId='+encodeURIComponent(serviceId);
		//document.location.href = url;
		var callback=function(psw){
			openLoader(1,jsBizMultLan.atsManager_attendanceResultSumList_i18n_28);
			shr.ajax({
				type:"post",
				url:url,
				data: $.extend(_self.assemExportData(),{exportPrivteProtected: psw} ),
				success:function(res){
					closeLoader();
					//document.location.href = url;
					shr.redirect(res.url,"");
				},
				error : function(res){
					shr.showError({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_6});
					closeLoader();
				}
			});
		}
		if(window.isShrSensitiveRuleOpen) {
			fieldSensitiveService.setExportPsw(callback);
		}else{
			callback();
		}

	},
		assemExportData:function(exportData){
		var _self = this ;
		var fastFilterItems = _self.getFastFilterItems();
		var advancedFilterItems = _self.getAdvancedFilterItems();
		if( fastFilterItems == undefined)
			fastFilterItems = "" ;
		if(fastFilterItems["add"] == ""){
			fastFilterItems["add"] = null;
		}
		
		if(advancedFilterItems != undefined){
			fastFilterItems["add"] = advancedFilterItems;
		}
		
		var postData = {fastFilterItems : $.toJSON(fastFilterItems)};
		
		exportData && (postData = $.extend(postData, exportData));
		return postData;
	},
	
//	,exportToExcelAction : function () {
//		var self = this;
//	
//		var fastFilterItems = self.getFastFilterItems();
//		if( fastFilterItems == undefined)
//			fastFilterItems = "" ;
//		if(fastFilterItems["add"] == ""){
//			fastFilterItems["add"] = null;
//		}
//		
//		//R20190625-2369保存方案后，其它条件设置的条件被清空
//		//需把视图的filterItem其他条件name="add"改成name="advancedFilter" 
//		var advancedFilterItems = self.getAdvancedFilterItems();
//		if(advancedFilterItems != undefined){
//			fastFilterItems["add"] = advancedFilterItems;
//		}
//		
//		var url = self.exportCommonParam();
//		//url += "&queryMode=";
//		  openLoader(1,jsBizMultLan.atsManager_attendanceResultSumList_i18n_28); 
//		  shr.ajax({  
//			type:"post",  
//			url:url, 
//			data: {
//					fastFilterItems : $.toJSON(fastFilterItems)
//				},
//			success:function(res){ 
//				var fileUrl = res.url ;	 
//				closeLoader();  
//				shr.redirect(fileUrl,"");  
//				// document.location.href = fileUrl;
//		    }, 
//		    error : function(res){
//		    	shr.showError({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_6});
//		    	closeLoader();
//		    } 
//		});
//	}
	exportCommonParam : function(){
		var self = this;
		var url = shr.getContextPath() + shr.dynamicURL + "?method=exportToExcel";
		var uipk = "com.kingdee.eas.hr.ats.app.AttendanceResultSumList";
		var filterItems = self.getQuickFilterItems();
		var sorder =   $('#reportGrid').jqGrid('getGridParam', 'sortorder') || "";
		var sordName = $('#reportGrid').jqGrid('getGridParam', 'sortname') || "";

		//标题
		   url += "&title="+jsBizMultLan.atsManager_attendanceResultSumList_i18n_8;
		   url = url + '&uipk=' + uipk + "&sidx=" + sordName+"&page=0"+"&sumType="+sumType + "&sord=" + sorder + "&transverse=1";
		//如果存在高级搜索的条件，则拼上条件。
		if(filterItems){
			url += "&searchFilterItems=" + encodeURIComponent(filterItems);
		}
		return url;
	},
	exportCurrentAction : function(){
		var Exchange_json=[];
		var _self = this;
		var exportData = {
			exportSelect:"yes",
			serviceId:shr.getUrlRequestParam("serviceId")
		};
		var selectedIds = $("#reportGrid").jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			for (var i = 0, length = selectedIds.length; i < length; i++) {
//				personIds.push($("#reportGrid").jqGrid("getCell", selectedIds[i], "id"));
				var item = selectedIds[i];
				var data = $("#reportGrid").jqGrid("getRowData", item);
				
				var personId=data["personId"] ;
				var adminOrgUnit=data["adminOrgUnitId"] ;
				Exchange_json.push({'personId':personId,'adminOrgUnit':adminOrgUnit});
			}
		}
		if(Exchange_json.length > 0){
			exportData.PersonJson =  $.toJSON(Exchange_json);
		}else{
			shr.showWarning({
				message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_13
			});
			return false;
		}
		var callback=function(psw){
			openLoader(1,jsBizMultLan.atsManager_attendanceResultSumList_i18n_28);
			shr.ajax({
				type:"post",
				url:_self.exportCommonParam(),
				data: $.extend(_self.assemExportData(exportData),{exportPrivteProtected: psw}),
				success:function(res){
					closeLoader();
					shr.redirect(res.url,"");
				},
				error : function(res){
					shr.showError({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_6});
					closeLoader();
				}
			});
		}
		if(window.isShrSensitiveRuleOpen) {
			fieldSensitiveService.setExportPsw(callback);
		}else{
			callback();
		}

	}
//	,exportCurrentAction: function(){
//		var _self = this;
//		var sid=[];
//		var Exchange_json=[];
//		sid = $("#reportGrid").jqGrid("getSelectedRows");
//		
//		var fastFilterItems = _self.getFastFilterItems();
//		if( fastFilterItems == undefined)
//			fastFilterItems = "" ;
//		if(fastFilterItems["add"] == ""){
//			fastFilterItems["add"] = null;
//		}
//		
//		//R20190625-2369保存方案后，其它条件设置的条件被清空
//		//需把视图的filterItem其他条件name="add"改成name="advancedFilter" 
//		var advancedFilterItems = _self.getAdvancedFilterItems();
//		if(advancedFilterItems != undefined){
//			fastFilterItems["add"] = advancedFilterItems;
//		}
//		
//		for ( var i in sid)
//		{
//		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
//			var item = sid[i];
//			var data = $("#reportGrid").jqGrid("getRowData", item);
//			
//			var personId=data["personId"] ;
//			var adminOrgUnit=data["adminOrgUnitId"] ;
//			Exchange_json.push({'personId':personId,'adminOrgUnit':adminOrgUnit});
//		}		
//		if(Exchange_json.length>0)
//		{
//			var PersonJson = $.toJSON(Exchange_json) ;
//			var url = _self.exportCommonParam();
//			openLoader(1,jsBizMultLan.atsManager_attendanceResultSumList_i18n_28); 
//		  	shr.ajax({ 
//				type:"post",  
//				url:url, 
//				data: {
//					fastFilterItems : $.toJSON(fastFilterItems),
//					PersonJson : PersonJson 
//				},
//				success:function(res){ 
//					var fileUrl = res.url ;	 
//					closeLoader();    
//					document.location.href = fileUrl; 
//			    }, 
//			    error : function(res){
//			    	shr.showError({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_6});
//			    	closeLoader(); 
//			    } 
//			});
//		}else{
//			shr.showWarning({
//				message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_13
//			});
//		}
//	},
//	exportCommonParam:function(){
//		var self = this;
//		var filterItems = self.getQuickFilterItems();
//		var sorder =   $('#reportGrid').jqGrid('getGridParam', 'sortorder') ;
//		var sordName = $('#reportGrid').jqGrid('getGridParam', 'sortname') ;
//		if(sorder == undefined){
//			sorder = "asc";
//		}
//		if(sordName == undefined){
//			sordName = "personNumber";
//		}
//		if( filterItems == undefined)
//		{ 
//			filterItems = "" ;
//		}
//		//新
//		var searchFilterItems = self.getSearchFilterItems();
//		var fastFilterItems = self.getFastFilterItems();
//		if( searchFilterItems == undefined)
//			searchFilterItems = "" ;
//		if( fastFilterItems == undefined)
//			fastFilterItems = "" ;
//		if(fastFilterItems["add"] == ""){
//			fastFilterItems["add"] = null;
//		}
//		
//		//R20190625-2369保存方案后，其它条件设置的条件被清空
//		//需把视图的filterItem其他条件name="add"改成name="advancedFilter" 
//		var advancedFilterItems = self.getAdvancedFilterItems();
//		if(advancedFilterItems != undefined){
//			fastFilterItems["add"] = advancedFilterItems;
//		}
//		
//		
//		beginDate = $("#beginDate").val();
//		endDate = $("#endDate").val();
//		proposerName = $("#proposer").val();
//		
//		$grid = $('#reportGrid');
//		url = this.dynamicPage_url + "?method=exportToExcel" + "&uipk=" + this.reportUipk
//			+ "&permItemId=" + self.currentPagePermItemId;  
//		//标题		
//		url += "&title=考勤汇总+";
//
//		//拼接查询条件
//		url = url + '&beginDate=' + beginDate + '&endDate=' + endDate + '&orgLongNum='
//				  + encodeURIComponent(orgLongNum) + '&proposerName=' + encodeURIComponent(proposerName)+'&exportAction=exportAction'
//				  +'&filterItems='+encodeURIComponent(filterItems) +'&sumType='+sumType+'&sord='+sorder+'&sidx='+sordName
//				  + '&searchFilterItems='+encodeURIComponent(searchFilterItems);
//		
//		return url ;	
//	}
	,saveAction:function(StrJon){
	
	  	var that = this;
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		var adminOrgId = $("#AdminOrgUnit_el").val();
		var proposerId = $("#proposer_id").val();
		var sid=[];
		var Exchange_json=[];
		sid = $("#reportGrid").jqGrid("getSelectedRows");
		for ( var i in sid)
		{
		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
			var item = sid[i];
			var data = $("#reportGrid").jqGrid("getRowData", item);
			if (data["salaryStatusId"] == jsBizMultLan.atsManager_attendanceResultSumList_i18n_25)
			{
				shr.showWarning({
					message : data["personName"] + jsBizMultLan.atsManager_attendanceResultSumList_i18n_24
				});
				continue;
			}
			var personId=data["personId"] ;
			var adminOrgUnit=data["adminOrgUnitId"] ;
			Exchange_json.push({'personId':personId,'adminOrgUnit':adminOrgUnit});
			
		}		
		if(Exchange_json.length>0)
		{
			var PersonJson = $.toJSON(Exchange_json) ;
		}
		openLoader(1);
		that.remoteCall({
			type:"post",
			//async: false,
			method:"save",
			param:{beginDate:beginDate ,endDate:endDate,adminOrgId:adminOrgId,proposerId:proposerId,PersonJson:PersonJson},
			//param:{begin_Date:beginDate,end_Date:endDate,isAgainFetchCard:isAgainFetchCard},
			//openLoader(1);
			success:function(res){
				closeLoader();
				if (res.flag == 1) {
					shr.showInfo({ message:jsBizMultLan.atsManager_attendanceResultSumList_i18n_1});
				//    closeLoader();
					//window.parent.$("#operationDialog").dialog('close');
				    jQuery('#reportGrid').jqGrid("reloadGrid");	
				}else {
				shr.showError({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_9});
				}
			} ,
			error:function(res){
				closeLoader();
				shr.showInfo( {message :jsBizMultLan.atsManager_attendanceResultSumList_i18n_9});
			}
		});
    }
	,updateAction: function (even){
 		
			
		this.initJsontype();	
	} 
	,cancleSalaryAction:function()
	{
		var that = this;
		var sid = [];
		var period="";
		var Exchange_json=[];
		sid = $("#reportGrid").jqGrid("getSelectedRows");
		if(sid.length==0)
		{
			shr.showWarning({
					message : jsBizMultLan.atsManager_attendanceResultSumList_i18n_14
			});
		}
		for ( var i in sid){
		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
			var item = sid[i];
			var data = $("#reportGrid").jqGrid("getRowData", item);
			if (data["salaryStatusId"] == jsBizMultLan.atsManager_attendanceResultSumList_i18n_18)
			{
				shr.showWarning({
					message : data["personName"] + jsBizMultLan.atsManager_attendanceResultSumList_i18n_19
				});
				continue;
			}
			var personId=data["personId"] ;
			periodName=data["salaryPeriodId"] ;
			var fid = data["personId"]+data["adminOrgUnitId"];
			Exchange_json.push({'personId':personId ,'periodName':periodName,'fid':fid});
		}	
		var postData = $.toJSON(Exchange_json) ;
		if(Exchange_json.length>0)
		{
			 that.remoteCall({
				type:"post",
				method:"CancelSalary",
				param:{postData:postData},
				success:function(res)
				{ 	
					if(res.flag == 0){
						var tip ="";	
						if(res.List!= null)
						{
							var len = res.List.length ;
							if(len > 0){
								tip =jsBizMultLan.atsManager_attendanceResultSumList_i18n_2;
								for(var i = 0; i <= len-1 ; i++)
								{
									tip += res.List[i]+", ";
								}
								tip = tip.substring(0,tip.length-2)+"<br>";
							}
						}
						if(res.LockList!= null)
						{
							var len = res.LockList.length ;
							if(len > 0){
							    tip +=jsBizMultLan.atsManager_attendanceResultSumList_i18n_3;
								for(var i = 0; i <= len-1 ; i++)
								{
									tip += res.LockList[i]+", ";
								}
								tip = tip.substring(0,tip.length-2)+"<br>";
							}
						}
						var options={
						   message:tip
						};
						$.extend(options, {
							type: 'info',
							hideAfter: null,
							showCloseButton: true
						});
						top.Messenger().post(options);
						jQuery('#reportGrid').jqGrid("reloadGrid");
					}
				}   	
			})
		}
	}
	,initJsontype:function(){
	 	var _self = this;
    
		_self.remoteCall({
			type:"post",
			//async: false,
			method:"getSalaryPeriod",
			//param:{begin_Date:beginDate,end_Date:endDate,isAgainFetchCard:isAgainFetchCard},
			success:function(res){
				if (res.flag == 1){
					var isHasSave=false;
					var beginDate=window.parent.atsMlUtile.getFieldOriginalValue("beginDate");
					var endDate=window.parent.atsMlUtile.getFieldOriginalValue("endDate");
					if(beginDate!="" && endDate!="")
					{
						beginDate=beginDate.replace('-','/');
						beginDate=beginDate.replace('-','/');
						endDate=endDate.replace('-','/');
						endDate=endDate.replace('-','/');
					}
					var StrTmp=beginDate+"--"+endDate;
					var Exchange=[];
					for(var i=0; i<res.name.length;i++)
					{
						if( res.name[i]==StrTmp)
						{
							isHasSave=true;
					//
						}
						Exchange.push({'value':res.name[i],'alias':res.name[i]});
					}
					if(!isHasSave){
						var sid = [] ; 
							sid = $("#reportGrid").jqGrid("getSelectedRows");
						var tip = '';
						if(sid.length > 0){
							for(var i = 0; i <= sid.length-1; i++)
							{
								var item = sid[i];
								var data = $("#reportGrid").jqGrid("getRowData",item);
								if(data['salaryPeriodId'] == undefined || data['salaryPeriodId'] == "")
								{
									tip += data['personName']+", ";	
								};
							}
							tip = tip.substring(0,tip.length-2)+jsBizMultLan.atsManager_attendanceResultSumList_i18n_0;
							shr.showInfo({message :tip}); 
							return ;
						}	
						shr.showConfirm(shr.formatMsg(jsBizMultLan.atsManager_attendanceResultSumList_i18n_11,[beginDate+"--"+endDate]),
						function(){
						_self.alertSalaryAction(isHasSave,Exchange);
						});
					}else{
						_self.alertSalaryAction(isHasSave,Exchange);
					}
					
				}else if(res.flag==0){
				    /*
				    $('#saveDataSalary').hide();
				    var row_fields_work = '<div  class="row-fluid row-block row_field">'					  
					  + '<div class="spanSelf" style="color: #999999;">还没汇总考勤数据</div>'
					  +'</DIV>'      
					  
					$('#operationDialog').append(row_fields_work); 
					*/
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_12});

				}
			}
		})
	 }, 
	 alertSalaryAction:function(isHasSave,Exchange){
	 				var _self=this;
	 				var beginDate=window.parent.atsMlUtile.getFieldOriginalValue("beginDate");
					var endDate=window.parent.atsMlUtile.getFieldOriginalValue("endDate");
					if(beginDate!="" && endDate!="")
					{
						beginDate=beginDate.replace('-','/');
						beginDate=beginDate.replace('-','/');
						endDate=endDate.replace('-','/');
						endDate=endDate.replace('-','/');
					}
					var StrTmp=beginDate+"--"+endDate;
					var confirmButtonName = jsBizMultLan.atsManager_attendanceResultSumList_i18n_17;
					var closeButtonName = jsBizMultLan.atsManager_attendanceResultSumList_i18n_7;
					$("#operationDialog").empty();
					$("#operationDialog").dialog({
						title: jsBizMultLan.atsManager_attendanceResultSumList_i18n_29,
						width:650,
						height:350,
						modal: true,
						resizable: true,
						position: {
							my: 'center',
							at: 'top+50%',
							of: window
						} 
					,buttons: {
							confirmButtonName: function() {
								_self.saveDataSalaryAction();
							},
							closeButtonName: function() {
							  	$(this).dialog( "close" );
							}
						}
					});
					/* var row_fields_work = '<div  class="row-fluid row-block row_field">'					  
					  + '<div class="spanSelf"><span class="cell-RlStdType">请选择转资期间</span> </div>'
					  +'<div class="spanSelf"><span class="cell-RlStdType"><input type="text" name="setSalaryPeriod" value="" width="30" class="input-height cell-input" validate="{required:true} " maxlength="10"/></span></div>'
					  +'</DIV>'  */
					  var row_fields_work =''
						  +'<div class="photoState" style="margin-top:50px;margin-left:30px;"><table width="100%"><tr>'
						  +'<td width="30%" style="color: #999999;">'
						  + jsBizMultLan.atsManager_attendanceResultSumList_i18n_16
						  + '</td>'
						  +'<td width="36.2%"><input type="text" name="setSalaryPeriod" value="" width="30" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td></td>'
						  +'</tr></table></div><br>'
						  +'<div><span></span></div>';
					  $("#operationDialog").append(row_fields_work);
					  if(isHasSave)
					  {
					  		$('input[name=setSalaryPeriod]').val(StrTmp);
					  }
					var salary_json = {
						id: "type",
						readonly: "",
						value: "0",
						onChange: null,

						validate: "{required:true}",
						filter: ""
					};
					salary_json.data=Exchange;
					$('input[name=setSalaryPeriod]').shrSelect(salary_json);	
					var year_json = 
					{
						id: "type" + i,
						readonly: "",
						value: "0",
						onChange: null,
						validate: "{required:true}",
						filter: ""
					};
					var Month_json = 
					{
						id: "type" + i,
						readonly: "",
						value: "0",
						onChange: null,
						validate: "{required:true}",
						filter: "" 
					};
					var time_json = 
					{
						id: "type" + i,
						readonly: "",
						value: "0",
						onChange: null,
						validate: "{required:true}",
						filter: ""
					};
		
					var yearValue=[];
					for(var i=1990;i<2050;i++)
					{
					  yearValue.push({'value':i,'alias':i});
					}
					var monthValue=[];
					var timeValue=[];
					for(var j=1;j<13;j++)
					{
					  monthValue.push({'value':j,'alias':j});
					  if(j<6){
					  timeValue.push({'value':j,'alias':j});
					  }
					}
					year_json.data = yearValue;
					Month_json.data=monthValue;
					time_json.data=timeValue;
							  
					var row_fields_work = '<div class="photoState" style="margin-left:30px;"><table width="100%"><tr>'
                    	  +'<td width="15%" style="color: #999999;">'
						+ jsBizMultLan.atsManager_attendanceResultSumList_i18n_22
						+ '</td>'
					  	  +'<td width="15.2%"></td>'
					      +'<td width="10%" ><input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></td>'
						  +'<td width="5.2%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_attendanceResultSumList_i18n_10
						+ '</td>'
						  +'<td width="8%" style="color: #999999;"><input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td width="5.2%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_attendanceResultSumList_i18n_27
						+ '</td>'
						  +'<td width="8%"><input type="text" name="time" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td width="5%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_attendanceResultSumList_i18n_4
						+ '</td>'
						  +'<td></td></tr></table></div>';					  
					$('#operationDialog').append(row_fields_work);
					$('input[name=YEAR]').shrSelect(year_json);	
					$('input[name=MONTH]').shrSelect(Month_json);	
					$('input[name=time]').shrSelect(time_json);	
					var curDate = new Date();
		            var curDateY = curDate.getFullYear();
					var curDateM = curDate.getMonth()+1;
					$('input[name=YEAR]').val(curDateY);
					$('input[name=MONTH]').val(curDateM);
					$('input[name=time]').val(1);
					$('.overflow-select').css("max-height","150px").css("overflow-y","auto");
	 
	 
	 }
	,saveDataSalaryAction : function(){
		var that = this;
		var setSalary = $('input[name=setSalaryPeriod]').val();
		if(setSalary == ""){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_31});
			return false;
		}
	    var arra=setSalary.split("--");
		var beginDate=arra[0];
		var endDate=arra[1];
		beginDate=beginDate.replace('/','-');
		beginDate=beginDate.replace('/','-');
		endDate=endDate.replace('/','-');
		endDate=endDate.replace('/','-');
		var periodYear = $('input[name=YEAR]').val();
		var periodMonth = $('input[name=MONTH]').val();
		var times = $('input[name=time]').val();
		if (periodYear == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_20});
			return false;
		}
		if (periodMonth == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_21});
			return false;
		}
		if (times == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_5});
			return false;
		}
		var  period=periodYear+"-"+periodMonth+"-"+times;
		
		var sid=[];
		var Exchange_json=[];
		sid = $("#reportGrid").jqGrid("getSelectedRows");
		for ( var i in sid)
		{
		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
			var item = sid[i];
			var data = $("#reportGrid").jqGrid("getRowData", item);
			var personId     = data["personId"] ;
			var adminOrgUnit = data["adminOrgUnitId"] ;
			var personName   = data["personName"];
			Exchange_json.push({'personId':personId,'adminOrgUnit':adminOrgUnit,'personName':personName});
			
		}	
		if(Exchange_json.length>0)
		{
			var PersonJson = $.toJSON(Exchange_json) ;
		}
		
		
		openLoader(1);
		that.remoteCall({
			type:"post",
			method:"saveSalary",
			param:{beginDate:beginDate,endDate:endDate,period:period,PersonJson:PersonJson},
			success:function(res){
				closeLoader();
				$("#operationDialog").dialog("close");
				if (res.flag == 0)
				{
						var tip ="";	
						if(res.List!= null)
						{
							var len = res.List.length ;
							if(len > 0){
								tip =jsBizMultLan.atsManager_attendanceResultSumList_i18n_30;
								for(var i = 0; i <= len-1 ; i++)
								{
									tip += res.List[i]+", ";
								}
								tip = tip.substring(0,tip.length-2)+"<br>";
							}
						}
						if(res.LockList!= null)
						{
							var len = res.LockList.length ;
							if(len > 0){
							    tip +=jsBizMultLan.atsManager_attendanceResultSumList_i18n_33;
								for(var i = 0; i <= len-1 ; i++)
								{
									tip += res.LockList[i]+", ";
								}
								tip = tip.substring(0,tip.length-2)+"<br>";
							}
						}
					var options={
					   message:tip
					};
					$.extend(options, {
						type: 'info',
						hideAfter: null,
						showCloseButton: true
					});
				top.Messenger().post(options);	
				window.parent.atsMlUtile.setTransDateTimeValue("beginDate",beginDate);
				window.parent.atsMlUtile.setTransDateTimeValue("endDate",endDate);
				window.parent.$("#reportGrid").jqGrid('setGridParam', {
				    datatype : 'json',
				    postData : {
					'beginDate1' : beginDate,
					'endDate1' : endDate,
					'adminOrgId1' :  window.parent.$("#AdminOrgUnit_el").val(),  
					'proposerId1' : window.parent.$("#proposer_id").val(),
					'NewRearch'   : 'newRearch'  ,
					'page' : 1
				     },
				     page : 0
		          })
				}else{
				shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultSumList_i18n_32});
				window.parent.$("#reportGrid").jqGrid('setGridParam', {
				    datatype : 'json',
				    postData : {
					'beginDate1' : window.parent.atsMlUtile.getFieldOriginalValue("beginDate"),
					'endDate1' : window.parent.atsMlUtile.getFieldOriginalValue("endDate"),
					'adminOrgId1' : window.parent.$("#AdminOrgUnit_el").val(),  
					'proposerId1' : window.parent.$("#proposer_id").val(),
					'NewRearch'   : 'newRearch'  ,
					'page' : 1
				      },
				      page : 0
		          });
				}
				 window.parent.jQuery('#reportGrid').jqGrid("reloadGrid");	
			}
		});
	},
	clearAdminOrgUnitVal: function(){
		 $("#AdminOrgUnit").blur(function(){
		       if($("#AdminOrgUnit_el").val() == null || $("#AdminOrgUnit_el").val() == ""){
		           orgLongNum = "";
		       }
		 });
	}
});	
