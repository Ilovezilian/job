var sidValue = [];
var orgLongNum = "";
var filterItems1 = "";
shr.defineClass("shr.ats.team.TeamAttendanceResultBase", shr.ats.AttendanceOrgEdit, {

	reportUipk : "com.kingdee.eas.hr.ats.app.AttenceResult.list",
	rowNumPerPage : 30, 
	gridId: '#reportGrid',
	colModelData: null,
	isFirstTimeLoad: true ,
	/**
	 * 表格数据请求URL
	 */
	getGridDataRequestURL : function () {
		return this.dynamicPage_url
		 + "?method=getGridData"
		 + "&uipk=" + this.reportUipk;
	},
	
	initalizeDOM : function () {
		// $('#searcher').parent().remove();
		// $("#microToolbar").parent().prev().remove();
        shr.ats.team.TeamAttendanceResultBase.superClass.initalizeDOM.call(this);
		var self = this;
		this.initalSearch();
		this.processF7ChangeEvent();
		self.clearAdminOrgUnitVal();
//		self.renderDataGrid();
		self.setColModelData();
		// self.initFilterDate();
		self.popAdminOrgUnit();
		
		//定时监听 adminOrg的值   用于关闭dialog
		var tValue = $('#closeDialogFlag').attr("value");
		setInterval(function(){
			 if(tValue !=$('#closeDialogFlag').attr("value")){
		         //这里写自己的业务逻辑代码
		         $("#iframe1").dialog('close');
		         //tValue = "0";
		         $('#closeDialogFlag').attr("value","0");
			 }
		},200);
		
		// 快速查询添加事件
		$('#searcher').shrSearchBar('option', {
			afterSearchClick: this.queryGridByEvent
		});
		
		//快速过滤展开
		if($(".filter-containers").is(":hidden")){
			$("#filter-slideToggle").click();
		}
  
	},
	changeAttenceOrgAction: function(){
		this.changeAttenceOrg('attendanceResult');
	},
	
	processF7ChangeEvent : function(){
		var that = this;
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   if(info!=null){
			   //if(info.longNumber !=null && info.longNumber!=''){
				   if (info.length != undefined) {
				   		orgLongNum = "";
				   		for (var index = 0; index < info.length; index++) {
				   			orgLongNum = orgLongNum + info[index].longNumber + "@" ;
				   		}
				   		if (orgLongNum.length > 0) {
				   			orgLongNum = orgLongNum.substring(0,orgLongNum.length -1);
				   		}
				   }else{
				   		if(info.longNumber !=null && info.longNumber!=''){
						   	if(info.longNumber !=null && info.longNumber!=''){ 
						   		orgLongNum = info.longNumber;
						   	}
				   		}
				   }
				//}
			}
			}
		});
	  }
	,popAdminOrgUnit : function () {
		var that = this;
		$('#adminOrgF7').bind("click", function(){
		$("#iframe1").attr("src",shr.getContextPath()+'/dynamic.do?method=initalize&checkLicense=true&uipk=shr.ats.adminOrgListForF7');
		$("#iframe1").dialog({
	 		 modal: true,
	 		 width:1020,
	 		 minWidth:850,
	 		 height:550,
	 		 minHeight:500,
	 		 title:jsBizMultLan.atsManager_attendanceResultBase_i18n_34,
	 		 open: function( event, ui ) {
	 		 },
	 		 close:function(){
	 		 }
 		});
    	$("#iframe1").attr("style","width:1020px;height:550px;");
		})
	},
	
	//设置高级查询 
	initalSearch : function(){
		$('#grid-toolbar').children().eq(1).append('<div id="searcher" class="pull-right"/>');
		var searcherFields = [];
		searcherFields[0] = {columnName:"name",label:jsBizMultLan.atsManager_attendanceResultBase_i18n_38};
		searcherFields[1] = {columnName:"number",label:jsBizMultLan.atsManager_attendanceResultBase_i18n_46};
		
		var options = {
			gridId: "grid",
			// uipk: "com.kingdee.eas.hr.ats.app.AttenceResult.list",
			// query: "" ,
			fields :searcherFields
			// propertiesUrl: shr.getContextPath()+'/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttenceResult.list&method=getProperField'
		};
	
		$("#searcher").shrSearchBar(options);
		//设置其默认的过滤方案
		// var filter = $("#searcher").shrSearchBar('option', 'filterView');
		// if ($.isEmptyObject(filter)) {
		// 	// 如果filter为空
		// 	if (!$.isEmptyObject($("#searcher").shrSearchBar('option', 'defaultViewId'))) {
		// 		// 加载默认过滤方案触发表格取数
		// 		$("#searcher").shrSearchBar('chooseDefaultView');
		// 	}
		// }	
	} ,
	
	/**
	 * 选择导航节点
	 */
	queryGridByEvent: function(e) {				
		var viewPage;
		var self=this;
		if (e.target) {
			viewPage = shr.getCurrentViewPage(e.target);
		} else {
			viewPage = shr.getCurrentViewPage(e);
		}
		// 将页码恢复为第1页
		$(viewPage.gridId).jqGrid('option', 'page', 1);
		viewPage.queryAction();
	}
	// ,initFilterDate : function () {
	// 	var curDate = new Date();
	// 	var curDateY = curDate.getFullYear();
	// 	var curDateM = curDate.getMonth()+1;
	// 	curDateM = curDateM<10?"0"+curDateM:curDateM;
	// 	var curDateD = curDate.getDate();
	// 	curDateD = curDateD<10?"0"+curDateD:curDateD;
	// 	var curDateStr = curDateY+"-"+curDateM+"-"+curDateD;
		
	// 	var curDate = new Date();
	// 	var curDateY = curDate.getFullYear();
	// 	var curDateM = curDate.getMonth()+1;
	// 	curDateM = curDateM<10?"0"+curDateM:curDateM;
	// 	var curDateD = curDate.getDate();
	// 	curDateD = curDateD<10?"0"+curDateD:curDateD;
	// 	var curDateStr = curDateY+"-"+curDateM+"-"+curDateD;
	// 	var curDateStrpre = curDateY+"-"+curDateM+"-"+"01";

	// 	$("#beginDate").val(curDateStrpre);
	// 	$("#endDate").val(curDateStr);
	// 	//设置默认的查询组织 这边必须的用同步的请求，不然无法过滤。
	// 	var serviceId = shr.getUrlRequestParam("serviceId");
	// 	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=getDefaultOrg";
	// 	url += '&serviceId='+encodeURIComponent(serviceId);
	// 	shr.ajax({
	// 		type:"post",
	// 		async:false,
	// 		url:url,
	// 		success:function(res){
	// 			var info = res;
	// 			if(info!=null){
	// 				var dataValue = {
	// 					id : info.orgID,
	// 					name : info.orgName,
	// 					longNumber:info.longNumber
	// 				};
	// 				$('#adminOrgUnit').shrPromptBox("setValue", dataValue);

	// 			}
	// 		}
	// 	});
	// }


	//++++++++++++++++++++++++++++++++++++++++++


	/**
	 * 获得search查询条件
	 */
	,getSearchFilterItems: function() {
		var filter = $('#searcher').shrSearchBar('option', 'filterView');
		if (filter && filter.filterItems) {
			return filter.filterItems;
		}
	},

	queryAction : function () {
		var self = this;
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attenceDate","errorMessage":jsBizMultLan.atsManager_attendanceResultBase_i18n_28});
		if(!dateRequiredValidate)
			return;
		//快速过滤，过滤字段（精确）：内部管理员工、考勤业务组织、行政组织、时间范围
		var fastFilterItems = self.getFastFilterItems();
		//search搜索框过滤，过滤字段（模糊）：员工编码、员工姓名
		var searchFilterItems = self.getSearchFilterItems();
		if( fastFilterItems == undefined)
			fastFilterItems = "";
		if( searchFilterItems == undefined)
			searchFilterItems = "";
		if(fastFilterItems["add"] == "")
			fastFilterItems["add"] = null;
			
		//需把视图的filterItem其他条件name="add"改成name="advancedFilter" 
		var advancedFilterItems = self.getAdvancedFilterItems();
		if(advancedFilterItems != undefined){
			fastFilterItems["add"] = advancedFilterItems;
		}

		$("#reportGrid").jqGrid('setGridParam', {
			datatype : 'json',
			postData : {
				'fastFilterItems' : encodeURIComponent($.toJSON(fastFilterItems)),
				'searchFilterItems' :encodeURIComponent(searchFilterItems),	
				'page1' : 1 //??
			},
			page : 0
		});
//		$("#reportGrid").trigger("reloadGrid");
		self.renderDataGrid();
	},
	
	renderDataGrid : function () {
		var self = this,
		schemaId = shr.getUrlRequestParam("schemaId"),
		periodId = shr.getUrlRequestParam("periodId");
		self.remoteCall({
			method : "getGridColModel",
			param : {
				"schemaId" : schemaId,
				"periodId" : periodId,
				"tempTableName" : shr.getUrlRequestParam("tempTableName"),
				"serviceId" : shr.getUrlRequestParam("serviceId"),
				"hrOrgUnitId":$.shrFastFilter.getFastFilterItems().hrOrgUnit.values
			},
			success : function (reponse) {
				self.colModelData = reponse;
				self.doRenderDataGrid(reponse);
			}
		});
	},
	
	setColModelData: function () {
		var self = this,
		schemaId = shr.getUrlRequestParam("schemaId"),
		periodId = shr.getUrlRequestParam("periodId");
		self.remoteCall({
			method : "getGridColModel",
			async: false,
			param : {
				"schemaId" : schemaId,
				"periodId" : periodId,
				"tempTableName" : shr.getUrlRequestParam("tempTableName")
			},
			success : function (reponse) {
				self.colModelData = reponse;
			}
		});
	},
	doRenderDataGrid : function () {
		var self = this;
		var reponse = self.colModelData;
		$("#gbox_reportGrid").remove();//强制清除grid容器的html,这个标签在渲染表格后由jqgrid创建的表格最外层标签
		$("#reportGrid").remove();
		$("#gridPager1").remove();
		$("#adv-div-container").after('<div id="gridPager1"></div><table id="reportGrid"></table>');
		table = $("#reportGrid");
		//快速过滤，过滤字段（精确）：内部管理员工、考勤业务组织、行政组织、时间范围
		var fastFilterItems = self.getFastFilterItems();
		//search搜索框过滤，过滤字段（模糊）：员工编码、员工姓名
		var searchFilterItems = self.getSearchFilterItems();
		if( fastFilterItems == undefined)
			fastFilterItems = "";
		if( searchFilterItems == undefined)
			searchFilterItems = "";
		if(fastFilterItems["add"] == "")
			fastFilterItems["add"] = null;
			
		//需把视图的filterItem其他条件name="add"改成name="advancedFilter" 
		var advancedFilterItems = self.getAdvancedFilterItems();
		if(advancedFilterItems != undefined){
			fastFilterItems["add"] = advancedFilterItems;
		}
			
		var postData = {
				'fastFilterItems' : encodeURIComponent($.toJSON(fastFilterItems)),
				'searchFilterItems' :encodeURIComponent(searchFilterItems),	
				'page1' : 1
			};
		var url = self.getGridDataRequestURL();
		var colNames = reponse.colNames;
		var colModel = reponse.colModel;
		var defaultSortname = reponse.defaultSortname,
		options = {
			url : url ,
			datatype : "json",
			mtype: "POST",
			multiselect : true,
			rownumbers : false,
			colNames : colNames,
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			// pager : '#gridPager1',
			postData: postData ,
//			height : 'auto',
			height : '500px' ,
			rowList : [30,45,60],
			recordpos : 'left',
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			shrinkToFit :reponse.colModel.length>10?false:true,
			viewrecords : true,
			sortname : defaultSortname,
			//caption: "Frozen Header",
			customPager : '#gridPager1',  
			pagerpos:"center",
			pginputpos:"right",
			pginput:true, 
			synchTotal:"true",
			onSelectRow: function(id){
		//		   	onSelectRow : function(id){
				//屏蔽编辑功能
				// jQuery('#reportGrid').jqGrid('editRow', id, false, function(){ });
				
				if(sidValue.length == 0)
				{
				sidValue.push(id); 
				lastsel2 = id;
				$("#reportGrid").attr("sid", sidValue.join(","));
				}else{
					var tempId=true;
					for(var idArr=0;idArr< sidValue.length;idArr++) {
					// var idArr=sidValue.split(",");
						if(sidValue[idArr] == id) {
							tempId=false;
						}
					}
					if(tempId){
						sidValue.push(id); 
						lastsel2 = id;
						$("#reportGrid").attr("sid", sidValue.join(","));
					}
				}
			},		
			editurl: this.dynamicPage_url+ "?method=editRowData"+"&uipk=" + this.reportUipk
		};
		options.loadComplete = function (data) {
			if($("#gridPager1").html() == "" && "true" == "true"){
				$("#reportGrid").setCustomPager("#gridPager1");
			}
			
			shr.setIframeHeight();
			
			$('#gridPager1_left').click(function(){
				$('.ui-pg-selbox').show();
				$('.ui-pg-selbox').css({"left":"-40px"})
				$(this).children('.ui-paging-info').hide();
			});
			$("#microToolbar").parent().hide()
			//$("#gridPager1").parent().css({"position":"relative"}) 
			$("#gbox_reportGrid").css("margin-top","40px"); 
			$("#gridPager1").addClass("shrPage").css({
				"position":"absolute",
				"top":"35px",
				"right":"0px",
				"background":"#FFF"
			})
			// self.handleMicroToolbarInfo();
			filterItems1  = "" ;
			//jQuery('#reportGrid').jqGrid('setFrozenColumns'); 
		};
		// clear table
		table.html();
		table.jqGrid(options).jqGrid("reloadGrid");
		if(self.isFirstTimeLoad){
			jQuery('#reportGrid').jqGrid('setFrozenColumns');//只有第一次才设置冻结列
		}
		self.isFirstTimeLoad = false;

		
	},

	// 添加表格分页信息
	handleMicroToolbarInfo : function () {

		var self = this;
		var html = "";
		//html += "<div id="gridPager1234"  >";
		//html += "<div id="pg_gridPager1234" >";
		html += "<div class='shrPage page-Title' >";
		html += "<span id='gripage' class='ui-paging-info' style='cursor: default;display: inline-block;font-size: 13px;padding: 2px 5px 0 0;'></span>";
		html += "<span id='prevId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-prev'></span>";
		html += "<span id='nextId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-next'></span></div>";
		//html += "</div>";
		//html += "</div>";
		
		$('#microToolbar').html("");
		$('#microToolbar').append(html);

		$("#gripage").on("click", self.selectRowNumPerPage);
		$("#prevId").on("click", self.prePage);
		$("#nextId").on("click", self.nextPage);

		//页码 (1-4)/4
		self.updatePageEnable();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
		$("#gridPager1").hide();

		shr.setIframeHeight();
		$("#reportGrid_frozen").parent().height('483px');
	},

	updatePageEnable:function () {
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		if (temp.substring(1, temp.indexOf('-')) == '1') {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}

		if (parseInt(temp.substring(temp.indexOf('-') + 1, temp.indexOf(')')).replace(/,/g,"")) >= parseInt(temp.substring(temp.indexOf('/') + 1).replace(/,/g,""))) {
			$("#nextId").addClass("ui-state-disabled");
		} else {
			$("#nextId").removeClass("ui-state-disabled");
		}
	},

	getCurPage:function(){
		//(1-4)/4
		var self = this,
		rowNum = self.rowNumPerPage;
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		var curPageNum = (parseInt(temp.substring(1, temp.indexOf('-')))-1)/rowNum+1;
		return curPageNum;
	},

	prePage : function () {
		//this.verifyStartTime();
		$("#prev_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	},

	nextPage : function () {
		$("#next_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	},
	
	selectRowNumPerPage:function(){
		
	},
	exportToExcelAction : function () {
		openLoader
  		var _self = this ;
  		var url = _self.exportCommonParam();
  		var fastFilterItems = _self.getFastFilterItems();
		if( fastFilterItems == undefined)
			fastFilterItems = "" ;
		if(fastFilterItems["add"] == ""){
			fastFilterItems["add"] = null;
		}
				
  		 var serviceId = shr.getUrlRequestParam("serviceId");
  		url += '&serviceId='+encodeURIComponent(serviceId);
		//document.location.href = url;
		openLoader(1,jsBizMultLan.atsManager_attendanceResultBase_i18n_47); 
		  shr.ajax({ 
			type:"post", 
			url:url, 
			data: _self.assemExportData(),
			success:function(res){ 
				closeLoader();    
				//document.location.href = url;
				shr.redirect(res.url,"");
		    }, 
		    error : function(res){
		    	shr.showError({message: jsBizMultLan.atsManager_attendanceResultBase_i18n_17});
		    	closeLoader(); 
		    } 
		});
	},
		assemExportData:function(exportData){
		var _self = this ;
		var fastFilterItems = _self.getFastFilterItems();
		var advancedFilterItems = _self.getAdvancedFilterItems();
		if( fastFilterItems == undefined)
			fastFilterItems = "" ;
		if(fastFilterItems["add"] == ""){
			fastFilterItems["add"] = null;
		}
		if(advancedFilterItems != undefined){
			fastFilterItems["add"] = advancedFilterItems;
		}
		var filterItems = _self.getSearchFilterItems();
		if( filterItems == undefined)
			filterItems = "" ;
		var postData = {
						fastFilterItems : encodeURIComponent($.toJSON(fastFilterItems)),
						searchFilterItems: encodeURIComponent(filterItems)
						};
		
		exportData && (postData = $.extend(postData, exportData));
		return postData;
	},
	exportCommonParam : function(){
		var self = this;
		var url = shr.getContextPath() + shr.dynamicURL + "?method=exportToExcel";
		var uipk = "com.kingdee.eas.hr.ats.app.AttenceResult.list";
		var filterItems = self.getQuickFilterItems();
		var sorder =   $('#reportGrid').jqGrid('getGridParam', 'sortorder') || "";
		var sordName = $('#reportGrid').jqGrid('getGridParam', 'sortname') || "";

		//标题
		   url += "&title="+jsBizMultLan.atsManager_attendanceResultBase_i18n_23;
		   url = url + '&uipk=' + uipk + "&sidx=" + sordName+"&page=0" + "&sord=" + sorder + "&transverse=1";
		//如果存在高级搜索的条件，则拼上条件。
//		if(filterItems){
//			url += "&searchFilterItems=" + encodeURIComponent(filterItems);
//		}
		return url;
	},
	exportCurrentAction : function(){
		var Exchange_json=[];
		var _self = this;
		var exportData = {
			exportSelect:"yes",
			serviceId:shr.getUrlRequestParam("serviceId")
		};
		var personIds = _self.getSelectedFields('FID');
		if(personIds.length > 0){
			exportData.personId = personIds.join(',');
		}else{
			shr.showWarning({
				message: jsBizMultLan.atsManager_attendanceResultBase_i18n_27
			});
			return false;
		} 
		
		openLoader(1,jsBizMultLan.atsManager_attendanceResultBase_i18n_47); 
		  	shr.ajax({ 
				type:"post",  
				url:_self.exportCommonParam(), 
				data:  _self.assemExportData(exportData),
				success:function(res){ 
					closeLoader();    
					shr.redirect(res.url,"");
			    }, 
			    error : function(res){
			    	shr.showError({message: jsBizMultLan.atsManager_attendanceResultBase_i18n_17});
			    	closeLoader(); 
			    } 
		});
	},


	//导入考勤结果导入
	importAttendanceResultAction : function () {
		$con = $("#container1");
		var _self = this;
		var importTripBill = ''
			 + '<div id="photoCtrl">'
			 + '<p>'
			+ jsBizMultLan.atsManager_attendanceResultBase_i18n_21
			+ '</p>'
			 + '<div class="photoState">'
			+ jsBizMultLan.atsManager_attendanceResultBase_i18n_12
			+ '</div>'
			 + '<div class="photoState">'
			+ jsBizMultLan.atsManager_attendanceResultBase_i18n_13
			+ '</div>'
			 + '<div class="photoState">'
			+ jsBizMultLan.atsManager_attendanceResultBase_i18n_14
			+ '</div>'
			 + '<p>'
			+ jsBizMultLan.atsManager_attendanceResultBase_i18n_30
			+ '</p>'
			 + '<div class="photoCtrlBox">'
			 + '<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked></div>'
			 + '<div class="photoCtrlUpload"><span>'
			+ jsBizMultLan.atsManager_attendanceResultBase_i18n_45
			+ '</span><span>'
			+ jsBizMultLan.atsManager_attendanceResultBase_i18n_29
			+ '</span></div>'
			 + '<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			 + '<div style="clear: both;"></div>'
			 + '</div>'
			 + '<div class="photoCtrlBox"><div id="exportBox"><div class="photoCtrlRadio"><input type="radio" name="inAndout" id="exportRadio"></div><span>'
			+ jsBizMultLan.atsManager_attendanceResultBase_i18n_44
			+ '</span><span>'
			+ jsBizMultLan.atsManager_attendanceResultBase_i18n_22
			+ ' </span></div>  <div style="clear: both;"></div></div>'
			 + '</div>';
		
		//$(document.body).append(importTripBill);
		$con.append(importTripBill);
		$('#importRadio, #exportRadio').shrRadio();
		//$('#isContainsSub').shrCheckbox();
		// 初始化上传按钮
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceResultDetailHandler&method=importAttendanceResult";
			url += "&" + getJSessionCookie();
		var handleFlag = false;
		$("#file_upload").fileupload({
        	pasteZone: null,
            url : shr.getContextPath()+ "/attachmentUpload.do?method=uploadAttachment",
            formData : {boID: self.options.formId, onlyone:self.options.onlyone, field: self.options.field, description: self.options.name,uipk:uipk,permItemId: shr.getCurrentPagePermItemId()},
            dataType : "json",
            iframe: self.iframe,
            start : function(e){
                var attachListId = '#'+self.options.id+'_attachList';
                $( attachListId ).append("<p class = 'attachment-loading'>'"+$.shrI18n.widget.shrAttachment.tips.fileUploading+"' <span class = 'progress'></span></p>");
                $( attachListId + ".progress" ).html( "10%" );
            },

            add : function ( e,data ){
            	//多行表中只能有一个表格的状态是编辑或者新增
            	var len = $('.shr-multiRow .view_form').length;
            	var ind = 0;
            	for(var i = 0; i < len; i++){
            		var tem = $('.shr-multiRow .view_form')[i];
            		var id = tem.getAttribute("id");
            		if(id){
            			var operate = shr.getCurrentViewPage(id).operateState;
            			if("ADDNEW" == operate || "EDIT" == operate){
                            ind = ind + 1;
            			}
            		}
            	}
            	if(ind > 1){
            		shr.showError({ message: $.shrI18n.widget.shrAttachment.tips.saveOtherMultiRow });
            		return;
            	}
            	
                var uploadErrors = [],errorMsg;
                var acceptFileTypes = self.analysisFileType(self.options.fileType);
                var excludeFileTypes = self.analysisFileType(self.options.excludeFileType);
                // data.originalFiles file的全部数据
                var fileType = data.files[0]['name'];
                if(fileType && ((self.options.fileType && !acceptFileTypes.test(fileType)) || (self.options.excludeFileType && excludeFileTypes.test(fileType))) ){
                    if (self.options.fileType) {
                        errorMsg = $.shrI18n.widget.shrAttachment.tips.requireRightFile + self.options.fileType;
                    } else {
                        errorMsg = $.shrI18n.widget.shrAttachment.tips.forbiddenFile + fileType;
                    }
                    shr.showError({ message: errorMsg });
                    return;
                }
                if( data.originalFiles.length && !data.files[0]['size'] && data.files[0]['size'] == 0 ){
                    shr.showError({ message: $.shrI18n.widget.shrAttachment.tips.fileForbiddenBlank });
                }else if( data.originalFiles.length && data.files[0]['size'] && data.files[0]['size'] > self.options.maxSize*1024*1024 ){
                    shr.showError({ message: $.shrI18n.widget.shrAttachment.tips.fileSizeRequire+ self.options.maxSize +"M"+$.shrI18n.widget.shrAttachment.tips.file });
                }
                else{
                    data.submit();
                }
            },
            
            progressall : function( e,data ){
                var progress = parseInt( data.loaded / data.total * 100 ,10 );
                var attachListId = '#'+self.options.id+'_attachList';
                $( attachListId + " .progress" ).html( progress+"%" );
            },
           
            done : function( e,data ){
            	var attachListId = '#'+self.options.id+'_attachList';
        		$( attachListId + " .attachment-loading" ).remove();
            	var result = data.result;
            	if("success" == result.result){
            		var response = result.data;
            		if(response == null){
            			shr.showError({ message:  $.shrI18n.widget.shrAttachment.tips.uploadFailure });
            			return;
            		}
            		var filename = response.filename;
            		var attachment = {
          				id: response.id, 
          				name: filename.substring(0,filename.lastIndexOf(".")),
          				simpleName: (new RegExp(/[^\.]+$/)).exec(filename),
          				uploader: response.uploader,
          				uploadDateTime: response.uploadDateTime,
          				remark: response.remark
      				}
                    var itemHtml = self._generateAttachItems(attachment, true);
                    //获取当前的iframe，上传成功后动态增加iframe高度
                    var currentIframe = self.getCurrentIframe();
                    var currentIframeHeight = $(currentIframe).height();
                    $(currentIframe).height(currentIframeHeight + 30);
            		if(self.options.onlyone == true || self.options.onlyone == "true"){
            			$(attachListId).html(itemHtml);
            		}else{
            			$(attachListId).append(itemHtml);
            		}
            		
            		$('[id="' + self.idPrefix + attachment.id + '_attach_delete"]').off('click').on('click', function(){
						var that = this;
						shr.showConfirm($.shrI18n.widget.shrAttachment.tips.confirmDelete, function(){
							if(self.data.readonly) return;
							var formId = self.options.formId;
							$.ajax({
								url: shr.getContextPath()+ "/attachmentUpload.do?method=deleteAttachment",
								data: {attachId: attachment.id, boID: formId},
								success: function(msg){
									$(that).parent('.attachItems').slideUp(function(){
										$(that).parent('.attachItems').remove();
										$(self.data.attachListId).trigger(self.data.eventName);
										shr.setIframeHeight();
										if (typeof (self.options.deleteSuccessCallback) == "function") {
											self.options.deleteSuccessCallback.call(this,self);
										}
									});
										
								}
							});
						})
					});
            		$(attachListId).trigger(self.data.eventName);
            		if (typeof (self.options.uploadSuccessCallback) == "function") {
            			self.options.uploadSuccessCallback.call(this,self);
            		}
            		
            		self._bindRemarkClick();
            	}else{
            		shr.showError({ message: result.summary });
            	}
            },
        });

		var confirmButtonName = jsBizMultLan.atsManager_attendanceResultBase_i18n_32;
		var closeButtonName = jsBizMultLan.atsManager_attendanceResultBase_i18n_31;
		$('#photoCtrl').dialog({
			title : jsBizMultLan.atsManager_attendanceResultBase_i18n_19,
			width : 600,
			height : 450,
			modal : true,
			resizable : false,
			position : {
				my : 'center',
				at : 'top+20%',
				of : window
			},
			buttons : {
				confirmButtonName : function () {
					/*
					if ($('#importRadio').shrRadio('isSelected')) {
						shr.showError({
							message : "未选择导入的文件！"
						});
					} else if ($('#exportRadio').shrRadio('isSelected')) {
						_self.exportAttendanceDetailTemplateAction();
					}
					*/
					if ($('#exportRadio').shrRadio('isSelected')) {
						_self.exportAttendanceDetailTemplateAction();
					}
					else if(!handleFlag){
						shr.showError({
							message : jsBizMultLan.atsManager_attendanceResultBase_i18n_35
						});
					}
				},
				closeButtonName : function () {
					$(this).dialog("close");
					$('#photoCtrl').remove();
				}
			}
		});
	},

	//导出模板
	exportAttendanceDetailTemplateAction : function () {
		var self = this,
		$grid = $('#reportGrid'),
		postData = $grid.jqGrid("getGridParam", "postData"),
		url = shr.getContextPath() + shr.dynamicURL + "?method=exportAttendanceDetailTemplate";
		//标题
		url += "&title="
			+ jsBizMultLan.atsManager_attendanceResultBase_i18n_20;
		// set PostData
		$grid._pingPostData(postData);

		var param = postData;
		if (param.queryMode) {
			delete param.queryMode
		}
		if (!param.uipk) {
			param.uipk = self.reportUipk;
		}

		param.downSum = $('#downSum').attr('checked') == "checked" ? 1 : 0;

		param.isAll = true;
		url += "&" + $.param(param);

		url += "&queryMode=";

		var colModel = $grid.jqGrid("getGridParam", "colModel");
		for (var i = 0; i < colModel.length; i++) {
			var optionColumn = colModel[i];
			var hidden = optionColumn.hidden,
			label = optionColumn.label || optionColumn.name,
			index = optionColumn.index,
			dataColumnType = optionColumn.dataColumnType;
			if (index != null && index != "") {
				url += index + "," + hidden + "," + label + "," + dataColumnType + ";";
			}
		}

		document.location.href = url;
	},

	editDataAction: function(){
		$("#saveData").show();
		$("#editData").hide();
	},
	
	updateAction: function(){
	//	$("#saveData").hide();
	//	$("#editData").show();
		jQuery("#reportGrid").jqGrid('saveRow',"EWUjDk5tSDGfJ8/b4ctm8fiu0UA=");
		
	},
	
	destroyAction : function () {
		var self = this,
		tempTableName = shr.getUrlRequestParam("tempTableName");
		self.remoteCall({
			param : {
				"tempTableName" : tempTableName
			},
			method : 'destroy',
			async : false,
			error : function () {
				return true;
			}
		});

	}
	,calAttendanceAction :function() {
		var that = this;
		var url = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttenceResultCal.form";
		var attendResultCalDialog = $("#operationDialog");
		attendResultCalDialog.children("iframe").attr('src',url);
		attendResultCalDialog.dialog({
	 		autoOpen: true,
			title: jsBizMultLan.atsManager_attendanceResultBase_i18n_24,
			width:850,
	 		 //minWidth:950,
	 		 height:400,
	 		 //minHeight:270,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+50%',
				of: window
			}
		});
	}
	,saveDataAction : function(action){	    
	  
		if ((!$("#reportGrid") || !$("#reportGrid").attr("sid")) && !action) {
			shr.showWarning({
				message : jsBizMultLan.atsManager_attendanceResultBase_i18n_25
			});
			return;
		}
		//var inputs = $("#reportGrid input[type='text'].editable");
		
		/*for ( var i = 0; i < inputs.length; i++) {
			var item = inputs[i];
			if ($(item).attr("dataType") == 0) {
				if (!/^-?[0-9]+\.?[0-9]{0,20}$/.test($(item).val())) {
					shr.showWarning({
						message : "该项目为数值类型，请输入数值，不能为空且长度不能超过20"
					});
					$(item).focus();
					$(item).css({
						"border" : "solid 1px red"
					});
					return;
				}
			} else {
				if (!/^[\w|\u2E80-\u9FFF|\.|\+|\-|,]{0,80}$/.test($(item).val())) {
					shr.showWarning({
						message : "该项目为字符类型，不能输入特殊字符（-_,+-除外），且长度不能超过80字符"
					});
					$(item).focus();
					$(item).css({
						"border" : "solid 1px red"
					});
					return;
				}
				}
		} */
		/*var sid = [];
		if ($("#reportGrid").attr("sid")) {
			sid = $("#reportGrid").attr("sid").split(",");
		}*/
		var sid = [];
		    sid = $("#reportGrid").jqGrid("getSelectedRows");
		for ( var i in sid) {
		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
			var item = sid[i];
			var data = $("#reportGrid").jqGrid("getRowData", item);
			if (data["FAttenceStatus"] == jsBizMultLan.atsManager_attendanceResultBase_i18n_41
				|| data["FAttenceStatus"] == jsBizMultLan.atsManager_attendanceResultBase_i18n_43 ) {
				shr.showWarning({
					message : data["personName"] + jsBizMultLan.atsManager_attendanceResultBase_i18n_42
				});
			continue;
			}
			jQuery('#reportGrid').jqGrid("saveRow",item);
			shr.showInfo({
				message : jsBizMultLan.atsManager_attendanceResultBase_i18n_15
			});
		}		
		if(sid.length>0){
			jQuery('#reportGrid').jqGrid("reloadGrid");
			
			$("#reportGrid").removeAttr("sid");
			sidValue=[];
		}
		if (action && $.isFunction(action)) {
			action.call(this);
		}
	}
	,calAuditAction:function(){
	        var sid = [];
			var FID="";
			var that = this;
			sid = $("#reportGrid").jqGrid("getSelectedRows");
			var actionFlag=2;
		if(sid.length>0){
		for ( var i in sid) {
		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
			var item = sid[i];
			var data = $("#reportGrid").jqGrid("getRowData", item);
			if (data["FAttenceStatus"] == jsBizMultLan.atsManager_attendanceResultBase_i18n_41
				|| data["FAttenceStatus"] == jsBizMultLan.atsManager_attendanceResultBase_i18n_43 ){
				shr.showWarning({
					message : data["personName"] + jsBizMultLan.atsManager_attendanceResultBase_i18n_41
				});
				continue;
			}
			var fid=$("#reportGrid").find('tr[id='+item+']').find('td[aria-describedby="reportGrid_FID"]').attr("title");			
			FID=FID+","+fid;
			jQuery('#reportGrid').jqGrid("saveRow",item);
		  }
		  if(FID!=""){
			  that.remoteCall({
				type:"post",
				method:"auditAttend",
				param:{FID:FID,actionFlag:actionFlag},
				success:function(res){
		 			//that.Selecttype(1);
		  	 		shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultBase_i18n_33});
		 			jQuery('#reportGrid').jqGrid("reloadGrid");
				}	
				})
		  }
		}else{
		
		    var    beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		    var    endDate = atsMlUtile.getFieldOriginalValue("endDate");
		    var    adminOrgId = $("#adminOrg_el").val();
		    var    proposerId = $("#proposer_id").val();
			var	proposerName=encodeURIComponent($("#proposer").val()),				
				FID="ALL";
			 that.remoteCall({
				type:"post",
				method:"auditAttend",
				param:{beginDate:beginDate ,endDate:endDate,adminOrgId:adminOrgId,proposerName:proposerName,actionFlag:actionFlag,FID:FID},
				success:function(res){
				  shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultBase_i18n_33});
				jQuery('#reportGrid').jqGrid("reloadGrid");
				 }   	
			}) 
		}
	    
	},
	notcalAuditAction:function(){
			
	        var sid = [];
			var FID="";
			var that = this;
			sid = $("#reportGrid").jqGrid("getSelectedRows");
			var actionFlag=1;
		if(sid.length>0){
		for ( var i in sid) {
		    //alert($grid.jqGrid("getCell", selectedIds[i], "id"));
			var item = sid[i];
			var data = $("#reportGrid").jqGrid("getRowData", item);
			if (data["FAttenceStatus"] == jsBizMultLan.atsManager_attendanceResultBase_i18n_40 || data["FAttenceStatus"] ==""){
				shr.showWarning({
					message : data["personName"] + jsBizMultLan.atsManager_attendanceResultBase_i18n_10
				});
				continue;
			}
			var fid=$("#reportGrid").find('tr[id='+item+']').find('td[aria-describedby="reportGrid_FID"]').attr("title");			
			FID=FID+","+fid;
		    // jQuery('#reportGrid').jqGrid("saveRow",item);
		  }
		  if(FID!=""){
		  that.remoteCall({
				type:"post",
				method:"notAuditAttend",
				param:{FID:FID,actionFlag:actionFlag},
				success:function(res){
   	     			//that.Selecttype(1);
			
					var flen=res.fail;
					var slen=res.success ;
					var suc=$.toJSON(slen);
					var fai=$.toJSON(flen);
					var tip="";
					if(fai.indexOf(":")!=-1){
						fai=fai.replace("{","");
						fai=fai.replace("}","");
						fai= fai.replace(/\"/g, "");
						var arrFail=fai.split(",");
						for(var i=0;i<arrFail.length;i++)
						{
							
							tip = tip +  " <font color='red'>" + arrFail[i] + "</font><br/>" ;
							
						}
					}
					if(suc.indexOf(":")!=-1){
						suc=suc.replace("{","");
						suc=suc.replace("}","");
						suc= suc.replace(/\"/g, "");
						var arrSuc=suc.split(",");
						for(var i=0;i<arrSuc.length;i++)
						{
							tip = tip +  " <font>" + arrSuc[i] + "</font><br/>" ;
						}
					}
				  	shr.showInfo({message: tip});
				 	jQuery('#reportGrid').jqGrid("reloadGrid");
				 }   	
			}) 
		  }
		}else{
				var    beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
				var    endDate = atsMlUtile.getFieldOriginalValue("endDate");
				var    adminOrgId = $("#adminOrg_el").val();
				var    proposerId = $("#proposer_id").val();
				var	proposerName=encodeURIComponent($("#proposer").val()),		
				FID="ALL";
				openLoader(1);
			 that.remoteCall({
				type:"post",
				method:"notAuditAttend",
				param:{beginDate:beginDate ,endDate:endDate,adminOrgId:adminOrgId,proposerName:proposerName,actionFlag:actionFlag,FID:FID},
				success:function(res){
				//that.Selecttype(1);
					closeLoader();
					var flen=res.fail;
					var slen=res.success ;
					var suc=$.toJSON(slen);
					var fai=$.toJSON(flen);
					var tip="";
					if(fai.indexOf(":")!=-1){
						fai=fai.replace("{","");
						fai=fai.replace("}","");
						fai= fai.replace(/\"/g, "");
						var arrFail=fai.split(",");
						for(var i=0;i<arrFail.length;i++)
						{
							
							tip = tip +  " <font color='red'>" + arrFail[i] + "</font><br/>" ;
							
						}
					}
					if(suc.indexOf(":")!=-1){
						suc=suc.replace("{","");
						suc=suc.replace("}","");
						suc= suc.replace(/\"/g, "");
						var arrSuc=suc.split(",");
						for(var i=0;i<arrSuc.length;i++)
						{
							tip = tip +  " <font>" + arrSuc[i] + "</font><br/>" ;
						}
					}
				  	shr.showInfo({message: tip});
				 	jQuery('#reportGrid').jqGrid("reloadGrid");
				 }   	
			}) 
		}
	   
	}
	/**
	 * 描述: 导入action
	 */
	// ,importAction: function() {
	// 	this.doImportData('com.kingdee.eas.hr.ats.app.AttendanceResult');
	// }

	//旧的导入方式，临时放在基类一下
	/**
	 * 描述: 导入action
	 */
	,importAction: function() {
		this.doOldImportData('com.kingdee.eas.hr.ats.app.AttendanceResult');
	}
	
	/**
	 * 导入
	 */
	,doOldImportData: function(curIOModelString, customData,classify) {
		if (typeof curIOModelString == 'undefined') {
			curIOModelString = this.getImportModel();
		}
	
		var importDiv = $('#importDiv');
		if (importDiv.length > 0) {
			importDiv.data('curIOModelString', curIOModelString);
			importDiv.data('customData', customData);
			importDiv.data('classify', classify);
			importDiv.dialog('open');
			return;
		}
		
		// 未生成dialog
		importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
		importDiv.data('curIOModelString', curIOModelString);
		importDiv.data('customData', customData);
		importDiv.data('classify', classify);
		
		var _self = this;
		if(_self.checkUpload()){
			importDiv.dialog({
				autoOpen: true,		
				width: 708,
				height: 700,
				title: jsBizMultLan.atsManager_attendanceResultBase_i18n_18,
				resizable: true,
				position: ['top','top'],
				modal: true,
				open: function(event, ui) {
					if ($.browser.msie) {
						var url = shr.assembleURL('com.kingdee.shr.io.app.ImportInfo', 'view', {
							curIOModelString: curIOModelString,
							customData: customData,
							classify:classify
						});
						var content = '<iframe id="importFrame" name="importFrame" width="700" height="600" frameborder="0" scrolling="no" allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					} else {
						importDiv.css('padding', "0 20px");
						var url = shr.assembleURL('com.kingdee.shr.io.app.ImportInfo$page', 'view');
						shr.loadHTML({
							url: url,
							success: function(response) {
								importDiv.append(response);
							}
						});
					}
				},
				close: function(event, ui) {
					importDiv.empty();
					$(_self.gridId).jqGrid("reloadGrid");
				} 
			});
		}
		
		$(".ui-dialog-titlebar-close").bind("click" , function(){
			importDiv.dialog("close");
		});		
	}
	/*
	 *检测 是否可以上传文件
	 * */
	,checkUpload :function(){
		return true;
	}
	

	,clearAdminOrgUnitVal: function(){
		 $("#adminOrgUnit").blur(function(){
		       if($("#adminOrgUnit_el").val() == null || $("#adminOrgUnit_el").val() == ""){
		           orgLongNum = "";
		       }
		 });
	},
	/**
	 * 查询表格
	 */
	queryGrid: function() {
		this.setGridTreeParam();
		this.setGridCustomParam();
		
		var $grid = $(this.gridId);
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
			$grid.jqGrid("option", "fastFilterItems", JSON.stringify(fastFilterItems));
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
		
		if(!this.isFirstTimeLoad){
			$grid.jqGrid("reloadGrid");
		}else{
			this.isFirstTimeLoad = false;
		}
	}

	
});

/**
 * 从Cookie中获取Session Id,解决上传文件302错误
 * @returns
 */
function getJSessionCookie() {
	var array = document.cookie.split(";");
	for (var i = 0; i < array.length; i++) {
		if (array[i].indexOf("JSESSIONID") >= 0) {
			return array[i].trim();
		}
	}
	return "";
}
