
shr.defineClass("shr.ats.lackHolidayFileInfoEdit", shr.framework.List, {
    holidayFileTofilter : ["holidayPolicySet","EFFDT","LEFFDT","remark","manageRelation",
        "isDefaultManage","attendFileState","proposer","adminOrgUnit","position","hrOrgUnit","name",
        "number","description","simpleName","creator","createTime","lastUpdateUser","lastUpdateTime",
        "CU","id"],
    initalizeDOM: function () {
        shr.ats.lackHolidayFileInfoEdit.superClass.initalizeDOM.call(this);
        var that = this;

        that.processF7ChangeEvent();
        //$("#breadcrumb").hide();
    },

    assginValueAction: function (pageUipk) {
        var _self = this;
        if (_self.validate() && _self.verify()) {
            var valueSet_item_length = $("#defaultValToSet").find("div[name = 'valueSet_item']").length;
            var filterInfo = {};
            var extendinfo={}
            for (var j = 0; j < valueSet_item_length; j++) {
                condition_item_id = $("#defaultValToSet").find("div[name = 'valueSet_item']").eq(j).attr('id');
                var name00 = $('#' + condition_item_id).find("input[id = 'prop_field']").attr('prop_field');
                var valueId = condition_item_id.replace(/valueSet_item/,"prop_value")
                var value00 = $('#' +valueId+"_el").val();
                extendinfo[name00]=value00
            }
            filterInfo.extendinfo=JSON.stringify(extendinfo)
            filterInfo.personIds = $('#proposer_el').val();
            filterInfo.holidayPolicySet = $("#holidayPolicySet_el").val();
            filterInfo.hrOrgUnit = $("#hrOrgUnitF7_el").val();
            filterInfo.adminOrgLongNum = $("#adminOrgUnit_longNumber").val();
            filterInfo.pageUipk = pageUipk;
            filterInfo.serviceId=shr.getUrlParams().serviceId

            var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayFileListHandler&method=assginValueHolidayFile";
            openLoader(1, jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_12);
            shr.ajax({
                type: "post",
                //async:false,
                url: url,
                data: filterInfo
                ,
                success: function (res) {
                    closeLoader();
                    parent.location.reload();
                }
            });
        }
    },
    setProposerFilter: function () {
//		var adminOrgUnitLongNumber=$("#adminOrgUnit_longNumber").val();
//		var hrOrgUnit = $("#hrOrgUnit_el").val();
//		var filter='';
//		if(adminOrgUnitLongNumber==null||adminOrgUnitLongNumber==''){
//			filter+='adminOrgUnitLongNumber= ,';
//		}
//		else{
//			filter+='adminOrgUnitLongNumber='+adminOrgUnitLongNumber+",";
//		}
//		if(hrOrgUnit==null||hrOrgUnit==''){
//			filter+='hrOrgUnit= ';
//		}
//		else{
//			filter+='hrOrgUnit='+hrOrgUnit;
//		}
//		//$('input[name=proposer]').shrPromptBox("setFilter",filter);
//		console.log($('input[name=proposer]'));
        //人员
//		grid_f7_json = null;
//	    grid_f7_json = {id:"proposer",name:"proposer"};
//		grid_f7_json.subWidgetName = 'shrPromptGrid';
//		grid_f7_json.subWidgetOptions = {title:"员工",uipk:"com.kingdee.eas.hr.ats.app.ExistHolidayFileForBatchVal.F7",query:"",filter:"",domain:"",multiselect:true};
//		grid_f7_json.readonly = '';
//		grid_f7_json.customparam="a=1";
//		grid_f7_json.validate = '';
////		if(selectedPersons.length>0){
////			grid_f7_json.value = selectedPersons;
////		}else{
////			grid_f7_json.value = {id:"",name:""};
////	    }
//		$('#proposer').shrPromptBox(grid_f7_json);
//		$('#proposer').shrPromptBox("setValue",{id:"",name:""});
    },

    processF7ChangeEvent: function () {
        var that = this;
        $('input[name=adminOrgUnit]').shrPromptBox("option", {
            onchange: function (e, value) {
                var info = value.current;
                if (info != null) {
                    if (info.longNumber != null && info.longNumber != '') {
                        $("#adminOrgUnit_longNumber").val(info.longNumber);
                        that.setProposerFilter();
                    }
                }
            }
        });
        $('input[name=hrOrgUnitF7]').shrPromptBox("option", {
            onchange: function (e, value) {
                var info = value.current;
                if (info != null) {
                    $('#adminOrgUnit').shrPromptBox("setValue", "");
                    $("#proposer").shrPromptBox("setValue", "");
                    $("#adminOrgUnit_longNumber").val("");
                    $('#proposer_el').val("");
                    that.setProposerFilter();
                }
                $("#proposer").shrPromptBox().attr("data-params", info.id);
            }
        });
    },
    /*
* 设置默认人员
*/
    setDefaultPerson: function (selectedPersonNumbers) {
        var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.LackAttendanceFileListHandler&method=getPersonsByNumbers";
        shr.ajax({
            type: "post",
            async: false,
            url: url,
            data: {selectedPersonNumbers: selectedPersonNumbers},
            success: function (res) {
                var obj = JSON.parse(res);
                var personJson = [];
                for (var i = 0; i < obj.length; i++) {
                    personJson.push({id: obj[i].id, name: obj[i].name});
                }
                $("#proposer").shrPromptBox("setValue", personJson);
            }
        });
    },
    /*
    * 弹出批量赋值的框
    */
    addValsPublicAction: function (pageUipk) {
        var _self = this;
        var selectedPersons = [];
        var selectedItems = $("tr[aria-selected=true]");
        var firstHrOrgUnitId = null;
        var firstHrOrgUnitName = null;
        if (selectedItems.length > 0) {
            firstHrOrgUnitId = $(selectedItems[0]).find("td[aria-describedby='grid_hrOrgUnit.id']").text();
            firstHrOrgUnitName = $(selectedItems[0]).find("td[aria-describedby='grid_hrOrgUnit.name']").text();
            for (var i = 0; i < selectedItems.length; i++) {
                var hrOrgUnitId = $(selectedItems[i]).find("td[aria-describedby='grid_hrOrgUnit.id']").text();
                if (hrOrgUnitId != firstHrOrgUnitId) {
                    shr.showWarning({
                        message: jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_4,
                        hideAfter: 5
                    });
                    return;
                }
//				selectedPersons.push({id : $(selectedItems[i]).find("td[aria-describedby='grid_person.id']").text(),name: $(selectedItems[i]).find("td[aria-describedby='grid_person.name']").text()});
                selectedPersons.push({
                    "id": $(selectedItems[i]).find("td[aria-describedby='grid_person.id']").text(),
                    "name": $(selectedItems[i]).find("td[aria-describedby='grid_person.name']").text(),
                    "person.number": $(selectedItems[i]).find("td[aria-describedby='grid_person.number']").text(),
                    "position.name": $(selectedItems[i]).find("td[aria-describedby='grid_position.name']").text(),
                    "adminUnit": $(selectedItems[i]).find("td[aria-describedby='grid_adminOrgUnit.displayName']").text(),
                    "employeeType.name": $(selectedItems[i]).find("td[aria-describedby='grid_employeeType.name']").text(),
                    "person.employeeType.name": $(selectedItems[i]).find("td[aria-describedby='grid_person.name']").text()
                });
            }
        } else {//列表没有勾选员工，批量赋值的组织，按当前用户业务组织范围内默认hr组织填充
            _self.remoteCall({
                type: "post",
                method: "getDefaultHrOrgUnit",
                param: {},
                async: false,
                success: function (res) {
                    if (res.hrOrgUnitId != "") {
                        firstHrOrgUnitId = res.hrOrgUnitId;
                        firstHrOrgUnitName = res.hrOrgUnitName;
                    }
                }
            });
        }
        $("#iframe2").dialog({
            title: jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_3,
            width: 950,
            height: 600,
            modal: true,
            resizable: true,
            position: {
                my: 'center',
                at: 'top+55%',
                of: window
            },
            open: function (event, ui) {
                _self.appendDynamicHTML(this, selectedPersons, pageUipk, firstHrOrgUnitId, firstHrOrgUnitName);
            },
            close: function () {
                $("#iframe2").empty();
            },
            /*  buttons:{
                  "批量赋值": function(){
                      $(this).disabled = true;
                      _self.assginValueAction(pageUipk);
                  },
                  "取消": function(){
                      $("#iframe2").empty();
                      $("#iframe2").dialog("close");
                  }
              }  */
        });
        $("#iframe2").css({"height": "250px"});
        $("#iframe2").css({"margin-top": "5px"});
    },
    appendDynamicHTML: function (object, selectedPersons, pageUipk, firstHrOrgUnitId, firstHrOrgUnitName) {
        var that = this;
        var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
            + '<div style=" padding-left: 110px; color: red; ">'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_7
            + '</div>'
            + '<div class="row-fluid row-block " >'
            + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_11
            + '</div></div>'
            + '</div>'
            + '<div class="row-fluid row-block " ><div class="row-fluid row-block " >'
            + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_1
            + '">'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_1
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input id="hrOrgUnitF7" name="hrOrgUnitF7" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title=""></input></div>'
            + '</div>'
            + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_9
            + '">'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_9
            + '</div></div><div class="col-lg-6 field-ctrl">'
            + '<input id="adminOrgUnit" name="adminOrgUnit" class="block-father input-height" type="text"  ctrlrole="promptBox" validate="" autocomplete="off" title=""></input></div>'
            + '<input id="adminOrgUnit_longNumber" name="adminOrgUnit.longNumber" type="hidden" value=""></input>'
            + '</div>'
            + '<div class="row-fluid row-block " >'
            + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_10
            + '">'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_10
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input id="proposer" name="proposer" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></input></div>'
            + '</div>'
            + '<div class="row-fluid row-block " >'
            + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_0
            + '</div></div>'
            + '</div>'
            + '<div class="row-fluid row-block ">'
            + '<div class="col-lg-4" style="text-align: center;"><div class="field_label" title="'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_2
            + '">'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_2
            + '</div></div>'
            + '<div class="col-lg-6 field-ctrl"><input id="holidayPolicySet" name="holidayPolicySet" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title="" ></input></div>'
            + '</div>'
        html += '<div class="row-fluid row-block">'
            + '<div  id="defaultValToSet" ><div class="row-fluid row-block row_field">'
            + '<div class="col-lg-2"><div style=" text-align: left;" class="field_label" title="'
            + '档案其他值设置'
            + '">'
            + '<h5>档案其他值设置</h5>'
            + '</div></div>'
            + '<div class="span2"><i id="defaultValToSet_add" class="icon-plus" style="padding:2px" ></i></div>'
            + '</div></div>'
            + '</div>'
            + '</form>'
        html += '<div class="row-fluid row-block " style="width: 90%;margin-left: 50px;display: flex;justify-content: flex-end;margin-top: 10px;">'
            + '<div class="col-lg-3 field-ctrl" style="width:auto;"><button type="button" class="shrbtn-primary shrbtn" name="'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_3
            + '" id="batchAddVal">'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_3
            + ' </button></div>'
            + '<div class="col-lg-3 field-ctrl" style="width:auto;"><button type="button" class="shrbtn-primary shrbtn" name="'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_5
            + '" id="cancle">'
            + jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_5
            + ' </button></div>'
            + '</div>'

        $(object).append(
            html
        );
        if (window.contextLanguage == 'en_US') {
            $('#batchAddVal').css({
                'width': '155px',
                'margin-left': '-90px'
            });
        }
        var defaultAdminOrg = {};
        var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=getControlAdminOrgUnit";
        shr.ajax({
            type: "post",
            async: false,
            url: url,
            success: function (res) {
                defaultAdminOrg.id = res.id;
                defaultAdminOrg.name = res.name;
                $("#adminOrgUnit_longNumber").val(res.longNumber);
            }
        });

        $('button[id^=batchAddVal]').click(function () {
            var _self = this;
            //$(this).disabled = true;
//				jsBinder.disabled=true;
//				jsBinder.assginValueAction(pageUipk);
            $(this).disabled = true;
            that.assginValueAction(pageUipk);
        });

        $('button[id^=cancle]').click(function () {
            $("#iframe2").empty();
            $("#iframe2").dialog("close");
        });

        //假期组织
        grid_f7_json = null;
        grid_f7_json = {id: "hrOrgUnitF7", name: "hrOrgUnitF7"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {
            title: jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_1,
            uipk: "com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",
            query: "",
            filter: "",
            domain: "",
            multiselect: false
        };
        grid_f7_json.readonly = '';
        grid_f7_json.validate = '{required:true}';
        grid_f7_json.value = {id: firstHrOrgUnitId, name: firstHrOrgUnitName};
        $('#hrOrgUnitF7').shrPromptBox(grid_f7_json);
        //组织
        var grid_f7_json = {id: "adminOrgUnit", name: "adminOrgUnit"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {
            title: jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_9,
            uipk: "com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",
            query: "",
            filter: "",
            domain: "",
            multiselect: false
        };
        grid_f7_json.readonly = '';
        grid_f7_json.value = {id: "", name: "", displayName: ""};
        if (defaultAdminOrg) {
            grid_f7_json.value = defaultAdminOrg;
        }
        grid_f7_json.displayFormat = '{displayName}';
        grid_f7_json.customformatter = orgSlice;
        grid_f7_json.customparam = [2];
        $('#adminOrgUnit').shrPromptBox(grid_f7_json);
        //人员
        grid_f7_json = null;
        grid_f7_json = {id: "proposer", name: "proposer"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {
            title: jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_10,
            uipk: "com.kingdee.eas.hr.ats.app.ExistHolidayFileHisForAdmin.F7",
            query: "",
            filter: "",
            domain: "",
            multiselect: true
        };
        grid_f7_json.readonly = '';
        grid_f7_json.validate = '';
        grid_f7_json.isHROrg = "false";
        if (selectedPersons.length > 0) {
            grid_f7_json.value = selectedPersons;
        } else {
            grid_f7_json.value = {id: "", name: ""};
        }
        $('#proposer').shrPromptBox(grid_f7_json);
        $("#proposer").shrPromptBox().attr("data-params", firstHrOrgUnitId);
        //假期制度
        grid_f7_json = null;
        grid_f7_json = {id: "holidayPolicySet", name: "holidayPolicySet"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        //grid_f7_json.subWidgetOptions = {title:"假期制度",uipk:"com.kingdee.eas.hr.ats.app.HolidayPolicySet.list",query:"",filter:"",domain:"",multiselect:false};
        grid_f7_json.subWidgetOptions = {
            title: jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_2,
            uipk: "com.kingdee.eas.hr.ats.app.HolidayPolicySet.F7",
            query: "",
            filter: "",
            domain: "",
            multiselect: false
        };
        grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnitF7";
        grid_f7_json.validate = '{required:true}';
        grid_f7_json.subWidgetOptions.isHRBaseItem = true;
        grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
//		grid_f7_json.value = {id:"",name:""};
        grid_f7_json.subWidgetOptions.filterConfig = [{
            name: "isComUse",
            value: true,
            alias: jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_8,
            widgetType: "checkbox"
        }];

//		grid_f7_json.readonly = '';
        grid_f7_json.subWidgetName = 'specialPromptGrid';
        $('#holidayPolicySet').shrPromptBox(grid_f7_json);
        //要将form加上，数据校验才有用。
        var formJson = {
            id: "form"
        };
        $('#form').shrForm(formJson);
        var vaule_num = 0;
        $('#defaultValToSet' + ' #defaultValToSet_add').unbind('click').bind('click', function () {
            vaule_num =vaule_num+1;
            that.addSetValueForAtsFileHtml(vaule_num);
        });
        that.processF7ChangeEvent();
    }
    , addSetValueForAtsFileHtml: function (condition_num) {

        var that = this;
        var pre_prop_value_set = "prop_value_set_"  + '_' + condition_num;
        var con_tpl =
            '<div id ="valueSet_item_' + condition_num + '" name = "valueSet_item" class="row-fluid row-block row_field" style="width: 115%">'
            + '<div class="span1"><input type="hidden" name="valueSetId"  /><span class="cell-RlStdType"></span></div>'
            + '<div class="span2 field-ctrl">'
            + '<input name_value = "prop_field_html"/>'
            + '</div>'
            + '<div class="span2"><input id="prop_op" type="text" name="prop_op" class="input-height cell-input" style="width:140px"/></div>'
            + '<div class="span2 field-ctrl"><input id=' + pre_prop_value_set + ' type="text" name="prop_value" class="input-height cursor-pointer" style="width:126px"></div>'
            + '<span class="span1 field_add" style="display: table-cell;width:126px"><i class="icon-remove" style="padding:10px"></i></span>'
            + '</div>';

        $("#defaultValToSet" ).append(con_tpl);


        var _treeNode;
        var that = this;
        that.remoteCall({
            type: "post",
            async: false,
            method: "getFieldsToSetAts",
            param: {
                handler: "com.kingdee.shr.ats.web.handler.HolidayRuleEditHandler",
                "entityName": "com.kingdee.eas.hr.ats.app.AtsHolidayFile"
            },
            success: function (response) {
                _treeNode = response;
                var tempArr = []
                for (var temp in _treeNode) {
                    if (that.holidayFileTofilter.indexOf(_treeNode[temp].field) == -1) {
                        tempArr.push(_treeNode[temp])
                    }
                }
                _treeNode = tempArr;
            }
        });
        var tree_f7_json = {id: "prop_field", name: "prop_field"};
        tree_f7_json.subWidgetName = 'shrPromptTree';
        tree_f7_json.subWidgetOptions =
            {
                treeSettings: {},
                width: 250,
                zNodes: _treeNode
            };
        $("#valueSet_item_" +  condition_num + " input[name_value='prop_field_html']").shrPromptBox(tree_f7_json);
        that._addItemEventListener(condition_num);

        //删除
        $('#valueSet_item_'  + condition_num + ' i[class="icon-remove"]').unbind('click').bind('click', function () {
            $(this).closest("div.row_field").remove();
        });


    }
    ,_addItemEventListener:function(condition_num){
        var pre_prop_value = "prop_value_"+condition_num;
        var prop_op_json = {id:"prop_op"};
        prop_op_json.data = [
            {value:"=",alias:'等于'}
        ];
        $('input[id="prop_field"]').shrPromptBox("option",{onchange:function(e,value){
//				$(this).parents(".ui-promptBox-frame").next().replaceWith('<input id="prop_op" type="text" name="prop_op" class="search-input-length input-height"/>');
                $(this).parents("div[name='valueSet_item']").find(".span2").eq(1).children().replaceWith('<input id="prop_op" type="text" name="prop_op" class="input-height cell-input">');
                $(this).parents("div[name='valueSet_item']").find(".span2").eq(2).children().replaceWith('<input id='+pre_prop_value+' type="text" name="prop_value" class="input-height cursor-pointer" style="width:126px">');
                var prop_op_ctrl =  $(this).closest('.row-fluid').find('input[id="prop_op"]');
                var prop_value_ctrl =  $(this).closest('.row-fluid').find('input[id^="prop_value"]');
                prop_op_ctrl.css("width","");
                prop_op_ctrl.wrap("<div></div>");
                $(this).addClass("input-height");
                if(value.current != null){
                    prop_op_ctrl.shrSelect(prop_op_json);
                    prop_op_ctrl.shrSelect("setValue", prop_op_json.data[0].value);

                    var id = value.current.id;
                    var name = value.current.name;
                    var type = value.current.type;
                    var uipk = value.current.uipk;
                    var enumSource = value.current.enumSource;
                    var field = value.current.field;
                    $(this).data('fieldValue', value.current);
                    $(this).attr("prop_field",field);
                    $(this).attr("field_type",type);
                    if(enumSource!=undefined
                        &&enumSource!=null
                        &&enumSource!=""){
                        $(this).attr("enumSource",enumSource);
                    }else{
                        $(this).removeAttr("enumSource");
                    }
                    if(type == "Date" || type == "TimeStamp"){

                        var picker_json = {};
                        picker_json.id = pre_prop_value;
                        prop_value_ctrl.shrDateTimePicker($.extend(picker_json,{ctrlType: "TimeStamp",isAutoTimeZoneTrans:false}));
                        prop_value_ctrl.css("width","90px");
                    }
                    if(type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int"){
                        // prop_op_ctrl.shrSelect(prop_op_date_json);
                        // prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
                    }
                    if(type == "StringEnum" || type == "IntEnum" ||  type == "Enum"){
                        var select_json = {};
                        select_json.id = pre_prop_value;
                        select_json.enumSource = enumSource;
                        prop_value_ctrl.shrSelect(select_json);
                        prop_value_ctrl.css("width","90px");
                    }
                    if(type == "Boolean"){
                        // prop_op_ctrl.shrSelect(prop_boolean_json);
                        // prop_op_ctrl.shrSelect("setValue", prop_boolean_json.data[0].value);

                        var select_json = {id:pre_prop_value};
                        select_json.data = [{value:"1",alias:'是'},
                            {value:"0",alias:'否'}
                        ];
                        prop_value_ctrl.shrSelect(select_json);
                        prop_value_ctrl.css("width","90px");
                    }
                    if(type == "String"){
                        // prop_op_ctrl.shrSelect(prop_op_json);
                        // prop_op_ctrl.shrSelect("setValue", prop_op_json.data[0].value);
                        prop_value_ctrl.css("width","126px");
                        prop_value_ctrl.attr("placeholder",jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_12);
                    }
                    if(uipk!=null && uipk!="null" && uipk!="undefined"){
                        var f7Json = {id:pre_prop_value,name:"prop_value"};
                        f7Json.subWidgetOptions = {title:name,uipk:uipk,multiselect:false};
                        f7Json.readonly = '';
                        f7Json.validate = '{required:true}';

                        f7Json.value = {'id': "", 'name': ""};
                        f7Json.isHROrg = "false";
                        f7Json.isAdminOrg = "false";
                        f7Json.searchLikePattern = "any";

                        f7Json.subWidgetOptions.isHRBaseItem = true;
                        f7Json.subWidgetOptions.filterConfig = [{
                            name: 'isComUse',
                            value: true,
                            alias:jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_8,
                            widgetType: 'checkbox'
                        }];
                        f7Json.subWidgetOptions.bizFilterFields = "hrOrgUnitF7";
                        f7Json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
                        f7Json.subWidgetName = 'specialPromptGrid';
                        prop_value_ctrl.shrPromptBox(f7Json);
                        prop_value_ctrl.unbind("keydown.shrPromptGrid");
                        prop_value_ctrl.unbind("keyup.shrPromptGrid");
                        prop_value_ctrl.attr("placeholder","");
                        prop_value_ctrl.attr("uipk",uipk);
                        prop_value_ctrl.css("width","90px");
                    }
                    $(".select_field >div").addClass("search-emp-field");
                }
            }});
    }
    ,

    /*
    *原来是继承edit的，改成集成list了没有这个方法了，所以手动加上。
    */
    validate: function () {
        $form = $("#form");
        var flag = $form.wafFormValidator("validateForm", true);
        if (!flag) {
            shr.showWarning({
                message: jsBizMultLan.atsManager_lackHolidayFileInfoEdit_i18n_6,
                hideAfter: 5
            });
        }

        return flag;
    },
    verify: function () {
        return true;
    }
});



