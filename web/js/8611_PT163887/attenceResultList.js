var attenceDate="201307";
var attenceDay="20130701";
shr.defineClass("shr.ats.AttenceResultList", shr.framework.List, {
	
	initalizeDOM : function () {
		shr.ats.AttenceResultList.superClass.initalizeDOM.call(this);
		//var that = this;
	},
	filter:function(){
		var that = this;
		var array = new Array();
		var filterStr = "";
		var filterStr1;
		var filterStr2;
		var filterStr3;
		var filterStr4;
		var filterStr5;
		var adminOrg_id = $("#adminOrg_el").val();
		var proposer_id = $("#proposer_el").val();
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		var auditOpinion = $("#auditOpinion_el").val();
		if (adminOrg_id != "") {
			filterStr1 =  " adminOrg.id = '"+adminOrg_id+"' "; 
			array.push(filterStr1);
		}
		if (proposer_id != "") {
			filterStr2 = " proposer.id = '"+proposer_id+"' "; 
			array.push(filterStr2);
		}
		if ( beginDate != ""  ) {
			filterStr3 = " attenceDate >= '"+beginDate+"' ";
 			array.push(filterStr3);
		}
		if ( endDate != ""  ) {
			filterStr4 = " attenceDate <= '"+endDate+"' ";
 			array.push(filterStr4);
		}
		for (var i = 0; i < array.length; i++) {
			if (i == array.length-1) {
				filterStr = filterStr + array[i]
			}else{
				filterStr = filterStr + array[i] + "and";
			}
		}
		$("#grid").jqGrid("option", "filterItems", filterStr).jqGrid("reloadGrid");	
	},
	//点击查询按钮执行的方法
	queryAction:function(){
		 var that = this;
		 that.filter();
	},
	
	
	viewAction: function(billId) {
		
	},
	//var _uiClass="com.kingdee.shr.ats.service.GetAttenceResultInfosOsfService";
	testAction: function (even){
 		var that = this;
		shr.callService({
			serviceName : "getAttenceResultInfosOSF",//获取考勤结果集
			param : {
				attenceDate : attenceDate
			},
			async : true,
			success : function (data) {
				//alert(JSON.stringify(data));
			}
		});	 
	},
	testDetailAction: function (even){
 		var that = this;
		shr.callService({
			serviceName : "getAttenceDetailInfoOSF",//获取某一天考勤详细信息
			param : {
				attenceDay : attenceDay
			},
			async : true,
			success : function (data) {
				// alert(JSON.stringify(data));
			}
		});	 
	},
	
	//导入考勤结果导入
	importAttenceResultAction:function(){
		$con = $("#container");
		var  _self = this;
		var  importTripBill = ''
			+ '<div id="photoCtrl">' 
			+	'<p>'
			+ '考勤结果引入引出说明'
			+ '</p>'
			+	'<div class="photoState">'
			+ '1. 引入引出考勤结果匹配依据为员工编码，引入文件必须以对应员工编码命名'
			+ '</div>'
			+	'<div class="photoState">'
			+ '2. 支持引入文件格式为xls、xlsx的excel文件'
			+ '</div>'
			+ 	'<p>'
			+ '请选择所需要的操作'
			+ '</p>'
			+ 	'<div class="photoCtrlBox">'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked></div>'
			+		'<div class="photoCtrlUpload"><span>'
			+ '引入'
			+ '</span><span>'
			+ '请选择上传excel文件'
			+ '</span></div>'
			+		'<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+ 	'<div class="photoCtrlBox"><div id="exportBox"><div class="photoCtrlRadio"><input type="radio" name="inAndout" id="exportRadio"></div><span>'
			+ '引出'
			+ '</span><span>'
			+ '考勤结果模板'
			+ ' </span></div>  <div style="clear: both;"></div></div>'
			+ '</div>';
		//$(document.body).append(importTripBill);
		$con.append(importTripBill);
		$('#importRadio, #exportRadio').shrRadio();
		
		//"/easweb/attenceResultImportFile.do?method=importDataw&" + getJSessionCookie(),
		// 初始化上传按钮
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.file.AtsAttenceResFileHandler&method=importData";
			//url += "&calSchemeId=" + encodeURIComponent($cmpschemeid);
			//url += "&cmpPeriodId=" + encodeURIComponent($cmpperiodid);
			//url += "&calTime=" + encodeURIComponent($calTime);
			url += "&" + getJSessionCookie();
			
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
			title: '考勤结果导入导出向导',
			width: 600,
			height: 450,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+20%',
				of: window
			},
			buttons:[{
				text: '确认',
				click: function() {
					if($('#importRadio').shrRadio('isSelected')){
						shr.showError({message: '未选择导入的文件！'});
					}else if($('#exportRadio').shrRadio('isSelected')){
						 _self.exportAttenceResTemplate();
					}
				}
			},{
				text: '关闭',
				click: function() {
					$(this).dialog( "close" );
					$('#photoCtrl').remove();
				}
			}]
		});
	},
	
	//导出考勤结果excel模板
	exportAttenceResTemplate: function(){
		var test = "";
		var templateId="";
		var tempId = "";
		//shr.getContextPath()+ "/attenceResultImportFile.do?method=downloadTemplate&templateId=" + encodeURIComponent(tempId)
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.file.AtsAttenceResFileHandler&method=downloadTemplate";
			url += "&templateId=" + encodeURIComponent(tempId);
		location.href = url;
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











