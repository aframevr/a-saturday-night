AFRAME.registerComponent('avatar-selection', {
  init: function () {
    var avatarSelectionEl = this.avatarSelectionEl = this.el.querySelector('#avatarSelection');
    this.avatarEls = this.el.querySelectorAll('.avatar');
    avatarSelectionEl.setAttribute('visible', true);
  },

  selectAvatar: function (index) {
    var avatarEls = this.avatarEls;
    var avatarEl;
    if (index < 0 || index >= avatarEls.length) { return; }
    this.avatarIndex = index;
    avatarEl = this.avatarEls[index];
    avatarEl.setAttribute('scale', '1.5 1.5 1.5');
    if (this.selectedAvatarEl) { this.selectedAvatarEl.setAttribute('scale', '1 1 1'); }
    this.selectedAvatarEl = avatarEl;
  },

  remove: function () {
    this.avatarSelectionEl.setAttribute('visible', false);
  }
});
