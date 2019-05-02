var data;
loadData("KNMI_20190401.json");
var keys = Object.keys(data);
console.log(keys);
for (let key of keys) {
  console.log(data[key]['PG'], data[key]['UG']);
}

function loadData(fileName) {
  var txtFile = new XMLHttpRequest();
  txtFile.onreadystatechange = function() {
    if (txtFile.readyState === 4 && txtFile.status == 200) {
      window.data = (JSON.parse(txtFile.responseText));
    }
  }
  txtFile.open("GET", fileName, false);
  txtFile.send();
}
