function initGrid(data) {
    $("#grid").kendoGrid({
        columns: [
            { field: "rank", title: "RANK", width: "120px", attributes: { style: "text-align: center" } },
            { field: "playerName", title: "PLAYER NAME" },
            { field: "score", title: "SCORE" }
        ],
        dataSource: {
            data: addPositionNumbers(data)
        }
    });
};

function addPositionNumbers(data) {
    return data.map((d, i) => { return { "rank": i + 1, "playerName": d.playerName, "score": d.score } })
};

function fetchData() {
    Kinvey.User.getActiveUser();
    Kinvey.CustomEndpoint.execute('LeaderBoardPublic')
        .then(function (response) {
            initGrid(response);
        })
        .catch(function (error) {
            console.log("fail: " + error)
        });
};

function initKinvey() {
    Kinvey.init({
        appKey: 'kid_SyAoJYoeG',
        appSecret: 'f66db4ebae354762b5e2816dec985ea8',
        apiHostname: 'https://baas.kinvey.com'
    });
};

function onInit(settings) {
    //todo implement settings
    initKinvey();
    var login = Kinvey.User.login({
        username: 'Public',
        password: 'progress.com'
    })
        .then(fetchData)
        .catch(function (error) {
            if (error.name === 'ActiveUserError') {
                fetchData();
            }
            else {
                console.log(error)
            }
        })
};

export function init() {
    onInit();
}