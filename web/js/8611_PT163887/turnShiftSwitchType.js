shr.defineClass("shr.ats.turnShiftSwitchType", shr.ats.turnInitBreadCrumb, {
	initalizeDOM:function(){
		shr.ats.turnShiftSwitchType.superClass.initalizeDOM.call(this);
		$('input[name^=shiftType]').shrRadio();
		$('input[name^=shiftType]').parent().each(function(i,temp){
			$(temp).css('background-color','#DBDBDB');
		})
		var noShiftFlag = shr.getUrlRequestParam("noShift");
		if("1" == noShiftFlag){//请假确认请假确认请假确认请假确认请假确认请假确认请假确认请假确认请假确认。
		   jsBinder.naviToStep(4);
		}
	},
	onNext:function(_wizard){
		var switchType = '2';
		if($('#shiftType3').shrRadio('isSelected')){
			switchType = '3';
		}
		_wizard.setParm("switchType", switchType);
	    return {status: 1};
	},
	
	onNaviLoad:function(_navi){
		var switchType = _navi.getParm("switchType");
		$('#shiftType' + switchType).shrRadio('check');
	}
});
