shr.defineClass("shr.ats.AtsShiftTypeEdit", shr.ats.AtsMaintainBasicItemEdit, {
      
	 initalizeDOM:function(){
			shr.ats.AtsShiftTypeEdit.superClass.initalizeDOM.call(this);
			var that = this ;
	 } 
	 ,/**
	 * 编辑
	 */
	editAction: function() {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('#form', workArea);
		var isSysPreset=parseInt( $('#isSysPreset',$form).val());
/* 		if(isSysPreset!=0){
			shr.showWarning({
			  message: "预置数据不能编辑!"
		    });
			return ;
		} */
		this.doEdit('edit');
	}

});	  