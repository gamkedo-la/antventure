var playerPic = document.createElement("img");
playerPic.src = "images/playerAnt.png";
var playerPicWizHat = document.createElement("img");
playerPicWizHat.src = "images/playerAntWizHat.png";

var playerTouchingIndex = -1;
var carryingBlock = false;
var numberOfKeys = 0;

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

function isBlockPickup (tileType) {
  if (whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(jumperX, jumperY + JUMPER_RADIUS)] = TILE_NONE;
    return true;
  }
  if (whichBrickAtPixelCoord(jumperX,jumperY-JUMPER_RADIUS,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(jumperX, jumperY - JUMPER_RADIUS)] = TILE_NONE;
    return true;
  }
  if (whichBrickAtPixelCoord(jumperX + JUMPER_RADIUS,jumperY,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(jumperX + JUMPER_RADIUS, jumperY)] = TILE_NONE;
    return true;
  }
  if (whichBrickAtPixelCoord(jumperX - JUMPER_RADIUS,jumperY,true) == tileType) {
    brickGrid[whichIndexAtPixelCoord(jumperX - JUMPER_RADIUS, jumperY)] = TILE_NONE;
    return true;
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

  if(jumperSpeedY < 0 && whichBrickAtPixelCoord(jumperX,jumperY-0.4*JUMPER_RADIUS,true) != TILE_NONE) {
    jumperY = (Math.floor( jumperY / BRICK_H )) * BRICK_H + 0.4*JUMPER_RADIUS;
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

  if (isBlockPickup(TILE_WIZ_HAT)) {
    wearingWizHat = true;
  }
  if (isBlockPickup(TILE_HEALTH)) {
    if (health < 3) {
      health ++;
    }
  }
  if (isBlockPickup(TILE_KEY)) {
    numberOfKeys ++;
  }

  if (numberOfKeys > 0) {
    isBlockPickup(TILE_GATE)
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

function hitDetection (enemyX, enemyY) {
  if (damagedRecentely > 0) {
    damagedRecentely --;
    return;
  }

  if (enemyX > jumperX - JUMPER_RADIUS && enemyX < jumperX + JUMPER_RADIUS) {
    if (enemyY > jumperY - JUMPER_RADIUS && enemyY < jumperY + JUMPER_RADIUS) {
      health --;
      damagedRecentely = 300;
    }
  }
}

function drawJumper() {
  if (wearingWizHat) {
    drawFacingLeftOption(playerPicWizHat,jumperX,jumperY,lastFacingLeft);
  } else {
    drawFacingLeftOption(playerPic,jumperX,jumperY,lastFacingLeft);
  }
  if(carryingBlock) {
    canvasContext.drawImage(tileMovePic,jumperX - BRICK_W*0.5,
      jumperY - JUMPER_RADIUS-BRICK_H*0.7);
  }
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
