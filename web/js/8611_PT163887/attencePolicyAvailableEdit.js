shr.defineClass("shr.ats.attencePolicyAvailableEdit", shr.ats.AtsAvailableBasicItemEdit, {
	
	initalizeDOM:function(){
		shr.ats.attencePolicyAvailableEdit.superClass.initalizeDOM.call(this);
		
		var that = this ;
		AttencePolicyEditObject = shr.createObject(shr.ats.AttencePolicyEdit);
		AttencePolicyEditObject.operateState = this.getOperateState() ;
		AttencePolicyEditObject.initalizeAtsDom();  
	}
	,saveAction: function(event) {
		var _self = this;
		_self.doSave(event, 'save');
		
/* 		if (_self.validate() && _self.verify()) {			
			_self.doSave(event, 'save');
		}else{
			if(_self != top){// in iframe
				shr.setIframeHeight(window.name);
			} 
				
		} */	
	},
	
});