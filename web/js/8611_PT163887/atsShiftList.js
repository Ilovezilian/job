shr.defineClass("shr.ats.AtsShiftList", shr.ats.AtsMaintainBasicItemList, {
	dayType:"0",
	checkedValue: "",
	html: "<div id='hideInfo'><center><font style='font-size:13px' "+"color='#FF0000'>"
		+ jsBizMultLan.atsManager_atsShiftList_i18n_0
		+ "</font></center></div>",
	turnShiftflag: "",
	hasClear: "false",
	initalizeDOM : function () {
		var hrOrgUnitObj = shr.getUrlRequestParam("hrOrgUnitObj");
//		$('#hrOrgUnit_el').val(JSON.parse(hrOrgUnitObj).id);//行政组织Id
		 if($('#selectOk1').size()>0){
		 	$('#breadcrumb').hide();
		 	$('#selectOk1').css('margin-top','-20px');
		 }
		this.getGridCustomParam(hrOrgUnitObj);
		shr.ats.AtsShiftList.superClass.initalizeDOM.call(this);
		this.turnShiftflag = $.getUrlParam('flag')
		if('turnShift' == this.turnShiftflag || 'myTurnShift' == this.turnShiftflag){
			this.initRadioClick();
			this.initCheckBox();
			this.initHideOrNot();
		}
		if(window.contextLanguage =='en_US'){
			//$(".span12.offset0").eq(1).children().eq(0).css("display","none");
			$(".span12.offset0").eq(2).next().css({
				"line-height":"inherit",
				"padding":"0 10px 10px 10px",
				"position":"static",
				"margin":"0"
			})
			$("#hideDiv").prev().css("width","105px");
			$("#hideDiv").css("padding-left","10px");
		}
	}
	/**
	 * 描述: 导入action
	 */
//	,importAction: function() {
//		this.oldImportAction();
//	}
	,getGridCustomParam: function(hrOrgUnitObj) {
		var hrOrgUnitId;
		if(hrOrgUnitObj){
		hrOrgUnitId = JSON.parse(hrOrgUnitObj).id;
		}
		return {"hrOrgUnitId":hrOrgUnitId};
	}
	,viewAction:function(billId){
	   if($('#selectOk1').size()>0){
	   }else{
			 shr.ats.AtsShiftList.superClass.viewAction.call(this,billId);
		}
	}
    ,selectOk1Action:function(){
	   /****add by：great_chen***/
	   
	    var flag = $.getUrlParam('flag');
	    if('turnShift' == flag){
	    	 var $grid = $(this.gridId);
			 var shiftObejct = $('input[name="dayType"]:checked');
			 //var selectedIds = $grid.jqGrid("getSelectedRows");
			 var selectedIds = this.getSelectedR();
			 if(shiftObejct.val() == "0"){
			 	if (selectedIds.length != 1){
	    	 	 	shr.showWarning({message: jsBizMultLan.atsManager_atsShiftList_i18n_5});
					return false;
	    	 	}
			 }
			var  ids = $grid.jqGrid("getCell", selectedIds[0], "id");
	    	var shiftName = $(this.gridId).jqGrid("getCell", ids, "BaseInfo.name");
	    	var shiftID = $(this.gridId).jqGrid("getCell", ids, "BaseInfo.id");
	    	if(!shiftName){
	    		window.parent.closeFrameDlg('iframe1',shiftObejct.attr("title"),shiftID);
	    	}
	    	else{
	    		window.parent.closeFrameDlg('iframe1',shiftObejct.attr("title") + shiftName,shiftID);
				
	    	}
	    	
	    }
		
		// add by wesharn_wang 供个人调班用，关闭时添加参数班次的id
		else if('myTurnShift' == flag){
	    	 var $grid = $(this.gridId);
			 var shiftObejct = $('input[name="dayType"]:checked');
			 //var selectedIds = $grid.jqGrid("getSelectedRows");
			 var selectedIds = this.getSelectedR();
			 if(shiftObejct.val() == "0"){
			 	if (selectedIds.length != 1){
	    	 	 	shr.showWarning({message: jsBizMultLan.atsManager_atsShiftList_i18n_5});
					return false;
	    	 	}
			 }
			var  ids = $grid.jqGrid("getCell", selectedIds[0], "id");
	    	var shiftName = $(this.gridId).jqGrid("getCell", ids, "BaseInfo.name");
	    	var shiftId = $(this.gridId).jqGrid("getCell", ids, "BaseInfo.id");
	    	if(!ids){
	    		window.parent.closeFrameDlg('iframe1',shiftObejct.attr("title")+""+"-"+"");
	    	}
	    	else{
	    		window.parent.closeFrameDlg('iframe1',shiftObejct.attr("title") + shiftName+"-"+shiftId);
				
	    	}
	    	
	    }
	    
	    else{
	    	var ids=this.getSelectedIdsArr()||[];
	    	var _self = this;
	    	var winPrt=window.parent;
		    var winPrtDoc=window.parent.document;
		    var attendanceCenterId=$('#form #id',winPrtDoc).val()||'';
		    if(attendanceCenterId==''){
			    shr.showWarning({
					message: jsBizMultLan.atsManager_atsShiftList_i18n_3
				});
				return false;
			}
		    if (ids.length>0) {
				this.remoteCall({
					//url
					method: 'selectOk1', 
					param: {
						 uipk:"com.kingdee.eas.hr.ats.app.AtsShift4AttendanceCenter.list",	
						 ids: ids,
						 attendanceCenterId:attendanceCenterId
					},
					success: function(response) {
						 shr.showInfo({
						   	 message: jsBizMultLan.atsManager_atsShiftList_i18n_6  
						 });
						 window.parent.closeFrameDlg('iframe1');
						 //$("#iframe1",winPrtDoc).dialog('close'); 
					}
		    	});
		    }	
		    }
	   
	}
	,getSelectedIdsArr: function() {
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var billIds = [];
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var  vid=$grid.jqGrid("getCell", selectedIds[i], "id");
				billIds.push(vid);
			}
			if(billIds.length==0){
			   shr.showWarning({
			     message: jsBizMultLan.atsManager_atsShiftList_i18n_4
		       });
		       return [];
			} 
			return billIds;
	    }else{
	    	   shr.showWarning({
			     message: jsBizMultLan.atsManager_atsShiftList_i18n_4
		       });
		       return [];
	    }
	},
	initRadioClick: function(){
		
		var that = this;
		//$('input[name^=dayType]').shrRadio();
		$("input[type='radio']").click(function(node){
			if($("#hideInfo")){
				$("#hideInfo").remove();
		    }
			var checkedValue = $("input[type='radio']:checked").val();
			that.dayType = checkedValue;
			if("1" == checkedValue || "2" == checkedValue){
				$("#hideDiv").show();
				$("#hideHref").html(jsBizMultLan.atsManager_atsShiftList_i18n_7);
				$("#grid").hide();
				$(that.html).insertBefore("#grid");
			}else{
				$("#grid").show();
				$("#hideDiv").hide();
				$("#hideInfo").remove();
			}
			if(jsBizMultLan.atsManager_atsShiftList_i18n_7 == $("#hideHref").html()){
				that.checkedValue = "1";
			}else{
				that.checkedValue = "0";
			}
		});
		
	},
	initHideOrNot: function(){
		var that = this;
		$("#hideHref").click(function(){
			       $("#hideInfo").remove();
					if("1" == that.checkedValue){
						that.checkedValue = "0";
						$("#grid").show();
						$("#hideInfo").remove();
						$("#hideHref").html(jsBizMultLan.atsManager_atsShiftList_i18n_8);
					}else{
						that.checkedValue = "1";
						$("#grid").hide();
						$(that.html).insertBefore("#grid");
						$("#hideHref").html(jsBizMultLan.atsManager_atsShiftList_i18n_7);
					}
				});
	},
	initCheckBox: function(){
		var that = this;
		$("#hideHref").html(jsBizMultLan.atsManager_atsShiftList_i18n_7);
		if(jsBizMultLan.atsManager_atsShiftList_i18n_7 == $("#hideHref").html()){
			that.checkedValue = "1";
		}
		$("#hideDiv").hide();
	},
	
	getSelectedR: function(){
		var selectedRows = [];
		var objRows = $("tr[aria-selected='true']");
		for(var i=0;i<objRows.length;i++){
			selectedRows.push($(objRows[i]).attr("id"));
		}
		return selectedRows;
	},
	copyAction:function(){
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length == 0) {
			shr.showWarning({message: jsBizMultLan.atsManager_atsShiftList_i18n_1});
			return ;
		}else if(selectedIds.length > 1) {
			shr.showWarning({message: jsBizMultLan.atsManager_atsShiftList_i18n_9});
			return ;
		}
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsShift.form',
			copy:1,
			method: 'copy'
		});
	},batchDeleteAction:function(){	
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var bills ;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var data = $("#grid").jqGrid("getRowData", selectedIds[i]);
				if(data["state"]==1){
					shr.showInfo({message: jsBizMultLan.atsManager_atsShiftList_i18n_2, hideAfter: 3});
					return;
				}
			}
			shr.ats.AtsShiftList.superClass.batchDeleteAction.call(this);
		}
	}
});