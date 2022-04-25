var listProposers = null;
shr.defineClass("shr.ats.AttenceGroupItemList", shr.framework.List, {
	rowNumPerPage : 15,
	editViewDisable: true,
	//listProposers : [], //每次增加人数信息的时候，增量增加员工信息
	initalizeDOM : function () {
		shr.ats.AttenceGroupItemList.superClass.initalizeDOM.call(this);	
		
		$(".span6").hide();
		//去掉多余的面包屑
		//$("#fastFilter-area").remove();
		//$("#searcher").remove();
//		if($("#breadcrumb").children().length ==3){
//		var breadHtml = $($("#breadcrumb").children()[1]).children("a").html();
//		$("#breadcrumb").children().last().html(breadHtml);
//		var list=document.getElementById("breadcrumb");
//		list.removeChild(list.childNodes[1]);
//		}
	/*	$("#breadcrumb").children().last().remove();
		$("#breadcrumb").children().last().find(".divider").remove();*/
		var that = this;
		
		
		jsBinder.gridLoadComplete=function(data){
			$("#grid_flowout").find(".s-ico").remove();//调出时间不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_flowout").removeClass("ui-jqgrid-sortable");
			$("#grid_flowoutadminorgunit").find(".s-ico").remove();//调出组织不支持排序，去掉该字段表头三角符号
			$("#jqgh_grid_flowoutadminorgunit").removeClass("ui-jqgrid-sortable");
			
			$("td[aria-describedby='grid_proposer.number']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_proposer.name']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_adminOrgUnit.displayName']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_position.name']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_hrOrgUnit.name']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_flowoutadminorgunit']").css("background-color","lightgrey");
			$("td[aria-describedby='grid_flowout']").css("background-color","lightgrey");
		};
		//if(!$("#edit").html()){
		////	$("button[name='addRow']").hide();
		//	$("button[name='delete']").hide();
	//	}
		if(!document.getElementById('edit')){
			$("button[name='addRow']").hide();
			$("button[name='delete']").hide();
		}
		document.onkeydown=function(event){
		var ids=event.currentTarget.activeElement.id;
		 var e = event || window.event || arguments.callee.caller.arguments[0];
         if(ids=='nameNum'){
		  if(e && e.keyCode==13){ // enter 键
                 //要做的事情
              test(); 
            } 
		 }
        };
		//var that = this;
		//that.initalSearch();
/*		document.onkeydown = function(event) {  
            var target, code, tag;  
            if (!event) {  
                event = window.event; //针对ie浏览器  
                target = event.srcElement;  
                code = event.keyCode;  
                if (code == 13) {  
                    tag = target.tagName;  
                    if (tag == "TEXTAREA") { return true; }  
                    else { return false; }  
                }  
            }  
            else {  
                target = event.target; //针对遵循w3c标准的浏览器，如Firefox  
                code = event.keyCode;  
                if (code == 13) {  
                    tag = target.tagName;  
                    if (tag == "INPUT") { return false; }  
                    else { return true; }   
                }  
            }
       };*/
	  $('#datagrid').find($('.view_manager_body')).css('margin-top', '0px');
		$('#datagrid').find($('.view_manager_header')).css('position', 'static');
	}
	,addRowAction:function(){
		var that = this;
		that.appendPersons();
	}
	
//	,
//	editsAction:function(){		
//		var $grid = $(this.gridId);
//		var selectedIds = $grid.jqGrid("getSelectedRows");
//		if (selectedIds.length == 0) {
//			shr.showWarning({message: "没有选中行!"});
//			return ;
//		}else if(selectedIds.length > 1) {
//			shr.showWarning({message: "只能选中一行!"});
//			return ;
//		}
//		this.reloadPage({
//			uipk: 'com.kingdee.eas.hr.ats.app.AttenceGroupItem.form',
//			copy:1,
//			billId:'RxQWdcglQKySRXZRJacSYAH0b4A=',
//			method: 'edit'
//		});
//	}
	,	
	initalSearch : function(){
	if(!document.getElementById('test')){
	//initPlaceHolders();//为了placeholder属性支持各个版本的浏览器  placeholder="请输入员工编码或姓名"
	//$('<div id="test" style="float:right"> <input id="nameNum" onclick="changeStyle(this.id)" value="请输入员工编码或姓名" type="text" title="环球集团"  class="block-father input-height"  name="proposer" validate="" value="" placeholder="" dataextenal="" ctrlrole="text"  style="padding:0 2px 0 15px;margin-right:400px;width: 276px;" /><span onclick="test()"  style="margin-right:8px"><i  class="icon-search icon-gray"></i></span></div>').insertAfter($('#breadcrumb'));
	//$('<div id="test" style="float:right"> <input id="nameNum"  placeholder="请输入员工编码或姓名" type="text"   class="block-father input-height"  name="proposer"  ctrlrole="text"  style="margin-right:900px;width: 276px;" />&nbsp&nbsp<span onclick="test()"  style="margin-right:2px"><i  class="icon-search icon-gray"></i></span></div>').insertAfter($('#breadcrumb'));
	
	$('<div id="searcher" class="pull-right"/>').insertAfter($('#addRowuuid6'));
	var searcherFields = [];
		searcherFields[0] = {columnName:"name",label:jsBizMultLan.atsManager_attenceGroupItemList_i18n_8};
		searcherFields[1] = {columnName:"number",label:jsBizMultLan.atsManager_attenceGroupItemList_i18n_10};
		var options = {
			gridId: "reportGrid",
			fields :searcherFields,
		};
		$("#searcher").shrSearchBar(options);
			
	}
	},
	appendPersons:function(){
		var that = this;
		//personForGroup.js
		var billId=shr.getUrlRequestParam("billId");
  		 var url = shr.getContextPath() + '/dynamic.do?method=initalize&uipk=com.kingdee.eas.hr.ats.app.ExistAttdFilePersonForGroup.list';
        url = shr.appendParam(url, {
            serviceId: shr.getUrlRequestParam("serviceId")
        });
 		url = shr.appendParam(url, {
            billId: shr.getUrlRequestParam("billId")
        });
		$("#iframe1").attr("src",url);
							$("#iframe1").dialog({
								modal : false,
								title : jsBizMultLan.atsManager_attenceGroupItemList_i18n_9,
								width : 1035,
								minWidth : 1035,
								height : 550,
								minHeight : 550,
								open : function(event, ui) {
								},
								close : function() {	
									that.appendDatas();
								}
							});
							
		$("#iframe1").attr("style", "width:1035px;height:550px;");
	}
	,appendDatas : function(){
		if(!listProposers){
			return null;
		}
		var usePolicy=$("#usePolicy").val();
		var that = this;
		var len = listProposers.length;
		//构造分录数据
	 	var items = [];
	 	for(var i=0;i<len;i++){
	 		var object = listProposers[i];
	 		var entrie = {
	 			proposer: correctValue(object["proposer.id"]),
	 		
	 			position: correctValue(object["position.id"]),
	 			
	 			adminOrgUnit: correctValue(object["adminOrgUnit.id"]),
	 			
	 			hrOrgUnit: correctValue(object["hrOrgUnit.id"]),
	 			
	 			startTime:correctValue(object["startTime"])
	
	 		}
	 		items.push(entrie);
	 	}
	 	//全局性的数据用完得清掉
	 	listProposers = null;
	 	if(items.length<1){
	 		return null;
	 	}
	 	openLoader(1,jsBizMultLan.atsManager_attenceGroupItemList_i18n_11);
		that.remoteCall({
			dataType:'json',
		 	type:"post",
			method:"saveBill",
			param:{itemsId:shr.toJSON(items),billId:jsBinder.billId,usePolicy:usePolicy},
			success:function(res){
				closeLoader();
				that.reloadGrid(); 
			}
			,complete: function() {
				closeLoader();
			}
		});
	},
	onCellSelect:function(rowid,iCol,cellcontent,e){
	var _self = this ;
	if(iCol==11){
		_self.addValsOnCellSelectPublicAction(this,iCol,rowid);
	}if(iCol==12){
		_self.addValsOnCellSelectPublicAction(this,iCol,rowid);
	}
	},
	addValsOnCellSelectPublicAction : function(pageUipk,columnNum,rowid){
		var _self = this;
		$("#iframe2").dialog({
			    title: jsBizMultLan.atsManager_attenceGroupItemList_i18n_3,
				width:950,
		 		height:600,
				modal: true,
				resizable: true,
				position: {
					my: 'center',
					at: 'top+55%',
					of: window
				},
				open : function(event, ui) {
				   _self.appendDynamicHTMLOnCellSelect(this,columnNum);
			    },
				close : function() {
					$("#iframe2").empty();
				},
				buttons: [{
					text: jsBizMultLan.atsManager_attenceGroupItemList_i18n_3,
					click: function(){
						$(this).disabled = true;
						_self.assginValueOnCellSelectAction(pageUipk,columnNum,rowid);
						$("#iframe2").empty();
						$("#iframe2").dialog("close");
					}
				},{
					text: jsBizMultLan.atsManager_attenceGroupItemList_i18n_5,
					click: function(){
						$("#iframe2").empty();
						$("#iframe2").dialog("close");
					}
				}]
			});	
			$("#iframe2").css({"height":"250px"});
			$("#iframe2").css({"margin-top":"5px"});
	},
	appendDynamicHTMLOnCellSelect: function(object,columnNum){
		var that = this;
		var html = '<form action="" id="form" class="form-horizontal" novalidate="novalidate">'
			 + '<div class="row-fluid row-block ">'
			 + '<div class="col-lg-4"><div class="field_label" style="font-size:13px;color:#000000;">'
			+ jsBizMultLan.atsManager_attenceGroupItemList_i18n_4
			+ '</div></div>'
			 + '</div>'
			 + '<div class="row-fluid row-block ">';
		
		if(columnNum==11){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attenceGroupItemList_i18n_6
				 + '">'
				 + jsBizMultLan.atsManager_attenceGroupItemList_i18n_6
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="startTime" name="startTime" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker"></div>'
		}
		
		if(columnNum==12){
			 html+= '<div class="col-lg-4"><div class="field_label" title="'
				 + jsBizMultLan.atsManager_attenceGroupItemList_i18n_7
				 + '">'
				 + jsBizMultLan.atsManager_attenceGroupItemList_i18n_7
				 + '</div></div>'
			 + '<div class="col-lg-6 field-ctrl"><input id="endTime" name="endTime" value="" validate="{dateISO:true}" placeholder="" type="text" dataextenal="" class="block-father input-height" ctrlrole="datepicker"></div>'
		}
		 	html+=  '</div>'
				 + '</form>';
		$(object).append(
				 html
				 );
		
		if(columnNum==11){
			$('#startTime').shrDateTimePicker({
				id: "EFFDT",
				tagClass: 'block-father input-height',
				readonly: '',
				yearRange: '',
				ctrlType: "Date",
				isAutoTimeZoneTrans:false,
				validate: '{dateISO:true}'
			});	
		}	
		if(columnNum==12){
			$('#endTime').shrDateTimePicker({
				id: "endTime",
				tagClass: 'block-father input-height',
				readonly: '',
				yearRange: '',
				ctrlType: "Date",
				isAutoTimeZoneTrans:false,
				validate: '{dateISO:true}'
			});	
		}	
		//要将form加上，数据校验才有用。
	    var formJson = {
			id: "form"
		};
		$('#form').shrForm(formJson);
	},
	assginValueOnCellSelectAction : function(pageUipk,columnNum,rowid)
	{
		var _self = this ;
		
			var clz = this;
			var $grid = $(clz.gridId);	
			var ids = $grid.jqGrid('getDataIDs');
			var personName=$grid.jqGrid("getCell",rowid,"proposer.name");
			var personNumber=$grid.jqGrid("getCell",rowid,"proposer.number");
			var personId=$grid.jqGrid("getCell",rowid,"proposer.id");
			var groupItemId=$grid.jqGrid("getCell",rowid,"id");
			var billId=shr.getUrlRequestParam("billId");
			if(columnNum==11){
				var effdt = atsMlUtile.getFieldOriginalValue("startTime");
				if(effdt!=null&&effdt!=""){
					var oldEffdt=$grid.jqGrid("getCell",rowid,"startTime");
					var oldEndTime=$grid.jqGrid("getCell",rowid,"endTime");
						if(new Date(effdt)<new Date(oldEffdt)){
							shr.showInfo({message: personName+personNumber+jsBizMultLan.atsManager_attenceGroupItemList_i18n_1+oldEffdt,hideAfter: 9});
							return;
						}
						if(new Date(effdt)>new Date(oldEndTime)){
							shr.showInfo({message: personName+personNumber+jsBizMultLan.atsManager_attenceGroupItemList_i18n_0+oldEffdt,hideAfter: 9});
							return;
						}
						var info ;
		 				clz.remoteCall({
						type:"post",
						method:"getErrorMsg",
						async: false,
						param:{id:billId,groupItemId:groupItemId,personId: personId,startTime:effdt},
						success:function(res){
							   info = res;
						}
					});
					if(info.errorMsg !=""){
					shr.showInfo({message: info.errorMsg,hideAfter: 9});
					return;
					}
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"startTime",effdt);
				}
			}
			if(columnNum==12){
				var effdt = atsMlUtile.getFieldOriginalValue("endTime");
				if(effdt!=null&&effdt!=""){
					var oldEffdt=$grid.jqGrid("getCell",rowid,"startTime");
						if(new Date(effdt)<new Date(oldEffdt)){
							shr.showInfo({message: personName+personNumber+jsBizMultLan.atsManager_attenceGroupItemList_i18n_2+oldEffdt,hideAfter: 9});
							return;
						}
						var info ;
		 				clz.remoteCall({
						type:"post",
						method:"getErrorMsg",
						async: false,
						param:{id:billId,groupItemId:groupItemId,personId: personId,endTime:effdt},
						success:function(res){
							   info = res;
						}
					});
					if(info.errorMsg !=""){
					shr.showInfo({message: info.errorMsg,hideAfter: 9});
					return;
					}
					isEdit=true;
					$grid.jqGrid("setCell",rowid,"endTime",effdt);
				}
			}
		}


});
function closeFrameDlg (ifameid,listDatas){
	listProposers = listDatas;
    $('#'+ifameid).dialog('close'); 
}
function test(){
			var param;
			var nameNum=$('#nameNum').val();
			$('#datagrid').empty();
			param = {"billId":jsBinder.billId,"nameNum":nameNum};  
			var url = shr.assembleURL('com.kingdee.eas.hr.ats.app.AttenceGroupItem.list$page','view',param);
			shr.loadHTML({ 
				url : url,			
				success : function(response) {
					$('#datagrid').append(response);
				}
			});
}
function correctValue(value){
	if(value == null || value == undefined || value.length < 1){
		return "";
	}
	return value;
}
function initPlaceHolders(){
    if('placeholder' in document.createElement('input')){ //如果浏览器原生支持placeholder
        return ;
    }
    function target (e){
        var e=e||window.event;
        return e.target||e.srcElement;
    };
    function _getEmptyHintEl(el){
        var hintEl=el.hintEl;
        return hintEl && g(hintEl);
    };
    function blurFn(e){
        var el=target(e);
        if(!el || el.tagName !='INPUT' && el.tagName !='TEXTAREA') return;//IE下，onfocusin会在div等元素触发 
        var    emptyHintEl=el.__emptyHintEl;
        if(emptyHintEl){
            //clearTimeout(el.__placeholderTimer||0);
            //el.__placeholderTimer=setTimeout(function(){//在360浏览器下，autocomplete会先blur再change
                if(el.value) emptyHintEl.style.display='none';
                else emptyHintEl.style.display='';
            //},600);
        }
    };
    function focusFn(e){
        var el=target(e);
        if(!el || el.tagName !='INPUT' && el.tagName !='TEXTAREA') return;//IE下，onfocusin会在div等元素触发 
        var emptyHintEl=el.__emptyHintEl;
        if(emptyHintEl){
            //clearTimeout(el.__placeholderTimer||0);
            emptyHintEl.style.display='none';
        }
    };
    if(document.addEventListener){//ie
        document.addEventListener('focus',focusFn, true);
        document.addEventListener('blur', blurFn, true);
    }
    else{
        document.attachEvent('onfocusin',focusFn);
        document.attachEvent('onfocusout',blurFn);
    }

    var elss=[document.getElementsByTagName('input'),document.getElementsByTagName('textarea')];
    for(var n=0;n<2;n++){
        var els=elss[n];
        for(var i =0;i<els.length;i++){
            var el=els[i];
            var placeholder=el.getAttribute('placeholder'),
                emptyHintEl=el.__emptyHintEl;
            if(placeholder && !emptyHintEl){
                emptyHintEl=document.createElement('span');
                emptyHintEl.innerHTML=placeholder;
                emptyHintEl.className='emptyhint';
                emptyHintEl.onclick=function (el){return function(){try{el.focus();}catch(ex){}}}(el);
                if(el.value) emptyHintEl.style.display='none';
                el.parentNode.insertBefore(emptyHintEl,el);
                el.__emptyHintEl=emptyHintEl;
            }
        }
    }
}
function changeStyle(id){
document.getElementById(id).value="";
}

