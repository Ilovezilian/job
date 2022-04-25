(function($) {
jQuery.fastFilterValidateUtil={
	/**
	 * 判断过滤条件必填,如果为空,显示提示信息，过滤区域不隐藏
	 */
	requiredValidate: function(self,obj,showMsg){
		var flag = true;
		if(self.getFastFilterItems()){
			var filterItem = self.getFastFilterItems()[obj["name"]];
			if(filterItem != undefined && filterItem.values != ""){
				if(filterItem.dataType == "Date"){//日期
					if(filterItem.values["startDate"] == "" || filterItem.values["endDate"] == ""){
						flag = false;
					}
				}else if(filterItem.dataType == "dateTime"){//周期
					if(filterItem.values["startDatetime"] == "" || filterItem.values["endDatetime"] == ""){
						flag = false;
					}
				}
			}else {
				flag = false;
			}
			if(!flag){
				//显示过滤条件框
				if($(".filter-containers").is(":hidden")){
					$("#filter-slideToggle").click();
				}
				if(showMsg == undefined || showMsg == true){
					shr.showWarning({message : obj["errorMessage"],hideAfter: 3});
				}
			}
		}else{
			flag = false;
		}
		return flag;
	},
	/**
	 *校验时间范围是否合格,请先使用上面的方法检验数据已经填写.
	 */
	requiredDateRangeValidate: function(self,obj){
		var flag = true;
		if(self.getFastFilterItems()){
			var filterItem = self.getFastFilterItems()[obj["name"]];
			if(filterItem != undefined && filterItem.values != ""){
				if(filterItem.dataType == "Date"){//日期
					var startDate = filterItem.values["startDate"];
					var endDate = filterItem.values["endDate"];
					if(startDate == "" || endDate == ""){
						flag = false;
					} else if(new Date(endDate).getTime() - new Date(startDate).getTime() > obj["milliSecondRange"]){
						flag = false;
					}

				}else if(filterItem.dataType == "dateTime"){//周期
					var startDatetime = filterItem.values["startDatetime"];
					var endDatetime = filterItem.values["endDatetime"];
					if(startDatetime == "" || endDatetime == ""){
						flag = false;
					} else if (new Date(endDatetime).getTime() - new Date(startDatetime).getTime() > obj["milliSecondRange"]){
						flag = false;
					}
				}
			}else {
				flag = false;
			}
			if(!flag){
				//显示过滤条件框
				if($(".filter-containers").is(":hidden")){
					$("#filter-slideToggle").click();
				}
				shr.showWarning({message : obj["errorMessage"],hideAfter: 3});
			}
		}else{
			flag = false;
		}
		return flag;
	}
}
}( jQuery ));