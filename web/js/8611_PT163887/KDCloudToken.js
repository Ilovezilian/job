shr.defineClass("shr.ats.KDCloudToken", shr.framework.Core, {
	initalizeDOM:function(){
		shr.ats.KDCloudToken.superClass.initalizeDOM.call(this);
		var _self = this;
		$('body').append(_self.getCaptionDivHtml());
		_self.checkServerNameWhiteList();
		$('#workAreaDiv').height(850); 
		$("#myContent").attr('height',$('#workAreaDiv').height()-$('.view_manager_header').height()-50);
	    $("#myContent").attr("style","border:none;")
	    var url=shr.getContextPath()+'/dynamic.do?method=band4Oauth&uipk=com.kingdee.eas.hr.ats.app.KDCloudToken'+'&schemal='+document.location.protocol+'&port='+document.location.port;
		$("#myContent").attr("src",url);
	}
	,checkServerNameWhiteList : function(){
		 var _self = this;
		 var uipk = shr.getUrlRequestParam("uipk")
		 var url = shr.getContextPath() + "/dynamic.do?uipk="+uipk+"&method=checkServerNameWhiteList";
		 shr.ajax({
				type:"post",
				async:true,
				url:url,
				success:function(res){
			 		if(!res.flag){
			 			var text  = shr.formatMsg(jsBizMultLan.atsManager_KDCloudToken_i18n_3
							+ jsBizMultLan.atsManager_KDCloudToken_i18n_0, [res.cloudHub,  "<br>", res.filePath, res.cloudHub]);
			 			text += "<br>" + shr.formatMsg(jsBizMultLan.atsManager_KDCloudToken_i18n_1,[res.filePath]) + "<br><br>";
			 			text +=	'&lt;init-param&gt;<br>';
			 			text +=	'&nbsp;&nbsp;&lt;param-name&gt;serverNameWhiteList&lt;/param-name&gt;<br>';
			 			if(res.serverNameWhiteList==""){
			 				text +=	'&nbsp;&nbsp;&lt;param-value&gt;'+res.cloudHub+'&lt;/param-value&gt;<br>';	
			 			}else{
			 				text +=	'&nbsp;&nbsp;&lt;param-value&gt;'+res.serverNameWhiteList+','+res.cloudHub+'&lt;/param-value&gt;<br>';			 				
			 			}
			 			text +=	'&lt;/init-param&gt;<br>';
			 		      
				 		$('#caption-content').html(text);
				 		$('#caption_div').modal().css({
				 		    width: '800px',
				 		    'margin-left': function () {
				 		       return -($(this).width() / 2);
				 		   }
				 		});
				 		$('#caption_div').modal('show');
			 		}
			    }
		 });
	}
	,getCaptionDivHtml: function() {		
		return ['<div id="caption_div" class="modal hide fade">',
				    '<div class="modal-header">',
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
						'<h5>'
						+ jsBizMultLan.atsManager_KDCloudToken_i18n_2
						+ '</h5>',
					'</div>',
					'<div id="caption-content"  class="modal-body">',
					'</div>',
				'</div>'].join('');
	}
});	