shr.defineClass("shr.ats.attendanceFileBatchMaintain", shr.ats.attendanceFileBatchMaintainBase, {
	
	 // 让调用方提供节点 
		lastUipk : "" ,
		viewModel : "",
		grid : "" ,
		className : "" ,
		initalizeDOM:function(){
			shr.ats.attendanceFileBatchMaintain.superClass.initalizeDOM.call(this);
			//隐藏精确搜索框
			$('#searcher').closest(".span12").hide();
		},
		// 批量赋值
		addValsAction : function(){
			var pageUipk = "com.kingdee.eas.hr.ats.app.AttendanceFileBatchMaintain.list";//考勤档案列表
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
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileBatchMaintain_i18n_4});
					return false;
				}
				if(gridData[i]['attPosition.id']==null || gridData[i]['attPosition.id']==''){
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileBatchMaintain_i18n_2});
					return false;
				}
				if(gridData[i]['attendanceNum']==null || gridData[i]['attendanceNum']==''){
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileBatchMaintain_i18n_1});
					return false;
				}
				if(gridData[i]['atsShift.id']==null || gridData[i]['atsShift.id']==''){
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileBatchMaintain_i18n_5});
					return false;
				}
				if(gridData[i]['attencePolicy.id']==null || gridData[i]['attencePolicy.id']==''){
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileBatchMaintain_i18n_3});
					return false;
				}
				if(gridData[i]['isAttendance']==null || gridData[i]['isAttendance']===''){
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileBatchMaintain_i18n_0});
					return false;
				}
				if(gridData[i]['isAutoShift']==null || gridData[i]['isAutoShift']===''){
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileBatchMaintain_i18n_7});
					return false;
				}
				if(gridData[i]['EFFDT']==null || gridData[i]['EFFDT']==''){
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileBatchMaintain_i18n_6});
					return false;
				}
			}
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileBatchMaintainHandler&method=batchMaintain";
			openLoader(1,jsBizMultLan.atsManager_attendanceFileBatchMaintain_i18n_8);
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
});