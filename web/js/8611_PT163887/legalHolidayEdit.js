shr.defineClass("shr.ats.legalHolidayEdit", shr.ats.atttenceEditFormImports, {
//shr.defineClass("shr.ats.legalHolidayEdit", shr.framework.Edit, {
	 
	initalizeDOM:function(){
		shr.ats.legalHolidayEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		that.initalize();
		//设置系统预设数据编号和名称不能编辑
		//that.setFiledIsEnable();
		var classfullNameService = "com.kingdee.shr.ats.web.formEditImport.LegalHolidayFileEditFormService";
		$('<button type="button" style="margin-left:4px;margin-right:4px" class="shrshrbtn-primary shrbtn" id="import">'
			+ jsBizMultLan.atsManager_legalHolidayEdit_i18n_1
			+ '</button>').insertAfter($("#addRow_items"));
		$('#import').click(function(){
			that.importAction(null,classfullNameService);
		})
		if(that.getOperateState() != 'VIEW'){
			$('#isSysPreset').shrCheckbox('disable');
		}
	} 
	
	,distributeAction :function(){
	    legalHolidayEditObject = shr.createObject(shr.ats.AtsMaintainBasicItemEdit);
		legalHolidayEditObject.operateState =this.getOperateState() ;
		legalHolidayEditObject.billId = this.billId ;
		legalHolidayEditObject.distributeAction();
	}
	,viewDistributionAction : function(){
	    legalHolidayEditObject = shr.createObject(shr.ats.AtsMaintainBasicItemEdit);
		legalHolidayEditObject.operateState =this.getOperateState() ;
		legalHolidayEditObject.billId = this.billId ;
		legalHolidayEditObject.viewDistributionAction();
	    
	}
	,reviseLogAction:function(){
	    legalHolidayEditObject = shr.createObject(shr.ats.AtsMaintainBasicItemEdit);
		legalHolidayEditObject.operateState =this.getOperateState() ;
		legalHolidayEditObject.billId = this.billId ;
		legalHolidayEditObject.reviseLogAction();
	}
	
	/**
	 * 覆盖保存方法  校验名称和ID是否重复
	 */
	,saveAction:function(event){
	 var that = this ;
	 var name = $("#name").val();
     var billId  = $("#id").val();
	 var number  = atsMlUtile.getFieldOriginalValue("number");
	 workArea = that.getWorkarea(),
		$form = $('form', workArea);
		  if ($form.valid() && that.verify()) {
         	that.remoteCall({
				type:"post",
				method:"checkNameAndIdIsExist",
				param:{name: name,billId:billId,number:number},
				success:function(res){		
				if(res.checkNameIsExist=="exist"){
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_legalHolidayEdit_i18n_3, [name])});
				}else if(res.checkIdIsExist=="exist"){			
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_legalHolidayEdit_i18n_0, [number])});
				}else{
					that.doSave(event, 'save');		
				}					
				}
			});
		 }
	}
	,initalize : function(){
	
		var that = this ;
		if(that.getOperateState() == 'ADDNEW'){
			$('#otherInfo').hide();
		}
	}
	,backAction:function(){
		var model = jsBinder.view_model;
		var currentUipk = jsBinder.uipk;
		if(currentUipk == model+".form"){
			toUipk = model+'.list';
		}else{
			toUipk = model+'.AvailableList';
		}
		
	 	this.reloadPage({
			uipk: toUipk
		});
	}
	,
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
				title: jsBizMultLan.atsManager_legalHolidayEdit_i18n_2,
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
					} else {*/
						
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
	}	
	
});
