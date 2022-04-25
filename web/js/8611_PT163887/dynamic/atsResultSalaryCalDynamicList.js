shr.defineClass("shr.ats.atsResultSalaryCalDynamicList", shr.ats.atsResultBaseDynamicList, {
	pageStep: 2,
	dateSelectName: "attendancePeriod",
	initalizeDOM : function () {
		var _self = this;
		shr.ats.atsResultSalaryCalDynamicList.superClass.initalizeDOM.call(_self);
		
		//初始化页面点击事件,查看后台事物,未参与计算单据
		shr.attenceCalCommon.initClickEvent(this.dateSelectName);
		
		shr.attenceCalCommon.initBreadCrumb();
	},
	// 根据动态列表配置 取业务主键
	getBillIdFieldName: function() {
		return 'ATS_RESULT.id';
	},
	queryGrid: function() {
		var showMsg = true;
		if(this.isFirstLoad){
			showMsg = false;
		}
		this.isFirstLoad = false;
		var _self = this;
		var attencePolicyRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attencePolicy","errorMessage":jsBizMultLan.atsManager_atsResultSalaryCalDynamicList_i18n_4},showMsg);
		if(attencePolicyRequired){
			var dateRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":this.dateSelectName,"errorMessage":jsBizMultLan.atsManager_atsResultSalaryCalDynamicList_i18n_5},showMsg);
			if(!dateRequired){
				return;
			}
			
			var currentPeriodId = shr.attenceCalCommon.getFilterParamValues("attendancePeriod");
			if(_self.atsPeriodObj && currentPeriodId != _self.atsPeriodObj.id){
				_self.setAttendancePeriod(currentPeriodId);
			}
			shr.ats.atsResultBaseDynamicList.superClass.queryGrid.call(this);
		}else {
			return;
		}
	},
	onCellSelect: function (rowid, colIndex, cellcontent, e) {
		var _self = this;
		_self._initSelectedRowIdAndSelectRowData();
		// 选择的是选择框
		if (colIndex == 0) {
			var checked = $(_self.gridId).jqGrid('isChecked', rowid);
			if (!checked) {
				var index = $.inArray(rowid, _self.selectedRowId);
				_self.selectedRowId.splice(index, 1);
			}

			return;
		}
	},
	salaryBackAction: function(){
		// 1.没有选中的情况
		// 2.选中的情况
		var self = this ;
		var contentLen = $("#grid").jqGrid("getRowData").length ;
		if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_atsResultSalaryCalDynamicList_i18n_1}); return ;};
		var Exchange_json=[];
		var sid = $("#grid").jqGrid("getSelectedRows");
		var currentPeriodId = shr.attenceCalCommon.getFilterParamValues("attendancePeriod");
		for ( var i in sid)
		{
			var item = sid[i];
			var data = $("#grid").jqGrid("getRowData", item);
			var recordId=data["ATS_RESULT.id"] ;
			var personId=data["person.id"];
			var periodName=data["ATS_RESULT.salaryPeriod"];
			if(personId!=undefined && periodName!=undefined && recordId!=undefined)
			{
				Exchange_json.push({'fid':recordId,'personId':personId,'periodName':periodName,'attendPeriodId':currentPeriodId});
			}
		}
		if(Exchange_json.length>0)
		{
			 var fidJSON = $.toJSON(Exchange_json) ;
			  var mes= jsBizMultLan.atsManager_atsResultSalaryCalDynamicList_i18n_3;
				shr.showConfirm(mes,
				function(){
					self.salaryBack(fidJSON);
			});
		}else{
			
//			var attencePolicyRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attencePolicy","errorMessage":"请选择考勤制度！"});
//			if(attencePolicyRequired){
//				var dateRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":this.dateSelectName,"errorMessage":"请选择考勤周期！"});
//				if(!dateRequired){
//					return;
//				}
//			}else {
//				return;
//			}
			var mes= jsBizMultLan.atsManager_atsResultSalaryCalDynamicList_i18n_2;
				shr.showConfirm(mes,
				function(){
					self.salaryBack();
			});
		}
	},
	//撤销
	salaryBack: function(fidJSON){
		var _self = this;
		 openLoader(1);
//		 var beginDate = shr.attenceCalCommon.getFilterParamValues("attendancePeriod")["startDate"];
//		 var endDate = shr.attenceCalCommon.getFilterParamValues("attendancePeriod")["endDate"];
		 var beginDate= "";
		 var endDate= "";
		 if(_self.atsPeriodObj){
			 beginDate= _self.atsPeriodObj.startDate;
			 endDate= _self.atsPeriodObj.endDate;
		 }
		 var attendPeriodId = shr.attenceCalCommon.getFilterParamValues("attendancePeriod");
		 var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttendanceResultSalary.dynamicList"
		 shr.remoteCall({
				type:"post", 
				async:true,
				url: url,
				method:"cancelSalary",
				param : {
			 				beginDate : beginDate,
			 				endDate : endDate,
							fids : fidJSON,
							attendPeriodId: attendPeriodId
						}, 
				success:function(res){
					closeLoader();
					if (res) {
						$("#calendar_info").dialog( "close" );
						var batchTipsData = _self.batchTipsDataHandler(res);
	
						$(_self).shrMessageTips({
							isSuccess: batchTipsData.isSuccess,
							successCount: batchTipsData.successCount,
							failureCount: batchTipsData.failureCount,
							confirmCallback: function () {	
								$(_self).shrDetailTips({
									tableData: batchTipsData.tmp,
									successCount: batchTipsData.successCount,
	            					failureCount: batchTipsData.failureCount,
									colNamesData: batchTipsData.tableModel,
									isSortable : _self.batchHandlerWhetherSortable(),
									modalWidth: ''
								}).shrDetailTips("open");					
							},
	
							closeCallback: function () {
								_self.reloadGrid();
							}
						}).shrMessageTips("open");				
					} else {
						$(_self).shrMessageTips("_setDetailDisable");
					}	
			 },
				error : function() {
					closeLoader();
				},
				complete : function() {
					closeLoader();
				}
			 
			})	
 	},
 	batchTipsDataHandler: function (data, options) {
		var _self = this;
		var successCount = data.successCount; 
		var failureCount = data.failureCount;
		var isSuccess = !data.failureCount ? true : false;
		var result = data.result;
		for(var i = 0, l = result.length;i < l;i++){
			if(result[i].muitTipsState ) {
				result[i].muitTipsState  = jsBizMultLan.atsManager_atsResultSalaryCalDynamicList_i18n_0;
			}else {
				
				result[i].muitTipsState  = jsBizMultLan.atsManager_atsResultSalaryCalDynamicList_i18n_6;
			}
		}
		var batchData = {
			"successCount": successCount,
			"failureCount": failureCount,
			"isSuccess": isSuccess,
			"tmp": result,
			"tableModel":_self.getBatchTipsTableModel()
		};

		return batchData;
	}
});

