shr.defineClass("shr.ats.holidayLimitTransferInList", shr.framework.List,{
	pageStep: 1,//剩余额度转入叶签为选中状态(uipk为IN)
	initalizeDOM : function() {
		shr.ats.holidayLimitTransferInList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initTabPages();
		that.setNavigate();
		$("span[title='"+jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_7+"']")
			.attr("title",jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_8);
	},
	
	viewAction: function(billId) {
		
	} 
	
	
	//转入
	
	,transferAction: function() {
//			如果没有选择列表记录，直接点击‘转入’，提示‘’
//	如果选择的记录包已转入的额度记录，则提示‘’，选‘是’则继续转入操作，弹出转入操作弹出框。选‘否’则放弃转入额度撤回操作
//	如果选择的记录全是已转入状态的额度记录，则提示‘’。
//	如果选择的记录全是已转出状态的额度记录，则不弹出提示，直接进入到转入操作弹出框。

		var _self = this;
		var billId = $("#grid").jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0) {
	        shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_2});
			return ;
	    }
		var isAllTransfer=true;
	    var ids = [];
		for (var i = 0; i < billId.length; i++) {
			var limitstatus = $("#grid").jqGrid("getRowData",billId[i]).transferStatus;
			console.log($("#grid").jqGrid("getRowData",billId[i]));
			var transferStatus = $("#grid").jqGrid("getRowData",billId[i])['transferStatus'];
			if(transferStatus==0){//未转入的状态下,会被忽略, 剩余额度结转状态 0 已转入      1 已转出
				isAllTransfer=false;
			}
			else{
				ids.push($("#grid").jqGrid("getCell",billId[i], "id"));
			}
		}
		var confirmMess="";
		if(isAllTransfer==false){
			confirmMess=jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_6;
		}else{
			confirmMess=jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_4;
		}
		
		if(ids.length>0){
			ids=ids.join(",");
		}else{
			shr.showWarning({message: jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_0});
			return ;
		}
		
	this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayLimit.Transfer'
		});			
	}

	
	
	
		
	//撤销转入
	//传入Id为转出转入表的Id
	,cancelTransferInAction : function() {
		var _self = this;
		var billId = $("#grid").jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0) {
	        shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_3});
			return ;
	    }
		var isAllTransfer=true;
	    var ids = [];
		for (var i = 0; i < billId.length; i++) {
			var limitstatus = $("#grid").jqGrid("getRowData",billId[i]).transferStatus;
			console.log($("#grid").jqGrid("getRowData",billId[i]));
			var transferStatus = $("#grid").jqGrid("getRowData",billId[i])['transferStatus'];
			if(transferStatus!=0){//未转入的状态下,会被忽略, 剩余额度结转状态 0 已转入      1 已转出
				isAllTransfer=false;
			}
			else{
				ids.push($("#grid").jqGrid("getCell",billId[i], "id"));
			}
		}
		var confirmMess="";
		if(isAllTransfer==false){
			confirmMess=jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_5;
		}else{
			confirmMess=jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_4;
		}
		
		if(ids.length>0){
			ids=ids.join(",");
		}else{
			shr.showWarning({message: jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_1});
			return ;
		}
		
		
		
		//撤销的逻辑
		shr.showConfirm(confirmMess, function(){
			top.Messenger().hideAll();
			
//			_self.doRemoteAction({
//				method: 'cancelTransferIn',//将此类数据存入转出转入表
//				billId: ids
//			});
			
			_self.batchDeleteAction();
			
		});
		
		
	}
	
	
	
	//转入
	,transfer00Action : function() {
		var _self = this;
//		var billId = $("#grid").jqGrid("getSelectedRows");
//		if (billId == undefined || billId.length==0) {
//	        shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_2});
//			return ;
//	    }
//		var isAllTransfer=true;
//	    var ids = [];
//		for (var i = 0; i < billId.length; i++) {
//			var limitstatus = $("#grid").jqGrid("getRowData",billId[i]).status;
//			console.log($("#grid").jqGrid("getRowData",billId[i]));
//			var transferStatus = $("#grid").jqGrid("getRowData",billId[i])['transferStatus'];
//			if(transferStatus==0){//已转入状态,会被忽略, 剩余额度结转状态 0 已转入      1 已转出
//				isAllTransfer=false;
//			}
//			else{
//				ids.push($("#grid").jqGrid("getCell",billId[i], "id"));
//			}
//		}
		var confirmMess="";
//		if(isAllTransfer==false){
//			confirmMess="选择的记录中包含已转入的记录，已转入的记录会被忽略，是否继续？";
//		}
//		
//		if(ids.length>0){
//			ids=ids.join(",");
//		}else{
//			shr.showWarning({message: jsBizMultLan.atsManager_holidayLimitTransferInList_i18n_0});
//			return ;
//		}
//		
//		
//		
		//转入的逻辑
		shr.showConfirm(confirmMess, function(){
			top.Messenger().hideAll();
			
			//转出转入表
			localStorage.setItem(_self.cache_key,ids) ;
			
			
			_self.doRemoteAction({
				method: 'transfer',
				billId: ids
			});
			
			_self.createDialogDiv() ;
		});
		
		
		
		//TODO
		
		
	}
	
	
	
	,createDialogDiv : function(){
		var _self = this;
		$('#transferLimitDiv').remove();
		
			// 未生成dialog
		var transferLimitDiv = $('<div id="transferLimitDiv"></div>').appendTo($('body'));
			
		transferLimitDiv.dialog({
				modal : false,
				title : '',
				width : 1035,
				minWidth : 1035,
				height : 505,
				minHeight : 505,
				open: function(event, ui) {
				
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.HolidayLimit.Transfer', 'view', {
						serviceId : shr.getUrlParam('serviceId')
						});
						var content = '<iframe id="transferLimitFrame" name="transferLimitFrame" width="100%" height="100%" frameborder="0"  allowtransparency="true" src="' + url + '"></iframe>';
						transferLimitDiv.append(content);
					//	$("#importFrame").attr("style", "width:1035px;height:505px;");
				},
				close: function(event, ui) {
					transferLimitDiv.empty();
					$(_self.gridId).jqGrid("reloadGrid");
				}  
			});
			
			$(".ui-dialog-titlebar-close").bind("click" , function(){
				transferLimitDiv.dialog("close");
			});	
	
	}
	
	,initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
		
		//剩余额度转出
		$('#outHolidayLimitList').click(function(){  
			that.pageStep = 0;
			//定义标签样式
			that.changePageLabelColor();
			console.log(that.reloadPage);
			that.reloadPage({
			  uipk: 'com.kingdee.eas.hr.ats.app.HolidayLimitTransfer.out'
			});	
		});
		//剩余额度转入
	    $('#inHolidayLimitList').click(function(){ 
			that.pageStep = 1;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayLimitTransfer.in'
		    });	
		});
		
		
	
		
	},
	
   changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.pageStep).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.pageStep).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
	}
	,setNavigate:function(){
		var naviagateLength = $("#breadcrumb li").length;
//		for(var i=naviagateLength-2;i>0;i--){
			$("#breadcrumb li").eq(3).remove();
//		}
//		$("#breadcrumb li").eq($("#breadcrumb li").length-1).html("");
	}

});