shr.defineClass("shr.ats.HolidayFileDisPersonViewList", shr.framework.List, {
    pageStep: 1,
	initalizeDOM : function () {
		shr.ats.HolidayFileDisPersonViewList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initTabPages();
		that.setNavigate();
		that.getPersonChangeTabNum();
	},
	cancelAllAction: function() {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayFile.list'
		});			
	},
	addNewAction : function (event) {
		var that = this ;
		var attendFileId = $("#grid").jqGrid("getSelectedRows");
		if (attendFileId == undefined || attendFileId.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_holidayFileDisPersonViewList_i18n_0});
			return;
		}
		var personNums = [];
		for (var i = 0; i < attendFileId.length; i++) {
			personNums.push($("#grid").jqGrid("getCell", attendFileId[i],"person.number")); //number
		}
	
		that.remoteCall({
						type:"post",
						method:"saveSelectParams",
						param:{personNums:personNums.join()},
						aynsc :true ,
						success:function(res){
							
							that.reloadPage({uipk : 'com.kingdee.eas.hr.ats.app.HolidayFileDisPersonSaveAll.list'});
						}
		});	
	}, 
	viewAction: function() {
		// 覆盖父类 不做处理
	},
	addAllAction: function() {
		var that = this ;
		that.remoteCall({
						type:"post",
						method:"saveSelectParams",
						param:{personNums:""},
						aynsc :true ,
						success:function(res){
							
							that.reloadPage({uipk : 'com.kingdee.eas.hr.ats.app.HolidayFileDisPersonSaveAll.list'});
						}
		});
								
	},
	initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
	    $('#holidayFileList').click(function(){ 
			that.pageStep = 0;
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayFile.list'
		    });	
		});
		$('#disHolidayFileList').click(function(){  
			that.pageStep = 1;
			that.changePageLabelColor();
			that.reloadPage({
			//uipk: 'com.kingdee.eas.hr.ats.app.HolidayFileDisPersonView.list'
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayFileDisPersonViewV2.list'
		    });	
		});
		
		$('#lackHolidayFileInfo').click(function(){  
			that.pageStep = 2;
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.LackHolidayFileInfoList'
		    });	
		});
	},
    changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.pageStep).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.pageStep).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
	},
	setNavigate: function(){
	    $("#breadcrumb li").eq(2).remove();
		$("#breadcrumb li span").eq(1).remove();
		$("#breadcrumb li").eq(1).addClass("active");
		var hrefName = $("#breadcrumb li a").eq(1).html();
		$("#breadcrumb li a").eq(1).remove();
		$("#breadcrumb li").eq(1).html(hrefName);
	}
	,getPersonChangeTabNum : function(){
		 var _self = this;
		 var serviceId = shr.getUrlRequestParam("serviceId");
		 var uipk = "com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirmHolidayFile.list";
		 var url = shr.getContextPath() + "/dynamic.do?uipk="+uipk+"&method=getPersonChangeTabNum";
		 url += '&serviceId='+encodeURIComponent(serviceId);
		 shr.ajax({
				type:"post",
				async:true,
				data:{longNumber:$("#treeNavigation").shrGridNavigation('getValue').longNumber},
				url:url,
				success:function(res){
					$("#disHolidayFileList").html($("#disHolidayFileList").html()+"("+res.tab1Num+")");
			    }
		 });
	}
});