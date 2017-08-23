var audioCapabilities = require('../../utils').capabilities.audio;

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
    var position = this.el.isMobile ? '0 1.6 0.80' : '0 0 1.5';
    this.el.querySelector('#spectatorCameraRig').setAttribute('position', position);
  },

  loadDance: function (data) {
    var self = this;
    var el = this.el;
    var selectedAvatarEl = this.selectedAvatarEl = document.getElementById(data.avatar);
    var selectedAvatarHeadEl = selectedAvatarEl.querySelector('.head');
    var selectedAvatarRightHandEl = selectedAvatarEl.querySelector('.rightHand');
    var selectedAvatarLeftHandEl = selectedAvatarEl.querySelector('.leftHand');
    var avatarHeadEl = document.getElementById('avatarHead');
    var rightHandEl = document.getElementById('rightHand');
    var leftHandEl = document.getElementById('leftHand');
    var spectatorPositionY = el.is('vr-mode') ? 0 : 1.6;
    var spectatorPosition = this.el.isMobile ?
      '0 ' + spectatorPositionY + ' 0.80' : '0 ' + spectatorPositionY + ' 1.5';
    this.cameraRig = document.getElementById('cameraRig');
    if (!el.hasLoaded) {
      el.addEventListener('loaded', function () {
        self.loadDance(data);
      });
      return;
    }

    el.sceneEl.setAttribute('game-state', 'selectedAvatar', selectedAvatarEl);
    avatarHeadEl.setAttribute('gltf-model', selectedAvatarHeadEl.getAttribute('gltf-model'));
    // If model has not loaded we hide the avatar until it loads
    if (!avatarHeadEl.components['gltf-model'].model) {
      avatarHeadEl.setAttribute('visible', false);
      rightHandEl.setAttribute('visible', false);
      leftHandEl.setAttribute('visible', false);
      avatarHeadEl.addEventListener('model-loaded', function () {
        avatarHeadEl.setAttribute('visible', true);
        rightHandEl.setAttribute('visible', true);
        leftHandEl.setAttribute('visible', true);
      });
    } else {
      avatarHeadEl.setAttribute('visible', true);
      rightHandEl.setAttribute('visible', true);
      leftHandEl.setAttribute('visible', true);
    }
    this.cameraRig.setAttribute('rotation', '0 180 0');
    rightHandEl.setAttribute('gltf-model', selectedAvatarRightHandEl.getAttribute('gltf-model'));
    leftHandEl.setAttribute('gltf-model', selectedAvatarLeftHandEl.getAttribute('gltf-model'));

    document.getElementById('backText').setAttribute('visible', false);

    el.setAttribute('avatar-replayer', {
      spectatorMode: true,
      spectatorPosition: spectatorPosition,
      loop: true
    });

    document.getElementById('floor').setAttribute('discofloor', {pattern: data.avatar});

    var soundSrc = '#' + data.avatar + (audioCapabilities.opus ? 'ogg' : 'mp3');
    el.sceneEl.setAttribute('game-state', 'dancingTime', document.querySelector(soundSrc).getAttribute('duration'));
    el.components['avatar-replayer'].startReplaying(data.recording);
    document.querySelector('#room [sound]').setAttribute('sound', {
      src: soundSrc,
      autoplay: true,
      positional: false
    });
    this.insertSelectionHands();
    el.emit('dancing');
  },

  insertSelectionHands: function () {
    var leftSelectionHandEl;
    var rightSelectionHandEl;
    var spectatorCameraRigEl;
    if (this.insertedHands) { return; }
    this.onTriggerDown = this.onTriggerDown.bind(this);
    spectatorCameraRigEl = this.el.querySelector('#spectatorCameraRig');
    leftSelectionHandEl = this.leftSelectionHandEl = document.createElement('a-entity');
    rightSelectionHandEl = this.rightSelectionHandEl = document.createElement('a-entity');
    leftSelectionHandEl.id = 'leftSelectionHand';
    rightSelectionHandEl.id = 'rightSelectionHand';
    leftSelectionHandEl.setAttribute('vive-controls', 'hand: left');
    rightSelectionHandEl.setAttribute('vive-controls', 'hand: right');
    leftSelectionHandEl.setAttribute('oculus-touch-controls', 'hand: left');
    rightSelectionHandEl.setAttribute('oculus-touch-controls', 'hand: right');
    spectatorCameraRigEl.appendChild(leftSelectionHandEl);
    spectatorCameraRigEl.appendChild(rightSelectionHandEl);
    leftSelectionHandEl.addEventListener('triggerdown', this.onTriggerDown);
    rightSelectionHandEl.addEventListener('triggerdown', this.onTriggerDown);

    var textProps = {
      font : 'assets/asaturdaynight.fnt',
      color: '#fcff79',
      align: 'right',
      anchor:'right',
      side:  'double',
      value: '<< Press trigger to record\n and upload your dance',
      width: 0.40,
      opacity: 0
    };
    this.leftTooltip = document.createElement('a-entity');
    this.leftTooltip.setAttribute('text', textProps);
    this.leftTooltip.setAttribute('rotation', '-90 0 0');
    this.leftTooltip.setAttribute('position', '0.23 -0.03 0.06');
    this.rightTooltip = document.createElement('a-entity');
    this.rightTooltip.setAttribute('text', textProps);
    this.rightTooltip.setAttribute('text', {anchor: 'left', align: 'left', value: 'Press trigger to record >>\nand upload your dance'});
    this.rightTooltip.setAttribute('rotation', '-90 0 0');
    this.rightTooltip.setAttribute('position', '-0.23 -0.03 0.06');

    leftSelectionHandEl.appendChild(this.leftTooltip);
    rightSelectionHandEl.appendChild(this.rightTooltip);

    this.insertedHands = true;
  },

  onTriggerDown: function () {
    if (!this.el.sceneEl.is('vr-mode')) { return; }
    this.el.setAttribute('game-state', 'state', 'avatar-selection');
  },

  tick: function (time, delta) {
    if (!this.el.is('vr-mode')) return;
    var opacity = 1 - Math.abs( Math.sin(time / 200)) * 0.9;
    this.leftTooltip.setAttribute('text', {opacity: opacity });
    this.rightTooltip.setAttribute('text', {opacity: opacity });
  },

  remove: function () {
    var i;
    var animationEls = this.el.querySelectorAll('[begin=dancing]');
    var spectatorCameraRigEl = this.el.querySelector('#spectatorCameraRig');
    document.querySelector('#room [sound]').components.sound.stopSound();
    this.el.removeAttribute('avatar-replayer');
    this.cameraRig.setAttribute('rotation', '0 0 0');
    for (i = 0; i < animationEls.length; ++i) {
      animationEls[i].stop();
    }
    this.leftTooltip.parentNode.removeChild(this.leftTooltip);
    this.rightTooltip.parentNode.removeChild(this.rightTooltip);
    this.leftSelectionHandEl.removeEventListener('triggerdown', this.onTriggerDown);
    this.rightSelectionHandEl.removeEventListener('triggerdown', this.onTriggerDown);
    spectatorCameraRigEl.removeChild(this.leftSelectionHandEl);
    spectatorCameraRigEl.removeChild(this.rightSelectionHandEl);
  }
});
