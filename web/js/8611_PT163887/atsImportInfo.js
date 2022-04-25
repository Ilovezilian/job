var ioModelString ="com.kingdee.eas.hr.ats.app.ScheduleShift";
shr.defineClass("shr.io.AtsImportInfo", shr.framework.Core, {
	initalizeDOM: function() {
		var clz = this, html = "", $con = $("#container");
		shr.io.AtsImportInfo.superClass.initalizeDOM.call(this);
		// 初始化页面内容lis
		html = "<div><text id='ps' style='color:red;'>" 
			+ jsBizMultLan.atsManager_atsImportInfo_i18n_6;
		html += jsBizMultLan.atsManager_atsImportInfo_i18n_0 
			+ "</text></div>";
		html += "<div class='section-title' style='margin-top: 15px;'>" 
			+ jsBizMultLan.atsManager_atsImportInfo_i18n_2 
			+ "</div>";
		html += "<div class='section-content'><input id='file_upload' name='file_upload' type='file' /></div>";
		
		html += "<div class='section-title'>" 
			+ jsBizMultLan.atsManager_atsImportInfo_i18n_3 
			+ "</div>";
		html += "<div id='checkDiv' class='section-content'><span>" 
			+ jsBizMultLan.atsManager_atsImportInfo_i18n_7 
			+ "</span>";
		html += "<div class='progress progress-striped active hide' style='width: 500px;'>";
		html += "<div id='checkBar' class='bar' style='width: 0%;'></div>";
		html += "</div></div>";
		
		html += "<div class='section-title'>" 
			+ jsBizMultLan.atsManager_atsImportInfo_i18n_4 
			+ "</div>";
		html += "<div id='importDataDiv' class='section-content'><span>" 
			+ jsBizMultLan.atsManager_atsImportInfo_i18n_7 
			+ "</span>";
		html += "<div class='progress progress-striped active hide' style='width: 500px;'>";
		html += "<div id='importBar' class='bar' style='width: 0%;'></div>";
		html += "</div></div>";
		
		$con.append(html);
		var cookStr=getJSessionCookie();
		var param = {
					    handler :'com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler',
						method: 'importData',
						JSESSIONID : cookStr
					}
		var uploaderUrl= shr.getContextPath() + shr.dynamicURL + '?' + $.param(param);
		// 初始化上传按钮
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
		 
		$('#error_report').live('click', this.downloadErrorAction);
	},
	
	
	/**
	 * 下载导入模板
	 */
	downloadTempAction: function() {
				
		var url = this.getCommonURL() +"&method=downloadTemplate" ;
		location.href = url;
		
	},
	getCommonURL: function ()
	{
		var name = window.parent.globle_params.name;
		var min = window.parent.globle_params.min;
		var max = window.parent.globle_params.max;
		
		//得到工作日历明细的上下限日期,班次编码和班次名称在班次主表中都是唯一的
	    var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler"
                 + "&name=" + encodeURIComponent(name)  + "&min=" + encodeURIComponent(min) + "&max=" + encodeURIComponent(max);
		//得到人员编号和人员编号
		var personId = window.parent.globle_params.personId;
		var personName = window.parent.globle_params.personName;
		
		if(personId == null || personId == undefined || personId.length < 1){
			
		}
		else{
			url += "&personId=" + encodeURIComponent(personId) + "&personName=" + encodeURIComponent(personName);
		}
		//得到部门名称和部门长编号	
		var orgName = window.parent.globle_params.orgName;
		var longNum =  window.parent.globle_params.longNum;
		
		if(longNum == null || longNum == undefined || longNum.length < 1){
			
		}
		else{
			url += "&orgName=" + encodeURIComponent(orgName) + "&longNum=" + encodeURIComponent(longNum);
		}
		
		var hrOrgUnitId=window.parent.globle_params.hrOrgUnitId;
		url += "&hrOrgUnitId=" + encodeURIComponent(hrOrgUnitId);
		
		return  url;
		
	},
	/**
	 *下载纵向导入模板
	*/
	downloadTempVerticalAction: function(){
		
		var url = this.getCommonURL() +"&method=downloadTempVertical" ;
		location.href = url;
		
	},
	
	/**
	 * 获取加载状态
	 */
	loadStatus: function() {
		var clz = this;
		var statusUrl;
		var param = {
		    handler :'com.kingdee.shr.base.syssetting.web.handler.ImportInfoHandler',
			method: 'loadStatus',
			ioModelString: ioModelString
		}
		var $cBar = $("#checkBar"), $cp = $cBar.parent();
		statusUrl = shr.getContextPath() + shr.dynamicURL + '?' + $.param(param);
			$.post(statusUrl, null, function(data) {
				var d = $.parseJSON(data.data);
				var $cBar = $("#checkBar"), $cp = $cBar.parent();
				$cp.show();  $cp.prev().hide();  $cBar.width(500 * d.check.status).text(parseInt(d.check.status * 100) + "%");//@
				//只有当校验完成的时候，才显示提示信息
				// 校验成功
				if(parseInt(d.check.status) == 1 && d.check.valid == true) {//@
					if($("#checkDiv div.result").length > 0) {
						$("#checkDiv div.result").remove();
					}
					$("#checkDiv").append("<div class='result'>" 
							+ jsBizMultLan.atsManager_atsImportInfo_i18n_10 
							+ "</div>");
					var $iBar = $("#importBar"), $ip = $iBar.parent();
					$ip.show();  $ip.prev().hide();  $iBar.width(500 * (d.import.status)).text(parseInt(d.import.status * 100) + "%");//@
					if(parseInt(d.import.status) == 1 && d.import.valid == true){//@
						if($("#importDataDiv div.result").length == 0){
							$("#importDataDiv").append("<div class='result'>" 
									+ jsBizMultLan.atsManager_atsImportInfo_i18n_1 
									+ "</div>");
							$("button[name='downloadError']").css({"cursor":"default","background":"#D4E0FA"});	
						}
					}
				}
				// 校验失败
				else if(parseInt(d.check.status) == 1 && d.check.valid == false){//@
					if($("#checkDiv div.result").size() == 0) {
						$("#downloadError").addClass("shrbtn-primary");
						$("#checkDiv").append("<div class='result'>" 
								+ jsBizMultLan.atsManager_atsImportInfo_i18n_9 
								+ "<a href='#' id='error_report'>" 
								+ jsBizMultLan.atsManager_atsImportInfo_i18n_8 
								+ "</a></div>");
					}
				}
				if(!d || window.parent.error_path=='undefined') {
					setTimeout(function() {  clz.loadStatus(); }, 100);					
				}
				
				
		});
	},
	
	/**
	 * 下载检查报告
	 */
	downloadErrorAction: function() {
		if(window.parent.error_path!=null && window.parent.error_path!="" && window.parent.error_path != "undefined"){		
		var param = {
		    handler :'com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler',
			method: 'downloadError',
			errorPath: window.parent.error_path
		}
		location.href = shr.getContextPath() + shr.dynamicURL + '?' + $.param(param);
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
			return array[i].trim().substring('JSESSIONID'.length+1);
		}
	}
	return "";
}
