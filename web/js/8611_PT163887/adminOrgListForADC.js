shr.defineClass("shr.ats.adminOrgListForADC", shr.framework.List, {
	/**重载list.js的初始化方法，目的是为jqgrid加事件处理方法*/
	initalizeDOM:function(){
		shr.framework.List.superClass.initalizeDOM.call(this);
		
		// 添加单击行事件
		var _self = this;
		var $grid = $(this.gridId);
		$grid.jqGrid('option', {
			/*onCellSelect: function(rowid, iCol, cellcontent, e) {
				// 选择的是选择框
				if (iCol == 0) {
					return;
				}
				var billId = $(_self.gridId).jqGrid("getCell", rowid, _self.getBillIdFieldName());
				_self.viewAction(billId);
			}*/
			gridComplete:function(){
			   _self.addSelectCkb();
			}
		});
		
		// 快速查询添加事件
		$('#searcher').shrSearchBar('option', {
			afterSearchClick: this.queryGridByEvent
		});
		
		// 修改为通过URL取数
		$grid.jqGrid('setGridParam', {datatype:'json'});
		
		// 添加导航式列表相关事件
		if (this.isNavigateList) {
			var $treeNavigation = $("#treeNavigation");
			$treeNavigation.shrGridNavigation("option", {
				afterMenuClick: this.queryGridByEvent
			});	
			
			var value = $treeNavigation.shrGridNavigation('getValue');
			if ($.isEmptyObject(value)) {
				// 加载树节点
				$treeNavigation.shrGridNavigation("reloadRoot");
			}
		}
		
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
		
		$(document).click(function(e){
			var tar = e.target;
			if(!($(tar).hasClass('ui-paging-info') ||$(tar).hasClass('ui-pg-selbox'))){
				$('.shrPage').find('.ui-pg-selbox').hide();
				$('.shrPage').find('.ui-paging-info').show();
			}
		});
		
	}
	,deletePositionAction: function(){
		var selectedId = $("#grid").jqGrid("getSelectedRow");
		if (selectedId == undefined ) {
	        alert(jsBizMultLan.atsManager_adminOrgListForADC_i18n_3);
			return ;
	    }
		
		var _self = this;
		shr.showConfirm(jsBizMultLan.atsManager_adminOrgListForADC_i18n_1, function(){
			top.Messenger().hideAll();
			var data = {
					method: 'deletePosition',
					billId:  selectedId
				};
				data = $.extend(_self.prepareParam(), data);
				shr.doAction({
					url: _self.dynamicPage_url,
					type: 'post', 
						data: data,
						success : function(response) {					
							_self.reloadGrid();
						}
				});
		});
	}
	,addSelectCkb:function(){
		$('#grid_containChildYN').attr("aria-selected",false);
		$('#jqgh_grid_containChildYN').removeAttr("class");
	    $('#jqgh_grid_containChildYN').html(function(idx){
	    	var text='<input id="cb_containChild"  type="checkbox"  role="checkbox" />'
					+$('#jqgh_grid_containChildYN').text();
	       return text;
	    });
	    $('#jqgh_grid_containChildYN').toggle(function(event){
	    	 //$('#cb_containChild').attr("checked",true); //有其他监听处理导致会移除checked属性，通过动态改dom结构使监听失效
	    	 $('#jqgh_grid_containChildYN').html(function(idx){//利用事件的冒泡来增删checkbox
		    	var text= '<input id="cb_containChild"  type="checkbox" checked="checked" role="checkbox" />'
						+$('#jqgh_grid_containChildYN').text();
		       return text;
	   		 });
	         $("#grid tbody tr td[aria-describedby='grid_containChildYN'] input[type='checkbox']").attr("checked",true);
	     },function(event){
	    	 //$('#cb_containChild').removeAttr("checked");
	     	 $('#jqgh_grid_containChildYN').html(function(idx){
		    	var text= '<input id="cb_containChild"  type="checkbox"  role="checkbox" />'
		    	+$('#jqgh_grid_containChildYN').text();
		       return text;
	   		 });
	    	 $("#grid tbody tr td[aria-describedby='grid_containChildYN'] input[type='checkbox']").removeAttr("checked");
	    });
	    
	    //$(document).ready():时grid还没有渲染出来.  $(window).load()时也没出来。 捕获jqgrid的事件 gridComplete
	    $("#grid tbody tr td[aria-describedby='grid_containChildYN']").attr("style","text-align:center;");
	    $("#grid tbody tr td[aria-describedby='grid_containChildYN']").html(function(idx){
	       var text='<input  type="checkbox" role="checkbox" name="jqg_grid_containChild_'+idx+'" '
	       +' id="jqg_grid_containChild_'+idx+'" />';
	       return text;
	    });
	}
	,selectOkAction:function(){
	    var selectedIds=this.getSelectedIds();
	    var ii=0;
	    var ids=[],ctnClds=[];
	    for(ii=0;ii<selectedIds.length;ii++){
	      ids.push(selectedIds[ii].id);
	      ctnClds.push(selectedIds[ii].ctnCld)
	    }
	    
	    var _self = this;
	    var winPrt=window.parent;
	    var winPrtDoc=window.parent.document;
	    var attendanceCenterId=$('#attendCenterId',winPrtDoc).val()||'';
	    if(attendanceCenterId==''){
		    shr.showWarning({
				message: jsBizMultLan.atsManager_adminOrgListForADC_i18n_0
			});
			return false;
		}
	    if (selectedIds&&selectedIds.length>0) {
			//shr.showConfirm('您确认要选择这些行政组织？', function(){
				top.Messenger().hideAll();
				var data = {
					method: 'selectOk',
					ids: ids,
					ctnClds:ctnClds,
					attendanceCenterId:attendanceCenterId
				};
				data = $.extend(_self.prepareParam(), data);
				shr.doAction({
					url: _self.dynamicPage_url,
					type: 'post', 
						data: data,
						success : function(response) {
							top.Messenger().hideAll();
							if(response.length>0){
								var options={
								  message: response
								};
								$.extend(options, {
									type: 'info',
									hideAfter: null,
									showCloseButton: true
								});
								top.Messenger().post(options);	
							}else{
							   shr.showInfo({
							   	 message: jsBizMultLan.atsManager_adminOrgListForADC_i18n_4 //"操作成功:"+response
							   });
							}
							
							//window.parent.close_adminOrgUnitGroupDlg();
						}
				});	
			//});
	    }
	}
	/**
	 * 获得选中的ids,返回的是一个对象数组（除ID外还有其他信息）
	 */
	,getSelectedIds: function() {
		var $grid = $(this.gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var billIds = [];
			var isSealUpCount=0;
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var isSealUp=$grid.jqGrid("getCell", selectedIds[i], "isSealUp");
				if(isSealUp=='false'){//没封存，即启用
					var vid={};
					vid.id=$grid.jqGrid("getCell", selectedIds[i], "id");
					//alert($grid.jqGrid("getCell", selectedIds[i], "id"));
					//alert($grid.jqGrid("getCell", selectedIds[i], "containChildYN"));//containChildYN
					vid.ctnCld=$('tr[id="'+vid.id+'"] input[id^="jqg_grid_containChild_"]:checked').size();
					billIds.push(vid);
				}else{ 
					isSealUpCount++;
				}
			}
			//return billIds.toString();
			if(billIds.length==0){
			   shr.showWarning({
			     message: jsBizMultLan.atsManager_adminOrgListForADC_i18n_5
		       });
		       return ;
			}else{
				if(isSealUpCount>0){
				   shr.showWarning({
				     message: jsBizMultLan.atsManager_adminOrgListForADC_i18n_6
			       });
				}
				return   billIds;
			}
	    }
		
		shr.showWarning({
			message: jsBizMultLan.atsManager_adminOrgListForADC_i18n_2
		});
	}
	,viewAction: function(billId) {
		
	}
});