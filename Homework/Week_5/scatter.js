// Name: Gwydion Oostvogel
// Student nr: 12578002

"use strict";
let data = [];

function scatterplot() {

    let width = 600;
    let height = 450;
    let margin = 30;
    let year = document.getElementById("year").
                options[document.getElementById("year").selectedIndex].value;
    let plotData = data[year];

    // Create colours, could not use colorBrewer bc the max number of colours they provide is 12
    let colours = [];
    let hue = [30, 50, 80];
    let saturation = [90, 100];
    let satLen = saturation.length;
    let dataLen = plotData.length;
    let hueLen = hue.length;
    let country = "";

    for (let i = 0; i < dataLen; i ++) {
        country = plotData[i][0];
        colours.push([country, `hsl(${360 / dataLen * i},${saturation[i % satLen]}%, ${hue[i % hueLen]}%)`]);
    }

    console.log(colours);
    // Remove old chart
    d3.select("#plot").remove();
    d3.select("#leg").remove();

    // Create scales
    let xScale = d3.scaleLinear()
        .domain([d3.min(plotData, function (d) {
            return d[1];
        }) - 1,
        d3.max(plotData, function (d) {
            return d[1];
        }) + 1])
        .range([margin, width - margin]);

    let yScale = d3.scaleLinear()
        .domain([d3.min(plotData, function (d) {
            return d[2];
        }) - 1,
        d3.max(plotData, function (d) {
            return d[2];
        }) + 1])
        .range([height - margin, margin]);


    let svg = d3.select("#scatter").append("svg")
        .attr("width", width).attr("height", height).attr("id", "plot");

    // Create y axis
    svg.append("g").attr("transform", `translate(${margin},0)`)
        .call(d3.axisLeft(yScale));
    svg.append("text").attr("class", "label")
        .attr("transform", "rotate(-90)").attr("y", margin).attr("x", margin - 60)
        .attr("dy", "0.8em").style("text-anchor", "end").text("Teen pregnancies");

    // Create x axis
    svg.append("g").attr("transform", `translate(0,${height - margin})`)
        .call(d3.axisBottom(xScale));
    svg.append("text").attr("class", "label")
        .attr("x", width - margin).attr("y", height - margin)
        .attr("dy", "-0.1em").style("text-anchor", "end").text("Teens in violent area");

    // Plot data
    svg.selectAll("circle").data(plotData).enter()
        .append("circle").attr("class", "dot").attr("cx", function (d) {
            return xScale(d[1]);
        })
        .attr("cy", function (d) {
            return yScale(d[2]);
        })
        .attr("r", 5)
        .style("fill", function (d) {
            return colours[d[0]];
        });

    // Create legend


    //     let cScale = d3.scaleBand()
    //     .range([0, width])
    //     .padding(0.1).domain(colours.map(function (d) {
    //             return d[0];
    //         }));
    //
    //     let svgLeg = d3.select("#legend").append("svg")
    //     .attr("width", width).attr("height", 100).attr("id", "leg");
    //
    //
    //
    //     svg.selectAll(".bar").data(colours).enter().append("rect")
    //             .attr("y", function (d) {
    //                 return cScale(d[0]);
    //             })
    //             .attr("height", cScale.bandwidth())
    //             .attr("y", 10)
    //             .attr("width", 10);
    //
    // svgLeg.append("g").call(d3.axisLeft(cScale));

    // let cScale = d3.scaleBand().domain(data.map(function (d) {
    //             return d[0];
    //         }))
    //     .range([0, height])
    //     .padding(0.5);
    //
    // let svgLeg = d3.select("#scatter").append("svg")
    //     .attr("width", 100).attr("height", height).attr("id", "leg");
    //
    // svgLeg.selectAll(".bar").data(plotData).enter()
    //     // .attr("transform", function(d, i) {
    //     //     return `translate(0, ${i * 10})`;
    //     // })
    //     .append("rect")
    //     .attr("y", )
    //     .attr("x", 0).attr("y", function (i) {
    //                 return i * 10;
    //             })
    //     .attr("height", 14).attr("width", 14)
    //     .style("fill", function (d) {
    //         return colours[d[0]];
    //     });
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
    let dataCl = [transformResponse(dataUnc[0]), transformResponse(dataUnc[1])];
    let years = dataCl[0][Object.keys(dataCl[0])[0]].length;
    let dataArr = [];

    // Parse data to array
    for (let year = 0; year < years; year++) {
        let yearArr = [];
        for (let key in dataCl[1]) {
            if (dataCl[0].hasOwnProperty(key)) {
                if (dataCl[0][key][year] && dataCl[1][key][year]) {
                    yearArr.push([key, dataCl[0][key][year].Datapoint, dataCl[1][key][year].Datapoint]);
                }
            }
        }
        dataArr.push(yearArr);
    }
    data = dataArr;
}

window.onload = function () {
    // links API
    let teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2016";
    let teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=2010&endTime=2016";

    let requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies)];

    Promise.all(requests).then(function (response) {
        cleanData(response);
        scatterplot();
    }).catch(function (e) {
        throw (e);
    });
};
