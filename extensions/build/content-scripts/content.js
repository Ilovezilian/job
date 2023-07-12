chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var name = request.name;
    var url = request.url;
    $.ajax({
        type: 'POST',
        url: url,
        data: {},
        // 成功弹窗
        success: function (data, status) {
            if ("success" === status) {
                prompt("Fine for Status: " + status);
            } else {
                prompt("Loser for Status: " + status);
            }
        },
        // 设置请求头
        beforeSend: function (request, h) {
            request.setRequestHeader("Jenkins-Crumb", $("input[name='Jenkins-Crumb']").attr("value"));
            request.setRequestHeader("Content-type", 'application/x-www-form-urlencoded; charset=UTF-8');
            // request.setRequestHeader('X-Prototype-Version', '1.7');
            request.setRequestHeader('Accept', 'text/javascript, text/html, application/xml, text/xml, */*');
            console.log("request=", request,"h=", h);
        }
    });

    console.log("url=", url);
    console.log("name=", name);
    sendResponse({fromcontent: "This message is from content.js"});
});