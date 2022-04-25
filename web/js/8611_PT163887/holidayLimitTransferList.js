shr.defineClass("shr.ats.holidayLimitTransferList", shr.framework.List,{
	pageStep: 1,//剩余额度转入叶签为选中状态(uipk为IN)
	flag:0,
	initalizeDOM : function() {
		shr.ats.holidayLimitTransferList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initTabPages();
		that.setNavigate();
		that.bindClick();
		setTimeout(function(){
			that.initTable();
		},1000);
		//隐藏精确搜索
		$("#searcher").hide();
		$("#gridPager").hide();
		
	},
	
	//绑定点击事件
	bindClick:function(){
		var _self = this;
//		$('.view_manager_body').delegate("div[class='col-lg-6 field-ctrl']", 'click',  function(e){
//		$('.view_manager_body').delegate(".field-ctrl", 'click',  function(e){
//			_self.flag = $(this).parent().find($('.field_label')).text();
//			_self.addCellSelectPropotationAction();
//		});
		
//		$(".field-ctrl")[1].onclick=function(){
//			_self.flag = $(this).parent().find($('.field_label')).text();
//			_self.addCellSelectPropotationAction();
//		};
		$("[name=currProportion]").val(8);//初始比例为1:8
		$(".field-ctrl").remove();
		$(".field-desc").remove();
		$('[name=currProportion]').width("20");
//		$('[name=currProportion]').css({width: '20px',height: '16px',verticalAlign: 'middle',marginTop: '-3px',marginLeft: '-15px'})
//		$('[name=currProportion]').after("<span style='vertical-align: middle;margin: -10px 0 0 6px;display: inline-block'>小时	（转入和转出单位不同时，按比例进行换算，默认是1天等于8小时，修改比例后自动更新待转入额度。）</span>")
		$('[name=currProportion]').after("<span style='margin: -10px 0 0 6px;display: inline-block'>"
			+ jsBizMultLan.atsManager_holidayLimitTransferList_i18n_9
			+ "</span>")
		$("[name=currProportion]").blur(function(){
			if($("[name=currProportion]").val()!=null&&$("[name=currProportion]").val()!=""){
				if($("[name=currProportion]").val()>24){
					shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_6});
				};
				if($("[name=currProportion]").val()<=0){
					shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_6});
				};
			};
			_self.flag = $(this).parent().find($('.field_label')).text();
			_self.changeTransferLimit();
		});
		
		
		
		
	},
	initTable:function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedDatas = shr.getUrlParams().billId;
		var selectedData = selectedDatas.split(",");
		for(var i=0;i<selectedData.length;i++){
			
			
			if(selectedData[i]!=null&&selectedData[i]!=""){
				var prop01 = 1;
				var prop02 = $("[name=currProportion]").val();
				clz.initCalcHolidayLimitAction(selectedData[i], 0, prop01, prop02);
				return false;
			}
			
			
		}
	}
	
	,
	changeTransferLimit:function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var gridData= $grid.jqGrid("getRowData");
		for(var i=0;i<gridData.length;i++){
			
			
			if(gridData[i]['currentHolidayLimit.id']!=null&&gridData[i]['currentHolidayLimit.id']!=""&& gridData[i]['id']!=null&&gridData[i]['id']!=''){
				var prop01 = 1;
				var prop02 = $("[name=currProportion]").val();
				var preHolidayLimitId = gridData[i]['id'];
				var currentHolidayLimitId = gridData[i]['currentHolidayLimit.id']
				clz.calcHolidayLimitAction(preHolidayLimitId, currentHolidayLimitId, prop01, prop02);
//				return false;
			}
			
			
		}
	}

	//取消
	,deleteAction:function(){	
		history.back();
	}
	//保存
	,addNewAction:function(){
		var clz = this;
		var $grid = $(clz.gridId);
		var gridData= $grid.jqGrid("getRowData");
		//校验字段不为空
		for(var i=0;i<gridData.length;i++){
			if(gridData[i]['currentHolidayType.id']==null || gridData[i]['currentHolidayType.id']==''){
			
			$("td[aria-describedby='grid_currentHolidayType.name'").css("border-bottom-color","red");
				shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_1});
				return false;
			}
			if(gridData[i]['currentTransferLimit']==null || gridData[i]['currentTransferLimit']==''){
			
			$("td[aria-describedby='grid_currentTransferLimit'").css("border-bottom-color","red");
				shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_0});
				return false;
			}
			
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitTransfeCalcListHandler&method=saveAll";
		openLoader(1,jsBizMultLan.atsManager_holidayLimitTransferList_i18n_10);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{"models":JSON.stringify(gridData)},
			success:function(res){
				closeLoader();
					shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_2});
				setTimeout(clz.reloadPage({uipk : 'com.kingdee.eas.hr.ats.app.HolidayLimitTransfer.out'}),5000);
//				clz.reloadPage({uipk : 'com.kingdee.eas.hr.ats.app.HolidayLimitTransfer.out'});
				}
	});		 
	}
	
	//假期类型弹出框	
	,onCellSelect:function(rowid,iCol,cellcontent,e){
		var _self = this ;
		if(iCol==9||iCol==11){
			if(iCol == 9){//假期类型
				_self.setHolidayTypeF7ToGridCell(rowid,iCol,cellcontent,e);
			}
			else if(iCol == 11 ){//假期额度
				_self.addValsOnCellSelectPublicAction(this,iCol,rowid);
			}
//				else{
//			 	_self.addValsOnCellSelectPublicAction(this,iCol,rowid);
//			}
		}
	},
	
	setHolidayTypeF7ToGridCell: function(rowid,columnNum,cellcontent,e){
		var _self = this ;
		//剩余额度转入----假期额度
//		var proposerId_object = $('#e74AAABujMu5xKMo').find($("td[aria-describedby='grid_proposer.id']"))[0];//查询只是当前的人员的假期类型
//		var rowObject = $("#"+rowid);
//		var proposerId_object = rowObject.find($("td[aria-describedby='grid_proposer.id']"))[0];
//		var currentHrOrgUnit1Id_object = rowObject.find($("td[aria-describedby='grid_currentHrOrgUnit1.id']"))[0];
//		var proposerId = proposerId_object.innerHTML;
//		var currentHrOrgUnit1Id = currentHrOrgUnit1Id_object.innerHTML;
		var proposerId = $("#grid").jqGrid("getCell",rowid,"proposer.id");
		var currentHrOrgUnit1Id = $("#grid").jqGrid("getCell",rowid,"currentHrOrgUnit1.id");
		var grid_f7_json = {id:"holidayType",name:"holidayType"};
		grid_f7_json.isInput = false;
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_holidayLimitTransferList_i18n_8,
			uipk:"com.kingdee.eas.hr.ats.app.HolidayLimit.choose2Transfer.F7",
			query:"",filter:"proposer.id ='"+proposerId+"' and HRORGUNIT.ID = '"+currentHrOrgUnit1Id+"'",//proposer.id ='"+proposerId+"'
//			query:"",filter:"proposer.id ='"+proposerId+"' ",
			domain:"",
			multiselect:false,
			onclikFunction: function (ids) {
				_self.setSelectValueToGridCell(rowid,columnNum,cellcontent,e,ids);
			}
		};
		grid_f7_json.readonly = '';
		grid_f7_json.validate = '';
		grid_f7_json.value = {id:"",name:""};
		$(_self).shrPromptBox(grid_f7_json);
		$(_self).shrPromptBox("open");
	}
	
	//换算比列01赋值弹出框
	,addCellSelectPropotationAction : function(){
		var _self = this;
		$("#iframe3").dialog({
			    title: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_3,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+55%',
					of: window
				},
				open : function(event, ui) {
				   _self.appendDynamicHTMLOnPropSelect(this);
			    },
			    close : function() {
				    $("#iframe3").empty();
			    },
					buttons: [{
						text: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_3,
						click: function(){
							$(this).disabled = true;
							_self.assginValueOnCellPropAction();
							$("#iframe3").empty();
							$("#iframe3").dialog("close");
						}
					},{
						text: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_7,
						click: function(){
							$("#iframe3").empty();
							$("#iframe3").dialog("close");
						}
					}]
			});	
			$("#iframe3").css({"height":"250px"});
			$("#iframe3").css({"margin-top":"5px"});
	}
	
	
	//假期额度赋值弹出框01
	,addValsOnCellSelectPublicAction : function(pageUipk,columnNum,rowid){
		var _self = this;
		$("#iframe2").dialog({
			    title: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_3,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+55%',
					of: window
				},
				open : function(event, ui) {
				   _self.appendDynamicHTMLOnCellSelect(this,columnNum);
			    },
			    close : function() {
				    $("#iframe2").empty();
			    },
					buttons: [{
						text: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_3,
						click: function(){
							$(this).disabled = true;
							_self.assginValueOnCellSelectAction(pageUipk,columnNum,rowid);
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					},{
						text: jsBizMultLan.atsManager_holidayLimitTransferList_i18n_7,
						click: function(){
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					}]
			});	
			$("#iframe2").css({"height":"250px"});
			$("#iframe2").css({"margin-top":"5px"});
	},

	//赋值弹出框02
	assginValueOnCellSelectAction : function(pageUipk,columnNum,rowid)
	{
		var _self = this ;
//		if (_self.validate()) {
			var clz = this;
			var $grid = $(clz.gridId);	
			var ids = $grid.jqGrid('getDataIDs');
			
			
			if(columnNum==11){
				var currentTransferLimitVal = $("#currentTransferLimitVal").val();
				if(currentTransferLimitVal!=null&&currentTransferLimitVal!=""){
					$grid.jqGrid("setCell",rowid,"currentTransferLimit",currentTransferLimitVal);
				}
			}
			
//		}
	}
	
	,

	//赋值弹出框02
	assginValueOnCellPropAction : function()
	{
		if(this.flag === jsBizMultLan.atsManager_holidayLimitTransferList_i18n_5){
//		  $(".field-ctrl")[0].innerHTML = ($('#prePropoTransLimitVal').val());
		}else{
		  $(".field-ctrl")[1].innerHTML = ($('#prePropoTransLimitVal').val());
		}
	}
	
	
	,
	//换算比列赋值弹出框
	appendDynamicHTMLOnPropSelect: function(object,columnNum){
		var that = this;
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
			 + '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_holidayLimitTransferList_i18n_4
			+ '</div></div>'
			 + '</div>';
		
//		if(columnNum==11){
			 html+='<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_holidayLimitTransferList_i18n_11
				 + '">'
				 + jsBizMultLan.atsManager_holidayLimitTransferList_i18n_11
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="prePropoTransLimitVal" name="prePropoTransLimitVal" class="block-father input-height" type="text"  ctrlrole="text" autocomplete="off" title="" ></div>';
//		}
		 	html+=  '</div>'
				 + '</form>';
		$(object).append(html);
	
		
		//要将form加上，数据校验才有用。
	    var formJson = {
			id: "form"
		};
		$('#form').shrForm(formJson);
	}
	
	
	//赋值弹出框03
	,
	appendDynamicHTMLOnCellSelect: function(object,columnNum){
		var that = this;
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
				 + '<div class="row-fluid row-block ">'
				 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_holidayLimitTransferList_i18n_4
			+ '</div></div>'
				 + '</div>';
		
		if(columnNum==11){
			 html+='<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_holidayLimitTransferList_i18n_12
				 + '">'
				 + jsBizMultLan.atsManager_holidayLimitTransferList_i18n_12
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="currentTransferLimitVal" name="currentTransferLimitVal" class="block-father input-height" type="text"  ctrlrole="text" autocomplete="off" title="" ></div>';
		}
		 	html+=  '</div>'
				 + '</form>';
		$(object).append(html);
	
		
		//要将form加上，数据校验才有用。
	    var formJson = {
			id: "form"
		};
		$('#form').shrForm(formJson);
	}
	
	,setSelectValueToGridCell: function(rowid,columnNum,cellcontent,e,ids){
		var _self = this ;
		var $table = $(_self).shrPromptGrid("getTable");
		var ret = $table.jqGrid('getRowData',ids);
//		var clz = this;
		var $grid = $(_self.gridId);
	
		if(columnNum==9){
//			var currentHolidayTypeId = ret.id;
		
		  
			//则将假期额度记录的假期类型、单位、周期开始日期、周期结束日期带入到转入弹出框中
			var preHolidayLimitId = rowid; 
			var currentHolidayLimitId = ret.id;
			var prop01 = 1;
//			var prop02 = $(".field-ctrl")[1].innerText;
			var prop02 = $("[name=currProportion]").val();
			_self.calcHolidayLimitAction(preHolidayLimitId, currentHolidayLimitId, prop01, prop02);
//			console.log(res);
			var currentHolidayTypeId = ret["holidayPolicy.holidayType.id"];
			var currentHolidayTypeName = ret["holidayPolicy.holidayType.name"];
			var currentHolidayLimitCycleBeginDate = ret.cycleBeginDate;
			var currentHolidayLimitCycleEndDate = ret.cycleEndDate;
			var hrOrgUnitName = ret["hrOrgUnit.name"];//业务组织
//			
			if(currentHolidayTypeId != null && currentHolidayTypeId != ""){
				$grid.jqGrid("setCell",rowid,"currentHolidayLimit.id",currentHolidayLimitId);//将f7假期类型Id赋值到弹出框中
				$grid.jqGrid("setCell",rowid,"currentHolidayType.id",currentHolidayTypeId);
				$grid.jqGrid("setCell",rowid,"currentHrOrgUnit.name",hrOrgUnitName);//业务组织
				$grid.jqGrid("setCell",rowid,"currentHolidayType.name",currentHolidayTypeName);//假期类型
				
				$grid.jqGrid("setCell",rowid,"currentHolidayLimit.cycleBeginDate",currentHolidayLimitCycleBeginDate);//周期开始日期
				$grid.jqGrid("setCell",rowid,"currentHolidayLimit.cycleEndDate",currentHolidayLimitCycleEndDate);//周期结束日期
//				$grid.jqGrid("setCell",rowid,"currentHolidayPolicy.minAmt",holidayPolicyMinAmt);//单位额度
//				$grid.jqGrid("setCell",rowid,"currentHolidayPolicy.minAvd",holidayPolicyMinAmtValueMtd);//取整方式
				
			}
		}
	}
	
//	//转入
//	
//	,transferAction: function() {
//		var clz = this;
//		var $grid = $(clz.gridId);
//		var selectedIds = $grid.jqGrid("getSelectedRows");
//		var personIds='';
//		if (selectedIds.length <= 0) {
//			shr.showInfo({message: "请至少选择1条考勤档案记录!", hideAfter: 3});
//			return;
//		}
//		this.reloadPage({
//			uipk: 'com.kingdee.eas.hr.ats.app.HolidayLimit.Transfer'
//		});			
//	}

	
	
	//转入
	,transfer00Action : function() {
		var _self = this;
//		var billId = $("#grid").jqGrid("getSelectedRows");
//		if (billId == undefined || billId.length==0) {
//	        shr.showInfo({message: '您没有选择需要转入的记录，请选择已转出状态的记录'});
//			return ;
//	    }
//		var isAllTransfer=true;
//	    var ids = [];
//		for (var i = 0; i < billId.length; i++) {
//			var limitstatus = $("#grid").jqGrid("getRowData",billId[i]).status;
//			console.log($("#grid").jqGrid("getRowData",billId[i]));
//			var transferStatus = $("#grid").jqGrid("getRowData",billId[i])['transferStatus'];
//			if(transferStatus==0){//已转入状态,会被忽略, 剩余额度结转状态 0 已转入      1 已转出
//				isAllTransfer=false;
//			}
//			else{
//				ids.push($("#grid").jqGrid("getCell",billId[i], "id"));
//			}
//		}
		var confirmMess="";
//		if(isAllTransfer==false){
//			confirmMess="选择的记录中包含已转入的记录，已转入的记录会被忽略，是否继续？";
//		}
//		
//		if(ids.length>0){
//			ids=ids.join(",");
//		}else{
//			shr.showWarning({message: '没有选择‘已转出’状态的记录，请重新选择'});
//			return ;
//		}
//		
//		
//		
		//转入的逻辑
		shr.showConfirm(confirmMess, function(){
			top.Messenger().hideAll();
			
			//转出转入表
			localStorage.setItem(_self.cache_key,ids) ;
			
			
			_self.doRemoteAction({
				method: 'transfer',
				billId: ids
			});
			
			_self.createDialogDiv() ;
		});
		
		
		
		//TODO
		
		
	}
	
	
	
	,createDialogDiv : function(){
		var _self = this;
		$('#transferLimitDiv').remove();
		
			// 未生成dialog
		var transferLimitDiv = $('<div id="transferLimitDiv"></div>').appendTo($('body'));
			
		transferLimitDiv.dialog({
				modal : false,
				title : jsBizMultLan.atsManager_holidayLimitTransferList_i18n_8,
				width : 935,
				minWidth : 935,
				height : 505,
				minHeight : 505,
				open: function(event, ui) {
				
						var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.HolidayLimit.Transfer', 'view', {
						serviceId : shr.getUrlParam('serviceId')
						});
						var content = '<iframe id="transferLimitFrame" name="transferLimitFrame" width="100%" height="100%" frameborder="0"  allowtransparency="true" src="' + url + '"></iframe>';
						transferLimitDiv.append(content);
					//	$("#importFrame").attr("style", "width:1035px;height:505px;");
				},
				close: function(event, ui) {
					transferLimitDiv.empty();
					$(_self.gridId).jqGrid("reloadGrid");
				}  
			});
			
			$(".ui-dialog-titlebar-close").bind("click" , function(){
				transferLimitDiv.dialog("close");
			});	
	
	}
	
	,initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
		
		//剩余额度转出
		$('#outHolidayLimitList').click(function(){  
			that.pageStep = 0;
			//定义标签样式
			that.changePageLabelColor();
			console.log(that.reloadPage);
			that.reloadPage({
			  uipk: 'com.kingdee.eas.hr.ats.app.HolidayLimitTransfer.out'
			});	
		});
		//剩余额度转入
	    $('#inHolidayLimitList').click(function(){ 
			that.pageStep = 1;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayLimitTransfer.in'
		    });	
		});
		
		
	
		
	}
	 ,initCalcHolidayLimitAction:function(billId, currentHolidayLimitId, prop01, prop02){
    	var _self = this;
    	var useProp = 0;//按照前台比例进行计算返回值
    	var billId = $.getUrlParam('billId');
//    	 if(billId != undefined && billId != null && billId != ''){
    	 	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitTransfeCalcListHandler&method=initCalcHolidayLimit";
    	 	$.ajax({
				url: url,
				data: {
					billId:decodeURIComponent(billId),
					prop01:prop01,
					prop02:prop02,
					useProp:useProp
				},
				success:function(res){
					console.log(res);
					var $grid = $(_self.gridId);
					var holidayPolicyMinAmt = res["currentHolidayPolicy.minAmt"];//单位额度
					var holidayPolicyMinAmtValueMtd = res["currentHolidayPolicy.minAvd"];//取整方式
					var currentHolidayLimitHolidayUnit = res["currentHolidayLimit.holidayUnit"];//转入单位
					var currentTransferLimit = res["currentTransferLimit"];//转入额度
					
					////
					var currentHolidayLimitId = res["currentHolidayLimitId"];//当前假期额度Id
					var currentHolidayTypeId = res["currentHolidayTypeId"];//假期类型Id
					var currentHolidayTypeName = res["currentHolidayTypeName"];//
					
					$grid.jqGrid("setCell",billId,"currentHolidayLimit.id",currentHolidayLimitId);//将f7假期类型Id赋值到弹出框中
					$grid.jqGrid("setCell",billId,"currentHolidayType.id",currentHolidayTypeId);
					$grid.jqGrid("setCell",billId,"currentHolidayType.name",currentHolidayTypeName);//假期类型
				
					var currentHolidayLimitCycleBeginDate = res["currentHolidayLimitCycleBeginDate"];//
					var currentHolidayLimitCycleEndDate = res["currentHolidayLimitCycleEndDate"];//
					
					$grid.jqGrid("setCell",billId,"currentHolidayLimit.cycleBeginDate",currentHolidayLimitCycleBeginDate);//周期开始日期
					$grid.jqGrid("setCell",billId,"currentHolidayLimit.cycleEndDate",currentHolidayLimitCycleEndDate);//周期结束日期
					
					////
					$grid.jqGrid("setCell",billId,"currentTransferLimit",currentTransferLimit);//额度值 
					$grid.jqGrid("setCell",billId,"currentHolidayPolicy.minAmt",holidayPolicyMinAmt);//单位额度
					$grid.jqGrid("setCell",billId,"currentHolidayPolicy.minAvd",holidayPolicyMinAmtValueMtd);//取整方式
					$grid.jqGrid("setCell",billId,"currentHolidayLimit.holidayUnit",currentHolidayLimitHolidayUnit);//转入单位
			   }
			});
        
//    	 }
    	 
    }
	 ,calcHolidayLimitAction:function(preHolidayLimitId, currentHolidayLimitId, prop01, prop02){
    	var _self = this;
    	var useProp = 0;//按照前台比例进行计算返回值
    	var billId = $.getUrlParam('billId');
//    	 if(billId != undefined && billId != null && billId != ''){
    	 	var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayLimitTransfeCalcListHandler&method=calcHolidayLimit";
    	 	$.ajax({
				url: url,
				data: {
					preHolidayLimitId:decodeURIComponent(preHolidayLimitId),
					currentHolidayLimitId:currentHolidayLimitId,
					prop01:prop01,
					prop02:prop02,
					useProp:useProp
				},
				success:function(res){
					console.log(res);
					var $grid = $(_self.gridId);
					var holidayPolicyMinAmt = res["currentHolidayPolicy.minAmt"];//单位额度
					var holidayPolicyMinAmtValueMtd = res["currentHolidayPolicy.minAvd"];//取整方式
					var currentHolidayLimitHolidayUnit = res["currentHolidayLimit.holidayUnit"];//转入单位
					var currentTransferLimit = res["currentTransferLimit"];//转入额度

					$grid.jqGrid("setCell",preHolidayLimitId,"currentTransferLimit",currentTransferLimit);//额度值 
					$grid.jqGrid("setCell",preHolidayLimitId,"currentHolidayPolicy.minAmt",holidayPolicyMinAmt);//单位额度
					$grid.jqGrid("setCell",preHolidayLimitId,"currentHolidayPolicy.minAvd",holidayPolicyMinAmtValueMtd);//取整方式
					$grid.jqGrid("setCell",preHolidayLimitId,"currentHolidayLimit.holidayUnit",currentHolidayLimitHolidayUnit);//转入单位
			   }
			});
        
//    	 }
    	 
    },
	
   changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.pageStep).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.pageStep).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
	}
	,setNavigate:function(){
		var naviagateLength = $("#breadcrumb li").length;
//		for(var i=naviagateLength-2;i>0;i--){
			$("#breadcrumb li").eq(3).remove();
//		}
//		$("#breadcrumb li").eq($("#breadcrumb li").length-1).html("");
	}

});