/* global AFRAME */

/**
* Handles events coming from the hand-controls.
* Determines if the entity is grabbed or released.
* Updates its position to move along the controller.
*/
AFRAME.registerComponent('avatar-selector', {
  init: function () {
    // Bind event handlers
    this.onHit = this.onHit.bind(this);
    this.selectAvatar = this.selectAvatar.bind(this);
  },

  play: function () {
    var el = this.el;
    el.addEventListener('hit', this.onHit);
    el.addEventListener('gripclose', this.selectAvatar);
    //el.addEventListener('thumbdown', this.selectAvatar);
    //el.addEventListener('pointdown', this.selectAvatar);
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('hit', this.onHit);
    el.removeEventListener('gripclose', this.selectAvatar);
    //el.removeEventListener('thumbdown', this.selectAvatar);
    //el.removeEventListener('pointdown', this.selectAvatar);
  },

  selectAvatar: function (evt) {
    if (!this.hitEl) { return; }
    this.el.sceneEl.setAttribute('game-state', 'selectedAvatar', this.hitEl);
    this.pause();
  },

  onHit: function (evt) {
    if (!evt.detail.el) { return; }
    if (this.hitEl) { this.hitEl.setAttribute('scale', '1 1 1'); }
    this.hitEl = evt.detail.el;
    this.hitEl.setAttribute('scale', '2 2 2');
  }
});
