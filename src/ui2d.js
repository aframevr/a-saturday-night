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
  var gifui = document.getElementById('gif-ui');

  var urlParams = getUrlParams();
  if (!urlParams.url) {
    instructions.classList.remove('hide');
  }

  sceneEl.addEventListener('enter-vr', function () {
    instructions.classList.add('hide');
  });

  document.addEventListener('uploadcare-upload-completed', function (event) {
    console.log('completed');
    shareDiv.classList.remove('hide');
    progressDiv.classList.add('hide');
    var url = location.protocol + '//' + location.host + location.pathname + '?url=' + event.detail.url;
    shareUrl.value = url;
    document.getElementById('sharetwitter').href = 'https://twitter.com/intent/tweet?text=Check out my moves on A-Saturday-Night!&url=' + url + '&hashtags=aframe,webvr,mozillavr,saturdaynight';
    document.getElementById('sharefacebook').href = 'http://www.facebook.com/share.php?u=' + url;
  });

  document.addEventListener('uploadcare-upload-started', function (event) {
    console.log('started');

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
    gifui.classList.remove('hide');
    document.getElementById('collectText').setAttribute('visible', false);
    sceneEl.addEventListener('gifdone', function (evt) {
      document.getElementById('collectText').setAttribute('visible', true);
      gifui.classList.remove('black');
      gifui.querySelector('img').src = URL.createObjectURL(evt.detail);
      gifui.querySelector('h1').innerHTML = '<b>DONE!</b> HERE IT IS YOUR GIF';
      gifui.querySelector('#gifclose').classList.remove('hide');
    });

    if (sceneEl.hasAttribute('gifcapture')){
      sceneEl.components['gifcapture'].start();
    }
    else {
      sceneEl.setAttribute('gifcapture', 'width:400; fps:15; duration:6; delay:1; jsPath: vendor/; saveToFile: false');
    }
  });

  document.getElementById('gifclose').addEventListener('click', function (event) {
      gifui.classList.add('black');
      gifui.classList.add('hide');
      gifui.querySelector('img').src = "assets/loading.gif"
      gifui.querySelector('h1').innerHTML = 'Making GIF, please wait...';
      gifui.querySelector('#gifclose').classList.add('hide');
      gifui.querySelector('#gifclose').classList.add('hide');
  });

});
