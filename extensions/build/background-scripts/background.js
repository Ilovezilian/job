function checkIsShrApp(tabId, changeInfo, tab) {
  debugger
//  172.17.8.17
  var reg = /172\.17\.8\.17/;
  var matcher = tab.url.match(reg);
  if (typeof matcher != "undefined" && matcher != null) {
    chrome.pageAction.show(tabId);
  }
}
chrome.tabs.onUpdated.addListener(checkIsShrApp);
