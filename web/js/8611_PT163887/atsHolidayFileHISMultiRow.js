var count = 0;
var sysDate;
$().ready(function() {
	$("#warmTip").css({"margin-left":"75px","color":"red"});
	$("#warmTip").html($.attendmanageI18n.atsHolidayFileHISMultiRow.msg1)
});
shr.defineClass("shr.ats.AtsHolidayFileHIS", shr.framework.MultiRow, {
	
	initalizeDOM:function(){
	
	   shr.ats.AtsHolidayFileHIS.superClass.initalizeDOM.call(this);
	   var that = this ;
//	   $("form:first").css({"border-bottom":"1px solid #eee"});
	   $("div.shr-multiRow").css({"margin":"0"});
	   //隐藏部分field 用于布局
	   $('div [title="hiddenField"]').closest('div [data-ctrlrole="labelContainer"]').attr('style','display:none');
	   //隐藏第一条记录的删除按钮
	   var uuid = $(".view_mainPage.row-fluid")[1].id;
	   $("#delete"+uuid).hide();
	   that.getSysDate();
//	   if(that.getOperateState() == 'VIEW'){
//		   $("#cancelAllMain").hide();
//		   $("#saveAllMain").hide();
//		   $("#warmTip").hide();
//	   }
	   if(that.getOperateState() == 'EDIT'){
		   uuid = that.uuid; 
		   
//		   var id = $("#hrOrgUnit"+uuid).shrPromptBox("getValue").id;
//		   var grid_f7_json ={id:"holidayPolicySet",name:"holidayPolicySet"};
//		   grid_f7_json.subWidgetName = 'shrPromptGrid';
//			grid_f7_json.subWidgetOptions = {
//				title:"假期制度",
//				uipk:"com.kingdee.eas.hr.ats.app.HolidayPolicySet.AvailableList.F7",
//				query:"",
//				filter:"", 
//				domain:""
//			};
//			
//			grid_f7_json.validate = '{required:true}';
//			grid_f7_json.subWidgetOptions.isHRBaseItem = true;
//			grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";
//			grid_f7_json.subWidgetOptions.currentHrOrgUnitId = id;		
//			grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,alias: '显示不常用数据',widgetType: 'checkbox'}];
//			grid_f7_json.subWidgetName = 'specialPromptGrid';
//			$("#holidayPolicySet"+uuid).shrPromptBox(grid_f7_json);
			
			
		   $("#holidayPolicySet"+uuid).shrPromptBox("setBizFilterFields","hrOrgUnit"+uuid);
		   $("#holidayPolicySet"+uuid).shrPromptBox("setBizFilterFieldsValues",$("#hrOrgUnit"+uuid).shrPromptBox("getValue").id);

		   $("#position"+uuid).shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current; 
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileEditHandler&method=getOrgUnitByPosition";
					 shr.ajax({
							type:"post",
							async:false,  
							url:url,
							data:{positionId: info.id},
							success : function(res)
							{
							 	var info = res;
								$("#adminOrgUnit"+uuid+"_el").val( info.adminOrgUnitId);
								$("#adminOrgUnit"+uuid).val(info.adminOrgUnitName);
							}
				 	});
				}
			});
	   }
	}
//	,setButtonVisible: function() {
//		var that = this ;
//		var $workarea = this.getWorkarea();
//		if(that.getOperateState() == 'EDIT'){
//			$workarea.find('.entry-button-top').show();
//			$("#edit"+$workarea[0].id).hide();
//			$("#cancel"+$workarea[0].id).hide();
//			$("#save"+$workarea[0].id).hide();
//		}
//	}
	,closeAllMainAction:function(){
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileView.form'
		});
	}
	/**
	 * 保存
	 */
	,saveAllMainAction: function() {
		var entryLen = $(".view_mainPage.row-fluid").length-1;
		for(var i=0;i<entryLen;i++){
			var uuid = $(".view_mainPage.row-fluid")[i+1].id;
			if($("#attendanceNum"+uuid).val()==""||$("#attendanceNum"+uuid).val()==undefined||
			   $("#attencePolicy"+uuid).val()==""||$("#attencePolicy"+uuid).val()==undefined||
			   $("#holidayPolicySet"+uuid).val()==""||$("#holidayPolicySet"+uuid).val()==undefined||
			   $("#isAttendance"+uuid).val()==""||$("#isAttendance"+uuid).val()==undefined||
			   $("#isAutoShift"+uuid).val()==""||$("#isAutoShift"+uuid).val()==undefined||
			   $("#atsShift"+uuid).val()==""||$("#atsShift"+uuid).val()==undefined||
			   $("#adminOrgUnit"+uuid).val()==""||$("#adminOrgUnit"+uuid).val()==undefined||
			   $("#position"+uuid).val()==""||$("#position"+uuid).val()==undefined||
			   $("#EFFDT"+uuid).val()==""||$("#EFFDT"+uuid).val()==undefined||
			   $("#LEFFDT"+uuid).val()==""||$("#LEFFDT"+uuid).val()==undefined
			){
				shr.showInfo({message: $.attendmanageI18n.atsHolidayFileHISMultiRow.msg2, hideAfter: 3});
				return;
			}
		}
		
		var predate = new Date(new Date(atsMlUtile.getFieldOriginalValue("EFFDT").replace(/-/g,"/")).valueOf()-1000*60*60*24);
		var boo = false;
		for(var i=0;i<entryLen;i++){
			var uuid = $(".view_mainPage.row-fluid")[i+1].id;
			var effdt =  $("#EFFDT"+uuid).val();
			var leffdt =  $("#LEFFDT"+uuid).val();
			if(predate){
				if(new Date(leffdt.replace(/-/g,"/")).valueOf()!=predate.valueOf()){
					boo = true;
					break;
				}
			}
			if(effdt>leffdt){
				boo = true;
				break;
			}
			predate=new Date(new Date(effdt.replace(/-/g,"/")).valueOf()-1000*60*60*24)
		}
		if(boo){
			shr.showInfo({message: $.attendmanageI18n.atsHolidayFileHISMultiRow.msg3, hideAfter: 3});
			return;
		}
		for(var i=0;i<entryLen;i++){
			$(".view_mainPage.row-fluid").eq(i+1).find("[name='save']").click();
		}
		$("#saveAllMain").hide();
		$("#cancelAllMain").hide();
		$("#editAllMain").show();
		$("#closeAllMain").show();
        
//		var _self = this;
//		var saveFile = function(){
//			if(count==entryLen){
//				 shr.ats.AttendanceFileHIS.superClass.reloadPage({
//					uipk: "com.kingdee.eas.hr.ats.app.AttendanceFileHIS.form",
//					method: 'initalizeData'
//				});		
//			}else{
//				setTimeout(saveFile,3000);
//			}
//		}
//		saveFile();
	}
	/**
	 * 编辑
	 */
	,editAllMainAction: function() {
		var _self = this;
//		this.reloadPage({
//			uipk: "com.kingdee.eas.hr.ats.app.AttendanceFileHIS.form",
//			billId: _self.billId,
//			method: 'editFile'
//		});		
		var entryLen = $(".view_mainPage.row-fluid").length-1;
		for(var i=0;i<entryLen;i++){
			$(".view_mainPage.row-fluid").eq(i+1).find("[name='edit']").click();
		}
		$("#saveAllMain").show();
		$("#cancelAllMain").show();
		$("#editAllMain").hide();
		$("#closeAllMain").hide();
	}
	/**
	 * 取消
	 */
	,cancelAllMainAction: function() {
//		var _self = this;
//		this.reloadPage({
//			uipk: "com.kingdee.eas.hr.ats.app.AttendanceFileHIS.form",
//			billId: _self.billId,
//			method: 'initalizeData'
//		});	
		var entryLen = $(".view_mainPage.row-fluid").length-1;
		for(var i=0;i<entryLen;i++){
			$(".view_mainPage.row-fluid").eq(i+1).find("[name='cancel']").click();
		}
		$("#cancelAllMain").hide();
		$("#saveAllMain").hide();
		$("#editAllMain").show();
		$("#closeAllMain").show();
	}
	,editFileAction : function(options) {
		var _self = this;
		_self.doEdit('editFile', options);
	}
	/**
	 * 新增
	 */
	,addNewAction: function() {		
		var params = this.prepareParam();
		var self = this;
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			params.relatedFieldId = relatedFieldId;
		}
		params.holidayPolicySetId=$('#form #id').val();
		params.method = 'addNew';
		params.billId = this.billId;
		// 片断
		var _self = this;
		shr.doGet({
			url: _self.dynamicPage_url,
			data: params,
			success: function(response) {
				var next;
				if (_self.isEmpty()) {
					$('.shr-multiRow').append(response);
//					var $workarea = _self.getWorkarea();
//					$workarea.find('.entry-button-top').show();
//					$("#addNew"+$workarea[1].id).hide();
//					$("#edit"+$workarea[1].id).hide();
//					$("#save"+$workarea[1].id).hide();
//					$("#saveAllMain").show();
//					$("#cancelAllMain").show();
//					$("#editAllMain").hide();
//					$("#closeAllMain").hide();
				} else {
					var $workarea = _self.getWorkarea();
					$workarea.after(response);
					next = $workarea.next();
					while(next.length > 0) {
						if (next.hasClass('view_mainPage')) {
							break;
						}
						next = next.next();
					}
					next.find('.entry-button-top').show();
//					$("#addNew"+next[0].id).show(); 
//					$("#edit"+next[0].id).hide();
//					$("#save"+next[0].id).hide();
				}
				_self.afterMultiRowRender();
				_self.adjustIframeHeight();
				
				if (next) {
					shr.locateTo(next);
					var uuid = next.get(0).id;
					setTimeout(function(){
					
						$("#holidayPolicySet"+uuid).shrPromptBox("setBizFilterFields","hrOrgUnit"+uuid);
						$("#holidayPolicySet"+uuid).shrPromptBox("setBizFilterFieldsValues",$("#hrOrgUnit"+uuid).shrPromptBox("getValue").id);
						$("#calendar"+uuid).shrPromptBox("setBizFilterFields","hrOrgUnit"+uuid);
						$("#calendar"+uuid).shrPromptBox("setBizFilterFieldsValues",$("#hrOrgUnit"+uuid).shrPromptBox("getValue").id);
						
						$("#position"+uuid).shrPromptBox("option", {
							onchange : function(e, value) {
								var info = value.current; 
								var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileEditHandler&method=getOrgUnitByPosition";
								 shr.ajax({
										type:"post",
										async:false,  
										url:url,
										data:{positionId: info.id},
										success : function(res)
										{
										 	var info = res;
											$("#adminOrgUnit"+uuid+"_el").val( info.adminOrgUnitId);
											$("#adminOrgUnit"+uuid).val(info.adminOrgUnitName);
										}
							 	});
							}
						});
						$("#holidayPolicySet"+uuid).shrPromptBox("option", {
							onchange : function(e, value) {
								var info = value.current;
								var calen = $("#calendar"+uuid).shrPromptBox("getValue");
								if(info && info['workCalendar.id'] && !(calen && calen.id)){
									$("#calendar"+uuid).shrPromptBox("setValue", {id:info['workCalendar.id'],name:info['workCalendar.name']});
								}
							}
						});
					},100);
					
					
				}
			}
		});
	}
	/**
	 * 编辑
	 */
	,editAction: function(options) {
		this.doEdit('edit', options);
		
	}
	/**
	 * 保存
	 */
	,saveAction: function(event) {
		var _self = this;
		var workArea = _self.getWorkarea();
		var uuid = workArea.get(0).id;
		$form = $('form', workArea);
	
		if ($form.valid()&&_self.verify()&&_self.checkAttendanceNum(uuid)) {	//界面校验通过	
			 _self.doSave(event, 'save');
		}	
     }
	,verify: function(){
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileHISMulitRowHandler&method=getSysDate";
		 shr.ajax({
				type:"post",
				async:false,  
				url:url,
				success : function(res)
				{
					return res;
				}
	 	});
		var entryLen = $(".view_mainPage.row-fluid").length-1;
		var boo = false;
		var predate;
		var nextdate;
		var time;
		if(sysDate==""||sysDate==undefined){
			time=new Date().valueOf();
		}else{
			time=new Date(sysDate.replace(/-/g,"/")).valueOf()
		}
		for(var i=0;i<entryLen;i++){
			var uuid = $(".view_mainPage.row-fluid")[i+1].id;
			var effdt =  $("#EFFDT"+uuid).val();
			if(new Date(effdt.replace(/-/g,"/")).valueOf()>time){
				shr.showInfo({message: $.attendmanageI18n.atsHolidayFileHISMultiRow.msg4, hideAfter: 5});
				return false;
			}
			var leffdt =  $("#LEFFDT"+uuid).val();
			if(nextdate){
				if(new Date(effdt.replace(/-/g,"/")).valueOf()>=nextdate.valueOf()){
					shr.showInfo({message: $.attendmanageI18n.atsHolidayFileHISMultiRow.msg5, hideAfter: 5});
					return false;
				}
			}
			if(predate){
				if(new Date(leffdt.replace(/-/g,"/")).valueOf()>predate.valueOf()){
					boo = true;
					break;
				}
			}
			if(effdt>leffdt){
				boo = true;
				break;
			}
			predate = new Date(new Date(effdt.replace(/-/g,"/")).valueOf()-1000*60*60*24);
			nextdate = new Date(new Date(leffdt.replace(/-/g,"/")).valueOf()+1000*60*60*24);
		}
		if(boo){
			shr.showInfo({message: $.attendmanageI18n.atsHolidayFileHISMultiRow.msg6, hideAfter: 5});
			return false;
		}else{
			return true;
		}
	}
	,getSysDate:function(){
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileHISMulitRowHandler&method=getSysDate";
		 shr.ajax({
				type:"post",
				async:false,  
				url:url,
				success : function(res)
				{
			 		sysDate=res.sysDate;
				}
	 	});
	}
	/**
	 * 保存真正执行方法
	 */
	,doSave: function(event, action) {
		var _self = this;
		var data = _self.assembleSaveData(action);
		data.model = "{"+data.model.substr(data.model.indexOf(",")+1);
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		shr.doAction({
			target: target,
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			async: false,
			success : function(response) {
				count++;
				if (_self.isFromF7()) {
					// 来自F7，关闭当前界面，并给F7设置
					var dataF7 = {
						id : response,
						name : $.parseJSON(data.model).name
					};
					dialogClose(dataF7);
				} else {
					// 普通保存，去除最后一个面包屑，防止修改名字造成面包屑重复
					shrDataManager.pageNavigationStore.pop();
					
					_self.viewAction(response);
				}
			}
		});	
	}
	//校验考勤编号
	,checkAttendanceNum:function (uuid){
		var _self = this;
		var info;
	
		var attendanceNum = $("#attendanceNum"+uuid).val();
		_self.remoteCall({
			type:"post",
			method:"checkAttendanceNum",
			async: false,
			param:{
				attendanceNum:attendanceNum,
				personId:$("#proposer").val()
			},
			success:function(res){
				info =  res;
				
			}
		});
		if (!info.errorTag) {
				var showMes=info.errorLog;
				shr.showInfo({message: showMes, hideAfter: 5});
				return false;
			} else {
				return true;
			}
	}
});
