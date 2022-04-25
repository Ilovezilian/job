/**
 * 20140328假期档案与考勤档案使用同一张表/实体-考勤档案实体,故注意字段名
 * */

shr.defineClass("shr.ats.HolidayFileList", shr.ats.lackHolidayFileInfoEdit, {
	pageStep: 0,
	initalizeDOM : function () {
		shr.ats.HolidayFileList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initTabPages();
		that.getPersonChangeTabNum();
	},
	
	//查看员工变动	
	viewPersonChangeAction:function(){
		this.reloadPage({
			uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirmHolidayFile.list'
			//billId: "",
			//method: 'disAttendanceFilePerson'
		});	
	},
	
	batchMaintainAction: function() {
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		var personIds='';
		if (selectedIds.length <= 0) {
			shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_24, hideAfter: 3});
			return;
		}
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsHolidayFileBatchMaintain.list'
		});			
	}, 
	viewAction: function(billId) {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayFileView.form',
			billId: billId,
			method: 'view'
		});			
	}, 
	addNewAction: function() {		
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayFile.form',
			method: 'addNew'
		});
	}
	,viewHistoryAction:function()
	{
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		var personIds='';
		if (selectedIds.length > 0) {
			var bills ;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var personId=$grid.jqGrid("getCell", selectedIds[i], "person.id");
				if(personIds.length>0){
					personIds=personIds+","+personId;	
				}
				else{
					personIds=personId;	
				}
			}
		}
		else{
			shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_24, hideAfter: 3});
			return;
		}
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.AtsHolidayFileHis.list',
			billId: personIds
		});
	},
	enableFileAction: function() {
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var bills ;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var state=$grid.jqGrid("getCell", selectedIds[i], "attendFileState");
				if(state==1){
					shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_6, hideAfter: 3});
					return;
				}
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
				
			}
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_20, hideAfter: 3});
			return;
		}
		
		clz.remoteCall({method: "enableFile", param: {billId:bills}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_19, hideAfter: 3});
			//clz.reloadPage();
			window.location.reload();
		}});
	},
	
	deleteAction:function(){	
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var bills ;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var state=$grid.jqGrid("getCell", selectedIds[i], "attendFileState");
				if(state==1){
					shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_4, hideAfter: 3});
					return;
				}
			}
			shr.ats.HolidayFileList.superClass.deleteAction.call(this);
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_20, hideAfter: 3});
			return;
		}
	},
		
	disableFileAction: function() {
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var bills ;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var state=$grid.jqGrid("getCell", selectedIds[i], "attendFileState");
				if(state==2){
					shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_5, hideAfter: 3});
					return;
				}
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
				
			}
			clz.remoteCall({method: "disableFile", param: {billId:bills}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_14, hideAfter: 3});
			clz.reloadPage();
			window.location.reload();
			}});
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_21, hideAfter: 3});
			return;
		}
		
			//禁用考勤档案，此日期以后的所有排班记录要删除，给出提示
		var curDate = new Date();
		var curDateY = curDate.getFullYear();
		var curDateD = curDate.getDate();
		curDateD = curDateD<10?"0"+curDateD : curDateD;
		var curDateStr = curDateY + jsBizMultLan.atsManager_holidayFileList_i18n_15
			+ $.shrI18n.dateI18n.month2[curDate.getMonth()]
			+ curDateD + jsBizMultLan.atsManager_holidayFileList_i18n_26;
		
		
		
		//shr.showConfirm('档案禁用后，'+curDateStr+'及以后的排班记录将会删除，您确认要禁用吗？', function(){
			//clz.remoteCall({method: "disableFile", param: {billId:bills}, success: function(data) {
			//shr.showInfo({message: "禁用成功！", hideAfter: 3});
			//clz.reloadPage();
		//window.location.reload();
		//	}});
		//});
		
	} ,
	disAttendanceFilePersonAction:function(){	
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayFileDisPersonView.list'
		});	
	},
	importDataAction:function(){
    var  that = this;
		var  importHTML= ''
			+ '<div id="photoCtrl">' 
			+	'<p>'
			+ jsBizMultLan.atsManager_holidayFileList_i18n_12
			+ '</p>'
			+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_holidayFileList_i18n_2
			+ '</div>'
			+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_holidayFileList_i18n_3
			+ '</div>'
			+   '<br>'
			+ 	'<p>'
			+ jsBizMultLan.atsManager_holidayFileList_i18n_23
			+ '</p>'
			+ 	'<div class="photoCtrlBox">'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked ></span></div>'
			+       '<div class="photoCtrlUpload"><span>'
			+ jsBizMultLan.atsManager_holidayFileList_i18n_22
			+ '</span></div>'
			+		'<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			+ 		'<div style="clear:both"><span style="color:red;display:none" id="file_warring">'
			+ jsBizMultLan.atsManager_holidayFileList_i18n_27
			+ '</span></div>'
			+       '<br>'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="exportRadio" ></div>'
			+       '<div class="photoCtrlUpload"><span>'
			+ jsBizMultLan.atsManager_holidayFileList_i18n_10
			+ ' </span></div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+ '</div>';
		$(document.body).append(importHTML);
	    // 初始化上传按钮
		$('#importRadio').shrRadio();
		$('#exportRadio').shrRadio();
	
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayFileListHandler&method=uploadFile";
		//在点击确定前，对文件进行上传处理
		var handleFlag = false;
		$("#file_upload").fileupload({
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
			title: jsBizMultLan.atsManager_holidayFileList_i18n_11,
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
				text: jsBizMultLan.atsManager_holidayFileList_i18n_25,
				click: function() {
					if($('#exportRadio').shrRadio('isSelected')){
						that.exportFileData();
					}
					else if($('#importRadio').shrRadio('isSelected')){
						if(handleFlag){
							that.importFileData();
							$(this).dialog( "close" );
							$('#photoCtrl').remove();
						}
						else{
							$('#file_warring').show();
						}
					}
				}
			},{
				text: jsBizMultLan.atsManager_holidayFileList_i18n_9,
				click: function() {
					$(this).dialog( "close" );
					$('#photoCtrl').remove();
				}
			}]
		});
	},importFileData: function(){
		//alert("读取服务器目录文件 解析");
		var that=this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayFileListHandler&method=importFileData";
		$.ajax({
			url: url,
			beforeSend: function(){
				openLoader(1);
			},
			success: function(msg){
				closeLoader();
				var tip="";
					tip =jsBizMultLan.atsManager_holidayFileList_i18n_13
						+ "<br/>";
					tip = tip + shr.formatMsg(jsBizMultLan.atsManager_holidayFileList_i18n_1,[msg>totalNum])+ "<br/>" ;
					tip = tip + shr.formatMsg(jsBizMultLan.atsManager_holidayFileList_i18n_0, [msg.successNum]);
					tip = tip + shr.formatMsg(jsBizMultLan.atsManager_holidayFileList_i18n_18,[msg.newNum]);
					tip = tip + shr.formatMsg(jsBizMultLan.atsManager_holidayFileList_i18n_8,[msg.updateNum]) + "<br/>";
					
					if (msg.errorNum > 0) {
						tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_holidayFileList_i18n_7,[msg.errorNum]) + "<br/>" ;
						if(msg.errorStr != "" && msg.errorStr.length > 0){
							tip = tip + msg.errorStr;
						}
						if (msg.tableRepeatNum > 0) {
							tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_holidayFileList_i18n_28,[msg.tableRepeatNum]) + "<br/>" ;
							tip = tip + msg.tableRepeatMessage;
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
				/*that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.ScheduleShift.list'
				});	
				*/
			},
			 error: function (XMLHttpRequest, textStatus, errorThrown) { 
                 alert(errorThrown); 
             } 
			/*
			error: function(){
				alert("error");
				closeLoader();
			}
			*/,
			complete: function(){
				closeLoader();
			}
		});
	}	
	,exportFileData: function(){
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayFileListHandler&method=downloadFile";
		 location.href = url;
	}
	/**
	 * 描述: 导入action
	 */
	,importAction: function() {
		this.doImportData('',null,'HolidayFile');
	},
	// 批量赋值
	addBatchValAction : function(){
		var _self = this;
		var pageUipk="com.kingdee.eas.hr.ats.app.HolidayFile.list";
		_self.addValsPublicAction(pageUipk);
	},
	initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
	    $('#holidayFileList').click(function(){ 
			that.pageStep = 0;
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayFile.list'
		    });	
		});
		$('#disHolidayFileList').click(function(){  
			that.pageStep = 1;
			that.changePageLabelColor();
			that.reloadPage({
			//uipk: 'com.kingdee.eas.hr.ats.app.HolidayFileDisPersonView.list'
//			  uipk: 'com.kingdee.eas.hr.ats.app.HolidayFileDisPersonViewV2.list'
				uipk: 'com.kingdee.eas.hr.ats.app.NoHolidayFile.list'
		    });	
		});
		
		$('#lackHolidayFileInfo').click(function(){  
			that.pageStep = 2;
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.LackHolidayFileInfoList'
		    });	
		});
	},
    changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.pageStep).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.pageStep).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
	},
	//删除当前版本
	deleteCurrentAction:function(){
			var clz = this;
		shr.showConfirm(jsBizMultLan.atsManager_holidayFileList_i18n_16, function(){
			var $grid = $(clz.gridId);
			var selectedIds = $grid.jqGrid("getSelectedRows");
			if (selectedIds.length > 0) {
				var bills ;
				for (var i = 0, length = selectedIds.length; i < length; i++) {
					if(bills){
						bills = bills+','+selectedIds[i];
					}else{
						bills = selectedIds[i];
					}
				}
				clz.remoteCall({
						type:"post",
						async: true,
						method:"deleteCurrent",
						param:{billId:bills},
						success:function(data){
							shr.showInfo({message:data.res, hideAfter:10});
							if(data.allDelete==1){
								window.location.reload();
							}
						}
				});
			}else{
				shr.showInfo({message: jsBizMultLan.atsManager_holidayFileList_i18n_17, hideAfter: 3});
				return;
			}
		});
		
		
	}
	,getPersonChangeTabNum : function(){
		 var _self = this;
		 var serviceId = shr.getUrlRequestParam("serviceId");
		 var uipk = "com.kingdee.eas.hr.ats.app.NoHolidayFile.list";
		 var url = shr.getContextPath() + "/dynamic.do?uipk="+uipk+"&method=getPersonChangeTabNum";
		 url += '&serviceId='+encodeURIComponent(serviceId);
		 shr.ajax({
				type:"post",
				async:true,
				data:{longNumber:$("#treeNavigation").shrGridNavigation('getValue').longNumber},
				url:url,
				success:function(res){
					$("#disHolidayFileList").html($("#disHolidayFileList").html()+"("+res.tab1Num+")");
			    }
		 });
	}
	/*,	
	*//**
	 * 获取查询字段
	*//*
	getSelector: function() {
		var column =[];
		column.push('id,proposer.number,proposer.name, attendanceNum, isAttendance,adminOrgUnit.id,');
		column.push('adminOrgUnit.displayName,position.id, holidayPolicySet.name,');
		column.push('position.name,proposer.employeeType.name,attendFileState');
		return column.join();
	}*/
});