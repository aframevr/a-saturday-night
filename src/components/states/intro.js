var getUrlParams = require('../../utils').getUrlParams;
var loadJSONFromUrl = require('../../utils').loadJSONFromUrl;

AFRAME.registerComponent('intro', {
  init: function () {
    var urlParams = getUrlParams();
    if (urlParams.url) {
      var self = this;
      this.el.sceneEl.systems['uploadcare'].download(urlParams.url, function (data) {
        var selectedAvatarEl = document.getElementById(data.content.avatar);
        var selectedAvatarHeadEl = selectedAvatarEl.querySelector('.head');
        var selectedAvatarRightHandEl = selectedAvatarEl.querySelector('.rightHand');
        var selectedAvatarLeftHandEl = selectedAvatarEl.querySelector('.leftHand');
        var avatarHeadEl = document.getElementById('avatarHead');
        var rightHandEl = document.getElementById('rightHand');
        var leftHandEl = document.getElementById('leftHand');
        self.el.sceneEl.setAttribute('game-state', 'selectedAvatar', selectedAvatarEl);
        avatarHeadEl.setAttribute('gltf-model', selectedAvatarHeadEl.getAttribute('gltf-model'));
        rightHandEl.setAttribute('gltf-model', selectedAvatarRightHandEl.getAttribute('gltf-model'));
        leftHandEl.setAttribute('gltf-model', selectedAvatarLeftHandEl.getAttribute('gltf-model'));

        self.el.setAttribute('avatar-replayer', {
          spectatorMode: true,
          loop: true
        });
        self.el.components['avatar-replayer'].startReplaying(data.content.recording);
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
