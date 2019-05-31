// Name: Gwydion Oostvogel
// Student nr: 12578002

"use strict";
function createPie(cData) {
    let width = 330,
        height = 330,
        rad = 150,
        color = d3v5.scaleOrdinal(d3v5.schemeCategory10),
        data = [{"label": "Unhappy", "value":cData["average_life_expectancy"] - cData["happy_life_years"]},
                {"label": "Happy", "value":cData["happy_life_years"]}];

    let chart = d3v5.select("#piechart").append("svg").data([data])
        .attr("width", width).attr("height", height).attr("id", "pieplot")
        .append("g").attr("transform", `translate(${rad},${rad})`),
        arc = d3v5.arc().innerRadius(0).outerRadius(rad),
        pie = d3v5.pie().value(function(d) {
            return d.value;
        });

    let arcs = chart.selectAll("g.slice").data(pie)
        .enter().append("g").attr("class", "slice");

        arcs.append("path").attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc);

        arcs.append("text").attr("transform", function(d) {
                d.innerRadius = rad/4;
                d.outerRadius = rad;
                return `translate(${arc.centroid(d)})`;
            })
            .attr("text-anchor", "middle")
            .text(function(d, i) {
                return `${data[i].label}: ${(data[i].value).toFixed(1)}`;
            });

        chart.append("text").attr("x", 20).attr("y", rad + 20)
        .style("text-anchor", "middle").text(`Average life expectancy: ${cData["average_life_expectancy"]}`);
}


function updatePie(Cdata) {
    d3v5.select("#pieplot").remove();
    createPie(Cdata);
}


function worldmap(HPIdata) {

    // Get array with all topo objects
    let cc = Datamap.prototype.worldTopo.objects.world.geometries,
    ccdict = {};
    // Add country and country code to dict
    for (let i = 0, l = cc.length; i < l; i++) {
        ccdict[cc[i].properties.name] = cc[i].id
    }

    // Create color scheme for countries based on HPI
    let HPIval = [];
    for (let key in HPIdata) {
        HPIval.push(HPIdata[key]["happy_planet_index"])
    }
    let color = d3v5.scaleSequential(d3v5.interpolateRdYlGn).domain([Math.min(...HPIval), Math.max(...HPIval)]),
        mapData = {};
    for (let key in HPIdata) {
        let value = HPIdata[key]["happy_planet_index"]
        mapData[ccdict[key]] = {HPI: value, fillColor: color(value)}
    }

    new Datamap({
        element: document.getElementById("container"),
        projection: "mercator",
        data: mapData,
        fills: {defaultFill: "#CFCFCF"},
        highlightFillColor: function(geo) {
                return geo["fillColor"];
            },
        geographyConfig: {
            popupTemplate: function (geography) {
                return `<div class="hoverinfo"> ${geography.properties.name} ` +
                    `HPI: ${HPIdata[geography.properties.name]["happy_planet_index"]}</div>`;
            },
            highlightOnHover: true,
            highlightFillColor: "#43A2CA",
        },
        done: function(datamap) {
            datamap.svg.selectAll(".datamaps-subunit").on("click", function(geography) {
                updatePie(HPIdata[geography.properties.name]);
            });
        }
    });

    // create legend
    let legend = d3v5.select("#legend").style("height", "100px").style("width", "420px").style("position", "relative")
    .append("canvas").attr("height", 1).attr("width", 400).style("height", "10px").style("width", "400px")
    .style("border", "1px solid #000").style("position", "absolute").style("top", "30px").style("left", "10px")
    .node();

    let ctx = legend.getContext("2d");
    let legendscale = d3v5.scaleLinear().range([400, 1]).domain(color.domain());

    // Fill bar with colors
    let image = ctx.createImageData(400, 1);
    d3v5.range(400).forEach(function(i) {
        let c = d3v5.rgb(color(legendscale.invert(i)));
        image.data[4*i] = c.r;
        image.data[4*i + 1] = c.g;
        image.data[4*i + 2] = c.b;
        image.data[4*i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);

    // Create legend axis
    let legendaxis = d3v5.axisBottom().scale(legendscale).ticks(20);
    let svg = d3v5.select("#legend").append("svg").attr("height", "100px").attr("width", "420px")
                .style("position", "absolute").style("left", "0px").style("top", "30px");
    svg.append("g").attr("class", "axis").attr("transform", "translate(10,11)").call(legendaxis);

    svg.append("text").attr("class", "label")
        .attr("x", 225).attr("y", 45)
        .style("text-anchor", "middle").text("Happy planet index");

    // Create piechart
    createPie(HPIdata["Netherlands"])
}

function loadJSON(path) {
    // Get data from json
    d3v5.json(path).then(function (d) {
        worldmap(d);
    });
}

window.onload = function () {
    loadJSON("dataCSV.json");
};

