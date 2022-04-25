/**
 * 20140328假期档案与考勤档案使用同一张表/实体-考勤档案实体,故注意字段名
 * */

shr.defineClass("shr.ats.lackHolidayFileInfoList", shr.ats.lackHolidayFileInfoEdit, {
	pageStep: 2,
	initalizeDOM : function () {
		shr.ats.lackHolidayFileInfoList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initTabPages();
	},
	enableFileAction: function() {
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var bills ;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var state=$grid.jqGrid("getCell", selectedIds[i], "attendFileState");
				if(state==1){
					shr.showInfo({message: jsBizMultLan.atsManager_lackHolidayFileInfoList_i18n_0, hideAfter: 3});
					return;
				}
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
				
			}
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_lackHolidayFileInfoList_i18n_2, hideAfter: 3});
			return;
		}
		
		clz.remoteCall({method: "enableFile", param: {billId:bills}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_lackHolidayFileInfoList_i18n_1, hideAfter: 3});
			//clz.reloadPage();
			window.location.reload();
		}});
	},
	// 批量赋值
	addValsAction : function(){
		var _self = this;
		var pageUipk="com.kingdee.eas.hr.ats.app.LackHolidayFileInfoList";
		_self.addValsPublicAction(pageUipk);
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
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayFileDisPersonView.list'
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
	}
	
	/*,	
	*//**
	 * 获取查询字段
	*//*
	getSelector: function() {
		var column =[];
		column.push('id,proposer.number,proposer.name, attendanceNum, isAttendance,adminOrgUnit.id,');
		column.push('adminOrgUnit.displayName,position.id, holidayPolicySet.name,');
		column.push('position.name,proposer.employeeType.name,attendFileState');
		return column.join();
	}*/
});