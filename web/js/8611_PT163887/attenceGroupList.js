shr.defineClass("shr.ats.AttenceGroupList", shr.ats.AtsMaintainBasicItemList, {
	initalizeDOM : function () {
		shr.ats.AttenceGroupList.superClass.initalizeDOM.call(this);
	}
	/**
	 * 描述: 导入action
	 */
	,importAction: function() {
		this.oldImportAction();
	}
	/*,deleteAction:function(){		
		var entrys = this.getSelectedIds();
		if (entrys.length > 0) {
			this.deleteRecord(entrys);
		}
	}*/
	/*,getSelectedIds: function() {
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var entrys = [];
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var  id = $grid.jqGrid("getCell", selectedIds[i], "id");
				var  relateOrgUnitId = $grid.jqGrid("getCell", selectedIds[i], "relateOrgUnit.id");
				var  name = $grid.jqGrid("getCell", selectedIds[i], "name");
				var entryBill = {billId:id,relateOrgUnitId : relateOrgUnitId,name:name};
				entrys.push(entryBill);
			}
			if(entrys.length==0){
			   shr.showWarning({
			     message: "请先选择数据!"
		       });
		       return ;
			} 
			return entrys;
	    }
	    else{
			shr.showWarning({
				message: "请先选择数据!"
		       });
		       return ;
	    }
	}*/
/*	,deleteRecord:function(entrys) {
		var _self = this;
		shr.showConfirm('您确认要删除吗？', function(){
			top.Messenger().hideAll();
			
			var data = {
				method: 'delete',
				ids : shr.toJSON(entrys)
			};
			data = $.extend(_self.prepareParam(),data);
			
			shr.doAction({
				url: _self.dynamicPage_url,
				type: 'post', 
					data: data,
					success : function(response) {	
						shr.msgHideAll();
						var options={
							message:response
						};
						$.extend(options, {
							type: 'info',
							hideAfter: null,
							showCloseButton: true
						});
						top.Messenger().post(options);
						_self.reloadGrid();
					}
			});	
		});
	}*/
	//由于出现了新的导入，所以这种旧的格式就屏蔽掉
	/*
	,importDataAction:function(){
		var  that = this;
		var  importHTML= ''
			+ '<div id="photoCtrl">' 
			+	'<p>考勤组数据引入说明</p>'
			+	'<div class="photoState">1. 上传文件不能修改模板文件的格式</div>'
			+	'<div class="photoState">2. 支持上传文件格式为xls,xlsx的excel文件</div>'
			+   '<br>'
			+ 	'<p>请选择所需要的操作</p>'
			+ 	'<div class="photoCtrlBox">'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="importRadio" checked ></span></div>'
			+       '<div class="photoCtrlUpload"><span>请选择上传文件</span></div>'
			+		'<div class="photoCtrlUpload1"><input type="file" name="file_upload" id="file_upload"></div>'
			+ 		'<div style="clear:both"><span style="color:red;display:none" id="file_warring">未选择上传文件</span></div>'
			+       '<br>'
			+		'<div class="photoCtrlRadio"><input type="radio" name="inAndout" id="exportRadio" ></div>'
			+       '<div class="photoCtrlUpload"><span>考勤组数据引入模板下载 </span></div>'
			+		'<div style="clear: both;"></div>'
			+	'</div>'
			+ '</div>';
		$(document.body).append(importHTML);
	    // 初始化上传按钮
		$('#importRadio').shrRadio();
		$('#exportRadio').shrRadio();
	
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttenceGroupListHandler&method=uploadFile";
		//在点击确定前，对文件进行上传处理
		var handleFlag = false;
		   	swf: "jslib/uploadify/uploadify.swf",
		    uploader: url,
		    buttonText: "选择文件",
		    buttonClass: "shrbtn-primary shrbtn-upload",
		    fileTypeDesc: "Excel",
		    fileTypeExts: "*.xls;*.xlsx",
		    async: false,
		    multi: false,
		    removeCompleted: false,
		    onUploadStart: function() {
		    	//openLoader(0); //遮罩层
			},
			onUploadComplete: function(file) {
				handleFlag = true;
				$('#file_warring').hide();
			}
		});

		$('#photoCtrl').dialog({
			title: '考勤组数据引入',
			width: 600,
			height: 450,
			modal: true,
			resizable: false,
			position: {
				my: 'center',
				at: 'top+20%',
				of: window
			},
			buttons: {
		        "确认": function() {
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
		        },
		        "关闭": function() {
		        	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttenceGroupListHandler&method=deleteFile";
		        	$.ajax({
		        		url: url
		        	})
		        	$(this).dialog( "close" );
		        	$('#photoCtrl').remove();
		        }
		    }
		});
	},importFileData: function(){
		//alert("读取服务器目录文件 解析");
		var that=this;
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttenceGroupListHandler&method=importFileData";
		$.ajax({
			url: url,
			beforeSend: function(){
				openLoader(1);
			},
			success: function(msg){
				closeLoader();
				var tip="";
					tip ="考勤组数据导入完毕<br/>";
					tip = tip +  " 导入的文件中共" + msg.totalNum+ "条记录<br/>" ;
					tip = tip +  " 导入成功的记录有" + msg.successNum + "条<br>" ;
					tip = tip +  " 导入失败的数据有" + msg.errorNum + "条：" ;
					if (msg.errorNum > 0) {
						tip = tip +  "导入失败的原因如下：<br/>" ;
						
						if (msg.personErrorNum > 0) {
							tip = tip +  "  人员不合法的有" + msg.personErrorNum + "条<br/>" ;
						}
						if(msg.attenceErrorNum > 0){
							tip = tip +  "  考勤组不合法的有" + msg.attenceErrorNum + "条<br/>" ;
						}
						if (msg.fileRepeatNum > 0) {
							tip = tip +  "  文件记录中重复多余的有" + msg.fileRepeatNum + "条：详细信息如下：<br/>" ;
							tip += fileRepeatError;
						}
						if (msg.dbRepeatNum > 0) {
							tip = tip +  "  文件记录中已存在的有" + msg.dbRepeatNum + "条：详细信息如下：<br/>" ;
							tip += msg.dbRepeatError;
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
			},
			 error: function (XMLHttpRequest, textStatus, errorThrown) { 
                 //alert(errorThrown); 
             },
			complete: function(){
				closeLoader();
			}
		});
	}	
	,exportFileData: function(){
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AttenceGroupListHandler&method=downloadFile";
		 location.href = url;
	}
	*/
});