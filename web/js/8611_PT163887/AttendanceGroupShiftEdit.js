shr.defineClass("shr.ats.AttendanceGroupShiftEdit", shr.framework.Edit, {
	  /*是否触发了真正意义上的改变事件*/
	  isTriggerShiftChange : false,
	  firstDefaultShift : null,
	  isClickShiftF7 : false,
      initalizeDOM:function(){
			shr.ats.AttendanceGroupShiftEdit.superClass.initalizeDOM.call(this);
			var that = this ;
			//初始化分录数据
			that.initEditGrid();
			
			//初始化显示分录保存信息
			that.initShowItemsInfo();
			
			//绑定日期类型改变事件
			that.dayTypeChange(); 
			$('#standardHour').attr("validate","{maxlength:9,required:true,number:true,my24Vldt:true}");
					
			//增加班次监听事件
			if(that.getOperateState() == "EDIT" ||that.getOperateState()=="ADDNEW"){
			    that.processF7ChangeEvent();
			}
			if(that.getOperateState()=="ADDNEW" || that.getOperateState() == "EDIT"){
				that.addElasticDoc();//设置弹性班浮动提示
				that.addElasticHtml();
			}
			if(that.getOperateState()=="VIEW"){
				if($("#isElastic").val()==0){
					$("#elasticType").parent().parent().hide();
				}
				if($("#isElastic").val()==1 && $("#elasticType").val()==1){
					var content = atsMlUtile.getFieldOriginalValue("elasticDirection")==0?shr.formatMsg(jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_81,[atsMlUtile.getFieldOriginalValue("elasticValue")])
					 : shr.formatMsg(jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_81,[atsMlUtile.getFieldOriginalValue("elasticValue")]);
					$("#elasticType").html($("#elasticType").html() + "&nbsp;&nbsp;&nbsp;&nbsp;" + content);
				}
			}
			//使用自定义的校验扩展校验 
			that.myExtendValidate();
			if(that.getOperateState() == "EDIT"){
				that.firstDefaultShift = $("#defaultShift").shrPromptBox("getValue");
				$($(".ui-promptBox-icon")[0]).bind("click",function(){
					//这里做的目的就是为了触发当选择F7,选的还是原来的值的时候，要触发onchange事件，框架限制，很无奈！
					 that.isClickShiftF7 = true;
					 if(that.isTriggerShiftChange == false){
						 var defaultShift = {"id" : "", "name" : that.firstDefaultShift.name};
			             $("#defaultShift").shrPromptBox("setValue",defaultShift,true);
					 }
		        });
			}
			
			//不可编辑
        	$('#elasticType').shrSelect("disable");
        	$('#isElastic').iCheck('disable');
        	$('#elasticDirectionTemp').shrSelect("disable");
        	$('#elasticValueTemp').shrTextField("disable");
        	$('#isHalfDay').iCheck('disable');
      }
      ,setCardRuleFilter: function(count){
      	var that = this;
      	if(count <= 0){
      		
      	}
      	else{
      		if(that.getOperateState() == "EDIT"){
      		    $('#cardRule').shrPromptBox("setFilter","startSegmentNum = " + count);
      		}
      	}
      }
      ,initShowItemsInfo:function(){
      	var that = this;
      	 if(that.getOperateState() == "VIEW" || that.getOperateState() == "EDIT"){
	  		var data = {
					id:$('#form #id').val()||'',
//					uipk:"com.kingdee.eas.hr.ats.app.ScheduleShift.form"
					uipk:"com.kingdee.eas.hr.ats.app.AttendanceGroupShift.form"
			};
			shr.doAjax({
				url: shr.getContextPath()+"/dynamic.do?method=getScheduleShiftItemsInfo",
				dataType:'json',
				type: "POST",
				data: data,
				success: function(response){ 
					that.addRowData(response);
					that.doubleTiggerElastic();
					that.setCardRuleFilter(response.records);
					//一段班的时候，休息开始休息结束时间改变的时候。段内休息也要做相应的改变
					
					that.InitsegmentInRest1();
				}
			});	
	  	}
	  	else{
	  		//nothing;
	  	}
      }
      ,initEditGrid :function(){
	  	var row_fields_work =  '<div style="padding-top:15px;" class="row-fluid row-block row_field">'
			+ '<div class="spanSelf_01"><span class="cell-RlStdType"></span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_11
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_3
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_2
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_72
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_76
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_29
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_2
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_82
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_83
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_29
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_87
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_85
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_12
			+ '</span></div>'
	  	 	+ '</div>';
	  	 $('#itemInfo').append(row_fields_work);
	}
	,addMainData:function(rst){
		
		var that = this;
		var atsShift = rst.atsShift;
		if(!atsShift.standardHour){
			$("#defaultShift_id").val(atsShift.id);
			$("#defaultShift").val(atsShift.name);
			$('#defaultShift_el').val(atsShift.id);
		}else{
			that.isTriggerShiftChange = true;
			$("#defaultShift_id").val(atsShift);
			$("#defaultShift").val(atsShift.name);
			isShiftChange = true;
			atsMlUtile.setTransNumValue("standardHour",atsShift.standardHour);
			var dataValue = {
					id:atsShift['shiftType.id'],
					name:atsShift['shiftType.name']
			};
			$('#shiftType').shrPromptBox("setValue", dataValue);
			var dataValue2 = {
					id:atsShift['otCompens.id'],
					name:atsShift['otCompens.name']
			};
			$("#otCompens").shrPromptBox("setValue", dataValue2);
			var dataValue3 = {
					id:rst.cardRuleId,
					name:rst.cardRuleName
			};
			$("#cardRule").shrPromptBox("setValue", dataValue3);
			if(atsShift.isElastic){
				$("#isElastic").shrCheckbox("check");
			}else{
				$("#isElastic").shrCheckbox("unCheck");
			}
			$("#elasticType").shrSelect("setValue",atsShift.elasticType);
			$("#elasticDirectionTemp").shrSelect("setValue",atsShift.elasticDirection);
			$("#elasticValueTemp").shrTextField("setValue",atsShift.elasticValue);
			$("#elasticDirection").val(atsShift.elasticDirection);
			atsMlUtile.setTransNumValue("elasticValue",atsShift.elasticValue);
	  }
	}
	,addRowData:function(rst){
		var that = this;
		$('#itemInfo').empty();
		that.initEditGrid();
		if(rst != null && rst.records != null && rst.records>0){
	  		var segment_key,segment_value,attendanceType_key,attendanceType_value,preTime,preIsPunchCard_key,preIsPunchCard_value;
	  		var preFloatAdjusted,preUnit_key,preUnit_value,segmentInRest,nextTime,nextIsPunchCard_key,nextIsPunchCard_value,nextFloatAdjusted;
	  		var shiftItemId,preTimeDayType_key,nextTimeDayType_key;
	  		for(var i=1;i<=rst.rows.length;i++){
				var row = rst.rows[i-1];
				segment_key = row["segment.key"],segment_value = row["segment.value"],attendanceType_key=row["attendanceType.key"],attendanceType_value = row["attendanceType.value"];
				preTime = row["preTime"],preIsPunchCard_key = row["preIsPunchCard.key"],preIsPunchCard_value = row["preIsPunchCard.value"],preFloatAdjusted = row["preFloatAdjusted"];
				preUnit_key = row["preUnit.key"],preUnit_value = row["preUnit.value"],nextUnit_key = row["nextUnit.key"],nextUnit_value = row["nextUnit.value"];
				segmentInRest = row["segmentInRest"],nextTime = row["nextTime"],nextIsPunchCard_key = row["nextIsPunchCard.key"];
				nextIsPunchCard_value = row["nextIsPunchCard.value"],nextFloatAdjusted = row["nextFloatAdjusted"];
				preTimeDayType_key = row["preTimeDayType.key"],nextTimeDayType_key = row["nextTimeDayType.key"];
				preTimeDayType_value = row["preTimeDayType.value"],nextTimeDayType_value = row["nextTimeDayType.value"];
				restPreTime = row["restPreTime"],restNextTime = row["restNextTime"];
				
				shiftItemId = row["shiftItemId"];
				
				var row_fields_work = '<div  class="row-fluid row-block row_field">'
				if(that.getOperateState() == "ADDNEW" || that.getOperateState() == "EDIT"){
	    			row_fields_work = row_fields_work
						   // + '<div class="spanSelf_01"><input type="hidden" name="shiftItemId' + i + '" value="' + shiftItemId + '"/> <span>' + correctValue(i) + '<span/></div>'
						    + '<div class="spanSelf_01"><input type="hidden" name="shiftItemId' + i + '" value="' + shiftItemId + '"/></div>'
						    
						    + '<div class="spanSelf"><input type="text" name="segment' + i + '" value="" class="input-height cell-input"/></div>'
						    + '<div class="spanSelf"><input type="text" name="attendanceType' + i + '" value="" class="input-height cell-input"/></div>'
						    + '<div class="spanSelf"><input type="text" name="preTimeDayType' + i + '" value="" class="input-height cell-input"/></div>'
					    
						    + '<div class="spanSelf"><input type="text" style="background-color:#daeef8"  name="preTime' + i + '" value="' + correctValue(preTime) + '" class="input-height cell-input"  validate="{required:true,myTmVldt:true}"/></div>'
						    + '<div class="spanSelf"><input type="text" name="preIsPunchCard' + i + '" value="" class="input-height cell-input"/></div>'
						    + '<div class="spanSelf"><input type="text" name="preFloatAdjusted' + i + '" value="' + correctValue(preFloatAdjusted) + '" class="input-height cell-input" validate="{number:true}" /></div>' 
						    
						    + '<div class="spanSelf"><input type="text" name="nextTimeDayType' + i + '" value="" class="input-height cell-input"/></div>'
						    + '<input type="hidden" name="preUnit' + i + '" value="' + correctValue(preUnit_key) + '"/><input type="hidden" name = "preUnit' + i + '_el" value="' + correctValue(preUnit_value) + '"/>'
						    + '<input type="hidden" name="nextUnit' + i + '" value="' + correctValue(nextUnit_key) + '"/><input type="hidden" name = "nextUnit' + i + '_el" value="' + correctValue(nextUnit_value) + '"/>'
						    
						    + '<div class="spanSelf"><input type="text" style="background-color:#daeef8" name="nextTime' + i + '" value="' + correctValue(nextTime) + '" class="input-height cell-input"  validate="{required:true,myTmVldt:true}"/></div>' 
						    + '<div class="spanSelf"><input type="text" name="nextIsPunchCard' + i + '" value="" class="input-height cell-input" /></div>'
						    + '<div class="spanSelf"><input type="text" name="nextFloatAdjusted' + i + '" value="' + correctValue(nextFloatAdjusted) + '" class="input-height cell-input" validate="{number:true}"/></div>'
							
							+ '<div class="spanSelf"><input type="text" name="restPreTime' + i + '" value="' + correctValue(restPreTime) + '" class="input-height cell-input"  validate="{myRestTmVldt:true}"/></div>' 
						    + '<div class="spanSelf"><input type="text" name="restNextTime' + i + '" value="' + correctValue(restNextTime) + '" class="input-height cell-input"  validate="{myRestTmVldt:true}"/></div>' 
						     
							+ '<div class="spanSelf"><input type="text" name="segmentInRest' + i + '" value="' + correctValue(segmentInRest) + '" class="input-height cell-input"  validate="{number:true,myRestVldt:true}"/></div>' 
						    
					+ '</div>';
					$('#itemInfo').append(row_fields_work);
					that.packageF7Value(i,segment_value,attendanceType_value,preIsPunchCard_value,nextIsPunchCard_value,preTimeDayType_value,nextTimeDayType_value);
				}
				else if(that.getOperateState() == "VIEW"){
					row_fields_work =  row_fields_work
					        //+ '<div class="spanSelf_01"><input type="hidden" name="shiftItemId' + i + '" value="' + shiftItemId + '"/> <span>' + correctValue(i) + '<span/></div>'
							+ '<div class="spanSelf_01"><input type="hidden" name="shiftItemId' + i + '" value="' + shiftItemId + '"/> </div>'
							+ '<div class="spanSelf"> <span class="cell-input">' + correctValue(segment_key) + '</span></div>'
							
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(attendanceType_key) + '</span></div>'
							
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(preTimeDayType_key) + '</span></div>'

							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(preTime) + '</span></div>'
							
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(preIsPunchCard_key) + '</span></div>'
						
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(preFloatAdjusted) + '</span></div>'
							
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(nextTimeDayType_key) + '</span></div>'
							
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(nextTime) + '</span></div>'
							
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(nextIsPunchCard_key) + '</span></div>'
							
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(nextFloatAdjusted) + '</span></div>'
							
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(restPreTime) + '</span></div>'
							
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(restNextTime) + '</span></div>'
							
							+ '<div class="spanSelf"><span class="cell-input">' + correctValue(segmentInRest) + '</span></div>'

						+ '</div>';
						$('#itemInfo').append(row_fields_work);
				}
	  		}
		}
		
		if(rst.rows.length > 1){
			$('input[name ^="restPreTime"]').attr("disabled",'true');
	  		$('input[name ^="restNextTime"]').attr("disabled",'true');
		}
	}
	,packageF7Value:function(rowNum,segment_value,attendanceType_value,preIsPunchCard_value,nextIsPunchCard_value,preTimeDayType_value,nextTimeDayType_value){	
		    //将【段次】 【出勤类型】【上班是否打卡】【下班是否打卡】封装成F7
			//$('input[name="fillCardTimeStr' + i + '"]').attr("validate","{required:true,myTmVldt:true}");
			var segment = { name:"segment" + rowNum,
	    					 readonly: "true",
	    					 value: "1",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
		   segment.data = [{value:"1",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_10},
		                    {value:"2",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_8},
		            		{value:"3",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_9}];
		            		
		   var attendanceType = { name:"attendanceType" + rowNum,
	    					 readonly: "",
	    					 value: "1",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
	    					
		   attendanceType.data = [{value:"1",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_91},
		                    	  {value:"2",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_30},
		            			  {value:"3",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_92},
		            		      {value:"4",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_31}];
		            		      
		  var timeDayType = {name: "timeDayType" + rowNum,
	    					 readonly: "",
	    					 value: null,
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
	    					
		  timeDayType.data = [{value:"0",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_33},
		                    	  {value:"1",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_7},
		            			  {value:"2",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_32}];
		            			  
		
		 
		            		      
		   var preIsPunchCard = { name:"punchCard" + rowNum,
	    					 readonly: "",
	    					 value: "1",
							 onChange: null,
							 validate: "{required:true}",
							 filter: ""
	    					};
		   preIsPunchCard.data = [{value:"1",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_78},
		                    	  {value:"0",alias:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_28}];
		                    	 

		    if(segment_value == null){
		    	segment_value = rowNum;	
		    }
    	 	segment.value = segment_value;
    	 	$('#itemInfo input[name=segment'+rowNum+']').shrSelect(segment);
    	 	if(attendanceType_value == null){
    	 		attendanceType_value = "1";
    	 	}
    	 	attendanceType.value = attendanceType_value;
    	 	$('#itemInfo input[name=attendanceType'+rowNum+']').shrSelect(attendanceType);
    	 	
    	 	if(preIsPunchCard_value == null){
    	 		preIsPunchCard_value = "1";
    	 	}
    	 	preIsPunchCard.value = preIsPunchCard_value;
    	 	$('#itemInfo input[name=preIsPunchCard'+rowNum+']').shrSelect(preIsPunchCard);
    	 	if(nextIsPunchCard_value == null){
    	 		nextIsPunchCard_value = "1";
    	 	}
	     	preIsPunchCard.value = nextIsPunchCard_value;
    	 	$('#itemInfo input[name=nextIsPunchCard'+rowNum+']').shrSelect(preIsPunchCard);
    	 	
    	 	if(nextTimeDayType_value == null){
    	 		nextTimeDayType_value = "1"
    	 	}
    	 	timeDayType.value = nextTimeDayType_value + "";
    	 	$('#itemInfo input[name=nextTimeDayType'+rowNum+']').shrSelect(timeDayType);
    	 	
    	 	if(preTimeDayType_value == null){
    	 		preTimeDayType_value = "1"
    	 	}
    	 	timeDayType.value = preTimeDayType_value + "";
    	 	$('#itemInfo input[name=preTimeDayType'+rowNum+']').shrSelect(timeDayType);
    	 	

    	 	
    	 	
    }
      /*
       * 处理点击【班次名称】时，【班次信息】动态呈现变化
       */
      ,processF7ChangeEvent : function(){
	    var that = this;
	 
		$("#defaultShift").shrPromptBox("option", {
			onchange : function(e, value) {
				var info = value.current;
				if(info.id == null ||  info.id.length == 0){
					if(info.name != null && info.name !== ""){
						//这里是为了解决选择班次没改变的时候，要显示值。【选择休息日和法定假日的时候会把id和name都设置成""】
						//费尽心机其实只是为了触发当选择F7,选的还是原来的值的时候，要触发onchange事件这个问题。【这时只是将id设置成了"",name还是原来的。】
					   that.initShowItemsInfo();
					}else{
						if($('#isElastic').shrCheckbox("isSelected")){
							$("#isElastic").shrCheckbox("unCheck");
						}
					}
					return;
				}
				that.remoteCall({
					type:"post",
					method:"getShiftItemInfo",
					param:{atsShiftId: info.id},
					success:function(res){
						if(res.atsShift.isHalfDay){
							$("#isHalfDay").shrCheckbox("check")
						}else{
							$("#isHalfDay").shrCheckbox("unCheck");
						}
						
						that.addRowData(res);
						that.addMainData(res);
						that.doubleTiggerElastic();
						//that.setCardRuleValue({id: res.cardRuleId,name: res.cardRuleName});
						that.setCardRuleFilter(res.records);
					    //一段班的时候，休息开始休息结束时间改变的时候。段内休息也要做相应的改变
	                    that.InitsegmentInRest1();
	                   
					}
				});
			}
		});
      }
      ,setCardRuleValue: function(object){
      	if(object && object.id.length  >0 && object.name.length > 0){
      		$("#cardRule").shrPromptBox("setValue",{
									id : object.id,
									name : object.name
      	 	});
      	}
      	else{
      		$("#cardRule").shrPromptBox("setValue",{
									id : '',
									name : ''
      	 	});
      	}
      	 
      }
     ,getEnumInfo:function(object){
    	if(object === undefined){
    		return "";
    	}
    	else if(object == null){
    		return "";
    	}
    	else{
    		return object.alias;
    	}
    }
    ,getString:function(value){
    	if(value == undefined){
    		return "";
    	}
    	else{
    		return value;
    	}
    }
	,myExtendValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {  
    		myTmVldt: jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_34 ,
    		myRestTmVldt: jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_34 ,
    		myRestVldt:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_13,
    		my24Vldt:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_0
		  });  
		  jQuery.validator.addMethod("myTmVldt", function(value, element) {  
	    	   var v=value||'';
	    	   if(/[0-2][0-9]:[0-5][0-9]/.test(v)&&v.length==5){
	    	   	  var h=new Number(v.substr(0,2));
	    	   	  if(h<24)
	    	   	    return true;
	    	   	  else
	    	   	    return false;
	    	   }else{
	    	   	  return false;
	    	   }
		  }, jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_34);//msg:错误提示文本。已验证
		  
		   jQuery.validator.addMethod("myRestTmVldt", function(value, element) {  
	    	   var v=value||'';
	    	   if(v == '' || v.length == 0){
	    	   		return true;
	    	   }
	    	   if(/[0-2][0-9]:[0-5][0-9]/.test(v)&&v.length==5){
	    	   	  var h=new Number(v.substr(0,2));
	    	   	  if(h<24)
	    	   	    return true;
	    	   	  else
	    	   	    return false;
	    	   }else{
	    	   	  return false;
	    	   }
		  }, jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_34);//msg:错误提示文本。已验证
		  
		  jQuery.validator.addMethod("myRestVldt", function(value, element) { 
	    	var v=value||'';
	    	   if(v == '' || v == undefined){
	    	   	  return true;
	    	   }
	    	   else{
		    	  v=v.trim();
		    	  var vn=new Number(v);
		    	  var nameLength = element['name'].length;
		    	  var num = element['name'].substr(nameLength - 1,1);
		    	  
		    	  var opre=$('input[name="preTime' + num + '"]').val();
				  var onext=$('input[name="nextTime' + num + '"]').val();
				 
				  var time1=new Number(opre.substring(0,2)) * 60 + new Number(opre.substring(3,5));
				  var time2=new Number(onext.substring(0,2)) * 60 + new Number(onext.substring(3,5));
				 
				  var timeDayType = $('input[name="preTimeDayType' + num + '_el"]').val();
				  time1 = getRealTimeByType(time1,timeDayType);
				  
				  timeDayType =  $('input[name="nextTimeDayType' + num + '_el"]').val();
				  time2 = getRealTimeByType(time2,timeDayType);
				  var total= time2 -time1; 
				  if (total<vn) {
					 return false;
				  } 
				  else {
					return true;
				  }
			  	}
		  }, jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_14);//msg:错误提示文本。已验证

	      jQuery.validator.addMethod("my24Vldt", function(value, element) {
			  var vn=value||'';
			  if ("string" === typeof vn) {
				  vn=new Number(vn.trim());
			  }
	    	 if (24<vn) {
	    	 	return false;
	    	 }else {
		     	return true;
		     }
	      },jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_0);
	}	
	/**参数要求vo为一个数组，数组元素为一个对象{pre:x,next:y,name:nnn,val:vvv} .
	 * 返回一个对象{"valid":bool,"info":'',"vo":vo}
	 * 时间轴验证:第n+1段，必须是在第n段的时间轴之后。
	 * */
	,validateTimeAxis:function( vo ){
		  var that=this;
		  var rt={"valid":false,"info":'',"vo":vo};
		  var a=vo||[];
		  
	      if(a.length<2){
	      	rt.valid=true;
	        return rt;
	      }else{
	      	//摔下检查同名
	      	var min1,max1;//min:时间轴上段次应该排在前的，max:时间轴上段次应该排在后的
	        for(var i=0;i<a.length-1;i++){
	           for(var j=i+1;j<a.length;j++){
	           	   if (a[i].segment<=a[j].segment) {
	           	   	  min1=a[i];
	           	   	  max1=a[j];
	           	   } else {
	           	   	  min1=a[j];
	           	   	  max1=a[i];
	           	   }
	              if (min1.segment==max1.segment) {
	              	 rt.valid=false;
	                 rt.info=jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_1+getSegmentNameByValue(min1.segment);
	                 return rt;
	              }
	           }
	        }   
	      	
	      	var min,max;//min:时间轴上段次应该排在前的，max:时间轴上段次应该排在后的
	        for(var i=0;i<a.length-1;i++){
	           for(var j=i+1;j<a.length;j++){
	           	   if (a[i].segment<=a[j].segment) {
	           	   	  min=a[i];
	           	   	  max=a[j];
	           	   } else {
	           	   	  min=a[j];
	           	   	  max=a[i];
	           	   }
	           	
	              //时间轴上min应该在max前面
	              if( that.validateTimeLegal(min,max))
	              {
	                 rt.valid=true;
	                 rt.info='';
	              }else{
	                 rt.valid=false;
	                 //rt.info= '段次时间设置有问题，段次'+max.name+'与'+min.name+'之间的跨度不能超过24小时(即一天)';
	                 rt.info=jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_94;
	                 return rt;
	              }
	           }
	        }
	      }
	     return rt; 
	},
	/**对象格式{pre:x,next:y,name:nnn,val:vvv}，其中x,y值格式为 hh:mi 时分,其中必须确定0<=hh<24,0<=mi<60
	 * min:时间轴上段次应该排在前的，max:时间轴上段次应该排在后的,现在比较是否符合这个规则。
	 * */
	validateTimeLegal:function(min,max){
		var min_pre_h=new Number(min.preTime.substr(0,2))+ (new Number(min.preTime.substr(3,2)))/60;
		var min_next_h=new Number(min.nextTime.substr(0,2))+ (new Number(min.nextTime.substr(3,2)))/60;
		var max_pre_h=new Number(max.preTime.substr(0,2))+ (new Number(max.preTime.substr(3,2)))/60;
		var max_next_h=new Number(max.nextTime.substr(0,2))+ (new Number(max.nextTime.substr(3,2)))/60;
		//如果pre_h>=next_h,则认为next_h为第二天的,需调整
		//传入的参数为hh:mi，已经确保了hh不会超过24
		if(min_pre_h>=min_next_h){
		   min_next_h+=24;
		}
		if(max_pre_h>=max_next_h){
		   max_next_h+=24;
		}
		
		//max_pre_h<min_next_h,认为max是min的第二天的，需调整
		if(max_pre_h<min_next_h){ 
		   max_pre_h+=24;
		   max_next_h+=24;
		}
		
		//经过以上调整 ，再做判断
		if(max_next_h-min_pre_h>24){
			return false;
		}else{
			return true;
		}
		
	},calcutlateStandardHour:function(vo){   
		var standardHour=0;
	    if(!vo){
			return standardHour;
		}
		var total2 = 0,time1 = 0,time2 = 0,rest;
		for(var j=0;j<vo.length;j++){
		   	if (vo[j].attendanceType==1 ||vo[j].attendanceType=='1 ' || vo[j].attendanceType==3|| vo[j].attendanceType=='3') {
			   	 	//正常出勤1  正常出勤不计异常3
			     time1 = new Number(vo[j].preTime.substring(0,2)) * 60 + new Number(vo[j].preTime.substring(3,5));
			     time2 = new Number(vo[j].nextTime.substring(0,2)) * 60 + new Number(vo[j].nextTime.substring(3,5));
			     rest = 0;
			     if(vo[j].segmentInRest.length > 0){
			     	rest = new Number(vo[j].segmentInRest);
			     }
			     
			     time1 = getRealTimeByType(time1,vo[j].preTimeDayType);
			     time2 = getRealTimeByType(time2,vo[j].nextTimeDayType);
			      
			     total2 += (time2 - time1)-rest;
		   	} 
		}
		standardHour=(new Number(total2)/60).toFixed(2);
		atsMlUtile.setTransNumValue('standardHour',standardHour);
		//return standardHour;
	}
	/**返回一个对象{"valid":bool,"info":'',"vo":vo}*/
	/*
	 * 注释：chenwei
	 */
	
	,validateItems:function(){
		var that=this;
		var item = that.getItemsInfo();
		if(item == null || item.length == 0){
			return true;
		}
		
		if(item.length>1 && $('#isElastic').shrCheckbox("isSelected") && $("input#elasticType").shrSelect("getValue").value==0){
    		shr.showWarning({message:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_37});
    	    return false;
    	}
    	if( ($("[name='attendanceType1_el']").val()=="2" || $("[name='attendanceType1_el']").val()=="4")
    	&& $('#isElastic').shrCheckbox("isSelected") && $("input#elasticType").shrSelect("getValue").value==0){
    		shr.showWarning({message:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_38});
    	    return false;
    	}
    	if($('#isElastic').shrCheckbox("isSelected") && $("input#elasticType").shrSelect("getValue").value==1){
    		if(!(parseFloat($("#elasticValueTemp").val())>0)){
    			shr.showWarning({message:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_5});
    	        return false;
    		}
    		if(!(/^-?\d+\.?\d{0,2}$/.test($("#elasticValueTemp").val()))){
    			shr.showWarning({message:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_6});
    	        return false;
    		}
    		if(parseFloat(atsMlUtile.getFieldOriginalValue("elasticValueTemp"))>=parseFloat(atsMlUtile.getFieldOriginalValue("standardHour"))){
    			shr.showWarning({message:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_80});
    	        return false;
    		}
    		var restpretime = $("[name='restPreTime1']").val();
    		var pretime = $("[name='preTime1']").val();
    		if ( !(restpretime.trim() == "")){
				var pretimeVal = parseInt(pretime.split(":")[0])+parseInt(pretime.split(":")[1])/60;
				var restpretimeVal = parseInt(restpretime.split(":")[0])+parseInt(restpretime.split(":")[1])/60;
				if(restpretimeVal>pretimeVal && parseFloat($("#elasticValueTemp").val())>=(restpretimeVal-pretimeVal) ){
					shr.showWarning({message:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_93});
    	    		return false;
				}
				if(restpretimeVal<=pretimeVal && parseFloat($("#elasticValueTemp").val())>=(24+restpretimeVal-pretimeVal) ){
					shr.showWarning({message:jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_93});
    	    		return false;
				}
			}
    	}
		var vo = [];
		for(var i=0;i<item.length; i++){
			var o={
			  segment: item[i].segment, //段次的时间，按时间轴进行，谁在前谁在后，由此处的val来决定
			  preTime: item[i].preTime ,
			  nextTime: item[i].nextTime,
			  preTimeDayType: item[i].preTimeDayType,
			  nextTimeDayType: item[i].nextTimeDayType,
			  attendanceType: item[i].attendanceType,
			  segmentInRest: item[i].segmentInRest
			};
			vo.push(o);
		}
		
		var rt=that.validateTimeAxis(vo);
		var res = that.valideTimeOfCompareNew(vo);
		if(!res){
		   return false;
		}
		
		if(rt.valid){
			that.calcutlateStandardHour(vo);
			return true;	
		}
		else{
			shr.showWarning({message: rt.info});
			return false;
		}
		
	}
	
	/*
	 * author:chenwei
	 * date:2014/03/14
	 * funciton:在保存之前
	 */
	,saveAction: function(event) {
		var dayType = $('#dayType_el').val();
		var _self = this;
		$("#elasticDirection").val($("#elasticDirectionTemp").shrSelect("getValue").value);
		atsMlUtile.setTransNumValue("elasticValue",atsMlUtile.getFieldOriginalValue("elasticValueTemp"));
		if(dayType == '0' ){
			var firstDefaultShift_el = $('#defaultShift_el').val();
			if(this.isClickShiftF7 == true && this.isTriggerShiftChange == false && (firstDefaultShift_el == null || firstDefaultShift_el == undefined || firstDefaultShift_el.length < 1)){
				//当没有触发改变事件的时候，又点击了F7，但是没有选择就直接取消的情况。要把班次的id的值重新设置回去。否则会报错。
			    $("#defaultShift").shrPromptBox("setValue", this.firstDefaultShift);   
			}
			var defaultShift_el = $('#defaultShift_el').val();
			if(defaultShift_el == null || defaultShift_el == undefined || defaultShift_el.length < 1){
				shr.showWarning({message: jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_35});
				return false;
			}
		}
		else{
			var defaultShift_name = $('#defaultShift').val();
			if(defaultShift_name == null || defaultShift_name == undefined || defaultShift_name.length < 1){
				 $('#defaultShift_el').val('');
				 //$("tr[id]").remove();
			}
		}

	   if (_self.validate() &&  _self.verify() && _self.validateItems()) {
	   	    var restPreTime1 = $('input[name ="restPreTime1"]').val();
	    	var restNextTime1 = $('input[name ="restNextTime1"]').val();
	    	var disabledRestPreTime = $('input[name ="restPreTime1"]').attr("disabled");
	    	var disabledRestNextTime = $('input[name ="restNextTime1"]').attr("disabled");
	    	if(restPreTime1 && restNextTime1 && restPreTime1.length == restNextTime1.length && restPreTime1.length>0 && disabledRestPreTime!="disabled" && disabledRestNextTime!="disabled"){
	    		//成对出现
	    		var errorInfo =  _self.calSegmentInRestValue(restPreTime1,restNextTime1, $($("input[name='preTime1']")).val(),$($("input[name='nextTime1']")).val(), $($("input[name='preTimeDayType1_el']")).val(),$($("input[name='nextTimeDayType1_el']")).val());
	    	    if(!errorInfo.valid){
				 	shr.showWarning({message: errorInfo.info});
					return false;
			     }
	    	}
	   	   
			_self.doSave(event, 'save');
	   }
	}
	/**
	 * 保存真正执行方法
	 */
	,doSave: function(event, action) {
		var _self = this;
		var data = _self.assembleSaveData(action);
		if(data == null){
			return;
		}
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
	,assembleSaveData:function(action){
		var _self = this;
		
	 	
	 	var data = _self.prepareParam(action + 'Action');
		var model = shr.assembleModel(_self.fields, _self.getWorkarea(), _self.uuid);

		var items = _self.getItemsInfo();
		if(items == null){
			return null;
		}
		
	 	model.items = items;
		data.model = shr.toJSON(model);
		data.method = action;
		
		// relatedFieldId
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		
		return data;
	}
	,getItemsInfo: function(){
		var dataArray = [];
	 	$('#itemInfo input[name^=nextFloatAdjusted]').each(function(i,domEle) {
			  var length = $(domEle).attr("name").substring("nextFloatAdjusted".length);
	 	      dataArray.push(parseInt(length));
	 	});
	 	
	 	//将数组由小到大排列
	 	if(dataArray.length > 0){
	 		dataArray.sort(sortNumber);
	 	}
	 	
	 	//构造分录数据
	 	var items = [];
	 	for(var i=0;i<dataArray.length;i++){
	 		var entrie = {
	 			segment: correctValue($('#itemInfo input[name="segment' + dataArray[i] + '_el"]').val()),
				attendanceType: correctValue($('#itemInfo input[name="attendanceType' + dataArray[i] + '_el"]').val()),
				preTimeDayType: correctValue($('#itemInfo input[name="preTimeDayType' + dataArray[i] + '_el"]').val()),
				
				preTime: correctValue($('#itemInfo input[name="preTime' + dataArray[i] +'"]').val()),
				preIsPunchCard:correctValue($('#itemInfo input[name="preIsPunchCard' + dataArray[i] +'_el"]').val()),
				preFloatAdjusted:correctValue($('#itemInfo input[name="preFloatAdjusted' + dataArray[i] +'"]').val()),
				//preUnit:	correctValue($('#itemInfo input[name="preUnit' + dataArray[i] +'_el"]').val()),

				nextTimeDayType:  correctValue($('#itemInfo input[name="nextTimeDayType' + dataArray[i] +'_el"]').val()),
				nextTime:	correctValue($('#itemInfo input[name="nextTime' + dataArray[i] +'"]').val()),
				//nextUnit:	correctValue($('#itemInfo input[name="nextUnit' + dataArray[i] +'_el"]').val()),
			
				nextIsPunchCard:	correctValue($('#itemInfo input[name="nextIsPunchCard' + dataArray[i] +'_el"]').val()),
				nextFloatAdjusted: correctValue($('#itemInfo input[name="nextFloatAdjusted' + dataArray[i] + '"]').val()),
				segmentInRest:	correctValue($('#itemInfo input[name="segmentInRest' + dataArray[i] +'"]').val()),
				restPreTime: correctValue($('#itemInfo input[name="restPreTime' + dataArray[i] + '"]').val()),
				restNextTime: correctValue($('#itemInfo input[name="restNextTime' + dataArray[i] + '"]').val()),
				
				shiftItemId: correctValue($('#itemInfo input[name="shiftItemId' + dataArray[i] + '"]').val())
				
	 			}
	 		items.push(entrie);
	 	}
	 	
	 	return items;
	},
	/**
	 * 一段班的时候要重新根据休息开始休息结束时间来计算段内休息
	 */
	calSegmentInRestValue : function(restPreTime,restNextTime,preTime,nextTime,predaytype,nextdaytype) {
		//0:前一天 1：当天 2：后一天
		var restPreTimeObj = $($("input[name='restPreTime1']"));
		var restNextTimeObj = $($("input[name='restNextTime1']"));
		if(restPreTimeObj.val()){
		    restPreTimeObj.attr("validate","myTmVldt:true");
		}
		if(restNextTimeObj.val()){
			restNextTimeObj.attr("validate","myTmVldt:true");
		}
		var restPreTimeValue = restPreTimeObj.val();
		var restNextTimeValue = restNextTimeObj.val();
		if(restPreTimeValue!=null){
		   restPreTimeValue = restPreTimeValue.trim();
		}
		if(restNextTimeValue!=null){
			restNextTimeValue = restNextTimeValue.trim();
		}
		
		if((restPreTimeValue==null || restPreTimeValue=="") 
		&& restNextTimeValue==null || restNextTimeValue==""){
			return;
		}
		var that = this;
		var rt = {"valid":true,"info":''};
		if (restPreTimeObj.val() == '' && restNextTimeObj.val() == '') {
			$(("input[name='segmentInRest1']")).val(0);
			rt.valid = true;
			return rt;
		}
		
		var mydate  = new Date();
		var myyear  = mydate.getFullYear();
		var mymonth = mydate.getMonth();
		var myday   = mydate.getDate();
		if(mymonth < 10){mymonth = "0" + mymonth;}
		if(myday < 10){myday = "0" + myday;}
			var prea = $($("input[name='restPreTime1']")).val();
		if (restPreTime != null) {
			prea = restPreTime;
		}
		var nexta = $($("input[name='restNextTime1']")).val();
		if (restNextTime != null) {
			nexta = restNextTime;
		}
		var srarttime = myyear + "-" + mymonth + "-" + myday + " " + prea  + ":00";
		var sendtime  = myyear + "-" + mymonth + "-" + myday + " " + nexta + ":00";
		//参数有值的话，直接用参数传过来的，没有的话，直接取页面的值。
		//第一段上班时间，
		var pretimea = $($("input[name='preTime1']")).val();
		if (preTime != null) {
			pretimea = preTime;
		}
		//第一段下班时间
		var nexttimea = $($("input[name='nextTime1']")).val();
		if (nextTime != null) {
			nexttimea = nextTime;
		}
		var pretime  = myyear + "-" + mymonth + "-" + myday + " " + pretimea  + ":00";
		var nexttime = myyear + "-" + mymonth + "-" + myday + " " + nexttimea + ":00";
		//第一段上班参考日期
		var pretimedaytype = $($("input[name='preTimeDayType1_el']")).val();
		if (predaytype != null) {
			pretimedaytype = predaytype;
		}
		//第一段下班参考日期
		var nexttimedaytype = $($("input[name='nextTimeDayType1_el']")).val();
		if (nextdaytype != null) {
			nexttimedaytype = nextdaytype;
		}
		
		//休息开始
		var srartdate = new Date(myyear,mymonth,myday,prea.split(":")[0],prea.split(":")[1],"00");//解决ie不兼容的问题
		//休息结束
		var senddate = new Date(myyear,mymonth,myday,nexta.split(":")[0],nexta.split(":")[1],"00");//解决ie不兼容问题
		//上班时间,下班时间
		var predate = new Date(myyear,mymonth,myday,pretimea.split(":")[0],pretimea.split(":")[1],"00");//解决ie不兼容的问题
		var nextdate = new Date(myyear,mymonth,myday,nexttimea.split(":")[0],nexttimea.split(":")[1],"00");//解决ie不兼容的问题
		if ("0" == pretimedaytype) {
			predate.setTime(predate.getTime() - 1*24*60*60*1000);
		}else if("2" == pretimedaytype){
			predate.setTime(predate.getTime() + 1*24*60*60*1000);
		}
		if ("0" == nexttimedaytype) {
			nextdate.setTime(nextdate.getTime() - 1*24*60*60*1000);
		}else if("2" == nexttimedaytype){
			nextdate.setTime(nextdate.getTime() + 1*24*60*60*1000);
		}
		//旧的判断逻辑，不仅不全面，而且复杂。再也不用了。不过还是先留着吧。edit by chenah
		/*if (pretimedaytype == "前一天") {
			if (prea != "" && nexta != "") {
				var restStartValue = parseFloat(prea.substring(0,2));
				var restEndValue   = parseFloat(nexta.substring(0,2));
				var predateValue   = parseFloat(pretimea.substring(0,2));
				if (restStartValue < predateValue &&  restEndValue < predateValue) {
					//休息开始 休息结束 都是 当天
					srartdate.setTime(srartdate.getTime() + 0*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 0*24*60*60*1000);
				}else if (restEndValue > predateValue &&  restStartValue > predateValue){
					//休息开始 休息结束 都是 前一天
					srartdate.setTime(srartdate.getTime() - 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  - 1*24*60*60*1000);
				}else if (restStartValue > predateValue && restEndValue < predateValue){
					//休息开始-前一天 	休息结束 都是 当天
					srartdate.setTime(srartdate.getTime() - 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 0*24*60*60*1000);
				}
			}
		}
		if (pretimedaytype == "当天") {
			if (prea != "" && nexta != "") {
				var restStartValue = parseFloat(prea.substring(0,2));
				var restEndValue   = parseFloat(nexta.substring(0,2));
				var predateValue   = parseFloat(pretimea.substring(0,2));
				if (restStartValue < predateValue &&  restEndValue < predateValue) {
					//休息开始 休息结束 都是第二天
					srartdate.setTime(srartdate.getTime() + 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 1*24*60*60*1000);
				}else if (restEndValue > predateValue &&  restStartValue > predateValue){
					//休息开始 休息结束 都是当天
					srartdate.setTime(srartdate.getTime() + 0*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 0*24*60*60*1000);
				}else if (restStartValue > predateValue && restEndValue < predateValue){
					//休息开始-当天 	休息结束 都是第二天
					srartdate.setTime(srartdate.getTime() + 0*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 1*24*60*60*1000);
				}
			}
		}
		if (pretimedaytype == "后一天") {
			if (prea != "" && nexta != "") {
				var restStartValue = parseFloat(prea.substring(0,2));
				var restEndValue   = parseFloat(nexta.substring(0,2));
				var predateValue   = parseFloat(pretimea.substring(0,2));
				if (restStartValue < predateValue &&  restEndValue < predateValue) {
					//休息开始 休息结束 都是 第三天
					srartdate.setTime(srartdate.getTime() + 2*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 2*24*60*60*1000);
				}else if (restEndValue > predateValue &&  restStartValue > predateValue){
					//休息开始 休息结束 都是 后一天
					srartdate.setTime(srartdate.getTime() + 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 1*24*60*60*1000);
				}else if (restStartValue > predateValue && restEndValue < predateValue){
					//休息开始-后一天 	休息结束 都是 第三天
					srartdate.setTime(srartdate.getTime() + 1*24*60*60*1000);
					senddate.setTime (senddate.getTime()  + 2*24*60*60*1000);
				}
			}
		}*/
		var currdate    =  new Date();
		var currDateStr = currdate.getFullYear() + "-" + (currdate.getMonth()) + "-" + currdate.getDate();
		var preTimeValue = pretimedaytype;
		//上班开始时间
		var preTimeStrValue = parseInt(pretimea.substring(0, 2))*60+parseInt(pretimea.substring(3, 5));
		//休息开始时间
		var restPreTimeValue = parseInt(prea.substring(0, 2))*60+parseInt(prea.substring(3, 5));
		//休息结束时间
		var restNextTimeValue = parseInt(nexta.substring(0, 2))*60+parseInt(nexta.substring(3, 5));
		var restPreDateTime = "";//休息开始（有时分秒的字符串）
		var resrNextDateTime = "";//休息结束（有时分秒的字符串）
		var restPreDate = null;//休息开始日期（没有时分秒的日期）
		var restNextDate = null;//休息开始日期（没有时分秒的日期）
		//1.计算休息开始时间
		if(restPreTimeValue >= preTimeStrValue){//休息开始>=开始上班 ，同一天
			restPreDate = getDateByTypeNew(preTimeValue, currDateStr);
		    restPreDateTime = getVirDateStr(restPreDate) + " " + prea + ":00";
		}else{//加一天
			preTimeValue = parseInt(preTimeValue) + 1;
			restPreDate = getDateByTypeNew(preTimeValue, currDateStr);
			restPreDateTime = getVirDateStr(restPreDate) + " " + prea + ":00";
		}
		srartdate = NewLongDate(restPreDateTime);
		//2.算休息结束时间
		preTimeValue = pretimedaytype;//要重新赋值
		if(restNextTimeValue >= preTimeStrValue){//休息结束>=开始上班 ，同一天
			var restNextDate = getDateByTypeNew(preTimeValue, currDateStr);
			resrNextDateTime = getVirDateStr(restNextDate) + " " + nexta + ":00";
		}else{
			preTimeValue = parseInt(preTimeValue) + 1;
			var restNextDate = getDateByTypeNew(preTimeValue, currDateStr);
			resrNextDateTime = getVirDateStr(restNextDate) + " " + nexta + ":00";
		}
		senddate = NewLongDate(resrNextDateTime);
		var longTime = senddate.getTime() - srartdate.getTime();
		if (srartdate.getTime()<predate.getTime() && senddate.getTime()<predate.getTime()) {
			rt.valid = false;
			rt.info = jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_88;
		}
		
		if (srartdate.getTime()<predate.getTime() || srartdate.getTime()>nextdate.getTime()) {
			rt.valid = false;
			rt.info = jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_89;
		}
		if (senddate.getTime()<predate.getTime() || senddate.getTime()>nextdate.getTime()) {
			rt.info = jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_86;
			rt.valid = false;
		}
		if(longTime){//当longTime不等于null,undefinde,NAN,""等情况的时候
		$($("input[name='segmentInRest1']")).val(longTime/(60*1000));
		}
		return rt;
	},
	InitsegmentInRest1 : function(){
		//只针对一段班
		var that = this;
		var restPreTimeObj = $($("input[name='restPreTime1']"));
		var restNextTimeObj = $($("input[name='restNextTime1']"));
		//刚进入要把验证去掉。
		restPreTimeObj.attr("validate","myTmVldt:false");
        restNextTimeObj.attr("validate","myTmVldt:false");
		restPreTimeObj.blur(function(){
    			if (restPreTimeObj.val() == '' && restNextTimeObj.val() == '') {
        			restPreTimeObj .attr("validate","myTmVldt:false");
        			restNextTimeObj.attr("validate","myTmVldt:false");
        		}
        		that.calSegmentInRestValue(null,null,null,null,null,null);
        		
    		});
    		restNextTimeObj.blur(function(){
    			if (restPreTimeObj.val() == '' && restNextTimeObj.val() == '') {
        			restPreTimeObj.attr("validate","myTmVldt:false");
        			restNextTimeObj.attr("validate","myTmVldt:false");
        		}
        		that.calSegmentInRestValue(null,null,null,null,null,null);
    		});
	},
	/**
	 * 仿照班次设置的后台验证改成js验证 add by chenahong
	 */
	valideTimeOfCompare: function(vo){
		    var TIME_COLON_SUFF = ":00";
			var SPACE = " ";
			var regEx = new RegExp("\\-","gi");
			
		    //一段班
			if (vo.length == 1) {
			var temp = vo[0];
			//前一天 0 , 当天 1 , 后一天 2
			var prevalue  = temp.preTimeDayType;
			var nextvalue = temp.nextTimeDayType;
			if (parseInt(prevalue) == 0 && parseInt(nextvalue) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_74});
				return false
			}
			if (parseInt(prevalue) == 0 && parseInt(nextvalue) == 2) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_75});
				return false;
			}
			if (parseInt(prevalue) == 1 && parseInt(nextvalue) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_71});
				return false;
			}
			if (parseInt(prevalue) == 2) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_73});
				return false;
			}
		}
		//二段班
		if (vo.length == 2) {
			var temp1 = vo[0];
			var temp2 = vo[1];
			var pretime1  = temp1.preTime;
			var nexttime1 = temp1.nextTime;
			
			var pretime2  = temp2.preTime;
			var nexttime2 = temp2.nextTime;
			
			//前一天 0 , 当天 1 , 后一天 2
			var prevalue1  = temp1.preTimeDayType;
			var nextvalue1 = temp1.nextTimeDayType;
			
			var prevalue2  = temp2.preTimeDayType;
			var nextvalue2 = temp2.nextTimeDayType;
			//时间校验比较
			
			var currdate    =  new Date();
			var currDateStr = currdate.getFullYear() + "-" + (currdate.getMonth() + 1) + "-" + currdate.getDate();
			ontime1Str = currDateStr + SPACE + pretime1 + TIME_COLON_SUFF;
			ontime1Str = ontime1Str.replace(regEx,"/");
			ontime1 = new Date(ontime1Str);
			if (parseInt(prevalue1) == 0) {
				ontime1Str = formatDate(getDateByType(0,currDateStr)) + SPACE + pretime1 + TIME_COLON_SUFF;
			    ontime1Str = ontime1Str.replace(regEx,"/");
				ontime1  = new Date(ontime1Str);
			}else if (parseInt(prevalue1) == 2) {
				ontime1Str = formatDate(getDateByType(2,currDateStr)) + SPACE + pretime1 + TIME_COLON_SUFF;
			    ontime1Str = ontime1Str.replace(regEx,"/");
				ontime1  = new Date(ontime1Str);
			}
			var offtime1Str = currDateStr + SPACE + nexttime1 + TIME_COLON_SUFF;
			offtime1Str = offtime1Str.replace(regEx,"/");
			var offtime1 = new Date(offtime1Str);
			if (parseInt(nextvalue1) == 0) {
				offtime1Str = formatDate(getDateByType(0,currDateStr)) + SPACE + nexttime1 + TIME_COLON_SUFF;
				offtime1Str = offtime1Str.replace(regEx,"/");
				offtime1 = new Date(offtime1Str);
			}else if (parseInt(nextvalue1) == 2) {
				offtime1Str = formatDate(getDateByType(2,currDateStr)) + SPACE + nexttime1 + TIME_COLON_SUFF;
				offtime1Str = offtime1Str.replace(regEx,"/");
				offtime1 = new Date(offtime1Str);
			}
			var ontime2Str = currDateStr + SPACE + pretime2 + TIME_COLON_SUFF;
			ontime2Str = ontime2Str.replace(regEx,"/");
			var  ontime2 = new Date(ontime2Str);
			if (parseInt(prevalue2) == 0) {
				ontime2Str = formatDate(getDateByType(0,currDateStr)) + SPACE + pretime2 + TIME_COLON_SUFF;
				ontime2Str = ontime2Str.replace(regEx,"/");
				ontime2  = new Date(ontime2Str);
			}else if (parseInt(prevalue2) == 2) {
				ontime2Str = formatDate(getDateByType(2,currDateStr)) + SPACE + pretime2 + TIME_COLON_SUFF;
				ontime2Str = ontime2Str.replace(regEx,"/");
				ontime2  = new Date(ontime2Str);
			}
			var offtime2Str =  currDateStr + SPACE + nexttime2 + TIME_COLON_SUFF;
			offtime2Str = offtime2Str.replace(regEx,"/");
			var offtime2  = new Date(offtime2Str);
			if (parseInt(nextvalue2) == 0) {
				offtime2Str = formatDate(getDateByType(0,currDateStr)) + SPACE + nexttime2 + TIME_COLON_SUFF;
				offtime2Str = offtime2Str.replace(regEx,"/");
				offtime2  = new Date(offtime2Str);
			}else if (parseInt(nextvalue2) == 2) {
				offtime2Str = formatDate(getDateByType(2,currDateStr)) + SPACE + nexttime2 + TIME_COLON_SUFF;
				offtime2Str = offtime2Str.replace(regEx,"/");
				offtime2  = new Date(offtime2Str);
			}
			if (offtime1.getTime() < ontime1.getTime()) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_24});
				return false;
			}
			if (offtime2.getTime() < ontime2.getTime()) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_18});
				return false;
			}
			
			//上班时间为前一天
			/*if (prevalue1 == 0 && nextvalue1 == 0) {
				throw new WafBizException("二段班，第一段的上班时间单位和下班时间单位不能都是前一天！");
			}*/
			if (parseInt(prevalue1) == 0 && parseInt(nextvalue1) == 2) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_27});
				return false;
			}
			/*if (parseInt(prevalue1) == 0 && (parseInt(prevalue2) == 0 || parseInt(prevalue2) == 2)) {
				shr.showWarning({"message" : "二段班，第一段上班时间单位为前一天，第二段上班时间不能为前一天或者后一天！"});
				return false;
			}*/
			if (parseInt(prevalue1) == 0 && (parseInt(nextvalue2) == 0 || parseInt(nextvalue2) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_23});
				return false;
			}
			//中间组合情况判断
			if (parseInt(nextvalue1) == 1 && parseInt(prevalue2) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_25});
				return false;
			}
			if (parseInt(nextvalue1) == 1 && parseInt(nextvalue2) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_26});
				return false;
			}
			
			//上班时间为当天
			if (parseInt(prevalue1) == 1 && parseInt(nextvalue1) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_22});
				return false;
			}
			if (parseInt(prevalue1) == 1 && parseInt(prevalue2) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_20});
				return false;
			}
			if (parseInt(prevalue1) == 1 && parseInt(nextvalue2) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_21});
				return false;
			}
			//中间组合情况判断
			if (parseInt(nextvalue1) == 1 && parseInt(prevalue2) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_25});
				return false;
			}
			if (parseInt(nextvalue1) == 1 && parseInt(nextvalue2) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_26});
				return false;
			}
			if (parseInt(prevalue2) == 2 && (parseInt(nextvalue2) == 0 || parseInt(nextvalue2) == 1) ) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_17});
				return false;
			}
			if (parseInt(prevalue1) == 2) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_73});
				return false;
			}
			
		}
		
		//三段班
		if (vo.length == 3) {
			var temp1 = vo[0];
			var temp2 = vo[1];
			var temp3 = vo[2];
			
			var pretime1  = temp1.preTime;
			var nexttime1 = temp1.nextTime;
			
			var pretime2  = temp2.preTime;
			var nexttime2 = temp2.nextTime;
			
			var pretime3  = temp3.preTime;
			var nexttime3 = temp3.nextTime;
			
			//时间校验比较
			//前一天 0 , 当天 1 , 后一天 2
			var prevalue1  = temp1.preTimeDayType;
			var nextvalue1 = temp1.nextTimeDayType;
			
			var prevalue2  = temp2.preTimeDayType;
			var nextvalue2 = temp2.nextTimeDayType;
			
			var prevalue3  = temp3.preTimeDayType;
			var nextvalue3 = temp3.nextTimeDayType;
			
			//时间校验比较
			var currdate = new Date();
			var currDateStr = currdate.getFullYear() + "-" + (currdate.getMonth() + 1) + "-" + currdate.getDate();
			var ontime1Str =  currDateStr + SPACE + pretime1 + TIME_COLON_SUFF;
			ontime1Str = ontime1Str.replace(regEx,"/");
			var ontime1  = new Date(ontime1Str);
			if (parseInt(prevalue1) == 0) {
				ontime1Str = formatDate(getDateByType(0,currDateStr)) + SPACE + pretime1 + TIME_COLON_SUFF;
			    ontime1Str = ontime1Str.replace(regEx,"/");
				ontime1  = new Date(ontime1Str);
			}else if (parseInt(prevalue1) == 2) {
				ontime1Str = formatDate(getDateByType(2,currDateStr)) + SPACE + pretime1 + TIME_COLON_SUFF;
			    ontime1Str = ontime1Str.replace(regEx,"/");
				ontime1  = new Date(ontime1Str);
			}
			//当天第一段下班时间
		    var offtime1Str =  currDateStr + SPACE + nexttime1 + TIME_COLON_SUFF;
		    offtime1Str = offtime1Str.replace(regEx,"/");
		    offtime1 = new Date(offtime1Str);
			if (parseInt(nextvalue1) == 0) {//前一天第一段班下班时间
		        offtime1Str = formatDate(getDateByType(0,currDateStr)) + SPACE + nexttime1 + TIME_COLON_SUFF;
				offtime1Str = offtime1Str.replace(regEx,"/");
				offtime1 = new Date(offtime1Str);
			}else if (parseInt(nextvalue1) == 2) {//后一天第一段班下班时间
				offtime1Str = formatDate(getDateByType(2,currDateStr)) + SPACE + nexttime1 + TIME_COLON_SUFF;
				offtime1Str = offtime1Str.replace(regEx,"/");
				offtime1 = new Date(offtime1Str);
			}
			
			var ontime2Str =  currDateStr + SPACE + pretime2 + TIME_COLON_SUFF;
			ontime2Str = ontime2Str.replace(regEx,"/");
			var ontime2  = new Date(ontime2Str);
			if (parseInt(prevalue2) == 0) {
				ontime2Str = formatDate(getDateByType(0,currDateStr)) + SPACE + pretime2 + TIME_COLON_SUFF;
			    ontime2Str = ontime2Str.replace(regEx,"/");
				ontime2  = new Date(ontime2Str);
			}else if (parseInt(prevalue2) == 2) {
				ontime2Str = formatDate(getDateByType(2,currDateStr)) + SPACE + pretime2 + TIME_COLON_SUFF;
			    ontime2Str = ontime2Str.replace(regEx,"/");
				ontime2  = new Date(ontime2Str);
			}
			var offtime2Str =  currDateStr + SPACE + nexttime2 + TIME_COLON_SUFF;
		    offtime2Str = offtime2Str.replace(regEx,"/");
		    offtime2 = new Date(offtime2Str);
			if (parseInt(nextvalue2) == 0) {
				offtime2Str = formatDate(getDateByType(0,currDateStr)) + SPACE + nexttime2 + TIME_COLON_SUFF;
				offtime2Str = offtime2Str.replace(regEx,"/");
				offtime2 = new Date(offtime2Str);
			}else if (parseInt(nextvalue2) == 2) {
				offtime2Str = formatDate(getDateByType(2,currDateStr)) + SPACE + nexttime2 + TIME_COLON_SUFF;
				offtime2Str = offtime2Str.replace(regEx,"/");
				offtime2 = new Date(offtime2Str);
			}
			
				
			var ontime3Str =  currDateStr + SPACE + pretime3 + TIME_COLON_SUFF;
			ontime3Str = ontime3Str.replace(regEx,"/");
			var ontime3  = new Date(ontime3Str);
			if (parseInt(prevalue3) == 0) {
				ontime3Str = formatDate(getDateByType(0,currDateStr)) + SPACE + pretime3 + TIME_COLON_SUFF;
			    ontime3Str = ontime3Str.replace(regEx,"/");
				ontime3  = new Date(ontime3Str);
			}else if (parseInt(prevalue3) == 2) {
				ontime3Str = formatDate(getDateByType(2,currDateStr)) + SPACE + pretime3 + TIME_COLON_SUFF;
			    ontime3Str = ontime3Str.replace(regEx,"/");
				ontime3  = new Date(ontime3Str);
			}
			var offtime3Str =  currDateStr + SPACE + nexttime3 + TIME_COLON_SUFF;
			offtime3Str = offtime3Str.replace(regEx,"/");
			var offtime3  = new Date(offtime3Str);
			if (parseInt(nextvalue3) == 0) {
				offtime3Str = formatDate(getDateByType(0,currDateStr)) + SPACE + nexttime3 + TIME_COLON_SUFF;
				offtime3Str = offtime3Str.replace(regEx,"/");
				offtime3 = new Date(offtime3Str);
			}else if (parseInt(nextvalue3) == 2) {
				offtime3Str = formatDate(getDateByType(2,currDateStr)) + SPACE + nexttime3 + TIME_COLON_SUFF;
				offtime3Str = offtime3Str.replace(regEx,"/");
				offtime3 = new Date(offtime3Str);
			}
			
			if (offtime1.getTime() < ontime1.getTime()) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_66});
				return false;
			}
			if (offtime2.getTime() < ontime2.getTime()) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_42});
				return false;
			}
			if (offtime3.getTime() < ontime3.getTime()) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_50});
				return false;
			}
			
			if (parseInt(prevalue1) == 0 && parseInt(nextvalue1) == 2) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_65});
				return false;
			}
			if (parseInt(prevalue1) == 0 && (parseInt(prevalue2) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_57});
				return false;
			}
			if (parseInt(prevalue1) == 0 && parseInt(nextvalue1) == 1 && (parseInt(prevalue2) == 0 || parseInt(prevalue2) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_58});
				return false;
			}
			//---
			if (parseInt(prevalue1) == 0 && (parseInt(nextvalue2) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_59});
				return false;
			}
			if (parseInt(prevalue1) == 0 && parseInt(nextvalue1) == 1 && (parseInt(nextvalue2) == 0 || parseInt(nextvalue2) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_60});
				return false;
			}
			if (parseInt(prevalue1) == 0 && parseInt(prevalue2) == 1 && (parseInt(nextvalue2) == 0 || parseInt(nextvalue2) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_60});
				return false;
			}
			//--
			//==
			if (parseInt(prevalue1) == 0 && (parseInt(prevalue3) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_61});
				return false;
			}
			if (parseInt(prevalue1) == 0 && parseInt(nextvalue1) == 1 && (parseInt(prevalue3) == 0 || parseInt(prevalue3) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_62});
				return false;
			}
			if (parseInt(prevalue1) == 0 && parseInt(prevalue2) == 1 && (parseInt(prevalue3) == 0 || parseInt(prevalue3) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_62});
				return false;
			}
			if (parseInt(prevalue1) == 0 && parseInt(nextvalue2) == 1 && (parseInt(prevalue3) == 0 || parseInt(prevalue3) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_62});
				return false;
			}
			//==
			
			//====
			if (parseInt(prevalue1) == 0 && (parseInt(nextvalue3) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_63});
				return false;
			}
			if (parseInt(prevalue1) == 0 && parseInt(nextvalue1) == 1 && (parseInt(nextvalue3) == 0 || parseInt(nextvalue3) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_64});
				return false;
			}
			if (parseInt(prevalue1) == 0 && parseInt(prevalue2) == 1 && (parseInt(nextvalue3) == 0 || parseInt(nextvalue3) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_64});
				return false;
			}
			if (parseInt(prevalue1) == 0 && parseInt(nextvalue2) == 1 && (parseInt(nextvalue3) == 0 || parseInt(nextvalue3) == 2)) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_64});
				return false;
			}
			//====
			
			//上班时间为当天
			if (parseInt(prevalue1) == 1 && parseInt(nextvalue1) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_56});
				return false;
			}
			if (parseInt(prevalue1) == 1 && parseInt(prevalue2) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_52});
				return false;
			}
			if (parseInt(prevalue1) == 1 && parseInt(nextvalue2) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_53});
				return false;
			}
			if (parseInt(prevalue1) == 1 && parseInt(prevalue3) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_54});
				return false;
			}
			if (parseInt(prevalue1) == 1 && parseInt(nextvalue3) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_55});
				return false;
			}
			//中间组合情况判断
			if (parseInt(nextvalue1) == 1 && parseInt(prevalue2) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_67});
				return false;
			}
			if (parseInt(nextvalue1) == 1 && parseInt(nextvalue2) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_68});
				return false;
			}
			if (parseInt(nextvalue1) == 1 && parseInt(prevalue3) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_69});
				return false;
			}
			if (parseInt(nextvalue1) == 1 && parseInt(nextvalue3) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_70});
				return false;
			}
			
			if (parseInt(prevalue2) == 2 && (parseInt(nextvalue2) == 0 || parseInt(nextvalue2) == 1) ) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_41});
				return false;
			}
			
			if (parseInt(nextvalue2) == 1 && parseInt(prevalue3) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_43});
				return false;
			}
			if (parseInt(nextvalue2) == 1 && parseInt(nextvalue3) == 0) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_44});
				return false;
			}
			
			if (parseInt(nextvalue2) == 2 && (parseInt(prevalue3) == 0 || parseInt(prevalue3) ==1) ) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_45});
				return false;
			}
			if (parseInt(nextvalue2) == 2 && (parseInt(nextvalue3) == 0 || parseInt(nextvalue3) == 1) ) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_46});
				return false;
			}
			
			if (parseInt(prevalue3) == 2 && (parseInt(nextvalue3) == 0 || parseInt(nextvalue3) == 1) ) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_49});
				return false;
			}
			
			
			if (parseInt(prevalue1) == 2) {
				shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_73});
				return false;
			}
		}
		return true;
	},
	/**
	 * 限制班次时间问题，只要一直递增并且不超过24小时就是合理的。
	 * 
	 */
	valideTimeOfCompareNew: function(vo){
            var newVo = [];		
		    var TIME_COLON_SUFF = "00";
			var SPACE = " ";
			var regEx = new RegExp("\\-","gi");
			//改造vo将vo变成带前一天当天后一天的实际日期+时分秒的时间。
			var currdate    =  new Date();
			var currDateStr = currdate.getFullYear() + "-" + (currdate.getMonth() + 1) + "-" + currdate.getDate();
			for(var i=0;i<vo.length;i++){
                var newObj = {};				
				var temp = vo[i];
				var preDate = getDateByType(parseInt(temp.preTimeDayType),currDateStr);
				var preYear = preDate.getFullYear();
				var preMonth = preDate.getMonth();
				var preDay = preDate.getDate();
				var preHour = temp.preTime.split(":")[0];
				var preMinute = temp.preTime.split(":")[1];
				var preSecond = TIME_COLON_SUFF;
				var preDateTime = new Date(preYear,preMonth,preDay,preHour,preMinute,preSecond);
				
				var nextDate = getDateByType(parseInt(temp.nextTimeDayType),currDateStr);
				var nextYear = nextDate.getFullYear();
				var nextMonth = nextDate.getMonth();
				var nextDay = nextDate.getDate();
				var nextHour = temp.nextTime.split(":")[0];
				var nextMinute = temp.nextTime.split(":")[1];
				var nextSecond = TIME_COLON_SUFF;
				var nextDateTime = new Date(nextYear,nextMonth,nextDay,nextHour,nextMinute,nextSecond);
				newObj.preDateTime = preDateTime;
				newObj.nextDateTime = nextDateTime;
				newVo.push(newObj);
			}
			
		    //一段班
			if (newVo.length == 1) {
				var temp = newVo[0];
				if(temp.preDateTime.getTime()>temp.nextDateTime.getTime()){
				  shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_90});
				  return false;
				}
				//加上不能大于24小时的判断
				if(temp.nextDateTime.getTime()-temp.preDateTime.getTime()>1*24*60*60*1000){
				  shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_94});
				  return false;
				}
			}
			
			//二段班
			if (newVo.length == 2) {
				var temp1 = newVo[0];
				var temp2 = newVo[1];
				var preDateTime1  = temp1.preDateTime;
				var nextDateTime1 = temp1.nextDateTime;
				
				var preDateTime2  = temp2.preDateTime;
				var nextDateTime2 = temp2.nextDateTime;
				if(preDateTime1.getTime()>nextDateTime1.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_19});
				   return false;
				}
				
				if(preDateTime2.getTime()<nextDateTime1.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_16});
				   return false;
				}
				
				if(preDateTime2.getTime()>nextDateTime2.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_15});
				   return false;
				}
				//加上不能大于24小时的判断
				if((nextDateTime2.getTime()-preDateTime1.getTime())>1*24*60*60*1000){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_94});
				   return false;
				}
		    }
		  
		  if (newVo.length == 3) {
		  	   var temp1 = newVo[0];
			   var temp2 = newVo[1];
			   var temp3 = newVo[2];
			   var preDateTime1  = temp1.preDateTime;
			   var nextDateTime1 = temp1.nextDateTime;
				
			   var preDateTime2  = temp2.preDateTime;
			   var nextDateTime2 = temp2.nextDateTime;
			   
			   var preDateTime3  = temp3.preDateTime;
			   var nextDateTime3 = temp3.nextDateTime;
			   
			   if(preDateTime1.getTime()>nextDateTime1.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_51});
				   return false;
				}
				
				if(preDateTime2.getTime()<nextDateTime1.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_40});
				   return false;
				}
				
				if(preDateTime2.getTime()>nextDateTime2.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_39});
				   return false;
				}
				
				if(preDateTime3.getTime()<nextDateTime2.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_48});
				   return false;
				}
				
				if(preDateTime3.getTime()>nextDateTime3.getTime()){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_47});
				   return false;
				}
				
				if(nextDateTime3.getTime()-preDateTime1.getTime()>1*24*60*60*1000){
				   shr.showWarning({"message" : jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_94});
				   return false;
				}
		  }
		  return true;
	},
	dayTypeChange : function(){
		 var that = this;
	     $('#dayType').bind("change", function(){
				var dayType = $('#dayType_el').val();
				if(dayType == '0' ){
				}
				else{
					$('div[class="row-fluid row-block row_field"]:gt(0)').remove();
					$('#defaultShift').shrPromptBox('setValue', {
									id: '',
									name:''
					});
					that.firstDefaultShift = {"id" : "", "name" : ""};
					
					//考勤组排班不需要
//					shr.doAjax({
//						url: shr.getContextPath()+"/dynamic.do?handler=com.kingdee.shr.ats.web.handler.ScheduleShiftEditHandler&method=getDefaultShiftStandHour",
//						dataType:'json',
//						type: "POST",
//						data: {number: that.getFieldValue("proposer_number")},
//						success: function(res){ 
//							$('#standardHour').val(res.standardHour);
//						}
//					});
					
				}
		});
	}
	,addElasticDoc: function() {
		$("#elasticType").parent().parent().parent().parent().removeClass('col-lg-6').addClass('col-lg-2');
		$("#elasticType_down").find("a").eq(0).attr("title",jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_36);
		$("#elasticType_down").find("a").eq(1).attr("title",jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_77);
	}
	,addElasticHtml:function(){
		var that = this;
		var select_json = {
			id: "elasticDirectionTemp",
			readonly: "",
			value: 1,
			onChange: null,
			validate: "",
			filter: ""
		};
		select_json.enumSource = 'com.kingdee.eas.hr.ats.AtsShiftElasticDirection';
		
		var text_json = {
			id:"elasticValueTemp",
			name: "elasticValueTemp",
			readonly: "",
			validate: "{maxlength:9,number:true}",
			onChange: ""
		};
		
		var html = '<span id="commuteElastic">'
		+'<div class="col-lg-1" style="width: 30px;">'
		+'<div class="field_label" style="padding-right: 5px;padding-left: 0;" title="'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_79
			+ '">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_79
			+ '</div>'
		+'</div>'
		+'<div class="col-lg-1 field-ctrl">'
		+'<input class="block-father input-height cursor-pointer" id="elasticDirectionTemp"  type="text">'
		+'</div>'
		+'<div class="col-lg-1" style="width: 30px;">'
		+'<div class="field_label" style="padding-right: 0px;padding-left: 0;" title="'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_4
			+ '">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_4
			+ '</div>'
		+'</div>'
		+'<div class="col-lg-1 field-ctrl" style="padding-left: 5px;" >'
		+'<input class="block-father input-height" id="elasticValueTemp"  type="text">'
		+'</div>'
		+'<div class="col-lg-1" style=" width: 27px;">'
		+'<div class="field_label" title="'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_84
			+ '" style="padding-right:0;padding-left:0;">'
			+ jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_84
			+ '</div>'
		+'</div>'
		+'<div class="col-lg-2 field-desc"></div>'
		+'</span>';
		$("#elasticType").parent().parent().parent().parent().after(html);
		$('#elasticDirectionTemp').shrSelect(select_json);
		$('#elasticValueTemp').shrTextField(text_json);
		$("#elasticValueTemp").shrTextField("setValue",atsMlUtile.getFieldOriginalValue("elasticValue"));
		$('#elasticValueTemp').attr("validate","{maxlength:9,number:true}");
		$('#commuteElastic').next().remove();
		$($("#elasticDirectionTemp_down").find("li")[0]).remove()//暂时只支持往后延
	    
	    if(!$('#isElastic').shrCheckbox("isSelected")){
	    	$("#elasticType").parent().parent().parent().parent().parent().hide();	    	
	    }
	    if($("input#elasticType").shrSelect("getValue").value==0){
	    	$('#commuteElastic').hide();
	    }
		$("input#isElastic").on('ifChanged', function(){
        	$("input#isElastic").change();
        	if($('#isElastic').shrCheckbox("isSelected")){
        	   $("#elasticType").parent().parent().parent().parent().parent().show();
        	   that.hideEditFormElastic();
        	}else{
        	   $("#elasticType").parent().parent().parent().parent().parent().hide();
        	   that.showEditFormElastic();
        	}
        });
        $("input#elasticType").change(function(){
        	if($(this).shrSelect("getValue").value==0){
        		$('#commuteElastic').hide();
        	}else{
        		$('#commuteElastic').show();
        	}
        	that.hideEditFormElastic();
        });
       
	}
	,showEditFormElastic:function(){
    	$("#preFloatAdjusted").parent().parent().show();
    	$("#preFloatAdjusted").parent().parent().prev().show();
    	$("#nextFloatAdjusted").parent().parent().show();
    	$("#nextFloatAdjusted").parent().parent().prev().show();
    	$("#restPreTime").parent().parent().show();
    	$("#restPreTime").parent().parent().prev().show();
    	$("#restNextTime").parent().parent().show();
    	$("#restNextTime").parent().parent().prev().show();
	},hideEditFormElastic:function(){
    	$("#preFloatAdjusted").parent().parent().hide();
    	$("#preFloatAdjusted").parent().parent().prev().hide();
    	$("#nextFloatAdjusted").parent().parent().hide();
    	$("#nextFloatAdjusted").parent().parent().prev().hide();
    	
    	if($("input#elasticType").shrSelect("getValue").value==0){
    		$("#restPreTime").parent().parent().hide();
    		$("#restPreTime").parent().parent().prev().hide();
    		$("#restNextTime").parent().parent().hide();
    		$("#restNextTime").parent().parent().prev().hide();
    	}else{
    		$("#restPreTime").parent().parent().show();
    		$("#restPreTime").parent().parent().prev().show();
    		$("#restNextTime").parent().parent().show();
    		$("#restNextTime").parent().parent().prev().show();
    	}
	}
	,doubleTiggerElastic:function(){//触发两次弹性班，调用其change事件调整页面样式
	    if($('#isElastic').shrCheckbox("isSelected")){
	    	$("#isElastic").shrCheckbox("unCheck");
	    	$("#isElastic").shrCheckbox("check");
	    }else{
	    	$("#isElastic").shrCheckbox("check");
	    	$("#isElastic").shrCheckbox("unCheck");
	    }
	}
}); 
function correctValue(value){
	if(value == undefined || value == null || value == NaN){
		return "";
	}
	else{
		return value;
	}
}
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
function getRealTimeByType(value,type){
	if(parseInt(type) == 0){
		value -= 24 * 60;
	}
	else if(parseInt(type) == 1){
		
	}
	else if(parseInt(type) == 2){
		value += 24 * 60;
	}
	else{
		
	}
	return value;
}

function getDateByType(type, currDateStr){
	var regEx = new RegExp("\\-","gi");
	currDateStr = currDateStr.replace(regEx,"/");
	var curDate = new Date(currDateStr);
	if(parseInt(type) == 0){//前一天
		var preDate = new Date(curDate.getTime()-24*60*60*1000);
		return preDate;
	}else if(parseInt(type) == 1){//当天
		return curDate;
	}else{//后一天
		var nextDate = new Date(curDate.getTime()+24*60*60*1000);
		return nextDate;
	}
}

function formatDate(date){
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var tMonth = month > 9 ? month : ('0' + month);
	var tDay = day > 9 ? day : ('0' + day);
	return year + '-' + tMonth + '-' + tDay;
}

function getVirDateStr(date){
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	var tMonth = month > 9 ? month : ('0' + month);
	var tDay = day > 9 ? day : ('0' + day);
	return year + '-' + tMonth + '-' + tDay;
}

function getSegmentNameByValue(val){
   if("1" == val){
     return jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_10;
   }else if("2" == val){
     return jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_8;
   }else if("3" == jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_9){
     return jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_9;
   }
}

function NewLongDate(dateTime){
	var dateTimeArr = dateTime.split(" ");
	var dateStr = dateTimeArr[0];
	var timeStr = dateTimeArr[1];
	var dateArr = dateStr.split("-");
	var year = dateArr[0];
	var month = dateArr[1];
	var day = dateArr[2];
	var timeArr = timeStr.split(":");
	var hour = timeArr[0];
	var minute = timeArr[1];
	var second = timeArr[2];
	var date = new Date(year,month,day,hour,minute,second);
	return date;
}

function NewShortDate(date){
	var dateTimeArr = date.split(" ");
	var dateStr = dateTimeArr[0];
	var dateArr = dateStr.split("-");
	var year = dateArr[0];
	var month = dateArr[1];
	var day = dateArr[2];
	var date = new Date(year,month,day);
	return date;
}

function getDayTypeValueByName(typeName){
   if(jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_33 == typeName){
        return "0";
   }else if(jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_7 == typeName){
   	    return "1";
   }else if(jsBizMultLan.atsManager_AttendanceGroupShiftEdit_i18n_32 == typeName){
   	    return "2"
   }else{
        return "";
   }
}

function getDateByTypeNew(type, currDateStr){
	/*var regEx = new RegExp("\\-","gi");
	currDateStr = currDateStr.replace(regEx,"/");*/
	var curDate = NewShortDate(currDateStr);
	if(parseInt(type) == 0){//前一天
		var preDate = new Date(curDate.getTime()-24*60*60*1000);
		return preDate;
	}else if(parseInt(type) == 1){//当天
		return curDate;
	}else{//后一天
		var nextDate = new Date(curDate.getTime()+24*60*60*1000);
		return nextDate;
	}
}
