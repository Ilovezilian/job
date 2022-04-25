;(function($) {
    $.widget("ui.shrPromptFormulaBox", $.ui.shrctrl, {
        options : {
            id : null,
            name : null,
            multiselect:false,
            formulaEditUipk:'com.kingdee.eas.hr.ats.app.Formula',
            displayFormat : '{formulaText}',
            width: 1200,
            height : 800,
            validate : '',
            formUUid : '',
            isMultiValue:false,
            value : null,
            scrolling :'no',
            scheme : '015_ATS_LIMIT',
            formulaFunc : "[ ('&',('type','in',0,1,2,3)) ]",
            combineModel : null,
            verifyBeforeOpenCallback:null,
            formulaTplInfo : null,
            subFrameOpenHandler:null,
            subFrameColseHandler : null
        },

        _create:function(){
			var _self = this;
			var field = $(_self.element);
			var oriValue = _self.options.value || _self.element.data('data.f7');
			oriValue && (oriValue.formulaText = oriValue.content && $(oriValue.content).text() || '');
			_self._resetContainer();
			field.shrPromptBox({
				id:_self.options.id || field.attr('id'),
				name: _self.options.name || field.attr('id'),
				value : oriValue,
				displayFormat : _self.options.displayFormat,
				validate : _self.options.validate || field.attr('validate'),
				subWidgetOptions:{multiselect : _self.options.multiselect},
				verifyBeforeOpenCallback:function(){
					if($.isFunction(_self.options.verifyBeforeOpenCallback)){
		                var isPass = _self._trigger("verifyBeforeOpenCallback", event, {params: event});
		                if(isPass === false){
		                    return false;
		                };
		            };
					_self._openSubFrame();
					return false;
				}
			});
			field.attr('disabled','disabled');
		},
		
		_resetContainer : function(){
			var _self = this;
			var fieldCtrl = $(_self.element).addClass('flag-formulaField').parents('.field-ctrl.flex-c');
			if(fieldCtrl.length){
				return fieldCtrl.empty().append($(_self.element).removeAttr('style'));
			};
			var _self = this;
			_self.element.wrap($('<div class="field-ctrl flex-c"></div>'));
			var container = $('<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis1"></div>');
			_self.element.wrap(container);
			container.prepend(juicer('<div class="label-ctrl flex-cc flex-r">' +
											'<div class="field-label" title="${label}">${label}</div>' +
											'<div class="field-desc"></div>' +
										'</div>'),{label:_self.options.label});
		},
        
        _init:function(){
			//console.info(arguments);
        },
        
        _openSubFrame : function(){
			var _self = this;
			var formUUid = _self.options.formUUid || '';
			var field = $(_self.element).attr('id') || '';
			var url = shr.getContextPath() + '/dynamic.do?method=initalize&inChildFrame=true';
			url += '&uipk=' + _self.options.formulaEditUipk;
			url += '&serviceId=' + encodeURIComponent(shr.getUrlRequestParam("serviceId"));
			url += '&scheme=' + encodeURIComponent(_self.options.scheme);
			url += '&formUUid=' + encodeURIComponent(formUUid);
			url += '&field=' + encodeURIComponent(field.substring(0,field.length - formUUid.length));
			url += '&comineModel=' + encodeURIComponent(_self.options.comineModel);
			!$("#iframe_formula").length && $('body').append('<iframe name="iframe_formula" id="iframe_formula" frameborder="0" />');
			$("#iframe_formula").attr("src", url).dialog({
				modal: true,
				width: _self.options.width,
				height: _self.options.height,
				title: $(_self.element).parents('[data-ctrlrole=labelContainer]').find('.field-label').attr('title'),
				open: function(event, ui) {_self._subFrameOpenHandler(event,ui);},
				close: function(event, ui) {_self._subFrameColseHandler(event, ui);}
			});
			$("#iframe_formula").attr("style", "width:" +  _self.options.width + "px;height:" + _self.options.height + "px;");
			$("#iframe_formula").attr("scrolling",_self.options.scrolling || "auto");
		},
		
		_subFrameOpenHandler : function(event, ui){
			var _self = this;
			_self.options.subFrameOpenHandler && _self.options.subFrameOpenHandler(event,ui);
		},
		
		_subFrameColseHandler : function(event, ui){
			var _self = this;
			var param = {eventObj:event,frameWindow:iframe_formula,uiObject:iframe_formula.shr.getCurrentViewPage('')};
			param.model = param.uiObject.assembleModel();
			var rowData = iframe_formula.formula_list.$('#grid').jqGrid('getRowData');
			rowData = rowData && rowData.forEach ? rowData :  [];
			var dataObj = {};
			rowData.forEach(function(item){
				var number = item && item.number && !item.deaule ? item.number + _self.options.formUUid : ""
				var formlaField = number && $('#' + number + '.flag-formulaField');
				formlaField && formlaField.length && dataObj[number] ? dataObj[number].push(item) : (dataObj[number] = [item]);
			});
			for(var field in dataObj){
				$('#' + field + '.flag-formulaField').shrPromptFormulaBox('setValue',dataObj[field]);
			};
			_self.options.subFrameColseHandler && _self.options.subFrameColseHandler(param);
		},

        setBlur : function(){
            _self = this;
            _self.element.blur();
        },

        setFocus : function(){
            _self = this;
            _self.element.focus();
        },
        
        setValue:function(value){
            var _self = this;
            $(_self.element).shrPromptBox('setValue',_self._formateDisplayValue(value));
            _self.isMultiValue && this.element.data('data.f7', value || null);
        },
        
        _formateDisplayValue : function(value){
        	var _self = this;
        	var valueTemp = _self._addEntity($.isArray(value) ? value[0] : value);
        	valueTemp && (valueTemp.formulaText = $(valueTemp.content).text());
        	return valueTemp;
        },
        
        _addEntity:function(value){
        	value && ($.isArray(value) ? value : [value]).forEach(function(item){
        		item._entityName || (item._entityName = 'com.kingdee.eas.hr.ats.app.FormulaItem');
        	});
        	return value;
        },
        
        getValue:function(){
        	var _self = this;
            return  _self._addEntity($(_self.element).shrPromptBox('getValue'));
        },

        disable:function(){
            var _self = this;
            $(_self.element).shrPromptBox('disable');
        },

        enable:function(){
           var _self = this;
           $(_self.element).shrPromptBox('enable');
        }
    });
    
    waf.defineCustomeClass("celleditor.promptFormulaBox",celleditor.defaultEditor,{
        createEditor:function(value){
            var self = this;
            if(this.opts.id.indexOf("*")>0){
            	this.opts.id = this.opts.id.substring(0,this.opts.id.indexOf("*")-1);
            }
            var input = _waf2_createInput_("text", this.opts, value);
            
            if (this.opts) {
                var f7Json = this.opts.f7Json;
                var op = _waf2_filterOptions_(this.opts);
                var f7_json = f7Json || {};
                f7_json = $.extend(f7_json, op,{value:f7_json.value || value});
                f7_json.value && f7_json.value.content && (f7_json.value.formulaText = $(f7_json.value.content).text());
                f7_json.id = this.opts.id;
                var beforCreateF7 = this.colModel.beforCreateF7;
                $.isFunction(beforCreateF7) && beforCreateF7.call(this.table,f7_json);
                $(input).shrPromptFormulaBox(f7_json);  
                if (this.opts.validateJson) {
                    this.opts.validateJson.errorShowMode = "float";
                    this.opts.validateJson.validateOnSumbit = true;
                    $(input).wafValidator("loadElemValidator", this.opts.validateJson);
                }
                
                $(input).css("width", "100%");
                var elem = $(input).closest(".ui-promptBox-frame").eq(0);
                $(elem).css("width", this.defaultWidth);
            }
            this.elem = elem;
        },
        getEditor: function() {
        	return $(this.elem).find('input[ctrlrole=promptBox]');
        },
        getValue:function(){
            var $t = this.table;
			var _el_id = this.iRow + "_" + this.nmjq;
			//编辑表格的F7 名称带有.*特殊处理  modify by tiangang_yang 2019/03/14
			if(this.nmjq.lastIndexOf(".*") != -1){
				_el_id = this.iRow + "_" + this.nmjq.replace(".*","");
			}
			if( _el_id ){// jquery id selector can't contain .
				_el_id = _el_id.replace(/\./g,'\\.');
			}
            var v =  $(this.elem).find("#" + _el_id).shrPromptFormulaBox("getValue");
            var v2 = v;
            if(v2==null){v2=undefined;}
            if (v2 === undefined || v2 == "&nbsp;" || v2 == "&#160;" || (v2 instanceof Array && v2.length===0) || (typeof v2==="string" && v2.length === 1 && v2.charCodeAt(0) == 160)) {
                v2 = '';
            }
            return [v,v2];
        },
        clear:function(){
            $(this.elem).find("input").remove();
            $(this.elem).remove();
        }
    });
    
    waf.defineCustomeClass("cellformatter.htmlText", cellformatter.defaultFormatter, {
        format: function (cellval, rwd) {
        	var storeValue = $(this.table).data("storeValue") || {};
            storeValue[this.opts.colModel.name + "-" + this.opts.rowId] = cellval;
            $(this.table).data("storeValue", storeValue);
        	return cellval.content && $(cellval.content).text() || '';
        },
        unformat:function(td,rowId){
        	var ret, val = $(td).text();    //有可能删除了数据
            if (val && val.length > 0) {
                var storeValue = $(this.table).data("storeValue");
                storeValue && (ret = storeValue[this.opts.colModel.name + "-" + this.opts.rowId]);
            } else {
                ret = "";
            }
        	return ret;
        }
    });
    
	shr.extend({getFieldValue: function (fieldName, uuid, context){
		var id = this.getRealId(fieldName, uuid);
		var $element = $('#' + id, context);
		if($element && $element.hasClass('flag-formulaField')){
			return $element.shrPromptFormulaBox('getValue');
		}
		var role = $element.attr('ctrlrole');
		var value = this.getValueByRole(role, $element, id, context,false);
		return value;
	}});
}(jQuery));


//公式字段查看视图显示控制
function formulaFieldDisCustomFormatter(alias,customparam){
	return alias && $(alias).text() || alias;
};


function getCachedFormulaBoxData(){
	var that = this;
	var _formulaBoxData = window._formulaBoxData || parent._formulaBoxData;
	if(!_formulaBoxData){
		shr.remoteCall({
			async:false,
			method:'getFormulaNavInfo',
			param:{uipk:'com.kingdee.eas.hr.ats.app.Formula' || that.getFormulaTpl()},
			success:function(res){
				//console.info(res);
				if(res && res.items){
					res.items = res.items.filter(function(item){
						return item.enable && item.show;
					});
					res.items.splice(0,0,$.extend({show:true,enable:true,fieldName : '过滤条件',field:'filter'},res.items.filter));
				}
				_formulaBoxData = res;
				window._formulaBoxData = _formulaBoxData;
			}
		});
	}
	if(!_formulaBoxData){
		window._formulaBoxData = {items : []}
	}
	return  _formulaBoxData || window._formulaBoxData;
};

