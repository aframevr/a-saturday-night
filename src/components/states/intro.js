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
    var el = this.el;
    var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var timeout = isChrome ? 0 : 800;
    var selectedAvatarEl = this.selectedAvatarEl = document.getElementById(data.avatar);
    var selectedAvatarHeadEl = selectedAvatarEl.querySelector('.head');
    var selectedAvatarRightHandEl = selectedAvatarEl.querySelector('.rightHand');
    var selectedAvatarLeftHandEl = selectedAvatarEl.querySelector('.leftHand');
    var avatarHeadEl = document.getElementById('avatarHead');
    var rightHandEl = document.getElementById('rightHand');
    var leftHandEl = document.getElementById('leftHand');
    var cameraRig = document.getElementById('cameraRig');
    if (!el.hasLoaded) {
      el.addEventListener('loaded', function (){
        self.loadDance(data);
      });
      return;
    }
    avatarHeadEl.addEventListener('model-loaded', function () {
      avatarHeadEl.setAttribute('visible', true);
      rightHandEl.setAttribute('visible', true);
      leftHandEl.setAttribute('visible', true);
    });

    el.sceneEl.setAttribute('game-state', 'selectedAvatar', selectedAvatarEl);
    avatarHeadEl.setAttribute('gltf-model', selectedAvatarHeadEl.getAttribute('gltf-model'));
    avatarHeadEl.setAttribute('visible', false);
    rightHandEl.setAttribute('visible', false);
    leftHandEl.setAttribute('visible', false);
    cameraRig.setAttribute('rotation', '0 180 0');
    rightHandEl.setAttribute('gltf-model', selectedAvatarRightHandEl.getAttribute('gltf-model'));
    leftHandEl.setAttribute('gltf-model', selectedAvatarLeftHandEl.getAttribute('gltf-model'));

    el.setAttribute('avatar-replayer', {
      spectatorMode: true,
      loop: true
    });

    window.setTimeout(function () {
      var soundSrc = isChrome ? '#song1ogg' : '#song1mp3';
      el.components['avatar-replayer'].startReplaying(data.recording);
      selectedAvatarEl.querySelector('[sound]').setAttribute('sound', 'src', soundSrc);
      selectedAvatarEl.querySelector('[sound]').components.sound.playSound();
      el.emit('dancing');
    }, timeout);
  },

  remove: function () {
    var animationEls = this.el.querySelectorAll('[begin=dancing]');
    var i;
    this.selectedAvatarEl.querySelector('[sound]').components.sound.stopSound();
    this.el.removeAttribute('avatar-replayer');
    for (i = 0; i < animationEls.length; ++i) {
      animationEls[i].stop();
    }
  }
});
