/* global AFRAME,THREE */

AFRAME.registerComponent('highlighter', {
  schema: {
    color: {
      default: '#fff'
    },
    active: {
      default: false
    }
  },
  init: function () {
    var self = this;
    this.material = null;
    this.el.addEventListener('model-loaded', function () {
      var mat = self.el.getObject3D('mesh').children[0].children[0].children[0].material;
      mat.emissiveMap = mat.map;
      self.material = mat;
      self.update();
    });
  }, 
  update: function (oldData) {
    if (!this.material) return;
    if (oldData && this.data.color === oldData.color && this.active === oldData.active) return;
    this.material.emissive.set(this.data.active ? this.data.color : 0x000000);
  }
});