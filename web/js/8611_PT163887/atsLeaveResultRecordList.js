var flag=1;
//组织长编码
var orgLongNum="";
shr.defineClass("shr.ats.atsLeaveResultRecordList", shr.framework.List, {
    reportUipk :   "com.kingdee.eas.hr.ats.app.AtsLeaveResultSumList" ,
    rowNumPerPage : 15,
    gridId: '#reportGrid', 
	initalizeDOM : function () {
		$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>');
		var that = this;
		
		// 快速过滤组件添加事件
//		var $fastFilterArea = $('#fastFilter-area');
//		if ($fastFilterArea && $fastFilterArea.length) {
//			$fastFilterArea.shrFastFilter('option', {
//				afterSearchClick: this.renderDataGrid
//			});
//		}
		
		flag=1;
		// that.processF7ChangeEvent();
		// that.clearAdminOrgUnitVal(); 
		// that.initFilterDate(); 
		that.renderDataGrid();
		this.initalSearch();
	    shr.ats.atsLeaveResultRecordList.superClass.initalizeDOM.call(this);
	    // 快速查询添加事件
		$('#searcher').shrSearchBar('option', {
			afterSearchClick: this.queryGridByEvent
		});

		//jQuery("#grid").jqGrid('setFrozenColumns');initCreateDefaultView
		//$('#datagrid').append('<table id="reportGrid"></table>');
		$('#datagrid').css("border","0");
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
	}
  	 //设置高级查询 
	,initalSearch : function(){
		$('#grid-toolbar').children().eq(1).append('<div id="searcher" class="pull-right"/>');
		// $('<div id="searcher" class="pull-right"/>').insertAfter($('#breadcrumb').parent());
		var searcherFields = [];
		searcherFields[0] = {columnName:"name",label:jsBizMultLan.atsManager_atsLeaveResultRecordList_i18n_4};
		searcherFields[1] = {columnName:"number",label:jsBizMultLan.atsManager_atsLeaveResultRecordList_i18n_5};
		var options = {
			gridId: "reportGrid",
			uipk: "com.kingdee.eas.hr.ats.app.AttendanceResultSumList",
			// query: "" ,
			fields :searcherFields
			//暂时从这里取
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
	/**
	 * 获得search查询条件
	 */
	,getSearchFilterItems: function() {
		var filter = $('#searcher').shrSearchBar('option', 'filterView');
		if (filter && filter.filterItems) {
			return filter.filterItems;
		}
	}
	,processF7ChangeEvent : function(){
		var that = this;
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   var adminOrgLongNumber;
			   if(info!=null){
			   if(info.longNumber !=null && info.longNumber!=''){ 
			   		orgLongNum=info.longNumber;
			   }

			}
			}
		});
    }
	,queryAction : function () {
		var self = this;
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attDate","errorMessage":jsBizMultLan.atsManager_atsLeaveResultRecordList_i18n_3});
		if(!dateRequiredValidate)
			return;
		
		$('#datagrid').empty();
		$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>');	
        flag=2;		
		self.renderDataGrid();
	},
	
	
	queryFastFilterGrid: function() {
		 var self = this;
		 self.renderDataGrid();
	},
	
	// verifyStartTime : function(){
	// 	var beginDate =  $("#beginDate").val(),endDate = $("#endDate").val();
	// 	if(beginDate > endDate){
	// 		return false;
	// 	}else{
	// 		return true;
	// 	}
	// },
	 
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
		//设置默认的查询组织 这边必须的用同步的请求，不然无法过滤。
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsLeaveResultListHandler&method=getDefaultFilter";
		shr.ajax({
			type:"post",
			async:false,
			url:url,
			success:function(res) {
				var info = res;
				if(info.flag="Sucess") {
					if(info!=null) {
						//新版控件赋值
						$("input[id='"+info.holidayPolisetId+"']").parent().addClass("checked");
						$("input[id='"+info.orgID+"']").parent().addClass("checked");
						
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
				} else if(info.flag="Fail") {
					shr.showError({message: jsBizMultLan.atsManager_atsLeaveResultRecordList_i18n_0});	 
				} 
			}
		});
	}
	
	
	// ,getFastFilterInfo : function () {
	// 	var self = this;
	// 	var fastFilterItems = this.getFastFilterItems();
	/*	var adminOrgUnitid = $("div[class='iradio_minimal-grey checked']").children("input[name='adminOrgUnit']").attr('id');
		var adminOrgUnitLongNum = $("div[class='iradio_minimal-grey checked']").children("input[name='adminOrgUnit']").attr('value');
		var holidayPolicySetid = $("div[class='iradio_minimal-grey checked']").children("input[name='holidayPolicySet']").attr('id');
		
		var checkeddate = $("span[data-name='attDate@@date@@']").attr('data-value');
		
		var hrOrgUnitid = "";
		var spanarr = $("span[data-checked='checked']");
		var length = spanarr.length;
		if(length > 1){
			for(var i=0; i < length; i++ ){
				hrOrgUnitid = hrOrgUnitid + spanarr.eq(i).attr('data-id') + ",";
			}
			hrOrgUnitid = hrOrgUnitid.substr(0,hrOrgUnitid.length-1);
		}else{
			hrOrgUnitid = $("span[data-checked='checked']").attr('data-id');
		}
		if(!hrOrgUnitid){hrOrgUnitid = ""};
		
		fastFilterItems.adminOrgUnit.adminOrgUnitLongNum = adminOrgUnitLongNum;
		fastFilterItems.adminOrgUnit.values = adminOrgUnitid;
		fastFilterItems.holidayPolicySet.values = holidayPolicySetid;
		fastFilterItems.hrOrgUnit.values = hrOrgUnitid; 
		
		if( checkeddate != undefined ){
			fastFilterItems.attDate.beginDate = checkeddate.split('至')[0].trim();
			fastFilterItems.attDate.endDate   = checkeddate.split('至')[1].trim();
		}*/
		//fastFilterItems.personName.personname = "";
		
	// 	return fastFilterItems;
	// }
	
	
	
	,renderDataGrid : function () {
		var self = this;
		var schemaId = shr.getUrlRequestParam("schemaId");
		var periodId = shr.getUrlRequestParam("periodId");

		var searchFilterItems = self.getSearchFilterItems();
		var fastFilterItems = self.getFastFilterItems();
		if( searchFilterItems == undefined)
			searchFilterItems = "" ;
		if( fastFilterItems == undefined)
			fastFilterItems = "" ;
		
		self.remoteCall({
			method : "getGridColModel",
			cache:false,
			param : {
				// "holidayPolicyId":holidayPolicyId,
				"fastFilterItems": $.toJSON(fastFilterItems),
				"searchFilterItems":searchFilterItems
			},
			success : function (reponse) {
				self.doRenderDataGrid(reponse);
			}
		});
	}
	  
	/**
	 * 表格数据请求URL
	 */
	,getGridDataRequestURL : function () {
		return this.dynamicPage_url
		 + "?method=getGridData"
		 + "&uipk=" + this.reportUipk;  
	}

    ,doRenderDataGrid : function (reponse) {
		var self = this;
		var table = $("#reportGrid");
		var url = self.getGridDataRequestURL();
		var colNames = reponse.colNames;
		var colModel = reponse.colModel;

		var searchFilterItems = self.getSearchFilterItems();
		var fastFilterItems = self.getFastFilterItems();
		if( searchFilterItems == undefined)
			searchFilterItems = "" ;
		if( fastFilterItems == undefined)
			fastFilterItems = "" ;
		var orgLongNum = $("#treeNavigation").find(".active").attr("longnumber");

		var postData = {
			'searchFilterItems' : searchFilterItems, //搜索框，取员工姓名
			'fastFilterItems' : $.toJSON(fastFilterItems), //快速过滤
			'adminOrgLongNumber' : orgLongNum, //导航树组织长编码
			'research' : flag,
			'serviceId' : shr.getUrlRequestParam("serviceId")
		};

		var	options = {
			url : url,
			datatype : "json",
			mtype: "POST",
			postData : postData,
			multiselect : true,
			rownumbers : false,
			colNames : colNames,
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			// pager : '#gridPager1',
			height : '500px',
			rowList : [20, 30, 45, 60],
			recordpos : 'left', 
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			pginput : true,   
			shrinkToFit : reponse.colModel.length > 13 ? false : true,
			viewrecords : true,
			sortname: "number",
			sortorder: "asc" ,
			customPager : '#gridPager1',  
			pagerpos:"center",
			pginputpos:"right"
		}; 

		options.loadComplete = function (data) {
			if($("#gridPager1").html() == "" && "true" == "true"){
				$("#reportGrid").setCustomPager("#gridPager1");
			}
			
			shr.setIframeHeight();
			
			$('#gridPager1_left').click(function(){
				$('.ui-pg-selbox').show();
				$('.ui-pg-selbox').css({"left":"-40px",})
				$(this).children('.ui-paging-info').hide();
			});
			$("#microToolbar").parent().hide()
			$("#gridPager1").parent().css({"position":"relative","top":"25px"}); 
			$("#gridPager1").addClass("shrPage").css({
				"position":"absolute",
				"top":"-55px",
				"right":"0px",
				"background":"#FFF"
			})
			$("#gbox_reportGrid").css("top","-30px");
			// self.handleMicroToolbarInfo();
			jQuery('#reportGrid').jqGrid('setFrozenColumns');
			// $('#reportGrid_frozen').parent().height('484px');
		};
	
		

		// clear table
		table.jqGrid(options);
		table.trigger("reloadGrid");
		//$('#reportGrid').GridUnload();   
		jQuery('#reportGrid').jqGrid('setFrozenColumns');		
		// $("#datagrid").find(".frozen-bdiv").eq(0).css("height",$("#datagrid").find(".ui-jqgrid-bdiv").eq(0).height()-16);//不加这行固定列会超出div
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
		$("#prevId").on("click", self.prePage);
		$("#nextId").on("click", self.nextPage);

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
		$(".shrPage .page-Title").css("margin-right","5px");
	},
	updatePageEnable:function () {
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		if (temp.substring(1, temp.indexOf('-')) == '1') {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}

		if (parseInt(temp.substring(temp.indexOf('-') + 1, temp.indexOf(')'))) >= parseInt(temp.substring(temp.indexOf('/') + 1))) {
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
			
		},
  	exportToExcelAction : function () {
		
  		var _self = this ;
  		var url = _self.exportCommonParam();
		var callback=function(psw){
			url = url + '&exportPrivteProtected=' + psw;
			document.location.href = url;
		}

		if(window.isShrSensitiveRuleOpen) {
			fieldSensitiveService.setExportPsw(callback);
		}else{
			callback();
		}


	},
	 exportCurrentAction : function(){
		var _self = this;
		var personIds = _self.getSelectedFields('FPROPOSERID'); // 区分大小写的
		if(personIds.length > 0){
		
			var url = _self.exportCommonParam();
			url = url+'&personId='+encodeURIComponent(personIds.join(','));
			var callback=function(psw){
				url = url + '&exportPrivteProtected=' + psw;
				document.location.href = url;
			}

			if(window.isShrSensitiveRuleOpen) {
				fieldSensitiveService.setExportPsw(callback);
			}else{
				callback();
			}

		}else{
			shr.showWarning({
				message: jsBizMultLan.atsManager_atsLeaveResultRecordList_i18n_2
			});
		}
	},
	exportCommonParam : function(){
	
		var self = this;
		
        var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		var proposerName = $("#proposer").val();
		var holidayPolicyId=$("#holidayPolicySet_el").val();
		var $grid = $('#reportGrid');
		var postData = $grid.jqGrid("getGridParam", "postData");
		var url = shr.getContextPath() + shr.dynamicURL + "?method=exportToExcel";
		//标题
		url += "&title="+encodeURIComponent(jsBizMultLan.atsManager_atsLeaveResultRecordList_i18n_1);
		var param = postData;
		url += "&" + $.param(param);	
		// set PostData
		//拼接查询条件
		url = url + '&beginDate=' + beginDate + '&endDate=' + endDate + '&adminOrgLongNumber=' + encodeURIComponent(orgLongNum) + '&proposerName=' + encodeURIComponent(proposerName)
		       +'&holidayPolicyId='+encodeURIComponent(holidayPolicyId)+'&research='+flag+'&uipk=' + self.reportUipk
		       +'&rows=1&page=1';
		 return url ;
	}
	,importAttendanceResultAction:function(){
		
	}
	,clearAdminOrgUnitVal: function(){
		 $("#adminOrgUnit").blur(function(){
		       if($("#adminOrgUnit_el").val() == null || $("#adminOrgUnit_el").val() == ""){
		           orgLongNum = "";
		       }
		 });
	}
	
});	
