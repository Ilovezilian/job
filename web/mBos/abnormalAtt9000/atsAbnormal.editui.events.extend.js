// 	在页面初始化加载之后
mbos('page').bind('afterLoad', function () {
    mbos('btns', 0).hide()
    _this.setTitle() // 设置标题
    _this.billID = mbos.getRequestParams().billID // 单据id
    var detail = JSON.parse(sessionStorage.getItem('exceptionAgencyDetail')) // 获取考勤异常的数据
    if (!detail) {
        _this.getDataInfo()
    } else {
        setBill(detail)
    }

    _this.billParam = { // 跳转页面的公共传参参数
        date: mbos('attendanceDate', 0).value(),
        abnormalId: encodeURIComponent((detail && detail.abnormalId || detail && detail.id )|| _this.billID),
        operateState: 'ADDNEW'
    }
})
// 根据数据渲染单据
function setBill(detail){
    mbos('attendanceDate', 0).value(detail.attendanceDate)
    mbos('attendanceProject', 0).value(detail.attendanceProject)
    mbos('result', 0).value(detail.attendanceValue + detail.attendanceCompany)
    mbos('monthEndDate', 0).value(detail.monthEndDate)
    mbos('shiftInfo', 0).value(detail.shiftDatil.scheduleShiftInfo[0].defaultShift.name)//班次信息
    mbos('actualWorkTime', 0).value(detail.realWorkTime.realWorkTime)
    _this.getShiftTime(detail)// 给 班次时间、核心工作时间 赋值
    if (detail.billState.value == 3){ // 状态为审批通过时 则隐藏按钮
        mbos('feedback',0).hide()
        mbos('bottomNavigation',0).hide()
    }
}
// 通过接口获取单据信息
_this.getDataInfo = function(){
    var param = [
        {
            showSort: "",
            attendanceStateCondition: "abnormalAttendance"
        }
    ]
    mbos.eas.invokeScript({
        name: 'attendanceInOffice',
        param: param,
        success: function (resp) {
            resp.map(function (item) {
                // 如果是考勤异常待办 state的状态重新取值
                if (item.id === _this.billID) {
                    setBill(item)
                }
            })
            _this.items = resp
        },
        error: function (res) { }
    })
}
// 给 班次时间、核心工作时间 赋值
_this.getShiftTime = function(detail){
    var scheduleShiftItems = detail.shiftDatil.scheduleShiftInfo[0].items
    if (scheduleShiftItems && scheduleShiftItems.length > 0) {
        var shiftTimeString = '' //班次时间
        var shiftCoreTimeString = '' //核心工作时间
        for (var i = 0; i < scheduleShiftItems.length; i++) {
            var lastItem = scheduleShiftItems[i]

            var preFloat = lastItem.preFloatAdjusted == null ? 0 : lastItem.preFloatAdjusted;
            var nextFloat = lastItem.nextFloatAdjusted == null ? 0 : lastItem.nextFloatAdjusted;

            var preTimeString = this.getTime(preFloat, lastItem.preDateTime, 'add')
            var nextTimeString = this.getTime(nextFloat, lastItem.nextDateTime, 'minus')
            shiftCoreTimeString += preTimeString + '-' + nextTimeString
            shiftTimeString += lastItem.preTime + '-' + lastItem.nextTime
            if (i !== scheduleShiftItems.length - 1) {
                shiftCoreTimeString += ';'
                shiftTimeString += ';'
            }
        }
        mbos('shiftTimeString', 0).value(shiftTimeString) //班次时间
        mbos('shiftCoreTimeString', 0).value(shiftCoreTimeString) //核心工作时间
    }
}

// 计算时间的浮点
_this.getTime = function (float, dateTime, flag) {
    var time = new Date(dateTime.replace(/-/g,'/')).getTime()
    var floatTime = Number(float) * 60 * 1000
    var tempPreDateTime = flag === 'add' ? new Date(time + floatTime) : new Date(time - floatTime)
    return tempPreDateTime.toTimeString().substring(0, 5)
}

// 设置标题
_this.setTitle = function(){
    var userName
    _this.title = localeResource.abnormal
    //   l1是英文 l2是中文 l3是繁体字
    switch (easContext.locale) {
        case 'en_US':
            userName = easContext.person.name.l1 || easContext.user.name.l1 || easContext.person.name.l2
            break;
        case 'en_TW':
            userName = easContext.person.name.l3 || easContext.user.name.l3 || easContext.person.name.l2
            break;
        default:
            userName = easContext.person.name.l2 || easContext.user.name.l2 || easContext.person.name.l2 || easContext.person.name
    }
    $(mbos('billTitle').element())[0].innerHTML = userName +  _this.title; // 配置单据标题；
}
// 处理单据
_this.handlerBill = function(event, method){
    var callback = function(){
        var param = [{billId: _this.billID}]
        mbos.eas.invokeScript({
            name: method,
            param: param,
            success: function (resp) {
                if (resp.success == true || resp == 'true') {
                    _this.changeState(param)
                } else {
                    mbos.msgBox.showError('error', localeResource.no_acceptable_items)
                }
            },
            error: function (res) {
                console.log(res)
            }
        })
    }
    _this.dailog(event, callback)
}
// 确认弹框
_this.dailog = function(event, cb){
    var text = event.target.innerText || event.currentTarget.innerText // 按钮内容
    mbos.ui.showConfirm({
        // title: "接受确认",
        detail: localeResource.markException + `<strong>${text}</strong>` + "?",
        iconclass: "kdfont kdfont-zhuangtai_jingshi the_info",
        callback: function (data) {
            console.log(data)
            if (data == 0) {
                cb()
            }
        }
    });
}
// 调接口 更改单据状态
_this.changeState = function(param) {
    mbos.eas.invokeScript({
        name: 'changeAbnormalAttendBillState',
        param: param,
        success: function (resp) {
            mbos.msgBox.showInfo(
                {
                    title: localeResource.succeed,
                    callback: function (data) {
                        history.go(-1);
                    }
                })
            // history.go(-1);
        },
        error: function (res) { }
    })
}

// 已反馈 按钮
_this.feedback = function(event){
    _this.handlerBill(event, 'feedBack') // feedBack是接口名称
}
// 接受异常 按钮
_this.accept = function(event){
    _this.handlerBill(event, 'receiveException') // receiveException是接口名称
}
// 异常处理 按钮
_this.exceptionHandling = function(event){

    if ($("#btns").css("display") !== 'none') {
        mbos('btns', 0).hide()
    } else {
        mbos('btns', 0).show()
    }
}
// 跳转请假页面
_this.leave = function(event){
    openPage('leave9000','leaveAdd.editui', _this.billParam)
}
// 跳转出差页面
_this.trip = function(event){
    openPage('trip9000','tripAdd.editui', _this.billParam)
}
// 跳转补卡页面
_this.fill = function(event){
    openPage('fill9000','fillAdd.editui', _this.billParam)
}
// 跳转异地办公页面
_this.offsite = function(event){
    openPage('otherOut9000','offsiteAdd.editui', _this.billParam)
}

_this.goOut = function(event){
    openPage('outside9000','offsiteAdd.editui', _this.billParam)
}

_this.homeworking = function(event){
    openPage('telecommute9000','offsiteAdd.editui', _this.billParam)
}

