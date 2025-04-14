// setTimeout(function(){

_private.tripStartTime = undefined;
_private.tripEndTime = undefined;
// _private.tripType = {"name":"国内","id":"0kB0QjzlQDG7EhWQJo2p3Re3I9k=","fnumber":"001"}, // "国内";
_private.tripType = "0kB0QjzlQDG7EhWQJo2p3Re3I9k=",
_private.tripStartPlace = undefined;
_private.tripEndPlace = undefined;
_private.tripReason = undefined;
_private.tripDays = 0;

_private.appid = "";
_private.eid = "";
_private.path = "";
_private.personName = "";
_private.hostname = "";
_private.initializeData = function () {
    _private.appid = mbos.getRequestParams().appid;
    _private.eid = mbos.getRequestParams().eid;
    _private.path = mbos.getRequestParams().path;
    _private.hostname = "";
    _private.storeEid = mbos.getRequestParams().storeEid;
    //_private.tripDate = mbos.getRequestParams().tripDate + "  00:00";
}
//假勤参数
_private.atsParams = undefined;
_private.getTripTypes = function () {
    // 出差类型
    mbos.eas.invokeScript({
        name: "billOptionHrOrgFilter",
        param: [{
            billType: 'trip',
            attendanceDate: mbos('tripStartTime').value().split(' ')[0] || '2018-07-10'
        }],
        success: function (resp) {
            var data = resp.tripType,   str = '';
            var defaultTripType=data[0]
            for(var i=0;i<data.length;i++){
                str += "<li class='radio' type-id='" + data[i].id + "' >" + data[i].name + "</li>"
                var fnumber=parseInt(data[i].fnumber)
                var defaultTripTypefnumber=parseInt(defaultTripType.fnumber)
                if(!isNaN(fnumber)&&!isNaN(defaultTripTypefnumber)){
                    if(fnumber<defaultTripTypefnumber){
                        defaultTripType=data[i]
                    }
                }else{
                    if(data[i].fnumber<defaultTripType.fnumber){
                        defaultTripType=data[i]
                    }
                }
            }
            $('.tripTypes .tripCont').html(str);
            if(mbos.getRequestParams().param){
                var tripTypeId=JSON.parse(mbos.getRequestParams().param).tripTypeId
                var type = resp.tripType.filter(function (item) {
                    return item.id === tripTypeId;
                })[0];
                if (type) {
                    _private.tripType = type.id;
                    $('.tripType').html(type.name);
                }else{
                    _private.tripType = defaultTripType.id;
                    $('.tripType').html(defaultTripType.name);
                }
            }else{
                _private.tripType = defaultTripType.id;
                $('.tripType').html(defaultTripType.name);
            }




        },
        error: function (err) {
            mbos.ui.showInfo({
                title: "获取出差类型失败！",
                msg: err.detail
            })
        }
    })
}
_self.pageinit = function () {
    //   	初始化开始、结束时间
    _private.initDate()
    // 将平台日期时间控件修改自己的控件
    _private.dateTimePicker()
    $("#tripStartPlace").click(function () {
        $('#tripStartPlace input').blur();
        citypicker('#tripStartPlace');
    });
    $("#tripEndPlace").click(function () {
        $('#tripEndPlace input').blur();
        citypicker('#tripEndPlace');
    })
    $('#tripStartPlace input').attr('readonly', 'readonly');
    $('#tripEndPlace input').attr('readonly', 'readonly')
    mbos.getRequestParams().operateState = 'ADDNEW';
    _private.registerDefaultEvent("onStateChange", "stateChange");
    //兼容外部传入界面状态
    page.setOperateState(mbos.getRequestParams().operateState);
    mbos.$eventbus.fire("page", "afterRendered");
    _private.placeholderInit();

    if (mbos.getRequestParams().operateState === 'ADDNEW') {

        _private.initializeData();
        //获取考勤参数
        _private.atsParams = _private.getAtsParams();

        //将bosType设置为主表AtsLeaveBill的bosType值
        page.getEditData().bosType = "2A78C372";
        //创建主表对应的info
        page.createData();
        //初始化编辑页面默认值
        _private.initText();
        //初始化编辑页面默认值
        // _private.initFieldValue();

        //初始化之后设置提交按钮不可用
        _private.submitButtonState();
        //加多选框 的样式
        $('div F7').after("<div class='caret-F7 overBill-caret-F7'></div>");

        // var transport = '';
        var type = 1;
        // $('.shadow, .tripTypes').on('click', function () {
        //     $(this).hide();
        // })
        // $('.cont').delegate('li', 'click', function () {
        //     $('.shadow').hide();
        //     transport = this.innerHTML;
        //     if (type === 1) {
        //         $('.tripStartTransport').html(transport);
        //     } else {
        //         $('.tripEndTransport').html(transport);
        //     }
        // })
        // $('.tripCont').delegate('li', 'click', function () {
        //     $('.tripTypes').hide();
        //     $('.tripType').html(this.innerHTML);
        //     _private.tripType = $(this).attr("type-id");
        // })
        // 选择交通工具
        // $('.tripStartTransport').on('click', function () {
        //     $('.shadow').show();
        //     type = 1;
        // });
        // $('.tripEndTransport').on('click', function () {
        //     $('.shadow').show();
        //     type = 2;
        // });
        // setTimeout(function(){

        // },300)

        // $('.tripType').on('click', function () {
        //     $('.tripTypes').show();
        // });


        $('#text').remove();
        if(mbos.getRequestParams().stat||mbos.getRequestParams().billID){
            setTimeout(function(){
                if(mbos.getRequestParams().billID){//流程助手打回修改
                    var param = [{
                        showSort: ''
                    }];
                    mbos.eas.invokeScript({
                        name:"getSetIsCtrlHalfDayOff",
                        param:param,
                        success:function(resp){
                            var isHalfDayOff = resp.isHalfDayOff;
                            var pmBeginTime = resp.pmBeginTime;
                            var amBeginTime = resp.amBeginTime;
                            var pmEndTime = resp.pmEndTime;
                            var amEndTime = resp.amEndTime;

                            mbos.getRequestParams().am = amBeginTime+","+amEndTime;
                            mbos.getRequestParams().pm = pmBeginTime+","+pmEndTime;
                            mbos.getRequestParams().stat="edit";
                            var success = function(data){
                                console.log(data);
                                // JSON.stringify(item)
                                var info = {
                                    applyDate: data.applyDate.substring(0,10),
                                    applyPersonId: data.proposer.id,
                                    beginTime: data.entries[0].tripStartTime.substring(0,16),
                                    billId: data.id,
                                    billType: "tripBill",
                                    endTime: data.entries[0].tripEndTime.substring(0,16),
                                    name: "出差申请",
                                    personId: data.entries[0].person.id,
                                    realBeginTime: data.entries[0].realTripStartTime.substring(0,16),
                                    realEndTime: data.entries[0].realTripEndTime.substring(0,16),
                                    realTripDays: data.entries[0].realTripDays,
                                    state: data.billState.alias,
                                    tripDays: data.entries[0].tripDays,
                                    tripEndPlace: data.entries[0].tripEndPlace,
                                    tripEndTransport: data.entries[0].tripEndTransport,
                                    tripReason: data.entries[0].tripReason,
                                    tripStartPlace: data.entries[0].tripStartPlace,
                                    tripStartTransport: data.entries[0].tripStartTransport,
                                    tripTypeId: data.entries[0].tripType.id,
                                    unit: "天"
                                }
                                mbos.getRequestParams().param = JSON.stringify(info);
                                _private.getDetail();//s-hr打回修改
                            }
                            var fail = function(data){
                                mbos.msgBox.showError("获取出差单信息失败！");
                            }
                            mbos.eas.invokeScript("getBillInfo",[mbos.getRequestParams().billID],success,fail);
                        },
                        error:function(res){
                        }
                    });
                }else{
                    _private.getDetail();//s-hr打回修改
                }
            },200)
        }
        //$('div kddatepicker').after("<div class='caret-date overBill-caret-date'></div>");
    }
    mbos("htmlContent2").hide();
    mbos("htmlContent1").hide();
}
mbos('page').bind('onCreateData', function () {
    _private.tripDate = mbos.getRequestParams().tripDate;
    if (_private.tripDate) {
        mbos('entity').value().tripStartTime = _private.tripDate + "  00:00";
        mbos('tripStartTime').timeFormat('YYYY-MM-DD hh:mm');

        mbos('entity').value().tripEndTime = _private.tripDate + "  00:00";
        mbos('tripEndTime').timeFormat('YYYY-MM-DD hh:mm');
    }
});
_private.getAtsParams = function () {
    var params = [];
    var param = {};
    params[0] = param;
    var success = function (data) {
        var errorMsg = data.errorMsg;
        if (errorMsg != undefined && errorMsg != null && errorMsg != '') {
            _private.atsParams = false;
            mbos.msgBox.showError(errorMsg);
        } else {
            _private.atsParams = true;
        }
        // _private.getTripTypes();
        mbos("htmlContent8").hide();
        _this.timeChange() //对默认时间计算出差时长
                       //弹性段算时长
        _private.generateIsElasticCalLen();
        console.log(_private.atsParams,"_private.atsParams")
    }
    var fail = function (data) {
        _private.atsParams = false;
        mbos.msgBox.showError("获取假期档案/考勤档案失败！");
    }
    mbos.eas.invokeScript("getAtsParams", params, success, fail);
    return _private.atsParams;
}
// _private.initFieldValue = function(data){
//   	mbos.$model("tripTypeQuery").get();
//   	mbos.$eventbus.bind("tripTypeQuery","afterLoad",
//   	function(data){
//   	data = mbos.$model("tripTypeQuery").data;
//   	//var size = data.size;
//   	_private.tripType = data.list[0].id;
//   	_private.tripTypeName = data.list[0].name;
//   	mbos.$model('entity').data.tripType = {id:_private.tripType ,name: _private.tripTypeName};
//   	mbos.ng.$digest();
//   	});
// }
var billId = '';
_private.getDetail = function () {
    // 查看单据
    var p = mbos.getRequestParams().stat;
    var dataa = mbos.getRequestParams().param ? JSON.parse(mbos.getRequestParams().param) : {};

    if (p == 'view') {
        $('#htmlContent6').show();
        if ( (!dataa.state || dataa.state === '未审批') && !mbos.getRequestParams().billID) {
            $('#submit').find('button').text('撤回');
            $('#submit').show();

        } else {
            $('#submit').hide();
        }
    } else {
        $('#htmlContent6').hide();
        $('#submit').show();
    }
    var data = JSON.parse(mbos.getRequestParams().param);
    billId = data.billId;

    mbos('tripDays').value(data.realTripDays);
    _private.tripDays = data.realTripDays;
    mbos('tripStartPlace').value(data.tripStartPlace);
    mbos('tripEndPlace').value(data.tripEndPlace);
    $('.tripStartTransport').html(data.tripStartTransport);
    $('.tripEndTransport').html(data.tripEndTransport);
    $('#note').val(data.tripReason || '（空）');
    _private.submitButtonState()
    mbos.eas.invokeScript({
        name: "getApproveHistory",
        param: [{
            billId: data.billId
        }],
        success: function (resp) {
            mbos('tripStartTime').value(data.realBeginTime);
            mbos('tripEndTime').value(data.realEndTime);
            if (resp.length > 0) {
                var str = '';
                resp.forEach(function (item) {
                    str += '<li class="pItem"><span class="s0"></span><span class="s1">' + item["MultiApprove.isPass"].alias + '</span><span class="s3">' + item["personId.name"] + '</span><span class="s4">' + item["MultiApprove.createTime"] + '</span></li>';
                })
                $('.process').html(str).show();
            }
        },
        error: function (err) {

        }
    })
}
_private.initText = function () {
    //去除输入框右边的可编辑标识
    //$('#tripStartTime .glyphicon,#tripEndTime .glyphicon,#tripType .glyphicon').remove();
    // 去除出差类型后面的标识
    $('#tripType .glyphicon').remove();

    // var tripTimeHtml = "<span class='star'>出差时长</span><div style='float: right'><div id='tripDays'>" + _private.tripDays + "</div><span>天</span></div>";
    // 初始化出差时长
    // setTimeout(function () {
    //     $('#htmlContent5').html(tripTimeHtml);
    // })
}


_private.tripBillSubmit = function (event) {
    var vali = mbos.ng.invokeAllScope("validate",{method:"submit"});
    if (!vali) {
        return;
    }
    var dataa = mbos.getRequestParams().param ? JSON.parse(mbos.getRequestParams().param) : {};
    if (dataa.state === '未审批' && !mbos.getRequestParams().billID ) {
        // 单据撤回
        mbos.eas.invokeScript({
            name: "billWithDraw",
            param: [{
                billId: dataa.billId,
                billType: 'tripBill',
            }],
            success: function (resp) {
                if (resp.isSuccess) {
                    $('#htmlContent6').hide();

                    mbos.msgBox.showInfo('撤回成功!',
                        function () {
                            sessionStorage.setItem("ttqingBillType","tripBill")
                            window.location.href = '/mbos/page/loadPage?storeEid=4000148&appid='+_private.appid+'&eid=' + _private.eid + '&path=ttqin850sp1&name=route.custom#/cD';
                        })
                } else {
                    mbos.msgBox.showError(resp.msg);
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    } else {

        // dialog.show('sssssss');
        var dataSubmit = {};
        dataSubmit.bosType = "2A78C372";
        var _fn = function () {
            var params = [];
            var param = {};
            var tripStartTime = _private.tripStartTime;
            var tripEndTime = _private.tripEndTime;
            param.tripStartPlace = $('#tripStartPlace input').val();
            param.tripEndPlace = $('#tripEndPlace input').val();
            param.tripType = _private.tripType || $('.tripType').html();
            param.tripStartTime = tripStartTime; //
            param.tripEndTime = tripEndTime; //
            param.tripDays = mbos('tripDays').value() ? mbos('tripDays').value().toString() : _private.tripDays;
            param.tripStartTransport = $('.tripStartTransport').text();
            param.tripEndTransport = $('.tripEndTransport').text();
            //param.tripReason = _private.tripReason;
            param.tripReason = $('#note').val();
            param.id = billId;
            params[0] = param;
            var success = function (data) {
                var errorMsg = data.errorMsg;
                var atsTripBillInfo = data;
                if (errorMsg != undefined && errorMsg != null) {
                    mbos.msgBox.showError(errorMsg);
                } else {
                    if (atsTripBillInfo != undefined && atsTripBillInfo != null) {
                        dataSubmit = _private.getEditData(atsTripBillInfo);
                        dataSubmit.workflowNextPerson = mbos('entity').data.workflowNextPerson;
                        dataSubmit.id = billId;
                        mbos.post({
                            url: "/mbos/editpage/submit",
                            param: {
                                "bostype": page.getEditData().bosType,
                                "uiname": mbos.getRequestParams().name,
                                "model": JSON.stringify(dataSubmit)
                            },
                            success: function (data) {
                                mbos.msgBox.showError('出差申请已提交',
                                    function () {
                                        sessionStorage.setItem("ttqingBillType","tripBill")
                                        window.location.href = '/mbos/page/loadPage?storeEid=4000148&appid='+_private.appid+'&eid=' + _private.eid + '&path=ttqin850sp1&name=route.custom#/cD';
                                    });
                            },
                            error: function (data) {
                                if (typeof (data) == "string") {
                                    mbos.msgBox.showError("", data);
                                } else {
                                    mbos.msgBox.showError(data);
                                }
                            }
                        });
                    }
                }
            }
            var fail = function (data) {
                var detail = data.detail;
                if (detail != null && detail != '' && detail.length > 0) {
                    mbos.msgBox.showError(detail);
                } else {
                    mbos.msgBox.showError("出差申请校验失败！");
                }
            }
            mbos.eas.invokeScript("beforeSubmit", params, success, fail);
        }
        mbos.eas.invokeScript({
            name: "billAttendanceCheck",
            param: [{
                billType: 'trip',
                beginDate: mbos('tripStartTime').value().split(' ')[0],
                endDate: mbos('tripEndTime').value().split(' ')[0]
            }],
            success: function (resp) {
                if (!resp.returnResult) {
                    mbos.msgBox.showError(resp.returnMsg, function () {
                        mbos('nextperson1').checkParticipantPerson({
                            editdata: dataSubmit,
                            callback: _fn
                        });
                    });
                } else {
                    mbos('nextperson1').checkParticipantPerson({
                        editdata: dataSubmit,
                        callback: _fn
                    });
                }
            },
            error: function (err) {
                console.log(err)
            }
        })
    }

}
_private.getEditData = function (data) {
    //获取用户自定义扩展字段
    var editData = page.getEditData();
    //为了防止将这些字段删除时引发控件值改变事件，需要先将数据存起来
    _private.tripStartTime = editData.tripStartTime;
    _private.tripEndTime = editData.tripEndTime;
    _private.tripType = editData.tripType;
    _private.tripStartPlace = editData.tripStartPlace;
    _private.tripEndPlace = editData.tripEndPlace;
    _private.tripReason = editData.tripReason;
    _private.tripDays = editData.tripDays;
    _private.tripStartTransport = editData.tripStartTransport;
    _private.tripEndTransport = editData.tripEndTransport;
    //删除掉固定字段
    delete editData.id;
    delete editData.entries;
    delete editData.tripStartTime;
    delete editData.tripEndTime;
    delete editData.tripType;
    delete editData.tripStartPlace;
    delete editData.tripEndPlace;
    delete editData.tripEndTransport;
    delete editData.tripStartTransport;
    delete editData.tripReason;
    delete editData.tripDays;
    //移除无关字段
    for (var x in editData) {
        if (x.startWith("dynamicproperty")) {
            delete editData[x.toString()];
        }
    }
    //构造提交的info
    var dataSubmit = {};
    //构造提交的单据info
    var entry = data.entries;
    dataSubmit.hrOrgUnit = data.hrOrgUnit;
    dataSubmit.proposer = data.proposer;
    dataSubmit.adminOrg = data.adminOrg;
    dataSubmit.applyDate = data.applyDate;
    dataSubmit.bizDate = data.bizDate;
    dataSubmit.billType = data.billType;
    dataSubmit.number = data.number;
    dataSubmit.billState = data.billState;
    dataSubmit.bosType = "2A78C372";
    var entryArray = [];
    var entryInfo = {};
    entryInfo.adminOrgUnit = entry.adminOrgUnit;
    entryInfo.attAdminOrgUnit = entry.attAdminOrgUnit;
    entryInfo.person = entry.person;
    entryInfo.position = entry.position;
    entryInfo.tripStartPlace = entry.tripStartPlace;
    entryInfo.tripEndPlace = entry.tripEndPlace;
    entryInfo.tripStartTransport = entry.tripStartTransport;
    entryInfo.tripEndTransport = entry.tripEndTransport;
    entryInfo.tripType = entry.tripType;
    entryInfo.tripStartTime = entry.tripStartTime;
    entryInfo.tripEndTime = entry.tripEndTime;
    entryInfo.tripDays = entry.tripDays;
    entryInfo.realTripStartTime = entry.tripStartTime;
    entryInfo.realTripEndTime = entry.tripEndTime;
    entryInfo.realTripDays = entry.tripDays;
    entryInfo.tripReason = entry.tripReason;
    entryInfo.bosType = "2811AC20";
    //8.2sp2
    entryInfo.isCancelTrip = 0;
    entryInfo.isElasticCalLen = $("#isElasticCalLen").val() == "1" ? 1 : 0;
    //迁移客户自定义扩展字段到分录Info中
    for (var x in editData) {
        entryInfo[x] = editData[x];
    }
    entryArray[0] = entryInfo;
    dataSubmit.entries = entryArray;
    return dataSubmit;
}
_private.submitButtonState = function () {
    var dataa = mbos.getRequestParams().param ? JSON.parse(mbos.getRequestParams().param) : {};
    var validate = true;
    _private.tripStartPlace = $('#tripStartPlace input').val();
    _private.tripEndPlace = $('#tripEndPlace input').val();
    if (_private.tripDays <= 0 || !_private.atsParams) {
        validate = false;
    }
    console.log(validate,"//",_private.tripDays > 0 ,"//",_private.atsParams);

    if (validate == true && _private.tripDays > 0 && _private.atsParams) {
        //若数据校验通过，则设置提交按钮可用，并且改变按钮样式
        //$('#submit button').removeAttr('ng-disabled');
        $('#submit button').attr('style', 'background-color:#0088cc !important;');
        if (!window.submitHasBinded)
            $('#submit button').off("click").on("click",_private.tripBillSubmit)
        // mbos('submit').bind('click', _this.tripBillSubmit);
        window.submitHasBinded = true;
    } else {
        if (dataa.state === '未审批') {
            $('#submit button').attr('style', 'background-color:#0088cc !important;');
        } else {
            //若数据校验没有通过，则设置按钮不可用，并且改变按钮样式
            $('#submit button').removeAttr('style');
            $('#submit button').off("click")
            window.submitHasBinded = false;
        }
    }
}
_this.tripReasonChange = function (event) {
    _private.tripReason = event.new_value;
    return page.tripReasonChange && page.tripReasonChange(event);
}
_self.createData = function (e) {
    mbos.post({
        url: "/mbos/editpage/createNewData?&bostype=" + _self.getEditData().bosType + "&uiname=" + requestParam.name,
        param: {
            "bostype": _self.getEditData().bosType,
            "model": JSON.stringify(_self.getEditData()),
            "uiname": mbos.getRequestParams().name
        },
        success: function (data) {
            _private.extendIncludeEntry(data, initvalueMap);
            mbos.$model('entity').data = mbos.$model('entity').data || {};
            _private.extendIncludeEntry(mbos.$model('entity').data, data);
            //mbos.$model('entity').data=data;
            mbos.$eventbus.fire("page", "onCreateData");
        },
        error: function (data) {
            if (typeof (data) == "string") {
                mbos.msgBox.showError("", data);
            } else {
                mbos.msgBox.showError(data);
            }
        }
    });
}
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
}
String.prototype.startWith = function (str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substr(0, str.length) == str)
        return true;
    else
        return false;
    return true;
}

_this.addnewOne = function (event) {
    _private.initializeData();
    window.location.reload(true);
}

_this.list = function (event) {
    _private.initializeData();
    // var url = _private.hostname + "/mbos/page/loadPage?appid=" + _private.appid + "&eid=" + _private.eid + "&path=" + _private.path + "&name=TripBillList.listui";
    // if (_private.storeEid) {
    //   url += "&storeEid=" + _private.storeEid;
    // }
    mbos.ui.open({
        path: "TripBill",
        name: "TripBillList.listui",
        params: {}
    });
    // window.location.href = url;
}
_private.placeholderInit = function () {
    $("#tripStartPlace input").attr("placeholder", "出发地");
    $("#tripEndPlace input").attr("placeholder", "目的地");
    $("#tripReason input").attr("placeholder", "请输入原因");
}

_private.showElasticCtrl = function () {
    $("#isElasticCalLen").parent().show();
    $("#labelIsElasticCalLen").show();
};

_private.hideElasticCtrl = function () {
    $("#isElasticCalLen").parent().hide();
    $("#labelIsElasticCalLen").hide();
};
_private.generateIsElasticCalLen = function () {
    var appendStr = "<div class='input-group hundredWidth col-xs-6'><select class='leaveBill-form-control-select leaveBill-select' id='isElasticCalLen'>";
    appendStr += "<option value='1'>是</option>";
    appendStr += "<option selected='selected' value='0'>否</option>";
    appendStr += "</select><span class='right_arrow_elastic'>></span></div>";
    $("#labelIsElasticCalLen").after(appendStr);
    $("#isElasticCalLen").change(function () {
        _this.timeChange();
    });
    _private.getIsElasticCalCtrl();
}
_private.getIsElasticCalCtrl = function () {
    if (_private.isHalfDay == "true") {
        _private.hideElasticCtrl();
        return;
    }
    var beginTime = mbos("tripStartTime").value() + ":00";
    var endTime = mbos("tripEndTime").value() + ":00";
    var params = [];
    params[0] = {
        isShow: "true",
        beginTime: beginTime,
        endTime: endTime
    };
    var success = function (data) {
        console.log(data);
        if (data == "true") {
            _private.showElasticCtrl();
        } else {
            _private.hideElasticCtrl();
        }
    };
    var fail = function (data) {
        mbos.msgBox.showError(data.detail);
    };
    mbos.eas.invokeScript("getIsElasticCalCtrl", params, success, fail);
}
_private.initDate = function () {
    var date = new Date().getFullYear() + "-" + ((new Date().getMonth() + 1) > 9 ? (new Date().getMonth() + 1) : "0" + (new Date().getMonth() + 1)) + "-" + (new Date().getDate() > 9 ? new Date().getDate() : "0" + new Date().getDate())
    if (mbos.getRequestParams().date) {
        date = mbos.getRequestParams().date
    }
    // mbos.$model('entity').data.tripStartTime = date + " 00:00"
    // mbos.$model('entity').data.tripEndTime = date + " 23:59"
    mbos("tripStartTime").value(date + " 00:00")
    mbos("tripEndTime").value(date + " 23:59")
}
// 将平台日期时间控件修改自己的控件
_private.dateTimePicker =function () {
    new DateTimePicker("#tripStartTime input",{bubble:false,format:"yy-MM-dd hh:mm"},"",function (date) {
        if(_private.tripEndTime&&new Date(_private.tripEndTime.replace(/-/g,"/")).getTime()<new Date(date.replace(/-/g,"/")).getTime()){
            // mbos.msgBox.showError("结束时间不能小于开始时间！");
            mbos.$model('entity').data.tripEndTime=date
            mbos("tripEndTime").value(date)
        }
        mbos.$model('entity').data.tripStartTime=date
        mbos("tripStartTime").value(date)
    })
    new DateTimePicker("#tripEndTime input",{bubble:false,format:"yy-MM-dd hh:mm"},"",function (date) {
        if(_private.tripStartTime&&new Date(_private.tripStartTime.replace(/-/g,"/")).getTime()>new Date(date.replace(/-/g,"/")).getTime()){
            // mbos.msgBox.showError("结束时间不能小于开始时间！");
            mbos.$model('entity').data.tripStartTime=date
            mbos("tripStartTime").value(date)
        }
        mbos.$model('entity').data.tripEndTime=date
        mbos("tripEndTime").value(date)
    })
}

_this.tripTypeChange = function(event){
    _private.tripType = event.new_value.id;
    _private.tripTypeName = event.new_value.name;
    _private.submitButtonState();
    return page.tripTypeChange && page.tripTypeChange(event);
}
//当出差时间发生变化时，计算出差时长
_this.timeChange = function(event){
    console.log(_this.timeChangeTimer)
    clearTimeout(_this.timeChangeTimer)
    _this.timeChangeTimer=setTimeout(function() {
        if (_private.atsParams) {
            //清空错误提示
            var tstartTime = mbos('entity').value().tripStartTime;
            var tendTime = mbos('entity').value().tripEndTime;
            var tripDays = 0;
            var params = [];
            var param = {};
            param.tripStartTime = tstartTime + ":00";
            param.tripEndTime = tendTime + ":00";
            param.isElasticCalLen = $("#isElasticCalLen").val() == "1" ? "true" : "false";
            params[0] = param;
            if ( tstartTime != undefined && tstartTime != null && tstartTime != '' && tendTime != undefined && tendTime != null && tendTime != '') {
                _private.tripStartTime = param.tripStartTime;
                _private.tripEndTime = param.tripEndTime;
                var startTime = tstartTime.replace(/-/g, '/');
                var endTime = tendTime.replace(/-/g, '/');
                var startTripTime = new Date(startTime);
                var endTripTime = new Date(endTime);
                var errorText = "";
                var success = function (data) {
                    //获取出差时长成功
                    if (mbos.getRequestParams().stat != "view") {
                        _private.tripDays = data;
                        // $('#tripDays').text(_private.tripDays);
                        mbos('tripDays').value(_private.tripDays ? parseFloat(_private.tripDays) : 0);
                    }
                    _private.submitButtonState();
                }
                var fail = function (data) {
                    _private.submitButtonState();
                    mbos.msgBox.showError("获取出差时长失败！");
                }
                mbos.eas.invokeScript("getTripDayLength", params, success, fail);

            }
            _private.getIsElasticCalCtrl();
        }
    }, 50);

    return page.timeChange && page.timeChange(event);
}
_this.tripStartPlace = function(event){
    // document.activeElement.blur();
    _private.tripStartPlace = event.new_value;
    return page.tripStartPlace && page.tripStartPlace(event);
}
_this.tripEndPlace = function(event){
    _private.tripEndPlace = event.new_value;
    return page.tripEndPlace && page.tripEndPlace(event);
}

