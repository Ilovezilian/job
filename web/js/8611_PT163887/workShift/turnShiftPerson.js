shr.defineClass("shr.ats.turnShiftPerson",shr.framework.List, {
	initalizeDOM:function(){
		var that = this;
		$('#breadcrumb').parent().parent().hide();
		shr.ats.turnShiftPerson.superClass.initalizeDOM.call(this);
		var hrOrgUnit = shr.getUrlRequestParam("hrOrgUnit");
		$(this.gridId).jqGrid('option', {onSelectRow :that.onSelectRow});
        $.shrFastFilter.setPromptGridUrl(['attencePolicy'],{"params":encodeURIComponent([hrOrgUnit])});
        $.shrFastFilter.setPromptGridUrl(['attenceGroup'],{"params":encodeURIComponent([hrOrgUnit])});
	},
	viewAction:function(){},
	gridLoadComplete: function(ret){
		var that = this;
		shr.ats.turnShiftPerson.superClass.gridLoadComplete.call(this,ret);
		var selectNum = [];
		window.parent.$(".field_list").find(".text-tag").map(function(){
			selectNum.push(this['id']);
		});
		$(that).jqGrid("getRowData").forEach(function(row){
			selectNum.forEach(function(num){
				if(row["person.number"] == num){
					$(that).jqGrid("setSelection",row.id,false);
					return;
				}
			})
		})
	},
	onSelectAll: function(aRowids,status){
		var personNum = "",personName = "",value = "";
		var hasName = false;
		if(status){
			for(var i = 0;i<aRowids.length && aRowids != "";i++){
				personNum = $(this.gridId).jqGrid("getCell", aRowids[i], "person.number");
		 		personName = $(this.gridId).jqGrid("getCell",aRowids[i], "name");
				hasName = false;
				window.parent.$(".field_list").find(".text-tag").each(function(){
					//用编号数字去比较，效率更快
					if(this['id'] == personNum){
						hasName = true;
						return;
					}
				});
				value = personName+"&nbsp;&nbsp;[" + personNum + "]";
		  		if(!hasName){
		  			window.parent.$(".field_list").append('<div class="text-tag" id="'+personNum+ '">'
						 		+ '<span class="text-label" title="' + value+  '">' + value + '</span>'
						 		+ '<span class="text-remove" title="' 
						 		+ jsBizMultLan.atsManager_turnShiftPerson_i18n_2 
						 		+ '" style="display:"";">x</span>'
						 	+'</div>');
				}	
			}
		}
		else{
			for(var i = 0;i<aRowids.length && aRowids != "";i++){
				personNum = $(this.gridId).jqGrid("getCell", aRowids[i], "person.number");
				window.parent.$(".field_list").find(".text-tag").each(function(){
					//用编号数字去比较，效率更快
					if(this['id'] == personNum){
						$(this).remove();
						return;
					}
				});
			}
		}
	}
	,onSelectRow:function(rowid,status){
		var personNum = $(this).jqGrid("getCell", rowid, "person.number");
	 	var personName = $(this).jqGrid("getCell", rowid, "name");
		if(status){
			var hasName = false;
			window.parent.$(".field_list").find(".text-tag").each(function(){
				//用编号数字去比较，效率更快
				if(this['id'] == personNum){
					hasName = true;
					return;
				}
			});
			var value = personName+"[" + personNum + "]";
		  	if(!hasName){
		  		window.parent.$(".field_list").append('<div class="text-tag" id="'+personNum+ '">'
						 		+ '<span class="text-label" title="' + value+  '">' + value + '</span>'
						 		+ '<span class="text-remove" title="' 
						 		+ jsBizMultLan.atsManager_turnShiftPerson_i18n_2 
						 		+ '" style="display:"";">x</span>'
						 	+'</div>');
			}	
		}
		else{
			window.parent.$(".field_list").find(".text-tag").each(function(){
				//用编号数字去比较，效率更快
				if(this['id'] == personNum){
					$(this).remove();
					return;
				}
			});
		}
	},
    
	confirmAction:function(){
	
		var that = this;
		var field_list = window.parent.$(".field_list .text-tag");
		if(!field_list || field_list.length < 1 
		|| (field_list.length == 1 && field_list[0].id == "false")){
			var options={message:jsBizMultLan.atsManager_turnShiftPerson_i18n_1};
			$.extend(options, {
							type: 'error',
							hideAfter: 3,
							showCloseButton: true
			});
			top.Messenger().post(options);
		    return false;
		}
	  
		var switchType = sessionStorage.getItem("switchType");
		if(field_list && field_list.length > 500 && "3" == switchType ){
			shr.showError({message : jsBizMultLan.atsManager_turnShiftPerson_i18n_0,hideAfter:3});
		    return false;
		}
		window.parent.initPersonList();  //初始化人员列表
		sessionStorage.setItem("flag","true");	//设置标记表示是通过确定按钮关闭的窗口
		window.parent.$("#operationDialog").dialog('close');
	    return true;
	}
});