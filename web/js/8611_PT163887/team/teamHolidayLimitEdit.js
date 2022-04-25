var isLastCycle = false;
shr.defineClass("shr.ats.team.TeamHolidayLimitEdit", shr.framework.Edit, {
   initalizeDOM:function(){
		shr.ats.team.TeamHolidayLimitEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		
		//获取是否最新的额度周期
//		that.getIsLastCycle();
		//默认不可选
		that.defaultDeal();
		that.dealLimitChange();
   }
   ,processF7ChangeEvent : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
		   
		}
	}
	,verify:function(){
	var cycleBeginDate = atsMlUtile.getFieldOriginalValue('cycleBeginDate');
	var cycleEndDate = atsMlUtile.getFieldOriginalValue('cycleEndDate');
	var effectDate = atsMlUtile.getFieldOriginalValue('effectDate');
	var delayDate = atsMlUtile.getFieldOriginalValue('delayDate');
	if(effectDate>delayDate){
	shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitEdit_i18n_0});
	return false;
	}
	if(effectDate<cycleBeginDate){
	shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitEdit_i18n_1});
	return false;
	}
	if(delayDate<cycleEndDate){
	shr.showInfo({message: jsBizMultLan.atsManager_holidayLimitEdit_i18n_2});
	return false;
	}
	return true;
	}
	,defaultDeal:function(){
	    var that = this ;
	    if(that.getOperateState() != 'VIEW'){
			/*
			 //20140113这两个字段不显示 
			 if ($('#holidayPolicy_isCtrlLimit:checked').length>0) {
				$('#holidayPolicy_isCtrlLimit').before("是");
			}else{
				$('#holidayPolicy_isCtrlLimit').before("否");
			}
			if ($('#holidayPolicy_isCanModifyLimit:checked').length>0) {
				$('#holidayPolicy_isCanModifyLimit').before("是");
			}else{
				$('#holidayPolicy_isCanModifyLimit').before("否");
			}*/
	    }	
		//if($('#holidayPolicy_isCtrlLimit:checked').length>0&&$('#holidayPolicy_isCanModifyLimit:checked').length>0){
		if($('#holidayPolicy_isCanModifyLimit').val()=='1'&&$('#status').val()=='0'){	
		}else{// 不可修改
			
			//$('#realLimit').attr("readonly",true);
			//$('#realLimit').attr("disabled","disabled");
			$('#addOrSubLimit').attr("readonly",true);
			$('#addOrSubLimit').attr("disabled","disabled");
			/*
			//下面几个属性，在视图上就readonly=true
			$('#remainLimit').attr("readonly",true);
			$('#remainLimit').attr("disabled","disabled");
			
			$('#usedLimit').attr("readonly",true);
			$('#usedLimit').attr("disabled","disabled");
			$('#freezeLimit').attr("readonly",true);
			$('#freezeLimit').attr("disabled","disabled");
			
			$('#standardLimit').attr("readonly",true);
			$('#standardLimit').attr("disabled","disabled");*/
			
			// 隐藏增减额度
		}
	}
	,dealLimitChange:function(){
	   /*$('#realLimit').change(function(){
	    	$('#remainLimit').val(
	    		this.value-$('#usedLimit').val()-$('#freezeLimit').val()
	    	);
	   });*/
		//重新计算实际额度
		$('#addOrSubLimit').change(function(){
//	    	$('#realLimit').val(
//	    		parseFloat(this.value)+parseFloat(atsMlUtile.getFieldOriginalValue('standardLimit'))
//	    	);
	    	$('#realLimit').shrNumberField('setValue',parseFloat(this.value)+parseFloat(atsMlUtile.getFieldOriginalValue('standardLimit')));
	    	
	   //重新计算剩余额度
	    	$('#remainLimit').val(
	    		parseFloat(atsMlUtile.getFieldOriginalValue('realLimit'))-parseFloat(atsMlUtile.getFieldOriginalValue('usedLimit'))-parseFloat(atsMlUtile.getFieldOriginalValue('freezeLimit'))
	    	);
	    	
	   });
	   
	}
	,getIsLastCycle:function(){
	   var that = this;
	   if(that.getOperateState() != 'VIEW'){
	   that.remoteCall({
				method: 'getIsLastCycle', 
				async: false,
				param: {
					"personId":$('#proposer_id').val(),
					"holidayPolicyId":$('#holidayPolicy_id').val(),
					"holidayLimitId":$('#id').val()
					
				},
				success: function(response) {
				isLastCycle = response.isLastCycle;
				}
				
			});
			}
	},
	saveAction: function(event) {
		var _self = this;
		
		if (_self.validate() && _self.verify()) {	
			var isOver = $('#holidayPolicy_isOver').val();
			var isOverAutoSub = $('#holidayPolicy_isOverAutoSub').val();
			var standardLimit = atsMlUtile.getFieldOriginalValue("standardLimit");
			var addOrSubLimit = atsMlUtile.getFieldOriginalValue("addOrSubLimit");
			var usedLimit = atsMlUtile.getFieldOriginalValue("usedLimit");
			var freezeLimit = atsMlUtile.getFieldOriginalValue("freezeLimit");
			var preOverdraftLimit = atsMlUtile.getFieldOriginalValue("preOverdraftLimit");
			if(isOver == 1){
				if(isOverAutoSub == 1){
					shr.showConfirm('温馨提示: 由于开启了超额下期扣减，修改了剩余额度会影响下期透支额度，需<font color="red">手工重算</font>当前期之后各期的额度！',function(){
						_self.doSave(event, 'save');
					})
				}else {
					_self.doSave(event, 'save');
				}
			}else {
				if((parseFloat(standardLimit)+parseFloat(addOrSubLimit)-parseFloat(usedLimit)-parseFloat(freezeLimit)-parseFloat(preOverdraftLimit)) < 0 ){
					shr.showInfo({message: "修改后的剩余额度不允许小于0"});
					return false;
				}else {
					_self.doSave(event, 'save');
				}
			}
		}else{
			if(_self != top){// in iframe
				shr.setIframeHeight(window.name);
			} 
				
		}	
	}
});
