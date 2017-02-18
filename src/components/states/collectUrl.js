AFRAME.registerComponent('collect-url', {
  init: function () {
    document.getElementById('floor').setAttribute('discofloor', {pattern: 'idle'});
    var textElement = this.textElement = document.getElementById('centeredText');
    textElement.setAttribute('visible', true);
    textElement.setAttribute('text', {value: 'Copy your dance URL', width: 3});
    var object = { opacity: 0.0 };
    new AFRAME.TWEEN.Tween(object)
      .to({opacity: 1.0}, 1000)
      .onUpdate(function () {
        textElement.setAttribute('text', {opacity: object.opacity});
      })
      .start();
      debugger;
    var json = {
      avatar: this.el.getAttribute('game-state').selectedAvatar.id,
      recording: this.el.components['avatar-recorder'].getJSONData()
    }
    this.el.components['uploadcare'].upload(json, 'application/json');
  },

  remove: function () {
    this.textElement.setAttribute('visible', false);
  }
});
