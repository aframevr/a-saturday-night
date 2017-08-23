var audioCapabilities = require('../../utils').capabilities.audio;

AFRAME.registerComponent('avatar-selection', {
  init: function () {
    var el = this.el;
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
      document.getElementById('spot' + i).setAttribute('scale', '0 0 0');
    }
    document.querySelector('#room [sound]').setAttribute('sound', {
      src: audioCapabilities.opus ? '#menuogg' : '#menump3',
      volume: 0.5,
      autoplay: true,
      positional: false
    });
    el.setAttribute('game-state', 'selectedAvatar', null);
    this.insertSelectionHands();
    el.querySelector('#floor').setAttribute('discofloor', {pattern: 'idle'});
  },

  insertSelectionHands: function () {
    var leftSelectionHandEl;
    var rightSelectionHandEl;
    var cameraRigEl = this.cameraRigEl = this.el.camera.el.parentEl;
    this.onTriggerDown = this.onTriggerDown.bind(this);
    this.onIntersection = this.onIntersection.bind(this);
    this.onIntersectionCleared = this.onIntersectionCleared.bind(this);
    leftSelectionHandEl = this.leftSelectionHandEl = document.createElement('a-entity');
    rightSelectionHandEl = this.rightSelectionHandEl = document.createElement('a-entity');
    var leftRayEl = this.leftRayEl = document.createElement('a-entity');
    var rightRayEl = this.rightRayEl = document.createElement('a-entity');
    leftSelectionHandEl.id = 'leftSelectionHand';
    rightSelectionHandEl.id = 'rightSelectionHand';
    leftSelectionHandEl.setAttribute('vive-controls', 'hand: left');
    rightSelectionHandEl.setAttribute('vive-controls', 'hand: right');
    leftSelectionHandEl.setAttribute('oculus-touch-controls', 'hand: left');
    rightSelectionHandEl.setAttribute('oculus-touch-controls', 'hand: right');

    leftRayEl.setAttribute('line', 'end: 0 0 -5');
    //leftRayEl.setAttribute('visible', false);
    rightRayEl.setAttribute('line', 'end: 0 0 -5');
    //rightRayEl.setAttribute('visible', false);
    // Raycaster setup
    rightSelectionHandEl.setAttribute('ui-raycaster', {
      far: 4,
      objects: '.head',
      rotation: 0
    });
    leftSelectionHandEl.setAttribute('ui-raycaster', {
      far: 4,
      objects: '.head',
      rotation: 0
    });
    leftSelectionHandEl.appendChild(leftRayEl);
    rightSelectionHandEl.appendChild(rightRayEl);
    cameraRigEl.appendChild(leftSelectionHandEl);
    cameraRigEl.appendChild(rightSelectionHandEl);
    leftSelectionHandEl.addEventListener('triggerdown', this.onTriggerDown);
    rightSelectionHandEl.addEventListener('triggerdown', this.onTriggerDown);
  },

  removeSelectionHands: function () {
    var cameraRigEl = this.cameraRigEl;
    cameraRigEl.removeChild(this.leftSelectionHandEl);
    cameraRigEl.removeChild(this.rightSelectionHandEl);
  },

  onTriggerDown: function () {
    if (!this.hoveredAvatarEl) { return; }
    this.selectAvatar(this.hoveredAvatarEl.parentEl);
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
    var leftHandEl = el.querySelector('#leftHand');
    var rightHandEl = el.querySelector('#rightHand');
    el.setAttribute('game-state', 'selectedAvatar', this.selectedAvatarEl);

    leftHandEl.setAttribute('position', {x: 0, y: 0, z: 0});
    leftHandEl.setAttribute('rotation', {x: 0, y: 0, z: 0});
    leftHandEl.setAttribute('gltf-model',
                             selectedAvatarEl.querySelector('.leftHand').getAttribute('gltf-model'));

    rightHandEl.setAttribute('position', {x: 0, y: 0, z: 0});
    rightHandEl.setAttribute('rotation', {x: 0, y: 0, z: 0});
    rightHandEl.setAttribute('gltf-model',
                             selectedAvatarEl.querySelector('.rightHand').getAttribute('gltf-model'));
    this.removeSelectionHands();
  },

  onIntersectionCleared: function (evt) {
    var rayEl = evt.target.querySelector('[line]');
    rayEl.setAttribute('line', {end: '0 0 -5'});
    this.highlightAvatar();
  },

  onIntersection: (function () {
    var position = new THREE.Vector3();
    return function (evt) {
      var avatarEl = evt.detail.els[0];
      var rayEl = evt.target.querySelector('[line]');
      position.copy(evt.detail.intersections[0].point);
      rayEl.object3D.worldToLocal(position);
      rayEl.setAttribute('line', {end: position});
      this.highlightAvatar(avatarEl);
    }
  })(),

  play: function () {
    var leftSelectionHandEl = this.leftSelectionHandEl;
    var rightSelectionHandEl = this.rightSelectionHandEl;
    rightSelectionHandEl.addEventListener('raycaster-intersection', this.onIntersection);
    rightSelectionHandEl.addEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
    leftSelectionHandEl.addEventListener('raycaster-intersection', this.onIntersection);
    leftSelectionHandEl.addEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
  },

  pause: function () {
    var leftSelectionHandEl = this.leftSelectionHandEl;
    var rightSelectionHandEl = this.rightSelectionHandEl;
    rightSelectionHandEl.removeEventListener('raycaster-intersection', this.onIntersection);
    rightSelectionHandEl.removeEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
    leftSelectionHandEl.removeEventListener('raycaster-intersection', this.onIntersection);
    leftSelectionHandEl.removeEventListener('raycaster-intersection-cleared', this.onIntersectionCleared);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('hit', this.onHover);
  },

  onHover: function (event) {
    this.highlightAvatar(event.detail.el === null ? null : event.target);
  },

  highlightAvatar: function (el) {
    if ((el && el.className !== 'head') || el === this.hoveredAvatarEl) { return; }
    if (el) { el.setAttribute('highlighter', {active: true}); }
    if (this.hoveredAvatarEl) { this.hoveredAvatarEl.setAttribute('highlighter', {active: false}); }
    this.hoveredAvatarEl = el;
  },

  remove: function () {
    this.avatarSelectionEl.setAttribute('visible', false);
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('hit', this.onHover);
    document.getElementById('backText').setAttribute('visible', false);
    var soundEl = document.querySelector('#room [sound]');
    soundEl.components.sound.pauseSound();
    soundEl.setAttribute('sound', 'volume', 1);
  }
});
