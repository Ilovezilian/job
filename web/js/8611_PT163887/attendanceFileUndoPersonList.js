shr.defineClass("shr.ats.AttendanceFileUndoPersonList", shr.ats.FilePersonChangeList, {
    pageStep: 7,
    cache_key:"atsPersonChangeList_bill",
	initalizeDOM : function () {
		shr.ats.AttendanceFileUndoPersonList.superClass.initalizeDOM.call(this);
		var that = this;
	},
	createDialogDiv : function(){
		var _self = this;
		$('#importDiv').remove();
		var pageTag = _self.pageStep;
			// 未生成dialog
		var importDiv = $('<div id="importDiv"></div>').appendTo($('body'));
		$("#importDiv").empty();
		$("#importDiv").dialog({
			title: jsBizMultLan.atsManager_attendanceFileUndoPersonList_i18n_7,
			width:800,
			height:400,
			modal: true,
			resizable: true,
			position: {
				my: 'center',
				at: 'top+50%',
				of: window
			},
			buttons: [{
				text: jsBizMultLan.atsManager_attendanceFileUndoPersonList_i18n_6,
				click: function() {
					var dealType = "";
					 $('input[name="cb"]').each(function(){
						 if($(this).shrCheckbox("isSelected")){
							 dealType += $(this).attr("id")+",";
						 }
					 });
					if(dealType==""){
						dealType = "ignore";			
					}else{
						 dealType = dealType.substring(0,dealType.length-1);
					}
					 
					var $grid = $(_self.gridId);
					var ids = $grid.jqGrid('getGridParam','selarrrow');
					var gridData = [];
					for(var i in ids){
						gridData.push($grid.jqGrid('getRowData',ids[i]));
					}
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.PersonBURelaConfirmCFListHandler&method=receive&type=undo";
					openLoader(1,jsBizMultLan.atsManager_attendanceFileUndoPersonList_i18n_8);
					shr.ajax({
						type:"post",
						async:true,
						url:url,
						data:{
							"models":JSON.stringify(gridData),
							"ids":"",
							"dealType":dealType
							},
						success:function(res){
							closeLoader();
							window.location.reload();
						}
					});	
					 $(this).dialog( "close" );
				}
			},{
				text: jsBizMultLan.atsManager_attendanceFileUndoPersonList_i18n_5,
				click: function() {
					$(this).dialog( "close" );
				}
			}]
		});	
		var doc="";
		doc += '<div class="row-fluid row-block" style="margin-top: 20px;">'
				 + '<div class="col-lg-5 field-desc"/>'
				 + '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_attendanceFileUndoPersonList_i18n_3
			+ '">'
			+ jsBizMultLan.atsManager_attendanceFileUndoPersonList_i18n_3
			+ '</div></div>'
				 + '<div class="col-lg-1 field-ctrl">'
				 + '<div  style="position: relative;"><input type="checkbox" id="update" name="cb" value="1" dataextenal="" ></div> '
				 + '</div>'
				 + '<div class="col-lg-4"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_attendanceFileUndoPersonList_i18n_0
			+ '">'
			+ jsBizMultLan.atsManager_attendanceFileUndoPersonList_i18n_1
			+ '</div></div>'
				 + '<div class="col-lg-1 field-ctrl">'
				 + '<div  style="position: relative;"><input type="checkbox" id="disapprove" name="cb" value="1" dataextenal="" ></div> '
				 + '</div>'
				 + '</div>'
				 
				 +'<div class="row-fluid row-block" id = "tipDiv" >'
				 +'<div id = "tip1"><span>'
			+ jsBizMultLan.atsManager_attendanceFileUndoPersonList_i18n_4
			+ '</span></div>'
				 +'<div id = "tip2"><span>'
			+ jsBizMultLan.atsManager_attendanceFileUndoPersonList_i18n_2
			+ '</span></div>'
				 + '</div>'
		

		$("#importDiv").append(doc);
		$("#tipDiv").css("margin-top","60px");
		$("#tip1").css("padding-left","100px").css("padding-right","100px").css("color","red");
		$("#tip2").css("padding-left","100px").css("padding-right","100px").css("margin-top","10px").css("color","red");
		var checkbox_json = {
			id:"update",
			readonly: "",
			value: "1"
		};
		$('#update').shrCheckbox(checkbox_json);
		checkbox_json.id = "disapprove";
		$('#disapprove').shrCheckbox(checkbox_json);
	}
});