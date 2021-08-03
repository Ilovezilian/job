var shr = {
  init: function () {
    var self = this;
    self.addEventListenerToFunc();
  },
  addEventListenerToFunc: function () {
    $(".functionBtn")
      .off("click")
      .on("click", function () {
        var name = $(this).attr("name");
        var title = $(this).html();
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true,
          },
          function (tabs) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              { name: name, title: title, url: tabs[0].url },
              function (response) {
                if (response.result === "ok") {
                }
              }
            );
            name;
          }
        );
      });
  },
};

document.addEventListener("DOMContentLoaded", function () {
  shr.init();
});
