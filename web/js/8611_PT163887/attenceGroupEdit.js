var _stateVal;
shr.defineClass("shr.ats.AttenceGroupEdit", shr.ats.AtsMaintainBasicItemEdit, {
	_listDatas : [], //每次增加人数信息的时候，增量增加员工信息
	initalizeDOM:function(){
		shr.ats.AttenceGroupEdit.superClass.initalizeDOM.call(this);
		_stateVal = this;
       if(this.getOperateState() == 'VIEW'){
			_stateVal.attenceGroupList();
		}
		 if(this.getOperateState() == 'ADDNEW'){
		$("#usePolicy").shrSelect("setValue",100);
		}
	}
	,attenceGroupList: function(){
			var that = this;
			var param = {"billId":jsBinder.billId};
			var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AttenceGroupItem.list$page','view',param);
			shr.loadHTML({ 
				url : url,			
				success : function(response) {
				/*	$('#datagrid').empty();
					$('#mainTitle').empty();
					$('#microToolbar').empty();*/
					$('#datagrid').append(response);
				
					/*$("#sidebar").hide();
					$('#microToolbar').removeClass("ui-state-default ui-jqgrid-pager ui-corner-bottom");
					$('#pg_microToolbar').find('tbody').css('float','right');
					$('#pg_microToolbar').find('tbody').addClass('shrPage page-Title');
					$('#microToolbar_left').find('div').addClass('showBreakPage');
					$('#microToolbar_right').remove();
					$('#last_microToolbar').next().remove();
					$('#last_microToolbar').remove();style="float:right"
					$('#first_microToolbar').remove(); var br = document.createElement("br");  
					$('#datagrid').appendChild(br);style="position: absolute; right: 15px; top: 2px;"
					$('#datagrid').find("div[class='row-fluid row-block view_manager_body']").addClass('moveUp');*/
					
				}

			});
			
	},
	/* destroyAction:function(){		
		return false;
	}, */
	addRowAction:function(){
		var that = this;
		that.appendPersons();
	},
	appendPersons:function(){
		var that = this;
		//personForGroup.js

  		 var url = shr.getContextPath() + '/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.ExistAttdFilePersonForGroup.list';
        url = shr.appendParam(url, {
            serviceId: shr.getUrlRequestParam("serviceId")
        });

		$("#iframe1").attr("src",url);
							$("#iframe1").dialog({
								modal : false,
								title : jsBizMultLan.atsManager_attenceGroupEdit_i18n_0,
								width : 1035,
								minWidth : 1035,
								height : 550,
								minHeight : 550,
								open : function(event, ui) {
								},
								close : function() {	
									that.appendDatas();
								}
							});
							
		$("#iframe1").attr("style", "width:1035px;height:550px;");
	}
	,appendDatas : function(){
		var that = this;
		var dataIds = $("#items").jqGrid("getDataIDs");
		var proposer_ids= [];
		var listTotal = dataIds.length;
		//每次在插入之前获得列表中所有的员工编号
		for(var r=0;r<listTotal;r++){
			var personid = $("#items").jqGrid("getCell", dataIds[r], "proposer.id");
			proposer_ids.push(personid);
		}
		var len = that._listDatas.length;
	    //插入数据到列表中
		for(var r = 0; r < len ;r++){
			var key = that._listDatas[r]["proposer.id"];
			//新增员工不在列表中
			if($.inArray(key, proposer_ids) == -1){
				$("#items").jqGrid("addRowData",listTotal + r + 1 ,that._listDatas[r],"first");
			}
		}
	}
});


function closeFrameDlg(ifameid,listDatas){
	_stateVal._listDatas = listDatas;
    $('#'+ifameid).dialog('close'); 
}


function correctValue(value){
	if(value == null || value == undefined || value.length < 1){
		return "";
	}
	return value;
}


