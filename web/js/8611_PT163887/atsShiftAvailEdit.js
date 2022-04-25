shr.defineClass("shr.ats.atsShiftAvailEdit", shr.ats.AtsAvailableBasicItemEdit, {
	
	initalizeDOM:function(){
		shr.ats.atsShiftAvailEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		
		if(that.getOperateState()=="VIEW"){
			if($("#isElastic").val()==0){
				$("#elasticType").parent().parent().hide();
			}
			
		}
		}

});