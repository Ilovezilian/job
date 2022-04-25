shr.defineClass("shr.ats.AtsCloudHubSignServiceConfigEdit", shr.framework.Edit, {

	initalizeDOM:function(){
		shr.ats.AtsCloudHubSignServiceConfigEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		$("#enable").hide();
		$("#disable").hide();
		$("input#state").shrSelect("disable");
	}

});