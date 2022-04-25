var _rowMap ;
var isOTControl=false;
var isOtrolByDateType=false;
shr.defineClass("shr.ats.team.TeamAtsOverTimeBillBatchEdit",shr.ats.atttenceEditFormImport, {
	filter:{},
	OTContrlParams:{},
	initalizeDOM:function(){
		shr.ats.team.TeamAtsOverTimeBillBatchEdit.superClass.initalizeDOM.call(this);
		var that = this ;
//		that.getOTContrlParams();
		//按组织填充按钮
		$('<button type="button" style="margin-left:4px;margin-right:4px" class="shrshrbtn-primary shrbtn" id="orgfill">' 
				+ jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_17 
				+ '</button>').insertAfter($("#addRow_entries"));
	
		var classfullNameService = "com.kingdee.shr.ats.web.formEditImport.AtsOverTimeBillFileEditFormService";
		//导入 按钮
		$('<button type="button" style="margin-left:4px;margin-right:4px;display: none" class="shrshrbtn-primary shrbtn" id="import">' 
				+ jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_3 
				+ '</button>').insertAfter($("#addRow_entries"));
		$('#import').click(function(){
			that.importAction(null,classfullNameService);
		})
		
		$('.editGrid-toolbar').append('<div style="display: inline;padding-left: 20px;">' 
				+ jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_32 
				+ '<div><div id="hasNum"></div>');
		var serviceId = shr.getUrlRequestParam("serviceId");
		var url=shr.getContextPath()+'/dynamic.do?checkLicense=true&uipk=com.kingdee.eas.hr.ats.app.OverTimeOrgFillForm';
		url += '&serviceId='+encodeURIComponent(serviceId);
		$('#orgfill').click(function(){
				$("#orgFillDiv").attr("src",url);
				var gridNum = $("#entries").getGridParam("reccount");
				$('#hasNum').val(gridNum);
				$('#orgFillDiv').dialog({
						title: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_17,
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
						buttons:[{
							text: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_19,
							click: function() {
								//校验F7数据
								if(that.checkF7Data()){
									var oldRowIds = $("#entries").getDataIDs();
									that.fillGrid();
									var newRowIds = $("#entries").getDataIDs();
									rowIds = that.getFillRowId(oldRowIds,newRowIds);
									$.each(rowIds,function(n,value) { 
										//that.calRestTimeLen(value); 2015-11-03:组织填充不用自动计算时长
										that.changOtTimeTipInfo(value);
									});
									//检查不超过100条记录
									//that.checkRowIsOver();
									$(this).dialog( "close" );
								}else{
									return;
								}
							}
						},{
							text: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_5,
							click: function() {
								$(this).dialog( "close" );
							}
						}]
				 		
				});
				
			$("#orgFillDiv").attr("style","width:1020px;height:550px;");
			
			
		});
		
		
		var entries_cont=waf("#entries");
		entries_cont.jqGrid("option", {
			  
			  beforeSaveCell:function (rowid, cellname, value, iRow, iCol) {
			  	
			  }
			  ,afterSaveCell:function (rowid, cellname, value, iRow, iCol) {
			  		that.removePreShowError(rowid);
			  		if(cellname=="otDate"){
				  		that.changeOverTimeType(rowid);
				  		that.calRestTimeLen(rowid);
				  		that.getOTContrlParams(rowid);
					}
					
					if(cellname=="otType"){
				  		that.changeOTCompens(rowid);
					}
			  		// 添加 开始时间  结束时间   休息时长(分钟) 响应时间 
					if(cellname=="startTime" || cellname=="endTime" || cellname=="restTime"){
						if(cellname!="restTime"){
							that.calRestTimeLen(rowid);
						}
				  		that.calculateOTtimes(rowid);
					}
					if(cellname=="person"){
				  		that.calRestTimeLen(rowid);
				  		that.getOTContrlParams(rowid);
					}
					if(cellname=="applyOTTime"){ // 加班小时数  发生改变就给予提示
				  		that.changOtTimeTipInfo(rowid);
					}
					if (cellname=="restStartTime" || cellname=="restStartTime2" || cellname=="restEndTime" ||cellname=="restEndTime2"){
			  			//计算休息时间，加班时间
                        var startTime = $("#entries").jqGrid('getCell',rowid,"startTime") ;
                        var endTime = $("#entries").jqGrid('getCell',rowid,"endTime") ;
                        var restStartTime = $("#entries").jqGrid('getCell',rowid,"restStartTime") ;
                        var restEndTime = $("#entries").jqGrid('getCell',rowid,"restEndTime") ;
                        var restStartTime2 = $("#entries").jqGrid('getCell',rowid,"restStartTime2") ;
                        var restEndTime2 = $("#entries").jqGrid('getCell',rowid,"restEndTime2") ;
                        if (startTime=="" || endTime==""){
                        	return
						}
                        var totalRestTime=0;
                        var totalRestTimeLong=0;
                        var restStartTimeOfDate;
                        var restEndTimeOfDate;
						if (restStartTime!="" && restEndTime!=""){
                            restStartTimeOfDate = new Date(restStartTime);
                            restEndTimeOfDate = new Date(restEndTime);
                            var times =restEndTimeOfDate.getTime()-restStartTimeOfDate.getTime();
                            if (times<0){
                            	times=0;
							}
                            totalRestTimeLong+=times;
							times=times/1000/60;
                            totalRestTime+=times;
						}
                        if (restStartTime2!="" && restEndTime2!=""){

                            var restStartTime2OfDate = new Date(restStartTime2);
                            var restEndTime2OfDate = new Date(restEndTime2);
                            if ((restStartTime!="" && restEndTime2OfDate.getTime()>restStartTimeOfDate.getTime() && restStartTimeOfDate.getTime()>=restStartTime2OfDate.getTime())
							||(restEndTime!="" && restEndTimeOfDate.getTime()<=restEndTime2OfDate.getTime() && restStartTime2OfDate.getTime()<restEndTimeOfDate.getTime())
								||(restStartTime!="" && restEndTime!="" && restEndTimeOfDate.getTime()>=restEndTime2OfDate.getTime() && restStartTime2OfDate.getTime()>=restStartTimeOfDate.getTime())
							){

                            	//时间有交叉
                                $("#entries").jqGrid('setCell',rowid,"restEndTime2",restStartTime2) ;

                            } else {
                                var times =restEndTime2OfDate.getTime()-restStartTime2OfDate.getTime();
                                if (times<0){
                                    times=0;
                                }
                                totalRestTimeLong+=times;
                                times=times/1000/60;
                                totalRestTime+=times;
							}

                        }
                        var  t1 = totalRestTime.toFixed(atsMlUtile.getSysDecimalPlace());
                        $("#entries").jqGrid('setCell',rowid,"restTime",t1) ;
                        var startTime =new Date(startTime+":00");
                        var endTime =new Date(endTime+":00");
                        var se = endTime.getTime()-startTime.getTime() -totalRestTimeLong; // 毫秒
                        var tfl = se/(3600*1000) ;
                        $("#entries").jqGrid('setCell',rowid,"applyOTTime",tfl) ;
                        that.getOTContrlParams(rowid);
					}
			  }
			  ,afterEditCell:function (rowid, cellname, value, iRow, iCol) 
			  {
			    if(cellname=="otType"  && that.OTContrlParams[rowid] && that.OTContrlParams[rowid].isOtrolByDateType){
					$("#"+iRow+"_otType").shrPromptBox("disable");
				}
			    if(cellname=="otCompens"){
			    	if(that.filter[rowid]==undefined){
			    		that.changeOTCompens(rowid);
			    	}
			    	if(that.filter[rowid]){
//						$("#"+rowid+"_otCompens").shrPromptBox("setFilter",that.filter[rowid]);
			    		$("#"+$("#entries").jqGrid('getCell',rowid,"rn")+"_otCompens").shrPromptBox("setFilter",that.filter[rowid]);
			    	}
				}
				 if(cellname=="person"){
					var hrOrgUnitId=$("#hrOrgUnit_el").val();
					$("#"+rowid+"_person").shrPromptBox().attr("data-params",hrOrgUnitId);
				}
			  }
		});
		
		that.setButtonVisible(); //初始化页面安装状态,如果是已经提交的或者审批通过的单据编辑按钮不显示
		//隐藏提交生效按钮
		if (that.getOperateState() == 'EDIT') {			
			if(that.isFromWF()){ // 来自流程中心
				$('#submitEffect').hide();
				$('#submit')
				.text(jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_25);
			}
		}
		
		//审核编辑界面
		if(that.isFromWF() && that.getOperateState() == 'EDIT'  && $("#billState").val() != 0)
		{
			$('#deleteRow_entries').unbind("click").attr("onclick","").css("cursor","default");
			$('#addRow_entries').unbind("click").attr("onclick","").css("cursor","default");
			$(".editGrid-toolbar").hide();
			$("#submit").hide();
			
			var lastRowNum = $('#entries').getGridParam("reccount");
			for (var i = 1;i<= lastRowNum;i++) {
				var temp_id = $("#entries tr:eq("+ i +")").attr("id");
				$("#entries").jqGrid('setCell',temp_id,'person','','not-editable-cell');
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
		 that.initCcPersonPrompt();
	},
    clearCCPersonIdsPrompt :function() {
        if ($('#ccPersonIds').length == 0) {
            return;
        }
        atsCcPersonUtils.clearCCPersonIdsPrompt(this);
    },
    initCcPersonPrompt :function() {
        if ($('#ccPersonIds').length == 0) {
            return;
        }
        atsCcPersonUtils.initCCPersonIdsPrompt(this);
        if (this.getOperateState() != 'VIEW') {
            var person = $('#proposer').shrPromptBox("getValue");
            if (!person) {
                // shr.showWarning({message:"Please select people."});
            } else {
                $('#ccPersonIds').shrPromptBox("setOtherParams", {
                    handler: "com.kingdee.shr.ats.web.handler.team.F7.TeamPersonForEmpOrgF7ListHandler",
                    personId: person.id
                });
            }
        }
	}
	,processF7ChangeEventHrOrgUnit : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					that.initCurrentHrOrgUnit(info.id);
//					that.emptyHrOrgBasedEntryData();
					// $("#entries_person_number").val("");
					// $("#entries_adminOrgUnit").val("");
					// $("#entries_position").val("");
					
				}
			});
		}
	}
	,initCurrentHrOrgUnit: function(hrOrgUnitId) {
		var that = this;
		// $("#entries_person").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
	}
	//切换业务组织，清空分录与业务组织相关的字段：人员、补签卡原因(视图上配)
//	,emptyHrOrgBasedEntryData : function(){
//		$("#entries").find('[aria-describedby=entries_person], [aria-describedby=entries_otCompens],' 
//			+ '[aria-describedby=entries_otReason]').text("");	
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
	//新增 jqgrid 行 方法， 复写
	,addRowAction: function(event) {
		//增加自己的逻辑
	    var that = this ; 
	    
	    var num = $("#entries").jqGrid("getRowData").length ;
	  	if(num>=100){
	  	    shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_6});
	  		return;
	  	}
	  	
		var source = event.currentTarget,
			$editGrid = this.getEditGrid(source);
		
		var data = this.createNewEntryModel(); // 默认的补偿方式
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
	// 获取填充的 rowId，导入的rowId 
	,getFillRowId:function(oldRowIds,newRowIds){
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
	}
	/**
	 * 专员列表点击取消的方法
	 * 这里有点特殊,采用屏蔽按钮,增加专员取消按钮的方法 替代 维护2次 atsOverTimeBillEdit.js 的方式
	 */
	,cancelAllAction:function(){
		/*var that = this ;
	 	window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.team.AtsOverTimeBill.list";*/
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.team.AtsOverTimeBill.list',
			serviceId: shr.getUrlRequestParam("serviceId")
		});
	}
	
	,submitAction: function(event) {
		var _self = this,
			workArea = _self.getWorkarea(),
			$form = $('form', workArea);
		if(!_self.validate()){
			return ;
		}
			
		if ($form.valid() && _self.verify()) {
			shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_15, function() {
				_self.doSubmit(event, 'submit');
			});
		}		
	}
	//提交即生效
	,submitEffectAction : function (event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		
		if(!_self.validate()){
			return ;
		}
		
		if ($form.valid() && _self.verify()) {
			if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
				shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_4, function() {
					_self.prepareSubmitEffect(event, 'submitEffect');
				});
			}else{
				shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_16, function() {
					_self.prepareSubmitEffect(event, 'submitEffect');
				});
			}
		}	
	},getCurrentModel : function() {
        var model = shr.ats.team.TeamAtsOverTimeBillBatchEdit.superClass.getCurrentModel.call(this);
        model.ccPersonIds = model.ccPersonIds && model.ccPersonIds.id || "";
        model.ccPerson = model.ccPersonIds;
        return model;
	}
	,assembleSaveData : function(action){
	    var data = shr.ats.team.TeamAtsOverTimeBillBatchEdit.superClass.assembleSaveData.call(this,action);
	    var model = JSON.parse(data.model);
		if(model.entries){
			var length = model.entries.length ;
			for( var i = 0 ; i < length ; i++)
			{
				if(model.entries[i].otReason && model.entries[i].otReason.state){
					 delete model.entries[i].otReason.state;
				}
				if(model.entries[i].otType && model.entries[i].otType.state){
					 delete model.entries[i].otType.state;
				}
				if(model.entries[i].otCompens && model.entries[i].otCompens.state){
					 delete model.entries[i].otCompens.state;
				}

				//2018-06-04 不知道怎么莫名其妙多了两个字段，而且是从第二个分录开始才有的
				//先屏蔽，有空再研究
				delete model.entries[i].person['person.gender'];
				delete model.entries[i].person['personOtherInfo.age'];
			}
            model.ccPerson = model.ccPersonIds;
			var assModeljson = $.toJSON(model) ;
			data.model = assModeljson ;
		}
		return data;
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
	/*
	,importAction: function(gridID,classfullName) {
		
		var _self = this;
		if(gridID != undefined)
		{
			grid = gridID	;
		}
		if(classfullName != undefined)
		{
			className = classfullName ;
		}
		
		var importDiv = $('#importDiv');
		if (importDiv.length > 0) {
		//	importDiv.data('uipk', lastUipk);
		//	importDiv.data('viewModel', viewModel);
		//	importDiv.data('classify', classify);
		//	importDiv.dialog('open');
		//	return;
		}
		 $('#importDiv').remove();
		 
		 selfParam = _self.setImportSelfParam();
		// 未生成dialog
		importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
		importDiv.data('uipk', lastUipk);
		importDiv.data('viewModel', viewModel);
		importDiv.data('grid', grid);
		importDiv.data('className', className);
		importDiv.data('selfParam',selfParam);
	//	importDiv.data('classify', classify);
		var oldRowIds = $("#entries").getDataIDs();
		if(_self.checkUpload()){ 
			importDiv.dialog({
				autoOpen: true,		
				width: 708,
				height: 700,
				title: "导入数据",
				resizable: true,
				position: ['top','top'],
				modal: true,
				open: function(event, ui) {
					//ie10不支持这段。
					/*if ($.browser.msie) {
						var url = shr.assembleURL('hr.ats.com.atttendanceCommonImport', 'view', {
							lastUipk: lastUipk,
							viewModel: viewModel ,
							className : className
							//classify:classify
						});
						var content = '<iframe id="importFrame" name="importFrame" width="700" height="600" frameborder="0" scrolling="no" allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					} else {---------------------
						
						var url = shr.assembleURL('hr.ats.com.atttendanceCommonImport$page', 'view');
						shr.loadHTML({
							url: url,
							success: function(response) {
								importDiv.append(response);
							}
						});
					//}
					document.documentElement.style.overflow='hidden';
				},
				close: function(event, ui) {
					document.documentElement.style.overflow='scroll';
					importDiv.empty();
					
					// 触发计算 请假次数 剩余额度 时长
					
					//点击序号列 让人员失去焦点
					$("#entries tr:eq(1) td:eq(0)").click();
					
					var newRowIds = $("#entries").getDataIDs();
					var rowIds = _self.getFillRowId(oldRowIds,newRowIds);
					$.each(rowIds,function(n,value) { 
						//若用户不填休息时间，自动计算休息时间；否则使用用户填写的休息时间
						var restTime = $("#entries").jqGrid('getCell',value,"restTime") ;
					    if(restTime===''){
							_self.calRestTimeLen(value);
                        }
						_self.changOtTimeTipInfo(value);
					});
					//检查不超过100条记录
					//_self.checkRowIsOver();
					
				} 
			});
		}
		
		$(".ui-dialog-titlebar-close").bind("click" , function(){
			importDiv.dialog("close");
		});		
	}
	*/
	,verify:function(){
		var _self = this ;
		var obj = $("#entries").jqGrid("getRowData");
		var errorString = "";
		var errorFlag = 0 ;
		if(obj.length == 0){
			shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_7});
			return false;
		}
		if(!_self.checkRowIsOver()){
//			closeLoader();
			return false;
		}
		
		_rowMap = {} ;
		
		openLoader(1,jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_29); 
		
		jQuery(obj).each(function(n){
		    	errorString = _self.checkEveryRow(n + 1 , this);
		   		if(errorString){
		   			_self.preShowError( n + 1 ,this.person.name + " " + errorString);
		   			errorFlag = 1 ;
		   		}
			
		 });
		 if(errorString && errorString != ""){
			 shr.showWarning({message: errorString});
			 closeLoader();
			 return false;
		 }
		
		 errorString = _self.validateOTEntry();
		 if(errorString && errorString != ""){
			 shr.showWarning({message: errorString});
			 closeLoader();
			 return false;
		 }
		 
//		 if(!_self.verifyCheck()){
//		 	closeLoader();
//		 	return false;
//		 }
		 
		 if(errorFlag == 0){
			 //工作流审批界面，加班补提控制。
		 	var boo = true;
		    boo = _self.validateIsFillOtVerify();
		    closeLoader();
   			return boo;
		 }else{
		 	closeLoader();
			return false;
		 }
		 
	}
	, verifyRestTime: function( beforeSubmit,value){
		var startTime0 = value.startTime;
		var endTime0 = value.endTime;
		if(startTime0 == "" || startTime0 == undefined){
			return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_2;
		}
		if(endTime0 == "" || endTime0 == undefined){
			return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_1;
		}
		var startTimeOfDate = new Date(startTime0);
		var endTimeOfDate = new Date(endTime0);
		var restStartTime = value.restStartTime;
		var restEndTime = value.restEndTime;
		var restStartTime2 = value.restStartTime2;
		var restEndTime2 = value.restEndTime2;
		var restStartTimeOfDate = new Date(restStartTime);
		var restEndTimeOfDateOfDate = new Date(restEndTime);
		if (restStartTime!=undefined && restStartTime!=""){
			if (restStartTimeOfDate.getTime()<startTimeOfDate.getTime() ||restStartTimeOfDate.getTime()>endTimeOfDate.getTime()){
				return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_6;

			}
		}
		if (restEndTime!=undefined && restEndTime!="") {
			if (restEndTimeOfDateOfDate.getTime() < startTimeOfDate.getTime() || restEndTimeOfDateOfDate.getTime() > endTimeOfDate.getTime()
				||restEndTimeOfDateOfDate.getTime() < restStartTimeOfDate.getTime()) {
				return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_3;
			}
		}
		var restStartTimeOfDate2 = new Date(restStartTime2);
		var restEndTimeOfDateOfDate2 = new Date(restEndTime2);
		if (restStartTime2!=undefined && restStartTime2!=""){
			if (restStartTimeOfDate2.getTime()<startTimeOfDate.getTime() ||restStartTimeOfDate2.getTime()>endTimeOfDate.getTime()){
				return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_8;
			}
		}
		if (restEndTime2!=undefined && restEndTime2!="") {
			if (restEndTimeOfDateOfDate2.getTime() < startTimeOfDate.getTime() || restEndTimeOfDateOfDate2.getTime() > endTimeOfDate.getTime()
				||restEndTimeOfDateOfDate2.getTime() < restStartTimeOfDate2.getTime()){
				return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_4;
			}
		}
		if( (restStartTime!="" && restStartTime!=undefined && (restEndTime==""||restEndTime==undefined))
			|| (restEndTime!="" && restEndTime!=undefined && (restStartTime==""||restStartTime==undefined))
		)
		{
			if (beforeSubmit){
				return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_5;
			}
			return "";
		}
		if( (restStartTime2!="" && restStartTime2!=undefined && (restEndTime2==""||restEndTime2==undefined))
			|| (restEndTime2!="" && restEndTime2!=undefined && (restStartTime2==""||restStartTime2==undefined))
		)
		{
			if (beforeSubmit) {
				return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_7;
			}
			return "";
		}
		if (restStartTime != "" && restStartTime != undefined && restStartTime2 != "" && restStartTime2 != undefined) {
			//两个加班休息时间都填了，那么判断不能交叉
			if((restStartTimeOfDate.getTime()<restEndTimeOfDateOfDate2.getTime() && restStartTimeOfDate.getTime()>=restStartTimeOfDate2.getTime())
				||(restStartTimeOfDate2.getTime()<restEndTimeOfDateOfDate.getTime() && restStartTimeOfDate2.getTime()>=restStartTimeOfDate.getTime())
			){
				return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_0;
			}
		}

	}
	,checkEveryRow : function(rownum,value){
			var that = this ;
			var regEx = new RegExp("\\-","gi"); //i不区分大小写 g匹配所有
			
		 	var startTime = value.startTime ;
			var endTime = value.endTime ;
			
			var startTimeOfDate = NewLongDate(startTime+":00"); 
		 	var endTimeOfDate = NewLongDate(endTime+":00");
		 	
		 	var longTime = endTimeOfDate.getTime() - startTimeOfDate.getTime();
		 	var otType = value.otType.id;
		 	
		 	//处理加班日期 与 加班开始时间 和结束时间的日期保持一致
		 	var overDate = value.otDate ; //加班日期
		 	overDate = overDate.substring(0,10);
		 	var overTimeBegin = value.startTime ;
		 	overTimeBegin = overTimeBegin.substring(0,10); //2014-01-02 00:00
		 	var overTimeEnd = value.endTime ;
		 	overTimeEnd = overTimeEnd.substring(0,10);
		 	
		 	var overTimeDate = NewShortDate(overDate);
	 		var overTimeStartDate = NewShortDate(overTimeBegin); 
	 		var overTimeEndDate = NewShortDate(overTimeEnd);
	 	
		 	
			if ( overTimeStartDate.getTime() <overTimeDate.getTime()-24*60*60*1000  ) {//longTime_start != 0 &&  longTime_end != 0
//		 		shr.showInfo({message: "不支持跨多天加班。"});
//				return false;
				return jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_1;
		 	}
		 	if ( overTimeEndDate.getTime()-24*60*60*1000  > overTimeDate.getTime() ) {
		 		/*shr.showInfo({message: "不支持跨多天加班。"});
				return false;*/
		 		return jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_1;
		 	}
			if ( overTimeEndDate.getTime()- overTimeStartDate.getTime() >=2*24*60*60*1000) {
				return jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_1;
			}
		 	if (longTime <= 0) {
		 		/*shr.showInfo({message: "加班开始时间必须小于加班结束时间。"});
				return false;*/
		 		return jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_8;
		 	}
		 	var applyOTTime = value.applyOTTime;
		 	if(applyOTTime < 0){
		 	    return jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_11;
		 	}
		 	
		 	// 检查jqgrid 表格里的是否有重复数据
		 	var rowValue = new Array();
				rowValue[0] = value.person.id;
				rowValue[1] = value.startTime;
				rowValue[2] = value.endTime;
		 		_rowMap[rownum] = rowValue;
		 	for(var prop in _rowMap){
 			   if(_rowMap.hasOwnProperty(prop)){
 			   		var beginTimeTemp = NewLongDate(_rowMap[prop][1]);
 			   		var endTimeTemp = NewLongDate(_rowMap[prop][2]);
 			   		if(prop!=rownum&&_rowMap[prop][0]==value.person.id&&!(beginTimeTemp.getTime()>=endTimeOfDate.getTime()||endTimeTemp.getTime()<=startTimeOfDate.getTime())){
 			   			return shr.formatMsg(jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_2, [prop]);
 			   		
 			   		}
    			}
			}

        var msg =this.verifyRestTime(true,value);
        if (msg!=""){
            return msg;
        }
		 	//设置同步
//		 	var info ;
//		 	that.remoteCall({
//				type:"post",
//				method:"isWorkTime",
//				async: false,
//				param:{personId: value.person.id,overDate:value.otDate,overTimeBegin:value.startTime+":00",overTimeEnd:value.endTime+":00"},
//				success:function(res){
//					   info = res;
//				}
//			});
//		 	
//			if (info.isWorkTime){
//				return "加班开始结束时间和上班时间有交叉。";
//			}	
//			
//			//判断申请加班小时数是否达到加班起始值
//			var validOtStartString;
//		 	that.remoteCall({
//				type:"post",
//				method:"validOtStart",
//				async: false,
//				param:{personId: value.person.id,applyOTTime:applyOTTime},
//				success:function(res){
//					   var validInfo = res.info;
//					   if(validInfo!=null　&& validInfo!=""){
//						   validOtStartString=validInfo;
//					   }
//				}
//			});
//	 	    if(validOtStartString!=null　&& validOtStartString!=""){
//	 	    	return validOtStartString;
//	 	    }
//			 
//			//是否在“固定加班”时间段或者“固定加班不计异常”时间段内
//			var obj;
//		 	that.remoteCall({
//				type:"post",
//				method:"isAtFixedOverTimeOrExcep",
//				async: false,
//				param:{personId: value.person.id,overDate:value.otDate,overTimeBegin:value.startTime+":00",overTimeEnd:value.endTime+":00"},
//				success:function(res){
//					obj = res;
//				}
//			});
//		 	
//			if (obj.isAtFixedOverTimeOrExcep){
//				return "不能在固定加班时间段内提交加班单。";
//			}	
//			
//		 	var errorString = that.validateIsExistBill(value.person.id,startTime,endTime,$('#id').val());
//	   		if(errorString){
//	   			return errorString;
//	   		}
//   			if(value.otCompens.id =="AERg0TIcSnaM40EKvJCdRKlrTmA="){ // 只有等于调休的时候才校验
//   				var errorString = that.validateIsValidateLimit(value.person.id,value.otDate,value.applyOTTime,otType);
//   				if(errorString){
//   					return errorString;
//   				}
//   			}
//			
//   			var errorString = that.checkattencePolicyParm(rownum);
//   			if(errorString){
//	   			return errorString;
//			}
			
			//燕菊说，补提控制校验放这里 2018-05-30
			//人机问题，集成测试阶段再细细改
			/*
			var fillOTRes;
		 	that.remoteCall({
				type:"post",
				method:"validIsFillOT",
				async: false,
				param:{
					personId : value.person.id,
					overDate : value.otDate,
					overTimeBegin : value.startTime+":00",
					overTimeEnd : value.endTime+":00"
				},
				success:function(res){
					fillOTRes = res;
				}
			});
		 	
			if (fillOTRes.isIllegal){
				return "超过加班补提控制期限！";
			}	
			*/
		 	return "" ;
	
	}// 调休额度是否正确 ；
	,validateIsValidateLimit : function(personId,otDate,currentValue,otType){
		var that = this;
		if($('#hrOrgUnit_el')==null || $('#hrOrgUnit_el') ==""){
			shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_18});
			return;
		}
			var info;
			var infoLeaveBillNumber;
			otDate =otDate.substring(0,10);
			var errorString = "";
		 		that.remoteCall({
				type:"post",
				async: false,
				method:"isOverMaxQuota",
				param:{personId:personId,otDate:otDate,currentValue:currentValue,otType:otType,hrOrgUnitId:$('#hrOrgUnit_el').val()},
				success:function(res){
					if(!res.resFlag){
						errorString = res.resMsg ;						
					}
				}
			});
		return errorString;
	}
	,validateIsExistBill : function(personId , beginTime , endTime , billId ){
			var that = this;
			var info;
			var infoLeaveBillNumber;
			var errorString = "";
		 		that.remoteCall({
				type:"post",
				async: false,
				method:"validateIsExistBill",
				param:{personId:personId,beginTime:beginTime,endTime:endTime,billId:billId},
				success:function(res){
					info =  res;
				}
			});
		    
		    if (errorString) {
		      errorString = shr.formatMsg(jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_27,
				  [info.overTimeNum, info.personName, info.beginTime, info.endTime]);
			  return errorString;
		    }  
	},
	// 获取表格序号列，修复平台表格序号列位置移动导致的提示列位置错误导致的显示异常bug
	getColNumIndex:function(){
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
	//对校验结果进行页面个性化提示
	,preShowError:function(iRow,errorString){
		var rnColNum=this.getColNumIndex()
			var that = this;
			if (errorString){
				$("#entries tr:eq("+iRow+") td:eq("+rnColNum+")").html("！").css("color","red").attr({"data-toggle":"tooltip","data-placement":"left","title":errorString});
				$("#entries tr[id='"+iRow+"']").css("color","red");
			/*
				$("#entries tr:eq("+iRow+") td:eq(2)").css("color","red");
				$("#entries tr:eq("+iRow+") td:eq(3)").css("color","red");
				$("#entries tr:eq("+iRow+") td:eq(4)").css("color","red");
			*/			
			}
	}
	//对校验结果进行页面个性化提示
	,preShowWarn:function(iRow,errorString){
		var rnColNum=this.getColNumIndex()
			var that = this;
			$("#entries").find('tr').eq(iRow).find('td').eq(rnColNum).text("？").css("color","red").attr({"data-toggle":"tooltip","data-placement":"left","title":errorString});
			
	}
	//去除个性化展示，每次校验前去除
	,removePreShowError:function(rowid){
		var rnColNum=this.getColNumIndex()
		var rows = $('#entries').getGridParam("reccount");
			$("#entries tr[id='"+rowid+"'] td:eq("+rnColNum+")").attr('title','');
			$("#entries tr[id='"+rowid+"'] td:eq("+rnColNum+")").html($("#entries tr[id='"+rowid+"']")[0].rowIndex);
			$("#entries tr[id='"+rowid+"'] td:eq("+rnColNum+")").css("color","rgb(153, 153, 153)")
			$("#entries tr[id='"+rowid+"']").css("color","rgb(153, 153, 153)");//如果设置成css("color","initial")会变成黑色，而原界面为灰色
		
	}
	,checkF7Data : function(){
			var that = this;
			
			var otDate = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("otDate");
			var  adminOrgUnit_el = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit_el").val() ;
			var  adminOrgUnit = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit").val() ;
			var  person_el = $(window.frames["orgFillDiv"].document).find("#person_el").val() ;
			var  person = $(window.frames["orgFillDiv"].document).find("#person").val() ;
			
			var startTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("startTime");
			var otType_el =$(window.frames["orgFillDiv"].document).find("#otType_el").val() ;
			var otType = $(window.frames["orgFillDiv"].document).find("#otType").val() ;
			var endTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("endTime");
			
			var otCompens_el = $(window.frames["orgFillDiv"].document).find("#otCompens_el").val();
			var otCompens = $(window.frames["orgFillDiv"].document).find("#otCompens").val();
			
			
			var restTime = $(window.frames["orgFillDiv"].document).find("#restTime").val() ;
			var otReason_el =$(window.frames["orgFillDiv"].document).find("#otReason_el").val() ;
			var otReason = $(window.frames["orgFillDiv"].document).find("#otReason").val() ;
			var applyOTTime = $(window.frames["orgFillDiv"].document).find("#applyOTTime").val() ;
			
			var remark = $(window.frames["orgFillDiv"].document).find("#remark").val();
			var remain = $(window.frames["orgFillDiv"].document).find("#remain").text();
			var checkAmount = $(window.frames["orgFillDiv"].document).find("#checkAmount").text();
			var attencegroup_el = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup_el").val();
			var prop_attencegroup = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup").val();
			/*
			var otDate = $('iframe')[0].contentWindow.$('#otDate').val();
					        	
        	var adminOrgUnit_el = $('iframe')[0].contentWindow.$('#adminOrgUnit_el').val();
        	var adminOrgUnit = $('iframe')[0].contentWindow.$('#adminOrgUnit').val();
        	
        	var person_el = $('iframe')[0].contentWindow.$('#person_el').val();
        	var person = $('iframe')[0].contentWindow.$('#person').val();
        	
        	var startTime = $('iframe')[0].contentWindow.$('#startTime').val();
        	
        	var otType_el = $('iframe')[0].contentWindow.$('#otType_el').val();
        	var otType = $('iframe')[0].contentWindow.$('#otType').val();
        	
        	var endTime = $('iframe')[0].contentWindow.$('#endTime').val();
        	
        	var otCompens_el = $('iframe')[0].contentWindow.$('#otCompens_el').val();
        	var otCompens = $('iframe')[0].contentWindow.$('#otCompens').val();
        
        	var restTime = $('iframe')[0].contentWindow.$('#restTime').val();
        	
        	var otReason_el = $('iframe')[0].contentWindow.$('#otReason_el').val();
        	var otReason = $('iframe')[0].contentWindow.$('#otReason').val();
        	
        	var applyOTTime = $('iframe')[0].contentWindow.$('#applyOTTime').val();
        	var remark = $('iframe')[0].contentWindow.$('#remark').val();
        	var remain = $('iframe')[0].contentWindow.$('#remain').text();
        	var checkAmount = $('iframe')[0].contentWindow.$('#checkAmount').text();
        	*/
        	//校验
        	if(parseInt(checkAmount) > parseInt(remain)){ 
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_33});
	        		return false;
    		}
        	
        	//校验
        	if(!otDate){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_10});
	        		return false;
    		}
        	
    		if((!adminOrgUnit_el||!adminOrgUnit)&&(!person_el||!person)
    		&& (attencegroup_el == undefined || attencegroup_el == null || attencegroup_el == ""
				|| prop_attencegroup == undefined || prop_attencegroup == null || prop_attencegroup == "")){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_30});
	        		return false;
    		}
    		
        	if(!startTime){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_14});
	        		return false;
    		}
    		
    		if(!otType_el||!otType){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_9});
	        		return false;
    		}
    		
    		if(!endTime){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_13});
	        		return false;
    		}
    		
    		if(!otCompens_el||!otCompens){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_0});
	        		return false;
    		}
    		
    		/*if(!restTime){
	        		shr.showWarning({message: "休息时长(分钟)不能为空！"});
	        		return false;
    		}*/
    		
    		/*if(!otReason_el||!otReason){
	        		shr.showWarning({message: "加班原因不能为空！"});
	        		return false;
    		}*/
    		
    		if(!applyOTTime){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_20});
	        		return false;
    		}
	
    		return true;
	}
	
	,fillGrid:function(){
		    var that = this;
			var otDate = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("otDate");
			var  adminOrgUnit_el = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit_el").val() ;
			var  adminOrgUnit = $(window.frames["orgFillDiv"].document).find("#adminOrgUnit").val() ;
			var  person_el = $(window.frames["orgFillDiv"].document).find("#person_el").val() ;
			var  person = $(window.frames["orgFillDiv"].document).find("#person").val() ;
			
			var startTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("startTime");
			var otType_el =$(window.frames["orgFillDiv"].document).find("#otType_el").val() ;
			var otType = $(window.frames["orgFillDiv"].document).find("#otType").val() ;
			var endTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("endTime");
			
			var otCompens_el = $(window.frames["orgFillDiv"].document).find("#otCompens_el").val();
			var otCompens = $(window.frames["orgFillDiv"].document).find("#otCompens").val();
			
			
			var restTime = $(window.frames["orgFillDiv"].document).find("#restTime").val() ;
			var otReason_el =$(window.frames["orgFillDiv"].document).find("#otReason_el").val() ;
			var otReason = $(window.frames["orgFillDiv"].document).find("#otReason").val() ;
			var applyOTTime = $(window.frames["orgFillDiv"].document).find("#applyOTTime").val() ;
			var hrOrgUnitId = $(window.frames["orgFillDiv"].document).find("#bill_hrOrgUnit_el").val() ;
			var attencegroupId = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup_el").val();
			var prop_attencegroup = $(window.frames["orgFillDiv"].document).find("#prop_attencegroup").val();
			var description = $(window.frames["orgFillDiv"].document).find("#remark").val();
			var setType = $(window.frames["orgFillDiv"].document).find("#setType1").is(":visible")?1:2;
        	var currentPagePermItemId= that.currentPagePermItemId;
        	var hasNum = $("#entries").getGridParam("reccount") ; // 已经存在的条数
				if((adminOrgUnit_el&&adminOrgUnit)||(attencegroupId&&prop_attencegroup)){
		    		that.remoteCall({
						type:"post",
						async: false,
						method:"getPersonsByOrgUnit",
						param:{ attencegroupId: attencegroupId,hrOrgUnitId:hrOrgUnitId,orgUnitId:adminOrgUnit_el,otDate:otDate,otType:otType_el,personIds:person_el,setType:setType,currentPagePermItemId:currentPagePermItemId},
						success:function(res){
							info =  res;
							var personColl = jQuery.parseJSON(info.personColl);
							var rowTipId = [] ;
							$.each(personColl,function(n,value) { 
						        	
								    // 拼json string
									var otDateString = ' "otDate" : "'+ otDate +'"';
								
									var adminOrgUnitString = ' "adminOrgUnit" : { "id": "' 
						        							+ adminOrgUnit_el
						        							+ '", "name": "'
						        							+ adminOrgUnit
						        							+ '"}';		
									var personString = ' "person" : { "id": "' 
						        							+ value.id
						        							+ '", "name": "'
						        							+ value.name
						        							+ '"}';		
			
									var startTimeString = ' "startTime" : "'+ startTime +'"';
			
									var otTypeString = ' "otType" : { "id": "' 
						        							+ otType_el
						        							+ '", "name": "'
						        							+ otType
						        							+ '"}';		
			
						        	var endTimeString = ' "endTime" : "'+ endTime +'"';
						        	
						        	var otCompensString  = "";
						        	if(otCompens_el){
						        	var otCompensString = ' "otCompens" : { "id": "' 
						        							+ otCompens_el
						        							+ '", "name": "'
						        							+ otCompens
						        							+ '"}';	
						        	}
			
									var restTimeString = ' "restTime" : "'+ restTime +'"';
									
									var otReasonString = ' "otReason" : { "id": "' 
						        							+ otReason_el
						        							+ '", "name": "'
						        							+ otReason
						        							+ '"}';	
			
			
						        	var applyOTTimeString = ' "applyOTTime" : "'+ applyOTTime +'"';
						        	
						        	var descriptionString = ' "description" : "'+ description +'"';
						        	
						        	var dataString = ' { "data" : {' 
						        					+ otDateString + ', '
						        					+ adminOrgUnitString + ', '
						        					+ personString + ', '
						        					+ startTimeString + ', '
						        					+ otTypeString + ', '
						        					+ endTimeString + ', '
						        					+ otCompensString + ', '
						        					+ restTimeString + ', '
						        					+ otReasonString + ', '
						        					+ applyOTTimeString + ', '
						        					+ descriptionString + '}} ' ;
						        					
									var dataJson = jQuery.parseJSON(dataString);
									
									$("#entries").jqGrid('addRow',dataJson);
									
									//点击序号列 让人员失去焦点
									$("#entries tr:eq(1) td:eq(0)").click();
									// hasNum 
									if(value.addressTX == "2"){
										rowTipId.push(n + 1 + hasNum);
									}
							});
							if(rowTipId.length!=0){
								for(var ii=0;rowTipId.length>ii;ii++){
									that.preShowWarn( rowTipId[ii] , jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_31);
								}
							}
						}
					});
			
			}else{
					var person_el_split = person_el.split(',');
					var person_split = person.split(',');
					for(var i = 0 ; i<person_el_split.length;i++){
					
						    // 拼json string
							var otDateString = ' "otDate" : "'+ otDate +'"';
						
							var personString = ' "person" : { "id": "' 
				        							+ person_el_split[i]
				        							+ '", "name": "'
				        							+ person_split[i]
				        							+ '"}';		
		
							var startTimeString = ' "startTime" : "'+ startTime +'"';
		
							var otTypeString = ' "otType" : { "id": "' 
				        							+ otType_el
				        							+ '", "name": "'
				        							+ otType
				        							+ '"}';		
		
				        	var endTimeString = ' "endTime" : "'+ endTime +'"';
				        	
				        	var otCompensString = ' "otCompens" : { "id": "' 
				        							+ otCompens_el
				        							+ '", "name": "'
				        							+ otCompens
				        							+ '"}';	
		
							var restTimeString = ' "restTime" : "'+ restTime +'"';
							
							var otReasonString = ' "otReason" : { "id": "' 
				        							+ otReason_el
				        							+ '", "name": "'
				        							+ otReason
				        							+ '"}';	
		
		
				        	var applyOTTimeString = ' "applyOTTime" : "'+ applyOTTime +'"';
				        	
				        	var descriptionString = ' "description" : "'+ description +'"';
				        	
				        	var dataString = ' { "data" : {' 
				        					+ otDateString + ', '
				        					+ personString + ', '
				        					+ startTimeString + ', '
				        					+ otTypeString + ', '
				        					+ endTimeString + ', '
				        					+ otCompensString + ', '
				        					+ restTimeString + ', '
				        					+ otReasonString + ', '
				        					+ applyOTTimeString + ', '
				        					+ descriptionString + '}} ' ;
				        					
							var dataJson = jQuery.parseJSON(dataString);		
							$("#entries").jqGrid('addRow',dataJson);
							//点击序号列 让人员失去焦点
							$("#entries tr:eq(1) td:eq(0)").click();
					}	
			}
	
	}
	,checkRowIsOver : function(){
		if( $("#entries").jqGrid("getRowData").length > 100){
			shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_6});
			return false;
		}else{
			return true;
		}
	}
	// 如 加班小时数发生变化 则给予提示
	,changOtTimeTipInfo :function(rowid){ //
		var that = this ;
		var startTime = $("#entries").jqGrid('getCell',rowid,"startTime") ;
		var endTime = $("#entries").jqGrid('getCell',rowid,"endTime") ;
		var restTime = $("#entries").jqGrid('getCell',rowid,"restTime") ;
		var applyOTTime = $("#entries").jqGrid('getCell',rowid,"applyOTTime") ;
		
		if(startTime!="" && endTime!=""){
			var restVal = 0;
			if(restTime!="" && (/^[0-9]*$/.test(restTime))){
				restVal = restTime; // 分钟数 
			}
			var startTime =new Date(startTime+":00");
			var endTime =new Date(endTime+":00");
			var se = endTime.getTime()-startTime.getTime() - (restVal * 1000 * 60); // 毫秒
			var tfl = se/(3600*1000) ;  
			if(tfl!=applyOTTime){ // 不相等就给予提示
				that.preShowWarn( rowid , jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_24);
			}
			//$("#entries").jqGrid('setCell',rowid,"applyOTTime",tfl); 计算的值
		}
	
	}
	// if(cellname=="startTime" || cellname=="endTime" || cellname=="restTime"){
	,calRestTimeLen : function(rowid){
		var startTime = $("#entries").jqGrid('getCell',rowid,"startTime") ;
		var endTime = $("#entries").jqGrid('getCell',rowid,"endTime") ;
		if (startTime==undefined ||startTime=="" ||endTime==undefined ||endTime==""){
			return;
		}
		if(startTime =="[object Object]"){
			$("#"+rowid).find('td').eq('5').text("");
			$("#"+rowid).find('td').eq('5').attr("title","");
			alert("1")
			return ;
		}
		if(endTime =="[object Object]"){
			$("#"+rowid).find('td').eq('6').text("");
			$("#"+rowid).find('td').eq('6').attr("title","");
			return ;
		}
        if(!$("#entries").jqGrid('getCell',rowid,"otDate")){
			return;
		}else{
			otDate = $("#entries").jqGrid('getCell',rowid,"otDate");
		}
		if(!$("#entries").jqGrid('getCell',rowid,"person")){
			return;
		}else{
			personId = $("#entries").jqGrid('getCell',rowid,"person").id;
		}
        this.remoteCall({
			type:"post",
			method:"getMyRestTime",
			async: false,
			param:{personId:personId,tDay:otDate,realStartTime:startTime,realEndTime:endTime},
			success:function(res){
					var resLen = res.restTime<0?0:res.restTime;

                var restStartTime = res.restStartTime ;
                var restStartTime2 = res.restStartTime2 ;
                var restEndTime = res.restEndTime ;
                var restEndTime2 = res.restEndTime2 ;
                $("#entries").jqGrid('setCell',rowid,"restTime",resLen);
                $("#entries").jqGrid('setCell',rowid,"restStartTime",restStartTime);
                $("#entries").jqGrid('setCell',rowid,"restStartTime2",restStartTime2);
                $("#entries").jqGrid('setCell',rowid,"restEndTime",restEndTime);
                $("#entries").jqGrid('setCell',rowid,"restEndTime2",restEndTime2);
				}
		});
	}
	,calculateOTtimes : function(rowid){
		var startTime = $("#entries").jqGrid('getCell',rowid,"startTime") ;
		var endTime = $("#entries").jqGrid('getCell',rowid,"endTime") ;
		var restTime = $("#entries").jqGrid('getCell',rowid,"restTime") ;
		 
		if(startTime =="[object Object]"){
			$("#"+rowid).find('td').eq('5').text("");
			$("#"+rowid).find('td').eq('5').attr("title","");
		}
		if(endTime =="[object Object]"){
			$("#"+rowid).find('td').eq('6').text("");
			$("#"+rowid).find('td').eq('6').attr("title","");
		}
		
		if(startTime!="" && endTime!=""){
			var restVal = 0;
			if(restTime!="" && (/^[0-9]*$/.test(restTime))){
				restVal = restTime; // 分钟数 
			}
			var startTime = NewDate(startTime+":00");
			var endTime = NewDate(endTime+":00");
			var se = endTime.getTime()-startTime.getTime() - (restVal * 1000 * 60); // 毫秒
			var tfl = se/(3600*1000);
			$("#entries").jqGrid('setCell',rowid,"applyOTTime",tfl.toFixed(atsMlUtile.getSysDecimalPlace()));
		}
	},
	//获取档案历史加班类型的加班补偿方式
	getOTCompensByOTType : function ( personId, otTypeId,tDate) {
		var _self = this;
		
		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamAtsOverTimeBillEditHandler';
		var otCompens="";
		_self.remoteCall({
			type:"post",
			method:"getOTCompensByOTType",
			url:url,
			param:{personId:personId,otTypeId:otTypeId,otDate:tDate},
			async: false,
			success:function(res){
				otCompens =  res.otCompens;
				
			}
		});
		return otCompens;
	},
	//获取当前加班类型的加班补偿方式
	getOTCompensByOTTypes : function ( personId, otTypeId) {
		var _self = this;
		
		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamAtsOverTimeBillEditHandler';
		var otCompens="";
		_self.remoteCall({
			type:"post",
			method:"getOTCompensByOTTypes",
			url:url,
			param:{personId:personId,otTypeId:otTypeId},
			async: false,
			success:function(res){
				otCompens =  res.otCompens;
				
			}
		});
		return otCompens;
	}
	,changeOTCompens:function(rowid){
		var that=this;
    	var otCompensId ;
    	if(!$("#entries").jqGrid('getCell',rowid,"otType")){
			return;
		}else{
			otTypeId = $("#entries").jqGrid('getCell',rowid,"otType").id;
		}
    	
    	if(!$("#entries").jqGrid('getCell',rowid,"person")){
			return;
		}else{
			var personId = $("#entries").jqGrid('getCell',rowid,"person").id;
		}
		
		if(!$("#entries").jqGrid('getCell',rowid,"otDate")){
			return;
		}else{
			var otDate = $("#entries").jqGrid('getCell',rowid,"otDate");
		}
    	
    	
		/*// zkbt5bMLQ3ehUivmKbtBOqlrTmA=  加班费 
		var otCompensObejct = {id:"zkbt5bMLQ3ehUivmKbtBOqlrTmA=",name:"加班费"};
		//等于法定节假日 id   sRWUOt7sRpOY0TCo6NMqGY6C/nU=
*/		
		var otCompensIds = that.getOTCompensByOTTypes(personId,otTypeId);

		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamAtsOverTimeBillEditHandler';
		that.remoteCall({
			type:"post",
			method:"getDefaultOTCompens",
			url:url,
			param:{personId:personId,otTypeId:otTypeId,otDate:otDate},
			async: false,
			success:function(res){
				var info =  res;
				if (info.defaultId == "" || info.defaultId ==undefined ){
					shr.showWarning({message:jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_28});
				}else {
					var defaultOTCompens = {id:info.defaultId,name:info.defaultName};	
					$("#entries").jqGrid('setCell',rowid,"otCompens",defaultOTCompens);
					if(otCompensIds){
						var otCompensIdsStr = otCompensIds.replace(/(,)/g, "','")
						that.filter[rowid]="BaseInfo.id in ('"+otCompensIdsStr+"')";
					}
					
					//$("#"+rowid+"_otCompens").shrPromptBox("setFilter","BaseInfo.id in ('"+otCompensIds+"')");
				}			
//				
			}
			});
		
		
		
		/*
		that.remoteCall({
			type:"post",
			method:"getdefautAndOtOTCompens",
			async: false,
			success:function(res){
					var info =  res;
					var defaultcompens = info.defaultcompens;
					var overTimeCompens = info.overTimeCompens;
					var defaultJson = {id:defaultcompens.id , name:defaultcompens.name} ;
					var overTimeJson = {id:overTimeCompens.id , name:overTimeCompens.name} ;
					//  如果不是 工作日加班  则是要默认的补偿方式
					//  如果是工作日加班  则是看有没有加班费
					//$("#entries").jqGrid('setCell',rowid,"otCompens",'', 'editable-cell');
					if(otTypeId == "sRWUOt7sRpOY0TCo6NMqGY6C/nU="){ // 
						if(overTimeCompens!=null && overTimeCompens!=undefined){
							$("#entries").jqGrid('setCell',rowid,"otCompens",overTimeJson);
							//$("#entries").jqGrid('setCell',rowid,"otCompens",'', 'not-editable-cell');
						}else{ 
							$("#entries").jqGrid('setCell',rowid,"otCompens",defaultJson);
						}
					}else{
						//$("#entries tr[id='"+rowid+"'] td[aria-describedby='entries_otCompens']").removeClass('not-editable-cell');
						$("#entries").jqGrid('setCell',rowid,"otCompens",defaultJson);
							//$("#entries").jqGrid('setCell',rowid,"otCompens",'', 'not-editable-cell');	
					}
				}
			});*/
		
		/*
		if(otTypeId == "sRWUOt7sRpOY0TCo6NMqGY6C/nU="){
			$("#entries").jqGrid('setCell',rowid,"otCompens",otCompensObejct);
			$("#entries").jqGrid('setCell',rowid,"otCompens",'', 'not-editable-cell');
		}else{
			$("#entries tr[id='"+rowid+"'] td[aria-describedby='entries_otCompens']").removeClass('not-editable-cell');
		}
		*/
	}
	,changeOverTimeType:function(rowid){
		var that=this;
    	var otDate ;
    	var personId ;
    	if(!$("#entries").jqGrid('getCell',rowid,"otDate")){
			return;
		}else{
			otDate = $("#entries").jqGrid('getCell',rowid,"otDate");
		}
		
		if(!$("#entries").jqGrid('getCell',rowid,"person")){
			return;
		}else{
			personId = $("#entries").jqGrid('getCell',rowid,"person").id;
		}
    	that.getOverTimeType(rowid,otDate,personId);
    	
			
	}
	,getOverTimeType:function(rowid,otDate,personId){
		var _self = this;
		var tDate=otDate;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.TeamAtsOverTimeBillEditHandler&method=getOverTimeTypeAndOtCompens";
		url += '&otDate=' + encodeURIComponent(otDate) + '&personId=' + encodeURIComponent(personId);
		$.ajax({
			url: url, 
			async:false, 
			success: function(response){
				if(response.otTypeValue!=null && response.otTypeValue !=undefined && response.otTypeValue!=''){
					var responseObejct = {id:response.otTypeValue,name:response.otTypeText }
					if (_self.isOtTypeEffective(response.otTypeValue)){
						// $('#entries').restoreCell(rowid,4); // 先恢复单元格状态再重新赋值，可以避免
						$("#entries").jqGrid('setCell',rowid,"otType",responseObejct);
						//设置该加班类型的补偿方式过滤
						var otCompensIds =  _self.getOTCompensByOTType(personId,response.otTypeValue,tDate);
						if(otCompensIds){
							var otCompensIdsStr = _self.getOTCompensByOTType(personId,response.otTypeValue,tDate).replace(/(,)/g, "','");
					    	_self.filter[rowid]="BaseInfo.id in ('"+otCompensIdsStr+"')";
						}
				    	
						var compens = response.compensInfo ;
						if(compens!=null){
							var defaultJson = {id:compens.id , name:compens.name} ;
							$("#entries").jqGrid('setCell',rowid,"otCompens",defaultJson);
							
						}
						
					}
					else {
						$("#entries").jqGrid('setCell',rowid,"otType",null);
					}
				}
			}  
			,error: function(response) {
			}
		});
	}
	
	//	判断加班补偿方式是否有效（存在且生效）
	,isOtTypeEffective : function (OtType) {
		var _self = this;
		var flag = true;
		_self.remoteCall({
			type:"post",
			method:"isOtTypeEffective",
			param:{
				OtType:OtType
			},
			async: false,
			success:function(res){
				var info =  res;
				if (info.resFlag == false){
					flag = false;
				}else {
					flag = true;
				}
			}
		});
		return flag;
	}
	/**
	 * 设置分录行的默认值。重写框架此方法
	 */
	,createNewEntryModel: function() {
		var that = this ; 
		/*
		var otCompens = that.getDefaultOTCompens();
		return {otCompens:otCompens};*/
		
	}
	//设置默认的加班补偿方式
	,getDefaultOTCompens : function () {
		var _self = this;
		var defaultOTCompens = {};
		//设置同步
		_self.remoteCall({
			type:"post",
			method:"getDefaultOTCompens",
			async: false,
			success:function(res){
				var info =  res;
				if (info.defaultId){
					defaultOTCompens = {id:info.defaultId,name:info.defaultName};
				}			
			}
			});
			return defaultOTCompens;
			
	}
	,setButtonVisible:function(){
		var billState = $("#billState").val();
		//alert(billState);
		if (billState) {
			if (billState==3 || 
					jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_22==billState ||
					billState ==4||
					jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_21==billState ||
					billState ==2||
					jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_23==billState ) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1==billState ||
					jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_26== billState ||
					2 == billState || 
					jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_23==billState ) { //未审批或审批中
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
		//如果是工作流打回,界面上的"取消"不显示
		if (this.isFromWF()) {
			$("#cancelAll").hide(); 
		}
	}
	,setImportSelfParam : function(){
		var billId = $('#id').val();
		return $("#entries").getGridParam("reccount")+"&"+$('#id').val();
	},getOTContrlParams:function(rowid)
	{   
		var personId;
		if(!$("#entries").jqGrid('getCell',rowid,"person")){
			return;
		}else{
			personId = $("#entries").jqGrid('getCell',rowid,"person").id;
		}
		var otDate;
		if(!$("#entries").jqGrid('getCell',rowid,"otDate")){
			return;
		}else{
			otDate =  $("#entries").jqGrid('getCell',rowid,"otDate");
		}
	    var that=this;

		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=getOTContrlParam';
		shr.ajax({
			type:"post",
			async:false,
			url:url,
			data:{personId:personId,otDate:otDate},
			success:function(res){
				if(res)
				{    
					that.OTContrlParams[rowid] = res;
//					isOTControl=res.isOTControl;
//					isOtrolByDateType=res.isOtrolByDateType;
					
				}
			}
			});
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
	,validateIsFillOtVerify:function(){
		var that = this;
		var boo = true;
		if(that.isFromWF()) 
		{
			var model = that.getCurrentModel(); 
			that.remoteCall({
			    method:"validateIsFillOt",
			    param:{model:model},
				async: false,
			    success:function(res){
					info =  res;
					if(res.errorString){
						  shr.showError({message:res.errorString});
						  boo = false;
					}
			    }
			}); 
			
		}
		return boo;
	}
	/**
	 * 工作流和其他页面统一校验入口,最好后续把校验都放在一起,方便维护.
	 * @return {}
	 */
	,verifyCheck:function(){
		var that = this;
		var boo = true;
		if(that.isFromWF()) //暂时只处理流程提交，后续可放开把所有检验统一入口
		{
			var model = that.getCurrentModel(); 
			that.remoteCall({
			    method:"verifyCheck",
			    param:{model:model},
				async: false,
			    success:function(res){
					info =  res;
					if(res.errorString){
						  shr.showError({message:res.errorString});
						  boo = false;
					}
			    }
			}); 
			
		}
		return boo;
	}
	,beforeWFValidStoreCellValue :function() {
		var _self = this;
		
		if(this.rowid && this.cellname && this.iRow && this.iCol)
		{
			$("#entries").jqGrid("saveCell",this.rowid,this.iCol);
			//_self.afterSaveCellTrigger(this.rowid, this.cellname, this.value, this.iRow , this.iCol) ;
		}
	}
	,checkattencePolicyParm:function(rownum){
		var that = this;
		var errorString = "";
		
		var model = that.getCurrentModel(); 
		if(model.entries[0] && model.entries[0].person){
			delete model.entries[0].person["person.gender"];
			delete model.entries[0].person["personOtherInfo.age"];
		}
		that.remoteCall({
		    method:"checkattencePolicyParm",
		    param:{model:model},
			async: false,
		    success:function(res){
				errorString = res.errorString;
		    }
		}); 
			
		
		return errorString;
	},
	validateOTEntry: function(rownum){
		var that = this;
		var errorString = "";
		
		var model = that.getCurrentModel(); 
		if(model.entries[0] && model.entries[0].person){
			delete model.entries[0].person["person.gender"];
			delete model.entries[0].person["personOtherInfo.age"];
		}
		
//		openLoader();
		that.remoteCall({
		    method:"validateOTEntry",
		    param:{model:model},
			async: false,
		    success:function(res){
				errorString = res.errorMSg;
		    }
		}); 
		
		return errorString;
	},
	openLoader: function (type, tip) {
		if(!type)  type = 1;
		$("#loaderTip").text(tip ? tip : jsBizMultLan.atsManager_atsOverTimeBillBatchEdit_i18n_12);
		$("#loader").css("display", "block");
	}
});

function NewDate(str) { 
	str = str.split(" ");
	var day = str[0].split("-");
	var hours = str[1].split(":");
	var date = new Date(); 
	date.setUTCFullYear(day[0], day[1] - 1, day[2]); 
	date.setUTCHours(hours[0], hours[1], hours[2], hours[3]); 
	return date; 
} 

/**
 * 创建日期时间
 */
function NewLongDate(str) { 
	str = str.split(" ");
	var day = str[0].split("-");
	var hours = str[1].split(":");
	var date = new Date(day[0],day[1] - 1,day[2],hours[0],hours[1],hours[2]); 
	return date; 
} 
/**
 * 创建日期
 * 支持IE的创建方式
 */
function NewShortDate(str) { 
	str = str.split(" ");
	var day = str[0].split("-");
	var date = new Date(day[0], day[1] - 1, day[2]); 
	return date; 
} 