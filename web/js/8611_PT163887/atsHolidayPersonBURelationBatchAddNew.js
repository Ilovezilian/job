//批量设置uipk
shr.defineClass("shr.ats.atsHolidayPersonBURelationBatchAddNew", shr.base.bizmanage.PersonBURelationBatchAddNew, {
	
	category:"ATS",
	//预览列表 uipk
	buBrowseUipk : "com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.AtsHoliday$page",
	
	initalizeDOM:function(){
	    shr.ats.atsHolidayPersonBURelationBatchAddNew.superClass.initalizeDOM.call(this);
		var _self = this ;
	},
	extendParam : function(){
	     return {number:"ATS01"} ;
	},
	
	//生成预览时加校验
	valid : function(){
		var effectDate = $("#EFFDT").shrDateTimePicker('getValue');
		if(!effectDate){
			shr.showWarning({message: jsBizMultLan.atsManager_atsHolidayPersonBURelationBatchAddNew_1585648005154_i18n_0, hideAfter: 3});
			return false ;
		}
		return true;
	},
	// 保存、接收保存跳转uipk 
	reloadUipk : function(){
	    return "com.kingdee.shr.base.bizmanage.app.AtsHolidayPersonBURelation";
	}
});