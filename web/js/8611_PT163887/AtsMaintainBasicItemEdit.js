shr.defineClass("shr.ats.AtsMaintainBasicItemEdit", shr.shrBaseData.maintain.MaintainEdit, {
	initalizeDOM : function () {
		shr.ats.AtsMaintainBasicItemEdit.superClass.initalizeDOM.call(this);
		this.initalize();
		var currentUipk = jsBinder.uipk;
		$('[title="' 
				+jsBizMultLan.atsManager_AtsMaintainBasicItemEdit_i18n_5 
				+ '"]').attr('title', 
						jsBizMultLan.atsManager_AtsMaintainBasicItemEdit_i18n_3);
        $('[title="' 
        		+ jsBizMultLan.atsManager_AtsMaintainBasicItemEdit_i18n_8 
        		+ '"]').attr('title', 
        				jsBizMultLan.atsManager_AtsMaintainBasicItemEdit_i18n_7);
	}
	,initalize : function(){
	
		var that = this ;
		if(that.getOperateState() == 'ADDNEW'){
			$('#otherInfo').hide();
		}
		
		if(that.getOperateState() != 'VIEW'){
			$('#isSysPreset').shrCheckbox('disable');
			//if($('#state_el').val() == 1){
			  $('#state').shrSelect('disable');
			//}
			  
			//业务行政F7传参数业务组织，按行政组织管理关系表过滤数据
			$("input[name='adminOrgUnit']").shrPromptBox("option",{ verifyBeforeOpenCallback:function(e,v){
					if($("#hrOrgUnit_el").val()==""||$("#hrOrgUnit_el").val()==undefined){
						shr.showInfo({message: jsBizMultLan.atsManager_AtsMaintainBasicItemEdit_i18n_6});
						return false;
					}else{
						$("input[name='adminOrgUnit']").shrPromptBox().attr("data-params",$("#hrOrgUnit_el").val());						
					}
				}
			});
		}
		
	}
	,backAction:function(){
		var model = jsBinder.view_model;
		var currentUipk = jsBinder.uipk;
		if(currentUipk == model+".form"){
			toUipk = model+'.list';
		}else{
			toUipk = model+'.AvailableList';
		}
		
	 	this.reloadPage({
			uipk: toUipk
		});
	}
	,addCaptionDiv: function() {
		var that = this;
		//if($('#isDefault').closest(".row-fluid").eq(0).children('div[data-ctrlrole="labelContainer"]').length<2){
/* 			$('#isDefault').closest(".row-fluid").eq(0).append('<div data-ctrlrole="labelContainer">'
																+'<div class="col-lg-4">'
																+'<div class="field_label" title="取卡规则说明"><a id = "caption" href="#">取卡规则说明</a></div>'
																+'</div></div>'); */
	    	$('div[title="' 
	    			+ jsBizMultLan.atsManager_AtsMaintainBasicItemEdit_i18n_0 
	    			+ '"]').closest(".row-fluid").eq(0).append('<div data-ctrlrole="labelContainer">'
																+'<div >'
																+'<div class="field_label" title="' 
																+ jsBizMultLan.atsManager_AtsMaintainBasicItemEdit_i18n_2 
																+ '"><a  id = "caption" href="#">' 
																+ jsBizMultLan.atsManager_AtsMaintainBasicItemEdit_i18n_2 
																+ '</a></div>'
																+'</div></div>');
			
			$('#caption').live('click', that.reasonOnClick);
			$('body').append(that.getCaptionDivHtml());
		//}
	}
	,getCaptionDivHtml: function() {		
		return ['<div id="caption_div" class="modal hide fade">',
				    '<div class="modal-header">',
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
						'<h5>' 
						+ jsBizMultLan.atsManager_AtsMaintainBasicItemEdit_i18n_1 
						+ '</h5>',
					'</div>',
					'<div id="caption-content"  class="modal-body">',
					'</div>',
				'</div>'].join('');
	}
	/**
	 * 考勤制度场景示例
	 */
	,reasonOnClick: function() {
        /** 有其它语言再加吧*/
        if ("en_US" == contextLanguage) {
            document.location.href = "/shr/addon/attendmanage/web/resource/atsPolicy_example_EN.docx";
        } else {
            document.location.href = "/shr/addon/attendmanage/web/resource/atsPolicy_example.docx";
        }
//		$('#caption-content').html('异常<li>1、每段早退允许值(分钟)、每段迟到允许值(分钟)：与班次中的浮动值(分)取大计算，比如每段迟到允许值(分钟)设为5，浮动值(分)设为3，二者取大为5，08:00上班，则08:05及之前来不算迟到，08:05之后来才算迟到，早退类似。</li></br>'
//			+'<li>2、旷工起始值(分钟)：与班次中的浮动值(分)取大计算，比如旷工起始值(分钟)设为30，浮动值(分)设为3，二者取大为30，08:00上班，则08:30及之前来不算旷工，08:30之后来才算旷工。</li></br>'
//			+'<li>3、异常类型判断：选项为“按排班和打卡判断”和“按排班、打卡和单据判断”，以示例来说明二者的区别。示例：每段迟到允许值(分钟)为5，旷工起始值(分钟)为30，上午排班08:00-12:00，整段旷工，4h，提请假单08:10-12:00，也就是剩余08:00-08:10这10min异常没有冲销完，若是参数1，则这10min仍然是旷工；若是参数2，则这10min会降级算为迟到。</li></br>'
//			+'请假<li>1、请假进出免打卡：先按照打卡进行正常计算，考勤结果如有空卡的现象，再判断这个参数进行填卡。请假单在前段段次，则请假结束时间填充第一段上班点，如班次8:00~12:00(免) 13:00(免)~17:00，打卡18:00，请假单08:00~11:00，若不勾选该参数，取卡结果为 无~12:00 13:00~18:00，若勾选该参数，取卡结果为11:00~12:00 13:00~18:00（请假单结束时间填充成了上班卡），这样再加上请假单冲销，就不存在异常了。请假单在尾段段次类似。注意以下情况是不做填充的：a、请假单完全包含了班次段；b、班次段完全包含了请假单。</li></br>'
//		+'出差<li>1、出差包含公休日、出差包含法定假日：出差申请时出差天数计算是否包含公休日和法定假日。</li></br>'
//		+'<li>2、出差进出免打卡：先按照打卡进行正常计算，考勤结果如有空卡的现象，再判断这个参数进行填卡。出差单在前段段次，则出差结束时间填充第一段上班点，如班次8:00~12:00(免) 13:00(免)~17:00，打卡18:00，出差单08:00~11:00，若不勾选该参数，取卡结果为 无~12:00 13:00~18:00，若勾选该参数，取卡结果为11:00~12:00 13:00~18:00（出差单结束时间填充成了上班卡），这样再加上出差单冲销，就不存在异常了。出差单在尾段段次类似。注意以下情况是不做填充的：a、出差单完全包含了班次段；b、班次段完全包含了出差单。</li></br>'
//		
//		
//		+'其他<li>1、每周工作时数(小时)：目前不参与考勤内置计算。</li></br>'
//		+'<li>2、每天工作时数(小时)：目前不参与考勤内置计算。</li></br>'
//		+'<li>3、月标准工作天数(天)：目前不参与考勤内置计算。</li></br>'
//		+'<li>4、补签次数控制：按考勤周期做补签次数控制。</li></br>'
//			);
//		$('#caption_div').modal('show');
	}
	
	,addTips:function(){
		var that = this ;
		var descNode;
		var description ="";
		
		//弹性班
//		description = "适用于弹性班，但弹性班的班前、班后加班也是弹性范围加班，以班后加班为例"+"<br></br>"+
//		    "1、全天弹性。标准工时8h，中间休息1h，上班打卡02:00，则要从11:00(02:00加9h)开始算班后加班，即虚拟班次为02:00-11:00,11:00后根据参数设置判断要打几个卡来算班后加班。"+"<br></br>"+
//			"2、上下班弹性。班次08:00-17:00，中间休息1h，往后弹性1小时，如果上班打卡在08:00之前，则从17:00开始算班后加班；如果上班打卡在08:00-09:00之间，假设是x，则要从17:00-18:00之间x+9h开始算班后加班；如果上班打卡在09:00之后，则从18:00开始算班后加班。且要根据参数设置判断要打几个卡来算班后加班。";
//		descNode = $("#handOtRule").parents(".field-ctrl").siblings(".field-desc");
//		that.descNodeHtml(descNode,description);
		
		//弹性班
//		description = "说明：对弹性班不适用，弹性班不会自动计算班前、班后的加班时长。";
//		descNode =  $("#afterNotBill").parents(".field-ctrl").siblings(".field-desc");
//		that.descNodeHtml(descNode,description);
		
		//弹性班
//		description = "对休息日/法定假日排全天弹性班不适用，全天弹性班不会自动计算加班时长，不会自动生成加班单。"+"<br></br>"+
//					  "对休息日/法定假日排上下班弹性班适用，也会根据班次范围内的上班时间自动计算加班时长。";
//		$($("#handRestOtRule").parents(".row-fluid")[0]).next().append("<span id='handRestOtRuleTipSpan' style='float: right;'></span>")
//		descNode = $("#handRestOtRuleTipSpan");
//		that.descNodeHtml(descNode,description);
		//加班计算扣除请假部分
//		description =  "说明：对于手提加班单，若选择了按申请时间计算加班，则忽略此参数；"+"<br></br>"
//			+"对于自动计算加班的部分，该参数任生效。示例：若法定假日排班08:00-18:00，打卡10:00、19:00，请假单08:00-11:00，"+"<br></br>"
//			+"若不勾选该参数，自动计算的加班时长为10:00-18:00，若勾选该参数，则自动计算加班时长为11:00-18:00。";
//		descNode =  $("#isCalDeductLeave").parents(".field-ctrl").siblings(".field-desc");
//		that.descNodeHtml(descNode,description);
		
//		//加班类型受日期控制
//		description = "说明：勾选后，加班类型将不能修改，比如该天是工作日，则是工作日加班，不能改为休息日加班";
//		descNode =  $("#otrolByDateType").parents(".field-ctrl").siblings(".field-desc");
//		that.descNodeHtml(descNode,description);
		
		//出差算加班
//		description = "说明：若手提加班单选择了按申请时间计算加班，则忽略此参数";
//		descNode =  $("#tripCalOt").parents(".field-ctrl").siblings(".field-desc");
//		that.descNodeHtml(descNode,description);
		
		//假期制度里的 不用考勤模块时请假一天按几小时计算
		description = jsBizMultLan.atsManager_AtsMaintainBasicItemEdit_i18n_4;
		descNode =  $("#defaultStandardHour").parents(".field-ctrl").siblings(".field-desc");
//		假期制度修改问号提示方案
//		that.descNodeHtml(descNode,description);
		
//		//考勤确认
//		description = "开启后，员工自己可以且必须在移动端进行考勤确认，在规定期限内没有确认的，系统将自动确认。且考勤结果是未确认状态时，专员无法进行审核操作，专员可以对未确认的考勤结果，给员工发送【催办】消息，员工确认或系统自动确认后，专员便可进行操作了。对于员工确认或系统自动确认的考勤结果，默认是已审核状态，专员可以进行反审核后修改，但再次审核时，会发消息给员工，提示该考勤结果被专员重新审核过。";
//		descNode = $("#isConfirm").parents(".field-ctrl").siblings(".field-desc");
//		that.descNodeHtml(descNode,description);

	}
	,descNodeHtml:function(descNode,description){
//		descNode.html(["<div class='field-tips' >",
//						"<div class='tips-icon' style='border:1px solid blue;color: blue;'>?</div>",
//						"<div class='tips-content'>","<p>",description,"</p>","</div>",
//						"</div>"].join(""));	
		descNode.html(["<div class='field-tips' >",
						"<div class='tips-icon'><img src='/shr/addon/orgnization/web/resource/tips_2.png'></div>",
						"<div class='tips-content'>","<p>",description,"</p>","</div>",
						"</div>"].join(""));
						
		$(".tips-icon img").mouseover(function(){
			$(this).attr('src',"/shr/addon/orgnization/web/resource/tips_2_hover.png");
		});
		$(".tips-icon img").mouseout(function(){
			$(this).attr('src',"/shr/addon/orgnization/web/resource/tips_2.png");
		});
	}
});