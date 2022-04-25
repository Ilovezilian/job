	shr.defineClass("shr.ats.attendancePanelCommonStyle", shr.framework.Core, {
		initalizeDOM:function(){
			var that = this;
			shr.ats.attendancePanelCommonStyle.superClass.initalizeDOM.call(this);
			that.initSetPage();
			that.initBreadCrumb();
			that.initEvent();
		
		},
		initSetPage:function(){
			
			 //调整上一步下一步的位置
			$("div[class='wz_oper top']").css("margin-top","-40px");  
			$("div[class='wz_oper top'] button").css("margin-top","-10px");
			$("div[class='wz_navi'] > div").eq(2).css("width","200px").css("border","0px");
			$("div[class='wz_navi'] > div").eq(1).css("width","420px");
			$("div[class='wz_navi'] > div").eq(0).css("width","450px");
			$(".wz_navi_step .index").css("margin-top","10px");
			$(".wz_navi").css("height","60px");
			$(".wz_navi_step").css("height","30px");
			
		}
		,
		 initBreadCrumb: function(){
		 	var that = this;
			//形成主页
		 	$('#mainLink').remove();
		 	$('#currentTile').remove();
			var breadCrumbStr = '<div id="mainLink" style="float:left;padding:10px 2px 0 10px;"><a href="javascript:void(0);" ' 
			   + '	class="active" style="font-size:16px!important;color:#0088cc;">'
				+ jsBizMultLan.atsManager_attendancePanelCommonStyle_i18n_0
				+ '</a> '
			   + '<span style="padding:0 5px;color:#ccc">/</span></div>';
					   
			$('#_wz_div').before(breadCrumbStr);
			
			//获取当前选中的主题
			var currentTile = $('div[class="wz_navi_step enabled selected"]').find('.title').text();
			breadCrumbStr = '<div id="currentTile" class="active" style="float:left;font-size:16px;padding-top:10px;color:#999;">' + currentTile + '</div>';
					   
			$('#_wz_div').before(breadCrumbStr);
			
			that.initEvent();
			
		},
		//绑定导航栏事件
		 initEvent: function(){
		 	var that = this;
			//绑定主页事件
			$("#mainLink").live({
				click : function(){
					window.parent.parent.location = shr.getContextPath() + "/home.do";
				}
			})
		}
	});
