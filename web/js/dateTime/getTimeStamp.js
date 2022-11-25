function: getTimeStamp() {
var timestamp = Date.parse(new Date());
//1634608757000

var timestamp = (new Date()).valueOf();
//1634608965891

var timestamp=new Date().getTime()；
//1634609002362
}

function: StringToDate() {
    Date.parse("2021-10-12 00:00:00")
}

function: getFormatDateTime() {
//第三种  格式为：2010-10-20 10:00:00
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
}