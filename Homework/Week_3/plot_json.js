var DATA;
loadData("KNMI_20190401.json");
var KEYS = Object.keys(DATA);
drawData();


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

function drawData() {
  const canvas = document.getElementById('temp_graph');
  const ctx = canvas.getContext('2d');
  ctx.lineWidth = 1;
  ctx.moveTo(0, 140);

  for (var i =0; i < KEYS.length; i += 1) {
    ctx.lineTo(i, 140);
    console.log(i);
  }
  ctx.stroke();
}
//console.log(key, DATA[key]['TG'], DATA[key]['UG']);
//DATA[KEYS[0]]['TG']

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}