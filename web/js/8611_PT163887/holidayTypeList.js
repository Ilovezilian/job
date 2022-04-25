shr.defineClass("shr.ats.HolidayTypeList", shr.ats.AtsMaintainBasicItemList, {
	 
	initalizeDOM : function () {
		shr.ats.HolidayTypeList.superClass.initalizeDOM.call(this);
		//var that = this;
	}
    
	,processF7ChangeEvent : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#proposer").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					$("#attendanceNum").val(info.number); 
					$.post(shr.getContextPath()+"/atsAttendanceFile.do?method=getPersonInfos",{personId: info.id}, function(datas) {
						var info = datas;
						
						$('#adminOrgUnit_el').val( info.data.adminOrgUnitId );		//部门ID
						$('#adminOrgUnit').val( info.data.adminOrgUnitName.name);	//部门名称  
						
						$("#position_el").val(info.data.positionId);		//职位ID
						$("#position").val(info.data.positionName.name);    //职位名称
					});
					
				}
			});
		}
	}
	,selectOkAction:function(){
	    var selectedIdsObj = this.getSelectedIds(2);
	    var _self = this;
	    var winPrt=window.parent;
	    var winPrtDoc=window.parent.document;
	    var attendanceCenterId=$('#form #id',winPrtDoc).val()||'';
	    if(attendanceCenterId==''){
		    shr.showWarning({
				message: jsBizMultLan.atsManager_holidayTypeList_i18n_0
			});
			return false;
		}
	    if (selectedIdsObj) {
			//shr.showConfirm('您确认要选择这些假期类型？', function(){
				top.Messenger().hideAll();
				var data = {
					method: 'selectOk',
					billId: selectedIdsObj.selectedIds,
					attendanceCenterId:attendanceCenterId
				};
				data = $.extend(_self.prepareParam(), data);
				shr.doAction({
					url: _self.dynamicPage_url,
					type: 'post', 
						data: data,
						success : function(response) {					
							shr.showInfo({
							   message: jsBizMultLan.atsManager_holidayTypeList_i18n_1//"操作成功:"+response
							});
							//$('#holidayPolicyFrame',winPrtDoc).dialog('close');
							winPrt.close_holidayPolicyDlg();
						}
				});	
			//});
	    }
	} 

});