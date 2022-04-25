var _personColl = new Array();
var _personColl_org = new Array();
var _personColl_per = new Array();
var _setType = 1;
shr.defineClass("shr.ats.FillSignOrgFill",shr.framework.Edit, {
	initalizeDOM:function(){
		shr.ats.FillSignOrgFill.superClass.initalizeDOM.call(this);
		var that = this ;
		that.initShowPage(); // 初始化页面
		that.addPageListener();  // 添加各个按钮的 响应事件
		$("#bill_hrOrgUnit_el").val($(window.parent.document).find("#hrOrgUnit_el").val() );
		$("#bill_hrOrgUnit").val($(window.parent.document).find("#hrOrgUnit").val());
		that.initHROrgUnitValueToPerson();
		that.setPolicyValue();
		$("#setType").val(1);
		that.initReson();
		that.fixStyle();
	},initReson : function(){
		var hrOrgUnitId=$("#bill_hrOrgUnit_el").val();
	  	if(hrOrgUnitId){
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
					$("#reason").val(response.rows[0]["reason.name"]);
		  	  		$("#reason_el").val(response.rows[0]["reason.id"]);
				}
			});
	  	}
		
		$('#person').shrPromptBox("option", {
			onchange : function(e, value) {
				var personList = value.current;
				var personNumsStr = "";
				if(personList.length > 0){
					$.each(personList,function(index,item){
						personNumsStr += item["person.number"] + ",";
					});
					personNumsStr = personNumsStr.substring(0,personNumsStr.length - 1);
				}
				$('#person_number').val(personNumsStr);
			}
		});
	}
	,initHROrgUnitValueToPerson : function(){
		var hrOrgUnit_el = $("#bill_hrOrgUnit_el").val();
		if(hrOrgUnit_el != null && hrOrgUnit_el != ""){
			$("#person").shrPromptBox().attr("data-params",hrOrgUnit_el);
		}
	},
	initShowPage : function(){
		//添加 还剩多少人可选 html 代码
		var _html = '<span>'
			+ jsBizMultLan.atsManager_FillSignOrgFill_i18n_2
			+ '&nbsp;</span><span id ="setType1" style = "color:red">'
			+ jsBizMultLan.atsManager_FillSignOrgFill_i18n_3
			+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span id ="setType2" style = "color:blue;display:none">'
			+ jsBizMultLan.atsManager_FillSignOrgFill_i18n_1
			+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span >'
			+ jsBizMultLan.atsManager_FillSignOrgFill_i18n_4
			+ '&nbsp;&nbsp;</span><span id = "remain">100</span><span>&nbsp;&nbsp;&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_FillSignOrgFill_i18n_0
			+ '&nbsp;&nbsp;</span><span id = "checkAmount">0</span>';
		//$('#otDate').parents('div[data-ctrlrole="labelContainer"]').parents().eq(0).children().eq(1).html(_html);
		$('#head').html(_html);
		var  hasAddNum = $(window.parent.document.getElementById("hasNum")).val(); 
		$('#remain').text(100 - hasAddNum);
		$(".row-fluid.row-block.view_manager_header.hidden-print").remove();
		$("#setType1").attr({"data-toggle":"tooltip","data-placement":"left","title":jsBizMultLan.atsManager_FillSignOrgFill_i18n_6});
		$("#setType2").attr({"data-toggle":"tooltip","data-placement":"left","title":jsBizMultLan.atsManager_FillSignOrgFill_i18n_5});
		$('#setType1').css({'cursor':'pointer'});
		$('#setType2').css({'cursor':'pointer'}); 
	},
	confirmAction: function () {
		window.parent.$("#orgFillDiv").dialog("close");
	}
	, addPageListener: function () {
		var that = this;
		var object = $('#person');
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
		//假期制度
		$('#prop_attencegroup').change(function(){
			that.setAttencegroupValue();
		});
		//假期类型
		/*$('#holidayType').change(function(){
			//that.setHolidayTypeOptionsValue();
		});*/
		if ($('#fillCardTimeStr').length) {
            $('#fillCardTimeStr').on("blur",function(e) {
                var formatValue=$('#fillCardTimeStr').val().trim().replace("：",":");//去掉前后空格，符号转换
				var fillCardTimeString = that.transformToFillCardTimeStr(formatValue);
				var res = that.fillCardTimeStrVerify(fillCardTimeString);
                if (!res) {
                    $('#fillCardTimeStr').val("");
                } else {
                    $('#fillCardTimeStr').val(fillCardTimeString);
                }
            })
        }
	}
	//严格判断是否是hh:mm的格式（24小时制）
    ,fillCardTimeStrVerify:function(value){
        var v=value||'';
        if(/(([0-1]\d)|(2[0-4])):[0-5]\d/.test(v)&&v.length==5){
            var h=new Number(v.substr(0,2));
            if(h<24)
                return true;
            else
                return false;
        }else{
            return false;
        }
    }
	
	//转换成hh:mm的格式（24小时制）
	,transformToFillCardTimeStr:function(value){
		var v=value||'';
	    if (/[0-5][0-9][0-5][0-9]/.test(v) && v.length == 4) {
            v = value.substring(0, 2) + ":" + value.substring(2, 4);
        }
        if ((/[0-2][0-9]:[0-5][0-9]/.test(v) && v.length == 5) || (/[0-2][0-9]：[0-5][0-9]/.test(v) && v.length == 5)) {
            var h = new Number(v.substr(0, 2));
            if (h < 24) {
                 return v;
            }
        }
	}
	,setPolicyValue : function(){
		var srcArr = window.parent.document.getElementById("orgFillDiv").src.split("&");
		var hrOrgUnitID = srcArr[1].substring(12);
		$("#holidayPolicy").shrPromptBox().attr("data-params",hrOrgUnitID);
	}
	,setAttencegroupValue : function(){
		var attencegroup = $("#prop_attencegroup_el").val();
		$("#prop_attencegroup").shrPromptBox().attr("data-params",attencegroup);
		//$("#holidayType").shrPromptBox("option",{"displayFormat":"{holidayType.name}","submitFormat":"{holidayType.id}","id":"holidayType.id"});
		
	},setHolidayTypeValue : function(){
		var holidayPolicy_el = $("#holidayPolicy_el").val();
		$("#holidayType").shrPromptBox().attr("data-params",holidayPolicy_el);
		//$("#holidayType").shrPromptBox("option",{"displayFormat":"{holidayType.name}","submitFormat":"{holidayType.id}","id":"holidayType.id"});
		
	}
	,setHolidayTypeOptionsValue : function(){
		
	}
	,changeShowNum : function(){ // 组织  和姓名 发生变动的时候 则会 改变
		var that = this ;
		var personIds = $('#person_el').val();
		var hrOrgUnitId = $('#bill_hrOrgUnit_el').val();
		var _setTypeVal = $("#setType").val();
		var attencegroupId=$('#prop_attencegroup_el').val();
		if(($('#adminOrgUnit_el').val()!=undefined && $('#adminOrgUnit_el').val()!="")
		|| ($('#prop_attencegroup_el').val()!=undefined && $('#prop_attencegroup_el').val()!="")){  // 没有组织的情况下
				var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsLeaveBillBatchEditHandler&method=getPersonsCountByOrgUnit";  
				shr.ajax({
					type:"post",
					async:false,
					url:url,
					data:{attencegroupId:$('#prop_attencegroup_el').val(),hrOrgUnitId:hrOrgUnitId,orgUnitId:$('#adminOrgUnit_el').val(),personIds :personIds,setType : _setTypeVal,currentPagePermItemId:shr.getUrlParams().serviceId},
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
	},
	fixStyle: function(){
		$('.group-panel').css('border','0');
		$('.field-desc').css('display','block');
		$('.group-panel').parent().css('margin-left','85px');
		$('#head').css('margin-bottom','20px');
		$('#head').next().next().children().eq(2).remove();
		//col-lg-4过窄
		$('#head').next().find('div[data-ctrlrole="labelContainer"]').removeClass('col-lg-4').addClass('col-lg-8');
		$('#head').next().next().find('div[data-ctrlrole="labelContainer"]').removeClass('col-lg-4').addClass('col-lg-8');
	}
	
	
})
