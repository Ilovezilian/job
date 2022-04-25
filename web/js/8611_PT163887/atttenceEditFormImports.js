shr.defineClass("shr.ats.atttenceEditFormImports", shr.ats.AtsMaintainBasicItemEdit, {
	
	 // 让调用方提供节点 
		lastUipk : "" ,
		viewModel : "",
		grid : "" ,
		className : "" ,
		initalizeDOM : function () {
		shr.ats.atttenceEditFormImports.superClass.initalizeDOM.call(this);
		var that = this;
		lastUipk = this.uipk;
		viewModel = this.view_model;
		grid = "";
		className = "";
		selfParam = this.setImportSelfParam();
		//
		//titleName = this.title;
		// com.kingdee.shr.ats.web.formEditImport.AttenceEditFormImportHandler
	},
	// grid 指定哪个editGrid
	setImportSelfParam : function(){
	
		return "" ;
	},
	/*
	importAction: function(gridID,classfullName) {
		
		var _self = this;
		if(gridID != undefined)
		{
			grid = gridID	;
		}
		if(classfullName != undefined)
		{
			className = classfullName ;
		}
		
		var importDiv = $('#importDiv');
		if (importDiv.length > 0) {
		//	importDiv.data('uipk', lastUipk);
		//	importDiv.data('viewModel', viewModel);
		//	importDiv.data('classify', classify);
		//	importDiv.dialog('open');
		//	return;
		}
		 $('#importDiv').remove();
		 
		 selfParam = _self.setImportSelfParam();
		// 未生成dialog
		importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
		importDiv.data('uipk', lastUipk);
		importDiv.data('viewModel', viewModel);
		importDiv.data('grid', grid);
		importDiv.data('className', className);
		importDiv.data('selfParam',selfParam);
	//	importDiv.data('classify', classify);

		if(_self.checkUpload()){ 
			importDiv.dialog({
				autoOpen: true,		
				width: 708,
				height: 700,
				title: "导入数据",
				resizable: true,
				position: ['top','top'],
				modal: true,
				open: function(event, ui) {
					/*if ($.browser.msie) {
						var url = shr.assembleURL('hr.ats.com.atttendanceCommonImport', 'view', {
							lastUipk: lastUipk,
							viewModel: viewModel ,
							className : className
							//classify:classify
						});
						var content = '<iframe id="importFrame" name="importFrame" width="700" height="600" frameborder="0" scrolling="no" allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					} else {--
						
						var url = shr.assembleURL('hr.ats.com.atttendanceCommonImport$page', 'view');
						shr.loadHTML({
							url: url,
							success: function(response) {
								importDiv.append(response);
							}
						});
				//	}
					document.documentElement.style.overflow='hidden';
				},
				close: function(event, ui) {
					document.documentElement.style.overflow='scroll';
					importDiv.empty();
				//	$(_self.gridId).jqGrid("reloadGrid");
				} 
			});
		}
		
		$(".ui-dialog-titlebar-close").bind("click" , function(){
			importDiv.dialog("close");
		});		
	},*/
	importAction: function(){
		var self = this;
		var hrOrgUnitId = shr.getFieldValue("hrOrgUnit");
		var uipk = shr.getUrlRequestParam("uipk");
		var serviceId = shr.getUrlRequestParam("serviceId");
		btnName = 'import';
		var callback = function(data){
			if(data && data.length>0){
				var $editGrid = $("#entries");
				for(var i=0;i<data.length;i++){
					entry = data[i];
					$editGrid.jqGrid("addRowData", _self.findNextId($editGrid), entry, "last");
				}
			}
		}
		shr.doImportExcel({ btnName: btnName, uipk: uipk, serviceId: serviceId, customParam: {billId:shr.getUrlRequestParam('billId'),hrOrgUnitId:hrOrgUnitId}}, callback);
	},
	
	/**
	 * 生成新的rowId
	 */
	findNextId : function() {
        var self = this;
		var maxId = 0;
        $("#entries").find("tr").each(function () {
            var id = $(this).attr("id");
            try {
                id = parseInt(id);//@
                if (id > maxId) {
                    maxId = id;
                }
            } catch (e) {
            }
        });
        maxId = parseInt(maxId) + 1;//@
        return maxId;
    }
	,

	getEntrysGrid : function(){
		return $("#entries");
	}
	,checkUpload :function(){
		return true;
	},
	
	
	/**
	 *  导入前执行
	 *  可重写
	 */
	beforeUpload : function(){
		
	},
	
	/**
	 *  成功导入数据后执行
	 *  可重写
	 */
	afterUploadSuccess : function(){
		
	},
	
	/**
	 *  导入数据失败后执行
	 *  可重写
	 */
	afterUploadFail : function(){
		
	}
});
