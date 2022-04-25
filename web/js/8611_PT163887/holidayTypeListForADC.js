shr.defineClass("shr.ats.HolidayTypeList", shr.framework.List, {
	 
	initalizeDOM : function () {
		shr.ats.HolidayTypeList.superClass.initalizeDOM.call(this);
		//var that = this;
	}
    ,/**
	 * 描述:删除操作
	 * @action 
	 */
	deleteAction:function(){		
		var selectedIdsAndisSysPresetCnt = this.getSelectedIds(1);
		if (selectedIdsAndisSysPresetCnt) {
			this.deleteRecord(selectedIdsAndisSysPresetCnt);
		}
	}
	
	/**
	 * 获得选中的id
	 * @param opt 选择的ids用来做什么。 opt 1删除  opt 2用于添加到考勤中心
	 */
	,getSelectedIds: function(opt) {
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var billIds = [];
			var isSysPresetCnt=0;
			if(opt==1){
				for (var i = 0, length = selectedIds.length; i < length; i++) {
					var isSysPreset=$grid.jqGrid("getCell", selectedIds[i], "isSysPreset");
					if(isSysPreset==0){
						billIds.push($grid.jqGrid("getCell", selectedIds[i], "id"));
					}else{//预置数据
						isSysPresetCnt++;
					}
				}
				//return billIds.toString();
				if(billIds.length==0){
				   shr.showWarning({
				     message: jsBizMultLan.atsManager_holidayTypeListForADC_i18n_6
			       });
			       return ;
				}else{
					return  {
					   selectedIds:billIds.toString(),
					   isSysPresetCnt:isSysPresetCnt
					};
				}
			}else if(opt==2){
			    for (var i = 0, length = selectedIds.length; i < length; i++) {
				  billIds.push($grid.jqGrid("getCell", selectedIds[i], "id"));
				}
				return  {
					   selectedIds:billIds.toString() 
				};
			}
	    }
		
		shr.showWarning({
			message: jsBizMultLan.atsManager_holidayTypeListForADC_i18n_3
		});
	}
	
	/**
	 * 描述:删除操作 
	 */
	,deleteRecord:function(selectedIdsAndisSysPresetCnt) {
		var _self = this;
		var msg=jsBizMultLan.atsManager_holidayTypeListForADC_i18n_1;
		if(selectedIdsAndisSysPresetCnt.isSysPresetCnt>0){
			msg=jsBizMultLan.atsManager_holidayTypeListForADC_i18n_0;
		}
		shr.showConfirm(msg, function(){
			top.Messenger().hideAll();
			
			var data = {
				method: 'delete',
				billId: selectedIdsAndisSysPresetCnt.selectedIds 
			};
			data = $.extend(_self.prepareParam(), data);
			
			shr.doAction({
				url: _self.dynamicPage_url,
				type: 'post', 
					data: data, //这种方式即不是直接在地址栏传参数，ajax自动帮我们对url编码(特殊字符)
					success : function(response) {	
						top.Messenger().hideAll();
						var data= jQuery.parseJSON(response||"");
						if(data.existsCanntDel){
							var options={
								   message: jsBizMultLan.atsManager_holidayTypeListForADC_i18n_4
									   + '<br>'+data["msg"]//"操作成功:"+response
								};
								$.extend(options, {
									type: 'info',
									hideAfter: null,
									showCloseButton: true
								});
								top.Messenger().post(options);	
						}else{
							shr.showInfo({
								   message: jsBizMultLan.atsManager_holidayTypeListForADC_i18n_4//"操作成功:"+response
							});
						}
						_self.reloadGrid();
					}
			});	
		});
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
				message: jsBizMultLan.atsManager_holidayTypeListForADC_i18n_2
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
							   message: jsBizMultLan.atsManager_holidayTypeListForADC_i18n_5//"操作成功:"+response
							});
							//$('#holidayPolicyFrame',winPrtDoc).dialog('close');
							winPrt.close_holidayPolicyDlg();
						}
				});	
			//});
	    }
	} 
	,viewAction: function(billId) {
		
	}
});