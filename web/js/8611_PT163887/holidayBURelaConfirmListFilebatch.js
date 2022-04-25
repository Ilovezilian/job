shr.defineClass("shr.ats.holidayBURelaConfirmListFilebatch", shr.ats.holidayFilebatchAddForBUConfirm,{
	
    cache_key:"atsPersonChangeList_bill",
    cache_msg_key:"atsPersonChangeList_msgid",
    billIdsByMsg:"",
	initalizeDOM : function () {
		var _self = this;
		_self.msgIdDealAction();//兼职借调返聘 和其他 这两个页签特殊处理
		$(this.gridId).jqGrid('setGridParam', {rowNum:$('#grid', window.parent.document).jqGrid("option","rowNum")});
		shr.ats.holidayBURelaConfirmListFilebatch.superClass.initalizeDOM.call(this);
		var pageTag = _self.getUrlParams("pageTag");
		//入错职调整、变动撤销，如果已产生业务引用数据，需要选择数据处理方式，默认不处理
		if(pageTag == 1 || pageTag == 7){			
			_self.generateCheckbox();
		}
		$(window.frameElement).attr("scrolling","no");
	}
	,msgIdDealAction : function(){
		var _self = this;
		var msgIds = localStorage.getItem(_self.cache_msg_key);
		var billIds = localStorage.getItem(_self.cache_key);
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayBURelaConfirmCFListHandler&method=msgIdDeal";
			shr.ajax({
				type:"post",
				async:false,
				url:url,
				data:{"msgIds":msgIds,"billIds":billIds},
				success:function(res){
					_self.billIdsByMsg = res.billIds;
				}
			});	
	}
	,getCustomFilterItems: function() {
		var _self = this;
		var filterStr;
		var billIds = localStorage.getItem(_self.cache_key);
		if(shr.getUrlRequestParam("pageStep")==6 || shr.getUrlRequestParam("pageStep")==5){
			billIds = _self.billIdsByMsg;
		}
		var filterStr =  "Id IN ( '"+billIds.replace(/,/g,"','")+"' ) ";
		return filterStr;
	}
//	,getCustomFilterItems: function() {
//		var _self = this;
//		var parentgridData=  parent.$("#grid").jqGrid("getSelectedRows");
//		var billIds;
//		for(var i = 0 ; i < parentgridData.length ; i++){
//			var id = parent.$("#grid").jqGrid("getCell", parentgridData[i],"id");
//			if(billIds){
//				billIds = billIds+','+id;
//			}else{
//				billIds = id;
//			}
//		}
//		var filterStr =  "Id IN ( '"+billIds.replace(/,/g,"','")+"' ) ";
//		return filterStr;
//	}
	/**
	 * 获得排序字段,若不重写该方法，平台默认按number字段处理，而PersonBURelation实体没有该字段，导致query报错
	 */
	,getSorterItems: function() {
		return "person.number ASC";
	}
	,receiveAction : function(){
		
		 var dealType = "";
		 $('input[name="cb"]').each(function(){
			 if($(this).shrCheckbox("isSelected")){
			 	dealType += $(this).attr("id")+",";
			 }
		 });
		if(dealType==""){
			dealType = "ignore";			
		}else{
		   dealType = dealType.substring(0,dealType.length-1);
		}
		 
		var clz = this;
		var $grid = $(clz.gridId);
		var gridData= $grid.jqGrid("getRowData");
		for(var i = 0 ; i < gridData.length ; i++){
			if(gridData[i]['hrOrgUnit.id']==null || gridData[i]['hrOrgUnit.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_holidayBURelaConfirmListFilebatch_i18n_3});
				return false;
			}
			if(gridData[i]['position.id']==null || gridData[i]['position.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_holidayBURelaConfirmListFilebatch_i18n_9});
				return false;
			}
			if(gridData[i]['holidayPolicy.id']==null || gridData[i]['holidayPolicy.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_holidayBURelaConfirmListFilebatch_i18n_2});
				return false;
			}
			if(gridData[i]['changeDate']==null || gridData[i]['changeDate']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_holidayBURelaConfirmListFilebatch_i18n_6});
				return false;
			}
			if(gridData[i]['adminOrgUnit.id']==null || gridData[i]['adminOrgUnit.id']==''){
				shr.showInfo({message: jsBizMultLan.atsManager_holidayBURelaConfirmListFilebatch_i18n_7});
				return false;
			}
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.HolidayBURelaConfirmCFListHandler&method=receive";
		openLoader(1,jsBizMultLan.atsManager_holidayBURelaConfirmListFilebatch_i18n_8);
		shr.ajax({
			type:"post",
			async:true,
			url:url,
			data:{
				"models":JSON.stringify(gridData),
				"ids":localStorage.getItem(clz.cache_key),
				"dealType":dealType},
			success:function(res){
				//清除本地缓存
				localStorage.removeItem(clz.cache_key);
				closeLoader();
				parent.location.reload();
			}
		});		 
	}
	,generateCheckbox : function(){
		var doc="";
		doc += '<div class="row-fluid row-block">'
			 + '<div class="col-lg-2 field-desc"/>'
			 + '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_holidayBURelaConfirmListFilebatch_i18n_5
			+ '">'
			+ jsBizMultLan.atsManager_holidayBURelaConfirmListFilebatch_i18n_1
			+ '</div></div>'
			 + '<div class="col-lg-1 field-ctrl">'
			 + '<div  style="position: relative;"><input type="checkbox" id="update" name="cb" value="1" dataextenal="" ></div> '
			 + '</div>'
			 + '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_holidayBURelaConfirmListFilebatch_i18n_4
			+ '">'
			+ jsBizMultLan.atsManager_holidayBURelaConfirmListFilebatch_i18n_0
			+ '</div></div>'
			 + '<div class="col-lg-1 field-ctrl">'
			 + '<div  style="position: relative;"><input type="checkbox" id="disapprove" name="cb" value="1" dataextenal="" ></div> '
			 + '</div>'
			 + '</div>'
		$("#receive").parent().css("display","inline-block");
		$("#receive").parent().parent().append("<span id='checkBoxSpan' style='display:inline-block;width:80%;padding-top: 15px;float: right'>"+doc+"</span>");
		var checkbox_json = {
			id:"update",
			readonly: "",
			value: "1"
		};
		$('#update').shrCheckbox(checkbox_json);
		checkbox_json.id = "disapprove";
		$('#disapprove').shrCheckbox(checkbox_json);
//		checkbox_json.id = "ignore";
//		$('#ignore').shrCheckbox(checkbox_json);
//		$('#ignore').shrCheckbox("check");
//		$('input[name="cb"]').on("change",function(e){
//			if($(this).shrCheckbox("isSelected")){
//				$('input[name="cb"]:not(#'+$(this).attr("id")+')').shrCheckbox("unCheck");
//			}
//		});
	}
});