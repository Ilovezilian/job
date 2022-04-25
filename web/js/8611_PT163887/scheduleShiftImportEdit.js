var count= 1112220;
var splitFlag = '=#=';
var error_path = "";
$(window).load(function(){

});
var globle_params = {};
					 
function clearParams(){
	 globle_params = {'min': '', 'max': '', 'name': '', 'personId': '',
					 'personName': '','orgName': '', 'longNum': '','hrOrgUnitId':''}
}

shr.defineClass("shr.ats.ScheduleShiftImportEdit", shr.framework.List, {
	initalizeDOM:function(){
		shr.ats.ScheduleShiftImportEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		$("#form").css("width","100%");
		that.setProposerF7();
		that.processF7ChangeEvent();
		that.addShiftDetail();
		that.setDefaultShift();
	}
	,setProposerF7: function(){
		//var filter = " attendanceFile.isAttendance = '1'";//因为要加入员工的职业信息，所以现在员工查询结果来自于   员工的职业信息（右）关联的员工
		//$("#proposer").shrPromptBox("setFilter",filter);
		$('#proposer').shrPromptBox("option", {
			onchange : function(e, value) {
				var info = value.current;
				var numbers = [];
				if(info != null){
					for(var i=0;i<info.length;i++){
						//当名称或者编号或者人员没有主见没有时，代表非法用户，不查询
						var number = info[i]["person.number"];
						if(number == null || number == undefined ||number.length < 1){
							continue;
						}
						else{
							numbers.push(number);
						}
					}
					$('#proposer_number').val(numbers.join(','));//@
				}
		  }
		});
	}
	
	,processF7ChangeEvent : function(){
		var that = this;
		$('#adminOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
			    var info = value.current;
			    var longNumbers = []
				var orgNames = []
				if(null != info) {
					 for (var i = 0; i < info.length; i ++) {
					 	var number = info[i]["longNumber"];
					 	if (null == number || undefined == number || 1 > number.length) {
					 		continue;
						}
						longNumbers.push(number);
						orgNames.push(info[i]["name"]);
					 }
				}
				// 下面三行到底是要干啥？
				 var filter = that.setProposerFilter(info, "admin");
				 $("#proposer").shrPromptBox("setValue",null);
				 $("#proposer").shrPromptBox("setFilter",filter);
				 $("#adminOrgUnit").val(orgNames.join(",")); // 这行会被覆盖，会自主转为displayName 详情看参考ui.shrPromptBox.refresh
				 $("#adminOrgUnit_longNumber").val(longNumbers.join(","));
			}
		});
		
		$('#hrOrgUnit').shrPromptBox("option", {
			onchange : function(e, value) {
				var info = value.current;
				var filter = that.setProposerFilter(info, "hr");
				$("#proposer").shrPromptBox("setValue",null);
				$("#proposer").shrPromptBox("setFilter",filter);
				//班次信息只保留一个，根据业务组织取默认值
				var len = $('#appendShiftDetail').children().length;
				for(var i=0; i<len; i++){
					if(i != 0){
						$('#appendShiftDetail').children().eq(1).remove();
					}
				}
				if(info != null && info != undefined && info != "" && info.id != ""){
					that.setDefaultShift(info.id);
				}
			}
		});
	}
	
	,setProposerFilter : function(info, flag){
		var that = this;
		var filter = "";
		if(flag == "admin"){
			var numbers = []
			if(null != info) {
				for (var i = 0; i < info.length; i++) {
					var number = info[i]["longNumber"];
					if (null == number || undefined == number || 1 > number.length) {
						continue;
					}
					numbers.push("'" + number + "'");
				}

				filter += " personDep.longNumber in ( " + numbers.join(",") + ")";
			}

			if($('#hrOrgUnit').shrPromptBox("getValue") != null
				&& $('#hrOrgUnit').shrPromptBox("getValue").id != ""){
				if(filter.length > 0){
					filter += " and ";
				}
				filter += " hrOrgUnit.id = '" + $('#hrOrgUnit').shrPromptBox("getValue").id + "' ";
			}
		}else if(flag == "hr"){
			if(info != null && info.id != ""){
				filter += " hrOrgUnit.id = '" + info.id + "' ";
			}
			if($('#adminOrgUnit').shrPromptBox("getValue") != null
				&& $('#adminOrgUnit').shrPromptBox("getValue").id != "" ){
				if(filter.length > 0){
					filter += " and ";
				}
				filter += " personDep.longNumber like '" + $('#adminOrgUnit').shrPromptBox("getValue").longNumber + "%' ";
			}
		}
		return filter;	
	}
	
	,atsImportAction : function(curAction){
		var that = this;
		//在生成模板之前先校验数据
		if(!that.validate()){
			return;
		}

		var selectedShiftNames = "";
		$('input[name^="shiftName"]').each(function(i,temp) {
			selectedShiftNames += "'" + $(temp).val() + "',";
		});
		selectedShiftNames = selectedShiftNames.substring(0,selectedShiftNames.length-1);
		var customParams = {
			hrOrgUnitId : $("#hrOrgUnit_el").val(),
			adminOrgUnitId : $("#adminOrgUnit_el").val(),
			proposerId : $("#proposer_el").val(),
			beginDate : atsMlUtile.getFieldOriginalValue("beginDate"),
			endDate : atsMlUtile.getFieldOriginalValue("endDate"),
			selectedShiftNames : selectedShiftNames
		};
		//btnName, customParam, callback
		that.doImportData(typeof curAction == "string" ? curAction : "import",customParams,null);
	}
	,importScheduleHorAction : function(){
		this.atsImportAction("importScheduleHor");
		setTimeout(function(){
			$(".tabImport>ul.tab_labels>li:first-child>label:first-child").text(jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_3);
		},30);
	}
	,importScheduleVerAction : function(){
		this.atsImportAction("importScheduleVer");
		setTimeout(function(){
			$(".tabImport>ul.tab_labels>li:first-child>label:first-child").text(jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_14);
		},30);
	}
	,validate: function() {
		//1：校验数据的非空性
		//--起始日期不能为空
		var beginDate = atsMlUtile.getFieldOriginalValue('beginDate');
		if(beginDate == '' || beginDate == undefined){
			shr.showWarning({
			  message: jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_6
		    });
			return ;
		}
		//--结束日期不能为空
		var endDate = atsMlUtile.getFieldOriginalValue('endDate');
		if(endDate == '' || endDate == undefined){
			shr.showWarning({
			  message: jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_4
		    });
			return false;
		}
		//--班次名称
		var shiftName = $('#appendShiftDetail input[name="1112220"]').val()
		if(shiftName == '' || shiftName == undefined){
			shr.showWarning({
			  message: jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_2
		    });
			return false;
		}
		//2:逻辑性校验
		if(beginDate > endDate){
			shr.showWarning({
			  message: jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_5
		    });
			return false;
		}
		return true;
	}
	
	//默认班次，根据业务组织找
	//业务组织上，可以使用的班次，按是否默认降序和编码的升序排序，取第一条。
	,setDefaultShift : function(hrOrgUnitId){
		if(hrOrgUnitId == null || hrOrgUnitId == undefined || hrOrgUnitId == ""){
			return;
		}
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=getDefaultShift"
				+ "&hrOrgUnitId=" + encodeURIComponent(hrOrgUnitId);
		$.ajax({
			url: url,
			dataType:'json',
			type: "POST",
			cache:false,
			success: function(msg){
				$('#appendShiftDetail input[name="1112220"]').val('(' + msg.number + ')' + msg.name);
				$('#appendShiftDetail input[name="shiftName1112220"]').val(msg.name);
				$('#appendShiftDetail input[name="attendDate1112220"]').val(msg.workTime);
			}
		})
	}
	
	,addShiftDetail : function(){
		var that = this;
		var row_fields_work = "";
		row_fields_work = ""
			
			+ '<div id="__' + count + '" class="row-fluid row-block"><div><input name = "shiftName' + count + '" type="hidden"/></div>'
			+ '<div id="import_tooldiv' + count + '" class="row-fluid row-block "> '
			+ '	 <div class="span12 offset0 "> '
			+ '		<span class="" style="float:right">'
			+ '			<button onclick="" class="shrbtn-primary shrbtn" id="addNew' + count + '" type="button">'
			+ jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_13
			+ '</button>'
			+ '			<button onclick="" class="shrbtn-primary shrbtn" id="delete' + count + '"  type="button">'
			+ jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_10
			+ '</button> '
			+ '		</span>' 
			+ '	 </div>' 
			+ '</div> '
			+ '<div data-ctrlrole="labelContainer">' 
			+ '	 <div class="span2" style="width:auto;"><div class="field_label">'
			+ jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_11
			+ '</div></div>'
			+ '  <div class="span3 field-ctrl">' 
			+ ' 	<div class="ui-promptBox-frame disabled">' 
			+ ' 		<div class="ui-promptBox-layout">' 
			+ ' 			<div class="ui-promptBox-inputframe" style="display: block;">' 
			+ 					'<input id="attendDate' + count + '" type="text" name="attendDate' + count + '" class="block-father input-height"  placeholder=""  validate="{required:true}"/>'
			+ '  </div></div></div></div>' 
			+ '	 <div class="span1 field-desc"></div>'
			+ '</div>'
			+ '<div data-ctrlrole="labelContainer"> ' 
			+ '	 <div class="span2" style="width:auto;"><span class="field_label">'
			+ jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_1
			+ '</span></div>'
			+ '  <div class="span3 field-ctrl">' 
			+ '		<input id="' + count + '" type="text" name="' + count + '" class="block-father input-height"  placeholder="""/>' 
			+ '  </div>' 
			+ '	 <div class="span1 field-desc"></div>'
			+ '</div>'
			+ '</div> ';
		
		$('#appendShiftDetail').append(row_fields_work);
		//shr.locateTo($('#appendShiftDetail').children().last());
		$('div[id^=import_tooldiv] span').hide();
		//删除第一行的删除按钮
		$('#delete1112220').remove();
		
		$('#__' + count).mouseover(function(){
			$('div[id=import_tooldiv' + getCountValue(this['id']) + '] span').show();
		});
		
		$('#__' + count).mouseleave(function(){
			$('div[id=import_tooldiv' + getCountValue(this['id']) + '] span').hide();
		});
		
		$('#addNew' + count).live('click',function(){
			count ++;
			that.addShiftDetail();
		});
		
		$('#delete' + count).live('click',function(){
			deleteShiftDetailAction(this['id']);
		});
		
		//组装F7回调式对话框	 
		var grid_f7_json = {id:"shiftName' + count + '",name:"shiftName' + count + '"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		
		//grid_f7_json.subWidgetOptions = {title:"班次名称",uipk:"com.kingdee.eas.hr.ats.app.AtsShift.F7",query:""};
		
		var object = $('#appendShiftDetail input[name="' + count + '"]');
		
		grid_f7_json.subWidgetOptions = {
			title : jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_1,
			uipk : "com.kingdee.eas.hr.ats.app.AtsShift.AvailableList.F7",
			query : "",
			multiselect:true
		};
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_12,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		object.shrPromptBox(grid_f7_json);
		var oldInfo;
		var currentInfo;
		object.shrPromptBox("option", {
			onchange : function(e, value) {
				currentInfo = value.current;
				oldInfo = value.previous;
			}
		});
		//由于在获取F7选择的信息时，要查出对应的班次明细表，所以绑定事件
		object.bind("change", function(){
			var countValue = this['name'];
			var attendDate = $('#appendShiftDetail input[name="attendDate' + countValue + '"]');
			var shiftName = $('#appendShiftDetail input[name="shiftName' + countValue + '"]');
			var infoArr = object.shrPromptBox('getValue');	
			if(!infoArr){
				return;
			}
			var realInfoArr=new Array();
			
			for(var i=0;i<infoArr.length;i++){
				if(filterF7Value($(infoArr[i]).attr("BaseInfo.name"))){
					
					realInfoArr.push(infoArr[i]);
				}
				else if(shiftName.val()==$(infoArr[i]).attr("BaseInfo.name")){
					realInfoArr.push(infoArr[i]);
				}else{
					object.shrPromptBox('setValue',oldInfo);
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_0, [infoArr[i].name])});
					return;
				}
			}
			if(realInfoArr.length==0){
				if(attendDate.val()==null || attendDate.val()==""){
					$("#__"+countValue).remove();
				}
				return ;
			}
			var info=realInfoArr[0];
			
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftImportEditHandler&method=getShiftItemsInfo";
			$.ajax({
				url: url,
				async:false,
				type:'post',
				data: {
					shiftItemId: info["BaseInfo.id"]
				},
				dataType:'json',
				cache: false,
				success:function(res){
					attendDate.val(res.workTime);
					shiftName.val(info.name);
					object.val('(' + info["BaseInfo.number"] + ')' + info["BaseInfo.name"]);
				}
			});
			if(realInfoArr.length>1){
				for(var i=1;i<realInfoArr.length;i++){
					count ++;
					that.addShiftDetail();
					var addObject = $('#appendShiftDetail input[name="' + count + '"]');
					addObject.shrPromptBox('setValue',new Array(realInfoArr[i]));
				}
			}
			
		});
	}
	
	//业务组织F7读缓存
	,hrOrgWriteCacheable:function(){
		return true;
	}
});

function filterF7Value(name){
	var flag = true;
	$('input[name^="shiftName"]').each(function(i,temp) {
		if($(temp).val().trim() == name.trim()){
			flag = false
		}
	 });
	 return flag;
}

function deleteShiftDetailAction(id){
    //delete + 数字
	id = id.substring(6,id.length);
	$('#shiftName' + id).val('');
	$('#'+ id).val();
	$('#__' + id).remove();
}

function getCountValue(countValue){
	//id + 数字
 	return countValue.substring(2,countValue.length);
}

function addPerson(){
		$("#iframe1").attr("src",shr.getContextPath()+'/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.emp.app.MultiPersonPosition');
		var _iframe1 = $("#iframe1").dialog({
	 		 modal: true,
	 		 width:850,
	 		 minWidth:850,
	 		 height:500,
	 		 minHeight:500,
	 		 title:jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_9,
	 		 buttons:[{
					text: jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_8,
					click: function() {
						var objects = _iframe1.contents().find('input[type=checkbox]:checked');
						var len =  objects.length;
						if(len < 1){
							 shr.showWarning({message: jsBizMultLan.atsManager_scheduleShiftImportEdit_i18n_7});
							 return ;
						}
						else{
							for(var i =0 ;i<len;i++){
								alert(objects[i].attr('name'));
							}
						}
						
					}
				}],
	 		 open: function( event, ui ) {
	 		     
	 		 },
	 		 beforeClose:function(){
	 		 }
		});

    	$("#iframe1").attr("style","width:850px;height:500px;");
}
