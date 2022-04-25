

shr.defineClass("shr.ats.AttendanceFileHisList", shr.framework.List, {

	initalizeDOM : function () {
		shr.ats.AttendanceFileHisList.superClass.initalizeDOM.call(this);
		var that = this;
	},
	
	viewAction: function(billId) {
	},
	
	closeAction: function() {
		history.back();
	}
	
});

