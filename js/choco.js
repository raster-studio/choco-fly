/**
 * Choco Fly Game
 * 
 * @version 1.0.0
 * @author Kemist
 */

var Choco = Choco || {};

Choco.screen = 'game';

Choco.pausing = 0;
Choco.gameSpeed = 4;
Choco.playerSpeed = 300;
Choco.distance = 0;
Choco.trailCounter = 0;
Choco.dieCounter = 0;
Choco.boundThreshold = 100;
Choco.boundTrialThreshold = 5000;

Choco.gravity = 0.5;

Choco.lastDir = null;
Choco.died = false;
Choco.isPaused = false;
Choco.screenHandlerCalled = false;
Choco.chooseAnimFinished = false;
Choco.animFrameRequested = false;
Choco.upPressed = false;
Choco.downPressed = false;

Choco.skipReady = true;
Choco.skipIntro = false;
Choco.debug = true;
Choco.immortal = false;
Choco.startingLevel = 1;

Choco.player = null;

Choco.sessionId = null;
Choco.highScores = [];
Choco.highScoreReached = false;
Choco.switchScreenTimer = null;
Choco.highScoreTimeLine = null;
Choco.screenSwitcherDelay = 10000;
Choco.loader = null;

Choco.game = null;
Choco.level_type = 'day';

Choco.imageResources = [
  "images/bg_day.png", "images/clouds.png", "images/grass_day.png", "images/grass_night.png", "images/highscore.png",
  "images/intro.png", "images/intro_background.png", "images/logos.png", "images/Museo900.png", "images/pickups.png",
  "images/planes.png", "images/terrain.png", "images/Toonish1.png", "images/Toonish2.png", "images/Toonish3.png",
  "images/Toonish4.png", "images/totem.png", "images/toucanFrames.png", "images/trees.png", "images/tutorial.png",
  "images/uielements.png", "images/bg_night.png", "images/start_hazisweets.png", "images/toucan2.png"
]
        ;

Choco.soundResources = [
//  {name:'music', url:'sounds/green_day_basket_case.mp3', loop: true, polyphony: false, volume: 0.2}

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
            },
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
            },
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
Choco.background_objects = [];
Choco.finish = null;


/**
 * Draws active screen content
 */
Choco.handleScreen = function () {
  if (Choco.screenHandlerCalled == true) {
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
      tl2.add(TweenLite.fromTo('#screen-start #start_hazisweets', 0.75, {autoAlpha: 0, scale: 0}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Expo.easeInOut"}), 'start');
      tl2.add(TweenLite.fromTo('#screen-start #start_logo', 0.75, {autoAlpha: 0, scale: 0, rotation: '360'}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Expo.easeInOut", rotation: 0}), 'start+=0.3');
      tl2.add(TweenLite.fromTo('#screen-start #start_button', 0.75, {autoAlpha: 0, scale: 0, rotation: '-360'}, {display: 'block', autoAlpha: 1, scale: 1, ease: "Expo.easeInOut", rotation: 0}), 'start+=0.6');
      if (Choco.switchScreenTimer == null) {
        Choco.switchScreenTimer = setTimeout(Choco.initSwitchScreenTimer, Choco.screenSwitcherDelay);
      }
      break;

    case 'choose':
      Choco.clearSwitchScreenTimer();
      break;

    case 'game':
      Choco.clearSwitchScreenTimer();
      Choco.resetGame();
      Choco.game.run();
      break;

    case 'highscore':
      if (Choco.switchScreenTimer == null) {
        Choco.switchScreenTimer = setTimeout(Choco.initSwitchScreenTimer, Choco.screenSwitcherDelay);
      }
      Choco.getHighScores(function () {
        Choco.drawHighScores();
      });
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
      $('#start_hazisweets, #start_logo, #start_button').hide();
      $('#screen-start .cloud-day, #screen-start .tree-day, #screen-start .mountain-day, #screen-start .ground-day').show();
      break;
    case 'choose':
      $('#choose-logo, #choose-button, #screen-choose .character').hide();
      $('#screen-choose .character').removeAttr('id').removeClass('loaded');
      Choco.chooseAnimFinished = false;
      break;
    case 'game':
      $('#lives-box, #score-box, #level-box, #ready, #steady, #go, #game-over, #end-score, .touch').hide();
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
    if (Choco.screen == 'start') {
      Choco.switchScreen('highscore');
    } else if (Choco.screen == 'highscore' && !Choco.highScoreReached) {
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
 * Draws score box
 */
Choco.drawScore = function () {
  $('#score-box #score').html(Choco.game.score);
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
  Choco.isPaused = false;
  Choco.gameSpeed = 4;
  Choco.playerSpeed = 300;
  Choco.died = false;
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
    same = Choco.checkConflicts(pos[0], pos[1], item.size, Choco.cloud_objects);
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
    same = Choco.checkConflicts(pos[0], pos[1], item.size, Choco.tree_objects);
    i++;
  }


  var obj = new Kemist.Entity(
          pos,
          new Kemist.Sprite(item.img, [item.size[2], item.size[3]], [item.size[0], item.size[1]])
          );

  Choco.tree_objects.push(obj);
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
  Choco.background_objects = [];
};


/**
 * Starts a level
 */
Choco.startLevel = function () {
  Choco.clearObjects();
  Choco.generateLandscape();
  Choco.drawLevel();
  Choco.drawLives();
  Choco.drawScore();

  Choco.gameSpeed = Math.round(Choco.game.level * 0.7) + 4;
  Choco.playerSpeed = Math.round(Choco.gameSpeed * 75);
  Choco.distance = 0;

  Choco.log('Level ' + Choco.game.level + ' started, gameSpeed:' + Choco.gameSpeed + ', playerSpeed:' + Choco.playerSpeed);

  Choco.player = new Kemist.Entity(
          [-300, 200],
          new Kemist.Sprite('images/toucan2.png', [0, 0], [310, 308], 24, [0]),
          {type: 'player', v: 0}
  );


  if (!Choco.skipReady) {
    Choco.pausing = 210;
  }
};


/**
 * Player died
 */
Choco.die = function () {
  Choco.playSound('explosion', 0.5);
  Choco.game.die();
  Choco.drawLives();
  Choco.died = true;
  if (!Choco.game.isGameOver) {
    Choco.pausing = 50;
    Choco.dieCounter = 250;
  }

  Choco.explosions.push(new Kemist.Entity(
          [Choco.player.pos[0] + 0, Choco.player.pos[1] + 0],
          new Kemist.Sprite('images/explosion2.png',
                  [22, 0],
                  [103, 103],
                  16,
                  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                  null,
                  true),
          {type: 'explosion'}
  ));
  Choco.player.pos = [-200, -200];
};


/**
 * Game is over
 */
Choco.gameOver = function () {

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
  if (Choco.pausing > 0 || Choco.finishing === true) {
    return;
  }

  var move_speed = 0;
  Choco.upPressed = false;
  Choco.downPressed = false;

  if (Kemist.Input.isDown('UP') || Kemist.Input.isDown('w')) {
    if (Choco.player.pos[1] > -70){
      move_speed = Choco.playerSpeed * dt;
      Choco.player.pos[1] -= move_speed;
    }
    Choco.player.params.v = 0;
    Choco.upPressed = true;
  }


  if (Choco.player.pos[1] < 520 && (Kemist.Input.isDown('DOWN') || Kemist.Input.isDown('s'))) {
    move_speed = Choco.playerSpeed * dt * 2;
    Choco.player.pos[1] += move_speed;
    Choco.player.params.v = 0;
    Choco.downPressed = true;
  }


  if (Choco.upPressed) {
    Choco.player.sprite.frames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    ;
  } else {
    Choco.player.sprite.frames = [0];
    ;
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


  // Handle pausing
  if (Choco.pausing > 0) {
    Choco.pausing--;
    if (Choco.pausing == 0 && Choco.died) {
      Choco.player.pos = [470, 200];
      Choco.died = false;
    }
    return;
  }


  // Immortal for few seconds after respawn
  if (Choco.dieCounter > 0) {
    Choco.dieCounter -= 5;
    if (Choco.dieCounter % 50 < 20) {
      Choco.player.pos[1] = -200;
    } else {
      Choco.player.pos[1] = 200;
    }
  } else if (!Choco.finishing) {
    //Choco.player.pos[1] = 200;
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

    
    if (Choco.player.pos[0] < 100){
      Choco.player.pos[0] += Choco.gameSpeed ;
      Choco.player.sprite.frames=[0,1,2,3,4,5,6,7,8,9,10,11,12];
    }else if (!Choco.upPressed && Choco.player.pos[1] < 520) {
      Choco.player.params.v += Choco.gravity;
      Choco.player.pos[1] += (Choco.player.params.v / 2);
      Choco.player.sprite.frames=[0];
    }
          

    Choco.player.sprite.update(dt);
  }



  if (Choco.debug) {
//    $('#debug').html('Clouds: ' + Choco.cloud_objects.length + ', tree objects: ' + Choco.tree_objects.length+', mountain objects: ' + Choco.mountain_objects.length);
//    $('#debug').html('Distance: ' + Choco.distance + '/' + Choco.levelDistances[Choco.game.level] + ', stones: ' + Choco.stone_objects.length + ', gifts:' + Choco.gift_objects.length + ', background objects: ' + Choco.background_objects.length);
    $('#debug').html('Up: ' + Choco.upPressed + ', down:' + Choco.downPressed);
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
Choco.checkConflicts = function (x, y, size, elements) {
  var same = false;
  for (var i = 0; i < elements.length; i++) {
    if (Kemist.boxCollides([x - Choco.boundThreshold, y - Choco.boundThreshold],
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
    same_stone = Choco.checkConflicts(x, y, [107, 47], Choco.stone_objects);
    same_gift = Choco.checkConflicts(x, y, [95, 89], Choco.gift_objects);
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
  game.renderEntities(Choco.ground_objects);

  // Render the player if the game isn't over
  if (!game.isGameOver) {
    Choco.game.renderEntity(Choco.player);
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

  $.ajax({
    type: 'POST',
    url: 'http://rasterstudio.hu/api/chocofly.store_highscore',
    data: 'sessionId=' + escape(Choco.sessionId) + '&name=' + name + '&score=' + Choco.game.score + '&level=' + Choco.game.level + '&character=' + escape(Choco.character),
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
      row = $('<div class="player-name"><input type="text" id="new-player-name" /></div><div class="score ' + Choco.character + '">' + score + '</div>');
      $('#hs' + rank).html('').append(row);
      $('#rank' + rank).addClass('reached');
      rank++;
    }
    $('#rank' + rank + ' .username').html(Choco.highScores[i].name);
    $('#rank' + rank + ' .score').html(Choco.highScores[i].score);
    rank++;
  }

  if (Choco.highScores.length == 0) {
    Choco.highScoreReached = true;
    row = $('<div class="player-name"><input type="text" id="new-player-name" /></div><div class="score ' + Choco.character + '">' + score + '</div>');
    $('#hs' + rank).html('').append(row);
    $('#rank' + rank).addClass('reached');
  }

  if (Choco.highScoreReached) {
    Choco.highScoreTimeLine = new TimelineMax({repeat: -1, yoyo: true, delay: 0});
    Choco.highScoreTimeLine.add(TweenLite.fromTo('#highscore-table .reached', 0.3, {scale: 1}, {scale: 1.2}));
    setTimeout(function () {
      $('#new-player-name').focus();
    }, 4000);
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
  $('#start_button').click(function () {
    Choco.switchScreen('game');
  });

  // Choose character
  $('#screen-choose .character').click(function () {
    if (Choco.chooseAnimFinished) {
      Choco.character = $(this).attr('id');
      Choco.log('Chosen character: ' + Choco.character);
      Choco.switchScreen('game');
    }
  });

  // Mute/Unmute
  $('#sound').click(function () {
    $(this).toggleClass('muted');
    Kemist.Audio.muted = Kemist.Audio.muted ? false : true;
    Kemist.Cookie.set('xmas_game_muted', Kemist.Audio.muted, 1440, '/');
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
  Kemist.Audio.play('music', 0.4);

});


$(window).blur(function () {
  Choco.isPaused = true;
});
$(window).focus(function () {
  Choco.isPaused = false;
});
