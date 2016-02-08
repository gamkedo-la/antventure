var playerPic = document.createElement("img");
playerPic.src = "images/playerAnt-sheet.png";
var playerPicWizHat = document.createElement("img");
playerPicWizHat.src = "images/playerAntWizHat.png";
var playerPicArmor = document.createElement("img");
playerPicArmor.src = "images/playerAntArmor.png";
var playerPicCloak = document.createElement("img");
playerPicCloak.src = "images/playerAntCloak.png";
var iceBoltPic = document.createElement("img");
iceBoltPic.src = "images/iceBoltAn.png";
ICE_FRAMES = 4
var shieldPic = document.createElement("img");
shieldPic.src = "images/shield.png";

const ANT_RUN_FRAMES = 4;

var hudHealth1Pic = document.createElement("img");
hudHealth1Pic.src = "images/hudHealth1.png";
var hudHealth2Pic = document.createElement("img");
hudHealth2Pic.src = "images/hudHealth2.png";
var hudHealth3Pic = document.createElement("img");
hudHealth3Pic.src = "images/hudHealth3.png";
var hudHealth0Pic = document.createElement("img");
hudHealth0Pic.src = "images/hudHealth0.png";

var rescuedHudPic = document.createElement("img");
rescuedHudPic.src = "images/rescuedHud.png";

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

var tutorialTimerWiz = 0;
var tutorialTimerArmor = 0;
var tutorialTimerCloak = 0;

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
const START_HEALTH = 3;
var health = START_HEALTH;
var damagedRecentely = 0;

const playerNormal = 0
const playerWiz = 1
const playerArmor = 2
const playerCloak = 3

var playerState = playerNormal

var startedRoomAtX = 0;
var startedRoomAtY = 0;
var startedRoomAtXV = 0;
var startedRoomAtYV = 0;
var startedRoomPower = playerNormal;
var roomAsItStarted = [];
var blockCarryOnEnter = false;

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
    shieldX = jumperX + 8*(5-Math.abs(bashTimer-5)) * (shieldFacingLeft ? -1 : 1);
    shieldY = jumperY;
    if (bashTimer <0){
      isBashing = false;
      bashTimer = 10;
    }

    if (whichBrickAtPixelCoord(shieldX,shieldY,false) == TILE_CRUMBLE) {
      brickGrid[whichIndexAtPixelCoord(shieldX,shieldY)] = TILE_NONE;
    }

  } else {
    shieldX = jumperX;
    shieldY = jumperY;
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

  if(iceBolt) {
    if (whichBrickAtPixelCoord(iceBoltX, iceBoltY, false) == TILE_ICE) {
      iceBolt = false;
      brickGrid[whichIndexAtPixelCoord(iceBoltX, iceBoltY)] = TILE_NONE;
    }

    if (whichBrickAtPixelCoord(iceBoltX, iceBoltY, false) != TILE_NONE &&
        whichBrickAtPixelCoord(iceBoltX, iceBoltY, false) != TILE_PORTAL) {
      iceBolt = false;
    }
  }

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
    brickGrid[whichIndexAtPixelCoord(jumperX, jumperY + JUMPER_RADIUS)] = -CRUMBLE_FRAME_TIME;
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

function jumperRestoreFromStoredRoomEntry() {
  var loadingRoomName = levelCRToFilename(roomsOverC,roomsDownR);
  brickGrid = window[loadingRoomName].gridspaces = roomAsItStarted.slice(0);
  processBrickGrid();
  playerState = startedRoomPower;
  carryingBlock = blockCarryOnEnter;
  damagedRecentely = 0;
  health = START_HEALTH;
  jumperX = startedRoomAtX;
  jumperY = startedRoomAtY;
  jumperSpeedX = startedRoomAtXV;
  jumperSpeedY = startedRoomAtYV;
}

function jumperStoreRoomEntry() {
  var loadingRoomName = levelCRToFilename(roomsOverC,roomsDownR);
  roomAsItStarted = window[loadingRoomName].gridspaces.slice(0);
  blockCarryOnEnter = carryingBlock;
  startedRoomPower = playerState;
  startedRoomAtX = jumperX;
  startedRoomAtY = jumperY;
  startedRoomAtXV = jumperSpeedX;
  startedRoomAtYV = jumperSpeedY;
}

function jumperReset() {
  for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
    for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

      if( whichBrickAtTileCoord(eachCol, eachRow) == TILE_PLAYERSTART) {
        jumperX = eachCol * BRICK_W + BRICK_W/2;
        jumperY = eachRow * BRICK_H + BRICK_H/2;
        var changeAt = brickTileToIndex(eachCol, eachRow);
        brickGrid[changeAt] = TILE_NONE; // remove tile where player started
        jumperSpeedY = jumperSpeedX = 0;
        jumperStoreRoomEntry();
      } // end of player start found
    } // end of row
  } // end of col
}

function iceAndShieldDetection (theEnemy) {
  var enemyX = theEnemy.x;
  var enemyY = theEnemy.y;

  if(isBashing) {
    if (enemyX > shieldX - 20 && enemyX < shieldX + 20) {
      if (enemyY > shieldY - 20 && enemyY < shieldY + 20) {
        if(enemyX > shieldX) {
          theEnemy.x += BRICK_W;
          if( brickGrid[whichIndexAtPixelCoord(theEnemy.x, theEnemy.y)] != TILE_NONE) {
            theEnemy.x -= BRICK_W;
          }
        } else {
          theEnemy.x -= BRICK_W;
          if( brickGrid[whichIndexAtPixelCoord(theEnemy.x, theEnemy.y)] != TILE_NONE) {
            theEnemy.x += BRICK_W;
          }
        }
      }
    }
  }

  if(iceBolt == false) {
    return;
  }

  if (enemyX > iceBoltX - 20 && enemyX < iceBoltX + 20) {
    if (enemyY > iceBoltY - 20 && enemyY < iceBoltY + 20) {
      console.log("CHILL OUT")
      // freezing location of enemy (not the ice ball)
      brickGrid[whichIndexAtPixelCoord(enemyX, enemyY)] = TILE_ICE;
      iceBolt = false; // stop the bolt
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
      if(health <= 0) {
        jumperRestoreFromStoredRoomEntry();
      }
    }
  }
}



function drawJumper() {
  if(iceBolt == true) {
    var iceFrame = animFrame % ICE_FRAMES
    drawFacingLeftOption(iceBoltPic,iceBoltX,iceBoltY, iceFacingLeft, iceFrame);
    iceBoltX += iceBoltSpeed;
  }

  var antFrame;
  if (Math.abs(jumperSpeedX)>1) {
    antFrame = animFrame % ANT_RUN_FRAMES;
  } else {
    antFrame = 0;
  }
  drawFacingLeftOption(playerPic,jumperX,jumperY,lastFacingLeft, antFrame);

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
