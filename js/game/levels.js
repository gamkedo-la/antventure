var backgroundPic = document.createElement("img");
backgroundPic.src = "images/background.png"
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

const DURATION = 20;
var crumbleTimer = DURATION;

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
      1, 0, 6, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 5, 0, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1,
      1, 4, 0, 1, 0, 0, 1, 1, 1, 1, 7, 0, 0, 1, 0, 1, 0, 0, 0, 1,
      1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 2, 1, 1, 0, 1,
      1, 0, 0, 1, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
      1, 3, 6, 0, 0, 0, 1, 1, 2, 0, 5, 0, 0, 1, 0, 0, 6, 0, 0, 1,
      1, 1, 0, 6, 5, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];;

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
