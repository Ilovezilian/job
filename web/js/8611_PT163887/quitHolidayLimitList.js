shr.defineClass("shr.ats.QuitHolidayLimitList", shr.framework.List, {
	filter1 : "",
	personNums : [],
	leftDates : [],
	longNum: "",
	initalizeDOM : function () {		
		shr.ats.QuitHolidayLimitList.superClass.initalizeDOM.call(this);
		var _self = this;
		_self.setAdminOrgUnit();//设置默认组织
		_self.initalizeQueryGrid();
		$("#grid").jqGrid('setGridParam',{datatype:"local"});//初始化时页面不加载数据
        _self.initPageStyle();	
		_self.personChange();
		_self.adminOrgUnitChange();
		_self.initButtonTips();
		_self.processF7ChangeEvent();
		//设置人员信息的默认值
		var name = $.getUrlParam('name');
		if(name != null && name != undefined){
			_self.setDefaultValue(name);
		}else{
			 var filter=" adminOrgUnit.longNumber like '"+_self.longNum+"%' ";
			$("#proposer").shrPromptBox("setFilter",filter);
		}
	}
	,initalizeQueryGrid: function() {
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
	,setDefaultValue :function(name){
		//去掉人员和机构的F7
		$('input[name="proposer"]').parent().next().remove();
		$('input[name="adminOrgUnit"]').parent().next().remove();
		var personId = $.getUrlParam('personId');
		//_self.unbind('click');;
		$("#proposer").val(decodeURIComponent(name));
		$('#proposer').attr('disabled',true);
		$('#proposer_el').val(personId);
		var orgName = $.getUrlParam('orgName');
		$('#adminOrgUnit').val(decodeURIComponent(orgName));
		$('#adminOrgUnit').attr('disabled',true);
	}
	,processF7ChangeEvent:function(){
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
			   var info = value.current;
			   if(info!=null && info!=''){
			   if(info.longNumber !=null && info.longNumber!=''){ 
				  var filter=" adminOrgUnit.longNumber like '"+info.longNumber+"%' ";//因为要加入员工的职业信息，所以现在员工查询结果来自于   员工的职业信息（右）关联的员工
				  $("#proposer").shrPromptBox("setFilter",filter);
			   }else{
			   }
			   }
			   $("#proposer").shrPromptBox("setValue",{
					id : "",
					name : ""
			   });
			}
		});
		$("#adminOrgUnit").blur(function(){
			var value =$(this).val();
			if (!value){
				var t = $(this).closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
					$(t).remove();
				}
				$('<label for="entries_reason" generated="true" class="error" style="display: block;">'
					+ jsBizMultLan.atsManager_quitHolidayLimitList_i18n_4
					+ '</label>"').insertAfter($(this).closest('.field-ctrl').children()[0]);
			}
				
		});
		$("#adminOrgUnit").bind('input propertychange', function () {
			//进行相关操作 
			var value = $(this).val();
			if (value) {
				var t = $(this).closest('.field-ctrl').find("label.error");
				$(t).remove();
			} else {
				var t = $(this).closest('.field-ctrl').find("label.error");
				if (t != undefined && t.length != 0) {
					$(t).remove();
				}
				$('<label for="entries_reason" generated="true" class="error" style="display: block;">'
					+ jsBizMultLan.atsManager_quitHolidayLimitList_i18n_4
					+ '</label>"').insertAfter($(this).closest('.field-ctrl').children()[0]);

			}
		});
		$("#adminOrgUnit").change(function(){
			var value =$(this).val();
			if (value){
				var t = $(this).closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
				$(t).remove();
			}
			}
		
		});
		/*
		$("#adminOrgUnit").focus(function(){
			var t = $(this).closest('.field-ctrl').find("label.error");
			if (t !=undefined && t.length!=0){
				$(t).remove();
			}
		});
		*/
		$("#proposer").blur(function(){
			var value =$(this).val();
			if (!value){
				var t = $(this).closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
					$(t).remove();
				}
				$('<label for="entries_reason" generated="true" class="error" style="display: block;">'
					+ jsBizMultLan.atsManager_quitHolidayLimitList_i18n_4
					+ '</label>"').insertAfter($(this).closest('.field-ctrl').children()[0]);
			}
				
		});
	
		$("#proposer").bind('input propertychange', function () {
			//进行相关操作 
			var value = $(this).val();
			if (value) {
				var t = $(this).closest('.field-ctrl').find("label.error");
				$(t).remove();
			} else {
				var t = $(this).closest('.field-ctrl').find("label.error");
				if (t != undefined && t.length != 0) {
					$(t).remove();
				}
				$('<label for="entries_reason" generated="true" class="error" style="display: block;">'
					+ jsBizMultLan.atsManager_quitHolidayLimitList_i18n_4
					+ '</label>"').insertAfter($(this).closest('.field-ctrl').children()[0]);

			}
		});
		$("#proposer").change(function(){
			var value =$(this).val();
			if (value){
				var t = $(this).closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
				$(t).remove();
			}
			}
		
		});
		/*
		$("#proposer").focus(function(){
			var t = $(this).closest('.field-ctrl').find("label.error");
			if (t !=undefined && t.length!=0){
				$(t).remove();
			}
		});
		*/
	}
	,personChange: function(){
		var that = this;
			$("#proposer").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					that.personNums = [];
				    that.leftDates = [];
					if(info != null){ 
						  var length = info.length;
						  for(var i = 0;i< length; i++){
							  var obj = info[i];
							  var leftDate = obj["leftDate"] ? obj["leftDate"] : 'noLeftDate';
							  that.leftDates.push(leftDate); 
							  var personNum = obj["person.number"] ? obj["person.number"] : '';
							  that.personNums.push(personNum);
						  }
						 
					} 		
				}
			});
	},
	adminOrgUnitChange: function(){
		var that = this;
			$("#adminOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					if(info != null){
                         if(info.longNumber){
							  that.longNumber = info.longNumber;
						 }else{
							 //直接输入框输入值的时候，longNumber没有，要重新查询下。
							  that.remoteCall({
								type:"post",
								async: false,
								method:"getAdminOrgUnitById",
								param:{"id" : info.id},
								success:function(res){
									info =  res;
									that.longNum = info.longNumber;
								}
							});
						 }						
						
					} 		
				}
			});
	}
	/**
	 * 查询表格
	 */
	,queryGrid: function() {
		this.setGridTreeParam();
		this.setGridCustomParam();
		
		var $grid = $(this.gridId);
		// selector
		var selector = this.getSelector();
		if (typeof selector !== 'undefined') {
			$grid.setGridParam({ selector: selector	});
		}
		// filter
		var filterItems = this.getFilterItems();
		$grid.jqGrid("option", "filterItems", filterItems);
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
		//$grid.jqGrid('setGridParam', {datatype:'json'});
		// reload
		
		$grid.jqGrid("reloadGrid");	
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
	
	
	,setAdminOrgUnit:function(){
		//设置默认组织
	    var that = this;
	    that.remoteCall({
			type:"post",
			async: false,
			method:"getAdminOrgUnit",
			param:{},
			success:function(res){
				info =  res;
				$('#adminOrgUnit_el').val(info.orgID);
				$('#adminOrgUnit').val(info.orgName);
				that.longNum = info.longNumber;
			}
		});
	}
	
	//重算

	,recalculateAction:function(){	
		var that=this;
		var adminOrgUnit = $("#adminOrgUnit_el").val();
		var proposer = $("#proposer_el").val();
				 var serviceId = shr.getUrlRequestParam("serviceId");
		if(adminOrgUnit && proposer){
					shr.showConfirm("<font color='red'>"
						+ jsBizMultLan.atsManager_quitHolidayLimitList_i18n_12
						+ "</font>", function() {
						openLoader(1,jsBizMultLan.atsManager_quitHolidayLimitList_i18n_14);
						that.remoteCall({		
							method: 'generateHolidayLimit', 
							param: {
								"uipk":"com.kingdee.eas.hr.ats.app.QuitHolidayLimit",
								"proposer":JSON.stringify([$('#proposer').shrPromptBox('getValue')].map(function(value){
									return {personId:value.id,leffdt:value['holidayFileHis.LEFFDT'],name:value.name + '[' + value['person.number'] + ']'}
								})),
								"serviceId": serviceId// 假期类型为年假
							},
							success: function(response) {
								closeLoader();
								top.Messenger().hideAll();
								var data= response||[];
								$("#grid").jqGrid('setGridParam', {
									datatype:'json',
									postData:{'persons':JSON.stringify(data.filter(function(value){
										return !value.errorMsg;
									}))
								}
									
								}).trigger("reloadGrid");
								var errorPerson = data.filter(function(value){
									return value.errorMsg;
								});
								errorPerson.length && top.Messenger().post({
									type: 'info',
									message:"<font color='red'>" + jsBizMultLan.atsManager_quitHolidayLimitList_recalFail + "<br>" +errorPerson.map(function(value){return value.name}).join('<br>')+"</font><br/>",
									hideAfter: 3,
									showCloseButton: true
								});
								!errorPerson.length && top.Messenger().post({
									type: 'info',
									message:jsBizMultLan.atsManager_quitHolidayLimitList_recalSuccess,
									hideAfter: null,
									showCloseButton: true
								});
							}
							,error: function(response) {
							   closeLoader();
							   var options={
								   message:response.responseText
								};
								$.extend(options, {
									type: 'error',
									hideAfter: null,
									showCloseButton: true
								});
								top.Messenger().post(options);
							}
						});
							
					
			});
		}else{
			if(!proposer){
				var t = $("#proposer").closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
					$(t).remove();
				}
				$('<label for="entries_reason" generated="true" class="error" style="display: block;">'
					+ jsBizMultLan.atsManager_quitHolidayLimitList_i18n_4
					+ '</label>"').insertAfter($("#proposer").closest('.field-ctrl').children()[0]);
			}
			if(!adminOrgUnit){
				var t = $("#adminOrgUnit").closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
					$(t).remove();
				}
				$('<label for="entries_reason" generated="true" class="error" style="display: block;">'
					+ jsBizMultLan.atsManager_quitHolidayLimitList_i18n_4
					+ '</label>"').insertAfter($("#adminOrgUnit").closest('.field-ctrl').children()[0]);
			
				
			}
			
			/*	
			shr.showWarning({
						message: '数据校验未通过，请修正后再处理',
						hideAfter: 5
					});
			*/
		}
    	 
	},
	/**
	  *失效假期额度
	  */
	extensionLimitAction : function(){
		var that = this;
		var adminOrgUnit = $("#adminOrgUnit_el").val();
		var proposer = $("#proposer_el").val();
		if(adminOrgUnit && proposer){
			shr.showConfirm("<font color='red'>"
				+ jsBizMultLan.atsManager_quitHolidayLimitList_i18n_12
				+ "</font>", function() {
							openLoader(1,jsBizMultLan.atsManager_quitHolidayLimitList_i18n_15);
							shr.doAjax({
								url: shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitBatchExtensionHandler&method=selectedBatchExtension",
								dataType:'json',
								type: "POST",
								data: {
									"personNums" : that.personNums.join(","),
									"fromPageFlag" : "extensionLimit",
									"adminOrgUnit":that.longNum
								},
								success: function(response){ 
									closeLoader();
									var data= response;
									var hLimitInfoId = data.hLimitInfoId;
									$("#grid").jqGrid('setGridParam', {
										datatype:'json',
										postData:{'hLimitInfoId':hLimitInfoId.join(",")}
									}).trigger("reloadGrid");
									
									var updatedRecord = data.updatedRecord;
									var resFailedList = data.resFailedList;
									var updateFlag = data.updateFlag;
									var personSize = data.personSize;
									var updatedRecord = data.updatedRecord;
									var resFailedList = data.resFailedList;
									var message = shr.formatMsg(jsBizMultLan.atsManager_quitHolidayLimitList_i18n_1, [personSize,updatedRecord]) + "<br/>";
									message += resFailedList;
									if(resFailedList){
										shr.showWarning({message: message});
									}else{
										shr.showInfo({message: message});
									}
								},
								error: function(response) {
								closeLoader();
								},
								complete: function(){
									closeLoader();
								}
						});	
			});
		}else{
					shr.showWarning({
						message: jsBizMultLan.atsManager_quitHolidayLimitList_i18n_11,
						hideAfter: 5
					});
		}
	
	},
	initButtonTips : function(){
		$("#recalculate").attr("title",jsBizMultLan.atsManager_quitHolidayLimitList_i18n_7);
		$("#extensionLimit").attr("title", jsBizMultLan.atsManager_quitHolidayLimitList_i18n_8);
	},
	initPageStyle : function(){
		//$("#adminOrgUnit").parent().css("width","287");
//		var personAtDiv = $("#proposer").closest(".row-fluid");
//		var adminOrgUnitLabel = $("#adminOrgUnit").closest(".field-ctrl").prev();
//		adminOrgUnitLabel.removeClass("col-lg-4");
//		adminOrgUnitLabel.addClass("col-lg-2");
//		$("<div class='col-lg-2'><div "
//			+ "title="+jsBizMultLan.atsManager_quitHolidayLimitList_i18n_13
//			+ " style='padding-left:10px;font-size:14px;color:#000000;'><b>"
//			+ jsBizMultLan.atsManager_quitHolidayLimitList_i18n_13
//			+ "</b></div></div>").insertBefore(adminOrgUnitLabel);
//		$("<hr id='myHr' style='height:1px;border:none;border-top:1px solid #ccc;'/>").insertAfter(personAtDiv);
//		var resultDiv = $("<div class='row-fluid row-block ' ><div class='col-lg-4'><div style='padding-left:10px;font-size:14px;color:#000000;'><b>"
//			+ jsBizMultLan.atsManager_quitHolidayLimitList_i18n_6
//			+ "</b></div></div></div>");
//		resultDiv.insertAfter($("#myHr"));
		//移除搜索框
		$('#searchPanel').remove();
		$("#searcher").closest(".span6").remove();
		
		/*var gridPage = $("#gridPager").closest(".span3");
		var gridPageParentHtml = $("#gridPager").closest(".row-fluid").html();
		$(gridPageParentHtml).insertAfter(resultDiv);*/
	}
});


