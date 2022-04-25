function registFormulaFormService(uiObject,otherParams){
	var formulaFormService = {};
	var otherParamsTemp = $.extend({},otherParams,{uiObject : uiObject || {},windowObject : otherParams && otherParams.windowObject || window});
	$.extend(formulaFormService, {
		adjustFormulaView : true,
		preloadTplData : true,
		uiObject : {},
		windowObject : window,
		formulaEditUipk:'com.kingdee.eas.hr.ats.app.Formula'
		,viewAdjust:function(){
			var that = this;
			this.getNavConfigByFormulaTpl();
			this.removeFormulaFields();
		}
		
		,removeFormulaFields: function(){
			var that = this;
			setTimeout(function(){
				var filterInd = [];
				that.uiObject.fields && that.uiObject.fields.forEach(function(item,ind){
					item == 'filter' && (filterInd.push(ind));
				});
				filterInd.reverse().forEach(function(item){
					that.uiObject.fields.splice(item,1);
				});
			},100);
		}
		
		,getNavConfigByFormulaTpl : function(formulaTpl){
			var that = this;
			var allItemMap = {};
			var tplInfo = that.getCachedTplInfo();
			(that.getCachedTplInfo().items || []).filter(function(item){
				return item.enable && item.show;
			}).forEach(function(item){
				allItemMap[item.field] = $.extend({},item);
			});
			uiObject.remoteCall({
				async:true,
				method:'getFormulaItem',
				param:{formula:uiObject.billId},
				success:function(res){
					//console.info(res);
					if(res && typeof res == 'string'){
						res = JSON.parse(res);
					}
					(res || []).forEach(function(item){
						allItemMap[item.number] && (allItemMap[item.number]['showValue'] = item);
					});
					for(var field in allItemMap){
						that.initFiledByTplItemInfo(allItemMap[field]);
					}
					that.windowObject.$('#formulaItemField' + uiObject.uuid).parents('[data-ctrlrole=labelContainer]').hide();
				}
			});
		}
		
		,getCachedTplInfo : function(formulaTpl){
			var that = this;
			var _formulaTplInfo = that.windowObject._formulaTplInfo || that.windowObject.parent._formulaTplInfo;
			if(!_formulaTplInfo){
				uiObject.remoteCall({
					async:false,
					method:'getFormulaTplInfo',
					param:{formulaTpl:formulaTpl || that.getFormulaTpl()},
					success:function(res){
						//console.info(res);
						if(res && res.items){
							res.items = res.items.filter(function(item){
								return item.enable && item.show;
							});
							res.items.splice(0,0,$.extend({show:true,enable:true,fieldName : '过滤条件',field:'filter'},res.items.filter));
						}
						_formulaTplInfo = res;
					}
				});
			}
			!_formulaTplInfo && (_formulaTplInfo = {items : []});
			that.windowObject._formulaTplInfo = _formulaTplInfo;
			!that.windowObject.parent._formulaTplInfo && (that.windowObject.parent._formulaTplInfo = _formulaTplInfo);
			return  _formulaTplInfo;
		}
		
		,initFiledByTplItemInfo : function(tplItemInfo){
			var that = this;
			if(tplItemInfo.field == 'filter'){
				return that.initFilter(tplItemInfo);
			}
			var $idCotainer = that.windowObject.$('#formulaItemField' + uiObject.uuid).parents('[data-ctrlrole=labelContainer]');
			var $container = $idCotainer.clone();
			$idCotainer.parent().append($container);
			$container.find('.field-label').attr('title',tplItemInfo.fieldName).text(tplItemInfo.fieldName);
			
			if(uiObject.getOperateState() == 'VIEW'){
				$('<span id="' + tplItemInfo.field + uiObject.uuid + '"></span>').appendTo($container.find('.field-ctrl.flex-c').empty()).shrFieldDisplay({
					alias : tplItemInfo.showValue && tplItemInfo.showValue.content && $(tplItemInfo.showValue.content).text() || '',
					className : 'field_input'
				});
			}else{
				//tplItemInfo.showValue && (tplItemInfo.showValue.number += uiObject.uuid);
				$('<input id="' + tplItemInfo.field + uiObject.uuid + '"/>').appendTo($container.find('.field-ctrl.flex-c').empty()).shrPromptFormulaBox({
					comineModel : null,
					scheme : null,
					value : tplItemInfo.showValue,
					formUUid:uiObject.uuid
				});
			}
			
		}
		
		,initFilter:function(tplItemInfo){
			var that = this;
			var $filter = that.windowObject.$('#' + tplItemInfo.field + uiObject.uuid);
			if(uiObject.getOperateState() == 'VIEW'){
				$('<span id="' + tplItemInfo.field + uiObject.uuid + '"></span>').appendTo($filter.parent().empty()).shrFieldDisplay({
					alias : tplItemInfo.showValue && tplItemInfo.showValue.content && that.windowObject.$(tplItemInfo.showValue.content).text() || '',
					className : 'field_input'
				});
			}else{
				//tplItemInfo.showValue && (tplItemInfo.showValue.number += uiObject.uuid);
				$filter.shrPromptFormulaBox({
					comineModel : null,
					scheme : null,
					value : tplItemInfo.showValue,
					formUUid:uiObject.uuid
				});
			}
		}
		
		,getFormulaTpl:function(){
			return this.formulaTpl || this.windowObject.$('.formulaTpl.hide').text();
		}
		
		,assembleTplIinfo : function(){
			var that = this;
			if(!that.getCachedTplInfo()){
				return {};
			}
			var fields = [];
			(that.getCachedTplInfo().items || []).forEach(function(item){
				if(item.enable && item.show){
					var fieldVal = shr.getFieldValue(item.field,uiObject.uuid,uiObject.contex);
					if(fieldVal && fieldVal.content){
						fieldVal.number = item.field;
						fields.push(fieldVal);
					}
				}
			});
			return {id : that.getCachedTplInfo().id, fields : fields};	
		}
		
	},otherParamsTemp);
	$.extend(uiObject,{
		formulaFormService : formulaFormService,
		prepareParam : function(action) {
			var that = this;
			var param = that.__proto__.prepareParam.call(this) || {};
			action == 'saveAction' && $.extend(param,{formulaTplInfo :JSON.stringify(that.formulaFormService.assembleTplIinfo())});
			return param;
		}
	});
	formulaFormService.preloadTplData && formulaFormService.getCachedTplInfo();
	formulaFormService.adjustFormulaView & formulaFormService.viewAdjust();
	return formulaFormService;
};

