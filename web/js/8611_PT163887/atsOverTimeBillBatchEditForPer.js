var _rowMap ;
var isOTControl=false;
var isOtrolByDateType=false;
var fixedNum;
shr.defineClass("shr.ats.atsOverTimeBillBatchEditForPer", shr.framework.Edit, {
	OTContrlParams:{},
	filter:{},
	rowid : "" ,
    cellname : "" ,
    value : "" ,
    iRow : "" ,
	iCol : "" ,

	initalizeDOM:function(){
		shr.ats.atsOverTimeBillBatchEditForPer.superClass.initalizeDOM.call(this);
		var that = this ;

		that.remoteCall({
        	type:"post",
        	method:"getDecimalPlace",
        	handler:"com.kingdee.shr.ats.web.handler.AtsBillBaseEditHandler",
        	success:function(res){
        	    fixedNum =  res;
        	}
        });

	    that.setNavigateLine();
//		that.getOTContrlParams();
		var classfullNameService = "com.kingdee.shr.ats.web.formEditImport.AtsOverTimeBillFileEditFormService";
		
		var entries_cont=waf("#entries");
		entries_cont.jqGrid("option", {
			  
			  beforeSaveCell:function (rowid, cellname, value, iRow, iCol) {
			  	
			  }
			  ,afterSaveCell:function (rowid, cellname, value, iRow, iCol) {
				  if(value["adminOrgUnit.id"]){
						$("#entries").jqGrid('setCell',rowid,"adminOrgUnit.id",value["adminOrgUnit.id"]);
					 }
				_self.afterSaveCellTrigger(rowid, cellname, value, iRow, iCol);				 
			  		
			  }
			  ,afterEditCell:function (rowid, cellname, value, iRow, iCol) 
			  {
			  	that.getOTContrlParams(rowid);
			    if(cellname=="otType" && that.OTContrlParams[rowid].isOtrolByDateType){
					$("#"+iRow+"_otType").shrPromptBox("disable");
				}
				//因为需求只是提了第一个时间时改变业务组织
				$("#1_otDate").change(function(){
				 that.changeOverHrOrgUnit();
				});
				if(cellname=="otCompens"){
					
					if(that.filter[rowid]==undefined){
			    		that.changeOTCompens(rowid);
			    	}
			    	if(that.filter[rowid]){
//						$("#"+rowid+"_otCompens").shrPromptBox("setFilter",that.filter[rowid]);
			    		$("#"+$("#entries").jqGrid('getCell',rowid,"rn")+"_otCompens").shrPromptBox("setFilter",that.filter[rowid]);
			    	}
				}
				_self.saveEditCellValue(rowid,cellname, value,iRow,iCol) ;
			  }
		});
		
		that.setButtonVisible(); //初始化页面安装状态,如果是已经提交的或者审批通过的单据编辑按钮不显示
		//隐藏提交生效按钮
		if (that.getOperateState() == 'EDIT') {			
			if(that.isFromWF()){ // 来自流程中心
				$("#submit").text(jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_20);
			}
		}
				
		//审核编辑界面
		if(that.isFromWF() && that.getOperateState() == 'EDIT'  && $("#billState").val() != 0)
		{
			$('#deleteRow_entries').unbind("click").attr("onclick","").css("cursor","default");
			$('#addRow_entries').unbind("click").attr("onclick","").css("cursor","default");
			$(".editGrid-toolbar").hide();
			$("#submit").show();
			var lastRowNum = $('#entries').getGridParam("reccount");
			for (var i = 1;i<= lastRowNum;i++) {
				var temp_id = $("#entries tr:eq("+ i +")").attr("id");
				$("#entries").jqGrid('setCell',temp_id,'person','','not-editable-cell');
			}	
		}
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
                    // handler: "com.kingdee.shr.ats.web.handler.team.F7.TeamPersonForEmpOrgF7ListHandler",
                    personId: person.id
                });
            }
        }
	}
	,afterSaveCellTrigger: function(rowid, cellname, value, iRow, iCol)
	{	
		var that = this ;
		var entries_cont=waf("#entries");
		that.removePreShowError(rowid);
		if(cellname=="otDate"){
			that.changeOverTimeType(rowid);
			that.calRestTimeLen(rowid);
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
            var restStartTimeOfDate;
            var restEndTimeOfDate;
            if (restStartTime!="" && restEndTime!=""){
                restStartTimeOfDate = new Date(restStartTime);
                restEndTimeOfDate = new Date(restEndTime);
                var times =restEndTimeOfDate.getTime()-restStartTimeOfDate.getTime();
                if (times<0){
                    times=0;
                }
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
                    times=times/1000/60;
                    totalRestTime+=times;
                }

            }
            var  t1 = totalRestTime.toFixed(atsMlUtile.getSysDecimalPlace());
            $("#entries").jqGrid('setCell',rowid,"restTime",t1) ;
            var startTime =new Date(startTime+":00");
            var endTime =new Date(endTime+":00");
            var se = endTime.getTime()-startTime.getTime() -totalRestTime; // 毫秒
            var tfl = se/(3600*1000) ;
            $("#entries").jqGrid('setCell',rowid,"applyOTTime",tfl) ;
            that.calculateOTtimes(rowid);
            that.getOTContrlParams(rowid);
        }
	}
	
	//新增 jqgrid 行 方法， 复写
	,addRowAction: function(event) {
		//增加自己的逻辑
	    var that = this ; 
	    
	    var num = $("#entries").jqGrid("getRowData").length ;
	  	if(num>=100){
	  	    shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_6});
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
		
		//设置不可 编辑 姓名
		var lastRowNum = $('#entries').getGridParam("reccount");
		var temp_id = $("#entries tr:eq("+ lastRowNum +")").attr("id");
		$("#entries").editCell(lastRowNum, 11, true);
		$("#entries").jqGrid('setCell',temp_id,'person','','not-editable-cell');
		
	},
	changeOverHrOrgUnit : function(){
		var that = this;
		var overStartTime = atsMlUtile.getFieldOriginalValue("1_otDate");
		if ( overStartTime!=""&&overStartTime!=null ) {
		overStartTime = overStartTime.replace("\\-","/");
		var personId = $("#proposer_el").val();
		that.remoteCall({
			type:"post",
			async: false,
			method:"getHrOrgUnit",
			param:{personId:personId,beginTime:overStartTime},
			success:function(res){
				info =  res;
				if(res.hrOrgUnitname && res.hrOrgUnitId){
				$("#hrOrgUnit").val(res.hrOrgUnitname);
				$("#hrOrgUnit_el").val(res.hrOrgUnitId);
				}
				
			}
		});
		}
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

	,submitAction: function(event) {
		var _self = this,
			workArea = _self.getWorkarea(),
			$form = $('form', workArea);
		if(!_self.validate()){
			return ;
		}
			
		if ($form.valid() && _self.verify()) {
			shr.showConfirm(jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_14, function() {
				_self.doSubmit(event, 'submit');
			});
		}		
	}
	,goNextPage: function(source) {
		// 普通提交，返回上一页面
		_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsOverTimeBillList"
		});
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
				_self.back();
			}
		});	
	}
	
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
				title: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_4,
				resizable: true,
				position: ['top','top'],
				modal: true,
				open: function(event, ui) {
					if ($.browser.msie) {
						var url = shr.assembleURL('hr.ats.com.atttendanceCommonImport', 'view', {
							lastUipk: lastUipk,
							viewModel: viewModel ,
							className : className
							//classify:classify
						});
						var content = '<iframe id="importFrame" name="importFrame" width="700" height="600" frameborder="0" scrolling="no" allowtransparency="true" src="' + url + '"></iframe>';
						importDiv.append(content);
					} else {
						
						var url = shr.assembleURL('hr.ats.com.atttendanceCommonImport$page', 'view');
						shr.loadHTML({
							url: url,
							success: function(response) {
								importDiv.append(response);
							}
						});
					}
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
						_self.calRestTimeLen(value);
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
	
	,verify:function(){
		var _self = this ;
		var obj = $("#entries").jqGrid("getRowData");
		var errorString = "";
		var errorFlag = 0 ;
		if(obj.length == 0){
			shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_7});
			return false;
		}
		
		if(!_self.checkRowIsOver()){
			return false;
		}
		
		_rowMap = {} ;
		
		jQuery(obj).each(function(n){
		    	errorString = _self.checkEveryRow(n + 1 , this);
		   		if(errorString){
		   			_self.preShowError( n + 1 ,this.person.name + " " + errorString);
		   			errorFlag = 1 ;
		   		}
			
		 });	
		 if(!_self.verifyCheck()){
		 	return false;
		 }
		 
		 if(errorFlag == 0){
			 //工作流审批界面，加班补提控制。
		    var boo = true;
		    boo = _self.validateIsFillOtVerify();
   			return boo;
		 }else{
			return false;
		 }
	}
	,checkEveryRow : function(rownum,value){
			var that = this ;
			var regEx = new RegExp("\\-","gi"); //i不区分大小写 g匹配所有
			
		 	var startTime = value.startTime ;
			var endTime = value.endTime ;
			//这样写IE才支持。
			var startTimeOfDate =  NewLongDate(startTime + ":00"); 
		 	var endTimeOfDate = NewLongDate(endTime + ":00"); 
		 	
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
	 	
		 	
			if ( overTimeStartDate.getTime() <overTimeDate.getTime()-24*60*60*1000  ) {
				return jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_2;
		 	}
		 	if ( overTimeEndDate.getTime()-24*60*60*1000  > overTimeDate.getTime() ) {
		 		return jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_2;
		 	}
		 	if (longTime <= 0) {
		 		return jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_9;
		 	}
		 	
		 	
		 	// 检查jqgrid 表格里的是否有重复数据
		 	var rowValue = new Array();
				rowValue[0] = value.person.id;
				rowValue[1] = value.startTime;
				rowValue[2] = value.endTime;
		 		_rowMap[rownum] = rowValue;
		 	for(var prop in _rowMap){
 			   if(_rowMap.hasOwnProperty(prop)){
 			   	    var beginTimeTempStr = _rowMap[prop][1];
 			   	    var endTimeTempStr = _rowMap[prop][2];
 			   		var beginTimeTemp = NewLongDate(beginTimeTempStr);
 			   		var endTimeTemp = NewLongDate(endTimeTempStr);
 			   		if(prop!=rownum&&_rowMap[prop][0]==value.person.id&&!(beginTimeTemp.getTime()>=endTimeOfDate.getTime()||endTimeTemp.getTime()<=startTimeOfDate.getTime())){
 			   			return shr.formatMsg(jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_3, [prop]);
 			   		
 			   		}
    			}
			}
        var msg =this.verifyRestTime(true,value);
        if (msg!=""){
            return msg;
        }
		 	var isExistFile = that.isExistAttendanceFile(value.person.id);
		 	if(isExistFile == false){
		 	   return jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_5;
		 	}
		 	//设置同步
		 	var info ;
		 	that.remoteCall({
				type:"post",
				method:"isWorkTime",
				async: false,
				param:{personId: value.person.id,overDate:value.otDate,overTimeBegin:value.startTime+":00",overTimeEnd:value.endTime+":00"},
				success:function(res){
					   info = res;
				}
			});
		 	
			if (info.isWorkTime){
//				shr.showWarning({message:"加班开始结束时间和上班时间有交叉。"});
				return jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_8;
			}	
			var applyOTTime = value.applyOTTime;
		 	//判断申请加班小时数是否达到加班起始值
			var validOtStartString;
		 	that.remoteCall({
				type:"post",
				method:"validOtStart",
				async: false,
				param:{personId: value.person.id,applyOTTime:applyOTTime},
				success:function(res){
					   var validInfo = res.info;
					   if(validInfo!=null　&& validInfo!=""){
						   validOtStartString=validInfo;
					   }
				}
			});
	 	    if(validOtStartString!=null　&& validOtStartString!=""){
	 	    	return validOtStartString;
	 	    }
			//是否在“固定加班”时间段或者“固定加班不计异常”时间段内
			var obj;
		 	that.remoteCall({
				type:"post",
				method:"isAtFixedOverTimeOrExcep",
				async: false,
				param:{personId: value.person.id,overDate:value.otDate,overTimeBegin:value.startTime+":00",overTimeEnd:value.endTime+":00"},
				success:function(res){
					obj = res;
				}
			});
		 	
			if (obj.isAtFixedOverTimeOrExcep){
				return jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_1;
			}	
			
		 	var errorString = that.validateIsExistBill(value.person.id,startTime,endTime,$('#id').val());
	   		if(errorString){
	   			/*shr.showInfo({message: "加班开始时间必须小于加班结束时间。"});
				return false;*/
	   			return errorString;
	   		}
   			if(value.otCompens.id =="AERg0TIcSnaM40EKvJCdRKlrTmA="){ // 只有等于调休的时候才校验
   				var errorString = that.validateIsValidateLimit(value.person.id,value.otDate,value.applyOTTime,otType);
   				if(errorString){
   					return errorString;
   				}
   			}
			
		 	return "" ;
	
	}// 调休额度是否正确 ；
	,validateIsValidateLimit : function(personId,otDate,currentValue,otType){
		var that = this;
			var info;
			var infoLeaveBillNumber;
			otDate =otDate.substring(0,10);
			var errorString = "";
		 		that.remoteCall({
				type:"post",
				async: false,
				method:"isOverMaxQuota",
				param:{personId:personId,otDate:otDate,currentValue:currentValue,otType:otType},
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
		      errorString = shr.formatMsg(jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_23,
				  [info.overTimeNum, info.personName, info.beginTime, info.endTime]);
			  return errorString;
		    }  
	},
	// 获取表格序号列，修复平台表格序号列位置移动导致的提示列位置错误导致的显示异常bug
	getColNumIndex: function(){
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
		var rnColNum=this.getColNumIndex();
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
		var rnColNum=this.getColNumIndex();
			var that = this;
			$("#entries").find('tr').eq(iRow).find('td').eq("+rnColNum+").text("？").css("color","red").attr({"data-toggle":"tooltip","data-placement":"left","title":errorString});
			
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
			var applyOTTime = window.frames["orgFillDiv"].atsMlUtile.getFieldOriginalValue("applyOTTime") ;
			
			var remark = $(window.frames["orgFillDiv"].document).find("#remark").val();
			var remain = $(window.frames["orgFillDiv"].document).find("#remain").text();
			var checkAmount = $(window.frames["orgFillDiv"].document).find("#checkAmount").text();
	
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
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_26});
	        		return false;
    		}
        	
        	//校验
        	if(!otDate){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_11});
	        		return false;
    		}
        	
    		if((!adminOrgUnit_el||!adminOrgUnit)&&(!person_el||!person)){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_25});
	        		return false;
    		}
    		
        	if(!startTime){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_13});
	        		return false;
    		}
    		
    		if(!otType_el||!otType){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_10});
	        		return false;
    		}
    		
    		if(!endTime){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_12});
	        		return false;
    		}
    		
    		if(!otCompens_el||!otCompens){
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_0});
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
	        		shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_15});
	        		return false;
    		}
	
    		return true;
	}
	
	,checkRowIsOver : function(){
		if( $("#entries").jqGrid("getRowData").length > 100){
			shr.showWarning({message: jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_6});
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
				that.preShowWarn( rowid , jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_19);
			}
			//$("#entries").jqGrid('setCell',rowid,"applyOTTime",tfl); 计算的值
		}
	
	}
	// if(cellname=="startTime" || cellname=="endTime" || cellname=="restTime"){
	,calRestTimeLen : function(rowid){
		var startTime = $("#entries").jqGrid('getCell',rowid,"startTime") ;
		var endTime = $("#entries").jqGrid('getCell',rowid,"endTime") ;
		if(startTime =="[object Object]"){
			$("#"+rowid).find('td').eq('5').text("");
			$("#"+rowid).find('td').eq('5').attr("title","");
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
                $("#entries").jqGrid('setCell',rowid,"restTime",resLen);
                $("#entries").jqGrid('setCell',rowid,"restStartTime",res.restStartTime);
                $("#entries").jqGrid('setCell',rowid,"restEndTime",res.restEndTime);
                $("#entries").jqGrid('setCell',rowid,"restStartTime2",res.restStartTime2);
                $("#entries").jqGrid('setCell',rowid,"restEndTime2",res.restEndTime2);
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
			var tfl = (se/(3600*1000)).toFixed(fixedNum) ;
			$("#entries").jqGrid('setCell',rowid,"applyOTTime",tfl);
		}
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
    	
    	
		/*// zkbt5bMLQ3ehUivmKbtBOqlrTmA=  加班费 
		var otCompensObejct = {id:"zkbt5bMLQ3ehUivmKbtBOqlrTmA=",name:"加班费"};
		//等于法定节假日 id   sRWUOt7sRpOY0TCo6NMqGY6C/nU=
*/		
		var otCompensIds = that.getOTCompensByOTType(personId,otTypeId);

		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsOverTimeBillEditHandler';
		that.remoteCall({
			type:"post",
			method:"getDefaultOTCompens",
			url:url,
			param:{personId:personId,otTypeId:otTypeId},
			async: false,
			success:function(res){
				var info =  res;
				if (info.defaultId == "" || info.defaultId ==undefined ){
					shr.showWarning({message:jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_24});
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
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsOverTimeBillEditHandler&method=getOverTimeTypeAndOtCompens";
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
						var otCompensIds =  _self.getOTCompensByOTType(personId,response.otTypeValue);
						if(otCompensIds){
							var otCompensIdsStr = _self.getOTCompensByOTType(personId,response.otTypeValue).replace(/(,)/g, "','");
					    	_self.filter[rowid]="BaseInfo.id in ('"+otCompensIdsStr+"')";
						}
						
						var compens = response.compensInfo ;
						var defaultJson = {id:compens.id , name:compens.name} ;
						$("#entries").jqGrid('setCell',rowid,"otCompens",defaultJson);
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
	 * 将mode生成加班原因state属性去掉，控件生成的不对，生成了一串html。保存时json会解析不通过。
	 */
	,assembleModel : function(){
	
		var assModel = shr.ats.atsOverTimeBillBatchEditForPer.superClass.assembleModel.call(this);
		var personDateStr = '';
		var length = assModel.entries.length ;
		for( var i = 0 ; i < length ; i++)
		{
			if(assModel.entries[i].otReason && assModel.entries[i].otReason.state){
				 delete assModel.entries[i].otReason.state;
			}
			if(assModel.entries[i].otType && assModel.entries[i].otType.state){
				 delete assModel.entries[i].otType.state;
			}
			if(assModel.entries[i].otCompens && assModel.entries[i].otCompens.state){
				 delete assModel.entries[i].otCompens.state;
			}
			//组装参数
			var personId = assModel.entries[i].person.id;
			var date = assModel.entries[i].otDate;
			if(date && personId){
				if(i > 0){
					personDateStr +=",";
				}
				personDateStr += personId +"_"+date.substring(0,10);
			}
		}
		
		//审核编辑界面重新点击出差类型 josn 转换出错
		if(this.isFromWF())
		{
		  var lastRowNum = $('#entries').getGridParam("reccount");
		     
		    for(var i = 0; i < lastRowNum; i++ )
		    {
		       delete  assModel.entries[i].otType.state 
			   delete  assModel.entries[i].otCompens.state 
			   delete  assModel.entries[i].otReason.state 
		    }
		}
		
		if(personDateStr){
			_self.remoteCall({
				type:"post",
				method:"getPersonAdminOrgUnit",
				handler:"com.kingdee.shr.ats.web.handler.AtsBillBaseEditHandler",
				param:{ personDateStr:personDateStr},
				async: false,
				success:function(res){
					var info =  res;
					var personAtsInfo = {};
					for (var i = 0; i < length; i++) {
						var personId = assModel.entries[i].person.id;
						var date = assModel.entries[i].otDate;
						if(date && personId){
							var person_date = personId +"_"+date.substring(0,10);
							personAtsInfo = res[person_date];
							if(personAtsInfo && personAtsInfo.adminOrgUnit){
								assModel.entries[i]["adminOrgUnit"]= personAtsInfo.adminOrgUnit;
								assModel.entries[i]["position"]= personAtsInfo.position;
							}
						}
					}
				}
			});
		}
        assModel.ccPerson = assModel.ccPersonIds;
		return assModel;
		
	}
	/**
	 * 设置分录行的默认值。重写框架此方法
	 */
	,createNewEntryModel: function() {
		var that = this ; 
		var otCompens = that.getDefaultOTCompens();
		var defalutPerson = {id:$('#proposer_el').attr('value'),name:$('#proposer').attr('title')};
		return {person:defalutPerson,otCompens:otCompens};
		
		//
		
	}
	//设置默认的加班补偿方式
	,getDefaultOTCompens : function () {
		var _self = this;
		var defaultOTCompens = {};
		//设置同步
		_self.remoteCall({
			type:"post",
			method:"getDefaultOTCompens",
			param:{
				personId : $('#proposer_el').attr('value')
			},
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
					jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_17==billState ||
					billState ==4||
					jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_16==billState ||
					billState ==2||
					jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_18==billState ) {
				$("#edit").hide();
				$("#submit").hide();
			} else if (1==billState ||
					jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_21== billState ||
					2 == billState ||
					jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_18==billState ) { //未审批或审批中
				if(!this.isFromWF()){
					$("#edit").hide();
					$("#submit").hide();
				}
			}
		}

		//新增和编辑状态隐藏返回XX列表
		if (this.getOperateState().toUpperCase() == 'ADDNEW' || this.getOperateState().toUpperCase() == 'EDIT' ) {
			$("#returnToOverTimeBillList").hide();
		}
		//如果是工作流打回,界面上的"返回XX列表"不显示
		if (this.isFromWF()) {
			$("#returnToOverTimeBillList").hide(); 
			$("#cancel").hide();  
		}
		
		if (this.getOperateState().toUpperCase() == 'EDIT'){
			var lastRowNum = $('#entries').getGridParam("reccount");
			for (var i = 1;i<= lastRowNum;i++) {
				var temp_id = $("#entries tr:eq("+ i +")").attr("id");
				$("#entries").jqGrid('setCell',temp_id,'person','','not-editable-cell');
			
			}	
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
	,returnToOverTimeBillListAction:function(){
	   this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsOverTimeBillList'
		});
	}
	
	,cancelAction:function(){
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsOverTimeBillList'
		});
	},
    verifyRestTime: function( beforeSubmit,value){
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
        }
        if( (restStartTime2!="" && restStartTime2!=undefined && (restEndTime2==""||restEndTime2==undefined))
            || (restEndTime2!="" && restEndTime2!=undefined && (restStartTime2==""||restStartTime2==undefined))
        )
        {
            if (beforeSubmit) {
                return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_7;
            }
        }
        if (restStartTime != "" && restStartTime != undefined && restStartTime2 != "" && restStartTime2 != undefined) {
            //两个加班休息时间都填了，那么判断不能交叉
            if((restStartTimeOfDate.getTime()<restEndTimeOfDateOfDate2.getTime() && restStartTimeOfDate.getTime()>=restStartTimeOfDate2.getTime())
                ||(restStartTimeOfDate2.getTime()<restEndTimeOfDateOfDate.getTime() && restStartTimeOfDate2.getTime()>=restStartTimeOfDate.getTime())
            ){
                return jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_0;
            }
        }

    },
	setNavigateLine: function(){
	  	var fromFlag = localStorage.getItem("fromFlag");
	   	var empolyeeBoardFlag =	sessionStorage.getItem("empolyeeBoardFlag");
	   	var parentUipk = "";
		if(parent.window.shr==null){
     		parentUipk = shr.getCurrentViewPage().uipk;
     	}else{
     		parentUipk = parent.window.shr.getCurrentViewPage().uipk;
     	}
		if(fromFlag == "employeeBoard"){//来自我的考勤的时候。将导航条删除掉。
	      $("#breadcrumb").parent().parent().remove();
	      localStorage.removeItem("fromFlag");
	    }
	    if(("empolyeeBoardFlag" == empolyeeBoardFlag && "com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop" == parentUipk)){
	        $("#breadcrumb").remove();
	        window.parent.changeDialogTitle(jsBizMultLan.atsManager_atsOverTimeBillBatchEditForPer_i18n_22);
	    }
	},
	/**
	 * 是否存在考勤档案
	 */
	isExistAttendanceFile: function(personId){
		var isExistsFile = true;
	   	_self.remoteCall({
			type:"post",
			method:"isExistsAttanceFile",
			async: false,
			param:{personId: personId},
			success:function(res){
				var info =  res;
				if (!info.isExistsFile){
					isExistsFile = false;
				}	
			}
		});
		if(!isExistsFile){
		   return false;
		}
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
	,getCurrentModel : function(){
		
		var that = this ;
		var model = shr.ats.atsOverTimeBillBatchEditForPer.superClass.getCurrentModel.call(this);
		var len = model.entries.length ;
		for(var i = 0; i < len; i++)
		{
		  model.entries[i].realStartTime =  model.entries[i].startTime ;
		  model.entries[i].realEndTime =  model.entries[i].endTime ;
		  model.entries[i].realOttime =  model.entries[i].applyOTtime ;
		  
		  delete  model.entries[i].otType.state ;
		  delete  model.entries[i].otCompens.state ;
		  delete  model.entries[i].otReason.state ;
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
	//获取当前加班类型的加班补偿方式
	,getOTCompensByOTType : function ( personId, otTypeId) {
		var _self = this;
		
		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsOverTimeBillEditHandler';
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
});

//初始化时间，解决date在IE9+环境下的兼容性问题,年月日分隔符为-，时分秒分隔符是：，

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
