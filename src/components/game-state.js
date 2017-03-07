/* global AFRAME */

/**
* Handles game states
*/
AFRAME.registerComponent('game-state', {
  schema: {
    selectedAvatar: {type: 'selector'},
    countdownTime: {default: 3},
    dancingTime: {default: 15},
    state: {default: 'instructions', oneOf: ['instructions', 'avatar-selection', 'countdown', 'dancing', 'collect-url']}
  },

  init: function () {
    this.updateState = this.updateState.bind(this);
  },

  play: function () {
    this.el.addEventListener('enter-vr', this.updateState);
  },

  pause: function () {
    this.el.removeEventListener('enter-vr', this.updateState);
  },

  update: function (oldData) {
    var data = this.data;
    var el = this.el;
    if (oldData.state !== data.state) {
      this.setState(data.state);
      return;
    }
    this.updateState();
  },

  updateState: function () {
    var el = this.el;
    var data = this.data;
    switch (data.state) {
      case 'avatar-selection': {
        if (!data.selectedAvatar) { return; }
        el.setAttribute('game-state', 'state', 'countdown');
        break;
      }
      case 'countdown' : {
        console.log(data.countdownTime);
        if (data.countdownTime > 0) { return; }
        el.setAttribute('game-state', 'state', 'dancing');
        el.emit('dancing');
        break;
      }
      case 'dancing': {
        if (data.dancingTime > 0) { return; }
        el.setAttribute('game-state', 'state', 'collect-url');
        break;
      }
      case 'collect-url': {
        break;
      }
      default: {
        console.log('Unknown state ' + data.state);
      }
    }
  },

  setState: function(state) {
    var el = this.el;
    var states = this.schema.state.oneOf;
    if (this.updatingState) { return; }
    if (states.indexOf(state) === -1) {
      console.log('Unknown state: ' + state);
    }
    // Remove all states
    states.forEach(function (state) {
      el.removeAttribute(state);
    });
    el.setAttribute(state, '');
  }
});
