var getUrlParams = require('../../utils').getUrlParams;
var defaultDanceData = require('json!../../../assets/dance.json');

AFRAME.registerComponent('replay', {
  init: function () {
    this.onEnterVR = this.onEnterVR.bind(this);
  },

  play: function () {
    this.el.addEventListener('enter-vr', this.onEnterVR);
  },

  pause: function () {
    this.el.removeEventListener('enter-vr', this.onEnterVR);
  },

  onEnterVR: function () {
    this.el.querySelector('#spectatorCamera').setAttribute('position','0 0 2');
  },

  loadDance: function (data) {
    var self = this;
    var el = this.el;
    window.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    var timeout = isChrome ? 0 : 800;
    var selectedAvatarEl = this.selectedAvatarEl = document.getElementById(data.avatar);
    var selectedAvatarHeadEl = selectedAvatarEl.querySelector('.head');
    var selectedAvatarRightHandEl = selectedAvatarEl.querySelector('.rightHand');
    var selectedAvatarLeftHandEl = selectedAvatarEl.querySelector('.leftHand');
    var avatarHeadEl = document.getElementById('avatarHead');
    var rightHandEl = document.getElementById('rightHand');
    var leftHandEl = document.getElementById('leftHand');
    this.cameraRig = document.getElementById('cameraRig');
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
    this.cameraRig.setAttribute('rotation', '0 180 0');
    rightHandEl.setAttribute('gltf-model', selectedAvatarRightHandEl.getAttribute('gltf-model'));
    leftHandEl.setAttribute('gltf-model', selectedAvatarLeftHandEl.getAttribute('gltf-model'));

    document.getElementById('backText').setAttribute('visible', false);

    el.setAttribute('avatar-replayer', {
      spectatorMode: true,
      loop: true
    });

    var soundSrc = '#' + data.avatar + (isChrome ? 'ogg' : 'mp3');
    el.sceneEl.setAttribute('game-state', 'dancingTime', document.querySelector(soundSrc).getAttribute('duration'));
    el.components['avatar-replayer'].startReplaying(data.recording);
    document.querySelector('#room [sound]').setAttribute('sound', 'src', soundSrc);
    document.querySelector('#room [sound]').components.sound.playSound();
    el.emit('dancing');
  },

  remove: function () {
    var i;
    var animationEls = this.el.querySelectorAll('[begin=dancing]');
    document.querySelector('#room [sound]').components.sound.stopSound();
    this.el.removeAttribute('avatar-replayer');
    this.cameraRig.setAttribute('rotation', '0 0 0');
    for (i = 0; i < animationEls.length; ++i) {
      animationEls[i].stop();
    }
  }
});
