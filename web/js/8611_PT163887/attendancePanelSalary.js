var orgLongNum="";
var attendPolicyId="";  
var attendPeriodId="";
var attendanceGroupID="";
var attenceCycleId="";
var transition="";
shr.defineClass("shr.ats.attendancePanelSalary",shr.framework.List, {
	reportUipk : "hr.ats.com.attendancePanelSalary",
	rowNumPerPage : 15,
	initalizeDOM : function() { 
		shr.ats.attendancePanelSalary.superClass.initalizeDOM.call(this);
		var that = this;
		that.processF7ChangeEvent();
		that.initBreadCrumb();
		that.initalSearch();
		$(function() {
			$('button[name=query]').shrButton({
					actionBinding: 'customAction',
					subAction: 'queryAction',
					customData: ""
			});		
		});
		
		// 完成按钮的控制
		$("div[class='wz_oper top'] button").css("margin-top","-10px");
		// 快速查询添加事件
		$('#searcher').shrSearchBar('option', {
			afterSearchClick :function(e) {		
				that.getGridData();
			}
		});
		that.queryDivInit();
		that.queryAction();
	//	$(".wz_content").css("height","auto");
	},
	//设置高级查询 
	initalSearch : function(){
		$('<div id="searcher" class="pull-right" style="padding:10px 2px 0 10px;"></div>').insertAfter($('#currentTile'));
		
		var searcherFields = [];
		searcherFields[0] = {columnName:"name",label:jsBizMultLan.atsManager_attendancePanelSalary_i18n_12};
		searcherFields[1] = {columnName:"number",label:jsBizMultLan.atsManager_attendancePanelSalary_i18n_13};
		
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
	} ,
	
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
		//viewPage.queryAction();
	},
	 initBreadCrumb: function(){
		 	var that = this;
			//形成主页
			var breadCrumbStr = '<div id="breadcrumb" style="float:left;padding:10px 2px 0 10px;"><a href="javascript:void(0);" ' 
			   + '	class="active" style="font-size:16px!important;color:#0088cc;">'
				+ jsBizMultLan.atsManager_attendancePanelSalary_i18n_14
				+ '</a> '
			   + '<span style="padding:0 5px;color:#ccc">/</span></div>';
			$('#_wz_div').before(breadCrumbStr);
			//获取当前选中的主题
			var currentTile = $('div[class="wz_navi_step enabled selected"]').find('.title').text();
			breadCrumbStr = '<div id="currentTile" class="active" style="float:left;font-size:16px;padding-top:10px;color:#999;">' + currentTile + '</div>';
					   
			$('#_wz_div').before(breadCrumbStr);	
			that.initEvent();
			
		},
		//绑定导航栏事件 
		 initEvent: function(){
		 	var that = this;
			//绑定主页事件
			$("#breadcrumb").live({
				click : function(){
					window.parent.parent.location = shr.getContextPath() + "/home.do";
				}
			});
		},
	processF7ChangeEvent : function(){ 
		var that = this;
		$('input[name=AdminOrgUnit]').shrPromptBox("option", {
			onchange : function(e, value) {
			   var info = value.current;
				   /*if(info!=null){
					   	if(info.longNumber !=null && info.longNumber!=''){ 
					   		orgLongNum=info.longNumber;
					   	}
			 		}*/
			   		
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
			   		if((info.hasOwnProperty("attenceCycle.id"))&&value.previous.hasOwnProperty("attenceCycle.id")){
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
		$('input[name=prop_attencegroup]').shrPromptBox("option",{
			onchange : function(e, value) {
			   var info = value.current;
			   if(info!=null){ 
			   if(info.id !=null && info.id!=''){ 
			   		attendanceGroupID=info.id;
			   }
			 }
			 else
			 {
				attendanceGroupID="";
			 }
			}
		});
		
		$('button[name=salaryBack]').click(function(){
		//两种情况
		// 1.没有选中的情况
		// 2.选中的情况
			var self = this ;
			var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
			if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelSalary_i18n_3}); return ;};
			var sid=[];
			var Exchange_json=[];
			var fidJSON="";
			var proposerId = $('input[name=proposer]').val();
			var filterItems = that.getQuickFilterItems();
			if( filterItems == undefined)
			{ 
				filterItems = "" ;
			}
			sid = $("#reportGrid").jqGrid("getSelectedRows");
			for ( var i in sid)
			{
			    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
				var item = sid[i];
				var data = $("#reportGrid").jqGrid("getRowData", item);
				var recordId=data["FID"] ;
				var personId=data["FproposerID"];
				var periodName=data["FSalaryPeriod"];
				if(personId!=undefined && periodName!=undefined && recordId!=undefined)
				{
					Exchange_json.push({'fid':recordId,'personId':personId,'periodName':periodName});
				}
			}
			if(Exchange_json.length>0)
			{
				 fidJSON = $.toJSON(Exchange_json) ;
				 salaryBack(fidJSON,filterItems,proposerId);
			}else{
				 fidJSON = "All";
				 var mes= jsBizMultLan.atsManager_attendancePanelSalary_i18n_8;
					shr.showConfirm(mes,
					function(){
						salaryBack(fidJSON,filterItems,proposerId);
				});
			}
			 });
		 /*
		 $('button[name=query]').click(function()
		 {
			 that.queryAction();
		 })
		*/
	  	function salaryBack(fidJSON,filterItems,proposerId){
			 openLoader(1);
			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelDoSalaryHandler";
			 url +='&uipk=hr.ats.com.attendancePanelSalary';
			 var beginDate = $('input[name=beginDate]').val();
			 var endDate = $('input[name=endDate]').val(); 
			 shr.remoteCall({
					type:"post", 
					async:true,
					url:url,
					method:"cancelSalary",
					param : {
				 				beginDate : beginDate,
				 				endDate : endDate,
								fidJSON : fidJSON,
								orgLongNum:orgLongNum,  
								attendPolicyId:attendPolicyId,  //考勤制度
								attendPeriodId:attendPeriodId,	//考勤周期
								attendanceGroupID:attendanceGroupID,
								filterItems : filterItems ,
								proposerId: proposerId
							}, 
					success:function(res){
						closeLoader();
				    //window.parent.$("#operationDialog").dialog('close');
						$("#calendar_info").dialog("close");
						if (res.flag == 1){
						var tip ="";	
							if(res.List!= null)
							{
								var len = res.List.length ;
								if(len > 0){
									tip =jsBizMultLan.atsManager_attendancePanelSalary_i18n_0;
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
								    tip +=jsBizMultLan.atsManager_attendancePanelSalary_i18n_2;
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
							window.parent.$("#reportGrid").jqGrid('setGridParam', {
							    datatype : 'json',
							    postData : {
									'beginDate' : beginDate,
									'endDate' : endDate,
									'orgLongNum' :  orgLongNum,  
									'proposerId' :  proposerId,
									'attendPolicyId':attendPolicyId,
									'attendPeriodId':attendPeriodId,
									'attendanceGroupID':attendanceGroupID,
									'filterItems' : filterItems ,
									'NewRearch'  : 'newRearch'  ,
									'page' : 1
							     }, 
					     		page : 0 
				          })
						}else{
						shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelSalary_i18n_1});
							window.parent.$("#reportGrid").jqGrid('setGridParam', {
						    datatype : 'json',
						    postData : {
								'beginDate' : beginDate,
								'endDate' : endDate,
								'orgLongNum' :  orgLongNum,  
								'proposerId' :  proposerId,
								'attendPolicyId':attendPolicyId,
								'attendPeriodId':attendPeriodId,
								'attendanceGroupID':attendanceGroupID,
								'filterItems' : filterItems ,
								'NewRearch'   : 'newRearch'  ,
								'page' : 1
						      },
						      page : 0
					        });
					}
					 window.parent.jQuery('#reportGrid').jqGrid("reloadGrid");	
				 },
					error : function() {
						closeLoader();
					},
					complete : function() {
						closeLoader();
					}
				 
				})	
	 	}
  	},
  	
  	queryAction:function(){
  			var self=this;
	  		if($("#queryDiv").css("height")!="0px"){
//				$("#queryDiv").animate({height:"0px"},500,function(){
//					self.getGridData();
//				});
				self.getGridData();
			}else{
				$("#queryDiv").animate({height:transition});
				$("#unfold").html("");
			}
  	}
  	,	//根据考勤制度获取考勤周期明细 
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
	  		var flag=true;
			$("input[name='attendPeriod']").empty();
			var selectFlag=true;
			if(len>0){ 
				var json=[]; 
				var select_json=[];
				
				// 考勤周期 删掉重新生成节点
				$("input[name='attendPeriod']").remove();
				// 考勤周期 删掉重新生成节点
				$("div[title='"+jsBizMultLan.atsManager_attendancePanelSalary_i18n_5+"']")
					.parent().next().find("div[class='ui-text-frame disabled']").append("<input type='text' disabled='disabled' class='block-father input-height' name='attendPeriod'></input>");
				
				for(var i=0;i<len;i++)
				{	
					var currentDay=self.initCurrentDate();
					if(res[i].name == currentDay)
					{	
							selectFlag=false;
							$("input[name='attendPeriod']").val(currentDay+" ( "+res[i].beginDate+" -- "+res[i].endDate+" )");
							$("input[name=beginDate]").val(res[i].beginDate);
							$("input[name=endDate]").val(res[i].endDate);
							attendPeriodId=res[i].id;  
					} 
					select_json.push({'value': res[i].id, 'alias': res[i].name+" ( "+res[i].beginDate+" -- "+res[i].endDate+" )"});
				}
				json.data=select_json;
					
				$("input[name='attendPeriod']").shrSelect(json);
				// 考勤周期 删掉重新生成节点
				if($("div[class='ui-select-frame']").size() == 2)
				{
					$("div[class='ui-select-frame']").eq(0).remove();
				}
				//$("input[name='attendPeriod']").shrSelect(json);
				if(selectFlag) 
				{   
					$("input[name='attendPeriod']").val("");
					$("input[name=beginDate]").val("");
					$("input[name=endDate]").val("");   
				}
				$("input[name='attendPeriod']").css("position","relative").css("width","100%");
				$("input[name='attendPeriod']").change(function(){
					var dateText = $("input[name='attendPeriod']").val() ;
					dateText = dateText.substring(dateText.indexOf('(')+1,dateText.indexOf(')'));
					//var dateText=$("input[name='attendPeriod']").val();
					var dateStr=dateText.split("--");
					$("input[name=beginDate]").val(dateStr[0].trim()); 
					$("input[name=endDate]").val(dateStr[1].trim());
					attendPeriodId=$("input[name='attendPeriod_el']").val();
					
	 			});
			}else{
				shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelSalary_i18n_6});
				flag=false ;
			}
			return flag; 
  	},
	onNext:function(_wizard){
			_wizard.setParm("LongNumber",orgLongNum);
			_wizard.setParm("adminOrgName",$('input[name=AdminOrgUnit]').val());
			_wizard.setParm("name",$('input[name=proposer]').val());
			
			_wizard.setParm("attendPolicyId",attendPolicyId);
			_wizard.setParm("attendPolicyName",$('input[name=attencePolicy]').val());
			_wizard.setParm("attendanceGroupName",$('input[name=prop_attencegroup]').val());
			_wizard.setParm("periodId",attendPeriodId);
			_wizard.setParm("periodName",$('input[name=attendPeriod]').val());
			_wizard.setParm("beginDate", $('input[name=beginDate]').val());
			_wizard.setParm("endDate", $('input[name=endDate]').val());
			_wizard.setParm("attenceCycleId", attenceCycleId);
			return {status: 1};
	},
	//组织的编号和考勤制度的id为全局变量
	onNaviLoad:function(_navi){  
		step=_navi._index;
	  	var that=this;
	  	var adminOrgLongNum=_navi.getParm("LongNumber");
	  	var adminOrgName=_navi.getParm("adminOrgName");
	  	var name=_navi.getParm("name");
	  	
	  	var attendancPolicyId=_navi.getParm("attendPolicyId");
       	var attendancPolicyName=_navi.getParm("attendPolicyName");
       	var attendanceGroupName=_navi.getParm("attendanceGroupName");	
       	var attendancePeriod=_navi.getParm("periodName");
       	var strBeginDate = _navi.getParm("beginDate");
       	var strEndDate = _navi.getParm("endDate");
       	if(strBeginDate == undefined && strEndDate== undefined)
       	{
       		 //开始近来设置其默认值，默认组织，默认考勤制度，考勤周期，开始，结束日期 ;
			that.initDefaultFilter();
       	}else{
			orgLongNum=adminOrgLongNum;
			$('input[name=AdminOrgUnit]').val(adminOrgName);
			$('input[name=proposer]').val(name);
			attendPolicyId=attendancPolicyId;
			that.getAttenceCycle(attendPolicyId); // 获取该明细
//			$('input[name=attencePolicy]').val(attendancPolicyName);
			$('input[name=prop_attencegroup]').val(attendanceGroupName);
			$('input[name=attendPeriod]').val(attendancePeriod);
			$('input[name=beginDate]').val(strBeginDate);
			$('input[name=endDate]').val(strEndDate); 
			var policyValue = {
					id : attendPolicyId,
					name : attendancPolicyName,
					stepChange:1,
					"attenceCycle.id" : _navi.getParm("attenceCycleId")
			}; 
			$('input[name=attencePolicy]').shrPromptBox("setValue", policyValue);
       	}
       	attendPeriodId=_navi.getParm("periodId"); 
		that.renderDataGrid(); 
	},
	//首次进来时，设置其默认值
	initDefaultFilter:function(){
		 var self=this;
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryResultHelper&method=initDefaultFilter";
		 shr.ajax({
				type:"post",
				async:false,
				url:url,
				success:function(res){
					var info = res;
					if(info.length==3){
						var orgValue = {
							id : info[0].orgID,
							name : info[0].orgName,
							longNumber:info[0].longNumber
						}; 
						$('input[name=AdminOrgUnit]').shrPromptBox("setValue", orgValue);
						var policyValue = {
							id : info[1].id,
							name : info[1].name,
							"attenceCycle.id" : info[1]["attenceCycle.id"]
						};
						$('input[name=attencePolicy]').shrPromptBox("setValue", policyValue);
						self.showAttenceCycleItem(info[2]);
					} 
			    }
		 });			
	},
	initCurrentDate : function() {
		var curDate = new Date();
		var curDateY = curDate.getFullYear();
		var curDateM = curDate.getMonth() + 1;
		curDateM = curDateM < 10 ? "0" + curDateM+"" : curDateM+"";
		return curDateY+curDateM;
	},
	 //* 设置表头
	 //* 根据前台查询的需要设置不同的表头
	 //* 表头主要是由三部分组成的
	 //*  1、固定列（姓名和编号）2、汇总项 3、日期范围
	 //*  汇总项直接在后台访问生成
	 //*  日期范围必须有用户从前台选择生成
	renderDataGrid : function() {
		var self = this;
		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		self.remoteCall({
					method : "getGridColModel",
					success : function(reponse) {
						self.doRenderDataGrid(reponse);
					}
				});
	},
	
	/**
	 * 表格数据请求URL
	 */
	getGridDataRequestURL : function() {
		return this.dynamicPage_url + "?method=getGridData" + "&uipk="+ this.reportUipk;
	}
	 ,
	doRenderDataGrid : function(reponse) {
		var self = this;
		var table = $("#reportGrid");
		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val(); 
		var proposerId = $('input[name=proposer]').val();
		var url = self.getGridDataRequestURL();
		var colNames = reponse.colNames;
		var colModel = reponse.colModel; 
		var filterItems = self.getQuickFilterItems();
		if( filterItems == undefined)
		{ 
			filterItems = "" ;
		}
		postData = {
				beginDate : beginDate,
				endDate : endDate,
				orgLongNum : orgLongNum ,
				proposerId : proposerId ,
				attendPolicyId : attendPolicyId ,
				attendPeriodId : attendPeriodId , 
				attendanceGroupID:attendanceGroupID,
				filterItems : filterItems 
		}
		var options = {
			/*
			url : url + '&orgLongNum=' + orgLongNum + '&proposerId=' + encodeURIComponent(proposerId)
					+ '&attendPolicyId=' + encodeURIComponent(attendPolicyId) + '&attendPeriodId=' + encodeURIComponent(attendPeriodId),
			*/		
			url : url ,
			datatype : "json",  
			multiselect : true, 
			rownumbers : false,
			colNames : colNames,
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			pager : '#gridPager1',
			height : 'auto',
			postData : postData,
			rowList : [15, 30, 45, 60],
			gridview : true,
			pginput : true,
			shrinkToFit : reponse.colModel.length > 10 ? false : true,
			viewrecords : true,
			// cellEdit:true,
			// caption: "Frozen Header", 
			
			grouping : true,
			groupingView : {
				groupField : ['orgName'],
				groupColumnShow : [false],
				groupText : ['<b>{0}</b>'], 
				groupCollapse : false,
				groupOrder : ['asc'],
				groupSummary : [true],
				groupDataSorted : true,
				showSummaryOnHide : true
			},
		
			onCellSelect : function(rowid, index, contents, event) {
				
			},
			onSelectRow : function(id) {
				
			},

			editurl : this.dynamicPage_url + "?method=editRowData" + "&uipk="+ this.reportUipk

		};
		options.loadComplete = function(data) {
			self.handleMicroToolbarInfo();
		
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
		$('#microToolbar').html("");
		$('#microToolbar').append(html);

		$("#gripage").on("click", self.selectRowNumPerPage);
		$("#prevId").on("click", self.prePage);
		$("#nextId").on("click", self.nextPage);

		// 页码 (1-4)/4
		self.updatePageEnable();
		var temp = $("#gridPager1_center >div[dir='ltr']").text();
		if(temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_11)== -1){
			var first=temp.substring(0,temp.indexOf('-')).trim();
			var second=temp.substring(temp.indexOf('-')+1
				,temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_4)).trim();
			var three=temp.substring(temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_4)+1
				,temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_10)).trim();
			temp="("+first+"-"+second+")/"+three;
		}
		$("#gripage").text(temp);  
		$("#gridPager1").hide();
		
	$("#reportGrid").find("tr[class='ui-widget-content jqfoot ui-row-ltr']").find('td').css("border","0px");
	$("#reportGrid").find("tr[class='ui-widget-content jqfoot ui-row-ltr']").css("border","0px");
	$('tr[id^=reportGridghead]').removeClass('ui-widget-content jqgroup ui-row-ltr');
	},
	updatePageEnable : function() {
		//（1 - 1　共 1 条）
		var temp = $("#gridPager1_center >div[dir='ltr']").text();
		if(temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_11)== -1){
			var first=temp.substring(0,temp.indexOf('-')).trim();
			var second=temp.substring(temp.indexOf('-')+1
				,temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_4)).trim();
			var three=temp.substring(temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_4)+1
				,temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_10)).trim();
			temp="("+first+"-"+second+")/"+three;
		}
		// (1-1)/1
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
	getCurPage : function() {
		// (1-4)/4
		var self = this, rowNum = self.rowNumPerPage;
		var temp = $("#gridPager1_center >div[dir='ltr']").text();
		if(temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_11)== -1){
			var first=temp.substring(0,temp.indexOf('-')).trim();
			var second=temp.substring(temp.indexOf('-')+1
				,temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_4)).trim();
			var three=temp.substring(temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_4)+1
				,temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_10)).trim();
			temp="("+first+"-"+second+")/"+three;
		}  
		//var temp = $("#gridPager1_left >div[dir='ltr']").text();
		var curPageNum = (parseInt(temp.substring(1, temp.indexOf('-'))) - 1)/ rowNum + 1;
		return curPageNum;
	},
 
	prePage : function() {
		// this.verifyStartTime();
		$("#prev_gridPager1").trigger("click");
		shr.setIframeHeight();
		var temp = $("#gridPager1_center >div[dir='ltr']").text();
		if(temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_11)== -1){
			var first=temp.substring(0,temp.indexOf('-')).trim();
			var second=temp.substring(temp.indexOf('-')+1
				,temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_4)).trim();
			var three=temp.substring(temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_4)+1
				,temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_10)).trim();
			temp="("+first+"-"+second+")/"+three;
		}  
		$("#gripage").text(temp);
	},

	nextPage : function() {
		$("#next_gridPager1").trigger("click");
		shr.setIframeHeight();
		var temp = $("#gridPager1_center >div[dir='ltr']").text();
		if(temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_11)== -1){
			var first=temp.substring(0,temp.indexOf('-')).trim();
			var second=temp.substring(temp.indexOf('-')+1
				,temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_4)).trim();
			var three=temp.substring(temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_4)+1
				,temp.indexOf(jsBizMultLan.atsManager_attendancePanelSalary_i18n_10)).trim();
			temp="("+first+"-"+second+")/"+three;
		}  
		$("#gripage").text(temp);
	},
	
	exportToExcelAction : function () {
		var self = this ;
		var url = self.exportCommonParam();

		//拼接查询条件
		//url = url + '&beginDate=' + beginDate + '&endDate=' + endDate + '&orgLongNum=' + encodeURIComponent(orgLongNum) + '&proposerName=' + encodeURIComponent(proposerName1),
		/*
		url += "&queryMode=";
		var colModel = $grid.jqGrid("getGridParam", "colModel");
		for (var i = 0; i < colModel.length; i++) {
			var optionColumn = colModel[i];
			var hidden = optionColumn.hidden,
			label = optionColumn.label || optionColumn.name,
			index = optionColumn.index,
			dataColumnType = optionColumn.dataColumnType;
			if (index != null && index != "") {
				url += index + "," + hidden + "," + label + "," + dataColumnType + ";";
			}
		}
		  /*
		  shr.ajax({
			type:"post",
			url:url, 
			success:function(res){ 
				closeLoader();
		    },
		    error : function(){
		    	closeLoader();
		    }
		});
		*/ 
		document.location.href = url;
	},exportCurrentAction : function(){
			var _self = this ;
			var personIds = [] ;
		 	sid = $("#reportGrid").jqGrid("getSelectedRows");
			for ( var i in sid)
			{
		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
				var item = sid[i];
				var data = $("#reportGrid").jqGrid("getRowData", item)["FID"];
				personIds.push(data);
			}
			if(personIds.length > 0){
				var url = _self.exportCommonParam();
				url = url+'&personIds='+encodeURIComponent(personIds.join(','));
				document.location.href = url;
			}else{
				shr.showWarning({
					message: jsBizMultLan.atsManager_attendancePanelSalary_i18n_7
				});
			}
	},
	exportCommonParam : function(){
		
		var self = this ;
		$grid = $('#reportGrid');
		postData = $grid.jqGrid("getGridParam", "postData");
		var proposerId = $('input[name=proposer]').val();
		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		
//		url = shr.getContextPath() + shr.dynamicURL + "?method=exportToExcel";
		url =  this.dynamicPage_url + "?method=exportToExcel" + "&uipk="+ this.reportUipk;
		
		var filterItems = self.getQuickFilterItems();
		if( filterItems == undefined)
		{ 
			filterItems = "" ;
		}
		
		//标题
		// url += "&title=已转薪资"; 
		// set PostData
		$grid._pingPostData(postData);

		var param = postData;
		if (param.queryMode) {
			delete param.queryMode
		}
		if (!param.uipk) {
			param.uipk = self.reportUipk;
		} 

		param.downSum = $('#downSum').attr('checked') == "checked" ? 1 : 0;
        if(window.isShrSensitiveRuleOpen) {
            fieldSensitiveService.setExportPsw(function (psw) {
                param.exportPrivteProtected= psw
            });
        }
		param.isAll = true; 
		url += "&" + $.param(param);
		
		url = url + '&beginDate=' + beginDate +'&endDate=' + endDate +'&orgLongNum=' + orgLongNum + '&proposerId=' + encodeURIComponent(proposerId)
					+ '&attendPolicyId=' + encodeURIComponent(attendPolicyId)+ '&attendanceGroupID=' + encodeURIComponent(attendanceGroupID) + '&attendPeriodId=' + encodeURIComponent(attendPeriodId)+"&filterItems1="+encodeURIComponent(filterItems);
	
		return url ;
	}
	//隐藏查询项
 	 ,queryDivInit : function () {
 		var self=this;
 		$("#queryDiv").append('<div><a title="'
			+ jsBizMultLan.atsManager_attendancePanelSalary_i18n_9
			+ '" id="packUp" href="#" class="packUp"></a></div>');
 		$('<span id="unfold">▼</span>').insertBefore("button[name^=salaryBack]")
 		$("#unfold").css({
			"width": "20px",
		    "height": "20px",
		    "position": "absolute",
			"margin-left": "-21px",
			"margin-top": "4px",
			"color":"white"
 		});
// 		$("#queryDiv").append('<div><button type="button" class="shrshrbtn-primary shrbtn" name="确定" id="confirmQuery">确定</button></div>');
		transition=$("#queryDiv").css("height");
 		$("#queryDiv").css({"height":"0px","overflow":"hidden","width":"100%","margin-top":"15px"});
		var cssObj={
			"width": "20px",
		    "height": "20px",
			"float":"left",
			"margin-top":"-28px",
			"margin-left": "18px",
			"background": 'url("/shr/addon/attendmanage/web/resource/images/up.png") no-repeat'
		}
		$("#packUp").css(cssObj);
		$('#packUp').click(function() {
			$("#queryDiv").animate({height:"0px"},500,function(){
//				self.getGridData();
			});
			$("#unfold").html("▼");	
		});
		$("#unfold").click(function(){
			self.queryAction();
		});
		$("div[class^='col-lg-2']").css({width:"4%"});
		$(".col-lg-4").css({width: "12%"});
 	 } 
 	 ,getGridData:function(){
 		var self = this ;
 		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
			var proposerId = $('input[name=proposer]').val();
		var filterItems = self.getQuickFilterItems();
		if( filterItems == undefined)
		{ 
			filterItems = "" ;
		}
		$("#reportGrid").jqGrid('setGridParam', {
			datatype : 'json',
			/*
			postData : {
					'orgLongNum1' :  orgLongNum,  
					'proposerId1' :  proposerId,
					'attendPolicyId1':attendPolicyId,
					'attendPeriodId1':attendPeriodId,
					'NewRearch'   : 'newRearch'  ,
					'page' : 1
			},
			*/
			postData : {
				beginDate : beginDate,
				endDate : endDate,
				orgLongNum : orgLongNum ,
				proposerId : proposerId ,
				attendPolicyId : attendPolicyId ,
				attendPeriodId : attendPeriodId ,
				attendanceGroupID:attendanceGroupID,
				filterItems : filterItems ,
				'page' : 1	
			} ,
			page : 0
		});
		$("#reportGrid").trigger("reloadGrid");
 	 }
});




