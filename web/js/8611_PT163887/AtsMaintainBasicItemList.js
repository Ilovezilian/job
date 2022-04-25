shr.defineClass("shr.ats.AtsMaintainBasicItemList", shr.shrBaseData.maintain.MaintainList, {
	initalizeDOM : function () {
		shr.ats.AtsMaintainBasicItemList.superClass.initalizeDOM.call(this);
		//var that = this;AtsAvailableBasicItemList
	}
	,viewAction: function(billId) {
		var _self = this;
		var model = jsBinder.view_model;
		var billType = $("#grid").jqGrid("getRowData",billId).billType;
		var currentUipk = jsBinder.uipk;
		if(currentUipk == model+'.list'){
			toUipk = model+'.form';
		}else{
			toUipk =  model+".AvailableForm";
		}
		_self.reloadPage({
			uipk: toUipk,
			billId: billId,
			method: 'view'
		});		
	}
	,disableAction:function(){
        var billIds = this.getSelectedFields('isDefault');
        for (var i in billIds){
        	if (billIds[i]==1){
        		if (shr.getUrlParam("uipk")=='com.kingdee.eas.hr.ats.app.AttenceCycle.list'){
                    shr.showWarning({
                        message: jsBizMultLan.atsManager_AtsMaintainBasicItemList_27210656_i18n_1
                    });
                    return
				} else if (shr.getUrlParam("uipk")=='com.kingdee.eas.hr.ats.app.WorkCalendar.list') {
                    shr.showWarning({
                        message: jsBizMultLan.atsManager_AtsMaintainBasicItemList_27210656_i18n_0
                    });
                    return
				} else if (shr.getUrlParam("uipk")=='com.kingdee.eas.hr.ats.app.AtsShift.list') {
                    shr.showWarning({
                        message: jsBizMultLan.atsManager_AtsMaintainBasicItemList_27210656_i18n_2
                    });
                    return
                }


			}
		}
        this.doBatchEnable('batchDisable');
    }
	,availableAction:function(){
		var model = jsBinder.view_model;
		this.reloadPage({
			uipk: model+'.AvailableList'
		});
		
	}
	,addNewAction: function() {
		var model = jsBinder.view_model;		
		this.reloadPage({
			uipk: model+".form",
			method: 'addNew'
		});
	}
	
	
	,filterBeforeDelete : function(selectedIds){
		var $grid = $(this.gridId);
		selectedIds = selectedIds.split(",");
	     if (selectedIds.length > 0) {
			var billIds = [];
			var isSysPresetCnt=0;
			
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var isSysPreset=$grid.jqGrid("getCell", selectedIds[i], "isSysPreset");
				if(isSysPreset==0){
					billIds.push($grid.jqGrid("getCell", selectedIds[i], "id"));
				}else{//预置数据
					isSysPresetCnt++;
				}
			}
			//return billIds.toString();
			if(billIds.length==0){
			   shr.showWarning({
			     message: jsBizMultLan.atsManager_AtsMaintainBasicItemList_i18n_7
		       });
		       return ;
			}else{
				return  {
				   selectedIds:billIds.join(','),
				   isSysPresetCnt:isSysPresetCnt
				};
			}
	    }
		
		shr.showWarning({
			message: jsBizMultLan.atsManager_AtsMaintainBasicItemList_i18n_5
		});
	
	}
	
		
	/**
	 * 描述:删除操作 
	 */
	,deleteRecord:function(selectedIds) {
		
		var _self = this;
		var selectedIdsAndisSysPresetCnt = _self.filterBeforeDelete(selectedIds);
		if (!selectedIdsAndisSysPresetCnt) {
			return ;
		}
		
		
		var msg = jsBizMultLan.atsManager_AtsMaintainBasicItemList_i18n_3;
		if(selectedIdsAndisSysPresetCnt.isSysPresetCnt > 0 ){
			msg = jsBizMultLan.atsManager_AtsMaintainBasicItemList_i18n_0;
		}
		shr.showConfirm(msg, function(){
			_self.remoteCall({
				method: 'delete',
			 	param:{billId:selectedIds},
				async:true,
				success: function(response){ 
						shr.showInfo({message:jsBizMultLan.atsManager_AtsMaintainBasicItemList_i18n_6,hideAfter:4});
						_self.reloadPage(); 
				}
			});
		});
		
	}

	//旧的导入方式，临时放在基类一下
	/**
	 * 描述: 导入action
	 */
	,oldImportAction: function() {
		this.doOldImportData();
	}
	
	/**
	 * 导入
	 */
	,doOldImportData: function(curIOModelString, customData,classify) {
		var _self = this;
		if (typeof curIOModelString == 'undefined') {
			curIOModelString = this.getImportModel();
		}
	
		var importDiv = $('#importDiv');
		if (importDiv.length > 0 && _self.checkUpload()) {
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
		
		
		if(_self.checkUpload()){
			importDiv.dialog({
				autoOpen: true,		
				width: 708,
				height: 700,
				title: jsBizMultLan.atsManager_AtsMaintainBasicItemList_i18n_2,
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
						$("#file_upload").css({lineHeight:"60px"});
					} else {
						importDiv.css('padding', "0 20px");
						var url = shr.assembleURL('com.kingdee.shr.io.app.ImportInfo$page', 'view');
						shr.loadHTML({
							url: url,
							success: function(response) {
								importDiv.append(response);
								$("#file_upload").css({lineHeight:"60px"});
							}
						});
					}
					
				},
				close: function(event, ui) {
					importDiv.empty();
					$(_self.gridId).jqGrid("reloadGrid");
				} 
			});
		}
		
		$(".ui-dialog-titlebar-close").bind("click" , function(){
			importDiv.dialog("close");
		});		
	}
	/*
	 *检测 是否可以上传文件
	 * */
	,checkUpload :function(){
		return true;
	}
	

});
