var sidValue = [];
var orgLongNum="";
var personID="";
var fromType=1;//跳入缺卡检查页面的方式（1:从补签卡列表进入，2：从批量补签卡表单进入）
var colNames=[];
var colModel = [];
var fillSignCardRowDataCache = new Map();

//var fillSignCardRowDataCache = [];
shr.defineClass("shr.ats.LackPunchCardChecked", shr.framework.List, {

	reportUipk :   "com.kingdee.eas.hr.ats.app.LackPunchCardChecked.list" ,
    rowNumPerPage : 15,
    gridId: '#reportGrid', 
    isFirstTimeLoad: true ,
	initalizeDOM : function () {
		shr.ats.LackPunchCardChecked.superClass.initalizeDOM.call(this);
		var hrOrgUnitId=getArgs("hrOrgUnit");
		if(hrOrgUnitId!=null && hrOrgUnitId!=""){
			fromType=2;
//			$("#hrOrgUnit").shrPromptBox("disable");
		}
		$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>');
		var that = this;
		
		flag=1;

		that.processF7ChangeEvent();
		//that.initFilterDate(); //初始化默认查询条件
		//that.renderDataGrid();//加载datagrid
		//$("#searcher").css("visibility","hidden");//手动去掉高级搜索

		//业务组织change事件
//		that.processHrOrgUnitF7ChangeEvent();
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		if(hrOrgUnitId != undefined){
			that.initHrOrgUnit(hrOrgUnitId);
		}
		that.initalSearch();
	    
	    $('#searcher').shrSearchBar('option', {
			afterSearchClick: this.queryGridByEvent
		});
//		$("#searcher").remove();//手动去掉高级搜索
	    
	    that.doRenderDataGrid();
	    this.requireSavePageState = true ;
	//	jQuery("#grid").jqGrid('setFrozenColumns');initCreateDefaultView
	   //$('#datagrid').append('<table id="reportGrid"></table>');
	}
	//设置高级查询 
	,initalSearch : function(){
		$('#grid-toolbar').children().eq(1).append('<div id="searcher" class="pull-right"/>');
		var searcherFields = [];
		searcherFields[0] = {columnName:"name",label:jsBizMultLan.atsManager_lackPunchCardChecked_i18n_6};
		searcherFields[1] = {columnName:"number",label:jsBizMultLan.atsManager_lackPunchCardChecked_i18n_7};
		var options = {
			gridId: "reportGrid",
			uipk: "com.kingdee.eas.hr.ats.app.LackPunchCardChecked.list",
			query: "" ,
			fields :searcherFields
		};
	
		$("#searcher").shrSearchBar(options);
		//设置其默认的过滤方案
		var filter = $("#searcher").shrSearchBar('option', 'filterView');
		if ($.isEmptyObject(filter)) {
			// 如果filter为空
			if (!$.isEmptyObject($("#searcher").shrSearchBar('option', 'defaultViewId'))) {
				// 加载默认过滤方案触发表格取数
				$("#searcher").shrSearchBar('chooseDefaultView');
			}
		}	
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
	//设置业务组织onchange事件
	,processHrOrgUnitF7ChangeEvent:function(){
		var that = this;
		$("#hrOrgUnit").shrPromptBox("option", {
			onchange : function(e, value) {
				var info = value.current;
				that.initHrOrgUnit(info.id);
				$("#proposer").val("");
			}
		});
	}
	//初始化业务组织
	,initHrOrgUnit:function(hrOrgUnitId){
		var that = this;
		$("#proposer").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
	}
	//设置存在假期档案历史人员F7的 业务组织过滤条件（将业务组织id存进session）
	,initQuerySolutionHrOrgUnit: function(hrOrgUnitId) {
		 var that = this;
		 that.remoteCall({
			type:"post",
			method:"initQuerySolution",
			param:{
				hrOrgUnitId : hrOrgUnitId
			},
			async: true, 
			success:function(res){
				//do nothing...
			}
		});
	}
	/**
	 * 点击取消按钮 返回到补签卡列表list(专员) ||  com.kingdee.eas.hr.ats.app.FillSignCardAllList
	 */
	,cancelAllAction:function(){	
	 	/*window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.FillSignCardAllList";*/
		history.back();
		//var _self = this ;
	 	//_self.reloadPage({
		//	uipk: 'com.kingdee.eas.hr.ats.app.FillSignCardAllList'
		//});
	}
	
	//更变组织和人员更变时
	,processF7ChangeEvent : function(){
		var that = this;
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   if(info!=null){
				   if(info.longNumber !=null && info.longNumber!=''){ 
						orgLongNum=info.longNumber;
			   }
			   else{
			   	   orgLongNum = ""
			   }

			}
			}
		});
		
		$('#proposer').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   if(info!=null){
				   if(info.id !=null && info.id!=''){ 
						personID=info.id;
				   }

			  }
			  else {
			  	personID = "";	
			  }
			}
		});
  }
  
  //批量补签-跳转到批量补签页面
	,batchFillCardAction : function () {
		var _self = this;
		_self.setRowDataCache();
		
		if (!fillSignCardRowDataCache.isEmpty()){
			var cacheSize = fillSignCardRowDataCache.size();
			if (cacheSize <=100){
				var fillCardArray = fillSignCardRowDataCache.values();
				var proposerID="",proposerNumber="",proposerName="",attendDate="",lackPunchCardTime="";
				for (var i =0;i<cacheSize;i++){
					var temp_obj = fillCardArray[i];
					proposerID += temp_obj.proposerID+",";
					proposerNumber += temp_obj.proposerNumber+",";
					proposerName += temp_obj.proposerName+",";
					attendDate += temp_obj.lackPunchCardTime.substring(0,10)+" 00:00:00"+",";
					lackPunchCardTime += temp_obj.lackPunchCardTime.substring(11,16)+",";
				}
				proposerID = proposerID.substring(0,proposerID.length-1);
				proposerNumber = proposerNumber.substring(0,proposerNumber.length-1);
				proposerName = proposerName.substring(0,proposerName.length-1);
				attendDate = attendDate.substring(0,attendDate.length-1);
				lackPunchCardTime = lackPunchCardTime.substring(0,lackPunchCardTime.length-1);

			setCookie("fillFlag","1",0);//标记cookie中的内容含有缺卡检查页面设置的值
			var hrOrgUnitId="";
			//从补签卡列表进入当前页面，考勤组织可选
			if(fromType==1){
				shr.showWarning({message: jsBizMultLan.atsManager_lackPunchCardChecked_i18n_5, hideAfter: 3});
				var filterParams = _self.getFilterParams();
				hrOrgUnitId=filterParams.hrOrgUnitId;
				if(hrOrgUnitId.indexOf(",") > 0){
					hrOrgUnitId= hrOrgUnitId.substring(0,hrOrgUnitId.indexOf(","));
				}
				if(hrOrgUnitId==null||hrOrgUnitId==""){
					var Arrays = new Array();
					var yz="";
					var gridData= $("#reportGrid").jqGrid("getSelectedRows");
					for(var i = 0 ; i < gridData.length ; i++){
					var data = $("#reportGrid").jqGrid("getRowData", gridData[i]);
					if(yz == ""){
						yz=data.hrOrgUnitId;
					}else{
						if(yz != data.hrOrgUnitId){
						break;
						}
					}
					if(i == gridData.length-1){
					hrOrgUnitId=data.hrOrgUnitId;
					}
					}
					if(hrOrgUnitId==null||hrOrgUnitId==""){
					shr.showWarning({message: jsBizMultLan.atsManager_lackPunchCardChecked_i18n_8});
					return;
					}
				}
			}
			//从批量补签卡进入当前页面，考勤组织不可选
			else{
				hrOrgUnitId=getArgs("hrOrgUnit");
			}		
		   var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.LackPunchCardCheckedHandler&method=setFillCardInfoIntoSession";
		   shr.ajax({
			type:"post",
			async:false,
			url:url,
			data:{
					proposerID:encodeURIComponent(proposerID),
				    proposerNumber:encodeURIComponent(proposerNumber),
				    proposerName:encodeURIComponent(proposerName),
					attendDate:encodeURIComponent(attendDate),	
					lackPunchCardTime:encodeURIComponent(lackPunchCardTime)	,
					hrOrgUnit:hrOrgUnitId
			},
			success:function(res)
			{
			}
		 	});
			
			_self.reloadPage({
						uipk: "com.kingdee.eas.hr.ats.app.FillSignCardBatchNew",
						method: "addNew",
						ignoreHROrgF7Cache : true //业务组织不走平台取缓存的逻辑
				});
			
			}else {
				shr.showWarning({message:jsBizMultLan.atsManager_lackPunchCardChecked_i18n_9});
			}
			
		
		}else {
			shr.showWarning({message:jsBizMultLan.atsManager_lackPunchCardChecked_i18n_2});
		}
		
	},
	
	//导出选中 重写 2017-12-01
	exportCurrentAction: function(){	
		var _self = this;
		_self.setRowDataCache();
		var dataList =[];
		
		if (!fillSignCardRowDataCache.isEmpty()){
			  var cacheSize = fillSignCardRowDataCache.size();
				var fillCardArray = fillSignCardRowDataCache.values();
				for (var i =0;i<cacheSize;i++){
					  var temp_obj = fillCardArray[i];	   
 						var proposerNumber= encodeURIComponent(temp_obj.proposerNumber);
   					var proposerName =encodeURIComponent(temp_obj.proposerName);
					  var attendDate = temp_obj.attendDate;
  					var punchCardTime = encodeURIComponent(temp_obj.punchCardTime);
            var lackPunchCardTime= temp_obj.lackPunchCardTime; 
                   
					  dataList.push({'proposerNumber':proposerNumber,'proposerName':proposerName,'attendDate':attendDate,'punchCardTime':punchCardTime,'lackPunchCardTime':lackPunchCardTime});					
				}			
		}
	
		if(fillSignCardRowDataCache.size() == 1){
			if(typeof(dataList[0].proposerNumber)=='undefined'){
				shr.showWarning({
					message: jsBizMultLan.atsManager_lackPunchCardChecked_i18n_3
				});
				return false;	
			}
		}
		
		
		if(dataList.length>0){
			var PersonJson = $.toJSON(dataList) ;
			var url = _self.exportCommonParam();
			var postData=$('#reportGrid').jqGrid("getGridParam","postData");
			$('#grid')._pingPostData(postData);
			option = { isAll: true};
			
			var param = $.extend({}, postData, option);
			param.PersonJson = PersonJson;
			param.method = 'exportToExcel';
//			var url =this.dynamicPage_url ;
            var callback = function(psw) {
                $.extend(param,{exportPrivteProtected: psw});
                shr.reloadUrlByPost(url, param, 'exportToExcel');
            }
            if(window.isShrSensitiveRuleOpen) {
                fieldSensitiveService.setExportPsw(callback);
            }else{
                callback();
            }
//		  	shr.ajax({ 
//				type:"post",  
//				url:url, 
//				data: {
//					PersonJson : PersonJson 
//				},
//				success:function(res){ 
//					var fileUrl = res.url ;	 
//					closeLoader();    
//					document.location.href = fileUrl; 
//			    }, 
//			    error : function(res){
//			    	shr.showError({message: "导出失败 "});
//			    	closeLoader(); 
//			    } 
//			});
		}else{
			shr.showWarning({
				message: jsBizMultLan.atsManager_lackPunchCardChecked_i18n_3
			});
		}
	},
	exportCommonParam:function(){
		var self = this;	
		url = this.dynamicPage_url + "?method=exportToExcel" + "&uipk=" + this.reportUipk;  	
		return url ;	
	},
	getAllDataRequestURL : function () {
		return this.dynamicPage_url
		 + "?method=exportToExcelALL"
		 + "&uipk=" + this.reportUipk;  
	},
	//导出全部
	exportToExcelAction:function(){
		var self = this;
		var table = $("#reportGrid");
		var filterParams = self.getFilterParams();
		var beginDate = filterParams.beginDate;
		var endDate = filterParams.endDate;
		var adminOrgUnit = filterParams.adminOrgUnit;
		var proposer = filterParams.proposer;
		var sidx = $("#reportGrid").jqGrid("getGridParam").sortname;
		var sord = $("#reportGrid").jqGrid("getGridParam").sortorder;
		
		var hrOrgUnitId = filterParams.hrOrgUnitId;
		var url = self.getAllDataRequestURL();
		var serviceId = self.getUrlParams("serviceId");
		url+='&beginDate=' + beginDate + '&endDate=' + endDate + '&hrOrgUnitId=' + encodeURIComponent(hrOrgUnitId) + '&adminOrgUnit=' + encodeURIComponent(adminOrgUnit) + '&proposerID=' + encodeURIComponent(proposer) +'&research=1',
		url+='&sidx='+sidx+'&sord='+sord+'&searchFilterItems='+encodeURIComponent(filterParams.searchFilterItems)+"&serviceId="+serviceId;
		var param="";
        var callback = function(psw) {
            param = {exportPrivteProtected: psw};
            shr.reloadUrlByPost(url, param, 'exportToExcelALL');
        }
        if(window.isShrSensitiveRuleOpen) {
            fieldSensitiveService.setExportPsw(callback);
        }else{
            callback();
        }

	}
	
  //初始化默认查询条件
  //日期止：当天，日期起：当天前一周
  //组织：当前操作人的组织
  ,initFilterDate : function () {
	    var _self = this;
		var curDate = new Date();
		var lastWeekDate = new Date(curDate.getTime() - 1000 * 60 * 60 * 24 * 7);
		var lastWeekDateStr = _self.getFormatDateString(lastWeekDate);
		var curDateStr = _self.getFormatDateString(curDate);

		atsMlUtile.setTransDateTimeValue("beginDate",lastWeekDateStr);
		atsMlUtile.setTransDateTimeValue("endDate",curDateStr);
		var hrOrgUnitId=getArgs("hrOrgUnit");
		//设置默认的查询组织 这边必须的用同步的请求，不然无法过滤。
		  var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.LackPunchCardCheckedHandler&method=getDefaultFilter";
		   shr.ajax({
			type:"post",
			async:false,
			url:url,
			data:{"hrOrgUnit":hrOrgUnitId},
			success:function(res)
			{
				if(res.flag="Sucess")
				{
					var info=res.adminOrgUnit;
					if(info!=null)
					{
						var adminOrgValue = {
							id : info.orgID,
							name : info.orgName,
							longNumber:info.longNumber
						};
					$('#adminOrgUnit').shrPromptBox("setValue", adminOrgValue);
						var holidayValue={
							id : info.holidayPolisetId,
							name : info.holidayPolisetName
						};
					$('#holidayPolicySet').shrPromptBox("setValue",holidayValue);
					}
					info =res.hrOrgUnit;
					if(info!=null)
					{
						var hrOrgValue = {
							id : info.id,
							name : info.name
						};
						$('#hrOrgUnit').shrPromptBox("setValue", hrOrgValue);
					}
				}else if(res.flag="Fail")
				{
					shr.showError({message: jsBizMultLan.atsManager_lackPunchCardChecked_i18n_0});
				} 
			}
		});
	}
	
	//获得日期的String格式：YYYY-MM-DD
	,getFormatDateString : function (date) {
		var dateY = date.getFullYear();
		var dateM = date.getMonth()+1;
		dateM = dateM<10?"0"+dateM:dateM;
		var dateD = date.getDate();
		dateD = dateD<10?"0"+dateD:dateD;
		var formatDate = dateY+"-"+dateM+"-"+dateD
		return formatDate;
	}
  
  //加载datagrid
  ,renderDataGrid : function () {
		var self = this,
		schemaId = shr.getUrlRequestParam("schemaId"),
		periodId = shr.getUrlRequestParam("periodId");
		//holidayPolicyId=$("#holidayPolicySet_el").val();
		//先加载datagrid表头属性
		self.remoteCall({
			method : "getGridColModel",
			cache:false,
			//param : {
			//	"holidayPolicyId":holidayPolicyId
			//},
			success : function (response) {
				
				//self.doRenderDataGrid(reponse);
				colNames = response.colNames;
				colModel = response.colModel;
			}
		});
		
	},
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
    //查询
	,queryAction : function () {
		var self = this;
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attendDate","errorMessage":jsBizMultLan.atsManager_lackPunchCardChecked_i18n_4});
		if(!dateRequiredValidate)
			return;
		var filterParams = self.getFilterParams();
		/*if(filterParams.beginDate != "" && 
				filterParams.endDate != ""){
			if (!self.verifyStartTime()){
				return;
			}
		}*/
		
		$('#datagrid').empty();
		$('#datagrid').append('<div class="row-fluid row-block"></div><div id="gridPager1"></div> <table id="reportGrid"></table>');	
		flag=2;		
		self.doRenderDataGrid();
		fillSignCardRowDataCache = new Map();
	}
	,
	/**
	 * 查询表格
	 */
	queryGrid: function() {
		this.setGridTreeParam();
		this.setGridCustomParam();
		
		var $grid = $(this.gridId);
		// selector
		var selector = this.getSelector();
		if (typeof selector !== 'undefined') {
			$grid.setGridParam({ selector: selector	});
		}
		// filter
		var filterItems = this.getFilterItems();
		$grid.jqGrid("option", "filterItems", filterItems);

		// fastFilter
		var fastFilterItems = this.getFastFilterItems();
		if (fastFilterItems) {
			$grid.jqGrid("option", "fastFilterItems", JSON.stringify(fastFilterItems));
		}
		
		// sorter
		var sorterItems = this.getSorterItems();
		if (sorterItems) {
			$grid.jqGrid("option", "sorterItems", sorterItems);
		}
		var keyField = this.getBillIdFieldName();
		if (keyField) {
			$grid.jqGrid("option", "keyField", keyField);
		}
		// 修改为通过URL取数
		$grid.jqGrid('setGridParam', {datatype:'json'});
		
		if(!this.isFirstTimeLoad){
			$grid.jqGrid("reloadGrid");
		}else{
			this.isFirstTimeLoad = false;
		}
	}
	
	//时间校验
	,verifyStartTime : function(){
		var self = this;
		var filterParams = self.getFilterParams();
		var beginDate =  filterParams.beginDate,endDate = filterParams.endDate;
		if(beginDate != undefined && endDate != undefined){
			var d1 = new Date(beginDate.replace(/\-/g, "\/"));
			var d2 = new Date(endDate.replace(/\-/g, "\/"));
			if(d1 > d2){
				shr.showWarning({message: jsBizMultLan.atsManager_lackPunchCardChecked_i18n_1, hideAfter: 3});
				return false;
			}
		}else{
			return true;
		}
	}
	  
	/**
	 * 表格数据请求URL
	 */
	,getGridDataRequestURL : function () {
		return this.dynamicPage_url
		 + "?method=getGridData"
		 + "&uipk=" + this.reportUipk;  
	},
   //加载datagrid
   doRenderDataGrid : function (reponse) {
		var _self = this;
		if(colNames.length ==0 || colNames.length !=colModel.length){
			_self.remoteCall({
				method : "getGridColModel",
				cache:false,
				success : function (response) {
					colNames = response.colNames;
					colModel = response.colModel;
					_self.queryData();
					
				}
			});
		}else {
			_self.queryData();
		}
	},
	queryData: function() {
		var _self = this;
		var table = $("#reportGrid");
		//精确搜索
		var filterParams = _self.getFilterParams();
		var url = _self.getGridDataRequestURL();
		var serviceId = _self.getUrlParams("serviceId");
		var	options = {
			url : url + '&beginDate=' + filterParams.beginDate + '&endDate=' + filterParams.endDate + '&hrOrgUnitId=' + encodeURIComponent(filterParams.hrOrgUnitId) 
			+ '&adminOrgUnit=' + encodeURIComponent(filterParams.adminOrgUnit)
			+ '&isDefaultManage=' + encodeURIComponent(filterParams.ISDEFAULTMANAGE) 
			+ '&proposerID=' + encodeURIComponent(filterParams.proposer) +'&research='+flag 
			+'&searchFilterItems='+encodeURIComponent(filterParams.searchFilterItems)+'&serviceId='+serviceId,
			datatype : "json",
			multiselect : true,
			rownumbers : true,
			colNames : colNames,
			colModel : colModel,
			rowNum : _self.rowNumPerPage,
			// pager : '#gridPager1',
			height : 'auto',
			rowList : [100, 30, 45, 60],
			recordpos : 'left', 
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			// pginput : true,   
			shrinkToFit :true,  
			viewrecords : true,
			sortname: "",
			sortorder: "",
			customPager : '#gridPager1',  
			pagerpos:"center",
			pginput:true, 
			pginputpos:"right"
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
				"position":"relative",
				"top":"-25px",
				"right":"0px",
				"background":"#FFF"
			})
			// _self.handleMicroToolbarInfo();
		};
		// clear table
		table.jqGrid(options);
		//$('#reportGrid').GridUnload();   
		jQuery('#reportGrid').jqGrid('setFrozenColumns');	
	},
	getFilterParams: function() {
		var _self = this;
		var filterParams = {};
		//精确搜索
		filterParams.searchFilterItems = _self.getSearchFilterItems();
		if( filterParams.searchFilterItems == undefined)
			filterParams.searchFilterItems = "" ;
		//快速过滤
		var fastFilterItems = _self.getFastFilterItems();
		if( fastFilterItems == undefined)
			fastFilterItems = "" ;
		filterParams.beginDate = fastFilterItems.attendDate["values"]["startDate"];
		filterParams.endDate = fastFilterItems.attendDate["values"]["endDate"];
		if( filterParams.beginDate == undefined)
			filterParams.beginDate = "" ;
		if( filterParams.endDate == undefined)
			filterParams.endDate = "" ;
		
		filterParams.hrOrgUnitId = fastFilterItems.hrOrgUnit ? fastFilterItems.hrOrgUnit["values"] : "";
		if( filterParams.hrOrgUnitId == undefined)
			filterParams.hrOrgUnitId = "" ;
		filterParams.adminOrgUnit = fastFilterItems.adminOrgUnit["values"];
		if( filterParams.adminOrgUnit == undefined)
			filterParams.adminOrgUnit = "" ;
		if(fastFilterItems.proposer && fastFilterItems.proposer["values"]){
			filterParams.proposer = fastFilterItems.proposer["values"];
		}
		if( filterParams.proposer == undefined)
			filterParams.proposer = "" ;
		
		filterParams.ISDEFAULTMANAGE = fastFilterItems.ISDEFAULTMANAGE["values"];
		if( filterParams.ISDEFAULTMANAGE == undefined){
			filterParams.ISDEFAULTMANAGE = "" ;
		}
		return filterParams;
	}
	
	,handleMicroToolbarInfo : function () {
		var self = this;
		var html = "";
		//html += "<div id="gridPager1234"  >";
		//html += "<div id="pg_gridPager1234" >";
		html += "<div class='shrPage page-Title' >";
		html += "<span id='gripage' class='ui-paging-info' style='cursor: default;display: inline-block;font-size: 13px;padding: 2px 5px 0 0;'></span>";
		html += "<span id='prevId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-prev'></span>";
		html += "<span id='nextId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-next'></span></div>";
		//html += "</div>";
		//html += "</div>";
		
		$('#microToolbar').html("");
		$('#microToolbar').append(html);

		$("#gripage").on("click", self.selectRowNumPerPage);
		$("#prevId").on("click", function(){
			self.prePage();	
		});	
		$("#nextId").on("click", function(){
			self.nextPage();
			//self.setCurrentPageSelection();
		});

		//页码 (1-4)/4
		self.updatePageEnable();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
		$("#gridPager1").hide();

		if (jQuery.browser.msie) {
      		$a = jQuery('.ui-jqgrid .ui-jqgrid-bdiv');
      		$a.css('padding', '0 0 15px 0');
      		var myheight = jQuery('#reportGrid').jqGrid('getGridParam','height');
        if( myheight   == '100%'){ 
          	$a.css('overflow-y', 'hidden');
      	  }
     	}
		shr.setIframeHeight();
		self.setCurrentPageSelection();
		
		//处理白框没有包含所有数据的高度问题
		$(".view_manager_body > .span12:first").css("height","auto");
	},
	//更新翻页按钮的样式
	updatePageEnable:function () {
//		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		var currentPage = $("#reportGrid").getGridParam().page;
		var rowNum = $("#reportGrid").getGridParam().rowNum;
		var records = $("#reportGrid").getGridParam().records;
		
		//当前为第一页
		if (currentPage==1){
//		if (temp.substring(1, temp.indexOf('-')) == '1') {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}
		
		//当前为最后一页
		if (currentPage*rowNum-records > 0 && currentPage*rowNum-records<=rowNum){
//		if (parseInt(temp.substring(temp.indexOf('-') + 1, temp.indexOf(')'))) >= parseInt(temp.substring(temp.indexOf('/') + 1))) {
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
		//this.verifyStartTime();
		jsBinder.setRowDataCache();
		$("#prev_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
//		jsBinder.setCurrentPageSelection();
	},
	
	nextPage : function () {
		var _self = this;
		jsBinder.setRowDataCache();
		$("#next_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
//		jsBinder.setCurrentPageSelection();
	}
	
	
	//翻页缓存处理
	//时机：点击上一页、下一页、批量补签按钮
	//将当前页面选中数据与全局变量做对比：1、当前有全局无，插入全局；2、当前无全局有，删除全局；3、都无或者都有，保持不变
	,setRowDataCache : function () {
		var _self = this;
		var currentPageRows = $("#reportGrid").jqGrid("getSelectedRows");
		var page = $("#reportGrid").getGridParam().page;
		var rowNum = $("#reportGrid").getGridParam().rowNum;
		var beginRow = rowNum*(page-1)+1;
		var endRow = rowNum*page;
		
		//删除取消勾选的数据
		for (var x = beginRow;x<=endRow;x++){
			if (fillSignCardRowDataCache.containsKey(x)){
				var delFlag = true;
				for (var y in currentPageRows){
					if (x==currentPageRows[y]){
						delFlag = false;
						break;
					}
				}
				if (delFlag){
					fillSignCardRowDataCache.remove(x);
				}		
			}
		}

		//向全局变量中插入没有的数据
		for (var i in currentPageRows){
			if (!fillSignCardRowDataCache.containsKey(currentPageRows[i])){
				fillSignCardRowDataCache.put(currentPageRows[i],$("#reportGrid").jqGrid('getRowData',currentPageRows[i]));
			}
		}
	}
		
	//翻页后页面与全局变量：将翻页后页面存在于全局变量中的数据打钩；
	,setCurrentPageSelection : function () {
		var page = $("#reportGrid").getGridParam().page;
		var rowNum = $("#reportGrid").getGridParam().rowNum;
		var beginRow = rowNum*(page-1)+1;
		var endRow = rowNum*page;
		
		for (var x = beginRow;x<=endRow;x++){
			if (fillSignCardRowDataCache.containsKey(x)){
				$("#reportGrid").setSelection(x,true);
			}
		}
	}
	
	
	
	
});



function setCookie(name,value,expiresHours){
	if (name=="proposerID"){
		var cookieString=name+"="+encodeURIComponent(value); 
	} else {
		var cookieString=name+"="+value;
	}
	 
	//判断是否设置过期时间 
	if(expiresHours>0){ 
	var date=new Date(); 
	date.setTime(date.getTime+expiresHours*3600*1000); 
	cookieString=cookieString+"; expires="+date.toGMTString(); 
	} 
	document.cookie=cookieString; 
} 

function getArgs(strParame) {
    var args = new Object();
    var query = location.search.substring(1); // Get query string
    var pairs = query.split("&"); // Break at ampersand
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); // Look for "name=value"
        if (pos == -1) continue; // If not found, skip
        var argname = pairs[i].substring(0, pos); // Extract the name
        var value = pairs[i].substring(pos + 1); // Extract the value
        value = decodeURIComponent(value); // Decode it, if needed
        args[argname] = value; // Store as a property
    }
    return args[strParame]; // Return the object
}

//构造一个MAP，做缓存使用
function Map() {
    this.elements = new Array();
    //获取MAP元素个数
    this.size = function() {
        return this.elements.length;
    };
    //判断MAP是否为空
    this.isEmpty = function() {
        return (this.elements.length < 1);
    };
    //删除MAP所有元素
    this.clear = function() {
        this.elements = new Array();
    };
    //向MAP中增加元素（key, value) 
    this.put = function(_key, _value) {
        this.elements.push( {
            key : _key,
            value : _value
        });
    };
    //删除指定KEY的元素，成功返回True，失败返回False
    this.remove = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //获取指定KEY的元素值VALUE，失败返回NULL
    this.get = function(_key) {
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    return this.elements[i].value;
                }
            }
        } catch (e) {
            return null;
        }
    };
    //获取指定索引的元素（使用element.key，element.value获取KEY和VALUE），失败返回NULL
    this.element = function(_index) {
        if (_index < 0 || _index >= this.elements.length) {
            return null;
        }
        return this.elements[_index];
    };
    //判断MAP中是否含有指定KEY的元素
    this.containsKey = function(_key) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //判断MAP中是否含有指定VALUE的元素
    this.containsValue = function(_value) {
        var bln = false;
        try {
            for (i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value) {
                    bln = true;
                }
            }
        } catch (e) {
            bln = false;
        }
        return bln;
    };
    //获取MAP中所有VALUE的数组（ARRAY）
    this.values = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    };
    //获取MAP中所有KEY的数组（ARRAY）
    this.keys = function() {
        var arr = new Array();
        for (i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    };
}
