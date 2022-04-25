shr.defineClass("shr.ats.AtsBasePersonManageRealtionSetting", shr.base.bizmanage.PersonManageRealtionSetting, {
    bizManageTypeID:"a1XVAx7aQEiqGkQqicFzfmWJ1dE=",//考勤业务管理类型ID
    category:"ATS",
	batchUipk : "",
	cache_key  : "",
	TitleContent : "",
	dialogUipk : "" ,
	editViewDisable:true,
	initalizeDOM : function () {
		shr.ats.AtsBasePersonManageRealtionSetting.superClass.initalizeDOM.call(this);
		var _self = this;
		_self.cache_key = shr.getCurrentViewPage().uipk=="com.kingdee.shr.base.bizmanage.app.AtsHolidayPersonBURelation"?"atsHolidayReceive_bill":"atsfileReceive_bill" ,
        //清楚本地缓存
		localStorage.removeItem(_self.cache_key);
		if(localStorage.getItem("marin_successMsg")){
		shr.showWarning({message:""+localStorage.getItem("marin_successMsg")});
		localStorage.removeItem("marin_successMsg");
		}
	}
   //接收时可以启用管理关系
	,dealRecived:function(){
	    $("#batchDisable").css("display","");
		$("#batchEnable").css("display","");
	}
	
    ,setNagivate: function(){//重载页面将LIST上方的面包屑和按钮都移除并修改原面包屑
		var _self = this;
	    var naviagateLength = $("#breadcrumb li").length;
		for(var i=naviagateLength-1;i>1;i--){
			$("#breadcrumb li").eq(i).remove();
		}
		$("#breadcrumb li").eq($("#breadcrumb li").length-1).html(_self.TitleContent);

		if (shrDataManager.pageNavigationStore.getDatas().length == 3) {
            shrDataManager.pageNavigationStore.pop();
        }
	}
   
	,createDialogDiv: function(billIds){
	
		var _self = this;
		
		$('#importDiv').remove();
		
		// 未生成dialog
		var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
		
		importDiv.dialog({
				modal : false,
				title : jsBizMultLan.atsManager_AtsBasePersonManageRealtionSetting_i18n_0,
				width : 1035,
				minWidth : 1035,
				height : 505,
				minHeight : 505,
				open: function(event, ui) {
				
						var url = shr.assembleURL(_self.dialogUipk, 'view',{serviceId:shr.getUrlRequestParam("serviceId")});
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

	
	,submitAndReceivedAction : function(){
	
		 var _self = this;
		_self.receiveAction();
	}
	/**
     * 接收至本组织
     */
	,receiveAction:function(){
        var _self = this;
         if(!_self.checkValidate()){
             return;
         }
        var selectedIds = $("#grid").jqGrid("getSelectedRows");
	
        if (selectedIds.length > 0) {
			var bills ;
			for (var i = 0;i<selectedIds.length; i++) {
				var itemState=$("#grid").jqGrid("getCell", selectedIds[i], "itemState");
				// if(itemState!=1 && itemState!=3 ){//
				// 	shr.showWarning({message: "接收失败！仅处理状态为“已提交未接收和拒绝接收”的可以接收至本组织", hideAfter: 3});
				// 	return;
				// }
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
				
			}
			
			localStorage.setItem(_self.cache_key,bills) ;
			_self.createDialogDiv() ;	
		}

		
		/*
        _self.remoteCall({
            method: "receive", 
            param: {selectedIds:bills}, 
            success: function(data) {
                shr.showInfo({message: "接收成功", hideAfter: 3});
               _self.reloadGrid();
            }
		});
	    */ 
    }
    /**
     * 武哥说避免客户自己配上导入按钮又无法使用，直接提示暂不支持导入功能
     */
//	,importAction : function(){
//	
//		 var _self = this;
//		 shr.showError({message: jsBizMultLan.atsManager_AtsBasePersonManageRealtionSetting_i18n_2});
//	}
	, batchSettingAction: function () {
		
		var _self = this;
		var $grid = $(_self.gridId);
		var gridData = [];
		var duplicateData = [];
		if($grid.jqGrid("getSelectedRows").length > 0){
			var selRowIds = $grid.jqGrid("getSelectedRows");
			for(var i=0;i < selRowIds.length; i++){
			  var personNumAndName = $grid.jqGrid("getRowData",selRowIds[i])["person.number"]
			  +"("+$grid.jqGrid("getRowData",selRowIds[i])["person.name"]+")";
			  if(gridData.indexOf(personNumAndName)<0){
			   	  gridData.push(personNumAndName);		  	
			  }else{
			  	  duplicateData.push(personNumAndName);		  	
			  }
			}
		}
		if(duplicateData.length>0){
    	 	shr.showWarning({ message: jsBizMultLan.atsManager_AtsBasePersonManageRealtionSetting_i18n_1+ duplicateData.toString() });
         	return;
		}
		shr.ats.AtsBasePersonManageRealtionSetting.superClass.batchSettingAction.call(this);
	}
});
