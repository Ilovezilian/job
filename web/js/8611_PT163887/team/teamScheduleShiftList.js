shr.defineClass("shr.ats.team.TeamScheduleShiftList", shr.ats.AttendanceOrgList, {
	HORIZONTAL_SHOW:0,
	VERTICAL_SHOW:1,
	UNCOMPLETE_SHOW:2,
	rowNumPerPage: 30,
	changeShift1: null,
	changeShift2:  null,
	longNumber: "",
	orgName: "",
	showType: 0, // 0-选中横向列表 1-纵向列表 2-未排班列表
	billId: "",
	isFirstTimeLoad: 0,
	initalizeDOM : function () {
		var that = this;
		//当从考勤档案菜单链接过来
		that.setParamValue();
		//初始化查询日期
	    that.initDate();
	    that.initSearchLabel();
        shr.ats.team.TeamScheduleShiftList.superClass.initalizeDOM.call(this);
	    //注册组织和人员的联动关系和页签的点击事件;默认的是横向列表显示
		that.initActiveTab();
		that.addF7Event();
		that.clearAdminOrgUnitVal();
		//that.forbidDeleteDateFilter();
		//快速过滤展开
		if($(".filter-containers").is(":hidden")){
			$("#filter-slideToggle").click();
		}
		$(".view_manager_body").css({minHeight:"700px"})
		atsCommonUtile.generateSearchConditionsByUrl(this);
		$("#searchId").blur(function(){
			$("#splitTip").remove();
		})
	}
	,
	isEditViewDisable : function(){
		//这里单纯为了屏蔽平台
	}
	,
	gridLoadComplete: function(ret) {
		shr.ats.AttendanceOrgList.superClass.gridLoadComplete.call(this);
		$('.ui-jqgrid-bdiv').scrollTop(0);
	}
	,forbidDeleteDateFilter: function(){
		var date = $("[data-id=beginDate_endDate]");
		if(!date){
			shr.showWarning({message : jsBizMultLan.atsManager_scheduleShiftList_i18n_28});
		}
		$("[data-id=beginDate_endDate]").find($(".filter-item-delete")).on('click', function(){
			shr.showWarning({message : jsBizMultLan.atsManager_scheduleShiftList_i18n_5});
 		    return false;
		})
	}
	,
	changeAttenceOrgAction: function(){
		this.changeAttenceOrg('attendanceResult');
	},
	searchParam: function(){
		var that = this;
		var searchsField = [];
		
		searchsField.push({
			label: jsBizMultLan.atsManager_scheduleShiftList_i18n_38,
			columnName: 'proposer.fName_l2',
			type: "String"
		});
		searchsField.push({
			label: jsBizMultLan.atsManager_scheduleShiftList_i18n_43,
			columnName: 'proposer.fnumber',
			type: "String"
		});
		searchsField.push({
			label: jsBizMultLan.atsManager_scheduleShiftList_i18n_19,
			columnName: 'hrOrgUnit.fdisplayName_l2',
			type: "String"
		});
		if(that.showType == 0){
			searchsField.push({
				label: jsBizMultLan.atsManager_scheduleShiftList_i18n_36,
				columnName: 'adminOrgUnit.fdisplayName_l2',
				type: "String"
			});
			searchsField.push({
				label: jsBizMultLan.atsManager_scheduleShiftList_i18n_16,
				columnName: 'attAdminOrgUnit.fdisplayName_l2',
				type: "String"
			});
			searchsField.push({
				label: jsBizMultLan.atsManager_scheduleShiftList_i18n_3,
				columnName: 'defaultShift.fName_l2',
				type: "String"
			});
			
			searchsField.push({
				label: jsBizMultLan.atsManager_scheduleShiftList_i18n_21,
				columnName: 'attendPolicy.fName_l2',
				type: "String"
			});
			searchsField.push({
				label: jsBizMultLan.atsManager_scheduleShiftList_i18n_30,
				columnName: 'cardRule.fName_l2',
				type: "String"
			});
			searchsField.push({
				label: jsBizMultLan.atsManager_scheduleShiftList_i18n_31,
				columnName: 'scheduleShift.fDayType',
				type: "IntEnum",
				enumSource: 'com.kingdee.eas.hr.ats.DayTypeEnum'
			});
		}
		else if(that.showType == 1){
			searchsField.push({
				label: jsBizMultLan.atsManager_scheduleShiftList_i18n_16,
				columnName: 'adminOrgUnit.fdisplayName_l2',
				type: "String"
			});
		}
		else if(that.showType == 2){
			searchsField.push({
				label: jsBizMultLan.atsManager_scheduleShiftList_i18n_36,
				columnName: 'adminOrgUnit.fdisplayName_l2',
				type: "String"
			});
		}
		
		return searchsField;
	},
	/**
	 * 获得快速查询和高级查询条件
	 */
	getQuickFilterItems: function() {
		var filter = $('#searcher').shrSearchBar('option', 'filterView');
		if (filter && filter.filterItems) {
			var quickItems = filter.filterItems;
			if(quickItems.indexOf('.name') > -1){
				filter.filterItems = quickItems.replace(/\.name/g,'.fname_' + shr.getFieldLangByContext());
			}
			else{
				if(quickItems.indexOf('.f') > -1){
					//nothing
				}
				else{
					filter.filterItems = quickItems.replace(/\./g,'.f');
				}
			}
			return filter.filterItems;
		}
	},
	initalSearch : function(){
		
		var _self = this;
		//由于高级过滤是自定义的，所以框架的必须去除掉
		$('#searcher').parent().remove();
		
		//$('<div class="span6"><div id="searcher" class="pull-right"/></div>').insertAfter();
		$('#pageTabs').append('<div class="span6"><div id="searcher" class="pull-right"/></div>');
		$('#searcher').parent().css({position: 'absolute',top: '10px',left: '430px',width: '30%'});
		$('#pageTabs').append('<div><div id="microToolbar1" class="pull-right" style="position: relative;top: -33px;" /><div>');
		$('#microToolbar1').parent().css({position: 'absolute',top: '38px',left: '1700px'});
		var options = {
			gridId: "dataGrid",
            uipk: "com.kingdee.eas.hr.ats.app.team.ScheduleShift.list",
			query: "" ,
			jsonData: "",
			propertiesUrl: shr.getContextPath()
                + '/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.team.ScheduleShift.list&method=getProperField&paramColumnData=' + encodeURIComponent(shr.toJSON(_self.searchParam()))
		};

		$("#searcher").shrSearchBar(options);
		//设置其默认的过滤方案
		var filter = $("#searcher").shrSearchBar('option', 'filterView');
		if ($.isEmptyObject(filter)) {
			// 如果filter为空
			if (!$.isEmptyObject($("#searcher").shrSearchBar('option', 'defaultViewId'))) {
				if(_self.showType == 0){//横向显示的加载默认方案，纵向和未排班不加载，查询的字段不一样。
				// 加载默认过滤方案触发表格取数
				$("#searcher").shrSearchBar('chooseDefaultView');
			    }
			}
		}
		$('#searcher').shrSearchBar('option', {
			afterSearchClick: this.queryGridByEvent
		});
		$('#searcher').children().eq(1).css({'top':'4px','width':'auto','font-size':'12px'});
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
	},
	toTunrShiftAction : function(){
		var that = this;
		var reloadParams = {
			uipk: 'hr.ats.turnShift',
			type: 'another'
		}
		var hrOrgUnit = workShiftStrategy.getHrOrgUnit();
		if(hrOrgUnit.length > 1){
			atsCommonUtile.showWarning(jsBizMultLan.atsManager_scheduleShiftList_i18n_40);
			return;
		}
		var selectedPersons = atsArrayUtile.deleteRepeat(that.getSelectedPerson(),"personNum").map(function(person){
			return {personNum : person.personNum,personName:person.name};
		});
		atsGlobalDataCarrier.setData(
			"shr.ats.turnShift",
			{
				hrOrgUnit : hrOrgUnit[0],
				selectedPersons:selectedPersons
			}
		);
		that.billId && (reloadParams.billId = that.billId);
		that.reloadPage(reloadParams);
	},
	initActiveTab: function () {
		var that = this;

		var activeTab = $("#pageTabs").attr("default-active");
		if (activeTab == "verticaliQuery") {// 纵向显示
			that.verticaliQuery();
		} else if (activeTab == "noShiftQuery") { //未排班列表
			that.noShiftQuery();
		} else {// 横向显示
			that.crosswiseQuery();
		}
	}, noShiftQuery: function () {
		var that = this;
		that.showType = 2;
		$("#delete").hide();
		//定义标签样式
		that.changePageLabelColor();
		//隐藏工具栏上的一些按钮
		that.hideToolBars();
		that.btnShowOrHide();

		//$("span[data-categoryvalue=advancedFilter] > .filter-item-delete").click();
		//高级过滤去掉
		$(".filter-container:last").css("display", "none");
		$(".filter-container:last").css("display", "");
	},
	addF7Event: function(){
		var that = this;
		$('#adminOrgUnit').shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					if(info == 'undefined' || info == null)
						return;
					that.longNumber = info.longNumber ;
					that.orgName = info.name;
				//	var filter = "personDep.longNumber ='" + info.longNumber + "' OR personDep.longNumber like '" + info.longNumber + "!%'";
				//	$('#person').shrPromptBox("setFilter",filter);
				//	$('#person').shrPromptBox("setValue",{id:null, name:null});
			}
		});
		that.initalSearch();
		$('#crosswiseQuery').click(function(){ // 横向显示
			that.crosswiseQuery();
			that.doRenderDataGrid();
		});
		$('#verticaliQuery').click(function(){  // 纵向显示
			that.verticaliQuery();
			that.doRenderDataGrid();
		});
		$('#noShiftQuery').click(function(){//未排班列表
			that.noShiftQuery();
			that.doRenderDataGrid();
		});

	},
	verticaliQuery: function () {
		var that = this
		that.showType = 1;
		$("#delete").hide();
		//定义标签样式
		that.changePageLabelColor();
		//显示工具栏上的一些按钮
		that.showToolBars();
		that.btnShowOrHide();
		//切换时去掉高级过滤里的条件
		//$("span[data-categoryvalue=advancedFilter] > .filter-item-delete").click();
		//加载数据
		$(".filter-container:last").css("display", "");
	},
	crosswiseQuery: function(){
		var that = this;
		that.showType = 0;
		$("#delete").show();
		//定义标签样式
		that.changePageLabelColor();
        //显示工具栏上的一些按钮
		that.showToolBars();
		that.btnShowOrHide();
		//加载数据
		//$("span[data-categoryvalue=advancedFilter] > .filter-item-delete").click();
		$(".filter-container:last").css("display","");
	},
	changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.showType).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.showType).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
	},
	changeShiftBillAction : function(){
		var that = this;
		var proposerid = "";
		var proposernumber = "";
		var flag = "";
		var path = GetQueryString("uipk");
		if(path == "com.kingdee.eas.hr.ats.app.AttendanceFileView.form"){
			flag = "attendfile";
		}
		if($("#dataGrid").jqGrid("getRowData") && $("#dataGrid").jqGrid("getRowData").length > 0){
			proposerid = $("#dataGrid").jqGrid("getRowData")[0].proposer_id;
			proposernumber = $("#dataGrid").jqGrid("getRowData")[0].personNum;
		}
		this.reloadPage({
			uipk : 'com.kingdee.eas.hr.ats.app.AtsChangeShiftBill.list',
			proposerid : proposerid,
			proposernumber : proposernumber,
			flag : flag
		});	
	},
	perShiftBillAction : function(){
		var that = this;
		var proposerid = "";
		var proposernumber = "";
		var flag = "";
		var path = GetQueryString("uipk");
		if(path == "com.kingdee.eas.hr.ats.app.AttendanceFileView.form"){
			flag = "attendfile";
		}
		if($("#dataGrid").jqGrid("getRowData") && $("#dataGrid").jqGrid("getRowData").length > 0){
			proposerid = $("#dataGrid").jqGrid("getRowData")[0].proposer_id;
			proposernumber = $("#dataGrid").jqGrid("getRowData")[0].personNum;
		}
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsScheduleShift.specialList',
			proposerid : proposerid,
			proposernumber : proposernumber,
			flag : flag
		});	
	},
	initDate : function(){
		var that = this;
		var beginDate  = new Date();
		var endDate = new Date();
		
		beginDate.setTime(endDate.getTime() - 1 * 6 * 24 * 60 * 60 * 1000);
		var beginMonth = beginDate.getMonth() + 1;
		if(beginMonth < 10){
			beginMonth = "0" + beginMonth;
		}
		var beginDay = beginDate.getDate();
		if(beginDay < 10){
			beginDay = "0" + beginDay;
		}
		atsMlUtile.setTransDateTimeValue("beginDate",beginDate.getFullYear() + "-" + beginMonth + "-" + beginDay);
		
		var endMonth = endDate.getMonth() + 1;
		if(endMonth < 10){
			endMonth = "0" + endMonth;
		}
		var endDay = endDate.getDate();
		if(endDay < 10){
			endDay = "0" + endDay;
		}
		var serviceId = shr.getUrlRequestParam("serviceId");
	    atsMlUtile.setTransDateTimeValue("endDate",endDate.getFullYear() + "-" + endMonth  + "-" + endDay);
		shr.ajax({
			type:"post",
			async:false,
			url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=getDefaultOrg"+'&serviceId='+encodeURIComponent(serviceId),
			success:function(res){
				var info = res;
				if(info!=null){
					var dataValue = {
						id : info.orgID,
						name : info.orgName
					};
					$('#adminOrgUnit').shrPromptBox("setValue", dataValue);
					that.longNumber = info.longNumber;
				}
		    }
		});
	}
	,importDataAction:function(){
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.team.ScheduleShiftImport'
		});		
	}
	,setParamValue :function(){
		 var that = this;
		 var referrer =  document.referrer;
		 that.billId = $.getUrlParam('billId');
		 /*if(document.referrer.indexOf("type=another")>-1 
		 && (that.billId == undefined || that.billId == null || that.billId == '')
		 && document.referrer.indexOf("uipk=hr.ats.turnShift")>0
		 || (shr.getPageUrl().indexOf("&debug=true")>0 
		 && (that.billId == undefined || that.billId == null || that.billId == ''))){
		    that.billId = localStorage.getItem("billId");
		 }
		 if(document.referrer.indexOf("/shr/home.do")>0){
		 	localStorage.removeItem("billId");
		 }*/
		 if(that.billId != undefined && that.billId != null && that.billId != ''){
		 	$("#delete").hide();
		 	$("#importData").hide();
		 }
		 else{
		 	$("#delete").show();
		 	$("#importData").show();
		 	that.billId = "";
		 }
		 var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		 var endDate = atsMlUtile.getFieldOriginalValue("endDate");
	},
	batchModifyAction:function(){
		var that = this;
		var dataGrid =$("#dataGrid");
		//代表从考勤档案那边过来的。
		if(that.billId != undefined && that.billId != null && that.billId != '' && that.showType == 0){
			var billIds = $(dataGrid).jqGrid("getSelectedRows");
			if (billIds == undefined || billIds == null || billIds.length != 1) {
				shr.showWarning({message : jsBizMultLan.atsManager_scheduleShiftList_i18n_29});
				return;
			}
			if( billIds.length == 1){
				var attendDate = $(dataGrid).jqGrid("getCell",billIds[0], "attendDate");
				var defaultShiftId = $(dataGrid).jqGrid("getCell",billIds[0], "defaultShift_id");
				
				if(defaultShiftId == undefined || defaultShiftId == null || defaultShiftId.trim().length == 0){
					shr.showInfo({message : jsBizMultLan.atsManager_scheduleShiftList_i18n_7});
					return;
				}
				var defaultShiftName = $(dataGrid).jqGrid("getCell",billIds[0], "defaultShift_name");
				var personId = $(dataGrid).jqGrid("getCell",billIds[0], "proposer_id");
				var personName = $(dataGrid).jqGrid("getCell",billIds[0], "proposer_name");
				var displayName = $(dataGrid).jqGrid("getCell",billIds[0], "adminOrgUnit_displayName");
				var adminOrgUnitId = $(dataGrid).jqGrid("getCell",billIds[0], "adminOrgUnit_id");
				var hrOrgUnitId = $(dataGrid).jqGrid("getCell",billIds[0], "hrOrgUnit_id");
				var hrOrgUnitName = $(dataGrid).jqGrid("getCell",billIds[0], "hrOrgUnit_name");
					
				this.reloadPage({
                    uipk: 'com.kingdee.eas.hr.ats.team.ScheduleShiftItemModify',
					attendDate :encodeURIComponent(attendDate),
					defaultShiftId : encodeURIComponent(correctValue(defaultShiftId)),
					defaultShiftName : encodeURIComponent(correctValue(defaultShiftName)),
					displayName : encodeURIComponent(correctValue(displayName)),
					adminOrgUnitId : encodeURIComponent(correctValue(adminOrgUnitId)),
					personId: encodeURIComponent(correctValue(personId)),
					personName : encodeURIComponent(correctValue(personName)),
					hrOrgUnitId : encodeURIComponent(correctValue(hrOrgUnitId)),
					hrOrgUnitName : encodeURIComponent(correctValue(hrOrgUnitName))
				});	
			}
		}
		else{
			//scheduleShiftBatchEdit.js
			this.reloadPage({
                uipk: 'com.kingdee.eas.hr.ats.team.ScheduleShiftItemModify'
			});	
		}
		
	},
	/**
	 * 导向调班单
	 */
	changeAction: function(){
		var that = this;
		//只针对列表式排班
		if(0 == that.showType){
			var objects = $("#dataGrid").jqGrid("getSelectedRows");
			if(objects != null && objects.length == 2){
				that.changeShift1 = getHorizontalValue(objects[0]);	
				that.changeShift2 = getHorizontalValue(objects[1]);	
			}
			else{
				var message =  jsBizMultLan.atsManager_scheduleShiftList_i18n_27;
				shr.showWarning({message:message});
				return false;
			}
		}
		
		if(that.changeShift1 == null || that.changeShift2 == null){
			var message =  jsBizMultLan.atsManager_scheduleShiftList_i18n_27;
			shr.showWarning({message:message});
			return false;
		}
		var shiftName1 = that.changeShift1.shiftName;
		var hrOrgUnit=that.changeShift1.hrOrgUnitName;
		var hrOrgUnitId=that.changeShift1.hrOrgUnitId;
		var personNum1 = that.changeShift1.personNum;
		var personName1 = that.changeShift1.personName;
		var attendDate1 = that.changeShift1.attendDate;
		
		var personNum2 = that.changeShift2.personNum;
		var hrOrgUnit2=that.changeShift2.hrOrgUnitName;
		var hrOrgUnitId2=that.changeShift2.hrOrgUnitId;
		var shiftName2 = that.changeShift2.shiftName;
		var attendDate2 = that.changeShift2.attendDate;
		var personName2 = that.changeShift2.personName;
		
		if(hrOrgUnitId != hrOrgUnitId2){
			var message =  jsBizMultLan.atsManager_scheduleShiftList_i18n_33;
			shr.showWarning({message:message});
			return false;
		}
		
		if(shiftName1 == null || shiftName1 == undefined || shiftName1.length < 1){
			if(shiftName2 == null || shiftName2 == undefined || shiftName2.length < 1){
				var message = shr.formatMsg(jsBizMultLan.atsManager_scheduleShiftList_i18n_41,[personName1 + " " + personName2, attendDate2]);
				shr.showWarning({message:message});
				return false;
			}
		}
		else if(personNum1 != personNum2 && shiftName1 == shiftName2 &&  attendDate1 == attendDate2){
			var message =  shr.formatMsg(jsBizMultLan.atsManager_scheduleShiftList_i18n_42,[personName1+ "," + personName2, attendDate1]);
			shr.showWarning({message:message});
			return false;
		}
		else if(personNum1 == personNum2 && shiftName1 == shiftName2){
			var message = shr.formatMsg(jsBizMultLan.atsManager_scheduleShiftList_i18n_42, [personName1,attendDate1 + "," + attendDate2]);
			shr.showWarning({message:message});
			return false;
		}
		/**
		 * 专向调班单前先做预判断
		 */
		shr.ajax({
				dataType:'json',
				url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsChangeShiftEditHandler&method=getScheduleShiftInfo",
				type: 'post', 
				data: {personNum1: personNum1,personNum2: personNum2,attendDate1:attendDate1,attendDate2:attendDate2},
				success : function(res) {
					if(res.personStr != null && res.personStr.length > 0){
						shr.showConfirm(res.personStr, function(){
							top.Messenger().hideAll();
							//atsChangeShiftEdit.js
							that.reloadPage({
								uipk: 'com.kingdee.eas.hr.ats.app.AtsChangeShiftBill.form',
								method: 'addNew',
								hrOrgUnit: encodeURIComponent(that.changeShift1.hrOrgUnitName),
								hrOrgUnitId: encodeURIComponent(that.changeShift1.hrOrgUnitId),
								personNum1: encodeURIComponent(that.changeShift1.personNum),
								personName1: encodeURIComponent(that.changeShift1.personName),
								attendDate1: encodeURIComponent(that.changeShift1.attendDate),
								dayType1: encodeURIComponent(that.changeShift1.dayType),
								shiftId1: that.changeShift1.shiftId,
								shiftName1:  encodeURIComponent(that.changeShift1.shiftName),
								personNum2: encodeURIComponent(that.changeShift2.personNum),
								personName2: encodeURIComponent(that.changeShift2.personName),
								attendDate2: encodeURIComponent(that.changeShift2.attendDate),
								dayType2: encodeURIComponent(that.changeShift2.dayType),
								shiftId2: that.changeShift2.shiftId,
								shiftName2:  encodeURIComponent(that.changeShift2.shiftName)
							});	
						})
					}
			   }
		});
		
	},
	/*
	 * 得到纵向动态列表的参数
	 */
	getVerticaliQueryParam : function(){
		var serviceId = shr.getUrlRequestParam("serviceId");
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamScheduleShiftListHandler&method=getPersonShift";
//		var beginDate = $('#beginDate').val();
//		var endDate = $('#endDate').val();
		url += '&serviceId='+encodeURIComponent(serviceId);
		var beginDate = this.getFastFilterItems().beginDate_endDate.values.startDate;
		var endDate = this.getFastFilterItems().beginDate_endDate.values.endDate;
		var resObject={url:url,colChineseNames:null,colModel:null};
		shr.ajax({
				type:"post",
				async: false,
				data: {beginDate:beginDate,endDate:endDate},
				url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamScheduleShiftListHandler&method=getGridColModel"+'&serviceId='+encodeURIComponent(serviceId),
				success:function(res){
					resObject.colChineseNames = res.colNames;
					resObject.colModel = res.colModel;
			    }
		});
		return resObject;
	},
	assembleParam:function(){
		var that = this;
		var param = {};
		
		if (that.billId == undefined || that.billId == null) {
			that.billId = "";
		} else {
			that.billId = decodeURIComponent(that.billId)
		}
		param.billId = that.billId;
		param.filterItems = that.getQuickFilterItems();
		param.fastFilterItems =  JSON.stringify(this.getFastFilterItems());
		if(null != that.getAdvancedFilterItems()){
			param.advancedFilterItems = JSON.stringify(that.getAdvancedFilterItems());
		}
		return param;
	},
	queryAction:function(){
		this.doRenderDataGrid();
	},
	doVerticalRenderDataGrid: function () {
		var that = this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamScheduleShiftListHandler&method=getGridData&transverse=1";
		url += '&serviceId=' + encodeURIComponent(shr.getUrlRequestParam("serviceId"));
		var options = {
			url: url,
			postData: that.assembleParam(),
			datatype: "json",
			mtype: "POST",
			multiselect: true,
			rownumbers: false,
			footerrow: true,  //原生jqGrid加入防止样式错乱
			colNames: that.colChineseNames_function(),
			colModel: that.colModel_function(),
			rowNum: that.rowNumPerPage,
			sortname: "",
			pager: '#gridPager1',
			height: 'auto',
			rowList: [30, 50, 100, 200],
			recordpos: 'left',
			recordtext: '({0}-{1})/{2}',
			gridview: true,
			pginput: true,
			shrinkToFit: true,
			viewrecords: true,
			afterInsertRow: function (rowid, rowdata) {
			},
			onSelectRow: function (rowid, status) {
			},
			onCellSelect: function (rowid, iCol, cellcontent, e) {
				if (iCol > 0) {
					var billId = $("#dataGrid").jqGrid("getCell", rowid, "id");
					that.reloadPage({
						uipk: 'com.kingdee.eas.hr.ats.app.team.ScheduleShift.form',
						billId: billId,
						method: 'view'
					});
				}
			},
			beforeProcessing: function(data) {
			},
			loadComplete: function (data) {
				that.handleMicroToolbarInfo(data);
				$("#listInfo .ui-jqgrid-bdiv").css("height", "550px");
				$("#listInfo .frozen-bdiv.ui-jqgrid-bdiv").css("height", "550px");
			}
		};

		$("#gridPager1").hide();
		// clear table
		$('#dataGrid').jqGrid(options);
		jQuery('#dataGrid').jqGrid('setFrozenColumns');
	},
	doRenderDataGrid : function () {

		this.isFirstTimeLoad++;
		if(this.isFirstTimeLoad < 2){
			return;
		}
		var that = this;
		that.changeShift1 = null;
		that.changeShift2 = null;
		//考勤日期范围必选
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"beginDate_endDate","errorMessage":jsBizMultLan.atsManager_scheduleShiftList_i18n_28});
		if(!dateRequiredValidate) {
			return;
		}

		var ONE_QUARTER_TIME = 7948800000; // 3 * 30 * 24 * 60 * 60 * 1000 一个季度的时间
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredDateRangeValidate(this,{"name":"beginDate_endDate","errorMessage":jsBizMultLan.atsManager_scheduleShiftList_26522394_i18n_0, "milliSecondRange": ONE_QUARTER_TIME});
		if(!dateRequiredValidate) {
			return;
		}

		if($('#gridPager1').length > 0){
			$('#listInfo').empty();
		}
		
		$('#listInfo').append('<div id="gridPager1"></div>');
		$('#listInfo').append('<table id="dataGrid"></table>');
		

		//选中横向列表
	    if(0 == that.showType){
			that.doVerticalRenderDataGrid();
		}
	    //选中纵 向列表
	    else if(1 == that.showType){
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamScheduleShiftListHandler&method=getPersonShift";
			url += "&transverse=0&serviceId="+encodeURIComponent(shr.getUrlRequestParam("serviceId"));

			$("#gridPager1").hide();
			listWorkShift.renderListTable({
				url:url,
				rowNum : that.rowNumPerPage,
				pager : '#gridPager1',
				rowList : [30,50,100,200],
				recordtext : '({0}-{1})/{2}',
				viewrecords : true,
				postData: that.assembleParam(),
				loadComplete:{fn : that.handleMicroToolbarInfo,sequence :atsCommonUtile.SEQUENCE_AFTER,scope:this}
			});
			$($("#listInfo").find(".ui-jqgrid-bdiv")[0]).css("height", "500px").css("overflow", "auto");
	    }
	    //未排班列表
	    else{
	    	url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamScheduleShiftListHandler&method=getNoShiftGridData";
	    	url += '&serviceId='+encodeURIComponent(shr.getUrlRequestParam("serviceId"));
	    	$("#gridPager1").hide();
	    	listWorkShift.renderListTable({
	    		url:url,
	    		rowNum : that.rowNumPerPage,
	    		pager : '#gridPager1',
	    		rowList : [30,50,100,200],
	    		recordtext : '({0}-{1})/{2}',
	    		viewrecords : true,
	    		postData: that.assembleParam(), 
	    		loadComplete:{fn : that.handleMicroToolbarInfo,sequence :atsCommonUtile.SEQUENCE_AFTER,scope:this}
	    	});
	    	$($("#listInfo").find(".ui-jqgrid-bdiv")[0]).css("height", "500px").css("overflow", "auto");
	    }
	    

	},
	colModel_function: function(){
		var arr = [];
		arr.push({
			name : 'id',
			label : 'ID',
			index : 'id',
			frozen : true,
			hidden : true
		});
		arr.push({
			name : 'proposer_id',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_44,
			index : 'proposer_id',
			frozen : true,
			hidden: true
		});
		arr.push({
			name : 'proposer_number',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_43,
			index : 'proposer_number',
			width : 60,
			frozen : true,
			editable : false,
			sortable:true
		});
		arr.push({
			name : 'proposer_name',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_38,
			index : 'proposer_name',
			width : 70,
			frozen : true,
			editable : false,
			sortable:true
		});
		arr.push({
			name : 'attendDate',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_18,
			index : 'attendDate',
			width : 75,
			frozen : true,
			editable : false,
			sortable:true,
			formatter: "shrDateTimePicker",
			formatoptions: {
				'isRemoveDay': false,
				'isShowUTC': false,
				'showTimeZoneForCtrl': false,
				'isAutoTimeZoneTrans': false,
				'ctrlType': 'Date',
				'isRemoveSeco': false
			}
		});
		arr.push({
			name : 'adminOrgUnit_id',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_37,
			index : 'adminOrgUnit_id',
			hidden: true
		});
		arr.push({
			name : 'adminOrgUnit_displayName',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_36,
			index : 'adminOrgUnit_displayName',
			width : 140,
			editable : false,
			sortable:true
		});
		arr.push({
			name : 'hrOrgUnit_id',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_20,
			index : 'hrOrgUnit_id',
			hidden: true
		});
		arr.push({
			name : 'hrOrgUnit_name',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_19,
			index : 'hrOrgUnit_name',
			width : 130,
			editable : false,
			sortable:true
		});
		arr.push({
			name : 'attAdminOrgUnit_id',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_17,
			index : 'attAdminOrgUnit_id',
			hidden: true
		});
		arr.push({
			name : 'attAdminOrgUnit_displayName',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_16,
			index : 'attAdminOrgUnit_displayName',
			width : 120,
			editable : false,
			sortable:true
		});
		arr.push({
			name : 'dayType',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_31,
			index : 'dayType',
			width : 60,
			editable : false,
			sortable:true
		});
		arr.push({
			name : 'defaultShift_id',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_4,
			index : 'defaultShift_id',
			hidden: true
		});
		arr.push({
			name : 'defaultShift_name',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_3,
			index : 'defaultShift_name',
			width : 80,
			editable : false,
			sortable:true
		});
		arr.push({
			name : 'attendFile_attendanceNum',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_15,
			index : 'attendFile_attendanceNum',
			width : 60,
			editable : false,
			sortable:true,
			hidden: true
		});
		arr.push({
			name : 'attendPolicy_name',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_21,
			index : 'attendPolicy_name',
			width : 120,
			editable : false,
			hidden: true,
			sortable:true
		});
		arr.push({
			name : 'matchDayType',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_53,
			width : 90,
			index : 'matchDayType',
			hidden: false
		});
		arr.push({
			name : 'matchShift_id',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_47,
			index : 'matchShift_id',
			hidden: true
		});
		arr.push({
			name : 'matchShift_number',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_48,
			index : 'matchShift_number',
			hidden: true
		});
		arr.push({
			name : 'matchShift_name',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_46,
			width : 80,
			index : 'matchShift_name',
			hidden: false
		});
		arr.push({
			name : 'firstPreTime',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_32,
			index : 'firstPreTime',
			width : 60,
			editable : false,
			sortable:false
		});
		arr.push({
			name : 'lastNextTime',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_35,
			index : 'lastNextTime',
			width : 60,
			editable : false,
			sortable:false
		});
		arr.push({
			name : 'cardRule_name',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_30,
			index : 'cardRule_name',
			width : 80,
			editable : false,
			sortable:true
		});
		arr.push({
			name : 'planSet_id',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_50,
			index : 'planSet_id',
			hidden: true
		});
		arr.push({
			name : 'planSet_name',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_49,
			width : 80,
			index : 'planSet_name',
			hidden: true
		});
		arr.push({
			name : 'plan_id',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_51,
			index : 'plan_id',
			hidden: true
		});
		arr.push({
			name : 'plan_name',
			label : jsBizMultLan.atsManager_scheduleShiftList_i18n_52,
			width : 60,
			index : 'plan_name',
			hidden: true
		});

		return arr;
	},
	colChineseNames_function: function(){
		var arr = [];
		arr.push('id');
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_44);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_43);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_38);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_18);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_37);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_36);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_20);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_19);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_17);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_16);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_31);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_4);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_3);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_15);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_21);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_53);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_47);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_48);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_46);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_32);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_35);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_30);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_50);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_49);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_51);
		arr.push(jsBizMultLan.atsManager_scheduleShiftList_i18n_52);
		return arr;
	}

	,handleMicroToolbarInfo : function (data) {
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
		$('#microToolbar1').html("");
		$('#microToolbar1').append(html);
        $("#selectRowNum").val(that.rowNumPerPage);
		$("#gripage").on("click", that.selectRowNumPerPage);
		$("#prevId").on("click", that.prePage);
		$("#nextId").on("click", that.nextPage);

		//页码 (1-4)/4
		that.updatePageEnable(data);
		if(data && data.rows && data.rows.length > 0){
			var start = (data.page - 1) * that.rowNumPerPage + 1;
			$("#gripage").text("(" + start + "-" + (start + data.rows.length -1) + ")/" + data.records);
		}
		
		$("#gridPager1").hide();
		shr.setIframeHeight();
	},
	updatePageEnable:function (data) {
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
		colorFormatter();
	},

	nextPage : function () {
		$("#next_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
		colorFormatter();
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
	}
	,deleteAction:function() {
		var _self = this;
		var selectedIds = $("#dataGrid").jqGrid("getSelectedRows");
		var billIds = [];
		if (selectedIds.length > 0) {
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				billIds.push($("#dataGrid").jqGrid("getCell", selectedIds[i], "id"));
			}
	    }else{
			shr.showWarning({message: jsBizMultLan.atsManager_scheduleShiftList_i18n_26});
			return;
		}
		if(billIds != null && billIds.length > 0 && billIds[0] == false){
			shr.showWarning({message: jsBizMultLan.atsManager_scheduleShiftList_i18n_26});
			return;
		}
		shr.showConfirm(jsBizMultLan.atsManager_scheduleShiftList_i18n_23, function(){
			top.Messenger().hideAll();
			var data = {
				method: 'delete',
				ids :billIds.join(',')
			};
			data = $.extend(_self.prepareParam(),data);
			
			shr.doAction({
				url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamScheduleShiftListHandler&method=delete" ,
				type: 'post', 
					data: data,
					success : function(response) {	
						shr.msgHideAll();
						var options={
							message:response
						};
						$.extend(options, {
							type: 'info',
							hideAfter: null,
							showCloseButton: true
						});
						top.Messenger().post(options);
						$("#dataGrid").jqGrid("reloadGrid");
					}
			});	
		});
	}
	,getPageState: function() {
		var that = this;
        var pageState = shr.ats.team.TeamScheduleShiftList.superClass.getPageState.call(this);
		var data = {};
		data.adminOrgUnit = {id: $("#adminOrgUnit_el").val(), name: $("#adminOrgUnit").val()};
		data.person = $("#person").val();
		data.beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		data.endDate = atsMlUtile.getFieldOriginalValue("endDate");
		data.longNumber = that.longNumber;
		data.personNumber = $("#personNumber").val();
		$.extend(pageState, data);
		return pageState; 
	}
	,setPageState: function(pageState) {
		var that = this;
        shr.ats.team.TeamScheduleShiftList.superClass.setPageState.call(this, pageState);
		if (typeof pageState == 'undefined') {
			return;
		}
		if(pageState.adminOrgUnit){
			$('#adminOrgUnit').shrPromptBox("setValue", pageState.adminOrgUnit);
		}
		if(pageState.person){
			$('#person').val(pageState.person);
		}
		if(pageState.personNumber){
		    $("#personNumber").val(pageState.personNumber);
		}
		if(pageState.beginDate){
			atsMlUtile.setTransDateTimeValue("beginDate",pageState.beginDate);
		}
		if(pageState.endDate){
			atsMlUtile.setTransDateTimeValue("endDate",pageState.endDate);
		}
		if(pageState.longNumber){
			that.longNumber = pageState.longNumber;
		}
	},
	clearAdminOrgUnitVal: function(){
		var that = this;
		 $("#adminOrgUnit").blur(function(){
		       if($("#adminOrgUnit_el").val() == null || $("#adminOrgUnit_el").val() == ""){
		           that.longNumber = "";
		       }
		 });
	},
	hideToolBars: function(){
	    $("#change").hide();
	    $("#batchModify").hide();
	},
	showToolBars: function(){
		$("#change").show();
	    $("#batchModify").show();
		
	},
	btnShowOrHide:function(){
		var crosswiseBtn = ["change","changeAttenceOrg","importData","changeShiftBill","perShiftBill","toTunrShift","batchAssignment"];
		var verticalBtn = ["changeAttenceOrg","importData","changeShiftBill","perShiftBill","toTunrShift","batchAssignment","turnShiftAdd","shiftScheduling","arrangeByCopyWorkShift","save"];
		var noShiftBtn = ["turnShiftAdd","shiftScheduling","arrangeByCopyWorkShift","save","importData"];
		if($("li.ui-tabs-active a").attr("id") == "noShiftQuery"){
			crosswiseBtn.forEach(function(id){
				$("#" + id).hide();
			});
			verticalBtn.forEach(function(id){
				$("#" + id).hide();
			});
			noShiftBtn.forEach(function(id){
				$("#" + id).show();
			});
		}else if($("li.ui-tabs-active a").attr("id") == "verticaliQuery"){
			crosswiseBtn.forEach(function(id){
				$("#" + id).hide();
			});
			noShiftBtn.forEach(function(id){
				$("#" + id).hide();
			});
			verticalBtn.forEach(function(id){
				$("#" + id).show();
			});
		}else if($("li.ui-tabs-active a").attr("id") == "crosswiseQuery"){
			noShiftBtn.forEach(function(id){
				$("#" + id).hide();
			});
			verticalBtn.forEach(function(id){
				$("#" + id).hide();
			});
			crosswiseBtn.forEach(function(id){
				$("#" + id).show();
			});
		}
		$("div[class^='btn-group']").show()
	},
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
        var callback = function(psw) {
            openLoader(1, jsBizMultLan.atsManager_scheduleShiftList_i18n_45);
            shr.ajax({
                type: "post",
                url: url,
                data: $.extend(_self.assemExportData(),{exportPrivteProtected: psw}),
                success: function (res) {
                    closeLoader();
                    //document.location.href = url;
                    shr.redirect(res.url, "");
                },
                error: function (res) {
                    shr.showError({message: jsBizMultLan.atsManager_scheduleShiftList_i18n_9});
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
		var postData = {fastFilterItems : $.toJSON(fastFilterItems)};
		advancedFilterItems && (postData.advancedFilterItems = $.toJSON(advancedFilterItems));
		exportData && (postData = $.extend(postData, exportData));
		if(_self.showType != "0" && _self.showType != "1"){
			var showCols = $("#dataGrid").jqGrid('getGridParam', 'colModel')
			.filter(function(oneCol){
				return oneCol.hidden !== true && oneCol.name != "cb";
			})
			postData.columnLabels = showCols.map(function(oneCol){
				return oneCol.label
			}).join(",");
			postData.columnNames = showCols.filter(function(onCol){
				return onCol.label.indexOf(onCol.name) !== 0
			}).map(function(oneCol){
				return oneCol.name
			}).join(",");
			postData.dateColNames = showCols.filter(function(onCol){
				return onCol.label.indexOf(onCol.name) == 0
			}).map(function(oneCol){
				return oneCol.name
			}).join(",");
		}
		return postData;
	},
	exportCurrentAction : function(){
		var _self = this;
		var exportData = {
			exportSelect:"yes",
			serviceId:shr.getUrlRequestParam("serviceId")
		};
		if(_self.showType == "0"){
			var selectedIds = $("#dataGrid").jqGrid("getSelectedRows");
			var personIds = [];
			if (selectedIds.length > 0) {
				for (var i = 0, length = selectedIds.length; i < length; i++) {
					personIds.push($("#dataGrid").jqGrid("getCell", selectedIds[i], "id"));
				}
			}
			if(personIds.length > 0){
				exportData.personIds = personIds.join(',');
			}else{
				shr.showWarning({
					message: jsBizMultLan.atsManager_scheduleShiftList_i18n_26
				});
				return false;
			}
		}else if(_self.showType == "1"){
			var personNumStr = "";
			var persons = $("tr[aria-selected='true']");
			for(var i=0;i<persons.length;i++){
				// var personNum = $($(persons[i]).children()[3]).text();
				var personNum = $("#dataGrid").jqGrid("getRowData",$(persons[i]).attr("id")).personNum;
				if(personNumStr.indexOf(personNum) == -1){
				   personNumStr += personNum + ",";
				}
			}
			if(personNumStr.indexOf(",")>-1){
			   personNumStr = personNumStr.substring(0,personNumStr.length-1);
			}
			if(personNumStr.length > 0){
				exportData.personNums = personNumStr;
			}else{
				shr.showWarning({
					message: jsBizMultLan.atsManager_scheduleShiftList_i18n_26
				});
				return false;
			}
		}else{
			//未排班选中记录ID与横向和纵向不同
			var personNumStr = "";
			var persons = $("tr[aria-selected='true']");
			for(var i=0;i<persons.length;i++){
				var personNum = $("#dataGrid").jqGrid("getRowData",$(persons[i]).attr("id")).personNum;
				if(personNumStr.indexOf(personNum) == -1){
				   personNumStr += personNum + ",";
				}
			}
			if(personNumStr.indexOf(",")>-1){
			   personNumStr = personNumStr.substring(0,personNumStr.length-1);
			}
			
			if(personNumStr != ""){
				exportData.personIds = personNumStr;
			}else{
				shr.showWarning({
					message: jsBizMultLan.atsManager_scheduleShiftList_i18n_26
				});
				return false;
			}

		}
        var callback = function(psw) {
            openLoader(1, jsBizMultLan.atsManager_scheduleShiftList_i18n_45);
            shr.ajax({
                type: "post",
                url: _self.exportCommonParam(),
                data: $.extend(_self.assemExportData(exportData),{exportPrivteProtected: psw}),
                success: function (res) {
                    closeLoader();
                    //document.location.href = url;
                    shr.redirect(res.url, "");
                },
                error: function (res) {
                    shr.showError({message: jsBizMultLan.atsManager_scheduleShiftList_i18n_9});
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
	exportCommonParam : function(){
		var self = this;
		var url = shr.getContextPath() + shr.dynamicURL + "?method=exportToExcel";
        var uipk = "com.kingdee.eas.hr.ats.app.team.ScheduleShift.list";
		var filterItems = self.getQuickFilterItems();
		var sorder =   $('#dataGrid').jqGrid('getGridParam', 'sortorder') || "";
		var sordName = $('#dataGrid').jqGrid('getGridParam', 'sortname') || "";

		//标题
		if(self.showType == 0){
		   url += "&title="+encodeURIComponent(jsBizMultLan.atsManager_scheduleShiftList_i18n_13);
		   url = url + '&rows=10000&page=0&uipk=' + uipk + "&showType=0" + "&sidx=" + sordName + "&sord=" + sorder + "&transverse=1&billId=" + encodeURIComponent(self.billId);
	    }else if(self.showType == 1){
		   url += "&title="+encodeURIComponent(jsBizMultLan.atsManager_scheduleShiftList_i18n_54);
		   url = url + '&rows=10000&page=0&uipk=' + uipk + "&showType=1" + "&sidx=" + sordName + "&sord=" + sorder + "&transverse=0&billId=" + encodeURIComponent(self.billId);
		}else{
			  url += "&title="+encodeURIComponent(jsBizMultLan.atsManager_scheduleShiftList_i18n_34);
		  	 url = url + '&rows=10000&page=0&uipk=' + uipk + "&showType=2" + "&sidx=" + sordName + "&sord=" + sorder + "&transverse=0&billId=" + encodeURIComponent(self.billId);
		}
		//如果存在高级搜索的条件，则拼上条件。
		if(filterItems){
			url += "&filterItems=" + encodeURIComponent(filterItems);
		}
		return url;
	},
	initSearchLabel: function(){
		var divHtml = '<div data-ctrlrole="labelContainer">'
			+ '<div class="col-lg-4">'
			+	'<div class="field_label" title="'
			+ jsBizMultLan.atsManager_scheduleShiftList_i18n_43
			+ '">'
			+ jsBizMultLan.atsManager_scheduleShiftList_i18n_43
			+ '</div>'
			+ '</div>'				
			+ '<div class="col-lg-6 field-ctrl">'
	        + '<div class="ui-text-frame"><input id="personNumber" class="block-father input-height" type="text" name="personNumber" validate="" '+'value="" placeholder="" dataextenal="" ctrlrole="text" style="width: 276px;"></div>'
			+	'</div>'
			+	'<div class="col-lg-2 field-desc"></div>'
			+ '</div>"';
		var divLabelObj = $(divHtml);
		divLabelObj.insertAfter($("div[data-ctrlrole='labelContainer']")[0]);
		$("div[class^='col-lg-2']").css({width:"0%"});
		$(".col-lg-4").css({width: "8%"});
	}
	,turnShiftAddAction:function(){
    	workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_TURN);
		workShiftStrategy.arrangeWorkShift();
	}
    /*
	 * 班次排班
	 */
	,shiftSchedulingAction:function(){
		workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_SCHEDULE);
		workShiftStrategy.arrangeWorkShift();
	}
	,arrangeByCopyWorkShiftAction:function(){
		workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_COPY_SELF);
		workShiftStrategy.arrangeWorkShift();
	}
	,saveAction:function(){
		workShiftStrategy.save();
	}
	,batchAssignmentAction:function(){
		var that = this;
		var hrOrgObj = workShiftStrategy.getHrOrgUnit();
		if(hrOrgObj.length > 1){
			atsCommonUtile.showWarning(jsBizMultLan.atsManager_scheduleShiftList_i18n_25);
			return;
		}
		var serviceId = shr.getUrlRequestParam("serviceId");
		var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.ScheduleBatchAssigment"
		url += '&serviceId='+encodeURIComponent(serviceId);
		var selectedPersons = that.getSelectedPerson().map(function(one){
			return {id:one.id,name:one.name,"person.number":one.personNum};
		})
		atsGlobalDataCarrier.setData("SCHEDULE_BATCH_ASSIGMENT",{hrOrgObj:hrOrgObj[0],persons:atsArrayUtile.deleteRepeat(selectedPersons,"person.number")});
		$("#iframe1").attr('src',url);
		$("#iframe1").dialog({
	 		modal: true,
			width: 1250,
			minWidth: 800,
			height: 650,
			minHeight: 332,
			title: jsBizMultLan.atsManager_scheduleShiftList_i18n_24,
			open: function(event, ui) {},
			close: function(){
				that.doUpdate(hrOrgObj);
			}
		});
		$("#iframe1").attr("style", "width:1200px;height:600px;");
		$("#iframe1").attr("scrolling","no");
	}
	,doUpdate : function(hrOrgObj){
		var that = this;
		var batchAssigmentInfo = atsGlobalDataCarrier.getData("SCHEDULE_BATCH_ASSIGMENT");
		if(!batchAssigmentInfo){
			return;
		}
		if(!batchAssigmentInfo.rangeSetting){
			
			if(!hrOrgObj[0]){
				atsCommonUtile.showWarning(jsBizMultLan.atsManager_scheduleShiftList_i18n_22);
				return;
			}
			var rangeSetting = {
				hrOrgUnitID : hrOrgObj[0] && hrOrgObj[0].id,
				beginDate:workShiftStrategy.getBeginDate(),
				endDate: workShiftStrategy.getEndDate()
			}
			if(that.showType == that.HORIZONTAL_SHOW){
				rangeSetting.needUpdatePersonAndDate = that.getSelectedPerson().map(function(person){
					return {personNum: person.personNum,attendDate:person.attendDate};
				})
			}else{
				rangeSetting.personNums = that.getSelectedPerson().map(function(person){
					return person.personNum;
				})
			}
			batchAssigmentInfo.rangeSetting = rangeSetting;
		}
		var cleanShift =$(window.frames["iframe1"].document).find("#cleanShift").is(":checked") ;
		if(cleanShift && batchAssigmentInfo.updateFields){
			delete batchAssigmentInfo.updateFields.defaultShiftID;
			delete batchAssigmentInfo.updateFields.shiftTypeID;
		}
		batchAssigmentInfo.rangeSetting.cleanShift = cleanShift;
		workShiftStrategy.updateSchedule(that,batchAssigmentInfo);
	}
	,getSelectedPerson : function(){
		var that = this;
		var selectedPerson = [];
		var personNum;
		var id;
		var name;
		$("#dataGrid tr[aria-selected=true]").each(function(){
			personNum = $(this).children("[aria-describedby='dataGrid_proposer_number']");
			personNum.length > 0 || (personNum = $(this).children("[aria-describedby='dataGrid_personNum']"));
			id = $(this).children("[aria-describedby='dataGrid_proposer_id']");
			id.length > 0 || (id = $(this).children("[aria-describedby='dataGrid_personId']"));
			name = $(this).children("[aria-describedby='dataGrid_proposer_name']");
			name.length > 0 || (name = $(this).children("[aria-describedby='dataGrid_personName']"));
			selectedPerson.push({
				"id": id.text(),
				"personNum": personNum.text(),
				"name": name.text(),
				"attendDate" : $("#dataGrid").jqGrid("getCell", this.id, "attendDate")
			});
		});
		return selectedPerson;
	},
	queryGrid: function() {
		var _self = this;
		var $grid = $(this.gridId);
		_self.setFastFilterMap();
		this.setGridTreeParam();
		this.setGridCustomParam();
		this.setBotpFilterItems($grid);
		
		this.queryFastFilterGrid();
		
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
			$grid.jqGrid("option", "fastFilterItems", JSON.stringifyOnce(fastFilterItems));
		}

		//seniorFilter
		var advancedFilter = this.getAdvancedFilterItems();
		if(_self.fastFilterMap && _self.fastFilterMap.fastFilterItems && _self.isReturn){
			advancedFilter = _self.fastFilterMap.fastFilterItems.advancedFilter;			
		}
		if(advancedFilter){
			$grid.jqGrid("option", "advancedFilter", JSON.stringify(advancedFilter));
		}else{
			$grid.jqGrid("option", "advancedFilter", null);
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
		// reload
		if(this.isFirstTimeLoad > 0){
			$grid.jqGrid("reloadGrid");
		}else{
			this.isFirstTimeLoad  = this.isFirstTimeLoad + 1;
		}	
		var filtertype = 'normal';
		var filterValue = filterItems;
		if(this.getQuickFilterItems()){
			filtertype = 'QuickFilter';
			filterValue = this.getQuickFilterItems();
		}
		if(this.getCustomFilterItems()){
			filtertype = 'CustomFilter';
			filterValue = this.getCustomFilterItems();
		}
		var text = {id:this.uipk,text:this.title,filtertype:filtertype,filter:filterValue};
		var value = {type:2,msg:text};
		shr.operateLogger(value);
	}
	
});
//从url中获取某个参数
	function GetQueryString(value)
	{	
		var items = shrDataManager.pageNavigationStore.getDatas();
		if(items.length >= 3){
			 index = items.length - 2; 
			 var reg = new RegExp("(^|&)"+ value +"=([^&]*)(&|$)");
			 var r = items[index].url.split("?")[1].match(reg);
			 if(r!=null) return unescape(r[2]); 
		}
		return null;

	}
/**
 * 纠正undefined
 * @param {} value
 * @return {String}
 */
function correctValue(value){
	if(value == undefined || value == null){
		return "";
	}
	else{
		return value;
	}
}

/**
 * function：日期检验校验：页面填充的开始日期和结束日期不能超过一个月
 * 
 */
function checkBeginAndEndDate(){
	var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
	var endDate = atsMlUtile.getFieldOriginalValue("endDate");
	var beginDate_01 = new Date(beginDate.replace(/-/g, "/"));
	var endDate_01  = new Date(endDate.replace(/-/g, "/"));
	beginDate_01.setMonth(beginDate_01.getMonth() + 1);
	if(endDate_01.getTime() > beginDate_01.getTime()){
		shr.showWarning({message: jsBizMultLan.atsManager_scheduleShiftList_i18n_14});
		return false;
	}
	else{
		return true;
	}
}
/**
 * function：横向显示当选中行数据时,获得实体的值
 * Horizontal and Vertical Grid

 */
function getHorizontalValue(rowid){
	var objectEntry = {personNum:null,personName: null,attendDate: null,dayType: null,shiftId: null,shiftName: null};
	objectEntry.personNum = $("#dataGrid").jqGrid("getCell", rowid, "proposer_number");
	objectEntry.personName = $("#dataGrid").jqGrid("getCell", rowid, "proposer_name");
	objectEntry.attendDate = $("#dataGrid").jqGrid("getCell", rowid, "attendDate");
	objectEntry.dayType = $("#dataGrid").jqGrid("getCell", rowid, "dayType");
	objectEntry.shiftId = $("#dataGrid").jqGrid("getCell", rowid, "id");
	objectEntry.shiftName = $("#dataGrid").jqGrid("getCell", rowid, "defaultShift_name");
	objectEntry.hrOrgUnitName = $("#dataGrid").jqGrid("getCell", rowid, "hrOrgUnit_name");
	objectEntry.hrOrgUnitId = $("#dataGrid").jqGrid("getCell", rowid, "hrOrgUnit_id");
	return objectEntry;
}


/**
 * function：横向显示当选中行数据时,获得实体的值
 */
function  getVerticalValue(rowid,cellcontent,strDate){
	var objectEntry = {personNum:null,personName: null,attendDate: null,dayType: null,shiftId: null,shiftName: null};
	objectEntry.personNum = $("#dataGrid").jqGrid("getCell", rowid, "personNum");
	objectEntry.personName = $("#dataGrid").jqGrid("getCell", rowid, "personName");
	var groupValue = getGroupValue(cellcontent);
	
	objectEntry.attendDate = strDate;
	objectEntry.dayType =  groupValue.dayType
	objectEntry.shiftId = "";
	objectEntry.shiftName = groupValue.shiftName;
	return objectEntry;
}

/**
 * _self：td列对象；value：传递过来的值对象：类似于[休息日]轮班1
 * flag：是否对当前列颜色标识
 */
function getGroupValue(value){
	var object = {dayType : null,shiftName: null };
	if (value.substring(0, jsBizMultLan.atsManager_scheduleShiftList_i18n_2.length)
		== jsBizMultLan.atsManager_scheduleShiftList_i18n_2) {
		object = {dayType : jsBizMultLan.atsManager_scheduleShiftList_i18n_39,
			shiftName : value.substring(jsBizMultLan.atsManager_scheduleShiftList_i18n_2.length)}
	}
	else if (value.substring(0, jsBizMultLan.atsManager_scheduleShiftList_i18n_0.length)
		== jsBizMultLan.atsManager_scheduleShiftList_i18n_0) {
		object = {dayType : jsBizMultLan.atsManager_scheduleShiftList_i18n_10,
			shiftName : value.substring(jsBizMultLan.atsManager_scheduleShiftList_i18n_0.length)}
	}
	else {
		if (value.indexOf(jsBizMultLan.atsManager_scheduleShiftList_i18n_1) > -1) {
			object = {dayType : jsBizMultLan.atsManager_scheduleShiftList_i18n_12,
				shiftName : value.substring(jsBizMultLan.atsManager_scheduleShiftList_i18n_1.length)}
		}
		else{
		}
	}
	return object;
	
}




function colorFormatter(){
	var value = "";
	var trArr = $("#dataGrid tr");
	for(var i=1;i<trArr.length;i++){
	   $(trArr[i]).children("td").each(function(index){
	       if(index >= 5){
	       	  value = $(this).text();
	          if(value != undefined && value != null && value.length > 0){
			    $(this).text(getColorTitle(this,value,true));
		      }
	       }
	   });
	
	}
}
/**
 * _self：td列对象；value：传递过来的值对象：类似于[休息日]轮班1
 * flag：是否对当前列颜色标识
 */
function getColorTitle(_self,value,flag){
	$(_self).removeClass('gray-color');
	$(_self).removeClass('litterGreen-color');
	$(_self).removeClass('cell-select-color');
	if (value.substring(0, jsBizMultLan.atsManager_scheduleShiftList_i18n_2.length)
		== jsBizMultLan.atsManager_scheduleShiftList_i18n_2) {
		if(flag){
			$(_self).addClass('gray-color');
		}
		return value.substring(jsBizMultLan.atsManager_scheduleShiftList_i18n_2.length);
	}
	else if (value.substring(0, jsBizMultLan.atsManager_scheduleShiftList_i18n_0.length)
		== jsBizMultLan.atsManager_scheduleShiftList_i18n_0) {
		if(flag){
			$(_self).addClass('litterGreen-color');	
		}
		return value.substring(jsBizMultLan.atsManager_scheduleShiftList_i18n_0.length);
	}
	else {
		if (value.indexOf(jsBizMultLan.atsManager_scheduleShiftList_i18n_1) > -1) {
			return value.substring(jsBizMultLan.atsManager_scheduleShiftList_i18n_1.length);
		}
		else{
			return value;
		}
	}
}
