AFRAME.registerComponent('dancing', {
  init: function () {
    var el = this.el;
    var textElement = this.textElement = document.getElementById('centeredText');
    var counter0 = this.counter0 = document.getElementById('counter0');
    var counter1 = this.counter1 = document.getElementById('counter1');
    var soundEl = document.querySelector('#room [sound]');
    var leftHandEl = el.querySelector('#leftHand');
    var rightHandEl = el.querySelector('#rightHand');
    var avatarHeadEl = document.getElementById('avatarHead');

    var avatarId = this.el.getAttribute('game-state').selectedAvatar.id;
    var soundAsset = '#' + avatarId + (isChrome ? 'ogg' : 'mp3');
    el.setAttribute('game-state', 'dancingTime', document.querySelector(soundAsset).getAttribute('duration'));
    soundEl.setAttribute('sound', 'src', soundAsset);

    el.querySelector('#floor').setAttribute('discofloor', {pattern: avatarId});

    this.dancingTime = this.el.getAttribute('game-state').dancingTime;

    // reset avatar positions
    leftHandEl.setAttribute('position', '0 0 0');
    leftHandEl.setAttribute('rotation', '0 0 0');
    rightHandEl.setAttribute('position', '0 0 0');
    rightHandEl.setAttribute('rotation', '0 0 0');
    // avatarHeadEl.setAttribute('position', '0 0 0');
    // avatarHeadEl.setAttribute('rotation', '0 0 0');
    leftHandEl.setAttribute('tracked-controls', {controller: 0, id: 'OpenVR Gamepad'});
    rightHandEl.setAttribute('tracked-controls', {controller: 1, id: 'OpenVR Gamepad'});

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

    el.components['avatar-recorder'].startRecording();
    this.interval = window.setInterval(this.countdown, 1000);
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
    this.textElement.setAttribute('visible', false);
    this.counter0.setAttribute('visible', false);
    this.counter1.setAttribute('visible', false);
    el.querySelector('#leftHand').removeAttribute('tracked-controls');
    el.querySelector('#rightHand').removeAttribute('tracked-controls');
    document.querySelector('#room [sound]').components.sound.stopSound();
  }
});
