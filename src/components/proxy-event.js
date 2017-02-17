AFRAME.registerComponent('proxy-event', {
  schema: {
    event: { default: '' },
    dst: { type: 'selector' },
    bubbles: { default: false }
  },

  init: function () {
    var dst = this.data.dst || this.el;
    this.el.sceneEl.addEventListener(this.data.event, function (event) {
      dst.emit(this.data.event, event, this.data.bubbles);
    }.bind(this));
  }
});
