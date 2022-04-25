//变动规则假期js
var _ruleDetail_num = 0;
shr.defineClass("shr.ats.atsPCRuleSetMulitEdit", shr.framework.MultiRow, {
    initalizeDOM: function () {
        $('.shr-multiRow-empty').css({cssText: "position: absolute;left: 20%;background: #fff;width: 80%;height: 533px;line-height: 500px;text-align:center;box-sizing: border-box;padding-left: 0!important;"});
        $('.shr-multiRow-empty > .offset0').css({marginLeft: '-30px'});
        var _self = this;
        shr.ats.atsPCRuleSetMulitEdit.superClass.initalizeDOM.call(this);
        $('#form').first().hide();
        _self.initNavigation();
        _self.viewMainPageStyle();
        _self.initPCRuleMultDom();
    }
    , viewMainPageStyle: function () {
        $('.view_manager_body').css({cssText: "background: transparent;padding: 0!important;min-height: 514px;background: transparent;box-sizing: border-box;"});
        $(".shr-multiRow").css({margin: 0});
        $(".shr-multiRow .view_mainPage").css({
            width: '80%',
            float: 'right',
            background: '#fff',
            margin: 0,
            padding: '20px',
            boxSizing: 'border-box',
            minHeight: '533px'
        });
        $("#cat" + shr.getUrlParams().tab).parent().addClass("active");
        $('.nav-tabs .active').css({
            color: 'rgb(79, 81, 84)',
            boxSizing: 'border-box',
            fontWeight: 'bold',
            borderLeft: '6px solid rgb(56, 140, 255)',
            background: 'rgb(237, 247, 255)'
        });
    }
    , reloadPageByTab: function (tab) {
        $('#form').first().hide();
        var that = this;
        var param = shr.getUrlParams();
        param.tab = tab
        shr.urlLocate(that.getPageUrl(), param);
    }
    , initNavigation: function () {
        if ($(".tabbable").length > 0) {
            return;
        }
        var that = this;
        var divStr = [];
        divStr.push("<div class='tabbable tabs-left'>");
        divStr.push(" <ul class='nav nav-tabs'>");
        divStr.push("<li title='" + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_14 + "'><a href='#tab0' data-toggle='tab' id='cat0'>"
            + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_14
            + "</a></li>");
        divStr.push("<li title='" + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_23 + "'><a href='#tab1' data-toggle='tab' id='cat1'>"
            + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_23
            + "</a></li>");
        divStr.push("<li title='" + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_50 + "'><a href='#tab7' data-toggle='tab' id='cat7'>"
            + jsBizMultLan.atsManager_atsPCRuleSetForHolMulitEdit_i18n_50
            + "</a></li>");
        divStr.push("<li title='" + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_31 + "'><a href='#tab2' data-toggle='tab' id='cat2'>"
            + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_31
            + "</a></li>");
        divStr.push("<li title='" + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_10 + "'><a href='#tab3' data-toggle='tab' id='cat3'>"
            + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_10
            + "</a></li>");
        divStr.push("<li title='" + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_17 + "'><a href='#tab4' data-toggle='tab' id='cat4' style='white-space: nowrap;overflow: hidden;text-overflow:ellipsis;'>"
            + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_17
            + "</a></li>");
        divStr.push("<li title='" + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_15 + "'><a href='#tab5' data-toggle='tab' id='cat5' style='white-space: nowrap;overflow: hidden;text-overflow:ellipsis;'>"
            + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_15
            + "</a></li>");
        divStr.push("<li title='" + jsBizMultLan.atsManager_atsPCRuleSetForHolMulitEdit_i18n_51 + "'><a href='#tab8' data-toggle='tab' id='cat8'>"
            + jsBizMultLan.atsManager_atsPCRuleSetForHolMulitEdit_i18n_51
            + "</a></li>");
        divStr.push("<li title='" + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_19 + "'><a href='#tab6' data-toggle='tab' id='cat6'>"
            + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_19
            + "</a></li>");
        var tabPaneStr = [];
        divStr.push("</ul><div class='tab-content'>");
        divStr.push("<div class='tab-pane active' id='tab0'></div>");
        divStr.push(" </div></div>");
        $(".shr-multiRow-empty").after(divStr.join(""));
        $(".tabbable.tabs-left a[href^=#tab]").each(function () {
            $(this).attr("title", $(this).text()).css({overflow: 'hidden'});
        });
        $("[href='#tab0']").click(function () {
            $('.active').eq(1).css({cssText: 'width: 100%; text-align: center; cursor: pointer; font-size: 15px; height: 46px; line-height: 46px;'});
            $(this).parent().css({
                color: 'rgb(79, 81, 84)',
                boxSizing: 'border-box',
                fontWeight: 'bold',
                borderLeft: '6px solid rgb(56, 140, 255)',
                background: 'rgb(237, 247, 255)'
            });
            $(".shr-multiRow-empty").hide();
            var entryElement = $(".view_mainPage.row-fluid").find('[id^=entry]');
            if (0 !== entryElement.length) {
                entryElement.hide();
            } else if (uuidNow!=null && uuidNow!='') {
                $(".view_mainPage.row-fluid").find('[id=' + uuidNow + ']').hide();
            }
            $('#form').first().show();
            $('#form').first().css({
                display: 'block',
                position: 'absolute',
                width: '80%',
                marginLeft: '20%',
                background: '#fff',
                padding: '20px 0',
                boxSizing: 'border-box',
                minHeight: '534px'
            });
            if ($('#form').length === 2) {
                $('#form').last().hide();
            }
        });
        $("[href='#tab1']").click(function () {
            that.reloadPageByTab(1);
        });
        $("[href='#tab2']").click(function () {
            that.reloadPageByTab(2);
        });
        $("[href='#tab3']").click(function () {
            that.reloadPageByTab(3);
        });
        $("[href='#tab4']").click(function () {
            that.reloadPageByTab(4);
        });
        $("[href='#tab5']").click(function () {
            that.reloadPageByTab(5);
        });
        $("[href='#tab6']").click(function () {
            that.reloadPageByTab(6);
        });

        $("[href='#tab7']").click(function () {
            that.reloadPageByTab(7);
        });
        $("[href='#tab8']").click(function () {
            that.reloadPageByTab(8);
        });
        $('.tabbable').css({
            display: 'block',
            float: 'left',
            background: '#fff',
            width: '19.3%',
            minHeight: '514px',
            paddingTop: '20px'
        });
        $('.nav-tabs').css({width: '100%', border: 'none'});
        $('.nav-tabs li').css({
            width: '100%',
            textAlign: 'center',
            cursor: 'pointer',
            fontSize: '15px',
            height: '46px',
            lineHeight: '46px'
        });
        $('.nav-tabs a').css({
            border: 'none',
            padding: 0,
            margin: 0,
            lineHeight: '46px',
            height: '46px',
            background: 'transparent',
            color: 'rgb(119, 119, 119)'
        });

    }
    , initPCRuleMultDom: function () {
        var _self = this;
        $('#addNew').css('cssText', 'padding:2px 5px !important');
        var uuid = _self.uuid;
        if (_self.getOperateState() == 'VIEW' && uuid != '') {
            //var uuid = $('.shr-multiRow').find("form").attr("id").substring(8);
            var billId = _self.billId;
            var ItemsJson = _self.getItemsJosn();
            var res = ItemsJson.result;
            var _ruleDetail_num = _self.uuid;
            var isSub;
            if (res.isSub == '1') {
                isSub = jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_25;
            } else {
                isSub = jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_13;
            }
            var html = ''
                + '<h5 style=" padding-left: 110px; ">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_28
                + '</h5>'
                + '<div class="col-lg-2 field-desc"/>'
                + '<div class="col-lg-4"><div class="field_label" title="'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_24
                + '">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_24
                + '</div></div>'
                + '<span class="field_input"  value="' + res.ruleOrgUnit + '">' + res.ruleOrgUnit + '</span>'
                + '</div>'
                + '<div class="col-lg-2 field-desc"/>'
                + '<div class="col-lg-4"><div class="field_label" title="'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_1
                + '">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_1
                + '</div></div>'
                + '<span class="field_input"  value="">' + isSub + '</span>'
                + '</div>'
                + '</br>'
                + '<div class="col-lg-2 field-desc"/>'
                + '<div  id="serviceAge_' + _ruleDetail_num + '" ><div class="row-fluid row-block row_field">'
                + '<div class="span2"><span class="">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_20
                + '</span></div>'
                //+ '<div class="span2"><i id="serviceAge_add" class="icon-plus" style="padding:2px" ></i></div>'
                + '</div></div>'
                + '</div>'
                + '';
            +'</div>'
            + '</div>'
            + '';
            $('#' + uuid).find("form").append(html);
            for (var i = 0; i < ItemsJson.rows.length; i++) {
                _self.showItemHtml(ItemsJson.rows[i], _ruleDetail_num);
            }
        }
        if (_self.getOperateState() == 'EDIT' && uuid != '') {
            var billId = _self.billId;
            var uuid = this.uuid;
            // 片断
            var serviceAge_num = 0;
            var ruleDetail_num = this.uuid;
            var ItemsJson = _self.getItemsJosn();
            var res = ItemsJson.result;
            var isSub;
            if (res.isSub == '1') {
                isSub = jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_25;
            } else {
                isSub = jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_13;
            }
            var html = ''
                + '<h5 style=" padding-left: 110px; ">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_28
                + '</h5>'
                + '<div class="col-lg-2 field-desc"/>'
                + '<div class="col-lg-4"><div class="field_label" title="'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_24
                + '">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_24
                + '</div></div>'
                + '<div class="col-lg-6 field-ctrl"><input id="ruleOrgUnit' + uuid + '" name="ruleOrgUnit"  class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" ></div>'
                + '</div>'
                + '<div class="col-lg-4"><div class="field_label" title="'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_1
                + '">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_1
                + '</div></div>'
                + '<div class="col-lg-6 field-ctrl">'
                + '<input type="checkbox" id="isSub' + uuid + '" name="isSub" value="1" dataextenal="" >'
                + '</div>'
                + '</br>'
                + '<div class="col-lg-2 field-desc"/>'
                + '<div  id="serviceAge_' + ruleDetail_num + '" ><div class="row-fluid row-block row_field">'
                + '<div class="span2"><span class="">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_20
                + '</span></div>'
                + '<div class="span2"><i id="serviceAge_add" class="icon-plus" style="padding:2px" ></i></div>'
                + '</div></div>'
                + '</div>'

                + '</br>'


                + '<h5 style=" padding-left: 110px; ">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_2
                + '</h5>'
                + '  <div data-ctrlrole="labelContainer">'
                + '<div class="col-lg-4 field-desc"/>'

                + '<div class="col-lg-6 field-ctrl"><input id="changeOper' + uuid + '"  name="changeOper" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" ></div>'
                + '</div>'
                + '</div>'
                + '</br>'
                + '<h5 style=" padding-left: 110px; ">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_16
                + '</h5>'
                + '<div style=" padding-left: 110px; "><input id="isHand' + uuid + '" value="0" name="isHand' + uuid + '" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_33
                + '</div>'
                + '<div style=" padding-left: 110px; ">'
                + '<input id="isHand' + uuid + '" name="isHand' + uuid + '" value="1" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_4
                + '</div>'
                + '<div class="col-lg-2 field-desc"/>'

                + '<div class="col-lg-6 field-ctrl"><input id="holidayPolicySet' + uuid + '"  name="holidayPolicySet" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" ></div>'
                + '</div>'
                + '';

            $('#' + uuid).find("form").append(html);
            var grid_f7_json = null;
            grid_f7_json = {id: "changeOper" + uuid, name: "changeOper"};
            grid_f7_json.subWidgetName = 'shrPromptGrid';
            grid_f7_json.subWidgetOptions = {
                title: "",
                uipk: "com.kingdee.eas.hr.base.app.HRBizDefine.F7",
                query: "",
                filter: "",
                domain: "",
                multiselect: true
            };
            //grid_f7_json.readonly = '';
            $("input[name='changeOper']").shrPromptBox(grid_f7_json);
            $("#changeOper" + uuid + "_el").attr("value", res.changeOper);
            $("#changeOper" + uuid).attr("value", res.changeOper);
            $("#changeOper" + uuid).attr("title", res.changeOper);
            //行政组织
            grid_f7_json = null;
            //grid_f7_json = {id:"ruleOrgUnituuid"+uuidNum,name:"ruleOrgUnit"};
            grid_f7_json = {id: "ruleOrgUnit" + uuid, name: "ruleOrgUnit"};
            grid_f7_json.subWidgetName = 'shrPromptGrid';
            grid_f7_json.subWidgetOptions = {
                title: "",
                uipk: "com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",
                query: "",
                filter: "",
                domain: "",
                multiselect: true
            };
            grid_f7_json.readonly = '';
            $("input[name='ruleOrgUnit']").shrPromptBox(grid_f7_json);
            $("#ruleOrgUnit" + uuid + "_el").attr("value", res.ruleOrgUnit);
            $("#ruleOrgUnit" + uuid).attr("value", res.ruleOrgUnit);
            $("#ruleOrgUnit" + uuid).attr("title", res.ruleOrgUnit);
            //假期制度
            grid_f7_json = null;
            //grid_f7_json = {id:"ruleOrgUnituuid"+uuidNum,name:"ruleOrgUnit"};
            grid_f7_json = {id: "holidayPolicySet" + uuid, name: "holidayPolicySet"};
            grid_f7_json.subWidgetName = 'shrPromptGrid';
            grid_f7_json.subWidgetOptions = {
                title: "",
                uipk: "com.kingdee.eas.hr.ats.app.HolidayPolicySet.F7",
                query: "",
                filter: "",
                domain: "",
                multiselect: true
            };
            grid_f7_json.readonly = '';
            $("input[name='holidayPolicySet']").shrPromptBox(grid_f7_json);
            $("#holidayPolicySet" + uuid + "_el").attr("value", res.holidayPolicySet);
            $("#holidayPolicySet" + uuid).attr("value", res.holidayPolicySet);
            $("#holidayPolicySet" + uuid).attr("title", res.holidayPolicySet);
            if (res.isSub == '1') {
                document.getElementById("isSub" + this.uuid).checked = true;
            }
            $('#serviceAge_' + ruleDetail_num + ' #serviceAge_add').unbind('click').bind('click', function () {
                serviceAge_num = serviceAge_num + 1;
                _self.addConditionHtml(ruleDetail_num, serviceAge_num);
            });
            for (var i = 0; i < ItemsJson.rows.length; i++) {
                _self.setItemHtml(ItemsJson.rows[i], ruleDetail_num);
            }

        }
    }
    ,
    saveAction: function (event) {

        var _self = this;
        var workArea = _self.getWorkarea();
        var uuid = workArea.get(0).id;
        $form = $('form', workArea);

        var a = $('input[name=forbidenDay]').val();
        var regu = /^\d+$/;
        if (shr.getUrlRequestParam("tab") == '4' && (!regu.test(a))) {
            shr.showWarning({
                message: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_21
            });
            return false;
        } else {
            if ($form.valid() && _self.verify()) {	//界面校验通过
//			if ($form.valid()&&_self.verify()&&_self.checkAttendanceNum(uuid))
                _self.doSave(event, 'save');
            }
        }


    }
    , showItemHtml: function (rule_items, ruleDetail_num) {
        var that = this;
        var work_object_array = [], service_object_array = [];

        for (var i = 0; i < rule_items.ruleItems.length; i++) {
            that.showConditionHtml(rule_items.ruleItems[i], ruleDetail_num);
        }
        for (var i = 0; i < rule_items.valueItems.length; i++) {

            that.showDefaultValueItemHtml(rule_items.valueItems[i], ruleDetail_num);
        }
    }
    , showConditionHtml: function (ruleItems, ruleDetail_num) {
        if (ruleItems.config == undefined) {
            return
        }
        var that = this;
        var filterInfo = eval('(' + ruleItems.config + ')');
        var con_tpl =
            '<div id="condition_coll" name = "condition_coll">' +
            '<div name ="condition_item" class="row-fluid row-block row_field" style="width: 115%">'
            + '<div class="span1"><span class="cell-RlStdType"></span></div>'
            + '<div class="span2 field-ctrl">'
            + filterInfo.label
            + '</div>'
            + '<div class="span2">' + filterInfo.compareTypeLabel + ' </div>'
            + '<div class="span2 field-ctrl">' + filterInfo.valueLabel + '</div>'
            + '</div></div>';
        $("#serviceAge_" + ruleDetail_num).append(con_tpl);
    }
    , showDefaultValueItemHtml: function (ruleItems, ruleDetail_num) {
        var that = this;
        var work_object_array = [], service_object_array = [];

        if (ruleItems.config == undefined) {
            return
        }
        var that = this;
        var filterInfo = eval('(' + ruleItems.config + ')');
        var con_tpl =
            '<div id="condition_coll" name = "condition_coll">' +
            '<div name ="condition_item" class="row-fluid row-block row_field" style="width: 115%">'
            + '<div class="span1"><span class="cell-RlStdType"></span></div>'
            + '<div class="span2 field-ctrl">'
            + filterInfo.label
            + '</div>'
            + '<div class="span2">' + filterInfo.compareTypeLabel + ' </div>'
            + '<div class="span2 field-ctrl">' + filterInfo.valueLabel + '</div>'
            + '</div></div>';
        $("#defaultValToSet_" + ruleDetail_num).append(con_tpl);
    }
    ,
    //
    getItemsJosn: function () {
        var atsPCRuleId = _self.billId;
        var returnVal;
        var data = {
            atsPCRuleId: atsPCRuleId
//					uipk:"com.kingdee.eas.hr.ats.app.AtsPCRule.form"
        };
        shr.doAjax({
            url: shr.getContextPath() + "/dynamic.do?method=getItemsJson&handler=com.kingdee.shr.ats.web.handler.AtsPCRuleMulitRowHandler",
            dataType: 'json',
            type: "POST",
            async: false,
            data: data,
            success: function (response) {
                var rst = response || {};
                returnVal = rst;

            }
        });
        return returnVal;

    }
    , setItemHtml: function (rule_items, ruleDetail_num) {
        var that = this;
        var workAge_num = 0;
        var condition_num = 0;
        var value_num = 0;
        $('#serviceAge_' + ruleDetail_num + ' #serviceAge_add').unbind('click').bind('click', function () {
            condition_num = condition_num + 1;
            that.addConditionHtml(ruleDetail_num, condition_num);
        });
        $('#defaultValToSet_' + ruleDetail_num + ' #defaultValToSet_add').unbind('click').bind('click', function () {
            value_num = value_num+1;
            that.addSetValueForAtsFileHtml(ruleDetail_num, value_num);
        });
        $('#delete_' + ruleDetail_num).unbind('click').bind('click', function () {
            $(this).closest("div[id^='rule_item']").remove();
        });

        $('#add_' + ruleDetail_num).unbind('click').bind('click', function () {
            _ruleDetail_num = _ruleDetail_num + 1;
            that.addItemHtml(_ruleDetail_num);
        });


        $('#rule_item_' + ruleDetail_num).find('input[name=conditionGroupId]').val(rule_items.id);
        for (var i = 0; i < rule_items.ruleItems.length; i++) {
            condition_num = condition_num + 1;
            that.addConditionHtml(ruleDetail_num, condition_num);
            that.setConditionHtml(rule_items.ruleItems[i], ruleDetail_num, condition_num);
        }
        for (var i = 0; i < rule_items.valueItems.length; i++) {
            value_num = value_num + 1;
            that.addSetValueForAtsFileHtml(ruleDetail_num, value_num);
            that.setSetValueForAtsFileHtml(rule_items.valueItems[i], ruleDetail_num, value_num);
        }
    }
    , setSetValueForAtsFileHtml: function (ruleItems, ruleDetail_num, condition_num) {
        if (ruleItems.config == undefined) {
            return
        }
        var pre_prop_value = "prop_value_" + ruleDetail_num + '_' + condition_num;
        var pre_prop_value_el =  "prop_value_" + ruleDetail_num + '_' + condition_num+"_el";
        var filterInfo = eval('(' + ruleItems.config + ')');
        var pre_id = $('#valueSet_item_' + ruleDetail_num + '_' + condition_num);
        $('#valueSet_item_' + ruleDetail_num + '_' + condition_num).find('input[name="valueSetId"]').val(ruleItems.id);
        var prop_op_json = {id: "prop_op"};
        prop_op_json.data = [
            {value: "=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_9}
        ];


        var demo = {
            name: filterInfo.label,
            field: filterInfo.name,
            type: filterInfo.type,
            enumSource: filterInfo.enumSource
        };
        var type = filterInfo.type;
        var enumSource = filterInfo.enumSource;
        var uipk = filterInfo.uipk;
        var name = filterInfo.label;

        var prop_op_ctrl = pre_id.find("#prop_op");
        prop_op_ctrl.css("width", "");
        var prop_value_ctrl = pre_id.find("input[name='prop_value']");
        prop_op_ctrl.wrap("<div></div>");
        if (type == "Date" || type == "TimeStamp") {
            var picker_json = {};
            picker_json.id = pre_prop_value;
            prop_value_ctrl.shrDateTimePicker($.extend(picker_json, {
                ctrlType: "TimeStamp",
                isAutoTimeZoneTrans: false
            }));
            prop_value_ctrl.css("width", "120px");
        }
        if (type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int") {

        }

        if(type == "StringEnum" || type == "IntEnum" ||  type == "Enum"){
            var select_json = {};
            select_json.id = pre_prop_value;
            select_json.enumSource = enumSource;
            prop_value_ctrl.shrSelect(select_json);
            prop_value_ctrl.css("width","90px");
        }
        if (type == "Boolean") {

            var select_json = {id: pre_prop_value};
            select_json.data = [{value: "1", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_25},
                {value: "0", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_13}
            ];
            prop_value_ctrl.shrSelect(select_json);
            prop_value_ctrl.css("width", "90px");
        }
        if (type == "String") {
            prop_value_ctrl.css("width", "126px");
            prop_value_ctrl.attr("placeholder", jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_12);
        }
        if (uipk != null && uipk != "null" && uipk != "undefined") {
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
                alias: jsBizMultLan.atsManager_attendanceFileBatchMaintainBase_i18n_19,
                widgetType: 'checkbox'
            }];
            f7Json.subWidgetOptions.bizFilterFields = "hrOrgUnit_id";
            f7Json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
            f7Json.subWidgetName = 'specialPromptGrid';
            prop_value_ctrl.shrPromptBox(f7Json);
            prop_value_ctrl.unbind("keydown.shrPromptGrid");
            prop_value_ctrl.unbind("keyup.shrPromptGrid");
            prop_value_ctrl.attr("placeholder","");
            prop_value_ctrl.attr("uipk",uipk);
            prop_value_ctrl.css("width","180px");
            // var f7Json = {id: pre_prop_value, name: "prop_value"};
            // f7Json.subWidgetName = 'shrPromptGrid';
            // f7Json.subWidgetOptions = {title: name, uipk: uipk, multiselect: false};
            // prop_value_ctrl.shrPromptBox(f7Json);
            // prop_value_ctrl.unbind("keydown.shrPromptGrid");
            // prop_value_ctrl.unbind("keyup.shrPromptGrid");
            // prop_value_ctrl.css("width", "90px");
        }
        $(".select_field >div").addClass("search-emp-field");

        pre_id.find("#prop_field").attr('enumSource', enumSource);
        pre_id.find("#prop_field").val(filterInfo.label);
        pre_id.find("#prop_field").attr('prop_field', filterInfo.name);
        pre_id.find("#prop_field").attr('title', filterInfo.label);
        pre_id.find("#prop_field").addClass("input-height");
        pre_id.find("#prop_field").attr('field_type', filterInfo.type);
        $('#' +pre_prop_value_el).val(filterInfo.value);
        pre_id.find("input[name='prop_op_el']").val(filterInfo.compareType);
        pre_id.find("input[name='prop_op']").val(filterInfo.compareTypeLabel);
        pre_id.find("input[name='prop_value_el']").val(filterInfo.value);
        pre_id.find("input[name='prop_value']").val(filterInfo.valueLabel);
        pre_id.find("input[name='prop_value']").attr('uipk', filterInfo.uipk);


    }

    , setConditionHtml: function (ruleItems, ruleDetail_num, condition_num) {
        if (ruleItems.config == undefined) {
            return
        }
        var pre_prop_value = "prop_value_" + ruleDetail_num + '_' + condition_num;
        var filterInfo = eval('(' + ruleItems.config + ')');
        var pre_id = $('#condition_item_' + ruleDetail_num + '_' + condition_num);
        $('#condition_item_' + ruleDetail_num + '_' + condition_num).find('input[name="conditionId"]').val(ruleItems.id);
        var prop_op_json = {id: "prop_op"};
        prop_op_json.data = [{value: "like", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_0},
            {value: "not like", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_4},
            {value: "=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_9},
            {value: "<>", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_5},
            {value: ">", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_7},
            {value: "<", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_26}
        ];

        var prop_op_date_json = {id: "prop_op"};
        prop_op_date_json.data = [{value: "=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_9},
            {value: "<>", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_5},
            {value: ">", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_7},
            {value: "<", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_26},
            {value: ">=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_8},
            {value: "<=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_27}
        ];

        var prop_boolean_json = {id: "prop_op"};
        prop_boolean_json.data = [
            {value: "=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_9},
            {value: "<>", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_5}
        ];

        var demo = {
            name: filterInfo.label,
            field: filterInfo.name,
            type: filterInfo.type,
            enumSource: filterInfo.enumSource
        };
        var type = filterInfo.type;
        var enumSource = filterInfo.enumSource;
        var uipk = filterInfo.uipk;
        var name = filterInfo.label;

        var prop_op_ctrl = pre_id.find("#prop_op");
        prop_op_ctrl.css("width", "");
        var prop_value_ctrl = pre_id.find("input[name='prop_value']");
        prop_op_ctrl.wrap("<div></div>");
        if (type == "Date" || type == "TimeStamp") {
            prop_op_ctrl.shrSelect(prop_op_date_json);
            prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);

            var picker_json = {};
            picker_json.id = pre_prop_value;
            prop_value_ctrl.shrDateTimePicker($.extend(picker_json, {
                ctrlType: "TimeStamp",
                isAutoTimeZoneTrans: false
            }));
            prop_value_ctrl.css("width", "120px");
        }
        if (type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int") {
            prop_op_ctrl.shrSelect(prop_op_date_json);
            prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
        }
        if (type == "StringEnum" || type == "IntEnum") {

            prop_op_ctrl.shrSelect(prop_boolean_json);
            prop_op_ctrl.shrSelect("setValue", filterInfo.compareType);

            var select_json = {};
            select_json.id = pre_prop_value;
            select_json.enumSource = enumSource;
            prop_value_ctrl.shrSelect(select_json);
            prop_value_ctrl.css("width", "90px");
        }
        if (type == "Boolean") {
            prop_op_ctrl.shrSelect(prop_boolean_json);
            prop_op_ctrl.shrSelect("setValue", prop_boolean_json.data[0].value);

            var select_json = {id: pre_prop_value};
            select_json.data = [{value: "1", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_25},
                {value: "0", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_13}
            ];
            prop_value_ctrl.shrSelect(select_json);
            prop_value_ctrl.css("width", "90px");
        }
        if (type == "String") {
            prop_op_ctrl.shrSelect(prop_op_json);
            prop_op_ctrl.shrSelect("setValue", prop_op_json.data[0].value);
            prop_value_ctrl.css("width", "126px");
            prop_value_ctrl.attr("placeholder", jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_12);
        }
        if (uipk != null && uipk != "null" && uipk != "undefined") {
            var f7Json = {id: pre_prop_value, name: "prop_value"};
            f7Json.subWidgetName = 'shrPromptGrid';
            f7Json.subWidgetOptions = {title: name, uipk: uipk, multiselect: true};
            prop_value_ctrl.shrPromptBox(f7Json);
            prop_value_ctrl.unbind("keydown.shrPromptGrid");
            prop_value_ctrl.unbind("keyup.shrPromptGrid");
            prop_value_ctrl.css("width", "90px");
        }
        $(".select_field >div").addClass("search-emp-field");

        pre_id.find("#prop_field").attr('enumSource', enumSource);
        pre_id.find("#prop_field").val(filterInfo.label);
        pre_id.find("#prop_field").attr('prop_field', filterInfo.name);
        pre_id.find("#prop_field").attr('title', filterInfo.label);
        pre_id.find("#prop_field").addClass("input-height");
        pre_id.find("#prop_field").attr('field_type', filterInfo.type);
        pre_id.find("input[name='prop_op_el']").val(filterInfo.compareType);
        pre_id.find("input[name='prop_op']").val(filterInfo.compareTypeLabel);
        pre_id.find("input[name='prop_value_el']").val(filterInfo.value);
        pre_id.find("input[name='prop_value']").val(filterInfo.valueLabel);
        pre_id.find("input[name='prop_value']").attr('uipk', filterInfo.uipk);


    }
    ,
    setConditionRuleHtml: function (rule_items, ruleDetail_num) {
        var that = this;
        var condition_num = 0;

        var head_condition_label = '<div id="condition_' + ruleDetail_num + '"><div class="row-fluid row-block row_field">'
            + '<div class="span2"><input type="hidden" name="conditionGroupId"  /><span class="">'
            + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_28
            + '</span></div>'
            + '<div class="span2"><i id="condition_add" class="icon-plus" style="padding:10px" ></i></div>'
            + '</div></div>';

        var html = head_condition_label;

        var rule_item_label = '<div id = "rule_item_' + ruleDetail_num + '" class = "item_css"></div>';
        $('#conditionDetail').append(rule_item_label);
        $('#rule_item_' + ruleDetail_num).append(html);


        $('#condition_' + ruleDetail_num + ' #condition_add').unbind('click').bind('click', function () {
            condition_num = condition_num + 1;
            that.addConditionHtml(ruleDetail_num, condition_num);
        });


        $('#rule_item_' + ruleDetail_num).find('input[name=conditionGroupId]').val(rule_items.id);
        for (var i = 0; i < rule_items.ruleItems.length; i++) {
            condition_num = condition_num + 1;
            that.addConditionHtml(ruleDetail_num, condition_num);
            that.setConditionHtml(rule_items.ruleItems[i], ruleDetail_num, condition_num);
        }
    },

    editAction: function (options) {
        this.doEdit('edit', options);
    }

    ,
    addNewAction: function () {
        var params = this.prepareParam();
        var self = this;
        var relatedFieldId = this.getRelatedFieldId();
        if (relatedFieldId) {
            params.relatedFieldId = relatedFieldId;
        }
        params.holidayPolicySetId = $('#form #id').val();
        params.method = 'addNew';
        params.billId = this.billId;
        // 片断
        var serviceAge_num = 0;
        var ruleDetail_num = 0;
        var _self = this;

        shr.doGet({
            url: _self.dynamicPage_url,
            data: params,
            success: function (response) {
                var next;
                if (_self.isEmpty()) {
                    $('.shr-multiRow').append(response);
                    var uuid = $('.shr-multiRow').find("form").attr("id").substring(8);
                    ruleDetail_num = this.uuid;
                    var html = ''
                        + '<h5 style=" padding-left: 110px; ">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_28
                        + '</h5>'
                        + '<div class="col-lg-2 field-desc"/>'
                        + '<div class="col-lg-4"><div class="field_label" title="'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_24
                        + '">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_24
                        + '</div></div>'
                        + '<div class="col-lg-6 field-ctrl"><input id="ruleOrgUnituuid' + uuid + '" name="ruleOrgUnit" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
                        + '</div>'
                        + '<div class="col-lg-4"><div class="field_label" title="'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_1
                        + '">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_1
                        + '</div></div>'
                        + '<div class="col-lg-6 field-ctrl">'
                        + '<div  style="position: relative;"><input type="checkbox" id="isSubuuid' + uuid + '" name="isSub" value="1" dataextenal="" ></div> '
                        + '</div>'
                        + '</br>'
                        + '<div class="col-lg-2 field-desc"/>'
                        + '<div  id="serviceAge_' + ruleDetail_num + '" ><div class="row-fluid row-block row_field">'
                        + '<div class="span2"><span class="">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_20
                        + '</span></div>'
                        + '<div class="span2"><i id="serviceAge_add" class="icon-plus" style="padding:2px" ></i></div>'
                        + '</div></div>'
                        + '</div>'

                        + '</br>'


                        + '<h5 style=" padding-left: 110px; ">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_2
                        + '</h5>'
                        + '  <div data-ctrlrole="labelContainer">'
                        + '<div class="col-lg-4 field-desc"/>'

                        + '<div class="col-lg-6 field-ctrl"><input id="changeOperuuid' + uuid + '" name="changeOper" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
                        + '</div>'
                        + '</div>'
                        + '</br>'
                        + '<h5 style=" padding-left: 110px; ">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_16
                        + '</h5>'
                        + '<div style=" padding-left: 110px; "><input id="isHanduuid' + uuid + '" value="0" name="isHanduuid' + uuid + '" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_33
                        + '</div>'
                        + '<div style=" padding-left: 110px; ">'
                        + '<input id="isHanduuid' + uuid + '" name="isHanduuid' + uuid + '" value="1" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_29
                        + '</div>'
                        + '<div class="col-lg-2 field-desc"/>'

                        + '<div class="col-lg-6 field-ctrl"><input id="holidayPolicySetuuid' + uuid + '" name="holidayPolicySet" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
                        + '</div>'
                        + '</div>'
                        + '';
                    $('.shr-multiRow').find("form").append(html);
                } else {
                    var $workarea = _self.getWorkarea();
                    $workarea.after(response);
                    next = $workarea.next();
                    var uuid = $workarea.next().attr("id").substring(4);
                    ruleDetail_num = this.uuid;
                    var html = ''
                        + '<h5 style=" padding-left: 110px; ">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_28
                        + '</h5>'
                        + '<div class="col-lg-2 field-desc"/>'
                        + '<div class="col-lg-4"><div class="field_label" title="'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_24
                        + '">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_24
                        + '</div></div>'
                        + '<div class="col-lg-6 field-ctrl"><input id="ruleOrgUnituuid' + uuid + '" name="ruleOrgUnit" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
                        + '</div>'
                        + '<div class="col-lg-4"><div class="field_label" title="'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_1
                        + '">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_1
                        + '</div></div>'
                        + '<div class="col-lg-6 field-ctrl">'
                        + '<div  style="position: relative;"><input type="checkbox" id="isSubuuid' + uuid + '" name="isSub" value="1" dataextenal="" ></div> '
                        + '</div>'
                        + '</br>'
                        + '<div class="col-lg-2 field-desc"/>'
                        + '<div  id="serviceAge_' + ruleDetail_num + '" ><div class="row-fluid row-block row_field">'
                        + '<div class="span2"><span class="">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_20
                        + '</span></div>'
                        + '<div class="span2"><i id="serviceAge_add" class="icon-plus" style="padding:2px" ></i></div>'
                        + '</div></div>'
                        + '</div>'

                        + '</br>'


                        + '<h5 style=" padding-left: 110px; ">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_2
                        + '</h5>'
                        + '  <div data-ctrlrole="labelContainer">'
                        + '<div class="col-lg-4 field-desc"/>'

                        + '<div class="col-lg-6 field-ctrl"><input id="changeOperuuid' + uuid + '" name="changeOper" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
                        + '</div>'
                        + '</div>'
                        + '</br>'
                        + '<h5 style=" padding-left: 110px; ">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_16
                        + '</h5>'
                        + '<div style=" padding-left: 110px; "><input id="isHanduuid' + uuid + '" value="0" name="isHanduuid' + uuid + '" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_33
                        + '</div>'
                        + '<div style=" padding-left: 110px; ">'
                        + '<input id="isHanduuid' + uuid + '" name="isHanduuid' + uuid + '" value="1" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                        + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_29
                        + '</div>'
                        + '<div class="col-lg-2 field-desc"/>'

                        + '<div class="col-lg-6 field-ctrl"><input id="holidayPolicySetuuid' + uuid + '" name="holidayPolicySet" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
                        + '</div>'
                        + '</div>'
                        + '';
                    $workarea.next().find("form").append(html);
                    while (next.length > 0) {
                        if (next.hasClass('view_mainPage')) {
                            break;
                        }
                        next = next.next();
                    }
                    next.find('.entry-button-top').show();

                }
                _self.afterMultiRowRender();
                _self.adjustIframeHeight();
                //变动操作
                var grid_f7_json = null;
                //grid_f7_json = {id:"changeOper",name:"changeOper"};
                grid_f7_json = {id: "changeOperuuid" + uuid, name: "changeOper"};
                grid_f7_json.subWidgetName = 'shrPromptGrid';
                grid_f7_json.subWidgetOptions = {
                    title: "",
                    uipk: "com.kingdee.eas.hr.base.app.HRBizDefine.F7",
                    query: "",
                    filter: "",
                    domain: "",
                    multiselect: true
                };
                grid_f7_json.readonly = '';
                $("input[name='changeOper']").shrPromptBox(grid_f7_json);
                //行政组织
                grid_f7_json = null;
                //grid_f7_json = {id:"ruleOrgUnituuid"+uuidNum,name:"ruleOrgUnit"};
                grid_f7_json = {id: "ruleOrgUnituuid" + uuid, name: "ruleOrgUnit"};
                grid_f7_json.subWidgetName = 'shrPromptGrid';
                grid_f7_json.subWidgetOptions = {
                    title: "",
                    uipk: "com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",
                    query: "",
                    filter: "",
                    domain: "",
                    multiselect: true
                };
                grid_f7_json.readonly = '';
                $("input[name='ruleOrgUnit']").shrPromptBox(grid_f7_json);
                //假期制度
                grid_f7_json = null;
                //grid_f7_json = {id:"ruleOrgUnituuid"+uuidNum,name:"ruleOrgUnit"};
                grid_f7_json = {id: "holidayPolicySetuuid" + uuid, name: "holidayPolicySet"};
                grid_f7_json.subWidgetName = 'shrPromptGrid';
                grid_f7_json.subWidgetOptions = {
                    title: "",
                    uipk: "com.kingdee.eas.hr.ats.app.HolidayPolicySet.F7",
                    query: "",
                    filter: "",
                    domain: "",
                    multiselect: true
                };
                grid_f7_json.readonly = '';
                $("input[name='holidayPolicySet']").shrPromptBox(grid_f7_json);
                $('#serviceAge_' + ruleDetail_num + ' #serviceAge_add').unbind('click').bind('click', function () {
                    serviceAge_num = serviceAge_num + 1;
                    self.addConditionHtml(ruleDetail_num, serviceAge_num);
                });
            }
        });

    }, addConditionHtml: function (ruleDetail_num, condition_num) {

        var that = this;
        var pre_prop_value = "prop_value_" + ruleDetail_num + '_' + condition_num;
        var con_tpl =
            '<div id ="condition_item_' + ruleDetail_num + '_' + condition_num + '" name = "condition_item" class="row-fluid row-block row_field" style="width: 115%">'
            + '<div class="span1"><input type="hidden" name="conditionId"  /><span class="cell-RlStdType"></span></div>'
            + '<div class="span2 field-ctrl">'
            + '<input name_value = "prop_field_html"/>'
            + '</div>'
            + '<div class="span2"><input id="prop_op" type="text" name="prop_op" class="input-height cell-input" style="width:140px"/></div>'
            + '<div class="span2 field-ctrl"><input id=' + pre_prop_value + ' type="text" name="prop_value" class="input-height cursor-pointer" style="width:126px"></div>'
            + '<span class="span1 field_add" style="display: table-cell;width:126px"><i class="icon-remove" style="padding:10px"></i></span>'
            + '</div>';
        $("#serviceAge_" + ruleDetail_num).append(con_tpl);

        var tree_f7_json = {id: "prop_field", name: "prop_field"};

        var that = this;
        that.remoteCall({
            type: "post",
            async: false,
            method: "getFields",
            param: {handler: "com.kingdee.shr.ats.web.handler.HolidayRuleEditHandler"},
            success: function (response) {
                _treeNode = response;
            }
        });

        tree_f7_json.subWidgetName = 'shrPromptTree';
        tree_f7_json.subWidgetOptions =
            {
                treeSettings: {},
                width: 250,
                zNodes: _treeNode
            };
        $("#condition_item_" + ruleDetail_num + "_" + condition_num + " input[name_value='prop_field_html']").shrPromptBox(tree_f7_json);
        that._addItemEventListener(ruleDetail_num, condition_num);

        //删除
        $('#condition_item_' + ruleDetail_num + '_' + condition_num + ' i[class="icon-remove"]').unbind('click').bind('click', function () {
            $(this).closest("div.row_field").remove();
        });


    }

    , _addItemEventListener: function (ruleDetail_num, condition_num) {
        var pre_prop_value = "prop_value_" + ruleDetail_num + "_" + condition_num;
        var prop_op_json = {id: "prop_op"};
        prop_op_json.data = [{value: "like", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_0},
            {value: "not like", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_4},
            {value: "=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_9},
            {value: "<>", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_5},
            {value: ">", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_7},
            {value: "<", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_26}
        ];

        var prop_op_date_json = {id: "prop_op"};
        prop_op_date_json.data = [{value: "=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_9},
            {value: "<>", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_5},
            {value: ">", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_7},
            {value: "<", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_26},
            {value: ">=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_8},
            {value: "<=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_27}
        ];

        var prop_boolean_json = {id: "prop_op"};
        prop_boolean_json.data = [
            {value: "=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_9},
            {value: "<>", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_5}
        ];
        $('input[id="prop_field"]').shrPromptBox("option", {
            onchange: function (e, value) {
//				$(this).parents(".ui-promptBox-frame").next().replaceWith('<input id="prop_op" type="text" name="prop_op" class="search-input-length input-height"/>');
                $(this).parents("div[name='condition_item']").find(".span2").eq(1).children().replaceWith('<input id="prop_op" type="text" name="prop_op" class="input-height cell-input">');
                $(this).parents("div[name='condition_item']").find(".span2").eq(2).children().replaceWith('<input id=' + pre_prop_value + ' type="text" name="prop_value" class="input-height cursor-pointer" style="width:126px">');
                var prop_op_ctrl = $(this).closest('.row-fluid').find('input[id="prop_op"]');
                var prop_value_ctrl = $(this).closest('.row-fluid').find('input[id^="prop_value"]');
                prop_op_ctrl.css("width", "");
                prop_op_ctrl.wrap("<div></div>");
                $(this).addClass("input-height");
                if (value.current != null) {
                    var id = value.current.id;
                    var name = value.current.name;
                    var type = value.current.type;
                    var uipk = value.current.uipk;
                    var enumSource = value.current.enumSource;
                    var field = value.current.field;
                    $(this).data('fieldValue', value.current);
                    $(this).attr("prop_field", field);
                    $(this).attr("field_type", type);
                    if (enumSource != undefined
                        && enumSource != null
                        && enumSource != "") {
                        $(this).attr("enumSource", enumSource);
                    } else {
                        $(this).removeAttr("enumSource");
                    }
                    if (type == "Date" || type == "TimeStamp") {
                        prop_op_ctrl.shrSelect(prop_op_date_json);
                        prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);

                        var picker_json = {};
                        picker_json.id = pre_prop_value;
                        prop_value_ctrl.shrDateTimePicker($.extend(picker_json, {
                            ctrlType: "TimeStamp",
                            isAutoTimeZoneTrans: false
                        }));
                        prop_value_ctrl.css("width", "120px");
                    }
                    if (type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int") {
                        prop_op_ctrl.shrSelect(prop_op_date_json);
                        prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
                    }
                    if (type == "StringEnum" || type == "IntEnum") {
                        prop_op_ctrl.shrSelect(prop_boolean_json);
                        prop_op_ctrl.shrSelect("setValue", prop_boolean_json.data[0].value);

                        var select_json = {};
                        select_json.id = pre_prop_value;
                        select_json.enumSource = enumSource;
                        prop_value_ctrl.shrSelect(select_json);
                        prop_value_ctrl.css("width", "90px");
                    }
                    if (type == "Boolean") {
                        prop_op_ctrl.shrSelect(prop_boolean_json);
                        prop_op_ctrl.shrSelect("setValue", prop_boolean_json.data[0].value);

                        var select_json = {id: pre_prop_value};
                        select_json.data = [{value: "1", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_25},
                            {value: "0", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_13}
                        ];
                        prop_value_ctrl.shrSelect(select_json);
                        prop_value_ctrl.css("width", "90px");
                    }
                    if (type == "String") {
                        prop_op_ctrl.shrSelect(prop_op_json);
                        prop_op_ctrl.shrSelect("setValue", prop_op_json.data[0].value);
                        prop_value_ctrl.css("width", "126px");
                        prop_value_ctrl.attr("placeholder", jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_12);
                    }
                    if (uipk != null && uipk != "null" && uipk != "undefined") {
                        var f7FieldName = value.current.f7FieldName;
                        var f7Json = {id: pre_prop_value, name: "prop_value"};
                        if (f7FieldName != undefined) {
                            f7Json.displayFormat = "{" + f7FieldName + "}";
                        }
                        f7Json.subWidgetName = 'shrPromptGrid';
                        f7Json.subWidgetOptions = {title: name, uipk: uipk, multiselect: true};
                        prop_value_ctrl.shrPromptBox(f7Json);
                        prop_value_ctrl.unbind("keydown.shrPromptGrid");
                        prop_value_ctrl.unbind("keyup.shrPromptGrid");
                        prop_value_ctrl.attr("placeholder", "");
                        prop_value_ctrl.attr("uipk", uipk);
                        prop_value_ctrl.css("width", "180px");
                    }
                    $(".select_field >div").addClass("search-emp-field");
                    prop_op_ctrl.shrSelect("option", {
                        onChange: function (e, value) {
                            $(this).parents(".ui-select-frame").removeClass("oe_focused");
                            prop_value_ctrl.focus();
                            if (type == "Boolean" || type == "StringEnum" || type == "IntEnum") {
                                prop_value_ctrl.shrSelect("selectClick");
                            }
                        }
                    });

                }
            }
        });
    }
    ,
    addServiceItem: function (ruleDetail_num, serviceAge_num) {

        var prop_pre_json = {
            id: "preCmpType",
            readonly: "",
            value: ">=",
            onChange: null,
            validate: "{required:true}",
            filter: ""
        };
        prop_pre_json.data = [{value: ">", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_7},
            {value: ">=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_8}
        ];
        var prop_next_json = {
            id: "nextCmpType",
            readonly: "",
            value: "<",
            onChange: null,
            validate: "{required:true}",
            filter: ""
        };
        prop_next_json.data = [
            {value: "<", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_26},
            {value: "<=", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_27}
        ];
        var position = {
            id: "position",
            readonly: "",
            value: "<",
            onChange: null,
            validate: "{required:true}",
            filter: ""
        };
        position.data = [
            {value: "<", alias: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_30},
            {value: "<=", alias: "ceo"}
        ];

        var work_item_label =
            '<div id = "service_item_' + ruleDetail_num + '_' + serviceAge_num + '" name="service_item" class="row-fluid row-block row_field" style="width: 115%">'
            + '<div class="span2" id><input type="text" name="preCmpType" class="input-height cursor-pointer"  placeholder="'
            + jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_22
            + '"/></div>'
            + '<div class="span2"><input type="text" name="nextCmpType"class="input-height cursor-pointer" dataextenal="" placeholder=""   "/></div>'
            + '<div class="span2"><input type="text"   name = "position" class="input-height cell-input" /></div>'
            + '<div class="span2"><i class="icon-remove" style="padding:10px"></i></div>'
            + '</div>';
        $('#serviceAge_' + ruleDetail_num).append(work_item_label);

        $('#service_item_' + ruleDetail_num + '_' + serviceAge_num + ' input[name=position]').shrSelect(position);
        $('#service_item_' + ruleDetail_num + '_' + serviceAge_num + ' input[name=nextCmpType]').shrSelect(prop_next_json);
        var grid_f7_json = null;
        grid_f7_json = {id: "preCmpType", name: "preCmpType"};
        grid_f7_json = {id: "preCmpType", name: "preCmpType"};
        grid_f7_json.subWidgetName = 'shrPromptGrid';
        grid_f7_json.subWidgetOptions = {
            title: "",
            uipk: "com.kingdee.eas.basedata.org.app.HROrgPosition.f7",
            query: "",
            filter: "",
            domain: "",
            multiselect: true
        };
        grid_f7_json.readonly = '';
        $("input[name='preCmpType']").shrPromptBox(grid_f7_json);
        //删除
        $('#service_item_' + ruleDetail_num + '_' + serviceAge_num + ' i[class="icon-remove"]').unbind('click').bind('click', function () {
            $(this).closest("div.row_field").remove();
        });

    }, assembleSaveData: function (action) {
        var _self = this;
        var data = _self.prepareParam(action + 'Action');
        data.method = action;
        data.operateState = _self.getOperateState();
        //组装新的model
        asmodel = _self.assembleModel();
        var changeOperuuid = $("#changeOper" + this.uuid + "_el").val();
        asmodel.changeOper = changeOperuuid;
        var ruleOrgUnituuid = $("#ruleOrgUnit" + this.uuid + "_el").val();
        asmodel.ruleOrgUnit = ruleOrgUnituuid;
        var holidayPolicySetuuid = $("#holidayPolicySet" + this.uuid + "_el").val();
        var attencePolicyuuid = $("#attencePolicy" + this.uuid + "_el").val();
        var atsShiftuuid = $("#atsShift" + this.uuid + "_el").val();

        if (holidayPolicySetuuid) {
            asmodel.holidayPolicySet = holidayPolicySetuuid;
        }
        if (attencePolicyuuid) {
            asmodel.attencePolicy = attencePolicyuuid;
        }
        if (attencePolicyuuid) {
            asmodel.atsShift = atsShiftuuid;
        }

        var obj;
        obj = document.getElementsByName("isHand" + this.uuid);
        if (obj != null) {
            var i;
            for (i = 0; i < obj.length; i++) {
                if (obj[i].checked) {
                    asmodel.isHand = obj[i].value;
                }
            }
        }
        if ($("#isSub" + this.uuid).is(':checked')) {
            asmodel.isSub = 1;
        } else {
            asmodel.isSub = 0;
        }
        if (shr.getUrlRequestParam("tab") == '4') {
            if ($("#isForbiden" + this.uuid).is(':checked')) {
                asmodel.isForbiden = 1;
                asmodel.forbidenDay = $("#forbidenDay" + this.uuid).val();
            } else {
                asmodel.isForbiden = 0;
            }
        }

        var rule_item = [];
        var condition_item = [];
        //
        var condition_item_length = $("#form" + this.uuid).find("#serviceAge_" + this.uuid).find("div[name = 'condition_item']").length;
        for (var j = 0; j < condition_item_length; j++) {
            var config = _self.getFilterData($("#form" + this.uuid).find("#serviceAge_" + this.uuid).find("div[name = 'condition_item']").eq(j).attr('id'));

            var condition_item_one = {
                config: JSON.stringify(config)
            };
            condition_item.push(condition_item_one);
        }
        //
        var rule_item_json =
            {

                items: condition_item
            };


        if (shr.getUrlRequestParam("tab") != '4' && shr.getUrlRequestParam("tab") != '7' && shr.getUrlRequestParam("tab") != '8') {

            var valueSet_items = [];
            //
            var valueSet_item_length = $("#form" + this.uuid).find("#defaultValToSet_" + this.uuid).find("div[name = 'valueSet_item']").length;
            var nameArr = [];
            for (var j = 0; j < valueSet_item_length; j++) {
                var config = _self.getFilterDataNew($("#form" + this.uuid).find("#defaultValToSet_" + this.uuid).find("div[name = 'valueSet_item']").eq(j).attr('id'));
                if (config==undefined ||config==null ||config==''){
                    continue;
                }
                if (nameArr.indexOf(config.name)!=-1){
                    continue;
                }else {
                    nameArr.push(config.name)
                }
                var valueSet_item_one = {
                    config: JSON.stringify(config)
                };
                valueSet_items.push(valueSet_item_one);
            }
            rule_item_json.defaultValueItems = valueSet_items
        }
        rule_item.push(rule_item_json);

        asmodel.conditionItems = rule_item;

        delete asmodel.hrOrgUnit;

        //打卡考勤，自动排班
        if (shr.getUrlRequestParam("tab") != '4' && shr.getUrlParam("uipk") != "com.kingdee.eas.hr.ats.app.AtsPCRule.form" && shr.getUrlRequestParam("tab") != '7' && shr.getUrlRequestParam("tab") != '8') {
            if ($("#isAutoShift" + this.uuid).val() != undefined) {
                asmodel.isAutoShift = $("#isAutoShift" + this.uuid).shrSelect("getValue");
            }
            if ($("#isAttendance" + this.uuid) != undefined) {
                asmodel.isAttendance = $("#isAttendance" + this.uuid).shrSelect("getValue");
            }

        }
        if (shr.getUrlRequestParam("tab") == '5') {
            asmodel.isUsePartTimeJob = $("#isUsePartTimeJob" + this.uuid).shrSelect("getValue");
            asmodel.isUsePartTimeJobFirst = $("#isUsePartTimeJobFirst" + this.uuid).shrSelect("getValue");
        }
        if (shr.getUrlRequestParam("tab") == '7' || shr.getUrlRequestParam("tab") == '8') {
            asmodel.enrollChangeType = $("input[name='enrollChangeType" + this.uuid + "']:checked").val();
            if (shr.getUrlRequestParam("tab") == '7') {
                asmodel.changeOper = 'P/OSDCPfQXqU0TB/LQoA6uZovtk=marin';
            } else if (shr.getUrlRequestParam("tab") == '8') {
                asmodel.changeOper = 'V2vNOLaKRuGuv9/HNB5laOZovtk=marin';
            }
            else {
                asmodel.changeOper = changeOperuuid;
            }
        }
        data.model = shr.toJSON(asmodel);
        data.tab = shr.getUrlRequestParam("tab");
        var relatedFieldId = this.getRelatedFieldId();
        if (relatedFieldId) {
            data.relatedFieldId = relatedFieldId;
        }

        return data;
    }
    , getFilterDataNew: function (condition_item_id) {
        var filterInfo = {};
        var valueId = condition_item_id.replace(/valueSet_item/,"prop_value")
        if ($('#' + condition_item_id).find("input[id = 'prop_field']").val() == undefined
            || $('#' + condition_item_id).find("input[id = 'prop_field']").val() == null
            || $('#' + condition_item_id).find("input[id = 'prop_field']").val() == ""
        ) {
            return;
        }
        filterInfo.name = $('#' + condition_item_id).find("input[id = 'prop_field']").attr('prop_field');
        filterInfo.label = $('#' + condition_item_id).find("input[id = 'prop_field']").attr('title');
        filterInfo.compareType = $('#' + condition_item_id).find("input[name = 'prop_op_el']").val();
        filterInfo.compareTypeLabel = $('#' + condition_item_id).find("input[name = 'prop_op']").val();
        if ($('#' +valueId+"_el").val() == undefined
            || $('#' +valueId+"_el").val() == null
            || $('#' +valueId+"_el").val() == "") {
            filterInfo.value = $('#' +valueId).val();
        } else {
            filterInfo.value = $('#' +valueId+"_el").val();
        }
        filterInfo.uipk = $('#' + condition_item_id).find("input[name = 'prop_value']").attr('uipk');
        filterInfo.valueLabel = $('#' + condition_item_id).find("input[name = 'prop_value']").val();
        filterInfo.type = $('#' + condition_item_id).find("input[id = 'prop_field']").attr('field_type');
        filterInfo.enumSource = $('#' + condition_item_id).find("input[id = 'prop_field']").attr('enumSource');
        return filterInfo;
    }
    ,

    getFilterData: function (condition_item_id) {
        var filterInfo = {};

        if ($('#' + condition_item_id).find("input[id = 'prop_field']").val() == undefined
            || $('#' + condition_item_id).find("input[id = 'prop_field']").val() == null
            || $('#' + condition_item_id).find("input[id = 'prop_field']").val() == "") {
            return;
        }
        filterInfo.name = $('#' + condition_item_id).find("input[id = 'prop_field']").attr('prop_field');
        filterInfo.label = $('#' + condition_item_id).find("input[id = 'prop_field']").attr('title');
        filterInfo.compareType = $('#' + condition_item_id).find("input[name = 'prop_op_el']").val();
        filterInfo.compareTypeLabel = $('#' + condition_item_id).find("input[name = 'prop_op']").val();
        if ($('#' + condition_item_id).find("input[name = 'prop_value_el']").val() == undefined
            || $('#' + condition_item_id).find("input[name = 'prop_value_el']").val() == null
            || $('#' + condition_item_id).find("input[name = 'prop_value_el']").val() == "") {
            filterInfo.value = $('#' + condition_item_id).find("input[name = 'prop_value']").val();
        } else {
            filterInfo.value = $('#' + condition_item_id).find("input[name = 'prop_value_el']").val();
        }
        filterInfo.uipk = $('#' + condition_item_id).find("input[name = 'prop_value']").attr('uipk');
        filterInfo.valueLabel = $('#' + condition_item_id).find("input[name = 'prop_value']").val();
        filterInfo.type = $('#' + condition_item_id).find("input[id = 'prop_field']").attr('field_type');
        filterInfo.enumSource = $('#' + condition_item_id).find("input[id = 'prop_field']").attr('enumSource');
        return filterInfo;
    }
    , getChangeTypeLabel: function () {

        var changeTypeLabel = '';
        if (shr.getUrlRequestParam("tab") == '1') {
            changeTypeLabel = jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_23;
        } else if (shr.getUrlRequestParam("tab") == '2') {
            changeTypeLabel = jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_32;
        } else if (shr.getUrlRequestParam("tab") == '3') {
            changeTypeLabel = jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_11;
        } else if (shr.getUrlRequestParam("tab") == '4') {
            changeTypeLabel = '';
        } else {
            changeTypeLabel = jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_3;
        }
        return changeTypeLabel;
    }
    , enableAction: function () {
        var clz = this;
        var bills = $("#atsPCRuleSet_id").val();
        var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsPCRuleSetListHandler&method=enables";
        shr.showConfirm(jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_18, function () {
            shr.ajax({
                type: "post",
                async: true,
                url: url,
                data: {billId: bills},
                success: function (res) {
                    shr.showInfo({message: jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_6, hideAfter: 3});
                    window.location.reload();
                }, error: function (res) {
                    window.location.reload();
                }
            });
        });
    }
});

