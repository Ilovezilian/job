function WorkShiftConst(){
	var that = this;
	this.name = "workShiftConst";
	
	that.SHIFT_SEGMENT_ONE = 1;
	that.SHIFT_SEGMENT_TWO = 2;
	that.SHIFT_SEGMENT_THREE = 3;
	
	
}
var workShiftConst = getTop().workShiftConst
if(!workShiftConst){
	getTop().workShiftConst = workShiftConst = new WorkShiftConst();
}