// Name: Gwydion Oostvogel
// Student nr: 12578002

"use strict";

function map() {
    let basic = new Datamap({
        element: document.getElementById("container"),
        geographyConfig: {
            popupTemplate: function (geography, data) {
                return '<div class="hoverinfo">' + geography.properties.name + ' ';
            }
        }
    });

}

window.onload = function () {
    map();
};