shr.defineClass("shr.ats.atsHolidayPersonBUBrowseList", shr.base.bizmanage.PersonBUBrowseList, {
	initalizeDOM:function(){
		shr.ats.atsHolidayPersonBUBrowseList.superClass.initalizeDOM.call(this);
		var _self = this ;
		
       // $("#grid").jqGrid('setGridParam',{datatype:"local"});//初始化时页面不加载数据
	}
	
/*	,saveAndSubmitAction : function(billIds){
	
		var _self = this;
		var bathSetting = shr.getUrlParam("batchSetting") ;
		var isInHrorg = shr.getUrlParam("isInHrorg") ;
		if($("#grid").jqGrid("getRowData").length==0){
        	shr.showWarning({message: "请先生成预览数据！", hideAfter: 3});
        	return;
        }
		if(bathSetting  == 0 && isInHrorg == 0){
		    shr.ats.atsHolidayPersonBUBrowseList.superClass.saveAndSubmitAction.call(this);
      
	         shr.callHandler({
	            handler: "com.kingdee.shr.ats.web.handler.AtsHolidayPersonBUBrowseListHandler",
	            action: "saveAndSubmit",
	            async: false,
	            param: "",
	            type: "POST",
	            success: function (res) {
	               //result = data.result;
	                shr.showInfo({message: "保存并提交成功！", hideAfter: 3});
					//history.back();
					 jsBinder.reloadPage({
					 	uipk: jsBinder.reloadUipk,
						tabs:_self.tabs,
					//	tabs1:_self.tabs1,
					 });
	            }
	           

        	});
		}else{
		    $('#importDiv').remove();
		
			// 未生成dialog
			var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
			
			importDiv.dialog({
					modal : false,
					title : jsBizMultLan.atsManager_atsHolidayPersonBUBrowseList_i18n_0,
					width : 1035,
					minWidth : 1035,
					height : 505,
					minHeight : 505,
					open: function(event, ui) {
					
							var url = shr.assembleURL('com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.bacthAttHolidayFile', 'view', {
								serviceId : shr.getUrlParam('serviceId')
							});
							var content = '<iframe id="importFrame" name="importFrame" width="100%" height="100%" frameborder="0"  allowtransparency="true" src="' + url + '"></iframe>';
							importDiv.append(content);
						//	$("#importFrame").attr("style", "width:1035px;height:505px;");
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
		
    } 
	*/
	,submitAndAcceptAction: function(){
    	var _self = this;
		var bathSetting = shr.getUrlParam("batchSetting") ;
		var isInHrorg = shr.getUrlParam("isInHrorg") ;
		var selectedID = "";
		if($("#grid").jqGrid("getRowData").length==0){
        	shr.showWarning({message: jsBizMultLan.atsManager_atsHolidayPersonBUBrowseList_i18n_1, hideAfter: 3});
        	return;
        }
        if($(this.gridId).jqGrid("getSelectedRows").length>0){
        	selectedID = "'"+$(this.gridId).jqGrid("getSelectedRows").join("','")+"'";
        }
	    $('#importDiv').remove();
	
		// 未生成dialog
		var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
		
		importDiv.dialog({
				modal : false,
				title : jsBizMultLan.atsManager_atsHolidayPersonBUBrowseList_i18n_0,
				width : 1035,
				minWidth : 1035,
				height : 505,
				minHeight : 505,
				open: function(event, ui) {
				
						var url = shr.assembleURL('com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.bacthAttHolidayFile', 'view', {
							serviceId : shr.getUrlParam('serviceId'),
							selectedID : selectedID
						});
						var content = '<iframe id="importFrame" name="importFrame" width="100%" height="100%" frameborder="0"  allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					//	$("#importFrame").attr("style", "width:1035px;height:505px;");
						$('#importDiv').css({overflow: 'hidden'});
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
    
	 
});