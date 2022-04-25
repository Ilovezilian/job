var orgLongNum = "";
var hrOrgUnitId = "";
var policySetId = "";
shr.defineClass("shr.ats.TakeWorkingDetail", shr.framework.List, {

	reportUipk : "com.kingdee.eas.hr.ats.app.takeWorkingDetail.list",
	rowNumPerPage : 20,
	initalizeDOM : function () {
		shr.ats.TakeWorkingDetail.superClass.initalizeDOM.call(this);
		var self = this;
		/**
		 * 集团管控行政组织、业务组织F7视图配置正确后，框架会默认根据当前用户权限填值
		 */
		//初始化组织数据
		//self.initFilterOrg();
		//设置组织点击事件
		self.processF7ChangeEvent();
		//self.addProposerF7Event();
		self.clearAdminOrgUnitVal();

		//************/
		self.initalSearch();
		// 快速查询添加事件
		$('#searcher').shrSearchBar('option', {
			afterSearchClick: this.queryGridByEvent
		});
		self.doRenderDataGrid();
		$("#listInfo").css("border","0");
	}
  	 //设置高级查询 
	,initalSearch : function(){
		$('#grid-toolbar').children().eq(1).append('<div id="searcher" class="pull-right"/>');
		var searcherFields = [];
		searcherFields[0] = {columnName:"name",label:jsBizMultLan.atsManager_takeWorkingDetail_i18n_8};
		searcherFields[1] = {columnName:"number",label:jsBizMultLan.atsManager_takeWorkingDetail_i18n_11};
		var options = {
			gridId: "reportGrid",
			uipk: "com.kingdee.eas.hr.ats.app.AttendanceResultSumList",
			query: "" ,
			fields :searcherFields,
			propertiesUrl: shr.getContextPath()+'/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttendanceResultSumList&method=getProperField'
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
	,/*
	addProposerF7Event: function(){
		var object = $("#proposer");
		object.shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					if(info!=null){
						info["id"]=info["person.id"];
						info["name"]=info["person.name"];
					}
				}
			});
	},
	*/
	/**
	 * 初始化行政组织标签
	 */
	initFilterOrg : function () {
		var that = this;
	  // 设置默认的查询组织 这边必须的用同步的请求，不然无法过滤。
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=getDefaultOrg";
		shr.ajax({
					type : "post",
					async : false,
					url : url,
					success : function(res) {
						var info = res;
						if (info != null) {
							var dataValue = {
								id : info.orgID,
								name : info.orgName,
								longNumber : info.longNumber
							};
							orgLongNum = info.longNumber;
							$('#adminOrgUnit').shrPromptBox("setValue",dataValue);
							//加载考勤制度
							that.initHolidayPolicy();
						}
					}
				});
	},
	/**
	 * 初始化假期制度标签
	 */
	initHolidayPolicy:function(){
		var that = this;
		that.remoteCall({
			method:"getHolidayPolicy",
			async : true,
			dataType:'json',
			type: "POST",
			cache: false,
			success : function(data) {
				if (data.length != 0) {
					// $('input[name="holidayPolicySet"]').val(data.name);
					// $('input[name="holidayPolicySet_el"]').val(data.id);
					policySetId = data.id;
					var holidayPolicySet = {"id":data.id,"name":data.name};
					$("#holidayPolicySet").shrPromptBox("setValue",holidayPolicySet);
					that.initSpanDigital();
				}
			}
		});
			
	},
	/**
	 * 初始化页面span标签:flag ：用来判断是否是初次加载
	 */
	initSpanDigital: function(){
   		var that = this;
		that.remoteCall({
			method:"getTakeWorkingRange",
			param: {
				policySetId: policySetId
			},
			async : true,
			dataType:'json',
			type: "POST",
			cache: false,
			success : function(data) {
				if (data.length != 0) {
				    $('#firstMonth').html(data.begin);
					$('#lastMonth').html(data.end);
				}
				that.doRenderDataGrid();
			}
		});
   },/**
     * 增加行政组织事件监听
     */
	processF7ChangeEvent : function(){
		var that = this;
		//假期业务组织改变时
		$('#hrOrgUnitId').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   if(info!=null){
				   if(info.id !=null && info.id!=''){ 
				   		hrOrgUnitId = info.id;
				   }
				}
			}
		});

		//组织改变时
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   if(info!=null){
				   if(info.longNumber !=null && info.longNumber!=''){ 
				   		orgLongNum=info.longNumber;
				   }
				}
			}
		});
		
		//假期制度改变时
		$('#holidayPolicySet').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   if(info!=null){
				   if(info.id !=null && info.id !=''){ 
				   		policySetId = info.id;
				   		that.initSpanDigital(false);
				   }
				}
			}
		});
		
   },
	queryAction : function () {
		var self = this;
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attDate","errorMessage":jsBizMultLan.atsManager_takeWorkingDetail_i18n_5});
		if(!dateRequiredValidate)
			return;
		
		var begin = $('#firstMonth').html();
		var end = $('#lastMonth').html();
		if(begin == end && begin == 0){
			shr.showWarning({message: jsBizMultLan.atsManager_takeWorkingDetail_i18n_9});
			return;	
		}
		self.doRenderDataGrid();
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
	/**
	 * 加载表格
	 * @param {} reponse
	 */
	,doRenderDataGrid : function () {
		if($('#gridPager1')){
			$('#listInfo').empty();
		}
		
		$('#listInfo').append('<div id="gridPager1"></div>');
		$('#listInfo').append('<table id="reportGrid"></table>');
		
		var self = this;
		//search搜索框，姓名，员工编码
		var searchFilterItems = self.getSearchFilterItems();
		//快速过滤
		var fastFilterItems = self.getFastFilterItems();
		if( searchFilterItems == undefined)
			searchFilterItems = "" ;
		if( fastFilterItems == undefined)
			fastFilterItems = "" ;
		//导航树最末级组织长编码
		var orgLongNum = $("#treeNavigation").find(".active").attr("longnumber");
		
		var colModel = getColModel();
		var url = "";
		var begin = $('#firstMonth').html();
		var end = $('#lastMonth').html();
		if(begin == end && begin == 0){
		    if($("#gridPager1")){
			   $("#gridPager1").hide();
			}
		}
		else{
			url = shr.getContextPath() + "/dynamic.do?method=getGridData"
				+ "&handler=com.kingdee.shr.ats.web.handler.TakeWorkingDetailHandler";
		}
		options = {
			url : url,
			datatype : "json",
			mtype: "post",
			postData: {
				serviceId : $.getUrlParam("serviceId"),
				permItemId : self.currentPagePermItemId,
				orgLongNum : orgLongNum,
				"fastFilterItems" : $.toJSON(fastFilterItems),
				"searchFilterItems"	: searchFilterItems
			},
			multiselect : true,
			rownumbers : false,
			colNames : getChineseName(),
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			// pager : '#gridPager1',
			height : '500px',
			rowList : [10, 20, 30, 50],
			recordpos : 'left',
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			//shrinkToFit : colModel.length>10 ? false:true,
			shrinkToFit : true,
			viewrecords : true,
			//sortname : defaultSortname,
			//caption: "Frozen Header",
			customPager : '#gridPager1',  
			pagerpos:"center",
			pginputpos:"right",
			pginput:true, 
			onSelectRow: function(id){
				//jQuery('#reportGrid').jqGrid('editRow', id, false, function(){});
			}
			//editurl: ""
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
			$("#gridPager1").parent().css({"position":"relative","top":"25px"})  
			$("#gridPager1").addClass("shrPage").css({
				"position":"absolute",
				"top":"-25px",
				"right":"0px",
				"background":"#FFF",
			})
			//相同ID的行合并
				var tempid = "",id,rowspan,colsize= 4;//需要合并的列数	
					$("tr:gt(0)",$(this)).each(function(i){
					 id = $(this).attr("id");						 
					 rowspan = $(this).nextUntil("tr[id!='"+id+"']").length+1;					
					$(this).children().each(function(j){
						if (parseInt(j) >= colsize){
							return false;			
						}
						if (id!=tempid) {							
							$(this).attr("rowspan", rowspan);
						} else {
							$(this).hide();
						}
					});
					tempid = id;
				});
				
			// self.handleMicroToolbarInfo();
		};
		table = $("#reportGrid");
		// clear table
		table.html();
		table.jqGrid(options);
		jQuery('#reportGrid').jqGrid('setFrozenColumns');
		$("#datagrid").find(".frozen-bdiv").eq(0).css("height",$("#datagrid").find(".ui-jqgrid-bdiv").eq(0).height()-16);//不加这行固定列会超出div
		
	},

	// 添加表格分页信息
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
		$(".shrPage .page-Title").css("margin-right","5px");
		shr.setIframeHeight();
	},

	updatePageEnable:function () {
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		if (temp.substring(1, temp.indexOf('-')) == '1') {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}

		if (parseInt(temp.substring(temp.indexOf('-') + 1, temp.indexOf(')'))) >= parseInt(temp.substring(temp.indexOf('/') + 1).replace(/,/g,""))) {
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
///////////////////////////////////////
	
	exportToExcelAction : function () {
		
  		var _self = this ;
        var callback = function(psw) {
            var url = _self.exportCommonParam();
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
		var atsHolidayFileId = $("#reportGrid").jqGrid("getSelectedRows");//动态列表格用$("#reportGrid")
//		var personIds = _self.getSelectedFields('FPROPOSERID'); // 区分大小写的,平台方法为$("#grid")
		if(atsHolidayFileId.length > 0){
			var url = _self.exportCommonParam();
			url = url+'&atsHolidayFileId='+encodeURIComponent(atsHolidayFileId.join(','));
            var callback = function(psw) {
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
				message: jsBizMultLan.atsManager_takeWorkingDetail_i18n_4
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
		url += "&title="+encodeURIComponent(jsBizMultLan.atsManager_takeWorkingDetail_i18n_0);
		var param = postData;
		url += "&" + $.param(param);	
		// set PostData
		//拼接查询条件
		url = url + '&beginDate=' + beginDate + '&endDate=' + endDate + '&adminOrgLongNumber=' + encodeURIComponent(orgLongNum) + '&proposerName=' + encodeURIComponent(proposerName)
		       +'&holidayPolicyId='+encodeURIComponent(holidayPolicyId)
//		       +'&research='+flag
		       +'&research='+1
		       +'&uipk=' + self.reportUipk
		       +'&rows=1&page=1&exportAll=1';
		 return url ;
	}
	,
///////////////////////////////////////	
	
	selectRowNumPerPage:function(){
		
	},
	clearAdminOrgUnitVal: function(){
		 $("#adminOrgUnit").blur(function(){
		       if($("#adminOrgUnit_el").val() == null || $("#adminOrgUnit_el").val() == ""){
		           orgLongNum = "";
		       }
		 });
	}
});
/** 
 * 得到现实列的中文名称
 */
function getChineseName(){
	var arr = [];
	arr.push("id");
	arr.push(jsBizMultLan.atsManager_takeWorkingDetail_i18n_11);
	arr.push(jsBizMultLan.atsManager_takeWorkingDetail_i18n_8);
	arr.push(jsBizMultLan.atsManager_takeWorkingDetail_i18n_2);
	arr.push(jsBizMultLan.atsManager_takeWorkingDetail_i18n_7);
	
	arr.push(jsBizMultLan.atsManager_takeWorkingDetail_i18n_12);
	arr.push(jsBizMultLan.atsManager_takeWorkingDetail_i18n_1);
	arr.push("OT1");
	arr.push("OT2");
	arr.push("OT3"); // modify fuchuanbi
	
	arr.push(jsBizMultLan.atsManager_takeWorkingDetail_i18n_10);
	arr.push("OT1");
	arr.push("OT2");
	arr.push("OT3"); // modify fuchuanbi
	arr.push(jsBizMultLan.atsManager_takeWorkingDetail_i18n_6);
	arr.push("OT1");
	arr.push("OT2");
	arr.push("OT3"); // modify fuchuanbi
	return arr;
}
/**
 * 应用于国际化标签 得到实现列的英文名称
 */
function getEnglishNames(){
	var arr = [];
	arr.push("id");
	arr.push("personNum");
	arr.push("personName");
	arr.push("displayName");
	arr.push("cycleDate");
	arr.push("cycleLimit");
	arr.push("cycleOT1");
	arr.push("cycleOT2");
	arr.push("cycleOT3");// modify fuchuanbi
	arr.push("usedLimit");
	arr.push("usedOT1");
	arr.push("usedOT2");
	arr.push("usedOT3");// modify fuchuanbi
	arr.push("remainLimit");
	arr.push("remainOT1");
	arr.push("remainOT2");
	arr.push("remainOT3");// modify fuchuanbi
	return arr;
}
/**
 * 得到模型列
 */
function getColModel(){
	var sysDecimalPlace = atsMlUtile. getSysDecimalPlace();
	var arr = [];
	arr.push({
				name : 'id',
				label : 'ID',
				index : 'id',
				hidden : true
			});

	arr.push({
				name : 'personNum',
				label : jsBizMultLan.atsManager_takeWorkingDetail_i18n_11,
				index : 'personNum',
				width : 50,
				editable : false,
				sortable:true
			});
	arr.push({
				name : 'personName',
				label : jsBizMultLan.atsManager_takeWorkingDetail_i18n_8,
				index : 'personName',
				width : 60,
				editable : false,
				sortable:true
			});
			
	arr.push({
			name : 'hrOrgUnitName',
			label : jsBizMultLan.atsManager_takeWorkingDetail_i18n_3,
			index : 'hrOrgUnitName',
			width : 80,
			editable : false,
			sortable:true
		});	
		
	arr.push({
				name : 'displayName',
				label : jsBizMultLan.atsManager_takeWorkingDetail_i18n_13,
				index : 'displayName',
				width : 80,
				editable : false,
				sortable: true
		    });

	arr.push({
				name : 'cycleDate',
				label : jsBizMultLan.atsManager_takeWorkingDetail_i18n_12,
				index : 'cycleDate',
				width : 200,
				editable : false,
				sortable: false
			});
	arr.push({
				name : 'cycleLimit',
				label : jsBizMultLan.atsManager_takeWorkingDetail_i18n_1, //周期额度
				index : 'cycleLimit',
				width : 50,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	arr.push({
				name : 'cycleOT1',
				label : 'OT1', //周期计调休1(工作日拥有调休时长)
				index : 'cycleOT1',
				width : 40,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	arr.push({
				name : 'cycleOT2',
				label : 'OT2', //周期计调休2(休息日拥有调休时长)
				index : 'cycleOT2',
				width : 40,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	arr.push({                // add by fuchuanbi
				name : 'cycleOT3',
				label : 'OT3', //周期计调休3(法定节假日拥有调休时长)
				index : 'cycleOT3',
				width : 40,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});		
	arr.push({
				name : 'usedLimit',
				label : jsBizMultLan.atsManager_takeWorkingDetail_i18n_10,
				index : 'usedLimit',
				width : 60,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	arr.push({
				name : 'usedOT1',
				label : 'OT1',
				index : 'usedOT1',
				width : 40,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	arr.push({
				name : 'usedOT2',
				label : 'OT2',
				index : 'usedOT2',
				width : 40,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	arr.push({   // add by fuchuanbi
				name : 'usedOT3',
				label : 'OT3',
				index : 'usedOT3',
				width : 40,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	arr.push({
				name : 'remainLimit',
				label : jsBizMultLan.atsManager_takeWorkingDetail_i18n_6,
				index : 'remainLimit',
				width : 40,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	arr.push({
				name : 'remainOT1',
				label : 'OT1',
				index : 'remainOT1',
				width : 40,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	arr.push({
				name : 'remainOT2',
				label : 'OT2',
				index : 'remainOT2',
				width : 40,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	arr.push({
				name : 'remainOT3',
				label : 'OT3',
				index : 'remainOT3',
				width : 40,
				editable : false,
				sortable: false,
				formatter: "numberfield",
				formatoptions : {'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':sysDecimalPlace}
			});
	return arr;
}
				
