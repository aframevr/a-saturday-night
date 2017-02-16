require('./ui2d.js');

// Components.
require('./components/aabb-collider.js');
require('./components/game-state.js');
require('./components/avatar-selector.js');
require('./components/ground.js');
require('./components/discofloor.js');
require('../vendor/uploadcare.js');

// States
require('./components/states/avatarSelection.js');
require('./components/states/collectUrl.js');
require('./components/states/countdown.js');
require('./components/states/dancing.js');
require('./components/states/intro.js');

// Systems
require('./systems/a-saturday-night.js');
