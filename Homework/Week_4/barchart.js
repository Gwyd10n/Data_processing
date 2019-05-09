

function createChart(data) {
    "use strict";
    // Create arrays with the data in the json file
    let keys = Object.keys(data);
    let dataY = new Array(keys.length);
    for (let i = 0; i < dataY.length; i += 1) {
        dataY[i] = data[keys[i]]['value'];
    }
    // Add some space between edge and chart
    d3.select("body").append("div").attr("class", "spacer");

    // Create chart
    // TODO
    let width = 750;
    let height = 500;
    let lb_margin = 50;
    let rt_margin = 25;
    let svg = d3.select("body").append("svg");
    svg.attr("width", width).attr("height", height);
    // Create axes
    // let xAxis = d3.svg.axis().scale(width).orient("bottom");
    // svg.append("g").call(xAxis);
    svg.append("g")
    .call(d3.svg.axis()
                .scale(xScale)
                .orient("bottom"));



    // svg.append("line").attr("x1", lb_margin)
    //     .attr("y1", rt_margin)
    //     .attr("x2", lb_margin)
    //     .attr("y2", height - lb_margin)
    //     .attr("stroke", "black");
    // Create bars
    // TODO
    svg.selectAll("rect").data(dataY).enter().append("rect").attr("x", 0).attr("y", 0).attr("width", 20).attr("height", 100);
}

function loadData() {
    "use strict";
    // Read json file
    let fileName = "data.json";
    let txtFile = new XMLHttpRequest();
    txtFile.onreadystatechange = function () {
        if (txtFile.readyState === 4 && txtFile.status === 200) {
            // Create a bar chart with the data in the json file
            createChart(JSON.parse(txtFile.responseText))
        }
    };
    txtFile.open("GET", fileName);
    txtFile.send();
}

function createPage() {
    "use strict";
    // Create header and head
    d3.select("head").append("title").text("Renewable energy");
    d3.select("body").append("h1").text("Percentage renewable energy of primary energy supply");
    // read csv file
    loadData();
}

// Create the web page
createPage();


// Renewable energy is defined as the contribution of renewables to total primary energy supply (TPES). Renewables include the primary energy equivalent of hydro (excluding pumped storage), geothermal, solar, wind, tide and wave sources. Energy derived from solid biofuels, biogasoline, biodiesels, other liquid biofuels, biogases and the renewable fraction of municipal waste are also included. Biofuels are defined as fuels derived directly or indirectly from biomass (material obtained from living or recently living organisms). This includes wood, vegetal waste (including wood waste and crops used for energy production), ethanol, animal materials/wastes and sulphite lyes. Municipal waste comprises wastes produced by the residential, commercial and public service sectors that are collected by local authorities for disposal in a central location for the production of heat and/or power. This indicator is measured in thousand toe (tonne of oil equivalent) as well as in percentage of total primary energy supply.