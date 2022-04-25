var thisObject = null;
var atsCalGobalParam = {};//用于未参与计算单据传参
var currentCalUrl = "com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList";//记录考勤计算当前访问的URL
shr.defineClass("shr.ats.atsResultBaseDynamicList", shr.framework.DynamicList, {
	pageStep: 0,
	//attendPeriodId : null,
	dateSelectName: "attendancePeriod",
	atsPeriodObj: null,
	attendPeriods:[],
	isFirstLoad: true,
	selectedHrOrgIds:[],
	initalizeDOM : function () {
		var _self = this;	
		
		_self.atsPeriodObj = null;
		thisObject = _self;//用于F7回调回后调用方法
		//初始化TAB页签
		_self.initTabPages();
		
		this.processF7ChangeEvent();
		
		shr.ats.atsResultBaseDynamicList.superClass.initalizeDOM.call(_self);
		
		if(shr.getUrlParams().currentCalUrl && shr.getUrlParams().currentCalUrl != ''){
			currentCalUrl = shr.getUrlParams().currentCalUrl;
		}
		
		if(_self.isFirstLoadData){
			if($(".filter-containers").is(":hidden")){
				$("#filter-slideToggle").click();
			}
		}
		
		_self.isFirstLoadData = false;
	},
	getPageState: function(){
		var _self = this;
		_self.fastFilterMap = null;
		return shr.ats.atsResultBaseDynamicList.superClass.getPageState.call(this);
	},
	reLoadPageState: function() {
		if (this.requireSavePageState) {
			var pageState = this.getSavedPageState();
			if (pageState && pageState.filter) {
				this.setPageState(pageState);				
				this.clearSavedPageState();
			}else{
				var lastAtsFilter = JSON.parse(localStorage.getItem('lastAtsFilter'));
				if(lastAtsFilter){
					$('#searcher').shrSearchBar('setFilterView', lastAtsFilter);
				}
			}
			shrDataManager.pageStateStore.check();
		}
	},
	queryGridByEvent: function(e){
		var uipkArr = shr.attenceCalCommon.getCachedUipk();
		//处理快速过滤
		setTimeout(function(){
			var uipk = jsBinder.uipk
			var arr = Object.keys(localStorage).filter(function(item){return item.indexOf(uipk + '#fastFilterItems') >= 0});
			for(var k=0; k<uipkArr.length; k++){
				var otherUipkKey = uipkArr[k];
				for(var i=0;i<arr.length;i++){
					var preKey = arr[i];
					var key = preKey.replace(uipk, otherUipkKey);
					localStorage.setItem(key, localStorage.getItem(preKey));
				}	
			}
			
			//处理精确搜索	
			var filter = jsBinder.getPageState().filter;
			if(filter){
				localStorage.setItem('lastAtsFilter', JSON.stringify(filter));
			}
			//父类方法
			var viewPage;
			if (e.target) {
				viewPage = shr.getCurrentViewPage(e.target);
			} else {
				viewPage = shr.getCurrentViewPage(e);
			}
			
			// 将页码恢复为第1页
			$(viewPage.gridId).jqGrid('option', 'page', 1);
			viewPage.queryGrid();			
		}, 10)
		
	},
	initalizeQueryGrid: function() {
		var $search = $('#searcher');
		var filter = $search.shrSearchBar('option', 'filterView');
		if ($.isEmptyObject(filter)) {
			// 如果filter为空
			if (!$.isEmptyObject($search.shrSearchBar('option', 'defaultViewId'))) {
				// 加载默认过滤方案触发表格取数
				$search.shrSearchBar('chooseDefaultView');
			} else {
				$("#filter-search").trigger('click');
			}
		} else {
			// 如果filter为非空，则直接查询表格数据
			$("#filter-search").trigger('click');
		}
	}
	,
	initTabPages: function(){
	    var that = this;
		that.changePageLabelColor();
		
		//明细计算
		$('#calAttendPersonList').click(function(){ 
			that.pageStep = 0;
			//定义标签样式
			that.changePageLabelColor();
			var serviceUrl = "com.kingdee.eas.hr.ats.app.AttenceResultSum.list";
			if(currentCalUrl || currentCalUrl != ""){
				serviceUrl = currentCalUrl;
			}else {
				serviceUrl = shr.attenceCalCommon.getAtsCalServiceUrl();
			}
			if(serviceUrl && (serviceUrl == "com.kingdee.eas.hr.ats.app.AttendanceResult.dynamicList" || serviceUrl =="com.kingdee.eas.hr.ats.app.AttenceResultSum.list")){
				that.reloadPage({
					uipk: serviceUrl
		    	});
			}else {
				that.reloadPage({
					uipk: 'com.kingdee.eas.hr.ats.app.AttenceResultSum.list'
		    	});	
			}
		});
		
		//汇总计算
		$('#sumPersonList').click(function(){ 
			that.pageStep = 1;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResultSum.dynamicList',
				currentCalUrl: currentCalUrl
		    });	
		});
		
		//已转薪资计算
		$('#salaryPersonList').click(function(){ 
			that.pageStep = 2;
			//定义标签样式
			that.changePageLabelColor();
			that.reloadPage({
				uipk: 'com.kingdee.eas.hr.ats.app.AttendanceResultSalary.dynamicList',
				currentCalUrl: currentCalUrl
		    });	
		});
	},
	changePageLabelColor:function(){
		var that = this;
		$("#pageTabs").tabs(); 
		$("#pageTabs").find('ul li').eq(that.pageStep).removeClass("ui-state-default ui-corner-top").addClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active")
		.siblings().removeClass("ui-state-default ui-corner-top ui-tabs-active ui-state-active").addClass("ui-state-default ui-corner-top");
		$("#pageTabs").find('ul li a').css('border','0px');
		$("#pageTabs").find('ul li a').eq(that.pageStep).removeClass("colNameType").addClass("fontGray")
		.siblings().removeClass("fontGray").addClass("colNameType");
	},
	// 根据动态列表配置 取业务主键
	getBillIdFieldName: function() {
		return 'person.id';
	},
	processF7ChangeEvent : function(){
		var self = this;
		$.shrFastFilter.registerEventAfterF7ConfirmClick(self.F7ClickCallBack);
		$.shrFastFilter.registerEventAfterSpanClick(self.spanClickCallBack);
		
		var attencePolicyId = shr.attenceCalCommon.getFilterParamValues("attencePolicy");
		if(attencePolicyId && attencePolicyId != ''){
			$.shrFastFilter.setPromptGridUrl(['attendancePeriod'],{"attencePolicyId":encodeURIComponent(attencePolicyId)});
		}
		
		self.setAttendancePeriod(shr.attenceCalCommon.getFilterParamValues("attendancePeriod"));
	},
	//根据考勤制度获取考勤周期明细 
  	setAttendancePeriod:function(attendancePeriodId){
  		var self = this;
  		if( attendancePeriodId && attendancePeriodId != "")
  		{
  			 var url = shr.getContextPath() + "/dynamic.do?handler=com.kingdee.shr.ats.web.util.DynaSummaryResultHelper&method=getAttendancePeriod&attendancePeriodId="+encodeURIComponent(attendancePeriodId);
			 shr.ajax({
					type:"post",
					async:false,  
					url:url, 
					success : function(res){
						if(res && res.length > 0){
							self.atsPeriodObj = res[0];
							var dateStartObj = $('#'+self.dateSelectName.replace(".","--")+'-datestart');
							var dateEndObj = $('#'+self.dateSelectName.replace(".","--")+'-dateend');
							if(dateStartObj && dateEndObj){
				  				dateStartObj.shrDateTimePicker('setValue', self.atsPeriodObj.startDate);
								dateEndObj.shrDateTimePicker('setValue', self.atsPeriodObj.endDate);
								dateStartObj.trigger("change");
								dateEndObj.trigger("change");
							}
						}
	 				}
		 	});
  		}
  	},
  	F7ClickCallBack: function(event,config,category,datas){
  		if(category.categoryValue == "attencePolicy"){
  			if(datas && datas.length>0){
  				//联动考勤周期
  				$.shrFastFilter.setPromptGridUrl(['attendancePeriod'],{"attencePolicyId":encodeURIComponent(datas[0].id)});
  				
  				var atsPerioId = shr.attenceCalCommon.getFilterParamValues("attendancePeriod");
				if(thisObject && thisObject.atsPeriodObj && thisObject.atsPeriodObj.id){
					atsPerioId = thisObject.atsPeriodObj.id;
					if(document.getElementById(atsPerioId) && document.getElementById(atsPerioId).lastChild){
						$(document.getElementById(atsPerioId).lastChild).trigger('click');
					}
				}else if(atsPerioId){
					if(document.getElementById(atsPerioId) && document.getElementById(atsPerioId).lastChild){
						$(document.getElementById(atsPerioId).lastChild).trigger('click');
					}
				}
  			}
  		}else if(category.categoryValue == "attendancePeriod"){
  			if(datas && datas.length>0){
				thisObject.atsPeriodObj = datas[0];
  				var dateStartObj = $('#'+thisObject.dateSelectName.replace(".","--")+'-datestart');
				var dateEndObj = $('#'+thisObject.dateSelectName.replace(".","--")+'-dateend');
				if(dateStartObj && dateEndObj){
	  				dateStartObj["shrDateTimePicker"]('setValue', datas[0].startDate);
					dateEndObj["shrDateTimePicker"]('setValue', datas[0].endDate);
					dateStartObj.trigger("change");
					dateEndObj.trigger("change");
				}
  					
  			}
  		}
  		if(!thisObject.isFirstLoadData){
			thisObject.isFirstLoadData = true;
		}		
  	},
  	spanClickCallBack: function(event,commonSpan, checkedAttrValue, isReverse){
  		if(commonSpan.dataset && commonSpan.dataset.name == "hrOrg"){
  			if(commonSpan.dataset.id  != ''){
  				//联动考勤周期
  				if(isReverse){
  					var index = thisObject.selectedHrOrgIds.indexOf(commonSpan.dataset.id); 
					if (index > -1) { 
						thisObject.selectedHrOrgIds.splice(index, 1); 
					}
  				}else {
  					thisObject.selectedHrOrgIds.push(commonSpan.dataset.id);
  				}
  				$.shrFastFilter.setPromptGridUrl(['attencePolicy'],{"params":encodeURIComponent(thisObject.selectedHrOrgIds)});
  			}
  		}
  	}
});
