function ListWorkShift() {
	var that = this;
	that.name = "ListWorkShift";

	/**
	 * 单元格单选模式
	 */
	that.SELECT_MODEL_SIGLE = 0;

	/**
	 * 单元格多选模式
	 */
	that.SELECT_MODEL_MULTI = 1;

	var _listData = {};

	var _colContainer = undefined;

	var _selectedCellInfo = [];
	
	var _lastSelectModel = that.SELECT_MODEL_MULTI;
	
	var _tableSelector;

	that.renderListTable = function(configure,isInitAllData) {
		var arrangeShiftType = workShiftStrategy.getArrangeShiftType();
		if(arrangeShiftType == workShiftStrategy.SHIFT_TYPE_NOSHIFT
			|| arrangeShiftType === workShiftStrategy.SHIFT_TYPE_VER_SHIFT){
			that.setTableSelector("#dataGrid");
		}else{
			that.setTableSelector('#list_info');
		}
		if(!configure){
			$(_tableSelector).trigger("reloadGrid");
			return;
		}
		//isInitAllData === true && that.setListData({});
		var begin = workShiftStrategy.getBeginDate();
		var end = workShiftStrategy.getEndDate();
		_resetColContainer(begin, end);
		_resetListData(begin, end);
		_fetchListShiftData(configure);
	}
	
	var _resetListData = function(begin, end){
		var attendDate;
		var beginLong = atsCommonUtile.getDateObj(begin).getTime();
		var endLong = atsCommonUtile.getDateObj(end).getTime();
		var listData = that.getListData();
		for(var schedule in listData){
			for(var attendDateStr in schedule){
				attendDate = atsCommonUtile.getDateObj(attendDateStr).getTime();
				if(beginLong > attendDate || endLong < attendDate){
					schedule[attendDateStr] = undefined;
				}
			}
		}
	}
	var _getColModelVisableWitdh = function(colModelArr) {
		var result = 0;
		for (var i = 0; i < colModelArr.length; i ++) {
		    if (colModelArr[i].hidden != true) {
		    	result += colModelArr[i].width;
			}
		}
		return result;
	}

	var _fetchListShiftData = function(configure) {
		$.block.show({text: $.attendmanageI18n.listWorkShift.msg1});
		var options = {
			url: workShiftStrategy.getFetchShiftDataUrl(),
			mtype: "POST",
			datatype: "json",
			postData : {"personNums": JSON.stringify(configure.personNums || "")},
			multiselect: true,
			rownumbers: false,
            footerrow:true,  //原生jqGrid加入防止样式错乱
			colNames: that.getColContainer().colNames,
			colModel: that.getColContainer().colModel,
			recordpos: 'left',
			gridview: true,
			pginput: true,
			autoheight: true,
			shrinkToFit: _getColModelVisableWitdh(that.getColContainer().colModel) < jQuery("body").width() ? true : false,
			height: 'auto',
			viewrecords: false,
			cellEdit: false,
			resizeStop: _resizeStop,
			loadComplete: _loadComplete,
			gridComplete: function() {},
			onCellSelect: _onSelectCell,
			beforeSelectRow: function (rowid, e) {
				var cellIndex = $.jgrid.getCellIndex($(e.target).closest('td')[0]);
				cellIndex <= _getBaseInfoLength() ? that.resetSelectStatus() : $(_tableSelector).jqGrid('resetSelection');
				return true;
			}
		};
		atsCommonUtile.assembleFn(options,configure,this);
		jQuery(_tableSelector).html();
		jQuery(_tableSelector).jqGrid(options);
		jQuery(_tableSelector).jqGrid('setFrozenColumns');
		// 自适应大小
		jQuery(_tableSelector).jqGrid("resizeGrid",{base:jQuery(_tableSelector),offset:0});
		$(window).resize(function(){
			$.ieHack.hackResize(function(e){
				jQuery(_tableSelector).jqGrid("resizeGrid",{base:jQuery(_tableSelector),offset:0});
			},jQuery(_tableSelector));
		});

		_resetTableStyle(configure.personNums && configure.personNums.length || 0);
		that.initEvent();
	}
	
	that.initEvent = function(){
		$("table[aria-labelledby=gbox_" + _tableSelector.substr(1) + "]>thead>tr>th:gt(3)").mousedown(function(e){
			console.info(e)
		})
	}

	that.updateShiftData = function(shiftResults) {
		if(!shiftResults) {
			atsCommonUtile.showError($.attendmanageI18n.listWorkShift.msg2);
			return;
		}
		if(typeof shiftResults == "string") {
			_updateShiftDataFromShift(shiftResults);
		} else {
			atsArrayUtile.isArray(shiftResults) && _updateShiftData(shiftResults);
		}
		_rerenderShiftList();
	}
	
		//班次排班数据
	var _updateShiftDataFromShift = function(shiftResult) {
		if(!shiftResult) {
			return;
		}
		var shiftObj = {
			shiftName: shiftResult.substr(shiftResult.indexOf("]") + 1),
			dayType: shiftResult.substr(1, shiftResult.indexOf("]") - 1),
			hasSaved: false
		};

		var selectedCellInfo = that.getSelectedCellInfo();
		var dateStr;
		var listKey;
		var listData = that.getListData();
		var selectedRow = $(_tableSelector + " tr[aria-selected=true]");
		var baseInfoLenFilter = ":gt(" + _getBaseInfoLength() + ")";
		var arrangeShiftType = workShiftStrategy.getArrangeShiftType();
		selectedRow.each(function() {
			var number = arrangeShiftType === workShiftStrategy.SHIFT_TYPE_VER_SHIFT ? 9 : 2;
			listKey = $(this).children().eq(number).text();
			!listData[listKey] && (listData[listKey] = {});
			$(this).children(baseInfoLenFilter).each(function(index, element) {
				dateStr = $(element).attr("aria-describedby").substr(_tableSelector.length);
				listData[listKey][dateStr] = shiftObj;
			})
		});
		if(selectedRow.length == 0){
			for(var i = 0; i < selectedCellInfo.length; i = i + 2) {
				var key = arrangeShiftType === workShiftStrategy.SHIFT_TYPE_VER_SHIFT ? "key" : "personNum";
				listKey = $(_tableSelector).jqGrid("getCell", selectedCellInfo[i], key);
				dateStr = $($("#" + selectedCellInfo[i] + ">td")[selectedCellInfo[i + 1]]).attr("aria-describedby").substr(_tableSelector.length);
				!listData[listKey] && (listData[listKey] = {});
				listData[listKey][dateStr] = shiftObj;
			}
		}
		that.resetSelectStatus();
	}
	
	/**
	 * 已排班数据，轮班规则和复制排班数据
	 * @param {Object} allScheduleData
	 */
	var _updateShiftData = function(allScheduleData){
		var listData = that.getListData();
		var currentPersonNum = workShiftStrategy.getSelectedStaffNum();
		//BT1269276 未排班列表进行复制排班，给员工排班了31天后再次给另一个员工排班21天，同时保存后，现在只能保存后面排班的 那个人的排班数据。
		var arrangeShiftType = workShiftStrategy.getArrangeShiftType();
		if(arrangeShiftType != workShiftStrategy.SHIFT_TYPE_NOSHIFT &&
			arrangeShiftType != workShiftStrategy.SHIFT_TYPE_VER_SHIFT){
			for(var personNum in listData){
				if(!atsArrayUtile.contains(currentPersonNum,personNum)){
					delete listData[personNum];
				}
			}
		}
		var oldSavedStatus;
		var currentSchedul;
		allScheduleData.forEach(function(personSchedul) {
			var listKey = arrangeShiftType != workShiftStrategy.SHIFT_TYPE_VER_SHIFT ? personSchedul.personNum : personSchedul.key;
			if(personSchedul && personSchedul.scheduleData){
				!listData[listKey] && (listData[listKey] = {});
				currentSchedul = listData[listKey];
				personSchedul.scheduleData.length == 0 && (listData[listKey] = []);
				personSchedul.scheduleData.forEach(function(shift){
					shift.shiftName = atsCommonUtile.get(shift,"shiftName");
					if(currentSchedul[shift.attendDate]){
						delete currentSchedul[shift.attendDate].turnShiftId;
						delete currentSchedul[shift.attendDate].segment;
					}
					currentSchedul[shift.attendDate] = $.extend(true, currentSchedul[shift.attendDate], shift);
					oldSavedStatus = currentSchedul[shift.attendDate] && currentSchedul[shift.attendDate].hasSaved;
					workShiftStrategy.getDataFrom() == workShiftStrategy.DATA_FROM_ARRANGE && (oldSavedStatus = false);
					currentSchedul[shift.attendDate].hasSaved = oldSavedStatus === false ? false : true;
				})
			}
		})
	}

	var _rerenderShiftList = function() {
		var dateStr;
		var shiftObj;
		var listData = that.getListData();
		var describedbyLeng = _tableSelector.substr(1) + "_";
		var baseInfoLenFilter = ":gt(" + _getBaseInfoLength() + ")";
		describedbyLeng = describedbyLeng.length;
		var arrangeShiftType = workShiftStrategy.getArrangeShiftType();
		$(_tableSelector + ' tr:not(.norecord):gt(0)').each(function() {
			var number = arrangeShiftType === workShiftStrategy.SHIFT_TYPE_VER_SHIFT ? 9 : 2;
			var listKey = $(this).children().eq(number).text();
			listData[listKey] && $(this).children(baseInfoLenFilter).each(function(index, element) {
				dateStr = $(element).attr("aria-describedby").substr(describedbyLeng);
				shiftObj = listData[listKey][dateStr];
				$(element).text(shiftObj ? workShiftStrategy.getShiftName(shiftObj.shiftName) : "");
				$(element).attr('title', shiftObj ? workShiftStrategy.getShiftTitle(shiftObj) : "");
				workShiftStrategy.resetCellColor(this, shiftObj);
			})
		});
	}

	/**
	 * 获取上一次单击选取的模式
	 */
	that.getLastSelectModel = function() {
		return _lastSelectModel;
	}

	that.setLastSelectModel = function(selectModel) {
		_lastSelectModel = selectModel;
	}

	that.resetLastSelectmodel = function() {
		_lastSelectModel = that.SELECT_MODEL_MULTI;
	}

	that.getColContainer = function() {
		if(!_colContainer){
			_resetColContainer();
		}
		return _colContainer;
	}

	that.setColContainer = function(colContainer) {
		_colContainer = colContainer;
	}

	that.getSelectedCellInfo = function() {
		return _selectedCellInfo;
	}
	
	that.getTableSelector = function(){
		return _tableSelector;
	}
	
	that.setTableSelector = function(tableSelector){
		return _tableSelector = tableSelector;
	}

	that.getListData = function() {
		return _listData;
	}

	that.setListData = function(listData) {
		_listData = listData;
	}

	that.setSelectedCellInfo = function(selectedCellInfo) {
		_selectedCellInfo = selectedCellInfo
	}

	var _resetTableStyle = function(rowCount) {
		if(workShiftStrategy.getArrangeShiftType() != workShiftStrategy.SHIFT_TYPE_LIST){
			//return;
		}
		var height = rowCount * 30 + 18;
		height > 550 && (height = 550);
		rowCount == 0 && (height = 150);
		height += 'px'
		$('#gbox_' + _tableSelector.substring(1) + ' div.ui-jqgrid-bdiv:eq(0)').css('height', height).css('width', '100%').css('overflow-y', 'scroll', 'overflow-x', 'scroll');
		//(BT1179508)当日期区间范围比较大时,横向滚动条会被下面的frozen-bdiv ui-jqgrid-bdiv覆盖，不能滚动
		$(".frozen-bdiv").css("height", ($(".ui-jqgrid-bdiv:first").height() - 5) + "px");

	}

	var _loadComplete = function(data) {
		workShiftStrategy.setDataFrom(workShiftStrategy.DATA_FROM_SCHEDULELIST);
		if(data && data.errorMsg){
			atsCommonUtile.showWarning(data.errorMsg);
		}
		if(!data || data && !atsArrayUtile.isArray(data.rows)) {
			return;
		}
		that.updateShiftData(data.rows);
		$(_tableSelector + "_frozen").parent().css({
			"overflow-y": "hidden"
		});
		$(_tableSelector + "_frozen").parent().width($(".frozen-div").width());
		var rowCount = $(_tableSelector + " tr:gt(0):not(.norecord)").length;
		_resetTableStyle(rowCount);
		$.block.hide();
	}
	
	
	that.getCheckedRowIds = function(){
		return $(_tableSelector).jqGrid("getSelectedRows");
	}
	
	that.deleteRow = function(selectedIds){
		openLoader(1, $.attendmanageI18n.listWorkShift.msg3);
		setTimeout(function(){
    		that.deleteRowData(selectedIds);
			for (var i = 0, length = selectedIds.length; i < length; i++) {
				var  personNum = $(_tableSelector).jqGrid("getCell", selectedIds[i], "personNum");
				$(".field_list").find(".text-tag").each(function(){
					//用编号数字去比较，效率更快
					if(this['id'] == personNum){
						$(this).remove();
						return;
					}
				});
			}
			for (var i = selectedIds.length - 1; i >= 0; i--) {
				$(_tableSelector).jqGrid('delRow', selectedIds[i]);
			}
			_resetTableStyle($(_tableSelector + " tr:not(.norecord").length - 1);
			closeLoader();
		},50)
		
	}
	
	that.getSelectedPersonNum = function(){
		var personNums = [];
		//var personNumCellCol = workShiftStrategy.getArrangeShiftType() === that.SHIFT_TYPE_NOSHIFT ? 1 : 2;
		$(_tableSelector + " tr[aria-selected=true]").each(function(){
			personNums.push($(this).children(":eq(2)").text());
		})
		return personNums;
	}

	that.getSelectedKeys = function(){
		var listKeys = [];
		if (workShiftStrategy.getArrangeShiftType() != workShiftStrategy.SHIFT_TYPE_VER_SHIFT) {
		    return listKeys;
		}

		$(_tableSelector + " tr[aria-selected=true]").each(function(){
			listKeys.push($(this).children(":eq(9)").text());
		})
		return listKeys;
	}

	that.deleteRowData = function(keys) {
		if(!keys) {
			return;
		}
		if(typeof keys == "string") {
			_deleteRowData(keys);
		} else if(atsArrayUtile.isArray(keys)) {
			keys.forEach(function(key) {
				_deleteRowData(key);
			})
		}
	}

	that.resetSaveStatus = function() {
		var listData = that.getListData();
		for(var personNum in listData) {
			if(listData[personNum]) {
				for(var attendDate in listData[personNum]) {
					listData[personNum][attendDate] && (listData[personNum][attendDate].hasSaved = true);
				}
			}
		}
		that.removeArrangingStyle();
	}
	
	that.delArrangingData = function(){
		var listData = that.getListData();
		for(var personNum in listData) {
			if(listData[personNum]) {
				for(var attendDate in listData[personNum]) {
					if(listData[personNum][attendDate] && listData[personNum][attendDate].hasSaved === false){
						delete listData[personNum][attendDate]
					}
				}
			}
		}
		that.removeArrangingStyle();
	}
	
	that.removeArrangingStyle = function(){
		$(_tableSelector + " .lightYellow").removeClass("lightYellow");
	}

	var _deleteRowData = function(key) {
		if(!key) {
			return;
		}
		var listData = that.getListData();
		if(!listData[key]) {
			key = $(_tableSelector).jqGrid("getCell", key, "personNum");
		}
		if(key){
			var postData = $(_tableSelector).jqGrid("getGridParam", "postData");
			if(postData.personNums){
				postData.personNums = postData.personNums.replace('"' + key + '"',"").replace(",,",",");
			}
			delete listData[key];
		}
	}

	var _resizeStop = function(newwidth, index) {
		if(index == 3) {
			$(_tableSelector + "_frozen").parent().width($(".frozen-div").width());
		}
	}

	var _onSelectCell = function(rowid, iCol, cellcontent, e) {
		var colContainer = that.getColContainer();
		if(iCol > _getBaseInfoLength() && iCol <= colContainer.colModel.length) {
			var selectedCellInfo = that.getSelectedCellInfo();
			jQuery(_tableSelector).setSelection(rowid, false);
			if(e.type == "click") {
				if(e.ctrlKey) { //ctrl键+click点击
					if(that.getLastSelectModel() == that.SELECT_MODEL_SIGLE) {
						that.removeSelectedCellInfo();
					}
					selectedCellInfo.push(rowid);
					selectedCellInfo.push(iCol);
					that.setLastSelectModel(that.SELECT_MODEL_MULTI);
				} else {
					if(that.getLastSelectModel() == that.SELECT_MODEL_SIGLE) {
						if(selectedCellInfo.length <= 2) {
							selectedCellInfo.push(rowid);
							selectedCellInfo.push(iCol);
						}
						if(selectedCellInfo.length == 4) {
							setTimeout(function(){
								_buildSelectedArea();
								workShiftStrategy.setArrangeShiftWay(workShiftStrategy.SHIFT_WAY_SCHEDULE);
								workShiftStrategy.arrangeWorkShift();
							},20)
							return;
						}
					} else {
						that.removeSelectedCellInfo();
						selectedCellInfo.push(rowid);
						selectedCellInfo.push(iCol);
					}
					that.setLastSelectModel(that.SELECT_MODEL_SIGLE);
				}
				$($("#" + rowid + ">td")[iCol]).addClass('cell-select-color');
			}
		}
	}

	/**
	 * 清除选中样式和数据以及多选模式
	 */
	that.resetSelectStatus = function() {
		that.removeSelectedCellInfo();
		that.resetLastSelectmodel();
	}
	

	/**
	 * 清除选中样式和数据
	 */
	that.removeSelectedCellInfo = function() {
		$(_tableSelector + " .cell-select-color").removeClass('cell-select-color');
		var selectedCellInfo = that.getSelectedCellInfo();
		while(selectedCellInfo.length > 0) {
			selectedCellInfo.pop();
		}
	}

	/**
	 * 选中接连的两次单击形成的矩形区域
	 */
	var _buildSelectedArea = function() {
		var selectedCellInfo = that.getSelectedCellInfo();
		var minRow = Math.min(selectedCellInfo[0], selectedCellInfo[2]);
		var maxRow = Math.max(selectedCellInfo[0], selectedCellInfo[2]);
		var minCol = Math.min(selectedCellInfo[1], selectedCellInfo[3]);
		var maxCol = Math.max(selectedCellInfo[1], selectedCellInfo[3]);
		for(var row = minRow; row <= maxRow; row++) {
			for(var col = minCol; col <= maxCol; col++) {
				$($("#" + row + ">td")[col]).addClass('cell-select-color');
				if(!(
						(row == selectedCellInfo[0] && col == selectedCellInfo[1]) ||
						(row == selectedCellInfo[2] && col == selectedCellInfo[3])
					)) {
					selectedCellInfo.push(row);
					selectedCellInfo.push(col);
				}
			}
		}
	}
	
	var _getBaseInfoLength = function(){
		var arrangeShiftType = workShiftStrategy.getArrangeShiftType();
		if(arrangeShiftType === workShiftStrategy.SHIFT_TYPE_VER_SHIFT) {
			return _getVerShiftColBaseName().length;
		}else if(arrangeShiftType === workShiftStrategy.SHIFT_TYPE_NOSHIFT){
			return _getNoShiftColBaseName().length;
		}else{
			return _getColBaseName().length;
		}
	}
	
	var _resetColContainer = function(beginDate,endDate){
		beginDate = atsCommonUtile.getDateObj(atsCommonUtile.formateDate(beginDate));
		endDate = atsCommonUtile.getDateObj(atsCommonUtile.formateDate(endDate));
		var colNames;
		var colModel;
		var arrangeShiftType = workShiftStrategy.getArrangeShiftType();
		if(arrangeShiftType === workShiftStrategy.SHIFT_TYPE_NOSHIFT) {
			colNames = _getNoShiftColBaseName();
			colModel = _getNoShiftColModel();
		} else if(arrangeShiftType === workShiftStrategy.SHIFT_TYPE_VER_SHIFT){
			colNames = _getVerShiftColBaseName();
			colModel = _getVerShiftColModel();
		}else{
			colNames = _getColBaseName();
			colModel = _getColModel();
		}
		
		while(beginDate <= endDate){
			_createDateCol(colNames,colModel,beginDate);
			beginDate.setDate(beginDate.getDate() + 1);
		}
		that.setColContainer({colNames : colNames,colModel : colModel});
	}
	

	

	
	var _createDateCol = function(colNames,colModel,baseDate){
		var baseDateStr = atsCommonUtile.formateDate(baseDate);
		var colMo = {
			index : baseDateStr,
			name : baseDateStr,
			label : baseDateStr + _getWeekDay(baseDate),
			width : 75,
			sortable : false
		}
		colModel.push(colMo);
		colNames.push(colMo.label);
	}
	
	var _getWeekDay = function(baseDate){
		return "(" + atsCommonUtile.WEEKDAY[baseDate.getDay()] + ")";
	}
	
	var _getColModel = function(){
		var colModel = [];
		["rowNum","personNum","personName"].forEach(function(item){
			colModel.push({
				index : item,
				name : item,
				label : item,
				width : 80,
				frozen : true,
				sortable : false
			})
		})
		colModel[0].width = 30;
		return colModel;
	}
	
	var _getColBaseName = function(){
		return [" ",
		        $.attendmanageI18n.listWorkShift.col1,
		        $.attendmanageI18n.listWorkShift.col2];
	}
	
	var _getNoShiftColBaseName = function(){
		var arr = [];
		arr.push("id");
		arr.push($.attendmanageI18n.listWorkShift.col1);
		arr.push($.attendmanageI18n.listWorkShift.col2);
		arr.push($.attendmanageI18n.listWorkShift.col3);
		arr.push($.attendmanageI18n.listWorkShift.col4);
		arr.push($.attendmanageI18n.listWorkShift.col5);
		arr.push($.attendmanageI18n.listWorkShift.col6);
		return arr;
	}
	var _getVerShiftColBaseName = function(){
		var arr = [];
		arr.push("id");
		// arr.push("人员编号Id");
		arr.push(jsBizMultLan.atsManager_listWorkShift_26522121_i18n_6);
		arr.push(jsBizMultLan.atsManager_listWorkShift_26522121_i18n_5);
		arr.push(jsBizMultLan.atsManager_listWorkShift_26522121_i18n_1);
		arr.push(jsBizMultLan.atsManager_listWorkShift_26522121_i18n_1+"Id");
		arr.push(jsBizMultLan.atsManager_listWorkShift_26522121_i18n_4);
		arr.push(jsBizMultLan.atsManager_listWorkShift_26522121_i18n_0);
		arr.push(jsBizMultLan.atsManager_listWorkShift_26522121_i18n_7);
		arr.push("key"); // 用来区别一条数据的唯一性
		return arr;
	}

	var _getVerShiftColModel = function(){
		var arr = [];
		arr.push({
			name : 'id',
			label : 'ID',
			index : 'id',
			frozen : true,
			hidden : true
		});
		// arr.push({
		// 	name : 'personId',
		// 	label : 'personId',
		// 	index : 'personId',
		// 	frozen : true,
		// 	hidden : true
		// });
		arr.push({
			name : 'personNum',
			label : jsBizMultLan.atsManager_listWorkShift_26522121_i18n_6,
			index : 'personNum',
			width : 60,
			editable : false,
			frozen : true,
			sortable:true
		});
		arr.push({
			name : 'personName',
			label : jsBizMultLan.atsManager_listWorkShift_26522121_i18n_5,
			index : 'personName',
			width : 70,
			editable : false,
			frozen : true,
			sortable:true
		});
		arr.push({
			name : 'hrOrgUnit_name',
			label : jsBizMultLan.atsManager_listWorkShift_26522121_i18n_1,
			index : 'hrOrgUnit_name',
			width : 150,
			editable : false,
			frozen : true,
			sortable:true
		});
		arr.push({
			name : 'hrOrgUnitId',
			label : jsBizMultLan.atsManager_listWorkShift_26522121_i18n_2 + 'ID',
			index : 'hrOrgUnit',
			width : 150,
			editable : false,
			sortable : true,
			frozen : true,
			hidden : true
		});
		arr.push({
			name : 'adminOrgUnit_displayName',
			label : jsBizMultLan.atsManager_listWorkShift_26522121_i18n_4,
			index : 'adminOrgUnit_displayName',
			width : 150,
			editable : false,
			frozen : true,
			sortable:true
		});
		arr.push({
			name : 'attAdminOrgUnit_displayName',
			label : jsBizMultLan.atsManager_listWorkShift_26522121_i18n_0,
			index : 'attAdminOrgUnit_displayName',
			width : 150,
			editable : false,
			frozen : false,
			sortable:true
		});
		arr.push({
			name : 'employeeTypeName',
			label : jsBizMultLan.atsManager_listWorkShift_26522121_i18n_7,
			index : 'employeeTypeName',
			width : 80,
			editable : false,
			sortable:true,
			frozen : true,
			hidden : true
		});
		arr.push({
			name : 'key',
			label : jsBizMultLan.atsManager_listWorkShift_26522121_i18n_3,
			index : 'key',
			width : 80,
			editable : false,
			sortable:true,
			frozen : true,
			hidden : true
		});
		return arr;
	}
	var _getNoShiftColModel = function(){
		var arr = [];
		arr.push({
			name : 'id',
			label : 'ID',
			index : 'id',
			frozen : true,
			hidden : true
		});
		arr.push({
			name : 'personNum',
			label : $.attendmanageI18n.listWorkShift.col1,
			index : 'personNum',
			width : 60,
			editable : false,
			frozen : true,
			sortable:true
		});
		arr.push({
			name : 'personName',
			label : $.attendmanageI18n.listWorkShift.col2,
			index : 'personName',
			width : 70,
			editable : false,
			frozen : true,
			sortable:true
		});
		arr.push({
			name : 'hrOrgName',
			label : $.attendmanageI18n.listWorkShift.col3,
			index : 'hrOrgName',
			width : 150,
			editable : false,
			frozen : true,
			sortable:true
		});
		arr.push({
			name : 'hrOrgUnitId',
			label : $.attendmanageI18n.listWorkShift.col4,
			index : 'hrOrgUnit',
			width : 150,
			editable : false,
			sortable : true,
			frozen : true,
			hidden : true
		});
		arr.push({
			name : 'adminOrgName',
			label : $.attendmanageI18n.listWorkShift.col5,
			index : 'adminOrgName',
			width : 150,
			editable : false,
			frozen : true,
			sortable:true
		});
		arr.push({
			name : 'employeeTypeName',
			label : $.attendmanageI18n.listWorkShift.col6,
			index : 'employeeTypeName',
			width : 80,
			editable : false,
			sortable:true,
			frozen : true,
			hidden : true
		});
		return arr;
	}

}

var listWorkShift = new ListWorkShift();