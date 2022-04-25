shr.defineClass("shr.ats.AttenceResultEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.AttenceResultEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		//that.setButtonVisible();
	},
	
 	
 	auditAction: function (even){
 		var  billId = $("#billId").val();
		 shr.doAjax({
			url: "/easweb/atsAttencePolicy.do?method=setAuditStatePass",
			data: {
				billId: billId  //JSON.stringify(billId)
			},
			success: function(data){
				//alert(JSON.stringify(data));
				if (data.result == 1) {
					 top.Messenger().post({
						message: '审核完成!',
						showCloseButton: true
					 });
					 return false;
				}else{
					 top.Messenger().post({
						message: '审核失败!',
						showCloseButton: true
					 });
					 return false; 
				}
			}
		});
	},
	
	antiauditAction: function (even){
		var  billId = $("#billId").val();
		 shr.doAjax({
			url: "/easweb/atsAttencePolicy.do?method=setAntiAuditState",
			data: {
				billId: billId
			},
			success: function(data){
				if (data.result == 1) {
					 top.Messenger().post({
						message: '反审核完成!',
						showCloseButton: true
					 });
					 return false;
				}else{
					 top.Messenger().post({
						message: '反审核失败!',
						showCloseButton: true
					 });
					 return false; 
				}
			}
		}); 
	},
	
	
	
	
	
	
	/**
	 * 包装model
	 */
	warpModel:function(model){
		//model.entries = model.billEntry;
		//delete model.billEntry;
		return model;
	},
	// copy  from edit.js 
	//----------------------------------------------------------------------------------------------------------------
	
	/**
	 * 保存
	 */
	saveAction: function(event) {
		var _self = this,
			workArea = _self.getWorkarea(),
			$form = $('form', workArea);
		
		if ($form.valid() && _self.verify()) {			
			_self.doSave(event, 'save');
		}		
	},
	
	/**
	 * 保存真正执行方法
	 */
	doSave: function(event, action) {
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		var model = shr.assembleModel(_self.fields, _self.getWorkarea(), _self.uuid);
		
		// TODO
		model =_self.warpModel(model);
		
		data.model = shr.toJSON(model);
		data.method = action;
		
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
					
					_self.reloadPage({
						billId: response,
						method: 'view'
					});
				}
			}
		});	
	},	
	
	/**
	 * 提交
	 */
	submitAction: function(event) {
		var _self = this,
			workArea = _self.getWorkarea(),
			$form = $('form', workArea);
		
		if ($form.valid() && _self.verify()) {
			shr.showConfirm('您确认要提交吗？', function() {
				_self.doSubmit(event, 'submit');
			});
		}		
	},
	
	/**
	 * 提交真正执行方法
	 */
	doSubmit: function(event, action) {
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		var model = shr.assembleModel(_self.fields, _self.getWorkarea(), _self.uuid);
		
		// TODO
		model =_self.warpModel(model);
		
		data.model = shr.toJSON(model);
		data.method = action;
		
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
				if (_self.isFromWF()) {
					// 来自任务中心
					var parent = window.parent,
						submitSuccess = parent.submitSuccess;
					
					if ($.isFunction(submitSuccess)) {
						// 回调父页面方法
						var assignmentID = shr.getUrlRequestParam('assignmentID');
						submitSuccess.call(parent, assignmentID);
					} else {
						// 查看状态
						_self.reloadPage({
							method: 'view'
						});
					}
				} else {
					// 普通提交，返回上一页面
					_self.back();
				}
			}
		});	
	}
	
	
	
	
	
});