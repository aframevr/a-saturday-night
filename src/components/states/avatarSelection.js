AFRAME.registerComponent('avatar-selection', {
  init: function () {
    var avatarSelectionEl = this.avatarSelectionEl = this.el.querySelector('#avatarSelection');
    this.avatarEls = this.el.querySelectorAll('.avatar');
    this.selectAvatar(0);
    avatarSelectionEl.setAttribute('visible', true);
    this.onKeyDown = this.onKeyDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
  },

  onKeyDown: function (event) {
    var code = event.keyCode;
    if (code !== 188 && code !== 190) { return; }
    if (code === 188) {
      this.selectPreviousAvatar();
    } else {
      this.selectNextAvatar();
    }
  },

  selectPreviousAvatar: function () {
    if (this.avatarIndex <= 0) { return; }
    this.selectAvatar(this.avatarIndex-1);
  },

  selectNextAvatar: function () {
    if (this.avatarIndex === this.avatarEls.length - 1) { return; }
    this.selectAvatar(this.avatarIndex+1);
  },

  pause: function () {
    window.removeEventListener('keydown', this.onKeyDown);
  },

  selectAvatar: function (index) {
    var avatarEls = this.avatarEls;
    var avatarEl
    if (index < 0 || index >= avatarEls.length) { return; }
    this.avatarIndex = index;
    avatarEl = this.avatarEls[index];
    avatarEl.setAttribute('scale', '1.5 1.5 1.5');
    if (this.currentAvatarEl) { this.currentAvatarEl.setAttribute('scale', '1 1 1'); }
    this.currentAvatarEl = avatarEl;
  },

  remove: function () {
    this.avatarSelectionEl.setAttribute('visible', false);
    window.removeEventListener('keydown', this.onKeyDown);
  }
});
