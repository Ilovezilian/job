var _globalObject = null;
shr.defineClass("shr.ats.myTurnShift",shr.framework.Edit, {
	clickFlag: false,
	grids: 42,
    eventCounts: "",
	strBeginDate: "",
	strEndDate: "",
	beginDate: null,
	endDate: null,
	month:null,
	year: null,
	switchType:"2",
	_clickPosition : [],
	_listRowDatas : [],
	_events: [],
	shifts:[],
	staticShifts: [],
	//shifts :[],
	noShift: null,
	numbers : [],
	
	initalizeDOM:function(){
		var that = this;
		shr.ats.myTurnShift.superClass.initalizeDOM.call(this);
		_globalObject = this;
		$('input[name^=shiftType]').shrRadio();		
		$($(".iradio_minimal-grey")).css("float", "left");		//让文字与radio对齐
		$('.row-fluid [class*="col-lg"]').css("min-height","20px"); //缩小设置时间和排班方式距离
		$("#setTime").find(".col-lg-4").css({"width":"100px" , "margin-left":"70px"});//调整时间样式
		that.noShift = shr.getUrlRequestParam("noShift");
		that.setSystemTime();
		that.calendarShift();//默认日历式
		that.initStatistic();
		$('#monthInfo').html((this.month + 1) > 9 ? (this.month +1) : '0'+ (this.month +1));
		$('#yearInfo')
			.html(this.year + jsBizMultLan.atsManager_myTurnShift_i18n_20
			+ $.shrI18n.dateI18n.month2[this.month]);
		that.checkAttendanceFile();
				
	}
	,initStatistic: function(){

		 $('#isOvertimeStatistic')
			 .html(jsBizMultLan.atsManager_myTurnShift_i18n_17+"<br>"
			 +jsBizMultLan.atsManager_myTurnShift_i18n_3+"<br>"
			 +jsBizMultLan.atsManager_myTurnShift_i18n_8);
/*		 $('#isVacateStatistic').html('请假 天数');
		 $('#isEvectionStatistic').html('出差 天数');
		 $('#isAddSignInStatistic').html('补签 次数');
		 $('#isLateStatistic').html('迟到 次数');
		 $('#isEarlyStatistic').html('早退 次数');
		 $('#isAbsenceStatistic').html('旷工 次数');*/
	}

	,setSystemTime:function(){
		var currentDate = new Date();
		var year = currentDate.getFullYear();    //获取完整的年份(4位,1970-????)
		var month = currentDate.getMonth();       //获取当前月份(0-11,0代表1月)
		var day = currentDate.getDate();        //获取当前日(1-31)
		//var day = 1;  
		month = (parseInt(month) + 1);
		
	    //this.strEndDate = getEndDate(year,month,day);
		//this.strEndDate = getUpDate(year,month,day);
		this.strBeginDate = getFirstDate(year,month);
		this.strEndDate  = getEndDate(year,month);
		if( month < 10){
			month = '0' + month;
		}
		if(day < 10){
			day = '0' + day;
		}
		
		//this.strBeginDate = year + '-'+ month + '-' + day;

		
		this.eventCounts = getEventCount(this.strBeginDate,this.strEndDate);
		
		sessionStorage.setItem("beginDate",this.strBeginDate);
		sessionStorage.setItem("endDate",this.strEndDate);
		
		this.beginDate  = new Date(this.strBeginDate.replace(/-/g, "/"));
		this.endDate  = new Date(this.strEndDate.replace(/-/g, "/"));
	}
	//校验考勤档案
	,checkAttendanceFile : function(){
		var that = this ;
			that.remoteCall({
				type:"post",
				method:"checkAttendanceFile",
				handler:"com.kingdee.shr.ats.web.handler.AtsScheduleShiftListHandler",
				uipk:"hr.ats.myTurnShift",
				async: true,
				success:function(res){
				}
			});
	
	}
	
	,setClickSection:function(rst){
		var that = this;
		//_clickPosition里面装载的是行列数据
		var minCol  = parseInt(that._clickPosition.pop());
		var minRow  = parseInt(that._clickPosition.pop());
		var maxCol =parseInt(that._clickPosition.pop());
		var maxRow =parseInt(that._clickPosition.pop());
		
		if(minRow > maxRow){
			var temp = minRow;
			minRow = maxRow;
			maxRow = temp;
		}
		if(minCol > maxCol){
			var temp = minCol;
			minCol = maxCol;
			maxCol = temp;
		}
		var url = shr.getContextPath() +'/dynamic.do?&method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list'
		                               + '&flag=turnShift';

		$("#iframe1").attr("src",url);
		$("#iframe1").dialog({
					modal: true,
					width:  1035,
					minWidth: 1035,
					height: 550,
					minHeight: 550,
					title : jsBizMultLan.atsManager_myTurnShift_i18n_24,
					open : function(event, ui) {
					},
					close : function() {
						var table = jQuery("#list_info");
						var dayValue = $("#iframe1").attr('title');
						var oldDayValue = dayValue;
						var tdObject = null,colName = null;
						for(var r=minRow;r<=maxRow;r++){
							for(var c=minCol;c<=maxCol;c++){
								tdObject = $("#"+r +">td")[c];
								if(dayValue == null && dayValue == undefined){
									dayValue = tdObject.title;
									oldDayValue = null;//用完之后置空
								}
								colName = rst.colModel[c - 1].name;
								(that._listRowDatas[r - 1])[colName] = dayValue;
								if(dayValue != null && dayValue != undefined){
									var dayTitle = getColorTitle($(tdObject),dayValue,true);
									if(dayTitle == '' || dayTitle.length == 0){
										table.setCell(r,c,null);
									}
									else{
										table.setCell(r,c,dayTitle);	
									}
									//同时更新列的title属性
									$(tdObject).attr('title',dayValue);
								}
								if(oldDayValue==null){//用完之后置空
									dayValue = null;
								}
							}
						}
						$("#iframe1").removeAttr("title");
					}
				});
		$("#iframe1").attr("style","width:1035px;height:550px;");	
	}
	,calendarShift:function(){
		//遮盖列表排班
		$('#list').css('display','none');
		//显示日历排班
		$('#calendar').css('display','block');
		//隐藏删除按钮
		$("#delete").css("display", "none");
		var that = this;
		$('#monthInfo').html( (that.beginDate.getMonth() + 1) > 9 ? (that.beginDate.getMonth() +1) : '0'+ (that.beginDate.getMonth() +1));
		//$('#yearInfo').html(that.beginDate.getFullYear() + jsBizMultLan.atsManager_myTurnShift_i18n_20 + ((that.beginDate.getMonth() +1) > 9 ? (that.beginDate.getMonth() +1) : '0'+ (that.beginDate.getMonth() +1)) + '月');
		$('#yearInfo')
			.html(that.beginDate.getFullYear() + jsBizMultLan.atsManager_myTurnShift_i18n_20 );
		that.month = that.beginDate.getMonth();
		that.year = that.beginDate.getFullYear();
		//initPersonList();  //初始化人员列表
		
		var clickLeft = true,clickRight = true;
		$('#monthSelector').find('i').unbind().click(function(e){
			var tar = e.target;
			if($(tar).hasClass('icon-caret-left')){
				if(clickLeft){
					if(that.month == 0){
						that.month = 11;
						that.year = that.year - 1;
					}
					else{
						that.month = that.month - 1;
					}
					//clickLeft = false;
					that.strBeginDate = getFirstDate(that.year,that.month+1);
					that.strEndDate  = getEndDate(that.year,that.month+1);
					that.beginDate  = new Date(that.strBeginDate.replace(/-/g, "/"));
					that.endDate  = new Date(that.strEndDate.replace(/-/g, "/"));
					clickLeft = true;
					clickRight = true;
				
				}
			}
			else if($(tar).hasClass('icon-caret-right')){
				if(clickRight){
					if(that.month == 11){
						that.month = 0;
						that.year = that.year + 1;
					}
					else{
						that.month = that.month + 1;
					}
					that.strBeginDate = getFirstDate(that.year,that.month+1);
					that.strEndDate  = getEndDate(that.year,that.month+1);
					that.beginDate  = new Date(that.strBeginDate.replace(/-/g, "/"));
					that.endDate  = new Date(that.strEndDate.replace(/-/g, "/"));
					clickLeft = true;
					//clickRight = false;
					clickRight = true;
					
				}
			}
/* 			$('#monthInfo').html((that.month + 1) > 9 ? (that.month +1) : '0'+ (that.month +1));
			$('#yearInfo').html(that.year+ jsBizMultLan.atsManager_myTurnShift_i18n_20 ); */
			$('#monthInfo').html((that.month + 1) > 9 ? (that.month +1) : '0'+ (that.month +1));
			$('#yearInfo')
				.html(that.year + jsBizMultLan.atsManager_myTurnShift_i18n_20
					+ $.shrI18n.dateI18n.month2[that.month]);
			that.clickFlag = false;
			that.initCalandar();
			
		});
		
	     //由于日历控件在初始化的时候，格式不对，所以采ajax对齐局部刷新
		 $.ajax({
				url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CalendarShiftHandler&method=flashPage",
				data: {beginDate:that.strBeginDate,endDate:that.strEndDate},
				dataType:'json',
				type: "POST",
				cache: false,
				success: function(data) {
					if(!data.flag){
						shr.showWarning({message: data.message});
						return;
					}
					else{
						that._events = data.rows;
						that.initCalandar();
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){
					that.initCalandar();
				}
		 });
	}
	/**
	 * 初始化日历控件
	 */
	,initCalandar:function(){
		
		var strFirstDateOfView = "" ;
		var firstDateOfView = "" ;
		var strLastDateOfView = "" ;
		var lastDateOfView = "" ;
		var cursorView = 0 ;
		
		var that = this;
		
		//var shifts = [];
		//var staticShifts = [];
		var index = 0;
		//由于日历控件在初始化的时候，格式不对，所以采ajax对齐局部刷新
		if(!that.clickFlag){
			 $.ajax({
					url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CalendarShiftHandler&method=flashPage",
					data: {beginDate:that.strBeginDate,endDate:that.strEndDate},
					dataType:'json',
					type: "POST",
					cache: false,
					success: function(data) {
						if(!data.flag){
							shr.showWarning({message: data.message});
							return;
						}
						else{
							
							 that._events = data.rows;
							 that.shifts = [];
							 that.staticShifts = [];
							
							
							//that.initCalandar();
						}
					},
					error:function(XMLHttpRequest, textStatus, errorThrown){
						//that.initCalandar();
					}
			 });
		}
		 
		 
		this.remoteCall({
		 type:"post",
		 method:"getScheduleShiftDetail",
		 handler:"com.kingdee.shr.ats.web.handler.AtsScheduleShiftListHandler",
		 uipk:"hr.ats.myTurnShift",
		 param:{firstDay: that.strBeginDate,lastDay:that.strEndDate},
		 success:function(res){
		if(!that.clickFlag){
				var validDrag = true;//有无调班单审批中的校验标志
				var fromDate="";
				var toDate="";
				var indexs = 0;
				var lastPosition = {};
				for(var i=0; i<res.length; i++){
					 var shift = {};
					 var staticShift = {};
					 
					 staticShift.planWorkTime = res[i].planWorkTime;
					 staticShift.shiftName = res[i].shiftName;	
					 staticShift.shiftId = res[i].shiftId;	
					 staticShift.strDate = res[i].strattendDate;
					 staticShift.dayType = res[i].dayType

					 shift.planWorkTime = res[i].planWorkTime;
					 shift.shiftName = res[i].shiftName;	
					 shift.shiftId = res[i].shiftId;	
					 shift.strDate = res[i].strattendDate;
					 shift.dayType = res[i].dayType
					  
					 that.staticShifts.push(staticShift);
					 that.shifts.push(shift);
				}
		}

			//shifts = staticShifts;
			 
			//var eventKey = [] ;
			$('#calendar_info').empty();
			$('#calendar_info').fullCalendar({
				header : {
						left : '',
						center : '',
						right : ''
					},
				contentHeight : 670,
				editable : true,
				year : that.year,
				month : that.month,
				dayNamesShort : [
					jsBizMultLan.atsManager_myTurnShift_i18n_28,
					jsBizMultLan.atsManager_myTurnShift_i18n_32,
					jsBizMultLan.atsManager_myTurnShift_i18n_26,
					jsBizMultLan.atsManager_myTurnShift_i18n_29,
					jsBizMultLan.atsManager_myTurnShift_i18n_30,
					jsBizMultLan.atsManager_myTurnShift_i18n_31,
					jsBizMultLan.atsManager_myTurnShift_i18n_27
				],
				monthNamesShort : [
					jsBizMultLan.atsManager_myTurnShift_i18n_7,
					jsBizMultLan.atsManager_myTurnShift_i18n_9,
					jsBizMultLan.atsManager_myTurnShift_i18n_10,
					jsBizMultLan.atsManager_myTurnShift_i18n_11,
					jsBizMultLan.atsManager_myTurnShift_i18n_12,
					jsBizMultLan.atsManager_myTurnShift_i18n_13,
					jsBizMultLan.atsManager_myTurnShift_i18n_14,
					jsBizMultLan.atsManager_myTurnShift_i18n_15,
					jsBizMultLan.atsManager_myTurnShift_i18n_16,
					jsBizMultLan.atsManager_myTurnShift_i18n_4,
					jsBizMultLan.atsManager_myTurnShift_i18n_5,
					jsBizMultLan.atsManager_myTurnShift_i18n_6
				],
				monthNames : [
					jsBizMultLan.atsManager_myTurnShift_i18n_7,
					jsBizMultLan.atsManager_myTurnShift_i18n_9,
					jsBizMultLan.atsManager_myTurnShift_i18n_10,
					jsBizMultLan.atsManager_myTurnShift_i18n_11,
					jsBizMultLan.atsManager_myTurnShift_i18n_12,
					jsBizMultLan.atsManager_myTurnShift_i18n_13,
					jsBizMultLan.atsManager_myTurnShift_i18n_14,
					jsBizMultLan.atsManager_myTurnShift_i18n_15,
					jsBizMultLan.atsManager_myTurnShift_i18n_16,
					jsBizMultLan.atsManager_myTurnShift_i18n_4,
					jsBizMultLan.atsManager_myTurnShift_i18n_5,
					jsBizMultLan.atsManager_myTurnShift_i18n_6
				],

				dragOpacity: {
					agenda: .5,
					'':.6
				},
				
				 eventDragStop : function( event, element, view ){
					//fromEvent = event;
				 	validDrag = true;
					var dragDate = formatDate(event.start);	
					//调班前的校验//有无调班单审批中的校验
					//that.validateBeforeScheduleShift(dragDate);
					$.ajax({
						url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsScheduleShiftEditHandler&method=isSubmmitScheduleShiftBill",
						dataType:'json',
						type: "POST",
						async: false,
						data: {
							dateStr : dragDate,
							uipk:"hr.ats.myTurnShift"
						},
						cache: false,
						success: function(data) {
							if(data.validSubmmit == false){
								validDrag = false;
								shr.showError({message: dragDate+jsBizMultLan.atsManager_myTurnShift_i18n_25});
							}else if(data.result=='error'){
								shr.showError({message: jsBizMultLan.atsManager_myTurnShift_i18n_18});
								validDrag = false;
							}else{
									fromDate = dragDate ;
									console.log("eventDragStop "+event); 
							}
						}
					});
/*					fromDate = dragDate ;
					console.log("eventDragStop "+event); */

				 },  
				 eventDragStart :  function ( event, element, view ){
				    //console.log() ;
                    
				    lastPosition = view.position ;  
					console.log("eventDragStart "+event); 
				 },
				 
                 eventDrop : function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
					//that.clickFlag = false;
					var revertflagFrom=1;
					var revertflagTo=1;
					var toDate = formatDate(event.start);
					//判断时间对应的一天有无排班
 					for(var i=0;i<that.staticShifts.length;i++){
						if(that.staticShifts[i].strDate == toDate){
							if(that.staticShifts[i].dayType && that.staticShifts[i].dayType !=""){
						      revertflagTo = 0;
							}
						}
						if(that.staticShifts[i].strDate == fromDate){
							if(that.staticShifts[i].dayType && that.staticShifts[i].dayType !=""){
						      revertflagFrom = 0;
							}
							
						}
						if(revertflagTo == 0 && revertflagFrom == 0){
							break;
						}
					}
					
                 if(revertflagTo == 1 || revertflagFrom == 1 || !validDrag){
					revertFunc(); 
				 }else{
				 	//调班前的校验//有无调班单审批中的校验
				 	$.ajax({
							url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsScheduleShiftEditHandler&method=isSubmmitScheduleShiftBill",
							dataType:'json',
							type: "POST",
							async: false,
							data: {
								dateStr : toDate,
								uipk:"hr.ats.myTurnShift"
							},
							cache: false,
							success: function(data) {
								if(data.validSubmmit == false){
									shr.showError({message: toDate+jsBizMultLan.atsManager_myTurnShift_i18n_25});
									revertFunc();
								}else if(data.result=='error'){
									shr.showError({message: jsBizMultLan.atsManager_myTurnShift_i18n_18});
									revertFunc();
								}else{
									//drag开始和结束都是同一个event，把移动的event时间复原，这样相当于没有被移动，交换shifs里面的内容即可
									event.start = new Date(fromDate) ;
									//调班前的校验
									//that.validateBeforeScheduleShift(toDate);
									event._start = new Date(fromDate) ;
									event.attendDate2 = toDate;
									var leng = that.shifts.length ; 
									var k = 0;
									var j = 0; 
									for(var i = 0; i < leng ; i ++)
									{
										if(that.shifts[i].strDate  == toDate)
										{
											k = i ;
										}
										
										if(that.shifts[i].strDate  == fromDate)
										{
											j = i ;
										}
									}
				                     //交换shifts内容， 但是考勤日期 strDate不变。
									var shiftNameContent = that.shifts[k].shiftName ;
									that.shifts[k].shiftName  =  that.shifts[j].shiftName;
									that.shifts[j].shiftName = shiftNameContent ;
									var shiftIdContent = that.shifts[k].shiftId ;
									that.shifts[k].shiftId  =  that.shifts[j].shiftId;
									that.shifts[j].shiftId = shiftIdContent ;
									
									var planWorkTimeContent = that.shifts[k].planWorkTime ;
									that.shifts[k].planWorkTime  =  that.shifts[j].planWorkTime;
									that.shifts[j].planWorkTime = planWorkTimeContent ;
									
				/* 					var strDateContent = shifts[k].strDate ;
									shifts[k].strDate  =  shifts[j].strDate;
									shifts[j].strDate = strDateContent ; */
									
									var dayTypeContent = that.shifts[k].dayType ;
									that.shifts[k].dayType  =  that.shifts[j].dayType;
									that.shifts[j].dayType = dayTypeContent ;
									//找到结束的event，保存此event的attendDate2
									 for(var i=0;i<that.staticShifts.length;i++){
										
										if(that.staticShifts[i].strDate == toDate){
											that._events[i].attendDate2 = fromDate;
											
				
										}
										
									}
								}
							}
						});

					
					
				  }
	
				},				 
	
				events : that._events,
				dayRender : function( date, cell ) {
									    
					if(!that.clickFlag){
    					if(cursorView == 0){
    						strFirstDateOfView = convertDateToStirng(date);
    						firstDateOfView = date;
    					}
    
    
    					strLastDateOfView = convertDateToStirng(date);
    					lastDateOfView = date;
    					cursorView ++;
    					if(cursorView == that.grids){
    						var currentDate = new Date();
    						var start = convertDateToStirng(currentDate);
    						var end = convertDateToStirng(new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0));
    						var temShifts = [];
    						var temEvents = [];
							var temStaticShifts = [];
    
    						start = firstDateOfView >= that.beginDate ? strFirstDateOfView : that.strBeginDate;
    						end = lastDateOfView >= that.endDate ? that.strEndDate : strLastDateOfView;
    						
    						for(var i = 0;i<that.shifts.length;i++){
    							if( new Date(that.shifts[i].strDate) >= new Date(start) && new Date(that.shifts[i].strDate) <= new Date(end) ){
    								//that.shifts.splice(i,1);
    								temShifts.push(that.shifts[i]);
									temStaticShifts.push(that.staticShifts[i]);
    								temEvents.push(that._events[i]);
    								//that._events.splice(i,1);
    							}
    						}
    						that.shifts = temShifts;
							that.staticShifts = temStaticShifts;
    						that._events = temEvents;
    					}
					}
				},
				//events : that.shifts,
				eventRender : function(event, element) {
					//debugger ; 
					//  $("#"+dragDate).parent().animate(lastPosition);	
				},
				eventAfterRender : function(event, element, view) {
					
					//debugger ; 
				   var changeFlag=false;
                   if(index>=that.shifts.length)	{
					   index = 0;
				   }
                   if(that.shifts[index].shiftId !=that.staticShifts[index].shiftId || that.shifts[index].dayType !=that.staticShifts[index].dayType){
					   event.title = that.shifts[index].dayType+that.shifts[index].shiftId;
					   changeFlag = true;
				   }else{
					  // if(!that.clickFlag){
						  event.title = "";
					  // }
					   
				   }
					//保存原本的班次名称和日期类型
				   event.shiftNameBefore = that.staticShifts[index].shiftName;
				   event.shiftIdBefore = that.staticShifts[index].shiftId;
				   event.dayTypeBefore = that.staticShifts[index].dayType;
				   event.planWorkTimeBefore = that.staticShifts[index].planWorkTime;
				
				  var dragDate = formatDate(event.start);
				  
				  var planWorkTime="";
				  if(that.shifts[index].planWorkTime != null && that.shifts[index].planWorkTime != undefined){
					  planWorkTime = that.shifts[index].planWorkTime;
				  }
				  var dayType="";
				  if(that.shifts[index].dayType != null && that.shifts[index].dayType != undefined){
					  dayType = that.shifts[index].dayType;
				  }
				 // var shiftName = shifts[index].shiftName;
				  
				  var shiftName="";
					if(that.shifts[index].shiftName != null && that.shifts[index].shiftName != undefined){
					  shiftName = that.shifts[index].shiftName;
				  }		
					var title = "";
					$("#calendar_info td").each(function() {
						var tdThis = this;
						var dateValue = $(tdThis).attr('data-date');
						if(dateValue != null && dateValue != undefined){
							var time = new Date(dateValue.replace(/-/g, "/"));
							//控制日历字体显示颜色
							if(time.getTime() >= that.beginDate.getTime() && time.getTime() <= that.endDate.getTime()){
								$(this).children().each(function(){  
									var grandchild=$(this).children();
									if($(grandchild).hasClass("fc-day-number")){
										$(grandchild).css("opacity",1);	
									}
								});
								
								if(time.getTime() == event.start.getTime()){
									title = getColorTitle(tdThis,event.title,true);					
								}
							}else{
								$(this).children().each(function(){  
									var grandchild=$(this).children();
									if($(grandchild).hasClass("fc-day-number")){
										$(grandchild).css("opacity",0.3);	
									}
								}); 
							}
						}
					});

				  // var confbg = '<div class="fc-event-inner">';

				  var confbg = '<div class="unusualBox" id='+dragDate+'> ';
				 
				  if(dayType){
					/*if(title!=""){
							confbg = confbg   +'<div class="planWorkTimeShow">'+ planWorkTime +'</div>'+'<div class="shiftName">'+ title +'</div>';	
							
					   	}else{
								
					   	}*/
						if(changeFlag){
							confbg = confbg   +'<div class="planWorkTimeShow">'+ planWorkTime +'</div>'+'<div class="shiftName" style="color:rgb(183, 20, 197)">'+ shiftName +'</div>'+
							'<div class="dayType" style="color:rgb(183, 20, 197)">'+ dayType +'</div>';
						}else{
							confbg = confbg   +'<div class="planWorkTimeShow">'+ planWorkTime +'</div>'+'<div class="shiftName" >'+ shiftName +'</div>'+
							'<div class="dayType" >'+ dayType +'</div>';;
						}
					   	 
				   }						
					confbg += '</div></div>'					
					element.html(confbg); 
/* 					if(dragDate == fromDate){
						$("#"+dragDate).parent().animate(lastPosition);
					} */
					
					index ++ ;
				},
				eventAfterAllRender : function(view)
				{

					//indexs++ ;
				},
				eventClick : function(event, e) {
					//判断时间对应的一天有无排班,无排班则点击无效
					var openDialogflag=0;
 					for(var i=0;i<that.staticShifts.length;i++){
						
						if(that.staticShifts[i].strDate == formatDate(event.start)){
/* 							event.shiftName1 = ;
							event.dayType1 = ; */
							if(that.staticShifts[i].dayType && that.staticShifts[i].dayType !=""){
						      openDialogflag = 1;
							}
							break;
						}
						
					}
					if(openDialogflag==1){
						//调班前的校验//有无调班单审批中的校验
						$.ajax({
							url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsScheduleShiftEditHandler&method=isSubmmitScheduleShiftBill",
							dataType:'json',
							type: "POST",
							async: false,
							data: {
								dateStr : formatDate(event.start),
								uipk:"hr.ats.myTurnShift"
							},
							cache: false,
							success: function(data) {
								if(data.validSubmmit == false){
									shr.showError({message: formatDate(event.start)+jsBizMultLan.atsManager_myTurnShift_i18n_25});
								}else if(data.result=='error'){
									shr.showError({message: jsBizMultLan.atsManager_myTurnShift_i18n_18});
								}else{
									that.clickFlag = true;
									event.attendDate2 = formatDate(event.start);
									//调班前的校验
									//that.validateBeforeScheduleShift(formatDate(event.start));
									var eventDate = [];	
									eventDate.push(event["start"].getTime());					
									that.getSelectEventDateValue(eventDate);
								}
							}
						});
/*						that.clickFlag = true;
						event.attendDate2 = formatDate(event.start);
						//调班前的校验
						//that.validateBeforeScheduleShift(formatDate(event.start));
						var eventDate = [];	
						eventDate.push(event["start"].getTime());					
						that.getSelectEventDateValue(eventDate);*/		
					}
				},
				dayClick : function(date, allDay, jsEvent, view) {
					
				//	alert("hello day");
	
				}
			});
			
							
		//对table进行监测: 过滤掉头两行：下标是从0开始的
		$('#calendar_info table tr:gt(1)').mousedown(function(){
			//鼠标点击事件： 过滤掉头三列
		
			$('#calendar_info table td:gt(2)').click(function(e){
/* 				var dateValue=$(e.currentTarget).attr('data-date');
				var time = new Date(dateValue.replace(/-/g, "/"));
				if(time.getTime() >= that.beginDate.getTime() && time.getTime() <= that.endDate.getTime()){
		 			//$(this).addClass('cell-select-color');	
		 			if(contain(res,dateValue)){
		 				$(this).addClass('cell-select-color');	
		 				that.getSelectDateValue();	
		 			}
		 				
				} */
			})/*.mouseup(function(e){
				var dateValue=$(e.currentTarget).attr('data-date');
				var time = new Date(dateValue.replace(/-/g, "/"));
				if(time.getTime() >= that.beginDate.getTime() && time.getTime() <= that.endDate.getTime()){			
					that.getSelectDateValue();
				}
				
 			})*/;
 			
 			
 			
/*			$('#calendar_info table td:gt(2)').mousemove(function(e){       
				var dateValue=$(e.currentTarget).attr('data-date');
				var time = new Date(dateValue.replace(/-/g, "/"));
				if(time.getTime() >= that.beginDate.getTime() && time.getTime() <= that.endDate.getTime()){
     			$(this).addClass('cell-select-color'); 
				}
			});*/
			//对document进行mouseup事件的监听,当鼠标松开的时候，取消td的移动事件， 同时保留td:gt(2)的鼠标松开事件
/*			$(document).mouseup(function(){
				$("#calendar_info table td").unbind('mousemove');
 			});*/

		 });
			 	 
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
	}
	/**
    *  得到选中日期的日期值
    */
	,getSelectDateValue: function(){
		var that = this;
		$("#calendar_info table td").unbind('mousemove');
		var selectCellColor = [];
		$("#calendar_info table td").each(function(){
			if($(this).hasClass("cell-select-color")){
				var dateValue = $(this).attr('data-date');
				var time = new Date(dateValue.replace(/-/g, "/"));
				selectCellColor.push(time.getTime());
			}
		})
	    if(selectCellColor.length > 0){
	    	that.selectDayTypeAndAtsShift(selectCellColor);
	    	selectCellColor = [];
	    }
	},
	
	//
	getSelectEventDateValue: function(eventDate){
		var that = this;
	    if(eventDate.length > 0){
	    	that.selectDayTypeAndAtsShift(eventDate);
	    	//selectCellColor = [];
	    }
	},
	
	/**
	 * 给title赋值
	 */
    selectDayTypeAndAtsShift: function(selectCellColor){
    	var that = this;
  		var url = shr.getContextPath() +'/dynamic.do?&method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list'
  				 + '&flag=myTurnShift'+'&attDate='+(new Date(selectCellColor[0]).Format("yyyy-MM-dd"));
    	$("#iframe1").attr("src",url);
		$("#iframe1").dialog({
			modal : true,
			title : jsBizMultLan.atsManager_myTurnShift_i18n_24,
			width : 1035,
			minWidth : 1035,
			height : 505,
			minHeight : 505,
			open : function(event, ui) {
			},
			close : function() {
				var title = $("#iframe1").attr('title');
				if (title!= null&& title != undefined) {
					$("#iframe1").removeAttr("title");
					var selectTime = null,event = null,eventDayTime = null;
					while(selectCellColor.length > 0){
						selectTime = selectCellColor.pop();
						for(var j=0;j<that._events.length;j++){
							event = that._events[j];
							eventDayTime = event["start"].getTime();
							if(selectTime >= that.beginDate.getTime() && selectTime <= that.endDate.getTime()){
								if(selectTime == event["start"].getTime()){
									var result = {};
									result = parseTitle(title);
									 //that._events[j].title = title;
									if(result.dayType){
									 that.shifts[j].shiftName = result.shiftName;
									 that.shifts[j].shiftId = result.shiftId;
									 that.shifts[j].dayType = result.dayType;
									 //点击选择班次时，时间是否更新成班次明细上下班时间（先屏蔽）
/*									 that.remoteCall({
										 asyn:"false",
										 type:"post",
										 method:"getPlanWorkTimeByShift",
										 handler:"com.kingdee.shr.ats.web.handler.AtsScheduleShiftListHandler",
										 uipk:"hr.ats.myTurnShift",
										 param:{atsShiftId:that.shifts[j].shiftId},
										 success:function(res){
											that.shifts[j].planWorkTime = res[0];
										 }
									 });*/
									 //									 
									 break;
									}

								}
							}
						}
					}
					selectCellColor = [];
				}
				$('#calendar_info').empty();
				that.initCalandar();
			}
		});
		
		$("#iframe1").attr("style", "width:1035px;height:505px;");
    }

	/*
	 * 日历调班保存
	 */
	,saveAction:function(){
		var _self = this; 
		var calendarData  = _self._events;
		var datas = [];
		for(var i =0;i<calendarData.length;i++){
			var data ={title:calendarData[i].title,start:convertDateToStirng(calendarData[i].start)};
			if(data.title && data.title != ""){
			    datas.push(data);
			}
		}
		$.ajax({
			url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsScheduleShiftEditHandler&method=saveTurnShift",
			dataType:'json',
			type: "POST",
			data: {
				//numbers : shr.toJSON(_self.numbers),
				data: shr.toJSON(datas),
				beginDate : _self.strBeginDate,
				endDate : _self.strEndDate
			},
			beforeSend: function(){
				
			},
			cache: false,
			success: function(data) {
				//_self.showSavedData();
			},
			error: function(){
				closeLoader();
			},
			complete: function(){
				closeLoader();
				
			}
		});
	}
	/*
	 * 取消
	 */
	,cancelAction:function(){
		/*var that = this ;
	 	window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsOverTimeBillList";*/
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop'
		});
	},
	allListAction:function(){
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsScheduleShift.list'
		});
	}
	,validateBeforeScheduleShift: function(dateStr){
		var _self = this;
		$.ajax({
		url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsScheduleShiftEditHandler&method=isSubmmitScheduleShiftBill",
		dataType:'json',
		type: "POST",
		async: false,
		data: {
			dateStr : dateStr,
			uipk:"hr.ats.myTurnShift"
		},
		cache: false,
		success: function(data) {
			if(data.validSubmmit == false){
				shr.showError({message: dateStr+jsBizMultLan.atsManager_myTurnShift_i18n_25});
			}else if(data.result=='error'){
				shr.showError({message: jsBizMultLan.atsManager_myTurnShift_i18n_18});
			}
		}
	});
	}
	,actSubmit: function(event, action) {
		var _self = this;
/*		var data = _self.assembleSaveData(action);
		data.nextPers = shr.toJSON(_self.nextPers);
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}*/
		shr.showConfirm(jsBizMultLan.atsManager_myTurnShift_i18n_21, function() {
    	 	
    	//var _self = this; 
		var calendarData  = _self._events;
		var datas = [];
		for(var i =0;i<calendarData.length;i++){
			var data ={title:calendarData[i].title,attendDateAfter:calendarData[i].attendDate2,shiftIdBefore:calendarData[i].shiftIdBefore,planWorkTimeBefore:calendarData[i].planWorkTimeBefore,
			shiftNameBefore:calendarData[i].shiftNameBefore,dayTypeBefore:calendarData[i].dayTypeBefore,attendDateBefore:convertDateToStirng(calendarData[i].start)};
			if(data.title && data.title != ""){
			    datas.push(data);
			}
		}

		if(datas.length==0){
			shr.showError({message: jsBizMultLan.atsManager_myTurnShift_i18n_19});
			return;
		}
		var dataParam = {};
		dataParam.nextPers = shr.toJSON(_self.nextPers); 
		dataParam.datas = shr.toJSON(datas);
		$.ajax({
			url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsScheduleShiftEditHandler&method=submit&nextPers="+encodeURIComponent(shr.toJSON(_self.nextPers)),
			dataType:'json',
			type: "POST",
			data: {
				//numbers : shr.toJSON(_self.numbers),
				data: shr.toJSON(dataParam),
				beginDate : _self.strBeginDate,
				endDate : _self.strEndDate,
				uipk:"hr.ats.myTurnShift"
			},
			beforeSend: function(){
				openLoader(1, jsBizMultLan.atsManager_myTurnShift_i18n_23);
			},
			cache: false,
			success: function(data) {
				if(data.result=='error'){
					shr.showError({message: data.summary});
				}else{
					shr.showInfo({message: jsBizMultLan.atsManager_myTurnShift_i18n_22});
					setTimeout(function(){
					_self.reloadPage({
						uipk: 'com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop'
					});
					},1000);

				}
				
			},
			error: function(){
				closeLoader();
				//shr.showInfo({message: "提交调班失败"});
			},
			complete: function(){
				closeLoader();
				//shr.showInfo({message: "提交排班成功"});
				
			}
		});
    	 	
               // _self.saveAction.call(this);
      });	
	}
	/**
	 * 提交
	 */
    ,submitShiftAction: function(event) {
 
    	var _self = this;

		
		if (_self.validate() && _self.verify()) {
			
/*			    	 shr.showConfirm(jsBizMultLan.atsManager_myTurnShift_i18n_21, function() {
    	 	
    	//var _self = this; 
		var calendarData  = _self._events;
		var datas = [];
		for(var i =0;i<calendarData.length;i++){
			var data ={title:calendarData[i].title,attendDateAfter:calendarData[i].attendDateAfter,shiftIdBefore:calendarData[i].shiftIdBefore,planWorkTimeBefore:calendarData[i].planWorkTimeBefore,
			shiftNameBefore:calendarData[i].shiftNameBefore,dayTypeBefore:calendarData[i].dayTypeBefore,attendDateBefore:convertDateToStirng(calendarData[i].start)};
			if(data.title && data.title != ""){
			    datas.push(data);
			}
		}
		data.nextPers = shr.toJSON(_self.nextPers); 
		if(datas.length==0){
			shr.showError({message: "没有调班修改，请先调班，再提交。"});
			return;
		}
		$.ajax({
			url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsScheduleShiftEditHandler&method=submit",
			dataType:'json',
			type: "POST",
			data: {
				//numbers : shr.toJSON(_self.numbers),
				data: shr.toJSON(datas),
				beginDate : _self.strBeginDate,
				endDate : _self.strEndDate,
				uipk:"hr.ats.myTurnShift"
			},
			beforeSend: function(){
				openLoader(1, "提交进行中！请稍等...");
			},
			cache: false,
			success: function(data) {
				if(data.result=='error'){
					shr.showError({message: data.summary});
				}else{
					shr.showInfo({message: "提交成功"});
					setTimeout(function(){
					_self.reloadPage({
						uipk: 'com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop'
					});
					},1000);

				}
				
			},
			error: function(){
				closeLoader();
				//shr.showInfo({message: "提交调班失败"});
			},
			complete: function(){
				closeLoader();
				//shr.showInfo({message: "提交排班成功"});
				
			}
		});
    	 	
               // _self.saveAction.call(this);
      });*/
			
			
			//shr.showConfirm('您确认要提交吗？', function() {
		        _self.doSubmit(event, 'submit');
			
		}else{
			if(_self != top){// in iframe
				shr.setIframeHeight(window.name);
			} 
				
		}
    	

    }

});

//获取事件总数（也就是开始时间到结束时间天数）
function getEventCount(start,end){
	var s1 = "";
    var s2 = "";
	var counts = "";

	s1 = new Date(start.replace(/-/g, "/"));
	s2 = new Date(end.replace(/-/g, "/"));


	var days = s2.getTime() - s1.getTime();
	counts = parseInt(days / (1000 * 60 * 60 * 24))+1;
	return counts;
}


//延续一个月
function getUpDate(year,month,day){

    var lastYear = year;
    var lastMonth = parseInt(month) + 1;
    
    if(lastMonth > 12) {
        lastYear = parseInt(lastYear) + 1;
        lastMonth = 1;
    }
    var lastDay = day;
    var lastDays = new Date(lastYear,lastMonth,0);
    lastDays = lastDays.getDate();
    if(lastDay > lastDays) {
        lastDay = lastDays;
    }
     if(lastMonth < 10) {
        lastMonth = '0'+lastMonth;
    }
    if(lastDay < 10){
    	lastDay = '0' + lastDay;
    } 
    return lastYear + '-'+ lastMonth + '-' + lastDay;
}
//从某一日期延续多少天，add可为正或者负
function addDate(year,month,day,add){ 
	var d=new Date(year,month,day); 
	d.setDate(d.getDate()+add); 
	var month=d.getMonth()+1; 
	var day = d.getDate(); 
	if(month<10){ 
		month = "0"+month; 
	} 
	if(day<10){ 
		day = "0"+day; 
	} 
	var val = d.getFullYear()+'_'+month+'_'+day; 
	return val; 
}
//月末
function getEndDate(year,month){
	var lastDays = new Date(year,month,0);
    lastDays = lastDays.getDate();
	if(month < 10) {
	month = '0'+month;
    }
    if(lastDays < 10){
    	lastDays = '0' + lastDays;
    }
    return year + '-'+ month + '-' + lastDays;
		
}
//月初
function getFirstDate(year,month){
	var lastDays = new Date(year,month,0);
    lastDays = lastDays.getDate();
	if(month < 10) {
	month = '0'+month;
    }
    return year + '-'+ month + '-' + '01';
		
}
/*
 * 回调针中处理
 */
function closeFrameDlg(ifameid,shiftName){
	$('#'+ifameid).attr('title',shiftName);
    $('#'+ifameid).dialog('close');
}

/**
 * _self：td列对象；value：传递过来的值对象：类似于[休息日]轮班1
 * flag：是否对当前列颜色标识
 */
function getColorTitle(_self,value,flag){
	$(_self).removeClass('gray-color');
	$(_self).removeClass('litterGreen-color');
	$(_self).removeClass('cell-select-color');
	if (value.substring(0, jsBizMultLan.atsManager_myTurnShift_i18n_2.length)
		== jsBizMultLan.atsManager_myTurnShift_i18n_2) {
		if(flag){
			$(_self).addClass('gray-color');
		}
		return value.substring(jsBizMultLan.atsManager_myTurnShift_i18n_2.length);
	}
	else if (value.substring(0, jsBizMultLan.atsManager_myTurnShift_i18n_0.length)
		== jsBizMultLan.atsManager_myTurnShift_i18n_0) {
		if(flag){
			$(_self).addClass('litterGreen-color');	
		}
		return value.substring(jsBizMultLan.atsManager_myTurnShift_i18n_0.length);
	}
	else {
		if (value.indexOf(jsBizMultLan.atsManager_myTurnShift_i18n_1) > -1) {
			return value.substring(jsBizMultLan.atsManager_myTurnShift_i18n_1.length);
		}
		else{
			return value;
		}
	}
}

function parseTitle(value){
		if(value && value != ""){
			var result = {};
			value = value.replace("[0]",jsBizMultLan.atsManager_myTurnShift_i18n_1 );
			value = value.replace("[1]",jsBizMultLan.atsManager_myTurnShift_i18n_2 );
			value = value.replace("[2]",jsBizMultLan.atsManager_myTurnShift_i18n_0 );
			if (value.substring(0, jsBizMultLan.atsManager_myTurnShift_i18n_2.length)
				== jsBizMultLan.atsManager_myTurnShift_i18n_2) {
				
				result.dayType = jsBizMultLan.atsManager_myTurnShift_i18n_2
				var shiftNameId = value.substring(jsBizMultLan.atsManager_myTurnShift_i18n_2.length);
				var arrs = shiftNameId.split("-");
				result.shiftId = arrs[arrs.length - 1];
				arrs.length = arrs.length - 1;
				result.shiftName = arrs.join('-');
			}
			else if (value.substring(0, jsBizMultLan.atsManager_myTurnShift_i18n_0.length)
				== jsBizMultLan.atsManager_myTurnShift_i18n_0) {

				result.dayType = jsBizMultLan.atsManager_myTurnShift_i18n_0
				var shiftNameId = value.substring(jsBizMultLan.atsManager_myTurnShift_i18n_0.length);
				var arrs = shiftNameId.split("-");
				result.shiftId = arrs[arrs.length - 1];
				arrs.length = arrs.length - 1;
				result.shiftName = arrs.join('-');
			}
			else {
				if (value.indexOf(jsBizMultLan.atsManager_myTurnShift_i18n_1) > -1) {
					result.dayType = jsBizMultLan.atsManager_myTurnShift_i18n_1
					var shiftNameId = value.substring(jsBizMultLan.atsManager_myTurnShift_i18n_1.length);
					var arrs = shiftNameId.split("-");
					result.shiftId = arrs[arrs.length - 1];
					arrs.length = arrs.length - 1;
					result.shiftName = arrs.join('-');
				}
				else{
					return value;
				}
			}
		return result;
	  }else{
		  return "";
	  }
}
function colorFormatter(){
	var value = "";
	$('#list_info td').each(function() {
		value = $(this).text();
		if(value != undefined && value != null && value.length > 0){
			$(this).text(getColorTitle(this,value,true));
		}
	});
}
function formatDate(date) {  
     var year = date.getFullYear();
     var month =  (date.getMonth() + 1) > 9 ? (date.getMonth() + 1):('0' +  (date.getMonth() + 1));
     var day = date.getDate() > 9 ? date.getDate():('0'  +  date.getDate());
     return year + '-' + month + '-' + day;
} 
function correctValue(value){
	if(value == undefined || value == null){
		return "";
	}
	else{
		return value;
	}
}
function convertDateToStirng(date){
	var year = date.getFullYear();
	var month = date.getMonth();
	month = (month + 1) > 9 ? (month +1)  : ('0' + (month + 1));
	var day = date.getDate();
	day = day > 9 ? day : ('0' + day);
	return year + '-' + month + '-' + day ;
}
function contain(res,dateValue){
	 for(var i=0; i<res.length; i++){
	 	if(dateValue==res[i].strattendDate&&res[i].planWorkTime!=""){
	 	    return true;
	 	}  
	}
	return false;
}

