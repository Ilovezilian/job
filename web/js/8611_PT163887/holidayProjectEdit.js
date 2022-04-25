shr.defineClass("shr.ats.HolidayProjectEdit", shr.ats.AtsMaintainBasicItemEdit, {
      
      initalizeDOM:function(){
		shr.ats.HolidayProjectEdit.superClass.initalizeDOM.call(this);
		var that = this ;
//		that.setDecimalDigitState();
		that.initDefaultValue();
		
		that.addChange();
		that.setAttenceProjectCategory();
		that.setReadOnly();
		that.addTips();
		//系统内置的项目类别不让编辑
		if(that.getOperateState()=='EDIT' && $("#isInternal_el").val()=="1")
		{
			that.getField('projectCategory').shrPromptBox("disable");
		}
		//将数据类型的逻辑类型去掉
		$("#dataType_down li").eq(3).css('display','none');
		
		if (that.getOperateState() != 'VIEW') {
			$("#calculateRule_holidayType").parent().parent().parent().hide()
			that.initialRuleHtml();
		}
		that.addcalculateRuleDoc();
	  },
	  //设置小数位数状态
	  setDecimalDigitState:function(){
	  	var that = this ;
	  	if (that.getOperateState() != 'VIEW') {
	  		
	  		var value = $("#dataType_el").val();
	  		if (value == 2) {
	  			this.getField('decimalDigit').shrTextField("enable");//实数启用
	  		}else{
	  			this.getField('decimalDigit').shrTextField("disable");
	  		}
		  	
		  	$("#dataType").change(function(){
		  		//这里需要用that才可以
		  		var dataTypeValue = $("#dataType_el").val();
		  		if (dataTypeValue == 2 ) {//实数
		  			that.getField('decimalDigit').shrTextField("enable");
		  			atsMlUtile.setTransNumValue("decimalDigit",2,{'decimalPrecision':0});
		  		}else{
		  			that.getField('decimalDigit').shrTextField("disable");
		  			atsMlUtile.setTransNumValue("decimalDigit",0,{'decimalPrecision':0});
		  		}
		  	});
	  	}
	  },
	  
	  setAttenceProjectCategory: function(){
	  	if(this.getOperateState() == 'ADDNEW'){
		  	var categoryId = shr.getUrlRequestParam("categoryId");
		  	var categoryName = shr.getUrlRequestParam("categoryName");
		  	var dataValue = {id:categoryId, name:categoryName}
		  	if(categoryId != "" && categoryName !=""){
		  		$('#projectCategory').shrPromptBox("setValue", dataValue);
		  	}
	  	}
	  }
	  
	  ,initDefaultValue : function (){
		  var that = this ;
		  
		  //创建时，项目类型默认：明细计算项目;是否显示默认：明细显示，并屏蔽是否显示中的汇总显示，明细汇总显示两项
		  if(that.getOperateState() == 'ADDNEW'){
			  $("#itemType").val($("#itemType_down li[value=1]").text());
			  $("#itemType_el").val(1);
			  $("#isDisplay").val($("#isDisplay_down li[value=2]").text());
			  $("#isDisplay_el").val(2);
			  $("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_32
						|| $(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_31){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
			});
		  //创建时  计算逻辑名称默认为：取假期额度 ;参数2默认设置为标准额度，并屏蔽请假时长，请假次数两项
		  $("#calculateRule_ruleName").val($("#calculateRule_ruleName_down li[value=0]").text());
		  $("#calculateRule_ruleName_el").val(0);
//		  $("#calculateRule_unit").hide();//隐藏unit参数
//		  $("#ruleInfo div:last-child").hide();
		  $("#calculateRule_elem2").val($("#calculateRule_elem2_down li[value=0]").text());
		  $("#calculateRule_elem2_el").val(0);
		  
		  $("#calculateRule_elem2_down > li").each(function(){
			  if($(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_34
				  || $(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_33){
					$(this).css('display','none');
				}
				else{
					$(this).css('display','block');
				}	
		  });
		  }
		  
		  
		  //编辑时，不改变默认值，只对 是否显示中 的项目进行屏蔽
		  if(that.getOperateState() == 'EDIT'){
			    var curValue = $("#itemType_el").val();
			    if (curValue == 0 ) {//明细计算项目
				$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_25
						||$(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_31){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
			}else if (curValue == 1 ){
				$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_32
						||$(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_31){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
			}else {
				$("#isDisplay_down > li").each(function(){
						$(this).css('display','block');
				});
			}
			    
			//设置计算规则
			 var calRule = $("#calculateRule_ruleName").val();   
			 if(calRule==0){//取假期额度
				 $("#calculateRule_elem2_down > li").each(function(){
					  if($(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_34
						  || $(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_33){
							$(this).css('display','none');
						}
						else{
							$(this).css('display','block');
						}	
				  });
				 
			 }else{//取请假周期时长
				 $("#calculateRule_elem2_down > li").each(function(){
					  if($(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_6
						  || $(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_46
						  ||$(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_47
						  ||$(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_38){
							$(this).css('display','none');
						}
						else{
							$(this).css('display','block');
						}	
				  });
			 }
		  }
		  
		  
		  
//		  $("#calculateRule_ruleName").val("取假期额度");
//		  if(that.getOperateState() == 'ADDNEW' || that.getOperateState() == 'EDIT'){
////			  $("#calculaterule_ruleName").attr("placeholder","test");
//			  var ruleName = $("#calculateRule_ruleName").val();
//			  $("#calculateRule_elem1").attr("placeholder","额度记录，取值范围：0--4");
//			  $("#calculateRule_holidayType").attr("placeholder","假期类型");
//			  $("#calculateRule_elem2").attr("placeholder","需要返回字段的名称");
//		  }
		  
		  
	  }
	  
	  ,addChange:function(){
    	var that = this ;
		//类型项目
	  	$("#itemType").change(function(){
	  		var curValue = $("#itemType_el").val();
	  		if (curValue == 0 ) {//明细计算项目
				$("#isDisplay").val($("#isDisplay_down li[value=1]").text());
	  			$("#isDisplay_el").val(1);
				$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_25
						||$(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_31){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
	  		}else{
				if(curValue == 1){
					$("#isDisplay").val($("#isDisplay_down li[value=2]").text());
					$("#isDisplay_el").val(2);
					$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_32
						||$(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_31){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
				}else{
					$("#isDisplay").val($("#isDisplay_down li[value=3]").text());
					$("#isDisplay_el").val(3);
					$("#isDisplay_down > li").each(function(){
						$(this).css('display','block');
					});
				}
	  		}
	  	});
		//是否显示
		$("#isDisplay").change(function(){
  		var curValue1 = $("#isDisplay_el").val();
  		if (curValue1 == 1 && $("#itemType_el").val()==1) {//
			$("#isDisplay").val($("#isDisplay_down li[value=2]").text());
  			$("#isDisplay_el").val(2);
  		}
		if (curValue1 == 2 && $("#itemType_el").val()==0) {//
			$("#isDisplay").val($("#isDisplay_down li[value=1]").text());
  			$("#isDisplay_el").val(1);
  		}
		if (curValue1 == 3 && $("#itemType_el").val()==0) {//
			$("#isDisplay").val($("#isDisplay_down li[value=1]").text());
  			$("#isDisplay_el").val(1);
  		}
		if (curValue1 == 3 && $("#itemType_el").val()==1) {//
			$("#isDisplay").val($("#isDisplay_down li[value=2]").text());
  			$("#isDisplay_el").val(2);
  		}
  		});
	  	$("#enable").change(function(){
	 	  if (that.getFieldValue('isInternal') == 2) {
	 			if (that.getFieldValue('enable') == 2) {
	 				//设置为不显示
	 				$("#isDisplay").val($("#isDisplay_down li[value=4]").text());
					$("#isDisplay_el").val(4);
	 			}else{
	 					  		var curValue = $("#itemType_el").val();
	  		if (curValue == 0 ) {//明细计算项目
				$("#isDisplay").val($("#isDisplay_down li[value=1]").text());
	  			$("#isDisplay_el").val(1);
				$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_25
						||$(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_31){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
	  		}else{
				if(curValue == 1){
					$("#isDisplay").val($("#isDisplay_down li[value=2]").text());
					$("#isDisplay_el").val(2);
					$("#isDisplay_down > li").each(function(){
					if($(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_32
						||$(this).text()==jsBizMultLan.atsManager_holidayProjectEdit_i18n_31){
						$(this).css('display','none');
					}
					else{
						$(this).css('display','block');
					}				
				});
				}else{
					$("#isDisplay").val($("#isDisplay_down li[value=3]").text());
					$("#isDisplay_el").val(3);
					$("#isDisplay_down > li").each(function(){
						$(this).css('display','block');
					});
				}
	  		}
	 			}
	 	 }
	    });
//	  	 $("#calculaterule_ruleName").change(function(){//根据计算规则动态加载参数
//	  		var ruleName = $("#calculaterule_ruleName").val();
//	  		var importRuleElem =$('#ruleInfo').find("div[data-ctrlrole='labelContainer']");
//	  		
//	  		 if(ruleName=="取假期额度"){
//				  $("#calculateRule_elem1").attr("placeholder","额度记录，取值范围：0--4");
//				  $("#calculateRule_holidayType").attr("placeholder","假期类型");
//				  $("#calculateRule_elem2").attr("placeholder","需要返回字段的名称");
//			  }else{
//				  $("#calculateRule_elem1").attr("placeholder","请假时长/请假次数");
//				  $("#calculateRule_holidayType").attr("placeholder","假期类型");
//				  $("#calculateRule_elem2").attr("placeholder","单位");
//				  $("#calculateRule_elem3").show();
//				  $("#calculateRule_elem3").attr("placeholder","天和小时换算比例");
//			  }
//			 
//		 })
	 },
		
	 editAction: function() {
		var billId = $("#isInternal").val();
		//if(billId != '1'){
		if(true){
			this.doEdit('edit');
		}else{
			shr.showError({message: jsBizMultLan.atsManager_holidayProjectEdit_i18n_42, hideAfter: 3});
		}
	 },
		
	 verify:function(){
		var isInternal = this.getFieldValue('isInternal');
	 	if (isInternal == 1 && this.getFieldValue('enable') == 2 ) {
	 		shr.showInfo({message: jsBizMultLan.atsManager_holidayProjectEdit_i18n_43});
			return false;
	 	}
//	 	var name = $("#name").val();
//	 	var reg = /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]*$/;
//	 	if(!reg.test(name) && isInternal != 1){
//	 		//系统内置项目不校验。
//	 	    shr.showError({message: jsBizMultLan.atsManager_holidayProjectEdit_i18n_30});
//	 	    return false;
//	 	}
		return true;
	 },
	 setReadOnly: function(){
	    var isInternal = $("#isInternal_el").val();
	    if("1" == isInternal){
	       $("#dataType").shrSelect("disable");
	    }
	 },
	 
	 //
	 ruleEdit:function(){
		 //创建时 根据计算函数自动加载参数
			if(this.getOperateState() == 'ADDNEW'){
				var ruleName = $("#calculaterule.ruleName").val();
				if(ruleName=jsBizMultLan.atsManager_holidayProjectEdit_i18n_37){
					
				}
			}
	 },
	 
	 /**
		 * 组装保存时传至服务端的数据 
		 * 将计算规则参数 添加到其中
		 */
		assembleSaveData: function(action) {
			var _self = this;
			var data = _self.prepareParam(action + 'Action');
			data.method = action;
			data.operateState = _self.getOperateState();
			data.model = shr.toJSON(_self.assembleModel()); 
			
			var model = JSON.parse(data.model);
			// relatedFieldId
			var relatedFieldId = this.getRelatedFieldId();
			if (relatedFieldId) {
				data.relatedFieldId = relatedFieldId;
			}
			if (_self.getOperateState() != 'VIEW') {
				var ruleParams = "";
				if($("#calculateRule_ruleName").shrSelect("getValue").value==0){
					var ruleParams = atsMlUtile.getFieldOriginalValue("elem1")+','+$("#elem2_el").val()+','+atsMlUtile.getFieldOriginalValue("elem3");
				}else{
					var ruleParams = atsMlUtile.getFieldOriginalValue("elem1")+','+$("#elem2_el").val()+','+atsMlUtile.getFieldOriginalValue("elem3")+','+atsMlUtile.getFieldOriginalValue("elem4");
				}
				model.calculateRule.holidayType = ruleParams ;
			}
			data.model = JSON.stringify(model);
			return data;
		},
		
	initialRuleHtml:function(){
		var _self = this;
		$("#calculateRule_ruleName").parents(".row-fluid").eq(0).parent().append('<div id="ruleBlock"></div>');
		if (_self.getOperateState() != 'VIEW') {
			if($("#calculateRule_ruleName").shrSelect("getValue").value==0){
				_self.initialRuleFunction0EditHtml();
			}else{
				_self.initialRuleFunction1EditHtml();
			}
			
		}
		$("#calculateRule_ruleName").shrSelect("option", {
			onChange : function(e,data) {
				if(data.selectVal==0){//取假期额度
					_self.initialRuleFunction0EditHtml();
				}else if(data.selectVal==1){//取周期请假时长
					_self.initialRuleFunction1EditHtml();
				}
			}
		});
	},
	initialRuleFunction0EditHtml:function(){
		var html = "";
		html ='<div class="col-lg-4">'
			 +'<div class="field_label" title="'
            + jsBizMultLan.atsManager_holidayProjectEdit_i18n_16
			+ '">'
			+ jsBizMultLan.atsManager_holidayProjectEdit_i18n_16
			+ '</div>'
			 +'</div>'
			 +'<div class="col-lg-2 field-ctrl">'
			 +'<input class="block-father input-height cursor-pointer"  type="text" id="elem1" class="block-father input-height" name="elem1" placeholder="'
            + jsBizMultLan.atsManager_holidayProjectEdit_i18n_40
			+ '">'
			 +'</div>'
			 
			 +'<div class="col-lg-1 field-desc" style="text-align:center;font-size: 20px;">,</div>'
			 +'<div class="col-lg-3 field-ctrl"><input id="elem2" name="elem2" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
			+ jsBizMultLan.atsManager_holidayProjectEdit_i18n_36
			+ '"></div>'
			 
			 +'<div class="col-lg-1 field-desc" style="text-align:center;font-size: 20px;">,</div>'
			 +'<div class="col-lg-3 field-ctrl"><input class="block-father input-height cursor-pointer"  type="text" id="elem3" class="block-father input-height" name="elem3" placeholder="'
			+ jsBizMultLan.atsManager_holidayProjectEdit_i18n_35
            + '"></div>'
		$("#ruleBlock").html(html);
		
		var select_json = {
		id: "elem1",
		readonly: "",
		value: "",
		onChange: null,
		validate: "",
		filter: ""
		};
		select_json.data = [{"childs":null,"groupAlias":null,"alias":"0","value":"0"},
							{"childs":null,"groupAlias":null,"alias":"1","value":"1"},
							{"childs":null,"groupAlias":null,"alias":"2","value":"2"},
							{"childs":null,"groupAlias":null,"alias":"3","value":"3"},
							{"childs":null,"groupAlias":null,"alias":"4","value":"4"},
							{"childs":null,"groupAlias":null,"alias":"5","value":"5"}];
		$('#elem1').shrSelect(select_json);
		
		var grid_f7_json = {id:"elem2",name:"elem2"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_holidayProjectEdit_i18n_26,
				uipk:"com.kingdee.eas.hr.ats.app.HolidayType.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false, treeFilterConfig: "",permItemId:"",isHasMultileDialog:"false"};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '{required:true}';
		
		grid_f7_json.value = {'id':"",'name':""};
		grid_f7_json.isHROrg = "false";
		
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name:"isComUse",value:true,alias:jsBizMultLan.atsManager_holidayProjectEdit_i18n_44,widgetType:"checkbox"}];
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";
			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.number:BaseInfo.number";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		
		$('#elem2').shrPromptBox(grid_f7_json);
		
	    select_json = {
		id: "elem3",
		readonly: "",
		value: "",
		onChange: null,
		validate: "",
		filter: ""
		};
		select_json.data = [{"childs":null,"groupAlias":null,"alias":jsBizMultLan.atsManager_holidayProjectEdit_i18n_6,
			"value":"standardLimit"},
			{"childs":null,"groupAlias":null,"alias":jsBizMultLan.atsManager_holidayProjectEdit_i18n_46,
				"value":"usedLimit"},
			{"childs":null,"groupAlias":null,"alias":jsBizMultLan.atsManager_holidayProjectEdit_i18n_47,
				"value":"freezeLimit"},
			{"childs":null,"groupAlias":null,"alias":jsBizMultLan.atsManager_holidayProjectEdit_i18n_38,
				"value":"remainLimit"}];
		$('#elem3').shrSelect(select_json);
		
		if($("#calculateRule_holidayType").val()!=""){
			var params = $("#calculateRule_holidayType").val().split(",");
			$("#elem1").shrSelect("setValue",params[0]);
			var grid_f7_json = {}
			grid_f7_json.value = {id:params[1],name:params[1]};
			$("#elem2").shrPromptBox(grid_f7_json);
			$("#elem3").shrSelect("setValue",params[2]);
		}
		//下拉浮动提示
		$("#elem1_down").find("a").eq(0).attr("title",jsBizMultLan.atsManager_holidayProjectEdit_i18n_0);
		$("#elem1_down").find("a").eq(1).attr("title",jsBizMultLan.atsManager_holidayProjectEdit_i18n_1);
		$("#elem1_down").find("a").eq(2).attr("title",jsBizMultLan.atsManager_holidayProjectEdit_i18n_2);
		$("#elem1_down").find("a").eq(3).attr("title",jsBizMultLan.atsManager_holidayProjectEdit_i18n_3);
		$("#elem1_down").find("a").eq(4).attr("title",jsBizMultLan.atsManager_holidayProjectEdit_i18n_4);
		$("#elem1_down").find("a").eq(5).attr("title",jsBizMultLan.atsManager_holidayProjectEdit_i18n_5);

	},
	initialRuleFunction1EditHtml:function(){
		var html = "";
		html ='<div class="col-lg-4">'
			 +'<div class="field_label" title="'
            + jsBizMultLan.atsManager_holidayProjectEdit_i18n_16
            + '">'
			+ jsBizMultLan.atsManager_holidayProjectEdit_i18n_16
            + '</div>'
			 +'</div>'
			 +'<div class="col-lg-2 field-ctrl">'
			 +'<input class="block-father input-height cursor-pointer"  type="text" id="elem1" class="block-father input-height" name="elem1" placeholder="'
			+ jsBizMultLan.atsManager_holidayProjectEdit_i18n_41
			+ '" >'
			 +'</div>'
			 
			 +'<div class="col-lg-1 field-desc" style="text-align:center;font-size: 20px;">,</div>'
			 +'<div class="col-lg-3 field-ctrl"><input id="elem2" name="elem2" class="block-father input-height" type="text"  ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
			+ jsBizMultLan.atsManager_holidayProjectEdit_i18n_36
			+ '"></div>'
			 
			 +'<div class="col-lg-1 field-desc" style="text-align:center;font-size: 20px;">,</div>'
			 +'<div class="col-lg-2 field-ctrl"><input class="block-father input-height cursor-pointer"  type="text" id="elem3" class="block-father input-height" name="elem3" placeholder="'
			+ jsBizMultLan.atsManager_holidayProjectEdit_i18n_18
            + '"></div>'
			 
			 +'<div class="col-lg-1 field-desc" style="text-align:center;font-size: 20px;">,</div>'
			 +'<div class="col-lg-3 field-ctrl">'
			 +'<div class="ui-text-frame"><input id="elem4" class="block-father input-height" type="text" name="elem4" validate="{maxlength:30}" placeholder="'
            + jsBizMultLan.atsManager_holidayProjectEdit_i18n_24
			+ '" dataextenal="" ctrlrole="text" maxlength="30"></div>'
			 +'</div>'
		$("#ruleBlock").html(html);
		
		var select_json = {
		id: "elem1",
		readonly: "",
		value: "",
		onChange: null,
		validate: "",
		filter: ""
		};
		select_json.data = [{"childs":null,"groupAlias":null,"alias":jsBizMultLan.atsManager_holidayProjectEdit_i18n_33,
			"value":"leaveTimes"},
			{"childs":null,"groupAlias":null,"alias":jsBizMultLan.atsManager_holidayProjectEdit_i18n_34,
				"value":"leaveHours"}];
		$('#elem1').shrSelect(select_json);
		
		var grid_f7_json = {id:"elem2",name:"elem2"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_holidayProjectEdit_i18n_26,
			uipk:"com.kingdee.eas.hr.ats.app.HolidayType.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false, treeFilterConfig: '',permItemId:"",isHasMultileDialog:"false"};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '{required:true}';
		
		grid_f7_json.value = {'id':"",'name':""};
		grid_f7_json.isHROrg = "false";
		
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name:"isComUse",value:true,alias:jsBizMultLan.atsManager_holidayProjectEdit_i18n_44,widgetType:"checkbox"}];
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";
			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.number:BaseInfo.number";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		
		$('#elem2').shrPromptBox(grid_f7_json);
		
	    select_json = {
		id: "elem3",
		readonly: "",
		value: "",
		onChange: null,
		validate: "",
		filter: ""
		};
		select_json.data = [{"childs":null,"groupAlias":null,"alias":jsBizMultLan.atsManager_holidayProjectEdit_i18n_45,
			"value":"hour"},
			{"childs":null,"groupAlias":null,"alias":jsBizMultLan.atsManager_holidayProjectEdit_i18n_39,
				"value":"day"}];
		$('#elem3').shrSelect(select_json);
		
		if($("#calculateRule_holidayType").val()!=""){
			var params = $("#calculateRule_holidayType").val().split(",");
			$("#elem1").shrSelect("setValue",params[0]);
			var grid_f7_json = {}
			grid_f7_json.value = {id:params[1],name:params[1]};
			$("#elem2").shrPromptBox(grid_f7_json);
			$("#elem3").shrSelect("setValue",params[2]);
			$("#elem4").val(params[3]);
		}
	}
	,addcalculateRuleDoc: function() {
		var docStr1= jsBizMultLan.atsManager_holidayProjectEdit_i18n_20+"\r\n"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_17+"\r\n"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_10+"\r\n"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_19+"\r\n"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_27+"\r\n"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_37
			+ '(0,"JQLX000001Y","'
			+ jsBizMultLan.atsManager_holidayProjectEdit_i18n_38
			+ '")';
		
		var docStr2 = jsBizMultLan.atsManager_holidayProjectEdit_i18n_21+"\r\n"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_17+"\r\n"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_7+"\r\n";
		
		$("#calculateRule_ruleName_down").find("a").eq(0).attr("title",docStr1);
		$("#calculateRule_ruleName_down").find("a").eq(1).attr("title",docStr2);
	}
	,addTips:function(){
		var that = this ;
		var descNode;
		var description ="";
		$("#ruleInfo").find(".groupTitle").css("display","inline-block");
		$("#ruleInfo").find(".groupTitle").after("<div id='calculateRuleTip'></div>")
		$("#calculateRuleTip").css("display","inline-block");
		
		description= jsBizMultLan.atsManager_holidayProjectEdit_i18n_22+"<br>"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_8+"<br>"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_12+"<br>"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_14+"<br>"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_28+"<br><br>"+
		
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_23+"<br>"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_9+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_11+"<br>"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_13+"<br>"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_15+"<br>"+
		jsBizMultLan.atsManager_holidayProjectEdit_i18n_29
		
		descNode = $("#calculateRuleTip");
		that.descNodeHtml(descNode,description);
		$(".tips-content").css("width","800px");
		$(".tips-content").css("height","320px");
		$(".tips-content").css("top","-320px");
		$(".tips-content").css("margin-left","5px");
		$(".tips-content").css("left","0");
		$(".tips-content").css("overflow-y","auto");
		$(".tips-content p").css("text-indent","0");
		$(".field-tips").css("margin-left","5px");
		
	}
	,descNodeHtml:function(descNode,description){
//		descNode.html(["<div class='field-tips' >",
//						"<div class='tips-icon' style='border:1px solid blue;color: blue;'>?</div>",
//						"<div class='tips-content'>","<p>",description,"</p>","</div>",
//						"</div>"].join(""));	
		descNode.html(["<div class='field-tips' >",
						"<div class='tips-icon'><img src='/shr/addon/orgnization/web/resource/tips_2.png'></div>",
						"<div class='tips-content'>","<p>",description,"</p>","</div>",
						"</div>"].join(""));
						
		$(".tips-icon img").mouseover(function(){
			$(this).attr('src',"/shr/addon/orgnization/web/resource/tips_2_hover.png");
		});
		$(".tips-icon img").mouseout(function(){
			$(this).attr('src',"/shr/addon/orgnization/web/resource/tips_2.png");
		});
	}
	
	,getViewDistributeUipk:function(){
		return "com.kingdee.eas.hr.ats.app.AttendanceProject.viewDistribute";
	}
});
