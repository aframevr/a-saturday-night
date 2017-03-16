/* global AFRAME, THREE */

AFRAME.registerComponent('gifcapture', {
  
  schema: {
    width: {default: 200},
    height:{default: 200},
    fps: {default: 15},
    duration: {default: 3 },
    delay: {default: 0},
    jsPath: {default: './'},
    saveToFile: {default: true}
  },
  
  init: function () {
    this.start();
  },
  
  start: function() {
    this.capturer = new CCapture({ 
      format: 'gif', 
      framerate: this.data.fps, 
      workersPath: this.data.jsPath,
      verbose: false,
      name: 'mydance'
    });

    window.setTimeout(this.startCapture.bind(this), this.data.delay * 1000);
    window.setTimeout(this.stopCapture.bind(this), (this.data.delay + this.data.duration) * 1000);
  },

  startCapture: function () {
    this.oldsize = this.el.sceneEl.renderer.getSize();
    this.el.sceneEl.renderer.setSize(this.data.width, this.data.height);
    this.effectRender = this.el.sceneEl.effect.render.bind(this.el.sceneEl.effect);
    this.el.sceneEl.effect.render = this.render.bind(this);
    this.el.emit('start');
    this.capturer.start();
  },
  
  stopCapture: function () {
    this.capturer.stop();
    if (this.data.saveToFile) {
      this.capturer.save();
      this.el.emit('done');
    }
    else {
      var self = this;
      this.capturer.save(function (blob) { self.el.emit('gifdone', blob); });
    }
    this.el.sceneEl.renderer.setSize(this.oldsize.width, this.oldsize.height);
    this.el.sceneEl.effect.render = this.effectRender;
  },
  
  render: function (scene, camera) {
    this.effectRender(scene, camera);
    this.capturer.capture(this.el.sceneEl.canvas);
  }

});