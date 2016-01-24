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
      (whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) != TILE_CRUMBLE) &&
      (whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) != TILE_MOSS)) {

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
