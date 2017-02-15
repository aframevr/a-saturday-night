var getUrlParams = require('../utils').getUrlParams;

AFRAME.registerSystem('a-saturday-night', {
  init: function () {

    var urlParams = getUrlParams();
    if (urlParams.url) {
      this.loadFromUrl(urlParams.url);
    }
  },
  loadJSON: function (json) {
    //@todo Play the current avatar
    // json.avatar is the ID of the selected avatar
    this.sceneEl.components['avatar-recorder'].recordingData = json.recording;
  },

  loadFromUrl: function (url) {
    var loader = new THREE.XHRLoader();
    loader.crossOrigin = 'anonymous';
    var self = this;

    loader.load(url, function (buffer) {
      self.loadJSON(JSON.parse(buffer));
    });
  }
});
