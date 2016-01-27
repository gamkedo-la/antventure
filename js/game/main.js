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

  loadLevel(loadedLevelJSON);

  jumperReset();
  // enemyPlacementFly();
  // enemyPlacementAnt();

  var tempEnemy = new enemySlideAndBounce();

  while(tempEnemy.enemyPlacementAnt(TILE_EVIL_ANT_START, EVIL_BUG_SPEED, 0.0, evilBugPic)) {
    enemyList.push(tempEnemy);
    tempEnemy = new enemySlideAndBounce();
  }
  while(tempEnemy.enemyPlacementAnt(TILE_EVIL_FLY_START, 0.0, EVIL_BUG_SPEED, evilFlyPic)) {
    enemyList.push(tempEnemy);
    tempEnemy = new enemySlideAndBounce();
  }

  sliderReset();
}

function moveEverything() {
  jumperMove();
  cameraFollow();
  //crumblingTracker ();
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "#704000");

  canvasContext.save(); // needed to undo this .translate() used for scroll

  // this next line is like subtracting camPanX and camPanY from every
  // canvasContext draw operation up until we call canvasContext.restore
  // this way we can just draw them at their "actual" position coordinates
  canvasContext.translate(-camPanX,-camPanY);

  canvasContext.drawImage(backgroundPic,0, 0);

  for(var i=0;i<enemyList.length;i++) {
    enemyList[i].enemyCollideAndDraw();
  }

  drawJumper();

  drawOnlyBricksOnScreen();

  canvasContext.restore(); // undoes the .translate() used for cam scroll
  canvasContext.fillStyle = 'white';
  canvasContext.fillText("Health: " + health,10,20);

  if (numberOfKeys > 0) {
    canvasContext.fillText("Keys: " + numberOfKeys,750,20);
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
