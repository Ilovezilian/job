var selectedRows="";
var currentPageRows="";
var quickSearch="";
var nodeLongNumber="";
var domainFilter="";
var fastfilter="";


var temp_selection = 3;//默认选中第三项
shr.defineClass("shr.ats.HolidayLimitBatchExtension", shr.framework.Edit, {

	initalizeDOM:function(){
		shr.ats.HolidayLimitBatchExtension.superClass.initalizeDOM.call(this);
		var that = this;
		that.initPageValue();
		that.initUIFormatter();
		that.setF7Mult();
		that.selectionChange();
		that.validate();
		that.selectionMutex();
		that.setDefaultValue();
		that.fixView();
		that.processF7ChangeEventHrOrgUnit();
	}
	//对前置界面传来的值对全局变量进行赋值
	,initPageValue : function(){
		//selectedRows = decodeURIComponent(shr.getUrlParam('selectedRows'));
		selectedRows = decodeURIComponent(localStorage.getItem("holidayLimitSelectedRows"));
		//currentPageRows = decodeURIComponent(shr.getUrlParam('currentPageRows'));
		currentPageRows = decodeURIComponent(localStorage.getItem("holidayLimitCurrentPageRows"));
		
		quickSearch = decodeURIComponent(shr.getUrlParam('quickSearch'));
		nodeLongNumber = decodeURIComponent(shr.getUrlParam('nodeLongNumber'));
		domainFilter = decodeURIComponent(shr.getUrlParam('domainFilter'));
		fastfilter = decodeURIComponent(shr.getUrlParam('fastfilter'));
	}	
	, processF7ChangeEventHrOrgUnit: function () {
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange: function (e, value) {
					shr.msgHideAll();
					$("#proposer_el").val("");
					$("#proposer").val("");
					var info = value.current;
					that.initCurrentHrOrgUnit(info.id);

				}
			});
		}
	}
	, initCurrentHrOrgUnit: function (hrOrgUnitId) {
		var that = this;
		$("#proposer").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
	}
	, initQuerySolutionHrOrgUnit: function (hrOrgUnitId) {
		var that = this;
		that.remoteCall({
			type: "post",
			method: "initQuerySolution",
			param: {
				hrOrgUnitId: hrOrgUnitId
			},
			async: true,
			success: function (res) {

			}
		});
	}
	//对界面进行格式化
	,initUIFormatter : function(){
		//界面微调
		$("input[name^='fixedDate']").parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-4').css('width','80px');
		$("input[name^='fixedDate']").parents('div[data-ctrlrole="labelContainer"]').find('.field_label').css({'padding-left':'0px','float':'left'});	
		$("input[name^='basedMonth']").parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-4').css('width','80px');
		$("input[name^='basedMonth']").parents('div[data-ctrlrole="labelContainer"]').find('.field_label').css({'padding-left':'0px','float':'left'});
		$("#holidayType").attr('validate','{required:true}');
		$("#holidayType").parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-4').css('width','140px');
		$("#holidayType").parents('div[data-ctrlrole="labelContainer"]').find('.field_label').css({'padding-left':'60px','float':'left'});
		$("#hrOrgUnit").parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-4').css('width','140px');
		$("#hrOrgUnit").parents('div[data-ctrlrole="labelContainer"]').find('.field_label').css({'padding-left':'36px','float':'left'});
		
		$("#beginDate").parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-4').css({'width':'120px','padding-left':'86px','float': 'left'});
		$("#endDate").parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-4').css({'width':'100px','float': 'left'});
		$("input[name$='Date']").parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-6').css({'width':'174px','padding-left':'10px','float':'left'});
		$("input[name$='Date']").parents('div[data-ctrlrole="labelContainer"]').find('.field_label').css('line-height','20px');
		$("#proposer").parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-4').remove();
		$("#proposer").parents('div[data-ctrlrole="labelContainer"]').find('.col-lg-6').css('padding-left','140px');
		//子radio未选择前不能修改
		$("input[name^='fixedDate']").attr("disabled","true");
		$("input[name^='basedMonth']").attr("disabled","true");
		//$("input[name$='Date']").attr("disabled","true");
	}
	//假期档案多选
	,setF7Mult:function(){
		var object = $('#proposer');
		object.bind("change", function(){
			var info = object.shrPromptBox('getValue');
			var names = [],personIds = [];
			for(var i=0;i<info.length;i++){
				//当名称或者编号或者人员没有主见没有时，代表非法用户，不查询
				var name = info[i]["name"];
				var number = info[i]["person.number"];
				var personId = info[i]["id"];
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
	//选项变化时的显示和隐藏动画
	,selectionChange:function() {
		var that = this;
		$("input[name='extensionType']").change(function() {     
			var selection = $("input[name='extensionType']:checked").val();
			switch(selection){
				case '1':
					if (currentPageRows=="") {
						 shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_7,hideAfter:5});
						 $("input[name='extensionType']").eq(temp_selection-1).attr("checked","checked");
					}else {
						$("div[name=paragraphOne]").is(":visible")?'':$("div[name=paragraphOne]").toggle(500);
						$("div[name=paragraphTwo]").is(":visible")?$("div[name=paragraphTwo]").toggle(500):'';
						$("div[name=paragraphThree]").is(":visible")?$("div[name=paragraphThree]").toggle(500):'';
						setTempSelection($("input[name='extensionType']:checked").val());
						$("#holidayType").removeAttr('validate');
						
						//选择第一个的时候增加默认值处理
						$("#eto1").attr("checked","checked");
						$("input[name='fixedDate1']").removeAttr("disabled");
						$("input[name='basedMonth1']").attr("disabled","true").attr("value","");
						$("input[name='fixedDate1']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').removeAttr("style");
						$("input[name='basedMonth1']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-text-frame').css('background-color','rgba(204,204,204,0.4)');
						
					}
				  break;
				case '2':
					if (selectedRows=="") {
						 shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_12,hideAfter:5});
						 $("input[name='extensionType']").eq(temp_selection-1).attr("checked","checked");
					}else {
						$("div[name=paragraphOne]").is(":visible")?$("div[name=paragraphOne]").toggle(500):'';
						$("div[name=paragraphTwo]").is(":visible")?'':$("div[name=paragraphTwo]").toggle(500);
						$("div[name=paragraphThree]").is(":visible")?$("div[name=paragraphThree]").toggle(500):''; 
						setTempSelection($("input[name='extensionType']:checked").val());
						$("#holidayType").removeAttr('validate');
						
						//选择第一个的时候增加默认值处理
						$("#ett1").attr("checked","checked");
						$("input[name='fixedDate2']").removeAttr("disabled");
						$("input[name='basedMonth2']").attr("disabled","true").attr("value","");
						$("input[name='fixedDate2']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').removeAttr("style");
						$("input[name='basedMonth2']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-text-frame').css('background-color','rgba(204,204,204,0.4)');
						
					}
				  break;
				default:
				    $("div[name=paragraphOne]").is(":visible")?$("div[name=paragraphOne]").toggle(500):'';
					$("div[name=paragraphTwo]").is(":visible")?$("div[name=paragraphTwo]").toggle(500):'';
					$("div[name=paragraphThree]").is(":visible")?'':$("div[name=paragraphThree]").toggle(500); 
					setTempSelection($("input[name='extensionType']:checked").val());
					$("#holidayType").attr('validate','{required:true}');
					
					that.setDefaultValue();
					
			}
		});
	}
	
	
	//页面进来设置默认值处理
	,setDefaultValue: function(){
		var that = this;
		//选择第一个的时候增加默认值处理
		//默认 精确匹配周期
		// $("#ct1").attr("checked","checked");
		// $("input[name$='Date']").removeAttr("disabled");
		// $("input[name$='Date']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').removeAttr("style");
		//默认 更新所有人延期日期(权限范围内)
		//$("#ec1").attr("checked","checked");
		$("#proposer").parents('div[data-ctrlrole="labelContainer"]').find('.ui-promptBox-frame').css('background-color','rgba(204,204,204,0.4)');
		$("#proposer").attr("disabled","true");
		//默认固定日期
		//$("#eth1").attr("checked","checked");
		$("input[name='fixedDate3']").removeAttr("disabled");
		$("input[name='basedMonth3']").attr("disabled","true").attr("value","");
		$("input[name='fixedDate3']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').removeAttr("style");
		$("input[name='basedMonth3']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-text-frame').css('background-color','rgba(204,204,204,0.4)');
	}
	
	
	//校验
	,validate: function(){ 
		var that = this;
		that.positiveIntValidate();
		//that.dateValidate();
	}
	
	//固定月判断，必须为正整数
	,positiveIntValidate: function(){ 
		$("input[name^='basedMonth']").change(function() { 
			var that = this;
			var res = positiveIntValidation(that.value);
			!res?this.value="":"";
		});
	}
	//固定日期判断，必须大于当前日期-已弃用
/* 	,dateValidate: function(){ 
		$("input[name^='fixedDate']").change(function() { 
			var that = this;
			var year = that.value.substring(0,4);
			var month = that.value.substring(5,7);
			var day = that.value.substring(8,10);
			var currentDateDetail=  new Date();
			var currentYear = currentDateDetail.getFullYear();
			var currentMonth = currentDateDetail.getMonth()+1;
			var currentDay = currentDateDetail.getDate();
			var flag = year<currentYear?false:(month<currentMonth?false:(day<=currentDay?false:true));
			flag?'':shr.showWarning({message:"所选日期必须大于当前日期!"});
		});
	} */
	
	//互斥选项处理,清空非选中项目且不可修改，选中项目可以修改
	//互斥选项为:1、固定日期和固定月；2、精确匹配周期和最新有效周期
	,selectionMutex: function(){
		$("input[name='extensionTypeOne']").change(function() { 
			if  ($("#eto1").attr('checked')=="checked") {
				$("input[name='fixedDate1']").removeAttr("disabled");
				$("input[name='basedMonth1']").attr("disabled","true").attr("value","");
				$("input[name='fixedDate1']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').removeAttr("style");
				$("input[name='basedMonth1']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-text-frame').css('background-color','rgba(204,204,204,0.4)');
				
			}else {
				$("input[name='basedMonth1']").removeAttr("disabled");
				$("input[name='fixedDate1']").attr("disabled","true").attr("value","");
				$("input[name='fixedDate1']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').css('background-color','rgba(204,204,204,0.4)');
				$("input[name='basedMonth1']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-text-frame').removeAttr("style");
			}
		});
		$("input[name='extensionTypeTwo']").change(function() { 
			if  ($("#ett1").attr('checked')=="checked") {
				$("input[name='fixedDate2']").removeAttr("disabled");
				$("input[name='basedMonth2']").attr("disabled","true").attr("value","");
				$("input[name='fixedDate2']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').removeAttr("style");
				$("input[name='basedMonth2']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-text-frame').css('background-color','rgba(204,204,204,0.4)');
			}else {
				$("input[name='basedMonth2']").removeAttr("disabled");
				$("input[name='fixedDate2']").attr("disabled","true").attr("value","");
				$("input[name='fixedDate2']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').css('background-color','rgba(204,204,204,0.4)');
				$("input[name='basedMonth2']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-text-frame').removeAttr("style");
			}
		});
		$("select[id='extensionTypeThreeChoose']").change(function() { 
			if($("select[id='extensionTypeThreeChoose']").val() == 1) {
				$("input[name='fixedDate3']").removeAttr("disabled");
				$("input[name='basedMonth3']").attr("disabled","true").attr("value","");
				$("input[name='fixedDate3']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').removeAttr("style");
				$("input[name='basedMonth3']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-text-frame').css('background-color','rgba(204,204,204,0.4)');
			}else {
				$("input[name='basedMonth3']").removeAttr("disabled");
				$("input[name='fixedDate3']").attr("disabled","true").attr("value","");
				$("input[name='fixedDate3']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').css('background-color','rgba(204,204,204,0.4)');
				$("input[name='basedMonth3']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-text-frame').removeAttr("style");
			}
		});
		$("select[id='cycleTypeChoose']").change(function() { 
			if($("select[id='cycleTypeChoose']").val() == 1) {
				$("input[name$='Date']").removeAttr("disabled");
				$("input[name$='Date']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').removeAttr("style");
			}else {
				$("input[name$='Date']").attr("disabled","true");
				$("input[name$='Date']").parents('div[data-ctrlrole="labelContainer"]').find('.ui-datepicker-frame').css('background-color','rgba(204,204,204,0.4)');
			}
		});
		$("select[id='empCategoryChoose']").change(function() { 
			if($("select[id='empCategoryChoose']").val() == 1) {
				$("#proposer").parents('div[data-ctrlrole="labelContainer"]').find('.ui-promptBox-frame').css('background-color','rgba(204,204,204,0.4)');
				$("#proposer").attr("disabled","true");
			}else {
				$("#proposer").removeAttr("disabled");
				$("#proposer").parents('div[data-ctrlrole="labelContainer"]').find('.ui-promptBox-frame').removeAttr("style");
			}
		});
	}
	
	,batchExtensionAction: function(){
		var that = this;
		if  (requiredValidation()){
			temp_selection==3?that.remoteCallTwo():that.remoteCallOne();
			
		}				
	}
	
	//对列表中所有的记录进行延期，对列表中选中的记录进行延期 的远程调用
	,remoteCallOne: function(){
		var that = this;
		var methodName = getMethodName();
		var billID = getBillID();
		var dynamicDate = getdynamicDate();
		var dateType = getDateType();
		var flag = decodeURIComponent(shr.getUrlParam('flag'));
		var records = decodeURIComponent(shr.getUrlParam('records'));
		var serviceId = shr.getUrlParam('serviceId');
		if ((temp_selection == '1' && !flag) || temp_selection == '2') {
			var reg = new RegExp(",", "g");
			var arr = billID.match(reg);
			if (arr ==null) records = 1;
			else records = arr.length + 1;
		}
		
		if(parseInt(records) >= 20000){
			shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_17,hideAfter:360});
			return ;
		}
		
		shr.showConfirm("<font color='red'>"
			+ shr.formatMsg(jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_19,[records])
			+ "</font>", function() {
			top.Messenger().hideAll();
			openLoader(1);
			that.remoteCall({
							type:"post",
							//async:false,
							method:methodName,
							param:{
								"seletion" : temp_selection,
								"flag": flag,
								"billID": billID,
								"dateType" : dateType,
								"permItemId" : "24b5487e-3008-4acd-a5c1-b9a34cd47497PERMITEM",
								"dynamicDate" :dynamicDate,
								"quickSearch" : quickSearch,
								"nodeLongNumber" : nodeLongNumber,
								"domainFilter" : domainFilter,
								"fastfilter":fastfilter,
								"fromPageFlag" : "batchExtension"
							},
							success:function(res){
								closeLoader();
								var data = res;
								if (data.updateFlag == "10") {
									 shr.showInfo({message: shr.formatMsg(jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_15, [data.updatedRecord]), hideAfter:360});
									 return false;
								}else if (data.updateFlag == "20"){
										var showMes = shr.formatMsg(jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_21, [data.updatedRecord]) + "</br>";
										showMes+=data.resFailedList.replace(/!/g,"!</br>");
										shr.showInfo({message:showMes,hideAfter:360});
									 return false; 
								}else if(data.updateFlag == "40"){
									shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_17,hideAfter:360});
								} else {
									shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_8,hideAfter:360});
								}
							}
						});		
		});
		
	}
	
	//按下面的条件进行延期 的远程调用
	,remoteCallTwo: function(){
		var that = this;
		var methodName = getMethodName();
		var holidayType = $("#holidayType_el").val();
		var cycleType = $("select[id='cycleTypeChoose']").val();
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		var empCategory = $("select[id='empCategoryChoose']").val();
		var proposer = $("#proposer_el").val();
		var dateType = getDateType();
		var dynamicDate = getdynamicDate();
		var hrOrgUnit = $("#hrOrgUnit_el").val();
/* 		alert(methodName);alert(holidayType);alert(cycleType);
		alert(beginDate);alert(endDate);alert(empCategory);
		alert(proposer);alert(dateType);alert(dynamicDate); */
		
		shr.showConfirm("<font color='red'>"
			+ jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_20
			+ "</font>", function() {
			top.Messenger().hideAll();
			openLoader(1);
			that.remoteCall({
							type:"post",
							method:methodName,
							//async:false,
							param:{
								"holidayType":holidayType,
								"cycleType":cycleType,
								"beginDate":beginDate,
								"endDate":endDate,
								"empCategory":empCategory,
								"proposer":proposer,
								"dateType" : dateType,
								"dynamicDate" :dynamicDate,
								"hrOrgUnit" :hrOrgUnit,
								"fromPageFlag" : "batchExtension"
							},
							success:function(res){
								closeLoader();
								var data = res;
								if (data.updateFlag == "10") {
									var showMes= shr.formatMsg(jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_15, [data.updatedRecord]) + "</br>";
									//alert(data.noUpdatedSeletedProposerName);
									if (data.noUpdatedSeletedProposerName.length!=0){
										showMes += shr.formatMsg(jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_14, [data.noUpdatedSeletedProposerName]) + "</br>";
										shr.showWarning({message:showMes,hideAfter:360});
									}else{
										shr.showInfo({message:showMes,hideAfter:360});
									}
									 return false;
								}else if (data.updateFlag == "20"){
									var showMes = shr.formatMsg(jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_21, [data.updatedRecord]) + "</br>";
									showMes += data.resFailedList.replace(/!/g,"!</br>");
									if (data.noUpdatedSeletedProposerName.length!=0){
										showMes += shr.formatMsg(jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_14,[data.noUpdatedSeletedProposerName]) + "</br>";
									}		
									shr.showWarning({message:showMes,hideAfter:360});
									 return false; 
								}else if(data.updateFlag == "40"){
									shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_17,hideAfter:360});
								}else {
									var showMes = jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_8 + "</br>";
									if (data.noUpdatedSeletedProposerName.length!=0){
										showMes += shr.formatMsg(jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_13,[data.noUpdatedSeletedProposerName]) + "</br>";
									}		
									shr.showWarning({message:showMes,hideAfter:360});
								}
							}
						});
		});
	},
	fixView:function () {
		$($('[name="paragraphThree"] .photoCtrlRadio')[0]).next().css({"position":"relative","left":"30px"});
		$($('[name="paragraphThree"] .photoCtrlRadio')[0]).next().next().css({"float":"none"});
		$($('[name="paragraphThree"] .photoCtrlRadio')[1]).next().css({"position":"relative","left":"30px"});
		$($('[name="paragraphThree"] .photoCtrlRadio')[2]).next().css({"position":"relative","left":"30px"});
		$($('[name="paragraphThree"] .photoCtrlRadio')[3]).next().css({"position":"relative","left":"30px"});
		$($('[name="paragraphThree"] .photoCtrlRadio')[4]).next().children().css({"width":"80%"});
		$($('[name="paragraphThree"] .photoCtrlRadio')[5]).next().children().css({"width":"80%"});
		$($('[name="paragraphThree"] .photoCtrlRadio')[4]).next().find('.label-ctrl.flex-cc').css({"margin-left":"30px"});
		$($('[name="paragraphThree"] .photoCtrlRadio')[5]).next().find('.label-ctrl.flex-cc').css({"margin-left":"30px"});
		if(window.contextLanguage == 'en_US'){
			$($('[name="paragraphThree"] .photoCtrlRadio')[1]).css({"padding-left":"185px"});
			$($('[name="paragraphThree"] .photoCtrlRadio')[3]).css({"padding-left":"185px"});
		}
		
	}
});

//非空验证-按确认时验证
function requiredValidation(){
	var resFlag=false;
	switch (temp_selection){
			case '1' : if ($("#eto1").attr('checked')=="checked") {
						 $("input[name='fixedDate1']").val()==""?
							 shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_3,hideAfter:5}):resFlag=true;
						}else if ($("#eto2").attr('checked')=="checked"){
						 $("input[name='basedMonth1']").val()==""?
							 shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_2,hideAfter:5}):resFlag=true;
						}else {
						 shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_10,hideAfter:5});
						}
					   break;
			case '2' : if ($("#ett1").attr('checked')=="checked") {
						 $("input[name='fixedDate2']").val()==""?
							 shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_4,hideAfter:5}):resFlag=true;
						}else if ($("#ett2").attr('checked')=="checked"){
						 $("input[name='basedMonth2']").val()==""?
							 shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_0,hideAfter:5}):resFlag=true;
						}else {
						 shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_10,hideAfter:5});
						}
					   break;
			default : 	var showMes ="";
						var flag1 = false,flag2 = false,flag3 = false,flag4 = false;
						
						if (!$("#holidayType").val()=="") flag1=true; else showMes+=jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_5+"</br>";
						
						if ($("select[id='cycleTypeChoose']").val() == 1) {
							$("input[name='beginDate']").val()==""||$("input[name='endDate']").val()==""?
								showMes+=jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_6 + "</br>":flag2=true;
						}else if ($("select[id='cycleTypeChoose']").val() == 2){
							flag2=true; 
						}else {
							showMes+=jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_9+"</br>";
						}
						
						if ($("select[id='empCategoryChoose']").val() == 1) {
							flag3=true; 
						}else if ($("select[id='empCategoryChoose']").val() == 2){
							$("#proposer").val()==""?showMes+=jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_18+"</br>":flag3=true;
						}else {
							showMes+=jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_11+"</br>";
						}
						
						if ($("select[id='extensionTypeThreeChoose']").val() == 1) {
							$("input[name='fixedDate3']").val()==""?
								showMes+=jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_1+"</br>":flag4=true;
						}else if ($("select[id='extensionTypeThreeChoose']").val() == 2){
							$("input[name='basedMonth3']").val()==""?
								showMes+=jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_0+"</br>":flag4=true;
						}else {
							showMes+=jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_10+"</br>";
						}
						
						flag1&&flag2&&flag3&&flag4?resFlag=true:shr.showWarning({message:showMes,hideAfter:5});

		}
	return resFlag;
}

//正整数验证
function positiveIntValidation(value){
	var regPI = /^[1-9][\d]*$/;
	var re = new RegExp(regPI);
	value=value.replace(/\s/g,"");
	if(value.trim().match(re) == null){
		shr.showWarning({message:jsBizMultLan.atsManager_HolidayLimitBatchExtension_i18n_16,hideAfter:5});
		return false;
	}
	return true;
}

//记录选项
function setTempSelection(selection){
	temp_selection = selection;
}

//获取调用方法名
function getMethodName(){
	var resName;
	switch (temp_selection){
			case '1' : resName = "selectedBatchExtension";
					   break;
			case '2' : resName = "selectedBatchExtension";
					   break;
			default :  resName = "conditionBatchExtension";
				
		}
	return resName;
}

//获取表单ID
function getBillID(){
	var resID;
	switch (temp_selection){
			case '1' : resID = currentPageRows;
					   break;
			case '2' : resID = selectedRows;
					   break;
			default  :  resID = "";
		}
	return resID;
}

//获取动态日期变量 为日期或者月份数
function getdynamicDate(){
	var resDate;
	switch (temp_selection){
			case '1' : if ($("#eto1").attr('checked')=="checked") resDate=atsMlUtile.getFieldOriginalValue("fixedDate1");
					   if ($("#eto2").attr('checked')=="checked") resDate=atsMlUtile.getFieldOriginalValue("basedMonth1");
					   break;
			case '2' : if ($("#ett1").attr('checked')=="checked") resDate=atsMlUtile.getFieldOriginalValue("fixedDate2");  
					   if ($("#ett2").attr('checked')=="checked") resDate=atsMlUtile.getFieldOriginalValue("basedMonth2");
					   break;
			default :  if ($("select[id='extensionTypeThreeChoose']").val() == 1) resDate=atsMlUtile.getFieldOriginalValue("fixedDate3"); 
					   if ($("select[id='extensionTypeThreeChoose']").val() == 2) resDate=atsMlUtile.getFieldOriginalValue("basedMonth3");
				
		}
	return resDate;
}

//获取动态日期变量类型 1为固定时间，2为月份
function getDateType(){
	var dateType;
	switch (temp_selection){
			case '1' : dateType = $("input[name=extensionTypeOne]:checked").val();
					   break;
			case '2' : dateType = $("input[name=extensionTypeTwo]:checked").val();
					   break;
			default :  dateType = $("select[id=extensionTypeThreeChoose]").val();
				
		}
	return dateType;
}