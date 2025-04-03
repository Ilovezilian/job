_private.entryIndex = 0;
_private.billNumber = '';
_private.getQueryString = function (url) {
    if (url) {
        url = url.substr(url.indexOf("?") + 1);
    }
    var result = {}, //创建一个对象，用于存name，和value
        queryString = url || location.search.substring(1), //location.search设置或返回从问号 (?) 开始的 URL（查询部分）。
        re = /([^&=]+)=([^&]*)/g, //正则，具体不会用
        m;
    while (m == re.exec(queryString)) {
        //exec()正则表达式的匹配，具体不会用
        result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]); //使用 decodeURIComponent() 对编码后的 URI 进行解码
    }
    return result;
};
_private.initializeData = function () {
    // 隐藏云之家右上角菜单
    setTimeout(function () {
        XuntongJSBridge.call("closePop");
    }, 1000);
    _private.appid = mbos.getRequestParams().appid;
    _private.eid = mbos.getRequestParams().eid;
    _private.path = mbos.getRequestParams().path;
    _private.hostname = window.location.origin;
    _private.storeEid = mbos.getRequestParams().storeEid;
    _private.abnormalId = mbos.getRequestParams().abnormalId;
    // alert(easContext['position'].adminOrgUnit.longNumber)
    /*//抄送人过滤
     mbos('ccPerson').attr(
         'dynamicFilter',
         "(adminOrgUnit.longNumber = '" +
             easContext['position'].adminOrgUnit.longNumber +
             "' or adminOrgUnit.longNumber like '" +
             easContext['position'].adminOrgUnit.longNumber +
             "!%') and id <> '" +
             easContext['person'].id +
             "'"
     )*/

};
//对于有些事件必须存在默认实现的
_private.registerDefaultEvent = function (eventName, handlerName) {
    mbos.$eventbus.bindDefault("page", eventName, handlerName);
};

_private.extendIncludeEntry = function (dst) {
    angular.forEach(arguments, function (obj) {
        if (obj !== dst) {
            angular.forEach(obj, function (value, key) {
                if ($.isArray(value) && value.length == 1) {
                    if ($.isArray(dst[key]) && dst[key].length == 1)
                        angular.extend(dst[key][0], value[0]);
                    else {
                        //NEW
                        dst[key] = [];
                        dst[key][0] = {};
                        angular.extend(dst[key][0], value[0]);
                    }
                } else {
                    dst[key] = value;
                }
            });
        }
    });
    return dst;
};
var reasons = [
    {
        name: "YJ补卡",
    },
];
// 假勤在办——mbos.getRequestParams().stat === "view"时 不允许修改
_private.ifDisabled = function() {
    if (mbos.getRequestParams().stat === "view") {
        $('#htmlMask').show() //遮罩
        setTimeout(function(){
            $(".deleteAttach").css('display', 'none'); //隐藏附件删除标签
        }, 200)
        $("#addattachnulll").hide(); //隐藏附件新增标签
        $('.addattach').css('z-index', '1000') // 可点击
    } else {
        $('#htmlMask').hide()
    }
}
_self.pageinit = function () {
    mbos("id").hide();
    $("#label1,#label2,#label3,#attendDate,#panel1,#panel2").hide();
    var lastPage = _private.getQueryString(document.referrer);
    if (
        mbos.getRequestParams().path != lastPage.path ||
        mbos.getRequestParams().name != lastPage.name
    ) {
        mbos.getRequestParams().origUrl = document.referrer;
    }
    //绑定默认的事件实现
    // _private.registerDefaultEvent("onCreateData","createData");
    // _private.registerDefaultEvent("onCreateDetailData","createDetailData");
    _private.registerDefaultEvent("onStateChange", "stateChange");
    //兼容外部传入界面状态
    mbos.getRequestParams().operateState = "ADDNEW";
    page.setOperateState(mbos.getRequestParams().operateState);
    mbos.$eventbus.fire("page", "afterRendered");
    if (mbos.getRequestParams().operateState === "ADDNEW") {
        //初始化数据
        _private.initializeData();
        //设置补签单主表的bosType
        page.getEditData().bosType = "7C6716EA";
        page.createData();
        //添加补卡说明textarea
        var textareaStr =
            "<div class='form-group'><textarea class='form-control' rows='3'  id='fillcardRemark' placeholder='请输入说明（最多255字）' maxlength='255'></textarea></div>";
        $("#panel1").append(textareaStr);
        //调用OSF获取补卡原因，添加补卡原因下拉框
        // _private.getFillSignCardReason();
        //添加提交请假单按钮
        var submitBtn =
            "<div style='width:100%;height:100%;text-align:center;'><button type='button' class='btn btn-primary btn-color' id='submit' disabled='disabled'>" +
            localeResource.submit +
            "</button></div>";
        $("#panel3").append(submitBtn);
        //获取考勤参数
        _private.atsParams = _private.getAtsParams();
    }
    //添加“我要申请”“已申请”按钮
    var footer =
        "<div id='page_bottom' class='page-bottom headroom-bottom ng-scope'>";

    footer +=
        "<div class='bottom-bar'><div class='button blue' style='float:left;width:50%' id='btnBillForm'>";
    footer += "<i class=''></i>&nbsp;<span class='f16'>我要申请</span></div>";
    footer +=
        "<div class='button' style='float:left;width:50%' id='btnBillList'>";
    footer += "<i class=''></i>&nbsp;<span class='f16'>已申请</span></div></div>";

    $(".tabs").delegate(".tab", "click", function () {
        $(".activeTab").removeClass("activeTab");
        $(this).addClass("activeTab");
        if (
            $(this).html() === "单天补卡" ||
            $(this).html() === localeResource.fillType1
        ) {
            $(".types").hide();
            $(".exceptionDays").show();
            if ($("#htmlContent2").data("hasData") === "false") {
                $("#htmlContent2").hide();
            } else {
                $("#htmlContent2").show();
            }
            $("#htmlContent3").show();
            $("#htmlContent4").hide();
            $("#htmlContent5").hide();
            $("#MainPage").css("paddingTop", "88px");
            getAtsExceptionInMonth();
        } else if (
            $(this).html() === "批量补卡" ||
            $(this).html() === localeResource.fillType2
        ) {
            $(".exceptionDays").hide();
            $(".types").show();
            $("#htmlContent2").hide();
            $("#htmlContent5").hide();
            $("#htmlContent4").show();
            $("#htmlContent3").hide();
            $("#MainPage").css("paddingTop", "88px");
            fillSignCard("inSevenDays");
        } else {
            $(".exceptionDays").hide();
            $(".types").hide();
            $("#htmlContent2").hide();
            $("#htmlContent3").hide();
            $("#htmlContent5").show();
            $("#htmlContent4").hide();
            if (
                mbos.getRequestParams().param &&
                mbos.getRequestParams().stat === "view"
            ) {
                $("#MainPage").css("paddingTop", "0px");
            } else {
                $("#MainPage").css("paddingTop", "46px");
            }
            fillSignCard("inOneDay");
        }
    });
    if (mbos.getRequestParams().date) {
        _private.paramDate = mbos.getRequestParams().date;
    }
    if (mbos.getRequestParams().type) {
        var type = mbos.getRequestParams().type;
        if (type == "singlecard") {
            $(".tab").eq(0).trigger("click");
        } else if (type == "mulcard") {
            $(".tab").eq(1).trigger("click");
        } else if (type == "autocard") {
            $(".tab").eq(2).trigger("click");
        }
    }
    // 查看编辑
    if (mbos.getRequestParams().param || mbos.getRequestParams().billID) {
        if (mbos.getRequestParams().billID) {
            //流程助手打回修改
            var success = function (data) {
                if (JSON.stringify(data) !== "{}") {
                    _private.billNumber = data.number
                    var info = {
                        applyDate: data.applyDate && data.applyDate.substring(0, 10),
                        applyPersonId: data.proposer.id,
                        attendDate: data.entries[0].attendDate.substring(0, 10),
                        billId: data.id,
                        billType: "fillSignCard",
                        fillCardTimeStr:
                            data.entries[0].fillCardTimeStr + localeResource.fileNote7,
                        name: localeResource.fileNote8,
                        personId: data.entries[0].person.id,
                        reason: data.entries[0].reason.name,
                        remark: data.remark,
                        state: data.billState.alias,
                        ccPerson: data.ccPerson,
                    };
                    mbos("id").value(mbos.getRequestParams().billID);
                    if (data.ccPerson != null) {
                        mbos.eas.invokeScript("getData", [data.ccPerson], function (data) {
                            f7value = _private.getf7value(data);
                            //给多选f7初始化赋值
                            mbos("ccPerson").value(f7value);
                        });
                    }
                    mbos.getRequestParams().param = JSON.stringify(info);
                    initEditView();
                }
            };
            var fail = function (data) {
                mbos.msgBox.showError(localeResource.getFillFail);
            };
            mbos.eas.invokeScript(
                "getBillInfo",
                [mbos.getRequestParams().billID],
                success,
                fail
            );
        } else {
            initEditView(); //s-hr打回修改
        }
    }

    $("#btn-view").on("click", function () {
        _private.getExplain(0);
    });

    $("#btnBillList").click(function () {
        var appid = _private.appid;
        var eid = _private.eid;
        var hostname = _private.hostname;
        var path = _private.path;
        var storeEid = _private.storeEid;
        mbos.ui.open({
            path: "mysignRecord",
            name: "fillSignCardList.listui",
            params: {},
        });
    });
    $("#btnBillForm").click(function () {
        var appid = _private.appid;
        var eid = _private.eid;
        var hostname = _private.hostname;
        var path = _private.path;
        var storeEid = _private.storeEid;
        mbos.ui.open({
            path: "mysignRecord",
            name: "fillSignCard.editui",
            params: {
                operateState: "ADDNEW",
            },
        });
    });
    $("#submit").click(function () {
        var dataa = mbos.getRequestParams().param
            ? JSON.parse(mbos.getRequestParams().param)
            : {};
        if (
            mbos.getRequestParams().param &&
            (dataa.state === "未审批" || dataa.state == "SUBMITED")
        ) {
            // 单据撤回
            mbos.eas.invokeScript({
                name: "billWithDraw",
                param: [
                    {
                        billId: dataa.billId,
                        billType: "fillSignCard",
                    },
                ],
                success: function (resp) {
                    if (resp.isSuccess) {
                        $("#htmlContent7").hide();
                        mbos.msgBox.showInfo(localeResource.withdrawSuccess, function () {
                            sessionStorage.setItem("ttqingBillType", "fillSignCard");
                            window.location.href =
                                "/mbos/page/loadPage?storeEid=" +
                                _private.storeEid +
                                "&appid=" +
                                _private.appid +
                                "&eid=" +
                                _private.eid +
                                "&path=ttqin8612&name=route.custom#/cD";
                        });
                    } else {
                        mbos.msgBox.showError(resp.msg);
                    }
                },
                error: function (err) {
                    console.log(err);
                },
            });
        } else {
            var param = [];
            var params = {};
            if ($(".activeTab").text() === localeResource.fillType1) {
                var dom1 = [].slice.call($(".single_card"));
                var len1 = dom1.length;
                dom1.forEach(function (item) {
                    param.push({
                        filecardTimeString: $(item).find("span[class^=single_time]").text(),
                        fillcardReason: $(item).find("span[class^=reason]").text(),
                        fillcardRemark: $(item).find("textarea").val(),
                    });
                });
            } else if ($(".activeTab").text() === localeResource.fillType2) {
                var dom2 = [].slice.call($("span[class^=mul_time]"));
                var len2 = dom2.length;
                dom2.forEach(function (item) {
                    param.push({
                        filecardTimeString: $(item).text(),
                        fillcardReason: $(".mul_reason").text(),
                        fillcardRemark: $(".mul_remark").find("textarea").val(),
                    });
                });
            } else {
                //限制，自定义补卡
                var dom3 = [].slice.call($("#htmlContent5 .auto_card"));
                var len3 = dom3.length;
                dom3.forEach(function (item) {
                    param.push({
                        filecardTimeString: $(item).find("span[class^=auto_time]").text(),
                        fillcardReason: $(item).find("span[class^=auto_reason]").text(),
                        fillcardRemark: $(item).find("textarea").val(),
                    });
                });
            }
            if (param.length === 0) {
                mbos.msgBox.showError(localeResource.card_info);
                return false;
            }
            var flag1 = param.every(function (item) {
                return item.filecardTimeString;
            });
            console.log(param, "测试1");
            var flag2 = param.every(function (item) {
                return item.fillcardReason;
            });
            console.log(flag2, "测试");
            if (flag1 === false) {
                mbos.msgBox.showError(localeResource.choice_time_of_card);
                return false;
            }
            if (
                flag2 === false &&
                $(".activeTab").text() !== localeResource.fillType2
            ) {
                mbos.msgBox.showError(localeResource.choice_reason_for_card);
                return false;
            }
            var a = [],
                isRepeat = false;
            param.forEach(function (item) {
                if (a.indexOf(item.filecardTimeString) === -1) {
                    a.push(item.filecardTimeString);
                } else {
                    mbos.msgBox.showError(
                        localeResource.fileNote4 +
                        item.filecardTimeString +
                        localeResource.fileNote5
                    );
                    isRepeat = true;
                }
            });
            if (!isRepeat) {
                mbos.eas.invokeScript({
                    name: "billAttendanceCheck",
                    param: [
                        {
                            billType: "fillSignCard",
                            beginDate:
                                param[param.length - 1].filecardTimeString.split(" ")[0],
                            endDate: param[0].filecardTimeString.split(" ")[0],
                        },
                    ],
                    success: function (resp) {
                        if (!resp.returnResult) {
                            mbos.msgBox.showError(resp.returnMsg, function () {
                                _private.checkDataBeforeSubmit(param);
                            });
                        } else {
                            _private.checkDataBeforeSubmit(param);
                        }
                    },
                    error: function (err) {
                        console.log(err);
                    },
                });
            }
        }
    });
    var signDate = mbos.getRequestParams().signDate;
    if (signDate != "" && signDate != undefined) {
        mbos("attendDate").value(signDate);
        _private.checkFieldEmpty();
    } else {
        var nowDate = new Date();
        var year = nowDate.getFullYear();
        var month = nowDate.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        var date = nowDate.getDate();
        date = date < 10 ? "0" + date : date;
        var hh = nowDate.getHours();
        var mm = nowDate.getMinutes();
        hh = hh < 10 ? "0" + hh : hh;
        mm = mm < 10 ? "0" + mm : mm;
        var nowDateStr = year + "-" + month + "-" + date + " " + hh + ":" + mm;
        mbos("attendDate").value(nowDateStr);
        _private.checkFieldEmpty();
    }
    _private.extendIncludeEntry(initvalueMap, hideInitValue);

    if ($(".activeTab").html() === localeResource.fillType1) {
        getAtsExceptionInMonth();
    }

    function getAtsExceptionInMonth() {
        mbos.eas.invokeScript({
            name: "getAtsExceptionInMonth",
            param: [
                {
                    personId: "",
                },
            ],
            success: function (resp) {
                if (resp.length == 0) {
                    $("#htmlContent2").hide();
                    $("#htmlContent2").data("hasData", "false");
                }
                var str = "";
                resp.forEach(function (item) {
                    str +=
                        "<span class='day' data-date=" +
                        item.exceptionDateStr +
                        ">" +
                        item.exceptionDate +
                        "</span>";
                });

                $(".exceptionDays").html(str);
                var firstDay;
                if (_private.paramDate) {
                    $(".exceptionDays .day").each(function (index, ele) {
                        if ($(ele).data("date") == _private.paramDate) {
                            $(ele).addClass("activeDate");
                        }
                    });
                    $(".info_date").text(_private.paramDate);
                } else {
                    firstDay = $(".exceptionDays .day").first();
                    if (firstDay.length > 0) {
                        firstDay.addClass("activeDate");
                        if (!mbos.getRequestParams().billID) {
                            _private.paramDate = firstDay.data("date");
                        }

                        $(".info_date").text(firstDay.data("date"));
                    } else {
                        var date =
                            new Date().getFullYear() +
                            "-" +
                            (new Date().getMonth() + 1 > 9
                                ? new Date().getMonth() + 1
                                : "0" + (new Date().getMonth() + 1)) +
                            "-" +
                            (new Date().getDate() > 9
                                ? new Date().getDate()
                                : "0" + new Date().getDate());
                        _private.paramDate = date;
                        $(".info_date").text(date);
                        if (!$(".single_time0").text()) {
                            $(".single_time0").text(date + " 00:00");
                        }
                    }
                }
                // getDayAttendance(firstDay.data('date'));

                fillSignCard("inOneDay");
            },
            error: function (err) {},
        });
    }

    function initEditView() {
        var dataa = JSON.parse(mbos.getRequestParams().param);
        if (mbos.getRequestParams().stat === "view") {
            $("#htmlContent1").hide();
            $("#MainPage").css({
                padding: "0",
            });
            $(".auto_add").hide();
            $("#htmlContent7").show();
            if (dataa.state === "未审批" || dataa.state == "SUBMITED") {
                $("#submit").text(localeResource.withdraw);
                $("#submit").show();
            } else {
                $("#submit").hide();
                mbos.eas.invokeScript({
                    name: "getApproveHistory",
                    param: [{ billId: dataa.billId.replace(/ /g, "+") }],
                    success: function (resp) {
                        if (resp.length > 0) {
                            var str = "";
                            resp.forEach(function (item) {
                                str +=
                                    '<li class="pItem"><span class="s0"></span><span class="s1">' +
                                    item["multiapprove.ispass"].alias +
                                    '</span><span class="s3">' +
                                    item["personid.name"] +
                                    '</span><span class="s4">' +
                                    item["multiapprove.createtime"] +
                                    "</span></li>";
                            });
                            $(".process").html(str).show();
                        }
                    },
                    error: function (err) {},
                });
            }
        } else {
            $("#submit").show();
            $(".auto_add").show();
            $("#htmlContent7").hide();
            fillSignCard("inOneDay");
        }

        $(".tab").last().trigger("click");
        $("#htmlContent2").hide();

        mbos.eas.invokeScript({
            name: "fillSignCardDetail",
            param: [
                {
                    billId: JSON.parse(mbos.getRequestParams().param).billId.replace(
                        / /g,
                        "+"
                    ),
                },
            ],
            success: function (resp) {
                var len = resp.length;
                console.log(resp, "resp");
                var str = "";
                for (var x = 0; x < len; x++) {
                    str +=
                        "<div class=auto_card>" +
                        "<div class=item><span class=txt>" +
                        localeResource.fillTime +
                        "</span><span class=right_arrow>&gt;</span><span class=auto_time" +
                        x +
                        " data-options={'type':'YYYY-MM-DD_hh:mm','beginyear':2010,'endyear':2088}></span></div>" +
                        "<div class=item><span class=txt>" +
                        localeResource.fillReason +
                        "</span><span class=right_arrow>&gt;</span><span class=auto_reason" +
                        x +
                        ">" +
                        resp[x].reason +
                        "</span></div>" +
                        "<div class='item area'><span>" +
                        localeResource.note +
                        "</span><textarea class=textarea" +
                        x +
                        "></textarea></div><div class=auto_del>" +
                        localeResource.del +
                        "</div>" +
                        "</div>";
                }
                $("div[class^=single_card]").remove();
                $(".auto_card").remove();
                $(".auto_add").before(str);
                var dates = [].slice.call($("span[class^=auto_time]"));
                dates.forEach(function (item, index) {
                    $("." + item.className).html(resp[index].fillCardTime.slice(0, -3));
                    $(".textarea" + index).html(
                        resp[index].remark || localeResource.nothing
                    );
                    // $.date('.' + item.className, '', resp[index].fillCardTime.slice(0, -3));
                    new DateTimePicker(
                        "." + item.className,
                        { format: "yyyy-MM-dd hh:mm", showFormat: "yyyy-MM-dd hh:mm" },
                        resp[index].fillCardTime.slice(0, -3)
                    );
                });
                _private.paramDate = resp[0].fillCardTime.slice(0, 10);
            },
            error: function (err) {
                console.log(err);
            },
        });
    }
    function fillSignCard(type) {
        if (
            mbos.getRequestParams().param &&
            mbos.getRequestParams().stat == "view"
        ) {
            return;
        }
        var date = _private.paramDate,
            param = "param1";
        var param1 = [
            {
                personId: "u5x8JzsXT2q0dN26ARw/L4Dvfe0=",
                type: type,
                beginDate: date,
                endDate: date,
                lang : easContext.locale
            },
        ];
        var param2 = [
            {
                personId: "u5x8JzsXT2q0dN26ARw/L4Dvfe0=",
                type: type,
                lang : easContext.locale
            },
        ];
        if (type === "inOneDay") {
            var param = param1;
        } else {
            var param = param2;
        }
        mbos.eas.invokeScript({
            name: "fillSignCard",
            param: param,
            success: function (resp) {
                resp.fillSignCardList.sort(function (a, b) {
                    return a.date < b.date ? 1 : -1;
                });
                var options = resp.fillSignReasonList,
                    str = "";
                var reasons = resp.fillSignReasonList;
                reasons.forEach(function (item) {
                    str +=
                        "<span class=item fillSignReasonId = " +
                        item.fillSignReasonId +
                        ">" +
                        item.fillSignReasonName +
                        "</span>";
                });
                if (resp.fillSignCardList.length === 0) {
                    $("#htmlContent4").hide();
                } else {
                    $("#htmlContent4").show();
                }
                $(".list").html(str);
                $("#htmlContent4").html("");
                // 批量补卡
                // if(!resp.fillSignCardList.length){
                //   return false;
                // }
                $("#htmlContent5 .auto_reason0").text(reasons[0].fillSignReasonName);
                if (type && type !== "inOneDay") {
                    var len = resp.fillSignCardList.length;
                    // var tmp = document.querySelector('.mul_card').outerHTML;
                    // var tmp="<div class='mul_card'>";
                    var html = $("#htmlContent4").html();
                    // 记录listShift，用于区分几段班
                    var arr = [];
                    var originalDates = [];
                    var l = [],
                        c = [];
                    for (var i = 0; i < len; i++) {
                        // 考勤结果
                        var list = resp.fillSignCardList[i].listShift || [];
                        var card = resp.fillSignCardList[i].fetchCardList || [
                            "",
                            "",
                            "",
                            "",
                            "",
                            "",
                        ];
                        l.push(list);
                        c.push(card);
                        html +=
                            "<div class='attendance'><div class='info'><div class='info_date'>" +
                            resp.fillSignCardList[i].date +
                            "</div><div class='status'>" +
                            resp.fillSignCardList[i].attendanceState +
                            "</div></div><div class='ban' style='display: flex;display: -webkit-flex;'>";
                        var html1 =
                            "<div class='totalLine" +
                            i +
                            " html1'><div class='line'></div><span class='time1'>" +
                            list[0] +
                            "</span><span class='time2'>" +
                            list[1] +
                            "</span><span class='time3'>" +
                            (card[0] || localeResource.noFill) +
                            "</span><span class='time4'>" +
                            (card[1] || localeResource.noFill) +
                            "</span></div>";
                        var html2 =
                            html1 +
                            "<div class='totalLine" +
                            i +
                            " html2'><div class='line'></div><span class='time1'>" +
                            list[2] +
                            "</span><span class='time2'>" +
                            list[3] +
                            "</span><span class='time3'>" +
                            (card[2] || localeResource.noFill) +
                            "</span><span class='time4'>" +
                            (card[3] || localeResource.noFill) +
                            "</span></div>";
                        var html3 =
                            html2 +
                            "<div class='totalLine" +
                            i +
                            " html3'><div class='line'></div><span class='time1'>" +
                            list[4] +
                            "</span><span class='time2'>" +
                            list[5] +
                            "</span><span class='time3'>" +
                            (card[4] || localeResource.noFill) +
                            "</span><span class='time4'>" +
                            (card[5] || localeResource.noFill) +
                            "</span></div>";
                        if (list.length === 4) {
                            html += html2;
                            arr.push(4);
                        } else if (list.length === 6) {
                            html += html3;
                            arr.push(6);
                        } else {
                            html += html1;
                            arr.push(2);
                        }
                        html += "</div></div>";
                        html += "<div class='mul_card'>";
                        var dateLen = resp.fillSignCardList[i].needDateList.length;
                        var dateTmp = "";
                        for (var j = 0; j < dateLen; j++) {
                            dateTmp +=
                                "<div class='item'><span class='txt'>" +
                                localeResource.fillTime +
                                "</span><span class='del'>" +
                                localeResource.del +
                                "</span><span class='split'></span><span class='right_arrow'>></span><span class=mul_time" +
                                i +
                                "_" +
                                j +
                                " data-options={'type':'YYYY-MM-DD_hh:mm','beginyear':2010,'endyear':2088}></span></div>";
                            originalDates.push(resp.fillSignCardList[i].needDateList[j]);
                        }
                        html += dateTmp;
                        html +=
                            "<div class='mul_del'>" +
                            localeResource.moveToday +
                            "</div><div class='mul_add'>" +
                            localeResource.addFill +
                            "</div></div>";
                    }
                    html +=
                        '<div class="mul_item"><span class="txt">' +
                        localeResource.fillReason +
                        '</span><span class="right_arrow">&gt;</span><span class="mul_reason">' +
                        reasons[0].fillSignReasonName +
                        "</span></div>";
                    $("#htmlContent4").append(html);
                    // 2019.11.25  evan_feng  批量补卡新增备注字段
                    $("#htmlContent4").append(
                        '<div class="mul_remark"><p>' +
                        localeResource.note +
                        "：</p><textarea placeholder=" +
                        localeResource.noteDetail +
                        ' maxlength="255"></textarea></div>'
                    );
                    $(".mul_reason").on("click", function () {
                        console.log($(".drop_list")[0]);
                        reason = $(this);
                        $(".drop_list").show();
                    });

                    function computeStyle(a) {
                        var arr = a.split(":") || [0, 0];
                        return parseInt(arr[0], 10) * 60 + parseInt(arr[1], 10);
                    }

                    function getStyleObj(len, list, card) {
                        if (card.length && list.length) {
                            var totalListMinutes = Math.abs(computeStyle(list[len - 1]) - computeStyle(list[len - 2])); // 避免为负数
                            var totalCardMinutes =
                                card[len - 1] && card[len - 2]
                                    ? computeStyle(
                                    card[len - 1] >= list[len - 1]
                                        ? list[len - 1]
                                        : card[len - 1]
                                    ) -
                                    computeStyle(
                                        card[len - 2] >= list[len - 2]
                                            ? card[len - 2]
                                            : list[len - 2]
                                    )
                                    : 0;
                            var left = card[len - 2]
                                ? list[len - 2] >= card[len - 2]
                                    ? 0
                                    : ((computeStyle(card[len - 2]) -
                                    computeStyle(list[len - 2])) *
                                    100) /
                                    totalListMinutes +
                                    "%"
                                : 0;
                            var right = card[len - 1]
                                ? list[len - 1] <= card[len - 1]
                                    ? 0
                                    : ((computeStyle(list[len - 1]) -
                                    computeStyle(card[len - 1])) *
                                    100) /
                                    totalListMinutes +
                                    "%"
                                : 0;
                            return {
                                width: (totalCardMinutes * 100) / totalListMinutes + "%",
                                left: left,
                                right: right,
                            };
                        } else {
                            return {
                                width: 0,
                                left: 0,
                                right: 0,
                            };
                        }
                    }
                    arr.forEach(function (item, index) {
                        var $parent = $(".totalLine" + index);
                        if (item == "4") {
                            $parent.css("width", "48%");
                            var style1 = getStyleObj(2, l[index], c[index]);
                            var style2 = getStyleObj(4, l[index], c[index]);
                            $($parent.find($(".line"))[0]).css({
                                width: style1.width,
                                left: style1.left,
                                right: style1.right,
                            });
                            $parent.find($(".time3"))[0].style.left = style1.left;
                            $parent.find($(".time4"))[0].style.right = style1.right;
                            $($parent.find($(".line"))[1]).css({
                                width: style2.width,
                                left: style2.left,
                                right: style2.right,
                            });
                            $parent.find($(".time3"))[1].style.left = style2.left;
                            $parent.find($(".time4"))[1].style.right = style2.right;
                        } else if (item == "6") {
                            $parent.css("width", "31%");
                            var style1 = getStyleObj(2, l[index], c[index]);
                            var style2 = getStyleObj(4, l[index], c[index]);
                            var style3 = getStyleObj(6, l[index], c[index]);
                            $($parent.find($(".line"))[0]).css({
                                width: style1.width,
                                left: style1.left,
                                right: style1.right,
                            });
                            $parent.find($(".time3"))[0].style.left = 0;
                            $parent.find($(".time4"))[0].style.right = 0;
                            $($parent.find($(".line"))[1]).css({
                                width: style2.width,
                                left: style2.left,
                                right: style2.right,
                            });
                            $parent.find($(".time3"))[1].style.left = 0;
                            $parent.find($(".time4"))[1].style.right = 0;
                            $($parent.find($(".line"))[2]).css({
                                width: style3.width,
                                left: style3.left,
                                right: style3.right,
                            });
                            $parent.find($(".time3"))[2].style.left = 0;
                            $parent.find($(".time4"))[2].style.right = 0;
                        } else {
                            $(".totalLine" + index).css("width", "100%");
                            var style1 = getStyleObj(2, l[index], c[index]);
                            $($parent.find($(".line"))[0]).css({
                                width: style1.width,
                                left: style1.left,
                                right: style1.right,
                            });
                            $parent.find($(".time3"))[0].style.left = style1.left;
                            $parent.find($(".time4"))[0].style.right = style1.right;
                        }
                    });
                    var totalLineArr = [].slice.call($("div[class^=totalLine]"));
                    totalLineArr.forEach(function (item) {
                        // console.log(item)
                        if (
                            $(item).find($(".time3")).html() &&
                            $(item).find($(".time4")).html()
                        ) {
                            $(item).parent().find($(".line")).show();
                        }
                    });
                    var dates = [].slice.call($("span[class^=mul_time]"));
                    dates.forEach(function (item, index) {
                        $("." + item.className).html(originalDates[index]);
                        // $.date('.' + item.className, '', originalDates[index]);
                        new DateTimePicker(
                            "." + item.className,
                            { format: "yyyy-MM-dd hh:mm", showFormat: "yyyy-MM-dd hh:mm" },
                            originalDates[index]
                        );
                    });
                } else if (type === "inOneDay") {
                    if (!resp.fillSignCardList.length) {
                        $("#htmlContent2").data("hasData", "false");
                        if (mbos.getRequestParams().date) {
                            $("span.single_time0").text(
                                mbos.getRequestParams().date + " 00:00"
                            );
                            $(".single_card .reason0").text(
                                resp.fillSignReasonList[0].fillSignReasonName
                            );
                        }
                        return false;
                    }
                    $("#htmlContent2").data("hasData", "true");
                    $("#htmlContent2").show();
                    $(".info_date").html(date);
                    $(".status").html(resp.fillSignCardList[0].attendanceState);
                    $("div[class^=single_card]").remove();
                    var resp = resp;
                    var shiftName = resp.fillSignCardList[0].shiftName;
                    var attendanceState = resp.fillSignCardList[0].attendanceState;
                    var list = resp.fillSignCardList[0].listShift || [];
                    var card = resp.fillSignCardList[0].fetchCardList || [
                        "",
                        "",
                        "",
                        "",
                        "",
                        "",
                    ];

                    function computeStyle(a) {
                        var arr = a.split(":") || [0, 0];
                        return parseInt(arr[0], 10) * 60 + parseInt(arr[1], 10);
                    }

                    function getStyleObj(len) {
                        if (card.length && list.length) {
                            var totalListMinutes = Math.abs(computeStyle(list[len - 1]) - computeStyle(list[len - 2])); // 避免为负数
                            var totalCardMinutes =
                                card[len - 1] && card[len - 2]
                                    ? computeStyle(
                                    card[len - 1] >= list[len - 1]
                                        ? list[len - 1]
                                        : card[len - 1]
                                    ) -
                                    computeStyle(
                                        card[len - 2] >= list[len - 2]
                                            ? card[len - 2]
                                            : list[len - 2]
                                    )
                                    : 0;
                            var left = card[len - 2]
                                ? list[len - 2] >= card[len - 2]
                                    ? 0
                                    : ((computeStyle(card[len - 2]) -
                                    computeStyle(list[len - 2])) *
                                    100) /
                                    totalListMinutes +
                                    "%"
                                : 0;
                            var right = card[len - 1]
                                ? list[len - 1] <= card[len - 1]
                                    ? 0
                                    : ((computeStyle(list[len - 1]) -
                                    computeStyle(card[len - 1])) *
                                    100) /
                                    totalListMinutes +
                                    "%"
                                : 0;
                            return {
                                width: (totalCardMinutes * 100) / totalListMinutes + "%",
                                left: left,
                                right: right,
                            };
                        } else {
                            return {
                                width: 0,
                                left: 0,
                                right: 0,
                            };
                        }
                    }
                    var html1 =
                        "<div class='totalLine html1'><div class='line'></div><span class='time1'>" +
                        list[0] +
                        "</span><span class='time2'>" +
                        list[1] +
                        "</span><span class='time3'>" +
                        (card[0] || localeResource.noFill) +
                        "</span><span class='time4'>" +
                        (card[1] || localeResource.noFill) +
                        "</span></div>";
                    var html2 =
                        html1 +
                        "<div class='totalLine html2'><div class='line'></div><span class='time1'>" +
                        list[2] +
                        "</span><span class='time2'>" +
                        list[3] +
                        "</span><span class='time3'>" +
                        (card[2] || localeResource.noFill) +
                        "</span><span class='time4'>" +
                        (card[3] || localeResource.noFill) +
                        "</span></div>";
                    var html3 =
                        html2 +
                        "<div class='totalLine html3'><div class='line'></div><span class='time1'>" +
                        list[4] +
                        "</span><span class='time2'>" +
                        list[5] +
                        "</span><span class='time3'>" +
                        (card[4] || localeResource.noFill) +
                        "</span><span class='time4'>" +
                        (card[5] || localeResource.noFill) +
                        "</span></div>";
                    if (list.length === 4) {
                        $(".ban").html(html2);
                        $(".totalLine").css("width", "48%");
                        var style1 = getStyleObj(2);
                        var style2 = getStyleObj(4);
                        $(".html1 .line").css({
                            width: style1.width,
                            left: style1.left,
                            right: style1.right,
                        });
                        $(".html1 .time3").css({
                            left: style1.left,
                        });
                        $(".html1 .time4").css({
                            right: style1.right,
                        });
                        $(".html2 .line").css({
                            width: style2.width,
                            left: style2.left,
                            right: style2.right,
                        });
                        $(".html2 .time3").css({
                            left: style2.left,
                        });
                        $(".html2 .time4").css({
                            right: style2.right,
                        });
                    } else if (list.length === 6) {
                        $(".ban").html(html3);
                        $(".totalLine").css("width", "31%");
                        var style1 = getStyleObj(2);
                        var style2 = getStyleObj(4);
                        var style3 = getStyleObj(6);
                        $(".html1 .line").css({
                            width: style1.width,
                            left: style1.left,
                            right: style1.right,
                        });
                        $(".html1 .time3").css({
                            left: 0,
                        });
                        $(".html1 .time4").css({
                            right: 0,
                        });
                        $(".html2 .line").css({
                            width: style2.width,
                            left: style2.left,
                            right: style2.right,
                        });
                        $(".html2 .time3").css({
                            left: 0,
                        });
                        $(".html2 .time4").css({
                            right: 0,
                        });
                        $(".html3 .line").css({
                            width: style3.width,
                            left: style3.left,
                            right: style3.right,
                        });
                        $(".html3 .time3").css({
                            left: 0,
                        });
                        $(".html3 .time4").css({
                            right: 0,
                        });
                    } else {
                        $(".ban").html(html1);
                        $(".totalLine").css("width", "100%");
                        var style1 = getStyleObj(2);
                        $(".html1 .line").css({
                            width: style1.width,
                            left: style1.left,
                            right: style1.right,
                        });
                        $(".html1 .time3").css({
                            left: style1.left,
                        });
                        $(".html1 .time4").css({
                            right: style1.right,
                        });
                    }
                    $(".ban").css({
                        display: "flex",
                        // display: '-webkit-flex'
                    });
                    if (card[2] && card[3]) {
                        $(".html2 .line").show();
                    }
                    if (card[4] && card[5]) {
                        $(".html3 .line").show();
                    }
                    if (card[0] && card[1]) {
                        $(".html1 .line").show();
                    }
                    var len = resp.fillSignCardList[0].needDateList.length;
                    var str = "";
                    for (var x = 0; x < len; x++) {
                        str +=
                            "<div class=single_card>" +
                            "<div class=item><span class=txt>" +
                            localeResource.fillTime +
                            "</span><span class=right_arrow>&gt;</span><span class=single_time" +
                            x +
                            " data-options={'type':'YYYY-MM-DD_hh:mm','beginyear':2010,'endyear':2088}></span></div>" +
                            "<div class=item><span class=txt>" +
                            localeResource.fillReason +
                            "</span><span class=right_arrow>&gt;</span><span class=reason" +
                            x +
                            ">" +
                            reasons[0].fillSignReasonName +
                            "</span></div>" +
                            "<div class='item area'><span>" +
                            localeResource.note +
                            "</span><textarea class=textarea" +
                            x +
                            "></textarea></div><div class=single_del>" +
                            localeResource.del +
                            "</div>" +
                            "</div>";
                    }
                    $(".single_add").before(str);
                    var dates = [].slice.call($("span[class^=single_time]"));
                    dates.forEach(function (item, index) {
                        $("." + item.className).html(
                            resp.fillSignCardList[0].needDateList[index]
                        );
                        // $.date('.' + item.className, '', resp.fillSignCardList[0].needDateList[index]);
                        new DateTimePicker(
                            "." + item.className,
                            { format: "yyyy-MM-dd hh:mm", showFormat: "yyyy-MM-dd hh:mm" },
                            resp.fillSignCardList[0].needDateList[index],
                            function (date) {
                                console.log(
                                    1,
                                    resp.fillSignCardList[0].needDateList[index],
                                    date
                                );
                                var max_time =
                                    new Date(
                                        resp.fillSignCardList[0].needDateList[index]
                                            .substr(0, 10)
                                            .replace(/-/g, "/")
                                    ).getTime() +
                                    48 * 60 * 60 * 1000;
                                var min_time =
                                    new Date(
                                        resp.fillSignCardList[0].needDateList[index]
                                            .substr(0, 10)
                                            .replace(/-/g, "/")
                                    ).getTime() -
                                    24 * 60 * 60 * 1000;

                                var selectDate = new Date(date.replace(/-/g, "/")).getTime();
                                if (selectDate <= max_time && selectDate >= min_time) {
                                    return true;
                                } else {
                                    mbos.ui.showInfo({
                                        title: localeResource.fileNote6,
                                    });
                                    return false;
                                }
                            }
                        );
                    });
                }
                // 颜色
                var arr1 = [].slice.call($(".time3"));
                var arr2 = [].slice.call($(".time1"));
                arr1.forEach(function (item, i) {
                    if (
                        item.innerText !== localeResource.noFill &&
                        arr2[i].innerText !== localeResource.noFill &&
                        item.innerText <= arr2[i].innerText
                    ) {
                        $(item).css("background", "rgb(139, 210, 81)");
                    }
                });
                var arr3 = [].slice.call($(".time4"));
                var arr4 = [].slice.call($(".time2"));
                arr3.forEach(function (item, i) {
                    if (
                        item.innerText !== localeResource.noFill &&
                        arr2[i].innerText !== localeResource.noFill &&
                        item.innerText >= arr4[i].innerText
                    ) {
                        $(item).css("background", "rgb(139, 210, 81)");
                    }
                });
                if ($("#htmlContent4 .info_date")[0]) {
                    mbos.eas.invokeScript({
                        name: "fillSignCardReason",
                        param: [
                            {
                                fillCardDate:
                                    $(".activeDate").data().date ||
                                    $("#htmlContent4 .info_date")[0].innerText,
                            },
                        ],
                        success: function (resp) {
                            reasons = resp;
                        },
                        error: function (err) {
                            console.log(err);
                        },
                    });
                }
            },
            error: function (err) {
                console.log(err);
            },
        });
    }

    $(".exceptionDays").delegate("span", "click", function () {
        $(".activeDate").removeClass("activeDate");
        $(this).addClass("activeDate");
        _private.paramDate = $(this).data("date");
        // getDayAttendance($(this).data('date'));
        $(".info_date").text($(this).data("date"));
        fillSignCard("inOneDay");
    });
    $(".types").delegate("span", "click", function () {
        $(".activeDate").removeClass("activeDate");
        $(this).addClass("activeDate");
        fillSignCard($(this).data("val"));
        // getDayAttendance($(this).attr('attr-date'));
        // $('.info_date').text($(this).attr('attr-date'));
    });
    var single =
        document.querySelector(".single_card") &&
        document.querySelector(".single_card").outerHTML;
    var j = 0;
    $(".single_add").on("click", function () {
        j++;
        single = single
            .replace("single_time" + (j - 1), "single_time" + j)
            .replace("reason" + (j - 1), "reason" + j)
            .replace("textarea" + (j - 1), "textarea" + j);
        $(this).before(single);
        var today = $(".activeDate").data("date")
            ? $(".activeDate").data("date")
            : _private.paramDate + " 00:00";
        if(today.length == 10){
            today+=" 00:00";
        }
        $(".single_time" + j).text(today);
        // 补卡原因默认为忘记打卡
        var defaultReason = document.querySelector(".list").childNodes[0].innerText;
        $(".reason" + j).text(defaultReason);

        new DateTimePicker(
            ".single_time" + j,
            { format: "yyyy-MM-dd hh:mm", showFormat: "yyyy-MM-dd hh:mm" },
            today,
            function (date) {
                var max_time =
                    new Date(today.substr(0, 10).replace(/-/g, "/")).getTime() +
                    48 * 60 * 60 * 1000;
                var min_time =
                    new Date(today.substr(0, 10).replace(/-/g, "/")).getTime() -
                    24 * 60 * 60 * 1000;

                var selectDate = new Date(date.replace(/-/g, "/")).getTime();
                if (selectDate <= max_time && selectDate >= min_time) {
                    return true;
                } else {
                    mbos.ui.showInfo({
                        title: localeResource.fileNote6,
                    });
                    return false;
                }
            }
        );
        $(".single_add").prev().find(".self-desc-wrap").hide();
    });
    $("#htmlContent3").delegate(".single_del", "click", function () {
        $(this).parent().remove();
    });

    // var autoTmp ='<div class="auto_card"><div class="item"><span class="txt">补卡时间</span><span class="right_arrow">&gt;</span><span class="auto_time0" data-options="{"type":"YYYY-MM-DD_hh:mm","beginyear":2010,"endyear":2088}"></span>'+
    //     '</div><div class="item"><span class="txt">补卡原因</span><span class="right_arrow">&gt;</span><span class="auto_reason0"></span></div><div class="item area"><span>备注</span><textarea class="textarea"></textarea></div>'+
    //     '<div class="auto_del">删除</div></div>';
    var autoTmp = $(".auto_card")[0].outerHTML;
    var k = 0;
    $(".auto_add").on("click", function () {
        if (k === 0) {
            k = $(".auto_card").length;
        }
        $(this).before(
            autoTmp
                .replace("auto_time0", "auto_time" + k)
                .replace("reason0", "reason" + k)
                .replace("textarea0", "textarea" + k)
        );
        // $.date('.auto_time' + k);
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
            " 00:00";
        new DateTimePicker(
            ".auto_time" + k,
            { format: "yyyy-MM-dd hh:mm", showFormat: "yyyy-MM-dd hh:mm" },
            date
        );
        k++;
        $($(".auto_card")[$(".auto_card").length - 1])
            .find(".btn-view")
            .on("click", function () {
                var index = $(this)
                    .parents(".auto_card")
                    .find(".fillTime")
                    .next()
                    .next()
                    .attr("class")
                    .substring(9);
                _private.getExplain(index);
            });
    });
    $("#htmlContent5").delegate(".auto_del", "click", function () {
        $(this).parent().remove();
    });

    var mul =
        "<div class=item><span class=txt>" +
        localeResource.fillTime +
        "</span><span class=del>" +
        localeResource.del +
        "</span><span class=split></span><span class=right_arrow>&gt;</span><span class=mul_time0 data-options={'type':'YYYY-MM-DD_hh:mm','beginyear':2010,'endyear':2088}></span></div>";
    var k = 0,
        mul;
    $("#htmlContent4").delegate(".mul_add", "click", function () {
        k++;
        mul = mul.replace("mul_time" + (k - 1), "mul_time" + k);
        $(this).prev().before(mul);
        var current =
            $(this).parent().prev().find($(".info_date")).text() + " 00:00";
        // $.date('.mul_time' + k, '', current);
        new DateTimePicker(
            ".mul_time" + k,
            { format: "yyyy-MM-dd hh:mm", showFormat: "yyyy-MM-dd hh:mm" },
            current
        );
    });
    $("#htmlContent4").delegate(".mul_del", "click", function () {
        $(this).parent().prev().remove();
        $(this).parent().remove();
    });
    $("#htmlContent4").delegate(".del", "click", function () {
        $(this).parent().remove();
    });
    // 当前reason
    var reason = $(".reason0");
    $("#htmlContent3").delegate("span[class^=reason]", "click", function () {
        reason = $(this);
        $(".drop_list").show();
    });
    $("#htmlContent3").delegate("span[class^=auto_reason]", "click", function () {
        reason = $(this);
        $(".drop_list").show();
    });
    $("#htmlContent3").delegate(".auto_del", "click", function () {
        $(this).parent().remove();
    });
    $(".list").delegate("span", "click", function () {
        reason.text($(this).text());
        $(".drop_list").hide();
    });
    $("#htmlContent5").delegate("span[class^=auto_reason]", "click", function () {
        reason = $(this);
        $(".drop_list").show();
    });
    $(".drop_list").on("click", function () {
        $(this).hide();
    });
    setTimeout(function () {
        // $.date('.single_time0');
        new DateTimePicker(
            ".single_time0",
            { format: "yyyy-MM-dd hh:mm", showFormat: "yyyy-MM-dd hh:mm" },
            "",
            function (date, oldDate, initDate) {
                var max_time =
                    new Date(initDate.substr(0, 10).replace(/-/g, "/")).getTime() +
                    48 * 60 * 60 * 1000;
                var min_time =
                    new Date(initDate.substr(0, 10).replace(/-/g, "/")).getTime() -
                    24 * 60 * 60 * 1000;

                var selectDate = new Date(date.replace(/-/g, "/")).getTime();
                if (selectDate <= max_time && selectDate >= min_time) {
                    return true;
                } else {
                    mbos.ui.showInfo({
                        title: localeResource.fileNote6,
                    });
                    return false;
                }
            }
        );
        new DateTimePicker(".mul_time0", {
            format: "yyyy-MM-dd hh:mm",
            showFormat: "yyyy-MM-dd hh:mm",
        });

        var date =
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1
                : "0" + (new Date().getMonth() + 1)) +
            "-" +
            (new Date().getDate() > 9 ? new Date().getDate()
                : "0" + new Date().getDate()) +
            " 00:00";
        new DateTimePicker(
            ".auto_time0",
            { format: "yyyy-MM-dd hh:mm", showFormat: "yyyy-MM-dd hh:mm" },
            date,
            function (val) {
                mbos.eas.invokeScript({
                    name: "fillSignCardReason",
                    param: [
                        {
                            fillCardDate: val,
                        },
                    ],
                    success: function (resp) {
                        reasons = resp;
                        var str = "";
                        reasons.forEach(function (item) {
                            str += "<span class=item>" + item.name + "</span>";
                        });
                        $(".list").html(str);
                    },
                    error: function (err) {
                        console.log(err);
                    },
                });
            }
        );
    }, 1000);
    _private.ifDisabled()
    /*
  //数据源加载后
    mbos('entity').bind("afterLoad",function(){
      //获取分录
      // var entitys = mbos('entity').value().entrys;
      var f7value={};
      //遍历分录记录
      var remark=  mbos('entity').value().remark;
      // for(var i in entitys){

        //闭包问题，每条分录记录都要处理一条服务端函数
        // (function(n){
        //   if(remark){
           mbos.eas.invokeScript("getData",[remark],function(data){
                 f7value= _private.getf7value(data);
                //给多选f7初始化赋值
                 mbos('ccPerson',n).value(f7value);
              })
      // }
      //   })(i);
      // }
    });

    */
};
_private.getAtsParams = function () {
    var params = [];
    var param = {};
    params[0] = param;
    var success = function (data) {
        var errorMsg = data.errorMsg;
        if (errorMsg != undefined && errorMsg != null && errorMsg != "") {
            _private.atsParams = false;
            $("#submit").css("background-color", "#cccccc");
            $("#submit").css("border-color", "#cccccc");
            $("#submit").attr("disabled", "disabled");
            if (errorMsg == "fillAttendFileNote") {
                mbos.msgBox.showError(localeResource.fillAttendFileNote);
            } else if (errorMsg == "fillEffecAttendFileNote") {
                mbos.msgBox.showError(localeResource.fillEffecAttendFileNote);
            }
        } else {
            _private.atsParams = true;
        }
    };
    var fail = function (data) {
        _private.atsParams = false;
        mbos.msgBox.showError(localeResource.getLeaveRetirsError);
    };
    mbos.eas.invokeScript("getAtsParams", params, success, fail);
    return _private.atsParams;
};
//提交补签卡之前做校验
_private.checkDataBeforeSubmit = function (param) {
    if (mbos.getRequestParams().param) {
        var billData = JSON.parse(mbos.getRequestParams().param);
        $.each(param, function (index, item) {
            item.billId = billData.billId;
        });
    }
    // if(filecardTimeString == undefined || $.trim(filecardTimeString) == ""){
    //   mbos.msgBox.showError("补签时间不能为空！");
    //   return false;
    // }
    //增加审批人
    var dataSubmit = {};
    dataSubmit.bosType = "7C6716EA";
    var _fn = function () {
        // var fillCardDateTime = new Date(filecardTimeString);
        // var fillCardDateTime =  new Date(filecardTimeString.replace(/-/g, '/'))
        // if(fillCardDateTime.getTime()>new Date().getTime()){
        // mbos.msgBox.showError("不允许提前申请补签卡业务！");
        // return false;
        // }
        var success = function (data) {
            //mbos.msgBox.showInfo("OSF调用","OSF调用成功",function(){});
            //准备提交的补签卡单数据
            var fillSignCardInfo = _private.getSubmitData(data);
            fillSignCardInfo.id =
                mbos.getRequestParams().billID != null
                    ? mbos.getRequestParams().billID
                    : mbos("id").value();
            fillSignCardInfo.workflowNextPerson =
                mbos("entity").data.workflowNextPerson;
            if (_private.billNumber != "") {
                fillSignCardInfo.number = _private.billNumber
            }
            //调用bos提交接口
            mbos.post({
                url: "/mbos/editpage/submit",
                param: {
                    bostype: page.getEditData().bosType,
                    uiname: mbos.getRequestParams().name,
                    model: JSON.stringify(fillSignCardInfo),
                },
                success: function (data) {
                    if (_private.abnormalId != "" && _private.abnormalId != null) {
                        var param = [{ billId: _private.abnormalId }];
                        mbos.eas.invokeScript({
                            name: "changeAbnormalAttendBillState",
                            param: param,
                            success: function (resp) { },
                            error: function (res) { },
                        });
                    }
                    mbos.msgBox.showError(
                        localeResource.submitSuccess,
                        function () {
                            sessionStorage.setItem("ttqingBillType", "tripBill");
                            window.location.href =
                                "/mbos/page/loadPage?storeEid=" +
                                _private.storeEid +
                                "&appid=" +
                                _private.appid +
                                "&eid=" +
                                _private.eid +
                                "&path=ttqin8612&name=route.custom#/cD";
                        }
                    );
                },
                error: function (data) {
                    if (typeof data == "string") {
                        mbos.msgBox.showError("", data);
                    } else {
                        mbos.msgBox.showError(data);
                    }
                },
            });
        };
        var fail = function (data) {
            //解析出错误信息
            var msg = data.detail;
            var msgobj = msg.substring(msg.indexOf("=") + 1, msg.lastIndexOf("}"));
            mbos.msgBox.showError(msgobj);
        };
        mbos.eas.invokeScript("submitFillCardRecord", param, success, fail);
    };

    mbos("nextperson1").checkParticipantPerson({
        editdata: dataSubmit,
        callback: _fn,
    });
};
//补签卡说明
_private.getExplain = function (index) {
    var date = $(".auto_time" + index).text();
    if (date.length > 0) {
        var params = [];
        params[0] = {
            signCardDate: date,
        };
        var success = function (data) {
            if (data.signCardExplain != null && data.signCardExplain.length > 0) {
                mbos.msgBox.showError(data.signCardExplain);
            }
        };
        var fail = function (data) {
            mbos.msgBox.showError(data);
        };

        mbos.eas.invokeScript("getExplain", params, success, fail);
    } else {
        mbos.msgBox.showError(localeResource.fileNote2);
    }
};
_private.getSubmitData = function (data) {
    var fillSignCardInfo = data.fillSignCardInfo;
    var editData = page.getEditData();
    _private.attendDate = editData.attendDate;
    delete editData.attendDate;
    delete editData.id;
    delete editData.entries;
    //delete editData.bosType;
    var entryArray = fillSignCardInfo.entries;
    var entryInfo = entryArray[0];
    for (var x in editData) {
        entryInfo[x] = editData[x];
    }
    entryArray[0] = entryInfo;
    fillSignCardInfo.entries = entryArray;
    fillSignCardInfo.id = JSON.parse(
        mbos.getRequestParams().param || "{}"
    ).billId;
    if (mbos("ccPerson").value() != null) {
        fillSignCardInfo.ccPerson = mbos("ccPerson").value().id;
    }
    return fillSignCardInfo;
};

//生成补卡原因下拉列表
// _private.generateFillSignCardReasonList = function (data) {
//   var fillCardReason = data.fillCardReason;
//   var template = [];
//   template[0] = "<div class='input-group hundredWidth'><select class='leaveBill-form-control-select leaveBill-select' id='fillcardReason'>";
//   for (var i = 0; i < fillCardReason.length; i++) {
//     template[i + 1] = "<option value='" + fillCardReason[i] + "'>" + fillCardReason[i] + "</option>";
//   }
//   template[fillCardReason.length + 1] = "</select><i class='caret leaveBill-caret-type'></i></div>";
//   $("#panel2").append(template.join(''));
//   $('#fillcardReason').val(data.defaultFillCardTime);
//   //console.log(template.join(''));
// }
//获取个人补卡原因
// _private.getFillSignCardReason = function () {
//   var param = [];
//   var params = {};
//   param[0] = params;
//   var success = function (data) {
//     //mbos.msgBox.showInfo("OSF调用","OSF调用成功",function(){});
//     //mbos.msgBox.showError('调用成功');
//     //console.log(data);
//     _private.generateFillSignCardReasonList(data)

//   }
//   var fail = function (data) {
//     mbos.msgBox.showError(data.detail);
//   }
//   // mbos.eas.invokeScript("getFillSingCardReason",param,success,fail);
// }
//校验字段是否为空
_private.checkFieldEmpty = function () {
    var filecardTimeString = mbos("attendDate").value();
    if (filecardTimeString != null && filecardTimeString != "") {
        $("#submit").css("background-color", "#0088cc");
        $("#submit").css("border-color", "#0088cc");
        $("#submit").removeAttr("disabled");
    } else {
        $("#submit").css("background-color", "#cccccc");
        $("#submit").css("border-color", "#cccccc");
        $("#submit").attr("disabled", "disabled");
    }
};

_this.edit = function (event) {
    return page.edit && page.edit(event);
};
_this.addnew = function (event) {
    return page.addnew && page.addnew(event);
};
_this.save = function (event) {
    return page.save && page.save(event);
};
_this.submit = function (event) {
    return page.submit && page.submit(event);
};
_this.back = function (event) {
    return page.back && page.back(event);
};

_this.dateChange = function (event) {
    if (!event.old_value) {
        _private.checkFieldEmpty();
        return;
    }
    if (!event.new_value) {
        _private.checkFieldEmpty();
        if (event.old_value == _private.attendDate) {
            mbos("attendDate").value(event.old_value);
            delete _private.attendDate;
            return;
        }
        return;
    }

    //return  page.dateChange && page.dateChange(event);
};
_private.getf7value = function (data) {
    var f7value = {};
    for (var s = data.length - 1; s >= 0; s--) {
        if (f7value.id != undefined) {
            if (s > 0) {
                f7value.id = f7value.id + data[s].id.toString() + ",";
                f7value.name = f7value.name + data[s].name.toString() + ",";
                f7value.number = f7value.number + data[s].number.toString() + ",";
            } else {
                f7value.id = f7value.id + data[s].id.toString();
                f7value.name = f7value.name + data[s].name.toString();
                f7value.number = f7value.number + data[s].number.toString();
            }
        } else {
            if (data.length == 1) {
                f7value.id = data[s].id.toString();
                f7value.name = data[s].name.toString();
                f7value.number = data[s].number.toString();
            } else {
                f7value.id = data[s].id.toString() + ",";
                f7value.name = data[s].name.toString() + ",";
                f7value.number = data[s].number.toString() + ",";
            }
        }
    }
    return f7value;
};

