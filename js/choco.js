/**
 * Choco Fly Game
 * 
 * @version 1.0.0
 * @author Kemist
 */

var Choco = Choco || {};

Choco.screen = 'intro';

Choco.pausing = 0;
Choco.gameSpeed = 4;
Choco.playerSpeed = 300;
Choco.distance = 0;
Choco.trailCounter = 0;
Choco.dieCounter = 0;
Choco.boundThreshold = 100;
Choco.boundTrialThreshold = 5000;

Choco.lastDir = null;
Choco.died = false;
Choco.isPaused = false;
Choco.screenHandlerCalled = false;
Choco.chooseAnimFinished = false;
Choco.animFrameRequested = false;
Choco.touchLeft = false;
Choco.touchRight = false;

Choco.skipReady = false;
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
Choco.loader = null;

Choco.game = null;

Choco.imageResources = [
  "images/bg_day.png", "images/clouds.png", "images/grass_day.png", "images/grass_night.png", "images/highscore.png",
  "images/intro.png", "images/intro_background.png", "images/logos.png", "images/Museo900.png", "images/pickups.png",
  "images/planes.png", "images/terrain.png", "images/Toonish1.png", "images/Toonish2.png", "images/Toonish3.png",
  "images/Toonish4.png", "images/totem.png", "images/toucanFrames.png", "images/trees.png", "images/tutorial.png",
  "images/uielements.png", "images/bg_night.png", "images/start_hazisweets.png"
]
        ;

Choco.soundResources = [
//  {name:'music', url:'sounds/green_day_basket_case.mp3', loop: true, polyphony: false, volume: 0.2}

];



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
        Choco.switchScreenTimer = setTimeout(Choco.initSwitchScreenTimer, 20000);
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
        Choco.switchScreenTimer = setTimeout(Choco.initSwitchScreenTimer, 20000);
      }
      Choco.getHighScores(function () {
        Choco.drawHighScores();
      });
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
      $('#screen-highscore .hill-back, #highscore-left, #highscore-right, #highscore-table, #highscore-logo, #highscore-title, #screen-highscore .falling-snow').hide();
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
  Choco.switchScreenTimer = setTimeout(Choco.initSwitchScreenTimer, 20000);
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
      width: 1024,
      height: 768,
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


};



/**
 * Creates a random object
 * 
 * @param {Array} pos
 * @param {string} type
 * @param {Array} items
 */
Choco.createRandomObject = function (pos, type, container) {
  var items = Choco[type + 's'];
  var index = Kemist.getRandomInt(1, Object.keys(items).length);
  var item = items[index];

  var obj = new Kemist.Entity(
          pos,
          new Kemist.Sprite(item.img, [0, 0], [item.size[0], item.size[1]]),
          {type: type}
  );

  if (typeof container === 'undefined') {
    Choco[type + '_objects'].push(obj);
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
          [470, 200],
          new Kemist.Sprite('images/' + Choco.character + '_player.png', [0, 0], [87, 105]),
          {type: 'player'}
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
    Choco.player.pos[1] = 200;
  }


  if (Choco.debug) {
    $('#debug').html('Distance: ' + Choco.distance + '/' + Choco.levelDistances[Choco.game.level] + ', stones: ' + Choco.stone_objects.length + ', gifts:' + Choco.gift_objects.length + ', background objects: ' + Choco.background_objects.length);
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
Choco.renderGame = function () {
//    Choco.game.renderEntities(Choco.stone_objects);
  // Render the player if the game isn't over
  if (!Choco.game.isGameOver) {
    Choco.game.renderEntity(Choco.player);
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
        if (typeof callback === 'function'){
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
  if (Choco.sessionId===null){
    return;
  }
  $.ajax({
    type: 'GET',
    url: 'http://rasterstudio.hu/api/chocofly.get_highscores/'+escape(Choco.sessionId),
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
      Choco.highScores = data;
      callback();
    }

  });
};


/**
 * Store new high score
 */
Choco.storeHighScore = function (name) {
  var now = new Date();
  var year = now.getYear() + 1900;
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var timeStamp = year + '' + (month < 10 ? '0' + month : month) + '' + (day < 10 ? '0' + day : day);
  var raw_hash = CryptoJS.MD5(timeStamp + '|RaStErXmAs|' + Choco.game.level + '|' + Choco.game.score);
  var hash = raw_hash.toString(CryptoJS.enc.Hex);

  $.ajax({
    type: 'POST',
    url: 'http://rasterstudio.hu/api/xmas_highscore',
    data: 'hash=' + escape(hash) + '&name=' + name + '&score=' + Choco.game.score + '&level=' + Choco.game.level + '&character=' + escape(Choco.character),
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
  return;
  var row;
  var rank = 1;
  var score = (Choco.game ? Choco.game.score : 0);
  $('#rank1, #rank2, #rank3, #rank4').removeClass('reached');
  for (var i = 0; i < Choco.highScores.length; i++) {
    if (rank > 4) {
      break;
    }
    if (!Choco.highScoreReached && score > Choco.highScores[i].score) {
      Choco.highScoreReached = true;
      row = $('<div class="player-name"><input type="text" id="new-player-name" /></div><div class="score ' + Choco.character + '">' + score + '</div>');
      $('#hs' + rank).html('').append(row);
      $('#rank' + rank).addClass('reached');
      rank++;
    }
    row = $('<div class="player-name">' + Choco.highScores[i].name + '</div><div class="score ' + Choco.highScores[i].character + '" title="' + Choco.highScores[i].character.toUpperCase() + '">' + Choco.highScores[i].score + '</div>');
    $('#hs' + rank).html('').append(row);
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
  $('#start-button').click(function () {
    Choco.switchScreen('choose');
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
