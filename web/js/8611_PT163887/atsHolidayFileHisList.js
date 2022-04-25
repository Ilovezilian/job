

shr.defineClass("shr.ats.AtsHolidayFileHisList", shr.framework.List, {

	initalizeDOM : function () {
		shr.ats.AtsHolidayFileHisList.superClass.initalizeDOM.call(this);
		var that = this;
	},
	
	viewAction: function(billId) {
	},
	
	closeAction: function() {
		history.back();
	}
});

