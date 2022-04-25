shr.defineClass("shr.ats.AtsImportPlanEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.AtsImportPlanEdit.superClass.initalizeDOM.call(this);
		var that = this ;
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
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_atsImportPlanEdit_i18n_1, [name])});					
				}else if(res.checkIdIsExist=="exist"){			
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_atsImportPlanEdit_i18n_0, [number])});
				}else{
					that.doSave(event, 'save');		
				}					
				
				}
			});
		 }
	}
	
});



