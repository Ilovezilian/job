shr.defineClass("shr.ats.AtsLeaveBillAllListCalculate", shr.framework.List, {	 
	adminOrgLongnumber:"",
	initalizeDOM : function () {
		var _self = this;	
		shr.ats.AtsLeaveBillAllListCalculate.superClass.initalizeDOM.call(this);
		_self.initPage();	
		_self.initPageStyle();	
		_self.processF7ChangeEvent();
		
	}
		
	,processF7ChangeEvent:function(){
		var _self = this;	
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
			var info = value.current;
			if(info!=null && info!=''){
				if(info.longNumber !=null && info.longNumber!=''){ 
					var filter=" adminOrgUnit.longNumber like '"+info.longNumber+"%' ";//因为要加入员工的职业信息，所以现在员工查询结果来自于员工的职业信息（右）关联的员工
					$("#proposer").shrPromptBox("setFilter",filter);
				}else{
				}
				
				_self.adminOrgLongnumber =info.longNumber;
			}
			$("#proposer").shrPromptBox("setValue",{
				id : "",
				name : ""
			});
		}

		});
	}
	
	,initPage :function(){
		var _self = this;
		//设置开始结束时间默认值
		var currentDate = new Date();
		var oneweekdate = new Date(currentDate-7*24*3600*1000);
		var endDate =  _self.datetoString(currentDate);
		var beginDate = _self.datetoString(oneweekdate);
		
		$("#beginDate").shrDateTimePicker('setValue',beginDate);
		$("#endDate").shrDateTimePicker('setValue',endDate);


		//设置默认组织
	 
	    _self.remoteCall({
			type:"post",
			async: false,
			method:"getAdminOrgUnit",
			param:{},
			success:function(res){
				info =  res;
				$('#adminOrgUnit_el').val(info.orgID);
				$('#adminOrgUnit').val(info.orgName);
				_self.adminOrgLongnumber = info.longNumber;
			}
		});
		$("#beginDate").bind('input propertychange', function() { 
 				//进行相关操作 
				var value =$(this).val();
				if (value){
					var t = $(this).closest('.field-ctrl').find("label.error");
					$(t).remove();
				}else{
					var t = $(this).closest('.field-ctrl').find("label.error");
					if (t !=undefined && t.length!=0){
						$(t).remove();
					}
					$('<label for="entries_reason" generated="true" class="error" style="display: block;">'
							+ jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_0 
							+ '</label>"').insertAfter($(this).closest('.field-ctrl').children()[0]);

				}
		});

		$("#beginDate").blur(function(){
		var value =$(this).val();
		if (!value){
			var t = $(this).closest('.field-ctrl').find("label.error");
			if (t !=undefined && t.length!=0){
				$(t).remove();
			}
			$('<label for="entries_reason" generated="true" class="error" style="display: block;">' 
					+ jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_0 
					+ '</label>"').insertAfter($(this).closest('.field-ctrl').children()[0]);
		}	
		});
		$("#beginDate").change(function(){
			var value =$(this).val();
			if (value){
				var t = $(this).closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
				$(t).remove();
			}
			}
		
		});
	
		$("#endDate").blur(function(){
			var value =$(this).val();
			if (!value){
				var t = $(this).closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
					$(t).remove();
				}
				$('<label for="entries_reason" generated="true" class="error" style="display: block;">' 
						+ jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_0 
						+ '</label>"').insertAfter($(this).closest('.field-ctrl').children()[0]);
			}
				
		});
		
		$("#endDate").change(function(){
			var value =$(this).val();
			if (value){
				var t = $(this).closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
				$(t).remove();
			}
			}
		
		});
		
		$("#endDate").bind('input propertychange', function() { 
			//进行相关操作 
			var value =$(this).val();
			if (value){
				var t = $(this).closest('.field-ctrl').find("label.error");
				$(t).remove();
			}else{
				var t = $(this).closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
					$(t).remove();
				}
				$('<label for="entries_reason" generated="true" class="error" style="display: block;">' 
						+ jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_0 
						+ '</label>"').insertAfter($(this).closest('.field-ctrl').children()[0]);

			}
		});
		_self.queryAction();

	}
	,initPageStyle :function(){
		var _self = this;
		/*
		var beginDateLabel =  $("#beginDate").closest(".field-ctrl").prev();
		beginDateLabel.removeClass("col-lg-4");
		beginDateLabel.addClass("col-lg-2");
		$("<div class='col-lg-2'><div title='单据范围' style='padding-left:10px;font-size:14px;color:#000000;'><b>员工范围</b></div></div>").insertBefore(beginDateLabel);
		var personAtDiv = $("#proposer").closest(".row-fluid");
		$("<hr id='myHr' style='height:1px;border:none;border-top:1px solid #ccc;'/>").insertAfter(personAtDiv);
		var resultDiv = $("<div class='row-fluid row-block ' ><div class='col-lg-4'><div style='padding-left:10px;font-size:14px;color:#000000;'><b>查询结果</b></div></div></div>");
		resultDiv.insertAfter($("#myHr"));
		*/
		//加提示
//		var descNode = $("#endDate").parents(".field-ctrl").siblings(".field-desc");
//		descNode.html("<div class = 'warn-btn'><img src = '/shr/addon/attendmanage/web/resource/tips.png'></div>");
		var descNode = $("#entries_beginTime_entries_endTime-dateend").parents(".items-area");
		descNode.append("<div class = 'warn-btn' style='display: inline-block;'><img src = '/shr/addon/attendmanage/web/resource/tips.png'></div>");
		

		$body = $(document.body);

		$(document.body).append(warnDiv);
		var descNodeOffset = descNode.offset();
		var warnDiv = "<div id='warn' ><p class = 'warn-style'>" 
			+ jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_1 
			+ "</p></div>";
		
		$(document.body).append(warnDiv);
//		var warnBox = $("#warn");
//		warnBox.css({
//			left: "360px",
//			top:  "400px"
//
//		});

		$("#warn").css({"width": "300px","min-height": "70px","background-color":"rgb(255, 255, 255)","position": "absolute","border":" 1px solid rgb(199, 199, 199)"});
		$(".warn-btn img").css({"width": "20px","height":"20px","padding-left": "10px","cursor":"pointer"});
		$(".warn-style").css({"padding": "10px","text-indent": "0em"});
		//$(".hide").css({"display":"none"});
		$("#warn").css({"display":"none"});

		descNode.hover(function(){
			$("#warn").css({"display":""});
			var descNodeOffset = $(".warn-btn").offset();
			$("#warn").css({
				left: descNodeOffset.left + 40 +"px",
				top: descNodeOffset.top + "px",
				"z-index":1000
			});
			
		},function(){
			
			$("#warn").css({"display":"none"});
			
		});
		
		

	}
	,datetoString:function(date){
		var year = date.getFullYear();    //获取完整的年份(4位,1970-????)
		var month = date.getMonth()+1;       //获取当前月份(0-11,0代表1月)
		var day = date.getDate();        //获取当前日(1-31)
		
		if( month < 10){
			month = '0' + month;
		}
		if(day < 10){
			day = '0' + day;
		}
		var strDate = year + '-'+ month + '-' + day;
		return strDate;

	}
	,queryAction :function(){
		var _self = this;
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"entries.beginTime_entries.endTime",
			"errorMessage":jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_3});
		if(!dateRequiredValidate) return;
		
		var filterItem = _self.getFastFilterItems();
		var beginDate = filterItem["entries.beginTime_entries.endTime"].values["startDate"];
		var endDate = filterItem["entries.beginTime_entries.endTime"].values["endDate"];
		//if(beginDate && endDate ){
		//var beginDate = $("#beginDate").shrDateTimePicker('getValue');
		//var endDate = $("#endDate").shrDateTimePicker('getValue');
		var adminOrgUnit = $("#adminOrgUnit_el").val();
		var proposer = $("#proposer_el").val();
		if(!adminOrgUnit){
			_self.adminOrgLongnumber="";
		}
		_self.remoteCall({		
			type:"post",			
			method:'queryAtsleaveBillEntry', 
			param: {
				"beginDate":beginDate,
				"endDate" :endDate,
				"adminOrgUnit":_self.adminOrgLongnumber,
				"proposer":proposer
			},
			success: function(response) {
				closeLoader();
			//	top.Messenger().hideAll();
				var data= response;
				$("#grid").jqGrid('setGridParam', {
					datatype:'json',
					postData:{'atsLeaveBillEntryId':data.atsLeaveBillEntryId.join(",")}
					
				}).trigger("reloadGrid");

			}
						
		});
	
		//}
		/*else{
			shr.showWarning({message: "请维护开始日期和结束日期"});	
			if(!beginDate){
				var t = $("#beginDate").closest('.field-ctrl').find("label.error");
				if (t !=undefined && t.length!=0){
					$(t).remove();
				}
				$('<label for="entries_reason" generated="true" class="error" style="display: block;">必录字段</label>"').insertAfter($("#beginDate").closest('.field-ctrl').children()[0]);
			}
			if(!endDate){
				var t = $("#endDate").closest('.field-ctrl').find("label.error"); 
				if (t !=undefined && t.length!=0){
					$(t).remove();
				}
				$('<label for="entries_reason" generated="true" class="error" style="display: block;">必录字段</label>"').insertAfter($("#endDate").closest('.field-ctrl').children()[0]);
	
			}
		}*/
		
	}
	,
	queryGrid: function(){
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"entries.beginTime_entries.endTime","errorMessage":jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_3});
		if(dateRequiredValidate){
			shr.ats.AtsLeaveBillAllListCalculate.superClass.queryGrid.call(this);
		}
	}
	
	/**
	 * 重算
	 */
	,recalculateAction :function(){
		var _self = this;		
		var billIds = $("#grid").jqGrid("getSelectedRows").join(",");
		var message="";
		if(billIds){
			message = jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_2
			shr.showConfirm(message, function() {
			openLoader(1,jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_5); 
			_self.remoteCall({
				type:"post",
				method:"recalculate",
				param :{billIds:billIds} ,
				success : function(res) {
					closeLoader();
					var data= res;
					var calculateFailenum = data.calculateFailenum;
					var calculateSuccess = data.calculateSuccess;
					var errorString = data.errorString
					var message =jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_8 + "<br/>";
					if(data.calculateSuccess!=0){
						message+= shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_6, [calculateSuccess]) + "<br/>";
					}
					if(data.calculateFailenum!=0){
						message+= shr.formatMsg(jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_7, [calculateFailenum])  
						+ "<br/><font color='red'>" +data.errorString+"</font><br/>";
					}
				
					/*
					$("#grid").jqGrid('setGridParam', {
						datatype:'json',
						postData:{'atsLeaveBillEntryId':""}
						
					}).trigger("reloadGrid");	*/
					_self.queryAction();
					shr.showInfo({message: message,hideAfter: null});				
					
				},
				error: function(response) {
					closeLoader();
				},
				complete: function(){
					closeLoader();
				}
			});		
		
		})
		}else{
			shr.showWarning({message: jsBizMultLan.atsManager_atsLeaveBillAllListCalculate_i18n_4});	
		}
		


	}

	,onCellSelect: function(rowid, colIndex, cellcontent, e) {
		return;
	}
	/**
	 * 查询表格
	 */
	,queryGrid: function() {
		var _self = this;
		_self.setFastFilterMap();
		this.setGridTreeParam();
		this.setGridCustomParam();
		
		this.queryFastFilterGrid();
		
		var $grid = $(this.gridId);
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
			$grid.jqGrid("option", "fastFilterItems", JSON.stringify(fastFilterItems));
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
});

