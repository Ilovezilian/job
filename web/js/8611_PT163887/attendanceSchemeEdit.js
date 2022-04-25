shr.defineClass("shr.ats.AttendanceSchemeEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.AttendanceSchemeEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		//要使用$(window).load()页面内容加载完触发，因为要使用到内容   //$(document).ready()只是"dom***结构***"加载完
		$(window).load(function(){
			var mainId=$('#form #id').val()||'';
			if(mainId==''){
				$('#attencePolicyGroup').hide();
				$('#holidayPolicySetGroup').hide();
				$('#atsShiftGroup').hide();
			}else{
				var options={};
				
				that.operateAttencePolicyGrid();
				that.operateHolidayPolicySetGrid();
				that.operateAtsShiftGroupGrid();
				
				$("a.attencePolicyActClass").live('click',function(){
					//var iidd=$(this).val();
					var iidd=$(this).attr('value');
				    options={
						uipk: 'com.kingdee.eas.hr.ats.app.AttencePolicy.form',
						billId:iidd,
						method: 'view'
					};
					that.reloadPage(options);
				});
				$("a.holidayPolicySetActClass").live('click',function(){
					//var iidd=$(this).val();
					var iidd=$(this).attr('value');
				    that.reloadPage({
						uipk: 'com.kingdee.eas.hr.ats.app.HolidayPolicy4Set.form',
						relatedFieldId: iidd,
						method: 'initalizeData'
					});			
				});
				$("a.atsShiftActClass").live('click',function(){
					//var iidd=$(this).val();
					var iidd=$(this).attr('value');
				    options={
						uipk: 'com.kingdee.eas.hr.ats.app.AtsShift.form',
						billId:iidd,
						method: 'view'
					};
					that.reloadPage(options);
				});
			}
			
			
		});
	}
	 
	,operateAttencePolicyGrid:function(){
		
		jQuery("#navgrid_attencePolicy").jqGrid({
		   	url:shr.getContextPath()+'/dynamic.do?method=getAttencePolicys',
		   	postData:{
		   	  "uipk":"com.kingdee.eas.hr.ats.app.AttendanceScheme.form",
		   	  "attendanceSchemeId":$('#form #id').val()||''
		   	},
			datatype: "json",
		   	colNames:["id"
				,'编码'
				,'名称'
				,'是否默认'
				,'设置'
			],
		   	shrinkToFit:true,
		   	forceFit:true,
		   	sortable:false,
		   	colModel:[
		   	    {name:'id',index:'id', hidden:true},
				{name:'number',index:'number',sortable:false},
		   		{name:'name',index:'name',sortable:false},
		   		{name:'isAttCtDefault',index:'isAttCtDefault',sortable:false,
		   		   formatter:function(cellvalue, options, rowObject){
		   		  	  if(cellvalue==false){
		   		  	    return '否';
		   		  	  }else if(cellvalue==true){
		   		  	  	return '是';
		   		  	  }else{
		   		  	  	return "";
		   		  	  }
		   		  }
		   		},
		   		{name:'act',index:'act',sortable:false,formatter:function(cellvalue, options, rowObject){
		   		  	  var se = "<a style=\"text-decoration:underline;\" class='attencePolicyActClass' value='"+rowObject["id"]+"'  href='javascript:void(0);'>"
						  + '设置'
						  + "</a>";
		   		      return se;
		   		  }
		   		}
		   	],
		   	//jsonReader参数：total 总页数  page 当前页  records	查询出的记录数  rows 包含实际数据的数组    id 行id  cell 当前行的所有单元格
		   	jsonReader : {  
			     root: "rows",  
			     records: "records" 
  			}, 
		   	rowNum:-1,//每页显示条数
		   	pager: '#pagernav_attencePolicy',
		   	pagerpos:'left',
		   	pgbuttons:false,
		   	pginput:false,
		   	recordtext:'共{2}条',
		    viewrecords: true,
		    multiselect: true,
			gridComplete: function(data){}
	    });
	   
	}
	,operateHolidayPolicySetGrid:function(){

		jQuery("#navgrid_holidayPolicySet").jqGrid({
		   	url:shr.getContextPath()+'/dynamic.do?method=getHolidayPolicySets',
		   	postData:{
		   	  "uipk":"com.kingdee.eas.hr.ats.app.AttendanceScheme.form",
		   	  "attendanceSchemeId":$('#form #id').val()||''
		   	},
			datatype: "json",
		   colNames:['id'
			   ,'编码'
			   ,'名称'
			   ,'是否默认'
			   ,'设置'
		   ],
		   	shrinkToFit:true,
		   	forceFit:true,
		   	sortable:false,
		   	colModel:[
		   	    {name:'id',index:'id', hidden:true},
				{name:'number',index:'number',sortable:false},
		   		{name:'name',index:'name',sortable:false},
		   		{name:'isAttCtDefault',index:'isAttCtDefault',sortable:false,
		   		   formatter:function(cellvalue, options, rowObject){
		   		  	  if(cellvalue==false){
		   		  	    return '否';
		   		  	  }else if(cellvalue==true){
		   		  	  	return '是';
		   		  	  }else{
		   		  	  	return "";
		   		  	  }
		   		  }
		   		},
		   		{name:'act',index:'act',sortable:false,formatter:function(cellvalue, options, rowObject){
		   			  var se = "<a style=\"text-decoration:underline;\" class='holidayPolicySetActClass' value='"+rowObject["id"]+"'  href='javascript:void(0);'>"
						  + '设置'
						  + "</a>";
		   		      return se;
		   		  }
		   		}
		   	],
		   	//jsonReader参数：total 总页数  page 当前页  records	查询出的记录数  rows 包含实际数据的数组    id 行id  cell 当前行的所有单元格
		   	jsonReader : {  
			     root: "rows",  
			     records: "records" 
  			}, 
		   	rowNum:-1,//每页显示条数
		   	pager: '#pagernav_holidayPolicySet',
		   	pagerpos:'left',
		   	pgbuttons:false,
		   	pginput:false,
		   	recordtext:'共{2}条',
		    viewrecords: true,
		    multiselect: true,
			gridComplete: function(data){}
	    });
	}
	,operateAtsShiftGroupGrid:function(){ 

		jQuery("#navgrid_atsShift").jqGrid({
		   	url:shr.getContextPath()+'/dynamic.do?method=getAtsShifts',
		   	postData:{
		   	  "uipk":"com.kingdee.eas.hr.ats.app.AttendanceScheme.form",
		   	  "attendanceSchemeId":$('#form #id').val()||''
		   	},
			datatype: "json",
		   	colNames:['id',
				'编码',
				'名称',
				'是否默认',
				'设置'
			],
		   	shrinkToFit:true,
		   	forceFit:true,
		   	sortable:false,
		   	colModel:[
		   	    {name:'id',index:'id', hidden:true},
				{name:'number',index:'number',sortable:false},
		   		{name:'name',index:'name',sortable:false},
		   		{name:'isAttCtDefault',index:'isAttCtDefault',sortable:false,
		   		   formatter:function(cellvalue, options, rowObject){
		   		  	  if(cellvalue==false){
		   		  	    return '否';
		   		  	  }else if(cellvalue==true){
		   		  	  	return '是';
		   		  	  }else{
		   		  	  	return "";
		   		  	  }
		   		  }
		   		},
		   		{name:'act',index:'act',sortable:false,formatter:function(cellvalue, options, rowObject){
		   		  	  var se = "<a style=\"text-decoration:underline;\" class='atsShiftActClass' value='"+rowObject["id"]+"'  href='javascript:void(0);'>"
						  + '设置'
						  + "</a>";
		   		      return se;
		   		  }
		   		}
		   	],
		   	//jsonReader参数：total 总页数  page 当前页  records	查询出的记录数  rows 包含实际数据的数组    id 行id  cell 当前行的所有单元格
		   	jsonReader : {  
			     root: "rows",  
			     records: "records" 
  			}, 
		   	rowNum:-1,//每页显示条数
		   	pager: '#pagernav_atsShift',
		   	pagerpos:'left',
		   	pgbuttons:false,
		   	pginput:false,
		   	recordtext:'共{2}条',
		    viewrecords: true,
		    multiselect: true,
			gridComplete: function(data){}
	    });
	}
	
	,add_attencePolicyAction:function(){
        this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AttencePolicy.form',
			"attendanceSchemeId":$('#form #id').val()||'',
			method: 'addNew'
		});
	}
	,delete_attencePolicyAction:function(){ 
	   var billIds=this.getSelectedAttencePolicyIds();
	   if (billIds&&billIds.length>0) {
			var _self = this;
			var msg='您确认要删除吗？';
			shr.showConfirm(msg, function(){
				top.Messenger().hideAll();
				shr.doAjax({
					url: shr.getContextPath()+"/dynamic.do?method=deleteAttencePolicys",
					dataType:'json',
					type: "POST",
					data: {
						"uipk":"com.kingdee.eas.hr.ats.app.AttendanceScheme.form",
						"idArr":billIds //传递的是一个数组，后台参数名变为 idArr[]
					},
					success: function(data){ 
						jQuery("#navgrid_attencePolicy").setGridParam({
		 		    	    url:shr.getContextPath()+'/dynamic.do?method=getAttencePolicys',
						   	postData:{
						   	  "uipk":"com.kingdee.eas.hr.ats.app.AttendanceScheme.form",
		   	  				   "attendanceSchemeId":$('#form #id').val()||''
						   	}
						}).trigger("reloadGrid");
					}
			    });
			});
	   }
	}
	,getSelectedAttencePolicyIds: function() {
		var $grid = $('#navgrid_attencePolicy');
		var selectedRows = $grid.jqGrid("getSelectedRows");
		if (selectedRows.length > 0) {
			var billIds = [];
			for (var i = 0, length = selectedRows.length; i < length; i++) {
				billIds.push($grid.jqGrid("getCell", selectedRows[i], "id"));
			}
			return  billIds;
	    }
		
		shr.showWarning({
			message: '请先选中表格中的数据!'
		});
		return null;
	}
	
	
	,add_holidayPolicySetAction:function(){
        this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.HolidayPolicySet.form',
			"attendanceSchemeId":$('#form #id').val()||'',
			method: 'addNew'
		});
	}
	,delete_holidayPolicySetAction:function(){ 
	   var billIds=this.getSelectedHolidayPolicySetIds();
	   if (billIds&&billIds.length>0) {
			var _self = this;
			var msg='您确认要删除吗？';
			shr.showConfirm(msg, function(){
				top.Messenger().hideAll();
				shr.doAjax({
					url: shr.getContextPath()+"/dynamic.do?method=deleteHolidayPolicySets",
					dataType:'json',
					type: "POST",
					data: {
						"uipk":"com.kingdee.eas.hr.ats.app.AttendanceScheme.form",
						"idArr":billIds //传递的是一个数组，后台参数名变为 idArr[]
					},
					success: function(data){ 
						jQuery("#navgrid_holidayPolicySet").setGridParam({
		 		    	    url:shr.getContextPath()+'/dynamic.do?method=getHolidayPolicySets',
						   	postData:{
						   	  "uipk":"com.kingdee.eas.hr.ats.app.AttendanceScheme.form",
		   	  				   "attendanceSchemeId":$('#form #id').val()||''
						   	}
						}).trigger("reloadGrid");
					}
			    });
			});
	   }
	}
	,getSelectedHolidayPolicySetIds: function() {
		var $grid = $('#navgrid_holidayPolicySet');
		var selectedRows = $grid.jqGrid("getSelectedRows");
		if (selectedRows.length > 0) {
			var billIds = [];
			for (var i = 0, length = selectedRows.length; i < length; i++) {
				billIds.push($grid.jqGrid("getCell", selectedRows[i], "id"));
			}
			return  billIds;
	    }
		
		shr.showWarning({
			message: '请先选中表格中的数据!'
		});
		return null;
	}
	
	,add_atsShiftAction:function(){
        this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.AtsShift.form',
			"attendanceSchemeId":$('#form #id').val()||'',
			method: 'addNew'
		});
	}
	,delete_atsShiftAction:function(){ 
	   var billIds=this.getSelectedAtsShiftIds();
	   if (billIds&&billIds.length>0) {
			var _self = this;
			var msg='您确认要删除吗？';
			shr.showConfirm(msg, function(){
				top.Messenger().hideAll();
				shr.doAjax({
					url: shr.getContextPath()+"/dynamic.do?method=deleteAtsShifts",
					dataType:'json',
					type: "POST",
					data: {
						"uipk":"com.kingdee.eas.hr.ats.app.AttendanceScheme.form",
						"idArr":billIds //传递的是一个数组，后台参数名变为 idArr[]
					},
					success: function(data){ 
						jQuery("#navgrid_atsShift").setGridParam({
		 		    	    url:shr.getContextPath()+'/dynamic.do?method=getAtsShifts',
						   	postData:{
						   	  "uipk":"com.kingdee.eas.hr.ats.app.AttendanceScheme.form",
		   	  				   "attendanceSchemeId":$('#form #id').val()||''
						   	}
						}).trigger("reloadGrid");
					}
			    });
			});
	   }
	}
	,getSelectedAtsShiftIds: function() {
		var $grid = $('#navgrid_atsShift');
		var selectedRows = $grid.jqGrid("getSelectedRows");
		if (selectedRows.length > 0) {
			var billIds = [];
			for (var i = 0, length = selectedRows.length; i < length; i++) {
				billIds.push($grid.jqGrid("getCell", selectedRows[i], "id"));
			}
			return  billIds;
	    }
		
		shr.showWarning({
			message: '请先选中表格中的数据!'
		});
		return null;
	}
});

