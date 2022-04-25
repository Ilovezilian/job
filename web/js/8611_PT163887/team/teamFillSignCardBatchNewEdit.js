var defaultReason = null;
var deletedList = "";//用于存储在数据库中还存在，但是在页面上已删除的分录ID

shr.defineClass("shr.ats.team.TeamFillSignCardBatchNewEdit", shr.ats.atttenceEditFormImport, {
	rowid : "" ,
    cellname : "" ,
    value : "" ,
    iRow : "" ,
	iCol : "" ,
	initalizeDOM : function () {
		var _self = this;	
		shr.ats.team.TeamFillSignCardBatchNewEdit.superClass.initalizeDOM.call(this);
		_self.initUIFormatter();
		_self.setNumberFieldEnable();
		_self.gridCellListener();	
		
		_self.initPageValue();//对前置界面传来的值对全局变量进行赋值
		_self.setButtonVisible();//隐藏按钮
		$('<button type="button" style="margin-left:4px;margin-right:4px" class="shrshrbtn-primary shrbtn" id="orgfill">'
			+ jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_13
			+ '</button>').insertAfter($("#import"));
		if(_self.isFromWF()){
			    $('#breadcrumb li').eq(0)
			    .text(jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_2);
		}
		_self.initOrgfill();
		//隐藏提交生效按钮,取消按钮
		if (_self.getOperateState() == 'EDIT') {			
			if(_self.isFromWF()){ // 来自流程中心
				$('#submitEffect').hide();
				$('#submit')
				.text(jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_24);
				$("#cancelAll").hide();
				$("#hrOrgUnit").shrPromptBox("disable");
			}
		}
		
		
		//审核编辑界面
		if(_self.isFromWF() && _self.getOperateState() == 'EDIT' && $("#billState").val() != 0)
		{
			$('#deleteRow_entries').unbind("click").attr("onclick","").css("cursor","default");
			$('#checkedCard').unbind("click").attr("onclick","").css("cursor","default");
			$('#addRow_entries').unbind("click").attr("onclick","").css("cursor","default");
			$('#import').unbind("click").attr("onclick","").css("cursor","default");
			$(".editGrid-toolbar").hide();
			$("#submit").hide();
			var lastRowNum = $('#entries').getGridParam("reccount");
			for (var i = 1;i<= lastRowNum;i++) {
				var temp_id = $("#entries tr:eq("+ i +")").attr("id");
				$("#entries").jqGrid('setCell',temp_id,'person','','not-editable-cell');
			}	
		}
		//考勤计算--已计算页签--明细显示模式--补签卡按钮进来，只显示提交生效按钮
		if(shr.getUrlParam('fromCalDetail')!=null && shr.getUrlParam('fromCalDetail')=="1"){
			$("#save").hide();
			$("#submit").hide();
			$("#cancelAll").hide();
			$("#import").hide();
			$("#checkedCard").hide();
			$(".view_manager_header > div > div").eq(0).remove();
			$("#submitEffect").addClass("shrbtn-primary");
		}
		//增加业务组织处理
		 _self.processF7ChangeEventHrOrgUnit();
		 var hrOrgUnitId = $("#hrOrgUnit_el").val();
		 _self.initCurrentHrOrgUnit(hrOrgUnitId);

		 // 团队不需要展示这个按钮
		$("#checkedCard").hide();
        _self.initCcPersonPrompt();
	},
    clearCCPersonIdsPrompt :function() {
        atsCcPersonUtils.clearCCPersonIdsPrompt(this);
    },
    initCcPersonPrompt :function() {
        atsCcPersonUtils.initCCPersonIdsPrompt(this);
        if (this.getOperateState() != 'VIEW') {
            var person = $('#proposer').shrPromptBox("getValue");
            if (!person) {
            } else {
                $('#ccPersonIds').shrPromptBox("setOtherParams", {
                    handler: "com.kingdee.shr.ats.web.handler.team.F7.TeamPersonForEmpOrgF7ListHandler",
                    personId: person.id
                });
            }
        }
    }
	,initOrgfill : function(){
		var that = this;	
	var serviceId = shr.getUrlRequestParam("serviceId");
		var url=shr.getContextPath()+'/dynamic.do?checkLicense=true&uipk=com.kingdee.eas.hr.ats.app.FillSignOrgFillForm';
		url += '&serviceId='+encodeURIComponent(serviceId);
		$('#orgfill').click(function(){
				$("#orgFillDiv").attr("src",url);
				var gridNum = $("#entries").getGridParam("reccount");
				$('#hasNum').val(gridNum);
				$('#orgFillDiv').dialog({
						title: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_13,
						width: 1020,
						height: 450,
						modal: true,
						resizable: false,
						position: {
							my: 'center',
							at: 'top+20%',
							of: window
						},
						open: function( event, ui ) {
				 		     
				 		},
						buttons: [{
							text: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_19,
							click: function() {
								//校验F7数据
								if(that.checkF7Data()){
								var oldRowIds = $("#entries").getDataIDs();
								that.fillGrid();
								var newRowIds = $("#entries").getDataIDs();
								//检查不超过100条记录
								//that.checkRowIsOver();
								$(this).dialog( "close" );
								}else{
									return;
								}
							}
						},{
							text: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_7,
							click: function() {
								$(this).dialog( "close" );
							}
						}]
				 		
				});
				
			$("#orgFillDiv").attr("style","width:1020px;height:450px;");
			
			
		});
	
	
	}, fillGrid: function () {
		var that = this;
		var holidayType_el = $(window.frames["orgFillDiv"].document).find("#bill_hrOrgUnit_el").val();
		var adminOrgUnit_el = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit_el").val();
		var adminOrgUnit = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit").val();
		var proposer_el = $(window.frames["orgFillDiv"].document).find("#person_el").val();
		var proposer = $(window.frames["orgFillDiv"].document).find("#person").val();
		var fillCardTimeStr = $(window.frames["orgFillDiv"].document).find("#fillCardTimeStr").val();
		var attendDate = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("attendDate");
		var type_el = $(window.frames["orgFillDiv"].document).find("#type_el").val();
		var remark = $(window.frames["orgFillDiv"].document).find("#remark").val();
		var reason = $(window.frames["orgFillDiv"].document).find("#reason").val();
		var reason_el = $(window.frames["orgFillDiv"].document).find("#reason_el").val();
		var type = $(window.frames["orgFillDiv"].document).find("#type").val();
		var setType = $(window.frames["orgFillDiv"].document).find("#setType").val();
		var attencegroupId = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup_el").val();
		that.remoteCall({
			type: "post",
			async: false,
			method: "getPersonsByOrgUnit",
			param: { attencegroupId: attencegroupId,orgUnitId: adminOrgUnit_el, personIds: proposer_el, setType: setType ,currentPagePermItemId:shr.getUrlParams().serviceId},
			success: function (res) {
				info = res;
				var personColl = jQuery.parseJSON(info.personColl);
				$.each(personColl, function (n, value) {

//					var holidayTypeString = ' "policy" : { "id": "'
//						+ holidayType_el
//						+ '", "name": "'
//						+ holidayType
//						+ '"}';
					var adminOrgUnitString = ' "adminOrgUnit" : { "id": "'
						+ adminOrgUnit_el
						+ '", "name": "'
						+ adminOrgUnit
						+ '"}';
					//姓名包含引号特殊处理，不处理的话下面jQuery.parseJSON(dataString)	回报错---BT1363403
					if(value.name.indexOf('"')!=-1){
						value.name=value.name.replace(/"/g,"\\\\\\\"");
					}
					var proposerString = ' "person" : { "id": "'
						+ value.id
						+ '", "name": "'
						+ value.name
						+ '"}';

					var attendDateString = ' "attendDate" : "' + attendDate + '"';
					var fillCardTimeStrString = ' "fillCardTimeStr" : "' + fillCardTimeStr + '"';
//					var typeString = ' "type" : { "id": "'
//						+ type_el
//						+ '", "name": "'
//						+ type
//						+ '"}';
					var typeString = ' "type" : "' + type_el + '"';
					var reasonString = ' "reason" : { "id": "'
						+ reason_el
						+ '", "name": "'
						+ reason
						+ '"}';
					var remarkString = ' "remark" : "' + remark + '"';

					var dataString = ' { "data" : {'
//						+ holidayTypeString + ', '
						+ adminOrgUnitString + ', '
						+ proposerString + ', '
						+ attendDateString + ', '
						+ fillCardTimeStrString + ', '
						+ typeString + ', '
						+ remarkString + ', '
						+ reasonString + '}} ';

					var dataJson = jQuery.parseJSON(dataString);
					$("#entries").jqGrid('addRow', dataJson);
					//点击序号列 让人员失去焦点
					$("#entries tr:eq(1) td:eq(0)").click();

				});


			}
		});
		

	},getFillRowId:function(oldRowIds,newRowIds){
		var size = newRowIds.length;
		var sizeOld = oldRowIds.length;
		if(sizeOld == 0){
			return newRowIds;
		}
		var  rowIds = [];
		for(var i=0;i<size;i++){
		  if(i>=sizeOld){
		       rowIds.push(newRowIds[i]);   
		   }
		}
		return rowIds ;
	}, checkF7Data: function () {
		var that = this;
		var holidayType_el = $(window.frames["orgFillDiv"].document).find("#bill_hrOrgUnit_el").val();
		var adminOrgUnit_el = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit_el").val();
		var adminOrgUnit = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit").val();
		var proposer_el = $(window.frames["orgFillDiv"].document).find("#person_el").val();
		var proposer = $(window.frames["orgFillDiv"].document).find("#person").val();
		var fillCardTimeStr = $(window.frames["orgFillDiv"].document).find("#fillCardTimeStr").val();
		var attendDate = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("attendDate");
		var type_el = $(window.frames["orgFillDiv"].document).find("#type_el").val();
		var remark = $(window.frames["orgFillDiv"].document).find("#remark").val();
		var reason = $(window.frames["orgFillDiv"].document).find("#reason").val();
		var reason_el = $(window.frames["orgFillDiv"].document).find("#reason_el").val();
		var type = $(window.frames["orgFillDiv"].document).find("#type").val();
		var setType = $(window.frames["orgFillDiv"].document).find("#setType").val();
		var attencegroupId = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup_el").val();
		var remain = $(window.frames["orgFillDiv"].document).find("#remain").text();
		var checkAmount = $(window.frames["orgFillDiv"].document).find("#checkAmount").text();
		var attencegroup_el = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup_el").val();
		var prop_attencegroup = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup").val();
		//校验
		if (parseInt(checkAmount) > parseInt(remain)) {
			shr.showWarning({ message: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_31 });
			return false;
		}
		//校验
		if (attendDate == undefined || attendDate == null || attendDate == "") {
			shr.showWarning({ message: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_8 });
			return false;
		}

		if ((adminOrgUnit_el == undefined || adminOrgUnit_el == null || adminOrgUnit_el == ""
			|| adminOrgUnit == undefined || adminOrgUnit == null || adminOrgUnit == "")
			&& (proposer_el == undefined || proposer_el == null || proposer_el == ""
				|| proposer == undefined || proposer == null || proposer == "")
				&& (attencegroup_el == undefined || attencegroup_el == null || attencegroup_el == ""
				|| prop_attencegroup == undefined || prop_attencegroup == null || prop_attencegroup == "")) {
			shr.showWarning({ message: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_29 });
			return false;
		}

		if (type_el == undefined || type_el == null || type_el == "" ||
			type == undefined || type == null || type == "") {
			shr.showWarning({ message: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_0 });
			return false;
		}

		if (fillCardTimeStr == undefined || fillCardTimeStr == null || fillCardTimeStr == "") {
			shr.showWarning({ message: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_1 });
			return false;
		}

		if (reason == undefined || reason == null || reason == ""
		|| reason_el == undefined || reason_el == null || reason_el == "") {
			shr.showWarning({ message: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_3 });
			return false;
		}

		return true;
	}
	,processF7ChangeEventHrOrgUnit : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					if(null != info){
						that.initCurrentHrOrgUnit(info.id);
					}
//					that.emptyHrOrgBasedEntryData();
					// $("#entries_person_number").val("");
					// $("#entries_adminOrgUnit").val("");
					// $("#entries_position").val("");
					
				}
			});
		}
	},
	
	/**
	 * 新增行
	 */
	addRowAction: function(event) {
		_self.setDefaultValue();//设置默认值
		var source = event.currentTarget,
			$editGrid = this.getEditGrid(source);
		
		var data = this.createNewEntryModel();
		if (typeof data === 'undefined') {
			data = {};
		}
		
		var editGridCont = this._getEditGridCont(source);
		if (editGridCont.data('editType') == 'inline') {
			// 表格内编辑
			$editGrid.jqGrid('addRow', { data: data	});
		} else {
			$editGrid.wafGrid('addForm');
		}
		
		var event = document.createEvent('HTMLEvents');
	   	    event.initEvent("editComplete_"+$editGrid.attr("id"), true, true);
		    event.eventType = 'message';
		    document.dispatchEvent(event);
	}
	,initCurrentHrOrgUnit: function(hrOrgUnitId) {
		var that = this;
		// $("#entries_person").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
	}
	//切换业务组织，清空分录与业务组织相关的字段：人员、补签卡原因
//	,emptyHrOrgBasedEntryData : function(){
//		$("#entries").find('[aria-describedby=entries_person], [aria-describedby=entries_reason]').text("");	
//	}
	,initQuerySolutionHrOrgUnit: function(hrOrgUnitId) {
		 var that = this;
		 that.remoteCall({
			type:"post",
			method:"initQuerySolution",
			param:{
				hrOrgUnitId : hrOrgUnitId
			},
			async: true, 
			success:function(res){
				
			}
		});
	}
	
	//对界面进行格式化
	,initUIFormatter : function(){
		var _self = this;
		var classfullNameService = "com.kingdee.shr.ats.web.formEditImport.FillSignCardFileEditFormService";
		//界面微调
		$('#breadcrumb li').eq($('#breadcrumb li').length-1)
			.text(jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_2);
		//$('#number').parent().css('width','285px');
		//导入
		$('<button type="button" style="margin-left:4px;margin-right:4px;display: none" class="shrshrbtn-primary shrbtn" id="import">'
			+ jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_5
			+ '</button>').insertAfter($("#addRow_entries"));
		//缺卡检查
		$('<button type="button" style="margin-left:4px;margin-right:4px" class="shrshrbtn-primary shrbtn" id="checkedCard">'
			+ jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_17
			+ '</button>').insertAfter($("#import"));
		$('.editGrid-toolbar').append('<div style="display: inline;padding-left: 20px;">'
			+ jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_30
			+ '<div><div id="hasNum"></div>');
		$('#import').click(function(){
			_self.importAction(null,classfullNameService);
		})
		$('#checkedCard').click(function(){
			if($('#hrOrgUnit_el').val()==null || $('#hrOrgUnit_el').val()==""){
				if($('#hrOrgUnit').val()==null || $('#hrOrgUnit').val()=="" ){
					shr.showWarning({message: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_15});
					return;
				}
			}
			_self.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.LackPunchCardChecked.list",
			hrOrgUnit:$('#hrOrgUnit_el').val()==null?$('#hrOrgUnit').val():$('#hrOrgUnit_el').val()
			});
		})
	}
	
	//编辑页面按钮隐藏
	,setButtonVisible:function(){
		var billState = $("#billState").val();
		//alert(billState);
		if (billState) {
			if (billState==3 || jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_21==billState || billState ==4
				||jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_20==billState || billState ==2
				||jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_22==billState ) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1==billState || jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_25== billState || 2 == billState
				|| jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_22==billState ) { //未审批或审批中
				if(!this.isFromWF()){
					$("#edit").hide();
					$("#submit").hide();
					$("#submitEffect").hide();
				}
			}
		}
		// 团队-按钮控制
		if (!this.initData.teamEditAble) {
			$("#edit").hide();
			$("#submit").hide();
			$("#submitEffect").hide();
		}
		if (this.getOperateState().toUpperCase() == 'VIEW') { //查看状态下不允许提交
			//不允许提交生效
			$("#submitEffect").hide();
		}
		if(this.isFromWF()){
		    $("#cancelAll").hide();
		}
	}
	
	
	,assembleModel: function() {
	    
		var model = shr.ats.team.TeamFillSignCardBatchNewEdit.superClass.assembleModel.call(this);
		//审核编辑界面重新点击出差类型 josn 转换出错
		if(this.isFromWF() || shr.getUrlParam('fromCalDetail')=="1")
		{
		
		  var lastRowNum = $('#entries').getGridParam("reccount");
		     
		    for(var i = 0; i < lastRowNum; i++ )
		    {
		       if(model.entries[i] != undefined){
			       delete  model.entries[i].reason.state 
			   }
		    }
		}
        model.ccPerson = model.ccPersonIds;
		return model ;
	}
	
	/**
	 * 点击取消按钮 返回到补签卡列表list(专员) ||  com.kingdee.eas.hr.ats.app.team.FillSignCard.list
	 */
	,cancelAllAction:function(){	
	 	/*window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.team.FillSignCard.list";*/
		var _self = this ;
	 	_self.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.team.FillSignCard.list',
			serviceId: shr.getUrlRequestParam("serviceId")
		});
	}
	
	/**
	 * 提交生效
	 * 重写此方法的校验调用方法
	 */
	,submitEffectAction : function (event) {
		var _self = this;
		if (_self.validate() && _self.verify()) {
			if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
				shr.showConfirm(jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_6, function() {
					_self.prepareSubmitEffect(event, 'submitEffect');
				});
			}else{
				shr.showConfirm(jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_10, function() {
					_self.prepareSubmitEffect(event, 'submitEffect');
				});
			}
		}	
	}
	
	
	/**
	 * 删除行
	 * 重写此方法，删除前先保存分录ID（只保存已存在数据库分录）
	 */
	,deleteRowAction: function(event) {
		var _self = this;	
		var $editGrid = this.getEditGrid(event.currentTarget);
		var ids = $editGrid.jqGrid('getSelectedRows');
		if (ids) {
			_self.beforeDeleteRow(ids);
			for (var i = ids.length - 1; i >= 0; i--) {
				$editGrid.jqGrid('delRow', ids[i]);
			}
		}		
	}
	
	//删除前做保存操作，只保存存在数据库中的（未保存的数据id位数不会超过100）
	,beforeDeleteRow : function(ids) {
		for (var i = ids.length - 1; i >= 0; i--) {
			if (ids[i].length>3){
				deletedList += (ids[i]+",");
			}
		}
	}
	
	
	,prepareSubmitEffect : function (event, action){
		var _self = this;
		var data = _self.assembleSaveData(action);
		
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
				//考勤计算--已计算页签--明细显示模式--请假按钮进来，提交生效后直接返回列表
				if(shr.getUrlParam('fromCalDetail')!=null && shr.getUrlParam('fromCalDetail')=="1"){
					_self.cancelAllAction();
				}
				else{
					_self.back();
				}
			}
		});	
	}
	
	
	/**
	 * 提交工作流
	 * 重写此方法的校验调用方法
	 */
	,submitAction: function(event) {
		var _self = this;
		if (_self.validate() && _self.verify()) {
			shr.showConfirm(jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_9, function() {
				_self.doSubmit(event, 'submit');
			});
		}		
	}
	
	/**
	 * 设置编码字段是否可编辑
	 */
	,setNumberFieldEnable : function() {
		var that = this ;
		if (that.getOperateState().toUpperCase() == 'EDIT' ||　that.getOperateState().toUpperCase() == 'ADDNEW') {
			var fillSignNumberFieldCanEdit = that.initData.fillSignNumberFieldCanEdit;
			if (typeof fillSignNumberFieldCanEdit != 'undefined' && !fillSignNumberFieldCanEdit) {
				that.getField('number').shrTextField('option', 'readonly', true);
			}
		}
	}
	
	/**
	 * 设置分录行的默认值。重写框架此方法
	 * 规则：依据上一条复制除了员工信息、出差天数之外的基础信息
	 */
	,createNewEntryModel: function() {
		var lastRowNum = $('#entries').getGridParam("reccount");
		if (lastRowNum>=100) {
			shr.showWarning({message:jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_26,hideAfter:5});
			return false;
		} else {
			$("#entries").editCell(lastRowNum, 2, true);//需要将编辑焦点移动到不需复制的字段，否则会出现异常
			if (lastRowNum<1) return {type:"1",reason:defaultReason};
			else {
				var temp_id = $("#entries tr:eq("+ lastRowNum +")").attr("id");
				var lastAttendDate = $("#entries").jqGrid("getRowData", temp_id).attendDate;
				var lastfillCardTimeStr = $("#entries").jqGrid("getRowData", temp_id).fillCardTimeStr;
				var lastType = $("#entries").jqGrid("getRowData", temp_id).type;
				var lastReason = $("#entries").jqGrid("getRowData", temp_id).reason;
				var lastRemark = $("#entries").jqGrid("getRowData", temp_id).remark;
				return {attendDate:lastAttendDate,fillCardTimeStr:lastfillCardTimeStr,type:lastType,reason:lastReason,remark:lastRemark};
			}		
		}		
	}
	
	//给补签时间点增加背景提示信息,补签时间点合法性校验
	//备注不能超过255个字符
	,gridCellListener : function(){
		var _self=this;
		var grid=$("#entries");
		grid.jqGrid("option", {
			  afterEditCell:function (rowid, cellname, value, iRow, iCol) {
					if(cellname=="fillCardTimeStr"){
						$("#"+iRow+"_fillCardTimeStr").attr("placeholder",jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_23);
					}
					_self.saveEditCellValue(rowid,cellname, value,iRow,iCol) ;
					if(cellname=="person"){
					var hrOrgUnitId=$("#hrOrgUnit_el").val();
					$(document.getElementById(rowid+"_person")).shrPromptBox().attr("data-params",hrOrgUnitId);
					//$("#"+rowid+"_person").shrPromptBox().attr("data-params",hrOrgUnitId);
				}
			  }
			  ,afterSaveCell:function(rowid, cellname, value, iRow, iCol) {
			  
				  _self.afterSaveCellTrigger(rowid, cellname, value, iRow, iCol);
				  
		}
	});
  }
	,afterSaveCellTrigger : function(rowid, cellname, value, iRow, iCol)
	{
		 var _self=this;
		 var grid=$("#entries");
		  if(cellname=="fillCardTimeStr"){
				var formatValue=value.trim().replace("：",":");//去掉前后空格，符号转换
				var res = _self.fillCardTimeStrVerify(formatValue);
				if (!res){
					shr.showWarning({message:shr.formatMsg(jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_12,[value])});
					grid.jqGrid("setCell",rowid,"fillCardTimeStr","","","",true);
				}else grid.jqGrid("setCell",rowid,"fillCardTimeStr",formatValue);
				
				/* var attendDate=grid.jqGrid("getCell",rowid,"attendDate");
				attendDate = attendDate.substr(0,10);
				var date = attendDate +  " " + formatValue +":00";
				if(new Date().getTime() - new Date(Date.parse(date)).getTime() <= 0){
					shr.showWarning({message:"不允许提前申请补签卡业务！",hideAfter:5});
					grid.jqGrid("setCell",rowid,"attendDate","","","",true);
				}else grid.jqGrid("setCell",rowid,"attendDate",attendDate); */
		  }
		 if(cellname=="remark"){
			  var remarkLen = value.length;					    
				if (remarkLen>255){
					shr.showWarning({message:jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_11});
					grid.jqGrid("setCell",rowid,"remark","","","",true);
				}
		}
		/* if(cellname=="attendDate"){
				if(new Date().getDate()-new Date(Date.parse(value)).getDate()<0){
					shr.showWarning({message:"不允许提前申请补签卡业务！",hideAfter:5});
					grid.jqGrid("setCell",rowid,"attendDate","","","",true);
				}else grid.jqGrid("setCell",rowid,"attendDate",value);
		} */
	}
	//对前置界面传来的值对全局变量进行赋值
	,initPageValue : function(){
		var _self = this;
		var url = document.referrer;
		if  (url.indexOf("LackPunchCardChecked")!=-1){
			var fillFlag = getCookie("fillFlag");
			if (fillFlag==1){
			openLoader(1,jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_28);
				_self.remoteCall({
					type:"post",
					method:"getFillCardInfoFromSession",
					async: false,
					param:{
					},
					success:function(res){
						var info =  res;
						if (null != info && info.resFlag==1){
							//设置考勤组织
							var hrOrgValue = {
									id : null==info?"":info.hrOrgUnitId,
									name : null==info?"":info.hrOrgUnitName
								};
							$('#hrOrgUnit').shrPromptBox("setValue", hrOrgValue);
							
							var proposerID = decodeURIComponent(info.proposerID).split(",");
							var proposerName = decodeURIComponent(info.proposerName).split(",");	
							var proposerNumber = decodeURIComponent(info.proposerNumber).split(",");	
							var attendDate = decodeURIComponent(info.attendDate).split(",");	
							var lackPunchCardTime = decodeURIComponent(info.lackPunchCardTime).split(",");
							var reasonName = decodeURIComponent(info.reasonName).split(",");
							var reasonId = decodeURIComponent(info.reasonId).split(",");
							var len = proposerID.length;
							for (var i =0;i<len;i++){
								var personObj = {id:proposerID[i],number:proposerNumber[i],name:proposerName[i]};
								var reason = {id:reasonId[0],name:reasonName[0]};
								var dataRowObj = {person:personObj,attendDate:attendDate[i],fillCardTimeStr:lackPunchCardTime[i],type:"1",reason:reason};
								$("#entries").jqGrid("addRow",{data:dataRowObj});
							}
						}else {
							shr.showWarning({message:jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_18,hideAfter:5});
						}
						
						deleteCookie("fillFlag");//标记cookie中的内容含有缺卡检查页面设置的值
						closeLoader();
					},
					error: function(msg){
						shr.showWarning({message:jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_18,hideAfter:5});
					}
				});
			}
	
		}
	}
	
	//严格判断是否是hh:mm的格式（24小时制）
	,fillCardTimeStrVerify:function(value){
		var v=value||'';
	    if(/(([0-1]\d)|(2[0-4])):[0-5]\d/.test(v)&&v.length==5){
		  var h=new Number(v.substr(0,2));
		  if(h<24)
			return true;
		  else
			return false;
	    }else{
		   return false;
	    }
	}
	
	//重写表单验证方法
	,verify:function(){
			var _self = this;
			return _self.checkAttendDate() && _self.rowCountVerify() && _self.attendanceFileVerify()
			&& _self.dateInterleaveVerify() && _self.DBdateInterleaveVerify() && _self.fillSignCardTimesControl() && _self.verifyIsFillSignCard();
	}
	
	,verifyIsFillSignCard : function(){
		var that = this;
		if(that.isFromWF()) 
		{
			var model = that.getCurrentModel(); 
			that.remoteCall({
			    method:"validateIsFillSignCard",
			    param:{model:model},
				async: false,
			    success:function(res){
					info =  res;
					if(res.errorString){
						  shr.showError({message:res.errorString});
						  return false;
					}
			    }
			}); 
			
		}
		return true ;
	}
	//对补签卡日期做检验
	,checkAttendDate: function(){
		var time = true;
		var _self = this;
		_self.removeInterleaveStyleChange();//先去除原本的个性化提示，以免提示出现覆盖
		var obj = $('#entries').jqGrid("getRowData");
		jQuery(obj).each(function(n){
			var attendDate = obj[n].attendDate.substr(0,10)+" ";
			var fillCardTimeStr = obj[n].fillCardTimeStr+":00";
			var fillTime = attendDate + fillCardTimeStr;
			if(new Date().getTime() - new Date(Date.parse(fillTime)).getTime() <=0){
				_self.dateInterleaveStyleChangeThree(n+1);
				time =false;
			}
			var reasonId=obj[n].reason.id;
			 var isAdvanceAllow=false;
		    if(reasonId!=null && reasonId!=""){
		    	shr.remoteCall({
					url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.FillSignReasonListHandler",
					type:"post",
					method:"getReasonById",
					param:{
						id:reasonId
					},
					async: false,
					success:function(res){
						isAdvanceAllow=res.isAdvanceAllow;
					}
				});
		    }
		    if(isAdvanceAllow==true){
		    	time =true;
		    }
		});
		return time;
	}
	//至少录入一条分录,最多不得超过100条
	,rowCountVerify:function(){
			var _self = this;
			var rows = $('#entries').getGridParam("reccount");
			if  (rows<1) {
				shr.showWarning({message:jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_16});
				return false;
			} else if (rows>100){
				shr.showWarning({message:jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_31});
				return false;
			} else return true;
			
	}
	//校验档案历史	
	,attendanceFileVerify:function (){
		var _self = this;
		var info;
		_self.removeInterleaveStyleChange();//先去除原本的个性化提示，以免提示出现覆盖
		var rows = $('#entries').getGridParam("reccount");
		if  (rows>0){
			var id="",rowNum="",personID="",fillCardTime="",delimiter=",";
			//封装校验表单数组对象
			for (var i=1;i<=rows;i++){
				var tempId=$("#entries tr").eq(i).attr("id");
				var tempPersonId=$("#entries").jqGrid("getCell", tempId,"person").id;
				//var tempFillCardTime = $("#entries").jqGrid("getCell", tempId,"fillCardTime");
				var tempFillCardTime = $("#entries").jqGrid("getCell", tempId,"attendDate").substring(0,10)+" "+$("#entries").jqGrid("getRowData", tempId).fillCardTimeStr+":00"

				id +=(tempId+delimiter);
				rowNum += (i+delimiter);
				personID += (tempPersonId+delimiter);
				fillCardTime +=(tempFillCardTime+delimiter);
					
			}
			//把最后一个分隔符去掉
			id = id.substring(0,id.length-1);
			rowNum = rowNum.substring(0,rowNum.length-1);
			personID = personID.substring(0,personID.length-1);
			fillCardTime = fillCardTime.substring(0,fillCardTime.length-1);
			if($('#hrOrgUnit_el').val()==null || $('#hrOrgUnit_el').val()==""){
				if($('#hrOrgUnit').val()==null || $('#hrOrgUnit').val()=="" ){
					shr.showWarning({message: jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_15});
					return;
				}
			}
			_self.remoteCall({
				type:"post",
				method:"isAttenceChecked",
				async: false,
				param:{
					delimiter:delimiter,
					id:id,
					rowNum:rowNum,
					personID:personID,
					fillCardTime:fillCardTime,
					hrOrgUnit:$('#hrOrgUnit_el').val()==null?$('#hrOrgUnit').val():$('#hrOrgUnit_el').val()
				},
				success:function(res){
					info =  res;
					
				}
				});
				if (!info.errorTag) {
						var showMes="";
						showMes+=info.errorLog.replace(/!/g,"!</br>");
					    shr.showWarning({message:showMes});
						return false;
					} else {
						return true;
					}
		} else return true;
	}
	
	//当前表单远程校验，出差单同一个人开始结束时间段不能有重叠	
	,dateInterleaveVerify:function (){
		var _self = this;
		var info;
		_self.removeInterleaveStyleChange();//先去除原本的个性化提示，以免提示出现覆盖
		var rows = $('#entries').getGridParam("reccount");
		if  (rows>1){
			var id="",rowNum="",personID="",fillCardTime="",delimiter=",";
			//封装校验表单数组对象
			for (var i=1;i<=rows;i++){
				var tempId=$("#entries tr").eq(i).attr("id");
				var tempPersonId=$("#entries").jqGrid("getCell", tempId,"person").id;
				//var tempFillCardTime = $("#entries").jqGrid("getCell", tempId,"fillCardTime");
				var tempFillCardTime = $("#entries").jqGrid("getCell", tempId,"attendDate").substring(0,10)+" "+$("#entries").jqGrid("getRowData", tempId).fillCardTimeStr+":00"

				id +=(tempId+delimiter);
				rowNum += (i+delimiter);
				personID += (tempPersonId+delimiter);
				fillCardTime +=(tempFillCardTime+delimiter);
					
			}
			//把最后一个分隔符去掉
			id = id.substring(0,id.length-1);
			rowNum = rowNum.substring(0,rowNum.length-1);
			personID = personID.substring(0,personID.length-1);
			fillCardTime = fillCardTime.substring(0,fillCardTime.length-1);

			_self.remoteCall({
				type:"post",
				method:"pageDataRepeatChecked",
				async: false,
				param:{
					delimiter:delimiter,
					id:id,
					rowNum:rowNum,
					personID:personID,
					fillCardTime:fillCardTime	
				},
				success:function(res){
					info =  res;
					
				}
				});
				if (!info.errorTag) {
						var showMes="";
						_self.dateInterleaveStyleChange(info);
						showMes+=info.errorLog.replace(/!/g,"!</br>");
					    shr.showWarning({message:showMes});
						return false;
					} else {
						return true;
					}
		} else return true;
	}
	
	//数据库远程校验，出差单同一个人开始结束时间段不能有重叠	
	,DBdateInterleaveVerify:function (){
		var _self = this;
		var info;
		_self.removeInterleaveStyleChange();//先去除原本的个性化提示，以免提示出现覆盖
		var rows = $('#entries').getGridParam("reccount");
		if  (rows>0){
			var id="",rowNum="",personID="",fillCardTime="",delimiter=",";
			//封装校验表单数组对象
			for (var i=1;i<=rows;i++){
				var tempId=$("#entries tr").eq(i).attr("id");
				var tempPersonId=$("#entries").jqGrid("getCell", tempId,"person").id;
				//var tempFillCardTime = $("#entries").jqGrid("getCell", tempId,"fillCardTime");
				var tempFillCardTime = $("#entries").jqGrid("getCell", tempId,"attendDate").substring(0,10)+" "+$("#entries").jqGrid("getRowData", tempId).fillCardTimeStr+":00"

				id +=(tempId+delimiter);
				rowNum += (i+delimiter);
				personID += (tempPersonId+delimiter);
				fillCardTime +=(tempFillCardTime+delimiter);
					
			}
			//把最后一个分隔符去掉
			id = id.substring(0,id.length-1);
			rowNum = rowNum.substring(0,rowNum.length-1);
			personID = personID.substring(0,personID.length-1);
			fillCardTime = fillCardTime.substring(0,fillCardTime.length-1);
					
			var deletedFlag = false;
			if (deletedList!=""){
				deletedList = deletedList.substring(0,deletedList.length-1);
				deletedFlag = true;
			}

			_self.remoteCall({
				type:"post",
				method:"DBDataRepeatChecked",
				async: false,
				param:{
					delimiter:delimiter,
					id:id,
					rowNum:rowNum,
					personID:personID,
					fillCardTime:fillCardTime,
					deletedFlag : deletedFlag,
					deletedList:deletedList
				},
				success:function(res){
					info =  res;
				}
				});
				if (!info.errorTag) {
						var showMes="";
						_self.dateInterleaveStyleChangeTwo(info);
						showMes+=info.errorLog.replace(/!/g,"!</br>");
					    shr.showWarning({message:showMes});
						return false;
					} else {
						return true;
			}
		} else return true;
	},
	// 获取表格序号列，修复平台表格序号列位置移动导致的提示列位置错误导致的显示异常bug
	getColNumIndex:function (){
		var _self = this;
		if(_self.colNumIndex){
			return _self.colNumIndex
		}
		$.each($("#entries").jqGrid("getAllColumn"),function(index,item){
			if(item.name=="rn"){
				_self.colNumIndex=index	
			}
		})
		return _self.colNumIndex
	}
	,dateInterleaveStyleChangeThree:function(iRow){
		var rnColNum=this.getColNumIndex()
		$("#entries tr:eq("+iRow+") td:eq("+rnColNum+")").html("！").css("color","red").attr({"data-toggle":"tooltip","data-placement":"left",
			"title":jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_4});
		$("#entries tr:eq("+iRow+") td:eq(2)").css("color","red");
		$("#entries tr:eq("+iRow+") td:eq(3)").css("color","red");
		$("#entries tr:eq("+iRow+") td:eq(4)").css("color","red");
	}
	//对校验结果进行页面个性化提示
	 ,dateInterleaveStyleChange:function(res){
		var rnColNum=this.getColNumIndex()
		var data = res.errorLog.split("!");
		for (var i = 0;i<data.length;i++){
			if (data[i]!=null &&data[i]!=""){
				var dataSplit = data[i].split(" ");
				var errorRow = dataSplit[1];
				var interleaveRow="";
				for (j=3;j<dataSplit.length-1;j++){
					interleaveRow+=dataSplit[j]+",";
				}
				interleaveRow=interleaveRow.substring(0,interleaveRow.length-1);
				$("#entries tr:eq("+errorRow+") td:eq("+rnColNum+")").html("！").css("color","red").attr({"data-toggle":"tooltip","data-placement":"left",
					"title":shr.formatMsg(jsBizMultLan.atsManager_FillSignCardBatchNewEdit_i18n_27,[interleaveRow])});
				$("#entries tr:eq("+errorRow+") td:eq(2)").css("color","red");
				$("#entries tr:eq("+errorRow+") td:eq(3)").css("color","red");
				$("#entries tr:eq("+errorRow+") td:eq(4)").css("color","red");
			}
		}
	}
	//对校验结果进行页面个性化提示
	 ,dateInterleaveStyleChangeTwo:function(res){
		var rnColNum=this.getColNumIndex()
		var data = res.errorLog.split("!");
		for (var i = 0;i<data.length;i++){
			if (data[i]!=null &&data[i]!=""){
				var dataSplit = data[i].split(" ");
				var errorRow = dataSplit[1];
				$("#entries tr:eq("+errorRow+") td:eq("+rnColNum+")").html("！").css("color","red").attr({"data-toggle":"tooltip","data-placement":"left","title":data[i]});
				$("#entries tr:eq("+errorRow+") td:eq(2)").css("color","red");
				$("#entries tr:eq("+errorRow+") td:eq(3)").css("color","red");
				$("#entries tr:eq("+errorRow+") td:eq(4)").css("color","red");
			}
		}
	}

	//去除个性化展示，每次校验前去除
	,removeInterleaveStyleChange:function(){
		var rnColNum=this.getColNumIndex()
		var rows = $('#entries').getGridParam("reccount");
		for (var i=1;i<=rows;i++){
			$("#entries tr:eq("+i+") td:eq("+rnColNum+")").html(i).removeAttr("data-toggle").removeAttr("data-placement").removeAttr("title");
			$("#entries tr:eq("+i+") td").css("color","rgb(153, 153, 153)");//如果设置成css("color","initial")会变成黑色，而原界面为灰色
		}
		
	}
	
	,setImportSelfParam : function(){
		return $('#entries').getGridParam("reccount");
	}
	
	
	//补签次数限制校验
	,fillSignCardTimesControl:function (){
		var _self = this;
		var info;
		_self.removeInterleaveStyleChange();//先去除原本的个性化提示，以免提示出现覆盖
		
		var rows = $('#entries').getGridParam("reccount");
		if  (rows>0){
			var id = "", rowNum = "", personID = "", attendDate = "", delimiter = ",";
			//封装校验表单数组对象
			for (var i=1;i<=rows;i++){
				var tempId=$("#entries tr").eq(i).attr("id");
				var tempPersonId=$("#entries").jqGrid("getCell", tempId,"person").id;
				var tempAttendDate = $("#entries").jqGrid("getCell", tempId,"attendDate").substring(0,10);

				id += (tempId + delimiter);
				rowNum += (i + delimiter);
				personID += (tempPersonId + delimiter);
				attendDate += (tempAttendDate + delimiter);
					
			}
			//把最后一个分隔符去掉
			rowNum = rowNum.substring(0,rowNum.length-1);
			personID = personID.substring(0,personID.length-1);
			attendDate = attendDate.substring(0,attendDate.length-1);
					
			_self.remoteCall({
				type:"post",
				method:"fillSignCradTimesControl",
				async: false,
				param:{
					rowNum:rowNum,
					personID:personID,
					attendDate:attendDate
				},
				success:function(res){
					info =  res;
					
				}
				});

			}
			
			if (info.errorFlag) return true;
			else{
				_self.removeInterleaveStyleChange();
				_self.fillSignCardTimesControlStyleChange(info.errorMap);
			}
	}
	
	//对校验结果进行页面个性化提示
	 ,fillSignCardTimesControlStyleChange:function(errorMap){
		var rnColNum=this.getColNumIndex()
	 	for (var key in errorMap){
	 		var value = errorMap[key];
	 		$("#entries tr:eq("+key+") td:eq("+rnColNum+")").html("！").css("color","red").attr({"data-toggle":"tooltip","data-placement":"left","title":value});
	 	}
	 }
	 
	 ,_getHROrgF7DataValue:function(url,filter,hrOrgIdField,uipk,cacheObj){
		  var self = this;
		  var opt = self._assemblReqOptions(url,filter,hrOrgIdField,uipk,cacheObj);
	  	  opt.success = function( data ){
			  if(!self._isEmptyCache(cacheObj)){// 如果有缓存,是否在 data中
				  if( data && data.rows.length ){// 说明在缓存data中
					  promptBoxBizService._setHROrgValue(hrOrgIdField,cacheObj);
				  }else{
					  // delete filter 
					  opt.data.filter = "";
					  self._getHROrgF7ByAjax( opt,data,hrOrgIdField);
				  }
			  }else{// 没有在缓存
				  self._getHROrgF7ByAjax( opt,data,hrOrgIdField );
			  }
		  };
		  shr.doAjax(opt);
	}
	 //设置默认值
	,setDefaultValue : function(){
		_self = this;
		if (!_self.isFillSignCardReasonEffective("b6AJdjlASheR8lqNivmC4hjGn54=")){//warnning:id写死，国内
			defaultReason = null;
		}
	}
	 
	 //	判断补卡原因是否有效（存在且生效）
	,isFillSignCardReasonEffective : function (reasonId) {
		var _self = this;
		var flag = true;
		var hrOrgUnitId=$('#hrOrgUnit_el').val();
		_self.remoteCall({
			type:"post",
			method:"FillSignCardReason",
			param:{
				hrOrgUnitId:hrOrgUnitId
			},
			async: false,
			success:function(res){
				var info =  res;
				if (info.resFlag == false){
					flag = false;
				}else {
					flag = true;
					_self.setDefaultFillSignCardReasonName(info.reasonName,info.id);
				}
			}
		});
		return flag;
		
	}
	
	//设置默认出差方式
	,setDefaultFillSignCardReasonName : function (reasonName,id){
		defaultReason = {description: "",id: id,name: reasonName,number: "001",state: 1};
	}
	
	,beforeSubmit :function(){
		
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		_self.beforeWFValidStoreCellValue();
		if (($form.valid() && _self.verify())) {
			return true ;
		}
		// return false 也能保存，固让js报错，后续让eas修改 return false 逻辑
		var len = workArea.length() ;
		return false ;
	}
	
	,getCurrentModel: function(){
		
		var model = shr.ats.team.TeamFillSignCardBatchNewEdit.superClass.getCurrentModel.call(this);
		//审核编辑界面重新点击出差类型 josn 转换出错
		if(this.isFromWF())
		{
		
			var lastRowNum = $('#entries').getGridParam("reccount");
		     
		    for(var i = 0; i < lastRowNum; i++ )
		    {
		       
			   delete  model.entries[i].reason.state 
		    }
		}
        model.ccPersonIds = model.ccPersonIds && model.ccPersonIds.id || "";
        model.ccPerson = model.ccPersonIds;
		return model ;
	}
	,saveEditCellValue :function(rowid,cellname, value,iRow,iCol) {
		var _self = this;
		// 工作流界面且是编辑状态且不是未提交界面
		if(_self.isFromWF() && _self.getOperateState() == 'EDIT' && $("#billState").val() != 0)
		{
			this.rowid = rowid ;
			this.cellname = cellname ;
			this.value = value ;
			this.iRow = iRow ;
			this.iCol = iCol ;
		}
	}
	
	,beforeWFValidStoreCellValue :function() {
		var _self = this;
		
		if(this.rowid && this.cellname && this.iRow && this.iCol)
		{
			$("#entries").jqGrid("saveCell",this.rowid,this.iCol);
			//_self.afterSaveCellTrigger(this.rowid, this.cellname, this.value, this.iRow , this.iCol) ;
		}
	}
});



function deleteCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
    document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
} 

function getCookie(name){ 
	var strCookie=document.cookie; 
	var arrCookie=strCookie.split("; "); 
	for(var i=0;i<arrCookie.length;i++){ 
		var arr=arrCookie[i].split("="); 
		if(arr[0]==name){
			if (name =="proposerID"){
				return decodeURIComponent(arr[1]);
			}else {
				return arr[1];
			}
			
		}
	} 
	return ""; 
} 

