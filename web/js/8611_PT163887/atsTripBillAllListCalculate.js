shr.defineClass("shr.ats.AtsTripBillAllListCalculate", shr.framework.List, {
    initalizeDOM: function () {
        shr.ats.AtsTripBillAllListCalculate.superClass.initalizeDOM.call(this);
    },
    /**
     * 重算
     */
    recalculateAction: function () {
        var _self = this;
        var billIds = $("#grid").jqGrid("getSelectedRows").join(",");
        if (billIds) {
            shr.showConfirm(jsBizMultLan.atsManager_atsTripBillAllListCalculate_i18n_2, function () {
                openLoader(1, jsBizMultLan.atsManager_atsTripBillAllListCalculate_i18n_5);
                _self.remoteCall({
                    type: "post",
                    method: "recalculate",
                    param: {billIds: billIds},
                    success: function (res) {
                        closeLoader();
                        var data = res;
                        var calculateFailenum = data.calculateFailenum;
                        var calculateSuccess = data.calculateSuccess;
                        var message = jsBizMultLan.atsManager_atsTripBillAllListCalculate_i18n_8 + "<br/>";
                        if (data.calculateSuccess != 0) {
                            message += shr.formatMsg(jsBizMultLan.atsManager_atsTripBillAllListCalculate_i18n_6, [calculateSuccess]) + "<br/>";
                        }
                        if (data.calculateFailenum != 0) {
                            message += shr.formatMsg(jsBizMultLan.atsManager_atsTripBillAllListCalculate_i18n_7, [calculateFailenum])
                                + "<br/><font color='red'>" + data.errorString + "</font><br/>";
                        }

                        _self.reloadGrid();
                        shr.showInfo({message: message, hideAfter: null});

                    },
                    error: function (response) {
                        closeLoader();
                    },
                    complete: function () {
                        closeLoader();
                    }
                });
            });
        } else {
            shr.showWarning({message: jsBizMultLan.atsManager_atsTripBillAllListCalculate_i18n_4});
        }
    }
});

