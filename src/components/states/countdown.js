AFRAME.registerComponent('countdown', {
  init: function () {
    this.countdownTime = this.el.getAttribute('game-state').countdownTime;
    this.countdown = this.countdown.bind(this);
    this.interval = window.setInterval(this.countdown, 1000);
    this.floor = document.getElementById('floor');
    this.floor.setAttribute('discofloor', {pattern: '' + this.countdownTime});
    var textElements = this.textElements = document.querySelectorAll('#centeredText, #counter0Text, #counter1Text');

    for (var i = 0; i < textElements.length; i++) {
      var textElement = textElements[i];
      textElement.setAttribute('visible', true);
      textElement.setAttribute('text', {value: ''});
    }
    this.opacity = 1;

    this.el.querySelector('#leftHand').setAttribute('visible', true);
    this.el.querySelector('#rightHand').setAttribute('visible', true);
    
    var avatarHeadEl = document.getElementById('avatarHead');
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
    this.floor.setAttribute('discofloor', {pattern: '' + this.countdownTime});
    if (this.countdownTime === 0) { window.clearInterval(this.interval); }
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
