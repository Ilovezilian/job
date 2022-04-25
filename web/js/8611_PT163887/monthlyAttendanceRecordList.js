var sidValue = [];
var addRowID=1;
var type=2;
// 设置组织编码
var orgLongNum="";
// 只有在全部重算的时候，使用 组织ID 
var orgAdminId=""; 
var attendPolicyId="";  
var startAttendancePeriodId="";
var endAttendancePeriodId="";
var attenceCycleId="";
var errorMessage = "";//错误信息提示
var canSubmit = true;//是否能够提交
shr.defineClass("shr.ats.monthlyAttendanceRecordList",shr.framework.List, {
	reportUipk : "com.kingdee.eas.hr.ats.app.MonthlyAttendanceRecord.list",
	rowNumPerPage : 15,
	initalizeDOM : function() {
		shr.ats.monthlyAttendanceRecordList.superClass.initalizeDOM.call(this);
		var that = this;
		$("#addNew").remove();
		$("#delete").remove();
//		that.initBreadCrumb();
//		that.processF7ChangeEvent();
//		that.initDefaultFilter();
		that.renderDataGrid();
		that.initalSearch();
		that.onclickAttendProject();  // 修改汇总显示和明细显示的顺序		
		// 快速查询添加事件
		$('#searcher').shrSearchBar('option', {
			afterSearchClick: this.queryGridByEvent
		});
	},
	//初始化面包屑
	initBreadCrumb: function(){
		var that = this;
		//形成主页
		var breadCrumbStr = '<div id="mainLink" style="float:left;padding:10px 2px 0 10px;"><a href="javascript:void(0);" ' 
		   + '	class="active" style="font-size:16px!important;color:#0088cc;">'
			+ jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_13
			+ '</a> '
		   + '<span style="padding:0 5px;color:#ccc">/</span></div>';
				   
		$('#breadcrumb').before(breadCrumbStr);
		
		//获取当前选中的主题
		var currentTile = $('div[class="wz_navi_step enabled selected"]').find('.title').text();
		var breadCrumbStr = '<div id="currentTile" class="active" style="float:left;font-size:16px;padding-top:10px;color:#999;">'
			+ jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_10
			+ '</div>';
				   
		$('#breadcrumb').before(breadCrumbStr);
		
		that.initEvent();
	},
	//绑定导航栏事件
	initEvent: function(){
	 	var that = this;
		//绑定主页事件
		$("#mainLink").live({
			click : function(){
				window.parent.parent.location = shr.getContextPath() + "/home.do";
			}
		})
	},
	processF7ChangeEvent : function(){ 
		var that = this;
		$('input[name=AdminOrgUnit]').shrPromptBox("option", {
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
				   			$("input[name='adminOrgUnit.longNumber']").val(orgLongNum);
				   		}
				   }else{
					   	if(info.longNumber !=null && info.longNumber!=''){
					   		orgLongNum = info.longNumber;
					   		$("input[name='adminOrgUnit.longNumber']").val(orgLongNum);
					   	}
				   }
				}else {
					orgLongNum = "";
				}
			}
		});
		$('input[name=attencePolicy]').shrPromptBox("option",{
			onchange : function(e, value) {
			   var info = value.current;
			   if(info!=null){ 
			   if(info.id !=null && info.id!=''){ 
				   	attendPolicyId=info.id;
				   	if(info.hasOwnProperty("attenceCycle.id")){
				   		attenceCycleId=info["attenceCycle.id"];
				   	}
				   	if((value.previous!=null&&info.hasOwnProperty("attenceCycle.id"))&&value.previous.hasOwnProperty("attenceCycle.id")){
						   if(info["attenceCycle.id"]==value.previous["attenceCycle.id"]){
							   return;//若考勤制度的考勤周期是同一个，则不关联变动
						   }
					}
				   	if(!info.hasOwnProperty("stepChange")){
						   that.getAttenceCycle(info.id);
				   	}
			   }
			 }
			}
		});
  	},
  	//根据考勤制度获取考勤周期明细 
  	getAttenceCycle:function(attencePolicyId){
  		var self = this;
  		if( attencePolicyId != undefined )
  		{
  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryResultHelper&method=getAttenceCycleItem&attencePolicyId="+encodeURIComponent(attencePolicyId)+"";
			 shr.ajax({
					type:"post",
					async:false,  
					url:url, 
					param : {  
						attencePolicyId:encodeURIComponent(attencePolicyId)
					},
					success : function(res)
					{
						self.showAttenceCycleItem(res);
	 				}
		 	});
  		}
  	},
  	showAttenceCycleItem:function(res){
  			var self=this;
  			if( res == null ){
  				return ;
  			}
	  		var len=res.length;
			$("input[name='startAttendancePeriod']").empty();
			$("input[name='endAttendancePeriod']").empty();
			var selectFlag=true;
			if(len>0){ 
				var json=[]; 
				var select_json=[];
				// 考勤周期 删掉重新生成节点
				$("input[name='startAttendancePeriod']").remove();		
				$("input[name='endAttendancePeriod']").remove();
			
				$("div[title='"+jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_4+"']")
					.parent().next().find("div[class='ui-text-frame disabled']").append("<input type='text' class='block-father input-height' name='startAttendancePeriod'></input>");
				$("div[title='"+jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_1+"']")
					.parent().next().find("div[class='ui-text-frame disabled']").append("<input type='text' class='block-father input-height' name='endAttendancePeriod'></input>");

				for(var i=0;i<len;i++)
				{	
					if(self.checkCurrentDateRange(res[i].beginDate,res[i].endDate))
					{	
							selectFlag=false;
							$("input[name='startAttendancePeriod']").val(res[i].name+" ( "+res[i].beginDate+" -- "+res[i].endDate+" )");
							$("input[name='endAttendancePeriod']").val(res[i].name+" ( "+res[i].beginDate+" -- "+res[i].endDate+" )");
							$("input[name='beginDate']").val(res[i].beginDate);
							$("input[name='endDate']").val(res[i].endDate);
							startAttendancePeriodId=res[i].id;  
							endAttendancePeriodId=res[i].id;
					}
					select_json.push({'value': res[i].id, 'alias': res[i].name+" ( "+res[i].beginDate+" -- "+res[i].endDate+" )"});
				}
				json.data=select_json;
				$("input[name='startAttendancePeriod']").shrSelect(json);
				$("input[name='endAttendancePeriod']").shrSelect(json);
				// 考勤周期 删掉重新生成节点
				if($("div[class='ui-select-frame']").size() == 4)
				{
						$("div[class='ui-select-frame']").eq(0).remove();
						$("div[class='ui-select-frame']").eq(1).remove();
				}
				
				if(selectFlag) 
				{   
					$("input[name='startAttendancePeriod']").val("");  
					$("input[name='endAttendancePeriod']").val("");  
					$("input[name='beginDate']").val("");
					$("input[name='endDate']").val("");   
				}

				$("input[name='startAttendancePeriod']").css("position","relative").css("width","100%").css("color","#333333");
				$("input[name='endAttendancePeriod']").css("position","relative").css("width","100%").css("color","#333333");
				
				$("input[name='startAttendancePeriod']").change(function(){
					var startName = $("input[name='startAttendancePeriod']").val() ;
					    startName = startName.substring(0,startName.indexOf('(')-1);
					//var dateText=$("input[name='attendPeriod']").val();
					startAttendancePeriodId=$("input[name='startAttendancePeriod_el']").val();
					var endName = $("input[name='endAttendancePeriod']").val();
						endName = endName.substring(0,endName.indexOf('(')-1);
					var dateStr = $("input[name='startAttendancePeriod']").val();
						dateStr = dateStr.substring(dateStr.indexOf('(')+1,dateStr.indexOf(')'));
					var dateArray = dateStr.split("--");
					if(parseInt(startName)>parseInt(endName)){//@
						errorMessage = jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_2;
						canSubmit = false;
						shr.showInfo({message : errorMessage});
					}else{
						canSubmit = true;
						$("input[name='beginDate']").val(dateArray[0].trim());
					}
	 			});
	 			
	 			$("input[name='endAttendancePeriod']").change(function(){
	 				var startName = $("input[name='startAttendancePeriod']").val() ;
					    startName = startName.substring(0,startName.indexOf('(')-1);
					//var dateText=$("input[name='attendPeriod']").val();
					endAttendancePeriodId=$("input[name='endAttendancePeriod_el']").val();
					var endName = $("input[name='endAttendancePeriod']").val();
						endName = endName.substring(0,endName.indexOf('(')-1);		
					var dateStr = $("input[name='endAttendancePeriod']").val();
						dateStr = dateStr.substring(dateStr.indexOf('(')+1,dateStr.indexOf(')'));
					var dateArray = dateStr.split("--");
					if(parseInt(startName)>parseInt(endName)){//@
						errorMessage = jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_2;
						canSubmit = false;
						shr.showInfo({message : errorMessage});
					}else{
						canSubmit = true;
						$("input[name='endDate']").val(dateArray[1].trim());
					}
	 			});
			}else{
				errorMessage = jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_5;
				canSubmit = false ;
				shr.showInfo({message : errorMessage});
			}
  	},
  	// 判断开始日期和结束日期在当前日期之内
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
	//获取查询数据
	renderDataGrid : function() {
		if(canSubmit){
			var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attendanceDate","errorMessage":jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_7});
			if(!dateRequiredValidate){
				return;
			}
			$('#datagrid').empty();
			$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>'); // 表头是可变的，所以要动态生成节点
			var self = this;
			var method="getGridColModel";
			self.remoteCall({
						method : method,
						param : {

						},
						success : function(reponse) {
							self.doRenderDataGrid(reponse);				
						}
			});
		}else{
			shr.showInfo({message : errorMessage});
		}
	},
	/**
	 * 表格数据请求URL
	 */
	getGridDataRequestURL : function() {
		return this.dynamicPage_url + "?method=getGridData" + "&uipk="+ this.reportUipk;
	},
	doRenderDataGrid : function(reponse) {
		var self = this;
		var table = $("#reportGrid");
		var url = self.getGridDataRequestURL();
		var colNames = reponse.colNames;
		var colModel = reponse.colModel;
		
		var filterItems = self.getQuickFilterItems();
		if(filterItems == undefined){
			filterItems = "";
		}
		
		var fastFilter="";
		var fastFilterItems = this.getFastFilterItems();
		if (fastFilterItems == undefined) {
//			fastFilter = JSON.stringify(fastFilterItems);
			fastFilterItems = "";
		}
		
		
//		var advancedFilterItems = this.getAdvancedFilterItems();
//		if(advancedFilterItems){
//			advancedFilter = JSON.stringify(advancedFilter);
//		}
		
		//R20190625-2369保存方案后，其它条件设置的条件被清空
		//需把视图的filterItem其他条件name="add"改成name="advancedFilter" 
		var advancedFilter={};
		var advancedFilterItems = self.getAdvancedFilterItems();
		if(advancedFilterItems != undefined){
			advancedFilter["add"] = advancedFilterItems;
		}
		
		postData = {
				'filterItems' : filterItems,
				'fastFilterItems' : $.toJSON(fastFilterItems),
//				'advancedFilter' :advancedFilter,
				'advancedFilterItems': encodeURIComponent($.toJSON(advancedFilter))
		};
		var options = {
			url : url,
			datatype : "json", 
			mtype: "POST",
			multiselect : true,
			rownumbers : false,
			colNames : colNames,
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			postData: postData,
			// pager : '#gridPager1',
			height : '600px',
			rowList : [30,50,100],
			recordpos : 'left',
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			customPager : '#gridPager1',  
			pagerpos:"center",
			pginputpos:"right",
			pginput:true, 
			shrinkToFit : reponse.colModel.length > 10 ? false : true,			
			viewrecords : true,
			onCellSelect : function(rowid, index, contents, event) {
				
			},
			onSelectRow : function(id) {
				jQuery('#reportGrid').jqGrid('editRow', id, false, function() {});
				sidValue.push(id);
				lastsel2 = id;
				$("#reportGrid").attr("sid", sidValue.join(","));
			},
			synchTotal:"true",
			editurl : this.dynamicPage_url + "?method=editRowData" + "&uipk="+ this.reportUipk

		};
		options.loadComplete = function(data) {
			if($("#gridPager1").html() == "" && "true" == "true"){
				$("#reportGrid").setCustomPager("#gridPager1");
			}
			
			shr.setIframeHeight();
			
			$('#gridPager1_left').click(function(){
				$('.ui-pg-selbox').show();
				$('.ui-pg-selbox').css({"left":"-40px",})
				$(this).children('.ui-paging-info').hide();
			});
			$("#microToolbar").hide()
			$("#gridPager1").parent().css({"position":"relative"})  
			$("#gridPager1").addClass("shrPage").css({
				"position":"absolute",
				"top":"-25px",
				"right":"0px",
				"background":"#FFF",
			})

			$("#reportGrid").parent().parent().height('600px');
			$("#reportGrid_frozen").parent().height('589px');
			//self.handleMicroToolbarInfo();
		};
		table.html();
		table.jqGrid(options);
		jQuery("#reportGrid").jqGrid(options);
		jQuery('#reportGrid').jqGrid('setFrozenColumns');
		
	},
	handleMicroToolbarInfo : function() {
		var self = this;
		var html = "";
		// html += "<div id="gridPager1234" >";
		// html += "<div id="pg_gridPager1234" >";
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

		// 页码 (1-4)/4
		self.updatePageEnable();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
		$("#gridPager1").hide();
	    $("#reportGrid").find("tr[class='ui-widget-content jqfoot ui-row-ltr']").find('td').css("border","0px");
	    $("#reportGrid").find("tr[class='ui-widget-content jqfoot ui-row-ltr']").css("border","0px");
	    $('tr[id^=reportGridghead]').removeClass('ui-widget-content jqgroup ui-row-ltr');
	     
	    shr.setIframeHeight();
		// $("#reportGrid_frozen").parent().height('590px');
	    },
	updatePageEnable : function() {
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		if (temp.substring(1, temp.indexOf('-')) == '1') {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}

		if (parseInt(temp.substring(temp.indexOf('-') + 1, temp.indexOf(')'))) >= parseInt(temp.substring(temp.indexOf('/') + 1).replace(/,/g,""))){
			$("#nextId").addClass("ui-state-disabled");
		} else {
			$("#nextId").removeClass("ui-state-disabled");
		}
	},
	prePage : function() {
		jQuery('#reportGrid').jqGrid("setGridParam", { postData: { } });
		$("#prev_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	},
	nextPage : function() {
		jQuery('#reportGrid').jqGrid("setGridParam", { postData: { } });
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
    //开始近来设置其默认值，默认组织，默认考勤制度，考勤周期，开始，结束日期 ;
	initDefaultFilter:function(){
		 var self=this;
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryResultHelper&method=initDefaultFilter";
		 shr.ajax({
				type:"post",
				async:false,
				url:url,
				success:function(res){
					var info = res;
					if(info.length>0){
						var orgValue = {
							id : info[0].orgID,
							name : info[0].orgName,
							longNumber:info[0].longNumber
						}; 
						$('input[name=AdminOrgUnit]').shrPromptBox("setValue", orgValue);							
						if(info[1]){
							var policyValue = {
								id : info[1].id,
								name : info[1].name, 
								"attenceCycle.id" : info[1]["attenceCycle.id"]
							}; 
							$('input[name=attencePolicy]').shrPromptBox("setValue", policyValue);
						}
					} 
			    }
		 });
	},
	//所有点击事件绑定
	onclickAttendProject:function(){
	},
	//查询事件
	queryAction:function(){
		this.renderDataGrid();
	},
	//设置高级查询 
	initalSearch : function(){

		$('<div class="span6" style="margin-left:10%" ><div id="searcher" class="pull-right" style="position: relative;"><input type="checkbox" id="matchMode" name="matchMode" value="1" style="position:absolute; top:0; left:0;"/><div style="display: inline-block;width: 50px;">'
			+ jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_3
			+ '</div></div></div><div id="microToolbar" />').insertAfter($('#fastFilter-area').parent());
		
		var searcherFields = [];
		searcherFields[0] = {columnName:"name",label:jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_8};
		searcherFields[1] = {columnName:"number",label:jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_9};
		var checkbox_json = {
			id: "matchMode",
			readonly: "",
			value: "1"
		};
		$('#searcher input[id="matchMode"]').shrCheckbox(checkbox_json);
		$('#searcher input[id="matchMode"]').parent('div.icheckbox_minimal-grey').css({
			"position": "absolute",
			"top": "3px",
			"left": "-6.4%"
		}).next('div').eq(0).css({
			"position": "absolute",
			"top": "2px",
			"left": "-19.6%"
		});
		var options = {
			gridId: "reportGrid",
			uipk: "com.kingdee.eas.hr.ats.app.MonthlyAttendanceRecord.list",
			query: "" ,
			fields :searcherFields,
			propertiesUrl: shr.getContextPath()+'/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.MonthlyAttendanceRecord.list&method=getProperField'
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
		viewPage.renderDataGrid();
	},
	//导出全部
	exportToExcelAction : function () {
		var self = this;
		var url = self.exportCommonParam();
		var param2 = "";
		
		var filterItems = self.getQuickFilterItems();
		if(filterItems == undefined){
			filterItems = "";
		}
		
		var fastFilterItems = this.getFastFilterItems();
		if (fastFilterItems == undefined) {
			fastFilterItems = "";
		}
		//R20190625-2369保存方案后，其它条件设置的条件被清空
		//需把视图的filterItem其他条件name="add"改成name="advancedFilter" 
		var advancedFilter={};
		var advancedFilterItems = self.getAdvancedFilterItems();
		if(advancedFilterItems != undefined){
			advancedFilter["add"] = advancedFilterItems;
		}
		
		var postData = {
				'filterItems' : encodeURIComponent(filterItems),
				'fastFilterItems' : $.toJSON(fastFilterItems),
				'advancedFilterItems': encodeURIComponent($.toJSON(advancedFilter))
		};

        var callback = function(psw) {
            $.extend(postData,{exportPrivteProtected: psw});
            openLoader(1,jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_12);
            shr.reloadUrlByPost(url, postData, 'exportToExcel');
            closeLoader();
        }
        if(window.isShrSensitiveRuleOpen) {
            fieldSensitiveService.setExportPsw(callback);
        }else{
            callback();
        }

	},
	//导出选中行
	exportCurrentAction: function(){
			var urlinner = shr.getContextPath() + shr.dynamicURL + "?method=getOpenLoader&handler=com.kingdee.shr.ats.web.handler.AttendanceResultDetailHandler";
			var _self = this;
			var billIds = [];	
			var $grid =  $("#reportGrid");
			var selectedIds = $grid.jqGrid("getSelectedRows");
			if (selectedIds.length > 0) {
				var id;
				for (var i = 0, length = selectedIds.length; i < length; i++) {
					id = $grid.jqGrid("getCell", selectedIds[i], "FID");
					if (id && id.length > 0) {
						billIds.push(id);
					}
				}
		    }
			var personIds = billIds;
			if(personIds.length > 0){
				var that = this;
				var url = that.exportCommonParam();
				url = url+'&personIds='+encodeURIComponent(personIds.join(','));
                var callback = function(psw) {
                    param = {exportPrivteProtected: psw};
                    openLoader(1,jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_12);
                    shr.reloadUrlByPost(url, param, 'exportToExcel');
                    closeLoader();

                }
                if(window.isShrSensitiveRuleOpen) {
                    fieldSensitiveService.setExportPsw(callback);
                }else{
                    callback();
                }

//				shr.ajax({
//					type:"post",
//					url:urlinner,
//					method : "getOpenLoader",
//					param : { "personId" : '' },
//					success : function (reponse) {
//						var param2 = "";
//						shr.reloadUrlByPost(url, param2, 'exportToExcel');
//						closeLoader();
//					},
//					error : function(res){
//				    	shr.showError({message: jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_0});
//				    	closeLoader();
//				    } 
//				});
			}else{
				shr.showWarning({
					message: jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_6
				});
			}
	},
	exportCommonParam:function(){
		$grid = $('#reportGrid');
		var self = this;
		var filterItems = self.getQuickFilterItems();
		var sorder =   $('#reportGrid').jqGrid('getGridParam', 'sortorder') ;
		var sordName = $('#reportGrid').jqGrid('getGridParam', 'sortname') ;
		var postData = $grid.jqGrid("getGridParam", "postData");
		var param = postData;
		if( filterItems == undefined)
		{ 
			filterItems = "" ;
		}
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		var proposerName = $("input[name='proposer.name']").val();
		var number = $("input[name='proposer.number']").val();

		url = this.dynamicPage_url + "?method=exxportToExcel" + "&uipk=" + this.reportUipk;  
		//标题		
		url += "&title=" + jsBizMultLan.atsManager_monthlyAttendanceRecordList_i18n_11;
		//拼接查询条件
//		url = url + '&beginDate=' + beginDate + '&endDate=' + endDate + '&orgLongNum='
//				  + encodeURIComponent(orgLongNum) + '&proposerName=' + encodeURIComponent(proposerName)+'&number='+encodeURIComponent(number)
//				  +'&startAttendancePeriodId='+encodeURIComponent(startAttendancePeriodId)+'&endAttendancePeriodId='+encodeURIComponent(endAttendancePeriodId)
//				  +'&attendPolicyId='+encodeURIComponent(attendPolicyId)+'&filterItems='+encodeURIComponent(filterItems) +'&sord='+sorder+'&sidx='+sordName;
//	    url += "&" + $.param(param);	
		return url ;	
	}
});
