shr.defineClass("shr.ats.CalendarTemplEdit", shr.ats.AtsMaintainBasicItemEdit, {
	//var editName = "";
	initalizeDOM:function(){
		shr.ats.CalendarTemplEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		//设置系统预设数据编号和名称不能编辑
		//that.setFiledIsEnable();
		//检查名称是否重复
		//that.checkNameIsExist();
		/**var nameVal = $("#name").val();
		if(that.getOperateState() == 'EDIT'){
		editName = $("#name").val();
		}*/
		
	}
 
   
	/**
	 * 覆盖保存方法  校验名称和ID是否重复
	 */
	,saveAction:function(event){
	 var that = this ;
	 var name = $("#name").val();
     var billId  = $("#id").val();
	 var number  = atsMlUtile.getFieldOriginalValue("number");
	 var flag = true;
	 workArea = that.getWorkarea();
	 $("#items").find("tr").each(function(index, element){
	 	if(index > 0){
		 	$(this).find("td").each(function(index, element){
		 		if(index == 3){
		 			if($(element).html() == '')
		 			flag = false;
		 		}
		 	}
		 	)
	 	}
	 });
	 if(flag == false){
	 	shr.showWarning({message: jsBizMultLan.atsManager_calendarTemplEdit_i18n_3});
	 }else{
		$form = $('form', workArea);
		  if ($form.valid() && that.verify()) {
         	that.remoteCall({
				type:"post",
				method:"checkNameAndIdIsExist",
				param:{name: name,billId:billId,number:number},
				success:function(res){		
				if(res.checkNameIsExist=="exist"){
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_calendarTemplEdit_i18n_2,[name])});
				}else if(res.checkIdIsExist=="exist"){			
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_calendarTemplEdit_i18n_0,[number])});
				}else{
					that.doSave(event, 'save');		
				}					
				
				}
			});
		 }
	 }
	},
	
	/*
	 * 控制增加行
	 */
	addRowAction: function(event) {
		var $editGrid = this.getEditGrid(event.currentTarget);
		var rowNum = $editGrid.getGridParam("reccount");
		if(rowNum >= 14){
			shr.showWarning({message: jsBizMultLan.atsManager_calendarTemplEdit_i18n_1});
			return;
		}
		
		shr.ats.CalendarTemplEdit.superClass.addRowAction.call(this, event);
	}

});
