//组织长编码
var orgLongNum="";
shr.defineClass("shr.ats.SignRecordList", shr.framework.List, {
	isFirstTimeLoad: true,
	initalizeDOM : function () {
		
		var that = this;
		
		//设置默认的查询条件
	    that.processF7ChangeEvent();
		that.setDefaultQueryFilter();
		this.initDateQueryParam();
		shr.ats.SignRecordList.superClass.initalizeDOM.call(this);
		//快速过滤展开
		if($(".filter-containers").is(":hidden")){
			$("#filter-slideToggle").click();
		}
	},
	initDateQueryParam: function() {
		var self = this;
		atsMlUtile.setTransDateTimeValue("beginDate",self.formatDateToStr(new Date()));
		atsMlUtile.setTransDateTimeValue("endDate",self.formatDateToStr(new Date()));
	},
	
	formatDateToStr: function (date) {  
            var y = date.getFullYear();  
            var m = date.getMonth() + 1;  
            m = m < 10 ? '0' + m : m;  
            var d = date.getDate();  
            d = d < 10 ? ('0' + d) : d;  
         return y + '-' + m + '-' + d;  
     },
	setDefaultQueryFilter:function()
	{
		$("#auditOpinion_el").val(0);
		$("#auditOpinion").val(jsBizMultLan.atsManager_signRecordList_i18n_6);
		 //设置默认的查询时间
		var nowDate=new Date();
		var nowDateYear,nowDateMonth,nowDateDay,nowDateStr;
		nowDateYear=nowDate.getFullYear();
		nowDateMonth=nowDate.getMonth()+1;
		nowDateMonth=nowDateMonth>9?nowDateMonth:"0"+nowDateMonth;
		nowDateDay=nowDate.getDate()>9?nowDate.getDate():"0"+nowDate.getDate();
		nowDateStr=nowDateYear+"-"+nowDateMonth+"-"+nowDateDay;
		var lastWeekDateLong=nowDate.getTime()-7*24*3600*1000;
		var lastWeekDate=new Date(lastWeekDateLong);//@
		var lastWeekDateYear,lastWeekDateMonth,lastWeekDateDay,lastWeekDateStr;
		lastWeekDateYear=lastWeekDate.getFullYear();
		lastWeekDateMonth=lastWeekDate.getMonth()+1;
		lastWeekDateMonth=lastWeekDateMonth>9?lastWeekDateMonth:"0"+lastWeekDateMonth;
		lastWeekDateDay=lastWeekDate.getDate()>9?lastWeekDate.getDate():"0"+lastWeekDate.getDate();
		lastWeekDateStr=lastWeekDateYear+"-"+lastWeekDateMonth+"-"+lastWeekDateDay;
		atsMlUtile.setTransDateTimeValue("beginDate",lastWeekDateStr);
		atsMlUtile.setTransDateTimeValue("endDate",nowDateStr);
		
						//设置默认的查询组织 这边必须的用同步的请求，不然无法过滤。
					  var serviceId = shr.getUrlRequestParam("serviceId");
				      var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=getDefaultOrg";
				      url += '&serviceId='+encodeURIComponent(serviceId);
					   shr.ajax({
						type:"post",
						async:false,
						url:url,
						success:function(res){
							var info = res;
							if(info!=null){
								var dataValue = {
									id : info.orgID,
									name : info.orgName,
									longNumber:info.longNumber
								};
								$('#adminOrg').shrPromptBox("setValue", dataValue);
	
							}
					

					    }
					});
	},

	//默认进来显示 未审核的数据 0-未审核 1-同意 2-不同意
//	getCustomFilterItems: function() {
//		var that = this;
//		var array = new Array();
//		var filterStr = "";
//		var filterStr1;
//		var filterStr2;
//		var filterStr3;
//		var filterStr4;
//		var filterStr5;
//		var personName = $.trim($("#person").val());
//		var beginDate = $("#beginDate").val();
//		var endDate = $("#endDate").val();
//		var auditOpinion = $("#auditOpinion_el").val();
//		if (orgLongNum != "") {
//			filterStr1 =  " adminOrg.longNumber like '"+orgLongNum+"%' "; 
//			array.push(filterStr1);
//		}
//		if (personName != "") {
//			filterStr2 = " person.name like '%"+personName+"%' "; 
//			array.push(filterStr2);
//		}
//		if ( beginDate != ""  ) {
//		    beginDate=beginDate+" 00:00:00"
//			filterStr3 = "signTime>= '"+beginDate+"' ";
// 			array.push(filterStr3);
//		}
//		if ( endDate != ""  ) {
//		    endDate=endDate+" 23:59:59"
//			filterStr4 = "signTime<= '"+endDate+"' ";
// 			array.push(filterStr4);
//		}
//		if ( auditOpinion != ""  ) {
//			filterStr5 = " auditOpinion = '"+auditOpinion+"' ";
// 			array.push(filterStr5); 
//		}
//		for (var i = 0; i < array.length; i++) {
//			if (i == array.length-1) {
//				filterStr = filterStr + array[i]
//			}else{
//				filterStr = filterStr + array[i] + "and ";
//			}
//		}
//		return filterStr;
//	},
	processF7ChangeEvent : function(){
		var that = this;
		$('#adminOrg').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   var adminOrgLongNumber;
			   if(info!=null){
			   if(info.longNumber !=null && info.longNumber!=''){ 
			   		orgLongNum=info.longNumber;
			   }

			}
			}
		});

	
  },
	gridLoadComplete: function() {
		$("#grid").find("td[aria-describedby='grid_img']").each(function(){
        var fID=$.trim($(this).parents("tr").attr("id"));
        if(fID!="")
        {
        	var url = shr.getContextPath() + '/dynamic.do?handler=com.kingdee.shr.ats.web.handler.SignRecordListHandler&method=imageIsExsit&fID='+encodeURIComponent(fID);
        	shr.doAjax({
        		url:url,
        		success:function(data)
        		{
        			if(data && data.imageIsExsit=="true")
        			{

	        				$("#grid").find("td[aria-describedby='grid_img']").each(function(){
	        					var rowID=$.trim($(this).parents("tr").attr("id"));
	        					if(rowID==fID)
	        					{
	        							$(this).append("<a href='#' class='image_view' onclick='getImage(this)' style='color:blue'>"
											+ jsBizMultLan.atsManager_signRecordList_i18n_0
											+ "</a>");
	        					}
	        				});
	        			
	        			
	        		 }
        		}
        		});
			    
			  }

		});	
	},
	filter:function(){

		
	},
	queryGrid: function(){
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"signDate","errorMessage":jsBizMultLan.atsManager_signRecordList_i18n_2});
		if(dateRequiredValidate){
			shr.ats.SignRecordList.superClass.queryGrid.call(this);
		}
	},
	//点击查询按钮执行的方法
	queryAction:function(){
		 var that = this;
		  var filterStr=that.getCustomFilterItems();
		  
		var proposerName = $("#person").val();
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		
		if(proposerName == "" && beginDate && endDate){
			if((new Date(endDate) - new Date(beginDate))/(1000 * 60 * 60 * 24) >= 8){//@
				shr.showConfirm(jsBizMultLan.atsManager_signRecordList_i18n_7,function(){
					$("#grid").jqGrid("option", "filterItems", filterStr).jqGrid("reloadGrid");
				});
				return;
			}
		}
			
		 $("#grid").jqGrid("option", "filterItems", filterStr).jqGrid("reloadGrid");	
		 
	},
 	viewAction: function(billId) {
	},
	
	//同意
	agreeAction: function (even){
		var that = this;
		var Ids = $(this.gridId).jqGrid("getSelectedRows");
		if (Ids.length <= 1) {
			if((Ids.length == 1 && Ids[0] == "") || Ids.length <= 0){
				shr.showWarning({message: jsBizMultLan.atsManager_signRecordList_i18n_1, hideAfter: 5});
				return false;
			}
	    }

		for (var i = 0; i < Ids.length; i++) {
			if($(window.document.getElementById(Ids[i])).find("td[aria-describedby='grid_cardState']")
				.html() == jsBizMultLan.atsManager_signRecordList_i18n_11){

				shr.showWarning({"message" : jsBizMultLan.atsManager_signRecordList_i18n_9});
				return ;
			}
	    }
		var  selectIds = $(this.gridId).jqGrid("getSelectedRows");
		
		that.remoteCall({
			type:"post",
			method:"setAuditOpinionPass",
			param:{selectIds: JSON.stringify(selectIds)},//["11","22","33"]
			success:function(res){
				var data = res;
				if (data.result == 1) {
					 top.Messenger().post({
						message: jsBizMultLan.atsManager_signRecordList_i18n_3,
						showCloseButton: true
					 });
					 //刷新表格
					 $("#grid").jqGrid().jqGrid("reloadGrid");
					 return false;
				}else if (data.result == 2) {
					 top.Messenger().post({
						message: jsBizMultLan.atsManager_signRecordList_i18n_8,
						showCloseButton: true
					 });
					 return false;
				}else{
					 top.Messenger().post({
						message: jsBizMultLan.atsManager_signRecordList_i18n_4,
						showCloseButton: true
					 });
					 return false; 
				} 
			}
		});

	},
	
	//不同意
	antiAgreeAction: function (even){
		var that = this;
		var Ids = $(this.gridId).jqGrid("getSelectedRows");
		if (Ids.length <= 1) {
				if((Ids.length == 1 && Ids[0] == "") || Ids.length <= 0){
					shr.showWarning({message: jsBizMultLan.atsManager_signRecordList_i18n_1, hideAfter: 5});
					return false;
				}
	    }

		for (var i = 0; i < Ids.length; i++) {
			if($(window.document.getElementById(Ids[i])).find("td[aria-describedby='grid_cardState']")
				.html() == jsBizMultLan.atsManager_signRecordList_i18n_11){

				shr.showWarning({"message" : jsBizMultLan.atsManager_signRecordList_i18n_9});
				return ;
			}
		}
		var  selectIds = $(this.gridId).jqGrid("getSelectedRows");
		
		that.remoteCall({
			type:"post",
			method:"setAuditOpinionDisagree",
			param:{selectIds: JSON.stringify(selectIds)},//["11","22","33"]
			success:function(res){
				var data = res;
				if (data.result == 1) {
					 top.Messenger().post({
						message: jsBizMultLan.atsManager_signRecordList_i18n_3,
						showCloseButton: true
					 });
					 //刷新表格
					 $("#grid").jqGrid().jqGrid("reloadGrid");
					 return false;
				}else if (data.result == 2) {
					 top.Messenger().post({
						message: jsBizMultLan.atsManager_signRecordList_i18n_8,
						showCloseButton: true
					 });
					 return false;
				}else{
					 top.Messenger().post({
						message: jsBizMultLan.atsManager_signRecordList_i18n_4,
						showCloseButton: true
					 });
					 return false; 
				} 
			}
		});

		
	},
	queryGrid: function() {
		var _self = this;
		var $grid = $(this.gridId);
		_self.setFastFilterMap();
		this.setGridTreeParam();
		this.setGridCustomParam();
		this.setBotpFilterItems($grid);
		
		this.queryFastFilterGrid();
		
		// selector
		var selector = this.getSelector();
		if (typeof selector !== 'undefined') {
			$grid.setGridParam({ selector: selector	});
		}
		// filter
		var filterItems = this.getFilterItems();
		$grid.jqGrid("option", "filterItems", filterItems);
		
		// fastFilter
		var fastFilterItems = this.getFastFilterItems();
		if (fastFilterItems) {
			$grid.jqGrid("option", "fastFilterItems", JSON.stringifyOnce(fastFilterItems));
		}

		//seniorFilter
		var advancedFilter = this.getAdvancedFilterItems();
		if(_self.fastFilterMap && _self.fastFilterMap.fastFilterItems && _self.isReturn){
			advancedFilter = _self.fastFilterMap.fastFilterItems.advancedFilter;			
		}
		if(advancedFilter){
			$grid.jqGrid("option", "advancedFilter", JSON.stringify(advancedFilter));
		}else{
			$grid.jqGrid("option", "advancedFilter", null);
		}	

		// sorter
		var sorterItems = this.getSorterItems();
		if (sorterItems) {
			$grid.jqGrid("option", "sorterItems", sorterItems);
		}
		var keyField = this.getBillIdFieldName();
		if (keyField) {
			$grid.jqGrid("option", "keyField", keyField);
		}
		// 修改为通过URL取数
		$grid.jqGrid('setGridParam', {datatype:'json'});
		// reload
		if(!this.isFirstTimeLoad){
			$grid.jqGrid("reloadGrid");
		}else{
			this.isFirstTimeLoad = false;
		}	
		var filtertype = 'normal';
		var filterValue = filterItems;
		if(this.getQuickFilterItems()){
			filtertype = 'QuickFilter';
			filterValue = this.getQuickFilterItems();
		}
		if(this.getCustomFilterItems()){
			filtertype = 'CustomFilter';
			filterValue = this.getCustomFilterItems();
		}
		var text = {id:this.uipk,text:this.title,filtertype:filtertype,filter:filterValue};
		var value = {type:2,msg:text};
		shr.operateLogger(value);
	}
	
 	
 	
});

function getImage(obj){
	  var imgHtml="";
	  $("#imageDialog").remove();
	  var fID=$.trim($(obj).parents("tr").attr("id"));
	  var imageDialog='<div id="imageDialog" style="text-align:center;display:none"></div>';
	  $("#home-container").append(imageDialog);
	  var imageDialog = $("#imageDialog");
	  var url = shr.getContextPath() + '/dynamic.do?handler=com.kingdee.shr.ats.web.handler.SignRecordListHandler&method=getImage&fID='+encodeURIComponent(fID);
	  imgHtml='<div ><img id="imageview" alt="'
		  + jsBizMultLan.atsManager_signRecordList_i18n_10
		  + '" src="' + url + '"style="cursor: pointer;"/></div>';
	  imageDialog.append(imgHtml);
      imageDialog.dialog({
				title: jsBizMultLan.atsManager_signRecordList_i18n_5,
				modal: true,
				resizable: true,
				position: {
					my:'center',
					at: 'top+15%',
					of: window,
				}
			});	

}










