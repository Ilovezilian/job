var sidValue = [];
var orgLongNum="";
var sumType = "1";
shr.defineClass("shr.ats.HolidayResultSumList", shr.ats.AtsBatchTipList, {
    reportUipk :   "com.kingdee.eas.hr.ats.app.HolidayResultSummary.list" ,
    rowNumPerPage : 15,
    gridId : "#reportGrid",
	initalizeDOM : function () {
		var that = this;
//		that.processF7ChangeEvent();
//		that.clearAdminOrgUnitVal();
//		that.initFilterDate(); 
		that.renderDataGrid();
        this.initalSearch();
        shr.ats.HolidayResultSumList.superClass.initalizeDOM.call(this);
		
			// 快速查询添加事件
		$('#searcher').shrSearchBar('option', {
			afterSearchClick: this.queryGridByEvent
		});
		
		$("#microToolbar").parent().prev().remove();
	//	jQuery("#grid").jqGrid('setFrozenColumns');initCreateDefaultView
	    that.initSearchLabel();
	    
	    $('#operationDialog').append("<div id='calendar_info'></div>");
	    if( $('[title="' + jsBizMultLan.atsManager_holidayResultSumList_i18n_36 + '"]').length >= 2 ){
	     $($('[title="' + jsBizMultLan.atsManager_holidayResultSumList_i18n_36 + '"]')[1]).parent().remove();
	    }else{
	    $('[title="' + jsBizMultLan.atsManager_holidayResultSumList_i18n_36 + '"]').parent().remove();
	    }
	    //隐藏汇总周期结束日期，只查一个月
	    $("#attendPeriod-dateend").closest('[class="items-wapper"]').hide();
	    $("#attendPeriod-dateend").closest('[class="items-wapper"]').prev().hide();
	    $("#attendPeriod-dateselect").shrSelect('option',{
	    	onChange :function(){
	    		 var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
	    		$('#attendPeriod-dateend').shrDateTimePicker('setValue',currentdate);
	    	}
	    	
	    })
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
  	 //设置高级查询 
	initalSearch : function(){

		$('#microToolbar').parent().prepend($('<div class="span6"><div id="searcher" class="pull-right"/></div>'));
//		$('<div class="span6"><div id="searcher" class="pull-right"/></div>').insertAfter($('#microToolbar').parent());
		
		var searcherFields = [];
		searcherFields[0] = {columnName:"PERSON.FNAME_L2",label:jsBizMultLan.atsManager_holidayResultSumList_i18n_35};
		searcherFields[1] = {columnName:"PERSON.FNUMBER",label:jsBizMultLan.atsManager_holidayResultSumList_i18n_42};
		
		var options = {
			gridId: "reportGrid",
			uipk: "com.kingdee.eas.hr.ats.app.AttendanceResultSumList",
			query: "" ,
			fields :searcherFields,
			propertiesUrl: shr.getContextPath()+'/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttendanceResultSumList&method=getProperField'
		};
	
		$("#searcher").shrSearchBar(options);
		$("#searcher").children().eq(1).css("width","75px");
		$("#searcher").parent().css("margin-left","250px");
		$(".group-panel").css({"border":"0","padding-left":"0px"});
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
	,queryAction : function () {
		var self = this;
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attendPeriod","errorMessage":jsBizMultLan.atsManager_holidayResultSumList_i18n_20});
		if(!dateRequiredValidate)
			return;
		if($("#calendar_info").html() != ""){
			$("#calendar_info").dialog("close");
			$("#calendar_info").empty();
		}
					  
		
		if(!self.verifyStartTime()){
			shr.showInfo({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_13, hideAfter: 3});
			return ;
		}
		if(!self.verifyEndTime()){
		   	shr.showError({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_12, hideAfter: 3});
			return ;
		}
		var filterItems = self.getFastFilterItems();
		
		
		if(filterItems["add"] == ""){
			filterItems["add"] = null;
		}
		
		//R20190625-2369保存方案后，其它条件设置的条件被清空
		//需把视图的filterItem其他条件name="add"改成name="advancedFilter" 
		var advancedFilterItems = self.getAdvancedFilterItems();
		if(advancedFilterItems != undefined){
			filterItems["add"] = advancedFilterItems;
		}
		
		
		if (filterItems) {
			filterItems =JSON.stringify(filterItems);
		}
		var quickFilterItems = self.getQuickFilterItems();
		if( quickFilterItems == undefined)
		{ 
			quickFilterItems = "";
		}

		if( filterItems == undefined)
		{ 
			fastfilter = "";
		}
		/*
		$("#reportGrid").jqGrid('setGridParam', {
			datatype : 'json',
			postData : {
				'beginDate1' : $("#beginDate").val(),
				'endDate1' : $("#endDate").val(),
				'orgLongNum1' :orgLongNum,  
				'proposerName1' : $("#proposer").val(),
				'NewRearch'   : 'newRearch'  ,
				'filterItems1' :filterItems,
				'page' : 1
			},
			page : 0
		});
		*/
		$("#reportGrid").jqGrid('setGridParam', {
			datatype : 'json',
			postData : {
				'hrOrgUnit' : $("#hrOrgUnit_el").val(),
				'beginDate' : atsMlUtile.getFieldOriginalValue("beginDate"),
				'endDate' : atsMlUtile.getFieldOriginalValue("endDate"),
				'orgLongNum' :orgLongNum,  
				'proposerName' : $("#proposer").val(),
				'NewRearch'   : 'newRearch'  ,
				'filterItems' :filterItems,
				'quickFilterItems':quickFilterItems,
				'sumType' : sumType,
				'page' : 1,
				'personNumbers' : $("#personNumber").val(),
				"period" : atsMlUtile.getFieldOriginalValue("attendPeriod-datestart"),
				"rows":self.rowNumPerPage
			},
			page : 0
		});
		$("#reportGrid").trigger("reloadGrid");
	}
	,verifyEndTime : function(){
	  var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		var curDate = new Date();
		var curDateY = curDate.getFullYear();
		var curDateM = curDate.getMonth()+1;
		curDateM = curDateM<10?"0"+curDateM:curDateM;
		var curDateD = curDate.getDate();
		curDateD = curDateD<10?"0"+curDateD:curDateD;
		var curDateStr = curDateY+"-"+curDateM+"-"+curDateD;
		if(endDate > curDateStr){
			return false;
		}else{
			return true;
		}
	
	}
	,verifyStartTime : function(){
		var beginDate =  atsMlUtile.getFieldOriginalValue("beginDate"),endDate = atsMlUtile.getFieldOriginalValue("endDate");
		if(beginDate > endDate){
			return false;
		}else{
			return true;
		}
	},
	 
	initFilterDate : function () {
		var curDate = new Date();
		var curDateY = curDate.getFullYear();
		var curDateM = curDate.getMonth()+1;
		curDateM = curDateM<10?"0"+curDateM:curDateM;
		var curDateD = curDate.getDate();
		curDateD = curDateD<10?"0"+curDateD:curDateD;
		var curDateStr = curDateY+"-"+curDateM+"-"+curDateD;
		var curDateStrPre = curDateY+"-"+curDateM+"-"+"01";
		atsMlUtile.setTransDateTimeValue("beginDate",curDateStrPre);
		atsMlUtile.setTransDateTimeValue("endDate",curDateStr);
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
	renderDataGrid : function () {
		var self = this,
		schemaId = shr.getUrlRequestParam("schemaId"),
//		alert("schemaId" +schemaId);
		periodId = shr.getUrlRequestParam("periodId");
//		alert("periodId" +periodId);
		self.remoteCall({
			method : "getGridColModel",
			param : {
				"schemaId" : schemaId,
				"periodId" : periodId,
				"tempTableName" : shr.getUrlRequestParam("tempTableName"),
				"hrOrgUnitId":$.shrFastFilter.getFastFilterItems().hrOrgUnit.values
				
			},
			
			success : function (reponse) {
				//self.initAdvQueryPanel();
				self.doRenderDataGrid(reponse);
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

   doRenderDataGrid : function (reponse) {
   	
   		$('#datagrid').empty();
		$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>'); // 表头是可变的，所以要动态生成节点
		
		var self = this,
		table = $("#reportGrid"),
		beginDate = atsMlUtile.getFieldOriginalValue("beginDate"),
		endDate = atsMlUtile.getFieldOriginalValue("endDate"),
		proposerName = $("#proposer").val();
		var colNames = reponse.colNames;
		var colModel = reponse.colModel;
//		var filterItems = self.getQuickFilterItems();
		var filterItems = self.getFastFilterItems();
		if (filterItems) {
			filterItems =JSON.stringify(filterItems);
		}
		var quickFilterItems = self.getQuickFilterItems();
		if( quickFilterItems == undefined)
		{ 
			quickFilterItems = "";
		}

		if( filterItems == undefined)
		{ 
			fastfilter = "";
		}
		postData = {
				'hrOrgUnit' : $("#hrOrgUnit_el").val(),
				'beginDate' : beginDate,
				'endDate' : endDate,
				'orgLongNum' : orgLongNum,
				'proposerName' : proposerName,
				'filterItems' :filterItems,	
				'quickFilterItems':quickFilterItems,
				'page' : 1,  
				'personNumbers' : $("#personNumber").val(),
				"period" : atsMlUtile.getFieldOriginalValue("attendPeriod-datestart")
			};
	//	defaultSortname = reponse.defaultSortname,
		var url = self.getGridDataRequestURL();        
		var	options = {
			url : url ,
			datatype : "json",
			mtype: "POST",
			multiselect : true,
			rownumbers : false,
			colNames : colNames,
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			// pager : '#gridPager1',
			postData: postData ,
			height : 'auto',
			rowList : [15,30,50,100],
			recordpos : 'left',
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			pginput : true,
			shrinkToFit :reponse.colModel.length>10?false:true,
			viewrecords : true,
			//cellEdit:true,
      cellsubmit:"clientArray" ,	
			sortname : "personNumber",
			//caption: "Frozen Header",
			customPager : '#gridPager1',
            pagerpos:"center",
			pginput:true, 
			pginputpos:"right",
			onSelectRow: function(id){ 
				//onSelectRow : function(id){
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
			$("#microToolbar").parent().removeClass("span3").addClass("span12")
			$("#gridPager1").parent().css({"position":"relative"})  
			$("#gridPager1").addClass("shrPage").css({
				"position":"absolute",
				"top":"-25px",
				"right":"0px",
				"background":"#FFF"
			})
	    // if ($.isFunction(jsBinder.gridLoadComplete)) {
	    // 	jsBinder.gridLoadComplete.call(this, ret);
	    // }
			// self.handleMicroToolbarInfo();
		};
		// clear table
		table.html();
		table.jqGrid(options);
		//$.extend(options, jqGridParm);
	  jQuery("#reportGrid").jqGrid(options);
		jQuery('#reportGrid').jqGrid('setFrozenColumns');
	},
	handleMicroToolbarInfo : function () {

		var self = this;
		var html = "";
		//html += "<div id="gridPager1234"  >";
		//html += "<div id="pg_gridPager1234" >";
		html += "<div class='shrPage page-Title' >";
		html += "<span id='gripage' class='ui-paging-info' style='cursor: default;display: inline-block;font-size: 13px;padding: 2px 5px 0 0;'></span>";
		html += "<span id='prevId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-prev'></span>";
		html += "<span id='nextId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-next'></span></div>";
		
		html += '<span id="rowNum" style="display:none"><select id="selectRowNum" class="ui-pg-selbox" style="float: right;" role="listbox">';
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

		//页码 (1-4)/4
		self.updatePageEnable();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
		$("#gridPager1").hide();
		 var ids=jQuery("#reportGrid").jqGrid('getDataIDs'); 
		  
         var rowdata=jQuery("#reportGrid").jqGrid('getRowData',ids[0]);  
		
         $("#gbox_reportGrid").css("margin-top","30px");
          $("#microToolbar").parent().css("width","100%");
		shr.setIframeHeight();
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
		//this.verifyStartTime();
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
		$('#gripage').hide();
		$('#rowNum').show();
		
		var currentViewPage = shr.getCurrentViewPage();
		$("#selectRowNum").change(function() {
			var self = this;
			var reRows = parseInt($("#selectRowNum option:selected").text());
			currentViewPage.rowNumPerPage = reRows;
			currentViewPage.renderDataGrid();
//			jQuery("#reportGrid").trigger("reloadGrid");
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
  	exportToExcelAction : function () {
		var self = this;
	
		var url = self.exportCommonParam();
		
		var filterItems = self.getFastFilterItems();
		if (filterItems) {
			filterItems =JSON.stringify(filterItems);
		}
		var quickFilterItems = self.getQuickFilterItems();
		if( quickFilterItems == undefined)
		{ 
			quickFilterItems = "";
		}

		if( filterItems == undefined)
		{ 
			fastfilter = "";
		}
		postData = {
				'hrOrgUnit' : $("#hrOrgUnit_el").val(),
				'beginDate' : beginDate,
				'endDate' : endDate,
				'orgLongNum' : orgLongNum,
				'proposerName' : proposerName,
				'filterItems' :filterItems,	
				'quickFilterItems':quickFilterItems,
				'page' : 1,
				'personNumbers' : $("#personNumber").val(),
				"period" : atsMlUtile.getFieldOriginalValue("attendPeriod-datestart"),
				"sidx" :"personNumber",
				"sord" :"asc"
			};
        var callback = function(psw) {
            openLoader(1, jsBizMultLan.atsManager_holidayResultSumList_i18n_44);
                shr.ajax({
                    type: "post",
                    url: url,
                    data: $.extend(postData,{exportPrivteProtected: psw}),
                    success: function (res) {
                        var fileUrl = res.url;
                        closeLoader();
                        document.location.href = fileUrl;
                    },
                    error: function (res) {
                        shr.showError({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_7});
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
	exportCurrentAction: function(){
		var self = this;
		var sid=[];
		var Exchange_json=[];
		sid = $("#reportGrid").jqGrid("getSelectedRows");
		for ( var i in sid)
		{
		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
			var item = sid[i];
			var data = $("#reportGrid").jqGrid("getRowData", item);
			
			var personId=data["personId"] ;
			var adminOrgUnit=data["adminOrgUnitId"] ;
			Exchange_json.push({'personId':personId,'adminOrgUnit':adminOrgUnit});
			//param:{beginDate:beginDate ,endDate:endDate,adminOrgId:adminOrgId,proposerId:proposerId,PersonJson:PersonJson},
		}		
		
		var filterItems = self.getFastFilterItems();
		if (filterItems) {
			filterItems =JSON.stringify(filterItems);
		}
		var quickFilterItems = self.getQuickFilterItems();
		if( quickFilterItems == undefined)
		{ 
			quickFilterItems = "";
		}

		if( filterItems == undefined)
		{ 
			fastfilter = "";
		}
		
			
		if(Exchange_json.length>0) {
            var PersonJson = $.toJSON(Exchange_json);
            postData = {
                'hrOrgUnit': $("#hrOrgUnit_el").val(),
                'orgLongNum': orgLongNum,
                'filterItems': filterItems,
                'quickFilterItems': quickFilterItems,
                'page': 1,
                'personNumbers': $("#personNumber").val(),
                "period": atsMlUtile.getFieldOriginalValue("attendPeriod-datestart"),
                "sidx": "personNumber",
                "sord": "asc",
                "PersonJson": PersonJson

            };
            var url = self.exportCommonParam();
            var callback = function(psw) {
                openLoader(1, jsBizMultLan.atsManager_holidayResultSumList_i18n_44);
                if (sid) {
                    shr.ajax({
                        type: "post",
                        url: url,
                        data: $.extend(postData,{exportPrivteProtected: psw}),
                        success: function (res) {
                            var fileUrl = res.url;
                            closeLoader();
                            document.location.href = fileUrl;
                        },
                        error: function (res) {
                            shr.showError({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_7});
                            closeLoader();
                        }
                    });
                }
            }
            if(window.isShrSensitiveRuleOpen) {
                fieldSensitiveService.setExportPsw(callback);
            }else{
                callback();
            }
		}else{
			shr.showWarning({
				message: jsBizMultLan.atsManager_holidayResultSumList_i18n_18
			});
		}
	},exportCommonParam:function(){
		var self = this;
		var filterItems = JSON.stringify(self.getFastFilterItems());
		var sorder =   $('#reportGrid').jqGrid('getGridParam', 'sortorder') ;
		var sordName = $('#reportGrid').jqGrid('getGridParam', 'sortname') ;
		if( filterItems == undefined)
		{ 
			filterItems = "" ;
		}
		beginDate = atsMlUtile.getFieldOriginalValue("beginDate"),
		endDate = atsMlUtile.getFieldOriginalValue("endDate"),
		proposerName = $("#proposer").val(),
		
		$grid = $('#reportGrid'),
		
		url = this.dynamicPage_url + "?method=exportToExcel" + "&uipk=" + this.reportUipk;  
		
		return url ;	
	}
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
			if (data["salaryStatusId"] == jsBizMultLan.atsManager_holidayResultSumList_i18n_40)
			{
				shr.showWarning({
					message : data["personName"] + jsBizMultLan.atsManager_holidayResultSumList_i18n_37
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
					shr.showInfo({ message:jsBizMultLan.atsManager_holidayResultSumList_i18n_1});
				//    closeLoader();
					//window.parent.$("#operationDialog").dialog('close');
				    jQuery('#reportGrid').jqGrid("reloadGrid");	
				}else {
				shr.showError({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_14});
				}
			} ,
			error:function(res){
				closeLoader();
				shr.showInfo( {message :jsBizMultLan.atsManager_holidayResultSumList_i18n_14});
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
					message : jsBizMultLan.atsManager_holidayResultSumList_i18n_19
			});
		}
		for ( var i in sid){
		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
			var item = sid[i];
			var data = $("#reportGrid").jqGrid("getRowData", item);
			if (data["salaryStatusId"] == jsBizMultLan.atsManager_holidayResultSumList_i18n_29)
			{
				shr.showWarning({
					message : data["personName"] + jsBizMultLan.atsManager_holidayResultSumList_i18n_30
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
								tip =jsBizMultLan.atsManager_holidayResultSumList_i18n_2;
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
							    tip +=jsBizMultLan.atsManager_holidayResultSumList_i18n_3;
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
							tip = tip.substring(0,tip.length-2)+jsBizMultLan.atsManager_holidayResultSumList_i18n_0;
							shr.showInfo({message :tip}); 
							return ;
						}	
						shr.showConfirm(shr.formatMsg(jsBizMultLan.atsManager_holidayResultSumList_i18n_16,[beginDate+"--"+endDate]),
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
					shr.showInfo({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_17});

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
					$("#operationDialog").empty();
					$("#operationDialog").dialog({
						title: jsBizMultLan.atsManager_holidayResultSumList_i18n_46,
						width:650,
						height:350,
						modal: true,
						resizable: true,
						position: {
							my: 'center',
							at: 'top+50%',
							of: window
						} 
					,buttons: [{
							text: jsBizMultLan.atsManager_holidayResultSumList_i18n_26,
							click: function() {
								_self.saveDataSalaryAction();
							}
						},{
							text: jsBizMultLan.atsManager_holidayResultSumList_i18n_8,
							click: function() {
								$(this).dialog( "close" );
							}
						}]
					});
					/* var row_fields_work = '<div  class="row-fluid row-block row_field">'					  
					  + '<div class="spanSelf"><span class="cell-RlStdType">请选择转资期间</span> </div>'
					  +'<div class="spanSelf"><span class="cell-RlStdType"><input type="text" name="setSalaryPeriod" value="" width="30" class="input-height cell-input" validate="{required:true} " maxlength="10"/></span></div>'
					  +'</DIV>'  */
					  var row_fields_work =''
					  +'<div class="photoState" style="margin-top:50px;margin-left:30px;"><table width="100%"><tr>'
					  +'<td width="30%" style="color: #999999;">'
						  + jsBizMultLan.atsManager_holidayResultSumList_i18n_22
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
						+ jsBizMultLan.atsManager_holidayResultSumList_i18n_33
						+ '</td>'
					  	  +'<td width="15.2%"></td>'
					      +'<td width="10%" ><input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></td>'
						  +'<td width="5.2%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_holidayResultSumList_i18n_15
						+ '</td>'
						  +'<td width="8%" style="color: #999999;"><input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td width="5.2%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_holidayResultSumList_i18n_43
						+ '</td>'
						  +'<td width="8%"><input type="text" name="time" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td width="5%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_holidayResultSumList_i18n_4
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
			shr.showInfo({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_48});
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
			shr.showInfo({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_31});
			return false;
		}
		if (periodMonth == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_32});
			return false;
		}
		if (times == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_5});
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
								tip =jsBizMultLan.atsManager_holidayResultSumList_i18n_47;
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
							    tip +=jsBizMultLan.atsManager_holidayResultSumList_i18n_50;
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
				shr.showInfo({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_49});
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
	},
	 initSearchLabel: function(){
		var divHtml = '<div data-ctrlrole="labelContainer">'
			+ '<div class="col-lg-4">'
			+	'<div class="field_label" title="'
			+ jsBizMultLan.atsManager_holidayResultSumList_i18n_42
			+ '">'
			+ jsBizMultLan.atsManager_holidayResultSumList_i18n_42
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
	},
	
	generateAction:function(){
		
		var self = this;
		var rows = $("#reportGrid").jqGrid("getSelectedRows");
		var personId = "";
		var id = "";
		var async = true;
		if(rows.length>0){
			var hasValidData = true;
			for(var i = 0;i<rows.length;i++){
				if($("#reportGrid").jqGrid("getRowData",rows[i])["FStatus"] != jsBizMultLan.atsManager_holidayResultSumList_i18n_28){
					hasValidData = false;
				}
				personId += $("#reportGrid").jqGrid("getRowData",rows[i])["personId"];
				id += rows[i];
				if(i<rows.length-1){
					personId += ",";
					id += ",";
				}
			}
			if(!hasValidData){
				shr.showWarning({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_23 + "<br>"
						+ jsBizMultLan.atsManager_holidayResultSumList_i18n_39});
    	    	return false;
			}
			async = false;
		}
		
		if(rows.length == 0){
			self.openDialog();
			return;
		}
		self.remoteCall({
			method : "generate",
			async: async,
			param : {
				"hrOrgUnit" : $.shrFastFilter.getFastFilterAllItems().hrOrgUnit.values,
				"periodId" : atsMlUtile.getFieldOriginalValue("attendPeriod-datestart"),
				"personId" : personId,
				"id":id
			},
			
			success :self.getBatchTipSuccessFun(self,self.queryAction)
		});
		
	}
	,deleteAction:function(){
		var self = this;
		var rows = $("#reportGrid").jqGrid("getSelectedRows");
		var id = "";
		if(rows.length>0){
			var hasValidData = false;
			for(var i = 0;i<rows.length;i++){
				if($("#reportGrid").jqGrid("getRowData",rows[i])["FStatus"] == jsBizMultLan.atsManager_holidayResultSumList_i18n_28){
					hasValidData = true
				}
				id += rows[i];
				if(i<rows.length-1){
					id += ",";
				}
			}
			if(!hasValidData){
				shr.showWarning({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_23});
    	    	return false;
			}
		}else{
			shr.showWarning({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_18});
    	    return false;
		}
		shr.showConfirm($.shrI18n.common.tips.deleteConfirm, function(){
		self.remoteCall({
			method : "delete",
			async: false,
			param : {
				"id" : id
			},
			success : self.getBatchTipSuccessFun(self,self.queryAction)
		});
	});
	}	
	,getPostData : function(){
		
		var postData = {};
		
		var self = this;
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attendPeriod","errorMessage":jsBizMultLan.atsManager_holidayResultSumList_i18n_20});
		if(!dateRequiredValidate)
			return;			  
		
		if(!self.verifyStartTime()){
			shr.showInfo({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_13, hideAfter: 3});
			return ;
		}
		if(!self.verifyEndTime()){
		   	shr.showError({message: jsBizMultLan.atsManager_holidayResultSumList_i18n_12, hideAfter: 3});
			return ;
		}
		var filterItems = self.getFastFilterItems();
		if (filterItems) {
			filterItems =JSON.stringify(filterItems);
		}
		var quickFilterItems = self.getQuickFilterItems();
		if( quickFilterItems == undefined)
		{ 
			quickFilterItems = "";
		}

		if( filterItems == undefined)
		{ 
			filterItems = "";
		}
		
		postData = {
					'filterItems' :filterItems,
					'quickFilterItems':quickFilterItems,
					'sumType' : sumType,
					'page' : 1,
					'personNumbers' : $("#personNumber").val(),
					"period" : atsMlUtile.getFieldOriginalValue("attendPeriod-datestart")
				};
		return postData;
	}
	,approveAction:function(){
		
		var self = this;
		var rows = $("#reportGrid").jqGrid("getSelectedRows");
		var personId = "";
		var id = "";
		if(rows.length>0){
			var hasValidData = false;
			for(var i = 0;i<rows.length;i++){
				if($("#reportGrid").jqGrid("getRowData",rows[i])["FStatus"] == jsBizMultLan.atsManager_holidayResultSumList_i18n_28){
					hasValidData = true
				}
				personId += $("#reportGrid").jqGrid("getRowData",rows[i])["personId"];
				id += rows[i];
				if(i<rows.length-1){
					personId += ",";
					id += ",";
				}
			}
			if(!hasValidData){
				shr.showWarning({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_23});
    	    	return false;
			}
		}
		
		var postData = self.getPostData();
		var otherData = {"hrOrgUnit" : $.shrFastFilter.getFastFilterAllItems().hrOrgUnit.values,
				"periodId" : atsMlUtile.getFieldOriginalValue("attendPeriod-datestart"),
				"personId" : personId,
				"id" : id};
		$.extend(postData, otherData);
		self.remoteCall({
			method : "approve",
			async: false,
			param : postData,
			
			success : self.getBatchTipSuccessFun(self,self.queryAction)
		});
		
	}
	,antiArrpoveAction:function(){
		
		var self = this;
		var rows = $("#reportGrid").jqGrid("getSelectedRows");
		var personId = "";
		var id = "";
		if(rows.length>0){
			var hasValidData = false;
			for(var i = 0;i<rows.length;i++){
				if($("#reportGrid").jqGrid("getRowData",rows[i])["FStatus"] == jsBizMultLan.atsManager_holidayResultSumList_i18n_38){
					hasValidData = true
				}
				personId += $("#reportGrid").jqGrid("getRowData",rows[i])["personId"];
				id += rows[i];
				if(i<rows.length-1){
					personId += ",";
					id += ",";
				}
			}
			if(!hasValidData){
				shr.showWarning({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_24});
    	    	return false;
			}
		}
		var postData = self.getPostData();
		var otherData = {"hrOrgUnit" : $.shrFastFilter.getFastFilterAllItems().hrOrgUnit.values,
				"periodId" : atsMlUtile.getFieldOriginalValue("attendPeriod-datestart"),
				"personId" : personId,
				"id" : id};
		$.extend(postData, otherData);
		
		self.remoteCall({
			method : "antiApprove",
			async: false,
			param :postData,
			success : self.getBatchTipSuccessFun(self,self.queryAction)
		});
		
	}
	,salaryAction:function(){
		
		var self = this;
		var rows = $("#reportGrid").jqGrid("getSelectedRows");
		var personId = "";
		var id = "";
		if(rows.length>0){
			var hasValidData = false;
			for(var i = 0;i<rows.length;i++){
				if($("#reportGrid").jqGrid("getRowData",rows[i])["FStatus"] == jsBizMultLan.atsManager_holidayResultSumList_i18n_38){
					hasValidData = true
					personId += $("#reportGrid").jqGrid("getRowData",rows[i])["personId"] + ",";
					id += rows[i]+ ",";
				}
			}
			if(id.length>0){
				id = id.substr(0,id.length-1);
				personId = personId.substr(0,personId.length-1);
			}
			if(!hasValidData){
				shr.showWarning({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_24});
    	    	return false;
			}
			if(rows.length!=id.split(",").length){
				shr.showWarning({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_45});
    	    	return false;
			}
		}
		
		//

					var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
					if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_6}); return ;};
					$("#calendar_info").empty();
					$("#calendar_info").next().remove();
					$("#calendar_info").dialog({
						title: jsBizMultLan.atsManager_holidayResultSumList_i18n_46,
						width:650,
						height:350,
						modal: true,
						resizable: true,
						position: {
							my: 'center',
							at: 'top+50%',
							of: window
						} 
					,buttons: [{
							text: jsBizMultLan.atsManager_holidayResultSumList_i18n_26,
							click: function() {
								var dialogSelf = $(this);
								var postData = self.getPostData();
								var otherData = {"hrOrgUnit" : $.shrFastFilter.getFastFilterAllItems().hrOrgUnit.values,
									"periodId" : atsMlUtile.getFieldOriginalValue("attendPeriod-datestart"),
									"salaryPeriod" : $('input[name=YEAR]').val()+"-"+$('input[name=MONTH]').val()+"-"+$('input[name=time]').val(),
									"personId" : personId,
									"id" : id};
								$.extend(postData, otherData);
			
								self.remoteCall({
									method : "salary",
									async : false,
									param : postData,
									success : self.getBatchTipSuccessFun(self,self.salaryCallBackAction)
								});
							}
						},{
							text: jsBizMultLan.atsManager_holidayResultSumList_i18n_8,
							click: function() {
								$(this).dialog( "close" );
							}
						}]
					});
					  var row_fields_work =''
					  +'<div class="photoState" style="margin-top:50px;margin-left:30px;"><table width="100%"><tr>'
					  +'<td width="30%" style="color: #999999;">'
						  + jsBizMultLan.atsManager_holidayResultSumList_i18n_10
						  + '</td>'
					  +'<td width="50%"><div id="setSalaryPeriod"></div></td>'
					  +'<td></td>'
					  +'</tr></table></div><br>'
					  +'<div><span></span></div>';	
					  $("#calendar_info").append(row_fields_work);
					  $("#calendar_info").css("margin","0px");
					  var datetimestart = atsMlUtile.getFieldOriginalValue("attendPeriod-datestart");
					  var startYear = datetimestart.split("-")[0];
					  var startMonth = datetimestart.split("-")[1];
					  var MonthDay = new Date(new Date(startYear,startMonth,1).getTime()-1000*60*60*24).getDate();
					  var beginDate = datetimestart + "-01";
					  var endDate = datetimestart + "-"+ MonthDay;
					  var selectPeriod=atsMlUtile.getFieldOriginalValue("attendPeriod-datestart").replace("-","")+"("+beginDate+" -- " + endDate +")";
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
						+ jsBizMultLan.atsManager_holidayResultSumList_i18n_33
						+ '</td>'
					  	  +'<td width="15.2%"></td>'
					      +'<td width="10%" ><input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></td>'
						  +'<td width="5.2%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_holidayResultSumList_i18n_15
						+ '</td>'
						  +'<td width="8%" style="color: #999999;"><input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td width="5.2%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_holidayResultSumList_i18n_43
						+ '</td>'
						  +'<td width="8%"><input type="text" name="time" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td width="5%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_holidayResultSumList_i18n_4
						+ '</td>'
						  +'<td></td></tr></table></div>';					  
					$('#calendar_info').append(row_fields_work);
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
		
		//
		
		
	}
	,antiSalaryAction:function(){
		
		var self = this;
		var rows = $("#reportGrid").jqGrid("getSelectedRows");
		var personId = "";
		var id = "";
		if(rows.length>0){
			var hasValidData = false;
			for(var i = 0;i<rows.length;i++){
				if($("#reportGrid").jqGrid("getRowData",rows[i])["FStatus"] == jsBizMultLan.atsManager_holidayResultSumList_i18n_41){
					hasValidData = true
				}
				personId += $("#reportGrid").jqGrid("getRowData",rows[i])["personId"];
				id += rows[i];
				if(i<rows.length-1){
					personId += ",";
					id += ",";
				}
			}
			if(!hasValidData){
				shr.showWarning({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_25});
    	    	return false;
			}
		}
		
		var postData = self.getPostData();
		var otherData = {"hrOrgUnit" : $.shrFastFilter.getFastFilterAllItems().hrOrgUnit.values,
				"periodId" : atsMlUtile.getFieldOriginalValue("attendPeriod-datestart"),
				"personId" : personId,
				"id" : id};
		$.extend(postData, otherData);
		
		self.remoteCall({
			method : "antiSalary",
			async : false ,
			param : postData ,
			success : self.getBatchTipSuccessFun(self,self.queryAction)
		});
		
	},
	salaryCallBackAction :function () {
		var self = this;
		$("#calendar_info").dialog( "close" );
		self.queryAction();
	}
	,openDialog : function(){
		var self = this;
		$("#calendar_info").empty();
		$("#calendar_info").next().remove();
		$("#calendar_info").dialog({
			    title: jsBizMultLan.atsManager_holidayResultSumList_i18n_27,
				width:950,
		 		height:300,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+55%',
					of: window
				},
				open : function(event, ui) {
					
			    },
				buttons:[{
					text: jsBizMultLan.atsManager_holidayResultSumList_i18n_26,
					click: function() {
						if($("#hrOrgUnitF7_el").val()==""){
							shr.showError({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_21, hideAfter: 3});
							return;
						}
						if($("#proposer_el").val()!=""){
							self.remoteCall({
								method : "generate",
								async: false,
								param : {
									"hrOrgUnit" : $("#hrOrgUnitF7_el").val(),
									"periodId" :  atsMlUtile.getFieldOriginalValue("periodId"),
									"personId" :  $("#proposer_el").val(),
									"longNumber": $("#adminOrgUnit").shrPromptBox("getValue").longNumber == undefined?"":$("#adminOrgUnit").shrPromptBox("getValue").longNumber
								},
								
								success :self.getBatchTipSuccessFun(self,self.queryAction)
							});
						}else{
							self.remoteCall({
								method : "generate",
								async: true,
								param : {
									"hrOrgUnit" : $("#hrOrgUnitF7_el").val(),
									"periodId" :  atsMlUtile.getFieldOriginalValue("periodId"),
									"personId" :  $("#proposer_el").val(),
									"longNumber": $("#adminOrgUnit").shrPromptBox("getValue").longNumber == undefined?"":$("#adminOrgUnit").shrPromptBox("getValue").longNumber
								},
								
								success : function(){	
								}
							});
							$("#calendar_info").dialog("close");
					  		$("#calendar_info").empty();
							shr.showInfo({message : jsBizMultLan.atsManager_holidayResultSumList_i18n_9});
						}
					}
				},{
					text: jsBizMultLan.atsManager_holidayResultSumList_i18n_8,
					click: function(){
					  $(this).dialog("close");
					  $("#calendar_info").empty();
					  $("#calendar_info").next().remove();
					}
				}],
			    close : function() {
				    $("#calendar_info").empty();
				    $("#calendar_info").next().remove();
			    }
			});	
			var html = ""
				 + '<div class="row-fluid row-block ">'
				 + '<div class="col-lg-4"><div class="field_label" title="'
				+ jsBizMultLan.atsManager_holidayResultSumList_i18n_11
				+ '">'
				+ jsBizMultLan.atsManager_holidayResultSumList_i18n_11
				+ '</div></div>'
				 + '<div class="col-lg-6 field-ctrl"><input id="hrOrgUnitF7" name="hrOrgUnitF7" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title="" ></div>'
				 + '<div class="col-lg-1 field-desc"></div>'
				 + '<div class="col-lg-4"><div class="field_label" title="'
				+ jsBizMultLan.atsManager_holidayResultSumList_i18n_34
				+ '">'
				+ jsBizMultLan.atsManager_holidayResultSumList_i18n_34
				+ '</div></div><div class="col-lg-6 field-ctrl">'
				 + '<input id="adminOrgUnit" name="adminOrgUnit" class="block-father input-height" type="text"  ctrlrole="promptBox" validate="" autocomplete="off" title=""></div>'
				 + '<input id="adminOrgUnit_longNumber" name="adminOrgUnit.longNumber" type="hidden" value="">'
				 + '</div>'
				 + '<div class="row-fluid row-block ">'
				 + '<div class="col-lg-4"><div class="field_label" title="'
				+ jsBizMultLan.atsManager_holidayResultSumList_i18n_10
				+ '">'
				+ jsBizMultLan.atsManager_holidayResultSumList_i18n_10
				+ '</div></div>'
				 + '<div class="col-lg-6 field-ctrl">'
				 + '<input id="periodId" type="text" validate="{dateISO:true,required:true}" class="block-father input-height"/>'
				 + '</div>'
				 + '<div class="col-lg-1 field-desc"></div>'
				 + '<div class="col-lg-4"><div class="field_label" title="'
				+ jsBizMultLan.atsManager_holidayResultSumList_i18n_35
				+ '">'
				+ jsBizMultLan.atsManager_holidayResultSumList_i18n_35
				+ '</div></div>'
				 + '<div class="col-lg-6 field-ctrl"><input id="proposer" name="proposer" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
				 + '</div>'
					 $('#calendar_info').append(html);
					 //假期组织
					grid_f7_json=null;
				    grid_f7_json = {id:"hrOrgUnitF7",name:"hrOrgUnitF7"};
					grid_f7_json.subWidgetName = 'shrPromptGrid';
					grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_holidayResultSumList_i18n_11,uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",query:"",filter:"",domain:"",multiselect:false};
					grid_f7_json.readonly = '';
					grid_f7_json.validate = '{required:true}';
					grid_f7_json.value = {id:"",name:""};
					if($('#fastFilter-area').shrFastFilter("option","datas")[0].data.length == 1){//当只有一个业务组织的时候，直接赋值F7
						grid_f7_json.value =  {
							id:$('#fastFilter-area').shrFastFilter("option","datas")[0].data[0].id,
							name:$('#fastFilter-area').shrFastFilter("option","datas")[0].data[0].displayName
						};
					}
					$('#hrOrgUnitF7').shrPromptBox(grid_f7_json);
					//组织	 
					var grid_f7_json = {id:"adminOrgUnit",name:"adminOrgUnit"};
					grid_f7_json.subWidgetName = 'shrPromptGrid';
					grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_holidayResultSumList_i18n_34,uipk:"com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",query:"",filter:"",domain:"",multiselect:false};
					grid_f7_json.readonly = '';
					grid_f7_json.value = {id:"",name:"",displayName:""};
					grid_f7_json.displayFormat = '{displayName}';
					grid_f7_json.customformatter = orgSlice;
					grid_f7_json.customparam = [2];
					$('#adminOrgUnit').shrPromptBox(grid_f7_json);
					//人员
					grid_f7_json = null;
				    grid_f7_json = {id:"proposer",name:"proposer"};
					grid_f7_json.subWidgetName = 'shrPromptGrid';
					grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_holidayResultSumList_i18n_35,uipk:"com.kingdee.eas.hr.ats.app.ExistHolidayFileHisForAdmin.F7",query:"",filter:"",domain:"",multiselect:true};
					grid_f7_json.readonly = '';
					grid_f7_json.validate = '';
					grid_f7_json.isHROrg = "false";
					grid_f7_json.value = {id:"",name:""};
					$('#proposer').shrPromptBox(grid_f7_json);
					
					var picker_json = {id:"periodId"};
					picker_json.tagClass = 'block-father input-height';
					picker_json.readonly = '';
					picker_json.yearRange = '';
					picker_json.isRemoveDay = 'true';
					picker_json.selectValue = 'thisMonth';
					picker_json.validate = '{dateISO:true,required:true}';
					picker_json.format =  'yyyy-mm',
					$('#periodId').shrDateTimePicker($.extend(picker_json,{ctrlType: "Date",isAutoTimeZoneTrans:false}));
					atsMlUtile.setTransDateTimeValue('periodId',new Date().toJSON().slice(0, 7));
					
					$("#hrOrgUnitF7").shrPromptBox("option", {
						onchange : function(e, value) {
							var info = value.current;
							$("#proposer").shrPromptBox().attr("data-params",info.id);
						}
					});
					$("#adminOrgUnit").shrPromptBox("option", {
						onchange : function(e, value) {
							var info = value.current;
							$("#proposer").shrPromptBox("setFilter"," ( adminOrgUnit.id = '"+info.id+"' or adminOrgUnit.longNumber like '"+info.longNumber+"%' )");
						}
					});
			$("#calendar_info").css("padding-left","30px");
	}
});	

