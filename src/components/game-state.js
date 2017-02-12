/* global AFRAME */

/**
* Handles game states
*/
AFRAME.registerComponent('game-state', {
  schema: {
    selectedAvatar: {type: 'selector'},
    countdownTime: {default: 5},
    dancingTime: {default: 10},
    state: {default: 'avatar-selection', oneOf: ['countdown', 'dancing', 'collect-url']}
  },

  update: function (oldData) {
    var data = this.data;
    var currentState = data.state;
    var el = this.el;
    if (oldData.state !== data.state) {
      this.setState(data.state);
      return;
    }
    switch (data.state) {
      case 'avatarSelection': {
        if (!data.selectedAvatar) { return; }
        el.setAttribute('game-state', 'state', 'countdown');
        break;
      }
      case 'countdown' : {
        if (data.countdownTime > 0) { return; }
        el.setAttribute('game-state', 'state', 'dancing');
        break;
      }
      case 'dancing': {
        if (data.dancingTime > 0) { return; }
        el.setAttribute('game-state', 'state', 'collectUrl');
        break;
      }
      case 'collectUrl': {
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
