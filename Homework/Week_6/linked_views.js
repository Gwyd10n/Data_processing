// Name: Gwydion Oostvogel
// Student nr: 12578002

"use strict";

function worldmap(HPIdata) {

    // Get array with all topo objects
    let cc = Datamap.prototype.worldTopo.objects.world.geometries;
    let ccdict = {};
    // Add country and country code to dict
    for (let i = 0, l = cc.length; i < l; i++) {
        ccdict[cc[i].properties.name] = cc[i].id
    }

    // Function to get HPI value for country
    // let getHPI = function (country) {
    //     return HPIdata[country]
    // };

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
        }
    });
}

function loadJSON(path) {
    d3v5.json(path).then(function (d) {
        worldmap(d);
    });
}

window.onload = function () {
    loadJSON("dataCSV.json");
};

