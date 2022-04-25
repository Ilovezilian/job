var colors = {DEFAULT: "black", ITEM: "red", PROP: "blue", LOGIC: "green", FUNC: "#04B4AE"};
var ue, ue_items, ue_ci, ue_cp, ue_cf = [];
var ue_tableConfig = [];
var _formulaType = 1,ATTENDANCEPROJIECT = jsBizMultLan.atsManager_calFormula_i18n_33,
	HOLIDAYLIMITPROJECT = jsBizMultLan.atsManager_calFormula_i18n_31;
	
var ATSPROJECT = "AttendanceProject";

shr.defineClass("shr.ats.CalFormula", shr.framework.Core, {
	formulaId : '',
	funcDatas : null,
	varDatas : null,
	tempDatas : null,
	initTab : false,
	unsave : false,
	maxSn : 1,
	canEdit : 0, // 0 未判断，1可以编辑，2不能编辑
	execPersonId : null,
	hasCalPerson : true,
	initalizeDOM : function(){
		$("#downLoadGuide").addClass("btn-link")
		var clz = this, $con = $("#container"), calSchemeId = shr.getUrlRequestParam("billId");
		shr.ats.CalFormula.superClass.initalizeDOM.call(this);
		$("#downLoadGuide").attr("style","position: absolute;right: 45px;");
		document.getElementById("downLoadGuide").innerHTML='<i class="icon-paper-clip" style="font-size: 18px;color: #5daff7;margin-right: 10px;"></i>'
			+ jsBizMultLan.atsManager_calFormula_i18n_18;
		//获取设置公式类型 同步
		this.getFormulaType();
		var html = [];
		html.push("<div id='formula-container' class='row-fluid'>");
		html.push("<div id='sidebar' class='span2'>");
		html.push("<div class='btn-tab-div'>");
		html.push("<button onclick='selectTab(1, $(this));' style='padding:2px 10px !important' class='btn-tab shrbtn btn-tab-current'>"
			+ jsBizMultLan.atsManager_calFormula_i18n_64
			+ "</button>");
		html.push("<button onclick='selectTab(2, $(this));' style='padding:2px 10px !important' class='btn-tab shrbtn'>"
			+ jsBizMultLan.atsManager_calFormula_i18n_25
			+ "</button>");
		html.push("</div>");
		html.push("<div class='sidebar-tree'>");
		html.push("<ul id='itemTree' class='ztree'></ul>");
		html.push("<ul id='funcTree' class='ztree' style='display:none'></ul>");
		html.push("</div></div>");
		html.push("<div id='sideArea'></div>");
		html.push("<div id='editArea' class='span9'>");
		html.push("<div class='row-fluid'>");
		html.push("<span class='span6'><span>"
			+ jsBizMultLan.atsManager_calFormula_i18n_15
			+ "</span><input id='name' type='text' class='input-height required' style='margin-left: 20px!important;' /></span>");
		html.push("<span class='span3'><span>"
			+ jsBizMultLan.atsManager_calFormula_i18n_72
			+ "</span><input id='sortSn' type='text' class='input-height required' style='width: 30px;margin-left: 20px!important;' /></span>");
		html.push("<span class='span3' style='text-align: right;'><span>"
			+ jsBizMultLan.atsManager_calFormula_i18n_9
			+ "</span><input id='isCal' type='checkbox' checked='checked' style='margin-left: 20px;margin-bottom: 8px;' /></span>");
		html.push("</div>");
		html.push("<div class='formula-area'><div id='editor' style='width: 100%;height: 200px;'></div></div>");
		html.push('<div class="row-fluid" style="padding: 20px 0;">');
		html.push('<div class="span8">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="1" onclick="insertAtCaret(\'1\');" ID="Button1" NAME="Button1" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="2" onclick="insertAtCaret(\'2\');" ID="Button2" NAME="Button2" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="3" onclick="insertAtCaret(\'3\');" ID="Button3" NAME="Button3" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="+" onclick="insertAtCaret(\'+\', null, true);" ID="Button4" NAME="Button4" style="margin: 1px 20px 1px 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="=" onclick="insertAtCaret(\'=\', null, true);" ID="Button5" NAME="Button5" style="margin: 1px;">');
		html.push('<INPUT class="twochar-btn shrbtn shrbtn-primary" type="button" value="<>" onclick="insertAtCaret(\'<>\', null, true);" ID="Button6" NAME="Button6" style="margin: 1px 20px 1px 1px;">');
		html.push('<INPUT class="text-btn shrbtn shrbtn-primary" type="button" value="'
			+ jsBizMultLan.atsManager_calFormula_i18n_56
			+ '" onclick="insertAtCaret(\''
			+ jsBizMultLan.atsManager_calFormula_i18n_56
			+ '\', colors.LOGIC, true);" ID="Button7" NAME="Button7" style="margin: 1px;width:auto;">');
		html.push('<INPUT class="text-btn shrbtn shrbtn-primary" type="button" value="'
			+ jsBizMultLan.atsManager_calFormula_i18n_43
			+ '" onclick="insertAtCaret(\''
			+ jsBizMultLan.atsManager_calFormula_i18n_43
			+ '\', colors.LOGIC, true);" ID="Button8" NAME="Button8" style="margin: 1px;width:auto;">');
		html.push('<br>');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="4" onclick="insertAtCaret(\'4\');" ID="Button9" NAME="Button9" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="5" onclick="insertAtCaret(\'5\');" ID="Button10" NAME="Button10" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="6" onclick="insertAtCaret(\'6\');" ID="Button11" NAME="Button11" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="-" onclick="insertAtCaret(\'-\', null, true);" ID="Button12" NAME="Button12" style="margin: 1px 20px 1px 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="<" onclick="insertAtCaret(\'<\', null, true);" ID="Button13" NAME="Button13" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value=">" onclick="insertAtCaret(\'>\', null, true);" ID="Button14" NAME="Button14" style="margin: 1px 20px 1px 1px;">');
		html.push('<INPUT class="text-btn shrbtn shrbtn-primary" type="button" value="'
			+ jsBizMultLan.atsManager_calFormula_i18n_68
			+ '" onclick="insertAtCaret(\''
			+ jsBizMultLan.atsManager_calFormula_i18n_68
			+ '\', colors.LOGIC, true);" ID="Button15" NAME="Button15" style="margin: 1px;width:auto;">');
		html.push('<INPUT class="text-btn shrbtn shrbtn-primary" type="button" value="'
			+ jsBizMultLan.atsManager_calFormula_i18n_47
			+ '" onclick="insertAtCaret(\''
			+ jsBizMultLan.atsManager_calFormula_i18n_47
			+ '\', colors.LOGIC, true);" ID="Button16" NAME="Button16" style="margin: 1px;width:auto;">');
		html.push('<br>');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="7" onclick="insertAtCaret(\'7\');" ID="Button17" NAME="Button17" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="8" onclick="insertAtCaret(\'8\');" ID="Button18" NAME="Button18" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="9" onclick="insertAtCaret(\'9\');" ID="Button19" NAME="Button19" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="*" onclick="insertAtCaret(\'*\', null, true);" ID="Button20" NAME="Button20" style="margin: 1px 20px 1px 1px;">');
		html.push('<INPUT class="twochar-btn shrbtn shrbtn-primary" type="button" value="<=" onclick="insertAtCaret(\'<=\', null, true);" ID="Button21" NAME="Button21" style="margin: 1px;">');
		html.push('<INPUT class="twochar-btn shrbtn shrbtn-primary" type="button" value=">=" onclick="insertAtCaret(\'>=\', null, true);" ID="Button22" NAME="Button22" style="margin: 1px 20px 1px 1px;">');
		html.push('<INPUT class="text-btn shrbtn shrbtn-primary" type="button" value="'
			+ jsBizMultLan.atsManager_calFormula_i18n_7
			+ '" onclick="insertAtCaret(\''
			+ jsBizMultLan.atsManager_calFormula_i18n_7
			+ '\', colors.LOGIC, true);" ID="Button23" NAME="Button23" style="margin: 1px;width:auto;">');
		html.push('<INPUT class="text-btn shrbtn shrbtn-primary" type="button" value="'
			+ jsBizMultLan.atsManager_calFormula_i18n_28
			+ '" onclick="insertAtCaret(\''
			+ jsBizMultLan.atsManager_calFormula_i18n_28
			+ '\', colors.LOGIC, true);" ID="Button24" NAME="Button24" style="margin: 1px;width:auto;">');
		html.push('<br>');
		html.push('<INPUT class="zero-btn shrbtn shrbtn-primary" type="button" value="0" onclick="insertAtCaret(\'0\');" ID="Button25" NAME="Button25" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="." onclick="insertAtCaret(\'.\');" ID="Button26" NAME="Button26" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="/" onclick="insertAtCaret(\'/\', null, true);" ID="Button27" NAME="Button27" style="margin: 1px 20px 1px 1px;min-width: 38px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value="(" onclick="insertAtCaret(\'(\');" ID="Button28" NAME="Button28" style="margin: 1px;">');
		html.push('<INPUT class="number-btn shrbtn shrbtn-primary" type="button" value=")" onclick="insertAtCaret(\')\');" ID="Button29" NAME="Button29" style="margin: 1px 20px 1px 1px;">');
		html.push('<INPUT class="colon-btn shrbtn shrbtn-primary" type="button" value="”" onclick="insertAtCaret(\'◎\');" ID="Button36" NAME="Button36" style="margin: 1px;min-width: 70px;">');
		html.push('<INPUT class="text-btn shrbtn shrbtn-primary" type="button" value="'
			+ jsBizMultLan.atsManager_calFormula_i18n_14
			+ '" onclick="openSeniorWindow();" ID="Button30" NAME="Button30" style="margin: 1px;width:auto;">');
		html.push('</div>');
		html.push('<div class="span4" style="margin-top: -5px;padding-right: 10px;">');
		html.push('<div>'
			+ jsBizMultLan.atsManager_calFormula_i18n_20
			+ '</div>');
		html.push('<div style="padding-top: 3px;"><TEXTAREA id="description" style="width: 100%;height:70px"></TEXTAREA></div>');
		html.push('</div></div></div></div>');
		$con.append(html.join(""));
		$("#sideArea ul li").live({
			dblclick:function(){				
				var n = $(this).text();
				insertAtCaret('"'+n+'"', colors.ITEM);
			}
		});
		// init editor
		/*
		ue = UM.getEditor("editor", {
			toolbar : [ 'fullscreen source | undo redo | bold italic underline | forecolor backcolor' ],
			autoHeightEnabled : false,
			autoClearinitialContent : true
		});
		*/
		var text_json = {
			id:"sortSn",
			name: "sortSn",
			readonly: "",
			value: "0",
			validate: "{number:true,maxlength:9,required:true}",
			trimAll:false,
			isMultiLan:false,
			isNumberfield:true,
			isMenuIcon: false,
			onChange: null,
			joinSelectField: "",
			extendOptions:{'numberOptions':{'ignoreDecimalFormatter':false,'roundType':'round','formatType':'number','decimalPrecision':0}}
		};		
		$('#sortSn').shrTextField(text_json);
		
		$("#sortSn").parent().css("margin","-20px 0 0 60px");
		$("#sortSn").parent().css("width","122px");
		$("#sortSn").css("width","100px");
		ue = UE.getEditor("editor", {
			toolbars:[['auto','undo','redo','|','bold','italic','underline','strikethrough','|','forecolor','backcolor','|','removeformat',
	                    'selectall','cleardoc','paragraph','|','fontfamily','fontsize','|','justifyleft','justifycenter','justifyright','justifyjustify','|','fullscreen']],
	        autoHeightEnabled : false,
			autoClearinitialContent : true,
			focus: true,
			zIndex: 'auto'
		});
		// get items
		clz.remoteCall({
			method : "getItems",
			param : {
				calSchemeId : calSchemeId,
				formulaType : _formulaType
			},
			success : function(data){				
				ue_items = data[2];
				ue_ci = data[3];
				ue_cp = data[4];
			    ue_tableConfig = data[5];
				var itemSetting = {
					data : {
						simpleData : {
							enable : true
						}
					},
					callback : {
						onDblClick : itemDblClick
						//onClick:itemClick 【由于加上点击事件，会出现意想不到的问题，所以去掉点击事件】
					}
				};
				var funcSetting = {
					data : {
						simpleData : {
							enable : true
						}
					},
					callback : {
						onDblClick : funcDblClick,
						onNodeCreated : funcNodeCreated
					}
				};
				$.fn.zTree.init($("#itemTree"), itemSetting, data[0]);
				$.fn.zTree.init($("#funcTree"), funcSetting, data[1]);
			}
		});
		$("#isCal").iCheck({
			checkboxClass : "icheckbox_minimal-grey"
		});
		//是否含有核算人员
		/*clz.remoteCall({
			method : "hasCalPerson",
			param : {
				calSchemeId : calSchemeId
			},
			success : function(data){
				if (data && data == "N")
					clz.hasCalPerson = false;
			}
		});*/
		this.initFormulaList();
		this.initSenior();
		$("#update").addClass("shrbtn-primary");
		// 离开提示
		window.onbeforeunload = function(){
			if (clz.unsave)
				return jsBizMultLan.atsManager_calFormula_i18n_21;
		}
		this.disablebuttonByUrl();
		
	},
	/**
	 * 当来自vailableForm时禁用掉按钮
	 */
	disablebuttonByUrl:function(){
		if(document.referrer.match("vailableForm")!=null){
			$('button[type="button"]').hide();
		}
	},

	/**
	 * 点击公式设置按钮事件
	 */
	modifyAction : function(){
		var clz = this, calSchemeId = shr.getUrlRequestParam("billId");
		if (clz.canEdit == 0) {
			clz.remoteCall({
				method : "checkCalSchemeEdit",
				async : false,
				param : {
					calSchemeId : calSchemeId
				},
				success : function(data){
					clz.canEdit = data == "Y" ? 1 : 2;
				}
			});
		}
		if (clz.canEdit == 1) {
			$("#formula-container").toggle();
			shr.setIframeHeight();
		} else if (clz.canEdit == 2) {
			shr.showError({
				message : jsBizMultLan.atsManager_calFormula_i18n_65
			});
		}
	},
	getFormulaType : function(){
		var that = this;
		that.remoteCall({
			method : "getFormulaType",
			async: false,
			param : {
				billId : shr.getUrlRequestParam("billId")
			},
			success : function(data){
				
					_formulaType = data.formulaType; 
				
			}
		});
	
	}
	/**
	 * 初始化公式列表
	 */
	,initFormulaList : function(){
		var clz = this;
		clz.remoteCall({
			method : "getFormulas",
			param : {
				attencePolicyId : shr.getUrlRequestParam("billId"),
				formulaType : _formulaType
			},
			success : function(data){
				var $tab = $("#formulaTab"), datas = eval(data);
				// 初始化公式表格
				if ($tab.size() == 0) {
					$tab = $("<table id='formulaTab'></table>").appendTo($("#container"));
					$tab.jqGrid({
						height : "auto",
						datatype : "local",
						rownumbers : false,
						colNames : [ 'ID',
							 'trueId',
							 jsBizMultLan.atsManager_calFormula_i18n_15,
							 jsBizMultLan.atsManager_calFormula_i18n_17,
							 jsBizMultLan.atsManager_calFormula_i18n_2,
							 jsBizMultLan.atsManager_calFormula_i18n_72,
							 jsBizMultLan.atsManager_calFormula_i18n_19,
							 jsBizMultLan.atsManager_calFormula_i18n_41,
							jsBizMultLan.atsManager_calFormula_i18n_9,
							'isCalValue',
							jsBizMultLan.atsManager_calFormula_i18n_34
							
						],

						colModel : [ {
							name : "id",
							hidden : true,
							key : true
						},
						{
							name : "trueId",
							hidden : true
							
						},
						{
							name : "name",
							width : 200
						}, {
							name : "content",
							width : 450,
							formatter : contentFormatter
						}, {
							name : "htmlContent",
							hidden : true
						}, {
							name : "sortSn",
							width : 50,
							align : "center"
						}, {
							name : "description",
							hidden : true
						}, {
							name : "execute",
							width : 50,
							align : "center",
							formatter : execFormatter
						}, {
							name : "isCal",
							width : 50,
							align : "center"
						},{
							name : "isCalValue",
							hidden : true
						},{
							name : "isCal",
							width : 50,
							formatter : isCalFormatter
						
						}
						
						]
					});
					// 双击公式列表行，编辑该公式
					$tab.jqGrid("option", {
						ondblClickRow : function(rowid, iRow, iCol, e){
							var data = $tab.jqGrid("getRowRealData", rowid);
							if ($("#sidebar").is(":hidden"))
								clz.modifyAction();
							if (clz.unsave && !confirm(jsBizMultLan.atsManager_calFormula_i18n_22)) {
								return;
							}
							$("#name").val(data.name);
							atsMlUtile.setTransNumValue("sortSn",data.sortSn,{decimalPrecision:0});
							$("#description").val(data.description);
							ue.setContent(data.htmlContent);
							if (data.isCal.indexOf("/on.png") > -1 && data.isCal.indexOf("title=\""
								+ jsBizMultLan.atsManager_calFormula_i18n_59
								+ "\"") > -1) {
								$("#isCal").iCheck("check").parent().addClass("checked");
							} else {
								$("#isCal").iCheck("uncheck").parent().removeClass("checked");
							}
							$("#update, #remove").addClass("shrbtn-primary");
							// 记录当前编辑公式ID
							clz.formulaId = data.trueId;
							clz.unsave = false;
						}
					});
				}
				var isAllCal = true;//是否所有的都参与计算
				// 先清空数据
				$tab.jqGrid("clearGridData");
				// 填充数据
				for ( var i in datas) {
					if(jsBizMultLan.atsManager_calFormula_i18n_13.toUpperCase() == datas[i].isCal.alias.toUpperCase()){
						isAllCal = false;
					}
					var d = {
						id : datas[i].id,
						trueId : datas[i].id,
						name : datas[i].name,
						content : datas[i].content,
						htmlContent : datas[i].content,
						isCal : datas[i].isCal.alias,
						sortSn : datas[i].sortSn,
						isCalValue:datas[i].isCal.value,
						description : datas[i].description
					};
					$tab.jqGrid("addRowData", i + 1, d);
					if (clz.maxSn <= datas[i].sortSn)
						clz.maxSn = datas[i].sortSn + 2;
				}
				atsMlUtile.setTransNumValue("sortSn",clz.maxSn,{decimalPrecision:0});
				shr.setIframeHeight();
				var isCalImg = isAllCal ?  $('<img onclick="ctrlIsCalAll(0);" style="width: 35px;height: 18px;margin-left:20%" src="/shr/addon/attendmanage/web/resource/images/on.png">') : $('<img onclick="ctrlIsCalAll(1);" style="width: 35px;height: 18px;margin-left:20%" src="/shr/addon/attendmanage/web/resource/images/off.png">');
				var thead = $($("#gview_formulaTab table")[0]).children().find("th[role='columnheader']");
				//$(thead).removeAttr("style","cursor"); 
				var isCalCtrl = thead[thead.length - 1];
				$(isCalCtrl).html("");

				$(isCalCtrl).append(isCalImg);
				$($(thead).find('div')).attr("style","cursor:default");
				$(isCalCtrl).attr("style","cursor:pointer");//表头最后添加手
				$(".ui-jqgrid tr.jqgrow").attr("style","cursor:default");//移除手
				//添加手
				$($("#gview_formulaTab table")[1]).children().find('td[aria-describedby="formulaTab_execute"]').attr("style","cursor:pointer");
				
				$($("#gview_formulaTab table")[1]).children().find('td[aria-describedby="formulaTab_isCal"]').children().parent().attr("style","cursor:pointer");

			}
		});
	},
	/**
	 * 初始化高级选项
	 */
	initSenior : function(){
		var clz = this, $con = $("#container");
		var html = [];
		html.push("<div id='seniorDialog' class='hide'>");
		html.push("<div id='seniorBtn'>");
		html.push("<input type='radio' name='_senior' id='_func' val='0' checked /><label for='_func'>"
			+ jsBizMultLan.atsManager_calFormula_i18n_25
			+ "</label>");
		html.push("<input type='radio' name='_senior' id='_var' val='1' /><label for='_var'>"
			+ jsBizMultLan.atsManager_calFormula_i18n_4
			+ "</label>");
		html.push("<input type='radio' name='_senior' id='_temp' val='2' /><label for='_temp'>"
			+ jsBizMultLan.atsManager_calFormula_i18n_36
			+ "</label>");
		html.push("</div>");
		html.push("<table id='funcTab'></table>");
		html.push("<table id='varTab'></table>");
		html.push("<table id='tempTab'></table>");
		html.push("<div class='intro-text'>"
			+ jsBizMultLan.atsManager_calFormula_i18n_39
			+ "</div>");
		html.push("<div class='intro-div'></div>");
		html.push("</div>");
		$con.append(html.join(""));
		// 初始化切换按钮
		$("#seniorDialog input").iCheck({
			radioClass : "iradio_minimal-grey"
		}).on("ifChecked", function(event){
			clz.initSeniorTab(parseInt($(event.target).attr("val")));
			$("#seniorDialog div.intro-div").text("");
		});
		// 初始化函数，变量，临时表数据
		clz.remoteCall({
			method : "getSeniorData",
			param : {formulaType:_formulaType},
			success : function(data){
				clz.funcDatas = eval(data.map.funcDatas);
				clz.varDatas = eval(data.map.varDatas);
				clz.tempDatas = eval(data.map.tempDatas);
				for ( var i in clz.funcDatas) {
					ue_cf.push(clz.funcDatas[i].name);
					clz.funcDatas[i].type = clz.funcDatas[i].type.alias;
					clz.funcDatas[i].returnType = clz.funcDatas[i].returnType.alias;
				}
				var temps = [], temp, fn, fd;
				for ( var i in clz.tempDatas) {
					fn = clz.tempDatas[i].paramNames ? clz.tempDatas[i].paramNames.split(",") : [];
					fd = clz.tempDatas[i].paramDefines ? clz.tempDatas[i].paramDefines.split(",") : [];
					for ( var j in fn) {
						temp = {};
						temp.table = "[" + clz.tempDatas[i].define + "]" + clz.tempDatas[i].name;
						temp.name = "[" + clz.tempDatas[i].define + "." + fd[j] + "]" + fn[j];
						temp.description = clz.tempDatas[i].description;
						temps.push(temp);
					}
				}
				clz.tempDatas = temps;
				clz.initSeniorTab(0);
			}
		});
	},
	/**
	 * 初始化函数，变量，临时表数据表格
	 */
	initSeniorTab : function(type){
		var clz = this, $tab;
		if (!clz.initTab) {
			// 函数表格
			$("#funcTab").jqGrid({
				data : clz.funcDatas,
				height : 270,
				datatype : "local",
				multiselect : false,
				rownumbers : false,
				grouping : true,
				groupingView : {
					groupField : [ 'type' ],
					groupText : [ "{0}" ],
					groupColumnShow : [ false ],
					groupCollapse : true,
					groupDataSorted : true,
					groupOrder:['desc']
				},
				colNames : [
					jsBizMultLan.atsManager_calFormula_i18n_35,
					 jsBizMultLan.atsManager_calFormula_i18n_40,
					 jsBizMultLan.atsManager_calFormula_i18n_11,
					 jsBizMultLan.atsManager_calFormula_i18n_12,
					 jsBizMultLan.atsManager_calFormula_i18n_8,
					 jsBizMultLan.atsManager_calFormula_i18n_39
				],

				colModel : [ {
					name : "type"
				}, {
					name : "name",
					width : 220
				}, {
					name : "define",
					width : 150
				}, {
					name : "returnType",
					width : 150
				}, {
					name : "params",
					width : 150
				}, {
					name : "description",
					hidden : true
				} ],
				onSelectRow : function(rowid){
					showRowIntro(rowid);
				}
			});
			$("#funcTab tr.jqfoot").remove();
			// 变量表格
			$("#varTab").jqGrid({
				data : clz.varDatas,
				height : 270,
				datatype : "local",
				multiselect : false,
				rownumbers : false,
				colNames : [
					jsBizMultLan.atsManager_calFormula_i18n_40,
					jsBizMultLan.atsManager_calFormula_i18n_11,
					jsBizMultLan.atsManager_calFormula_i18n_5,
					jsBizMultLan.atsManager_calFormula_i18n_39
				],
				colModel : [ {
					name : "name",
					width : 300
				}, {
					name : "define",
					width : 177
				}, {
					name : "type.alias",
					width : 180
				}, {
					name : "description",
					hidden : true
				} ],
				onSelectRow : function(rowid, status){
					showRowIntro(rowid);
				}
			});
			// 临时表表格
			$("#tempTab").jqGrid({
				data : clz.tempDatas,
				height : 270,
				datatype : "local",
				multiselect : false,
				rownumbers : false,
				grouping : true,
				groupingView : {
					groupField : [ 'table' ],
					groupText : [ "{0}" ],
					groupColumnShow : [ false ],
					groupCollapse : true
				},
				colNames : [
					jsBizMultLan.atsManager_calFormula_i18n_36,
					jsBizMultLan.atsManager_calFormula_i18n_40,
					jsBizMultLan.atsManager_calFormula_i18n_39
				],
				colModel : [ {
					name : "table"
				}, {
					name : "name",
					width : 685
				}, {
					name : "description",
					hidden : true
				} ]
			});
			$("#tempTab tr.jqfoot").remove();
			$("#tempTab tr[id^=tempTabghead]").click(function(){
				var nextRowId = $(this).next().attr("id");
				showRowIntro(nextRowId);
			});
			clz.initTab = true;
		}
		switch (type) {
			case 0:
				$tab = $("#funcTab");
				break;
			case 1:
				$tab = $("#varTab");
				break;
			case 2:
				$tab = $("#tempTab");
				break;
		}
		$("#funcTab").jqGrid("option", "hidden", true);
		$("#varTab").jqGrid("option", "hidden", true);
		$("#tempTab").jqGrid("option", "hidden", true);
		$tab.jqGrid("option", "hidden", false);
	},
	/**
	 * 新增公式或更正公式
	 */
	addAction : function(){
		var clz = this;		
		clz.clearAction();
		clz.initFormulaList();	
		clz.formulaId = "";
	},
	updateAction : function(){
		var clz = this;		
		var formulaId = clz.formulaId;
		if(formulaId && formulaId != ""){
		   this.saveFormula(false, $("#update"));
		}else{
		   this.saveFormula(true, $("#add"));
		}
	},
	getFormulaMultiLanResAction : function(){
		this.remoteCall({
			async : false,
			method : "getFormulaMultiLanRes",
			success : function(data){
				console.log(data);
			}
		});
	},
	saveFormula : function(isAdd, $btn){
		var clz = this;
		// 公式校验
		var regex = /^[0-9]*[1-9][0-9]*$/g;
		if ($("#name").val() == "") {
			shr.showInfo({
				message : jsBizMultLan.atsManager_calFormula_i18n_49,
				hideAfter : 3
			});
			return;
		} else if (ue.getContentTxt().trim() == "") {
			shr.showInfo({
				message : jsBizMultLan.atsManager_calFormula_i18n_50,
				hideAfter : 3
			});
			return;
		} else if (atsMlUtile.getFieldOriginalValue("sortSn") == "") {
			shr.showInfo({
				message : jsBizMultLan.atsManager_calFormula_i18n_51,
				hideAfter : 3
			});
			return;
		} else if (!regex.test(atsMlUtile.getFieldOriginalValue("sortSn"))) {
			shr.showInfo({
				message : jsBizMultLan.atsManager_calFormula_i18n_73,
				hideAfter : 3
			});
			return;
		}
		// 初始化新增计算公式的参数
		var params = {};
		params.isAdd = isAdd ? "Y" : "N";
		params.formulaId = clz.formulaId;
		params.calSchemeId = shr.getUrlRequestParam("billId");
		params.name = $("#name").val();
		if(isAdd){
		    params.sortSn = atsMlUtile.getFieldOriginalValue("sortSn");
		}else{
			params.sortSn = atsMlUtile.getFieldOriginalValue("sortSn");
		}
		params.isCal = $("#isCal").attr("checked") ? 1 : 0;
		params.description = $("#description").val();
		//params.content = ue.getContent();
		params.html = ue.getHtml();
		params.formulaType = _formulaType;
		params.formula = ue.getFormula();
		//表和信息集的关系
		params.tableConfigId = getTableConfigId();
		// 保存或更正公式
		this.remoteCall({
			async : false,
			method : "saveFormula",
			param : params,
			success : function(data){
				// 校验公式失败
				if (data) {
					shr.showError({
						message : data
					});
					return;
				}
				if (clz.maxSn <= parseInt(params.sortSn))
					clz.maxSn = parseInt(params.sortSn) + 2;
				clz.clearAction();
				clz.initFormulaList();
				clz.formulaId = "";
				shr.showInfo({
					message :  jsBizMultLan.atsManager_calFormula_i18n_3
				});
			}
		});
		clz.unsave = false;
	},
	/**
	 * 删除公式
	 */
	removeAction : function(){
		if (!$("#remove").hasClass("shrbtn-primary"))
			return;
		var clz = this;
		shr.showConfirm(jsBizMultLan.atsManager_calFormula_i18n_54, function(){
			clz.remoteCall({
				method : "removeFormula",
				param : {
					formulaId : clz.formulaId
				},
				success : function(data){
					clz.clearAction();
					clz.initFormulaList();
					shr.showInfo({
						message : jsBizMultLan.atsManager_calFormula_i18n_57,
						hideAfter : 3
					});
				}
			});
		});
		clz.unsave = false;
	},
	/**
	 * 清空公式区域
	 */
	clearAction : function(){
		var clz = this;		
		$("#name, #description").val("");
		atsMlUtile.setTransNumValue("sortSn",this.maxSn,{decimalPrecision:0});
		$("#isCal").attr("checked", true);
		$("#remove").removeClass("shrbtn-primary");
		clz.formulaId = "";
		ue.setContent("");
	},
	
	//公式检查
	checkAction: function(){
		var _self= this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CalFormulaHandler&method=check";
		openLoader(1);
		shr.ajax({
			type:"post",
			url:url,
			data:{
				policyId:shr.getUrlParams().billId,
				uipk:shr.getUrlParams().uipk
			},
			success:function(res){
				closeLoader();
				if(res.mess==jsBizMultLan.atsManager_calFormula_i18n_32)
				{
					shr.showInfo({message : jsBizMultLan.atsManager_calFormula_i18n_32});
				}else{
					shr.showError({ message : res.mess });
				}
			}
		}); 
	},
	/**
	 * 下载文档《金蝶s-HR考勤公式设置指南.docx》
	 */
	
	downLoadGuideAction : function(){
        /** 有其它语言再加吧*/
        if ("en_US" == contextLanguage) {
            document.location.href = "/shr/addon/attendmanage/web/resource/Kingdee_sHR_attGuide_EN.docx";
        } else {
            document.location.href = "/shr/addon/attendmanage/web/resource/Kingdee_sHR_attGuide.docx";
        }
	}
});
/**
 * select item tab or function tab
 * 
 * @param type
 * @param $btn
 */
function selectTab(type, $btn){
	if ($btn.hasClass("btn-tab-current"))
		return;
	$("div.btn-tab-div button").removeClass("btn-tab-current");
	$btn.addClass("btn-tab-current");
	if (type == 1) {
		$("#funcTree").hide();
		$("#itemTree").show();
	} else if (type == 2) {
		$("#itemTree").hide();
		$("#funcTree").show();
	}
}
/**
 * 公式列表模拟执行Formatter
 * 
 * @param cellValue
 * @param options
 * @returns {String}
 */
function execFormatter(cellValue, options){
	return "<img onclick='execFormula(\"" + options.rowId + "\");' style='width: 20px;height: 20px;' src='" + shr.getContextPath() + "/addon/compensation/web/images/calc.png' title="
		+ jsBizMultLan.atsManager_calFormula_i18n_41
		+ " />";
}

function isCalFormatter(cellValue, options){
	
	if(jsBizMultLan.atsManager_calFormula_i18n_59.toUpperCase() == cellValue.toUpperCase()){
	    return "<img onclick='ctrlIsCal(\"" + options.rowId + "\");' style='width: 35px;height: 18px;margin-left:20%' src='" + shr.getContextPath() + "/addon/attendmanage/web/resource/images/on.png' title="
			+ jsBizMultLan.atsManager_calFormula_i18n_59
			+ " />";
	}else{
		return "<img onclick='ctrlIsCal(\"" + options.rowId + "\");' style='width: 35px;height: 18px;margin-left:20%' src='" + shr.getContextPath() + "/addon/attendmanage/web/resource/images/off.png' title="
			+ jsBizMultLan.atsManager_calFormula_i18n_13
			+ " />";
	}
	
}

function ctrlIsCal(rowId){
	var calSchemeId = $("#" + rowId).find("td[aria-describedby^='formulaTab_id']").text();
	var isCalText = $("#" + rowId).find("td[aria-describedby^='formulaTab_isCal']").text();
	var isCalValueText = $("#" + rowId).find("td[aria-describedby^='formulaTab_isCalValue']").text();
	var updateIsCal = "0";
	if("1" == isCalValueText){
		updateIsCal = "0";
	}else if("0" == isCalValueText){
		updateIsCal = "1";
	}else{
		updateIsCal = "0";
	}
	var clz = jsBinder;
		// 执行公式并显示计算结果
	clz.remoteCall({
			method : "updateCalFormulaByIds",
			param : {
					ids : calSchemeId,
					isCal : updateIsCal
			},
			success : function(data){
					//clz.initFormulaList();
			},
			error : function(response, textStatus, errorThrown){
					clz.initFormulaList();
			},
			
			complete:function(event, XMLHttpRequest, ajaxOptions, thrownError){
					clz.initFormulaList();
			}	
		});
	
}

function ctrlIsCalAll(isCal){
	var ids = "";
	var tds = $("#formulaTab").find("td[aria-describedby='formulaTab_id']");
	for(var i=0;i<tds.length;i++){
		ids += $(tds[i]).text();
		if(i != tds.length - 1){
			ids += ",";
		}
	}
	var clz = jsBinder;
		// 执行公式并显示计算结果
	clz.remoteCall({
			method : "updateCalFormulaByIds",
			param : {
					ids : ids,
					isCal : isCal
			},
			success : function(data){
					//clz.initFormulaList();
			},
			error : function(response, textStatus, errorThrown){
					clz.initFormulaList();
			},
			
			complete:function(event, XMLHttpRequest, ajaxOptions, thrownError){
					clz.initFormulaList();
			}	
		});
}

function contentFormatter(cellValue, options){
	if (!cellValue)
		return "";
	// 编辑器以<p>开头
	if (cellValue.indexOf("&lt;") == 0) {
		var $temp = $(cellValue.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&nbsp;/g, " "));
		return $temp.text();
	}
	// 兼容旧版本公式内容
	else {
		var tcell = cellValue.replace(/\[T_HR_SCmpCalTable\.+S\d+\]/g, "");
		return tcell;
	}
}
/**
 * 模拟执行公式
 * 
 * @param rowid
 */
function execFormula(rowid){
	if(_formulaType=="2"){
		this.execLimitFormula(rowid);
		return ;
	}
	var clz = jsBinder, calSchemeId = shr.getUrlRequestParam("billId");
	var formulaData = $("#formulaTab").jqGrid("getRowRealData", rowid);
	// 显示公式模拟执行对话框
	var html= "<div id='message_head' style='padding:2px;padding-left:1.5%;'><div id='message_info' style='background-color:#E4E4E4;width:95%;padding:5px;padding-left:5px;'><font color='#FF0000'>"
		+ jsBizMultLan.atsManager_calFormula_i18n_62
		+ "</font></span></div></div>";
	html += "<table class='dialog-edit-table'>";
	html += "<tr>";
	html += "<td class='label-td'>"
		+ jsBizMultLan.atsManager_calFormula_i18n_15
		+ "</td>";
	html += "<td><b>" + formulaData.name + "</b></td>";
	html += "</tr>";
	html += "<tr>";
	html += "<td class='label-td'>"
		+ jsBizMultLan.atsManager_calFormula_i18n_58
		+ "</td>";
	html += "<td><input id='_calPerson' class='input-height required' type='text' style='width: 532px;' /></td>";
	html += "</tr>";
	html += "</table>";
	html += "<div class='title-border'>"
        + jsBizMultLan.atsManager_calFormula_i18n_33
		+ "</div>";
	html += "<table id='inputTab' class='dialog-edit-table'>";
	html += "</table>";
	html += "<div class='title-border'>"
		+ jsBizMultLan.atsManager_calFormula_i18n_60
		+ "</div>";
	html += "<table id='infoTab' class='dialog-edit-table'>";
	html += "</table>";
	html += "<div class='title-border'>"
		+ jsBizMultLan.atsManager_calFormula_i18n_29
		+ "</div>";
	html += "<table id='calTab' class='dialog-edit-table'>";
	html += "</table>";
	showDialog(null, jsBizMultLan.atsManager_calFormula_i18n_16, html, [ {
		text : jsBizMultLan.atsManager_calFormula_i18n_41,
		click : function(){
			shr.msgHideAll();
			// 验证录入项目输入
//			if (!$("#_calPerson").val()) {
//				shr.showError({
//					message : "请选择试算人员！"
//				});
//				return;
//			}
			var regexFloat = /^-?\d+(\.\d+)?$/, flag = true, itemName = "";
			$("#inputTab input[isnum='Y']").each(function(){
				if (!regexFloat.test($(this).val())) {
					itemName = $(this).parent().prev().text();
					flag = false;
					return false;
				}
			});
			if (!flag) {
				shr.showError({
					message : itemName + jsBizMultLan.atsManager_calFormula_i18n_0
				});
				return;
			}
			//模拟考勤计算公式执行方法
			openLoader(null, jsBizMultLan.atsManager_calFormula_i18n_71);
			var calData = [];
			$("#inputTab input:text").each(function(){
				calData.push({
					fieldSn : $(this).attr("fieldSn"),
					isNum : $(this).attr("isnum"),
					value : $(this).val()
				});
			});
			$("#calTab div[fieldSn]").each(function(){
				calData.push({
					fieldSn : $(this).attr("fieldSn"),
					isNum : $(this).attr("isnum"),
					value : 0,
					isCal : "Y"
				});
			});
			$("#infoTab div[infoset]").each(function(){
				calData.push({
					infoset : $(this).attr("infoset"),
					value : $(this).attr("value"),
					realValue:$(this).attr("realValue")
				});
			});
			// 执行公式并显示计算结果
			clz.remoteCall({
				method : "execFormula",
				param : {
					execPersonId : clz.execPersonId,
					calSchemeId : calSchemeId,
					formulaId : formulaData.id,
					calData : JSON.stringify(calData),
					formulaType:_formulaType
				},
				success : function(data){
					closeLoader();
					if (!data)
						return;
					data = $.parseJSON(data);
					for ( var i in data) {
						$("#calTab div[fieldSn='" + data[i].fieldSn + "']").html(data[i].value).css("color", "red");
					}
				},
				error : function(response, textStatus, errorThrown){
					closeLoader();
					return shr.handleError(this, response, textStatus, errorThrown);
				},
				ajaxError:function(event, XMLHttpRequest, ajaxOptions, thrownError){
					closeLoader();
				},
				complete:function(event, XMLHttpRequest, ajaxOptions, thrownError){
					closeLoader();
				},
				ajaxComplete:function(event, XMLHttpRequest, ajaxOptions, thrownError){
					closeLoader();
				},
				ajaxStop:function(event, XMLHttpRequest, ajaxOptions, thrownError){
					closeLoader();
				}
				
			});
		}
	} ], 800, 500, jsBizMultLan.atsManager_calFormula_i18n_23);
	
	
	// 组装公式录入项目，参与项目与计算项目
	var filter = "calScheme.id = '" + calSchemeId + "'";
	$("#_calPerson").shrPromptBox({
		id : "_calPerson",
		validate : "{required:true}",
		//displayFormat : "{person.name}",
		displayFormat : "{name}",
		subWidgetName : "shrPromptGrid",
		subWidgetOptions : {
			title : jsBizMultLan.atsManager_calFormula_i18n_58,
			uipk : "com.kingdee.eas.hr.ats.app.ExistFileForAdmin.F7"
		},
		isAutoSort : false,
		onchange : function(event, data){
			if (!data || !data.current || !data.current.id)
				return;
				
			openLoader(null, jsBizMultLan.atsManager_calFormula_i18n_70);
			clz.execPersonId = data.current['id'];	//试图配置不一样 取ID值不一样
			//clz.execPersonId = data.current['person.id'];	//试图配置不一样 取ID值不一样
			//clz.execPersonId = data.current["proposer.id"]
				if(_formulaType=="2"){
						var html = "";
						html += "<tr>";
						html += "<td class='label-td'>"
							+ jsBizMultLan.atsManager_calFormula_i18n_30
							+ "</td>";
						html += "<td><div id='resultValue' style='width: 100px;border-bottom: 1px solid #333;color: #ccc;text-align: center;'>"
							+ jsBizMultLan.atsManager_calFormula_i18n_10
							+ "</div></td>";
						html += "</tr>";
					$("#calTab").html(html);
					closeLoader();
					return;
				}
			
			clz.remoteCall({
				method : "initExecData",
				param : {
					execPersonId : clz.execPersonId,
					calSchemeId : calSchemeId,
					formulaId : formulaData.id
				},
				error : function(ret){
					closeLoader();
					var message = ret.responseText;
					shr.showWarning({
						message : message
					});
					return;
				},
				success : function(data){					
					data = $.parseJSON(data);
					//考勤项目
					var html = "";
					for ( var i in data.inputItems) {
						if (parseInt(i) % 2 == 0)
							html += "<tr>";
						html += "<td class='label-td'>" + data.inputItems[i].name + "</td>";
						html += "<td><input type='text' fieldSn='" + data.inputItems[i].fieldSn + "' isnum='" + data.inputItems[i].isNum + "'";
						if (data.inputItems[i].isNum == "Y") {
							html += " value='0'";
						}
						html += " class='input-height' style='margin-right: 20px!important;' /></td>";
						if ((parseInt(i) + 1) % 2 == 0)
							html += "</tr>";
					}
					$("#inputTab").html(html);
					
					html = "";					
					for ( var i in data.infoItems) {
						if (parseInt(i) % 2 == 0)
							html += "<tr>";
						var name = data.infoItems[i].name;
						var value = data.infoItems[i].value;
						var realValue=data.infoItems[i].realValue;
						var infoset = data.infoItems[i].infoset;						
						if(infoset.match(/Gender/i)){							
							if(value == "1"){
								value = jsBizMultLan.atsManager_calFormula_i18n_44;
							}else{
								value = jsBizMultLan.atsManager_calFormula_i18n_45;
							}
						}
						//  if(parseInt(value) == "1"){
						//  	value = "是";
						//  }else{
						//  	value = "否";
						//  }
						html += "<td class='label-td'>" + name + "</td>";
						html += "<td><div realValue='" + realValue + "' infoset='" + infoset + "' value='"+data.infoItems[i].value+"'>" + value+ "</div></td>";
						if ((parseInt(i) + 1) % 2 == 0)
							html += "</tr>";
					}
					//人事信息
					$("#infoTab").html(html);
					html = "";
					for ( var i in data.calItems) {
						if (parseInt(i) % 2 == 0)
							html += "<tr>";
						html += "<td class='label-td'>" + data.calItems[i].name + "</td>";
						html += "<td><div fieldSn='" + data.calItems[i].fieldSn + "' isnum='" + data.calItems[i].isNum + "' style='width: 100px;border-bottom: 1px solid #333;color: #ccc;text-align: center;'>"
							+ jsBizMultLan.atsManager_calFormula_i18n_10
							+ "</div></td>";
						if ((parseInt(i) + 1) % 2 == 0)
							html += "</tr>";
					}
					//计算结果
					$("#calTab").html(html);
					closeLoader();
				}
			});
			
		}
	});
	if (!clz.hasCalPerson)
		shr.showInfo({
			message : jsBizMultLan.atsManager_calFormula_i18n_63
		});
}

/**
 * 模拟额度计算执行公式
 * 
 * @param rowid
 */
function execLimitFormula(rowid){
	var clz = jsBinder, calSchemeId = shr.getUrlRequestParam("billId");
	var formulaData = $("#formulaTab").jqGrid("getRowRealData", rowid);
	// 显示公式模拟执行对话框
	var html = "<table class='dialog-edit-table'>";
	html += "<tr>";
	html += "<td class='label-td'>"
		+ jsBizMultLan.atsManager_calFormula_i18n_15
		+ "</td>";
	html += "<td>" + formulaData.name + "</td>";
	html += "</tr>";
	html += "<tr>";
	html += "<td class='label-td'>"
		+ jsBizMultLan.atsManager_calFormula_i18n_58
		+ "</td>";
	html += "<td><input id='_calPerson' class='input-height required' type='text' style='width: 532px;' /></td>";
	html += "</tr>";
	html += "</table>";
	html += "<div class='title-border'>"
		+ jsBizMultLan.atsManager_calFormula_i18n_29
		+ "</div>";
	html += "<table id='calTab' class='dialog-edit-table'>";
	html += "</table>";
	showDialog(null, jsBizMultLan.atsManager_calFormula_i18n_16, html, [ {
		text : jsBizMultLan.atsManager_calFormula_i18n_41,
		click : function(){
			shr.msgHideAll();
			// 验证录入项目输入
			if (!$("#_calPerson").val()) {
				shr.showError({
					message : jsBizMultLan.atsManager_calFormula_i18n_52
				});
				return;
			}
			var regexFloat = /^-?\d+(\.\d+)?$/, flag = true, itemName = "";
			$("#inputTab input[isnum='Y']").each(function(){
				if (!regexFloat.test($(this).val())) {
					itemName = $(this).parent().prev().text();
					flag = false;
					return false;
				}
			});
			if (!flag) {
				shr.showError({
					message : itemName + jsBizMultLan.atsManager_calFormula_i18n_0
				});
				return;
			}
			// 模拟执行方法
			openLoader(null, jsBizMultLan.atsManager_calFormula_i18n_71);
			var calData = [];
			$("#inputTab input:text").each(function(){
				calData.push({
					fieldSn : $(this).attr("fieldSn"),
					isNum : $(this).attr("isnum"),
					value : $(this).val()
				});
			});
			$("#calTab div[fieldSn]").each(function(){
				calData.push({
					fieldSn : $(this).attr("fieldSn"),
					isNum : $(this).attr("isnum"),
					value : 0,
					isCal : "Y"
				});
			});
			$("#infoTab div[infoset]").each(function(){
				calData.push({
					infoset : $(this).attr("infoset"),
					value : $(this).attr("value")
				});
			});
			// 执行公式并显示计算结果
			clz.remoteCall({
				method : "execFormula",
				param : {
					execPersonId : clz.execPersonId,
					calSchemeId : calSchemeId,
					formulaId : formulaData.id,
					calData : JSON.stringify(calData),
					formulaType:_formulaType
				},
				success : function(data){
					closeLoader();
					if (!data)
						return;
					data = $.parseJSON(data);
					$("#resultValue").html(data).css("color", "red");
				},
				error : function(response, textStatus, errorThrown){
					closeLoader();
					return shr.handleError(this, response, textStatus, errorThrown);
				},
				ajaxError:function(event, XMLHttpRequest, ajaxOptions, thrownError){
					closeLoader();
				},
				complete:function(event, XMLHttpRequest, ajaxOptions, thrownError){
					closeLoader();
				},
				ajaxComplete:function(event, XMLHttpRequest, ajaxOptions, thrownError){
					closeLoader();
				},
				ajaxStop:function(event, XMLHttpRequest, ajaxOptions, thrownError){
					closeLoader();
				}
			});
		}
	} ], 800, 500, jsBizMultLan.atsManager_calFormula_i18n_23);
	
	
	// 组装公式录入项目，参与项目与计算项目
	$("#_calPerson").shrPromptBox({
		id : "_calPerson",
		validate : "{required:true}",
		displayFormat : "{person.name}",
		subWidgetName : "shrPromptGrid",
		subWidgetOptions : {
			title : jsBizMultLan.atsManager_calFormula_i18n_58,
			uipk : "com.kingdee.eas.hr.ats.app.ExistFileForAdmin.F7"
		},
		onchange : function(event, data){
			if (!data || !data.current || !data.current["person.id"])
				return;
			clz.execPersonId = data.current["person.id"];	//试图配置不一样 取ID值不一样
				if(_formulaType=="2"){
						var html = "";
						html += "<tr>";
						html += "<td class='label-td'>"
							+ jsBizMultLan.atsManager_calFormula_i18n_30
							+ "</td>";
						html += "<td><div id='resultValue' style='width: 100px;border-bottom: 1px solid #333;color: #ccc;text-align: center;'>"
							+ jsBizMultLan.atsManager_calFormula_i18n_10
							+ "</div></td>";
						html += "</tr>";
					$("#calTab").html(html);
				}
			
		}
	});
	if (!clz.hasCalPerson)
		shr.showInfo({
			message : jsBizMultLan.atsManager_calFormula_i18n_63
		});
}

/**
 * 显示高级选项描述
 * 
 * @param rowid
 */
function showRowIntro(rowid){
	var type = parseInt($("#seniorDialog input:checked").attr("val")), $tab;
	switch (type) {
		case 0:
			$tab = $("#funcTab");
			break;
		case 1:
			$tab = $("#varTab");
			break;
		case 2:
			$tab = $("#tempTab");
			break;
	}
	var data = $tab.jqGrid("getRowRealData", rowid);
	$("#seniorDialog div.intro-div").text(data.description);
}
/**
 * 选择完高级选项
 */
function selectSeniorItem(){
	var type = parseInt($("#seniorDialog input:checked").attr("val")), $tab;
	switch (type) {
		case 0:
			$tab = $("#funcTab");
			break;
		case 1:
			$tab = $("#varTab");
			break;
		case 2:
			$tab = $("#tempTab");
			break;
	}
	var selIds = $tab.jqGrid("getSelectedRows");
	if (!selIds || selIds.length == 0 || !selIds[0])
		return;
	var data = $tab.jqGrid("getRowRealData", selIds[0]);
	var formula = data.name;
	if (type == 0) {
		var params = data.params ? data.params.split(",") : [];
		formula += "(";
		for ( var i = 0; i < params.length; i++) {
			if (params[i].trim() == "String") {
				formula += "\"\"";
			}
			if (i < params.length - 1) {
				formula += " ,";
			}
		}
		formula += ")";
	}
	insertAtCaret(formula, type == 0 ? colors.FUNC : colors.DEFAULT);
	$("#seniorDialog").dialog("close");
}

/**
 * 双击信息集树选项，添加到公式区域中
 * @param event
 * @param treeId
 * @param treeNode 
 */
function itemDblClick(event, treeId, treeNode){
	if (treeNode.isParent)
		return;	
	var n = treeNode.name;
	var pn = "";
	var $treeNode = treeNode.getParentNode();
	while(true){
		if($treeNode.getParentNode() == null || $treeNode.getParentNode().length == 0){
			pn = $treeNode.value;
			break;
		}
		else{
			$treeNode = $treeNode.getParentNode();
		}
	}
	//var sideArea = $("#sideArea").html();
	//var sideAreaul = $("#sideArea ul").html();
	//考勤项目和假期额度项目
	if (pn == ATSPROJECT ||  pn == HOLIDAYLIMITPROJECT) {
		insertAtCaret(n, colors.ITEM);
	} else {
		insertAtCaret("[" + n + "]", colors.PROP);
	}
	itemClick(event, treeId, treeNode);
}
//点击每一个信息集项目,触发的事件,填充第二个子节点的方法
function itemClick(event, treeId, treeNode){
	if (treeNode.isParent)
		return;	
	var id = treeNode.id;	
	if (id) {
		shr.remoteCall({
			uipk:"com.kingdee.eas.hr.ats.app.CalFormula", 
			url : "dynamic.do?method=getTableData",
			param:{id:id},
			success:function(res){
				$("#sideArea").html("");
				if(res && res.rows){					
					var html = [];
					html.push('<ul>');
					for(var i in res.rows){
						var item = res.rows[i];
						html.push('<li>'+item.alias+'</li>');
					}
					html.push('</ul>');
					$("#sideArea").html(html.join(""));	
				}
				$("#sideArea ul").attr("style","margin-bottom: 10px");
			}
		})
	
	} else {
		$("#sideArea").html("");
	}
}
function funcDblClick(event, treeId, treeNode){
	if (treeNode.isParent)
		return;
	var formula = treeNode.name + "(";
	var params = treeNode.params ? treeNode.params.split(",") : [];
	for ( var i = 0; i < params.length; i++) {
		if (params[i].trim() == "String")
			formula += "\"\"";
		if (i < params.length - 1)
			formula += " ,";
	}
	insertAtCaret(formula + ")", colors.FUNC);
}
function funcNodeCreated(event, treeId, treeNode){
	if (treeNode.isParent)
		return;
	$("#" + treeNode.tId + " a").attr("title", treeNode.title);
}
/**
 * 显示高级对话框 -- 函数，变量，临时表
 */
function openSeniorWindow(isInit){
	showDialog("#seniorDialog", jsBizMultLan.atsManager_calFormula_i18n_26, null, [ {
		text : jsBizMultLan.atsManager_calFormula_i18n_53,
		click : function(){
			selectSeniorItem();
		}
	} ], 675, 600, null);
}
/**
 * 向公式区域中插入值
 * 
 * @param text
 */
function insertAtCaret(name, color, addSpace){
	jsBinder.unsave = true;
	if (name == "◎")
		name = "\"";
	if (name == "<")
		name = "&lt;";
	if (name == ">")
		name = "&gt;";
	if (name == "<=")
		name = "&lt;=";
	if (name == ">=")
		name = "&gt;=";
	var html = "<span value='formal' ";
	html += " style='color: " + (color ? color : colors.DEFAULT) + ";'";
	html += ">";
	html += (addSpace ? "&nbsp;" : "") + name + (addSpace ? "&nbsp;" : "");
	html += "</span>";

	ue.execCommand('insertHtml' , html);
}

function getFormula(content){
  var keys = _.keys(ue_tableConfig);
	keys = keys.sort(function(str1, str2) {
		return str2.length - str1.length 
	});
	var regex = new RegExp(keys.join("|")
			.replace(/\]/g, "\\]").replace(/\[/g, "\\[")
			.replace(/\)/g, "\\)").replace(/\(/g, "\\("), "g");	
    content = content.replace(regex, function(match, index, text) {    	
    	if(index > 0) {
    		var c = text.charAt(index - 1);    		
    		if(c && c != " " && c != "+" && c != "-" && c != "*" && c != "/" && c != "="
    			&& c != ">" && c != "<" && c != "(" && c != "\"" && c != "," && c != jsBizMultLan.atsManager_calFormula_i18n_24
    			&& c != jsBizMultLan.atsManager_calFormula_i18n_38
				&& c != jsBizMultLan.atsManager_calFormula_i18n_37
				&& c != jsBizMultLan.atsManager_calFormula_i18n_66
				&& c != jsBizMultLan.atsManager_calFormula_i18n_48
				&& c != jsBizMultLan.atsManager_calFormula_i18n_69){
    			return match;
    		} 
    		c = text.charAt(index + match.length);    		
    		if(c && c != " " && c != "+" && c != "-" && c != "*" && c != "/" && c != "="
    			&& c != ">" && c != "<" && c != ")" && c != "\"" && c != "," && c != jsBizMultLan.atsManager_calFormula_i18n_55
    			&& c != jsBizMultLan.atsManager_calFormula_i18n_42
				&& c != jsBizMultLan.atsManager_calFormula_i18n_67
				&& c != jsBizMultLan.atsManager_calFormula_i18n_46
				&& c != jsBizMultLan.atsManager_calFormula_i18n_6
				&& c != jsBizMultLan.atsManager_calFormula_i18n_27){
    			return match;
    		} 
    	}    	
    	return ue_tableConfig[match];
    });
    return content;
}

function getFormularbyChing(ele,formulsarRes){
	formulsarRes = formulsarRes || '';
	if(ele instanceof HTMLSpanElement){
		return  $(ele).attr('value');
	}
	if(ele instanceof Text){
		return  ele.nodeValue;
	}
	ele = ele || $(UE.getEditor('editor').getHtml())[0];
	ele && ele.childNodes && ele.childNodes.forEach(function(nodeEle){
		formulsarRes += getFormularbyChing(nodeEle,formulsarRes);
	});
	return formulsarRes
}

function getTableConfigId(){
   var  tableConfigId = "";
   　var reg = /\[(.*?)\]/gi;              
   var str = getFormula(ue.getContentTxt());             
   var tmp = str.match(reg);               
   if (tmp) {                   
 	for (var i = 0; i < tmp.length; i++) {       
 		tableConfigId += (tmp[i].replace(reg, "$1")); // 不保留中括号      
 		if(i!=tmp.length-1){
 		  tableConfigId += ";";
 		}
 	}
   }
   return tableConfigId;
}

 function test(){                
 var reg = /\[(.*?)\]/gi;              
 var str = jsBizMultLan.atsManager_calFormula_i18n_1;
 var tmp = str.match(reg);               
 if (tmp) {                   
 	for (var i = 0; i < tmp.length; i++) {       
 		alert(tmp[i]); // 保留中括号                  
 	}
 }
 }
 
 //秘密快捷键：ctrl+enter快捷键查看公式解析结果，方便开发排查错误。add by chenah。
 $(document).keydown(function(e) {
	var clz = jsBinder;
	if (event.ctrlKey && e.keyCode == 13){
         alert(jsBizMultLan.atsManager_calFormula_i18n_61 + ue.getFormula());
	}
 }
);
