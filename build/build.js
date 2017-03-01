/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	
	// Components.
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	__webpack_require__(11);
	
	// States
	__webpack_require__(12);
	__webpack_require__(13);
	__webpack_require__(14);
	__webpack_require__(15);
	__webpack_require__(16);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var getUrlParams = __webpack_require__(2).getUrlParams;
	
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
	    shareUrl.value = window.location + '?url=' + event.detail.url;
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


/***/ },
/* 2 */
/***/ function(module, exports) {

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
	
	module.exports = {
	  getUrlParams: getUrlParams
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	AFRAME.registerComponent('proxy-event', {
	  schema: {
	    event: { default: '' },
	    dst: { type: 'selector' },
	    bubbles: { default: false }
	  },
	
	  init: function () {
	    var dst = this.data.dst || this.el;
	    this.el.sceneEl.addEventListener(this.data.event, function (event) {
	      dst.emit(this.data.event, event, this.data.bubbles);
	    }.bind(this));
	  }
	});


/***/ },
/* 4 */
/***/ function(module, exports) {

	/* global AFRAME, THREE */
	
	/**
	 * Implement AABB collision detection for entities with a mesh.
	 * (https://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box)
	 * It sets the specified state on the intersected entities.
	 *
	 * @property {string} objects - Selector of the entities to test for collision.
	 * @property {string} state - State to set on collided entities.
	 *
	 */
	AFRAME.registerComponent('aabb-collider', {
	  schema: {
	    objects: {default: ''},
	    state: {default: 'collided'}
	  },
	
	  init: function () {
	    this.els = [];
	    this.collisions = [];
	    this.elMax = new THREE.Vector3();
	    this.elMin = new THREE.Vector3();
	  },
	
	  /**
	   * Update list of entities to test for collision.
	   */
	  update: function () {
	    var data = this.data;
	    var objectEls;
	
	    // Push entities into list of els to intersect.
	    if (data.objects) {
	      objectEls = this.el.sceneEl.querySelectorAll(data.objects);
	    } else {
	      // If objects not defined, intersect with everything.
	      objectEls = this.el.sceneEl.children;
	    }
	    // Convert from NodeList to Array
	    this.els = Array.prototype.slice.call(objectEls);
	  },
	
	  tick: (function () {
	    var boundingBox = new THREE.Box3();
	    return function () {
	      var collisions = [];
	      var el = this.el;
	      var mesh = el.getObject3D('mesh');
	      var self = this;
	      // No mesh, no collisions
	      if (!mesh) { return; }
	      // Update the bounding box to account for rotations and
	      // position changes.
	      updateBoundingBox();
	      // Update collisions.
	      this.els.forEach(intersect);
	      // Emit events.
	      collisions.forEach(handleHit);
	      // No collisions.
	      if (collisions.length === 0) { self.el.emit('hit', {el: null}); }
	      // Updated the state of the elements that are not intersected anymore.
	      this.collisions.filter(function (el) {
	        return collisions.indexOf(el) === -1;
	      }).forEach(function removeState (el) {
	        el.removeState(self.data.state);
	      });
	      // Store new collisions
	      this.collisions = collisions;
	
	      // AABB collision detection
	      function intersect (el) {
	        var intersected;
	        var mesh = el.getObject3D('mesh');
	        var elMin;
	        var elMax;
	        if (!mesh) { return; }
	        boundingBox.setFromObject(mesh);
	        elMin = boundingBox.min;
	        elMax = boundingBox.max;
	        // Bounding boxes are always aligned with the world coordinate system.
	        // The collision test checks for the conditions where cubes intersect.
	        // It's an extension to 3 dimensions of this approach (with the condition negated)
	        // https://www.youtube.com/watch?v=ghqD3e37R7E
	        intersected = (self.elMin.x <= elMax.x && self.elMax.x >= elMin.x) &&
	                      (self.elMin.y <= elMax.y && self.elMax.y >= elMin.y) &&
	                      (self.elMin.z <= elMax.z && self.elMax.z >= elMin.z);
	        if (!intersected) { return; }
	        collisions.push(el);
	      }
	
	      function handleHit (hitEl) {
	        hitEl.emit('hit');
	        hitEl.addState(self.data.state);
	        self.el.emit('hit', {el: hitEl});
	      }
	
	      function updateBoundingBox () {
	        boundingBox.setFromObject(mesh);
	        self.elMin.copy(boundingBox.min);
	        self.elMax.copy(boundingBox.max);
	      }
	    };
	  })()
	});


/***/ },
/* 5 */
/***/ function(module, exports) {

	/* global AFRAME */
	
	/**
	* Handles game states
	*/
	AFRAME.registerComponent('game-state', {
	  schema: {
	    selectedAvatar: {type: 'selector'},
	    countdownTime: {default: 3},
	    dancingTime: {default: 10},
	    state: {default: 'intro', oneOf: ['intro', 'avatar-selection', 'countdown', 'dancing', 'collect-url']}
	  },
	
	  init: function () {
	    this.updateState = this.updateState.bind(this);
	  },
	
	  play: function () {
	    this.el.addEventListener('enter-vr', this.updateState);
	  },
	
	  pause: function () {
	    this.el.removeEventListener('enter-vr', this.updateState);
	  },
	
	  update: function (oldData) {
	    var data = this.data;
	    var el = this.el;
	    if (oldData.state !== data.state) {
	      this.setState(data.state);
	      return;
	    }
	    this.updateState();
	  },
	
	  updateState: function () {
	    var el = this.el;
	    var data = this.data;
	    switch (data.state) {
	      case 'intro': {
	        if (!this.el.is('vr-mode')) { return; }
	        el.setAttribute('game-state', 'state', 'avatar-selection');
	        break;
	      }
	      case 'avatar-selection': {
	        if (!data.selectedAvatar) { return; }
	        el.setAttribute('game-state', 'state', 'countdown');
	        break;
	      }
	      case 'countdown' : {
	        if (data.countdownTime > 0) { return; }
	        el.setAttribute('game-state', 'state', 'dancing');
	        el.emit('dancing');
	        break;
	      }
	      case 'dancing': {
	        if (data.dancingTime > 0) { return; }
	        el.setAttribute('game-state', 'state', 'collect-url');
	        break;
	      }
	      case 'collect-url': {
	        break;
	      }
	      default: {
	        console.log('Unknown state ' + data.state);
	      }
	    }
	  },
	
	  setState: function(state) {
	    var el = this.el;
	    var states = this.schema.state.oneOf;
	    if (this.updatingState) { return; }
	    if (states.indexOf(state) === -1) {
	      console.log('Unknown state: ' + state);
	    }
	    // Remove all states
	    states.forEach(function (state) {
	      el.removeAttribute(state);
	    });
	    el.setAttribute(state, '');
	  }
	});


/***/ },
/* 6 */
/***/ function(module, exports) {

	/* global AFRAME */
	
	/**
	* Handles events coming from the hand-controls.
	* Determines if the entity is grabbed or released.
	* Updates its position to move along the controller.
	*/
	AFRAME.registerComponent('avatar-selector', {
	  init: function () {
	    // Bind event handlers
	    this.onHit = this.onHit.bind(this);
	    this.selectAvatar = this.selectAvatar.bind(this);
	  },
	
	  play: function () {
	    var el = this.el;
	    el.addEventListener('hit', this.onHit);
	    el.addEventListener('gripclose', this.selectAvatar);
	    //el.addEventListener('thumbdown', this.selectAvatar);
	    //el.addEventListener('pointdown', this.selectAvatar);
	  },
	
	  pause: function () {
	    var el = this.el;
	    el.removeEventListener('hit', this.onHit);
	    el.removeEventListener('gripclose', this.selectAvatar);
	    //el.removeEventListener('thumbdown', this.selectAvatar);
	    //el.removeEventListener('pointdown', this.selectAvatar);
	  },
	
	  selectAvatar: function (evt) {
	    if (!this.hitEl) { return; }
	    this.el.sceneEl.setAttribute('game-state', 'selectedAvatar', this.hitEl);
	    this.pause();
	  },
	
	  onHit: function (evt) {
	    if (!evt.detail.el) { return; }
	    if (this.hitEl) { this.hitEl.setAttribute('scale', '1 1 1'); }
	    this.hitEl = evt.detail.el;
	    this.hitEl.setAttribute('scale', '2 2 2');
	  }
	});


/***/ },
/* 7 */
/***/ function(module, exports) {

	/* global AFRAME, THREE */
	
	/**
	 * Loads and setup ground model.
	 */
	AFRAME.registerComponent('ground', {
	  init: function () {
	    var objectLoader;
	    var object3D = this.el.object3D;
	    var MODEL_URL = 'https://cdn.aframe.io/link-traversal/models/ground.json';
	    if (this.objectLoader) { return; }
	    objectLoader = this.objectLoader = new THREE.ObjectLoader();
	    objectLoader.crossOrigin = '';
	    objectLoader.load(MODEL_URL, function (obj) {
	      obj.children.forEach(function (value) {
	        value.receiveShadow = true;
	        value.material.shading = THREE.FlatShading;
	      });
	      object3D.add(obj);
	    });
	  }
	});


/***/ },
/* 8 */
/***/ function(module, exports) {

	/* global AFRAME, THREE */
	
	/**
	 * Animation of the floor tiles
	 */
	AFRAME.registerComponent('discofloor', {
	  schema: {
	    pattern: {default: 'idle', oneOf: ['idle', '3', '2', '1', '0']}
	  },
	  init: function () {
	    this.tiles= [];
	    this.myTick = null;
	    this.step = 0;
	    this.bpms = {
	      'idle': 60,
	      '3': 40,
	      '2': 40,
	      '1': 40,
	      '0': 2400,
	    }
	    this.tickTime = 1000 * 60 / this.bpms[this.data.pattern];
	
	    this.pat3 = '0011111001111110011000000111100001111000011000000111111000111110';
	    this.pat2 = '0011111001111110011000000011000000001100000001100111111001111110';
	    this.pat1 = '0011000000111000001111000011011000110000001100000011000000110000';
	    //this.pat0 = '0011110001100110011001100110011001100110011001100110011000111100';
	
	    this.el.addEventListener('model-loaded', this.initTiles.bind(this));
	  },
	  initTiles: function (evt) {
	    var meshes = evt.detail.model.children[0].children;
	    for (var i = 0; i < meshes.length; i++) {
	      this.tiles[i] = meshes[i];
	    }
	    this.tiles.sort((a, b) => a.name > b.name ? 1 : -1);
	  },
	  update: function (oldData) {
	    this.tickTime = 1000 * 60 / this.bpms[this.data.pattern];
	    this.myTick = null;
	    this.step = 0;
	    this.animTick();
	  },
	  tick: function (time, delta){
	    if (this.myTick === null) {
	      this.myTick = time;
	    }
	    if (time - this.myTick > this.tickTime) {
	      this.myTick = time;
	      this.step++;
	      this.animTick();
	    }
	  },
	  animTick: function () {
	    var numTiles = this.tiles.length;
	    var center = 3.5;
	    var visible;
	    for (var i = 0; i < numTiles; i++) {
	      var x = Math.floor(i % 8);
	      var y = Math.floor(i / 8);
	      switch(this.data.pattern) {
	        case 'idle':
	            visible = (x + this.step) % 2 == 0;
	          break;
	        case '3':
	            visible = this.pat3[i] === '1';
	          break;
	        case '2':
	            visible = this.pat2[i] === '1';
	          break;
	        case '1':
	            visible = this.pat1[i] === '1';
	          break;
	        case '0':
	          var dx = x - center;
	          var dy = y - center;
	          var dist = dx * dx + dy * dy;
	          visible = Math.abs(dist - (this.step % 20)) < 3;
	          break;
	      }
	      this.tiles[i].visible = visible;
	    }
	  }
	});

/***/ },
/* 9 */
/***/ function(module, exports) {

	AFRAME.registerComponent('spotlight', {
	  schema: {
	    color: {default: '#FFFFFF'},
	    speed: {default: {x: 1500, y: 1400, z: 1300}}
	  },
	  init: function () {
	    this.star = null;
	    this.el.addEventListener('model-loaded', this.update.bind(this));
	  },
	  update: function (oldData) {
	    if (!this.el.getObject3D('mesh')) return;
	    this.speed = {
	      x: this.data.speed.x + Math.random() * 500,
	      y: this.data.speed.y + Math.random() * 500,
	      z: this.data.speed.z + Math.random() * 500
	    };
	    this.initialRotation = this.el.getAttribute('rotation');
	    var mesh = this.el.getObject3D('mesh').children[0].children[0];
	
	    if (!mesh.children.length) return;
	    var texture = new THREE.TextureLoader().load( document.getElementById('spotlight-img').getAttribute('src') );
	    var material = new THREE.MeshBasicMaterial({
	        shading: THREE.FlatShading,
	        color: this.data.color,
	        transparent: true,
	        alphaMap: texture,
	        side: THREE.DoubleSide,
	        blending: THREE.AdditiveBlending,
	        depthWrite: false,
	      });
	    for (var i = 0; i < mesh.children.length; i++) {
	      mesh.children[i].material = material;
	    }
	    
	    if (this.star === null) {
	      var starTexture = new THREE.TextureLoader().load( document.getElementById('star-img').getAttribute('src') );
	      var starMaterial = new THREE.SpriteMaterial({
	        shading: THREE.FlatShading,
	        transparent: true,
	        map: starTexture,
	        color: this.data.color,
	        blending: THREE.AdditiveBlending,
	        depthWrite: false
	      })
	      this.star = new THREE.Sprite(starMaterial);
	      this.el.setObject3D('star', this.star);
	    }
	    material.needsUpdate = true;
	  },
	  tick: function (time, delta) {
	    if (!this.el.getObject3D('mesh')) return;
	    this.el.setAttribute('rotation', {
	      x: this.initialRotation.x + Math.sin(time / this.speed.x) * 30, 
	      y: this.initialRotation.y, 
	      z: this.initialRotation.z + Math.sin(time / this.speed.y) * 30
	    });
	    if (this.star) {
	      this.star.material.rotation -= delta / 3000;
	    }
	  }
	});


/***/ },
/* 10 */
/***/ function(module, exports) {

	/* global AFRAME,THREE */
	
	AFRAME.registerComponent('highlighter', {
	  schema: {
	    color: {
	      default: '#fff'
	    },
	    active: {
	      default: false
	    }
	  },
	  init: function () {
	    var self = this;
	    this.material = null;
	    this.el.addEventListener('model-loaded', function () {
	      var mat = self.el.getObject3D('mesh').children[0].children[0].children[0].material;
	      mat.emissiveMap = mat.map;
	      self.material = mat;
	      self.update();
	    });
	  }, 
	  update: function (oldData) {
	    if (!this.material) return;
	    if (oldData && this.data.color === oldData.color && this.active === oldData.active) return;
	    this.material.emissive.set(this.data.active ? this.data.color : 0x000000);
	  }
	});

/***/ },
/* 11 */
/***/ function(module, exports) {

	/* global AFRAME, THREE */
	
	AFRAME.registerComponent('roomcolor', {
	  schema: {
	    default: '#FFF'
	  },
	  init : function () {
	    this.el.addEventListener('model-loaded', this.update.bind(this));
	  },
	  update : function (oldData) {
	    if (oldData == this.data) return;
	    var mesh = this.el.getObject3D('mesh');
	    if (!mesh) return;
	    mesh.children[0].children[0].children[0].material.color.set(this.data);
	  }
	})

/***/ },
/* 12 */
/***/ function(module, exports) {

	AFRAME.registerComponent('avatar-selection', {
	  init: function () {
	    var avatarSelectionEl = this.avatarSelectionEl = this.el.querySelector('#avatarSelection');
	    this.avatarEls = this.el.querySelectorAll('.head');
	    avatarSelectionEl.setAttribute('visible', true);
	    this.onKeyDown = this.onKeyDown.bind(this);
	    this.onHover = this.onHover.bind(this);
	    this.onButtonDown = this.onButtonDown.bind(this);
	    this.el.querySelector('#leftSelectionHand').setAttribute('visible', true);
	    this.el.querySelector('#rightSelectionHand').setAttribute('visible', true);
	    window.addEventListener('hit', this.onHover);
	    window.addEventListener('buttondown', this.onButtonDown);
	    window.addEventListener('keydown', this.onKeyDown);
	  },
	
	  onKeyDown: function (event) {
	    var code = event.keyCode;
	    if (code >= 49 && code <= 52) {
	      this.selectAvatar(this.avatarEls[code - 49].parentEl);
	    }
	  },
	
	  onButtonDown: function (event) {
	    if (!this.hoveredAvatarEl) return;
	    this.selectAvatar(this.hoveredAvatarEl.parentEl);
	  },
	
	  selectAvatar: function (avatarEl) {
	    var el = this.el;
	    var selectedAvatarEl = this.selectedAvatarEl = avatarEl;
	    var avatarHeadEl = el.querySelector('#avatarHead');
	    var leftHandEl = el.querySelector('#leftHand');
	    var rightHandEl = el.querySelector('#rightHand');
	    var leftSelectionHandEl = el.querySelector('#leftSelectionHand');
	    var rightSelectionHandEl = el.querySelector('#rightSelectionHand');
	    this.el.setAttribute('game-state', 'selectedAvatar', this.selectedAvatarEl);
	
	    avatarHeadEl.setAttribute('gltf-model',
	                             selectedAvatarEl.querySelector('.head').getAttribute('gltf-model'));
	    leftHandEl.setAttribute('gltf-model',
	                             selectedAvatarEl.querySelector('.leftHand').getAttribute('gltf-model'));
	    rightHandEl.setAttribute('gltf-model',
	                             selectedAvatarEl.querySelector('.rightHand').getAttribute('gltf-model'));
	    leftSelectionHandEl.setAttribute('visible', false);
	    rightSelectionHandEl.setAttribute('visible', false);
	  },
	
	  pause: function () {
	    window.removeEventListener('keydown', this.onKeyDown);
	    window.removeEventListener('hit', this.onHover);
	    window.removeEventListener('buttondown', this.selectAvatar);
	  },
	
	  onHover: function (event) {
	    this.highlightAvatar(event.detail.el === null ? null : event.target);
	  },
	
	  highlightAvatar: function (el) {
	    if ((el && el.className !== 'head') || el === this.hoveredAvatarEl) return;
	    if (el !== null) el.setAttribute('highlighter', {active: true});
	    if (this.hoveredAvatarEl) { this.hoveredAvatarEl.setAttribute('highlighter', {active: false}); }
	    this.hoveredAvatarEl = el;
	  },
	
	  remove: function () {
	    this.avatarSelectionEl.setAttribute('visible', false);
	    window.removeEventListener('keydown', this.onKeyDown);
	    window.removeEventListener('hit', this.onHover);
	    window.removeEventListener('buttondown', this.commitSelection);
	  }
	});


/***/ },
/* 13 */
/***/ function(module, exports) {

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


/***/ },
/* 14 */
/***/ function(module, exports) {

	AFRAME.registerComponent('countdown', {
	  init: function () {
	    this.countdownTime = this.el.getAttribute('game-state').countdownTime;
	    this.countdown = this.countdown.bind(this);
	    this.interval = window.setInterval(this.countdown, 1000);
	    this.floor = document.getElementById('floor');
	    this.floor.setAttribute('discofloor', {pattern: '' + this.countdownTime});
	    var textElement = this.textElement = document.getElementById('centeredText');
	    textElement.setAttribute('visible', true);
	    textElement.setAttribute('text', {value: this.countdownTime.toString()});
	    this.opacity = 1;
	  },
	
	  countdown: function () {
	    this.countdownTime--;
	    this.opacity = 1;
	    this.textElement.setAttribute('text', {value: this.countdownTime.toString()});
	    this.el.setAttribute('game-state', 'countdownTime', this.countdownTime);
	    this.floor.setAttribute('discofloor', {pattern: '' + this.countdownTime});
	    if (this.countdownTime === 0) { window.clearInterval(this.interval); }
	  },
	
	  tick: function (time, delta) {
	    this.opacity -= delta*0.001;
	    this.textElement.setAttribute('text', {opacity: this.opacity});
	  },
	
	  remove: function () {
	    this.textElement.setAttribute('visible', false);
	  }
	});


/***/ },
/* 15 */
/***/ function(module, exports) {

	AFRAME.registerComponent('dancing', {
	  init: function () {
	    var textElement = this.textElement = document.getElementById('centeredText');
	    var counter0 = this.counter0 = document.getElementById('counter0');
	    var counter1 = this.counter1 = document.getElementById('counter1');
	    var soundEl = this.soundEl = this.el.getAttribute('game-state').selectedAvatar.querySelector('[sound]');
	
	    this.dancingTime = this.el.getAttribute('game-state').dancingTime;
	
	    textElement.setAttribute('visible', true);
	    textElement.setAttribute('text', {value: 'Dance!', opacity: 1});
	    var object = { opacity: 1.0 };
	    new AFRAME.TWEEN.Tween(object)
	      .to({opacity: 0.0}, 500)
	      .delay(300)
	      .onUpdate(function () {
	        textElement.setAttribute('text', {opacity: object.opacity});
	      })
	      .onComplete(function () {
	        textElement.setAttribute('visible', false);
	      })
	      .start();
	
	    counter0.setAttribute('text', {value: this.dancingTime.toString()});
	    counter1.setAttribute('text', {value: this.dancingTime.toString()});
	    counter0.setAttribute('visible', true);
	    counter1.setAttribute('visible', true);
	
	    this.countdown = this.countdown.bind(this);
	    soundEl.components.sound.playSound();
	    this.el.components['avatar-recorder'].startRecording();
	    this.interval = window.setInterval(this.countdown, 1000);
	  },
	
	  countdown: function () {
	    var el = this.el;
	    this.dancingTime--;
	    this.counter0.setAttribute('text', {value: this.dancingTime.toString()});
	    this.counter1.setAttribute('text', {value: this.dancingTime.toString()});
	
	    if (this.dancingTime === 0) {
	      window.clearInterval(this.interval);
	      el.querySelector('#leftHand').removeAttribute('tracked-controls');
	      el.querySelector('#rightHand').removeAttribute('tracked-controls');
	      el.components['avatar-recorder'].stopRecording();
	    }
	    el.setAttribute('game-state', 'dancingTime', this.dancingTime);
	  },
	
	  remove: function () {
	    this.textElement.setAttribute('visible', false);
	    this.counter0.setAttribute('visible', false);
	    this.counter1.setAttribute('visible', false);
	    this.soundEl.components.sound.stopSound();
	  }
	});


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var getUrlParams = __webpack_require__(2).getUrlParams;
	var loadJSONFromUrl = __webpack_require__(2).loadJSONFromUrl;
	
	AFRAME.registerComponent('intro', {
	  init: function () {
	    var urlParams = getUrlParams();
	    if (urlParams.url) {
	      var self = this;
	      this.el.sceneEl.systems['uploadcare'].download(urlParams.url, function (data) {
	        var selectedAvatarEl = document.getElementById(data.content.avatar);
	        var selectedAvatarHeadEl = selectedAvatarEl.querySelector('.head');
	        var selectedAvatarRightHandEl = selectedAvatarEl.querySelector('.rightHand');
	        var selectedAvatarLeftHandEl = selectedAvatarEl.querySelector('.leftHand');
	        var avatarHeadEl = document.getElementById('avatarHead');
	        var rightHandEl = document.getElementById('rightHand');
	        var leftHandEl = document.getElementById('leftHand');
	        self.el.sceneEl.setAttribute('game-state', 'selectedAvatar', selectedAvatarEl);
	        avatarHeadEl.setAttribute('gltf-model', selectedAvatarHeadEl.getAttribute('gltf-model'));
	        rightHandEl.setAttribute('gltf-model', selectedAvatarRightHandEl.getAttribute('gltf-model'));
	        leftHandEl.setAttribute('gltf-model', selectedAvatarLeftHandEl.getAttribute('gltf-model'));
	
	        self.el.setAttribute('avatar-replayer', {
	          spectatorMode: true,
	          loop: true
	        });
	        window.setTimeout(function () {
	          self.el.components['avatar-replayer'].startReplaying(data.content.recording);
	          self.el.emit('dancing');
	          selectedAvatarEl.querySelector('[sound]').components.sound.playSound();
	        }, 5000);
	      });
	    } else {
	      this.el.setAttribute('avatar-replayer', {
	        src: 'assets/dance.json',
	        spectatorMode: true,
	        loop: true
	      });
	    }
	  },
	
	  remove: function () {
	    this.el.removeAttribute('avatar-replayer');
	  }
	});


/***/ }
/******/ ]);