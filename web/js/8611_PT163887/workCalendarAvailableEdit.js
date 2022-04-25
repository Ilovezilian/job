shr.defineClass("shr.ats.WorkCalendarAvailableEdit", shr.ats.AtsAvailableBasicItemEdit, {
	year:null,
	month:null,
	_events: [],
	beginDate: null,
	endDate: null,
	initalizeDOM:function(){
		shr.ats.WorkCalendarAvailableEdit.superClass.initalizeDOM.call(this);
		var that = this ;	
		if (that.getOperateState() != 'VIEW') {
			$("#workCalendarAppend").hide();
			$("#viewWorkCalendar_div").hide(); 
			 $("#workCalendarReset").hide();	
		}else{
		   var workCalObject = shr.createObject(shr.ats.WorkCalendarEdit);
			workCalObject.viewWorkCalendarAction();
			workCalObject.initCalandar();
		}	

	}
});