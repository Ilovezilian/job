var shr = {
    init: function () {
        var self = this;
        self.initButton();
        self.addEventListenerToFunc();
    },
    addEventListenerToFunc: function () {
        $(".functionBtn").off("click").on("click", function () {
            var name = $(this).attr("name");
            var buildUrl = $(this).attr("value");
            console.log("addEventListenerToFunc");
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                alert("chrome.tabs.query"+ tabs[0].id)
                chrome.tabs.getCurrent();
                $("#"+tabs[0].id).css(".myBody")
                chrome.tabs.sendMessage(tabs[0].id, {name: name, url: buildUrl}, function (response) {
                    if (response.result === "ok") {
                        console.log("success return", response.fromcontent);
                    } else {
                        console.log("fail return", response.fromcontent);
                    }
                });
            });
        });
    },
    /**
     * 初始化数量
     */
    initButton() {
        var projectNames = [
            "有道-亮色",
            "有道-暗色",
        ];
        let $my = $("#my");
        let origin = $my.html();
        let buttions = [];
        for (let projectName of projectNames) {
            var copy = $(origin).clone();
            copy.attr("name", projectName);
            copy.attr("value", projectName);
            copy.text(projectName);
            buttions.push(copy);
            console.log("initButton", projectName);
        }

        $my.append(buttions);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    shr.init();
});