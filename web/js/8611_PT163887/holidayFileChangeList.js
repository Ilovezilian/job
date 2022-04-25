shr.defineClass("shr.ats.holidayFileChangeList", shr.framework.List, {
	cache_msg_key:"atsPersonChangeList_msgid",
	editViewDisable:true,
	initalizeDOM : function () {
		shr.ats.holidayFileChangeList.superClass.initalizeDOM.call(this);
		var that = this;	
		that.initButtonTips();
		that.initTabPages();
		that.getPersonChangeTabNum();
		if($("#breadcrumb").children().length >=4){
			for(var i = $("#breadcrumb").children().length - 1; i >= 3; i--) { 
			var list=document.getElementById("breadcrumb");
			list.removeChild(list.childNodes[i]);
			}
		}
	}
	,getPersonChangeTabNum : function(){
		var _self = this;
		var serviceId = shr.getUrlRequestParam("serviceId");
		var uipk = shr.getUrlRequestParam("uipk")
		 var url = shr.getContextPath() + "/dynamic.do?uipk="+uipk+"&method=getPersonChangeTabNum";
		 url += '&serviceId='+encodeURIComponent(serviceId);
		 shr.ajax({
				type:"post",
				async:true,
				data:{longNumber:$("#treeNavigation").shrGridNavigation('getValue').longNumber},
				url:url,
				success:function(res){
					$("#entryPersonList").html($("#entryPersonList").html()+"("+res.tab1Num+")");
					$("#positivePersonList").html($("#positivePersonList").html()+"("+res.tab2Num+")");
					$("#transferPersonList").html($("#transferPersonList").html()+"("+res.tab3Num+")");
					//$("#leftRetirePersonList").html($("#leftRetirePersonList").html()+"("+res.tab4Num+")");
					$("#partTimeSendPersonList").html($("#partTimeSendPersonList").html()+"("+res.tab5Num+")");
					$("#otherPersonList").html($("#otherPersonList").html()+"("+res.tab6Num+")");
					$("#undoPersonList").html($("#undoPersonList").html()+"("+res.tab7Num+")");
					$("#enrollAdjustPersonList").html($("#enrollAdjustPersonList").html()+"("+res.tab8Num+")");
			    }
		 });
		var serviceId = shr.getUrlRequestParam("serviceId");
	},initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
	    //入职
	    $('#entryPersonList').click(function(){ 
			that.pageStep = 0;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirmHolidayFile.list'
		    });	
		});
		//入错职
	    $('#enrollAdjustPersonList').click(function(){ 
			that.pageStep = 1;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirmHolidayFile.enrollAdjustPersonList.list'
		    });	
		});
		//转正
		$('#positivePersonList').click(function(){
			that.pageStep = 2;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirmHolidayFile.positivePersonList.list'
		    });	
		});
		//调动
		$('#transferPersonList').click(function(){  
		    that.pageStep = 3;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirmHolidayFile.transferPersonList.list',
				pageStep: 3
		    });	
		});
		//离职|退休 --
		$('#leftRetirePersonList').click(function(){
		    that.pageStep = 4;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirmHolidayFile.leftRetirePersonList.list',
				pageStep: 4
		    });	
		});
		//兼职|借调|外派|返聘--
		$('#partTimeSendPersonList').click(function(){
		    that.pageStep = 5;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirmHolidayFile.partTimeSendPersonList.list',
				pageStep: 5
		    });	
		});
		//其他
		$('#otherPersonList').click(function(){
		    that.pageStep = 6;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirmHolidayFile.otherPersonList.list',
				pageStep: 6
		    });	
		});
		//其他
		$('#undoPersonList').click(function(){
		    that.pageStep = 7;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirmHolidayFile.undoPersonList.list',
				pageStep: 7
		    });	
		});
	},
	initButtonTips : function(){
		$("#confirmAndCreateFile").attr("title",jsBizMultLan.atsManager_holidayFileChangeList_i18n_6);
		$("#lapseFile").attr("title",jsBizMultLan.atsManager_holidayFileChangeList_i18n_5);
		$("#ignore").attr("title",jsBizMultLan.atsManager_holidayFileChangeList_i18n_7);
	},
    changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.pageStep).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.pageStep).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
	},
	confirmAndCreateFileAction : function(event,secondFlag) {
		var _self = this;
		var hasWaitConfirm = false;
		var hasHasConfirm = false;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_holidayFileChangeList_i18n_11});
			return;
		}
	
		var selectedIds = $("#grid").jqGrid("getSelectedRows");
	
        if (selectedIds.length > 0) {
        	var bills;
        	var msgIds ;
			var msgidArray = new Array();
			for (var i = 0;i<selectedIds.length; i++) {
				var item = selectedIds[i];
				var data = $("#grid").jqGrid("getRowData", item);
				var confirmState=data["confirmState"];
				if(confirmState=="0"){
					hasWaitConfirm = true;
					msgidArray[msgidArray.length] = $("#grid").jqGrid("getCell", selectedIds[i], "changeMsgId");
					if(bills){
						bills = bills+','+selectedIds[i];
					}else{
						bills = selectedIds[i];
					}
				}else{
					hasHasConfirm = true;
				}
			}
			if(hasWaitConfirm){
				$.unique(msgidArray)
				for (var i = 0;i<msgidArray.length; i++) {
				  if(msgIds){
					msgIds = msgIds+','+msgidArray[i];
				  }else{
					msgIds = msgidArray[i];
				  }
				}
				localStorage.setItem(_self.cache_msg_key,msgIds) ;
			}
			if(hasWaitConfirm&&hasHasConfirm){
				shr.showConfirm(jsBizMultLan.atsManager_holidayFileChangeList_i18n_9, function(){
					localStorage.setItem(_self.cache_key,bills) ;
					if(!secondFlag){
						if(_self.checkMutilMessage(event,bills)){
							return;
						}
					}
					_self.createDialogDiv() ;
			    });
			}else if(!hasWaitConfirm&&hasHasConfirm){
				shr.showWarning({message : jsBizMultLan.atsManager_holidayFileChangeList_i18n_8});
				return;
			}else if(hasWaitConfirm&&!hasHasConfirm){
				localStorage.setItem(_self.cache_key,bills) ;
				if(!secondFlag){
					if(_self.checkMutilMessage(event,bills)){
						return;
					}
				}
				_self.createDialogDiv() ;
			}
		}
	},
	ignoreAction : function() {
		var clz = this;
		var hasConfirm=false;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_holidayFileChangeList_i18n_11});
			return;
		}
		var bills;
		var selectedIds = $("#grid").jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			for (var i = 0;i<selectedIds.length; i++) {
				var item = selectedIds[i];
				var data = $("#grid").jqGrid("getRowData", item);
				var confirmState=data["confirmState"];
				if(confirmState !=1){
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
				}
				if(confirmState ==1){
				hasConfirm=true;
				}
			}
		}
		if(hasConfirm){
		shr.showWarning({message : jsBizMultLan.atsManager_holidayFileChangeList_i18n_0});
		return;
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayBURelaConfirmCFListHandler&method=ignoreSubmit";
		shr.ajax({
				type:"post",
				async:true,
				url:url,
				data:{billId:bills},
				success:function(res){
				window.location.reload();
			    }
		});		
	},
	lapseFileAction : function(event) {
		var _self = this;
	
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_holidayFileChangeList_i18n_11});
			return;
		}
		
		var selectedIds = $("#grid").jqGrid("getSelectedRows");
	    var hasItemState = false;
        if (selectedIds.length > 0) {
			var bills ;
			for (var i = 0;i<selectedIds.length; i++) {
				var itemState=$("#grid").jqGrid("getCell", selectedIds[i], "confirmState");
				if(itemState==0){
					hasItemState = true;
					if(bills){
						bills = bills+','+selectedIds[i];
					}else{
						bills = selectedIds[i];
					}
				}
				
			}
			if(!bills){
				shr.showWarning({message : jsBizMultLan.atsManager_holidayFileChangeList_i18n_10});
				return;
			}
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayBURelaConfirmCFListHandler&method=lapseFile";
			openLoader(1,jsBizMultLan.atsManager_holidayFileChangeList_i18n_12);
			shr.ajax({
				type:"post",
				async:true,
				url:url,
				data:{"ids":bills},
				success:function(res){
					shr.showInfo({message: jsBizMultLan.atsManager_holidayFileChangeList_i18n_1});
					closeLoader();
					window.location.reload();
				}
			});	
		}
	},
	createDialogDiv : function(){
		var _self = this;
		$('#importDiv').remove();
		var pageTag = _self.pageStep;
			// 未生成dialog
		var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
			
		importDiv.dialog({
				modal : false,
				title : jsBizMultLan.atsManager_holidayFileChangeList_i18n_2,
				width : 1035,
				minWidth : 1035,
				height : 505,
				minHeight : 505,
				open: function(event, ui) {
						var url = shr.assembleURL('com.kingdee.shr.base.bizmanage.app.atsHolidayFilePerson.list.createFile', 'view', {
						serviceId : shr.getUrlParam('serviceId'),
						state : 1,
						pageStep : _self.pageStep,
						pageTag : pageTag
						});
						var content = '<iframe id="importFrame" name="importFrame" width="100%" height="100%" frameborder="0"  allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					//	$("#importFrame").attr("style", "width:1035px;height:505px;");
				},
				close: function(event, ui) {
					importDiv.empty();
//					$(_self.gridId).jqGrid("reloadGrid");
				}  
			});
			$(".ui-dialog-titlebar-close").bind("click" , function(){
				importDiv.dialog("close");
			});	
	}
	,checkMutilMessage : function(event,bills){
		 var _self = this;
		 var serviceId = shr.getUrlRequestParam("serviceId");
		 var uipk = shr.getUrlRequestParam("uipk")
		 var url = shr.getContextPath() + "/dynamic.do?uipk="+uipk+"&method=confirmAndCreateFile";
		 url += '&serviceId='+encodeURIComponent(serviceId);
		 var hasMutilMessage = false;
		 
		 var billIds = $("#grid").jqGrid("getSelectedRows");
		 shr.ajax({
				type:"post",
				async:false,
				data:{"billIds":bills,"bizManageType":'WMwl/vtBvkmbWdGELoP6Y2WJ1dE='},
				url:url,
				success:function(res){
					var resultList = JSON.parse(res.result);
					if(resultList!=undefined && resultList.length>0){
						var messageTml ="";
						for(var i=0;i<resultList.length;i++){
							var startDateTime = resultList[i].newEmpOrgRelation.startDateTime;
							if(startDateTime.substring(11)=="00:00:00"){
								startDateTime = startDateTime.substring(0,10);
							}
							messageTml += resultList[i].person.number+"("+resultList[i].person.name_l2+"):<br>";
							messageTml += shr.formatMsg(jsBizMultLan.atsManager_holidayFileChangeList_i18n_3 ,
								[resultList[i].bizDefineType.alias+ "&nbsp;", startDateTime + "&nbsp;"]) + "<br>";
						}
						
						shr.showConfirm(jsBizMultLan.atsManager_holidayFileChangeList_i18n_4 + "<br><br>"+messageTml, function(){
							_self.confirmAndCreateFileAction(event,true);
						});
						hasMutilMessage =true;
					}
					console.log(resultList);
			    }
		 });
		 return hasMutilMessage;
	}
});