shr.defineClass("shr.ats.holidayPolicy4SetAvailableView", shr.ats.HolidayPolicy4Set, {
      initalizeDOM:function(){
		shr.ats.holidayPolicy4SetAvailableView.superClass.initalizeDOM.call(this);
		$(".entry-button-top").remove();//假期制度分录上的新增、编辑、删除按钮都要去掉
	  },
	 editMainAction: function() {
	 	var  options = {};
	 	options.method='edit';
	 	options.uipk= 'com.kingdee.eas.hr.ats.app.HolidayPolicySet.AvailableEditform';
	 	options.billId=$('#form #id').val();
		options.orgrefId=$('#orgrefId').val();
	 	this.reloadPage(options);		
				
	}
	
});
