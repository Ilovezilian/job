shr.defineClass("shr.ats.managerSelf", shr.framework.List,{
	year: null,
	month: null,
	maxYear: null,
	maxMonth: null,
	curDay: null,
	curOptionDay: null, 
	lastDayInCurMonth: null,
	adminOrgUnitIdV: null,
	adminOrgUnitLongNumber: null,
	isOvertimeClick:false,
	isEvectionClick:false,
	isVacateClick:false,
	isAddSignInClick:false,
	isLateClick:true,
	isEarlyClick:true,
	isAbsenceClick:true,
	initalizeDOM : function () {
		shr.ats.managerSelf.superClass.initalizeDOM.call(this);
		var date = new Date();
		this.year = date.getFullYear();
		this.month = date.getMonth();
		this.maxYear = this.year;
		this.maxMonth = this.month;
		this.curDay = date.getDate();
		var nextMonthFirstDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
		var monthLastDayDate = new Date(nextMonthFirstDay-86400000);
		this.lastDayInCurMonth = monthLastDayDate.getDate();
		this.setDefaultAdminOrgUnit();
		
		this.initPage();
		this.initCalendar();
		this.initStatistic();
		this.initRecordDetail();
		this.initRightInfoDetail();
		var event = [];
		event.day = this.curDay;
		this.initKaoqinInfo(event);

		$('#monthInfo').html((this.month + 1) > 9 ? (this.month +1) : '0'+ (this.month +1));
		$('#yearInfo').html(this.year 
				+ jsBizMultLan.atsManager_managerSelf_i18n_22
			+ $.shrI18n.dateI18n.month2[this.month]);
		
		$("#unusualInfo").show();
		 $("#unusualDate").html(this.year + jsBizMultLan.atsManager_managerSelf_i18n_22
			 + $.shrI18n.dateI18n.month([this.month])
			 + this.curDay + jsBizMultLan.atsManager_managerSelf_i18n_23);
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
				
			$('#monthInfo').html((that.month + 1) > 9 ? (that.month +1) : '0'+ (that.month +1));
			$(jsBizMultLan.atsManager_managerSelf_i18n_0
				+ $.shrI18n.dateI18n.month2[that.month]);
	
			that.initStatistic();
			that.initCalendar();
		});
	},
	
	initCalendar: function(){
		var that = this;
		this.remoteCall({
			 type:"post",
			 method:"getManagerSelfAttendanceDetail",
			 param:{monthLastDay: that.formatDate(that.year, that.month+1, that.lastDayInCurMonth),
			        adminOrgUnitId:that.adminOrgUnitIdV,
					isOvertimeClick:that.isOvertimeClick,
	                isEvectionClick:that.isEvectionClick,
	                isVacateClick:that.isVacateClick,
	                isAddSignInClick:that.isAddSignInClick,
	                isLateClick:that.isLateClick,
	                isEarlyClick:that.isEarlyClick,
	                isAbsenceClick:that.isAbsenceClick,
					longNumber:that.adminOrgUnitLongNumber
			 },
			 success:function(res){
				 var events = [];
				 for(var i=0; i<res.length; i++){
					 var event = {};
					 event.day = res[i].day;
					 event.start = new Date(that.year, that.month, res[i].day);
					 event.hasUnusual = res[i].hasUnusual;
					 event.unusualWorkTime = res[i].unusualWorkTime;
					 event.planWorkTime = res[i].planWorkTime;
					 event.isOvertime = res[i].isOvertime;
					 event.isEvection = res[i].isEvection;
					 event.isAddSignIn = res[i].isAddSignIn;
					 event.isVacate = res[i].isVacate;
					 event.isLate = res[i].isLate;
					 event.isEarly = res[i].isEarly;
					 event.isAbsence = res[i].isAbsence;
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
							jsBizMultLan.atsManager_managerSelf_i18n_27,
							jsBizMultLan.atsManager_managerSelf_i18n_31,
							jsBizMultLan.atsManager_managerSelf_i18n_25,
							jsBizMultLan.atsManager_managerSelf_i18n_28,
							jsBizMultLan.atsManager_managerSelf_i18n_29,
							jsBizMultLan.atsManager_managerSelf_i18n_30,
							jsBizMultLan.atsManager_managerSelf_i18n_26
						],
						monthNamesShort: [
							jsBizMultLan.atsManager_managerSelf_i18n_11,
							jsBizMultLan.atsManager_managerSelf_i18n_12,
							jsBizMultLan.atsManager_managerSelf_i18n_13,
							jsBizMultLan.atsManager_managerSelf_i18n_14,
							jsBizMultLan.atsManager_managerSelf_i18n_15,
							jsBizMultLan.atsManager_managerSelf_i18n_16,
							jsBizMultLan.atsManager_managerSelf_i18n_17,
							jsBizMultLan.atsManager_managerSelf_i18n_18,
							jsBizMultLan.atsManager_managerSelf_i18n_19,
							jsBizMultLan.atsManager_managerSelf_i18n_8,
							jsBizMultLan.atsManager_managerSelf_i18n_9,
							jsBizMultLan.atsManager_managerSelf_i18n_10
						],
						monthNames: [
							jsBizMultLan.atsManager_managerSelf_i18n_11,
							jsBizMultLan.atsManager_managerSelf_i18n_12,
							jsBizMultLan.atsManager_managerSelf_i18n_13,
							jsBizMultLan.atsManager_managerSelf_i18n_14,
							jsBizMultLan.atsManager_managerSelf_i18n_15,
							jsBizMultLan.atsManager_managerSelf_i18n_16,
							jsBizMultLan.atsManager_managerSelf_i18n_17,
							jsBizMultLan.atsManager_managerSelf_i18n_18,
							jsBizMultLan.atsManager_managerSelf_i18n_19,
							jsBizMultLan.atsManager_managerSelf_i18n_8,
							jsBizMultLan.atsManager_managerSelf_i18n_9,
							jsBizMultLan.atsManager_managerSelf_i18n_10
						],
						editable: true,
						disableDragging: true,
						events: events,
						eventRender: function(event, element) {
						},
						eventAfterRender : function(event, element, view) {
							var config = '<div class="usualBox"></div>';
							if(event.day == that.curDay){
								config = '<div class="usualBox_today"></div>';
							}
							
							config += '<div class="lateOrEarylyOrAbsenceIcon">';
							if(event.isLate){
								config += '<div class="isLate"></div>';
							}
							if(event.isEarly){
								config += '<div class="isEarly"></div>';
							}
							if(event.isAbsence){
								config += '<div class="isAbsence"></div>';
							}
							config += '</div>';
							
							config += '<div class="markableIconBox">'
							if(event.isOvertime==true){
								config = config + '<div class="isOvertime cusor_pointer"></div>';
							}
							if(event.isVacate==true){
								config = config + '<div class="isVacate cusor_pointer"></div>';
							}
							if(event.isEvection==true){
								config = config + '<div class="isEvection cusor_pointer"></div>';
							}
							if(event.isAddSignIn==true){
								config = config + '<div class="isAddSignIn cusor_pointer"></div>';
							}
							config += '</div>'
							element.html(config);
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
							
							if(event.day == that.curDay){
								that.initKaoqinInfo(event); 
							}
							
							var tar = e.target;
							
							if($(tar).hasClass('unusualday') || $(tar).hasClass('hasUnusual')){
								if(event.hasUnusual == true){
									that.initKaoqinInfo(event);
								}
							}else if($(tar).hasClass('usualBox') || $(tar).hasClass('usualBox_today')){
								that.initKaoqinInfo(event); 
							}
							
							if($(tar).hasClass('isLate')){
								that.initKaoqinInfo(event);
								that.openDialogByIcon('isLate', event);
							}else if($(tar).hasClass('isEarly')){
								that.initKaoqinInfo(event);
								that.openDialogByIcon('isEarly',event);
							}else if($(tar).hasClass('isAbsence')){
								that.initKaoqinInfo(event);
								that.openDialogByIcon('isAbsence',event);
							}else if($(tar).hasClass('isOvertime')){
							    that.initKaoqinInfo(event);
								that.openDialogByIcon('isOvertime',event);
							} else if($(tar).hasClass('isVacate')){
								that.initKaoqinInfo(event);
								that.openDialogByIcon('isVacate',event);
							} else if($(tar).hasClass('isEvection')){
								that.initKaoqinInfo(event);
								that.openDialogByIcon('isEvection',event);
							} else if($(tar).hasClass('isAddSignIn')){
								that.initKaoqinInfo(event);
								that.openDialogByIcon('isAddSignIn', event);
							}
						},
						dayClick: function(date, allDay, jsEvent, view) {
							
						}
					});
				 $('.unusualBox_today, .usualBox_today').parent('div').css('background', '#fcf8e3');
			 }
		});
	},
	
	/**
	 * 初始化考情详细信息页
	 */
	initKaoqinInfo: function(event){
		if(event.day !== this.curDay){
			$('td[data-date^=' + this.formatDate(this.year, this.month + 1) + ']').removeClass('highLightBox');
			$('td[data-date=' + this.formatDate(this.year, this.month + 1, event.day) + ']').addClass('highLightBox');
		}
		if(event.day === this.curDay){
			$('td[data-date^=' + this.formatDate(this.year, this.month + 1) + ']').removeClass('highLightBox');
		}
		
		var that = this;
		that.curOptionDay = event.day;
		
		this.remoteCall({
			 type:"post",
			 method:"getManagerSelfAttendanceDaySum",
			 param:{monthLimitDay: that.formatDate(that.year, that.month+1, event.day),
			     adminOrgUnitId:that.adminOrgUnitIdV,
				 longNumber:that.adminOrgUnitLongNumber
			 },
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
			 	
				 $('#unusualInfo').show();
				 $("#unusualDate").html(that.year + jsBizMultLan.atsManager_managerSelf_i18n_22
					 + $.shrI18n.dateI18n.month([that.month])
					 + event.day + jsBizMultLan.atsManager_managerSelf_i18n_23);
				 
				 if(res.evection > 0){
					 $('#evectionV').text(res.evection);
				 }else{
					 $('#evectionV').text(0);
				 }
				 if(res.overtime > 0){
					$('#overtimeV').text(res.overtime);
				 }else{
					 $('#overtimeV').text(0);
				 }
				 if(res.vacate > 0){
					 $('#vacateV').text(res.vacate);
				 }else{
					 $('#vacateV').text(0);
				 }
				 if(res.addSignIn > 0){
					 $('#addSignV').text(res.addSignIn);
				 }else{
					 $('#addSignV').text(0);
				 }
				 if(res.notPunchCard > 0){
					 $('#notPunchCardV').text(res.notPunchCard);
				 }else{
					 $('#notPunchCardV').text(0);
				 }
				 if(res.late>0){
					 $('#lateV').text(res.late);
				 }else{
					  $('#lateV').text(0);
				 }
				 if(res.early>0){
					 $('#earlyV').text(res.early);
				 }else{
					 $('#earlyV').text(0);
				 }
				 if(res.absence>0){
					 $('#absenceV').text(res.absence);
				 }else{
					 $('#absenceV').text(0);
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
			 method:"getManagerSelfAttendanceMonthSum",
			 param:{monthLastDay: that.formatDate(that.year, that.month+1, that.lastDayInCurMonth),
			        adminOrgUnitId: that.adminOrgUnitIdV,
					longNumber:that.adminOrgUnitLongNumber
			 },
			 success:function(res){
				 $("#isOvertimeStatistic").html(shr.formatMsg(jsBizMultLan.atsManager_managerSelf_i18n_4,[res.overtimePersonCount, Math.floor(res.overtime)]));
				 $("#isVacateStatistic").html(shr.formatMsg(jsBizMultLan.atsManager_managerSelf_i18n_6, [res.vacatePersonCount,res.vacate]));
				 $("#isEvectionStatistic").html(shr.formatMsg(jsBizMultLan.atsManager_managerSelf_i18n_3,[res.evectionPersonCount,res.evection]));
				 $("#isAddSignInStatistic").html(shr.formatMsg(jsBizMultLan.atsManager_managerSelf_i18n_1, [res.addSignInPersonCount,res.addSignIn]));
				 $("#isLateStatistic").html(shr.formatMsg(jsBizMultLan.atsManager_managerSelf_i18n_2, [res.latePersonCount,res.late]));
				 $("#isEarlyStatistic").html(shr.formatMsg(jsBizMultLan.atsManager_managerSelf_i18n_7, [res.earlyPersonCount, res.early]));
				 $("#isAbsenceStatistic").html(shr.formatMsg(jsBizMultLan.atsManager_managerSelf_i18n_5,[res.absencePersonCount, res.absence]));
			 }
		});
		if(that.isLateClick == true){
			$("#isLateStatistic").addClass("hrefStyle");
		}
		if(that.isEarlyClick == true){
			$('#isEarlyStatistic').addClass("hrefStyle");
		}
		if(that.isAbsenceClick == true){
			$("#isAbsenceStatistic").addClass("hrefStyle");
		}
		$("#isOvertimeStatistic").toggle(function(){
			that.isOvertimeClick = true;
			$("#isOvertimeStatistic").addClass("hrefStyle");
			that.initCalendar();
		},
		function(){
			that.isOvertimeClick = false;
			$("#isOvertimeStatistic").removeClass("hrefStyle");
			that.initCalendar();
		});
		
		$('#isVacateStatistic').toggle(function(){
			that.isVacateClick = true;
			$("#isVacateStatistic").addClass("hrefStyle");
			that.initCalendar();
		},
		function(){
			that.isVacateClick = false;
			$("#isVacateStatistic").removeClass("hrefStyle");
			that.initCalendar();
		});
		
		$('#isEvectionStatistic').toggle(function(){
			that.isEvectionClick = true;
			$("#isEvectionStatistic").addClass("hrefStyle");
			that.initCalendar();
 		},
		function(){
			that.isEvectionClick = false;
			$("#isEvectionStatistic").removeClass("hrefStyle");
			that.initCalendar();
		});
		
		$('#isAddSignInStatistic').toggle(function(){
			that.isAddSignInClick = true;
			$("#isAddSignInStatistic").addClass("hrefStyle");
			that.initCalendar();
		},
		function(){
			that.isAddSignInClick = false;
			$("#isAddSignInStatistic").removeClass("hrefStyle");
			that.initCalendar();
		});
		
		$('#isLateStatistic').toggle(function(){
			that.isLateClick = false;
				$("#isLateStatistic").removeClass("hrefStyle");
				that.initCalendar();
			
		},function(){
			that.isLateClick = true;
				$("#isLateStatistic").addClass("hrefStyle");
				that.initCalendar();
		});
		
		$('#isEarlyStatistic').toggle(function(){
			that.isEarly = false;
			$('#isEarlyStatistic').removeClass("hrefStyle");
			that.initCalendar();
		},function(){
			that.isEarly = true;
			$('#isEarlyStatistic').addClass("hrefStyle");
			that.initCalendar();
		});
		
		$('#isAbsenceStatistic').toggle(function(){
			that.isAbsenceClick = false;
			$("#isAbsenceStatistic").removeClass("hrefStyle");
			that.initCalendar();
		},
		function(){
			that.isAbsenceClick = true;
			$("#isAbsenceStatistic").addClass("hrefStyle");
			that.initCalendar();
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
	initRightInfoDetail:function(){
		var that = this;
		$(".infoCircle").click(function(){
			$(".sanj").addClass("noSanj");
		    $(".sanj").removeClass("sanj");
			var noSanj = $(this).parent(".detailInfo").find(".noSanj");
			noSanj.addClass("sanj");
			noSanj.removeClass("noSanj");
			var id = $(this).attr("id");
			var attendResultFlag = "";
			if(id == "notPunchCardV"){//缺卡
				uipk = 'com.kingdee.eas.hr.ats.app.AttenceResult.list';
				attendResultFlag = "notPunchCard";
			}
			if(id == "lateV"){//迟到
				uipk = 'com.kingdee.eas.hr.ats.app.AttenceResult.list';
				attendResultFlag = "late";
			}
			if(id == "earlyV"){//早退
				uipk = 'com.kingdee.eas.hr.ats.app.AttenceResult.list';
				attendResultFlag = "early";
			}
			if(id == "absenceV"){//旷工
				uipk = 'com.kingdee.eas.hr.ats.app.AttenceResult.list';
				attendResultFlag = "absence";
			}
		    if(id == "vacateV"){
				uipk = 'com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList';
			}else if(id == "overtimeV"){
				uipk = 'com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllList';
			}else if(id == "evectionV"){
				uipk = 'com.kingdee.eas.hr.ats.app.AtsTripBillAllList';
			}else if(id == "addSignV"){
				uipk = 'com.kingdee.eas.hr.ats.app.FillSignCardAllList';
			}
			that.openDialog(uipk, '', attendResultFlag);
		});
		
	},
	openDialog: function(uipk, selectDate, attendResultFlag){
		var that =this;
		var selectDateV = "";
		if(selectDate){
			selectDateV = selectDate;
		}else{
		 var unusualDate = $("#unusualDate").text();
		 unusualDate = unusualDate.replace(jsBizMultLan.atsManager_managerSelf_i18n_22, "-");
		 var year = $("#unusualDate").text().split(jsBizMultLan.atsManager_managerSelf_i18n_22)[0];
		 var month = $("#unusualDate").text().split(jsBizMultLan.atsManager_managerSelf_i18n_22)[1]
			 .split(jsBizMultLan.atsManager_managerSelf_i18n_24)[0];
		 var day = $("#unusualDate").text().split(jsBizMultLan.atsManager_managerSelf_i18n_22)[1]
			 .split(jsBizMultLan.atsManager_managerSelf_i18n_24)[1]
			 .split(jsBizMultLan.atsManager_managerSelf_i18n_23)[0];
		 selectDateV = that.formatDate(year,month,day);
		}
		var adminOrgUnitLongNumber = $("#treeNavigation").children().children().find(".active").attr("longnumber");
		$("#operationDialog-frame").attr("src",shr.getContextPath()+ '/dynamic.do?uipk=' + uipk + '&dateValue=' + selectDateV + "&managerSelfFlag="+ true + "&adminOrgUnitLongNumber=" + adminOrgUnitLongNumber + "&attendResultFlag=" + attendResultFlag);
							$("#operationDialog-frame").dialog({
								modal : false,
								title : jsBizMultLan.atsManager_managerSelf_i18n_21,
								width : 850,
								minWidth : 850,
								height : 540,
								minHeight : 540,
								position: [90,190],
								open : function(event, ui) {
								},
								close : function() {
									$(".sanj").addClass("noSanj");
		                            $(".sanj").removeClass("sanj");
								}
							});
							$("#operationDialog-frame").attr("style", "width:850px;height:460px;");
							
	},
	openDialogByIcon: function(id, event){
		var that = this;
		var year = that.year;
		var month = that.month+1;
		var day = event.day;
		var selectDate = that.formatDate(year, month, day);
		var attendResultFlag = "";
		if(id == 'notPunchCardV'){//缺卡
			uipk = 'com.kingdee.eas.hr.ats.app.AttenceResult.list';
			attendResultFlag = "notPunchCard";
			that.createSanjIcon("notPunchCardV");
			that.openDialog(uipk, selectDate, attendResultFlag);
		}else if(id == 'isLate'){//迟到
			uipk = 'com.kingdee.eas.hr.ats.app.AttenceResult.list';
			attendResultFlag = "late";
			that.createSanjIcon("lateV");
			that.openDialog(uipk, selectDate, attendResultFlag);
		}else if(id == 'isEarly'){//早退
			uipk = 'com.kingdee.eas.hr.ats.app.AttenceResult.list';
			attendResultFlag = "early";
			that.createSanjIcon("earlyV");
			that.openDialog(uipk, selectDate, attendResultFlag);
		}else if(id == 'isAbsence'){//旷工
			uipk = 'com.kingdee.eas.hr.ats.app.AttenceResult.list';
			attendResultFlag = "absence";
			that.createSanjIcon("absenceV");
			that.openDialog(uipk, selectDate, attendResultFlag);
		}else if(id == 'isVacate'){//请假
			uipk = 'com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList';
			that.createSanjIcon("vacateV");
			that.openDialog(uipk, selectDate, "");
		}else if(id == 'isOvertime'){//加班
			uipk = 'com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllList';
			that.createSanjIcon("overtimeV");
			that.openDialog(uipk, selectDate, "");
		}else if(id == 'evection'){//出差
			uipk = 'com.kingdee.eas.hr.ats.app.AtsTripBillAllList';
			that.createSanjIcon("evectionV");
			that.openDialog(uipk, selectDate, "");
		}else if(id == 'isAddSignIn'){//补签
			uipk = 'com.kingdee.eas.hr.ats.app.FillSignCardAllList';
			that.createSanjIcon("addSignV");
			that.openDialog(uipk, selectDate, "");
		}
	},
	createSanjIcon: function(id){
		var noSanj = $("#" + id).parent(".detailInfo").find(".noSanj");
		noSanj.addClass("sanj");
		noSanj.removeClass("noSanj");
	},
	/**
	 * 重写父类选择导航节点的方法
	 */
	queryGridByEvent: function(e) {	
	    var viewPage = shr.getCurrentViewPage();
	    viewPage.adminOrgUnitIdV = $("#treeNavigation").children().children().find(".active").attr("id");
		viewPage.adminOrgUnitLongNumber = $("#treeNavigation").children().children().find(".active").attr("longnumber");
		viewPage.initStatistic();
		viewPage.initCalendar();
	},
	initPage:function(){
		$("#breadcrumb li").eq(1).text(jsBizMultLan.atsManager_managerSelf_i18n_20);
		$(".shr-toolbar").closest('div[class^="row-fluid"]').remove();
		$("#searcher").remove();
	},
	setDefaultAdminOrgUnit: function(){
		this.remoteCall({
			 type:"post",
			 async:false,
			 method:"getDefaultAdminOrgUnitInfo",
			 param:{
			 },
			 success:function(res){
				var nodes = [];
				 for(var i=0; i<res.length; i++){
					var node = {};
					node.id=res[i].id;
					node.longNumber=res[i].longNumber;
					node.isLeaf=res[i].isLeaf;
					node.name=res[i].name;
					nodes.push(node);
				 }
				 $("#treeNavigation").shrGridNavigation("loadNavigation", nodes);
			 }
		});
	}
});

