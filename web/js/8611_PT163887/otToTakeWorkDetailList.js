var orgLongNum="";
shr.defineClass("shr.ats.otToTakeWorkDetailList", shr.framework.List, {
	initalizeDOM:function(){
		var _self = this;
		shr.ats.otToTakeWorkDetailList.superClass.initalizeDOM.call(_self);
		var proposerIds = shr.getRequestParam("proposerIds");
	}
	,onCellSelect: function(rowid, colIndex, cellcontent, e) {
		return;
	}
});
	
