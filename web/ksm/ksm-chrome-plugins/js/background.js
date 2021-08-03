function checkIsShrApp(tabId, changeInfo, tab) {
  debugger
  var reg = /ksm\.kingdee\.com/;
  var matcher = tab.url.match(reg);
  if (typeof matcher != "undefined" && matcher != null) {
    chrome.pageAction.show(tabId);
  }
}
chrome.tabs.onUpdated.addListener(checkIsShrApp);
