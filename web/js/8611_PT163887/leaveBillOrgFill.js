var _personColl = new Array();
var _personColl_org = new Array();
var _personColl_per = new Array();
var _setType = 1;
shr.defineClass("shr.ats.LeaveBillOrgFill",shr.framework.Edit, {
	initalizeDOM:function(){
		shr.ats.LeaveBillOrgFill.superClass.initalizeDOM.call(this);
		var that = this ;
		that.initShowPage(); // 初始化页面
		that.addPageListener();  // 添加各个按钮的 响应事件

		//	$("#hrOrgUnit_el").val($(window.parent.document).find("#hrOrgUnit_el").val() );
		//	$("#hrOrgUnit").val($(window.parent.document).find("#hrOrgUnit").val());
		$("#hrOrgUnit").shrPromptBox("setValue", { id: $(window.parent.document).find("#hrOrgUnit_el").val(), name: $(window.parent.document).find("#hrOrgUnit").val() });
		//添加 还剩多少人可选 html 代码
		/*var obj= $(window.parent.document.getElementById('entries')).jqGrid("getRowData");
		jQuery(obj).each(function(n){
			var a = 0 ;
			this.person;
		});*/
		/*
		var object = $('#proposer');
				object.live("change", function(){
					/*
					var info = object.shrPromptBox('getValue');
					var names = [],personIds = [];
					
					var personCollTemp = new Array();
					for(var i=0;i<info.length;i++){
						//当名称或者编号或者人员没有主键没有时，代表非法用户，不查询
						var name = info[i]["person.name"];
						var number = info[i]["person.number"];
						var personId = info[i]["person.id"];
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
							//numbers.push(number);
							personIds.push(personId);
							var person_obj = { id : personId ,name : name  }; 
							personCollTemp.push(person_obj);
						}
					}
					
					$('#proposer').val(names.join(','));
					$('#proposer_el').val(personIds.join(','));
					//$('#proposer_number').val(numbers.join(','));
					_personColl_per = personCollTemp ; 
					//将 组织的人员 和 人员选中的人员 集合起来
					_personColl = _personColl_per.concat(_personColl_org);
					that.showAmount();
				
				});
			*/	
			
			/*
			$('#adminOrgUnit').live("change", function(){
			
					var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsLeaveBillBatchEditHandler&method=getPersonsByOrgUnit";  
					shr.ajax({
						type:"post",
						async:false,
						url:url,
						data:{orgUnitId:$('#adminOrgUnit_el').val()},
						success:function(res){
							info =  res;
							var personColl = jQuery.parseJSON(info.personColl);
							_personColl_org = personColl ;
							//将 组织的人员 和 人员选中的人员 集合起来
							_personColl = _personColl_per.concat(_personColl_org);
							that.showAmount();
								
					    }
					});
			
				});
		*/
		that.initHROrgUnitValueToPerson();
		that.setPolicyValue();
		$("#setType").val(1);
		
	},initHROrgUnitValueToPerson : function(){
		var hrOrgUnit_el = $("#hrOrgUnit_el").val();
		if(hrOrgUnit_el != null && hrOrgUnit_el != ""){
			$("#proposer").shrPromptBox().attr("data-params",hrOrgUnit_el);
		}
	},
	initShowPage : function(){
		//添加 还剩多少人可选 html 代码
		var _html = '<div class="row-fluid row-block " style="text-align: center" id=""><span>'
			+ jsBizMultLan.atsManager_leaveBillOrgFill_i18n_2
			+ '&nbsp;</span><span id ="setType1" style = "color:red">'
			+ jsBizMultLan.atsManager_leaveBillOrgFill_i18n_3
			+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span id ="setType2" style = "color:blue;display:none">'
			+ jsBizMultLan.atsManager_leaveBillOrgFill_i18n_1
			+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span >'
			+ jsBizMultLan.atsManager_leaveBillOrgFill_i18n_4
			+ '&nbsp;&nbsp;</span><span id = "remain">100</span><span>&nbsp;&nbsp;&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_leaveBillOrgFill_i18n_0
			+ '&nbsp;&nbsp;</span><span id = "checkAmount">0</span></div>';
		$('#hrOrgUnit').parents('div[data-ctrlrole="labelContainer"]').parent().parent().prepend(_html);
		var  hasAddNum = $(window.parent.document.getElementById("hasNum")).val(); 
		$('#remain').text(100 - hasAddNum);
		$(".row-fluid.row-block.view_manager_header.hidden-print").remove();
		$("#setType1").attr({"data-toggle":"tooltip","data-placement":"left","title":jsBizMultLan.atsManager_leaveBillOrgFill_i18n_6});
		$("#setType2").attr({"data-toggle":"tooltip","data-placement":"left","title":jsBizMultLan.atsManager_leaveBillOrgFill_i18n_5});
		$('#setType1').css({'cursor':'pointer'});
		$('#setType2').css({'cursor':'pointer'});
		$("#setType1").parent().parent().parent().css("margin-left","100px");
		$(".ui-timestampPicker-layout").css("width","100%");
	},
	confirmAction: function () {
		// //window.parent.$("#orgFillDiv").parent().parent()
		// var that = window.parent.$("#orgFillDiv")[0];
		// //var that =this;
		// if (that.checkF7Data()) {
		// } else {
		// 	return;
		// }
		// openLoader(1);
		// // 给jqgrid 赋值
		// //获取rowid 算 剩余额度 时长 请假次数 
		// var oldRowIds = $("#entries").getDataIDs();
		// that.fillGrid();
		// var newRowIds = $("#entries").getDataIDs();
		// var rowIds = that.getFillRowId(oldRowIds, newRowIds);
		// $.each(rowIds, function (n, value) {
		// 	that.countRemainLimit(value);
		// 	that.countLeaveLength(value);
		// 	that.countLeaveTimes(value);
		// });
		// //检查不超过100条记录
		// //that.checkRowIsOver();

		// //$(this).dialog("close");
		window.parent.$("#orgFillDiv").dialog("close");
		//closeLoader();


	}
	, addPageListener: function () {
		var that = this;
		var object = $('#proposer');
			object.live("change", function(){  //  员工变化时
					that.changeShowNum();		
			});
			
			$('#adminOrgUnit').live("change", function(){ // 组织变化时
					that.changeShowNum();
			});	
			$('#prop_attencegroup').live("change", function(){ // 组织变化时
					that.changeShowNum();
			});	
			$('#beginTime , #endTime').change(function(){ // 开始时间
				
					that.calculateOtTime();  // 申请加班小时数
			});
			$("span[id^='setType']").click(function(){
				if (_setType == 1) {
					$("#setType1").toggle(500);
					$("#setType2").toggle(500);
					$("#setType").val(2);
					_setType = 2;
					that.changeShowNum();
				}
				else  if (_setType == 2) {
					$("#setType2").toggle(500);
					$("#setType1").toggle(500);
					$("#setType").val(1);
					_setType = 1;
					that.changeShowNum();
				}	
			});
			
		//假期制度
		$('#holidayPolicy').change(function(){
			that.setHolidayTypeValue();
		});
		//假期类型
		/*$('#holidayType').change(function(){
			//that.setHolidayTypeOptionsValue();
		});*/
	}
	,setPolicyValue : function(){
		var srcArr = window.parent.document.getElementById("orgFillDiv").src.split("&");
		var hrOrgUnitID = srcArr[1].substring(12);
		$("#holidayPolicy").shrPromptBox().attr("data-params",hrOrgUnitID);
	}
	,setHolidayTypeValue : function(){
		var holidayPolicy_el = $("#holidayPolicy_el").val();
		$("#holidayType").shrPromptBox().attr("data-params",holidayPolicy_el);
		//$("#holidayType").shrPromptBox("option",{"displayFormat":"{holidayType.name}","submitFormat":"{holidayType.id}","id":"holidayType.id"});
		
	}
	,setHolidayTypeOptionsValue : function(){
		
	}
	,changeShowNum : function(){ // 组织  和姓名 发生变动的时候 则会 改变
		var that = this ;
		var personIds = $('#proposer_el').val() ;
		var _setTypeVal = $("#setType").val();
		if(($('#adminOrgUnit_el').val()!=undefined && $('#adminOrgUnit_el').val()!="") || ($('#prop_attencegroup_el').val()!=undefined && $('#prop_attencegroup_el').val()!="")){  // 没有组织的情况下
//			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsLeaveBillBatchEditHandler&method=getPersonsByOrgUnit";  
//				shr.ajax({
//					type:"post",
//					async:false,
//					url:url,
//					data:{orgUnitId:$('#adminOrgUnit_el').val(),personIds :personIds,setType : _setTypeVal,currentPagePermItemId:shr.getUrlParams().serviceId},
//					success:function(res){
//						info =  res;
//						var personColl = jQuery.parseJSON(info.personColl);
//						var selectMount = personColl.length ;
//						//_personColl_org = personColl ;
//						//将 组织的人员 和 人员选中的人员 集合起来
//						//_personColl = _personColl_per.concat(_personColl_org);
//						that.showAmount(selectMount);
//				    }
//				});
				var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsLeaveBillBatchEditHandler&method=getPersonsCountByOrgUnit";  
				shr.ajax({
					type:"post",
					async:false,
					url:url,
					data:{attencegroupId:$('#prop_attencegroup_el').val(),orgUnitId:$('#adminOrgUnit_el').val(),personIds :personIds,setType : _setTypeVal,currentPagePermItemId:shr.getUrlParams().serviceId},
					success:function(res){
						that.showAmount(res.totalCount);
				    }
				});
				
				
		}else if(personIds!=undefined && personIds!=''){
			var len = personIds.split(',').length;
			that.showAmount(len);
		}
	}
	,showAmount : function(selectMount){
		var remain = $('#remain').text() - selectMount;
		//$('#remain').html(100-amount) ;
		if(remain < 0){ 
			$('#checkAmount').css('color','#ff0000');
		}else{
			$('#checkAmount').css('color','');
		}
		$('#checkAmount').text(selectMount);	
	
	}
	,calculateOtTime : function(){
		if(atsMlUtile.getFieldOriginalValue('beginTime')!="" && atsMlUtile.getFieldOriginalValue('endTime')!=""){
			var restTime = 0;
			var strTime = atsMlUtile.getFieldOriginalValue('beginTime') + ":00";
			var startTime =new Date(strTime.replace(/-/g,"/"));
			strTime = atsMlUtile.getFieldOriginalValue('endTime') + ":00";
			var endTime =new Date(strTime.replace(/-/g,"/"));
			var se = endTime.getTime()-startTime.getTime() - (restTime * 1000 * 60); // 毫秒
			var tfl = se/(1 * 60 * 60 *1000) ;  
		    atsMlUtile.setTransNumValue('leaveLength',tfl.toFixed(atsMlUtile.getSysDecimalPlace()));
		}
		
	
	}
	
	
})
