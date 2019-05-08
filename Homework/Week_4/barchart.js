




function createChart(data) {
    "use strict";
    d3.select("body").selectAll("p").data(data).enter().append("p").text("New paragraph!");
}

function loadData() {
    "use strict";
    var fileName = "data.json";
    var txtFile = new XMLHttpRequest();
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status === 200) {
            createChart(JSON.parse(txtFile.responseText));
        }
    };
    txtFile.open("GET", fileName);
    txtFile.send();
}


loadData();