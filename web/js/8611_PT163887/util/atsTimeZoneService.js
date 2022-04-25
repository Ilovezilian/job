var atsTimeZoneService = {

	initTimeZoneForList:function(timeZoneCol,grid){
		if(this.showTimeZone()){
			return;
		}
		var grid = $(grid || "#grid");
		grid.setGridParam().hideCol(timeZoneCol);
		grid.jqGrid("resizeGrid");
	}
	
	,initTimeZoneForEdit:function(timeZoneField){
		if(typeof(timeZoneField) == 'string'){
			timeZoneField =  timeZoneField.replace(/\./g,'_');
			timeZoneField = $(timeZoneField).length == 0 ? "#" + timeZoneField : timeZoneField;
			timeZoneField = $(timeZoneField).length == 0 ? "." + timeZoneField : timeZoneField;
		}
		!this.showTimeZone() && $(timeZoneField).parents("[data-ctrlrole=labelContainer]").hide();
		$('input' + timeZoneField).shrPromptBox('option',{
			onchange:function(e,changeObj){
				if(changeObj && changeObj.current && !changeObj.current.id){
					setTimeout(function(){
						$('input' + timeZoneField).shrPromptBox('setValue',_jsBizMultiLan_.utcData.utcUser || {id: 'p4AAAABMQ3tAmlvk',name:'__'});
					});
				}
			}
		})
		$('input' + timeZoneField).shrPromptBox('setValue',_jsBizMultiLan_.utcData.utcUser || {id: 'p4AAAABMQ3tAmlvk',name:'__'});
	}
	
	,showTimeZone:function(){
		var showEle = $("#isSysEnableMlTimeZone");
		return !showEle.length || showEle.val() == "true" && showEle.data("hidden") !== true;
	}
	
}