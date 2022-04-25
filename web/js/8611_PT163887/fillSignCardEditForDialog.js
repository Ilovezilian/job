
shr.defineClass("shr.ats.FillSignCardEdit", shr.framework.Edit, {
	strdate:"",
     initalizeDOM:function(){
     	this.setNavigateLine();
     	var paramMethod = shr.getUrlRequestParam("method");
     	//从我要补卡菜单中点击进来的URL上没有method参数
         if((paramMethod == null || paramMethod == "")&&((shr.getUrlRequestParam('proInstId')==null || shr.getUrlRequestParam('proInstId')=="")&&(shr.getUrlRequestParam('assigmentId')==null  || shr.getUrlRequestParam('assigmentId')==""))){
             $("#breadcrumb").find(".active")
				.text(jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_19);
			  if(shrDataManager.pageNavigationStore.getDatas()　== null || shrDataManager.pageNavigationStore.getDatas().length==0){
				var object_bread_1 = {
					name: jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_19,
					url: window.location.href,
					workPlatformId: "Qz9UfhLqB0+vmMJ4+80EykRLkh4="
     	    	}
     	    	shrDataManager.pageNavigationStore.pop();
				shrDataManager.pageNavigationStore.addItem(object_bread_1);
     	    }
     	}
		 this.fillProposerAndApplyDate();
			shr.ats.FillSignCardEdit.superClass.initalizeDOM.call(this);
			var that = this ;
			that.processF7ChangeEvent();
			that.setButtonVisible();
			if(that.isFromWF()){
			    $('#breadcrumb li').eq(0)
					.text(jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_3);
			}
			//隐藏补签卡列表
			if(that.getOperateState().toUpperCase() == 'EDIT'){
			   if(that.isFromWF()){
			       $("#cancel").hide();
			   }
			}
				
			//新增和编辑状态隐藏返回XX列表
			if (this.getOperateState().toUpperCase() == 'ADDNEW' || this.getOperateState().toUpperCase() == 'EDIT' ) {
				$("#returnToFillSignCardList").hide();
			}
			
			//如果是工作流打回,界面上的"返回XX列表"不显示
			if (this.isFromWF()) {
				$("#returnToFillSignCardList").hide(); 
				$("#cancel").hide(); 
			}
		
			//针对从【员工自助服务-我的打卡记录】中进入
			that.strdate = $.getUrlParam('strdate');
			that.myExtendValidate();//使用自定义的校验扩展校验 
			that.myExtendValidate1();//使用自定义的校验扩展校验 
			that.initEditGrid();
			//that.dealWindownLoad(); //将日期保留10位
			
			that.handleFSCEntry();
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
		   if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.FillSignCardForm"){
			   that.isExistsEffectiveAttanceFile();
		   }
		   /*面包屑问题 */
		   if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.FillSignCardForm" ) {
				if (shrDataManager.pageNavigationStore.getDatas().length == 2) {
					$("#breadcrumb").find("li.active").html(jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_19);
					var a = shrDataManager.pageNavigationStore.getDatas()[1];
					a.name = jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_19;
					shrDataManager.pageNavigationStore.pop();
					shrDataManager.pageNavigationStore.addItem(a);
				}else if (shrDataManager.pageNavigationStore.getDatas().length == 3) {
					//$("#breadcrumb li")[2].remove();
					$("#breadcrumb").find("li.active").html(jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_19);
					shrDataManager.pageNavigationStore.pop();
				}else if (shrDataManager.pageNavigationStore.getDatas().length == 4) {
					$($("#breadcrumb li")[3]).html(jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_6);
				}
			}
			
		   that.initCcPersonPrompt();
	  },
    clearCCPersonIdsPrompt :function() {
        if ($('#ccPersonIds').length == 0) {
            return;
        }
        atsCcPersonUtils.clearCCPersonIdsPrompt(this);
    },
    initCcPersonPrompt :function() {
        if ($('#ccPersonIds').length == 0) {
            return;
        }
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

	  ,initEditGrid :function(){
	  	var row_fields_work =  '<div style="padding-top:15px;" class="row-fluid row-block row_field">'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_10
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_2
			+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_4
			+ '</span></div>'
	 		+ '<div class="spanSelf"><span class="cell-RlStdType">'
	 		+ jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_23
	 		+ '</span></div>'
			+ '<div class="spanSelf"><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_0
			+ '</span></div>'
	  	 	+ '</div>';
	  	 $('#fillSignCardEntryInfo').append(row_fields_work);
	  }
	  ,myExtendValidate:function(){ //扩展自定义校验
	      jQuery.extend(jQuery.validator.messages, {
    		myTmVldt: jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_12
		  });  
		  jQuery.validator.addMethod("myTmVldt", function(value, element) {  
	    	   var v=value||'';

			   //return testTimeFormat(value);
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
		  }, jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_12);//msg:错误提示文本。已验证
	   
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
			if(/[0-2][0-9]:[0-5][0-9]/.test(fillCardTimeStr)&&fillCardTimeStr.length==5){
	    	   	  var h=new Number(fillCardTimeStr.substr(0,2));
	    	   	  if(h<24)
				  {
					    value=value+" "+fillCardTimeStr+":00";
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
	   
	  	
	  }
	  ,handleFSCEntry : function(){
	  	var that = this;
	  	if(that.getOperateState() == "ADDNEW"){
	  		var date=shr.getUrlRequestParam("strdate");
	  		var data = {
	  				date:date,
					uipk:"com.kingdee.eas.hr.ats.app.FillSignCardForm"
			};
			shr.doAjax({
				url: shr.getContextPath()+"/dynamic.do?method=addItemJson",
				dataType:'json',
				type: "POST",
				data: data,
				async:false,  
				success: function(response){ 
					that.setFSCEntry(response);
				}
			});
			var attendDate0 = shr.getUrlRequestParam("startAndEnd");
     		if(!attendDate0){
			return;	
		    }else{
				 $('#attendDate0').val(attendDate0);		    
		    }
	  	}
	  	else if(that.getOperateState() == "VIEW" || that.getOperateState() == "EDIT"){
	  		var data = {
					id:$('#form #id').val()||'',
					uipk:"com.kingdee.eas.hr.ats.app.FillSignCardForm"
			};
			shr.doAjax({
				url: shr.getContextPath()+"/dynamic.do?method=getItemsJson",
				dataType:'json',
				type: "POST",
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

		
        var select_json = {
			id: "type" + i,
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
		select_json.data = [{"value": 1, "alias": jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_1}];
						
		
		
	  	if(rst.records!= null && rst.records>0 && rst.rows!=null && rst.rows.length>0){
	  		var id,attendDate,type,fillCardTimeStr,remark,reason_id,reason_name;
	  		for(var i=0;i<rst.rows.length;i++){
				var row = rst.rows[i];
				id = row["id"],attendDate=row["attendDate"],type_key=row["type.key"],type_value=row["type.value"],
				fillCardTimeStr = row["fillCardTimeStr"],reason_id = row["reason.id"],reason_name = row["reason.name"],
				remark = row["remark"];
				var row_fields_work = "";
				this.fillCardTimeStr=fillCardTimeStr;
				if(_self.getOperateState() == "ADDNEW" || _self.getOperateState() == "EDIT"){
					 row_fields_work = '<div  class="row-fluid row-block row_field">'
					    + '<div class="spanSelf"><input type="hidden" name="id' + i + '" value="'  + correctValue(id) + '" /><input type="text" id="attendDate' + i + '" name="attendDate' + i + '" value="' + correctValue(attendDate) + '"class="input-height cell-input" validate="{required:true}" /></div>'
					    
					    + '<div class="spanSelf"><input type="text"  name="type' + i + '" value="" class="input-height cell-input"    validate="{required:true}"/></div>'
						
						+ '<div class="spanSelf"><input  type="text" name="reason' + i + '" value="" class="input-height cell-input"   validate="{required:true}"/></div>'
						
						+ '<div class="spanSelf"><input style="background-color:#daeef8"  length="5" type="text" name="fillCardTimeStr' + i + '" value="' + correctValue(fillCardTimeStr) + '" class="input-height cell-input fillCardTime"  placeholder="'
						+ jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_24
						+'" validate="{required:true,myTmVldt:true}"  /></div>'
						
						+ '<div class="spanSelf"><input  maxlength="255" type="text" name="remark' + i + '" value="' + correctValue(remark) + '" class="input-height cell-input"/></div>';
						if(i == 0){
							row_fields_work  += '<div><a class="rowAdd cursor-pointer">+</a></div>';	
						}
						else{
							row_fields_work += '<div><a class="rowAdd cursor-pointer">+</a><a class="rowDel cursor-pointer">x</a></div>';
						}
					row_fields_work += '</div>';
					
				    $('#fillSignCardEntryInfo').append(row_fields_work);
					_self.addRowFieldString(false,i,reason_id,reason_name,type_key,type_value);
				}
				else if(_self.getOperateState() == "VIEW"){
					row_fields_work =  '<div class="row-fluid row-block row_field">'
							+ '<div class="spanSelf"><input type="hidden" name="id' + i + '" value="'  + correctValue(id) + '" /><input type="hidden" id="type' + i + '_el" value="'  + correctValue(type_value) + '" /><input type="hidden" id="reason' + i + '_el" value="'  + correctValue(reason_id) + '" /> <span id="attendDate' + i + '" name="attendDate' + i + '" class="cell-input">' + correctValue(attendDate) + '</span></div>'
							
							+ '<div class="spanSelf"><span name="type' + i + '" class="cell-input">' + correctValue(type_key) + '</span></div>'

							+ '<div class="spanSelf"><span name="reason' + i + '" class="cell-input">' + correctValue(reason_name) + '</span></div>'
				
							+ '<div class="spanSelf"><span name="fillCardTimeStr' + i + '"  class="cell-input">' + correctValue(fillCardTimeStr) + '</span></div>' 
							
							+ '<div class="spanSelf"><span name="remark' + i + '" class="cell-input">' + correctValue(remark) + '</span></div>'
						+ '</div>';
						$('#fillSignCardEntryInfo').append(row_fields_work);
				}
				//atsMlUtile.setTransDateTimeValue("attendDate" + i, attendDate,"TimeStamp",false,true);
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
			   _self.addRowFieldString(true,idxA,null,null,null,null);
			   $('input[name="type' + idxA + '"]').shrSelect(select_json);
	   		}
	    }); 
	    
		//删除
	    $('#fillSignCardEntryInfo a.rowDel').die('click');
		$('#fillSignCardEntryInfo a.rowDel').live('click',function(){
	    	$(this).closest("div.row_field").remove();
	    });
		shr.setIframeHeight();
    }
    ,addRowFieldString :function(flag,i,reason_id,reason_name,type_key,type_value){
    	if(flag){
    		var row_fields_work = '<div  class="row-fluid row-block row_field">'
    		
    		  			+ '<div class="spanSelf"><input type="hidden" name="id' + i + '" value="" /><input type="text" id="attendDate'+ i +'" name="attendDate' + i 
    		  			+ '" value=""class="input-height cell-input" validate="{required:true}" /></div>'
					    
					    + '<div class="spanSelf"><input name="type' + i + '_el" type="hidden"/><input type="text"  name="type' + i + '" value="" class="input-height cell-input"    validate="{required:true}"/></div>'
						
						+ '<div class="spanSelf"><input type="text" name="reason' + i + '" value="" class="input-height cell-input"   validate="{required:true}"/></div>'
						
						+ '<div class="spanSelf"><input style="background-color:#daeef8"  length="5" type="text" name="fillCardTimeStr' + i + '" value="" class="input-height cell-input fillCardTime"  placeholder="'
						+ jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_24
						+ '" validate="{required:true,myTmVldt:true}"  /></div>'
						
						+ '<div class="spanSelf"><input maxlength="255" type="text" name="remark' + i + '" value="" class="input-height cell-input"/></div>'
						
						+ '<div><a class="rowAdd cursor-pointer">+</a><a class="rowDel cursor-pointer">x</a></div>'
						
						+ '</div>';
						
			$('#fillSignCardEntryInfo').append(row_fields_work);
			
    	}
    	 //$('input[name="attendDate' + i + '"]').attr("validate","{required:true,myTmVldt:true}");
		$('input[name="attendDate' + i + '"]').attr("validate","{required:true,myTmVldt1:true}");
	//将【考勤日期】 【补签卡类型】【补签卡原因】封装成F7
    	
		//【考勤日期】	
		$('input[name="attendDate' + i + '"]').shrDateTimePicker({
					id : "attendDate" + i,
					tagClass : 'block-father input-height',
					readonly : '',
					yearRange : '',
					isRemoveSeconds: true,
					ctrlType: "date",
					isAutoTimeZoneTrans:false,
					validate : '{dateISO:true,required:true}'
		});
		//针对从【员工自助服务-我的打卡记录】中进入
		if(this.strdate != null && this.strdate != undefined && this.strdate != ""){
				
				if(this.fillCardTimeStr){
				$('input[name="attendDate' + i + '"]').shrDateTimePicker("setValue",this.strdate + " "+this.fillCardTimeStr);
				}else{
				$('input[name="attendDate' + i + '"]').shrDateTimePicker("setValue",this.strdate + " 08:30");
				}
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
		select_json.data = [{"value": 1, "alias": jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_1}];
		$('input[name="type' + i + '"]').shrSelect(select_json);
		//系统带出来的第一条就是默认值
		if(!flag){
			$('input[name="type' + i + '"]').val(type_key);
			$('input[name="type' + i + '_el"]').val(type_value);
		}
		//如果是新增，默认的就是补卡
		else{
			$('input[name="type' + i + '"]')
				.val(jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_1);
			$('input[name="type' + i + '_el"]').val(1);
		}
		
		var grid_f7_json = {id : "reason" + i ,name:"reason" + i };
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		var object = $('input[name="reason' + i + '"]');
		grid_f7_json.subWidgetOptions = {
			title : jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_4,
			uipk : "com.kingdee.eas.hr.ats.app.FillSignReason.AvailableList.F7",
			query : ""
		};
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_20,widgetType: "checkbox"}];
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
		_self.processFillDays("attendDate"+i);

        $(".fillCardTime").on("input",function(e){
            var v=$(e.target).val()||'';
            if(/[0-5][0-9][0-5][0-9]/.test(v)&&v.length==4){
                v=$(e.target).val().substring(0,2)+":"+$(e.target).val().substring(2,4);
            }
           if((/[0-2][0-9]:[0-5][0-9]/.test(v)&&v.length==5)||(/[0-2][0-9]：[0-5][0-9]/.test(v)&&v.length==5)){
	    	   	  var h=new Number(v.substr(0,2));
                if(h<24){
                	v=v.substring(0,2)+":"+v.substring(3,5);
                    $(e.target).val(v);
                }
            }
        });
    },processFillDays : function(attendDates){
   		var that = this ;
		$('input[name="' + attendDates + '"]').change(function(){
			 that.changeFillSignHrOrgUnits(attendDates);
		});
		
	},
	changeFillSignHrOrgUnits : function(attendDates){
		var that = this;
		var attendDate = atsMlUtile.getFieldOriginalValue(attendDates);
		if ( attendDate!=""&&attendDate!=null ) {
		attendDate = attendDate.replace("\\-","/");
		var personId = $("#entries_person_el").val();
		that.remoteCall({
			type:"post",
			async: false,
			method:"getHrOrgUnit",
			param:{personId:personId,beginTime:attendDate},
			success:function(res){
				info =  res;
				if(res.hrOrgUnitname && res.hrOrgUnitId){
				$("#hrOrgUnit").val(res.hrOrgUnitname);
				$("#hrOrgUnit_el").val(res.hrOrgUnitId);
				}
				
			}
		});
		}
	}

	  ,processF7ChangeEvent : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			$("#entries_person").shrPromptBox("option", {
				onchange : function(e, value) {
					var info = value.current;
					$("#entries_person_number").val(info.number);//@
					$("#entries_person_id").val(info["id"]);
					$("#empPosOrgRela").val(info["empPosOrgRela.id"]);
					$("#entries_adminOrgUnit_name").val(info["adminOrgUnit.name"]);//是info上的属性adminOrgUnit.name，不是info上的对象adminOrgUnit的属性name
				    $("#entries_position_name").val(info["position.name"]);
				}, afterOnSelectRowHandler: function (e, value) {
                    that.clearCCPersonIdsPrompt();
                    that.initCcPersonPrompt();
				}
			}); 
		}
	}
	
	,dealWindownLoad:function(){
		var that=this; 
	    $(window).load(function(){
	    	//20131129 预置一条数据
	    	$('td[aria-describedby="entries_attendDate"]').text(function(index, text){
	    	   if(text.length>10){
	    	     return text.substring(0,10);
	    	   }
	    	});
		});
	}
	//个人的补签卡列表 
	,cancelAction:function(){
		//window.location.href= shr.getContextPath()+"/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.FillSignCardList";
		var punchCardFlag = sessionStorage.getItem("punchCardFlag");
		if("fromPunchCard" == punchCardFlag){
		
		} 
		this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.FillSignCardList'
		});
	}
	 /**
	 * 保存
	 */
	,saveAction: function(event) {
		var _self = this;
		//执行更行jpGrid		
		if (_self.validate() && _self.verify()) {
			
		var lengthArray = [];
			$('#fillSignCardEntryInfo input[name^=attendDate]').each(function(i,domEle) {
				  var length = $(domEle).attr("name").substring("attendDate".length);
				  
				  lengthArray.push(parseInt(length));
			});
			
			//将数组由小到大排列
			if(lengthArray.length > 0){
				lengthArray.sort(sortNumber);
			}
			var attendDateMin=null;
			var attendDateMax=null;
			for(var i=0;i<lengthArray.length;i++){
				var attendDate = correctValue($('#fillSignCardEntryInfo input[name="attendDate' + lengthArray[i] + '"]').val().split(" ")[0]);
				if(attendDateMin==null){
				attendDateMin=attendDate
				}else{
					if(attendDate<attendDateMin){
						attendDateMin=attendDate;
					}
				};
				if(attendDateMax==null){
				attendDateMax=attendDate
				}else{
					if(attendDate>attendDateMax){
						attendDateMax=attendDate;
					}
				};
			}
			
			var beginDate = attendDateMin;
			var endDate = attendDateMax;
			var personId = $('#entries_person_id').val();	
			var billType = "fillSignCard";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: true,
				success:function(res){
					var result = res.result;
					if(result==""){
							_self.doSave(event, 'save');
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_17,function(){
							_self.doSave(event, 'save');
						});
					}
				}
			});	
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
		//执行更行jpGrid
		var _self = this;
		var workArea = _self.getWorkarea(),
		$form = $('form', workArea);
		
		if(shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.FillSignCardForm" ){
			var personId = $('#entries_person_id').val();
			var proposerId = $('#proposer_id').val();
			if(undefined != personId && undefined != proposerId && personId != "" && proposerId != "" && personId != proposerId){
				shr.showError({message: jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_21, hiddenAfter: 5});
				return;
			}
		}
		
		if (_self.validate() && _self.verify()) {
			
		var lengthArray = [];
			$('#fillSignCardEntryInfo span[name^=attendDate]').each(function(i,domEle) {
				  var length = $(domEle).attr("name").substring("attendDate".length);
				  lengthArray.push(parseInt(length));
			});
			
			//将数组由小到大排列
			if(lengthArray.length > 0){
				lengthArray.sort(sortNumber);
			}
			var attendDateMin=null;
			var attendDateMax=null;
			for(var i=0;i<lengthArray.length;i++){
				var attendDate = correctValue($('#fillSignCardEntryInfo span[name="attendDate' + lengthArray[i] + '"]').html().split(" ")[0]);
				if(attendDateMin==null){
				attendDateMin=attendDate
				}else{
					if(attendDate<attendDateMin){
						attendDateMin=attendDate;
					}
				};
				if(attendDateMax==null){
				attendDateMax=attendDate
				}else{
					if(attendDate>attendDateMax){
						attendDateMax=attendDate;
					}
				};
			}
			
			var beginDate = attendDateMin;
			var endDate = attendDateMax;
			var personId = $('#entries_person_id').val();	
			var billType = "fillSignCard";
			_self.remoteCall({
				type:"post",
				method:"billCheck",
				param:{beginDate:beginDate,endDate:endDate,personId:personId,billType:billType},
				async: true,
				success:function(res){
					var result = res.result;
					if(result==""){
						shr.showConfirm(jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_11, function() {
						_self.doSubmit(event, 'submit');
						});	
					}else{
						shr.showConfirm(result+jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_17,function(){
							shr.showConfirm(jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_11, function() {
									_self.doSubmit(event, 'submit');
							});	
						});
					}
				}
			});
		}		
		
	}
	
	,goNextPage: function(source) {
		// !!!!提交完之后再返回列表
		_self.reloadPage({
			uipk: "com.kingdee.eas.hr.ats.app.FillSignCardList"
		});
	}

	,validate: function() {
	    if(this.getOperateState()=='VIEW')
		{
			return true;
		}
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
			var model = that.getCurrentModel(); 
			that.remoteCall({
			    method:"validateIsFillSignCard",
			    param:{model:model},
				async: false,
			    success:function(res){
					info =  res;
					if(res.errorString){
						  shr.showError({message:res.errorString});
						  flag = false;
					}
			    }
			}); 
			
		}
		
		return flag ;
		
		
		
	}
	,verify : function(){
		var that = this;
		var flag = true;
		if(that.isFromWF() || shr.getUrlRequestParam('uipk') == 'com.kingdee.eas.hr.ats.app.FillSignCardForm') 
		{
			var model = that.getCurrentModel(); 
			that.remoteCall({
			    method:"validateIsFillSignCard",
			    param:{model:model},
				async: false,
			    success:function(res){
					info =  res;
					if(res.errorString){
						  shr.showError({message:res.errorString});
						  flag = false;
					}
			    }
			}); 
			
		}
		return flag ;
	},
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
		        rt.info=shr.formatMsg(jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_8,[dttm1, i+1, j+1]);
		        return rt;
		     }
		  }
		}
	
		rt.valid=true;//循环完，没重复，valid=true
		return rt;
	}

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
	,setButtonVisible:function(){
		var billState = $("#billState").val();
		//alert(billState);
		if (billState) {
			if (billState==3 || jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_14==billState || billState ==4
				||jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_13==billState || billState ==2
				||jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_15==billState ) {
				$("#edit").hide();
				$("#submit").hide();
				$("#submitEffect").hide();
			} else if (1==billState || jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_18== billState || 2 == billState
				|| jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_15==billState ) { //未审批或审批中
				if(!this.isFromWF()){
					$("#edit").hide();
					$("#submit").hide();
					$("#submitEffect").hide();
				}
			}
			
			if(this.isFromWF()){
			     $("#workFlowDiagram").show();
				 $("#auditResult").show();
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
	 		shr.showError({message: jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_22});
	 		return null;
	 	}
        model.ccPerson = model.ccPersonIds;
		data.model = shr.toJSON(model);
		data.method = action;
		if($('#hrOrgUnit_el').val()==null || $('#hrOrgUnit_el').val()==""){
			if($('#hrOrgUnit').val()==null || $('#hrOrgUnit').val()=="" ){
				return;
			}
		}
		// relatedFieldId
		var relatedFieldId = this.getRelatedFieldId();
		if (relatedFieldId) {
			data.relatedFieldId = relatedFieldId;
		}
		if(data == null){
			return;
		}
		
		//传递额外参数person,empPosOrgRela
		data=$.extend({
		  person:$('#entries_person_id').val(),
		  position:$('#entries_position_id').val(),
		  adminOrgUnit:$('#entries_adminOrgUnit_id').val(),
		  empPosOrgRela:$('#empPosOrgRela').val(),
		  hrOrgUnit:$('#hrOrgUnit_el').val()==null?$('#hrOrgUnit').val():$('#hrOrgUnit_el').val()
		},data);
		
		return data;
	}
	
	,returnToFillSignCardListAction:function(){
	   this.reloadPage({
			uipk: 'com.kingdee.eas.hr.ats.app.FillSignCardList'
		});
	},
	setNavigateLine: function(){
	   var fromFlag = localStorage.getItem("fromFlag");
     	var punchCardFlag = sessionStorage.getItem("punchCardFlag");
     	var parentUipk;
     	if(parent.window.shr==null){
     		parentUipk = shr.getCurrentViewPage().uipk;
     	}else{
     		parentUipk = parent.window.shr.getCurrentViewPage().uipk;
     	}
     	if("employeeBoard" == fromFlag || "punchCard" == fromFlag
     	|| ("fromPunchCard" == punchCardFlag && 
     	"com.kingdee.eas.hr.ats.app.WorkCalendarItem.listSelf" == parentUipk)){//来自我的考勤或者我的打卡记录的时候。将导航条删除掉。
	        $("#breadcrumb").parent().parent().remove();
	        window.parent.changeDialogTitle(jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_19);
	        localStorage.removeItem("fromFlag");
	        localStorage.removeItem("listToAddFlag");
	    }
	}
	
	/**
	 * 查看流程图
	 */
	,workFlowDiagramAction: function() {
		this.getWorkFlowHelper().viewWorkFlowDiagram(this.billId);
		setTimeout("$($('.workflowIframe').children()[0]).css('height','880px')",3000);
		//setTimeout("$($(window.frames['operationDialog-frame'].document).find('.workflowIframe').children()[0]).css('height','880px')",5000);
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
				var attendDate = $('#fillSignCardEntryInfo input[name="attendDate' + lengthArray[i] + '"]').shrDateTimePicker("getValue").split(" ")[0];
				var fillCardTimeStr = $('#fillSignCardEntryInfo input[name="fillCardTimeStr' + lengthArray[i]  + '"]').val();
				var entrie = {
					id: correctValue($('#fillSignCardEntryInfo input[name="id' + lengthArray[i] + '"]').val()),
					attendDate: attendDate,
					type: new Number($('#fillSignCardEntryInfo input[type=hidden][id="type' + lengthArray[i]  +'_el"]').val()),
					reason: {
							id:correctValue($('#fillSignCardEntryInfo input[type=hidden][id="reason'+ lengthArray[i]  + '_el"]').val()),
							name:correctValue($('#fillSignCardEntryInfo input[name="reason' + lengthArray[i]  + '"]').val())},
					fillCardTimeStr: fillCardTimeStr,
					remark:	correctValue($('#fillSignCardEntryInfo input[name="remark' + lengthArray[i] + '"]').val()),
					fillCardTime: correctValue(attendDate + " " + fillCardTimeStr + ":00"),//流程中审批编辑补卡时间，fillCardTime没更新到
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
				var attendDate = atsMlUtile.getFieldOriginalValue('#fillSignCardEntryInfo span[name="attendDate' + lengthArray[i] + '"]').split(" ")[0];
				var fillCardTimeStr = atsMlUtile.getFieldOriginalValue('#fillSignCardEntryInfo span[name="fillCardTimeStr' + lengthArray[i]  + '"]').split(" ")[0];
				var entrie = {
					id: correctValue($('#fillSignCardEntryInfo input[name="id' + lengthArray[i] + '"]').val()),
					attendDate: attendDate,
					type: new Number($('#fillSignCardEntryInfo input[type=hidden][id="type' + lengthArray[i]  +'_el"]').val()),
					reason: {
							id:correctValue($('#fillSignCardEntryInfo input[type=hidden][id="reason'+ lengthArray[i]  + '_el"]').val()),
							name:correctValue($('#fillSignCardEntryInfo span[name="reason' + lengthArray[i]  + '"]').text())},
							
					fillCardTimeStr: fillCardTimeStr,
					remark:	correctValue($('#fillSignCardEntryInfo span[name="remark' + lengthArray[i] + '"]').text()),
					fillCardTime: correctValue(attendDate + " " + fillCardTimeStr + ":00"),//流程中审批编辑补卡时间，fillCardTime没更新到
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
	/* 是否有有效的考勤档案，对于考勤相关操作，有考勤档案但没有考勤制度也是不行的 */
	,isExistsEffectiveAttanceFile : function(){
		var _self = this ;
		var personNum = "";
	 	if("ADDNEW" == this.getOperateState() || "EDIT" == this.getOperateState()){
	 	    personNum = $("#entries_person_number").val()//@
	 	}else if("VIEW" == this.getOperateState()){
	 	    personNum = $("#entries_person_number").text()//@
	 	}
	 	var isExistsEffectiveFile = true;
		_self.remoteCall({
			type:"post",
			method:"isExistsEffectiveAttanceFile",
			async: false,
			param:{personNum: personNum},
			success:function(res){
				var info =  res;
				if (!info.isExistsEffectiveFile){
					if (shr.getCurrentViewPage().uipk == "com.kingdee.eas.hr.ats.app.FillSignCardForm") {
						shr.showWarning({message:jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_7});
					}else{
						shr.showWarning({message:jsBizMultLan.atsManager_fillSignCardEditForDialog_i18n_9});
					}
					isExistsEffectiveFile =  false;
				}	
			}
		});
		return isExistsEffectiveFile;
	}
});	
function testTimeFormat(timeValue)
{    
    //校验时间格式：2015-09-17 15:00 或者 2015-09-17 15:00:00
	//var pattern=/((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-)) ((20|21|22|23|[0-1]?\d):[0-5]?\d:[0-5]?\d$)|((20|21|22|23|[0-1]?\d):[0-5]?\d)/;
	
	var pattern = /^(\d{4})-(\d{2})-(\d{2})$/;
	return pattern.test(timeValue);
}
function correctValue(value){
	if(value == undefined || value == null){
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
