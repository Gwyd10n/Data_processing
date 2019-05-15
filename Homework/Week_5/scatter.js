// Name: Gwydion Oostvogel
// Student nr: 12578002

"use strict";
let data = [];

function scatterplot() {

    console.log(data);

    let width = 600;
    let height = 450;
    let margin = 30;
    let year = document.getElementById("year").options[document.getElementById("year").selectedIndex].value;
    let plotData = data[year];

    let xScale = d3.scaleLinear().domain([0, d3.max(data[year], function(d) { return d[1]; })])
        .range([margin, width - margin]);            // d3.max(data[year], function(d) { return d[1]; })
    console.log(xScale(20));
    let yScale = d3.scaleLinear().domain([0, d3.max(data[year], function(d) {return d[2]; })])
        .range([height - margin, margin]);

    // Remove old chart
    d3.select("#plot").remove();
    let svg = d3.select("#scatter").append("svg").attr("width", width).attr("height", height).attr("id", "plot");

    // Create y axis
    svg.append("g").attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(yScale));
    // Create x axis
    svg.append("g").attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(xScale));

    svg.selectAll("circle").data(plotData).enter()
        .append("circle").attr("class", "dot").attr("cx", function(d) {
            return xScale(d[1]);
        })
        .attr("cy", function(d) {
            return yScale(d[2]);
        })
        .attr("r", 5);

}

function transformResponse(data) {

    // Save data
    let originalData = data;

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output object, an object with each country being a key and an array
    // as value
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data !== undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["Time"] = obs.name;
                tempObj["Datapoint"] = data[0];
                tempObj["Indicator"] = originalData.structure.dimensions.series[1].values[0].name;

                // Add to total object
                if (dataObject[tempObj["Country"]] === undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else {
                  dataObject[tempObj["Country"]].push(tempObj);
                }
            }
        });
    });

    // return the finished product!
    return dataObject;
}

function cleanData(dataUnc) {
    let data = [transformResponse(dataUnc[0]), transformResponse(dataUnc[1])];
    let years = data[0][Object.keys(data[0])[0]].length;
    let dataArr = [];

    for (let year = 0; year < years; year++) {
        let yearArr = [];
        for (let key in data[1]) {
            if (data[0].hasOwnProperty(key)) {
                if (data[0][key][year] && data[1][key][year]) {
                    yearArr.push([key, data[0][key][year].Datapoint, data[1][key][year].Datapoint]);
                }
            }
        }
        dataArr.push(yearArr);
    }
    return dataArr;
}

window.onload = function () {
    // links API
    let teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2016";
    let teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=2010&endTime=2016";

    let requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies)];

    Promise.all(requests).then(function (response) {
        data = cleanData(response);
        scatterplot();
    }).catch(function (e) {
        throw (e);
    });
};
