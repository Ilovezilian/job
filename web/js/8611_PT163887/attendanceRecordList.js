//组织长编码
var orgLongNum="";
shr.defineClass("shr.ats.AttendanceRecordList", shr.framework.List, {
	defaultUrl : "",
	isFirstTimeLoad: true,
	initalizeDOM : function () {

		var that = this;
		that.processF7ChangeEvent();
		that.initQueryDateInfo();
		shr.ats.AttendanceRecordList.superClass.initalizeDOM.call(this);		
		jQuery("#grid").jqGrid('setFrozenColumns');
		$('#query').attr("style","display:none");
		//快速过滤展开
		if($(".filter-containers").is(":hidden")){
			$("#filter-slideToggle").click();
		}
		
		$(".filter-container:last").css("display","none");
		if(window.contextLanguage == 'en_US'){
			$(".ui-jqgrid-labels[role='rowheader']").eq(2).children().css("height",$("#grid_cb").height()+"px")
		}
	},
	
	getGridCustomParam: function() {
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		return {'beginDate':atsMlUtile.getFieldOriginalValue("beginDate"),'endDate':atsMlUtile.getFieldOriginalValue("endDate"),'orgLongNum':orgLongNum};
	},
	
	getCustomFilterItems: function() {
	     
		var that = this;
		var array = new Array();
		var filterStr = "";
		//由原先的F7改为现在现在的输入框模糊查询
		var person_name = $("#proposer").val();
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		//初始化

		if (orgLongNum != null && orgLongNum != "") {
			filterStr +=  "and adminOrgUnit.longNumber like '" + orgLongNum + "%' "; 
		}
        if(person_name != null && person_name != "" ){
			filterStr += "and person.name like '%"+person_name.trim() + "%' ";
		}
//		if (beginDate!= null &&  beginDate != ""  ) {
//			filterStr += "and dt >= '"+beginDate+"' ";
//		}
//		if (endDate != null && endDate != ""  ) {
//			filterStr += "and dt <= '"+endDate+"' ";
//		}
		//去掉第一个and
		filterStr = filterStr.substring(3);

		return filterStr;
	},
	queryGrid: function(){
		var dateRequiredValidate = shr.fastFilterValidateUtil.requiredValidate(this,{"name":"dt","errorMessage":jsBizMultLan.atsManager_attendanceRecordList_i18n_1});
		if(dateRequiredValidate){
			var _self = this;
			var $grid = $(this.gridId);
			_self.setFastFilterMap();
			this.setGridTreeParam();
			this.setGridCustomParam();
			this.setBotpFilterItems($grid);
			
			this.queryFastFilterGrid();
			
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
				$grid.jqGrid("option", "fastFilterItems", JSON.stringifyOnce(fastFilterItems));
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
			if(!this.isFirstTimeLoad){
				$grid.jqGrid("reloadGrid");
			}else{
				this.isFirstTimeLoad = false;
			}	
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
	},
	queryAction: function() {
		 var that = this;
		 var filterStr=that.getCustomFilterItems();
		 this.setGridCustomParam();
		 
		var customParam = this.getGridCustomParam();
		if(filterStr && filterStr.indexOf("person.name") == -1 && customParam  && customParam['beginDate'] && customParam['endDate']){
			var beginDate = customParam['beginDate'] ;
			var endDate =  customParam['endDate'];
			if((new Date(endDate) - new Date(beginDate))/(1000 * 60 * 60 * 24) >= 8){
				shr.showConfirm(jsBizMultLan.atsManager_attendanceRecordList_i18n_2,function(){
						$("#grid").jqGrid('option', 'page', 1);
						$("#grid").jqGrid("option", "filterItems", filterStr).jqGrid("reloadGrid");
				});
				return;
			}
		}
		
		$("#grid").jqGrid('option', 'page', 1);
		$("#grid").jqGrid("option", "filterItems", filterStr).jqGrid("reloadGrid");
		
		 //jQuery("#grid").jqGrid('setFrozenColumns');
	},
	processF7ChangeEvent : function(){
		var that = this;
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   if(info!=null){
			   if(info.longNumber !=null && info.longNumber!=''){ 
			   		orgLongNum=info.longNumber;
			   }else {
				   orgLongNum = "";
			   }

			}else {
				orgLongNum = "";
			}
			}
		});

	
  },
	/**
	 * 初始化我的打卡记录上边的查询条件 开始日期 和结束日期
	 * 开始日期 往前推一个月 结束日期是当前系统日期.
	 * 
	 * 值来自于后台渲染成的隐藏值。
	 * */
	initQueryDateInfo : function(){
		atsMlUtile.setTransDateTimeValue("beginDate",atsMlUtile.getFieldOriginalValue('preMonthDateShortStr'));
		atsMlUtile.setTransDateTimeValue("endDate",atsMlUtile.getFieldOriginalValue('currDateShortStr'));
		//设置默认的查询组织 这边必须的用同步的请求，不然无法过滤。
					  var serviceId = shr.getUrlRequestParam("serviceId");
				      var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=getDefaultOrg";
				      url += '&serviceId='+encodeURIComponent(serviceId);
					   shr.ajax({
						type:"post",
						async:false,
						url:url,
						success:function(res){
							var info = res;
							if(info!=null){
								var dataValue = {
									id : info.orgID,
									name : info.orgName,
									longNumber:info.longNumber
								};
								$('#adminOrgUnit').shrPromptBox("setValue", dataValue);
	
							}
					

					    }
					});
	},
	viewAction: function(billId) {
		
	},
	/**
	 * 导出列表数据，指定的主键字段，默认为billid字段
	 */
	exportCurrentAction: function() {
		var uipk = "shr.ats.AttendanceRecordList" ;
		var _self = this;
		var sid=[];
		var Exchange_json=[];
		sid = $("#grid").jqGrid("getSelectedRows");
		for ( var i in sid)
		{
			var item = sid[i];
			var data = $("#grid").jqGrid("getRowData", item);
			//var dt= Date.parse(data["dt"]).toString("yyyy-MM-dd");

			var dd = new Date(Date.parse(data["dt"]));
			var dt = dd.format("yyyy-MM-dd");

			var personNumber = encodeURIComponent (data["person.number"]) ;
			var personName= encodeURIComponent (data["person.name"]) ; 
			var orgName= encodeURIComponent ( data["adminOrgUnit.displayName"]) ;
			var posName= encodeURIComponent ( data["position.name"] ) ;
			var id = data["person.id"];
			Exchange_json.push({'dt':dt,'personNumber':personNumber,'personName':personName,'orgName':orgName,'posName':posName,'id':id});
		}	
		if(Exchange_json.length>0) {
			var PersonJson = $.toJSON(Exchange_json) ;
			
			var postData=$('#grid').jqGrid("getGridParam","postData");
			$('#grid')._pingPostData(postData);
			option = { isAll: true};
			
			var param = $.extend({}, postData, option);
			param.PersonJson = PersonJson;
			param.method = 'exportCurrent';
			var url = shr.getContextPath() + shr.dynamicURL;

            if(window.isShrSensitiveRuleOpen) {
                fieldSensitiveService.setExportPsw(function (psw) {
					param.exportPrivteProtected= psw
                    shr.reloadUrlByPost(url, param, 'exportCurrent');
                });
            }else{
                shr.reloadUrlByPost(url, param, 'exportCurrent');
            }
			
			
			
//			var PersonJson = $.toJSON(Exchange_json) ;
//			var url = shr.getContextPath() + shr.dynamicURL + "?method=exportCurrent&uipk="+uipk; 
//			openLoader(1,"正在导出,请稍等..."); 
//		  	shr.ajax({ 
//				type:"post",  
//				url:url, 
//				data: {
//					PersonJson : PersonJson 
//				},
//				success:function(res){ 
////					var fileUrl = res.url ;	 
//					closeLoader();    
////					document.location.href = fileUrl; 
//			    }, 
//			    error : function(res){
//			    	shr.showError({message: "导出失败 "});
//			    	closeLoader(); 
//			    } 
//			});
		}else{
			shr.showWarning({
				message: jsBizMultLan.atsManager_attendanceRecordList_i18n_0
			});
		}
	}
	,exportToExcelAction:function(){
		
		    var postData=$('#grid').jqGrid("getGridParam","postData");
			$('#grid')._pingPostData(postData);
			/*url += "&isAll="+isAll;
			url += "&query="+postData.query;
			url += "&uipk="+postData.uipk;
			url += "&selector="+postData.selector;
			url += "&filter="+postData.filter
			url += "&filterItems="+postData.filterItems;;
			url += "&sorterItems="+postData.sorterItems;
			url += "&page="+postData.page;
			url += "&rows="+postData.rows;
			url += "&sidx="+postData.sidx;
			url += "&sord="+postData.sord;
			url += "&columnModel="+postData.columnModel;*/
			option = { isAll: true};
			
			var param = $.extend({}, postData, option);
			
			if (param.queryMode) {
				delete param.queryMode
			}
			var queryModel = '';
			var columns = postData.columnModel.split(",");
			for (var i=0;i<columns.length;i++) {
			    var optionColumn = $('#grid').jqGrid("optionColumn",columns[i]);
			    var hidden = optionColumn.hidden,
			        label = optionColumn.label;
			    if(columns[i]!=null&&columns[i]!=""){
			    	queryModel += columns[i]+","+hidden+","+label+";";
			    }
			}
			param.queryMode = queryModel;
			param.method = 'exportToExcel';
			
			var url = shr.getContextPath() + shr.dynamicURL;
            //document.location.href = url;
			// 由于会出现url太长的情况，所以通过form　post提交至iframe的方式处理该问题

        if(window.isShrSensitiveRuleOpen) {
            fieldSensitiveService.setExportPsw(function (psw) {
                param.exportPrivteProtected= psw
                shr.reloadUrlByPost(url, param, 'exportExcel');
            });
        }else{
            shr.reloadUrlByPost(url, param, 'exportExcel');
        }
    	}
});	
