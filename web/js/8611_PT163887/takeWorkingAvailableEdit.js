var margin_left = 10 + 5;
shr.defineClass("shr.ats.takeWorkingAvailableEdit", shr.ats.AtsAvailableBasicItemEdit, {
	initalizeDOM:function(){
		shr.ats.takeWorkingAvailableEdit.superClass.initalizeDOM.call(this);
		if(this.getOperateState()=="VIEW"){
			shr.createObject(shr.ats.takeWorkingEdit).setViewView();
		}
		else{
			shr.createObject(shr.ats.takeWorkingEdit).setEditView();
		}
		var that = this;
		that.selfDefineOTConPri();//改一下请调休假扣减优先级的样式
		that.addWarning();
		
	},addWarning: function() {
		var that = this;
		//不要出现多个“温馨提示”
		if($('#warning').length < 1){
			$('#description').parent().parent().parent().parent().after('<div style="color: red;">'
				+'<div>'
				+'<div id="warning" title="'
				+ jsBizMultLan.atsManager_takeWorkingAvailableEdit_i18n_3
				+ '" style="padding-left:70px; padding-right:100px; padding-top:20px; padding-bottom:20px;">'
				+jsBizMultLan.atsManager_takeWorkingAvailableEdit_i18n_0
				+jsBizMultLan.atsManager_takeWorkingAvailableEdit_i18n_1
				+ '</div></div></div>');
		}
	},selfDefineOTConPri : function(){
		if(this.getOperateState()!="VIEW"){
			var options =  [];
			for(var i=1; i<=3; i++){
				options.push({value:i,alias:jsBizMultLan.atsManager_takeWorkingAvailableEdit_i18n_2+i});
			}
			var fcp = $("#firstConsumePriority").shrSelect("getValue").value;
			$("#firstConsumePriority").shrSelect("clearOptions");//清空下拉选项，自己填值
			$("#firstConsumePriority").shrSelect("addOption",options);
			$("#firstConsumePriority").val(jsBizMultLan.atsManager_takeWorkingAvailableEdit_i18n_2+ fcp);
			$("#firstConsumePriority_el").val(fcp);
			$("[for]").eq(0).hide();

			var scp = $("#secondConsumePriority").shrSelect("getValue").value;
			$("#secondConsumePriority").shrSelect("clearOptions");//清空下拉选项，自己填值
			$("#secondConsumePriority").shrSelect("addOption",options);
			$("#secondConsumePriority").val(jsBizMultLan.atsManager_takeWorkingAvailableEdit_i18n_2+ scp);
			$("#secondConsumePriority_el").val(scp);
			$("[for]").eq(1).hide();

			var tcp = $("#thirdConsumePriority").shrSelect("getValue").value;
			$("#thirdConsumePriority").shrSelect("clearOptions");//清空下拉选项，自己填值
			$("#thirdConsumePriority").shrSelect("addOption",options);
			$("#thirdConsumePriority").val(jsBizMultLan.atsManager_takeWorkingAvailableEdit_i18n_2+ tcp);
			$("#thirdConsumePriority_el").val(tcp);
			$("[for]").eq(2).hide();

		}else{
			$("#firstConsumePriority").text(jsBizMultLan.atsManager_takeWorkingAvailableEdit_i18n_2+$("#firstConsumePriority").val());
			$("#secondConsumePriority").text(jsBizMultLan.atsManager_takeWorkingAvailableEdit_i18n_2+$("#secondConsumePriority").val());
			$("#thirdConsumePriority").text(jsBizMultLan.atsManager_takeWorkingAvailableEdit_i18n_2+$("#thirdConsumePriority").val());
		}
	}
});
