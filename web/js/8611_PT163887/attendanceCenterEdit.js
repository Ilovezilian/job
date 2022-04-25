var globalOO={};

shr.defineClass("shr.ats.AttendanceCenterEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.AttendanceCenterEdit.superClass.initalizeDOM.call(this);
		var that = this ;
		//that.F7_1();
		$(window).load(function(){
			renderAttencePolicy();
			renderHolidayPolicySet();
			renderAtsShift();
		});
		globalOO=that;
		that.liLoad();
	}
	/**重写右边  关系侧边栏  的处理脚本*/
	,liLoad:function(){
		var _self=this;
		$('#relatedPanel li').unbind();
	    $('#relatedPanel li').on('click', function() {
			var $li = $(this);
			var vparams={
			   method:"",
			   "attendCenterId":$('#form #id').val()
			};
			if ($li.attr('type')=='list'){
				//vparams.method="getListData";
				vparams.rows=30;
				vparams.page=1;
			}else if($li.attr('type')=='form'){
				vparams.method="view";
			}else{
				vparams.method="initalize";
			}
			if($('#form #id').val()==''){
				shr.showError({message: jsBizMultLan.atsManager_attendanceCenterEdit_i18n_11});
				return;
			}
			
			if ($li.attr('uipk')) {
				_self._openNewPageByUIPK($li, vparams);
			} else if ($li.attr('url')) {
				_self._openNewPageByUrl($li, vparams);
			}
		});	
	}
	,_openNewPageByUIPK: function($li, vparams) {
		var _self=this;
		var params={
			uipk:$li.attr('uipk'),
			breadcrumbType:'viewTitle'
		};
    	$.extend(params,vparams);
    	
		_self.reloadPage(params);       	
    },   
    
    _openNewPageByUrl: function($li, vparams) {
    	var _self=this;
    	var url = $li.attr('url');
    	if (!(url.substring(0, 7) == 'http://' || url.substring(0, 3) == 'www')) {
    		url = shr.getContextPath() + url;
    	}
    	var params={
    	};
    	$.extend(params,vparams);
		_self.reloadPage(params, url);       	
    }
	 
	 /**
	 * 覆盖保存方法  校验名称和ID是否重复
	 */
	,saveAction:function(event){
	 var that = this ;
	 var name = $("#name").val();
     var billId  = $("#id").val();
	 var number  = atsMlUtile.getFieldOriginalValue("number");
	 var workArea = that.getWorkarea();
	 var $form = $('form', workArea);
		  if ($form.valid() && that.verify()) {
         	that.remoteCall({
				type:"post",
				method:"checkNameAndIdIsExist",
				param:{name: name,billId:billId,number:number},
				success:function(res){		
				if(res.checkNameIsExist=="exist"){
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_attendanceCenterEdit_i18n_7,[name])});
				}else if(res.checkIdIsExist=="exist"){			
					shr.showWarning({message: shr.formatMsg(jsBizMultLan.atsManager_attendanceCenterEdit_i18n_2,[number])});
				}else{
					that.doSave(event, 'save');		
				}					
				
				}
			});
		 }
	}
	
//	,F7_1:function(options){
//	    var grid_f7_json = {id:"addNew1",name:"addNew1"};
//		grid_f7_json.subWidgetName = 'shrPromptGrid';
//		grid_f7_json.subWidgetOptions = {
//			title:"假期类型",
//			uipk:"com.kingdee.eas.hr.ats.app.HolidayPolicyF7_4Limit",
//			query:"",
//			filter:"",// 
//			domain:"",
//			multiselect:true
//		};
//		grid_f7_json.value = "";//${promptId} 默认选中的记录的Id
//		grid_f7_json.readonly = '';
//		
//		options=options||{};
//		var opts={
//		   filter:" attendanceCenter.id='zc3GIuYMQYCq0eYQOI6re98T1Xg=' "
//		};
//		$.extend(opts,options);
//		if (opts) {
//			if(opts.filter){
//				grid_f7_json.subWidgetOptions.filter=opts.filter;
//			}
//		}
//		
//		$('#'+grid_f7_json.id).shrPromptBox(grid_f7_json);
//	}
	,addNew1Action:function(){
		$("#iframe1").attr("src",shr.getContextPath()+'/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.AttencePolicy4AttendanceCenter.list');
		$("#iframe1").dialog({
	 		 modal: true,
	 		 width:850,
	 		 minWidth:850,
	 		 height:500,
	 		 minHeight:500,
	 		 title:jsBizMultLan.atsManager_attendanceCenterEdit_i18n_5,
	 		 open: function( event, ui ) {
	 		     
	 		 },
	 		 close:function(){
	 		     //绘制
	 		 	renderAttencePolicy();
	 		 }
 		});
    	$("#iframe1").attr("style","width:850px;height:500px;");
	}
	,addNew2Action:function(){
		$("#iframe1").attr("src",shr.getContextPath()+'/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.HolidayPolicySet4AttendanceCenter.list');
		$("#iframe1").dialog({
	 		 modal: true,
	 		 width:850,
	 		 minWidth:850,
	 		 height:500,
	 		 minHeight:500,
	 		 title:jsBizMultLan.atsManager_attendanceCenterEdit_i18n_4,
	 		 open: function( event, ui ) {
	 		     
	 		 },
	 		 close:function(){
	 		     //绘制
	 		 	renderHolidayPolicySet();
	 		 }
 		});
    	$("#iframe1").attr("style","width:850px;height:500px;");
	}
	,addNew3Action:function(){
		$("#iframe1").attr("src",shr.getContextPath()+'/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsShift4AttendanceCenter.list');
		$("#iframe1").dialog({
	 		 modal: true,
	 		 width:850,
	 		 minWidth:850,
	 		 height:500,
	 		 minHeight:500,
	 		 title:jsBizMultLan.atsManager_attendanceCenterEdit_i18n_0,
	 		 open: function( event, ui ) {
	 		     
	 		 },
	 		 close:function(){
	 		     //绘制
	 		 	renderAtsShift();
	 		 }
 		});
    	$("#iframe1").attr("style","width:850px;height:500px;");
	}
});


//绘制考勤制度
function renderAttencePolicy(){
	$('div[id^=attencePolicy_div]').remove();
	
	//获得数据
	var attendanceCenterId=$('#form #id').val()||'';
	var data = {
			attendanceCenterId:attendanceCenterId,
			uipk:"com.kingdee.eas.hr.ats.app.AttendanceCenter.form"
	};
	shr.doAjax({
		url: shr.getContextPath()+"/dynamic.do?method=getAttencePolicys",
		dataType:'json',
		type: "POST",
		data: data,
		success: function(response){ 
			var rst= response||"{}";
			
			if(rst.records!=null&&rst.records>0){//rst.rows
				$('#shr-multiRow-empty1').hide();
				var i=0;
				for(i=0; i<rst.rows.length;i++){
					 var row=rst.rows[i];
						
					 var rowStr=' <div id="attencePolicy_div'+i+'" class="view_mainPage row-fluid"> '
					+' 	<div class="span12 offset0 " id=""> '
					+' 			<div class="form-horizontal" id="attencePolicy_form'+i+'" action="" novalidate="novalidate"> '
					+'                   <input type="hidden" id="id" name="id" value="'+row.id+'" /> '
					+' 				<div id="attencePolicy_tooldiv'+i+'" class="row-fluid row-block "> '
					+' 					<div class="span12 offset0 " id=""> '
					+' 						<span class="" style="float:right">				 '
					+' 							<button onclick="" class="shrbtn-primary shrbtn" id="addNew1" name="addNew1" type="button">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_15
						 + '</button> '
					+' 							<button onclick="" class="shrbtn-primary shrbtn" id="delete1" name="delete1" type="button">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_13
						 + '</button> '
					+' 				        </span> '
					+' 					</div> '
					+' 		  	    </div> '
					+' 				<div id="" class="row-fluid row-block ">	 '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_1
						 + '" class="field_label">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_1
						 + '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> '
					+' 									<span id="number" class="field_input" value="'+row.rnumber+'">'+row.rnumber+'</span> '
					+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_6
						 + '" class="field_label">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_6
						 + '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> '
					+' 									<span id="name" class="field_input" value="'+row.rname+'">'+row.rname+'</span> '
					+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 			  </div> '
					+' 		  	<div id="" class="row-fluid row-block ">	 '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_14
						 + '" class="field_label">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_14
						 + '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> ';
					
					if(row.isDefault){
						rowStr=rowStr+'<input type="radio" name="isDefault" checked="true"/> ';
					}else{
						rowStr=rowStr+'<input type="radio" name="isDefault" /> ';
					}
											  
					rowStr=rowStr+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						+ jsBizMultLan.atsManager_attendanceCenterEdit_i18n_3
						+ '" class="field_label">'
						+ jsBizMultLan.atsManager_attendanceCenterEdit_i18n_3
						+ '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> '
					+' 							<a style="text-decoration:underline;" class="attencePolicyActClass" name="view1" value="'+row.rid+'"  href="javascript:void(0);">'
						+ jsBizMultLan.atsManager_attendanceCenterEdit_i18n_3
						+ '</a> '
					+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 			  </div> '
					+' 			</div>  ' /////////
					+' 	</div> '
					+' </div> ' ;
					$('#shr-multiRow-empty1').parent().append(rowStr);
					$('div[id^=attencePolicy_tooldiv] span').hide();
 
					$('#attencePolicy_form'+i).hover(function () {
					    //alert(i); // 执行此方法是i的值已经变得很大了。
					    //alert($('#attencePolicy_tooldiv'+i).size());
					    $('div[id^=attencePolicy_tooldiv] span',this).show();
					  },
					  function () {
					    $('div[id^=attencePolicy_tooldiv] span',this).hide();
					  }
					);
		
				}//~end of for		
				
			   //为新渲染出来的加上事件
			   //新增
			   $('div[id^=attencePolicy_tooldiv] [name=addNew1]').live('click',function(){
			      	$("#iframe1").attr("src",shr.getContextPath()+'/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.AttencePolicy4AttendanceCenter.list');
					$("#iframe1").dialog({
				 		 modal: true,
				 		 width:850,
				 		 minWidth:850,
				 		 height:500,
				 		 minHeight:500,
				 		 title:jsBizMultLan.atsManager_attendanceCenterEdit_i18n_5,
				 		 open: function( event, ui ) {
				 		     
				 		 },
				 		 close:function(){
				 		     //绘制
				 		 	renderAttencePolicy();
				 		 }
			 		});
			    	$("#iframe1").attr("style","width:850px;height:500px;");
			   });
			   //默认
			   $('div[id^=attencePolicy_div] [name=isDefault]').live('change',function(){
			   	  	var	attCenterAttencePolicyId=$('#id' ,$(this).closest("div[id^=attencePolicy_form]")).val();
			   	  	shr.doAjax({
						url: shr.getContextPath()+"/dynamic.do?method=changeAttCenterAttencePolicyDefault",
						dataType:'json',
						type: "POST",
						data: {
							attCenterAttencePolicyId:attCenterAttencePolicyId,
							uipk:"com.kingdee.eas.hr.ats.app.AttendanceCenter.form"
						},
						success: function(response){ }
			   	  	});	
			   });
			   //删除
			   $('div[id^=attencePolicy_tooldiv] [name=delete1]').live('click',function(){
			       var	attCenterAttencePolicyId=$('#id' ,$(this).closest("div[id^=attencePolicy_form]")).val();
			       var	isDefault=$('input:checked' ,$(this).closest("div[id^=attencePolicy_form]")).size();
			       if(isDefault>0){
			          shr.showError({message: jsBizMultLan.atsManager_attendanceCenterEdit_i18n_10});
			          return ;
			       }
			       var topDiv=$(this).closest("div[id^=attencePolicy_div]");
			       
			       shr.showConfirm(jsBizMultLan.atsManager_attendanceCenterEdit_i18n_12, function(){
				       shr.doAjax({
							url: shr.getContextPath()+"/dynamic.do?method=deleteAttCenterAttencePolicy",
							dataType:'json',
							type: "POST",
							data: {
								attCenterAttencePolicyId:attCenterAttencePolicyId,
								uipk:"com.kingdee.eas.hr.ats.app.AttendanceCenter.form"
							},
							success: function(response){
								var rst= response||"{}";
								if(rst.deleteSuccess){
									topDiv.remove();
								}
								if($("div[id^=attencePolicy_div]").size()<1){
									$('#shr-multiRow-empty1').show();
								}
							}
				   	  	});	
				   	   
			       });
			   });
			   //查看
			   $('div[id^=attencePolicy_div] a[name=view1]').live('click',function(){
			   	    var billId=$(this).attr('value');
			   	  	globalOO.reloadPage({
						uipk: 'com.kingdee.eas.hr.ats.app.AttencePolicy.form',
						billId:billId,
						onlyView:true,
						method: 'view'
					});
			   });
			}else{
			   $('#shr-multiRow-empty1').show();
			}
		}
    });
	
}


//绘制考勤制度
function renderHolidayPolicySet(){
	$('div[id^=holidayPolicySet_div]').remove();
	
	//获得数据
	var attendanceCenterId=$('#form #id').val()||'';
	var data = {
			attendanceCenterId:attendanceCenterId,
			uipk:"com.kingdee.eas.hr.ats.app.AttendanceCenter.form"
	};
	shr.doAjax({
		url: shr.getContextPath()+"/dynamic.do?method=getHolidayPolicySets",
		dataType:'json',
		type: "POST",
		data: data,
		success: function(response){ 
			var rst= response||"{}";
			
			if(rst.records!=null&&rst.records>0){//rst.rows
				$('#shr-multiRow-empty2').hide();
				var i=0;
				for(i=0; i<rst.rows.length;i++){
					 var row=rst.rows[i];
						
					 var rowStr=' <div id="holidayPolicySet_div'+i+'" class="view_mainPage row-fluid"> '
					+' 	<div class="span12 offset0 " id=""> '
					+' 			<div class="form-horizontal" id="holidayPolicySet_form'+i+'" action="" novalidate="novalidate"> '
					+'                   <input type="hidden" id="id" name="id" value="'+row.id+'" /> '
					+' 				<div id="holidayPolicySet_tooldiv'+i+'" class="row-fluid row-block "> '
					+' 					<div class="span12 offset0 " id=""> '
					+' 						<span class="" style="float:right">				 '
					+' 							<button onclick="" class="shrbtn-primary shrbtn" id="addNew2" name="addNew2" type="button">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_15
						 + '</button> '
					+' 							<button onclick="" class="shrbtn-primary shrbtn" id="delete2" name="delete2" type="button">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_13
						 + '</button> '
					+' 				        </span> '
					+' 					</div> '
					+' 		  	    </div> '
					+' 				<div id="" class="row-fluid row-block ">	 '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_1
						 + '" class="field_label">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_1
						 + '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> '
					+' 									<span id="number" class="field_input" value="'+row.rnumber+'">'+row.rnumber+'</span> '
					+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_6
						 + '" class="field_label">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_6
						 + '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> '
					+' 									<span id="name" class="field_input" value="'+row.rname+'">'+row.rname+'</span> '
					+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 			  </div> '
					+' 		  	<div id="" class="row-fluid row-block ">	 '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_14
						 + '" class="field_label">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_14
						 + '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> ';
					
					if(row.isDefault){
						rowStr=rowStr+'<input type="radio" name="isDefault" checked="true"/> ';
					}else{
						rowStr=rowStr+'<input type="radio" name="isDefault" /> ';
					}
											  
					rowStr=rowStr+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						+ jsBizMultLan.atsManager_attendanceCenterEdit_i18n_3
						+ '" class="field_label">'
						+ jsBizMultLan.atsManager_attendanceCenterEdit_i18n_3
						+ '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> '
					+' 							<a style="text-decoration:underline;" class="attencePolicyActClass" name="view2" value="'+row.rid+'"  href="javascript:void(0);">'
						+ jsBizMultLan.atsManager_attendanceCenterEdit_i18n_3
						+ '</a> '
					+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 			  </div> '
					+' 			</div>  ' /////////
					+' 	</div> '
					+' </div> ' ;
					$('#shr-multiRow-empty2').parent().append(rowStr);
					$('div[id^=holidayPolicySet_tooldiv] span').hide();
 
					$('#holidayPolicySet_form'+i).hover(function () {
					    //alert(i); // 执行此方法是i的值已经变得很大了。
					    //alert($('#attencePolicy_tooldiv'+i).size());
					    $('div[id^=holidayPolicySet_tooldiv] span',this).show();
					  },
					  function () {
					    $('div[id^=holidayPolicySet_tooldiv] span',this).hide();
					  }
					);
		
				}//~end of for		
				
			   //为新渲染出来的加上事件
			   //新增
			   $('div[id^=holidayPolicySet_tooldiv] [name=addNew2]').live('click',function(){
			      	$("#iframe1").attr("src",shr.getContextPath()+'/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.HolidayPolicySet4AttendanceCenter.list');
					$("#iframe1").dialog({
				 		 modal: true,
				 		 width:850,
				 		 minWidth:850,
				 		 height:500,
				 		 minHeight:500,
				 		 title:jsBizMultLan.atsManager_attendanceCenterEdit_i18n_4,
				 		 open: function( event, ui ) {
				 		     
				 		 },
				 		 close:function(){
				 		     //绘制
				 		 	renderHolidayPolicySet();
				 		 }
			 		});
			    	$("#iframe1").attr("style","width:850px;height:500px;");
			   });
			   //默认
			   $('div[id^=holidayPolicySet_div] [name=isDefault]').live('change',function(){
			   	  	var	attCenterHolidayPolicySetId=$('#id' ,$(this).closest("div[id^=holidayPolicySet_form]")).val();
			   	  	shr.doAjax({
						url: shr.getContextPath()+"/dynamic.do?method=changeAttCenterHolidayPolicySetDefault",
						dataType:'json',
						type: "POST",
						data: {
							attCenterHolidayPolicySetId:attCenterHolidayPolicySetId,
							uipk:"com.kingdee.eas.hr.ats.app.AttendanceCenter.form"
						},
						success: function(response){ }
			   	  	});	
			   });
			   //删除
			   $('div[id^=holidayPolicySet_tooldiv] [name=delete2]').live('click',function(){
			       var	attCenterHolidayPolicySetId=$('#id' ,$(this).closest("div[id^=holidayPolicySet_form]")).val();
			       var	isDefault=$('input:checked' ,$(this).closest("div[id^=holidayPolicySet_form]")).size();
			       if(isDefault>0){
			          shr.showError({message: jsBizMultLan.atsManager_attendanceCenterEdit_i18n_9});
			          return ;
			       }
			       var topDiv=$(this).closest("div[id^=holidayPolicySet_div]");
			       shr.showConfirm(jsBizMultLan.atsManager_attendanceCenterEdit_i18n_12, function(){
				       shr.doAjax({
							url: shr.getContextPath()+"/dynamic.do?method=deleteAttCenterHolidayPolicySet",
							dataType:'json',
							type: "POST",
							data: {
								attCenterHolidayPolicySetId:attCenterHolidayPolicySetId,
								uipk:"com.kingdee.eas.hr.ats.app.AttendanceCenter.form"
							},
							success: function(response){
								var rst= response||"{}";
								if(rst.deleteSuccess){
									topDiv.remove();
								}
								if($("div[id^=holidayPolicySet_div]").size()<1){
									$('#shr-multiRow-empty2').show();
								}
							}
				   	  	});	
				   	   
			       });
			   });
			   //查看
			   $('div[id^=holidayPolicySet_div] a[name=view2]').live('click',function(){
			   	    var billId=$(this).attr('value');
			   	  	globalOO.reloadPage({
						uipk: 'com.kingdee.eas.hr.ats.app.HolidayPolicy4Set.form',
						relatedFieldId: billId,
						onlyView:true,
						method: 'initalizeData'
					});
			   });
			}else{
			   $('#shr-multiRow-empty2').show();
			}
		}
    });
	
}


function renderAtsShift(){
	$('div[id^=atsShift_div]').remove();
	
	//获得数据
	var attendanceCenterId=$('#form #id').val()||'';
	var data = {
			attendanceCenterId:attendanceCenterId,
			uipk:"com.kingdee.eas.hr.ats.app.AttendanceCenter.form"
	};
	shr.doAjax({
		url: shr.getContextPath()+"/dynamic.do?method=getAtsShifts",
		dataType:'json',
		type: "POST",
		data: data,
		success: function(response){ 
			var rst= response||"{}";
			
			if(rst.records!=null&&rst.records>0){//rst.rows
				$('#shr-multiRow-empty3').hide();
				var i=0;
				for(i=0; i<rst.rows.length;i++){
					 var row=rst.rows[i];
						
					 var rowStr=' <div id="atsShift_div'+i+'" class="view_mainPage row-fluid"> '
					+' 	<div class="span12 offset0 " id=""> '
					+' 			<div class="form-horizontal" id="atsShift_form'+i+'" action="" novalidate="novalidate"> '
					+'                   <input type="hidden" id="id" name="id" value="'+row.id+'" /> '
					+' 				<div id="atsShift_tooldiv'+i+'" class="row-fluid row-block "> '
					+' 					<div class="span12 offset0 " id=""> '
					+' 						<span class="" style="float:right">				 '
					+' 							<button onclick="" class="shrbtn-primary shrbtn" id="addNew3" name="addNew3" type="button">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_15
						 + '</button> '
					+' 							<button onclick="" class="shrbtn-primary shrbtn" id="delete3" name="delete3" type="button">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_13
						 + '</button> '
					+' 				        </span> '
					+' 					</div> '
					+' 		  	    </div> '
					+' 				<div id="" class="row-fluid row-block ">	 '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_1
						 + '" class="field_label">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_1
						 + '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> '
					+' 									<span id="number" class="field_input" value="'+row.rnumber+'">'+row.rnumber+'</span> '
					+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_6
						 + '" class="field_label">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_6
						 + '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> '
					+' 									<span id="name" class="field_input" value="'+row.rname+'">'+row.rname+'</span> '
					+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 			  </div> '
					+' 		  	<div id="" class="row-fluid row-block ">	 '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_14
						 + '" class="field_label">'
						 + jsBizMultLan.atsManager_attendanceCenterEdit_i18n_14
						 + '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> ';
					
					if(row.isDefault){
						rowStr=rowStr+'<input type="radio" name="isDefault" checked="true"/> ';
					}else{
						rowStr=rowStr+'<input type="radio" name="isDefault" /> ';
					}
											  
					rowStr=rowStr+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 					<div data-ctrlrole="labelContainer"> '
					+' 						<div class="span2"> '
					+' 							<div title="'
						+ jsBizMultLan.atsManager_attendanceCenterEdit_i18n_3
						+ '" class="field_label">'
						+ jsBizMultLan.atsManager_attendanceCenterEdit_i18n_3
						+ '</div> '
					+' 						</div> '
					+' 						<div class="span3 field-ctrl"> '
					+' 							<a style="text-decoration:underline;" class="attencePolicyActClass" name="view3" value="'+row.rid+'"  href="javascript:void(0);">'
						+ jsBizMultLan.atsManager_attendanceCenterEdit_i18n_3
						+ '</a> '
					+' 						</div> '
					+' 					  <div class="span1 field-desc"> '
					+' 						</div> '
					+' 					</div> '
					+' 			  </div> '
					+' 			</div>  ' /////////
					+' 	</div> '
					+' </div> ' ;
					$('#shr-multiRow-empty3').parent().append(rowStr);
					$('div[id^=atsShift_tooldiv] span').hide();
 
					$('#atsShift_form'+i).hover(function () {
					    //alert(i); // 执行此方法是i的值已经变得很大了。
					    //alert($('#attencePolicy_tooldiv'+i).size());
					    $('div[id^=atsShift_tooldiv] span',this).show();
					  },
					  function () {
					    $('div[id^=atsShift_tooldiv] span',this).hide();
					  }
					);
		
				}//~end of for		
				
			   //为新渲染出来的加上事件
			   //新增
			   $('div[id^=atsShift_tooldiv] [name=addNew3]').live('click',function(){
			      	$("#iframe1").attr("src",shr.getContextPath()+'/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.AtsShift4AttendanceCenter.list');
					$("#iframe1").dialog({
				 		 modal: true,
				 		 width:850,
				 		 minWidth:850,
				 		 height:500,
				 		 minHeight:500,
				 		 title:jsBizMultLan.atsManager_attendanceCenterEdit_i18n_0,
				 		 open: function( event, ui ) {
				 		     
				 		 },
				 		 close:function(){
				 		     //绘制
				 		 	renderAtsShift();
				 		 }
			 		});
			    	$("#iframe1").attr("style","width:850px;height:500px;");
			   });
			   //默认
			   $('div[id^=atsShift_div] [name=isDefault]').live('change',function(){
			   	  	var	attCenterAtsShiftId=$('#id' ,$(this).closest("div[id^=atsShift_form]")).val();
			   	  	shr.doAjax({
						url: shr.getContextPath()+"/dynamic.do?method=changeAttCenterAtsShift",
						dataType:'json',
						type: "POST",
						data: {
							attCenterAtsShiftId:attCenterAtsShiftId,
							uipk:"com.kingdee.eas.hr.ats.app.AttendanceCenter.form"
						},
						success: function(response){ }
			   	  	});	
			   });
			   //删除
			   $('div[id^=atsShift_tooldiv] [name=delete3]').live('click',function(){
			       var	attCenterAtsShiftId=$('#id' ,$(this).closest("div[id^=atsShift_form]")).val();
			       var	isDefault=$('input:checked' ,$(this).closest("div[id^=atsShift_form]")).size();
			       if(isDefault>0){
			          shr.showError({message: jsBizMultLan.atsManager_attendanceCenterEdit_i18n_8});
			          return ;
			       }
			       var topDiv=$(this).closest("div[id^=atsShift_div]");
			       shr.showConfirm(jsBizMultLan.atsManager_attendanceCenterEdit_i18n_12, function(){
				       shr.doAjax({
							url: shr.getContextPath()+"/dynamic.do?method=deleteAttCenterAtsShift",
							dataType:'json',
							type: "POST",
							data: {
								attCenterAtsShiftId:attCenterAtsShiftId,
								uipk:"com.kingdee.eas.hr.ats.app.AttendanceCenter.form"
							},
							success: function(response){
								var rst= response||"{}";
								if(rst.deleteSuccess){
									topDiv.remove();
								}
								if($("div[id^=atsShift_div]").size()<1){
									$('#shr-multiRow-empty3').show();
								}
							}
				   	  	});	
				   	   
			       });
			   });
			   //查看
			   $('div[id^=atsShift_div] a[name=view3]').live('click',function(){
			   	    var billId=$(this).attr('value');
			   	  	globalOO.reloadPage({
						uipk: 'com.kingdee.eas.hr.ats.app.AtsShift.form',
						billId:billId,
						onlyView:true,
						method: 'view'
					});
			   });
			}else{
			   $('#shr-multiRow-empty3').show();
			}
		}
    });
	
}


function closeFrameDlg(ifameid){
   $('#'+ifameid).dialog('close');
}

