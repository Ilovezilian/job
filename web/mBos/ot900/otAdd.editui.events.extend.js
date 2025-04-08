_this.pageinit = function () {
    var that = _this
    _this.editInit = []
    newPageInit(that)
}

// 过滤考勤地点F7 传递变量 ，adminOrgQuery为数据源的id
mbos('adminOrgQuery').bind('beforeLoad', function (e) {
    var params = setParams('getAtsAdminOrgUnitPlaceFilter', e.index)
    mbos.variable.setValue("v_entry", encodeURIComponent(JSON.stringify(params))); //赋值给变量
})
// 过滤加班原因F7
mbos('AtsOTReasonAvailable').bind('beforeLoad', function (e) {
    var params = setParams('getOverTimeReasonFilter', e.index)
    mbos.variable.setValue("v_entry", encodeURIComponent(JSON.stringify(params))); //赋值给变量
})
// 过滤加班类型F7
mbos('AtsOTTypeAvailable').bind('beforeLoad', function (e) {
    var params = setParams('getOverTimeTypeFilter', e.index)
    mbos.variable.setValue("v_entry", encodeURIComponent(JSON.stringify(params))); //赋值给变量
})
// 过滤补偿方式F7
mbos('AtsOTCompensAvailable').bind('beforeLoad', function (e) {
    var params = setParams('getOverTimeCompensFilter', e.index)
    mbos.variable.setValue("v_entry", encodeURIComponent(JSON.stringify(params))); //赋值给变量
})

// 	在页面初始化加载之后
mbos('page').bind('afterLoad', function () {
    _this.path = mbos.pageInfo.path// 轻应用的路径编码 例如 trip880
    _this.detailPageCode = mbos.pageInfo.name.replace('Add', 'View') // 详情页面的编码 (个别页面可特殊处理直接写入) 例如 tripView.editui
    _this.operateState = mbos.getRequestParams().operateState // 'ADDNEW' 'EDIT' 'VIEW'
    // 初始化审批流
    mbos('nextperson1').checkParticipantPerson({
        "callback": function () { }
    });
    //   单据说明
    mbos('description').bind('click', function () {
        handleClickDesc()
    })
    getDecimal()// 获取pc配置的小数点数
})

mbos('entries').bind('afterRendered', function (e) {
    _this.decimal = 4
    getBillDetail(e.index) // 编辑页面渲染数据
    getDateType(e.index)// 判断加班日期是单选还是多选还是日期区间
    mbos('entries_applyOTTime', e.index).value() && (mbos('entries_applyOTTime', e.index).value()).toFixed(_this.decimal)
    multiLangField(e.index)// 兼容多语言字段回显的问题
})
// 获取pc配置的小数点数 默认为小数点后两位
function getDecimal() {
    var callback = function (res) {
        _this.decimal = res.data.decimalPlaceSystem || 4
    }
    baseInterface('getDecimalPlace', callback) // 获取小数点数
}
// 判断加班日期是单选还是多选还是日期区间
function getDateType(i) {
    var entry = mbos('entity').data.entries[i] // 当前明细数据
    if (mbos('theOtDate', 0).$attrs.datemulti == 'true') {
        _this.otDateType = 'dateMulti'
        _this.isMulDays = true
        mbos('entries.attAdminOrgUnit', i).hide() // 多日期隐藏考勤地点
    } else if (mbos('theOtDate', 0).$attrs.datescope == 'true') {
        _this.otDateType = 'dateScope'
        _this.isMulDays = true
        mbos('entries.attAdminOrgUnit', i).hide() // 多日期隐藏考勤地点
    } else {
        _this.otDateType = 'dateSingle'
        _this.isMulDays = false
        entry.isMulDays = false
        mbos('theOtDateCoordinate', i).hide() // 单日期隐藏跨天
        $('#theOtTime_' + i + ' .tooltip1').hide() // 单日期隐藏时间提示
        mbos('theOtDateCoordinate', i).attr("mustinput", false) // 取消必填校验
    }
    if (mbos.getRequestParams().operateState === "ADDNEW") {
        //   给【是否跨天】赋默认值【不跨天】
        mbos('theOtDateCoordinate', i).value({ "value": "theDayNow", "alias": localeResource.just_today })
    }
}
// 将时间格式化为时分
function getHMTime(time) {
    return moment(time).format('HH:mm')
}
// 编辑页面渲染数据
function getBillDetail(i) {
    var entry = mbos('entity').data.entries[i]
    entry.otDate && mbos('theOtDate', i).value(moment(entry.otDate).format('YYYY-MM-DD'))
    if (!_this.isMulDays) { getDateType(i) } // 未初始化时 _this.isMulDays可能为undefined
    console.log(entry.startTime, i, entry.endTime, mbos('entity').data.entries)
    if (_this.isMulDays) { // 多日期 时间的格式为时分
        entry.endTime && mbos('theOtTime', i).value(getHMTime(entry.startTime) + '~' + getHMTime(entry.endTime))
        entry.restStartTime && mbos('theRestInterval', i).value(getHMTime(entry.restStartTime) + '~' + getHMTime(entry.restEndTime))
        entry.restStartTime2 && mbos('theRestInterval2', i).value(getHMTime(entry.restStartTime2) + '~' + getHMTime(entry.restEndTime2))
    } else {
        entry.restTime &&  mbos('restTime', i).value(entry.restTime)
        entry.endTime && mbos('theOtTime', i).value(entry.startTime + '~' + entry.endTime)                        // 给加班时间赋值
        entry.restStartTime && mbos('theRestInterval', i).value(entry.restStartTime + '~' + entry.restEndTime)      // 给休息时间赋值
        entry.restStartTime2 && mbos('theRestInterval2', i).value(entry.restStartTime2 + '~' + entry.restEndTime2)  // 给休息时间2赋值
    }
}
// 保存按钮
_this.save = function (event) {
    setModel()
    baseInterface('save', toView) // 调用保存接口
}
// 提交按钮
_this.submit = function (event) {
    // 确认提交 弹框
    mbos.ui.showConfirm({
        title: localeResource.confirmSubmit,
        iconclass: "kdfont kdfont-zhuangtai_jingshi the_info",
        callback: function (data) {
            if (data == 0) {
                setModel()
                baseInterface('submit', toView) // 调用提交接口
            }
        }
    });

}

// 点击“保存、提交” 跳转页面
function toView(res) {
    // 提交接口 返回的res.data为数组，取第一条数据
    if (res.data.keyValue || (res.data.length > 0 && res.data[0].keyValue)) {
        // 操作成功 提示弹框
        mbos.ui.showInfo({
            title: localeResource.succeed,
            iconclass: "kdfont kdfont-zhuangtai_wancheng the_success",
            callback: function () {
                openPage(_this.path, _this.detailPageCode, { billID: res.data.keyValue || res.data[0].keyValue })
            }
        });

    }
}
// 给隐藏的model赋值
function setModel() {
    if (typeof _this.operateState != "undefined" && (_this.operateState === "ADDNEW" || _this.operateState === "EDIT")) {
        var entries = mbos('entity').data.entries
        entries.map(function (entry, index) {
            entry.person = easContext.person
            entry.position = easContext.position.id
            entry.adminOrgUnit = easContext.position.adminOrgUnit.id
            getEntries(entry, index) // 各单据处理分录数据
        })
    }
}
// 各单据处理分录数据的函数
function getEntries(entry, i) {
    //   跨天方式
    if (mbos('theOtDateCoordinate', i).value()) {
        entry.theOtDateCoordinate = mbos('theOtDateCoordinate', i).value().value
    }
    entry.isMulDays = _this.isMulDays
    entry.otDate = _this.isMulDays ? entry.dynamic_Field1 && entry.dynamic_Field1.split(',')[0] : entry.otDate || entry.theOtDate || mbos('theOtDate', i).value() // 加班日期
    // 【BT-01701321】【V9.0第一轮集成测试】移动端撤回加班单后修改休息时间再提交，休息时间和加班小时数不正确。修改为休息时长60min后，再修改为休息时间0，提交后休息时间还是60
    if(entry.restTime === undefined){
        entry.restTime = ''
    }
}
// 单日期 获取默认加班类型和补偿方式
function getOverTimeTypeAndOtCompens(index) {
    var callback = function (res) {
        if (res.data) {
            if (res.data.otTypeValue && res.data.otTypeText){
                mbos('entries_otType', index).value({ id: res.data.otTypeValue, name: res.data.otTypeText })
            } else {
                mbos.ui.showError(localeResource.checkShift)
            }
            res.data.compensInfo && mbos('entries_otCompens', index).value(res.data.compensInfo)
        }
    }
    setModel()
    baseInterface('getOverTimeTypeAndOtCompens', callback, index)
}
// 单日期 获取加班班次
function getMyScheduleTime(index) {
    var callback = function (res) {
//     默认班次存在则显示 不存在则隐藏
        if (res.data && res.data.defaultShift && res.data.defaultShift.name) {
            document.getElementById('attendanceShift_' + index).innerText = `${res.data.defaultShift.name}`
            $('#attendanceShift_' + index).css('display', 'flex')
        } else {
            document.getElementById('attendanceShift_' + index).innerText = ''
            $('#attendanceShift_' + index).css('display', 'none')
        }
    }
    setModel()
    baseInterface('getMyScheduleTime', callback, index)
}
// 根据起始时间计算休息分钟数
function getDiffMinites(sTime, eTime, hour) {
    if (sTime && eTime) {
        // 通过正则将'-'改为'/'(ios系统不认得'-'却认得'/')
        var date1 = new Date(sTime.replace(/-/g, '/')).getTime()
        var date2 = new Date(eTime.replace(/-/g, '/')).getTime()
        if (sTime.split(' ')[1] && date1 > date2) { // 单日期 计算时间才需要判断
            mbos.ui.showError(hour ? localeResource.ot_tips : localeResource.rest_tips)
            return
        }
        return hour ? Math.abs((date2 - date1) / 1000 / 60 / 60) : Math.abs((date2 - date1) / 1000 / 60)
    }
}
// 获取默认休息时间
function getDefaultRestTime(index) {
    var entry = mbos('entity').data.entries[index] // 当前明细数据
    var callback = function (res) {
        if (res.data) {      //         如果无值则渲染 有值则不予更改，用户手动填写的数据优先级最高
            if (!mbos('theRestInterval', index).value()) {
                if (res.data.restEndTime) {
                    entry.restTime = res.data.restTime
                    mbos('theRestInterval', index).value(res.data.restStartTime + '~' + res.data.restEndTime)
                } else {
                    // mbos('theRestInterval', index).value('')
                    entry.restStartTime = ''
                    entry.restEndTime = ''
                }
            }
            //     休息时间2    如果无值则渲染 有值则不予更改，用户手动填写的数据优先级最高
            if (!mbos('theRestInterval2', index).value()) {
                if (res.data.restEndTime2) {
                    entry.restTime = res.data.restTime
                    !mbos('theRestInterval2', index).value() && mbos('theRestInterval2', index).value(res.data.restStartTime2 + '~' + res.data.restEndTime2)
                } else {
                    // mbos('theRestInterval2', index).value('')
                    entry.restStartTime2 = ''
                    entry.restEndTime2 = ''
                }
            }
            entry.applyOTTime = ((entry.otIntervalLength * entry.days - (entry.restTime || 0) / 60) || 0).toFixed(_this.decimal) // 加班时长


        }
    }
    if (_this.otDateType == 'dateSingle' && entry.theOtDate) {
        setModel()
        baseInterface('getMyRestTime', callback, index)
    }
}
// 单日期时判断”加班类型“是否是被禁用
function isDisabledDateType(otDate, index) {
    var callback = function (res) {
        if (res.data.otrolByDateType) {
            mbos('entries_otType', index).disable() // 如果返回为true 则禁用
        } else {
            mbos('entries_otType', index).attr('disabled', false)
        }
    }
    if (otDate) {
        setModel()
        baseInterface('getAttencePolicyInfo', callback, index)
    }
}
/**
 * @description: 根据开始日期结束日期的时区，获取逗号拼接的日期字符串
 * @return {String}
 */
function getDates(sDate, eDate) {
    var list = [sDate]
    var value = sDate
    while (value < eDate) {
        value = moment(value).add(1, 'days').format('YYYY-MM-DD')
        list.push(value)
    }
    return list.join(',')
}
// 非单日期 日期change事件
function multiDateChange(dateString, entry, index) {
    entry.isMulDays = true
    entry.otDates = dateString
    entry.theOtDateCoordinate = 'theDayNow'
    entry.days = dateString.split(',').length // 天数
    entry.restTime = (getDiffMinites(entry.restStartTime, entry.restEndTime) + getDiffMinites(entry.restStartTime2, entry.restEndTime2)) * entry.days || 0
    entry.applyOTTime = ((entry.otIntervalLength * entry.days - entry.restTime / 60) || 0).toFixed(_this.decimal)

    // 校验多选日期是否是同一时间类型 如果不是则清空
    var callback = function (res) {
        if (res.data && !res.data.isSameDay) {
            mbos.ui.showError({
                title:  localeResource.tips,
                detail: localeResource.diff_type_tips,
                iconclass: "kdfont kdfont-zhuangtai_jingshi the_info",
                callback: function (data) {
                    mbos('theOtDate', index).value(''); // 先清空
                    mbos('theOtDate', index).open(); // 再自动打开弹框
                }
            });
        }
    }
    if (entry.days > 1) {
        setModel()
        baseInterface('getDateTypeIsSame', callback, index) // 校验多选日期是否是同一时间类型
    }
    // mbos('theOtTime', index).timeFormat("HH:mm")
}
/**
 * @description: 监听加班日期；
 * 单日期则改变 加班开始/结束时间、加班时间；
 休息开始/结束时间、休息时间；
 休息时长、加班时长
 加班类型\加班补偿方式\加班日期班次
 *
 * 多选日期/时间区间 则改变：休息时长、加班时长
 *
 1、pc端配置的默认加班时间；
 2、默认休息时间；
 3、加班类型、补偿方式接口；
 4、带出对应班次；
 【以上接口仅单日期触发】 【EDIT页面初始化时，不调以上4个接口】
 * @return {*}
 */
_this.otDateChange = function (event) {
    var index = event.index
    var entry = mbos('entity').data.entries[index] // 当前明细数据
    var theOtDate = event.new_value // 加班日期
    if (!_this.otDateType) {
        getDateType(index)
    }
    if (!theOtDate) {
        mbos('theOtTime', index).value('')
        return
    }
    var otDateType = _this.otDateType // 日期类型
    if (otDateType == 'dateScope') { // 日期区间
        if (theOtDate) {
            var sDate = moment(theOtDate.split('~')[0]).format('YYYY-MM-DD')
            var eDate = theOtDate.split('~')[1] ? theOtDate.split('~')[1] : sDate
            theOtDate = getDates(sDate, eDate)
            multiDateChange(theOtDate, entry, index)
        }
    } else if (otDateType == 'dateMulti') { // 多选日期
        multiDateChange(theOtDate, entry, index)
    } else if (otDateType == 'dateSingle') { // 单选日期
        if (event.new_value && event.old_value && moment(event.new_value).format('YYYY-MM-DD') === moment(event.old_value).format('YYYY-MM-DD')) return
        theOtDate = moment(theOtDate).format('YYYY-MM-DD')
        entry.otDate = theOtDate
        entry.theOtDate = theOtDate
        entry.isMulDays = false
        getMyScheduleTime(index) // 加班班次
        isDisabledDateType(theOtDate, index)  // 待更新到外网
        entry.days = 1
        if (!entry.startTime && !entry.endTime) {
            // 加班时间【00:00】 二开用户可自定义
            mbos('theOtTime', index).value(theOtDate + ' 00:00~' + theOtDate + ' 00:00') // 给加班时间赋默认值
        }
        getOverTimeTypeAndOtCompens(index) // 加班类型&补偿类型
        getDefaultRestTime(index) // 获取默认休息时间
    }
}
/**
 * @description: 监听加班时间：默认休息时间（调接口）
 * @event: applyOTTime = otIntervalLength - restTime => 加班时长 = 跨度时长 - 休息时长
 * @return {*}
 */
_this.otTimeChange = function (event) {
    var index = event.index
    var theOtTime = event.new_value // 加班时间
    var startTime = theOtTime.split('~')[0]
    var endTime = theOtTime.split('~')[1]
    var entry = mbos('entity').data.entries[index] // 当前明细数据
    _this.anyDate = entry.otDates && entry.otDates.split(',')[0] || '2020-01-01' // 仅作拼接使用 无任何意义
    if (!theOtTime) {
        entry.applyOTTime = 0
    }
    startTime = _this.isMulDays ? _this.anyDate + ' ' + startTime : startTime // 确保 格式为年月日时分
    endTime = _this.isMulDays ? _this.anyDate + ' ' + endTime : endTime // 确保 格式为年月日时分   同一天
    if (startTime > endTime) { // 跨天
        var tomorrow = moment(_this.anyDate).add(1, 'days').format('YYYY-MM-DD')
        endTime = _this.isMulDays ? tomorrow + ' ' + endTime : endTime  // 确保 格式为年月日时分
    }

    entry.startTime = startTime // 赋值加班开始时间
    entry.endTime = endTime // 赋值加班结束时间
    entry.otIntervalLength = getDiffMinites(startTime, endTime, 'hour') // 加班的一天跨度时长

    if (!entry.days) entry.days = 1
    entry.applyOTTime = ((entry.otIntervalLength * entry.days - (entry.restTime || 0) / 60) || 0).toFixed(_this.decimal) // 加班时长

    if (mbos.getRequestParams().operateState !== 'EDIT' || _this.init) {
        getDefaultRestTime(index) // 更新休息时间
    } else {
        _this.init = true
    }
}
/**
 * @description: 监听【休息时间1】改变时长
 * @event:
 * @return {*}
 */
_this.restTimeChange = function (event) {
    restChange(event, "restStartTime", "restEndTime", "restTime1")
}

// 监听【休息时间2】改变时长
_this.restTimeChange2 = function (event) {
    restChange(event, "restStartTime2", "restEndTime2", "restTime2")
}
// 休息时间控件监听 start, end, time分别为对应的字段名
function restChange(event, start, end, time) {
    var index = event.index
    //   如果两个休息时间都为空，则时间长度可编辑；否则不可编辑
    if (!mbos('theRestInterval', index).value() && !mbos('theRestInterval2', index).value()) {
        mbos('entries_restTime', index).enable()
    } else {
        mbos('entries_restTime', index).disable()
    }

    _this.anyDate = '2020-01-01' // 仅作拼接使用 无任何意义

    var theRestInterval = event.new_value // 休息时间
    var startTime = theRestInterval.split('~')[0]
    var endTime = theRestInterval.split('~')[1]
    var entry = mbos('entity').data.entries[index] // 当前明细数据

    var notToday = startTime > endTime  // 如果开始时间大于结束时间则表示跨天了
    entry[start] = _this.isMulDays ? _this.anyDate + ' ' + startTime : startTime // 确保 格式为年月日时分
    var tomorrow = moment(_this.anyDate).add(1, 'days').format('YYYY-MM-DD')
    entry[end] = _this.isMulDays ? (notToday ? tomorrow + ' ' + endTime : _this.anyDate + ' ' + endTime) : endTime // 确保 格式为年月日时分
    entry[time] = theRestInterval ? getDiffMinites(entry[start], entry[end]) * (entry.days || 1) : 0
    if (entry.restTime1 == 0 && entry.restTime2 == 0) {
        entry.restTime = entry.restTime || 0
    } else {
        entry.restTime = (entry.restTime1 || 0) + (entry.restTime2 || 0)
    }

    entry.applyOTTime = ((entry.otIntervalLength * entry.days - entry.restTime / 60) || 0).toFixed(_this.decimal) // 加班时长

}
// 休息时长改动
_this.restLengthChange = function (event) {
    var index = event.index
    var entry = mbos('entity').data.entries[index] // 当前明细数据
    if (mbos('entries_applyOTTime', index).value()) {
        entry.applyOTTime = (entry.otIntervalLength * entry.days - (event.new_value || 0) / 60 || 0).toFixed(_this.decimal)
    }
}

