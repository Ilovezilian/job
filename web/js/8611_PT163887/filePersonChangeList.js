shr.defineClass("shr.ats.FilePersonChangeList", shr.framework.List, {
	
	editViewDisable:true,//不跳转到编辑界面
	cache_msg_key:"atsPersonChangeList_msgid",
	initalizeDOM : function () {
		shr.ats.FilePersonChangeList.superClass.initalizeDOM.call(this);
		var that = this;	
		that.initButtonTips();
		that.initTabPages();
		that.getPersonChangeTabNum();

		shrDataManager.pageNavigationStore.pop();//页签切换会导致面包屑重复
		

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
					$("#leftRetirePersonList").html($("#leftRetirePersonList").html()+"("+res.tab4Num+")");
					$("#partTimeSendPersonList").html($("#partTimeSendPersonList").html()+"("+res.tab5Num+")");
					$("#otherPersonList").html($("#otherPersonList").html()+"("+res.tab6Num+")");
					$("#undoPersonList").html($("#undoPersonList").html()+"("+res.tab7Num+")");
					$("#enrollAdjustPersonList").html($("#enrollAdjustPersonList").html()+"("+res.tab8Num+")");
			    }
		 });
	},
	initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
	    //入职
	    $('#entryPersonList').click(function(){ 
			that.pageStep = 0;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.list'
		    });	
		});
		//入职
	    $('#enrollAdjustPersonList').click(function(){ 
			that.pageStep = 1;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.enrollAdjustPersonList.list'
		    });	
		});
		//转正
		$('#positivePersonList').click(function(){
			that.pageStep = 2;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.positivePersonList.list'
		    });	
		});
		//调动
		$('#transferPersonList').click(function(){  
		    that.pageStep = 3;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.transferPersonList.list',
				pageStep: 3
		    });	
		});
		//离职|退休 --
		$('#leftRetirePersonList').click(function(){ 
		    that.pageStep = 4;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.leftRetirePersonList.list',
				pageStep: 4
		    });	
		});
		//兼职|借调|外派|返聘--
		$('#partTimeSendPersonList').click(function(){
		    that.pageStep = 5;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.partTimeSendPersonList.list',
				pageStep: 5
		    });	
		});
		//其他--
		$('#otherPersonList').click(function(){
		    that.pageStep = 6;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.otherPersonList.list',
				pageStep: 6
		    });	
		});
		$('#undoPersonList').click(function(){
		    that.pageStep = 7;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.undoPersonList.list',
				pageStep: 7
		    });	
		});
	},
	initButtonTips : function(){
		$("#confirmAndCreateFile").attr("title",jsBizMultLan.atsManager_filePersonChangeList_i18n_5);
		$("#lapseFile").attr("title",jsBizMultLan.atsManager_filePersonChangeList_i18n_4);
		$("#ignore").attr("title",jsBizMultLan.atsManager_filePersonChangeList_i18n_6);
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
	
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_filePersonChangeList_i18n_8});
			return;
		}
		
		var selectedIds = $("#grid").jqGrid("getSelectedRows");
	    var hasItemState = false;
        if (selectedIds.length > 0) {
			var bills ;
			var msgIds ;
			var msgidArray = new Array();
			for (var i = 0;i<selectedIds.length; i++) {
				var itemState=$("#grid").jqGrid("getCell", selectedIds[i], "confirmState");
				if(itemState==0){
					hasItemState = true;
					msgidArray[msgidArray.length] = $("#grid").jqGrid("getCell", selectedIds[i], "changeMsgId");
					if(bills){
						bills = bills+','+selectedIds[i];
					}else{
						bills = selectedIds[i];
					}
				}
				
			}
			if(hasItemState){
				$.unique(msgidArray)
				for (var i = 0;i<msgidArray.length; i++) {
				  if(msgIds){
					msgIds = msgIds+','+msgidArray[i];
				  }else{
					msgIds = msgidArray[i];
				  }
				}
				localStorage.setItem(_self.cache_msg_key,msgIds) ;
				if(selectedIds.length == bills.split(',').length){
					localStorage.setItem(_self.cache_key,bills) ;
					if(!secondFlag){
						if(_self.checkMutilMessage(event,bills)){
							return;
						}
					}
					_self.createDialogDiv() ;	
				}else{
					shr.showConfirm(jsBizMultLan.atsManager_filePersonChangeList_i18n_9, function(){
						localStorage.setItem(_self.cache_key,bills) ;
						if(!secondFlag){
							if(_self.checkMutilMessage(event,bills)){
								return;
							}
						}
					    _self.createDialogDiv() ;	
					});
				}
				
								
			}else{
				shr.showWarning({message : jsBizMultLan.atsManager_filePersonChangeList_i18n_0});
			}
		}
	},
	ignoreAction : function(event) {
		var _self = this;
	
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_filePersonChangeList_i18n_8});
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
				shr.showWarning({message : jsBizMultLan.atsManager_filePersonChangeList_i18n_7});
				return;
			}
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.PersonBURelaConfirmCFListHandler&method=ignore";
			openLoader(1,jsBizMultLan.atsManager_filePersonChangeList_i18n_10);
			shr.ajax({
				type:"post",
				async:true,
				url:url,
				data:{"ids":bills},
				success:function(res){
					shr.showInfo({message: jsBizMultLan.atsManager_filePersonChangeList_i18n_11});
					closeLoader();
					window.location.reload();
				}
			});	
		}
	},
	
	lapseFileAction : function(event) {
		var _self = this;
	
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_filePersonChangeList_i18n_8});
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
				shr.showWarning({message : jsBizMultLan.atsManager_filePersonChangeList_i18n_7});
				return;
			}
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.PersonBURelaConfirmCFListHandler&method=lapseFile";
			openLoader(1,jsBizMultLan.atsManager_filePersonChangeList_i18n_10);
			shr.ajax({
				type:"post",
				async:true,
				url:url,
				data:{"ids":bills},
				success:function(res){
					shr.showInfo({message: jsBizMultLan.atsManager_filePersonChangeList_i18n_1});
					closeLoader();
					window.location.reload();
				}
			});	
		}
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
				data:{"billIds":bills,"bizManageType":'a1XVAx7aQEiqGkQqicFzfmWJ1dE='},
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
							messageTml += shr.formatMsg(jsBizMultLan.atsManager_filePersonChangeList_i18n_2
								,[resultList[i].bizDefineType.alias+"&nbsp;", startDateTime+"&nbsp;"]) + "<br>";
						}
						
						shr.showConfirm(jsBizMultLan.atsManager_filePersonChangeList_i18n_3+"<br><br>"+messageTml, function(){
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