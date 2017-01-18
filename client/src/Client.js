function get(request, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
      var res = JSON.parse(xhttp.responseText);
      callback(res);
    }
  };
  xhttp.open("GET", request, true);
  xhttp.send();
}

const Client = { get };
export default Client;