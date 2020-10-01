/**
 * Choco Fly Game
 * 
 * @version 1.0.1
 * @author Kemist
 */

var Choco = Choco || {};

Choco.screen = 'intro';

Choco.pausing = 0;
Choco.gameSpeed = 6;
Choco.playerSpeed = 300;
Choco.distance = 0;
Choco.trailCounter = 0;
Choco.dieCounter = 0;
Choco.boundThreshold = 100;
Choco.boundTrialThreshold = 5000;
Choco.levelDistance = 20000;

Choco.gravity = 0.5;

Choco.lastDir = null;
Choco.died = false;
Choco.isPaused = false;
Choco.screenHandlerCalled = false;
Choco.chooseAnimFinished = false;
Choco.animFrameRequested = false;
Choco.upPressed = false;
Choco.upBeingPressed = false;
Choco.downPressed = false;
Choco.downBeingPressed = false;
Choco.spawningIn = true;
Choco.titlePlaying = false;

Choco.skipReady = false;
Choco.skipIntro = false;
Choco.debug = false;
Choco.immortal = false;
Choco.startingLevel = 1;

Choco.player = null;

Choco.sessionId = null;
Choco.highScores = [];
Choco.highScoreReached = false;
Choco.rankReached = 0;
Choco.switchScreenTimer = null;
Choco.highScoreTimeLine = null;
Choco.screenSwitcherDelay = 10000;
Choco.loader = null;

Choco.scorePanel = null;

Choco.game = null;
Choco.level_type = 'day';

Choco.imageResources = [
  "images/bg_day.png", "images/clouds.png", "images/grass_day.png", "images/grass_night.png", "images/highscore.png",
  "images/intro.png", "images/intro_background.png", "images/logos.png", "images/Museo900.png", "images/pickups.png",
  "images/planes.png", "images/terrain.png", "images/Toonish1.png", "images/Toonish2.png", "images/Toonish3.png",
  "images/Toonish4.png", "images/totem.png", "images/toucanFrames.png", "images/trees.png", "images/tutorial.jpg",
  "images/ui_elements.png", "images/bg_night.png", "images/start_hazisweets.png", "images/toucan2.png", "images/scores.png"
]
        ;

Choco.soundResources = [
  {name: 'title-music', url: 'sounds/music1.ogg', loop: true, polyphony: false, volume: 1},
  {name: 'game-music', url: 'sounds/music2.ogg', loop: true, polyphony: false, volume: 1},
  {name: 'ready', url: 'sounds/ready.ogg', loop: false, polyphony: false, volume: 0.2},
  {name: 'steady', url: 'sounds/steady.ogg', loop: false, polyphony: false, volume: 0.2},
  {name: 'swipe', url: 'sounds/swipe.ogg', loop: false, polyphony: false, volume: 0.2},
  {name: 'go', url: 'sounds/go.ogg', loop: false, polyphony: false, volume: 0.2},
  {name: 'pickup', url: 'sounds/coin.ogg', loop: false, polyphony: true, volume: 0.2},
  {name: 'flap', url: 'sounds/flap.ogg', loop: false, polyphony: true, volume: 0.02},
  {name: 'die', url: 'sounds/chirp2.ogg', loop: false, polyphony: false, volume: 1},
  {name: 'heart', url: 'sounds/heart.ogg', loop: false, polyphony: false, volume: 1},
  {name: 'crash', url: 'sounds/crash.ogg', loop: false, polyphony: true, volume: 1},
  {name: 'fall', url: 'sounds/hurt.ogg', loop: false, polyphony: true, volume: 1},
  {name: 'game-over', url: 'sounds/gameover.ogg', loop: false, polyphony: false, volume: 1},
];


Choco.clouds = {
  day:
          {
            '1': {
              img: 'images/clouds.png',
              size: [627, 72, 0, 0]
            },
            '2': {
              img: 'images/clouds.png',
              size: [264, 28, 494, 74]
            },
            '3': {
              img: 'images/clouds.png',
              size: [304, 60, 619, 0]
            },
            '4': {
              img: 'images/clouds.png',
              size: [496, 80, 0, 80]
            }
          },
  night:
          {
            '1': {
              img: 'images/clouds.png',
              size: [627, 72, 0, 168]
            },
            '2': {
              img: 'images/clouds.png',
              size: [264, 28, 494, 248]
            },
            '3': {
              img: 'images/clouds.png',
              size: [304, 60, 619, 165]
            },
            '4': {
              img: 'images/clouds.png',
              size: [496, 80, 0, 247]
            }
          }
};


Choco.trees = {
  day:
          {
            '1': {
              img: 'images/trees.png',
              size: [215, 157, 215, 0]
            },
            '2': {
              img: 'images/trees.png',
              size: [248, 246, 244, 158]
            },
            '3': {
              img: 'images/trees.png',
              size: [332, 302, 0, 708]
            }
          },
  night:
          {
            '1': {
              img: 'images/trees.png',
              size: [215, 157, 0, 0]
            },
            '2': {
              img: 'images/trees.png',
              size: [245, 246, 0, 156]
            },
            '3': {
              img: 'images/trees.png',
              size: [332, 302, 0, 405]
            }
          }
};



Choco.planes = {
  1: {
    img: 'images/planes.png',
    size: [273, 186, 0, 0]
  },
  2: {
    img: 'images/planes.png',
    size: [273, 186, 0, 186]
  }
};



Choco.pickups = {
  1: {
    img: 'images/pickups.png',
    size: [73, 86, 0, 0],
    score: 100},
  2: {
    img: 'images/pickups.png',
    size: [80, 80, 153, 0],
    score: 200
  },
  3: {
    img: 'images/pickups.png',
    size: [61, 92, 0, 86],
    score: 600
  },
  4: {
    img: 'images/pickups.png',
    size: [80, 76, 73, 0],
    score: 1000
  }
};



Choco.scores = {
  100: {
    size: [63, 26],
    offset: [0, 0]
  },
  200: {
    size: [66, 26],
    offset: [63, 0]
  },
  600: {
    size: [64, 26],
    offset: [130, 0]
  },
  1000: {
    size: [86, 26],
    offset: [194, 0]
  }
};



Choco.background = {
  day: 'images/bg_day.png',
  night: 'images/bg_night.png'
};



Choco.cloud_objects = [];
Choco.tree_objects = [];
Choco.mountain_objects = [];
Choco.ground_objects = [];
Choco.enemy_objects = [];
Choco.pickup_objects = [];
Choco.heart_objects = [];
Choco.finish = null;


/**
 * Draws active screen content
 */
Choco.handleScreen = function () {
  if (Choco.screenHandlerCalled === true) {
    return;
  }
  Choco.log('Screen handler called for ' + Choco.screen);
  Choco.screenHandlerCalled = true;

  switch (Choco.screen) {
    case 'intro':
      var tl1 = new TimelineMax({repeat: 0});
      tl1.add(TweenLite.from('#screen-intro #hazisweets', 0.75, {autoAlpha: 0, scale: 0, ease: "Expo.easeInOut"}), 'intro');
      tl1.add(TweenLite.from('#screen-intro #choco', 0.75, {autoAlpha: 0, scale: 0, ease: "Expo.easeInOut"}), 'intro+=0.5');
      tl1.add(TweenLite.from('#screen-intro #tucan', 0.75, {autoAlpha: 0, ease: "Expo.easeInOut"}), 'intro+=1');
      setTimeout(function () {
        Choco.switchScreen('start');
      }, 5000);
    case 'start':
      $('#screen-start .cloud-day, #screen-start .tree-day, #screen-start .mountain-day, #screen-start .ground-day').show();
      var tl2 = new TimelineMax({repeat: 0});
      tl2.add(TweenLite.fromTo('#screen-start #start-hazisweets', 0.75, {autoAlpha: 0, scale: 0}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Expo.easeInOut"}), 'start');
      tl2.add(TweenLite.fromTo('#screen-start #start-logo', 0.75, {autoAlpha: 0, scale: 0, rotation: '360'}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Expo.easeInOut", rotation: 0}), 'start+=0.3');
      tl2.add(TweenLite.fromTo('#screen-start #start-button', 0.75, {autoAlpha: 0, scale: 0, rotation: '-360'}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Expo.easeInOut", rotation: 0}), 'start+=0.6');
      if (Choco.switchScreenTimer === null) {
        Choco.switchScreenTimer = setTimeout(Choco.initSwitchScreenTimer, Choco.screenSwitcherDelay);
      }
      Choco.muteSound('game-music');
      Choco.titlePlaying ? null : Choco.playSound('title-music');
      Choco.titlePlaying = true;
      break;

    case 'choose':
      Choco.clearSwitchScreenTimer();
      break;

    case 'game':
      Choco.clearSwitchScreenTimer();
      Choco.resetGame();
      Choco.game.run();
      Choco.muteSound('title-music');
      Choco.titlePlaying = false;
      break;

    case 'highscore':
      Choco.muteSound('game-music');
      Choco.titlePlaying ? null : Choco.playSound('title-music');
      Choco.titlePlaying = true;
      if (Choco.switchScreenTimer === null) {
        Choco.switchScreenTimer = setTimeout(Choco.initSwitchScreenTimer, Choco.screenSwitcherDelay);
      }
      Choco.getHighScores(function () {
        Choco.drawHighScores();
      });
      if (Choco.game !== null && Choco.game.score > 0) {
        $('#facebook').fadeIn(500);
      } else {
        $('#facebook').hide();
      }

      var tl3 = new TimelineMax({repeat: 0});
      tl3.add(TweenLite.fromTo('#screen-highscore #hs-choco', 0.75, {autoAlpha: 0, scale: 0}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Expo.easeInOut"}), 'highscore');
      tl3.add(TweenLite.fromTo('#screen-highscore #hs-separator', 0.75, {autoAlpha: 0, scale: 0}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Expo.easeInOut"}), 'highscore+=0.3');
      tl3.add(TweenLite.fromTo('#screen-highscore .highscore', 0.75, {autoAlpha: 0}, {display: 'block', autoAlpha: 1, ease: "Expo.easeInOut"}), 'highscore+=0.7');

      break;
  }
};


/**
 * Switch to screen
 * 
 * @param {String} screen
 */
Choco.switchScreen = function (screen) {
  Choco.screenHandlerCalled = false;
  Choco.screen = screen;

  switch (screen) {
    case 'start':
      $('#start-hazisweets, #start-logo, #start-button').hide();
      $('#screen-start .cloud-day, #screen-start .tree-day, #screen-start .mountain-day, #screen-start .ground-day').show();
      break;
    case 'game':
      $('.countdown, #game-over, #end-score, .touch').hide();
      $('#lives-box #head').removeAttr('title').removeClass();
      Choco.resetGame();
      break;
    case 'highscore':
      $('#screen-highscore .highscore, #hs-choco, #hs-separator').hide();
      break;
  }
  $('.screen.active').fadeOut(300, function () {
    $(this).removeClass('active');
    $('#screen-' + screen).fadeIn(300, function () {
      $(this).addClass('active');
      if (!Choco.screenHandlerCalled) {
        Choco.handleScreen();
      }
    });

  });
};


/**
 * Initializes screen switcher timer
 */
Choco.initSwitchScreenTimer = function () {
  if (!Choco.isPaused) {
    if (Choco.screen === 'start') {
      Choco.switchScreen('highscore');
    } else if (Choco.screen === 'highscore' && !Choco.highScoreReached) {
      Choco.switchScreen('start');
    }
  }
  Choco.switchScreenTimer = setTimeout(Choco.initSwitchScreenTimer, Choco.screenSwitcherDelay);
};


/**
 * Clears screen switcher timer
 */
Choco.clearSwitchScreenTimer = function () {
  clearTimeout(Choco.switchScreenTimer);
  Choco.switchScreenTimer = null;
};


/**
 * Logs debug info to console
 * 
 * @param string message
 */
Choco.log = function (message) {
  if (Choco.debug) {
    console.log('CHOCO: ' + message);
  }
};


/**
 * Draws lives box
 */
Choco.drawLives = function () {
  $('#lives-box .life').removeClass('death');
  for (var i = 3 - Choco.game.lives; i >= 0; i--) {
    $('#lives-box #life' + i).addClass('death');
  }
};


/**
 * Draws level box
 */
Choco.drawLevel = function () {
  $('#level-box #level').html(Choco.game.level);
};


/**
 * Resets game parameters
 */
Choco.resetGame = function () {
  if (Choco.game === null) {
    Choco.game = new Kemist.GameEngine({
      canvas: document.getElementById("game-stage"),
      width: 1280,
      height: 720,
      doubleBuffering: false,
      lives: 3,
      onInit: Choco.startLevel,
      onUpdate: Choco.update,
      onRender: Choco.renderGame,
      onGameOver: Choco.gameOver,
      startingLevel: Choco.startingLevel
    });
  }

  Choco.game.reset();

  Choco.highScoreReached = false;
  Choco.rankReached = 0;
  Choco.isPaused = false;
  Choco.gameSpeed = 6;
  Choco.playerSpeed = 300;
  Choco.died = false;
  Choco.finish = null;
};


/**
 * Generates background elements
 */
Choco.generateLandscape = function () {

  // Clouds
  for (var i = 0; i < 5; i++) {
    Choco.createCloud(300, 1200, Choco.gameSpeed / Kemist.getRandomInt(3, 8));
  }

  // Ground * 2
  var ground1 = new Kemist.Entity(
          [0, 617],
          new Kemist.Sprite('images/grass_' + Choco.level_type + '.png', [0, 0], [1280, 103])
          );

  Choco.ground_objects.push(ground1);

  var ground2 = new Kemist.Entity(
          [1279, 617],
          new Kemist.Sprite('images/grass_' + Choco.level_type + '.png', [0, 0], [1280, 103])
          );

  Choco.ground_objects.push(ground2);



  var pos = Choco.level_type == 'day' ? [0, 211] : [646, 211];
  var mountain1 = new Kemist.Entity(
          [0, 246],
          new Kemist.Sprite('images/terrain.png', pos, [646, 400]),
          {type: 'mountain'}
  );

  Choco.mountain_objects.push(mountain1);

  var mountain2 = new Kemist.Entity(
          [650, 246],
          new Kemist.Sprite('images/terrain.png', pos, [646, 400]),
          {type: 'mountain'}
  );

  Choco.mountain_objects.push(mountain2);



// Trees
  for (var i = 0; i < 3; i++) {
    Choco.createTree(i * 250);
  }

  // Score
  Choco.scorePanel = new Kemist.Entity([20, 20], new Kemist.Sprite('images/ui_elements.png', [0, 0], [450, 141]));
};



Choco.createCloud = function (min, max, speed) {
  var index = Kemist.getRandomInt(1, Object.keys(Choco.clouds[Choco.level_type]).length);
  var item = Choco.clouds[Choco.level_type][index];

  var i = 0;
  var pos;
  var same = true;
  while (same) {
    if (i > Choco.boundTrialThreshold) {
      return;
    }
    pos = [Kemist.getRandomInt(min, max), Kemist.getRandomInt(0, 400)];
    same = Choco.checkConflicts(pos, item.size, Choco.cloud_objects);
    i++;
  }



  var obj = new Kemist.Entity(
          pos,
          new Kemist.Sprite(item.img, [item.size[2], item.size[3]], [item.size[0], item.size[1]]),
          {speed: speed}
  );

  Choco.cloud_objects.push(obj);
};



Choco.createTree = function (x) {
  var index = Kemist.getRandomInt(1, Object.keys(Choco.trees[Choco.level_type]).length);
  var item = Choco.trees[Choco.level_type][index];

  var i = 0;
  var pos;
  var same = true;
  while (same) {
    if (i > Choco.boundTrialThreshold) {
      return;
    }
    pos = [x, 655 - item.size[1]];
    same = Choco.checkConflicts(pos, item.size, Choco.tree_objects);
    i++;
  }


  var obj = new Kemist.Entity(
          pos,
          new Kemist.Sprite(item.img, [item.size[2], item.size[3]], [item.size[0], item.size[1]])
          );

  Choco.tree_objects.push(obj);
};



Choco.createEnemy = function () {
  var index = Kemist.getRandomInt(1, Object.keys(Choco.planes).length);
  var item = Choco.planes[index];

  var i = 0;
  var pos;
  var same = true;
  while (same) {
    if (i > Choco.boundTrialThreshold) {
      return;
    }
    pos = [Kemist.getRandomInt(1200, 3600), Kemist.getRandomInt(200, 400)];
    same = Choco.checkConflicts(pos, [item.size[0] + 1600, item.size[1]], Choco.enemy_objects) || Choco.checkConflicts(pos, item.size, Choco.pickup_objects);
    i++;
  }


  var obj = new Kemist.Entity(
          pos,
          new Kemist.Sprite(item.img, [item.size[2], item.size[3]], [item.size[0], item.size[1]])
          );

  Choco.enemy_objects.push(obj);
};



Choco.createPickup = function () {
  var index = Kemist.shuffleWeighted([1, 2, 3, 4], [0.5, 0.2, 0.17, 0.03]);
  var item = Choco.pickups[index];

  var i = 0;
  var pos;
  var same = true;
  while (same) {
    if (i > Choco.boundTrialThreshold) {
      return;
    }
    pos = [Kemist.getRandomInt(1200, 2900), Kemist.getRandomInt(200, 400)];
    same = Choco.checkConflicts(pos, item.size, Choco.pickup_objects) || Choco.checkConflicts(pos, item.size, Choco.enemy_objects);
    i++;
  }


  var obj = new Kemist.Entity(
          pos,
          new Kemist.Sprite(item.img, [item.size[2], item.size[3]], [item.size[0], item.size[1]]),
          {score: item.score}
  );

  Choco.pickup_objects.push(obj);
};




Choco.createHeart = function () {
  var i = 0;
  var pos;
  var same = true;
  while (same) {
    if (i > Choco.boundTrialThreshold) {
      return;
    }
    pos = [Kemist.getRandomInt(1200, 1700), Kemist.getRandomInt(200, 400)];
    same = Choco.checkConflicts(pos, [86, 78], Choco.enemy_objects) || Choco.checkConflicts(pos, [86, 78], Choco.pickup_objects);
    i++;
  }


  var obj = new Kemist.Entity(
          pos,
          new Kemist.Sprite('images/pickups.png', [62, 85], [86, 78]),
          {type: 'extra life'}
  );

  Choco.heart_objects.push(obj);
};


/**
 * Creates a random object
 * 
 * @param {Array} pos
 * @param {string} type
 * @param {Array} items
 */
Choco.createRandomObject = function (pos, params, container) {
  var items = Choco[params.type + 's'];
  var index = Kemist.getRandomInt(1, Object.keys(items).length);
  var item = items[index];

  var obj = new Kemist.Entity(
          pos,
          new Kemist.Sprite(item.img, [item.size[2], item.size[3]], [item.size[0], item.size[1]]),
          params
          );

  if (typeof container === 'undefined') {
    Choco[params.type + '_objects'].push(obj);
  } else {
    Choco[container].push(obj);
  }
};



/**
 * Clears all objects from screen
 */
Choco.clearObjects = function () {
  Choco.cloud_objects = [];
  Choco.tree_objects = [];
  Choco.mountain_objects = [];
  Choco.ground_objects = [];
  Choco.enemy_objects = [];
  Choco.pickup_objects = [];
  Choco.heart_objects = [];
};


/**
 * Starts a level
 */
Choco.startLevel = function () {
  if (Choco.game.level > 1) {
    var rand = Kemist.getRandomInt(1, 2);
    Choco.level_type = rand == 1 ? 'day' : 'night';
  }
  Choco.clearObjects();
  Choco.generateLandscape();
  Choco.drawLevel();
  Choco.drawLives();

  Choco.gameSpeed = Math.round(Choco.game.level * 0.7) + 7;
  Choco.playerSpeed = Math.round(Choco.gameSpeed * 75);
  Choco.distance = 0;

  Choco.log('Level ' + Choco.game.level + ' started, gameSpeed:' + Choco.gameSpeed + ', playerSpeed:' + Choco.playerSpeed);

  Choco.player = new Kemist.Entity(
          [-300, 200],
          new Kemist.Sprite('images/toucan2.png', [0, 0], [310, 308], 16, [0]),
          {type: 'player', v: 0}
  );


  if (!Choco.skipReady) {
    Choco.countDown();
  }
};


/**
 * Player died
 */
Choco.die = function () {
  Choco.playSound('die', 0.25);
  Choco.game.die();
  Choco.drawLives();
  Choco.died = true;
  if (!Choco.game.isGameOver) {
    Choco.pausing = 1;
    Choco.dieCounter = 400;
  }


};


Choco.countDown = function (fast) {
  $('.countdown').show();
  Choco.pausing = 200;
  var delay = (typeof fast !== 'undefined' && fast === true ? 0.5 : 0.75);
  var tl7 = new TimelineMax({repeat: 0, delay: 0.5});
  tl7.add(TweenLite.fromTo('#countdown3', delay, {autoAlpha: 0, scale: 0}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Elastic.easeOut", onStart: function () {
      Choco.playSound('ready', 0.5);
    }}), 'ready');
  tl7.add(TweenLite.fromTo('#countdown3', delay, {autoAlpha: 1, y: '0%'}, {autoAlpha: 0, y: '-50%', ease: "Expo.easeOut"}));
  tl7.add(TweenLite.fromTo('#countdown2', delay, {autoAlpha: 0, scale: 0}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Elastic.easeOut", onStart: function () {
      Choco.playSound('steady', 0.5);
    }}), '-=' + (delay - 0.25));
  tl7.add(TweenLite.fromTo('#countdown2', delay, {autoAlpha: 1, y: '0%'}, {autoAlpha: 0, y: '-50%', ease: "Expo.easeOut"}));
  tl7.add(TweenLite.fromTo('#countdown1', delay, {autoAlpha: 0, scale: 0}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Elastic.easeOut", onStart: function () {
      Choco.playSound('go', 0.5);
    }}), '-=' + (delay - 0.25));
  tl7.add(TweenLite.fromTo('#countdown1', delay, {autoAlpha: 1, y: '0%'}, {autoAlpha: 0, y: '-50%', ease: "Expo.easeOut"}));
  tl7.add(TweenLite.fromTo('#go', delay, {autoAlpha: 0, scale: 0}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Elastic.easeOut", onComplete: function () {
      Choco.playSound('game-music', 0.5);
    }}), '-=' + (delay - 0.25));
  tl7.add(TweenLite.fromTo('#go', delay, {autoAlpha: 1, y: '0%'}, {autoAlpha: 0, y: '-50%', ease: "Expo.easeOut"}));
};


/**
 * Game is over
 */
Choco.gameOver = function () {
  Choco.muteSound('game-music');
  var tl8 = new TimelineMax({repeat: 0, delay: 1});
  tl8.add(TweenLite.fromTo('#game-over', 1, {autoAlpha: 0, scale: 0, rotation: '360deg'}, {display: 'block', autoAlpha: 1, scale: 1, rotation: 0, ease: "Elastic.easeOut", onStart: function () {
      Choco.playSound('game-over');
    }}), 'game_over');
  tl8.add(TweenLite.fromTo('#end-score', 1, {autoAlpha: 0, scale: 0}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Expo.easeOut"}), 'game_over+=1');

  $('#end-score-nr').html(Choco.game.score);

  var tl9 = new TimelineMax({repeat: 6, yoyo: true, delay: 3, onComplete: function () {
      Choco.game.stop();
      Choco.switchScreen('highscore');
    }});
  tl9.add(TweenLite.fromTo('#end-score', 0.3, {scale: 1}, {scale: 0.95}), 'game-over');
};


/**
 * Updates game objects
 * 
 * @param {Number} dt
 * 
 */
Choco.update = function (dt) {
  if (!Choco.game.isGameOver) {
    Choco.handleInput(dt);
  }

  Choco.updateEntities(dt);

};


/**
 * Handles keyboard input
 * 
 * @param {Number} dt
 * 
 */
Choco.handleInput = function (dt) {
  if (Choco.spawningIn || Choco.pausing > 0 || Choco.finishing === true) {
    return;
  }

  var move_speed = 0;
  Choco.downPressed = false;

  if (!Choco.finishing && !Choco.upBeingPressed && (Choco.player.params.v >= -5 || Choco.player.pos[1] >= 520) && Choco.player.pos[1] > -40 && (Kemist.Input.isDown('UP') || Kemist.Input.isDown('w'))) {
    Choco.player.params.v = -17;
    Choco.upPressed = true;
    Choco.playSound('flap', 0.2);
  }


  if (Kemist.Input.isDown('UP') || Kemist.Input.isDown('w')) {
    if (!Choco.upBeingPressed) {
      Choco.player.sprite._index = 0;
    }
    Choco.upBeingPressed = true;
  } else {
    Choco.upBeingPressed = false;
  }


  if (!Choco.finishing && !Choco.downBeingPressed && Choco.player.pos[1] < 520 && (Kemist.Input.isDown('DOWN') || Kemist.Input.isDown('s'))) {
//    move_speed = Choco.playerSpeed * dt * 1.2;
//    Choco.player.pos[1] += move_speed;
    Choco.player.params.v += 15;
    Choco.downPressed = true;
    Choco.upPressed = false;
    Choco.playSound('swipe', 0.2);
    Choco.player.sprite._index = 0;
  }


  if (Kemist.Input.isDown('DOWN') || Kemist.Input.isDown('s')) {
    Choco.downBeingPressed = true;
  } else {
    Choco.downBeingPressed = false;
  }


  if (Choco.upPressed) {
    Choco.player.sprite.frames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
//    Choco.player.sprite._index=0;
    Choco.player.sprite.once = true;
  } else {
    Choco.player.sprite.frames = [0];
    Choco.player.sprite.once = false;
  }

};


/**
 * Updates game entities
 * 
 * @param {Number} dt
 */
Choco.updateEntities = function (dt) {
  if (Choco.isPaused) {
    return;
  }


  if (Choco.game.isGameOver) {
    return;
  }

  Choco.distance += Choco.gameSpeed;
  Choco.finishSoon = (Choco.levelDistance - Choco.distance < 4800);
  Choco.finishApproach = (Choco.levelDistance - Choco.distance < 2800);
  Choco.finishing = (Choco.levelDistance - Choco.distance < 500);

  Choco.player.sprite.update(dt);

  // Handle pausing
  if (Choco.pausing > 0) {
    Choco.pausing--;
    if (Choco.pausing == 0 && Choco.died) {
      //Choco.player.pos = [470, 200];
      Choco.died = false;
    }
    return;
  }


  // Immortal for few seconds after respawn
  if (Choco.dieCounter > 0) {
    Choco.dieCounter -= 5;
    if (Choco.dieCounter % 50 < 20) {
      Choco.player.pos[0] = 100;
    } else {
      Choco.player.pos[0] = -300;
    }
  } else if (!Choco.spawningIn && !Choco.finishing) {
    Choco.player.pos[0] = 100;
  }


  // Move clouds
  for (var i = 0; i < Choco.cloud_objects.length; i++) {
    var obj = Choco.cloud_objects[i];
    obj.pos[0] -= obj.params.speed;

    if (obj.pos[0] < 200 && Choco.cloud_objects.length < 10) {
      Choco.createCloud(1300, 1500, Choco.gameSpeed / Kemist.getRandomInt(3, 8));
    }
    if (obj.pos[0] < (obj.sprite.size[0] * -1)) {
      Choco.cloud_objects.splice(i, 1);
      i--;
      continue;
    }
  }


  // Move ground and background objects
  if (!Choco.pausing && !Choco.finishing && !Choco.died) {
    // Grounds
    for (var i = 0; i < Choco.ground_objects.length; i++) {
      var obj = Choco.ground_objects[i];

      if (obj.pos[0] <= -1274) {
        if (i == 0) {
          Choco.ground_objects[0].pos[0] = Choco.ground_objects[1].pos[0] + 1274;
        } else {
          Choco.ground_objects[1].pos[0] = Choco.ground_objects[0].pos[0] + 1274;
        }

      } else {
        obj.pos[0] -= Choco.gameSpeed / 2;
      }
    }

    // Move mountain objects
    for (var i = 0; i < Choco.mountain_objects.length; i++) {
      var obj = Choco.mountain_objects[i];
      var speed = Choco.gameSpeed / 7;

      if (obj.pos[0] <= (obj.sprite.size[0] * -1)) {
        Choco.mountain_objects.splice(i, 1);
        i--;
        continue;
      } else {
        obj.pos[0] -= speed;
      }
    }

    if (Choco.mountain_objects.length < 2) {
      var pos = Choco.level_type == 'day' ? [0, 211] : [646, 211];
      var mountain1 = new Kemist.Entity(
              [Kemist.getRandomInt(1300, 1500), 246],
              new Kemist.Sprite('images/terrain.png', pos, [646, 400]),
              {type: 'mountain'}
      );

      Choco.mountain_objects.push(mountain1);
    }

    // Move tree objects
    for (var i = 0; i < Choco.tree_objects.length; i++) {
      var obj = Choco.tree_objects[i];
      var speed = Choco.gameSpeed / 2;

      if (obj.pos[0] <= (obj.sprite.size[0] * -1)) {
        Choco.tree_objects.splice(i, 1);
        i--;
        continue;
      } else {
        obj.pos[0] -= speed;
      }
    }

    if (Choco.tree_objects.length < 3) {
      Choco.createTree(Kemist.getRandomInt(1300, 1500));
    }


    // Player    
    if (Choco.dieCounter == 0 && Choco.player.pos[0] < 100) {
      Choco.spawningIn = true;
      Choco.player.pos[0] += Choco.gameSpeed;
      Choco.player.sprite.frames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      Choco.player.sprite.once = false;
    } else if (!Choco.finishing && (Choco.player.pos[1] < 520 || (Choco.dieCounter > 0 && Choco.upPressed))) {
      Choco.spawningIn = false;
      Choco.player.params.v += Choco.gravity;
      Choco.player.pos[1] += (Choco.player.params.v / 2);
      Choco.player.pos[1] = Math.max(Choco.player.pos[1], -40);
    } else if (Choco.player.pos[1] >= 520
            &&
            !Choco.immortal
            &&
            Choco.dieCounter < 1
            &&
            !Choco.died) {
      Choco.die();
      Choco.playSound('fall', 0.3);
    }

    if (Choco.upPressed && Choco.player.params.v > 0) {
      Choco.upPressed = false;
    }



    // Enemies
    var die = false;
    for (var i = 0; i < Choco.enemy_objects.length; i++) {
      var obj = Choco.enemy_objects[i];
      var speed = Choco.gameSpeed;

      if (obj.pos[0] <= (obj.sprite.size[0] * -1)) {
        Choco.enemy_objects.splice(i, 1);
        i--;
        continue;
      } else {
        obj.pos[0] -= speed;
      }


      if (!Choco.immortal
              &&
              Choco.dieCounter < 1
              &&
              !Choco.died
              &&
              Kemist.boxCollides([obj.pos[0] * 1.05, obj.pos[1] * 1.05], [obj.sprite.size[0] * .85, obj.sprite.size[1] * .85], [Choco.player.pos[0] + Choco.player.sprite.size[0] / 3, Choco.player.pos[1] + Choco.player.sprite.size[1] / 4], [Choco.player.sprite.size[0] / 2, Choco.player.sprite.size[1] / 3])
              ) {
        //Choco.game.ctx.strokeRect(obj.pos[0] * 1.05, obj.pos[1] * 1.05, obj.sprite.size[0] * .85, obj.sprite.size[1] * .85);
        //Choco.game.ctx.strokeRect(Choco.player.pos[0] + Choco.player.sprite.size[0] / 3, Choco.player.pos[1] + Choco.player.sprite.size[1] / 4, Choco.player.sprite.size[0] / 2, Choco.player.sprite.size[1] / 3);
        Choco.die();
        Choco.playSound('crash', 0.3);
      }

    }
    if (!Choco.finishSoon && Choco.enemy_objects.length < 2) {
      Choco.createEnemy();
    }


    // Pickups
    for (var i = 0; i < Choco.pickup_objects.length; i++) {
      var obj = Choco.pickup_objects[i];
      var speed = obj.scored ? Choco.gameSpeed / 3 : Choco.gameSpeed / 2;

      if (obj.pos[0] <= (obj.sprite.size[0] * -1)) {
        Choco.pickup_objects.splice(i, 1);
        i--;
        continue;
      } else {
        obj.pos[0] -= speed;
        if (obj.scored) {
          obj.pos[1] -= Choco.gameSpeed / 16;
        }
      }

      // Check gift taking
      if (Choco.dieCounter < 1
              &&
              obj.scored != true
              &&
              !Choco.died
              &&
              obj.collidesTo(Choco.player, 20)
              ) {
        var points = obj.params.score;
        Choco.game.score += points;
        Choco.playSound('pickup', 0.5);
        Choco.log('Collision to a gift, scored ' + points + '.');
        obj.scored = true;
        obj.sprite = new Kemist.Sprite('images/scores.png', Choco.scores[points].offset, Choco.scores[points].size);
      }
    }
    if (!Choco.finishSoon && Choco.pickup_objects.length < 4) {
      Choco.createPickup();
    }


    // Create extra lives
    if (!Choco.finishSoon && Choco.game.lives < 3 && Choco.heart_objects.length < 1 && Kemist.getRandomInt(1, 400) == 1) {
      Choco.createHeart();
    }

    // Move extra lives
    if (!Choco.finishing) {
      for (var i = 0; i < Choco.heart_objects.length; i++) {
        var obj = Choco.heart_objects[i];
        obj.pos[0] -= Choco.gameSpeed * 1.2;
        if (obj.pos[0] < (obj.sprite.size[0] * -1)) {
          Choco.heart_objects.splice(i, 1);
          i--;
          continue;
        }
        // Check extra life taking
        if (Choco.dieCounter < 1
                &&
                !Choco.died
                &&
                obj.collidesTo(Choco.player, 20)
                &&
                Choco.game.lives < 3
                ) {
          Choco.playSound('heart', 0.3);
          Choco.game.lives++;
          Choco.drawLives();
          Choco.log('Collision to an extra life.');
          Choco.heart_objects.splice(i, 1);
          i--;
          continue;
        }
      }
    }

  }


  // Finish approaching, create finish flag
  if (Choco.finishApproach && Choco.finish == null) {
    Choco.finish = new Kemist.Entity(
            [1600, 100],
            new Kemist.Sprite('images/totem.png', [0, 0], [329, 564])
            );
  }
  // Move finish flag
  if (!Choco.finishing && Choco.finishApproach && Choco.finish != null) {
    Choco.finish.pos[0] -= Choco.gameSpeed / 2;
    if (Choco.levelDistance - Choco.distance < 1100 && !Choco.finishPlayed) {
//      Choco.playSound('finish');
      Choco.finishPlayed = true;
    }
  }
  // Move player out through finish
  if (Choco.finishing) {
    Choco.player.sprite.frames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    Choco.player.sprite.once = false;
    Choco.player.params.v = 0;
    Choco.player.pos[0] += Choco.gameSpeed;
    if (Choco.player.pos[1] != 200) {
      Choco.player.pos[1] = Choco.player.pos[1] < 200 ? Choco.player.pos[1] + Choco.gameSpeed : Choco.player.pos[1] - Choco.gameSpeed;
      if (Math.abs(Choco.player.pos[1] - 200) < Choco.gameSpeed) {
        Choco.player.pos[1] = 200;
      }
    }
    if (Choco.player.pos[0] > 1200) {
      Choco.finish = null;
      Choco.game.level++;
      Choco.startLevel();
    }
  }




  if (Choco.debug) {
//    $('#debug').html('Clouds: ' + Choco.cloud_objects.length + ', tree objects: ' + Choco.tree_objects.length+', mountain objects: ' + Choco.mountain_objects.length);
//    $('#debug').html('Distance: ' + Choco.distance + '/' + Choco.levelDistance + ', trees: ' + Choco.tree_objects.length + ', pickups:' + Choco.pickup_objects.length + ', enemy objects: ' + Choco.enemy_objects.length);
//    $('#debug').html('Player: ' + Math.round(Choco.player.pos[0]) + ',' + Math.round(Choco.player.pos[1]) + ', velocity:' + Choco.player.params.v);
//    $('#debug').html('UP: ' + Choco.upPressed + ', now: ' + Choco.upBeingPressed);
  }
};


/**
 * Check object bounding conflicts to a set of elements
 * 
 * @param {int} x
 * @param {int} y
 * @param {Array} size
 * @param {Array} elements
 * 
 * @returns {Boolean}
 */
Choco.checkConflicts = function (pos, size, elements) {
  var same = false;
  for (var i = 0; i < elements.length; i++) {
    if (Kemist.boxCollides([pos[0] - Choco.boundThreshold, pos[1] - Choco.boundThreshold],
            [size[0] + Choco.boundThreshold, size[1] + Choco.boundThreshold],
            [elements[i].pos[0] - Choco.boundThreshold, elements[i].pos[1] - Choco.boundThreshold],
            [elements[i].sprite.size[0] + Choco.boundThreshold, elements[i].sprite.size[1] + Choco.boundThreshold])) {
      same = true;
      break;
    }
  }
  return same;
};


/**
 * Gets coordinates without conflicts any gift/stone
 * 
 * @param {string} type
 * 
 * @returns {Array}
 */
Choco.getConflictlessCoordinates = function (type) {
  var same_stone = true;
  var same_gift = true;
  var x, y, ct = 0;
  x = Kemist.getRandomInt(200, 700);
  y = Kemist.getRandomInt(800, 1600);
  while (same_stone || same_gift) {
    if (ct > Choco.boundTrialThreshold) {
      break;
    }
    same_stone = Choco.checkConflicts([x, y], [107, 47], Choco.stone_objects);
    same_gift = Choco.checkConflicts([x, y], [95, 89], Choco.gift_objects);
    ct++;
    if (same_stone || same_gift) {
      x = Kemist.getRandomInt(200, 700);
      y = Kemist.getRandomInt(800, 1600);
      same_stone = same_gift = true;
      Choco.log('Generating ' + type + ' conflicts:' + ct);
    }
  }
  return [x, y];
};


/**
 * Renders game elements
 */
Choco.renderGame = function (game) {
  var ctx = game.ctx;
  var pattern = ctx.createPattern(Kemist.Resources.get(Choco.background[Choco.level_type]), 'repeat-x');
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, 1280, 960);

  game.renderEntities(Choco.cloud_objects);
  game.renderEntities(Choco.mountain_objects);
  game.renderEntities(Choco.tree_objects);

  if (Choco.finish != null) {
    Choco.game.renderEntity(Choco.finish);
  }

  game.renderEntities(Choco.ground_objects);
  game.renderEntities(Choco.pickup_objects);
  game.renderEntities(Choco.heart_objects);
  game.renderEntity(Choco.scorePanel);

  ctx.font = '42px Museo';
  ctx.fillStyle = '#fff';
  ctx.fillText(game.score.toString(), 170, 100);

  // Render the player if the game isn't over
  if (!game.isGameOver) {
    Choco.game.renderEntity(Choco.player);
    Choco.game.renderEntities(Choco.enemy_objects);
  }

};



Choco.logOnce = function (message) {
  if (typeof Choco.debug_once === 'undefined') {
    console.log(message);
    Choco.debug_once = true;
  }
};


/**
 * Creates API session
 */
Choco.createSession = function (callback) {
  var now = new Date();
  var year = now.getYear() + 1900;
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var timeStamp = year + '' + (month < 10 ? '0' + month : month) + '' + (day < 10 ? '0' + day : day);
  var password = CryptoJS.MD5('ChOcOfLy' + timeStamp.toString());
  $.ajax({
    type: 'GET',
    url: 'http://rasterstudio.hu/api/chocofly.create_session/chocofly/' + escape(password),
    data: '',
    dataType: 'json',
    cache: false,
    crossDomain: true,
    async: true,
    contentType: 'application/x-www-form-urlencoded',
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.responseText) {
        console.log(errorThrown + "\n" + XMLHttpRequest.responseText);
      }
    },
    success: function (data, textStatus, XMLHttpRequest) {
      if (data.result == 'ok') {
        Choco.sessionId = data.sessionId;
        if (typeof callback === 'function') {
          callback();
        }
      }
    }

  });
};


/**
 * Gets high scores
 */
Choco.getHighScores = function (callback) {
  if (Choco.sessionId === null) {
    return;
  }
  $.ajax({
    type: 'GET',
    url: 'http://rasterstudio.hu/api/chocofly.get_highscores/' + escape(Choco.sessionId),
    data: '',
    dataType: 'json',
    cache: false,
    crossDomain: true,
    async: true,
    contentType: 'application/x-www-form-urlencoded',
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.responseText) {
        console.log(errorThrown + "\n" + XMLHttpRequest.responseText);
      }
    },
    success: function (data, textStatus, XMLHttpRequest) {
      if (data.result === 'ok') {
        Choco.highScores = data.scores;
        callback();
      }
    }

  });
};


/**
 * Store new high score
 */
Choco.storeHighScore = function (name) {
  if (Choco.sessionId === null) {
    return;
  }

  var now = new Date();
  var year = now.getYear() + 1900;
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var seconds = now.getSeconds();
  var occured = year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' ' + (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);


  $.ajax({
    type: 'POST',
    url: 'http://rasterstudio.hu/api/chocofly.store_highscore',
    data: 'sessionId=' + escape(Choco.sessionId) + '&platform=Desktop&name=' +
            name + '&score=' + Choco.game.score + '&level=' + Choco.game.level +
            '&occured=' + occured,
    dataType: 'json',
    cache: false,
    crossDomain: true,
    async: true,
    contentType: 'application/x-www-form-urlencoded',
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      if (XMLHttpRequest.responseText) {
        console.log(errorThrown + "\n" + XMLHttpRequest.responseText);
      }
    },
    success: function (data, textStatus, XMLHttpRequest) {
      Choco.getHighScores(function () {
        if (Choco.highScoreTimeLine != null) {
          Choco.highScoreTimeLine.clear();
        }
        Choco.highScoreReached = false;
        Choco.rankReached = 0;
        Choco.game.score = 0;
        Choco.drawHighScores();
      });
    }

  });
};


/**
 * Draws highscore box
 */
Choco.drawHighScores = function () {
  var row;
  var rank = 1;
  var score = (Choco.game ? Choco.game.score : 0);

  $('#rank1, #rank2, #rank3, #rank4').removeClass('reached');
  for (var i = 0; i < Choco.highScores.length; i++) {
    if (rank > 8) {
      break;
    }
    if (!Choco.highScoreReached && score > Choco.highScores[i].score) {
      Choco.highScoreReached = true;
      Choco.rankReached = rank;
      row = $('<div class="player-name"><input type="text" id="new-player-name" /></div><div class="score">' + score + '</div>');
      $('#rank' + rank).html('').append(row);
      $('#rank' + rank).addClass('reached');
      rank++;
    }
    $('#rank' + rank + ' .username').html(Choco.highScores[i].name);
    $('#rank' + rank + ' .score').html(Choco.highScores[i].score);
    rank++;
  }

  if (Choco.highScores.length == 0) {
    Choco.highScoreReached = true;
    row = $('<div class="player-name"><input type="text" id="new-player-name" /></div><div class="score">' + score + '</div>');
    $('#rank' + rank).html('').append(row);
    $('#rank' + rank).addClass('reached');
  }

  if (Choco.highScoreReached) {
    Choco.highScoreTimeLine = new TimelineMax({repeat: -1, yoyo: true, delay: 0});
    Choco.highScoreTimeLine.add(TweenLite.fromTo('#highscore-table .reached', 0.3, {scale: 1}, {scale: 1.2}));
    setTimeout(function () {
      $('#new-player-name').focus();
    }, 2000);
    $('#new-player-name').keypress(function (event) {
      if (event.which == 13) {
        Choco.storeHighScore($(this).val());
      }
    });

  }
};




/**
 * Plays specified sound
 * 
 * @param {string} filename
 */
Choco.playSound = function (name, volume) {
  var voice = Kemist.Audio.play(name, volume);
  if (voice !== null) {
    Choco.log(name + ' sound played on voice ' + voice);
  }
};


/**
 * Plays specified sound
 * 
 * @param {string} filename
 */
Choco.muteSound = function (name) {
  Kemist.Audio.pause(name);
  Choco.log(name + ' sound paused.');
};


/**
 * Progress loading
 * 
 * @param {int} progress
 * @param {int} count
 */
Choco.loadingProgress = function (progress, count) {
  Choco.loader.show();
  var percent = Math.round(progress / count * 100);
  Choco.loader.attr('value', percent).html('Loading ' + percent + '%');
  if (progress === count) {
    Choco.loader.hide();
  }
};


Choco.FacebookPost = function (message) {
  FB.ui({
    app_id: '982074625146679',
    method: 'feed',
    name: 'Choco fly',
    link: 'http://hazisweets.hu/',
    picture: 'http://hazisweets.hu/choco_fly/images/facebook_share.jpg',
    caption: 'Játssz Te is!',
    description: message
  }, function (response) {
    if (!response || response.error) {
//      alert('Hiba történt!');
    }
  });

};


$(document).ready(function () {

  if (Choco.skipIntro) {
    Choco.screen = 'game';
  }

  Choco.loader = $("progress");
  Kemist.Resources.onProgress(Choco.loadingProgress);
  Kemist.Resources.onReady(Choco.handleScreen);
  Kemist.Resources.load(Choco.imageResources);
  Choco.createSession();

  $('#screen-' + Choco.screen).fadeIn(300, function () {
    $(this).addClass('active');
  });

  // Start button
  $('#start-button').click(function () {
    Choco.switchScreen('tutorial');
  });

  // Tutorial
  $('#tutorial').click(function () {
    Choco.switchScreen('game');
  });

  // Pause button
  $('#pause-button').click(function () {
    $(this).toggleClass('paused');
    Choco.isPaused = (!Choco.isPaused);
    if (!Choco.isPaused) {
      Choco.countDown(true);
    }
  });

  // Facebook post
  $('#facebook').click(function () {
    var message;
    if (Choco.highScoreReached) {
      message = Choco.rankReached + ". lettem " + Choco.game.score + " ponttal a Choco Flyban!";
    } else {
      message = Choco.game.score + " pontot szereztem a Choco Flyban!";
    }
    Choco.FacebookPost(message);
  });

  // Mute/Unmute
  $('#sound').click(function () {
    $(this).toggleClass('muted');
    Kemist.Audio.muted = Kemist.Audio.muted ? false : true;
    Kemist.Cookie.set('chocofly_game_muted', Kemist.Audio.muted, 1440, '/');
    if (Kemist.Audio.muted) {
      Kemist.Audio.pause('music');
    } else {
      Kemist.Audio.resume('music');
    }
  });

  // Touch left
  $('#touch_left').bind('touchstart mousedown', function (e) {
    Choco.touchLeft = true;
    e.preventDefault();
  }).bind('touchend mouseup', function () {
    Choco.touchLeft = false;
  });

  // Touch right
  $('#touch_right').bind('touchstart mousedown', function (e) {
    Choco.touchRight = true;
    e.preventDefault();
  }).bind('touchend mouseup', function () {
    Choco.touchRight = false;
  });

  if (Kemist.Cookie.get('xmas_game_muted') == 'true') {
    Kemist.Audio.muted = true;
    $('#sound').addClass('muted');
  } else {
    Kemist.Audio.muted = false;
  }

  Kemist.Audio.polyphony = 2;
  Kemist.Audio.add(Choco.soundResources);

});


$(window).blur(function () {
//  Choco.isPaused = true;
});
$(window).focus(function () {
//  Choco.isPaused = false;
});
