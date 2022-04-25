
shr.defineClass("shr.ats.atsPersonBURelationBatchAdd", shr.base.bizmanage.PersonBURelationBatchAdd, {
	
	category:"ATS",
	buBrowseUipk : "com.kingdee.shr.base.bizmanage.app.PersonBUBrowse.list.Ats$page",
	
	initalizeDOM:function(){
	    shr.ats.atsPersonBURelationBatchAdd.superClass.initalizeDOM.call(this);
		var _self = this ;
	},
	extendParam : function(){
	     return {number:"ATS02"} ;
	},
	
	//生成预览时加校验
	valid : function(){
		var effectDate = $("#EFFDT").shrDateTimePicker('getValue');
		if(!effectDate){
			shr.showWarning({message: jsBizMultLan.atsManager_atsPersonBURelationBatchAdd_i18n_0, hideAfter: 3});
			return false ;
		}
		return true;
	},
	// 保存、接收保存跳转uipk 
	reloadUipk : function(){
	    
	    return "com.kingdee.shr.base.bizmanage.app.AtsPersonBURelationView";
	}
});