var yearGolbal = new Date().getFullYear();
var ev_ev = [];
var idROW = "";
var lastRowRemark = "";
var policyKey = "";
var action = 1;
var tempLeaveLength = "";
var defaultReason = null;

shr.defineClass("shr.ats.atsLeaveBillEditNew", shr.framework.Edit, {
	rowid: "",
	cellname: "",
	value: "",
	iRow: "",
	iCol: "",
	hrOrgWriteCacheable:function(){
		return false ;
	},
	initalizeDOM: function () {
		shr.ats.atsLeaveBillEditNew.superClass.initalizeDOM.call(this);
		var that = this;
		var classfullNameService = "com.kingdee.shr.ats.web.formEditImport.AtsLeaveBillFileEditFormService";


		//按组织填充按钮
		$('<button type="button" style="margin-left:4px;margin-right:4px" class="shrshrbtn-primary shrbtn" id="orgfill">批量填充</button>').insertAfter($("#addRow_entries"));
		
		$("#import").hide();
		
		// //导入 按钮
		// $('<button type="button" style="margin-left:4px;margin-right:4px" class="shrshrbtn-primary shrbtn" id="import">导入</button>').insertAfter($("#addRow_entries"));
		// $('#import').click(function () {
			// that.importAction(null, classfullNameService);
		// })

		$('.editGrid-toolbar').append('<div style="display: inline;padding-left: 20px;">最多只能填充100条明细记录<div><div id="hasNum"></div>');

		that.showAllHolidayPolicyMark();

		$("#orgfill").hide();
		// $('#orgfill').click(function () {
			// var hrOrgUnitid = $("#hrOrgUnit_el").val();
			// var serviceId = shr.getUrlRequestParam("serviceId");
			// $("#orgFillDiv").attr("src", shr.getContextPath() + '/dynamic.do?checkLicense=true&hrOrgUnitid=' + hrOrgUnitid + '&uipk=com.kingdee.eas.hr.ats.app.LeavebillOrgFillForm' + '&serviceId=' + encodeURIComponent(serviceId));
			// var gridNum = $("#entries").getGridParam("reccount");
			// $('#hasNum').val(gridNum);
			// $('#orgFillDiv').dialog({
				// title: '批量填充',
				// width: 1020,
				// height: 450,
				// modal: true,
				// resizable: false,
				// position: {
					// my: 'center',
					// at: 'top+20%',
					// of: window
				// },
				// open: function (event, ui) {

				// }
// //				, close: function (event, ui) {
// //					if (event.currentTarget) {
// //
// //					} else {
// //						if (that.checkF7Data()) {
// //						openLoader(1);
// //						// 给jqgrid 赋值
// //						//获取rowid 算 剩余额度 时长 请假次数 
// //						var oldRowIds = $("#entries").getDataIDs();
// //						that.fillGrid();
// //						var newRowIds = $("#entries").getDataIDs();
// //						var rowIds = that.getFillRowId(oldRowIds, newRowIds);
// //						$.each(rowIds, function (n, value) {
// //							that.countRemainLimit(value);
// //							that.countLeaveLength(value);
// //							that.countLeaveTimes(value);
// //						});
// //						//检查不超过100条记录
// //						//that.checkRowIsOver();
// //
// //						$(this).dialog("close");
// //
// //						closeLoader();
// //						} else {
// //							return;
// //						}
// //						
// //					}
// //					
// //
// //				}
				// ,buttons: {
					        // "确认": function() {
					    // if (that.checkF7Data()) {
						// openLoader(1);
						// // 给jqgrid 赋值
						// //获取rowid 算 剩余额度 时长 请假次数 
						// var oldRowIds = $("#entries").getDataIDs();
						// that.fillGrid();
						// var newRowIds = $("#entries").getDataIDs();
						// var rowIds = that.getFillRowId(oldRowIds, newRowIds);
						// $.each(rowIds, function (n, value) {
							// that.countRemainLimit(value);
							// that.countLeaveLength(value);
							// that.countLeaveTimes(value);
						// });
						// //检查不超过100条记录
						// //that.checkRowIsOver();

						// $(this).dialog("close");

						// closeLoader();
						// } else {
							// return;
						// } 	
					  // },
					        // "关闭": function() {
					        	// $(this).dialog( "close" );
					        // }
					    // }
				// // ,buttons: {
				// //     "确认": function() {
				// //     	//校验F7数据
				// //     	if(that.checkF7Data()){
				// //     	}else{
				// //     		return;
				// //     	}
				// //     	openLoader(1);	
				// //     	// 给jqgrid 赋值
				// //     	//获取rowid 算 剩余额度 时长 请假次数 
				// // 		var oldRowIds = $("#entries").getDataIDs();
				// //     	that.fillGrid();
				// //     	var newRowIds = $("#entries").getDataIDs();
				// //     	var rowIds = that.getFillRowId(oldRowIds,newRowIds);
				// // 		$.each(rowIds,function(n,value) { 
				// // 			that.countRemainLimit(value);
				// // 			that.countLeaveLength(value);
				// // 			that.countLeaveTimes(value);
				// // 		});
				// // 		//检查不超过100条记录
				// // 		//that.checkRowIsOver();

				// //     	$(this).dialog( "close" );
				// //     	closeLoader();
				// //     },
				// //     "关闭": function() {
				// //     	$(this).dialog( "close" );
				// //     }
				// // }
			// });

			// $("#orgFillDiv").attr("style", "width:1020px;height:550px;");

		// });


		//隐藏按钮
		that.setButtonVisible();

		var entries_cont = waf("#entries");
		entries_cont.jqGrid("option", {

			beforeSaveCell: function (rowid, cellname, value, iRow, iCol) { // F7触发
				if (cellname == "policy") {
					action = "save";
				}
			}
			, afterSaveCell: function (rowid, cellname, value, iRow, iCol) { // F7 触发
				if(value["adminOrgUnit.id"]){
					$("#entries").jqGrid('setCell',rowid,"adminOrgUnit.id",value["adminOrgUnit.id"]);
				 }
				_self.afterSaveCellTrigger(rowid, cellname, value, iRow, iCol);
			}

			, beforeEditCell: function (rowid, cellname, value, iRow, iCol) { // 切换成文本的时候触发
				if(cellname == "isElasticCalLen"){
					var $entries_isElasticCalLen="#entries tr[id='" + rowid + "'] td[aria-describedby='entries_isElasticCalLen'] input";
					$($entries_isElasticCalLen).unbind("change");
					$($entries_isElasticCalLen).change(function(){
						that.countLeaveLength(rowid);
					});
				}
				if (cellname == "policy") {
					lastRowRemark = $("#entries tr[id='" + rowid + "'] td[aria-describedby='entries_policy']").attr('title');
					idROW = rowid;
					policyKey = $("#entries").jqGrid('getCell', rowid, "policy");
					action = "EDIT";
				}
				if (cellname == "leaveLength") {
					//					setTimeout(function () {
					//	                   $('#' + rowid + '_leaveLength').attr('readonly', true);
					//	                 }, 1);
					//请假长度可否编辑
					var personId = $("#entries").jqGrid('getCell', rowid, "person").id;
					if (typeof personId === 'undefined') {
						return;
					}
					var hrOrgUnitId = $("#hrOrgUnit_el").val();
					if (hrOrgUnitId == null || hrOrgUnitId == "") {
						shr.showWarning({ message: "请选择假期组织！" });
						return;
					}
					that.remoteCall({
						type: "post",
						method: "isLeaveLengthEdit",
						param: { personId: personId, hrOrgUnitId: hrOrgUnitId },
						async: false,
						success: function (res) {
							var info = res;
							if (info.errorString) {
								shr.showWarning({ message: info.errorString });
							} else {
								if (info.editable == 'true') {
									$("#" + rowid).find("td").eq(iCol).removeClass("disabled");
								} else {
									$("#entries").jqGrid('setCell', rowid, "leaveLength", "", "disabled");
									setTimeout(function () {
										$("#entries").jqGrid('restoreCell', iRow, iCol);
									}, 1);
								}
							}
						}
					});
				}
			}
			, afterEditCell: function (rowid, cellname, value, iRow, iCol) {
				if(cellname=="person"){
					var hrOrgUnitId=$("#hrOrgUnit_el").val();
					$("#"+rowid+"_person").shrPromptBox().attr("data-params",hrOrgUnitId);
				}
				_self.saveEditCellValue(rowid, cellname, value, iRow, iCol);
			}
			, afterRestoreCell: function (rowid, value, iRow, iCol) {
				if (iCol == 3 && action != "save") { // 将说明 重新复制 
					$("#entries tr[id='" + rowid + "'] td[aria-describedby='entries_policy']").attr('title', lastRowRemark);
				}
			}
		});

		//  如果是 编辑状态的话还要重新写 计算时长 
		if (that.getOperateState() == 'EDIT') {
			var rowIds = $("#entries").getDataIDs();
			var that = this;
			$.each(rowIds, function (n, value) {
				that.countLeaveLength(value, "EDIT");
				that.countRemainLimit(value);

			});
		}

		if (that.getOperateState() == 'EDIT') {
			//that.EditShowStartEndTime();
			if (that.isFromWF()) { // 来自任务中心
				$('#cancelAll').hide();
			}
		}

		//隐藏提交生效按钮
		if (that.getOperateState() == 'VIEW') {
			if (that.isFromWF()) { // 来自任务中心
				$('#submitEffect').hide();
				$('#cancelAll').hide();
				$('#submit').text("提交");
			}
			var rowIds = $("#entries").getDataIDs();
			var that = this;
			$.each(rowIds, function (n, value) {
				that.countRemainLimit(value);
			});
		}

		//审核编辑界面
		if (that.isFromWF() && that.getOperateState() == 'EDIT' && $("#billState").val() != 0) {
			$('#deleteRow_entries').unbind("click").attr("onclick", "").css("cursor", "default");
			$('#orgfill').unbind("click").attr("onclick", "").css("cursor", "default");
			$('#addRow_entries').unbind("click").attr("onclick", "").css("cursor", "default");
			$('#import').unbind("click").attr("onclick", "").css("cursor", "default");
			$(".editGrid-toolbar").hide();
			$("#submit").hide();
			var lastRowNum = $('#entries').getGridParam("reccount");
			for (var i = 1; i <= lastRowNum; i++) {
				var temp_id = $("#entries tr:eq(" + i + ")").attr("id");
				$("#entries").jqGrid('setCell', temp_id, 'person', '', 'not-editable-cell');
				$("#entries").jqGrid('setCell', temp_id, 'policy', '', 'not-editable-cell');
			}
		}
		//考勤计算--已计算页签--明细显示模式--请假按钮进来，只显示提交生效按钮
		if(shr.getUrlParam('fromCalDetail')!=null && shr.getUrlParam('fromCalDetail')=="1"){
			$("#save").hide();
			$("#submit").hide();
			$("#cancelAll").hide();
			$("#import").hide();
			$("#orgfill").hide();
			$(".view_manager_header > div > div").eq(0).remove();
			$("#submitEffect").addClass("shrbtn-primary");
		}
		//增加业务组织处理
		that.processF7ChangeEventHrOrgUnit();
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		that.initCurrentHrOrgUnit(hrOrgUnitId);
        _self.initCcPersonPrompt();

    } ,
	initCcPersonPrompt:function() {
        if ($('#ccPersonIds').length == 0) {
            return;
        }
        atsCcPersonUtils.initCCPersonIdsPrompt(this);
        if (this.getOperateState() != 'VIEW') {
            var person = $('#proposer').shrPromptBox("getValue");
            if (!person) {
               //  shr.showWarning({message:"Please select people."});
            } else {
                $('#ccPersonIds').shrPromptBox("setOtherParams", {
                    personId: person.id
                });
            }
        }
    }
	, processF7ChangeEventHrOrgUnit: function () {
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange: function (e, value) {
					var info = value.current;
					if(value.current.id != value.previous.id){//清除当前选中单元格--BT1357521【8.5SP1拉通测试】【PT140728】新建请假单（单人、多人）选择业务组织环球集团，选人之后，再将业务组织改为环球机械集团，可选员工还是业务组织为环球集团的人。
						$("#entries").find(".ui-promptBox-frame").remove();
					}
					that.initCurrentHrOrgUnit(info.id);
//					that.emptyHrOrgBasedEntryData();
					// $("#entries_person_number").val("");
					// $("#entries_adminOrgUnit").val("");
					// $("#entries_position").val("");

				}
			});
		}
	}
	, initCurrentHrOrgUnit: function (hrOrgUnitId) {
		var that = this;
		// $("#entries_person").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
	}
	//切换业务组织，清空姓名和假期类型
	,emptyHrOrgBasedEntryData : function(){
			$("#entries").find('[aria-describedby=entries_person], [aria-describedby=entries_policy]' +
				',[aria-describedby=entries_remainLimit]' +
				',[aria-describedby=entries_remainLimitUnit]' +
				',[aria-describedby=entries_beginTime]' +
				',[aria-describedby=entries_endTime]' +
				',[aria-describedby=entries_leaveLength]' +
				',[aria-describedby=entries_remark]' +
				',[aria-describedby=entries_reason]' +
				',[aria-describedby=entries_caleaveLength]' +
				',[aria-describedby=entries_id]' +
				',[aria-describedby=entries_prompt]').text("");
	}
	, initQuerySolutionHrOrgUnit: function (hrOrgUnitId) {
		var that = this;
		that.remoteCall({
			type: "post",
			method: "initQuerySolution",
			param: {
				hrOrgUnitId: hrOrgUnitId
			},
			async: true,
			success: function (res) {

			}
		});
	}

	, afterSaveCellTrigger: function (rowid, cellname, value, iRow, iCol) {
		var that = this;
		var entries_cont = waf("#entries");
		if (cellname == "policy") {
			that.holidayTypeChangeDeal(rowid); // 假期类型发生变化的时候要
			action = "save";
		} else if (cellname == "person") {
			that.holidayTypeChangeDeal(rowid); //  人员发生改变的时候 也要读取其 假期类型的备注
			that.personChangeDeal(rowid);
		} else if (cellname == "beginTime") {
			that.beginTimeChangeDeal(rowid);
		} else if (cellname == "endTime") {
			that.endTimeChangeDeal(rowid);
		} else if (cellname == "leaveLength") {
			that.checkIsChangeCalLength(rowid);
		}
	}
	//新增 jqgrid 行 方法， 复写
	, addRowAction: function (event) {
		//增加自己的逻辑
		var that = this;
		if (!that.checkRowIsOver()) {
			return;
		}

		var source = event.currentTarget,
			$editGrid = this.getEditGrid(source);

		var data = this.createNewEntryModel();
		if (typeof data === 'undefined') {
			data = {};
		}

		var editGridCont = this._getEditGridCont(source);
		if (editGridCont.data('editType') == 'inline') {
			// 表格内编辑
			$editGrid.jqGrid('addRow', { data: data });
		} else {
			$editGrid.wafGrid('addForm');
		}

		//$editGrid.not-editable-cell
		var event = document.createEvent('HTMLEvents');
		event.initEvent("editComplete_" + $editGrid.attr("id"), true, true);
		event.eventType = 'message';
		document.dispatchEvent(event);
		
		//设置不可 编辑 姓名
		var lastRowNum = $('#entries').getGridParam("reccount");
		var temp_id = $("#entries tr:eq("+ lastRowNum +")").attr("id");
		$("#entries").editCell(lastRowNum, 11, true);
		$("#entries").jqGrid('setCell',temp_id,'person','','not-editable-cell');


	}
	
	
	
	/**
	 * 设置分录行的默认值。重写框架此方法
	 * 规则：依据上一条复制除了员工信息、出差天数之外的基础信息
	 */
	,createNewEntryModel: function() {
		var lastRowNum = $('#entries').getGridParam("reccount");
		if (lastRowNum>=100) {
			shr.showWarning({message:"新增失败！最多只能填充100条明细记录。",hideAfter:5});
			return false;
		} else {
			var defalutPerson = {id:$('#proposer_el').attr('value'),name:$('#proposer').attr('title')};
			if (lastRowNum<1) return {person:defalutPerson,type:"1",reason:defaultReason};
			else {
				$("#entries").editCell(lastRowNum, 2, true);//需要将编辑焦点移动到不需复制的字段，否则会出现异常
				var temp_id = $("#entries tr:eq("+ lastRowNum +")").attr("id");
//				var lastAttendDate = $("#entries").jqGrid("getRowData", temp_id).attendDate;
				var beginTime = $("#entries").jqGrid("getRowData", temp_id).beginTime;
				var endTime = $("#entries").jqGrid("getRowData", temp_id).endTime;
//				var lastType = $("#entries").jqGrid("getRowData", temp_id).type;
				var leaveReason = $("#entries").jqGrid("getRowData", temp_id).reason;
//				var lastRemark = $("#entries").jqGrid("getRowData", temp_id).remark;
				
				return {person:defalutPerson,beginTime:beginTime,endTime:endTime,reason:leaveReason};
			}
		}	
			
	}
	
	
	
	
	
	/**
	 * 保存
	 */
	, saveAction: function (event) {
		var _self = this;

		if (_self.validate() && _self.verify()) {
			_self.doSave(event, 'save');
		}
	}
	, submitAction: function (event) {
		var _self = this,
			workArea = _self.getWorkarea(),
			$form = $('form', workArea);
		if (!_self.validate()) {
			return;
		}

		if ($form.valid() && _self.verify()) {
			shr.showConfirm('您确认要提交吗？', function () {
				_self.doSubmit(event, 'submit');
			});
		}
	}
	//提交即生效
	, submitEffectAction: function (event) {
		var _self = this,
			workArea = _self.getWorkarea(),
			$form = $('form', workArea);

		if (!_self.validate()) {
			return;
		}

		if ($form.valid() && _self.verify()) {
			if (shr.atsBillUtil.isInWorkFlow(_self.billId)) {
				shr.showConfirm('工作流已产生，提交生效将废弃工作流，确认废弃？', function () {
					_self.prepareSubmitEffect(event, 'submitEffect');
				});
			} else {
				shr.showConfirm('您确认要提交生效吗？', function () {
					_self.prepareSubmitEffect(event, 'submitEffect');
				});
			}
		}
	}
	, prepareSubmitEffect: function (event, action) {
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
	//专员返回专员列表的取消按钮
	, toLeaveBillListAction: function () {
		/*var that = this ;
	 	window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsLeaveBillAllList";*/
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsLeaveBillList',
			//serviceId: shr.getUrlRequestParam("serviceId")
		});
	}
	, setImportSelfParam: function () {
		var billId = $('#id').val();
		return $("#entries").getGridParam("reccount") + "&" + $('#id').val();
	}
//	, importAction: function (gridID, classfullName) {
//
//		var _self = this;
//		if (gridID != undefined) {
//			grid = gridID;
//		}
//		if (classfullName != undefined) {
//			className = classfullName;
//		}
//
//		var importDiv = $('#importDiv');
//		if (importDiv.length > 0) {
//			//	importDiv.data('uipk', lastUipk);
//			//	importDiv.data('viewModel', viewModel);
//			//	importDiv.data('classify', classify);
//			//	importDiv.dialog('open');
//			//	return;
//		}
//		$('#importDiv').remove();
//
//		selfParam = _self.setImportSelfParam();
//		// 未生成dialog
//		importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
//		importDiv.data('uipk', lastUipk);
//		importDiv.data('viewModel', viewModel);
//		importDiv.data('grid', grid);
//		importDiv.data('className', className);
//		importDiv.data('selfParam', selfParam);
//		//	importDiv.data('classify', classify);
//		var oldRowIds = $("#entries").getDataIDs(); // 导入之前表格中的 rowIds
//		if (_self.checkUpload()) {
//			importDiv.dialog({
//				autoOpen: true,
//				width: 708,
//				height: 700,
//				title: "导入数据",
//				resizable: true,
//				position: ['top', 'top'],
//				modal: true,
//				open: function (event, ui) {
//					//在ie10上用不了。
//					/*if ($.browser.msie) {
//						var url = shr.assembleURL('hr.ats.com.atttendanceCommonImport', 'view', {
//							lastUipk: lastUipk,
//							viewModel: viewModel ,
//							className : className
//							//classify:classify
//						});
//						var content = '<iframe id="importFrame" name="importFrame" width="700" height="600" frameborder="0" scrolling="no" allowtransparency="true" src="' + url + '"></iframe>';
//						importDiv.append(content);
//					} else {*/
//
//					var url = shr.assembleURL('hr.ats.com.atttendanceCommonImport$page', 'view');
//					shr.loadHTML({
//						url: url,
//						success: function (response) {
//							importDiv.append(response);
//						}
//					});
//					//}
//					document.documentElement.style.overflow = 'hidden';
//				},
//				close: function (event, ui) {
//					document.documentElement.style.overflow = 'scroll';
//					importDiv.empty();
//
//					// 触发计算 请假次数 剩余额度 时长
//
//					//点击序号列 让人员失去焦点
//					$("#entries tr:eq(1) td:eq(0)").click();
//
//					//获取rowid 算 剩余额度 时长 请假次数 
//					var newRowIds = $("#entries").getDataIDs();
//					var rowIds = _self.getFillRowId(oldRowIds, newRowIds);
//					$.each(rowIds, function (n, value) {
//						_self.countRemainLimit(value);
//						_self.countLeaveLength(value);
//						_self.countLeaveTimes(value);
//					});
//
//					//检查不超过100条记录
//					//_self.checkRowIsOver();
//
//				}
//			});
//		}
//
//		$(".ui-dialog-titlebar-close").bind("click", function () {
//			importDiv.dialog("close");
//		});
//	}

	, verify: function () {
		var that = this;
		//如果是查看页面提交工作流，不需要再次校验了
		if (that.getOperateState().toUpperCase() == 'ViEW') {
			return;
		}
		var obj = $("#entries").jqGrid("getRowData");

		if (obj.length == 0) {
			shr.showWarning({ message: "请假单分录不能为空！" });
			return false;
		}
		if (!that.checkRowIsOver()) {
			return false;
		}

		if (!that.checkEntry()) {
			return false;
		}
		
		if(!that.checkEnoughRemain()){
			shr.showWarning({message: "请假总时长大于剩余额度！"});
			return false;
		}

		var errorString = "";
		var errorFlag = 0;
		jQuery(obj).each(function (n) {
			//			info = that.validateLeaveBillCycle(this.person.id,this.beginTime,this.endTime,this.policy.id,this.leaveLength);
			var rowid = $("#entries tr:eq(" + (n + 1) + ")").attr('id')
			errorString = that.checkIsNullEveryRow(this);
			if (errorString == "") {
				errorString = that.checkEveryRow(this);
			}
			if (errorString == "" || errorString == undefined) { // 检测请假时长是不是大于计算时长
				errorString = that.checkCalLength(this);
			}
			if (errorString == undefined || errorString == null || errorString == "") {
			} else {
				//	   			shr.showWarning({message: this.person.name + " "+ this.policy.name +" " + errorString});
				//	   			return false;
				that.preShowError(rowid, this.person.name + " " + this.policy.name + " " + errorString);
				errorFlag = 1;
			}
		});
		if (errorFlag == 0) {
			return true;
		} else {
			return false;
		}
		return false;
	}
	// 获取填充的 rowId，导入的rowId 
	, getFillRowId: function (oldRowIds, newRowIds) {
		var size = newRowIds.length;
		var sizeOld = oldRowIds.length;
		if (sizeOld == 0) {
			return newRowIds;
		}
		var rowIds = [];
		for (var i = 0; i < size; i++) {
			if (i >= sizeOld) {
				rowIds.push(newRowIds[i]);
			}
		}
		return rowIds;
	}
	, checkF7Data: function () {
		var that = this;
		var holidayType_el = $(window.frames["orgFillDiv"].document).find("#holidayType_el").val();
		var holidayType = $(window.frames["orgFillDiv"].document).find("#holidayType").val();
		var adminOrgUnit_el = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit_el").val();
		var adminOrgUnit = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit").val();
		var proposer_el = $(window.frames["orgFillDiv"].document).find("#proposer_el").val();
		var proposer = $(window.frames["orgFillDiv"].document).find("#proposer").val();

		var beginTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("beginTime");
		var leaveLength = $(window.frames["orgFillDiv"].document).find("#leaveLength").val();
		var endTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("endTime");
		var remark = $(window.frames["orgFillDiv"].document).find("#remark").val();

		var remain = $(window.frames["orgFillDiv"].document).find("#remain").text();
		var checkAmount = $(window.frames["orgFillDiv"].document).find("#checkAmount").text();
		var attencegroup_el = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup_el").val();
		var prop_attencegroup = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup").val();
		/*
		var holidayType_el = $('iframe')[0].contentWindow.$('#holidayType_el').val();
		var holidayType = $('iframe')[0].contentWindow.$('#holidayType').val();
		
		var adminOrgUnit_el = $('iframe')[0].contentWindow.$('#adminOrgUnit_el').val();
		var adminOrgUnit = $('iframe')[0].contentWindow.$('#adminOrgUnit').val();
		
		var proposer_el = $('iframe')[0].contentWindow.$('#proposer_el').val();
		var proposer = $('iframe')[0].contentWindow.$('#proposer').val();
		
		
		var beginTime = $('iframe')[0].contentWindow.$('#beginTime').val();
		var leaveLength = $('iframe')[0].contentWindow.$('#leaveLength').val();
		var endTime = $('iframe')[0].contentWindow.$('#endTime').val();
		var remark = $('iframe')[0].contentWindow.$('#remark').val();
		
		var remain = $('iframe')[0].contentWindow.$('#remain').text();
		var checkAmount = $('iframe')[0].contentWindow.$('#checkAmount').text();
		*/

		//校验
		if (parseInt(checkAmount) > parseInt(remain)) {
			shr.showWarning({ message: "最多只能填充100条明细记录！" });
			return false;
		}
		//校验
		if (holidayType_el == undefined || holidayType_el == null || holidayType_el == ""
			|| holidayType == undefined || holidayType == null || holidayType == "") {
			shr.showWarning({ message: "假期类型不能为空！" });
			return false;
		}

		if ((adminOrgUnit_el == undefined || adminOrgUnit_el == null || adminOrgUnit_el == ""
			|| adminOrgUnit == undefined || adminOrgUnit == null || adminOrgUnit == "")
			&& (proposer_el == undefined || proposer_el == null || proposer_el == ""
				|| proposer == undefined || proposer == null || proposer == "")
				&& (attencegroup_el == undefined || attencegroup_el == null || attencegroup_el == ""
				|| prop_attencegroup == undefined || prop_attencegroup == null || prop_attencegroup == "")) {
			shr.showWarning({ message: "组织、考勤组和人员不能同时为空！" });
			return false;
		}

		if (beginTime == undefined || beginTime == null || beginTime == "") {
			shr.showWarning({ message: "开始时间不能为空！" });
			return false;
		}

		if (leaveLength == undefined || leaveLength == null || leaveLength == "") {
			shr.showWarning({ message: "请假长度不能为空！" });
			return false;
		}

		if (endTime == undefined || endTime == null || endTime == "") {
			shr.showWarning({ message: "结束时间不能为空！" });
			return false;
		}

		return true;
	}

	, fillGrid: function () {
		var that = this;
		/*
		var holidayType_el = $('iframe')[0].contentWindow.$('#holidayType_el').val();
		var holidayType = $('iframe')[0].contentWindow.$('#holidayType').val();
		
		var adminOrgUnit_el = $('iframe')[0].contentWindow.$('#adminOrgUnit_el').val();
		var adminOrgUnit = $('iframe')[0].contentWindow.$('#adminOrgUnit').val();
		
		var proposer_el = $('iframe')[0].contentWindow.$('#proposer_el').val();
		var proposer = $('iframe')[0].contentWindow.$('#proposer').val();
		
		
		var beginTime = $('iframe')[0].contentWindow.$('#beginTime').val();
		var leaveLength = $('iframe')[0].contentWindow.$('#leaveLength').val();
		var endTime = $('iframe')[0].contentWindow.$('#endTime').val();
		var remark = $('iframe')[0].contentWindow.$('#remark').val();
		*/

		var holidayType_el = $(window.frames["orgFillDiv"].document).find("#holidayType_el").val();
		var holidayType = $(window.frames["orgFillDiv"].document).find("#holidayType").val();
		var adminOrgUnit_el = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit_el").val();
		var adminOrgUnit = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit").val();
		var proposer_el = $(window.frames["orgFillDiv"].document).find("#proposer_el").val();
		var proposer = $(window.frames["orgFillDiv"].document).find("#proposer").val();
		var beginTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("beginTime");
		var leaveLength = $(window.frames["orgFillDiv"].document).find("#leaveLength").val();
		var endTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("endTime");
		var remark = $(window.frames["orgFillDiv"].document).find("#remark").val();
		//var setType = $(window.frames["orgFillDiv"].document).find("#setType1").is(":visible") ? 1 : 2;
		var setType = $(window.frames["orgFillDiv"].document).find("#setType").val();
		var attencegroupId = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup_el").val();
		/*if((adminOrgUnit_el!=undefined&&adminOrgUnit_el!=null&&adminOrgUnit_el!=""
				&&adminOrgUnit!=undefined&&adminOrgUnit!=null&&adminOrgUnit!="")
				&&(proposer_el==undefined||proposer_el==null||proposer_el==""
				||proposer==undefined||proposer==null||proposer=="")){*/
		that.remoteCall({
			type: "post",
			async: false,
			method: "getPersonsByOrgUnit",
			param: { attencegroupId: attencegroupId,orgUnitId: adminOrgUnit_el, personIds: proposer_el, setType: setType ,currentPagePermItemId:shr.getUrlParams().serviceId},
			success: function (res) {
				info = res;
				var personColl = jQuery.parseJSON(info.personColl);
				$.each(personColl, function (n, value) {

					var holidayTypeString = ' "policy" : { "id": "'
						+ holidayType_el
						+ '", "name": "'
						+ holidayType
						+ '"}';
					var adminOrgUnitString = ' "adminOrgUnit" : { "id": "'
						+ adminOrgUnit_el
						+ '", "name": "'
						+ adminOrgUnit
						+ '"}';
					var proposerString = ' "person" : { "id": "'
						+ value.id
						+ '", "name": "'
						+ value.name
						+ '"}';

					var beginTimeString = ' "beginTime" : "' + beginTime + '"';
					var endTimeString = ' "endTime" : "' + endTime + '"';
					var leaveLengthString = ' "leaveLength" : "' + leaveLength + '"';
					var remarkString = ' "reason" : "' + remark + '"';

					var dataString = ' { "data" : {'
						+ holidayTypeString + ', '
						+ adminOrgUnitString + ', '
						+ proposerString + ', '
						+ beginTimeString + ', '
						+ endTimeString + ', '
						+ leaveLengthString + ', '
						+ remarkString + '}} ';

					var dataJson = jQuery.parseJSON(dataString);
					$("#entries").jqGrid('addRow', dataJson);
					//点击序号列 让人员失去焦点
					$("#entries tr:eq(1) td:eq(0)").click();

				});


			}
		});
		/*
		}else{
				var person_el_split = proposer_el.split(',');
				var person_split = proposer.split(',');
				for(var i = 0 ; i<person_el_split.length;i++){
				
						//个人填充
						var holidayTypeString = ' "policy" : { "id": "' 
															+ holidayType_el
															+ '", "name": "'
															+ holidayType
															+ '"}';
						var adminOrgUnitString = ' "adminOrgUnit" : { "id": "' 
												+ adminOrgUnit_el
												+ '", "name": "'
												+ adminOrgUnit
												+ '"}';							
						var proposerString = ' "person" : { "id": "' 
												+ person_el_split[i]
												+ '", "name": "'
												+ person_split[i]
												+ '"}';
												
						var beginTimeString = ' "beginTime" : "'+ beginTime +'"';
						var endTimeString = ' "endTime" : "'+ endTime +'"';
						var leaveLengthString = ' "leaveLength" : "'+ leaveLength +'"';
						var remarkString = ' "reason" : "'+ remark +'"';
						
						var dataString = ' { "data" : {' 
										+ holidayTypeString + ', '
										+ adminOrgUnitString + ', '
										+ proposerString + ', '
										+ beginTimeString + ', '
										+ endTimeString + ', '
										+ leaveLengthString + ', '
										+ remarkString + '}} ' ;
										
						var dataJson = jQuery.parseJSON(dataString);		
						$("#entries").jqGrid('addRow',dataJson);
						//点击序号列 让人员失去焦点
						$("#entries tr:eq(1) td:eq(0)").click();
				}	
			
		}*/

	}
	, setButtonVisible: function () {
		var billState = $("#billState").val();
		//alert(billState);
		if (billState) {
			if (billState == 3 || "审批通过" == billState || billState == 4 || "审批不通过" == billState || billState == 2 || "审批中" == billState) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1 == billState || "未审批" == billState || 2 == billState || "审批中" == billState) { //未审批或审批中
				if (!this.isFromWF()) {
					$("#edit").hide();
					$("#submit").hide();
					$("#submitEffect").hide();
				}
			}
		}
		if (this.getOperateState().toUpperCase() == 'VIEW') { //查看状态下不允许提交
			//$("#submit").hide();
			$("#submitEffect").hide();
		}
		//如果是工作流打回,界面上的"返回请假列表"不显示
		if (this.isFromWF()) {
			$("#returnToLeaveBillList").hide();
			$("#cancel").hide();
		}
		//增加员工编码,再流程审批的时候显示员工编码
		$("#entries-person-number").hide();
		if (this.isFromWF()) {
			$("#entries-person-number").show();
		}
		if (this.getOperateState().toUpperCase() == 'ADDNEW' || this.getOperateState().toUpperCase() == 'EDIT') {
			$("#returnToLeaveBillList").hide();
		}
	}
	, holidayTypeChangeDeal: function (rowid) {
		var that = this;
		that.countRemainLimit(rowid);
		that.countLeaveLength(rowid);
		that.countLeaveTimes(rowid);
		that.getHolidayPolicy(rowid);
	}
	, personChangeDeal: function (rowid) {
		var that = this;
		// 去除显示的感叹号
		that.removePreShowError(rowid);

		that.countRemainLimit(rowid);
		that.countLeaveLength(rowid);
		that.isLeaveLengthEdit(rowid);
		that.countLeaveTimes(rowid);
		that.getHolidayPolicy(rowid);
	}
	, beginTimeChangeDeal: function (rowid) {
		var that = this;
		that.countRemainLimit(rowid);
		that.countLeaveLength(rowid);
	}
	, endTimeChangeDeal: function (rowid) {
		var that = this;
		that.countRemainLimit(rowid);
		that.countLeaveLength(rowid);
	}
	, countRemainLimit: function (rowid) {
		var that = this;
		var personId = "";
		var beginTime = $("#entries").jqGrid('getCell', rowid, "beginTime");
		var endTime = $("#entries").jqGrid('getCell', rowid, "endTime");

		if ($("#entries").jqGrid('getCell', rowid, "person") == undefined
			|| $("#entries").jqGrid('getCell', rowid, "person") == null) {
			return;
		} else {
			personId = $("#entries").jqGrid('getCell', rowid, "person").id;
		}
		if ($("#entries").jqGrid('getCell', rowid, "policy") == undefined
			|| $("#entries").jqGrid('getCell', rowid, "policy") == null) {
			return;
		} else {
			holidayTypeId = $("#entries").jqGrid('getCell', rowid, "policy").id;
		}

		if (personId == undefined || personId == null
			|| holidayTypeId == undefined || holidayTypeId == null
			|| beginTime == undefined || beginTime == null
			|| endTime == undefined || endTime == null) {
			return;
		}
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		if(hrOrgUnitId==null||hrOrgUnitId==""){
			hrOrgUnitId = $("#hrOrgUnit").val();
		}
		if (hrOrgUnitId == null || hrOrgUnitId == "") {
			shr.showWarning({ message: "请选择假期组织！" });
			return;
		}
		that.remoteCall({
			type: "post",
			method: "getTimeAttendanceType",
			param: { personId: personId, startTime: beginTime, endTime: endTime, hrOrgUnitId: hrOrgUnitId },
			async: false,
			success: function (res) {
				var info = res;
				if (info.errorString) {
					that.preShowError(rowid, info.errorString);
				} else {
					var size = info.timeAttendanceCollectionSize;
					var attendColl = JSON.parse(info.timeAttendanceCollection);
					for (var j = 0; j < size; j++) {
						if (attendColl[j].holidayType.id == holidayTypeId) {

							var unitTypeName = "";
							if (attendColl[j].unit != undefined) {
								unitTypeName = attendColl[j].unit.alias;
								$("#entries").jqGrid('setCell', rowid, "remainLimitUnit", unitTypeName);
								$("#entries").jqGrid('setCell', rowid, "remark", unitTypeName);
							}
							var flag=true;
							for (var prop in info.vacationRemain) {
								/*if(prop==holidayTypeId){
									$("#entries").jqGrid('setCell',rowid,"remainLimit",info.vacationRemain[prop]==""?0:info.vacationRemain[prop]);
									break;
								}else{
									$("#entries").jqGrid('setCell',rowid,"remainLimit",null);
								}*/

								if (prop == holidayTypeId) {
									var numberOptions = {decimalPrecision:info.saveLengthMap[prop]};
									flag=false;
									$("#entries").jqGrid('setCell', rowid, "remainLimit", numberfieldService.format(info.vacationRemain[prop],numberOptions) == "" ? 0 : numberfieldService.format(info.vacationRemain[prop],numberOptions));
									$("#entries").jqGrid('setCell', rowid, "remainLimitUnit", unitTypeName);
									$("#entries").jqGrid('setCell', rowid, "remark", unitTypeName);
								}
							}
							if(flag){
								$("#entries").jqGrid('setCell', rowid, "remainLimit");
							}
						}

					}
				}
			}
		});
	}
	, countLeaveLength: function (rowid, action) {
		var that = this;
		if ($("#entries").jqGrid('getCell', rowid, "person") == undefined
			|| $("#entries").jqGrid('getCell', rowid, "person") == null) {
			return;
		} else {
			personId = $("#entries").jqGrid('getCell', rowid, "person").id;
		}
		if ($("#entries").jqGrid('getCell', rowid, "policy") == undefined
			|| $("#entries").jqGrid('getCell', rowid, "policy") == null) {
			return;
		} else {
			holidayTypeId = $("#entries").jqGrid('getCell', rowid, "policy").id;
		}
		var personId = $("#entries").jqGrid('getCell', rowid, "person").id;
		var beginTime = $("#entries").jqGrid('getCell', rowid, "beginTime");
		var endTime = $("#entries").jqGrid('getCell', rowid, "endTime");
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		var isElasticCalLen = $("#entries").jqGrid('getCell', rowid, "isElasticCalLen")=="1";

		if (!strDateTime(beginTime) || !strDateTime(endTime)) {
			return;
		}
		var holidayTypeId = $("#entries").jqGrid('getCell', rowid, "policy").id;
		if (personId == undefined || personId == null
			|| holidayTypeId == undefined || holidayTypeId == null
			|| beginTime == undefined || beginTime == null
			|| endTime == undefined || endTime == null) {
			return;
		}
		that.remoteCall({
			type: "post",
			async: false,
			method: "getRealLeaveLengthInfo",
			param: { personId: personId, 
			beginTime: beginTime,
			endTime: endTime, 
			holidayTypeId: holidayTypeId, 
			action: action, 
			hrOrgUnitId: hrOrgUnitId,
			isElasticCalLen:isElasticCalLen},
			success: function (res) {
				info = res;
				if (info.errorString) {
					that.preShowError(rowid, info.errorString);
					//					shr.showError({message: info.errorString});
				} else {
					var day = parseFloat(info.leaveBillDays + info.segRest);
					var leaveLengDay = parseFloat(info.leaveBillDays);
					if (action != "EDIT") { // 第一次进入的时候重现计算先请假时长
						$("#entries").jqGrid('setCell', rowid, "leaveLength", leaveLengDay);
					}
					//  每次触发之前都会记住这个 计算的时长
					$("#entries").jqGrid('setCell', rowid, "caleaveLength", day);
				}
			}
		});
	}
	, countLeaveTimes: function (rowid) {
		var that = this;
		if ($("#entries").jqGrid('getCell', rowid, "person") == undefined
			|| $("#entries").jqGrid('getCell', rowid, "person") == null) {
			return;
		} else {
			personId = $("#entries").jqGrid('getCell', rowid, "person").id;
		}
		var personId = $("#entries").jqGrid('getCell', rowid, "person").id;
		if (personId == undefined || personId == null) {
			return;
		}
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		if (hrOrgUnitId == null || hrOrgUnitId == "") {
			shr.showWarning({ message: "请选择假期组织！" });
			return;
		}
		that.remoteCall({
			type: "post",
			method: "getLeaveTimesAndDateInfo",
			param: { personId: personId, hrOrgUnitId: hrOrgUnitId },
			success: function (res) {
				info = res;

				$("#entries").find("td[aria-describedby='entries_prompt']").each(function () {
					var rowID = $.trim($(this).parents("tr").attr("id"));
					var showString = "本月已申请 " + info.leaveTimes + " 次，最后一次为 " + info.lastLeaveDate.substr(0, 10);
					if (rowid == rowID) {
						$(this).html("");
						$(this).append("<a href='#' id = 'showMoreMessage" + rowid + "' title = '"
							+ showString
							+ "' style='color:blue'>"
							+ showString
							+ "</a>");
						//live绑定的事件要用die解除绑定。
						//						$('#showMoreMessage'+rowid).die('click');
						//						$('#showMoreMessage'+rowid).live('click',function(){
						//							that.showMoreMessage(rowid);
						//						});
						$("#entries").jqGrid('setCell', rowID, 'prompt', '', 'not-editable-cell');

						$('#showMoreMessage' + escapeJquery(rowid)).die('click');
						$('#showMoreMessage' + escapeJquery(rowid)).live('click', function () {
							that.showMoreMessage(rowid);
						});
					}
				});

			}
		});
	}
	, showAllHolidayPolicyMark: function () {
		var that = this;
		var rowIds = $("#entries").getDataIDs();
		for (var i = 0; i < rowIds.length; i++) {
			that.getHolidayPolicy(rowIds[i]);
		}

	}
	, getHolidayPolicy: function (rowid) {
		var that = this;
		var personId = "";
		if ($("#entries").jqGrid('getCell', rowid, "person") == undefined
			|| $("#entries").jqGrid('getCell', rowid, "person") == null) {
			return;
		} else {
			personId = $("#entries").jqGrid('getCell', rowid, "person").id;
		}
		if (!personId) {
			return;
		}

		var holidayTypeId = "";
		if ($("#entries").jqGrid('getCell', rowid, "policy") == undefined
			|| $("#entries").jqGrid('getCell', rowid, "policy") == null) {
			return;
		} else {
			holidayTypeId = $("#entries").jqGrid('getCell', rowid, "policy").id;
		}
		if (!holidayTypeId) {
			return;
		}
		var hrOrgUnitId = $("#hrOrgUnit_el").val() != undefined &&  $("#hrOrgUnit_el").val() != "" ? $("#hrOrgUnit_el").val() : $("#hrOrgUnit").val();
		/*
		that.remoteCall({
			type: "post",
			method: "getHolidayPolicy",
			async: true,
			param: { personId: personId, holidayTypeId: holidayTypeId, hrOrgUnitId: hrOrgUnitId },
			success: function (res) {
				info = res;
				if (info.errorString) {
					that.preShowError(rowid, info.errorString);
				} else {
					var title = "";
					if (info.holidayPolicyInfo.remark) {
						title = "" + info.holidayPolicyInfo.remark;
					}
					$("#entries tr[id='" + rowid + "'] td[aria-describedby='entries_policy']").attr('title', title);
				}

			}
		});
		*/
		$.ajax({
                type:"post",
                url:shr.getContextPath() + '/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsLeaveBillBatchEditHandler&method=getHolidayPolicy',                
                data:{ personId: personId, holidayTypeId: holidayTypeId, hrOrgUnitId: hrOrgUnitId },
                async:true,   // 异步，默认开启，也就是$.ajax后面的代码是不是跟$.ajx里面的代码一起执行               
                success: function (res) {
					info = res;
					if (info.errorString) {
						that.preShowError(rowid, info.errorString);
					} else {
						var title = "";
						if (info.holidayPolicyInfo.remark) {
							title = "" + info.holidayPolicyInfo.remark;
						}
						$("#entries tr[id='" + rowid + "'] td[aria-describedby='entries_policy']").attr('title', title);
					}
				},
                error:function(res){                    
                    alert(res);
                }
            });
	}
	, checkIsNullEveryRow: function (value) { // 非空的是框架处理的，这里只要处理 卡死hi时间和结束时间的校验
		var beginDate = new Date(value.beginTime);
		var endDate = new Date(value.endTime);
		if (beginDate.getTime() >= endDate.getTime()) {
			return errorString = "开始时间不能大于和等于结束时间";
		}
		return "";
	}
	//请假时长不能大于计算时长
	, checkCalLength: function (value) {
		if (parseFloat(value.leaveLength) > parseFloat(value.caleaveLength)) {
			return errorString = "请假时长不能大于" + value.caleaveLength;
		}
		return "";
	}
	, checkIsChangeCalLength: function (rowid) {
		var that = this;
		var personId = "";
		var beginTime = $("#entries").jqGrid('getCell', rowid, "beginTime");
		var endTime = $("#entries").jqGrid('getCell', rowid, "endTime");
		var realLen = $("#entries").jqGrid('getCell', rowid, "leaveLength");
		if ($("#entries").jqGrid('getCell', rowid, "person") == undefined
			|| $("#entries").jqGrid('getCell', rowid, "person") == null) {
			return;
		} else {
			personId = $("#entries").jqGrid('getCell', rowid, "person").id;
		}
		if ($("#entries").jqGrid('getCell', rowid, "policy") == undefined
			|| $("#entries").jqGrid('getCell', rowid, "policy") == null) {
			return;
		} else {
			holidayTypeId = $("#entries").jqGrid('getCell', rowid, "policy").id;
		}

		if (personId == undefined || personId == null
			|| holidayTypeId == undefined || holidayTypeId == null
			|| beginTime == undefined || beginTime == null
			|| endTime == undefined || endTime == null) {
			return;
		}
		var calLeave = $("#entries").jqGrid('getCell', rowid, "caleaveLength");
		// ,preShowWarn:function(rowid,errorString){
		if (realLen > calLeave) { // 请假时长不能大于计算时长 ！
			that.preShowError(rowid, "请假时长不能大于计算时长 ！");
		} else if (realLen < calLeave) { // ？ 
			that.preShowWarn(rowid, "请假时长与真实时长不一致 ！");
		}
	}
	, checkEveryRow: function (value) {
		var that = this;
		var errorString = "";
//		errorString = that.validateIsExistBill(value.person.id, value.beginTime, value.endTime, $('#id').val(), value["policy.holidayType"].id);//f7改变,筛选数据字段发生改变
		errorString = that.validateIsExistBill(value.person.id, value.beginTime, value.endTime, $('#id').val(), value.policy.id);
		if (errorString == undefined || errorString == null || errorString == "") {
		} else {
			return errorString;
		}

		var info = that.validateLeaveBillCycle(value.person.id, value.beginTime, value.endTime, value.policy.id, value.leaveLength);
		if (info) {
			errorString = info.errorString;
			if (errorString == undefined || errorString == null || errorString == "") {
			} else {
				return errorString;
			}
		}

	}
	, validateIsExistBill: function (personId, beginTime, endTime, billId, holidayTypeId) {
		var that = this;
		var info;
		var infoLeaveBillNumber;
		var errorString = "";
		that.remoteCall({
			type: "post",
			async: false,
			method: "getLeaveBillInfoByPersonIdAndLeaveTime",
			param: { personId: personId, beginTime: beginTime, endTime: endTime, billId: billId, holidayTypeId: holidayTypeId },
			success: function (res) {
				info = res;
			}
		});
		if (that.getOperateState() == 'ADDNEW') {
			//校验 请假单编号
			var leaveBillNumber = $('#number').val();//@
			var that = this;
			that.remoteCall({
				type: "post",
				async: false,
				method: "validateLeaveBillNumber",
				param: { leaveBillNumber: leaveBillNumber },
				success: function (res) {
					infoLeaveBillNumber = res;
				}
			});
			//校验请假单编号是否重复	

			if (infoLeaveBillNumber.leaveBillExist == "true") {
				errorString = "已经存在编码为" + infoLeaveBillNumber.leaveBillNumber + "的对象。";
				return errorString;
			}
		}

		if (info.addFlag > 0) {
			errorString = "在编号为[" + info.billNo + "]的请假单中,存在时间重叠的记录：[" + info.personName + ",开始时间：" + info.realBeginDate + " 结束时间：" + info.realendDate + " ]";
			return errorString;
		}
	}
	//验证请假周期
	, validateLeaveBillCycle: function (personId, beginTime, endTime, holidayTypeId, leaveLength) {
		var that = this;
		/*var regEx = new RegExp("\\/","gi");
		beginTime = beginTime.replace(regEx,"-");
	 	endTime = 	endTime.replace(regEx,"-");*/
		var info;
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		if (hrOrgUnitId == null || hrOrgUnitId == "") {
			shr.showWarning({ message: "请选择假期组织！" });
			return;
		}
		that.remoteCall({
			type: "post",
			async: false,
			method: "validateLeaveBillCycle",
			param: { billId: $('#id').val(),pageUipk:'dynamic.do?uipk=com.kingdee.eas.hr.ats.app.AtsLeaveBillAllBatchForm', personId: personId, beginTime: beginTime, endTime: endTime, holidayTypeId: holidayTypeId, leaveLength: leaveLength, hrOrgUnitId: hrOrgUnitId },
			success: function (res) {
				info = res;
				return info;
			}
		});
		return info;
	}
	//对校验结果进行页面个性化提示
	, preShowError: function (rowid, errorString) {
		var that = this;
				// 修复平台表格序号列位置移动导致的提示列位置错误导致的显示异常bug
		var rnColNum;
		$.each($("#entries").jqGrid("getAllColumn"),function(index,item){
			if(item.name=="rn"){
				rnColNum=index
			}
		})
		if (errorString) {
			$("#entries tr[id='" + rowid + "'] td:eq("+rnColNum+")").html("！").css("color", "red").attr({ "data-toggle": "tooltip", "data-placement": "left", "title": errorString });
			$("#entries tr[id='" + rowid + "']").css("color", "red");
		}
	}
	//对校验结果进行页面个性化提示
	, preShowWarn: function (rowid, errorString) {
				// 修复平台表格序号列位置移动导致的提示列位置错误导致的显示异常bug
		var rnColNum;
		$.each($("#entries").jqGrid("getAllColumn"),function(index,item){
			if(item.name=="rn"){
				rnColNum=index
			}
		})
		var that = this;
		if (errorString) {
			$("#entries tr[id='" + rowid + "'] td:eq("+rnColNum+")").html("？").css("color", "red").attr({ "data-toggle": "tooltip", "data-placement": "left", "title": errorString });
		}
	}
	//去除个性化展示，每次校验前去除
	, removePreShowError: function (rowid) {
		// 修复平台表格序号列位置移动导致的提示列位置错误导致的显示异常bug
		var rnColNum;
		$.each($("#entries").jqGrid("getAllColumn"),function(index,item){
			if(item.name=="rn"){
				rnColNum=index
			}
		})
		var rows = $('#entries').getGridParam("reccount");
		$("#entries tr[id='" + rowid + "'] td:eq("+rnColNum+")").attr('title', '');
		$("#entries tr[id='" + rowid + "'] td:eq("+rnColNum+")").html($("#entries tr[id='" + rowid + "']")[0].rowIndex);
		$("#entries tr[id='" + rowid + "'] td:eq("+rnColNum+")").css("color", "rgb(153, 153, 153)")
		$("#entries tr[id='" + rowid + "']").css("color", "rgb(153, 153, 153)");//如果设置成css("color","initial")会变成黑色，而原界面为灰色

	}
	,checkEnoughRemain : function(){
		var that = this;
		var info = true;
		var personCollTemp = {};
		var personCollTotalTemp = {};
		var rowIds = $("#entries").getDataIDs();
		for(var i = 0 ;i < rowIds.length ; i ++){
			  var personId = $("#entries").jqGrid('getCell',rowIds[i],"person").id;
			  var policyId = $("#entries").jqGrid('getCell',rowIds[i],"policy").id;
			  var remainLimit = $("#entries").jqGrid('getCell',rowIds[i],"remainLimit");
			  var leaveLength = $("#entries").jqGrid('getCell',rowIds[i],"leaveLength");
			  
		    	if(!personCollTotalTemp.hasOwnProperty(personId+"~~~"+policyId)){
		    		personCollTotalTemp[personId+"~~~"+policyId] = parseFloat(remainLimit);
		    	}
		    	if(personCollTemp.hasOwnProperty(personId+"~~~"+policyId)){
		    		var needLimit = parseFloat(personCollTemp[personId+"~~~"+policyId]);
		    		needLimit += parseFloat(leaveLength);
		    		personCollTemp[personId+"~~~"+policyId] = needLimit;
		    	}else{
		    		personCollTemp[personId+"~~~"+policyId] = leaveLength
		    	}
		}
		
		for(var i=0;i<rowIds.length;i++){
		      var personId = $("#entries").jqGrid('getCell',rowIds[i],"person").id;
			  var policyId = $("#entries").jqGrid('getCell',rowIds[i],"policy").id;
	    	  if(parseFloat(personCollTemp[personId+"~~~"+policyId])>parseFloat(personCollTotalTemp[personId+"~~~"+policyId])){
	    		info = false;
	    		return;
	    	  }
		}
		return info;
	}
	, checkEntry: function () {		
		var count = $('#entries').getGridParam("reccount");
		var errorFlag = 0;
		for(var i=1; i<=count; i++){
			var beginTime1 = new Date($("#entries").jqGrid('getCell', i, "beginTime"));
			var endTime1 = new Date($("#entries").jqGrid('getCell', i, "endTime"));
			for(var k = i + 1; k<=count; k++){
				var beginTime2 = new Date($("#entries").jqGrid('getCell', k, "beginTime"));
				var endTime2 = new Date($("#entries").jqGrid('getCell', k, "endTime"));
				if(!(beginTime1 >= endTime2 || endTime1 <= beginTime2)){
					errorFlag = 1;
					shr.showWarning({ message: "请假单分录"+i+"和分录"+k+"时间重复！" });
					break;
				}
			}
			
		}
		if (errorFlag == 1) {
			return false;
		} else {
			return true;
		}		
	}
	, checkRowIsOver: function () {
		if ($("#entries").getGridParam("reccount") > 100) {
			shr.showWarning({ message: "请假单分录不能超过100条！" });
			return false;
		} else {
			return true;
		}
	}
	/**
	 * 清空ev_ev数据 否则会有重复数据
	 */
	, clearEventDataInfos: function () {
		ev_ev.splice(0, ev_ev.length);//由于ev_ev是全局变量 所以要清空下数据
	}

	/**
     * 默认第一次点击弹出框的时候,默认加载系统当前年份的所有请假记录信息
     * 获取任何一年的所有请假单数据信息
     */
	, ajaxLoadAllLeaveBillDatas: function (yeargolbal, personId) {
		var that = this;
		//        var personId = that.getFieldValue("entries_person");
		//$.post(url,{personId: personId,currentYear:yeargolbal},function(datas) {
		that.remoteCall({
			type: "post",
			method: "getAnyYearLeaveBillDataInfos",
			param: { personId: personId, currentYear: yeargolbal },
			success: function (res) {
				var info = res;
				var leaveBillColls = JSON.parse(info.AllAtsLeaveBillList);
				var len = leaveBillColls.length;
				for (var i = 0; i < len; i++) {
					var applyDate = leaveBillColls[i].applyDate;//"2013-06-08 00:00:00"
					var beginTime = leaveBillColls[i].entries[0].beginTime;//2013-09-15 08:30:00
					var endTime = leaveBillColls[i].entries[0].endTime;
					var typeName = leaveBillColls[i].entries[0].policy.holidayType.name;
					var length = "";
					if (typeof (leaveBillColls[i].entries[0].leaveLength) != "undefined") {
						length = leaveBillColls[i].entries[0].leaveLength;
					}
					var unitType = "";
					if (typeof (leaveBillColls[i].entries[0].policy.unit) != "undefined") {
						unitType = leaveBillColls[i].entries[0].policy.unit.alias
					}
					var reason = "";
					if (typeof (leaveBillColls[i].entries[0].reason) != "undefined") {
						reason = leaveBillColls[i].entries[0].reason;
					}
					var state = leaveBillColls[i].billState.alias;
					var rowi = {};
					rowi.id = i + 1;	//编号
					rowi.beginTime = beginTime;//开始时间
					rowi.endTime = endTime;//结束时间
					rowi.typeName = typeName;//事假
					rowi.length = length;//1
					rowi.unitType = unitType;//天
					rowi.reason = reason;//原因
					rowi.state = state;//审批状态
					rowi.applyDate = applyDate;//申请日期
					var regEx = new RegExp("\\-", "gi");
					applyDate = applyDate.replace(regEx, "/");
					beginTime = beginTime.replace(regEx, "/");
					rowi.on = new Date(beginTime);//记录的是请假的开始时间
					ev_ev.push(rowi);
				}
				//that.initJqtimeLine();
				$('.gt-timeline').remove();
				/*默认函数值*/
				/*groupEventWithinPx 参数是将显示在此范围内PX的共同提示事件，为了防止很近节点重叠问题。设置小点。
				  设置为0，框架默认值是6.完全重合的时候，才叠加。
				*/
				$('#longTimeLine').jqtimeline({
					events: ev_ev,
					numYears: 1,
					gap: 55,
					groupEventWithinPx: 0,
					startYear: yeargolbal

				});
			}//success end 
		});//remoteCall end 
	}
	//dialog框 加载后一年的请假单数据
	, loadNextLeaveBillDatas: function () {
		var that = this;
		yearGolbal = yearGolbal + 1;
		that.ajaxLoadAllLeaveBillDatas(yearGolbal);
	}
	, showMoreMessage: function (rowid) {
		var that = this;

		yearGolbal = new Date().getFullYear();
		var personId = $("#entries").jqGrid('getCell', rowid, "person").id;
		$(".longDemo").show();
		that.clearEventDataInfos();
		that.ajaxLoadAllLeaveBillDatas(yearGolbal, personId);


		dialog_Html = "<div id='dialogViewMore' style = 'font-size: 12px; padding: 10px; width: 93%' title=''>" +
			"<p id='ppppp'></p>" +
			"<div class='longDemo demo'>" +
			"	<h2 style='font: 14px Microsoft Yahei; margin:0 auto; margin-left:5px;'>" +
			"		<font style=' font-size:0px;'>test</font>" +
			"		<span style='float:left; display:block;'><a id='a_pre' style='cursor:pointer'>前一年</a></span>" + //onClick='pre()' 
			"		<span style='float:right;display:block;'><a id='a_next' style='cursor:pointer'>后一年</a></span>" + //onClick='next()'
			"	</h2>" +
			"	<div id='longTimeLine' style='margin:0 auto;'></div>" +
			"</div>" +
			"</div>";

		$('#show_message_dialog').dialog({
			autoOpen: true,
			width: 800,
			height: 500,
			title: "",
			resizable: true,
			position: ['center', 'center'],
			modal: true,
			open: function (event, ui) {
				$('#show_message_dialog').append("<div id='showViewMore'></div>");
				$('#showViewMore').html(dialog_Html);
			},
			close: function (event, ui) {
				$('#message_head').empty();
			}
		});

		//绑定点击事件--放在里边会出现绑定多次点击事件
		$('#a_pre').click(function (e) {
			that.clearEventDataInfos();
			that.loadPreLeaveBillDatas(personId);
		});
		$('#a_next').click(function (e) {
			that.clearEventDataInfos();
			that.loadNextLeaveBillDatas(personId);
		});

	}

	//dialog框 加载前一年的请假单数据
	, loadPreLeaveBillDatas: function (personId) {
		var that = this;
		yearGolbal = yearGolbal - 1;
		that.ajaxLoadAllLeaveBillDatas(yearGolbal, personId);
	}
	//dialog框 加载后一年的请假单数据
	, loadNextLeaveBillDatas: function (personId) {
		var that = this;
		yearGolbal = yearGolbal + 1;
		that.ajaxLoadAllLeaveBillDatas(yearGolbal, personId);
	}
	, isLeaveLengthEdit: function (rowid) {
		var that = this;
		var personId = $("#entries").jqGrid('getCell', rowid, "person").id;
		if (typeof personId === 'undefined' || personId == null) {
			return;
		}
		var hrOrgUnitId = $("#hrOrgUnit_el").val();
		if (hrOrgUnitId == null || hrOrgUnitId == "") {
			shr.showWarning({ message: "请选择假期组织！" });
			return;
		}
		that.remoteCall({
			type: "post",
			method: "isLeaveLengthEdit",
			param: { personId: personId, hrOrgUnitId: hrOrgUnitId },
			async: false,
			success: function (res) {
				var info = res;
				if (info.errorString) {
					shr.showWarning({ message: info.errorString });
				} else {
					if (info.editable == 'true') {
						$("#" + rowid).find("td").eq(8).removeClass("disabled");
					} else {
						$("#entries").jqGrid('setCell', rowid, "leaveLength", "", "disabled");
					}
				}
			}
		});

	}
	, beforeSubmit: function () {

		var _self = this,
			workArea = _self.getWorkarea(),
			$form = $('form', workArea);
		_self.beforeWFValidStoreCellValue();
		if (($form.valid() && _self.verify())) {
			return true;
		}
		// return false 也能保存，固让js报错，后续让eas修改 return false 逻辑
		var len = workArea.length();
		return false;
	}


	, saveEditCellValue: function (rowid, cellname, value, iRow, iCol) {
		var _self = this;
		// 工作流界面且是编辑状态且不是未提交界面
		if (_self.isFromWF() && _self.getOperateState() == 'EDIT' && $("#billState").val() != 0) {
			this.rowid = rowid;
			this.cellname = cellname;
			this.value = value;
			this.iRow = iRow;
			this.iCol = iCol;
		}
	}

	, beforeWFValidStoreCellValue: function () {
		var _self = this;

		if (this.rowid && this.cellname && this.iRow && this.iCol) {
			$("#entries").jqGrid("saveCell", this.rowid, this.iCol);
			//_self.afterSaveCellTrigger(this.rowid, this.cellname, this.value, this.iRow , this.iCol) ;
		}
	}

	, getCurrentModel: function () {

		var that = this;
		var model = shr.ats.AtsLeaveBillBatchEdit.superClass.getCurrentModel.call(this);
		var len = model.entries.length;
		for (var i = 0; i < len; i++) {
			model.entries[i].realBeginTime = model.entries[i].beginTime;
			model.entries[i].realEndTime = model.entries[i].endTime;
			model.entries[i].realLeaveLength = model.entries[i].leaveLength;

			delete model.entries[i].policy;
			delete model.entries[i].person["person.gender"];
			delete model.entries[i].person["personOtherInfo.age"];
		}
        model.ccPersonIds = model.ccPersonIds && model.ccPersonIds.id || "";
        model.ccPerson = model.ccPersonIds;
		return model;
	}
	/**
	 * 组装保存时传至服务端的数据
	 */
	,assembleSaveData: function(action) {
		var _self = this;
		var data = shr.ats.atsLeaveBillEditNew.superClass.assembleSaveData.call(this,action);
		 var personDateStr = '';
		var model = JSON.parse(data.model);
		var len = model.entries.length;
		for (var i = 0; i < len; i++) {
			delete model.entries[i].prompt;
			delete model.entries[i].policy["state"];
			delete model.entries[i].person["person.gender"];
			delete model.entries[i].person["personOtherInfo.age"];
			var personId=model.entries[i].person.id;
			var policyId=model.entries[i].policy.id;
			var hrOrgUnitId=model.hrOrgUnit;
			var holidayTypeIds=model.entries[i].policy["id"];
			var policyId=_self.getHolidayPolicyNew(personId,holidayTypeIds,hrOrgUnitId);
			var holidayTypeName=model.entries[i].policy["name"];
			 model.entries[i]["adminOrgUnit"]= model.entries[i].policy["adminOrgUnit.id"],
			model.entries[i].policy={id:policyId,holidayType: {name_l2:holidayTypeName,name:holidayTypeName},name_l2:holidayTypeName,name:holidayTypeName};
			//组装参数
			var personId = model.entries[i].person.id;
			var date = model.entries[i].beginTime;
			if(date && personId){
				if(i > 0){
					personDateStr +=",";
				}
				personDateStr += personId +"_"+date.substring(0,10);
			}
		}
		
		if(personDateStr){
			_self.remoteCall({
				type:"post",
				method:"getPersonAdminOrgUnitHoliday",
				param:{ personDateStr:personDateStr},
				async: false,
				success:function(res){
					var info =  res;
					var personAtsInfo = {};
					for (var i = 0; i < len; i++) {
						var personId = model.entries[i].person.id;
						var date = model.entries[i].beginTime;
						if(date && personId){
							var person_date = personId +"_"+date.substring(0,10);
							personAtsInfo = res[person_date];
							if(personAtsInfo && personAtsInfo.adminOrgUnit){
								model.entries[i]["adminOrgUnit"]= personAtsInfo.adminOrgUnit;
								model.entries[i]["position"]= personAtsInfo.position;
							}
						}
					}
				}
			});
		}
        model.ccPerson = model.ccPersonIds;
		data.model = JSON.stringify(model);
		
		return data;
	}, getHolidayPolicyNew: function (personId,holidayTypeId,hrOrgUnitId) {
		var id="";
		$.ajax({
                type:"post",
                url:shr.getContextPath() + '/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsLeaveBillBatchEditHandler&method=getHolidayPolicy',                
                data:{ personId: personId, holidayTypeId: holidayTypeId, hrOrgUnitId: hrOrgUnitId },
                async:false,   // 异步，默认开启，也就是$.ajax后面的代码是不是跟$.ajx里面的代码一起执行               
                success: function (res) {
					info = res;
					id=res.holidayPolicyInfo.id;
					
				},
                error:function(res){                    
                    alert(res);
                }
            });
            return id;
	}
	,back: function(){
		if(this!=top){
			this.toLeaveBillListAction();
		}
	}
});

function strDateTime(str) {
	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
	var r = str.match(reg);

	if (r == null) {
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
		var r = str.match(reg);
		if (r == null) {
			return false;
		}
	}
	return true;
}
function escapeJquery(srcString) {
	// 转义之后的结果
	var escapseResult = srcString;

	// javascript正则表达式中的特殊字符
	var jsSpecialChars = ["\\", "^", "$", "*", "?", ".", "+", "(", ")", "[",
		"]", "|", "{", "}"];

	// jquery中的特殊字符,不是正则表达式中的特殊字符
	var jquerySpecialChars = ["~", "`", "@", "#", "%", "&", "=", "'", "\"",
		":", ";", "<", ">", ",", "/"];

	for (var i = 0; i < jsSpecialChars.length; i++) {
		escapseResult = escapseResult.replace(new RegExp("\\"
			+ jsSpecialChars[i], "g"), "\\"
			+ jsSpecialChars[i]);
	}

	for (var i = 0; i < jquerySpecialChars.length; i++) {
		escapseResult = escapseResult.replace(new RegExp(jquerySpecialChars[i],
			"g"), "\\" + jquerySpecialChars[i]);
	}

	return escapseResult;
}


