shr.defineClass("shr.ats.AttendanceCycleAvailableEdit", shr.ats.AtsAvailableBasicItemEdit, {
	initalizeDOM:function(){
		shr.ats.AttendanceCycleAvailableEdit.superClass.initalizeDOM.call(this);
		var attendanceCycleObject = shr.createObject(shr.ats.AttendanceCycleEdit);
			attendanceCycleObject.initDeal();
			shr.setIframeHeight();
			//禁用开始周期控件编辑状态
			$('#startCycle-year').shrSelect('disable');
         	$('#startCycle-month').shrSelect('disable');
	}
});



