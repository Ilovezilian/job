shr.defineClass("shr.ats.atsShiftAdminOrgList", shr.framework.List, {
	 
	initalizeDOM : function () {
		shr.ats.atsShiftAdminOrgList.superClass.initalizeDOM.call(this);
		var that = this;
		var serviceId = shr.getUrlRequestParam("serviceId");
		var url=shr.getContextPath()+'/dynamic.do?checkLicense=true&uipk=com.kingdee.eas.hr.ats.app.AtsShiftAdminOrgForm';
		url += '&serviceId='+encodeURIComponent(serviceId);
		$('#atsShift').click(function(){
				$("#orgFillDiv").attr("src",url);
				var gridNum = $("#entries").getGridParam("reccount");
				$('#hasNum').val(gridNum);
				$('#orgFillDiv').dialog({
						title: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_13,
						width: 900,
						height: 150,
						modal: true,
						resizable: false,
						position: {
							my: 'center',
							at: 'top+20%',
							of: window
						},
						open: function( event, ui ) {
				 		     
				 		},
						buttons: [{
							text: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_11,
							click:function() {
								//校验F7数据
								that.savaUpdateDateAction();
							}
						},{
							text: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_5,
							click: function() {
								$(this).dialog( "close" );
							}
						}]
				 		
				});
				
			$("#orgFillDiv").attr("style","width:1020px;height:550px;");
			
			
		});
		if(localStorage.getItem("atsShiftAdmin_successMsg")){
		shr.showInfo({message:""+localStorage.getItem("atsShiftAdmin_successMsg")});
		localStorage.removeItem("atsShiftAdmin_successMsg");
		}
	},savaUpdateDateAction: function(){
		var that = this;
		var name = $(window.frames["orgFillDiv"].document).find("#name").val();
		var number = $(window.frames["orgFillDiv"].document).find("#number").val();
		var hrOrgUnit_el = $(window.frames["orgFillDiv"].document).find("#hrOrgUnit_el").val();
		var adminOrgUnit_el = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit_el").val();
		var startTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("startTime");
		var endTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("endTime");
		var workCalendar_el = $(window.frames["orgFillDiv"].document).find("#workCalendar_el").val();
		var atsShift_el = $(window.frames["orgFillDiv"].document).find("#atsShift_el").val();
		
		if(name == null || name.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_9, hideAfter: 3});
			return false
		}
		if(number == null || number.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_3, hideAfter: 3});
			return false
		}
		if(hrOrgUnit_el == null || hrOrgUnit_el.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_8, hideAfter: 3});
			return false
		}
		if(adminOrgUnit_el == null || adminOrgUnit_el.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_12, hideAfter: 3});
			return false
		}
		if(startTime == null || startTime.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_7, hideAfter: 3});
			return false
		}
		if(endTime == null || endTime.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_6, hideAfter: 3});
			return false
		}
		if(workCalendar_el == null || workCalendar_el.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_4, hideAfter: 3});
			return false
		}
		if(atsShift_el == null || atsShift_el.length == 0){
			shr.showInfo({message: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_1, hideAfter: 3});
			return false
		}
		that.remoteCall({
				type:"post",
				method:"getPersonsByOrgUnit",
				param:{
				hrOrgUnit_el :hrOrgUnit_el,
	    		adminOrgUnit_el : adminOrgUnit_el,
	    		startTime : startTime,
	    		endTime:endTime,
	    		atsShift_el:atsShift_el,
	    		name:name,
	    		number:number,
	    		workCalendar_el:workCalendar_el
				},
				async: false, 
				success:function(res){
					if(res.errorMsg !=""){
					
					shr.showWarning({message: res.errorMsg,hideAfter:6});
					}else{
					jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
					$("#orgFillDiv").dialog("close");
					parent.location.reload();
					shr.showInfo({message: jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_2});
					}
				}
			});
//		var	url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsShiftAdminOrgListHandler&method=getPersonsByOrgUnit";
//		
//		shr.ajax({
//			url: url,
//			dataType:'json',
//			type: "POST",
//			data: {
//				hrOrgUnit_el :hrOrgUnit_el,
//	    		adminOrgUnit_el : adminOrgUnit_el,
//	    		startTime : startTime,
//	    		endTime:endTime,
//	    		atsShift_el:atsShift_el,
//	    		workCalendar_el:workCalendar_el
//			},
//			beforeSend: function(){
//				openLoader(1);
//			},
//			cache: false,
//			success: function(res) {
//				closeLoader();
//				shr.showInfo({message: "保存成功!"});
//				jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
//				$("#orgFillDiv").dialog("close");
//				parent.location.reload();
//			},
//			error: function(){
//				closeLoader();
//				shr.showInfo({message: "保存失败!"});
//				jQuery('#reportGrid').jqGrid("setGridParam",{postData: { refresh1: 2 }}).trigger("reloadGrid");
//				$("#orgFillDiv").dialog("close");
//			},
//			complete: function(){
//				closeLoader();
//			}
//		});
	
	},atsShiftAction: function(){
		
	}
		,viewAction: function(billId) {
		if($('#selectOk1').size()>0){
		
		}else{
			this.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.AtsShiftAdminOrgEdit.form',
				billId: billId,
				relatedFieldId: billId,
				method: 'view'
			});			
		}
	},
	deleteAction : function() {
		var clz = this;
		var hasConfirm=false;
		var hasConfirms=false;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
			shr.showWarning({message : jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_10});
			return;
		}
		var bills;
		var selectedIds = $("#grid").jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			for (var i = 0;i<selectedIds.length; i++) {
				var item = selectedIds[i];
				var data = $("#grid").jqGrid("getRowData", item);
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
			}
		}
	
		shr.showConfirm(jsBizMultLan.atsManager_atsShiftAdminOrgList_i18n_0, function(){
			clz.doRemoteWithBatchAction({
				method: "deletes",
				billId: bills
			});
		});	
	}
	
	
});

