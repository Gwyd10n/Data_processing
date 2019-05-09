

function createChart(data) {
    "use strict";
    var keys = Object.keys(data);
    var dataY = new Array(keys.length);
    for (var i = 0; i < dataY.length; i += 1) {
        dataY[i] = data[keys[i]]['value'];
        console.log(dataY[i]);
    }

    // d3.select("body").selectAll("div").data(keys).enter().append("div").text(function (d) {return d;}).attr("class", "bar");
    for (var i = 0; i < 3; i += 1) {
        d3.select("body").append("div").attr("class", "spacer");
    }
    d3.select("body").selectAll("div").data(dataY).enter().append("div").attr("class", "bar").style("height", function (d) {return d * 5  + "px";});
}

function loadData() {
    "use strict";
    var fileName = "data.json";
    var txtFile = new XMLHttpRequest();
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status === 200) {
            createChart(JSON.parse(txtFile.responseText));
            // createChart([1, 2, 3, 4, 5]);
        }
    };
    txtFile.open("GET", fileName);
    txtFile.send();
}

function createPage() {
    "use strict";
    d3.select("head").append("title").text("Renewable energy");
    d3.select("body").append("h1").text("Percentage renewable energy of primary energy supply");
    loadData();
}


createPage();
// function (d) {return ((d * 11.630) / 1000)  + "px";} in GWh


// Renewable energy is defined as the contribution of renewables to total primary energy supply (TPES). Renewables include the primary energy equivalent of hydro (excluding pumped storage), geothermal, solar, wind, tide and wave sources. Energy derived from solid biofuels, biogasoline, biodiesels, other liquid biofuels, biogases and the renewable fraction of municipal waste are also included. Biofuels are defined as fuels derived directly or indirectly from biomass (material obtained from living or recently living organisms). This includes wood, vegetal waste (including wood waste and crops used for energy production), ethanol, animal materials/wastes and sulphite lyes. Municipal waste comprises wastes produced by the residential, commercial and public service sectors that are collected by local authorities for disposal in a central location for the production of heat and/or power. This indicator is measured in thousand toe (tonne of oil equivalent) as well as in percentage of total primary energy supply.