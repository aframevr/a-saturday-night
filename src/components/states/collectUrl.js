AFRAME.registerComponent('collect-url', {
  init: function () {
    var urlEl = this.urlEl = document.createElement('div');
    urlEl.style.position = 'absolute';
    urlEl.style.width = '800px';
    urlEl.style.top = '50%';
    urlEl.style.left = 'calc(50% - 400px)';
    urlEl.style.fontSize = '80px';
    urlEl.style.fontWeight = 'bold';
    urlEl.style.color = 'white';
    urlEl.innerHTML = 'Copy your dance URL';
    document.body.appendChild(urlEl);
  },

  remove: function () {
    document.body.removeChild(this.urlEl);
  }
});
