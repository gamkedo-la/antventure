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

  jumperReset();
  // enemyPlacementFly();
  // enemyPlacementAnt();

  var tempEnemy = new enemySlideAndBounce();

  while(tempEnemy.enemyPlacementAnt(TILE_EVIL_ANT_START, EVIL_BUG_SPEED, 0.0, evilBugPic)) {
    console.log("ant placed");
    enemyList.push(tempEnemy);
    tempEnemy = new enemySlideAndBounce();
  }
  while(tempEnemy.enemyPlacementAnt(TILE_EVIL_FLY_START, 0.0, EVIL_BUG_SPEED, evilFlyPic)) {
    console.log("fly placed");
    enemyList.push(tempEnemy);
    tempEnemy = new enemySlideAndBounce();
  }

  sliderReset();
}

function moveEverything() {
  damagedRecentely --;
  jumperMove();
  cameraFollow();
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "#704000");

  canvasContext.drawImage(backgroundPic,0, 0);

  canvasContext.save(); // needed to undo this .translate() used for scroll

  // this next line is like subtracting camPanX and camPanY from every
  // canvasContext draw operation up until we call canvasContext.restore
  // this way we can just draw them at their "actual" position coordinates
  canvasContext.translate(-camPanX,-camPanY);

  for(var i=0;i<enemyList.length;i++) {
    enemyList[i].enemyCollideAndDraw();
  }

  drawJumper();

  drawOnlyBricksOnScreen();

  canvasContext.restore(); // undoes the .translate() used for cam scroll
  canvasContext.fillStyle = 'white';
  canvasContext.fillText("Health: " + health,10,20);

}

function sliderReset() {
  // center slider on screen
  sliderX = canvas.width/2;
  sliderY = canvas.height/2;
}
