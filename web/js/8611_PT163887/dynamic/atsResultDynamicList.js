var isBackShow=false;
shr.defineClass("shr.ats.atsResultDynamicList", shr.ats.atsResultBaseDynamicList, {
	pageStep: 0,
	dateSelectName: "dateSet.date",
	initalizeDOM : function () {
		
		var _self = this;		
		
		shr.ats.atsResultDynamicList.superClass.initalizeDOM.call(_self);
	},
	//用于导出选中，如果是未计算，没有ID，则不会导出
	getExportFieldName: function() {
		return "ATS_RESULT.id";
	},
	queryGrid: function(){
		var showMsg = true;
		if(this.isFirstLoad){
			showMsg = false;
		}
		this.isFirstLoad = false;
		var _self = this;
		var attencePolicyRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attencePolicy","errorMessage":jsBizMultLan.atsManager_atsResultDynamicList_i18n_1},showMsg);
		if(attencePolicyRequired){
			var periodRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attendancePeriod","errorMessage":jsBizMultLan.atsManager_atsResultDynamicList_i18n_2},showMsg);
			if(periodRequired){
				var dateRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":this.dateSelectName,"errorMessage":jsBizMultLan.atsManager_atsResultDynamicList_i18n_0},showMsg);
				if(dateRequired){
					var beginDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
					var endDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
					if(beginDate && endDate){
						if(_self.atsPeriodObj && _self.atsPeriodObj.id && _self.getFastFilterItems().attendancePeriod && _self.atsPeriodObj.id == _self.getFastFilterItems().attendancePeriod.values ) {
							if(_self.atsPeriodObj.startDate && _self.atsPeriodObj.endDate){
								var beginDateTime = new Date(beginDate.substring(0,10)).getTime();
								var endDateTime = new Date(endDate.substring(0,10)).getTime();
								var objBeginDateTime = new Date(_self.atsPeriodObj.startDate.substring(0,10)).getTime();
								var objEndDateTime = new Date(_self.atsPeriodObj.endDate.substring(0,10)).getTime();
								if(objBeginDateTime < objBeginDateTime || beginDateTime >objEndDateTime){
									shr.showWarning({message : jsBizMultLan.atsManager_atsResultDynamicList_i18n_4,hideAfter: 3});
								}else if(endDateTime < objBeginDateTime || endDateTime > objEndDateTime){
									shr.showWarning({message : jsBizMultLan.atsManager_atsResultDynamicList_i18n_3,hideAfter: 3});
								}else if(objBeginDateTime > endDateTime){
									shr.showWarning({message : jsBizMultLan.atsManager_atsResultDynamicList_i18n_5,hideAfter: 3});
								}else {
									shr.ats.atsResultBaseDynamicList.superClass.queryGrid.call(this);
								}
							}else {
								shr.ats.atsResultBaseDynamicList.superClass.queryGrid.call(this);
							}
						}else {
							shr.ats.atsResultBaseDynamicList.superClass.queryGrid.call(this);
						}
					}
				}
			}
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
		var data = $("#grid").jqGrid("getRowData", rowid);
		var adminOrgId =data['adminOrgUnit.id'];
		var hrOrgUnitId = data["hrOrg.id"];
		var tDay =  data['dateSet.date'];
		var personName = data['person.name'];
		var personId = data['person.id'];
		// 点击名字是弹出这个时间段人的所有考勤情况,以日历的形式展示
		if(index == 0){
			return ;
		}
		if (colIndex == '1' || colIndex =='2' || colIndex =='3') {
			$("#calendar_info").empty();
			$("#calendar_info").next().remove();
			isBackShow=false;
			shr.atsResultOneDayDetail.showBillDetailAction(personName,tDay,personId,adminOrgId,hrOrgUnitId);
		}
	}
});
