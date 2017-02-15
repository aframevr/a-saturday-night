AFRAME.registerComponent('dancing', {
  init: function () {
    var textElement = this.textElement = document.getElementById('centeredText');
    textElement.setAttribute('visible', true);
    textElement.setAttribute('text', {value: 'Dance!', opacity: 1});
    var object = { opacity: 1.0 };
    new AFRAME.TWEEN.Tween(object)
      .to({opacity: 0.0}, 1000)
      .delay(500)
      .onUpdate(function () {
        textElement.setAttribute('text', {opacity: object.opacity});
      })
      .start();

    this.dancingTime = this.el.getAttribute('game-state').dancingTime;
    this.countdown = this.countdown.bind(this);
    this.el.components['avatar-recorder'].startRecording();
    this.interval = window.setInterval(this.countdown, 1000);
  },

  countdown: function () {
    this.dancingTime--;
    this.el.setAttribute('game-state', 'dancingTime', this.dancingTime);
    if (this.dancingTime === 0) {
      window.clearInterval(this.interval);
      this.el.components['avatar-recorder'].stopRecording();
    }
    this.el.setAttribute('game-state', 'dancingTime', this.dancingTime);
  },

  remove: function () {
    this.textElement.setAttribute('visible', false);
  }
});
