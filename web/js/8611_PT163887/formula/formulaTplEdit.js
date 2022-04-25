shr.defineClass("shr.ats.FormulaTplEdit", shr.framework.Edit, {
	
	initalizeDOM : function(){
		shr.getCurrentViewPage('').superClass.initalizeDOM.call(this);
		this.viewAdjust();
		this.resetTableConfig();
	}
	
	,viewAdjust:function(){
		this.getOperateState() != 'VIEW' && this.initFormulaField();
	}
	
	,getNavConfig:function(fieldName){
		
	}
	
	,getFormulaFields:function(){
		
	}
	
	,getItemDefaultVal: function(){
		var that = this;
		if(that.getOperateState() != 'EDIT'){
			return;
		}
		that.remoteCall({
			async:true,
			method:'getItemDefaultVal',
			param:{billID:shr.getUrlRequestParam('billId')},
			success:function(res){
				(res && res.items || []).forEach(function(item){
					if(item.defaultVal && item.defaultVal.content && that.getOperateState() == 'EDIT'){
						$('#items').jqGrid('setCell',item.id,'defaultVal',item.defaultVal);
					}
				});
			}
		});
	}
	
	,isExcludeFields:function(field){
		return 'id,creator,createTime,lastUpdateUser,lastUpdateTime,CU,'.indexOf(field + ',') >= 0;
	}
	
	,initTplFields : function(){
		var that = this;
		that.remoteCall({
			async:true,
			method:'getEntityProperties',
			param:{combineModel:shr.getFieldValue('model')},
			success:function(res){
				res.length > 0 && $('#items').jqGrid('clearGridData');
				res.filter(function(value){
					return value && !value.children && !that.isExcludeFields(value.field);
				}).forEach(function(value,index){
					$('#items').jqGrid('addRowData',index + 1,{
						field : value.field,
						fieldName : value.name,
						show : false,
						enable : 1,
						sortSn : 10 * (index + 1)
					});
				});
			}
		});
	}
	
	,initFormulaField:function(){
		var that = this;
		$('#filter').shrPromptFormulaBox({
			verifyBeforeOpenCallback : function(){
				var scheme = $('#scheme').shrPromptBox("getValue");
				var model = $('#model').shrTextField("getValue");
				console.info(this);
				$('#filter').shrPromptBox("option", {
					scheme:scheme && scheme.number,
					combineModel:model
				});
			}
		});
		$('#model').shrTextField("option",{oldValue : shr.getFieldValue('model')});
		$('#model').blur(function(e,value){
			 if(shr.getFieldValue('model') != $('#model').shrTextField("option",'oldValue')){
			 	$('#model').shrTextField("option",{oldValue : shr.getFieldValue('model')});
			 	that.initTplFields();
			 }
		});
	}
	
	,resetTableConfig :function(){
		var that = this;
		$('#items').setColProp('defaultVal',{
			edittype:'promptFormulaBox',
			formatter:'htmlText',
			displayFormat : '{formulaText}',
			beforCreateF7: function(f7Json){
				$.extend(f7Json,{
					scheme : $('#scheme').shrPromptBox("getValue"),
					combineModel:$('#model').shrTextField("getValue")
				});
			}
		});
		$('#items').jqGrid('setGridParam',{loadComplete : function(){
			that.getItemDefaultVal();
		}}).trigger('reloadGrid');
	}
	
	,assembleModel: function(fields, context, uuid){
		var model = shr.getCurrentViewPage('').superClass.assembleModel.call(this,fields, context, uuid);
		model.filter = $('#filter').shrPromptFormulaBox('getValue');
		return model;
	}
	
})