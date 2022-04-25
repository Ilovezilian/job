shr.defineClass("shr.ats.AttendanceFileDisPersonSaveAllList",shr.ats.attendanceFileBatchMaintainBase, {
	initalizeDOM : function () {
		shr.ats.AttendanceFileDisPersonSaveAllList.superClass.initalizeDOM.call(this);
		var that = this;
		//隐藏精确搜索框
		$('#searcher').closest(".span12").hide();
		//屏蔽搜索栏
		//$('div[class="relative"]').css('display','none');
		//var personNums = $.getUrlParam('personNums');
		//var personNums = $.getUrlParam('billId');
		//debugger;
		//if(personNums == null || personNums == undefined || personNums.length < 1){
		//	personNums = '';
		// }
		//var myPostData={personNums: personNums};
		//$("#grid").jqGrid("option",'postData', myPostData);//postData来传递我们  定制的参数 jquery.jqGrid.extend.js
		
		//that.setNavigate();
	},
	// 批量赋值
	addValsAction : function(){
		var pageUipk = "com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonSaveAll.list";//考勤档案列表
		var _self = this;
	    _self.addValsPublicAction(pageUipk);
	},
	cancelAllAction:function(){	
		history.back();
	},
	saveAllAction:function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var gridData= $grid.jqGrid("getRowData");
		for(var i=0;i<gridData.length;i++){
			if(gridData[i]['hrOrgUnit.id']==null || gridData[i]['hrOrgUnit.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_4});
				return false;
			}
			if(gridData[i]['attPosition.id']==null || gridData[i]['attPosition.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_5});
				return false;
			}
			if(gridData[i]['attendanceNum']==null || gridData[i]['attendanceNum']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_1});
				return false;
			}
			if(gridData[i]['atsShift.id']==null || gridData[i]['atsShift.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_7});
				return false;
			}
			if(gridData[i]['attencePolicy.id']==null || gridData[i]['attencePolicy.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_6});
				return false;
			}
			if(gridData[i]['isAttendance']==null || gridData[i]['isAttendance']===''){
				shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_0});
				return false;
			}
			if(gridData[i]['isAutoShift']==null || gridData[i]['isAutoShift']===''){
				shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_9});
				return false;
			}
			if(gridData[i]['EFFDT']==null || gridData[i]['EFFDT']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_8});
				return false;
			}
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileBatchMaintainHandler&method=batchMaintain";
		openLoader(1,jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_10);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridData)},
			success:function(res){
				closeLoader();
				parent.location.reload();
		    }
	});		 
	}
/*	saveAllAction: function() {
		var that = this;
		var personNums = $.getUrlParam('personNums');
		
		if(personNums == null || personNums == undefined || personNums.length < 1){
			personNums = '';
		}
		openLoader(1,"正在保存数据");                                                    
			that.remoteCall({
						type:"post",
						method:"saveAll",
						param:{personNums:personNums},
						success:function(res){
							closeLoader();
							
							if(res.flag){
								shr.showInfo({ message: "当前页面所有数据保存成功!"});
							}
							else{
								shr.showWarning({ message: res.msg});
							}
							
							if(res.flag){
								that.reloadPage({uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonView.list'});
							}
							else{
								shr.showWarning({ message: res.msg});
							}
							
							
						}
			});	
	}*/
	//仅仅取消掉行点击数据:覆盖子类方法不做处理
	,viewAction:function(){
		
	},
	setNavigate:function(){
	   var disFileIndex = 0;
	   //找到未见档案列表所在的索引位置
	   for(var i=0;i<$("#breadcrumb li").length-1;i++){
	       if(i!=0){
		      if($("#breadcrumb li a").eq(i).html() == jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_3){
			     $("#breadcrumb li a").eq(i).html(jsBizMultLan.atsManager_attendanceFileDisPersonSaveAllList_i18n_2);
				 disFileIndex=i;
			  }
			 
		   }
	   }
	   //去除多余的导航
	   for(var i=0;i<$("#breadcrumb li").length-1;i++){
	         if(i!=0 && i!=disFileIndex){
			     $("#breadcrumb li a").eq(i).html("");
			 }
	   }
	   //移除导航上的斜杠
	   for(var i=0;i<$("#breadcrumb li").length-2;i++){
	         if(i!=0){
			     $("#breadcrumb li span").eq(1).remove();//移除一个会少一个，所以一直移除索引为1的就行。
			 }
	   }
	}
	/*
	gridLoadComplete: function() {
		var that = this;
		// add input
		var $grid = $('#grid'), ids = $grid.getDataIDs();
		var id, status;
		for (var i = 0, length = ids.length; i < length; i++) {
			id = ids[i];
		}
		
		$("#grid").find("td[aria-describedby='grid_attendanceFile.isAttendance']").each(function(){
			var text=$(this).text();
			   $(this).empty();
			   $(this).append("是");
		});
		}
	*/
});