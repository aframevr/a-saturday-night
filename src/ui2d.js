var getUrlParams = require('./utils').getUrlParams;

/* global Clipboard */
window.addEventListener('load', function (event) {
  var instructions = document.getElementById('instructions');
  var asaturdayUI = document.getElementById('asaturday-ui');
  var shareDiv = document.querySelector('#asaturday-ui .share');
  var shareUrl = document.getElementById('asaturday-share-url');
  var progressDiv = document.querySelector('#asaturday-ui .progress');
  var progressBar = document.querySelector('#asaturday-ui .bar');
  var sceneEl = document.querySelector('a-scene');

  var urlParams = getUrlParams();
  if (!urlParams.url) {
    instructions.classList.remove('hide');
  }

  sceneEl.addEventListener('enter-vr', function () {
    instructions.classList.add('hide');
  });

  document.addEventListener('uploadcare-upload-completed', function (event) {
    shareDiv.classList.remove('hide');
    progressDiv.classList.add('hide');
    shareUrl.value = event.detail.url;
  });

  document.addEventListener('uploadcare-upload-started', function (event) {
    asaturdayUI.classList.remove('hide');
    shareDiv.classList.add('hide');
    progressDiv.classList.remove('hide');
  });

  document.addEventListener('uploadcare-upload-progress', function (event) {
    progressBar.style.width = Math.floor(event.detail.progress * 100) + '%';
  });

  var clipboard = new Clipboard('.button.copy');
  clipboard.on('error', function (e) {
    console.error('Error copying to clipboard:', e.action, e.trigger);
  });
});
