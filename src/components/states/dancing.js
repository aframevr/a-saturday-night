var audioCapabilities = require('../../utils').capabilities.audio;

AFRAME.registerComponent('dancing', {
  init: function () {
    var el = this.el;
    var textElement = this.textElement = document.getElementById('centeredText');
    var counter0 = this.counter0 = document.getElementById('counter0');
    var counter1 = this.counter1 = document.getElementById('counter1');
    var soundEl = document.querySelector('#room [sound]');
    this.avatarHeadEl = el.querySelector('#avatarHead');

    var avatarId = this.el.getAttribute('game-state').selectedAvatar.id;
    var soundAsset = '#' + avatarId + (audioCapabilities.opus ? 'ogg' : 'mp3');
    el.setAttribute('game-state', 'dancingTime', document.querySelector(soundAsset).getAttribute('duration'));
    soundEl.setAttribute('sound', 'src', soundAsset);

    el.querySelector('#floor').setAttribute('discofloor', {pattern: avatarId});

    this.dancingTime = this.el.getAttribute('game-state').dancingTime;

    textElement.setAttribute('visible', true);
    textElement.setAttribute('text', {value: 'Dance!', opacity: 1});
    var object = { opacity: 1.0 };
    new AFRAME.TWEEN.Tween(object)
      .to({opacity: 0.0}, 500)
      .delay(300)
      .onUpdate(function () {
        textElement.setAttribute('text', {opacity: object.opacity});
      })
      .onComplete(function () {
        textElement.setAttribute('visible', false);
      })
      .start();

    counter0.setAttribute('text', {value: '!!'});
    counter1.setAttribute('text', {value: '!!'});
    counter0.setAttribute('visible', true);
    counter1.setAttribute('visible', true);

    this.countdown = this.countdown.bind(this);
    soundEl.components.sound.playSound();

    this.setupAvatarMimo();

    el.components['avatar-recorder'].startRecording();
    this.interval = window.setInterval(this.countdown, 1000);
  },

  setupAvatarMimo: function () {
    var avatarEl = this.el.getAttribute('game-state').selectedAvatar;
    var avatarMimoRigEl = this.avatarMimoRigEl = this.avatarMimoRigEl || this.initMimoRig();
    avatarMimoRigEl.setAttribute('visible', true);
    this.rightHandMimoEl.setAttribute('gltf-model',
      avatarEl.querySelector('.rightHand').getAttribute('gltf-model'));
    this.leftHandMimoEl.setAttribute('gltf-model',
      avatarEl.querySelector('.leftHand').getAttribute('gltf-model'));
    this.headMimoEl.setAttribute('gltf-model',
      avatarEl.querySelector('.head').getAttribute('gltf-model'));
  },

  // fix until A-Frame issue is resolved
  // https://github.com/aframevr/aframe/issues/2928
  whenLoaded: function(el) {
    return new Promise(function (resolve) {
      if (el.hasLoaded) resolve(el);
      el.addEventListener('loaded', function() {
        resolve(el)
      });
    })
  },

  initMimoRig: function () {
    var avatarMimoRigEl = this.avatarMimoRigEl = document.createElement('a-entity');
    var avatarMimoRigPivotEl = this.avatarMimoRigPivotEl = document.createElement('a-entity');
    var rightHandMimoEl = this.rightHandMimoEl = document.createElement('a-entity');
    var leftHandMimoEl = this.leftHandMimoEl = document.createElement('a-entity');
    var headMimoEl = this.headMimoEl = document.createElement('a-entity');
    this.whenLoaded(headMimoEl).then(function (el) { el.setAttribute('mimo', '#avatarHead'); })
    this.whenLoaded(rightHandMimoEl).then(function (el) { el.setAttribute('mimo', '#leftHand'); })
    this.whenLoaded(leftHandMimoEl).then(function (el) { el.setAttribute('mimo', '#rightHand'); })
    avatarMimoRigEl.appendChild(rightHandMimoEl);
    avatarMimoRigEl.appendChild(leftHandMimoEl);
    avatarMimoRigEl.setAttribute('position', '0 0 -2.5');
    avatarMimoRigEl.setAttribute('rotation', '0 180 0');
    avatarMimoRigEl.appendChild(headMimoEl);
    avatarMimoRigPivotEl.appendChild(avatarMimoRigEl);
    this.el.appendChild(avatarMimoRigPivotEl);
    return avatarMimoRigEl;
  },

  countdown: function () {
    var el = this.el;
    this.dancingTime--;
    this.counter0.setAttribute('text', {value: this.dancingTime.toString()});
    this.counter1.setAttribute('text', {value: this.dancingTime.toString()});

    if (this.dancingTime === 0) {
      window.clearInterval(this.interval);
      el.components['avatar-recorder'].stopRecording();
      document.getElementById('cameraRig').setAttribute('rotation', '0 180 0');
    }
    el.setAttribute('game-state', 'dancingTime', this.dancingTime);
  },

  remove: function () {
    var el = this.el;
    var leftHandEl = el.querySelector('#leftHand');
    var rightHandEl = el.querySelector('#rightHand');
    this.textElement.setAttribute('visible', false);
    this.counter0.setAttribute('visible', false);
    this.counter1.setAttribute('visible', false);
    leftHandEl.removeAttribute('tracked-controls');
    leftHandEl.removeAttribute('vive-controls');
    leftHandEl.removeAttribute('oculus-touch-controls');
    leftHandEl.setAttribute('position', {x: 0, y: 0, z:0});
    leftHandEl.setAttribute('rotation', {x: 0, y: 0, z:0});

    rightHandEl.removeAttribute('tracked-controls');
    rightHandEl.removeAttribute('vive-controls');
    rightHandEl.removeAttribute('oculus-touch-controls');
    rightHandEl.setAttribute('position', {x: 0, y: 0, z:0});
    rightHandEl.setAttribute('rotation', {x: 0, y: 0, z:0});

    document.querySelector('#room [sound]').components.sound.stopSound();
    this.avatarMimoRigEl.setAttribute('visible', false);
  }
});
