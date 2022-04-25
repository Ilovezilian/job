shr.defineClass("shr.ats.AttenceStateEdit", shr.ats.AtsMaintainBasicItemEdit, {
	 
	initalizeDOM : function () {
		shr.ats.AttenceStateEdit.superClass.initalizeDOM.call(this);
		var that = this;
		$("#attendanceProject_name").attr("placeholder",jsBizMultLan.atsManager_attenceStateEdit_i18n_0);
		$("#index").attr("validate","{maxlength:9,digits:true,required:true,min:0}");
	},
	

	
	doSave: function(event, action) {
		
		var attenceProjectName=$("#attendanceProject_name").val();
		var _self = this;
		var data = _self.assembleSaveData(action);
		data.attenceProjectName=attenceProjectName;
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		shr.doAction({
			target: target,
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(response) {
				if (_self.isFromF7()) {
					// 来自F7，关闭当前界面，并给F7设置
					var dataF7 = {
						id : response,
						name : $.parseJSON(data.model).name
					};
					dialogClose(dataF7);
				} else {
					// 普通保存，去除最后一个面包屑，防止修改名字造成面包屑重复
					shrDataManager.pageNavigationStore.pop();
					
					_self.viewAction(response);
				}
			}
		});	
	}
 
});