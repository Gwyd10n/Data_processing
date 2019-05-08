




function createChart(data) {
    "use strict";
    var keys = Object.keys(data);
    d3.select("body").selectAll("p").data(keys).enter().append("p").text(function (d) { return d; });
}

function loadData() {
    "use strict";
    var fileName = "data.json";
    var txtFile = new XMLHttpRequest();
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status === 200) {
            // createChart(JSON.parse(txtFile.responseText));
            createChart([1, 2, 3, 4, 5]);
        }
    };
    txtFile.open("GET", fileName);
    txtFile.send();
}

function createPage() {
    d3.select("head").append("title").text("Renewable energy");
    d3.select("body").append("h1").text("Renewable energy consumption")
    loadData();
}


createPage();