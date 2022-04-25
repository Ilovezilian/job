var error_path;
shr.defineClass("shr.ats.attenceCommonImport", shr.framework.Core, {
		//viewUipk: "",
		//viewModel: "",
		initalizeDOM : function () 
		{
			var clz = this, html = "", $con = $("#container");
			$con.css({"margin-left":"25px"});
			shr.ats.attenceCommonImport.superClass.initalizeDOM.call(this);
			
			viewUipk = $('#importDiv').data("uipk"),
			ioModelString = $('#importDiv').data("viewModel"),
			gridID = $('#importDiv').data("grid") ;
			className = $('#importDiv').data("className") ;
			selfParam = $('#importDiv').data("selfParam");
			// 初始化页面内容lis
			// 初始化页面内容lis
			html = "<div class='section-title' style='margin-top: 15px;'>"
				+ jsBizMultLan.atsManager_attenceCommonImport_i18n_2
				+ "</div>";
			html += '';
			html += "<div class='section-content'><div id='file_upload-button' class='uploadify-button ins-btn' style='height: 30px; line-height: 30px; width: 120px;'><span class='uploadify-button-text'>"
				+ jsBizMultLan.atsManager_attenceCommonImport_i18n_5
				+ "</span></div><p><input id='file_upload'        name='file_upload' type='file' style='opacity: 0;position: absolute;cursor: pointer;margin-top: -32px;margin-left: 0px;height: 30px;line-height: 30px;width: 120px;'/></p><div id='uploadexcelfile'></div></div>";
			
			html += "<div class='section-title'>"
				+ jsBizMultLan.atsManager_attenceCommonImport_i18n_3
				+ "</div>";
			html += "<div id='checkDiv' class='section-content'><span>"
				+ jsBizMultLan.atsManager_attenceCommonImport_i18n_8
				+ "</span>";
			html += "<div class='progress progress-striped active hide' style='width: 500px;'>";
			html += "<div id='checkBar' class='bar' style='width: 0%;'></div>";
			html += "</div></div>";
			
			html += "<div class='section-title'>"
				+ jsBizMultLan.atsManager_attenceCommonImport_i18n_4
				+ "</div>";
			html += "<div id='importDiv' class='section-content'><span>"
				+ jsBizMultLan.atsManager_attenceCommonImport_i18n_8
				+ "</span>";
			html += "<div class='progress progress-striped active hide' style='width: 500px;'>";
			html += "<div id='importBar' class='bar' style='width: 0%;'></div>";
			html += "</div></div>";
			$con.append(html);
			
			var cookStr=getJSessionCookie();
			// 上传路径
			var param = {
						    handler :'com.kingdee.shr.ats.web.formEditImport.AttenceEditFormImportHandler',
							method: 'importData',
							viewUipk: viewUipk,
							ioModelString:ioModelString,
							className : className ,
							isMutilEdit : gridID ,
							selfParam : selfParam ,
							//curIOModelString: ioModelString, 
							//customData: customData,
							//classify:classify,
							JSESSIONID :  cookStr
						}
			var uploaderUrl= shr.getContextPath() + shr.dynamicURL + '?' + $.param(param);
			//每次重新上传，状态重置，防止上一次上传失败导致本次成功，但是进度条无法正常显示的情况
			window.importStatus = 'true';
			// 初始化上传按钮
			var self = this;
			var iframe = false;
			if(self.getBowserInfo().browser == "IE" && parseInt(self.getBowserInfo().version) < 10  ){//@
				iframe = true;
			}
			
			$("#file_upload").fileupload({
            url : uploaderUrl,
            formData : {},
            dataType : "json",
            iframe: iframe,
			acceptFileTypes:  /(\.|\/)(xlsx)$/i,//限制文件类型
			maxNumberOfFiles : 1,//限制文件个数
			maxFileSize: 50000000,//限制文件大小50m
            start : function(e){
                error_path = 'undefined';
		    	var $cBar = $("#checkBar"), $cp = $cBar.parent();
				$cp.hide();  $cp.prev().show();  $cBar.width(0).text("");
				
				var $iBar = $("#importBar"), $ip = $iBar.parent();
				$ip.hide();  $ip.prev().show();  $iBar.width(0).text("");
				
				$("div.result").remove();
				
				// 延迟一会再去加载状态，确保状态被重置
				setTimeout(function() {clz.loadStatus();}, 800);
				jsBinder.beforeUpload.call(this);
				
            },
			/*
			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
                $( '#uploadexcelfile' ).empty().append("<p class = 'attachment-loading'>文件正在上传，请稍后 .. <span class = 'progress'></span></p>");
                $( "#uploadexcelfile span.progress" ).html( progress+"%" );
			},
			*/
            add : function ( e,data ){
				$( '#uploadexcelfile' ).empty();
                var fileType = self._getFileTypeByName(data.originalFiles[0].name);
                if(data.originalFiles[0]['type'] && data.originalFiles[0]['type'].length && !(fileType == '.xlsx') ){
                    shr.showError({ message: jsBizMultLan.atsManager_attenceCommonImport_i18n_7});
                    return;
                }
                if( data.originalFiles.length && data.originalFiles[0]['size'] && data.originalFiles[0]['size'] > 50*1024*1024 ){
                    shr.showError({ message: jsBizMultLan.atsManager_attenceCommonImport_i18n_6 });
                }
                else{
                    data.submit();
                }
            },   
            done : function( e,response ){
				var data = response._response ;	
            	if(data && data.result){
						var resultData = data.result ;
						// var resultData = $.parseJSON(data);
						if (resultData.result == 'success') {
							error_path = resultData.data.errorPath;
							var resultDataRecord = resultData.data.dataList ;
							if(resultDataRecord != undefined)
							{
								var resultLen = resultDataRecord.length;
								grid = resultData.data.gridId ;
								if(grid == undefined)
								{
									grid = clz.getFormGridId();
								}
								var initialRow = $("#"+grid).jqGrid("getGridParam","reccount") + 1;
								for(var i=0; i<resultLen; i++)
								{
									//解决IE11第一进入导入只能导一条的兼容性问题
//									$("#"+grid).jqGrid("addRowData", { data : resultDataRecord[i]});
									$("#"+grid).jqGrid("addRowData", initialRow+i, resultDataRecord[i], "last");
								}	
							}
							//shr.ats.atsTripBillBatchNewEdit.afterUploadSuccess.call(this);
							window.importStatus = 'true';
							jsBinder.afterUploadSuccess.call(this);
							//clz.afterUploadSuccess();
						} else {
							shr.showError({
								hideAfter: null,
								message: resultData.summary 
				            });
							
							window.importStatus = 'fail';
							jsBinder.afterUploadFail.call(this);
						}
		            }
            },
        });
		
			/*
			// 初始化上传按钮
			    swf: "jslib/uploadify/uploadify.swf",		
			    uploader: uploaderUrl ,
			    buttonText: "上传数据文件",
			    buttonClass: "ins-btn",
			    fileTypeDesc: "Excel2003",
			    fileTypeExts: "*.xls;*.xlsx",
				successTimeout : 999999,
			    multi: false,
			    removeCompleted: false,
			    onUploadStart: function() {		
					error_path = 'undefined';
			    	var $cBar = $("#checkBar"), $cp = $cBar.parent();
					$cp.hide();  $cp.prev().show();  $cBar.width(0).text("");
					
					var $iBar = $("#importBar"), $ip = $iBar.parent();
					$ip.hide();  $ip.prev().show();  $iBar.width(0).text("");
					
					$("div.result").remove();
					
					// 延迟一会再去加载状态，确保状态被重置
					setTimeout(function() {clz.loadStatus();}, 800);
					jsBinder.beforeUpload.call(this);
				},
				onUploadSuccess: function(file, data, response) {
					
				    if(data && data.length>0){
						var resultData = $.parseJSON(data);
						if (resultData.result == 'success') {
							error_path = resultData.data.errorPath;
							var resultDataRecord = resultData.data.dataList ;
							if(resultDataRecord != undefined)
							{
								var resultLen = resultDataRecord.length;
								grid = resultData.data.gridId ;
								if(grid == undefined)
								{
									grid = clz.getFormGridId();
								}
								var initialRow = $("#"+grid).jqGrid("getGridParam","reccount") + 1;
								for(var i=0; i<resultLen; i++)
								{
									//解决IE11第一进入导入只能导一条的兼容性问题
//									$("#"+grid).jqGrid("addRowData", { data : resultDataRecord[i]});
									$("#"+grid).jqGrid("addRowData", initialRow+i, resultDataRecord[i], "last");
								}	
							}
							//shr.ats.atsTripBillBatchNewEdit.afterUploadSuccess.call(this);
							window.importStatus = 'true';
							jsBinder.afterUploadSuccess.call(this);
							//clz.afterUploadSuccess();
						} else {
							shr.showError({
								hideAfter: null,
								message: resultData.summary 
				            });
							
							window.importStatus = 'fail';
							jsBinder.afterUploadFail.call(this);
						}
		            }
		            
				},
				onError: function(event, queueID, fileObj) {    
           　			 	window.importStatus = 'fail';
           		}
				
			});
			*/
			$('#error_report').live('click', this.downloadErrorAction);
			
		}
	
	, getBowserInfo : function(){
            var Sys = {};
            var ua = navigator.userAgent.toLowerCase();
            var s;
            (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
            (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
            (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
            (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
            (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
            (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
            
            if (Sys.ie) return { browser : "IE" , version :Sys.ie}; 
            if (Sys.firefox) return { browser : "Firefox" , version :Sys.firefox};
            if (Sys.chrome) return { browser : "Chrome" , version :Sys.chrome };
            if (Sys.opera) return { browser : "Opera" , version :Sys.opera };
            if (Sys.safari) return { browser : "Safari" ,version : Sys.safari };
    },
	_getFileTypeByName : function(filename){
        var _self = this;
        var filename = filename.split(".");
        var fileType = "."+filename[ filename.length - 1 ];
        return fileType;    
    }	  
	/**
	 *  自定义form 节点可以写 
	 */
	,getFormGridId :function(){
	
		return gridID ;
	}
	/**
	 * 下载导入模板
	 */
			
	,downloadTempAction: function() {
			var param = {
					    handler :'com.kingdee.shr.ats.web.formEditImport.AttenceEditFormImportHandler',
						method: 'downloadTemplate',		
						viewUipk: viewUipk,
						ioModelString:ioModelString ,
						className : className ,
						isMutilEdit : gridID ,
						selfParam : 0 
					}
			location.href  = shr.getContextPath() + shr.dynamicURL + '?' + $.param(param);
	},
	
	/**
	 * 获取加载状态
	 */
	loadStatus: function() {
		var clz = this;
		var statusUrl;
		var param = {
		    handler :'com.kingdee.shr.ats.web.formEditImport.AttenceEditFormImportHandler',
			method: 'loadStatus',
			ioModelString: ioModelString ,
			className : className
		}
		statusUrl = shr.getContextPath() + shr.dynamicURL + '?' + $.param(param);
		$.post(statusUrl, null, function(data) {

			var d = $.parseJSON(data.data);
			
			var $cBar = $("#checkBar"), $cp = $cBar.parent();
			$cp.show();  $cp.prev().hide();  $cBar.width(500 * d.check.status).text(parseInt(d.check.status * 100) + "%");//@
			if (window.importStatus == 'fail') {
				return;
			}
			var hasErrorFlag = false;
			if(d.check.status == 1) {
				// 校验成功
				if(d.check.valid) {
					if($("#checkDiv div.result").size() == 0) {
						$("#checkDiv").append("<div class='result'>"
							+ jsBizMultLan.atsManager_attenceCommonImport_i18n_11
							+ "</div>");
					}
					 
					var $iBar = $("#importBar"), $ip = $iBar.parent();
					$ip.show();  $ip.prev().hide();  $iBar.width(500 * d.import.status).text(parseInt(d.import.status * 100) + "%");//@
				}
				// 校验失败
				else {
					if($("#checkDiv div.result").size() == 0) {
						$("#downloadError").addClass("shrbtn-primary");
						$("#checkDiv").append("<div class='result'>"
							+ jsBizMultLan.atsManager_attenceCommonImport_i18n_10
							+ " <a href='#' id='error_report'>"
							+ jsBizMultLan.atsManager_attenceCommonImport_i18n_9
							+ "</a></div>");
						hasErrorFlag = true;
					}
				}
			}
			if(!d || error_path=='undefined') {
				setTimeout(function() {  clz.loadStatus(); }, 300);					
			}else{
				if((error_path!=null && error_path !="")){
					if(hasErrorFlag == false) {
						$("#downloadError").addClass("shrbtn-primary");
						$("#importDiv").append("<div class='result'>"
							+ jsBizMultLan.atsManager_attenceCommonImport_i18n_1
							+ "<a href='#' id='error_report'>"
							+ jsBizMultLan.atsManager_attenceCommonImport_i18n_9
							+ "</a></div>");
					}
				}else{
					$("#container #importDiv").append("<div class='result'>"
						+ jsBizMultLan.atsManager_attenceCommonImport_i18n_0
						+ "</div>");
					$("button[name='downloadError']").css({"cursor":"default","background":"#D4E0FA"});
				}
			}
		});
	},
	
	/**
	 * 下载检查报告
	 */
	downloadErrorAction: function() {
		if(error_path!=null && error_path!="" && error_path != "undefined"){		
		var param = {
		    handler :'com.kingdee.shr.ats.web.formEditImport.AttenceEditFormImportHandler',
			method: 'downloadError',
			viewUipk: viewUipk,
			ioModelString:ioModelString,
			className : className ,
			error_path: error_path ? error_path : ""
		}
		location.href = shr.getContextPath() + shr.dynamicURL + '?' + $.param(param);
		}
	}
	
});

function getJSessionCookie() {
	var array = document.cookie.split(";");
	for(var i=0;i<array.length;i++) {
		if(array[i].indexOf("JSESSIONID") >= 0) {
			return array[i].trim().substring('JSESSIONID'.length+1);
		}
	}
	return "";
}
