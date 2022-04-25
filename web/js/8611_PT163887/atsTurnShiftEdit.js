shr.defineClass("shr.ats.AtsTurnShiftEdit", shr.ats.AtsMaintainBasicItemEdit, {
      
      initalizeDOM:function(){
			shr.ats.AtsTurnShiftEdit.superClass.initalizeDOM.call(this);
			var that = this ;
			that.initEditGrid();
			that.handleFSCEntry();
			
	  },initEditGrid :function(){
	  	var row_fields_work =  '<div style="padding-top:15px;" class="row-fluid row-block row_field">'
			+ '<div class="spanSelf_01"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_9
			+ '">'
			+ jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_9
			+ '</div></div>'
			+ '<div class="spanSelf_02"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_5
			+ '">'
			+ jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_5
			+ '</div></div>'
			+ '<div class="spanSelf_04"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_1
			+ '">'
			+ jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_1
			+ '</div></div>'
			+ '<div class="spanSelf_03"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_0
			+ '">'
			+ jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_0
			+ '</div></div>'
			+ '<div class="spanSelf_05"><div class="field_label" title="'
			+ jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_6
			+ '">'
			+ jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_6
			+ '</div></div>'
	  	 	+ '</div>';
	  	 $('#turnShiftEntryInfo').append(row_fields_work);
	  }
	  ,handleFSCEntry : function(){
	  	var that = this;
	  	var copyOperate = false;
	  	var copyItem  = "";
		//复制功能使用
		if($("#breadcrumb.breadcrumb")[0].baseURI){
			var baseUriMethod = $("#breadcrumb.breadcrumb")[0].baseURI.split("method=")[1];
			if(baseUriMethod.startsWith("copy")){
				copyItem = "copyItem";
				copyOperate = true;
			};
		}
		
	  	if(that.getOperateState() == "ADDNEW"&&(!copyOperate)){
	  		var hrOrgUnitId = $('#hrOrgUnit_el').val();
	  		var data = {
					uipk:"com.kingdee.eas.hr.ats.app.AtsTurnShift.form",
					hrOrgUnitId:hrOrgUnitId
			};
			shr.doAjax({
				url: shr.getContextPath()+"/dynamic.do?method=addItemJson",
				dataType:'json',
				type: "POST",
				data: data,
				success: function(response){ 
					that.setFSCEntry(response);
				}
			});
	  	}
	  	else if(that.getOperateState() == "VIEW" || that.getOperateState() == "EDIT"||copyOperate){
	  		var data = {
					id:$('#form #id').val()||'',
					copyItem:copyOperate ? "copyItem" : "",
					uipk:"com.kingdee.eas.hr.ats.app.AtsTurnShift.form"
			};
			shr.doAjax({
				url: shr.getContextPath()+"/dynamic.do?method=getItemsJson",
				dataType:'json',
				type: "POST",
				async : false,
				data: data,
				success: function(response){ 
					that.setFSCEntry(response);
				}
			});	
	  	}
	  	else{
	  		//nothing
	  	}  	
	  }  
	  ,setFSCEntry : function(rst){
	  	var _self = this;
	  	if(rst.records!= null && rst.records>0 && rst.rows!=null && rst.rows.length>0){
	  		var id,defaultShift_id,defaultShift_number,defaultShift_name,remark,workTime,type_key,type_value,row;
	  		for(var i=1;i<=rst.rows.length;i++){
				row = rst.rows[i-1];
				id = row["id"],defaultShift_id=row["defaultShift_id"],defaultShift_number=row["defaultShift_number"],
				type_key = row["type.key"],type_value = row["type.value"],
				defaultShift_name = row["defaultShift_name"],workTime = row["workTime"];
				var row_fields_work = "";
				if(_self.getOperateState() == "ADDNEW" || _self.getOperateState() == "EDIT"){
					 row_fields_work = '<div  class="row-fluid row-block row_field">'
					    + '<div class="spanSelf_01"><input type="hidden" name="id' + i + '" value="'  + correctValue(id) + '" /><div class="field_label">' + correctValue(i) + '</div></div>'
					    
					    + '<div class="spanSelf_02"><div class="field_label" style="height:24px"><input type="text"  readonly="readonly" name="dateType' + i + '" class="input-height cell-input" validate="{required:true}"/></div></div>'
					   
						+ '<div class="spanSelf_04"><div class="field_label" style="height:24px"><input type="text"  readonly="readonly" name="defaultShift' + i + '" class="input-height cell-input"/></div></div>'
						
						+ '<div class="spanSelf_03"><div class="field_label" style="height:24px"><input style="background-color:#daeef8" type="text"  readonly="readonly" name="defaultShift_number' + i + '" value="' + correctValue(defaultShift_number) + '" class="input-height cell-input" /></div></div>'
						
						+ '<div class="spanSelf_05"><div class="field_label" style="height:24px"><input style="background-color:#daeef8" type="text" readonly="readonly" name="workTime' + i + '" value="' + correctValue(workTime) + '" class="input-height cell-input" /></div></div>'
						
						if(i == 1){
							row_fields_work  += '<div><a class="rowAdd cursor-pointer">+</a></div>';	
						}
						else{
							row_fields_work += '<div><a class="rowAdd cursor-pointer">+</a><a class="rowDel cursor-pointer">x</a></div>';
						}
					row_fields_work += '</div>';
					
				    $('#turnShiftEntryInfo').append(row_fields_work);
					_self.addRowFieldString(false,i,defaultShift_id,defaultShift_name,type_key,type_value);
				}
				else if(_self.getOperateState() == "VIEW"){
					row_fields_work =  '<div class="row-fluid row-block row_field">'
							+ '<div class="spanSelf_01"><div class="field_label">' + correctValue(i) + '</div></div>'
							
							+ '<div class="spanSelf_02"><div class="field_label" style="height:24px">' + correctValue(type_key) + '</div></div>'
							
							+ '<div class="spanSelf_04"><div class="field_label" style="height:24px">' + correctValue(defaultShift_name) + '</div></div>'

							+ '<div class="spanSelf_03"><div class="field_label" style="height:24px">' + correctValue(defaultShift_number) + '</div></div>'
						
							+ '<div class="spanSelf_05"><div class="field_label" style="height:24px">' + correctValue(workTime) + '</div></div>'
							
						+ '</div>';
						$('#turnShiftEntryInfo').append(row_fields_work);
				}
	  		}
	  	}
	  	//添加事件处理
		//新增
		$('#turnShiftEntryInfo a.rowAdd').die('click');
		$('#turnShiftEntryInfo a.rowAdd').live('click',function(){
	   		var vali= $('#turnShiftEntryInfo .row_field:last input[name^=workTime]').attr("name");
	   		if(vali !=null && vali !=''){
	   		  	var idx= (new String(vali)).substr(8);
	   		    var idxA=new Number(idx)+1;
			   _self.addRowFieldString(true,idxA,null,null,null,null);
	   		}
	    }); 
	    
		//删除
	    $('#turnShiftEntryInfo a.rowDel').die('click');
		$('#turnShiftEntryInfo a.rowDel').live('click',function(){
	    	$(this).closest("div.row_field").remove();
	    });
		 
    }
    ,addRowFieldString :function(flag,i,defaultShift_id,defaultShift_name,type_key,type_value){
    	if(flag){
    		 row_fields_work = '<div  class="row-fluid row-block row_field">'
					    + '<div class="spanSelf_01"><input type="hidden" name="id' + i + '" value="" /><div class="field_label">' + correctValue(i) + '</div></div>'
					    
					    + '<div class="spanSelf_02"><div class="field_label" style="height:24px"><input type="text"  readonly="readonly" name="dateType' + i + '" class="input-height cell-input" validate="{required:true}"/></div></div>'
					    
					    + '<div class="spanSelf_04"><div class="field_label" style="height:24px"><input type="text"  readonly="readonly" name="defaultShift' + i + '" class="input-height cell-input"/></div></div>'
						
					    + '<div class="spanSelf_03"><div class="field_label" style="height:24px"><input style="background-color:#daeef8" type="text" readonly="readonly"  name="defaultShift_number' + i + '" value="" class="input-height cell-input"></div></div>'
						
						+ '<div class="spanSelf_05"><div class="field_label" style="height:24px"><input style="background-color:#daeef8" type="text"  readonly="readonly" name="workTime' + i + '" value="" class="input-height cell-input"/></div></div>'
						
						+ '<div><a class="rowAdd cursor-pointer">+</a><a class="rowDel cursor-pointer">x</a></div>'
						
						+ '</div>';
						
			$('#turnShiftEntryInfo').append(row_fields_work);
			
    	}
    	//【日期类型】
    	var _self = this;
        var select_json = {
			name: "dateType" + i,
			readonly: "",
			onChange: function(e, value) {
				var parentPrompt = $(this).parents(".row-fluid.row-block.row_field").find(".ui-promptBox-frame").not(this);
				var parentSpan = $(this).parents(".row-fluid.row-block.row_field").find("[class^=spanSelf]").find("input").not(this);
				if($(this).prev("input").val() == 0){
					parentPrompt.addClass("required");
					parentSpan.css("background-color","#daeef8");
				}else{
					parentPrompt.removeClass("required");
					parentSpan.css("background-color","white");
				}
			},
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{"value": 0, "alias": jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_4},
							{"value": 1, "alias": jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_8},
							{"value": 2, "alias": jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_3}];
		
		$('input[name="dateType' + i + '"]').shrSelect(select_json);
		//系统带出来的第一条就是默认值
		if(!flag && type_key != null && type_key.length > 0){
			$('input[name="dateType' + i + '"]').val(type_key);
			$('input[name="dateType' + i + '_el"]').val(type_value);
		}
		//如果是新增，默认的就是补卡
		else{
			$('input[name="dateType' + i + '"]')
				.val(jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_4);
			$('input[name="dateType' + i + '_el"]').val(0);
		}
		
		$('input[name="dateType' + i + '"]').bind("change", function(){
				var dayType = $('input[name="dateType' + i + '_el"]');
				if(dayType && dayType.val() != "0"){
					//不是工作日的时候，要清空班次信息。
				   $('input[name="defaultShift' + i + '"]').val(correctValue(""));
				   $('input[name="defaultShift_number' + i + '"]').val(correctValue(""));
				   $("#defaultShift" + i + "_el").val(correctValue(""));
				   $('input[name="defaultShift' + i + '"]').val(correctValue(""));
				   $('input[name="defaultShift_number' + i + '"]').val(correctValue(""));
				   $("#defaultShift" + i + "_el").val(correctValue(""));
				   $('input[name="workTime' + i + '"]').val(correctValue(""));
				}
		});
		
		//【班次名称】
		var grid_f7_json = {id : "defaultShift" + i ,name:"defaultShift" + i };
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		var object = $('input[name="defaultShift' + i + '"]');
		
		grid_f7_json.subWidgetOptions = {
			title : jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_1,
			uipk : "com.kingdee.eas.hr.ats.app.AtsShift.F7",
			query : "",
			readonly: "readonly"
		};
		grid_f7_json.validate = '{required:true}';
		//object.shrPromptBox(grid_f7_json);
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "id:name";	
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId = $("#hrOrgUnit_el").val();
		grid_f7_json.subWidgetOptions.isHRBaseItem  = "true";
		grid_f7_json.subWidgetOptions.bizFilterFields  = "hrOrgUnit";
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_7,widgetType: "checkbox"}];
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		object.shrPromptBox(grid_f7_json);
		object.shrPromptBox("setBizFilterFieldsValues",$("#hrOrgUnit_el").val());
		if(!flag){
			object.val(correctValue(defaultShift_name));
			//利用F7de特性来设置值
			$("#defaultShift" + i + "_el").val(correctValue(defaultShift_id));
		}
		
		object.bind("change", function(){
			var info = object.shrPromptBox('getValue');
			if(info != null){
					$('input[name="defaultShift' + i + '"]').val(info['BaseInfo.name']);
					$('input[name="defaultShift_number' + i + '"]').val(info['BaseInfo.number']);
					$("#defaultShift" + i + "_el").val(correctValue(info['BaseInfo.id']));
					$.ajax({
							url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsTurnShiftEditHandler&method=getWorkTime",
							data: {id:info['BaseInfo.id']},
							dataType:'json',
						    type: "POST",
							beforeSend: function(){
								openLoader(1);
							},
							success: function(msg){
								$('input[name="workTime' + i + '"]').val(correctValue(msg.workTime));
							},
							error: function(){
								closeLoader();
							},
							complete: function(){
							closeLoader();
							}
					});	
			}
		});

    }
	, /**
	 * 保存
	 */
	saveAction: function(event) {
		var _self = this;

	 	var lengthArray = [];
	 	$('#turnShiftEntryInfo input[name^=workTime]').each(function(i,domEle) {
			  var length = $(domEle).attr("name").substring("workTime".length);
	 	      lengthArray.push(parseInt(length));
	 	});
	 	//将数组由小到大排列
	 	if(lengthArray.length > 0){
	 		lengthArray.sort(sortNumber);
	 	}

	 	for(var i=0;i<lengthArray.length;i++){
	 		var dateType = new Number($('#turnShiftEntryInfo input[type=hidden][name="dateType' + lengthArray[i] +'_el"]').val());
	 		var defalutShiftId = $('#turnShiftEntryInfo input[type=hidden][id="defaultShift'+  lengthArray[i] + '_el"]').val();
	 		if(dateType == '0' ){
	 			if(defalutShiftId == null || defalutShiftId.length < 1){
	 				shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_2,[(i +1)])});
					return false;
	 			}
	 		}
	 		
	 	}
	 	
		if (_self.validate() && _self.verify()) {			
			_self.doSave(event, 'save');
		}	
	}
	/**
	 * 保存真正执行方法
	 */
	,doSave: function(event, action) {
		var _self = this;
		var data = _self.assembleSaveData(action);
		
		//复制功能使用
		if($("#breadcrumb.breadcrumb")[0].baseURI){
			var baseUriMethod = $("#breadcrumb.breadcrumb")[0].baseURI.split("method=")[1];
			if(baseUriMethod.startsWith("copy")){
				data.model = data.model.replace(data.billId,"");
				data.copyId = data.billId;//原纪录的id，用于复制其分录
				data.billId = "";
			};
		}
		
		//传递额外参数person,empPosOrgRela
		data=$.extend({
		  number:atsMlUtile.getFieldOriginalValue('number'),
		  name:$('#name').val()
		},data);
		var target;
		if (event && event.currentTarget) {
			target = event.currentTarget;
		}
		shr.doAction({
			target: target,
			url: _self.dynamicPage_url,
			type: 'post', 
			data: data,
			success : function(response) {
				if (_self.isFromF7()) {
					// 来自F7，关闭当前界面，并给F7设置
					var dataF7 = {
						id : response,
						name : $.parseJSON(data.model).name
					};
					dialogClose(dataF7);
				} else {
					// 普通保存，去除最后一个面包屑，防止修改名字造成面包屑重复
					shrDataManager.pageNavigationStore.pop();
					
					_self.reloadPage({
						billId: response.id,
						method: 'view'
					});
				}
			}
		});	
	}
	,assembleSaveData :function(action){
		var _self = this;
		var data = _self.prepareParam(action + 'Action');
		var model = shr.assembleModel(_self.fields, _self.getWorkarea(), _self.uuid);
		/////////
		//额外的data
		var itemIdArr_work = [],attendDate_work = [],type_value = [],
		reason_name = [],reason_id = [],fillCardTimeStr_work = [],
		remark_work = [];
		
		var lengthArray = [];
	 	$('#turnShiftEntryInfo input[name^=workTime]').each(function(i,domEle) {
			  var length = $(domEle).attr("name").substring("workTime".length);
	 	      lengthArray.push(parseInt(length));
	 	});
	 	
	 	//将数组由小到大排列
	 	if(lengthArray.length > 0){
	 		lengthArray.sort(sortNumber);
	 	}
	 	
	 	//构造分录数据
	 	var entries=[];
	 	for(var i=0;i<lengthArray.length;i++){
	 		var entrie = {
	 			id: correctValue($('#turnShiftEntryInfo input[type=hidden][name="id' + lengthArray[i] + '"]').val()),
	 			segment: parseInt(i + 1),
				defaultShift: {
						id:correctValue($('#turnShiftEntryInfo input[type=hidden][id="defaultShift'+ lengthArray[i] + '_el"]').val()),
						name:correctValue($('#turnShiftEntryInfo input[name="defaultShift' + lengthArray[i] + '"]').val())},
						
				workTime: correctValue($('#turnShiftEntryInfo input[name="workTime' + lengthArray[i] + '"]').val()),
				dateType: new Number($('#turnShiftEntryInfo input[type=hidden][name="dateType' + lengthArray[i] +'_el"]').val())
	 		}
	 		
	 		entries.push(entrie);
	 	}

	 
	 	if(entries.length<1){
	 		shr.showError({message: jsBizMultLan.atsManager_atsTurnShiftEdit_i18n_10});
	 		return null;
	 	}
	 	model.entries = entries;
		data.model = shr.toJSON(model);
		data.method = action;
		// relatedFieldId
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		
		return data;
	}
	
});

function correctValue(value){
	if(value == undefined || value == null){
		return "";
	}
	else{
		return value;
	}
}
/*
 * 升序
 */
function sortNumber(value1,value2){
	if(value1 < value2){
		return -1;
	}
	else if(value1 > value2){
		return 1
	}
	else{
		return 0;
	}
}
