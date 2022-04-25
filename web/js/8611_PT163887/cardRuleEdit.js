shr.defineClass("shr.ats.CardRuleEdit", shr.ats.AtsMaintainBasicItemEdit, {

    initalizeDOM: function () {
        shr.ats.CardRuleEdit.superClass.initalizeDOM.call(this);
        var that = this;
        that.initalizeCardRuleEdit();
        that.notEnabledCardRulesChange();
        that.notEnabledCardRulesInit();
        if (that.getOperateState() == 'ADDNEW') {
            $('#isReuseCard').shrCheckbox('check');
        }
        $('[title="' + jsBizMultLan.atsManager_cardRuleEdit_i18n_8 + '"]')
            .attr("title", jsBizMultLan.atsManager_cardRuleEdit_i18n_6);
        that.initToolTips();
    }
    , initalizeCardRuleEdit: function () {

        var that = this;
        that.setSegmentHideOrShow();
        that.setSegmentInterValShowOrHide();
        /**
         * 默认设置上班第二次取卡隐藏
         */
        that.setOnWorkSecondFetchCardDviHide();
        /**
         * 默认设置下班第二次取卡隐藏
         */
        that.setOffWorkSecondFetchCardDviHide();
        that.setStartNumAndEndNum();
        //设置段间分配段次的隐藏或者显示
        that.setAssignTypeAndAssignSegment();
        //that.bindExpansionAndCollapseEvent();
        //设置系统预设数据编号和名称不能编辑
        //that.setFiledIsEnable();
        that.setAssignSegmentValueByStartNum();

        //设置是否默认
        if (that.getOperateState() != 'VIEW' && "copy" != shr.getUrlParams().method) {
            that.setIsDefault();
        }

        //增加参数说明弹出div
        that.addCaptionDiv();

        //增加免卡参数说明
        that.addFreeCalDoc();

    }

    ,notEnabledCardRulesChange : function(){
        var that = this;
        if(that.getOperateState() == 'VIEW'){
            return;
        }
        $('#notUseSubRule').shrCheckbox('onChange', function () {
            var allDay = atsMlUtile.getFieldOriginalValue("notUseSubRule");
            if(allDay){
                $("#base").hide();
                $("#otTakeCard").hide();
            }else {
                $("#base").show();
                $("#otTakeCard").show();
            }
        });
    }

     ,notEnabledCardRulesInit:function(){

         var that = this;
         if(that.getOperateState() == 'VIEW'){
             var allDay = atsMlUtile.getFieldOriginalValue("notUseSubRule");
             if(allDay == 'true'){
                 $("#base").hide();
                 $("#otTakeCard").hide();
             }else {
                 $("#base").show();
                 $("#otTakeCard").show();
             }
         }else {
             var allDay = atsMlUtile.getFieldOriginalValue("notUseSubRule");
             if(allDay){
                 $("#base").hide();
                 $("#otTakeCard").hide();
             }else {
                 $("#base").show();
                 $("#otTakeCard").show();
             }
         }
     }

    /**
     * 覆盖保存方法  校验名称和ID是否重复
     */
    , saveAction: function (event) {
        var that = this;
        var name = $("#name").val();
        var billId = $("#id").val();

        //复制功能使用
        if ($("#breadcrumb.breadcrumb")[0].baseURI) {
            var baseUriMethod = $("#breadcrumb.breadcrumb")[0].baseURI.split("method=")[1];
            if (baseUriMethod.startsWith("copy")) {
                billId = "";//checkNameAndIdIsExis方法校验时，复制功能相当于新增，不需要传入id
            }
            ;
        }

        var number = atsMlUtile.getFieldOriginalValue("number");
        workArea = that.getWorkarea(),
            $form = $('form', workArea);
        if ($form.valid() && that.verify()) {
            that.remoteCall({
                type: "post",
                method: "checkNameAndIdIsExist",
                param: {
                    name: name,
                    billId: billId,
                    number: number,
                    handler: "com.kingdee.shr.ats.web.handler.CardRuleEditHandler"
                },
                success: function (res) {
                    if (res.checkNameIsExist == "exist") {
                        shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_cardRuleEdit_i18n_10, [name])});
                    } else if (res.checkIdIsExist == "exist") {
                        shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_cardRuleEdit_i18n_0, [number])});
                    } else {

                        var billId = $("#id").val();
                        //复制功能使用
                        if ($("#breadcrumb.breadcrumb")[0].baseURI) {
                            var baseUriMethod = $("#breadcrumb.breadcrumb")[0].baseURI.split("method=")[1];
                            if (baseUriMethod.startsWith("copy")) {
                                billId = "";//checkNameAndIdIsExis方法校验时，复制功能相当于新增，不需要传入id
                            }
                            ;
                        }

                        // 获得 对应段次 是否含有默认取卡规则
                        that.remoteCall({
                            type: "post",
                            async: false,
                            method: "getExistDefaultCardRule",
                            param: {
                                billId: billId,
                                startSegmentNum: $("#startSegmentNum_el").val(),
                                handler: "com.kingdee.shr.ats.web.handler.CardRuleEditHandler"
                            },
                            success: function (res) {
                                info = res;
                                if ($('#isDefault').attr('checked') == "checked" && info.isExist) {
                                    shr.showConfirm(jsBizMultLan.atsManager_cardRuleEdit_i18n_5, function () {
                                        that.doSave(event, 'save');
                                    });
                                } else {
                                    that.doSave(event, 'save');
                                }
                            }
                        });


                    }

                }
            });


        }
    }

    ,


    /**
     * 保存真正执行方法
     */
    doSave: function (event, action) {
        var _self = this;
        var data = _self.prepareParam(action + 'Action');
        var model = shr.assembleModel(_self.fields, _self.getWorkarea(), _self.uuid);

        // TODO
        model = _self.warpModel(model);

        data.model = shr.toJSON(model);
        data.method = action;

        //复制功能使用
        if ($("#breadcrumb.breadcrumb")[0].baseURI) {
            var baseUriMethod = $("#breadcrumb.breadcrumb")[0].baseURI.split("method=")[1];
            if (baseUriMethod.startsWith("copy")) {
                data.model = data.model.replace(data.billId, "");
                data.copyId = data.billId;//原纪录的id，用于复制其分录
                data.billId = "";
            }
            ;
        }

        var target;
        if (event && event.currentTarget) {
            target = event.currentTarget;
        }
        shr.doAction({
            target: target,
            url: _self.dynamicPage_url,
            type: 'post',
            data: data,
            success: function (response) {
                if (_self.isFromF7()) {
                    // 来自F7，关闭当前界面，并给F7设置
                    var dataF7 = {
                        id: response,
                        name: $.parseJSON(data.model).name
                    };
                    dialogClose(dataF7);
                } else {
                    // 普通保存，去除最后一个面包屑，防止修改名字造成面包屑重复
                    shrDataManager.pageNavigationStore.pop();

                    _self.reloadPage({
                        billId: response,
                        method: 'view'
                    });
                }
            }
        });
    }, warpModel: function (model) {
        //model.entries = model.billEntry;
        //delete model.billEntry;
        return model;
    }
    /**
     * 设置上班取卡提前和下班取卡延后 的数字与 上班第一次取卡开始，下班第一次取卡结束 数字 保持一致
     */
    , setStartNumAndEndNum: function () {
        var that = this;
        if (that.getOperateState() != 'VIEW') {
            $("#startNum").change(function () {//@
                atsMlUtile.setTransNumValue("segBefFirStartNum", atsMlUtile.getFieldOriginalValue("startNum"));
            });
            $("#endNum").change(function () {//@
                atsMlUtile.setTransNumValue("segAftFirEndNum", atsMlUtile.getFieldOriginalValue("endNum"));
            });
        }
    }
    //通过启动段次 动态改变第一段上班和下班的枚举值
    , setAssignSegmentValueByStartNum: function () {
        var that = this;
        $("#startSegmentNum").change(function () {
            that.segFirAssignSegment_downHideOrShow();
            // 设置是否默认值
            that.setIsDefault();

        });
        //新增,修改,查看都需要设置
        that.segFirAssignSegment_downHideOrShow();
    }
    , setIsDefault: function () {
        var that = this;
        var billId = $("#id").val();
        var startSegmentNum = $("#startSegmentNum_el").val();
        $('#isDefault').shrCheckbox('unCheck');
        $('#isDefault').attr("disabled", false);

        that.remoteCall({
            type: "post",
            async: false,
            method: "getExistDefaultCardRule",
            param: {
                billId: billId,
                startSegmentNum: startSegmentNum,
                handler: "com.kingdee.shr.ats.web.handler.CardRuleEditHandler"
            },
            success: function (res) {
                info = res;
                if (!info.isExist) {
                    $('#isDefault').shrCheckbox('check');
                    $('#isDefault').attr("disabled", true);
                }
            }
        });


    }
    , segFirAssignSegment_downHideOrShow: function () {
        var value = this.getFieldValue("startSegmentNum")
        if (value == 2) {
            //段间1设置
            $("#segFirAssignSegment_down li[value=1]").show();
            $("#segFirAssignSegment_down li[value=2]").show();
            $("#segFirAssignSegment_down li[value=3]").hide();
            $("#segFirAssignSegment_down li[value=4]").hide();
        }
        if (value == 3) {
            //段间1设置
            $("#segFirAssignSegment_down li[value=1]").show();
            $("#segFirAssignSegment_down li[value=2]").show();
            $("#segFirAssignSegment_down li[value=3]").hide();
            $("#segFirAssignSegment_down li[value=4]").hide();
            //段间2设置
            $("#segSecAssignSegment_down li[value=1]").hide();
            $("#segSecAssignSegment_down li[value=2]").hide();
            $("#segSecAssignSegment_down li[value=3]").show();
            $("#segSecAssignSegment_down li[value=4]").show();
        }
    }


    /**
     * 设置段间1分配类型和分配段次,如果分配类型是最近打卡点，分配段次隐藏掉
     */
    , setAssignTypeAndAssignSegment: function () {
        var that = this;
        if (that.getOperateState() != 'VIEW') {
            $("#segFirAssignType").change(function () {
                //最近打卡点
                if ($("#segFirAssignType_el").val() == 2) {
                    $("#FirAssignSegmentDiv").hide();
                    $("#segFir_group").hide();
                } else if ($("#segFirAssignType_el").val() == 3) {
                    $("#FirAssignSegmentDiv").hide();
                    $("#segFir_group").show();
                } else {
                    $("#segFir_group").hide();
                    $("#FirAssignSegmentDiv").show();
                }
            });
            //段间2设置
            $("#segSecAssignType").change(function () {
                //最近打卡点
                if ($("#segSecAssignType_el").val() == 2) {
                    $("#SecondAssignSegmentDiv").hide();
                    $("#segSec_group").hide();
                } else if ($("#segSecAssignType_el").val() == 3) {
                    $("#SecondAssignSegmentDiv").hide();
                    $("#segSec_group").show();
                } else {
                    $("#segSec_group").hide();
                    $("#SecondAssignSegmentDiv").show();
                }
            });
        }
        //新增 修改 查看都需要设置
        if (that.getOperateState() == 'VIEW' || that.getOperateState() == 'EDIT' || that.getOperateState() == 'ADDNEW') {
            //alert(this.getFieldValue("segFirAssignType") )
            // var personId = that.getFieldValue("entries_person");
            //第一段
            if (this.getFieldValue("segFirAssignType") == 2) {
                $("#FirAssignSegmentDiv").hide();
                $("#segFir_group").hide();
            } else if (this.getFieldValue("segFirAssignType") == 3) {
                $("#FirAssignSegmentDiv").hide();
                $("#segFir_group").show();
            } else {
                $("#segFir_group").hide();
                $("#FirAssignSegmentDiv").show();
            }
            //第二段
            if (this.getFieldValue("segSecAssignType") == 2) {
                $("#SecondAssignSegmentDiv").hide();
                $("#segSec_group").hide();
            } else if (this.getFieldValue("segSecAssignType") == 3) {
                $("#SecondAssignSegmentDiv").hide();
                $("#segSec_group").show();
            } else {
                $("#SecondAssignSegmentDiv").show();
                $("#segSec_group").hide();
            }
        }
    }


    , setFiledIsEnable: function () {
        var that = this;
        var flag = $("#flag").val();
        if (that.getOperateState() == "EDIT") {
            if (flag == 1) {
                that.getField("number").shrTextField("disable");
                that.getField("name").shrTextField("disable");
                //that.getField("remark").shrTextField('disable');
                //this.getField('applier').shrPromptBox("disable"); //F7禁用
                //shrTextField('option','disable',true)
            }
        }
    }
    /**
     * 默认设置上班第二次取卡隐藏,点 展开 的时候 把第二段的参数设置展开
     */
    , setOnWorkSecondFetchCardDviHide: function () {
        $("#onWorkSecondFetch").hide();
        $("#onWorkSecondPackUpBtn").hide();
    }
    /*//绑定展开和收起的点击事件
    ,bindExpansionAndCollapseEvent:function(){
        $('#onWorkSecondBtn').click(function(e){
            $("#onWorkSecondFetch").show();
        });
    }*/
    //上班展开
    , onWorkSecondExplorBtnAction: function () {
        $("#onWorkSecondFetch").show();
        $("#onWorkSecondExplorBtn").hide();
        $("#onWorkSecondPackUpBtn").show();
    }
    //上班收起
    , onWorkSecondPackUpBtnAction: function () {
        $("#onWorkSecondFetch").hide();
        $("#onWorkSecondExplorBtn").show();
        $("#onWorkSecondPackUpBtn").hide();
    }
    /**
     * 默认设置下班第二次取卡隐藏,点 展开 的时候 把第二段的参数设置展开
     */
    , setOffWorkSecondFetchCardDviHide: function () {
        $("#offWorkSecondFetch").hide();
        $("#offWorkSecondPackUpBtn").hide();
    }
    //下班展开
    , offWorkSecondExplorBtnAction: function () {
        $("#offWorkSecondFetch").show();
        $("#offWorkSecondExplorBtn").hide();
        $("#offWorkSecondPackUpBtn").show();
    }
    //下班收起
    , offWorkSecondPackUpBtnAction: function () {
        $("#offWorkSecondFetch").hide();
        $("#offWorkSecondExplorBtn").show();
        $("#offWorkSecondPackUpBtn").hide();
    }

    //设置段间取卡规则隐藏或者显示
    , setSegmentInterValShowOrHide: function () {
        var startSegmentValue = $("#startSegmentNum_el").val();
        if (startSegmentValue == 2) {
            $("#segTakeCardRule_group").show();
            $("#segFirst_div").show();
            $("#segSecond_div").hide();
        } else if (startSegmentValue == 3) {
            $("#segTakeCardRule_group").show();
            $("#segFirst_div").show();
            $("#segSecond_div").show();
        } else if (startSegmentValue == 1) {
            $("#segTakeCardRule_group").hide();
            $("#segFirst_div").hide();
            $("#segSecond_div").hide();
        }
    }
    , setSegmentHideOrShow: function () {
        var that = this;
        if (that.getOperateState() != 'VIEW') {
            $("#startSegmentNum").change(function () {
                that.setSegmentInterValShowOrHide();
            });
        }
        if (that.getOperateState() == 'VIEW' || that.getOperateState() == 'EDIT') {
            var value = "";
            if (that.getOperateState() == 'VIEW') {
                value = this.getFieldValue("startSegmentNum");
            }
            if (that.getOperateState() == 'EDIT') {
                value = $("#startSegmentNum_el").val();
            }
            if (value == 2) {
                $("#segTakeCardRule_group").show();
                $("#segFirst_div").show();
                $("#segSecond_div").hide();
            } else if (value == 3) {
                $("#segTakeCardRule_group").show();
                $("#segFirst_div").show();
                $("#segSecond_div").show();
            } else if (value == 1) {
                $("#segTakeCardRule_group").hide();
                $("#segFirst_div").hide();
                $("#segSecond_div").hide();
            }
        }

    }

    //增加校验
    , verify: function () {
        var startNum = atsMlUtile.getFieldOriginalValue("startNum");
        var endNum = atsMlUtile.getFieldOriginalValue("endNum");
        var onWorkFirstFatchTimeStartNum = atsMlUtile.getFieldOriginalValue("segBefFirStartNum");//上班（段头）第一次取卡开始时数
        var onWorkSecondFatchTimeStartNum = atsMlUtile.getFieldOriginalValue("segBefSecStartNum");//上班（段头）第二次取卡开始时数

        var offWorkFirstFatchTimeEndNum = atsMlUtile.getFieldOriginalValue("segAftFirEndNum");//下班（段尾）第一次取卡结束时数
        var offWorkSecondFatchTimeEndNum = atsMlUtile.getFieldOriginalValue("segAftSecEndNum");//下班（段尾）第二次取卡结束时数

        if (parseFloat(onWorkFirstFatchTimeStartNum) > parseFloat(startNum)) {//@
            shr.showInfo({message: jsBizMultLan.atsManager_cardRuleEdit_i18n_21});
            return false;
        }
        if (parseFloat(onWorkSecondFatchTimeStartNum) > parseFloat(startNum)) {//@
            shr.showInfo({message: jsBizMultLan.atsManager_cardRuleEdit_i18n_20});
            return false;
        }
        if (parseFloat(offWorkFirstFatchTimeEndNum) > parseFloat(endNum)) {//@
            shr.showInfo({message: jsBizMultLan.atsManager_cardRuleEdit_i18n_29});
            return false;
        }
        if (parseFloat(offWorkSecondFatchTimeEndNum) > parseFloat(endNum)) {//@
            shr.showInfo({message: jsBizMultLan.atsManager_cardRuleEdit_i18n_28});
            return false;
        } else {
            return true;
        }
    }

    , addCaptionDiv: function () {
        var that = this;
        //if($('#isDefault').closest(".row-fluid").eq(0).children('div[data-ctrlrole="labelContainer"]').length<2){
        /* 			$('#isDefault').closest(".row-fluid").eq(0).after('<div data-ctrlrole="labelContainer">'
                                                                        +'<div class="col-lg-4">'
                                                                        +'<div class="field_label" title="取卡规则说明"><a id = "caption" href="#">取卡规则说明</a></div>'
                                                                        +'</div></div>'); */
        $('#baseInfo').before('<div style="float:right" title="'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_2
            + '"><a id = "caption" href="#">'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_2
            + '</a></div>');

        $('#caption').live('click', that.reasonOnClick);
        $('body').after(that.getCaptionDivHtml());
        //}
    }

    , getCaptionDivHtml: function () {
        return ['<div id="caption_div" class="modal hide fade">',
            '<div class="modal-header">',
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
            '<h5>'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_14
            + '</h5>',
            '</div>',
            '<div id="caption-content"  class="modal-body">',
            '</div>',
            '</div>'].join('');
    }
    , reasonOnClick: function () {
        if ("en_US" == contextLanguage) {
          document.location.href = "/shr/addon/attendmanage/web/resource/cardRule_example_EN.docx";
        } else {
          document.location.href = "/shr/addon/attendmanage/web/resource/cardRule_example.docx";
        }
//		$('#caption-content').html('<li>1、上班取卡提前(H)：需填写小时数，设置上班卡前几小时为最早取卡点。</br>如：班次最早上班卡为早8:00，上班取卡提前(H)为3小时，则会从5:00开始获取有效的打卡数据。</li></br>'
//			+'<li>2、下班取卡延后(H)：需填写小时数，设置下班卡后几个小时为最晚的取卡点。</br>如：班次最早上班卡为早8:00，上班取卡提前(H)为3小时，班次最晚的下班卡为下午17:00，下班取卡延后(H)为3小时，则系统会过滤早5:00—20:00这期间的打卡数据，这个期间为有效的打卡范围。</li></br>'
//			//+'<li>3、最短取卡间隔(分钟)：需填写分钟数，根据取卡规则取卡后，以该卡为中心在前后间隔分钟内的卡均为无效卡。</br>如：上午下班时间为12:00，下午上班时间为：13:00，这期间的打卡数据为12:03、12:05、12:09，根据就近取卡取最近的卡规则，取12:03为上午实际下班时间，则12:03—12:08期间所有的刷卡均为无效卡，再次取卡过滤会排除这个期间的打卡记录，将12:09作为下午实际上班时间。</li></br>'
//			+'<li>3、最短取卡间隔(分钟)：需填写分钟数，根据取卡规则取卡后，以该卡为中心在前后间隔分钟内的卡均为无效卡。</br>如：最短取卡间隔(分钟)设置为5，上午下班时间为12:00，下午上班时间为：13:00，这期间的打卡数据为12:03、12:05、12:09，根据就近取卡取最近的卡规则，取12:03为上午实际下班时间，则12:03—12:08期间所有的刷卡均为无效卡，再次取卡过滤会排除这个期间的打卡记录，将12:09作为下午实际上班时间。</br>再如：最短取卡间隔(分钟)设置为5，下班时间为18:00，打卡为17:59、18:02，则取卡范围内第一个17:59之后的5分钟刷卡均为无效卡，即18:02无效，下班取卡结果为17:59（若要取卡结果为18:02，则需改小最短取卡间隔(分钟)的值）。若再有一个卡18:10，则有效卡为17:59、18:10，取最晚卡的话，下班取卡结果就为18:10。</li></br>'
//			+'<li>4、上、下班取卡规则的参数：</br>上下班可以分别定义两次取卡，每一次可以定义取卡范围和取卡方式。建议第二次的范围要大于第一次，否则设置第二次取卡没有意义。</br>A、取卡范围开始时数：需填写小时数，上班卡的取卡范围开始时数需小于整个班次的“上班取卡提前(H)”的小时数。</br>B、取卡范围结束时数：需填写小时数，下班卡的取卡范围结束时数需小于整个班次的“下班取卡延后(H)”。</br>C、取卡方式：支持两种取卡方式，在取卡范围内的取最早卡或取最晚卡。</li></br>'
//			+'<li>5、段间取卡规则：</br>A、分配类型：手工分配和最近打卡点</br>两个打卡段时间的时段叫做段间，如班次为两个时段，则第一段下班和第二段上班之间的时间为段间。若段间只有一笔打卡记录，可以选择手工分配，分配给给第一段下班或第二段上班，也可以直接选择最近打卡点，将打卡点分配给离它最近的段间卡。</br>B、分配段次：手工分配段间卡的选项。</li></br>'
//			+'<li>6、跨天允许重复取卡：</br>勾选时，前一天的下班卡和后一天的上班卡，在取卡时间范围内，可以取到同一笔打卡记录。</li></br>');
//		$('#caption_div').modal('show');
    }
    , addFreeCalDoc: function () {
        $("#isFreeCardCalType_down").find("a").eq(0).attr("title", jsBizMultLan.atsManager_cardRuleEdit_i18n_1);
        $("#isFreeCardCalType_down").find("a").eq(1).attr("title", jsBizMultLan.atsManager_cardRuleEdit_i18n_26);
        $("#isFreeCardCalType_down").find("a").eq(2).attr("title", jsBizMultLan.atsManager_cardRuleEdit_i18n_25);
        $("#isFreeCardCalType_down").find("a").eq(3).attr("title", jsBizMultLan.atsManager_cardRuleEdit_i18n_27);
    },
    //添加tips说明
    initToolTips: function () {
        var tipsBeforeText = '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_34
            + '<br/>&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_16;
        //此处选择器中用中文括号，页面上是中文
        $('[title="' + jsBizMultLan.atsManager_cardRuleEdit_i18n_22 + '"]').after('<span id="tipsBefore"></span>');
        $("#tipsBefore").shrTooltip({content: tipsBeforeText});

        var tipsAfterText = '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_35
            + '<br/>&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_15
            + '</br>'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_38
            + '<br/>';
        $('[title="' + jsBizMultLan.atsManager_cardRuleEdit_i18n_31 + '"]').after('<span id="tipsAfter"></span>');
        $("#tipsAfter").shrTooltip({content: tipsAfterText});

        var tipsShortDateText = '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_32
            + '<br/>'
            + '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_18
            + '</br>'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_11
            + '<br/>'
            + '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_37
            + '</br>'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_30;
        $('[title="' + jsBizMultLan.atsManager_cardRuleEdit_i18n_39 + '"]').after('<span id="tipsShortDate"></span>');
        $("#tipsShortDate").shrTooltip({content: tipsShortDateText});

        var tipsRuleText = '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_23
            + '</br>'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_7
            + '<br/>'
            + '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_17
            + '</br>'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_3
//			$('[title="' + 上班下班取卡规则 + '"]').after('<span id="tipsRule"></span>');
        $($("#base").find("h5")[0]).after('<span id="tipsRule"></span>');
        $("#tipsRule").shrTooltip({content: tipsRuleText});

        var tipsDelegateText = '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_24
            + '<br/>&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_9
            + '</br>'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_19;
        $('#segFirst_div div[title="' + jsBizMultLan.atsManager_cardRuleEdit_i18n_4 + '"]').after('<span id="tipsDelegate1"></span>');
        $("#tipsDelegate1").shrTooltip({content: tipsDelegateText});
        $('#segSecond_div div[title="' + jsBizMultLan.atsManager_cardRuleEdit_i18n_4 + '"]').after('<span id="tipsDelegate2"></span>');
        $("#tipsDelegate2").shrTooltip({content: tipsDelegateText});

        var tipsIsWorkTimeRestrictText = '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_26806093_i18n_0
            + '<br/>&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_26806093_i18n_2
            + '<br/>&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_26806093_i18n_1;
        $('[title="' + jsBizMultLan.atsManager_cardRuleEdit_26806093_i18n_3 + '"]').after('<span id="tipsIsWorkTimeRestrict"></span>');
        $("#tipsIsWorkTimeRestrict").shrTooltip({content: tipsIsWorkTimeRestrictText});

        var tipsNotUseSubRuleText = '&nbsp;&nbsp; '+jsBizMultLan.atsManager_cardRuleEdit__i18n_tipsNotEnable+'<br/>&nbsp;&nbsp;';
        $('[title="' + jsBizMultLan.atsManager_cardRuleEdit_i18n_beforeAfter + '"]').after('<span id="tipsNotUseSubRule"></span>');
        $("#tipsNotUseSubRule").shrTooltip({content: tipsNotUseSubRuleText});


        //页面右侧
        var tipsStartDateText = '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_33
            + '<br/>';
        var tipsStart = $('[title="' + jsBizMultLan.atsManager_cardRuleEdit_i18n_13 + '"]');
        for (var i = 0; i < tipsStart.length; i++) {
            $(tipsStart[i]).after('<span id="tipsStartDate' + i + '"></span>');
            $("#tipsStartDate" + i).shrTooltip({content: tipsStartDateText});
        }

        var tipsEndDateText = '&nbsp;&nbsp;'
            + jsBizMultLan.atsManager_cardRuleEdit_i18n_36
            + '<br/>';
        var tipsEnd = $('[title="' + jsBizMultLan.atsManager_cardRuleEdit_i18n_12 + '"]');
        for (var i = 0; i < tipsEnd.length; i++) {
            $(tipsEnd[i]).after('<span id="tipsEndDate' + i + '"></span>');
            $("#tipsEndDate" + i).shrTooltip({content: tipsEndDateText});
        }
    }
});
