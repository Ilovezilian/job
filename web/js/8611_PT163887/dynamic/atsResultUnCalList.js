var thisObject;
shr.defineClass("shr.ats.atsResultUnCalList", shr.framework.List, {
	pageStep: 0,
	rowNumPerPage : 15,
	attendPeriodId: "",
	dateSelectName: "dateSet.date",
	atsPeriodObj: null,
	selectedHrOrgIds:[],
	initalizeDOM : function () {
		
		var _self = this;	
		thisObject = _self;
		
		//初始化TAB页签
		_self.initTabPages();
		
		_self.initSearchLabel();
		
		this.processF7ChangeEvent();
		
		shr.ats.atsResultUnCalList.superClass.initalizeDOM.call(_self);
		
		//查看后台事务，未参与计算单据count
//		shr.attenceCalCommon.initviewTransaction(this.dateSelectName);
		
		shr.attenceCalCommon.initBreadCrumb();
		
		_self.initBreadCrumbUnCal();
	},
	getPageState: function(){
		var _self = this;
		_self.fastFilterMap = null;
		return shr.ats.atsResultUnCalList.superClass.getPageState.call(this);
	},
	reLoadPageState: function() {
		if (this.requireSavePageState) {
			var pageState = this.getSavedPageState();
			if (pageState) {
				this.setPageState(pageState);				
				this.clearSavedPageState();
			}else{
				var lastAtsFilter = JSON.parse(localStorage.getItem('lastAtsFilter'));
				if(lastAtsFilter){
					$('#searcher').shrSearchBar('setFilterView', lastAtsFilter);
				}
			}
			shrDataManager.pageStateStore.check();
		}
	},
	queryGridByEvent: function(e){
		var uipkArr = shr.attenceCalCommon.getCachedUipk();
		//处理快速过滤
		setTimeout(function(){
			var uipk = jsBinder.uipk
			var arr = Object.keys(localStorage).filter(function(item){return item.indexOf(uipk + '#fastFilterItems') >= 0});
			for(var k=0; k<uipkArr.length; k++){
				var otherUipkKey = uipkArr[k];
				for(var i=0;i<arr.length;i++){
					var preKey = arr[i];
					var key = preKey.replace(uipk, otherUipkKey);
					localStorage.setItem(key, localStorage.getItem(preKey));
				}	
			}
			
			//处理精确搜索	
			var filter = jsBinder.getPageState().filter;
			if(filter){
				localStorage.setItem('lastAtsFilter', JSON.stringify(filter));
			}
			//父类方法
			var viewPage;
			if (e.target) {
				viewPage = shr.getCurrentViewPage(e.target);
			} else {
				viewPage = shr.getCurrentViewPage(e);
			}
			
			// 将页码恢复为第1页
			$(viewPage.gridId).jqGrid('option', 'page', 1);
			viewPage.queryGrid();			
		}, 10)		
	},
	initBreadCrumbUnCal: function(){
		$("#breadcrumb").find("li.active").html(jsBizMultLan.atsManager_atsResultUnCalList_i18n_8);
		$('<li><a href="#">' 
				+ jsBizMultLan.atsManager_atsResultUnCalList_i18n_1 
				+ '</a> <span class="divider">/</span></li>').insertBefore($("#breadcrumb").find("li.active"));
		$("#breadcrumb").find("li").eq(1).find('a').click(function(){
			var serviceUrl = "com.kingdee.eas.hr.ats.app.AttenceResultSum.list";
			if(shr.getUrlParams().currentCalUrl || shr.getUrlParams().currentCalUrl != ""){
				serviceUrl = shr.getUrlParams().currentCalUrl;
			}else {
				serviceUrl = shr.attenceCalCommon.getAtsCalServiceUrl();
			}
			window.parent.parent.location = shr.getContextPath() + "/dynamic.do?uipk="+serviceUrl+"&inFrame=true&serviceId="+encodeURIComponent(shr.getUrlRequestParam("serviceId"));
		}) ;
	},
	initSearchLabel: function(){
		//$('#grid-toolbar').children().eq(1).append('<div id="searcher" class="pull-right"/>');
		var searcherFields = [];
		searcherFields[0] = {columnName:"person.fName_l2",label:jsBizMultLan.atsManager_atsResultUnCalList_i18n_9};
		searcherFields[1] = {columnName:"person.fnumber",label:jsBizMultLan.atsManager_atsResultUnCalList_i18n_11};
		var options = {
				gridId: "reportGrid",
				uipk: "com.kingdee.eas.hr.ats.app.AttendanceResultUncalList",
				query: "" ,
				fields :searcherFields,
				propertiesUrl: shr.getContextPath()+'/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttendanceResultUncalList&method=getProperField'
		};
		$("#searcher").shrSearchBar(options);
	},
	initalizeQueryGrid: function() {
		var $search = $('#searcher');
		var filter = $search.shrSearchBar('option', 'filterView');
		if ($.isEmptyObject(filter)) {
			// 如果filter为空
			if (!$.isEmptyObject($search.shrSearchBar('option', 'defaultViewId'))) {
				// 加载默认过滤方案触发表格取数
				$search.shrSearchBar('chooseDefaultView');
			} else {
				$("#filter-search").trigger('click');
			}
		} else {
			// 如果filter为非空，则直接查询表格数据
			$("#filter-search").trigger('click');
		}
	},
	queryGrid: function(){
		var showMsg = true;
		if(this.isFirstLoad){
			showMsg = false;
		}
		this.isFirstLoad = false;
		var attencePolicyRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attencePolicy","errorMessage":jsBizMultLan.atsManager_atsResultUnCalList_i18n_6},showMsg);
		if(attencePolicyRequired){
			var dateRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attendancePeriod","errorMessage":jsBizMultLan.atsManager_atsResultUnCalList_i18n_7},showMsg);
			if(dateRequired){
				this.renderDataGrid();
			}
		}
		
	},
	renderDataGrid : function() {
		var self = this;
		var beginDate = self.getSumFilterParamValues("startDate");
		var endDate = self.getSumFilterParamValues("endDate");
		var attendPolicyId = shr.attenceCalCommon.getFilterParamValues("attencePolicy");
		var hrOrgUnitId = shr.attenceCalCommon.getFilterParamValues("hrOrg");
		var method="getGridColModel";
		self.remoteCall({
			method : method,
			param : {
				"beginDate" : beginDate,
				"endDate" : endDate, 
				"attendPolicyId":attendPolicyId,
				"hrOrgUnitId" : hrOrgUnitId
			},
			success : function(reponse) {
				self.doRenderDataGrid(reponse);
			}
		});
	},
	doRenderDataGrid : function(reponse) {
		
		$('#datagrid').empty();
		$('#datagrid').append('<div id="gridPager1"></div><table id="reportGrid"></table>'); // 表头是可变的，所以要动态生成节点
		
		var self = this;
		var table = $("#reportGrid");
		var fastFilterItems = self.getFastFilterItems();
		if( fastFilterItems == undefined){
			fastFilterItems = "" ;
		}
		else {
			//改变过滤条件考勤周期ID
			if(self.atsPeriodObj){
				fastFilterItems["dateSet.date"] = {dataType:"Date",values:{startDate:self.atsPeriodObj.startDate,endDate:self.atsPeriodObj.endDate}};
			}
		}
		if(fastFilterItems["add"] == ""){
			fastFilterItems["add"] = null;
		}
		//精确搜索
		var filterItems = self.getQuickFilterItems();
		var url = self.getGridDataRequestURL();
		var colNames = reponse.colNames;
		var colModel = reponse.colModel;
		var options = {
			url : url + '&serviceId='+ encodeURIComponent(shr.getUrlRequestParam("serviceId")),
			datatype : "json", 
			mtype:"POST",
			postData : {
				fastFilterItems : $.toJSON(fastFilterItems),
				filterItems: filterItems
			},
			multiselect : true,
			rownumbers : false,
			colNames : colNames,
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			pager : '#gridPager1',
			height : self.rowNumPerPage > 21 ? '590px' : 'auto',
			rowList : [15,30,50,100],
			recordpos : 'left',
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			pginput : true,
			shrinkToFit : reponse.colModel.length > 10 ? false : true,
			viewrecords : true
		};
		options.loadComplete = function(data) {
			self.handleMicroToolbarInfo(data);
		};
		table.html();
		$('#reportGrid').jqGrid(options);
		$(window).resize();
		$("#reportGrid").jqGrid(options);
		$('#reportGrid').jqGrid('setFrozenColumns');
		$("#datagrid").find(".frozen-bdiv").eq(0).css("height",$("#datagrid").find(".ui-jqgrid-bdiv").eq(0).height()-16)//不加这行固定列会超出div
	},
	getGridDataRequestURL : function() {
		return this.dynamicPage_url + "?method=getGridData" + "&uipk=com.kingdee.eas.hr.ats.app.AttendanceResultUncalList";
	},
	handleMicroToolbarInfo : function(data) {
		var self = this;
		var html = "";
		html += "<div class='shrPage page-Title' >";
		html += "<span id='gripage' class='ui-paging-info' style='cursor: default;display: inline-block;font-size: 13px;padding: 2px 5px 0 0;'></span>";
		html += "<span id='prevId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-prev'></span>";
		html += "<span id='nextId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-next'></span></div>";
		
		html += '<span id="rowNum" style="display:none"><select id="selectRowNum" class="ui-pg-selbox" style="float: right;position: inherit;" role="listbox">';
		html += '<option role="option" value="15">15</option>'; 
		html += '<option role="option" value="30" >30</option>';
		html += '<option role="option" value="50">50</option>';
		html += '<option role="option" value="100">100</option></select></span>';
		$('#microToolbar').html("");
		$('#microToolbar').append(html);
	    $("#selectRowNum").val(self.rowNumPerPage);
		$("#gripage").on("click", self.selectRowNumPerPage);
		$("#prevId").on("click", self.prePage);
		$("#nextId").on("click", self.nextPage);

		// 页码 (1-4)/4
		self.updatePageEnable(data);
		if(data && data.rows && data.rows.length > 0){
			var start = (data.page - 1) * self.rowNumPerPage + 1;
			$("#gripage").text("(" + start + "-" + (start + data.rows.length -1) + ")/" + data.records);
		}
		
		$("#gridPager1").hide();
	    $("#reportGrid").find("tr[class='ui-widget-content jqfoot ui-row-ltr']").find('td').css("border","0px");
	    $("#reportGrid").find("tr[class='ui-widget-content jqfoot ui-row-ltr']").css("border","0px");
	    $('tr[id^=reportGridghead]').removeClass('ui-widget-content jqgroup ui-row-ltr');
	    shr.setIframeHeight();
	},
	updatePageEnable : function(data) {
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		if (!data || !data.page || data.page == 1) {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}
        //上了1000的时候要把逗号替换掉，否则会出错。分页按钮置灰有问题。
		if (!data || !data.total || data.page == data.total) {
			$("#nextId").addClass("ui-state-disabled");
		} else {
			$("#nextId").removeClass("ui-state-disabled");
		}
	},

	getCurPage : function() {
		// (1-4)/4
		var self = this, rowNum = self.rowNumPerPage;
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		var curPageNum = (parseInt(temp.substring(1, temp.indexOf('-'))) - 1)/ rowNum + 1;
		return curPageNum;
	},

	prePage : function() {

		jQuery('#reportGrid').jqGrid("setGridParam", { postData: { refresh: "false",handler:""  } });
		$("#prev_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	},

	nextPage : function() {
		//refresh = false ;
		jQuery('#reportGrid').jqGrid("setGridParam", { postData: { refresh: "false",handler:"" } });
		$("#next_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	},
	
	selectRowNumPerPage:function(){
		$('#gripage').hide();
		$('#rowNum').show();
		$('#selectRowNum').show();
		var that = this;
		var currentViewPage = shr.getCurrentViewPage();
		$("#selectRowNum").change(function() {
			var reRows = parseInt($("#selectRowNum option:selected").text());
			currentViewPage.rowNumPerPage = reRows;
			currentViewPage.renderDataGrid();
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
	initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
		//明细计算
		$('#calAttendPersonList').click(function(){ 
			that.pageStep = 0;
			//定义标签样式
			that.changePageLabelColor();
			var serviceUrl = shr.attenceCalCommon.getAtsCalServiceUrl();
			if(serviceUrl && (serviceUrl == "com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList" || serviceUrl =="com.kingdee.eas.hr.ats.app.AttendanceResultUncalList")){
				that.reloadPage({
					uipk: serviceUrl
		    	});
			}else {
				that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResultUncalList'
		    	});	
			}	
		});
		
		//汇总计算
		$('#sumPersonList').click(function(){ 
			that.pageStep = 1;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResultSum.dynamicList'
		    });	
		});
		
		//已转薪资计算
		$('#salaryPersonList').click(function(){ 
			that.pageStep = 2;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResultSalary.dynamicList'
		    });	
		});
	},
	changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.pageStep).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.pageStep).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
	},
	processF7ChangeEvent : function(){ 
		var self = this;
		$.shrFastFilter.registerEventAfterF7ConfirmClick(self.F7ClickCallBack);
		$.shrFastFilter.registerEventAfterSpanClick(self.spanClickCallBack);
		
		var attencePolicyId = shr.attenceCalCommon.getFilterParamValues("attencePolicy");
		if(attencePolicyId && attencePolicyId != ''){
			$.shrFastFilter.setPromptGridUrl(['attendancePeriod'],{"attencePolicyId":encodeURIComponent(attencePolicyId)});
		}
		self.setAttendancePeriod(shr.attenceCalCommon.getFilterParamValues("attendancePeriod"));
	},
	
	//根据考勤制度获取考勤周期明细 
  	setAttendancePeriod:function(attendancePeriodId){
  		var self = this;
  		if( attendancePeriodId && attendancePeriodId != "")
  		{
  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryResultHelper&method=getAttendancePeriod&attendancePeriodId="+encodeURIComponent(attendancePeriodId);
			 shr.ajax({
					type:"post",
					async:false,  
					url:url, 
					success : function(res){
						if(res && res.length > 0){
							self.atsPeriodObj = res[0];
						}
	 				}
		 	});
  		}
  	},
    	//全部计算
    	allAttendCaculateAction: function(){
    		var _self = this;
    		var beginDate = _self.getSumFilterParamValues("startDate");
			var endDate = _self.getSumFilterParamValues("endDate");
			if(beginDate && endDate && beginDate != "" && endDate != "" ){
	    		shr.attenceCalCommon.showCalDialogAction(_self,_self.CalAllAction);
			}else {
//				shr.showWarning({message : "请选择过滤条件执行查询！"});
			 		return ;
			}
    	},
    	//计算全部
    	CalAllAction:function(){  
    		var self = this;
    		//快速过滤
    		var fastFilterItems = self.getFastFilterItems();
    		if( fastFilterItems == undefined)
    			fastFilterItems = "" ;
    		if(fastFilterItems["add"] == ""){
    			fastFilterItems["add"] = null;
    		}
    		//精确搜索
    		var filterItems = self.getQuickFilterItems();
    		if( filterItems == undefined)
    			filterItems = "" ;
    		
    		//弹出框参数，日期和是否重新取卡
    		var beginDate = self.getSumFilterParamValues("startDate");
			var endDate = self.getSumFilterParamValues("endDate");
    		if($("#realBeginDate").val()!=undefined && $("#realEndDate").val()!=undefined){//@
    			beginDate = atsMlUtile.getFieldOriginalValue("realBeginDate");
    			endDate = atsMlUtile.getFieldOriginalValue("realEndDate");
    		}
    		var cardLen = $('input[name="isAgainFetchCard"]:checked').length ;
    		var isCalUnOffWork = $('input[name="isCalUnOffWork"]:checked').length ;
    		
    		var url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper";
    		    url +="&uipk=com.kingdee.eas.hr.ats.app.AttendanceResultSum.dynamicList$fragment" ;
    		openLoader(1);
    		 shr.remoteCall({
    			type : "post",
    			url  : url,
    			method : "calAllAttendanceBoardUnCalDyna",
    			param : {
    				beginDate : beginDate,
    				endDate : endDate,
    				isAgainFetchCard : cardLen,
    				isCalUnOffWork: isCalUnOffWork
    			},
    			success : function(res){
    				closeLoader();
    				window.parent.$("#calendar_info").dialog('close');
    				if(res.flag == 1){
    					shr.showInfo({message: jsBizMultLan.atsManager_atsResultUnCalList_i18n_2}); 
    				}else if(res.flag == 2){
    					shr.showError({message: jsBizMultLan.atsManager_atsResultUnCalList_i18n_0});
    				}else{
    					shr.showError({message: jsBizMultLan.atsManager_atsResultUnCalList_i18n_4});
    				}
    			},
    			error : function() {
    					closeLoader();
    			},
    			complete : function() {
    				closeLoader();
    			}
     		})	
    	},
    	//计算选中行
    	selectAttendCaculateAction: function(){
    		var _self = this;
    		var $grid = $("#reportGrid");
    		var personIndex = 'personId' ;
    		var sid = $grid.jqGrid("getSelectedRows");
    		var len = sid.length ;
    		var filter=[];
    		var personStr = "";
    		var attendDateStr="";
    		if(len > 0){
    			var pidArray=new Array();
    			for ( var i in sid) {
    				var item = sid[i];
    				var data =  item;
    				if(data !=undefined ){
    					if(pidArray.indexOf(data)==-1){
    						if(personStr.length > 0)
    						{
    							personStr +=",";
    						}
    						personStr += data;	
    						pidArray.push(data);
    					}
    				}
    		  	}
    		  	if(personStr == "" || personStr == "false"){
    		  		shr.showWarning({message : jsBizMultLan.atsManager_atsResultUnCalList_i18n_5});
    		 		return ;
    		  	}
    		}else{
    			shr.showWarning({message : jsBizMultLan.atsManager_atsResultUnCalList_i18n_5});
    		 	return ;
    		}
    		if($.shrFastFilter.getFastFilterItems() == "") {
    		 	return;
    		}
    		shr.attenceCalCommon.showCalDialogAction(_self,_self.selectCalAction,[personStr,len]);
    	},
    	selectCalAction:function(personStr,len){ // 计算选中行
    		var self=this;
    		var beginDate = self.getSumFilterParamValues("startDate");
			var endDate = self.getSumFilterParamValues("endDate");
    		var hrOrgUnitId = shr.attenceCalCommon.getFilterParamValues("hrOrg");
    		if($("#realBeginDate").val()!=undefined && $("#realEndDate").val()!=undefined){//@
    			beginDate = atsMlUtile.getFieldOriginalValue("realBeginDate");
    			endDate = atsMlUtile.getFieldOriginalValue("realEndDate");
    		}
    		var isCalUnOffWork = $('input[name="isCalUnOffWork"]:checked').length ;
    		var url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&uipk=hr.ats.com.attendancePanelCalculate$fragment"+'&serviceId='+ encodeURIComponent(shr.getUrlRequestParam("serviceId"));
    		var cardLen = $('input[name="isAgainFetchCard"]:checked').length ;
    		if(len > 10 ){
    		   openLoader(1);
    		   shr.remoteCall({
    					type:"post",
    					url:url,
    					method:"calculateSelectOsfAttendanceBoard",
    					param : {
    						beginDate : beginDate,
    						endDate : endDate,
    						personId: personStr,
    						isAgainFetchCard : cardLen,
    						len : len,
    						isCalUnOffWork: isCalUnOffWork
    					},
    					success:function(res){
    						closeLoader();
    						if($("#reportGrid").html()){
    							window.parent.$("#calendar_info").dialog('close');
    						}
    						if(res.flag == 1){
    							shr.showInfo({message: jsBizMultLan.atsManager_atsResultUnCalList_i18n_10}); 
    						}else if(res.flag == 2){
    							shr.showError({message: jsBizMultLan.atsManager_atsResultUnCalList_i18n_0});
    						}else{
    							shr.showError({message: jsBizMultLan.atsManager_atsResultUnCalList_i18n_4});
    						}
    					},
    					error:function(){
    						closeLoader();
    						shr.showError({message: jsBizMultLan.atsManager_atsResultUnCalList_i18n_4});
    					},
    					complete:function(){
    						closeLoader();
    					}
    			});
    		}else{ 
    		   openLoader(1);  
    		   shr.remoteCall({
    					type:"post",
    					url:url,  
    					method:"calculateSelectAttendanceBoard",
    					param : {
    						beginDate : beginDate, 
    						endDate : endDate,
    						personId: personStr,
    						isAgainFetchCard : cardLen,
    						len : len,
    						isCalUnOffWork: isCalUnOffWork
    					},
    					success:function(res){
    							closeLoader();
    							if($("#reportGrid").html()){
    									window.parent.$("#calendar_info").dialog('close');
    							}
    							shr.showInfo({message : res.flag});
								jQuery('#reportGrid').jqGrid("reloadGrid");
								window.parent.$("#calendar_info").dialog('close');
    						},
    					error : function(){
    							closeLoader();
    							shr.showInfo({message : jsBizMultLan.atsManager_atsResultUnCalList_i18n_3});
    					},
    					complete:function(){
    						closeLoader();
    					}	
    					});
    		}
    	},
  	F7ClickCallBack: function(event,config,category,datas){
  		if(category.categoryValue == "attencePolicy"){
  			if(datas && datas.length>0){
  				//联动考勤周期
  				$.shrFastFilter.setPromptGridUrl(['attendancePeriod'],{"attencePolicyId":encodeURIComponent(datas[0].id)});
  				
  				//是否删除页面考勤周期
	  			if(thisObject.atsPeriodObj){
	  				var atsPeriodId = thisObject.atsPeriodObj.id;
		  			if(atsPeriodId && atsPeriodId !="" ){
			  			var flag = shr.attenceCalCommon.isContainsAtsPeriod(datas[0].id,atsPeriodId);
			  			if(!flag){
			  				atsPeriodId = atsPeriodId.replace("/","\\/");
			  				if($("#"+atsPeriodId) && $("#"+atsPeriodId+" :last-child")){
				  				$("#"+atsPeriodId+" :last-child").trigger('click');
			  				}
			  			}
		  			}
	  			}
  			}
  		}else if(category.categoryValue == "attendancePeriod"){
  			if(datas && datas.length>0){
  				var dateStartObj = $('#'+thisObject.dateSelectName.replace(".","--")+'-datestart');
				var dateEndObj = $('#'+thisObject.dateSelectName.replace(".","--")+'-dateend');
  				dateStartObj["shrDateTimePicker"]('setValue', datas[0].startDate);
				dateEndObj["shrDateTimePicker"]('setValue', datas[0].endDate);
				dateStartObj.trigger("change");
				thisObject.atsPeriodObj = datas[0];
  					
  			}
  		}
  			
  	},
  	 //获取快速过滤参数值
	getSumFilterParamValues: function(paramName){
		
		var self = this;
		if(paramName == "startDate" || paramName == "endDate"){
			var currentPeriodId = shr.attenceCalCommon.getFilterParamValues("attendancePeriod");
			if(self.atsPeriodObj && currentPeriodId != self.atsPeriodObj.id){
				self.setAttendancePeriod(currentPeriodId);
			}
			if(paramName == "startDate"){
				if(self.atsPeriodObj){
					var startDate = self.atsPeriodObj.startDate;
					if(!startDate){
						self.setAttendancePeriod(currentPeriodId);
					}
					return self.atsPeriodObj.startDate;
				}else {
					return "";
				}
			}else if(paramName == "endDate"){
				if(self.atsPeriodObj){
					var endDate = self.atsPeriodObj.endDate;
					if(!endDate){
						self.setAttendancePeriod(currentPeriodId);
					}
					return self.atsPeriodObj.endDate;
				}else {
					return "";
				}
			}
		}
		var paramValues = "";
		var fastFilterItems  = $.shrFastFilter.getFastFilterItems();
		if (fastFilterItems) {
			if(fastFilterItems[paramName]){
				paramValues = fastFilterItems[paramName]["values"];
			}
		}
		return paramValues;
	},
	//查看后台事务
	viewTransactionAction: function(){
		var serviceId = shr.getUrlRequestParam("serviceId");			
		var url =  shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.base.job.app.JobInst.list"+'&serviceId='+encodeURIComponent(serviceId);
		$("#dialogTransaction").children("iframe").attr('src', url);
		$("#dialogTransaction").dialog({
			width:1150,
	 		height:750,
			modal: true,
			resizable: false,
			draggable: true,
			position: {
				my: 'center',
				at: 'center',
				of: window
			}
		})
		$("#dialogTransaction").css({height:750})
	},
	spanClickCallBack: function(event,commonSpan, checkedAttrValue, isReverse){
  		if(commonSpan.dataset && commonSpan.dataset.name == "hrOrg"){
  			if(commonSpan.dataset.id  != ''){
  				//联动考勤周期
  				if(isReverse){
  					var index = thisObject.selectedHrOrgIds.indexOf(commonSpan.dataset.id); 
					if (index > -1) { 
						thisObject.selectedHrOrgIds.splice(index, 1); 
					}
  				}else {
  					thisObject.selectedHrOrgIds.push(commonSpan.dataset.id);
  				}
  				$.shrFastFilter.setPromptGridUrl(['attencePolicy'],{"params":encodeURIComponent(thisObject.selectedHrOrgIds)});
  			}
  		}
  	}
});
