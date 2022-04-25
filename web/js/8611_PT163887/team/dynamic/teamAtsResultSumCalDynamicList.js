shr.defineClass("shr.ats.team.TeamAtsResultSumCalDynamicList", shr.ats.team.TeamAtsResultSumDynamicList, {
	initalizeDOM : function () {
		var _self = this;
		shr.ats.team.TeamAtsResultSumCalDynamicList.superClass.initalizeDOM.call(_self);
		
		//初始化页面点击事件,查看后台事物,未参与计算单据
		shr.attenceCalCommon.initClickEvent(this.dateSelectName);
		//查看后台事务，未参与计算单据count
		
		var beginDate,endDate;
		if(_self.atsPeriodObj){
			beginDate = _self.atsPeriodObj.startDate;
		  	endDate = _self.atsPeriodObj.endDate;
		}
		shr.attenceCalCommon.initWorkFlowBillsCheckedCount(beginDate,endDate);
		
		shr.attenceCalCommon.initBreadCrumb();
	},
	//导入
	importDataAction:function(){
			//修改导入按钮为调用平台的方法
			this.doImportData('import');
	},
	allAttendCaculateAction: function(){
		this.calculateCustomerSumResult();
	},
	selectAttendCaculateAction: function(){
		var self = this;
		var sid = $("#grid").jqGrid("getSelectedRows");
		 if(sid.length==0){
			shr.showWarning({ message: jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_13});
			return;
		 }
		 var fids='';
		 for (var i=0;i<sid.length;i++)
		{
			var item = sid[i];
			var data = $("#grid").jqGrid("getRowData", item);
			var recordId=data["ATS_RESULT.id"] ;
			if(i==sid.length-1){
				fids+="'"+recordId+"'";
			}
			else{
				fids+="'"+recordId+"',";
			}				
		}
		var mes= jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_29;
		shr.showConfirm(mes,
			function(){
				self.calculateCustomerSumResult(fids);
			}
		);
	},
	//全部计算/计算选中行
	 calculateCustomerSumResult: function(fids){
	 	var _self = this;
		if(!_self.atsPeriodObj || !_self.atsPeriodObj.startDate|| !_self.atsPeriodObj.endDate){
			return;
		}
		openLoader(1);
		var beginDate= _self.atsPeriodObj.startDate;
		var endDate= _self.atsPeriodObj.endDate;
		var attendPolicyId = shr.attenceCalCommon.getFilterParamValues("attencePolicy");
		var attendPeriodId = shr.attenceCalCommon.getFilterParamValues("attendancePeriod");
		var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.team.AttendanceResultSum.dynamicList";
		shr.remoteCall({
				type:"post", 
				async:true,
				url:url,
				method:"calculateCustomerSumResult",
				param : {
						 	beginDate : beginDate,
							endDate : endDate,
							attendPolicyId : attendPolicyId,
							attendPeriodId: attendPeriodId,
							fids:fids
						}, 
				success:function(res){
						closeLoader();
						if(res.success ==true){
							shr.showInfo({message : jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_9});
						}else{
							if(res.msg!=null){
								shr.showInfo({message : res.msg});
							}
							else{
								shr.showError({message : jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_10});
							}						
						}
						window.parent.jQuery('#grid').jqGrid("reloadGrid");	
			 },
				error : function() {
					closeLoader();
				},
				complete : function() {
					closeLoader();
				}
			 
			})	
			
			//删除一些无用的汇总数据
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.dynamic.calculate.AttendanceDynamicCalculateHelper&method=deleteOutDatedResSum"
			shr.ajax({
				type:"post",
				url:url,
				data:{
					attendPeriodId : attendPeriodId
				},
				success:function(res){}
			});
	},
	//转薪资
	salarySumResultAction: function(){
		var self = this;
  		var contentLen = $("#grid").jqGrid("getRowData").length ;
		if(contentLen == 0){ shr.showInfo({message : jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_3}); return ;};
		var sid = $("#grid").jqGrid("getSelectedRows");
		if(sid.length==0){
			var mes= jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_25;
			shr.showConfirm(mes,
				function(){
					self.salarySumResultConfirm();
				}
			);
		}else {
			var mes= jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_26;
			shr.showConfirm(mes,
				function(){
					self.salarySumResultConfirm();
				}
			);
		}
	},
	//转薪资
	salarySumResultConfirm: function(){
		var _self = this;
		var beginDate= _self.atsPeriodObj.startDate;
		var endDate= _self.atsPeriodObj.endDate;
		$("#calendar_info").empty();
		$("#calendar_info").next().remove();
		$("#calendar_info").dialog({
				title: jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_38,
				width:650,
				height:350,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+50%',
					of: window
				} 
			,buttons: [{
				text: jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_19,
				click: function() {
					_self.salarySumResult(); 
				}
			},{
				text: jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_8,
				click: function() {
					$(this).dialog( "close" );
				}
			}]
		});
		  var row_fields_work =''
		  +'<div class="photoState" style="margin-top:50px;margin-left:30px;"><table width="100%"><tr>'
		  +'<td width="30%" style="color: #999999;">' 
		  + jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_11 
		  + '</td>'
		  +'<td width="50%"><div id="setSalaryPeriod"></div></td>'
		  +'<td></td>'
		  +'</tr></table></div><br>'
		  +'<div><span></span></div>';	
		  $("#calendar_info").append(row_fields_work);
		  $("#calendar_info").css("margin","0px");
		  //var selectPeriod=$("#attendancePeriod-dateselect").val();
		  var selectPeriod=_self.atsPeriodObj.name+" ("+atsMlUtile.dateToUserFormat(_self.atsPeriodObj.startDate)+"~"+atsMlUtile.dateToUserFormat(_self.atsPeriodObj.endDate)+")";
		  $('#setSalaryPeriod').text(selectPeriod);
		var salary_json = {
			id: "type",  
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		var year_json = 
		{
			id: "type" + i,
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		var Month_json = 
		{
			id: "type" + i,
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		var time_json = 
		{
			id: "type" + i,
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};

		var yearValue=[];
		var cur  = new Date() ;
		var year = cur.getFullYear() ;
		for(var i=year-5;i<year+5;i++)
		{
		  yearValue.push({'value':i,'alias':i});
		}
		var monthValue=[];
		var timeValue=[];
		for(var j=1;j<13;j++)
		{
		  monthValue.push({'value':j,'alias':j});
		  if(j<6){
		  timeValue.push({'value':j,'alias':j});
		  }
		} 
		year_json.data = yearValue;
		Month_json.data=monthValue;
		time_json.data=timeValue;
				   
		var row_fields_work = '<div class="photoState" style="margin-left:30px;"><table width="100%"><tr>'
        	  +'<td width="15%" style="color: #999999;">' 
        	  + jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_34 
        	  + '</td>'
		  	  +'<td width="15.2%"></td>'
		      +'<td width="10%" ><input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></td>'
			  +'<td width="5.2%" style="color: #999999;text-align: center;">' 
			  + jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_14 
			  + '</td>'
			  +'<td width="8%" style="color: #999999;"><input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
			  +'<td width="5.2%" style="color: #999999;text-align: center;">' 
			  + jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_37 
			  + '</td>'
			  +'<td width="8%"><input type="text" name="time" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
			  +'<td width="5%" style="color: #999999;text-align: center;">' 
			  + jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_1 
			  + '</td>'
			  +'<td></td></tr></table></div>';					  
		$('#calendar_info').append(row_fields_work);
		$('input[name=YEAR]').shrSelect(year_json);	
		$('input[name=MONTH]').shrSelect(Month_json);	
		$('input[name=time]').shrSelect(time_json);	
		var periodYM = _self.atsPeriodObj.name;
		$('input[name=YEAR]').val(periodYM.substring(0,4));
		$('input[name=MONTH]').val((periodYM.substring(4,6)) > 9 ? periodYM.substring(4,6) : periodYM.substring(5,6));
//		var curDate = new Date();
//      var curDateY = curDate.getFullYear();
//		var curDateM = curDate.getMonth()+1;
//		$('input[name=YEAR]').val(curDateY);
//		$('input[name=MONTH]').val(curDateM);
		$('input[name=time]').val(1);
		$('.overflow-select').css("max-height","150px").css("overflow-y","auto");
	},
	//已汇总页签--转薪资
  	salarySumResult: function(){
  		var _self = this;
  		
		var beginDate= _self.atsPeriodObj.startDate;
		var endDate= _self.atsPeriodObj.endDate;
		var attendancePeriod = $('#setSalaryPeriod').text();
		if(attendancePeriod == ""){
			shr.showInfo({message: jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_12}); 
			return false;	
		}
		
		var  salaryPeriod='';
		var periodYear = $('input[name=YEAR]').val();
		var periodMonth = $('input[name=MONTH]').val();
		var times = $('input[name=time]').val();
		var proposerId = $('input[name=proposer]').val();
		if (periodYear == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_32}); 
			return false;
		}
		if (periodMonth == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_33}); 
			return false;
		}
		if (times == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_2});
			return false;
		}
		salaryPeriod=periodYear+"-"+periodMonth+"-"+times;
		var sid=[];
		var Exchange_json=[];
		sid = $("#grid").jqGrid("getSelectedRows");
		var fids='';
		for (var i=0;i<sid.length;i++)
		{
			var item = sid[i];
			var data = $("#grid").jqGrid("getRowData", item);
			var recordId=data["ATS_RESULT.id"] ;
			if(i==sid.length-1){
				fids+="'"+recordId+"'";
			}
			else{
				fids+="'"+recordId+"',";
			}				
		}
		var attendPeriodId = shr.attenceCalCommon.getFilterParamValues("attendancePeriod");
		var attendPolicyId = shr.attenceCalCommon.getFilterParamValues("attencePolicy");
		 openLoader(1);
		 var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.team.AttendanceResultSum.dynamicList$fragment";
		 shr.remoteCall({
				type:"post", 
				url:url, 
				method:"salarySumResult",
				param : {
							fids : fids,
							beginDate : beginDate,
							endDate : endDate,
							salaryPeriod:salaryPeriod,      //薪资周期
							attendPolicyId:attendPolicyId,  //考勤制度
							attendPeriodId:attendPeriodId
						},
				success : function(response) {
						if (response) {
							$("#calendar_info").dialog( "close" );
							var batchTipsData = _self.batchTipsDataHandler(response, data);
		
							$(_self).shrMessageTips({
								isSuccess: batchTipsData.isSuccess,
								successCount: batchTipsData.successCount,
								failureCount: batchTipsData.failureCount,
								confirmCallback: function () {	
									$(_self).shrDetailTips({
										tableData: batchTipsData.tmp,
										successCount: batchTipsData.successCount,
		            					failureCount: batchTipsData.failureCount,
										colNamesData: batchTipsData.tableModel,
										isSortable : _self.batchHandlerWhetherSortable(),
										modalWidth: ''
									}).shrDetailTips("open");					
								},
		
								closeCallback: function () {
									_self.reloadGrid();
								}
							}).shrMessageTips("open");				
						} else {
							$(_self).shrMessageTips("_setDetailDisable");
						}	
					},
			error : function() {
					closeLoader();
			},
			complete : function() {
				closeLoader();
			}
		 });	
  	},
  	
	/**
	 * 批量反馈，处理请求返回数据
	 */
	batchTipsDataHandler: function (data, options) {
		var _self = this;
		var successCount = data.successCount; 
		var failureCount = data.failureCount;
		var isSuccess = !data.failureCount ? true : false;
		var result = data.result;
		for(var i = 0, l = result.length;i < l;i++){
			if(result[i].muitTipsState ) {
				result[i].muitTipsState  = jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_0;
			}else {
				
				result[i].muitTipsState  = jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_24;
			}
		}
		var batchData = {
			"successCount": successCount,
			"failureCount": failureCount,
			"isSuccess": isSuccess,
			"tmp": result,
			"tableModel":_self.getBatchTipsTableModel()
		};

		return batchData;
	},
  	//审核
  	auditAction: function(){
  		var self = this;
  		var contentLen = $("#grid").jqGrid("getRowData").length ;
		if(contentLen == 0){
			shr.showInfo({message : jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_5}); 
			return ;
		};
		var sid = $("#grid").jqGrid("getSelectedRows");
		if(sid.length==0){
			var mes= jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_30;
			shr.showConfirm(mes,
				function(){
					self.auditAttendance("audit");
				}
			);
		}else {
			var mes= jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_31;
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
			shr.showInfo({message : jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_4});  
			return ;
		}
		var sid = $("#grid").jqGrid("getSelectedRows");
		if(sid.length==0){
			var mes= jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_27;
			shr.showConfirm(mes,
				function(){
					self.auditAttendance("auditBack");
				}
			);
		}else {
			var mes= jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_28;
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
		openLoader(1);
		_self.remoteCall({
			type : "post",
			method : methodName ? methodName : "audit",
			param : {
				fids:fids
			},
			success : function(res){
				closeLoader();
				if(res.flag=="1")
				{
					if(methodName == "audit"){
						shr.showInfo({message : shr.formatMsg(jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_22, [res.successCount])});
					}else {
						shr.showInfo({message : shr.formatMsg(jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_6, [res.successCount])});
					}
					jQuery('#grid').jqGrid("reloadGrid");
				}else{
					if(methodName == "audit"){
						shr.showInfo({message : jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_23});
					}else {
						shr.showInfo({message : jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_7});
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
		var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.team.AttendanceResultSum.dynamicList&method=delete"
		if(ids.length > 0){
			shr.showConfirm(jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_15, function() {
				shr.ajax({
					type:"post",
					url:url,
					data:{
						ids : ids.join(',')
					},
					success:function(res){
						if(res.flag=="1"){
							shr.showInfo({message : shr.formatMsg(jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_20, [res.successCount])});
							jQuery('#grid').jqGrid("reloadGrid");
						}else{
							shr.showInfo({message : jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_21});
						}
					}
				}); 
			});
		}else{
			shr.showError({message: jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_17});
		}
	},
	saveAction: function(){
		var _self = this ;
	 	sid = $("#grid").jqGrid("getSelectedRows");
		var selectedRows = [];
		for ( var i in sid) {
			var item = sid[i];
			var data = $("#grid").jqGrid("getRowRealData", item);
			selectedRows.push(data);
		}
		var url = shr.getContextPath() + "/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.team.AttendanceResultSum.dynamicList&method=save"
		if(selectedRows.length > 0){
			shr.showConfirm(jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_16, function() {
				shr.ajax({
					type:"post",
					url:url,
					data:{
						selectedRows : $.toJSON(selectedRows)
					},
					success:function(res){
						if(res.flag=="1"){
							shr.showInfo({message : shr.formatMsg(jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_35, [res.successCount])});
							jQuery('#grid').jqGrid("reloadGrid");
						}else{
							shr.showInfo({message : jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_36});
						}
					}
				}); 
			});
		}else{
			shr.showError({message: jsBizMultLan.atsManager_atsResultSumCalDynamicList_i18n_18});
		}
	}
});

