var sidValue = [];
var step=1;
var addRowID=1;
var type=2;
// 设置组织编码
var orgLongNum="";
// 只有在全部重算的时候，使用 组织ID 
var orgAdminId=""; 
var attendPolicyId="";  
var attendPeriodId="";
var attenceCycleId="";
var attendanceGroupID="";
var indexMonth="";
var indexYear=""; 
var indexNextMonth="";
var selfNavi = "" ;  // 保存每次下一步进来的参数
var atsCalGobalParam;//查看流程单据传递参数
var _events = []; 
var refresh = 1 ;  //是否刷新
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
shr.defineClass("shr.ats.attendancePanelCalculate",shr.ats.attendancePanelCommonStyle, {
	
	showAttendJson : null ,
	isReload : false ,
	reportUipk : "hr.ats.com.attendancePanelCalculate",
	rowNumPerPage : 15,
	initalizeDOM : function() {
		var that = this;
		$('#calendar_info').remove();
		$('#mainTitle').remove(); 
		$('#operationDialog').append("<div id='calendar_info'></div>");
		$('#main').append("<div id='mainTitle'></div>");  // 主要解决多节点问题
		//$("#calendar_info").empty(); 
		that.processF7ChangeEvent();	
		shr.ats.attendancePanelCalculate.superClass.initalizeDOM.call(this);
		//that.initDefaultTitle();
		that.queryDivInit();
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
	},
	attendPersonList: function(){
			$("#pageTabs").find('ul li').eq(0).removeClass("select");
			$("#pageTabs").find('ul li').eq(1).removeClass("select");
			$("#pageTabs").find('ul li').eq(2).addClass("select");
//			$("#pageTabs").find('ul li').eq(1).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active");
//			$("#pageTabs").find('ul li').eq(0).removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
//			$("#pageTabs").find('ul li a').css('border','0px');
//			$("#pageTabs").find('ul li a').eq(1).removeClass("colNameType").addClass("fontGray");
//			$("#pageTabs").find('ul li a').eq(0).removeClass("fontGray").addClass("colNameType");
			var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AttendanceBoardList$fragment','view');
			// com.kingdee.eas.hr.ats.app.PunchCardRecord.list 
			// 
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
	waitCalPersonList: function(){
		
		$("#pageTabs").find('ul li').eq(0).removeClass("select");
		$("#pageTabs").find('ul li').eq(2).removeClass("select");
		$("#pageTabs").find('ul li').eq(1).addClass("select");
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
	  		var flag=true;
			$("input[name='attendPeriod']").empty();
			var selectFlag=true;
			if(len>0){ 
				var json=[]; 
				var select_json=[];
				// 考勤周期 删掉重新生成节点
				$("input[name='attendPeriod']").remove();
				$("div[title='"+jsBizMultLan.atsManager_attendancePanelCalculate_i18n_69+"']").parent().next()
					.find("div[class='ui-text-frame disabled']")
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
				shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_72});
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
			$("#pageTabs").hide();
			return {status: 1};
	},
	
	//组织的编号和考勤制度的id为全局变量
	onNaviLoad:function(_navi){
		$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
		selfNavi = _navi ;
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
       	that.initDefaultTitle();
       	$("#pageTabs").find('ul li').eq(1).removeClass("select");
       	$("#pageTabs").find('ul li').eq(2).removeClass("select");
       	if(strBeginDate == undefined && strEndDate== undefined)
       	{
       		 //开始近来设置其默认值，默认组织，默认考勤制度，考勤周期，开始，结束日期 ;
			that.initDefaultFilter();
       	}else{ 
			orgLongNum=adminOrgLongNum;
			$('input[name=AdminOrgUnit]').val(adminOrgName);
			$('input[name=proposer]').val(name);
			attendPolicyId=attendancPolicyId;
			that.getAttenceCycle(attendPolicyId);
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
       	if(_navi.getParm("periodId") != undefined){ // 解决上下步出现 考勤周期出错的情况
       		attendPeriodId = _navi.getParm("periodId");
       	}
		that.onclickAttendProject();  // 修改汇总显示和明细显示的顺序
		that.getJqgridData(1);		
		if(step == 1)
		{
			$("#pageTabs").css({"top":"0px"});
			$("#pageTabs").show();
			$("#pageTabs").find('ul li').eq(0).addClass("select");
//			$("#pageTabs").tabs(); 
//			$("#pageTabs").find('ul li').eq(0).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active");
//			$("#pageTabs").find('ul li').eq(1).removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
			$('#calAttendPersonList').parent().click(function(){ // 已计算人员
//				$("#pageTabs").find('ul li').eq(0).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active");
//				$("#pageTabs").find('ul li').eq(1).removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
//				$("#pageTabs").find('ul li a').css('border','0px');
//				$("#pageTabs").find('ul li a').eq(0).removeClass("colNameType").addClass("fontGray");
//				$("#pageTabs").find('ul li a').eq(1).removeClass("fontGray").addClass("colNameType");
				$("#pageTabs").find('ul li').removeClass("select-hover").removeClass("select-hover-other");
				$("#pageTabs").find('ul li').eq(0).addClass("select");
				$("#pageTabs").find('ul li').eq(1).removeClass("select");
				$("#pageTabs").find('ul li').eq(2).removeClass("select");
				$('#dataBox').css({"margin-top":"0px"});
				$('#Calculate').show();
				that.getJqgridData(1);
			}) ;
			$('#noneCalAttendPersonList').parent().click(function(){  // 未计算人员
				$("#pageTabs").find('ul li').removeClass("select-hover").removeClass("select-hover-other");
				$('#Calculate').hide();
				that.attendPersonList();
				//$('#datagrid').
			});
			$('#waitCalAttendPersonList').parent().click(function(){  // 待计算人员
				$("#pageTabs").find('ul li').removeClass("select-hover").removeClass("select-hover-other");
				$('#Calculate').show();
				that.waitCalPersonList();
				//$('#datagrid').
			});
		}else{
			$("#pageTabs").hide();
		}
		$("input[name='adminOrgUnit.longNumber']").val(orgLongNum);
		$('button[id^=query]').trigger("click");
		$("#pageTabs").find('ul li').each(function(){
			$(this).hover(function(){
				if(!$(this).hasClass("select")){
//					$(this).css({"padding-left":"5px"},50);
//					$("#pageTabs").find('ul li.select').css({"padding-left":"0px"},50);
					$(this).addClass("select-hover");
					$("#pageTabs").find('ul li.select').addClass("select-hover-other");
				}
			},function(){
				if(!$(this).hasClass("select")){
//					$("#pageTabs").find('ul li.select').css({"padding-left":"5px"},50);
//					$(this).css({"padding-left":"0px"},50);
					$(this).removeClass("select-hover");
					$("#pageTabs").find('ul li.select').removeClass("select-hover-other");
				}
			});
		});
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
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_25
			+ '" id="query">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_26
			+ '</button><span id="unfold">▼</span></span>'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_87
			+ '" id="Calculate">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_87
			+ '</button></span>'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_45
			+ '" id="CalculateBack">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_45
			+ '</button></span>'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_121
			+ '" id="tranSalary">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_121
			+ '</button></span>'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_85
			+ '" id="allAttendCaculate">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_85
			+ '</button></span>'
			+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_56
			+ '" id="selectAttendCaculate">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_56
			+ '</button></span>'
			+ '<span><button type="button" class="shrshrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_74
			+ '" id="workFlowBillsChecked">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_74
			+ '</button></span>'
			+ '<span><button type="button" class="shrshrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_24
			+ '" id="viewTransaction">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_24
			+ '</button></span>'
			+ '<span><span id="sumDisplay">'
			+ '<a name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_52
			+ '" id="summary" href="#" style=" margin-left: 30px; margin-right: 10px;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_52
			+ '</a>'
			+ '<div id="DisplayResult">'
			+ '</div>'
			+ '</span></span>'
			+ '<span><span id="detailDisplay">'
			+ '<a name="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_79
			+ '" id="detail" href="#">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_1
			+ '</a>'
			+ '<div id="DisplayDetail">'
			+ '</div>'
			+ '</span></span>'
			+ '<span width="130px"><input type="hidden"  id="attend" class="shrbtn-primary shrbtn" ></input></span>'
			+ '<div id="microToolbar" style="width:300px"></div>'
			+ '</div>';
		$('#choiceList').append(row_fields_work);
		$('#menuList').append(menu);
		if(step ==1){
			$('#CalculateBack').hide();
			$('#tranSalary').hide();
		}else{
			$('#Calculate').hide();
			$('#allAttendCaculate').hide();
			$('#selectAttendCaculate').hide();
		}
		that.processAuditAction(); // 审核  反审核  转薪资
		that.workFlowBillsCheckedEvent();// 流程单据检查
	},
	onclickAttendProject : function() {
			var self = this;
			$("#detail").click(function(event){ // 明细显示
					event.stopPropagation();//阻止事件向上冒泡
					if($('#DisplayResult').html()){
						$("#summary").text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_52);
						$("#DisplayResult").fadeOut();
						$("#DisplayResult").empty();
						//return ;
					}
					if($('#DisplayDetail').html()){
						$("#detail").text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_79);
						$("#DisplayDetail").fadeOut("normal",function(){
							$("#DisplayDetail").empty();
						});
						$('#DisplayDetail').removeClass("scrollDiv");
						addRowID=1;
						return;
					}
					$("#detail").text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_78);
					$("#DisplayDetail").empty();
					addRowID=1;
					var row_work =''
						+ '<div>'
						+ '<span><button type="button" id="editSum" class="null shrbtn">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_20
						+ '</button></span>'
						+ '<span><button type="button" id="saveSum" class="shrbtn-primary shrbtn">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_17
						+ '</button></span>'
						+ '<span><button type="button" id="cancelSum" class="shrbtn-primary shrbtn">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_84
						+ '</button></span>'
						+ '</div>'
						+ '<div style="padding-top:15px;margin-left: 30px;width:400px;" class="row-fluid row-block row_field">'
						+ '<div class="spanSelf" ><span class="cell-RlStdType">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_104
						+ '</span></div>'
						+ '<div class="spanSelf" ><span class="cell-RlStdType">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_102
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
									+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_101
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
											shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_68});
				     	  	 					flag=false ;
				     	  	 					return ;
									}
									if(name.indexOf(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_95)!=-1){
											shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_67});
				     	  	 					flag=false ;
				     	  	 					return ;
									}
									 for(var k=0;k<i;k++)
				     				{   
				     	  				json = eval(json)  ;
				     	  				if(name==json[k].name )
				     	  				{
				     	  	 				shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_43,[k+1, i+1])});
				     	  	 				flag=false ;
				     	  	 				return ;
				     	  				} 
				     	  				if(sequence==json[k].sequence){
				     	  					shr.showError({message:shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_44,[k+1,i+1])});
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
												message : '保存成功！',
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
						$("#detail").text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_79);
						$("#DisplayDetail").fadeOut();
						$("#DisplayDetail").empty();
						//return ;
					}
					if($('#DisplayResult').html()){
						$("#summary").text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_52);
						$("#DisplayResult").fadeOut("normal",function(){
							$("#DisplayResult").empty();
						});
						$('#DisplayResult').removeClass("scrollDiv");
						addRowID=1;
						return ;
					}
					$("#summary").text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_51);
					$("#DisplayResult").empty();
					addRowID=1;
					var row_work =''
						+ '<div>'
						+ '<span><button type="button" id="editSum" class="null shrbtn">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_20
						+ '</button></span>'
						+ '<span><button type="button" id="saveSum" class="shrbtn-primary shrbtn">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_17
						+ '</button></span>'
						+ '<span><button type="button" id="cancelSum" class="shrbtn-primary shrbtn">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_84
						+ '</button></span>'
						+ '</div>'
						+ '<div style="padding-top:15px;margin-left: 30px;width:400px;" class="row-fluid row-block row_field">'
						+ '<div class="spanSelf" ><span class="cell-RlStdType">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_104
						+ '</span></div>'
						+ '<div class="spanSelf" ><span class="cell-RlStdType">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_102
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
									+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_100
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
											shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_68});
				     	  	 					flag=false ;
				     	  	 					return ;
								}
								
								if(name != undefined && sequence!= undefined)
								{	
									if(name.indexOf(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_95)!=-1){
											shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_67});
				     	  	 					flag=false ;
				     	  	 					return ;
									
									}
									 for(var k=0;k<i;k++)
				     				{   		 
				     	  				json = eval(json)  ;
				     	  				if(name==json[k].name )
				     	  				{
				     	  	 				shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_43,[k+1,i+1])});
				     	  	 				flag=false ;
				     	  	 				return ;
				     	  				} 
				     	  				if(sequence==json[k].sequence){
				     	  					shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_44,[k+1,i+1])});
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
												message : '保存成功！',
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
												message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_19,
												hideAfter : 3
											});
										}
								})
							}
						}							
					});
			}) 
		$('button[id^=query]').click(function() {
			if($("#queryDiv").css("height")!="0px"){
//				$("#queryDiv").animate({height:"0px"},500,function(){
//					//$("#queryDiv").css({"display":"none"});
//				});
//				$("#pageTabs").animate({top:"0px"},500);
				self.getJqgridData(1);
			}else{
				$("#sidebar").animate({"width":parseFloat($("#home-wrap").css("margin-left"))+40+"px"});
				$("#queryDiv").animate({height:transition},500,function(){
					$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
				});
				$("#pageTabs").animate({top:transition},500);
				$("#unfold").html("");
			}
			//self.getJqgridData();
		});
		$("#unfold").click(function(){
			$('button[id^=query]').trigger("click");
		});
		$('#confirmQuery').click(function() {
			$("#queryDiv").animate({height:"0px"},500,function(){
			});
			$("#pageTabs").animate({top:"0px"},500);
			self.getJqgridData();
		});
		$('#packUp').click(function() {
			$("#sidebar").animate({"width":parseFloat($("#home-wrap").css("margin-left"))+40+"px"});
			$("#queryDiv").animate({height:"0px"},500,function(){
				$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
			});
			$("#pageTabs").animate({top:"0px"},500);
			$("#unfold").html("▼");	
		});
	},
	addRowFieldString :function($name){
    	var row_fields_work = '<div  class="row-fluid row-block row_field" style="margin-left:30px;width:400px;" id="'+ addRowID +'">'
			+ '<div class="spanSelf"><input type="text" name="attendName" value="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_96
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
	   		 		if($(this).val()==jsBizMultLan.atsManager_attendancePanelCalculate_i18n_96 ) // 鼠标移至输入框，则清空输入框且改变背景色
	   		 		{
	   		 			$(this).val("") ;
	   		 			$(this).css('color','#555555');
	   		 		}
	   		 });
	   		  $("input[name='attendName']").live('blur',function(){
				var pass = $(this).val();
				if(pass ==""){
					$(this).val(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_96);
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
	 	if ($("#pageTabs").find('ul li').eq(2).hasClass("select"))
	 	{
	 		self.attendPersonList();
	 		return ;
	 	}
		if (!self.verifyDate()) {
			shr.showInfo({
						message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_71,
						hideAfter : 3
					}); 
			return; 
		}
		$("#sidebar").hide();
		$('#datagrid').empty();
		$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGrid"></table>'); // 表头是可变的，所以要动态生成节点
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
		self.remoteCall({
					method : "getGridColModel",
					param : {
						"beginDate" : beginDate,
						"endDate" : endDate, 
						"attendPolicyId":attendPolicyId
					},
					success : function(reponse) {
						self.doRenderDataGrid(reponse,refresh);
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
		var url = self.getGridDataRequestURL();
		var colNames = reponse.colNames;
		var colModel = reponse.colModel;
		var options = {
			url : url + '&orgLongNum=' + orgLongNum + '&proposerId=' + encodeURIComponent(proposerId)
					+ '&attendPolicyId=' + encodeURIComponent(attendPolicyId) + '&attendanceGroupID='+encodeURIComponent(attendanceGroupID)+'&attendPeriodId=' + encodeURIComponent(attendPeriodId)
					+ '&beginDate=' + beginDate + '&endDate=' + endDate + '&step='+step + '&refresh='+refresh,
			datatype : "json", 
			multiselect : true,
			rownumbers : false,
			colNames : colNames,
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			pager : '#gridPager1',
			height : 'auto',
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
					var personName = data['personName'];
					self.showCalendarDetailAction(personId,adminOrgId,personName);
				} else
				// 点击具体某个项目时，弹出这个项目的明细
				if (colModel[index-1].name.substring(0, 1) == "S") {
					if (contents == 0) {
						shr.showInfo({
									message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_49
								});
						return;
					}
					var attendName = colModel[index-1].name;
					var personName = data['personName'];
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
										title : personName + " " + res[0].name+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_77,
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
									+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_20
									+ '" id="editDetailProject" >'
									+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_20
									+ '</button></span>'
									+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
									+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_17
									+ '" id="saveDetailProject" >'
									+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_17
									+ '</button></span>'
									+ '<span><button type="button" class="shrbtn-primary shrbtn" name="'
									+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_84
									+ '" id="cancelDetailProject" >'
									+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_84
									+ '</button></span>'
									+ '<span><input id="hiddAttendCol" type="hidden" value='+res[0].columnNO+'></input></span>'
									+ '</div>'
								$('#calendar_info').append(row_fields_work);
							}
							for (var i = 0; i < res.length; i++) {
								var tmpDate = res[i].date.substring(0, 10);
								var row_fields_work = ''
										+ '<div id="Main'+i+'" name='+ res[i].id+' style="margin:20px;float:left;width:40%">'
										+ '<span id="attendDate" style="margin-right: 10px;width:40%;float:left;">'+ tmpDate+ '</span>'
										+ '<span id="AttendLen" style="width:20%;float:left;">'+ res[i].lenth+'</span>'
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
						}
					});
					// 以20开头便是点击日期
				} else if (colModel[index-1].name.substring(0, 2) == "20") {
					var tDay = colModel[index-1].name;
					var personName = data['personName'];
					var personId = data['personId'];
					action="dayDetail";
					$("#calendar_info").empty();
					$("#calendar_info").next().remove();
					self.showBillDetailAction(personName,tDay,personId,adminOrgId);
				}
				$(window).resize();
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
			$("#sidebar").show();
			$("#sidebar").css({"width":parseFloat($("#home-wrap").css("margin-left"))+30+"px"});
			$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
		};
		table.html();
		table.jqGrid(options);
		$(window).resize();
		jQuery("#reportGrid").jqGrid(options);
		jQuery('#reportGrid').jqGrid('setFrozenColumns');
	},
	
	addShowAttend : function(index){
		var punchCar_List ='';
		punchCar_List += '<div class="row-fluid row-block row_field" >' 
			+ '<span class="spanSelf" style="width:10%;margin-left:45px;">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_103
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
			var dateStr=valText.split("_");
			if(dateStr[1] == ""){ dateStr[1] = 0 ;}
			$(this).parent().parent().parent().parent().next().text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_112);
			$(this).parent().parent().parent().parent().next().next().text(dateStr[1]);
	 	});	
	 	
	 	$('span[name=showInput]').live('click',function(){
	 		if($("#status").text().indexOf(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_87) != -1){ return ; }
	 		if($(this).find('input').html()!=null){ return ;}
	 		if($(this).prev().prev().find('input[name=attendanceName]').val()==""){ return ;}
	 		$(this).wrapInner("<input type='text' value='"+$(this).html()+"' class='input-height cell-input' style='width:40px' />");
			$('#cancelProject').show();	 		
	 	});
	 	
		$('.delShowAttend').die().live('click',function(){
			$(this).parent().parent().remove();
		})
		
		$('.spanLeft').click(function(){ 
			if($("#status").text().indexOf(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_87) != -1){ return ; }
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
			self.showCalendarDetailAction(personId,adminOrgId,personName);
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
					     	  	 shr.showError({message: shr.formatMsg(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_42,[k+1,j])});
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
							if(res.flag ==jsBizMultLan.atsManager_attendancePanelCalculate_i18n_27){
									$('#status').text("");
									$("#status").text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_41);
									$('#auditProject').hide();
								    $('#calculateOneDay').hide();
								    $('#saveProject').hide();
									$('button[id=notAuditProject]').show();
									$('#cancelProject').hide();									
							}
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
							if(res.flag ==jsBizMultLan.atsManager_attendancePanelCalculate_i18n_27){
									$('#status').text("");
									$("#status").text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_40);
									$('button[id=auditProject]').show();
									$('button[id=calculateOneDay]').show();
									$('button[id=notAuditProject]').hide();
									$('#saveProject').show();
									$('#cancelProject').hide();
							}
						}
			 })			
		})
		$('#calculateOneDay').click(function(){
			 var personId=$('#leaveDetail').attr("name");
			 var attendDate=$('#billInfo').attr("name");
			 var personName=$('#personName').attr("name");
			 var adminOrgUnitId =$('#title').attr("name");
					 self.remoteCall({
						type : "post",
						method : "calculatePersonOneDay",
						param : {
							personId : personId,
							attendDate : attendDate
						},
						success : function(res){
							if(res.flag =="1"){
									shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_54});
									self.showBillDetailAction(personName,tDay,personId,adminOrgUnitId);
							}else{
									shr.showError({message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_55});
							}
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
					$(this).wrapInner("<input type='text' style='width:100%;height:100%;padding:1px 3px;' value="+$(this).text()+"></input>");
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
			  	 filterJson.push({'Id':$(this).attr("name"),'lenght':$(this).find("span").eq(1).find("input").val()});
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
							shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_18});
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
			$('#yearInfo').html(
				indexYear + jsBizMultLan.atsManager_attendancePanelCalculate_i18n_80
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
        $('#yearInfo').html(
        	indexYear + jsBizMultLan.atsManager_attendancePanelCalculate_i18n_80
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
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_116,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_120,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_114,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_117,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_118,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_119,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_115
			],
			monthNamesShort : [
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_8,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_9,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_10,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_11,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_12,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_13,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_14,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_15,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_16,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_5,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_6,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_7
			],
			monthNames : [
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_8,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_9,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_10,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_11,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_12,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_13,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_14,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_15,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_16,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_5,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_6,
				jsBizMultLan.atsManager_attendancePanelCalculate_i18n_7
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
					title : personName + " " + tDay+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_0,
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
							+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_87
							+ '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="notAuditProject" value='+ i + '>'
							+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_45
							+ '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="saveProject" >'
							+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_17
							+ '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="cancelProject" >'
							+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_84
							+ '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="calculateOneDay" >'
							+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_61
							+ '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="backToCalendar">'
							+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_48
							+ ' </button></span>'
							+ '<hr style="margin:5px;">'
				    	$('#calendar_info').append(row_fields_work);
						 if(res.flag =="0")
						 {
					    	// ===== ==== 状态
					    	$('#calendar_info').append('<div id="status">'
								+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_39
								+ ' ：'+res.attendStatus+'</div>');
					    	
					    	// ===== ==== 应出勤时数  实际出勤时数
					    	var planReal = res.fixedPlanRealList ;
					    	
					    	self.getFixedPlanRealList(planReal,1);
					    	var shifList= '<div class="smallTitle">' 
					    		+ '<div>'
								+ '<span class="spanRight"><a ref="#" id="punchCardInfo">'
								+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_33
								+ '</a>'
								+ '<div id="punchCardInfoShow" style="position:relative;"></div>' 
								+ '</span>' 
								+ '<span class="spanLeft"></span>'
								+ '</div>'
								+ '</div>'
							var shifList1= '<div class="smallTitle">' 
								+ '<span class="spanRight">'
								+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_75
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
					    		self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_73,0,"");
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
					    		self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_28,0,"");  // 设置标题
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
					    		self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_111,0,"");  // 设置标题
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
					    		self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_83,leaveBillLen,"leaveDetailInfo");
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
						    	self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_30,tripBillLen,"tripDetailInfo");
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
						    	self.getLinkTitleList(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_58,OverTimeBillLen,"overTimeDetailInfo");
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
									+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_97
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
									} 
									attend_json.data=attend;
									showAttendJson = attend_json;
									$('input[name=attendanceName]').shrSelect(attend_json);
									$('.overflow-select').css("max-height","150px").css("overflow-y","auto");
								}	
					    	}
					    	
							if($("#status").text().indexOf(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_53) != -1)
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
							$("div[class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix']").css('border-bottom','0px');
						 }else if(res.flag == "1")
						 {
						 	var status = '<div id="status">'
								+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_38
								+ '</div>' ;
						 	
							$('#calendar_info').append(status);
							if(step ==1){
								$('#auditProject').hide();
								$('#notAuditProject').hide();
								$('#saveProject').hide();
								$('#cancelProject').hide();
								$('#backToCalendar').hide();
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

		jQuery('#reportGrid').jqGrid("setGridParam", { postData: { refresh1: 3 } });
		$("#prev_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	},

	nextPage : function() {
		//refresh = false ;
		jQuery('#reportGrid').jqGrid("setGridParam", { postData: { refresh1: 3 } });
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
			jsBinder.uiObject.rowNumPerPage = reRows ;
			jsBinder.uiObject.getJqgridData(3);
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
	//审核  如果在页面上没有选中行，则提示[是否要审核全部考勤结果]，是，则审核全部，否则退出
  	//如果有选中行，则只是审核选中行的记录
  	processAuditAction:function(){
  		var _self=this;
  		$('button[id^=Calculate]').click(function(){  //审核,反审核
  			
  			if( $("#reportGridWaitCal").html()){//待计算
  				var contentLen = $("#reportGridWaitCal").jqGrid("getRowData").length ;
  				if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_36+mess}); return ;};
  				var sid = $("#reportGridWaitCal").jqGrid("getSelectedRows");
  				var filter=[];
  				if(sid.length>0){
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
  						},
  						success : function(res){
  							closeLoader();
  							if(res.flag=="1")
  							{
  								var mes= jsBizMultLan.atsManager_attendancePanelCalculate_i18n_88;
  								 shr.showInfo({message : mes});
  								 
  								 jQuery('#reportGridWaitCal').trigger("reloadGrid");
  								 //jQuery('#reportGrid').jqGrid("reloadGrid");
  							}else{
  								var mes= jsBizMultLan.atsManager_attendancePanelCalculate_i18n_89;
  								 shr.showInfo({message : mes});
  							}
  						}
  		 		})
  				}else{
  						var mes= jsBizMultLan.atsManager_attendancePanelCalculate_i18n_92;
  						shr.showConfirm(mes,
  						function(){
  							_self.auduitWaitCalAll();
  					});
  				}	  
  				return;
  			}
  			
  			var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
  			var mess = (step==1) ? jsBizMultLan.atsManager_attendancePanelCalculate_i18n_23
				: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_22;
			if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_36+mess}); return ;};
			var sid = $("#reportGrid").jqGrid("getSelectedRows");
			var filter=[];
			if(sid.length>0){
				for ( var i in sid) {
					var item = sid[i];
					var data = $("#reportGrid").jqGrid("getRowData", item);
					if(data['personId']!=undefined ){
						filter.push({"personId":data['personId'],"adminOrgUnitId":data['adminOrgUnitId']});
					}
			  	}
			  	var postData = $.toJSON(filter) ;
			  	var beginDate = $('input[name=beginDate]').val(); 
				var endDate = $('input[name=endDate]').val();
				 openLoader(1);
			  	_self.remoteCall({
					type : "post",
					method : "auditAttendanceRecordSelectFromPage",
					param : {
						beginDate : beginDate,
						endDate : endDate,
						postData:postData,
						step:step
					},
					success : function(res){
						closeLoader();
						if(res.flag="1")
						{
							var mes= (step==1) ? jsBizMultLan.atsManager_attendancePanelCalculate_i18n_88
								: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_46;
							 shr.showInfo({message : mes});
							 
							 jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
							 //jQuery('#reportGrid').jqGrid("reloadGrid");
						}else{
							var mes= (step==1) ? jsBizMultLan.atsManager_attendancePanelCalculate_i18n_89
								: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_47;
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
			}else{
					var mes= (step==1) ? jsBizMultLan.atsManager_attendancePanelCalculate_i18n_92
						: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_91;
					shr.showConfirm(mes,
					function(){
						_self.auduitAttendanceResult();
				});
			}	  
		}),
		$('#tranSalary').click(function(){ //tranSalary   转薪资
	 				var beginDate=window.parent.atsMlUtile.getFieldOriginalValue("beginDate");
					var endDate=window.parent.atsMlUtile.getFieldOriginalValue("endDate");
					var contentLen = $("#reportGrid").jqGrid("getRowData").length ;
					if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_37}); return ;};
					$("#calendar_info").empty();
					$("#calendar_info").next().remove();
					$("#calendar_info").dialog({
						title: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_121,
						width:650,
						height:350,
						modal: true,
						resizable: true,
						position: {
							my: 'center',
							at: 'top+50%',
							of: window
						},
						buttons:[{
							text: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_86,
							click: function() {
								_self.saveDataSalaryAction(); 
							}
						},{
							text: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_50,
							click:function() {
								$(this).dialog( "close" );
							}
						}]
					});
					  var row_fields_work =''
					  +'<div class="photoState" style="margin-top:50px;margin-left:30px;"><table width="100%"><tr>'
					  +'<td width="30%" style="color: #999999;">'
						  + jsBizMultLan.atsManager_attendancePanelCalculate_i18n_69
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
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_107
						+ '</td>'
					  	  +'<td width="15.2%"></td>'
					      +'<td width="10%" ><input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></td>'
						  +'<td width="5.2%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_80
						+ '</td>'
						  +'<td width="8%" style="color: #999999;"><input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td width="5.2%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_110
						+ '</td>'
						  +'<td width="8%"><input type="text" name="time" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td width="5%" style="color: #999999;text-align: center;">'
						+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_31
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
	 //  ==========  allAttendCaculate  selectAttendCaculate ===  考勤计算   (已计算人员的考勤计算和未计算人员的考勤计算)
	 //	  选中状况下的已计算人员的考勤计算和未计算人员的考勤计算区别在于弹不弹出框，发送的都是人和开始结束时间，是否取卡
	 //				未计算人员的考勤计算不需要取卡,直接算     modify 2015/1/7  未计算人员需要取卡
	 //  未选中状况下的已计算人员的考勤计算和未计算人员的考勤计算区别后台执行的sql 语句不同，获取人的条件不同			
		$('#allAttendCaculate').click(function(){
			
			if($("#grid").html()){  _self.CalAllAction(); return ;	} // 未计算人员点击全部计算，就不需要弹出对话框
			_self.showCalDialogAction("",0);
		}),
		$('#selectAttendCaculate').click(function(){
			var $grid = $("#reportGrid");
			var personIndex = '' ;
			if( $("#reportGrid").html() ){
				$grid = $("#reportGrid") ;
				personIndex = 'personId' ;
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
			if(len > 0){
				for ( var i in sid) {
					var item = sid[i];
					var data =  $grid.jqGrid("getCell", item,personIndex);
					//var data = $grid.jqGrid("getRowData", item);
					if(data !=undefined ){
						if(personStr.length > 0)
						{
							personStr +=",";
						}
						personStr += data;	
					}
					//filter.push({"personId":data['personId'],"adminOrgUnitId":data['adminOrgUnitId']});
			  	}
			}else{
				shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_76});
			 	return ;
			}
			if( $("#grid").html() ){ // 未计算人员点击计算选中行，就不需要弹出对话框
				_self.selectCalAction(personStr,len);
				return ;
			}
			_self.showCalDialogAction(personStr,len);
		}),
		
		//查看后台事务
		$('#viewTransaction').click(function(){
			var url =  shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.base.job.app.JobInst.list";
			$("#dialogTransaction").children("iframe").attr('src', url);
			$("#dialogTransaction").dialog({
				width:950,
		 		height:650,
				modal: true,
				resizable: false,
				draggable: true,
				position: {
					my: 'center',
					at: 'top+15%',
					of: window
				}
			})
			//ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix
			//$(".ui-dialog-titlebar").remove();
			//$("#dialogTransaction").parent().find('.ui-dialog-titlebar').remove(); // 只是删除 查看后台事务
			$("#dialogTransaction").css({height:570})
		})
  	},
  	
  	//流程单据查询
  	workFlowBillsCheckedEvent : function (){
  		var _self = this;
  		var billTabs = '<div id="billTabs" >'
			+ '	<ul>'
			+ '	<li><a id="leaveBill">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_81
			+ '</a></li> '
			+ '	<li><a id="tripBill">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_29
			+ '</a></li> '
			+ '	<li><a id="otBill">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_57
			+ '</a></li> '
			+ '	<li><a id="fillCardBill">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_21
			+ '</a></li> '
			+ '	<li><a id="cancelLeaveBill">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_82
			+ '</a></li> '
			+ '	</ul>'
			+ '</div>';

  		$('#workFlowBillsChecked').unbind().bind('click',function(){
  			$("#pageTabs").hide();
  			_self.getAtsCalGobalParam();
  			$("#subTitle").remove();
  			$("#addspan").remove();
  			$("div[id=currentTile]").css({"font-size":"16px!important","color":"#0088cc","cursor":"pointer"});
  			$('<span id="addspan" style="padding:0 5px;color:#ccc">/</span>').appendTo($("div[id=currentTile]"));
  			$('<div id="subTitle" class="active" style="float:left;font-size:16px;padding-top:10px;color:#999;">'
				+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_90
				+ '</div>').insertAfter($("div[id=currentTile]"));
  			$("div[id=currentTile]").click(function(){
  				$(".index").eq(step-1).trigger("click");
			}) ;
  			
  			openLoader(1);
	  	 	var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList$page','view');	
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
					$('#tripBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsTripBillAllList$page','view');
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(1);
								_self.headOfPageRemove();
							}
						});
					});
					$('#leaveBill').unbind().bind('click',function(){	
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList$page','view');
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(0);
								_self.headOfPageRemove();
							}
						});
						
					});
					$('#otBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllList$page','view');
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(2);
								_self.headOfPageRemove();
							}  
						});
					});
					$('#fillCardBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.FillSignCardAllList$page','view');
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(3);
								_self.headOfPageRemove();
							}
						});
					});
					$('#cancelLeaveBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.CancelLeaveBillAllList$page','view');
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								$('#responseBody').append(response);
								_self.billTabsFormatter(4);
								_self.headOfPageRemove();
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
	//$(".span6.offset0").empty();
	//$(".span9.offset0").empty();
  		$("#breadcrumb").remove();
  		$(".span9.offset0").empty();
  		$(".wz_content").css("overflow-y","auto");
//  		$(".span3.offset0").css('float','right');
  	},
  	//检测计算的开始时间和结束时间是不是在周期范围之内
  	valiCalculateDateRange:function(){
  		var realBeginDate= new Date(atsMlUtile.getFieldOriginalValue("realBeginDate"));
		var realEndDate = new Date(atsMlUtile.getFieldOriginalValue("realEndDate"));
		var beginDate = new Date($('input[name=beginDate]').val());
		var endDate   = new Date($('input[name=endDate]').val());
		if(realBeginDate.getTime()>realEndDate.getTime()){
			shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_63});
  			return false ;
		}

  		if(beginDate.getTime()<=realBeginDate.getTime() && endDate.getTime()>=realEndDate.getTime()){ // 检测计算的开始时间和结束时间是不是在周期范围之内
			return true ;
  		}else{
  			shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_64});
  			return false ;
  		}
  	},	 		
  	showCalDialogAction : function(personStr,len){
  			var _self = this;
			$("#calendar_info").empty();
			$("#calendar_info").next().remove(); // button
			$("#calendar_info").dialog({
					title: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_113,
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
						text: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_86,
						click: function() {
							// 检测计算的开始时间和结束时间是不是在周期范围之内
							if(_self.valiCalculateDateRange())
							if(len > 0){
								if( $("#reportGrid").html()){
									_self.selectCalAction(personStr,len);
								}else if( $("#reportGridWaitCal").html()){
									_self.selectedWaitCalAction(personStr,len);
								}
							}else{
								_self.CalAllAction();
							} 
						}
					},{
						text: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_50,
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
				+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_93
				+ '</div>'
				+'<div style=" margin-top: 19px;">'
				+'<div style=" float:left;" class="field_label">'
				+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_60
				+ '</div><div  style=" float:left; margin-right: 15px;"><input id="realBeginDate" type="text" class="block-father input-height"/></div>'
				+'<div style=" float:left;" class="field_label">'
				+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_59
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
			$(".ui-datepicker-frame").css("width","130px").css("background-color","#d9edf7 !important");
			$(window).resize();
  	},
  	
  	selectedWaitCalAction:function(personStr,len){//待计算计算选中行
			var _self=this;
			var sid = $("#reportGridWaitCal").jqGrid("getSelectedRows");
			var cardLen = $('input[name="isAgainFetchCard"]:checked').length ;
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
					var mes= jsBizMultLan.atsManager_attendancePanelCalculate_i18n_54;
					shr.showInfo({message : mes});
					 
					jQuery('#reportGridWaitCal').trigger("reloadGrid");
					//jQuery('#reportGrid').jqGrid("reloadGrid");
				}else{
					var mes= jsBizMultLan.atsManager_attendancePanelCalculate_i18n_55;
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
							shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_108});
						}else if(res.flag == 2){
							shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_35});
						}else{
							shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_66});
						}
					},
					error:function(){
						closeLoader();
						shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_66});
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
							shr.showInfo({message : jsBizMultLan.atsManager_attendancePanelCalculate_i18n_65});
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
					shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_62});
				}else if(res.flag == 2){
					shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_35});
				}else{
					shr.showError({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_66});
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
  		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var proposerId = $('input[name=proposer]').val();
		var self=this; 
		 openLoader(1);
		 self.remoteCall({
				type : "post",
				method : "auduitWaitCalAll",
				param : {
					beginDate : beginDate,
					endDate : endDate,
					proposerId:proposerId,
					orgLongNum:orgLongNum,    
					attendPolicyId:attendPolicyId,  //考勤制度
					attendanceGroupID:attendanceGroupID,
				},
				success : function(res){
					closeLoader();
					if(res.flag=="1")
					{
						var mes=jsBizMultLan.atsManager_attendancePanelCalculate_i18n_88;
						 shr.showInfo({message : mes});
						 jQuery('#reportGridWaitCal').trigger("reloadGrid");
						 //jQuery('#reportGrid').jqGrid("reloadGrid"); 
					}else{ 
						var mes=jsBizMultLan.atsManager_attendancePanelCalculate_i18n_89;
						shr.showInfo({message : mes});
					}
				}
	 		})	
  	
  	},
  	
  	auduitAttendanceResult:function(){ // 审核  和反审核 根据step 区分
  		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var proposerId = $('input[name=proposer]').val();
		var self=this; 
		 openLoader(1);
		 self.remoteCall({
				type : "post",
				method : "auditAttendanceRecordFromPage",
				param : {
					beginDate : beginDate,
					endDate : endDate,
					proposerId:proposerId,
					orgLongNum:orgLongNum,    
					attendPolicyId:attendPolicyId,  //考勤制度
					attendanceGroupID:attendanceGroupID,
					attendPeriodId:attendPeriodId,	//考勤周期
					step:step
				},
				success : function(res){
					closeLoader();
					if(res.flag=="1")
					{
						var mes= (step==1) ? jsBizMultLan.atsManager_attendancePanelCalculate_i18n_88
							: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_46;
						 shr.showInfo({message : mes});
						 jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
						 //jQuery('#reportGrid').jqGrid("reloadGrid"); 
					}else{ 
						var mes= (step==1) ? jsBizMultLan.atsManager_attendancePanelCalculate_i18n_89
							: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_47;
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
  	saveDataSalaryAction:function(){
  		var that = this;
  		var beginDate = $('input[name=beginDate]').val();
		var endDate = $('input[name=endDate]').val();
		var attendancePeriod = $('#setSalaryPeriod').text();
		if(attendancePeriod == ""){
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_70});
			return false;
		}
		var periodYear = $('input[name=YEAR]').val();
		var periodMonth = $('input[name=MONTH]').val();
		var times = $('input[name=time]').val();
		var proposerId = $('input[name=proposer]').val();
		if (periodYear == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_105});
			return false;
		}
		if (periodMonth == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_106});
			return false;
		}
		if (times == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_32});
			return false;
		}
		var  salaryPeriod=periodYear+"-"+periodMonth+"-"+times;
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
		 shr.remoteCall({
				type:"post", 
				url:url, 
				method:"save",
				param : {
							PersonJson : PersonJson,
							beginDate : beginDate,
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
			    //window.parent.$("#operationDialog").dialog('close');
					$("#calendar_info").dialog("close");
					if (res.flag == 1){
						var tip ="";	
						if(res.List!= null)
						{
							
							var len = res.List.length ;
							if(len > 0){
								tip =jsBizMultLan.atsManager_attendancePanelCalculate_i18n_122;
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
							    tip +=jsBizMultLan.atsManager_attendancePanelCalculate_i18n_124;
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
						shr.showInfo({message: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_123});
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
			 if(index == 1){punchCarStr.push(juicer(smalTitlePattern,{className : "smallTitle1",colName: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_99}));};
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
			 if(index == 1){punchCarStr.push(juicer(smalTitlePattern,{className : "smallTitle1",colName: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_99}));};
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
			 if(index == 1){punchCarStr.push(juicer(smalTitlePattern,{className : "smallTitle1",colName: jsBizMultLan.atsManager_attendancePanelCalculate_i18n_99}));};
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
  	 		attendanceGroupID : attendanceGroupID　
  	 	};
  	 }
  	//隐藏查询项，页签样式修改
  	 ,queryDivInit : function () {
		var temp='<div id="pageTabs" >';
		temp += '<ul>';
		temp += '<li><a id="calAttendPersonList">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_109
			+ '</a></li>';
		temp += '<li><a id="waitCalAttendPersonList">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_34
			+ '</a></li>';
		temp += '<li><a id="noneCalAttendPersonList">'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_98
			+ '</a></li>';
		temp += '</ul>';
		temp += '</div>';
		if($("#pageTabs").length==0){
			//$("#home-container").append(temp);
			var div=document.createElement("div");
			div.id="sidebar";
			var sidebar=document.getElementById("home-wrap");
			sidebar.parentNode.insertBefore(div,sidebar);
			$("#sidebar").append(temp).hide();
		}
		$("#queryDiv").append('<div><a title="'
			+ jsBizMultLan.atsManager_attendancePanelCalculate_i18n_94
			+ '" id="packUp" href="#" class="packUp"></a></div>');
//		$("#queryDiv").append('<div><button type="button" class="shrshrbtn-primary shrbtn" name="确定" id="confirmQuery">确定</button></div>');
		transition=$("#queryDiv").css("height");
  		$("#queryDiv").css({"height":"0px","overflow":"hidden"});
//  	$("#datagrid").css({"border-left":"1px solid #ddd"});
  		$("#confirmQuery").css({"float":"right","margin-top":"-28px"});
		$("#pageTabs").addClass("notice-tit");
		$("#dataBox").addClass("notice-con");
		$("div[class^='col-lg-2']").css({width:"4%"});
		$(".col-lg-4").css({width: "12%"});
		
		$(document).bind("click", function (){ 
			if($('#DisplayDetail').html()){
				$("#detail").text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_79);
				$("#DisplayDetail").fadeOut("normal",function(){
					$("#DisplayDetail").empty();
				});
			}
			if($('#DisplayResult').html()){
				$("#summary").text(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_52);
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
  	 
});

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
	
	if (value.substring(0, jsBizMultLan.atsManager_attendancePanelCalculate_i18n_4.length)
		== jsBizMultLan.atsManager_attendancePanelCalculate_i18n_4) {
		if(flag){
			$(_self).addClass('gray-color');
		}
		return value.substring(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_4.length);
	}
	else if (value.substring(0, jsBizMultLan.atsManager_attendancePanelCalculate_i18n_2.length)
		== jsBizMultLan.atsManager_attendancePanelCalculate_i18n_2) {
		if(flag){
			$(_self).addClass('litterGreen-color');	
		}
		return value.substring(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_2.length);
	}
	else {
		if (value.indexOf(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_3) > -1) {
			return value.substring(jsBizMultLan.atsManager_attendancePanelCalculate_i18n_3.length);
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
