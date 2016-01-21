var evilBugPic = document.createElement("img");
evilBugPic.src = "images/evilBug.png";
var evilFlyPic = document.createElement("img");
evilFlyPic.src = "images/evilFly.png";

var evilBugX = 75, evilBugY = 75;
var evilBugLastFacingLeft = false;
const EVIL_BUG_SPEED = 1.0;

var evilFlyX = 75, evilFlyY = 75;
var evilFlyLastMovingUp = false;
const EVIL_FLY_SPEED = 1.0;

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

function enemyCollideAndDraw() {
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
}