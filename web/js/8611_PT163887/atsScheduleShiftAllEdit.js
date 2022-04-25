
shr.defineClass("shr.ats.AtsScheduleShiftAllEdit", shr.framework.Edit, {

	initalizeDOM:function(){
		shr.ats.AtsScheduleShiftAllEdit.superClass.initalizeDOM.call(this);
		var that = this ;
	}
	,cancelAllAction:function(){
		jsBinder.goNextPage();
	}

});
