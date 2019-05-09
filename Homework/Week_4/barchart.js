

function createChart(filename) {
    "use strict";

    // Define element dimensions
    let margin = {left: 40, right: 15, top: 15, bottom: 30};
    let width = 1100 - margin.left - margin.right;
    let height = 450 - margin.top - margin.bottom;

    // Create scales
    let xScale = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    let yScale = d3.scaleLinear()
        .range([height, margin.top]);

    // Source: http://bl.ocks.org/Caged/6476579
    let tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function (d) {
            return `Renewable energy used: <span style='color:#6199ff'>${d.value}%</span>`;
        });

    // Create svg element
    let svg = d3.select("body").append("svg").attr("class", "chart");
    svg.attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    // Get data
    d3.json(filename)
        .then(function (data) {
            // Scale domains
            xScale.domain(data.map(function (d) {
                return d.location;
            }));
            yScale.domain([0, 1]);



            // Create bars
            svg.selectAll(".bar").data(data).enter().append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return xScale(d.location) + margin.left;
                })
                .attr("width", xScale.bandwidth())
                .attr("y", function (d) {
                    return yScale(d.value / 100);
                })
                .attr("height", function (d) {
                    return height - yScale(d.value / 100);
                })
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            // Create axes
            svg.append("g").attr("transform", `translate(${margin.left},${height})`)
                .call(d3.axisBottom(xScale));
            svg.append("g").attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale).tickFormat(d3.format(".0%")));
        });
}


function createPage() {
    "use strict";
    // Create header and head
    d3.select("head").append("title").text("Renewable energy");
    d3.select("body").append("h1").text("Percentage renewable energy of primary energy supply");
    // Create bar chart
    createChart("data.json");
    d3.select("body").append("div").text("Renewable energy is defined as the contribution of renewables to total primary energy supply (TPES). Renewables include the primary energy equivalent of hydro (excluding pumped storage), geothermal, solar, wind, tide and wave sources. Energy derived from solid biofuels, biogasoline, biodiesels, other liquid biofuels, biogases and the renewable fraction of municipal waste are also included. Biofuels are defined as fuels derived directly or indirectly from biomass (material obtained from living or recently living organisms). This includes wood, vegetal waste (including wood waste and crops used for energy production), ethanol, animal materials/wastes and sulphite lyes. Municipal waste comprises wastes produced by the residential, commercial and public service sectors that are collected by local authorities for disposal in a central location for the production of heat and/or power. This indicator is measured in thousand toe (tonne of oil equivalent) as well as in percentage of total primary energy supply.")
        .attr("class", "description");
    d3.select("body").append("footer").text("Gwydion Oostvogel, 12578002");
}

// Create the web page
createPage();


