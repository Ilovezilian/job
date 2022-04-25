/*
 * 由于在第三页才出现变量的分歧，所以第一，二页的变量都抽象成属性
 * 
 */
shr.defineClass("shr.ats.turnShiftSave", shr.ats.turnInitBreadCrumb,{
	_navi:null,
	numbers : [],
	beginDate : "",
	endDate : "",
	switchType : "",
	field_list : null,
	rowNumPerPage : 50,
	noShift:null,
	initalizeDOM:function(){
		var that = this;
		$('button[class="shrbtn-primary shrbtn finished"]' ).hide();
		shr.ats.turnShiftSave.superClass.initalizeDOM.call(this);
		var noShift = shr.getUrlRequestParam("noShift");
		if("1" == noShift){//直接跳到了第四步，导航会丢失。手动加上。
		   $('<div id="currentMenu" style="float:left;padding:10px 2px 0 0px;">' +
		   		'<a href="javascript:void(0);" class="active" style="font-size:16px!important;color:#0088cc;">'
			   + jsBizMultLan.atsManager_turnShiftSave_i18n_5
			   + '</a>'+
		   		'<span style="padding:0 5px;color:#ccc">/</span></div>').insertBefore($("#currentTile"));
		   $("#currentMenu").click(function(){
		       window.history.go(-1);
		   });
		}
	},
	onNext:function(_wizard){
		if(_wizard._index==3){
			_wizard.setParm("field_list", null);
		}
	    return {status: 1};
	},
	onNaviLoad:function(_navi){
		this._navi = _navi;
		var _self = this;
		
		 //得到轮班类型
	    _self.switchType = _navi.getParm("switchType");
		_self.beginDate = _navi.getParm("beginDate");
		_self.endDate =  _navi.getParm("endDate");
		_self.field_list = _navi.getParm("field_list");
		_self.noShift = shr.getUrlRequestParam("noShift");
		_self.numbers = [];
		if("1" == _self.noShift){//未排班列表过来的
		    var personNumStr = _navi.getParm("personNumStr");
		    _self.numbers = personNumStr.split(",")
		}else{
			if((_self.field_list != undefined && this.field_list.length > 0)){
				_self.field_list.each(function(index){
					_self.numbers.push($(this).attr('id'));
				});
			}
		}
		switch(_self.switchType){
			case '2':_self.calendarShiftSaveAction();break;
			case '3':_self.listShiftSaveAction();break;
			default:break;
		}
	},
	showSavedData : function () {
		var that = this;
		$('#gridList').empty();
		var grid_list_html =  '<div id="gridPager1"></div> <table id="dataGrid" class="list_table" style="overflow-y:scroll; overflow-x:hidden;" />'
		$('#gridList').append(grid_list_html);
		var colNames = function(){
					var arr = [];
					arr.push("id");
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_12);
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_11);
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_13);
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_2);
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_8);
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_0);
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_9);
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_10);
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_1);
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_3);
					arr.push(jsBizMultLan.atsManager_turnShiftSave_i18n_6);
					return arr;
		};
		var colNamesEn = function(){
					var arr = [];
					arr.push("id");
					arr.push("personNum");
					arr.push("personName");
					arr.push("displayName");
					arr.push("attendDate");
					arr.push("dayType");
					arr.push("shiftName");
					arr.push("firstPreTime");
					arr.push("lastNextTime");
					arr.push("attendanceNum");
					arr.push("policyName");
					arr.push("cardRuleName");
					return arr;
		};
				var colModel = function(){
					var arr = [];
					arr.push({
						name : 'id',
						label : 'ID',
						index : 'id',
						hidden : true
					});
					arr.push({
						name : 'personNum',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_12,
						index : 'personNum',
						width : 70,
						editable : false
					});
					arr.push({
						name : 'personName',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_11,
						index : 'personName',
						width : 80,
						editable : false
					});
					arr.push({
						name : 'displayName',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_13,
						index : 'displayName',
						width : 120,
						editable : false
					});
					arr.push({
						name : 'attendDate',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_2,
						index : 'attendDate',
						formatter: "date",
						formatoptions: {srcformat:'Y-m-d H:i:s',newformat:'Y-m-d'},  
						width : 80,
						editable : false
					});
					arr.push({
						name : 'dayType',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_8,
						index : 'dayType',
						width : 70,
						editable : false
					});
					arr.push({
						name : 'shiftName',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_0,
						index : 'shiftName',
						width : 120,
						editable : false
					});
					arr.push({
						name : 'firstPreTime',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_9,
						index : 'firstPreTime',
						width : 60,
						editable : false,
						sortable:false
					});
					arr.push({
						name : 'lastNextTime',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_10,
						index : 'lastNextTime',
						width : 60,
						editable : false,
						sortable:false
					});
					arr.push({
						name : 'attendanceNum',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_1,
						index : 'attendanceNum',
						width : 80,
						editable : false
					});
					arr.push({
						name : 'policyName',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_3,
						index : 'policyName',
						width : 80,
						editable : false
					});
					arr.push({
						name : 'cardRuleName',
						label : jsBizMultLan.atsManager_turnShiftSave_i18n_6,
						index : 'cardRuleName',
						width : 80,
						editable : false
					});
					return arr;
				};
		   var options = {
				url : shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.SpecialShiftHandler" 
						+ "&method=getSavedDate&beginDate=" + encodeURIComponent(that.beginDate) + "&endDate=" + encodeURIComponent(that.endDate),
				mtype : "POST",
				datatype : "json",
				postData : {
			         "personNums" : that.numbers.join(',')
			    },
				multiselect : false,
				rownumbers : true,
				colNames : colNames(),
				colModel : colModel(),
				sortname: "personNum,attendDate",
				rowNum : that.rowNumPerPage,
				pager : '#gridPager1',
				height : 'auto',
				rowList : [30,50,100,200],
				recordpos : 'left',
				recordtext : '({0}-{1})/{2}',
				gridview : false,
				pginput : true,
				shrinkToFit :true,
				viewrecords : true,
				afterInsertRow:function(rowid,rowdata){
				},
				onSelectAll :function(aRowids,status){
				},
				onSelectRow :function(rowid,status){
				}
		};
		options.loadComplete = function (data) {
			that.handleMicroToolbarInfo();
		};
		
		$("#gridPager1").hide();
		// clear table
		var table = $('#dataGrid');
		table.html();
		table.jqGrid(options);
		jQuery('#dataGrid').jqGrid('setFrozenColumns');
	},
	handleMicroToolbarInfo : function () {
		var that = this;
		var html = "";
		html += "<div class='shrPage page-Title'>";
		html += "<span id='gripage' class='ui-paging-info' style='cursor: default;display: inline-block;font-size: 13px;padding: 0px 5px 0 0;'></span>";
		html += "<span id='prevId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-prev'></span>";
		html += "<span id='nextId'  style='vertical-align: text-top;cursor: pointer;' class='ui-icon ui-icon-seek-next'></span></div>";
		html += '<span id="rowNum" style="display:none"><select id="selectRowNum" class="ui-pg-selbox" role="listbox"><option role="option" value="30">30</option>>';
		html += '<option role="option" value="50" >50</option>';
		html += '<option role="option" value="100">100</option>';
		html += '<option role="option" value="200">200</option></select></span>';
		$('#microToolbar').html("");
		$('#microToolbar').append(html);
		
		$("#selectRowNum").val(that.rowNumPerPage);
		$("#gripage").click( function() {
			 that.selectRowNumPerPage();
		})
		$("#prevId").on("click", that.prePage);
		$("#nextId").on("click", that.nextPage);

		//页码 (1-4)/4
		that.updatePageEnable();
		$("#gripage").text($("#gridPager1_left >div[dir='ltr']").text());
		

		shr.setIframeHeight();
		jQuery('#gridList').css('overflow-y','hidden');
		$('.ui-jqgrid-bdiv').css('height','500px').css('width','100%').css('overflow-y','auto').css('overflow-x','hidden');
	},
	updatePageEnable:function () {
		var temp = $("#gridPager1_left >div[dir='ltr']").text();
		if (temp.substring(1, temp.indexOf('-')) == '1') {
			$("#prevId").addClass("ui-state-disabled");
		} else {
			$("#prevId").removeClass("ui-state-disabled");
		}

		if (parseInt((temp.substring(temp.indexOf('-') + 1, temp.indexOf(')'))).replace(",","")) >= parseInt((temp.substring(temp.indexOf('/') + 1).replace(",","")))) {
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
		var that = this;
		$('#gripage').hide();
		$('#rowNum').show();
		$("#selectRowNum").change(function() {
			var reRows = parseInt($("#selectRowNum option:selected").text());
			that.rowNumPerPage = reRows;
			that.showSavedData();
		});
		$(document).click(function (e) { 
			if($('#gripage').is(":visible")){
				$('#rowNum').hide();
			}
			else{
				$('#rowNum').show();
			}
		}); 
	}
	/*
	 * 日历排班保存
	 */
	,calendarShiftSaveAction:function(){
		var _self = this; 
		var calendarData  = _self._navi.getParm("events");
		var datas = [];
		for(var i =0;i<calendarData.length;i++){
			var data ={title:calendarData[i].title,start:convertDateToStirng(calendarData[i].start)};
			if(data.title && data.title != ""){
			    datas.push(data);
			}
		}
		$.ajax({
			url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.SpecialShiftHandler&method=calendarShiftSave",
			dataType:'json',
			type: "POST",
			data: {
				numbers : shr.toJSON(_self.numbers),
				data: shr.toJSON(datas),
				beginDate : _self.beginDate,
				endDate : _self.endDate
			},
			beforeSend: function(){
				openLoader(1, jsBizMultLan.atsManager_turnShiftSave_i18n_7);
			},
			cache: false,
			success: function(data) {
				_self.showSavedData();
			},
			error: function(){
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});
	},
	/*
	 * 列表排班
	 */
	listShiftSaveAction:function(){
		var _self = this; 
		var listRowDatas  = _self._navi.getParm("listRowDatas");
		$.ajax({
			url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.SpecialShiftHandler&method=listShiftSaveForBatch",
			dataType:'json',
			type: "POST",
			data: {
				data : shr.toJSON(listRowDatas),
				beginDate : _self.beginDate,
				endDate : _self.endDate
			},
			beforeSend: function(){
				openLoader(1,jsBizMultLan.atsManager_turnShiftSave_i18n_4);
			},
			cache: false,
			success: function(data) {
				_self.showSavedData();
			},
			error: function(){
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});
	}
	
});

function convertDateToStirng(date){
	var year = date.getFullYear();
	var month = date.getMonth();
	month = (month + 1) > 9 ? (month +1)  : ('0' + (month + 1));
	var day = date.getDate();
	day = day > 9 ? day : ('0' + day);
	return year  + '-' + month + '-' + day ;
}
