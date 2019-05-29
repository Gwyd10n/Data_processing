// Name: Gwydion Oostvogel
// Student nr: 12578002

"use strict";

function worldmap(HPIdata) {

    let map = new Datamap({
        element: document.getElementById("container"),
        projection: 'mercator',
        fills: {defaultFill: "#228B22"},
        data: HPIdata,
        geographyConfig: {
            popupTemplate: function (geography) {
                return '<div class="hoverinfo">' + geography.properties.name + ' HPI: ' + HPIdata[geography.properties.name]['happy_planet_index'];
            }
        }
    });
    map.updateChoropleth({LOW: "#FF0000"}, {MEDIUM: "#777700"}, {HIGH: "#00FF00"});
    for (let country in HPIdata) {
        console.log()
    }
}

function loadJSON(path) {
    d3v5.json(path).then(function (d) {
        worldmap(d);
    });
}

window.onload = function () {
    loadJSON("dataCSV.json");
};