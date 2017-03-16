var getUrlParams = require('./utils').getUrlParams;

/* global Clipboard */
window.addEventListener('load', function (event) {
  var instructions = document.querySelector('.instructions');
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
    shareUrl.value = location.protocol + '//' + location.host + location.pathname + '?url=' + event.detail.url;
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

  document.getElementById('generategif').addEventListener('click', function (event) {
    var gifui = document.getElementById('gif-ui');
    gifui.classList.remove('hide');
    
    if (!sceneEl.components['gifcapture']) {
      sceneEl.setAttribute('gifcapture', 'width:300; height:220; fps:10; duration:2; delay:1; jsPath: vendor/; saveToFile: false');

      sceneEl.addEventListener('gifdone', function (evt) {
        gifui.querySelector('img').src = URL.createObjectURL(evt.detail);
        gifui.classList.remove('black');
        gifui.querySelector('h1').innerHTML = '<b>DONE!</b> HERE IT IS YOUR GIF';
        gifui.querySelector('#share-buttons').classList.remove('hide');
        gifui.querySelector('#gifclose').classList.remove('hide');
        gifui.querySelector('#gifclose').classList.remove('hide');
      });

    }
    else {
      sceneEl.components.gifcapture.start();
    }

    
  });

  document.getElementById('gifclose').addEventListener('click', function (event) {
      var gifui = document.getElementById('gif-ui');
      gifui.classList.add('black');
      gifui.classList.add('hide');
      gifui.querySelector('img').src = "assets/loading.gif"
      gifui.querySelector('h1').innerHTML = 'Generating GIF, please wait...';
      gifui.querySelector('#share-buttons').classList.add('hide');
      gifui.querySelector('#gifclose').classList.add('hide');
      gifui.querySelector('#gifclose').classList.add('hide');
  });

});
