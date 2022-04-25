var bactchAssignResultIds = [];
var hideButtonId = [];
shr.defineClass("shr.ats.atsResultCalDynamicList", shr.ats.atsResultDynamicList, {
	isConfirm: false,
	initalizeDOM : function () {
		var _self = this;
		shr.ats.atsResultCalDynamicList.superClass.initalizeDOM.call(_self);
		_self.onNaviLoad();
		//初始化页面点击事件,查看后台事物,未参与计算单据
		shr.attenceCalCommon.initClickEvent(this.dateSelectName);
		//查看后台事务，未参与计算单据count
		var beginDate,endDate; 
		if(shr.attenceCalCommon.getFilterParamValues(this.dateSelectName)){
	 		beginDate = shr.attenceCalCommon.getFilterParamValues(this.dateSelectName)["startDate"];
	  		endDate = shr.attenceCalCommon.getFilterParamValues(this.dateSelectName)["endDate"];
		}
		shr.attenceCalCommon.initWorkFlowBillsCheckedCount(beginDate,endDate);
		shr.attenceCalCommon.initviewTransaction(this.dateSelectName);
		
		shr.attenceCalCommon.initBreadCrumb();
		
		//自动往日期表追加一年的日期数据（从今天开始往后一年）,如果已经存在则不新增
//		_self.initDateSetAction();
		hideButtonId = this.initData.atsCalButton;
	},
	//导入
	importDataAction:function(){
			//修改导入按钮为调用平台的方法
			this.doImportData('import');
	},
	//全部计算
	allAttendCaculateAction: function(){
		var _self = this;
		//明细模式与汇总模式调用公共的方法，但ACTION不同，负责自己的CalAllAction方法
		var dateSet = shr.attenceCalCommon.getFilterParamValues("dateSet.date");
		if(dateSet && dateSet["startDate"] != "" && dateSet["endDate"] != ""){
			shr.attenceCalCommon.showCalDialogAction(_self,_self.CalAllAction);
		}else {
//			shr.showWarning({message : "请选择过滤条件执行查询！"});
		 		return ;
		}
	},
	// 明细模式全部计算
	CalAllAction:function(){  
		var self = this;
		var beginDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
		var endDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
		var hrOrgUnitId = shr.attenceCalCommon.getFilterParamValues("hrOrg");
		
		if($("#realBeginDate").val()!=undefined && $("#realEndDate").val()!=undefined){//@
			beginDate = atsMlUtile.getFieldOriginalValue("realBeginDate");
			endDate = atsMlUtile.getFieldOriginalValue("realEndDate");
		}
		
		var cardLen = $('input[name="isAgainFetchCard"]:checked').length ;
		var isCalUnOffWork = $('input[name="isCalUnOffWork"]:checked').length ;
		var serviceId = encodeURIComponent(shr.getUrlRequestParam("serviceId"));
		var url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper";
		    url +="&uipk=com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList$fragment&serviceId=" +serviceId;
		openLoader(1);
		 shr.remoteCall({
			type : "post",
			url  : url,
			method : "calAllAttendanceBoardDyna",
			param : {
				hrOrgUnitId:hrOrgUnitId,
				beginDate : beginDate,
				endDate : endDate,
				isAgainFetchCard : cardLen,
				isCalUnOffWork: isCalUnOffWork
			},
			success : function(res){
				closeLoader();
				window.parent.$("#calendar_info").dialog('close');
				if(res.flag == 1){
					shr.showInfo({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_16}); 
				}else if(res.flag == 2){
					shr.showError({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_6});
				}else{
					shr.showError({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_17});
				}
			},
			error : function() {
					closeLoader();
			},
			complete : function() {
				closeLoader();
			}
 		})	
	},
	//计算选中行
	selectAttendCaculateAction: function(){
		var self = this;
		var $grid = $("#grid");
		var personIndex = 'person.id' ;
		var sid = $grid.jqGrid("getSelectedRows");
		var len = sid.length ;
		var filter=[];
		var personStr = "";
		var attendDateStr="";
		if(len > 0){
			var pidArray=new Array();
			for ( var i in sid) {
				var item = sid[i];
				var data =  $grid.jqGrid("getCell", item,personIndex);
				if(data !=undefined ){
					if(pidArray.indexOf(data)==-1){
						if(personStr.length > 0)
						{
							personStr +=",";
						}
						personStr += data;	
					}
				}
				//已计算页签--明细模式显示--计算选中行,需要获取所选明细记录的日期
				var date =  $grid.jqGrid("getCell", item,"dateSet.date");
				if(date !=undefined ){
					if(attendDateStr.length > 0)
					{
						attendDateStr +=",";
					}
					attendDateStr += date;	
				}
		  	}
		  	if(personStr == "" || personStr == "false"){
		  		shr.showWarning({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_18});
		 		return ;
		  	}
		  	
		  	var mes= jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_41;
			shr.showConfirm(mes,
				function(){
					self.selectAttendCaculate(personStr,attendDateStr);
				}
			);
		}else{
			shr.showWarning({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_18});
		 	return ;
		}
	},
	//计算选中
	selectAttendCaculate: function(personStr,attendDateStr){
		var hrOrg = shr.attenceCalCommon.getFilterParamValues("hrOrg");
		var isCalUnOffWork = $('input[name="isCalUnOffWork"]:checked').length ;
		//明细模式显示--计算选中行,需要获取所选明细记录的日期
		var url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper";
		openLoader(1);
		shr.remoteCall({
			type:"post",
			url:url,
			method:"calculatePersonOneDayForDetail",
			param : {
				attendDate : attendDateStr,
				personId: personStr,
				hrOrgUnitId:hrOrg,
				isCalUnOffWork:1
			},
			success:function(res){
				closeLoader();
				if(res.flag == 1){
					shr.showInfo({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_15}); 
					jQuery('#grid').trigger("reloadGrid");
				}else if(res.flag == 2){
					shr.showInfo({message: res.errorMsg,hideAfter:10});
					jQuery('#grid').trigger("reloadGrid");
				}else{
					shr.showError({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_17});
				}
			},
			error:function(){
				closeLoader();
				shr.showError({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_17});
			},
			complete:function(){
				closeLoader();
			}
		});
	},
 	//明细显示或汇总显示
 	onNaviLoad : function() {
 		var that = this;
 		$('#switchDetail').parent().click(function(){
			if($("#switchDetail").attr("font")=="resultDetail"){
				that.pageStep = 0;
				that.changePageLabelColor();
				that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.AttenceResultSum.list'
			    });	
			}else {
				that.pageStep = 0;
				that.changePageLabelColor();
				that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList'
			    });
			}
		}) ;
		
		$('#unCalList').parent().click(function(){
				that.pageStep = 0;
				that.changePageLabelColor();
				that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResultUncalList',
					currentCalUrl: currentCalUrl
			    });	
		}) ;
 	},
 	//初始化日期表的数据
	initDateSetAction: function(){
		var that = this;
		that.remoteCall({
		      type: "post",
		      async: false,
		      method:"initDateSet",
		      param:{},
		      success: function(res){
		    	  shr.showWarning({message: res});
		    }
	    });
	},
  	//根据考勤制度id获取是否开启考勤确认
  	setIsConfirm:function(attendPolicyId){
  		var self = this;
  		if(attendPolicyId!=undefined){
  			var url = shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelCalHandler";
			self.remoteCall({
			  	type : "post",
			  	async:false, 
			  	url: url,
			  	method : "isConfirm",
			  	param : {
			  			id:attendPolicyId
			  	},
			  	success : function(res){
						if(res.flag ==1 ){
							self.isConfirm = true;
						}else{
							self.isConfirm = false;
						}
			  		}
			   })  		
  		}
  	},
  	//审核
  	auditAction: function(){
  		var self = this;
  		self.setIsConfirm(shr.attenceCalCommon.getFilterParamValues("attencePolicy"));
  		var contentLen = $("#grid").jqGrid("getRowData").length ;
		if(contentLen == 0){
			shr.showInfo({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_8}); 
			return ;
		};
		var sid = $("#grid").jqGrid("getSelectedRows");
		if(sid.length==0){
			var mes= self.isConfirm ? jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_12 : 
				jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_42;
			shr.showConfirm(mes,
				function(){
					self.auditAttendance("audit");
				}
			);
		}else {
			var mes= self.isConfirm ? jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_12 
					: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_43;;
			shr.showConfirm(mes,
				function(){
					self.auditAttendance("audit");
				}
			);
		}
  	},
  	//反审核
  	auditBackAction: function(){
  		var self = this;
  		var contentLen = $("#grid").jqGrid("getRowData").length ;
		if(contentLen == 0){
			shr.showInfo({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_7}); 
			return ;
		};
		var sid = $("#grid").jqGrid("getSelectedRows");
		if(sid.length==0){
			var mes= jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_39;
			shr.showConfirm(mes,
				function(){
					self.auditAttendance("auditBack");
				}
			);
		}else {
			var mes= jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_40;
			shr.showConfirm(mes,
				function(){
					self.auditAttendance("auditBack");
				}
			);
		}
  	},
	//审核
	auditAttendance: function(methodName){ 
		var _self = this;
		var sid = $("#grid").jqGrid("getSelectedRows");
		var fids="";
		if(sid.length>0){
			for (var i in sid) {
				var item = sid[i];
				var data = $("#grid").jqGrid("getRowData", item);
				if(data['ATS_RESULT.id']!=undefined ){
					var recordId=data['ATS_RESULT.id'] ;
					if(i==sid.length-1){
						fids+="'"+recordId+"'";
					}
					else{
						fids+="'"+recordId+"',";
					}		
				}
		  	}
		}
		var beginDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
		var endDate = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
		var attendPolicyId = shr.attenceCalCommon.getFilterParamValues("attencePolicy");
		var isConfirm = _self.isConfirm;
		openLoader(1);
		_self.remoteCall({
			type : "post",
			method : methodName ? methodName : "audit",
			param : {
				beginDate : beginDate,
				endDate : endDate,
				fids:fids,
				attendPolicyId: attendPolicyId,
				isConfirm: isConfirm
			},
			success : function(res){
				closeLoader();
				if(res.flag=="1")
				{
					if(methodName == "audit"){
						shr.showInfo({message : shr.formatMsg(jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_37, [res.successCount])});
					}else {
						shr.showInfo({message : shr.formatMsg(jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_9, [res.successCount])});
					}
					jQuery('#grid').jqGrid("reloadGrid");
				}else{
					if(methodName == "audit"){
						shr.showInfo({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_38});
					}else {
						shr.showInfo({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_10});
					}
				}
			},
			error: function(){
				closeLoader();
			},
			complete:function(){
				closeLoader();
			}
	 	});
	},
	//删除
	deleteAction: function(){
		var _self = this ;
	 	sid = $("#grid").jqGrid("getSelectedRows");
		var ids = [];
		for ( var i in sid) {
			var item = sid[i];
			var data = $("#grid").jqGrid("getRowData", item)["ATS_RESULT.id"];
			ids.push(data);
		}
		var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList&method=delete"
		if(ids.length > 0){
			shr.showConfirm(jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_19, function() {
				shr.ajax({
					type:"post",
					url:url,
					data:{
						ids : ids.join(',')
					},
					success:function(res){
						if(res.flag=="1"){
							shr.showInfo({message : shr.formatMsg(jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_35, [res.successCount])});
							jQuery('#grid').jqGrid("reloadGrid");
						}else{
							shr.showInfo({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_36});
						}
					}
				}); 
			});
		}
		else{
			shr.showError({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_29});
//			shr.showConfirm('您确认需要删除全部考勤结果记录吗？', function() {
//				shr.ajax({
//					type:"post",
//					url:url,
//					success:function(res){
//						shr.showInfo({message: "删除成功!"});
//						jQuery('#grid').trigger("reloadGrid");
//					}
//				}); 
//			});
		}
	},
	
	//请假
	leaveBillAction: function(){
		shr.atsResultCalBill.leaveBillNew();
	},
	//补卡
	fillSignCardAction: function(){
		shr.atsResultCalBill.fillSignCardNew();
	},
	//出差
	tripBillAction: function(){
		shr.atsResultCalBill.tripBillNew();
	},
	//加班
	overTimeBillAction: function(){
		shr.atsResultCalBill.overTimeBillNew();
	},
	//清除基础数据缓存
	clearBaseDataAction: function(){
		var _self= this;
		openLoader(1); 
		_self.remoteCall({
			type : "post",
			method : "clearBaseData",
			param : {},
			success : function(res){
				closeLoader();
				if(res.flag=true)
				{
					 shr.showInfo({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_2});
				}else{
					 shr.showInfo({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_3});
				}
			},
			error: function(){
				closeLoader();
			},
			complete:function(){
				closeLoader();
			}
		});
	},
	//催办
	pressToConfirmAction: function(){
		var _self = this;
		_self.setIsConfirm(shr.attenceCalCommon.getFilterParamValues("attencePolicy"));
		if(_self.isConfirm){
			var sid = $("#grid").jqGrid("getSelectedRows");
			var fids="";
			var fidArray=new Array();
			if(sid.length>0){
				shr.showConfirm(jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_33,function(){
					for ( var i in sid) {
						var item = sid[i];
						var data = $("#grid").jqGrid("getRowData", item);
						fidArray.push(data["ATS_RESULT.id"]);
					}
					for(var i=0;i<fidArray.length;i++){
						if(i==fidArray.length-1){
							fids+="'"+fidArray[i]+"'";
						}else{
							fids+="'"+fidArray[i]+"',";
						}	
					}
					
	 				var serviceId = encodeURIComponent(shr.getUrlRequestParam("serviceId"));
					if(fids!=""){
						_self.pressToConfirm(fids);
					}else{
						shr.showError({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_28});
					}
				})
			}else{
				shr.showConfirm(jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_32,function(){
					_self.pressToConfirm("cbqb");
				})
			}					
		}else{
			shr.showError({message:jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_13});
		}
	},
	//催办
	pressToConfirm: function(fids){
		var _self= this;
		var attendPolicyId = shr.attenceCalCommon.getFilterParamValues("attencePolicy");
		openLoader(1); 
		_self.remoteCall({
			type : "post",
			method : "pressToConfirm",
			param : {
				fids:fids,
				attendPolicyId:attendPolicyId
			},
			success : function(res){
				closeLoader();
				if(res.flag=true)
				{
					 shr.showInfo({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_4});
				}else{
					 shr.showInfo({message : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_5});
				}
			},
			error: function(){
				closeLoader();
			},
			complete:function(){
				closeLoader();
			}
		});
	},
	//排班批量修改
	scheduleShiftBatchEditAction: function(){
		var sid = $("#grid").jqGrid("getSelectedRows");
		if(sid.length==0){
			shr.showWarning({ message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_25 });
			return;
		}
		var personStr = "";
//		var personNameStr ="";
		var attendDateStr="";
		var s1toS6="";//拼接s1-s6
		for (var i=0;i<sid.length;i++)
		{
			var item = sid[i];
			var data =  $("#grid").jqGrid("getCell", item,"person.id");
			var date =  $("#grid").jqGrid("getCell", item,"dateSet.date");
//			var personName =  $("#grid").jqGrid("getCell", item,"person.name");
			if(personStr.length > 0)
			{
				personStr +=",";
			}
			personStr += data;	
			if(attendDateStr.length > 0)
			{
				attendDateStr +=",";
			}
			attendDateStr += date.substring(0,10);		
//			if(personNameStr.length > 0)
//			{
//				personNameStr +=",";
//			}
//			personNameStr += personName;	
		}
		var beginDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
		var endDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
 		var url = shr.getContextPath()+"/dynamic.do?iframe=detailOperationDialog-frame&personStr="+encodeURIComponent(personStr)+"&attendDateStr="+attendDateStr+"&beginDateStr="+beginDateStr+"&endDateStr="+endDateStr+"&uipk=com.kingdee.eas.hr.ats.app.CalScheduleShiftBatchEdit";
		url += '&iscal=true';
		 var serviceId = shr.getUrlRequestParam("serviceId");
		 url += '&serviceId='+encodeURIComponent(serviceId);
 		var leavebillDialog = $("#detailOperationDialog");
 		leavebillDialog.children("iframe").attr('src',url);
 		leavebillDialog.dialog({
 	 		autoOpen: true,
 			title: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_21,
 			width:1100,
 	 		minWidth:950,
 	 		height:750,
 	 		minHeight:600,
 			modal: true,
 			resizable: true,
 			position: {
 				my: 'center center',
 				at: 'center center',
 				of: window
 			},
 			close : function(){
 		 		leavebillDialog.children("iframe").attr('src',"");
 			}
 		});
		$("#detailOperationDialog").css({"overflow-y":"scroll"});	
		$("div[aria-describedby='detailOperationDialog']").css("top","130px");
	},
	
	scheduleShiftBatchValAction: function(){
		var sid = $("#grid").jqGrid("getSelectedRows");
		 if(sid.length==0){
				shr.showWarning({
					message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_25
				});
			return;
		 }
		var hrOrgId = "";
		for(var i=0;i<sid.length;i++){
			var item = sid[i];
			if(hrOrgId != "" &&
				hrOrgId != $("#grid").jqGrid("getCell", item,"hrOrg.id")) {
				shr.showError({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_27});
				return;
			}else{
				hrOrgId = $("#grid").jqGrid("getCell", item,"hrOrg.id");
			}
		}
		var personStr = "";
//		var personNameStr ="";
		var attendDateStr="";
		var personNum="";
		var s1toS6="";//拼接s1-s6
		for (var i=0;i<sid.length;i++)
		{
				var item = sid[i];
				var data =  $("#grid").jqGrid("getCell", item,"person.id");
				var date =  $("#grid").jqGrid("getCell", item,"dateSet.date");
//				var personName =  $("#grid").jqGrid("getCell", item,"person.name");
				var number =  $("#grid").jqGrid("getCell", item,"person.number");
				if(personStr.length > 0)
				{
					personStr +=",";
				}
				if(personNum.length>0){
					personNum+=",";
				}
				personNum += number;
				personStr += data;	
				if(attendDateStr.length > 0)
				{
					attendDateStr +=",";
				}
				attendDateStr += date.substring(0,10);		
//				if(personNameStr.length > 0)
//				{
//					personNameStr +=",";
//				}
//				personNameStr += personName;	
		}
		var beginDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
		var endDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
		var _self = this;
		$("#scheduleShiftBatchValDialog").dialog({
			    title: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_20,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+55%',
					of: window
				},
				open : function(event, ui) {
					var that = this;
					var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
							 + '<div style=" padding-left: 50px; color: red; ">' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_44 
							 + '</div>'
							 + '<div class="row-fluid row-block ">'
							 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_11 
							 + '</div></div>'
							 + '</div>'
							 + '<div class="row-fluid row-block ">'
							 + '<div class="col-lg-4" style="text-align:center"><div class="field_label" title="'
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_34 
							 + '">' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_34 
							 + '</div></div>'
							 + '<div class="col-lg-6 field-ctrl"><div class="ui-text-frame disabled"><input id="dateType" name="dateType" class="block-father input-height" type="text" validate="" ctrlrole="text" disabled="disabled" autocomplete="off"  title=""></div></div>'
							 + '<div class="col-lg-4" style="text-align:center"><div class="field_label" title="' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_0 
							 + '">' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_0 
							 + '</div></div>'
							 + '<div class="col-lg-6 field-ctrl"><input id="shift"  name="shift" readonly="readonly" style="cursor:pointer;background-color:#ffffff" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
							 + '</div>'
							 + '<div class="row-fluid row-block ">'
							 + '<div class="col-lg-4" style="text-align:center"><div class="field_label" title="' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_30 
							 + '">' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_30 
							 + '</div></div>'
					     	 + '<div class="col-lg-6 field-ctrl"><input id="cardRule" name="cardRule" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
							 + '</div>'
							 + '<div style="height:40px" ></div>'
							 + '<div class="row-fluid row-block " style="display: flex;justify-content: flex-end;">'
							 + '<div class="col-lg-3 field-ctrl" style="width:auto"><button type="button" class="shrbtn-primary shrbtn" name="' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_22 
							 + '" id="batchAddVal">' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_22 
							 + '</button></div>'
							 + '<div class="col-lg-2 field-ctrl"><button type="button" class="shrbtn-primary shrbtn" name="' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_31 
							 + '" id="cancle">' 
							 + jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_31 
							 + '</button></div>'
							 + '</div>'
							 
							 + '</form>'
					$("#scheduleShiftBatchValDialog").html(html);

						$("#shift").click(function(){
								

		    			    var that = this;
							var url = shr.getContextPath()+ '/dynamic.do?method=initalize&flag=turnShiftForCal'
														+ '&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list';
							 var serviceId = shr.getUrlRequestParam("serviceId");
							 var hrOrgUnitObj = null;
							 if($("#hrOrgUnit")){
							 	hrOrgUnitObj = '{"id": "'+ hrOrgId + '","name" : ""}';
							 }else {
							 	hrOrgUnitObj = JSON.stringify($("#hrOrgUnit").shrPromptBox('getValue'));//获取业务组织
							 }
							
							 url += '&serviceId='+encodeURIComponent(serviceId)+'&hrOrgUnitObj='+encodeURIComponent(hrOrgUnitObj);
							var leavebillDialog = $("#detailOperationDialog");
							$("#iframe1").attr("src",url);
							$("#iframe1").dialog({
								modal : false,
								title : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_46,
								width : 1035,
								minWidth : 1035,
								height : 505,
								minHeight : 505,
								open : function(event, ui) {
								},
								close : function() {
			 						 var shiftID = $("#iframe1").attr('shiftID');
									if(shiftID && shiftID != ""){
										var title = $("#iframe1").attr('title');
										var dayType="";
										var dayTypeValue="";
										var shiftName="";

										if(title){
											var _dayType = [
												$.attendmanageI18n.workShiftStrategy.dayType1,
												$.attendmanageI18n.workShiftStrategy.dayType2,
												$.attendmanageI18n.workShiftStrategy.dayType3
											];
											dayTypeValue = title.substring(1,title.indexOf("]"));
											dayType = _dayType[dayTypeValue];
											shiftName = title.substring(title.indexOf("]")+1,title.length);
										}
											
										$("#shift").val(shiftName);
										$("#shift").attr("shifID",shiftID);
										
										$("#dateType").val(dayType);
										$("#dateType").attr("dayTypeValue", dayTypeValue);
										var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler&method=getShiftItemInfo";
										shr.remoteCall({
											type:"post",
											async:false,
											url:url,
											param:{atsShiftId: shiftID},
											success:function(res){
												if(res && res.records){
													$('#cardRule').shrPromptBox("setFilter","startSegmentNum = " + res.records);
												}
												
											}
										});		
										$("#iframe1").attr('shiftID',"");	
									}else{
										$('#cardRule').shrPromptBox("setFilter","" );
									}
								}
							});
							
							$("#iframe1").attr("style", "width:1035px;height:505px;");
						});
					//取卡规则
					grid_f7_json = null;
					grid_f7_json = {id:"cardRule",name:"cardRule"};
					grid_f7_json.subWidgetName = 'shrPromptGrid';
//						
					grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_30,
							uipk:"com.kingdee.eas.hr.ats.app.CardRule.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false};
					grid_f7_json.readonly = '';
					grid_f7_json.validate = '';
					grid_f7_json.value = {id:"",name:""};
					grid_f7_json.subWidgetOptions.isHRBaseItem = true;
					grid_f7_json.subWidgetOptions.currentHrOrgUnitId = hrOrgId;
					grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,
						alias: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_45,
						widgetType: 'checkbox'}];
					grid_f7_json.subWidgetName = 'specialPromptGrid';
					grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
					$('#cardRule').shrPromptBox(grid_f7_json);
					$('#cardRule').shrPromptBox("setBizFilterFieldsValues",hrOrgId);
					//要将form加上，数据校验才有用。
				    var formJson = {
						id: "form"
					};
					$('#form').shrForm(formJson);
				
					$("#cardRule").change(function(){
						var dateType =$("#dateType").val();
						if(!dateType){
							$("#cardRule").val("");
							$("#cardRule_el").val("");
							shr.showWarning({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_24});
							
						}
					});
					
					$('button[id^=batchAddVal]').click(function() {
						if (($("#shift").val()==null　|| $("#shift").val()=="")&& $("#dateType").attr("dayTypeValue")=="0"){
			    			shr.showWarning({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_26});
			    			return;
			    		}
						$(this).disabled = true;
						var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CalScheduleShiftBatchEditHandler&method=batchVal";
						openLoader(1,jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_47);
						var shiftId= $("#shift").attr("shifID");
						var dayType= $("#dateType").attr("dayTypeValue");
						shr.ajax({
							type:"post",
							async:true,
							url:url,
							data:{"personStr":personStr,
								  "attendDateStr":attendDateStr,
								  "shiftId": shiftId,
								  "cardRuleId":$("#cardRule_el").val(),
								  "personNum":personNum,
								  "dayType":dayType},
							success:function(res){
								closeLoader();
								if(res.flag==1){
									shr.showError({message: res.errorStr});
								}
								else{
									shr.showInfo({message: jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_1});
									jQuery('#grid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
									$("#scheduleShiftBatchValDialog").dialog("close");
								}				
						    }
						});
					});
					
					$('button[id^=cancle]').click(function() {
						$("#scheduleShiftBatchValDialog").dialog("close");
					});	
					
					
			    },
			    close : function() {
				    $("#scheduleShiftBatchValDialog").empty();
			    }
			});	
			$("#scheduleShiftBatchValDialog").css({"height":"250px"});
			$("#scheduleShiftBatchValDialog").css({"margin-top":"5px"});
			$("div[aria-describedby='scheduleShiftBatchValDialog']").css("top","175px");
	},
	//批量赋值
	batchAssignAction: function(){
		var _self = this;
		
		var sid = $("#grid").jqGrid("getSelectedRows");
		bactchAssignResultIds = [];
		if(sid.length > 0){
			for (var i=0;i<sid.length;i++)
			{
				var item = sid[i];
				var resultId =  $("#grid").jqGrid("getCell", item,"ATS_RESULT.id");
				if(bactchAssignResultIds.length > 0)
				{
					bactchAssignResultIds +=",";
				}
				bactchAssignResultIds +=encodeURIComponent(resultId);
			}
		}
		
		var url = shr.getContextPath()+"/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.AttendanceResultBatchAssign";
 		var serviceId = shr.getUrlRequestParam("serviceId");
		 url += '&serviceId='+encodeURIComponent(serviceId);
		var attOrgBatchDialog = $("#iframe2");
	 	attOrgBatchDialog.children("iframe").attr('src',url);
		attOrgBatchDialog.dialog({
			modal : true,
			position: {
						my: 'center',
						at: 'top+50%',
						of: window
					} ,
			title : jsBizMultLan.atsManager_atsResultCalDynamicList_i18n_23,
			width : 850,
			minWidth : 825,
			height :450,
			minHeight : 450,
			overlay: {overflow:'auto'}, 
			close : function() {
				$("#attAdminOrgBatchVal-frame").empty();
			}
		});
		$("#iframe2").attr("style", "width:850px;height:450px;");
		$("#iframe2").css("padding","0px");
		$("#iframe2").css("overflow","hidden");
		$("div[aria-describedby='iframe2']").css("top","175px");
	}

});

function closeFrameDlg(ifameid,shiftName,shiftID){
	$('#'+ifameid).attr('title',shiftName);
	$('#'+ifameid).attr('shiftID',shiftID);
    $('#'+ifameid).dialog('close');
}
