shr.defineClass("shr.ats.attendancePanelWaitCalList", shr.framework.List, {
	rowNumPerPage : 15,
	reportUipk : "com.kingdee.eas.hr.ats.app.attendancePanelWaitCal.list",
	initalizeDOM:function(){
		var that = this;
		shr.ats.attendancePanelWaitCalList.superClass.initalizeDOM.call(this);
		that.renderDataGrid();
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
				"tempTableName" : shr.getUrlRequestParam("tempTableName")
			},
			success : function (reponse) {
				//self.initAdvQueryPanel();
				self.doRenderDataGrid(reponse);
			}
		});
	},
	/**
	 * 表格数据请求URL
	 */
	getGridDataRequestURL : function() {
		return this.dynamicPage_url + "?method=getGridData" + "&uipk="+ this.reportUipk;
	},

	doRenderDataGrid : function (reponse) {
		$('#datagrid').empty();
		$('#datagrid').append('<div id="gridPager1"></div> <table id="reportGridWaitCal"></table>'); 
		currentIsConfirm = isConfirm;
		var self = this;
		var table = $("#reportGridWaitCal");
		var postData = {
				'beginDate' : $('input[name=beginDate]').val(),
				'endDate' : $('input[name=endDate]').val(),
				'orgLongNum' : orgLongNum,
				'proposerName' : $("input[name=proposer]").val(),
				'attendPolicyId': attendPolicyId,
				'attendanceGroupID':attendanceGroupID,
				"hrOrgUnitId" : $("#hrOrgUnit").shrPromptBox("getValue").id,
				'page1' : 1
			};
		var url = self.getGridDataRequestURL()+'&serviceId='+ encodeURIComponent(shr.getUrlRequestParam("serviceId"));
		var colNames = reponse.colNames;
		var colModel = reponse.colModel;
		var defaultSortname = reponse.defaultSortname;
		var	options = {
			url : url ,
			datatype : "json",
			multiselect : true,
			rownumbers : false,
			colNames : colNames,
			colModel : colModel,
			rowNum : self.rowNumPerPage,
			pager : '#gridPager1',
			postData: postData ,
			height : 'auto',
			rowList : [15, 30, 45, 60],
			recordpos : 'left',
			recordtext : '({0}-{1})/{2}',
			gridview : true,
			pginput : true,
			shrinkToFit :reponse.colModel.length>10?false:true,
			viewrecords : true,
			sortname : defaultSortname,
			//caption: "Frozen Header",
			onSelectRow: function(id){
	//		   	onSelectRow : function(id){
	         //屏蔽编辑功能
			// jQuery('#reportGridWaitCal').jqGrid('editRow', id, false, function(){ });
			 
			if(sidValue.length == 0)
			{
			  sidValue.push(id); 
			  lastsel2 = id;
			 $("#reportGridWaitCal").attr("sid", sidValue.join(","));
			}else{
			     var tempId=true;
			     for(var idArr=0;idArr< sidValue.length;idArr++)
			    {
		   	  // var idArr=sidValue.split(",");
			  	 if(sidValue[idArr] == id)
				 {
				    tempId=false;
				 }
			    }
			    if(tempId){
			     sidValue.push(id); 
			     lastsel2 = id;
			     $("#reportGridWaitCal").attr("sid", sidValue.join(","));
			    }
			}
		},
		
			editurl: this.dynamicPage_url+ "?method=editRowData"+"&uipk=" + this.reportUipk
		};

		options.loadComplete = function (data) {
			self.handleMicroToolbarInfo();
			$("#sidebar").show();
			$("#sidebar").css({"width":parseFloat($("#home-wrap").css("margin-left"))+30+"px"});
			$("#sidebar").animate({"width":$("#home-wrap").css("margin-left")},500);
		};
		table.html();
		table.jqGrid(options);
		$(window).resize();
		jQuery("#reportGridWaitCal").jqGrid(options);
		jQuery("#reportGridWaitCal").jqGrid('setFrozenColumns');
	},
	handleMicroToolbarInfo : function() {
		var self = this;
		var html = "";
		// html += "<div id="gridPager1234" >";
		// html += "<div id="pg_gridPager1234" >";
		html += "<div class='shrPage page-Title' >";
		html += "<span id='gripage' class='ui-paging-info' style='cursor: default;display: inline-block;font-size: 13px;padding: 2px 5px 0 0;'></span>";
		html += "<span id='prevId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-prev'></span>";
		html += "<span id='nextId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-next'></span></div>";
		$('#microToolbar').html("");
		$('#microToolbar').append(html);

		$("#gripage").on("click", self.selectRowNumPerPage);
		$("#prevId").on("click", self.prePage);
		$("#nextId").on("click", self.nextPage);

		// 页码 (1-4)/4
		self.updatePageEnable();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
		$("#gridPager1").hide();
	    $("#reportGridWaitCal").find("tr[class='ui-widget-content jqfoot ui-row-ltr']").find('td').css("border","0px");
	    $("#reportGridWaitCal").find("tr[class='ui-widget-content jqfoot ui-row-ltr']").css("border","0px");
	     
	    shr.setIframeHeight();
	},
	updatePageEnable : function() {
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		if (temp.substring(1, temp.indexOf('-')) == '1') {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}

		if (parseInt(temp.substring(temp.indexOf('-') + 1, temp.indexOf(')'))) >= parseInt(temp.substring(temp.indexOf('/') + 1).replace(/,/g,""))) {
			$("#nextId").addClass("ui-state-disabled");
		} else {
			$("#nextId").removeClass("ui-state-disabled");
		}
	},
	getCurPage : function() {
		// (1-4)/4
		var self = this, rowNum = self.rowNumPerPage;
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		var curPageNum = (parseInt(temp.substring(1, temp.indexOf('-'))) - 1)/ rowNum + 1;
		return curPageNum;
	},

	prePage : function() {

		jQuery('#reportGridWaitCal').jqGrid("setGridParam", { postData: { refresh1: 3 } });
		$("#prev_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	},

	nextPage : function() {
		//refresh = false ;
		jQuery('#reportGridWaitCal').jqGrid("setGridParam", { postData: { refresh1: 3 } });
		$("#next_gridPager1").trigger("click");
		shr.setIframeHeight();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
	}
	
	
});
	
