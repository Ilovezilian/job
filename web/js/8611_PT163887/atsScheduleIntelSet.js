//变动规则基类js

shr.defineClass("shr.ats.atsScheduleIntelSet", shr.framework.Edit, {
	initalizeDOM : function () {
		shr.ats.atsScheduleIntelSet.superClass.initalizeDOM.call(this);
		var _self = this;
		if(_self.getOperateState() == 'EDIT'){
			$('#hrOrgUnit').shrPromptBox('disable');
		}
		if(_self.getOperateState() == 'ADDNEW'){
			$("#automatic").shrCheckbox("check");
		}
		_self.myExtendValidate();//使用自定义的校验扩展校验 
		$('#frontDate').attr("validate","{maxlength:9,required:true,number:true,my24Vldt:true}");
		// 隐藏常用参数控制和其他规则说明
		$("#form").nextAll().filter("div").css({display:"none"})
		// 初始化页面
		_self.initPCRuleMultDom();
		_self.initInformation();
		// 考勤业务组织字段添加placeholder提示
		$("#hrOrgUnit").attr("placeholder",jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_6)
		if($("#breadcrumb").children().length ==4){
		var list=document.getElementById("breadcrumb");
		list.removeChild(list.childNodes[3]);
		}
		if($("#breadcrumb").children().length ==2){
		$("#breadcrumb").find(".homepage").after('<li><a href="/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsScheduleIntelSet.list&serviceId='+shr.getUrlParam("serviceId")+'&inFrame=true">' +
			jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_5 +
			'</a> <span class="divider">/</span></li>');
		}
		if($("#breadcrumb").children().length ==3){
			if($($("#breadcrumb").find("a")[1]).html()==$("#breadcrumb").find(".active").html()){
			var list=document.getElementById("breadcrumb");
			list.removeChild(list.childNodes[2]);
			$("#breadcrumb").find(".homepage").after('<li><a href="/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsScheduleIntelSet.list&serviceId='+shr.getUrlParam("serviceId")+'&inFrame=true">' +
				jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_5 +
				'</a> <span class="divider">/</span></li>');
			}
		}
	},initInformation:function(){
		var html=''
		+ '<div class="row-fluid row-block"  title="'
		+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21
		+ '">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_0 
		+ '</div>'
		+ '<div class="row-fluid row-block" title="' 
		+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
		+ '">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_1 
		+ '</div>'
		+ '<div class="row-fluid row-block"  title="' 
		+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
		+ '">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_2 
		+ '</div>'
		+ '<div class="row-fluid row-block"  title="' 
		+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
		+ '">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_3 
		+ '</div>'
		+ '<div class="row-fluid row-block"  title="' 
		+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
		+ '">' 
		+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_4 
		+ '</div>'
		$("#information").append(html);
	}
	,initPCRuleMultDom:function(){
	
		var html=''
			+ '<div class="row-fluid row-block" id="isHandCopyShowOrHide" >'
			+ '<span title="">' 
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_10  ,[
				'</span>'
				+ '<div class="w100"><input id="intervalTime" name="intervalTime" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24
				+ '"></div>'
				+ '<span title="">'
			])
			+ '</span>'
			+ '</div>'
			+ '<div><input style="float:left;"  id="sameCard" name="sameCard" value="1"  type="checkBox" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<div style=" text-align: left;padding-left: 10px;" class="field_label" title="">'
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_23
			+ '</div></div>'
			+ '<div><input style="float:left;"  id="isHandCopy" name="isHandCopy" value="1"  type="checkBox" validate="" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '<div style=" text-align: left;padding-left: 10px;" class="field_label" title="">'
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_22
			+ '</div></div>'


			+ '<div class="row-fluid row-block" id="turnShiftClick">'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
			+ '">' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_9 
			+ '</span>'
			+ '<div class="w100 "><input id="atsShiftSegment1" name="atsShiftSegment1" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24 
			+ '"></div>'		
			+ '<span  class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_11 
			+ '"></span>'	
			+ '<div class="w100"><input id="atsShiftSegment2" name="atsShiftSegment2" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24 
			+ '"></div>'
			+ '<span class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_28 
			+ '"></span>'
			+ '<div class="w100"><input id="atsShiftSegment3" name="atsShiftSegment3" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24 
			+ '"></div>'	
			+'</div>'



			+ '<div class="row-fluid row-block" id="turnShiftClick">'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
			+ '">' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_8 
			+ '</span>'
			+ '<div class="w100"><input id="atsShiftSegment4" name="atsShiftSegment4" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24 
			+ '"></div>'
			+ '<span  class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_11 
			+ '"></span>'
			+ '<div class="w100"><input id="atsShiftSegment5" name="atsShiftSegment5" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24 
			+ '"></div>'
			+ '<span class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_28 
			+ '"></span>'
			+ '<div class="w100"><input id="atsShiftSegment6" name="atsShiftSegment6" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24 
			+ '"></div>'
			+'</div>'


			+ '<div class="row-fluid row-block" id="turnShiftClick">'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
			+ '">' 
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_7,[4])
			+ '</span>'
			+ '<div class="w100"><input id="atsShiftSegment7" name="atsShiftSegment7" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24 
			+ '"></div>'
			+ '<span class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_11 
			+ '"></span>'
			+ '<div class="w100"><input id="atsShiftSegment8" name="atsShiftSegment8" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24 
			+ '"></div>'
			+ '<span class="rightArrow" title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_28 
			+ '"></span>'
			+ '<div class="w100"><input id="atsShiftSegment9" name="atsShiftSegment9" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24 
			+ '"></div>'
			+'</div>'


			+ '<div style=" text-align: left;" class="field_label" title="">'
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_30
			+ ' </div>'

			+ '<div class="row-fluid row-block" >'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
			+ '">' 
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_19,[
				'</span>'
				+ '<div class="w120"><input id="atsShiftRest" name="atsShiftRest" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24
				+ '"></div>'
				+ '<span  title="'
				+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21
				+ '">'
			])
			+ '</span>'
			+ '</div>'
			+ '<div class="row-fluid row-block" >'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
			+ '">' 
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_17 ,[
				'</span>'
				+ '<div class="w120"><input id="atsShiftLegal" name="atsShiftLegal" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24
				+ '"></div>'
				+ '<span title="'
				+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21
				+ '">'
			])
			+ '</span>'
			+ '</div>'
			+ '<div class="row-fluid row-block" >'
			+ '<span title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
			+ '">' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_18 
			+ '</span>'
			+ '</div>'

			+ '<div class="row-fluid row-block" >'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
			+ '">' 
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_16 ,[
				'</span>'
				+ '<div class="w120"><input id="atsWorkRest" name="atsWorkRest" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24
				+ '"></div>'
				+ '<span  title="'
				+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21
				+ '">'
			])
			+ '</span>'
			+ '</div>'

			+ '<div class="row-fluid row-block" >'
			+ '<span  title="' 
			+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21 
			+ '">' 
			+ shr.formatMsg(jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_15,[
				'</span>'
				+ '<div class="w120"><input id="atsLegalShift" name="atsLegalShift" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title="" placeholder="'
				+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_24
				+ '"></div>'
				+ '<span  title="'
				+ jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_21
				+ '">'
			])
			+ '</span>'
		+ '</div>'
		$("#turnShiftEntryInfo").append(html);
		var _self = this;
		_self.getShowDom();
	},getShowDom:function(){
		var select_json = {
			name: "atsShiftRest" ,
			readonly: "",
			value: "1_0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_0", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_26},
							{'value': "1_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_27}
							];					
		$('#atsShiftRest').shrSelect(select_json);
		
		var select_json = {
			name: "atsShiftLegal" ,
			readonly: "",
			value: "2_0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "2_0", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_12},
							{'value': "2_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_13}
							];
		$('#atsShiftLegal').shrSelect(select_json);
		
		var select_json = {
			name: "atsWorkRest" ,
			readonly: "",
			onChange: null,
			value: "1_0",
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_0", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_26},
							{'value': "0_0", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_14},
							{'value': "1_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_27}
							];
		$('#atsWorkRest').shrSelect(select_json);
		
		var select_json = {
			name: "atsLegalShift" ,
			readonly: "",
			value: "2_0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "2_0", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_12},
							{'value': "2_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_13}
							];
		$('#atsLegalShift').shrSelect(select_json);
		
			var select_json = {
			name: "atsShiftSegment1" ,
			readonly: "",
			value: "1_1",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_29},
							{'value': "2_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_20},
							{'value': "3_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_25}
							];
		$('#atsShiftSegment1').shrSelect(select_json);
		var select_json = {
			name: "atsShiftSegment2" ,
			readonly: "",
			value: "2_2",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_29},
							{'value': "2_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_20},
							{'value': "3_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_25}
							];
		$('#atsShiftSegment2').shrSelect(select_json);
		var select_json = {
			name: "atsShiftSegment3" ,
			readonly: "",
			value: "3_3",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_29},
							{'value': "2_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_20},
							{'value': "3_3",
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_25}
							];
		$('#atsShiftSegment3').shrSelect(select_json);
		
		var select_json = {
			name: "atsShiftSegment4" ,
			readonly: "",
			value: "2_1",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_29},
							{'value': "2_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_20},
							{'value': "3_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_25}
							];
		$('#atsShiftSegment4').shrSelect(select_json);
		
		
		var select_json = {
			name: "atsShiftSegment5" ,
			readonly: "",
			value: "3_2",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_2",
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_29},
							{'value': "2_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_20},
							{'value': "3_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_25}
							];
		$('#atsShiftSegment5').shrSelect(select_json);
		
		var select_json = {
			name: "atsShiftSegment6" ,
			readonly: "",
			value: "1_3",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_29},
							{'value': "2_3",
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_20},
							{'value': "3_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_25}
							];
		$('#atsShiftSegment6').shrSelect(select_json);
		
		var select_json = {
			name: "atsShiftSegment7" ,
			readonly: "",
			value: "3_1",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_1",
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_29},
							{'value': "2_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_20},
							{'value': "3_1", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_25}
							];
		$('#atsShiftSegment7').shrSelect(select_json);
		
		var select_json = {
			name: "atsShiftSegment8" ,
			readonly: "",
			value: "2_2",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_29},
							{'value': "2_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_20},
							{'value': "3_2", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_25}
							];
		$('#atsShiftSegment8').shrSelect(select_json);
		
			var select_json = {
			name: "atsShiftSegment9" ,
			readonly: "",
			value: "1_3",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': "1_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_29},
							{'value': "2_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_20},
							{'value': "3_3", 
							alias: jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_25}
							];
		$('#atsShiftSegment9').shrSelect(select_json);
	},assembleSaveData: function(action) {
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		data.method = action;
		data.operateState = _self.getOperateState();
		//组装新的model   
		asmodel=_self.assembleModel();
		var intervalTime=atsMlUtile.getFieldOriginalValue("intervalTime");
		asmodel.intervalTime=intervalTime;
		var atsShiftRest=$("input[name='atsShiftRest_el']").val();
		asmodel.atsShiftRest=atsShiftRest;
		var atsShiftLegal=$("input[name='atsShiftLegal_el']").val();
		asmodel.atsShiftLegal=atsShiftLegal;
		var atsWorkRest=$("input[name='atsWorkRest_el']").val();
		asmodel.atsWorkRest=atsWorkRest;
		var atsLegalShift=$("input[name='atsLegalShift_el']").val();
		asmodel.atsLegalShift=atsLegalShift;
		if($("#sameCard").is(":checked")){
			asmodel.sameCard=1;
		}else{
			asmodel.sameCard=0;
		}
		var config = this.getConfig();
		JSON.stringify(config);
		asmodel.punchCardShift=JSON.stringify(config);
		data.model = shr.toJSON(asmodel); 
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		return data;
	},getConfig:function(){
	var config = {};
	var atsShiftSegment1=$("input[name='atsShiftSegment1_el']").val();
	var atsShiftSegment2=$("input[name='atsShiftSegment2_el']").val();
	var atsShiftSegment3=$("input[name='atsShiftSegment3_el']").val();
	var atsShiftSegment4=$("input[name='atsShiftSegment4_el']").val();
	var atsShiftSegment5=$("input[name='atsShiftSegment5_el']").val();
	var atsShiftSegment6=$("input[name='atsShiftSegment6_el']").val();
	var atsShiftSegment7=$("input[name='atsShiftSegment7_el']").val();
	var atsShiftSegment8=$("input[name='atsShiftSegment8_el']").val();
	var atsShiftSegment9=$("input[name='atsShiftSegment9_el']").val();
	config ={"atsShiftSegment1":atsShiftSegment1,"atsShiftSegment2":atsShiftSegment2
	,"atsShiftSegment3":atsShiftSegment3,"atsShiftSegment4":atsShiftSegment4
	,"atsShiftSegment5":atsShiftSegment5,"atsShiftSegment6":atsShiftSegment6
	,"atsShiftSegment7":atsShiftSegment7,"atsShiftSegment8":atsShiftSegment8
	,"atsShiftSegment9":atsShiftSegment9};
	
	var c = [atsShiftSegment1,atsShiftSegment2,atsShiftSegment3];
	var cc = [atsShiftSegment4,atsShiftSegment5,atsShiftSegment6];
	var ccc = [atsShiftSegment7,atsShiftSegment8,atsShiftSegment9];
	var re = [{"cardTimeRange" : "0_2","data" : c},{cardTimeRange: "3_4","data" : cc},{"cardTimeRange":"5_99999" ,"data": ccc}];
	return re;
//	var jsonObj = JSON.parse(JSON.stringyfy(re));
//	jsonObj = jsonObj.sort(function(range1,range2){
//	return range1.cardTimeRange - range2.cardTimeRange;
//	})
	},viewAction: function(billId) {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsScheduleIntelSet.form',
			relatedFieldId: billId,
			billId: billId,
			tab: 1,
			method: 'initalizeData'
		});	
	},myExtendValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {  
    		my24Vldt:jsBizMultLan.atsManager_atsScheduleIntelSet_i18n_31+"45"
		  });
		   jQuery.validator.addMethod("my24Vldt", function(value, element) {
			 var vn=value||'';
			 if ("string" === typeof vn) {
			    vn=new Number(vn.trim());
			 }
	    	 if ( vn < 0 || vn>45 ) {
	    	 	return false;
	    	 }else {
		     	return true;
		     }
	      });
	}
//	,assembleSaveData: function(action) {
//		var _self = this;
//		var data = _self.prepareParam(action + 'Action');
//		data.method = action;
//		data.operateState = _self.getOperateState();
//		//组装新的model   
//		asmodel=_self.assembleModel();
//		var cc;
//		if($.type($("#adminOrgUni"+_self.uuid).shrPromptBox("getValue")) === "array"){
//		cc=$("#adminOrgUni"+_self.uuid).shrPromptBox("getValue").map(function(adminOrgUniE){
//			return adminOrgUniE.longNumber;
//		}).join(",");
//		}else{
//		cc=$("#adminOrgUni"+_self.uuid).shrPromptBox("getValue").longNumber;
//		}
//		var adminOrgUnit=$("#adminOrgUni"+this.uuid+"_el").val();
//		asmodel.adminOrgUnitString=cc;
//		var attenceGroup_el=$("#attenceGrou"+this.uuid+"_el").val();
//		asmodel.attenceGroupString=attenceGroup_el;
//		
//		var proposer_el=$("#perso"+this.uuid+"_el").val();
//		asmodel.personString=proposer_el;
//		
//		if($("#isSub"+this.uuid).is(":checked")){
//			asmodel.isSub=1;
//		}else{
//			asmodel.isSub=0;
//		}
//
//		if($("#isEscrow"+this.uuid).is(":checked")){
//			asmodel.isEscrow=1;
//		}else{
//			asmodel.isEscrow=0;
//		}
//	
//		
//		var config = this.getConfig();
//		JSON.stringify(config);
//		asmodel.config=JSON.stringify(config);
//		
//		var rule_item = [];var condition_item = [];
//		//
//		var condition_item_length=$("#form"+this.uuid).find("div[name = 'condition_item']").length;
//		for(var j = 0;j<condition_item_length;j++){
//		var config=_self.getFilterData($("#form"+this.uuid).find("div[name = 'condition_item']").eq(j).attr('id'));
//		if(!config){
//		continue; 
//		}
//		var condition_item_one = {
//			config: JSON.stringify(config)
//		};
//		condition_item.push(condition_item_one);	
//		}
//		//
//		var rule_item_json = 
//				{
//					
//					items:condition_item
//				};
//				
//				
//		rule_item.push(rule_item_json);
//		asmodel.conditionItems=rule_item;
////		delete asmodel.hrOrgUnit;
//		
//		data.model = shr.toJSON(asmodel); 
//		
//		var relatedFieldId = this.getRelatedFieldId();
//		if (relatedFieldId) {
//			data.relatedFieldId = relatedFieldId;
//		}
//		
//		return data;
//	}
});

