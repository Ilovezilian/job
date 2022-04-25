shr.defineClass("shr.ats.workCalendarExchangeEdit", shr.framework.Edit, {
	
	initalizeDOM:function(){
		shr.ats.workCalendarExchangeEdit.superClass.initalizeDOM.call(this);
		
		//设置系统预设数据编号和名称不能编辑
		  var addRowID=1 ;	
		  
		var leavebillDialog = $("#operationDialog").val(); 
		this.initEditGrid();
		this.addRowFieldString(addRowID);
		//this.Selecttype(1);
		this.initAction(addRowID);
		this.displayExchangeDateHistoryAction();
		$("#returnHome").hide();
		//alert($("#breadcrumb li").val());
		$("#breadcrumb li").html(jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_13);
	},
		initEditGrid :function(){
	  	var row_fields_work =  '<div style="padding-top:15px;" class="row-fluid row-block row_field">'
			+ '<div class="spanSelf" ><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_8
			+ '</span></div>'
			+ '<div class="spanSelf" ><span class="cell-RlStdType" >'
			+ jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_15
			+ '</span></div>'
			+ '<div class="spanSelf" ><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_14
			+ '</span></div>'
			+ '<div class="spanSelf" ><span class="cell-RlStdType">'
			+ jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_3
			+ '</span></div>'
			+ '</div>';
	  	 $('#exchangDateEntryInfo').append(row_fields_work);
	  } 
	    ,addRowFieldString :function(addRowID){
    		var row_fields_work = '<div  class="row-fluid row-block row_field" id="'+ addRowID +'">'
    		
    		  	+ '<div class="spanSelf"><input type="text" name="exchangeDate' + addRowID +'" value="" class="input-height cell-input"  validate="{required:true}" /></div>'
					    
					  + '<div class="spanSelf"><input type="text"  name="beforetype' + addRowID + '" disabled="disabled" value="" class="input-height cell-input"    validate="{required:true}"/></div>'
						
						+ '<div class="spanSelf"><input type="text" name="afertype' + addRowID + '" disabled="disabled" value="" class="input-height cell-input" validate="{required:true}"/></div>'
						+ '<div class="spanSelf"><input type="text" name="remark' + addRowID + '" value="" class="input-height cell-input" validate="{required:true} " maxlength="10"/></div>'
		       
			if(addRowID==1){
				    row_fields_work	+= '<div width="10px"><a class="rowAdd cursor-pointer">+</a></div></div>'
				}else{
					  row_fields_work	+= '<div width="10px"><a class="rowAdd cursor-pointer">+</a><a class="rowDel cursor-pointer">x</a></div></div>'
					}				
			$('#exchangDateEntryInfo').append(row_fields_work);
			
     $('input[name^="exchangeDate"]').shrDateTimePicker({
					tagClass : 'block-father input-height',
					readonly : '',
					yearRange : '',
					ctrlType: "Date",
					isAutoTimeZoneTrans:false,
					validate : '{dateISO:true,required:true}'  
		});	
		   this.onTclickAction();  
          
    }
    	 ,onTclickAction :function(){
    	 	
    	 	    var that=this;  
    	 	  $('input[name^="exchangeDate"]').change(function(){    	 	      
    	 	      var Datevalue=$(this).val();
    	 	      var StrDate=$(this).attr("name");
    	 	      var tempValue=StrDate.substring(StrDate.length-1,StrDate.length);	 	
			      that.remoteCall({
				       type:"post",
				       method:"ExchangeWorkTypeById",			 				     
				       param:{StrJon:Datevalue},
				       success:function(res)
				      {   
				      	 if(res.validate=="1")
				      	 {
				      	 	console.log(res.dayType);
				      	    if(res.dayType==jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_10)
				      	    {
				      	    	$('input[name="exchangeDate'+tempValue+'"]').val(""); 	
				      	        shr.showError({message:jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_9});
					  	        return ;	
				      	    }else{
							   if(res.dayType==jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_11)
							   {
							     $('input[name="beforetype'+tempValue+'"]').val(res.dayType); 	
								 $('input[name="afertype'+tempValue+'"]')
									 .val(jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_16);
							   }else{
							     $('input[name="beforetype'+tempValue+'"]').val(res.dayType); 	
								 $('input[name="afertype'+tempValue+'"]')
									 .val(jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_11);
							   } 
				      	    }
				      	 }else
				      	 	{
				      	 		shr.showError({message:jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_7});
					  	        return ;	
				         }
				      //	  alert("success"); 
				      //	  alert(""+res.dayType);
				  
				      }   	
			       })
    	 	       	
    	 	  })
    	 	}

    	,initAction :function(addRowID){    	 
        var self=this ;
		  $('#exchangDateEntryInfo a.rowAdd').live('click',function(){	    
		  	   addRowID=addRowID+1;	 
		  	   var temp=addRowID;       
			     self.addRowFieldString(temp);
			  //   self.Selecttype(temp);     //设置法定假日的格式
			    
		//	 	var vali= $('#exchangDateEntryInfo .row_field).(input[name=""]).shrSelect(select_json);
	   		}
	    ); 
    			//删除
		    $('#exchangDateEntryInfo a.rowDel').live('click',function(){
	        $("div.row_field").last().remove();
	   	    addRowID--;
	    });
    	}
	    ,saveExchangeAction:function()
	    {
			var self=this ;
			var Exchange_json ;
			var temp=$("div.row_field").last().attr("id");   
			var Exchange_json =[] ;
			for(var j=1;j<=temp;j++)
			{
			  	     var beforetype=$('input[name="beforetype' + j + '"]').val();
				     var aftertype=$('input[name="afertype' + j + '"]').val();
				     var exchangeDate=$('input[name="exchangeDate' + j + '"]').val();
				     var Remark=$('input[name="remark'+j+'"]').val();	  
				     if(beforetype =="" ||aftertype=="" || exchangeDate=="")
				     {
				     	   shr.showError({message: jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_0});
				     	    return ;
				     }	
				  
				  /*   if(type1==type2 || exchangeDate1==exchangeDate2)
				     {   if(type1== type2)
				     	  {
				     	    shr.showError({message:"日期类型选择错误！第 "+j+" 行：调整日期类型相同"});		
				     	    return ;
				       	}
				       	else
				       	{
				       	 	shr.showError({message:"第 "+j+" 行：调整日期相同"});		
				       	 	return ;
				       	} 
				     }
				     if(type1=="法定节假日" || type2=="法定节假日")
				     {
				       	shr.showError({message:"法定假日不可以调整，无法选择！"});		
				       	return ;
				     }	*/			  				     
				      if(beforetype==jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_11)
				      {
				     	   beforetype=0;
				     	   aftertype=1;
				     	}else{
				     		 beforetype=1;
				     		 aftertype=0;
				     	}
						
				     for(var k=0;k<j-1;k++)
				     {   		 
				     	  json = eval(Exchange_json)  ;
				     	  if(exchangeDate==json[k].exchangeDate )
				     	  {
				     	  	 shr.showError({message:shr.formatMsg(jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_6,[(k+1),j])});
				     	  	 return ;
				     	  }					     	
				     }
	     	    Exchange_json.push({'exchangeDate':exchangeDate,'beforetype':beforetype,'aftertype':aftertype,'Remark':Remark} );
	            var postData = $.toJSON(Exchange_json) ;
			    shr.showConfirm(jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_12, function()
				{
		            self.dosaveAction(postData);
			    });	
			} 
	    }
	  ,dosaveAction:function(StrJon){
	  	var that = this;
	  	//var StrJon=$.toJSON(json);
	  //	var StrJon=JSON.parse(json);
	  	//var StrJon= eval(json);var postData = $.toJSON(postdata)
			 that.remoteCall({
				type:"post",
				method:"ExchangeWorkCalendarById",
				param:{StrJon:StrJon},
				success:function(res)
				{ 	 
					shr.showInfo({message:jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_1});
					$("div.row_field").remove();
				    that.initEditGrid();
			        addRowID=1;
				    that.addRowFieldString(addRowID);
   	     // that.Selecttype(1);
				}   	
			})
    }
    
     ,returnHomeAction:function()
     {  
		  var that=this;
		  $('#displayExchangeDateHistory').show();
		  $('#returnHome').hide();
		  $('#saveExchange').show();
		  $("div.row_field").remove();
		  that.initEditGrid();
		  addRowID=1;
		  that.addRowFieldString(addRowID);
     }
    
    
      //com.kingdee.eas.hr.ats.app.WorkCalendar.list
   ,displayExchangeDateHistoryAction:function(){  

   	    var that=this;
   	   
   	     $('#displayExchangeDateHistory').click(function(){  
   	     	  $('#displayExchangeDateHistory').hide();
   	     	  $('#saveExchange').hide();
   	     	  $('#returnHome').show();
   	  	that.remoteCall({
				type:"post",
				method:"displayExchangeDateHistory",
				success:function(res){
					var info = res;
					//alert(JSON.stringify(info));
					var WorkCalendarExchange = JSON.parse(info.WorkCalendarExchangeList);
					var len = WorkCalendarExchange.length;
					//ev = leaveBillColls;
					//ev_ev = leaveBillColls;
					  
					 var html="";
					 var row_fields_work =  '<div style="padding-top:15px;" class="row-fluid row-block row_field">'
						+ '<div class="spanListSelf" ><span class="cell-RlStdType">'
						 + jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_8
						 + '</span></div>'
						+ '<div class="spanListSelf" ><span class="cell-RlStdType" >'
						 + jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_15
						 + '</span></div>'
						+ '<div class="spanListSelf" ><span class="cell-RlStdType">'
						 + jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_14
						 + '</span></div>'
						+ '<div class="spanListSelf" ><span class="cell-RlStdType">'
						 + jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_2
						 + '</span></div>'
						+'<div class="spanListSelf"><span class="cell-RlStdType">'
						 + jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_4
						 + '</span></div>'
						+'<div class="spanListSelf"><span class="cell-RlStdType">'
						 + jsBizMultLan.atsManager_workCalendarExchangeEdit_i18n_5
						 + '</span></div></div>';
				
					for(var i = 0;i<len;i++){ 
						var description=WorkCalendarExchange[i].description;
							console.log(WorkCalendarExchange[i]);
						if(!WorkCalendarExchange[i].description)
						{
						   description="";
						}
					    html += '  <div class="row-fluid row-block row_field "> '
					    html += '  <div class="spanListSelf" ><span class="cell-RlStdType">'+WorkCalendarExchange[i].beforeDate.substring(0,10)+'</span></div>';
					    html += '  <div class="spanListSelf" > <span class="cell-RlStdType">'+WorkCalendarExchange[i].beforeDateType['alias']+'</span></div>';
					    html += '  <div class="spanListSelf" ><span class="cell-RlStdType">'+WorkCalendarExchange[i].afterDateType['alias']+'</span></div>';
						html += '  <div class="spanListSelf" ><span class="cell-RlStdType">'+description+'</span></div>';
						html += '  <div class="spanListSelf" ><span class="cell-RlStdType">'+WorkCalendarExchange[i].name+'</span></div>';
						html += '  <div class="spaSelf" ><span class="cell-RlStdType">'+WorkCalendarExchange[i].createTime+'</span></div>';					    
					
					    html += '</div>';
					 //   html += '  <td class="field_label view_div_table_td"> '+WorkCalendarExchange[i].applyDate.substring(0,10)    +' </td>';					   
						}  
						 $("div.row_field").remove();
						$("#exchangDateEntryInfo").html(row_fields_work);
						$('#exchangDateEntryInfo').append(html);
					}	
			  })	
			})  
   	}
});



