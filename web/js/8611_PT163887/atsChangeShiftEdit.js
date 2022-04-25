shr.defineClass("shr.ats.AtsChangeShiftEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.AtsChangeShiftEdit.superClass.initalizeDOM.call(this);
		var that = this;
		that.selfDefineRow();
		if(that.getOperateState() == 'VIEW'){
			if($("#isGenerateRecord1").val() == 1){
				$("input[name=isGenerateRecord1]").attr("checked",true);
			}
			else{
				$("input[name=isGenerateRecord1]").removeAttr("checked");
			}
		
			if($("#isGenerateRecord2").val() == 1){
				$("input[name=isGenerateRecord2]").attr("checked",true);
			}
			else{
				$("input[name=isGenerateRecord2]").removeAttr("checked");
			}
			
			$("input[type=checkbox]").each(function(){
				$(this).attr("disabled","disabled");
			});
			
			$("#hrOrgUnit2").text($("#hrOrgUnit").text());
		}
		else{
			$("#isGenerateRecord1").shrSelect('setValue',"0");
			$("#isGenerateRecord2").shrSelect('setValue',"0");
			$("div[class='col-lg-6 field-ctrl tag-class']").live("click",function(e){
				var flagObject = $(this).parent().find("input[type=checkbox]");
				var flag = $(flagObject).attr("checked");
				if(flag == "checked"){
					$(flagObject).removeAttr("checked");
				}
				else{
					$(flagObject).attr("checked",true);
				}
			});
		}
		
		that.initPageValue();
		that.addImage();
	}
	,initPageValue:function(){
		var that = this;

		var urlParamHrOrgUnit = shr.getUrlParam('hrOrgUnit');
		if(urlParamHrOrgUnit==null || urlParamHrOrgUnit==""){
		    return;
		}

		var hrOrgUnit = decodeURIComponent(urlParamHrOrgUnit);
		var hrOrgUnitId = decodeURIComponent(shr.getUrlParam('hrOrgUnitId'));
		if(hrOrgUnit!=null && hrOrgUnit!=""){
			$("#hrOrgUnit").val(hrOrgUnit);
			$("#hrOrgUnit_el").val(hrOrgUnitId);
			$("#hrOrgUnit2").val(hrOrgUnit);
			$("#hrOrgUnit2_el").val(hrOrgUnitId);
		}

		var personNum1 = decodeURIComponent(shr.getUrlParam('personNum1'));
		var personName1 = decodeURIComponent(shr.getUrlParam('personName1'));
		var attendDate1 = decodeURIComponent(shr.getUrlParam('attendDate1'));
		var dayType1 = decodeURIComponent(shr.getUrlParam('dayType1'));
		var shiftName1 = decodeURIComponent(shr.getUrlParam('shiftName1'));

		var personNum2 = decodeURIComponent(shr.getUrlParam('personNum2'));
		var personName2 = decodeURIComponent(shr.getUrlParam('personName2'));
		var attendDate2 = decodeURIComponent(shr.getUrlParam('attendDate2'));
		var dayType2 = decodeURIComponent(shr.getUrlParam('dayType2'));
		var shiftName2 = decodeURIComponent(shr.getUrlParam('shiftName2'));
		
		//根据人员编号和班次名称得到人员主键和班次主键
		that.getPrimaryKeyByName(personNum1,personNum2,shiftName1,shiftName2);
		
		$('#proposer1_id').val(personNum1);
		$('#proposer1_number').val(personNum1);//@
		$('#proposer1').val(personName1);
		atsMlUtile.setTransDateTimeValue('attendDate1',attendDate1);
		$('#dayType1_el').val(that.getDateTypeValue(dayType1));
		$('#dayType1').val(dayType1);
		$('#defaultShift1').val(shiftName1);

		$('#proposer2_number').val(personNum2);//@
		$('#proposer2').val(personName2);
		atsMlUtile.setTransDateTimeValue('attendDate2',attendDate2);
		$('#dayType2_el').val(that.getDateTypeValue(dayType2));
		$('#dayType2').val(dayType2);
		$('#defaultShift2').val(shiftName2);
	},/*
		function: 根据人员编号和班次名称得到人员主键和班次主键
	  */
	getPrimaryKeyByName: function(personNum1,personNum2,shiftName1,shiftName2){
		var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.AtsChangeShiftEditHandler&method=getPrimaryKeyByName";
		shr.ajax({
				dataType:'json',
				type:"post",
				async: false,
				data: {personNum1:personNum1,personNum2:personNum2,shiftName1:shiftName1,shiftName2:shiftName2},
				url:  url,
				success:function(res){
					$('#proposer1_el').val(res.personId1);
					$('#proposer2_el').val(res.personId2);
					$('#defaultShift1_el').val(res.shiftId1);
					$('#defaultShift2_el').val(res.shiftId2);
			    }
		});
	},
	addImage: function(){
		var insertHTML = $('#attendDate1').parent().parent().parent().parent().next();
		insertHTML.append('<span style="margin-left:5% !important" class="field-image"></span>');
	}
	,
	getDateTypeValue: function(name){
		if(jsBizMultLan.atsManager_atsChangeShiftEdit_i18n_1 == name){
			return 0;
		}
		else if(jsBizMultLan.atsManager_atsChangeShiftEdit_i18n_2 == name){
			return 1;
		}
		else if(jsBizMultLan.atsManager_atsChangeShiftEdit_i18n_0 == name){
			return 2;
		}
		else{
			return 0;
		}
	},
	selfDefineRow : function(){
		var strRow = [];
		strRow.push("<div class='row-fluid row-block' id=''>");
		strRow.push("	<div data-ctrlrole='labelContainer'>");
		strRow.push("		<div class='col-lg-4'>")
		strRow.push("			<div class='field_label'> <input type='checkbox' name='isGenerateRecord1'></input></div>")
		strRow.push("       </div>");
		strRow.push("     	<div class='col-lg-6 field-ctrl tag-class' style='line-height:28px;cursor:pointer;'>" 
				+ jsBizMultLan.atsManager_atsChangeShiftEdit_i18n_3 
				+ "</div>");
		strRow.push("		<div class='col-lg-2 field-desc'/>");
		strRow.push("	</div>");
		strRow.push("	<div data-ctrlrole='labelContainer'>");
		strRow.push("		<div class='col-lg-4'>")
		strRow.push("			<div class='field_label'> <input type='checkbox' name='isGenerateRecord2'></input></div>")
		strRow.push("       </div>");
		strRow.push("     	<div class='col-lg-6 field-ctrl tag-class' style='line-height:28px;cursor:pointer;'>" 
				+ jsBizMultLan.atsManager_atsChangeShiftEdit_i18n_3 
				+ "</div>");
		strRow.push("		<div class='col-lg-2 field-desc'/>");
		strRow.push("	</div>");
		strRow.push("</div>");
		var goalObject = $("#AtsChangeShiftBill").find(".row-fluid")[5];
		$(goalObject).after(strRow.join(""));
	},
	/*
	 * 在调用父类的保存方法之前，先处理复选款
	 */
	saveAction: function(event) {
		var that = this;
		$("input[type=checkbox]").each(function(){
			var flag = $(this).attr("checked");
			if(flag == "checked"){
				$("#" + $(this).attr("name")).val(1);
			}
			else{
				$("#" + $(this).attr("name")).val(0);
				
			}
		});
		if (that.validate() && that.verify()) {			
			that.doSave(event, 'save');
		}	
	}
	
});



