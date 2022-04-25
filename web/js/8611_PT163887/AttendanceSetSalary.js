shr.defineClass("shr.ats.AttendanceSetSalary", shr.framework.List, {

	initalizeDOM : function () {
		shr.ats.AttendanceSetSalary.superClass.initalizeDOM.call(this);
		var self = this;
		this.initJsontype(); 
		$('#breadcrumb').parent().parent().remove();
		$('#microToolbar').parent().css("display","none");
	},
     initJsontype:function(){
	 	var _self = this;
        var salary_json = {
			id: "type",
			readonly: "",
			value: "0",
			onChange: null,

			validate: "{required:true}",
			filter: ""
		};
		_self.remoteCall({
			type:"post",
			//async: false,
			method:"getSalaryPeriod",
			//param:{begin_Date:beginDate,end_Date:endDate,isAgainFetchCard:isAgainFetchCard},
			success:function(res){
		
				if (res.flag == 1){
					/* var row_fields_work = '<div  class="row-fluid row-block row_field">'					  
					  + '<div class="spanSelf"><span class="cell-RlStdType">请选择转资期间</span> </div>'
					  +'<div class="spanSelf"><span class="cell-RlStdType"><input type="text" name="setSalaryPeriod" value="" width="30" class="input-height cell-input" validate="{required:true} " maxlength="10"/></span></div>'
					  +'</DIV>'  */
					  var row_fields_work =''
						  +'<div class="photoState" style="margin-top:50px;margin-left:30px;"><table width="100%"><tr>'
						  +'<td width="30%">'
						  + jsBizMultLan.atsManager_AttendanceSetSalary_i18n_1
						  + '</td>'
						  +'<td width="35%"><input type="text" name="setSalaryPeriod" value="" width="30" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
						  +'<td></td>'
						  +'</tr></table></div><br>'
						  +'<div><span></span></div>';
			        $('#AttendanceSetSal').append(row_fields_work);
					var beginDate=window.parent.atsMlUtile.getFieldOriginalValue("beginDate");
					var endDate=window.parent.atsMlUtile.getFieldOriginalValue("endDate");
					if(beginDate!="" && endDate!="")
					{
						beginDate=beginDate.replace('-','/');
						beginDate=beginDate.replace('-','/');
						endDate=endDate.replace('-','/');
						endDate=endDate.replace('-','/');
					}
					var StrTmp=beginDate+"--"+endDate;
					var Exchange=[];
					for(var i=0; i<res.name.length;i++){
						if( res.name[i]==StrTmp){
							$('input[name=setSalaryPeriod]').val(StrTmp);
						}
					  Exchange.push({'value':res.name[i],'alias':res.name[i]});
					}
					salary_json.data=Exchange;
					$('input[name=setSalaryPeriod]').shrSelect(salary_json);	
					 var year_json = {
							id: "type" + i,
							readonly: "",
							value: "0",
							onChange: null,
							validate: "{required:true}",
							filter: ""
						};
					var Month_json = {
						id: "type" + i,
						readonly: "",
						value: "0",
						onChange: null,
						validate: "{required:true}",
						filter: ""
						};
		
					var yearValue=[];
					for(var i=1990;i<2050;i++){
					  yearValue.push({'value':i,'alias':i});
					}
					var monthValue=[];
					for(var j=1;j<13;j++){
					  monthValue.push({'value':j,'alias':j});
					}
					year_json.data = yearValue;
					Month_json.data=monthValue;
				/* var row_fields_work = '<div  class="row-fluid row-block row_field">'
							  //class="input-height cell-input"
							  + '<div class="spanSel"><span class="cell-RlStdType">年份</span></div>'
							  + '<div class="spanSel"><span class="cell-RlStdType"><input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></span></div>'
							  + '<div class="spanSel"><span class="cell-RlStdType">月份</span></div>'
							  + '<div class="spanSel"><span class="cell-RlStdType"><input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true}"/></span></div>'
							  +'</DIV>'  */
							  
							  
					var row_fields_work = '<div class="photoState" style="margin-left:30px;"><table width="100%"><tr>'
					  +'<td width="15%">'
						+ jsBizMultLan.atsManager_AttendanceSetSalary_i18n_4
						+ '</td>'
					  +'<td width="10%"><input type="text"  name="YEAR"  value="" class="input-height cell-input" validate="{required:true}"/></td>'
					  +'<td width="10%"></td>'
					  +'<td width="15%">'
						+ jsBizMultLan.atsManager_AttendanceSetSalary_i18n_5
						+ '</td>'
					  +'<td width="10%"><input type="text" name="MONTH" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></td>'
					  +'<td></td></tr></table></div>';

					$('#AttendanceSetSal').append(row_fields_work);
					$('input[name=YEAR]').shrSelect(year_json);	
					$('input[name=YEAR]').shrSelect().extend("size",5);
					$('input[name=MONTH]').shrSelect(Month_json);	
					$('input[name=YEAR]').shrSelect().extend("size",5);
					var curDate = new Date();
		            var curDateY = curDate.getFullYear();
					var curDateM = curDate.getMonth()+1;
					$('input[name=YEAR]').val(curDateY);
					$('input[name=MONTH]').val(curDateM);
					$('.overflow-select').css("max-height","150px").css("overflow-y","auto");
				}else if(res.flag==0){
				    $('#saveDataSalary').hide();
				    var row_fields_work = '<div  class="row-fluid row-block row_field">'					  
					  + '<div class="spanSelf">'
						+ jsBizMultLan.atsManager_AttendanceSetSalary_i18n_0
						+ '</div>'
					  +'</DIV>'      
					$('#AttendanceSetSal').append(row_fields_work); 
				}
			}
		})
	 }, 
	saveDataSalaryAction : function(){
		var that = this;
		var setSalary = $('input[name=setSalaryPeriod]').val();
		if(setSalary == ""){
			shr.showInfo({message: jsBizMultLan.atsManager_AttendanceSetSalary_i18n_7});
			return false;
		}
	    var arra=setSalary.split("--");
		var beginDate=arra[0];
		var endDate=arra[1];
		beginDate=beginDate.replace('/','-');
		beginDate=beginDate.replace('/','-');
		endDate=endDate.replace('/','-');
		endDate=endDate.replace('/','-');
		var periodYear = $('input[name=YEAR]').val();
		var periodMonth = $('input[name=MONTH]').val();
		if (periodYear == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_AttendanceSetSalary_i18n_2});
			return false;
		}
		
		if (periodMonth == "") {
			shr.showInfo({message: jsBizMultLan.atsManager_AttendanceSetSalary_i18n_3});
			return false;
		}
	
		var  period=periodYear+"-"+periodMonth ;
		openLoader(1);
		that.remoteCall({
			type:"post",
			//async: false,
			method:"saveSalary",
			//param:{setSalary:setSalary},
			param:{beginDate:beginDate,endDate:endDate,period:period},
			success:function(res){
				closeLoader();
			    window.parent.$("#operationDialog").dialog('close');
				if (res.flag == 1){
				shr.showInfo({message: jsBizMultLan.atsManager_AttendanceSetSalary_i18n_6});
				window.parent.atsMlUtile.setTransDateTimeValue("beginDate",beginDate);
				window.parent.atsMlUtile.setTransDateTimeValue("endDate",endDate);
				window.parent.$("#reportGrid").jqGrid('setGridParam', {
			    datatype : 'json',
			    postData : {
				'beginDate1' : beginDate,
				'endDate1' : endDate,
				'adminOrgId1' :  window.parent.$("#AdminOrgUnit_el").val(),  
				'proposerId1' : window.parent.$("#proposer_id").val(),
				'NewRearch'   : 'newRearch'  ,
				'page' : 1
			     },
			     page : 0
		          })
				}else{
				shr.showInfo({message: jsBizMultLan.atsManager_AttendanceSetSalary_i18n_8});
				window.parent.$("#reportGrid").jqGrid('setGridParam', {
			    datatype : 'json',
			    postData : {
				'beginDate1' : window.parent.atsMlUtile.getFieldOriginalValue("beginDate"),
				'endDate1' : window.parent.atsMlUtile.getFieldOriginalValue("endDate"),
				'adminOrgId1' : window.parent.$("#AdminOrgUnit_el").val(),  
				'proposerId1' : window.parent.$("#proposer_id").val(),
				'NewRearch'   : 'newRearch'  ,
				'page' : 1
			      },
			      page : 0
		        });
				}
				 window.parent.jQuery('#reportGrid').jqGrid("reloadGrid");	
			}
		});
	} 
	
});

 
