shr.defineClass("shr.ats.AttenceStateList", shr.ats.AtsMaintainBasicItemList, {
	 
	initalizeDOM : function () {
		shr.ats.AttenceStateList.superClass.initalizeDOM.call(this);
	}
    // ,/**
	//  * 描述:删除操作
	//  * @action 
	//  */
	// deleteAction:function(){		
	// 	var selectedIdsAndisSysPresetCnt = this.getSelectedIds(1);
	// 	if (selectedIdsAndisSysPresetCnt) {
	// 		this.deleteRecord(selectedIdsAndisSysPresetCnt);
	// 	}
	// }
	
	// /**
	//  * 获得选中的id
	//  */
	// ,getSelectedIds: function(opt) {
	// 	var $grid = $(this.gridId);
	// 	var selectedIds = $grid.jqGrid("getSelectedRows");
	// 	if (selectedIds.length > 0) {
	// 		var billIds = [];
	// 		var isSysPresetCnt=0;
			
	// 		for (var i = 0, length = selectedIds.length; i < length; i++) {
	// 			var isSysPreset=$grid.jqGrid("getCell", selectedIds[i], "isSysPreset");
	// 			if(isSysPreset==0){
	// 				billIds.push($grid.jqGrid("getCell", selectedIds[i], "id"));
	// 			}else{//预置数据
	// 				isSysPresetCnt++;
	// 			}
	// 		}
	// 		//return billIds.toString();
	// 		if(billIds.length==0){
	// 		   shr.showWarning({
	// 		     message: "选中的全是预置数据，预置数据不能删除!"
	// 	       });
	// 	       return ;
	// 		}else{
	// 			return  {
	// 			   selectedIds:billIds.join(','),
	// 			   isSysPresetCnt:isSysPresetCnt
	// 			};
	// 		}
	//     }
		
	// 	shr.showWarning({
	// 		message: "请先选中要删除的数据!"
	// 	});
	// }
	
	// /**
	//  * 描述:删除操作 
	//  */
	// ,deleteRecord:function(selectedIdsAndisSysPresetCnt) {
	// 	var _self = this;
	// 	var msg="您确认要删除吗？";
	// 	if(selectedIdsAndisSysPresetCnt.isSysPresetCnt>0){
	// 		msg="存在预置数据，删除时将忽略预置数据。 您确认要删除吗？";
	// 	}
	// 	shr.showConfirm(msg, function(){
	// 		top.Messenger().hideAll();
			
	// 		var data = {
	// 			method: 'delete',
	// 			billId: selectedIdsAndisSysPresetCnt.selectedIds 
	// 		};
	// 		data = $.extend(_self.prepareParam(), data);
			
	// 		shr.doAction({
	// 			url: _self.dynamicPage_url,
	// 			type: 'post', 
	// 				data: data, //这种方式即不是直接在地址栏传参数，ajax自动帮我们对url编码(特殊字符)
	// 				success : function(response) {	
	// 					top.Messenger().hideAll();
	// 					shr.showInfo({
	// 						   message: '删除成功' 
	// 					});
	// 					_self.reloadGrid();
	// 				}
	// 		});	
	// 	});
	// }
});