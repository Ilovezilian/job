/*	var  excelDiv=''
			+ '<div class="photoCtrlBox">'
			+'<div class="photoState">1、上传文件不能修改模板文件的格式</div>'
			+'<div class="photoState">2、支持上传文件格式为xls,xlsx的excel文件</div>' 
			+'<div class="photoState"></div>' 
			+'</div>';
               	
	var excelDesginDiv=''	
			 + '<div class="photoCtrlBox">'
			 +'<div style="margin-bottom: 10px;"><font size="3px" style="font-weight:bold;">请选择所需要的操作</font></div>'
			 + '<div class="photoCtrlRadio"><input type="radio" name="inAndout" value="引入" id="importRadio"  checked></div>'
			 + '<div class="photoCtrlUpload"><span>请选择上传excel文件</span></div>'
			 + '<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			 + '<div style="clear: both;"></div>'
			 + '</div>'
			 + '<div class="photoCtrlBox"><div id="exportBox"><div class="photoCtrlRadio"><input type="radio" name="inAndout" value="导出" id="exportRadio"></div><span>引出</span><span>打卡数据模板 </span></div>  <div style="clear: both;"></div></div>'
			 + '</div>';	
	var txtDesginDiv=''	
		 	+ '<div class="photoCtrlBox">'
			+ '<div><font size="3px" style="font-weight:bold;">请选择所需要的操作</font></div>'+
			 	'<div class="photoCtrlBox" style="margin-bottom: 0px;">' +
					'<div id="exportBox">' +
					'<span>选择导入方案 </span>' +
					'</div>' +
					'<div id="adminOrgBox">' +
					'<form id="123l23123" action="123l23123">' +
						'<input type="text" id="AtsImportPlan" name="AtsImportPlan" class="input-height">' +
					'</form>' +
					'</div>' +
					'<div style="clear: both;"></div>' +
				'</div>'
			+'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked></div>'
			+		'<div class="photoCtrlUpload"><span>请选择导入的文件</span></div>'
			+		'<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			+		'<div style="clear: both;"></div>'
		//	+	'</div>'
			+   '<input type="hidden" name="txtFileName" id="txtFileName">'
			+ 	'</div>';
			
	var txtDiv=''
		+'<div class="photoCtrlBox">'
		+'<div class="photoState">1、需提前建立打卡导入方案，在方案中配置源文件字段名与打卡记录的对应关系</div>'
		+'<div class="photoState">2、源文件中的各数据列需用Tab健分割</div>' ;
		+'<div class="photoState"></div>' ;
		+'</div>'
    var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.file.AtsPunchCardRecordFileHandler&method=uploadTxtData";
			url += "&" + getJSessionCookie();
*/
//所有下级组织ID
var allSubOrgIDs="";
var orgLongNum="";
shr.defineClass("shr.ats.team.TeamPunchCardRecordList", shr.framework.List, {
	 
	reportUipk : "com.kingdee.eas.hr.ats.app.PunchCardRecord.list", 
	isFirstTimeLoad: true,
	initalizeDOM : function () {
		this.processF7ChangeEvent();
		this.setDefaultQueryFilter();
		this.clearAdminOrgUnitVal();
		shr.ats.team.TeamPunchCardRecordList.superClass.initalizeDOM.call(this);
		$(".view_mainPage").append('<div id="operationDialog"><div id="calendar_info"></div></div>');
		
		//快速过滤展开
		if($(".filter-containers").is(":hidden")){
			$("#filter-slideToggle").click();
		}
	},
	/**
	 * 获得过滤条件
	 * 重写框架函数，挑换下顺序。customFilterItems在前，quickFilterItems在后。
	 */
//	getFilterItems: function() {
//		return this.mergeFilter(this.getCustomFilterItems(), this.getQuickFilterItems());
//	},
//	mergeFilter: function(filter1, filter2) {
//		var filterItems;
//		if (filter1 && filter1 != '') {
//			filterItems = filter1
//		}
//		if (filter2 && filter2 != '') {
//			if (filterItems) {
//				filterItems = filterItems + ' and (' + filter2 + ')';
//			} else {
//				filterItems = filter2
//			}
//		}
//		
//		if (!filterItems) {
//			filterItems = '';
//		}
//		
//		return filterItems;
//	},
//	//重写web框架的函数：获取自定义的过滤条件项
//	getCustomFilterItems: function() {
//	     
//		var that = this;
//		var array = new Array();
//		var filterStr = "";
//		var filterStr1;
//		var filterStr2;
//		var filterStr3;
//		var filterStr4;
//		var proposerName = $("#proposer").val();
//		var beginDate = $("#beginDate").val();
//		var endDate = $("#endDate").val();
//		//这里做特殊处理，只是为了获取longNum 
//		filterStr1 = orgLongNum.trim() + "@@";
//		array.push(filterStr1);
//		if (proposerName != "" && proposerName != null) {
//			filterStr2 = " proposer.name like '%"+proposerName.trim()+"%' "; 
//			array.push(filterStr2);
//
//		}
//		
//		if ( beginDate != "" && beginDate != null  ) {
//			beginDate=beginDate+" 00:00:00";
//			filterStr3 = " punchCardDate >= '"+beginDate+"' ";
// 			array.push(filterStr3);
//		}
//		if ( endDate != "" && endDate != null ) {
//			endDate=endDate+" 23:59:59" ;
//			filterStr4 = " punchCardDate <= '"+endDate+"' ";
// 			array.push(filterStr4);
//		}
//		for (var index = 0; index < array.length; index++) {
//			if (index == array.length-1) {
//				filterStr = filterStr + array[index]
//			}else{
//				filterStr = filterStr + array[index] + " and";
//			}
//		}
//
//		return filterStr;
//	},
//	//点击查询按钮执行的方法
//	queryAction:function(){
//		 var that = this;
//		 var filterStr=that.getCustomFilterItems();
//		 var quickFilterItems = that.getQuickFilterItems();
//		 if( quickFilterItems == undefined || quickFilterItems == "" || quickFilterItems == null)
//		 { 
//			quickFilterItems = "" ;
//		 }else{
//		    quickFilterItems = " and " + quickFilterItems;
//		 }
//		 $("#grid").jqGrid("option", "filterItems", filterStr + quickFilterItems).jqGrid("reloadGrid");	
//	},
	
	processF7ChangeEvent : function(){
		var that = this;
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   if(info!=null){
			   if(info.longNumber !=null && info.longNumber!=''){ 
			   		orgLongNum=info.longNumber;
			   }

			}
			}
		});

	
 	},
 	viewAction: function(billId) {
		
	},
	setDefaultQueryFilter:function()
	{   
	    //设置默认的查询时间
		var nowDate=new Date();
		var nowDateYear,nowDateMonth,nowDateDay,nowDateStr;
		nowDateYear=nowDate.getFullYear();
		nowDateMonth=nowDate.getMonth()+1;
		nowDateMonth=nowDateMonth>9?nowDateMonth:"0"+nowDateMonth;
		nowDateDay=nowDate.getDate()>9?nowDate.getDate():"0"+nowDate.getDate();
		nowDateStr=nowDateYear+"-"+nowDateMonth+"-"+nowDateDay;
		var lastWeekDateLong=nowDate.getTime()-7*24*3600*1000;
		var lastWeekDate=new Date(lastWeekDateLong);//@
		var lastWeekDateYear,lastWeekDateMonth,lastWeekDateDay,lastWeekDateStr;
		lastWeekDateYear=lastWeekDate.getFullYear();
		lastWeekDateMonth=lastWeekDate.getMonth()+1;
		lastWeekDateMonth=lastWeekDateMonth>9?lastWeekDateMonth:"0"+lastWeekDateMonth;
		lastWeekDateDay=lastWeekDate.getDate()>9?lastWeekDate.getDate():"0"+lastWeekDate.getDate();
		lastWeekDateStr=lastWeekDateYear+"-"+lastWeekDateMonth+"-"+lastWeekDateDay;
		atsMlUtile.setTransDateTimeValue("beginDate",lastWeekDateStr);
		atsMlUtile.setTransDateTimeValue("endDate",nowDateStr);
		
		//设置默认的查询组织 这边必须的用同步的请求，不然无法过滤。
		var serviceId = shr.getUrlRequestParam("serviceId");
	  	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=getDefaultOrg";
	  	url += '&serviceId='+encodeURIComponent(serviceId);
	   	shr.ajax({
			type:"post",
			async:false,
			url:url,
			success:function(res){
				var info = res;
				if(info!=null){
					var dataValue = {
						id : info.orgID,
						name : info.orgName,
						longNumber:info.longNumber
					};
					$('#adminOrgUnit').shrPromptBox("setValue", dataValue);
			
					}
			
			
		    }
		});
		
	},
	//导入打卡数据
	/*importPunchCardDataAction:function(){
		var _self = this;		
		var importPunchCardDataDiv = ''
			+ '<div id="photoCtrl">' 
			+	'<p>打卡数据导入说明</p>'
			+   '<div class="photoState"><table width="100%">'
			+   '<tr><td width="5%"><input type="radio" name="choiceAction" id="excelRadio" value="excel" checked="true"></td>' 
			+   '<td width="20%">EXCEL文件导入 </td>'
			+	'<td width="20%"></td>' 
			+	'<td width="5%"><input type="radio" name="choiceAction" value="txt" id="txtRadio"></td>' 
			+	'<td>TXT文件导入</td></tr></table></div>';
		importPunchCardDataDiv=importPunchCardDataDiv+excelDiv+excelDesginDiv;
	    //$('#photoCtrl').append(excelDiv); 
		$('#photoCtrl').remove();
		$(document.body).append(importPunchCardDataDiv);
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.file.AtsPunchCardRecordFileHandler&method=uploadTxtData";
			url += "&" + getJSessionCookie();
		var handleFlag = false;
		// 初始化上传按钮
		
		    swf: "jslib/uploadify/uploadify.swf", //new
		    //swf: "webviews/shr/dydeploy/scripts/uploadify.swf",//logan
		    uploader: url,
		    buttonText: "选择文件",
		    buttonClass: "shrbtn-primary shrbtn-upload",
		    fileTypeDesc: "txt文件",
		    fileTypeExts: "*.xls;*.xlsx", 
		    async: false,
		    multi: false,
		    removeCompleted: false,
		    onUploadStart: function(file) {
                  //$("#file_upload").uploadify("settings", "someOtherKey", 2);   
            },
			onUploadSuccess: function(file, data, response) 
			{
				handleFlag = true;
				$("#txtFileName").val(data); 
				$("#grid").jqGrid().jqGrid("reloadGrid"); 
			},
			onClearQueue:function(event){
		
			}
		});
		var chVal=$("input[name='choiceAction']:checked").val() ;
			$('#photoCtrl').dialog({
			title: '员工打卡数据导入',
		    width: 700,
			height: 480,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+20%',
				of: window
			},
		
			buttons : {
				"确认" : function () {
					
					var chVal=$("input[name='choiceAction']:checked").val() ;
					if(chVal=="excel"){
						if ($("input[name='inAndout']:checked").val()=="引入") {
							var fileName=$('#file_upload-queue').find('span[class="fileName"]').text();
							if(fileName.indexOf("txt")!= -1){
									shr.showError({
									message : "导入的文件类型不正确！"
									});
							}else if(fileName==""){
									shr.showError({
									message : "未选择导入的文件！"
									});
							}else if(fileName.indexOf("xls")!= -1 ||fileName.indexOf("xlsx")!= -1){
									_self.importFileData();
							}
						}else if($("input[name='inAndout']:checked").val()=="导出") {
									_self.exportPunchCardRecordTemplateAction();
							}
					} else{
					
					if($('#importRadio').shrRadio('isSelected')){
		        			_self.importTxtFileData();
					    }
					}
				},
				"取消" : function () {
					$(this).dialog("close");
					$('#photoCtrl').remove();
				}
			}
			
		});
		_self.changButton() ;
	} ,
	
	changButton:function(){
	
		var that=this;  
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.file.AtsPunchCardRecordFileHandler&method=uploadTxtData";
			url += "&" + getJSessionCookie();
     	$('input[name=choiceAction]').change(function(){
		var chVal=$("input[name='choiceAction']:checked").val() ;
		if($("input[name='choiceAction']:checked").val() =='excel'){ //execel 导入
			$('.photoCtrlBox').remove();
			$('#photoCtrl').append(excelDiv);
			$('#photoCtrl').append(excelDesginDiv);
			
			    swf: "jslib/uploadify/uploadify.swf",
			    uploader: url,
			    buttonText: "选择文件",
			    buttonClass: "shrbtn-primary shrbtn-upload",
			    fileTypeDesc: "txt文件",
			    fileTypeExts: "*.xls;*.xlsx",
			    async: false,
			    multi: false,
		
			    onUploadStart: function(file) {
				}, 
				onUploadSuccess: function(file, data, response) {
					handleFlag = true;
					$("#txtFileName").val(data);
					$("#grid").jqGrid().jqGrid("reloadGrid");
				},
				onClearQueue:function(event){
			
				},
				onCheck : function(file, exists) {
        		    if (exists) {
          			      alert('The file ' + file.name + ' exists on the server.');
      			      }
      			  }
			});
		}else{
		    $('.photoCtrlBox').remove();
			$('#photoCtrl').append(txtDiv);
			$('#photoCtrl').append(txtDesginDiv);
			$('#importRadio, #exportRadio').shrRadio();		
			var grid_f7_json = {id:"AtsImportPlan",name:"AtsImportPlan"};
			grid_f7_json.subWidgetName = 'shrPromptGrid';
			grid_f7_json.subWidgetOptions = {title:"选择一个导入方案",uipk:"com.kingdee.eas.hr.ats.app.AtsImportPlan.F7",query:""};
			$('#AtsImportPlan').shrPromptBox(grid_f7_json);
			$('#123l23123').shrForm({id:"123l23123"});//包裹一个form, 为了提供validate功能
			$('#AtsImportPlan').shrPromptBox('addRules', {required:true});  
			
			
			    swf: "jslib/uploadify/uploadify.swf",
			    uploader: url,
			    buttonText: "选择文件",
			    buttonClass: "shrbtn-primary shrbtn-upload",
			    fileTypeDesc: "txt文件",
			    fileTypeExts: "*.txt",
			    async: false,
			    multi: false,
			    removeCompleted: false,
			    overrideEvents: ["onSelectError","onDialogClose"],
			    onUploadStart: function() {
				},
				onUploadSuccess: function(file, data, response) {
					handleFlag = true;
					$("#txtFileName").val(data);
					$("#grid").jqGrid().jqGrid("reloadGrid");
				},
				onUploadSuccess: function(file, data, response) {
					handleFlag = true;
					$("#txtFileName").val(data);   
					$("#grid").jqGrid().jqGrid("reloadGrid"); 
				}, 
				 onSelectError: function(file,errorCode,errorMsg){
						if(file.size==0){
						    shr.showError({message: '选择的'+file.name+'为空！'});
						} 
						return false;
	             },
	             onSelect:function(){
	             },
	           	onClearQueue:function(event){
					
				}
			  });
			}	// end  else
        });  	
	} ,
	
	importTxtFileData: function(){
		//alert("读取服务器目录文件 解析");
		
		var that=this;
		var atsImportPlan = $('#AtsImportPlan').shrPromptBox('getValue');
		
		if ( atsImportPlan == null) {
			shr.showInfo({message: '请选择数据导入方案！'}); 
			return false;
		}
		var txtFileName = $("#txtFileName").val();
		
		//shr.getContextPath()+ "/atsPunchCardRecord.do?method=importTxtData",
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.file.AtsPunchCardRecordFileHandler&method=importTxtData";
		//url += "&calSchemeId=" + encodeURIComponent($cmpschemeid);
		
		$.ajax({
			url: url,
			data: {
				importPlanId:atsImportPlan.id, 
				txtFileName: txtFileName
			},
			beforeSend: function(){
				openLoader(1);
			},
			success: function(msg){
				closeLoader();
				var tip="";
				if (msg.data.planErroFlag) {//导入方案出错： 导入方案不存在对应的列名、数据文件第一行不是列名行（例如空行）
					tip=msg.data.errorMsg;
				} else {
					//alert(JSON.stringify(msg));
					tip ="打卡数据导入完毕<br/>";
					tip = tip +  "导入的文件中共" + msg.data.count + "条记录<br/>" ;
					tip = tip +  "导入成功" + msg.data.successRecord + "条<br/>" ;
					tip = tip +  "导入失败" + (msg.data.count - (msg.data.successRecord)) + "条<br/>" ;
					
					if (msg.data.count != msg.data.successRecord) {
						tip = tip +  "导入失败的原因如下：<br/>" ;
						
						if (msg.data.repeatRecord > 0) {
							tip = tip +  "  重复的数据有" + msg.data.repeatRecord + "条<br/>" ;
						}
						if (msg.data.formatErrorRecord > 0) {
							tip = tip +  "  格式错误的数据有" + msg.data.formatErrorRecord + "条<br/>" ;
						}
						if (msg.data.personNotExistSize > 0) {
							tip = tip +  "  人员不存在的有" + msg.data.personNotExistSize + "条<br/>" ;
						}
						
						if (msg.data.errorMsg != undefined) {
							tip = tip +  msg.data.errorMsg ; 
						}
						if (msg.data.personNotExistMsg != undefined) {
							tip = tip +  msg.data.personNotExistMsg ; 
						}
					}
				}
				
				var options={
				   message:tip
				};
				$.extend(options, {
					type: 'info',
					hideAfter: null,
					showCloseButton: true
				});
				top.Messenger().post(options);
						
				$("#grid").jqGrid().jqGrid("reloadGrid");
				$('#photoCtrl').remove();
			},
			error: function(){
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});
	},
	
	importFileData: function(){
		//alert("读取服务器目录文件 解析");
		var that=this;
		
		var atsImportPlan = $('#AtsImportPlan').shrPromptBox('getValue');
		if ( atsImportPlan == null) {
			shr.showInfo({message: '请选择数据导入方案！'}); 
			return false;
		}
		var txtFileName = $("#txtFileName").val();
		
		//shr.getContextPath()+ "/atsPunchCardRecord.do?method=importTxtData",
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.file.AtsPunchCardRecordFileHandler&method=importAttendanceResult";
		//url += "&calSchemeId=" + encodeURIComponent($cmpschemeid);
		
		$.ajax({
			url: url,
			data: {
				importPlanId:atsImportPlan.id, 
				txtFileName: txtFileName
			},
			beforeSend: function(){
				openLoader(1);
			},
			success: function(msg){
				closeLoader();
				var tip="";				
				if((msg.importantError==null||msg.importantError=="")&&(msg.realTotalNum==null||msg.realTotalNum=="")){
				shr.showError({message: "导入异常，请检查您的导入模板和导入数据"});
				}else{
				if(msg.importantError!=null&&msg.importantError!=""){
				shr.showError({message: msg.importantError});
				}else{
				 realTotalNum = msg.realTotalNum;
				 successTotalNum = msg.successTotalNum;
				 failTotalNum = msg.failTotalNum;
				var tip="";
					tip ="打卡数据导入完毕<br/>";
					tip = tip +  " 导入的文件中共" + realTotalNum+ "条记录<br/>" ;
					tip = tip +  " 导入成功的记录有" + successTotalNum + "条<br/>" ;
				
				if (msg.failTotalNum > 0) {
						tip = tip +  " <font color='red'>导入失败" + failTotalNum + "条</font><br/>" ;
						tip = tip +  "导入失败的原因如下：<br/>" ;
						for(i=0;i<msg.errorStringList.length;i++){
							tip = tip + "  <font color='red'> " +　msg.errorStringList[i] + "</font><br/>" ;
						}
					}
				var options={
				   message:tip
				};
				$.extend(options, {
					type: 'info',
					hideAfter: null,
					showCloseButton: true
				});
				top.Messenger().post(options);
				$('#photoCtrl').remove();
				// 刷新表格
				$("#grid").jqGrid().jqGrid("reloadGrid");
				}
				}
			},
			error: function(){
			
				closeLoader();
			},
			complete: function(){
			
				closeLoader();
			}
		});
	},*/
	
	exportPunchCardRecordTemplateAction : function () {
		var self = this,
		$grid = $('#reportGrid'),
		postData = $grid.jqGrid("getGridParam", "postData"),
	    url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.file.AtsPunchCardRecordFileHandler&method=exportPunchCardRecordTemplate";
		//url = this.dynamicPage_url + "?method=exportPunchCardRecordTemplate" + "&uipk=" + this.reportUipk;  
		//url = shr.getContextPath() + shr.dynamicURL + "?method=exportPunchCardRecordTemplate";
		//标题
		url += "&title=" + jsBizMultLan.atsManager_punchCardRecordList_i18n_18;
		// set PostData
		/*$grid._pingPostData(postData);

		var param = postData;
		if (param.queryMode) {
			delete param.queryMode
		}
		if (!param.uipk) {
			param.uipk = self.reportUipk;
		}

		param.downSum = $('#downSum').attr('checked') == "checked" ? 1 : 0;

		param.isAll = true;
		url += "&" + $.param(param);

		url += "&queryMode=";

		var colModel = $grid.jqGrid("getGridParam", "colModel");
		for (var i = 0; i < colModel.length; i++) {
			var optionColumn = colModel[i];
			var hidden = optionColumn.hidden,
			label = optionColumn.label || optionColumn.name,
			index = optionColumn.index,
			dataColumnType = optionColumn.dataColumnType;
			if (index != null && index != "") {
				url += index + "," + hidden + "," + label + "," + dataColumnType + ";";
			}
		}*/
		document.location.href = url;
	},
	showInfo: function(options) {
		shr.msgHideAll();
		$.extend(options, {
			type: 'info',
			hideAfter: 30,
			showCloseButton: true
		});
		top.Messenger().post(options);
	},
	clearAdminOrgUnitVal: function(){
		 $("#adminOrgUnit").blur(function(){
		       if($("#adminOrgUnit_el").val() == null || $("#adminOrgUnit_el").val() == ""){
		           orgLongNum = "";
		       }
		 });
	}
	,cardCancelAction : function (event) {
		$("#calendar_info").empty();
	    var realBillId = [];
		var billId = $("#grid").jqGrid("getSelectedRows");
		
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
	        shr.showWarning({"message" : jsBizMultLan.atsManager_punchCardRecordList_i18n_6});
			return ;
	    }

		for (var i = 0; i < billId.length; i++) {
			if($(window.document.getElementById(billId[i])).find("td[aria-describedby='grid_punchCardState']")
				.html()==jsBizMultLan.atsManager_punchCardRecordList_i18n_22){
//			if($("#grid").jqGrid("getRowData",billId[i]).punchCardState == 1 ){
				shr.showWarning({"message" : jsBizMultLan.atsManager_punchCardRecordList_i18n_8});
				return ;
			}
		}
		var billLength = billId.length;
		var _self = this;
		$("#calendar_info").dialog({
			title: jsBizMultLan.atsManager_punchCardRecordList_i18n_22,
			width:513,
			height:270,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+50%',
				of: window
			},
			buttons: [{
				text: jsBizMultLan.atsManager_punchCardRecordList_i18n_11,
				click: function() {
					var description = $("#dialogText").val();
					if($("#dialogText").val().trim()==""){
						shr.showError({message: jsBizMultLan.atsManager_punchCardRecordList_i18n_23,hiddenAfter: 3});
						return;
					}
					if($("#dialogText").val().length>150){
						shr.showError({message: jsBizMultLan.atsManager_punchCardRecordList_i18n_20,hiddenAfter: 3});
						return;
					}
					_self.remoteCall({
						type:"post",
						method:"cardCancel",
						param:{billId:billId.toString(),description:description},
						success:function(res){
							window.parent.$("#calendar_info").dialog('close');
							$("#grid").resetSelection();
							$("#grid").jqGrid().jqGrid("reloadGrid");
							
						}
					});
				}
			},{
				text: jsBizMultLan.atsManager_punchCardRecordList_i18n_0,
				click: function(){
				  $(this).dialog("close");
				  $("#calendar_info").empty();
				}
			}],
			close : function() {
				$("#calendar_info").empty();
			}	
		});
		$("#calendar_info").append('<div style="width:10%;text-align:center;float:left;margin-left:8px;">'
			+ jsBizMultLan.atsManager_punchCardRecordList_i18n_5
			+ '</div><div><textarea id="dialogText" type="text" style="width:80%;" rows="5" validate="{maxlength:255}"></textarea></div>');
		$("#dialogText").val(jsBizMultLan.atsManager_punchCardRecordList_i18n_22);
//		shr.showConfirm('确认作废？', function(){
//			top.Messenger().hideAll();			
//			_self.remoteCall({
//				type:"post",
//				method:"cardCancel",
//				param:{billId:realBillId.toString()},
//				success:function(res){
//					_self.reloadGrid(); 
//				}
//			});
//			
//		});
	}
	,importRecodeAction : function(){
				var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
				var endDate = atsMlUtile.getFieldOriginalValue("endDate");
				var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.PunchCardRecordListHandler&method=importRecodes";
			    shr.ajax({
				dataType: "json",
				type:"post",
				async:false,
				data: {
				realBeginDate:beginDate,
				realEndDate:endDate
				},
				url:url,
				success:function(res){
				if(res.datas=="true"){
				window.location.href="http://shr.renshi100.com/ATS/PunchCardRecord.aspx?"+res.SecretKey;
				}else{
				shr.showError({message: res.errorMessageString, hideAfter: 3});
				}
				}
			});
	}
   ,antiCardCancelAction : function (event) {
		
	    var realBillId = [];
		var billId = $("#grid").jqGrid("getSelectedRows");
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
	        shr.showWarning({"message" : jsBizMultLan.atsManager_punchCardRecordList_i18n_6});
			return ;
	    }
		for (var i = 0; i < billId.length; i++) {
			if($(window.document.getElementById(billId[i])).find("td[aria-describedby='grid_punchCardState']")
				.html()!=jsBizMultLan.atsManager_punchCardRecordList_i18n_22){
//			if($("#grid").jqGrid("getRowData",billId[i]).punchCardState!=1){
				shr.showWarning({"message" : jsBizMultLan.atsManager_punchCardRecordList_i18n_9});
				return ;
			}
		}
		var billLength = billId.length;
		var _self = this;
		shr.showConfirm(jsBizMultLan.atsManager_punchCardRecordList_i18n_12, function(){
			top.Messenger().hideAll();			
			_self.remoteCall({
				type:"post",
				method:"antiCardCancel",
				param:{billId:billId.toString()},
				success:function(res){
					$("#grid").resetSelection();
					$("#grid").jqGrid().jqGrid("reloadGrid");
					
				}
			});
			
		});
	}
	,showCalDialogAction : function(){
		this.reloadPage({
			uipk: 'hr.ats.cloudHubSign'
		});
	}
   ,getPunchCardFromCloudAction : function (event) {
	   
	   var _self = this;
	   _self.showCalDialogActionV1();
   }
   ,showCalDialogActionV1 : function(){
			var _self = this;
		$("#calendar_info").empty();
		$("#calendar_info").next().remove(); // button
		$("#calendar_info").dialog({
			title: jsBizMultLan.atsManager_punchCardRecordList_i18n_14,
			width:600,
			height:300,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+50%',
				of: window
			},
			buttons: [{
				text: jsBizMultLan.atsManager_punchCardRecordList_i18n_11,
				click: function() {
					if (_self.validate() && _self.verify()) {
					
						var personIds = $('#proposerCloud_el').val();
						var adminOrgLongNum = $("#adminOrgUnitCloud_el").val();
						var realBeginDate = atsMlUtile.getFieldOriginalValue("realBeginDate");
						var realEndDate = atsMlUtile.getFieldOriginalValue("realEndDate");
						
						var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.team.PunchCardRecordListHandler&method=getPunchCardFromCloud";
						openLoader(1,jsBizMultLan.atsManager_punchCardRecordList_i18n_19);
						shr.ajax({
							type:"post",
							async:true,
							url:url,
							data: {
							   personIds:personIds,
							   adminOrgLongNum:adminOrgLongNum,
							   realBeginDate:realBeginDate,
							   realEndDate:realEndDate
							   },
							success:function(res){
								closeLoader();
								if( res.errorString != undefined && res.errorString != ""){
									var mes = res.errorString
									shr.showError({message:mes});
								}else{
									parent.location.reload();						
								}
						    }
						});
					}
				}
			},{
				text: jsBizMultLan.atsManager_punchCardRecordList_i18n_10,
				click: function(){
				  $(this).dialog("close");
				  $("#calendar_info").empty();
				}
			}],
			close : function() {
				$("#calendar_info").empty();
			}	
		});
		
		var addWorkString ='<form action="" id="form" class="form-horizontal" novalidate="novalidate"><div style=" margin: 15px; ">'
			+ '<div style=" padding-left: 110px; color: red; ">'
			+ jsBizMultLan.atsManager_punchCardRecordList_i18n_15
			+ '</div>'
			+ '<div class="row-fluid row-block ">'
			+ '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_punchCardRecordList_i18n_21
			+ '">'
			+ jsBizMultLan.atsManager_punchCardRecordList_i18n_21
			+ '</div></div>'
			+ '<div class="col-lg-8 field-ctrl">' 
			+ '<input id="adminOrgUnitCloud" name="adminOrgUnit" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title="">'
			+ '</div>'
//			+ '<input id="adminOrgUnitCloud_longNumber" name="adminOrgUnit.longNumber" type="hidden" value="">'
			+ '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_punchCardRecordList_i18n_17
			+ '">'
			+ jsBizMultLan.atsManager_punchCardRecordList_i18n_17
			+ '</div></div>'
			+ '<div class="col-lg-8 field-ctrl"><input id="proposerCloud" name="proposer" class="block-father input-height" type="text" validate="{required:true}" ctrlrole="promptBox" autocomplete="off" title=""></div>'
			+ '</div>'
			+ '<div class="row-fluid row-block ">'
			+ '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_punchCardRecordList_i18n_2
			+ '">'
			+ jsBizMultLan.atsManager_punchCardRecordList_i18n_2
			+ '</div></div>'
			+ '<div class="col-lg-8 field-ctrl">' 
			+ '<input id="realBeginDate" type="text" validate="{dateISO:true,required:true}" class="block-father input-height"/>'
			+ '</div>'
			+ '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_punchCardRecordList_i18n_1
			+ '">'
			+ jsBizMultLan.atsManager_punchCardRecordList_i18n_1
			+ '</div></div>'
			+ '<div class="col-lg-8 field-ctrl">' 
			+ '<input id="realEndDate" type="text" validate="{dateISO:true,required:true}" class="block-father input-height"/>'
			+ '</div>'
			+'</div>'
			+'</div></form>' ;
			
			//$("#realBeginDate"). 
		$("#calendar_info").append(addWorkString);
		
		var picker_json = {id:"realBeginDate"};
		picker_json.tagClass = 'block-father input-height';
		picker_json.readonly = '';
		picker_json.yearRange = '';
		picker_json.validate = '{dateISO:true,required:true}';
		$('#realBeginDate').shrDateTimePicker($.extend(picker_json,{ctrlType: "Date",isAutoTimeZoneTrans:false}));
		atsMlUtile.setTransDateTimeValue('realBeginDate',new Date().toJSON().slice(0, 10));
		
		var picker_json = {id:"realEndDate"};
		picker_json.tagClass = 'block-father input-height';
		picker_json.readonly = '';
		picker_json.yearRange = '';
		picker_json.validate = '{dateISO:true,required:true}';
		$('#realEndDate').shrDateTimePicker($.extend(picker_json,{ctrlType: "Date",isAutoTimeZoneTrans:false}));
		atsMlUtile.setTransDateTimeValue('realEndDate',new Date().toJSON().slice(0, 10));
		$("#realEndDate").shrDateTimePicker({ctrlType: "Date",isAutoTimeZoneTrans:false});//@
		
		//组织	 
		
		var defaultAdminOrg = {};
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=getControlAdminOrgUnit";
			shr.ajax({
				type:"post",
				async:false,
				url:url,
				success:function(res){
					defaultAdminOrg.id = res.id;
					defaultAdminOrg.name = res.name;
					defaultAdminOrg.longNumber = res.longNumber;
			    }
		});
			
		var grid_f7_json = {id:"adminOrgUnitCloud",name:"adminOrgUnit"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_punchCardRecordList_i18n_21,uipk:"com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",query:"",filter:"",domain:"",multiselect:false};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.value = {id:"",name:"",displayName:""};
		if(defaultAdminOrg){
			grid_f7_json.value = defaultAdminOrg;
		}
		grid_f7_json.displayFormat = '{displayName}';
		grid_f7_json.customformatter = orgSlice;
		grid_f7_json.customparam = [2];
		$('#adminOrgUnitCloud').shrPromptBox(grid_f7_json);
		//人员
		grid_f7_json = null;
	    grid_f7_json = {id:"proposerCloud",name:"proposer"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_punchCardRecordList_i18n_17,uipk:"com.kingdee.eas.hr.ats.app.team.ExistFileForAdmin.F7",query:"",filter:"",domain:"",multiselect:true};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.value = {id:"",name:""};
		$('#proposerCloud').shrPromptBox(grid_f7_json);
		
		if(defaultAdminOrg.longNumber !=null && defaultAdminOrg.longNumber!=''){ 
			var filter=" adminOrgUnit.longNumber like '"+defaultAdminOrg.longNumber+"%' ";//初始化的时候赋值过滤条件
			$("#proposerCloud").shrPromptBox("setFilter",filter);
		}
		  
		
		$('#adminOrgUnitCloud').shrPromptBox("option", {
			onchange : function(e, value) {
			   var info = value.current;
			   if(info!=null && info!=''){
			   if(info.longNumber !=null && info.longNumber!=''){ 
				  var filter=" adminOrgUnit.longNumber like '"+info.longNumber+"%' ";//因为要加入员工的职业信息，所以现在员工查询结果来自于   员工的职业信息（右）关联的员工
				  $("#proposerCloud").shrPromptBox("setFilter",filter);
			   }else{
			   }
			   }
			   $("#proposerCloud").shrPromptBox("setValue",{
					id : "",
					name : ""
			   });
			}
		});
		//要将form加上，数据校验才有用。
	    var formJson = {
			id: "form"
		};
		$('#form').shrForm(formJson);
	}
   /*
	*原来是继承edit的，改成集成list了没有这个方法了，所以手动加上。
	*/
	,validate: function() {
		$form = $("#form");
		var flag = $form.wafFormValidator("validateForm", true);
		if (!flag) {
			shr.showWarning({
				message: jsBizMultLan.atsManager_punchCardRecordList_i18n_13,
				hideAfter: 5
			});
		}
		
		return flag;
	}
	,verify: function() {
		var realBeginDate = atsMlUtile.getFieldOriginalValue("realBeginDate");
		var realEndDate = atsMlUtile.getFieldOriginalValue("realEndDate");
		var personIds = $('#proposerCloud_el').val();
		
		if(new Date(realBeginDate).getTime()>new Date(realEndDate).getTime()){//@
			shr.showInfo({message: jsBizMultLan.atsManager_punchCardRecordList_i18n_4});
			return false;
		}
		
		var beginDate_01 = new Date(realBeginDate.replace(/-/g, "/"));
		var endDate_01  = new Date(realEndDate.replace(/-/g, "/"));
		var reBeginDate_01 = new Date(realBeginDate.replace(/-/g, "/"));
		reBeginDate_01.setMonth(reBeginDate_01.getMonth() + 1);
		var leftsecond = endDate_01.getTime() - beginDate_01.getTime();
		var rightsecond = reBeginDate_01.getTime() - beginDate_01.getTime();
		if(leftsecond  > rightsecond){
			shr.showWarning({message: jsBizMultLan.atsManager_punchCardRecordList_i18n_3,hideAfter: 3});
			return;
		}			

		if(personIds.split(',').length>50){
			shr.showInfo({message: jsBizMultLan.atsManager_punchCardRecordList_i18n_16});
			return false;
		}

		return true;
	},
	queryGrid: function(){
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"punchCardDate","errorMessage":jsBizMultLan.atsManager_punchCardRecordList_i18n_7});
		if(dateRequiredValidate){
//			shr.ats.PunchCardRecordList.superClass.queryGrid.call(this);
			var _self = this;
			var $grid = $(this.gridId);
			_self.setFastFilterMap();
			this.setGridTreeParam();
			this.setGridCustomParam();
			this.setBotpFilterItems($grid);
			
			this.queryFastFilterGrid();
			
			// selector
			var selector = this.getSelector();
			if (typeof selector !== 'undefined') {
				$grid.setGridParam({ selector: selector	});
			}
			// filter
			var filterItems = this.getFilterItems();
			$grid.jqGrid("option", "filterItems", filterItems);
			
			// fastFilter
			var fastFilterItems = this.getFastFilterItems();
			if (fastFilterItems) {
				$grid.jqGrid("option", "fastFilterItems", JSON.stringifyOnce(fastFilterItems));
			}
	
			//seniorFilter
			var advancedFilter = this.getAdvancedFilterItems();
			if(_self.fastFilterMap && _self.fastFilterMap.fastFilterItems && _self.isReturn){
				advancedFilter = _self.fastFilterMap.fastFilterItems.advancedFilter;			
			}
			if(advancedFilter){
				$grid.jqGrid("option", "advancedFilter", JSON.stringify(advancedFilter));
			}else{
				$grid.jqGrid("option", "advancedFilter", null);
			}	
	
			// sorter
			var sorterItems = this.getSorterItems();
			if (sorterItems) {
				$grid.jqGrid("option", "sorterItems", sorterItems);
			}
			var keyField = this.getBillIdFieldName();
			if (keyField) {
				$grid.jqGrid("option", "keyField", keyField);
			}
			// 修改为通过URL取数
			$grid.jqGrid('setGridParam', {datatype:'json'});
			// reload
			if(!this.isFirstTimeLoad){
				$grid.jqGrid("reloadGrid");
			}else{
				this.isFirstTimeLoad = false;
			}
			var filtertype = 'normal';
			var filterValue = filterItems;
			if(this.getQuickFilterItems()){
				filtertype = 'QuickFilter';
				filterValue = this.getQuickFilterItems();
			}
			if(this.getCustomFilterItems()){
				filtertype = 'CustomFilter';
				filterValue = this.getCustomFilterItems();
			}
			var text = {id:this.uipk,text:this.title,filtertype:filtertype,filter:filterValue};
			var value = {type:2,msg:text};
			shr.operateLogger(value);
		}
	}
});



/**
 * 从Cookie中获取Session Id，解决上传文件302错误
 * @returns
 */
function getJSessionCookie() {
	var array = document.cookie.split(";");
	for(var i=0;i<array.length;i++) {
		if(array[i].indexOf("JSESSIONID") >= 0) {
			return array[i].trim();
		}
	}
	return "";
}	








