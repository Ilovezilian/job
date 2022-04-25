var personStr;
var attendDateStr;
var beginDateStr;
var endDateStr;
var iscal;
shr.defineClass("shr.ats.CalScheduleShiftBatchEdit", shr.ats.scheduleShiftBatchMaintainBase, {
	initalizeDOM:function(){
		shr.ats.CalScheduleShiftBatchEdit.superClass.initalizeDOM.call(this);
		var that = this;
		personStr=shr.getUrlParam("personStr");
		attendDateStr=shr.getUrlParam("attendDateStr");
		beginDateStr=shr.getUrlParam("beginDateStr");
		endDateStr=shr.getUrlParam("endDateStr");
		iscal = shr.getUrlParam("iscal");
		that.doRenderDataGrid();	
		$("#searcher").hide();
		$("#breadcrumb").hide();
		$(".view_manager_header > div >div:eq(0)").hide();
		$("#gbox_dataGrid").css("width","1020px");
		$(".ui-jqgrid-htable").css("width","1020px");
		$(".ui-state-default.ui-jqgrid-hdiv").css("width","1020px");
		$(".ui-jqgrid-bdiv").css("width","1020px");
		$("#listInfo").css("border","0");
		
	},
	saveAllAction:function(){
		var clz = this;
		var $grid = $("#dataGrid");
		var gridData= $grid.jqGrid("getRowData");
		for(var i=0;i<gridData.length;i++){

			if((gridData[i]['cardRule_id']==null || gridData[i]['cardRule_id']=='') && gridData[i]['dayType']
				==jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_5 ){
				shr.showInfo({message: jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_12});
				return false;
			}
			if((gridData[i]['defaultShift_id']==null || gridData[i]['defaultShift_id']=='') && gridData[i]['dayType']
				==jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_5){
				shr.showInfo({message: jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_2});
				return false;
			}
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CalScheduleShiftBatchEditHandler&method=batchMaintain";
		openLoader(1,jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_19);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridData)},
			success:function(res){
				closeLoader();
				if(res.flag==1){
					shr.showError({message: res.errorStr});
				}
				else{
					shr.showInfo({message: jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_3});
					$grid.jqGrid("setGridParam",{postData: {}}).trigger("reloadGrid");
				}
		    }
		});		 
	},
	//仅仅取消掉行点击数据:覆盖子类方法不做处理
	viewAction:function(){
		
	},
	addValsAction : function(){
		var pageUipk = "com.kingdee.eas.hr.ats.app.CalScheduleShiftBatchEdit";//考勤档案列表
		var _self = this;
	    _self.addValsPublicAction(pageUipk);
	},
	doRenderDataGrid : function () {
		var that = this;
		var url = "";
		var colChineseNames = null;
		var colModel = null;
		var serviceId = shr.getUrlRequestParam("serviceId");
	    url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftListHandler&method=getGridData&transverse=1"+"&serviceId="+encodeURIComponent(serviceId);
	    var colChineseNames = colChineseNames_function();
	    var colModel = colModel_function();
	       
		var options = {
				url : url,	
				postData: {
					'personIds':personStr,
					'attendDates':attendDateStr,
					'beginDate':beginDateStr,
					'endDate':endDateStr,
					'fromCalDetail':1,
					'iscal':iscal
				},
				datatype : "json",
				multiselect : false,
				rownumbers : false,
				colNames : colChineseNames,
				colModel : colModel,
				rowNum : 100,
				sortname: "",
				pager : '#gridPager1',
				height : 'auto',
				rowList : [100],
				recordpos : 'left',
				recordtext : '({0}-{1})/{2}',
				gridview : true,
				pginput : true,
				shrinkToFit :false,
				viewrecords : true,
				afterInsertRow:function(rowid,rowdata){
				},
				onSelectRow:function(rowid,status){
				},
				onCellSelect:function(rowid,iCol,cellcontent,e){	
					var _self = this ;
					if(iCol==9){
						//that.setShiftF7ToGridCell(rowid,iCol,cellcontent,e);
						//that.addValsOnCellSelectPublicAction(this,iCol,rowid);
						that.selectDayTypeAndAtsShift(rowid,iCol,cellcontent,e);
					}
					else if(iCol==10){
						that.setCardRuleF7ToGridCell(rowid,iCol,cellcontent,e);
					}
				}
		};

		options.loadComplete = function (data) { 
		      that.handleMicroToolbarInfo();
		};
				
		$("#gridPager1").hide();
		// clear table
		var table = $('#dataGrid');
		table.jqGrid(options);
		jQuery('#dataGrid').jqGrid('setFrozenColumns');
		$($("#listInfo").find(".ui-jqgrid-bdiv")[0]).css("height", "500px").css("overflow-y", "auto").css("overflow-x", "hidden");
		//$($("#listInfo").find(".ui-jqgrid-bdiv")[0]).css("overflow-x", "hidden");
	},
	handleMicroToolbarInfo : function () {
		var that = this;
		var html = "";
		html += "<div class='shrPage page-Title'>";
		html += "<span id='gripage' class='ui-paging-info' style='cursor: default;display: inline-block;font-size: 13px;padding: 2px 5px 0 0;'></span>";
		html += "<span id='prevId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-prev'></span>";
		html += "<span id='nextId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-next'></span></div>";
		html += '<span id="rowNum" style="display:none"><select id="selectRowNum" class="ui-pg-selbox" role="listbox"><option role="option" value="30">30</option>';
		html += '<option role="option" value="50" >50</option>';
		html += '<option role="option" value="100">100</option>';
		html += '<option role="option" value="200">200</option></select></span>';
		$('#microToolbar').html("");
		$('#microToolbar').append(html);
        $("#selectRowNum").val(that.rowNumPerPage);
		$("#gripage").on("click", that.selectRowNumPerPage);
		$("#prevId").on("click", that.prePage);
		$("#nextId").on("click", that.nextPage);

		//页码 (1-4)/4
		that.updatePageEnable();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
		
		$("#gridPager1").hide();
		//shr.setIframeHeight();
	},
	updatePageEnable:function () {
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		if (temp.substring(1, temp.indexOf('-')) == '1') {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}
        //上了1000的时候要把逗号替换掉，否则会出错。分页按钮置灰有问题。
		if (parseInt(temp.substring(temp.indexOf('-') + 1, temp.indexOf(')'))) >= parseInt(temp.substring(temp.indexOf('/') + 1).replace(new RegExp(",","gm"),""))) {
			$("#nextId").addClass("ui-state-disabled");
		} else {
			$("#nextId").removeClass("ui-state-disabled");
		}
	}
});


function colChineseNames_function(){
	var arr = [];
	arr.push("id");
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_18);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_17);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_16);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_9);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_8);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_6);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_13);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_1);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_0);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_10);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_11);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_4);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_14);
	arr.push(jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_15);
//	arr.push("考勤编号");
//	arr.push("考勤制度");
	return arr;
};

function colModel_function(){
	var arr = [];
	arr.push({
		name : 'id',
		label : 'ID',
		index : 'id',
		hidden : true
	});
	arr.push({
		name : 'proposer_id',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_18,
		index : 'proposer_id',
		hidden: true
	});
	arr.push({
		name : 'proposer_number',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_17,
		index : 'proposer_number',
		width : 100,
		editable : false,
		sortable:true,
		classes:'scheduleShiftColumnBg'
	});
	arr.push({
		name : 'proposer_name',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_16,
		index : 'proposer_name',
		width : 100,
		editable : false,
		sortable:true,
		classes:'scheduleShiftColumnBg'
	});
	arr.push({
		name : 'hrOrgUnit_id',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_7,
		index : 'hrOrgUnit_id',
		hidden: true
	});
	arr.push({
		name : 'hrOrgUnit_displayName',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_8,
		index : 'hrOrgUnit_displayName',
		width : 150,
		editable : false,
		sortable:true,
		classes:'scheduleShiftColumnBg'
	});
	arr.push({
		name : 'attendDate',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_6,
		index : 'attendDate',
		width : 110,
		editable : false,
		sortable:true,
		classes:'scheduleShiftColumnBg'
	});
	arr.push({
		name : 'dayType',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_13,
		index : 'dayType',
		width : 60,
		editable : false,
		sortable:true,
		classes:'scheduleShiftColumnBg'
	});
	arr.push({
		name : 'defaultShift_id',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_1,
		index : 'defaultShift_id',
		hidden: true
	});
	arr.push({
		name : 'defaultShift_name',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_0,
		index : 'defaultShift_name',
		width : 150,
		editable : false,
		sortable:true
	});
	arr.push({
		name : 'cardRule_name',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_10,
		index : 'cardRule_name',
		width : 120,
		editable : false,
		sortable:true
	});
	arr.push({
		name : 'cardRule_id',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_11,
		index : 'cardRule_id',
		hidden: true
	});
	arr.push({
		name : 'standardHour',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_4,
		index : 'standardHour',
		width : 60,
		editable : false,
		sortable:false,
		classes:'scheduleShiftColumnBg'
	});
	arr.push({
		name : 'firstPreTime',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_14,
		index : 'firstPreTime',
		width : 60,
		editable : false,
		sortable:false,
		classes:'scheduleShiftColumnBg'
	});
	arr.push({
		name : 'lastNextTime',
		label : jsBizMultLan.atsManager_calScheduleShiftBatchEdit_i18n_15,
		index : 'lastNextTime',
		width : 60,
		editable : false,
		sortable:false,
		classes:'scheduleShiftColumnBg'
	});
//	arr.push({
//		name : 'attendFile_attendanceNum',
//		label : '考勤编号',
//		index : 'attendFile_attendanceNum',
//		width : 60,
//		editable : false,
//		sortable:true
//	});
//	arr.push({
//		name : 'attendPolicy_name',
//		label : '考勤制度',
//		index : 'attendPolicy_name',
//		width : 120,
//		editable : false,
//		sortable:true
//	});
	return arr;
};
	