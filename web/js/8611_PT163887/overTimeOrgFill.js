var _personColl = new Array();
var _personColl_org = new Array();
var _personColl_per = new Array();
var _setType = 1;
shr.defineClass( "shr.ats.OverTimeOrgFill",shr.framework.Edit, {
		initalizeDOM:function(){
			shr.ats.OverTimeOrgFill.superClass.initalizeDOM.call(this);
			var that = this ;
			that.initShowPage(); // 初始化页面
			that.addPageListener();  // 添加各个按钮的 响应事件
			
			$("#bill_hrOrgUnit_el").val($(window.parent.document).find("#hrOrgUnit_el").val() );
			$("#bill_hrOrgUnit").val($(window.parent.document).find("#hrOrgUnit").val());
			var hrOrgUnit = $(window.parent.document).find("#hrOrgUnit_el").val() ;
			//this.setF7Funection(hrOrgUnit);
			var hrOrgUnitId = $("#bill_hrOrgUnit_el").val();
		 	that.initCurrentHrOrgUnit(hrOrgUnitId);
			
			
	},initCurrentHrOrgUnit: function(hrOrgUnitId) {
		var that = this;
		$("#person").shrPromptBox().attr("data-params",hrOrgUnitId);
		that.initQuerySolutionHrOrgUnit(hrOrgUnitId);
	},initQuerySolutionHrOrgUnit: function(hrOrgUnitId) {
		 var that = this;
		 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.CanTripBillEditHandler&method=initQuerySolution";  
					shr.ajax({
						type:"post",
						url:url,
						data:{hrOrgUnitId : hrOrgUnitId},
						success:function(res){
							
					    }
					})
	},
	setF7Funection:function(hrOrgUnit){
		var _self = this;

	  	$('.span').css('width','22.5%');
	  
	   	//加班原因	 
	    var grid_f7_json = {id:"otReason",name:"otReason"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_overTimeOrgFill_i18n_4,uipk:"com.kingdee.eas.hr.ats.app.OverTimeReason.F7",query:""};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrOrgUnit ;		
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_overTimeOrgFill_i18n_8,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		
		var object = $('input[name="otReason"]');
		object.shrPromptBox(grid_f7_json);
		
		//补偿方式
		grid_f7_json = null;
		grid_f7_json = {id:"otCompens",name:"otCompens"};
		grid_f7_json.subWidgetName = 'shrPromptGrid';
		
		grid_f7_json.subWidgetOptions = {title:jsBizMultLan.atsManager_overTimeOrgFill_i18n_2,uipk:"com.kingdee.eas.hr.ats.app.OverTimeCompens.F7",query:""};
		grid_f7_json.validate = '{required:true}';
		grid_f7_json.subWidgetOptions.isHRBaseItem = true;
		grid_f7_json.subWidgetOptions.currentHrOrgUnitId =hrOrgUnit ;		
		grid_f7_json.subWidgetOptions.filterConfig = [{name: "isComUse",value: true,alias: jsBizMultLan.atsManager_overTimeOrgFill_i18n_8,widgetType: "checkbox"}];
		grid_f7_json.subWidgetOptions.f7ReKeyValue = "BaseInfo.id:BaseInfo.name";
		grid_f7_json.subWidgetName = 'specialPromptGrid';
		
		var object = $('input[name="otCompens"]');
		object.shrPromptBox(grid_f7_json);
		
	},
	confirmAction: function () {
		window.parent.$("#orgFillDiv").dialog("close");
	},
	initShowPage : function(){
		//添加 还剩多少人可选 html 代码
		var _html = '<span>'
			+ jsBizMultLan.atsManager_overTimeOrgFill_i18n_3
			+ '&nbsp;</span><span id ="setType1" style = "color:red">'
			+ jsBizMultLan.atsManager_overTimeOrgFill_i18n_5
			+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span id ="setType2" style = "color:blue;display:none">'
			+ jsBizMultLan.atsManager_overTimeOrgFill_i18n_1
			+ '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span><span >'
			+ jsBizMultLan.atsManager_overTimeOrgFill_i18n_7
			+ '&nbsp;&nbsp;</span><span id = "remain">100</span><span>&nbsp;&nbsp;&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_overTimeOrgFill_i18n_0
			+ '&nbsp;&nbsp;</span><span id = "checkAmount">0</span>';
		//$('#otDate').parents('div[data-ctrlrole="labelContainer"]').parents().eq(0).children().eq(1).html(_html);
		$('#head').html(_html);
		var  hasAddNum = $(window.parent.document.getElementById("hasNum")).val(); 
		$('#remain').text(100 - hasAddNum);
		$(".row-fluid.row-block.view_manager_header.hidden-print").remove();
		$("#setType1").attr({"data-toggle":"tooltip","data-placement":"left","title":jsBizMultLan.atsManager_overTimeOrgFill_i18n_10});
		$("#setType2").attr({"data-toggle":"tooltip","data-placement":"left","title":jsBizMultLan.atsManager_overTimeOrgFill_i18n_9});
		$('#setType1').css({'cursor':'pointer'});
		$('#setType2').css({'cursor':'pointer'}); 
	},
	addPageListener : function(){
		var that = this ;
		var object = $('#person');
			object.shrPromptBox("option", {
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
			object.live("change", function(){  //  员工变化时
					that.changeShowNum();		
			});
			
			$('#adminOrgUnit').live("change", function(){ // 组织变化时
					that.changeShowNum();
			});	
			$('#prop_attencegroup').live("change", function(){ // 组织变化时
					that.changeShowNum();
			});	
			$('#otDate').change(function(){  //  加班日期去全局默认的工作日历 来确定加班类型
				var otDay = $(this).val();
				var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsLeaveBillBatchEditHandler&method=getOtTypeByDate";  
					shr.ajax({
						type:"post",
						async:false,
						url:url,
						data:{otDay:otDay},
						success:function(res){
							info =  res;
							if(res.flag == "0"){ // 填充加班类型
								var overTimeInfo = res.record  ;
								var compensInfo = res.compens  ;
								$('#otType').shrPromptBox('setValue',overTimeInfo);
								if(compensInfo!=null || compensInfo!=undefined){
									$('#otCompens').shrPromptBox('setValue',compensInfo);
								}
							}else if(res.flag == "1"){ // 全局的工作日历没有在其范围内
								shr.showWarning({message: "[ "+otDay+" ] " + jsBizMultLan.atsManager_overTimeOrgFill_i18n_6});
							}
					    }
					})
			});
        $("#restStartTime,#restEndTime,#restStartTime2,#restEndTime2").change(function(){//开始休息时间1
            that.disableRestTime();
            if (! that.verifyRestTime(false)){
                return
            }
            calculataRestTime();
        });

			$('#startTime , #endTime ,#restTime').change(function(){ // 开始时间
				
				that.calculateOtTime();  // 申请加班小时数
			});
			/*
			$('#endTime').change(function(){  // 结束时间
				
				that.calculateOtTime();  // 申请加班小时数
			})
			*/
			$("span[id^='setType']").click(function(){
				if (_setType == 1) {
					$("#setType1").toggle(500);
					$("#setType2").toggle(500);
					_setType = 2;
					that.changeShowNum();
				}
				else  if (_setType == 2) {
					$("#setType2").toggle(500);
					$("#setType1").toggle(500);
					_setType = 1;
					that.changeShowNum();
				}	
			});
        function calculataRestTime() {
            var regEx = new RegExp("\\-", "gi"); //i不区分大小写 g匹配所有
            var restTime =0;
            var restStartTime = atsMlUtile.getFieldOriginalValue("restStartTime");
            var restEndTime = atsMlUtile.getFieldOriginalValue("restEndTime");

            if (restStartTime!=undefined && restStartTime!="" && restEndTime!=undefined && restEndTime!="") {
                restStartTime = restStartTime.replace(regEx, "/");
                restEndTime = restEndTime.replace(regEx, "/");
                var startTimeOfDate = new Date(restStartTime);
                var endTimeOfDate = new Date(restEndTime);
                var longTime = endTimeOfDate.getTime() - startTimeOfDate.getTime();
                restTime += longTime / 1000.0 / 60;//分钟
            }

            var restStartTime2 = atsMlUtile.getFieldOriginalValue("restStartTime2");
            var restEndTime2 = atsMlUtile.getFieldOriginalValue("restEndTime2");

            if (restStartTime2!=undefined && restStartTime2!="" && restEndTime2!=undefined && restEndTime2!="") {
                restStartTime2 = restStartTime2.replace(regEx, "/");
                restEndTime2 = restEndTime2.replace(regEx, "/");
                var startTimeOfDate2 = new Date(restStartTime2);
                var endTimeOfDate2 = new Date(restEndTime2);
                var longTime2 = endTimeOfDate2.getTime() - startTimeOfDate2.getTime();
                restTime += longTime2 / 1000.0 / 60;//分钟
            }
            atsMlUtile.setTransNumValue("restTime",restTime,{'decimalPrecision':0});
            that.calculataRealOTTime();

            //that.calculataApplyRestTime();
        }
	},
    calculataRealOTTime : function(){
        var realStartTime = atsMlUtile.getFieldOriginalValue("realStartTime");
        var realEndTime = atsMlUtile.getFieldOriginalValue("realEndTime");
        var restTime = atsMlUtile.getFieldOriginalValue("restTime")||'';
        if( (new String(restTime)).trim()=='' ){
            restTime=0;
            atsMlUtile.setTransNumValue("restTime",0,{'decimalPrecision':0});
        }else{
            restTime=parseFloat(restTime);
            if(restTime<0.0){
                atsMlUtile.setTransNumValue("restTime",0,{'decimalPrecision':0});
                restTime=0.0;
            }
        }
        if ( realStartTime!=""&&realStartTime!=null && realEndTime!=""&&realEndTime!=null ) {
            var regEx = new RegExp("\\-","gi");
            realStartTime = realStartTime.replace(regEx,"/");
            realEndTime = realEndTime.replace(regEx,"/");
            var realStartTimeOfDate = new Date(realStartTime);
            var realEndTimeOfDate = new Date(realEndTime);
            //lzq 加上减去休息时间
            var floatTime = parseFloat( realEndTimeOfDate.getTime() - realStartTimeOfDate.getTime() )/1000.0/60/60 - parseFloat(restTime)/60;;
            if (floatTime <= 0.0) {
                atsMlUtile.setTransNumValue("realOTTime",0);
            }else{
                //t1 = parseFloat(longTime)/1000.0/60/60;\
                var that = this;
                that.getDecimalPlace(floatTime,"realOTTime");
            }
        }
    },
    //获取系统小数位长度
    getDecimalPlace : function (floatTime, otTimeType ) {
        var fixeNum =  atsMlUtile.getSysDecimalPlace();
        floatTime = floatTime.toFixed(fixeNum);
        if(floatTime < 0){
            atsMlUtile.setTransNumValue(otTimeType,0);
        }else{
            atsMlUtile.setTransNumValue(otTimeType,floatTime);
        }
    },
    disableRestTime:function (){
        var restStartTime = atsMlUtile.getFieldOriginalValue("restStartTime");
        var restEndTime = atsMlUtile.getFieldOriginalValue("restEndTime");
        var restStartTime2 = atsMlUtile.getFieldOriginalValue("restStartTime2");
        var restEndTime2 = atsMlUtile.getFieldOriginalValue("restEndTime2");
        if (
            (restStartTime ==undefined || restStartTime=="")
            &&(restStartTime2 ==undefined || restStartTime2=="")
            &&(restEndTime ==undefined || restEndTime=="")
            &&(restEndTime2 ==undefined || restEndTime2=="")
        ){
            $("#restTime").shrTextField("enable");
            atsMlUtile.setTransNumValue("restTime",0,{'decimalPrecision':0});
            this.calculataApplyOTTime();
            this.calculataRealOTTime();
        } else {
            $("#restTime").shrTextField("disable");
        }
    },
    calculataApplyOTTime : function(){
        var startTime = atsMlUtile.getFieldOriginalValue("startTime");
        var endTime = atsMlUtile.getFieldOriginalValue("endTime");
        var restTime = atsMlUtile.getFieldOriginalValue("restTime");
        if( (new String(restTime)).trim()=='' ){
            restTime=0;
            atsMlUtile.setTransNumValue("restTime",0,{'decimalPrecision':0});
        }else{
            restTime=parseFloat(restTime);
            if(restTime<0.0){
                atsMlUtile.setTransNumValue("restTime",0,{'decimalPrecision':0});
                restTime=0.0;
            }
        }

        if ( startTime!=""&&startTime!=null && endTime!=""&&endTime!=null ) {

            var regEx = new RegExp("\\-","gi");
            startTime = startTime.replace(regEx,"/");
            endTime = endTime.replace(regEx,"/");

            var startTimeOfDate = new Date(startTime);
            var endTimeOfDate = new Date(endTime);
            var longTime = endTimeOfDate.getTime() - startTimeOfDate.getTime();
            if (longTime <= 0) {
                atsMlUtile.setTransNumValue("applyOTTime",0);
                //$("#realOTTime").val(0);//时刻根据  实际的止-实际的起-休息通过在调用that.calculataApplyOTTime()后调用that.calculataRealOTTime()来达到的
            }else{
                t1 = parseFloat(longTime)/1000.0/60/60;
                t1 = t1 - parseFloat(restTime)/60;
                var that = this;
                that.getDecimalPlace(t1,"applyOTTime");
            }
        }
    },
        verifyRestTime: function( beforeSubmit){
            var startTime0 = atsMlUtile.getFieldOriginalValue("startTime");
            var endTime0 = atsMlUtile.getFieldOriginalValue("endTime");
            if(startTime0 == "" || startTime0 == undefined){
                shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_2});
                return false;
            }
            if(endTime0 == "" || endTime0 == undefined){
                shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_1});
                return false;
            }
            var startTimeOfDate = new Date(startTime0);
            var endTimeOfDate = new Date(endTime0);
            var restStartTime = atsMlUtile.getFieldOriginalValue("restStartTime");
            var restEndTime = atsMlUtile.getFieldOriginalValue("restEndTime");
            var restStartTime2 = atsMlUtile.getFieldOriginalValue("restStartTime2");
            var restEndTime2 = atsMlUtile.getFieldOriginalValue("restEndTime2");
            var restStartTimeOfDate = new Date(restStartTime);
            var restEndTimeOfDateOfDate = new Date(restEndTime);
            if (restStartTime!=undefined && restStartTime!=""){
                if (restStartTimeOfDate.getTime()<startTimeOfDate.getTime() ||restStartTimeOfDate.getTime()>endTimeOfDate.getTime()){
                    shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_6});
                    return false;
                }
            }
            if (restEndTime!=undefined && restEndTime!="") {
                if (restEndTimeOfDateOfDate.getTime() < startTimeOfDate.getTime() || restEndTimeOfDateOfDate.getTime() > endTimeOfDate.getTime()
                    ||restEndTimeOfDateOfDate.getTime() < restStartTimeOfDate.getTime()) {
                    shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_3});
                    return false;
                }
            }
            var restStartTimeOfDate2 = new Date(restStartTime2);
            var restEndTimeOfDateOfDate2 = new Date(restEndTime2);
            if (restStartTime2!=undefined && restStartTime2!=""){
                if (restStartTimeOfDate2.getTime()<startTimeOfDate.getTime() ||restStartTimeOfDate2.getTime()>endTimeOfDate.getTime()){
                    shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_8});
                    return false
                }
            }
            if (restEndTime2!=undefined && restEndTime2!="") {
                if (restEndTimeOfDateOfDate2.getTime() < startTimeOfDate.getTime() || restEndTimeOfDateOfDate2.getTime() > endTimeOfDate.getTime()
                    ||restEndTimeOfDateOfDate2.getTime() < restStartTimeOfDate2.getTime()){
                    shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_4});
                    return false;
                }
            }
            if( (restStartTime!="" && restStartTime!=undefined && (restEndTime==""||restEndTime==undefined))
                || (restEndTime!="" && restEndTime!=undefined && (restStartTime==""||restStartTime==undefined))
            )
            {
                if (beforeSubmit){
                    shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_5});
                }
                return false;
            }
            if( (restStartTime2!="" && restStartTime2!=undefined && (restEndTime2==""||restEndTime2==undefined))
                || (restEndTime2!="" && restEndTime2!=undefined && (restStartTime2==""||restStartTime2==undefined))
            )
            {
                if (beforeSubmit) {
                    shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_7});
                }
                return false;
            }
            if (restStartTime != "" && restStartTime != undefined && restStartTime2 != "" && restStartTime2 != undefined) {
                //两个加班休息时间都填了，那么判断不能交叉
                if((restStartTimeOfDate.getTime()<restEndTimeOfDateOfDate2.getTime() && restStartTimeOfDate.getTime()>=restStartTimeOfDate2.getTime())
                    ||(restStartTimeOfDate2.getTime()<restEndTimeOfDateOfDate.getTime() && restStartTimeOfDate2.getTime()>=restStartTimeOfDate.getTime())
                ){
                    shr.showInfo({message: jsBizMultLan.atsManager_atsOverTimeBillEdit_26952836_i18n_0});
                    return false;
                }
            }
            return true;
        }
	// 组织  和姓名 发生变动的时候 则会 改变
	,changeShowNum : function(){
		var that = this ;
		var personIds = $('#person_el').val();
		var hrOrgUnitId = $('#bill_hrOrgUnit_el').val();
		if(($('#adminOrgUnit_el').val()!=undefined && $('#adminOrgUnit_el').val()!="") || ($('#prop_attencegroup_el').val()!=undefined && $('#prop_attencegroup_el').val()!="")){  // 没有组织的情况下
			var currentPagePermItemId= that.currentPagePermItemId;
			var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsLeaveBillBatchEditHandler&method=getPersonsByOrgUnit";  
				shr.ajax({
					type:"post",
					async:false,
					url:url,
					data:{attencegroupId:$('#prop_attencegroup_el').val(),hrOrgUnitId:hrOrgUnitId, orgUnitId:$('#adminOrgUnit_el').val(),personIds :personIds,setType : _setType,currentPagePermItemId:currentPagePermItemId},
					success:function(res){
						info =  res;
						var personColl = jQuery.parseJSON(info.personColl);
						var selectMount = personColl.length ;
						//_personColl_org = personColl ;
						//将 组织的人员 和 人员选中的人员 集合起来
						//_personColl = _personColl_per.concat(_personColl_org);
						that.showAmount(selectMount);
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
	,calculateOtTime :function(){  // 申请加班小时数
		if(atsMlUtile.getFieldOriginalValue('startTime')!="" && atsMlUtile.getFieldOriginalValue('endTime')!=""){
			var restTime = 0;
			var restVal = atsMlUtile.getFieldOriginalValue('restTime');
			if(restVal!="" && (/^[0-9]*$/.test(restVal))){
				restTime = atsMlUtile.getFieldOriginalValue('restTime');
			}
			var strTime = atsMlUtile.getFieldOriginalValue('startTime')+":00";
			var startTime =new Date(strTime.replace(/-/g,"/"));
			
			strTime = atsMlUtile.getFieldOriginalValue('endTime')+":00";
			var endTime = new Date(strTime.replace(/-/g,"/"));;
			
			var se = endTime.getTime()-startTime.getTime() - (restTime * 1000 * 60); // 毫秒
			var tfl = se/(3600*1000) ;  
		    atsMlUtile.setTransNumValue('applyOTTime',tfl.toFixed(atsMlUtile.getSysDecimalPlace()));
		}
		
	}
})
