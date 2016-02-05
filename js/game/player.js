var playerPic = document.createElement("img");
playerPic.src = "images/playerAnt.png";
var playerPicWizHat = document.createElement("img");
playerPicWizHat.src = "images/playerAntWizHat.png";
var playerPicArmor = document.createElement("img");
playerPicArmor.src = "images/playerAntArmor.png";
var playerPicCloak = document.createElement("img");
playerPicCloak.src = "images/playerAntCloak.png";
var iceBoltPic = document.createElement("img");
iceBoltPic.src = "images/iceBolt.png";
var shieldPic = document.createElement("img");
shieldPic.src = "images/shield.png";

var hudHealth1Pic = document.createElement("img");
hudHealth1Pic.src = "images/hudHealth1.png";
var hudHealth2Pic = document.createElement("img");
hudHealth2Pic.src = "images/hudHealth2.png";
var hudHealth3Pic = document.createElement("img");
hudHealth3Pic.src = "images/hudHealth3.png";
var hudHealth0Pic = document.createElement("img");
hudHealth0Pic.src = "images/hudHealth0.png";

var playerTouchingIndex = -1;
var carryingBlock = false;
var numberOfKeys = 0;
var antsRescued = 0;

var iceBolt = false;
var iceBoltX = 0;
var iceBoltY = 0;
var iceBoltSpeed = 0;
var iceFacingLeft = false;

var isBashing = false;
var bashTimer = 10;
var shieldFacingLeft = false;
var shieldX = 0;
var shieldY = 0;


var camPanX = 0.0;
var camPanY = 0.0;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_X = 150;
const PLAYER_DIST_FROM_CENTER_BEFORE_CAMERA_PAN_Y = 100;

const GROUND_FRICTION = 0.8;
const AIR_RESISTANCE = 0.8;
const RUN_SPEED = 4.0;
const JUMP_POWER = 13.0;
const GRAVITY = 0.6;

var jumperX = 75, jumperY = 75;
var jumperSpeedX = 0, jumperSpeedY = 0;
var jumperOnGround = false;
var recentJump = 0;
var JUMPER_RADIUS = 16;
var health = 3;
var damagedRecentely = 0;

var playerState = 0

const playerNormal = 0
const playerWiz = 1
const playerArmor = 2
const playerCloak = 3

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

function drawShield () {
  if (isBashing) {
    bashTimer --;
    if (bashTimer <0){
      isBashing = false;
      bashTimer = 10;
    }
    if (shieldFacingLeft) {
      shieldX -= 3;
    } else {
      shieldX += 3;
    }
  } else {
    shieldX = jumperX
    shieldY = jumperY
  }

  if (playerState == playerArmor) {
    if (shieldFacingLeft) {
      drawFacingLeftOption(shieldPic,shieldX -5,shieldY + JUMPER_RADIUS, shieldFacingLeft);
    } else {
      drawFacingLeftOption(shieldPic,shieldX +5,shieldY + JUMPER_RADIUS, shieldFacingLeft);
    }

  }
}

function drawHealthHud() {
  if (health == 1) {
    canvasContext.drawImage(hudHealth1Pic, 0,0);
  }
  if (health == 2) {
    canvasContext.drawImage(hudHealth2Pic,0,0);
  }
  if (health == 3) {
    canvasContext.drawImage(hudHealth3Pic,0,0);
  }
  if (health < 1) {
    canvasContext.drawImage(hudHealth0Pic, 0,0)
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

  if(jumperSpeedY < 0 && isTileHereSolid(jumperX,jumperY-0.4*JUMPER_RADIUS)) {
    jumperY = (Math.floor( jumperY / BRICK_H )) * BRICK_H + 0.4*JUMPER_RADIUS;
    jumperSpeedY = 0.0;
  }

  if(recentJump>0 ) {
    recentJump--;
    jumperOnGround = false;
  } else if(isTileHereSolid(jumperX,jumperY+JUMPER_RADIUS)) {
    jumperY = (1+Math.floor( jumperY / BRICK_H )) * BRICK_H - JUMPER_RADIUS;
    jumperOnGround = true;
    jumperSpeedY = 0;
  } else if(isTileHereSolid(jumperX,jumperY+JUMPER_RADIUS+2) == false) {
    jumperOnGround = false;
  }

  if(whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) == TILE_SPIKES) {
    health --;
  }

  if(whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) == TILE_CRUMBLE) {
    brickGrid[whichIndexAtPixelCoord(jumperX, jumperY + JUMPER_RADIUS)] = -30;
  }

  if (isBlockPickup(TILE_WIZ_HAT)) {
    playerState = playerWiz;
  }
  if (isBlockPickup(TILE_ARMOR)) {
    playerState = playerArmor;
  }
  if (isBlockPickup(TILE_CLOAK)) {
    playerState = playerCloak;
  }
  if (isBlockPickup(TILE_ARMOR)) {
    playerState = playerArmor;
  }
  if (isBlockPickup(TILE_CLOAK)) {
    playerState = playerCloak;
  }
  if (isBlockPickup(TILE_FRIENDLY_ANT)) {
    antsRescued ++;
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
    if (isBlockPickup(TILE_DOOR)) {
        numberOfKeys --;
    }
  }

  if(jumperSpeedX < 0 && isTileHereSolid(jumperX-JUMPER_RADIUS,jumperY)) {
    jumperX = (Math.floor( jumperX / BRICK_W )) * BRICK_W + JUMPER_RADIUS;
  }
  if(jumperSpeedX > 0 && isTileHereSolid(jumperX+JUMPER_RADIUS,jumperY)) {
    jumperX = (1+Math.floor( jumperX / BRICK_W )) * BRICK_W - JUMPER_RADIUS;
  }

  jumperX += jumperSpeedX; // move the jumper based on its current horizontal speed
  jumperY += jumperSpeedY; // same as above, but for vertical

  checkIfChangingRooms();
}

function checkIfChangingRooms() {
  // saving these in case we need to reverse due to non-existing level
  var wasROC = roomsOverC;
  var wasRDR = roomsDownR;
  var wasJX = jumperX;
  var wasJY = jumperY;

  var tryToReloadLevel = false;
  // edge of world checking to change rooms:
  if(jumperX < BRICK_W/2) {
    roomsOverC--;
    jumperX = (BRICK_COLS-1)*BRICK_W;
    tryToReloadLevel = true;
  }
  if(jumperX > (BRICK_COLS-1)*BRICK_W+BRICK_W/2) {
    roomsOverC++;
    jumperX = BRICK_W;
    tryToReloadLevel = true;
  }
  if(jumperY < BRICK_H/4 && jumperSpeedY<0) {
    roomsDownR--;
    jumperY = (BRICK_ROWS-1)*BRICK_H-BRICK_H/2;
    tryToReloadLevel = true;
  }
  if(jumperY > (BRICK_ROWS-1)*BRICK_H+BRICK_H/2 && jumperSpeedY>0) {
    roomsDownR++;
    jumperY = BRICK_H/2;
    tryToReloadLevel = true;
  }
  if( tryToReloadLevel ) {
    if( loadLevel() == false ) {  // didn't exist, womp womp, undo shift
     roomsOverC = wasROC;
     roomsDownR = wasRDR;
     jumperX = wasJX;
     jumperY = wasJY;
    }
  }
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

function iceDetection (enemyX, enemyY) {
  if (whichBrickAtPixelCoord(iceBoltX, iceBoltY, false) != TILE_NONE &&
      whichBrickAtPixelCoord(iceBoltX, iceBoltY, false) != TILE_PORTAL) {
    iceBolt = false;
  }
  if (enemyX > iceBoltX - 20 && enemyX < iceBoltX + 20) {
    if (enemyY > iceBoltY - 20 && enemyY < iceBoltY + 20) {
      console.log("ding")
      brickGrid[whichIndexAtPixelCoord(iceBoltX, iceBoltY)] = TILE_ICE;
    }
  }
}

function hitDetection (enemyX, enemyY) {
  if (damagedRecentely > 0) {
    damagedRecentely --;
    return;
  }

  if (enemyX > jumperX - JUMPER_RADIUS && enemyX < jumperX + JUMPER_RADIUS) {
    if (enemyY > jumperY - JUMPER_RADIUS && enemyY < jumperY + JUMPER_RADIUS) {
      if (playerState != playerArmor) {
          health --;
      }
      playerState = playerNormal
      damagedRecentely = 300;
    }
  }
}



function drawJumper() {
  if(iceBolt == true) {
    drawFacingLeftOption(iceBoltPic,iceBoltX,iceBoltY, iceFacingLeft);
    iceBoltX += iceBoltSpeed;
  }

  if (playerState == playerNormal) {
    drawFacingLeftOption(playerPic,jumperX,jumperY,lastFacingLeft);
  }
  if (playerState == playerWiz) {
    drawFacingLeftOption(playerPicWizHat,jumperX,jumperY,lastFacingLeft);
  }
  if (playerState == playerArmor) {
    drawFacingLeftOption(playerPicArmor,jumperX,jumperY,lastFacingLeft);
  }
  if (playerState == playerCloak) {
    drawFacingLeftOption(playerPicCloak,jumperX,jumperY,lastFacingLeft);
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
