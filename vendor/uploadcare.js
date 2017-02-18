window.UPLOADCARE_PUBLIC_KEY = '85ed3c25d99e387316bd';

function injectJS (url) {
  var link = document.createElement('script');
  link.src = url;
  link.charset = 'utf-8';
  link.setAttribute('data-aframe-inspector', 'style');
  document.head.appendChild(link);
}

/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Uploadcare component for A-Frame.
 */
AFRAME.registerComponent('uploadcare', {
  schema: {
    publicKey: {default: ''},
    debug: {default: false}
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  init: function () {
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
    var self = this;

    this.el.emit('uploadcare-upload-started');

    file.done(function (fileInfo) {
      if (self.data.debug) { console.info('Uploaded link:', fileInfo); }
      self.el.emit('uploadcare-upload-completed', {url: fileInfo.cdnUrl, fileInfo: fileInfo});
    }).fail(function (errorInfo, fileInfo) {
      if (self.data.debug) { console.error('Uploaded fail:', errorInfo, fileInfo); }
      self.el.emit('uploadcare-upload-error', {errorInfo: errorInfo, fileInfo: fileInfo});
    }).progress(function (uploadInfo) {
      if (self.data.debug) { console.info('Upload progress:', uploadInfo); }
      self.el.emit('uploadcare-upload-progress', {progress: uploadInfo.progress, uploadInfo: uploadInfo});
    });
  },

  download: function (fileId, binary) {
    var baseUrl = 'https://ucarecdn.com/';

    var loader = new THREE.XHRLoader();
    loader.crossOrigin = 'anonymous';
    if (binary === true) {
      loader.setResponseType('arraybuffer');
    }

    var el = this.el;
    loader.load(baseUrl + fileId, function (buffer) {
      if (binary === true) {
        el.emit('uploadcare-download-completed', {content: buffer, isBinary: true});
      } else {
        el.emit('uploadcare-download-completed', {content: JSON.parse(buffer), isBinary: false});
      }
    });
  }
});
