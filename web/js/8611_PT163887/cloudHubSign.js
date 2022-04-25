var _globalObject = null;
shr.defineClass("shr.ats.cloudHubSign", shr.framework.Edit, {
	initalizeDOM: function() {
		shr.ats.cloudHubSign.superClass.initalizeDOM.call(this);
		var _self = this;
		$('body').append(_self.getCaptionDivHtml());
		_self.initiateView();
		_self.getLastSynTime();

		$("#loadLog").attr("href", "#");
		$("#loadLog").css({
			"padding-left": "1%",
			"text-decoration": "underline",
			"color": "#808080"
		});
		$(".operation_handler").css({
			"padding-top": "11px"
		});
		$(".operation_transaction").css({
			"padding-top": "11px"
		});

		$("#loadLog").click(function() {
			window.location.href = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CloudHubSignEditHandler&method=getApplicationLog&logFile=getkdcloudpunchcard.log";
		});
	},
	initiateView: function() {
		var _self = this;
		var addWorkString = '<form action="" id="form" class="form-horizontal" novalidate="novalidate"><div style=" margin: 15px; ">' +
			'<div class="row-fluid row-block ">' +
			'<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_8
			+ '">'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_8
			+ '</div></div>' +
			'<div class="col-lg-6 field-ctrl">' +
			'<input id="hrOrgUnitCloud" name="hrOrgUnit" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title="">' +
			'</div>' +
			'</div>' +
			'<div class="row-fluid row-block ">' +
			'<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_17
			+ '">'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_17
			+ '</div></div>' +
			'<div class="col-lg-6 field-ctrl">' +
			'<input id="adminOrgUnitCloud" name="adminOrgUnit" class="block-father input-height" type="text" ctrlrole="promptBox" autocomplete="off" title="">' +
			'</div>' +
			'<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_13
			+ '">'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_13
			+ '</div></div>' +
			'<div class="col-lg-6 field-ctrl"><input id="proposerCloud" name="proposer" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title=""></div>' +
			'</div>' +
			'<div class="row-fluid row-block ">' +
			'<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_5
			+ '">'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_5
			+ '</div></div>' +
			'<div class="col-lg-6 field-ctrl">' +
			'<input id="realBeginDate" type="text" validate="{dateISO:true,required:true}" class="block-father input-height"/>' +
			'</div>' +
			'<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_4
			+ '">'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_4
			+ '</div></div>' +
			'<div class="col-lg-6 field-ctrl">' +
			'<input id="realEndDate" type="text" validate="{dateISO:true,required:true}" class="block-father input-height"/>' +
			'</div>' +
			'</div>' +
			'</div></form>';
		$("#operation_info").append(addWorkString);

		var picker_json = {
			id: "realBeginDate"
		};
		picker_json.tagClass = 'block-father input-height';
		picker_json.readonly = '';
		picker_json.yearRange = '';
		picker_json.validate = '{dateISO:true,required:true}';
		$('#realBeginDate').shrDateTimePicker($.extend(picker_json,{ctrlType: "Date",isAutoTimeZoneTrans:false}));
		atsMlUtile.setTransDateTimeValue('realBeginDate',new Date().toJSON().slice(0, 10));

		var picker_json = {
			id: "realEndDate"
		};
		picker_json.tagClass = 'block-father input-height';
		picker_json.readonly = '';
		picker_json.yearRange = '';
		picker_json.validate = '{dateISO:true,required:true}';
		$('#realEndDate').shrDateTimePicker($.extend(picker_json,{ctrlType: "Date",isAutoTimeZoneTrans:false}));
		atsMlUtile.setTransDateTimeValue('realEndDate',new Date().toJSON().slice(0, 10));
		$("#realEndDate").shrDateTimePicker({ctrlType: "Date",isAutoTimeZoneTrans:false});//@

		//组织	 
		var defaultAdminOrg = {};
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=getControlAdminOrgUnit";
		shr.ajax({
			type: "post",
			async: false,
			url: url,
			success: function(res) {
				defaultAdminOrg.id = res.id;
				defaultAdminOrg.name = res.name;
				defaultAdminOrg.longNumber = res.longNumber;
			}
		});

		var grid_f7_json = {
			id: "adminOrgUnitCloud",
			name: "adminOrgUnit"
		};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title: jsBizMultLan.atsManager_cloudHubSign_i18n_17,
			uipk: "com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",
			query: "",
			filter: "",
			domain: "",
			multiselect: false
		};
		grid_f7_json.readonly = '';
		grid_f7_json.value = {
			id: "",
			name: "",
			displayName: ""
		};
		grid_f7_json.displayFormat = '{displayName}';
		grid_f7_json.customformatter = orgSlice;
		grid_f7_json.customparam = [2];
		$('#adminOrgUnitCloud').shrPromptBox(grid_f7_json);
		//人员
		grid_f7_json = null;
		grid_f7_json = {
			id: "proposerCloud",
			name: "proposer"
		};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title: jsBizMultLan.atsManager_cloudHubSign_i18n_13,
			uipk: "com.kingdee.eas.hr.ats.app.ExistFileForAdmin.F7",
			query: "",
			filter: "",
			domain: "",
			multiselect: true
		};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.value = {
			id: "",
			name: ""
		};
		$('#proposerCloud').shrPromptBox(grid_f7_json);

		//考勤业务组织
		var grid_f7_json = {
			id: "hrOrgUnitCloud",
			name: "hrOrgUnit"
		};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title: jsBizMultLan.atsManager_cloudHubSign_i18n_8,
			uipk: "com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",
			query: "",
			filter: "",
			domain: "",
			multiselect: false
		};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.afterOnchangeClearFields = "proposerCloud";
		grid_f7_json.isHROrg = "true";
		$('#hrOrgUnitCloud').shrPromptBox(grid_f7_json);
		//要将form加上，数据校验才有用。
		$('#form').shrForm({
			id: "form"
		});

		//后台事务同步界面
        if ("en_US" == contextLanguage) {
            var docPath = "/shr/addon/attendmanage/web/resource/data_synchronization_EN.docx";
        } else {
            var docPath = "/shr/addon/attendmanage/web/resource/data_synchronization.docx";
        }
        var addWorkStringAuto = '<form action="" id="form" class="form-horizontal" novalidate="novalidate"><div style=" margin: 15px; ">' +
			'<div style="" class="row-fluid row-block ">' +
			'<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_5
			+ '">'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_18
			+ '</div></div>' +
			'<div class="col-lg-6 field-ctrl">' +
			'<input id="lastSynTime" dataType="time" formatoptions="{dateFormat:yyyy-mm-dd hh:ii}" type="text" validate="{dateISO:true,required:true}" class="block-father input-height"/>' +
			'</div>' +
			'</div>' +
			'<div style="padding-top: 20px; padding-left: 16.5%; padding-right: 24%; color: red; ">'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_10
			+ '<br/><a id="loadDoc" href="' + docPath + '">'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_0
			+ '</a></div>' +
			'</div></form>';
		$("#auto_info").append(addWorkStringAuto);
		$("#loadDoc").css({
			"text-decoration": "underline",
			"color": "red"
		});

		var picker_json = {
			id: "lastSynTime"
		};
		picker_json.tagClass = 'block-father input-height';
		picker_json.readonly = '';
		picker_json.yearRange = '';
		picker_json.validate = '{dateISO:true,required:true}';
		$('#lastSynTime').shrDateTimePicker($.extend(picker_json,{ctrlType: "TimeStamp",isAutoTimeZoneTrans:false}));

		$("#hrOrgUnitCloud").shrPromptBox("option", {
			onchange: function(e, value) {
				var info = value.current;
				$("#proposerCloud").shrPromptBox().attr("data-params", info.id);
			}
		});
		$("#adminOrgUnitCloud").shrPromptBox("option", {
			onchange: function(e, value) {
				var info = value.current;
				$("#proposerCloud").shrPromptBox("setFilter", " ( adminOrgUnit.id = '" + info.id + "' or adminOrgUnit.longNumber like '" + info.longNumber + "%' )");
			}
		});
	},
	operationSynAction: function() {
		var _self = this;
		if(_self.validate() && _self.verify()) {
			var personIds = $('#proposerCloud_el').val();
			var adminOrgLongNum = $("#adminOrgUnitCloud_el").val();
			var realBeginDate = atsMlUtile.getFieldOriginalValue("realBeginDate");
			var realEndDate = atsMlUtile.getFieldOriginalValue("realEndDate");
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.PunchCardRecordListHandler&method=getPunchCardFromCloud";
			openLoader(1, jsBizMultLan.atsManager_cloudHubSign_i18n_15);
			shr.ajax({
				type: "post",
				async: true,
				url: url,
				data: {
					personIds: personIds,
					adminOrgLongNum: adminOrgLongNum,
					realBeginDate: realBeginDate,
					realEndDate: realEndDate
				},
				success: function(res) {
					//closeLoader();
					if(res.errorString != undefined && res.errorString != "") {
						var mes = res.errorString
						shr.showInfo({
							message: mes,
							hideAfter: 50
						});
					} else {
						//parent.location.reload();						
					}
				},
				error: function() {
					closeLoader();
				},
				complete: function() {
					closeLoader();

				}
			});
		}
	},
	verify: function() {
		var realBeginDate = atsMlUtile.getFieldOriginalValue("realBeginDate");
		var realEndDate = atsMlUtile.getFieldOriginalValue("realEndDate");
		var personIds = $('#proposerCloud_el').val();
		if(new Date(realBeginDate).getTime() > new Date(realEndDate).getTime()) {//@
			shr.showWarning({
				message: jsBizMultLan.atsManager_cloudHubSign_i18n_7
			});
			return false;
		}

		var beginDate_01 = new Date(realBeginDate.replace(/-/g, "/"));
		var endDate_01 = new Date(realEndDate.replace(/-/g, "/"));
		var reBeginDate_01 = new Date(realBeginDate.replace(/-/g, "/"));
		reBeginDate_01.setMonth(reBeginDate_01.getMonth() + 1);
		var leftsecond = endDate_01.getTime() - beginDate_01.getTime();
		var rightsecond = reBeginDate_01.getTime() - beginDate_01.getTime();
		if(leftsecond > rightsecond) {
			shr.showWarning({
				message: jsBizMultLan.atsManager_cloudHubSign_i18n_6,
				hideAfter: 3
			});
			return;
		}

		if(personIds.split(',').length > 50) {
			shr.showInfo({
				message: jsBizMultLan.atsManager_cloudHubSign_i18n_12
			});
			return false;
		}

		return true;
	},
	autoSynAction: function() {
		var _self = this;
		var lastTime = atsMlUtile.getFieldOriginalValue("lastSynTime");
		if(new Date(lastTime) > new Date()) {//@
			shr.showError({
				message: jsBizMultLan.atsManager_cloudHubSign_i18n_19,
				hideAfter: 5
			});
			return;
		}
		if(!_self.verifyLastSynTime()) {
			shr.showConfirm(jsBizMultLan.atsManager_cloudHubSign_i18n_9,_self.createSynPunchcardJob);
		} else {
			_self.createSynPunchcardJob();
		}

	},
	createSynPunchcardJob:function(){
		openLoader(1, jsBizMultLan.atsManager_cloudHubSign_i18n_16);
		$.ajax({
			url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CloudHubSignEditHandler&method=autoSyn",
			dataType: 'json',
			async: true,
			data: {
				method: 'autoSyn',
				lastSynTime: atsMlUtile.getFieldOriginalValue("lastSynTime")
			},
			success: function(response) {
				if(response.resultStatus) {
					if(response.resultStatus == "running") {
						shr.showError({
							message: jsBizMultLan.atsManager_cloudHubSign_i18n_2
						})
					} else if(response.resultStatus == "none") {
						shr.showError({
							message: jsBizMultLan.atsManager_cloudHubSign_i18n_1
						})
					}
				} else {
					shr.showInfo({
						message: jsBizMultLan.atsManager_cloudHubSign_i18n_14
					});
				}
			},
			error: function() {
				closeLoader();
			},
			complete: function() {
				closeLoader();
			}
		});
	
		
	},
	showJobAction: function() {
		$.ajax({
			url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CloudHubSignEditHandler&method=detectPublish",
			dataType: 'json',
			async: false,
			success: function(response) {
				if(response.resultStatus) {
					if(response.resultStatus == "invalid") {
						shr.showError({
							message: jsBizMultLan.atsManager_cloudHubSign_i18n_3
						})
					}
				}
			}
		});
		var serviceId = shr.getUrlRequestParam("serviceId");
		var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.base.job.app.JobInst.list";
		url += '&serviceId=' + serviceId;
		$("#dialogTransaction").children("iframe").attr('src', url);
		$("#dialogTransaction").dialog({
			width: 1050,
			height: 750,
			modal: true,
			resizable: false,
			draggable: true,
			position: {
				my: 'center',
				at: 'top+15%',
				of: window
			}
		})
		$("#dialogTransaction").css({
			height: 750
		})
	},
	getLastSynTime: function() {
			$.ajax({
				url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CloudHubSignEditHandler&method=getLastTimeOfBizDataSynchAssist",
				dataType: 'json',
				type: "POST",
				beforeSend: function() {

				},
				cache: false,
				success: function(data) {
					if(data.lasttime) {
						atsMlUtile.setTransDateTimeValue('lastSynTime',data.lasttime.slice(0, 16));
					}
				}
			});
		}
		//校验最后同步时间
		,
	verifyLastSynTime: function() {
		var realEndDate = convertDateToStirng(new Date());
		var realBeginDate = realEndDate;
		if(atsMlUtile.getFieldOriginalValue("lastSynTime")) {
			var realBeginDate = atsMlUtile.getFieldOriginalValue("lastSynTime").slice(0, 10);
		}
		var beginDate_01 = new Date(realBeginDate.replace(/-/g, "/"));
		var endDate_01 = new Date(realEndDate.replace(/-/g, "/"));
		var reBeginDate_01 = new Date(realBeginDate.replace(/-/g, "/"));
		reBeginDate_01.setMonth(reBeginDate_01.getMonth() + 1);
		var leftsecond = endDate_01.getTime() - beginDate_01.getTime();
		var rightsecond = reBeginDate_01.getTime() - beginDate_01.getTime();
		if(leftsecond > rightsecond) {
			return false;
		}
		return true;
	},
	getCaptionDivHtml: function() {
		return ['<div id="caption_div" class="modal hide fade">',
			'<div class="modal-header">',
			'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
			'<h5>'
			+ jsBizMultLan.atsManager_cloudHubSign_i18n_11
			+ '</h5>',
			'</div>',
			'<div id="caption-content"  class="modal-body">',
			'</div>',
			'</div>'
		].join('');
	}

});

function getJobFilter() {
	return "jobDefCategory.longNumber = '301!3002'";
}

function convertDateToStirng(date) {
	var year = date.getFullYear();
	var month = date.getMonth();
	month = (month + 1) > 9 ? (month + 1) : ('0' + (month + 1));
	var day = date.getDate();
	day = day > 9 ? day : ('0' + day);
	return year + '-' + month + '-' + day;
}
