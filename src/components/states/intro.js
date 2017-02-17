AFRAME.registerComponent('intro', {
  init: function () {
    this.el.setAttribute('avatar-replayer', {
      src: 'assets/dance.json',
      spectatorMode: true
    });
  },

  remove: function () {
    this.el.removeAttribute('avatar-replayer');
  }
});
