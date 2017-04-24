function getUrlParams () {
  var match;
  var pl = /\+/g;  // Regex for replacing addition symbol with a space
  var search = /([^&=]+)=?([^&]*)/g;
  var decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); };
  var query = window.location.search.substring(1);
  var urlParams = {};

  match = search.exec(query);
  while (match) {
    urlParams[decode(match[1])] = decode(match[2]);
    match = search.exec(query);
  }
  return urlParams;
}

var canPlayType = function (el, mimeType) {
  if (!el || !el.canPlayType || !mimeType) {
    return false;
  }

  var supported = el.canPlayType(mimeType);

  return supported === 'maybe' || supported === 'probably';
};

// Adapted from `Modernizr` source: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/audio.js
var getAudioCapabilities = (function (el) {
  return function () {
    var support = {};

    try {
      if (!el.canPlayType) {
        return Boolean(false);
      }

      support = Boolean(true);

      support.ogg = canPlayType(el, 'audio/ogg; codecs="vorbis"');
      support.mp3 = canPlayType(el, 'audio/mpeg; codecs="mp3"');
      support.opus = canPlayType(el, 'audio/ogg; codecs="opus"') ||
                     canPlayType(el, 'audio/webm; codecs="opus"');

      // Supported mime-types:
      // - https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats
      // - https://bit.ly/iphoneoscodecs
      support.wav = canPlayType(el, 'audio/wav; codecs="1"');
      support.m4a = canPlayType(el, 'audio/x-m4a;') ||
                    canPlayType(el, 'audio/aac;');
    } catch (e) {
    }

    return support;
  };
})(document.createElement('audio'));

// TODO: If need, adapt full functionality from `Modernizr` source: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/video.js
var getVideoCapabilities = (function (el) {
  return function () {
    return Boolean(!!el.canPlayType);
  };
})(document.createElement('video'));

module.exports = {
  getUrlParams: getUrlParams,
  capabilities: {
    audio: getAudioCapabilities,
    video: getVideoCapabilities
  }
};
