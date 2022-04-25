var deletedList = "";//用于存储在数据库中还存在，但是在页面上已删除的分录ID
shr.defineClass("shr.ats.FillSignCardEdit", shr.framework.Edit, {
      strdate:"",
      initalizeDOM:function(){
			shr.ats.FillSignCardEdit.superClass.initalizeDOM.call(this);
			var that = this ;
			that.processPersonF7ChangeEvent();
			//that.createPersonExistAttenFileF7();
			//增加业务组织处理
			that.processF7ChangeEventHrOrgUnit();
			that.setButtonVisible();
			that.strdate = $.getUrlParam('strdate');
			that.myExtendValidate();//使用自定义的校验扩展校验 
			that.myExtendValidate1();//用自定义的校验扩展校验考勤日期
			//新增的补签卡自动填充申请人和申请日期
			that.fillProposerAndApplyDate();
			//隐藏提交生效按钮
			if (that.getOperateState() == 'VIEW') {			
				$("#submitEffect").hide();
			}
			/*
			龙光没有此按钮
			//隐藏提交生效按钮
			$("#submitEffect").hide();
			*/
			that.initEditGrid();
			that.dealWindownLoad();
			that.setNumberFieldEnable();
			if (that.getOperateState() != 'ADDNEW') {		
				that.handleFSCEntry();
			}
			
			
			$('.ui-state-default').unbind('mouseenter');
			$('.ui-state-default').unbind('mouseleave');
			$('.ui-state-default').die('mouseenter');
			$('.ui-state-default').die('mouseleave');
			
		   $('.ui-state-default').live('mouseenter', function() {
  				$(this).addClass("ui-state-hover");
		   }).live('mouseleave',function(){
		   		$(this).removeClass("ui-state-hover");
		   		$(".ui-state-hover").removeClass('ui-state-hover');
		   });
		   
		   if(that.isFromWF()){
				$("#addInstanceToDeskItem").css('display','none');
		   }
		   that.initCcPersonPrompt()
	  },
    clearCCPersonIdsPrompt :function() {
        atsCcPersonUtils.clearCCPersonIdsPrompt(this);
    },
    initCcPersonPrompt :function() {
        atsCcPersonUtils.initCCPersonIdsPrompt(this);
        if (this.getOperateState() != 'VIEW') {
            var person = $('#entries_person').shrPromptBox("getValue");
            if (!person) {
                // shr.showWarning({message:"Please select people."});
            } else {
                $('#ccPersonIds').shrPromptBox("setOtherParams", {
                    // handler: "com.kingdee.shr.ats.web.handler.team.F7.TeamPersonForEmpOrgF7ListHandler",
                    personId: person.id
                });
            }
        }
	  }
	  ,fillProposerAndApplyDate : function(){
		var that = this ;
		if(that.getOperateState() == 'ADDNEW'){
			$("#proposer_el").val(that.initData.proposerId);
			$("#proposer").val(that.initData.proposerName);
			atsMlUtile.setTransDateTimeValue("applyDate",that.initData.curDate);
		}
	  }
	  ,processPersonF7ChangeEvent:function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#entries_person").shrPromptBox("option", {
				onchange : function(e, value) {//更新填充员工编码
					var info = value.current;
                    if(info != null){
                        $("#entries_person_number").val(info["person.number"]);//@
                        $("#entries_person_el").val(info.id);
                        $("#entries_person_id").val(info.id);
                        $("#entries_person").val(info.name);

                        //BT1310392【8.5 SP1beta测试】【8.5 PT134017】专员单人补签卡界面，配置了行政组织和职位后，没有携带员工的行政组织和职位
                        $("#entries_adminOrgUnit").val(info["adminOrgUnit.displayName"]);
                        $("#entries_adminOrgUnit_el").val(info["adminOrgUnit.id"]);
                        $("#entries_position").val(info["position.name"]);
                        $("#entries_position_el").val(info["primaryPosition.id"]);
                    }
				}, afterOnSelectRowHandler: function (e, value) {
                    that.clearCCPersonIdsPrompt();
                    that.initCcPersonPrompt();
                }
			});
		}
	}
	,processF7ChangeEventHrOrgUnit : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#hrOrgUnit").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					that.initCurrentHrOrgUnit(info.id);
					$("#entries_person_el").val("");
					$("#entries_person").val("");
					$("#entries_person_number").val("");//@
					that.handleFSCEntry(info.id);
				}
			});
		}
	}
	,initCurrentHrOrgUnit: function(hrOrgUnitId) {
		var that = this;
		$("#entries_person").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
		
	}
	,initQuerySolutionHrOrgUnit: function(hrOrgUnitId) {
		 var that = this;
		 that.remoteCall({
			type:"post",
			method:"initQuerySolution",
			param:{
				hrOrgUnitId : hrOrgUnitId
			},
			async: true, //false
			success:function(res){
				
			}
		});
	}
	   /**
		 * 设置编码字段是否可编辑
		 */
		,setNumberFieldEnable : function() {
			var that = this ;
			if (that.getOperateState().toUpperCase() == 'EDIT' ||　that.getOperateState().toUpperCase() == 'ADDNEW') {
				var fillSignNumberFieldCanEdit = that.initData.fillSignNumberFieldCanEdit;
				if (typeof fillSignNumberFieldCanEdit != 'undefined' && !fillSignNumberFieldCanEdit) {
					that.getField('number').shrTextField('option', 'readonly', true);
				}
				//初始化HR组织ID
				var hrOrgUnitID = that.initData.initCurrentHrOrgUnit;
				if (typeof hrOrgUnitID != 'undefined' && hrOrgUnitID) {
					that.initCurrentHrOrgUnit(hrOrgUnitID);
				}
			}
		}
	  
	  
	  ,initEditGrid :function(){
	  	var row_fields_work =  '<div style="padding-top:15px;" class="row-fluid row-block row_field">'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_fillSignCardEdit_i18n_8
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_fillSignCardEdit_i18n_2
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_fillSignCardEdit_i18n_4
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_fillSignCardEdit_i18n_3
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_fillSignCardEdit_i18n_0
			+ '</span></div>'
	  	 	+ '</div>';
	  	 $('#fillSignCardEntryInfo').append(row_fields_work);
	  }
	  ,myExtendValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {  
    		myTmVldt: jsBizMultLan.atsManager_fillSignCardEdit_i18n_12
		  });  
		  jQuery.validator.addMethod("myTmVldt", function(value, element) {  
	    	   var v=value||'';
	    	   if((/[0-2][0-9]:[0-5][0-9]/.test(v)&&v.length==5)||(/[0-2][0-9]：[0-5][0-9]/.test(v)&&v.length==5)){
	    	   	  var h=new Number(v.substr(0,2));
	    	   	  if(h<24)
	    	   	    
	    	   	    return true;
	    	   	  else
	    	   	    return false;
	    	   }else{
	    	   	  return false;
	    	   }
		  }, jsBizMultLan.atsManager_fillSignCardEdit_i18n_12);//msg:错误提示文本。已验证
	   
	 }
	 ,myExtendValidate1:function(){ //补签卡日期 扩展自定义校验
		jQuery.extend(jQuery.validator.messages,{
			myTmVldt1:jsBizMultLan.atsManager_fillSignCardEdit_i18n_5
		});
		jQuery.validator.addMethod("myTmVldt1",function(value, element){
		    var fillCardTimeStr=$(element).parents("div.row_field").find("input[name^='fillCardTimeStr']").val();
		     var reasonId=$(element).parents("div.row_field").find("input[id^='reason']").val();
		    var isAdvanceAllow=false;
		    if(reasonId!=null && reasonId!=""){
		    	shr.remoteCall({
					url:shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.FillSignReasonListHandler",
					type:"post",
					method:"getReasonById",
					param:{
						id:reasonId
					},
					async: false,
					success:function(res){
						isAdvanceAllow=res.isAdvanceAllow;
					}
				});
		    }
		    if(isAdvanceAllow==true){
		    	return true;
		    }
			if((/[0-2][0-9]:[0-5][0-9]/.test(fillCardTimeStr)&&fillCardTimeStr.length==5)||(/[0-2][0-9]：[0-5][0-9]/.test(fillCardTimeStr)&&fillCardTimeStr.length==5)){
	    	   	  var h=new Number(fillCardTimeStr.substr(0,2));
	    	   	  if(h<24)
				  {
				  	    v=value.substring(0,2)+":"+value.substring(3,5);
					    value=v+" "+fillCardTimeStr+":00";
				  }
	    	   	
	    	   }

			var date = new Date(Date.parse(value));
			if(new Date().getTime() - date.getTime() <= 0){
				return false;
			}else{
				return true;
			}
		},jsBizMultLan.atsManager_fillSignCardEdit_i18n_5);
		jQuery.validator.addMethod("myTmVldt1",function(value, element){
		    var fillCardTimeStr=$(element).parents("div.row_field").find("input[name^='attendDate']").val();
		  	var reg = /^(\d{4})-(\d{2})-(\d{2})$/;
			var str = fillCardTimeStr;
			var arr = reg.exec(str);
			if (str=="") return true;
			if (!reg.test(value)&&RegExp.$2<=12&&RegExp.$3<=31){
			return false;
			}
			return true;
		},jsBizMultLan.atsManager_fillSignCardEdit_i18n_11);
	   
	  },
	  handleFSCEntryReason: function(res){
		  if(res && res.rows && res.rows.length > 0){
			  $("input[name^=reason").val(res.rows[0]["reason.name"]);
		  	  $("input[name^=hidd_name_reason").val(res.rows[0]["reason.id"]);
		  }
	  }
	  ,handleFSCEntry : function(hrOrgUnitId){
	  	var that = this;
	  	if(that.getOperateState() == "ADDNEW"){
	  		var data = {
					uipk:"com.kingdee.eas.hr.ats.app.FillSignCardForm",
					hrOrgUnitId: hrOrgUnitId
			};
			shr.doAjax({
				url: shr.getContextPath()+"/dynamic.do?method=addItemJson",
				dataType:'json',
				type: "POST",
				data: data, 
				success: function(response){ 
					if($("input[name^=reason").length ==0){
						that.setFSCEntry(response);
					}
					that.handleFSCEntryReason(response);
				}
			});
	  	}
	  	else if(that.getOperateState() == "VIEW" || that.getOperateState() == "EDIT"){
	  		var ids=$('form[id^=form]').find('input[id^=id]').val();
	  		var data = {
					id:ids||'',
					uipk:"com.kingdee.eas.hr.ats.app.FillSignCardForm",
					hrOrgUnitId: hrOrgUnitId
			};			
			shr.doAjax({
				url: shr.getContextPath()+"/dynamic.do?method=getItemsJson",
				dataType:'json',
				type: "POST",
				data: data,
				success: function(response){ 
					if($("input[name^=reason").length ==0){
						that.setFSCEntry(response);
					}
					//that.handleFSCEntryReason(response);
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
	  		var id,attendDate,type,fillCardTimeStr,remark,reason_id,reason_name;
	  		for(var i=0;i<rst.rows.length;i++){
				var row = rst.rows[i];
				id = row["id"],attendDate=row["attendDate"],type_key=row["type.key"],type_value=row["type.value"],
				fillCardTimeStr = row["fillCardTimeStr"],reason_id = row["reason.id"],reason_name = row["reason.name"],
				remark = row["remark"];
				var row_fields_work = "";
				if(_self.getOperateState() == "ADDNEW" || _self.getOperateState() == "EDIT"){
					 row_fields_work = '<div  class="row-fluid row-block row_field">'
					    + '<div class="spanSelf"><input type="hidden" name="id' + i + '" value="'  + correctValue(id) + '" /><input type="text" id="attendDate' + i + '" name="attendDate' + i + '" value="' + correctValue(attendDate) + '"class="input-height cell-input" validate="{required:true}" /></div>'
					    
					    + '<div class="spanSelf"><input type="text"  name="type' + i + '" value="" class="input-height cell-input"    validate="{required:true}"/></div>'
						
						+ '<div class="spanSelf"><input  type="text" name="reason' + i + '" value="" class="input-height cell-input"   validate="{required:true}"/></div>'
						
						+ '<div class="spanSelf"><input style="background-color:#daeef8"  length="5" type="text" id="fillCardTimeStr' + i + '" name="fillCardTimeStr' + i + '" value="' + correctValue(fillCardTimeStr) + '" class="input-height cell-input fillCardTime"  placeholder="'
						 + jsBizMultLan.atsManager_fillSignCardEdit_i18n_17
						 + '"  /></div>'
//						+ '<script type="text/javascript">$(function() {var text_json = {id:"fillCardTimeStr0",name: "fillCardTimeStr0",readonly: "",value: "0",validate: "{required:true,myTmVldt:true}",onChange: null};$("#fillCardTimeStr0").shrTextField(text_json);});</script>'
						+ '<div class="spanSelf"><input  maxlength="255" type="text" name="remark' + i + '" value="' + correctValue(remark) + '" class="input-height cell-input"/></div>';
						if(i == 0){
							row_fields_work  += '<div><a class="rowAdd cursor-pointer" style="font-size: 20px;">+</a></div>';	
						}
						else{
							row_fields_work += '<div><a class="rowAdd cursor-pointer" style="font-size: 20px;">+</a><a class="rowDel cursor-pointer" style="font-size: 17px;">x</a></div>';
						}
					row_fields_work += '</div>';
				    $('#fillSignCardEntryInfo').append(row_fields_work);
				    $(".fillCardTime").on("input",function(e){
					var v=$(e.target).val()||'';
			    	if(/[0-5][0-9][0-5][0-9]/.test(v)&&v.length==4){
			    	v=$(e.target).val().substring(0,2)+":"+$(e.target).val().substring(2,4);
			    	 }
			    	if((/[0-2][0-9]:[0-5][0-9]/.test(v)&&v.length==5)||(/[0-2][0-9]：[0-5][0-9]/.test(v)&&v.length==5)){
			    	var h=new Number(v.substr(0,2));
			    	if(h<24){

			    	$(e.target).val(v);
			    	}
			    }
					});
				    /*
				     $('input[name="type' + i + '"]').shrSelect(select_json);
				    $('input[name="type' + i + '"]').val(type_key);
				   $('input[name="type' + i + '_el"]').val(type_value);
				   */
					_self.addRowFieldString(false,i,reason_id,reason_name,type_key,type_value,correctValue(remark));
				}
				else if(_self.getOperateState() == "VIEW"){
					row_fields_work =  '<div class="row-fluid row-block row_field">'
							+ '<div class="spanSelf"><input type="hidden" name="id' + i + '" value="'  + correctValue(id) + '" /><input type="hidden" id="type' + i + '_el" value="'  + correctValue(type_value) + '" /><input type="hidden" id="reason' + i + '_el" value="'  + correctValue(reason_id) + '" /> <span id="attendDate' + i + '" name="attendDate' + i + '" class="cell-input">' + correctValue(attendDate) + '</span></div>'
							
							+ '<div class="spanSelf"><span name="type' + i + '" class="cell-input">' + correctValue(type_key) + '</span></div>'

							+ '<div class="spanSelf"><span name="reason' + i + '" class="cell-input">' + correctValue(reason_name) + '</span></div>'
						
							+ '<div class="spanSelf"><span name="fillCardTimeStr' + i + '"  class="cell-input">' + correctValue(fillCardTimeStr) + '</span></div>'
							
							+ '<div class="spanSelf"><span name="remark' + i + '" style = "word-break: break-word;" class="cell-input">' + correctValue(remark) + '</span></div>'
						+ '</div>';
						$('#fillSignCardEntryInfo').append(row_fields_work);
				}
				atsMlUtile.setTransDateValue("attendDate" + i, attendDate);
	  		}
	  	}
	  	//添加事件处理
		//新增
		$('#fillSignCardEntryInfo a.rowAdd').die('click');
		$('#fillSignCardEntryInfo a.rowAdd').live('click',function(){
	   		var vali= $('#fillSignCardEntryInfo .row_field:last input[name^=attendDate]').attr("name");
	   		if(vali !=null && vali !=''){
	   		  	var idx= (new String(vali)).substr(10);
	   		    var idxA=new Number(idx)+1;
			   _self.addRowFieldString(true,idxA,null,null,null,null,null);
	   		}
	    }); 
	    
		//删除
	    $('#fillSignCardEntryInfo a.rowDel').die('click');
		$('#fillSignCardEntryInfo a.rowDel').live('click',function(){
			var entryId = $($(this).closest("div.row_field").children()[0]).children()[0].value;
			if (entryId!="" && entryId !=null  && entryId !=undefined) {
				deletedList += (entryId+",");
			}
	    	$(this).closest("div.row_field").remove();
	    });
		 
    }
    ,addRowFieldString :function(flag,i,reason_id,reason_name,type_key,type_value,remark){
    	if(flag){
    		var row_fields_work = '<div  class="row-fluid row-block row_field">'

				+ '<div class="spanSelf"><input type="hidden" name="id' + i + '" value="" /><input type="text" id="attendDate' + i + '"  name="attendDate' + i
				+ '" value=""class="input-height cell-input" validate="{required:true}" /></div>'

				+ '<div class="spanSelf"><input name="type' + i + '_el" type="hidden"/><input type="text"  name="type' + i + '" value="" class="input-height cell-input"    validate="{required:true}"/></div>'

				+ '<div class="spanSelf"><input type="text" name="reason' + i + '" value="" class="input-height cell-input"   validate="{required:true}"/></div>'

				+ '<div class="spanSelf"><input style="background-color:#daeef8"  length="5" type="text" name="fillCardTimeStr' + i + '" value="" class="input-height cell-input fillCardTime"  placeholder="'
				+ jsBizMultLan.atsManager_fillSignCardEdit_i18n_17
				+ '" /></div>'

				+ '<div class="spanSelf"><input maxlength="255" type="text" name="remark' + i + '" value="" class="input-height cell-input"/></div>'

				+ '<div><a class="rowAdd cursor-pointer" style="font-size: 20px;">+</a><a class="rowDel cursor-pointer" style="font-size: 17px;">x</a></div>'

				+ '</div>';

			$('#fillSignCardEntryInfo').append(row_fields_work);
			$(".fillCardTime").on("input",function(e){
			 	var v=$(e.target).val()||'';
	    	   if(/[0-5][0-9][0-5][0-9]/.test(v)&&v.length==4){
	    	   v=$(e.target).val().substring(0,2)+":"+$(e.target).val().substring(2,4);
	    	   }
	    	   if((/[0-2][0-9]:[0-5][0-9]/.test(v)&&v.length==5)||(/[0-2][0-9]：[0-5][0-9]/.test(v)&&v.length==5)){
	    	   	  var h=new Number(v.substr(0,2));
	    	   	  if(h<24){
	    	   	  	v=$(e.target).val().substring(0,2)+":"+$(e.target).val().substring(3,5);
	    	   	  	$(e.target).val(v);
	    	   	  }
	    	   }
			});
    	}
    	 $('input[name="fillCardTimeStr' + i + '"]').attr("validate","{required:true,myTmVldt:true}");
		 $('input[name="attendDate' + i + '"]').attr("validate","{required:true,myTmVldt1:true}");
    	 
	//将【考勤日期】 【补签卡类型】【补签卡原因】封装成F7
    	//备注改成多语言
		var remarkObj = {l1:'',l2:'',l3:''};
		if(shr.getContext().locale == "en_US"){
			remarkObj.l1 = remark;
		}else if(shr.getContext().locale == "zh_TW"){
			remarkObj.l3 = remark;
		}else{
			remarkObj.l2 = remark;
		}
		$('input[name="remark' + i + '"]').attr("id","remark"+ i).shrMultiLangBox({
                readonly: "",
                value: remarkObj,
                validate: "{maxlength:128}",
                trimAll:false,
                onChange: null
            });
		//var mulHtml = '<div data-ctrlrole="labelContainer" class="field-area flex-c field-basis2" style=""><div class="field-ctrl flex-c" style="width: unset; max-width: 100%;"><input style="width:248px;height:22px;" id="remark'+i+'" name="remark'+i+'" value="{&quot;l1&quot;:&quot;&quot;,&quot;l2&quot;:&quot;&quot;,&quot;l3&quot;:&quot;&quot;}"></div><script language="javascript">$(function() {var options = {id: "remark'+i+'",readonly: "",validate: "{maxlength:255}",style: "",trimAll:false,isMultiLan:true};$("#remark'+i+'").shrTextarea(options);});</script></div></div>';
		//$("input[name='remark" + i + "']").parent().html(mulHtml);
		//$("#remark"+i).parents(".supportMultiLang").prop("style","width:248px;height:22px;");
		
		//针对从【考勤看板--我要补卡】中进入
		if(this.strdate != null && this.strdate != undefined && this.strdate != ""){
				$('input[name="attendDate' + i + '"]').shrDateTimePicker("setValue",this.strdate);
		}
		//【补签卡类型】
		var _self = this;
        var select_json = {
			id: "type" + i,
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{'value': 1,
			"alias": jsBizMultLan.atsManager_fillSignCardEdit_i18n_1}];
		$('input[name="type' + i + '"]').shrSelect(select_json);
		if(!flag){
			$('input[name="type' + i + '"]').val(type_key);
			$('input[name="type' + i + '_el"]').val(type_value);
		}
		else{//如果是新增，默认的就是补卡
			$('input[name="type' + i + '"]')
				.val(jsBizMultLan.atsManager_fillSignCardEdit_i18n_1);
			$('input[name="type' + i + '_el"]').val(1);
		}
		
		//【考勤日期】
		var attendDate = atsMlUtile.getFieldOriginalValue("attendDate" + i );
		$('input[id="attendDate' + i + '"]').shrDateTimePicker({
				id : "attendDate" + i,
				tagClass : 'block-father input-height',
				readonly : '',
				yearRange : '',
				ctrlType: "Date",
				value:attendDate,
				isAutoTimeZoneTrans:false,
				validate : '{dateISO:true,required:true}'
		});
		
		//【补签卡原因】
		var grid_f7_json = {id : "reason" + i ,name:"reason" + i };
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		var object = $('input[name="reason' + i + '"]');
		grid_f7_json.subWidgetOptions = {
			title : jsBizMultLan.atsManager_fillSignCardEdit_i18n_4,
			uipk : "com.kingdee.eas.hr.ats.app.FillSignReason.AvailableList.F7",
			query : ""
		};
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name: 'isComUse',value: true,
			alias: jsBizMultLan.atsManager_fillSignCardEdit_i18n_20,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.bizFilterFields = "hrOrgUnit";			
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		grid_f7_json.validate = '{required:true}';
		object.shrPromptBox(grid_f7_json);
		

		
		
		
		if(!flag){
			object.val(correctValue(reason_name));
			//利用F7de特性来设置值
			$("#reason" + i + "_el").val(correctValue(reason_id));
		}else{
			//新增行时，补签卡原因取自上一行
			var preRow = i-1;
			$("#reason" + i + "_el").val(correctValue($("#reason" + preRow + "_el").val()));
			$("#reason" + i).val(correctValue($("#reason" + preRow).val()));
		}

    }
	  //提交即生效
	,submitEffectAction : function (event) {
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		//增加的校验
		if (_self.validate() && _self.verify() && _self.validateIsFillSignCard()){
			if ($form.valid() && _self.verify()) {
				if(shr.atsBillUtil.isInWorkFlow(_self.billId)){
					shr.showConfirm(jsBizMultLan.atsManager_fillSignCardEdit_i18n_7, function() {
						_self.prepareSubmitEffect(event, 'submitEffect');
					});
				}else{
					shr.showConfirm(jsBizMultLan.atsManager_fillSignCardEdit_i18n_10, function() {
						_self.prepareSubmitEffect(event, 'submitEffect');
					});
				}
			}
		}			
	}
	
	,prepareSubmitEffect : function (event, action){
		var _self = this;
		var data = _self.assembleSaveData(action);
		
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
//			if (_self.isFromF7()) {
					// 来自F7，关闭当前界面，并给F7设置
//					var dataF7 = {
//						id : response,
//						name : $.parseJSON(data.model).name
//					};
//					dialogClose(dataF7);
//				} else {
					// 普通保存，去除最后一个面包屑，防止修改名字造成面包屑重复
//					shrDataManager.pageNavigationStore.pop();
					
//					_self.viewAction(response);
//				}
				
				_self.back();
			}
		});	
	}
	 
	
	  
	/**
	 * 点击取消按钮 返回到专员补卡列表list(专员) ||  com.kingdee.eas.hr.ats.app.FillSignCardAllList
	 */
	,cancelAllAction:function(){
		/*var that = this ;
	 	window.location.href = shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.FillSignCardAllList";*/
	 	this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.FillSignCardAllList'
		});
	}
	  
	  
	  ,myExtendValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {  
    		myTmVldt: jsBizMultLan.atsManager_fillSignCardEdit_i18n_12
		  });  
		  jQuery.validator.addMethod("myTmVldt", function(value, element) {  
	    	   var v=value||'';
	    	   if(/[0-5][0-9][0-5][0-9]/.test(v)&&v.length==4){
	    	   v=value.substring(0,2)+":"+value.substring(2,4);
	    	   }
	    	   if((/[0-2][0-9]:[0-5][0-9]/.test(v)&&v.length==5)||(/[0-2][0-9]：[0-5][0-9]/.test(v)&&v.length==5)){
	    	   	  var h=new Number(v.substr(0,2));
	    	   	  if(h<24){
    	   	  	//处理中文 ":"
	    	   	  	v=value.substring(0,2)+":"+value.substring(3,5);
	    	   	  	$("input[name='"+element.name+"']").val(v);
	    	   	    return true;
	    	   	  }
	    	   	  else{
	    	   	    return false;
	    	   	  }
	    	   }else{
	    	   	  return false;
	    	   }
		  }, jsBizMultLan.atsManager_fillSignCardEdit_i18n_12);//msg:错误提示文本。已验证
	   
	  }
	/*
	 * //组装F7回调式对话框	 
	 */
	// ,createPersonExistAttenFileF7:function(){
	// 	var that = this;
	// 	if (that.getOperateState() != 'VIEW') {
			
	// 		var object = $("#entries_person");
	// 		object.shrPromptBox("option", {
	// 			onchange : function(e, value) {
	// 				var info = value.current;
					
	// 				if(info != null){
	// 			    if(info.hasOwnProperty("id") && info.hasOwnProperty("adminOrgUnit.id")){
	// 					$("#entries_person_number").val(info["person.number"]);
	// 					$("#empPosOrgRela").val(info["empPosOrgRela.id"]);//这里到底取的什么?
	// 					info["id"]=info["id"];
	// 					info["name"]=info["name"];
	// 					//设置隐藏域的值
	// 					$("#entries_person_id").val(info["id"]);
	// 					$('#entries_adminOrgUnit_el').val( info["adminOrgUnit.id"] );	//部门ID
	// 					$('#entries_adminOrgUnit').val( info["adminOrgUnit.displayName"]);	//部门名称  
	// 					$("#entries_position_name_el").val(info["primaryPosition.id"]);		//职位ID
	// 					$("#entries_position_name").val(info["primaryPosition.name"]);  	//职位名称
	// 					$("#entries_position_id").val(info["primaryPosition.id"]);
	// 					$("#entries_adminOrgUnit_id").val(info["adminOrgUnit.id"]);
	// 					/////
	// 					that.remoteCall({
	// 						type:"post",
	// 						method:"getPersonInfosByPersonId",
	// 						param:{personId: info.id},
	// 						success:function(res){
	// 							var info = res;
	// 							$('#entries_adminOrgUnit_el').val( info.positionDepId );	//部门ID
	// 							$('#entries_adminOrgUnit').val( info.positionDepName.name);	//部门   
	// 							$("#entries_position_name_el").val(info.positionId);		//职位
	// 							$("#entries_position_name").val(info.positionName.name);	//职位名称 
	// 							$("#entries_person_number").val(info.personNumber); 		//员工编码
	// 						}
	// 					});
						
	// 		           }else{//手动输入，选择人员的时候，要后天查询。才能取出来。
	// 					that.remoteCall({
	// 							type:"post",
	// 							method:"getPersonInfos",
	// 							param:{personId: info.id},
	// 							success:function(res){
	// 								$("#entries_person_number").val(res.personNum);
	// 								info["id"]=info["id"];
	// 								info["name"]=info["name"];
	// 								//设置隐藏域的值
	// 								$("#entries_person_id").val(res.personId);
	// 								$('#entries_adminOrgUnit_el').val(res.adminOrgUintId);	//部门ID
	// 								$('#entries_adminOrgUnit').val(res.adminOrgUnitDisName);	//部门名称  
	// 								$("#entries_position_name_el").val(res.positionId);		//职位ID
	// 								$("#entries_position_name").val(res.positionDisName);  	//职位名称
	// 								$("#entries_position_id").val(res.positionId);
	// 								$("#entries_adminOrgUnit_id").val(res.adminOrgUintId);
	// 							}
	// 						});
	// 					}
	// 				}
	// 			}
	// 		});
	// 	}
		
	//   }
	,dealWindownLoad:function(){
		var that=this; 
	    $(window).load(function(){
	    	if(that.getOperateState().toUpperCase() == 'ADDNEW'){
				  $('#entries tr').remove('.jqgrow');
	    	}
	    	
	    	
	    	$('td[aria-describedby="entries_attendDate"]').text(function(index, text){
	    	   if(text.length>10){
	    	     return text.substring(0,10);
	    	   }
	    	});
		});
	}
	, /**
	 * 保存
	 */
	saveAction: function(event) {
		var _self = this;
		
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
					
					_self.viewAction(response);
				}
			}
		});	
	}
	/**
	 * 提交
	 */
	,submitAction: function(event) {
		var _self = this,
			workArea = _self.getWorkarea(),
			$form = $('form', workArea);
		
		if (_self.validate() && _self.verify() && _self.validateIsFillSignCard()) {
			shr.showConfirm(jsBizMultLan.atsManager_fillSignCardEdit_i18n_9, function() {
				_self.doSubmit(event, 'submit');
			});
		}		
	}
	
	, validateIsFillSignCard: function () {
        var that = this;
        var flag = true;
        var model = that.getCurrentModel();
        that.remoteCall({
            method: "validateIsFillSignCard",
            param: {model: model},
            async: false,
            success: function (res) {
                info = res;
                if (res.errorString) {
                    shr.showError({message: res.errorString});
                    flag = false;
                }
            }
        });
        return flag;
    }, validate: function() {
		shr.msgHideAll();
		var that = this;
		//1：首先全局性验证
		var workArea = that.getWorkarea(),
		$form = $('form', workArea);
		var flag = $form.valid();
		if(!flag){
			return flag;
		}
		//2: 日期时间校验
		var vo1=[],vo2=[];
		if (that.getOperateState().toUpperCase() != 'VIEW') { 
			$('input[name^="attendDate"]').each(function(i,temp) {
				  vo1.push(atsMlUtile.getFieldOriginalValue(this.id));
			});
			
			$('input[name^="fillCardTimeStr"]').each(function(i,temp) {
				  vo2.push($(temp).val());
			});

		}
		else
		{
			$('span[name^="attendDate"]').each(function(i,temp) {
				  vo1.push($(temp).text());
			});
			
			$('span[name^="fillCardTimeStr"]').each(function(i,temp) {
				  vo2.push($(temp).text());
			});
			
		}

	 
		var rt = that.validateEntries(vo1,vo2);
		if(rt.valid==false){
		   shr.showWarning({message: rt.info});
		   return false;
		}
		
		if(that.isFromWF()) 
		{
            flag = that.validateIsFillSignCard();
        }
		
		return flag ;
	}
	,
	/**分录数据合法性校验，主要是分录数据重复性校验
	 * vo1:日期yyyy-mm-dd组成的数组,vo2: hh:mi时间组成的数组
	 * */
	validateEntries:function(vo1,vo2){
		var rt={"valid":false,"info":''};
		
		var that=this;
		var recordLen=vo1.length;
		if (recordLen<2) {
			rt.valid=true;
			return rt;
		}
		for(var i=0;i<recordLen-1;i++){
		  var dttm1=vo1[i]+' '+vo2[i];
		  for(var j=i+1;j<recordLen;j++){
		     var dttm2=vo1[j]+' '+vo2[j];
		     if(dttm1==dttm2){
		        rt.valid=false;
		        rt.info=shr.formatMsg(jsBizMultLan.atsManager_fillSignCardEdit_i18n_6,[dttm1, i+1, j+1]);
		        return rt;
		     }
		  }
		}
	
		rt.valid=true;//循环完，没重复，valid=true
		return rt;
	}
	,
	/**
	 * HRBillStateEnum(与转正,调动,离职单据的一致) || BizStateEnum 这个是 EAS7.5版的请假单使用的审批状态值,后续不用这个了<br/>
	 * 后续的加班,出差,请假,补签卡都用HRBillStateEnum这个单据状态,以便可以统一修改<br/>
	 * view: <field name="billState"  label="单据状态" type="text"></field>	   <br/>
	 * 查看页面取值 var billState = $("#billState").html(); 
	 * view: <field name="billState"  label="单据状态" type="text"></field>	   <br/>
	 * 查看页面取值 var billState = $("#billState").val(); 
	 * 
	 * 设置编辑按钮是否隐藏		|| 对应EAS7.5 Version 审批状态字段值<br/>
	 * 0-save  未提交			||  -1  未提交					   <br/>
	 * 1-submited 未审批			||   0  未审核					   <br/>
	 * 2-auditing 审批中			||   1  审核中					   <br/>
	 * 3-audited  审批通过		||   3  审核完成					   <br/>
	 * 4-auditend 审批不通过		||   4  审核终止					   <br/>
	 */
	setButtonVisible:function(){
		var that = this;
		var billState = $("#billState").val();
		//alert(billState);
		if (billState) {
			if (billState==3 || jsBizMultLan.atsManager_fillSignCardEdit_i18n_15==billState || billState ==4
				||jsBizMultLan.atsManager_fillSignCardEdit_i18n_14==billState || billState ==2
				||jsBizMultLan.atsManager_fillSignCardEdit_i18n_16==billState ) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1==billState || jsBizMultLan.atsManager_fillSignCardEdit_i18n_19== billState || 2 == billState
				|| jsBizMultLan.atsManager_fillSignCardEdit_i18n_16==billState ) { //未审批或审批中
				if(!this.isFromWF()){
					$("#edit").hide();
					$("#submit").hide();
					$("#submitEffect").hide();
				}
			}
			
			// if(0==billState || "未提交"== billState){
			//       $("#workFlowDiagram").hide();
			// 	  $("#auditResult").hide();
			// }
			/*else if(1==billState || "未审批"== billState){
				  $("#auditResult").hide();
			}
			*/
			
		}
		
		if (this.getOperateState().toUpperCase() == 'VIEW') { //查看状态下不允许提交
			//不允许提交生效
			$("#submitEffect").hide();
			if(billState == 0)
			{
		        $("#submit").show();
		    }else {
		    	$("#submit").hide();
		    }
			if(this.isFromWF()){ // 来自任务中心
				$('#cancelAll').hide();
				$('#submit')
					.text(jsBizMultLan.atsManager_fillSignCardEdit_i18n_18);
				$('#edit').hide();
			}
		}
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
		
		//构造分录数据
		var entries = _self.assembleEntriesData() ;
		
	 	model.entries = entries;
		
		
	 	if(entries.length<1){
	 		shr.showError({message: jsBizMultLan.atsManager_fillSignCardEdit_i18n_21});
	 		return null;
	 	}
        model.ccPerson = model.ccPersonIds;
		data.model = shr.toJSON(model);
		data.method = action;
		
		// relatedFieldId
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		if(data == null){
			return;
		}
		if($('#hrOrgUnit_el').val()==null || $('#hrOrgUnit_el').val()==""){
			if($('#hrOrgUnit').val()==null || $('#hrOrgUnit').val()=="" ){
				shr.showWarning({message: jsBizMultLan.atsManager_fillSignCardEdit_i18n_13});
				return;
			}
		}
			//传递额外参数person,empPosOrgRela
		data=$.extend({
		  person:$('#entries_person_id').val(),
		  //position:$('#entries_position_id').val(),
		  //adminOrgUnit:$('#entries_adminOrgUnit_id').val(),
		  //empPosOrgRela:$('#empPosOrgRela').val(),
		  hrOrgUnit:$('#hrOrgUnit_el').val()==null?$('#hrOrgUnit').val():$('#hrOrgUnit_el').val()
		},data);
		
		return data;
	}
	,assembleEntriesData : function(){
		
		var entries =[];
		var lengthArray = [];

		var personDateStr = '';

		if (_self.getOperateState().toUpperCase() != 'VIEW') { 
			$('#fillSignCardEntryInfo input[name^=attendDate]').each(function(i,domEle) {
				  var length = $(domEle).attr("name").substring("attendDate".length);
				  lengthArray.push(parseInt(length));
			});
			
			//将数组由小到大排列
			if(lengthArray.length > 0){
				lengthArray.sort(sortNumber);
			}
			
			for(var i=0;i<lengthArray.length;i++){
				var entrie = {
					id: correctValue($('#fillSignCardEntryInfo input[name="id' + lengthArray[i] + '"]').val()),
					attendDate: atsMlUtile.getFieldOriginalValue('fillSignCardEntryInfo input[name="attendDate' + lengthArray[i] + '"]'),
					type: new Number($('#fillSignCardEntryInfo input[type=hidden][id="type' + lengthArray[i]  +'_el"]').val()),
					reason: {
							id:correctValue($('#fillSignCardEntryInfo input[type=hidden][id="reason'+ lengthArray[i]  + '_el"]').val()),
							name:correctValue($('#fillSignCardEntryInfo input[name="reason' + lengthArray[i]  + '"]').val())},
							
					fillCardTimeStr: correctValue($('#fillSignCardEntryInfo input[name="fillCardTimeStr' + lengthArray[i]  + '"]').val()),
					//remark:	correctValue($('#fillSignCardEntryInfo input[name="remark' + lengthArray[i] + '"]').val()),
					remark: shr.getFieldValue("remark" + lengthArray[i]),
					person:{id:$("#entries_person").shrPromptBox("getValue").id }
				}
				var date = entrie.attendDate;
				var personId = entrie.person.id;
				if(date && personId){
					if(i > 0){
						personDateStr +=",";
					}
					personDateStr += personId +"_"+date.substring(0,10);
				}
				entries.push(entrie);
			}
	 	}
		else
		{
			$('#fillSignCardEntryInfo span[name^=attendDate]').each(function(i,domEle) {
				  var length = $(domEle).attr("name").substring("attendDate".length);
				  lengthArray.push(parseInt(length));
			});
			
			//将数组由小到大排列
			if(lengthArray.length > 0){
				lengthArray.sort(sortNumber);
			}
			
			for(var i=0;i<lengthArray.length;i++){
				var entrie = {
					id: correctValue($('#fillSignCardEntryInfo input[name="id' + lengthArray[i] + '"]').val()),
					attendDate: atsMlUtile.getFieldOriginalValue('#fillSignCardEntryInfo span[name="attendDate' + lengthArray[i] + '"]'),
					type: new Number($('#fillSignCardEntryInfo input[type=hidden][id="type' + lengthArray[i]  +'_el"]').val()),
					reason: {
							id:correctValue($('#fillSignCardEntryInfo input[type=hidden][id="reason'+ lengthArray[i]  + '_el"]').val()),
							name:correctValue($('#fillSignCardEntryInfo span[name="reason' + lengthArray[i]  + '"]').text())},
							
					fillCardTimeStr: correctValue($('#fillSignCardEntryInfo span[name="fillCardTimeStr' + lengthArray[i]  + '"]').text()),
					remark:	correctValue($('#fillSignCardEntryInfo span[name="remark' + lengthArray[i] + '"]').text()),
					person:{id:$("#entries_person").val()}
				}
				var date = entrie.attendDate;
				var personId = entrie.person.id;
				if(date && personId){
					if(i > 0){
						personDateStr +=",";
					}
					personDateStr += personId +"_"+date.substring(0,10);
				}
				entries.push(entrie);
			}
		}

		if(personDateStr){
			_self.remoteCall({
				type:"post",
				method:"getPersonAdminOrgUnit",
				param:{ personDateStr:personDateStr},
				async: false,
				success:function(res){
					var info =  res;
					var personAtsInfo = {};
					for (var i = 0; i < entries.length; i++) {
						var date = entries[i].attendDate;
						var personId = entries[i].person.id;
						if(date && personId ){
							var person_date = personId +"_"+date.substring(0,10);
							personAtsInfo = info[person_date];
							if(personAtsInfo  && personAtsInfo.adminOrgUnit){
								entries[i]["adminOrgUnit"]= personAtsInfo.adminOrgUnit;
								entries[i]["position"]= personAtsInfo.position;
							}
						}
					}
				}
			});
		}
		return entries;
	
	}
	,beforeSubmit :function(){
		
		var _self = this,
		workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		if (($form.valid() && _self.verify())) {
			return true ;
		}
		// return false 也能保存，固让js报错，后续让eas修改 return false 逻辑
		var len = workArea.length() ;
		return false ;
	}
	,getCurrentModel : function(){
		
		var that = this ;
		var model = shr.ats.FillSignCardEdit.superClass.getCurrentModel.call(this);
		var entries = that.assembleEntriesData();
		var position = model.entries[0].position ;
		var admin =  model.entries[0].adminOrgUnit;
		var person = model.entries[0].person ;
		model.entries =  entries ;
		var len = model.entries.length ;
		for(var i = 0; i < len; i++)
		{
			 model.entries[i].position = position;
			 model.entries[i].adminOrgUnit = admin;
			 model.entries[i].person  = person;
		}
        model.ccPersonIds = model.ccPersonIds && model.ccPersonIds.id || "";
        model.ccPerson = model.ccPersonIds;
		return model ;
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
