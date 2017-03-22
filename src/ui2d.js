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

  uploadGIFListeners = { 
    'uploadcare-upload-completed' : function (event) {
      gifui.classList.remove('black');
      gifui.querySelector('img').src = event.detail.url;
      gifui.querySelector('h1').innerHTML = '<b>DONE!</b> HERE IT IS YOUR GIF';
      gifui.querySelector('#gifclose').classList.remove('hide');
      gifui.querySelector('#gifclose').classList.remove('hide');
      removeUploadGIFListeners();
    },
    'uploadcare-upload-started' : function (event) {
      console.log('gif upload started');
    },
    'uploadcare-upload-progress' : function (event) {
    }
  };
  
  uploadJSONListeners = {
    'uploadcare-upload-completed' : function (event) {
      shareDiv.classList.remove('hide');
      progressDiv.classList.add('hide');
      shareUrl.value = location.protocol + '//' + location.host + location.pathname + '?url=' + event.detail.url;
      removeUploadJSONListeners();
    },

    'uploadcare-upload-started' : function (event) {
      asaturdayUI.classList.remove('hide');
      shareDiv.classList.add('hide');
      progressDiv.classList.remove('hide');
    },

    'uploadcare-upload-progress' : function (event) {
      progressBar.style.width = Math.floor(event.detail.progress * 100) + '%';
    }
  };

  var clipboard = new Clipboard('.button.copy');
  clipboard.on('error', function (e) {
    console.error('Error copying to clipboard:', e.action, e.trigger);
  });

  document.getElementById('generategif').addEventListener('click', function (event) {
    gifui.classList.remove('hide');
    sceneEl.addEventListener('gifdone', function (evt) {
      addUploadGIFListeners();
      sceneEl.systems['uploadcare'].upload(evt.detail, 'image/gif');
    });
    sceneEl.setAttribute('gifcapture', 'width:300; height:220; fps:10; duration:2; delay:1; jsPath: vendor/; saveToFile: false');
  });

  document.getElementById('gifclose').addEventListener('click', function (event) {
      gifui.classList.add('black');
      gifui.classList.add('hide');
      gifui.querySelector('img').src = "assets/loading.gif"
      gifui.querySelector('h1').innerHTML = 'Making GIF, please wait...';
      gifui.querySelector('#share-buttons').classList.add('hide');
      gifui.querySelector('#gifclose').classList.add('hide');
      gifui.querySelector('#gifclose').classList.add('hide');
  });

});

function addUploadJSONListeners () {
  for (var i in uploadJSONListeners){
    document.addEventListener(i, uploadJSONListeners[i]);
  }
}
function removeUploadJSONListeners () {
  for (var i in uploadJSONListeners){
    document.removeEventListener(i, uploadJSONListeners[i]);
  }
}

function addUploadGIFListeners () {
  for (var i in uploadGIFListeners){
    document.addEventListener(i, uploadGIFListeners[i]);
  }
}
function removeUploadGIFListeners () {
  for (var i in uploadGIFListeners){
    document.removeEventListener(i, uploadGIFListeners[i]);
  }
}

module.exports = {
  addUploadJSONListeners: addUploadJSONListeners
}
