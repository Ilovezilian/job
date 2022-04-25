var __globalObject;
shr.defineClass("shr.ats.lackAttendanceFileInfoEdit", shr.framework.List, {
    modelPropeties: '',
    excludeFields: ["attendanceNum","fileType","EFFDT","LEFFDT","remark","manageRelation",
        "isDefaultManage","attendFileState","proposer","adminOrgUnit","position","hrOrgUnit","name",
        "number","description","simpleName","creator","createTime","lastUpdateUser","lastUpdateTime",
        "CU","id","calendar","isAutoShift","isAttendance"],
    countAdd: (function () {
        var counter = 0;
        return function () {return counter += 1;}
    })(),
    initalizeDOM:function(){
        shr.ats.lackAttendanceFileInfoEdit.superClass.initalizeDOM.call(this);
        __globalObject = this;
    },
    assembleExtendsFields(){
        var model = {};
        $('div[name="myExtendfield"]').each((index, item)=>{
            var select = undefined, fieldKey = undefined, fieldValue = undefined;
            $(item).find("input").each((index1, item1)=>{
                if ($(item1).hasClass("field")){
                    select = $(item1).shrPromptBox("getValue");
                    if (select) {
                        fieldKey = select.id;
                    }
                }

                if (select && fieldKey && $(item1).hasClass("cmpVal")) {
                    var type = select.type;
                    var uipk = select.uipk;
                    if(type == "Date" || type == "TimeStamp"){
                        fieldValue = $(item1).shrDateTimePicker("getValue");
                    } else if(type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int"){
                        fieldValue = $(item1).val();
                    } else if(type == "Enum" || type == "StringEnum" || type == "IntEnum"){
                        fieldValue = $(item1).shrSelect("getValue").value;
                    } else if(type == "Boolean"){
                        fieldValue = $(item1).shrSelect("getValue").value;
                    } else if(type == "String"){
                        fieldValue = $(item1).val();
                    } else if(atsCommonUtile.hasContent(uipk)) {
                        fieldValue = $(item1).shrPromptBox("getValue").id;
                    }
                }
            });
            if (fieldKey && fieldValue) {
                model[fieldKey] = fieldValue;
            }
        });

        return model;
    },
    assginValueAction : function(pageUipk)
    {
        var _self = this ;
        if (_self.validate() && _self.verify())
        {
            var hrOrgUnit = $("#hrOrgUnitF7_el").val();
            var personIds = $('#proposer_el').val();
            var adminOrgLongNum = $("#adminOrgUnit_longNumber").val();
            var attencePolicy = $("#attencePolicy_el").val();
            var atsShift  = $("#atsShift_el").val();
            var pageUipk = pageUipk;
            var holidayPolicySet = $("#holidayPolicySet_el").val();
            var isAttendance = $("#isAttendance_el").val();
            var isAutoShift = $("#isAutoShift_el").val();
            var calendar= $("#calendar").shrPromptBox("getValue");
            var calendarValue = calendar && calendar.id || "";
            var effectDate = atsMlUtile.getFieldOriginalValue("effectDate");
            var type = $("#radio-1").attr("checked")=="checked"?0:1;  //0--纠正档案  1--变更档案

            var model = _self.assembleExtendsFields();
            var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.LackAttendanceFileListHandler&method=assginValueHolidayFile";
            openLoader(1,jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_22);
            var data = {
                hrOrgUnit:hrOrgUnit,
                personId:personIds,
                attencePolicy:attencePolicy,
                adminOrgLongNum:adminOrgLongNum,
                atsShift:atsShift,
                holidayPolicySet:holidayPolicySet,
                isAttendance:isAttendance,
                isAutoShift:isAutoShift,
                canlendar: calendarValue,
                pageUipk:pageUipk,
                effectDate:effectDate,
                type:type,
                serviceId:shr.getUrlParams().serviceId,
                extendsData: JSON.stringify(model)
            };
            shr.ajax({
                type:"post",
                //async:false,
                url:url,
                data: data,
                success:function(res){
                    closeLoader();
                    if( res.errorString != undefined && res.errorString != ""){
                        var mes = res.errorString
                        shr.showError({message:mes});
                    }else{
                        parent.location.reload();
                    }
                }
            });
        }
    },
    /**
     * 对保存、提交的数据进行确认
     */
    verify: function() {
        var policy = $("#attencePolicy_el").val();
        var atsShift  = $("#atsShift_el").val();
        var holidayPolicySet = $("#holidayPolicySet_el").val();
        var isAttendance = $("#isAttendance_el").val();
        var isAutoShift = $("#isAutoShift_el").val();
        if(policy || atsShift || holidayPolicySet || isAttendance || isAutoShift){
            return true;
        }else{
            shr.showInfo({message: jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_0});
            return false;
        }
    },
    processF7ChangeEvent : function(){
        var that = this;
        $('input[name=hrOrgUnitF7]').shrPromptBox("option", {
            onchange : function(e, value) {
                var info = value.current;
                if(info!=null){
                    $('#adminOrgUnit').shrPromptBox("setValue", "");
                    $("#proposer").shrPromptBox("setValue", "");
                    $('#attencePolicy').shrPromptBox("setValue", "");
                    $("#atsShift").shrPromptBox("setValue", "");
                    $('#proposer_el').val("");
                    $("#adminOrgUnit_longNumber").val("");
                    $('#proposer').shrPromptBox().attr("data-params",info.id);
                }else{
                    $('#hrOrgUnitF7').shrPromptBox("setValue", "");
                    $('#proposer').shrPromptBox().attr("data-params",null);
                }
            }
        });
        $('input[name=adminOrgUnit]').shrPromptBox("option", {
            onchange : function(e, value) {
                var info = value.current;
                if(info!=null){
                    $("#proposer").shrPromptBox("setFilter"," ( adminOrgUnit.id = '"+info.id+"' or adminOrgUnit.longNumber like '"+info.longNumber+"%' )");
                    if(info.longNumber !=null && info.longNumber!=''){
                        $("#adminOrgUnit_longNumber").val(info.longNumber);
                    }
                }else{//行政组织非必填
                    $("#proposer").shrPromptBox("setFilter","");
                    $("#adminOrgUnit_longNumber").val("");
                }
            }
        });
    },
    /*
    * 设置默认人员
    */
    setDefaultPerson : function(selectedPersonNumbers){
        var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.LackAttendanceFileListHandler&method=getPersonsByNumbers";
        shr.ajax({
            type:"post",
            async:false,
            url:url,
            data: {selectedPersonNumbers:selectedPersonNumbers},
            success:function(res){
                var obj = JSON.parse(res);
                var personJson = [];
                for(var i=0;i<obj.length;i++){
                    personJson.push({id:obj[i].id, name:obj[i].name});
                }
                $("#proposer").shrPromptBox("setValue", personJson);
            }
        });
    },
    /*
    * 弹出批量赋值的框
    */
    addValsPublicAction : function(pageUipk,firstHrOrgUnitId){
        var _self = this;
        var selectedPersons = [];
        //	var selectedhrorgids = [];
        var selectedItems = $("tr[aria-selected=true]");
        var firstHrOrgUnitId=null;
        var firstHrOrgUnitName=null;
        if(selectedItems.length>0){
            firstHrOrgUnitId=$(selectedItems[0]).find("td[aria-describedby='grid_hrOrgUnit.id']").text();
            firstHrOrgUnitName=$(selectedItems[0]).find("td[aria-describedby='grid_hrOrgUnit.name']").text();
            for(var i=0;i<selectedItems.length;i++){
                var hrOrgUnitId=$(selectedItems[i]).find("td[aria-describedby='grid_hrOrgUnit.id']").text();
                if(hrOrgUnitId!=firstHrOrgUnitId){
                    shr.showWarning({
                        message: jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_13,
                        hideAfter: 5
                    });
                    return;
                }
//				selectedPersons.push({
//				"id" : $(selectedItems[i]).find("td[aria-describedby='grid_person.id']").text(),
//				"name": $(selectedItems[i]).find("td[aria-describedby='grid_person.name']").text()
//				});
                selectedPersons.push({
                    "id" : $(selectedItems[i]).find("td[aria-describedby='grid_person.id']").text(),
                    "name": $(selectedItems[i]).find("td[aria-describedby='grid_person.name']").text(),
                    "person.number": $(selectedItems[i]).find("td[aria-describedby='grid_person.number']").text(),
                    "position.name": $(selectedItems[i]).find("td[aria-describedby='grid_position.name']").text(),
                    "adminUnit.name": $(selectedItems[i]).find("td[aria-describedby='grid_adminOrgUnit.displayName']").text(),
                    "employeeType.name": $(selectedItems[i]).find("td[aria-describedby='grid_employeeType.name']").text(),
                    "person.employeeType.name": $(selectedItems[i]).find("td[aria-describedby='grid_person.name']").text()
                });
            }
        }else{//列表没有勾选员工，批量赋值的组织，按当前用户业务组织范围内默认hr组织填充
            _self.remoteCall({
                type:"post",
                method:"getDefaultHrOrgUnit",
                param:{},
                async: false,
                success:function(res){
                    if(res.hrOrgUnitId != ""){
                        firstHrOrgUnitId = res.hrOrgUnitId;
                        firstHrOrgUnitName = res.hrOrgUnitName;
                    }
                }
            });
        }

        $("#iframe2").dialog({
            title: jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_12,
            width:970,
            height:900,
            modal: true,
            resizable: true,
            position: {
                my: 'center',
                at: 'top+55%',
                of: window
            },
            open : function(event, ui) {
                _self.appendDynamicHTML(this,selectedPersons,pageUipk,firstHrOrgUnitId,firstHrOrgUnitName);
            },
            close : function() {
                $("#iframe2").empty();
            }
            /* buttons:{
                "批量赋值": function(){
                    $(this).disabled = true;
                    _self.assginValueAction(pageUipk);
                },
                "取消": function(){
                    $("#iframe2").empty();
                    $("#iframe2").dialog("close");
                }
            }*/
        });
        $("#iframe2").css({"height":"500px"});
        $("#iframe2").css({"margin-top":"5px"});
    },
    AddFieldRow: function(){
        var that = this;
        var simulateOpt = simulateOpt || {field:"myfield"};
        var id = (simulateOpt.field + '' + that.countAdd()).replace(/\./g,'_');
        simulateOpt.id = id;
        var insertHtml =
            '<div class="row-fluid row-block" id = "myExtends_'+id+'" name="myExtendfield">'
            + '<div class="row-fluid row-block" data-ctrlrole="labelContainer">'
            + '<div class="col-lg-3 field-ctrl flex-c">'
            + '</div>'
            + '<div class="col-lg-2 field-ctrl flex-c" style="visibility:hidden;width:0px">'
            + '</div>'
            + '<div class="col-lg-5 field-ctrl flex-c">'
            + '</div>'
            + '<div> <i class="icon-plus simulateFilterIcon"></i><i class="icon-remove simulateFilterIcon" style="margin-left: 10px;"></i>'
            + '</div>'
            + '</div>'
            + '</div>';

        $("#addCondition").parent().parent().append(insertHtml);
        var container = $("#myExtends_" + id);
        container.find('.col-lg-3.field-ctrl.flex-c').empty().append('<input id="dyn_field_' + id + '" class="dynamicFilter field" />');
        container.find('.col-lg-2.field-ctrl.flex-c').empty().append('<input id="dyn_cmp_' + id + '" class="dynamicFilter comparetor" />');
        container.find('.col-lg-5.field-ctrl.flex-c').empty().append('<input id="dyn_val_' + id + '" class="dynamicFilter cmpVal" />');

        $('.icon-plus.simulateFilterIcon').off('click').click(function(){
            that.AddFieldRow();
        });
        $('.icon-remove.simulateFilterIcon').off('click').click(function(){
            $(this).closest('div[name="myExtendfield"]').remove();
        });

        that.createSimulateOpt(simulateOpt, container);

    },
    addAttributes: function(modelPropeties){
        var that = this;
        if (!modelPropeties) {
            return modelPropeties;
        }

        var modelPropeties = modelPropeties.filter(item=>that.excludeFields.indexOf(item.field) == -1);
        modelPropeties.forEach(item => {
            item.id = item.field;
            item.title = item.field;
            item.value = item.field;
            item.alias = item.field;
            item.hide = false;
            if (item.children && item.children.length > 0) {
                item.children = that.addAttributes(item.children)
            }
        });

        return modelPropeties;

    },
    addExtendsEvent: function(){
        var that = this;
        $("#addCondition").click(function(e){
            var postUrl = waf.getContextPath()+"/dynamic.do?method=getEntityProperties&handler=com.kingdee.shr.ats.web.handler.common.AtsUIViewHandler";
            if (!that.modelPropeties) {
                shr.remoteCall({
                    type:"post",
                    url: postUrl,
                    uipk: that.uipk,
                    method: "getEntityProperties",
                    param: {level: '2'},
                    async: false,
                    success:function(res){
                        that.modelPropeties = res;
                        that.modelPropeties = that.addAttributes(that.modelPropeties);
                        that.AddFieldRow();
                    }
                });
            } else {
                that.AddFieldRow();
            }
        });
    },
    createSimulateOpt:function(simulateOpt, container){
        var that = this;
        var zNodes = JSON.parse(JSON.stringify(that.modelPropeties));

        var tree_f7_json = {id: simulateOpt.id,name: simulateOpt.id};
        tree_f7_json.subWidgetName = 'shrPromptTree';
        tree_f7_json.autoComplete=true;
        tree_f7_json.subWidgetOptions = {
            treeSettings:{},
            width:250,
            zNodes : zNodes
        };

        tree_f7_json.onchange = function(event, value) {
            container.find('.col-lg-5.field-ctrl.flex-c').empty().append('<input id="dyn_val_' + simulateOpt.id + '" class="dynamicFilter cmpVal" />');
            that.buildCompareSelect($.extend(true, {}, value.current, {
                component : container.find('.dynamicFilter.field'),
                compareVal : container.find('.dynamicFilter.cmpVal')
            }));
        };

        container.find('.dynamicFilter.field').shrPromptBox(tree_f7_json);
    },
    buildCompareSelect: function(dataTypeInfo){
        var componentId = dataTypeInfo.id;
        var type = dataTypeInfo.type || dataTypeInfo.dataType;
        var uipk = dataTypeInfo.uipk;
        var enumSource = dataTypeInfo.enumSource;
        var compareVal = dataTypeInfo.compareVal;

        if(atsCommonUtile.hasContent(enumSource)){
            $(this).attr("enumSource",enumSource);
        }
        if(type == "Date" || type == "TimeStamp"){
            compareVal && compareVal.shrDateTimePicker({id : componentId,ctrlType:type,isAutoTimeZoneTrans:false});
        }
        if(type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int"){
        }
        if(type == "Enum" || type == "StringEnum" || type == "IntEnum"){
            compareVal && compareVal.shrSelect({id : componentId,enumSource : enumSource});
        }
        if(type == "Boolean"){
            compareVal && atsCommonUtile.createSelect(compareVal,{
                id : componentId,
                data : [
                    {value:"1",alias:$.attendmanageI18n.atsCommonUtile.yes},
                    {value:"0",alias:$.attendmanageI18n.atsCommonUtile.no}
                ]
            });
        }
        if(type == "String"){
        }
        if(compareVal && atsCommonUtile.hasContent(uipk)){
            var f7FieldName = dataTypeInfo.f7FieldName;
            var f7Json = {id:componentId,name:"prop_value"};
            f7FieldName && (f7Json.displayFormat = "{"+f7FieldName+"}");
            f7Json.subWidgetName = 'shrPromptGrid';
            f7Json.subWidgetOptions = {title:dataTypeInfo.name,uipk:uipk,multiselect:false};
            compareVal.shrPromptBox(f7Json);
            compareVal.unbind("keydown.shrPromptGrid").unbind("keyup.shrPromptGrid");
            compareVal.attr("placeholder","").attr("uipk",uipk);
        }
    },
    addCalendar: function () {
        var grid_f7_json = {id: "calendar", name: "calendar"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {
            title: jsBizMultLan.atsManager_lackAttendanceFileList_i18n_5,
            uipk: "com.kingdee.eas.hr.ats.app.WorkCalendar.AvailableList.F7",
            query: "",
            filter: "",
            domain: "",
            multiselect: false,
            treeFilterConfig: '',
            permItemId: "",
            isHasMultileDialog: false,
            isTree: false,
            treeUrl: "",
            isContainLowerOrg: false,
            isAdminOrg: false
        };
        grid_f7_json.readonly = '';
        grid_f7_json.validate = '{required:true}';

        grid_f7_json.value = {'id': "", 'name': ""};
        grid_f7_json.isHROrg = "false";
        grid_f7_json.isAdminOrg = "false";
        grid_f7_json.searchLikePattern = "any";

        grid_f7_json.subWidgetOptions.isHRBaseItem = true;
        grid_f7_json.subWidgetOptions.filterConfig = [{
            name: 'isComUse',
            value: true,
            alias: jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_18,
            widgetType: 'checkbox'
        }];
        grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnitF7";

        grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
        grid_f7_json.subWidgetName = 'specialPromptGrid';

        $('#calendar').shrPromptBox(grid_f7_json);
    }, appendDynamicHTML: function(object, selectedPersons, pageUipk, firstHrOrgUnitId, firstHrOrgUnitName){
        var that = this;
        //var firstHrOrgUnitId="00000000-0000-0000-0000-000000000000CCE7AED4";
        var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
            //+ '<div style=" padding-left: 110px; color: red; ">温馨提示：员工的"考勤制度"、"默认班次"、"打卡考勤"至少一个发生修改时，批量赋值后会记录档案历史。</div>'
            //+ '<div style=" padding-left: 110px; color: red; ">纠正档案信息：对不准确的档案信息进行纠正，即修改最新的档案信息，不产生新的档案历史记录；</div>'
            //+ '<div style=" padding-left: 110px; color: red; ">变更档案信息：档案信息从“生效日期”时间点发生变更，变更将会产生新的档案历史记录。</div>'
            + '<div class="row-fluid row-block " style="margin-bottom: 0px !important;">'
            + '<div class="col-lg-2" style="min-height: 0px;"><div class="field_label" style="font-size:13px;color:red; padding-right: 10px;">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_8
            + '</div></div>'
            + '<div class="col-lg-10" style="min-height: 0px;"><div style="font-size:13px;color:red;">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_5
            + '</div></div>'
            + '</div>'
            + '<div class="row-fluid row-block ">'
            + '<div class="col-lg-2" style="min-height: 0px;"><div class="field_label" style="font-size:13px;color:red; padding-right: 10px;">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_2
            + '</div></div>'
            + '<div class="col-lg-10" style="min-height: 0px;"><div style="font-size:13px;color:red;">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_4
            + '</div></div>'
            + '</div>'
            + '<div class="row-fluid row-block ">'
            + '<div class="col-lg-4"><div class="field_label" style="font-size:14px;color:#000000;font-weight: 600;">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_21
            + '</div></div>'
            + '</div>'

            + '<div class="row-fluid row-block "><div class="row-fluid row-block ">'
            + '<div class="col-lg-4"><div style="text-align:center;" class="field_label" title="'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_9
            + '">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_9
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input id="hrOrgUnitF7" name="hrOrgUnitF7" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title="" ></div>'
            + '</div>'
            + '<div class="col-lg-4"><div style="text-align:center;" class="field_label" title="'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_19
            + '">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_19
            + '</div></div><div class="col-lg-6 field-ctrl">'
            + '<input id="adminOrgUnit" name="adminOrgUnit" class="block-father input-height" type="text"  ctrlrole="promptBox" validate="" autocomplete="off" title=""></div>'
            + '<input id="adminOrgUnit_longNumber" name="adminOrgUnit.longNumber" type="hidden" value="">'
            + '</div>'
            + '<div class="row-fluid row-block ">'
            + '<div class="col-lg-4"><div style="text-align:center;" class="field_label" title="'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_20
            + '">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_20
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input id="proposer" name="proposer" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
            + '</div>'
            + '<div class="row-fluid row-block ">'
            + '<div class="col-lg-4"><div  class="field_label" style="font-size:14px;color:#000000;font-weight: 600;">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_6
            + '</div></div>'
            + '</div>'
            + '<div class="row-fluid row-block ">'
            + '<div class="col-lg-2"><input type="radio" id="radio-1" name="radio-1-set" style=" display: none; " class="regular-radio" checked  /><label for="radio-1"></label></div>'
            + '<div class="col-lg-2 field-ctrl"><div class="field_label"  style=" font-size: 13px !important ; float: left;" title="">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_7
            + '</div></div>'
            + '<div class="col-lg-1 field-desc"></div>'
            + '<div class="col-lg-1"><input type="radio" id="radio-2" name="radio-1-set" style=" display: none; " class="regular-radio" /><label for="radio-2"></label></div>'
            + '<div class="col-lg-2 field-ctrl"><div class="field_label" style=" font-size: 13px !important ; float: left;" title="">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_1
            + '</div></div>'
            + '</div>'
            + '<div class="row-fluid row-block "><div class="row-fluid row-block ">'
            + '<div class="col-lg-4"><div style="text-align:center;" class="field_label" title="'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_10
            + '">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_10
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input id="attencePolicy" name="attencePolicy" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
            + '</div>'
            + '<div class="col-lg-4"><div style="text-align:center;" class="field_label" title="'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_11
            + '">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_11
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input id="atsShift" name="atsShift" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
            + '</div>'

            + '<div class="row-fluid row-block "><div class="row-fluid row-block ">'
            + '<div class="col-lg-4"><div style="text-align:center;" class="field_label" title="'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_16
            + '">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_16
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input class="block-father input-height cursor-pointer" id="isAutoShift" name="isAutoShift" validate="" placeholder="" type="text" dataextenal="" ctrlrole="select"></div>'
            + '</div>'
            + '<div class="col-lg-4"><div style="text-align:center;" class="field_label" title="'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_3
            + '">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_3
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input class="block-father input-height cursor-pointer" id="isAttendance" name="isAttendance" validate="" placeholder="" type="text" dataextenal="" ctrlrole="select"></div>'
            + '</div>'

            + '<div class="row-fluid row-block "><div class="row-fluid row-block ">'
            + '<div class="col-lg-4"><div style="text-align:center;" class="field_label" title="'
            + jsBizMultLan.atsManager_lackAttendanceFileList_i18n_5
            + '">'
            + jsBizMultLan.atsManager_lackAttendanceFileList_i18n_5
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input id="calendar" name="calendar" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
            + '</div>'

            + '<div class="col-lg-4" id="effectDateLabel" ><div style="text-align:center;" class="field_label" title="'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_15
            + '">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_15
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input id="effectDate" name="effectDate" value="" validate="{dateISO:true,required:true}" placeholder="" type="text" dataextenal=""></div>'
            + '</div>'
            + '</div></div>'
            // 拓展自定义框
            + '<div class="container" id="extends">'
            + '<div class=".label-ctrl.flex-cc.flex-r">档案其他值设置<i id="addCondition" class="icon-plus" style="padding:2px;margin-left: 60px" ></i></div>'
            + '</div>'
            // + '<div class="row-fluid row-block ">'
            // + '<div class="col-lg-12"></div>'
            // + '<div class="col-lg-4 field-ctrl"><button type="button" class="shrbtn-primary shrbtn" name="批量赋值" id="batchAddVal">批量赋值 </button></div>'
            // + '<div class="col-lg-4 field-ctrl"><button type="button" class="shrbtn-primary shrbtn" name="取消" id="cancle">取消 </button></div>'
            // + '</div>'

            + '<div class="row-fluid" align="right">'
            + '<div  style="padding-right:8%;">'
            + '<button type="button" class="shrbtn-primary shrbtn" name="'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_12
            + '" id="batchAddVal">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_12
            + ' </button>'
            + '<button type="button" class="shrbtn-primary shrbtn" name="'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_14
            + '" id="cancle">'
            + jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_14
            + ' </button>'
            + '</div>'
            + '</div>'

            /*
             + '<div class="row-fluid row-block ">'
             + '<div class="col-lg-4"></div>'
             + '<div class="col-lg-4">'
             + '<button type="button" class="shrbtn-primary shrbtn" name="批量赋值" id="batchAddVal">批量赋值 </button></div>'
             + '<div class="col-lg-4">'
             + '<button type="button" class="shrbtn-primary shrbtn" name="取消" id="cancle">取消 </button></div>'
             + '<div class="col-lg-2 field-desc"></div>'
             + '</div>';*/
            + '</form>'
        $(object).append(html);
        // that.createSimulateOpt();
        that.addExtendsEvent();
        $(function() {
            var picker_json = {id:"effectDate"};
            picker_json.tagClass = 'block-father input-height';
            picker_json.readonly = '';
            picker_json.yearRange = '';
            picker_json.validate = '{dateISO:true,required:true}';
            $('#effectDate').shrDateTimePicker($.extend(picker_json,{ctrlType: "Date",isAutoTimeZoneTrans:false}));
            atsMlUtile.setTransDateTimeValue('effectDate',new Date().toJSON().slice(0, 10));
            $("#effectDate").parent().parent().parent().hide();
            $("#effectDateLabel").hide();

            $("#radio-1").click(function(){
                $("#effectDate").parent().parent().parent().hide();
                $("#effectDateLabel").hide();
            });
            $("#radio-2").click(function(){
                $("#effectDate").parent().parent().parent().show();
                $("#effectDateLabel").show();
            });
        });
        var defaultAdminOrg = {};
        var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=getControlAdminOrgUnit";
        shr.ajax({
            type:"post",
            async:false,
            url:url,
            success:function(res){
                defaultAdminOrg.id = res.id;
                defaultAdminOrg.name = res.name;
                $("#adminOrgUnit_longNumber").val(res.longNumber);
            }
        });

        $('button[id^=batchAddVal]').click(function() {
            //var _self = this;
            //$(this).disabled = true;
            jsBinder.disabled=true;
            jsBinder.assginValueAction(pageUipk);
        });

        $('button[id^=cancle]').click(function() {
            $("#iframe2").empty();
            $("#iframe2").dialog("close");
        });

        //考勤业务组织
        var grid_f7_json = {id:"hrOrgUnit",name:"hrOrgUnit"};
        grid_f7_json = {id:"hrOrgUnitF7",name:"hrOrgUnitF7"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_9,uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",query:"",filter:"",domain:"",multiselect:false};
        grid_f7_json.readonly = '';
        grid_f7_json.validate = '{required:true}';
        grid_f7_json.value = {id:firstHrOrgUnitId,name:firstHrOrgUnitName};
        $('#hrOrgUnitF7').shrPromptBox(grid_f7_json);
        //行政组织
        grid_f7_json = null;
        grid_f7_json = {id:"adminOrgUnit",name:"adminOrgUnit"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_19,uipk:"com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",query:"",filter:"",domain:"",multiselect:false};
        grid_f7_json.readonly = '';
        grid_f7_json.validate = '';
        grid_f7_json.value = {id:"",name:"",displayName:""};
        if(defaultAdminOrg){
            grid_f7_json.value = defaultAdminOrg;
        }
        grid_f7_json.displayFormat = '{displayName}';
        grid_f7_json.customformatter = orgSlice;
        grid_f7_json.customparam = [2];
        $('#adminOrgUnit').shrPromptBox(grid_f7_json);
        //人员
        grid_f7_json = null;
        grid_f7_json = {id:"proposer",name:"proposer"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_20,uipk:"com.kingdee.eas.hr.ats.app.ExistFileForAdmin.F7",query:"",filter:"",domain:"",multiselect:true};
        grid_f7_json.readonly = '';
        grid_f7_json.validate = '';
        grid_f7_json.isHROrg = "false";
        if(selectedPersons.length>0){
            grid_f7_json.value = selectedPersons;
        }else{
            grid_f7_json.value = {id:"",name:""};
        }
        $('#proposer').shrPromptBox(grid_f7_json);
        $("#proposer").shrPromptBox().attr("data-params",firstHrOrgUnitId);
        //考勤制度
        grid_f7_json = null;
        /*		grid_f7_json = {id:"attencePolicy",name:"attencePolicy"};
                grid_f7_json.subWidgetName = 'shrPromptGrid';
                grid_f7_json.subWidgetOptions = {title:"考勤制度",uipk:"com.kingdee.eas.hr.ats.app.AttencePolicy.list",query:"",filter:"",domain:"",multiselect:false};
                grid_f7_json.readonly = '';
                grid_f7_json.validate = '';
                    grid_f7_json.value = {id:"",name:""};
                $('#attencePolicy').shrPromptBox(grid_f7_json);*/


        grid_f7_json = {id:"attencePolicy",name:"attencePolicy"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_10,uipk:"com.kingdee.eas.hr.ats.app.AttencePolicy.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false};
        grid_f7_json.readonly = '';
        grid_f7_json.validate = '';
        grid_f7_json.value = {id:"",name:""};
        grid_f7_json.subWidgetOptions.isHRBaseItem = true;
        grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_18,widgetType: "checkbox"}];
        grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnitF7";
        grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
        grid_f7_json.subWidgetName = 'specialPromptGrid';
        $('#attencePolicy').shrPromptBox(grid_f7_json);
        $('#attencePolicy').shrPromptBox("setBizFilterFieldsValues",firstHrOrgUnitId);


        //默认班次
        grid_f7_json = null;
        grid_f7_json = {id:"atsShift",name:"atsShift"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_11,uipk:"com.kingdee.eas.hr.ats.app.AtsShift.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false};
        grid_f7_json.readonly = '';
        grid_f7_json.validate = '';
        grid_f7_json.value = {id:"",name:""};
        grid_f7_json.subWidgetOptions.isHRBaseItem = true;

        grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_18,widgetType: "checkbox"}];
        grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnitF7";
        grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
        grid_f7_json.subWidgetName = 'specialPromptGrid';
        $('#atsShift').shrPromptBox(grid_f7_json);
        $('#atsShift').shrPromptBox("setBizFilterFieldsValues",firstHrOrgUnitId);

        //打卡考勤
        var select_json = {
            id: "isAttendance",
            readonly: "",
            value: "",
            onChange: null,
            validate: "",
            filter: ""
        };
        select_json.enumSource = 'com.kingdee.eas.hr.ats.IsAttendanceEnum';
        $('#isAttendance').shrSelect(select_json);
        //是否自动排班
        select_json = {};
        select_json = {
            id: "isAutoShift",
            readonly: "",
            value: "",
            onChange: null,
            validate: "",
            filter: ""
        };
        select_json.enumSource = 'com.kingdee.eas.hr.ats.IsAutoShiftEnum';
        $('#isAutoShift').shrSelect(select_json);
        //要将form加上，数据校验才有用。
        var formJson = {
            id: "form"
        };
        // 工作日历
        that.addCalendar();

        $('#form').shrForm(formJson);
        that.processF7ChangeEvent();
    },
    /*
    *原来是继承edit的，改成集成list了没有这个方法了，所以手动加上。
    */
    validate: function() {
        $form = $("#form");
        var flag = $form.wafFormValidator("validateForm", true);
        if (!flag) {
            shr.showWarning({
                message: jsBizMultLan.atsManager_lackAttendanceFileInfoEdit_i18n_17,
                hideAfter: 5
            });
        }

        return flag;
    }
});



