shr.defineClass("shr.ats.AttendanceFileDisPersonViewList", shr.framework.List,{
	pageStep: 1,
	initalizeDOM : function() {
		shr.ats.AttendanceFileDisPersonViewList.superClass.initalizeDOM
				.call(this);
		var that = this;
		that.initTabPages();
		that.setNavigate();
		$("#addNew").attr("title", jsBizMultLan.atsManager_attendanceFileDisPersonViewList_i18n_2);
		$("#addAll").attr("title", jsBizMultLan.atsManager_attendanceFileDisPersonViewList_i18n_2);
		that.getPersonChangeTabNum();
	},
	
	addNewAction : function(event) {
		var that = this ;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_attendanceFileDisPersonViewList_i18n_1});
			return;
		}
		
		var personNums = [];
		for (var i = 0; i < billIds.length; i++) {
			personNums.push($("#grid").jqGrid("getCell",billIds[i], "person.number"));
		}
		
		that.remoteCall({
						type:"post",
						method:"saveSelectParams",
						param:{personNums:personNums.join()},
						aynsc :true ,
						success:function(res){
							
						//	if(res.flag){
							that.reloadPage({uipk : 'com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonSaveAll.list'});
						//	}
						//	else{
						//		shr.showWarning({ message: res.msg});
						//	}
						}
		});	

		
	},
	
	cancelAllAction : function() {
		this.reloadPage({uipk : 'com.kingdee.eas.hr.ats.app.AttendanceFile.list'});
	},
	
	viewAction : function() {
		// 覆盖父类 不做处理
	},
	
	addAllAction : function() {
		var that = this ;
		that.remoteCall({
						type:"post",
						method:"saveSelectParams",
						param:{personNums:""},
						aynsc :true ,
						success:function(res){
							that.reloadPage({uipk : 'com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonSaveAll.list'});
						}
		});	
	},
	initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
	    $('#attendanceFileList').click(function(){ 
			that.pageStep = 0;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFile.list'
		    });	
		});
		$('#disAttendanceFileList').click(function(){  
			that.pageStep = 1;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			//uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonView.list'
			  uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonViewV2.list'
		    });	
		});
		$('#positionChangeList').click(function(){ 
			that.pageStep = 2;
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileCheck',
			pageStep: 2
		    });	
		});
		$('#orgChangeList').click(function(){  
			that.pageStep = 3;
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileCheck',
			pageStep: 3
		    });	
		});
		$('#lackAttendanceFileInfoList').click(function(){  
		    that.pageStep = 4;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.LackAttendanceFileInfoList',
			pageStep: 4
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
	setNavigate:function(){
		var naviagateLength = $("#breadcrumb li").length;
		for(var i=naviagateLength-2;i>0;i--){
			$("#breadcrumb li").eq(i).remove();
		}
		$("#breadcrumb li").eq($("#breadcrumb li").length-1).html(jsBizMultLan.atsManager_attendanceFileDisPersonViewList_i18n_0);
	}
	,getPersonChangeTabNum : function(){
		 var _self = this;
		 var serviceId = shr.getUrlRequestParam("serviceId");
		 var uipk = "com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.list";
		 var url = shr.getContextPath() + "/dynamic.do?uipk="+uipk+"&method=getPersonChangeTabNum";
		 url += '&serviceId='+encodeURIComponent(serviceId);
		 shr.ajax({
				type:"post",
				async:true,
				data:{longNumber:$("#treeNavigation").shrGridNavigation('getValue').longNumber},
				url:url,
				success:function(res){
					$("#disAttendanceFileList").html($("#disAttendanceFileList").html()+"("+res.tab1Num+")");
			    }
		 });
	}
	//在某些环境中，不加过滤字段查不出数据，所以预置一个默认通用的过滤 
	,getCustomFilterItems: function() {
		return " confirmState= 0 ";
	}
});