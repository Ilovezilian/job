shr.defineClass("shr.ats.AttendanceFileList", shr.ats.lackAttendanceFileInfoEdit, {
    pageStep: 0,
	initalizeDOM : function () {
		shr.ats.AttendanceFileList.superClass.initalizeDOM.call(this);
		var that = this;
		that.divDialog();
		that.initTabPages();
		that.getPersonChangeTabNum();
		if(!this.showTimeZone()){
			$("#timeZoneInfo").hide();
		}
	}
	
	,showTimeZone:function(){
		var showEle = $("#isSysEnableMlTimeZone");
		return !showEle.length || showEle.val() == "true" && showEle.data("hidden") !== true;
	}
	,batchMaintainAction: function() {
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		var personIds='';
		if (selectedIds.length <= 0) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_35, hideAfter: 3});
			return;
		}
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileBatchMaintain.list'
		});			
	}, 
	viewAction: function(billId) {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileView.form',
			billId: billId,
			method: 'view' 
		});		
	}, 
	
	timeZoneInfoAction: function(){
		var self = this;
		var selectIds  = self.getSelectedFields("person.id");
		if(!selectIds || selectIds.length == 0){
			shr.showError({message : "请勾选要查看时区的员工的档案",hideAfter: 5});
			return;
		}
		sessionStorage.setItem("hr.base.timeZone.perons",selectIds.join(","));
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.base.app.HRTimeZone.list',
			billId : ''
		});	
	},

	viewHistoryAction:function()
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
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_35, hideAfter: 3});
			return;
		}
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.AttendanceFileHIS.list',
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
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_27210417_i18n_0
                        , hideAfter: 3});
					return;
				}
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
				
			}
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_30, hideAfter: 3});
			return;
		}
		
		clz.remoteCall({method: "enableFile", param: {billId:bills}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_28, hideAfter: 3});
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
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_7, hideAfter: 3});
					return;
				}
			}
			shr.ats.AttendanceFileList.superClass.deleteAction.call(this);
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_30, hideAfter: 3});
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
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_8, hideAfter: 3});
					return;
				}
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
					bills = selectedIds[i];
				}
				
			}
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_31, hideAfter: 3});
			return;
		}
		
			//禁用考勤档案，此日期以后的所有排班记录要删除，给出提示
		var curDate = new Date();
		var curDateY = curDate.getFullYear();
		var curDateD = curDate.getDate();
		curDateD = curDateD<10?"0"+curDateD : curDateD;
		var curDateStr = curDateY + jsBizMultLan.atsManager_attendanceFileList_i18n_23
			+ $.shrI18n.dateI18n.month2[curDate.getMonth()]
			+ curDateD + jsBizMultLan.atsManager_attendanceFileList_i18n_38;
		
		
		
		shr.showConfirm(shr.formatMsg(jsBizMultLan.atsManager_attendanceFileList_i18n_47,[curDateStr]), function(){
			clz.remoteCall({method: "disableFile", param: {billId:bills}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_14, hideAfter: 3});
			//clz.reloadPage();
			window.location.reload();
			}});
		});
		
	},
	
	disAttendanceFilePersonAction:function(){	
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonView.list'
			//billId: "",
			//method: 'disAttendanceFilePerson'
		});	
	},
	
	//查看员工变动	
	viewPersonChangeAction:function(){
		this.reloadPage({
			uipk: 'com.kingdee.shr.base.bizmanage.app.PersonBURelaConfirm.list'
			//billId: "",
			//method: 'disAttendanceFilePerson'
		});	
	},
	
	matchPunchCardRecordAction: function(){
		var _self = this;
		var $grid = $(_self.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length <= 0) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_30, hideAfter: 3});
			return;
		}
		
		$('#matchCtrl').dialog({
			title: jsBizMultLan.atsManager_attendanceFileList_i18n_32,
			width: 750,
			height: 250,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'center',
				of: window
			},
			buttons: [{
				text: jsBizMultLan.atsManager_attendanceFileList_i18n_37,
				click:function() {
					if(_self.verifyDiv()){
						_self.matchPunchCardRecord();
					}else{
						shr.showError({message: jsBizMultLan.atsManager_attendanceFileList_i18n_18, hideAfter: 3});
					}
				}
			},{
				text: jsBizMultLan.atsManager_attendanceFileList_i18n_36,
				click: function() {
					$('#matchCtrl').dialog( "close" );
				}
			}]
		});
	},
	
	divDialog:function(){
	var matchDiv = ''
			+ '<div id="matchCtrl" style="display: none;">' 
			+	'<p> </p>'
			+	'<p> </p>'
			+	'<p> </p>'
			+ '<div class="row-fluid row-block " id="">'
			+ '<div data-ctrlrole="labelContainer">'
			+ '<div class="span2">'
			+ '<div class="field_label" title="'
		+ jsBizMultLan.atsManager_attendanceFileList_i18n_17
		+ '">'
		+ jsBizMultLan.atsManager_attendanceFileList_i18n_17
		+ '</div>'
			+ '</div>'
			+ '<div class="span3 field-ctrl">'
			+ '<input id="beginDate" name="beginDate" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker">'
			
			+ '</div>'
			+ '<div class="span1 field-desc">'
			+ '</div>'
			+ '</div>'
			+ '<div data-ctrlrole="labelContainer">'
			+ '<div class="span2">'
			+ '<div class="field_label" title="'
		+ jsBizMultLan.atsManager_attendanceFileList_i18n_13
		+ '">'
		+ jsBizMultLan.atsManager_attendanceFileList_i18n_13
		+ '</div>'
			+ '</div>'
			+ '<div class="span3 field-ctrl">'
			+ '<input id="endDate" name="endDate" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker">'
			+ '</div>'
			+ '<div class="span1 field-desc">'
			+ '</div>'
			+ '</div>'
			+ '</div>'
			
			+ '</div>';
			
		$(document.body).append(matchDiv);
		
		$('#beginDate').shrDateTimePicker({//@
			id: "beginDate",
			tagClass: 'block-father input-height',
			readonly: '',
			yearRange: '',
			ctrlType: "Date",
			isAutoTimeZoneTrans:false,
			validate: '{dateISO:true,required:true}'
		});	
	
		$('#endDate').shrDateTimePicker({//@
			id:"endDate",
			tagClass:'block-father input-height',
			readonly:'',
			yearRange:'',
			ctrlType: "Date",
			isAutoTimeZoneTrans:false,
			validate:'{dateISO:true,required:true}'
		});
	},
	
	verifyDiv: function() {
		if(atsMlUtile.getFieldOriginalValue('beginDate')==null ||atsMlUtile.getFieldOriginalValue('beginDate')== ''){
			//shr.showInfo({message: "开始时间不能为空!!", hideAfter: 3});
			return false;
		}
		if(atsMlUtile.getFieldOriginalValue('endDate')==null || atsMlUtile.getFieldOriginalValue('endDate')==''){
			//shr.showInfo({message: "结束时间不能为空!!", hideAfter: 3});
			return false;
		}
		
		return true;
	},
	
	matchPunchCardRecord: function() {
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var attendanceNums ;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var attendanceNum = $grid.jqGrid("getCell", selectedIds[i], "attendanceNum");
				if(attendanceNums){
					attendanceNums = attendanceNums+','+attendanceNum;
				}else{
					attendanceNums = attendanceNum;
				}
				
			}
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_31, hideAfter: 3});
			return;
		}
		
		
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		
		
		clz.remoteCall({method: "matchPunchCardRecord", param: {attendanceNums:attendanceNums,beginDate:beginDate,endDate:endDate}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_26, hideAfter: 3});
			clz.reloadPage();
		}});
	}	
	,importDataAction:function(){
		var  that = this;
		var  importHTML= ''
			+ '<div id="photoCtrl">' 
			+	'<p>'
			+ jsBizMultLan.atsManager_attendanceFileList_i18n_22
			+ '</p>'
			+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_attendanceFileList_i18n_2
			+ '</div>'
			+	'<div class="photoState">'
			+ jsBizMultLan.atsManager_attendanceFileList_i18n_3
			+ '</div>'
			+   '<br>'
			+ 	'<p>'
			+ jsBizMultLan.atsManager_attendanceFileList_i18n_34
			+ '</p>'
			+ 	'<div class="photoCtrlBox">'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked ></span></div>'
			+       '<div class="photoCtrlUpload"><span>'
			+ jsBizMultLan.atsManager_attendanceFileList_i18n_33
			+ '</span></div>'
			+		'<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			+ 		'<div style="clear:both"><span style="color:red;display:none" id="file_warring">'
			+ jsBizMultLan.atsManager_attendanceFileList_i18n_43
			+ '</span></div>'
			+       '<br>'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="exportRadio" ></div>'
			+       '<div class="photoCtrlUpload"><span>'
			+ jsBizMultLan.atsManager_attendanceFileList_i18n_20
			+ ' </span></div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+ '</div>';
		$(document.body).append(importHTML);
	    // 初始化上传按钮
		$('#importRadio').shrRadio();
		$('#exportRadio').shrRadio();
	
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=uploadFile";
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
			title: jsBizMultLan.atsManager_attendanceFileList_i18n_21,
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
				text: jsBizMultLan.atsManager_attendanceFileList_i18n_37,
				click: function() {
					if($('#exportRadio').shrRadio('isSelected')){
						that.exportFileData();
					}
					else if($('#importRadio').shrRadio('isSelected')){
						if(handleFlag){
							that.importFileData();
							$(this).dialog( "close" );
							$('#photoCtrl').remove();
							//window.location.reload();
						}
						else{
							$('#file_warring').show();
						}
					}
				}
			},{
				text: jsBizMultLan.atsManager_attendanceFileList_i18n_12,
				click: function() {
					//var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=deleteFile";
					//$.ajax({
					//	url: url
					//})
					$(this).dialog( "close" );
					$('#photoCtrl').remove();
				}
			}]
		});
	},importFileData: function(){
		//alert("读取服务器目录文件 解析");
		var that=this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=importFileData";
		$.ajax({
			url: url,
			beforeSend: function(){
				openLoader(1);
			},
			success: function(msg){
				closeLoader();
				var tip="";
					tip =jsBizMultLan.atsManager_attendanceFileList_i18n_19+"<br/>";
					tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_attendanceFileList_i18n_1,[msg.totalNum])+ "<br/>";
					tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_attendanceFileList_i18n_0,[msg.successNum]);
					tip = tip + shr.formatMsg(jsBizMultLan.atsManager_attendanceFileList_i18n_27,[msg.newNum]);
					tip = tip + shr.formatMsg(jsBizMultLan.atsManager_attendanceFileList_i18n_11,[msg.updateNum])+"<br/>";
					
					if (msg.errorNum > 0) {
						tip = tip +  shr.formatMsg(jsBizMultLan.atsManager_attendanceFileList_i18n_10,[msg.errorNum])+"<br/>" ;
						/*
						if (msg.personError > 0) {
							tip = tip +  "  人员不存在的有" + msg.personError + "条<br/>" ;
						}
						if(msg.numError > 0){
							tip = tip +  "  考勤编号为空的有" + msg.numError + "条<br/>" ;
						}
						if (msg.repeatNum > 0) {
							tip = tip +  "  考勤编号在考勤档案中已存在的有" + msg.repeatNum + "条<br/>" ;
						}
						if (msg.isAttendanceError > 0) {
							tip = tip +  "  打卡考勤出错的有" + msg.isAttendanceError + "条<br/>" ;
						}
					    if(msg.attendancePolicyError > 0){
							tip = tip +  "  考勤制度出错的有" + msg.attendancePolicyError + "条<br/>" ;
						}
						if(msg.holidayError > 0){
							tip = tip +  "  假期制度出错的有" + msg.holidayError + "条<br/>" ;
						}
						if(msg.atsShiftError > 0){
							tip = tip + "   默认班次出错的有" +　msg.atsShiftError + "条<br/>" ;
						}
						*/
						if(msg.errorStr != "" && msg.errorStr.length > 0){
							tip =  tip + msg.errorStr;
						}
						if (msg.tableRepeatNum > 0) {
							tip = tip + shr.formatMsg(jsBizMultLan.atsManager_attendanceFileList_i18n_44, [msg.tableRepeatNum])+"<br/>" ;
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
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=downloadFile";
		 location.href = url;
	}
	/*
	 * 考勤档案中考勤组织和考勤岗位变动检测方法
	 */
	,checkChangeAction:function(){
		var that = this;
		that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileCheck'
		});
	}
	/**
	 * 描述: 导入action
	 */
	,importAction: function(e,t) {//t 0,1
		var that = this;
		that.radioBoxInit();
	},
    initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
	    $('#attendanceFileList').click(function(){ 
			that.pageStep = 0;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFile.list'
		    });	
		});
		$('#disAttendanceFileList').click(function(){  
			that.pageStep = 1;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			//uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonView.list'
//			  uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileDisPersonViewV2.list'
			  uipk: 'com.kingdee.eas.hr.ats.app.NoAttendanceFile.list'

		    });	
		});
		$('#positionChangeList').click(function(){  
		    that.pageStep = 2;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileCheck',
			pageStep: 2
		    });	
		});
		$('#orgChangeList').click(function(){  
		    that.pageStep = 3;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttendanceFileCheck',
			pageStep: 3
		    });	
		});
		
		$('#lackAttendanceFileInfoList').click(function(){  
		    that.pageStep = 4;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.LackAttendanceFileInfoList',
			pageStep: 4
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
 	 
	// 批量赋值
	addValsAction : function(){
	    
	    var pageUipk = "com.kingdee.eas.hr.ats.app.AttendanceFile.list";//考勤档案列表
        var _self = this;
		_self.addValsPublicAction(pageUipk);;
	},
	radioBoxInit : function(t){
		var that = this;
		var type = t==undefined ? 1 : t;
		var customDataObj = {
				type : type
		}
		var customData = JSON.stringify(customDataObj);
		this.doImportData('',customData,'attendanceFile');
		
		var importHTML = '<div id="photoCtrl"><p>'
			+ jsBizMultLan.atsManager_attendanceFileList_i18n_46
			+ '</p><div class="row-fluid row-block ">'
			 + '<div class="col-lg-2"><input type="radio" id="radio-1" name="radio-1-set" style=" display: none; " class="regular-radio"  /><label for="radio-1"></label></div>'
			 + '<div class="col-lg-4 field-ctrl"><div class="field_label"  style=" font-size: 13px !important ; float: left; color: #404040;" title="">'
			+ jsBizMultLan.atsManager_attendanceFileList_i18n_15
			+ '</div></div>'
			 + '<div class="col-lg-2"><input type="radio" id="radio-2" name="radio-1-set" style=" display: none; " class="regular-radio" checked /><label for="radio-2"></label></div>'
			 + '<div class="col-lg-4 field-ctrl"><div class="field_label" style=" font-size: 13px !important ; float: left; color: #404040;" title="">'
			+ jsBizMultLan.atsManager_attendanceFileList_i18n_5
			+ '</div></div>'
			 + '</div>'
			 + '<div class="photoState">'
			 + jsBizMultLan.atsManager_attendanceFileList_i18n_16
			+ '<br>'
			 + jsBizMultLan.atsManager_attendanceFileList_i18n_6
			 + '</div></div>';
		if ($.browser.msie) {  //浏览器为IE的时候， 通过iframe 等方式来填充页面的
	  		setTimeout(function(){
	  			//$('iframe')[1].contentWindow.$('#container').before(importHTML);//S-hr3.0不能这样使用了
				jQuery(window.frames["importFrame"].document).find("#container").before(importHTML);
				var rowBlockClass = $(jQuery(window.frames["importFrame"].document)).find("#workAreaDiv").find(".row-block");
				for(var i=0;i<rowBlockClass.length;i++){
				   $(rowBlockClass[i]).removeClass("row-block");
				}
				$(jQuery(window.frames["importFrame"].document)).find("body").css("line-height", "18px");
				var $radio1 = $(jQuery(window.frames["importFrame"].document)).find("input[id='radio-1']");
				var $radio2 = $(jQuery(window.frames["importFrame"].document)).find("input[id='radio-2']");
				document.getElementById("importFrame").height="700";
				$radio1.css("display","block");
				$radio2.css("display","block");
				$radio1.css("float","right");
				$radio2.css("float","right");
				$radio1.css("margin-right","8px");
				$radio2.css("margin-right","8px");
				$("#importDiv").css("height","700px");
				if(type == 0){
					$radio1.attr("checked","checked");
				}else{
					$radio2.attr("checked","checked");
				}
				$radio1.click(function(){
					if(type == 0){
						return;
					}
					$("#importDiv").remove();
					that.radioBoxInit(0);
				});
				$radio2.click(function(){
					if(type == 1){
						return;
					}
					$("#importDiv").remove();
					that.radioBoxInit(1);
				});
		 	},2500);
	  	}else{  // 通过 div 等方式来填充页面的 
			setTimeout(function(){
		 		$('#container').before(importHTML);
		 		$("button[id^=download]").closest(".row-block").find(".row-block").removeClass("row-block");
		 		$("button[id^=download]").closest(".row-block").removeClass("row-block");
		 		$("#importDiv").css("height","700px");
		 		if(type == 0){
					$("#radio-1").attr("checked","checked");
				}else{
					$("#radio-2").attr("checked","checked");
				}
		 		$("#radio-1").click(function(){
		 			if(type == 0){
						return;
					}
		 			$("#importDiv").remove();
		 			that.radioBoxInit(0);
				});
				$("#radio-2").click(function(){
					if(type == 1){
						return;
					}
					$("#importDiv").remove();
					that.radioBoxInit(1);
				});
		 		
		 	},1000);
		}
	},
	//删除当前版本
	deleteCurrentAction:function(){
		var clz = this;
		shr.showConfirm(jsBizMultLan.atsManager_attendanceFileList_i18n_24, function(){
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
				shr.showInfo({message: jsBizMultLan.atsManager_attendanceFileList_i18n_25, hideAfter: 3});
				return;
			}
		});
	},
	importAttendanceFileAction:function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		var bills ;
		if (selectedIds.length > 0) {
		for (var i = 0, length = selectedIds.length; i < length; i++) {
				if(bills){
					bills = bills+','+selectedIds[i];
				}else{
				
					bills = selectedIds[i];
				}
			}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttendanceFileListHandler&method=getInformation";
			   shr.ajax({
				dataType: "json",
				type:"post",
				async:false,
				data: {
				billId:bills
				},
				url:url,
				success:function(res){
					if(res.user=="true"){
					if(res.attendFileState=="true"){
					if(res.datas=="true"){
					window.location.href="http://shr.renshi100.com/ATS/AttendanceFile.aspx?"+res.SecretKey;
					}else{
					shr.showWarning({"message" : res.errorMessageString});
					}
					}else{
					var message='';
					if(res.attendFileStateList.length>0){
					message=message+jsBizMultLan.atsManager_attendanceFileList_i18n_40+ "<br>";
					for(var i=0;i<res.attendFileStateList.length;i++){
					message=message+res.attendFileStateList[i].attendString;
					if(i<res.attendFileStateList.length-1){
					message=message+'、';
					}
					}
					message=message+'<br>';
					}
					if(res.leftDateList.length>0){
					message=message+jsBizMultLan.atsManager_attendanceFileList_i18n_42+"<br>";
					for(var i=0;i<res.leftDateList.length;i++){
					message=message+res.leftDateList[i].attendString;
					if(i<res.leftDateList.length-1){
					message=message+'、';
					}
					}
					message=message+'<br>';
					}
					if(res.isAttendFileState.length>0){
					message=message+jsBizMultLan.atsManager_attendanceFileList_i18n_41+"<br>";
					for(var i=0;i<res.isAttendFileState.length;i++){
					message=message+res.isAttendFileState[i].attendString;
					if(i<res.isAttendFileState.length-1){
					message=message+'、';
					}
					}
					message=message+'<br>';
					}
					if(res.attendanceNumList.length>0){
					message=message+jsBizMultLan.atsManager_attendanceFileList_i18n_39+ "<br>";
					for(var i=0;i<res.attendanceNumList.length;i++){
					message=message+res.attendanceNumList[i].attendString;
					if(i<res.attendanceNumList.length-1){
					message=message+'、';
					}
					}
					message=message+'<br>';
					}
					shr.showWarning({"message" : message});
					}
					}else{
					shr.showWarning({"message" : jsBizMultLan.atsManager_attendanceFileList_i18n_4});
					}					
				}
			});
		}else{
			shr.showWarning({"message" : jsBizMultLan.atsManager_attendanceFileList_i18n_29});
			return;
		}
	}
	,getPersonChangeTabNum : function(){
		 var _self = this;
		 var serviceId = shr.getUrlRequestParam("serviceId");
		 var uipk = "com.kingdee.eas.hr.ats.app.NoAttendanceFile.list";
		 var url = shr.getContextPath() + "/dynamic.do?uipk="+uipk+"&method=getPersonChangeTabNum";
		 url += '&serviceId='+encodeURIComponent(serviceId);
		 shr.ajax({
				type:"post",
				async:true,
				data:{longNumber:$("#treeNavigation").shrGridNavigation('getValue').longNumber},
				url:url,
				success:function(res){
					$("#disAttendanceFileList").html($("#disAttendanceFileList").html()+"("+res.tab1Num+")");
			    }
		 });
	}
	//在某些环境中，不加过滤字段查不出数据，所以预置一个默认通用的过滤 
	,getCustomFilterItems: function() {
		return " attendFileState in ( '1','2' ) ";
	}
});
