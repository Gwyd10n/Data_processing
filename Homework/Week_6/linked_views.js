// Name: Gwydion Oostvogel
// Student nr: 12578002

"use strict";

function updatePie(data) {
    console.log(data)

}

function worldmap(HPIdata) {

    // Get array with all topo objects
    let cc = Datamap.prototype.worldTopo.objects.world.geometries;
    let ccdict = {};
    // Add country and country code to dict
    for (let i = 0, l = cc.length; i < l; i++) {
        ccdict[cc[i].properties.name] = cc[i].id
    }

    // Create color scheme for countries based on HPI
    let HPIval = []
    for (let key in HPIdata) {
        HPIval.push(HPIdata[key]['happy_planet_index'])
    }
    let color = d3v5.scaleSequential(d3v5.interpolateRdYlGn).domain([Math.min(...HPIval), Math.max(...HPIval)]);
    let mapData = {};
    for (let key in HPIdata) {
        let value = HPIdata[key]['happy_planet_index']
        mapData[ccdict[key]] = {HPI: value, fillColor: color(value)}
    }

    let map = new Datamap({
        element: document.getElementById("container"),
        projection: 'mercator',
        data: mapData,
        fills: {defaultFill: "#AFAFAF"},
        highlightFillColor: function(geo) {
                return geo['fillColor'];
            },
        geographyConfig: {
            popupTemplate: function (geography) {
                return '<div class="hoverinfo">' + geography.properties.name + ' HPI: ' +
                    HPIdata[geography.properties.name]['happy_planet_index'] + '</div>';
            }
        },
        done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                updatePie(HPIdata[geography.properties.name]);
            });
        }
    });

    // create legend
    let legend = d3v5.select('#legend').style("height", "50px").style("width", "420px").style("position", "relative")
    .append("canvas").attr("height", 1).attr("width", 400).style("height", "10px").style("width", "400px")
    .style("border", "1px solid #000").style("position", "absolute").style("top", "10px").style("left", "10px")
    .node();

    let ctx = legend.getContext("2d");
    let legendscale = d3v5.scaleLinear().range([400, 1]).domain(color.domain());

    let image = ctx.createImageData(400, 1);
    d3v5.range(400).forEach(function(i) {
        let c = d3v5.rgb(color(legendscale.invert(i)));
        image.data[4*i] = c.r;
        image.data[4*i + 1] = c.g;
        image.data[4*i + 2] = c.b;
        image.data[4*i + 3] = 255;
    });
    ctx.putImageData(image, 0, 0);
    let legendaxis = d3v5.axisBottom().scale(legendscale).ticks(20);
    let svg = d3v5.select('#legend').append("svg").attr("height", "50px").attr("width", "420px")
                .style("position", "absolute").style("left", "0px").style("top", "10px");
    svg.append("g").attr("class", "axis").attr("transform", "translate(10,11)").call(legendaxis);

}

function loadJSON(path) {
    d3v5.json(path).then(function (d) {
        worldmap(d);
    });
}

window.onload = function () {
    loadJSON("dataCSV.json");
};

