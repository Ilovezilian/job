(function ($)  {
 	$.autoComplete = $.autoComplete || {};
 	 $.extend($.autoComplete, {          
    	version: "1.00",  
        getData: function (object,paramDatas,url) {
			object.off("keyup");
			object.live("keyup", function() {
				getkeyNodes(event,paramDatas,object,url);
			});
			
			
       }  
    });
	function getkeyNodes(event,paramDatas,object,url) {
		var selectPage = $(".selectPage").length == 0 ? $("<div class='selectPage'></div>").appendTo($("body")) : $(".selectPage");
		selectPage.empty();
		var dropdownElement = $('<ul class="dropdown-custom overflow-select" style="display: none;"></ul>').appendTo(selectPage);
		
		var meter = null;
		var pos = object.offset();
		dropdownElement.css({
					'left' : pos.left,
					'width' : object.outerWidth() - 2,
					'top' : pos.top + 24,
					'z-index' : 2000
				});
		var key = object.val().trim();
		if (meter != null) {
			window.clearTimeout(meter);
		}
		if (event.keyCode == 118) {
			if (object.parents(".ui-promptBox-frame").length != 0) {
				object.shrPromptBox("open");
			}
		}
		if (event.keyCode == 8) {
			object.prev().val(null);
		}
		if (event.keyCode == 13 && key != "") { // 回车键
			var name = dropdownElement.find('li .custom-hover strong').html();
			if (name != null) {
				if (object.val().indexOf(",") > 0) {
					var prop_value = object.val().split(",");
					prop_value.splice((prop_value.length - 1), 1, name);
					object.val(prop_value.join(","));
				} else if (object.val().indexOf("，") > 0) {
					var prop_value = object.val().split("，");
					prop_value.splice((prop_value.length - 1), 1, name);
					object.val(prop_value.join("，"));
				} else {
					object.val(name);
				}
			}
			selectPage.empty();
		} else if (event.keyCode == 8 && key == "") {// 回格键
			
			selectPage.empty();
			
		} else if (key != "") {
			if (key != null && ((event.keyCode > 47 && event.keyCode < 106) || event.keyCode == 32 || event.keyCode == 8)) {
				var fields = null;
				if (key.indexOf(",") > 0) {
					key = key.split(",")[key.split(",").length - 1];
				}
				if (key.indexOf("，") > 0) {
					key = key.split("，")[key.split("，").length - 1];
				}
				meter = window.setTimeout(function() {
					shr.ajax({
						url: url,
						data: {value:key,paramDatas:paramDatas},
						async : true,
						dataType:'json',
						type: "POST",
						cache: false,
						success : function(data) {
							if (data.length != 0) {
								fields = data;
							}
							
						    dropdownElement.empty();
							if(fields!=null){
	        					for(var i=0;i<fields.length;i++){
	        						dropdownElement.append("<li><a href='#'><strong title='"+fields[i].value+"'>"+fields[i].value+"</strong></a></li>");
	        					}
	        					dropdownElement.show();
	        				}
	        				else{
	        					dropdownElement.hide();
	        				}
	        				
							dropdownElement.find('li a').width("auto");
							dropdownElement.find('li:eq(0) a').addClass("custom-hover");

							dropdownElement.find('li').click(function() {
								var name = $(this).find("strong").html();
								if (name != null) {
									if (object.val().indexOf(",") > 0) {
										var prop_value = object.val().split(",");
										prop_value.splice((prop_value.length - 1), 1,name);
										object.val(prop_value.join(","));
									} else if (object.val().indexOf("，") > 0) {
										var prop_value = object.val().split("，");
										prop_value.splice((prop_value.length - 1), 1,name);
										object.val(prop_value.join("，"));
									} else {
										object.val(name);
									}
								}
								dropdownElement.hide();
								dropdownElement.empty();
							});
							dropdownElement.find('li a').mouseenter(function() {
								dropdownElement.find('li a').removeClass("custom-hover");
								$(this).addClass("custom-hover");
							}).mouseleave(function() {
										if ($(this).hasClass("custom-hover")) {
											$(this).removeClass("custom-hover");
										}
							   });
						}
					});
				}, 300);
				if (event.keyCode == 38) {
					dropdownElement.find('li').each(function(index) {
						if ($(this).find("a").hasClass("custom-hover")) {
							$(this).find("a").removeClass("custom-hover");
							if ($(this).prev().length != 0) {
								$(this).prev().find("a").addClass("custom-hover");
							} else {
								$(this).parent().find("li:last a").addClass("custom-hover");
							}
							return false;
						}
					});
				}
				if (event.keyCode == 40) {
					dropdownElement.find('li').each(function(index) {
						if ($(this).find("a").hasClass("custom-hover")) {
							$(this).find("a").removeClass("custom-hover");
							if ($(this).next().length != 0) {
								$(this).next().find("a")
										.addClass("custom-hover");
							} else {
								$(this).parent().find("li:eq(0) a")
										.addClass("custom-hover");
							}
							return false;
						}
						if (!$(this).parent().find("li a")
								.hasClass("custom-hover")) {
							$(this).parent().find("li:eq(0) a")
									.addClass("custom-hover");
							return false;
						}
					});
				}
			}
		}
	}
})(jQuery); 