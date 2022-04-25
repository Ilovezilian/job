var _globalObject = null;
var atsShiftnum = -1;
shr.defineClass("shr.ats.AttendanceGroupShiftAddForm", shr.framework.Core, {
    strBeginDate: "",
    strEndDate: "",
    beginDate: null,
    endDate: null,
    month: null,
    year: null,
    switchType: "2",
    _clickPosition: [],
    _listRowDatas: [],
    _events: [],
    noShift: null,
    numbers: [],
    continueCtrlKeyClick: true,
    commonClick: true,
    rest: null,
    _dayTypes: [
        jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_20,
        jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_46,
        jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_19,
    ],
    _dayTypeMap: {
        workDay: {
            name: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_20,
            bracketName: "[" + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_20 + "]",
            value: 0
        },
        restDay: {
            name: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_46,
            bracketName: "[" + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_46 + "]",
            value: 1
        },
        legalHoliday: {
            name: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_19,
            bracketName: "[" + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_19 + "]",
            value: 2
        },
    },
    initalizeDOM: function () {
        var that = this;
        shr.ats.AttendanceGroupShiftAddForm.superClass.initalizeDOM.call(this);
        _globalObject = this;
        //设置业务组织缓存值
        var hrOrgUnitObj = sessionStorage.getItem("hrOrgUnitStr");
        $("#hrOrgUnit").shrPromptBox('setValue', JSON.parse(hrOrgUnitObj));
        that.setSystemTime();
        that.switchType = '3';
        that.listShift();
        //业务组织发生变化时,考勤业务组织切换后，清空所有选的员工和排班数据。日历式清空选中的员工和日历中的排班数据，列表式清空排班列表。
        $("#hrOrgUnit").change(function () {
            var flag = that.onValidate();
            var hrOrgUnitObj = $("#hrOrgUnit").shrPromptBox('getValue')

            sessionStorage.setItem("hrOrgUnitStr", JSON.stringify(hrOrgUnitObj));
            if (flag) {
                $(".field_list").find(".text-tag").remove();
                that.listShift();
            }
            //清空所有选的员工
            $("#personInfo").html("");
            $(".field_list").find(".text-tag").remove()
            that.loadTimeAttendanceType();
        });
        $("#attenceGroupSource").change(function () {
            var flag = that.onValidate();
            if (flag) {
                $(".field_list").find(".text-tag").remove();
                that.listShift();
            }
            //清空所有选的员工
            $("#personInfo").html("");
            $(".field_list").find(".text-tag").remove()

        });
        $("#workCalendar").change(function () {
            if ($("#attenceGroupSource").val() == "") {
                return;
            }
            var workCalendar = $("#workCalendar_el").val();
            var strEndDate = atsMlUtile.getFieldOriginalValue("endDate");
            var strBeginDate = atsMlUtile.getFieldOriginalValue("beginDate");
            $.ajax({
                url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceGroupShiftAddForm&method=getDayType",
                data: {workCalendar: workCalendar, strEndDate: strEndDate, strBeginDate: strBeginDate},
                dataType: 'json',
                async: false,
                type: "POST",

                success: function (res) {
                    var result = res;
                    var strs = new Array(); //定义一数组
                    var w = res.rest.substring(0, res.rest.length - 1);
                    strs = res.rest.split(",");
                    for (i = 0; i < strs.length - 1; i++) {
                        for (var j = 0; j < $('#list_info tr').length - 1; j++) {
                            if ((that._listRowDatas[j])[strs[i]] == "" || (that._listRowDatas[j])[strs[i]] == undefined) {
                                (that._listRowDatas[j])[strs[i]] = that.getDayTypeMap().restDay.bracketName;
                                $("#list_info").find("[aria-describedby='list_info_" + strs[i] + "']").eq(j).attr("class", "gray-color");
                                $("#list_info").find("[aria-describedby='list_info_" + strs[i] + "']").eq(j).attr("title", that.getDayTypeMap().restDay.bracketName);
                            }
                        }
                    }
                    var strss = new Array(); //定义一数组
                    strss = res.legal.split(",");
                    for (i = 0; i < strss.length - 1; i++) {
                        for (var j = 0; j < $('#list_info tr').length - 1; j++) {
                            if ((that._listRowDatas[j])[strss[i]] == "" || (that._listRowDatas[j])[strss[i]] == undefined) {
                                (that._listRowDatas[j])[strss[i]] = that.getDayTypeMap().legalHoliday.bracketName;
                                $("#list_info").find("[aria-describedby='list_info_" + strss[i] + "']").eq(j).attr("class", "litterGreen-color");
                                $("#list_info").find("[aria-describedby='list_info_" + strss[i] + "']").eq(j)
                                    .attr("title", that.getDayTypeMap().legalHoliday.bracketName);
                            }
                        }
                    }
                }

            });

        });
        $("#beginDate").change(function () {
            var flag = that.onValidate();
            that.strBeginDate = atsMlUtile.getFieldOriginalValue("beginDate");
            that.beginDate = new Date(that.strBeginDate.replace(/-/g, "/"));
            sessionStorage.setItem("beginDate", that.strBeginDate);
            if (flag) {
                that.listShift();
            }

        });
        $("#endDate").change(function () {
            that.strEndDate = atsMlUtile.getFieldOriginalValue("endDate");
            that.endDate = new Date(that.strEndDate.replace(/-/g, "/"));
            sessionStorage.setItem("endDate", that.strEndDate);
            if (that.onValidate()) {
                that.listShift();
            }
        });

        that.loadTimeAttendanceType();

    },
    //业务组织F7是否读缓存：从未排班列表过来的不要，从其他地方过来的要
    hrOrgWriteCacheable: function () {
        return !(window.location.href.indexOf("noShift=1") > 1);
    }
    , isdate: function (intYear, intMonth, intDay) {  //判断日期是否合法
        if (isNaN(intYear) || isNaN(intMonth) || isNaN(intDay))  //检测是否非数字
            return false;
        if (intMonth > 12 || intMonth < 1)
            return false;
        if (intDay < 1 || intDay > 31)
            return false;
        if ((intMonth == 4 || intMonth == 6 || intMonth == 9 || intMonth == 11) && (intDay > 30))
            return false;
        if (intMonth == 2) {
            if (intDay > 29)
                return false;
            if ((((intYear % 100 == 0) && (intYear % 400 != 0)) || (intYear % 4 != 0)) && (intDay > 28))
                return false;
        }
        return true;
    }
    , setSystemTime: function () {
        var currentDate = new Date();
        var year = currentDate.getFullYear();    //获取完整的年份(4位,1970-????)
        var month = currentDate.getMonth();       //获取当前月份(0-11,0代表1月)
        var day = currentDate.getDate();        //获取当前日(1-31)
        var date1 = new Date();
        var nowDayOfWeek = currentDate.getDay(); //今天本周的第几天
        var nowDay = currentDate.getDate(); //当前日
        var nowMonth = currentDate.getMonth(); //当前月
        var nowYear = currentDate.getYear(); //当前年
        nowYear += (nowYear < 2000) ? 1900 : 0;
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间

        var date2 = new Date(date1);

        date2.setDate(date1.getDate() + 7);
        var timeMonth = date2.getMonth() + 1;
        var timeDay = date2.getDate();
        if (timeMonth < 10) {
            timeMonth = '0' + timeMonth;
        }
        if (timeDay < 10) {
            timeDay = '0' + timeDay;
        }
        var time2 = date2.getFullYear() + "-" +

            timeMonth + "-" + timeDay;
//		this.strEndDate = getUpDate(year,month,day);
        this.strEndDate = this.formatDate(weekEndDate);
        atsMlUtile.setTransDateValue("endDate", this.strEndDate);
        month = (parseInt(month) + 1);
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }

        this.strBeginDate = this.formatDate(weekStartDate);
        atsMlUtile.setTransDateValue("beginDate", this.strBeginDate);

        sessionStorage.setItem("beginDate", this.strBeginDate);
        sessionStorage.setItem("endDate", this.strEndDate);

        this.beginDate = new Date(this.strBeginDate.replace(/-/g, "/"));
        this.endDate = new Date(this.strEndDate.replace(/-/g, "/"));
    }

    , onValidate: function () {
        var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
        if (beginDate.length < 1) {
            shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_35, hideAfter: 3});
            return false;
        }
        var endDate = atsMlUtile.getFieldOriginalValue("endDate");
        if (endDate.length < 1) {
            shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_22, hideAfter: 3});
            return false;
        }
        var regEx = new RegExp("\\-", "gi");
        var reg = /^(\d{1,4})(-|\/)(\d{2})\2(\d{2})$/;
        if (!beginDate.match(reg)) {
            shr.showError({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_26, hideAfter: 3});
            return false;
        } else {
            if (!this.isdate(beginDate.split("-")[0], beginDate.split("-")[1], beginDate.split("-")[2])) {
                shr.showError({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_25, hideAfter: 3});
                return false;
            }
        }
        if (!endDate.match(reg)) {
            shr.showError({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_24, hideAfter: 3});
            return false;
        } else {
            if (!this.isdate(endDate.split("-")[0], endDate.split("-")[1], endDate.split("-")[2])) {
                shr.showError({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_23, hideAfter: 3});
                return false;
            }
        }
        var beginDate_01 = new Date(beginDate.replace(/-/g, "/"));
        var endDate_01 = new Date(endDate.replace(/-/g, "/"));
        if ((beginDate_01.getTime() > endDate_01.getTime())) {
            shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_34, hideAfter: 3});
            return false;
        }
        var reBeginDate_01 = new Date(beginDate.replace(/-/g, "/"));
        reBeginDate_01.setMonth(reBeginDate_01.getMonth() + 1);
        var leftsecond = endDate_01.getTime() - beginDate_01.getTime();
        var rightsecond = reBeginDate_01.getTime() - beginDate_01.getTime();
        if (leftsecond > rightsecond) {
            shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_27, hideAfter: 3});
            return;
        }
        return true;
    }
    , listShift: function () {
        var that = this;
        //遮盖日历排班
        $('#calendar').css('display', 'none');
        //清空列表
        $("#list").children().remove();
        $("#list").append($('<table id="list_info"></table>'));

        //显示列表排班
        $('#list').css('display', 'block');
        //显示删除按钮
        $("#delete").css("display", "");
        //显示班次排班
        $("#shiftScheduling").css("display", "");

        var persons = [];
        if ("1" == that.noShift) {
            var personNumStr = window.localStorage ? localStorage.getItem("personNumStrFromList") : Cookie.read("personNumStrFromList");
            personNum = personNumStr;
            persons = personNum.split(",");
        } else {
            var field_list = $(".field_list").find(".text-tag");
            if ((field_list != undefined && field_list.length > 0)) {
                field_list.each(function (index) {
                    persons.push($(this).attr('id'));

                });
            }
        }
        $.ajax({
            url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceGroupShiftAddForm&method=getGridColModel",
            data: {beginDate: this.strBeginDate, endDate: this.strEndDate},
            dataType: 'json',
            async: false,
            type: "POST",
            beforeSend: function () {
                openLoader(1, jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_21);
            },
            success: function (rst) {
                that.getDataGrid(rst, persons);
            },
            error: function () {
                closeLoader();
            },
            complete: function () {
                closeLoader();
            }

        });
    }
    , getDataGrid: function (rst, persons) {
        var that = this;
        var hrOrgUnitId = $("#hrOrgUnit_el").val();
        var attenceGroupId = $("#attenceGroupSource_el").val();
        that.rest = rst;
        $.block.show({text: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_18});
        var options = {
            url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceGroupShiftAddForm&method=getPersonShiftNew"
                + "&beginDate=" + encodeURIComponent(this.strBeginDate) + "&endDate=" + encodeURIComponent(this.strEndDate)
                + "&hrOrgUnitId=" + encodeURIComponent(hrOrgUnitId) + "&attenceGroupId=" + encodeURIComponent(attenceGroupId),
            mtype: "POST",
            datatype: "json",
            postData: {
                "persons": persons.join(',')
            },
            multiselect: true,
            rownumbers: false,
            colNames: rst.colNames,
            colModel: rst.colModel,
            recordpos: 'left',
            gridview: true,
            pginput: true,
            footerrow: true,
            autoheight: true,
            shrinkToFit: rst.colModel.length > 10 ? false : true,
            height: 'auto',
            viewrecords: false,
            cellEdit: false,
            gridComplete: function () {
                //$('.ui-jqgrid-bdiv').scrollTop(0);
//				$(".frozen-sdiv.ui-jqgrid-sdiv").remove();
            },
            onCellSelect: function (rowid, iCol, cellcontent, e) {
                if (iCol > 3 && iCol <= rst.colModel.length) {
                    jQuery("#list_info").setSelection(rowid, false);
                    var table = jQuery("#list_info");
                    var tdObject = $("#" + rowid + ">td")[iCol];
                    if (e.type == "click") {
                        if (!e.shiftKey) {
                            //ctrl键+click点击
                            if (that.continueCtrlKeyClick) {
                                //说明之前的点击都是ctrl+click
                                that.continueCtrlKeyClick = true;
                                that.commonClick = false;
                                that._clickPosition.push(rowid);
                                that._clickPosition.push(iCol);
                                that._clickPosition.push(rowid);
                                that._clickPosition.push(iCol);
                                that.addClickSection(rst);
                            } else {
                                //说明之前的点击都是click，应该把之前储存在that._clickPosition中的数据删除，以及将td颜色去掉
                                that.continueCtrlKeyClick = true;
                                that.commonClick = false;
                                var oldCol = parseInt(that._clickPosition.pop());
                                var oldRow = parseInt(that._clickPosition.pop());
                                var oldTdObject = $("#" + oldRow + ">td")[oldCol];
                                $(oldTdObject).removeClass('cell-select-color');
                                that._clickPosition.push(rowid);
                                that._clickPosition.push(iCol);
                                that.addClickSection(rst);
                            }
                        } else {
                            //普通click点击
                            if (that.commonClick) {
                                //说明之前都是click点击
                                that.continueCtrlKeyClick = false;
                                that.commonClick = true;
                                if (that._clickPosition.length <= 2) {
                                    that._clickPosition.push(rowid);
                                    that._clickPosition.push(iCol);
                                    $(tdObject).addClass('cell-select-color');
                                }
                                if (that._clickPosition.length == 4) {
                                    that.addClickSection(rst);
                                    var oldTdObject = $("#" + rowid + ">td")[iCol];
                                    $(oldTdObject).removeClass('cell-select-color');

                                }
                            } else {
                                //之前不是click点击是click+ctrl点击,应该把之前储存在that._clickPosition中的数据删除，以及将td颜色去掉
                                that.continueCtrlKeyClick = false;
                                that.commonClick = true;
                                var _clickPositionLength = that._clickPosition.length;
                                for (var i = 0; i < _clickPositionLength; i = i + 2) {
                                    var oldRow = that._clickPosition[i];
                                    var oldCol = that._clickPosition[i + 1];
                                    var oldTdObject = $("#" + oldRow + ">td")[oldCol];
                                    $(oldTdObject).removeClass('cell-select-color');
                                }
                                for (var i = 0; i < _clickPositionLength; i++) {
                                    that._clickPosition.pop();
                                }
                                that._clickPosition.push(rowid);
                                that._clickPosition.push(iCol);
                            }
                        }

                        //将选中的数据填充

                    } else {
                        //nothing
                    }

                } else if (1 <= iCol && iCol <= 3 && iCol <= rst.colModel.length) {

                    jQuery("#list_info").setSelection(rowid, false);
                    var table = jQuery("#list_info");
                    var tdObject = $("#" + rowid + ">td")[iCol];
                    that._clickPosition.push(rowid);
                    that._clickPosition.push(4);
                    that._clickPosition.push(rowid);
                    that._clickPosition.push(rst.colModel.length);
                    that.addClickSection(rst);
                } else {
                    //nothing
                }
            }
        };
        options.resizeStop = function (newwidth, index) {
            if (index == 3) {
                $("#list_info_frozen").parent().width($(".frozen-div").width());
            }
        };
        options.beforeProcessing = function (data) {
            data.rows.forEach(function(row) {
                for (k in row) {
                    var v = row[k];
                    if (k.length == 10 && k.match("\\d{4,4}-\\d{2,2}-\\d{2,2}") && v.match("\[\\d\]")) {
                        row[k] = "[" + that.getDayTypes()[v[1]] + v.slice(2);
                    }
                }
            });
        };
        options.loadComplete = function (data) {
            that._listRowDatas = data.rows;

            //就算显示表格的高度和宽度
            var height = (data.rows.length) * 33.3 + 33.3;
            if (height > 550) {
                height = 550;
            }
            height += 'px'
            $('#list .ui-jqgrid-bdiv').css('height', height).css('width', '100%').css("box-sizing", "border-box");
            //(BT1179508)当日期区间范围比较大时,横向滚动条会被下面的frozen-bdiv ui-jqgrid-bdiv覆盖，不能滚动
            $(".frozen-bdiv").css("height", ($(".ui-jqgrid-bdiv:first").height() - 15) + "px");
            //$('.ui-jqgrid-bdiv').scrollTop(0);

            //给表格嵌上颜色
            that.colorFormatter();
//		  $("#list_info_frozen").parent().css({"overflow-y":"hidden"});
//		  $("#list_info_frozen").parent().width($(".frozen-div").width());
            setTimeout(function () {
                $("#list_info_frozen").parent().css({"overflow-y": "hidden"});
                $("#list_info_frozen").parent().width($(".frozen-div").width());
            }, 500)
            $.block.hide();
//		  $(".frozen-sdiv.ui-jqgrid-sdiv").remove();
        };

        jQuery('#list_info').html();
        jQuery('#list_info').jqGrid(options);
        jQuery('#list_info').jqGrid('setFrozenColumns');
        //就算显示表格的高度和宽度
        var height = (persons.length + 1) * 33.3;
        if (height > 550) {
            height = 550;
        }
        height += 'px'
        $('#list .ui-jqgrid-bdiv').css('height', height).css('width', '100%').css("box-sizing", "border-box");
        //(BT1179508)当日期区间范围比较大时,横向滚动条会被下面的frozen-bdiv ui-jqgrid-bdiv覆盖，不能滚动
        $(".frozen-bdiv").css("height", ($(".ui-jqgrid-bdiv:first").height() - 15) + "px");
        //$('.ui-jqgrid-bdiv').scrollTop(0);
//		$("tr").css("background-color","#daeef8");
    }	//列表式排班选择班次
    , addClickSection: function (rst) {
        var that = this;
        //_clickPosition里面装载的是行列数据
        var minCol = parseInt(that._clickPosition.pop());
        var minRow = parseInt(that._clickPosition.pop());
        var maxCol = parseInt(that._clickPosition.pop());
        var maxRow = parseInt(that._clickPosition.pop());

        if (minRow > maxRow) {
            var temp = minRow;
            minRow = maxRow;
            maxRow = temp;
        }
        if (minCol > maxCol) {
            var temp = minCol;
            minCol = maxCol;
            maxCol = temp;
        }
        var dayValue = "";
        var table = jQuery("#list_info");
        var typeName = $("#typeName").val();
        var atsShiftName = $("#atsShiftName").val();
        if (that.getDayTypes().indexOf(typeName) === -1) {
            shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_41});
            return false;
        }
        if (that.getDayTypeMap().workDay.name == typeName) {
            if ("" == atsShiftName) {
                shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_38});
                return false;
            }
        }

        dayValue = "[" + typeName + "]" + $("#atsShiftName").val();
        var atsShiftId = $("#atsShiftId").val();
        var oldDayValue = dayValue;
        var tdObject = null, colName = null;
        for (var r = minRow; r <= maxRow; r++) {
            for (var c = minCol; c <= maxCol; c++) {
                tdObject = $("#" + r + ">td")[c];
                if (dayValue == null && dayValue == undefined) {
                    dayValue = tdObject.title;
                    oldDayValue = null;//用完之后置空
                }
                colName = rst.colModel[c - 1].name;
                (that._listRowDatas[r - 1])[colName] = dayValue;
                if (dayValue != null && dayValue != undefined) {
                    var dayTitle = that.getColorTitle($(tdObject), dayValue, true);
                    if (dayTitle == '' || dayTitle.length == 0) {
                        table.setCell(r, c, null);
                    } else {
                        table.setCell(r, c, dayTitle);
                    }
                    //同时更新列的title属性
                    $(tdObject).attr('title', dayValue);
                }
                if (oldDayValue == null) {//用完之后置空
                    dayValue = null;
                }
            }
        }
        $("#iframe1").removeAttr("title");
        $("#iframe1").attr("style", "width:1035px;height:550px;");
    }
    //列表式排班选择班次
    , setClickSection: function (rst) {
        var that = this;
        //_clickPosition里面装载的是行列数据
        var minCol = parseInt(that._clickPosition.pop());
        var minRow = parseInt(that._clickPosition.pop());
        var maxCol = parseInt(that._clickPosition.pop());
        var maxRow = parseInt(that._clickPosition.pop());

        if (minRow > maxRow) {
            var temp = minRow;
            minRow = maxRow;
            maxRow = temp;
        }
        if (minCol > maxCol) {
            var temp = minCol;
            minCol = maxCol;
            maxCol = temp;
        }
        //var serviceId = shr.getUrlRequestParam("serviceId");
        //var url = shr.getContextPath() +'/dynamic.do?&method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list'
        //                               + '&flag=turnShift&serviceId='+serviceId;

        var serviceId = shr.getUrlRequestParam("serviceId");
        var hrOrgUnitObj = JSON.stringify($("#hrOrgUnit").shrPromptBox('getValue'));//获取业务组织
        var url = shr.getContextPath() + '/dynamic.do?method=initalize&flag=turnShift&serviceId=' + encodeURIComponent(serviceId) + ''
            + '&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list'
            + '&hrOrgUnitObj=' + encodeURIComponent(hrOrgUnitObj);

        $("#iframe1").attr("src", url);
        $("#iframe1").dialog({
            modal: true,
            width: 1035,
            minWidth: 1035,
            height: 550,
            minHeight: 550,
            title: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_47,
            open: function (event, ui) {
            },
            close: function () {
                var table = jQuery("#list_info");
                var dayValue = $("#iframe1").attr('title');
                var oldDayValue = dayValue;
                var tdObject = null, colName = null;
                for (var r = minRow; r <= maxRow; r++) {
                    for (var c = minCol; c <= maxCol; c++) {
                        tdObject = $("#" + r + ">td")[c];
                        if (dayValue == null && dayValue == undefined) {
                            dayValue = tdObject.title;
                            oldDayValue = null;//用完之后置空
                        }
                        colName = rst.colModel[c - 1].name;
                        (that._listRowDatas[r - 1])[colName] = dayValue;
                        if (dayValue != null && dayValue != undefined) {
                            var dayTitle = that.getColorTitle($(tdObject), dayValue, true);
                            if (dayTitle == '' || dayTitle.length == 0) {
                                table.setCell(r, c, null);
                            } else {
                                table.setCell(r, c, dayTitle);
                            }
                            //同时更新列的title属性
                            $(tdObject).attr('title', dayValue);
                        }
                        if (oldDayValue == null) {//用完之后置空
                            dayValue = null;
                        }
                    }
                }
                $("#iframe1").removeAttr("title");
            }
        });
        $("#iframe1").attr("style", "width:1035px;height:550px;");
    }
    , calendarShift: function () {
        //遮盖列表排班
        $('#list').css('display', 'none');
        //显示日历排班
        $('#calendar').css('display', 'block');
        //隐藏删除按钮
        $("#delete").css("display", "none");
        //隐藏班次排班
        $("#shiftScheduling").css("display", "none");
        var that = this;
        $('#monthInfo').html((that.beginDate.getMonth() + 1) > 9 ? (that.beginDate.getMonth() + 1) : '0' + (that.beginDate.getMonth() + 1));
        //$('#yearInfo').html(that.beginDate.getFullYear() + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_33 + ((that.beginDate.getMonth() +1) > 9 ? (that.beginDate.getMonth() +1) : '0'+ (that.beginDate.getMonth() +1)) + '月');
        $("#yearInfo").html(that.beginDate.getFullYear() + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_33);
        that.month = that.beginDate.getMonth();
        that.year = that.beginDate.getFullYear();


        var clickLeft = false, clickRight = true;
        $('#monthSelector').find('i').unbind().click(function (e) {
            var tar = e.target;
            if ($(tar).hasClass('icon-caret-left')) {
                if (clickLeft) {
                    if (that.month == 0) {
                        that.month = 11;
                        that.year = that.year - 1;
                    } else {
                        that.month = that.month - 1;
                    }
                    clickLeft = false;
                    clickRight = true;

                }
            } else if ($(tar).hasClass('icon-caret-right')) {
                if (clickRight) {
                    if (that.month == 11) {
                        that.month = 0;
                        that.year = that.year + 1;
                    } else {
                        that.month = that.month + 1;
                    }
                    clickLeft = true;
                    clickRight = false;

                }
            }
            $('#monthInfo').html((that.month + 1) > 9 ? (that.month + 1) : '0' + (that.month + 1));
            $("#yearInfo").html(that.year + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_33);
            that.initCalandar();

        });

        //由于日历控件在初始化的时候，格式不对，所以采ajax对齐局部刷新
        $.ajax({
            url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CalendarShiftHandler&method=flashPage",
            data: {beginDate: that.strBeginDate, endDate: that.strEndDate},
            dataType: 'json',
            type: "POST",
            cache: false,
            success: function (data) {
                if (!data.flag) {
                    shr.showWarning({message: data.message});
                    return;
                } else {
                    that._events = data.rows;
                    that.initCalandar();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                that.initCalandar();
            }
        });
    }
    /**
     * 初始化日历控件
     */
    , initCalandar: function () {
        var that = this;
        //由于日历控件在初始化的时候，格式不对，所以采ajax对齐局部刷新
        $('#calendar_info').empty();
        $('#calendar_info').fullCalendar({
            header: {
                left: '',
                center: '',
                right: ''
            },
            year: that.year,
            month: that.month,
            dayNamesShort: [
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_51,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_55,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_49,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_52,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_53,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_54,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_50
            ],
            monthNamesShort: [
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_6,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_7,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_8,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_9,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_10,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_11,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_12,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_13,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_14,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_3,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_4,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_5
            ],
            monthNames: [
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_6,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_7,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_8,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_9,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_10,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_11,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_12,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_13,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_14,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_3,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_4,
                jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_5
            ],
            editable: true,
            aspectRatio: 1.35,
            disableDragging: true,
            events: that._events,
            eventRender: function (event, element) {
            },
            eventAfterRender: function (event, element, view) {
                var title = "";
                $("#calendar_info td").each(function () {
                    var tdThis = this;
                    var dateValue = $(tdThis).attr('data-date');
                    if (dateValue != null && dateValue != undefined) {
                        var time = new Date(dateValue.replace(/-/g, "/"));
                        //控制日历字体显示颜色
                        if (time.getTime() >= that.beginDate.getTime() && time.getTime() <= that.endDate.getTime()) {
                            $(this).children().each(function () {
                                var grandchild = $(this).children();
                                if ($(grandchild).hasClass("fc-day-number")) {
                                    $(grandchild).css("opacity", 0.7);
                                }
                            });

                            if (time.getTime() == event.start.getTime()) {
                                title = that.getColorTitle(tdThis, event.title, true);
                            }
                        }
                    }
                });

                var divHtml = (event.bigLengthFlag && event.bigLengthFlag == "1") ? '<div style="color:#666;" title="' + event.oldTile + '">' + title + '</div>'
                    : '<div style="color:#666;">' + title + '</div>';
                //position: absolute; left: 294px; width: 92px; top: 285px;
                element.html(divHtml);
                //element.children().eq(0).children().attr("style","color:#666;");

            },
            eventClick: function (event, e) {
            },
            dayClick: function (date, allDay, jsEvent, view) {
            }
        });

        //对table进行监测: 过滤掉头两行：下标是从0开始的
        $('#calendar_info table tr:gt(1)').mousedown(function () {
            //鼠标点击事件： 过滤掉头三列

            $('#calendar_info table td:gt(2)').click(function (e) {
                var dateValue = $(e.currentTarget).attr('data-date');
                var time = new Date(dateValue.replace(/-/g, "/"));
                if (time.getTime() >= that.beginDate.getTime() && time.getTime() <= that.endDate.getTime()) {
                    $(this).addClass('cell-select-color');
                    that.getSelectDateValue();
                }
            }).mouseup(function (e) {
                var dateValue = $(e.currentTarget).attr('data-date');
                var time = new Date(dateValue.replace(/-/g, "/"));
                if (time.getTime() >= that.beginDate.getTime() && time.getTime() <= that.endDate.getTime()) {
                    that.getSelectDateValue();
                }

            });

            $('#calendar_info table td:gt(2)').mousemove(function (e) {
                var dateValue = $(e.currentTarget).attr('data-date');
                var time = new Date(dateValue.replace(/-/g, "/"));
                if (time.getTime() >= that.beginDate.getTime() && time.getTime() <= that.endDate.getTime()) {
                    $(this).addClass('cell-select-color');
                }
            });
            //对document进行mouseup事件的监听,当鼠标松开的时候，取消td的移动事件， 同时保留td:gt(2)的鼠标松开事件
            $(document).mouseup(function () {
                $("#calendar_info table td").unbind('mousemove');
            });


        });
    }
    /**
     *  得到着色日期的日期值
     */
    , getSelectDateValue: function () {
        var that = this;
        $("#calendar_info table td").unbind('mousemove');
        var selectCellColor = [];
        $("#calendar_info table td").each(function () {
            if ($(this).hasClass("cell-select-color")) {
                var dateValue = $(this).attr('data-date');
                var time = new Date(dateValue.replace(/-/g, "/"));
                selectCellColor.push(time.getTime());
            }
        })
        if (selectCellColor.length > 0) {
            that.selectDayTypeAndAtsShift(selectCellColor);
            selectCellColor = [];
        }
    }
    /**
     * 日历式排班选择班次列表
     * 给小于10的月份和年份前面加0,形成09的格式
     */
    , selectDayTypeAndAtsShift: function (selectCellColor) {
        var that = this;
        var serviceId = shr.getUrlRequestParam("serviceId");
        var hrOrgUnitObj = JSON.stringify($("#hrOrgUnit").shrPromptBox('getValue'));//获取业务组织
        var url = shr.getContextPath() + '/dynamic.do?method=initalize&flag=turnShift&serviceId=' + encodeURIComponent(serviceId) + ''
            + '&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list'
            + '&hrOrgUnitObj=' + encodeURIComponent(hrOrgUnitObj);
        $("#iframe1").attr("src", url);
        $("#iframe1").dialog({
            modal: false,
            title: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_47,
            width: 1035,
            minWidth: 1035,
            height: 505,
            minHeight: 505,
            open: function (event, ui) {
            },
            close: function () {
                var title = $("#iframe1").attr('title');
                if (title != null && title != undefined) {
                    $("#iframe1").removeAttr("title");
                    var selectTime = null, event = null, eventDayTime = null;
                    while (selectCellColor.length > 0) {
                        selectTime = selectCellColor.pop();
                        for (var j = 0; j < that._events.length; j++) {
                            event = that._events[j];
                            eventDayTime = event["start"].getTime();
                            if (selectTime >= that.beginDate.getTime() && selectTime <= that.endDate.getTime()) {
                                var oldTitle = title.substring(title.indexOf("]") + 1);
                                if (selectTime == event["start"].getTime()) {
                                    var temLength = 14 + (title.indexOf("]") - title.indexOf("["));
                                    if (title.length > temLength) {
                                        that._events[j].title = title.substring(0, temLength) + "...";
                                        that._events[j].bigLengthFlag = "1";
                                        that._events[j].oldTile = oldTitle;
                                        that._events[j].oldcalandarTile = title;
                                    } else {
                                        that._events[j].title = title;
                                        that._events[j].bigLengthFlag = "0";
                                        that._events[j].oldcalandarTile = title;
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    selectCellColor = [];
                }
                $('#calendar_info').empty();
                that.initCalandar();
            }
        });

        $("#iframe1").attr("style", "width:1035px;height:505px;");
    }
    , deleteAction: function () {
        var that = this;
        var selectedIds = $("#list_info").jqGrid("getSelectedRows");
        var listRowDatas = that._listRowDatas;
        for (var i = 0, length = selectedIds.length; i < length; i++) {
            var personId = $("#list_info").jqGrid("getCell", selectedIds[i], "personId");
            $(".field_list").find(".text-tag").each(function () {
                //用编号数字去比较，效率更快
                if (this['id'] == personId) {
                    $(this).remove();
                    return;
                }
            });

            $.each(listRowDatas, function (index, item) {
                // index是索引值（即下标）   item是每次遍历得到的值；
                if (this.personId == personId) {
//           	        listRowDatas.splice(index,1);
                    listRowDatas[index] = {};
                }
            });
            /*
    	 	if("1" == that.noShift){//未排班列表过来的
				//var personNumStr = sessionStorage.getItem("personNumStr");
			    //that.numbers = personNumStr.split(",")
			    $.each(that.numbers,function(index,item){
	            	// index是索引值（即下标）   item是每次遍历得到的值；
	           	 	if(item == personId){
	           	        that.numbers.splice(index,1);
	        	    }
	    	 	});
			}*/
        }


        if (selectedIds != "") {
            for (var i = selectedIds.length - 1; i >= 0; i--) {
                $("#list_info").jqGrid('delRow', selectedIds[i]);
            }
        } else {
            shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_39});
        }

    }
    , turnShiftAddAction: function () {
        var that = this;
        if ($(".field_list").html() == "" && "1" != that.noShift) {
            shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_39});
            return;
        }
        var url = '';
        var flag = "";
        if (this.switchType == '3') {

            var selectedIds = $("#list_info").jqGrid("getSelectedRows");
            if (selectedIds == null || selectedIds.length < 1 || selectedIds == "") {
                shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_37});
                return;
            }
            var personIds = [];
            var personIdAndRowNum = [];
            for (var i = 0, length = selectedIds.length; i < length; i++) {
                var personId = $("#list_info").jqGrid("getCell", selectedIds[i], "personId");
                personIds.push(personId);
                personIdAndRowNum.push(personId + "_" + selectedIds[i]);
            }
            flag = "list";
        } else if (this.switchType == '2') {
            flag = "calendar";
        } else {
            //nothing
        }
        //这里personIds存储的都是number
        localStorage.removeItem("shiftPersonIds");
        localStorage.setItem("shiftPersonIds", personIds);
        localStorage.removeItem("shiftPersonIdAndRowNum");
        localStorage.setItem("shiftPersonIdAndRowNum", personIdAndRowNum);
        var serviceId = shr.getUrlRequestParam("serviceId");
        var hrOrgUnitObj = JSON.stringify($("#hrOrgUnit").shrPromptBox('getValue'));//获取业务组织
        if ("1" == this.noShift) {//从未排班列表中进入。
            var table = jQuery("#list_info");
            var selectedIds = table.jqGrid("getSelectedRows");
            var rowNums = selectedIds.length;
            url = shr.getContextPath() + '/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsTurnShiftForListShift.list';
            url += '&flag=' + flag + '&firstBeginDate=' + this.strBeginDate + '&firstEndDate=' + this.strEndDate;
            url += '&noShift=' + this.noShift;
            url += '&serviceId=' + serviceId;
            url += '&hrOrgUnitObj=' + encodeURIComponent(hrOrgUnitObj);
        } else {
            url = shr.getContextPath() + '/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsTurnShiftForListShift.list';
            url += '&flag=' + flag + '&firstBeginDate=' + this.strBeginDate + '&firstEndDate=' + this.strEndDate;
            url += '&policyId=' + sessionStorage.getItem("policyId");
            url += '&serviceId=' + serviceId;
            url += '&hrOrgUnitObj=' + encodeURIComponent(hrOrgUnitObj);
        }

        $("#iframe1").attr("src", url);
        $("#iframe1").dialog({
            modal: true,
            width: 850,
            minWidth: 850,
            height: 500,
            minHeight: 500,
            title: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_31,
            open: function (event, ui) {

            },
            close: function () {
                //绘制
            }
        });
        $("#iframe1").attr("style", "width:850px;height:500px;");
    }
    //选择人员
    , selectPersonAction: function () {
        var that = this;
        var filelist;
        /*if("1" == that.noShift){
			shr.showWarning({message: "不能选择员工"});
			return;
		}*/
        var serviceId = shr.getUrlRequestParam("serviceId");
        //var hrOrgUnitId = $("#hrOrgUnit_el").val();
        var hrOrgUnitObj = JSON.stringify($("#hrOrgUnit").shrPromptBox('getValue'));//获取业务组织
        if (hrOrgUnitObj == null || hrOrgUnitObj == undefined || hrOrgUnitObj == "null") {
            shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_36});
            return;
        }
        var url = shr.getContextPath() + "/dynamic.do?method=initalize&uipk=hr.ats.turnShiftPerson" + '&serviceId=' + encodeURIComponent(serviceId) + '&hrOrgUnitObj=' + encodeURIComponent(hrOrgUnitObj);
        var selectDialog = $("#operationDialog");
        selectDialog.children("iframe").attr('src', url);
        selectDialog.dialog({
            autoOpen: true,
            title: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_48,
            width: 950,
            minWidth: 950,
            height: 700,
            minHeight: 600,
            modal: true,
            resizable: true,
            position: {
                my: 'center center',
                at: 'center center',
                of: window
            },
            open: function () {
                filelist = $(".field_list").find(".text-tag");
            },
            close: function () {
                //如果不是通过选择人员窗口的确定按钮关闭该对话框需要将后选择的员工去除
                if (sessionStorage.getItem("flag") == "true") {

                } else {

                    $(".field_list").find(".text-tag").remove();
                    $(".field_list").append(filelist);

                }
                if (that.switchType == '3') {//如果是列表式排班关闭时需要去掉选择的人员，并重新排班
                    that.listShift();
                }
                ;

                sessionStorage.removeItem("flag");
            }
        });
    }

    , saveAction: function () {
        var _self = this;
        var listRowDatas = _self._listRowDatas
        var hrOrgUnitId = $("#hrOrgUnit_el").val();
        var j = 0;
        if (listRowDatas.length == 0) {
            shr.showInfo({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_32});
            return;
        }

        listRowDatas.forEach(function(row) {
            for (k in row) {
                var v = row[k];
                if (k.length == 10 && k.match("\\d{4,4}-\\d{2,2}-\\d{2,2}") && v) {
                    var dayType = _self.getDayTypes().indexOf(v.slice(1, v.indexOf("]")));
                    if (dayType > -1) {
                        row[k] = "[" + dayType + v.slice(v.indexOf("]"));
                    }
                }
            }
        });

        $.ajax({
            url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceGroupShiftAddForm&method=listShiftSaveForBatch",
            dataType: 'json',
            type: "POST",
            data: {
                data: shr.toJSON(listRowDatas),
                beginDate: _self.strBeginDate,
                endDate: _self.strEndDate,
                hrOrgUnitId: hrOrgUnitId
            },
            beforeSend: function () {
                openLoader(1, jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_30);
            },
            cache: false,
            success: function (data) {
                j = data.result;
                _self.listShift();
            },
            error: function () {
                closeLoader();

            },
            complete: function () {
                closeLoader();
                shr.showInfo({message: shr.formatMsg(jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_28, [j])});
            }
        });
    }, loadTimeAttendanceType: function () {
        var that = this;
        //如果新增或者编辑页面,直接从后台返回该人员的可用班次
        if (that.getOperateState() != 'VIEW') {
            var hrOrgUnitId = $("#hrOrgUnit_el").val();
            if (hrOrgUnitId == null || hrOrgUnitId == "") {
//				return;
            }
            that.remoteCall({
                type: "post",
                method: "getTimeAttendanceType",
                param: {
                    hrOrgUnitId: hrOrgUnitId
                },
                async: false,
                success: function (res) {
                    var info = res;
                    that.initTableAndDiv(info);
                }
            });

        }
    }//初始化假期类型框框信息,包括名称,单位,额度
    , initTableAndDiv: function (info) {
        var that = this;
        var attendColl = JSON.parse(info.timeAttendanceCollection);
        var size = info.timeAttendanceCollectionSize;

        var table = "";
        table = table +
            "<div class='row-fluid row-block' id=''>" +
            "<div data-ctrlrole='labelContainer'>"

            + "<div class='col-lg-2'>"
            + "<div class='field_label'  title='"
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_44
            + "'>"
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_44
            + "</div>"
            + "</div>"
            //			  + "<div class='col-lg-6 field-ctrl'> style='position:absolute;width:100%;margin-left:170px;margin-top:15px'"
            + "<div id='ht' style='float: left;'>"
            + "<table id=''  style='position:absolute;width:80%;margin-left:-5px' " +
            " <tr  >" +
            " <td id='atsShift_info' class='td_typeinfo'> " +
            " </td> " +
            " </tr> " +
            "</table> "
            + "</div> "
            + "</div> "
            + "</div> "
            + "<div class='row-fluid row-block' id=''>"
            + "<div data-ctrlrole='labelContainer'>"

            + "<div class='col-lg-2'>"
            + "<div class='field_label' id='atsShift_name' style='margin-top:15px' title='"
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_15
            + "'>"
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_15
            + "</div>"
            + "</div>"
            //			  + "<div class='col-lg-6 field-ctrl'> style='position:absolute;width:100%;margin-left:170px;margin-top:15px'"
            + "<div id='hts'  style='overflow-y: auto;max-height: 120px;margin-top: 20px;'>"
            + "<table id='shiftHtml'  style='position:relative;margin-left:-5px' " +
            " <tr  >" +
            " <td id='info_mess' class='td_typeinfo' style='padding-left: 0;'> " +
            " </td> " +
            " </tr> " +
            "</table> "
            + "</div> "
            + "<br/>"
            + '<div style="border:1px solid #cccccc;display:inline-block;margin-left:155px"><input class="searchKey input-height" type="text" name="searchKey" id="searchKey" validate="" value="" placeholder="'
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_45
            + '" dataextenal="" ctrlrole="" maxlength="80" style="width: 276px;"><button class="locate-btn shrbtn-primary shrbtn" onclick="getLocation(' + size + ')">'
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_17
            + '</button></div>'
            + "</div> "
            + "</div> "
        //$("#wrap").css('overflow-y','auto');
        //$("#leaveBillNew_divForm").css('overflow','auto');
        //document.getElementById("leaveBillNew_divForm").style.height=document.getElementById("leaveBillNew_divForm").offsetHeight-100 + "px";
        $("#turnShiftaddForm").html(table);
        var countMou;
        var td_div = "";
        for (var j = 0; j < size; j++) {
            holidayPolicyId = attendColl[j].id;
            attendTypeName = attendColl[j].name;
            remainValue_mess = "";
            if (!attendColl[j].isDefault) {//如果大于4 设置隐藏 显示更多
                td_div = td_div +
                    "<div id='div" + j + "' style='display:none' title =" + attendTypeName + " value=" + attendTypeName + " valueId=" + holidayPolicyId + " class='div_blockinfo' style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden;' onclick='changeColor(" + j + "," + size + ",\"" + holidayPolicyId + "\",\"" + "\",\"" + attendTypeName + "\")'><font class='attendTypeName_info'>" + attendTypeName + "</font>&nbsp;&nbsp;<br/></div>"
            } else {
                td_div = td_div +
                    "<div id='div" + j + "' class='div_blockinfo' title =" + attendTypeName + " value=" + attendTypeName + " valueId=" + holidayPolicyId + " style='text-overflow:ellipsis;white-space:nowrap;overflow:hidden;' onclick='changeColor(" + j + "," + size + ",\"" + holidayPolicyId + "\",\"" + "\",\"" + attendTypeName + "\")'><font class='attendTypeName_info'>" + attendTypeName + "</font>&nbsp;&nbsp;<br/> </div>"

            }
        }

        // 更多按钮
        if (size > 4) {
            td_div = td_div +
                "<div id='div" + (size) + "' class='div_blockinfo' class='attendTypeName_info'><div >"
                + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_16
                + "&gt;&gt;</div> </div>"
        }
        $("#info_mess").html(td_div);

        //审核界面为编辑状态时
        if (that.isFromWF() && that.getOperateState() == 'EDIT' && $("#billState").val() != 0) {
            $("#info_mess .div_blockinfo").attr("onclick", "").css("cursor", "default");
        }

        // 注册更多按钮事件
        $('#div' + (size)).bind('click', function () {
            for (var i = 0; i < size; i++) {

                $('#div' + i).attr('style', 'display:block;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;');
            }
            //隐藏更多按钮
            $('#div' + (size)).attr('style', 'display:none');

            if (that.isFromWF() && that.getOperateState() == 'EDIT' && $("#billState").val() != 0) {
                $("#info_mess .div_blockinfo").attr("onclick", "").css("cursor", "default");
            }
        });
        $('.view_manager_body').attr("style", "padding-bottom:250px !important");
        var shift = "";
        shift = shift + "<div id='div-111' class='div_blockinfo' title = '' onclick='changeColors(-11" + 1 + "," + 3 + ",\"" + holidayPolicyId + "\",\"" + "\",\""
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_20
            + "\"" + "," + size + ")'><font class='attendTypeName_info'>"
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_20
            + "</font>&nbsp;&nbsp;<br/> </div>";
        shift = shift + "<div id='div-112' class='div_blockinfo' title = '' onclick='changeColors(-11" + 2 + "," + 3 + ",\"" + holidayPolicyId + "\",\"" + "\",\""
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_46
            + "\"" + "," + size + ")'><font class='attendTypeName_info'>"
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_46
            + "</font>&nbsp;&nbsp;<br/> </div>";
        shift = shift + "<div id='div-113' class='div_blockinfo' title = '' onclick='changeColors(-11" + 3 + "," + 3 + ",\"" + holidayPolicyId + "\",\"" + "\",\""
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_19
            + "\"" + "," + size + ")'><font class='attendTypeName_info'>"
            + jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_19
            + "</font>&nbsp;&nbsp;<br/> </div>";
        $("#atsShift_info").html(shift);
    }
    /*
	 * 日历排班保存
	 */
    , calendarShiftSaveAction: function () {
        var _self = this;
        var calendarData = _self._events;
        var datas = [];
        for (var i = 0; i < calendarData.length; i++) {
            var data = {title: calendarData[i].oldcalandarTile, start: _self.convertDateToStirng(calendarData[i].start)};
            if (data.title && data.title != "") {
                datas.push(data);
            }
        }
        var hrOrgUnitId = $("#hrOrgUnit_el").val();
        $.ajax({
            url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.SpecialShiftHandler&method=calendarShiftSave",
            dataType: 'json',
            type: "POST",
            data: {
                numbers: shr.toJSON(_self.numbers),
                data: shr.toJSON(datas),
                beginDate: _self.strBeginDate,
                endDate: _self.strEndDate,
                hrOrgUnitId: hrOrgUnitId
            },
            beforeSend: function () {
                openLoader(1, jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_43);
            },
            cache: false,
            success: function (data) {
                //_self.showSavedData();
            },
            error: function () {
                closeLoader();
            },
            complete: function () {
                closeLoader();
                shr.showInfo({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_42});

            }
        });
    }
    /*
	 * 列表排班
	 */
    , listShiftSaveAction: function () {
        var _self = this;
        var listRowDatas = _self._listRowDatas
        var hrOrgUnitId = $("#hrOrgUnit_el").val();
        $.ajax({
            url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.SpecialShiftHandler&method=listShiftSaveForBatch",
            dataType: 'json',
            type: "POST",
            data: {
                data: shr.toJSON(listRowDatas),
                beginDate: _self.strBeginDate,
                endDate: _self.strEndDate,
                hrOrgUnitId: hrOrgUnitId
            },
            beforeSend: function () {
                openLoader(1, jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_30);
            },
            cache: false,
            success: function (data) {
                //_self.showSavedData();
            },
            error: function () {
                closeLoader();

            },
            complete: function () {
                closeLoader();
                shr.showInfo({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_29});
            }
        });
    }

    /*
	 * 班次排班
	 */
    , shiftSchedulingAction: function () {
        var that = this;
        //_clickPosition里面装载的是行列数据
        if (that._clickPosition.length <= 0) {
            shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_40});
            return;
        }
        //var url = shr.getContextPath() +'/dynamic.do?&method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list'
        //                               + '&flag=turnShift';
        var serviceId = shr.getUrlRequestParam("serviceId");
        var hrOrgUnitObj = JSON.stringify($("#hrOrgUnit").shrPromptBox('getValue'));//获取业务组织
        var url = shr.getContextPath() + '/dynamic.do?method=initalize&flag=turnShift&serviceId=' + encodeURIComponent(serviceId) + ''
            + '&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list'
            + '&hrOrgUnitObj=' + encodeURIComponent(hrOrgUnitObj);
        $("#iframe1").attr("src", url);
        $("#iframe1").dialog({
            modal: true,
            width: 1035,
            minWidth: 1035,
            height: 550,
            minHeight: 550,
            title: jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_47,
            open: function (event, ui) {
            },
            close: function () {
                var table = jQuery("#list_info");
                var dayValue = $("#iframe1").attr('title');
                var oldDayValue = dayValue;
                var tdObject = null, colName = null;
                var clickPosition = that._clickPosition;
                for (var i = 0; i < clickPosition.length; i = i + 2) {
                    var r = clickPosition[i];
                    var c = clickPosition[i + 1];
                    tdObject = $("#" + r + ">td")[c];
                    if (dayValue == null && dayValue == undefined) {
                        dayValue = tdObject.title;
                        oldDayValue = null;//用完之后置空
                    }
                    colName = that.rest.colModel[c - 1].name;
                    (that._listRowDatas[r - 1])[colName] = dayValue;
                    if (dayValue != null && dayValue != undefined) {
                        var dayTitle = that.getColorTitle($(tdObject), dayValue, true);
                        if (dayTitle == '' || dayTitle.length == 0) {
                            table.setCell(r, c, null);
                        } else {
                            table.setCell(r, c, dayTitle);
                        }
                        //同时更新列的title属性
                        $(tdObject).attr('title', dayValue);
                    }
                    if (oldDayValue == null) {//用完之后置空
                        dayValue = null;
                    }
                }
                var _clickPositionLength = that._clickPosition.length;
                for (var i = 0; i < _clickPositionLength; i++) {
                    that._clickPosition.pop();
                }

                $("#iframe1").removeAttr("title");
            }
        });
        $("#iframe1").attr("style", "width:1035px;height:550px;");
        that.continueCtrlKeyClick = true;
        that.commonClick = true;
    },

    getDayTypes: function () {
        return this._dayTypes;
    },
    getDayTypeMap: function () {
        return this._dayTypeMap;
    },

    /**
     * _self：td列对象；value：传递过来的值对象：类似于[休息日]轮班1
     * flag：是否对当前列颜色标识
     */
    getColorTitle: function (_self, value, flag) {
        $(_self).removeClass('gray-color');
        $(_self).removeClass('litterGreen-color');
        $(_self).removeClass('cell-select-color');
        if (value.substring(0, _globalObject.getDayTypeMap().restDay.bracketName.length)
            == _globalObject.getDayTypeMap().restDay.bracketName) {
            if (flag) {
                $(_self).addClass('gray-color');
            }
            return value.substring(_globalObject.getDayTypeMap().restDay.bracketName.length);
        } else if (value.substring(0, _globalObject.getDayTypeMap().legalHoliday.bracketName.length)
            == _globalObject.getDayTypeMap().legalHoliday.bracketName) {
            if (flag) {
                $(_self).addClass('litterGreen-color');
            }
            return value.substring(_globalObject.getDayTypeMap().legalHoliday.bracketName.length);
        } else {
            if (value.indexOf(_globalObject.getDayTypeMap().workDay.bracketName) > -1) {
                return value.substring(_globalObject.getDayTypeMap().workDay.bracketName.length);
            } else {
                return value;
            }
        }
    },



    getUpDate: function (year, month, day) {

        var lastYear = year;
        var lastMonth = parseInt(month) + 2;

        if (lastMonth > 12) {
            lastYear = parseInt(lastYear) + 1;
            lastMonth = 1;
        }
        var lastDay = day;
        var lastDays = new Date(lastYear, lastMonth, 0);
        lastDays = lastDays.getDate();
        if (lastDay > lastDays) {
            lastDay = lastDays;
        }
        if (lastMonth < 10) {
            lastMonth = '0' + lastMonth;
        }
        if (lastDay < 10) {
            lastDay = '0' + lastDay;
        }
        return lastYear + '-' + lastMonth + '-' + lastDay;
    },

    /*
     * 回调针中处理
     */
    closeFrameDlg: function (ifameid, shiftName) {
        $('#' + ifameid).attr('title', shiftName);
        $('#' + ifameid).dialog('close');
    },

    /**
     *  针对轮班规则
     */
    closeCalendarFrameDlg: function(ifameid, events) {
        $('#' + ifameid).dialog('close');
        var iRow, jRow;
        for (var i = 0; i < events.length; i++) {
            iRow = events[i];
            for (var j = 0; j < _globalObject._events.length; j++) {
                jRow = _globalObject._events[j]
                if (iRow["start"] == _globalObject.formatDate(jRow["start"])) {
                    var title = _globalObject.correctValue(iRow["title"]);
                    var oldTitle = title.substring(title.indexOf("]") + 1);
                    var temLength = 14 + (title.indexOf("]") - title.indexOf("["));
                    if (title.length > temLength) {
                        _globalObject._events[j].title = title.substring(0, temLength) + "...";
                        _globalObject._events[j].bigLengthFlag = "1";
                        _globalObject._events[j].oldTile = oldTitle;
                        _globalObject._events[j].oldcalandarTile = title;

                    } else {
                        _globalObject._events[j].title = title;
                        _globalObject._events[j].bigLengthFlag = "0";
                        _globalObject._events[j].oldcalandarTile = title;
                    }

                    //_globalObject._events[j].title = correctValue(iRow["title"]);


                    break;
                }
            }
        }
        _globalObject.initCalandar();
    },

    /**
     * 针对轮班规则
     * 获取选择的人数作为外层循环变量
     * 用数据长度作为内层循环变量
     */
    closeListFrameDlg: function (ifameid, listData, beginCol, endCol) {
        $('#' + ifameid).dialog('close');
        var table = jQuery("#list_info");
        var selectedIds = table.jqGrid("getSelectedRows");
        var rowNums = selectedIds.length;


        for (var r = 0; r < rowNums; r++) {
            var index = 0;
            for (var c = beginCol; c <= endCol; c++) {
                var title = listData[index].title;
                var colName = listData[index].start;
                (_globalObject._listRowDatas[parseInt(selectedIds[r]) - 1])[colName] = title;

                if (title == null || title == undefined || title.length < 1) {
                } else {
                    table.setCell(selectedIds[r], c, title);
                }
                index++;
            }
        }
        //给表格嵌上颜色
        _globalObject.colorFormatter();

    },

    closeListFrameDlgForNoShift: function(ifameid, listData, beginCol, endCol) {
        $('#' + ifameid).dialog('close');
        var table = jQuery("#list_info");
        var selectedIds = table.jqGrid("getSelectedRows");
        var rowNums = selectedIds.length;
        for (var r = 0; r < listData.length; r++) {
            var listDataArr = listData[r];
            var rowNum = listDataArr.rowNum;
            for (var i = 0; i < listData[r][rowNum].length; i++) {
                var data = listData[r][rowNum];//第一个[r]表示listData中的第几个值，第二个[r+1]表示取里面的属性rowNum
                var title = data[i].title;
                var colName = data[i].start;
                (_globalObject._listRowDatas[parseInt(selectedIds[r]) - 1])[colName] = title;

                if (title == null || title == undefined || title.length < 1) {
                } else {
                    table.setCell(selectedIds[r], i + beginCol, title);
                }

            }
        }
        //给表格嵌上颜色
        _globalObject.colorFormatter();

    },

    colorFormatter: function() {
        var value = "";
        var that = this;
        $('#list_info td').each(function () {
            value = $(this).text();
            if (value != undefined && value != null && value.length > 0) {
                $(this).text(that.getColorTitle(this, value, true));
            }
        });
    },

    formatDate: function(date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1));
        var day = date.getDate() > 9 ? date.getDate() : ('0' + date.getDate());
        return year + '-' + month + '-' + day;
    },

    correctValue: function(value) {
        if (value == undefined || value == null) {
            return "";
        } else {
            return value;
        }
    },

    convertDateToStirng: function(date) {
        var year = date.getFullYear();
        var month = date.getMonth();
        month = (month + 1) > 9 ? (month + 1) : ('0' + (month + 1));
        var day = date.getDate();
        day = day > 9 ? day : ('0' + day);
        return year + '-' + month + '-' + day;
    }
});

changeColors = function (k, size, holidayPolicyId, attendTypeId, attendTypeName, unitTypeName, unitTypeValue) {
    //选中改变边框的粗细
    //alert(unitTypeName + "   " + unitTypeValue);
    //alert(k+"  "+size+"  "+attendTypeId+"  "+attendTypeName+"  "+unitTypeName+"  "+unitTypeValue)

    _unitType = unitTypeValue;
    for (i = -113; i < -110; i++) {
        if (k == i) {
            //$("#type_test").hide();
            $("#div" + i).css({"background-color": "#E4E4E4"}); //#F2F2F2  98bf21  #F39814-橙色   D9EDF7-浅蓝色  #E4E4E4-浅灰
            $("#div" + i).css({"border": "1px solid #428BCA"}); //#79BEF0
            //其他div颜色变白
            for (m = -113; m < -110; m++) {
                if (m != i) {
                    $("#div" + m).css({"background-color": "#FFFFFF"});
                    $("#div" + m).css({"border": "1px solid #E4E4E4"}); //边框变灰
                    //$("#div"+2).css({ "background-color":"#FFFFFF" });
                    //$("#div"+3).css({ "background-color":"#FFFFFF" });
                }
            }
            //设置假期类型字段的值
            $("#typeName").val(attendTypeName);
            $("#typeId").val(holidayPolicyId);//attendTypeId


        }

    }
    if (attendTypeName != jsBizMultLan.atsManager_AttendanceGroupShiftAddForm_i18n_20) {
        for (m = 0; m < unitTypeName; m++) {
            $("#div" + m).css({"background-color": "#FFFFFF"});
            $("#div" + m).css({"border": "1px solid #E4E4E4"}); //边框变灰
        }
        $("#atsShiftName").val('');
    }
    var that = this;

};
changeColor = function (k, size, holidayPolicyId, attendTypeId, attendTypeName, unitTypeName, unitTypeValue) {
    //选中改变边框的粗细
    //alert(unitTypeName + "   " + unitTypeValue);
    //alert(k+"  "+size+"  "+attendTypeId+"  "+attendTypeName+"  "+unitTypeName+"  "+unitTypeValue)

    _unitType = unitTypeValue;
    for (i = 0; i < size; i++) {
        if (k == i) {
            //$("#type_test").hide();
            if ($("#div" + i).css("background-color") != "rgb(228, 228, 228)") {
                $("#div" + i).css({"background-color": "#E4E4E4"}); //#F2F2F2  98bf21  #F39814-橙色   D9EDF7-浅蓝色  #E4E4E4-浅灰
                $("#div" + i).css({"border": "1px solid #428BCA"}); //#79BEF0
            } else {
                $("#div" + i).css({"background-color": "#FFFFFF"});
                $("#div" + i).css({"border": "1px solid #E4E4E4"});
                $("#atsShiftName").val('');
                $("#atsShiftId").val('');
                break;
            }
            //其他div颜色变白
            for (m = 0; m < size; m++) {
                if (m != i) {
                    $("#div" + m).css({"background-color": "#FFFFFF"});
                    $("#div" + m).css({"border": "1px solid #E4E4E4"}); //边框变灰
                    //$("#div"+2).css({ "background-color":"#FFFFFF" });
                    //$("#div"+3).css({ "background-color":"#FFFFFF" });
                }
            }
            atsShiftnum = -1;
            //设置假期类型字段的值
            $("#atsShiftName").val(attendTypeName);
            $("#atsShiftId").val(holidayPolicyId);//attendTypeId
            //再设置隐藏域(假期分类)的值
            $("#entries_policy_holidayType").val(attendTypeName);
            $("#entries_policy_holidayType_el").val(attendTypeId);

        }

    }
    var that = this;

};

getLocation = function (size) {
    var name = $("#searchKey").val();
    var falg = false;
    if (name) {
        for (i = 0; i < size; i++) {
            var getName = $("#div" + i).attr("value");
            if (getName.indexOf(name) != -1) {
                falg = true;
                if (atsShiftnum == -1) {
                    for (m = 0; m < size; m++) {
                        if (m != i) {
                            $("#div" + m).css({"background-color": "#FFFFFF"});
                            $("#div" + m).css({"border": "1px solid #E4E4E4"}); //边框变灰
                        }
                    }
                    var height = $("#div" + i).get(0).offsetTop;
                    $("#hts").get(0).scrollTop = height;
                    $("#div" + i).css({"background-color": "#E4E4E4"}); //#F2F2F2  98bf21  #F39814-橙色   D9EDF7-浅蓝色  #E4E4E4-浅灰
                    $("#div" + i).css({"border": "1px solid #428BCA"});
                    var atsShiftName = $("#div" + i).attr("value");
                    var atsShiftId = $("#div" + i).attr("valueId");
                    $("#atsShiftName").val(atsShiftName);
                    $("#atsShiftId").val(atsShiftId);//attendTypeId
                    atsShiftnum = i;
                    break;
                } else {
                    if (i > atsShiftnum) {
                        for (m = 0; m < size; m++) {
                            if (m != i) {
                                $("#div" + m).css({"background-color": "#FFFFFF"});
                                $("#div" + m).css({"border": "1px solid #E4E4E4"}); //边框变灰
                            }
                        }
                        var height = $("#div" + i).get(0).offsetTop;
                        $("#hts").get(0).scrollTop = height;
                        $("#div" + i).css({"background-color": "#E4E4E4"}); //#F2F2F2  98bf21  #F39814-橙色   D9EDF7-浅蓝色  #E4E4E4-浅灰
                        $("#div" + i).css({"border": "1px solid #428BCA"});
                        var atsShiftName = $("#div" + i).attr("value");
                        var atsShiftId = $("#div" + i).attr("valueId");
                        $("#atsShiftName").val(atsShiftName);
                        $("#atsShiftId").val(atsShiftId);//attendTypeId
                        atsShiftnum = i;
                        break;
                    }
                }
            }
            if (i == size - 1 && falg == true) {
                atsShiftnum = -1;
                i = -1;
            }
        }
    }
};

