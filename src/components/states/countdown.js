AFRAME.registerComponent('countdown', {
  init: function () {
    this.countdownTime = this.el.getAttribute('game-state').countdownTime;
    this.countdown = this.countdown.bind(this);
    this.interval = window.setInterval(this.countdown, 1000);
    var textElement = this.textElement = document.getElementById('centeredText');
    textElement.setAttribute('visible', true);
    textElement.setAttribute('text', {value: this.countdownTime.toString()});

    this.opacity = 1;
  },

  countdown: function () {
    this.countdownTime--;
    this.opacity = 1;
    this.textElement.setAttribute('text', {value: this.countdownTime.toString()});
    this.el.setAttribute('game-state', 'countdownTime', this.countdownTime);
    if (this.countdownTime === 0) { window.clearInterval(this.interval); }
  },

  tick: function (time, delta) {
    this.opacity -= delta*0.001;
    this.textElement.setAttribute('text', {opacity: this.opacity});
  },

  remove: function () {
    this.textElement.setAttribute('visible', false);
  }
});
