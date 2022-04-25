var _globalObject;
shr.defineClass("shr.ats.AllScheduleShiftList", shr.framework.List, {
    initalizeDOM: function () {
        var that = this;
        shr.ats.AllScheduleShiftList.superClass.initalizeDOM.call(this);
        _globalObject = this;
        that.stopJumpViewPage();
    },
    stopJumpViewPage: function () {
        this.editViewDisable = true;
    },
    setRowColor: function (rowsId, shiftTypeName, dayType) {
        var $jqGrid = $("#grid").jqGrid("getCellObject", rowsId, shiftTypeName);
        $jqGrid.removeClass('gray-color').removeClass('litterGreen-color').removeClass('cell-select-color');

        if (1 == dayType) {
            $jqGrid.addClass("gray-color")
        } else if (2 == dayType) {
            $jqGrid.addClass("litterGreen-color")
        }
        return $jqGrid;
    },
    /**
     * 表格加载完成
     */
    gridLoadComplete: function (ret) {
        var that = _globalObject;
        shr.ats.AllScheduleShiftList.superClass.gridLoadComplete.call(this, ret);
        console.log("gridLoadComplete ret", ret);
        if (!ret || !ret.rows) {
            return;
        }

        for (var rowKey in ret.rows) {
            var row = ret.rows[rowKey];
            that.setRowColor(row.id, "calculateShift", row["calculateShift.dayType"].value);
            that.setRowColor(row.id, "scheduleShift", row["scheduleShift.dayType"].value);
            that.setRowColor(row.id, "groupShift", row["groupShift.dayType"].value);
            that.setRowColor(row.id, "adminOrgUnitShift", row["adminOrgUnitShift.dayType"].value);
        }
    },
    queryGrid: function(){
        var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"attendDate","errorMessage":"请选择考勤日期范围!"});
        if(dateRequiredValidate){
            shr.ats.AllScheduleShiftList.superClass.queryGrid.call(this);
        }
    },
    getSelector: function() {
        var that = this;
        var columnModel = $(that.gridId).jqGrid("getGridParam","columnModel");
        return columnModel && columnModel.replace("calculateShift,", "").replace("scheduleShift,","").replace("groupShift,","").replace("adminOrgUnitShift,","");
    },

});
