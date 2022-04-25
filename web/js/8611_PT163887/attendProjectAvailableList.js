/* var categoryId = "";
var categoryName = "";
var filterItem = "";*/
var sorterItem = "baseInfo.sortNo ASC"; 
var categoryId = "";
var categoryName = "";
var filterItem = "";
shr.defineClass("shr.ats.AttendProjectAvailableList", shr.ats.AtsAvailableBasicItemList, {

	handler : "" ,
    displayType : {"onlyDetail":"1","onlyGroup":"2","detailAndGroup":"3","disDisplay":"4"} ,	
	initalizeDOM : function () {
		shr.ats.AttendProjectAvailableList.superClass.initalizeDOM.call(this);
		var that = this;
//		attendanceProjectListObject = shr.createObject(shr.ats.AttendanceProjectList);
		// attendanceProjectListObject.operateState =this.getOperateState() ;
		// attendanceProjectListObject.setSorterItems("baseInfo.sortNo ASC");
//    	attendanceProjectListObject.sorterItem = "" ;
//		attendanceProjectListObject.initData = that.initData;
		handler = "com.kingdee.shr.ats.web.handler.AtsAvailableBasicItemListHandler";
//		attendanceProjectListObject.initNavigation(); 
/* 		var $grid = $(this.gridId);
		$grid.jqGrid("option", "sorterItems", sorterItem); */
		$(".tabbable").css({"margin-left": "20%"});
		$("[href='#tab1']").css({"color":"#333","font-weight": '600',"font-size":"13px"});
		$(".tabbable [href!='#tab1']").css({"color":"#6B6B6B","font-size":"11px"});
		//$("#fastFilter-area").parent().width($("#gbox_grid").width()+3);//控制快速过滤窗口的宽度
		$("#fastFilter-area").parent().css({"left":"7.5%","width": $("#gbox_grid").width() + 'px'});
		that.initNavigation();
	},
	onlyDetailAction : function(){
	   this._setDisDisplay(this.displayType.onlyDetail);
	},
	
	onlyGroupAction : function(){
	   this._setDisDisplay(this.displayType.onlyGroup);
	},
	
	detailAndGroupAction : function(){
	   this._setDisDisplay(this.displayType.detailAndGroup);
	},
	
	disDisplayAction : function(){
	   this._setDisDisplay(this.displayType.disDisplay);
	},
	
	_setDisDisplay: function (displayType) {
		var billIds = this.getSelectedIds();
		if (!billIds || billIds.length === 0) {
			return;
		}
		this._doAjax({
			whichAction: "setDisplay",
			data: {
				billIds: billIds,
				displayType : displayType
			}
		});
	},
	cancelAction:function(){
	   this.back() ;
	},initNavigation: function(){
		var that = this;
		var divStr = [];
		divStr.push("<div class='tabbable tabs-left'>");
		divStr.push(" <ul class='nav nav-tabs'>");
		divStr.push("<li class='active'><a href='#tab1' data-toggle='tab' id='cat1'>"
			+ jsBizMultLan.atsManager_attendProjectAvailableList_i18n_0
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
});