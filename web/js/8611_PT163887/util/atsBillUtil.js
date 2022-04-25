(function($) {
jQuery.atsBillUtil={
	isInWorkFlow:function(billId){   
		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=checkIsInWorkFlow';
		var flag = false ;
		shr.ajax({
			type:"post",
			async:false,
			url:url,
			data:{billId:billId},
			success:function(res){
				if(res)
				{    
					if(res.isInWorkFlow=="1"){
						flag=true;
					}
				}
			}
		});
		return flag;
	}
	,abortWorkFlow:function(billId){   
		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=abortWorkFlow';
		var flag = false ;
		shr.ajax({
			type:"post",
			async:false,
			url:url,
			data:{billId:billId},
			success:function(res){
				
			}
		});
	}
	/**
	 * 获得选中的id,且满足选中的数据仅是未提交的数据。
	 */
	,getSelectedIds: function() {
		var $grid = $(shr.getCurrentViewPage().gridId);
		var selectedIds = $grid.jqGrid("getSelectedRows");
		if (selectedIds.length > 0) {
			var billIds = [];
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var billState=$grid.jqGrid("getCell", selectedIds[i], "billState")||0;
				if(billState==0){
					billIds.push($grid.jqGrid("getCell", selectedIds[i], "id"));
				}
			}
			if(billIds.length<selectedIds.length){
				shr.showWarning({
					message: $.attendmanageI18n.atsBillUtil.msg1
				});
			}else{
				return billIds.toString();
			}
	    }
	}
	,abortBill: function(_self){
		var billId = $("#grid").jqGrid("getSelectedRows");
		
		if (billId == undefined || billId.length==0 || (billId && billId.length == 1 && billId[0] == "")) {
			shr.showWarning({message : $.attendmanageI18n.atsBillUtil.msg2});
			return ;
	    }else if(billId.length>1){
			shr.showWarning({message : $.attendmanageI18n.atsBillUtil.msg3});
			return ;
		}
		var billState = $("#grid").jqGrid("getCell", $("#grid").jqGrid("getSelectedRows"),"billState");
		if(billState != 1)
		{
			shr.showWarning({message : $.attendmanageI18n.atsBillUtil.msg4});
			return ;
		}
		
		shr.showConfirm($.attendmanageI18n.atsBillUtil.msg5, function(){
			top.Messenger().hideAll();
			
			var data = {
				method: 'abortBill',
				billId: billId[0]
			};
			data = $.extend(_self.prepareParam(), data);
			
			shr.doAction({
				url: _self.dynamicPage_url,
				type: 'post', 
					data: data,
					success : function(response) {	
						shr.showInfo({message: $.attendmanageI18n.atsBillUtil.msg6});
						_self.reloadGrid();
					}
			});	
			
		});
	}
	//是否显示弹性段算时长控件
	,showIsElasticCalCtrl:function(_self,personId,holidayPolicyId,beginTime,endTime,callback){
		var url = shr.getContextPath()+'/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsBillBaseEditHandler&method=showIsElasticCalCtrl';
		var showIsElasticCalCtrl = false ;
		shr.ajax({
			type:"post",
			async:false,
			url:url,
			data:{
				personId:personId,
				holidayPolicyId:holidayPolicyId,
				beginTime:beginTime,
				endTime:endTime
				},
			success:function(res){
				showIsElasticCalCtrl = res.showIsElasticCalCtrl;
				if(callback){
					callback.call(_self,showIsElasticCalCtrl);//有回调按回调处理
				}else{
					if(showIsElasticCalCtrl){//默认逻辑统一处理
//						$("#entries_isElasticCalLen").shrCheckbox("unCheck");
						$("#entries_isElasticCalLen").parent().parent().parent().show();
					}else{
						if(shr.getUrlRequestParam('method') =='view'){
						$("#entries_isElasticCalLen").parent().parent().hide();
						}else{
						if(shr.getUrlRequestParam('uipk') != "com.kingdee.eas.hr.ats.app.AtsLeaveBillFormWorkflow" && shr.getUrlRequestParam('uipk') != "com.kingdee.eas.hr.ats.app.AtsTripBillFormWorkflow"
						&& shr.getUrlRequestParam('uipk') != "com.kingdee.eas.hr.ats.app.CancelLeaveBillFormWorkflow" && shr.getUrlRequestParam('uipk') != "com.kingdee.eas.hr.ats.app.CanTripBillFormWorkflow"){
						$("#entries_isElasticCalLen").parent().parent().parent().hide();
						}
						}
					}
				}
			}
		});
	}
	,addSocQueryTipA: function(tip) {
		var _self = this;
		var tips = $("#"+tip);
		var tipLog = tip+"-dialog";
		tips.parent().find(".field_label").append(tips);
		tips.prop("title", "");
		tips.css({"display": "inline-block"});
		if(tips&&tips.offset()){
		var x = tips.offset().top + 17; 
		var y = tips.offset().left + 10; 
		$(document).on("hover", "#"+tip, event, function (event) {
			event.stopImmediatePropagation();
			event.returnValue = false;
			var id = event.target.id;
//			var $tipsLayout = $("#tips-dialog");
			var $tipsLayout = $("#"+tipLog);
			var isInTipsLayout =  $tipsLayout && $tipsLayout.length ? true : false; 
//			if (id !== tip && id !== "tips-dialog" && !isInTipsLayout) {
			if (id !== tip && id !== tipLog && !isInTipsLayout) {
				if (!$tipsLayout.is(':hidden')) {
					$tipsLayout.fadeOut();
				}
			} else if (id === tip) {
				if ($tipsLayout.is(':hidden')) {
					$tipsLayout.fadeIn();
				} else {
					$tipsLayout.fadeOut();
				}
			}		
		});
		}
		
	}
}
}( jQuery ));