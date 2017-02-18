var getUrlParams = require('../../utils').getUrlParams;
var loadJSONFromUrl = require('../../utils').loadJSONFromUrl;

AFRAME.registerComponent('intro', {
  init: function () {
    var urlParams = getUrlParams();
    if (urlParams.url) {
      var self = this;
      loadJSONFromUrl(urlParams.url, function (data) {
        self.el.setAttribute('avatar-replayer', {
          spectatorMode: true,
          loop: true
        });
        self.el.components['avatar-replayer'].startReplaying(data.recording);
      });
    } else {
      this.el.setAttribute('avatar-replayer', {
        src: 'assets/dance.json',
        spectatorMode: true,
        loop: true
      });
    }
  },

  remove: function () {
    this.el.removeAttribute('avatar-replayer');
  }
});
