shr.defineClass("ats.dev", shr.framework.Core, {
	baseUrl:"",
	commonHandler:"AtsCommonHandler",
	testHandler:"AtsTestHandler",
	initalizeDOM: function() {
		var that = this;
		that.baseUrl = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.handler.";
		shr.getUrlRequestParam("initialed") || this.doAjax(this.commonHandler,"getServerList",{async:false});
		shr.getUrlRequestParam("debug") || (location.href +="&debug=true&inFrame=true&initialed=true");
		this.doAjax(this.commonHandler,"getServer");
	}
	,downLoadFileAction:function(){
		var that = this;
		var logs = [];
		for(var i = 0;i < 0;i++){
			logs.push("server/shr_ats_log/shr_ats_punchcard_log/getkdcloudpunchcard.log" + (i== 0 ? "" : "." + i));
		}
		for(var i = 0;i < 0;i++){
			logs.push("server/shr_ats_log/workShift/workShift.log" + (i== 0 ? "" : "." + i));
		}
		for(var i = 0;i < 0;i++){
			logs.push("server/shr_ats_log/ats.log" + (i== 0 ? "" : "." + i));
		}
		var jarNames = [];
		jarNames.push("attendmanage");
		jarNames.push("ats-server");
		jarNames.push("ats-metas");
	    
//      logs.push("server/deploy/easweb.ear/shr_web.war/addon/attendmanage/web");
		
		var apusicLog = [];
		for(var i = 0;i < 0;i++){
			apusicLog.push("KSqlD.V60SP1.log" + (i== 0 ? "" : "." + i));
		}
		for(var i = 0;i < 0;i++){
			apusicLog.push("workflow.log" + (i== 0 ? "" : "." + i));
		}
		for(var i = 0;i < 0;i++){
			apusicLog.push("scheduler.log" + (i== 0 ? "" : "." + i));
		}
		for(var i = 0;i < 1;i++){
			apusicLog.push("apusic.log." + i);
		}
		//这个对象服务器由动态初始化
		var apusicServerList = [];
		apusicLog.forEach(function(name){
			apusicServerList.forEach(function(serverName){
				logs.push("server/profiles/" + serverName + "/logs/" + name);
			})
		})
		var url = that.baseUrl + that.commonHandler + "&method=downLoadFile";
		var form = $("<form></form>").attr("action",url).attr("method","POST");
		form.append("<input name='logs' value='" + JSON.stringify(logs) + "' />");
		//form.append("<input name='jarNames' value='" + JSON.stringify(jarNames) + "' />");
		form.appendTo("body").submit().remove();
	}
	,customAction:function(event,subAction){
		if (!subAction) {
			return;
		}
		var _self = this
		var subActionFunction = _self[subAction];
		var returnValue;
		if (subActionFunction) {
			subActionFunction.call(this, event);
			return; 
		}
		var method = $(event.target).attr("id");
		this.doAjax(method.toLowerCase().indexOf("test")> -1 ? this.testHandler : this.commonHandler,method);
	}
	,methodCostAnalizeAction:function(event){
		var handler = this.commonHandler;
		handler += "&ignoreJdkMethod=true";
		handler += "&analizeClass=com.kingdee.shr.ats.web.handler.AtsCommonHandler";
		handler += "&analizeMethod=getServerAction";
		this.doAjax(
			handler,
			$(event.target).attr("id")
		);
	}
	,fetchMethodCostResultAction:function(event){
		var downLoadModel = false;
		var method = $(event.target).attr("id");
		var url = this.commonHandler + "&downLoadModel=" + downLoadModel + "&method=" + method;
		if(downLoadModel){
			window.open(this.baseUrl + url);
		}else{
			this.doAjax(url,method,{msgShowTime:1000});
		}
		
	}
	,enableKSQLAction:function(){
		this.setKSQLStatus(true);
	}
	,disableKSQLAction:function(){
		this.setKSQLStatus(false);
	}
	,setKSQLStatus:function(enable){
		var param =  [{
			class:"com.kingdee.bos.sql.shell.trace.ConnectionLogger",
			method:"setFilterTime",
			value:"true"
		},{
			class:"com.kingdee.bos.sql.shell.trace.ConnectionLogger",
			method:"setFilterTimeThreshold",
			value:enable ? 0 : 5000
		},{
			class:"com.kingdee.bos.sql.shell.trace.ConnectionLogger",
			method:"setOutput",
			value:enable ? "true" : "false"
		}];
		this.setStaticParamAction(param);
	
	}
	,enableScheduleLogAction:function(){
		this.setScheduleLog(true);
	}
	,disableScheduleLogAction:function(){
		this.setScheduleLog(false);
	}
	,setScheduleLog:function(enable){
		var param =  [{
			class:"com.kingdee.eas.hr.ats.util.common.ConfigAts",
			field:"LOG_LEVEL_SCHEDULEL",
			value:enable ? "info" : "error"
		}];
		this.setStaticParamAction(param);
	}
	,setStaticParamAction : function(classParams){
		this.doAjax(this.commonHandler,"setStaticParam",{classParams:JSON.stringify(classParams)});
	}
	,updateConfigFileAction:function(){
		this.doAjax(this.commonHandler,"updateConfigFile",
			{
				updateParams:JSON.stringify({
					LOG_LEVEL_COMMON:"error",
					LOG_LEVEL_SCHEDULEL:"error",
					LOG_LEVEL_PUNCHCARD_SYN:"info"
				})
			}
		);
	}
	,updateOtherAction:function(){
		//要加的参数加到这里
		var classParams = {
			test : true
		}
		this.doAjax(this.commonHandler,"updateConfigFile",{updateParams:JSON.stringify(classParams)});
	}
	,execScriptAction : function(){
		this.doAjax(this.commonHandler,"exeScript");
	}
	,doAjax:function(handler,method,data){
		var that = this;
		that.print("...");
		var msgShowTime = data && data.msgShowTime || 3;
		$.ajax({
			type:"get",
			async: data && data.async === false ? false : true,
			url:that.baseUrl + handler + "&method=" + method,
			data: data,
			success:function(res){
				that.print(res);
				shr.showInfo({message: JSON.stringify(res),hideAfter: msgShowTime});
				res && res.data && res.data.serverCount && that.buildLogHref(res);
			},
			error:function(res){
				that.print(res);
				shr.showInfo({message: JSON.stringify(res),hideAfter: msgShowTime});
			}
		})
	}
	,buildLogHref:function(res){
		if($("#atsServer").length > 0){
			$("#atsServer").remove();
		}
		var atsServer = $("<div id='atsServer' style='display:inline-block'></div>");
		$("#getServer").after(atsServer);
		$("<div id='atsServerParam' style='display:inline-block' client=" + res.data.client + " server=" + res.data.server + " serverCount=" + res.data.serverCount + ">"
			+ jsBizMultLan.atsManager_dev_i18n_0
			+ "</div>").appendTo(atsServer);
		var logUrl = location.protocol + "//" + location.host;
		logUrl = logUrl + "/shr/appData.do?method=getApplicationLog&instance=" + res.data.server + "&needBreak=true&logFile=";
		var logName;
		for(var i = 0;i < 2;i++){
			logName = "apusic.log." + i;
			$("<a style='padding-left:10px;display:inline-block' href='" + logUrl + logName + "'>" + logName + "</a>").appendTo(atsServer);
		}
		for(var i = 0;i < 2;i++){
			logName = "KSqlD.V60SP1.log" + (i == 0 ? "" : "." + i);
			$("<a style='padding-left:10px;display:inline-block' href='" + logUrl + logName + "'>" + logName + "</a>").appendTo(atsServer);
		}
	}
	,print : function(msg){
		$('.printPane').addClass('old').hide();
		$('.view_manager_body').html('<div style="width:200px">' + new Date().toLocaleString() + '</div><div class="printPane">' + (typeof msg == 'object' ? JSON.stringify(msg) : msg) + '</div>');
	}
})

