shr.defineClass("shr.ats.FormulaEdit", shr.framework.Edit, {
	ueditor : null,
	TEMPLATE : null,
	unsave : false,
	COLOR : null,
	enableViewNavConfig : false,
	inChildFrame:shr.getUrlRequestParam('inChildFrame')
	,initalizeDOM : function(){
		this.superClass.initalizeDOM.call(this);
		this.inChildFrame && parent && parent.$('#iframe_formula').removeAttr('closedbyok');
		this.ueditor = this.initUE();
		this.viewAdjust();
		this.initNavInfo();
		this.bindKeyboardEve();
		this.registFormatter();
	}
	
	,registFormatter : function(winObj){
		(winObj || window).waf.defineCustomeClass("cellformatter.htmlText", cellformatter.defaultFormatter, {
	        format: function (cellval, rwd) {
	        	var storeValue = $(this.table).data("storeValue") || {};
	        	var colName = this.opts.colModel.name;
	            storeValue[colName + "-" + this.opts.rowId] = rwd[colName];
	            $(this.table).data("storeValue", storeValue);
	            rwd[colName] == null && (rwd[colName] = '');
	        	return colName != 'content' || !rwd[colName] ? rwd[colName] : $(rwd[colName]).text();
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
	}
	
	,initNavInfo : function(){
		var that = this;
		var configData = that.getNavConfig();
		if(parent.formulaNavTreeDatadd){
			return that.rerenderNaviTree(parent.formulaNavTreeData);
		}
		this.remoteCall({
			async:true,
			method:'getFormulaNavInfo',
			param:{navConfig:JSON.stringify(configData)},
			success:function(res){
				res || res.length || console.info(res);
				parent.formulaNavTreeData = res;
				that.rerenderNaviTree(res);
			}
		});
	}
	
	,rerenderNaviTree : function(res){
		var that = this;
		res && res.length && res.sort(function(item1,item2){return item1.index - item2.index});
		res && res.length && res.forEach(function(navItem){
			navData = !navItem  || !navItem.navData ? [] : navItem.type=='formulaFunc' ? JSON.parse(navItem.navData) : navItem.navData;
			navData.length && that.rerenderNav(navItem, navData);
		});
		$('#info-nav').parent().removeAttr('class');
		$('.ztree').css({width: $('#info-nav').width() - 30, overflow: 'hidden', 'text-overflow': 'ellipsis'});
		var width = $('#form').width() - $('#info-nav').width() - 50;
		$('#formulaArea').parent().css({width:width + 'px'});
		$('#ueditor>.edui-editor.edui-default').css({width:width + 'px'});
		$('#ueditor>div>.edui-editor-iframeholder.edui-default').css({width:'calc(100% - 35px)'});
	}
	
	,getNavConfig:function(){
		var that = this;
		var configData = [];
		var childConfig = {};
		var parentConfigType = '';
		var itemInd = 0;
		if(that.inChildFrame && parent && parent.shr.getCurrentViewPage().getNavConfig){
			(parent.shr.getCurrentViewPage().getNavConfig(shr.getUrlRequestParam('field')) || []).forEach(function(item){
				if(item.filter && item.type){
					itemInd = Math.max(itemInd,item.index || 0);
					item.index = itemInd;
					++itemInd;
					childConfig[item.type] = item;
				}
			});
		}
		$(".navConfig.hide").each(function(ind){
			var config = {
				type : $(this).data('type'),
				filter: $(this).text(),
				name: $(this).data('name'),
				index: itemInd + ($(this).data('index') || ind)
			};
			if(config.type){
				if(childConfig[config.type]){
					!childConfig[config.type].name && (childConfig[config.type].name = config.name);
					config = childConfig[config.type];
				}
				configData.push(config);
			}
		})
		return configData;
	}
	
	,getCachedTplInfo : function(){
		return  window._formulaTplInfo || parent._formulaTplInfo;
	}
	
	,rerenderNav : function (navItem,navData){
		var that = this;
		//console.info(navItem);
		//console.info(navData);
		if(navData && navData.length == 1 && navData[0].isLeaf === false){
			navItem.title = navItem.name + "-" + navData[0].name;
			navData = navData[0].children;
		}
		if(navItem.type=="combineModel" && navData && navData.length){
			var tplInfo = that.getCachedTplInfo();
			var itemFields = (tplInfo && tplInfo.items || []).map(function(item){
				return item.field + ',';
			}).join('');
			navData = !itemFields ? navData : navData.filter(function(item){
				return itemFields.indexOf(item.field) > -1;
			});
		}
		var treeSetting = navItem.type=='formulaFunc' ? {data : {simpleData : {enable : true,pIdKey:'ftype'}}} : {};
		treeSetting.callback = {
			onDblClick : function(event, treeId, treeNode){
				treeNode && !treeNode.isParent && that.clickTreeNodeHandler($(event.target).parents('.ztree').attr('type'), treeNode)
			},
			onNodeCreated : function(event, treeId, treeNode){that.treeNodeCreatedHandler(event, treeId, treeNode)}
		}
		$('.btn-tab-div').append(juicer(this.getFormulaTml('treeTab'),navItem));
		$('.sidebar-tree').append(juicer(this.getFormulaTml('tree'),navItem));
		$.fn.zTree.init($("#tree_" + navItem.index), treeSetting, navData);
		that.bindTreeEvent();
		$('.btn-tab-div div').eq(0).click();
	}
	
	,formulaHoverEve:function(jqEle,ismouseLeave){
		if(!jqEle || ismouseLeave){
			jqEle && jqEle.removeAttr('title');
			return;
		}
		var that = this;
		var formulatype = jqEle.attr('formulatype');
		var title = jqEle.text();
		if(formulatype == 'formulaFunc'){
			var treeNode = that.getTreeNode(jqEle.attr('value'));
			title = treeNode && treeNode.description || title;
		}else if(formulatype == 'scheme' || formulatype == 'combineModel'){
			var treeNode = that.getTreeNode(jqEle.attr('id'));
			title = treeNode ? treeNode.queryConfigName + '.' + treeNode.name : '';
		}
		jqEle.attr('title',title);
	}
	
	
	,getTreeNode : function(nodeId,nodeParentId,treeId){
		var treeObj = treeId == null ? null : $.fn.zTree.getZTreeObj(treeId);
		var node = treeObj == null ? null : treeObj.getNodeByParam("id", nodeId, nodeParentId);
		if(node != null){
			return node;
		}
		var treeObjArr = [];
		$('ul.ztree[id^=tree_]').each(function(index){
			if(node == null){
				var treeObj =  $.fn.zTree.getZTreeObj($(this).attr('id'));
				if(treeObj != null){
					node = treeObj.getNodeByParam("id", nodeId, nodeParentId);
				}
			}
		});
		return node;
	}
	
	,clickTreeNodeHandler : function (type, treeNode){
		var that = this;
		treeNode.color = that.getColor(type);
		if(type == 'combineModel'){
			var curModel = that.getSettedCombineModel();
			if(curModel.length > 0 && curModel[0] != treeNode.field){
				shr.showWarning({hideAfter: 3,message: "公式中已经存在模型字段!"});
				return;
			}
			$('#name').shrMultiLangBox('setValue',{l2:treeNode.queryConfigName + '.' + treeNode.name});
			$('#number').shrTextField('disable').shrTextField('setValue',treeNode.field);
			
		}
		that.writeToFormula(juicer(that.getFormulaTml(type),treeNode));
		['span[formulatype=scheme]','span[formulatype=formulaFunc]','span[formulatype=combineModel]'].forEach(function(item){
			$('#formulaContent iframe').contents().find(item).off().on('mouseenter',function(){
				that.formulaHoverEve($(this));
			}).on('mouseleave',function(){
				that.formulaHoverEve($(this),true);
			});
		});
	}
	
	,getSettedCombineModel:function(){
		var that = this;
		var reg = /\(combineModel:setFieldVal\)\(model,"[\w]*","([\.\d\w_\$]+)"\)/g;
		var script = that.getFormulaScript();
		var regResult = reg.exec(script);
		var model = [];
    	while (regResult) {
    		model.push(regResult[1]);
    		regResult = reg.exec(script);
		}
		return model;
	}
	
	
	,getColor:function(colorSeries,colorInd){
		if(!this.COLOR){
			this.COLOR = {
				scheme:   {usedCount:0,color:['255,192,203','255,0,255','218,112,214','255,105,180']},//red
				bracked:{usedCount:0,color:['250,240,230','255,239,213','255,218,185','255,228,181']},//orange
				formulaFunc: {usedCount:0,color:['152,251,152','0,255,127','50,205,50','154,205,50','60,179,113']},//green
				midBracked:  {usedCount:0,color:['30,144,255','16,78,139','99,184,255','72,118,255','126,192,238']},//blue
				combineModel:{usedCount:0,color:['255,0,0']}//
			};
		}
		colorSeries = colorSeries || 'scheme';
		var series = this.COLOR[colorSeries];
		if(!colorInd && colorInd != 0){
			series.usedCount += 1;
			series.usedCount = series.usedCount >= series.color.length ? 0 : series.usedCount;
			colorInd = series.usedCount;
		}
		return 'rgb(' + series.color[colorInd] + ')';
	}
	,treeNodeCreatedHandler : function (event, treeId, treeNode){
		var that = this;
		if(!treeNode || treeNode.isParent || !treeNode.returnType || !treeNode.returnType.isenum){
			return;
		}
		var params = treeNode.params ? treeNode.params.split(",") : [];
		for ( var i = 0; i < params.length; i++) {
			params[i] = params[i].trim() == "String" ? '"字符型参数值"' : '数值型参数值';
		}
		treeNode.params = params;
		
	}
	
	,initUE : function (){
		try{
			var ueEditorConfig = JSON.parse($('#ueditor').attr('config').replace(/'/g,'"'));
		}catch(e){
			shr.showError({hideAfter: 3,message: "UE在视图中的配置错误,请在视图中修改ueditor元素的config的属性值"});
		}
		return UE.getEditor("ueditor",ueEditorConfig);
	}
	
	,viewAdjust:function(){
		var that = this;
		$('#formulaKeyboard [data-ctrlrole=labelContainer]').unwrap();
		if(that.inChildFrame){
			$('#workAreaDiv').css("margin-top","-8px");
			var frameTitle = parent.$('.ui-dialog-titlebar').hide();
			$('.shr-toolbar').css('padding-left','250px').parent().append(frameTitle.clone(true).show());
			$('.view_manager_body').css("margin-top", "48px");
		}
		setTimeout(function(){
			that.initListTable();
			//this.fields在initalizeDOM后面执行才有效
			that.inChildFrame && that.initModelByParentFrame(frameTitle.children(':first').text());
		},100);
		$('#recommendIcon,#recommendPane').hover(function(){
			$(this).css('cusor','hand');
			$('#recommendPane').show();
		},function(){
			$('#recommendPane').hide();
		});
		that.initRecommend();
	}
	
	,initRecommend:function(){
		var that = this;
		var testData = '<p><span value="if" style="color:rgb(138,43,226)"> 如果 </span><span style="color:rgb(255,218,185)">(<span style="color:black">&nbsp;<span value="(formulaFunc:getFormulaFun)(&quot;XtOg5DJMSNSXReIzmWAu0CQBOWg=&quot;)" formulatype="formulaFunc" contenteditable="false" style="color:rgb(50,205,50)">取子字符串</span><span style="color:rgb(50,205,50)">( <span value="(scheme:getFieldVal)(&quot;fileAdmin.longNumber&quot;)" id="4i4AAAAiTWlYdf4b" contenteditable="false" formulatype="scheme" style="color:rgb(255,0,255)">长编码</span>&nbsp;<span style="color:black"></span>&nbsp;<span style="color:black">,</span>&nbsp;<span style="color:black"> 1</span>&nbsp;<span style="color:black">,</span>&nbsp;<span style="color:black"> 3</span>&nbsp; )&nbsp;&nbsp;<span value="equal" contenteditable="false" formulatype="logicFun" title="" style="color:false;"> == </span>&nbsp;<span value="(scheme:getFieldVal)(&quot;holidayType.number&quot;)" id="4i4AAAAiTUNYdf4b" contenteditable="false" formulatype="scheme" style="color:rgb(218,112,214)">编码</span>&nbsp;<span value=" || " contenteditable="false" formulatype="flowCtrl" title="" style="color:rgb(138,43,226);"> 或者 </span>&nbsp;&nbsp;<span value="(scheme:getFieldVal)(&quot;holidayType.simpleName&quot;)" id="4i4AAAAiTURYdf4b" contenteditable="false" formulatype="scheme" style="color:rgb(255,105,180)">简称</span>&nbsp;<span value="equal" contenteditable="false" formulatype="logicFun" title="" style="color:false;"> == </span>&nbsp;&nbsp;<span value="(formulaFunc:getFormulaFun)(&quot;XtOg5DJMSNSXReIzmWAu0CQBOWg=&quot;)" formulatype="formulaFunc" contenteditable="false" style="color:rgb(154,205,50)">取子字符串</span><span style="color:rgb(154,205,50)">( &nbsp;<span style="color:black"><span value="(scheme:getFieldVal)(&quot;fileAdmin.simpleName&quot;)" id="4i4AAAAiTW1Ydf4b" contenteditable="false" formulatype="scheme" style="color:rgb(255,192,203)">简称</span>&nbsp;</span>&nbsp;<span style="color:black">,</span>&nbsp;<span style="color:black"> 1</span>&nbsp;<span style="color:black">,</span>&nbsp;<span style="color:black">&nbsp;2</span>&nbsp;)&nbsp;&nbsp;</span>&nbsp;&nbsp;</span>&nbsp;&nbsp;</span>)</span><span formulatype="ignore" style="color:rgb(138,43,226)"> 那么 </span><span style="color:rgb(99,184,255)">{<span style="color:black"><br>&nbsp;&nbsp;&nbsp;&nbsp;<span value="(combineModel:setFieldVal)(&quot;delayDate&quot;)" id="delayDate" contenteditable="false" formulatype="combineModel" style="color:rgb(255,0,0)">[延期至日期]</span>&nbsp;<span value="=" contenteditable="true" formulatype="" title="" style="color:false;">=</span>&nbsp;&nbsp;<span value="(scheme:getFieldVal)(&quot;perOther.jobStartDate&quot;)" id="4i4AAAAiTZZYdf4b" contenteditable="false" formulatype="scheme" style="color:rgb(255,0,255)">参加工作日期</span>&nbsp;</span></span></p><p><span style="color:rgb(99,184,255)">}</span>&nbsp;&nbsp;<span value="else" if="" style="color:rgb(138,43,226)"> 再滤 </span><span style="color:rgb(255,228,181)">(<span style="color:black">&nbsp;<span value="(formulaFunc:getFormulaFun)(&quot;icHLQdWTQSqBJ+32hLl0GCQBOWg=&quot;)" formulatype="formulaFunc" contenteditable="false" style="color:rgb(60,179,113)">取字符串长度</span><span style="color:rgb(60,179,113)">( &nbsp;<span style="color:black"> "字符型参数值"</span>&nbsp; )&nbsp;&nbsp;</span>&nbsp;<span value="equal" contenteditable="false" formulatype="logicFun" title="" style="color:false;"> == </span>&nbsp; 3&nbsp;</span>)</span><span formulatype="ignore" style="color:rgb(138,43,226)"> 那么 </span><span style="color:rgb(72,118,255)">{<span style="color:black"><br>&nbsp;&nbsp;&nbsp;&nbsp;<span value="(combineModel:setFieldVal)(&quot;delayDate&quot;)" id="delayDate" contenteditable="false" formulatype="combineModel" style="color:rgb(255,0,0)">[延期至日期]</span>&nbsp;<span value="=" contenteditable="true" formulatype="" title="" style="color:false;">=</span>&nbsp;&nbsp;<span value="(scheme:getFieldVal)(&quot;pPosition.joinDate&quot;)" id="4i4AAAAiTXlYdf4b" contenteditable="false" formulatype="scheme" style="color:rgb(218,112,214)">入司日期</span>&nbsp;</span></span></p><p><span style="color:rgb(72,118,255)">}</span>&nbsp;&nbsp;</p>';
		var model = {items : [
			{name:"测试公式",formulaText:"级次 =5f",content:'<p><span value="fileAdmin.level" id="4i4AAAAiTWpYdf4b" contenteditable="false" formulatype="scheme" style="color:rgb(255,0,255)">级次</span>&nbsp;=5f</p>'},
			{name:"测试公式今天的的艰苦奋斗",formulaText:$(testData).text(),content : testData}]};
		$('#recommendPane').empty().append(juicer(that.getFormulaTml('recommend'),model));
		$('#recommendPane ul li').hover(function(){
			$(this).css({'text-decoration': 'underline', cursor: 'pointer',color:'#388cff'});
		},function(){
			$(this).css({cursor: 'hand','text-decoration': 'none',color:'black'});
		}).dblclick(function(){
			UE.getEditor('ueditor').setContent($(this).find('p').html());
		});
	}
	
	,initModelByParentFrame : function(frameTitle){
		var that = this;
		var field = shr.getUrlRequestParam('field');
		var formUUid = shr.getUrlRequestParam('formUUid');
		var curSetting = parent && parent.$("#" + field + formUUid).shrPromptBox("getValue") || {};
		var lan = shr.getFieldLangByContext();
		curSetting.name = curSetting.name || {};
		!curSetting.name[lan] && (curSetting.name[lan] = frameTitle || '');
		!curSetting.number && (curSetting.number = field);
		$('#number').shrTextField('disable');
		that.rerenderModel(curSetting,true);
	}
	
	,rerenderModel:function(model,ignoreNull){
		var that = this;
		(that.fields || []).forEach(function(item){
			if(ignoreNull && model[item] == null){
				return;
			}
			var $element = $('#formulaArea #' + item)
			var ctrlrole = $element.attr('ctrlrole');
			if(ctrlrole){
				var componentName = shr.getComponentNameByCtrlrole(ctrlrole);
				$element[componentName]('setValue',model[item]);
			}else{
				$element[$element[0].tagName == "INPUT" ? "val" : "text"](model[item]);
			}
		});
	}
	
	,setOKAction : function(){
		this.tmlSaveAction();
		$('.ui-dialog-titlebar>button>.ui-icon-closethick').click();
	}
	
	,saveAction:function(){
		var that = this;
		that.tmlSaveAction();
	}
	
	,tmlSaveAction:function(){
		var that = this;
		var model = that.assembleModel();
		var id = that._createRowID(model);
		formula_list.$('#grid').jqGrid('delRowData',id);
		formula_list.$('#grid').jqGrid('addRowData',id,model,'first');
		that.clearAction();
	},
	
	_createRowID : function(model){
		return model.id || model.id == 0 ? model.id : new Date().toJSON();
	}
	
	,clearAction:function(){
		var that = this;
		that.unSave = false;
		that.ueditor.setContent("");
		that.rerenderModel({});
		$('#number').shrTextField('enable').shrTextField('setValue','');
	}
	
	,addVariable:function(){
		var that = this;
		var model = {name:'test',number:'test'};
		var id = that._createRowID(model);
		formula_var.$('#grid').jqGrid('delRowData',id);
		formula_var.$('#grid').jqGrid('addRowData',that._createRowID(model),model,'first');
	}
	
	//异步加快页面响应
	,initListTable:function(){
		var that = this;
		$('#formula_list').attr('src','/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.FormulaItem.list');
		$('#formula_var').attr('src','/shr/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.FormulaVarDef.list');
		var uiObject = that.inChildFrame && parent && parent.shr.getCurrentViewPage('');
		var field = shr.getUrlRequestParam('field');
		var formUUid = shr.getUrlRequestParam('formUUid');
		var cacheData= [];
		parent.$('.flag-formulaField').each(function(){
			var fieldVal = parent.$(this).shrPromptBox('getValue') || {};
			if(!!fieldVal && !fieldVal.number){
				var id = parent.$(this).attr('id') || '';
				fieldVal.number = id.substring(0,id.length - formUUid.length)
			}
			!!fieldVal && !!fieldVal.content && cacheData.push(fieldVal);
		});
		uiObject && $('#formula_list').on('load',function(){
			that.registFormatter(formula_list);
			formula_list.$(function(){
				var viewPage = formula_list.shr.getCurrentViewPage('');
				viewPage.gridLoadComplete = function(ret) {
					viewPage.superClass.gridLoadComplete && viewPage.superClass.gridLoadComplete.call(ret);
					formula_list.$('#grid').jqGrid('clearGridData');
					cacheData.forEach(function(item){
						var itemTemp = $.isArray(item) ? item : [item];
						itemTemp.forEach(function(subItem){
							formula_list.$('#grid').jqGrid('addRowData',subItem.id,subItem);
							subItem.number == field && UE.getEditor('ueditor').setContent($(subItem.content).html());
						});
					});
				};
			
			});
		})
		
	}
	
	,bindKeyboardEve:function(){
		var that = this;
		$('#formulaKeyboard input[type=button]').click(function(e){
			var model = {
				name : $(this).val(),
				title : $(this).data("title"),
				color : $(this).data("color"),
				value : $(this).data("value"),
				formulatype : $(this).attr('formulatype')
			};
			model.addSpace = model.formulatype;
			model.edit = model.formulatype == null || model.value == '""';
			model.color = model.formulatype == 'flowCtrl' && ( model.color || 'rgb(138,43,226)');
			if(model.value == 'if' || model.value == 'else if' || model.value == 'else'){
				model.brackedColor = that.getColor('bracked');
				model.midBrackedColor = that.getColor('midBracked');
			}
			if(model.value == 'if' || model.value == 'else if'){
				model = juicer(that.getFormulaTml('elseIf'),model);
			}else if(model.value == 'else'){
				model = juicer(that.getFormulaTml('else'),model);
			}else if(model.name == '( )'){
				model.brackedColor = that.getColor('bracked');
				model = juicer(that.getFormulaTml('bracked'),model);
			}else if(model.name == '""'){
				delete model.color;
			}else if('scheme,formulaFunc,combineModel'.indexOf(model.formulatype) > -1){
				that.clickTreeNodeHandler(model.formulatype,that.getTreeNode(model.value));
				return;
			}
			that.writeToFormula(model);
		});
	}
	
	,getFormulaTml:function(type){
		if(!this.TEMPLATE){
			this.TEMPLATE = {
				tree:'<ul id="tree_${index}" type="${type}" class="ztree"></ul>',
				treeTab:'<div id="tab_${index}" type="${type}" title="${title}" style="padding:2px 10px !important" class="btn-tab shrbtn btn-tab-current">${name}</div>',
				scheme:'<span value="(scheme:getFieldVal)(model,&quot;${dataType}&quot;,&quot;${field}&quot;)" id="${id}" contenteditable="false" formulatype="scheme" style="color:${color}">${name}</span>&nbsp;',
				combineModel:'<span value="(combineModel:setFieldVal)(model,&quot;${dataType}&quot;,&quot;${field}&quot;)" id="${id}" contenteditable="false" formulatype="combineModel" style="color:${color}">[${name}]</span>&nbsp;',
				bracked:'<span contenteditable="false" style="color:${color}">( <span style="black">&nbsp;&nbsp;&nbsp;&nbsp;</span> )</span> &nbsp;&nbsp;',
				tml: '<span value="${value}" contenteditable="${edit}" formulatype="${formulatype}" title="${title}" style="color:${color};">${name}</span>&nbsp;&nbsp;'
			};
			var elseTml = [];
				elseTml.push('<span>style="color:${color}" value="${value}"> ${name} </span>');
				elseTml.push('<span style="color:${midBrackedColor}">{</span>');
				elseTml.push('<span><br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<br></span>');
				elseTml.push('<span style="color:${midBrackedColor}">}</span>&nbsp;&nbsp;');
				this.TEMPLATE.elseTml = elseTml.join('');
			var elseIf = [];
				elseIf.push('<span value="${value}" style="color:${color}"> ${name} </span>');
				elseIf.push('<span style="color:${brackedColor}">(<span style="color:black">&nbsp;&nbsp;</span>)</span>');
				elseIf.push('<span formulatype="ignore" style="color:${color}"> 那么 </span>');
				elseIf.push('<span style="color:${midBrackedColor}">{');
				elseIf.push('<span style="color:black"><br>&nbsp;&nbsp;&nbsp;&nbsp;<br></span>}</span>&nbsp;&nbsp;');
				this.TEMPLATE.elseIf = elseIf.join('');
			var recommend = [];
				recommend.push('<ul style="padding:5px 0">');
				recommend.push('{@each items as item , index}');
				recommend.push('<li style="text-align:center;margin:8px;" title="${item.formulaText}" >${item.name}<div class="hide">$${item.content}</div></li>')
				recommend.push('{@/each}</ul>');
				this.TEMPLATE.recommend =  recommend.join('');
			var formulaFunc = [];
				formulaFunc.push('<span>');
				formulaFunc.push('<span value="(formulaFunc:getFormulaFun)(&quot;${id}&quot;)" formulatype="formulaFunc" contenteditable="false" style="color:${color}">');
				formulaFunc.push('${name}');
				formulaFunc.push('</span>');
				formulaFunc.push('<span style="color:${color}">( ');
				formulaFunc.push('{@each params as item , index}');
				formulaFunc.push('{@if index>0}<span style="color:black">,</span>{@/if}&nbsp;');
				formulaFunc.push('<span style="color:black"> ${item}</span>&nbsp;');
				formulaFunc.push('{@/each} ');
				formulaFunc.push(')&nbsp;&nbsp;</span>');
				formulaFunc.push('</span>&nbsp;');
				this.TEMPLATE.formulaFunc = formulaFunc.join('')
		}
		return this.TEMPLATE[type] || this.TEMPLATE['tml'];
	}
	
	,bindTreeEvent:function(){
		var that = this;
		$('.btn-tab-div>div').click(function(){
			$('.btn-tab-div>div').removeClass('btn-tab-current');
			$(this).addClass('btn-tab-current');
			$('.sidebar-tree ul').hide();
			$('.sidebar-tree ul[id=tree_' + $(this).attr('id').substr(4) + ']').show();
		})
	}
	
	,assembleModel:function(){
		var that = this;
		var uiObject = shr.getCurrentViewPage('');
		//id 平台值多个问题 shr.assembleModel()
		var model = {};
		(that.fields || []).forEach(function(fieldName){
			value = shr.getFieldValue(fieldName, null,$('#formulaArea'));
			shr.setModelFieldValue(model, fieldName, value);
		});
		model = $.extend(model,{
			field:shr.getUrlRequestParam('field'),
			scheme : shr.getUrlRequestParam('scheme'),
			content : uiObject.getFormulaHtml(),
			formulaText : uiObject.getFormulaText(),
			script : uiObject.getFormulaScript()
		});
		return model;
	}
	
	,getMatchId : function(){
		this.matchId = this.matchId || 0;
		return this.matchId++;
	}
	
	/**
	 * 合成一个p标签，因为出入的时候UE只能插入一个p标签
	 * @return {}
	 */
	,getFormulaHtml:function(){
		var that = this;
		var formulaHtml = UE.getEditor('ueditor').getHtml();
		var allHtml = [];
		$(formulaHtml).each(function(item){
			allHtml.push($(this).html());
		});
		return '<p>' + allHtml.join('</br>') + '</p>'
	}
	
	,getFormulaText : function(){
		return $(this.getFormulaHtml).text();
	}
	
	,getFormulaScript : function(ele){
		var that = this;
		var rootOperation = !ele;
		ele = ele || $(that.getFormulaHtml());
		if(!ele || !ele.length){
			return;
		}
		for(var i = 0;i < ele.length;i++){
			that.replaceFormulaEle(ele[i]);
		}
		var formula = [];
		for(var i = 0; i < ele.length;i++){
			formula.push(ele[i].innerText);
		}
		var formula = formula.join('\r\n') + "\r\n";
		if(rootOperation){
		    formula = that.processLogicFun(formula);
		    formula = that.setFieldValProcess(formula);
		}
		return formula;
	}
	
	,checkAction: function(){
		console.info(this.getFormulaScript());
	}
	
	,replaceFormulaEle:function(ele){
		if(!ele){
			return;
		}
		if(ele instanceof Text && ele.childNodes.length == 0){
			var textContent = ele.nodeValue
			textContent && (textContent = textContent.trim());
			ele.nodeValue= textContent;
			return;
		}
		if(!(ele.childNodes.length == 1 && ele instanceof HTMLSpanElement && ele.childNodes[0] instanceof Text)){
			return this.getFormulaScript(ele.childNodes);
		}
		var textContent = $(ele).attr('value') || ele.innerText;
		var formulatype = $(ele).attr('formulatype');
		if(formulatype && 'logicFun'.indexOf(formulatype) > -1){
			textContent = '(' + formulatype + ':' + textContent +')';
		}
		if(formulatype == 'ignore'){
			textContent='';
		}
		if(ele instanceof HTMLBRElement){
			textContent ='\r\n';
		}
		textContent && (textContent = textContent.trim());
		ele.childNodes[0].nodeValue= textContent;
	}
	
 	,processLogicFun : function(str) {
 		if(str == null){
 			return '';
 		}
    	//str = str.replace(/([^\{\(\)\]])\s*\n/g, ";$1\r\n");
    	var reg = /\(logicFun:(equal|notEqual|bigEqual|bigThan|lessThan|lessEqual)\)/g;
    	//console.info(str);
    	var regResult = reg.exec(str);
    	while (regResult) {
    		var group = regResult[0];
    		var start = regResult.index;
    		var end = start + group.length - 1 //匹配目标结束位置;
    		var allStart = this.grammaAnalys(str,start,-1);
    		var allend = this.grammaAnalys(str,end,1);
    		str = str.substring(0,allStart) + group + "(FormulaExecutorUtile.convertToObj("
    		+ str.substring(allStart, start) + "),FormulaExecutorUtile.convertToObj(" + str.substring(end + 1,allend + 1 ) + "))" + str.substring(allend + 1);
    		regResult = reg.exec(str);
		}
    	//console.info(str);
    	return str.replace(reg,'FormulaExecutorUtile.$1');
    }
	,grammaAnalys : function(matchStr,findInd,preOreNext) {
		var leftMatchs = {'(':')','"': '"','{': '}'};
    	var rightMatchs = {')': '(','"':'"','}': '{'};
    	var endSearch = ['&','|',preOreNext < 0 ? "(" : ")"].join('');
    	var firstMap = preOreNext < 0 ? rightMatchs : leftMatchs;
    	var matchMap = preOreNext < 0 ? leftMatchs : rightMatchs;
    	var matchList = [];
    	var trim = true;
    	var len = matchStr.length;
		while(findInd > 0 && findInd < len - 1) {
			findInd = preOreNext + findInd;
			var cur = matchStr.charAt(findInd);
			if(trim && cur.trim().length == 0) {
				continue;
			}
			trim = false;
			if(matchList[matchList.length - 1] === '"' && cur !== '"'){
				continue;
			}
			if(findInd > 0 && cur === '"' && matchStr.charAt(findInd - 1) ==='\\') {
				findInd = preOreNext > 0 ? findInd : findInd - 1;
				continue;
			}
			if(matchList.length > 0 && matchList[matchList.length - 1] === matchMap[cur]) {
				matchList.splice(matchList.length - 1);
			}else if(firstMap[cur]) {
				matchList.push(cur);
			}
			var next = this.getNextNonStr(matchStr, findInd, preOreNext);
			if(next == null || matchList.length == 0 && endSearch.indexOf(next) > -1) {
				break;
			}
		}
		return findInd;
	}
	
	,getNextNonStr : function(matchStr,findInd,preOreNext) {
		if(preOreNext > 0) {
			var restStr = matchStr.substring(findInd + 1).trim();
			return restStr.length > 0 ? restStr.substring(0,1) : null;
		}else {
			var restStr = matchStr.substring(0,findInd).trim();
			return restStr.length > 0 ? restStr.substring(restStr.length - 1) : null;
		}
	}
	
	,setFieldValProcess : function(str){
		if(str == null){
 			return '';
 		}
    	var reg = /\(combineModel:setFieldVal\)\((model,"[\w]*","[\.\d\w_\$]+")\)\s*(=|==)\s*([^;]+);/g;
    	return str.replace(reg,'FormulaExecutorUtile.setFieldVal($1,$3);');
	}
	
	,getNaboTextNode:function(ele,preOrNext){
		var targetNode = ele ? ele[ preOrNext >= 0 ? 'nextSibling' : 'previousSibling'] : null;
		if(!targetNode){
			return null;
		}
		var nodeValue =  targetNode ? targetNode[targetNode instanceof Text ? 'nodeValue' : 'innerText'] : null;
		if(nodeValue == null || (nodeValue + '').trim().length == 0){
			return this.getNaboTextNode(targetNode,preOrNext);
		}
		this.replaceFormulaEle(targetNode);
		if(targetNode instanceof Text){
			return targetNode;
		}
		var newTextNode = document.createTextNode('');
		targetNode[preOrNext < 0 ? 'insertBefore' : 'appendChild'](newTextNode,targetNode.firstChild);
		return newTextNode;
	}
	
	,writeToFormula : function(model){
		this.unsave = true;
		if(toString.call(model) !== '[object Object]'){
			this.ueditor.execCommand('insertHtml' , model);
			return;
		}
		model.addSpace && (model.name = " " + model.name + " " );
		this.ueditor.execCommand('insertHtml' , juicer(this.getFormulaTml(),model));
	}
})