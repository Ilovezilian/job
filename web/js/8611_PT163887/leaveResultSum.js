var orgLongNum="";
shr.defineClass("shr.ats.LeaveResultSum", shr.framework.List, {
	editViewDisable:true,
	initalizeDOM : function () {
		var that = this;
		that.processF7ChangeEvent();
		shr.ats.LeaveResultSum.superClass.initalizeDOM.call(this);
	}
    ,queryAction:function(){
		 var that = this;
		 var filterStr = "";
		 var filterStr1;
		 var filterStr2;
		 var array = new Array();
		 var atsDate = $("#atsDate").val();
		 if (atsDate != "") {
			atsDate=atsDate+" 00:00:00";
			filterStr1 =  " attandenceDate >= '"+atsDate+"' "; 
			array.push(filterStr1);
		}
		if (atsDate != "") {
			atsDate=atsDate+" 23:59:59";
			filterStr1 =  " attandenceDate <= '"+atsDate+"' "; 
			array.push(filterStr1);
		}
		if(orgLongNum!="")
		{
			filterStr1 =  " adminOrgUnit.longNumber like '"+orgLongNum+"%' "; 
			array.push(filterStr1);
		}
		for (var i = 0; i < array.length; i++) {
			if (i == array.length-1) {
				filterStr = filterStr + array[i]
			}else{
				filterStr = filterStr + array[i] + "and ";
			}
		}
		// var filterStr=that.getCustomFilterItems();
		 $("#grid").jqGrid("option", "filterItems", filterStr).jqGrid("reloadGrid");
	}
		//excel导入
	,importAction: function(){
		var curIOModelString = "com.kingdee.eas.hr.ats.app.AtsImportAttendanceResult";
		this.doImportData(curIOModelString);
	},
	processF7ChangeEvent : function(){
		var that = this;
		$('#adminOrg').shrPromptBox("option", {
			onchange : function(e, value) {
               var info = value.current;
			   var adminOrgLongNumber;
			   if(info!=null){
			   if(info.longNumber !=null && info.longNumber!=''){ 
			   		orgLongNum=info.longNumber;
			   }

			}
			}
		});

	
  }
});  