var atsCcPersonUtils = {
    /**
     * 初始化抄送人多人选框操作 视图必须配置 ccPerson 和ccPersonIds两个Field
     * @param that
     */
    initCCPersonIdsPrompt: function (that) {
        var ccPersonIdsOrigin = $('#ccPerson').attr("value");
        if (!ccPersonIdsOrigin) {
            return;
        }

        shr.remoteCall({
            type: "post",
            async: false,
            url: shr.getContextPath() + shr.dynamicURL + "?handler=com.kingdee.shr.ats.web.handler.person.AtsPersonListHandler",
            method: "getListDataByPersonIds",
            param: {personIds: ccPersonIdsOrigin},
            success: function (res) {
                var persons = JSON.parse(res.data);
                if (!persons || 0 == persons.length) {
                    return;
                }

                if (that.getOperateState() != 'VIEW') {
                    $('#ccPersonIds').shrPromptBox("setValue", persons);
                } else {
                    $('#ccPersonIds').shrFieldDisplay("destroy");
                    var personIds = persons.map(function (value) {
                        return value.id;
                    }).reduce(function (total, value) {
                        return total + "," + value;
                    });
                    var personNames = persons.map(function (value) {
                        return value.name;
                    }).reduce(function (total, value) {
                        return total + "," + value;
                    });
                    $('#ccPersonIds').shrFieldDisplay({
                        value: {id: personIds, name: personNames},
                        originalValue:  personIds
                    });
                    $('#ccPersonIds').removeClass('text-Unfilled')
                }
            }
        });
    },
    clearCCPersonIdsPrompt: function (that) {
        $('#ccPerson').attr("value","");
        if (that.getOperateState() != 'VIEW') {
            $('#ccPersonIds').shrPromptBox("setValue", []);
        } else {
            $('#ccPersonIds').shrFieldDisplay("destroy");
            $('#ccPersonIds').shrFieldDisplay({
                value: {id:"", name: ""},
                originalValue:  ""
            });
            $('#ccPersonIds').addClass('text-Unfilled')
        }
    }
};
window.atsCcPersonUtils = atsCcPersonUtils;
