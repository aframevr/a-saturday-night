AFRAME.registerComponent('avatar-selection', {
  init: function () {
    var avatarSelectionEl = this.avatarSelectionEl = this.el.querySelector('#avatarSelection');
    var avatarHeadEl = document.getElementById('avatarHead');
    var rightHandEl = document.getElementById('rightHand');
    var leftHandEl = document.getElementById('leftHand');
    this.avatarEls = this.el.querySelectorAll('.head');
    avatarHeadEl.setAttribute('visible', false);
    avatarSelectionEl.setAttribute('visible', true);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onHover = this.onHover.bind(this);
    rightHandEl.setAttribute('visible', false);
    leftHandEl.setAttribute('visible', false);
    window.addEventListener('hit', this.onHover);
    window.addEventListener('keydown', this.onKeyDown);
    document.getElementById('backText').setAttribute('visible', true);
    for (var i = 1; i <= 4; i++) {
      document.getElementById('spot'+i).setAttribute('scale', '0 0 0');
    }
    document.querySelector('#room [sound]').setAttribute('sound', 'src', isChrome ? '#menuogg' : '#menump3');
    document.querySelector('#room [sound]').components.sound.playSound();
  },

  onKeyDown: function (event) {
    var code = event.keyCode;
    if (code >= 49 && code <= 52) {
      this.selectAvatar(this.avatarEls[code - 49].parentEl);
    }
  },

  selectAvatar: function (avatarEl) {
    var el = this.el;
    var selectedAvatarEl = this.selectedAvatarEl = avatarEl;
    var avatarHeadEl = el.querySelector('#avatarHead');
    var leftHandEl = el.querySelector('#leftHand');
    var rightHandEl = el.querySelector('#rightHand');
    var leftSelectionHandEl = el.querySelector('#leftSelectionHand');
    var rightSelectionHandEl = el.querySelector('#rightSelectionHand');
    this.el.setAttribute('game-state', 'selectedAvatar', this.selectedAvatarEl);

    avatarHeadEl.setAttribute('gltf-model',
                             selectedAvatarEl.querySelector('.head').getAttribute('gltf-model'));
    leftHandEl.setAttribute('gltf-model',
                             selectedAvatarEl.querySelector('.leftHand').getAttribute('gltf-model'));
    rightHandEl.setAttribute('gltf-model',
                             selectedAvatarEl.querySelector('.rightHand').getAttribute('gltf-model'));
    leftSelectionHandEl.setAttribute('visible', false);
    rightSelectionHandEl.setAttribute('visible', false);
  },

  pause: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('hit', this.onHover);
  },

  onHover: function (event) {
    this.highlightAvatar(event.detail.el === null ? null : event.target);
  },

  highlightAvatar: function (el) {
    if ((el && el.className !== 'head') || el === this.hoveredAvatarEl) return;
    if (el !== null) el.setAttribute('highlighter', {active: true});
    if (this.hoveredAvatarEl) { this.hoveredAvatarEl.setAttribute('highlighter', {active: false}); }
    this.hoveredAvatarEl = el;
  },

  remove: function () {
    this.avatarSelectionEl.setAttribute('visible', false);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('hit', this.onHover);
    document.getElementById('backText').setAttribute('visible', false);
    document.getElementById('room').querySelector('[sound]').components.sound.pauseSound();
  }
});
