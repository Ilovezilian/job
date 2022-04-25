(function($) {
jQuery.atsResultCalBill={
	//请假
	leaveBillNew: function(){
		var sid = $("#grid").jqGrid("getSelectedRows");
		 if(sid.length==0){
				shr.showWarning({
					message: $.attendmanageI18n.atsResultCalBill.msg1
				});
			return;
		 }
		 /**
		  * 业务组织改从明细记录取，并：
		  * 1、校验是否多个（V850 快速过滤业务组织多选）—— js
		  * 2、校验考勤业务组织跟对应人员所选日期的假期业务组织是否一致
		  * 
		  * 以上校验不通过则弹出提示！
		  */
		 var hrOrgId = "";
		 var hrOrgName = "";
		 for(var i=0;i<sid.length;i++){
			var item = sid[i];
			if(hrOrgId != "" &&
				hrOrgId != $("#grid").jqGrid("getCell", item,"hrOrg.id")) {
				shr.showError({message: $.attendmanageI18n.atsResultCalBill.msg2});
				return;
			}else{
				hrOrgId = $("#grid").jqGrid("getCell", item,"hrOrg.id");
			}
			hrOrgName = $("#grid").jqGrid("getCell", item,"hrOrg.name");
		}
		/**
		 * 考勤计算提请假单 假期业务组织校验;
		 * 假期业务组织不可编辑
		 */
		var personDates = []; //[{"person":personid,"date":attenceDate,"name":personName},...]
		 for(var i=0;i<sid.length;i++){
			 var item = sid[i];
			 var personDate = {
				 "person" : $("#grid").jqGrid("getCell", item,"person.id"),
				 "date" : $("#grid").jqGrid("getCell", item,"dateSet.date").substring(0,10),
				 "name" : $("#grid").jqGrid("getCell", item,"person.name")
			 };
			 personDates.push(personDate);
		 }
		 var personDateOrgValidRes = [];//[personName_attenceDate, ...]
		 var msg = "";
		 shr.remoteCall({
				type:"post",
				async:false,
				url: shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendancePanelCalHandler&method=personDateOrgValid",
				param : {
			 				"hrOrgUnitId" : hrOrgId,
							"personDates" : JSON.stringify(personDates)
						}, 
				success:function(res){
					personDateOrgValidRes = res.validRes;//[personName_attenceDate, ...]
					if(personDateOrgValidRes != null && personDateOrgValidRes != undefined){
						
						for(var i=0; i<personDateOrgValidRes.length; i++){
							var tmp = personDateOrgValidRes[i];
							var name = tmp.split("_")[0];
							var date = tmp.split("_")[1];
							msg += shr.formatMsg($.attendmanageI18n.atsResultCalBill.msg3, [name, date, hrOrgName]) + "<br>";
						}
						if(msg != ""){
							shr.showError({message: msg});
							return;
						}
					}
				},
				error:function(res){
					return;
				}
		 });
		if(msg != ""){
			return;
		}
		var personStr = "";
		var personNameStr ="";
		var attendDateStr="";
		for (var i=0;i<sid.length;i++)
		{
				var item = sid[i];
				var data =  $("#grid").jqGrid("getCell", item,"person.id");
				var date =  $("#grid").jqGrid("getCell", item,"dateSet.date").substring(0,10);
				var personName =  $("#grid").jqGrid("getCell", item,"person.name");
				if(personStr.length > 0)
				{
					personStr +=",";
				}
				personStr += data;	
				if(attendDateStr.length > 0)
				{
					attendDateStr +=",";
				}
				attendDateStr += date;		
				if(personNameStr.length > 0)
				{
					personNameStr +=",";
				}
				personNameStr += personName;	
		}

		var beginDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
		var endDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
 		var url = shr.getContextPath()+"/dynamic.do?method=addNew&fromCalDetail=1&personStr="+encodeURIComponent(personStr)+"&attendDateStr="+attendDateStr+"&personNameStr="+encodeURIComponent(personNameStr)+"&beginDateStr="+beginDateStr+"&endDateStr="+endDateStr+"&uipk=com.kingdee.eas.hr.ats.app.AtsLeaveBillAllBatchFormDetail"+"&hrOrgId="+encodeURIComponent(hrOrgId);
 		var serviceId = shr.getUrlRequestParam("serviceId");
		 url += '&serviceId='+encodeURIComponent(serviceId);
 		var leavebillDialog = $("#detailOperationDialog");
 		leavebillDialog.children("iframe").attr('src',url);
 		leavebillDialog.dialog({
 	 		autoOpen: true,
 			title: $.attendmanageI18n.atsResultCalBill.title1,
 			width:950,
 	 		minWidth:950,
 	 		height:700,
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
 		$("#detailOperationDialog").parent().css("z-index",1031);//提示框为1000，要放在提示框下面;
		$("#detailOperationDialog-frame").attr("scrolling","NO"); 
		$("div[aria-describedby='detailOperationDialog']").css("top","175px").css("positon","absolute");
 		$("#detailOperationDialog-frame").load(function () {
 		
			var _iframe = document.getElementById('detailOperationDialog-frame');
			var _iframeHeight = null;
			 $(window.frames["detailOperationDialog-frame"].document).find("#gview_grid").children("div").eq(2).css({"height":"460","overflow-y":"auto","overflow-x":"hidden"});
			if (_iframe.contentDocument && _iframe.contentDocument.body.offsetHeight){
				_iframeHeight = _iframe.contentDocument.body.offsetHeight;
			} else if (_iframe.Document && _iframe.Document.body.scrollHeight){
				_iframeHeight = _iframe.Document.body.scrollHeight;
			}
			var $iframe = $(_iframe);
			$iframe.height(_iframeHeight + 280 );
			
		});
	},
	
  	//补卡
	fillSignCardNew: function(){
		var sid = $("#grid").jqGrid("getSelectedRows");
		 if(sid.length==0){
				shr.showWarning({
					message: $.attendmanageI18n.atsResultCalBill.msg1
				});
			return;
		 }
		 var hrOrgId = "";
		 for(var i=0;i<sid.length;i++){
			var item = sid[i];
			if(hrOrgId != "" &&
				hrOrgId != $("#grid").jqGrid("getCell", item,"hrOrg.id")) {
				shr.showError({message: $.attendmanageI18n.atsResultCalBill.msg2});
				return;
			}else{
				hrOrgId = $("#grid").jqGrid("getCell", item,"hrOrg.id");
			}
		}
		var personStr = "";
		var personNameStr ="";
		var attendDateStr="";
		for (var i=0;i<sid.length;i++)
		{
				var item = sid[i];
				var data =  $("#grid").jqGrid("getCell", item,"person.id");
				var date =  $("#grid").jqGrid("getCell", item,"dateSet.date").substring(0,10);
				var personName =  $("#grid").jqGrid("getCell", item,"person.name");
				if(personStr.length > 0)
				{
					personStr +=",";
				}
				personStr += data;	
				if(attendDateStr.length > 0)
				{
					attendDateStr +=",";
				}
				attendDateStr += date;		
				if(personNameStr.length > 0)
				{
					personNameStr +=",";
				}
				personNameStr += personName;	
		}
		var beginDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
		var endDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
 		var url = shr.getContextPath()+"/dynamic.do?iframe=detailOperationDialog-frame&method=addNew&fromCalDetail=1&personStr="+encodeURIComponent(personStr)+"&attendDateStr="+attendDateStr+"&personNameStr="+encodeURIComponent(personNameStr)+"&beginDateStr="+beginDateStr+"&endDateStr="+endDateStr+"&uipk=com.kingdee.eas.hr.ats.app.FillSignCardBatchNewDetail"+"&hrOrgId="+encodeURIComponent(hrOrgId);
 		 var serviceId = shr.getUrlRequestParam("serviceId");
		 url += '&serviceId='+encodeURIComponent(serviceId);
 		var leavebillDialog = $("#detailOperationDialog");
 		leavebillDialog.children("iframe").attr('src',url);
 		leavebillDialog.dialog({
 	 		autoOpen: true,
 			title: $.attendmanageI18n.atsResultCalBill.title2,
 			width:950,
 	 		minWidth:950,
 	 		height:700,
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
		$("#detailOperationDialog").parent().css("z-index",1031);//提示框为1000，要放在提示框下面;
		$("#detailOperationDialog-frame").attr("scrolling","NO");
		$("div[aria-describedby='detailOperationDialog']").css("top","175px").css("positon","absolute");
		$("#detailOperationDialog-frame").load(function () {
			var _iframe = document.getElementById('detailOperationDialog-frame');
			var _iframeHeight = null;
			$(window.frames["detailOperationDialog-frame"].document).find("#gview_grid").children("div").eq(2).css({"height":"460","overflow-y":"auto","overflow-x":"hidden"});
			if (_iframe.contentDocument && _iframe.contentDocument.body.offsetHeight){
				_iframeHeight = _iframe.contentDocument.body.offsetHeight;
			} else if (_iframe.Document && _iframe.Document.body.scrollHeight){
				_iframeHeight = _iframe.Document.body.scrollHeight;
			}
			var $iframe = $(_iframe);
			$iframe.height(_iframeHeight + 280 );
		});
	},
	
	//出差
	tripBillNew: function(){
		var sid = $("#grid").jqGrid("getSelectedRows");
		 if(sid.length==0){
				shr.showWarning({
					message: $.attendmanageI18n.atsResultCalBill.msg1
				});
			return;
		 }
		 var hrOrgId = "";
		 for(var i=0;i<sid.length;i++){
			var item = sid[i];
			if(hrOrgId != "" &&
				hrOrgId != $("#grid").jqGrid("getCell", item,"hrOrg.id")) {
				shr.showError({message: $.attendmanageI18n.atsResultCalBill.msg2});
				return;
			}else{
				hrOrgId = $("#grid").jqGrid("getCell", item,"hrOrg.id");
			}
		}
		var personStr = "";
		var personNameStr ="";
		var attendDateStr="";
		var s1toS6="";//拼接s1-s6
		for (var i=0;i<sid.length;i++)
		{
				var item = sid[i];
				var data =  $("#grid").jqGrid("getCell", item,"person.id");
				var date =  $("#grid").jqGrid("getCell", item,"dateSet.date").substring(0,10);
				var personName =  $("#grid").jqGrid("getCell", item,"person.name");
				if(personStr.length > 0)
				{
					personStr +=",";
				}
				personStr += data;	
				if(attendDateStr.length > 0)
				{
					attendDateStr +=",";
				}
				attendDateStr += date;		
				if(personNameStr.length > 0)
				{
					personNameStr +=",";
				}
				personNameStr += personName;	
		}
		var beginDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
		var endDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
 		var url = shr.getContextPath()+"/dynamic.do?method=addNew&fromCalDetail=1&personStr="+encodeURIComponent(personStr)+"&attendDateStr="+attendDateStr+"&personNameStr="+encodeURIComponent(personNameStr)+"&beginDateStr="+beginDateStr+"&endDateStr="+endDateStr+"&uipk=com.kingdee.eas.hr.ats.app.AtsTripBillBatchNewDetail"+"&hrOrgId="+encodeURIComponent(hrOrgId);
 		var serviceId = shr.getUrlRequestParam("serviceId");
		 url += '&serviceId='+encodeURIComponent(serviceId);
 		var leavebillDialog = $("#detailOperationDialog");
 		leavebillDialog.children("iframe").attr('src',url);
 		leavebillDialog.dialog({
 	 		autoOpen: true,
 			title: $.attendmanageI18n.atsResultCalBill.title3,
 			width:950,
 	 		minWidth:950,
 	 		height:700,
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
		$("#detailOperationDialog").parent().css("z-index",1031);//提示框为1000，要放在提示框下面;
		$("#detailOperationDialog-frame").attr("scrolling","NO");
		$("div[aria-describedby='detailOperationDialog']").css("top","175px").css("positon","absolute");
 		$("#detailOperationDialog-frame").load(function () {
			var _iframe = document.getElementById('detailOperationDialog-frame');
			var _iframeHeight = null;
			$(window.frames["detailOperationDialog-frame"].document).find("#gview_grid").children("div").eq(2).css({"height":"460","overflow-y":"auto","overflow-x":"hidden"});
			if (_iframe.contentDocument && _iframe.contentDocument.body.offsetHeight){
				_iframeHeight = _iframe.contentDocument.body.offsetHeight;
			} else if (_iframe.Document && _iframe.Document.body.scrollHeight){
				_iframeHeight = _iframe.Document.body.scrollHeight;
			}
			var $iframe = $(_iframe);
			$iframe.height(_iframeHeight + 280 );
		});
	},
	
	//加班
	overTimeBillNew: function(){
		var sid = $("#grid").jqGrid("getSelectedRows");
		 if(sid.length==0){
				shr.showWarning({
					message: $.attendmanageI18n.atsResultCalBill.msg1
				});
			return;
		 }
		var hrOrgId = "";
		 for(var i=0;i<sid.length;i++){
			var item = sid[i];
			if(hrOrgId != "" &&
				hrOrgId != $("#grid").jqGrid("getCell", item,"hrOrg.id")) {
				shr.showError({message: $.attendmanageI18n.atsResultCalBill.msg2});
				return;
			}else{
				hrOrgId = $("#grid").jqGrid("getCell", item,"hrOrg.id");
			}
		}
		var personStr = "";
		var personNameStr ="";
		var attendDateStr="";
		var s1toS6="";//拼接s1-s6
		for (var i=0;i<sid.length;i++)
		{
				var item = sid[i];
				var data =  $("#grid").jqGrid("getCell", item,"person.id");
				var date =  $("#grid").jqGrid("getCell", item,"dateSet.date").substring(0,10);
				var personName =  $("#grid").jqGrid("getCell", item,"person.name");
				if(personStr.length > 0)
				{
					personStr +=",";
				}
				personStr += data;	
				if(attendDateStr.length > 0)
				{
					attendDateStr +=",";
				}
				attendDateStr += date;		
				if(personNameStr.length > 0)
				{
					personNameStr +=",";
				}
				personNameStr += personName;	
		}
		var beginDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["startDate"];
		var endDateStr = shr.attenceCalCommon.getFilterParamValues("dateSet.date")["endDate"];
 		var url = shr.getContextPath()+"/dynamic.do?method=addNew&fromCalDetail=1&personStr="+encodeURIComponent(personStr)+"&attendDateStr="+attendDateStr+"&personNameStr="+encodeURIComponent(personNameStr)+"&beginDateStr="+beginDateStr+"&endDateStr="+endDateStr+"&uipk=com.kingdee.eas.hr.ats.app.AtsOverTimeBillAllBatchFormDetail"+"&hrOrgId="+encodeURIComponent(hrOrgId);
 		var serviceId = shr.getUrlRequestParam("serviceId");
		 url += '&serviceId='+encodeURIComponent(serviceId);
 		var leavebillDialog = $("#detailOperationDialog");
 		leavebillDialog.children("iframe").attr('src',url);
 		leavebillDialog.dialog({
 	 		autoOpen: true,
 			title: $.attendmanageI18n.atsResultCalBill.title4,
 			width:950,
 	 		minWidth:950,
 	 		height:700,
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
		$("#detailOperationDialog").parent().css("z-index",1031);//提示框为1000，要放在提示框下面;
		$("#detailOperationDialog-frame").attr("scrolling","NO");
		$("div[aria-describedby='detailOperationDialog']").css("top","175px").css("positon","absolute");
		$("#detailOperationDialog-frame").load(function () {
			var _iframe = document.getElementById('detailOperationDialog-frame');
			var _iframeHeight = null;
			$(window.frames["detailOperationDialog-frame"].document).find("#gview_grid").children("div").eq(2).css({"height":"460","overflow-y":"auto","overflow-x":"hidden"});
			if (_iframe.contentDocument && _iframe.contentDocument.body.offsetHeight){
				_iframeHeight = _iframe.contentDocument.body.offsetHeight;
			} else if (_iframe.Document && _iframe.Document.body.scrollHeight){
				_iframeHeight = _iframe.Document.body.scrollHeight;
			}
			var $iframe = $(_iframe);
			$iframe.height(_iframeHeight + 280 );
		});
		
	}
	
}}( jQuery ));