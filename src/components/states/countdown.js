AFRAME.registerComponent('countdown', {
  init: function () {
    var leftHandEl = this.el.querySelector('#leftHand');
    var rightHandEl = this.el.querySelector('#rightHand');
    var avatarHeadEl = this.el.querySelector('#avatarHead');
    this.countdownTime = this.el.getAttribute('game-state').countdownTime;
    this.countdown = this.countdown.bind(this);
    this.interval = window.setInterval(this.countdown, 1000);
    this.floor = this.el.querySelector('#floor');
    this.floor.setAttribute('discofloor', {pattern: '' + this.countdownTime});
    var textElements = this.textElements = document.querySelectorAll('#centeredText, #counter0Text, #counter1Text');

    for (var i = 0; i < textElements.length; i++) {
      var textElement = textElements[i];
      textElement.setAttribute('visible', true);
      textElement.setAttribute('text', {value: ''});
    }
    this.opacity = 1;

    leftHandEl.setAttribute('vive-controls', {hand: 'left', model: false});
    leftHandEl.setAttribute('oculus-touch-controls', {hand: 'left', model: false});

    rightHandEl.setAttribute('vive-controls', {hand: 'right', model: false});
    rightHandEl.setAttribute('oculus-touch-controls', {hand: 'right', model: false});

    leftHandEl.setAttribute('visible', true);
    rightHandEl.setAttribute('visible', true);
    avatarHeadEl.setAttribute('visible', false);
  },

  countdown: function () {
    this.countdownTime--;
    this.opacity = 1;

    for (var i = 0; i < this.textElements.length; i++) {
      var textElement = this.textElements[i];
      textElement.setAttribute('visible', true);
      textElement.setAttribute('text', {value: this.countdownTime === 2 ? 'Ready' : 'Set'});
    }

    this.el.setAttribute('game-state', 'countdownTime', this.countdownTime);
    if (this.countdownTime === 0) {
      window.clearInterval(this.interval);
    }
    else {
      this.floor.setAttribute('discofloor', {pattern: '' + this.countdownTime});
    }
  },

  tick: function (time, delta) {
    this.opacity -= delta*0.001;
    for (var i = 0; i < this.textElements.length; i++) {
      this.textElements[i].setAttribute('text', {opacity: this.opacity});
    }
  },

  remove: function () {
    for (var i = 0; i < this.textElements.length; i++) {
      this.textElements[i].setAttribute('visible', false);
    }
  }
});
