shr.defineClass("shr.ats.atsTurnShiftAvailableEdit", shr.ats.AtsAvailableBasicItemEdit, {
      
      initalizeDOM:function(){
		shr.ats.atsTurnShiftAvailableEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		cardRuleEditObject = shr.createObject(shr.ats.AtsTurnShiftEdit);
		cardRuleEditObject.operateState = this.getOperateState() ;
		cardRuleEditObject.initEditGrid();  
		cardRuleEditObject.handleFSCEntry();
			
		if(this.getOperateState() == "EDIT")
		{
			 $("input[name^='dateType'][readonly='readonly']").shrSelect("disable");
			 $("input[name^='defaultShift_number']").attr('disabled','disabled');
			 $("input[name^='defaultShift'][ctrlrole='promptBox']").shrPromptBox('disable');
			 $("input[name^='workTime']").attr('disabled','disabled');
			 
			  $("input[name^='defaultShift_number']").css('background-color','#eeeeee');
			  $("input[name^='workTime']").css('background-color','#eeeeee');
			  
			 s$("A").hide() ;
		}	
	  }
	  
})