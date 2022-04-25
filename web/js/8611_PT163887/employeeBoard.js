
var strFormatedDate = null;
shr.defineClass("shr.ats.employeeBoard", shr.framework.Edit,{
	year: null,
	month: null,
	maxYear: null,
	maxMonth: null,
	curDay: null,
	curOptionDay: null, 
	lastDayInCurMonth: null,
	
	
	initalizeDOM : function () {
		shr.ats.employeeBoard.superClass.initalizeDOM.call(this);
		
		var date = new Date();
		this.year = date.getFullYear();
		this.month = date.getMonth();
		this.maxYear = this.year;
		this.maxMonth = this.month;
		this.curDay = date.getDate();
		var nextMonthFirstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
		var monthLastDayDate = new Date(nextMonthFirstDay-86400000);
		this.lastDayInCurMonth = monthLastDayDate.getDate();
		
		
		this.initCalandar();
		this.initStatistic1();
		this.initRecordDetail();
		localStorage.setItem('planWorkTimeclass', 'newPlanWorkTimeShow');
		$('.newPlanWorkTimeHide').attr('class', 'newPlanWorkTimeShow');
		
		var langType = shr.getContext().locale;
		if(langType == "en_US"){
			$('#monthInfo').html($.shrI18n.dateI18n.month2[this.month]);
			$('#yearInfo')
				.html($.shrI18n.dateI18n.month2[this.month] + "-" + this.year);
		}else{
			$('#monthInfo').html((this.month + 1) > 9 ? (this.month +1) : '0'+ (this.month +1));
			$('#yearInfo')
				.html(this.year + jsBizMultLan.atsManager_employeeBoard_i18n_24
					+ $.shrI18n.dateI18n.month2[this.month]);
		}		
		$('#closeDetailInfo').click(function(){
			$('#unusualInfo').hide();
		});
		
		var that = this;
		$('#monthSelector').find('i').click(function(e){
			var tar = e.target;
			if($(tar).hasClass('icon-caret-left')){
				if(that.month == 0){
					that.month = 11;
					that.year = that.year - 1;
				}else{
					that.month = that.month - 1;
				}
			}else if($(tar).hasClass('icon-caret-right')){
				if(that.month == 11){
					that.month = 0;
					that.year = that.year + 1;
				}else{
					that.month = that.month + 1;
				}
			}
			
			var nextMonthFirstDay = new Date(that.year, that.month + 1, 1);
			var monthLastDayDate = new Date(nextMonthFirstDay-86400000);
			that.lastDayInCurMonth = monthLastDayDate.getDate();
				
			if(langType == "en_US"){
			$('#monthInfo').html($.shrI18n.dateI18n.month2[that.month]);
			$('#yearInfo')
				.html($.shrI18n.dateI18n.month2[that.month] + "-" + that.year);
			}else{
				$('#monthInfo').html((that.month + 1) > 9 ? (that.month +1) : '0'+ (that.month +1));
				$('#yearInfo')
					.html(that.year + jsBizMultLan.atsManager_employeeBoard_i18n_24
						+ $.shrI18n.dateI18n.month2[that.month]);
			}
			that.initStatistic1();
			that.initCalandar();
		});
		this.handleBreadcrumb();
	},
	handleBreadcrumb: function(){
		/*		var items = shrDataManager.pageNavigationStore.getDatas();
	   	if(items && items.length>=1){
	 		for (var i = 0, length = items.length; i < length-1; i++) {
	 			items.pop();
	    	}
	   	}*/
//		var bread = $("#breadcrumb").children();
//		for(var i = 0;i < bread.length-1; i++){
//			bread.eq(i).remove();
//		}
	
	},
	initCalandar: function(){
		var that = this;
		this.remoteCall({
			 type:"post",
			 method:"getMyAttendanceDetail",
			 param:{monthLastDay: that.formatDate(that.year, that.month+1, that.lastDayInCurMonth)},
			 success:function(res){
				 var events = [];
				 for(var i=0; i<res.length; i++){
					 var event = {};
					 event.day = res[i].day;
					 event.start = new Date(that.year, that.month, res[i].day);
					 event.hasUnusual = res[i].hasUnusual;
					 event.isLate = res[i].isLate;
					 event.isEarly = res[i].isEarly;
					 event.isAbsence = res[i].isAbsence;
					 event.unusualWorkTime = res[i].unusualWorkTime;
					 event.planWorkTime = res[i].planWorkTime;
					 event.isOvertime = res[i].isOvertime;
					 event.isEvection = res[i].isEvection;
					 event.isAddSignIn = res[i].isAddSignIn;
					 event.isVacate = res[i].isVacate;
					 event.isScheduleShift= res[i].scheduleShift;
					 event.dateType= res[i].dateType;
					 events.push(event);
				 }
				 
				 $('#calendar_info').empty();
				 $('#calendar_info').fullCalendar({
						header: {
							left: '',
							center: '',
							right: ''
						},
						year: that.year,
						month: that.month,
						dayNamesShort: [
							jsBizMultLan.atsManager_employeeBoard_i18n_33,
							jsBizMultLan.atsManager_employeeBoard_i18n_37,
							jsBizMultLan.atsManager_employeeBoard_i18n_31,
							jsBizMultLan.atsManager_employeeBoard_i18n_34,
							jsBizMultLan.atsManager_employeeBoard_i18n_35,
							jsBizMultLan.atsManager_employeeBoard_i18n_36,
							jsBizMultLan.atsManager_employeeBoard_i18n_32
						],
						monthNamesShort: [
							jsBizMultLan.atsManager_employeeBoard_i18n_3,
							jsBizMultLan.atsManager_employeeBoard_i18n_4,
							jsBizMultLan.atsManager_employeeBoard_i18n_5,
							jsBizMultLan.atsManager_employeeBoard_i18n_6,
							jsBizMultLan.atsManager_employeeBoard_i18n_7,
							jsBizMultLan.atsManager_employeeBoard_i18n_8,
							jsBizMultLan.atsManager_employeeBoard_i18n_9,
							jsBizMultLan.atsManager_employeeBoard_i18n_10,
							jsBizMultLan.atsManager_employeeBoard_i18n_11,
							jsBizMultLan.atsManager_employeeBoard_i18n_0,
							jsBizMultLan.atsManager_employeeBoard_i18n_1,
							jsBizMultLan.atsManager_employeeBoard_i18n_2
						],
						monthNames: [
							jsBizMultLan.atsManager_employeeBoard_i18n_3,
							jsBizMultLan.atsManager_employeeBoard_i18n_4,
							jsBizMultLan.atsManager_employeeBoard_i18n_5,
							jsBizMultLan.atsManager_employeeBoard_i18n_6,
							jsBizMultLan.atsManager_employeeBoard_i18n_7,
							jsBizMultLan.atsManager_employeeBoard_i18n_8,
							jsBizMultLan.atsManager_employeeBoard_i18n_9,
							jsBizMultLan.atsManager_employeeBoard_i18n_10,
							jsBizMultLan.atsManager_employeeBoard_i18n_11,
							jsBizMultLan.atsManager_employeeBoard_i18n_0,
							jsBizMultLan.atsManager_employeeBoard_i18n_1,
							jsBizMultLan.atsManager_employeeBoard_i18n_2
						],
						editable: true,
						disableDragging: true,
						events: events,
						eventRender: function(event, element) {
						},
						eventAfterRender : function(event, element, view) {
							$("#calendar_info td").each(function() {
								var tdThis = this;
								var dateValue = $(tdThis).attr('data-date');
								if(dateValue != null && dateValue != undefined){
									var time = new Date(dateValue.replace(/-/g, "/"));
									if(time.getTime() == event.start.getTime()){
											title = getColorTitle(tdThis, event.dateType);
									}
								}
  							});
							
						  //都使用unusualBox的，否则会乱掉。
						  var confbg = '<div class="unusualBox">';
						  if(event.day == that.curDay){
								confbg = '<div class="unusualBox">';
						  }
						  if(event.hasUnusual==true){	
							  confbg = '<div class="unusualBox">';
							  if(event.day == that.curDay){
									confbg = '<div class="unusualBox">';
							  }
						  }
								
						  var planWorkTimeclass = localStorage.getItem('planWorkTimeclass');
						  if(!planWorkTimeclass){
								planWorkTimeclass = 'newPlanWorkTimeHide';
						   }
						  var planWorkTime = event.planWorkTime
						  if(planWorkTime){
						     confbg = confbg  + '<div class="unusualday">' + '</div>' +'<div class="' + planWorkTimeclass + '">'+ planWorkTime +'</div>';
						  }
							confbg = confbg + '</div><div class="planWorkTime"><div class=planWorkTimeShow' + '>';
							if(event.isLate){
								confbg = confbg + '<div class="isLateIcon"></div>';
							}
							if(event.isEarly){
								confbg = confbg + '<div class="isEarlyIcon"></div>';
							}
							if(event.isAbsence){
								confbg = confbg + '<div class="isAbsenceIcon"></div>';
							}
                            
							confbg+='</div></div>';
							
							confbg += '<div class="markableIconBox">'
							if(event.isOvertime==true){
								confbg = confbg + '<div class="isOvertime cusor_pointer" title="'
									+ jsBizMultLan.atsManager_employeeBoard_i18n_16
									+ '"></div>';
							}
							if(event.isVacate==true){
								confbg = confbg + '<div class="isVacate cusor_pointer" title="'
									+ jsBizMultLan.atsManager_employeeBoard_i18n_17
									+ '"></div>';
							}
							if(event.isEvection==true){
								confbg = confbg + '<div class="isEvection cusor_pointer" title="'
									+ jsBizMultLan.atsManager_employeeBoard_i18n_14
									+ '"></div>';
							}
							if(event.isAddSignIn==true){
								confbg = confbg + '<div class="isAddSignIn cusor_pointer" title="'
									+ jsBizMultLan.atsManager_employeeBoard_i18n_13
									+ '"></div>';
							}
							if(event.isScheduleShift==true){
								confbg = confbg + '<div class="isScheduleShift cusor_pointer" title="'
									+ jsBizMultLan.atsManager_employeeBoard_i18n_15
									+ '"></div>';
							}
							confbg += '</div>'
							element.html(confbg);
						}, 
						eventClick: function(event, e) {
							var formatedDate=that.year;
							if ( (that.month+1)<10) {
								formatedDate=formatedDate+'-0'+(that.month+1);
							}else{
								formatedDate=formatedDate+'-'+(that.month+1);
							}
							if (event.day<10) {
								formatedDate=formatedDate+'-0'+event.day;
							}else{
								formatedDate=formatedDate+'-'+event.day;
							}
							
							var tar = e.target;
							//empFlag：从员工考勤看板日历跳转的单据页面取消默认查询条件，只显示日历单元格所在日的单据

							if($(tar).hasClass('unusualday') || $(tar).hasClass('hasUnusual') || $(tar).hasClass('unusualBox') || $(tar).hasClass('unusualBox_today') || $(tar).hasClass('newPlanWorkTimeShow')){
								//这里和下面都是调同一个方法that.initKaoqinInfo(event);没必要这个判断
								//if(event.hasUnusual == true){
									that.initKaoqinInfo(event);//!!!!!!!!!!!!!!!!!!
								//}
							}else if($(tar).hasClass('usualBox') || $(tar).hasClass('usualBox_today') || $(tar).hasClass('newPlanWorkTimeShow')){
								that.initKaoqinInfo(event); //!!!!!!!!!!!!!!!!
							}else if($(tar).hasClass('isOvertime')){
								var param = {uipk:'com.kingdee.eas.hr.ats.app.AtsOverTimeBillList',
								dateValue:formatedDate,
								empFlag:true}
								that.reloadPage(param);
							} else if($(tar).hasClass('isVacate')){
								var param = {uipk:'com.kingdee.eas.hr.ats.app.AtsLeaveBillList',
								dateValue:formatedDate,
								empFlag:true}
								that.reloadPage(param);
							} else if($(tar).hasClass('isEvection')){
								var param = {uipk:'com.kingdee.eas.hr.ats.app.AtsTripBillList',
								dateValue:formatedDate,
								empFlag:true}
								that.reloadPage(param);
							} else if($(tar).hasClass('isAddSignIn')){
								var param = {
									uipk:'com.kingdee.eas.hr.ats.app.FillSignCardList',
									dateValue:formatedDate,
									empFlag:true
								}
								that.reloadPage(param);
							} else if($(tar).hasClass('isScheduleShift')){
								var param = {
									uipk:'com.kingdee.eas.hr.ats.app.AtsScheduleShift.list',
									dateValue:formatedDate,
									empFlag:true
								}
								that.reloadPage(param);
							}else{
								that.initKaoqinInfo(event);
							}
						},
						dayClick: function(date, allDay, jsEvent, view) {
							
						}
					});
					
					
					
				 	
				 $('.unusualBox_today, .usualBox_today').parent('div').css('background', '#fcf8e3');
			 }
		});
		
	/*	that.remoteCall({
				 type:"post",
				 method:"flashPage",
				 success:function(res){
					console.log(res);

				
				 }
			});

		*/
		
	},
	
	/**
	 * 初始化考情详细信息页
	 */
	initKaoqinInfo: function(event){
		var _now = new Date();
		var curMonth = _now.getMonth();
		var curYear = _now.getFullYear();
		var that = this;
		
		if(event.day !== this.curDay || (that.month && curMonth !== that.month) || (that.year && curYear !== that.year) ){
			$('td[data-date^=' + this.formatDate(this.year, this.month + 1) + ']').removeClass('highLightBox');
			$('td[data-date=' + this.formatDate(this.year, this.month + 1, event.day) + ']').addClass('highLightBox');
		}
		if(event.day === this.curDay && (that.month && curMonth === that.month) && (that.year && curYear === that.year)){
			$('td[data-date^=' + this.formatDate(this.year, this.month + 1) + ']').removeClass('highLightBox');
			//$('td[data-date=' + this.formatDate(this.year, this.month + 1, event.day) + ']').addClass('highLightBox');
		}
		
		that.curOptionDay = event.day;
		//$('#checkRecordIcon').removeClass('checkRecordIconUp').addClass('checkRecordIconDown');
		//$('#recordList').hide();
		//重新加载recordList
		that.reloadRecordDetail();
		
		this.remoteCall({
			 type:"post",
			 method:"getMyAttendanceDaySum",
			 param:{monthLimitDay: that.formatDate(that.year, that.month+1, event.day)},
			 success:function(res){
			 	 var formatedDate=that.year;
				 if ( (that.month+1)<10) {
					formatedDate=formatedDate+'-0'+(that.month+1);
				 }else{
					formatedDate=formatedDate+'-'+(that.month+1);
				 }
				 if (event.day<10) {
					formatedDate=formatedDate+'-0'+event.day;
				 }else{
					formatedDate=formatedDate+'-'+event.day;
				 }
				 var options = {
					ctrlType:'Date',
					isShowUTC:false,
					isRemoveDay:false,
					showTimeZoneForCtrl:false,
					isAutoTimeZoneTrans:false
				};
				var userFormatValue = dateTimePickerService.getUTCClientDate(formatedDate,options);
				strFormatedDate  = formatedDate;
				$('#unusualInfo').show();
				$('#unusualDate').html(userFormatValue);
				 if(res.isUnusual == true){
					 $('#unusualTitle')
						 .html(jsBizMultLan.atsManager_employeeBoard_i18n_21)
						 .css('color', '#CBA89F');
				 }else{
					 $("#unusualTitle").html(jsBizMultLan.atsManager_employeeBoard_i18n_22).css("color", "#fff");
				 }
				 
				 $('.rightBtn').click(function(e){
						var id = $(this).attr('id');
						var param;
						switch(id){
						case 'chuchaidanBtn':
							param = {uipk:'com.kingdee.eas.hr.ats.app.AtsTripBillList',
							dateValue:formatedDate,
								empFlag:true
							};
							break;
						case 'buqiandanBtn':
							param = {
									uipk:'com.kingdee.eas.hr.ats.app.FillSignCardList',
									dateValue:formatedDate,
								    empFlag:true
								};
							break;
						case 'jiabandanBtn':
						    param = {uipk:'com.kingdee.eas.hr.ats.app.AtsOverTimeBillList',
						    dateValue:formatedDate,
							empFlag:true};
							break;
						case 'qingjiadanBtn':
							param = {uipk:'com.kingdee.eas.hr.ats.app.AtsLeaveBillList',
							dateValue:formatedDate,
								empFlag:true};
							break;
						}
						that.reloadPage(param);
					});
					var shiftMap = res.shiftName;
					if(res.workCalendar == null || res.workCalendar.length == 0){
						$('#dateType').html("");
					}else{
						$('#dateType').html(res.workCalendar);
					}
				if(shiftMap == 1){
					$('#shiftNameTitle').hide();
					$('#shiftTimeTitle').hide();
					$('#coreTimeTitle').hide();
					$('#restTimeTitle').hide();
										
					$('#shiftName').html('');
					$('#shiftTime').html('');
					$('#restTime').html('');
					$('#coreTime').html('');
					
				}else{	
					$('#shiftNameTitle').show();
					$('#shiftTimeTitle').show();
					$('#coreTimeTitle').show();
					$('#restTimeTitle').show();
					
					$('#shiftName').html('');
					$('#shiftTime').html('');
					$('#restTime').html('');
					$('#coreTime').html('');
					$('#realWorkTime').html(res.realWorkTime);
					
					var shiftName1 = res.shiftName.scheduleShiftInfo[0].defaultShift == undefined ? "isNotShift" : res.shiftName.scheduleShiftInfo[0].defaultShift.name;					 
					
				
				 if(shiftName1 != "isNotShift"){ 
					var preTime1 = res.shiftName.scheduleShiftInfo[0].items[0].preTime;
					var nextTime1 = res.shiftName.scheduleShiftInfo[0].items[0].nextTime;
					var items = res.shiftName.scheduleShiftInfo[0].items.length;
					var restPreTime = res.shiftName.scheduleShiftInfo[0].items[0].restPreTime;
					var segmentInRest1 = res.shiftName.scheduleShiftInfo[0].items[0].segmentInRest == undefined ? 0 : res.shiftName.scheduleShiftInfo[0].items[0].segmentInRest;
					var restNextTime = res.shiftName.scheduleShiftInfo[0].items[0].restNextTime;
					var preFloatAdjusted1 = res.shiftName.scheduleShiftInfo[0].items[0].preFloatAdjusted == undefined ? 0 : res.shiftName.scheduleShiftInfo[0].items[0].preFloatAdjusted;  //一段班上班浮动值
					var nextFloatAdjusted1 = res.shiftName.scheduleShiftInfo[0].items[0].nextFloatAdjusted == undefined ? 0 : res.shiftName.scheduleShiftInfo[0].items[0].nextFloatAdjusted;  //下班浮动值
					var preDateTime = res.shiftName.scheduleShiftInfo[0].items[0].preDateTime //标准上班时间
					var nextDateTime = res.shiftName.scheduleShiftInfo[0].items[0].nextDateTime
                    
					var preFloatTime = that.preDF(preDateTime , preFloatAdjusted1);
					var nextFloatTime = that.nextDF(nextDateTime , nextFloatAdjusted1);				 
					 $('#shiftName').html(shiftName1);
					 $('#shiftTime').html(preTime1+"-"+nextTime1);
					 $('#coreTime').html(preFloatTime + "-" + nextFloatTime);
				  }
				  $('#dateType').html(res.workCalendar);
				 if(items == 2){
					 	var preTime2 = res.shiftName.scheduleShiftInfo[0].items[1].preTime;
						var nextTime2 =  res.shiftName.scheduleShiftInfo[0].items[1].nextTime;
						var segmentInRest2  = res.shiftName.scheduleShiftInfo[0].items[1].segmentInRest;
						var segmentInRest2 = segmentInRest2 == undefined ? 0 : segmentInRest2;
						
						$('#shiftTime').append(";"+preTime2+"-"+nextTime2);
						
						var preDateTime2 = res.shiftName.scheduleShiftInfo[0].items[1].preDateTime //二段标准上班时间
						var nextDateTime2 = res.shiftName.scheduleShiftInfo[0].items[1].nextDateTime
                    
						
						var preFloatAdjusted2 = res.shiftName.scheduleShiftInfo[0].items[1].preFloatAdjusted == undefined ? 0 : res.shiftName.scheduleShiftInfo[0].items[1].preFloatAdjusted;  //二段班上班浮动值
						var nextFloatAdjusted2 = res.shiftName.scheduleShiftInfo[0].items[1].nextFloatAdjusted == undefined ? 0 : res.shiftName.scheduleShiftInfo[0].items[1].nextFloatAdjusted;
					    
					    var preFloatTime2 = that.preDF(preDateTime2 , preFloatAdjusted2);
						var nextFloatTime2 = that.nextDF(nextDateTime2 , nextFloatAdjusted2);
					  
					    $('#coreTime').append(";" + preFloatTime2 + "-" + nextFloatTime2);

						
					}
				 if(items == 3){
				 		var preTime2 = res.shiftName.scheduleShiftInfo[0].items[1].preTime;
						var nextTime2 =  res.shiftName.scheduleShiftInfo[0].items[1].nextTime;
				 	    var preTime3 = res.shiftName.scheduleShiftInfo[0].items[2].preTime
						var nextTime3 = res.shiftName.scheduleShiftInfo[0].items[2].nextTime;
						var segmentInRest2  = res.shiftName.scheduleShiftInfo[0].items[1].segmentInRest == undefined ? 0 : res.shiftName.scheduleShiftInfo[0].items[1].segmentInRest;
						var segmentInRest3  = res.shiftName.scheduleShiftInfo[0].items[2].segmentInRest == undefined ? 0 : res.shiftName.scheduleShiftInfo[0].items[2].segmentInRest;
						
						var preDateTime2 = res.shiftName.scheduleShiftInfo[0].items[1].preDateTime; //三段标准上班时间
						var nextDateTime2 = res.shiftName.scheduleShiftInfo[0].items[1].nextDateTime;
                    						
						var preFloatAdjusted2 = res.shiftName.scheduleShiftInfo[0].items[1].preFloatAdjusted == undefined ? 0 : res.shiftName.scheduleShiftInfo[0].items[1].preFloatAdjusted;  //三段班上班浮动值
						var nextFloatAdjusted2 = res.shiftName.scheduleShiftInfo[0].items[1].nextFloatAdjusted;
					    
					    var preFloatTime2 = that.preDF(preDateTime2 , preFloatAdjusted2);
						var nextFloatTime2 = that.nextDF(nextDateTime2 , nextFloatAdjusted2);
						
						var preDateTime3 = res.shiftName.scheduleShiftInfo[0].items[2].preDateTime; //三段标准上班时间
						var nextDateTime3 = res.shiftName.scheduleShiftInfo[0].items[2].nextDateTime;
                    						
						var preFloatAdjusted3 = res.shiftName.scheduleShiftInfo[0].items[2].preFloatAdjusted == undefined ? 0 : res.shiftName.scheduleShiftInfo[0].items[2].preFloatAdjusted;  //三段班上班浮动值
						var nextFloatAdjusted3 = res.shiftName.scheduleShiftInfo[0].items[2].nextFloatAdjusted == undefined ? 0 : res.shiftName.scheduleShiftInfo[0].items[2].nextFloatAdjusted;
					    
					    var preFloatTime3 = that.preDF(preDateTime3 , preFloatAdjusted3);
						var nextFloatTime3 = that.nextDF(nextDateTime3 , nextFloatAdjusted3);
					  
					    $('#coreTime').append(";" + preFloatTime2 + "-" + nextFloatTime2 + ";" + preFloatTime3 + "-" + nextFloatTime3);
						$('#shiftTime').append(";"+preTime2+"-"+nextTime2);
						$('#shiftTime').append(";"+preTime3+"-"+nextTime3);
						var segmentInRest2 = segmentInRest2 == undefined ? 0 : segmentInRest2;
						var segmentInRest3 = segmentInRest3 == undefined ? 0 : segmentInRest3;
					}
				 if((items == 1 && segmentInRest1 == 0) || (items == 2 && segmentInRest2 == 0 && segmentInRest1 == 0) || (items == 3 && segmentInRest3 == 0&& segmentInRest2 == 0 && segmentInRest1 == 0)){
				        $('#restTimeTitle').hide();
					}
				 else{
				 	 if(segmentInRest1 != 0 && restPreTime != "" && restPreTime != undefined){
				 		$('#restTime').html(restPreTime+"-"+restNextTime);
				 	}if(segmentInRest1 != 0 && (restPreTime == "" || restPreTime == undefined)){
				 	    $('#restTime').html(segmentInRest1);
				 	}if(items == 2){
				 		$('#restTime').append(";"+ segmentInRest2);
				 	}if(items == 3){
				 		$('#restTime').append(";"+ segmentInRest2 +";"+ segmentInRest3);
				 	}
				}
				}
				 $('#realWorkTime').html(res.realWorkTime);
				 
				 $('.danju').hide();
				 if(res.evection > 0){
					 $('#chuchaidanInfo')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_19,[atsMlUtile.numberToUserFormat(res.evection)]));
					 $('#chuchaidan').show();
				 }
				 if(res.overtime > 0){
					 $('#jiabandanInfo')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_20, [atsMlUtile.numberToUserFormat(res.overtime)]));
					 $('#jiabandan').show();
				 }
				 if(res.vacate > 0){
					 $('#qingjiadanInfo')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_25,[atsMlUtile.numberToUserFormat(res.vacate)]));
					 $('#qingjiadan').show();
				 }
				 if(res.addSignIn > 0){
					 $('#buqiandanInfo')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_12,[res.addSignIn]));
					 $('#buqiandan').show();
				 }
			 }
		});
	},
	
	/**
	 * 查看打卡记录
	 */
	initRecordDetail:function(){
		var that = this;
		$('#checkRecordBox').toggle(function(){
			that.remoteCall({
				 type:"post",
				 method:"getMyAttendanceDayPunchCardRecord",
				 param:{monthLimitDay: that.formatDate(that.year, that.month+1, that.curOptionDay)},
				 success:function(res){
					// console.log(res);
					 $('#checkRecordIcon').removeClass('checkRecordIconDown').addClass('checkRecordIconUp');
					 var recordList = '';
					 for(var i=0; i<res.length; i++){
						 recordList += '<li>' + res[i] + '</li>';
					 }
					 $('#recordList').show().html(recordList);
				 }
			});
		}, function(){
			$('#checkRecordIcon').removeClass('checkRecordIconUp').addClass('checkRecordIconDown');
			$('#recordList').hide();
		})
	},
	reloadRecordDetail:function(){
		var that = this;
		that.remoteCall({
				 type:"post",
				 method:"getMyAttendanceDayPunchCardRecord",
				 param:{monthLimitDay: that.formatDate(that.year, that.month+1, that.curOptionDay)},
				 success:function(res){
					// console.log(res);
					 //$('#checkRecordIcon').removeClass('checkRecordIconDown').addClass('checkRecordIconUp');
					 var recordList = '';
					 for(var i=0; i<res.length; i++){
						 recordList += '<li>' + res[i] + '</li>';
					 }
					 //$('#recordList').show().html(recordList);
					 $('#recordList').html(recordList);
				 }
			});
	},
	
	
	
	/**
	 * 初始化左侧统计信息
	 */
	initStatistic: function(){
		var that = this;
		this.remoteCall({
			 type:"post",
			 method:"getMyAttendanceMonthSum",
			 param:{monthLastDay: that.formatDate(that.year, that.month+1, that.lastDayInCurMonth)},
			 success:function(res){
			 	shr.loadScript("/shr/addon/attendmanage/web/js/shr/ats/util/atsMlUtile.js",function(){
					 $('#isOvertimeStatistic')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_20,[atsMlUtile.numberToUserFormat(res.overtime)]));
					 $('#isVacateStatistic')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_25,[atsMlUtile.numberToUserFormat(res.vacate)]));
					 $('#isEvectionStatistic')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_19,[atsMlUtile.numberToUserFormat(res.evection)]));
					 $('#isAddSignInStatistic')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_12,[res.addSignIn]));
					 $('#isLateStatistic')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_18,[res.late]));
					 $('#isEarlyStatistic')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_30,[res.early]));
					 $('#isAbsenceStatistic')
						 .html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_23,[res.absence]));
					 if(!that.hasInitialed){
						 var islackCardStatistic = $('<div class="workStatistic"></div>');
						 islackCardStatistic.append('<div class="isLackCard"></div>');
						 islackCardStatistic.append('<div id="islackCardStatistic">' + shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_50,[0]) + '</div>');
						 $('#isAbsenceStatistic').parent().after(islackCardStatistic);
						 that.hasInitialed = true;
					 }
					 $('#islackCardStatistic').html(shr.formatMsg(jsBizMultLan.atsManager_employeeBoard_i18n_50,[(res.lackCard || 0)]));
				 });
			 }
		});
		
		$('#settingShow').click(function(){
			localStorage.setItem('planWorkTimeclass', 'newPlanWorkTimeShow');
			$('.newPlanWorkTimeHide').attr('class', 'newPlanWorkTimeShow');
			$(this).hide();
		});
		
		$('#settingHide').click(function(){
			localStorage.setItem('planWorkTimeclass', 'newPlanWorkTimeHide');
			$('.newPlanWorkTimeShow').attr('class', 'newPlanWorkTimeHide');
			$(this).hide();
		});
		
		$("#setting").toggle(function(){
			var planWorkTimeclass = localStorage.getItem('planWorkTimeclass');
			if(planWorkTimeclass === 'newPlanWorkTimeHide'){
				$('#settingShow').fadeIn();
			}else if(planWorkTimeclass === 'newPlanWorkTimeShow'){
				$('#settingHide').fadeIn();
			}else{
				$('#settingShow').fadeIn();
			}
		}, function(){
			$('#settingHide,#settingShow').fadeOut();
		});
	},
	
	
	initStatistic1: function(){
		var that = this;
		this.remoteCall({
			 type:"post",
			 method:"getMyAttendanceMonthSum",
			 param:{monthLastDay: that.formatDate(that.year, that.month+1, that.lastDayInCurMonth)},
			 success:function(res){
			 	shr.loadScript("/shr/addon/attendmanage/web/js/shr/ats/util/atsMlUtile.js",function(){
			 		$(".workStatistic").remove();
			 		var list = res.attenData.valueOf(0);
			 		for(var i = 0;i < list.length;i++){
			 			 var name = list[i].name;//悬浮显示的名字	
						 var nameShow = name.substring(0,8);		 			 
			 			 var value = list[i].value;
			 			 var attProName = list[i].columnNo;
			 			 var attNumber = list[i].fNumber;
			 			 var isInternal = list[i].isInternal;//是否系统内置
						 var content =  nameShow + ':'+ value;
						 var ralcontent = name + ':' + value;
						 switch(Number(attProName)){
						     case 24://补卡次数
						     attProShow = $('<div class="workStatistic"></div>').attr('title',ralcontent);
							 attProShow.append('<div class="attProClass" id = "24"></div>');
							 attProShow.append('<div id="isAttProShowStatistic">' + content +' </div>');
							 $('#attPro').append(attProShow);
							 $("#24").css("background-image","url(/shr/addon/attendmanage/web/resource/images/isAddSignIn.png)");
							 break;
							 case 65://加班时长
						     attProShow = $('<div class="workStatistic"></div>').attr('title',ralcontent);
							 attProShow.append('<div class="attProClass" id = "65"></div>');
							 attProShow.append('<div id="isAttProShowStatistic">' + content +' </div>');
							 $('#attPro').append(attProShow);
							 $("#65").css("background-image","url(/shr/addon/attendmanage/web/resource/images/isOvertime.png)");
							 break;
							 case 18://迟到次数
						     attProShow = $('<div class="workStatistic"></div>').attr('title',ralcontent);
							 attProShow.append('<div class="attProClass" id = "18"></div>');
							 attProShow.append('<div id="isAttProShowStatistic">' + content +' </div>');
							 $('#attPro').append(attProShow);
							 $("#18").css("background-image","url(/shr/addon/attendmanage/web/resource/images/isLate.png)");
							 break;
							 case 28://请假时长
						     attProShow = $('<div class="workStatistic"></div>').attr('title',ralcontent);
							 attProShow.append('<div class="attProClass" id = "28"></div>');
							 attProShow.append('<div id="isAttProShowStatistic">' + content +' </div>'); 
							 $('#attPro').append(attProShow);
							 $("#28").css("background-image","url(/shr/addon/attendmanage/web/resource/images/isVacate.png)");
							 break;
							 case 30://出差天数
						     attProShow = $('<div class="workStatistic"></div>').attr('title',ralcontent);
							 attProShow.append('<div class="attProClass" id = "30"></div>');
							 attProShow.append('<div id="isAttProShowStatistic">' + content +' </div>');
							 $('#attPro').append(attProShow);
							 $("#30").css("background-image","url(/shr/addon/attendmanage/web/resource/images/isEvection.png)");
							 break;
							 case 38://缺卡次数
						     attProShow = $('<div class="workStatistic"></div>').attr('title',ralcontent);
							 attProShow.append('<div class="attProClass" id = "38"></div>');
							 attProShow.append('<div id="isAttProShowStatistic">' + content +' </div>');
							 $('#attPro').append(attProShow);
							 $("#38").css("background-image","url(/shr/addon/attendmanage/web/resource/images/isLackCard.png)");
							 break;
							 case 20://早退次数
						     attProShow = $('<div class="workStatistic"></div>').attr('title',ralcontent);
							 attProShow.append('<div class="attProClass" id = "20"></div>');
							 attProShow.append('<div id="isAttProShowStatistic">' + content +' </div>');
							 $('#attPro').append(attProShow);
							 $("#20").css("background-image","url(/shr/addon/attendmanage/web/resource/images/isEarly.png)");
							 break;
							 case 22://旷工次数
						     attProShow = $('<div class="workStatistic"></div>').attr('title',ralcontent);
							 attProShow.append('<div class="attProClass" id = "22"></div>');
							 attProShow.append('<div id="isAttProShowStatistic">' + content +' </div>');
							 $('#attPro').append(attProShow);
							 $("#22").css("background-image","url(/shr/addon/attendmanage/web/resource/images/isAbsence.png)");
							 break;
							 default :
						     attProShow = $('<div class="workStatistic"></div>').attr('title',ralcontent);
							 attProShow.append('<div class="attProClass" name="default01"  id = "default01"></div>');
							 attProShow.append('<div id="isAttProShowStatistic">' + content +' </div>');
							 $('#attPro').append(attProShow);
							 $("div[name='default01']").css("background-image","url(/shr/addon/attendmanage/web/resource/images/wjy_xm_48_48.png)");
							 break;
						 }		 
			 		}			 					 		        
			 	});
			 }
		});
		
		$('#settingShow').click(function(){
			localStorage.setItem('planWorkTimeclass', 'newPlanWorkTimeShow');
			$('.newPlanWorkTimeHide').attr('class', 'newPlanWorkTimeShow');
			$(this).hide();
		});
		
		$('#settingHide').click(function(){
			localStorage.setItem('planWorkTimeclass', 'newPlanWorkTimeHide');
			$('.newPlanWorkTimeShow').attr('class', 'newPlanWorkTimeHide');
			$(this).hide();
		});
		
		$("#item_setting").toggle(function(){
			var planWorkTimeclass = localStorage.getItem('planWorkTimeclass');
			if(planWorkTimeclass === 'newPlanWorkTimeHide'){
				$('#settingShow').fadeIn();
			}else if(planWorkTimeclass === 'newPlanWorkTimeShow'){
				$('#settingHide').fadeIn();
			}else{
				$('#settingShow').fadeIn();
			}
		}, function(){
			$('#settingHide,#settingShow').fadeOut();
		});
	}
	,
	
	/**
	 * 我要加班
	 */
	iWannaWorkMoreTimeAction: function(){
		var dateValue = this.year + '-' + this.month + '-' + this.curDay;
		localStorage.removeItem("fromFlag");
		localStorage.setItem("fromFlag", "employeeBoard");
		sessionStorage.removeItem("empolyeeBoardFlag", "empolyeeBoardFlag");
		sessionStorage.setItem("empolyeeBoardFlag", "empolyeeBoardFlag");
		var url = shr.getContextPath()+"/dynamic.do?method=addNew&dateValue="+dateValue+"&uipk=com.kingdee.eas.hr.ats.app.AtsOverTimeBillForm";
		var leavebillDialog = $("#operationDialog");
		leavebillDialog.children("iframe").attr('src',url);
		leavebillDialog.dialog({
	 		autoOpen: true,
			title: jsBizMultLan.atsManager_employeeBoard_i18n_28,
			width:1300,
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
			close: function(){
			   	sessionStorage.removeItem("empolyeeBoardFlag", "empolyeeBoardFlag");
			}
		});
	},
	
	/**
	 * 我要请假
	 */
	iAskForLeaveAction: function(){
		var dateValue = this.year + '-' + this.month + '-' + this.curDay;
		var startAndEnd=$($("td.highLightBox")[0]).attr("data-date");
		if(!startAndEnd){
		startAndEnd=this.year + '-' + (this.month+1) + '-' + this.curDay;
		}
		localStorage.removeItem("fromFlag");
		localStorage.setItem("fromFlag", "employeeBoard");
		sessionStorage.removeItem("empolyeeBoardFlag", "empolyeeBoardFlag");
		sessionStorage.setItem("empolyeeBoardFlag", "empolyeeBoardFlag");
		var url = shr.getContextPath()+"/dynamic.do?method=addNew&dateValue="+dateValue+"&startAndEnd="+startAndEnd+"&uipk=com.kingdee.eas.hr.ats.app.AtsLeaveBillForm";
		var leavebillDialog = $("#operationDialog");
		leavebillDialog.children("iframe").attr('src',url);
		leavebillDialog.dialog({
	 		autoOpen: true,
			title: jsBizMultLan.atsManager_employeeBoard_i18n_29,
			width:1300,
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
			   	sessionStorage.removeItem("empolyeeBoardFlag", "empolyeeBoardFlag");
			}
		});
		
	},
	
	/**
	 * 我要出差
	 */
	iWannaOutForWorkAction: function(){
		var dateValue = this.year + '-' + this.month + '-' + this.curDay;
		var startAndEnd=$($("td.highLightBox")[0]).attr("data-date");
		if(!startAndEnd){
		startAndEnd=this.year + '-' + (this.month+1) + '-' + this.curDay;
		}
		localStorage.removeItem("fromFlag");
		localStorage.setItem("fromFlag", "employeeBoard");
		sessionStorage.removeItem("empolyeeBoardFlag", "empolyeeBoardFlag");
		sessionStorage.setItem("empolyeeBoardFlag", "empolyeeBoardFlag");
		var url = shr.getContextPath()+"/dynamic.do?method=addNew&dateValue="+dateValue+"&startAndEnd="+startAndEnd+"&uipk=com.kingdee.eas.hr.ats.app.AtsTripBillForm"+"&serviceId="+encodeURIComponent(shr.getUrlParams().serviceId);
		var tripBillDialog = $("#operationDialog");
			tripBillDialog.children("iframe").attr('src',url);
			tripBillDialog.dialog({
				title: jsBizMultLan.atsManager_employeeBoard_i18n_27,
				width:1300,
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
				close: function(){
				   	sessionStorage.removeItem("empolyeeBoardFlag", "empolyeeBoardFlag");
				}
			});
	},
	/**
	 * 我要调班
	 * @author rd_wesharn_wang
	 */
    iWannaScheduleShiftAction: function(){
  		var a = shrDataManager.pageNavigationStore.getDatas()[1];
  		a.name = jsBizMultLan.atsManager_employeeBoard_i18n_51;
  		shrDataManager.pageNavigationStore.pop();
  		shrDataManager.pageNavigationStore.addItem(a);
		this.reloadPage({
			uipk : 'hr.ats.myTurnShift'
		});
    },
    //我要补签
    iWannaAddSignInAction1: function(){
  		var a = shrDataManager.pageNavigationStore.getDatas()[1];
  		a.name = jsBizMultLan.atsManager_employeeBoard_i18n_52;
  		shrDataManager.pageNavigationStore.pop();
  		shrDataManager.pageNavigationStore.addItem(a);
 
		this.reloadPage({
			strdate : strFormatedDate,
			uipk : 'com.kingdee.eas.hr.ats.app.FillSignCardForm'//shr.getContextPath()+"/dynamic.do?method=addNew&strdate="+formatedDate+"&uipk=com.kingdee.eas.hr.ats.app.FillSignCardForm"
		});         //com.kingdee.eas.hr.ats.app.FillSignCardAllForm
    },
    //我要补签
     iWannaAddSignInAction: function(){
  		var dateValue = this.year + '-' + this.month + '-' + this.curDay;
		var startAndEnd=$($("td.highLightBox")[0]).attr("data-date");
		if(!startAndEnd){
		startAndEnd=this.year + '-' + (this.month+1) + '-' + this.curDay;
		}
		localStorage.removeItem("fromFlag");
		localStorage.setItem("fromFlag", "employeeBoard");
		sessionStorage.removeItem("empolyeeBoardFlag", "empolyeeBoardFlag");
		sessionStorage.setItem("empolyeeBoardFlag", "empolyeeBoardFlag");
		var url = shr.getContextPath()+"/dynamic.do?method=addNew&dateValue="+dateValue+"&startAndEnd="+startAndEnd+"&uipk=com.kingdee.eas.hr.ats.app.FillSignCardForm"+"&serviceId="+encodeURIComponent(shr.getUrlParams().serviceId);
		var tripBillDialog = $("#operationDialog");
			tripBillDialog.children("iframe").attr('src',url);
			tripBillDialog.dialog({
				title:jsBizMultLan.atsManager_employeeBoard_i18n_52,
				width:1300,
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
				close: function(){
				   	sessionStorage.removeItem("empolyeeBoardFlag", "empolyeeBoardFlag");
				}
			});        
    },
    
    
	/**
	 * 给小于10的月份和年份前面加0,形成09的格式
	 */
	formatDate: function(year, month, day){
		var tMonth = month > 9 ? month : ('0' + month);
		var tDay = day > 9 ? day : ('0' + day);
		if(arguments.length > 2)
			return year + '-' + tMonth + '-' + tDay;
		else 
			return year + '-' + tMonth;
	},
	/**
	 * 处理上班浮动时间
	 */
	preDF : function(preDateTime,preFloat){
		var preFloat  = Number(preFloat);
		var preDateTime = new Date(preDateTime);
		var tempPreDateTime = new Date(preDateTime.getTime() + preFloat * 60 * 1000);
		var preFloatTime = tempPreDateTime.toTimeString(); 
	    var preTime = preFloatTime.substring(0,5)
	    return preTime;
	},
	/**
	 * 处理下班浮动时间
	 */
	nextDF : function(nextDateTime,nextFloat){
		var nextFloat  = Number(nextFloat);
		var nextDateTime = new Date(nextDateTime);
		var tempNextDateTime = new Date(nextDateTime.getTime() - nextFloat * 60 * 1000);
		var nextFloatTime = tempNextDateTime.toTimeString(); 
	    var nextTime = nextFloatTime.substring(0,5)
	    return nextTime;
	}
	
 
});


//为休息日与法定假日设置背景色
function getColorTitle( tdThis, value){
	var _self = tdThis;
	if (value == 1) {
		$(_self).addClass('list-Green-color');
	}else if (value == 2) {
		$(_self).addClass('list-pink-color');
	}else if(value == 0){
		$(_self).addClass('invalid-color');
	}
}


function changeDialogTitle(title){
  $("#operationDialog").parent().children(".ui-dialog-titlebar").children(".ui-dialog-title").text(title);
}


