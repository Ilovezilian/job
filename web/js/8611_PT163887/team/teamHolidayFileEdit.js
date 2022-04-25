/**
 * 20140328:假期档案与考勤档案使用同一张表/实体-考勤档案实体,故注意字段名
 * */

shr.defineClass("shr.ats.team.TeamHolidayFileEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.team.TeamHolidayFileEdit.superClass.initalizeDOM.call(this);
		var that = this;
		
		that.processF7ChangeEvent();
		that.setButtonState();
		/*$(window).load(function(){
			that.addHref();
		});*/
		that.warmPrompt();
		that.setbaseInfo();
		
	}
	,setbaseInfo:function(){
		$(".shr-baseInfo").find("div").eq(1).html($("#adminOrgUnit").val());
		$(".shr-baseInfo").find("div").eq(2).html($("#position").val());
	}
	/**
	 * 温馨提示
	 */
	,warmPrompt:function(){
		var that = this ;
		if (that.getOperateState().toUpperCase() == 'EDIT'){
			$(".shr-baseInfo").parent().before('<div style="position:relative;left:20%;color:red;margin-bottom: 20px;">'
				+ jsBizMultLan.atsManager_holidayFileEdit_i18n_10
				+ '</div>');
		} 
	}
	,viewAction: function(billId) {
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.team.HolidayFileView.form',
			billId: billId,
			method: 'view'
		});			
	}
	,addHref:function(){
	   var that=this;
	   var text1=$("div[title='"+jsBizMultLan.atsManager_holidayFileEdit_i18n_3+"']").text();
	   $("div[title='"+jsBizMultLan.atsManager_holidayFileEdit_i18n_3+"']").empty();
	   $("div[title='"+jsBizMultLan.atsManager_holidayFileEdit_i18n_3+"']")
		   .append('<a style="text-decoration:underline;" id="gotoHolidayPolicySetList" href="javascript:void(0);">'+text1+'</a>');
	   $('#gotoHolidayPolicySetList').live('click',function(){
		  	that.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.HolidayPolicySet.list',
				method: 'initalize'
			});
	  });
	}
	,processF7ChangeEvent : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#proposer").shrPromptBox("option", {
				onchange : function(e, value) {
					
					var info = value.current;
					
					if( info != null){
						if(info.hasOwnProperty("number")){
							$("#attendanceNum").val(info.number); //考勤编码==员工编码
						}
						
						if(info.hasOwnProperty("id")){
							that.remoteCall({
								type:"post",
								method:"getPersonInfos",
								param:{personId: info.id},
								success:function(res){
									var info = res;
									$('#name').val( info.personName );	
									$('#proposer_number').val( info.personNumber );//@
									$('#attendanceNum').val(info.personNumber);
									
									$('#adminOrgUnit_el').val( info.adminOrgUnitId );		//部门ID
									$('#adminOrgUnit').val( info.adminOrgUnitName);	//部门名称  
									
									$("#position_el").val(info.positionId);		//职位ID
									$("#position").val(info.positionName);    //职位名称
									$("#proposer_employeeType").val(info.employeeType); 
									if(info.holidayPolicySet !=null){
									    var holidayPolicySet=$.parseJSON(info.holidayPolicySet);
										var dataValue = {
											id : holidayPolicySet.id,
											name : holidayPolicySet.name
										};
										$('#holidayPolicySet').shrPromptBox("setValue", dataValue);
		
									}
								}
							});
						}
					
					}
					
				}
			});
			
		}
	},
	
	//设置按钮状态,新建时，禁用启动不可见
	setButtonState: function() {
		var clz = this;
		var billId = $("#id").val();
		if(billId == "" || clz.getOperateState() != 'VIEW') {
			$("#enableFile").hide();
			$("#disableFile").hide();
			$("#matchPunchCardRecord").hide();
		}else{
			if(jsBizMultLan.atsManager_holidayFileEdit_i18n_7 == $("#attendFileState").text()) {
					$("#enableFile").hide();
			}
			if(jsBizMultLan.atsManager_holidayFileEdit_i18n_4 == $("#attendFileState").text()) {
					$("#disableFile").hide();
			}
		}
	},
	
	
	enableFileAction: function() {
		var clz = this;
		var billId = $("#id").val();
		var proposer = $("#proposer_id").attr("value"); 
		
		
		if(jsBizMultLan.atsManager_holidayFileEdit_i18n_7 == $("#fileState").text()) {
			shr.showInfo({message: jsBizMultLan.atsManager_holidayFileEdit_i18n_1, hideAfter: 3});
			return;
		}
		
		clz.remoteCall({method: "enableFile", param: {billId: billId,proposer:proposer}, success: function(data) {
			shr.showInfo({message: jsBizMultLan.atsManager_holidayFileEdit_i18n_8, hideAfter: 3});
			clz.reloadPage();
		}});
	},
	
	disableFileAction: function() {
		var clz = this;
		var billId = $("#id").val();
		
		if(jsBizMultLan.atsManager_holidayFileEdit_i18n_4 == $("#fileState").text()) {
			shr.showInfo({message: jsBizMultLan.atsManager_holidayFileEdit_i18n_0, hideAfter: 3});
			return;
		}
		//禁用考勤档案，此日期以后的所有排班记录要删除，给出提示
		var curDate = new Date();
		var curDateY = curDate.getFullYear();
		var curDateD = curDate.getDate();
		curDateD = curDateD<10?"0"+curDateD : curDateD;
		var curDateStr = curDateY + jsBizMultLan.atsManager_holidayFileEdit_i18n_6
			+ $.shrI18n.dateI18n.month2[curDate.getMonth()]
			+ curDateD + jsBizMultLan.atsManager_holidayFileEdit_i18n_9;
		
		shr.showConfirm(shr.formatMsg(jsBizMultLan.atsManager_holidayFileEdit_i18n_2,[curDateStr]), function(){
			clz.remoteCall({method: "disableFile", param: {billId: billId}, success: function(data) {
				shr.showInfo({message: jsBizMultLan.atsManager_holidayFileEdit_i18n_5, hideAfter: 3});
				clz.reloadPage();
			}});
		});
	} 
	
});



