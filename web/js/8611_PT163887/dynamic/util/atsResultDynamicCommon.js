(function($) {
jQuery.attenceCalCommon={
	//全部计算弹出框
	showCalDialogAction : function(that,calculateFun,args){
		var _self = this;
		if(!_self.getFilterParamValues("dateSet.date")){
			return;
		}
	
		$("#calendar_info").empty();
		$("#calendar_info").next().remove(); // button
		$("#calendar_info").dialog({
				title: $.attendmanageI18n.atsResultDynamicCommon.title,
				width:513,
				height:290,
				modal: true,
				resizable: false,
				position: {
					my: 'center',
					at: 'top+50%',
					of: window
				},
				buttons: [{
					text: $.attendmanageI18n.atsResultDynamicCommon.btn_text1,
					click: function() {
						// 检测计算的开始时间和结束时间是不是在周期范围之内
						if(_self.valiCalculateDateRange()){
							//全部计算
							//_self.getBatchCalHandler(that,that.CalAllAction);
							_self.getBatchCalHandler(that,calculateFun,args);
						}
					}
				},{
					text: $.attendmanageI18n.atsResultDynamicCommon.btn_text2,
					click: function(){
						$(this).dialog("close");
						$("#calendar_info").empty();
					}
				}],
				close : function() {
					$("#calendar_info").empty();
				}	
		});
		
		var addWorkString ='<div style="margin: 34px 0px 34px 0px;">'
			+'<div style="display: flex; ">'
			+'<div><input type="checkbox" id="isAgainFetchCard" name="isAgainFetchCard" checked="checked" value="1" dataextenal="" style=" float: left; ; margin-left: 68px; ">'
			+'<div style="display:inline-block;padding-left: 10px;line-height: 22px;text-overflow: ellipsis;overflow: hidden;color: #808080;font-size: 12px;padding-right: 20px;text-align: left;">' 
			+ $.attendmanageI18n.atsResultDynamicCommon.text1 
			+ '</div></div>'
			+'<div id="isCalUnOffWorkDiv">'
			+'<input type="checkbox" id="isCalUnOffWork" name="isCalUnOffWork" value="1" dataextenal="" style=" float: left; ; margin-left: 68px; ">'
			+'<div style="padding-left: 10px;text-align: left;line-height: 22px;text-overflow: ellipsis;overflow: hidden;color: #808080;font-size: 12px;text-align: right;padding-right: 20px;">' 
			+ $.attendmanageI18n.atsResultDynamicCommon.text2 
			+ '</div></div>'
			+'</div>'
			+'<div id="allCalculateDatePicker" style=" margin-top: 19px;margin-left: 34px;">'
			+'<div style="float:left;line-height: 22px;text-overflow: ellipsis;overflow: hidden;color: #808080;font-size: 12px;text-align: right;padding-right: 20px;">' 
			+ $.attendmanageI18n.atsResultDynamicCommon.text3 
			+ '</div><div  style=" float:left; margin-right: 15px;"><input id="realBeginDate" type="text" class="block-father input-height"/></div>'
			+'<div style="float:left;line-height: 22px;text-overflow: ellipsis;overflow: hidden;color: #808080;font-size: 12px;text-align: right;padding-right: 20px;" >' 
			+ $.attendmanageI18n.atsResultDynamicCommon.text4 
			+ '</div><div  style=" float:left; margin-right: 15px;"><input id="realEndDate" type="text" class="block-father input-height"/></div>'
			+'</div>'
			+'</div>' ;
			
		$("#calendar_info").append(addWorkString);
		
		$("#realBeginDate").shrDateTimePicker({ctrlType: "Date",isAutoTimeZoneTrans:false});
		$("#realEndDate").shrDateTimePicker({ctrlType: "Date",isAutoTimeZoneTrans:false});
		
		//处理日期
		_self.processDateChange();
		
	  	$("#allCalculateDatePicker").find(".ui-datepicker-frame").css("width","130px").css("background-color","#d9edf7 !important");
		$(window).resize();
	},
	//全部计算公共处理方法
	getBatchCalHandler:function(that,calculateFun,args){
		var _self = this;
		var dateObj = this.getFilterParamValues("dateSet.date");
		var beginDate = dateObj["startDate"];
		var endDate = dateObj["endDate"];
  		var handler2 = new Handler();
  		handler2.handle = function(){
  			    var personNum = 0;
  			    var day = 0;
  			    if(args!=undefined && args.length==2){
  			    	personNum = args[1];
  			    }else{
  			    	//总记录数
					if($(".ui-paging-info").html().split("/").length>1){
		    			personNum = parseInt($(".ui-paging-info").html().split("/")[1].replace(",",""));  			    		
		    		}
  			    }
  			    if(new Date(beginDate)>new Date().getTime() && new Date(beginDate)<new Date().getTime() ){
  			    	day = parseInt((new Date().getTime()-new Date(beginDate).getTime())/(3600*24*1000)) + 1;
  			    }else if(new Date(endDate)<=new Date().getTime() ){
  			    	day = (new Date(endDate).getTime()-new Date(endDate).getTime())/(3600*24*1000) + 1;
  			    }
	  			if( personNum*day > 15000){
	  				shr.showConfirm($.attendmanageI18n.atsResultDynamicCommon.msg1, function() {
	  					calculateFun.apply(that, args);  
					});
	  			}else{
	  				calculateFun.apply(that, args);  
	  			}
  			}
  		var handler1 = new Handler(handler2);

  		handler1.handle = function(){
  			    var self =this;
				var instNum = _self.getRunningInstSum();
				if(instNum>0 && instNum<3){
					shr.showConfirm(shr.formatMsg($.attendmanageI18n.atsResultDynamicCommon.msg2, [instNum]), function() {
						Handler.prototype.handle.call(self);
					});
				}else if(instNum>=3){
					shr.showConfirm(shr.formatMsg($.attendmanageI18n.atsResultDynamicCommon.msg3, [instNum]), function() {
						Handler.prototype.handle.call(self);
					});
				}else{
					 Handler.prototype.handle.call(self);
				}
  			};

		handler1.handle();
  	},
	//检测计算的开始时间和结束时间是不是在周期范围之内
  	valiCalculateDateRange:function(){
  		var realBeginDate= new Date(atsMlUtile.getFieldOriginalValue("realBeginDate"));
		var realEndDate = new Date(atsMlUtile.getFieldOriginalValue("realEndDate"));
		var dateObj = this.getFilterParamValues("dateSet.date");
		var beginDate = new Date(dateObj["startDate"]);
		var endDate   = new Date(dateObj["endDate"]);
		if(realBeginDate.getTime()>realEndDate.getTime()){
			shr.showError({message: $.attendmanageI18n.atsResultDynamicCommon.msg4});
  			return false ;
		}

  		if(beginDate.getTime()<=realBeginDate.getTime() && endDate.getTime()>=realEndDate.getTime()){ // 检测计算的开始时间和结束时间是不是在周期范围之内
			return true ;
  		}else{
  			shr.showError({message: $.attendmanageI18n.atsResultDynamicCommon.msg5});
  			return false ;
  		}
  	},
  	isIncludeToday: function(beginDate,endDate){
  		var _self = this;
  		var dateObj = _self.getFilterParamValues("dateSet.date");
  		if(!beginDate || !endDate){
			beginDate = dateObj["startDate"];
			endDate = dateObj["endDate"];
  		}
  		if(beginDate && endDate){
  			var realBeginDate= new Date(beginDate.replace(/\-/g, '/'));
			var realEndDate = new Date(endDate.replace(/\-/g, '/'));
	  		if(new Date().getTime()<=realEndDate.getTime() && new Date().getTime()>=realBeginDate.getTime()){ // 检测计算的开始时间和结束时间是不是在周期范围之内
				return true ;
	  		}
  		}
  		return false ;
  	},
  	processDateChange: function(){
  		var _self = this;
  		var dateObj = _self.getFilterParamValues("dateSet.date");
		var beginDate = "";
		var endDate = "";
  		if(dateObj && dateObj["startDate"]){
  			beginDate = dateObj["startDate"];
			endDate = dateObj["endDate"];
  		}else {
  			var atsPeriodObj = this.getAttendancePeriod(this.getFilterParamValues("attendancePeriod"));
  			beginDate = atsPeriodObj.startDate;
			endDate = atsPeriodObj.endDate;
  		}
		atsMlUtile.setTransDateTimeValue("realBeginDate",beginDate);
		if(beginDate && new Date(beginDate.replace(/\-/g, '/') + " 23:59:59") < new Date() && endDate && _self.isIncludeToday() && new Date(endDate.replace(/\-/g, '/') + " 23:59:59") > new Date()){
			var preDate = new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000);
			var month = (preDate.getMonth()+1) > 9 ? (preDate.getMonth()+1) : ("0"+(preDate.getMonth()+1));
			var day = (preDate.getDate()) > 9 ? (preDate.getDate()) : ("0"+(preDate.getDate()));
			atsMlUtile.setTransDateTimeValue("realEndDate",preDate.getFullYear()+ "-" +month+ "-" + day);
		}else{
			atsMlUtile.setTransDateTimeValue("realEndDate",endDate);
		}
		if(new Date(atsMlUtile.getFieldOriginalValue("realEndDate").replace(new RegExp("-","gm"),"/")+ " 23:59:59").getTime() < new Date().getTime()){
			$("#isCalUnOffWorkDiv").css("display","none");
		}
		
//  	  $("#isCalUnOffWork").change(function(){
//			var preDate = null;
//			if(_self.isIncludeToday(_self.getFilterParamValues("dateSet.date")["startDate"],_self.getFilterParamValues("dateSet.date")["endDate"])){
//				if($("#isCalUnOffWork").attr("checked")){
//					preDate = new Date();
//				}else {
//					var endDate = _self.getFilterParamValues("dateSet.date")["endDate"];
//					if(endDate && new Date(endDate + " 23:59:59") > new Date()){
//						preDate = new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000);
//					}else {
//						preDate = new Date(endDate);
//					}
//				}
//				var month = (preDate.getMonth()+1) > 9 ? (preDate.getMonth()+1) : ("0"+(preDate.getMonth()+1));
//				$("#realEndDate").val(preDate.getFullYear()+ "-" +month+ "-" + preDate.getDate());
//			}
//	  	});
	  	
	  	$("#realEndDate").change(function(){
	  		var currentDate = new Date();
	  		var month = (currentDate.getMonth()+1) > 9 ? (currentDate.getMonth()+1) : ("0"+(currentDate.getMonth()+1));
	  		var day = (currentDate.getDate()) > 9 ? (currentDate.getDate()) : ("0"+(currentDate.getDate()));
	  		var currentDateStr = currentDate.getFullYear()+ "-" +month+ "-" + day;
	  		if(atsMlUtile.getFieldOriginalValue("realEndDate") >= currentDateStr){
				$("#isCalUnOffWorkDiv").css("display","");
	  		}else {
	  			$("#isCalUnOffWork").attr("checked",false);
	  			$("#isCalUnOffWorkDiv").css("display","none");
	  		}
	  	});
  	},
  //获取快速过滤参数值
	getFilterParamValues: function(paramName){
		var paramValues = "";
		var fastFilterItems  = $.shrFastFilter.getFastFilterItems();
		if (fastFilterItems) {
			if(fastFilterItems[paramName]){
				paramValues = fastFilterItems[paramName]["values"];
			}
		}
		if(!paramValues && paramName == "dateSet.date"){
			var atsPeriodObj = this.getAttendancePeriod(this.getFilterParamValues("attendancePeriod"));
			return atsPeriodObj;
		}
		return paramValues;
	},
	//根据考勤周期ID获取考勤周期明细 
  	getAttendancePeriod:function(attendancePeriodId){
  		var self = this;
  		var atsPeriod = null;
  		if( attendancePeriodId && attendancePeriodId != "")
  		{
  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryResultHelper&method=getAttendancePeriod&attendancePeriodId="+encodeURIComponent(attendancePeriodId);
			 shr.ajax({
					type:"post",
					async:false,  
					url:url, 
					success : function(res){
						if(res && res.length > 0){
							atsPeriod = res[0];
						}
	 				}
		 	});
  		}
  		return atsPeriod;
  	},
  	getRunningInstSum:function(){   
 		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=getRunningInstSum';
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
 	},
 	/**
 	 * 查看后台事务进行中的count
 	 */
 	initviewTransaction: function(params){
		//查看后台事务
 		var count = 0;
 		var _self = this;
 		var beginDate = null;
		var endDate = null;
		if(_self.getFilterParamValues(params)){
	 		beginDate = _self.getFilterParamValues(params)["startDate"];
	  	 	endDate = _self.getFilterParamValues(params)["endDate"];
		}
		
  	 	//页面进入时赋值
			var serviceId = shr.getUrlRequestParam("serviceId");
//  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=getTransactionCount&beginDate="+beginDate+"&endDate="+endDate+"&serviceId="+encodeURIComponent(serviceId);
  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=getTransactionCount&serviceId="+encodeURIComponent(serviceId);
			 shr.ajax({
					type:"post",
					async:true,  
					url:url, 
					success : function(res){
						if(res && res.count > 0){
							$("#transactionCount").html(res.count);
							if($("#transactionCount").html().length<=2){
								$("#transactionCount").attr("style","left: 86%;");
							};
						}
	 				}
		 	});
			
		
  	 	
  	 	
  	 	
  	 	//绑定点击事件
//		$('#transactionCount').click(function(){
//			var serviceId = shr.getUrlRequestParam("serviceId");
////  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=getTransactionCount&beginDate="+beginDate+"&endDate="+endDate+"&serviceId="+encodeURIComponent(serviceId);
//  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=getTransactionCount&serviceId="+encodeURIComponent(serviceId);
//			 shr.ajax({
//					type:"post",
//					async:false,  
//					url:url, 
//					success : function(res){
//						if(res && res.count > 0){
//							$("#transactionCount").html(res.count);
//							if($("#transactionCount").html().length<=2){
//								$("#transactionCount").attr("style","left: 86%;");
//							};
//						}
//	 				}
//		 	});
//			
//		})
//		return count;
	},
	getCurrentMonthFirstDate: function (){
        var date = new Date();
        date.setDate(1);
        var month = parseInt(date.getMonth()+1);
        var day = date.getDate();
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        return date.getFullYear() + '-' + month + '-' + day;
    },
    getCurrentMonthLastDate: function(){
        var date=new Date();
        var currentMonth=date.getMonth();
        var nextMonth=++currentMonth;
        var nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
        var oneDay=1000*60*60*24;
        var lastTime = new Date(nextMonthFirstDay-oneDay);
        var month = parseInt(lastTime.getMonth()+1);
        var day = lastTime.getDate();
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
    	}
       return date.getFullYear() + '-' + month + '-' + day;
     },
	/**
	 * 查看未参与考勤计算的count
	 */
	initWorkFlowBillsCheckedCount: function(beginDate, endDate){
		//查看后台事务
		var count = 0;
		var _self = this;
// 		var beginDate = '';
//		var endDate = '';
//		if(_self.getFilterParamValues(params)){
//	 		beginDate = _self.getFilterParamValues(params)["startDate"];
//	  	 	endDate = _self.getFilterParamValues(params)["endDate"];
//		}
		
		if(!beginDate || !endDate || beginDate == "" || endDate == ""){
			beginDate = _self.getCurrentMonthFirstDate();
	  	 	endDate = _self.getCurrentMonthLastDate();
		}
  	 	//页面进入时赋值
  	 	
		var serviceId = shr.getUrlRequestParam("serviceId");
  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=getWorkFlowBillsCheckedCount&serviceId="+encodeURIComponent(serviceId)+"&beginDate="+beginDate+"&endDate="+endDate;
			 shr.ajax({
					type:"post",
					async:true,  
					url:url, 
					success : function(res){
						if(res && res.count > 0){
							$("#billCount").html(res.count);
							if(!$("#billCount") || !$("#billCount").html()){
								return;
							}
							if($("#billCount").html().length<=2){
								$("#billCount").attr("style","left: 86%;");
							};
						}
	 				}
		 	});
			
		
  	 	//绑定点击事件
//		$('#billCount').click(function(){
//			var serviceId = shr.getUrlRequestParam("serviceId");
////  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=getWorkFlowBillsCheckedCount&beginDate="+beginDate+"&endDate="+endDate+"&serviceId="+encodeURIComponent(serviceId);
//  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=getWorkFlowBillsCheckedCount&serviceId="+encodeURIComponent(serviceId);
////  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=getBillCount&beginDate="+beginDate+"&endDate="+endDate+"&serviceId="+encodeURIComponent(serviceId);
//			 shr.ajax({
//					type:"post",
//					async:false,  
//					url:url, 
//					success : function(res){
//						if(res && res.count > 0){
//							$("#billCount").html(res.count);
//							if($("#billCount").html().length<=2){
//								$("#billCount").attr("style","left: 86%;");
//							};
//						}
//	 				}
//		 	});
//			
//		})
//		return count;
	},
 	initClickEvent: function(dateName){
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
				draggable: false,
				position: {
					my: 'center',
					at: 'center',
					of: window
				}
			})
			$("#dialogTransaction").css({height:750})
		})
		//未参与计算单据
		this.workFlowBillsCheckedEvent(dateName);
	},
	getAtsCalGobalParam : function (dateName){
		var _self = this;
		var dateObj = _self.getFilterParamValues(dateName);
		var beginDate,endDate;
		if(dateObj && dateObj.startDate){
	  	 	atsCalGobalParam = {
	  	 		beginDate : _self.getFilterParamValues(dateName)["startDate"],
	  	 		endDate : _self.getFilterParamValues(dateName)["endDate"]
	  	 	};
		}else if(dateObj){
  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryResultHelper&method=getAttendancePeriod&attendancePeriodId="+encodeURIComponent(dateObj);
			 shr.ajax({
					type:"post",
					async:false,  
					url:url, 
					success : function(res){
						if(res && res.length > 0){
							beginDate = res[0].startDate;
							endDate = res[0].endDate;
						}
	 				}
		 	});
		 	atsCalGobalParam = {
		 		beginDate : beginDate,
	  	 		endDate : endDate
		 	}
		}
  	 },
	//未参与计算单据
  	workFlowBillsCheckedEvent : function (dateName){
  		var _self = this;
  		var billTabs = '<div id="billTabs" style="width:100%;max-height:50px;">'
						+ '	<ul>'
						+ '	<li><a id="leaveBill">' 
						+ $.attendmanageI18n.atsResultDynamicCommon.text5 
						+ '</a></li> '
						+ '	<li><a id="tripBill">' 
						+ $.attendmanageI18n.atsResultDynamicCommon.text6 
						+ '</a></li> '
						+ '	<li><a id="otBill">' 
						+ $.attendmanageI18n.atsResultDynamicCommon.text7 
						+ '</a></li> '
						+ '	<li><a id="fillCardBill">' 
						+ $.attendmanageI18n.atsResultDynamicCommon.text8 
						+ '</a></li> '
						+ '	<li><a id="cancelLeaveBill">' 
						+ $.attendmanageI18n.atsResultDynamicCommon.text9
						+ '</a></li> '
						+ '	<li><a id="canTripBill">' 
						+ $.attendmanageI18n.atsResultDynamicCommon.text10
						+ '</a></li> '
						+ '	</ul>'
						+ '</div>';
			
			
  		$('#workFlowBillsChecked').unbind().bind('click',function(){
  			$("#pageTabs").hide();
  			_self.getAtsCalGobalParam(dateName);
  			//_self.saveQueryFilterParam();
  			
  			_self.initBreadCrumb();
  			$("#breadcrumb").find("li.active").html($.attendmanageI18n.atsResultDynamicCommon.text11);
  			$('<li><a href="#">'
  					+ $.attendmanageI18n.atsResultDynamicCommon.text12 
  					+ '</a> <span class="divider">/</span></li>').insertBefore($("#breadcrumb").find("li.active"));
  			$("#breadcrumb").find("li").eq(1).find('a').click(function(){
  				var serviceUrl = "com.kingdee.eas.hr.ats.app.AttenceResultSum.list";
				if(currentCalUrl || currentCalUrl != ""){
					serviceUrl = currentCalUrl;
				}else {
					serviceUrl = shr.attenceCalCommon.getAtsCalServiceUrl();
				}
  				window.parent.parent.location = shr.getContextPath() + "/dynamic.do?uipk="+serviceUrl+"&inFrame=true&serviceId="+encodeURIComponent(serviceId);
			}) ;

	  	 	var serviceId = shr.getUrlRequestParam("serviceId");			
			
	  	 	if(!dateName || dateName == ""){
	  	 		dateName = "dateSet.date";
	  	 	}
	  	 	var dateObj = _self.getFilterParamValues(dateName);
	  	 	var parentBeginDate = "";
		  	var parentEndDate="";
	  	 	if(dateObj){
		  	 	parentBeginDate = dateObj["startDate"];
		  	 	parentEndDate = dateObj["endDate"];
	  	 	}else {
	  	 		parentBeginDate = _self.getCurrentMonthFirstDate();
	  	 		parentEndDate = _self.getCurrentMonthLastDate();
	  	 	}
	  	 	ats_beginDate = parentBeginDate;
	  	 	ats_endDate = parentEndDate ;
	  	 	
	  	 	
				$("#searcher").remove();

  			openLoader(1);
	  	 	var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList$page','view',{beginDate:parentBeginDate,endDate:parentEndDate});	
			url += '&serviceId='+encodeURIComponent(serviceId);
	  	 	shr.loadHTML({ 
				url : url,
				async: false,
				success : function(response) {
					
					closeLoader();
					$('.view_manager_body').empty();
					$('.view_manager_body').append(billTabs);
					$('.view_manager_body').append("<div id='responseBody' style='width:100%;position: absolute; top: 100px;'></div>");
					_self.billTabsFormatter(0);
					$('#responseBody').append(response);
					
					
					$('#billTabs #tripBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsTripBillAllList$page','view',{beginDate:beginDate,endDate:endDate});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								_self.billTabsFormatter(1);
								$('#responseBody').append(response);
								_self.headOfPageRemove();
								$(".ui-pg-selbox").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
								$('#responseBody .view_manager_body').css("margin-top","40px");
								//设置高度
								$(".view_list .view_manager_header .span6").css("min-height","0px");
								$(".view_list .view_manager_header .span6").css("height","0px");
								$(".view_list .view_manager_header .span12").css("height","30px");
							}
						});
					});
					$('#billTabs #leaveBill').unbind().bind('click',function(){	
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList$page','view',{beginDate:beginDate,endDate:endDate});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								_self.billTabsFormatter(0);
								$('#responseBody').append(response);
								_self.headOfPageRemove();
								$(".ui-pg-selbox").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
								$('#responseBody .view_manager_body').css("margin-top","40px");
								//设置高度
								$(".view_list .view_manager_header .span6").css("min-height","0px");
								$(".view_list .view_manager_header .span6").css("height","0px");
								$(".view_list .view_manager_header .span12").css("height","30px");
							}
						});
						
					});
					$('#billTabs #otBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllList$page','view',{beginDate:beginDate,endDate:endDate});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								_self.billTabsFormatter(2);
								$('#responseBody').append(response);
								_self.headOfPageRemove();
								$(".ui-pg-selbox").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
								$('#responseBody .view_manager_body').css("margin-top","40px");
								//设置高度
								$(".view_list .view_manager_header .span6").css("min-height","0px");
								$(".view_list .view_manager_header .span6").css("height","0px");
								$(".view_list .view_manager_header .span12").css("height","30px");
							}  
						});
					});
					$('#billTabs #fillCardBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.FillSignCardAllList$page','view',{beginDate:beginDate,endDate:endDate});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								_self.billTabsFormatter(3);
								$('#responseBody').append(response);
								_self.headOfPageRemove();
								$(".ui-pg-selbox").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
								$('#responseBody .view_manager_body').css("margin-top","40px");
								//设置高度
								$(".view_list .view_manager_header .span6").css("min-height","0px");
								$(".view_list .view_manager_header .span6").css("height","0px");
								$(".view_list .view_manager_header .span12").css("height","30px");
							}
						});
					});
					$('#billTabs #cancelLeaveBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.CancelLeaveBillAllList$page','view',{beginDate:beginDate,endDate:endDate});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								_self.billTabsFormatter(4);
								$('#responseBody').append(response);
								_self.headOfPageRemove();
								$(".ui-pg-selbox").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								$('#responseBody .view_manager_body').css("margin-top","40px");
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
								//设置高度
								$(".view_list .view_manager_header .span6").css("min-height","0px");
								$(".view_list .view_manager_header .span6").css("height","0px");
								$(".view_list .view_manager_header .span12").css("height","30px");
							}
						});
					});
					
					$('#billTabs #canTripBill').unbind().bind('click',function(){
						openLoader(1);
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.CanTripBillAllList$page','view',{beginDate:$("input[name=beginDate]").val(),endDate:$("input[name=endDate]").val()});
						url += '&serviceId='+encodeURIComponent(serviceId);
						shr.loadHTML({ 
							url : url,
							async: false,
							success : function(response) {
								closeLoader();
								$("#responseBody").empty();
								_self.billTabsFormatter(5);
								$('#responseBody').append(response);
								_self.headOfPageRemove();
								$(".ui-pg-selbox").css("margin-top","-40px");
								$('.view_manager_header ').find('.row-fluid')[1].remove();//调整样式
								$('#responseBody .view_manager_body').css("margin-top","40px");
								$(".shr-toolbar").css("padding","5px 0px 0px 0px");
								$("#responseBody").find('.view_manager_header').css("min-height","0px");
								//设置高度
								$(".view_list .view_manager_header .span6").css("min-height","0px");
								$(".view_list .view_manager_header .span6").css("height","0px");
								$(".view_list .view_manager_header .span12").css("height","30px");
							}
						});
					});
					
					_self.headOfPageRemove();
					$(".ui-pg-selbox").css("margin-top","-40px");
					$('.view_manager_header').find('.row-fluid').eq(1).remove();//调整样式
					
					$(".shr-toolbar").css("padding","5px 0px 0px 0px");
					$("#responseBody").find('.view_manager_header').css("min-height","0px");

					$('.view_manager_body').eq(0).css("margin-top","30px");
					$('.view_manager_header ').find('.row-fluid')[1].remove();
					$('#responseBody .view_manager_body').css("margin-top","40px");
					var beginDate;
					var endDate;
					setTimeout(function() {
						if($('[data-categoryvalue=entries--beginTime_entries--endTime]').first().data().value == undefined){
						beginDate = parentBeginDate;
						endDate = parentEndDate;
					}else{
						beginDate = $('[data-categoryvalue=entries--beginTime_entries--endTime]').first().data().value
								.split($.attendmanageI18n.atsResultDynamicCommon.text14)[0].trim();
		  	 			endDate = $('[data-categoryvalue=entries--beginTime_entries--endTime]').first().data().value
		  	 					.split( $.attendmanageI18n.atsResultDynamicCommon.text14)[1].trim();
					}
					}, 500);
					
					
					
					
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
		$(".view_list .view_manager_header .span6").css("min-height","0px");
		$(".view_list .view_manager_header .span6").css("height","0px");
		$(".view_list .view_manager_header .span12").css("height","30px");
  	},
	
  	//重载页面将LIST上方的面包屑和按钮都移除
  	headOfPageRemove : function (){
	  	var html="";
	  	html+='<span class=" shr-toolbar">';		
	  	html+='<div id="" class="btn-group ">';
	  	html+='<button class="btn-wide shrbtn dropdown-toggle" data-toggle="dropdown" type="button">' 
	  		+ $.attendmanageI18n.atsResultDynamicCommon.text15;
	  	html+='<span class="caret"></span>';
	  	html+='</button>';
	  	html+='<ul class="dropdown-menu pull-">';
	  	html+='<li id="exportCurrentuuid18" name="exportCurrent" type="" uipk=""><a href="javascript:;">' 
	  		+ $.attendmanageI18n.atsResultDynamicCommon.text16  
	  		+ '</a></li>';
	  	html+='<li id="exportToExceluuid18" name="exportToExcel" type="" uipk=""><a href="javascript:;">'  
	  		+ $.attendmanageI18n.atsResultDynamicCommon.text17 
	  		+ '</a></li>';
	  	html+='</ul>';
	  	html+='</div>';
	  	html+='</span>';
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
  	initBreadCrumb: function(){
	 	$('#breadcrumb').empty();
		//获取当前选中的主题
	 	var currentTitle='<li class="homepage"><a href="#">homepage</a> <span class="divider">/</span></li>' +
	 				'<li class="active">' 
	 				+ $.attendmanageI18n.atsResultDynamicCommon.text12 
	 				+ '<span class="divider">/</span></li>';
		$('#breadcrumb').append(currentTitle);
		
		this.initEvent();
		
	},
	//绑定导航栏事件
	 initEvent: function(){
		//绑定主页事件
		$(".homepage").live({
			click : function(){
				window.parent.parent.location = shr.getContextPath() + "/home.do";
			}
		})
	},
	//获取考勤计算菜单URL
	getAtsCalServiceUrl: function(){
		var _self = this ;
		var serviceUrl = "";
		var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList&method=getAtsCalServiceUrl"
		shr.ajax({
			type:"post",
			async: false,
			url:url,
			success:function(res){
				serviceUrl = res.data.urlValue;
			}
		});
		return serviceUrl;
	},
	//根据考勤制度获取考勤周期明细 
  	getAttendancePeriodList:function(attencePolicyId){
  		var self = this;
  		var attendancePeriod = [];
  		if( attencePolicyId != undefined ){
  			 var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttenceResultSum.list&method=getAttendancePeriod&attencePolicyId="+encodeURIComponent(attencePolicyId);
			 shr.ajax({
					type:"post",
					async:false,  
					url:url, 
					success : function(res){
						attendancePeriod = res;
	 				}
		 	});
  		}
  		return attendancePeriod;
  	},
  	isContainsAtsPeriod:function(attencePolicyId,attendancePeriodId){
  		if(attencePolicyId && attencePolicyId != "" && attendancePeriodId && attendancePeriodId != ""){
	  		var attendancePeriod = this.getAttendancePeriodList(attencePolicyId);
	  		for(var i=0;i<attendancePeriod.length;i++){
	  			if(attendancePeriod[i].id == attendancePeriodId){
	  				return true;
	  			}
	  		}
  		}
  		return false;
  	},
  	getCachedUipk: function(){
  		return ['com.kingdee.eas.hr.ats.app.AttenceResultSum.list','com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList', 'com.kingdee.eas.hr.ats.app.AttendanceResultSum.dynamicList', 'com.kingdee.eas.hr.ats.app.AttendanceResultSalary.dynamicList','com.kingdee.eas.hr.ats.app.AttendanceResultUncalList'];
  	}
}
}( jQuery ));

function Handler(s){
	this.successor = s || null;
}
Handler.prototype = {
	handle:function(){
	 if (this.successor) {
         this.successor.handle()
     }
	}	
}
function getJobFilter(){
	return "jobDefCategory.longNumber like '301!3001%'";
}
