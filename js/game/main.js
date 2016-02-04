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

  if (numberOfKeys > 0) {
    for (var i = 0; i < numberOfKeys + 1; i++) {
      canvasContext.drawImage(tileKeyPic,800 - (60 * i),-8);
    }

  }
  if (damagedRecentely > 20) {
    canvasContext.fillStyle = 'red';
    canvasContext.fillText("-1",jumperX - camPanX -5, jumperY -20 - camPanY + (damagedRecentely/10  ));
  }

}

function sliderReset() {
  // center slider on screen
  sliderX = canvas.width/2;
  sliderY = canvas.height/2;
}
