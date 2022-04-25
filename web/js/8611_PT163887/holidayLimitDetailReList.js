shr.defineClass("shr.ats.holidayLimitDetailReList",  shr.framework.List, {
	 pageStep: 0,
	initalizeDOM : function () {
		shr.ats.holidayLimitDetailReList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initTabPages();
	},initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
		
		$('#outHolidayLimitList').click(function(){  
			that.pageStep = 0;
			//定义标签样式
			that.changePageLabelColor();
			console.log(that.reloadPage);
			that.reloadPage({
			  uipk: 'com.kingdee.eas.hr.ats.app.HolidayLimitDetailRe.list'
			});	
		});
		
	    $('#inHolidayLimitList').click(function(){ 
			that.pageStep = 1;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayLimitDetailLeave.list'
		    });	
		});
	}
    ,
	
   changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.pageStep).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.pageStep).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
	},reTotalAction: function(){
	 	var that = this;
		var billId = $("#grid").jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0) {
	        //shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitList_i18n_33});
			return ;
	    }
	    var bills;
		if (billId.length > 0) {
			for (var i = 0;i<billId.length; i++) {
				if(bills){
					bills = bills+','+billId[i];
				}else{
					bills = billId[i];
				}
			}
		}
		shr.showConfirm(jsBizMultLan.atsManager_holidayLimitDetailReList_i18n_5, function(){
	    that.remoteCall({
				type:"post",
				method:"updateHolidayLimit",
				param:{billId: bills},
				async: false,
				success:function(res){
					that.reloadGrid(); 
					shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitDetailReList_i18n_6,hideAfter:5});
				}
		});
		});
	},setGridCustomParam: function() {
		var params = $.extend(this.initData.custom_params, this.getGridCustomParam());
			this.atsCalTriger();
		
			var fastFilterItems = this.getFastFilterItems();
			if(fastFilterItems && fastFilterItems['entries.beginTime_entries.endTime'] && fastFilterItems['entries.beginTime_entries.endTime'].values){
				params["cycleBeginDate"] = this.getFastFilterItems()['entries.beginTime_entries.endTime'].values["startDate"];
				params["cycleEndDate"] = this.getFastFilterItems()['entries.beginTime_entries.endTime'].values["endDate"];
			} 
		
		
		$(this.gridId).setGridParam({
			custom_params: shr.toJSON(params)
		});	
	},atsCalTriger: function() {
		if (typeof(atsCalGobalParam)!="undefined")
		{
		    atsCalFlag=true;
		}
	}
});