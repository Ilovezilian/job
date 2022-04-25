shr.defineClass("shr.ats.LegalHolidayList", shr.ats.AtsMaintainBasicItemList, {
	 
	initalizeDOM : function () {
		shr.ats.LegalHolidayList.superClass.initalizeDOM.call(this);
		//var that = this;
	}
 	,copyAction: function(){
		var $grid = $('#grid').jqGrid("getSelectedRows") ;
		var len = $grid.length ;
		if(len>0)
		{
			if(len ==1){
				var item = $grid ;
				this.reloadPage({
					uipk: this.getEditUIPK(),
					itemId :item,
					method: 'addNew'
				});
			}else{
				shr.showWarning({message: jsBizMultLan.atsManager_legalHolidayList_i18n_1});
				return ;
			}
		}else{
			shr.showWarning({message: jsBizMultLan.atsManager_legalHolidayList_i18n_0});
			return ;
		}
 	}
});