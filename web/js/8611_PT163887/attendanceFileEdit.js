shr.defineClass("shr.ats.AttendanceFileEdit", shr.framework.Edit, {
	initalizeDOM:function(){
		shr.ats.AttendanceFileEdit.superClass.initalizeDOM.call(this);
		var that = this;
		//that.initDeal();
		
		that.processF7ChangeEvent();
		that.setButtonState();
		that.divDialog();
		/*$(window).load(function(){
		});*/
		that.setNumberFieldEnable();
		that.warmPrompt();
		that.setNavigate();
		that.radioBoxInit();
		
		//增加问号说明
		that.showTips();
		that.addSocQueryTips();
	}
	/**
	 * 温馨提示
	 */
	,warmPrompt:function(){
		var that = this ;
		//假勤管理去掉温馨提示
//		if (that.getOperateState().toUpperCase() == 'EDIT'){
//			$(".shr-baseInfo").parent().append('<div style="position:relative;left:-20%;width:1048px;color:red;margin-left:185px;">温馨提示：假期制度发生变更要在当前请假中立即生效的，需要重算员工的假期额度。<br>考勤制度有变更要在当前考勤计算中生效的，需要重新给员工排班。<br>纠正档案信息：对不准确的档案信息进行纠正，即修改最新的档案信息，不产生新的档案历史记录；<br>变更档案信息：档案信息从“生效日期”时间点发生变更，变更将会产生新的档案历史记录。</div>');
//		} 
	}
	
	/**
	 * 设置编码字段是否可编辑
	 */
	,setNumberFieldEnable : function() {
		var that = this ;
		if (that.getOperateState().toUpperCase() == 'EDIT' ||　that.getOperateState().toUpperCase() == 'ADDNEW') {
			var attendanceFileNumberFieldCanEdit = that.initData.attendanceFileNumberFieldCanEdit;
			if (typeof attendanceFileNumberFieldCanEdit != 'undefined' && !attendanceFileNumberFieldCanEdit) {
				//that.getField('number').shrTextField('option', 'readonly', true);
				that.getField('attendanceNum').shrTextField('option', 'readonly', true);
			}
		}
	},
	reloadPage:function(param, url){
		param.billObj = encodeURIComponent(JSON.stringify({
			"billId" : $("#id").val(),
			"proposer.name" : $(".shr-baseInfo-title").html(),
			"proposer.number" : $("#proposer_number").html()//@
		}));
		shr.ats.AttendanceFileEdit.superClass.reloadPage.call(this,param, url);
	}
	
	,initDeal:function(){
		var that = this;
		
		if (that.getOperateState() != 'VIEW') {
			var attendCenterId = $('#attendCenter_el').val();
			if(attendCenterId==''){
			  return ;
			}
			that.remoteCall({
				method: 'selectAttendCenter', 
				param: {
					uipk:"com.kingdee.eas.hr.ats.app.AttendanceFile.form",
					attendCenterId:attendCenterId
				},
				success: function(response) {
					var data= jQuery.parseJSON(response||"{}");
					var filter = "";
					//考勤制度
					if(data.attenceId != null && data.attenceId.length > 0){
						var attenceId = [];
						for(var i=0;i<data.attenceId.length;i++){
							var row = data.attenceId[i];
							attenceId.push(row.id);
						}
						filter = "id in (" + attenceId.join(',') + ")"; 
						
					}
					else{
						//filter = "id is null ";
						filter=" ";
					}
					$("#attencePolicy").shrPromptBox("setFilter",filter);
					//假期制度
					if(data.holidayId != null && data.holidayId.length > 0){
						var holidayId = [];
						for(var i=0;i<data.holidayId.length;i++){
							var row = data.holidayId[i];
							holidayId.push(row.id);
						}
						filter = "id in (" + holidayId.join(',') + ")"; 							
					}
					else{
						//filter = "id is null "; 
						filter=" ";
					}
					$("#holidayPolicySet").shrPromptBox("setFilter",filter);
				}
			});
		}		
	}
	
	,processF7ChangeEvent : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					$("#attAdminOrgUnit_el").val("");
					$("#attAdminOrgUnit").val("");
					$("#attPosition_el").val("");
					$("#attPosition").val("");
				}
			});

			$("#attendCenter").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					that.dealAttendCenterChange(info.id);
				}
			});
			
			$("#proposer").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					//$("#attendanceNum").val(info.number); //考勤编码==员工编码
				 if( info != null){ 
				    if(info.hasOwnProperty("id")){
				    	
						that.remoteCall({
							type:"post",
							method:"getPersonInfos",
							param:{personId: info.id},
							success:function(res){
								var info = res;
								$('#name').val( info.personName );	
								$('#proposer_number').val( info.personNumber );//@
								$('#attendanceNum').val(info.personNumber);		//员工姓名
								
								$('#adminOrgUnit_el').val( info.adminOrgUnitId );		//部门ID
								$('#adminOrgUnit').val( info.adminOrgUnitName);	//部门名称  
								$("#position_el").val(info.positionId);		//职位ID
								$("#position").val(info.positionName);    //职位名称
								$("#proposer_employeeType").val(info.employeeType); 
								$("#adminOrgUnit_view").val(info.adminOrgUnitName);
								$("#position_view").val(info.positionName);
							   if(info.attencePolicy !=null){
							        var attencePolicy=$.parseJSON(info.attencePolicy);
									var dataValue = {
										id : attencePolicy.id,
										name : attencePolicy.name
										}
									$('#attencePolicy').shrPromptBox("setValue", dataValue);
	
								}
								if(info.atsShift !=null){
								    var atsShift=$.parseJSON(info.atsShift);
									var dataValue = {
										id : atsShift.id,
										name : atsShift.name
									};
									$('#atsShift').shrPromptBox("setValue", dataValue);
		
								}
								if(info.holidayPolicySet !=null){
								    var holidayPolicySet=$.parseJSON(info.holidayPolicySet);
									var dataValue = {
										id : holidayPolicySet.id,
										name : holidayPolicySet.name
									};
									$('#holidayPolicySet').shrPromptBox("setValue", dataValue);
	
								}							
	
						    }
						}); //remoat call end 
				    }
				    
				 }
				 
				} // onchange end 
			});
			
			
			$("#attPosition").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current; 
					that.remoteCall({
						type:"post",
						method:"getOrgUnitByPosition",
						param:{positionId: info.id},
						success:function(res){
							var info = res;
							$('#attAdminOrgUnit_el').val( info.adminOrgUnitId);
							$('#attAdminOrgUnit').val(info.adminOrgUnitName);
							//$('#adminOrgUnit').shrPromptBox("disable");
						}
					});
				}
			});
		}
	}
	
	,dealAttendCenterChange:function(attendCenterId){
		var that = this;
		that.remoteCall({
			//url
			method: 'selectAttendCenter', 
			param: {
				uipk:"com.kingdee.eas.hr.ats.app.AttendanceFile.form",
				attendCenterId:attendCenterId
			},
			success: function(response) {
				var data= jQuery.parseJSON(response||"{}");
				if(data.attencePolicy !=null){
					var dataValue = {
						id : data.attencePolicy.id,
						name : data.attencePolicy.name
					};
					$('#attencePolicy').shrPromptBox("setValue", dataValue);
					/*$('#attencePolicy_el').val(data.attencePolicy.id);
					$('#attencePolicy').val(data.attencePolicy.name);*/
				}
				if(data.atsShift !=null){
					var dataValue = {
						id : data.atsShift.id,
						name : data.atsShift.name
					};
					$('#atsShift').shrPromptBox("setValue", dataValue);
					/*$('#atsShift_el').val(data.atsShift.id);
					$('#atsShift').val(data.atsShift.name);*/
				}
				if(data.holidayPolicySet !=null){
					var dataValue = {
						id : data.holidayPolicySet.id,
						name : data.holidayPolicySet.name
					};
					$('#holidayPolicySet').shrPromptBox("setValue", dataValue);
					/*$('#holidayPolicySet_el').val(data.holidayPolicySet.id);
					$('#holidayPolicySet').val(data.holidayPolicySet.name);*/
				}
				
				var filter = "";
				//考勤制度
				if(data.attenceId != null && data.attenceId.length > 0){
					var attenceId = [];
					for(var i=0;i<data.attenceId.length;i++){
						var row = data.attenceId[i];
						attenceId.push(row.id);
					}
					filter = "id in (" + attenceId.join(',') + ")"; 
					
				}
				else{
					//filter = "id is null ";
					filter=" ";
				}
				$("#attencePolicy").shrPromptBox("setFilter",filter);
				//假期制度
				if(data.holidayId != null && data.holidayId.length > 0){
					var holidayId = [];
					for(var i=0;i<data.holidayId.length;i++){
						var row = data.holidayId[i];
						holidayId.push(row.id);
					}
					filter = "id in (" + holidayId.join(',') + ")"; 							
				}
				else{
					//filter = "id is null "; 
					filter=" ";
				}
				$("#holidayPolicySet").shrPromptBox("setFilter",filter);
				/*
				//班次信息  //班次还是展示全部的班次信息
				if(data.shiftId != null && data.shiftId.length > 0){
					var shiftId = [];
					for(var i=0;i<data.shiftId.length;i++){
						var row = data.shiftId[i];
						shiftId.push(row.id);
					}
					filter = "id in (" + shiftId.join(',') + ")"; 
					$("#atsShift").shrPromptBox("setFilter",filter);
				}
				*/
			}
		});
	}
	
	//设置按钮状态,新建时，禁用启动不可见
   ,setButtonState: function() {
		var clz = this;
		var billId = $("#id").val();
		if(billId == "" || clz.getOperateState() != 'VIEW') {
			$("#enableFile").hide();
			$("#disableFile").hide();
			$("#matchPunchCardRecord").hide();
		}else{
			if(jsBizMultLan.atsManager_attendanceFileEdit_i18n_19 == $("#attendFileState").text()) {
					$("#enableFile").hide();
			}
			if(jsBizMultLan.atsManager_attendanceFileEdit_i18n_10 == $("#attendFileState").text()) {
					$("#disableFile").hide();
			}
		}
		//if(billId && clz.getOperateState() == 'EDIT') {
		//	$("#proposer").unbind("shrPromptBox()");
		//}
		
	},
	
	
	enableFileAction: function() {
		var clz = this;
		var billId = $("#id").val();
		var proposer = $("#proposer_id").attr("value"); 
		
		
		if(jsBizMultLan.atsManager_attendanceFileEdit_i18n_19 == $("#attendFileState").text()) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileEdit_i18n_4, hideAfter: 3});
			return;
		}
		
		if(!clz.getFieldValue("attencePolicy")){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileEdit_i18n_1, hideAfter: 3});
			return;
		}
		if(!clz.getFieldValue("atsShift")){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileEdit_i18n_2, hideAfter: 3});
			return;
		}
		//attencePolicy
		clz.remoteCall({method: "enableFile", param: {billId: billId,proposer:proposer}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileEdit_i18n_20, hideAfter: 3});
			clz.reloadPage();
		}});
	},
	
	disableFileAction: function() {
		var clz = this;
		var billId = $("#id").val();
		
		if(jsBizMultLan.atsManager_attendanceFileEdit_i18n_10 == $("#attendFileState").text()) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileEdit_i18n_3, hideAfter: 3});
			return;
		}
		
		//禁用考勤档案，此日期以后的所有排班记录要删除，给出提示
		var curDate = new Date();
		var curDateY = curDate.getFullYear();
		var curDateD = curDate.getDate();
		curDateD = curDateD<10?"0"+curDateD : curDateD;
		var curDateStr = curDateY + jsBizMultLan.atsManager_attendanceFileEdit_i18n_17
			+ $.shrI18n.dateI18n.month2[curDate.getMonth()]
			+ curDateD + jsBizMultLan.atsManager_attendanceFileEdit_i18n_24;

		shr.showConfirm(shr.formatMsg(jsBizMultLan.atsManager_attendanceFileEdit_i18n_28,[curDateStr]), function(){
			clz.remoteCall({method: "disableFile", param: {billId: billId}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileEdit_i18n_11, hideAfter: 3});
			clz.reloadPage();
			}});
		});
	},
	
	
	matchPunchCardRecordAction: function(){
		var _self = this;
		
		$('#matchCtrl').dialog({
			title: jsBizMultLan.atsManager_attendanceFileEdit_i18n_21,
			width: 750,
			height: 250,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'center',
				of: window
			},
			buttons:[{
				text:jsBizMultLan.atsManager_attendanceFileEdit_i18n_23,
				click: function() {
					if(_self.verifyDiv()){
						_self.matchPunchCardRecord();
					}else{
						shr.showError({message: jsBizMultLan.atsManager_attendanceFileEdit_i18n_14, hideAfter: 3});
					}
				}
			},{
				text: jsBizMultLan.atsManager_attendanceFileEdit_i18n_22,
				click:function() {
					$('#matchCtrl').dialog( "close" );
				}
			}]
		});
	},
	divDialog:function(){
	   var matchDiv = ''
			+ '<div id="matchCtrl" style="display: none;">' 
			+	'<p> </p>'
			+	'<p> </p>'
			+	'<p> </p>'
			+ '<div class="row-fluid row-block " id="">'
			+ '<div data-ctrlrole="labelContainer">'
			+ '<div class="span2">'
			+ '<div class="field_label" title="'
		   + jsBizMultLan.atsManager_attendanceFileEdit_i18n_13
		   + '">'
		   + jsBizMultLan.atsManager_attendanceFileEdit_i18n_13
		   + '</div>'
			+ '</div>'
			+ '<div class="span3 field-ctrl">'
			+ '<input id="beginDate" name="beginDate" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker">'
			
			+ '</div>'
			+ '<div class="span1 field-desc">'
			+ '</div>'
			+ '</div>'
			+ '<div data-ctrlrole="labelContainer">'
			+ '<div class="span2">'
			+ '<div class="field_label" title="'
		   + jsBizMultLan.atsManager_attendanceFileEdit_i18n_9
		   + '">'
		   + jsBizMultLan.atsManager_attendanceFileEdit_i18n_9
		   + '</div>'
			+ '</div>'
			+ '<div class="span3 field-ctrl">'
			+ '<input id="endDate" name="endDate" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker">'
			+ '</div>'
			+ '<div class="span1 field-desc">'
			+ '</div>'
			+ '</div>'
			+ '</div>'
			
			+ '</div>';
			
		$(document.body).append(matchDiv);
		
		$('#beginDate').shrDateTimePicker({//@
			id: "beginDate",
			tagClass: 'block-father input-height',
			readonly: '',
			yearRange: '',
			ctrlType: "Date",
			isAutoTimeZoneTrans:false,
			validate: '{dateISO:true,required:true}'
		});	
	
		$('#endDate').shrDateTimePicker({//@
			id:"endDate",
			tagClass:'block-father input-height',
			readonly:'',
			yearRange:'',
			ctrlType: "Date",
			isAutoTimeZoneTrans:false,
			validate:'{dateISO:true,required:true}'
		});
	},
	
	verifyDiv:function(){
		if(atsMlUtile.getFieldOriginalValue('beginDate')==null ||atsMlUtile.getFieldOriginalValue('beginDate')== ''){
			//shr.showInfo({message: "开始时间不能为空!!", hideAfter: 3});
			return false;
		}
		if(atsMlUtile.getFieldOriginalValue('endDate')==null || atsMlUtile.getFieldOriginalValue('endDate')==''){
			//shr.showInfo({message: "结束时间不能为空!!", hideAfter: 3});
			return false;
		}
		
		return true;
	},
	matchPunchCardRecord: function() {
		var clz = this;
		var attendanceNums = $("#attendanceNum").text();
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		clz.remoteCall({method: "matchPunchCardRecord", param: {attendanceNums:attendanceNums,beginDate:beginDate,endDate:endDate}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileEdit_i18n_18, hideAfter: 3});
			clz.reloadPage();
		}});
	},
	setNavigate:function(){
		var naviagateLength = $("#breadcrumb li").length;
		for(var i=naviagateLength-3;i>0;i--){
			$("#breadcrumb li").eq(i).hide();
		}
	},
	radioBoxInit:function(){
		if(shr.getCurrentViewPage().uipk !="com.kingdee.eas.hr.ats.app.AttendanceFileView.form"){	
			return;
		}
		var that = this ;
		if (that.getOperateState().toUpperCase() != 'EDIT'){
			return;
		}
		var $attendanceNumPar = $("#attendanceNum").parent().parent().parent().parent().parent();
		var html = '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4"><input type="radio" id="radio-1" name="radio-1-set" style=" display: none; " class="regular-radio"  checked  /><label for="radio-1"></label></div>'
			 + '<div class="col-lg-6 field-ctrl"><div class="field_label"  style=" font-size: 13px !important ; float: left;" title="">'
			+ jsBizMultLan.atsManager_attendanceFileEdit_i18n_12
			+ '</div></div>'
			 + '<div />'
			 + '<div class="col-lg-4"><input type="radio" id="radio-2" name="radio-1-set" style=" display: none; " class="regular-radio" /><label for="radio-2"></label></div>'
			 + '<div class="col-lg-6 field-ctrl"><div class="field_label" style=" font-size: 13px !important ; float: left;" title="">'
			+ jsBizMultLan.atsManager_attendanceFileEdit_i18n_0
			+ '</div></div>'
			 + '</div>';
		$attendanceNumPar.prepend(html);
		
		var $isDefaultManage = $("#isDefaultManage").parent().parent().parent().parent().parent().parent();
		html = '<div class="row-fluid row-block"><div data-ctrlrole="labelContainer" style="display: none;" class="field-area flex-c field-basis1">'
			 + '<div class="label-ctrl flex-cc" id="effectDateLabel" ><div class="field-label" title="'
			+ jsBizMultLan.atsManager_attendanceFileEdit_i18n_25
			+ '">'
			+ jsBizMultLan.atsManager_attendanceFileEdit_i18n_25
			+ '</div><div class="field-desc"></div></div>'
			 + '<div class="field-ctrl flex-c"><input id="effectDate" name="effectDate" value="" validate="{dateISO:true,required:true}" placeholder="" type="text" dataextenal=""></div>'
			 + '</div></div>';
		$isDefaultManage.append(html);	 
		$(function() {
			var picker_json = {id:"effectDate"};
			picker_json.tagClass = 'block-father input-height';
			picker_json.readonly = '';
			picker_json.yearRange = '';
			picker_json.validate = '{dateISO:true,required:true}';
			$('#effectDate').shrDateTimePicker($.extend(picker_json,{ctrlType: "Date",isAutoTimeZoneTrans:false}));
			atsMlUtile.setTransDateTimeValue('effectDate',new Date().toJSON().slice(0, 10));
			
			$("#radio-1").click(function(){
				$("#effectDate").parent().parent().parent().parent().parent().hide();
			});
			$("#radio-2").click(function(){
				$("#effectDate").parent().parent().parent().parent().parent().show();
			});
			
		});
	},
	assembleModel: function() {
		var model = shr.assembleModel(this.fields, this.getWorkarea(), this.uuid);
		
		var effectDate = atsMlUtile.getFieldOriginalValue("effectDate");
		var type = $("#radio-1").attr("checked")=="checked"?0:1;  //0--纠正档案  1--变更档案
		
		model.effectDate = effectDate;
		model.type = type;
		
		return model;
	}
	
	,addSocQueryTips:function(){
		var that = this;
		var showTipsCount = '';
		that.addSocQueryTipA("tipsAttFileModi"+showTipsCount);
		that.addSocQueryTipA("tipsAttFileUpdate"+showTipsCount);
		that.addSocQueryTipA("tipsAttCard"+showTipsCount);
		that.addSocQueryTipA("tipsShift"+showTipsCount);
		that.addSocQueryTipA("tipsShiftAuto"+showTipsCount);
		
	},
	
	//添加tips说明
	showTips:function(){		
			var showTipsCount = '';
			var tipsAttFileModiText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_attendanceFileEdit_i18n_8
				+ '<br/>';
			var tipsAttFileUpdateText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_attendanceFileEdit_i18n_7
				+ '<br/>';
			var tipsAttCardText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_attendanceFileEdit_i18n_6
				+ '<br/>';
			var tipsShiftText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_attendanceFileEdit_i18n_16
				+ '<br/>';
			var tipsShiftAutoText = '&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_attendanceFileEdit_i18n_27
				+ '<br/>';
			
			
// 			//此处选择器中用中文括号，页面上是中文
			
//			$('[title="纠正档案信息"]').append('<span id="tipsAttFileModi'+showTipsCount+'"></span>');
			$("#radio-1").parent().next().append('<span id="tipsAttFileModi'+showTipsCount+'"></span>');
//			$('[title="变更档案信息"]').append('<span id="tipsAttFileUpdate'+showTipsCount+'"></span>');
			$("#radio-2").parent().next().append('<span id="tipsAttFileUpdate'+showTipsCount+'"></span>');
			// $('[title="' + jsBizMultLan.atsManager_attendanceFileEdit_i18n_5 + '"]')
			// 	.append('<span id="tipsAttCard'+showTipsCount+'"></span>');
			// $('[title="' + jsBizMultLan.atsManager_attendanceFileEdit_i18n_15 + '"]')
			// 	.append('<span id="tipsShift'+showTipsCount+'"></span>');
			// $('[title="' + jsBizMultLan.atsManager_attendanceFileEdit_i18n_26 + '"]')
			// 	.append('<span id="tipsShiftAuto'+showTipsCount+'"></span>');
			
			var tipsAttFileModiLog = '<div id="tipsAttFileModi'+showTipsCount+'-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;height:50px;position:absolute;left:15%;z-index:1;margin-top:20px;background: aliceblue;"><div style="position:absolute"><font color="gray">'+tipsAttFileModiText+'</font></div></div>';
			var tipsAttFileUpdateLog = '<div id="tipsAttFileUpdate'+showTipsCount+'-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;height:50px;position:absolute;left:55%;z-index:1;margin-top:20px;background: aliceblue;"><div style="position:absolute"><font color="gray">'+tipsAttFileUpdateText+'</font></div></div>';
			//var tipsAttCardLog = '<div id="tipsAttCard'+showTipsCount+'-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;height:100px;position:absolute;left:55%;z-index:1;margin-top:0px;background: aliceblue;"><div style="position:absolute"><font color="gray">'+tipsAttCardText+'</font></div></div>';
			//var tipsShiftLog = '<div id="tipsShift'+showTipsCount+'-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;height:100px;position:absolute;left:55%;z-index:1;margin-top:0px;background: aliceblue;"><div style="position:absolute"><font color="gray">'+tipsShiftText+'</font></div></div>';
			//var tipsShiftAutoLog = '<div id="tipsShiftAuto'+showTipsCount+'-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;height:50px;position:absolute;left:15%;z-index:1;margin-top:0px;background: aliceblue;"><div style="position:absolute"><font color="gray">'+tipsShiftAutoText+'</font></div></div>';
			
			//此处选择器中用中文括号，页面上是中文
			$("#radio-1").parent().next().after(tipsAttFileModiLog);
			$("#radio-2").parent().next().after(tipsAttFileUpdateLog);
			// $('[title="' + jsBizMultLan.atsManager_attendanceFileEdit_i18n_5 + '"]').after(tipsAttCardLog);
			// $('[title="' + jsBizMultLan.atsManager_attendanceFileEdit_i18n_15 + '"]').after(tipsShiftLog);
			// $('[title="' + jsBizMultLan.atsManager_attendanceFileEdit_i18n_26 + '"]').after(tipsShiftAutoLog);
			
			var isAttendance = $("#isAttendance").parent().prev().children('.field-desc');
			var atsShift = $("#atsShift").parent().prev().children('.field-desc');
			var isAutoShift = $("#isAutoShift").parent().prev().children('.field-desc');
			isAttendance.shrTooltip({content: tipsAttCardText});
			atsShift.shrTooltip({content: tipsShiftText});
			isAutoShift.shrTooltip({content: tipsShiftAutoText});
		},
		// 添加 tips 说明（？图片显示以及隐藏）
		addSocQueryTipA: function(tip) {
			var _self = this;
			var tips = $("#"+tip);
			var tipLog = tip+"-dialog";
			tips.parent().find(".field_label").append(tips);
			tips.prop("title", "");
			tips.css({"display": "inline-block"});
			console.log(tip);
			if(tips&&tips.offset()){
				var x = tips.offset().top + 17; 
				var y = tips.offset().left + 10; 
				$(document).on("hover", "#"+tip, event, function (event) {
					event.stopImmediatePropagation();
					event.returnValue = false;
					var id = event.target.id;
		//			var $tipsLayout = $("#tips-dialog");
					var $tipsLayout = $("#"+tipLog);
					var isInTipsLayout =  $tipsLayout && $tipsLayout.length ? true : false; 
		//			if (id !== tip && id !== "tips-dialog" && !isInTipsLayout) {
					if (id !== tip && id !== tipLog && !isInTipsLayout) {
						if (!$tipsLayout.is(':hidden')) {
							$tipsLayout.fadeOut();
						}
					} else if (id === tip) {
						if ($tipsLayout.is(':hidden')) {
							$tipsLayout.fadeIn();
						} else {
							$tipsLayout.fadeOut();
						}
					}		
				});
		}
		
	}
});



