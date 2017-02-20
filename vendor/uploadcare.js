function injectJS (url) {
  var link = document.createElement('script');
  link.src = url;
  link.charset = 'utf-8';
  link.setAttribute('data-aframe-injected', 'uploadcare-component');
  document.head.appendChild(link);
}

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Uploadcare component for A-Frame.
 */
AFRAME.registerSystem('uploadcare', {
  schema: {
    publicKey: {default: ''},
    debug: {default: false}
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  init: function () {
    window.UPLOADCARE_PUBLIC_KEY = this.data.publicKey;
    injectJS('https://ucarecdn.com/widget/2.10.0/uploadcare/uploadcare.full.min.js');
  },

  upload: function (value, contentType) {
    switch (contentType) {
      case 'application/json':
        value = [JSON.stringify(value)];
        break;
      default:
        contentType = 'application/octet-library';
    }

    var blob = (value instanceof Blob) ? value : new Blob(value, {type: contentType});
    var file = uploadcare.fileFrom('object', blob);
    var sceneEl = this.sceneEl;
    var self = this;

    sceneEl.emit('uploadcare-upload-started');

    file.done(function (fileInfo) {
      if (self.data.debug) { console.info('Uploaded link:', fileInfo); }
      sceneEl.emit('uploadcare-upload-completed', {url: fileInfo.cdnUrl, fileInfo: fileInfo});
    }).fail(function (errorInfo, fileInfo) {
      if (self.data.debug) { console.error('Uploaded fail:', errorInfo, fileInfo); }
      sceneEl.emit('uploadcare-upload-error', {errorInfo: errorInfo, fileInfo: fileInfo});
    }).progress(function (uploadInfo) {
      if (self.data.debug) { console.info('Upload progress:', uploadInfo); }
      sceneEl.emit('uploadcare-upload-progress', {progress: uploadInfo.progress, uploadInfo: uploadInfo});
    });
  },

  download: function (fileId, callback, binary) {
    var baseUrl = 'https://ucarecdn.com/';

    var loader = new THREE.XHRLoader();
    loader.crossOrigin = 'anonymous';
    if (binary === true) {
      loader.setResponseType('arraybuffer');
    }

    var sceneEl = this.sceneEl;
    var url = fileId.indexOf('http') !== -1 ? fileId : baseUrl + fileId;

    loader.load(url, function (buffer) {
      var data = binary === true ? {content: buffer, isBinary: true} : {content: JSON.parse(buffer), isBinary: false};
      if (callback) { callback(data); }
      sceneEl.emit('uploadcare-download-completed', data);
    });
  }
});
