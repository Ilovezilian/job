shr.defineClass("shr.ats.AtsAvailableBasicItemEdit", shr.shrBaseData.available.AvailableEdit, {
	initalizeDOM : function () {
		shr.ats.AtsAvailableBasicItemEdit.superClass.initalizeDOM.call(this);
		this.initalize();
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
		if(currentUipk == model+".AvailableForm"){
			toUipk = model+'.AvailableList';
		}else{
			toUipk = model+'.list';
		}
		
	 	this.reloadPage({
			uipk: toUipk
		});
	}

});