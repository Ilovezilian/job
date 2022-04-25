shr.defineClass("shr.ats.turnShift",shr.framework.Core, {
	initalizeDOM:function(){
		var that = this;
		$(".view_manager_header").after('<div style="position:relative;color:red;padding-left: 64px;padding-bottom: 4px;top: 48px;background-color: #edeff4;">'
			+ jsBizMultLan.atsManager_turnShift_i18n_13
			+ '</div>');
		$(".view_manager_body").css("height","800px");
		shr.ats.turnShift.superClass.initalizeDOM.call(this);
		$('input[name^=shiftType]').shrRadio();		
		$($(".iradio_minimal-grey")).css("float", "left");		//让文字与radio对齐
		that.initShiftData();
		that.refreshCurrentView();
		that.initEvent(that);
		that.adjustView();
		
	}
	,initShiftData:function(){
		var that = this;
		//设置业务组织缓存值
		var hrOrgUnitObj;
		var globalData = atsGlobalDataCarrier.getData("shr.ats.turnShift");
		if(globalData){
			hrOrgUnitObj = globalData.hrOrgUnit;
		}else{
			hrOrgUnitObj = sessionStorage.getItem("hrOrgUnitStr");
			hrOrgUnitObj && (hrOrgUnitObj = JSON.parse(hrOrgUnitObj));
		}
		$("#hrOrgUnit").shrPromptBox('setValue',hrOrgUnitObj || {});
		atsMlUtile.setTransDateValue("beginDate",atsCommonUtile.formateDate());
		atsMlUtile.setTransDateValue("endDate",atsCommonUtile.getNextMonthBeforeDate());
		globalData && atsArrayUtile.hasElement(globalData.selectedPersons) && setTimeout(function(){
			 addToStaffList(globalData.selectedPersons);
			 workShiftStrategy.rerenderCalandarWhenOnly();
		},300);
	}
	,initEvent:function(){
		var that = this;
		$('input[name^=shiftType]').shrRadio("onChange",function(){
			var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
			var endDate = atsMlUtile.getFieldOriginalValue("endDate");
			if(!atsCommonUtile.validateDateByConfig(beginDate,endDate,{interval:"1M"},false)){
				that.setEndDateWhenOverLimit();
			}
			if(workShiftStrategy.getArrangeShiftType() == workShiftStrategy.SHIFT_TYPE_CALENDAR){
				that.listShift();
			}else if(workShiftStrategy.getArrangeShiftType() == workShiftStrategy.SHIFT_TYPE_LIST){
				that.calendarShift();
			}
		});
		//业务组织发生变化时,考勤业务组织切换后，清空所有选的员工和排班数据。日历式清空选中的员工和日历中的排班数据，列表式清空排班列表。
		$("#hrOrgUnit").change(function() {
			var flag = that.onValidate();
			var hrOrgUnitObj = $("#hrOrgUnit").shrPromptBox('getValue')
			sessionStorage.setItem("hrOrgUnitStr",JSON.stringify(hrOrgUnitObj));
			flag && that.refreshCurrentView();
			$("#personInfo").html("");
			$("#personInfo").append("<div class='addPersonBox'><p>"
				+ jsBizMultLan.atsManager_turnShift_i18n_1
				+ "</p><button class='btn btn-danger addPerson'><i class='icon-plus icon-large'></i>"
				+ jsBizMultLan.atsManager_turnShift_i18n_0
				+ "</button></div>")
			$("#personInfo").addClass("noPerson")
			$(".addPerson").off("click").on("click",function(){
				shr.ats.turnShift.prototype.selectPersonAction()
			})
			$(".field_list").find(".text-tag").remove();
		});
	
		$("#beginDate").focus(function(){
			that.strBeginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		}).change(function() {
			!that.onValidate() && that.setEndDateWhenOverLimit();
			that.refreshCurrentView();
		});
		$("#endDate").focus(function(){
			that.strEndDate = atsMlUtile.getFieldOriginalValue("endDate");
		}).change(function() {
			!that.onValidate() && that.setEndDateWhenOverLimit();
			that.refreshCurrentView();
		});	
	}
	,setEndDateWhenOverLimit : function(){
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		atsCommonUtile.showWarning(jsBizMultLan.atsManager_turnShift_i18n_12);
		atsMlUtile.setTransDateValue("endDate",atsCommonUtile.getNextMonthBeforeDate(beginDate));
	}
	//业务组织F7是否读缓存：从未排班列表过来的不要，从其他地方过来的要
	,hrOrgWriteCacheable:function(){
		var globalData = atsGlobalDataCarrier.getData("shr.ats.turnShift");
		return globalData && globalData.hrOrgUnit ? false : true;
	}
	,onValidate:function(){
		var beginDate = atsMlUtile.getFieldOriginalValue("beginDate");
		var endDate = atsMlUtile.getFieldOriginalValue("endDate");
		return atsCommonUtile.validateDateByConfig(beginDate,endDate,{smallName:jsBizMultLan.atsManager_turnShift_i18n_5,
			bigName:jsBizMultLan.atsManager_turnShift_i18n_4,interval:"1M"},true);
	}	
	,refreshCurrentView : function(){
		var that = this;
		if(workShiftStrategy.getArrangeShiftType() == workShiftStrategy.SHIFT_TYPE_CALENDAR){
			that.calendarShift();
		}else if(workShiftStrategy.getArrangeShiftType() == workShiftStrategy.SHIFT_TYPE_LIST){
			that.listShift();
		}else if(workShiftStrategy.getArrangeShiftType() == workShiftStrategy.SHIFT_TYPE_NOSHIFT){
			that.listShift();
		}
		
	}
	,listShift:function(){
		var that = this;
		$('#calendar').css('display','none');
		$("#list").children().remove();
		$("#list").append($('<table id="list_info"></table>'));
		$('#list').css('display','block');
		that.displayBtn(true);
		listWorkShift.renderListTable({personNums : workShiftStrategy.getSelectedStaffNum()});
	}
	,calendarShift:function(){
		var that = this;
		$('#list').css('display','none');
		$('#calendar').css({'display':'block','width':'50%'});
		$('#monthInfo').html(atsCommonUtile.formateNum(workShiftStrategy.getBeginDate(true).getMonth() + 1));
		$('#yearInfo')
			.html(workShiftStrategy.getBeginDate(true).getFullYear() + jsBizMultLan.atsManager_turnShift_i18n_7 );
		that.displayBtn();
		initPersonList();  //初始化人员列表
		listWorkShift.delArrangingData();
		calandarWorkShift.initCalandar(true);
		workShiftStrategy.rerenderCalandarWhenOnly();
	}
	,displayBtn: function(isListWorkShift){
		if(isListWorkShift){
			$("#turnShiftAddForCal").hide();
			$(".btn-group").show();
			$("#delete").show();
			$("#clearSelectPerson").hide();
		}else{
			$("#turnShiftAddForCal").show();
			$(".btn-group").hide();
			$("#delete").hide();
			$("#clearSelectPerson").show();
		}
	}
    ,deleteAction:function(){
    	
    	var selectedIds = listWorkShift.getCheckedRowIds();
    	if(!selectedIds || selectedIds.length == 0){
    		atsCommonUtile.showWarning(jsBizMultLan.atsManager_turnShift_i18n_9);
    		return;
    	}
    	listWorkShift.deleteRow(selectedIds);
    }
    ,clearSelectPersonAction:function(){
    	if(workShiftStrategy.getArrangeShiftType() != workShiftStrategy.SHIFT_TYPE_CALENDAR){
    		return;
    	}
    	$(".field_list").html("");
    	$("#personInfo").html("<div class='addPersonBox'><p>" + jsBizMultLan.atsManager_turnShift_i18n_50 + "</p><button class='btn btn-danger addPerson'><i class='icon-plus icon-large'></i> " + jsBizMultLan.atsManager_turnShift_i18n_51 + "</button></div>");
		$("#personInfo").addClass("noPerson");
		$(".addPerson").off("click").on("click",function(){
			shr.ats.turnShift.prototype.selectPersonAction();
		});
		workShiftStrategy.rerenderCalandarWhenOnly();
		/*$('.text-remove').bind("click", function(){
			var personNum = $(this).parent().attr("id");
			$(".field_list").find(".text-tag").each(function(){
				if(this['id'] == personNum){
					$(this).remove();
				}
			});		
			$(this).parent().remove();
			if(workShiftStrategy.getArrangeShiftType() == workShiftStrategy.SHIFT_TYPE_CALENDAR){
				workShiftStrategy.rerenderCalandarWhenOnly();
			}
			if($(this).parent().parent().children().length==0){
				initPersonList()
			}
		});*/
    }
    ,turnShiftAddAction:function(){
    	if( $(".field_list").html() == ""){
    		atsCommonUtile.showWarning(jsBizMultLan.atsManager_turnShift_i18n_10);
			return;
    	}
    	workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_TURN);
		workShiftStrategy.arrangeWorkShift();
	}
    ,turnShiftAddForCalAction : function(){
    	this.turnShiftAddAction();
    }
    /*
	 * 班次排班
	 */
	,shiftSchedulingAction:function(){
		workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_SCHEDULE);
		workShiftStrategy.arrangeWorkShift(null);
	}
	,arrangeByCopyWorkShiftAction:function(){
		if( $(".field_list").html() == ""){
    		atsCommonUtile.showWarning(jsBizMultLan.atsManager_turnShift_i18n_10);
			return;
    	}
		workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_COPY_SELF);
		workShiftStrategy.arrangeWorkShift();
	}
	,saveAction:function(){
		workShiftStrategy.save();
	}
	//选择人员
	,selectPersonAction: function(){
		var that = this;
		var filelist;
		var serviceId = shr.getUrlRequestParam("serviceId");
		var hrOrgUnitObj = $("#hrOrgUnit").shrPromptBox('getValue');//获取业务组织
		if(!hrOrgUnitObj || $.isEmptyObject(hrOrgUnitObj)){
    		atsCommonUtile.showWarning( jsBizMultLan.atsManager_turnShift_i18n_8);
			return;
    	}
		var url = shr.getContextPath()+"/dynamic.do?method=initalize&uipk=hr.ats.schedulePerson";
		url += '&serviceId='+encodeURIComponent(serviceId);
		url += '&hrOrgUnit='+encodeURIComponent(hrOrgUnitObj.id);
		url += "&beginDate=" + workShiftStrategy.getBeginDate();
		url += "&endDate=" + workShiftStrategy.getEndDate();
		var selectDialog = $("#operationDialog");
		selectDialog.children("iframe").attr('src',url);
		selectDialog.dialog({
	 		autoOpen: true,
			title: jsBizMultLan.atsManager_turnShift_i18n_15,
			width:1100,
	 		minWidth:950,
	 		height:650,
	 		minHeight:650,
			modal: true,
			resizable: true,
			position: {
				my: 'center center',
				at: 'center center',
				of: window
			},
			open : function(){
				filelist = [];
				var title;
				$(".field_list").find(".text-tag .text-label").each(function(){
					title = $(this).attr("title");
					var info = title.replace(/\s*[\[\]]/g,"#@#").split("#@#");
					filelist.push({personNum : info[1],personName:info[0]})
				});
			},
			close : function(){
				//如果不是通过选择人员窗口的确定按钮关闭该对话框需要将后选择的员工去除
				if(sessionStorage.getItem("flag")=="true"){
					
				}else{
					$(".field_list").find(".text-tag").remove();
				}
				addToStaffList(filelist);
				that.refreshCurrentView();
				sessionStorage.removeItem("flag"); 
			}
		});
	}
	,selectPersonByAtsGroupAction:function(){
		var that = this;
		$("body").append("<div id='prop_attencegroup' style='display:none'></div>")
		var option = {title:jsBizMultLan.atsManager_turnShift_i18n_6,name:"atsGroup",uipk:"com.kingdee.eas.hr.ats.app.AttenceGroup.AvailableList.F7",bizFilterFields:"hrOrgUnit"};
		option.onclikFunction = function(ids){
			var url = shr.getContextPath()+ "/dynamic.do?method=getGridData";
			var sendDatas ={
				handler:"com.kingdee.shr.ats.web.handler.SpecialShiftHandler",
				beginDate:"1971-1-1",
				endDate:"2099-12-31",
				serviceId : shr.getUrlRequestParam("serviceId"),
				hrOrgUnitId: workShiftStrategy.getHrOrgUint(),
				page:1,
				rows:500,
				attenceGroupId:$("#list2").jqGrid('getRowData',ids)["BaseInfo.id"],
				sidx:"personNum",
				sord:"asc"
			}
			$.ajax({
				type:"POST",
				url:url,
				data:sendDatas,
				async:true,
				success:function(serverData){
					if(serverData.rows.length > 0){
						addToStaffList(serverData.rows);
						that.refreshCurrentView();
					}else{
						atsCommonUtile.showWarning(jsBizMultLan.atsManager_turnShift_i18n_3);
					}
				},
				error:function(serverData){
					atsCommonUtile.showError(jsBizMultLan.atsManager_turnShift_i18n_2,null,serverData);
				}
			});
		}
		atsCommonUtile.createSpecialF7($("#prop_attencegroup"),option);
	},
	adjustView:function () {
		if (window.contextLanguage == "en_US") {
			$("#setTime").find('span').eq(0).css("margin-right","160px");
			$(".photoCtrlRadio").eq(0).css({"margin-left":"-2%","width":"20%"});
			$("#setType").find('[for="shiftType2"]').css("width","100px");
		}else{
			$(".photoCtrlRadio").eq(0).css({"margin-left":"-10%","width":"20%"});
		}
		$("#setTime").css("height","auto");
		$($('#setHrOrgUnit').children()[1]).css("padding","15px 0 0 30px");
		$($('#setTime').children()[1]).css("padding","15px 0 0 30px");
	}
});

//初始化人员信息
function initPersonList(){
	var field_list = $(".field_list").find(".text-tag");		
	var persons = [];
	$("#personInfo").empty();
	$("#personInfo").css({"overflowX":"auto"})
	if((field_list != undefined && field_list.length > 0)){
		$("#personInfo").removeClass("noPerson")
		field_list.each(function(index){
			persons.push($(this).attr('id'));
			$("#personInfo").append($(this).outerHTML());
			
		});
	}else{
		$("#personInfo").append("<div class='addPersonBox'><p>"
			+ jsBizMultLan.atsManager_turnShift_i18n_1
			+ "</p><button class='btn btn-danger addPerson'><i class='icon-plus icon-large'></i>"
			+ jsBizMultLan.atsManager_turnShift_i18n_0
			+ "</button></div>")
		$("#personInfo").addClass("noPerson")
		$(".addPerson").off("click").on("click",function(){
			shr.ats.turnShift.prototype.selectPersonAction()
		})
	}
	$('.text-remove').bind("click", function(){
		var personNum = $(this).parent().attr("id");
		$(".field_list").find(".text-tag").each(function(){
			if(this['id'] == personNum){
				$(this).remove();
			}
		});		
		$(this).parent().remove();
		if(workShiftStrategy.getArrangeShiftType() == workShiftStrategy.SHIFT_TYPE_CALENDAR){
			workShiftStrategy.rerenderCalandarWhenOnly();
		}
		if($(this).parent().parent().children().length==0){
			initPersonList()
		}
	});
	
}

function addToStaffList(staffList,removeSelectedStaff){
	var selectedStaffNum = [],isCountOutOfBound;
	var listSelect = ".field_list";
	if(removeSelectedStaff){
		$(listSelect).empty();
	}else{
		$(listSelect).find(".text-tag").each(function(index,value){
			selectedStaffNum.push(value["id"]);
		});
	}
	if(staffList && staffList.length > 0){
		var restCount = 500 - selectedStaffNum.length;
		selectedStaffNum.length == 0 && (selectedStaffNum = []);
		staffList.forEach(function(person){
			if(restCount > 0){
				if(atsArrayUtile.indexOf(selectedStaffNum,person.personNum) == -1){
					restCount--;
					selectedStaffNum.push(person.personNum);
					var showText = person.personName+"[" + person.personNum + "]";
					$(listSelect).append('<div class="text-tag" id="'+person.personNum+ '">'
				 		+ '<span class="text-label" title="' + showText+  '">' + showText + '</span>'
				 		+ '<span class="text-remove" title="'
						+ jsBizMultLan.atsManager_turnShift_i18n_11
						+ '" style="display:"";">x</span>'
				 	+'</div>');
				}
			}else{
				isCountOutOfBound = true;
			}
		});
		$(listSelect + ' .text-remove').bind("click", function(){
			var personNum = $(this).parent().attr("id");
			$(listSelect).find(".text-tag").each(function(){
				if(this['id'] == personNum){
					$(this).remove();
				}
			});		
			$(this).parent().remove();
		});
		isCountOutOfBound && atsCommonUtile.showWarning(jsBizMultLan.atsManager_turnShift_i18n_14);
	}
	initPersonList();
}
