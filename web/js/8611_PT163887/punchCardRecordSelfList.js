var first_Date = "";
var last_Date  = "" ;
shr.defineClass("shr.ats.PunchCardRecordSelfList", shr.framework.List, {
	 
	initalizeDOM : function () {
		shr.ats.PunchCardRecordSelfList.superClass.initalizeDOM.call(this);
		var that = this;
		
		$('#searcher').hide();
		that.initQueryDateInfo();
		//that.filter();//页面第一次总是不能通过reloadGrid达到 日期过滤，那就在 后台处理
		
		//that.queryAction();
		//this.addReasonDiv();
		//that.processGridValue();
	},
	/**
	 * 初始化我的打卡记录上边的查询条件 开始日期 和结束日期
	 * 开始日期 往前推一个月 结束日期是当前系统日期
	 */
	/*initQueryDateInfo : function(){
        var now =  new Date();
        var year = now.getFullYear();       //年
        var month = now.getMonth() + 1;     //月
        var day = now.getDate();            //日
        var day_first = 0;
        var hh = now.getHours();            //时
        var mm = now.getMinutes();          //分
        if(month < 10){
        	month = "0" + month ;
        }
        if(day < 10){
        	day = "0" + day ;
        }
        //year = 2013;
        //month = 12;
        var currentDate = year + "-" +month + "-" + day;
        var new_date =  new Date(year,month,1);//获取当月的第一天(return date)
        var last_day = (new Date(new_date.getTime()-1000*60*60*24)).getDate();//获取当月最后一天日期(return day )
        var first_day  = new_date.getDate(); //第一天
        var firstDate = year + "-" +month + "-" +first_day;
        var lastDate  = year + "-" +month + "-" +last_day;
        last_Date  = lastDate;
        //alert(firstDate +"   " + lastDate) ;
        //获取上个月的第一天
        var now_up 	=  new Date();
        var year_up = now_up.getFullYear();
        var month_up= now_up.getMonth() + 1;
        var day_up  = now_up.getDate();
        //2012-12-01   2013-01-10
        month_up = month_up - 1;//上个月
        //alert("month_up=="+month_up);
        if (month_up == 0) {
        	month_up = 12;
        	year_up --;
        }
        if (month_up<10) {
        	month_up = "0" + month_up;
        }
        var day_fir = new Date(year_up,month_up,1).getDate();
        if (day_fir < 10) {day_fir = "0"+day_fir;}
        var beginDate = year_up + "-" + month_up + "-" + day_fir ;
        //alert(beginDate)
        first_Date = beginDate;
		$("#beginDate").val(beginDate);
		$("#endDate").val(currentDate);
	},*/
	/**
	 * 初始化我的打卡记录上边的查询条件 开始日期 和结束日期
	 * 开始日期 往前推一个月 结束日期是当前系统日期.
	 * 
	 * 值来自于后台渲染成的隐藏值。
	 * */
	initQueryDateInfo : function(){
		atsMlUtile.setTransDateTimeValue("beginDate",atsMlUtile.getFieldOriginalValue('preMonthDateShortStr'));
		atsMlUtile.setTransDateTimeValue("endDate",atsMlUtile.getFieldOriginalValue('currDateShortStr'));
	},
	//点击查询按钮执行的方法
	queryAction:function(){
		 var that = this;
		 that.filter();
		 //that.processGridValue();
	},
		/**
	 * 获取查询字段
	 */
	getSelector: function() {
		return 'id,date,week,ATTENDANCEFILE.ID,CALENDARGROUP.ID,ATTENCEPOLICY.ID,PERSON.ID';
	},
 	viewAction: function(billId) {
	},
	
	//默认进来查询上个月1号到系统当前日期的数据
//	getCustomFilterItems: function() {
//		var that = this;
//		that.initQueryDateInfo();
//		//alert(first_Date);
//		var filterStr = "";
//		if ( first_Date != "" && last_Date != "") {
//			filterStr = " date >=  '"+first_Date+"' and  date <= '"+last_Date+"' ";
//		}
//		return filterStr;
//	},
	
	filter:function(){
		
		var that = this;
		var array = new Array();
		var filterStr = "";
		var filterStr1;
		var filterStr2;
		var filterStr3;
		var filterStr4;
		
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate   = atsMlUtile.getFieldOriginalValue("endDate");
		
		if ( beginDate != ""  ) {
			filterStr3 = " date >= '"+beginDate+"' ";
 			array.push(filterStr3);
		}
		if ( endDate != ""  ) {
			filterStr4 = " date <= '"+endDate+"' ";
 			array.push(filterStr4);
		}
		for (var index = 0; index < array.length; index++) {
			if (index == array.length-1) {
				filterStr = filterStr + array[index]
			}else{
				filterStr = filterStr + array[index] + "and";
			}
		}
		
		$("#grid").jqGrid("option", "filterItems", filterStr).jqGrid("reloadGrid");	
	},
	
	
	addReasonDiv: function() {
		$('body').append(this.getReasonDivHtml());
	},
	
	getReasonDivHtml: function() {		
		return ['<div id="reason_div" >',
				    '<div class="modal-header">',
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
						'<h5>'
						+ jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_1
						+ '</h5>',
					'</div>',
					'<div class="modal-body">',
						'<div class="row-fluid row-block">',
							'<div class="span10 offset1">',
								'<textarea id="reason-content" placeholder="'
								+ jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_2
								+ '"></textarea>',
							'</div>',
						'</div>',
					'</div>',
					'<div class="modal-footer">',
						'<a href="#" class="shrbtn-primary shrbtn" id="confirm">'
						+ jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_4
						+ '</a>',
						'<a href="#" class="shrbtn" id="cancel">'
						+ jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_3
						+ '</a>',
					'</div>',
				'</div>'].join('');
	},
	gridLoadComplete: function() {
		var that = this;
		// add input
		var $grid = $('#grid'), ids = $grid.getDataIDs();
		var id, status;
		for (var i = 0, length = ids.length; i < length; i++) {
			id = ids[i];
		}
		
		$("#grid").find("td[aria-describedby='grid_fillCardTimeStr']").each(function(){
			if('--'==$(this).text()){
			    ;
			}else{
			   var text=$(this).text();
			   $(this).empty();
			   $(this).append("<a href='#' class='more_FillSignCardBillInfoList' style='color:blue'>"+text+"</a>");
			}
		});
		$(".more_FillSignCardBillInfoList").click(function(){
		    var rowId = $(this).parents("tr").attr("id");
			var dateValue = atsMlUtile.getFieldOriginalValue($(this).parents("tr").find("td[aria-describedby='grid_date'] a "));
			sessionStorage.removeItem("punchCardFlag");
			sessionStorage.setItem("punchCardFlag", "fromPunchCard");
			var url =  shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.FillSignCardList&dateValue="+dateValue;
			var leavebillDialog = $("#operationDialog");
			leavebillDialog.children("iframe").attr('src',url);
			leavebillDialog.dialog({
				title: jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_0,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+15%',
					of: window
				},
				close: function(){
				   sessionStorage.removeItem("punchCardFlag");
				}
			});	
		});
		
		//从“我的打卡记录进去----弹出框的 我要补卡”
		$("#grid").find("td[aria-describedby='grid_operation']").append("<span class='position-more'><a href='#' class='more_FillSignCardBill' style='color:blue'>"
			+ jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_5
			+ "&nbsp;&nbsp;&nbsp;&nbsp;</a></span>");
		$(".more_FillSignCardBill").click(function(){
			var punchCardSelfFlag = "self";
			var rowId = $(this).parents("tr").attr("id");
			var strdate = $(this).parents("tr").children("td").eq(1).attr("title");
			var dateValue = atsMlUtile.getFieldOriginalValue($(this).parents("tr").find("td[aria-describedby='grid_date']"));
			localStorage.removeItem("fromFlag");
			localStorage.setItem("fromFlag", "punchCard");
			sessionStorage.removeItem("punchCardFlag");
			sessionStorage.setItem("punchCardFlag", "fromPunchCard");
			var url = shr.getContextPath()+"/dynamic.do?method=addNew&dateValue="+dateValue+"&rowId="+rowId+"&punchCardSelfFlag="+punchCardSelfFlag+"&uipk=com.kingdee.eas.hr.ats.app.FillSignCardForm&strdate=" + strdate  + "&fromFlag=punchCard";;
			var leavebillDialog = $("#operationDialog");
			leavebillDialog.children("iframe").attr('src',url);
			leavebillDialog.dialog({
				title: jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_5,
				width:850,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+40%',
					of: window
				},
				close:function(){
					var array = new Array();
					var filterStr = "";
					var filterStr1;
					var filterStr2;
					var filterStr3;
					var filterStr4;
					
					var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
					var endDate   = atsMlUtile.getFieldOriginalValue("endDate");
					
					if ( beginDate != ""  ) {
						filterStr3 = " date >= '"+beginDate+"' ";
			 			array.push(filterStr3);
					}
					if ( endDate != ""  ) {
						filterStr4 = " date <= '"+endDate+"' ";
			 			array.push(filterStr4);
					}
					for (var index = 0; index < array.length; index++) {
						if (index == array.length-1) {
							filterStr = filterStr + array[index]
						}else{
							filterStr = filterStr + array[index] + " and ";
						}
					}
					$("#grid").jqGrid("option", "filterItems", filterStr).jqGrid("reloadGrid");	
					sessionStorage.removeItem("punchCardFlag");
	 		    }
			});
		});
		
		
		$("#grid").find("td[aria-describedby='grid_operation']").
			append("<span class='position-more'><a href='#' class='more_LeaveBill' style='color:blue'>"
			+ jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_7
			+ "&nbsp;&nbsp;&nbsp;&nbsp;</a></span>");
		$(".more_LeaveBill").click(function(){
			var punchCardSelfFlag = "self";
			var rowId = $(this).parents("tr").attr("id");
			var dateValue = atsMlUtile.getFieldOriginalValue($(this).parents("tr").find("td[aria-describedby='grid_date']"));
			//alert(rowId + dateValue);
			//href.=".do?nebd=''&id="+id+"date="+data;
			//window.location.href = shr.getContextPath()+"/dynamic.do?method=addNew&dateValue="+dateValue+"&rowId="+rowId+"&punchCardSelfFlag="+punchCardSelfFlag+"&uipk=com.kingdee.eas.hr.time.app.LeaveBillNew";
			
			//龙光单据
			//var url = shr.getContextPath()+"/dynamic.do?method=addNew&dateValue="+dateValue+"&rowId="+rowId+"&punchCardSelfFlag="+punchCardSelfFlag+"&uipk=com.kingdee.eas.hr.time.app.LeaveBillNew";
			localStorage.removeItem("fromFlag");
			localStorage.setItem("fromFlag", "punchCard");
			sessionStorage.removeItem("punchCardFlag");
			sessionStorage.setItem("punchCardFlag", "fromPunchCard");
			//ATS新版请假单单据
			var url = shr.getContextPath()+"/dynamic.do?method=addNew&dateValue="+dateValue+"&rowId="+rowId+"&punchCardSelfFlag="+punchCardSelfFlag+"&uipk=com.kingdee.eas.hr.ats.app.AtsLeaveBillForm" + "&fromFlag=punchCard";
			
			var leavebillDialog = $("#operationDialog");
			leavebillDialog.children("iframe").attr('src',url);
			leavebillDialog.dialog({
		 		autoOpen: true,
				title: jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_7,
				width:950,
		 		 //minWidth:950,
		 		 height:600,
		 		 //minHeight:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+40%',
					of: window
				},
				close:function(){
				   sessionStorage.removeItem("punchCardFlag");
				}
			});
		});
		
		//0131125龙光不要“我要出差”，去掉
		$("#grid").find("td[aria-describedby='grid_operation']").
			append("<span class='position-more'><a href='#' class='more_TripBill' style='color:blue'>"
			+ jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_6
			+ "</a></span>");
		$(".more_TripBill").click(function(){
			var punchCardSelfFlag = "selfTrip";
			var rowId = $(this).parents("tr").attr("id");
			var dateValue = atsMlUtile.getFieldOriginalValue($(this).parents("tr").find("td[aria-describedby='grid_date']"));
			localStorage.removeItem("fromFlag");
			localStorage.setItem("fromFlag", "punchCard");
			sessionStorage.removeItem("punchCardFlag");
			sessionStorage.setItem("punchCardFlag", "fromPunchCard");
			//window.location.href= shr.getContextPath()+"/dynamic.do?method=addNew&dateValue="+dateValue+"&rowId="+rowId+"&punchCardSelfFlag="+punchCardSelfFlag+"&uipk=com.kingdee.eas.hr.ats.app.AtsTripBill.form";
			var serviceId = shr.getUrlRequestParam("serviceId");
			var url = shr.getContextPath()+"/dynamic.do?method=addNew&dateValue="+dateValue+"&rowId="+rowId+"&punchCardSelfFlag="+punchCardSelfFlag+"&uipk=com.kingdee.eas.hr.ats.app.AtsTripBill.formForDialog"  + "&fromFlag=punchCard";
			url += "&ignoreHROrgF7Cache=true&serviceId=" + encodeURIComponent(serviceId);
			var tripBillDialog = $("#operationDialog");
				tripBillDialog.children("iframe").attr('src',url);
				tripBillDialog.dialog({
					title: jsBizMultLan.atsManager_punchCardRecordSelfList_i18n_6,
					width:950,
		 		 //minWidth:950,
		 		 height:600,
		 		 //minHeight:600,
					modal: true,
					resizable: true,
					position: {
						my: 'center',
						at: 'top+5%',
						of: window
					},
					close:function(){
				       sessionStorage.removeItem("punchCardFlag");
				    }
				});
		});
		
	},
	//Jqgird给表格添加URL链接
	 processGridValue:function(){
	 	var gridTable = $('#grid');
		var cell;
		var array=gridTable.getDataIDs();
		for ( var i = 0; i < array.length; i++) {
			var rowarray = gridTable.getRowData(array[i])
			for ( var rowname in rowarray) {
				if(rowname.indexOf("week")>-1){
					cell=gridTable.getCell(array[i],rowname);
					gridTable.setCell(array[i],rowname,'<a href="#" javascript:void(0)>'+cell+'</a>');
				}
			}
		}
	}
});
/**
 * 用于动态修改对话框标题
 * @author ahong_chen
 */
function changeDialogTitle(title){
  $("#operationDialog").parent().children(".ui-dialog-titlebar").children(".ui-dialog-title").text(title);
}








