shr.defineClass("shr.ats.CloudAttendPositionList", shr.framework.List, {
	initalizeDOM : function () {
		shr.ats.CloudAttendPositionList.superClass.initalizeDOM.call(this);
	}
	,synCloudAttendPositionAction: function() {
		var _self=this;
		
		_self.remoteCall({
			method: "getCloudAttendPosition", 
			success: function(data) {
				shr.showInfo({message: jsBizMultLan.atsManager_cloudAttendPositionList_i18n_0, hideAfter: 5});
				_self.reloadPage();
				//window.location.reload();
			}
		});
	}
	,viewAction: function(billId) {
	}
});