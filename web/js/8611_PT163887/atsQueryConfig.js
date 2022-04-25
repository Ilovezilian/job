shr.defineClass("shr.ats.atsQueryConfig", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.atsQueryConfig.superClass.initalizeDOM.call(this);
		var schemeId = "hj9uiCTpQK6B0kNy3ARZ8podxk8=";
		if($("#number").val().indexOf("emp") >= 0 ){//@
			schemeId = "KKHjvva+SkGWNHBA3r31N5odxk8=";
		}
    	$('#structure').shrPromptBox("setFilter", "scheme.id='"+schemeId+"'");
    	$('#parent').shrPromptBox("setFilter", "structure.scheme.id='"+schemeId+"'");
		$("#fields").getColumnConfig("factField").editoptions.f7Json.subWidgetOptions.filter = "structureConfig.scheme.id = '"+schemeId+"'";
	},
	addRowAction : function(event){
		shr.ats.atsQueryConfig.superClass.addRowAction.call(this, event);
		var factFieldID = this.getRealId('factField');
		var aliasID = this.getRealId('alias');
		$("#" + factFieldID).shrPromptBox("option", {
			onchange : function(e, value){
				$('#' + aliasID).val(value.current.name);
			}
		});
	}
});
