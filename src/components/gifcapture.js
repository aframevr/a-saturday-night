/* global AFRAME, THREE */

AFRAME.registerComponent('gifcapture', {

  schema: {
    width: {default: 200},
    fps: {default: 15},
    duration: {default: 3 },
    delay: {default: 0},
    jsPath: {default: './'},
    saveToFile: {default: true}
  },

  init: function () {
    this.start();
  },
  start: function () {
    var el = this.el;
    this.capturer = new CCapture({
      format: 'gif',
      framerate: this.data.fps,
      workersPath: this.data.jsPath,
      verbose: false,
      name: 'mydance'
    });
    this.startCapture = this.startCapture.bind(this);

    if (el.is('vr-mode')) {
      el.addEventListener('exit-vr', this.prepareCapture.bind(this));
      el.exitVR();
    }
    else {
      this.prepareCapture();
    }
  },

  prepareCapture: function () {
    this.el.removeEventListener('exit-vr', this.prepareCapture);
    window.setTimeout(this.startCapture, this.data.delay * 1000);
  },

  startCapture: function () {
    var el = this.el;
    var cameraRigEl = el.querySelector('#spectatorCameraRig');
    this.oldSize = this.el.sceneEl.renderer.getSize();
    this.oldRatio = this.oldSize.height / this.oldSize.width;
    if (el.is('vr-mode')) {
      this.el.addEventListener('exit-vr', this.startCapture);
      this.el.exitVR();
      return;
    }
    // save camera position
    this.spectatorCameraRigPosition = cameraRigEl.getAttribute('position');
    //get camera closer
    cameraRigEl.setAttribute('position', '0 1.4 0.8');
    el.sceneEl.renderer.setSize(
      this.data.width / window.devicePixelRatio, Math.floor(this.data.width * this.oldRatio / window.devicePixelRatio  ));
    this.effectRender = this.el.sceneEl.effect.render.bind(this.el.sceneEl.effect);
    el.sceneEl.effect.render = this.render.bind(this);
    el.emit('start');
    el.removeEventListener('exit-vr', this.startCapture);
    this.frame = 1;
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
    // restore camera position
    cameraRigEl.setAttribute('position', this.spectatorCameraRigPosition);
  },

  render: function (scene, camera) {
    this.effectRender(scene, camera);
    this.capturer.capture(this.el.sceneEl.canvas);
    this.frame++;
    if (this.frame > this.data.duration * this.data.fps){
      this.stopCapture()
    }
  }

});