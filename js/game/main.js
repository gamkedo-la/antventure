var canvas, canvasContext;

var gameTime = 0;
var timeH = 0;
var timeM = 0;
var timeS = 0;

var gameGoing = false;

function updateTime () {
  gameTime ++;
  if (gameTime == 30) {
    gameTime = 0;
    timeS ++;
  }
  if (timeS == 60) {
    timeS = 0;
    timeM ++;
  }
  if (timeM == 60) {
    timeM = 0;
    timeH ++;
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  initInput();

  // these next few lines set up our game logic and render to happen 30 times per second
  var framesPerSecond = 30;
  setInterval(function() {
      if(gameGoing) {
        moveEverything();
        drawEverything();
        updateTime();
        if (health <= 0) {
          canvasContext.drawImage(deadScreen, 0, 0)
        }
      } else {
        canvasContext.drawImage(startScreen, 0, 0)
      }
    }, 1000/framesPerSecond);

  loadLevelsBesidesFirstOne();

  loadLevel(); // load stage for game's location in the overall world grid
  // loadLevel(loadedLevelJSON); // uncomment to test hand-coded/added stage in levels.js

  jumperReset(); // only calling this for first room player starts in
  // enemyPlacementFly();
  // enemyPlacementAnt();

  sliderReset();
}

function moveEverything() {
  if(health > 0) {
    jumperMove();
  }
  cameraFollow();
  if (abilityCoolDown > 0) {
    abilityCoolDown --;
  }

  if (damagedRecentely > 0) {
    damagedRecentely --;
  }
  if (resetTimer != 0) {
    resetTimer --;
  }
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "#704000");

  canvasContext.save(); // needed to undo this .translate() used for scroll

  // this next line is like subtracting camPanX and camPanY from every
  // canvasContext draw operation up until we call canvasContext.restore
  // this way we can just draw them at their "actual" position coordinates
  canvasContext.translate(-camPanX,-camPanY);

  canvasContext.drawImage(backgroundPic,0, 0);

  drawOnlyBricksOnScreen();

  for(var i=0;i<enemyList.length;i++) {
    enemyList[i].enemyCollideAndDraw();
  }

  drawIceOverlay();

  drawJumper();

  drawShield();

  canvasContext.restore(); // undoes the .translate() used for cam scroll

  drawHealthHud();


  if (playerState == playerWiz) {
      canvasContext.drawImage(tileWizHatPic,200,-10);

      if (tutorialTimerWiz < 200) {
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("space bar - shoot an ice bolt that freezes enemies",jumperX - camPanX -120, jumperY -20 - camPanY);
        tutorialTimerWiz ++;
      }
  }
  if (playerState == playerArmor) {
      canvasContext.drawImage(tileArmorPic,200,0);

      if (tutorialTimerArmor < 200) {
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("space bar - Shield bash enemies or crumble blocks",jumperX - camPanX -120, jumperY -20 - camPanY);
        tutorialTimerArmor ++;
      }
  }
  if (playerState == playerCloak) {
      canvasContext.drawImage(tileCloakPic,200,0);


      if (tutorialTimerCloak < 200) {
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("space bar - quick dash over gaps or through spikes",jumperX - camPanX -120, jumperY -20 - camPanY);
        tutorialTimerCloak ++;
      }
  }

  canvasContext.fillStyle = 'white';
  canvasContext.fillText(antsRescued + ":",734, 58);
  canvasContext.drawImage(rescuedHudPic,740,0)

  if (timerDelay > 0) {
    timerDelay --;
  }

  if (hasMap && tutorialTimerWiz < 200) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Press M to bring up the Map",jumperX - camPanX -60, jumperY -20 - camPanY);
    tutorialTimerWiz ++;
  }
  if (showMap) {
    canvasContext.drawImage(hudMapPic, 0, 0)
    mapDotX = 2 + (88 * roomsOverC)
    mapDotY = 5 + (66 * roomsDownR)
    canvasContext.drawImage(mapDotPic, mapDotX, mapDotY)
  }

  if (showTimer == true) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText(timeH + ":" + timeM + ":" + timeS ,400, 40);
  }

  if (numberOfKeys > 0) {
    var keyArtDim = tileKeyPic.height;
    for (var i = 1; i < numberOfKeys + 1; i++) {
      canvasContext.drawImage(tileKeyPic,
        0, 0, // don't animtate, just set top-left corner of tile art
        keyArtDim,keyArtDim, // get full tile size from source
        720 - (60 * i),0, // x,y top-left corner for image destination
        keyArtDim, keyArtDim);
    }

  }

  if (damagedRecentely > 0) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Ow",jumperX - camPanX -5, jumperY - camPanY + (damagedRecentely/5  ));
  }

}

function sliderReset() {
  // center slider on screen
  sliderX = canvas.width/2;
  sliderY = canvas.height/2;
}
