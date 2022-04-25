var defaultPageSize= 8;
var flag = 1;
var currentQuery = "com.kingdee.eas.hr.ats.app.JobInstQueryForATS";
var historyQuery = "com.kingdee.eas.hr.ats.app.AtsJobInstHstQuery";
var query = currentQuery;

var global_jobInsId = "";
var timer = "";
var detailCurrentPage = 1;
var detailPageRows = 20;

shr.defineClass("shr.ats.JobInstList", shr.framework.List, {
	initalizeDOM : function(){
		var that = this;
		shr.ats.JobInstList.superClass.initalizeDOM.call(this);
		that.initTab();
	}
	,initTab : function(){
		var that = this;
		var categoryFilter = parent.window.getJobFilter();
		if (categoryFilter.indexOf("302!3005")==-1){
			$(".nav-tabs li a").css({"width" : "100px", "text-align" : "center"})
			$(".nav-tabs").on("click", function(e){
				if($(e.target).attr("href") == "#tab1"){
					flag = 1;
					that.queryGrid();
				}else if($(e.target).attr("href") == "#tab2"){ 
					flag = 2;
					that.queryGrid();
				}
			})
		}else {
			$(".tabbable").remove();//假期额度后台日志取消tab页
		}
		$("#breadcrumb").append('<li class="active" style="background: none;">'
			+ jsBizMultLan.atsManager_jobInst_i18n_9
			+ '</li>');
		$(".grid-toolbar").prepend('<div class="span4"></div>');
		if(window.contextLanguage == "en_US"){
			$(".nav-tabs li a").css({"width" : "120px"})
		}
	}
	,refulshAction: function(){
		var pageInfo = $("#gripage").html();
		var page = pageInfo.substring(1,pageInfo.indexOf('-'));
		var pageNum = parseInt(parseInt(page)/defaultPageSize) + 1;
		this.getJobInstList(pageNum, defaultPageSize);
	}
	,closeAction: function(){
		parent.$("#dialogTransaction").dialog("close");
	}
	,viewHstDataAction: function(){
		if(query == currentQuery){
			query = historyQuery;
			this.queryGrid();
			$("#viewHstData").html(jsBizMultLan.atsManager_jobInst_i18n_0);
		}else if(query == historyQuery){
			query = currentQuery;
			this.queryGrid();
			$("#viewHstData").html(jsBizMultLan.atsManager_jobInst_i18n_1);
		}
	}
	,queryGrid: function() {		
		if(this.uipk=="com.kingdee.eas.base.job.app.JobInst.list"){
			this.getJobInstList(1, defaultPageSize);	
		}else{			
			shr.ats.JobInstList.superClass.queryGrid.call(this);			
		}
	}
	,getCustomFilterItems: function() {
		var filterStr = "";
		//var categoryFilter = '';
		var categoryFilter = parent.window.getJobFilter();
		//假期额度后台日志取消tab页，故查询条件creator也取消
		var curent_person = this.initData.person_id ;
		if (categoryFilter.indexOf("302!3005")==-1){
			if(flag == 1){
			filterStr = "creator.id = '" +curent_person + "'";
			//filterStr = "creator.name = '" + $("#user_name").attr("title") + "'";
			}else{
				filterStr = "creator.id <> '" + curent_person + "'";
				//filterStr = "creator.name <> '" + $("#user_name").attr("title") + "'";
			}
			return this.mergeFilter(filterStr, categoryFilter);
		}
		else {
			return categoryFilter;
		}
		
	}
	
	,getJobInstList: function(page, pageSize){
		var that = this;
		var filterItems = this.mergeFilter(this.getQuickFilterItems(), this.getCustomFilterItems());
		var advancedFilter = that.getAdvancedFilterItems();
		if (advancedFilter) {
			advancedFilter =JSON.stringify(advancedFilter);
		}else{
			advancedFilter = "";
		}
		var fastFilterItems = this.getFastFilterItems();
		if (fastFilterItems == undefined) {
			fastFilterItems = "";
		}
		that.setFastFilterMap();
		var selector = this.getSelector();
		$("#gview_grid").css("display","none");
		if ($("#gridPager1").length < 1) {
			// 支持分页多次调用，且不用定义分页的ID
			var gridPagerDiv = '<div id="gridPager1"></div>';
			$('#gridPager').parent().html(gridPagerDiv);
		}
		this.remoteCall({
			type : "post",
			showBlock : true,
			async : false, 
			method : "getJobInstList",
			param : {
				query: query,
				filterItems : filterItems,
				advancedFilter:advancedFilter,
				fastFilterItems: fastFilterItems,
				columnModel : selector,
				rows : pageSize ? pageSize : defaultPageSize,
				page : page ? page : 1,
				sidx : "createdTime DESC"
			},
			success : function(res){
				if (typeof res == "string") {
					eval("res=" + res);
				}
				var divStr = [];
				var rows = res.rows;
				var startedTime = "<span style='color:red;'>"
					+ jsBizMultLan.atsManager_jobInst_i18n_23
					+ "</span>";
				var scheduledTime = "<span style='color:red;'>"
					+ jsBizMultLan.atsManager_jobInst_i18n_21
					+ "</span>";
				var stateChangedTime = "<span style='color:red;'>"
					+ jsBizMultLan.atsManager_jobInst_i18n_22
					+ "</span>";
				var createdTime = "<span style='color:red;'>"
					+ jsBizMultLan.atsManager_jobInst_i18n_20
					+ "</span>";
				var item;
				var title;
				var state;
				var creator;
				var jobInsId;
				var title;
				var t1 = 24, t2 = 26;
				var titleNameShort;
				var nameShort;
				for ( var i = 0; i < rows.length; i++) {
					item = rows[i];
					title = item.title;
					state = item.state.alias;
					if(state == ""){
						state = item.state.value;
					}
					creator = item['creator.name'];
					jobInsId = item.jobInstId;
					if (item.startedTime) {
						startedTime = item.startedTime;
					}
					if (item.scheduledTime) {
						scheduledTime = item.scheduledTime;
					}
					
					stateChangedTime = "";
					//已完成 已失败
					//if(state=="已完成"){
						if (item.stateChangedTime && (state.indexOf(jsBizMultLan.atsManager_jobInst_i18n_34) != -1
							|| state.indexOf(jsBizMultLan.atsManager_jobInst_i18n_33)  != -1 ) ) {
							stateChangedTime = item.stateChangedTime;
						}
					//}
					if (item.createdTime) {
						createdTime = item.createdTime;
					}
					title = item.title || "";
					title = title.substr(0,title.lastIndexOf("_"));
					titleNameShort = subStringAdvice(title, t1, true);
					nameShort = subStringAdvice(title, t2, true);
					divStr.push('<div class="PCountDiv"><div class="schemeDiv' + '" data=\'' + JSON.stringify(item) + '\'>');
					divStr.push('<div><h class="schemeTitle" title="' + title + '">' + titleNameShort + '</h></div>');
					divStr.push('<p style="height:1px;"></p>');
					//divStr.push('<div>标题：' + '<span title="' + title + '">' + nameShort + '</div>');
					divStr.push('<div>'
						+ jsBizMultLan.atsManager_jobInst_i18n_10
						+ scheduledTime + '</div>');
					divStr.push('<div>'
						+ jsBizMultLan.atsManager_jobInst_i18n_15
						+ startedTime + '</div>');
					divStr.push('<div>'
						+ jsBizMultLan.atsManager_jobInst_i18n_14
						+ stateChangedTime + '</div>');
					divStr.push('<div>'
						+ jsBizMultLan.atsManager_jobInst_i18n_2
						+ createdTime + '</div>');
					divStr.push('<div>'
						+ jsBizMultLan.atsManager_jobInst_i18n_3
						+ creator + '</div>');
					divStr.push('<div style="height:20px;"><a class="schemeCountLink" href="javascript:void(0);" jobInsId="' + jobInsId + '" title="' + state + '">' + state + '</a></div>');	
					divStr.push('</div></div>');
				}
				$("#content").html(divStr.join(""));
				$(".schemeDiv").click(function(){
					$(".schemeDiv").removeClass("selected");
					$(this).addClass("selected");
				});
				$(".schemeCountLink").click(function(){
					var jobInsId = $(this).attr("jobInsId");
					global_jobInsId = jobInsId;
					that.viewException(jobInsId);
					
//					that.refresh_();
					
				});
				
		$("#nextPage").die().live('click',function(){
			$('#photoCtrl').empty();
			detailCurrentPage++;
		 		var categoryFilter = parent.window.getJobFilter();
				var exception = "";
				that.remoteCall({
						type : "post",
						method : "getException",
						async:false,
						param : {
							jobInsId:global_jobInsId,
							categoryFilter:categoryFilter,
							currentPage:detailCurrentPage,
							pageRows:detailPageRows
						},
						success : function(res){
							exception = res;
						}
				});
			  var importDiv = that.getResDiv(exception,categoryFilter);
	          $('#photoCtrl').append(importDiv);
		});
		
		$("#prePage").die().live('click',function(){
			$('#photoCtrl').empty();
			detailCurrentPage--;
		 		var categoryFilter = parent.window.getJobFilter();
				var exception = "";
				that.remoteCall({
						type : "post",
						method : "getException",
						async:false,
						param : {
							jobInsId:global_jobInsId,
							categoryFilter:categoryFilter,
							currentPage:detailCurrentPage,
							pageRows:detailPageRows
						},
						success : function(res){
							exception = res;
						}
				});
			  var importDiv = that.getResDiv(exception,categoryFilter);
	          $('#photoCtrl').append(importDiv);
					
		});
				shr.setIframeHeight();
				initPage(res, this, "gridPager1");
				that.resizeView();
			}
		})
	}
	,getSelector: function(){
		shr.ats.JobInstList.superClass.getSelector.call(this);
		var selector = "jobInstId,title,state,scheduledTime,startedTime,stateChangedTime,createdTime,creator.name,jobDefId";
		return selector;
	}
	,viewException: function(jobInsId){
	var _self = this;
	var categoryFilter = parent.window.getJobFilter();
	detailCurrentPage = 1;
	var exception = "";
	this.remoteCall({
			type : "post",
			method : "getException",
			async:false,
			param : {
				jobInsId:jobInsId,
				categoryFilter:categoryFilter,
				currentPage:detailCurrentPage,
				pageRows:detailPageRows
			},
			success : function(res){
				exception = res;
			}
	});
//	exception = _self.testException();
//	if(exception == null){
//		return;
//	}
		var importDiv;
		
		var logHeadDiv = _self.getLogHeadDiv(exception,categoryFilter);
		$('#importDiv').remove();
		
			// 未生成dialog
		var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
		var dialogWidth = window.contextLanguage === 'en_US'? 1100: 950;
		importDiv.dialog({
				modal : true,
				width : dialogWidth,
				minWidth : 950,
				height : 650,
				minHeight : 650,
				open: function(event, ui) {
				
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AttendanceLog.list', 'view', {
						serviceId : shr.getUrlParam('serviceId'),
						jobInsId:jobInsId
						});
						var content = '<iframe id="importFrame" name="importFrame" width="100%" height="100%" scrolling="no" frameborder="0"  allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
						$("#importDiv").prepend(logHeadDiv);
//						$("#summaryMsg").find("p").css("display","inline-block");
						$("#summaryMsg").find("p").css("margin-top","0");
						$("#summaryMsg").find("p").css("margin-bottom","10px");
						$('#copyMsg').zclip({        　
						    path: 'addon/attendmanage/web/resource/ZeroClipboard.swf',
						    copy: function(){ 
							    	var result = $("#msg").html();
							    	if(result){
							    		result = result.replace(/<br>/g,"\r\n");
							    	}
							        return result;  　
							    },
							    afterCopy: function(){ 
							        //alert(jsBizMultLan.atsManager_jobInst_i18n_8);
							        shr.showInfo({message: jsBizMultLan.atsManager_jobInst_i18n_8});
							    }
				  	  });
						
				},
				close: function(event, ui) {
					importDiv.empty();
					$(_self.gridId).jqGrid("reloadGrid");
				}  
			});
//		$("#photoCtrl").dialog({
//		    title: '日志',
//			width:800,
//	 		height:550,
//			modal: true,
//			resizable: true,
//			position: {
//				my: 'center',
//				at: 'top+15%',
//				of: window
//			}
//			,open: function( event, ui ) {
//				$('#copyMsg').zclip({        　
//				    path: 'addon/attendmanage/web/resource/ZeroClipboard.swf',
//				    copy: function(){ 
//				    	var result = $("#msg").html();
//				    	if(result){
//				    		result = result.replace(/<br>/g,"\r\n");
//				    	}
//				        return result;  　
//				    },
//				    afterCopy: function(){ 
//				        //alert(jsBizMultLan.atsManager_jobInst_i18n_8);
//				        shr.showInfo({message: "复制成功"});
//				    }
//			    });
//			}
//			,buttons: {
//				"关闭": function() {
//			        	$(this).dialog("close");
//	        	}
//			}
//		});
		
		
			 
	}
	
	,refresh_:function(){
	  var that = this;
	  timer = setInterval(function(){
			 	$('#photoCtrl').empty();
		 		var categoryFilter = parent.window.getJobFilter();
				var exception = "";
				that.remoteCall({
						type : "post",
						method : "getException",
						async:false,
						param : {
							jobInsId:global_jobInsId,
							categoryFilter:categoryFilter,
							currentPage:detailCurrentPage,
							pageRows:detailPageRows
						},
						success : function(res){
							exception = res;
						}
				});
			  var importDiv = that.getResDiv(exception,categoryFilter);
	          $('#photoCtrl').append(importDiv);    
	          
	          if( exception.summaryMsg.remainTime == "00:00:00" ){
			     clearInterval(timer);
			  }
			   
	    },3000);
	}
	
	,resizeView: function(){
		var maxHeight = [];
		var rowNum = 0;
		var rowNumSet = 0;
		$(".schemeDiv").each(function(index,element){
			if(index % 4 == 0){
				rowNum = index / 4;
				maxHeight[rowNum] = 0;
			}
			if($(this).height() > maxHeight[rowNum]){
				maxHeight[rowNum] = $(this).height();
			}
		})
		$(".schemeDiv").each(function(index,element){
			if(index % 4 == 0){
				rowNumSet = index / 4;
			}
			if($(this).height() < maxHeight[rowNumSet]){
				$(this).height(maxHeight[rowNumSet]);
			}
		})
	}
	,getResDiv : function (exception,categoryFilter){
		var _self = this;
		if(categoryFilter.indexOf("301!3002")!=-1){
			return _self.getSynSignLogView(exception,categoryFilter);
		}
		var resDiv = '';
		if  (exception.resFlag==0) {
			resDiv = resDiv
			+ '<div id="photoCtrl">' 
			+ 	'<p>' + exception.resMsg +'</p>'				
			+ '</div>';
		}else if (exception.resFlag>=1){
			resDiv = resDiv
			+ '<div id="photoCtrl">' 
			+ '<div id="summaryMsg">';
			if (categoryFilter.indexOf("302!3005")!=-1){
				resDiv +=	'<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_13
					+ exception.summaryMsg.sumPerson+ '</p>';
			} else {
				resDiv +=	'<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_16
					+ exception.summaryMsg.sumPerson+ '</p>';
				resDiv +=	'<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_17
					+ exception.summaryMsg.sumDays+ '</p>';
			}
			resDiv = resDiv
				+ '<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_11
				+ exception.summaryMsg.sucessPerson+ '</p>'
				+'<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_12
				+ exception.summaryMsg.failPerson+ '</p>';
			if (categoryFilter.indexOf("302!3005")==-1){
				resDiv = resDiv
					+ '<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_36
					+ exception.summaryMsg.costSumTime+ '</p>'
					+ '<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_32
					+ exception.summaryMsg.costTime+ '</p>'
					+ '<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_35
					+ exception.summaryMsg.remainTime+ '</p>';
			}
			resDiv += '</div>';
			if (exception.resFlag==2){
				var detailDiv = ''
					detailDiv+= '<div id="detailPageHead" style="padding-left:20px">';
					detailDiv+='<table id="detailPageHeadTable" style="width:600px"><tr>';
					if (exception.hasPre){
						detailDiv+='<td style="width:55px;"><button type="button" align="left" id="prePage">'
							+ jsBizMultLan.atsManager_jobInst_i18n_24
							+ '</button></td>';
					}
					if (exception.hasNext){
						detailDiv+='<td style="width:55px;"><button type="button" align="left" id="nextPage">'
							+ jsBizMultLan.atsManager_jobInst_i18n_29
							+ '</button></td>';
					}
					
					detailDiv+='<td style="font-size:10px" align="right">'+'('+ exception.beginRow+'-'+exception.endRow+')'+'/'+exception.total +'  '
						+ shr.formatMsg(jsBizMultLan.atsManager_jobInst_i18n_6,[detailCurrentPage, exception.totalPage])
						+ '</td>';
					detailDiv+='</tr></table></div>';
					detailDiv+= '<div id="errordetail" style="padding-left:20px">';
					detailDiv+= '<table id="detailtable" border="1" cellpadding="5" style="width:600px">'
					+ '<tr>'
					+ '<td align="center">'
						+ jsBizMultLan.atsManager_jobInst_i18n_31
						+ '</td>'
					+ '<td align="center">'
						+ jsBizMultLan.atsManager_jobInst_i18n_37
						+ '</td>'
					+ '<td align="center">'
						+ jsBizMultLan.atsManager_jobInst_i18n_30
						+ '</td>'
					+ '<td align="center">'
						+ jsBizMultLan.atsManager_jobInst_i18n_19
						+ '</td>';
					if (categoryFilter.indexOf("302!3005")==-1){
						detailDiv += '<td align="center">'
							+ jsBizMultLan.atsManager_jobInst_i18n_18
							+ '</td>';
					}
					detailDiv = detailDiv
					+ '<td style="width:300px" align="center">'
						+ jsBizMultLan.atsManager_jobInst_i18n_5
						+ '</td>'
					+ '</tr>';
				var detailLen = exception.detailMsg.length;
				var rowNum = exception.beginRow;
				for (var i=0;i<detailLen;i++){
					detailDiv = detailDiv
					+ '<tr>'
					+ '<td align="center">'+ (rowNum++) +'</td>'
					+ '<td>'+ exception.detailMsg[i].personNumber +'</td>'
					+ '<td>'+ exception.detailMsg[i].personName +'</td>'
					+ '<td>'+ exception.detailMsg[i].hrorgname +'</td>';
					if (categoryFilter.indexOf("302!3005")==-1){
						detailDiv += '<td>'+ exception.detailMsg[i].attendDate.substring(0,10) +'</td>';
					}
					
					detailDiv = detailDiv
					+ '<td>'+ exception.detailMsg[i].errorMsg +'</td>'
					+ '</tr>';
				}
				detailDiv = detailDiv
				+ '</table>'
				+ '</div>';
				resDiv += detailDiv;
			}

			resDiv+= '</div>';
		}
		return resDiv;
		
	}
	,getLogHeadDiv : function (exception,categoryFilter){
		var _self = this;
		if(categoryFilter.indexOf("301!3002")!=-1){
			return _self.getSynSignLogView(exception,categoryFilter);
		}
		var resDiv = '';
		if  (exception.resFlag==0) {
			resDiv = resDiv
			+ '<div id="photoCtrl">' 
			+ 	'<p>' + exception.resMsg +'</p>'				
			+ '</div>';
		}else if (exception.resFlag>=1){
			resDiv = resDiv
			+ '<div id="photoCtrl">' 
			+ '<div id="summaryMsg">';
			if (categoryFilter.indexOf("302!3005")!=-1){
				resDiv +=	'<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_13
					+ exception.summaryMsg.sumPerson+ '</p>';
			} else {
				resDiv +=	'<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_16
					+ exception.summaryMsg.sumPerson+ '</p>';
				resDiv +=	'<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_17
					+ exception.summaryMsg.sumDays+ '</p>';
			}
			resDiv = resDiv
			+ 	'<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_11
				+ exception.summaryMsg.sucessPerson+ '</p>'
			+ 	'<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_12
				+ exception.summaryMsg.failPerson+ '</p>';
			if (categoryFilter.indexOf("302!3005")==-1){
				resDiv = resDiv
	
				+ 	'<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_36
					+ exception.summaryMsg.costSumTime+ '</p>'
				+ 	'<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_32
					+ exception.summaryMsg.costTime+ '</p>'
				+ 	'<p style="font-size:10px">'
					+ jsBizMultLan.atsManager_jobInst_i18n_35
					+ exception.summaryMsg.remainTime+ '</p>';
	
			}
			resDiv += '</div>';
			resDiv+= '</div>';
		}
		return resDiv;
		
	}
	,getSynSignLogView : function (exception,categoryFilter){
		var resDiv = '';
		if  (exception.resFlag==0) {
			resDiv = resDiv
			+ '<div id="photoCtrl">' 
			+ 	'<p>' + exception.resMsg +'</p>'				
			+ '</div>';
		}else if (exception.resFlag>=1){
			resDiv = resDiv
			+ '<div id="photoCtrl">' 
			+ '<div id="summaryMsg" style="border-bottom: 1px solid #ccc;">'
			+ '<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_27
				+ exception.summaryMsg.startDate+ '</p>'
			+ '<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_26
				+ exception.summaryMsg.endDate+ '</p>'
			+ '<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_4
				+ exception.summaryMsg.sumRecords+ '</p>'
			+ '<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_25
				+ exception.summaryMsg.sucessRecords+ '</p>'
			+ '<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_36
				+ exception.summaryMsg.costSumTime+ '</p>'
			+ '<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_32
				+ exception.summaryMsg.costTime+ '</p>'
			+ '<p style="font-size:10px">'
				+ jsBizMultLan.atsManager_jobInst_i18n_35
				+ exception.summaryMsg.remainTime+ '</p>'
			+ '</div>'
			+ '<div id="errorMsg">'
			+ '<button id="copyMsg" class="copyMsg shrbtn" style="margin-top:7px; margin-left:700px; background-color:#FDFDFE;" type="button">'
				+ jsBizMultLan.atsManager_jobInst_i18n_7
				+ '</button>'
			+ '<p id = "msg" style="font-size:10px;margin-top: 7px;" >' + exception.summaryMsg.errorMsg+ '</p>'
			+ '</div>'
			+ '</div>';
		}
		return resDiv;
		

		
	}
//	,testException : function (){
//		var test={};
//		var summaryMsg={sumPerson:"100",sucessPerson:"98",failPerson:"2"};
//		
//		var detailMsg = [
//          {personNumber:"00001",personName:"沈佳宜",errorMsg:"假期额度不存在"}
//         ,{personNumber:"00002",personName:"沈二",errorMsg:"入职日志为空"}
//         ]
//         test["summaryMsg"]=summaryMsg;
//         test["detailMsg"]=detailMsg;
//         
//         return test;
//
//	}
	
});

function initPage(gridDataEntity, it, gridPagerId){
	if (!gridPagerId) {
		gridPagerId = "gridPager1";
	}	
	var page = gridDataEntity.page;
	var total = gridDataEntity.total;
	var records = gridDataEntity.records;
	var pageSize = defaultPageSize;
	var startRecords = (page - 1) * pageSize + 1;
	var endRecords = (records > page * pageSize) ? page * pageSize : records;
	var dis1 = "";
	if (page == 1) {
		dis1 = "ui-state-disabled";
	}
	var dis2 = "";
	if (page >= total) {
		dis2 = "ui-state-disabled";
	}
	var pagingInfo = jsBizMultLan.atsManager_jobInst_i18n_28;
	if (records > 0) {
		pagingInfo = "(" + startRecords + "-" + endRecords + ")/" + records + "";
	}
	var html = [];
	html.push("<div class='headImg shrPage' style='width:180px;'>");
	html.push("<span id='gripage' class='ui-paging-info' style='cursor: default;display: inline-block;font-size: 13px;padding: 2px 2px 0 0;width:110px;'>");
	html.push(pagingInfo + "</span>");
	html.push("<span id='prevId' onclick='initPrePage(" + page + "," + pageSize);
	html.push(");' style='vertical-align: text-top;cursor: pointer;width:15px;' class='ui-icon ui-icon-seek-prev " + dis1 + "'></span>");
	html.push("<span id='nextId' onclick='initNextPage(" + page + "," + pageSize);
	html.push(");' style='vertical-align: text-top;cursor: pointer;width:15px;' class='ui-icon ui-icon-seek-next " + dis2 + "'></span>");
	html.push("</div>");
	$('#'+gridPagerId).html(html.join(""));
}
function initPrePage(page, pageSize){
	if ($("#prevId").hasClass("ui-state-disabled")) {
		return;
	}
	jsBinder.getJobInstList(page - 1, pageSize);
}
function initNextPage(page, pageSize){
	if ($("#nextId").hasClass("ui-state-disabled")) {
		return;
	}
	jsBinder.getJobInstList(page + 1, pageSize);
}
function subStringAdvice(str, len, hasDot) 
{ 
    var newLength = 0; 
    var newStr = ""; 
    var chineseRegex = /[^\x00-\xff]/g; 
    var singleChar = ""; 
    var strLength = str.replace(chineseRegex,"**").length; 
    for(var i = 0;i < strLength;i++) 
    { 
        singleChar = str.charAt(i).toString(); 
        if(singleChar.match(chineseRegex) != null) 
        { 
            newLength += 2; 
        }     
        else 
        { 
            newLength++; 
        } 
        if(newLength > len) 
        { 
            break; 
        } 
        newStr += singleChar; 
    } 
     
    if(hasDot && strLength > len) 
    { 
        newStr += ".."; 
    } 
    return newStr; 
} 


