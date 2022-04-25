
shr.defineClass("shr.ats.AtsScheduleShiftEdit", shr.framework.Edit, {

	initalizeDOM:function(){
		shr.ats.AtsScheduleShiftEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		that.hideAllDelLink();
			$('#items_save').click(function(){
				
        	});
		$('td span[id$="editButton"]').live('click',function(){
			$(".icon-calendar").remove();
			$("input[id='attendDateBefore']").attr("disabled","disabled");
			$('input[id="attendDateBefore"]').parent().parent().parent().css({"background-color":"#ECECEC"});
			$('#dayTypeBefore').shrSelect("disable");
			$("#adminOrgUnit").shrPromptBox("disable")
			$("#defaultShiftBefore").shrPromptBox("disable")
			$("#proposerBefore").shrPromptBox("disable")
			$("#position").shrPromptBox("disable")
			
			$("input[id='workTimeBefore']").attr("disabled","disabled");
			$('input[id="workTimeBefore"]').parent().css({"background-color":"#ECECEC"});
			$("input[id='workTimeAfter']").attr("disabled","disabled");
			$('input[id="workTimeAfter"]').parent().css({"background-color":"#ECECEC"});
		 });
		 document.addEventListener('editComplete_entries', function (event) {
		  	that.processF7ChangeEvent();
		  	if(that.isFromWF() && that.getOperateState() == 'EDIT'){
		  		$('#defaultShiftAfter').shrPromptBox("option","subWidgetOptions.otherParams",
		  			{serviceId:"Yc7dQwbpRKi6uBHzHDEvOvI9KRA="//排班列表serviceId
		  			});
		  	}
		  	$('#defaultShiftAfter').blur(function(){
		  			var defaultShift_el = $('#defaultShiftAfter').val();
					if(defaultShift_el == null || defaultShift_el == undefined || defaultShift_el.length < 1){
							$('#defaultShiftAfter').shrPromptBox("setValue","")
					}
		  		
		  		});

       },false);
	    if(that.isFromWF() && that.getOperateState() == 'VIEW'  && $("#billState").val() == 3){
	    	$('#edit').hide();
	    	$('#submit').hide();
	    }	
		//审核编辑界面
		if(that.isFromWF() && that.getOperateState() == 'EDIT'  && $("#billState").val() != 0)
		{
			$('#deleteRow_entries').unbind("click").attr("onclick","").css("cursor","default");
			$('#addRow_entries').unbind("click").attr("onclick","").css("cursor","default");
			$(".editGrid-toolbar").hide();	
			//$("#number").parent().css("width","33.2%");
			$(".enter2tab a").css("cursor","pointer");
			$('#deleteRow_entries').hide();
			$('#addRow_entries').hide();
			
		}
		if(that.getOperateState() == 'EDIT')
		{
			$('#deleteRow_entries').hide();
			$('#addRow_entries').hide();
			
		}
	}
	, processF7ChangeEvent : function(){
	    var that = this;
		$("#defaultShiftAfter").shrPromptBox("option", {
			onchange : function(e, value) {
				var dayType = $('#dayTypeAfter_el').val();
				var defaultShift_el = $('#defaultShiftAfter').val();
				var info = value.current;
				that.remoteCall({
					type:"post",
					method:"getPlanWorkTimeByShift",
					param:{atsShiftId: info.id,
							uipk:"com.kingdee.eas.hr.ats.app.AtsScheduleShift.workFlowForm"
					},
					success:function(res){
						$('#workTimeAfter').val(res[0]);
					}
				});
			  }
		});
      }
      ,hideAllDelLink:function(){
	    $('td span[id$="removeButton"]').hide();
        $('td[aria-describedby$=items_operatorColumn]')
			.attr("title",jsBizMultLan.atsManager_atsScheduleShiftEdit_i18n_0);
        $('td[aria-describedby$=entries_operatorColumn]')
			.attr("title",jsBizMultLan.atsManager_atsScheduleShiftEdit_i18n_0);
	}
	,beforeSubmit :function(){
		
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		//_self.beforeWFValidStoreCellValue();
		 
		if (($form.valid() && _self.verify())) {
			return true ;
		}
		// return false 也能保存，固让js报错，后续让eas修改 return false 逻辑
		var len = workArea.length() ;
		return false ;
	}
	,verify: function() {
		var that=this;
	    var records=$('#entries tr.jqgrow');
		var recordLen=records.length;
		for(var i=0;i<recordLen;i++){
			var shiftAfter=$('td[aria-describedby="entries_defaultShiftAfter"]',records[i]).text();
			
			var dayTypeAfter=$('td[aria-describedby="entries_dayTypeAfter"]',records[i]).text(); 
			if(dayTypeAfter==jsBizMultLan.atsManager_atsScheduleShiftEdit_i18n_1){
				if(!shiftAfter){
					shr.showWarning({message: jsBizMultLan.atsManager_atsScheduleShiftEdit_i18n_2});
					return false;
				}
			}
			
		}
		
		return true;
	}
	,assembleSaveData: function(action) {
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		data.method = action;
		data.operateState = _self.getOperateState();
		//if(_self.isFromWF()){
			var model = _self.assembleModel();
			for(var i = 0;i < model.entries.length; i++){
				var shiftAfter = new Object();
				shiftAfter.id = model.entries[i].defaultShiftAfter.id;
				shiftAfter.number = model.entries[i].defaultShiftAfter.number;
				shiftAfter.name = model.entries[i].defaultShiftAfter.name;
				model.entries[i].defaultShiftAfter = shiftAfter;
			}
			data.model = shr.toJSON(model);
	/*	} else{
			data.model = shr.toJSON(_self.assembleModel()); 
		}*/
		// relatedFieldId
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		
		return data;
	}
	

});
