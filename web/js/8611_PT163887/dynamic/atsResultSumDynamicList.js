shr.defineClass("shr.ats.atsResultSumDynamicList", shr.ats.atsResultBaseDynamicList, {
	pageStep: 1,
	dateSelectName: "attendancePeriod",
	initalizeDOM : function () {
		
		var _self = this;		
		
		shr.ats.atsResultSumDynamicList.superClass.initalizeDOM.call(_self);
		
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
		var attencePolicyRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attencePolicy","errorMessage":jsBizMultLan.atsManager_atsResultSumDynamicList_i18n_0},showMsg);
		if(attencePolicyRequired){
			var dateRequired = shr.fastFilterValidateUtil.requiredValidate(this,{"name":this.dateSelectName,"errorMessage":jsBizMultLan.atsManager_atsResultSumDynamicList_i18n_1},showMsg);
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
		if(colIndex == 0){
			var checked = $(_self.gridId).jqGrid('isChecked', rowid);
			if (!checked) {
				var index = $.inArray(rowid, _self.selectedRowId);
				_self.selectedRowId.splice(index, 1);
			}

			return;
		}
		if($('#grid').jqGrid('getGridParam','colModel')[colIndex].editable){
			var checked = $(_self.gridId).jqGrid('isChecked', rowid);
			if(checked){
				$("#grid").jqGrid('setSelection', rowid);
			}
		}
	}

});
