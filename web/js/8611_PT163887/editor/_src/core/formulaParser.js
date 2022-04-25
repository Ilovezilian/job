UM.formulaParser = function(content) {

	// sort key words by length
	var keys = _.keys(ue_items);
	keys = keys.sort(function(str1, str2) { return str2.length - str1.length });
	
	// init regex
	var regex = new RegExp(keys.join("|")
			.replace(/\]/g, "\\]").replace(/\[/g, "\\[")
			.replace(/\)/g, "\\)").replace(/\(/g, "\\("), "g");
	
    content = content.replace(regex, function(match, index, text) {
    	
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
    	
    	return ue_items[match] + match;
    });
    
    return content;
}