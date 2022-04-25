shr.defineClass("shr.ats.AtsChangeShiftList", shr.framework.List, {
	
	initalizeDOM:function(){
		shr.ats.AtsChangeShiftList.superClass.initalizeDOM.call(this);
		var that = this;
		that.hiddeButton();
	},
	hiddeButton : function(){
	    $("#abortBill").hide();
	}
});



