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

  init: function() {
    this.capturer = new CCapture({
      format: 'gif',
      framerate: this.data.fps,
      workersPath: this.data.jsPath,
      verbose: false,
      name: 'mydance'
    });
    this.startCapture = this.startCapture.bind(this);
    window.setTimeout(this.startCapture, this.data.delay * 1000);
  },

  startCapture: function () {
    var el = this.el;
    var cameraRigEl = el.querySelector('#spectatorCameraRig');
    this.oldSize = this.el.sceneEl.renderer.getSize();
    if (el.is('vr-mode')) {
      this.el.addEventListener('exit-vr', this.startCapture);
      this.el.exitVR();
      return;
    }
    // save camera position and bring it closer
    var spectatorCameraRigPosition = this.spectatorCameraRigPosition = cameraRigEl.getAttribute('position');
    cameraRigEl.setAttribute('position', {
      x: spectatorCameraRigPosition.x,
      y: spectatorCameraRigPosition.y,
      z: spectatorCameraRigPosition.z - 1.0
    });
    el.sceneEl.renderer.setSize(
      this.data.width / window.devicePixelRatio, this.data.height / window.devicePixelRatio);
    this.effectRender = this.el.sceneEl.effect.render.bind(this.el.sceneEl.effect);
    el.sceneEl.effect.render = this.render.bind(this);
    el.emit('start');
    el.removeEventListener('exit-vr', this.startCapture);
    window.setTimeout(this.stopCapture.bind(this), this.data.duration * 1000);
    this.capturer.start();
  },

  stopCapture: function () {
    var el = this.el;
    var cameraRigEl = el.querySelector('#spectatorCameraRig');
    this.capturer.stop();
    if (this.data.saveToFile) {
      this.capturer.save();
      this.el.emit('done');
    }
    else {
      var self = this;
      this.capturer.save(function (blob) { self.el.emit('gifdone', blob); });
    }
    el.sceneEl.renderer.setSize(this.oldSize.width, this.oldSize.height);
    el.sceneEl.effect.render = this.effectRender;
    // restore camera
    cameraRigEl.setAttribute('position', this.spectatorCameraRigPosition);
  },

  render: function (scene, camera) {
    this.effectRender(scene, camera);
    this.capturer.capture(this.el.sceneEl.canvas);
  }

});