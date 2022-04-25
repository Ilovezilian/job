var uuidNow;
//变动规则假期js
shr.defineClass("shr.ats.atsPCRuleSetForAttMulitEdit", shr.ats.atsPCRuleSetMulitEdit, {
    changeTypeLabel:'',
    atsFileTofilter : ["attendanceNum","fileType","EFFDT","LEFFDT","remark","manageRelation",
        "isDefaultManage","attendFileState","proposer","adminOrgUnit","position","hrOrgUnit","name",
        "number","description","simpleName","creator","createTime","lastUpdateUser","lastUpdateTime",
        "CU","id","isAutoShift","isAttendance"],
    serviceAge_num :0,
    ruleDetail_num :0,
    value_num : 0,
    initalizeDOM : function () {
        var _self = this;
        shr.ats.atsPCRuleSetForAttMulitEdit.superClass.initalizeDOM.call(this);

    }
    ,editMainAction: function() {
        var  options = {};
        options.method='edit';
        options.uipk= 'com.kingdee.eas.hr.ats.app.AtsPCRuleSet.form';
        options.billId=$('#form #id').val();
        this.reloadPage(options);

    }
    ,
    showIsUsePartTimeFirst:function () {
        var _self = this;
        var value=$("#isUsePartTimeJob"+ uuidNow).val();
        if (value==jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_19) {
            $("#isUsePartTimeJobFirst" + uuidNow).parent().parent().parent().parent().parent().show();
        }else {
            $("#isUsePartTimeJobFirst"+uuidNow).shrSelect("setValue",'0');
            $("#isUsePartTimeJobFirst" + uuidNow).parent().parent().parent().parent().parent().hide();
        }
    }
    ,initPCRuleMultDom:function(){
        var _self = this;
        _self.changeTypeLabel= _self.getChangeTypeLabel();
        $('.shr-multiRow .shr-multiRow-empty').css('padding-left','60px');
        $('#addNew').css('cssText','padding:2px 5px !important');
        $('#addNew').removeClass("btn-link");
        var uuid = _self.uuid;
        uuidNow=uuid;
        if(_self.getOperateState() == 'VIEW' && uuid !=''){
            //var uuid = $('.shr-multiRow').find("form").attr("id").substring(8);
            var billId=_self.billId;
            var ItemsJson = _self.getItemsJosn();
            var res=ItemsJson.result;
            var _ruleDetail_num =_self.uuid;
            var isSub;
            var receiveStr = ''
            if(res.atsPCRuleInfo.isSub){
                isSub=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_19;
            }else{
                isSub=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_8;
            }
            if(res.atsPCRuleInfo.ishand){
                if(shr.getUrlRequestParam("tab")=='1'){
                    receiveStr = jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_26
                }else {
                    receiveStr =  res.atsPCRuleInfo.ishand == 2 ? jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_4 : jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_25
                }
            }else{
                receiveStr = shr.formatMsg(jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_28, [_self.changeTypeLabel])
                    +res.atsPCRuleInfo.isAttendance+'、'
                    + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_29+ res.atsPCRuleInfo.isAutoShift+'，';

                if (shr.getUrlRequestParam("tab")==5) {
                    var position=res.atsPCRuleInfo.isUsePartTimeJobFirst==jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_3
                        ?jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_3
                        :jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_7;
                    receiveStr = receiveStr+jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081319_i18n_0+res.atsPCRuleInfo.isUsePartTimeJob
                        +'，';
                    if (res.atsPCRuleInfo.isUsePartTimeJob==jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_19){
                        receiveStr = receiveStr+jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_1
                            +position+jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_0
                            +'，';
                    }
                }
                receiveStr =receiveStr+ shr.formatMsg(jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_5, [res.atsPCRuleInfo["attencePolicy.name"], res.atsPCRuleInfo["atsShift.name"]]);
            }
            if(shr.getUrlRequestParam("tab")=='7' || shr.getUrlRequestParam("tab")=='8'){
                _self.changeTypeLabel="";
            }
            var html = ''
                + '<h5>'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_23
                + '</h5>'
                + '<div class="row-fluid row-block flex-r flex-rw" id="">'
                + '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
                + '<div class="label-ctrl flex-cc flex-r">'
                +'<div class="field-label" title="'+_self.changeTypeLabel
                +jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_20
                + '">'
                +_self.changeTypeLabel
                +jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_20
                + '</div><div class="field-desc"></div></div>'
                + '<div class="field-ctrl flex-c">'
                + '<span class="field_input">'+res.atsPCRuleInfo["ruleOrgUnit.name"]+'</span>'
                + '</div>'
                + '</div>'
                + '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
                + '<div class="label-ctrl flex-cc flex-r" >'
                +'<div class="field-label" title="'+ jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_1 + '">'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_1
                + '</div><div class="field-desc"></div></div>'
                + '<div class="field-ctrl flex-c">'
                + '<span class="field_input">'+isSub+'</span>'
                + '</div>'
                + '</div>'
                + '</div>'
                //
                + '</br>'
                + '<div class="row-fluid row-block " id="">'
                + '<div/>'
                + '<div  id="serviceAge_'+_ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
                + '<div class="span2"><span class="" style="color: #808080;">'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_13
                + '</span></div>'
                + '</div></div>'
                + '</div>';
//
            if(shr.getUrlRequestParam("tab")!='4' && shr.getUrlRequestParam("tab")!='7' && shr.getUrlRequestParam("tab")!='8'){
                html += ''
                    + '<h5>'
                    + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_2
                    + '</h5>'
                    + '<div class="row-fluid row-block " id="">'
                    + '<div data-ctrlrole="labelContainer">'
                    + '<div class="col-lg-1">'
                    + '<div class="field_label" title=""></div>'
                    + '</div>'
                    + '<div class="col-lg-6 field-ctrl">'
                    + '<span class="field_input" title='+res.atsPCRuleInfo["changeOper.name"]+'>'+res.atsPCRuleInfo["changeOper.name"]+'</span>'
                    + '</div>'
                    + '</div>'
                    + '</div>'

                    + '<h5>'
                    + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_9
                    + '</h5>'
                    + '<div class="row-fluid row-block " id="">'
                    + '<div data-ctrlrole="labelContainer">'
                    + '<div class="col-lg-1">'
                    + '<div class="field_label" title=""></div>'
                    + '</div>'
                    + '<div class="col-lg-10 field-ctrl">'
                    + "<span class='field_input' title='"+receiveStr+"'>"+receiveStr+"</span>"
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '';
            }else{
                if(shr.getUrlRequestParam("tab")!='7' && shr.getUrlRequestParam("tab")!='8'){
                    if(res.atsPCRuleInfo.isForbiden){
                        html += ''
                            + '<div class="row-fluid row-block " id="">'
                            + '<div data-ctrlrole="labelContainer">'
                            + '<div class="col-lg-1 field-desc"></div>'
                            + '<div class="col-lg-6 field-ctrl">'
                            + '<span class="field_input" title="'+shr.formatMsg(jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_12, [res.atsPCRuleInfo.forbidenDay])+'">'
                            + shr.formatMsg(jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_12, [res.atsPCRuleInfo.forbidenDay])
                            + '</span>'
                            + '</div>'
                            + '</div>'
                    }
                }
            }
            if(shr.getUrlRequestParam("tab")=='7' || shr.getUrlRequestParam("tab")=='8'){
                if(res.atsPCRuleInfo.enrollChangeType=='1' && shr.getUrlRequestParam("tab")=='7'){
                    receiveStr=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_40;
                }else if(res.atsPCRuleInfo.enrollChangeType=='0' && shr.getUrlRequestParam("tab")=='7'){
                    receiveStr=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_41;
                }else if(res.atsPCRuleInfo.enrollChangeType=='2' && shr.getUrlRequestParam("tab")=='7'){
                    receiveStr=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_42;
                }else if(res.atsPCRuleInfo.enrollChangeType=='3' && shr.getUrlRequestParam("tab")=='7'){
                    receiveStr=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_43;
                }
                if(res.atsPCRuleInfo.enrollChangeType=='1' && shr.getUrlRequestParam("tab")=='8'){
                    receiveStr=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_44;
                }else if(res.atsPCRuleInfo.enrollChangeType=='0' && shr.getUrlRequestParam("tab")=='8'){
                    receiveStr=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_45;
                }else if(res.atsPCRuleInfo.enrollChangeType=='2' && shr.getUrlRequestParam("tab")=='8'){
                    receiveStr=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_46;
                }else if(res.atsPCRuleInfo.enrollChangeType=='3' && shr.getUrlRequestParam("tab")=='8'){
                    receiveStr=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_47;
                }
                html += ''
                    + '<h5>'
                    + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_9
                    + '</h5>'
                    + '<div class="row-fluid row-block " id="">'
                    + '<div data-ctrlrole="labelContainer">'
                    + '<div class="col-lg-1">'
                    + '<div class="field_label" title=""></div>'
                    + '</div>'
                    + '<div class="col-lg-10 field-ctrl">'
                    + "<span class='field_input' title='"+receiveStr+"'>"+receiveStr+"</span>"
                    + '</div>'
                    + '</div>'
                    + '</div>'
                    + '';
            }
            html+= '</br>'
                + '<div class="row-fluid row-block " id="">'
                + '<div  id="defaultValToSet_'+_ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
                + '<div class="span2"><span class="">'
                + '<h5>'
                +jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_2
                +'</h5>'
                + '</span></div>'
                + '</div></div>'
                + '</div>'
            $('#'+uuid).find("form").append(html);
            for(var i = 0;i<ItemsJson.rows.length;i++){
                _self.showItemHtml(ItemsJson.rows[i],_ruleDetail_num);
            }
        }
        if(_self.getOperateState() == 'EDIT' && uuid !=''){
            var billId=_self.billId;
            var uuid=this.uuid;
            uuidNow = uuid;
            var uuidNum=uuid.substring(4);
            // 片断
            var ruleDetail_num = this.uuid;
            var ItemsJson = _self.getItemsJosn();
            var res=ItemsJson.result;
            var isSub;
            if(res.atsPCRuleInfo.isSub=='1'){
                isSub=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_19;
            }else{
                isSub=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_8;
            }
            var html = _self.getAddNewEntryHtml(uuidNum,ruleDetail_num);
            $('#'+uuid).find("form").append(html);

            $("input[name='isHand"+uuid+"'][value=0]").change(function() {
                $("#attencePolicy"+uuid).attr("validate","{required:true}");
                $("#attencePolicy"+uuid).parent().parent().parent().addClass("required");
                $("#atsShift"+uuid).attr("validate","{required:true}");
                $("#atsShift"+uuid).parent().parent().parent().addClass("required");
            });
            [1,2].forEach(function(item){
                $("input[name='isHand"+uuid+"'][value=" + item + "]").change(function() {
                    $("#attencePolicy"+uuid).attr("validate","");
                    $("#attencePolicy"+uuid).parent().parent().parent().removeClass("required");
                    $("#atsShift"+uuid).attr("validate","");
                    $("#atsShift"+uuid).parent().parent().parent().removeClass("required");
                });
            });

            var grid_f7_json = null;
            grid_f7_json = {id:"changeOper"+uuid,name:"changeOper"};
            grid_f7_json.value = {id:res.atsPCRuleInfo["changeOper"],name:res.atsPCRuleInfo["changeOper.name"]};
            grid_f7_json.subWidgetName = 'shrPromptGrid';
            grid_f7_json.validate = '{required:true}';
            grid_f7_json.subWidgetOptions = {title:"",uipk:"com.kingdee.eas.hr.base.app.HRBizDefine.AtsPCRule.F7",query:"",filter:""+shr.getUrlRequestParam("tab"),domain:"",multiselect:true};
            //grid_f7_json.readonly = '';
            $("input[name='changeOper']").shrPromptBox(grid_f7_json);
//				$("#changeOper"+uuid+"_el").attr("value",res.changeOper);
//				$("#changeOper"+uuid).attr("value",res.changeOper);
//				$("#changeOper"+uuid).attr("title",res.changeOper);
            //行政组织

            grid_f7_json= null;
            grid_f7_json = {id:"ruleOrgUnit"+uuid,name:"ruleOrgUnit"};
            grid_f7_json.value = {id:res.atsPCRuleInfo["ruleOrgUnit"],name:res.atsPCRuleInfo["ruleOrgUnit.name"]};
            grid_f7_json.subWidgetName = 'shrPromptGrid';
            grid_f7_json.subWidgetOptions = {
                title:jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_22,
                uipk:"com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",
                query:"",
                filter:"",
                domain:"",
                multiselect:true
            };
            grid_f7_json.validate = '{required:true}';
            grid_f7_json.subWidgetOptions.isHRBaseItem = true;
            grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";
            grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $("#hrOrgUnit_id").val();
            grid_f7_json.subWidgetOptions.filterConfig = [{name: '',value: true,alias: '',widgetType: 'no'}];
//				grid_f7_json.subWidgetName = 'specialPromptGrid';
            $("input[name='ruleOrgUnit']").shrPromptBox(grid_f7_json);
            $("input[name='ruleOrgUnit']").shrPromptBox("setBizFilterFieldsValues",$("#hrOrgUnit_id").val());

            //考勤制度
            grid_f7_json = null;
            //grid_f7_json = {id:"ruleOrgUnituuid"+uuidNum,name:"ruleOrgUnit"};
            grid_f7_json = {id:"attencePolicy"+uuid,name:"attencePolicy"};
            grid_f7_json.subWidgetName = 'shrPromptGrid';
            grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_10,
                uipk:"com.kingdee.eas.hr.ats.app.AttencePolicy.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false, treeFilterConfig: '',permItemId:""};
            grid_f7_json.readonly = '';
            grid_f7_json.validate = '';
            grid_f7_json.value = {id:res.atsPCRuleInfo["attencePolicy.id"],name:res.atsPCRuleInfo["attencePolicy.name"]};
            grid_f7_json.subWidgetOptions.isHRBaseItem = true;
            grid_f7_json.subWidgetOptions.filterConfig = [{name:'isComUse',value:true,
                alias:jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_21,
                widgetType:'checkbox'}];
            grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit_id";
            grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
            grid_f7_json.subWidgetName = 'specialPromptGrid';
            $("input[name='attencePolicy']").shrPromptBox(grid_f7_json);
            $("input[name='attencePolicy']").shrPromptBox("setBizFilterFieldsValues",$("#hrOrgUnit_id").val());

            //默认班次
            grid_f7_json = null;
            //grid_f7_json = {id:"ruleOrgUnituuid"+uuidNum,name:"ruleOrgUnit"};
            grid_f7_json = {id:"atsShift"+uuid,name:"atsShift"};
            grid_f7_json.subWidgetName = 'shrPromptGrid';
            grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_0,
                uipk:"com.kingdee.eas.hr.ats.app.AtsShift.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false, treeFilterConfig: '',permItemId:""};
            grid_f7_json.readonly = '';
            grid_f7_json.validate = '';
            grid_f7_json.value = {id:res.atsPCRuleInfo["atsShift.id"],name:res.atsPCRuleInfo["atsShift.name"]};
            grid_f7_json.subWidgetOptions.isHRBaseItem = true;
            grid_f7_json.subWidgetOptions.filterConfig = [{name:'isComUse',value:true,
                alias:jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_21,
                widgetType:'checkbox'}];
            grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit_id";
            grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
            grid_f7_json.subWidgetName = 'specialPromptGrid';
            $("input[name='atsShift']").shrPromptBox(grid_f7_json);
            $("input[name='atsShift']").shrPromptBox("setBizFilterFieldsValues",$("#hrOrgUnit_id").val());
            if(res.atsPCRuleInfo.isSub){
                document.getElementById("isSub"+this.uuid).checked=true;
            }
            if(res.atsPCRuleInfo.ishand){
                $("input[name='isHand"+this.uuid+"'][value=" + res.atsPCRuleInfo.ishand + "]").attr("checked",true);
            }else{
                $("input[name='isHand"+this.uuid+"'][value=0]").attr("checked",true);
                $("#attencePolicy"+uuid).attr("validate","{required:true}");
                $("#attencePolicy"+uuid).parent().parent().parent().addClass("required");
                $("#atsShift"+uuid).attr("validate","{required:true}");
                $("#atsShift"+uuid).parent().parent().parent().addClass("required");
            }
            if(shr.getUrlRequestParam("tab")=='4'){
                if(res.atsPCRuleInfo.isForbiden){
                    $("#isForbiden"+this.uuid).attr("checked",true);
                    $("#forbidenDay"+uuid).val(res.atsPCRuleInfo.forbidenDay);
                }else{
                    $("#isForbiden"+this.uuid).attr("checked",false);
                    $("#forbidenDay"+uuid).val(0);
                }
            }
            if(res.atsPCRuleInfo.enrollChangeType){
                var len=res.atsPCRuleInfo.enrollChangeType;
                $("input[name='enrollChangeType"+this.uuid+"'][value="+len+"]").attr("checked",true);
            }
            $('#serviceAge_'+ruleDetail_num+' #serviceAge_add').unbind('click').bind('click',function(){
                _self.serviceAge_num = _self.serviceAge_num + 1;
                _self.addConditionHtml(ruleDetail_num,_self.serviceAge_num);
            });
            $('#defaultValToSet_'+ruleDetail_num+' #defaultValToSet_add').unbind('click').bind('click',function(){
                _self.value_num =_self.value_num+1
                _self.addSetValueForAtsFileHtml(ruleDetail_num,_self.value_num);
            });
            for(var i = 0;i<ItemsJson.rows.length;i++){
                _self.setItemHtml(ItemsJson.rows[i],ruleDetail_num);
            }

            //是否打卡考勤，是否自动排班
            var select_json = {
                id: "isAttendance"+uuid,
                readonly: "",
                value: res.atsPCRuleInfo.isAttendance==jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_19?"1":"0",
                onChange: null,
                validate: "",
                filter: ""
            };

            select_json.enumSource = 'com.kingdee.eas.hr.ats.IsAttendanceEnum';
            $("#isAttendance"+uuid).shrSelect(select_json);

            select_json = {
                id: "isAutoShift"+uuid,
                readonly: "",
                value: res.atsPCRuleInfo.isAutoShift==jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_19?"1":"0",
                onChange: null,
                validate: "",
                filter: ""
            };

            select_json.enumSource = 'com.kingdee.eas.hr.ats.IsAutoShiftEnum';
            $("#isAutoShift"+uuid).shrSelect(select_json);

            select_json = {
                id: "isUsePartTimeJobFirst"+uuid,
                readonly: "",
                value: res.atsPCRuleInfo.isUsePartTimeJobFirst==jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_3?"1":"0",
                onChange: null,
                validate: "",
                filter: ""
            };

            select_json.enumSource = 'com.kingdee.eas.hr.ats.IsUsePartTimeJobFirstEnum';
            $("#isUsePartTimeJobFirst"+uuid).shrSelect(select_json);

            select_json = {
                id: "isUsePartTimeJob"+uuid,
                readonly: "",
                value: res.atsPCRuleInfo.isUsePartTimeJob==jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_19?"1":"0",
                onChange: _self.showIsUsePartTimeFirst,
                validate: "",
                filter: ""
            };

            select_json.enumSource = 'com.kingdee.eas.hr.ats.IsUsePartTimeJobEnum';
            $("#isUsePartTimeJob"+uuid).shrSelect(select_json);

        }
        _self.showIsUsePartTimeFirst()

    }

    ,addNewAction: function() {
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
        var value_num = 0;

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
                    uuidNow=uuid;
                    //ruleDetail_num = $('.shr-multiRow').find("form").attr("id");
                    ruleDetail_num = $('.shr-multiRow').find("form").attr("id").substring(4);
                    var html = _self.getAddNewEntryHtml(uuid, ruleDetail_num);
                    $('.shr-multiRow').find("form").append(html);
                } else {
                    var $workarea = _self.getWorkarea();
                    $workarea.after(response);
                    next = $workarea.nextAll('.view_mainPage');
                    var uuid = next.attr("id").substring(4);
                    uuidNow=uuid;
                    //ruleDetail_num = $workarea.next().attr("id");
                    ruleDetail_num = next.attr("id");
                    var html = _self.getAddNewEntryHtml(uuid, ruleDetail_num);

                    next.find("form").append(html);
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

                $("input[name='isHanduuid" + uuid + "'][value=0]").change(function () {
                    $("#attencePolicyuuid" + uuid).attr("validate", "{required:true}");
                    $("#attencePolicyuuid" + uuid).parent().parent().parent().addClass("required");
                    $("#atsShiftuuid" + uuid).attr("validate", "{required:true}");
                    $("#atsShiftuuid" + uuid).parent().parent().parent().addClass("required");
                });
                [1, 2].forEach(function (item) {
                    $("input[name='isHanduuid" + uuid + "'][value=" + item + "]").change(function () {
                        $("#attencePolicyuuid" + uuid).attr("validate", "");
                        $("#attencePolicyuuid" + uuid).parent().parent().parent().removeClass("required");
                        $("#atsShiftuuid" + uuid).attr("validate", "");
                        $("#atsShiftuuid" + uuid).parent().parent().parent().removeClass("required");
                    });
                });

                $("#forbidenDayuuid" + uuid).val(0);
                $("input[name='isHanduuid" + uuid + "'][value=0]").attr("checked", true);
                if (shr.getUrlRequestParam("tab") == '7' || shr.getUrlRequestParam("tab") == '8') {
                    $("input[name='enrollChangeTypeuuid" + uuid + "'][value=1]").attr("checked", true);
                }
                //变动操作
                var grid_f7_json = null;
                //grid_f7_json = {id:"changeOper",name:"changeOper"};
                grid_f7_json = {id: "changeOperuuid" + uuid, name: "changeOper"};
                grid_f7_json.subWidgetName = 'shrPromptGrid';
                grid_f7_json.validate = '{required:true}';
                grid_f7_json.subWidgetOptions = {
                    title: "",
                    uipk: "com.kingdee.eas.hr.base.app.HRBizDefine.AtsPCRule.F7",
                    query: "",
                    filter: "" + shr.getUrlRequestParam("tab"),
                    domain: "",
                    multiselect: true
                };
                grid_f7_json.readonly = '';
                $("input[name='changeOper']").shrPromptBox(grid_f7_json);
                //行政组织
                grid_f7_json = null;
                grid_f7_json = {id: "ruleOrgUnituuid" + uuid, name: "ruleOrgUnit"};
                grid_f7_json.subWidgetName = 'shrPromptGrid';
                grid_f7_json.subWidgetOptions = {
                    title: jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_22,
                    uipk: "com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",
                    query: "",
                    filter: "",
                    domain: "",
                    multiselect: true
                };
                grid_f7_json.validate = '{required:true}';
                grid_f7_json.subWidgetOptions.isHRBaseItem = true;
                grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";
                grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $("#hrOrgUnit_id").val();
                grid_f7_json.subWidgetOptions.filterConfig = [{name: '', value: true, alias: '', widgetType: 'no'}];
                //		grid_f7_json.subWidgetName = 'specialPromptGrid';
                $("input[name='ruleOrgUnit']").shrPromptBox(grid_f7_json);
                $("input[name='ruleOrgUnit']").shrPromptBox("setBizFilterFieldsValues", $("#hrOrgUnit_id").val());

                //		grid_f7_json = null;
                //		//grid_f7_json = {id:"ruleOrgUnituuid"+uuidNum,name:"ruleOrgUnit"};
                //		grid_f7_json = {id:"ruleOrgUnituuid"+uuid,name:"ruleOrgUnit"};
                //		grid_f7_json.subWidgetName = 'shrPromptGrid';
                //		grid_f7_json.validate = '{required:true}';
                //		grid_f7_json.subWidgetOptions = {title:"",uipk:"com.kingdee.eas.basedata.org.app.UserHROrgUnit.F7",query:"",filter:"",domain:"",multiselect:true};
                //		grid_f7_json.readonly = '';
                //		$("input[name='ruleOrgUnit']").shrPromptBox(grid_f7_json);
                //考勤制度
                grid_f7_json = null;
                //grid_f7_json = {id:"ruleOrgUnituuid"+uuidNum,name:"ruleOrgUnit"};
                grid_f7_json = {id: "attencePolicyuuid" + uuid, name: "attencePolicy"};
                grid_f7_json.subWidgetName = 'shrPromptGrid';
                grid_f7_json.subWidgetOptions = {
                    title: jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_10,
                    uipk: "com.kingdee.eas.hr.ats.app.AttencePolicy.AvailableList.F7",
                    query: "",
                    filter: "",
                    domain: "",
                    multiselect: false,
                    treeFilterConfig: '',
                    permItemId: ""
                };
                grid_f7_json.readonly = '';
                grid_f7_json.validate = '';

                grid_f7_json.subWidgetOptions.isHRBaseItem = true;
                grid_f7_json.subWidgetOptions.filterConfig = [{
                    name: 'isComUse', value: true,
                    alias: jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_21,
                    widgetType: 'checkbox'
                }];
                grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit_id";
                grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
                grid_f7_json.subWidgetName = 'specialPromptGrid';
                $("input[name='attencePolicy']").shrPromptBox(grid_f7_json);
                $("input[name='attencePolicy']").shrPromptBox("setBizFilterFieldsValues", $("#hrOrgUnit_id").val());

                //默认班次
                grid_f7_json = null;
                //grid_f7_json = {id:"ruleOrgUnituuid"+uuidNum,name:"ruleOrgUnit"};
                grid_f7_json = {id: "atsShiftuuid" + uuid, name: "atsShift"};
                grid_f7_json.subWidgetName = 'shrPromptGrid';
                grid_f7_json.subWidgetOptions = {
                    title: jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_0,
                    uipk: "com.kingdee.eas.hr.ats.app.AtsShift.AvailableList.F7",
                    query: "",
                    filter: "",
                    domain: "",
                    multiselect: false,
                    treeFilterConfig: '',
                    permItemId: ""
                };
                grid_f7_json.readonly = '';
                grid_f7_json.validate = '';

                grid_f7_json.subWidgetOptions.isHRBaseItem = true;
                grid_f7_json.subWidgetOptions.filterConfig = [{
                    name: 'isComUse', value: true,
                    alias: jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_21,
                    widgetType: 'checkbox'
                }];
                grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit_id";
                grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
                grid_f7_json.subWidgetName = 'specialPromptGrid';
                $("input[name='atsShift']").shrPromptBox(grid_f7_json);
                $("input[name='atsShift']").shrPromptBox("setBizFilterFieldsValues", $("#hrOrgUnit_id").val());

                $("#attencePolicyuuid" + uuid).attr("validate", "{required:true}");
                $("#attencePolicyuuid" + uuid).parent().parent().parent().addClass("required");
                $("#atsShiftuuid" + uuid).attr("validate", "{required:true}");
                $("#atsShiftuuid" + uuid).parent().parent().parent().addClass("required");


                $('#serviceAge_' + ruleDetail_num + ' #serviceAge_add').unbind('click').bind('click', function () {
                    _self.serviceAge_num = _self.serviceAge_num + 1;
                    self.addConditionHtml(ruleDetail_num, _self.serviceAge_num);
                });
                $('#defaultValToSet_'+ruleDetail_num+' #defaultValToSet_add').unbind('click').bind('click',function(){
                    _self.value_num = _self.value_num+1;
                    _self.addSetValueForAtsFileHtml(ruleDetail_num,_self.serviceAge_num);
                });
                //是否打卡考勤，是否自动排班
                var select_json = {
                    id: "isAttendanceuuid" + uuid,
                    readonly: "",
                    value: "1",
                    onChange: null,
                    validate: "",
                    filter: ""
                };

                select_json.enumSource = 'com.kingdee.eas.hr.ats.IsAttendanceEnum';
                $("#isAttendanceuuid" + uuid).shrSelect(select_json);

                select_json = {
                    id: "isAutoShiftuuid" + uuid,
                    readonly: "",
                    value: "1",
                    onChange: null,
                    validate: "",
                    filter: ""
                };

                select_json.enumSource = 'com.kingdee.eas.hr.ats.IsAutoShiftEnum';
                $("#isAutoShiftuuid" + uuid).shrSelect(select_json);
                select_json = {
                    id: "isUsePartTimeJobFirstuuid"+uuid,
                    readonly: "",
                    value: "0",
                    onChange: null,
                    validate: "",
                    filter: ""
                };

                select_json.enumSource = 'com.kingdee.eas.hr.ats.IsUsePartTimeJobFirstEnum';
                $("#isUsePartTimeJobFirstuuid"+uuid).shrSelect(select_json);

                select_json = {
                    id: "isUsePartTimeJobuuid"+uuid,
                    readonly: "",
                    value: "0",
                    onChange: _self.showIsUsePartTimeFirst,
                    validate: "",
                    filter: ""
                };

                select_json.enumSource = 'com.kingdee.eas.hr.ats.IsUsePartTimeJobEnum';
                $("#isUsePartTimeJobuuid"+uuid).shrSelect(select_json);
            }
        });

    }
    ,addSetValueForAtsFileHtml:function(ruleDetail_num,condition_num){

        var that = this;
        var pre_prop_value_set = "prop_value_"+ruleDetail_num+'_'+condition_num;
        var con_tpl =
            '<div id ="valueSet_item_'+ruleDetail_num+'_'+condition_num+'" name = "valueSet_item" class="row-fluid row-block row_field" style="width: 115%">'
            + '<div class="span1"><input type="hidden" name="valueSetId"  /><span class="cell-RlStdType"></span></div>'
            + '<div class="span2 field-ctrl">'
            + '<input name_value = "prop_field_html"/>'
            + '</div>'
            + '<div class="span2"><input id="prop_op" type="text" name="prop_op" class="input-height cell-input" style="width:140px"/></div>'
            + '<div class="span2 field-ctrl"><input id='+pre_prop_value_set+' type="text" name="prop_value" class="input-height cursor-pointer" style="width:126px"></div>'
            +'<span class="span1 field_add" style="display: table-cell;width:126px"><i class="icon-remove" style="padding:10px"></i></span>'
            + '</div>';

        $("#defaultValToSet_"+ruleDetail_num).append(con_tpl);

        var _treeNode = [];
        that.remoteCall({
            type:"post",
            async: false,
            method:"getFieldsToSetAts",
            param:{handler:"com.kingdee.shr.ats.web.handler.HolidayRuleEditHandler","entityName":"com.kingdee.eas.hr.ats.app.AttendanceFile"},
            success:function(response){
                _treeNode = response;
                var tempArr = []
                for (var temp in _treeNode){
                    if (that.atsFileTofilter.indexOf(_treeNode[temp].field)==-1) {
                        tempArr.push(_treeNode[temp])
                    }
                }
                for (var temp in tempArr){
                    if ("calendar" == tempArr[temp].field) {
                        tempArr[temp].uipk = 'com.kingdee.eas.hr.ats.app.WorkCalendar.AvailableList.F7';
                        tempArr[temp].f7FieldName = 'com.kingdee.eas.hr.ats.app.WorkCalendar.AvailableList.F7';
                    }
                }
                _treeNode=tempArr;
            }
        });
        var tree_f7_json = {id:"prop_field",name:"prop_field"};
        tree_f7_json.subWidgetName = 'shrPromptTree';
        tree_f7_json.subWidgetOptions =
            {
                treeSettings:{},
                width:250,
                zNodes : _treeNode
            };
        $("#valueSet_item_"+ruleDetail_num+"_"+condition_num+" input[name_value='prop_field_html']").shrPromptBox(tree_f7_json);
        that._addItemEventListenerNew(ruleDetail_num,condition_num);

        //删除
        $('#valueSet_item_'+ruleDetail_num+'_'+condition_num+' i[class="icon-remove"]').unbind('click').bind('click',function(){
            $(this).closest("div.row_field").remove();
        });



    }
    ,_addItemEventListenerNew:function(ruleDetail_num,condition_num){
        var pre_prop_value = "prop_value_"+ruleDetail_num+"_"+condition_num;
        var prop_op_json = {id:"prop_op"};
        prop_op_json.data = [
            {value:"=",alias:jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_9}
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
                        prop_value_ctrl.shrDateTimePicker($.extend(picker_json,{ctrlType: "TimeStamp",isAutoTimeZoneTrans:false,isNewDateCtrl: true}));
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
                        select_json.data = [{value:"1",alias:jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_25},
                            {value:"0",alias:jsBizMultLan.atsManager_atsPCRuleSetMulitEdit_i18n_13}
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
                            alias: jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_21,
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
                    }
                    $(".select_field >div").addClass("search-emp-field");
                }
            }});
    }
    ,getAddNewEntryHtml : function(uuid,ruleDetail_num){

        var _self = this;
        var receiveStr = '';
        if(shr.getUrlRequestParam("tab")=='1'){
            receiveStr = jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_6;
        }else{
            receiveStr = jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_3;
        }
        var html =''
            + '<h5>'
            + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_23
            + '</h5>'
            + '<div class="row-fluid row-block flex-r flex-rw">'
            + '<div class="field-area flex-c field-basis1">'
            + '<div class="label-ctrl flex-cc flex-r" >'
            +'<div class="field-label" title="'+_self.changeTypeLabel
            +jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_20+ '">'
            +_self.changeTypeLabel+jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_20
            + '</div><div class="field-desc"></div></div>'
            + '<div class="field-ctrl flex-c"><input id="ruleOrgUnituuid'+uuid+'" name="ruleOrgUnit" class="block-father input-height" validate="{required:true}" type="text" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
            + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_17
            + '"></div></div>'
            + '<div class="field-area flex-c field-basis1"><div class="label-ctrl flex-cc flex-r">'
            +'<div class="field-label" title="'+ jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_1+'">'
            + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_1
            + '</div><div class="field-desc"></div></div>'
            + '<div class="field-ctrl flex-c">'
            + '<div  style="position: relative;"><input type="checkbox" id="isSubuuid'+uuid+'" name="isSub" value="1" dataextenal="" ></div> '
            + '</div></div>'
            + '</div>'

            + '<div class="row-fluid row-block">'
            + '<div  id="serviceAge_'+ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
            + '<div class="col-lg-4"><div style=" text-align: left;" class="field_label" title="'
            + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_13
            + '">'
            + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_13
            + '</div></div>'
            + '<div class="span2"><i id="serviceAge_add" class="icon-plus" style="padding:2px" ></i></div>'
            + '</div></div>'
            + '</div></div>';



        if(shr.getUrlRequestParam("tab")!='4'){
            html += ''
                + '<h5>'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_2
                + '</h5>'
                + '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1">'
                + '<div class="field-ctrl flex-c"><input id="changeOperuuid'+uuid+'" name="changeOper" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_14
                + '"></div>'
                + '</div>'
                + '<h5>'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_9
                + '</h5>'
                + '<div class="row-fluid row-block">'
                + '<div class="flex-r" style="margin:10px;">'
                + '<input style="width:2%" id="isHanduuid'+uuid+'" value="0" name="isHanduuid'+uuid+'" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                + '<div style="" class="field_label" title="">'
                + shr.formatMsg(jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_27, [_self.changeTypeLabel])
                + '</div>'
                + '</div></div>'
                + '<div class="row-fluid row-block flex-r flex-rw">'
                + '<div class="field-area flex-c field-basis1">'
                + '<div class="label-ctrl flex-cc flex-r"><div class="field-label" title="'+jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_18+'">'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_18
                + '</div><div class="field-desc"></div></div>'
                + '<div class="field-ctrl flex-c"><input class="block-father input-height" id="isAttendanceuuid'+uuid+'" name="isAttendance" validate="" autocomplete="off" placeholder="" type="text"  dataExtenal=""></div>'
                + '</div>'

                + '<div class="field-area flex-c field-basis1"><div class="label-ctrl flex-cc flex-r" >'
                + '<div class="field-label" title="'+jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_29+'">'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_29
                + '</div><div class="field-desc"></div></div>'
                + '<div class="field-ctrl flex-c"><input class="block-father input-height" id="isAutoShiftuuid'+uuid+'" name="isAutoShift" validate="" autocomplete="off" placeholder="" type="text"  dataExtenal=""></div>'
                + '</div>'
            if(shr.getUrlRequestParam("tab")==5){
                html=html+ '<div class="field-area flex-c field-basis1"><div class="label-ctrl flex-cc flex-r" >'
                    + '<div class="field-label" title="'
                    +jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_5
                    +'">'
                    + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_5
                    + '</div><div class="field-desc"></div></div>'

                    + '<div class="field-ctrl flex-c"><input class="block-father input-height" id="isUsePartTimeJobuuid'+uuid+'" name="isUsePartTimeJob" validate="" autocomplete="off" placeholder="" type="text"  dataExtenal=""></div>'
                    + '</div>'	 	 ;
                html=html+ '<div class="field-area flex-c field-basis1" style="display: none;"><div class="label-ctrl flex-cc flex-r" >'
                    + '<div class="field-label" title="'
                    +jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_8
                    +'">'
                    + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_8
                    + '</div><div class="field-desc"></div></div>'
                    + '<div class="field-ctrl flex-c"><input class="block-father input-height" id="isUsePartTimeJobFirstuuid'+uuid+'" name="isUsePartTimeJobFirst" validate="" autocomplete="off" placeholder="" type="text"  dataExtenal=""></div>'
                    + '</div>'	 	 ;
            }


            html=html + '</div></div>'
                + '<div class="row-fluid row-block">'
                + '<div class="col-lg-1"><div style=" text-align: left;" class="field_label" title="'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_4
                + '">'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_4
                + '</div></div>'
                + '<div class="col-lg-2 field-ctrl"><input id="attencePolicyuuid'+uuid+'" name="attencePolicy" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_15
                + '"></div>'
                + '<div class="col-lg-1"><div style="text-align: center;padding-right: 0;" class="field_label" title="">、</div></div>'
                + '<div class="col-lg-2 field-ctrl"><input id="atsShiftuuid'+uuid+'" name="atsShift" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
                +jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_16
                + '"></div>'
                + '<div class="col-lg-3"><div class="field_label" title="'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_7
                + '">'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_7
                + '</div></div>'
                + '</div>';
            if (shr.getUrlRequestParam("tab")!="4" && shr.getUrlRequestParam("tab")!="7" && shr.getUrlRequestParam("tab")!="8"){
                html+= '<div class="row-fluid row-block">'
                    + '<div  id="defaultValToSet_'+ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
                    + '<div class="col-lg-2"><div style=" text-align: left;" class="field_label" title="'
                    + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_2
                    + '">'
                    + '<h5>'
                    +jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_2
                    +'</h5>'
                    + '</div></div>'
                    + '<div class="span2"><i id="defaultValToSet_add" class="icon-plus" style="padding:2px" ></i></div>'
                    + '</div></div>'
                    + '</div>'
            }
            if(shr.getUrlRequestParam("tab")=='3'){
                html += '<div class="row-fluid row-block">'
                    + '<div class="">'
                    + '<div class="flex-r" style="margin:10px;"/>'
                    + '<input style="width:2%" id="isHanduuid'+uuid+'" name="isHanduuid'+uuid+'" value="2" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                    + '<div class="field_label" title="">'
                    + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_27081311_i18n_4
                    + '</div>'
                    + '</div></div>';
            }
            html += '<div class="row-fluid row-block">'
                + '<div class="">'
                + '<div class="flex-r" style="margin:10px;"/>'
                + '<input style="width:2%" id="isHanduuid'+uuid+'" name="isHanduuid'+uuid+'" value="1" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                + '<div  class="field_label" title="">'
                + shr.formatMsg(jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_24, [receiveStr])
                + '</div>'
                + '</div></div>';
        }else{
            html += ''
                + '<div class="row-fluid row-block">'
                + '<div class="col-lg-3 field-ctrl">'
                + '<div  style="position: relative;"><input type="checkbox" id="isForbidenuuid'+uuid+'" style="float:left;" name="isForbiden" value="1" dataextenal="" ><div class="field_label" style="float:left;margin-left:10px;" title="'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_11
                + '">'
                + shr.formatMsg(jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_12, [
                    '</div></div> '
                    + '</div>'
                    + '<div class="col-lg-2 field-ctrl">'
                    + '<div class="ui-text-frame"><input id="forbidenDayuuid'+uuid+'" class="block-father input-height" type="text" name="forbidenDay" validate="{maxlength:30}" value="teat1" placeholder="" dataextenal="" ctrlrole="text" maxlength="30"></div>'
                    + '</div>'
                    + '<div class="col-lg-6"><div class="field_label"  style="text-align: left;padding-left: 10px;" title="">'
                ])
                + '</div></div>'
                + '</div>';
        }
        if(shr.getUrlRequestParam("tab")=='7' || shr.getUrlRequestParam("tab")=='8'){
            var receiveStr0="";
            var receiveStr1="";
            var receiveStr2="";
            var receiveStr3="";
            if(shr.getUrlRequestParam("tab")=='7'){
                receiveStr0=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_40;

                receiveStr1=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_41;

                receiveStr2=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_42;

                receiveStr3=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_43;
            }
            if(shr.getUrlRequestParam("tab")=='8'){
                receiveStr0=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_44;

                receiveStr1=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_45;

                receiveStr2=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_46;

                receiveStr3=jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_47;
            }
            var html =''
                + '<h5>'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_23
                + '</h5>'
                + '<div class="row-fluid row-block">'
                + '<div class="row-fluid row-block"><div class="col-lg-1"></div><div class="col-lg-2"><div style=" text-align: left;" class="field_label" title="'
                +jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_20
                + '">'+jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_20+'</div></div>'
                + '<div class="col-lg-6 field-ctrl"><input id="ruleOrgUnituuid'+uuid+'" name="ruleOrgUnit" class="block-father input-height" validate="{required:true}" type="text" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_17
                + '"></div></div>'
                + '<div class="row-fluid row-block"><div class="col-lg-1"></div><div class="col-lg-2"><div class="field_label" title="'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_1
                + '">'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_1
                + '</div></div>'
                + '<div class="col-lg-6 field-ctrl">'
                + '<div  style="position: relative;"><input type="checkbox" id="isSubuuid'+uuid+'" name="isSub" value="1" dataextenal="" ></div> '
                + '</div></div>'
                + '</div>'

                + '<div class="row-fluid row-block">'
                + '<div  id="serviceAge_'+ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
                + '<div class="col-lg-1"></div><div class="col-lg-2"><div style=" text-align: left;" class="field_label" title="'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_13
                + '">'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_13
                + '</div></div>'
                + '<div class="span2"><i id="serviceAge_add" class="icon-plus" style="padding:2px" ></i></div>'
                + '</div></div>'
                + '</div>'
                + '<h5>'
                + jsBizMultLan.atsManager_atsPCRuleSetForAttMulitEdit_i18n_9
                + '</h5>'
                + '<div class="row-fluid row-block">'
                + '<div class="col-lg-24 field-desc">'
                + '<div class="flex-r" style="margin:10px;"><input style="width:2%;" id="enrollChangeTypeuuid'+uuid+'" value="1" name="enrollChangeTypeuuid'+uuid+'" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                + '<div style=" text-align: left;padding-left: 10px;" class="field_label" title="">'+receiveStr0+'</div>'
                + '</div><div class="flex-r" style="margin:10px;"><input style="width:2%;" id="enrollChangeTypeuuid'+uuid+'" value="0" name="enrollChangeTypeuuid'+uuid+'" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                + '<div style=" text-align: left;padding-left: 10px;" class="field_label" title="">'+receiveStr1+'</div>'
                + '</div><div class="flex-r" style="margin:10px;"><input style="width:2%;" id="enrollChangeTypeuuid'+uuid+'" value="2" name="enrollChangeTypeuuid'+uuid+'" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                + '<div style=" text-align: left;padding-left: 10px;" class="field_label" title="">'+receiveStr2+'</div>'
                + '</div><div class="flex-r" style="margin:10px;"><input style="width:2%;" id="enrollChangeTypeuuid'+uuid+'" value="3" name="enrollChangeTypeuuid'+uuid+'" class="block-father input-height" type="radio" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
                + '<div style=" text-align: left;padding-left: 10px;" class="field_label" title="">'+receiveStr3+'</div>'
                + '</div></div></div>'
        }

        return html;
    }
});

