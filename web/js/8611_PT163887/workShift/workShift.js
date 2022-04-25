shr.defineClass("shr.ats.workShift",shr.framework.Core, {
	initalizeDOM:function(){
		shr.ats.workShift.superClass.initalizeDOM.call(this);
	}
	,refreshCurrentView : function(){
		var that = this;
		var arrangeShiftType = workShiftStrategy.getArrangeShiftType();
		if(arrangeShiftType === workShiftStrategy.SHIFT_TYPE_CALENDAR){
			that.calendarShift();
		}else if(arrangeShiftType === workShiftStrategy.SHIFT_TYPE_LIST ||
			arrangeShiftType === workShiftStrategy.SHIFT_TYPE_VER_SHIFT ||
			arrangeShiftType === workShiftStrategy.SHIFT_TYPE_NOSHIFT){
			that.listShift();
		}
		
	}
	,listShift:function(personsNums){
		listWorkShift.renderListTable(personsNums);
		
	}
	,calendarShift:function(){
		calandarWorkShift.initCalandar(true);
		workShiftStrategy.rerenderCalandarWhenOnly();
		
	}
    ,deleteAction:function(){
    	var selectedIds = listWorkShift.getCheckedRowIds();
    	if(!selectedIds || selectedIds.length == 0){
    		atsCommonUtile.showWarning(jsBizMultLan.atsManager_workShift_i18n_0);
    		return;
    	}
    	listWorkShift.deleteRow(selectedIds);
    }
    ,turnShiftAddAction:function(){
    	
		workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_TURN);
		workShiftStrategy.arrangeWorkShift(personNums,that.getHrorgUnit());
	}
	,saveAction:function(hrOrgUnitId){
		var schedules;
		if(workShiftStrategy.getSelectedStaffNum().length == 0){
			atsCommonUtile.showWarning( jsBizMultLan.atsManager_workShift_i18n_0);
			return;
		}
		var arrangeType = workShiftStrategy.getArrangeShiftType();
		if(arrangeType == workShiftStrategy.SHIFT_TYPE_CALENDAR){
			schedules = calandarWorkShift.getDateData().filter(function(shift){
				return !shift.hasSaved && shift.dayType;
			}).map(function(shift){
				return {
					dayType : workShiftStrategy.getDayTypeIndex(shift.dayType),
					attendDate : atsCommonUtile.formateDate(shift.start),
					segment : shift.segment,
					turnShiftId : shift.turnShiftId,
					shiftName : shift.shiftName
				}
			});
		}else if(arrangeType === workShiftStrategy.SHIFT_TYPE_LIST ||
			arrangeType === workShiftStrategy.SHIFT_TYPE_VER_SHIFT ||
			arrangeType === workShiftStrategy.SHIFT_TYPE_NOSHIFT){
			var allShift = listWorkShift.getListData();
			var shift;
			var personShift;
			for(var personNum in allShift){
				if(allShift[personNum]){
					personShift = undefined;
					for(var attendDate in allShift[personNum]){
						shift = allShift[personNum][attendDate];
						if(shift && shift.dayType && !shift.hasSaved){
							personShift || (personShift = []);
							personShift.push(
								{
									attendDate : attendDate,
									dayType : workShiftStrategy.getDayTypeIndex(shift.dayType),
									turnShiftId : shift.turnShiftId,
									segment : shift.segment,
									shiftName : shift.shiftName
								});
						}
					}
					personShift && !schedules (schedules = {});
					personShift && (schedules[personNum] = personShift);
				}
			}
		}
		workShiftStrategy.saveShiftData(schedules,hrOrgUnitId);
	}
	,getHrorgUnit:function(){
		return JSON.stringify($("#hrOrgUnit").shrPromptBox('getValue'));
	}

	/*
	 * 班次排班
	 */
	,shiftSchedulingAction:function(){
		workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_SCHEDULE);
		workShiftStrategy.arrangeWorkShift(null,that.getHrorgUnit());
	}
	,arrangeByCopyWorkShiftAction:function(){
		workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_COPY_SELF);
		workShiftStrategy.arrangeWorkShift(personNums,that.getHrorgUnit());
	}
});

