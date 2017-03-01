AFRAME.registerComponent('collect-url', {
  init: function () {
    document.getElementById('floor').setAttribute('discofloor', {pattern: 'idle'});
    var textElement = this.textElement = document.getElementById('centeredText');
    var selectedAvatarEl = this.el.getAttribute('game-state').selectedAvatar;
    var soundEl = this.soundEl = selectedAvatarEl.querySelector('[sound]');

    textElement.setAttribute('visible', true);
    textElement.setAttribute('text', {value: 'Copy your dance URL', width: 3});
    var object = { opacity: 0.0 };
    new AFRAME.TWEEN.Tween(object)
      .to({opacity: 1.0}, 1000)
      .onUpdate(function () {
        textElement.setAttribute('text', {opacity: object.opacity});
      })
      .start();
    var json = {
      avatar: selectedAvatarEl.id,
      recording: this.el.components['avatar-recorder'].getJSONData()
    }
    this.el.systems['uploadcare'].upload(json, 'application/json');
    this.soundEl.components.sound.playSound();
  },

  remove: function () {
    this.textElement.setAttribute('visible', false);
    this.soundEl.components.sound.stopSound();
  }
});
