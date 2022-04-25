shr.defineClass("shr.ats.HolidayTypeEdit", shr.ats.AtsMaintainBasicItemEdit, {
      
      initalizeDOM:function(){
			shr.ats.HolidayTypeEdit.superClass.initalizeDOM.call(this);
			var that = this ;
			that.setNumberFieldEnable();
			if(window.contextLanguage == 'en_US'){
				$("#hrOrgUnit").closest('div[data-ctrlrole="labelContainer"]').children().find('.field-desc').css('display','block');
			}
	  }
	  
	  ,setNumberFieldEnable : function() {
			var that = this ;
			if (that.getOperateState().toUpperCase() == 'EDIT' ||　that.getOperateState().toUpperCase() == 'ADDNEW') {
				var holidayTypeNumberFieldCanEdit = that.initData.holidayTypeNumberFieldCanEdit;
				if (typeof holidayTypeNumberFieldCanEdit != 'undefined' && !holidayTypeNumberFieldCanEdit) {
					that.getField('number').shrTextField('option', 'readonly', true);
				}
			}
	  }
	  
	/**
	 * 删除行
	 */
	,deleteRowAction: function(event) {
		var $editGrid = this.getEditGrid(event.currentTarget);
		var id = $editGrid.jqGrid('getSelectedRow');
		//增加启用的假期类型不能删除判断
		that.remoteCall({
			type:"post",
			method:"isCanDelete",
			param:{id:id},
			success:function(res){
				if (res == 1) {
					 shr.showInfo({message: jsBizMultLan.atsManager_holidayTypeEdit_i18n_0});
		  			 return false;
				}else{
					if (id) {
						$editGrid.jqGrid('delRow', id);
					}
				}
			}
		});
	},
	  
	/**
	 * 描述:启用-1
	 * @action 
	 *//*
	enableAction:function(){
		var that = this;
		var id = $("#id").val();
		that.remoteCall({
			type:"post", 
			method:"enableState",
			param:{id:id,state1:1},
			success:function(res){
				that.reloadPage({
					method: 'view'
				});
			}
		});
	},
	*/
	/**
	 * 描述:禁用-2
	 * @action 
	 */
	disableAction:function(){
		var that = this;
		var id = $("#id").val();
		that.remoteCall({
			type:"post",
			method:"enableState",
			param:{id:id,state1:2},
			success:function(res){
				that.reloadPage({
					method: 'view'
				});
			}
		});
	},
	
	
	 /**
	 *重载 保存
	 */
	 saveAction: function(event) {
		var _self = this;
		
		if (_self.validate() && _self.verify()) {	//界面校验通过	
			//服务端校验
			 workArea = _self.getWorkarea(),
			 $form = $('#form', workArea);
			 _self.doSave(event, 'save');
		}	
	  }
	 ,/**
	 * 编辑
	 */
	editAction: function() {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('#form', workArea);
		var isSysPreset = parseInt( $('#isSysPreset',$form).val());
		var fid = $('#id',$form).val();
		/*if(isSysPreset!=0){
			if(fid != "Fmvdo5IKS6GcvMmbKW0oZclQZlY="){
				shr.showWarning({
				  message: "预置数据不能编辑!"
			    });
				return ;
			}
		}*/
		this.doEdit('edit');
	}
});	  