(function($) {
var smalTitlePattern = '<div  class=${className} name=${colNumber}>' 
					 + '<span class="spanRight">${colName}</span>'
				     + '<span class="spanLeft">${colAttendVal}</span>' 
					 + '</div>';
var smalTitlePattern1 = '<div  class=${className} name=${colNumber}>' 
					 + '<span class="spanRight1">${colName}</span>'
				     + '<span class="spanLeft1">${colAttendVal}</span>' 
					 + '</div>';
var bigTitlePattern      = '<div class="bigTitle"><span>${titleName}</span></div>';
var bigTitleLinkPattern  = '<div class="bigTitle"><span id=${id}><a>${titleName}</a></span></div><div id=${contentId} style="position:relative;"></div>';
var	detailInfoPattern = '<div><span>${name}</span>' 
					+ '<span style="margin-left:15px;">${beginTime}</span><span >--</span><span >${endTime}</span>'
					+ '<span style="margin-left:15px;">${length}</span><span style="margin-left:0px;"">${unit}</span>' 
					+ '<span style="margin-left:15px;">${otType}</span>'
					+ '<span style="margin-left:15px;">${state}</span>'
					+ '<div style="width: 90%;margin-left:0px;">${description}</div></div>';
var	tripBillPattern = '<div>'
					+ '<div><span style="margin-left:10px;">${startPlace}</span>'
					+ '<SPAN style="margin-left:2px;">${endPlace}</SPAN>'  
					+ '<span style="margin-left:15px;">${beginTime}</span><span >--</span><span >${endTime}</span>'
					+ '<span style="margin-left:15px;">${length}</span><span style="margin-left:0px;"">${unit}</span>' 
					+ '<span style="margin-left:15px;">${state}</span>'
					+ '</div>'
					+ '<div style="width: 90%;margin-left:10px;">${reason}</div>'
					+ '<div style="width: 90%;margin-left:10px;">${description}</div></div>';
					 
jQuery.atsResultOneDayDetail={
	attendMap: [],
	// 一天的明细
	showBillDetailAction: function(personName,tDay,personId,adminOrgId,hrOrgUnitId){
		var self=this;
		$('#calendar_info').empty();
		var isReload = false ;
		$('#calendar_info').dialog({
					title : personName + " " + atsMlUtile.dateToUserFormat(tDay.substring(0,10))+ ' ' 
					+ $.attendmanageI18n.atsResultOneDayDetail.text1,
					width : 700,
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
					   	}
					} //这是关闭事件的回调函数,在这写你的逻辑
 			});
			var row_fields_work = ''
				+'<div id="title" name="'+adminOrgId+'" font="'+hrOrgUnitId+'">' 
				+'<span id="personName" name='+personName+'></span>'
				+'<span><a name='+personId+' id="leaveDetail"></span>' 
				+'<span><a name='+tDay+' id="billInfo"></a></span>'
				+'</div>' 
				+'<div id="Main_info" style="width:100%"><div>';
			$('#calendar_info').append(row_fields_work);
			$('#personName').attr("name",personName);    
			$('#calendar_info').css("width", "100%");
//			$(".ui-dialog-buttonset").css("display","none");
			shr.remoteCall({  
						uipk: "com.kingdee.eas.hr.ats.app.AttenceResultSum.list",
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
						+ $.attendmanageI18n.atsResultOneDayDetail.text2
						+ '</button></span>'
						+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="notAuditProject" value='+ i + '>' 
						+ $.attendmanageI18n.atsResultOneDayDetail.text3
						+ '</button></span>'
						+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="saveProject" >' 
						+ $.attendmanageI18n.atsResultOneDayDetail.text4 
						+ '</button></span>'
						+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="cancelProject" >' 
						+ $.attendmanageI18n.atsResultOneDayDetail.text5 
						+ '</button></span>'
						+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="calculateOneDay" >' 
						+ $.attendmanageI18n.atsResultOneDayDetail.text55 
						+ '</button></span>'
						+ '<span><button type="button" class="shrbtn-primary shrbtn"  id="backToCalendar">' 
						+ $.attendmanageI18n.atsResultOneDayDetail.text6 
						+ '</button></span>'
						+ '<hr style="margin:5px;">'
				    	$('#calendar_info').append(row_fields_work);	
				    	self.hideNotAccessButton();	
						 if(res.flag =="0")
						 {
					    	// ===== ==== 状态
					    	$('#calendar_info').append('<div id="status">' 
					    			+ $.attendmanageI18n.atsResultOneDayDetail.text7
					    			+res.attendStatus+'</div>');
					    	
					    	// ===== ==== 应出勤时数  实际出勤时数
					    	var planReal = res.fixedPlanRealList ;
					    	
					    	self.getFixedPlanRealList(planReal,1);
					    	var shifList= '<div class="smallTitle">' 
					    		+ '<div>'
								+ '<span class="spanRight"><a ref="#" id="punchCardInfo">' 
								+ $.attendmanageI18n.atsResultOneDayDetail.text8 
								+ '</a>' 
								+ '<div id="punchCardInfoShow" style="position:relative;"></div>' 
								+ '</span>' 
								+ '<span class="spanLeft"></span>'
								+ '</div>'
								+ '</div>'
							var shifList1= '<div class="smallTitle">' 
								+ '<span class="spanRight">' 
								+ $.attendmanageI18n.atsResultOneDayDetail.text9
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
					    		self.getLinkTitleList($.attendmanageI18n.atsResultOneDayDetail.text10,0,"");
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
					    		self.getLinkTitleList($.attendmanageI18n.atsResultOneDayDetail.text56,0,"");  // 设置标题
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
					    		self.getLinkTitleList($.attendmanageI18n.atsResultOneDayDetail.text11,0,"");  // 设置标题
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
					    		self.getLinkTitleList($.attendmanageI18n.atsResultOneDayDetail.text12,leaveBillLen,"leaveDetailInfo");
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
						    	self.getLinkTitleList($.attendmanageI18n.atsResultOneDayDetail.text13,tripBillLen,"tripDetailInfo");
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
						    	self.getLinkTitleList($.attendmanageI18n.atsResultOneDayDetail.text14,OverTimeBillLen,"overTimeDetailInfo");
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
					    			+ $.attendmanageI18n.atsResultOneDayDetail.text15 
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
					    	
							if($('#status').text().indexOf($.attendmanageI18n.atsResultOneDayDetail.text16) != -1)
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
									if($.attendmanageI18n.atsResultOneDayDetail.text17 == $(spanRight1Match[i]).text()){
										index = i;
										break;
									}
								}
								$(spanRight1Match[index]).text($.attendmanageI18n.atsResultOneDayDetail.text18);
							}					
						}else if(res.flag == "1")
						 {
						 	var status = '<div id="status">' 
						 		+ $.attendmanageI18n.atsResultOneDayDetail.text20 
						 		+ '</div>' ;
						 	
							$('#calendar_info').append(status);
//							if(step ==1){
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
//							}else{
//								$('#auditProject').hide();
//								$('#notAuditProject').hide();
//								$('#saveProject').hide();
//								$('#cancelProject').hide();
//								$('#backToCalendar').hide();
//								$('#calculateOneDay').hide();
//								$("div[class='ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix']").css('border-bottom','1px solid #ccc');
//							};
						 }
						  self.editDetailAttendProject(personId, tDay,adminOrgId,hrOrgUnitId);
						  	//掩藏没有权限的按钮
						self.hideNotAccessButton();	
					}
			})			
	},
	creatShowBillInfoDiv : function(info,id){
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
 	 },
 	 getFixedPlanRealList :function(planReal,index){
  	 	
    	// smalTitlePattern bigTitlePattern
		var punchCarStr=[];
		if (planReal && planReal.length > 0) {
			var len = planReal.length ;
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
			 if(index == 1){punchCarStr.push(juicer(smalTitlePattern,{className : "smallTitle1",colName: $.attendmanageI18n.atsResultOneDayDetail.text21}));};
		}
		$('#calendar_info').append(punchCarStr.join(''));
  	 },
  	 getFixedAttendPlanList1 :function(planReal,index){  // 为实际出勤和应出勤定做的模板
		var punchCarStr=[];
		if (planReal && planReal.length > 0) {
			var len = planReal.length ;
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
			 if(index == 1){punchCarStr.push(juicer(smalTitlePattern,{className : "smallTitle1",colName: $.attendmanageI18n.atsResultOneDayDetail.text21}));};
			 $('#calendar_info').append(punchCarStr.join(''));
		}
  	 },
  	 getFixedAttendPlanList :function(planReal,index){
		var punchCarStr=[];
		if (planReal && planReal.length > 0) {
			var len = planReal.length ;
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
			 if(index == 1){punchCarStr.push(juicer(smalTitlePattern,{className : "smallTitle1",colName: $.attendmanageI18n.atsResultOneDayDetail.text21}));};
			 $('#calendar_info').append(punchCarStr.join(''));
		}
  	 },
  	 // 编辑考勤明细 根据日期
	editDetailAttendProject : function(personId, tDay,adminOrgUnitId,hrOrgUnitId) {
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
			$(this).parent().parent().parent().parent().next().text($.attendmanageI18n.atsResultOneDayDetail.text22);
			if(valText.indexOf("_") > 0){
				valText = valText.substring(1);
				var dateStr = valText.split("_");
				if(dateStr[1] == ""){ dateStr[1] = 0 ;}	
				if(dateStr.length > 2){//值的本身就包含下划线的时候。
					dateStr[1] = valText.substring(valText.indexOf("_") + 1,valText.length) ;
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
	 		if($('#status').text()
	 				.indexOf($.attendmanageI18n.atsResultOneDayDetail.text23) != -1){ return ; }
	 		if($(this).find('input').html()!=null){ return ;}
	 		if($(this).prev().prev().find('input[name=attendanceName]').val()==""){ return ;}
	 		$(this).wrapInner("<input type='text' value='"+$(this).html()+"' class='input-height cell-input' style='width:40px' />");
			$('#cancelProject').show();	 		
	 	});
	 	
		$('.delShowAttend').die().live('click',function(){
			$(this).parent().parent().remove();
		})
		
		$('.spanLeft').click(function(){ 
			if($('#status').text()
					.indexOf($.attendmanageI18n.atsResultOneDayDetail.text23) != -1){ return ; }
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
			var hrOrgUnitId = $('#title').attr("font");
			if(isDetailOnProject==true){
				isDetailOnProject=false;
				self.showDetailOnProject(attendNameOnSelect,personName,personId,adminOrgId,hrOrgUnitId);
			}
			else{
				self.showCalendarDetailAction(personId,adminOrgId,personName,hrOrgUnitId);	
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
					     	  	 shr.showError({message: shr.formatMsg($.attendmanageI18n.atsResultOneDayDetail.text24, [(k+1), j])});
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
			shr.remoteCall({  
						uipk: "com.kingdee.eas.hr.ats.app.AttenceResultSum.list",
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
								self.showBillDetailAction(personName,attendDate,personId,adminOrgId,hrOrgUnitId);
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
			 shr.remoteCall({  
						uipk: "com.kingdee.eas.hr.ats.app.AttenceResultSum.list",
						type : "post",
						method : "auditAttendanceRecord",
						param : {
							personId : personId,
							attendDate : attendDate,
							adminOrgUnitId : adminOrgUnitId,
							action : 2   //  FATTENCESTATUS = 2  审核
						},
						success : function(res){
							if(res.flag =="0"){
									$('#status').text("");
									$('#status')
									.text($.attendmanageI18n.atsResultOneDayDetail.text26);
									$('#auditProject').hide();
								    $('#calculateOneDay').hide();
								    $('#saveProject').hide();
									$('button[id=notAuditProject]').show();
									$('#cancelProject').hide();									
							}else {
								shr.showError({message : $.attendmanageI18n.atsResultOneDayDetail.text57});
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
			shr.remoteCall({  
						uipk: "com.kingdee.eas.hr.ats.app.AttenceResultSum.list",
						type : "post",
						method : "auditAttendanceRecord",
						param : {
							personId : personId,
							attendDate : attendDate,
							adminOrgUnitId : adminOrgUnitId,
							action : 1   //  FATTENCESTATUS = 1  未审核
						},
						success : function(res){
							if(res.flag =="0"){
									$('#status').text("");
									$("#status").text($.attendmanageI18n.atsResultOneDayDetail.text27);
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
			 var hrOrgUnitId =$('#title').attr("font");
			 openLoader(1); 
			 var url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper";
			shr.remoteCall({  
					//uipk: "com.kingdee.eas.hr.ats.app.AttenceResultSum.list",
					url: url,
					type : "post",
					method : "calculatePersonOneDay",
					param : {
						hrOrgUnitId:'',
						personId : personId,
						attendDate : attendDate,
						isCalUnOffWork: 1
					},
					success : function(res){
						if(res.flag == 1){
							shr.showInfo({message : $.attendmanageI18n.atsResultOneDayDetail.text28});
							self.showBillDetailAction(personName,tDay,personId,adminOrgUnitId,hrOrgUnitId);
						}else if(res.flag == 2){
							shr.showInfo({message: $.attendmanageI18n.atsResultOneDayDetail.text29+": "+res.errorMsg,hideAfter:10});
						}else{
							shr.showError({message : $.attendmanageI18n.atsResultOneDayDetail.text29});
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
	hideNotAccessButton :function(){
	
		var ids = hideButtonId ;
	   for(var id in ids )
	   {
	       $("#"+ids[id]).hide() ;
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
 	 addShowAttend : function(index){
 		var punchCar_List ='';
 		punchCar_List += '<div class="row-fluid row-block row_field" >' 
 			+ '<span class="spanSelf" style="width:10%;margin-left:45px;">' 
 			+ $.attendmanageI18n.atsResultOneDayDetail.text30 
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
 	//日历显示
	showCalendarDetailAction:function(personId,adminOrgId,personName,hrOrgUnitId){
			var self=this;
			var beginDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
			var endDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
			var curDate = new Date(beginDate);
			var curBeginDate = new Date(beginDate);
			var curEndDate = new Date(endDate);
			indexNextMonth=curEndDate.getMonth();
			indexMonth=curBeginDate.getMonth();
			indexYear=curBeginDate.getFullYear();
			$('#calendar_info').empty();
			$('#calendar_info').next().remove();
			$('#calendar_info').dialog({
						title : personName+' ('+atsMlUtile.dateToUserFormat(beginDate)+' -- '+atsMlUtile.dateToUserFormat(endDate)+")",
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
									+"<div id='monthSelector'><i class='icon-caret-left'></i><div id='monthInfo' ></div><i class='icon-caret-right'></i>"	
									+"</div>"
								+"</div>"
								+"<div id='calend_info'></div></div>" ;
			$('#calendar_info').append(workCalendar);	
			$('#monthInfo').html(( indexMonth + 1) > 9 ? (indexMonth +1) : '0'+ (indexMonth +1));
			if($.attendmanageI18n.atsResultOneDayDetail.text31 =="Year"){
				$('#yearInfo').html($.shrI18n.dateI18n.month2[indexMonth]+"-"+indexYear);
			}else {
				$('#yearInfo').html(indexYear 
					+ $.attendmanageI18n.atsResultOneDayDetail.text31
					+ $.shrI18n.dateI18n.month2[indexMonth]);
			}
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
						self.getAttendanceDetail(personId,adminOrgId,personName,hrOrgUnitId);
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
        $('#yearInfo').html(indexYear 
        		+ $.attendmanageI18n.atsResultOneDayDetail.text31
        		+ $.shrI18n.dateI18n.month2[indexMonth]);
		});	 	 	
		self.getAttendanceDetail(personId,adminOrgId,personName,hrOrgUnitId);
	},
 	//点击明细项目时显示汇总信息
	showDetailOnProject:function(attendName,personName,personId,adminOrgId,hrOrgUnitId){
		var self = this;
		var beginDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
		var endDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
		shr.remoteCall({  
			uipk: "com.kingdee.eas.hr.ats.app.AttenceResultSum.list",
			type : "post",
			method : "getOneAttendanceDetail",
			param : {
				personId : personId,
				adminOrgId : adminOrgId,
				hrOrgUnitId: hrOrgUnitId,
				beginDate : beginDate,
				endDate : endDate,
				attendName : attendName
			},
			success : function(res) {
				var events = [];
				isReload = false;
				$('#calendar_info').empty();
				$('#calendar_info').dialog({
							title : personName + " " + res[0].name+ $.attendmanageI18n.atsResultOneDayDetail.text32,
							width : 500,
							height : 550,
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
							+ $.attendmanageI18n.atsResultOneDayDetail.text33 
							+ '" id="editDetailProject" >' 
							+ $.attendmanageI18n.atsResultOneDayDetail.text33 
							+ '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn" name="' 
							+ $.attendmanageI18n.atsResultOneDayDetail.text34 
							+ '" id="saveDetailProject" >' 
							+ $.attendmanageI18n.atsResultOneDayDetail.text34 
							+ '</button></span>'
							+ '<span><button type="button" class="shrbtn-primary shrbtn" name="' 
							+ $.attendmanageI18n.atsResultOneDayDetail.text35 
							+ '" id="cancelDetailProject" >' 
							+ $.attendmanageI18n.atsResultOneDayDetail.text35 
							+ '</button></span>'
							+ '<span><input id="hiddAttendCol" type="hidden" value='+res[0].columnNO+'></input></span>'
							+ '</div>'
					$('#calendar_info').append(row_fields_work);
				}
				var hasAudited = false;
				for (var i = 0; i < res.length; i++) {
					var tmpDate = res[i].date.substring(0, 10);
					var row_fields_work = ''
							+ '<div id="Main'+i+'" name='+ res[i].id+' style="margin:20px;float:left;width:40%">'
							+ '<a href="javascript:void(0)" style="text-decoration:underline;" id="attendDate" onclick="showOneDayDetailOnProject(&quot;'+personName+'&quot;,&quot;'+tmpDate+'&quot;,&quot;'+personId+'&quot;,&quot;'+adminOrgId+'&quot;,&quot;'+hrOrgUnitId+'&quot;)" style="margin-right: 10px;width:68%;">'+ tmpDate+ '</a>'
							+ '<span id="AttendLen" style="width:20%;margin-left: 10px;">'+ res[i].lenth+'</span>'
							+ '<span id="len" style="margin-left:10px" >'+ res[i].Unit+'</span>' 
							+ '</div>' 
					$('#calendar_info').append(row_fields_work);
					if(res[i].attenceStatus == 2){
						hasAudited = true;
					}
				}
				//if(step == 2) // 审核状态不能编辑
				if(hasAudited) // 审核状态不能编辑
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
	getAttendanceDetail:function(personId,adminOrgId,personName,hrOrgUnitId){
		var self=this;
		var beginDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
		var endDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
		  shr.remoteCall({  
				uipk: "com.kingdee.eas.hr.ats.app.AttenceResultSum.list",
				type : "post",
				method : "getMyAttendanceDetail",
				param : {
					personId : personId,
					adminOrgId : adminOrgId,
					hrOrgUnitId: hrOrgUnitId,
					beginDate : beginDate,
					endDate : endDate 
				}, 
				success : function(res) {
					var curDate = new Date(beginDate);
					var curDateY = curDate.getFullYear();
					var curDateM = curDate.getMonth();
					var curBeginDate = new Date(beginDate);
					var curEndDate = new Date(endDate);
					_events = [] ;
					for (var i = 0; i < res.length; i++) {
						var event = {};
							event.day = res[i].day;
							event.start = new Date(res[i].date);
							event.title = res[i].title;
							_events.push(event);
						}
					self.initWorkCalendar(res,curBeginDate,curEndDate,personName,personId,adminOrgId,hrOrgUnitId);
					$(".fc-event-container").css("z-index","0");
	        }
		});
	}
	 ,
	initWorkCalendar:function(res,curBeginDate,curEndDate,personName,personId,adminOrgId,hrOrgUnitId){
		var self=this;
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
			                 $.attendmanageI18n.atsResultOneDayDetail.text36, 
			                 $.attendmanageI18n.atsResultOneDayDetail.text37, 
			                 $.attendmanageI18n.atsResultOneDayDetail.text38, 
			                 $.attendmanageI18n.atsResultOneDayDetail.text39, 
			                 $.attendmanageI18n.atsResultOneDayDetail.text40,
			                 $.attendmanageI18n.atsResultOneDayDetail.text41, 
			                 $.attendmanageI18n.atsResultOneDayDetail.text42],
			monthNamesShort : [
			                   $.attendmanageI18n.atsResultOneDayDetail.text43, 
			                   $.attendmanageI18n.atsResultOneDayDetail.text44, 
			                   $.attendmanageI18n.atsResultOneDayDetail.text45, 
			                   $.attendmanageI18n.atsResultOneDayDetail.text46,
			                   $.attendmanageI18n.atsResultOneDayDetail.text47, 
			                   $.attendmanageI18n.atsResultOneDayDetail.text48, 
			                   $.attendmanageI18n.atsResultOneDayDetail.text49, 
			                   $.attendmanageI18n.atsResultOneDayDetail.text50, 
			                   $.attendmanageI18n.atsResultOneDayDetail.text51, 
			                   $.attendmanageI18n.atsResultOneDayDetail.text51,
			                   $.attendmanageI18n.atsResultOneDayDetail.text53, 
			                   $.attendmanageI18n.atsResultOneDayDetail.text54],
			monthNames : [
							$.attendmanageI18n.atsResultOneDayDetail.text43, 
							$.attendmanageI18n.atsResultOneDayDetail.text44, 
							$.attendmanageI18n.atsResultOneDayDetail.text45, 
							$.attendmanageI18n.atsResultOneDayDetail.text46,
							$.attendmanageI18n.atsResultOneDayDetail.text47, 
							$.attendmanageI18n.atsResultOneDayDetail.text48, 
							$.attendmanageI18n.atsResultOneDayDetail.text49, 
							$.attendmanageI18n.atsResultOneDayDetail.text50, 
							$.attendmanageI18n.atsResultOneDayDetail.text51, 
							$.attendmanageI18n.atsResultOneDayDetail.text51,
							$.attendmanageI18n.atsResultOneDayDetail.text53, 
							$.attendmanageI18n.atsResultOneDayDetail.text54],
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
						$("td[data-date="+dateValue+"]").attr("title",title);
					});
				var divHtml = '<div style="color:#666;text-overflow: ellipsis;overflow: hidden">' + title + '</div>';
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
				self.showBillDetailAction(personName,tDay,personId,adminOrgId,hrOrgUnitId);
				$('#backToCalendar').show();
			} 
		}); 
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
			  shr.remoteCall({  
					uipk: "com.kingdee.eas.hr.ats.app.AttenceResultSum.list",
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
							shr.showInfo({message : $.attendmanageI18n.atsResultOneDayDetail.msg});
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
	}
	
}}( jQuery ));