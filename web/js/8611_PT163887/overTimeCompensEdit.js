var isSysFlag = false;
var isDefaultFlag = false;
shr.defineClass("shr.ats.OverTimeCompensEdit", shr.ats.AtsMaintainBasicItemEdit, {
     
	 initalizeDOM:function(){
			shr.ats.OverTimeCompensEdit.superClass.initalizeDOM.call(this);
			var that = this ;
			that.checkedDisabled();
			that.sysPresetDisabled();
			isDefaultFlag = $('#isDefault').attr("checked") == 'checked';
	 } 
	 /**
	 * 编辑
	 */
/* 	,editAction: function() {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('#form', workArea);
		var isSysPreset=parseInt( $('#isSysPreset',$form).val());
		if(isSysPreset!=0){
		 	shr.showWarning({
			  message: "预置数据不能编辑!"
		    });
			return ; 
		}
		this.doEdit('edit');
	} */
	
	/**
	 * 重写禁用方法
	 * 为默认时不能禁用
	 */
	,disableAction:function(){
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('#form', workArea);
		var isDefault=parseInt( $('#isDefault',$form).val());
		if(isDefault==1){
		 	shr.showWarning({
			  message: jsBizMultLan.atsManager_overTimeCompensEdit_i18n_1
		    });
			return ; 
		}
		this.doEnable('disable');
	}
	//预置数据只能编辑【是否默认】字段
	,sysPresetDisabled: function () {
		var that =this;
		var disabledFlag = $('#isSysPreset').val();
		if ( disabledFlag==1){
			if(that.getOperateState() == 'ADDNEW'){
			}else{
				$('input[id="number"]').attr("disabled","disabled");
				$('input[id="name"]').attr("disabled","disabled");
				$('input[id="description"]').attr("disabled","disabled");
				$('input[id="state"]').shrSelect("disable");
				$('input[id="isSysPreset"]').attr("disabled","disabled");
				isSysFlag = true;
				
			}
			
		}
		
	}
	//默认的补偿方式不能取消
	,checkedDisabled: function () {
		if($('#isDefault').attr("checked") == true || $('#isDefault').attr("checked") == 'checked'){
			$('input[id="isDefault"]').attr("disabled","disabled");
		}
	}
	
	/**
	 * 重写保存方法
	 * 保存前校验：
	 * 1、禁用的补偿方式不能设置为默认
	 * 2、如果当前的补偿方式不是默认补偿方式会提示已存在的默认补偿方式
	 */
	,saveAction: function(event) {
		var _self = this;
		
		if (_self.validate() && _self.verify() ) {
			
			if ($('#isDefault').attr("checked") == 'checked' && !isDefaultFlag){
				if ($('#state_el').val()=="2"){
					shr.showWarning({message:jsBizMultLan.atsManager_overTimeCompensEdit_i18n_0,hideAfter:5});
					return false;
				}
				_self.isDefaultChecked();
			} else {
				_self.doSave(event, 'save');
			}
		}
	}
	
	,isDefaultChecked: function(event) {
		var _self = this;
		_self.remoteCall({
			type:"post",
			method:"currentDefaultChecked",
			async: false,
			param:{
				name:$('input[id="name"]').val()
			},
			success:function(res){
				var info =  res;
				shr.showConfirm(shr.formatMsg(jsBizMultLan.atsManager_overTimeCompensEdit_i18n_2,[info.defaultName]), function() {
					_self.doSave(event, 'save');
				});
			}
			});
		return true;
	}
	
});	  