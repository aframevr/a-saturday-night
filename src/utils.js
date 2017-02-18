function getUrlParams () {
  var match;
  var pl = /\+/g;  // Regex for replacing addition symbol with a space
  var search = /([^&=]+)=?([^&]*)/g;
  var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
  var query = window.location.search.substring(1);
  var urlParams = {};

  match = search.exec(query);
  while (match) {
    urlParams[decode(match[1])] = decode(match[2]);
    match = search.exec(query);
  }
  return urlParams;
}

function loadJSONFromUrl (url, callback) {
  var loader = new THREE.XHRLoader();
  loader.crossOrigin = 'anonymous';
  var self = this;

  loader.load(url, function (buffer) {
    callback(JSON.parse(buffer));
  });
}

module.exports = {
  getUrlParams: getUrlParams,
  loadJSONFromUrl: loadJSONFromUrl
}
