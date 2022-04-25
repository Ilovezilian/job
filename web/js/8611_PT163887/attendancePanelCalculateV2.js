var sidValue = [];
var step=1;
var addRowID=1;
var type=2;
// 设置组织编码
var orgLongNum="";
// 只有在全部重算的时候，使用 组织ID 
var orgAdminId=""; 
var attendPolicyId="";  
var isConfirm = true;
var currentIsConfirm = true;
var attendPeriodId="";
var attenceCycleId="";
var hrOrgUnitId = "";
var attendanceGroupID="";
var indexMonth="";
var indexYear=""; 
var indexNextMonth="";
var selfNavi = "" ;  // 保存每次下一步进来的参数
var atsCalGobalParam;//查看流程单据传递参数
var _events = []; 
var selectStates="";//已计算页面--明细显示所选的状态
var isCalShowDetail=false;//已计算页面--是否明细显示
var refresh = 1 ;  //是否刷新
var defineClass;
var attendNameOnSelect;//点击项目查看汇总时记录所选项目
var isDetailOnProject=false;//是否点击项目查看汇总标记
var isBackShow=false;//明细弹出框是否显示返回按钮
var	detailInfoPattern = '<div><span>${name}</span>' 
					+ '<span style="margin-left:15px;">${beginTime}</span><span >--</span><span >${endTime}</span>'
					+ '<span style="margin-left:15px;">${length}</span><span style="margin-left:0px;"">${unit}</span>' 
					+ '<span style="margin-left:15px;">${otType}</span>'
					+ '<span style="margin-left:15px;">${state}</span>'
					+ '<div style="width: 90%;margin-left:0px;">${description}</div></div>'
var	tripBillPattern = '<div>'
					+ '<div><span style="margin-left:10px;">${startPlace}</span>'
					+ '<SPAN style="margin-left:2px;">${endPlace}</SPAN>'  
					+ '<span style="margin-left:15px;">${beginTime}</span><span >--</span><span >${endTime}</span>'
					+ '<span style="margin-left:15px;">${length}</span><span style="margin-left:0px;"">${unit}</span>' 
					+ '<span style="margin-left:15px;">${state}</span>'
					+ '</div>'
					+ '<div style="width: 90%;margin-left:10px;">${reason}</div>'
					+ '<div style="width: 90%;margin-left:10px;">${description}</div></div>'
var bigTitlePattern      = '<div class="bigTitle"><span>${titleName}</span></div>';
var bigTitleLinkPattern  = '<div class="bigTitle"><span id=${id}><a>${titleName}</a></span></div><div id=${contentId} style="position:relative;"></div>';

var smalTitlePattern = '<div  class=${className} name=${colNumber}>' 
					 + '<span class="spanRight">${colName}</span>'
				     + '<span class="spanLeft">${colAttendVal}</span>' 
					 + '</div>'
var smalTitlePattern1 = '<div  class=${className} name=${colNumber}>' 
					 + '<span class="spanRight1">${colName}</span>'
				     + '<span class="spanLeft1">${colAttendVal}</span>' 
					 + '</div>'	
var ats_beginDate = "";
var ats_endDate = "";
shr.defineClass("shr.ats.attendancePanelCalculate",shr.framework.List, {
	
	showAttendJson : null ,
	attendMap : [] ,
	isReload : false ,
	reportUipk : "hr.ats.com.attendancePanelCalculate",
	rowNumPerPage : 15,
	hideButtonId : "" ,
	
	initalizeDOM : function() {
		var that = this;
		defineClass=that;
		$('#calendar_info').remove();
		$('#mainTitle').remove(); 
		$('#operationDialog').append("<div id='calendar_info'></div>");
		$('#main').append("<div id='mainTitle'></div>");  // 主要解决多节点问题
		$('#operationDialog').css("display","none");
		$('#main').css("display","none");
		//$("#calendar_info").empty(); 
		that.processF7ChangeEvent();	
		that.processHrOrgUnitF7ChangeEvent();
		shr.ats.attendancePanelCalculate.superClass.initalizeDOM.call(this);
//		$("#breadcrumb").empty();
//		that.initBreadCrumb();
		that.initEvent();
//		$("#breadcrumb").remove();
		//that.initDefaultTitle();
//		$("body").css({"overflow-y":"scroll"});
		$(window).resize(function(){
			if(parseFloat($("#home-wrap").css("margin-right"))<30){
				$("#home-wrap").css({"margin-left":"30px"});
			}else{
				$("#home-wrap").css({"margin-left":"auto"});
			}
			$("#sidebar").css({"width":$("#home-wrap").css("margin-left")});
		});
		jsBinder.gridLoadComplete=function(data){
			$("#sidebar").show();
			$("#sidebar").css({"width":parseFloat($("#home-wrap").css("margin-left"))+30+"px"});
			$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
		};
		
		$("#pageTabs").tabs(); 
		//that.initSearchLabel();
		that.queryDivInit();
		that.onNaviLoad(null);

		hideButtonId = this.initData.atsCalButton ;
		that.hideNotAccessButton();
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttenceStateEditHandler";
		//拼接考勤状态复选框html
		shr.remoteCall({
			url:url,
			type : "post",
			asycn:false,
			param : {
				serviceId : shr.getUrlRequestParam("serviceId")
			},
			method : "getAttenceState",
			success : function(res) {
				var stateHtml="";
				if(res!=null && res.length>0){
					for(var i=0;i<res.length;i++){
						stateHtml+="<div title="
							+ shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_29,[res[i].field,"&quot;","&quot;"])
							+ " style='vertical-align: middle;display:inline-block'><input name='attenceState' style='margin:0 0 4px 10px'  type='checkbox' value='"+res[i].value+"' /><span style='vertical-align: baseline;padding-left:3px'>"+res[i].key+"</span></div>";
					}
					$("#attenceStateDiv").html(stateHtml);
					$("input[name='attenceState']").change(function() { 
						selectStates="";
						 $('input[name="attenceState"]:checked').each(function(){    
							 selectStates+="'"+$(this).val()+"'";  
							 selectStates+=",";
						 });
						 selectStates=selectStates.substring(0,selectStates.length-1);
						 $('#datagrid').empty();
						 $('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>'); // 表头是可变的，所以要动态生成节点
						 that.renderDataGrid(9);
					}); 
				}
			}
		});
		that.initialQueryFilterParam();//流程单据检查，通过点击面包屑回到考勤计算页面 --带出之前设置的查询参数
		that.removeQueryFilterParam();
		
	},
	//设置业务组织onchange事件
	processHrOrgUnitF7ChangeEvent:function(){
		var that = this;
		$("#hrOrgUnit").shrPromptBox("option", {
			onchange : function(e, value) {
				var info = value.current;
				if(info != undefined){
					that.initHrOrgUnit(info.id);					
				}
			}
		});
	},
	//初始化业务组织
	initHrOrgUnit:function(hrOrgUnitId){
		var that = this;
		$("#attencePolicy").shrPromptBox("setBizFilterFieldsValues",hrOrgUnitId);
	},
	//设置高级查询 
	initalSearch : function(type){
		$('<div id="searcher" class="pull-right" style="padding:0 2px 0 10px;"></div>').insertAfter($('#currentTile'));
		
		var searcherFields = [];
		searcherFields[0] = {columnName:"name",label:jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_192};
		searcherFields[1] = {columnName:"number",label:jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_201};
	
		if(type==2){//已计算，明细模式
			var options = {
					gridId: "reportGrid",
					uipk: "com.kingdee.eas.hr.ats.app.AttenceResult.list",
					query: "" ,
					fields :searcherFields,
					propertiesUrl: shr.getContextPath()+'/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttenceResult.list&method=getProperField'
				};
		}else{
			var options = {
					gridId: "reportGrid",
					uipk: "com.kingdee.eas.hr.ats.app.AttendanceResultSumList",
					query: "" ,
					fields :searcherFields,
					propertiesUrl: shr.getContextPath()+'/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttendanceResultSumList&method=getProperField'
			};
		}
		
	
		$("#searcher").shrSearchBar(options);
		if(type!=2){
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
		
	} ,

	hideNotAccessButton :function(){
	
	   var ids = hideButtonId ;
	   for(var id in ids )
	   {
	   	$("button[id='"+ids[id]+"']").hide() ;
	   }
	}
	
	,initBreadCrumb: function(){
	 	var that = this;
		//形成主页
	 	$('#mainLink').remove();
	 	$('#currentTile').remove();
		/*
		var breadCrumbStr = '<div id="mainLink" style="float:left;padding:10px 2px 0 10px;"><a href="javascript:void(0);" ' 
				   + '	class="active" style="font-size:16px!important;color:#0088cc;">主页</a> '
				   + '<span style="padding:0 5px;color:#ccc">/</span></div>';
				   
		$('#breadcrumb').before(breadCrumbStr);
		*/
		//获取当前选中的主题
		var currentTile = $('div[class="wz_navi_step enabled selected"]').find('.title').text();
		var breadCrumbStr = '<div id="currentTile" class="active" style="float:left;font-size:16px;padding-top:10px;color:#999;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_102
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
	initSearchLabel: function(){
		var divHtml = '<div data-ctrlrole="labelContainer">'
			+ '<div class="col-lg-4">'
			+	'<div class="field_label" title="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_192
			+ '">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_192
			+ '</div>'
			+ '</div>'				
			+ '<div class="col-lg-6 field-ctrl">'
	        + '<div class="ui-text-frame"><input id="proposer" class="block-father input-height" type="text" name="proposer" validate="" '+'value="" placeholder="" dataextenal="" ctrlrole="text" style="width: 276px;"></div>'
			+	'</div>'
			+	'<div class="col-lg-2 field-desc"></div>'
			+ '</div>"';
		var divLabelObj = $(divHtml);
		divLabelObj.insertAfter($("div[data-ctrlrole='labelContainer']")[1]);
		divHtml = '<div data-ctrlrole="labelContainer">'
			+ '<div class="col-lg-4">'
			+ '</div>'				
			+ '<div class="col-lg-6 field-ctrl">'
	        + '<button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_28
			+ '" id="query">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_28
			+ ' </button></div>'
			+	'<div class="col-lg-2 field-desc"></div>'
			+ '</div>"';
		divLabelObj = $(divHtml);
		divLabelObj.insertAfter($("div[data-ctrlrole='labelContainer']")[6]);
	},
	
	//未计算人员列表展示 及其 列表数据展示
	attendPersonList: function(){
		
		    var serviceId = shr.getUrlRequestParam("serviceId");
				
			var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AttendanceBoardList$fragment','view');
			url += '&serviceId='+encodeURIComponent(serviceId);
			shr.loadHTML({ 
				url : url,
				success : function(response) {
					$('#datagrid').empty();
					$('#mainTitle').empty();
					$('#calendar_info').empty();
					$('#microToolbar').empty();
					$('#datagrid').append(response);
					$("#sidebar").hide();
					$('#microToolbar').removeClass("ui-state-default ui-jqgrid-pager ui-corner-bottom");
					$('#pg_microToolbar').find('tbody').css('float','right');
					$('#pg_microToolbar').find('tbody').addClass('shrPage page-Title');
					$('#microToolbar_left').find('div').addClass('showBreakPage');
					$('#microToolbar_right').remove();
					$('#last_microToolbar').next().remove();
-					$('#last_microToolbar').remove();
-					$('#first_microToolbar').remove();
					$('#datagrid').find("div[class='row-fluid row-block view_manager_body']").addClass('moveUp');
					$('#dataBox').css({"margin-top":"-5px"});
				}
			});
	
	},
	
	//点击带计算按钮 出现的列表
	waitCalPersonList: function(){
		
		var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.attendancePanelWaitCal.list$fragment','view');
		
		shr.loadHTML({ 
			url : url,
			success : function(response) {
				$('#datagrid').empty();
				$('#mainTitle').empty();
				$('#calendar_info').empty();
				$('#microToolbar').empty();
				$('#datagrid').append(response);
				$("#sidebar").hide();
				$('#microToolbar').removeClass("ui-state-default ui-jqgrid-pager ui-corner-bottom");
				$('#pg_microToolbar').find('tbody').css('float','right');
				$('#pg_microToolbar').find('tbody').addClass('shrPage page-Title');
				$('#microToolbar_left').find('div').addClass('showBreakPage');
				$('#microToolbar_right').remove();
				$('#last_microToolbar').next().remove();
				$('#last_microToolbar').remove();
				$('#first_microToolbar').remove();
				$('#datagrid').find("div[class='row-fluid row-block view_manager_body']").addClass('moveUp');
				$('#dataBox').css({"margin-top":"0px"});
			}
		});

	},
	processF7ChangeEvent : function(){ 
		var that = this;
		$('input[name=AdminOrgUnit]').shrPromptBox("option", {
			onchange : function(e, value) {
			   var info = value.current;
			   if(info!=null){
				   /*if(info.longNumber !=null && info.longNumber!=''){ 
				   		orgLongNum=info.longNumber;
				   		$("input[name='adminOrgUnit.longNumber']").val(orgLongNum) ;
				   }*/
			    }
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
					that.getIsConfirm(attendPolicyId);
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
		$('input[name=beginDate]').change(function(){
			var dateText = $("input[name='attendPeriod']").val() ;
			if(dateText!=null && dateText!=""){
			    dateText = dateText.substring(dateText.indexOf('(')+1,dateText.indexOf(')'));
				var dateStr=dateText.split("--");
				var beginDateStr=$("input[name=beginDate]").val(); 
				var endDateStr=$("input[name=endDate]").val(); 
				if(beginDateStr!=null && beginDateStr.trim()!=""){
					var beginDate=new Date(beginDateStr);
					var checkBeginDate=new Date(dateStr[0].trim());
					if ( beginDate < checkBeginDate ){
						shr.showError({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_176});
						$("input[name=beginDate]").val(dateStr[0].trim());
						return;
					}
					//判断开始结束时间
					if(endDateStr!=null && endDateStr.trim()!=""){
						var endDate=new Date(endDateStr);
						if(beginDate>endDate){
							shr.showError({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_177});
							$("input[name=beginDate]").val(dateStr[0].trim());
							return;
						}
					}
				}
			}
		});
		$('input[name=endDate]').change(function(){
			var dateText = $("input[name='attendPeriod']").val() ;
			if(dateText!=null && dateText!=""){
			    dateText = dateText.substring(dateText.indexOf('(')+1,dateText.indexOf(')'));
				var dateStr=dateText.split("--");
				var beginDateStr=$("input[name=beginDate]").val(); 
				var endDateStr=$("input[name=endDate]").val(); 
				if(endDateStr!=null && endDateStr.trim()!=""){
					var endDate=new Date(endDateStr);
					var checkEndDate=new Date(dateStr[1].trim());
					if ( endDate > checkEndDate ){
						shr.showError({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_174});
						$("input[name=endDate]").val(dateStr[1].trim());
						return;
					}
					//判断开始结束时间
					if(beginDateStr!=null && beginDateStr.trim()!=""){
						var beginDate=new Date(beginDateStr);
						if(endDate<beginDate){
							shr.showError({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_175});
							$("input[name=endDate]").val(dateStr[1].trim());
							return;
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
  	//根据考勤制度id获取是否开启考勤确认
  	getIsConfirm:function(attendPolicyId){
  		var self = this;
  		if(attendPolicyId!=undefined){
			self.remoteCall({
			  	type : "post",
			  	method : "isConfirm",
			  	param : {
			  			id:attendPolicyId
			  	},
			  	success : function(res){
						if(res.flag ==1 ){
							isConfirm = true;
						}else{
							isConfirm = false;
						}
			  		}
			   })  		
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
				$("div[title='"+jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_119+"']")
					.parent().next().find("div[class='ui-text-frame disabled']")
					.append("<input type='text' class='block-father input-height' name='attendPeriod'></input>");
				
			//	var currentDay=self.initCurrentDate();
				for(var i=0;i<len;i++)
				{	
					//if(res[i].name == currentDay) // 如果开始日期和结束日期在当前日期之内
					if(self.checkCurrentDateRange(res[i].beginDate,res[i].endDate))
					{	
							selectFlag=false;
							$("input[name='attendPeriod']").val(res[i].name+" ( "+res[i].beginDate+" -- "+res[i].endDate+" )");
							$("input[name=beginDate]").val(res[i].beginDate);
							$("input[name=endDate]").val(res[i].endDate);
							attendPeriodId=res[i].id;  
					}
					// select_json.push({'value': res[i].beginDate+"_"+res[i].endDate+"_"+res[i].id, 'alias': res[i].name+" ( "+res[i].beginDate+" -- "+res[i].endDate+" )"});
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
				$("input[name='attendPeriod']").css("position","relative").css("width","100%").css("color","#333333");
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
				shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_122});
				flag=false ;
			}
			return flag; 
  	},
	onNext:function(_wizard){
			_wizard.setParm("LongNumber",orgLongNum);
			_wizard.setParm("adminOrgName",$('input[name=AdminOrgUnit]').val());
			_wizard.setParm("name",$('input[name=proposer]').val());
			_wizard.setParm("attendPolicyId",attendPolicyId);
			_wizard.setParm("attendanceGroupID",attendanceGroupID);
			_wizard.setParm("attendanceGroupName",$('input[name=prop_attencegroup]').val());
			_wizard.setParm("attendPolicyName",$('input[name=attencePolicy]').val());
			_wizard.setParm("periodId",attendPeriodId);
			_wizard.setParm("periodName",$('input[name=attendPeriod]').val());
			_wizard.setParm("beginDate", $('input[name=beginDate]').val());
			_wizard.setParm("endDate", $('input[name=endDate]').val());
			_wizard.setParm("attenceCycleId", attenceCycleId);
			_wizard.setParm("hrOrgUnitId", hrOrgUnitId);
			//$("#pageTabs").hide();
			return {status: 1};
	},
	
	//已计算页签--明细显示的按钮控制
	showDetailButton:function(isShow){
		if(isShow){
			$("#leaveBill").show();
			$("#fillSignCard").show();
			$("#tripBill").show();
			$("#overTimeBill").show();
			$("#billBtnGroup").show();
			$("#switchDetail").show();
			$("#attenceStateDiv").show();
			$("#scheduleShiftBtnGroup").show();
			$("#moreBtnGroup").show();
			$("#pressToConfirm").show();
			$("#changeAttenceOrg").show();
			$("#attendanceResultExportBtnGroup").show();	
			$("#attendanceResultImport").show();
			
			//开始时间
			$("#queryDiv > div:eq(2) > div:eq(0)").show();
			//结束时间
			$("#queryDiv > div:eq(2) > div:eq(1)").show();
		}
		else{
			$("#leaveBill").hide();
			$("#fillSignCard").hide();
			$("#pressToConfirm").hide();
			$("#tripBill").hide();
			$("#overTimeBill").hide();
			$("#billBtnGroup").hide();
			$("#switchDetail").hide();
			$("#attenceStateDiv").hide();
			$("#scheduleShiftBtnGroup").hide();
			$("#moreBtnGroup").hide();
			$("#changeAttenceOrg").hide();
			$("#attendanceResultExportBtnGroup").hide();
			$("#attendanceResultImport").hide();	
			//开始时间
			$("#queryDiv > div:eq(2) > div:eq(0)").hide();
			//结束时间
			$("#queryDiv > div:eq(2) > div:eq(1)").hide();
			var dateText = $("input[name='attendPeriod']").val() ;
			if(dateText!=null && dateText!=""){
			    dateText = dateText.substring(dateText.indexOf('(')+1,dateText.indexOf(')'));
				//var dateText=$("input[name='attendPeriod']").val();
				var dateStr=dateText.split("--");
				$("input[name=beginDate]").val(dateStr[0].trim()); 
				$("input[name=endDate]").val(dateStr[1].trim());
			}
		}
	},
	
	//组织的编号和考勤制度的id为全局变量
	onNaviLoad:function(_navi){
		$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
	  	var that=this;
       	that.initDefaultTitle();
       	//开始近来设置其默认值，默认组织，默认考勤制度，考勤周期，开始，结束日期 ;
       	that.initDefaultFilter();
		that.onclickAttendProject();  // 修改汇总显示和明细显示的顺序
		//that.getJqgridData(1);		
		$("#pageTabs").find('ul li').eq(2).addClass("select");
		$("#pageTabs").find('ul li').eq(2).addClass("select").addClass("ui-state-default ui-corner-top ui-tabs-active");
		$('#calAttendPersonList').parent().click(function(){ // 已计算人员
			$("#pageTabs").find('ul li').removeClass("ui-state-default").removeClass("ui-corner-top").removeClass("ui-tabs-active");
			$("#pageTabs").find('ul li').removeClass("select");
			$("#pageTabs").find('ul li').eq(2).addClass("select").addClass("ui-state-default ui-corner-top ui-tabs-active");
			$('#dataBox').css({"margin-top":"0px"});
			//$('#allAttendCaculate').show();
			//$('#selectAttendCaculate').show();
			$('button[id=allAttendCaculate]').show();
			$('button[id=selectAttendCaculate]').show();
			$('#attendCaculateBtnGroup').show();
			$('#attendCaculateBtnGroupDetail').hide();
			$('#deleteSum').hide();
			$("#calculateBtnGroupDetail").hide();
			$("#calculateBtnGroup").show();
			//$('#Calculate').show();
			//$('#CalculateBack').hide();
			$('button[id=Calculate]').show();
			$('button[id=CalculateBack]').hide();
			
			$('#tranSalary').hide();
			$('#salaryBack').hide();
			$('#salarySumResult').hide();
			$('#salaryExportDiv').hide();
			$('#calculateSelectedCustomerSumResult').hide();
			$('#calculateCustomerSumResult').hide();
			$('#sumResult').hide();
			$('#sumDisplay').show();
			$('#detailDisplay').show();
			$('#workFlowBillsChecked').show();
			$('#viewTransaction').show();
			$("#searcher").remove();
			that.showDetailButton(false);
			$("#switchDetail").show();
			$("#switchDetail").html(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_130);
			
			step=1;
			isCalShowDetail=false;
			that.getJqgridData(1);
			that.hideNotAccessButton();
		}) ;
		$('#switchDetail').parent().click(function(){ // 已计算人员(明细展示)
			if($("#switchDetail").html()==jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_130){
				$("#switchDetail").html(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_85);
				$("#pageTabs").find('ul li').removeClass("ui-state-default").removeClass("ui-corner-top").removeClass("ui-tabs-active");
				$("#pageTabs").find('ul li').removeClass("select");
				$("#pageTabs").find('ul li').eq(2).addClass("select").addClass("ui-state-default ui-corner-top ui-tabs-active");
				$('#dataBox').css({"margin-top":"0px"});
				//$('#allAttendCaculate').show();
				//$('#selectAttendCaculate').show();
				$('li[id=allAttendCaculate]').show();
				$('li[id=selectAttendCaculate]').show();
        $('#deleteSum').hide();
				$('#attendCaculateBtnGroupDetail').show();
				$('#attendCaculateBtnGroup').hide();
				
				//$('#Calculate').show();
				//$('#CalculateBack').show();
				$('li[id=Calculate]').show();
				$('li[id=CalculateBack]').show();
				$("#calculateBtnGroupDetail").show();
				$("#calculateBtnGroup").hide();
				
				$('#tranSalary').hide();
				$('#salaryBack').hide();
				$('#salarySumResult').hide();
				$('#salaryExportDiv').hide();
				$('#calculateSelectedCustomerSumResult').hide();
				$('#calculateCustomerSumResult').hide();
				$('#sumResult').hide();
				$('#sumDisplay').hide();
				$('#detailDisplay').hide();
				$('#workFlowBillsChecked').show();
				$('#viewTransaction').show();
				//$("#searcher").remove();
				
		
				
				that.showDetailButton(true);
				step=1;
				isCalShowDetail=true;
							if($("#searcher").html()!=null){
				$("#searcher").remove();
			}
			that.initalSearch(2);
			// 快速查询添加事件
			$('#searcher').shrSearchBar('option', {
				afterSearchClick :function(e) {		
					that.getJqgridData(9);
				}
			});
				that.getJqgridData(9);
				that.hideNotAccessButton();
			}
			else{
				$("#switchDetail").html(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_130);
				$('#calAttendPersonList').click();
			}
			$('#searcher i.custom-filter').hide();
		}) ;
		$('#noneCalAttendPersonList').parent().click(function(){  // 未计算人员
			$("#pageTabs").find('ul li').removeClass("ui-state-default").removeClass("ui-corner-top").removeClass("ui-tabs-active");
			$("#pageTabs").find('ul li').removeClass("select");
			$("#pageTabs").find('ul li').eq(0).addClass("select").addClass("ui-state-default ui-corner-top ui-tabs-active");
			//$('#allAttendCaculate').show();
			//$('#selectAttendCaculate').show();
			$('button[id=allAttendCaculate]').show();
			$('button[id=selectAttendCaculate]').show();
			$('#attendCaculateBtnGroup').show();
			$('#attendCaculateBtnGroupDetail').hide();
			
			$('#Calculate').hide();
	    $('#deleteSum').hide();
			$('#CalculateBack').hide();
			$("#calculateBtnGroupDetail").hide();
			$("#calculateBtnGroup").hide();
			
			$('#salarySumResult').hide();
			$('#tranSalary').hide();
			$('#salaryBack').hide();
			$('#salaryExportDiv').hide();
			$('#sumResult').hide();
			$('#calculateSelectedCustomerSumResult').hide();
			$('#calculateCustomerSumResult').hide();
			$('#sumDisplay').hide();
			$('#detailDisplay').hide();
			$('#workFlowBillsChecked').show();
			$('#viewTransaction').show();
			$("#searcher").remove();
			that.showDetailButton(false);
			step=1;
			isCalShowDetail=false;
			that.attendPersonList();
			that.hideNotAccessButton();
			//$('#datagrid').
		});
		$('#waitCalAttendPersonList').parent().click(function(){  // 待计算人员
			$("#pageTabs").find('ul li').removeClass("ui-state-default").removeClass("ui-corner-top").removeClass("ui-tabs-active");
			$("#pageTabs").find('ul li').removeClass("select");
			$("#pageTabs").find('ul li').eq(1).addClass("select").addClass("ui-state-default ui-corner-top ui-tabs-active");
			//$('#allAttendCaculate').show();
			//$('#selectAttendCaculate').show();
			$('button[id=allAttendCaculate]').show();
			$('button[id=selectAttendCaculate]').show();
      $('#deleteSum').hide();
			$('#attendCaculateBtnGroup').show();
			$('#attendCaculateBtnGroupDetail').hide();
			
			$("#calculateBtnGroupDetail").hide();
			//$('#Calculate').show();
			//$('#CalculateBack').hide();
			$('button[id=Calculate]').show();
			$('button[id=CalculateBack]').hide();
			$("#calculateBtnGroup").show();
			
			$('#salarySumResult').hide();
			$('#sumResult').hide();
			$('#tranSalary').hide();
			$('#salaryBack').hide();
			$('#salaryExportDiv').hide();
			$('#calculateSelectedCustomerSumResult').hide();
			$('#calculateCustomerSumResult').hide();
			$('#sumDisplay').hide();
			$('#detailDisplay').hide();
			$('#workFlowBillsChecked').show();
			$('#viewTransaction').show();
			$("#searcher").remove();
			that.showDetailButton(false);
			step=1;
			isCalShowDetail=false;
			that.waitCalPersonList();
			that.hideNotAccessButton();
			//$('#datagrid').
		});
		$('#auditPersonList').parent().click(function(){  // 已审核人员
			$("#pageTabs").find('ul li').removeClass("ui-state-default").removeClass("ui-corner-top").removeClass("ui-tabs-active");
			$("#pageTabs").find('ul li').removeClass("select");
			$("#pageTabs").find('ul li').eq(3).addClass("select").addClass("ui-state-default ui-corner-top ui-tabs-active");
			$('#allAttendCaculate').hide();
			$('#selectAttendCaculate').hide();
      $('#deleteSum').hide();
			$('#attendCaculateBtnGroup').hide();
			$('#attendCaculateBtnGroupDetail').hide();
			$('#salaryBack').hide();
			$('#salarySumResult').hide();
			$('#salaryExportDiv').hide();
			$('#calculateSelectedCustomerSumResult').hide();
			$('#calculateCustomerSumResult').hide();
			
			$("#calculateBtnGroupDetail").hide();
			//$('#Calculate').hide();
			//$('#CalculateBack').show();
			$('button[id=Calculate]').hide();
			$('button[id=CalculateBack]').show();
			$("#calculateBtnGroup").show();
			
			$('#tranSalary').show();
			$('#sumResult').show();
			$('#sumDisplay').show();
			$('#detailDisplay').show();
			$('#workFlowBillsChecked').show();
			$('#viewTransaction').show();
			$("#searcher").remove();
			that.showDetailButton(false);
			step=2;
			isCalShowDetail=false;
			that.getJqgridData(1);
			//$('#datagrid').
			that.hideNotAccessButton();
		});
		$('#salaryPersonList').parent().click(function(){  // 已转薪资
			$("#pageTabs").find('ul li').removeClass("ui-state-default").removeClass("ui-corner-top").removeClass("ui-tabs-active");
			$("#pageTabs").find('ul li').removeClass("select");
			$("#pageTabs").find('ul li').eq(5).addClass("select").addClass("ui-state-default ui-corner-top ui-tabs-active");
			$('#salarySumResult').hide();
			$('#allAttendCaculate').hide();
			$('#selectAttendCaculate').hide();
			$('#attendCaculateBtnGroup').hide();
			$('#attendCaculateBtnGroupDetail').hide();
			$('#Calculate').hide();
			$('#CalculateBack').hide();
      $('#deleteSum').hide();
			$("#calculateBtnGroupDetail").hide();
			$("#calculateBtnGroup").hide();
			
			$('#sumResult').hide();
			$('#tranSalary').hide();
			$('#salaryBack').show();
			$('#salaryExportDiv').show();
			$('#salaryBack').show();
			$('#calculateSelectedCustomerSumResult').hide();
			$('#calculateCustomerSumResult').hide();
			$('#sumDisplay').hide();
			$('#detailDisplay').hide();
			$('#workFlowBillsChecked').show();
			$('#viewTransaction').hide();
			that.showDetailButton(false);
			if($("#searcher").html()!=null){
				$("#searcher").remove();
			}
			that.initalSearch();
			// 快速查询添加事件
			$('#searcher').shrSearchBar('option', {
				afterSearchClick :function(e) {		
					that.getJqgridData(1);
				}
			});
			isCalShowDetail=false;
//			that.doRenderDataGridForSalary(1);已转薪资
			that.doRenderDataGridForSalaryMd(1);//已转薪资查询中间表
			that.hideNotAccessButton();
		});
		
		//已汇总按钮
		$('#sumPersonList').parent().click(function(){  
			$("#pageTabs").find('ul li').removeClass("ui-state-default").removeClass("ui-corner-top").removeClass("ui-tabs-active");
			$("#pageTabs").find('ul li').removeClass("select");
			$("#pageTabs").find('ul li').eq(4).addClass("select").addClass("ui-state-default ui-corner-top ui-tabs-active");
			$('#allAttendCaculate').hide();
			$('#selectAttendCaculate').hide();
      $('#deleteSum').show();
			$('#attendCaculateBtnGroup').hide();
			$('#attendCaculateBtnGroupDetail').hide();
			$('#sumResult').hide();
			$('#Calculate').hide();
			$('#CalculateBack').hide();
			$("#calculateBtnGroupDetail").hide();
			$("#calculateBtnGroup").hide();
			
			$('#tranSalary').hide();
			$('#salaryBack').hide();
			$('#salaryExportDiv').show();
			$('#salaryBack').hide();
			$('#calculateSelectedCustomerSumResult').show();
			$('#calculateCustomerSumResult').show();
			$('#sumDisplay').hide();
			$('#detailDisplay').hide();
			$('#workFlowBillsChecked').show();
			$('#viewTransaction').hide();
			$('#salarySumResult').show();
			that.showDetailButton(false);
			if($("#searcher").html()!=null){
				$("#searcher").remove();
			}
			that.initalSearch();
			// 快速查询添加事件
			$('#searcher').shrSearchBar('option', {
				afterSearchClick :function(e) {		
					that.getJqgridData(1);
				}
			});
			isCalShowDetail=false;
			that.doRenderDataGridForSalary(2);
			that.hideNotAccessButton();
		});
		$("input[name='adminOrgUnit.longNumber']").val(orgLongNum);
		//$('button[id^=query]').trigger("click");
		that.queryAction();
		
		$("#exportCurrent").click(function(){
			if ($("#pageTabs").find('ul li').eq(4).hasClass("select"))
		 	{
				that.exportCurrentAction(2);
		 	}
			else if($("#pageTabs").find('ul li').eq(5).hasClass("select")){
				that.exportCurrentAction(1);
			}	
		});
		
		$("#exportToExcel").click(function(){
			if ($("#pageTabs").find('ul li').eq(4).hasClass("select"))
		 	{
				that.exportToExcelAction(2);
		 	}
			else if($("#pageTabs").find('ul li').eq(5).hasClass("select")){
				that.exportToExcelAction(1);
			}	
		});
		
		//汇总计算选中行
		$('button[name=calculateSelectedCustomerSumResult]').click(function(){
			 var sid = $("#reportGrid").jqGrid("getSelectedRows");
			 if(sid.length==0){
					shr.showWarning({
						message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_150
					});
				return;
			 }
			 var fids='';
			 for (var i=0;i<sid.length;i++)
			{
				var item = sid[i];
				var data = $("#reportGrid").jqGrid("getRowData", item);
				var recordId=data["FID"] ;
				if(i==sid.length-1){
					fids+="'"+recordId+"'";
				}
				else{
					fids+="'"+recordId+"',";
				}				
			}
			calculateCustomerSumResult(fids);
		});
		$('button[name=calculateCustomerSumResult]').click(function(){
			calculateCustomerSumResult('');
		});
		
		//撤销
		$('button[name=salaryBack]').click(function(){
			//两种情况
			// 1.没有选中的情况
			// 2.选中的情况
				var self = this ;
				var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
				if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_51}); return ;};
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
					 var mes= jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_168;
						shr.showConfirm(mes,
						function(){
							salaryBack(fidJSON,filterItems,proposerId);
					});
				}
				 });
		
		//汇总自定义计算
		function calculateCustomerSumResult(fids){
			openLoader(1);
			var beginDate = $('input[name=beginDate]').val();
			var endDate = $('input[name=endDate]').val();
			var proposerId = $('input[name=proposer]').val();  //姓名
			var hrOrgUnitId = $('#hrOrgUnit_el').val();
			
			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelDoSalaryHandler";
			 url +='&uipk=hr.ats.com.attendancePanelSalary';
			 shr.remoteCall({
					type:"post", 
					async:true,
					url:url,
					method:"calculateCustomerSumResult",
					param : {
							 	hrOrgUnitId:hrOrgUnitId,
							 	beginDate : beginDate,
								endDate : endDate,
								proposerId: proposerId,
								attendPeriodId : attendPeriodId,
								attendPolicyId : attendPolicyId,
								attendanceGroupID:attendanceGroupID,
								orgLongNum  : orgLongNum,
								fids:fids,
								salaryStatus:2
							}, 
					success:function(res){
							closeLoader();
							if(res.success ==true){
								shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_91});
							}else{
								if(res.msg!=null){
									shr.showInfo({message : res.msg});
								}
								else{
									shr.showError({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_92});
								}						
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
		
		//撤销
	  	function salaryBack(fidJSON,filterItems,proposerId){
			 openLoader(1);
			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelDoSalaryHandler";
			 url +='&uipk=hr.ats.com.attendancePanelSalary';
			 var beginDate = $('input[name=beginDate]').val();
			 var endDate = $('input[name=endDate]').val(); 
			 var hrOrgUnitId = $('#hrOrgUnit_el').val();
			 
			 shr.remoteCall({
					type:"post", 
					async:true,
					url:url,
					method:"cancelSalary",
					param : {
				 				hrOrgUnitId:hrOrgUnitId,
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
						//$("#calendar_info").dialog("close");
						if (res.flag == 1){
						var tip ="";
						var sum = 0;	
							if(res.List!= null)
							{
								var len = res.List.length ;
								sum += len;
								if(len > 0){
									tip =shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_33,[len]) + "<br>";
								}
							}
						
							if(res.LockMessage!= null)
							{
								var len = res.LockMessage.length ;
								sum += len;
								if(len > 0){
								    tip +=shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_167, [len]);
									for(var i = 0; i <= len-1 ; i++)
									{
										tip += res.LockMessage[i]+", ";
									}
									tip = tip.substring(0,tip.length-2)+"<br>";
								}
							}
							tip = shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_79,[sum]) + "<br>" + tip;
							var options={
							   message:tip
							};
							$.extend(options, {
								type: 'info',
								hideAfter: null,
								showCloseButton: true
							});
							shr.msgHideAll();
							top.Messenger().post(options);
							window.parent.$("#reportGrid").jqGrid('setGridParam', {
							    datatype : 'json',
							    postData : {
							    	'hrOrgUnitId':hrOrgUnitId,
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
						shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_31});
							window.parent.$("#reportGrid").jqGrid('setGridParam', {
						    datatype : 'json',
						    postData : {
						    	'hrOrgUnitId':hrOrgUnitId,
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
	  	
	  	//请假
		$('li[name=leaveBill]').click(function(){
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			 if(sid.length==0){
					shr.showWarning({
						message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_150
					});
				return;
			 }

			/**
			 * 考勤计算提请假单 假期业务组织校验;
			 * 假期业务组织不可编辑
			 */
			var personDates = []; //[{"person":personid,"date":attenceDate,"name":personName},...]
			 for(var i=0;i<sid.length;i++){
				 var item = sid[i];
				 var personDate = {
					 "person" : $("#reportGrid").jqGrid("getCell", item,"proposerId"),
					 "date" : $("#reportGrid").jqGrid("getCell", item,"FAttenceDate"),
					 "name" : $("#reportGrid").jqGrid("getCell", item,"personName")
				 };
				 personDates.push(personDate);
			 }
			 
			//  var hrOrgId= $("#hrOrgUnit_el").val();
			//  var hrOrgName = $("#hrOrgUnit").val();
			 /**
			  * hrOrgName
			  * 业务组织改从明细记录取，并：
			  * 1、校验是否多个（V850 快速过滤业务组织多选）—— js
			  * 2、校验考勤业务组织跟对应人员所选日期的假期业务组织是否一致
			  * 
			  * 以上校验不通过则弹出提示！
			  */
			 var hrOrgId = "";
			 var hrOrgName = "";
			 for(var i=0;i<sid.length;i++){
				var item = sid[i];
				if(hrOrgId != "" &&
					hrOrgId != $("#reportGrid").jqGrid("getCell", item,"fhrOrgUnitId")) {
					shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_153});
					return;
				}else{
					hrOrgId = $("#reportGrid").jqGrid("getCell", item,"fhrOrgUnitId");
					hrOrgName = $("#reportGrid").jqGrid("getCell", item,"hrOrgName");
				}
			}

			 var personDateOrgValidRes = [];//[personName_attenceDate, ...]
			 var msg = "";
			 shr.remoteCall({
					type:"post",
					async:false,
					url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelCalHandler&method=personDateOrgValid",
					param : {
				 				"hrOrgUnitId" : hrOrgId,
								"personDates" : JSON.stringify(personDates)
							}, 
					success:function(res){
						personDateOrgValidRes = res.validRes;//[personName_attenceDate, ...]
						if(personDateOrgValidRes != null && personDateOrgValidRes != undefined){
							
							for(var i=0; i<personDateOrgValidRes.length; i++){
								var tmp = personDateOrgValidRes[i];
								var name = tmp.split("_")[0];
								var date = tmp.split("_")[1];
								msg += shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_5
									,[name, date, hrOrgName]) + "<br>";
							}
							if(msg != ""){
								shr.showError({message: msg});
								return;
							}
						}
					},
					error:function(res){
						return;
					}
			 });
			if(msg != ""){
				return;
			}
			
			var personStr = "";
			var personNameStr ="";
			var attendDateStr="";
			for (var i=0;i<sid.length;i++)
			{
					var item = sid[i];
					var data =  $("#reportGrid").jqGrid("getCell", item,"proposerId");
					var date =  $("#reportGrid").jqGrid("getCell", item,"FAttenceDate");
					var personName =  $("#reportGrid").jqGrid("getCell", item,"personName");
					if(personStr.length > 0)
					{
						personStr +=",";
					}
					personStr += data;	
					if(attendDateStr.length > 0)
					{
						attendDateStr +=",";
					}
					attendDateStr += date;		
					if(personNameStr.length > 0)
					{
						personNameStr +=",";
					}
					personNameStr += personName;	
			}

			var beginDateStr=atsMlUtile.getFieldOriginalValue("beginDate");
			var endDateStr=atsMlUtile.getFieldOriginalValue("endDate");
	 		var url = shr.getContextPath()+"/dynamic.do?method=addNew&fromCalDetail=1&personStr="+encodeURIComponent(personStr)+"&attendDateStr="+attendDateStr+"&personNameStr="+encodeURIComponent(personNameStr)+"&beginDateStr="+beginDateStr+"&endDateStr="+endDateStr+"&uipk=com.kingdee.eas.hr.ats.app.AtsLeaveBillAllBatchFormDetail"+"&hrOrgId="+encodeURIComponent(hrOrgId);
	 		var serviceId = shr.getUrlRequestParam("serviceId");
			 url += '&serviceId='+encodeURIComponent(serviceId);
	 		var leavebillDialog = $("#detailOperationDialog");
	 		leavebillDialog.children("iframe").attr('src',url);
	 		leavebillDialog.dialog({
	 	 		autoOpen: true,
	 			title: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_145,
	 			width:950,
	 	 		minWidth:950,
	 	 		height:700,
	 	 		minHeight:600,
	 			modal: true,
	 			resizable: true,
	 			position: {
	 				my: 'center center',
	 				at: 'center center',
	 				of: window
	 			},
	 			close : function(){
	 		 		leavebillDialog.children("iframe").attr('src',"");
	 			}
	 		});
	 		$("#detailOperationDialog").css({"overflow-y":"scroll"});
	 		$("#detailOperationDialog").parent().css("z-index",999);//提示框为1000，要放在提示框下面;
//			$("#detailOperationDialog").css({"overflow-y":"hidden"});
			$("#detailOperationDialog-frame").attr("scrolling","NO"); 
			//$("#gview_grid").children("div").eq(2).css({"height":"460","overflow-y":"scroll","overflow-x":"hidden"})
			//[2].css({"height":"460";"overflow-y":"scroll";"overflow-x":"hidden"})
			
			//$(".ui-jqgrid-bdiv").css({"height":"460";"overflow-y":"scroll";"overflow-x":"hidden"});
			
			
	 		$("#detailOperationDialog-frame").load(function () {
	 		
				var _iframe = document.getElementById('detailOperationDialog-frame');
				var _iframeHeight = null;
				 $(window.frames["detailOperationDialog-frame"].document).find("#gview_grid").children("div").eq(2).css({"height":"460","overflow-y":"auto","overflow-x":"hidden"});
				if (_iframe.contentDocument && _iframe.contentDocument.body.offsetHeight){
					_iframeHeight = _iframe.contentDocument.body.offsetHeight;
				} else if (_iframe.Document && _iframe.Document.body.scrollHeight){
					_iframeHeight = _iframe.Document.body.scrollHeight;
				}
				var $iframe = $(_iframe);
				$iframe.height(_iframeHeight + 280 );
			});
		});
		
	  	//补卡
		$('li[name=fillSignCard]').click(function(){
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			 if(sid.length==0){
					shr.showWarning({
						message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_150
					});
				return;
			 }
			var personStr = "";
			var personNameStr ="";
			var attendDateStr="";
			for (var i=0;i<sid.length;i++)
			{
					var item = sid[i];
					var data =  $("#reportGrid").jqGrid("getCell", item,"proposerId");
					var date =  $("#reportGrid").jqGrid("getCell", item,"FAttenceDate");
					var personName =  $("#reportGrid").jqGrid("getCell", item,"personName");
					if(personStr.length > 0)
					{
						personStr +=",";
					}
					personStr += data;	
					if(attendDateStr.length > 0)
					{
						attendDateStr +=",";
					}
					attendDateStr += date;		
					if(personNameStr.length > 0)
					{
						personNameStr +=",";
					}
					personNameStr += personName;	
			}
			var beginDateStr=atsMlUtile.getFieldOriginalValue("beginDate");
			var endDateStr=atsMlUtile.getFieldOriginalValue("endDate");
			var hrOrgId= $("#hrOrgUnit_el").val();
	 		var url = shr.getContextPath()+"/dynamic.do?iframe=detailOperationDialog-frame&method=addNew&fromCalDetail=1&personStr="+encodeURIComponent(personStr)+"&attendDateStr="+attendDateStr+"&personNameStr="+encodeURIComponent(personNameStr)+"&beginDateStr="+beginDateStr+"&endDateStr="+endDateStr+"&uipk=com.kingdee.eas.hr.ats.app.FillSignCardBatchNewDetail"+"&hrOrgId="+encodeURIComponent(hrOrgId);
	 		 var serviceId = shr.getUrlRequestParam("serviceId");
			 url += '&serviceId='+encodeURIComponent(serviceId);
	 		var leavebillDialog = $("#detailOperationDialog");
	 		leavebillDialog.children("iframe").attr('src',url);
	 		leavebillDialog.dialog({
	 	 		autoOpen: true,
	 			title: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_25,
	 			width:950,
	 	 		minWidth:950,
	 	 		height:700,
	 	 		minHeight:600,
	 			modal: true,
	 			resizable: true,
	 			position: {
	 				my: 'center center',
	 				at: 'center center',
	 				of: window
	 			},
	 			close : function(){
	 		 		leavebillDialog.children("iframe").attr('src',"");
	 			}
	 		});
			$("#detailOperationDialog").css({"overflow-y":"scroll"});
			$("#detailOperationDialog").parent().css("z-index",999);//提示框为1000，要放在提示框下面;
//			$("#detailOperationDialog").css({"overflow-y":"hidden"});
			$("#detailOperationDialog-frame").attr("scrolling","NO");
			$("#detailOperationDialog-frame").load(function () {
				var _iframe = document.getElementById('detailOperationDialog-frame');
				var _iframeHeight = null;
				$(window.frames["detailOperationDialog-frame"].document).find("#gview_grid").children("div").eq(2).css({"height":"460","overflow-y":"auto","overflow-x":"hidden"});
				if (_iframe.contentDocument && _iframe.contentDocument.body.offsetHeight){
					_iframeHeight = _iframe.contentDocument.body.offsetHeight;
				} else if (_iframe.Document && _iframe.Document.body.scrollHeight){
					_iframeHeight = _iframe.Document.body.scrollHeight;
				}
				var $iframe = $(_iframe);
				$iframe.height(_iframeHeight + 280 );
			});
		});
		
		//出差
		$('li[name=tripBill]').click(function(){
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			 if(sid.length==0){
					shr.showWarning({
						message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_150
					});
				return;
			 }
			var personStr = "";
			var personNameStr ="";
			var attendDateStr="";
			var s1toS6="";//拼接s1-s6
			for (var i=0;i<sid.length;i++)
			{
					var item = sid[i];
					var data =  $("#reportGrid").jqGrid("getCell", item,"proposerId");
					var date =  $("#reportGrid").jqGrid("getCell", item,"FAttenceDate");
					var personName =  $("#reportGrid").jqGrid("getCell", item,"personName");
					if(personStr.length > 0)
					{
						personStr +=",";
					}
					personStr += data;	
					if(attendDateStr.length > 0)
					{
						attendDateStr +=",";
					}
					attendDateStr += date;		
					if(personNameStr.length > 0)
					{
						personNameStr +=",";
					}
					personNameStr += personName;	
			}
			var beginDateStr=atsMlUtile.getFieldOriginalValue("beginDate");
			var endDateStr=atsMlUtile.getFieldOriginalValue("endDate");
			var hrOrgId= $("#hrOrgUnit_el").val();
	 		var url = shr.getContextPath()+"/dynamic.do?method=addNew&fromCalDetail=1&personStr="+encodeURIComponent(personStr)+"&attendDateStr="+attendDateStr+"&personNameStr="+encodeURIComponent(personNameStr)+"&beginDateStr="+beginDateStr+"&endDateStr="+endDateStr+"&uipk=com.kingdee.eas.hr.ats.app.AtsTripBillBatchNewDetail"+"&hrOrgId="+encodeURIComponent(hrOrgId);
	 		var serviceId = shr.getUrlRequestParam("serviceId");
			 url += '&serviceId='+encodeURIComponent(serviceId);
	 		var leavebillDialog = $("#detailOperationDialog");
	 		leavebillDialog.children("iframe").attr('src',url);
	 		leavebillDialog.dialog({
	 	 		autoOpen: true,
	 			title: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_36,
	 			width:950,
	 	 		minWidth:950,
	 	 		height:700,
	 	 		minHeight:600,
	 			modal: true,
	 			resizable: true,
	 			position: {
	 				my: 'center center',
	 				at: 'center center',
	 				of: window
	 			},
	 			close : function(){
	 		 		leavebillDialog.children("iframe").attr('src',"");
	 			}
	 		});
			$("#detailOperationDialog").css({"overflow-y":"scroll"});
			$("#detailOperationDialog").parent().css("z-index",999);//提示框为1000，要放在提示框下面;
//			$("#detailOperationDialog").css({"overflow-y":"hidden"});
			$("#detailOperationDialog-frame").attr("scrolling","NO");
	 		$("#detailOperationDialog-frame").load(function () {
				var _iframe = document.getElementById('detailOperationDialog-frame');
				var _iframeHeight = null;
				$(window.frames["detailOperationDialog-frame"].document).find("#gview_grid").children("div").eq(2).css({"height":"460","overflow-y":"auto","overflow-x":"hidden"});
				if (_iframe.contentDocument && _iframe.contentDocument.body.offsetHeight){
					_iframeHeight = _iframe.contentDocument.body.offsetHeight;
				} else if (_iframe.Document && _iframe.Document.body.scrollHeight){
					_iframeHeight = _iframe.Document.body.scrollHeight;
				}
				var $iframe = $(_iframe);
				$iframe.height(_iframeHeight + 280 );
			});
		});
		
		//加班
		$('li[name=overTimeBill]').click(function(){
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			 if(sid.length==0){
					shr.showWarning({
						message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_150
					});
				return;
			 }
			var personStr = "";
			var personNameStr ="";
			var attendDateStr="";
			var s1toS6="";//拼接s1-s6
			for (var i=0;i<sid.length;i++)
			{
					var item = sid[i];
					var data =  $("#reportGrid").jqGrid("getCell", item,"proposerId");
					var date =  $("#reportGrid").jqGrid("getCell", item,"FAttenceDate");
					var personName =  $("#reportGrid").jqGrid("getCell", item,"personName");
					if(personStr.length > 0)
					{
						personStr +=",";
					}
					personStr += data;	
					if(attendDateStr.length > 0)
					{
						attendDateStr +=",";
					}
					attendDateStr += date;		
					if(personNameStr.length > 0)
					{
						personNameStr +=",";
					}
					personNameStr += personName;	
			}
			var beginDateStr=atsMlUtile.getFieldOriginalValue("beginDate");
			var endDateStr=atsMlUtile.getFieldOriginalValue("endDate");
			var hrOrgId= $("#hrOrgUnit_el").val();
	 		var url = shr.getContextPath()+"/dynamic.do?method=addNew&fromCalDetail=1&personStr="+encodeURIComponent(personStr)+"&attendDateStr="+attendDateStr+"&personNameStr="+encodeURIComponent(personNameStr)+"&beginDateStr="+beginDateStr+"&endDateStr="+endDateStr+"&uipk=com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllBatchFormDetail"+"&hrOrgId="+encodeURIComponent(hrOrgId);
	 		var serviceId = shr.getUrlRequestParam("serviceId");
			 url += '&serviceId='+encodeURIComponent(serviceId);
	 		var leavebillDialog = $("#detailOperationDialog");
	 		leavebillDialog.children("iframe").attr('src',url);
	 		leavebillDialog.dialog({
	 	 		autoOpen: true,
	 			title: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_95,
	 			width:950,
	 	 		minWidth:950,
	 	 		height:700,
	 	 		minHeight:600,
	 			modal: true,
	 			resizable: true,
	 			position: {
	 				my: 'center center',
	 				at: 'center center',
	 				of: window
	 			},
	 			close : function(){
	 		 		leavebillDialog.children("iframe").attr('src',"");
	 			}
	 		}); 
			$("#detailOperationDialog").css({"overflow-y":"scroll"});
			$("#detailOperationDialog").parent().css("z-index",999);//提示框为1000，要放在提示框下面;
//			$("#detailOperationDialog").css({"overflow-y":"hidden"});
			$("#detailOperationDialog-frame").attr("scrolling","NO");
			$("#detailOperationDialog-frame").load(function () {
				var _iframe = document.getElementById('detailOperationDialog-frame');
				var _iframeHeight = null;
				$(window.frames["detailOperationDialog-frame"].document).find("#gview_grid").children("div").eq(2).css({"height":"460","overflow-y":"auto","overflow-x":"hidden"});
				if (_iframe.contentDocument && _iframe.contentDocument.body.offsetHeight){
					_iframeHeight = _iframe.contentDocument.body.offsetHeight;
				} else if (_iframe.Document && _iframe.Document.body.scrollHeight){
					_iframeHeight = _iframe.Document.body.scrollHeight;
				}
				var $iframe = $(_iframe);
				$iframe.height(_iframeHeight + 280 );
			});
			
		});
		
		//排班批量修改
		$('li[name=scheduleShiftBatchEdit]').click(function(){
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			 if(sid.length==0){
					shr.showWarning({
						message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_150
					});
				return;
			 }
			var personStr = "";
			var personNameStr ="";
			var attendDateStr="";
			var s1toS6="";//拼接s1-s6
			for (var i=0;i<sid.length;i++)
			{
					var item = sid[i];
					var data =  $("#reportGrid").jqGrid("getCell", item,"proposerId");
					var date =  $("#reportGrid").jqGrid("getCell", item,"FAttenceDate");
					var personName =  $("#reportGrid").jqGrid("getCell", item,"personName");
					if(personStr.length > 0)
					{
						personStr +=",";
					}
					personStr += data;	
					if(attendDateStr.length > 0)
					{
						attendDateStr +=",";
					}
					attendDateStr += date;		
					if(personNameStr.length > 0)
					{
						personNameStr +=",";
					}
					personNameStr += personName;	
			}
			var beginDateStr=atsMlUtile.getFieldOriginalValue("beginDate");
			var endDateStr=atsMlUtile.getFieldOriginalValue("endDate");
			var hrOrgUnitObj = JSON.stringify($("#hrOrgUnit").shrPromptBox('getValue'));//获取业务组织
	 		var url = shr.getContextPath()+"/dynamic.do?iframe=detailOperationDialog-frame&personStr="+encodeURIComponent(personStr)+"&attendDateStr="+attendDateStr+"&beginDateStr="+beginDateStr+"&endDateStr="+endDateStr+"&uipk=com.kingdee.eas.hr.ats.app.CalScheduleShiftBatchEdit"+'&hrOrgUnitObj='+encodeURIComponent(hrOrgUnitObj);;
	 		//var serviceId = shr.getUrlRequestParam("serviceId");
			url += '&iscal=true';
			 var serviceId = shr.getUrlRequestParam("serviceId");
			 url += '&serviceId='+encodeURIComponent(serviceId);
	 		var leavebillDialog = $("#detailOperationDialog");
	 		leavebillDialog.children("iframe").attr('src',url);
	 		leavebillDialog.dialog({
	 	 		autoOpen: true,
	 			title: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_141,
	 			width:1100,
	 	 		minWidth:950,
	 	 		height:750,
	 	 		minHeight:600,
	 			modal: true,
	 			resizable: true,
	 			position: {
	 				my: 'center center',
	 				at: 'center center',
	 				of: window
	 			},
	 			close : function(){
	 		 		leavebillDialog.children("iframe").attr('src',"");
	 			}
	 		});
			$("#detailOperationDialog").css({"overflow-y":"scroll"});			
		});
		
		//排班批量赋值
		$('li[name=scheduleShiftBatchVal]').click(function(){
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			 if(sid.length==0){
					shr.showWarning({
						message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_150
					});
				return;
			 }
			var personStr = "";
			var personNameStr ="";
			var attendDateStr="";
			var personNum="";
			var s1toS6="";//拼接s1-s6
			for (var i=0;i<sid.length;i++)
			{
					var item = sid[i];
					var data =  $("#reportGrid").jqGrid("getCell", item,"proposerId");
					var date =  $("#reportGrid").jqGrid("getCell", item,"FAttenceDate");
					var personName =  $("#reportGrid").jqGrid("getCell", item,"personName");
					var number =  $("#reportGrid").jqGrid("getCell", item,"personNumber");
					if(personStr.length > 0)
					{
						personStr +=",";
					}
					if(personNum.length>0){
						personNum+=",";
					}
					personNum += number;
					personStr += data;	
					if(attendDateStr.length > 0)
					{
						attendDateStr +=",";
					}
					attendDateStr += date;		
					if(personNameStr.length > 0)
					{
						personNameStr +=",";
					}
					personNameStr += personName;	
			}
			var beginDateStr=atsMlUtile.getFieldOriginalValue("beginDate");
			var endDateStr=atsMlUtile.getFieldOriginalValue("endDate");
			var _self = this;
			$("#scheduleShiftBatchValDialog").dialog({
				    title: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_140,
					width:950,
			 		height:600,
					modal: true,
					resizable: true,
					position: {
						my: 'center',
						at: 'top+55%',
						of: window
					},
					open : function(event, ui) {
						var that = this;
						var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
							 + '<div style=" padding-left: 50px; color: red; ">'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_180
							+ '</div>'
							 + '<div class="row-fluid row-block ">'
							 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_71
							+ '</div></div>'
							 + '</div>'
							 + '<div class="row-fluid row-block ">'
							 + '<div class="col-lg-4"><div class="field_label" title="'
                            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_161
							+ '">'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_161
							+ '</div></div>'
							 + '<div class="col-lg-6 field-ctrl"><div class="ui-text-frame disabled"><input id="dateType" name="dateType" class="block-father input-height" type="text" validate="" ctrlrole="text" disabled="disabled" autocomplete="off"  title=""></div></div>'
							 + '<div class="col-lg-4"><div class="field_label" title="'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_19
							+ '">'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_19
							+ '</div></div>'
							 + '<div class="col-lg-6 field-ctrl"><input id="shift"  name="shift" readonly="readonly" style="cursor:pointer;background-color:#ffffff" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
							// + '<div class="col-lg-2 field-desc"/>'
							// + '<div class="col-lg-4"><div class="field_label" title="取卡规则">取卡规则</div></div>'
							// + '<div class="col-lg-6 field-ctrl"><input id="cardRule" name="cardRule" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
							 + '</div>'
							 + '<div class="row-fluid row-block ">'
							 + '<div class="col-lg-4"><div class="field_label" title="'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_155
							+ '">'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_155
							+ '</div></div>'
							 + '<div class="col-lg-6 field-ctrl"><input id="cardRule" name="cardRule" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
							 + '</div>'
							 + '<div style="height:80px" ></div>'
							 + '<div class="row-fluid row-block ">'
							 + '<div class="col-lg-18"></div>'
							 + '<div class="col-lg-3 field-ctrl"><button type="button" class="shrbtn-primary shrbtn" name="'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_142
							+ '" id="batchAddVal">'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_142
							+ ' </button></div>'
							 + '<div class="col-lg-2 field-ctrl"><button type="button" class="shrbtn-primary shrbtn" name="'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_156
							+ '" id="cancle">'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_156
							+ '</button></div>'
							 + '</div>'

							 + '</form>'
						$("#scheduleShiftBatchValDialog").html(html);

						// //班次名称
						// grid_f7_json = null;
						// grid_f7_json = {id:"shift",name:"shift"};
						// grid_f7_json.subWidgetName = 'shrPromptGrid';
						// grid_f7_json.subWidgetOptions = {title:"班次名称",uipk:"com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list",query:"",filter:"",domain:"",multiselect:false};
						// grid_f7_json.readonly = '';
						// grid_f7_json.validate = '{required:true}';
						// grid_f7_json.value = {id:"",name:""};
						// $('#shift').shrPromptBox(grid_f7_json);
						// $("#shift").shrPromptBox("option", {
						// 	onchange : function(e, value) {
						// 		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler&method=getShiftItemInfo";
						// 		shr.remoteCall({
						// 			type:"post",
						// 			async:false,
						// 			url:url,
						// 			param:{atsShiftId: value.current.id},
						// 			success:function(res){
					    //                 $('#cardRule').shrPromptBox("setFilter","startSegmentNum = " + res.records);
						// 			}
						// 		});		
						// 	}		
						// });
						
							$("#shift").click(function(){
									

			    			    var that = this;
								var url = shr.getContextPath()+ '/dynamic.do?method=initalize&flag=turnShift'
															+ '&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list';
								 var serviceId = shr.getUrlRequestParam("serviceId");
								 var hrOrgUnitObj = JSON.stringify($("#hrOrgUnit").shrPromptBox('getValue'));//获取业务组织
								
								 url += '&serviceId='+encodeURIComponent(serviceId)+'&hrOrgUnitObj='+encodeURIComponent(hrOrgUnitObj);
								var leavebillDialog = $("#detailOperationDialog");
	 							//leavebillDialog.children("iframe").attr('src',url);
								// leavebillDialog.dialog({
								$("#iframe1").attr("src",url);
								$("#iframe1").dialog({
									modal : false,
									title : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_197,
									width : 1035,
									minWidth : 1035,
									height : 505,
									minHeight : 505,
									open : function(event, ui) {
									},
									close : function() {
										
										var title = $("#iframe1").attr('title');
				 						 var shiftID = $("#iframe1").attr('shiftID');
										 var dayType="";
										 var shiftName="";
										 var dayTypeValue = "";
										if(title){
											var _dayType = [
												$.attendmanageI18n.workShiftStrategy.dayType1,
												$.attendmanageI18n.workShiftStrategy.dayType2,
												$.attendmanageI18n.workShiftStrategy.dayType3
											];
											dayTypeValue = title.substring(1,title.indexOf("]"));
											dayType = _dayType[dayTypeValue];
                                            shiftName = title.substring(title.indexOf("]")+1,title.length);
                                        }
											
										$("#shift").val(shiftName);
										$("#shift").attr("shifID",shiftID);
										
										$("#dateType").val(dayType);
										$("#dateType").attr("dayTypeValue", dayTypeValue);
										if(shiftID!="false"&&shiftID){
											var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler&method=getShiftItemInfo";
											shr.remoteCall({
												type:"post",
												async:false,
												url:url,
												param:{atsShiftId: shiftID},
												success:function(res){
														$('#cardRule').shrPromptBox("setFilter","startSegmentNum = " + res.records);
													
												}
											});		
										}else{
											$('#cardRule').shrPromptBox("setFilter","" );
										}
											
										

									}
								});
								
								$("#iframe1").attr("style", "width:1035px;height:505px;");

								//leavebillDialog.children("iframe").attr('src',"");
								//leavebillDialog.children("iframe").attr("style", "width:1035px;height:505px;");
								
							});
						//取卡规则
						grid_f7_json = null;
						grid_f7_json = {id:"cardRule",name:"cardRule"};
						grid_f7_json.subWidgetName = 'shrPromptGrid';
//						
						grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_155,uipk:"com.kingdee.eas.hr.ats.app.CardRule.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false};
						grid_f7_json.readonly = '';
						grid_f7_json.validate = '';
						grid_f7_json.value = {id:"",name:""};
						grid_f7_json.subWidgetOptions.isHRBaseItem = true;
						grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $('#hrOrgUnit_el').val();
						grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_184,widgetType: "checkbox"}];
						grid_f7_json.subWidgetName = 'specialPromptGrid';
						grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
						$('#cardRule').shrPromptBox(grid_f7_json);
						$('#cardRule').shrPromptBox("setBizFilterFieldsValues",$("#hrOrgUnit_el").val());
						//要将form加上，数据校验才有用。
					    var formJson = {
							id: "form"
						};
						$('#form').shrForm(formJson);
						//that.processF7ChangeEvent();
					
						$("#cardRule").change(function(){
							var dateType =$("#dateType").val();
							if(!dateType){
								$("#cardRule").val("");
								$("#cardRule_el").val("");
								shr.showWarning({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_149});
								
							}
						});
						
						$('button[id^=batchAddVal]').click(function() {
							if (($("#shift").val()==null　|| $("#shift").val()=="")&& $("#dateType").attr("dayTypeValue")=="0"){
				    			shr.showWarning({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_152});
				    			return;
				    		}
							$(this).disabled = true;
							var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CalScheduleShiftBatchEditHandler&method=batchVal";
							openLoader(1,jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_205);
							var shiftId= $("#shift").attr("shifID");
							var dayType= $("#dateType").attr("dayTypeValue");
							shr.ajax({
								type:"post",
								async:true,
								url:url,
								data:{"personStr":personStr,
									  "attendDateStr":attendDateStr,
									  "shiftId": shiftId,
									  "cardRuleId":$("#cardRule_el").val(),
									  "personNum":personNum,
									  "dayType":dayType},
								success:function(res){
									closeLoader();
									if(res.flag==1){
										shr.showError({message: res.errorStr});
									}
									else{
										shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_21});
										jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
										$("#scheduleShiftBatchValDialog").dialog("close");
									}				
							    }
							});
						});
						
						$('button[id^=cancle]').click(function() {
							$("#scheduleShiftBatchValDialog").dialog("close");
						});	
						
						
				    },
				    close : function() {
					    $("#scheduleShiftBatchValDialog").empty();
				    }
//				    buttons:{
//						"批量赋值": function(){
//				    		if (($("#shift").val()==null　|| $("#shift").val()=="")&& $("#dateType").val()=="工作日"){
//				    			shr.showWarning({message: "请选择班次名称！"});
//				    			return;
//				    		}
//							$(this).disabled = true;
//							var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CalScheduleShiftBatchEditHandler&method=batchVal";
//							openLoader(1,"正在保存,请稍等...");
//							var shiftId= $("#shift").attr("shifID");
//							var dayType= $("#dateType").val();
//							shr.ajax({
//								type:"post",
//								async:true,
//								url:url,
//								data:{"personStr":personStr,
//									  "attendDateStr":attendDateStr,
//									  "shiftId": shiftId,
//									  "cardRuleId":$("#cardRule_el").val(),
//									  "personNum":personNum,
//									  "dayType":dayType},
//								success:function(res){
//									closeLoader();
//									if(res.flag==1){
//										shr.showError({message: res.errorStr});
//									}
//									else{
//										shr.showInfo({message: "保存成功！"});
//										jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
//										$("#scheduleShiftBatchValDialog").dialog("close");
//									}				
//							    }
//							});		 
//						},
//						"取消": function(){
//							$("#scheduleShiftBatchValDialog").dialog("close");
//						}
//				    }
				});	
				$("#scheduleShiftBatchValDialog").css({"height":"250px"});
				$("#scheduleShiftBatchValDialog").css({"margin-top":"5px"});
		});
		
		
		var urlinner = shr.getContextPath() + shr.dynamicURL + "?method=getOpenLoader&handler=com.kingdee.shr.ats.web.handler.AttendanceResultDetailHandler";

		//已计算页签--明细显示模式--考勤地点修订
		$('li[name=changeAttenceOrg]').click(function(){
		    that.changeAttenceOrg('attendanceResult');
		});

		//已计算页签--明细显示模式--导出选中 
		$('li[name=attendanceResultExportCurrent]').click(function(){
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
				var url = exportCommonParam();
				url = url+'&personId='+encodeURIComponent(personIds.join(','));
				openLoader(1,jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_206);
				shr.ajax({
					type:"post",
					url:urlinner,
					method : "getOpenLoader",
					param : { "personId" : '' },
					success : function (reponse) {
						var param2 = "";
						shr.reloadUrlByPost(url, param2, 'exportToExcels');
						closeLoader();
					},
					error : function(res){
				    	shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_60});
				    	closeLoader();
				    } 
				});
				
//				openLoader(1,"正在导出,请稍等...");
//			  	shr.ajax({ 
//					type:"post",  
//					url:url, 
//					success:function(res){ 
//						var fileUrl = res.url ;	 
//						closeLoader();    
//						document.location.href = fileUrl; 
//				    }, 
//				    error : function(res){
//				    	shr.showError({message: "导出失败 "});
//				    	closeLoader(); 
//				    } 
//				});
			}else{
				shr.showWarning({
					message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_150
				});
			}
		});
		
		//已计算页签--明细显示模式--导出全部
		$('li[name=attendanceResultExportAll]').click(function(){
			var self = this;
			var url = exportCommonParam();
			var param2 = "";
			shr.reloadUrlByPost(url, param2, 'exportToExcels');
			
			
		});
		
		//考勤明细导入
		$('li[name=attendanceResultImport]').click(function(){
			// defineClass.doImportData('com.kingdee.eas.hr.ats.app.AttendanceResult');
			defineClass.doOldImportData('com.kingdee.eas.hr.ats.app.AttendanceResult');
		});


		
		function exportCommonParam(){
			var self = this,
			beginDate = atsMlUtile.getFieldOriginalValue("beginDate"),
			endDate = atsMlUtile.getFieldOriginalValue("endDate"),
			proposerId = $("#proposer_el").val(),
		//	var hrOrgUnitId = $('#hrOrgUnit_el').val(),
			proposerName1=$("#proposer").val(),
			$grid = $('#reportGrid'),
			postData = $grid.jqGrid("getGridParam", "postData"),
			url = shr.getContextPath() + shr.dynamicURL + "?method=exportToExcels";
			//标题
			url += "&title=" + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_114;
			// set PostData
			$grid._pingPostData(postData);
			
			var param = postData;
			if (param.queryMode) {
				delete param.queryMode
			}
			param.handler = "com.kingdee.shr.ats.web.handler.AttendanceResultDetailHandler";
			param.downSum = $('#downSum').attr('checked') == "checked" ? 1 : 0; 
			param.isAll = true;
			
			url += "&" + $.param(param);
			//拼接查询条件
			url = url + '&beginDate=' + beginDate + '&endDate=' + endDate + '&orgLongNum=' + encodeURIComponent(orgLongNum) + '&proposerName=' + encodeURIComponent(proposerName1)+ '&attendPolicyId=' + encodeURIComponent(attendPolicyId) + '&attendanceGroupID='+encodeURIComponent(attendanceGroupID)+'&selectStates='+selectStates+'&hrOrgUnitId='+encodeURIComponent($('#hrOrgUnit_el').val());
			return url ;	
		};
	},

	/**
	 * 导入
	 */
	doOldImportData: function(curIOModelString, customData,classify) {
		if (typeof curIOModelString == 'undefined') {
			curIOModelString = this.getImportModel();
		}
	
		var importDiv = $('#importDiv');
		if (importDiv.length > 0) {
			importDiv.data('curIOModelString', curIOModelString);
			importDiv.data('customData', customData);
			importDiv.data('classify', classify);
			importDiv.dialog('open');
			return;
		}
		
		// 未生成dialog
		importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
		importDiv.data('curIOModelString', curIOModelString);
		importDiv.data('customData', customData);
		importDiv.data('classify', classify);
		
		var _self = this;
		if(_self.checkUpload()){
			importDiv.dialog({
				autoOpen: true,		
				width: 708,
				height: 700,
				title: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_63,
				resizable: true,
				position: ['top','top'],
				modal: true,
				open: function(event, ui) {
					if ($.browser.msie) {
						var url = shr.assembleURL('com.kingdee.shr.io.app.ImportInfo', 'view', {
							curIOModelString: curIOModelString,
							customData: customData,
							classify:classify
						});
						var content = '<iframe id="importFrame" name="importFrame" width="700" height="600" frameborder="0" scrolling="no" allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					} else {
						importDiv.css('padding', "0 20px");
						var url = shr.assembleURL('com.kingdee.shr.io.app.ImportInfo$page', 'view');
						shr.loadHTML({
							url: url,
							success: function(response) {
								importDiv.append(response);
							}
						});
					}
				},
				close: function(event, ui) {
					importDiv.empty();
					$(_self.gridId).jqGrid("reloadGrid");
				} 
			});
		}
		
		$(".ui-dialog-titlebar-close").bind("click" , function(){
			importDiv.dialog("close");
		});		
	},

	/*
	 *检测 是否可以上传文件
	 * */
	checkUpload :function(){
		return true;
	},
	

	//首次进来时，设置其默认值
	initDefaultFilter:function(){
		 var self=this;
		 var serviceId = shr.getUrlRequestParam("serviceId");
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryResultHelper&method=initDefaultFilter";
		 url += '&serviceId='+encodeURIComponent(serviceId);
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
						
						if(info.length>1){
							var hrOrgUnitValue = {
								id:info[1].id,
								name:info[1].name
							};
						}
						$('input[name=hrOrgUnit]').shrPromptBox("setValue", hrOrgUnitValue);
						
						if(info.length>2){
							var policyValue = {
								id : info[2].id,
								name : info[2].name, 
								"attenceCycle.id" : info[2]["attenceCycle.id"]
							}; 
						   $('input[name=attencePolicy]').shrPromptBox("setValue", policyValue);
						}
						 // // self.showAttenceCycleItem(info[2]);   因为上面已经监听 onChange 事件 
					} 
			    }
		 });
		attendanceGroupID="";		 
	},
	//添加查询、审核等按钮
	initDefaultTitle : function() {
		var that = this;
		var row_fields_work = '<div id="add" >'
			+ '<span id="addmenu"></span>'
			+ '<span id="addDetailProject"></span>'
			+ '</div>';
			$("#workFlowBillsChecked").die();
			$('#menu').remove();  // 防止生成两个。。。
	
		var menu = '<DIV id="menu">'
			+ '<div id="calculateBtnGroupDetail" class="btn-group">'
			+ '<button class="btn-wide shrbtn dropdown-toggle" data-toggle="dropdown" type="button">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_164
			+ '    <span class="caret"></span>'
			+ '</button>'
			+ '<ul class="dropdown-menu pull-">'
			+ '		<li id="Calculate" name="Calculate" type="" uipk=""><a href="javascript:;">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_164
            + '</a></li>'
			+ '		<li id="CalculateBack" name="CalculateBack" type="" uipk=""><a href="javascript:;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_67
			+ '</a></li>'
			+ '</ul>'
			+ '</div>'
			+ '<div id="calculateBtnGroup" class="btn-group">'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_164
			+ '" id="Calculate">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_164
			+ '</button></span>'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_67
			+ '" id="CalculateBack">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_67
			+ '</button></span>'
			+ '</div>'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_89
			+ '" id="tranSalary">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_89
			+ '</button></span>'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_216
			+ '" id="salarySumResult">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_216
			+ '</button></span>'
			+ '<div id="attendCaculateBtnGroupDetail" class="btn-group">'
			+ '<button class="btn-wide shrbtn dropdown-toggle" data-toggle="dropdown" type="button">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_90
			+ '    <span class="caret"></span>'
			+ '</button>'
			+ '<ul class="dropdown-menu pull-">'
			+ '		<li id="allAttendCaculate" name="allAttendCaculate" type="" uipk=""><a href="javascript:;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_157
			+ '</a></li>'
			+ '		<li id="selectAttendCaculate" name="selectAttendCaculate" type="" uipk=""><a href="javascript:;">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_93
            + '</a></li>'
			+ '</ul>'
			+ '</div>'
			+ '<div id="attendCaculateBtnGroup" class="btn-group">'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_157
			+ '"     id="allAttendCaculate">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_157
			+ '</button></span>'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_93
			+ '"   id="selectAttendCaculate">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_93
			+ '</button></span>'
			+ '</div>'
			+ '<span><button id="sumResult" type="button" name="sumResult" class="shrbtn-primary shrbtn">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_83
            + '</button><span>'
			+ '<span><button id="salaryBack" type="button" name="salaryBack" class="shrbtn-primary shrbtn">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_30
            + '</button><span>'
			+ '<span><button id="calculateCustomerSumResult" class="shrbtn-primary shrbtn" name="calculateCustomerSumResult">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_77
			+ '</button></span>'
			+ '<span><button id="calculateSelectedCustomerSumResult" class="shrbtn-primary shrbtn" name="calculateSelectedCustomerSumResult">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_78
			+ '</button></span>'
			+ '<span><button id="deleteSum" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_162
            + '" type="button" class="shrbtn" >'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_162
            + '</button></span>'
			+ '<div id="billBtnGroup" class="btn-group">'
			+ '<button class="btn-wide shrbtn dropdown-toggle" data-toggle="dropdown" type="button">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_45
			+ '    <span class="caret"></span>'
			+ '</button>'
			+ '<ul class="dropdown-menu pull-">'
			+ '		<li id="leaveBill" name="leaveBill" type="" uipk=""><a href="javascript:;">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_144
			+ '</a></li>'
			+ '		<li id="fillSignCard" name="fillSignCard" type="" uipk=""><a href="javascript:;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_24
			+ '</a></li>'
			+ '		<li id="tripBill" name="tripBill" type="" uipk=""><a href="javascript:;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_35
			+ '</a></li>'
			+ '		<li id="overTimeBill" name="overTimeBill" type="" uipk=""><a href="javascript:;">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_94
            + '</a></li>'
			+ '</ul>'
			+ '</div>'
			/*+ '<span><button id="leaveBill" class="shrbtn-primary shrbtn" name="leaveBill">请假</button></span>'
			+ '<span><button id="fillSignCard" class="shrbtn-primary shrbtn" name="fillSignCard">补卡</button></span>'
			+ '<span><button id="tripBill" class="shrbtn-primary shrbtn" name="tripBill">出差</button></span>'
			+ '<span><button id="overTimeBill" class="shrbtn-primary shrbtn" name="overTimeBill">加班</button></span>'*/
			+ '<div id="scheduleShiftBtnGroup" class="btn-group">'
			+ '<button class="btn-wide shrbtn dropdown-toggle" data-toggle="dropdown" type="button">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_193
			+ '    <span class="caret"></span>'
			+ '</button>'
			+ '<ul class="dropdown-menu pull-">'
			+ '		<li id="scheduleShiftBatchEdit" name="scheduleShiftBatchEdit" type="" uipk=""><a href="javascript:;">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_143
			+ '</a></li>'
			+ '		<li id="scheduleShiftBatchVal" name="scheduleShiftBatchVal" type="" uipk=""><a href="javascript:;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_142
			+ '</a></li>'
			+ '</ul>'
			+ '</div>'

			+ '<div id="moreBtnGroup" class="btn-group">'
			+ '<button class="btn-wide shrbtn dropdown-toggle" data-toggle="dropdown" type="button">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_75
			+ '    <span class="caret"></span>'
			+ '</button>'
			+ '<ul class="dropdown-menu pull-">'
			+ '		<li id="changeAttenceOrg" name="changeAttenceOrg" type="" uipk=""><a href="javascript:;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_101
			+ '</a></li>'
			+ '		<li id="pressToConfirm" name="pressToConfirm" type="" uipk=""><a href="javascript:;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_41
			+ '</a></li>'
			+ '		<li id="attendanceResultImport" name="attendanceResultImport" type="" uipk=""><a href="javascript:;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_62
            + '</a></li>'
			+ '		<li id="attendanceResultExportAll" name="attendanceResultExportAll" type="" uipk=""><a href="javascript:;">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_59
			+ '</a></li>'
			+ '		<li id="attendanceResultExportCurrent" name="attendanceResultExportCurrent" type="" uipk=""><a href="javascript:;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_61
			+ '</a></li>'
			+ '</ul>'
			+ '</div>'
			/*+ '<span><button id="changeAttenceOrg" class="shrbtn-primary shrbtn" name="changeAttenceOrg">考勤地点修订</button></span>'
			+ '<span><button id="pressToConfirm" class="shrbtn-primary shrbtn" name="pressToConfirm">催办</button></span>'
			+ '<span><button id="attendanceResultImport" class="shrbtn-primary shrbtn" name="attendanceResultImport">导入</button></span>'
			+ '<div id="attendanceResultExportBtnGroup" class="btn-group">'
			+ '<button class="btn-wide shrbtn dropdown-toggle" data-toggle="dropdown" type="button">导出'
			+ '    <span class="caret"></span>'
			+ '</button>'
			+ '<ul class="dropdown-menu pull-">'
			+ '		<li id="attendanceResultExportCurrent" name="attendanceResultExportCurrent" type="" uipk=""><a href="javascript:;">导出选中</a></li>'
			+ '		<li id="attendanceResultExportAll" name="attendanceResultExportAll" type="" uipk=""><a href="javascript:;">导出全部</a></li>'
			+ '</ul>'
			+ '</div>'*/
			+ '<div id="salaryExportDiv" class="btn-group">'
			+ '<button class=" shrbtn dropdown-toggle" data-toggle="dropdown" type="button">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_58
			+ '<span class="caret"></span>'
			+ '</button>'
			+ '<ul class="dropdown-menu pull-">'
			+ '<li id="exportCurrent" name="exportCurrent" type="" uipk=""><a href="javascript:;">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_61
            + '</a></li>'
			+ '<li id="exportToExcel" name="exportToExcel" type="" uipk=""><a href="javascript:;">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_59
			+ '</a></li>'
			+ '</ul>'
			+ '</div>'
			+ '<span><span id="sumDisplay">'
			+ '<a name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_88
			+ '" id="summary" href="#" style=" margin-left: 30px; margin-right: 10px;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_88
			+ '</a>'
			+ '<div id="DisplayResult">'
			+ '</div>'
			+ '</span></span>'
			+ '<span><span id="detailDisplay">'
			+ '<a name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_132
			+ '" id="detail" href="#">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_132
			+ '</a>'
			+ '<div id="DisplayDetail">'
			+ '</div>'
			+ '</span></span>'
			+ '<span width="130px"><input type="hidden"  id="attend" class="shrbtn-primary shrbtn" ></input></span>'
			+ '<div id="microToolbar" style="width:300px"></div>'
			+ '</div>';
		$('#choiceList').append(row_fields_work);
		$('#menuList').append(menu);
		//$('#CalculateBack').hide();
		$('button[id=CalculateBack]').hide();
		$('#tranSalary').hide();
		$('#salaryBack').hide();
		$('#salaryExportDiv').hide();
		$('#salarySumResult').hide();
		$('#calculateBtnGroupDetail').hide();
		$('#attendCaculateBtnGroupDetail').hide();
		$('#sumResult').hide();
		$('#calculateSelectedCustomerSumResult').hide();
		$('#calculateCustomerSumResult').hide();
	  $('#deleteSum').hide();
		that.showDetailButton(false);
		$("#switchDetail").show();
		that.processAuditAction(); // 审核  反审核  转薪资
		that.workFlowBillsCheckedEvent();// 流程单据检查
		that.pressToConfirm();
	},
	onclickAttendProject : function() {
			var self = this;
			$("#detail").click(function(event){ // 明细显示
					event.stopPropagation();//阻止事件向上冒泡
					if($('#DisplayResult').html()){
						$("#summary").text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_88);
						$("#DisplayResult").fadeOut();
						$("#DisplayResult").empty();
						//return ;
					}
					if($('#DisplayDetail').html()){
						$("#detail").text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_132);
						$("#DisplayDetail").fadeOut("normal",function(){
							$("#DisplayDetail").empty();
						});
						$('#DisplayDetail').removeClass("scrollDiv");
						addRowID=1;
						return;
					}
					$("#detail").text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_131);
					$("#DisplayDetail").empty();
					addRowID=1;
					var row_work =''
						+ '<div>'
						+ '<span><button type="button" id="editSum" class="null shrbtn">'
                        + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_23
						+ '</button></span>'
						+ '<span><button type="button" id="saveSum" class="shrbtn-primary shrbtn">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_20
						+ '</button></span>'
						+ '<span><button type="button" id="cancelSum" class="shrbtn-primary shrbtn">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_156
						+ '</button></span>'
						+ '</div>'
						+ '<div style="padding-top:15px;margin-left: 30px;width:400px;" class="row-fluid row-block row_field">'
						+ '<div class="spanSelf" ><span class="cell-RlStdType">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_187
						+ '</span></div>'
						+ '<div class="spanSelf" ><span class="cell-RlStdType">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_185
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
									+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_183
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
											shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_116});
				     	  	 					flag=false ;
				     	  	 					return ;
									}
									if(name.indexOf(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_172)!=-1){
											shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_115});
				     	  	 					flag=false ;
				     	  	 					return ;
									}
									 for(var k=0;k<i;k++)
				     				{   
				     	  				json = eval(json)  ;
				     	  				if(name==json[k].name )
				     	  				{
				     	  	 				shr.showError({message:shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_65,[k+1, i+1])});
				     	  	 				flag=false ;
				     	  	 				return ;
				     	  				} 
				     	  				if(sequence==json[k].sequence){
				     	  					shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_66,[k+1,i+1])});
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
												message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_21,
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
						$("#detail").text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_132);
						$("#DisplayDetail").fadeOut();
						$("#DisplayDetail").empty();
						//return ;
					}
					if($('#DisplayResult').html()){
						$("#summary").text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_88);
						$("#DisplayResult").fadeOut("normal",function(){
							$("#DisplayResult").empty();
						});
						$('#DisplayResult').removeClass("scrollDiv");
						addRowID=1;
						return ;
					}
					$("#summary").text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_87);
					$("#DisplayResult").empty();
					addRowID=1;
					var row_work =''
						+ '<div>'
						+ '<span><button type="button" id="editSum" class="null shrbtn">'
                        + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_23
                        + '</button></span>'
						+ '<span><button type="button" id="saveSum" class="shrbtn-primary shrbtn">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_20
                        + '</button></span>'
						+ '<span><button type="button" id="cancelSum" class="shrbtn-primary shrbtn">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_156
						+ '</button></span>'
						+ '</div>'
						+ '<div style="padding-top:15px;margin-left: 30px;width:400px;" class="row-fluid row-block row_field">'
						+ '<div class="spanSelf" ><span class="cell-RlStdType">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_187
						+ '</span></div>'
						+ '<div class="spanSelf" ><span class="cell-RlStdType">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_185
						+ '</span></div>'
						+ '</div>';
					$("#DisplayResult").append(row_work);
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
									+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_182
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
											shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_116});
				     	  	 					flag=false ;
				     	  	 					return ;
								}
								
								if(name != undefined && sequence!= undefined)
								{	
									if(name.indexOf(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_172)!=-1){
											shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_115});
				     	  	 					flag=false ;
				     	  	 					return ;
									
									}
									 for(var k=0;k<i;k++)
				     				{   		 
				     	  				json = eval(json)  ;
				     	  				if(name==json[k].name )
				     	  				{
				     	  	 				shr.showError({message:shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_65,[k+1,i+1])});
				     	  	 				flag=false ;
				     	  	 				return ;
				     	  				} 
				     	  				if(sequence==json[k].sequence){
				     	  					shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_66,[k+1,i+1])});
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
												message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_21,
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
												message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_22,
												hideAfter : 3
											});
										}
								})
							}
						}							
					});
			}) 
		/*$('button[id^=query]').click(function() {
			if($("#queryDiv").css("height")!="0px"){
//				$("#queryDiv").animate({height:"0px"},500,function(){
//					//$("#queryDiv").css({"display":"none"});
//				});
//				$("#pageTabs").animate({top:"0px"},500);
				
				//已计算页签--明细显示点击查询时
				if(isCalShowDetail==true){
					self.getJqgridData(9);
				}
				else{
					self.getJqgridData(1);
				}			
			}else{
				$("#sidebar").animate({"width":parseFloat($("#home-wrap").css("margin-left"))+40+"px"});
				$("#queryDiv").animate({height:transition},500,function(){
					$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
				});
				//$("#pageTabs").animate({top:transition},500);
				$("#unfold").html("");
			}
			//self.getJqgridData();
		});*/
		$("#unfold").click(function(){
			this.queryAction();
			//$('button[id^=query]').trigger("click");
		});
		$('#confirmQuery').click(function() {
			$("#queryDiv").animate({height:"0px"},500,function(){
			});
			//$("#pageTabs").animate({top:"0px"},500);
			self.getJqgridData();
		});
		$('#packUp').click(function() {
			$("#sidebar").animate({"width":parseFloat($("#home-wrap").css("margin-left"))+40+"px"});
			$("#queryDiv").animate({height:"0px"},500,function(){
				$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
			});
			//$("#pageTabs").animate({top:"0px"},500);
			$("#unfold").html("▼");	
		});
	},
	addRowFieldString :function($name){
    	var row_fields_work = '<div  class="row-fluid row-block row_field" style="margin-left:30px;width:400px;" id="'+ addRowID +'">'
			+ '<div class="spanSelf"><input type="text" name="attendName" value="'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_173
			+ '" class="input-height cell-input" style="color:#cccccc" validate="{required:true}" /></div>'
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
	   		 		if($(this).val()==jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_173 ) // 鼠标移至输入框，则清空输入框且改变背景色
	   		 		{
	   		 			$(this).val("") ;
	   		 			$(this).css('color','#555555');
	   		 		}
	   		 });
	   		  $("input[name='attendName']").live('blur',function(){
				var pass = $(this).val();
				if(pass ==""){
					$(this).val(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_173);
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
	getJqgridData:function(refresh){
	 	var self=this;
	 	
	 	if ($("#pageTabs").find('ul li').eq(1).hasClass("select"))
	 	{
	 		self.waitCalPersonList();
	 		return ;
	 	}
	 	if ($("#pageTabs").find('ul li').eq(0).hasClass("select"))
	 	{
	 		self.attendPersonList();
	 		return ;
	 	}
	 	if ($("#pageTabs").find('ul li').eq(4).hasClass("select"))
	 	{
	 		self.doRenderDataGridForSalary(2);
	 		return ;
	 	}
	 	if ($("#pageTabs").find('ul li').eq(5).hasClass("select"))
	 	{
//	 		self.doRenderDataGridForSalary(1);//已转薪资
	 		self.doRenderDataGridForSalaryMd(1);//已转薪资查询中间表
	 		return ;
	 	}
	 	if($("#attencePolicy_el").val()==""){
	 		shr.showInfo({
						message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_118,
						hideAfter : 3
					}); 
			return; 
	 	}
		if (!self.verifyDate()) {
			shr.showInfo({
						message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_121,
						hideAfter : 3
					}); 
			return; 
		}
		$("#sidebar").hide();
		$('#datagrid').empty();
		if(refresh==9 || isCalShowDetail==true){
			$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>'); // 表头是可变的，所以要动态生成节点
		}
		else{
			$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>'); // 表头是可变的，所以要动态生成节点
		}
		self.renderDataGrid(refresh);
	},
	verifyDate : function() {
		
		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		if(beginDate=="" || endDate==""){
			return false;
		} 
		return true;
	},
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
		//var beginRealDate = new Date(beginDate);	
		//var endRealDate = new Date(endDate);
		var beginRealDate = new Date(Date.parse(beginDate.replace(/-/g,"/")));	
		var endRealDate   = new Date(Date.parse(endDate.replace(/-/g,"/")));
		if(beginRealDate.getTime()<=curDate && endRealDate.getTime()>=curDate){
			return true ;
		}else{
			return false;
		}
	},
	/*
	initCurrentDate : function() { // 跟当前的日期作比较
		var curDate = new Date();
		
		var curDateY = curDate.getFullYear()+"";
		var curDateM = curDate.getMonth() + 1;
		curDateM = curDateM < 10 ? "0" + curDateM : curDateM+"";
		return curDateY+curDateM;
	},
	*/	
	 //* 设置表头
	 //* 根据前台查询的需要设置不同的表头
	 //* 表头主要是由三部分组成的
	 //*  1、固定列（姓名和编号）2、汇总项 3、日期范围
	 //*  汇总项直接在后台访问生成
	 //*  日期范围必须有用户从前台选择生成
	renderDataGrid : function(refresh) {
		var self = this;
		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var method="getGridColModel";
		if(refresh==9){
			method="getGridColModelForDetail";
		}
		self.remoteCall({
					method : method,
					param : {
						"beginDate" : beginDate,
						"endDate" : endDate, 
						"attendPolicyId":attendPolicyId,
						"hrOrgUnitId" : $("#hrOrgUnit").shrPromptBox("getValue").id
					},
					success : function(reponse) {
						if(refresh==1||refresh == 3){
							self.doRenderDataGrid(reponse,refresh);
						}
						else if(refresh==9){
							self.doRenderDataGridForDetail(reponse,refresh);
						}					
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
	doRenderDataGrid : function(reponse,refresh) {
	
		var self = this;
		var table = $("#reportGrid");
		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var proposerId = $('input[name=proposer]').val();
		var hrOrgUnitId = $('#hrOrgUnit_el').val();
		currentIsConfirm = isConfirm;
		var url = self.getGridDataRequestURL();
		var colNames = reponse.colNames;
		var colModel = reponse.colModel;
		var options = {
			url : url + '&orgLongNum=' + orgLongNum + '&proposerId=' + encodeURIComponent(proposerId)
					+ '&attendPolicyId=' + encodeURIComponent(attendPolicyId) + '&attendanceGroupID='+encodeURIComponent(attendanceGroupID)+'&attendPeriodId=' + encodeURIComponent(attendPeriodId)
					+ '&beginDate=' + beginDate + '&endDate=' + endDate + '&hrOrgUnitId='+encodeURIComponent(hrOrgUnitId)+'&step='+step + '&refresh='+refresh +'&serviceId='+ encodeURIComponent(shr.getUrlRequestParam("serviceId")),
			datatype : "json", 
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
			viewrecords : true,
			// cellEdit:true,
			//cellsubmit : "clientArray",
			// sortname : defaultSortname,
			// caption: "Frozen Header",
			/*
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
			*/
			onCellSelect : function(rowid, index, contents, event) {
				var data = $("#reportGrid").jqGrid("getRowData", rowid);
				var personId = data['personId'];
				var adminOrgId = data['adminOrgUnitId'];
				// 点击名字是弹出这个时间段人的所有考勤情况,以日历的形式展示
				if(index == 0){
					return ;
				}
				if (colModel[index-1].name == 'personName' || colModel[index-1].name=='personNumber') {
					isBackShow=true;
					var personName = data['personName'];
					self.showCalendarDetailAction(personId,adminOrgId,personName);
				} else
				// 点击具体某个项目时，弹出这个项目的明细
				if (colModel[index-1].name.substring(0, 1) == "S") {
					if (contents == 0) {
						shr.showInfo({
									message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_72
								});
						return;
					}
					var attendName = colModel[index-1].name;
					var personName = data['personName'];
					attendNameOnSelect=attendName;
					isBackShow=true;
					self.showDetailOnProject(attendName,personName,personId,adminOrgId);
					// 以20开头便是点击日期
				} else if (colModel[index-1].name.substring(0, 2) == "20") {
					var tDay = colModel[index-1].name;
					var personName = data['personName'];
					var personId = data['personId'];
					action="dayDetail";
					$("#calendar_info").empty();
					$("#calendar_info").next().remove();
					isBackShow=false;
					self.showBillDetailAction(personName,tDay,personId,adminOrgId);
				}
				$(window).resize();
				//掩藏没有权限的按钮
				self.hideNotAccessButton();
			},
			onSelectRow : function(id) {
				jQuery('#reportGrid').jqGrid('editRow', id, false, function() {});
				sidValue.push(id);
				lastsel2 = id;
				$("#reportGrid").attr("sid", sidValue.join(","));
			},

			editurl : this.dynamicPage_url + "?method=editRowData" + "&uipk="+ this.reportUipk

		};
		options.loadComplete = function(data) {
			self.handleMicroToolbarInfo();
		};
		table.html();
		table.jqGrid(options);
		$(window).resize();
		jQuery("#reportGrid").jqGrid(options);
		jQuery('#reportGrid').jqGrid('setFrozenColumns');
		$("#datagrid").find(".frozen-bdiv").eq(0).css("height",$("#datagrid").find(".ui-jqgrid-bdiv").eq(0).height()-16)//不加这行固定列会超出div
	},
	//点击明细项目时显示汇总信息
	showDetailOnProject:function(attendName,personName,personId,adminOrgId,beginDate,endDate){
		var self = this;
		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		self.remoteCall({
			type : "post",
			method : "getOneAttendanceDetail",
			param : {
				personId : personId,
				adminOrgId : adminOrgId,
				beginDate : beginDate,
				endDate : endDate,
				attendName : attendName
			},
			success : function(res) {
				var events = [];
				isReload = false;
				$('#calendar_info').empty();
				$('#calendar_info').dialog({
							title : personName + " " + res[0].name+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_129,
							width : 500,
							height : 520,
							maxWidth : 1200,
							modal : true,
							resizable : true,
							position : {
								my : 'center',
								at : 'top+15%',
								of : window
							},
							close: function(event, ui)
							{ 
							   if(isReload){ 
							    jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
							   }
							} //这是关闭事件的回调函数,在这写你的逻辑
						});
				$("div[class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix']").css('border-bottom','1px solid #ccc');
				if (res != null && res.length > 0) {
					var row_fields_work = ''
						+ '<div style="width:100%;margin:10px;float:left" >'
						+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_23
						+ '" id="editDetailProject" >'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_23
						+ '</button></span>'
						+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
                        + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_20
						+ '" id="saveDetailProject" >'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_20
						+ '</button></span>'
						+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_156
						+ '" id="cancelDetailProject" >'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_156
						+ '</button></span>'
						+ '<span><input id="hiddAttendCol" type="hidden" value='+res[0].columnNO+'></input></span>'
						+ '</div>'
					$('#calendar_info').append(row_fields_work);
				}
				for (var i = 0; i < res.length; i++) {
					var tmpDate = res[i].date.substring(0, 10);
					var row_fields_work = ''
							+ '<div id="Main'+i+'" name='+ res[i].id+' style="margin:20px;float:left;width:40%">'
							+ '<a href="javascript:void(0)" style="text-decoration:underline;" id="attendDate" onclick="showOneDayDetailOnProject(&quot;'+personName+'&quot;,&quot;'+tmpDate+'&quot;,&quot;'+personId+'&quot;,&quot;'+adminOrgId+'&quot;)" style="margin-right: 10px;width:68%;">'+ tmpDate+ '</a>'
							+ '<span id="AttendLen" style="width:20%;margin-left: 10px;">'+ res[i].lenth+'</span>'
							+ '<span id="len" style="margin-left:10px" >'+ res[i].Unit+'</span>' 
							+ '</div>' 
					$('#calendar_info').append(row_fields_work);
				}
				if(step == 2) // 审核状态不能编辑
				{
					$('button[id=editDetailProject]').hide();
					
				}else{
					$('button[id=editDetailProject]').show();
				}
				$('button[id=saveDetailProject]').hide();
				$('button[id=cancelDetailProject]').hide();
				self.onclickEditOrSave();
				//掩藏没有权限的按钮
				self.hideNotAccessButton();
			}
		});
	},
	//用于已计算页签--明细显示
	doRenderDataGridForDetail : function(reponse,refresh) {
		
		var self = this;
		var table = $("#reportGrid");
		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var proposerId = $('input[name=proposer]').val();
		var hrOrgUnitId = $('#hrOrgUnit_el').val();
		var filterItems = self.getQuickFilterItems();
		currentIsConfirm = isConfirm;
		var postData = {
				'filterItems' :filterItems
			};
		var serviceId = shr.getUrlRequestParam("serviceId");
		var url = this.dynamicPage_url + "?method=getGridDataDetail" + "&uipk="+ this.reportUipk + "&serviceId=" + encodeURIComponent(serviceId);
		var colNames = reponse.colNames;
		var colModel = reponse.colModel;
		var options = {
			url : url + '&orgLongNum=' + orgLongNum + '&proposerId=' + encodeURIComponent(proposerId)
					+ '&attendPolicyId=' + encodeURIComponent(attendPolicyId) + '&attendanceGroupID='+encodeURIComponent(attendanceGroupID)+'&attendPeriodId=' + encodeURIComponent(attendPeriodId)
					+ '&beginDate=' + beginDate + '&endDate=' + endDate + '&step='+step + '&refresh='+refresh +'&selectStates='+selectStates+'&hrOrgUnitId='+encodeURIComponent(hrOrgUnitId),
			datatype : "json", 
			multiselect : true,
			rownumbers : false,
			colNames : colNames,
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			pager : '#gridPager1',
			postData: postData ,
			height : self.rowNumPerPage > 21 ? '520px' : 'auto',
			rowList : [15,30,50,100],
			recordpos : 'left',
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			pginput : true,
			shrinkToFit : reponse.colModel.length > 10 ? false : true,
			viewrecords : true,
			// cellEdit:true,
			//cellsubmit : "clientArray",
			// sortname : defaultSortname,
			// caption: "Frozen Header",
			/*
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
			*/
			onCellSelect : function(rowid, index, contents, event) {
				var data = $("#reportGrid").jqGrid("getRowData", rowid);
				//var personId = data['personId'];
				var adminOrgId =data['fadminOrgUnitId'];
				var tDay =  data['FAttenceDate'];
				var personName = data['personName'];
				var personId = data['proposerId'];
				// 点击名字是弹出这个时间段人的所有考勤情况,以日历的形式展示
				if(index == 0){
					return ;
				}
				if (colModel[index-1].name == 'personName' || colModel[index-1].name=='personNumber') {
					// var personName = data['personName'];
					// self.showCalendarDetailAction(personId,adminOrgId,personName);



					
					action="dayDetail";
					$("#calendar_info").empty();
					$("#calendar_info").next().remove();
					isBackShow=false;
					self.showBillDetailAction(personName,tDay,personId,adminOrgId);
				}
				// } else
				// // 点击具体某个项目时，弹出这个项目的明细
				// if (colModel[index-1].name.substring(0, 1) == "S") {
				// 	if (contents == 0) {
				// 		shr.showInfo({
				// 				message : "该汇总项没有明细"
				// 				});
				// 		return;
				// 	}
				// 	var attendName = colModel[index-1].name;
				// 	var personName = data['personName'];
				// 	self.remoteCall({
				// 		type : "post",
				// 		method : "getOneAttendanceDetail",
				// 		param : {
				// 			personId : personId,
				// 		adminOrgId : adminOrgId,
				// 			beginDate : beginDate,
				// 			endDate : endDate,
				// 		attendName : attendName
				// 		},
				// 		success : function(res) {
				// 			var events = [];
				// 			isReload = false;
				// 			$('#calendar_info').empty();
				// 			$('#calendar_info').dialog({
				// 						title : personName + ' ' + res[0].name+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_129,
				// 					width : 500,
				// 						height : 520,
				// 						maxWidth : 1200,
				// 						modal : true,
				// 						resizable : true,
				// 						position : {
				// 							my : 'center',
				// 							at : 'top+15%',
				// 							of : window
				// 						},
				// 					close: function(event, ui)
				// 						{ 
				// 						   if(isReload){ 
				// 						    jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
				// 						   }
				// 						} //这是关闭事件的回调函数,在这写你的逻辑
				// 					});
				// 		$("div[class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix']").css('border-bottom','1px solid #ccc');
				// 			if (res != null && res.length > 0) {
				// 				var row_fields_work = ''
				// 						+ '<div style="width:100%;margin:10px;float:left" >'
				// 						+ '<span><button type="button" class="shrbtn-primary shrbtn" name="编辑" id="editDetailProject" >编辑</button></span>'
				// 						+ '<span><button type="button" class="shrbtn-primary shrbtn" name="保存" id="saveDetailProject" >保存</button></span>'
				// 						+ '<span><button type="button" class="shrbtn-primary shrbtn" name="取消" id="cancelDetailProject" >取消</button></span>'
				// 						+ '<span><input id="hiddAttendCol" type="hidden" value='+res[0].columnNO+'></input></span>'
				// 						+ '</div>'
				// 				$('#calendar_info').append(row_fields_work);
				// 			}
				// 			for (var i = 0; i < res.length; i++) {
				// 				var tmpDate = res[i].date.substring(0, 10);
				// 				var row_fields_work = ''
				// 						+ '<div id="Main'+i+'" name='+ res[i].id+' style="margin:20px;float:left;width:40%">'
				// 						+ '<span id="attendDate" style="margin-right: 10px;width:40%;float:left;">'+ tmpDate+ '</span>'
				// 						+ '<span id="AttendLen" style="width:20%;float:left;">'+ res[i].lenth+'</span>'
				// 						+ '<span id="len" style="margin-left:10px" >'+ res[i].Unit+'</span>' 
				// 					+ '</div>' 
				// 				$('#calendar_info').append(row_fields_work);
				// 			}
				// 			if(step == 2) // 审核状态不能编辑
				// 			{
				// 				$('button[id=editDetailProject]').hide();
								
				// 			}else{
				// 			$('button[id=editDetailProject]').show();
				// 			}
				// 			$('button[id=saveDetailProject]').hide();
				// 		$('button[id=cancelDetailProject]').hide();
				// 			self.onclickEditOrSave();
				// 			//掩藏没有权限的按钮
				// 			self.hideNotAccessButton();
				// 		}
				// 	});
				// 	// 以20开头便是点击日期
				// } else if (colModel[index-1].name.substring(0, 2) == "20") {
				// 	var tDay = colModel[index-1].name;
				// 	var personName = data['personName'];
				// 	var personId = data['personId'];
				// 	action="dayDetail";
				// 	$("#calendar_info").empty();
				// 	$("#calendar_info").next().remove();
				// 	self.showBillDetailAction(personName,tDay,personId,adminOrgId);
				// }
				// $(window).resize();
				// //掩藏没有权限的按钮
				// self.hideNotAccessButton();
			},
			onSelectRow : function(id) {
//				jQuery('#reportGrid').jqGrid('editRow', id, false, function() {});
//				sidValue.push(id);
//				lastsel2 = id;
//				$("#reportGrid").attr("sid", sidValue.join(","));
			},

			editurl : this.dynamicPage_url + "?method=editRowData" + "&uipk="+ this.reportUipk

		};
		options.loadComplete = function(data) {
			self.handleMicroToolbarInfo();
//			$("#sidebar").show();
//			$("#sidebar").css({"width":parseFloat($("#home-wrap").css("margin-left"))+30+"px"});
//			$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
		};
		table.html();
		table.jqGrid(options);
		$(window).resize();
		jQuery("#reportGrid").jqGrid(options);
		jQuery('#reportGrid').jqGrid('setFrozenColumns');
		$("#datagrid").find(".frozen-bdiv").eq(0).css("height",$("#datagrid").find(".ui-jqgrid-bdiv").eq(0).height()-16)//不加这行固定列会超出div
	},
	
	
	//已汇总页签发请求
	doRenderDataGridForSalaryMd : function(salaryStatus) {
			var self = this;
			var reponse;
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelDoSalaryHandler";
			url +='&uipk=hr.ats.com.attendancePanelCalculate';
			shr.remoteCall({
				async:false,
				type:"GET",
				url:url,
				param : {
					hrOrgUnitId:$('#hrOrgUnit_el').val()
				},
				method : "getGridColModel",
				success : function(response) {
					reponse=response;
				}
			});
			$('#datagrid').empty();
			$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>'); // 表头是可变的，所以要动态生成节点
			var table = $("#reportGrid");
			var beginDate = $('input[name=beginDate]').val();
			var endDate = $('input[name=endDate]').val(); 
			var proposerId = $('input[name=proposer]').val();
			var hrOrgUnitId = $('#hrOrgUnit_el').val();
			
			var url = this.dynamicPage_url + "?handler=com.kingdee.shr.ats.web.handler.AttendancePanelDoSalaryHandler&method=getMdGridData" + "&uipk="+ this.reportUipk+'&serviceId='+ encodeURIComponent(shr.getUrlRequestParam("serviceId"));
			var colNames = reponse.colNames;
			var colModel = reponse.colModel; 
			var filterItems = self.getQuickFilterItems();
			if( filterItems == undefined){
				filterItems = "" ;
			}
			postData = {
					hrOrgUnitId : hrOrgUnitId,
					beginDate : beginDate,
					endDate : endDate,
					salaryStatus:salaryStatus,
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
				height : self.rowNumPerPage > 21 ? '590px' : 'auto',
				postData : postData,
				rowList : [15, 30, 50, 100],
				recordpos : 'left',
				recordtext : '({0}-{1})/{2}',
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
	
	//已汇总页签发请求
	doRenderDataGridForSalary : function(salaryStatus) {
			var self = this;
			var reponse;
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelDoSalaryHandler";
			url +='&uipk=hr.ats.com.attendancePanelCalculate';
			shr.remoteCall({
				async:false,
				type:"GET",
				url:url,
				param : {
					hrOrgUnitId:$('#hrOrgUnit_el').val()
				},
				method : "getGridColModel",
				success : function(response) {
					reponse=response;
				}
			});
			$('#datagrid').empty();
			$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>'); // 表头是可变的，所以要动态生成节点
			var table = $("#reportGrid");
			var beginDate = $('input[name=beginDate]').val();
			var endDate = $('input[name=endDate]').val(); 
			var proposerId = $('input[name=proposer]').val();
			var hrOrgUnitId = $('#hrOrgUnit_el').val();
			
			var url = this.dynamicPage_url + "?handler=com.kingdee.shr.ats.web.handler.AttendancePanelDoSalaryHandler&method=getGridData" + "&uipk="+ this.reportUipk+'&serviceId='+ encodeURIComponent(shr.getUrlRequestParam("serviceId"));
			var colNames = reponse.colNames;
			var colModel = reponse.colModel; 
			var filterItems = self.getQuickFilterItems();
			if( filterItems == undefined){
				filterItems = "" ;
			}
			postData = {
					hrOrgUnitId : hrOrgUnitId,
					beginDate : beginDate,
					endDate : endDate,
					salaryStatus:salaryStatus,
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
				height : self.rowNumPerPage > 21 ? '590px' : 'auto',
				postData : postData,
				rowList : [15, 30, 50, 100],
				recordpos : 'left',
				recordtext : '({0}-{1})/{2}',
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
	
	addShowAttend : function(index){
		var punchCar_List ='';
		punchCar_List += '<div class="row-fluid row-block row_field" >' 
			+ '<span class="spanSelf" style="width:10%;margin-left:45px;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_186
			+ '</span>'
			+ '<span class="spanSelf" style="width:30%"><input type="text" name="attendanceName" class="input-height cell-input"></input></span>' 
			+ '<span class="spanSelf" style="width:5%"></span>' //值: 
			+ '<span class="spanSelf" style="width:40px" name="showInput"></span>'  //<input type="text" style="width:40px" class="input-height cell-input"></input>
			+ '<span style="width:20px;margin-left:20px"><a name="addShowAttend" class="addShowAttend">+</a></span>'
   		if(index ==1)
   		{
   			punchCar_List += '<span><a class="delShowAttend" style="width:20px;margin-left:20px">x</a></span>'
   		}
   		punchCar_List += '</span>' 
					    + '</div>'
		return punchCar_List;
	},
		
	// 编辑考勤明细 根据日期
	editDetailAttendProject : function(personId, tDay,adminOrgUnitId) {
		var personId   = personId;
		var attendDate = tDay;
		var adminOrgId = adminOrgUnitId;
		var self=this;
		
		$('.addShowAttend').die().live('click',function(){
			var content = self.addShowAttend(1);
			$('#calendar_info').append(content);
			$('input[name=attendanceName]').shrSelect(showAttendJson);
			$('.overflow-select').css("max-height","150px").css("overflow-y","auto");
		})
		$("input[name='attendanceName']").die().live('change',function(){  // 下拉框的值变化
			var valText = $(this).prev().val();
			var valName = $(this).val();
			$(this).parent().parent().parent().parent().next().text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_207);
			if(valText.indexOf("_") > 0){
				valText = valText.substring(1);
				var dateStr = valText.split("_");
				if(dateStr[1] == ""){ dateStr[1] = 0 ;}	
				if(dateStr.length > 2){//值的本身就包含下划线的时候。
					dateStr[1] = valText.substring(valText.indexOf("&") + 1,valText.length) ;
				} 
				$(this).parent().parent().parent().parent().next().next().text(dateStr[1]);   
			}else{
				// IE 会把 下划线 等特殊符号过滤掉
				for(var o in self.attendMap){  
					if(self.attendMap[o].key == valText){
					    $(this).parent().parent().parent().parent().next().next().text(self.attendMap[o].value);   
						break ;
					}
				} 
			}
	 	});	
	 	
	 	$('span[name=showInput]').live('click',function(){
	 		if($("#status").text().indexOf(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_164) != -1){ return ; }
	 		if($(this).find('input').html()!=null){ return ;}
	 		if($(this).prev().prev().find('input[name=attendanceName]').val()==""){ return ;}
	 		$(this).wrapInner("<input type='text' value='"+$(this).html()+"' class='input-height cell-input' style='width:40px' />");
			$('#cancelProject').show();	 		
	 	});
	 	
		$('.delShowAttend').die().live('click',function(){
			$(this).parent().parent().remove();
		})
		
		$('.spanLeft').click(function(){ 
			if($("#status").text().indexOf(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_164) != -1){ return ; }
			var colNo = $(this).parent().attr('name') ;
			if($(this).find('input').html()!=null || colNo <=6)
			{
				return ;
			}
			$(this).wrapInner("<input type='text' name='attendName' value="+$(this).html()+" class='input-height cell-input'  validate='{required:true}' style='width:40px' />");
			$('#cancelProject').show();
		})
		
		$('#backToCalendar').die().live('click',function(){
			var personId=$('#leaveDetail').attr("name"); 
			var personName=$('#personName').attr("name"); 
			var adminOrgId = $('#title').attr("name");
			if(isDetailOnProject==true){
				isDetailOnProject=false;
				self.showDetailOnProject(attendNameOnSelect,personName,personId,adminOrgId);
			}
			else{
				self.showCalendarDetailAction(personId,adminOrgId,personName);	
			}		
			$("div[class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix']").css('border-bottom','1px solid #ccc');
			$('#backToCalendar').hide();
		})
		
		//点击取消时 ，去掉 input框，并且还原数据 
		$("#cancelProject").click(function(){
			 var tDay=$('#billInfo').attr("name");
			 var personId=$('#leaveDetail').attr("name");
			 var personName=$('#personName').attr("name");
		 	 $('.spanLeft input').each(function(){
					var val=$(this).text();
					var $par=$(this).parent();
					$par.text(val);
			 })
			  $('span[name=showInput] input').each(function(){
					var val=$(this).text();
					var $par=$(this).parent();
					$par.text(val);
			 })
			 $('#cancelProject').hide();
		})
		//点击保存时 ，做更新操作，成功之后要去掉input框 
		$("#saveProject").die().live('click',function(){
			 var attendDate  = $('#billInfo').attr("name");
			 var personId    = $('#leaveDetail').attr("name");
			 var personName  = $('#personName').attr("name");
			 var adminOrgUnitId =$('#title').attr("name");
			 var filterJson=[];
			 var len = $('span[name=showInput]').length ;
			 var j = 1;
			 var flag =true ;
			 $("span[name=showInput]").each(function(){
				  	var colNo = $(this).parent().find('input[name=attendanceName_el]').val().split("_")[0] ;
			  		//var tempName  = $(this).parent().find('input[name=attendanceName]').val() ;
			  	    if($(this).find('input').html() != null){ 
				  		var colVal = $(this).find('input').val() ;
				 	  	for(var k=0;k<j-1;k++)
					    {   		 
					     	  json = eval(filterJson)  ;
					     	  if( ("S"+colNo) == json[k].name )
					     	  {
					     	  	 shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_64,[k+1,j])});
					     	  	 flag = false;
					     	  	 return ;
					     	  }					     	
					    }
					     filterJson.push({'name':"S"+colNo,'value':colVal});
			  	    }    
			 		j++ ;
			 })
			 if(!flag){ return ;}
			 $('.spanLeft input').each(function() {
			 	 var name = $(this).parent().parent().attr('name') ;
			 	 if(name!= "1" && name!="2" && name!="3" && name!="4" && name!="5" && name!="6"){
			  	 	filterJson.push({'name':"S"+name,'value':$(this).val()});
			 	 }
			 }) ;
			
			if(filterJson.length == 0){ return ;}  
			var postData = $.toJSON(filterJson) ;
			var url = shr.getContextPath()
					+ "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelCalHandler";
				url +="&uipk=hr.ats.com.attendancePanelCalculate$fragment";
			 self.remoteCall({
						url : url,
						method:"updateAttendDateShowDetail",
						param : {
							postData : postData ,
							attendDate : attendDate,
							personId : personId ,
							adminOrgId:adminOrgId
						},
						beforeSend : function() {
							// openLoader(1); 
						},
						success : function(res) {
							if (res.flag == "SUCESS") 
							{
								self.showBillDetailAction(personName,attendDate,personId,adminOrgId);
								$('#cancelProject').hide();
								isReload =true ;
							}
						},
						error : function() {
							closeLoader();
						},
						complete : function() {
							closeLoader();
						}
					});
		}),
		$('#auditProject').click(function(){  // 审核
			 var personId=$('#leaveDetail').attr("name");
			 var attendDate=$('#billInfo').attr("name");
			 var personName=$('#personName').attr("name");
			 var adminOrgUnitId =$('#title').attr("name");
			 isReload = true ;
			 self.remoteCall({
						type : "post",
						method : "auditAttendanceRecord",
						param : {
							personId : personId,
							attendDate : attendDate,
							adminOrgUnitId : adminOrgUnitId,
							action : 2   //  FATTENCESTATUS = 2  审核
						},
						success : function(res){
							if(res.flag ==jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_32){
									$('#status').text("");
									$('#status')
									.text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_57);
									$('#auditProject').hide();
								    $('#calculateOneDay').hide();
								    $('#saveProject').hide();
									$('button[id=notAuditProject]').show();
									$('#cancelProject').hide();									
							}
							//掩藏没有权限的按钮
							self.hideNotAccessButton();	
						}
			 })	

			
		})
		
		$('#notAuditProject').click(function(){  // 反审核
			 var personId=$('#leaveDetail').attr("name");
			 var attendDate=$('#billInfo').attr("name");
			 var personName=$('#personName').attr("name");
			 var adminOrgUnitId =$('#title').attr("name");
			 isReload = true ;
			 self.remoteCall({
						type : "post",
						method : "auditAttendanceRecord",
						param : {
							personId : personId,
							attendDate : attendDate,
							adminOrgUnitId : adminOrgUnitId,
							action : 1   //  FATTENCESTATUS = 1  未审核
						},
						success : function(res){
							if(res.flag ==jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_32){
									$('#status').text("");
									$("#status").text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_56);
									$('button[id=auditProject]').show();
									$('button[id=calculateOneDay]').show();
									$('button[id=notAuditProject]').hide();
									$('#saveProject').show();
									$('#cancelProject').hide();
							}
							//掩藏没有权限的按钮
							self.hideNotAccessButton();	
						}
			 })
				
		})
		$('#calculateOneDay').click(function(){
			 var personId=$('#leaveDetail').attr("name");
			 var attendDate=$('#billInfo').attr("name");
			 var personName=$('#personName').attr("name");
			 var adminOrgUnitId =$('#title').attr("name");
			 openLoader(1); 
					 self.remoteCall({
						type : "post",
						method : "calculatePersonOneDay",
						param : {
							hrOrgUnitId:hrOrgUnitId,
							personId : personId,
							attendDate : attendDate
						},
						success : function(res){
							if(res.flag =="1"){
									shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_91});
									self.showBillDetailAction(personName,tDay,personId,adminOrgUnitId);
							}else{
									shr.showError({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_92});
							}
							//掩藏没有权限的按钮
							self.hideNotAccessButton();		
						},
						error : function() {
							closeLoader();
						},
						complete : function() {
							closeLoader();
						}
			 })
			
		})
		
	},

	// 编辑汇总项目中的明细值
	
	onclickEditOrSave : function() {
		$('#calendar_info').css('width', '100%');
		var Attendval = "";
		that = this ;
		//editDetailProject,saveDetailProject,cancelDetailProject
		$("button[id='editDetailProject']").click(function() {
				$('span[id^=AttendLen]').each(function() {
					$(this).wrapInner("<input type='text' style='width:40px;height:100%;padding:1px 3px;' value="+$(this).text()+"></input>");
				})
				$("#saveDetailProject").show();
				$("#cancelDetailProject").show();
				$("#editDetailProject").hide();
		 }),
			
		$("button[id='cancelDetailProject']").click(function() {
				$('span[id^=AttendLen]').each(function(){
					var val = $(this).text();
					$(this).empty().text(val);
				})
				 $("#saveDetailProject").hide();
			     $("#cancelDetailProject").hide();
				 $("#editDetailProject").show();
		}),
		
		$('button[id=saveDetailProject]').click(function() {
			
			 isReload = true ;
			 var filterJson = [];
			 var attendColumn=$('#hiddAttendCol').val();
			 $('div[id^=Main]').each(function() {
			  	 filterJson.push({'Id':$(this).attr("name"),'lenght':$(this).find("span").eq(0).find("input").val()});
			 }) ;
			 
			 var postData = $.toJSON(filterJson);
				var url = shr.getContextPath()
				+ "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelCalHandler";
				url +="&uipk=hr.ats.com.attendancePanelCalculate$fragment";
			  that.remoteCall({
					url : url,
					method:"updateShowDetail",
					param : {
						attendColumn : attendColumn,
						postData : postData
					},
					beforeSend : function() {
						// openLoader(1);
					},
					success : function(res) {
						if (res.flag == "SUCESS") {
							shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_21});
						}
						$('span[id^=AttendLen]').each(function(){
							var val=$(this).find("input").val();
							$(this).empty().text(val);
						})
						 $("#saveDetailProject").hide();
					     $("#cancelDetailProject").hide();
						 $("#editDetailProject").show();
					},
					error : function() {
						
					},
					complete : function() { 
	
						closeLoader();
					}
				});
			})
	},
	//日历显示
	showCalendarDetailAction:function(personId,adminOrgId,personName){
			var self=this;
			var beginDate = $('input[name=beginDate]').val(); 
			var endDate = $('input[name=endDate]').val();
			var curDate = new Date(beginDate);
			var curBeginDate = new Date(beginDate);
			var curEndDate = new Date(endDate);
			indexNextMonth=curEndDate.getMonth();
			indexMonth=curBeginDate.getMonth();
			indexYear=curBeginDate.getFullYear();
			$('#calendar_info').empty();
			$('#calendar_info').next().remove();
			$('#calendar_info').dialog({
						title : personName+' ('+beginDate+' -- '+endDate+")",
						width : 850, 
						height : 640,  
						maxWidth : 1200,
						modal : true,
						resizable : true,
						position : { 
							my : 'center',
							at : 'top+15%', 
							of : window 
						}
					});
			
			var workCalendar=''
							+"<div id='calendar_container' >" 
							+"<div id='calendar_setting' >"						
							+"<div id='yearInfo'></div>"
							+"<div id='monthSelector'><i class='icon-caret-left'/><div id='monthInfo' /><i class='icon-caret-right'/></div>"	
							+"</div>"
							+"<div id='calend_info'></div>"
							+"</div>" ;
			$('#calendar_info').append(workCalendar);	
			$('#monthInfo').html((indexMonth + 1) > 9 ? (indexMonth +1) : '0'+ (indexMonth +1));
			$('#yearInfo').html(indexYear 
					+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_134
				+ $.shrI18n.dateI18n.month2[indexMonth]);
			var clickLeft = false;
			var clickRight = (indexNextMonth== indexMonth) ? false : true;
			$('#monthSelector').find('i').click(function(e){
				var tar = e.target;
				if($(tar).hasClass('icon-caret-left')){
					if(clickLeft){
						if(indexMonth == 0){
							indexMonth = 11;
							indexYear = indexYear - 1;
						}else{
							indexMonth = indexMonth - 1;
						}
						clickLeft = false;
						clickRight = true;
						self.getAttendanceDetail(personId,adminOrgId,beginDate,endDate,personName);
						//$('#calend_info').fullCalendar('prev');
				}
				
			}else if($(tar).hasClass('icon-caret-right')){
				if(clickRight){
					if(indexMonth == 11){
						indexMonth = 0;
						indexYear = indexYear + 1; 
				}else{
					indexMonth = indexMonth + 1;
				} 
					clickLeft = true;
					clickRight = false;
					$('#calend_info').fullCalendar('next');
				}
		 }  
		$('#monthInfo').html((indexMonth + 1) > 9 ? (indexMonth +1) : '0'+ (indexMonth +1));
        $("#yearInfo").html(indexYear + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_134
			+ $.shrI18n.dateI18n.month2[indexMonth]);
        	// 跨月的情况
        	//self.getAttendanceDetail(personId,adminOrgId,beginDate,endDate,personName);
        
		});	 	 	
			self.getAttendanceDetail(personId,adminOrgId,beginDate,endDate,personName);
	},
	 getAttendanceDetail:function(personId,adminOrgId,beginDate,endDate,personName){
		var self=this;
		  self.remoteCall({
				type : "post",
				method : "getMyAttendanceDetail",
				param : {
					personId : personId,
					adminOrgId : adminOrgId,
					beginDate : beginDate,
					endDate : endDate 
					//detailProject:detailProject
				}, 
				success : function(res) {
					var curDate = new Date(beginDate);
					var curDateY = curDate.getFullYear();
					var curDateM = curDate.getMonth();
					//indexMonth=curDateM;
					//indexYear=curDateY;  
					var curBeginDate = new Date(beginDate);
					var curEndDate = new Date(endDate);
					// self.initAdvQueryPanel();
					_events = [] ;
					for (var i = 0; i < res.length; i++) {
						var event = {};
							event.day = res[i].day;
							event.start = new Date(res[i].date);
							event.title = res[i].title;
							_events.push(event);
						}
					self.initWorkCalendar(res,curBeginDate,curEndDate,personName,personId,adminOrgId);
	        }
		});
	}
	 ,initWorkCalendar:function(res,curBeginDate,curEndDate,personName,personId,adminOrgId){
		var self=this;
		//$('#calendar_info').css('width', '100%');
		$('#calend_info').empty(); 
		$('#calend_info').fullCalendar({
			header : {
				left : '', 
				center : '',
				right : ''
			},
			year : indexYear,
			month : indexMonth,
			dayNamesShort : [
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_211,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_215,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_209,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_212,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_213,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_214,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_210
			],
			monthNamesShort : [
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_9,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_10,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_11,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_12,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_13,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_14,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_15,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_16,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_17,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_6,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_7,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_8
			],
			monthNames : [
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_9,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_10,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_11,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_12,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_13,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_14,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_15,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_16,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_17,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_6,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_7,
				jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_8
			],
			editable : true,
			disableDragging : true,
			events : _events,
			eventRender : function(event, element) {
			},
			eventAfterRender : function(event, element,view) {
				var title = "";
				var bMonth = curBeginDate.getMonth();
				var eMonth = curEndDate.getMonth();
				var tYear = curBeginDate.getFullYear();
				var tempMonth = $('#monthInfo').text(); //当前展示月份
				tempMonth = tempMonth[0] == "0" ? tempMonth[1] : tempMonth;
				var tempEndDate; 
				var tempBeginDate; 
				//控制日历字体显示颜色
				if(tempMonth == (bMonth + 1))
				{
						var day = getDays(curBeginDate);
						var newEndDate = tYear+"-"+(bMonth+1)+"-"+day;
						tempEndDate = new Date(newEndDate);  
						tempBeginDate = curBeginDate;
						tempEndDate = curEndDate;
						
				}else{ //下个月
						var newBeDate = tYear+"-"+(eMonth+1)+"-"+"01";
						tempBeginDate = new Date(newBeDate);  
						tempEndDate = curEndDate;
				}	
				$("#calend_info td").each(function() {
					var tdThis = this;
					var dateValue = $(tdThis).attr('data-date');
					if(dateValue != null && dateValue != undefined){
							var time = new Date(dateValue);
							if(time.getTime() >= tempBeginDate.getTime() && time.getTime() <= tempEndDate.getTime()){
								$(this).children().each(function(){  
									var grandchild=$(this).children();
									if($(grandchild).hasClass("fc-day-number")){
										$(grandchild).css("opacity",0.7);
									}
								});
								if(time.getTime() == event.start.getTime()){
									title = getColorTitle(tdThis,event.title,true);
								}
							}else{
								var grandchild=$(this).children();
								if($(this).find("div[class='fc-day-number']")){
									$(grandchild).css("opacity",0.3);
								}
							}
						}
					});
				var divHtml = '<div style="color:#666;">' + title + '</div>';
				element.html(divHtml);
			},
			eventClick : function(event, e) {

			}, 
			dayClick : function(date, allDay, jsEvent, view) {
				var tDay = formatDate(date);
				var selectDate=new Date(tDay);
				if(selectDate.getTime() < curBeginDate.getTime() || selectDate.getTime() > curEndDate.getTime()){
					return false;
				}  
				$("#calendar_info").empty();
				$("#calendar_info").next().remove();
				self.showBillDetailAction(personName,tDay,personId,adminOrgId);
				$('#backToCalendar').show();
			} 
		}); 
	},
	// 一天的明细
	showBillDetailAction:function(personName,tDay,personId,adminOrgId){
		var self=this;
		$('#calendar_info').empty();
		isReload = false ;
		$('#calendar_info').dialog({
					title : personName + " " + tDay+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_0,
					width : 650,
					height : 700,
					maxWidth : 1200,
					modal : true,
					resizable : true,
					position : {
						my : 'center',
						at : 'center',
						of : window
					},
					close: function(event, ui)
					{ 
					   $('#calendar_info').empty();
					   
					   if(isReload){
					   	jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
					   //jQuery('#reportGrid').jqGrid("reloadGrid"); 
					   	}
					} //这是关闭事件的回调函数,在这写你的逻辑
 			});
			var row_fields_work = ''
				+'<div id="title" name='+adminOrgId+'>' 
				+'<span id="personName" name='+personName+'></span>'
				+'<span><a name='+personId+' id="leaveDetail"></span>' 
				+'<span><a name='+tDay+' id="billInfo"></a></span>'
				+'</div>' 
				+'<div id="Main_info" style="width:100%"><div>';
			$('#calendar_info').append(row_fields_work);    
			$('#calendar_info').css("width", "100%");
			self.remoteCall({  
						type : "post",
						async:false,
						method : "getOneDayAttendDetail",
						param : {
							personId : personId,
							adminOrgId :adminOrgId,
							tDay : tDay 
						},
						success : function(res){
						
					 	var row_fields_work = ''
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="auditProject" value='+ i + '>'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_164
							+ '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="notAuditProject" value='+ i + '>'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_67
							+ '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="saveProject" >'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_20
							+ '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="cancelProject" >'
                            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_156
                            + '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="calculateOneDay" >'
                            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_102
                            + '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="backToCalendar">'
							+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_70
							+ ' </button></span>'
						+ '<hr style="margin:5px;">'
				    	$('#calendar_info').append(row_fields_work);	
						 if(res.flag =="0")
						 {
					    	// ===== ==== 状态
					    	$('#calendar_info').append('<div id="status">'
								+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_55
								+res.attendStatus+'</div>');
					    	
					    	// ===== ==== 应出勤时数  实际出勤时数
					    	var planReal = res.fixedPlanRealList ;
					    	
					    	self.getFixedPlanRealList(planReal,1);
					    	var shifList= '<div class="smallTitle">' 
					    		+ '<div>'
								+ '<span class="spanRight"><a ref="#" id="punchCardInfo">'
								+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_44
								+ '</a>'
								+ '<div id="punchCardInfoShow" style="position:relative;"></div>' 
								+ '</span>' 
								+ '<span class="spanLeft"></span>'
								+ '</div>'
								+ '</div>'
							var shifList1= '<div class="smallTitle">' 
								+ '<span class="spanRight">'
								+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_127
                                + '</span><span class="spanLeft"></span>'
								+ '</div>'	
					    	var punchRecordLen = res.puncnCardRecord.length;
					    	if(punchRecordLen >0 )
					    	{
					    		$('#calendar_info').append(shifList);
					    		 self.creatShowBillInfoDiv(res.puncnCardRecord,"punchCardInfo");
					    	}else{ 
					    		$('#calendar_info').append(shifList1);
					    	}
      						
					    	// ======= 矿工情况
					    	var fiexdAbsentList1 =  res.fiexdAbsentList1 ;
					    	var fiexdAbsentList2 =  res.fiexdAbsentList2 ;
					    	var fiexdAbsentList3 =  res.fiexdAbsentList3 ;
					    	var fiexdAbsentList4 =  res.fiexdAbsentList4 ;
					    	var absentAttend =  res.absentAttend ;
							self.getFixedAttendPlanList1(fiexdAbsentList3,0);  //实际出勤
						    self.getFixedAttendPlanList1(fiexdAbsentList4,0);  // 计划出勤
					    	if (absentAttend !=undefined || absentAttend !=null)
					    	{
					    		self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_125,0,"");
					    		if (fiexdAbsentList1.length + fiexdAbsentList2.length + absentAttend.length == 0 ){ 
					    			 self.getFixedPlanRealList(fiexdAbsentList1,1);
					    		}else{
						    		self.getFixedPlanRealList(fiexdAbsentList1,0);
						    		self.getFixedAttendPlanList(fiexdAbsentList2,0);
						    		self.getFixedPlanRealList(absentAttend,0); // 自定义矿工情况
					    		}
					    	}
					    	
					    	// ======= 迟到情况 fiexdLateList 1 7 8 9
					    	var fiexdLateList1 =  res.fiexdLateList1 ;
							var fiexdLateList7 =  res.fiexdLateList7 ;
							var fiexdLateList8 =  res.fiexdLateList8 ;
							var fiexdLateList9 =  res.fiexdLateList9 ;
					    	var lateAttend =  res.lateAttend ;
					    	
					    	if (lateAttend !=undefined || lateAttend !=null)
					    	{
					    		self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_34,0,"");  // 设置标题
					    		if(fiexdLateList1.length + fiexdLateList7.length + fiexdLateList8.length + fiexdLateList8.length + lateAttend.length == 0 )
					    		{
					    				self.getFixedPlanRealList(fiexdLateList7,1);
					    		}else{
						    		self.getFixedPlanRealList(fiexdLateList1,0);
						    		self.getFixedAttendPlanList(fiexdLateList7,0);
						    		self.getFixedAttendPlanList(fiexdLateList8,0);
						    		self.getFixedAttendPlanList(fiexdLateList9,0);
						    		
						    		self.getFixedPlanRealList(lateAttend,0); // 自定义迟到情况
					    		}
					    	}
					    	
					    	// ======= 早退情况   fiexdEalryList1 10 11 12 
					    	var fiexdEalryList1   =  res.fiexdEalryList1 ;
					    	var fiexdEalryList10  =  res.fiexdEalryList10 ;
							var fiexdEalryList11  =  res.fiexdEalryList11 ;
							var fiexdEalryList12  =  res.fiexdEalryList12 ;
					    	var earlyAttend =  res.earlyAttend ;
					    	
					    	if (earlyAttend !=undefined || earlyAttend !=null)
					    	{
					    		self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_204,0,"");  // 设置标题
					    		if(fiexdEalryList1.length + fiexdEalryList10.length + fiexdEalryList11.length + fiexdEalryList12.length +earlyAttend.length == 0)
					    		{
					    			self.getFixedPlanRealList(fiexdEalryList1,1);
					    		}else{
						    		self.getFixedPlanRealList(fiexdEalryList1,0);
						    		self.getFixedAttendPlanList(fiexdEalryList10,0);
						    		self.getFixedAttendPlanList(fiexdEalryList11,0);
						    		self.getFixedAttendPlanList(fiexdEalryList12,0);
						    		
						    		self.getFixedPlanRealList(earlyAttend,0); // 自定义早退情况
					   		 	}
					    	}
					    	
					    	var holidayAttend =  res.holidayAttend ;
					    	if (holidayAttend !=undefined || holidayAttend !=null)
					    	{
					    			// ======= 请假信息  
					    		var leaveBillInfo = res.mapLeaveBillInfo ;
					    		var leaveBillLen =  leaveBillInfo.length ;
					    		self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_148,leaveBillLen,"leaveDetailInfo");
					    	    if(leaveBillLen > 0 ){ self.creatShowBillInfoDiv(leaveBillInfo,"leaveDetailInfo");}
						    	if(holidayAttend.length == 0)
						    	{
						    	  self.getFixedPlanRealList(holidayAttend,1);
						    	  }else{
							   	 self.getFixedPlanRealList(holidayAttend,0);
						    	}
					    	}
					    	
					    	
					    	// ======= 出差信息
					    	var timeAttend  =  res.timeAttend ;
					    	if(timeAttend !=undefined || timeAttend !=null)
					    	{
					    		var tripBillInfo = res.mapTripbill ;
					    		var tripBillLen =  tripBillInfo.length ;
						    	self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_38,tripBillLen,"tripDetailInfo");
						    	if(tripBillLen > 0 ){ self.creatShowBillInfoDiv(tripBillInfo,"tripDetailInfo");}
						    	
						    	if(timeAttend.length == 0)
						    	{
									self.getFixedPlanRealList(timeAttend,1);				    	
						    	}else{
							    	self.getFixedPlanRealList(timeAttend,0);
						    	}
					    	}
					    	
					    	// ======= 加班信息
					    	var overTimeAttend =  res.overTimeAttend ;
					    	if(overTimeAttend !=undefined || overTimeAttend !=null)
					    	{
					    		var OverTimeBillInfo = res.mapOverTime ;
					    		var OverTimeBillLen =  OverTimeBillInfo.length ;
						    	self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_96,OverTimeBillLen,"overTimeDetailInfo");
						    	if(OverTimeBillLen > 0 ){ self.creatShowBillInfoDiv(OverTimeBillInfo,"overTimeDetailInfo");}
						    	if(overTimeAttend.length == 0)
						    	{
						    		self.getFixedPlanRealList(overTimeAttend,1);
						    	}else{
							    	self.getFixedPlanRealList(overTimeAttend,0);
						    	}
					    	}
					    	
					    	// ==== 其他项目
					    	var hideAttend =  res.hideAttend ;
					    	if(hideAttend !=undefined || hideAttend !=null)
					    	{
					    		var punchCar_List='<div class="bigTitle"><span style="color:blue;">'
									+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_178
									+ '</span></div>'
								var len = res.hideAttend.length ;
								if(len > 0 )
								{
									punchCar_List += self.addShowAttend(0);
									$('#calendar_info').append(punchCar_List);	
									var attend_json = 
									{
										id: "type",
										readonly: "",
										value: "0",
										onChange: null,
										validate: "{required:true}",
										filter: ""
									};
									var attend=[];
									for(var j=0;j<len;j++)
									{
									  attend.push({'value':res.hideAttend[j].attendNo+"_"+res.hideAttend[j].realVal,'alias':res.hideAttend[j].attendName});
									  self.attendMap.push({ 'key':res.hideAttend[j].attendNo,'value':res.hideAttend[j].realVal});
									} 
									attend_json.data=attend;
									showAttendJson = attend_json;
									$('input[name=attendanceName]').shrSelect(attend_json);
									$('.overflow-select').css("max-height","150px").css("overflow-y","auto");
								}	
					    	}
					    	
							if($("#status").text().indexOf(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_90) != -1)
							{
								$('#notAuditProject').hide();
								$('#editProject').hide();
								$('#cancelProject').hide();
								$('#backToCalendar').hide();
							}else{
								$('#auditProject').hide();
								$('#calculateOneDay').hide();
								$('#saveProject').hide();
								$('#cancelProject').hide();
								$('#backToCalendar').hide()
							}
							if(isBackShow){
								$('#backToCalendar').show();
							}
							$("div[class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix']").css('border-bottom','0px');
							if("AtsShift" == res.shiftFromEntity){
								var spanRight1Match = $("span[class='spanRight1']");
								var index = 0;
								for(var i=0;i<spanRight1Match.length;i++){
									if(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_199 == $(spanRight1Match[i]).text()){
										index = i;
										break;
									}
								}
								$(spanRight1Match[index]).text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_133);
							}					
						}else if(res.flag == "1")
						 {
						 	var status = '<div id="status">'
								+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_54
								+ '</div>' ;
						 	
							$('#calendar_info').append(status);
							if(step ==1){
								$('#auditProject').hide();
								$('#notAuditProject').hide();
								$('#saveProject').hide();
								$('#cancelProject').hide();
								if(isBackShow){
									$('#backToCalendar').show();
								}else{
									$('#backToCalendar').hide();
								}
								$('#calculateOneDay').show();
								$("div[class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix']").css('border-bottom','0px');
							}else{
								$('#auditProject').hide();
								$('#notAuditProject').hide();
								$('#saveProject').hide();
								$('#cancelProject').hide();
								$('#backToCalendar').hide();
								$('#calculateOneDay').hide();
								$("div[class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix']").css('border-bottom','1px solid #ccc');
							};
						 }
						  self.editDetailAttendProject(personId, tDay,adminOrgId);
						  	//掩藏没有权限的按钮
						self.hideNotAccessButton();	
					}
			})			
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

	getCurPage : function() {
		// (1-4)/4
		var self = this, rowNum = self.rowNumPerPage;
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		var curPageNum = (parseInt(temp.substring(1, temp.indexOf('-'))) - 1)/ rowNum + 1;
		return curPageNum;
	},

	prePage : function() {

		jQuery('#reportGrid').jqGrid("setGridParam", { postData: { refresh1: 3,handler:""  } });
		$("#prev_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	},

	nextPage : function() {
		//refresh = false ;
		jQuery('#reportGrid').jqGrid("setGridParam", { postData: { refresh1: 3,handler:"" } });
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
			//已计算页签--明细显示点击查询时
			if(isCalShowDetail==true){
				currentViewPage.getJqgridData(9);
			}
			else{
				currentViewPage.getJqgridData(3);
			}	
			//jsBinder.uiObject.rowNumPerPage = reRows ;
			//jsBinder.uiObject.getJqgridData(3);
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
	
	exportToExcelAction : function (salaryStatus) {
		var self = this ;
		var url = self.exportCommonParam(salaryStatus);

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
	},
	
	exportCurrentAction : function(salaryStatus){
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
				var url = _self.exportCommonParam(salaryStatus);
				url = url+'&personIds='+encodeURIComponent(personIds.join(','));
				document.location.href = url;
			}else{
				shr.showWarning({
					message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_150
				});
			}
	},
	exportCommonParam : function(salaryStatus){
		
		var self = this ;
		$grid = $('#reportGrid');
		postData = $grid.jqGrid("getGridParam", "postData");
		var proposerId = $('input[name=proposer]').val();
		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var hrOrgUnitId = $('#hrOrgUnit_el').val();
		var serviceId = shr.getUrlRequestParam("serviceId");
//		url = shr.getContextPath() + shr.dynamicURL + "?method=exportToExcel";
		url =  this.dynamicPage_url + "?handler=com.kingdee.shr.ats.web.handler.AttendancePanelDoSalaryHandler&method=exportToExcel" + "&uipk="+ this.reportUipk;
		
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

		param.isAll = true; 
		url += "&" + $.param(param);
		
		url = url + '&salaryStatus=' + salaryStatus +'&beginDate=' + beginDate + '&hrOrgUnitId='+encodeURIComponent(hrOrgUnitId)+'&endDate=' + endDate +'&orgLongNum=' + orgLongNum + '&proposerId=' + encodeURIComponent(proposerId)
					+ '&attendPolicyId=' + encodeURIComponent(attendPolicyId)+ '&attendanceGroupID=' + encodeURIComponent(attendanceGroupID) + '&attendPeriodId=' + encodeURIComponent(attendPeriodId)+"&filterItems1="+encodeURIComponent(filterItems)+"&serviceId="+encodeURIComponent(serviceId);
	
		return url ;
	},
	//审核  如果在页面上没有选中行，则提示[是否要审核全部考勤结果]，是，则审核全部，否则退出
  	//如果有选中行，则只是审核选中行的记录
  	processAuditAction:function(){
  		var _self=this;
  		$('li[id^=Calculate],button[id^=Calculate]').click(function(){  //审核,反审核
  			if(this.id=="CalculateBack"){
  				step = 2;
  			}else{
  				step = 1;
  			}
  			if( $("#reportGridWaitCal").html()){//待计算
  				var contentLen = $("#reportGridWaitCal").jqGrid("getRowData").length ;
  				if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_49}); return ;};
  				var sid = $("#reportGridWaitCal").jqGrid("getSelectedRows");
  				var filter=[];
  				if(sid.length>0){
  					if(currentIsConfirm){
  						var mes= jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_73;
	  					shr.showConfirm(mes,
	  						function(){
			  					for ( var i in sid) {
			  						var item = sid[i];
			  						var data = $("#reportGridWaitCal").jqGrid("getRowData", item);
			  						if(data['FID']!=undefined ){
			  							filter.push({"FID":data['FID']});
			  						}
			  				  	}
			  				  	var postData = $.toJSON(filter) ;
			  					 openLoader(1);
			  				  	_self.remoteCall({
			  						type : "post",
			  						method : "auduitWaitCal",
			  						param : {
			  							postData:postData,
			  							currentIsConfirm:currentIsConfirm
			  						},
			  						success : function(res){
			  							closeLoader();
			  							if(res.flag=="1")
			  							{
			  								var mes= jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_165;
			  								 shr.showInfo({message : mes});
			  								 
			  								 jQuery('#reportGridWaitCal').trigger("reloadGrid");
			  								 //jQuery('#reportGrid').jqGrid("reloadGrid");
			  							}else{
			  								var mes= jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_166;
			  								 shr.showInfo({message : mes});
			  							}
			  						}
			  		 		})
	  					});
  					}else{
  						for ( var i in sid) {
			  				var item = sid[i];
			  				var data = $("#reportGridWaitCal").jqGrid("getRowData", item);
			  				if(data['FID']!=undefined ){
			  					filter.push({"FID":data['FID']});
			  				}
			  			 }
			  			var postData = $.toJSON(filter) ;
			  				openLoader(1);
			  			_self.remoteCall({
			  				type : "post",
			  				method : "auduitWaitCal",
			  				param : {
			  					postData:postData,
			  					currentIsConfirm:currentIsConfirm
			  				},
			  				success : function(res){
			  					closeLoader();
			  				if(res.flag=="1")
			  				{
			  						var mes= jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_165;
			  						 shr.showInfo({message : mes});
			  								 
			  						 jQuery('#reportGridWaitCal').trigger("reloadGrid");
			  								 //jQuery('#reportGrid').jqGrid("reloadGrid");
			  					}else{
			  						var mes= jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_166;
			  						 shr.showInfo({message : mes});
			  					}
			  				}
			  		 	});
  					}
  				}else{
  					if(currentIsConfirm){
  						var mes= jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_73;
  						shr.showConfirm(mes,
  						function(){
  							_self.auduitWaitCalAll();
  						});
  					}else{
  					  	_self.auduitWaitCalAll();
  					}
  				}	  
  				return;
  			}
  			
  			var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
  			var mess = (step==1 && this.id=="Calculate") ? jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_27
				: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_26;
  			var setVal = this.id=="Calculate"? 2 :1 ;
			if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_50+mess}); return ;};
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			var fids="";
			//已计算页签--明细模式显示--反审批/审批：没有选中明细记录时需要给出提示
			if(isCalShowDetail==true){
//				if(sid.length==0){
//					shr.showError({message: "请选中明细记录！ "});
//					return;
//				}
				//已计算页签--明细模式显示--反审批需要过滤待计算、已计算的明细
				if(this.id=="CalculateBack"){
					var fidArray=new Array();
					for ( var i in sid) {
						var item = sid[i];
						var data = $("#reportGrid").jqGrid("getRowData", item);
						var recordId=data["FID"] ;
						var attenceStatus=data["FAttenceStatus"];
						if(attenceStatus==jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_198){
							fidArray.push(recordId);
						}						
				  	}
//					if(fidArray.length==0){
//						shr.showError({message: "没有可以反审核的记录！ "});
//						return;
//					}
					for(var i=0;i<fidArray.length;i++){
						if(i==fidArray.length-1){
							fids+="'"+fidArray[i]+"'";
						}
						else{
							fids+="'"+fidArray[i]+"',";
						}	
					}
				}
			}
			var filter=[];			
			if(sid.length>0){
				if(fids==""){
					for ( var i in sid) {
						var item = sid[i];
						var data = $("#reportGrid").jqGrid("getRowData", item);
						if(data['personId']!=undefined ){
							filter.push({"personId":data['personId'],"adminOrgUnitId":data['adminOrgUnitId']});
						}
						var recordId=data["FID"] ;
						if(i==sid.length-1){
							fids+="'"+recordId+"'";
						}
						else{
							fids+="'"+recordId+"',";
						}		
				  	}
				}
			  	var postData = $.toJSON(filter) ;
			  	var beginDate = $('input[name=beginDate]').val(); 
				var endDate = $('input[name=endDate]').val();
				var hrOrgUnitId = $('#hrOrgUnit_el').val();
				 var method="";
				if(isCalShowDetail==false){
					fids="";
					method="auditAttendanceRecordSelectFromPage";
				}
				else{
					method="auditAttendanceRecordFromPage";
				}
				if(setVal==2){
					if(currentIsConfirm){
						var mes = jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_73;
						shr.showConfirm(mes,
							function(){
								openLoader(1);
							  	_self.remoteCall({
									type : "post",
									method : method,
									param : {
										hrOrgUnitId:hrOrgUnitId,
										beginDate : beginDate,
										endDate : endDate,
										postData:postData,
										step:step,
										fids:fids,
										setVal:setVal
									},
									success : function(res){
										closeLoader();
										if(res.flag="1")
										{
											var mes= (step==1 && setVal==2) ? jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_165
												: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_68;
											 shr.showInfo({message : mes});
											 
											 jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
											 //jQuery('#reportGrid').jqGrid("reloadGrid");
										}else{
											var mes= (step==1 && setVal==2) ? jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_166
												: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_69;
											 shr.showInfo({message : mes});
										}
									},
									error: function(){
										closeLoader();
									},
									complete:function(){
										closeLoader();
									}
					 		})					
				 		});
					}else{
						openLoader(1);
						_self.remoteCall({
							type : "post",
							method : method,
							param : {
								hrOrgUnitId:hrOrgUnitId,
								beginDate : beginDate,
								endDate : endDate,
								postData:postData,
								step:step,
								fids:fids,
								setVal:setVal
								},
							success : function(res){
								closeLoader();
								if(res.flag="1")
								{
									var mes= (step==1 && setVal==2) ? jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_165
										: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_68;
									shr.showInfo({message : mes});
											 
								    jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
											 //jQuery('#reportGrid').jqGrid("reloadGrid");
									}else{
										var mes= (step==1 && setVal==2) ? jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_166
											: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_69;
										 shr.showInfo({message : mes});
									}
								},
								error: function(){
									closeLoader();
								},
								complete:function(){
									closeLoader();
								}
					 	});		
					}
				}else{
						openLoader(1);
					  	_self.remoteCall({
							type : "post",
							method : method,
							param : {
								hrOrgUnitId:hrOrgUnitId,
								beginDate : beginDate,
								endDate : endDate,
								postData:postData,
								step:step,
								fids:fids,
								setVal:setVal
							},
							success : function(res){
								closeLoader();
								if(res.flag="1")
								{
									var mes= (step==1 && setVal==2) ? jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_165
										: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_68;
									 shr.showInfo({message : mes});
									 
									 jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
									 //jQuery('#reportGrid').jqGrid("reloadGrid");
								}else{
									var mes= (step==1 && setVal==2) ? jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_166
                                        : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_69;
									 shr.showInfo({message : mes});
								}
							},
							error: function(){
								closeLoader();
							},
							complete:function(){
								closeLoader();
							}
			 		})
				}
			}else{
				var mes= (step==1) ? jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_170
					: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_169;
				if(step==1&&currentIsConfirm){
					mes = jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_73;
				}
				shr.showConfirm(mes,
					function(){
						_self.auduitAttendanceResult();
				});
			}	  
		}),
		$('#tranSalary').click(function(){ //tranSalary   已审核页签--转薪资
	 				var beginDate=window.parent.atsMlUtile.getFieldOriginalValue("beginDate");
					var endDate=window.parent.atsMlUtile.getFieldOriginalValue("endDate");
					var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
					if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_53}); return ;};
					$("#calendar_info").empty();
					$("#calendar_info").next().remove();
					$("#calendar_info").dialog({
						title: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_216,
						width:650,
						height:350,
						modal: true,
						resizable: true,
						position: {
							my: 'center',
							at: 'top+50%',
							of: window
						} 
					,buttons:[{
							text: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_158,
							click: function() {
								_self.saveDataSalaryAction(1); 
							}, 
						},{
							text: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_82,
							click: function() {
								$(this).dialog( "close" );
							}
						}]
					});
					  var row_fields_work =''
						  +'<div class="photoState" style="margin-top:50px;margin-left:30px;"><table width="100%"><tr>'
						  +'<td width="30%" style="color: #999999;">'
						  + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_119
						  + '</td>'
						  +'<td width="50%"><div id="setSalaryPeriod"></div></td>'
						  +'<td></td>'
						  +'</tr></table></div><br>'
						  +'<div><span></span></div>';
					  $("#calendar_info").append(row_fields_work);
					  $("#calendar_info").css("margin","0px");
					  var selectPeriod=$('input[name=attendPeriod]').val();
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
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_190
						+ '</td>'
					  	  +'<td width="15.2%"></td>'
					      +'<td width="10%" ><input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></td>'
						  +'<td width="5.2%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_134
						+ '</td>'
						  +'<td width="8%" style="color: #999999;"><input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td width="5.2%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_203
						+ '</td>'
						  +'<td width="8%"><input type="text" name="time" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td width="5%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_39
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
		}),
		
		$('#salarySumResult').click(function(){ //tranSalary   已汇总页签--转薪资
			var beginDate=window.parent.atsMlUtile.getFieldOriginalValue("beginDate");
			var endDate=window.parent.atsMlUtile.getFieldOriginalValue("endDate");
			var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
			if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_48}); return ;};
			$("#calendar_info").empty();
			$("#calendar_info").next().remove();
			$("#calendar_info").dialog({
				title: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_216,
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
					text: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_158,
					click: function() {
						_self.salarySumResultAction(); 
					}
				},{
					text: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_82,
					click: function() {
						$(this).dialog( "close" );
					}
				}]
			});
			  var row_fields_work =''
				  +'<div class="photoState" style="margin-top:50px;margin-left:30px;"><table width="100%"><tr>'
				  +'<td width="30%" style="color: #999999;">'
				  + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_119
				  + '</td>'
				  +'<td width="50%"><div id="setSalaryPeriod"></div></td>'
				  +'<td></td>'
				  +'</tr></table></div><br>'
				  +'<div><span></span></div>';
			  $("#calendar_info").append(row_fields_work);
			  $("#calendar_info").css("margin","0px");
			  var selectPeriod=$('input[name=attendPeriod]').val();
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
				+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_190
				+ '</td>'
			  	  +'<td width="15.2%"></td>'
			      +'<td width="10%" ><input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></td>'
				  +'<td width="5.2%" style="color: #999999;text-align: center;">'
                + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_134
				+ '</td>'
				  +'<td width="8%" style="color: #999999;"><input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
				  +'<td width="5.2%" style="color: #999999;text-align: center;">'
				+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_203
				+ '</td>'
				  +'<td width="8%"><input type="text" name="time" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
				  +'<td width="5%" style="color: #999999;text-align: center;">'
				+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_39
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
		}),
		
		$('#sumResult').click(function(){ //tranSalary   汇总
				var beginDate=window.parent.atsMlUtile.getFieldOriginalValue("beginDate");
			var endDate=window.parent.atsMlUtile.getFieldOriginalValue("endDate");
			var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
			if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_52}); return ;};
			//删除一些无用的汇总数据
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelCalHandler&method=deleteOutDatedResSum"
			shr.ajax({
				type:"post",
				url:url,
				data:{
					attendPeriodId : attendPeriodId
				},
				success:function(res){}
			});
			_self.saveDataSalaryAction(2); 					
		}),
		$('#deleteSum').click(function(){
			var _self = this ;
		 	sid = $("#reportGrid").jqGrid("getSelectedRows");
			var ids = [];
			for ( var i in sid) {
				var item = sid[i];
				var data = $("#reportGrid").jqGrid("getRowData", item)["FID"];
				ids.push(data);
			}
			if(ids.length > 0){
				shr.showConfirm(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_135, function() {
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelCalHandler&method=deleteSum"
					shr.ajax({
						type:"post",
						url:url,
						data:{
							ids : ids.join(',')
						},
						success:function(res){
							shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_163});
							jQuery('#reportGrid').trigger("reloadGrid");
						}
					}); 
				});
			}else{
				shr.showWarning({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_151});
			}
		}),
	 //  ==========  allAttendCaculate  selectAttendCaculate ===  考勤计算   (已计算人员的考勤计算和未计算人员的考勤计算)
	 //	  选中状况下的已计算人员的考勤计算和未计算人员的考勤计算区别在于弹不弹出框，发送的都是人和开始结束时间，是否取卡
	 //				未计算人员的考勤计算不需要取卡,直接算     modify 2015/1/7  未计算人员需要取卡
	 //  未选中状况下的已计算人员的考勤计算和未计算人员的考勤计算区别后台执行的sql 语句不同，获取人的条件不同			
		$('li[id=allAttendCaculate],button[id=allAttendCaculate]').click(function(){
			
			if($("#grid").html()){
				_self.getBatchCalHandler(_self,_self.CalAllAction);
				return ;	
			} // 未计算人员点击全部计算，就不需要弹出对话框
			_self.showCalDialogAction("",0);
		}),
		$('li[id=selectAttendCaculate],button[id=selectAttendCaculate]').click(function(){
			var $grid = $("#reportGrid");
			var personIndex = '' ;
			if( $("#reportGrid").html() ){
				$grid = $("#reportGrid") ;
				//已计算页签--明细模式显示--计算选中行
				if(isCalShowDetail==true){
					personIndex='proposerId';
				}
				else{
					personIndex = 'personId' ;
				}		
			}else if( $("#grid").html()){
				$grid = $("#grid") ;
				personIndex = 'person.id';
			}else if( $("#reportGridWaitCal").html()){
				$grid = $("#reportGridWaitCal") ;
				personIndex = 'Fproposerid';
			}
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
					//var data = $grid.jqGrid("getRowData", item);
					if(data !=undefined ){
						if(pidArray.indexOf(data)==-1){
							if(personStr.length > 0)
							{
								personStr +=",";
							}
							personStr += data;	
							if(!$("#reportGridWaitCal").html() && isCalShowDetail==false){
								//非待计算页签才需要对person去除重复处理，待计算不能去重。
							    pidArray.push(data);
							}
						}
					}
					//已计算页签--明细模式显示--计算选中行,需要获取所选明细记录的日期
					if(isCalShowDetail==true){
						var date =  $grid.jqGrid("getCell", item,"FAttenceDate");
						if(date !=undefined ){
							if(attendDateStr.length > 0)
							{
								attendDateStr +=",";
							}
							attendDateStr += date;	
						}
					}
			  	}
			  	if(personStr == "" || personStr == "false"){
			  		shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_128});
			 		return ;
			  	}
			}else{
				shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_128});
			 	return ;
			}
			if( $("#grid").html()){ // 未计算人员点击计算选中行，就不需要弹出对话框
				_self.getBatchCalHandler(_self,_self.selectCalAction,[personStr,len]);
				return ;
			}
			//已计算页签--明细模式显示--计算选中行,需要获取所选明细记录的日期
			if(isCalShowDetail==true){
				var url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelCalHandler";
				openLoader(1);
				shr.remoteCall({
					type:"post",
					url:url,
					method:"calculatePersonOneDayForDetail",
					param : {
						attendDate : attendDateStr,
						personId: personStr,
						hrOrgUnitId:$("#hrOrgUnit_el").val()
					},
					success:function(res){
						closeLoader();
						if(res.flag == 1){
							shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_103});
						}else{
							shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_108});
						}
						jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
					},
					error:function(){
						closeLoader();
						shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_108});
					},
					complete:function(){
						closeLoader();
					}
				});
				return;
			}
			_self.showCalDialogAction(personStr,len);
		}),
		
		//查看后台事务
		$('#viewTransaction').click(function(){
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
			//ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix
			//$(".ui-dialog-titlebar").remove();
			//$("#dialogTransaction").parent().find('.ui-dialog-titlebar').remove(); // 只是删除 查看后台事务
			$("#dialogTransaction").css({height:750})
		})
  	},
  	
  	//流程单据查询
  	workFlowBillsCheckedEvent : function (){
  		var _self = this;
  		var billTabs = '<div id="billTabs" >'
			+ '	<ul>'
			+ '	<li><a id="leaveBill">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_145
			+ '</a></li> '
			+ '	<li><a id="tripBill">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_36
			+ '</a></li> '
			+ '	<li><a id="otBill">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_95
			+ '</a></li> '
			+ '	<li><a id="fillCardBill">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_25
			+ '</a></li> '
			+ '	<li><a id="cancelLeaveBill">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_146
			+ '</a></li> '
			+ '	<li><a id="canTripBill">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_37
			+ '</a></li> '
			+ '	</ul>'
			+ '</div>';

  		$('#workFlowBillsChecked').unbind().bind('click',function(){
  			$("#pageTabs").hide();
  			_self.getAtsCalGobalParam();
  			_self.saveQueryFilterParam();
  			
  			$("#breadcrumb").find("li.active").html(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_126);
  			$('<li><a href="#">'
				+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_102
				+ '</a> <span class="divider">/</span></li>').insertBefore($("#breadcrumb").find("li.active"));
  			$("#breadcrumb").find("li").eq(1).find('a').click(function(){
  				window.parent.parent.location = shr.getContextPath() + "/dynamic.do?uipk=hr.ats.com.attendancePanel&inFrame=true&serviceId="+encodeURIComponent(serviceId);
			}) ;

	  	 	var serviceId = shr.getUrlRequestParam("serviceId");			

	  	 	var parentBeginDate = $("input[name=beginDate]").val();
	  	 	var parentEndDate = $("input[name=endDate]").val();
	  	 	ats_beginDate = parentBeginDate;
	  	 	ats_endDate = parentEndDate ;
	  	 	
  			$("#searcher").remove();
  			openLoader(1);
	  	 	var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList$page','view',{beginDate:$("input[name=beginDate]").val(),endDate:$("input[name=endDate]").val()});	
			url += '&serviceId='+encodeURIComponent(serviceId);
	  	 	shr.loadHTML({ 
				url : url,
				async: false,
				success : function(response) {
					
					closeLoader();
					$('.view_manager_body').empty();
					$('.view_manager_body').append(billTabs);
					//$('.view_manager_body').append(response);
					$('.view_manager_body').append("<div id='responseBody'></div>");
					$('#responseBody').append(response);
					//$('.view_manager_body').append($("<div id='responseBody'></div>").append(response));
					
					_self.billTabsFormatter(0);
					_self.headOfPageRemove();
//					$("#searcher").closest(".view_manager_header").css("min-height","0px");
//					$("#searcher").closest(".view_manager_header").css("height","20px");
					//$("#searcher").closest(".view_manager_header > div").css("height","20px");				
//					$("#searcher").css("display","block");	
//					$("#searcher").css("margin-top","-107px");
//					$("#searcher").closest(".view_manager_header").css("border-bottom","0px");
//					$("#searcher").css("display","block");			
					$(".ui-pg-selbox").css("margin-top","-40px");
//					$("#gridPager").css("margin-top","-40px");
					$('.view_manager_header').find('.row-fluid').eq(1).remove();//调整样式
					
					$(".shr-toolbar").css("padding","5px 0px 0px 0px");
					$("#responseBody").find('.view_manager_header').css("min-height","0px");
					
					var beginDate;
					var endDate;
					if($("[data-categoryname='"+jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_147+"']").first().data().value == undefined){
						beginDate = parentBeginDate;
						endDate = parentEndDate;
					}else{
						beginDate = $("[data-categoryname='"+jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_147+"']")
							.first().data().value.split(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_1)[0];
		  	 			endDate = $("[data-categoryname='"+jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_147+"']")
							.first().data().value.split(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_1)[1];
					}
	  	 	
					$('#tripBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsTripBillAllList$page','view',{beginDate:beginDate,endDate:endDate});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(1);
								_self.headOfPageRemove();
//								$("#searcher").closest(".view_manager_header").css("min-height","0px");
//								$("#searcher").closest(".view_manager_header").css("height","0px");
								//$("#searcher").closest(".view_manager_header > div").css("height","0px");
//								$("#searcher").closest(".view_manager_header").css("border-bottom","0px");
//								$("#searcher").css("display","block");
//								$("#searcher").css("margin-top","-107px");
								$(".ui-pg-selbox").css("margin-top","-40px");
//								$("#gridPager").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
							}
						});
					});
					$('#leaveBill').unbind().bind('click',function(){	
//						alert(222)
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList$page','view',{beginDate:beginDate,endDate:endDate});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(0);
								_self.headOfPageRemove();
//								$("#searcher").closest(".view_manager_header").css("min-height","0px");
//								$("#searcher").closest(".view_manager_header").css("height","0px");
								//$("#searcher").closest(".view_manager_header > div").css("height","0px");
//								$("#searcher").closest(".view_manager_header").css("border-bottom","0px");
//								$("#searcher").css("display","block");
//								$("#searcher").css("margin-top","-107px");
								$(".ui-pg-selbox").css("margin-top","-40px");
//								$("#gridPager").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
							}
						});
						
					});
					$('#otBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllList$page','view',{beginDate:beginDate,endDate:endDate});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(2);
								_self.headOfPageRemove();
//								$("#searcher").closest(".view_manager_header").css("min-height","0px");
//								$("#searcher").closest(".view_manager_header").css("height","0px");
								//$("#searcher").closest(".view_manager_header > div").css("height","0px");
//								$("#searcher").closest(".view_manager_header").css("border-bottom","0px");
//								$("#searcher").css("display","block");
//								$("#searcher").css("margin-top","-107px");
								$(".ui-pg-selbox").css("margin-top","-40px");
//								$("#gridPager").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
							}  
						});
					});
					$('#fillCardBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.FillSignCardAllList$page','view',{beginDate:beginDate,endDate:endDate});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(3);
								_self.headOfPageRemove();
//								$("#searcher").closest(".view_manager_header").css("min-height","0px");
//								$("#searcher").closest(".view_manager_header").css("height","0px");
								//$("#searcher").closest(".view_manager_header > div").css("height","0px");
//								$("#searcher").closest(".view_manager_header").css("border-bottom","0px");
//								$("#searcher").css("display","block");
//								$("#searcher").css("margin-top","-107px");
								$(".ui-pg-selbox").css("margin-top","-40px");
//								$("#gridPager").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
							}
						});
					});
					$('#cancelLeaveBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.CancelLeaveBillAllList$page','view',{beginDate:beginDate,endDate:endDate});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(4);
								_self.headOfPageRemove();
//								$("#searcher").closest(".view_manager_header").css("min-height","0px");
//								$("#searcher").closest(".view_manager_header").css("height","0px");
								//$("#searcher").closest(".view_manager_header > div").css("height","0px");
//								$("#searcher").closest(".view_manager_header").css("border-bottom","0px");
//								$("#searcher").css("display","block");
//								$("#searcher").css("margin-top","-107px");
								$(".ui-pg-selbox").css("margin-top","-40px");
//								$("#gridPager").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
							}
						});
					});
					
					$('#canTripBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.CanTripBillAllList$page','view',{beginDate:$("input[name=beginDate]").val(),endDate:$("input[name=endDate]").val()});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(5);
								_self.headOfPageRemove();
//								$("#searcher").closest(".view_manager_header").css("min-height","0px");
//								$("#searcher").closest(".view_manager_header").css("height","0px");
								//$("#searcher").closest(".view_manager_header > div").css("height","0px");
//								$("#searcher").closest(".view_manager_header").css("border-bottom","0px");
//								$("#searcher").css("display","block");
//								$("#searcher").css("margin-top","-107px");
								$(".ui-pg-selbox").css("margin-top","-40px");
//								$("#gridPager").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
							}
						});
					});
				}
			});
		});
  	},
  	
  	
  	//当切换不同的标签页时，对TAB标签进行格式化
  	billTabsFormatter : function (index){
  		$("#billTabs").tabs();
  		$("#billTabs").find('ul li:eq('+ index +')').removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active");
		$("#billTabs").find('ul li:not(:eq('+ index +'))').removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#billTabs").find('ul li a').css('border','0px');
		$("#billTabs").find('ul li a:eq('+ index +')').removeClass("colNameType").addClass("fontGray");
		$("#billTabs").find('ul li a:not(:eq('+ index +'))').removeClass("fontGray").addClass("colNameType");
  	},
	
  	//重载页面将LIST上方的面包屑和按钮都移除
  	headOfPageRemove : function (){
//  	$("#breadcrumb").remove();
  	var html="";
  	html+='<span class=" shr-toolbar">';		
  	html+='<div id="" class="btn-group ">';
  	html+='<button class="btn-wide shrbtn dropdown-toggle" data-toggle="dropdown" type="button">'
		+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_58;
  	html+='<span class="caret"></span>';
  	html+='</button>';
  	html+='<ul class="dropdown-menu pull-">';
  	html+='<li id="exportCurrentuuid18" name="exportCurrent" type="" uipk=""><a href="javascript:;">'
		+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_61
		+ '</a></li>';
  	html+='<li id="exportToExceluuid18" name="exportToExcel" type="" uipk=""><a href="javascript:;">'
		+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_59
		+ '</a></li>';
  	html+='</ul>';
  	html+='</div>';
  	html+='</span>';
  	//$(".span9.offset0").html(html);
  	$(".shr-toolbar").parent().html(html)
  	$("li[name='exportCurrent']").shrButton({
			actionBinding: 'exportCurrentAction',
			subAction: '',
			customData: ''
		});		
  	$("li[name='exportToExcel']").shrButton({
			actionBinding: 'exportToExcelAction',
			subAction: '',
			customData: ''
		});	
  	$(".shr-toolbar").css("padding-left","0");
  	},
//  	
  	//检测计算的开始时间和结束时间是不是在周期范围之内
  	valiCalculateDateRange:function(){
  		var realBeginDate= new Date(atsMlUtile.getFieldOriginalValue("realBeginDate"));
		var realEndDate = new Date(atsMlUtile.getFieldOriginalValue("realEndDate"));
		var beginDate = new Date($('input[name=beginDate]').val());
		var endDate   = new Date($('input[name=endDate]').val());
		if(realBeginDate.getTime()>realEndDate.getTime()){
			shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_105});
  			return false ;
		}

  		if(beginDate.getTime()<=realBeginDate.getTime() && endDate.getTime()>=realEndDate.getTime()){ // 检测计算的开始时间和结束时间是不是在周期范围之内
			return true ;
  		}else{
  			shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_106});
  			return false ;
  		}
  	},	 		
  	showCalDialogAction : function(personStr,len){
  			var _self = this;
			$("#calendar_info").empty();
			$("#calendar_info").next().remove(); // button
			$("#calendar_info").dialog({
					title: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_208,
					width:513,
					height:290,
					modal: true,
					resizable: false,
					position: {
						my: 'center',
						at: 'top+50%',
						of: window
					} 
				,buttons:[{
					text: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_158,
					click: function() {
						// 检测计算的开始时间和结束时间是不是在周期范围之内
						if(_self.valiCalculateDateRange())
						if(len > 0){
							if( $("#reportGrid").html()){
								_self.getBatchCalHandler(_self,_self.selectCalAction,[personStr,len]);
							}else if( $("#reportGridWaitCal").html()){
								_self.selectedWaitCalAction(personStr,len);
							}
						}else{
							_self.getBatchCalHandler(_self,_self.CalAllAction);
						} 
					}
				},{
					text: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_82,
					click: function(){
					  $(this).dialog("close");
					  $("#calendar_info").empty();
					}
				}]
				,close : function() {
					$("#calendar_info").empty();
				}	
			});
			
			var addWorkString ='<div style=" margin: 35px; ">'
				+'<div>'
				+'<input type="checkbox" id="isAgainFetchCard" name="isAgainFetchCard" value="1" dataextenal="" style=" float: left; ; margin-left: 68px; ">'
				+'</div>'
				+'<div class="field_label" style=" margin-left: 60px; padding-left: 30px; text-align: left;">'
				+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_171
				+ '</div>'
				+'<div id="allCalculateDatePicker" style=" margin-top: 19px;">'
				+'<div style=" float:left;" class="field_label">'
				+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_98
				+ '</div><div  style=" float:left; margin-right: 15px;"><input id="realBeginDate" type="text" class="block-father input-height"/></div>'
				+'<div style=" float:left;" class="field_label">'
				+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_97
				+ '</div><div  style=" float:left; margin-right: 15px;"><input id="realEndDate" type="text" class="block-father input-height"/></div>'
				+'</div>'
				+'</div>' ;
				
				//$("#realBeginDate"). 
			$("#calendar_info").append(addWorkString);
			if($("#reportGridWaitCal").html()){
				$("#realBeginDate").shrDateTimePicker({readonly : true,ctrlType: "Date",isAutoTimeZoneTrans:false});
				$("#realEndDate").shrDateTimePicker({readonly : true,ctrlType: "Date",isAutoTimeZoneTrans:false});
			}else{
				$("#realBeginDate").shrDateTimePicker({ctrlType: "Date",isAutoTimeZoneTrans:false});
				$("#realEndDate").shrDateTimePicker({ctrlType: "Date",isAutoTimeZoneTrans:false});
			}
			atsMlUtile.setTransDateTimeValue("realBeginDate",$('input[name=beginDate]').val());
			atsMlUtile.setTransDateTimeValue("realEndDate",$('input[name=endDate]').val());
			$("#allCalculateDatePicker").find(".ui-datepicker-frame").css("width","130px").css("background-color","#d9edf7 !important");
			$(window).resize();
  	},
  	
  	//待计算计算选中行
  	selectedWaitCalAction:function(personStr,len){
		var _self=this;
		var sid = $("#reportGridWaitCal").jqGrid("getSelectedRows");
		var cardLen = $('input[name="isAgainFetchCard"]:checked').length ;
		var hrOrgUnitId = $('#hrOrgUnit_el').val();
		
		var len = sid.length ;
		var filter=[];
		var attendDateStr = "";
		if(len > 0){
			for ( var i in sid) {
				var item = sid[i];
				var data = $("#reportGridWaitCal").jqGrid("getCell", item,"FAttenceDate");
				if(data !=undefined ){
					if(attendDateStr.length > 0)
					{
						attendDateStr +=",";
					}
					attendDateStr += data;	
				}
				//filter.push({"personId":data['personId'],"adminOrgUnitId":data['adminOrgUnitId']});
		  	}
		}
		 openLoader(1);
	  	_self.remoteCall({
			type : "post",
			method : "selectedWaitCal",
			param : {
				hrOrgUnitId:hrOrgUnitId,
		  		personIds: personStr,
				isAgainFetchCard : cardLen,
				attendDates : attendDateStr
			},
			success : function(res){
				closeLoader();
				if($("#reportGridWaitCal").html()){
					window.parent.$("#calendar_info").dialog('close');
				}
				if(res.flag=="1")
				{
					var mes= jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_91;
					shr.showInfo({message : mes});
					 
					jQuery('#reportGridWaitCal').trigger("reloadGrid");
					//jQuery('#reportGrid').jqGrid("reloadGrid");
				}else{
					var mes= jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_92;
					 shr.showInfo({message : mes});
				}
			}
	  	})
		
	},
  	selectCalAction:function(personStr,len){ // 计算选中行
		var self=this;
		// calculateSelectOsfAttendanceBoard  calculateSelectAttendanceBoard
		var beginDate = $('input[name=beginDate]').val();
		var endDate   = $('input[name=endDate]').val();
		var hrOrgUnitId = $('#hrOrgUnit_el').val();
		if($("#realBeginDate").val()!=undefined && $("#realEndDate").val()!=undefined){//@
			beginDate = atsMlUtile.getFieldOriginalValue("realBeginDate");
			endDate = atsMlUtile.getFieldOriginalValue("realEndDate");
		}
		
		var url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryCalculateHelper&uipk=hr.ats.com.attendancePanelCalculate$fragment";
		var cardLen = $('input[name="isAgainFetchCard"]:checked').length ;
		//if($("#reportGrid").html()){ window.parent.$("#calendar_info").dialog('close'); }
		if ($("#grid").html()){ cardLen = 1 ;}
		if(len > 10 ){
		  // url +="&method="; 
		   openLoader(1);
		   shr.remoteCall({
					type:"post",
					url:url,
					method:"calculateSelectOsfAttendanceBoard",
					param : {
						hrOrgUnitId:hrOrgUnitId,
						beginDate : beginDate,
						endDate : endDate,
						personId: personStr,
						isAgainFetchCard : cardLen,
						len : len 
					},
					success:function(res){
						closeLoader();
						if($("#reportGrid").html()){
							window.parent.$("#calendar_info").dialog('close');
						}
						if(res.flag == 1){
							shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_196}); 
						}else if(res.flag == 2){
							shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_47});
						}else{
							shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_108});
						}
					},
					error:function(){
						closeLoader();
						shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_108});
					},
					complete:function(){
						closeLoader();
					}
			});
		}else{ 
		   //url +="&method=calculateSelectAttendanceBoard";
		   openLoader(1);  
		   shr.remoteCall({
					type:"post",
					url:url,  
					method:"calculateSelectAttendanceBoard",
					param : {
						hrOrgUnitId:hrOrgUnitId,
						beginDate : beginDate, 
						endDate : endDate,
						personId: personStr,
						isAgainFetchCard : cardLen,
						len : len 
					},
					success:function(res){
							closeLoader();
							if($("#reportGrid").html()){
									window.parent.$("#calendar_info").dialog('close');
							}
							shr.showInfo({message : res.flag});
							if($("#grid").html() )
							{
								self.attendPersonList();
							}else{
								jQuery('#reportGrid').jqGrid("reloadGrid");
								window.parent.$("#calendar_info").dialog('close');
							}
						},
					error : function(){
							closeLoader();
							shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_107});
					},
					complete:function(){
						closeLoader();
					}	
					});
		}
	},
	CalAllAction:function(){  // 重新重算
		var self = this;
		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var hrOrgUnitId = $('#hrOrgUnit_el').val();
		
		if($("#realBeginDate").val()!=undefined && $("#realEndDate").val()!=undefined){//@
			beginDate = atsMlUtile.getFieldOriginalValue("realBeginDate");
			endDate = atsMlUtile.getFieldOriginalValue("realEndDate");
		}
		
		var proposerId = $('input[name=proposer]').val();  //姓名
		var cardLen = $('input[name="isAgainFetchCard"]:checked').length ;
		// action = 1 ====> 未计算人员的考勤计算       action = 0 ====> 已计算人员的考勤计算
		var action = 0;
		if ($("#grid").html()){ action = 1; cardLen = 1 ;}
		//if($("#reportGrid").html()){ window.parent.$("#calendar_info").dialog('close'); }
		var url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryCalculateHelper";
		    url +="&uipk=hr.ats.com.attendancePanelCalculate$fragment" ;
	    if($("#reportGridWaitCal").html()){//待计算全部计算
			url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryCalculateHelper&method=waitCalAllAttendanceBoard";
		}
		openLoader(1);
		 shr.remoteCall({
			type : "post",
			url  : url,
			method : "calculateAllAttendanceBoard",
			param : {
				hrOrgUnitId:hrOrgUnitId,
				beginDate : beginDate,
				endDate : endDate,
				personId: proposerId,
				isAgainFetchCard : cardLen,
				attendPeriodId : attendPeriodId,
				attendPolicyId : attendPolicyId,
				attendanceGroupID:attendanceGroupID,
				orgLongNum  : orgLongNum ,
				action :action 
			},
			success : function(res){
				closeLoader();
				if($("#reportGrid").html()||$("#reportGridWaitCal").html()){
					window.parent.$("#calendar_info").dialog('close');
				}
				if(res.flag == 1){
					shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_104}); 
				}else if(res.flag == 2){
					shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_47});
				}else{
					shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_108});
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
	
	auduitWaitCalAll:function(){ // 待计算全部审核  
		var hrOrgUnitId = $('#hrOrgUnit_el').val();
  		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var proposerId = $('input[name=proposer]').val();
		var self=this; 
		 openLoader(1);
		 self.remoteCall({
				type : "post",
				method : "auduitWaitCalAll",
				param : {
					hrOrgUnitId:hrOrgUnitId,
					beginDate : beginDate,
					endDate : endDate,
					proposerId:proposerId,
					orgLongNum:orgLongNum,    
					attendPolicyId:attendPolicyId,  //考勤制度
					attendanceGroupID:attendanceGroupID,
					currentIsConfirm:currentIsConfirm
				},
				success : function(res){
					closeLoader();
					if(res.flag=="1")
					{
						var mes=jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_165;
						 shr.showInfo({message : mes});
						 jQuery('#reportGridWaitCal').trigger("reloadGrid");
						 //jQuery('#reportGrid').jqGrid("reloadGrid"); 
					}else{ 
						var mes=jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_166;
						shr.showInfo({message : mes});
					}
				}
	 		})	
  	
  	},
  	
  	auduitAttendanceResult:function(){ // 审核  和反审核 根据step 区分
  		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var proposerId = $('input[name=proposer]').val();
		var hrOrgUnitId = $('#hrOrgUnit_el').val();
		var isDetail = 1;
		if(isCalShowDetail == false){
			isDetail = 2;
		}
		var self=this; 
		 openLoader(1);
		 self.remoteCall({
				type : "post",
				method : "auditAttendanceRecordFromPage",
				param : {
					hrOrgUnitId:hrOrgUnitId,
					beginDate : beginDate,
					endDate : endDate,
					proposerId:proposerId,
					orgLongNum:orgLongNum,    
					attendPolicyId:attendPolicyId,  //考勤制度
					attendanceGroupID:attendanceGroupID,
					attendPeriodId:attendPeriodId,	//考勤周期
					step:step,
					isDetail:isDetail//是否为明细模式
				},
				success : function(res){
					closeLoader();
					if(res.flag=="1")
					{
						var mes= (step==1) ? jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_165
							: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_68;
						 shr.showInfo({message : mes});
						 jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
						 //jQuery('#reportGrid').jqGrid("reloadGrid"); 
					}else{ 
						var mes= (step==1) ? jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_166
                            : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_69;
						shr.showInfo({message : mes});
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
  	saveDataSalaryAction:function(salaryStatus){
  		var that = this;
  		var hrOrgUnitId = $('#hrOrgUnit_el').val();
  		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var attendancePeriod = $('#setSalaryPeriod').text();
		if(attendancePeriod == ""){
			if($('input[name=attendPeriod]').val()!=null){
				attendancePeriod=$('input[name=attendPeriod]').val();
			}
			else{
				shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_120});
				return false;	
			}		
		}
		var  salaryPeriod='';
		if(salaryStatus==1){
			var periodYear = $('input[name=YEAR]').val();
			var periodMonth = $('input[name=MONTH]').val();
			var times = $('input[name=time]').val();
			var proposerId = $('input[name=proposer]').val();
			if (periodYear == "") {
				shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_188});
				return false;
			}
			if (periodMonth == "") {
				shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_189});
				return false;
			}
			if (times == "") {
				shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_40});
				return false;
			}
			salaryPeriod=periodYear+"-"+periodMonth+"-"+times;
		}		
		var sid=[];
		var Exchange_json=[];
		sid = $("#reportGrid").jqGrid("getSelectedRows");
		for ( var i in sid)
		{
		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
			var item = sid[i];
			var data = $("#reportGrid").jqGrid("getRowData", item);
			var personId=data["personId"] ;
			if(personId !=undefined){
				var adminOrgUnit=data["adminOrgUnitId"] ;
				Exchange_json.push({'personId':personId,'adminOrgUnit':adminOrgUnit});
			}
		}	
		if(Exchange_json.length>0)
		{
			var PersonJson = $.toJSON(Exchange_json) ;
		}else{
			var PersonJson = "All";
		}
		 openLoader(1);
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelDoSalaryHandler";
		 url +="&uipk=hr.ats.com.attendancePanelCalculate$fragment";
		 var methodName=null;
		 if(salaryStatus==1){
			 methodName="save";
		 }
		 else{
			 methodName="saveSumResult";
		 }
		 shr.remoteCall({
				type:"post", 
				url:url, 
				method:methodName,
				param : {
							hrOrgUnitId:hrOrgUnitId,
							PersonJson : PersonJson,
							beginDate : beginDate,
							endDate : endDate,
							salaryStatus:salaryStatus,
							salaryPeriod:salaryPeriod,      //薪资周期
							orgLongNum:orgLongNum,
							attendPolicyId:attendPolicyId,  //考勤制度
							attendPeriodId:attendPeriodId,	//考勤周期
							attendanceGroupID:attendanceGroupID,
							proposerId:proposerId  ,
							step:step
						},
				success:function(res){
					closeLoader();
					if(salaryStatus==1){
						$("#calendar_info").dialog("close");
					}
					if (res.flag == 1){
						var tip ="";
						var sum = 0;	
						if(res.List!= null)
						{
							var len = res.List.length ;
							sum += len;
							if(len > 0){
								if(salaryStatus==1){
									tip = shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_33,[len]) + "<br>";
								}else{
									tip =jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_84;
								}
							}
						}
					
						if(res.LockList!= null)
						{
							var len = res.LockList.length ;
							sum += len;
							if(len > 0){
							    tip += shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_167, [len]);
								for(var i = 0; i <= len-1 ; i++)
								{
									tip += res.LockList[i]+", ";
								}
								tip = tip.substring(0,tip.length-2)+"<br>";
							}
							
						}
						tip = shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_80,[sum]) + "<br>" + tip;
						var options={
						   message:tip
						};
						$.extend(options, {
							type: 'info',
							hideAfter: null,
							showCloseButton: true
						});
						if(tip==jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_84){
							shr.showInfo({message : tip});
						}else{
							shr.msgHideAll();
							top.Messenger().post(options);							
						}
						window.parent.atsMlUtile.setTransDateTimeValue("beginDate",beginDate);
						window.parent.atsMlUtile.setTransDateTimeValue("endDate",endDate);
						window.parent.$("#reportGrid").jqGrid('setGridParam', {
					    datatype : 'json',
					    postData : {
						'beginDate' : beginDate,
						'endDate' : endDate,
						'adminOrgId1' :  window.parent.$("#AdminOrgUnit_el").val(),  
						'proposerId1' : window.parent.$("#proposer_id").val(),
						'NewRearch'   : 'newRearch'  ,
						'page' : 1 ,
						'refresh1': 2
					     },
					     page : 0
				          })
					}else{
						if(salaryStatus==1){
							shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_217});
						}
						else{
							shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_86});
						}				
						window.parent.$("#reportGrid").jqGrid('setGridParam', {
					    datatype : 'json',
					    postData : {
						'beginDate1' : window.parent.atsMlUtile.getFieldOriginalValue("beginDate"),
						'endDate1' : window.parent.atsMlUtile.getFieldOriginalValue("endDate"),
						'adminOrgId1' : window.parent.$("#AdminOrgUnit_el").val(),  
						'proposerId1' : window.parent.$("#proposer_id").val(),
						'NewRearch'   : 'newRearch'  ,
						'page' : 1 ,
						'refresh1': 2 
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
		 });	
  	},
  	
  	//已汇总页签--转薪资
  	salarySumResultAction:function(){
  		var that = this;
  		var hrOrgUnitId = $('#hrOrgUnit_el').val();
  		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var attendancePeriod = $('#setSalaryPeriod').text();
		if(attendancePeriod == ""){
			if($('input[name=attendPeriod]').val()!=null){
				attendancePeriod=$('input[name=attendPeriod]').val();
			}
			else{
				shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_120});
				return false;	
			}		
		}
		var  salaryPeriod='';
		var periodYear = $('input[name=YEAR]').val();
		var periodMonth = $('input[name=MONTH]').val();
		var times = $('input[name=time]').val();
		var proposerId = $('input[name=proposer]').val();
		if (periodYear == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_188});
			return false;
		}
		if (periodMonth == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_189});
			return false;
		}
		if (times == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_40});
			return false;
		}
		salaryPeriod=periodYear+"-"+periodMonth+"-"+times;
		var sid=[];
		var Exchange_json=[];
		sid = $("#reportGrid").jqGrid("getSelectedRows");
		var fids='';
		for (var i=0;i<sid.length;i++)
		{
			var item = sid[i];
			var data = $("#reportGrid").jqGrid("getRowData", item);
			var recordId=data["FID"] ;
			if(i==sid.length-1){
				fids+="'"+recordId+"'";
			}
			else{
				fids+="'"+recordId+"',";
			}				
		}
		if(fids.length==0)
		{
			var PersonJson = "All";
		}
		 openLoader(1);
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelDoSalaryHandler";
		 url +="&uipk=hr.ats.com.attendancePanelCalculate$fragment";
		 shr.remoteCall({
				type:"post", 
				url:url, 
				method:"salarySumResult",
				param : {
							hrOrgUnitId:hrOrgUnitId,
							fids : fids,
							PersonJson:PersonJson,
							beginDate : beginDate,
							salaryStatus:2,
							endDate : endDate,
							salaryPeriod:salaryPeriod,      //薪资周期
							orgLongNum:orgLongNum,
							attendPolicyId:attendPolicyId,  //考勤制度
							attendPeriodId:attendPeriodId,	//考勤周期
							attendanceGroupID:attendanceGroupID,
							proposerId:proposerId  ,
							step:step
						},
				success:function(res){
					closeLoader();
					$("#calendar_info").dialog("close");
					if (res.flag == 1){
						var tip ="";	
						var sum = 0;
						if(res.List!= null)
						{
							var len = res.List.length ;
							sum += len;
							if(len > 0){
								tip = shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_33, [len]) + "<br>";
							}
						}
						if(res.LockMessage!= null)
						{
							var len = res.LockMessage.length ;
							sum += len;
							if(len > 0){
							     tip += shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_167, [len]) + "<br>";
								for(var i = 0; i <= len-1 ; i++)
								{
									tip += (i+1)+"."+res.LockMessage[i]+"<br> ";
								}
								tip = tip.substring(0,tip.length-2)+"<br>";
							}
							
						}
						tip = shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_81,[sum]) + "<br>" + tip;
						var options={
						   message:tip
						};
						$.extend(options, {
							type: 'info',
							hideAfter: null,
							showCloseButton: true
						});
						shr.msgHideAll();
						top.Messenger().post(options);
						window.parent.atsMlUtile.setTransDateTimeValue("beginDate",beginDate);
						window.parent.atsMlUtile.setTransDateTimeValue("endDate",endDate);
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
								//'filterItems' : filterItems ,
								'NewRearch'  : 'newRearch'  ,
								'page' : 1
						     }, 
				     		page : 0 
			          })
					}else{
						shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_217});
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
								//'filterItems' : filterItems ,
								'NewRearch'  : 'newRearch'  ,
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
		 });	
  	},
  	 getFixedPlanRealList :function(planReal,index){
  	 	
    	var len = planReal.length ;
    	// smalTitlePattern bigTitlePattern
		var punchCarStr=[];
		if (len > 0) {
			for (var i = 0; i < len; i++) {
				var className = "smallTitle";
				if(i % 3 == 0) { className = "smallTitle1"} ;
				punchCarStr.push(juicer(smalTitlePattern,{
												className : className ,
												colNumber : planReal[i].attendNo ,
												colName : planReal[i].attendName ,
												colAttendVal : planReal[i].realVal 
											}));		
			}
		}else{
			 if(index == 1){punchCarStr.push(juicer(smalTitlePattern,{className : "smallTitle1",colName: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_181}));};
		}
		$('#calendar_info').append(punchCarStr.join(''));
  	 },
  	 getFixedAttendPlanList :function(planReal,index){
    	var len = planReal.length ;
		var punchCarStr=[];
		if (len > 0) {
			for (var i = 0; i < len; i++) {
				 
				var className = "smallTitle";
				if(i % 3 == 0) { className = "smallTitle1"} ;
				punchCarStr.push(juicer(smalTitlePattern,{
												className : className ,
												colNumber : planReal[i].attendNo ,
												colName : planReal[i].attendName ,
												colAttendVal : planReal[i].realVal 
											}));	
			}
			$('#calendar_info').append("<div style='width:100%;float:left'>"+punchCarStr.join('')+"</div>");
		}else{
			 if(index == 1){punchCarStr.push(juicer(smalTitlePattern,{className : "smallTitle1",colName: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_181}));};
			 $('#calendar_info').append(punchCarStr.join(''));
		}
  	 },
  	 getFixedAttendPlanList1 :function(planReal,index){  // 为实际出勤和应出勤定做的模板
    	var len = planReal.length ;
		var punchCarStr=[];
		if (len > 0) {
			for (var i = 0; i < len; i++) {
				 
				var className = "smallTitle";
				if(i % 3 == 0) { className = "smallTitle1"
					punchCarStr.push(juicer(smalTitlePattern1,{
												className : className ,
												colNumber : planReal[i].attendNo ,
												colName : planReal[i].attendName ,
												colAttendVal : planReal[i].realVal 
											}));	
				}else{
					punchCarStr.push(juicer(smalTitlePattern1,{
												className : className ,
												colNumber : planReal[i].attendNo ,
												colName : planReal[i].realVal  ,
												colAttendVal : planReal[i].attendName
											}));	
				}
			}
			$('#calendar_info').append("<div style='width:100%;float:left'>"+punchCarStr.join('')+"</div>");
		}else{
			 if(index == 1){punchCarStr.push(juicer(smalTitlePattern,{className : "smallTitle1",colName: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_181}));};
			 $('#calendar_info').append(punchCarStr.join(''));
		}
  	 },
  	 
  	 getLinkTitleList : function(title,len,id)  // 设置标题
  	 {
  	 	var punchCarTitle = [];
  	  	if(len > 0){
    			punchCarTitle.push(juicer(bigTitleLinkPattern,{titleName: title ,id:id,contentId:id+"Show"}));
    		}else
    		{
    			punchCarTitle.push(juicer(bigTitlePattern,{titleName: title}));
    		}
		    $('#calendar_info').append(punchCarTitle.join(''));
  	 },
  	 creatShowBillInfoDiv : function(info,id)
  	 {
  	 	 var billInfo = []; 
  	 	 if(id == "overTimeDetailInfo") // 加班
  	 	 {  
  	 	 	for(var i = 0; i < info.length; i++) {
  	 	 		var description =(info[i].description == null) ? "" : info[i].description ;
				billInfo.push(juicer(detailInfoPattern,{
								name: info[i].name ,
								beginTime:info[i].beginTime ,
								endTime:info[i].endTime ,
								length:info[i].length,
								unit:info[i].unit ,
								otType :info[i].OtCompens ,
								state:info[i].state ,
								description :description
					}));		// description
				}
			$('#overTimeDetailInfoShow').append("<div class=detailInfo>"+billInfo.join('')+"</div>");
			var len = $('#overTimeDetailInfoShow').find('div[class=detailInfo]').children('div:gt(0)').css('border-top','1px solid #dfdfdf').css('padding-top','5px');
	  	 	$('#overTimeDetailInfo').hover(function(){
	  	 	    	$('#overTimeDetailInfoShow').find('div[class=detailInfo]').show();
	  	 	     },function(){
	  	 	 	    $('#overTimeDetailInfoShow').find('div[class=detailInfo]').hide();
	  	 	 });
  	 	 }
  	 	 if(id == "leaveDetailInfo") // 请假
  	 	 {
  	 	 	for(var i = 0; i < info.length; i++) {
  	 	 		var description =(info[i].description == null) ? "" : info[i].description ;
				billInfo.push(juicer(detailInfoPattern,{
												name: info[i].name ,
												beginTime:info[i].beginTime ,
												endTime:info[i].endTime ,
												length:info[i].length,
												unit:info[i].unit ,
												state:info[i].state ,
												description :description
					}));		
			}
			$('#leaveDetailInfoShow').append("<div class=detailInfo>"+billInfo.join('')+"</div>");
			var len = $('#leaveDetailInfoShow').find('div[class=detailInfo]').children('div:gt(0)').css('border-top','1px solid #dfdfdf').css('padding-top','5px');
  	 	 	$('#leaveDetailInfo').hover(function(){
	  	 	 	   $('#leaveDetailInfoShow').find('div[class=detailInfo]').show();
	  	 	 }
	  	 	 ,function(){
	  	 	 	   $('#leaveDetailInfoShow').find('div[class=detailInfo]').hide();
	  	 	 });
  	 	 }
  	 	 if(id == "tripDetailInfo"){  // 出差
			for(var i = 0; i < info.length; i++){
				var startPlace=(info[i].startPlace == null) ? "" : info[i].startPlace +" to ";
				var endPlace=(info[i].tripEndPlace == null) ? "" : info[i].tripEndPlace;
				var reason=(info[i].reason == null) ? "" : info[i].reason;
				var description=(info[i].description == null) ? "" : info[i].description;
					billInfo.push(juicer(tripBillPattern,{
							startPlace:startPlace ,
							endPlace:endPlace,
							beginTime:info[i].beginTime,
							endTime:info[i].endTime ,
							length:info[i].length,
							unit:info[i].unit ,
							state:info[i].state ,
							reason :reason ,
							description :description
					}));				
			 }  	 
  	 	 	 $('#tripDetailInfoShow').append("<div class=detailInfo>"+billInfo.join('')+"</div>");
  	 	 	 var len = $('#tripDetailInfoShow').find('div[class=detailInfo]').children('div:gt(0)').css('border-top','1px solid #dfdfdf');
  	 	 	 $('#tripDetailInfo').hover(function(){
	  	 	 	$('#tripDetailInfoShow').find('div[class=detailInfo]').show();
	  	 	 }
	  	 	 ,function(){
	  	 	 	$('#tripDetailInfoShow').find('div[class=detailInfo]').hide();
	  	 	 });
  	 	 }
  	 	 if(id == "punchCardInfo")
  	 	 {
  	 	 		var punchTime ="";
  	 	 		for(var i=0; i<info.length;i++)
	    		{
	    			punchTime +="<div>"+info[i]+"</div>";	
	    		}
	    		$('#punchCardInfoShow').append("<div class=punchCard>"+punchTime+"</div>");
	    		$('#punchCardInfo').hover(function(){
	  	 	 		$('#punchCardInfoShow').find('div[class=punchCard]').show();
	  	 	 	},function(){
	  	 	 		$('#punchCardInfoShow').find('div[class=punchCard]').hide();
	  	 	 	});
  	 	 }
  	 }
  	 
  	 //获取考勤计算页面的查询条件，作为全局参数，用于传送到【流程单据查询】
  	 ,getAtsCalGobalParam : function (){
  	 	atsCalGobalParam = {
  	 		adminOrgUnit_longNumber : $("input[name='adminOrgUnit.longNumber']").val(),
  	 		adminOrgUnitId : $("input[id^='AdminOrgUnit']").val(),
  	 		proposerName : $("input[name='proposer']").val(),
  	 		attencePolicyId : $("input[id^='attencePolicy']").val(),
  	 		beginDate : $("input[name='beginDate']").val(),
  	 		endDate : $("input[name='endDate']").val(),
  	 		hrOrgUnitId:$('#hrOrgUnit_el').val(),
  	 		attendanceGroupID : attendanceGroupID　
  	 	};
  	 }
  	,initialQueryFilterParam : function (){
  		if(sessionStorage.getItem("atsCalFilterParam")!=null){
  			var atsCalFilterParam = $.parseJSON(sessionStorage.getItem("atsCalFilterParam"));
  			$('input[name=AdminOrgUnit]').shrPromptBox("setValue", atsCalFilterParam.AdminOrgUnit);			
  			$('input[name=attencePolicy]').shrPromptBox("setValue", atsCalFilterParam.attencePolicy);			
  			$('input[name=prop_attencegroup]').shrPromptBox("setValue", atsCalFilterParam.attencegroup);
  			$("input[name='proposer']").val(atsCalFilterParam.proposerName);
  			$("input[name='attendPeriod']").val(atsCalFilterParam.attendPeriod.name);
			$("input[name=beginDate]").val(atsCalFilterParam.attendPeriod.beginDate);
			$("input[name=endDate]").val(atsCalFilterParam.attendPeriod.endDate);
			attendPeriodId=atsCalFilterParam.attendPeriod.attendPeriodId;  
  		}
  	}
  	,removeQueryFilterParam : function (){
  		sessionStorage.removeItem("atsCalFilterParam");
  	}
  	//
  	,saveQueryFilterParam : function (){
  	 	atsCalFilterParam = {
  	 		AdminOrgUnit : $('input[name=AdminOrgUnit]').shrPromptBox("getValue"),
  	 		attencePolicy : $('input[name=attencePolicy]').shrPromptBox("getValue"),
  	 		attendPeriod :{
  	 		       name : $("input[name='attendPeriod']").val(),
  	 		       beginDate : $("input[name=beginDate]").val(),
  	 		       endDate : $("input[name=endDate]").val(),
  	 		       attendPeriodId : attendPeriodId
  	 		     },
  	 		proposerName : $("input[name='proposer']").val(),
  	 		attencegroup : $('input[name=prop_attencegroup]').shrPromptBox("getValue")　
  	 	};
  	 	sessionStorage.setItem("atsCalFilterParam",JSON.stringify(atsCalFilterParam));
  	 }
  	//隐藏查询项，页签样式修改
  	 ,queryDivInit : function () {
		/*var temp='<div id="pageTabs" >';
		temp += '<ul>';
		temp += '<li><a id="calAttendPersonList">已计算</a></li>';
		temp += '<li><a id="waitCalAttendPersonList">待计算</a></li>';
		temp += '<li><a id="noneCalAttendPersonList">未计算</a></li>';
		temp += '</ul>';
		temp += '</div>';
		if($("#pageTabs").length==0){
			//$("#home-container").append(temp);
			var div=document.createElement("div");
			div.id="sidebar";
			var sidebar=document.getElementById("home-wrap");
			sidebar.parentNode.insertBefore(div,sidebar);
			$("#sidebar").append(temp).hide();
		}*/
		
//		$("#queryDiv").append('<div><a title="收起" id="packUp" href="#" class="packUp"></a></div>');
//		$("#queryDiv").append('<div><button type="button" class="shrshrbtn-primary shrbtn" name="确定" id="confirmQuery">确定</button></div>');
		transition=$("#queryDiv").css("height");
//  		$("#queryDiv").css({"height":"0px","overflow":"hidden"});
//  	$("#datagrid").css({"border-left":"1px solid #ddd"});
  		$("#confirmQuery").css({"float":"right","margin-top":"-28px"});
		$("#pageTabs").addClass("notice-tit");
		$("#dataBox").addClass("notice-con");
		$("div[class^='col-lg-1']").css({width:"0%"});
		$(".col-lg-3").css({width: "10.5%"});
		$(".col-lg-4").css({width: "22%"});
		
		$(document).bind("click", function (){ 
			if($('#DisplayDetail').html()){
				$("#detail").text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_132);
				$("#DisplayDetail").fadeOut("normal",function(){
					$("#DisplayDetail").empty();
				});
			}
			if($('#DisplayResult').html()){
				$("#summary").text(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_88);
				$("#DisplayResult").fadeOut("normal",function(){
					$("#DisplayResult").empty();
				});
			}
		});
		$("#DisplayDetail").live("click", function (event){ 
			event.stopPropagation();//阻止事件向上冒泡
		});
		$("#DisplayResult").live("click", function (event){ 
			event.stopPropagation();//阻止事件向上冒泡
		});
  	 }
  
  	,getRunningInstSum:function(){   
 		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryCalculateHelper&method=getRunningInstSum';
 		var num = 0 ;
 		shr.ajax({
 			type:"post",
 			async:false,
 			url:url,
 			success:function(res){
 				if(res)
 				{    
 					num = res.num;
 				}
 			}
 		});
 		return num;
 	}
  	,getBatchCalHandler:function(self,calcaulateFun,args){
 		
  		var handler2 = new Handler();
  		handler2.handle = function(){
  			    var personNum = 0;
  			    var day = 0;
  			    if(args!=undefined && args.length==2){
  			    	personNum = args[1];
  			    }else{
  			    	if( $("#grid").html()){
						if($(".showBreakPage").html().split("/").length>1){
  			    			personNum = parseInt($(".showBreakPage").html().split("/")[1].replace(",",""));  			    		
  			    		}
  			    	}else{
  			    		if($("#gripage").html().split("/").length>1){
  			    			personNum = parseInt($("#gripage").html().split("/")[1].replace(",",""));  			    		
  			    		}
  			    	}
  			    }
  			    if(new Date(atsMlUtile.getFieldOriginalValue("endDate"))>new Date().getTime() && new Date(atsMlUtile.getFieldOriginalValue("beginDate"))<new Date().getTime() ){
  			    	day = parseInt((new Date().getTime()-new Date(atsMlUtile.getFieldOriginalValue("beginDate")).getTime())/(3600*24*1000)) + 1;
  			    }else if(new Date(atsMlUtile.getFieldOriginalValue("endDate"))<=new Date().getTime() ){
  			    	day = (new Date(atsMlUtile.getFieldOriginalValue("endDate")).getTime()-new Date(atsMlUtile.getFieldOriginalValue("beginDate")).getTime())/(3600*24*1000) + 1;
  			    }
	  			if( personNum*day > 15000){
	  				shr.showConfirm(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_137, function() {
	  					calcaulateFun.apply(self, args);  
					});
	  			}else{
	  				calcaulateFun.apply(self, args);  
	  			}
  			}
  		var handler1 = new Handler(handler2);

  		handler1.handle = function(){
  			    var that =this;
				var instNum = self.getRunningInstSum();
				if(instNum>0 && instNum<3){
					shr.showConfirm(shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_139,[instNum]), function() {
						Handler.prototype.handle.call(that);
					});
				}else if(instNum>=3){
					shr.showConfirm(shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_138,[instNum]), function() {
						Handler.prototype.handle.call(that);
					});
				}else{
					 Handler.prototype.handle.call(this);
				}
  			};

		handler1.handle();
  	}
  	,changeAttenceOrg:function(flag){
		var _self = this;
		var uipk = shr.getUrlRequestParam("uipk");
		if(uipk.indexOf("ScheduleShift.list")>-1){
		   flag = "schShift";
		}else if(uipk.indexOf("AttenceResult.list")>-1){
			flag = "attendanceResult";
		}else{
		}
		//$("#iframe2").attr("src",shr.getContextPath()+ '/dynamic.do?method=initalize&attencetype=attenceResult&uipk=com.kingdee.eas.hr.ats.AttendanceOrgEdit');
		$("div#iframe2").dialog({
			modal : true,
			position: {
						my: 'center',
						at: 'top+50%',
						of: window
					} ,
			title : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_101,
			width : 855,
			minWidth : 825,
			height :220,
			minHeight : 220,
			overlay: {overflow:'auto'}, 
			open : function(event, ui) {
				_self.appendDynamicHTML(this);
				if(flag == "attendanceResult"){
						//考勤结果明细表中原来查询中的姓名就是id=propsoer，弹出的框中员工也是这个id.会导致原来的也变成f7所以要恢复原来的。
						$("#proposer").closest(".ui-text-frame").html('<input id="proposer" class="block-father input-height" ' +
								'type="text" name="proposer" validate="{maxlength:44}" value="" placeholder="" dataextenal="" ' +
								'ctrlrole="text" maxlength="44" style="width: 276px;">');
				}
			},
			close : function() {
				$("#iframe2").empty();
			},
			buttons: [{
				text: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_195,
				click: function(){
					$(this).disabled = true;
					_self.savaUpdateDateAction(flag);
				}
			},{
				text: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_156,
				click: function(){
					$("#iframe2").empty();
					$("#iframe2").dialog("close");
				}
			}]
		});
		$("#iframe2").attr("style", "width:850px;height:220px;");
	}
	,
	//已计算页面--明细显示模式--催办
	pressToConfirm:function(){
		var _self = this;
		$('li[name=pressToConfirm]').click(function(){
			if(currentIsConfirm){
				var sid = $("#reportGrid").jqGrid("getSelectedRows");
				var fids="";
				var fidArray=new Array();
				if(sid.length>0){
					shr.showConfirm(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_160,function(){
						for ( var i in sid) {
						var item = sid[i];
						var data = $("#reportGrid").jqGrid("getRowData", item);
						var recordId=data["FID"] ;
						var attenceStatus=data["fconfirmState"];
						if(attenceStatus==jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_179){
							fidArray.push(recordId);
						}						
					}
					for(var i=0;i<fidArray.length;i++){
						if(i==fidArray.length-1){
							fids+="'"+fidArray[i]+"'";
						}else{
							fids+="'"+fidArray[i]+"',";
						}	
					}
					if(fids!=""){
						openLoader(1); 
						_self.remoteCall({
							type : "post",
							method : "pressToConfirm",
							param : {
								fids:fids
							},
							success : function(res){
								closeLoader();
								if(res.flag=true)
								{
									 shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_42});
								}else{
									 shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_43});
								}
							},
							error: function(){
								closeLoader();
							},
							complete:function(){
								closeLoader();
							}
			 			});
					}else{
						shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_154});
					}
					})
				}else{
					shr.showConfirm(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_159,function(){
						openLoader(1); 
						_self.remoteCall({
							type : "post",
							method : "pressToConfirm",
							param : {
								fids:'cbqb'
							},
							success : function(res){
								closeLoader();
								if(res.flag=true)
								{
									 shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_42});
								}else{
									 shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_43});
								}
							},
							error: function(){
								closeLoader();
							},
							complete:function(){
								closeLoader();
							}
			 			});
					})
				}					
			}else{
				shr.showError({message:jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_74});
			}
		});
	}
	,appendDynamicHTML: function(object){
		$(object).append(''
			 + '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_202
			+ '</div></div>'
			 + '</div>'

			 + '<div class="row-fluid row-block "><div class="col-lg-4"><div class="field_label">'
            + jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_117
			+ '</div></div><div class="col-lg-6 field-ctrl">'
			 + '<input type="text" id="hrOrgUnitChangeAttenceOrg" name="hrOrgUnitChangeAttenceOrg" class="input-height cell-input"  validate="{required:true}"  value=""/></div>'
			 + '<div class="col-lg-2 field-desc"/>'
			 + '<div class="col-lg-4"><div class="field_label">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_192
			+ '</div></div><div class="col-lg-6 field-ctrl">'
			 + '<input type="text" id="proposer" name="proposer" class="input-height cell-input"  validate="{required:true}"  value=""/></div></div>'

			 + '<div class="row-fluid row-block "><div class="col-lg-4"><div class="field_label">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_111
			+ '</div></div><div class="col-lg-6 field-ctrl">'
			 + '<input type="text" dataType="date"  id="attenceStartDate" name="attenceStartDate" value=""/></div>'
			 + '<div class="col-lg-2 field-desc"/>'
			 + '<div class="col-lg-4"><div class="field_label">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_109
			+ '</div></div><div class="col-lg-6 field-ctrl">'
			 + '<input type="text" dataType="date"  id= "attenceEndDate" name="attenceEndDate" value=""/></div></div>'


			 + '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_194
			+ '</div></div>'
			 + '</div>'

			 + '<div class="row-fluid row-block "><div class="col-lg-4"><div class="field_label">'
			+ jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_99
			+ '</div></div><div class="col-lg-6 field-ctrl">'
			 + '<input type="text" id="attAdminOrgUnit" name="attAdminOrgUnit" class="input-height cell-input"  validate="{required:true}"  value=""/></div>'
		 );
					    
	    //【考勤日期】	
		$('input[name="attenceStartDate"]').shrDateTimePicker({
				id : "attenceStartDate",
				tagClass : 'block-father input-height',
				readonly : '',
				yearRange : '',
				ctrlType: "Date",
				isAutoTimeZoneTrans:false,
				validate : '{dateISO:true,required:true}'
		});
		
		 //【考勤日期】	
		$('input[name="attenceEndDate"]').shrDateTimePicker({
				id : "attenceEndDate",
				tagClass : 'block-father input-height',
				readonly : '',
				yearRange : '',
				ctrlType: "Date",
				isAutoTimeZoneTrans:false,
				validate : '{dateISO:true,required:true}'
		});
		
		//【员工】
		var grid_f7_json = {id : "proposer"  ,name:"proposer"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		var proposerObject = $('input[name="proposer"]');
		grid_f7_json.subWidgetOptions = {
			title : jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_200,
			uipk : "com.kingdee.eas.hr.ats.app.ExistFileForAdmin.F7",
			query : "",
			multiselect:true
			
		};
		grid_f7_json.validate = '{required:true}';
		proposerObject.shrPromptBox(grid_f7_json);
		
		//组装F7回调式对话框	 
		grid_f7_json= null;
	    grid_f7_json = {id:"adminOrgUnit",name:"adminOrgUnit"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_191,
			uipk:"com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",
			query:"",
			filter:"", 
			domain:""
		};
		grid_f7_json.validate = '{required:true}';
		var orgUntiObject = $('input[name="adminOrgUnit"]');
		orgUntiObject.shrPromptBox(grid_f7_json);
		
		//组装F7回调式对话框	 
		grid_f7_json= null;
	    grid_f7_json = {id:"hrOrgUnitChangeAttenceOrg",name:"hrOrgUnitChangeAttenceOrg"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.afterOnchangeClearFields="attAdminOrgUnit";
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_123,
			uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",
			query:"",
			filter:"", 
			domain:""
		};
		grid_f7_json.validate = '{required:true}';
		var hrOrgUntiObject = $('input[name="hrOrgUnitChangeAttenceOrg"]');
		hrOrgUntiObject.shrPromptBox(grid_f7_json);
		$("#hrOrgUnitChangeAttenceOrg").shrPromptBox("option", {
			onchange : function(e, value) {
				var info = value.current;
				if(info != undefined){
					//#iframe2
					$("#iframe2 #proposer").shrPromptBox("setFilter","hrOrgUnit.id = '" + info.id + "' ");		
				}
			}
		});
		
		//组装F7回调式对话框	 
		grid_f7_json= null;
	    grid_f7_json = {id:"attAdminOrgUnit",name:"attAdminOrgUnit"};
	    grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_99,
			uipk:"com.kingdee.eas.hr.ats.app.AttAdminOrgUnit.F7",
			query:"",
			filter:"", 
			domain:""
		};
		
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnitChangeAttenceOrg";	
//		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";	
		grid_f7_json.subWidgetOptions.filterConfig = [{name: '',value: true,alias: '',widgetType: 'no'}];
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		var attAdminOrgUnitObject = $('input[name="attAdminOrgUnit"]');
		attAdminOrgUnitObject.shrPromptBox(grid_f7_json);
		$(".ui-dialog-buttonset button:eq(0)").css("background","#428bca").css("border-color","#428bca").css("color","white");
		
	}
	,savaUpdateDateAction: function(flag){
		var _self = this;
		var iframe2Object = $("#iframe2").contents();
		var attenceStartDate = iframe2Object.find('#attenceStartDate').val();
		var attenceEndDate = iframe2Object.find('#attenceEndDate').val();
		var proposerIds = iframe2Object.find('#proposer_el').val();
//		var adminOrgUnitId = iframe2Object.find('#adminOrgUnit_el').val();
		var attAdminOrgUnitId = iframe2Object.find('#attAdminOrgUnit_el').val();
		var hrOrgUnitId = iframe2Object.find('#hrOrgUnitChangeAttenceOrg_el').val();
		if(attenceStartDate == null || attenceStartDate.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_113, hideAfter: 3});
			return false
		}
		
		if(attenceEndDate == null || attenceEndDate.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_110, hideAfter: 3});
			return false
		}
		
//		if(proposerIds == null || proposerIds.length == 0){
//			shr.showInfo({message: "员工不能为空!", hideAfter: 3});
//			return false
//		}
		if(attAdminOrgUnitId == null || attAdminOrgUnitId.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_100, hideAfter: 3});
			return false
		}
//		if(adminOrgUnitId == null || adminOrgUnitId.length == 0){
//			shr.showInfo({message: "行政组织不能为空!", hideAfter: 3});
//			return false
//		}
		if(hrOrgUnitId == null || hrOrgUnitId.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_124, hideAfter: 3});
			return false
		}
		var beginDate = new Date(attenceStartDate.replace(/-/g, "/"));
		var endDate  = new Date(attenceEndDate.replace(/-/g, "/"));
		if(beginDate.getTime() > endDate.getTime()){
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_112, hideAfter: 3});
			return false
		}
		
		var url = "";
		if(flag == 'schShift'){
			url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceOrgEditHander&method=schShiftOrgEdit";
		}
		else if(flag = 'attendanceResult'){
			url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceOrgEditHander&method=attenceResultOrgEdit";
		}
		else{
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_18, hideAfter: 3});
			return false
		}
		
		shr.ajax({
			url: url,
			dataType:'json',
			type: "POST",
			data: {
				attenceStartDate :attenceStartDate,
	    		attenceEndDate : attenceEndDate,
	    		proposerIds : proposerIds,
	    		attAdminOrgUnitId:attAdminOrgUnitId,
	    		hrOrgUnitId:hrOrgUnitId
			},
			beforeSend: function(){
				openLoader(1);
			},
			cache: false,
			success: function(res) {
				closeLoader();
				shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_21});
				jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
				$("#iframe2").dialog("close");
			},
			error: function(){
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});
	},
	queryAction: function(){
		var self = this;
		if($("#queryDiv").css("height")!="0px"){
//			$("#queryDiv").animate({height:"0px"},500,function(){
//				//$("#queryDiv").css({"display":"none"});
//			});
//			$("#pageTabs").animate({top:"0px"},500);
			
			//已计算页签--明细显示点击查询时
			if(isCalShowDetail==true){
				self.getJqgridData(9);
			}
			else{
				self.getJqgridData(1);
			}			
		}else{
			$("#sidebar").animate({"width":parseFloat($("#home-wrap").css("margin-left"))+40+"px"});
			$("#queryDiv").animate({height:transition},500,function(){
				$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
			});
			//$("#pageTabs").animate({top:transition},500);
			$("#unfold").html("");
		}
	}
});

function showOneDayDetailOnProject(personName,tDay,personId,adminOrgId){
	isDetailOnProject=true;
	defineClass.showBillDetailAction(personName,tDay,personId,adminOrgId);	
}

function formatDate(date) {  
     var year = date.getFullYear();
     var month =  (date.getMonth() + 1) > 9 ? (date.getMonth() + 1):('0' +  (date.getMonth() + 1));
     var day = date.getDate() > 9 ? date.getDate():('0'  +  date.getDate());
     return year + '-' + month + '-' + day;
} 
/*
 * _self：td列对象；value：传递过来的值对象：类似于[休息日]轮班1
 * flag：是否对当前列颜色标识
 */
function getColorTitle(_self,value,flag){
	$(_self).removeClass('gray-color');
	$(_self).removeClass('litterGreen-color');
	
	if (value.substring(0, jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_4.length)
		== jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_4) {
		if(flag){
			$(_self).addClass('gray-color');
		}
		return value.substring(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_4.length);
	}
	else if (value.substring(0, jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_2.length)
		== jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_2) {
		if(flag){
			$(_self).addClass('litterGreen-color');	
		}
		return value.substring(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_2.length);
	}
	else {
		if (value.indexOf(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_3) > -1) {
			return value.substring(jsBizMultLan.atsManager_attendancePanelCalculateV2_i18n_3.length);
		}
		else{
			return value;
		}
	}
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
	
function getJobFilter(){
	return "jobDefCategory.longNumber like '301!3001%'";
}
/*
 * 回调针中处理
 */
function closeFrameDlg(ifameid,shiftName,shiftID){
	$('#'+ifameid).attr('title',shiftName);
	$('#'+ifameid).attr('shiftID',shiftID);
    $('#'+ifameid).dialog('close');
}
function Handler(s){
	this.successor = s || null;
}
function dateDiff(date1, date2) {
            var type1 = typeof date1, type2 = typeof date2;
            if (type1 == 'string')
                date1 = stringToTime(date1);
            else if (date1.getTime)
                date1 = date1.getTime();
            if (type2 == 'string')
                date2 = stringToTime(date2);
            else if (date2.getTime)
                date2 = date2.getTime();
            //alert((date1 - date2) / (1000*60*60));
            return (date1 - date2) / (1000 * 60 * 60*24); //结果是小时
        }
		 //字符串转成Time(dateDiff)所需方法
        function stringToTime(string) {
            var f = string.split(' ', 2);
            var d = (f[0] ? f[0] : '').split('-', 3);
            var t = (f[1] ? f[1] : '').split(':', 3);
            return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
            )).getTime();


        }
	function addDate(date,days){ 
       var d=new Date(date); 
       d.setDate(d.getDate()+days); 
       var m=d.getMonth()+1;
		if(d.getDate()<10){
		return d.getFullYear()+'-'+m+'-0'+d.getDate(); 
		}else{
       return d.getFullYear()+'-'+m+'-'+d.getDate(); 
	   }
     } 
	 function delDate(date,days){ 
       var d=new Date(date); 
       d.setDate(d.getDate()-days); 
       var m=d.getMonth()+1;
		if(d.getDate()<10){
		return d.getFullYear()+'-'+m+'-0'+d.getDate(); 
		}else{
       return d.getFullYear()+'-'+m+'-'+d.getDate(); 
	   }
     } 
Handler.prototype = {
	handle:function(){
	 if (this.successor) {
         this.successor.handle()
     }
	}	
};
