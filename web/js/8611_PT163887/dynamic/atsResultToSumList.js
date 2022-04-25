var sidValue = [];
var step=1;
var addRowID=1;
var type=2;
// 只有在全部重算的时候，使用 组织ID 
var isConfirm = true;
var currentIsConfirm = true;
var attendanceGroupID="";
var indexMonth="";
var indexYear=""; 
var indexNextMonth="";
var selfNavi = "" ;  // 保存每次下一步进来的参数
var _events = []; 
var selectStates="";//已计算页面--明细显示所选的状态
var isCalShowDetail=false;//已计算页面--是否明细显示
var refresh = 1 ;  //是否刷新
var thisObject;
var attendNameOnSelect;//点击项目查看汇总时记录所选项目
var isDetailOnProject=false;//是否点击项目查看汇总标记
var isBackShow=false;//明细弹出框是否显示返回按钮
var ats_beginDate = "";
var ats_endDate = "";
var atsCalGobalParam = {};//用于未参与计算单据传参
var hideButtonId = [];
var currentCalUrl = "com.kingdee.eas.hr.ats.app.AttenceResultSum.list";//记录考勤计算当前访问的URL
shr.defineClass("shr.ats.atsResultToSumList", shr.framework.List, {
	pageStep: 0,
	showAttendJson : null ,
	isFirstLoad: true,
	attendMap : [] ,
	isReload : false ,
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
		
		shr.ats.atsResultToSumList.superClass.initalizeDOM.call(_self);
		
		_self.onNaviLoad();
		
		//初始化页面点击事件,查看后台事物,未参与计算单据
		shr.attenceCalCommon.initClickEvent(this.dateSelectName);
		//查看后台事务，未参与计算单据count
		
		var beginDate = _self.getSumFilterParamValues("startDate");
		var endDate = _self.getSumFilterParamValues("endDate");
		shr.attenceCalCommon.initWorkFlowBillsCheckedCount(beginDate,endDate);
		
		shr.attenceCalCommon.initviewTransaction(this.dateSelectName);
		
		shr.attenceCalCommon.initBreadCrumb();
		
//		_self.summaryorDetailHover();
		
		hideButtonId = this.initData.atsCalButton;
	},
	getPageState: function(){
		var _self = this;
		_self.fastFilterMap = null;
		return shr.ats.atsResultToSumList.superClass.getPageState.call(this);
	},
	reLoadPageState: function() {
		if (this.requireSavePageState) {
			var pageState = this.getSavedPageState();
			if (pageState && pageState.filter) {
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
	summaryorDetailHover: function(){
		$("#DisplayResult").hover(function(){}, function(){
			if(!$(this).is(':hidden')){
				$("#summary").text(jsBizMultLan.atsManager_atsResultToSumList_i18n_22 + "▼");
				$("#DisplayResult").fadeOut();
				$("#DisplayResult").empty();
			}
		} );
		$("#DisplayDetail").hover(function(){}, function(){
			if(!$(this).is(':hidden')){
				$("#detail").text(jsBizMultLan.atsManager_atsResultToSumList_i18n_31 + "▼");
				$("#DisplayDetail").fadeOut("normal",function(){
					$("#DisplayDetail").empty();
				});
				$(this).removeClass("scrollDiv");
				addRowID=1;
			}
		});
	},
	//明细显示或汇总显示
 	onNaviLoad : function() {
 		var that = this;
 		$('#switchDetail').parent().click(function(){ // 已计算人员(明细展示)
			if($("#switchDetail").html()==jsBizMultLan.atsManager_atsResultToSumList_i18n_21){
				that.pageStep = 0;
				that.changePageLabelColor();
				that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.AttenceResultSum.list'
			    });	
			}else {
				that.pageStep = 0;
				that.changePageLabelColor();
				that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList'
			    });
			}
		}) ;
 		$('#unCalList').parent().click(function(){
				that.pageStep = 0;
				that.changePageLabelColor();
				that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResultUncalList',
					currentCalUrl: currentCalUrl
			    });	
		}) ;
 		that.onclickAttendProject();  // 修改汇总显示和明细显示的顺序
 	},
	initSearchLabel: function(){
		//$('#grid-toolbar').children().eq(1).append('<div id="searcher" class="pull-right"/>');
		var searcherFields = [];
		searcherFields[0] = {columnName:"person.name",label:jsBizMultLan.atsManager_atsResultToSumList_i18n_52};
		searcherFields[1] = {columnName:"person.number",label:jsBizMultLan.atsManager_atsResultToSumList_i18n_54};
		var options = {
				gridId: "reportGrid",
				uipk: "com.kingdee.eas.hr.ats.app.AttendanceResultSumList",
				query: "" ,
				fields :searcherFields,
				propertiesUrl: shr.getContextPath()+'/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttendanceResultSumList&method=getProperField'
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
		var attencePolicyRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attencePolicy","errorMessage":jsBizMultLan.atsManager_atsResultToSumList_i18n_33},showMsg);
		if(attencePolicyRequired){
			var dateRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attendancePeriod","errorMessage":jsBizMultLan.atsManager_atsResultToSumList_i18n_34},showMsg);
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
		$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>'); // 表头是可变的，所以要动态生成节点
		
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
//			pager : '#gridPager1',
			height : self.rowNumPerPage > 21 ? '590px' : 'auto',
			rowList : [15,30,50,100],
			recordpos : 'left',
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			shrinkToFit : reponse.colModel.length > 10 ? false : true,
			viewrecords : true,
			customPager : '#gridPager1',  
			pagerpos:"center",
			pginputpos:"right",
			pginput:true, 
			synchTotal:"true",
			onCellSelect : function(rowid, index, contents, event) {
				var data = $("#reportGrid").jqGrid("getRowData", rowid);
				var personId = data['personId'];
				var adminOrgId = data['adminOrgUnitId'];
				var hrOrgUnitId = data["hrOrgUnitId"];
				// 点击名字是弹出这个时间段人的所有考勤情况,以日历的形式展示
				if(index == 0){
					return;
				}
				if (colModel[index-1].name == 'personName' || colModel[index-1].name=='personNumber') {
					isBackShow=true;
					var personName = data['personName'];
					shr.atsResultOneDayDetail.showCalendarDetailAction(personId,adminOrgId,personName,hrOrgUnitId);
				} else
				// 点击具体某个项目时，弹出这个项目的明细
				if (colModel[index-1].name.substring(0, 1) == "S") {
					if (contents == 0) {
						shr.showInfo({
									message : jsBizMultLan.atsManager_atsResultToSumList_i18n_18
								});
						return;
					}
					var attendName = colModel[index-1].name;
					var personName = data['personName'];
					attendNameOnSelect=attendName;
					isBackShow=true;
					shr.atsResultOneDayDetail.showDetailOnProject(attendName,personName,personId,adminOrgId,hrOrgUnitId);
					// 以20开头便是点击日期
				} else if (colModel[index-1].name.substring(0, 2) == "20") {
					var tDay = colModel[index-1].name;
					var personName = data['personName'];
					var personId = data['personId'];
					action="dayDetail";
					$("#calendar_info").empty();
					$("#calendar_info").next().remove();
					isBackShow=false;
					shr.atsResultOneDayDetail.showBillDetailAction(personName,tDay,personId,adminOrgId,hrOrgUnitId);
				}
				$(window).resize();
				//掩藏没有权限的按钮
				shr.atsResultOneDayDetail.hideNotAccessButton();
			},
			onSelectRow : function(id) {
				jQuery('#reportGrid').jqGrid('editRow', id, false, function() {});
				sidValue.push(id);
				lastsel2 = id;
				$("#reportGrid").attr("sid", sidValue.join(","));
			},

			editurl : this.dynamicPage_url + "?method=editRowData" + "&uipk=com.kingdee.eas.hr.ats.app.AttenceResultSum.list"

		};
		options.loadComplete = function(data) {
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
			
			$("#datagrid").find(".ui-jqgrid-bdiv").eq(0).css("height", self.rowNumPerPage > 19 ? '590px' : 'auto');
			self.gridId ='#reportGrid';
			shr.ats.atsResultToSumList.superClass.gridLoadComplete.call(self,data);
			setTimeout(function(){
				self.gridId = '#grid';
			},100);
		};
		table.html();
		$('#reportGrid').jqGrid(options);
		$(window).resize();
		$("#reportGrid").jqGrid(options);
		$('#reportGrid').jqGrid('setFrozenColumns');
	},
	getGridDataRequestURL : function() {
		return this.dynamicPage_url + "?method=getGridData" + "&uipk=com.kingdee.eas.hr.ats.app.AttenceResultSum.list";
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
		
//		self.updatePageEnable();
//		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
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
			var serviceUrl = "com.kingdee.eas.hr.ats.app.AttenceResultSum.list";
			if(currentCalUrl || currentCalUrl != ""){
				serviceUrl = currentCalUrl;
			}else {
				serviceUrl = shr.attenceCalCommon.getAtsCalServiceUrl();
			}
			if(serviceUrl && (serviceUrl == "com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList" || serviceUrl =="com.kingdee.eas.hr.ats.app.AttenceResultSum.list")){
				that.reloadPage({
					uipk: serviceUrl
		    	});
			}else {
				that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.AttenceResultSum.list'
		    	});	
			}	
		});
		
		//汇总计算
		$('#sumPersonList').click(function(){ 
			that.pageStep = 1;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResultSum.dynamicList',
				currentCalUrl: currentCalUrl
		    });	
		});
		
		//已转薪资计算
		$('#salaryPersonList').click(function(){ 
			that.pageStep = 2;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResultSalary.dynamicList',
				currentCalUrl: currentCalUrl
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
//							var dateStartObj = $('#'+self.dateSelectName.replace(".","--")+'-datestart');
//							var dateEndObj = $('#'+self.dateSelectName.replace(".","--")+'-dateend');
//			  				dateStartObj["shrDateTimePicker"]('setValue', self.atsPeriodObj.startDate);
//							dateEndObj["shrDateTimePicker"]('setValue', self.atsPeriodObj.endDate);
//							dateStartObj.trigger("change");
						}
	 				}
		 	});
  		}
  	},
  	
	//判断开始日期和结束日期是否在当前日期之内
	checkCurrentDateRange:function(beginDate,endDate){
		var sysDate = new Date();
		var year  = sysDate.getFullYear();
		var menth = sysDate.getMonth()+1;
		if(menth < 10){
		    menth = "0"+menth;
		}
		var day   = sysDate.getDate();
		if(day < 10){
		    day = "0"+day;
		}
		var strTime = year+"-"+menth+"-"+day; 
		var date = new Date(Date.parse(strTime.replace(/-/g,"/")));
		var curDate = date.getTime();
		var beginRealDate = new Date(Date.parse(beginDate.replace(/-/g,"/")));	
		var endRealDate   = new Date(Date.parse(endDate.replace(/-/g,"/")));
		if(beginRealDate.getTime()<=curDate && endRealDate.getTime()>=curDate){
			return true ;
		}else{
			return false;
		}
	},
	onclickAttendProject : function() {
		var self = this;
		$("#detail").click(function(event){ // 明细显示
				event.stopPropagation();//阻止事件向上冒泡
				if($('#DisplayResult').html()){
					$("#summary").text(jsBizMultLan.atsManager_atsResultToSumList_i18n_22 + "▼");
					$("#DisplayResult").fadeOut();
					$("#DisplayResult").empty();
					//return ;
				}
				if($('#DisplayDetail').html()){
					$("#detail").text(jsBizMultLan.atsManager_atsResultToSumList_i18n_31 + "▼");
					$("#DisplayDetail").fadeOut("normal",function(){
						$("#DisplayDetail").empty();
					});
					$('#DisplayDetail').removeClass("scrollDiv");
					addRowID=1;
					return;
				}
				$("#detail").text(jsBizMultLan.atsManager_atsResultToSumList_i18n_31 + "▲");
				$("#DisplayDetail").empty();
				addRowID=1;
				var row_work =''
							+ '<div>'
							+ '<span><button type="button" id="editSum" class="null shrbtn">' 
							+ jsBizMultLan.atsManager_atsResultToSumList_i18n_6 
							+ '</button></span>'
							+ '<span><button type="button" id="saveSum" class="shrbtn-primary shrbtn">' 
							+ jsBizMultLan.atsManager_atsResultToSumList_i18n_3 
							+ '</button></span>' 
							+ '<span><button type="button" id="cancelSum" class="shrbtn-primary shrbtn">' 
							+ jsBizMultLan.atsManager_atsResultToSumList_i18n_35 
							+ '</button></span>'
							+ '</div>'
							+ '<div style="padding-top:15px;margin-left: 30px;width:400px;" class="row-fluid row-block row_field">'
							+ '<div class="spanSelf" ><span class="cell-RlStdType">' 
							+ jsBizMultLan.atsManager_atsResultToSumList_i18n_48 
							+ '</span></div>'
  	 						+ '<div class="spanSelf" ><span class="cell-RlStdType">' 
  	 						+ jsBizMultLan.atsManager_atsResultToSumList_i18n_47 
  	 						+ '</span></div>'
							+ '</div>';  
				$("#DisplayDetail").append(row_work);
				$("#saveSum").hide();
				$("#cancelSum").hide(); 
				type=1;
				self.remoteCall({
					type : "post",
					method : "initShowDetail",   //初始化汇总项目菜单
					param : {type : type},
					success : function(res){
						var len=res.length;
						if(len>0){  
							for(var i=0;i<len;i++,addRowID++){
								var row_fields_work = '<div  class="row-fluid row-block row_field" style="margin-left:30px;width:400px;" id="'+ addRowID +'">'
		 							 	+'<div class="spanSelf">'+res[i].name+'</div>'
										+'<div class="spanSelf">'+res[i].Sequence+'</span></div>'
										$('#DisplayDetail').append(row_fields_work);
							}
							addRowID = addRowID-1;
						}else{
							$("#DisplayDetail").append("<div id='nonContent' style='margin-left: 30px;margin-bottom:10px;margin-top:10px;text-align:left' class='field_label'>" 
									+ jsBizMultLan.atsManager_atsResultToSumList_i18n_46 
									+ "</div>");
						}
						if($('#DisplayDetail').height()>600){
							$('#DisplayDetail').addClass("scrollDiv");
						}else{
							$('#DisplayDetail').removeClass("scrollDiv");
						}
					}
				});
				$("#DisplayDetail").fadeIn();	
				$('#editSum').click(function(){ 
					$("#nonContent").remove();
					var index=0;
					if($("#DisplayDetail div[class='row-fluid row-block row_field']").length>1){  //大于1则当前登录人以前设置过项目展示顺序
						$("#DisplayDetail div[class='row-fluid row-block row_field']").each(function(){
							if(index>0)
							{
								var $name = $(this).find("div[class='spanSelf']").eq(0) ;
								var $sequence = $(this).find("div[class='spanSelf']").eq(1);
								$name.wrapInner("<input type='text' name='attendName' value="+$name.text()+" class='input-height cell-input'  validate='{required:true}' />");
								if(index==1){
									$sequence.wrapInner('<input type="text" name="showSequence"  value='+$sequence.text()+'  style=" width: 10%; " class="input-height cell-input" validate="{required:true}"/>');	
									$sequence.append('<span style="width:10px;margin-left:20px"><a class="rowAdd cursor-pointer">+</a><a class="rowDel cursor-pointer">x</a></span>');
								}else{
									$sequence.wrapInner('<input type="text" name="showSequence"  value='+$sequence.text()+'  style=" width: 10%; " class="input-height cell-input" validate="{required:true}"/>');	
									$sequence.append('<span style="width:10px;margin-left:20px"><a class="rowAdd cursor-pointer">+</a><a class="rowDel cursor-pointer">x</a></span>');	
								}
							}; 
							index++; 
						})
					}else{
						self.addRowFieldString($("#DisplayDetail"));
					}
					$("#saveSum").show();
					$("#cancelSum").hide();
					$('#editSum').hide(); 
					self.initAction($("#DisplayDetail"));
				});
				$('#saveSum').click(function(){
						var json=[];
							type=1;
						var flag=true;
						var  i=0;
						$("#DisplayDetail div[class='row-fluid row-block row_field']").each(function(){
							var name=$(this).find('input[name^=attendName]').val();
							var sequence=$(this).find('input[name^=showSequence]').val();
							
							if(name != undefined && sequence!= undefined)
							{	
								if(name== "" || sequence =="" ){ 
										shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_27});
			     	  	 					flag=false ;
			     	  	 					return ;
								}
								if(name.indexOf(jsBizMultLan.atsManager_atsResultToSumList_i18n_43)!=-1){
										shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_26});
			     	  	 					flag=false ;
			     	  	 					return ;
								}
								 for(var k=0;k<i;k++)
			     				{   
			     	  				json = eval(json)  ;
			     	  				if(name==json[k].name )
			     	  				{
			     	  	 				shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsResultToSumList_i18n_14, [(k+1), (i+1)])});
			     	  	 				flag=false ;
			     	  	 				return ;
			     	  				} 
			     	  				if(sequence==json[k].sequence){
			     	  					shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsResultToSumList_i18n_15, [(k+1), (i+1)])});
			     	  					flag=false ;
			     	  	 				return ; 
			     	  				}
			     				}
								json.push({'name':name,'sequence':sequence});
								i++;
							}
						})
						if(flag){
							if(json.length>=0){
							var postData = $.toJSON(json);
							self.remoteCall({
								type : "post",
								method : "saveShowAttendanceSequence",   //保存展示项目的顺序
								param : {postData : postData,type:type},
								success : function(res){
									shr.showInfo({
											message : jsBizMultLan.atsManager_atsResultToSumList_i18n_4,
											hideAfter : 3
											});
									var index = 0;
									$("#DisplayDetail div[class='row-fluid row-block row_field']").each(function(){
										if(index>0)
										{
											var $name = $(this).find("div[class='spanSelf']").eq(0) ;
											var nameVal = $name.find('input').val();
											var $sequence = $(this).find("div[class='spanSelf']").eq(1);
											var sequenVal = $sequence.find('input').val();
											$name.empty();
											$name.text(nameVal);
											$sequence.empty();
											$sequence.text(sequenVal); 
										}; 
											index++; 
									})
									$("#saveSum").hide();
									$("#cancelSum").hide(); 
									$('#editSum').show(); 
								}
							})
						}
					}							
				});
		}) 
		$("#summary").click(function(event){ // 汇总显示
			    event.stopPropagation();//阻止事件向上冒泡
				if($('#DisplayDetail').html()){
					$("#detail").text(jsBizMultLan.atsManager_atsResultToSumList_i18n_31 + "▼");
					$("#DisplayDetail").fadeOut();
					$("#DisplayDetail").empty();
					//return ;
				}
				if($('#DisplayResult').html()){
					$("#summary").text(jsBizMultLan.atsManager_atsResultToSumList_i18n_22 + "▼");
					$("#DisplayResult").fadeOut("normal",function(){
						$("#DisplayResult").empty();
					});
					$('#DisplayResult').removeClass("scrollDiv");
					addRowID=1;
					return ;
				}
				$("#summary").text(jsBizMultLan.atsManager_atsResultToSumList_i18n_22 + "▲");
				$("#DisplayResult").empty();
				addRowID=1;
				var row_work =''
							+ '<div>'
							+ '<span><button type="button" id="editSum" class="null shrbtn">' 
							+ jsBizMultLan.atsManager_atsResultToSumList_i18n_6 
							+ '</button></span>'
							+ '<span><button type="button" id="saveSum" class="shrbtn-primary shrbtn">' 
							+ jsBizMultLan.atsManager_atsResultToSumList_i18n_3 
							+ '</button></span>' 
							+ '<span><button type="button" id="cancelSum" class="shrbtn-primary shrbtn">' 
							+ jsBizMultLan.atsManager_atsResultToSumList_i18n_35 
							+ '</button></span>'
							+ '</div>'
							+ '<div style="padding-top:15px;margin-left: 30px;width:400px;" class="row-fluid row-block row_field">'
							+ '<div class="spanSelf" ><span class="cell-RlStdType">' 
							+ jsBizMultLan.atsManager_atsResultToSumList_i18n_48 
							+ '</span></div>'
  	 						+ '<div class="spanSelf" ><span class="cell-RlStdType">' 
  	 						+ jsBizMultLan.atsManager_atsResultToSumList_i18n_47 
  	 						+ '</span></div>'
							+ '</div>';  
				$("#DisplayResult").append(row_work);
				$("#DisplayResult").css("left","62.5px");
				$("#DisplayDetail").css("left","62.5px");
				$("#saveSum").hide(); 
				$("#cancelSum").hide(); 
					type=2;
				self.remoteCall({
					type : "post",
					method : "initShowDetail",   //初始化汇总项目菜单
					param : {type : type},
					success : function(res){
						var len=res.length;
						if(len>0){  
							for(var i=0;i<len;i++,addRowID++){
								var row_fields_work = '<div  class="row-fluid row-block row_field" style="margin-left:30px;width:400px;" id="'+ addRowID +'">'
		 							 	+'<div class="spanSelf">'+res[i].name+'</div>'
										+'<div class="spanSelf">'+res[i].Sequence+'</span></div>'
										$('#DisplayResult').append(row_fields_work);
							}
							addRowID = addRowID-1;
						}else{
							$("#DisplayResult").append("<div id='nonContent' style='margin-left: 30px;margin-bottom:10px;margin-top:10px;text-align:left' class='field_label'>" 
									+ jsBizMultLan.atsManager_atsResultToSumList_i18n_45 
									+ "</div>");
						}
						if($('#DisplayResult').height()>600){
							$('#DisplayResult').addClass("scrollDiv");
						}else{
							$('#DisplayResult').removeClass("scrollDiv");
						}
					}
				});
				$("#DisplayResult").fadeIn();
				$('#editSum').click(function(){ 
					$("#nonContent").remove();
					var index=0;
					if($("#DisplayResult div[class='row-fluid row-block row_field']").length>1){  //大于1则当前登录人以前设置过项目展示顺序
						$("#DisplayResult div[class='row-fluid row-block row_field']").each(function(){
							if(index>0)
							{
								var $name = $(this).find("div[class='spanSelf']").eq(0) ;
								var $sequence = $(this).find("div[class='spanSelf']").eq(1);
								$name.wrapInner("<input type='text' name='attendName' value="+$name.text()+" class='input-height cell-input'  validate='{required:true}' />");
								if(index==1){
									$sequence.wrapInner('<input type="text" name="showSequence"  value='+$sequence.text()+'  style=" width: 10%; " class="input-height cell-input" validate="{required:true}"/>');	
									$sequence.append('<span style="width:10px;margin-left:20px"><a class="rowAdd cursor-pointer">+</a><a class="rowDel cursor-pointer">x</a></span>');
								}else{
									$sequence.wrapInner('<input type="text" name="showSequence"  value='+$sequence.text()+'  style=" width: 10%; " class="input-height cell-input" validate="{required:true}"/>');	
									$sequence.append('<span style="width:10px;margin-left:20px"><a class="rowAdd cursor-pointer">+</a><a class="rowDel cursor-pointer">x</a></span>');	
								}
							}; 
							index++; 
						}) 
					}else{
						self.addRowFieldString($("#DisplayResult"));
					}
					$("#saveSum").show();
					$("#cancelSum").hide(); 
					$('#editSum').hide(); 
					self.initAction($("#DisplayResult"));
				});
				$('#saveSum').click(function(){
						var json=[];
							type=2;
						var flag=true;
						var  i=0;
						$("#DisplayResult div[class='row-fluid row-block row_field']").each(function(){
							var name=$(this).find('input[name^=attendName]').val();
							var sequence=$(this).find('input[name^=showSequence]').val();
							if(name== "" || sequence =="" ){ 
										shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_27});
			     	  	 					flag=false ;
			     	  	 					return ;
							}
							
							if(name != undefined && sequence!= undefined)
							{	
								if(name.indexOf(jsBizMultLan.atsManager_atsResultToSumList_i18n_43)!=-1){
										shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_26});
			     	  	 					flag=false ;
			     	  	 					return ;
								
								}
								 for(var k=0;k<i;k++)
			     				{   		 
			     	  				json = eval(json)  ;
			     	  				if(name==json[k].name )
			     	  				{
			     	  	 				shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsResultToSumList_i18n_14, [(k+1), (i+1)])});
			     	  	 				flag=false ;
			     	  	 				return ;
			     	  				} 
			     	  				if(sequence==json[k].sequence){
			     	  					shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_atsResultToSumList_i18n_15, [(k+1), (i+1)])});
			     	  					flag=false ;
			     	  	 				return ; 
			     	  				}
			     				}
								json.push({'name':name,'sequence':sequence});
								i++;
							}
						})
						if(flag){
							if(json.length>=0){
							var postData = $.toJSON(json); 
							self.remoteCall({
								type : "post",
								method : "saveShowAttendanceSequence",   //保存展示项目的顺序
								param : {postData : postData,type:type},
								success : function(res){
										shr.showInfo({
											message : jsBizMultLan.atsManager_atsResultToSumList_i18n_4,
											hideAfter : 3
										});
									var index=0;
									$("#DisplayResult div[class='row-fluid row-block row_field']").each(function(){
										if(index>0)
										{
											var $name = $(this).find("div[class='spanSelf']").eq(0) ;
											var nameVal=$name.find('input').val();
											var $sequence = $(this).find("div[class='spanSelf']").eq(1);
											var sequenVal=$sequence.find('input').val();
											$name.empty();
											$name.text(nameVal);
											$sequence.empty();
											$sequence.text(sequenVal); 
										}; 
											index++; 
									})
									$("#saveSum").hide();
									$("#cancelSum").hide(); 
									$('#editSum').show(); 
								} ,
								error : function(){
										shr.showInfo({
											message : jsBizMultLan.atsManager_atsResultToSumList_i18n_5,
											hideAfter : 3
										});
									}
							})
						}
					}							
				});
		}) 
		$("#unfold").click(function(){
			this.queryAction();
		});
		$('#confirmQuery').click(function() {
			$("#queryDiv").animate({height:"0px"},500,function(){
			});
			self.getJqgridData();
		});
		$('#packUp').click(function() {
			$("#sidebar").animate({"width":parseFloat($("#home-wrap").css("margin-left"))+40+"px"});
			$("#queryDiv").animate({height:"0px"},500,function(){
				$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
			});
			$("#unfold").html("▼");	
		});
	},
	addRowFieldString :function($name){
    	var row_fields_work = '<div  class="row-fluid row-block row_field" style="margin-left:30px;width:400px;" id="'+ addRowID +'">'
    		  				+ '<div class="spanSelf"><input type="text" name="attendName" value="' 
    		  				+ jsBizMultLan.atsManager_atsResultToSumList_i18n_44 
    		  				+ '"'
    		  				+ ' class="input-height cell-input" style="color:#cccccc" validate="{required:true}" /></div>'
		if(addRowID==1){
					row_fields_work	+= '<div class="spanSelf">'
								+ '<input type="text" name="showSequence"  value="'+addRowID+'"  style=" width: 10%; " class="input-height cell-input" validate="{required:true}"/>' 
								+ '<span style="width:10px;margin-left:20px"><a class="rowAdd cursor-pointer">+</a></span></div>'
		 }else{
				row_fields_work	+= '<div class="spanSelf"><input type="text" name="showSequence"  value="'+addRowID+'" ' 
								 + 'style=" width: 10%; " class="input-height cell-input" validate="{required:true}"/>' 
								 + '<span style="width:10px;margin-left:20px"><a class="rowAdd cursor-pointer">+</a>'
								 + '<a class="rowDel cursor-pointer">x</a></span></div>'
		}	 
		 $name.append(row_fields_work);
	}
	,initAction :function($name){    	 
        	var self=this ;
		 	 $('a.rowAdd').die().live('click',function(){
		 	 	 var curVal = $(this).parent().prev().val();
		      	 var lastVal= $("div.row_field input[name=showSequence]").last().val();
		       	if(curVal == lastVal){addRowID = parseInt(curVal);};
			  	    addRowID=addRowID+1;
			  	    $name.removeClass("scrollDiv");
				    self.addRowFieldString($name);
				    if($name.height()>600){
				    	$name.addClass("scrollDiv");
				    }
				    event.stopPropagation();
				    return false;
		 	 });  
	   		 $("input[name='attendName']").live('focus',function(){
	   		 		if($(this).val()==jsBizMultLan.atsManager_atsResultToSumList_i18n_44 ) // 鼠标移至输入框，则清空输入框且改变背景色
	   		 		{
	   		 			$(this).val("") ;
	   		 			$(this).css('color','#555555');
	   		 		}
	   		 });
	   		  $("input[name='attendName']").live('blur',function(){
				var pass = $(this).val();
				if(pass ==""){
					$(this).val(jsBizMultLan.atsManager_atsResultToSumList_i18n_44);
					$(this).css('color','#cccccc') ;
				}
	   		 });	
	   		 
    			//删除
		    $('a.rowDel').die().live('click',function($name){
		      var curVal = $(this).parent().prev().val();
		      var lastVal= $("div.row_field input[name=showSequence]").last().val();
		      $result=$(this).parent().parent().parent().parent();
		      $result.removeClass("scrollDiv");
		      $(this).parent().parent().parent().remove();	
		      if(curVal == lastVal){addRowID = parseInt(curVal)-1 ;};
		      if($result.height()>600){
		    	  $result.addClass("scrollDiv");
			   }
	           //$("div.row_field").last().remove();
		      $("div.row_field").last().find();
	   	    	event.stopPropagation();
	   	    	return false;
	   		});
	   		$('input[name^="attendName"]').live('click',function(){
						var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelCalHandler&method=getPersonNameByCondition";
						var paramDatas =[];
						var paramData = {type : type};
							paramDatas.push(paramData);
							$.autoComplete.getData($(this),shr.toJSON(paramDatas),url);
							$(".selectPage").one("click",function (event){ 
								event.stopPropagation();//阻止事件向上冒泡
							});
			});
    	},
    	//全部计算
    	allAttendCaculateAction: function(){
    		var _self = this;
    		var beginDate = _self.getSumFilterParamValues("startDate");
			var endDate = _self.getSumFilterParamValues("endDate");
			if(beginDate && endDate && beginDate != "" && endDate != ""){
	    		shr.attenceCalCommon.showCalDialogAction(_self,_self.CalAllAction);
			}else {
//				shr.showWarning({message : "请选择过滤条件执行查询！"});
			 		return ;
			}
    	},
    	//汇总模式全部计算
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
    			method : "calAllAttendanceBoardSumDyna",
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
    					shr.showInfo({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_23}); 
    				}else if(res.flag == 2){
    					shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_10});
    				}else{
    					shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_25});
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
    				var data =  $grid.jqGrid("getCell", item,personIndex);
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
    		  		shr.showWarning({message : jsBizMultLan.atsManager_atsResultToSumList_i18n_30});
    		 		return ;
    		  	}
    		}else{
    			shr.showWarning({message : jsBizMultLan.atsManager_atsResultToSumList_i18n_30});
    		 	return ;
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
    		var url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&uipk=hr.ats.com.attendancePanelCalculate$fragment";
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
    							shr.showInfo({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_53}); 
    						}else if(res.flag == 2){
    							shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_10});
    						}else{
    							shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_25});
    						}
    					},
    					error:function(){
    						closeLoader();
    						shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_25});
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
    							if(res.flag == 2){
									shr.showInfo({message : res.errorMsg,hideAfter:10});
								}else{
									shr.showInfo({message : res.errorMsg});
								}
								jQuery('#reportGrid').jqGrid("reloadGrid");
								window.parent.$("#calendar_info").dialog('close');
    						},
    					error : function(){
    							closeLoader();
    							shr.showInfo({message : jsBizMultLan.atsManager_atsResultToSumList_i18n_24});
    					},
    					complete:function(){
    						closeLoader();
    					}	
    					});
    		}
    	},
    	//汇总
    	sumResultAction: function(){
    		var _self = this;
			var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
			if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_atsResultToSumList_i18n_12}); return ;}
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			if(sid.length==0){
				var mes= jsBizMultLan.atsManager_atsResultToSumList_i18n_41;
				shr.showConfirm(mes,
					function(){
						_self.saveDataSalary(2);
					}
				);
			}else {
				_self.saveDataSalary(2);
			}
			
			//删除一些无用的汇总数据
			var attendPeriodId = _self.getSumFilterParamValues("attendancePeriod");
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=deleteOutDatedResSum"
			shr.ajax({
				type:"post",
				url:url,
				data:{
					attendPeriodId : attendPeriodId
				},
				success:function(res){}
			});
		},
		//汇总直接转薪资
		tranSalaryAction: function(){
			var _self = this;
			var beginDate = _self.getSumFilterParamValues("startDate");
			var endDate = _self.getSumFilterParamValues("endDate");
			var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
			if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_atsResultToSumList_i18n_13}); return ;};
			$("#calendar_info").empty();
			$("#calendar_info").next().remove();
			$("#calendar_info").dialog({
				title: jsBizMultLan.atsManager_atsResultToSumList_i18n_56,
				width:650,
				height:350,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+50%',
					of: window
				},
				buttons: [{
					text: jsBizMultLan.atsManager_atsResultToSumList_i18n_36,
					click: function() {
						_self.saveDataSalary(1); 
					}
				},{
					text: jsBizMultLan.atsManager_atsResultToSumList_i18n_20,
					click: function() {
						$(this).dialog( "close" );
					}
				}]
			});
			  var row_fields_work =''
			  +'<div class="photoState" style="margin-top:50px;margin-left:30px;"><table width="100%"><tr>'
			  +'<td width="30%" style="color: #999999;">' 
			  + jsBizMultLan.atsManager_atsResultToSumList_i18n_28 
			  + '</td>'
			  +'<td width="50%"><div id="setSalaryPeriod"></div></td>'
			  +'<td></td>'
			  +'</tr></table></div><br>'
			  +'<div><span></span></div>';	
			  $("#calendar_info").append(row_fields_work);
			  $("#calendar_info").css("margin","0px");
			  var selectPeriod=_self.atsPeriodObj.name+" ("+_self.atsPeriodObj.startDate+"~"+_self.atsPeriodObj.endDate+")";
			  $('#setSalaryPeriod').text(selectPeriod);
			var salary_json = {
				id: "type",  
				readonly: "",
				value: "0",
				onChange: null,
				validate: "{required:true}",
				filter: ""
			};
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
			var cur  = new Date() ;
			var year = cur.getFullYear() ;
			for(var i=year-5;i<year+5;i++)
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
            	  + jsBizMultLan.atsManager_atsResultToSumList_i18n_51 
            	  + '</td>'
			  	  +'<td width="15.2%"></td>'
			      +'<td width="10%" ><input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></td>'
				  +'<td width="5.2%" style="color: #999999;text-align: center;">' 
				  + jsBizMultLan.atsManager_atsResultToSumList_i18n_32 
				  + '</td>'
				  +'<td width="8%" style="color: #999999;"><input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
				  +'<td width="5.2%" style="color: #999999;text-align: center;">' 
				  + jsBizMultLan.atsManager_atsResultToSumList_i18n_55 
				  + '</td>'
				  +'<td width="8%"><input type="text" name="time" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
				  +'<td width="5%" style="color: #999999;text-align: center;">' 
				  + jsBizMultLan.atsManager_atsResultToSumList_i18n_8 
				  + '</td>'
				  +'<td></td></tr></table></div>';					  
			$('#calendar_info').append(row_fields_work);
			$('input[name=YEAR]').shrSelect(year_json);	
			$('input[name=MONTH]').shrSelect(Month_json);	
			$('input[name=time]').shrSelect(time_json);	
			
			var periodYM = _self.atsPeriodObj.name;
			$('input[name=YEAR]').val(periodYM.substring(0,4));
			$('input[name=MONTH]').val((periodYM.substring(4,6)) > 9 ? periodYM.substring(4,6) : periodYM.substring(5,6));
		
//			var curDate = new Date();
//            var curDateY = curDate.getFullYear();
//			var curDateM = curDate.getMonth()+1;
//			$('input[name=YEAR]').val(curDateY);
//			$('input[name=MONTH]').val(curDateM);
			$('input[name=time]').val(1);
			$('.overflow-select').css("max-height","150px").css("overflow-y","auto");

		},
		//汇总直接转薪资
		saveDataSalary: function(salaryStatus){
	  		var _self = this;
	  		var beginDate = _self.getSumFilterParamValues("startDate");
			var endDate = _self.getSumFilterParamValues("endDate");
			var attendancePeriod = shr.attenceCalCommon.getFilterParamValues("attendancePeriod");
			if(attendancePeriod == ""){
				shr.showInfo({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_29}); 
				return false;	
			}
			var  salaryPeriod='';
			if(salaryStatus==1){
				var periodYear = $('input[name=YEAR]').val();
				var periodMonth = $('input[name=MONTH]').val();
				var times = $('input[name=time]').val();
				if (periodYear == "") {
					shr.showInfo({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_49}); 
					return false;
				}
				if (periodMonth == "") {
					shr.showInfo({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_50}); 
					return false;
				}
				if (times == "") {
					shr.showInfo({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_9}); 
					return false;
				}
				salaryPeriod=periodYear+"-"+periodMonth+"-"+times;
			}		
			var sid=[];
			var Exchange_json=[];
			sid = $("#reportGrid").jqGrid("getSelectedRows");
			for ( var i in sid)
			{
				var item = sid[i];
				var data = $("#reportGrid").jqGrid("getRowData", item);
				var personId=data["personId"] ;
				if(personId !=undefined){
					var adminOrgUnit=data["adminOrgUnitId"] ;
					Exchange_json.push({'hrOrgUnitId':data["hrOrgUnitId"],'personId':personId,'adminOrgUnit':adminOrgUnit});
				}
			}	
			if(Exchange_json.length>0)
			{
				var PersonJson = $.toJSON(Exchange_json) ;
			}else{
				var PersonJson = "All";
			}
			 openLoader(1);
			 var serviceId = encodeURIComponent(shr.getUrlRequestParam("serviceId"));
			 var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttenceResultSum.list$fragment&serviceId="+serviceId;
			 var methodName=null;
			 if(salaryStatus==1){
				 methodName="tranSalary";
			 }
			 else{
				 methodName="saveSumResult";
			 }
			 
			var fastFilterItems = _self.getFastFilterItems();
			if( fastFilterItems == undefined){
				fastFilterItems = "" ;
			}
			else {
//				//改变过滤条件考勤周期ID
//				fastFilterItems.attendancePeriod = {dataType:"String",values: this.attendPeriodId};
				fastFilterItems["dateSet.date"] = {dataType:"Date",values:{startDate:this.atsPeriodObj.startDate,endDate:this.atsPeriodObj.endDate}};
			}
			
			if(fastFilterItems["add"] == ""){
				fastFilterItems["add"] = null;
			}
			//精确搜索
			var filterItems = _self.getQuickFilterItems();
			
			 shr.remoteCall({
					type:"post", 
					url:url, 
					method:methodName,
					param : {
								PersonJson : PersonJson,
								salaryPeriod:salaryPeriod,      //薪资周期
								filterItems :filterItems,
			    				fastFilterItems : $.toJSON(fastFilterItems)
							},
					success : function(response) {
						if (response) {
							if(methodName=="tranSalary"){
								$("#calendar_info").dialog( "close" );
							}
							
							var batchTipsData = _self.batchTipsDataHandler(response, data);
		
							$(_self).shrMessageTips({
								isSuccess: batchTipsData.isSuccess,
								successCount: batchTipsData.successCount,
								failureCount: batchTipsData.failureCount,
								confirmCallback: function () {	
									$(_self).shrDetailTips({
										tableData: batchTipsData.tmp,
										successCount: batchTipsData.successCount,
		            					failureCount: batchTipsData.failureCount,
										colNamesData: batchTipsData.tableModel,
										isSortable : _self.batchHandlerWhetherSortable(),
										modalWidth: ''
									}).shrDetailTips("open");					
								},
		
								closeCallback: function () {
									_self.reloadGrid();
								}
							}).shrMessageTips("open");				
						} else {
//							$(_self).shrMessageTips("_setDetailDisable");
						}	
					},
					error: function(response) {
						closeLoader();
					},
					complete : function() {
						closeLoader();
					}
			 });	
	  	},
	  	
	  	getBatchTipsTableModel:function(){
			var tableModel = $("#reportGrid").jqGrid("getGridConfig").colModel;
			return tableModel;
		},
		
		/**
		 * 批量反馈，处理请求返回数据
		 */
		batchTipsDataHandler: function (data, options) {
			var _self = this;
			var successCount = data.successCount; 
			var failureCount = data.failureCount;
			var isSuccess = !data.failureCount ? true : false;
			var result = data.result;
	
			for(var i = 0, l = result.length;i < l;i++){
				if(result[i].muitTipsState ) {
					result[i].muitTipsState  = jsBizMultLan.atsManager_atsResultToSumList_i18n_7;
				}else {
					
					result[i].muitTipsState  = jsBizMultLan.atsManager_atsResultToSumList_i18n_39;
				}
			}
	
			var batchData = {
				"successCount": successCount,
				"failureCount": failureCount,
				"isSuccess": isSuccess,
				"tmp": result,
				"tableModel":_self.getBatchTipsTableModel()
			};
	
			return batchData;
		},
	  //审核
	  	auditAction: function(){
	  		var self = this;
	  		var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
			if(contentLen == 0){
				shr.showInfo({message : jsBizMultLan.atsManager_atsResultToSumList_i18n_11+mess}); 
				return ;
			};
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			if(sid.length==0){
				var mes= self.isConfirm ? jsBizMultLan.atsManager_atsResultToSumList_i18n_19 : 
					jsBizMultLan.atsManager_atsResultToSumList_i18n_42;
				shr.showConfirm(mes,
					function(){
						self.auditAttendance("audit");
					}
				);
			}else {
				self.auditAttendance("audit");
			}
	  	},
	  	//反审核
	  	auditBackAction: function(){
	  		var self = this;
	  		var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
			if(contentLen == 0){
				shr.showInfo({message : jsBizMultLan.atsManager_atsResultToSumList_i18n_11+mess}); 
				return ;
			};
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			if(sid.length==0){
				var mes= jsBizMultLan.atsManager_atsResultToSumList_i18n_40;
				shr.showConfirm(mes,
					function(){
						self.auditAttendance("auditBack");
					}
				);
			}else {
				self.auditAttendance("auditBack");
			}
	  	},
		//审核
		auditAttendance: function(methodName){ 
			var _self = this;
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			var filter='';//选中行人+组织
			if(sid.length>0){
				filter = [];
				for (var i in sid) {
					var item = sid[i];
					var data = $("#reportGrid").jqGrid("getRowData", item);
					if(data['personId']!=undefined ){
						filter.push({'hrOrgUnitId':data["hrOrgUnitId"],"personId":data['personId'],"adminOrgUnitId":data['adminOrgUnitId']});
					}
			  	}
			}
			var beginDate = _self.getSumFilterParamValues("startDate");
			var endDate = _self.getSumFilterParamValues("endDate");
			openLoader(1);
			_self.remoteCall({
				type : "post",
				method : methodName ? methodName : "audit",
				param : {
					beginDate : beginDate,
					endDate : endDate,
					postData: $.toJSON(filter)
				},
				success : function(res){
					closeLoader();
					if(res.flag=="1")
					{
						if(methodName == "audit"){
							shr.showInfo({message : shr.formatMsg(jsBizMultLan.atsManager_atsResultToSumList_i18n_37, [res.successCount])});
						}else {
							shr.showInfo({message : shr.formatMsg(jsBizMultLan.atsManager_atsResultToSumList_i18n_16, [res.successCount])});
						}
						jQuery("#reportGrid").jqGrid("reloadGrid");
					}else{
						if(methodName == "audit"){
							shr.showInfo({message : jsBizMultLan.atsManager_atsResultToSumList_i18n_38});
						}else {
							shr.showInfo({message : jsBizMultLan.atsManager_atsResultToSumList_i18n_17});
						}
					}
				},
				error: function(){
					closeLoader();
				},
				complete:function(){
					closeLoader();
				}
		 	});
		},
  	F7ClickCallBack: function(event,config,category,datas){
  		if(category.categoryValue == "attencePolicy"){
  			if(datas && datas.length>0){
  				//联动考勤周期
  				$.shrFastFilter.setPromptGridUrl(['attendancePeriod'],{"attencePolicyId":encodeURIComponent(datas[0].id)});
  				
  				var atsPerioId = shr.attenceCalCommon.getFilterParamValues("attendancePeriod");
				if(thisObject && thisObject.atsPeriodObj && thisObject.atsPeriodObj.id){
					atsPerioId = thisObject.atsPeriodObj.id;
					if(document.getElementById(atsPerioId) && document.getElementById(atsPerioId).lastChild){
						$(document.getElementById(atsPerioId).lastChild).trigger('click');
					}
				}else if(atsPerioId){
					if(document.getElementById(atsPerioId) && document.getElementById(atsPerioId).lastChild){
						$(document.getElementById(atsPerioId).lastChild).trigger('click');
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
	exportToExcelAction : function () {
		openLoader
  		var _self = this ;
  		var url = _self.exportCommonParam();
  		var fastFilterItems = _self.getFastFilterItems();
		if( fastFilterItems == undefined){
			fastFilterItems = "" ;
		}else {
			if(_self.atsPeriodObj){
				fastFilterItems["dateSet.date"] = {dataType:"Date",values:{startDate:_self.atsPeriodObj.startDate,endDate:_self.atsPeriodObj.endDate}};
			}
		}
			
		if(fastFilterItems["add"] == ""){
			fastFilterItems["add"] = null;
		}
		
  		var serviceId = shr.getUrlRequestParam("serviceId");
  		url += '&serviceId='+encodeURIComponent(serviceId);
  		var callback=function(psw){
			openLoader(1,jsBizMultLan.atsManager_atsResultToSumList_i18n_57);
			shr.ajax({
				type:"post",
				url:url,
				data: $.extend({
					fastFilterItems : $.toJSON(fastFilterItems),
					isAll:'true'
				},{exportPrivteProtected: psw} ) ,
				success:function(res){
					closeLoader();
					shr.redirect(res.url,"");
				},
				error : function(res){
					shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_58});
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
	exportCurrentAction : function(){
		var _self = this;
		var personJson=[];
		var sid = $("#reportGrid").jqGrid("getSelectedRows");
		for ( var i in sid){
			var data = $("#reportGrid").jqGrid("getRowData", sid[i]);
			personJson.push({'personId':data["personId"],'adminOrgUnitId':data["adminOrgUnitId"],'hrOrgUnitId':data["hrOrgUnitId"]});
		}
		if(personJson.length>0)
		{
			var fastFilterItems = _self.getFastFilterItems();
			if( fastFilterItems == undefined){
				fastFilterItems = "" ;
			}else {
				if(_self.atsPeriodObj){
					fastFilterItems["dateSet.date"] = {dataType:"Date",values:{startDate:_self.atsPeriodObj.startDate,endDate:_self.atsPeriodObj.endDate}};
				}
			}
				
			if(fastFilterItems["add"] == ""){
				fastFilterItems["add"] = null;
			}
			
			var serviceId = shr.getUrlRequestParam("serviceId");
			var url = _self.exportCommonParam()+'&serviceId='+encodeURIComponent(serviceId);
			var callback=function(psw){
				openLoader(1,jsBizMultLan.atsManager_atsResultToSumList_i18n_57);
				shr.ajax({
					type:"post",
					url:url,
					data: $.extend({
						PersonJson : $.toJSON(personJson),
						fastFilterItems : $.toJSON(fastFilterItems),
						isAll:'true'
					},{exportPrivteProtected: psw} ) ,
					success:function(res){
						closeLoader();
						shr.redirect(res.url,"");
					},
					error : function(res){
						shr.showError({message: jsBizMultLan.atsManager_atsResultToSumList_i18n_58});
						closeLoader();
					}
				});
			}
			if(window.isShrSensitiveRuleOpen) {
				fieldSensitiveService.setExportPsw(callback);
			}else{
				callback();
			}
		}else{
			shr.showWarning({
				message: jsBizMultLan.atsManager_atsResultToSumList_i18n_59
			});
		}
	},
	exportCommonParam : function(){
		var self = this;
		var url = shr.getContextPath() + shr.dynamicURL + "?method=exportToExcel";
		var uipk = "com.kingdee.eas.hr.ats.app.AttenceResultSum.list";
		var filterItems = self.getQuickFilterItems();
		
		var sorder =   $('#dataGrid').jqGrid('getGridParam', 'sortorder') || "";
		var sordName = $('#dataGrid').jqGrid('getGridParam', 'sortname') || "";

		//标题
	    url += "&title=AttedanceResultInfo"+'&rows=10000&page=0&uipk=' + uipk + "&sidx=" + sordName + "&sord=" + sorder + "&transverse=0";
		//如果存在高级搜索的条件，则拼上条件。
		if(filterItems){
			url += "&filterItems=" + encodeURIComponent(filterItems);
		}
		return url;
	}
});

function showOneDayDetailOnProject(personName,tDay,personId,adminOrgId,hrOrgUnitId){
	isDetailOnProject=true;
	shr.atsResultOneDayDetail.showBillDetailAction(personName,tDay,personId,adminOrgId,hrOrgUnitId);	
}

function getDays(date){
	var y = date.getFullYear();
	var m = date.getMonth() + 1;
	if(m == 2){
	return y % 4 == 0 ? 29 : 28;
	}else if(m == 1 || m == 3 || m == 5 || m == 7 || m == 8 || m == 10 || m == 12){
	return 31;
	}else{
	return 30;
	}
}

function getColorTitle(_self,value,flag){
	$(_self).removeClass('gray-color');
	$(_self).removeClass('litterGreen-color');
	
	if (value.substring(0, jsBizMultLan.atsManager_atsResultToSumList_i18n_2.length) == 
		jsBizMultLan.atsManager_atsResultToSumList_i18n_2) {
		if(flag){
			$(_self).addClass('gray-color');
		}
		return value.substring(jsBizMultLan.atsManager_atsResultToSumList_i18n_2.length);
	}
	else if (value.substring(0, jsBizMultLan.atsManager_atsResultToSumList_i18n_0.length) == 
		jsBizMultLan.atsManager_atsResultToSumList_i18n_0) {
		if(flag){
			$(_self).addClass('litterGreen-color');	
		}
		return value.substring(jsBizMultLan.atsManager_atsResultToSumList_i18n_0.length);
	}
	else {
		if (value.indexOf(jsBizMultLan.atsManager_atsResultToSumList_i18n_1) > -1) {
			return value.substring(jsBizMultLan.atsManager_atsResultToSumList_i18n_1.length);
		}
		else{
			return value;
		}
	}
}

function formatDate(date) {  
     var year = date.getFullYear();
     var month =  (date.getMonth() + 1) > 9 ? (date.getMonth() + 1):('0' +  (date.getMonth() + 1));
     var day = date.getDate() > 9 ? date.getDate():('0'  +  date.getDate());
     return year + '-' + month + '-' + day;
} 
