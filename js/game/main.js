var canvas, canvasContext;

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  initInput();

  // these next few lines set up our game logic and render to happen 30 times per second
  var framesPerSecond = 30;
  setInterval(function() {
      moveEverything();
      drawEverything();
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
  jumperMove();
  cameraFollow();
  if (abilityCoolDown > 0) {
    abilityCoolDown --;
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

  drawJumper();

  drawShield();

  canvasContext.restore(); // undoes the .translate() used for cam scroll

  drawHealthHud();


  if (playerState == playerWiz) {
      canvasContext.drawImage(tileWizHatPic,200,-10);

      if (tutorialTimerWiz < 500) {
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("space bar - shoot an ice bolt that freezes enemies",jumperX - camPanX -120, jumperY -20 - camPanY);
        tutorialTimerWiz ++;
      }
  }
  if (playerState == playerArmor) {
      canvasContext.drawImage(tileArmorPic,200,0);

      if (tutorialTimerArmor < 500) {
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("space bar - Shield bash enemies or crumble blocks",jumperX - camPanX -120, jumperY -20 - camPanY);
        tutorialTimerArmor ++;
      }
  }
  if (playerState == playerCloak) {
      canvasContext.drawImage(tileCloakPic,200,0);


      if (tutorialTimerCloak < 500) {
        canvasContext.fillStyle = 'white';
        canvasContext.fillText("space bar - quick dash over gaps or through spikes",jumperX - camPanX -120, jumperY -20 - camPanY);
        tutorialTimerCloak ++;
      }

  }

  canvasContext.fillStyle = 'white';
  canvasContext.fillText(antsRescued + ":",734, 58);
  canvasContext.drawImage(rescuedHudPic,740,0)

  if (numberOfKeys > 0) {
    for (var i = 1; i < numberOfKeys + 1; i++) {
      canvasContext.drawImage(tileKeyPic,720 - (60 * i),00);
    }

  }
  if (damagedRecentely > 20) {
    canvasContext.fillStyle = 'white';
    canvasContext.fillText("Ow",jumperX - camPanX -5, jumperY -20 - camPanY + (damagedRecentely/10  ));
  }

}

function sliderReset() {
  // center slider on screen
  sliderX = canvas.width/2;
  sliderY = canvas.height/2;
}
