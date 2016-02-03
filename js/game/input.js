const KEY_LEFT_ARROW = 37;
const KEY_A = 65;
const KEY_UP_ARROW = 38;
const KEY_W = 87;
const KEY_RIGHT_ARROW = 39;
const KEY_D = 68;
const KEY_DOWN_ARROW = 40;
const KEY_S = 83;
const KEY_SPACE = 32;


var holdLeft = false;
var holdRight = false;
var lastFacingLeft = false;
var abilityCoolDown = 0;
var dashPower = 2;

function initInput() {
  document.addEventListener("keydown", keyPressed);
  document.addEventListener("keyup", keyReleased);
}

function setKeyHoldState(thisKey, setTo) {
  if(thisKey == KEY_SPACE && abilityCoolDown == 0 && playerState > 0) {

    if(playerState == playerCloak) {

      if (lastFacingLeft == true) {
        for (var i=1; i < 4; i++) {
          if (whichBrickAtPixelCoord(jumperX - (60 * i),jumperY,true) != TILE_DIRT &&
              whichBrickAtPixelCoord(jumperX - (60 * i),jumperY,true) != TILE_MOSS &&
              whichBrickAtPixelCoord(jumperX - (60 * i),jumperY,true) != TILE_DOOR &&
              whichBrickAtPixelCoord(jumperX - (60 * i),jumperY,true) != TILE_PILLAR &&
              whichBrickAtPixelCoord(jumperX - (60 * i),jumperY,true) != TILE_CRUMBLE) {
                console.log("ding")
                dashPower -= 15
              }
          }

      } else {
          for (var i=1; i < 4; i++) {
            if (whichBrickAtPixelCoord(jumperX + (60 * i),jumperY,true) != TILE_DIRT &&
                whichBrickAtPixelCoord(jumperX + (60 * i),jumperY,true) != TILE_MOSS &&
                whichBrickAtPixelCoord(jumperX + (60 * i),jumperY,true) != TILE_DOOR &&
                whichBrickAtPixelCoord(jumperX + (60 * i),jumperY,true) != TILE_PILLAR &&
                whichBrickAtPixelCoord(jumperX + (60 * i),jumperY,true) != TILE_CRUMBLE) {
                  console.log("ding")
                  dashPower += 15
                }
            }
        }
      jumperSpeedX = 0
      jumperSpeedX = dashPower
      dashPower = 2
    }


    if(playerState == playerWiz) {
      iceBolt = true;
      iceBoltY = jumperY + 10;
      if (lastFacingLeft == true) {
        iceBoltSpeed = -5;
        iceBoltX = jumperX -10;
        iceFacingLeft = true;
      } else {
        iceBoltSpeed = 5;
        iceBoltX = jumperX +10;
        iceFacingLeft = false;
      }
    }

    if(playerState == playerArmor) {
      isBashing = true;
    }

    abilityCoolDown = 50
}

  if(thisKey == KEY_LEFT_ARROW || thisKey == KEY_A) {
    holdLeft = setTo;
    if(setTo) {
      lastFacingLeft = true;
      if (isBashing == false) {
        shieldFacingLeft = true;
      }
    }
  }
  if(thisKey == KEY_RIGHT_ARROW || thisKey == KEY_D) {
    holdRight = setTo;
    if(setTo) {
      lastFacingLeft = false;
      if (isBashing == false) {
        shieldFacingLeft = false;
      }

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
      //console.log(whichIndexAtPixelCoord(jumperX, jumperY, true))
      if(carryingBlock == false && (whichBrickAtPixelCoord(jumperX,jumperY,true) == TILE_PORTAL)) {
        var indexOfPortalUsed = whichIndexAtPixelCoord(jumperX, jumperY, true);
        for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
          for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

            if(whichBrickAtTileCoord(eachCol, eachRow) == TILE_PORTAL){
              if(indexOfPortalUsed != brickTileToIndex(eachCol, eachRow)) {
                //console.log(whichIndexAtPixelCoord(jumperX, jumperY, true))
                //console.log(brickTileToIndex(eachCol, eachRow))
                jumperX = eachCol * BRICK_W + BRICK_W/2;
                jumperY = (eachRow * BRICK_H + BRICK_H/2) + 14;
                return;
              }
            }
          }
        }
      }
      if(carryingBlock == false && playerTouchingIndex != -1) {
        brickGrid[playerTouchingIndex] = TILE_NONE;
        jumperSpeedY = -JUMP_POWER * 0.3;
        carryingBlock = true;
      }
      else if(carryingBlock == true && jumperOnGround &&
      (whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) != TILE_CRUMBLE) &&
      (whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) > 0) &&
      (whichBrickAtPixelCoord(jumperX,jumperY+JUMPER_RADIUS,true) != TILE_MOSS) &&
      (whichBrickAtPixelCoord(jumperX,jumperY,true) != TILE_PORTAL)) {

        playerTouchingIndex = -1;
        var indexOfPlayer = whichIndexAtPixelCoord(jumperX,jumperY,true);
        var indexToMoveTo = indexOfPlayer-BRICK_COLS;
        var isRoomForPlayerAbove = (indexToMoveTo != -1 &&
                brickGrid[indexToMoveTo] == TILE_NONE);
        if(indexOfPlayer != -1 && isRoomForPlayerAbove) {
          brickGrid[indexOfPlayer] = TILE_PILLAR;
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
