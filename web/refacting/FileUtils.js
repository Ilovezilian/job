function loadLocalJsonFile(url) {
    var request = new XMLHttpRequest();
    request.open("get", url, false);/*设置请求方法与路径*/
    request.send(null);/*不发送数据到服务器*/
    let fileContent;
    request.onload = function () {/*XHR对象获取到返回信息后执行*/
        if (request.status == 200) {/*返回状态为200，即为数据获取成功*/
            // var json = JSON.parse(request.responseText);
            // fileContent = json;
            // console.log(json);
            return JSON.parse(request.responseText);
        }
    };
    return request.onload.apply();
}
