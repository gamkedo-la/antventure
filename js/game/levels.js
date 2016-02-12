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
const TILE_CRUMBLING_FRAMES = 4;
const CRUMBLE_FRAME_TIME = 30;
var tileCrumblingPic = document.createElement("img");
tileCrumblingPic.src = "images/tileCrumbling.png";
var tileWizHatPic = document.createElement("img");
tileWizHatPic.src = "images/tileWizHat.png";
var tileWizHatSheet = document.createElement("img");
tileWizHatSheet.src = "images/tileWizHat-sheet.png";
const TILE_HAT_FRAMES = 4;
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
tileKeyPic.src = "images/TileKeyAN.png";
const TILE_KEY_FRAMES = 4;
var tileSpikesPic = document.createElement("img");
tileSpikesPic.src = "images/tileSpikes.png";
var tilePortalPic = document.createElement("img");
tilePortalPic.src = "images/tilePortal.png";
var tileFriendlyPic = document.createElement("img");
tileFriendlyPic.src = "images/tileFriendly.png";
const TILE_FRIENDLY_FRAMES = 4;
var tileIcePic = document.createElement("img");
tileIcePic.src = "images/tileIce.png";
var tileTorch = document.createElement("img");
tileTorch.src = "images/torchSheet.png";
const TILE_TORCH_FRAMES = 4;

var tileMapPic = document.createElement("img");
tileMapPic.src = "images/tileMap.png";
var tileGoldDoorPic = document.createElement("img");
tileGoldDoorPic.src = "images/tileGoldDoor.png";
var tileGoldKeyPic = document.createElement("img");
tileGoldKeyPic.src = "images/tileGoldKey.png";
const TILE_GOLD_KEY_FRAMES = 4;
var tileSwordPic = document.createElement("img");
tileSwordPic.src = "images/sword.png";

var startScreen = document.createElement("img");
startScreen.src = "images/startScreen.png";
var deadScreen = document.createElement("img");
deadScreen.src = "images/deadScreen.png";
var endScreen = document.createElement("img");
endScreen.src = "images/endScreen.png";

var queenAntPic = document.createElement("img");
queenAntPic.src = "images/queenAnt.png";
const QUEEN_FRAMES = 6;
var queenAntDeadPic = document.createElement("img");
queenAntDeadPic.src = "images/queenAntDead.png";
var queenAntWingPic = document.createElement("img");
queenAntWingPic.src = "images/queenAntWing.png";
const QUEEN_WING_FRAMES = 4;
var tileCrownPic = document.createElement("img");
tileCrownPic.src = "images/crown.png";
var bloodSprayAn = document.createElement("img");
bloodSprayAn.src = "images/bloodSheet.png";
const TILE_BLOOD_FRAMES = 4;

var antQueenState = 0;
var wasStabbed = false;
var hasSword = false;

// where is the player/gameplay happening in the overworld level grid?
// now automatically set at first by loadLevelsBesidesFirstOne
// should change by which level file is loaded from index.html
var roomsOverC = 4;
var roomsDownR = 0;

var roomsToLoadColsW = 9
var roomsToLoad =
//0 1 2 3 4 5 6 7 8
 [0,0,0,0,2,0,7,0,0, // a
  0,0,3,2,2,2,3,0,0, // b
  0,3,3,3,4,3,0,0,7, // c
  0,3,3,7,4,3,3,3,7, // d
  0,4,4,4,4,4,4,0,7, // e
  7,0,7,0,0,4,0,7,7, // f
  6,6,0,6,4,4,5,5,0, // g
  0,6,6,6,0,5,5,5,0, // h
  0,0,6,0,0,7,0,5,5  // i
  ];

var animFrame = 0;
var cyclesTillAnimStep = 0;
const FRAMES_BETWEEN_ANIM = 4;

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
const TILE_ICE = 17;
const TILE_TORCH = 18;
const TILE_MAP = 19;
const TILE_GOLD_DOOR = 20;
const TILE_GOLD_KEY = 21;
const TILE_SWORD = 22;
const TILE_WEAKPOINT = 23;


function isTileHereSolid(atX,atY) {
  var tileKindAt = whichBrickAtPixelCoord(atX,atY,true);
  if (playerState == playerCloak && abilityCoolDown > 40) {
    return (tileKindAt != TILE_NONE && tileKindAt != TILE_PORTAL && tileKindAt != TILE_TORCH  && tileKindAt != TILE_SPIKES);
  } else {
    return (tileKindAt != TILE_NONE && tileKindAt != TILE_PORTAL && tileKindAt != TILE_TORCH);
  }
}

function isTileHereWalkOnAble(atX,atY) {
  var tileKindAt = whichBrickAtPixelCoord(atX,atY,false);

  return tileKindAt == TILE_DIRT ||
          tileKindAt == TILE_MOSS ||
          tileKindAt == TILE_DOOR ||
          tileKindAt == TILE_PILLAR ||
          tileKindAt == TILE_CRUMBLE ||
          tileKindAt < 0; // mid-decay
}

/*var loadedLevelJSON = // kept around for ease of one-off testing via override
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
  1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]};*/

var brickGrid; // now loaded from JSON file

function levelCRToFilename(someC,someR) {
  return "level"+someC + String.fromCharCode(97+someR); // 97 = 'a'
}

function noLevelHere() {
  console.log("no level at this position, skipping it, ignore browser error above for now. TODO: define overworld 9x9 grid for which room R,C are defined, and/or define more room files");
}

function loadLevelsBesidesFirstOne() {
  for(var eachC=0;eachC<9;eachC++) {
    for(var eachR=0;eachR<9;eachR++) {
      var loadingRoomName = levelCRToFilename(eachC,eachR);
      // the only way it isn't null: if it was the one loaded by html
      if(window[loadingRoomName] != null) {
        // now check for player start
        brickGrid = window[loadingRoomName].gridspaces;
        var playerStartFound = false;
        for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
          for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

            if( whichBrickAtTileCoord(eachCol, eachRow) == TILE_PLAYERSTART) {
	        // set this room as first to be in focus
        	roomsOverC = eachC;
	        roomsDownR = eachR;
	        return;
            } // end of player start found
          } // end of row
        } // end of col
      }
      /* var roomKind = roomsToLoad[eachC + eachR*roomsToLoadColsW];
      if(roomKind == 0) {
        continue;
      }
      var imported = document.createElement('script');
      imported.onerror = noLevelHere;
      imported.src = 'levels/'+levelCRToFilename(eachC,eachR)+".js";
      document.head.appendChild(imported);*/
	// now all merged in allmaps.js for speedier load
    }
  }
}

function loadLevel(fromJSON) { // if no test stage argument, load from world grid
  if(fromJSON == undefined) {
    var loadingRoomName = levelCRToFilename(roomsOverC,roomsDownR);
    fromJSON = window[loadingRoomName];

    if(fromJSON == undefined) {
      console.log(loadingRoomName + "room not defined or found, cannot open it");
      return false; // level not found for this coord
    }
  }
  BRICK_COLS = fromJSON.cols;
  BRICK_ROWS = fromJSON.rows;
  brickGrid = fromJSON.gridspaces;

  jumperStoreRoomEntry();
  processBrickGrid();

  return true;
}

function processBrickGrid() {
  // defrost frozen baddies
  // console.log("defrosting");
  for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
    for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {
      if( whichBrickAtTileCoord(eachCol, eachRow) == TILE_ICE) {
        var changeAt = brickTileToIndex(eachCol, eachRow);
        brickGrid[changeAt] = TILE_NONE;
      }
    }
  }

  var tempEnemy = new enemySlideAndBounce();
  // enemyList = []; do not clear enemy list, we're keeping old ones around
  while(tempEnemy.enemyPlacementAnt(TILE_EVIL_ANT_START, EVIL_BUG_SPEED, 0.0)) {
    enemyList.push(tempEnemy);
    tempEnemy = new enemySlideAndBounce();
  }
  while(tempEnemy.enemyPlacementAnt(TILE_EVIL_FLY_START, 0.0, EVIL_BUG_SPEED)) {
    enemyList.push(tempEnemy);
    tempEnemy = new enemySlideAndBounce();
  }
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

  if(cameraRightMostCol > BRICK_COLS) {
    cameraRightMostCol = BRICK_COLS;
  }
  if(cameraBottomMostRow > BRICK_ROWS) {
    cameraBottomMostRow = BRICK_ROWS;
  }

  var usePic;
  var tileFrame;
  for(var eachCol=cameraLeftMostCol; eachCol<cameraRightMostCol; eachCol++) {
    for(var eachRow=cameraTopMostRow; eachRow<cameraBottomMostRow; eachRow++) {

      // will be overridden in switch-case with cycled frame for animated tiles
      tileFrame = 0; // by default use first tile position

      var tileValueHere = whichBrickAtTileCoord(eachCol, eachRow);
      if(tileValueHere < 0) {
        tileFrame = Math.floor( (CRUMBLE_FRAME_TIME+tileValueHere) * TILE_CRUMBLING_FRAMES/CRUMBLE_FRAME_TIME );
        usePic = tileCrumblingPic;
        brickGrid[brickTileToIndex(eachCol, eachRow)] = tileValueHere +1;
      } else switch( tileValueHere ) {
          case TILE_NONE:
            continue;
          case TILE_DIRT:
          case TILE_ICE: // drawing dirt background in addition to ice on next pass
            usePic = tilePic;
            break;
          case TILE_PILLAR:
            if (roomsOverC == 4 && roomsDownR == 2) {
              usePic = tileCrownPic;
              break;
            } else {
              usePic = tileMovePic;
              break;
            }
          case TILE_MOSS:
            if (roomsOverC == 4 && roomsDownR == 2) {
              continue;
            } else {
              usePic = tileMossPic;
              break;
            }
          case TILE_CRUMBLE:
            usePic = tileCrumblePic;
            break;
          case TILE_WIZ_HAT:
            usePic = tileWizHatSheet;
            tileFrame = animFrame % TILE_HAT_FRAMES;
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
            tileFrame = animFrame % TILE_KEY_FRAMES;
            break;
          case TILE_SPIKES:
            if (roomsOverC == 4 && roomsDownR == 2) {
              continue;
            } else {
              usePic = tileSpikesPic;
              break;
            }
          case TILE_PORTAL:
            usePic = tilePortalPic;
            break;
          case TILE_FRIENDLY_ANT:
            tileFrame = animFrame % TILE_FRIENDLY_FRAMES;
            usePic = tileFriendlyPic;
            break;
          /* case TILE_ICE:
            usePic = tileIcePic;
            break; */
          case TILE_TORCH:
            tileFrame = animFrame % TILE_TORCH_FRAMES;
            usePic = tileTorch;
            break;
          case TILE_MAP:
            usePic = tileMapPic;
            break;
          case TILE_GOLD_DOOR:
            usePic = tileGoldDoorPic;
            break;
          case TILE_GOLD_KEY:
            usePic = tileGoldKeyPic;
            tileFrame = animFrame % TILE_GOLD_KEY_FRAMES;
            break;
          case TILE_SWORD:
            usePic = tileSwordPic;
            break;
          case TILE_WEAKPOINT:
            if (wasStabbed) {
              usePic = bloodSprayAn;
              tileFrame = animFrame % TILE_BLOOD_FRAMES;
              break;
            } else {
              continue;
            }
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
} // end of drawOnlyBricksOnScreen()

function drawIceOverlay() {

  var cameraLeftMostCol = Math.floor(camPanX / BRICK_W);
  var cameraTopMostRow = Math.floor(camPanY / BRICK_H);

  // how many columns and rows of tiles fit on one screenful of area?
  var colsThatFitOnScreen = Math.floor(canvas.width / BRICK_W);
  var rowsThatFitOnScreen = Math.floor(canvas.height / BRICK_H);

  var cameraRightMostCol = cameraLeftMostCol + colsThatFitOnScreen + 2;
  var cameraBottomMostRow = cameraTopMostRow + rowsThatFitOnScreen + 1;

  if(cameraRightMostCol > BRICK_COLS) {
    cameraRightMostCol = BRICK_COLS;
  }
  if(cameraBottomMostRow > BRICK_ROWS) {
    cameraBottomMostRow = BRICK_ROWS;
  }

  var usePic = tileIcePic;
  for(var eachCol=cameraLeftMostCol; eachCol<cameraRightMostCol; eachCol++) {
    for(var eachRow=cameraTopMostRow; eachRow<cameraBottomMostRow; eachRow++) {

      var tileValueHere = whichBrickAtTileCoord(eachCol, eachRow);
      if(tileValueHere == TILE_ICE) {
        var brickLeftEdgeX = eachCol * BRICK_W;
        var brickTopEdgeY = eachRow * BRICK_H;

        canvasContext.drawImage(usePic,
          0, 0, // top-left corner of tile art
          BRICK_W, BRICK_H, // get full tile size from source
          brickLeftEdgeX, brickTopEdgeY, // x,y top-left corner for image destination
          BRICK_W, BRICK_H); // draw full full tile size for destination
      } // end of whichBrickAtTileCoord()

    } // end of for eachRow
  } // end of for eachCol
} // end of drawIceOverlay()
