// Plot data from JSON file to canvas element.
// Name: Gwydion Oostvogel
// Student nr: 12578002

var DATA;
loadData("KNMI_20190401.json");
var KEYS = Object.keys(DATA);
draw();

function loadData(fileName) {
  var txtFile = new XMLHttpRequest();
  txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
      window.DATA = (JSON.parse(txtFile.responseText));
    }
  }
  txtFile.open("GET", fileName, false);
  txtFile.send();
}

function draw() {
  const canvas = document.getElementById('temp_graph');
  const ctx = canvas.getContext('2d');

  var height = 600;
  var width = 950;
  var maxYAxisVal = 425;
  var xRange = 365 * 3;

  var yMax = 25;
  var yMin = height - 75;
  var xMax = width - 25;
  var xMin = 75;

  // Draw x- and y-axis.
  ctx.strokeStyle = "#000";
  ctx.moveTo(xMin, yMax);
  ctx.lineTo(xMin, yMin + 25);
  ctx.moveTo(xMin - 25, yMin)
  ctx.lineTo(xMax + 25, yMin)
  ctx.stroke();
  ctx.textAlign = "middle";
  ctx.fillText("Temp.", 25, 10)
  ctx.fillText("Month", xMin + (xMax-xMin) / 2, yMin + 50)

  // Create y labels.
  for(var i = yMax; i <= yMin; i += 25) {
    ctx.textAlign = "end";
    ctx.fillText((maxYAxisVal - i) / 10 + "(C)", 60, i - 5);
    ctx.strokeStyle = "#BBB";
    ctx.beginPath();
    ctx.moveTo(xMin - 25, i);
    ctx.lineTo(xMax, i);
    ctx.stroke();
  }

  // Create x labels
  var months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  for(var i = 0; i < 36; i += 1) {
    ctx.textBaseline = "middle";
    ctx.fillText(months[i % 12], xMin + ((xMax - xMin) / 36) * (i + 1) + 2.5, yMin + 10);
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(xMin + ((xMax - xMin) / 36) * (i + 1), yMin)
    ctx.lineTo(xMin + ((xMax - xMin) / 36) * (i + 1), yMin + 5)
    ctx.stroke();
  }

  // Plot data
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#f90000";
  ctx.moveTo(xMin + ((xMax - xMin) / 36), maxYAxisVal - DATA[KEYS[0]]['TG']);
  for (var i = 1; i < KEYS.length; i += 1) {
    ctx.lineTo(xMin + ((xMax - xMin) / 38) + i * ((xMax - xMin - 25) / KEYS.length), maxYAxisVal - DATA[KEYS[i]]['TG']);
    console.log(i, (DATA[KEYS[i]]['TG']));
  }
  ctx.stroke();
}
