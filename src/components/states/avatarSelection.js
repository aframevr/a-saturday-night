AFRAME.registerComponent('avatar-selection', {
  init: function () {
    var avatarSelectionEl = this.avatarSelectionEl = this.el.querySelector('#avatarSelection');
    this.avatarEls = this.el.querySelectorAll('.head');
    this.selectAvatar(0);
    avatarSelectionEl.setAttribute('visible', true);
    this.onKeyDown = this.onKeyDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
  },

  onKeyDown: function (event) {
    var avatarHeadEl = this.el.querySelector('#avatarHead');
    var leftHandEl = this.el.querySelector('#leftHand');
    var rightHandEl = this.el.querySelector('#rightHand');
    var leftSelectionHandEl = this.el.querySelector('#leftSelectionHand');
    var rightSelectionHandEl = this.el.querySelector('#rightSelectionHand');
    var selectedAvatarEl = this.selectedAvatarEl.parentEl;
    var code = event.keyCode;
    if (code !== 37 && code !== 39 && code !== 13) { return; }
    switch (code) {
      case 37: {
        this.selectPreviousAvatar();
        break;
      }
      case 39 : {
        this.selectNextAvatar();
        break;
      }
      case 13: {
        this.el.setAttribute('game-state', 'selectedAvatar', this.selectedAvatarEl);
        avatarHeadEl.setAttribute('obj-model', {
          obj: selectedAvatarEl.querySelector('.head').getAttribute('src'),
          mtl: selectedAvatarEl.querySelector('.head').getAttribute('mtl')
        });
        leftHandEl.setAttribute('obj-model', {
          obj: selectedAvatarEl.querySelector('.leftHand').getAttribute('src'),
          mtl: selectedAvatarEl.querySelector('.leftHand').getAttribute('mtl')
        });
        rightHandEl.setAttribute('obj-model', {
          obj: selectedAvatarEl.querySelector('.rightHand').getAttribute('src'),
          mtl: selectedAvatarEl.querySelector('.rightHand').getAttribute('mtl')
        });
        this.el.removeChild(leftSelectionHandEl);
        this.el.removeChild(rightSelectionHandEl);
        break;
      }
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
    window.removeEventListener('keydown', this.onKeyDown);
  }
});
