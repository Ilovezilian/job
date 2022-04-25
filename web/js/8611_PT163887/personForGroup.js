
									
shr.defineClass("shr.ats.PersonForGroup", shr.framework.List, {
	
	initalizeDOM:function(){
		shr.ats.PersonForGroup.superClass.initalizeDOM.call(this);
		$("#breadcrumb > li").empty ();
		$(".view_manager_header>div>div").eq(0).hide()
	},
	viewAction:function(){
		
	}
	,getCustomFilterItems: function() {
		var _self = this;
	   var hrOrgUnit=parent.$("#hrOrgUnit").val();
		var filterStr =  "hrOrgUnit.id IN ( '"+hrOrgUnit+"' ) ";
		return filterStr;
	},
	
	/**
	 * 表格加载完成
	 */
	gridLoadComplete: function(ret) {
	shr.ats.PersonForGroup.superClass.gridLoadComplete.call(ret);
	if(parent.shr.getUrlRequestParam("uipk")=="com.kingdee.eas.hr.ats.app.AttenceGroup.form"){
			$("td[aria-describedby='grid_person.number']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_person.name']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_adminOrgUnit.displayName']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_position.name']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_hrOrgUnit.name']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_flowoutadminorgunit']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_attendanceNum']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_employeeType.name']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_EmpPosOrgRelation.EFFDT']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_flowInAdminOrgUnit.name']").css("background-color","lightgrey");
	}
	}
	,confirmAction:function(){
		var _self = this ;
		var billIds = $("#grid").jqGrid("getSelectedRows");
		var errorString = "";
		var errorFlag = 0 ;
		var obj = $("#grid").jqGrid("getSelectedRows");
		if (billIds == undefined || billIds.length == 0) {
				shr.showWarning({message : jsBizMultLan.atsManager_personForGroup_i18n_3});
				return;
		}
//		jQuery(obj).each(function(n){
//		    	errorString =errorString+ _self.checkEveryRow(n  , billIds);
//		    	errorFlag = 1 ;
//		   		if(errorString){
//		   			_self.preShowError( billIds[n]  ,errorString);
//		   			errorFlag = 1 ;
//		   		}
//		 });
		errorString= _self.checkRows();
		 if(errorString !=""){
			shr.showWarning({message : errorString,hideAfter: 5});
			return;
			}
		
		if (billIds == undefined || billIds.length == 0) {
				shr.showWarning({message : jsBizMultLan.atsManager_personForGroup_i18n_3});
				return;
		}
		else{
		
			var entryList = [];
			for(var r=0;r<billIds.length;r++){
				var listData = $("#grid").jqGrid("getRowData",billIds[r]);
				var entry={ "proposer.id": listData["person.id"],
					   		"proposer.number": listData["person.number"],
					   		"proposer.name": listData["person.name"],
					   		"position.id": listData["position.id"],  //考勤岗位
					   		"position.name": listData["position.name"], 
					   		"adminOrgUnit.id": listData["adminOrgUnit.id"], //考勤组织
					   		"adminOrgUnit.displayName": listData["adminOrgUnit.displayName"],
					   		"hrOrgUnit.id": listData["hrOrgUnit.id"], //人事组织
							"flowout": listData["flowOut.LEFFDT"].substr(0,10),//调出时间
							"startTime": listData["startTime"].substr(0,10),//调出时间
							"flowoutadminorgunit": listData["flowOutAdminOrgUnit.name"]//调出组织
						};
				entryList.push(entry);
			}
			/*
			 * 当关闭该页面的时候：回调函数所做的事情
			 * AttenceGroupEdit.js
			 */
			window.parent.closeFrameDlg('iframe1',entryList);
		}
	}
	 /**
	 * 获取查询字段
	
	getSelector: function() {
		var column =[];
		column.push('id, person.id, person.number, person.name,attendanceNum, adminOrgUnit.id,');
		column.push('adminOrgUnit.displayName, primaryPosition.id,primaryPosition.name,employeeType.name,');
		column.push('employeeType.isInCount,hrOrgUnit.id ');
		
		return column.join();
	}
	 */
,
	onCellSelect:function(rowid,iCol,cellcontent,e){
	var _self = this ;
	if(iCol==14){
		_self.addValsOnCellSelectPublicAction(this,iCol,rowid);
	}
	},
	addValsOnCellSelectPublicAction : function(pageUipk,columnNum,rowid){
		var _self = this;
		$("#iframe2").dialog({
			    title: jsBizMultLan.atsManager_personForGroup_i18n_1,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+55%',
					of: window
				},
				open : function(event, ui) {
				   _self.appendDynamicHTMLOnCellSelect(this,columnNum);
			    },
			    close : function() {
				    $("#iframe2").empty();
			    },
					buttons: [{
						text: jsBizMultLan.atsManager_personForGroup_i18n_1,
						click: function(){
							$(this).disabled = true;
							_self.assginValueOnCellSelectAction(pageUipk,columnNum,rowid);
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					},{
						text: jsBizMultLan.atsManager_personForGroup_i18n_4,
						click: function(){
							$("#iframe2").empty();
							$("#iframe2").dialog("close");
						}
					}]
			});	
			$("#iframe2").css({"height":"250px"});
			$("#iframe2").css({"margin-top":"5px"});
	},
	appendDynamicHTMLOnCellSelect: function(object,columnNum){
		var that = this;
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
			 + '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_personForGroup_i18n_2
			+ '</div></div>'
			 + '</div>'
			 + '<div class="row-fluid row-block ">';
		
		if(columnNum==14){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_personForGroup_i18n_5
				 + '">'
				 + jsBizMultLan.atsManager_personForGroup_i18n_5
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="EFFDT" name="EFFDT" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker"></div>'
		}
		 	html+=  '</div>'
				 + '</form>';
		$(object).append(
				 html
				 );
		
		if(columnNum==14){
			$('#EFFDT').shrDateTimePicker({
				id: "EFFDT",
				tagClass: 'block-father input-height',
				readonly: '',
				yearRange: '',
				ctrlType: "Date",
				isAutoTimeZoneTrans:false,
				validate: '{dateISO:true}'
			});	
		}	
		//要将form加上，数据校验才有用。
	    var formJson = {
			id: "form"
		};
		$('#form').shrForm(formJson);
	},
	assginValueOnCellSelectAction : function(pageUipk,columnNum,rowid)
	{
		var _self = this ;
		
			var clz = this;
			var $grid = $(clz.gridId);	
			var ids = $grid.jqGrid('getDataIDs');
			
			if(columnNum==14){
				var effdt = atsMlUtile.getFieldOriginalValue("EFFDT");
				if(effdt!=null&&effdt!=""){
					var oldEffdt=$grid.jqGrid("getCell",rowid,"EFFDT");
					if(pageUipk.uipk=='com.kingdee.eas.hr.ats.app.AttendanceFileBatchMaintain.list'){
						if(new Date(effdt)<new Date(oldEffdt)){
							var personName=$grid.jqGrid("getCell",rowid,"person.name");
							var personNumber=$grid.jqGrid("getCell",rowid,"person.number");
							shr.showInfo({message: personName+personNumber+jsBizMultLan.atsManager_personForGroup_i18n_0+oldEffdt});
							return;
						}
					}
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"startTime",effdt);
				}
			}
		},verify:function(){
		var _self = this ;
		var errorString = "";
		var errorFlag = 0 ;
		var obj = $("#grid").jqGrid("getRowData");
		jQuery(obj).each(function(n){
		    	errorString = _self.checkEveryRow(n + 1 , this);
		   		if(errorString){
		   			_self.preShowError( n + 1 ,this.person.name + " " + errorString);
		   			errorFlag = 1 ;
		   		}
			
		 });	
	},checkEveryRow : function(rownum,billIds){
			var that = this ;
			var listData = $("#grid").jqGrid("getRowData",billIds[rownum]);
				//设置同步
			var id=shr.getUrlRequestParam("billId");
		 	var info ;
		 	that.remoteCall({
				type:"post",
				method:"getErrorMsg",
				async: false,
				param:{id:id,personId: listData["person.id"],startTime:listData["startTime"].substr(0,10)},
				success:function(res){
					   info = res;
				}
			});
	 return info.errorMsg;
	},checkRows : function(){
			var that = this ;
			var billIds = $("#grid").jqGrid("getSelectedRows");
			//构造分录数据
	 		var items = [];
	 		var len = billIds.length;
	 		for(var i=0;i<len;i++){
	 		var object = $("#grid").jqGrid("getRowData",billIds[i]);
	 		var entrie = {
	 			proposer: correctValue(object["person.id"]),
	 		
	 			position: correctValue(object["position.id"]),
	 			
	 			adminOrgUnit: correctValue(object["adminOrgUnit.id"]),
	 			
	 			hrOrgUnit: correctValue(object["hrOrgUnit.id"]),
	 			
	 			startTime:correctValue(object["startTime"])
	
	 		}
	 		items.push(entrie);
	 	}
				//设置同步
			var id=shr.getUrlRequestParam("billId");
		 	var info ;
		 	that.remoteCall({
				type:"post",
				method:"getErrorMsg",
				async: false,
				param:{id:id,itemsId:shr.toJSON(items)},
				success:function(res){
					   info = res;
				}
			});
	 return info.errorMsg;
	},preShowError:function(iRow,errorString){
			iRow = iRow.replace(/\"/g, "");
			var that = this;
			if (errorString){
				$("#"+iRow+" td:eq(0)").html("！").css("color","red").attr({"data-toggle":"tooltip","data-placement":"left","title":errorString});
//				$("#"+iRow).css("color","red");
			/*
				$("#entries tr:eq("+iRow+") td:eq(2)").css("color","red");
				$("#entries tr:eq("+iRow+") td:eq(3)").css("color","red");
				$("#entries tr:eq("+iRow+") td:eq(4)").css("color","red");
			*/			
			}
	}
});

function correctValue(value){
	if(value == null || value == undefined || value.length < 1){
		return "";
	}
	return value;
}


