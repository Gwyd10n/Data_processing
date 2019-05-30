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
    let getHPI = function (country) {
        return HPIdata[country]
    };

    getHPI('Belgium')

        let color = d3v3.scale.linear().domain([1,50])
      .interpolate(d3v3.interpolateHcl)
      .range([d3v3.rgb("#007AFF"), d3v3.rgb('#FFF500')]);

    // let color = d3v5.scale().domain([1,50]).range(["#FF0000", "#00FF00"]);
    // let color = d3v5.interpolateRgb("#FF0000", "#00FF00");
    console.log(color(25))

    let map = new Datamap({
        element: document.getElementById("container"),
        projection: 'mercator',
        data: HPIdata,
        fills: {defaultFill: "#3f3f3f"},
        geographyConfig: {
            popupTemplate: function (geography) {
                return '<div class="hoverinfo">' + geography.properties.name + ' HPI: ' +
                    HPIdata[geography.properties.name]['happy_planet_index'] + '</div>';
            }
        }
    });



    for (let country in HPIdata) {
        map.updateChoropleth({USA: color(getHPI(country))});
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