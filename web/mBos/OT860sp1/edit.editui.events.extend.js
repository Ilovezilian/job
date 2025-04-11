_private.otDate = ""
_private.startTime = ""
_private.endTime = ""
_private.otType = ""
_private.otTypeId = ""
_private.otReasonId = ""
_private.otCompensId = ""
_private.otCompens = ""
_private.otReason = ""
_private.otCompens = ""
_private.description = ""
_private.overTime = 0
_private.restTime = 0
_private.restTime0 = 0
_private.applyTime0 = 0
_private.selectDateChangeIndex = 0
_private.selectCountIndex = 0
_private.decimalPlaces = 2 //小数位精度

_private._ATS_OVERTIME_LEGALHOLIDAYDAY_OVERTIME_ID =
    "sRWUOt7sRpOY0TCo6NMqGY6C/nU=" //法定节假日id

_private._ATS_OVERTIMECOMPENS_OVERTIME_ID = "zkbt5bMLQ3ehUivmKbtBOqlrTmA=" //加班费id
_private._ATS_OVERTIMECOMPENS_OVERTIME_NAME = "加班费" //加班费id

_private._ATS_OVERTIMECOMPENS_DEFAULT_ID = ""
_private._ATS_OVERTIMECOMPENS_DEFAULT_NAME = ""

_private.hasOverTime = false
_private.isOTControl = false
_private.isOtrolByDateType = false
_private.otTypeList = []

_private.otTypeArry = null
_private.otCompensArry = null
_private.otReasonArry = null

_private.billNumber = "" //打回修改不重新读编码规则
_private.billPersonId = ""

_private.appid = ""
_private.eid = ""
_private.path = ""
_private.personName = ""
_private.hostname = ""
_private.billState = 0 //1、未审批 2、审批中 3、审批通过 4、审批不通过
_private.initializeData = function () {
    _private.appid = mbos.getRequestParams().appid
    _private.eid = mbos.getRequestParams().eid
    _private.path = mbos.getRequestParams().path
    _private.hostname = ""
    _private.storeEid = mbos.getRequestParams().storeEid
}
var respData
var entryIndex = 0
//假勤参数
_private.atsParams = undefined
var otTypes = "",
    otReasons = "",
    otCompens = ""
_self.pageinit = function () {
    $("#id").hide()
    _private._ATS_OVERTIMECOMPENS_OVERTIME_NAME = localeResource.overtimePay
    mbos.getRequestParams().operateState = "ADDNEW"
    _private.registerDefaultEvent("onStateChange", "stateChange")
    //兼容外部传入界面状态
    page.setOperateState(mbos.getRequestParams().operateState)
    mbos.$eventbus.fire("page", "afterRendered")
    _private.placeholderInit()
    if (mbos.getRequestParams().operateState === "ADDNEW") {
        _private.initializeData()
        //校验该员工是否有假勤档案
        _private.atsParams = _private.getAtsParams()
        //将bosType设置为主表AtsLeaveBill的bosType值
        page.getEditData().bosType = "C46A580E"
        //创建主表对应的info
        page.createData()
        //初始化之后设置提交按钮不可用]
        _private.submitButtonState()
        $("div F7").after("<div class='caret-F7 overBill-caret-F7'></div>")
        //$('div kddatepicker').after("<div class='caret-date overBill-caret-date'></div>");
        mbos("restTime0").bind("blur", function(){ _this.restTimeChange(0)})
        //去除加班类型，加班原因，补偿方式右边的编辑标识
        $("#otType .glyphicon,#otReason .glyphicon,#otCompens .glyphicon").remove()
        $("#otDate0").prepend('<div id="warmPrompt" class="warmPrompt"></div>')

        _private.initFieldValue()
        _private.getOTContrlParams()
    }
    setTimeout(function () {
        $("#endTime").find($(".glyphicon-remove")).remove()
        $("#otReason,#otType,#otCompens,#htmlContent4,#htmlContent5").hide()
        //$('#htmlContent4,#htmlContent5').hide();
        var type = ""
        var typeInput = null
        $("#MainPage").delegate(".overTimeType", "click", function (e) {
            type = e.target.className.split(" ")[1]
            typeInput = $(this)
            if (e.target.className.split(" ")[1] === "otType") {
                $(".overtimes .over").html(otTypes)
            }
            if (e.target.className.split(" ")[1] === "otReason") {
                $(".overtimes .over").html(otReasons)
            }
            if (e.target.className.split(" ")[1] === "otCompens") {
                $(".overtimes .over").html(otCompens)
            }
            $(".overtimes").show()
        })

        $(".overtimes").delegate("li", "click", function (e) {
            $(this).hide()
            typeInput.html(e.target.innerHTML)
            $(typeInput).data("id", $(e.target).data("id"))
            var typeId = typeInput.attr("id")
            var selectOTIndex = parseInt(typeId.substring(type.length))
            $("." + type).data("id", $(e.target).data("id"))
            if (type === "otType") {
                _private.otTypeId = $(e.target).data("id")
                mbos.eas.invokeScript({
                    name: "billOptionHrOrgFilter",
                    param: [
                        {
                            billType: "overTime",
                            attendanceDate: mbos("otDate0").value(),
                            otType: e.target.dataset.id
                        }
                    ],
                    success: function (resp) {
                        respData = resp
                        otTypes = ""
                        otReasons = ""
                        otCompens = ""
                        resp.otType.forEach(function (item) {
                            otTypes +=
                                "<li class=radio data-id=" + item.id + ">" + item.name + "</li>"
                        })
                        resp.otReason.forEach(function (item) {
                            otReasons +=
                                "<li class=radio data-id=" +
                                item.id +
                                " >" +
                                item.name +
                                "</li>"
                        })
                        resp.otCompens.forEach(function (item) {
                            otCompens +=
                                "<li class=radio data-id=" + item.id + ">" + item.name + "</li>"
                        })
                        $("#otReason" + selectOTIndex).html(resp.otReason[0].name)
                        $("#otReason" + selectOTIndex).data("id", resp.otReason[0].id)
                        var isDefaultCompens = resp.otCompens.filter(function (item) {
                            return item.isDefault
                        })[0]
                        if (isDefaultCompens) {
                            $("#otCompens" + selectOTIndex).html(isDefaultCompens.name)
                            $("#otCompens" + selectOTIndex).data("id", isDefaultCompens.id)
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            } else if (type === "otReason") {
                _private.otReasonId = $(e.target).data("id")
            } else if (type === "otCompens") {
                _private.otCompensId = $(e.target).data("id")
            }
            _private.submitButtonState()
        })
        $(".overtimes").on("click", function () {
            $(this).hide()
        })
        // 查看审批流
        if (mbos.getRequestParams().billID && mbos.getRequestParams().stat == "view") {
            mbos.eas.invokeScript({
                name: 'getApproveHistory',
                param: [{ billId: mbos.getRequestParams().billID }],
                success: function (resp) {
                    if (resp.length > 0) {
                        var str = ''
                        resp.forEach(function (item) {
                            if(item['MultiApprove.isPass'] == null){
                                str +=
                                    '<li class="pItem"><span class="s0"></span><span class="s1">' +
                                    item['multiapprove.ispass'].alias +
                                    '</span><span class="s3">' +
                                    item['personid.name'] +
                                    '</span><span class="s4">' +
                                    (item['multiapprove.opinion'] == null ? "" : item['multiapprove.opinion'] )+
                                    '</span><span class="s5">' +
                                    item['multiapprove.createtime'] +
                                    '</span></li>'
                            }else{
                                str +=
                                    '<li class="pItem"><span class="s0"></span><span class="s1">' +
                                    item['MultiApprove.isPass'].alias +
                                    '</span><span class="s3">' +
                                    item['personId.name'] +
                                    '</span><span class="s4">' +
                                    (item['MultiApprove.opinion'] == null ? "" : item['MultiApprove.opinion'] ) +
                                    '</span><span class="s5">' +
                                    item['MultiApprove.createTime'] +
                                    '</span></li>'
                            }
                        })
                        $('.process').html(str).show()
                    }
                },
                error: function (err) {}
            })
        }
    }, 10)
    // 为必填项前面添加红色*号
    _private.mustInputIcon()
    _private.initDate()
    // 将平台日期时间控件修改自己的控件
    _private.dateTimePicker(0)

    //流程编辑
    mbos("page").bind("beforeinnSave", function (e) {
        _private.overTimeSave(e)
    })
    $("#MainPage").delegate(".OTDel", "click", function () {
        $(this).closest('div[id="OTAdd"]').remove()
    })
    var otIndex = 1
    var otDate0 = $("#otDate0")[0].outerHTML
    var htmlContent2 = $("#htmlContent2")[0].outerHTML
    var realStartTime0 = $("#realStartTime0")[0].outerHTML
    var realEndTime0 = $("#realEndTime0")[0].outerHTML
    var startTime0 = $("#startTime0")[0].outerHTML
    var endTime0 = $("#endTime0")[0].outerHTML
    var restTime0 = $("#restTime0")[0].outerHTML.replace(
        'readonly="readonly"',
        ""
    )
    var overTime0 = $("#overTime0")[0].outerHTML.replace(
        'readonly="readonly"',
        ""
    )
    var htmlContent9 = $("#htmlContent9")[0].outerHTML
    var htmlContent1 = $("#htmlContent1")[0].outerHTML
    OTTempHtml =
        otDate0 +
        htmlContent2 +
        realStartTime0 +
        realEndTime0 +
        startTime0 +
        endTime0 +
        restTime0 +
        overTime0 +
        htmlContent9 +
        htmlContent1
    var OTAdd =
        "<div id='OTAdd' class='OTAdd'>" +
        OTTempHtml +
        "<div class='OTAddContent col-xs-12 col-xs-offset-0 comHtml'><div class='OTDel'>" +
        localeResource.delete +
        "</div></div></div>"
    $("#addEntries").on("click", function () {
        var OTAddTemp = OTAdd.replace(/otDate0/g, "otDate" + otIndex)
            .replace(/ban0/g, "ban" + otIndex)
            .replace(/realStartTime0/g, "realStartTime" + otIndex)
            .replace(/realEndTime0/g, "realEndTime" + otIndex)
            .replace(/startTime0/g, "startTime" + otIndex)
            .replace(/endTime0/g, "endTime" + otIndex)
            .replace(/restTime0/g, "restTime" + otIndex)
            .replace(/endTime0/g, "endTime" + otIndex)
            .replace(/overTime0/g, "overTime" + otIndex)
            .replace(/otType0/g, "otType" + otIndex)
            .replace(/otReason0/g, "otReason" + otIndex)
            .replace(/otCompens0/g, "otCompens" + otIndex)
            .replace(/note0/g, "note" + otIndex)
            .replace(/ng\-model="[\w\d]+"/g, "")
        $(this).parent().before(OTAddTemp)
        var today = new Date().toISOString().substring(0, 10)
        var todayTime = today + " " + new Date().toTimeString().substring(0, 5)
        var saveOtIndex = otIndex
        _private.selectDateChangeIndex = otIndex
        _private.dateTimePicker(otIndex)
        $("#otDate" + otIndex + " input").val(today)
        mbos("otDate" + otIndex).value(today)
        $("#startTime" + otIndex + " input").val(today + " 00:00")
        $("#endTime" + otIndex + " input").val(today + " 00:00")
        mbos("startTime" + otIndex).value(today + " 00:00")
        mbos("endTime" + otIndex).value(today + " 00:00")
        //  $("#restTime" + otIndex + " input").val('0');
        //  $("#overTime" + otIndex + " input").val('0.00');
        _this.otDateChange({ new_value: today, old_value: null }, otIndex);
        if(_private.otTypeArry != null && _private.otTypeArry.length >0){
            $("#otType" + otIndex).html(_private.otTypeArry[0].name)
            $("#otType" + otIndex).data("id", _private.otTypeArry[0].id)
        }
        if(_private.otReasonArry != null && _private.otReasonArry.length >0){
            $("#otReason" + otIndex).data("id", _private.otReasonArry[0].id)
            $("#otReason" + otIndex).html(_private.otReasonArry[0].name)
        }
        if(_private.otCompensArry != null && _private.otCompensArry.length >0){
            $("#otCompens" + otIndex).data("id", _private.otCompensArry[0].id)
            $("#otCompens" + otIndex).html(_private.otCompensArry[0].name)
        }
        $("#realStartTime" + otIndex).hide()
        $("#realEndTime" + otIndex).hide()
        $("#OTAdd #htmlContent2").hide()
        $("#OTAdd #otDate" + otIndex).css({
            "margin-top": "10px",
            "padding-right": "0.5rem"
        })
        $("#restTime" + otIndex + " input").blur(function () {
            _this.restTimeChange(saveOtIndex)
        })
        $(".OTDel").unbind().on("click",function(){
            $(this).closest('div[id="OTAdd"]').remove()
        });
        _private.submitButtonState()
        otIndex++
    })
}
mbos("page").bind("onCreateData", function () {
    _private.overTimeDate = mbos.getRequestParams().overTimeDate
    if (_private.overTimeDate) {
        mbos("entity").value().otDate = _private.overTimeDate
        mbos("otDate0").timeFormat("YYYY-MM-DD")

        mbos("entity").value().startTime = _private.overTimeDate
        mbos("startTime0").timeFormat("YYYY-MM-DD hh:mm")

        mbos("entity").value().endTime = _private.overTimeDate
        mbos("endTime0").timeFormat("YYYY-MM-DD hh:mm")
    }
})

//提交前封装、提交数据
_private.submitFunction = function () {
    //提交前对数据的合理性做校验
    var validate = _private.isValidate()
    if (validate) {
        //如果数据校验通过，则调用服务端函数进行提交操作
        var params = []
        var entrySize = $(".OTAdd").length + 1
        for (var i = 0; i < entrySize; i++) {
            //多分录数据
            var param = {}
            param.otDate = mbos("otDate" + i).value() + " 00:00:00"
            param.realStartTime = $("#startTime" + i + " input").val() + ":00"
            param.realEndTime = $("#endTime" + i + " input").val() + ":00"
            param.restTime = $($("#restTime" + i + " input")[1]).val()
            param.applyOTTime = $($("#overTime" + i + " input")[1]).val()
            param.otType = $("#otType" + i).data("id")
            param.otReason = $("#otReason" + i).data("id")
            param.otCompens = $("#otCompens" + i).data("id")
            param.description = $("#note" + i).val()
            param.id = mbos.getRequestParams().billID
                ? mbos.getRequestParams().billID
                : mbos("id").value()
            params[i] = param
        }
        var checkMsg = _private.checkEntry(params)
        if (checkMsg.length > 0) {
            mbos.msgBox.showError(checkMsg)
            return false
        }
        var success = function (data) {
            //平台必录校验方法
            var vali = mbos.ng.invokeAllScope("validate", { method: "submit" })
            if (!vali) {
                return
            }
            var errorMsg = data.errorMsg
            var atsOverTimeBill = data.bill
            if (errorMsg != undefined && errorMsg != null) {
                mbos.msgBox.showError(errorMsg)
                return false
            } else {
                if (
                    atsOverTimeBill != undefined &&
                    atsOverTimeBill != null &&
                    atsOverTimeBill != ""
                ) {
                    dataSubmit = _private.getEditData(atsOverTimeBill)
                    dataSubmit.workflowNextPerson = mbos("entity").data.workflowNextPerson
                    dataSubmit.id = mbos.getRequestParams().billID ? mbos.getRequestParams().billID : ""
                    if (_private.billNumber != "") {
                        dataSubmit.number = _private.billNumber
                    }
                    dataSubmit.id = mbos("id").value()
                    mbos.post({
                        url: "/mbos/editpage/submit",
                        param: {
                            bostype: page.getEditData().bosType,
                            uiname: mbos.getRequestParams().name,
                            model: JSON.stringify(dataSubmit)
                        },
                        success: function (data) {
                            mbos.msgBox.showInfo(localeResource.submitSuccess, function () {
                                sessionStorage.setItem("ttqingBillType", "overTimeBill")
                                window.location.href =
                                    "/mbos/page/loadPage?storeEid=4000148&appid=" +
                                    _private.appid +
                                    "&eid=" +
                                    _private.eid +
                                    "&path=ttqin86sp1&name=route.custom#/cD"
                            })
                        },
                        error: function (data) {
                            if (typeof data == "string") {
                                mbos.msgBox.showError("", data)
                            } else {
                                mbos.msgBox.showError(data)
                            }
                        }
                    })
                }
            }
        }
        var fail = function (data) {
            var detail = data.detail
            if (detail != null && detail != "" && detail.length > 0) {
                mbos.msgBox.showError(detail)
            } else {
                mbos.msgBox.showError(localeResource.OTentriesFail)
            }
        }
        mbos.eas.invokeScript("beforeSubmit", params, success, fail)
    }
}
//提交前检验考勤状态
_private.billAttendanceCheck = function (dataSubmit) {
    var entrySize = $(".OTAdd").length + 1
    var param = []
    for (var i = 0; i < entrySize; i++) {
        param[i] = {
            billType: "overTime",
            beginDate: mbos("startTime" + i)
                .value()
                .split(" ")[0],
            endDate: mbos("endTime" + i)
                .value()
                .split(" ")[0]
        }
    }
    mbos.eas.invokeScript({
        name: "billAttendanceCheck",
        param: param,
        success: function (result) {
            //var length = Object.keys(result).length;
            for (var i = 0; i < entrySize; i++) {
                var resp = result[i]
                if (!resp.returnResult) {
                    mbos.msgBox.showError(resp.returnMsg)
                }
            }
            mbos("nextperson1").checkParticipantPerson({
                editdata: dataSubmit,
                callback: _private.submitFunction
            })
        },
        error: function (err) {
            console.log(err)
        }
    })
}
_private.overTimeSubmit = function (event) {
    if (_private.billState == 1 && requestParam.billID != null) {
        // 单据撤回
        mbos.eas.invokeScript({
            name: "billWithDraw",
            param: [
                {
                    billId: requestParam.billID,
                    billType: "overTime"
                }
            ],
            success: function (resp) {
                if (resp.isSuccess) {
                    $("#htmlContent7").hide()
                    mbos.msgBox.showInfo(localeResource.withdrawSuccess, function () {
                        sessionStorage.setItem("ttqingBillType", "overTimeBill")
                        window.location.href =
                            "/mbos/page/loadPage?storeEid=4000148&appid=" +
                            _private.appid +
                            "&eid=" +
                            _private.eid +
                            "&path=ttqin86sp1&name=route.custom#/cD"
                    })
                } else {
                    mbos.msgBox.showError(resp.msg)
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    } else {
        //选择审批人
        var dataSubmit = {}
        dataSubmit.bosType = "C46A580E"
        _private.billAttendanceCheck(dataSubmit)
    }
}
//流程编辑保存
_private.overTimeSave = function (e) {
    var dataa = mbos.getRequestParams().billID ? mbos.getRequestParams().billID : ""
    //选择审批人
    var dataSubmit = {}
    dataSubmit.bosType = "C46A580E"
    _private.billAttendanceCheck(dataSubmit)
}
_private.getEditData = function (data) {
    //获取用户自定义扩展字段
    var editData = page.getEditData()
    //为了防止将这些字段删除时引发控件值改变事件，需要先将数据存起来
    _private.startTime = editData.beginTime
    _private.endTime = editData.endTime
    _private.otReason = editData.otReason
    _private.otType = editData.otType
    _private.otCompens = editData.otCompens
    _private.otDate = editData.otDate
    _private.description = editData.description
    //删除掉固定字段
    delete editData.id
    delete editData.entries
    delete editData.startTime
    delete editData.endTime
    delete editData.otReason
    delete editData.otType
    delete editData.otCompens
    delete editData.otDate
    delete editData.description
    delete editData.applyOTTime
    delete editData.restTime
    //移除无关字段
    for (var x in editData) {
        if (x.startWith("dynamicproperty")) {
            delete editData[x.toString()]
        }
    }
    //构造提交的info
    var dataSubmit = {}
    var entryArray = []
    for (var i = 0; i < data.entries.length; i++) {
        var entry = data.entries[i]
        var entryInfo = {}
        entryInfo.person = entry.person
        entryInfo.adminOrgUnit = entry.adminOrgUnit
        entryInfo.attAdminOrgUnit = entry.adminOrgUnit
        entryInfo.position = entry.position
        entryInfo.createTag = entry.createTag
        entryInfo.otDate = entry.otDate
        entryInfo.startTime = entry.startTime
        entryInfo.endTime = entry.endTime
        entryInfo.realStartTime = entry.realStartTime
        entryInfo.realEndTime = entry.realEndTime
        entryInfo.restTime = entry.restTime
        entryInfo.applyOTTime = entry.applyOTTime
        entryInfo.realOTTime = entry.realOTTime
        entryInfo.otType = entry.otType
        entryInfo.otReason = entry.otReason
        entryInfo.otCompens = entry.otCompens
        entryInfo.description = entry.description
        entryInfo.bosType = "B4309904"
        //迁移客户自定义扩展字段到分录Info中
        for (var x in editData) {
            entryInfo[x] = editData[x]
        }
        entryArray[i] = entryInfo
    }
    //构造提交的单据info
    dataSubmit.hrOrgUnit = data.hrOrgUnit
    dataSubmit.proposer = data.proposer
    dataSubmit.adminOrg = data.adminOrg
    dataSubmit.applyDate = data.applyDate
    dataSubmit.number = data.number
    dataSubmit.billSubmitType = data.billSubmitType
    dataSubmit.billState = data.billState
    dataSubmit.bosType = "C46A580E"
    dataSubmit.entries = entryArray
    dataSubmit.billSourceType = 2;
    return dataSubmit
}
_private.isValidate = function () {
    $("#otDateError").remove()
    var validate = true
    var startTime = $("#startTime input").val()
    var endTime = $("#endTime input").val()
    if (
        _private.otType == undefined ||
        _private.otReason == undefined ||
        _private.otCompens == undefined
    ) {
        validate = false
    }
    return validate
}

_private.initFieldValue = function () {
    var e = null

    mbos.$model("otReasonQuery").get()
    mbos.$eventbus.bind("otReasonQuery", "afterLoad", function (data) {
        data = mbos.$model("otReasonQuery").data
        _private.otReason = {
            id: data.list[0].id,
            name: data.list[0].name
        }
        _private.otReasonId = _private.otReason.id
        mbos.$model("entity").data.otReason = {
            id: _private.otReason.id,
            name: _private.otReason.name
        }
    })
    mbos.$model("otCompensQuery").get()
    mbos.$eventbus.bind("otCompensQuery", "afterLoad", function (data) {
        data = mbos.$model("otCompensQuery").data
        for (var i = 0; i < data.list.length; i++) {
            if (data.list[i].id == _private._ATS_OVERTIMECOMPENS_OVERTIME_ID) {
                _private._ATS_OVERTIMECOMPENS_OVERTIME_NAME = data.list[i].name
                _private.hasOverTime = true
                break
            }
        }
    })
    mbos.$model("otCompensDefault").get()
    mbos.$eventbus.bind("otCompensDefault", "afterLoad", function (data) {
        data = mbos.$model("otCompensDefault").data
        _private.otCompens = {
            id: data.list[0].id,
            name: data.list[0].name
        }
        _private.otCompensId = _private.otCompens.id
        _private._ATS_OVERTIMECOMPENS_DEFAULT_ID = _private.otCompens.id
        _private._ATS_OVERTIMECOMPENS_DEFAULT_NAME = _private.otCompens.name
        mbos.$model("entity").data.otCompens = {
            id: _private.otCompens.id,
            name: _private.otCompens.name
        }
    })
    mbos.$model("otTypeQuery").get()
    mbos.$eventbus.bind("otTypeQuery", "afterLoad", function (data) {
        data = mbos.$model("otTypeQuery").data
        for (var i = 0; i < data.list.length; i++) {
            _private.otTypeList[i] = data.list[i].id
        }
    })
}
//开始时间发生变化，则计算加班、休息时长
_private.a = 1

_private.getBillDetail = function (billId) {
    var params = [
        {
            billId: billId,
            billType: "overTimeBill"
        }
    ]
    var success = function (data) {
        if (data != null && data.entries && data.entries.length > 0) {
            mbos("id").value(data.id);
            if (!data.state || data.state === localeResource.noSubmit) {
                _private.billState = 0
                $("#htmlContent7").hide()
                $("#submit").show()
            } else {
                $("#htmlContent7").show() //不可编辑遮层
                $("#htmlContent3").hide() //隐藏添加分录按钮
                if (data.state === localeResource.noApproval) { // noApproval未审批
                    _private.billState = 1
                    $("#submit").show()
                } else {
                    $("#submit").hide()
                    _private.billState = 4
                }
                if ($(".attachDiv").length < 1) {
                    $("#attachment1").hide()
                }

                $($(".attachImg")[($(".attachImg").length - 1)]).hide()//隐藏附件添加控件
                $(".deleteAttach").hide()//隐藏附件删除控件
                // $('.OTAddContent').hide()//隐藏删除
            }
            //显示分录
            for (var i = 0; i < data.entries.length; i++) {
                if (i > 0) {
                    $("#addEntries").click()
                }
                var entryInfo = data.entries[i]

                mbos.$eventbus.unbind(
                    "otDate" + i,
                    "valueChanged",
                    "otDate" + i + "Change"
                )
                mbos("otDate" + i).value(entryInfo.otDate) //加班日期
                mbos.$eventbus.bind(
                    "otDate" + i,
                    "valueChanged",
                    "otDate" + i + "Change"
                )
                $("#otDate" + i + " input").val(entryInfo.otDate)

                mbos.$eventbus.unbind(
                    "startTime" + i,
                    "valueChanged",
                    "startTime" + i + "Change"
                )
                mbos("startTime" + i).value(entryInfo.beginTime) //开始时间
                $("#startTime" + i + " input").val(entryInfo.beginTime)
                mbos.$eventbus.bind(
                    "startTime" + i,
                    "valueChanged",
                    "startTime" + i + "Change"
                )

                mbos.$eventbus.unbind(
                    "endTime" + i,
                    "valueChanged",
                    "endTime" + i + "Change"
                )
                mbos("endTime" + i).value(entryInfo.endTime) //开始时间
                $("#endTime" + i + " input").val(entryInfo.endTime)
                mbos.$eventbus.bind(
                    "endTime" + i,
                    "valueChanged",
                    "endTime" + i + "Change"
                )

                mbos("restTime" + i).value(entryInfo.restTime) //休息时长
                $("#restTime" + i + " input").val(entryInfo.restTime)
                mbos("overTime" + i).value(entryInfo.realOTTime) //加班时长
                $("#overTime" + i + " input").val(entryInfo.realOTTime)

                $("#otType" + i).html(entryInfo.otTypeName)
                $("#otType" + i).data("id", entryInfo.otTypeId)
                $("#otReason" + i).data("id", entryInfo.otReasonId)
                $("#otReason" + i).html(entryInfo.otReasonName)
                $("#otCompens" + i).data("id", entryInfo.otCompensId)
                $("#otCompens" + i).html(entryInfo.otCompensName)
                $("#note" + i).val(entryInfo.description)

            }
        }
        if (_private.billState == 1) {
            $("#htmlContent6").show()
            $("#submit").find("button").text(localeResource.withdraw)
            $("#submit").show()
            $('.OTAddContent').hide()
            // $("#htmlContent9").hide()
        } else if (_private.billState == 2 || _private.billState == 3) {
            $("#submit").hide()
            $("#htmlContent6").show()
        } else {
            $("#htmlContent6").hide()
            //$('.OTAddContent').hide()
            $("#submit").show()
        }
        _private.submitButtonState()
    }
    var fail = function () {
        mbos.msgBox.showError(localeResource.getOTEntriesError)
    }
    mbos.eas.invokeScript("getBillDetail_new", params, success, fail)
}

setTimeout(function () {
    // 查看单据
    if (mbos.getRequestParams()) {
        var billId = mbos.getRequestParams().billID
        if (billId) {
            _private.getBillDetail(billId)
        }
    }
}, 1000)

_private.getOTContrlParams = function () {
    var success = function (data) {
        _private.isOTControl = data.isOTControl
        _private.isOtrolByDateType = data.isOtrolByDateType
        if (_private.isOtrolByDateType) {
            mbos("otType").disable()
            $("#otType").removeClass("disable_state")
        }
    }
    var fail = function (data) {}
    var params = []
    mbos.eas.invokeScript("getOTContrlParams", params, success, fail)
}
_private.submitButtonState = function () {
    if (_private.billState == 0) {
        //若数据校验通过，则设置提交按钮可用，并且改变按钮样式
        $("#submit button").attr("style", "background-color:#0088cc")
        $("#submit button").off("click")
        mbos("submit").unbind("click")
        //$('#submit button').off("click").on("click", _private.overTimeSubmit)
        mbos("submit").bind("click", _private.overTimeSubmit)
        window.submitHasBinded = true
    } else if (_private.billState == 1) {
        $("#submit button").attr("style", "background-color:#0088cc")
        $("#submit button").off("click")
        mbos("submit").unbind("click")
        mbos("submit").bind("click", _private.overTimeSubmit)
    } else {
        //若数据校验没有通过，则设置按钮不可用，并且改变按钮样式
        $("#submit button").removeAttr("style")
        console.log(false)
        $("#submit button").off("click")
        mbos("submit").unbind("click")
        window.submitHasBinded = false
    }
}
_this.descriptionChange = function (event) {
    _private.description = event.new_value
    _private.submitButtonState()
    return page.descriptionChange && page.descriptionChange(event)
}
String.prototype.startWith = function (str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false
    if (this.substr(0, str.length) == str) return true
    else return false
    return true
}
_self.createData = function (e) {
    mbos.post({
        url:
            "/mbos/editpage/createNewData?&bostype=" +
            _self.getEditData().bosType +
            "&uiname=" +
            requestParam.name,
        param: {
            bostype: _self.getEditData().bosType,
            model: JSON.stringify(_self.getEditData()),
            uiname: mbos.getRequestParams().name
        },
        success: function (data) {
            _private.extendIncludeEntry(data, initvalueMap)
            mbos.$model("entity").data = mbos.$model("entity").data || {}
            _private.extendIncludeEntry(mbos.$model("entity").data, data)
            //mbos.$model('entity').data=data;
            mbos.$eventbus.fire("page", "onCreateData")
        },
        error: function (data) {
            if (typeof data == "string") {
                mbos.msgBox.showError("", data)
            } else {
                mbos.msgBox.showError(data)
            }
        }
    })
}
_private.extendIncludeEntry = function (dst) {
    angular.forEach(arguments, function (obj) {
        if (obj !== dst) {
            angular.forEach(obj, function (value, key) {
                if ($.isArray(value) && value.length == 1) {
                    if ($.isArray(dst[key]) && dst[key].length == 1)
                        angular.extend(dst[key][0], value[0])
                    else {
                        //NEW
                        dst[key] = []
                        dst[key][0] = {}
                        angular.extend(dst[key][0], value[0])
                    }
                } else {
                    dst[key] = value
                }
            })
        }
    })
    return dst
}

_this.editNew = function (event) {
    location.reload(true)
}
_private.getAtsParams = function () {
    var params = []
    var param = {}
    params[0] = param
    var success = function (data) {
        var errorMsg = data.errorMsg
        if (errorMsg != undefined && errorMsg != null && errorMsg != "") {
            mbos.msgBox.showError(errorMsg)
            _private.atsParams = false
        } else {
            _private.atsParams = true
        }
    }
    var fail = function (data) {
        _private.atsParams = false
        mbos.msgBox.showError(localeResource.getPersonFail)
    }
    mbos.eas.invokeScript("getSetIsCtrlHalfDayOff", params, success, fail)
    return _private.atsParams
}
_this.addnewOne = function (event) {
    window.location.reload(true)
}

_this.list = function (event) {
    mbos.ui.open({
        path: "overTime",
        name: "overTimeBillList.listui",
        params: {}
    })
}
_this.restTimeChange = function (otIndex) {
    if(otIndex == null){
        otIndex = 0;
    }
    var calIndex = 0
    var new_value = $($("#restTime" + otIndex + " input")[1]).val()
    _private.overTime = $($("#overTime" + otIndex + " input")[1]).val()
    if (typeof otIndex != "undefined") {
        new_value = $($("#restTime" + otIndex + " input")[1]).val()
        _private.overTime = $($("#overTime" + otIndex + " input")[1]).val()
        calIndex = otIndex
    }
    if (new_value == null || new_value == "") {
        _private.restTime = 0
        _this.calculateOverTime(calIndex)
    } else {
        _private.restTime = new_value
        var overTime = (
            _private.overTime -
            parseFloat(_private.restTime) / 60
        ).toFixed(_private.decimalPlaces)
        _private.overTime = overTime
        _this.calculateOverTime(calIndex)
    }
    //mbos.$model("entity").data.restTime = _private.restTime
}
_this.calculateOverTime = function (calIndex) {
    if(calIndex == null){
        calIndex = 0;
    }
    var start = $("#startTime" + calIndex + " input").val()
    var end = $("#endTime" + calIndex + " input").val()

    var overTime = _private.overTime
    if (start != undefined && end != undefined) {
        startTime = start.replace(/-/g, "/")
        endTime = end.replace(/-/g, "/")
        startDate = new Date(Date.parse(startTime))
        endDate = new Date(Date.parse(endTime))
        overTime =
            parseFloat(endDate.getTime() - startDate.getTime()) / 1000.0 / 60 / 60
    }
    if (overTime <= 0) {
        mbos.$model("entity").data.applyOTTime = 0
        mbos.$model("entity").data.restTime = 0
        _private.submitButtonState()
    } else {
        _private.overTime = (overTime - parseFloat(_private.restTime) / 60).toFixed(
            _private.decimalPlaces
        )
        if (calIndex != 0) {
            $("#overTime" + calIndex + " input").val(_private.overTime)
        } else {
            mbos.$model("entity").data.applyOTTime = _private.overTime
        }
    }
}
_private.placeholderInit = function () {
    $("#restTime0 input").attr("placeholder", localeResource.restTimePlaceholder)
    $("#overTime0 input").attr("placeholder", localeResource.OttimePlaceholder)
    $("#description0 input").attr("placeholder", localeResource.notePlaceholder)
}
// 为必填项前面添加红色*号
_private.mustInputIcon = function () {
    $("#otDate0 label").prepend(
        '<span class="must_input_icon ng-scope" style="margin-left:0;">*</span>'
    )
    $("#startTime0 label").prepend(
        '<span class="must_input_icon ng-scope" style="margin-left:0;">*</span>'
    )
    $("#endTime0 label").prepend(
        '<span class="must_input_icon ng-scope" style="margin-left:0;">*</span>'
    )
    $("#overTime0 label").prepend(
        '<span class="must_input_icon ng-scope" style="margin-left:0;">*</span>'
    )
    $("#htmlContent9 label")
        .eq(0)
        .prepend(
            '<span class="must_input_icon ng-scope" style="margin-left:0;margin-right:3px;float: left;">*</span>'
        )
    $("#htmlContent9 label")
        .eq(2)
        .prepend(
            '<span class="must_input_icon ng-scope" style="margin-left:0;margin-right:3px;float: left;">*</span>'
        )
}
_private.initDate = function () {
    var date =
        new Date().getFullYear() +
        "-" +
        (new Date().getMonth() + 1 > 9
            ? new Date().getMonth() + 1
            : "0" + (new Date().getMonth() + 1)) +
        "-" +
        (new Date().getDate() > 9
            ? new Date().getDate()
            : "0" + new Date().getDate()) +
        " 00:00"
    if (mbos.getRequestParams().date) {
        date = mbos.getRequestParams().date + " 00:00"
    }
    mbos.$model("entity").data.otDate = date.substring(0, 10)
    mbos.$model("entity").data.startTime = date
    mbos.$model("entity").data.endTime = date

    // mbos("otDate").value(date.substring(0,9))
    //mbos("startTime0").value(date + " 00:00");
    //mbos("endTime0").value(date + " 00:00");
}
// JavaScript source code
// 将平台日期时间控件修改自己的控件
_private.dateTimePicker = function (OtIndex) {
    $("#restTime" + OtIndex + " input").val(0);
    $("#overTime" + OtIndex + " input").val(0);
    new DateTimePicker("#otDate" + OtIndex + " input", {
            bubble: false,
            format: "yy-MM-dd"
        },
        "",
        function (date) {
            //mbos.$model('entity').data.otDate=date
            _private.selectDateChangeIndex = OtIndex
            var oldValue = mbos("otDate" + OtIndex).value();
            mbos("otDate" + OtIndex).value(date);
            _this.otDateChange(event, oldValue)
        }
    );
    new DateTimePicker("#startTime" + OtIndex + " input", {
            bubble: false,
            format: "yy-MM-dd hh:mm"
        },
        "",
        function (date) {
            $("#startTime" + OtIndex + " input").val(date);
            var endTime = $("#endTime" + OtIndex + " input").val();
            if (endTime && new Date(endTime.replace(/-/g, "/")).getTime() < new Date(date.replace(/-/g, "/")).getTime()) {
                $("#endTime" + OtIndex + " input").val(date);
                $("#restTime" + OtIndex + " input").val(0);
                $("#overTime" + OtIndex + " input").val(0);
                return;
            }
            _this.timeChange(event, OtIndex);
        }
    );
    new DateTimePicker("#endTime" + OtIndex + " input", {
            bubble: false,
            format: "yy-MM-dd hh:mm"
        },
        "",
        function (date) {
            $("#endTime" + OtIndex + " input").val(date);
            var beginTime = $("#startTime" + OtIndex + " input").val();
            if (mbos("startTime" + OtIndex).value() == null || beginTime == null || new Date(beginTime.replace(/-/g, "/")).getTime() > new Date(date.replace(/-/g, "/")).getTime()) {
                //单据结束时间变动，小于开始时间则重置开始时间
                $("#startTime" + OtIndex + " input").val(date);
                $("#restTime" + OtIndex + " input").val(0);
                $("#overTime" + OtIndex + " input").val(0);
                return;
            }
            _this.timeChange(event, OtIndex)
        }
    );
}

//考勤日期值发生改变时，调用OSF获取默认的 加班类型
_this.otDateChange = function (event, oldValue) {
    _private.restTime0 = $("#restTime0 input").val()
    _private.applyTime0 = $("#overTime0 input").val()
    var selectOTIndex = _private.selectDateChangeIndex
    if (selectOTIndex < 1) {
        if (!event) {
            return
        }
    } else {
        if ((oldValue || "") == (mbos("otDate" + selectOTIndex).value() || "")) {
            return
        }
    }

    $("#otDateError").remove()
    // var otDate = mbos.$model('entity').data.otDate;
    var otDate = mbos("otDate" + selectOTIndex).value()
    if (otDate.length > 10) {
        otDate = otDate.substring(0, 10)
    }
    if (selectOTIndex == 0) {
        mbos("startTime0").value(otDate + " 00:00")
        mbos("endTime0").value(otDate + " 00:00")
        $("#startTime" + selectOTIndex + " input").val(otDate + " 00:00")
        $("#endTime" + selectOTIndex + " input").val(otDate + " 00:00")
    } else {
        $("#startTime" + selectOTIndex + " input").val(otDate + " 00:00")
        $("#endTime" + selectOTIndex + " input").val(otDate + " 00:00")
        mbos("startTime" + selectOTIndex).value(otDate + " 00:00")
        mbos("endTime" + selectOTIndex).value(otDate + " 00:00")
    }

    var params = []
    var param = {}

    var success = function (data) {
        var otTypeValue = data.otTypeValue
        var otTypeText = data.otTypeText

        if (_private.otTypeList.indexOf(otTypeValue) == -1) {
            //如果list里面没有，表明禁用了，与web端操持一直置空
            otTypeValue = ""
            otTypeText = ""
        }

        _private.otType = {
            id: otTypeValue,
            name: otTypeText
        }
        _private.otTypeId = _private.otType.id
        mbos.$model("entity").data.otType = {
            id: otTypeValue,
            name: otTypeText
        }
        var otTypeId = $("#otType" + selectOTIndex).data("id");
        /*
        if(otTypeId == null || otTypeId == ""){
            $("#otType" + selectOTIndex).html(otTypeText)
            $("#otType" + selectOTIndex).data("id", otTypeValue)
        }*/

        if (
            _private.otType.id ==
            _private._ATS_OVERTIME_LEGALHOLIDAYDAY_OVERTIME_ID &&
            _private.hasOverTime == true
        ) {
            mbos.$model("entity").data.otCompens = {
                id: _private._ATS_OVERTIMECOMPENS_OVERTIME_ID,
                name: _private._ATS_OVERTIMECOMPENS_OVERTIME_NAME
            }
            _private.otCompensId = _private._ATS_OVERTIMECOMPENS_OVERTIME_ID
            $("#otCompens" + selectOTIndex).data(
                "id",
                _private._ATS_OVERTIMECOMPENS_OVERTIME_ID
            )
        } else {
            mbos.$model("entity").data.otCompens = {
                id: _private._ATS_OVERTIMECOMPENS_DEFAULT_ID,
                name: _private._ATS_OVERTIMECOMPENS_DEFAULT_NAME
            }
            if($("#otCompens" + selectOTIndex).data("id") == null || $("#otCompens" + selectOTIndex).data("id") == ""){
                _private.otCompensId = _private._ATS_OVERTIMECOMPENS_DEFAULT_ID
            }else{
                _private.otCompensId = $("#otCompens" + selectOTIndex).data("id")
            }

            $("#otCompens" + selectOTIndex).data(
                "id",
                _private.otCompensId
            )
        }
        var otReason = mbos.$model("entity").data.otReason
        if (otReason == undefined) {
            _private.initFieldValue()
        }
        if (_private.isOTControl) {
            var success = function (data) {
                if (data.isOverWarnValue) {
                    var html = ""
                    if (data.cycleDateType != 3) {
                        html =
                            localeResource.warmPrompt +
                            data.personName +
                            localeResource.warmNote1 +
                            data.dateValue +
                            localeResource.warmNote2 +
                            data.used +
                            localeResource.warmNote3 +
                            "，" +
                            localeResource.warmNote4 +
                            "<span style='color:red'>" +
                            data.substract +
                            localeResource.warmNote3 +
                            "</span>" +
                            "【" +
                            localeResource.warmNote5 +
                            data.warnValue +
                            "," +
                            localeResource.warmNote6 +
                            data.limitValue +
                            "】"
                    } else {
                        html =
                            localeResource.warmPrompt +
                            data.personName +
                            localeResource.warmNote1 +
                            data.dateValue +
                            localeResource.warmNote7 +
                            "【" +
                            data.startDate +
                            localeResource.warmNote8 +
                            data.endDate +
                            "】" +
                            localeResource.warmNote9 +
                            data.used +
                            localeResource.warmNote3 +
                            "，" +
                            localeResource.warmNote4 +
                            "<span style='color:red'>" +
                            data.substract +
                            localeResource.warmNote3 +
                            "</span>" +
                            localeResource.warmNote5 +
                            "【" +
                            data.warnValue +
                            "," +
                            localeResource.warmNote6 +
                            data.limitValue +
                            "】"
                    }
                    $("#warmPrompt").html(html)
                    $("#warmPrompt").show()
                } else {
                    $("#warmPrompt").hide()
                }
            }
            var fail = function (data) {}
            mbos.eas.invokeScript(
                "getPersonOTLimitInfo",
                [_private.otDate, _private.otTypeId, _private.otCompensId],
                success,
                fail
            )
        }
        mbos("restTime0").value(_private.restTime0)
        mbos("overTime0").value(_private.applyTime0)

        mbos.eas.invokeScript({
            name: "billOptionHrOrgFilter",
            param: [
                {
                    billType: "overTime",
                    attendanceDate: otDate,
                    otType: ""
                }
            ],
            success: function (resp) {
                _private.otTypeArry = resp.otType
                _private.otCompensArry = resp.otCompens
                _private.otReasonArry = resp.otReason
                respData = resp
                otTypes = ""
                otReasons = ""
                otCompens = ""
                resp.otType.forEach(function (item) {
                    otTypes +=
                        "<li class=radio data-id=" + item.id + ">" + item.name + "</li>"
                })
                resp.otReason.forEach(function (item) {
                    otReasons +=
                        "<li class=radio data-id=" + item.id + " >" + item.name + "</li>"
                })
                resp.otCompens.forEach(function (item) {
                    otCompens +=
                        "<li class=radio data-id=" + item.id + ">" + item.name + "</li>"
                })

                if (mbos.getRequestParams().billID) {
                    var d = mbos.getRequestParams().billID;
                    var dotTypeId = $("#otType" + selectOTIndex).data("id");
                    var dotReasonId = $("#otReason" + selectOTIndex).data("id");
                    var dotCompensId = $("#otCompens" + selectOTIndex).data("id");
                    var ele;
                    if(dotTypeId == null) dotTypeId = "";
                    if(dotReasonId == null) dotReasonId = "";
                    if(dotCompensId == null) dotCompensId = "";
                    var nowOtType = resp.otType.filter(function (item) {
                        return item.id === dotTypeId.replace(/ /g, '+')
                    })[0]
                    if (nowOtType) {
                        $('#otType' + selectOTIndex).html(nowOtType.name);
                        $('#otType' + selectOTIndex).data("id", nowOtType.id);
                    } else {
                        $('#otType' + selectOTIndex).html(resp.otType[0].name);
                        $('#otType' + selectOTIndex).data("id", resp.otType[0].id);
                    }
                    $('#otType' + selectOTIndex).trigger('click');
                    setTimeout(function () {
                        var ele = Array.prototype.slice.call($('.radio')).filter(function (item) {
                            return item.dataset.id === dotTypeId.replace(/ /g, '+');
                        });
                        $(ele[0]).trigger('click');
                    })


                    var nowOtReason = resp.otReason.filter(function (item) {
                        return item.id === dotReasonId.replace(/ /g, '+')
                    })[0]
                    if (nowOtReason) {
                        $('#otReason' + selectOTIndex).html(nowOtReason.name);
                        $('#otReason' + selectOTIndex).data("id", nowOtReason.id);
                        $('#otReason' + selectOTIndex).trigger('click');
                        setTimeout(function () {
                            var ele = Array.prototype.slice.call($('.radio')).filter(function (item) {
                                return item.dataset.id === dotReasonId.replace(/ /g, '+');
                            });
                            $(ele[0]).trigger('click');
                        })
                    } else {
                        $('#otReason' + selectOTIndex).html("");
                        $('#otReason' + selectOTIndex).data("id", "");
                    }
                    var nowOtCompens = resp.otCompens.filter(function (item) {
                        return item.id === dotCompensId.replace(/ /g, '+')
                    })[0]
                    if (nowOtCompens) {
                        $('#otCompens' + selectOTIndex).html(nowOtCompens.name);
                        $('#otCompens' + selectOTIndex).data("id", nowOtCompens.id);
                    } else {
                        $('#otCompens' + selectOTIndex).html("");
                        $('#otCompens' + selectOTIndex).data("id", "");
                    }

                    $('#otCompens' + selectOTIndex).trigger('click');
                    setTimeout(function () {
                        var ele = Array.prototype.slice.call($('.radio')).filter(function (item) {
                            return item.dataset.id === dotCompensId.replace(/ /g, '+');
                        });
                        $(ele[0]).trigger('click');
                    })
                } else {
                    $('#otReason' + selectOTIndex).html(resp.otReason[0].name);
                    $('#otReason' + selectOTIndex).data("id", resp.otReason[0].id);
                    var defaultotCompens = resp.otCompens.filter(function (item) {
                        return item.isDefault
                    })[0]
                    if (defaultotCompens) {
                        $('#otCompens' + selectOTIndex).html(defaultotCompens.name);
                        $('#otCompens' + selectOTIndex).data("id", defaultotCompens.id);
                    }

                }

            },
            error: function (err) {
                console.log(err)
            }
        })
        _private.submitButtonState()
    }
    var fail = function (data) {
        mbos.msgBox.showError(localeResource.getOTtypeFail)
    }
    if (otDate != undefined || (otDate == null && _private.atsParams)) {
        _private.otDate = otDate
        param.otDate = _private.otDate
        params[0] = param
        mbos.eas.invokeScript("getOtType", params, success, fail)
        //考勤日期发生改变时也要计算加班休息时长
        _this.timeChange(event, selectOTIndex)
    }
// easContext.person 可能不存在
    // 考勤结果
    var p2 = [
        {
            personId: easContext.person ? easContext.person.id : (easContext.userID || easContext.user.id ),
            date: otDate
        }
    ]
    mbos.eas.invokeScript({
        name: "getDayAttendance",
        param: p2,
        success: function (resp) {
            var $currBan = $("#ban" + selectOTIndex)
            var date =
                new Date().getFullYear() +
                "-" +
                (new Date().getMonth() + 1 > 9
                    ? new Date().getMonth() + 1
                    : "0" + (new Date().getMonth() + 1)) +
                "-" +
                (new Date().getDate() > 9
                    ? new Date().getDate()
                    : "0" + new Date().getDate())
            if (resp.hasScheduleShift === false || date == otDate) {
                $currBan.parent().hide()
                return false
            }
            $currBan.parent().show()
            var resp = resp
            var shiftName = resp.shiftName
            var attendanceState = resp.attendanceState
            if (resp.isAttendance) {
                var list = resp.listShift || []
                var card = resp.fetchCardList || ["", "", "", "", "", ""]
                var listShift = list.map(function (item, index) {
                    if (index % 2 === 0) {
                        item += "-"
                    } else {
                        item += " "
                    }
                    return item
                })
                if (resp.hasShift === false) {
                    $currBan.hide()
                } else {
                    $currBan.show()
                }

                function computeStyle(a) {
                    var arr = a.split(":")
                    return parseInt(arr[0], 10) * 60 + parseInt(arr[1], 10)
                }

                function getStyleObj(len) {
                    if (card.length && list.length) {
                        var totalListMinutes =
                            computeStyle(list[len - 1]) - computeStyle(list[len - 2])
                        var totalCardMinutes =
                            computeStyle(
                                card[len - 1] >= list[len - 1] ? list[len - 1] : card[len - 1]
                            ) -
                            computeStyle(
                                card[len - 2] >= list[len - 2] ? card[len - 2] : list[len - 2]
                            )
                        var left =
                            list[len - 2] >= card[len - 2]
                                ? 0
                                : ((computeStyle(card[len - 2]) - computeStyle(list[len - 2])) *
                                100) /
                                totalListMinutes
                        // 处理边界条件
                        if (left > 100) {
                            var w = $(".totalLine .t4").outerWidth()
                            w += $(".totalLine .t3").outerWidth()
                            w++
                            left = "calc(100% - " + w + "px)"
                        }
                        var right =
                            list[len - 1] <= card[len - 1]
                                ? 0
                                : ((computeStyle(list[len - 1]) - computeStyle(card[len - 1])) *
                                100) /
                                totalListMinutes +
                                "%"
                        return {
                            width: (totalCardMinutes * 100) / totalListMinutes + "%",
                            left: left,
                            right: right
                        }
                    } else {
                        return {
                            width: 0,
                            left: 0,
                            right: 0
                        }
                    }
                }
                var html1 =
                    "<div class='totalLine html1'><div class='line'></div><span class='t1'>" +
                    list[0] +
                    "</span><span class='t2'>" +
                    list[1] +
                    "</span><span class='t3'>" +
                    (card[0] || localeResource.noClock) +
                    "</span><span class='t4'>" +
                    (card[1] || localeResource.noClock) +
                    "</span></div>"
                var html2 =
                    html1 +
                    "<div class='totalLine html2'><div class='line'></div><span class='t1'>" +
                    list[2] +
                    "</span><span class='t2'>" +
                    list[3] +
                    "</span><span class='t3'>" +
                    (card[2] || localeResource.noClock) +
                    "</span><span class='t4'>" +
                    (card[3] || localeResource.noClock) +
                    "</span></div>"
                var html3 =
                    html2 +
                    "<div class='totalLine html3'><div class='line'></div><span class='t1'>" +
                    list[4] +
                    "</span><span class='t2'>" +
                    list[5] +
                    "</span><span class='t3'>" +
                    (card[4] || localeResource.noClock) +
                    "</span><span class='t4'>" +
                    (card[5] || localeResource.noClock) +
                    "</span></div>"

                if (list.length === 4) {
                    $currBan.html(html2)
                    $currBan.find(".totalLine").css("width", "48%")
                    var style1 = getStyleObj(2)
                    var style2 = getStyleObj(4)
                    $currBan.find(".html1 .line").css({
                        width: style1.width,
                        left: style1.left,
                        right: style1.right
                    })
                    $currBan.find(".html1 .t3").css({
                        left: style1.left
                    })
                    $currBan.find(".html1 .t4").css({
                        right: style1.right
                    })
                    $currBan.find(".html2 .line").css({
                        width: style2.width,
                        left: style2.left,
                        right: style2.right
                    })
                    $currBan.find(".html2 .t3").css({
                        left: style2.left
                    })
                    $currBan.find(".html2 .t4").css({
                        right: style2.right
                    })
                } else if (list.length === 6) {
                    $currBan.find.html(html3)
                    $currBan.find(".totalLine").css("width", "31%")
                    var style1 = getStyleObj(2)
                    var style2 = getStyleObj(4)
                    var style3 = getStyleObj(6)
                    $currBan.find(".html1 .line").css({
                        width: style1.width,
                        left: style1.left,
                        right: style1.right
                    })
                    $currBan.find(".html1 .t3").css({
                        left: 0
                    })
                    $currBan.find(".html1 .t4").css({
                        right: 0
                    })
                    $currBan.find(".html2 .line").css({
                        width: style2.width,
                        left: style2.left,
                        right: style2.right
                    })
                    $currBan.find(".html2 .t3").css({
                        left: 0
                    })
                    $currBan.find(".html2 .t4").css({
                        right: 0
                    })
                    $currBan.find(".html3 .line").css({
                        width: style3.width,
                        left: style3.left,
                        right: style3.right
                    })
                    $currBan.find(".html3 .t3").css({
                        left: 0
                    })
                    $currBan.find(".html3 .t4").css({
                        right: 0
                    })
                } else {
                    $currBan.html(html1)
                    $currBan.find(".totalLine").css("width", "100%")
                    var style1 = getStyleObj(2)
                    $currBan.find(".html1 .line").css({
                        width: style1.width,
                        left: style1.left,
                        right: style1.right
                    })
                    $currBan.find(".html1 .t3").css({
                        left: style1.left
                    })
                    $currBan.find(".html1 .t4").css({
                        right: style1.right
                    })
                }

                if (card[2] && card[3]) {
                    $currBan.find(".html2 .line").show()
                }
                if (card[4] && card[5]) {
                    $currBan.find(".html3 .line").show()
                }
                if (card[0] && card[1]) {
                    $currBan.find(".html1 .line").show()
                }

                if (attendanceState === localeResource.noResult) {
                    $currBan.find(".t3,.t4").html("").css({
                        padding: 0
                    })
                }
            }
        },
        error: function (res) {}
    })

    return page.otDateChange && page.otDateChange(event)
}
_this.timeChange = function (event,OtIndex) {
    if(OtIndex == null){
        OtIndex = 0;
    }
    $("#otDateError").remove();
    $("#timeError").remove();
    var start = $("#startTime" + OtIndex +" input").val();
    var end = $("#endTime" + OtIndex +" input").val();


    //开始、结束时间发生变化时，先清空请假、休息时长。
    _private.overTime = 0
    _private.restTime = 0

    if (start != undefined && end != undefined) {
        startTime = start.replace(/-/g, "/")
        endTime = end.replace(/-/g, "/")
    }
    var overTime = 0
    var startDate = undefined,
        endDate = undefined
    if (
        start != undefined &&
        start != null &&
        start != "" &&
        end != undefined &&
        end != null &&
        end != ""
    ) {
        startDate = new Date(Date.parse(startTime))
        endDate = new Date(Date.parse(endTime))
        overTime =
            parseFloat(endDate.getTime() - startDate.getTime()) / 1000.0 / 60 / 60
        if (overTime <= 0) {
            $("#restTime" + OtIndex + " input").val(0)
            $("#overTime" + OtIndex + " input").val(0)
            _private.submitButtonState()
        }
    }
    var params = []
    var param = {}
    param.tDay = _private.otDate
    param.realStartTime = start + ":00"
    param.realEndTime = end + ":00"
    if (
        _private.otDate != undefined &&
        _private.otDate != null &&
        _private.otDate != "" &&
        overTime > 0
    ) {
        var otDateValidate = true
        var oT = _private.otDate.replace(/-/g, "/")
        var oS = start.substring(0, 10).replace(/-/g, "/")
        var oE = end.substring(0, 10).replace(/-/g, "/")

        var oTdate = new Date(oT)
        var oSdate = new Date(oS)
        var oEdate = new Date(oE)
        var timesAfter = (oEdate.getTime() - oTdate.getTime()) / 1000.0 / 60 / 60
        if (Math.abs(timesAfter) > 24) {
            otDateValidate = false
            // var otDateError = "<text id='otDateError'>不支持跨多天加班！</text>";
            // $('#startTime .col-xs-4').after(otDateError);
            mbos.msgBox.showError(localeResource.OTnote1)
            return ;
        }
        var timesBefore = (oSdate.getTime() - oTdate.getTime()) / 1000.0 / 60 / 60
        if (Math.abs(timesBefore) > 24) {
            $("#otDateError").remove()
            otDateValidate = false
            // var otDateError = "<text id='otDateError'>不支持跨多天加班！</text>";
            // $('#startTime .col-xs-4').after(otDateError);
            mbos.msgBox.showError(localeResource.OTnote1)
            return ;
        }
        var timesAll = (oSdate.getTime() - oEdate.getTime()) / 1000.0 / 60 / 60
        if (Math.abs(timesAll) > 24) {
            $("#otDateError").remove()
            otDateValidate = false
            // var otDateError = "<text id='otDateError'>不支持跨多天加班！</text>";
            // $('#startTime .col-xs-4').after(otDateError);
            mbos.msgBox.showError(localeResource.OTnote1)
            return ;
        }

        params[0] = param
        var success = function (res) {
            var data
            if (res && res.decimalPlaces) {
                _private.decimalPlaces = res.decimalPlaces
                data = res.restTime
            } else {
                data = res
            }
            _private.restTime = Math.round(data)
            if (_private.restTime < 0) {
                _private.restTime = 0
            }
            _private.overTime = (
                overTime -
                parseFloat(_private.restTime) / 60
            ).toFixed(_private.decimalPlaces)
            $("#restTime" + OtIndex + " input").val(_private.restTime)
            mbos("restTime" + OtIndex).value(_private.restTime) // 也要给mbos赋值
            $("#overTime" + OtIndex + " input").val(_private.overTime)
            _private.submitButtonState()
        }
        var fail = function (data) {
            _private.submitButtonState()
            var detail = data.detail
            if (detail != null && detail != "") {
                mbos.msgBox.showError(detail)
            } else {
                mbos.msgBox.showError(localeResource.OTnote2)
            }
        }
        if (otDateValidate && _private.atsParams) {
            //mbos.eas.invokeScript("getOverTimeRestTime_new", params, success, fail);
            mbos.eas.invokeScript("getOverTimeRestTime", params, success, fail)
        } else {
            _private.submitButtonState()
        }
    }
    _private.startTime = $("#startTime" + OtIndex +" input").val();
    _private.endTime = $("#endTime" + OtIndex +" input").val();
    return page.timeChange && page.timeChange(event)
}
_this.appleOTTime = function (event) {
    if (event != null && event != NaN) {
        _private.overTime = event.new_value
        mbos.$model("entity").data.applyOTTime = _private.overTime
    }
}
_this.otTypeChange = function (event) {
    _private.otType = {
        id: event.new_value.id,
        name: event.new_value.name
    }
    _private.otTypeId = _private.otType.id

    if (
        _private.otType.id == _private._ATS_OVERTIME_LEGALHOLIDAYDAY_OVERTIME_ID &&
        _private.hasOverTime == true
    ) {
        mbos.$model("entity").data.otCompens = {
            id: _private._ATS_OVERTIMECOMPENS_OVERTIME_ID,
            name: _private._ATS_OVERTIMECOMPENS_OVERTIME_NAME
        }
        _private.otCompensId = _private._ATS_OVERTIMECOMPENS_OVERTIME_ID
    } else {
        mbos.$model("entity").data.otCompens = {
            id: _private._ATS_OVERTIMECOMPENS_DEFAULT_ID,
            name: _private._ATS_OVERTIMECOMPENS_DEFAULT_NAME
        }
        _private.otCompensId = _private._ATS_OVERTIMECOMPENS_DEFAULT_ID
    }
    _private.submitButtonState()
    return page.otTypeChange && page.otTypeChange(event)
}
_this.otReasonChange = function (event) {
    _private.otReason = {
        id: event.new_value.id,
        name: event.new_value.name
    }
    _private.otReasonId = _private.otReason.id
    _private.submitButtonState()
    return page.otReasonChange && page.otReasonChange(event)
}
_this.otCompensChange = function (event) {
    _private.otCompens = {
        id: event.new_value.id,
        name: event.new_value.name
    }
    _private.otCompensId = _private.otCompens.id
    _private.submitButtonState()
    return page.otCompensChange && page.otCompensChange(event)
}
_private.checkEntry = function (params) {
    for (var i = 0; i < params.length; i++) {
        var entry = params[i]
        if (entry.id == null || entry.id.length == 0) {
            return localeResource.OTnote3
        }
        if (entry.otDate == null || entry.id.otDate == 0) {
            return localeResource.OTnote4
        }
        if (entry.realStartTime == null || entry.id.realStartTime == 0) {
            return localeResource.OTnote5
        }
        if (entry.realEndTime == null || entry.id.realEndTime == 0) {
            return localeResource.OTnote6
        }
        if (entry.realStartTime == entry.realEndTime) {
            return localeResource.OTnote7
        }
        if (entry.applyOTTime == null || entry.id.applyOTTime == 0) {
            return localeResource.OTnote8
        }
        if (entry.restTime == null || entry.id.restTime == 0) {
            return localeResource.OTnote9
        }
        if (entry.otType == null || entry.id.otType == 0) {
            return localeResource.OTnote10
        }
        if (entry.otReason == null || entry.id.otReason == 0) {
            return localeResource.OTnote11
        }
        if (entry.otCompens == null || entry.id.otCompens == 0) {
            return localeResource.OTnote12
        }
        if (params.length > 1) {
            //校验分录时间交叉
            for (var k = i + 1; k < params.length; k++) {
                var b1 = new Date(params[i].realStartTime.replace(/-/g, "/"))
                var e1 = new Date(params[i].realEndTime.replace(/-/g, "/"))
                var b2 = new Date(params[k].realStartTime.replace(/-/g, "/"))
                var e2 = new Date(params[k].realEndTime.replace(/-/g, "/"))
                if (!(b1.getTime() >= e2.getTime() || e1.getTime() <= b2.getTime())) {
                    return localeResource.OTnote13
                }
            }
        }
        return ""
    }
}
