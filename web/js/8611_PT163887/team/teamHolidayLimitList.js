shr.defineClass("shr.ats.team.TeamHolidayLimitList", shr.framework.List, {
	setParamValue :function(){
		 var $grid = $(this.gridId);
		 var billId = $.getUrlParam('billId');
		 if(billId != undefined && billId != null && billId != ''){
		 	//$("#generate").hide();
		 	$("#delete").hide();
		 	/*
		 	 * add by:great_chen
		 	 * date: 2014-08-06
		 	 * function：将下面的按钮隐藏
		 	 */
		 	$("#addImport").hide(); //新增导入
		 	$("#modifyImport").hide(); //修改导入
		 	$("#initalizeImport").hide(); //初始化导入
		 }
		 else{
		 	//$("#generate").show();
		 	$("#delete").show();
		 	$("#addImport").show(); //新增导入
		 	$("#modifyImport").show(); //修改导入
		 	$("#initalizeImport").show(); //初始化导入
		 }
		 var myPostData={
			  billId: decodeURIComponent(billId)
		};
		$grid.jqGrid("option",'postData', myPostData);//postData来传递我们  定制的参数 jquery.jqGrid.extend.js
		document.documentElement.style.overflow='visible';
	}, 
	initalizeDOM : function () {
		var _self = this;
		_self.setParamValue();
		_self.pageFormatter();//页面微调
            shr.ats.team.TeamHolidayLimitList.superClass.initalizeDOM.call(this);
	},
	queryGrid: function(){
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"cycleBeginDate_cycleEndDate","errorMessage":jsBizMultLan.atsManager_holidayLimitList_i18n_32});
		if(dateRequiredValidate){
                shr.ats.team.TeamHolidayLimitList.superClass.queryGrid.call(this);
		}
	}
	
	,pageFormatter : function () {
		//从考勤档案、假期档案进入此页面，此页面中部分按钮需要去掉，去掉的按钮包括：导入、查看后台事务、批量延期
		var previousURL = document.referrer;
		//在假期额度页面点击生成额度再返回假期额度页面会破坏previousURL，故读取面包屑中的数据
		var breadcrumbDatas = shrDataManager.pageNavigationStore.getDatas();
		if(breadcrumbDatas[breadcrumbDatas.length-2]==undefined){
			return;
		}
		var previousURL_two = breadcrumbDatas[breadcrumbDatas.length-2].url;//倒数第二个页面的url是要监控的url
            if (previousURL.indexOf("com.kingdee.eas.hr.ats.app.AttendanceFileView.form")>=0
                || previousURL.indexOf("com.kingdee.eas.hr.ats.app.team.HolidayFileView.form")>=0
                || previousURL_two.indexOf("com.kingdee.eas.hr.ats.app.AttendanceFileView.form")>=0
                || previousURL_two.indexOf("com.kingdee.eas.hr.ats.app.team.HolidayFileView.form")>=0){
			$("#batchExtension").remove();
			$('.caret').eq(0).parent().remove();
			$("#viewTransaction").remove();
		}
		
	},
	
	/**
	 * 删除，允许删除调休假
	 */
	deleteRecord:function(selectedIds) {
		var _self = this;
		var billId = $("#grid").jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0) {
	        shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitList_i18n_33});
			return ;
	    }
		var isAllDelete=true;
	    var ids = [];
		for (var i = 0; i < billId.length; i++) {
			var limitstatus = $("#grid").jqGrid("getRowData",billId[i]).status;
			console.log($("#grid").jqGrid("getRowData",billId[i]));
			var holidayType = $("#grid").jqGrid("getRowData",billId[i])['holidayPolicy.holidayType.name'];
			if(limitstatus==0 && holidayType!=jsBizMultLan.atsManager_holidayLimitList_i18n_12 ){
				ids.push($("#grid").jqGrid("getCell",billId[i], "id"));
			}
			else{
				isAllDelete=false;
			}
		}
		var confirmMess="";

		if(ids.length>0){
			ids=ids.join(",");
			if(isAllDelete == false){
				confirmMess=jsBizMultLan.atsManager_holidayLimitList_i18n_42;
			}else{
				confirmMess=jsBizMultLan.atsManager_holidayLimitList_i18n_28;
			}
		}
		else{
			shr.showWarning({message: jsBizMultLan.atsManager_holidayLimitList_i18n_25});
			return;
		}
		
		//判断假期额度是否已存在引用（有假期额度明细）
		var errorMsg = _self.isExistsHolidayLimitDetail(ids);
		if(errorMsg && errorMsg != ""){
			shr.showWarning({message: errorMsg,hideAfter: 5});
			return;
		}
		shr.showConfirm(confirmMess, function(){
			top.Messenger().hideAll();
			
			_self.batchDeleteAction();
		//	_self.doRemoteAction({
		//		method: 'delete',
		//		billId: ids
		//	});
		});
	},
	isExistsHolidayLimitDetail: function(limitIds){
		var that = this;
		var errorMsg = "";
		that.remoteCall({
		    method:"isExistsHolidayLimitDetail",
		    param:{limitIds:limitIds},
			async: false,
		    success:function(res){
				errorMsg = res.errorMsg;
		    }
		}); 
		
		return errorMsg;
	}
	//02.转出剩余额度
	,transferLimitAction : function(){
		var _self = this;
		var billId = $("#grid").jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0) {
	        shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitList_i18n_31});
			return ;
	    }
		var isAllTransfer=true;
	    var ids = [];
		for (var i = 0; i < billId.length; i++) {
			var limitstatus = $("#grid").jqGrid("getRowData",billId[i]).status;
			console.log($("#grid").jqGrid("getRowData",billId[i]));
			var remainLimit = $("#grid").jqGrid("getRowData",billId[i])['remainLimit'];
			if(remainLimit==0 || remainLimit<=0 ){//剩余额度小于等于0,不能转出
				isAllTransfer=false;
			}
			else{
				ids.push($("#grid").jqGrid("getCell",billId[i], "id"));
			}
		}
		var confirmMess="";
		if(isAllTransfer==false){
			confirmMess=jsBizMultLan.atsManager_holidayLimitList_i18n_47;
		}else{
			//confirmMess="是否需要将选择记录的剩余额度转出？请检查在转出后新的业务组织下是否有相应的额度记录，如果存在才可以转出，否则不能转出！";
			confirmMess=jsBizMultLan.atsManager_holidayLimitList_i18n_39
				+ '</br>'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_30;
		}
		
		if(ids.length>0){
			ids=ids.join(",");
		}else{
			shr.showWarning({message: jsBizMultLan.atsManager_holidayLimitList_i18n_48});
			return ;
		}
		
		
		//判断假期额度是否已存在引用（有假期额度明细）
		var errorMsg = _self.isExistsHolidayLimitDetail(ids);
		if(errorMsg && errorMsg != ""){
			shr.showWarning({message: errorMsg,hideAfter: 5});
			return;
		}
		
		
		shr.showConfirm(confirmMess, function(){
			top.Messenger().hideAll();
			
			
			var data = {
					method: 'transferLimit',//将此类数据存入转出转入表
					billId: ids
				};
				data = $.extend(_self.prepareParam(), data);
				
				shr.doAction({
					url: _self.dynamicPage_url,
					type: 'post', 
						data: data,
						success : function(response) {					
							shr.showSuccess({message: jsBizMultLan.atsManager_holidayLimitList_i18n_52});
						}
				});	


			
			
			
			
		//	_self.doRemoteAction({
		//		method: 'transferLimit',//将此类数据存入转出转入表
		//		billId: ids
		//	});
		//	shr.showSuccess({message: jsBizMultLan.atsManager_holidayLimitList_i18n_52});
			
		});
		
//		localStorage.setItem(_self.cache_key,ids) ;
//		_self.createDialogDiv() ;
		
	}
	,
	isExistsHolidayLimitDetail: function(limitIds){
		var that = this;
		var errorMsg = "";
		that.remoteCall({
		    method:"isExistsHolidayLimitDetail",
		    param:{limitIds:limitIds},
			async: false,
		    success:function(res){
				errorMsg = res.errorMsg;
		    }
		}); 
		
		return errorMsg;
	}
	
	
	//03.查看转出转入
	,viewLimitTransferAction : function() {
		this.reloadPage({uipk : 'com.kingdee.eas.hr.ats.app.HolidayLimitTransfer.out'});
	}
	
	,holidayLimitDetailAction : function() {
		this.reloadPage({uipk : 'com.kingdee.eas.hr.ats.app.HolidayLimitDetailRe.list'});
	}
	,auditAction : function (event) {
			var billId = $("#grid").jqGrid("getSelectedRows");
			if (billId == undefined || billId.length==0) {
		        shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitList_i18n_33});
				return ;
		    }
//		    if(limitstatus == 1){
//		    	shr.showError({message: "未审核状态的额度记录才能进行审核，请重新选择"});
//		    	return false;
//		    }
			var isAllAudit=true;
		    var ids = [];
			for (var i = 0; i < billId.length; i++) {
				var limitstatus = $("#grid").jqGrid("getRowData",billId[i]).status;
				if(limitstatus==0){
					ids.push($("#grid").jqGrid("getCell",billId[i], "id"));
				}
				else{
					isAllAudit=false;
				}
			}
			var confirmMess="";
			if(isAllAudit==false){
				confirmMess=jsBizMultLan.atsManager_holidayLimitList_i18n_41;
			}
			else{
				confirmMess=jsBizMultLan.atsManager_holidayLimitList_i18n_29;
			}
			if(ids.length>0){
				ids=ids.join(",");
			}
			else{
				shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitList_i18n_26});
				return ;
			}
			var _self = this;
			shr.showConfirm(confirmMess, function(){
				top.Messenger().hideAll();
				
				var data = {
					method: 'audit',
					ids: ids
				};
				data = $.extend(_self.prepareParam(), data);
				
				shr.doAction({
					url: _self.dynamicPage_url,
					type: 'post', 
						data: data,
						success : function(response) {					
							_self.reloadGrid();
						}
				});	
				
			});
		}
		
		,antiAuditAction : function (event) {
			var billId = $("#grid").jqGrid("getSelectedRows");
			
			var limitstatus;
			for (var i = 0; i < billId.length; i++) {
				if($("#grid").jqGrid("getRowData",billId[i]).status==0){
					limitstatus = 0;
				}
			}
			
			if (billId == undefined || billId.length==0) {
		        shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitList_i18n_33});
				return ;
		    }
//			 var ids = [];
//				for (var i = 0; i < billId.length; i++) {
//					ids.push($("#grid").jqGrid("getCell",billId[i], "id"));
//		    //获取行数据
//		    var rowDate =  $("#grid").jqGrid("getRowData", billId[i]);
//		     if(rowDate["holidayPolicy.holidayType.id"]=="+ZM5jTmrS0KHCjDSYGcFLf0tUpg="){
//		     	shr.showInfo({message: '调休假不能反审核！'});
//				return ;
//		     }
//				}
		     
//		    if(limitstatus == 0){
//		    	shr.showError({message: "审核状态的额度记录才能进行反审核，请重新选择"});
//		    	return false;
//		    }
			var isAllAntiAudit=true;
		    var ids = [];
			for (var i = 0; i < billId.length; i++) {
				var limitstatus = $("#grid").jqGrid("getRowData",billId[i]).status;
				if(limitstatus==1){
					ids.push($("#grid").jqGrid("getCell",billId[i], "id"));
				}
				else{
					isAllAntiAudit=false;
				}
			}
			var confirmMess="";
			if(isAllAntiAudit==false){
				confirmMess=jsBizMultLan.atsManager_holidayLimitList_i18n_51;
			}
			else{
				confirmMess=jsBizMultLan.atsManager_holidayLimitList_i18n_27;
			}
			if(ids.length>0){
				ids=ids.join(",");
			}
			else{
				shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitList_i18n_24});
				return ;
			}
			var _self = this;
			shr.showConfirm(confirmMess, function(){
				top.Messenger().hideAll();
				
				var data = {
					method: 'antiAudit',
					billId: ids
				};
				data = $.extend(_self.prepareParam(), data);
				
				shr.doAction({
					url: _self.dynamicPage_url,
					type: 'post', 
						data: data,
						success : function(response) {					
							_self.reloadGrid();
						}
				});	
				
			});
		}
		
		
    ,generateAction:function(){
    	var _self = this;
    	var billId = $.getUrlParam('billId');
    	 if(billId != undefined && billId != null && billId != ''){
    	 	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitListHandler&method=getPerson";
    	 	$.ajax({
				url: url,
				data: {
					billId:decodeURIComponent(billId)
				},
				success:function(res){
					_self.reloadPage({
    					uipk: "com.kingdee.eas.hr.ats.app.GenerateHolidayLimit",
    					name: encodeURIComponent(res.name),
    					personId: res.personId,
    					orgName : encodeURIComponent(res.orgName),
    					orgId : encodeURIComponent(res.orgId),
    					hrOrgName : encodeURIComponent(res.hrOrgName),
    					hrOrgId : encodeURIComponent(res.hrOrgId)
    				});
			   }
			});
        
    	 }
    	 else{
    	 	_self.reloadPage({
    			uipk: "com.kingdee.eas.hr.ats.app.GenerateHolidayLimit"
    		});
    	 }
        /*
    	var selectedRows = $("#grid").jqGrid("getSelectedRows");
    	if(selectedRows == null || selectedRows.length == 0){
    		_self.reloadPage({
    			uipk: "com.kingdee.eas.hr.ats.app.GenerateHolidayLimit"
    		});
    	}
    	else{
    		if(selectedRows.length > 1){
    			shr.showWarning({message: '请选择一条假期额度信息数据'});
    		}
    		else{
    	   	 	//var number = $("#grid").jqGrid("getCell", selectedRows[0], "proposer.number");
    	   	 	var name = $("#grid").jqGrid("getCell", selectedRows[0], "proposer.name");
    	   	 	var personId = $("#grid").jqGrid("getCell", selectedRows[0], "proposer.id");
    	   	 	_self.reloadPage({
    				uipk: "com.kingdee.eas.hr.ats.app.GenerateHolidayLimit",
    				name: encodeURIComponent(name),
    				personId: personId
    			});
    		}
    		
    	}
    	*/
    }
  
    ,initalizeImportAction:function(){
    	document.documentElement.style.overflow='hidden';
    	this.doImportData(undefined,undefined,'initalize');
		var  importHTML= ''
			+ '<div id="photoCtrl">' 
			+	'<p>'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_16
			+ '</p>'
			+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_2
			+ '</div>'
			+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_3
			+ '</div>'
			+   '<div class="photoState">'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_4
			+ '<br/>'
			+   '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_43
			+ '<br/>'
			+	'&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_50
			+ '<br/>'
			+	'&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_13
			+ '<br/>'
			+   '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_6
            +    '</div>'
			+   '<br>'
			+       '</div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+ '</div>';

	  	$('#importDiv').css('height','600px').css('overflow-y','auto');
	
		if ($.browser.msie) {  // 通过iframe 等方式来填充页面的
	  		setTimeout(function(){
				jQuery(window.frames["importFrame"].document).find("#container").before(importHTML);
				var rowBlockClass = $(jQuery(window.frames["importFrame"].document)).find("#workAreaDiv").find(".row-block");
				for(var i=0;i<rowBlockClass.length;i++){
				   $(rowBlockClass[i]).removeClass("row-block");
				}
				$(jQuery(window.frames["importFrame"].document)).find("body").css("line-height", "18px");
		 	},2000);
	  	}else{  // 通过 div 等方式来填充页面的 
			setTimeout(function(){
		 		$('#container').before(importHTML);
		 		$("button[id^=download]").closest(".row-block").find(".row-block").removeClass("row-block");
		 		$("button[id^=download]").closest(".row-block").removeClass("row-block");
		 		$('#file_upload').css("line-height",40);
		 		
		 	},1000);
		}
		$(".ui-dialog-titlebar-close").unbind().bind("click" , function(){
			$('#importDiv').dialog("close");
			document.documentElement.style.overflow='visible';
			//未解决ie缓存问题
			if($.browser.msie)
			location.reload();
		});	
		
		return;
	}
	,importFileData: function(){
		
		//alert("读取服务器目录文件 解析");
		var that=this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitImportEditHandler&method=importFileData";
		var fileName = $("#fileName").val();
		var realTotalNum = 0;
		var successTotalNum = 0;
		var failTotalNum = 0;
		
		$.ajax({
			url: url,
			beforeSend: function(){
				openLoader(1);
			},
			data: {
				fileName: fileName
			},
			success: function(msg){
				closeLoader();
				if((msg.importantError==null||msg.importantError=="")&&(msg.realTotalNum==null||msg.realTotalNum=="")){
				shr.showError({message: jsBizMultLan.atsManager_holidayLimitList_i18n_11});
				}else{
				if(msg.importantError!=null&&msg.importantError!=""){
				shr.showError({message: msg.importantError});
				}else{
				 realTotalNum = msg.realTotalNum;
				 successTotalNum = msg.successTotalNum;
				 failTotalNum = msg.failTotalNum;
				
				var tip="";
					tip =jsBizMultLan.atsManager_holidayLimitList_i18n_17 + "<br/>";
					tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_holidayLimitList_i18n_1, [realTotalNum]) + "<br/>" ;
					tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_holidayLimitList_i18n_0, [successTotalNum]) + "<br/>" ;
				
				if (msg.failTotalNum > 0) {
						tip = tip +  " <font color='red'>"
							+ shr.formatMsg(jsBizMultLan.atsManager_holidayLimitList_i18n_8,[failTotalNum])
							+ "</font><br/>" ;
						tip = tip +  jsBizMultLan.atsManager_holidayLimitList_i18n_9 + "<br/>" ;
						for(var i=0;i<msg.errorStringList.length;i++){
							tip = tip + "  <font color='red'> " +　msg.errorStringList[i] + "</font><br/>" ;
						}
					}
				var options={
				   message:tip
				};
				$.extend(options, {
					type: 'info',
					hideAfter: null,
					showCloseButton: true
				});
				top.Messenger().post(options);
				$('#photoCtrl').remove();
				// 刷新表格
				$("#grid").jqGrid().jqGrid("reloadGrid");
				}
				}
			},
			error: function(msg){
				closeLoader();
				shr.showError({message: jsBizMultLan.atsManager_holidayLimitList_i18n_7});
			},
			complete: function(){
				closeLoader();
			}
		});
	}

	  ,modifyImportAction:function(){
	  	document.documentElement.style.overflow='hidden';
	  	this.doImportData(undefined,undefined,'modify');
		var  importHTML= ''
		+ '<div id="photoCtrl">' 
		+	'<p>'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_22
			+ '</p>'
		+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_2
			+ '</div>'
		+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_3
			+ '</div>'
		+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_4
			+ '<br/>'
		+   '&nbsp;&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_35
			+ '<br/>'
		+	'&nbsp;&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_46
			+ '<br/>'
		+	' &nbsp;&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_5
			+ '<br/>'
		+		' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_37
        +   '</div>'
		+   '<br>'
		+       '</div>'
		+	'</div>'
		+ '</div>';
	  	$('#importDiv').css('height','600px').css('overflow-y','auto');
		if ($.browser.msie) {  // 通过iframe 等方式来填充页面的
	  		setTimeout(function(){
	  			//$('iframe')[1].contentWindow.$('#container').before(importHTML);//s-hr3.0不能这样用了。
				jQuery(window.frames["importFrame"].document).find("#container").before(importHTML);
				var rowBlockClass = $(jQuery(window.frames["importFrame"].document)).find("#workAreaDiv").find(".row-block");
				for(var i=0;i<rowBlockClass.length;i++){
				   $(rowBlockClass[i]).removeClass("row-block");
				}
				$(jQuery(window.frames["importFrame"].document)).find("body").css("line-height", "18px");
				
		 	},2000);
	  	}else{  // 通过 div 等方式来填充页面的 
			setTimeout(function(){
		 		$('#container').before(importHTML);
		 		$("button[id^=download]").closest(".row-block").find(".row-block").removeClass("row-block");
		 		$("button[id^=download]").closest(".row-block").removeClass("row-block");
		 		$('#file_upload').css("line-height",40);
		 	},1000);
		}
		$(".ui-dialog-titlebar-close").unbind().bind("click" , function(){
			$('#importDiv').dialog("close");
			document.documentElement.style.overflow='visible';
			//未解决ie缓存问题
			if($.browser.msie)
			location.reload();
		});	
		return;
	}
	,importModifyFileData: function(){
		//alert("读取服务器目录文件 解析");
		var that=this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitImportEditHandler&method=importModifyFileData";
		var fileName = $("#fileName").val();
		var realTotalNum = 0;
		var successTotalNum = 0;
		var failTotalNum = 0;
		$.ajax({
			url: url,
			beforeSend: function(){
				openLoader(1);
			},
			data: {
				fileName: fileName
			},
			success: function(msg){
				closeLoader();
				if((msg.importantError==null||msg.importantError=="")&&(msg.realTotalNum==null||msg.realTotalNum=="")){
				shr.showError({message: jsBizMultLan.atsManager_holidayLimitList_i18n_11});
				}else{
				if(msg.importantError!=null&&msg.importantError!=""){
				shr.showError({message: msg.importantError});
				}else{
				 realTotalNum = msg.realTotalNum;
				 successTotalNum = msg.successTotalNum;
				 failTotalNum = msg.failTotalNum;
					
				var tip="";
					tip =jsBizMultLan.atsManager_holidayLimitList_i18n_23+ "<br/>";
					tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_holidayLimitList_i18n_1, [realTotalNum]) + "<br/>" ;
					tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_holidayLimitList_i18n_0, [successTotalNum]) + "<br/>" ;
				
				if (msg.failTotalNum > 0) {
						tip = tip +  " <font color='red'>"
							+ shr.formatMsg(jsBizMultLan.atsManager_holidayLimitList_i18n_8, [failTotalNum]) + "</font><br/>" ;
						tip = tip +  jsBizMultLan.atsManager_holidayLimitList_i18n_9 + "<br/>" ;
						for(i=0;i<msg.errorStringList.length;i++){
							tip = tip + "  <font color='red'> " +　msg.errorStringList[i] + "</font><br/>" ;
						}
					}
				var options={
				   message:tip
				};
				$.extend(options, {
					type: 'info',
					hideAfter: null,
					showCloseButton: true
				});
				top.Messenger().post(options);
				$('#photoCtrl').remove();
				// 刷新表格
				$("#grid").jqGrid().jqGrid("reloadGrid");
				}
				}
			},
			error: function(msg){
				closeLoader();
				shr.showError({message: jsBizMultLan.atsManager_holidayLimitList_i18n_7});
			},
			complete: function(){
				closeLoader();
			}
		});
	}
	
	,viewTransactionAction : function () {
		//查看后台事务
		var url =  shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.base.job.app.JobInst.list";
		$("#dialogTransaction").children("iframe").attr('src', url);
		$("#dialogTransaction").dialog({
			width:950,
			height:650,
			modal: true,
			resizable: false,
			draggable: true,
			position: {
				my: 'center',
				at: 'top+15%',
				of: window
			}
		});
		//ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix
		//$(".ui-dialog-titlebar").remove();
		//$("#dialogTransaction").parent().find('.ui-dialog-titlebar').remove(); // 只是删除 查看后台事务
		$("#dialogTransaction").css({height:570});
	}
	//批量延期
	,batchExtensionAction : function () {
		var _self = this;
		var quickSearch = $('#grid').jqGrid("getGridParam").filterItems;
		var nodeLongNumber = eval("("+ $('#grid').jqGrid("getGridParam").tree_params +")").nodeLongNumber;
		var domainFilter = "";
		var fastfilter="";
		var fastFilterItems = this.getFastFilterItems();
		if (fastFilterItems) {
			fastfilter =JSON.stringify(fastFilterItems);
		}
		_self.remoteCall({
				type:"post",
				method:"getDomainFilter",
				async: false,
				param:{
					uipk : "com.kingdee.eas.hr.ats.app.HolidayLimit.list"
				},
				success:function(res){
					domainFilter =  res.domainFilter;
				}
		});
		var temp_rows1 = $("#grid").jqGrid("getSelectedRows");
		var temp_rows2 = $("#grid").jqGrid("getCol","id");
	/*	var hasLeft = "false";
		var realTempRow1 = [];
		for(var i=0;i<temp_rows1.length;i++){
			var trId = temp_rows1[i];
			var isIncount = $("tr[id^='" + trId + "']").children("td[aria-describedby='grid_employeeType.isInCount']").text();
			if("true" == isIncount){
				realTempRow1.push(trId);
			}else{
				hasLeft = "true";
			}
		}*/
		
		var realTempRow1 = [];
		for(var i=0;i<temp_rows1.length;i++){
			var trId = temp_rows1[i];
				realTempRow1.push(trId);
		}
		
		//第一种延期方式（全部延期）的标记，当全部记录大于一页记录时，才重新查询，否则直接通过页面的ID去更新全部
		var flag = $('#grid').getGridParam().records>$('#grid').getGridParam().rowNum;
		var records = $("#grid").getGridParam().records;

		var selectedRows =  encodeURIComponent(realTempRow1);
		var currentPageRows = encodeURIComponent(temp_rows2);
		/*if("true" == hasLeft){
			shr.showConfirm('选中的记录包含离职员工，将不会对离职员工进行延期处理。', function() {
		       _self.gotoBatchExtensionPage(selectedRows,currentPageRows,quickSearch,nodeLongNumber,domainFilter,flag,records);
		    });
		}else{
			   _self.gotoBatchExtensionPage(selectedRows,currentPageRows,quickSearch,nodeLongNumber,domainFilter,flag,records);
		}*/
		 _self.gotoBatchExtensionPage(selectedRows,currentPageRows,quickSearch,nodeLongNumber,domainFilter,flag,records,fastfilter);
		
	},
	gotoBatchExtensionPage : function(selectedRows,currentPageRows,quickSearch,nodeLongNumber,domainFilter,flag,records,fastfilter){
		localStorage.removeItem("holidayLimitSelectedRows");
		localStorage.removeItem("holidayLimitCurrentPageRows");
		localStorage.setItem("holidayLimitSelectedRows", selectedRows);
		localStorage.setItem("holidayLimitCurrentPageRows",currentPageRows);
		var temp_rows1 = $("#grid").jqGrid("getSelectedRows");
		if(temp_rows1.length > 300){
			shr.showWarning({"message" : jsBizMultLan.atsManager_holidayLimitList_i18n_40});
			return false;
		}
		this.reloadPage({
    			uipk: "com.kingdee.eas.hr.ats.app.HolidayLimitBatchExtension",
				billId:"",//框架会自动拼上billId,这里不需要这个，已经传了selectedRows。就是billId,以免url过长。params = $.extend(this.prepareParam(), params);直接覆盖掉
				quickSearch : encodeURIComponent(quickSearch),
				permItemId : "24b5487e-3008-4acd-a5c1-b9a34cd47497PERMITEM",
				nodeLongNumber : encodeURIComponent(nodeLongNumber),
				domainFilter : encodeURIComponent(domainFilter),
				fastfilter : encodeURIComponent(fastfilter),
				flag : encodeURIComponent(flag),
				records :encodeURIComponent(records) //总记录条数，用于后续页面的提示信息
    	});
	}
	//离职重算年假额度
	,leftGenerateAction:function(){
		var that = this;
		
		var billId = $.getUrlParam('billId');
		if(billId != undefined && billId != null && billId != ''){
		 	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitListHandler&method=getPerson";
		 	$.ajax({
				url: url,
				data: {
					billId:decodeURIComponent(billId)
				},
				success:function(res){
					that.reloadPage({
						uipk: "com.kingdee.eas.hr.ats.app.QuitHolidayLimit",
						name: encodeURIComponent(res.name),
						personId: res.personId,
						orgName : encodeURIComponent(res.orgName)
					});
			   }
			});
	    
		}else{
		 	this.reloadPage({
			uipk:"com.kingdee.eas.hr.ats.app.QuitHolidayLimit"
			});
		}
		
	}
	//新增导入
	  ,addImportAction:function(){
		document.documentElement.style.overflow='hidden';
		this.doImportData(undefined,undefined,'add');
			var  importHTML= ''
			+ '<div id="photoCtrl">' 
			+	'<p>'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_19
				+ '</p>'
			+	'<div class="photoState">'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_2
				+ '</div>'
			+	'<div class="photoState">'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_3
				+ '</div>'
			+　   '<div class="photoState">'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_4
				+ '<br/>'
			+   '&nbsp;&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_34
				+ '<br/>'
			+	'&nbsp;&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_45
				+ '<br/>'
			+	'&nbsp;&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_44
				+ '<br/>'
			+	'&nbsp;&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_14
				+ '<br/>'
			+		' &nbsp;&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_5
				+ '<br/>'
			+		' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
				+ jsBizMultLan.atsManager_holidayLimitList_i18n_36

			+   '<br>'
			+       '</div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+ '</div>';
			
	  	$('#importDiv').css('height','600px').css('overflow-y','auto');
	  	
	  	if ($.browser.msie) {  //浏览器为IE的时候， 通过iframe 等方式来填充页面的
	  		setTimeout(function(){
	  			//$('iframe')[1].contentWindow.$('#container').before(importHTML);//S-hr3.0不能这样使用了
				jQuery(window.frames["importFrame"].document).find("#container").before(importHTML);
				var rowBlockClass = $(jQuery(window.frames["importFrame"].document)).find("#workAreaDiv").find(".row-block");
				for(var i=0;i<rowBlockClass.length;i++){
				   $(rowBlockClass[i]).removeClass("row-block");
				}
				$(jQuery(window.frames["importFrame"].document)).find("body").css("line-height", "18px");
		 	},2000);
	  	}else{  // 通过 div 等方式来填充页面的 
			setTimeout(function(){
		 		$('#container').before(importHTML);
		 		$("button[id^=download]").closest(".row-block").find(".row-block").removeClass("row-block");
		 		$("button[id^=download]").closest(".row-block").removeClass("row-block");
		 		$('#file_upload').css("line-height",40);
		 		
		 	},1000);
		}
		$(".ui-dialog-titlebar-close").unbind().bind("click" , function(){
			$('#importDiv').dialog("close");
			document.documentElement.style.overflow='visible';
			//未解决ie缓存问题
			if($.browser.msie)
			location.reload();
		});	
		
		return;
		/*
		var  that = this;
		//关闭状态  1 为 正常  0 为 导入成功时关闭
		var colseState = 1;
		var  importHTML= ''
			+ '<div id="photoCtrl">' 
			+	'<p>假期额度新增导入说明</p>'
			+	'<div class="photoState">1. 上传文件不能修改模板文件的格式</div>'
			+	'<div class="photoState">2. 支持上传文件格式为xls,xlsx的excel文件</div>'
			+　   '<div class="photoState">3. 使用场景：<br/>'
			+	    ' &nbsp;&nbsp;若员工该假期类型导入周期内没有生成过假期额度,可以通过新增导入来生成;<br/>' 
			+		' &nbsp;&nbsp;新增导入的额度项目有标准额度,增减额度,已用额度和上期透支额度;<br/>' 
			+		' &nbsp;&nbsp;导入后: 实际额度  = 标准额度  + 增减额度<br/>'
			+		' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;剩余额度 = 实际额度 - 已用额度 - 上期透支额度;'

			+   '<br>'
			+ 	'<p>请选择所需要的操作</p>'
			+ 	'<div class="photoCtrlBox">'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadioAdd" checked ></span></div>'
			+       '<div class="photoCtrlUpload"><span>请选择上传文件</span></div>'
			+		'<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			+ 		'<div style="clear:both"><span style="color:red;display:none" id="file_warring">未选择上传文件</span></div>'
			+	    '</div>'
			+ '<div class="photoCtrlBox"><div id="exportBox"><div class="photoCtrlRadio"><input type="radio" name="inAndout" id="exportRadioAdd"></div><span>引出</span><span>额度新增模板 </span></div>  <div style="clear: both;"></div></div>'
			+       '</div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+ '</div>';
		$(document.body).append(importHTML);
		//$('#importRadioModify').shrRadio();
		$('#importRadioAdd, #exportRadioAdd').shrRadio();
		// 初始化上传按钮
		var data = {
			method: "uploadFile" 
		};
			
		data = $.extend(that.prepareParam(), data);
		//var url = that.dynamicPage_url + "?method=uploadFile&uipk="+data.uipk;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitImportEditHandler&method=uploadFile";
		url += "&" + getJSessionCookie();
		//在点击确定前，对文件进行上传处理
		var handleFlag = false;
		
		   	swf: "jslib/uploadify/uploadify.swf",
		    uploader: url,
		    buttonText: "选择文件",
		    buttonClass: "shrbtn-primary shrbtn-upload",
		    fileTypeDesc: "Excel",
		    fileTypeExts: "*.xls;*.xlsx",
		    async: false,
		    multi: false,
		    removeCompleted: false,
		    onUploadStart: function() {
		    	//openLoader(0); //遮罩层
			},
			onUploadComplete: function(file) {
				handleFlag = true;
				$('#file_warring').hide();
				//alert("onUploadSuccess 导入成功=="+JSON.stringify(data));
				//shr.showInfo({message: '上传成功'});
				//error_path = data;
				//$('#photoCtrl').dialog('close');
				//$(this).dialog( "close" );
				//刷新表格
				//$("#grid").jqGrid().jqGrid("reloadGrid");
			}
		});

		$('#photoCtrl').dialog({
			title: '假期额度新增导入',
			width: 600,
			height: 520,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+20%',
				of: window
			},
			close: function(event, ui) { 
			   if(colseState==1){
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitImportEditHandler&method=deleteFile";
		        	$.ajax({
		        		url: url
		        	})
		        	$(this).dialog( "close" );
		        	$('#photoCtrl').remove();
			   }
		        	} ,
			buttons: {
		        "确认": function() {
		        if ($('#exportRadioAdd').shrRadio('isSelected')) {
						that.exportHolidayLimitAddTemplateAction();
					}
		        	else if(handleFlag){
		        		that.importAddFileData();
		        		colseState=0;
		        		$(this).dialog( "close" );
		        		colseState=1;
		        		$('#photoCtrl').remove();
		        	}
		        	else{
		        		$('#file_warring').show();
		        	}
		        },
		        "关闭": function() {
		        	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitImportEditHandler&method=deleteFile";
		        	$.ajax({
		        		url: url
		        	})
		        	$(this).dialog( "close" );
		        	$('#photoCtrl').remove();
		        }
		    }
		});
		*/
	}
	,importAddFileData: function(){
		//alert("读取服务器目录文件 解析");
		var that=this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitImportEditHandler&method=importAddFileData";
		var fileName = $("#fileName").val();
		var realTotalNum = 0;
		var successTotalNum = 0;
		var failTotalNum = 0;
		$.ajax({
			url: url,
			beforeSend: function(){
				openLoader(1);
			},
			data: {
				fileName: fileName
			},
			success: function(msg){
				closeLoader();
				if((msg.importantError==null||msg.importantError=="")&&(msg.realTotalNum==null||msg.realTotalNum=="")){
				shr.showError({message: jsBizMultLan.atsManager_holidayLimitList_i18n_11});
				}else{
				if(msg.importantError!=null&&msg.importantError!=""){
				shr.showError({message: msg.importantError});
				}else{
				 realTotalNum = msg.realTotalNum;
				 successTotalNum = msg.successTotalNum;
				 failTotalNum = msg.failTotalNum;
					
				var tip="";
					tip =jsBizMultLan.atsManager_holidayLimitList_i18n_20 + "<br/>";
					tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_holidayLimitList_i18n_1, [realTotalNum]) + "<br/>" ;
					tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_holidayLimitList_i18n_0, [successTotalNum]) + "<br/>" ;
				
				if (msg.failTotalNum > 0) {
						tip = tip +  " <font color='red'>"
							+ shr.formatMsg(jsBizMultLan.atsManager_holidayLimitList_i18n_8, [failTotalNum])
							+ "</font><br/>" ;
						tip = tip +  jsBizMultLan.atsManager_holidayLimitList_i18n_9 + "<br/>" ;
						for(i=0;i<msg.errorStringList.length;i++){
							tip = tip + "  <font color='red'> " +　msg.errorStringList[i] + "</font><br/>" ;
						}
					}
				var options={
				   message:tip
				};
				$.extend(options, {
					type: 'info',
					hideAfter: null,
					showCloseButton: true
				});
				top.Messenger().post(options);
				$('#photoCtrl').remove();
				// 刷新表格
				$("#grid").jqGrid().jqGrid("reloadGrid");
				}
				}
			},
			error: function(msg){
				closeLoader();
				shr.showError({message: jsBizMultLan.atsManager_holidayLimitList_i18n_7});
			},
			complete: function(){
				closeLoader();
			}
		});
	}
	
	
	//导出模板
	,exportHolidayLimitAddTemplateAction : function () {
		var self = this;
		$grid = $('#grid');
		var postData = $grid.jqGrid("getGridParam", "postData");
		url = shr.getContextPath() + shr.dynamicURL + "?method=exportHolidayLimitAddTemplate";
		//标题
		url += "&title="
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_18;
		// set PostData
		$grid._pingPostData(postData);
		var param = postData;
		if (param.queryMode) {
			delete param.queryMode
		}
		if (!param.uipk) {
			param.uipk = self.reportUipk;
		}

		param.downSum = $('#downSum').attr('checked') == "checked" ? 1 : 0;

		param.isAll = true;
		url += "&" + $.param(param);

		url += "&queryMode=";

		var colModel = $grid.jqGrid("getGridParam", "colModel");
		for (var i = 0; i < colModel.length; i++) {
			var optionColumn = colModel[i];
			var hidden = optionColumn.hidden,
			label = optionColumn.label || optionColumn.name,
			index = optionColumn.index,
			dataColumnType = optionColumn.dataColumnType;
			if (index != null && index != "") {
				url += index + "," + hidden + "," + label + "," + dataColumnType + ";";
			}
		}

		document.location.href = url;
	}
	
	
	//导出模板
	,exportHolidayLimitInitalizeTemplateAction : function () {
		var self = this;
		$grid = $('#grid');
		var postData = $grid.jqGrid("getGridParam", "postData");
		url = shr.getContextPath() + shr.dynamicURL + "?method=exportHolidayLimitInitalizeTemplate";
		//标题
		url += "&title="
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_15;
		// set PostData
		$grid._pingPostData(postData);
		var param = postData;
		if (param.queryMode) {
			delete param.queryMode
		}
		if (!param.uipk) {
			param.uipk = self.reportUipk;
		}

		param.downSum = $('#downSum').attr('checked') == "checked" ? 1 : 0;

		param.isAll = true;
		url += "&" + $.param(param);

		url += "&queryMode=";

		var colModel = $grid.jqGrid("getGridParam", "colModel");
		for (var i = 0; i < colModel.length; i++) {
			var optionColumn = colModel[i];
			var hidden = optionColumn.hidden,
			label = optionColumn.label || optionColumn.name,
			index = optionColumn.index,
			dataColumnType = optionColumn.dataColumnType;
			if (index != null && index != "") {
				url += index + "," + hidden + "," + label + "," + dataColumnType + ";";
			}
		}

		document.location.href = url;
	}
	//导出模板
	,exportHolidayLimitModifyTemplateAction : function () {
		var self = this,
		$grid = $('#grid'),
		postData = $grid.jqGrid("getGridParam", "postData"),
		url = shr.getContextPath() + shr.dynamicURL + "?method=exportHolidayLimitModifyTemplate";
		
		//标题
		url += "&title="
			+ jsBizMultLan.atsManager_holidayLimitList_i18n_21;
		// set PostData
		$grid._pingPostData(postData);

		var param = postData;
		if (param.queryMode) {
			delete param.queryMode
		}
		if (!param.uipk) {
			param.uipk = self.reportUipk;
		}

		param.downSum = $('#downSum').attr('checked') == "checked" ? 1 : 0;

		param.isAll = true;
		url += "&" + $.param(param);

		url += "&queryMode=";

		var colModel = $grid.jqGrid("getGridParam", "colModel");
		for (var i = 0; i < colModel.length; i++) {
			var optionColumn = colModel[i];
			var hidden = optionColumn.hidden,
			label = optionColumn.label || optionColumn.name,
			index = optionColumn.index,
			dataColumnType = optionColumn.dataColumnType;
			if (index != null && index != "") {
				url += index + "," + hidden + "," + label + "," + dataColumnType + ";";
			}
		}
		document.location.href = url;
	},
	//旧版本导入
	/**
	 * 覆盖父类中的导入
	 */
	doImportDatas: function(curIOModelString, customData,classify) {
		if (typeof curIOModelString == 'undefined') {
			curIOModelString = this.getImportModel();
		}
	
		var importDiv = $('#importDiv');
		if (importDiv.length > 0) {
			importDiv.data('curIOModelString', curIOModelString);
			importDiv.data('customData', customData);
			importDiv.data('classify', classify);
			importDiv.dialog('open');
			return;
		}
		
		// 未生成dialog
		importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
		importDiv.data('curIOModelString', curIOModelString);
		importDiv.data('customData', customData);
		importDiv.data('classify', classify);
		
		var _self = this;
			importDiv.dialog({
				autoOpen: true,		
				width: 708,
				height: 700,
				title: jsBizMultLan.atsManager_holidayLimitList_i18n_10,
				resizable: true,
				position: ['top','top'],
				modal: true,
				open: function(event, ui) {
					if ($.browser.msie) {
						var url = shr.assembleURL('com.kingdee.shr.io.app.ImportInfo', 'view', {
							curIOModelString: curIOModelString,
							customData: customData,
							classify:classify
						});
						var content = '<iframe id="importFrame" name="importFrame" width="700" height="600" frameborder="0" scrolling="no" allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					} else {
						importDiv.css('padding', "0 20px");
						var url = shr.assembleURL('com.kingdee.shr.io.app.ImportInfo$page', 'view');
						shr.loadHTML({
							url: url,
							success: function(response) {
								importDiv.append(response);
							}
						});
					}
				},
				close: function(event, ui) {
					importDiv.empty();
					$(_self.gridId).jqGrid("reloadGrid");
				} 
			});
		
		$(".ui-dialog-titlebar-close").bind("click" , function(){
			importDiv.dialog("close");
		});		
	}
	//跳转加班转调休明细列表，把过滤条件存进session
	,otToTakeWorkDetailAction:function(){
		var _self = this;
		var holidayFileId = $.getUrlParam('billId');
		var rowData = $("#grid").jqGrid("getRowData");
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if ((holidayFileId == undefined || holidayFileId == "") 
			&& (billIds == undefined || billIds.length == 0)
			|| rowData.length == 0) {
			//如果没有勾选中额度记录，直接跳转加班转调休明细记录列表
			_self.loadTakeWorkDetailList();
		}else{
			var ids = [];
			
			if(billIds.length >0){
				for (var i = 0; i < billIds.length; i++) {
					ids.push($("#grid").jqGrid("getCell",billIds[i], "id"));
				}
			}else if(holidayFileId != undefined && holidayFileId != ""){
				for(var i=0; i<rowData.length; i++){
					ids.push(rowData[i].id);
				}
			}

			var postData = [];
			var datarow;
			var existedNonTW = false;
			for(var i=0; i<ids.length; i++){
				var holidayTypeId = $("#grid").jqGrid("getCell", ids[i], "holidayPolicy.holidayType.id");
				var proposerId = $("#grid").jqGrid("getCell", ids[i], "proposer.id");
				var proposerName = $("#grid").jqGrid("getCell", ids[i], "proposer.name");
				if(holidayTypeId == "+ZM5jTmrS0KHCjDSYGcFLf0tUpg="){//内置的调休假
					datarow = {
						id : ids[i],
						proposerId : proposerId,
						proposerName : proposerName
					}
					postData.push(datarow);
				}else{
					existedNonTW = true;
				}
			}
			if(existedNonTW  && (billIds != undefined && billIds.length > 0)){//勾选的记录有非调休假，弹个提示
				var confirmMessage = jsBizMultLan.atsManager_holidayLimitList_i18n_49
					+ '<br>'
					+ jsBizMultLan.atsManager_holidayLimitList_i18n_38;
				shr.showConfirm(confirmMessage, function(){
					top.Messenger().hideAll();
					_self.saveSelectedProposerIds(postData);
					_self.loadTakeWorkDetailList();
				});
			}else{
				_self.saveSelectedProposerIds(postData);
				_self.loadTakeWorkDetailList();
			}
			
		}
	}
	,saveSelectedProposerIds:function(postData){
		var _self = this;
		if(postData && postData.length>0){
			var postIds = [];
			var postNames = [];
			for(var i=0; i<postData.length; i++){
				postIds.push(postData[i].proposerId);
				postNames.push(postData[i].proposerName)
			}
			_self.remoteCall({
				type:"post",
				async:false,
				method:"saveSelectedProposerIds",
				param:{
					proposerIds:postIds.join(),
					proposerNames:postNames.join()
				}
			});
		}
	}
	,loadTakeWorkDetailList:function(){
		var _self = this;
		_self.reloadPage({
			uipk : 'com.kingdee.eas.hr.ats.app.OTtoTakeWorkDetail.list',
			holidayFileId : $.getUrlParam('billId') //从假期档案过来
		});
	},
	viewAction: function(billId, rowid) {
		if (this.uipk == "com.kingdee.eas.hr.ats.app.HolidayLimitPerself.list") {
			return;
		}else{
                shr.ats.team.TeamHolidayLimitList.superClass.viewAction.call(this,billId, rowid);
		}		
	}
	
});

//自动生成额度的Categorynumber为302!3005
function getJobFilter(){
	return "jobDefCategory.longNumber like '302!3005%' OR JOBDEF.mutex like '%Holiday%'" ;
}