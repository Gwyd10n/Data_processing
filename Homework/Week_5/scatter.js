// Name: Gwydion Oostvogel
// Student nr: 12578002

function scatterPlot(data) {
    "use strict";
    // console.log(data[0]);
    let xYear = 5;
    let yYear = 55;
    let dataArr = [];

    // for (let key in data[0]) {
    //
    //     if (data[0].hasOwnProperty(key) && data[1].hasOwnProperty(key)) {
    //         if (data[0][key][xYear] && data[1][key][yYear]) {
    //             dataArr.push([key, data[0][key][xYear].Datapoint, data[1][key][yYear].Datapoint]);
    //             // console.log(key, data[0][key][xYear].Datapoint, data[1][key][yYear].Datapoint);
    //         }
    //     }
    // }

    for (let key in data[0]) {
        if (data[0][key] && data[1].hasOwnProperty(key)) {
            if (data[0][key][xYear] && data[1][key][yYear]) {
                c++;
                dataArr.push([key, data[0][key][xYear].Datapoint, data[1][key][yYear].Datapoint]);
                // console.log(key, data[0][key][xYear].Datapoint, data[1][key][yYear].Datapoint);
            }
        }
    }

    console.log(dataArr);

    let keys0 = [];
    let keys1 = [];
    let inBoth = 0;

    for (let key in data[0]) {
        if (data[0][key][xYear]) {
            keys0.push(key);
        }
    }

    for (let key in data[1]) {
        if (data[1][key][yYear]) {
            keys1.push(key);
        }
    }

    for (let key0 in keys0) {
        if (key0 in keys1) {
            inBoth += 1;
        }
    }

    console.log("keys0", keys0);
    console.log("keys1", keys1);
    console.log("inBoth", inBoth);
}

function transformGDP(data){

    // Save data
    let originalData = data;

    // access data
    let dataHere = data.dataSets[0].observations;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.observation;
    let seriesLength = series.length;

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataObject = {};

    // for each string that we created
    strings.forEach(function(string){
        observation.values.forEach(function(obs, index){
            let data = dataHere[string];
            if (data !== undefined){

                // set up temporary object
                let tempObj = {};

                // split string into array of elements seperated by ':'
                let tempString = string.split(":")
                tempString.forEach(function(s, index){
                    tempObj[varArray[index].name] = varArray[index].values[s].name;
                });

                tempObj["Datapoint"] = data[0];

                // Add to total object
                if (dataObject[tempObj["Country"]] == undefined){
                  dataObject[tempObj["Country"]] = [tempObj];
                } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
                    dataObject[tempObj["Country"]].push(tempObj);
                }
            }
        });
    });

    // return the finished product!
    return dataObject;
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
                if (dataObject[tempObj["Country"]] == undefined){
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

function cleanData(data) {
    "use strict";
    let dataCleaned = [transformResponse(data[0]), transformResponse(data[1]), transformGDP(data[2])];
    scatterPlot(dataCleaned);
    // luister voor dropdown menu input?
}

function getData() {
    "use strict";
    // links API
    let teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017";
    let teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=1960&endTime=2017";
    let GDP = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2012&endTime=2018&dimensionAtObservation=allDimensions";

    let requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(GDP)];

    Promise.all(requests).then(function (response) {
         cleanData(response);
    }).catch(function (e) {
        throw (e);
    });
}

window.onload = function () {
    "use strict";
    getData();
};
