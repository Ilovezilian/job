shr.defineClass("shr.ats.holidayPolicySetAvailableEdit", shr.ats.AtsAvailableBasicItemEdit, {
      initalizeDOM:function(){
		shr.ats.holidayPolicySetAvailableEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		
//	    atsHolidayPolicySetEdit = shr.createObject(shr.ats.HolidayPolicySetEdit);
//    	atsHolidayPolicySetEdit.operateState =this.getOperateState() ;
//		atsHolidayPolicySetEdit.initAtsDOM();
		$('#microToolbar').parent().next().remove();
			     //如果是非启用半天假为否 不显示 上午下午上下班时间
	     
	     if(!$('#isHalfDayOff').shrCheckbox("isSelected")){
	     $('#amStartWorkTime').closest(".row-fluid").eq(0).attr('style','display:none');
		 $('#pmStartWorkTime').closest(".row-fluid").eq(0).attr('style','display:none'); 
	     }else{
	     $('#amStartWorkTime').closest(".row-fluid").eq(0).attr('style','display:block');
		 $('#pmStartWorkTime').closest(".row-fluid").eq(0).attr('style','display:block'); 
		}
		
	 },
	 saveAction: function(event) {
		var _self = this;
		_self.doSave(event, 'save');
		
/* 		if (_self.validate() && _self.verify()) {			
			_self.doSave(event, 'save');
		}else{
			if(_self != top){// in iframe
				shr.setIframeHeight(window.name);
			} 
				
		} */	
	},
	viewAction: function(billId) {
		var billId = $('#id').val();
		var orgrefId = $('#orgrefId').val();		
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayPolicySet.AvailableForm',
			billId: billId,
			orgrefId:orgrefId ,
			relatedFieldId: billId,
			method: 'initalizeData'
		});			
		
	}
});