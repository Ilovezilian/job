var ue_cl = [
    '如果',
    '那么',
    '再滤',
    '其余',
    '并且',
    '或者'
];

function combineRegex(keys) {
	
	return new RegExp(keys.join("|")
			.replace(/\]/g, "\\]").replace(/\[/g, "\\[")
			.replace(/\)/g, "\\)").replace(/\(/g, "\\("), "g");
}

UM.plugins["auto"] = function () {
    var me = this;
    //执行命令
    me.commands["auto"] = {
        execCommand:function () {
            var content = me.getContentTxt();
            
            // sort key words by length
            ue_ci = ue_ci.sort(function(str1, str2) { return str2.length - str1.length });

            content = content.replace(combineRegex(ue_ci), function(match, index, text) {
            	if(match.trim() == "")  return " ";
            	
            	if(index > 0) {
            		var c = text.charAt(index - 1);
            		
            		if(c != " " && c != "+" && c != "-" && c != "*" && c != "/" && c != "="
            			&& c != ">" && c != "<" && c != "(" && c != "\"" && c != "," && c != '果'
            			&& c != '么'
                        && c != '滤'
                        && c != '余'
                        && c != '且'
                        && c != '者')
            			
            			return match;
            	}
            	
                return "<span style='color: " + colors.ITEM + ";'>" + match + "</span>";
            });
            
            content = content.replace(combineRegex(ue_cp), function(match) {
            	if(match.trim() == "")  return " ";
                return "<span style='color: " + colors.PROP + ";'>" + match + "</span>";
            });

            content = content.replace(combineRegex(ue_cl), function(match) {
            	if(match.trim() == "")  return "";
                return "<span style='color: " + colors.LOGIC + ";'>&nbsp;" + match + "&nbsp;</span>";
            });

            content = content.replace(combineRegex(ue_cf), function(match) {
            	if(match.trim() == "")  return " ";
                return "<span style='color: " + colors.FUNC + ";'>" + match + "</span>";
            });

            me.$body.html("<p>" + content + "</p>");

            var range = me.selection.getRange();
            range.setCursor(true);
        }
    };
};