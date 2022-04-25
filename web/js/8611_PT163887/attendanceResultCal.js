shr.defineClass("shr.ats.AttendanceResultCal", shr.framework.List, {

	initalizeDOM : function () {
		shr.ats.AttendanceResultCal.superClass.initalizeDOM.call(this);
		var self = this;
		this.setDefaultOrg();
		this.processF7ChangeEvent();
		this.createAttendanceFileF7();
		 $("#isContainSubAdminOrg").bind("change", function(){
		     self.adminOrgChangeEvent();
		});


	},

	calculateAttendanceResAction : function(){
		var that = this;
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		var adminOrgUnitId = $("#adminOrgUnit_el").val();
		var personId = $("#proposer_el").val();
		var hrOrgUnitId = $('#hrOrgUnit_el').val();
		
		//var isAgainFetchCard = $("#isAgainFetchCard").val();
		var isAgainFetchCard = 0;
		if ($("#isAgainFetchCard").parent().hasClass("icheckbox_minimal-grey")) {
			isAgainFetchCard = 0;
		}
		if ($("#isAgainFetchCard").parent().hasClass("icheckbox_minimal-grey checked")) {
			isAgainFetchCard = 1;
		}
		/**
		 * 是否包含下级组织 0-不包含 1-包含
		 */
		var isContainSubAdminOrg = 0;
		if ($("#isContainSubAdminOrg").parent().hasClass("icheckbox_minimal-grey")) {
			isContainSubAdminOrg = 0;
		}
		if ($("#isContainSubAdminOrg").parent().hasClass("icheckbox_minimal-grey checked")) {
			isContainSubAdminOrg = 1;
		}
		var regEx = new RegExp("\\-","gi");
		var begin_Date = new Date( beginDate.replace(regEx,"/") );
	 	var end_Date   = new Date( endDate.replace(regEx,"/") );
	 	
	 	var longTime = end_Date.getTime() - begin_Date.getTime();
	 	if (beginDate == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultCal_i18n_2});
			return false;
		}
		if (endDate == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultCal_i18n_0});
			return false;
		}
		if (longTime < 0) {
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultCal_i18n_1});
			return false;
		}
		that.remoteCall({
			type:"post",
			//async: false,
			method:"calAttendanceResult",
			param:{begin_Date:beginDate,end_Date:endDate,isAgainFetchCard:isAgainFetchCard,
			adminOrgUnitId:adminOrgUnitId,personId:personId,isContainSubAdminOrg:isContainSubAdminOrg,hrOrgUnitId:hrOrgUnitId},
			success:function(res){
				if (res.flag == 1) {
					shr.showInfo({message: jsBizMultLan.atsManager_attendanceResultCal_i18n_3});
					window.parent.$("#operationDialog").dialog('close');
					//window.parent.$("#operationDialog").remove();
					/*//window.parent.document.getElementById("operationDialog").parent().dialog('close'); 
					//window.parent.document.getElementById("operationDialog").remove();
					//window.parent.document.getElementById("operationDialog").prev().remove();
					//$('#photoCtrl').dialog('close');
					//$('#photoCtrl').remove();
					*/
				}
			}
		});
	},
	setDefaultOrg:function()
	{                  

					$('#isContainSubAdminOrg').parent().addClass("checked");
					$('#isContainSubAdminOrg').attr('checked','true');
				      var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.bill.util.BillBizUtil&method=getDefaultOrg";
					   shr.ajax({
						type:"post",
						async:false,
						url:url,
						success:function(res){
							var info = res;
							if(info!=null){
								var dataValue = {
									id : info.orgID,
									name : info.orgName,
									longNumber:info.longNumber
								};
								$('#adminOrgUnit').shrPromptBox("setValue", dataValue);
	
							}
					

					    }
					});
	}
	,processF7ChangeEvent : function(){
		var that = this;
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
             
				var isChecked= $('#isContainSubAdminOrg').attr('checked');
               	var isContainSubAdminOrg = 0;
				if (isChecked=="checked") {
				
					isContainSubAdminOrg = 1;
				}

			   var info = value.current;
			   if(info!=null){
			   if(info.longNumber !=null && info.longNumber!='' && isContainSubAdminOrg==1){ 
			   		var filter = " adminOrgUnit.longNumber like '"+info.longNumber+"%' ";
					$("#proposer").shrPromptBox("setFilter",filter);
			   } 
               else if(info.longNumber !=null && info.longNumber!='' && isContainSubAdminOrg==0)
               {
				    var filter = " adminOrgUnit.longNumber ='"+info.longNumber+"' ";
					$("#proposer").shrPromptBox("setFilter",filter);
			   }			   
			   	$("#proposer").shrPromptBox("setFilter",filter);
				$("#proposer").shrPromptBox("setValue",{
					id : "",
					name : ""
			   });
			   
			   //如果出现先点击人员的情况，那在点击组织机构的时候，人员清空
			   $("#adminOrgUnit").val(info.name);
			   $("#adminOrgUnit_longNumber").val(info.longNumber);
			  }else{
			  
			   $("#adminOrgUnit_el").val("");
			  } 
			}
		});

	
  },adminOrgChangeEvent:function()
  {              

				var isChecked= $('#isContainSubAdminOrg').attr('checked');
               	var isContainSubAdminOrg = 0;
				if (isChecked=="checked") {
				
					isContainSubAdminOrg = 1;
				}

			   var info = $("#adminOrgUnit").shrPromptBox("getValue");
			   if(info!=null){
			   if(info.longNumber !=null && info.longNumber!='' && isContainSubAdminOrg==1){ 
			   		var filter = " adminOrgUnit.longNumber like '"+info.longNumber+"%' ";
					$("#proposer").shrPromptBox("setFilter",filter);
			   } 
               else if(info.longNumber !=null && info.longNumber!='' && isContainSubAdminOrg==0)
               {
				    var filter = " adminOrgUnit.longNumber ='"+info.longNumber+"' ";
					$("#proposer").shrPromptBox("setFilter",filter);
			   }			   
			   	$("#proposer").shrPromptBox("setFilter",filter);
				$("#proposer").shrPromptBox("setValue",{
					id : "",
					name : ""
			   });
			   
			   //如果出现先点击人员的情况，那在点击组织机构的时候，人员清空
			   $("#adminOrgUnit").val(info.name);
			   $("#adminOrgUnit_longNumber").val(info.longNumber);
			  }else{
			  
			   $("#adminOrgUnit_el").val("");
			  } 
  },
  createAttendanceFileF7:function()
  {
			//组装F7回调式对话框	 
	    var grid_f7_json = {id:"proposer",name:"proposer"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		var object = $('#proposer');
		grid_f7_json.subWidgetOptions = {
			title:jsBizMultLan.atsManager_attendanceResultCal_i18n_4,
			uipk:"com.kingdee.eas.hr.ats.app.ExistFileForAdmin.F7",
			query:"",
			filter:"", 
			domain:"",
			multiselect:true
		};
		object.shrPromptBox(grid_f7_json);
		object.bind("change", function(){
			var info = object.shrPromptBox('getValue');
			var names = [],numbers = [],personIds = [];
			if(info!=null){
			for(var i=0;i<info.length;i++){
				//当名称或者编号或者人员没有主见没有时，代表非法用户，不查询
				var name = info[i]["person.name"];
				var number = info[i]["person.number"];
				var personId = info[i]["person.id"];
				info[i]["id"] = info[i]["person.id"];
				info[i]["name"] = info[i]["person.name"];
				if(personId == null || personId == undefined || personId.length < 1){
					continue;
				}
				else if(name == null || name == undefined || name.length < 1){
					continue;
				}
				else if(number == null || number == undefined ||number.length < 1){
					continue;
				}
				else{
					names.push(name);
					numbers.push(number);
					personIds.push(personId);
				}
			}
			$('#proposer').val(names.join(','));
	  	    $('#proposer_id').val(personIds.join(','));
			$('#proposer_el').val(personIds.join(','));
			$('#proposer_number').val(numbers.join(','));//@
			}else{
			  $("#proposer_id").val("") ;
			}
		});
	
  }
	 

});

 
