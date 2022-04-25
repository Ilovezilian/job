shr.defineClass("shr.ats.GenerateHolidayLimit", shr.framework.Core, {
	initalizeDOM:function(){
		shr.ats.GenerateHolidayLimit.superClass.initalizeDOM.call(this);
		var _self = this;
	//	_self.setF7Mult();
		
		//行政组织字段无需默认值，不需要默认值
		//_self.setAdminOrgUnit();
		//设置人员信息的默认值
		var name = $.getUrlParam('name');
		if(name != null && name != undefined){
			_self.setDefaultValue(name);
		}
		_self.processF7ChangeEvent();
		_self.holidayRuleF7Init();
		_self.periodAccordTypeSelect();
		_self.existedDealTypeSelect();
		//业务组织change事件
		_self.processHrOrgUnitF7ChangeEvent();
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		_self.initHrOrgUnit(hrOrgUnitId);
		_self.visibleSetting();
		if(_self.uipk=='com.kingdee.eas.hr.ats.app.GenerateHolidayLimit' && shr.getUrlRequestParam("personId") !=''){
		 $('#hrOrgUnit').shrPromptBox('disable');
		}
	}
	//设置业务组织onchange事件
	,processHrOrgUnitF7ChangeEvent:function(){
		var that = this;
		$("#hrOrgUnit").shrPromptBox("option", {
			onchange : function(e, value) {
				var info = value.current;
				that.initHrOrgUnit(info.id);
				$("#proposer").val("");
				$("#proposer_el").val("");
				$("#proposer").attr("title","");
				$("#proposer").shrPromptBox("setValue",{
					id : "",
					name : ""
			   });
			}
		});
	}
	//初始化业务组织
	,initHrOrgUnit:function(hrOrgUnitId){
		var that = this;
		$("#proposer").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
	}
	//设置存在假期档案历史人员F7的 业务组织过滤条件（将业务组织id存进session）
	,initQuerySolutionHrOrgUnit: function(hrOrgUnitId) {
		 var that = this;
		 that.remoteCall({
			type:"post",
			method:"initQuerySolution",
			param:{
				hrOrgUnitId : hrOrgUnitId
			},
			async: true, 
			success:function(res){
				//do nothing...
			}
		});
	}
	,setF7Mult:function(){
		var object = $('#proposer');
		object.bind("change", function(){
			var info = object.shrPromptBox('getValue');
			var names = [],personIds = [];
			for(var i=0;i<info.length;i++){
				//当名称或者编号或者人员没有主见没有时，代表非法用户，不查询
				var name = info[i]["person.name"];
				var number = info[i]["person.number"];
				var personId = info[i]["person.id"];
				if(personId == null || personId == undefined || personId.length < 1){
					continue;
				}
				else if(name == null || name == undefined || name.length < 1){
					continue;
				}
				else if(number == null || number == undefined ||number.length < 1){
					continue;
				}
				else{
					names.push(name);
					//numbers.push(number);
					personIds.push(personId);
				}
			}
			$('#proposer').val(names.join(','));
			$('#proposer_el').val(personIds.join(','));
			//$('#proposer_number').val(numbers.join(','));
			
		});
	}
	,setAdminOrgUnit:function(){
		//设置默认组织
	    var that = this;
	    that.remoteCall({
			type:"post",
			async: false,
			method:"getAdminOrgUnit",
			param:{},
			success:function(res){
				info =  res;
				$('#adminOrgUnit_el').val(info.orgID);
				$('#adminOrgUnit').val(info.orgName);
			}
		});
	}
	,setDefaultValue :function(name){
		//去掉人员和机构的F7
		$('input[name="proposer"]').parent().next().remove();
		$('input[name="adminOrgUnit"]').parent().next().remove();
		$('input[name="hrOrgUnit"]').parent().next().remove();
		
		var personId = $.getUrlParam('personId');
		//_self.unbind('click');;
		$("#proposer").val(decodeURIComponent(name));
		$('#proposer').attr('disabled',true);
		$('#proposer_el').val(personId);
		
		var orgName = $.getUrlParam('orgName');
		var orgId = $.getUrlParam('orgId');
		$('#adminOrgUnit').val(decodeURIComponent(orgName));
		$('#adminOrgUnit_el').val(decodeURIComponent(orgId));
		$('#adminOrgUnit').attr('disabled',true);
		
		var hrOrgName = $.getUrlParam('hrOrgName');
		var hrOrgId = $.getUrlParam('hrOrgId');
		$('#hrOrgUnit').shrPromptBox("setValue",{id:decodeURIComponent(hrOrgId),name:decodeURIComponent(hrOrgName)});
		// $('#hrOrgUnit').val(decodeURIComponent(hrOrgName));
		// $('#hrOrgUnit_el').val(decodeURIComponent(hrOrgId));

		$('#hrOrgUnit').attr('disabled',true);
	}
	,existedDealTypeSelect:function(){
		var select_json = {
			id: "existedDealType",
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{"value": "0", "alias": jsBizMultLan.atsManager_generateHolidayLimit_i18n_5},
				{"value": "1", "alias": jsBizMultLan.atsManager_generateHolidayLimit_i18n_3}
			];
		$('#existedDealType').shrSelect(select_json);
	}
	,periodAccordTypeSelect:function(){
		var select_json = {
			id: "periodAccordType",
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{"value": "0", "alias": jsBizMultLan.atsManager_generateHolidayLimit_i18n_8},
				{"value": "1", "alias": jsBizMultLan.atsManager_generateHolidayLimit_i18n_4}
			];
		$('#periodAccordType').shrSelect(select_json);
	}
	,holidayRuleF7Init:function(){
		var _self=this;
	    _self.holidayRuleF7();
	    /*if($('#holidayType_el').val()==''){
	     	  $('#holidayRule').closest('.ui-promptBox-inputframe').siblings(".ui-promptBox-icon").hide();
		      return false;
	    }*/
	}
	,holidayRuleF7:function(options){
	    var grid_f7_json = {id:"holidayRule",name:"holidayRule"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_generateHolidayLimit_i18n_2,
			uipk:"com.kingdee.eas.hr.ats.app.HolidayRule.F7",
			query:"",
			filter:"",// 
			domain:"",
			multiselect:false
		};
		grid_f7_json.value = "";//${promptId} 默认选中的记录的值
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '{required:true}';
		var data = {
			id : "",
			name : ""
		};
		options=options||{};
		var opts={
		   //filter:" holidayType.id='"+$('#holidayType_el').val()+"' ",
		   promptId:$('#holidayRule_el').val() 
		};
		$.extend(opts,options);
		if (opts) {
			if(opts.filter){
				grid_f7_json.subWidgetOptions.filter=opts.filter;
			}
			if(opts.promptId){
				grid_f7_json.value=opts.promptId;//${promptId} 默认选中的记录的值
				data.id=opts.promptId;
			}
		}
		$('#'+grid_f7_json.id).shrPromptBox(grid_f7_json);
		if (grid_f7_json.subWidgetOptions.multiselect == false && grid_f7_json.value!= "" ){
			$('#'+grid_f7_json.id).shrPromptBox("setValue", data);
		}
		/*if (grid_f7_json.subWidgetOptions.multiselect == true && datas!= ""){
	   	    $('#'+grid_f7_json.id).shrPromptBox("setValue", ${datas});
		}*/
	}
	,processF7ChangeEvent:function(){
		 var _self=this;
		 
		 $("#holidayType").shrPromptBox("option", {
			onchange : function(e, value) {
			   var info = value.current;
			   if(info!=null && info!=''){
					var holidayType = info.name;
				    if(holidayType == jsBizMultLan.atsManager_generateHolidayLimit_i18n_1){
						$('#existedDealType').parent().parent().parent().parent().parent().css("display","none");
					}else{
						$('#existedDealType').parent().parent().parent().parent().parent().css("display","");
					}
					if(info.id && info.id!=''){ 
						var filter=" holidayType.id='"+info.id+"' ";
						$("#holidayRule").shrPromptBox("setFilter",filter);
						$('#holidayRule').closest('.ui-promptBox-inputframe').siblings(".ui-promptBox-icon").show();
					}else{
						$('#holidayRule').closest('.ui-promptBox-inputframe').siblings(".ui-promptBox-icon").hide();
					}
			   }
			   
				//重选假期类型后，清除额度规则值，需重选
				$("#holidayRule").shrPromptBox("setValue",{
					id : "",
					name : ""
				});
			}
		});
		  
		
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
			   var info = value.current;
			   if(info!=null && info!=''){
			   if(info.longNumber !=null && info.longNumber!=''){ 
				  var filter=" adminOrgUnit.longNumber like '"+info.longNumber+"%' ";//因为要加入员工的职业信息，所以现在员工查询结果来自于   员工的职业信息（右）关联的员工
				  $("#proposer").shrPromptBox("setFilter",filter);
			   }else{
			   }
			   }
			   $("#proposer").shrPromptBox("setValue",{
					id : "",
					name : ""
			   });
			}
		});
		/*
		$('#proposer').shrPromptBox("option", {
			onchange : function(e, value) {
			  var infos = value.current;
			  var ids = "",names="";
			  for(var i=0;i<infos.length;i++){
			  	ids += infos[i]["person.id"] + ",";
			  	names += infos[i]["person.name"] + ",";
			  }
			  $('#proposer_el').val(ids);
			  $('#proposer').val(names);
			  alert( $('#proposer').val());
			}
			
		});
		*/
	}

	/* 
	 *	设置视图元素可见性：
	 *	1、当假期类型为调休假时，“已存在额度的处理方式”不显示；
	 */
	,visibleSetting:function(){
		var that = this;
		var holidayType = $('#holidayType').val();
		if(holidayType == jsBizMultLan.atsManager_generateHolidayLimit_i18n_1){
			$('#existedDealType').parent().parent().parent().parent().parent().css("display","none");
		}else{
			$('#existedDealType').parent().parent().parent().parent().parent().css("display","");
		}
	}
	
	,generateHolidayLimitAction:function(){
		var that=this;
	   //验证
		var falg=that.validate();
	   //提交后台	
		if(falg==true){
			openLoader(1,jsBizMultLan.atsManager_generateHolidayLimit_i18n_7);
			
			that.remoteCall({
				//url //var url=shr.getContextPath()+"/dynamic.do?method=";
				method: 'generateHolidayLimit', 
				param: {
					"uipk":"com.kingdee.eas.hr.ats.app.GenerateHolidayLimit",	
					"hrOrgUnit":$("#hrOrgUnit_el").val(), 
					"adminOrgUnit":$("#adminOrgUnit_el").val(), 
					"adminOrgUnit":$("#adminOrgUnit_el").val(), 
					"proposer":$("#proposer_el").val(),
					"holidayType":$("#holidayType_el").val(), 				 // 假期类型	
					"holidayRule":$("#holidayRule_el").val(),				 // 20140711 需求变动  额度规则取假期制度中的	
					
					"periodAccordType" : $('#periodAccordType_el').val(),	
					"cycleDate" : atsMlUtile.getFieldOriginalValue('cycleDate'),
					"existedDealType":$('#existedDealType_el').val(),		 // 已存在额度处理方式 
					"serviceId":shr.getUrlParams().serviceId		 // 权限id 
				},
				success: function(response) {
					closeLoader();
					top.Messenger().hideAll();
					
					if (response) {
						$("#calendar_info").dialog( "close" );
						var batchTipsData = that.batchTipsDataHandler(response);
	
						$(that).shrMessageTips({
							isSuccess: batchTipsData.isSuccess,
							successCount: batchTipsData.successCount,
							failureCount: batchTipsData.failureCount,
							confirmCallback: function () {	
								$(that).shrDetailTips({
									tableData: batchTipsData.tmp,
									successCount: batchTipsData.successCount,
	            					failureCount: batchTipsData.failureCount,
									colNamesData: batchTipsData.tableModel,
									isSortable : true,
									modalWidth: ''
								}).shrDetailTips("open");					
							}
	
						}).shrMessageTips("open");				
					} else {
					}
					
//					var data= jQuery.parseJSON(response||"");
//					 
//					if(data.checkError!=undefined
//						&&data.checkError!=null
//						&&data.checkError!=""){
//						shr.showWarning({message:data.checkError});
//					}else{
//						
//						
//						if (data.totalAmt != null) {
//							var tip = "生成额度完毕<br/>";
//							if(data.totalAmt == 0){
//								tip = tip +  "不存在具有有效档案的员工<br/>" ;
//							}else{
//								tip = tip +  "共存在" + data.totalAmt + "位具有有效档案的员工<br/>" ;
//							}
//							//tip = tip +  "已经生成了" + data.existedAmt + "个员工的假期额度信息<br/>" ;
//							if(data.existedAmt != 0){
//								tip = tip +  ""+data.existedAmt+"个员工的假期额度信息已经存在了<br/>" ;
//							}
//							if(data.attfileNotHaveHldply>0){
//								tip = tip +  "<font color='red'>存在" + data.attfileNotHaveHldply + "个员工的假期档案中的假期制度，没维护["+$("#holidayType").val()+"]</font><br/>" ;
//							}
//							if(data.modifiedAmt != 0){
//								tip = tip +  "本次更新" + data.modifiedAmt + "个员工的假期额度信息<br/>" ;
//							}
//							if(data.generatedAmt != 0){
//								tip = tip +  "本次新生成" + data.generatedAmt + "个员工的假期额度信息<br/>" ;
//							}
//							if(data.errorString!=null&&data.errorString!=""){
//								tip = tip +"<font color='red'>" +data.errorString+"</font><br/>";
//							}
//							var options={
//							   message:tip
//							};
//							$.extend(options, {
//								type: 'info',
//								hideAfter: null,
//								showCloseButton: true
//							});
//							top.Messenger().post(options);
//							
//						}else{
//						
//						}
//					}
//					$(".messenger-message-inner").css({overflowY:'scroll',maxHeight:'500px'});
				}
				,error: function(response) {
				   closeLoader();
				   var options={
					   message:response.responseText
					};
					$.extend(options, {
						type: 'error',
						hideAfter: null,
						showCloseButton: true
					});
					top.Messenger().post(options);
				}
			});
			
		}
		
	}
	,validate: function(){
	   shr.msgHideAll();
	   var that=this;
	   var workArea = this.getWorkarea(),
	   $form = $('form', workArea);
	   var flag = $form.valid();
	   
	   return flag;
	}
	//业务组织F7读缓存
	,hrOrgWriteCacheable:function(){
		return (shr.getUrlRequestParam("hrOrgId") == undefined || shr.getUrlRequestParam("hrOrgId") == "");
	},
	batchTipsDataHandler: function (data, options) {
		var _self = this;
		var successCount = data.successCount; 
		var failureCount = data.failureCount;
		var isSuccess = !data.failureCount ? true : false;
		var result = data.result;
		for(var i = 0, l = result.length;i < l;i++){
			if(result[i].muitTipsState ) {
				result[i].muitTipsState  = jsBizMultLan.atsManager_generateHolidayLimit_i18n_0;
			}else {
				
				result[i].muitTipsState  = jsBizMultLan.atsManager_generateHolidayLimit_i18n_6;
			}
		}
		var batchData = {
			"successCount": successCount,
			"failureCount": failureCount,
			"isSuccess": isSuccess,
			"tmp": result,
			"tableModel":[]
		};

		return batchData;
	},
	getBatchTipsTableModel:function(){
		var tableModel = $("#grid").jqGrid("getGridConfig").colModel;
		return tableModel;
	}
});	
