AFRAME.registerComponent('countdown', {
  init: function () {
    var countdownEl = this.countdownEl = document.createElement('div');
    this.countdownTime = this.el.getAttribute('game-state').countdownTime;
    this.countdown = this.countdown.bind(this);
    countdownEl.style.position = 'absolute';
    countdownEl.style.top = '50%';
    countdownEl.style.left = '50%';
    countdownEl.style.fontSize = '120px';
    countdownEl.style.fontWeight = 'bold';
    countdownEl.style.color = 'white';
    countdownEl.innerHTML = this.countdownTime;
    this.interval = window.setInterval(this.countdown, 1000);
    document.body.appendChild(countdownEl);
  },

  remove: function () {
    document.body.removeChild(this.countdownEl);
  },

  countdown: function () {
    this.countdownTime--;
    this.countdownEl.innerHTML = this.countdownTime;
    this.el.setAttribute('game-state', 'countdownTime', this.countdownTime);
    if (this.countdownTime === 0) { window.clearInterval(this.interval); }
  }
});
