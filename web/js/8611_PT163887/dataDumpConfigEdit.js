shr.defineClass('shr.ats.DataDumpConfigEdit',shr.framework.Edit, {
  initalizeDOM: function() {
    shr.ats.DataDumpConfigEdit.superClass.initalizeDOM.call(this);
    var that = this;
    that.showTips();
    that.addSocQueryTipA("tipsDumpTablePrefix");
  },
  initalizeDataDumpConfigEdit: function() {
  },
  
  	
  verify: function() {
  	 var tableName = $('#tableName').val(); 
    var filterField = $('#filterField').val(); 
     if(tableName == ""){
    	 shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_8});
      	return false;
    }
    if(filterField == ""){
    	 shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_0});
      	return false;
    }
    
    var entryTableName = $('#entryTableName').val(); 
    var entryFilterField = $('#entryFilterField').val(); 
    if(entryTableName == "" && entryFilterField != ""){
    	 shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_9});
      	return false;
    }
    if(entryTableName != "" && entryFilterField == ""){
    	 shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_3});
      	return false;
    }

    var yearBeforeNum = atsMlUtile.getFieldOriginalValue('yearBeforeNum');
    var year = $('#year').val();
    if(yearBeforeNum == "" && year == ""){
    	 shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_10});
      	return false;
    }
    if(yearBeforeNum != "" && parseInt(yearBeforeNum) < 1){
    	shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_4});
      	return false;
    }
    
    var dumpTableName = $('#dumpTableName').val();
   if(dumpTableName == ''){
    	shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_6});
      	return false;
    }else if(dumpTableName.length > 15){
    	shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_5});
      	return false;
    }

    var description = $('#description').val();
    if(description != '' && description.length > 255){
    	shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_11});
      	return false;
    }
    
    var re = /^[0-9]+[0-9]*[0-9]*$/ ;
    if( year != ''){
        if(!re.test(year) || year.length != 4){
            shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_2});
            return false;
        }else {
        	var now_Year = new Date().getFullYear();
        	if(year >= now_Year){
        		shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigEdit_omit_1});
        		return false;
        	}
        }
        
    }
    return true;
  },
  showTips:function(){
  	$("[title='" + jsBizMultLan.atsManager_dataDumpConfigEdit_i18n_0+"']")
        .append('<span id="tipsDumpTablePrefix"></span>');
  	var tipsDumpTablePrefixText = jsBizMultLan.atsManager_dataDumpConfigEdit_omit_7;
			
	var tipsDumpTablePrefixLog = '<div id="tipsDumpTablePrefix-dialog" style="display:none;border:solid 1px gray;border-radius:5px;width:42%;min-height:100px;position:absolute;left:55%;z-index:1;margin-top:0px;background: aliceblue;padding:5px;"><div ><font color="gray">'+tipsDumpTablePrefixText+'</font></div></div>';
	$("[title='"+jsBizMultLan.atsManager_dataDumpConfigEdit_i18n_0+"']").after(tipsDumpTablePrefixLog);
  },
  // 添加 tips 说明（？图片显示以及隐藏）
  addSocQueryTipA: function(tip) {
			var _self = this;
			var tips = $("#"+tip);
		
			var tipLog = tip+"-dialog";
			tips.prop("title", "");
			tips.css({"display": "inline-block"});
			var tipsLayout = $("#"+tipLog);
			tips.hover(function(event){
				event.stopImmediatePropagation();
				event.returnValue = false;
				tipsLayout.stop(true,true).fadeIn()
			},function(event){
				event.stopImmediatePropagation();
				event.returnValue = false;
				tipsLayout.stop(true,true).fadeOut()
			})
		
	}
});
