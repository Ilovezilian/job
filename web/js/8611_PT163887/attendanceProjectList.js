var categoryId = "";
var categoryName = "";
var filterItem = "";
shr.defineClass("shr.ats.AttendanceProjectList", shr.ats.AtsMaintainBasicItemList, {
	//可使用列表进来设置handler
	sorterItem :"sortNo ASC",
	handler : "" ,
	initalizeDOM : function () {
		shr.ats.AttendanceProjectList.superClass.initalizeDOM.call(this);
		var that = this;
		that.initNavigation();
		$("div.filter-facade div.filter-left").width("11%");
		$(".tabbable").css({"margin-left": "20%"});
		//$("[href='#tab1']").css({"color":"#333","font-weight": '600',"font-size":"13px"});
		$(".tabbable [href!='#tab1']").css({"color":"#6B6B6B","font-size":"11px"});
		//$("#fastFilter-area").parent().width($("#gbox_grid").width()+3);//控制快速过滤窗口的宽度
		$("#fastFilter-area").parent().css({"left":"7.5%","width": $("#gbox_grid").width() + 'px'});
	}
	
	,initNavigation: function(){
		var that = this;
		var divStr = [];
		divStr.push("<div class='tabbable tabs-left'>");
		divStr.push(" <ul class='nav nav-tabs'>");
		divStr.push("<li class='active'><a href='#tab1' data-toggle='tab' id='cat1'>"
			+ jsBizMultLan.atsManager_attendanceProjectList_i18n_2
			+ "</a></li>");
		var tabPaneStr = [];
		divStr.push("</ul><div class='tab-content'>");
		divStr.push("<div class='tab-pane active' id='tab1'></div>");
		divStr.push(" </div></div>");
		$("#navigation").append(divStr.join(""));
		$("[href='#tab1']").click(function(){
						categoryId = "";
						categoryName = "";
						filterItem = "";
						sorterItem = this.sorterItem ;
						that.queryGrid();
					})
		this.remoteCall({
			type : "post",
			method : "getAccenceProjectCat",
			param : {handler:"com.kingdee.shr.ats.web.handler.AttendanceProjectListHandler"},
			async:false,
			success : function(res){
				var rows = res.rows;
				for (var i = 0; i < rows.length; i++) {
					var item = rows[i];
					var tabStr = "#tab" + (i + 2);
					var idStr = "cat" + (i + 2);
					var liStr = "<li ><a href='" + tabStr + "' data-toggle='tab' id='" + idStr + "'>" + item.name + "</a></li>";
					$(".nav-tabs").append(liStr);
					var tabPaneId = "tab" + (i + 2);
					$(".tab-content").append("<div class='tab-pane' id='" + tabPaneId + "'></div>");
					$("[href='"+ tabStr +"']").attr("categoryId", item.id);
					$("[href='"+ tabStr +"']").attr("categoryName", item.name);
					$("[href='"+ tabStr +"']").live('click',function(){
						categoryId = $(this).attr("categoryId");
						categoryName = $(this).attr("categoryName");
						filterItem = "projectCategory.id = '" + $(this).attr("categoryId") + "'";
						sorterItem =  this.sorterItem ;
						that.queryGrid();
					})
				}
			}
		})
	},
	/**
	 * 重写查询表格
	 */
	queryGrid: function() {
		var _self = this;
		this.setGridTreeParam();
		this.setGridCustomParam();
		
		var $grid = $(this.gridId);
		// selector
		var selector = this.getSelector();
		if (typeof selector !== 'undefined') {
			$grid.setGridParam({ selector: selector	});
		}
		$grid.setGridParam({"page":  1});//每次点击进入要设置为第一页
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
		_self.setFastFilterMap();
		
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
		
		if(this.handler)
		{
			var url =  "/shr/dynamic.do?method=getListData&handler="+this.handler ;
			$grid.setGridParam({"url": url});	
		}
		
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
	,getCustomFilterItems: function(){
		return filterItem;
	}
	
	,getSorterItems: function(){
	   return this.sorterItem;
	}
	,deleteAction:function(){	
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var bills ;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var state=$grid.jqGrid("getCell", selectedIds[i], "enable");
				if(state==1){
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceProjectList_i18n_0, hideAfter: 3});
					return;
				}
			}
			shr.ats.AttendanceProjectList.superClass.deleteAction.call(this);
		}
	},batchDeleteAction:function(){	
		var clz = this;
		var $grid = $(clz.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var bills ;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var data = $("#grid").jqGrid("getRowData", selectedIds[i]);
				if(data["state"]==1){
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceProjectList_i18n_1, hideAfter: 3});
					return;
				}
			}
			shr.ats.AttendanceProjectList.superClass.batchDeleteAction.call(this);
		}
	}
	
	,addNewAction: function() {		
		this.reloadPage({
			uipk: this.getEditUIPK(),
			method: 'addNew',
			categoryId: categoryId, 
			categoryName:categoryName
		});
	}
	
});