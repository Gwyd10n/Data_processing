// Name: Gwydion Oostvogel
// Student nr: 12578002

"use strict";

function worldmap(HPIdata) {

    // console.log(HPIdata);


    let map = new Datamap({
        element: document.getElementById("container"),
        projection: 'mercator',
        fills: {defaultFill: "#228B22"},
        data: HPIdata,
        geographyConfig: {
            popupTemplate: function (geography) {
                for (let idx = 0; idx < HPIdata.length; idx++) {
                    console.log("hey");
                    if (HPIdata[idx].country == geography.properties.name){
                        console.log(HPIdata[country])
                        return '<div class="hoverinfo">' + geography.properties.name + ' ' + HPIdata[idx];
                    }
                }
                return '<div class="hoverinfo">' + geography.properties.name;
            }
        }
    });
    map.updateChoropleth({USA: "#FF0000"})
    }

function loadJSON(path) {
    d3v5.json(path).then(function (d) {
        worldmap(d);
    });
}

window.onload = function () {
    loadJSON("dataCSV.json");
};