var backgroundPic = document.createElement("img");
backgroundPic.src = "images/background.png"
var tilePic = document.createElement("img");
tilePic.src = "images/tile.png";
var tileMovePic = document.createElement("img");
tileMovePic.src = "images/tileMove.png";
var tileMossPic = document.createElement("img");
tileMossPic.src = "images/tileMoss.png";
var tileCrumblePic = document.createElement("img");
tileCrumblePic.src = "images/tileCrumble.png";
var tileCrumblingPic = document.createElement("img");
tileCrumblingPic.src = "images/tileCrumbling.png";
var tileWizHatPic = document.createElement("img");
tileWizHatPic.src = "images/tileWizHat.png";
var tileArmorPic = document.createElement("img");
tileArmorPic.src = "images/tileArmor.png";
var tileCloakPic = document.createElement("img");
tileCloakPic.src = "images/tileCloak.png";
var tileHealth = document.createElement("img");
tileHealth.src = "images/healthSheet.png";
const TILE_HEALTH_FRAMES = 4;
var tileDoorPic = document.createElement("img");
tileDoorPic.src = "images/tileDoor.png";
var tileKeyPic = document.createElement("img");
tileKeyPic.src = "images/tileKey.png";
var tileSpikesPic = document.createElement("img");
tileSpikesPic.src = "images/tileSpikes.png";
var tilePortalPic = document.createElement("img");
tilePortalPic.src = "images/tilePortal.png";
var tileFriendlyPic = document.createElement("img");
tileFriendlyPic.src = "images/tileFriendly.png";

var animFrame = 0;
var cyclesTillAnimStep = 0;
const FRAMES_BETWEEN_ANIM = 4;

const DURATION = 20;
var crumbleTimer = DURATION;

const BRICK_W = 60;
const BRICK_H = 60;
const BRICK_GAP = 1;
// changed to var to support variable room size in level format, but kept as all
// capitals (implying const) since they're not meant to be changed anywhere else
var BRICK_COLS = 20;
var BRICK_ROWS = 15;

const TILE_NONE = 0;
const TILE_DIRT = 1;
const TILE_MOSS = 2;
const TILE_CRUMBLE = 3;
const TILE_PILLAR = 4;
const TILE_EVIL_ANT_START = 5;
const TILE_EVIL_FLY_START = 6;
const TILE_SPIKES = 7;
const TILE_FRIENDLY_ANT = 8;
const TILE_HEALTH = 9;
const TILE_DOOR = 10;
const TILE_KEY = 11;
const TILE_PLAYERSTART = 12;
const TILE_PORTAL = 13;
const TILE_WIZ_HAT = 14;
const TILE_ARMOR = 15;
const TILE_CLOAK = 16;

function isTileHereSolid(atX,atY) {
  var tileKindAt = whichBrickAtPixelCoord(atX,atY,true);
  return (tileKindAt != TILE_NONE && tileKindAt != TILE_PORTAL);
}

var loadedLevelJSON =
{"rows":15,"cols":20,"gridspaces":[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
  2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
  1, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 3, 3, 3, 1, 1, 0, 0, 0, 1,
  1, 0, 0, 0, 1, 1,14, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 4, 1,
  1, 0, 0, 1, 1, 0, 3, 1, 1, 0, 1, 0, 0, 9, 0, 1, 1, 0, 0, 1,
  1, 0, 6, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 2,
  1, 0, 0, 1, 0, 0, 0,14,15,16, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1,
  1,13, 0, 1, 0, 0, 1, 1, 1, 1, 3, 0, 0, 1, 0, 1, 0, 0, 0, 1,
  2, 1, 1, 1, 0, 0, 0, 1, 8, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1,
  1, 0, 0, 1, 3, 0, 0, 1, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
  1,12, 0, 0, 0, 0, 1, 1, 4, 4, 5, 0, 0,10, 0, 0, 6, 0, 0, 1,
  1, 1,13, 0, 5, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,11, 0, 1,
  1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]};

var brickGrid; // now loaded from loadedLevelJSON -- copy/paste above from Charlie's editor file :)
/*=
    [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
      2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      1, 0, 0, 0, 0, 1, 3, 1, 1, 1, 1, 3, 3, 3, 1, 1, 0, 0, 0, 1,
      1, 0, 0, 0, 1, 1,14, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 4, 1,
      1, 0, 0, 1, 1, 0, 3, 1, 1, 0, 1, 0, 0, 9, 0, 1, 1, 0, 0, 1,
      1, 0, 6, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1,
      1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 2,
      1, 0, 0, 1, 0, 0, 5, 0, 4, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1,
      1,13, 0, 1, 0, 0, 1, 2, 1, 1, 3, 0, 0, 1, 0, 1, 0, 0, 0, 1,
      2, 1, 1, 1, 0, 0, 0, 1, 8, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1,
      1, 0, 0, 1, 3, 0, 0, 1, 4, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
      1,12, 0, 0, 0, 0, 1, 1, 4, 0, 5, 0, 0,10, 0, 0, 6, 0, 0, 1,
      1, 1, 0,13, 5, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 0,11, 0, 1,
      1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
*/

function loadLevel(fromJSON) {
  BRICK_COLS = fromJSON.cols;
  BRICK_ROWS = fromJSON.rows;
  brickGrid = fromJSON.gridspaces;
}

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

  if(forPlayer && brickGrid[index] == TILE_PILLAR) {
    playerTouchingIndex = index;
  }
  return brickGrid[index];
}

function drawOnlyBricksOnScreen() {

  cyclesTillAnimStep--;
  if(cyclesTillAnimStep < 0) {
    cyclesTillAnimStep = FRAMES_BETWEEN_ANIM;
    animFrame++;
  }


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
  var tileFrame;
  for(var eachCol=cameraLeftMostCol; eachCol<cameraRightMostCol; eachCol++) {
    for(var eachRow=cameraTopMostRow; eachRow<cameraBottomMostRow; eachRow++) {

      // will be overridden in switch-case with cycled frame for animated tiles
      tileFrame = 0; // by default use first tile position

      var tileValueHere = whichBrickAtTileCoord(eachCol, eachRow);
      if(tileValueHere < 0) {
        usePic = tileCrumblingPic;
        brickGrid[brickTileToIndex(eachCol, eachRow)] = tileValueHere +1;
      } else switch(whichBrickAtTileCoord(eachCol, eachRow) ) {
          case TILE_NONE:
            continue;
          case TILE_DIRT:
            usePic = tilePic;
            break;
          case TILE_PILLAR:
            usePic = tileMovePic;
            break;
          case TILE_MOSS:
            usePic = tileMossPic;
            break;
          case TILE_CRUMBLE:
            usePic = tileCrumblePic;
            break;
          case TILE_WIZ_HAT:
            usePic = tileWizHatPic;
            break;
          case TILE_ARMOR:
            usePic = tileArmorPic;
            break;
          case TILE_CLOAK:
            usePic = tileCloakPic;
            break;
          case TILE_HEALTH:
            tileFrame = animFrame % TILE_HEALTH_FRAMES;
            usePic = tileHealth;
            break;
          case TILE_DOOR:
            usePic = tileDoorPic;
            break;
          case TILE_KEY:
            usePic = tileKeyPic;
            break;
          case TILE_SPIKES:
            usePic = tileSpikesPic;
            break;
          case TILE_PORTAL:
            usePic = tilePortalPic;
            break;
          case TILE_FRIENDLY_ANT:
            usePic = tileFriendlyPic;
            break;
      } // end of whichBrickAtTileCoord()
      var brickLeftEdgeX = eachCol * BRICK_W;
      var brickTopEdgeY = eachRow * BRICK_H;

      canvasContext.drawImage(usePic,
        tileFrame * BRICK_W, 0, // top-left corner of tile art
        BRICK_W, BRICK_H, // get full tile size from source
        brickLeftEdgeX, brickTopEdgeY, // x,y top-left corner for image destination
        BRICK_W, BRICK_H); // draw full full tile size for destination


    } // end of for eachRow
  } // end of for eachCol
} // end of drawBricks()
