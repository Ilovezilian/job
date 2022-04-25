shr.defineClass("shr.ats.atsBreastFeedingTypeEdit", shr.ats.AtsMaintainBasicItemEdit, {
	initalizeDOM : function () {
		shr.ats.atsBreastFeedingTypeEdit.superClass.initalizeDOM.call(this);
		if(this.getOperateState()!=="VIEW"){
			$("#fetusNumView").shrSelect("addOption",[{alias:"1",value:1},{alias:"2",value:2},{alias:"3",value:3},{alias:"4",value:4}]);	
			$("#fetusNumView").shrSelect("option",{
				onChange:function(e, value){
					console.log(value);
					$("#fetusNum").val(value.selectVal)
				}
			})
		}
		
		if(this.getOperateState()=="VIEW"){
			$("#fetusNumView").text($("#fetusNum").val())
		}
		if(this.getOperateState()=="EDIT"){
			$("#fetusNumView").val($("#fetusNum").val())
		}
	}
	,enableFileAction: function() {
		
		
	}
	,disableFileAction: function() {
		
		
	},
	resetSelction:function(){
		 
	},
	assembleSaveData:function(action){
		var _self = this;
		var data = shr.ats.atsBreastFeedingTypeEdit.superClass.assembleSaveData.call(_self, action);
		var modelObj = JSON.parse(data.model);
		delete modelObj["fetusNumView"]
		data.model = JSON.stringify(modelObj);
		return data;
	}
	
});