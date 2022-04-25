shr.defineClass("shr.ats.WorkCalendarEdit", shr.ats.AtsMaintainBasicItemEdit, {
	year:null,
	month:null,
	_events: [],
	beginDate: null,
	endDate: null,
	initalizeDOM:function(){
		shr.ats.WorkCalendarEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		//设置系统预设数据编号和名称不能编辑
		that.initEditStateAction();
		that.setButtonVisible(); 
		that.setWorkCalendarVisible();
		that.dayTypeChange();
		if(that.getOperateState() != 'VIEW'){
		   $("#workCalendarReset").hide();
		   $('#dayType').hide();
		}
	},
	

	/*
	 * 编辑页面初始化，用于设置多个法定假日时开始日期和历史记录不能编辑
	 */
	initEditStateAction:function(){
		var that = this;
		var billId  = $("#id").val();
		if (that.getOperateState() == 'EDIT') {
			that.remoteCall({
				type:"post",
				method:"setEditState",
				param:{billId:billId,handler :"com.kingdee.shr.ats.web.handler.WorkCalendarEditHandler"},
				success:function(res){		
					var legalHolidayCount = res.legalHolidayCount;
					$("#beginDate").shrDateTimePicker("disable");
					$("#endDate").shrDateTimePicker("disable");
					$("#calendarTempl").shrPromptBox("disable");
					$("#items_legalHoliday").shrPromptBox("disable");
				}
			})
		}
	},
	
	/**
	 * 覆盖保存方法  校验名称和ID是否重复
	 */
	 saveAction:function(event){
	 var that = this ;
	 var name = $("#name").val();
     var billId  = $("#id").val();
	 var number  = atsMlUtile.getFieldOriginalValue("number");
	 workArea = that.getWorkarea(),
		$form = $('form', workArea);
		  if ($form.valid() && that.verify()) {
         	that.remoteCall({
				type:"post",
				method:"checkNameAndIdIsExist",
				param:{name: name,billId:billId,number:number,handler :"com.kingdee.shr.ats.web.handler.WorkCalendarEditHandler"},
				success:function(res){		
				if(res.checkNameIsExist=="exist"){
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_workCalendarEdit_i18n_14, [name])});
				}else if(res.checkIdIsExist=="exist"){			
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_workCalendarEdit_i18n_12, [number])});
				}else{
					that.doSave(event, 'save');		
				}					
				
				}
			});
		 }
	},
	
	
	//设置按钮隐藏，日历隐藏	 
	setButtonVisible:function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#workCalendarAppend").hide();
		}
	},
	setWorkCalendarVisible:function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#viewWorkCalendar_div").hide(); 
		}else{
			that.viewWorkCalendarAction();
			that.initCalandar();
		}
	},
	dateTypeChangeAction:function() {
		var  workCalendarId = $("#id").val();
		var url =  shr.getContextPath()+"/dynamic.do?method=addNew&uipk=com.kingdee.eas.hr.ats.app.WorkCalendarExchange.form&WorkId="
					+ encodeURIComponent(workCalendarId);
			var leavebillDialog = $("#operationDialog"); 

        leavebillDialog.children("iframe").attr('src',url);
			leavebillDialog.dialog({
			    title: jsBizMultLan.atsManager_workCalendarEdit_i18n_16,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+15%',
					of: window
				}
			});	
	},
	
	/*
	 * 新增追加日历功能
	 */
	workCalendarAppendAction:function(){
		var  workCalendarId = $("#id").val();
		var url =  shr.getContextPath()+"/dynamic.do?method=addNew&uipk=com.kingdee.eas.hr.ats.app.WorkCalendarAppend.form&WorkId="
					+ encodeURIComponent(workCalendarId);
			var leavebillDialog = $("#operationDialog"); 
			leavebillDialog.children("iframe").attr('src',url);
			leavebillDialog.dialog({
			    title: jsBizMultLan.atsManager_workCalendarEdit_i18n_29,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: [180,180]
			});	
	},
	
	
	viewWorkCalendarAction:function(){
	 	var that = this ;
 		var  workCalendarId = $("#id").val();
 		var date = new Date();
 		that.year = date.getFullYear();
 		that.month = date.getMonth();
 		beginDate = new Date(Date.parse(atsMlUtile.getFieldOriginalValue('beginDate').replace(/-/g,  "/")));
 		endDate = new Date(Date.parse(atsMlUtile.getFieldOriginalValue('endDate').replace(/-/g,  "/")));
 		//$("#wrap").css('overflow-y','auto');
		$("#viewWorkCalendar_divForm").css('overflow-y','auto');
		$("#viewWorkCalendar_divForm").css('overflow-x','hidden');//隐藏横向滚动条 
		//document.getElementById("viewWorkCalendar_divForm").style.height=document.getElementById("viewWorkCalendar_divForm").offsetHeight+350 + "px";
		
		$('#monthSelector').bind("click",function(e){
			var clickLeft = true,clickRight = true;
			if(((that.month == beginDate.getMonth()) && (that.year == beginDate.getFullYear()))){
				clickLeft = false;
			}
			if(((that.month == endDate.getMonth()) && (that.year == endDate.getFullYear()))){
				clickRight = false;
			}
			var tar = e.target;
			if($(tar).hasClass('icon-caret-left')){
				if(clickLeft){
					if(that.month == 0){
						that.month = 11;
						that.year = that.year - 1;
					}else{
						that.month = that.month - 1;
					}
				}	
			}else if($(tar).hasClass('icon-caret-right')){
				if(clickRight){
					if(that.month == 11){
						that.month = 0;
						that.year = that.year + 1;
					}else{
						that.month = that.month + 1;
					}
				}
			}
			$('#monthInfo').html((that.month + 1) > 9 ? (that.month +1) : '0'+ (that.month +1));
			$('#yearInfo')
				.html(that.year + jsBizMultLan.atsManager_workCalendarEdit_i18n_15
					+ $.shrI18n.dateI18n.month2[that.month]);
			that.initCalandar();
		});
		
	}
	
	,initCalandar:function(){
		var that = this;
		$('#monthInfo').html((that.month + 1) > 9 ? (that.month +1) : '0'+ (that.month +1));
		$('#yearInfo')
			.html(that.year + jsBizMultLan.atsManager_workCalendarEdit_i18n_15
				+ $.shrI18n.dateI18n.month2[that.month]);
		$('#calendar').css('display','block');
		var  workCalendarId = $("#id").val();
		this.remoteCall({
			 type:"post",
			 async:false,
			 method:"flashPage",
			 param:{billId:workCalendarId,yearAndMOnth:that.year +"-"+(that.month +1),handler :"com.kingdee.shr.ats.web.handler.WorkCalendarEditHandler"},
			 success:function(res){
			 	that._events = res.rows;
				$('#calendar_info').empty();
		        $('#calendar_info').fullCalendar({
					header : {
							left : '',
							center : '',
							right : ''
						},
						year : that.year,
						month : that.month,
						dayNamesShort : [
							jsBizMultLan.atsManager_workCalendarEdit_i18n_24,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_28,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_22,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_25,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_26,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_27,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_23
						],
						monthNamesShort : [
							jsBizMultLan.atsManager_workCalendarEdit_i18n_3,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_4,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_5,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_6,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_7,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_8,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_9,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_10,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_11,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_0,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_1,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_2
						],
						monthNames : [
							jsBizMultLan.atsManager_workCalendarEdit_i18n_3,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_4,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_5,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_6,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_7,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_8,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_9,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_10,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_11,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_0,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_1,
							jsBizMultLan.atsManager_workCalendarEdit_i18n_2
						],
						editable : true,
						aspectRatio: 1.35,
						disableDragging : true,
						events : that._events,
						eventAfterRender : function(event, element, view) {
							var title = "";
							$("#calendar_info td").each(function() {
								var tdThis = this;
								var dateValue = $(tdThis).attr('data-date');
								if(dateValue != null && dateValue != undefined){
									var time = new Date(dateValue.replace(/-/g, "/"));
									if(time.getTime() == event.start.getTime()){
											title = getColorTitle(tdThis,event.title,true);
									}
								}
  							});
  							var divHtml = '<div style="color:#666;">' + title + '</div>';
							//开始日期和结束日期中间断了的情况
                            if(res.invalidDate.length>0){
										var invalidDateArr = res.invalidDate
									    for(var i=0;i<invalidDateArr.length;i++){
											$("td[data-date='" + invalidDateArr[i].invalidDate + "']").addClass('invalid-color');
										}	
						    }
							element.html(divHtml);
						},
						dayClick: function(date, allDay, jsEvent, view){
							
							var monthInfo = $("#monthInfo").text();//左侧显示的月份
							var monthValue = parseInt(monthInfo);//@
							var year = date.getFullYear();
							var month = date.getMonth() + 1;
							var day = date.getDate();
							var selectDate = that.formatDate(year,month,day);
						    $("#selectDateValue").remove();
							
							$("td[data-date^='" + selectDate.substring(0,7) + "']").removeClass("highLight");		
							
                            var res = getMousePos(jsEvent);
							var dayType = that.getCurrentDayType(selectDate);
							var addTag = that.getAddTag(selectDate);
							var isExistsInWorkCalendarItem = that.isExistsInWorkCalendarItem(selectDate);
						    var beginDateStr = atsMlUtile.getFieldOriginalValue("beginDate");
							var endDateStr = atsMlUtile.getFieldOriginalValue("endDate");
							var beginDate = new Date(Date.parse(beginDateStr.replace(/-/g,   "/"))); //转换成Data();
							var endDate = new Date(Date.parse(endDateStr.replace(/-/g,   "/")));
						    if(addTag == "1" && isExistsInWorkCalendarItem){//非历史数据才能编辑.和有对应数据的。
							$('td[data-date^=' + selectDate + ']').addClass("highLight");	
							$("#dialogSelect").dialog({
			                title:selectDate,
				            width:60,
		 		            height:25,
							minHeight:25,
							minWeight:60,
				            modal: false,
				            resizable: false,
							closeOnEscape: true,
							close:function(){
								$("#selectDateValue").remove();
								$('td[data-date^=' + selectDate + ']').removeClass("highLight");		
							},
				            position: [res.x,res.y-100]
			               });	
						   //调整弹出框样式
			               var dialogTiles = $(".ui-dialog-title");
			               var modifyDialogTile = null;
			               for(var i=0;i<dialogTiles.length;i++){
			               	   var dialogTileText = $(dialogTiles[i]).text();
			               	   if(dialogTileText!=jsBizMultLan.atsManager_workCalendarEdit_i18n_21
								   && dialogTileText!=jsBizMultLan.atsManager_workCalendarEdit_i18n_29){
			               	      modifyDialogTile = $(dialogTiles[i]);
			               	   }
			               }
						   modifyDialogTile.addClass("my-ui-dialog-title");
						   $("div[class^='ui-dialog-titlebar']").addClass("dialogDiv");
						   $("div[class^='ui-dialog-titlebar']").removeClass("ui-dialog-titlebar");
						   $("#dialogSelect").addClass("my-ui-dialog-content");
						   $("#dayType").val(dayType);
						   var appendHtml = "<input id='selectDateValue' type='hidden' value='" + selectDate + "'>";
						   $("#curSelectDate").append(appendHtml);
						  }
						}
			          });
			 }
		});
		$("#calendar_info").find("td").css("cursor", "pointer");
	},
	  getCurrentDayType: function(selectDate){
		var billId = $("#id").val();
		var dayType = 0;
		this.remoteCall({
			 type:"post",
			 async:false,
			 method:"getCurDayTypeAndAddTag",
			 param:{selectDate: selectDate,
			 billId: billId,
			 handler :"com.kingdee.shr.ats.web.handler.WorkCalendarEditHandler"
			 },
			 success:function(res){
			 	dayType = res.dayType;
			 }
		});
		return dayType;
	},
    dayTypeChange: function(){
		var that = this;
	      $("#dayType").change(function(){
			   var curDayType = $(this).val();
			   that.updateDateType(curDayType);
			   $("#dialogSelect").dialog('close');	
               that.initCalandar();				   
	      });
	},
	formatDate: function(year, month, day){
		var tMonth = month > 9 ? month : ('0' + month);
		var tDay = day > 9 ? day : ('0' + day);
		if(arguments.length > 2)
			return year + '-' + tMonth + '-' + tDay;
		else 
			return year + '-' + tMonth;
	},
    updateDateType: function(curDayType){
		var selectDateValue = $("#selectDateValue").val();
		var billId = $("#id").val();
		this.remoteCall({
			 type:"post",
			 async:false,
			 method:"updateDateType",
			 param:{dateType: curDayType,
			      selectDate:selectDateValue,
				  billId:billId
			 },
			 success:function(res){
			 	
			 }
		});
	},
    createNewByModelAction: function(){
		openLoader(1,jsBizMultLan.atsManager_workCalendarEdit_i18n_19);
		var that = this;
		var calendarTempl = $("#calendarTempl").val();
		var legalHoliday = $("#items_legalHoliday").val();
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		var billId = $("#id").val();
		this.remoteCall({
			 type:"post",
			 async:false,
			 method:"createNewByModel",
			 param:{billId: billId,
			      calendarTempl:calendarTempl,
				  legalHoliday:legalHoliday,
				  beginDate:beginDate,
				  endDate:endDate
			 },
			 success:function(res){
				shr.showInfo({message: jsBizMultLan.atsManager_workCalendarEdit_i18n_20});
				that.initCalandar();
			 }
		});
		closeLoader();
	},
	getAddTag: function(selectDate){
		var billId = $("#id").val();
		var addTag = 1;
		this.remoteCall({
			 type:"post",
			 async:false,
			 method:"getCurDayTypeAndAddTag",
			 param:{selectDate: selectDate,
			 billId: billId,
			 handler :"com.kingdee.shr.ats.web.handler.WorkCalendarEditHandler"
			 },
			 success:function(res){
			 	addTag = res.addTag;
			 }
		});
		return addTag;
	},
	/*
	 * 重置工作日历
	 */
	workCalendarResetAction:function(){
		var  workCalendarId = $("#id").val();
		var url =  shr.getContextPath()+"/dynamic.do?method=addNew&uipk=com.kingdee.eas.hr.ats.app.WorkCalendarReset.form&WorkId="
					+ encodeURIComponent(workCalendarId);
			var leavebillDialog = $("#operationDialog"); 
			leavebillDialog.children("iframe").attr('src',url);
			leavebillDialog.dialog({
			    title: jsBizMultLan.atsManager_workCalendarEdit_i18n_21,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: [180,180]
			});	
	},
	isExistsInWorkCalendarItem: function(selectDate){
		var isExistsInWorkCalendarItem = false;
		var billId = $("#id").val();
		this.remoteCall({
			 type:"post",
			 async:false,
			 method:"isExistsInWorkCalendarItem",
			 param:{selectDate: selectDate,
			 billId: billId,
			 handler :"com.kingdee.shr.ats.web.handler.WorkCalendarEditHandler"
			 },
			 success:function(res){
			 	if(res.isExistsInWorkCalendarItem){
					isExistsInWorkCalendarItem = true;
				}
			 }
		});
		return isExistsInWorkCalendarItem;
	}
});

//为休息日与法定假日设置背景色
function getColorTitle(_self,value,flag){
	$(_self).removeClass('list-Green-color');
	$(_self).removeClass('list-pink-color');
	value = value + "";
	
	if (value.indexOf(jsBizMultLan.atsManager_workCalendarEdit_i18n_18) > -1) {
		if(flag){
			$(_self).addClass('list-Green-color');
		}
		return "";
	}else if (value.indexOf(jsBizMultLan.atsManager_workCalendarEdit_i18n_13) > -1) {
		if(flag){
			$(_self).addClass('list-pink-color');
		}
		return value.substring(value.lastIndexOf("#")+1, value.length);
	}else if(value.indexOf(jsBizMultLan.atsManager_workCalendarEdit_i18n_17) > -1){
		if(flag){
			$(_self).addClass('invalid-color');
		}
		return "";
	}else{
		return "";
	}
}

function getMousePos(event) { 
var e = event || window.event; 
return {'x':e.screenX,'y':e.screenY} 
} 



