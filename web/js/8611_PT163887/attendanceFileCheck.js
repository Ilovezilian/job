shr.defineClass("shr.ats.AttendanceFileCheckList", shr.framework.List, {
    pageStep: shr.getUrlRequestParam('pageStep'),
	initalizeDOM:function(){
		shr.ats.AttendanceFileCheckList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initTabPages();
		that.setNagivate();
		//初始化表格
		var html = '<span style="display:none;"><div class="photoCtrlRadio"><input type="radio" name="change" id="posChange" checked ></div>'
		+ '<div style="float: left; width: 80px"><span style = "font-size:13px;font-weight:bold;">'
			+ jsBizMultLan.atsManager_attendanceFileCheck_i18n_1
			+ ' </span></div>'
		+ '<div class="photoCtrlRadio"><input type="radio" name="change" id="orgChange"></div>'
		+ '<div><span style = "font-size:13px;font-weight:bold;">'
			+ jsBizMultLan.atsManager_attendanceFileCheck_i18n_4
			+ '</span></div></span>';
		$('#checkBox').append(html);
		$('#posChange').shrRadio();
		$('#orgChange').shrRadio();
		if(that.pageStep==2){
		    $('#posChange').attr("checked", 'checked');
		}else if(that.pageStep==3){
		    $('#orgChange').attr("checked", 'checked');
		}
		$('#posChange').shrRadio("onChange",function(){
			if($('#posChange').shrRadio("isSelected")){
				that.queryGrid();
			}else
				return;
		});
		$('#orgChange').shrRadio("onChange",function(){
			if($('#orgChange').shrRadio("isSelected")){
				that.queryGrid(); 
			}else
				return; 
		});
		
	}
	,getCustomFilterItems: function() {
		var filterStr = "";
		/*if($('#posChange').shrRadio("isSelected")){*/
		if(this.pageStep == 2){
			filterStr = "position.id <> primaryPosition.id and adminOrgUnit.id = personDep.id";
		}else{
			filterStr = "adminOrgUnit.id <> personDep.id";
		}
		return filterStr;
	}

	,cancelAction:function(){  
		var that = this;
		that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFile.list'
		});
	}
	,updateAction:function(){
		var that = this;
		var $grid = $(that.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		var selectedIdsTest = that.getSelectedIds();
		//var data = $grid.jqGrid("getRowData",selectedIds);
		var postData = [];
		if (selectedIds.length > 0 && selectedIds[0]!="") {
			var datarow ;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				datarow = {
							id:selectedIds[i],
							posId:$grid.jqGrid("getCell", selectedIds[i], "primaryPosition.id"),
							orgId:$grid.jqGrid("getCell", selectedIds[i], "personDep.id")
						  }
				postData.push(datarow);
			}
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileCheck_i18n_3, hideAfter: 3});
			return;
		}
		that.remoteCall({
			method: "update", 
			param: {data:shr.toJSON(postData)}, 
			success: function(data) {
			   shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileCheck_i18n_0, hideAfter: 3});
			   that.reloadGrid();
			
		    }
		    ,error:function(data)
			{    
			    var html=data.responseText;
				shr.showInfo({message: html, hideAfter: 3});
				that.reloadGrid();
			}
		   });
	},
	/**
	 * 查看
	 */
	viewAction: function(billId) {
		// 编辑界面禁用，则直接返回
		/*if (this.editViewDisable) {
			return;
		}
		
		this.reloadPage({
			uipk: this.getEditUIPK(),
			billId: billId,
			method: 'view'
		});	*/
		return
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
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonView.list'
		    });	
		});
		$('#positionChangeList').click(function(){  
		    that.pageStep = 2;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileCheck',
			pageStep: 2
		    });	
		});
		$('#orgChangeList').click(function(){  
		    that.pageStep = 3;
			//定义标签样式
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
	setNagivate: function(){
	    var naviagateLength = $("#breadcrumb li").length;
		for(var i=naviagateLength-2;i>0;i--){
			$("#breadcrumb li").eq(i).remove();
		}
		$("#breadcrumb li").eq($("#breadcrumb li").length-1).html(jsBizMultLan.atsManager_attendanceFileCheck_i18n_2);
	}
});