shr.defineClass("shr.ats.AtsTripBillList", shr.framework.List, {
	
	
	initalizeDOM : function () {
		shr.ats.AtsTripBillList.superClass.initalizeDOM.call(this);
		var that = this;
		atsTimeZoneService.initTimeZoneForList("timeZone.name");
	    that.setNavigateLine();
	    jsBinder.gridLoadComplete=function(data){
			$("#grid_description").find(".s-ico").remove();//审批人字段数据库值全为空，不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_description").removeClass("ui-jqgrid-sortable");
		};
	},
	
	
	//返回到出差单个人列表,还需要复写"创建","查看"的方法 跳转到"个人出差单的form试图"
	/**
	 * 新增
	 */
	addNewAction: function() {
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillForm",
			method: 'addNew'
		});
	}
	,batchNewAction: function() {
		var _self = this;
		_self.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillBatchNewForPer",
			method: 'addNew'
		});
	}
	
	/**
	 * 个人列表-查看功能
	 */
	,viewAction: function(billId) {
		var _self = this;
		var billType = $("#grid").jqGrid("getRowData",billId).billType;
		// 批量提交
		if(billType=="2"){
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillBatchNewForPer",
				billId: billId,
				method: 'view'
			});	
		// 	普通提交 
		}else{
			_self.reloadPage({
				uipk: "com.kingdee.eas.hr.ats.app.AtsTripBillForm",
				billId: billId,
				method: 'view'
			});		
		}		
	},
	
	
	
	//工程迁移到应用后  这块好像还没有改好???
 	importTripBillAction: function(){
		var _self = this;
		var  importTripBill = ''
			+ '<div id="photoCtrl">' 
			+	'<p>'
			+ jsBizMultLan.atsManager_atsTripBillList_i18n_8
			+ '</p>'
			+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_atsTripBillList_i18n_2
			+ '</div>'
			+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_atsTripBillList_i18n_3
			+ '</div>'
			+ 	'<p>'
			+ jsBizMultLan.atsManager_atsTripBillList_i18n_16
			+ '</p>'
			+ 	'<div class="photoCtrlBox">'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked></div>'
			+		'<div class="photoCtrlUpload"><span>'
			+ jsBizMultLan.atsManager_atsTripBillList_i18n_25
			+ '</span><span>'
			+ jsBizMultLan.atsManager_atsTripBillList_i18n_14
			+ '</span></div>'
			+		'<div class="photoCtrlUpload1"><input type="file" name="batchImportPackage" id="batchImportPackage"></div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+ 	'<div class="photoCtrlBox"><div id="exportBox"><div class="photoCtrlRadio"><input type="radio" name="inAndout" id="exportRadio"></div><span>'
			+ jsBizMultLan.atsManager_atsTripBillList_i18n_24
			+ '</span><span>'
			+ jsBizMultLan.atsManager_atsTripBillList_i18n_7
			+ '</span></div><div id="adminOrgBox"><form id="123l23" action="123l23"><input type="text" id="adminOrg" name="adminOrg" class="input-height"></form></div><div id="isIncludeBox"><div class="photoCtrlRadio"><input type="checkbox" name="isContainsSub" id="isContainsSub"></div><span>'
			+ jsBizMultLan.atsManager_atsTripBillList_i18n_4
			+ '</span></div><div style="clear: both;"></div></div>'
			+ '</div>';
		$(document.body).append(importTripBill);
		
		$('#importRadio, #exportRadio').shrRadio();
		$('#isContainsSub').shrCheckbox();//是否包含下级
		
		//var grid_f7_json = {id:"adminOrg",name:"adminOrg"};
		//grid_f7_json.subWidgetName = 'shrPromptGrid';
		//grid_f7_json.subWidgetOptions = {title:"选择一个范围",uipk:"com.kingdee.eas.basedata.org.app.AdminOrgUnit.F7",query:""};
		//$('#adminOrg').shrPromptBox(grid_f7_json);
		//$('#123l23').shrForm({id:"123l23"});//包裹一个form, 为了提供validate功能
		//$('#adminOrg').shrPromptBox('addRules', {required:true});
		//alert( shr.getUrlRequestParam('sessionId') );
		var sessionid = "wKghcxroUeOMIgkiB0AU3UUEpwWKc1Sp5s0A";
		$('#batchImportPackage').fileupload({
        	pasteZone: null,
            url : shr.getContextPath()+ "/attachmentUpload.do?method=uploadAttachment",
            formData : {boID: self.options.formId, onlyone:self.options.onlyone, field: self.options.field, description: self.options.name,uipk:uipk,permItemId: shr.getCurrentPagePermItemId()},
            dataType : "json",
            iframe: self.iframe,
            start : function(e){
                var attachListId = '#'+self.options.id+'_attachList';
                $( attachListId ).append("<p class = 'attachment-loading'>'"+$.shrI18n.widget.shrAttachment.tips.fileUploading+"' <span class = 'progress'></span></p>");
                $( attachListId + ".progress" ).html( "10%" );
            },

            add : function ( e,data ){
            	//多行表中只能有一个表格的状态是编辑或者新增
            	var len = $('.shr-multiRow .view_form').length;
            	var ind = 0;
            	for(var i = 0; i < len; i++){
            		var tem = $('.shr-multiRow .view_form')[i];
            		var id = tem.getAttribute("id");
            		if(id){
            			var operate = shr.getCurrentViewPage(id).operateState;
            			if("ADDNEW" == operate || "EDIT" == operate){
                            ind = ind + 1;
            			}
            		}
            	}
            	if(ind > 1){
            		shr.showError({ message: $.shrI18n.widget.shrAttachment.tips.saveOtherMultiRow });
            		return;
            	}
            	
                var uploadErrors = [],errorMsg;
                var acceptFileTypes = self.analysisFileType(self.options.fileType);
                var excludeFileTypes = self.analysisFileType(self.options.excludeFileType);
                // data.originalFiles file的全部数据
                var fileType = data.files[0]['name'];
                if(fileType && ((self.options.fileType && !acceptFileTypes.test(fileType)) || (self.options.excludeFileType && excludeFileTypes.test(fileType))) ){
                    if (self.options.fileType) {
                        errorMsg = $.shrI18n.widget.shrAttachment.tips.requireRightFile + self.options.fileType;
                    } else {
                        errorMsg = $.shrI18n.widget.shrAttachment.tips.forbiddenFile + fileType;
                    }
                    shr.showError({ message: errorMsg });
                    return;
                }
                if( data.originalFiles.length && !data.files[0]['size'] && data.files[0]['size'] == 0 ){
                    shr.showError({ message: $.shrI18n.widget.shrAttachment.tips.fileForbiddenBlank });
                }else if( data.originalFiles.length && data.files[0]['size'] && data.files[0]['size'] > self.options.maxSize*1024*1024 ){
                    shr.showError({ message: $.shrI18n.widget.shrAttachment.tips.fileSizeRequire+ self.options.maxSize +"M"+$.shrI18n.widget.shrAttachment.tips.file });
                }
                else{
                    data.submit();
                }
            },
            
            progressall : function( e,data ){
                var progress = parseInt( data.loaded / data.total * 100 ,10 );
                var attachListId = '#'+self.options.id+'_attachList';
                $( attachListId + " .progress" ).html( progress+"%" );
            },
           
            done : function( e,data ){
            	var attachListId = '#'+self.options.id+'_attachList';
        		$( attachListId + " .attachment-loading" ).remove();
            	var result = data.result;
            	if("success" == result.result){
            		var response = result.data;
            		if(response == null){
            			shr.showError({ message:  $.shrI18n.widget.shrAttachment.tips.uploadFailure });
            			return;
            		}
            		var filename = response.filename;
            		var attachment = {
          				id: response.id, 
          				name: filename.substring(0,filename.lastIndexOf(".")),
          				simpleName: (new RegExp(/[^\.]+$/)).exec(filename),
          				uploader: response.uploader,
          				uploadDateTime: response.uploadDateTime,
          				remark: response.remark
      				}
                    var itemHtml = self._generateAttachItems(attachment, true);
                    //获取当前的iframe，上传成功后动态增加iframe高度
                    var currentIframe = self.getCurrentIframe();
                    var currentIframeHeight = $(currentIframe).height();
                    $(currentIframe).height(currentIframeHeight + 30);
            		if(self.options.onlyone == true || self.options.onlyone == "true"){
            			$(attachListId).html(itemHtml);
            		}else{
            			$(attachListId).append(itemHtml);
            		}
            		
            		$('[id="' + self.idPrefix + attachment.id + '_attach_delete"]').off('click').on('click', function(){
						var that = this;
						shr.showConfirm($.shrI18n.widget.shrAttachment.tips.confirmDelete, function(){
							if(self.data.readonly) return;
							var formId = self.options.formId;
							$.ajax({
								url: shr.getContextPath()+ "/attachmentUpload.do?method=deleteAttachment",
								data: {attachId: attachment.id, boID: formId},
								success: function(msg){
									$(that).parent('.attachItems').slideUp(function(){
										$(that).parent('.attachItems').remove();
										$(self.data.attachListId).trigger(self.data.eventName);
										shr.setIframeHeight();
										if (typeof (self.options.deleteSuccessCallback) == "function") {
											self.options.deleteSuccessCallback.call(this,self);
										}
									});
										
								}
							});
						})
					});
            		$(attachListId).trigger(self.data.eventName);
            		if (typeof (self.options.uploadSuccessCallback) == "function") {
            			self.options.uploadSuccessCallback.call(this,self);
            		}
            		
            		self._bindRemarkClick();
            	}else{
            		shr.showError({ message: result.summary });
            	}
            },
        });
		
		$('#photoCtrl').dialog({
			title: jsBizMultLan.atsManager_atsTripBillList_i18n_5,
			width: 600,
			height: 450,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+20%',
				of: window
			},
			buttons: [{
				text: jsBizMultLan.atsManager_atsTripBillList_i18n_19,
				click: function() {
					if($('#importRadio').shrRadio('isSelected')){
						shr.showError({message: jsBizMultLan.atsManager_atsTripBillList_i18n_22});
					}else if($('#exportRadio').shrRadio('isSelected')){
						//if($('#123l23').valid()){
							_self.batchExportPhoto();
						//}
					}
				}
			},{
				text: jsBizMultLan.atsManager_atsTripBillList_i18n_18,
				click: function() {
					$(this).dialog( "close" );
				}
			}]
		});
	},
	
	batchExportPhoto: function(){
		var isContainsSub = $('#isContainsSub').shrCheckbox('isSelected');
		var adminOrg = "121";//$('#adminOrg').shrPromptBox('getValue');
		$.ajax({
			url: shr.getContextPath()+ "/atsTripFileUpload.do?method=batchExportPhoto",
			//data: {adminOrgID:adminOrg.id, adminOrgLongNumber: adminOrg.longNumber, adminOrgName: adminOrg.name, isContainsSub:isContainsSub},
			data: {adminOrgID:1, adminOrgLongNumber: 123, adminOrgName: "111", isContainsSub:isContainsSub},
			beforeSend: function(){
				openLoader(1);
			},
			success: function(msg){
				closeLoader();
				var filePath = msg.data;
				var filePathArray = filePath.split('\\');
				var realFilePath = shr.getContextPath() + '/newZipFoler/' + filePathArray[filePathArray.length-1];
				window.location.href = realFilePath;
			},
			error: function(){
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});
	}
	
	/**
	 * 初始化页面时查询表格数据
	 * 重写此方法：从员工考勤看板日历跳转的单据页面取消默认查询条件，只显示日历单元格所在日的单据
	 */
	,initalizeQueryGrid: function(){
		var empFlag = shr.getUrlParam('empFlag');
		if(empFlag){
			this.inEmpFlagChangeSearchOtDate();
			$("#searchId").next().remove();
			this.queryGrid();
		}else{
			var $search = $('#searcher');
			var filter = $search.shrSearchBar('option', 'filterView');
			if ($.isEmptyObject(filter)) {
				// 如果filter为空
				if (!$.isEmptyObject($search.shrSearchBar('option', 'defaultViewId'))) {
					// 加载默认过滤方案触发表格取数
					$search.shrSearchBar('chooseDefaultView');
				} else {
					this.queryGrid();
				}
			} else {
				// 如果filter为非空，则直接查询表格数据
				this.queryGrid();
			}
		}
	}

	,inEmpFlagChangeSearchOtDate:function(){
		var dateValue = shr.getUrlParam('dateValue');
		if(dateValue){
			var lastChild = $("#entries--tripStartTime_entries--tripEndTime-dateselect_down li:last-child");
			var temp = $("#fastFilter-area").shrFastFilter("option", "fastFilterItems");
			temp['entries.tripStartTime_entries.tripEndTime'].values.startDate=dateValue;
			temp['entries.tripStartTime_entries.tripEndTime'].values.endDate=dateValue;
			temp['entries.tripStartTime_entries.tripEndTime'].values.selectDate=lastChild.attr("data-value");
			$("#fastFilter-area").shrFastFilter("option", "fastFilterItems",temp);
			atsMlUtile.setTransDateValue("#entries--tripStartTime_entries--tripEndTime-datestart",dateValue);
			atsMlUtile.setTransDateValue("#entries--tripStartTime_entries--tripEndTime-dateend",dateValue);
			atsMlUtile.setTransDateValue("#entries--tripStartTime_entries--tripEndTime-dateselect",lastChild.attr("title"));
			$("#entries--tripStartTime_entries--tripEndTime-datestart").trigger("change");
		}
	}
	
	/**
	 * 套打模板名称
	 * 重写此方法
	 */
	,getTemplateName: function() {
		return '/s-HR/Attendance/TripBill';
	},
	
	/**
	 * 套打dataProvider
	 * 重写此方法
	 */
	getTemplateDataProvider: function() {
		return 'com.kingdee.shr.ats.web.templatePrint.TripBillPrintHelpDataProvider';
	}
	
	
	/**
	 * 套打获取套打ID
	 * 重写此方法：获取当前页选中行的分录ID
	 * 解决当以主表ID作为套打ID时，多分录场景下，只有第一条单据审批意见完整，其余都只显示一条的问题
	 */
	,getTemplatePrintId: function() {
		var templatePrintId = "";
		var selectedRows = $('#grid input:checked').parents("tr").children("td[aria-describedby='grid_entries.id']");
		
		var selectedRowsLen = selectedRows.length;
		if (selectedRowsLen==0){
			shr.showWarning({
			message: jsBizMultLan.atsManager_atsTripBillList_i18n_11
			});
			
		}else {
			//获取的数组是倒序的
			for (var i = selectedRowsLen-1;i>=0;i--){
				templatePrintId += selectedRows[i].title+",";
			}
			templatePrintId = templatePrintId.substring(0,templatePrintId.length-1);
			return templatePrintId;
			}
					
	}
	/**
	 * 描述:删除操作
	 * @action 
	 */
	,deleteAction:function(){
    	var _self = this;
    	var billId = $("#grid").jqGrid("getSelectedRows");
    	if(billId == undefined || billId.length<=0 || (billId && billId.length == 1 && billId[0] == "")){
    	    shr.showError({message : jsBizMultLan.atsManager_atsTripBillList_i18n_12});
    	    return false;
    	}
		var selectedIds = shr.atsBillUtil.getSelectedIds();
		if(shr.atsBillUtil.isInWorkFlow(selectedIds)){
			shr.showConfirm(jsBizMultLan.atsManager_atsTripBillList_i18n_20, function() {
				top.Messenger().hideAll();
				shr.atsBillUtil.abortWorkFlow(selectedIds);//撤回未提交且已绑定流程的单据
				_self.doRemoteAction({
					method: 'delete',
					billId: selectedIds
				});
			});
		}else{
			if (selectedIds) {
				this.deleteRecord(selectedIds);
			} 
		}
	}
	
	
	/**
	 * 批量提交
	 */
	,actSubmit: function(realIds,action,nextPers){
		var _self = this;
		if(!realIds){
			return;
		}
		data = $.extend(_self.prepareParam(), {
					method: action,
					billId: realIds,
					nextPers:nextPers
				});
		openLoader(1,jsBizMultLan.atsManager_atsTripBillList_i18n_26);
		shr.doAjax({
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(res) {
				closeLoader();
				if(res.alreadyInProcessQueueException == 1){
					shr.showError({message: jsBizMultLan.atsManager_atsTripBillList_i18n_9});
				}else{
					var failMsg = "";
					if(res.error !="" && res.error!=null && res.error!=undefined ){
						// shr.showError({message: res.error});
					}else{
						if(res.submitNum - res.submitSuccessNum>0){
						failMsg = jsBizMultLan.atsManager_atsTripBillList_i18n_1 + (res.submitNum - res.submitSuccessNum)
						}
						shr.showInfo({message:jsBizMultLan.atsManager_atsTripBillList_i18n_28 + res.submitNum
								+ jsBizMultLan.atsManager_atsTripBillList_i18n_0 + res.submitSuccessNum + failMsg});
						$("#grid").jqGrid().jqGrid("reloadGrid");
					}
				}
			},
			error: function(response) {
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});	
				
	},
	/**
	 * 设置导航条
	 */
	setNavigateLine: function(){
		var parentUipk = parent.window.shr.getCurrentViewPage().uipk;
	    var punchCardFlag = sessionStorage.getItem("punchCardFlag");
	    var empolyeeBoardFlag =	sessionStorage.getItem("empolyeeBoardFlag");
		if(("fromPunchCard" == punchCardFlag 
		&& "com.kingdee.eas.hr.ats.app.WorkCalendarItem.listSelf" == parentUipk) || 
		("empolyeeBoardFlag" == empolyeeBoardFlag && "com.kingdee.eas.hr.ats.app.WorkCalendar.empATSDeskTop" == parentUipk)
		){//来自打卡记录弹出框的时候
	        $("#breadcrumb").remove();
	        window.parent.changeDialogTitle(jsBizMultLan.atsManager_atsTripBillList_i18n_6);
	    }
	}
	,abortBillAction : function (event) {
		var _self = this;
		shr.atsBillUtil.abortBill(_self);	
	}
	/**出差确认列表**/
	,canTripBillListAction : function(){
		parent.$('#operationDialog').parent().find('.ui-dialog-title').text($('#canTripBillList>a').text());
		this.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.CanTripBillList"
		});
	}
	/**出差确认**/
	,canTripBillAction : function(){
		var that = this;
		var billId = $("#grid").jqGrid("getSelectedRows");
		if((billId && billId.length == 0) || !billId){
			parent.$('#operationDialog').parent().find('.ui-dialog-title').text($('#canTripBill>a').text());
			this.reloadPage({
			             uipk: "com.kingdee.eas.hr.ats.app.CanTripBillForm",
			             method: 'addNew',
			             isFromPage: "Trip"
		    });
			return true;
		}
		if(billId.length>1){
                shr.showWarning({message:jsBizMultLan.atsManager_atsTripBillList_i18n_17});
				return false;
		}
		parent.$('#operationDialog').parent().find('.ui-dialog-title').text($('#canTripBill>a').text());
		var tripBillId = "";
		var billType = 1;
		tripBillId = billId[0];
		var billType = $("#grid").jqGrid("getRowData", tripBillId).billType;	
		if(billType == 2){
			shr.showWarning({message:jsBizMultLan.atsManager_atsTripBillList_i18n_13});
			return false;
		}else{
			var billState = $("#grid").jqGrid("getRowData", tripBillId).billState;
			
			if(billState != 3){
				shr.showWarning({message: jsBizMultLan.atsManager_atsTripBillList_i18n_15});
			}else{
				var isHavenCanTrip = false;
				that.remoteCall({
			      type: "post",
			      async: false,
			      method:"isHavenCanTrip",
			      param:{billId:billId[0]},
			      success: function(res){
				    isHavenCanTrip = res.isHavenCanTrip;
			    }
		       });
			   if(isHavenCanTrip == false){
					tripBillId=$("#grid").jqGrid("getSelectedRowsData")[0]["entries.id"]; //2020-5-29 16:39 修改
			         this.reloadPage({
			             uipk: "com.kingdee.eas.hr.ats.app.CanTripBillForm",
			             method: 'addNew',
			             tripBillId: tripBillId,
			             isFromPage: "Trip"
		           });
			   }else{
				   shr.showWarning({message:jsBizMultLan.atsManager_atsTripBillList_i18n_10});
			   }
		  }
		}
	},
	submitAction: function() {
		var _self = this;
		var selectedRowData = _self.selectedRowData;
		if(undefined != selectedRowData && selectedRowData.length > 0){
			var personId = "";
			for(var i=0;i<selectedRowData.length; i++){
				if(personId == ""){
					personId = selectedRowData[i]["entries.person.id"];
				}
				if(personId != "" && undefined != selectedRowData[i]["proposer.id"] && personId != selectedRowData[i]["proposer.id"]){
					shr.showError({message: jsBizMultLan.atsManager_atsTripBillList_i18n_27, hiddenAfter: 5});
		    		return;
				}
			}
		}
		shr.ats.AtsTripBillList.superClass.submitAction.call(_self);
	}
});