var shr = {
    init: function () {
        var self = this;
        self.initButton();
        self.addEventListenerToFunc();
    }, addEventListenerToFunc: function () {
        $(".functionBtn").off("click").on("click", function () {
            var name = $(this).attr("name");
            var buildUrl = $(this).attr("value");
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {name: name, url: buildUrl}, function (response) {
                    if (response.result === "ok") {
                        console.log("success return", response.fromcontent)
                    } else {
                        console.log("fail return", response.fromcontent)
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
            "spr-calculate-business_git",
            "spr-calculate-common_git",
            "spr-calculate-formplugin_git",
            // "spr-calculate-mservice-api_git",
            // "spr-calculate-mservice_git",
            "spr-calculate-opplugin_git",
            // "spr-calculate-report_git",
            // "spr-calculate-servicehelper_git",
            "spr-compensation-business_git",
            "spr-compensation-common_git",
            "spr-compensation-formplugin_git",
            // "spr-compensation-mservice-api_git",
            // "spr-compensation-mservice_git",
            "spr-compensation-opplugin_git",
            // "spr-compensation-report_git",
            // "spr-compensation-servicehelper_git",
            // "spr-paystub-business_git",
            // "spr-paystub-common_git",
            // "spr-paystub-formplugin_git",
            // "spr-paystub-mservice-api_git",
            // "spr-paystub-mservice_git",
            // "spr-paystub-opplugin_git",
            // "spr-paystub-report_git",
            // "spr-paystub-servicehelper_git",
            // "spr-syssetting-business_git",
            "spr-syssetting-common_git",
            "spr-syssetting-formplugin_git",
            // "spr-syssetting-mservice-api_git",
            // "spr-syssetting-mservice_git",
            "spr-syssetting-opplugin_git",
            // "spr-syssetting-report_git",
            // "spr-syssetting-servicehelper_git"
        ];
        let $my = $("#my");
        let origin = $my.html();
        let buttions = [];
        for (let projectName of projectNames) {
            var copy = $(origin).clone();
            copy.attr("name", projectName);
            copy.attr("value", "http://172.17.8.17:8080/view/git/job/" + projectName + "/build?delay=0sec");
            copy.text(projectName);
            buttions.push(copy);
        }

        $my.append(buttions);
    }
};

document.addEventListener("DOMContentLoaded", function () {
    shr.init();
});