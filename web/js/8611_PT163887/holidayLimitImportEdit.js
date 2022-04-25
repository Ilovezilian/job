var count= 1112220;
var splitFlag = '=#=';
$(window).load(function(){
	addShiftDetailAction();
	setF7Value();
});
shr.defineClass("shr.ats.ScheduleShiftImportEdit", shr.framework.Core, {
	initalizeDOM:function(){
		shr.ats.ScheduleShiftImportEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		that.processF7ChangeEvent();
	}
	,processF7ChangeEvent : function(){
		var that = this;
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
			   var info = value.current;
			   if(info.longNumber !=null && info.longNumber!=''){ 
			   		var filter = " personDep.longNumber like '"+info.longNumber+"%' ";//因为要加入员工的职业信息，所以现在员工查询结果来自于   员工的职业信息（右）关联的员工
					$("#proposer").shrPromptBox("setFilter",filter);
			   }
			   //如果出现先点击人员的情况，那在点击组织机构的时候，人员清空
			   $("#adminOrgUnit").val(info.name);
			   $("#adminOrgUnit_longNumber").val(info.longNumber);
			}
		});
		//组装F7回调式对话框	 
	    var grid_f7_json = {id:"proposer",name:"proposer"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		var object = $('#proposer');
		grid_f7_json.subWidgetOptions = {
			title:'人员信息',
			uipk:"com.kingdee.eas.hr.ats.app.ExistAttdFilePerson.F7",
			query:"",
			filter:"", 
			domain:"",
			multiselect:true
		};
		object.shrPromptBox(grid_f7_json);
		object.bind("change", function(){
			var info = object.shrPromptBox('getValue');
			var names = [],numbers = [],personIds = [];
			for(var i=0;i<info.length;i++){
				//当名称或者编号或者人员没有主见没有时，代表非法用户，不查询
				var name = info[i]["person.name"];
				var number = info[i]["person.number"];
				var personId = info[i]["person.id"];
				if(personId == null || personId == undefined || personId.length < 1){
					continue;
				}
				else if(name == null || name == undefined || name.length < 1){
					continue;
				}
				else if(number == null || number == undefined ||number.length < 1){
					continue;
				}
				else{
					names.push(name);
					numbers.push(number);
					personIds.push(personId);
				}
			}
			$('#proposer').val(names.join(','));
			$('#proposer_id').val(personIds.join(','));
			$('#proposer_number').val(numbers.join(','));//@
			
		});
		
	}
	,generateTemplateExeclAction:function(){
		
		var that = this;
		//在生成模板之前先校验数据
		if(!that.validate()){
			return;
		}
		//得到工作日历明细的上下限日期
		var min = atsMlUtile.getFieldOriginalValue('beginDate');
		var max = atsMlUtile.getFieldOriginalValue('endDate');
		//班次编码和班次名称在班次主表中都是唯一的
		var name = "";
		$('input[name^="shiftName"]').each(function(i,temp) {
	 	      name += $(temp).val() + splitFlag;
	 	});
	    var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=generateExecl"
                 + "&name=" + encodeURIComponent(name) + "&min=" + encodeURIComponent(min) + "&max="+ encodeURIComponent(max);
	             

		//得到人员编号和人员编号
		var personId = $('#proposer_number').val();//@
		var personName = $('#proposer').val();
		if(personId == null || personId == undefined || personId.length < 1){
			
		}
		else{
			url += "&personId=" + encodeURIComponent(personId) + "&personName=" + encodeURIComponent(personName);
		}
		//得到人员名称
		//var personName = $('#proposer').val();
		//得到部门名称和部门长编号	
		var orgName = $('#adminOrgUnit').val();
		var longNum =  $("#adminOrgUnit_longNumber").val();
		
		if(longNum == null || longNum == undefined || longNum.length < 1){
			
		}
		else{
			url += "&orgName=" + encodeURIComponent(orgName) + "&longNum=" + encodeURIComponent(longNum);
		}
		location.href = url;
		
	 	/*
	 	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=generateTemplateExecl";
	    url += "&personId=" +encodeURIComponent(personId) + "&personNumber=" +encodeURIComponent(personNumber) + "&personName=" + encodeURIComponent(personName);
	    url += "&adminOrgUnitName=" + encodeURIComponent(adminOrgUnitName) + "&name=" + encodeURIComponent(name) + "&minAttendDate=" + encodeURIComponent(minAttendDate) + "&maxAttendDate="+ encodeURIComponent(maxAttendDate);
	    location.href = url;
	    */
	 
	    
	}
	,validate: function() {
		//1：校验数据的非空性
		//--起始日期不能为空
		var beginDate = atsMlUtile.getFieldOriginalValue('beginDate');
		if(beginDate == '' || beginDate == undefined){
			shr.showWarning({
			  message: '起始日期不能为空!'
		    });
			return ;
		}
		//--结束日期不能为空
		var endDate = atsMlUtile.getFieldOriginalValue('endDate');
		if(endDate == '' || endDate == undefined){
			shr.showWarning({
			  message: '结束日期不能为空!'
		    });
			return false;
		}
		//--班次名称
		var shiftName = $('#appendShiftDetail input[name="1112220"]').val()
		if(shiftName == '' || shiftName == undefined){
			shr.showWarning({
			  message: '第一行班次名称不能为空!'
		    });
			return false;
		}
		//2:逻辑性校验
		if(beginDate > endDate){
			shr.showWarning({
			  message: '起始日期不能大于结束日期!'
		    });
			return false;
		}
		return true;
	}
	,importScheduleShiftAction:function(){
		var  that = this;
		var  importHTML= ''
			+ '<div id="photoCtrl">' 
			+	'<p>'
			+ '排班数据引入说明'
			+ '</p>'
			+	'<div class="photoState">'
			+ '1. 上传文件不能修改模板文件的格式'
			+ '</div>'
			//+	'<div class="photoState">2. 引入文件中【日期类型】【班次名称】</div>'
			+	'<div class="photoState">'
			+ '2. 支持上传文件格式为xls,xlsx的excel文件'
			+ '</div>'
			+   '<br>'
			+ 	'<p>'
			+ '请选择所需要的操作'
			+ '</p>'
			+ 	'<div class="photoCtrlBox">'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked ></span></div>'
			+       '<div class="photoCtrlUpload"><span>'
			+ '请选择上传文件'
			+ '</span></div>'
			+		'<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			+ 		'<div style="clear:both"><span style="color:red;display:none" id="file_warring">'
			+ '未选择上传文件'
			+ '</span></div>'
			+	    '</div>'
			+           '<input type="hidden" name="fileName" id="fileName">'
			+       '</div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+ '</div>';
		$(document.body).append(importHTML);
		$('#importRadio').shrRadio();
		// 初始化上传按钮
		var data = {
			method: "uploadFile" 
		};
			
		data = $.extend(that.prepareParam(), data);
		var url = that.dynamicPage_url + "?method=uploadFile&uipk="+data.uipk;
		url += "&" + getJSessionCookie();
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
			title: '导入排班数据',
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
				text: '确认',
				click: function() {
					if(handleFlag){
						that.importFileData();
						$(this).dialog( "close" );
						$('#photoCtrl').remove();
					}
					else{
						$('#file_warring').show();
					}
				}
			},{
				text: '关闭',
				click: function() {
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=deleteFile";
					$.ajax({
						url: url
					})
					$(this).dialog( "close" );
					$('#photoCtrl').remove();
				}
			}]
		});
	},importFileData: function(){
		
		//alert("读取服务器目录文件 解析");
		var that=this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=importFileData";
		$.ajax({
			url: url,
			beforeSend: function(){
				openLoader(1);
			},
			success: function(msg){
				closeLoader();
				var tip="";
     			//if (msg.errorNum == undefined || msg.errorNum == 0) {//导入方案出错： 导入方案不存在对应的列名、数据文件第一行不是列名行（例如空行）
				if(true) {
					//alert(JSON.stringify(msg));
					tip ='排班数据导入完毕'+ "<br/>";
					tip = tip +  shr.formatMsg(' 导入的文件中共{0}条记录',[msg.totalNum]) + "<br/>" ;
					tip = tip +  shr.formatMsg(' 新生成的记录有{0}条', [msg.successNum]) + "<br/>" ;
					tip = tip +  shr.formatMsg(' 已更新的记录有{0}条',[msg.existsNum]) + "<br/>" ;
					if (msg.errorNum > 0) {
						tip = tip +  shr.formatMsg(' 导入失败{0}条', [msg.errorNum]) + "<br/>" ;
						tip = tip +  '导入失败的原因如下：' + "<br/>" ;
						if (msg.personErrorNum > 0) {
							tip = tip +  shr.formatMsg('  人员不存在的有{0}条', [msg.personErrorNum]) + "<br/>" ;
						}
						if (msg.dateErrorNum > 0) {
							tip = tip +  shr.formatMsg('  考勤日期格式错误的记录有{0}条', [msg.dayTypeErrorNum]) + "<br/>" ;
						}
						if (msg.dayTypeErrorNum > 0) {
							tip = tip +  shr.formatMsg('  日期类型不存在的记录有{0}条', [msg.dayTypeErrorNum]) + "<br/>" ;
						}
						if(msg.shiftErrorNum > 0){
							tip = tip +  shr.formatMsg('  班次名称不存在的有{0}条', [msg.shiftErrorNum])+ "<br/>" ;
						}
					    if(msg.attenceErrorNum > 0){
							tip = tip +  shr.formatMsg('  考勤制度系统中不匹配的有{0}条', [msg.attenceErrorNum]) + "<br/>" ;
						}
						if(msg.holidayErrorNum > 0){
							tip = tip +  shr.formatMsg('  假期制度系统中不匹配的有{0}条', [msg.holidayErrorNum]) + "<br/>" ;
						}
						if(msg.ruleErrorNum > 0){
							tip = tip +  shr.formatMsg('  取卡规则系统中不匹配的有{0}条', [msg.ruleErrorNum]) + "<br/>" ;
						}
						if(msg.noAttendNum > 0){
							tip = tip +  shr.formatMsg(' 由于打卡考勤不用生成排班的记录有{0}条', [msg.noAttendNum]) + "<br/>" ;
							tip = tip + msg.strBuffer; 
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
				$('#photoCtrl').remove();
				/*that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.ScheduleShift.list'
				});	
				*/
			},
			error: function(){
				closeLoader();
			},
			complete: function(){
				closeLoader();
			}
		});
	}
});
/*
 * author:chenwei
 * function :找出默认设置的班次：系统中含有一个：
 */
function setF7Value(){
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=getDefaultShift";
		$.ajax({
			url: url,
			dataType:'json',
			type: "POST",
			cache:false,
			success: function(msg){
				
				 $('#appendShiftDetail input[name="' + count + '"]').val('(' + msg.number + ')' + msg.name);
				 $('#appendShiftDetail input[name="shiftName' + count + '"]').val(msg.name);
				 $('#appendShiftDetail input[name="attendDate' + count + '"]').val(msg.workTime);
			}
		})
}
/*
 * author:chenwei
 * function : 动态拼成html
 */
function addShiftDetailAction(){
		 var row_fields_work = "";
		 row_fields_work = ""

			+ '<div id="__' + count + '" class="row-fluid row-block"><div><input name = "shiftName' + count + '" type="hidden"/></div>'
			+ '<div id="import_tooldiv' + count + '" class="row-fluid row-block "> '
			+ '	 <div class="span12 offset0 "> '
			+ '		<span class="" style="float:right">'
			+ '			<button onclick="" class="shrbtn-primary shrbtn" id="addNew' + count + '" type="button">'
			 + '新增'
			 + '</button>'
			+ '			<button onclick="" class="shrbtn-primary shrbtn" id="delete' + count + '"  type="button">'
			 + '删除'
			 + '</button> '
			+ '		</span>'
			+ '	 </div>'
			+ '</div> '
			+ '<div data-ctrlrole="labelContainer">'
			+ '	 <div class="span2"><div class="field_label">'
			 + '上下班时间'
			 + '</div></div>'
			+ '  <div class="span3 field-ctrl">'
			+ ' 	<div class="ui-promptBox-frame disabled">'
			+ ' 		<div class="ui-promptBox-layout">'
			+ ' 			<div class="ui-promptBox-inputframe" style="display: block;">'
			+ 					'<input id="attendDate' + count + '" type="text" name="attendDate' + count + '" class="block-father input-height"  placeholder=""  validate="{required:true}"/>'
			+ '  </div></div></div></div>'
			+ '	 <div class="span1 field-desc"></div>'
			+ '</div>'
			+ '<div data-ctrlrole="labelContainer"> '
			+ '	 <div class="span2"><span class="field_label">'
			 + '班次名称'
			 + '</span></div>'
			+ '  <div class="span3 field-ctrl">'
			+ '		<input id="' + count + '" type="text" name="' + count + '" class="block-father input-height"  placeholder="""/>'
			+ '  </div>'
			+ '	 <div class="span1 field-desc"></div>'
			+ '</div>'
			 + '</div> ';
	   	 	
	   	     $('#appendShiftDetail').append(row_fields_work);
	   	     
	   		 $('div[id^=import_tooldiv] span').hide();
	   		 //删除第一行的删除按钮
	   		 $('#delete1112220').remove();
	   		 
 			 $('#__' + count).mouseover(function(){
 				$('div[id=import_tooldiv' + getCountValue(this['id']) + '] span').show();
 			 });
 			 
			 $('#__' + count).mouseleave(function(){
 			 	$('div[id=import_tooldiv' + getCountValue(this['id']) + '] span').hide();
			 });
			 
			$('#addNew' + count).live('click',function(){
				count ++;
				addShiftDetailAction();
			});
			
			$('#delete' + count).live('click',function(){
				deleteShiftDetailAction(this['id']);
			});
		
	   	//组装F7回调式对话框	 
	    var grid_f7_json = {id:"shiftName' + count + '",name:"shiftName' + count + '"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		
		grid_f7_json.subWidgetOptions = {title:'班次名称',uipk:"com.kingdee.eas.hr.ats.app.AtsShift.F7",query:""};
		
		var object = $('#appendShiftDetail input[name="' + count + '"]');
		object.shrPromptBox(grid_f7_json);
		
       //由于在获取F7选择的信息时，要查出对应的班次明细表，所以绑定事件
		object.bind("change", function(){
					var info = object.shrPromptBox('getValue');
					if(!filterF7Value(info.name)){
						shr.showWarning({ message: '班次信息已选'});
						object.val('');
						return;
					}
					else{
					var countValue = this['name'];
			        var attendDate = $('#appendShiftDetail input[name="attendDate' + countValue + '"]');
			        //var defaultShift = $('#appendShiftDetail input[name="defaultShift' + countValue + '"]');
			        var shiftName = $('#appendShiftDetail input[name="shiftName' + countValue + '"]');
  	
  					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=getShiftItemsInfo";
  				    $.ajax({
					url: url,
					type:'post',
					data: {
						shiftItemId: info.id
					},
					dataType:'json',
					cache: false,
					success:function(res){
						attendDate.val(res.workTime);
						shiftName.val(info.name);
						object.val('(' + info.number + ')' + info.name);
					}
					});
  					}
		});
	}
function filterF7Value(name){
	var flag = true;
	$('input[name^="shiftName"]').each(function(i,temp) {
		if($(temp).val().trim() == name.trim()){
			flag = false
		}
	 });
	 return flag;
}

function deleteShiftDetailAction(id){
    //delete + 数字
	id = id.substring(6,id.length);
	$('#shiftName' + id).val('');
	$('#'+ id).val();
	$('#__' + id).remove();
}

function getCountValue(countValue){
	//id + 数字
 	return countValue.substring(2,countValue.length);
}

function addPerson(){
		$("#iframe1").attr("src",shr.getContextPath()+'/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.emp.app.MultiPersonPosition');
		var _iframe1 = $("#iframe1").dialog({
	 		 modal: true,
	 		 width:850,
	 		 minWidth:850,
	 		 height:500,
	 		 minHeight:500,
	 		 title:'人员信息',
	 		 buttons:[{
					text: '确定',
					click: function() {
						var objects = _iframe1.contents().find('input[type=checkbox]:checked');
						var len =  objects.length;
						if(len < 1){
							 shr.showWarning({message: '请先选择数据!'});
							 return ;
						}
						else{
							for(var i =0 ;i<len;i++){
								alert(objects[i].attr('name'));
							}
						}
					}
				}],
	 		 open: function( event, ui ) {
	 		     
	 		 },
	 		 beforeClose:function(){
	 		 }
		});

    	$("#iframe1").attr("style","width:850px;height:500px;");
}
