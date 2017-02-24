AFRAME.registerComponent('avatar-selection', {
  init: function () {
    var avatarSelectionEl = this.avatarSelectionEl = this.el.querySelector('#avatarSelection');
    this.avatarEls = this.el.querySelectorAll('.head');
    avatarSelectionEl.setAttribute('visible', true);
    this.onKeyDown = this.onKeyDown.bind(this);
    window.addEventListener('hit', this.onSelection.bind(this));
    window.addEventListener('buttondown', this.commitSelection.bind(this));
  },

  onKeyDown: function (event) {
    var code = event.keyCode;
    if (code >= 49 && code <= 52) {
      this.selectedAvatarEl = this.avatarEls[code - 49];
      this.commitSelection();
    }
  },

  commitSelection: function (event) {
    if (!this.selectedAvatarEl || (event && event.target.id!=='rightSelectionHand')) return;
    var avatarHeadEl = this.el.querySelector('#avatarHead');
    var leftHandEl = this.el.querySelector('#leftHand');
    var rightHandEl = this.el.querySelector('#rightHand');
    var leftSelectionHandEl = this.el.querySelector('#leftSelectionHand');
    var rightSelectionHandEl = this.el.querySelector('#rightSelectionHand');
    var selectedAvatarEl = this.selectedAvatarEl.parentEl;

    this.el.setAttribute('game-state', 'selectedAvatar', this.selectedAvatarEl);
    avatarHeadEl.setAttribute('gltf-model', selectedAvatarEl.querySelector('.head').getAttribute('gltf-model'));
    leftHandEl.setAttribute('gltf-model', selectedAvatarEl.querySelector('.leftHand').getAttribute('gltf-model'));
    rightHandEl.setAttribute('gltf-model', selectedAvatarEl.querySelector('.rightHand').getAttribute('gltf-model'));
    this.el.removeChild(leftSelectionHandEl);
    this.el.removeChild(rightSelectionHandEl);
  },

  pause: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('hit', this.onSelection);
    window.removeEventListener('buttondown', this.commitSelection);
  },

  onSelection: function (event) {
    this.selectAvatar(event.detail.el === null ? null : event.target);
  },

  selectAvatar: function (el) {
    if ((el && el.className !== 'head') || el === this.selectedAvatarEl) return;
    if (el !== null) el.setAttribute('highlighter', {active: true});
    if (this.selectedAvatarEl) { this.selectedAvatarEl.setAttribute('highlighter', {active: false}); }
    this.selectedAvatarEl = el;
  },

  remove: function () {
    this.avatarSelectionEl.setAttribute('visible', false);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('hit', this.onSelection);
    window.removeEventListener('buttondown', this.commitSelection);
  }
});
