	shr.defineClass("shr.ats.turnInitBreadCrumb", shr.framework.Core, {
		initalizeDOM:function(){
			var that = this;
			shr.ats.turnInitBreadCrumb.superClass.initalizeDOM.call(this);
			//去除掉加载旋转的问题
			$("#loading-indicator--overlay").remove();
		    $("#loading-indicator-").remove();
		    //去除掉最后的一根线
		    $('.wz_navi_step').attr('style', 'width: 18%!important;') 
		    $(".wz_navi_step[index='5']").attr('style','border-bottom: none!important');
		    
		    that.initBreadCrumb();
			that.initEvent();
		},
		 initBreadCrumb: function(){
		 	var that = this;
			//形成主页
			var breadCrumbStr = '<div id="mainLink" style="float:left;padding:10px 2px 0 10px;"><a href="javascript:void(0);" ' 
			   + '	class="active" style="font-size:16px!important;color:#0088cc;">'
				+ jsBizMultLan.atsManager_turnShiftCommonStyle_i18n_1
				+ '</a> '
			   + '<span style="padding:0 5px;color:#ccc">/</span></div>';
					   
			$('#_wz_div').before(breadCrumbStr);
			
			//现在【排班向导】只有排班列表中进,而且进入的type = "another"
			if(shr.getUrlParam('type') && shr.getUrlParam('type') == 'another'){
				breadCrumbStr = '<div id="currentMenu" style="float:left;padding:10px 2px 0 0px;"><a href="javascript:void(0);" ' 
				   + '	class="active" style="font-size:16px!important;color:#0088cc;">'
					+ jsBizMultLan.atsManager_turnShiftCommonStyle_i18n_0
					+ '</a> '
				   + '<span style="padding:0 5px;color:#ccc">/</span></div>';
				$('#_wz_div').before(breadCrumbStr);
			}
			
			//获取当前选中的主题
			var currentTile = $('div[class="wz_navi_step enabled selected"]').find('.title').text();
			breadCrumbStr = '<div id="currentTile" class="active" style="float:left;font-size:16px;padding-top:10px;color:#999;">' + currentTile + '</div>';
					   
			$('#_wz_div').before(breadCrumbStr);
			
			that.initEvent();
			
		},
		//绑定导航栏事件
		 initEvent: function(){
		 	var that = this;
		 	var billId = shr.getUrlRequestParam("billId")
			//绑定主页事件
			$("#mainLink").live({
				click : function(){
					window.parent.parent.location = shr.getContextPath() + "/home.do";
				}
			});
			//如果有排班列表事件，绑定排班列表事件
			if($("#currentMenu").length > 0){
				$("#currentMenu").live({
					click : function(){
						if(billId){
							that.reloadPage({
								uipk: 'com.kingdee.eas.hr.ats.app.ScheduleShift.list',
								billId: billId
							});
						}else{
						    that.reloadPage({
								uipk: 'com.kingdee.eas.hr.ats.app.ScheduleShift.list'
							});
						}
						
				}
			});
			}
		}
	});
