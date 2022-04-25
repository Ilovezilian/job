shr.defineClass("shr.ats.CardRuleAvailableEdit", shr.ats.AtsAvailableBasicItemEdit, {
	cardRuleEditObject:null,
	initalizeDOM:function(){
		shr.ats.CardRuleAvailableEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		cardRuleEditObject = shr.createObject(shr.ats.CardRuleEdit);
		cardRuleEditObject.operateState =this.getOperateState() ;
		cardRuleEditObject.initalizeCardRuleEdit();  
	}
	//下班展开
	,offWorkSecondExplorBtnAction:function(){
		cardRuleEditObject.offWorkSecondExplorBtnAction();
	}
	//下班收起
	,offWorkSecondPackUpBtnAction:function(){
		cardRuleEditObject.offWorkSecondPackUpBtnAction();
	}
	//上班展开
	,onWorkSecondExplorBtnAction:function(){
		cardRuleEditObject.onWorkSecondExplorBtnAction();
	}
	//上班收起
	,onWorkSecondPackUpBtnAction:function(){
		cardRuleEditObject.onWorkSecondPackUpBtnAction();
	}
	
	
});