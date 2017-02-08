/* global AFRAME, THREE */

/**
 * Animation of the floor tiles
 */
AFRAME.registerComponent('discofloor', {
  schema: {
    bpm: {default: 240}
  },
  init: function () {
    this.tiles= [];
    this.myTick = null;
    this.tickTime = 1000 * 60 / 120;
    this.step = 0;
    this.el.addEventListener('model-loaded', this.initTiles.bind(this));
  },
  initTiles: function (evt) {
    for (var i = 0; i < evt.detail.model.children.length; i++) {
      this.tiles[i] = evt.detail.model.children[i];
    }
  },
  update: function (oldData) {
    this.tickTime = 1000 * 60 / this.data.bpm;
  },
  tick: function (time, delta){
    if (this.myTick === null) {
      this.myTick = time;
    }
    if (time - this.myTick > this.tickTime) {
      this.myTick = time;
      this.step++;
      this.animTick();
    }
  },
  animTick: function () {
    var numTiles = this.tiles.length;
    var center = 3.5;
    var step8 = this.step % 20;
    for (var i = 0; i < numTiles; i++) {
      var x = Math.floor(i % 8);
      var y = Math.floor(i / 8);
      var dx = x - center;
      var dy = y - center;
      var dist = dx * dx + dy * dy;
      this.tiles[i].visible = Math.abs(dist - step8) < 3;
    }
  }
});