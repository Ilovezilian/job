var _globalObject = null;
var oneDayTime = 1 * 24 * 60 * 60;
var flag ;
shr.defineClass("shr.ats.turnDefaultShift", shr.ats.turnInitBreadCrumb, {
	_navi:null,
	_maxValue:1,
	_switchType: '',
	month:null,
	year: null,
	_events: [],
	_listRowDatas : [],
	strBeginDate: "",
	strEndDate: "",
	beginDate: null,
	endDate: null,
	_clickPosition : [],
	noShift: null,
	initalizeDOM:function(){
		var that = this;
		shr.ats.turnDefaultShift.superClass.initalizeDOM.call(this);
		//首先清除掉id为iframe1的内容；然后动态增加iframe1的内容,这样就保证了和第一次加载页面的一致性
		if($("#iframe1").length > 0 ){
			$("#iframe1").remove();
		}
		var iframe1 = '<iframe id="iframe1" name="iframe1"  style="display:none;visiable:false;"></iframe>';
		$(document.body).append(iframe1);
		
		$('button[name="turnShiftAdd"]').unbind();
		$('button[name="turnShiftAdd"]').bind("click", function(){
  			that.turnShiftListAction();
		});
		
		_globalObject = this;
		that.noShift = shr.getUrlRequestParam("noShift");
		if("1" == that.noShift){//直接跳到了第四步，导航会丢失。手动加上。
		   $('<div id="currentMenu" style="float:left;padding:10px 2px 0 0px;">' +
		   		'<a href="javascript:void(0);" class="active" style="font-size:16px!important;color:#0088cc;">'
			   + jsBizMultLan.atsManager_turnDefaultShift_i18n_19
			   + '</a>'+
		   		'<span style="padding:0 5px;color:#ccc">/</span></div>').insertBefore($("#currentTile"));
		   $("#currentMenu").click(function(){
		       window.history.back();
		   });
		}
		
	},
	onNext:function(_wizard){
		this.switchType = this._navi.getParm("switchType");
		if("2" == this.switchType){/*****日历排班*********/
			_wizard.setParm("year", this.year);
			_wizard.setParm("month", this.month);
			_wizard.setParm("lastDayInCurMonth", this.lastDayInCurMonth);
			_wizard.setParm("events",this._events);
			return {status: 1};
		}
		else if("3" == this.switchType){
			_wizard.setParm("listRowDatas",this._listRowDatas);
		}
	    // 减少内存的开销；去掉全局变量
		_globalObject = null;
		return {status: 1};
	},
	onNaviLoad:function(_navi){
		this._navi = _navi;
		if("1" == this.noShift){
			_navi.setParm("noShift", this.noShift);
			this.switchType = "3";
			_navi.setParm("switchType", this.switchType);
	       	this.strBeginDate = shr.getUrlRequestParam("beginDate");
	       	_navi.setParm("beginDate", this.strBeginDate);
			this.beginDate  = new Date(this.strBeginDate.replace(/-/g, "/"));
	        this.strEndDate = shr.getUrlRequestParam("endDate");
	        _navi.setParm("endDate", this.strEndDate);
			this.endDate  = new Date(this.strEndDate.replace(/-/g, "/"));
			var personNumStr = window.localStorage? localStorage.getItem("personNumStrFromList"): Cookie.read("personNumStrFromList");
			_navi.setParm("personNumStr", personNumStr);
			$("button[class='shrbtn prev']").remove();//把上一步去掉
			$("div[class='wz_navi']").find("div[index='1']").removeClass().addClass("wz_navi_step");//把第一步点击取消
		}else{
			this.switchType = _navi.getParm("switchType");
			
	       	this.strBeginDate = _navi.getParm("beginDate");
			this.beginDate  = new Date(this.strBeginDate.replace(/-/g, "/"));
	        this.strEndDate = _navi.getParm("endDate");
			this.endDate  = new Date(this.strEndDate.replace(/-/g, "/"));
		}
		/** switchType: 2: 日历式排班3: 列表式排班*/
		if(this.switchType != null && this.switchType != undefined){
			var _self = this;
			switch(this.switchType){
				case "2":_self.calendarShift();break;
				case "3":_self.listShift();break;
				default:break;
			}
		}
	}
	/**
	 * 得到改变的当前年和月
	 */
	,calendarShift:function(){
		//遮盖列表排班
		$('#list').css('display','none');
		//显示日历排班
		$('#calendar').css('display','block');
		var that = this;
		
		$('#monthInfo').html((that.beginDate.getMonth() + 1) > 9 ? (that.beginDate.getMonth() +1) : '0'+ (that.beginDate.getMonth() +1));
		$('#yearInfo')
			.html(that.beginDate.getFullYear() + jsBizMultLan.atsManager_turnDefaultShift_i18n_18
			+ $.shrI18n.dateI18n.month2[that.beginDate.getMonth()]);
		
		that.month = that.beginDate.getMonth();
		that.year = that.beginDate.getFullYear();
	  
	    //初始化人员信息
		var field_list = that._navi.getParm("field_list");
		var persons = [];
		if((field_list != undefined && field_list.length > 0)){
			field_list.each(function(index){
				persons.push($(this).attr('id'));
				$("#personInfo").append($(this).outerHTML());
			});
		}
		var clickLeft = false,clickRight = true;
		$('#monthSelector').find('i').click(function(e){
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
					clickLeft = false;
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
					clickLeft = true;
					clickRight = false;
				}
			}
			$('#monthInfo').html((that.month + 1) > 9 ? (that.month +1) : '0'+ (that.month +1));
			$('#yearInfo')
				.html(that.year + jsBizMultLan.atsManager_turnDefaultShift_i18n_18
					+ $.shrI18n.dateI18n.month2[that.month]);
		
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
		var that = this;
		//由于日历控件在初始化的时候，格式不对，所以采ajax对齐局部刷新
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
				jsBizMultLan.atsManager_turnDefaultShift_i18n_24,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_28,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_22,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_25,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_26,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_27,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_23
			],
			monthNamesShort : [
				jsBizMultLan.atsManager_turnDefaultShift_i18n_6,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_7,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_8,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_9,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_10,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_11,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_12,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_13,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_14,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_3,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_4,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_5
			],
			monthNames : [
				jsBizMultLan.atsManager_turnDefaultShift_i18n_6,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_7,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_8,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_9,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_10,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_11,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_12,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_13,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_14,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_3,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_4,
				jsBizMultLan.atsManager_turnDefaultShift_i18n_5
			],
			editable : true,
			aspectRatio: 1.35,
			disableDragging : true,
			events : that._events,
			eventRender : function(event, element) {
				
			},
			eventAfterRender : function(event, element, view) {
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
									$(grandchild).css("opacity",0.7);	
								}
							});
							
							if(time.getTime() == event.start.getTime()){
								title = getColorTitle(tdThis,event.title,true);
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
			}
		});

		//对table进行监测: 过滤掉头两行：下标是从0开始的
		$('#calendar_info table tr:gt(1)').mousedown(function(){
			//鼠标点击事件： 过滤掉头三列
			$('#calendar_info table td:gt(2)').click(function(e){           
	 			$(this).addClass('cell-select-color');
	 			that.getSelectDateValue();
			}).mouseup(function(){
				that.getSelectDateValue();
 			});
 			
			$('#calendar_info table td:gt(2)').mousemove(function(e){           
     			$(this).addClass('cell-select-color'); 
			});
			
			/*对document进行mouseup事件的监听,当鼠标松开的时候，取消td的移动事件，
			* 同时保留td:gt(2)的鼠标松开事件
			*/
			$(document).mouseup(function(){
				$("#calendar_info table td").unbind('mousemove');
 			});
		});
	}
   /**
    *  得到着色日期的日期值
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
	}
	/**
	 * 给小于10的月份和年份前面加0,形成09的格式
	 */
    ,selectDayTypeAndAtsShift: function(selectCellColor){
    	var that = this;
    	var url = shr.getContextPath()+ '/dynamic.do?method=initalize&flag=turnShift'
    								  + '&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list';
    	$("#iframe1").attr("src",url);
		$("#iframe1").dialog({
			modal : false,
			title : jsBizMultLan.atsManager_turnDefaultShift_i18n_21,
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
									 that._events[j].title = title;
									 break;
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
	,formatDate: function(year, month, day){
		var tMonth = month > 9 ? month : ('0' + month);
		var tDay = day > 9 ? day : ('0' + day);
		if(arguments.length > 2)
			return year + '-' + tMonth + '-' + tDay;
		else 
			return year + '-' + tMonth;
	}
	,turnShiftListAction:function(){
		var url = '';
		var flag = "";
		if(this.switchType == '3'){
			
			var selectedIds = $("#list_info").jqGrid("getSelectedRows");
			if(selectedIds == null || selectedIds.length < 1){
				shr.showWarning({message: jsBizMultLan.atsManager_turnDefaultShift_i18n_20});
				return;
			}
			var personIds = [];
			var personIdAndRowNum = [];
			for (var i = 0, length = selectedIds.length; i < length; i++) {
					var  personId = $("#list_info").jqGrid("getCell", selectedIds[i], "personId");
					personIds.push(personId);
					personIdAndRowNum.push(personId + "_" + selectedIds[i]);
			}
			flag = "list";
		}
		else if(this.switchType == '2'){
			flag = "calendar";
		}
		else{
			//nothing
		}
		//这里personIds存储的都是number
	    localStorage.removeItem("shiftPersonIds");
		localStorage.setItem("shiftPersonIds", personIds);
		localStorage.removeItem("shiftPersonIdAndRowNum");
		localStorage.setItem("shiftPersonIdAndRowNum", personIdAndRowNum);
		if("1" == this.noShift){//从未排班列表中进入。
			var table = jQuery("#list_info");
		    var selectedIds = table.jqGrid("getSelectedRows");
		    var rowNums = selectedIds.length;
		    url = shr.getContextPath()+'/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsTurnShiftForListShift.list';
			url += '&flag=' + flag + '&firstBeginDate=' + this._navi.getParm("beginDate") + '&firstEndDate=' +  this._navi.getParm("endDate") ;
			url += '&noShift=' +  this.noShift;
		}else{
		    url = shr.getContextPath()+'/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsTurnShiftForListShift.list';
			url += '&flag=' + flag + '&firstBeginDate=' + this._navi.getParm("beginDate") + '&firstEndDate=' +  this._navi.getParm("endDate") ;
			url += '&policyId=' + this._navi.getParm("policyId") ;
		}

		$("#iframe1").attr("src",url);
		$("#iframe1").dialog({
	 		 modal: true,
	 		 width:850,
	 		 minWidth:850,
	 		 height:500,
	 		 minHeight:500,
	 		 title:jsBizMultLan.atsManager_turnDefaultShift_i18n_17,
	 		 open: function( event, ui ) {
	 		     
	 		 },
	 		 close:function(){
	 		     //绘制
	 		 }
 		});
    	$("#iframe1").attr("style","width:850px;height:500px;");
	}
	,listShift:function(){
		var that = this;
		
		//遮盖日历排班
		$('#calendar').css('display','none');
		//显示列表排班
		$('#list').css('display','block');
	
		var persons = [];
		if("1" == that.noShift){
			var personNumStr = window.localStorage? localStorage.getItem("personNumStrFromList"): Cookie.read("personNumStrFromList");
		     personNum = personNumStr;
		     persons = personNum.split(",");
		}else{
			var field_list = that._navi.getParm("field_list");
			if((field_list != undefined && field_list.length > 0)){
				field_list.each(function(index){
						persons.push($(this).attr('id'));
				});
			}
		}

		$.ajax({
				url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ListShiftHandler&method=getGridColModel",
				data: {beginDate:this.strBeginDate,endDate:this.strEndDate},
				dataType:'json',
				type: "POST",
				beforeSend: function(){
						openLoader(1, jsBizMultLan.atsManager_turnDefaultShift_i18n_16);
				},
				success : function(rst) {
					that.getDataGrid(rst,persons);
				},
				error: function(){
					closeLoader();
				},
				complete: function(){
					closeLoader();
				}
				
			});
	}
	,getDataGrid:function(rst,persons){
		 var that = this;
		 $.block.show({text:jsBizMultLan.atsManager_turnDefaultShift_i18n_15});
		 var options = {
			url : shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ListShiftHandler&method=getPersonShiftNew" 
				+ "&beginDate=" + encodeURIComponent(this.strBeginDate) + "&endDate=" + encodeURIComponent(this.strEndDate),
			mtype : "POST",
			datatype : "json",
			postData : {
			   "persons" : persons.join(',')
			},
			multiselect : true,
			rownumbers : false,
			colNames : rst.colNames,
			colModel : rst.colModel,
			recordpos : 'left',
			gridview : true,
			pginput : true,
			autoheight: true, 
			shrinkToFit :rst.colModel.length>10?false:true,
			height: 'auto',
			viewrecords : false,
			cellEdit:false,
			gridComplete :function(){
			},
			onCellSelect:function(rowid,iCol,cellcontent,e){
				if(iCol > 3 && iCol <= rst.colModel.length){
					jQuery("#list_info").setSelection(rowid,false);
					var table = jQuery("#list_info");
				    var tdObject = $("#"+rowid +">td")[iCol];
					$(tdObject).addClass('cell-select-color');
					
					if(that._clickPosition.length <= 2){
						that._clickPosition.push(rowid);
						that._clickPosition.push(iCol);
					}
					if(that._clickPosition.length == 4){
						that.setClickSection(rst);
					}
				}
				else{
					//nothing
				}
			}
		};
		options.resizeStop = function (newwidth,index){
			if(index==3){
				$("#list_info_frozen").parent().width($(".frozen-div").width());
			}
		};
		options.loadComplete = function (data) {
			if(data.flag != undefined && data.flag != null && !data.flag){
				var options={message:data.message};
				$.extend(options, {
							type: 'error',
							hideAfter: 3,
							showCloseButton: true
				});
				top.Messenger().post(options);
			}
			else{
				that._listRowDatas= data.rows;  
				
			}
			//给表格嵌上颜色
		  colorFormatter();
		  $("#list_info_frozen").parent().css({"overflow-y":"hidden"});
		  $("#list_info_frozen").parent().width($(".frozen-div").width());
		  $.block.hide();
		};
		
		jQuery('#list_info').html();
		jQuery('#list_info').jqGrid(options);
		jQuery('#list_info').jqGrid('setFrozenColumns');
		//就算显示表格的高度和宽度
		var height = (persons.length + 1) * 33.3 ;
		if(height > 550){
			height = 550;
		}
		height  += 'px'
		$('#list .ui-jqgrid-bdiv').css('height',height).css('width','100%').css('overflow-y','scroll','overflow-x','scroll');
		
		$("tr").css("background-color","#daeef8");         
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
					title : jsBizMultLan.atsManager_turnDefaultShift_i18n_21,
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
	},
	showMoreAction : function(){
		var that = this;
		var page = that.page + 1;
	    $("#list_info").setGridParam({page:page}).trigger("reloadGrid");
	}
});

/*
 * 回调针中处理
 */
function closeFrameDlg(ifameid,shiftName){
	$('#'+ifameid).attr('title',shiftName);
    $('#'+ifameid).dialog('close');
}

/**
 *  针对轮班规则
 */
function closeCalendarFrameDlg(ifameid,events){
    $('#'+ifameid).dialog('close');
    var iRow,jRow;
    for(var i=0;i<events.length;i++){
    	 iRow = events[i];
    	for(var j=0;j<_globalObject._events.length;j++){
    		jRow = _globalObject._events[j]
    		if(iRow["start"] == formatDate(jRow["start"])){
    			_globalObject._events[j].title = correctValue(iRow["title"]);
    			break;
    		}
    	}
    }
	_globalObject.initCalandar();	
}
/**
 * 针对轮班规则
 * 获取选择的人数作为外层循环变量
 * 用数据长度作为内层循环变量
 */
function closeListFrameDlg(ifameid,listData,beginCol,endCol){
    $('#' + ifameid).dialog('close');
    var table = jQuery("#list_info");
    var selectedIds = table.jqGrid("getSelectedRows");
    var rowNums = selectedIds.length;
	
    
    for(var r=0;r<rowNums;r++ ){
    	var index = 0;
    	for(var c=beginCol;c<=endCol;c++){
    		var title = listData[index].title;
    		var colName = listData[index].start;
    		(_globalObject._listRowDatas[parseInt(selectedIds[r]) - 1])[colName] = title;
    		
    		if(title == null || title == undefined || title.length < 1){
    		}
    		else{
    			table.setCell(selectedIds[r],c,title);
    		}
    		index++;
    	}
    }
   //给表格嵌上颜色
   colorFormatter();
	
}

function closeListFrameDlgForNoShift(ifameid,listData,beginCol,endCol){
	 $('#' + ifameid).dialog('close');
    var table = jQuery("#list_info");
    var selectedIds = table.jqGrid("getSelectedRows");
    var rowNums = selectedIds.length;
   for(var r=0;r<listData.length;r++){
        var listDataArr = listData[r];
		var rowNum = listDataArr.rowNum;
        for(var i=0;i<listData[r][rowNum].length;i++){
        	var data=listData[r][rowNum];//第一个[r]表示listData中的第几个值，第二个[r+1]表示取里面的属性rowNum

	    		var title = data[i].title;
	    		var colName = data[i].start;
	    		(_globalObject._listRowDatas[parseInt(selectedIds[r]) - 1])[colName] = title;
	    	
	    		if(title == null || title == undefined || title.length < 1){
	    		}
	    		else{
	    			table.setCell(selectedIds[r],i+beginCol,title);
	    		}

        }
    }
   //给表格嵌上颜色
   colorFormatter();
	
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

function colorFormatter(){
	var value = "";
	$('#list_info td').each(function() {
		value = $(this).text();
		if(value != undefined && value != null && value.length > 0){
			$(this).text(getColorTitle(this,value,true));
		}
	});
}
/**
 * _self：td列对象；value：传递过来的值对象：类似于[休息日]轮班1
 * flag：是否对当前列颜色标识
 */
function getColorTitle(_self,value,flag){
	$(_self).removeClass('gray-color');
	$(_self).removeClass('litterGreen-color');
	$(_self).removeClass('cell-select-color');
	if (value.substring(0, jsBizMultLan.atsManager_turnDefaultShift_i18n_2.length)
		== jsBizMultLan.atsManager_turnDefaultShift_i18n_2) {
		if(flag){
			$(_self).addClass('gray-color');
		}
		return value.substring(jsBizMultLan.atsManager_turnDefaultShift_i18n_2.length);
	}
	else if (value.substring(0, jsBizMultLan.atsManager_turnDefaultShift_i18n_0.length)
		== jsBizMultLan.atsManager_turnDefaultShift_i18n_0) {
		if(flag){
			$(_self).addClass('litterGreen-color');	
		}
		return value.substring(jsBizMultLan.atsManager_turnDefaultShift_i18n_0.length);
	}
	else {
		if (value.indexOf(jsBizMultLan.atsManager_turnDefaultShift_i18n_1) > -1) {
			return value.substring(jsBizMultLan.atsManager_turnDefaultShift_i18n_1.length);
		}
		else{
			return value;
		}
	}
}
