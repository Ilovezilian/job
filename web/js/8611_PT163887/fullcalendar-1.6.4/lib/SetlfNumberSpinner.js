 /*! 
 *fineTuning微调小插件件 
 *  
 * jQuery JavaScript Library v1.4.2 
 * http://jquery.com/ 
 * 
 * Date: 2014-06-05 
 */  
(function ($) {
	
    $.fineTuning = $.fineTuning || {};  
    $.extend($.fineTuning, {          
    	version: "1.00",  
        addTxt: function (fill, options) {
            options = $.extend({  
               	maxValue: 30, /*最大值*/  
              	minValue: 0, /*最小值*/  
                defValue: 1, /*默认值*/  
                txtWidth: 100/*文本框大小*/   
            }, options || {});
            fill = $(fill);  
            var h = [];  
            h.push('<input style="float:left;width:61.8%;background-color:#daeef8;" type="text" name="TextNum" class="input-height cell-input"  validate="{required:true}"/>');  
            h.push('<div style="position:relative;width:20px;overflow:hidden;font-size:x-small; right:-5px;top:-5px; bottom:0px;float:left; text-align:center;">');  
            h.push('<dt style="height:15px;"><a href="#"  name="Next" style="text-decoration:none;" >▲</a></dt>');  
            h.push('<dt style="height:15px;"><a href="#"  name="Pre" style="text-decoration:none;">▼</a></dt>');  
            h.push('</div> '); 
            fill.append(h.join('')); /*在父级div中 添加用到的控件*/  
           	var TxtBox = $(":text", fill);
           	TxtBox.val(options.defValue)
            //.width(options.txtWidth)/*设置文本框大小*/  
                   // .addClass("ui-widget ui-widget-content") 
   
            /*TxtBox.val(options.defValue).bind("blur keyup",
              		function(){  
                      var TxtNum = parseInt($(this).val());
                        if(!TxtNum && TxtNum !=0){$(this).val(options.defValue);  
                        	return;  
                      }  
                       $(this).val((TxtNum> options.maxValue) ? options.maxValue :((TxtNum< options.minValue) ? options.minValue :TxtNum));                
            });   
            fill.height(TxtBox.height()) /*设置父级div宽度，高度与textbox相同*/  
              //  .css({ "position": "relative", "height": "100%" }); /*设置父级div样式*/  
           // $("dt", fill).addClass("ui-state-default"); /*给所有的控件加上样式*/  
           // AddHover($("a", $(fill)));  
            fill.bind("click", function (event) {  
                if (!event) event = window.event;  
                var target = (event.target) ? event.target : event.srcElement;  
                if (target.tagName == "A") {
                    FineTuning(options, $(target), fill);
                }  
            });  
       }  
    });  
    //鼠标悬浮时更改样式 ---私有  
    function AddHover(obj) {  
        $(obj).hover(  
                function (event) {  
                    if (!event) event = window.event;  
                    var target = (event.target) ? event.target : event.srcElement;  
                    if (target.tagName == "A") {  
                       // $(target).parents("dt").addClass("ui-state-hover");  
                   }  
                },  
                 function (event) {  
                     if (!event) event = window.event;  
                     var target = (event.target) ? event.target : event.srcElement;  
                     if (target.tagName == "A") {  
                        // $(target).parents("dt").removeClass("ui-state-hover");  
                     }  
                 }  
    );  
    }  
    //私有方法  
    function FineTuning(opt, obj, parent) {  
        /*FineTuning微调的实体方法开始*/  
        var MinVal = opt.minValue;          
        var MaxVal = opt.maxValue;  
        var ClickName = $(obj).attr("name");  
        var TxtBox = $("input:text", $(parent));  
        var TxtNum = parseInt(TxtBox.val());//@
        if(!TxtNum && TxtNum !=0){    
            TxtBox.val(MinVal);return;  
        }  
        switch (ClickName) {  
           case "Pre":  
               {  
                    TxtBox.val((TxtNum - 1 < MinVal) ? MinVal : (TxtNum - 1));  
                } break;  
            case "Next":  
                {  
                    TxtBox.val((TxtNum + 1 > MaxVal) ? MaxVal : (TxtNum + 1));  
                } break;  
        }  
        /*FineTuning微调的实体方法结束*/  
   }  
})(jQuery); 
