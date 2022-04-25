var isEdit=false;
shr.defineClass("shr.ats.scheduleShiftBatchMaintainBase", shr.framework.List, {
    _dayType: [
        $.attendmanageI18n.workShiftStrategy.dayType1,
        $.attendmanageI18n.workShiftStrategy.dayType2,
        $.attendmanageI18n.workShiftStrategy.dayType3
    ],
	initalizeDOM:function(){
		shr.ats.scheduleShiftBatchMaintainBase.superClass.initalizeDOM.call(this);
		var self = this ;
		var $grid = $(self.gridId);
		$grid.jqGrid('option', {
			onPaging: function(pgButton) {
				if(isEdit==false){
					return '';
				}
				shr.showConfirm(jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_10, function(){
					isEdit=false;
					if(pgButton=='prev_gridPager'){
						$("#prev_gridPager").click();
					}
					else if(pgButton=='next_gridPager'){
						$("#next_gridPager").click();
					}
					//手动输入页数
					else if(pgButton=='user'){
						var page=$('.ui-pg-input').val();
						$grid.setGridParam({page:page}).reloadGrid();
					}
					//修改每页显示个数
					else if(pgButton=='records'){
						var rowNum =$('.ui-pg-selbox').val();
						$grid.setGridParam({rowNum:rowNum}).reloadGrid();
					}
				});
				return 'stop';
			}			
		});
	},
	assginValueAction : function(pageUipk)
	{
		var _self = this ;
		if (_self.validate() && _self.verify()) 
		{
			isEdit=true;
			//var shift  = $("#shift_el").val();
			var shift  =$("#shift").attr("shifID");
			var shiftName  = $("#shift").val();
			var cardRule = $("#cardRule_el").val();
			var cardRuleName = $("#cardRule").val();
			var dateType =  $("#dateType").val();
			var clz = this;
			var $grid = $("#dataGrid");
			var ids = $grid.jqGrid('getDataIDs');
			var preTime=null;
			var nextTime=null;
			var cardRuleId=null;
			var standardHour=null;
			if(shift=="false"){
				shift="";
			}
			if(shift!=null&&shift!=""){
				
				//更新上下班时间 
				var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler";
				   shr.remoteCall({
					type:"post",
					method:"getShiftItemInfo",
					async:false,
					param :{atsShiftId:shift} ,
					url:url,
					success:function(res){
						var items=res.rows;
						if(items!=null && items.length>0){
							preTime=items[0].preTime;
							nextTime=items[items.length-1].nextTime;
						}
					}
				});
				//更新标准工时
			   var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsShiftEditHandler";
			   shr.remoteCall({
					type:"post",
					method:"getShiftDefaultStandardHour",
					async:false,
					param :{fid:shift} ,
					url:url,
					success:function(res){
						standardHour=res.standardHour;
					}
				});
			}
			//如果没有选择取卡规则，取所选班次的默认取卡规则
			if((cardRule==null || cardRule=="")&&shift){
				var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsShiftEditHandler";
				   shr.remoteCall({
					type:"post",
					method:"getShiftDefaultCardRuleInfoInfo",
					async:false,
					param :{fid:shift} ,
					url:url,
					success:function(res){
						cardRuleId=res.cardRule.id;
						cardRuleName=res.cardRule.name;
					}
				});
			}
			for(var i=0;i<ids.length;i++){
				if(shift!=null&&shift!=""){
					$grid.jqGrid("setCell",ids[i],"defaultShift_id",shift);
					$grid.jqGrid("setCell",ids[i],"defaultShift_name",shiftName);
					$grid.jqGrid("setCell",ids[i],"firstPreTime",preTime);
					$grid.jqGrid("setCell",ids[i],"lastNextTime",nextTime);
					$grid.jqGrid("setCell",ids[i],"standardHour",standardHour);
					//如果没有选择取卡规则，取所选班次的默认取卡规则
					if(cardRule==null || cardRule==""){
						$grid.jqGrid("setCell",ids[i],"cardRule_id",cardRuleId);
						$grid.jqGrid("setCell",ids[i],"cardRule_name",cardRuleName);
					}
					//更新日期类型
					$grid.jqGrid("setCell",ids[i],"dayType",dateType);
				}else{
					$grid.jqGrid("setCell",ids[i],"defaultShift_id",null);
					$grid.jqGrid("setCell",ids[i],"defaultShift_name",null);
					$grid.jqGrid("setCell",ids[i],"firstPreTime",null);
					$grid.jqGrid("setCell",ids[i],"lastNextTime",null);
					$grid.jqGrid("setCell",ids[i],"standardHour",null);
					/*//如果没有选择取卡规则，取所选班次的默认取卡规则
					$grid.jqGrid("setCell",ids[i],"cardRule_id",null);
					$grid.jqGrid("setCell",ids[i],"cardRule_name",null);*/
					//更新日期类型
					$grid.jqGrid("setCell",ids[i],"dayType",dateType);
				}
				if(cardRule!=null&&cardRule!=""){
					$grid.jqGrid("setCell",ids[i],"cardRule_id",cardRule);
					$grid.jqGrid("setCell",ids[i],"cardRule_name",cardRuleName);
				}
			}
		}
	},
	setSelectValueToGridCell: function(rowid,columnNum,cellcontent,e,ids)
	{
		var _self = this ;
		if (_self.validate()) 
		{
			var $table = $('#select_shift').shrPromptGrid("getTable");
			var ret = $table.jqGrid('getRowData',ids);
			var clz = this;
			var $grid = $("#dataGrid");	
			if(columnNum==9){
				var shift  = ret.id;
				var shiftName  =ret.name;
				if(shift!=null&&shift!=""){
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"defaultShift_id",shift);
					$grid.jqGrid("setCell",rowid,"defaultShift_name",shiftName);
					//更新上下班时间
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler";
					   shr.remoteCall({
						type:"post",
						method:"getShiftItemInfo",
						async:false,
						param :{atsShiftId:shift} ,
						url:url,
						success:function(res){
							var items=res.rows;
							if(items!=null && items.length>0){
								$grid.jqGrid("setCell",rowid,"firstPreTime",items[0].preTime);
								$grid.jqGrid("setCell",rowid,"lastNextTime",items[items.length-1].nextTime);
							}
						}
					});
				  //更新标准工时
				   var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsShiftEditHandler";
				   shr.remoteCall({
						type:"post",
						method:"getShiftDefaultStandardHour",
						async:false,
						param :{fid:shift} ,
						url:url,
						success:function(res){
							$grid.jqGrid("setCell",rowid,"standardHour",res.standardHour);
						}
					});
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsShiftEditHandler";
					   shr.remoteCall({
						type:"post",
						method:"getShiftDefaultCardRuleInfoInfo",
						async:false,
						param :{fid:shift} ,
						url:url,
						success:function(res){
							$grid.jqGrid("setCell",rowid,"cardRule_id",res.cardRule.id);
							$grid.jqGrid("setCell",rowid,"cardRule_name",res.cardRule.name);
						}
					});
				}
			}
			if(columnNum==10){
				var cardRule = ret.id;
				var cardRuleName = ret.name;
				if(cardRule!=null&&cardRule!=""){
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"cardRule_id",cardRule);
					$grid.jqGrid("setCell",rowid,"cardRule_name",cardRuleName);
				}
			}
		}
	},
	setSelectValueToGridCell2: function(rowid,columnNum,cellcontent,title,ids)
	{
		var _self = this ;
		if (_self.validate()) 
		{
		//	var $table = $('#select_shift').shrPromptGrid("getTable");
		//	var ret = $table.jqGrid('getRowData',ids);
		//	var clz = this;
			var $grid = $("#dataGrid");	
			if(columnNum==9){
				//var shift  = ret.id;
				//var shiftName  =ret.name;
				var shift  = "";
				if(ids!="false"){
					shift  = ids;
				}
				var dayType="";  
				var shiftName="";
				if(title){
					dayType = title.substring(1,title.indexOf("]"));
					shiftName = title.substring(title.indexOf("]")+1,title.length);
				}
				
				if(shift!=null&&shift!=""){
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"defaultShift_id",shift);
					$grid.jqGrid("setCell",rowid,"defaultShift_name",shiftName);
                    $grid.jqGrid("setCell",rowid,"dayType", _self.getDayType()[dayType]);
					
					//更新上下班时间
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler";
					shr.remoteCall({
						type:"post",
						method:"getShiftItemInfo",
						async:false,
						param :{atsShiftId:shift} ,
						url:url,
						success:function(res){
							var items=res.rows;
							if(items!=null && items.length>0){
								$grid.jqGrid("setCell",rowid,"firstPreTime",items[0].preTime);
								$grid.jqGrid("setCell",rowid,"lastNextTime",items[items.length-1].nextTime);
							}
						}
					});
					//更新标准工时
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsShiftEditHandler";
					shr.remoteCall({
							type:"post",
							method:"getShiftDefaultStandardHour",
							async:false,
							param :{fid:shift} ,
							url:url,
							success:function(res){
								$grid.jqGrid("setCell",rowid,"standardHour",res.standardHour);
							}
						});
					
					//更新取卡规则
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsShiftEditHandler";
					   shr.remoteCall({
						type:"post",
						method:"getShiftDefaultCardRuleInfoInfo",
						async:false,
						param :{fid:shift} ,
						url:url,
						success:function(res){
							$grid.jqGrid("setCell",rowid,"cardRule_id",res.cardRule.id);
							$grid.jqGrid("setCell",rowid,"cardRule_name",res.cardRule.name);
						}
					});
				}else{
					$grid.jqGrid("setCell",rowid,"defaultShift_id",null);
					$grid.jqGrid("setCell",rowid,"defaultShift_name",null);
                    $grid.jqGrid("setCell",rowid,"dayType",_self.getDayType()[dayType]);
					$grid.jqGrid("setCell",rowid,"firstPreTime",null);
					$grid.jqGrid("setCell",rowid,"lastNextTime",null);
					$grid.jqGrid("setCell",rowid,"standardHour",null);
				}
			}
			if(columnNum==10){
				
				var $table = $('#select_cardRule').specialPromptGrid("getTable");
				
				var cardRule = ids;
				var cardRuleName =$table.jqGrid("getCell",ids,"BaseInfo.name");
				var cardRuleId =$table.jqGrid("getCell",ids,"BaseInfo.id");
				if(cardRule!=null&&cardRule!=""){
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"cardRule_id",cardRuleId);
					$grid.jqGrid("setCell",rowid,"cardRule_name",cardRuleName);
				}
			}
		}
	},
	/**
	 * 对保存、提交的数据进行确认
	 */
	verify: function() {
	//	var shift  = $("#shift_el").val();
		var shift  = $("#shift").attr("shifID");
		var cardRule = $("#cardRule_el").val();
		if(shift || cardRule){
			return true;
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_8});
			return false;
		}
	},
	processF7ChangeEvent : function(){ 
		var that = this;
		/*$('input[name=adminOrgUnit]').shrPromptBox("option", {
			onchange : function(e, value) {
			   var info = value.current;
			   if(info!=null){
			   if(info.longNumber !=null && info.longNumber!=''){ 
			   		$("#adminOrgUnit_longNumber").val(info.longNumber);
			   }
			 }
			}
		});*/
	},
	/*
	* 弹出批量赋值的框
	*/
	addValsPublicAction : function(pageUipk){
		var _self = this;
		$("#iframe2").dialog({
			    title: jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_4,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+55%',
					of: window
				},
				open : function(event, ui) {
				   _self.appendDynamicHTML(this,pageUipk);
			    },
			    close : function() {
				    $("#iframe2").empty();
			    }
			    /**buttons:{
					"批量赋值": function(){
						$(this).disabled = true;
						_self.assginValueAction(pageUipk);
						$("#iframe2").empty();
						$("#iframe2").dialog("close");
					},
					"取消": function(){
						$("#iframe2").empty();
						$("#iframe2").dialog("close");
					}
			    }*/
			});	
			$("#iframe2").css({"height":"250px"});
			$("#iframe2").css({"margin-top":"5px"});
	},
	addValsOnCellSelectPublicAction : function(pageUipk,columnNum,rowid){
		var _self = this;
		$("#iframe2").dialog({
			    title: jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_1,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+55%',
					of: window
				},
				open : function(event, ui) {
				   _self.appendDynamicHTMLOnCellSelect(this,columnNum);
			    },
			    close : function() {
				    $("#iframe2").empty();
			    },
					buttons:[{
						text: jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_1,
						click: function(){
							$(this).disabled = true;
							_self.assginValueOnCellSelectAction(pageUipk,columnNum,rowid);
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					},{
						text: jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_6,
						click: function(){
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					}]
			});	
			$("#iframe2").css({"height":"250px"});
			$("#iframe2").css({"margin-top":"5px"});
	},
	setShiftF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//班次名称
		grid_f7_json = null;
		grid_f7_json = {id:"select_shift",name:"select_shift"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.isInput = false;
		grid_f7_json.subWidgetOptions = {
				title:jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_0,
				//title:"选择日期类型和班次",
				uipk:"com.kingdee.eas.hr.ats.app.AtsShift.list",
				//uipk:"com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list",
				query:"",
				filter:"",
				domain:"",
				multiselect:false,
				onclikFunction: function (ids) {
					_self.setSelectValueToGridCell(rowid,columnNum,cellcontent,e,ids);
				}
			};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '';
		grid_f7_json.value = {id:"",name:""};
		$('#select_shift').shrPromptBox(grid_f7_json);
		$('#select_shift').shrPromptBox("open");
	},
	selectDayTypeAndAtsShift: function(rowid,columnNum,cellcontent,e){
    	var that = this;
		var serviceId = shr.getUrlRequestParam("serviceId");
		var hrOrgUnitObj = shr.getUrlRequestParam("hrOrgUnitObj");
		if(!hrOrgUnitObj){
			var $grid = $("#dataGrid");
			hrOrgUnitObj = '{"id": "'+ $grid.jqGrid("getCell",rowid,"hrOrgUnit_id") + '","name" : "'+$grid.jqGrid("getCell",rowid,"hrOrgUnit_displayName")+'"}';
		}
    	var url = shr.getContextPath()+ '/dynamic.do?method=initalize&flag=turnShiftForCal&serviceId='+encodeURIComponent(serviceId)+''
    								  + '&uipk=com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list'
    								  + '&hrOrgUnitObj='+encodeURIComponent(hrOrgUnitObj);
    	$("#iframe1").attr("src",url);
		$("#iframe1").dialog({
			modal : false,
			title : jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_13,
			width : 1035,
			minWidth : 1035,
			height : 505,
			minHeight : 505,
			open : function(event, ui) {
			},
			close : function() {
				
				  var title = $("#iframe1").attr('title');
				  var shiftID = $("#iframe1").attr('shiftID');
				  if(rowid){
						that.setSelectValueToGridCell2(rowid,columnNum,cellcontent,title,shiftID);
				  }else{ //批量赋值进入	
					  var dayType="";
					  var shiftName="";
					  if(title){
						   dayType = title.substring(1,title.indexOf("]"));
						   shiftName = title.substring(title.indexOf("]")+1,title.length);
					  }
					 
					  
					  $("#shift").val(shiftName);
					  $("#shift").attr("shifID",shiftID);
					  
					  $("#dateType").val(dayType);
					  if(shiftID!="false" && shiftID){
							var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler&method=getShiftItemInfo";
							shr.remoteCall({
								type:"post",
								async:false,
								url:url,
								param:{atsShiftId: shiftID},
								success:function(res){
									$('#cardRule').shrPromptBox("setFilter","startSegmentNum = " + res.records);
								}
							});		
					  }
					  
				  }
			
			
			}
		});
		$('#detailOperationDialog-frame').contents().find($('[aria-describedby="iframe2"]')).prevObject.css({zIndex: 0});
		$("#iframe1").attr("style", "width:1035px;height:505px;");
		$("#iframe1").parent().css("top","2px");
  },
	setCardRuleF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		var $grid = $("#dataGrid");	
		var shiftId=$grid.jqGrid("getCell",rowid,"defaultShift_id");
		var filter="";
		if(shiftId){
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler&method=getShiftItemInfo";
			shr.remoteCall({
				type:"post",
				async:false,
				url:url,
				param:{atsShiftId: shiftId},
				success:function(res){
					filter="startSegmentNum = " + res.records;
				}
			});	
		}
		var hrOrgUnitObj = shr.getUrlRequestParam("hrOrgUnitObj");
		if(!hrOrgUnitObj){
			hrOrgUnitObj = '{"id": "'+ $grid.jqGrid("getCell",rowid,"hrOrgUnit_id") + '","name" : "'+$grid.jqGrid("getCell",rowid,"hrOrgUnit_displayName")+'"}';
		}
		//取卡规则
		grid_f7_json = null;
		grid_f7_json = {id:"select_cardRule",name:"select_cardRule"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.isInput = false;	
		grid_f7_json.subWidgetOptions = {
				title:jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_5,
				uipk:"com.kingdee.eas.hr.ats.app.CardRule.AvailableList.F7",
				query:"",
				filter:"",
				domain:"",
				multiselect:false,
				onclikFunction: function (ids) {
					//_self.setSelectValueToGridCell(rowid,columnNum,cellcontent,e,ids);
					_self.setSelectValueToGridCell2(rowid,columnNum,cellcontent,e,ids);
				}
		};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '';
		grid_f7_json.value = {id:"",name:""};
		grid_f7_json.subWidgetOptions.isHRBaseItem = false;//若为true,specialPromptGrid控件不触发onclikFunction
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = JSON.parse(hrOrgUnitObj).id;
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_12,widgetType: "checkbox"}];
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		$('#select_cardRule').shrPromptBox(grid_f7_json);
		$('#select_cardRule').shrPromptBox("setBizFilterFieldsValues",JSON.parse(hrOrgUnitObj).id);
		$('#select_cardRule').shrPromptBox("setFilter",filter);
		$('#select_cardRule').shrPromptBox("open");
	},
	appendDynamicHTML: function(object,pageUipk){
		var that = this;
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
			 + '<div style=" padding-left: 50px; color: red; ">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_11
			+ '</div>'
			 + '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_2
			+ '</div></div>'
			 + '</div>'
			 + '<div class="row-fluid row-block ">'
			+ '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_7
			+ '">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_7
			+ '</div></div>'
			+ '<div class="col-lg-6 field-ctrl"><div class="ui-text-frame disabled"><input id="dateType" name="dateType" class="block-father input-height" type="text" validate="" ctrlrole="text" disabled="disabled" autocomplete="off"  title=""></div></div>'
			+ '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_0
			+ '">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_0
			+ '</div></div>'
			+ '<div class="col-lg-6 field-ctrl"><input id="shift" name="shift" readonly="readonly" style="cursor:pointer;background-color:#ffffff"  class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'

			+ '</div>'
			+ '<div class="row-fluid row-block ">'
			+ '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_5
			+ '">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_5
			+ '</div></div>'
			+ '<div class="col-lg-6 field-ctrl"><input id="cardRule" name="cardRule" class="block-father input-height" type="text" validate="" ctrlrole="promptBox" autocomplete="off" title=""></div>'
			+ '</div>'
			 + '<div class="row-fluid" align="right">'
			 + '<div  style="padding-right:8%;">'
			 + '<button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_4
			+ '" id="batchAddVal">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_4
			+ ' </button>'
			 + '<button type="button" class="shrbtn-primary shrbtn" name="'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_6
			+ '" id="cancle">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_6
			+ ' </button>'
			 + '</div>'
			 + '</div>'
			 + '</form>'
		$(object).append(
				 html
				 );
			$("#shift").click(function(){
			      that.selectDayTypeAndAtsShift(null,null,null,null);
			});
		// //班次名称
		// grid_f7_json = null;
		// grid_f7_json = {id:"shift",name:"shift"};
		// grid_f7_json.subWidgetName = 'shrPromptGrid';
		// grid_f7_json.subWidgetOptions = {
		// 		title:"班次名称",
		// 		//uipk:"com.kingdee.eas.hr.ats.app.AtsShift.list",
		// 		uipk:"com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list",
		// 		query:"",
		// 		filter:"",
		// 		domain:"",
		// 		multiselect:false
		// 		};
		// grid_f7_json.readonly = '';
		// grid_f7_json.validate = '';
		// grid_f7_json.value = {id:"",name:""};
		// $('#shift').shrPromptBox(grid_f7_json);
		// $("#shift").shrPromptBox("option", {
		// 	onchange : function(e, value) {
		// 		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler&method=getShiftItemInfo";
		// 		shr.remoteCall({
		// 			type:"post",
		// 			async:false,
		// 			url:url,
		// 			param:{atsShiftId: value.current.id},
		// 			success:function(res){
	    //                 $('#cardRule').shrPromptBox("setFilter","startSegmentNum = " + res.records);
		// 			}
		// 		});		
		// 	}		
		// });
		$('button[id^=batchAddVal]').click(function() {
			//var _self = this;
			//$(this).disabled = true;
			jsBinder.disabled=true;
			jsBinder.assginValueAction(pageUipk);
			$("#iframe2").empty();
			$("#iframe2").dialog("close");
		});
		
		$('button[id^=cancle]').click(function() {
			$("#iframe2").empty();
			$("#iframe2").dialog("close");
		});
		//取卡规则
		grid_f7_json = null;
		grid_f7_json = {id:"cardRule",name:"cardRule"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_5,uipk:"com.kingdee.eas.hr.ats.app.CardRule.AvailableList.F7",query:"",filter:"",domain:"",multiselect:false};
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_12,widgetType: "checkbox"}];
		
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '';
		grid_f7_json.value = {id:"",name:""};
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =parent.$('#hrOrgUnit_el').val();
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		$('#cardRule').shrPromptBox(grid_f7_json);
		$('#cardRule').shrPromptBox("setBizFilterFieldsValues",parent.$("#hrOrgUnit_el").val());
		//要将form加上，数据校验才有用。
	    var formJson = {
			id: "form"
		};
		$('#form').shrForm(formJson);
		that.processF7ChangeEvent();
		$('#detailOperationDialog-frame').contents().find($('.ui-widget-overlay')).prevObject.hide();
		
	},
	appendDynamicHTMLOnCellSelect: function(object,columnNum){
		var that = this;
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
			 + '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_2
			+ '</div></div>'
			 + '</div>'
			 + '<div class="row-fluid row-block ">';
		if(columnNum==9){
			 html+='<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_0
				 + '">'
				 + jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_0
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="shift" name="shift" class="block-father input-height" type="text"  ctrlrole="text" autocomplete="off" title="" ></div>'
		}
		if(columnNum==10){
			 html+='<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_5
				 + '">'
				 + jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_5
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input class="block-father input-height cursor-pointer" id="cardRule" name="cardRule" validate="" placeholder="" type="text" dataextenal="" ctrlrole="select"></div>'
		}
		 	html+=  '</div>'
				 + '</form>';
		$(object).append(
				 html
				 );
		if(columnNum==9){
			//班次名称
			grid_f7_json = null;
			grid_f7_json = {id:"shift",name:"shift"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_0,uipk:"com.kingdee.eas.hr.ats.app.AtsShiftForTurnShift.list",query:"",filter:"",domain:"",multiselect:false};
			grid_f7_json.readonly = '';
			grid_f7_json.validate = '';
			grid_f7_json.value = {id:"",name:""};
			$('#shift').shrPromptBox(grid_f7_json);
		}
		if(columnNum==10){
			//取卡规则
			grid_f7_json = null;
			grid_f7_json = {id:"cardRule",name:"cardRule"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_3,uipk:"com.kingdee.eas.hr.ats.app.CardRule.list",query:"",filter:"",domain:"",multiselect:false};
			grid_f7_json.readonly = '';
			grid_f7_json.validate = '';
			grid_f7_json.value = {id:"",name:""};
			$('#cardRule').shrPromptBox(grid_f7_json);
		}
		//要将form加上，数据校验才有用。
	    var formJson = {
			id: "form"
		};
		$('#form').shrForm(formJson);
		that.processF7ChangeEvent();
	},
	/*
	*原来是继承edit的，改成集成list了没有这个方法了，所以手动加上。
	*/
	validate: function() {
		$form = $("#form");
		var flag = $form.wafFormValidator("validateForm", true);
		if (!flag) {
			shr.showWarning({
				message: jsBizMultLan.atsManager_scheduleShiftBatchMaintainBase_i18n_9,
				hideAfter: 5
			});
		}
		
		return flag;
	},
    getDayType: function(){
        return this._dayType;
    },
});
/*
 * 回调针中处理
 */
function closeFrameDlg(ifameid,shiftName,shiftID){
	$('#'+ifameid).attr('title',shiftName);
	$('#'+ifameid).attr('shiftID',shiftID);
    $('#'+ifameid).dialog('close');
}



