var playerPic = document.createElement("img");
playerPic.src = "images/playerAnt.png";
var playerPicWizHat = document.createElement("img");
playerPicWizHat.src = "images/playerAntWizHat.png";

var evilBugPic = document.createElement("img");
evilBugPic.src = "images/evilBug.png";
var evilFlyPic = document.createElement("img");
evilFlyPic.src = "images/evilFly.png";

var tilePic = document.createElement("img");
tilePic.src = "images/Tile.png";
var tileMovePic = document.createElement("img");
tileMovePic.src = "images/TileMove.png";
var tilePrizePic = document.createElement("img");
tilePrizePic.src = "images/TilePrize.png";
var tileCrumblePic = document.createElement("img");
tileCrumblePic.src = "images/TileCrumble.png";
var tileWizHatPic = document.createElement("img");
tileWizHatPic.src = "images/WizHat.png";

var playerTouchingIndex = -1;
var carryingBlock = false;
const DURATION = 20;
var crumbleTimer = DURATION;

var camPanX = 0.0;
var camPanY = 0.0;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X = 150;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y = 100;


const GROUND_FRICTION = 0.8;
const AIR_RESISTANCE = 0.95;
const RUN_SPEED = 4.0;
const JUMP_POWER = 14.5;
const GRAVITY = 0.6;

var jumperX = 75, jumperY = 75;
var jumperSpeedX = 0, jumperSpeedY = 0;
var jumperOnGround = false;
var recentJump = 0;
var JUMPER_RADIUS = 16;
var health = 3;
var damagedRecentely = 0;
var wearingWizHat = false;

var evilBugX = 75, evilBugY = 75;
var evilBugLastFacingLeft = false;
const EVIL_BUG_SPEED = 1.0;

var evilFlyX = 75, evilFlyY = 75;
var evilFlyLastMovingUp = false;
const EVIL_FLY_SPEED = 1.0;



const KEY_LEFT_ARROW = 37;
const KEY_A = 65;
const KEY_UP_ARROW = 38;
const KEY_W = 87;
const KEY_RIGHT_ARROW = 39;
const KEY_D = 68;
const KEY_DOWN_ARROW = 40;
const KEY_S = 83;


var holdLeft = false;
var holdRight = false;
var lastFacingLeft = false;

function initInput() {
  document.addEventListener("keydown", keyPressed);
  document.addEventListener("keyup", keyReleased);
}

function setKeyHoldState(thisKey, setTo) {
  if(thisKey == KEY_LEFT_ARROW || thisKey == KEY_A) {
    holdLeft = setTo;
    if(setTo) {
      lastFacingLeft = true;
    }
  }
  if(thisKey == KEY_RIGHT_ARROW || thisKey == KEY_D) {
    holdRight = setTo;
    if(setTo) {
      lastFacingLeft = false;
    }
  }
  if(setTo) {
    if(thisKey == KEY_UP_ARROW || thisKey == KEY_W) {
      if(jumperOnGround) {
        jumperSpeedY = -JUMP_POWER;
        recentJump = 5; // giving a few frames to escape groud
      }
    }
    if(thisKey == KEY_DOWN_ARROW || thisKey == KEY_S) {
      if(carryingBlock == false && playerTouchingIndex != -1) {
        brickGrid[playerTouchingIndex] = TILE_NONE;
        jumperSpeedY = -JUMP_POWER * 0.3;
        carryingBlock = true;
      }
      else if(carryingBlock == true && jumperOnGround &&
      (whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) != TILE_CRUMBLE)) {

        playerTouchingIndex = -1;
        var indexOfPlayer = whichIndexAtPixelCoord(jumperX,jumperY,true);
        var indexToMoveTo = indexOfPlayer-BRICK_COLS;
        var isRoomForPlayerAbove = (indexToMoveTo != -1 &&
                brickGrid[indexToMoveTo] == TILE_NONE);
        if(indexOfPlayer != -1 && isRoomForPlayerAbove) {
          brickGrid[indexOfPlayer] = TILE_ROCK;
          jumperY=Math.floor(indexOfPlayer/BRICK_COLS)*BRICK_H-JUMPER_RADIUS;
          carryingBlock = false;
        }
      }
    }
  }
}

function keyPressed(evt) {
  setKeyHoldState(evt.keyCode, true);
  evt.preventDefault(); // without this, arrow keys scroll the browser!
}

function keyReleased(evt) {
  setKeyHoldState(evt.keyCode, false);
}

const BRICK_W = 60;
const BRICK_H = 60;
const BRICK_GAP = 1;
const BRICK_COLS = 20;
const BRICK_ROWS = 15;
const TILE_NONE = 0;
const TILE_DIRT = 1;
const TILE_ROCK = 2;
const TILE_PLAYERSTART = 3;
const TILE_PRIZE = 4;
const TILE_EVIL_ANT_START = 5;
const TILE_EVIL_FLY_START = 6;
const TILE_CRUMBLE = 7;
const TILE_WIZ_HAT = 8;
var brickGrid =
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
      1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      1, 0, 0, 0, 0, 1, 7, 1, 1, 1, 1, 7, 7, 7, 1, 1, 0, 0, 0, 1,
      1, 0, 0, 0, 1, 1, 8, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 2, 1,
      1, 0, 0, 1, 1, 0, 7, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1,
      1, 0, 4, 1, 0, 0, 1, 1, 1, 1, 7, 0, 0, 1, 0, 1, 0, 0, 0, 1,
      1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 2, 1, 1, 0, 1,
      1, 0, 0, 1, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
      1, 3, 6, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
      1, 1, 0, 0, 5, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];;

var canvas, canvasContext;

function brickTileToIndex(tileCol, tileRow) {
  return (tileCol + BRICK_COLS*tileRow);
}

function whichBrickAtTileCoord(brickTileCol, brickTileRow) {
  var brickIndex = brickTileToIndex(brickTileCol, brickTileRow);
  return brickGrid[brickIndex];
}

function whichIndexAtPixelCoord(hitPixelX, hitPixelY, forPlayer) {
  var tileCol = hitPixelX / BRICK_W;
  var tileRow = hitPixelY / BRICK_H;

  // using Math.floor to round down to the nearest whole number
  tileCol = Math.floor( tileCol );
  tileRow = Math.floor( tileRow );

  // first check whether the jumper is within any part of the brick wall
  if(tileCol < 0 || tileCol >= BRICK_COLS ||
     tileRow < 0 || tileRow >= BRICK_ROWS) {
     return -1;
  }

  var brickIndex = brickTileToIndex(tileCol, tileRow);
  return brickIndex;
}

function whichBrickAtPixelCoord(hitPixelX, hitPixelY, forPlayer) {
  var index = whichIndexAtPixelCoord(hitPixelX, hitPixelY);
  if(index < 0) {
     return TILE_DIRT;
  }

  if(forPlayer && brickGrid[index] == TILE_ROCK) {
    playerTouchingIndex = index;
  }
  return brickGrid[index];
}


function crumblingProcess() {
  crumbleTimer--;

  if (crumbleTimer < 0) {
    brickGrid[whichIndexAtPixelCoord(jumperX, jumperY + JUMPER_RADIUS)] = TILE_NONE;
    crumbleTimer = DURATION;

  }
}

function jumperMove() {
 if(jumperOnGround) {
    jumperSpeedX *= GROUND_FRICTION;
  } else {
    jumperSpeedX *= AIR_RESISTANCE;
    jumperSpeedY += GRAVITY;
    if(jumperSpeedY > JUMPER_RADIUS) { // cheap test to ensure can't fall through floor
      jumperSpeedY = JUMPER_RADIUS;
    }
  }

  if(holdLeft) {
    jumperSpeedX = -RUN_SPEED;
  }
  if(holdRight) {
    jumperSpeedX = RUN_SPEED;
  }

  playerTouchingIndex = -1;

  if(jumperSpeedY < 0 && whichBrickAtPixelCoord(jumperX,jumperY-JUMPER_RADIUS,true) != TILE_NONE) {
    jumperY = (Math.floor( jumperY / BRICK_H )) * BRICK_H + JUMPER_RADIUS;
    jumperSpeedY = 0.0;
  }

  if(recentJump>0 ) {
    if (whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) == TILE_CRUMBLE) {
      brickGrid[whichIndexAtPixelCoord(jumperX, jumperY + JUMPER_RADIUS)] = TILE_NONE;
    }
    recentJump--;
    jumperOnGround = false;
  } else if(whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) != TILE_NONE) {
    jumperY = (1+Math.floor( jumperY / BRICK_H )) * BRICK_H - JUMPER_RADIUS;
    jumperOnGround = true;
    jumperSpeedY = 0;
  } else if(whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS+2,true) == TILE_NONE) {
    jumperOnGround = false;
  }

  if(whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) == TILE_CRUMBLE) {
    crumblingProcess()
  } else {
    crumbleTimer = DURATION;
  }

  if (whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) == TILE_WIZ_HAT) {
    brickGrid[whichIndexAtPixelCoord(jumperX, jumperY + JUMPER_RADIUS)] = TILE_NONE;
    wearingWizHat = true;
  }
  if (whichBrickAtPixelCoord(jumperX,jumperY-JUMPER_RADIUS,true) == TILE_WIZ_HAT) {
    brickGrid[whichIndexAtPixelCoord(jumperX, jumperY - JUMPER_RADIUS)] = TILE_NONE;
    wearingWizHat = true;
  }
  if (whichBrickAtPixelCoord(jumperX + JUMPER_RADIUS,jumperY,true) == TILE_WIZ_HAT) {
    brickGrid[whichIndexAtPixelCoord(jumperX + JUMPER_RADIUS, jumperY)] = TILE_NONE;
    wearingWizHat = true;
  }
  if (whichBrickAtPixelCoord(jumperX - JUMPER_RADIUS,jumperY,true) == TILE_WIZ_HAT) {
    brickGrid[whichIndexAtPixelCoord(jumperX - JUMPER_RADIUS, jumperY)] = TILE_NONE;
    wearingWizHat = true;
  }


  if(jumperSpeedX < 0 && whichBrickAtPixelCoord(jumperX-JUMPER_RADIUS,jumperY,true) != TILE_NONE) {
    jumperX = (Math.floor( jumperX / BRICK_W )) * BRICK_W + JUMPER_RADIUS;
  }
  if(jumperSpeedX > 0 && whichBrickAtPixelCoord(jumperX+JUMPER_RADIUS,jumperY,true) != TILE_NONE) {
    jumperX = (1+Math.floor( jumperX / BRICK_W )) * BRICK_W - JUMPER_RADIUS;
  }

  jumperX += jumperSpeedX; // move the jumper based on its current horizontal speed
  jumperY += jumperSpeedY; // same as above, but for vertical
}

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
  enemyPlacementFly();
  enemyPlacementAnt();
  sliderReset();
}

function jumperReset() {
  // center jumper on start tile, but as fallback center in game world:
  jumperX = canvas.width/2;
  jumperY = canvas.height/2;

  for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
    for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

      if( whichBrickAtTileCoord(eachCol, eachRow) == TILE_PLAYERSTART) {
        jumperX = eachCol * BRICK_W + BRICK_W/2;
        jumperY = eachRow * BRICK_H + BRICK_H/2;
        var changeAt = brickTileToIndex(eachCol, eachRow);
        brickGrid[changeAt] = TILE_NONE; // remove tile where player started
      } // end of player start found
    } // end of row
  } // end of col
}

function enemyPlacementAnt() {
  for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
    for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

      if( whichBrickAtTileCoord(eachCol, eachRow) == TILE_EVIL_ANT_START) {
        evilBugX = eachCol * BRICK_W + BRICK_W/2;
        evilBugY = (eachRow * BRICK_H + BRICK_H/2) + 14;
        var changeAt = brickTileToIndex(eachCol, eachRow);
        brickGrid[changeAt] = TILE_NONE; // remove tile where player started
      } // end of player start found
    } // end of row
  } // end of col
  evilBugLastFacingLeft = false;
} // end of function


function enemyPlacementFly() {
  for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
    for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

      if( whichBrickAtTileCoord(eachCol, eachRow) == TILE_EVIL_FLY_START) {
        evilFlyX = eachCol * BRICK_W + BRICK_W/2;
        evilFlyY = eachRow * BRICK_H + BRICK_H/2;
        var changeAt = brickTileToIndex(eachCol, eachRow);
        brickGrid[changeAt] = TILE_NONE; // remove tile where player started
      } // end of player start found
    } // end of row
  } // end of col
  evilBugLastFacingLeft = false;
} // end of function

function moveEverything() {
  jumperMove();
  cameraFollow();
}

function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

function drawOnlyBricksOnScreen() {
  var cameraLeftMostCol = Math.floor(camPanX / BRICK_W);
  var cameraTopMostRow = Math.floor(camPanY / BRICK_H);

  // how many columns and rows of tiles fit on one screenful of area?
  var colsThatFitOnScreen = Math.floor(canvas.width / BRICK_W);
  var rowsThatFitOnScreen = Math.floor(canvas.height / BRICK_H);

  // finding the rightmost and bottommost tiles to draw.
  // the +1 and + 2 on each pushes the new tile popping in off visible area
  // +2 for columns since BRICK_W doesn't divide evenly into canvas.width
  var cameraRightMostCol = cameraLeftMostCol + colsThatFitOnScreen + 2;
  var cameraBottomMostRow = cameraTopMostRow + rowsThatFitOnScreen + 1;

  var usePic;
  for(var eachCol=cameraLeftMostCol; eachCol<cameraRightMostCol; eachCol++) {
    for(var eachRow=cameraTopMostRow; eachRow<cameraBottomMostRow; eachRow++) {

      switch( whichBrickAtTileCoord(eachCol, eachRow) ) {
        case TILE_NONE:
          continue;
        case TILE_DIRT:
          usePic = tilePic;
          break;
        case TILE_ROCK:
          usePic = tileMovePic;
          break;
        case TILE_PRIZE:
          usePic = tilePrizePic;
          break;
        case TILE_CRUMBLE:
          usePic = tileCrumblePic;
          break;
        case TILE_WIZ_HAT:
          usePic = tileWizHatPic;
          break;
      } // end of whichBrickAtTileCoord()
      var brickLeftEdgeX = eachCol * BRICK_W;
      var brickTopEdgeY = eachRow * BRICK_H;

      canvasContext.drawImage(usePic,brickLeftEdgeX, brickTopEdgeY);

    } // end of for eachRow
  } // end of for eachCol
} // end of drawBricks()

// warning: currently is written assuming JUMPER_RADIUS is same for all chars
function drawFacingLeftOption(image,atX,atY,ifFlipped) {
  if(ifFlipped) {
    canvasContext.save();
    canvasContext.translate(atX, atY);
    canvasContext.scale(-1, 1);
    canvasContext.drawImage(image,-JUMPER_RADIUS,-JUMPER_RADIUS);
    canvasContext.restore();
  } else {
    canvasContext.drawImage(image,atX - JUMPER_RADIUS, atY - JUMPER_RADIUS);
  }
}

function hitDetection (enemyX, enemyY) {
  if (damagedRecentely > 0) {
    damagedRecentely --;
    return;
  }

  if (enemyX > jumperX - JUMPER_RADIUS && enemyX < jumperX + JUMPER_RADIUS) {
    if (enemyY > jumperY - JUMPER_RADIUS && enemyY < jumperY + JUMPER_RADIUS) {
      health --;
      damagedRecentely = 100;
    }
  }
}

function drawEverything() {
  colorRect(0, 0, canvas.width, canvas.height, "#704000");

  canvasContext.save(); // needed to undo this .translate() used for scroll

  // this next line is like subtracting camPanX and camPanY from every
  // canvasContext draw operation up until we call canvasContext.restore
  // this way we can just draw them at their "actual" position coordinates
  canvasContext.translate(-camPanX,-camPanY);

  // movement for the one hard coded enemy red ant
  if(evilBugLastFacingLeft) {
    evilBugX -= EVIL_BUG_SPEED;
    if(whichBrickAtPixelCoord(evilBugX-JUMPER_RADIUS,evilBugY,false) != TILE_NONE) {
      evilBugLastFacingLeft = !evilBugLastFacingLeft;
      evilBugX += EVIL_BUG_SPEED;
    }
  } else {
    evilBugX += EVIL_BUG_SPEED;
    if(whichBrickAtPixelCoord(evilBugX+JUMPER_RADIUS,evilBugY,false) != TILE_NONE) {
      evilBugLastFacingLeft = !evilBugLastFacingLeft;
      evilBugX -= EVIL_BUG_SPEED;
    }
  }

  hitDetection (evilBugX, evilBugY)

  // movement for the one hard coded enemy fly
  if(evilFlyLastMovingUp) {
    evilFlyY -= EVIL_FLY_SPEED;
    if(whichBrickAtPixelCoord(evilFlyX,evilFlyY-JUMPER_RADIUS,false) != TILE_NONE) {
      evilFlyLastMovingUp = !evilFlyLastMovingUp;
      evilFlyY += EVIL_FLY_SPEED;
    }
  } else {
    evilFlyY += EVIL_FLY_SPEED;
    if(whichBrickAtPixelCoord(evilFlyX,evilFlyY+JUMPER_RADIUS,false) != TILE_NONE) {
      evilFlyLastMovingUp = !evilFlyLastMovingUp;
      evilFlyY -= EVIL_FLY_SPEED;
    }
  }
  hitDetection (evilFlyX, evilFlyY)


  drawFacingLeftOption(evilBugPic,evilBugX,evilBugY,evilBugLastFacingLeft);
  drawFacingLeftOption(evilFlyPic,evilFlyX,evilFlyY, evilFlyX);

  if (wearingWizHat) {
    drawFacingLeftOption(playerPicWizHat,jumperX,jumperY,lastFacingLeft);
  } else {
    drawFacingLeftOption(playerPic,jumperX,jumperY,lastFacingLeft);
  }


  if(carryingBlock) {
    canvasContext.drawImage(tileMovePic,jumperX - BRICK_W*0.5,
      jumperY - JUMPER_RADIUS-BRICK_H*0.7);
  }

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

function instantCamFollow() {
  camPanX = jumperX - canvas.width/2;
  camPanY = jumperY - canvas.height/2;
}

function cameraFollow() {
  var cameraFocusCenterX = camPanX + canvas.width/2;
  var cameraFocusCenterY = camPanY + canvas.height/2;

  var playerDistFromCameraFocusX = Math.abs(jumperX-cameraFocusCenterX);
  var playerDistFromCameraFocusY = Math.abs(jumperY-cameraFocusCenterY);

  if(playerDistFromCameraFocusX > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X) {
    if(cameraFocusCenterX < jumperX)  {
      camPanX += RUN_SPEED;
    } else {
      camPanX -= RUN_SPEED;
    }
  }
  if(playerDistFromCameraFocusY > PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y) {
    if(cameraFocusCenterY < jumperY)  {
      camPanY += RUN_SPEED;
    } else {
      camPanY -= RUN_SPEED;
    }
  }

  instantCamFollow();

  if(camPanX < 0) {
    camPanX = 0;
  }
  if(camPanY < 0) {
    camPanY = 0;
  }
  var maxPanRight = BRICK_COLS * BRICK_W - canvas.width;
  var maxPanTop = BRICK_ROWS * BRICK_H - canvas.height;
  if(camPanX > maxPanRight) {
    camPanX = maxPanRight;
  }
  if(camPanY > maxPanTop) {
    camPanY = maxPanTop;
  }
}