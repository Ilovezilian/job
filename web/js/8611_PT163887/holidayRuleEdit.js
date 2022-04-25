var _ruleDetail_num,_init_state = 0;
var _fixedValueHtml;
var _rangeHtml,_rangeViewHtml;
var _init_Val = 0 ;
shr.defineClass("shr.ats.HolidayRuleEdit", shr.ats.AtsMaintainBasicItemEdit, {
	initalizeDOM:function(){
		shr.ats.HolidayRuleEdit.superClass.initalizeDOM.call(this);
		var that = this;
		if(that.getOperateState() == "ADDNEW"){
			$('#delayDate').shrTextField("setValue", 0);
		}
		that.initHolidayDom() ;
		
		$('div[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_47 + '"]')
			.attr("title",jsBizMultLan.atsManager_holidayRuleEdit_i18n_40);

		that.showTips();
		that.addSocQueryTipA("tipsCal");
		// that.addSocQueryTipA("tipsConvert");
		// that.addSocQueryTipA("tipsStartDate");
		// that.addSocQueryTipA("tipsBase");
		// that.addSocQueryTipA("tipsEffectDate");
		// that.addSocQueryTipA("tipsDeductServe");
		// that.addSocQueryTipA("tipsCrossBUConvert");
				
		if(that.getOperateState() == "VIEW"){
			//自定义周期开始日期
			if($("#cycleType").attr("value")!=2){
				$("#cycleTypeCustomValue").closest('div[data-ctrlrole="labelContainer"]').hide();
			}
		}else if(that.getOperateState() == "EDIT"||that.getOperateState() == "ADDNEW"){
			that.initCycleTypeCustomDiv();
			$("#holidayType").shrPromptBox("option","subWidgetOptions.filter","id <> 'KN/5/LqHnUK92j2J0m/1Y2L9wxE='");
		}
		var crossBUConvertContainer = $("#isCrossBUConvertByEffdt").closest('div[data-ctrlrole="labelContainer"]');
		crossBUConvertContainer.find(".label-ctrl.flex-cc").css({'white-space':'nowrap'});
	}
	,initHolidayDom:function(){
	    var that = this;
		_ruleDetail_num = 0;
		var fixedValueContainer = $('#fixedValue').parents('div[data-ctrlrole="labelContainer"]');
		fixedValueContainer.addClass('fixedOrRange');
		$('#fixedValue').removeAttr("ctrlrole");
		 _fixedValueHtml = $('.fixedOrRange').clone();
		 $('#isFirstYearConvert').parents('div[data-ctrlrole="labelContainer"]').addClass('isFirstYearConvertHtml');
		 $('#firstYearConvertType').parents('div[data-ctrlrole="labelContainer"]').addClass('isFirstYearConvertHtml');
		 
		 // 编辑页面的范围值是的页面
		 _rangeHtml = '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1 fixedOrRange" style=""> '+
				'<div class="label-ctrl flex-cc">'+
				'<div class="field-label" title="'
			 + jsBizMultLan.atsManager_holidayRuleEdit_i18n_44
			 + '">'
			 + jsBizMultLan.atsManager_holidayRuleEdit_i18n_44
			 + '</div>'+
				'</div>'+
				'<div class="field-ctrl flex-c">'+
				'<input class="block-father input-height cursor-pointer" id="holidayRlStdType">'+
				'</input>'+
				'<script type="text/javascript">'+
				'$(function() {'+
				'var select_json = {'+
				'id: "holidayRlStdType",'+
				'readonly: "",'+
				'value: "",'+
				'onChange: null,'+
				'validate: "",'+
				'filter: ""'+
				'};'+
				'select_json.enumSource = "com.kingdee.eas.hr.ats.HolidayRlStdTypeEnum";'+
				'$("#holidayRlStdType").shrSelect(select_json);'+
				'});'+
				'</script>'+
				'</div>'+
				'</div>';
		 // 查看页面的范围值是的页面		
			_rangeViewHtml = '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1 fixedOrRange" style=""> '+
				'<div class="label-ctrl flex-cc">'+
				'<div class="field-label" title="'
                + jsBizMultLan.atsManager_holidayRuleEdit_i18n_44
				+ '">'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_44
				+ '</div>'
				+ '<div class="field-desc"></div>' + 
				'</div>'+
				'<div class="field-ctrl flex-c">'+
				'<span class="field_input" id="holidayRlStdType" ctrlrole="shrFieldDisplay" ></span>'+
				'</div>'+
				'</div>';	
					
		that.initDeal();
//		//增加参数说明弹出div
		that.addCaptionDiv();
		//值类型监听事件
		$('#valueType').bind('change',function(){
			that.valueTypeDeal();
		});
		//计算标准监听事件	
		$('#holidayRlStdType').live('change',function(){
			that.isShowFirstYearConvert(this.value);
			that.isShowCalcuteOurAgeStyle(this.value);
			that.showIsDeductWorkAdjustV(this.value);//工龄
			that.showIsDeductServeAdjustV(this.value);//司龄
			that.workServiceAgeDeal();
		});	
		
		//初始化完成	
		_init_state = 1;
		//自定义正整数校验
		jQuery.validator.addMethod("positiveinteger", function(value, element) {
			   var aint=parseInt(value);	
			    return aint>=0&& (aint+"")==value;   
	    }, jsBizMultLan.atsManager_holidayRuleEdit_i18n_52);
		$("#delayDate").attr("validate","{required:true,positiveinteger:true,maxlength:9,}");
		$('div[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_24 + '"]').parent().css("width","13.5%");
	}
	,initDeal:function(){
		var that = this;
		var calcuteLimitType_el ;
		var firstYearConvertType_el ;
		if(_init_state == 0)
		{
			calcuteLimitType_el = $("#calcuteLimitType_el").val();
			firstYearConvertType_el= $("#firstYearConvertType_el").val();
		}
		that.valueTypeDeal();
		//浏览视图
		if(that.getOperateState() == "VIEW"){
			// 计算标准 是 工龄的情况下
			var calType = $('#holidayRlStdType').html(); 
			if(calType ==jsBizMultLan.atsManager_holidayRuleEdit_i18n_62){  //计算标准为司龄，将入职首年工龄假期需 进行折算 掩藏
				$('.isFirstYearConvertHtml').hide();
			}else{
				// $('#calcuteOurAgeStyle').closest('.row-fluid').children().eq(1).hide()  //不是司龄，司龄计算准则隐藏
				if($("#isFirstYearConvert").val() == 0)
				{
					$('#firstYearConvertType').closest('div[data-ctrlrole="labelContainer"]').hide();
					$('#calcuteOurAgeStyle').parents('div[data-ctrlrole="labelContainer"]').hide();
					if(calType ==jsBizMultLan.atsManager_holidayRuleEdit_i18n_34){ 
						$('#calcuteOurAgeStyle').closest('.row-fluid').children().eq(1).hide();  
					}
					
				}
			}
			var ItemsJson = that.getItemsJosn();
			for(var i = 0;i<ItemsJson.rows.length;i++){
				_ruleDetail_num = _ruleDetail_num + 1 ;
				var value_type = $('#valueType').val();
				if(value_type=="0"){
					that.showConditionRuleHtml(ItemsJson.rows[i],_ruleDetail_num);
					that.setBlankConditionDetailIsRemove();
				}else if(value_type=="1"){
					that.showItemHtml(ItemsJson.rows[i],_ruleDetail_num);
					that.workServiceAgeDeal();
					that.setBlankItemIsRemove(_ruleDetail_num);
				}
			}
			
			if($("#holidayEffecDateType").val()==3){
				$("#holidayEffecDateType").html(shr.formatMsg(jsBizMultLan.atsManager_holidayRuleEdit_i18n_54,[atsMlUtile.getFieldOriginalValue("customValue")]));
			}
		}else if(that.getOperateState() == "ADDNEW"&&shr.getUrlParam("method")!="copy"){
			that.changeItemLeftRight('isFirstYearConvert');
			//延期日期设置默认值
			$('#delayDate').shrTextField("setValue", 0);//@
			$("#holidayEffecDateType").trigger("change");
			
		}else if(that.getOperateState() == "EDIT"){
			//初始化完成	
			_init_Val = 1;
			$('#calcuteLimitType').shrSelect('setValue',calcuteLimitType_el);
			$('#firstYearConvertType').shrSelect('setValue',firstYearConvertType_el);  
			if(shr.getFieldValue('isFirstYearConvert') == 0)
			{
				$('#firstYearConvertType').closest('div[data-ctrlrole="labelContainer"]').hide();
				$('#calcuteOurAgeStyle').parents('div[data-ctrlrole="labelContainer"]').hide();
			}
			that.changeItemLeftRight('isFirstYearConvert');
			var ItemsJson = that.getItemsJosn();
			for(var i = 0;i<ItemsJson.rows.length;i++){
				var value_type_el = $('#valueType_el').val(); 
				if(value_type_el=="0"){
					_ruleDetail_num = _ruleDetail_num + 1 ;
					that.setConditionRuleHtml(ItemsJson.rows[i],_ruleDetail_num);
				}else if(value_type_el=="1"){
					_ruleDetail_num = _ruleDetail_num + 1 ;
					that.setItemHtml(ItemsJson.rows[i],_ruleDetail_num);
				}
			}
			$("#holidayEffecDateType").trigger("change");
		}
		
		//复制初始化分录
		if(shr.getUrlParam("method")=="copy"){
			//初始化完成	
			_init_Val = 1;
			$('#calcuteLimitType').shrSelect('setValue',calcuteLimitType_el);
			$('#firstYearConvertType').shrSelect('setValue',firstYearConvertType_el);  
			if(shr.getFieldValue('isFirstYearConvert') == 0)
			{
				$('#firstYearConvertType').closest('div[data-ctrlrole="labelContainer"]').hide();
				$('#calcuteOurAgeStyle').parents('div[data-ctrlrole="labelContainer"]').hide();
			}
			that.changeItemLeftRight('isFirstYearConvert');
			var ItemsJson = that.getItemsJosn();
			for(var i = 0;i<ItemsJson.rows.length;i++){
				var value_type_el = $('#valueType_el').val(); 
				if(value_type_el=="0"){
					_ruleDetail_num = _ruleDetail_num + 1 ;
					that.setConditionRuleHtml(ItemsJson.rows[i],_ruleDetail_num);
				}else if(value_type_el=="1"){
					_ruleDetail_num = _ruleDetail_num + 1 ;
					that.setItemHtml(ItemsJson.rows[i],_ruleDetail_num);
				}
			}
			$("#holidayEffecDateType").trigger("change");
		}
	}
	,setBlankConditionDetailIsRemove:function(){
		if($('#conditionDetail').find('div[name^="condition_item"]').length>0){
		}else{
			$('#conditionDetail').remove();
		}
	}
	,setBlankItemIsRemove:function(ruleDetail_num){
		if($('#condition_'+ruleDetail_num).find('div[name^="condition_item"]').length>0){
		}else{
			$('#condition_'+ruleDetail_num).remove();
		}
		if($('#workAge_'+ruleDetail_num).find('div[name^="work_item"]').length>0){
		}else{
			$('#workAge_'+ruleDetail_num).remove();
		}
		if($('#serviceAge_'+ruleDetail_num).find('div[name^="service_item"]').length>0){
		}else{
			$('#serviceAge_'+ruleDetail_num).remove();
		}
	}
	,setConditionRuleHtml:function(rule_items,ruleDetail_num){
		var that = this;
		var condition_num = 0;
			
		var head_condition_label='<div id="condition_'+ruleDetail_num+'"><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><input type="hidden" name="conditionGroupId"  /><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_74
			+ ' </span></div>'
				+ '<div class="span2"><i id="condition_add" class="icon-plus" style="padding:10px" ></i></div>'
				+ '</div></div>';	
					
		var html = 	head_condition_label ;
		
		var rule_item_label = '<div id = "rule_item_'+ruleDetail_num+'" class = "item_css"></div>';
		$('#conditionDetail').append(rule_item_label);
		$('#rule_item_'+ruleDetail_num).append(html);
		
		
		$('#condition_'+ruleDetail_num+' #condition_add').unbind('click').bind('click',function(){
			condition_num = condition_num + 1;
			that.addConditionHtml(ruleDetail_num,condition_num);
		});
		
		
		
		$('#rule_item_'+ruleDetail_num).find('input[name=conditionGroupId]').val(rule_items.id);
			for(var i=0;i<rule_items.ruleItems.length;i++){
				condition_num = condition_num + 1;
				that.addConditionHtml(ruleDetail_num,condition_num);
				that.setConditionHtml(rule_items.ruleItems[i],ruleDetail_num,condition_num);
			}
			
		
		that.workServiceAgeDeal();
		
			
	}
	,setItemHtml:function(rule_items,ruleDetail_num){
		var that = this;
			var workAge_num = 0;
			var serviceAge_num = 0;
			var condition_num = 0;
			
		var button_label = '<div class="row-fluid row-block " id=""> 	' +
				'<div id="" class="span12"> ' +
				'<span style="float: right;" > ' +
//				'<button id="delete_'+ruleDetail_num+'" type="button" name="delete" class="null shrbtn">删除</button>	' +
				'<i id="add_'+ruleDetail_num+'" class="icon-plus" style="padding:10px"></i>'+
				'<i id="delete_'+ruleDetail_num+'" class="icon-remove" style="padding:10px"></i>'+
				'</span> </div> ' +
				'</div>';
		var head_condition_label='<div id="condition_'+ruleDetail_num+'"><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><input type="hidden" name="conditionGroupId"  /><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_74
			+ ' </span></div>'
				+ '<div class="span2"><i id="condition_add" class="icon-plus" style="padding:10px" ></i></div>'
				+ '</div></div>';	
				
		var head_work_label='<div id="workAge_'+ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_35
			+ '</span></div>'
				+ '<div class="span2"><i id="workAge_add" class="icon-plus" style="padding:10px" ></i></div>'
				+ '</div></div>';	
		
		var head_service_label='<div  id="serviceAge_'+ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_63
			+ '</span></div>'
				+ '<div class="span2"><i id="serviceAge_add" class="icon-plus" style="padding:10px" ></i></div>'
				+ '</div></div>';	
				
		
					
		var html = 	button_label + head_condition_label + 	head_work_label + head_service_label;
		
		var rule_item_label = '<div id = "rule_item_'+ruleDetail_num+'" class = "item_css"></div>';
		$('#ruleDetail').append(rule_item_label);
		$('#rule_item_'+ruleDetail_num).append(html);
		
		$('#workAge_'+ruleDetail_num+' #workAge_add').unbind('click').bind('click',function(){
			workAge_num = workAge_num + 1;
			that.addWorkItem(ruleDetail_num,workAge_num);
		});
		
		$('#serviceAge_'+ruleDetail_num+' #serviceAge_add').unbind('click').bind('click',function(){
			serviceAge_num = serviceAge_num + 1;
			that.addServiceItem(ruleDetail_num,serviceAge_num);
		});
		
		$('#condition_'+ruleDetail_num+' #condition_add').unbind('click').bind('click',function(){
			condition_num = condition_num + 1;
			that.addConditionHtml(ruleDetail_num,condition_num);
		});
		
		$('#delete_'+ruleDetail_num).unbind('click').bind('click',function(){
			$(this).closest("div[id^='rule_item']").remove();
		});
		
		$('#add_'+ruleDetail_num).unbind('click').bind('click',function(){
			_ruleDetail_num = _ruleDetail_num + 1;
			that.addItemHtml(_ruleDetail_num);
		});
		
		
		$('#rule_item_'+ruleDetail_num).find('input[name=conditionGroupId]').val(rule_items.id);
			for(var i=0;i<rule_items.ruleItems.length;i++){
				condition_num = condition_num + 1;
				that.addConditionHtml(ruleDetail_num,condition_num);
				that.setConditionHtml(rule_items.ruleItems[i],ruleDetail_num,condition_num);
			}
			
			var work_object_array=[],service_object_array=[];
			
			for(var i=0 ;i<rule_items.items.length;i++){
				if(rule_items.items[i].tableNbr=="1"){
					work_object_array.push(rule_items.items[i]);
				}else if(rule_items.items[i].tableNbr=="2"){
					service_object_array.push(rule_items.items[i]);
				}
			}
			
			for(var i=0;i<work_object_array.length;i++){
				workAge_num = workAge_num + 1;
				that.addWorkItem(ruleDetail_num,workAge_num);
				that.setWorkItem(work_object_array[i],ruleDetail_num,workAge_num);
			}
			
			for(var j=0;j<service_object_array.length;j++){
				serviceAge_num = serviceAge_num + 1;
				that.addServiceItem(ruleDetail_num,serviceAge_num);
				that.setServiceItem(service_object_array[j],ruleDetail_num,serviceAge_num);
			}
			
		if($('#rule_item_'+ruleDetail_num).find('div[id^=work_item]').length==0){
			for(var i = 0;i<4;i++){
			workAge_num = workAge_num + 1;
			that.addWorkItem(ruleDetail_num,workAge_num);
			
			var pre,next,val;
			if(i==0){
				pre=0,next=1,val=0;
			}else if(i==1){
				pre=1,next=10,val=5;
			}else if(i==2){
				pre=10,next=20,val=10;
			}else if(i==3){
				pre=20,next=100,val=15;
			}
			
			$('#work_item_'+ruleDetail_num+'_'+workAge_num+' input[name="pre"]').val(pre);
			$('#work_item_'+ruleDetail_num+'_'+workAge_num+' input[name="next"]').val(next);
			$('#work_item_'+ruleDetail_num+'_'+workAge_num+' input[name="val"]').val(val);
			}
		}
		if($('#rule_item_'+ruleDetail_num).find('div[id^=service_item]').length==0){
			for(var i = 0;i<4;i++){
			serviceAge_num = serviceAge_num + 1;
			that.addServiceItem(ruleDetail_num,serviceAge_num);
			var pre,next,val;
			if(i==0){
				pre=0,next=1,val=0;
			}else if(i==1){
				pre=1,next=10,val=5;
			}else if(i==2){
				pre=10,next=20,val=10;
			}else if(i==3){
				pre=20,next=100,val=15;
			}
			
			
			$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' input[name="pre"]').val(pre);
			$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' input[name="next"]').val(next);
			$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' input[name="val"]').val(val);
			}
			
		}
		
		that.workServiceAgeDeal();
		
			
	}
	,setConditionHtml:function(ruleItems,ruleDetail_num,condition_num){
		var pre_prop_value = "prop_value_"+ruleDetail_num+'_'+condition_num;
		var filterInfo = eval('('+ruleItems.config+')');
//		var pre_id = $('#rule_item_'+ruleDetail_num+' #condition_'+condition_num);
		var pre_id = $('#condition_item_'+ruleDetail_num+'_'+condition_num); 
		$('#condition_item_'+ruleDetail_num+'_'+condition_num).find('input[name="conditionId"]').val(ruleItems.id);
		var prop_op_json = {id:"prop_op"};
		prop_op_json.data = [{value:"like",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_17},
		                    {value:"not like",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_20},
		                    {value:"=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_27},
		                    {value:"<>",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_21},
		                    {value:">",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_25},
		                    {value:"<",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_68}
		            		];
		
		var prop_op_date_json = {id:"prop_op"};
		prop_op_date_json.data = [{value:"=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_27},
		                    {value:"<>",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_21},
		                    {value:">",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_25},
		                    {value:"<",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_68},
		                    {value:">=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_26},
		                    {value:"<=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_69}
		            		];
		
		var prop_boolean_json = {id:"prop_op"};
		prop_boolean_json.data = [
		                    {value:"=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_27},
		                    {value:"<>",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_21}
		            		];
            		
		var demo = {name: filterInfo.label,field: filterInfo.name,type:filterInfo.type,enumSource:filterInfo.enumSource};
		var type = filterInfo.type;
		var enumSource = filterInfo.enumSource;
		var uipk = filterInfo.uipk;
		var name = filterInfo.label;
			
			var prop_op_ctrl = pre_id.find("#prop_op");
			var prop_value_ctrl =  pre_id.find("input[name='prop_value']");
			prop_op_ctrl.wrap("<div style='width:90px'></div>");
		if(type == "Date" || type == "TimeStamp"){
			prop_op_ctrl.shrSelect(prop_op_date_json);
			prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
			
			var picker_json = {};
			picker_json.id = pre_prop_value;
			prop_value_ctrl.shrDateTimePicker($.extend(picker_json,{ctrlType: type,isAutoTimeZoneTrans:false}));
			prop_value_ctrl.css("width","90px");
		}
		if(type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int"){
			prop_op_ctrl.shrSelect(prop_op_date_json);
			prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
		}
		if(type == "StringEnum" || type == "IntEnum"){
			
			prop_op_ctrl.shrSelect(prop_boolean_json);
			prop_op_ctrl.shrSelect("setValue", filterInfo.compareType);
			
			var select_json = {};
			select_json.id = pre_prop_value;
			select_json.enumSource = enumSource;
			prop_value_ctrl.shrSelect(select_json);
			prop_value_ctrl.css("width","90px");
		}
		if(type == "Boolean"){
			prop_op_ctrl.shrSelect(prop_boolean_json);
			prop_op_ctrl.shrSelect("setValue", prop_boolean_json.data[0].value);
			
			var select_json = {id:pre_prop_value};
			select_json.data = [{value:"1",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_58},
			                    {value:"0",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_32}
			            		];
			prop_value_ctrl.shrSelect(select_json);
			prop_value_ctrl.css("width","90px");
		}
		if(type == "String"){
			prop_op_ctrl.shrSelect(prop_op_json);
			prop_op_ctrl.shrSelect("setValue", prop_op_json.data[0].value);
			prop_value_ctrl.css("width","126px");
			prop_value_ctrl.attr("placeholder",jsBizMultLan.atsManager_holidayRuleEdit_i18n_29);
		}
		if(uipk!=null && uipk!="null" && uipk!="undefined"){
			var f7Json = {id:pre_prop_value,name:"prop_value"};
			/*if(value!=undefined
				&&value!=null
				&&value!=""){
			var f7FieldName = value.current.f7FieldName;
			if(f7FieldName!=undefined){
				f7Json.displayFormat = "{"+f7FieldName+"}";
				}
			}*/
			f7Json.subWidgetName = 'shrPromptGrid';
			f7Json.subWidgetOptions = {title:name,uipk:uipk,multiselect:true};
			prop_value_ctrl.shrPromptBox(f7Json);
			prop_value_ctrl.unbind("keydown.shrPromptGrid");
			prop_value_ctrl.unbind("keyup.shrPromptGrid");
			prop_value_ctrl.css("width","90px");
		}
		$(".select_field >div").addClass("search-emp-field");
		
			pre_id.find("#prop_field").attr('enumSource',enumSource);
			pre_id.find("#prop_field").val(filterInfo.label);
			pre_id.find("#prop_field").attr('prop_field',filterInfo.name);
			pre_id.find("#prop_field").attr('title',filterInfo.label);
			pre_id.find("#prop_field").addClass("input-height");
		    pre_id.find("#prop_field").attr('field_type',filterInfo.type);
			pre_id.find("input[name='prop_op_el']").val(filterInfo.compareType);
			pre_id.find("input[name='prop_op' ]").val(filterInfo.compareTypeLabel);
			pre_id.find("input[name='prop_value_el']").val(filterInfo.value);
			pre_id.find("input[name='prop_value']").val(filterInfo.valueLabel);
			pre_id.find("input[name='prop_value']").attr('uipk',filterInfo.uipk);
		
		
	}
	,setWorkItem:function(work_item,ruleDetail_num,workAge_num){
		/*'<div id = "work_item_'+ruleDetail_num+'_'+workAge_num+'" class="row-fluid row-block row_field" style="width: 115%">'
				+ '<div class="span1"><span class="cell-RlStdType">工龄</span></div>'
				+ '<div class="span2"><input type="text" name="preCmpType" class="input-height cursor-pointer"  placeholder=""  "/></div>'
				+ '<div class="span2"><input type="hidden" name="itemId"  /><input type="text" name = "pre" class="input-height cell-input" /><span class="cell-lable">年</span></div>'
				+ '<div class="span2"><input type="text" name="nextCmpType"class="input-height cursor-pointer" dataextenal="" placeholder=""   "/></div>'
				+ '<div class="span2"><input type="text" name="next" class="input-height cell-input" /><span class="cell-lable">年</span></div>'
				+ '<div class="span2"><span class="cell-val">天数：</span><input type="text"  name = "val" class="input-height cell-input" /></div>'
				+ '<div class="span2"><i class="icon-remove" style="padding:10px"></i></div>'
			+ '</div>';*/
//		var pre_id = $('#rule_item_'+ruleDetail_num+' #workAge_'+workAge_num);
		var that = this;
		var pre_id = $('#work_item_'+ruleDetail_num+'_'+workAge_num);
		pre_id.find('input[name="pre"]').val(work_item.pre);
		pre_id.find('input[name="preCmpType_el"]').val(work_item.preCmpType);
		pre_id.find('input[name="preCmpType"]').val(that.getCmpType(work_item.preCmpType));
		pre_id.find('input[name="itemId"]').val(work_item.id);
		pre_id.find('input[name="next"]').val(work_item.next);
		pre_id.find('input[name="nextCmpType_el"]').val(work_item.nextCmpType);
		pre_id.find('input[name="nextCmpType"]').val(that.getCmpType(work_item.nextCmpType));
		pre_id.find('input[name="val"]').val(work_item.val);
		
	}
	,setServiceItem:function(service_item,ruleDetail_num,serviceAge_num){
		var that = this;
		var pre_id = $('#service_item_'+ruleDetail_num+'_'+serviceAge_num); 	
		pre_id.find('input[name="pre"]').val(service_item.pre);
		pre_id.find('input[name="preCmpType_el"]').val(service_item.preCmpType);
		pre_id.find('input[name="preCmpType"]').val(that.getCmpType(service_item.preCmpType));
		pre_id.find('input[name="itemId"]').val(service_item.id);
		pre_id.find('input[name="next"]').val(service_item.next);
		pre_id.find('input[name="nextCmpType_el"]').val(service_item.nextCmpType);
		pre_id.find('input[name="nextCmpType"]').val(that.getCmpType(service_item.nextCmpType));
		pre_id.find('input[name="val"]').val(service_item.val);
	}
	,showConditionRuleHtml:function(rule_items,ruleDetail_num){
		var that = this;
		
		var head_condition_label='<div id="condition_'+ruleDetail_num+'"><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_74
			+ ' </span></div>'
				+ '</div></div>';	
				
		var html = 	 head_condition_label ;
		
		var rule_item_label = '<div id = "rule_item_'+ruleDetail_num+'" class = "item_css"></div>';
		
		$('#conditionDetail').append(rule_item_label);
		$('#rule_item_'+ruleDetail_num).append(html);
		
		for(var i = 0 ; i<rule_items.ruleItems.length;i++){
		that.showConditionHtml(rule_items.ruleItems[i],ruleDetail_num);
		}
						
	}
	,showItemHtml:function(rule_items,ruleDetail_num){
		var that = this;
		
		var head_condition_label='<div id="condition_'+ruleDetail_num+'"><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_74
			+ ' </span></div>'
				+ '</div></div>';	
				
		var head_work_label='<div id="workAge_'+ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_35
			+ '</span></div>'
				+ '</div></div>';	
		
		var head_service_label='<div  id="serviceAge_'+ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_63
			+ '</span></div>'
				+ '</div></div>';	
		
				
		var html = 	 head_condition_label + 	head_work_label + head_service_label;
		
		var rule_item_label = '<div id = "rule_item_'+ruleDetail_num+'" class = "item_css"></div>';
		
		$('#ruleDetail').append(rule_item_label);
		$('#rule_item_'+ruleDetail_num).append(html);
		
		var work_object_array=[],service_object_array=[];
		for(var i=0 ;i<rule_items.items.length;i++){
			if(rule_items.items[i].tableNbr=="1"){
				work_object_array.push(rule_items.items[i]);
			}else if(rule_items.items[i].tableNbr=="2"){
				service_object_array.push(rule_items.items[i]);
			}
		}
		for(var i = 0 ; i<rule_items.ruleItems.length;i++){

		that.showConditionHtml(rule_items.ruleItems[i],ruleDetail_num);
		}
		for(var i = 0 ; i<work_object_array.length;i++){

		that.showWorkItem(work_object_array[i],ruleDetail_num);
		}
		for(var i = 0 ; i<service_object_array.length;i++){

		that.showServiceItem(service_object_array[i],ruleDetail_num);
		}
						
						
						
	}
	,getItemsJosn : function(){
		var holidayRuleId=$('#form #id').val()||'';
		var returnVal ;
		var copyItem  = "";
		//复制功能使用
		if($("#breadcrumb.breadcrumb")[0].baseURI){
			var baseUriMethod = $("#breadcrumb.breadcrumb")[0].baseURI.split("method=")[1];
			if(baseUriMethod.startsWith("copy")){
				copyItem = "copyItem";
			};
		}
		var data = {
					holidayRuleId:holidayRuleId,
					copyItem:copyItem,
					uipk:"com.kingdee.eas.hr.ats.app.HolidayRule.form"
		};
		shr.doAjax({
					url: shr.getContextPath()+"/dynamic.do?method=getItemsJson",
					dataType:'json',
					type: "POST",
					async:false,
					data: data,
					success: function(response){ 
						var rst= response||{};
						returnVal =  rst;
						
					}
				});	
		return returnVal;		
				
	}
	,showConditionHtml:function(ruleItems,ruleDetail_num){
		var that = this;
		var filterInfo = eval('('+ruleItems.config+')');
		var	con_tpl =  
			 	'<div id="condition_coll" name = "condition_coll">' +
					'<div name ="condition_item" class="row-fluid row-block row_field" style="width: 115%">'
				+ '<div class="span1"><span class="cell-RlStdType"></span></div>'
				+ '<div class="span2 field-ctrl">' 
				+ filterInfo.label
				+'</div>'
				+ '<div class="span2">'+filterInfo.compareTypeLabel+' </div>'
				+ '<div class="span2 field-ctrl">'+filterInfo.valueLabel+'</div>'
				+ '</div></div>';
		$("#condition_"+ruleDetail_num).append(con_tpl);
				
				
	}
	,showWorkItem:function(work_item,ruleDetail_num){
		var that = this;
		var row_fields_work = 
				 '<div name = "work_item" class="row-fluid row-block row_field" style="width: 115%">'
				+ '<div class="span1"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_34
			+ '</span></div>'
				+ '<div class="span1 field-ctrl">'+that.getCmpType(work_item.preCmpType)+'</div>'
				+ '<div class="span1"><span class="cell-input">'+work_item.pre
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_49
			+ '</span></div>'
				+ '<div class="span1 field-ctrl">'+that.getCmpType(work_item.nextCmpType)+'</div>'
				+ '<div class="span1"><span class="cell-input">'+work_item.next
			+jsBizMultLan.atsManager_holidayRuleEdit_i18n_49
			+ '</span></div>'
				+ '<div class="span2"><span class="cell-val">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_77
			+ '<span class="cell-input">'+work_item.val+'</span></div>'
				+ '</div>';
		$('#workAge_'+ruleDetail_num).append(row_fields_work);	
	}
	,showServiceItem:function(service_item,ruleDetail_num){
		var that = this;
		var row_fields_service = 
				 '<div name = "service_item" class="row-fluid row-block row_field" style="width: 115%">'
				+ '<div class="span1"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_62
			+ '</span></div>'
				+ '<div class="span1 field-ctrl">'+that.getCmpType(service_item.preCmpType)+'</div>'
				+ '<div class="span1"><span class="cell-input">'+service_item.pre
			+jsBizMultLan.atsManager_holidayRuleEdit_i18n_49
			+ '</span></div>'
				+ '<div class="span1 field-ctrl">'+that.getCmpType(service_item.nextCmpType)+'</div>'
				+ '<div class="span1"><span class="cell-input">'+service_item.next
			+jsBizMultLan.atsManager_holidayRuleEdit_i18n_49
			+ '</span></div>'
				+ '<div class="span2"><span class="cell-val">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_77
			+ '<span class="cell-input">'+service_item.val+'</span></div>'
				+ '</div>';
		$('#serviceAge_'+ruleDetail_num).append(row_fields_service);
	}
	,getCmpType:function(cmpType){
		if(cmpType==">"){
			return jsBizMultLan.atsManager_holidayRuleEdit_i18n_25;
		}else if(cmpType==">="){
			return jsBizMultLan.atsManager_holidayRuleEdit_i18n_26;
		}else if(cmpType=="<"){
			return jsBizMultLan.atsManager_holidayRuleEdit_i18n_68;
		}else if(cmpType=="<="){
			return jsBizMultLan.atsManager_holidayRuleEdit_i18n_69;
		}
		return "";
	}
	,fixedValueDeal:function(){
		var that = this;
		if((   (that.getOperateState() == "ADDNEW")//新增
			  &&($('#conditionDetail div[id^="condition"]').length==0)
			  ||((_init_state==1)&&(that.getOperateState() == "EDIT")&&($('#conditionDetail div[id^="condition"]').length==0))
			)
			&&(shr.getUrlParam("method")!="copy"))//复制
		  {
			_ruleDetail_num = _ruleDetail_num + 1;
			that.addFixedValueHtml(_ruleDetail_num);
		  }
		
	}
	,workServiceAgeDeal:function(){
		var that = this;
		var holidayRlStdType_el = $('#holidayRlStdType_el').val();
		var holidayRlStdType = $('#holidayRlStdType').val();
		
		if((_init_state==1)&&(that.getOperateState() != "VIEW")&&($('#ruleDetail div[id^="serviceAge"]').length==0)&&($('#ruleDetail div[id^="workAge"]').length==0)){
			_ruleDetail_num = _ruleDetail_num + 1;
			that.addItemHtml(_ruleDetail_num);
		}
		if(holidayRlStdType==1||holidayRlStdType_el==1){
			$('#ruleDetail div[id^="serviceAge"]').hide();
			$('#ruleDetail div[id^="workAge"]').show();
		}else if(holidayRlStdType==2||holidayRlStdType_el==2){
			$('#ruleDetail div[id^="workAge"]').hide();
			$('#ruleDetail div[id^="serviceAge"]').show();
		}else if(holidayRlStdType==3||holidayRlStdType_el==3){
			$('#ruleDetail div[id^="serviceAge"]').show();
			$('#ruleDetail div[id^="workAge"]').show();
		}
		
	}
	
	,valueTypeDeal:function(){ 
		var that = this;
		var valueType_el = $('#valueType_el').val();
		var valueType = $('#valueType').val();
		
		
		if(valueType==0||valueType_el==0){ // 固定值
			$('.fixedOrRange').replaceWith(_fixedValueHtml);
			$('#ruleDetail').hide();
			$('#conditionDetail').show();
			$('#ConvertType,#calcuteLimitType').parents('div[data-ctrlrole="labelContainer"]').hide();
			$('.isFirstYearConvertHtml').hide();
			
			$("#calcuteOurAgeStyle").closest('div[data-ctrlrole="labelContainer"]').hide();
			$("#firstYearConvertType").closest('div[data-ctrlrole="labelContainer"]').hide();

			//司龄调整值隐藏
			//工龄调整值隐藏
			if(that.getOperateState() == "VIEW"){
			$('#isDeductServeAdjustV').parent().parent().hide();
			$('#isDeductWorkAdjustV').parent().parent().hide();
			}else{
			$('#isDeductServeAdjustV').parent().parent().parent().hide();
			$('#isDeductWorkAdjustV').parent().parent().parent().hide();
			}
			that.fixedValueDeal();
		}else if(valueType==1||valueType_el==1){ //范围值
			if(that.getOperateState() == "VIEW"){
				$('.fixedOrRange').replaceWith(_rangeViewHtml);
				$('#holidayRlStdType').text($('#holidayRlStdTypeValue').text());
			}else{
				$('.fixedOrRange').replaceWith(_rangeHtml);
				var select_json = {
				id: "holidayRlStdType",
				readonly: "",
				value: "",
				onChange: null,
				validate: "",
				filter: ""
				};
				select_json.enumSource = "com.kingdee.eas.hr.ats.HolidayRlStdTypeEnum";
				$("#holidayRlStdType").shrSelect(select_json);
				setTimeout(function(){
				$('#holidayRlStdType').shrSelect("setValue", $('#holidayRlStdTypeElValue').text());
				}, 500 );
	//			$('#holidayRlStdTypeEl').val($('#holidayRlStdTypeElValue').text());
	//			$('#holidayRlStdType').val($('#holidayRlStdTypeValue').text());
			}
			/*
			$('#holidayRlStdType').attr('disabled',false);
			$('#holidayRlStdType').closest(".ui-select-frame").eq(0).removeClass("disabled");
			$('#holidayRlStdType').parent().next('.ui-select-icon').show();
			
			$('#fixedValue').attr('disabled',true);
			$('#fixedValue').closest(".ui-text-frame").eq(0).addClass("disabled");
			$('#fixedValue').val("");
			
			$('#fixedValue').closest(".row-fluid").eq(0).find('div[data-ctrlrole="labelContainer"]').eq(0).show();
			$('#holidayRlStdType').closest(".row-fluid").eq(0).find('div[data-ctrlrole="labelContainer"]').eq(1).hide();
			*/
			$('#ruleDetail').show();
			$('#conditionDetail').hide();
			$("#isFirstYearConvertHtml").show();
			// 折算方式
			$("#ConvertType").closest('div[data-ctrlrole="labelContainer"]').show();
			// 首次计算额度方式
			$("#calcuteLimitType").closest('div[data-ctrlrole="labelContainer"]').show();
			// 当值类型是范围时，是否折算要展示
			$('#isFirstYearConvert').closest('div[data-ctrlrole="labelContainer"]').show();
			
			//$('#isFirstYearConvert').closest(".row-fluid").eq(0).find('div[data-ctrlrole="labelContainer"]').hide();	
			/*
			$('#isFirstYearConvert').attr('disabled',false);
			$('#isFirstYearConvert').closest(".icheckbox_minimal-grey").eq(0).removeClass("disabled");
			$('#isFirstYearConvert').closest(".row-fluid").eq(0).find('div[data-ctrlrole="labelContainer"]').eq(0).show();
			$('.isFirstYearConvertHtml').show();
			
			$('#ConvertType').attr('disabled',false);
			$('#ConvertType').closest(".ui-select-inputframe").eq(0).removeClass("disabled");
			$('#ConvertType').closest(".row-fluid").eq(0).find('div[data-ctrlrole="labelContainer"]').eq(1).show();
			*/
			if(_init_state==1){ //表示默认的显示值  
				//默认选中工龄
				//$('#holidayRlStdType_el').val(1);
				//$('#holidayRlStdType').val("工龄");
				$('#holidayRlStdType').shrSelect('setValue',1);
				//折算方式 默认选中天
				$('#ConvertType').shrSelect('setValue',1);

				$('#calcuteLimitType').shrSelect('setValue',1);
				// 布尔类型
				$('.isFirstYearConvertHtml').find('.icheckbox_minimal-grey').removeClass('checked');
				$('#firstYearConvertType').closest('div[data-ctrlrole="labelContainer"]').hide();
				$('#calcuteOurAgeStyle').parents('div[data-ctrlrole="labelContainer"]').hide();
				//$('#ConvertType').val("天");
				//$('#ConvertType_el').val("1");
			}
			
			that.workServiceAgeDeal();
			$("#calcuteLimitType").bind("change", function(){
			    var calcuteLimitType = $("#calcuteLimitType_el").val();
				if(_init_state==0){
					//初始化时，值不随基准方式的改变而改变
				}else{
					if(calcuteLimitType == 2){
						$("#holidayEffecDateType").shrSelect("setValue", 2);
						$($("#holidayEffecDateType_down li")[0]).hide();
						$($("#holidayEffecDateType_down li")[1]).hide();
						$($("#holidayEffecDateType_down li")[3]).hide();
					}else{
						$("#holidayEffecDateType").shrSelect("setValue", 0);
						$($("#holidayEffecDateType_down li")[0]).show();
						$($("#holidayEffecDateType_down li")[1]).show();
						$($("#holidayEffecDateType_down li")[3]).show();
					}
				}			    
			});
			
			var holidayRlStdType = $('#holidayRlStdType').html()
			if(holidayRlStdType){
				
				if(holidayRlStdType==jsBizMultLan.atsManager_holidayRuleEdit_i18n_62){
					$('#isDeductWorkAdjustV').parent().parent().hide();
				}
			
				if(holidayRlStdType==jsBizMultLan.atsManager_holidayRuleEdit_i18n_34){
					$('#isDeductServeAdjustV').parent().parent().hide();
				}
			}
			
		}
		
		
		if(!$('#holidayRlStdType').val()){
			$('.fixedOrRange').find('.col-lg-6').html()
		}else if(!$('#holidayRlStdType').val()){
		}
		
		$("#holidayEffecDateType").bind("change", function(){
			$(".hEffecTypeC").remove();
			$("#customValueError").remove();
			if($("#holidayEffecDateType_el").val()!=3){
				$(this).parents('.ui-select-frame').css({width:'100%','margin-right':0});
				return;
			}
			var customHtml = '<div class="hEffecTypeC" style="width:70%">' +
									'<span class="field_label" title="i18n_53">i18n_53</span>' +
									'<input id="customValueInput" class="block-father input-height" type="text" placeholder dataextenal  name="customValueInput">' +
									'<span class="field_label" style="" title="i18n_33">i18n_33</span>' +
							 '</div>';
			customHtml = customHtml.replace(/i18n_53/g,jsBizMultLan.atsManager_holidayRuleEdit_i18n_53).replace(/i18n_33/g,jsBizMultLan.atsManager_holidayRuleEdit_i18n_33);
			$(this).parents('.field-ctrl.flex-c').append(customHtml);
			$(this).parents('.ui-select-frame').css({width:'30%','margin-right':0});
			$(function() {
				var text_json = {
					id:"customValueInput",
					name: "customValueInput",
					readonly: "",
					validate: "{maxlength:9,number:true,required:true}",
					onChange: null
				};
				$('#customValueInput').shrTextField(text_json);
				$('.hEffecTypeC span').css({'vertical-align':'middle',display:'inline-block','margin':'-15px 2px 0 2px'});
				$('.hEffecTypeC').css({margin:'-30px 0 0 31%'});
				$('#customValueInput').parents('.ui-text-frame ').css({display:'inline-block',width:'30px','margin-top':'7px'});
				$("#customValueInput").val($("#customValue").val() || 1);						
				$("#customValueInput").blur(function(){
					$("#customValueError").remove();
					var customValueErrorHtml = $('<label id="customValueError" for="customValueInput" generated="true" class="error" ></label>');
					if( $("#customValueInput").val()==""){
						$("#holidayEffecDateType").parents('.field-ctrl.flex-c').append(customValueErrorHtml.text(jsBizMultLan.atsManager_holidayRuleEdit_i18n_19));
						return;
					}
					var r = /^([1-9]|[1][0-1])$/;
					if( !r.test($("#customValueInput").val())){
						$("#holidayEffecDateType").parents('.field-ctrl.flex-c').append(customValueErrorHtml.text(jsBizMultLan.atsManager_holidayRuleEdit_i18n_51));
					}
				});
			});
		});
	}
	,myValidate:function(){
		var  that =  this ; 
		if($('#valueType_el').val()=='0'&&$('#fixedValue').val()==''){//@
			shr.showWarning({
				message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_41
			});
			return false;
		}
		if($("#calcuteLimitType_el").val()=='2'&& $("#holidayEffecDateType_el").val()!='2'){
			shr.showWarning({
				message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_55
			});
			return false;
		}
		if($("#customValueError").length>0){
			shr.showWarning({
				message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_61
			});
			return false;
		}
		
		if($('#ruleDetail').css('display')!='none'){

			var ruleDetail_pre = $('#ruleDetail');
			
			var condition_pre = ruleDetail_pre.find('div[id^="condition_item"]');
			// 员工范围 
			for(var i =0;i<condition_pre.length;i++)
			{
				if(condition_pre.eq(i).find('input[id="prop_field"]').val()==""
					||condition_pre.eq(i).find('input[name="prop_op"]').val()==""
					||condition_pre.eq(i).find('input[name="prop_value"]').val()==""){
						shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_75});
						return false;
					}
			}
			var holidayRlStdType_el = $('#holidayRlStdType_el').val();
			if(holidayRlStdType_el=="1"||holidayRlStdType_el=="3") // 只有是 工龄和 两者取大的时候才校验
			{
				// 工龄计算
				var work_pre = ruleDetail_pre.find('div[id^="work_item"]');
				if( work_pre.length == 0){
					shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_36});
					return false;
				}
				for(var i=0;i<work_pre.length;i++)
				{
					if(work_pre.eq(i).find('input[name="preCmpType_el"]').val()==''
					||work_pre.eq(i).find('input[name="preCmpType"]').val()==''
					||work_pre.eq(i).find('input[name="pre"]').val()==''
					||work_pre.eq(i).find('input[name="nextCmpType_el"]').val()==''
					||work_pre.eq(i).find('input[name="nextCmpType"]').val()==''
					||work_pre.eq(i).find('input[name="next"]').val()==''
					||work_pre.eq(i).find('input[name="val"]').val()=='')
					{
						shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_37});
						return false;
					}
				}
				if(!that.checkHolidayRlServiceAgeVal("workAge","work_item",jsBizMultLan.atsManager_holidayRuleEdit_i18n_38)){
					return false;
				}
			}
			if(holidayRlStdType_el=="2"||holidayRlStdType_el=="3"){ // 只有是 司龄和 两者取大的时候才校验
				var service_pre = ruleDetail_pre.find('div[id^="service_item"]');
				if( service_pre.length == 0){
					shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_64});
					return false;
				}
				// 司龄计算
				for(var i=0;i<service_pre.length;i++)
				{
					if(service_pre.eq(i).find('input[name="preCmpType_el"]').val()==''
					||service_pre.eq(i).find('input[name="preCmpType"]').val()==''
					||service_pre.eq(i).find('input[name="pre"]').val()==''
					||service_pre.eq(i).find('input[name="nextCmpType_el"]').val()==''
					||service_pre.eq(i).find('input[name="nextCmpType"]').val()==''
					||service_pre.eq(i).find('input[name="next"]').val()==''
					||service_pre.eq(i).find('input[name="val"]').val()=='')
					{
						shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_65});
						return false;
					}
				}
				if(!that.checkHolidayRlServiceAgeVal("serviceAge","service_item",jsBizMultLan.atsManager_holidayRuleEdit_i18n_66)){
					return false;
				}
				
			}
			
		}
		
			if($('#conditionDetail').css('display')!='none'){

			var ruleDetail_pre = $('#conditionDetail');
			
			var condition_pre = ruleDetail_pre.find('div[id^="condition_item"]');
			for(var i =0;i<condition_pre.length;i++){
				if(condition_pre.eq(i).find('input[id="prop_field"]').val()==""
				||condition_pre.eq(i).find('input[name="prop_op"]').val()==""
				||condition_pre.eq(i).find('input[name="prop_value"]').val()==""){
					shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_75});
					return false;
				}
			}
			
		}
		
		return true;
	}
	,checkHolidayRlServiceAgeVal:function(OutNode,itemNode,message){
		var flag = true ;
				//serviceAge_1
		//ruleDetail_pre.find('div[id^="serviceAge"]').each(function(){
		var outTimes = 0 ;
		
		$('#ruleDetail').find('div[id^='+OutNode+']').each(function(){
			var lastNodeVal = "";
			var lastNodeSign = "" ;
			 
			// lastNodeSign 只能是  <=  <
			if(!flag){
				return false;
			}
			var intTimes = 0 ; 
			$(this).find('div[id^='+itemNode+']').each(function(){
				if(!flag){
					return false;
				}
				var pre = parseInt($(this).find('input[name="pre"]').val());
				var next = parseInt($(this).find('input[name="next"]').val());
				var preSign = $(this).find('input[name="preCmpType_el"]').val();
				var nextSign = $(this).find('input[name="nextCmpType_el"]').val();
				
				if(lastNodeVal!="" && lastNodeSign!=""){ //第一个节点的时候 
					if(lastNodeVal>pre){ // 上个节点最后的值比当天最早的值大是不允许的
						//shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_66});
						shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_holidayRuleEdit_i18n_28, [outTimes + 1, intTimes + 1]) +message});
					 	flag =  false;
					}else if(lastNodeVal == pre){
						if(lastNodeSign=="<="){ // < 小于的话是可以的 则不需要判断
							if(preSign ==">="){ // // 上个节点最后的值比当天最早的值都可以等于是不允许的
								//shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_66});
								shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_holidayRuleEdit_i18n_28, [outTimes + 1, intTimes + 1])+message});
								flag =  false;
							}
						}
					}
				}
				
				if(pre<next){ // 合理  后者大于前者是对的
					lastNodeVal = next ;
					lastNodeSign = nextSign;
				}else if(pre == next){ // 两者相等的时候
					if(nextSign=="<"){
						shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_holidayRuleEdit_i18n_28, [outTimes+1, intTimes+1])+message});
						flag =  false;
					}else if(nextSign=="<=" && preSign==">"){
						shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_holidayRuleEdit_i18n_28,[outTimes+1,intTimes+1]) +message});
						flag =  false;
					}
				}else{ // 后者小于前者是绝对不行的 
						shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_holidayRuleEdit_i18n_28, [outTimes+1, intTimes+1]) +message});
						flag =  false;
				}
				intTimes ++ ;
			})
			outTimes ++ ;
		})
		return flag ;
	}
	,validate: function() {
		var workArea = this.getWorkarea(),
			$form = $('form', workArea);
		var that = this;
		//自己增加的校验	
		if(that.myValidate()){
		
		}else{
			return false;		
		}	
			
			
		// return $form.valid();
		var flag = $form.wafFormValidator("validateForm", true);
		if (!flag) {
			//var size = $form.data('validator').errorList.length;
			//固定值不是数字，提示出现了两次。
			var errorLabel = $("#fixedValue").parents().find('div[class="ui-text-frame"]').find("label");
			if(errorLabel!=null && errorLabel!==""){
			   errorLabel.remove();
			}
			shr.showWarning({
				message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_61,
				hideAfter: 5
			});
		}
		
		return flag;
	}
	,assembleSaveData: function(action) {
		var that = this;
		var data = that.prepareParam(action + 'Action');
		//自定义值保存
		atsMlUtile.setTransNumValue("customValue",atsMlUtile.getFieldOriginalValue("customValueInput"));
		
		//自定义额度周期值
		if($("#cycleType_el").val()==2 ){
			if($("#cycleTypeCustomValue").val() ==''){
				shr.showWarning({message: jsBizMultLan.atsManager_holidayRuleEdit_i18n_43});
				return;
			}
		}else {
			$("#cycleTypeCustomValue").val("");
		}
		
		var model = shr.assembleModel(that.fields, that.getWorkarea(), that.uuid);
		/////////
		if(model.valueType=="1"){
			model.holidayRlStdType = $("#holidayRlStdType").shrSelect('getValue').value;
		}
		//额外的data
		var rule_item = [];
		var valueType_el = $('#valueType_el').val();
		var valueType = $('#valueType').val();
		if(valueType_el=="1"||valueType=="1"){
		
		var rule_item_length = $('#ruleDetail div[id^="rule_item"]').length;
		for(var i = 0;i<rule_item_length;i++){
			var condition_item = [],work_service_item=[];
		    var pre_id = $('#ruleDetail div[id^="rule_item"]').eq(i).attr('id');
		    var conditionGroupId = $('#'+pre_id + ' input[name="conditionGroupId"]').val();
			var condition_item_length = $('#'+pre_id + ' div[id^="condition_item"]').length;
			for(var j = 0;j<condition_item_length;j++){
				var config = that.getFilterData($('#'+pre_id + ' div[id^="condition_item"]').eq(j).attr('id'));
				
				 var condition_item_one = {
				 		id:$('#'+pre_id + ' div[id^="condition_item"]').eq(j).find('input[name="conditionId"]').val(),
		 				number:j.toString(),
						config: JSON.stringify(config)
				 };
				 condition_item.push(condition_item_one);
			}
			
			
			var count_flag = $('#holidayRlStdType_el').val();
			var work_item_length = $('#'+pre_id + ' div[id^="work_item"]').length;
			if(count_flag=="1"||count_flag=="3"){
			for(var j = 0;j<work_item_length;j++){
				var work_item_one = that.getWorkData($('#'+pre_id + ' div[id^="work_item"]').eq(j).attr('id'));	
				work_service_item.push(work_item_one);
			}
			}
			
			var service_item_length = $('#'+pre_id + ' div[id^="service_item"]').length;
			if(count_flag=="2"||count_flag=="3"){
			for(var j = 0;j<service_item_length;j++){
				var service_item_one = that.getServiceData($('#'+pre_id + ' div[id^="service_item"]').eq(j).attr('id'));	
				work_service_item.push(service_item_one);
			}
			}
			var rule_item_json = 
				{
					id:conditionGroupId,
					ruleItems:work_service_item,
					items:condition_item
				};
			
			rule_item.push(rule_item_json);
			
		}
		
		}else if(valueType_el=="0"||valueType=="0"){
				var condition_item = [],work_service_item=[];
		    var pre_id = $('#conditionDetail div[id^="rule_item"]').attr('id');
		    var conditionGroupId = $('#'+pre_id + ' input[name="conditionGroupId"]').val();
			var condition_item_length = $('#'+pre_id + ' div[id^="condition_item"]').length;
			for(var j = 0;j<condition_item_length;j++){
				var config = that.getFilterData($('#'+pre_id + ' div[id^="condition_item"]').eq(j).attr('id'));
				
				 var condition_item_one = {
				 		id:$('#'+pre_id + ' div[id^="condition_item"]').eq(j).find('input[name="conditionId"]').val(),
		 				number:j.toString(),
						config: JSON.stringify(config)
				 };
				 condition_item.push(condition_item_one);
			}
			
			var rule_item_json = 
				{
					id:conditionGroupId,
					ruleItems:work_service_item,
					items:condition_item
				};
			
			rule_item.push(rule_item_json);
			
		}
		model.conditionItems=rule_item;
		/////////
		data.model = shr.toJSON(model);
		data.method = action;
		
		// relatedFieldId
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		
		//复制功能使用
		if($("#breadcrumb.breadcrumb")[0].baseURI){
			var baseUriMethod = $("#breadcrumb.breadcrumb")[0].baseURI.split("method=")[1];
			if(baseUriMethod.startsWith("copy")){
				data.model = data.model.replace(data.billId,"");
				data.billId = "";
			};
		}
		
		return data;
	}
		,getServiceData : function(service_item_id){
			var serviceInfo={
	 			id:$('#'+service_item_id).find("input[name = 'itemId']").val(),
				pre:$('#'+service_item_id).find("input[name = 'pre']").val(),
				preCmpType:$('#'+service_item_id).find("input[name = 'preCmpType_el']").val(),
				next:$('#'+service_item_id).find("input[name = 'next']").val(),
				nextCmpType:$('#'+service_item_id).find("input[name = 'nextCmpType_el']").val(),
				preNextUnit:"1",
				val:$('#'+service_item_id).find("input[name = 'val']").val(),
				valUnit:"1",
				tableNbr:"2" //!!!!!!!常与主表的holidayRlStdType对应
	 		}
			
			return serviceInfo;   
		
		}	
		,getWorkData : function(work_item_id){
			var workInfo={
	 			id:$('#'+work_item_id).find("input[name = 'itemId']").val(),
				pre:$('#'+work_item_id).find("input[name = 'pre']").val(),
				preCmpType:$('#'+work_item_id).find("input[name = 'preCmpType_el']").val(),
				next:$('#'+work_item_id).find("input[name = 'next']").val(),
				nextCmpType:$('#'+work_item_id).find("input[name = 'nextCmpType_el']").val(),
				preNextUnit:"1",
				val:$('#'+work_item_id).find("input[name = 'val']").val(),
				valUnit:"1",
				tableNbr:"1" //!!!!!!!常与主表的holidayRlStdType对应
	 		}
			
			return workInfo;   
		
		}	
		,getFilterData : function(condition_item_id){
				var filterInfo = {};
			
				if($('#'+condition_item_id).find("input[id = 'prop_field']").val()==undefined
				   ||$('#'+condition_item_id).find("input[id = 'prop_field']").val()==null
				   ||$('#'+condition_item_id).find("input[id = 'prop_field']").val()==""){
					return ;   	
				   }
				filterInfo.name = $('#'+condition_item_id).find("input[id = 'prop_field']").attr('prop_field');
				filterInfo.label = $('#'+condition_item_id).find("input[id = 'prop_field']").attr('title');
				filterInfo.compareType = $('#'+condition_item_id).find("input[name = 'prop_op_el']").val();
				filterInfo.compareTypeLabel = $('#'+condition_item_id).find("input[name = 'prop_op']").val();
				if($('#'+condition_item_id).find("input[name = 'prop_value_el']").val()==undefined
				   ||$('#'+condition_item_id).find("input[name = 'prop_value_el']").val()==null
				   ||$('#'+condition_item_id).find("input[name = 'prop_value_el']").val()==""){
   				    filterInfo.value = $('#'+condition_item_id).find("input[name = 'prop_value']").val();
				   }else{
					filterInfo.value = $('#'+condition_item_id).find("input[name = 'prop_value_el']").val();
				   }
   				filterInfo.uipk = $('#'+condition_item_id).find("input[name = 'prop_value']").attr('uipk');
				filterInfo.valueLabel = $('#'+condition_item_id).find("input[name = 'prop_value']").val();
				filterInfo.type = $('#'+condition_item_id).find("input[id = 'prop_field']").attr('field_type');
				filterInfo.enumSource = $('#'+condition_item_id).find("input[id = 'prop_field']").attr('enumSource');
		return filterInfo;	
		}
	,addFixedValueHtml:function(ruleDetail_num){
		var that = this;
		var head_condition_label='<div id="condition_'+ruleDetail_num+'"><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><input type="hidden" name="conditionGroupId"  /><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_74
			+ ' </span></div>'
				+ '<div class="span2"><i id="condition_add" class="icon-plus" style="padding:10px" ></i></div>'
				+ '</div></div>';	
		
		var html = 	head_condition_label ;
		
		var rule_item_label = '<div id = "rule_item_'+ruleDetail_num+'" class = "item_css"></div>';
		$('#conditionDetail').append(rule_item_label);
		$('#rule_item_'+ruleDetail_num).append(html);
		
		var condition_num = 0;
		
		
		$('#condition_'+ruleDetail_num+' #condition_add').unbind('click').bind('click',function(){
			condition_num = condition_num + 1;
			that.addConditionHtml(ruleDetail_num,condition_num);
		});
		
		
	}	
	,addItemHtml:function(ruleDetail_num){
		var that = this;
		var button_label = '<div class="row-fluid row-block " id=""> 	' +
				'<div id="" class="span12"> ' +
				'<span style="float: right;" > ' +
//				'<button id="delete_'+ruleDetail_num+'" type="button" name="delete" class="null shrbtn">删除</button>	' +
				'<i id="add_'+ruleDetail_num+'" class="icon-plus" style="padding:10px"></i>'+
				'<i id="delete_'+ruleDetail_num+'" class="icon-remove" style="padding:10px"></i>'+
				'</span> </div> ' +
				'</div>';
		var head_condition_label='<div id="condition_'+ruleDetail_num+'"><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><input type="hidden" name="conditionGroupId"  /><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_74
			+ ' </span></div>'
				+ '<div class="span2"><i id="condition_add" class="icon-plus" style="padding:10px" ></i></div>'
				+ '</div></div>';	
				
		var head_work_label='<div id="workAge_'+ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_35
			+ '</span></div>'
				+ '<div class="span2"><i id="workAge_add" class="icon-plus" style="padding:10px" ></i></div>'
				+ '</div></div>';	
		
		var head_service_label='<div  id="serviceAge_'+ruleDetail_num+'" ><div class="row-fluid row-block row_field">'
				+ '<div class="span2"><span class="">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_63
			+ '</span></div>'
				+ '<div class="span2"><i id="serviceAge_add" class="icon-plus" style="padding:10px" ></i></div>'
				+ '</div></div>';	
				
		
					
		var html = 	button_label + head_condition_label + 	head_work_label + head_service_label;
		
		var rule_item_label = '<div id = "rule_item_'+ruleDetail_num+'" class = "item_css"></div>';
		$('#ruleDetail').append(rule_item_label);
		$('#rule_item_'+ruleDetail_num).append(html);
		
		var workAge_num = 0;
		var serviceAge_num = 0;
		var condition_num = 0;
		
		
		
		$('#workAge_'+ruleDetail_num+' #workAge_add').unbind('click').bind('click',function(){
			workAge_num = workAge_num + 1;
			that.addWorkItem(ruleDetail_num,workAge_num);
		});
		
		$('#serviceAge_'+ruleDetail_num+' #serviceAge_add').unbind('click').bind('click',function(){
			serviceAge_num = serviceAge_num + 1;
			that.addServiceItem(ruleDetail_num,serviceAge_num);
		});
		
		$('#condition_'+ruleDetail_num+' #condition_add').unbind('click').bind('click',function(){
			condition_num = condition_num + 1;
			that.addConditionHtml(ruleDetail_num,condition_num);
		});
		
		$('#delete_'+ruleDetail_num).unbind('click').bind('click',function(){
			$(this).closest("div[id^='rule_item']").remove();
		});
		
		$('#add_'+ruleDetail_num).unbind('click').bind('click',function(){
			_ruleDetail_num = _ruleDetail_num + 1;
			that.addItemHtml(_ruleDetail_num);
		});
		
		if($('#rule_item_'+ruleDetail_num).find('div[id^=work_item]').length==0){
			for(var i = 0;i<4;i++){
			workAge_num = workAge_num + 1;
			that.addWorkItem(ruleDetail_num,workAge_num);
			
			var pre,next,val;
			if(i==0){
				pre=0,next=1,val=0;
			}else if(i==1){
				pre=1,next=10,val=5;
			}else if(i==2){
				pre=10,next=20,val=10;
			}else if(i==3){
				pre=20,next=100,val=15;
			}
			
			$('#work_item_'+ruleDetail_num+'_'+workAge_num+' input[name="pre"]').val(pre);
			$('#work_item_'+ruleDetail_num+'_'+workAge_num+' input[name="next"]').val(next);
			$('#work_item_'+ruleDetail_num+'_'+workAge_num+' input[name="val"]').val(val);
			}
		}
		if($('#rule_item_'+ruleDetail_num).find('div[id^=service_item]').length==0){
			for(var i = 0;i<4;i++){
			serviceAge_num = serviceAge_num + 1;
			that.addServiceItem(ruleDetail_num,serviceAge_num);
			var pre,next,val;
			if(i==0){
				pre=0,next=1,val=0;
			}else if(i==1){
				pre=1,next=10,val=5;
			}else if(i==2){
				pre=10,next=20,val=10;
			}else if(i==3){
				pre=20,next=100,val=15;
			}
			
			
			$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' input[name="pre"]').val(pre);
			$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' input[name="next"]').val(next);
			$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' input[name="val"]').val(val);
			}
			
		}
		
		that.workServiceAgeDeal();
		
	}
	,addWorkItem:function(ruleDetail_num,workAge_num){
		
		var prop_pre_json = { id:"preCmpType",
	    					 readonly: "",
	    					 value: ">=",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
		prop_pre_json.data = [{value:">",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_25},
		                    {value:">=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_26}
		            		];
		var prop_next_json = {id:"nextCmpType",
							 readonly: "",
	    					 value: "<",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
							};
		prop_next_json.data = [
		                    {value:"<",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_68},
		                    {value:"<=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_69}
		            		];
		var work_item_label = 
			 '<div id = "work_item_'+ruleDetail_num+'_'+workAge_num+'" class="row-fluid row-block row_field" style="width: 115%">'
				+ '<div class="span1"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_34
			+ '</span></div>'
				+ '<div class="span2"><input type="text" name="preCmpType" class="input-height cursor-pointer"  placeholder=""  "/></div>'
				+ '<div class="span2"><input type="hidden" name="itemId"  /><input type="text" name = "pre" class="input-height cell-input" /><span class="cell-lable">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_49
			+ '</span></div>'
				+ '<div class="span2"><input type="text" name="nextCmpType"class="input-height cursor-pointer" dataextenal="" placeholder=""   "/></div>'
				+ '<div class="span2"><input type="text" name="next" class="input-height cell-input" /><span class="cell-lable">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_49
			+ '</span></div>'
				+ '<div class="span2"><span class="cell-val">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_77
			+ '</span><input type="text"  name = "val" class="input-height cell-input" /></div>'
				+ '<div class="span2"><i class="icon-remove" style="padding:10px"></i></div>'
			+ '</div>';
		$('#workAge_'+ruleDetail_num).append(work_item_label);	
		
		$('#work_item_'+ruleDetail_num+'_'+workAge_num+' input[name=preCmpType]').shrSelect(prop_pre_json);    
		$('#work_item_'+ruleDetail_num+'_'+workAge_num+' input[name=nextCmpType]').shrSelect(prop_next_json);
		
		//删除
		$('#work_item_'+ruleDetail_num+'_'+workAge_num+' i[class="icon-remove"]').unbind('click').bind('click',function(){
			$(this).closest("div.row_field").remove();
		});
		
		
	}
	,addServiceItem:function(ruleDetail_num,serviceAge_num){
		
		var prop_pre_json = { id:"preCmpType",
	    					 readonly: "",
	    					 value: ">=",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
		prop_pre_json.data = [{value:">",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_25},
		                    {value:">=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_26}
		            		];
		var prop_next_json = {id:"nextCmpType",
							 readonly: "",
	    					 value: "<",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
							};
		prop_next_json.data = [
		                    {value:"<",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_68},
		                    {value:"<=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_69}
		            		];
		var work_item_label = 
			 '<div id = "service_item_'+ruleDetail_num+'_'+serviceAge_num+'" class="row-fluid row-block row_field" style="width: 115%">'
				+ '<div class="span1"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_62
			+ '</span></div>'
				+ '<div class="span2"><input type="text" name="preCmpType" class="input-height cursor-pointer"  placeholder=""  "/></div>'
				+ '<div class="span2"><input type="hidden" name="itemId"  /><input type="text"  name = "pre" class="input-height cell-input" /><span class="cell-lable">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_49
			+ '</span></div>'
				+ '<div class="span2"><input type="text" name="nextCmpType"class="input-height cursor-pointer" dataextenal="" placeholder=""   "/></div>'
				+ '<div class="span2"><input type="text" name="next" class="input-height cell-input" /><span class="cell-lable">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_49
			+ '</span></div>'
				+ '<div class="span2"><span class="cell-val">'
			+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_77
			+ '</span><input type="text"  name = "val" class="input-height cell-input" /></div>'
				+ '<div class="span2"><i class="icon-remove" style="padding:10px"></i></div>'
			+ '</div>';
		$('#serviceAge_'+ruleDetail_num).append(work_item_label);	
		
		$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' input[name=preCmpType]').shrSelect(prop_pre_json);    
		$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' input[name=nextCmpType]').shrSelect(prop_next_json);
		
		//删除
		$('#service_item_'+ruleDetail_num+'_'+serviceAge_num+' i[class="icon-remove"]').unbind('click').bind('click',function(){
			$(this).closest("div.row_field").remove();
		});
		
	}
		,addConditionHtml:function(ruleDetail_num,condition_num){
		
		var that = this;
		var pre_prop_value = "prop_value_"+ruleDetail_num+'_'+condition_num;
		var con_tpl =  
			'<div id ="condition_item_'+ruleDetail_num+'_'+condition_num+'" name = "condition_item" class="row-fluid row-block row_field" style="width: 115%">'
				+ '<div class="span1"><input type="hidden" name="conditionId"  /><span class="cell-RlStdType"></span></div>'
				+ '<div class="span2 field-ctrl">' 
				+ '<input name_value = "prop_field_html"/>' 
				+ '</div>'
				+ '<div class="span2"><input id="prop_op" type="text" name="prop_op" class="input-height cell-input" /></div>'
				+ '<div class="span2 field-ctrl"><input id='+pre_prop_value+' type="text" name="prop_value" class="input-height cursor-pointer" style="width:126px"></div>'
				+'<span class="span1 field_add" style="display: table-cell;width:126px"><i class="icon-remove" style="padding:10px"></i></span>'
				+ '</div>';
			$("#condition_"+ruleDetail_num).append(con_tpl);
			
			var tree_f7_json = {id:"prop_field",name:"prop_field"};
			
			var that = this;
			that.remoteCall({
				type:"post",
				async: false,
				method:"getFields",
				param:{handler:"com.kingdee.shr.ats.web.handler.HolidayRuleEditHandler"},
				success:function(response){
					_treeNode = response;
				}
			});
		
			tree_f7_json.subWidgetName = 'shrPromptTree';
			tree_f7_json.subWidgetOptions = 
				{
					treeSettings:{},
					width:250,
					zNodes : _treeNode
				};
		$("#condition_item_"+ruleDetail_num+"_"+condition_num+" input[name_value='prop_field_html']").shrPromptBox(tree_f7_json);
		that._addItemEventListener(ruleDetail_num,condition_num);
		
		//删除
		$('#condition_item_'+ruleDetail_num+'_'+condition_num+' i[class="icon-remove"]').unbind('click').bind('click',function(){
			$(this).closest("div.row_field").remove();
		});
		
						
		
	}
		,_addItemEventListener:function(ruleDetail_num,condition_num){
			var pre_prop_value = "prop_value_"+ruleDetail_num+"_"+condition_num;
			var prop_op_json = {id:"prop_op"};
			prop_op_json.data = [{value:"like",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_17},
			                    {value:"not like",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_20},
			                    {value:"=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_27},
			                    {value:"<>",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_21},
			                    {value:">",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_25},
			                    {value:"<",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_68}
			            		];
			
			var prop_op_date_json = {id:"prop_op"};
			prop_op_date_json.data = [{value:"=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_27},
			                    {value:"<>",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_21},
			                    {value:">",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_25},
			                    {value:"<",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_68},
			                    {value:">=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_26},
			                    {value:"<=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_69}
			            		];
			
			var prop_boolean_json = {id:"prop_op"};
			prop_boolean_json.data = [
			                    {value:"=",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_27},
			                    {value:"<>",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_21}
			            		];
			$('input[id="prop_field"]').shrPromptBox("option",{onchange:function(e,value){
//				$(this).parents(".ui-promptBox-frame").next().replaceWith('<input id="prop_op" type="text" name="prop_op" class="search-input-length input-height"/>');
				$(this).parents("div[name='condition_item']").find(".span2").eq(1).children().replaceWith('<input id="prop_op" type="text" name="prop_op" class="input-height cell-input">');
				$(this).parents("div[name='condition_item']").find(".span2").eq(2).children().replaceWith('<input id='+pre_prop_value+' type="text" name="prop_value" class="input-height cursor-pointer" style="width:126px">');
				var prop_op_ctrl =  $(this).closest('.row-fluid').find('input[id="prop_op"]');
				var prop_value_ctrl =  $(this).closest('.row-fluid').find('input[id^="prop_value"]');
				prop_op_ctrl.wrap("<div style='width:90px'></div>");
				$(this).addClass("input-height");
				if(value.current != null){
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
					}
					if(type == "Date" || type == "TimeStamp"){
						prop_op_ctrl.shrSelect(prop_op_date_json);
						prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
						
						var picker_json = {};
						picker_json.id = pre_prop_value;
						prop_value_ctrl.shrDateTimePicker($.extend(picker_json,{ctrlType: type,isAutoTimeZoneTrans:false}));
						prop_value_ctrl.css("width","90px");
					}
					if(type == "Short" || type == "Double" || type == "BigDecimal" || type == "Integer" || type == "Long" || type == "Float" || type == "Int"){
						prop_op_ctrl.shrSelect(prop_op_date_json);
						prop_op_ctrl.shrSelect("setValue", prop_op_date_json.data[0].value);
					}
					if(type == "StringEnum" || type == "IntEnum"){
						prop_op_ctrl.shrSelect(prop_boolean_json);
						prop_op_ctrl.shrSelect("setValue", prop_boolean_json.data[0].value);
						
						var select_json = {};
						select_json.id = pre_prop_value;
						select_json.enumSource = enumSource;
						prop_value_ctrl.shrSelect(select_json);
						prop_value_ctrl.css("width","90px");
					}
					if(type == "Boolean"){
						prop_op_ctrl.shrSelect(prop_boolean_json);
						prop_op_ctrl.shrSelect("setValue", prop_boolean_json.data[0].value);
						
						var select_json = {id:pre_prop_value};
						select_json.data = [{value:"1",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_58},
						                    {value:"0",alias:jsBizMultLan.atsManager_holidayRuleEdit_i18n_32}
						            		];
						prop_value_ctrl.shrSelect(select_json);
						prop_value_ctrl.css("width","90px");
					}
					if(type == "String"){
						prop_op_ctrl.shrSelect(prop_op_json);
						prop_op_ctrl.shrSelect("setValue", prop_op_json.data[0].value);
						prop_value_ctrl.css("width","126px");
						prop_value_ctrl.attr("placeholder",jsBizMultLan.atsManager_holidayRuleEdit_i18n_29);
					}
					if(uipk!=null && uipk!="null" && uipk!="undefined"){
						var f7FieldName = value.current.f7FieldName;
						var f7Json = {id:pre_prop_value,name:"prop_value"};
						if(f7FieldName!=undefined){
							f7Json.displayFormat = "{"+f7FieldName+"}";
						}
						f7Json.subWidgetName = 'shrPromptGrid';
						f7Json.subWidgetOptions = {title:name,uipk:uipk,multiselect:true};
						prop_value_ctrl.shrPromptBox(f7Json);
						prop_value_ctrl.unbind("keydown.shrPromptGrid");
						prop_value_ctrl.unbind("keyup.shrPromptGrid");
						prop_value_ctrl.attr("placeholder","");
						prop_value_ctrl.attr("uipk",uipk);
						prop_value_ctrl.css("width","90px");
					}
					$(".select_field >div").addClass("search-emp-field");
					prop_op_ctrl.shrSelect("option",{onChange:function(e,value){
						$(this).parents(".ui-select-frame").removeClass("oe_focused");
						prop_value_ctrl.focus();
						if(type == "Boolean" || type == "StringEnum" || type == "IntEnum"){
							prop_value_ctrl.shrSelect("selectClick");
						}
					}});
					
				}
			}});
		}
		,changeItemLeftRight:function(item){
			var that = this;
			var leftItem = $('#'+item).parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-4').eq(0);
			var rightItem =  $('#'+item).parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-6').eq(0);
			
			// 去掉 脚本
			
			rightItem.find('script').remove();
			
			var leftHtml = leftItem.html();
			var rightHtml = rightItem.html();
			rightItem.html(leftHtml);
			leftItem.html(rightHtml);
			
			leftItem.addClass('field-ctrl');
			rightItem.removeClass('field-ctrl');
			
			leftItem.children('div').eq(0).css('float','right');
			rightItem.children('div').eq(0).css('float','left');
			
			//$('#isFirstYearConvert')
			$('#'+item).parents('div[data-ctrlrole="labelContainer"]').find('.icheckbox_minimal-grey').change(function(){
				var checked = $('#'+item).is(':checked');
				if(!checked){
					if(shr.getFieldValue('holidayRlStdType')!=3){
						$('#calcuteOurAgeStyle').parents('div[data-ctrlrole="labelContainer"]').hide();
					}
					$('#'+item).parents('div[data-ctrlrole="labelContainer"]').find('.icheckbox_minimal-grey').removeClass('checked');
					$('#'+item).attr('checked',false);
					$('#firstYearConvertType').closest('div[data-ctrlrole="labelContainer"]').hide();
				}else{
					$('#calcuteOurAgeStyle').parents('div[data-ctrlrole="labelContainer"]').show();
					$("#calcuteOurAgeStyle_el").attr("value","0");
					$("#calcuteOurAgeStyle").attr("value",jsBizMultLan.atsManager_holidayRuleEdit_i18n_59);
					
					$('#'+item).parents('div[data-ctrlrole="labelContainer"]').find('.icheckbox_minimal-grey').addClass('checked');
					$('#'+item).attr('checked',true)
					$('#firstYearConvertType').closest('div[data-ctrlrole="labelContainer"]').show();
					if($("#firstYearConvertType_el").val()==""||$("#firstYearConvertType_el").val()==undefined){
						$("#firstYearConvertType_el").val("1");
						$("#firstYearConvertType").val(jsBizMultLan.atsManager_holidayRuleEdit_i18n_67);
					}
				}
			});
			//  微调 位置  modify 2015/04/09
			$('#isFirstYearConvert').parent().css('margin-right','-18px');
		}
		
		,isShowFirstYearConvert:function(value){
			var that = this;
			if(value==jsBizMultLan.atsManager_holidayRuleEdit_i18n_34
				||value==jsBizMultLan.atsManager_holidayRuleEdit_i18n_31){//计算标准为工龄或两者取大
				$('.isFirstYearConvertHtml').show();
				//$('#calcuteLimitType').closest(".row-fluid").eq(0).find('div[data-ctrlrole="labelContainer"]').show();
				if(_init_Val == 1){
					_init_Val == 0;
				}else{
					$('#calcuteLimitType').shrSelect('setValue',1);
					$('#firstYearConvertType').shrSelect('setValue',1);      
				}

			}else{
				$('#isFirstYearConvert').closest(".icheckbox_minimal-grey").eq(0).removeClass("checked"); 
				$('.isFirstYearConvertHtml').hide(); 
				$("#calcuteOurAgeStyle_el").closest('div[data-ctrlrole="labelContainer"]').hide();
			}
			
		}
		,addCaptionDiv: function() {
		var that = this;
	    	$('div[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_18 + '"]').closest(".row-fluid").eq(0)
				.append('<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis2">'
					+'<div class="col-lg-4">'
					+'<div class="field_label" title="'
					+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_22
					+ '"><a id = "caption" href="#">'
					+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_22
					+ '</a></div>'
					+'</div></div>');
			
			$('#caption').live('click', that.reasonOnClick);
			$('body').append(that.getCaptionDivHtml());
	}
	 
	,getCaptionDivHtml: function() {		
		return ['<div id="caption_div" class="modal hide fade">',
				    '<div class="modal-header">',
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
						'<h5>'
						+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_30
						+ '</h5>',
					'</div>',
					'<div id="caption-content"  class="modal-body">',
					'</div>',
				'</div>'].join('');
	}
	/**
	 * 取卡规则场景示例
	 */
	,reasonOnClick: function() {
        /** 有其它语言再加吧*/
        if ("en_US" == contextLanguage) {
            document.location.href = "/shr/addon/attendmanage/web/resource/holidayLimitRule_example_EN.docx";
        } else {
            document.location.href = "/shr/addon/attendmanage/web/resource/holidayLimitRule_example.docx";
        }
	}
	
	
	,showIsDeductWorkAdjustV:function(value){//工龄
			var that = this;
			if(value==jsBizMultLan.atsManager_holidayRuleEdit_i18n_34
				||value==jsBizMultLan.atsManager_holidayRuleEdit_i18n_31){
				$('#isDeductWorkAdjustV').parent().parent().parent().hide().show();
			}else if(value=jsBizMultLan.atsManager_holidayRuleEdit_i18n_62){
				$('#isDeductWorkAdjustV').parent().parent().parent().hide();
				
			}
			
		}
	,showIsDeductServeAdjustV:function(value){//司龄
			var that = this;
			if(value==jsBizMultLan.atsManager_holidayRuleEdit_i18n_62
				||value==jsBizMultLan.atsManager_holidayRuleEdit_i18n_31){
				$('#isDeductServeAdjustV').parent().parent().parent().hide().show();
			}else if(value==jsBizMultLan.atsManager_holidayRuleEdit_i18n_34){
				$('#isDeductServeAdjustV').parent().parent().parent().hide();
			}
			
		}
	
	,isShowCalcuteOurAgeStyle:function(value){
			var that = this;
			if(value==jsBizMultLan.atsManager_holidayRuleEdit_i18n_34 && shr.getFieldValue("isFirstYearConvert")==0){
				$('#calcuteOurAgeStyle').parents('div[data-ctrlrole="labelContainer"]').hide();
			}else{
//				$('#calcuteOurAgeStyle').closest('.row-fluid').children().eq(1).hide().show();
				$('#calcuteOurAgeStyle').parents('div[data-ctrlrole="labelContainer"]').show();
			}
		}
		
	/**
	 * 添加tips说明
	 */	
	,showTips:function(){
			
			$('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_44 + '"]')
				.append('<span id="tipsCal"></span>');
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_76 + '"]')
			// 	.append('<span id="tipsConvert"></span>');
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_50 + '"]')
			// 	.append('<span id="tipsStartDate"></span>');
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_42 + '"]')
			// 	.append('<span id="tipsBase"></span>');
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_60 + '"]')
			// 	.append('<span id="tipsEffectDate"></span>');
			
		  //   //新增两个问号需求
			// //BT1265379  【8.5 SP1功能测试】额度规则说明，武哥后面加的“扣除司龄调整值”参数也在后面加一个问号说明。
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_40 + '"]')
			// 	.append('<span id="tipsDeductServe"></span>');
			
			// //BT1265375 【8.5 SP1功能测试】额度规则说明，武哥后面加的“按跨业务组织调动的生效日期折算”参数也在后面加一个问号说明。
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_13 + '"]')
			// 	.append('<span id="tipsCrossBUConvert"></span>');
		
			//var calcuteBenchmarkEle = $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_44 + '"]').next();
			var convertWayEle = $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_76 + '"]').next();
			var startDateCalcuteBenchmarkEle = $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_50 + '"]').next();
			var benchmarkWayEle = $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_42 + '"]').next();
			var firstEffectiveDateEle = $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_60 + '"]').next();
			var checkEle1 = $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_40 + '"]').next();
			var checkEle2 = $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_13 + '"]').next();

			var isSameRuleEle = $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_NX_2 + '"]').next();
			var tipsCalText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_0+"<br/>"
				+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_6+"<br/>"
				+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_8;
			
			var tipsConvertText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_71+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_57+"<br/>"
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_48+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_1+"<br/>"
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_15+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_5+"<br/>"
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_16+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_9+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_12;

			var tipsStartDateText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_70+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_45+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_2 + "</br>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_7+ "</br>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_10;
			
			var tipsBaseText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_72+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_3+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_4+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_11;
			
			var tipsEffectDateText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_46+"<br/>"
			+'&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_56;
			
			var tipsIsSameRuleText =  '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_NX_1;
			
			var tipsDeductServeText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_14+"<br/>"
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_78+"<br/>"
				+ jsBizMultLan.atsManager_holidayRuleEdit_i18n_39+"<br/>";
			
			var tipsCrossBUConvertText = jsBizMultLan.atsManager_holidayRuleEdit_i18n_73;

			var tipsCalLog = '<div id="tipsCal-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;min-height:100px;position:absolute;left:47%;z-index:1;margin-top:0px;background: aliceblue;padding:5px;"><div><font color="gray">'+tipsCalText+'</font></div></div>';
			// //页面右侧
			// var tipsConvertLog = '<div id="tipsConvert-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;min-height:250px;position:absolute;left:55%;z-index:1;margin-top:0px;background: aliceblue;padding:5px;"><div><font color="gray">'+tipsConvertText+'</font></div></div>';
			// var tipsBaseLog = '<div id="tipsBase-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;min-height:100px;position:absolute;left:20%;z-index:1;margin-top:0px;background: aliceblue;padding:5px;"><div><font color="gray">'+tipsBaseText+'</font></div></div>';
			
			// //页面左侧
			// var tipsStartDateLog = '<div id="tipsStartDate-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;min-height:200px;position:absolute;left:55%;z-index:1;margin-top:0px;background: aliceblue;padding:5px;"><div ><font color="gray">'+tipsStartDateText+'</font></div></div>';
			// var tipsEffectDateLog = '<div id="tipsEffectDate-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;min-height:100px;position:absolute;left:38%;z-index:1;margin-top:0px;background: aliceblue;padding:5px;"><div ><font color="gray">'+tipsEffectDateText+'</font></div></div>';
			// var tipsDeductServeLog = '<div id="tipsDeductServe-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;min-height:100px;position:absolute;left:20%;z-index:1;margin-top:0px;background: aliceblue;padding:5px;"><div ><font color="gray">'+tipsDeductServeText+'</font></div></div>';
			// var tipsCrossBUConvertLog = '<div id="tipsCrossBUConvert-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;min-height:100px;position:absolute;left:53%;z-index:1;margin-top:0px;background: aliceblue;padding:5px; white-space:normal; padding-left:10px; "><div><font color="gray">'+tipsCrossBUConvertText+'</font></div></div>';

			$(".fixedOrRange").after(tipsCalLog);
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_76 + '"]').after(tipsConvertLog);
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_50 + '"]').after(tipsStartDateLog);
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_42 + '"]').after(tipsBaseLog);
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_60 + '"]').after(tipsEffectDateLog);
			
			
			// //BT1265379  【8.5 SP1功能测试】额度规则说明，武哥后面加的“扣除司龄调整值”参数也在后面加一个问号说明。
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_40 + '"]').after(tipsDeductServeLog);
			
			// //BT1265375 【8.5 SP1功能测试】额度规则说明，武哥后面加的“按跨业务组织调动的生效日期折算”参数也在后面加一个问号说明。
			// $('[title="' + jsBizMultLan.atsManager_holidayRuleEdit_i18n_13 + '"]').after(tipsCrossBUConvertLog);
			convertWayEle.shrTooltip({content: tipsConvertText});
			startDateCalcuteBenchmarkEle.shrTooltip({content: tipsStartDateText});
			benchmarkWayEle.shrTooltip({content: tipsBaseText});
			firstEffectiveDateEle.shrTooltip({content: tipsEffectDateText});
			checkEle1.shrTooltip({content: tipsDeductServeText});
			checkEle2.shrTooltip({content: tipsCrossBUConvertText});
			checkEle2.find('.content').css({
				'top': '20px',
				'left': '-120px',
				'overflow-x': 'auto'
			});
			isSameRuleEle.shrTooltip({content: tipsIsSameRuleText});
		},
		// 添加 tips 说明（？图片显示以及隐藏）
		addSocQueryTipA: function(tip) {
			var _self = this;
			var tips = $("#"+tip);
		
			var tipLog = tip+"-dialog";
			tips.prop("title", "");
			tips.css({"display": "inline-block"});
			var tipsLayout = $("#"+tipLog);
			tips.hover(function(event){
				event.stopImmediatePropagation();
				event.returnValue = false;
				tipsLayout.stop(true,true).fadeIn()
			},function(event){
				event.stopImmediatePropagation();
				event.returnValue = false;
				tipsLayout.stop(true,true).fadeOut()
			})
		
	},
	//初始化月
	 initMonthSelect:function() {
			//季/月选择框值
			var dateValue=[], dataItems;
			for(var m=1;m<=12;m++){
				var dateStr = m;
				if(m<10){
					dateStr = "0"+m;
				}
				dataItems={"value":dateStr, "alias":dateStr};
				dateValue.push(dataItems);
			}
			dateRange_json = {
				id: "monthStr",
				readonly: "",
				value: "01",
				onChange: null,
				data : dateValue ,
				validate: "{required:true}",
				filter: ""
			};
			$('#monthStr').shrSelect(dateRange_json);
	 }
	//初始化天
	 ,initDaySelect : function(month){
			var dateItem, dayValue = [];
			var dayRange = 31;
			if(month && month != ""){
				switch(month) {
				     case "02":
				        dayRange = 28;
				        break;
				     case "04":
				        dayRange = 30;
				        break;
				     case "06":
				        dayRange = 30;
				        break;
				     case "09":
				        dayRange = 30;
				        break;
				     case "11":
				        dayRange = 30;
				        break;
				     default:
				        dayRange = 31;
				} 
			}
			for(var i=1;i<=dayRange;i++){   
				var dayStr = i;
				if(i<10){
					dayStr = "0"+i;
				}
				dateItem={"value":dayStr, "alias":dayStr };
				dayValue.push(dateItem);
			}
			var dayStr_json = {
				id: "dayStr",
				readonly: "",
				value: "01",
				onChange: null,
				data : dayValue ,
				validate: "{required:true}",
				filter: ""
			};
			$('#dayStr').shrSelect(dayStr_json);
	 },
	resetDaySelect : function(){
	 	$('#timeDiv').empty();
	 	$('#timeDiv').append("<input id='dayStr' style='width: 30px;margin-left:10px !important'  class='input-height cell-input' type='text'></input>");
	}
	,
	initCycleTypeCustomDiv : function(){
		var that = this;
		//change
		$('#cycleType').change(function(){
			if($("#cycleType_el").val() == "2"){
				$("#cycleTypeCustomValue").closest('div[data-ctrlrole="labelContainer"]').show()
				$("#cycleTypeCustomValue").attr("validate","{required:true}");
			}else {
				$("#cycleTypeCustomValue").attr("validate","{required:false}");
				$("#cycleTypeCustomValue").closest('div[data-ctrlrole="labelContainer"]').hide();
			}
		});
		
		if(that.getOperateState() == "ADDNEW"){
			$("#cycleTypeCustomValue").closest('div[data-ctrlrole="labelContainer"]').hide();
		}else if(that.getOperateState() == "EDIT"){
			if($("#cycleType_el").val()==2){
				$("#cycleTypeCustomValue").closest('div[data-ctrlrole="labelContainer"]').show();
				$("#cycleTypeCustomValue").attr("validate","{required:true}");
			}else {
				$("#cycleTypeCustomValue").attr("validate","{required:false}");;
				$("#cycleTypeCustomValue").closest('div[data-ctrlrole="labelContainer"]').hide();
			}
		}
	 }
	
});	