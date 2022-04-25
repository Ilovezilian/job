shr.defineClass("shr.ats.AttendanceCycleEdit", shr.ats.AtsMaintainBasicItemEdit, {
	
	initalizeDOM:function(){
		shr.ats.AttendanceCycleEdit.superClass.initalizeDOM.call(this);
		var that = this;
		that.initDeal();//初始化
		shr.setIframeHeight();
	}
		,validate: function() {
		var workArea = this.getWorkarea(),
			$form = $('form', workArea);
		
		// return $form.valid();
		var flag = $form.wafFormValidator("validateForm", true);
		if (!flag) {
			//var size = $form.data('validator').errorList.length;
			shr.showWarning({
				message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_15,
				hideAfter: 5
			});
		}
		
		//增加自己的校验逻辑
		if(this.myValidate()!==""){
			shr.showWarning({
				message: this.myValidate()
			});
			return false;
		}
		var rowData = $('#items').jqGrid('getRowData');
		function interSect(period1,period2){
			if(!period1.startDate || !period1.endDate || !period2.startDate || !period2.endDate){
				return false;
			}
			var period1_startDate = new Date(Date.parse(period1.startDate.replace(/-/g,  "/")));
			var period2_endDate = new Date(Date.parse(period2.endDate.replace(/-/g,  "/")));
			var period1_endDate  =new Date(Date.parse(period1.endDate.replace(/-/g,  "/")));
			var period2_startDate = new Date(Date.parse(period2.startDate.replace(/-/g,  "/")));
			if(period1_startDate <= period2_endDate && period1_endDate >= period2_startDate){
				return true;
			}
			return false;
		}
		for(var i = 1;i <  rowData.length;i++){
			for(var j = 0;j < i;j++){
				if(interSect(rowData[i],rowData[j])){
					shr.showWarning({
						message: shr.formatMsg(jsBizMultLan.atsManager_dateIntersect,[j + 1,i + 1]),
						hideAfter: 5
					});
					return false;
				}
			}
		}
		return flag;
	}
	
	,myValidate : function(){
		if($('#items').jqGrid('getRowCount')==0){
			return jsBizMultLan.atsManager_attendanceCycleEdit_i18n_4;
		}
		return "";
	
	}
	,initDeal : function(){
		var that = this;
		if (that.getOperateState() != 'VIEW') {
			  that.cycleStartDateCtrl();//设置周期开始日期控件
			  that.initStartCycle();//初始化 开始周期控件
			  that.initIsDefault();//初始化是否默认
			  that.initCycleButton();//初始化生成周期按钮
			  that.initStateButtom();//初始化启用、禁用按钮
			  that.setCycleRange(); // 设置周期区间布局
			  that.defMonthlyStatementDateChangeEvent();
		}else{
			that.ViewCycleRangeContent();  // view的情况 
		}
		that.initToolTips();
		if (that.getOperateState() == 'EDIT') {
	    	that.ctrlStartCycleIsEdit();
		}
		$("#isSysPreset").closest('.row-mg-top').removeClass("row-mg-top");
	}
	,ViewCycleRangeContent : function(){ // view的情况 
		 $('#cycleType').val() == "1" && $('#cycleLabelContainer').hide();
		
		if($('#cycleType').val() == "2"){
			if($('#cycleStartMonth').val() !=""){
				var par = $('#cycle') ;
				par.attr({class:'field_input'});
				par.append(shr.formatMsg(jsBizMultLan.atsManager_attendanceCycleEdit_i18n_0,[
					"<span id='StartMonth' class='input-height cell-input' type='text'></span>"
					+ "<span  id='StartDate' class='input-height cell-input' type='text'></span>"
					,
					"<span id='endMonth'></span>"
					+ "<span id='endDay'></span>"
				]));
			}
	        if($('#cycleStartMonth').val() == '0'){
	        	$("#StartMonth").text(jsBizMultLan.atsManager_attendanceCycleEdit_i18n_13);
	        	$("#endMonth").text(jsBizMultLan.atsManager_attendanceCycleEdit_i18n_2);
	        	$('#StartDate').text($('#cycleStartDate').val());
	        	$('#endDay').text(parseInt($('#cycleStartDate').val())-1);//@
	        }else if ($('#cycleStartMonth').val() == '1' ){
	        	$("#StartMonth").text(jsBizMultLan.atsManager_attendanceCycleEdit_i18n_2);
	        	$("#endMonth").text(jsBizMultLan.atsManager_attendanceCycleEdit_i18n_16);
	        	$('#StartDate').text($('#cycleStartDate').val());	
	        	$('#endDay').text(parseInt($('#cycleStartDate').val())-1);//@
	        }
		}
	}
	,
	setCycleRange : function(){
		var par = $('#cycle') ;
		par.append(shr.formatMsg(jsBizMultLan.atsManager_attendanceCycleEdit_i18n_1,[
		"<div style='width:100%;float:left;'><input id='StartMonth' class='input-height cell-input' type='text'></input>"
        + "<input  id='StartDate' class='input-height cell-input' style='width:40px;margin-left:10px !important'  required='true' type='text'></input>"
        ,
		"<span id='endMonth'></span>"
		+ "<span id='endDay'></span>"
		,
		"</div>"
    ]));
        var attend_json =
		{
			id: "StartMonth",
			readonly: "",
			value: "0",
			onChange: null,
			validate: "{required:true}",
			filter: ""
		};
        var attend=[];
		    attend.push({"value":"0","alias":jsBizMultLan.atsManager_attendanceCycleEdit_i18n_13}
				,{"value":"1","alias":jsBizMultLan.atsManager_attendanceCycleEdit_i18n_2});
		attend_json.data=attend;
		showAttendJson = attend_json;
		$('#StartMonth').shrSelect(attend_json);
		var selectVal = "" ;
        if($('#cycleStartMonth').val() == '1' || $('#cycleStartMonth').val() == "" )
       	{
       		$('#StartMonth').shrSelect("setValue",'1'); 
       		
       	}else{
       		$('#StartMonth').shrSelect("setValue",'0');
       	};
	     var  selectVal = $('#StartMonth').shrSelect('getValue');
		 var  selectValue = selectVal.value;
		 var  selectAlias = selectVal.alias;
		 var  nextAlias = "" ;
		 nextAlias  = (selectAlias ==jsBizMultLan.atsManager_attendanceCycleEdit_i18n_2)
			 ? jsBizMultLan.atsManager_attendanceCycleEdit_i18n_16
			 :jsBizMultLan.atsManager_attendanceCycleEdit_i18n_2;
		 $('#endMonth').text(nextAlias);
		 $('#cycleStartMonth').val(selectValue);
       		 
       	if( $('#cycleStartDate').val() == "" ||isNaN($('#cycleStartDate').val())){  
       		   $('#StartDate').val('26');
       		   $('#endDay').text('25');
       		   $('#cycleStartDate').val('26');
       	}else{
       		   var dy = $('#cycleStartDate').val();
       		    $('#StartDate').val(dy);
       		   $('#endDay').text(dy -1 );
       	};
       	par.find('.ui-select-frame').css({width:"60px",float:"left"});
       	$('#StartMonth').blur(function(){
			 var  selectVal = $(this).shrSelect('getValue');
			 var  selectValue = selectVal.value; // cycleStartMonth
			 var  selectAlias = selectVal.alias;
			 var  nextAlias = "" ;
			 var  nextValue = "" ;
			 nextAlias  = (selectAlias ==jsBizMultLan.atsManager_attendanceCycleEdit_i18n_2)
				 ? jsBizMultLan.atsManager_attendanceCycleEdit_i18n_16
				 :jsBizMultLan.atsManager_attendanceCycleEdit_i18n_2;
			 $('#endMonth').text(nextAlias);
			 $('#cycleStartMonth').val(selectValue);
    	});
    	$('#StartDate').blur(function(){
    		var textVal = $(this).val();
    		var tVal = parseInt(textVal) ;//@
    		if(tVal < 2 || tVal > 28){
			    shr.showError({message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_18});
			    return;
			}
			$('#endDay').text(tVal - 1) ;
			$('#cycleStartDate').val(tVal);
    	})
	}
	,initCycleButton : function(){
		var that = this;
		$('#addRow_items').attr('id','generateCycle');
		$("#generateCycle").text(jsBizMultLan.atsManager_attendanceCycleEdit_i18n_14);
		$('#generateCycle').attr('name','generateCycle');
		
		$('#generateCycle').next('script').html('');
		
		$("#generateCycle").unbind("click");
		$("#generateCycle").bind("click",function(event){
			
			that.generateCycle(event);			
		});		
	}
	,initStateButtom: function(){
		var that = this;
		//初始化启用考勤周期  启用  按钮
		var state_items_enable = "<button id='enableState' type='button' name='enableState' class=' shrbtn' style='margin-left:4px;'>"
			+ jsBizMultLan.atsManager_attendanceCycleEdit_i18n_5
			+ "</button>";
		$('#deleteRow_items').after(state_items_enable);
		
		$("#enableState").unbind("click");
		$("#enableState").bind("click",function(event){
			var stateVal = this.id;
			that.stateAction(event,stateVal);
			//that.enableState(event);
			
		});
		//初始化启用考勤周期  禁用  按钮
		var state_items_disable = "<button id='disableState' type='button' name='disableState' class=' shrbtn' style='margin-left:5px;'>"
			+ jsBizMultLan.atsManager_attendanceCycleEdit_i18n_3
			+ "</button>";
		$('#enableState').after(state_items_disable);
		
		$("#disableState").unbind("click");
		$("#disableState").bind("click",function(event){
			var stateVal = this.id;
			that.stateAction(event,stateVal);
			//that.disableState(event);			
		});
	}
	,stateAction: function(event,stateVal){
		var that = this;
		var $editGrid = this.getEditGrid(event.currentTarget);
		var ids = $editGrid.jqGrid('getSelectedRows');
		
		var textVal = "",addNew_state = 0;
		if(stateVal == 'disableState'){
			textVal = jsBizMultLan.atsManager_attendanceCycleEdit_i18n_3;
			addNew_state = 2;
		}else if(stateVal == 'enableState'){
			textVal = jsBizMultLan.atsManager_attendanceCycleEdit_i18n_5;
			addNew_state = 1;
		}
		// var mess = '不能选择' + textVal +'状态的周期明细进行此操作!!';
		if (ids.length > 0) {
			var bills ;
			var stateV="",stateInput="";
			for (var i = 0; i < ids.length; i++) {
				stateV = $($editGrid.find("tr[id='"+ids[i]+"']")).find("td[aria-describedby='items_attendPeriodState']").attr("title");
				stateInput = $editGrid.find("tr[id='"+ids[i]+"'] input[type='hidden']").attr('value');
				if(!stateInput){
					if(stateVal == "enableState" && stateV==jsBizMultLan.atsManager_attendanceCycleEdit_i18n_5){
						continue;
					}else if(stateVal == "disableState" && stateV==jsBizMultLan.atsManager_attendanceCycleEdit_i18n_3){
						continue;
					}
				}else{
					if(stateVal == 'enableState' && stateInput=='1'){
						continue;
					}else if(stateVal == 'disableState' && stateInput=='2'){
						continue;
					}
				}
				$editGrid.setCell(ids[i],'attendPeriodState',addNew_state);
/* 				if(bills){
					bills = bills+','+ids[i];
				}else{
					bills = ids[i];
				} */
			}
		}else{
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_9, hideAfter: 3});
			return;
		}
/* 		for(var i=0,length=ids.length; i<length; i++){
		  $editGrid.setCell(ids[i],'attendPeriodState',addNew_state);
		} */
		//shr.showInfo({message: textVal + "成功！", hideAfter: 3});	
/* 		var isRefresh = that.getOperateState();
		if(isRefresh == 'ADDNEW'){

			return;
		}else if(isRefresh == 'EDIT'){
			 that.remoteCall({
				type:"post",
				async: false,
				method: "state", 
				param: {billId:bills,stateVal:stateVal}, 
				success: function(res) {
				shr.showInfo({message: textVal + "成功！", hideAfter: 3});
				window.location.reload();
			}}); 
		} */
	}
	,deleteRowAction: function(event) {
		var that = this;
		var $editGrid = this.getEditGrid(event.currentTarget);
		var ids = $editGrid.jqGrid('getSelectedRows');
		if(that.checkSelectIndexIsRule(event)){
		if (ids) {
			for (var i = ids.length - 1; i >= 0; i--) {
				$editGrid.jqGrid('delRow', ids[i]);
			}
		}		
		}else{
		shr.showWarning({
				message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_6, // 周期必须连续，不能删除中间的周期！ 
				hideAfter: 5
			});
		}
		
		//控制开始周期控件是否编辑
		that.ctrlStartCycleIsEdit();
		
		
	}
	//校验选中列是否连续，符合规则
	,checkSelectIndexIsRule:function(event){
		var $editGrid = this.getEditGrid(event.currentTarget);
		var ids = $editGrid.jqGrid('getSelectedRows');
		
		var indexs = new Array([ids.length]);
		if (ids) {
			for (var i = 0; i <ids.length; i++) {
				//alert($('#items').find("tr[id='"+ids[i]+"']").length);
				//序号
				indexs[i] = $('#items').find("tr[id='"+ids[i]+"']").eq(0)[0].rowIndex;
			}
		}
		
		return this.checkInRecursion(indexs,$('#items').jqGrid('getRowCount'));
		
	
	}
	,checkInRecursion : function(indexs,count){
		
		for(var i =0;i<indexs.length;i++){
			if(indexs[i]==count){
				var array = indexs.splice(i,1);
			return this.checkInRecursion(indexs,count - 1);
			}
		}
		if(indexs.length==0){
		return true;
		}else{
		return false;
		}
		
	}
	//控制开始周期控件是否可编辑
	,ctrlStartCycleIsEdit : function(){
		if($('#items').jqGrid('getRowCount')==0){
			$('#startCycle-year').shrSelect('enable');
         	$('#startCycle-month').shrSelect('enable');
		}else{
			$('#startCycle-year').shrSelect('disable');
         	$('#startCycle-month').shrSelect('disable');
		}
	}
	
	,generateCycle : function(event){
		var that = this;
		if($('#startCycle-year').val()==""){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_10});
			return;
		}
		
		if($('#startCycle-month').val()==""){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_11});
			return;
		}
		
		if($('#cycleType_el').val()==""){
			shr.showInfo({message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_12});
			return;
		}else if($('#cycleType_el').val()=="1"){
			$editGrid = this.getEditGrid(event.currentTarget);
			
			//$editGrid.clearGridData();//清空考勤明细表单数据
			var vi = $('#items').jqGrid('getRowCount') + 1;
			$('#cycleStartDate').val(1) ; 
			for(var i = vi;i< vi + 12 ;i++){ 
			that.generateCycleByNaturalMonth(event,i);
			}
		}else if($('#cycleType_el').val()=="2"){
			if($('#cycleStartDate').val()==""){
			   shr.showInfo({message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_7});
			   return;
			}
			if(parseInt($('#cycleStartDate').val())<1||parseInt($('#cycleStartDate').val())>28){//@
			   shr.showInfo({message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_17});
			   return;
			}
			if($('#StartDate').val() ==""){
				shr.showError({message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_8});
			   	return;
			}
			if(parseInt($('#StartDate').val())< 2||parseInt($('#StartDate').val())>28){//@
			   shr.showInfo({message: jsBizMultLan.atsManager_attendanceCycleEdit_i18n_20});
			   return;
			}
			$editGrid = this.getEditGrid(event.currentTarget);
			
			//$editGrid.clearGridData();//清空考勤明细表单数据
			
			var vi = $('#items').jqGrid('getRowCount') + 1;
			for(var i = vi;i< vi + 12 ;i++){
		    	that.generateCycleByFixedDate(event,i);
			 }
		   }
		   shr.setIframeHeight();	
	}

	,initToolTips: function () {
		$('[title="'+jsBizMultLan.atsManager_attendanceCycleEdit_i18n_ym_31+'"]')
			.after("<span id='dmsd'></span>");

		var dmsdText = '&nbsp;&nbsp;'
			+ jsBizMultLan.atsManager_attendanceCycleEdit_i18n_ym_30
			+ '<br/>';

		$('#dmsd').shrTooltip({content: dmsdText});
	}
	,generateMonthlyStatementDate : function(year, month, day){
		if(parseInt(month)>=12){
			year = parseInt(year) + 1;
			month = "1";
		}else {
			month = parseInt(month) + 1;
		}
		var endDay = new Date(year,month,0);
		var endDayValue = endDay.getDate();
		if(day > endDayValue){
			day = endDayValue;
		}
		var statementDate = year;
		if(month <= 9){
			statementDate = statementDate +"-0" + month;
		}else {
			statementDate = statementDate +"-" + month;
		}
		if(day <= 9){
			statementDate = statementDate +"-0" + day;
		}else {
			statementDate = statementDate +"-" + day;
		}
		return statementDate;
	}

	,defMonthlyStatementDateChangeEvent : function(){
		var that = this;
		if(that.getOperateState() == 'VIEW'){
			return;
		}
		$('#defMonthlyStatementDate').change(function(){
			var defMonthlyStatementDate = atsMlUtile.getFieldOriginalValue("defMonthlyStatementDate");
			if(defMonthlyStatementDate == null || defMonthlyStatementDate <= 0){
				return;
			}
			if($('#items').jqGrid('getRowCount')==0){
				return;
			}else {
				var rowCount = $('#items').jqGrid('getRowCount');
				var rowData = $("#items").jqGrid('getRowData');
				for(var index = 0; index < rowCount ; index ++){
					var  monthlyStatementDate = rowData[index].monthlyStatementDate;
					if(monthlyStatementDate == null || monthlyStatementDate == ""){
						var year = rowData[index].startDate.substring(0,4);
						var month = rowData[index].startDate.substring(5,7);
						var newMSD = that.generateMonthlyStatementDate(year,month,defMonthlyStatementDate);
						$('#items').jqGrid("setCell", rowData[index].id,"monthlyStatementDate",newMSD);
					}
				}
			}
		});
	}

	,generateCycleByNaturalMonth : function(event,i){
			
			var source = event.currentTarget,
			$editGrid = this.getEditGrid(source);
			var startCycleYear ;
			var startCycleMonth;
			if($('#items').jqGrid('getRowCount')==0){
				startCycleYear= parseInt($('#startCycle-year').val());//@
			    startCycleMonth = parseInt($('#startCycle-month').val())+ parseInt(i)-1;//@
			}else{
				var rowData = $("#items").jqGrid('getRowData');
				var year = rowData[$('#items').jqGrid('getRowCount')-1].name.l2.substring(0,4);
				var month = rowData[$('#items').jqGrid('getRowCount')-1].name.l2.substring(4,6);
				if(parseInt(month)==12){//@
				 	year = parseInt(year) + 1;//@
				 	month = parseInt("00");//@
				}
				startCycleYear = parseInt(year);//@
				startCycleMonth = parseInt(month) + 1;//@
			}
			 if(startCycleMonth>12){
			 	startCycleYear = startCycleYear + 1;
			 	startCycleMonth = startCycleMonth - 12;
			 	}
			var name = "";
			var startDate = "";
			var endDate = "";
			var day = new Date(startCycleYear,startCycleMonth,0);
 			var lastdate = startCycleYear + '-' + startCycleMonth + '-' + day.getDate();
			if(startCycleMonth.toString().length==1){
				name = startCycleYear.toString() +  "0" + startCycleMonth.toString();
				startDate = startCycleYear.toString() +  "-0" + startCycleMonth.toString()+"-01";
				endDate = startCycleYear.toString() +  "-0" + startCycleMonth.toString()+"-";
			}else{
				name = startCycleYear.toString() + startCycleMonth.toString();
				startDate = startCycleYear.toString()+"-" + startCycleMonth.toString()+"-01";
				endDate = startCycleYear.toString()  + "-" +startCycleMonth.toString()+"-";
			}
			this.createRow(i,name,startDate,endDate+ day.getDate());

	}
	,createRow : function(i,name,startDate,endDate){
		var defMonthlyStatementDate = atsMlUtile.getFieldOriginalValue("defMonthlyStatementDate");
		if(defMonthlyStatementDate == null || defMonthlyStatementDate <= 0){
			$editGrid.addRowData(i, {"name": {l1: name, l2: name,l3: name},"startDate":startDate,"endDate":endDate,attendPeriodState:1},"last");
		}else {
			var year =startDate.substring(0,4);
			var month = startDate.substring(5,7);
			var newMSD = this.generateMonthlyStatementDate(year,month,defMonthlyStatementDate);
			$editGrid.addRowData(i, {"name": {l1: name, l2: name,l3: name},"startDate":startDate,"endDate":endDate ,"monthlyStatementDate":newMSD,attendPeriodState:1},"last");
		}
	}

	,generateCycleByFixedDate : function(event,i){
		
			var source = event.currentTarget,
			$editGrid = this.getEditGrid(source);
			var startCycleYear ;
			var startCycleMonth;
			var name = "";
			if($('#items').jqGrid('getRowCount')==0){ // 第一行
				startCycleYear= parseInt($('#startCycle-year').val());//@
				var  cycleStartMonth = parseInt($('#cycleStartMonth').val());//@
				// 0 上月    1本月
			    startCycleMonth = parseInt($('#startCycle-month').val())+ parseInt(i)-1;//@
			    
			    var  nameMonth = (startCycleMonth < 10) ? "0"+startCycleMonth : startCycleMonth ;
			    name =  startCycleYear+""+nameMonth ;
			    
			    startCycleMonth = (cycleStartMonth == 0) ? startCycleMonth -1 : startCycleMonth ;
			    if (startCycleMonth == 0){startCycleMonth = 12 , startCycleYear = startCycleYear -1 } ;
			}else{
				var rowData = $("#items").jqGrid('getRowData');
				var nameYear = rowData[$('#items').jqGrid('getRowCount')-1].name.l2.substring(0,4); // 防止跨年的情况
				var nameMonth = rowData[$('#items').jqGrid('getRowCount')-1].name.l2.substring(4,6);
				
				var year = rowData[$('#items').jqGrid('getRowCount')-1].startDate.substring(0,4);
				var month = rowData[$('#items').jqGrid('getRowCount')-1].startDate.substring(5,7);
				
				if(parseInt(month)==12){//@
				 	year = parseInt(year) + 1;//@
				 	month = parseInt("00");//@
				}
				
				if(parseInt(nameMonth)==12){//@
				 	nameYear = parseInt(nameYear) + 1;//@
				 	nameMonth = parseInt("00");//@
				}
				 nameYear = parseInt(nameYear);//@
				 nameMonth = parseInt(nameMonth) + 1;//@
				
				if(nameMonth < 10 ){ nameMonth = "0"+nameMonth ;}
					name = nameYear+""+ nameMonth;
					startCycleYear = parseInt(year);//@
					startCycleMonth = parseInt(month) + 1;//@
				
				if(startCycleMonth>12){
				 	startCycleYear = startCycleYear + 1;
				 	startCycleMonth = startCycleMonth - 12;
			 	}
			
				
			}
			 if(startCycleMonth>12){
				 	startCycleYear = startCycleYear + 1;
				 	startCycleMonth = startCycleMonth - 12;
			 	}

			var startDate = "";
			var endDate = "";
			var cycleStartDate = parseInt($('#cycleStartDate').val());//@
			if(cycleStartDate==1){
				this.generateCycleByNaturalMonth(event,i);
				return;
			}
			// 201408 ---> name
			if(startCycleMonth.toString().length==1){
				startDate = startCycleYear.toString() +  "-0" + startCycleMonth.toString()+"-"+cycleStartDate;
				var startCycleMonth = startCycleMonth+1;
				if(startCycleMonth.toString().length==1){
				endDate = startCycleYear.toString() +  "-0" + startCycleMonth.toString()+"-"+(cycleStartDate-1);
				}else{
				endDate = startCycleYear.toString() +  "-" + startCycleMonth.toString()+"-"+(cycleStartDate-1);
				}
			}else{
				startDate = startCycleYear.toString()+"-" + startCycleMonth.toString()+"-"+cycleStartDate;
				var startCycleMonth = startCycleMonth+1;
				if(startCycleMonth>12){
			 	startCycleYear = startCycleYear + 1;
			 	startCycleMonth = startCycleMonth - 12;
			 	}
				endDate = startCycleYear.toString()  + "-" +startCycleMonth.toString()+"-"+(cycleStartDate-1);
			}
		    this.createRow(i,name,startDate,endDate);
			
		    //$editGrid.addRowData(i, {"name":{l1: name, l2: name,l3: name},"startDate":startDate,"endDate":endDate,attendPeriodState:1},"last");
		    
	}
	,initIsDefault : function(){
		var that = this;
		that.remoteCall({
			type:"post",
			async: false,
			method:"getHasDefault",
			param:{billId:$('#id').val(),handler:"com.kingdee.shr.ats.web.handler.AttendanceCycleEditHandler"},
			success:function(res){
				info =  res;
				if(!info.hasDefault){//如果考勤周期没有默认  设置为默认 且不可编辑
					$('#isDefault').shrCheckbox('check');
					$('#isDefault').shrCheckbox('disable');
					$('#isDefault').parent(".icheckbox_minimal-grey").removeClass("disabled");//去掉看起来界面更好看
				}else{
					$('#isDefault').shrCheckbox('enable');
				}
			}
		});
		
	}
	,initStartCycle : function(){//初始化 开始周期控件
		var that = this;
		that.getOperateState() != 'VIEW' && $('#startCycle').shrDateYearMonthPicker({cycleYearLable:'周期开始年',cycleMonthLable:'周期开始月'});
		$('#cycleType').bind('change',function(){
			that.cycleStartDateCtrl();
		});
		
	}
	,cycleStartDateCtrl : function(){
			var cycleTypeVal = $('#cycleType').shrSelect('getValue').value; 
			if(cycleTypeVal=="1"){//自然月
				//$('#cycleStartDate').shrTextField('disable');
				//$('#cycleStartDate').shrTextField('setValue','');
				$('#cycle').parent().parent().hide();
			}else if(cycleTypeVal=="2"){//月（固定日期）
				//$('#cycleStartDate').shrTextField('enable');
				$('#cycle').parent().parent().show();
				var startdate = $("#StartDate").val();
				//$('#cycleStartDate').val(startdate);
				if(startdate){
					var tVal = parseInt(startdate) ;//@
					$('#cycleStartDate').val(tVal);
				}
				
			}
	}
});



