var jobFilter = "400!"
shr.defineClass('shr.ats.DataDumpConfigList', shr.framework.List, {
  initalizeDOM: function() {
    shr.ats.DataDumpConfigList.superClass.initalizeDOM.call(this);
    var that = this;
  },
  dumpAction: function() {
    var _self = this;
    var hasDisable = false;
    var dumpTableNameConcat = '';
    var sid = $('#grid').jqGrid('getSelectedRows');
    for (var i in sid) {
      var item = sid[i];
      var data = $('#grid').jqGrid('getRowData', item);
      var isEnable = data['isEnable'];
      if(isEnable == 1){
	      var dumpTableName = data['tableName'];
	      if (dumpTableName != undefined) {
	      	if(dumpTableNameConcat!=''){
	      		dumpTableNameConcat +=",";
	      	}
	      	dumpTableNameConcat += dumpTableName;
	      }
      }else {
      	hasDisable = true;
      	 break;
      }
    }
    if(hasDisable){
    	 shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigList_i18n_10});
      	 return;
    }
    
    if (dumpTableNameConcat == '') {
//      	shr.showConfirm(jsBizMultLan.atsManager_dataDumpConfigList_symbol_2, function() {
      	shr.showConfirm(jsBizMultLan.atsManager_dataDumpConfigList_i18n_3, function() {
	        top.Messenger().hideAll();
//	        _self.doRemoteAction({
//	          method: 'dump'
//	        });
	        var data = {
	          method: 'dump'
			};
			data = $.extend(_self.prepareParam(), data);
			shr.doAction({
				url: _self.dynamicPage_url,
				type: 'post', 
				data: data,
				success : function(res) {	
					if(res.flag == 3){
						shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigList_i18n_7});
					}
				},
				error: function(response) {
					shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigList_i18n_11});
				}
			});	
      	});
    }else{
//    	shr.showConfirm(jsBizMultLan.atsManager_dataDumpConfigList_symbol_0, function() {
    	shr.showConfirm(jsBizMultLan.atsManager_dataDumpConfigList_i18n_4, function() {
	        top.Messenger().hideAll();
//	        _self.doRemoteAction({
//	          method: 'dump',
//	          dumpTableName: dumpTableNameConcat
//	        });
	        var data = {
	          method: 'dump',
	          dumpTableName: dumpTableNameConcat
			};
			data = $.extend(_self.prepareParam(), data);
			shr.doAction({
				url: _self.dynamicPage_url,
				type: 'post', 
				data: data,
				success : function(res) {	
					if(res.flag == 3){
						shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigList_i18n_7});
					}
				},
				error: function(response) {
					shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigList_i18n_11});
				}
			});	
   		});
    }
    
  },
  antiDumpAction: function() {
    var _self = this;
    var dumpTableNameConcat = '';
    var sid = $('#grid').jqGrid('getSelectedRows');
    for (var i in sid) {
      var item = sid[i];
      var data = $('#grid').jqGrid('getRowData', item);
      var isEnable = data['isEnable'];
      if(isEnable){
	      var dumpTableName = data['tableName'];
	      if (dumpTableName != undefined) {
	      	if(i>0){
	      		dumpTableNameConcat +=",";
	      	}
	      	dumpTableNameConcat += dumpTableName;
	      }
      }else {
      	shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigList_i18n_9});
      	 return;
      }
    }
    if (dumpTableNameConcat == '') {
//      	shr.showConfirm(jsBizMultLan.atsManager_dataDumpConfigList_symbol_1, function() {
    	shr.showConfirm(jsBizMultLan.atsManager_dataDumpConfigList_i18n_1, function() {
	        top.Messenger().hideAll();
//	        _self.doRemoteAction({
//	          method: 'antiDump'
//	        });
	        var data = {
	          method: 'antiDump'
			};
			data = $.extend(_self.prepareParam(), data);
			shr.doAction({
				url: _self.dynamicPage_url,
				type: 'post', 
				data: data,
				success : function(res) {	
					if(res.flag == 3){
						shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigList_i18n_8});
					}
				},
				error: function(response) {
					shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigList_i18n_0});
				}
			});	
      	});
    }else{
//    	shr.showConfirm(jsBizMultLan.atsManager_dataDumpConfigList_symbol_3, function() {
    	shr.showConfirm(jsBizMultLan.atsManager_dataDumpConfigList_i18n_2, function() {
	        top.Messenger().hideAll();
//	        _self.doRemoteAction({
//	          method: 'antiDump',
//	          dumpTableName: dumpTableNameConcat,
//          });
			var data = {
	          method: 'antiDump',
	          dumpTableName: dumpTableNameConcat
			};
			data = $.extend(_self.prepareParam(), data);
			shr.doAction({
				url: _self.dynamicPage_url,
				type: 'post', 
				data: data,
				success : function(res) {	
					if(res.flag == 3){
						shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigList_i18n_8});
					}
				},
				error: function(response) {
					shr.showInfo({ message: jsBizMultLan.atsManager_dataDumpConfigList_i18n_0});
				}
			});		
   		});
    }
  },
   //查看后台事务
  viewTransactionAction: function() {
    var serviceId = shr.getUrlRequestParam('serviceId');
    var url = shr.getContextPath() + '/dynamic.do?uipk=com.kingdee.eas.base.job.app.JobInst.list' + '&serviceId=' + encodeURIComponent(serviceId);
    $('#dialogTransaction')
      .children('iframe')
      .attr('src', url);
    $('#dialogTransaction').dialog({
      width: 1150,
      height: 750,
      modal: true,
      resizable: false,
      draggable: true,
      position: {
        my: 'center',
        at: 'center',
        of: window
      }
    });
    $('#dialogTransaction').css({ height: 750 });
  },
  onCellSelect: function(rowid, colIndex, cellcontent, e) {
    var _self = this;
	_self._initSelectedRowIdAndSelectRowData();
	// 选择的是选择框
	if (colIndex == 0) {
		var checked = $(_self.gridId).jqGrid('isChecked', rowid);
		if (!checked) {
			var index = $.inArray(rowid, _self.selectedRowId);
			_self.selectedRowId.splice(index, 1);
		}
		return;
	}	
    var data = $('#grid').jqGrid('getRowData', rowid);
    var dumpTableName = data['dumpTableName'];
    var dumpName = data['name'];
    if (colIndex == '5') {
//    	if($("#tipsDumpTablePrefix-dialog").css("display") == undefined || $("#tipsDumpTablePrefix-dialog").css("display")=='none'){
	    	_self.viewDumpTableNameList(dumpTableName,dumpName);
//    	}else {
//	    	$("#tipsDumpTablePrefix-dialog").css("display","none");
//    	}
    }else {
    	shr.ats.DataDumpConfigList.superClass.onCellSelect.call(this, rowid, colIndex, cellcontent, e);
    }
  },
  viewDumpTableNameList: function(dumpTableName,dumpName) {
  	var that = this;
  	var params = {
      dumpTableName: dumpTableName
    };
     var serviceId = encodeURIComponent(shr.getUrlRequestParam('serviceId'));
      shr.ajax({
          type: 'post',
          url: shr.getContextPath() + '/dynamic.do?uipk=com.kingdee.eas.hr.ats.app.DataDumpConfig.list&method=getDumpTableNameList&serviceId=' + serviceId,
          data: params,
          success: function(res) {
           that.showDumpTable(dumpTableName,res,dumpName);
          }
        });
        
  },
  showDumpTable: function(dumpTableName,tableNameList,dumpName){
	  	var tipsDumpTablePrefixText = "";
	  	if(tableNameList && tableNameList.length > 0){
	  		for(var i=0;i<tableNameList.length;i++){
	  			if(tipsDumpTablePrefixText != ""){
	  				if(i%3 == 0){
	  					tipsDumpTablePrefixText +="</br>";
	  				}else{
		  				tipsDumpTablePrefixText +=", ";
	  				}
	  			}
	  			tipsDumpTablePrefixText += tableNameList[i];
	  		}
	  	}
	  	
	  	var dataDumpText = dumpName+jsBizMultLan.atsManager_dataDumpConfigList_i18n_5 + "<br/>";
	  	if(tipsDumpTablePrefixText == ""){
	  		tipsDumpTablePrefixText = jsBizMultLan.atsManager_dataDumpConfigList_i18n_6;
	  	}
	  	if($("#tipsDumpTablePrefix-dialog").html() === "" || $("#tipsDumpTablePrefix-dialog").html() === null){
			var tipsDumpTablePrefixLog = '<div id="tipsDumpTablePrefix-dialog" style="border:solid 1px gray;border-radius:5px;width:38%;min-height:100px;position:absolute;z-index:1;margin-top:0px;background: aliceblue;padding:5px;"><div ><font color="gray">'+dataDumpText+tipsDumpTablePrefixText+'</font></div></div>';
			$("[title='"+dumpTableName+"']").after(tipsDumpTablePrefixLog);
	  	}else {
	  		$("#tipsDumpTablePrefix-dialog").html(dataDumpText+tipsDumpTablePrefixText);
	  		$('#tipsDumpTablePrefix-dialog').show();
	        
	  	}
	      $('#tipsDumpTablePrefix-dialog').hover(
		      function() {},
		      function() {
		        if (!$(this).is(':hidden')) {
		          $('#tipsDumpTablePrefix-dialog').fadeOut('normal', function() {
		          	$('#tipsDumpTablePrefix-dialog').remove();
		          });
		        }
	      	});
	  }
	});

function getJobFilter() {
	return "jobDefCategory.longNumber like '401!%'";
}
