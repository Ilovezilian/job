
shr.defineClass("shr.ats.basicAttendce", shr.base.SHRBasicItem, {
	 
	initalizeDOM : function () {
		shr.ats.basicAttendce.superClass.initalizeDOM.call(this);
		//alert(billId)
	},openBasicItemAction: function(billId) {
		if(!billId)
			return;
		sessionStorage.setItem("billIds",billId);
		// 保存页面状态
		this.savePageState();
		
		
		var _self = this;
      	shr.callService({
      		serviceName: 'getValueByUuid', 
    		param: {
    			id : billId,
    			selector: 'entityName'
    		},
    		async: true,
    		success: function(data) {
    			var entityName = data.entityName;
			    var uipk=entityName+".list";
	    		_self.reloadPage({ uipk: uipk });
    		}
    	}); 
	}
});

		

