AFRAME.registerComponent('dancing', {
  init: function () {
    var countdownEl = this.countdownEl = document.createElement('div');
    this.dancingTime = this.el.getAttribute('game-state').dancingTime;
    this.countdown = this.countdown.bind(this);
    countdownEl.style.textAlign = 'center';
    countdownEl.style.position = 'absolute';
    countdownEl.style.width = '400px';
    countdownEl.style.top = '50%';
    countdownEl.style.left = 'calc(50% - 200px)';
    countdownEl.style.fontSize = '120px';
    countdownEl.style.fontWeight = 'bold';
    countdownEl.style.color = 'white';
    countdownEl.innerHTML = 'Dance!</br>' + this.dancingTime;
    this.el.components['avatar-recorder'].startRecording();
    this.interval = window.setInterval(this.countdown, 1000);
    document.body.appendChild(countdownEl);
  },

  countdown: function () {
    this.dancingTime--;
    this.countdownEl.innerHTML = 'Dance!</br>' + this.dancingTime;
    this.el.setAttribute('game-state', 'dancingTime', this.dancingTime);
    if (this.dancingTime === 0) {
      window.clearInterval(this.interval);
      this.el.components['avatar-recorder'].stopRecording();
    }
  },

  remove: function () {
    document.body.removeChild(this.countdownEl);
  }
});
