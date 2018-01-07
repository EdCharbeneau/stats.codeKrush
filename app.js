(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.app = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.registerEvent = registerEvent;
    exports.init = init;
    var eventId = "";

    function initGrid() {
        $("#grid").kendoGrid({
            columns: [{ field: "rank", title: "RANK", width: "120px", attributes: { style: "text-align: center" } }, { field: "playerName", title: "PLAYER NAME" }, { field: "score", title: "SCORE" }],
            pageable: { pageSize: 10 },
            rowTemplate: kendo.template($("#rowTemplate").html()),
            altRowTemplate: kendo.template($("#altRowTemplate").html())
        });
    };

    function addPositionNumbers(data) {
        return data.map(function (d, i) {
            return { "rank": i + 1, "playerName": d.playerName, "score": d.score };
        });
    };

    function fetchKinveyData() {
        Kinvey.User.getActiveUser();
        Kinvey.CustomEndpoint.execute('LeaderBoardPublic', { "eventId": eventId }).then(function (response) {
            setGridDataSource(response);
        })["catch"](function (error) {
            console.log("fail: " + error);
        });
        console.log("data fetched from Kinvey");
    };

    function initKinvey() {
        Kinvey.init({
            appKey: 'kid_SyAoJYoeG',
            appSecret: 'f66db4ebae354762b5e2816dec985ea8',
            apiHostname: 'https://baas.kinvey.com'
        });
    };

    function resolveEventId() {
        var savedEventId = getCookie("savedEventId");
        eventId = savedEventId == "" ? "telerik.com" : getCookie("savedEventId");
    }

    function setGridDataSource(data) {
        var dataSource = new kendo.data.DataSource({
            data: addPositionNumbers(data),
            pageSize: 10
        });
        var grid = $('#grid').data("kendoGrid");
        dataSource.read();
        dataSource.page(1);
        grid.setDataSource(dataSource);
    }

    function onInit() {
        resolveEventId();
        initKinvey();
        initGrid();
        var login = Kinvey.User.login({
            username: 'Public',
            password: 'progress.com'
        }).then(fetchKinveyData)["catch"](function (error) {
            if (error.name === 'ActiveUserError') {
                fetchKinveyData();
            } else {
                console.log(error);
            }
        });
        setInterval(fetchKinveyData, 30000);
    };

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        var expires = "expires=" + d.toGMTString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function registerEvent(event) {
        setCookie("savedEventId", event, 0); //clear current cookie
        if (event != "" && event != null) {
            setCookie("savedEventId", event, 30);
        }
        location.reload();
    }

    function init() {
        onInit();
        console.log("app initialized");
    }
});

