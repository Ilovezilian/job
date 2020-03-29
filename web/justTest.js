// 声明这个函数即可，原理就是创建一个a标签然后往里面塞入数据再下载即可。
function download(filename, text) {
    var a = $("<a>", {
        href:"data:text/plain;charset=utf-8," + encodeURIComponent(text),
        download: filename
    });
    a[0].click();
}

// 声明这个函数即可，原理就是创建一个a标签然后往里面塞入数据再下载即可。
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.click();
}