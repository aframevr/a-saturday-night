var getUrlParams = require('../../utils').getUrlParams;
var loadJSONFromUrl = require('../../utils').loadJSONFromUrl;
var defaultDanceData = require('json!../../../assets/dance.json');

AFRAME.registerComponent('intro', {
  init: function () {
    var urlParams = getUrlParams();
    var self = this;
    if (urlParams.url) {
      this.el.sceneEl.systems['uploadcare'].download(urlParams.url, function(data) {
        self.loadDance(data.content);
      });
    } else {
      this.loadDance(defaultDanceData);
    }
  },

  loadDance: function (data) {
    var self = this;
    var selectedAvatarEl = document.getElementById(data.avatar);
    var selectedAvatarHeadEl = selectedAvatarEl.querySelector('.head');
    var selectedAvatarRightHandEl = selectedAvatarEl.querySelector('.rightHand');
    var selectedAvatarLeftHandEl = selectedAvatarEl.querySelector('.leftHand');
    var avatarHeadEl = document.getElementById('avatarHead');
    var rightHandEl = document.getElementById('rightHand');
    var leftHandEl = document.getElementById('leftHand');
    var cameraRig = document.getElementById('cameraRig');
    if (!this.el.hasLoaded) {
      this.el.addEventListener('loaded', function (){
        self.loadDance(data);
      });
      return;
    }
    this.el.sceneEl.setAttribute('game-state', 'selectedAvatar', selectedAvatarEl);
    avatarHeadEl.setAttribute('gltf-model', selectedAvatarHeadEl.getAttribute('gltf-model'));
    avatarHeadEl.setAttribute('visible', false);
    rightHandEl.setAttribute('visible', false);
    leftHandEl.setAttribute('visible', false);
    cameraRig.setAttribute('rotation', '0 180 0');
    rightHandEl.setAttribute('gltf-model', selectedAvatarRightHandEl.getAttribute('gltf-model'));
    leftHandEl.setAttribute('gltf-model', selectedAvatarLeftHandEl.getAttribute('gltf-model'));

    this.el.setAttribute('avatar-replayer', {
      spectatorMode: true,
      loop: true
    });

    document.getElementById('spectatorCamera').setAttribute('position', '0 1.6 2');
    window.setTimeout(function () {
      avatarHeadEl.setAttribute('visible', true);
      rightHandEl.setAttribute('visible', true);
      leftHandEl.setAttribute('visible', true);
      self.el.components['avatar-replayer'].startReplaying(data.recording);
      self.el.emit('dancing');
      selectedAvatarEl.querySelector('[sound]').components.sound.playSound();
    }, 5000);
  },

  remove: function () {
    this.el.removeAttribute('avatar-replayer');
  }
});
