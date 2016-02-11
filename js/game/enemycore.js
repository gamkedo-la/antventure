var evilBugPic = document.createElement("img");
evilBugPic.src = "images/evilBug-sheet.png";
const ENEMY_FRAMES = 4;
var evilFlyPic = document.createElement("img");
evilFlyPic.src = "images/evilFly.png";

const EVIL_BUG_SPEED = 1.0;
const ANT_GROUND_HEIGHT_OFFSET = 14;

enemyList = [];

function enemySlideAndBounce() {
  // these reflect which overworld room coord the creature exists in
  this.myRoomC = 0;
  this.myRoomR = 0;

  this.x = 50;
  this.y = 50;
  this.xv = 0;
  this.yv = 0;
  this.facingLeft = false;
  this.myID = enemyList.length;
  this.myKind = -1; // ant or fly?

  this.restoreImgFromKind =  function() {
    if(this.myKind == TILE_EVIL_ANT_START) {
      this.myPic = evilBugPic;
    } else {
      this.myPic = evilFlyPic;
    }
  }

  this.respawnEnemy = function(jsonInfo) {
    this.myRoomC = jsonInfo.myRoomC;
    this.myRoomR = jsonInfo.myRoomR;

    this.x = jsonInfo.x;
    this.y = jsonInfo.y;
    this.xv = jsonInfo.xv;
    this.yv = jsonInfo.yv;
    this.facingLeft = jsonInfo.facingLeft;
    this.myID = jsonInfo.myID;
    this.myKind = jsonInfo.myKind;

    this.restoreImgFromKind();
  }

  this.enemyPlacementAnt = function(tileLoadIndex,xv,yv,myImg) {
    this.xv = xv;
    this.yv = yv;
    this.myKind = tileLoadIndex;
    this.restoreImgFromKind();
    this.facingLeft = false;

    for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
      for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

        if( whichBrickAtTileCoord(eachCol, eachRow) == tileLoadIndex) {
          this.x = eachCol * BRICK_W + BRICK_W/2;
          this.y = (eachRow * BRICK_H + BRICK_H/2) + ANT_GROUND_HEIGHT_OFFSET;
          var changeAt = brickTileToIndex(eachCol, eachRow);
          brickGrid[changeAt] = TILE_NONE; // remove tile where player started

          this.myRoomC = roomsOverC;
          this.myRoomR = roomsDownR;

          return true;
        } // end of player start found
      } // end of row
    } // end of col

    return false;
  } // end of function

this.enemyCollideAndDraw = function() {
    if(this.myRoomC != roomsOverC || this.myRoomR != roomsDownR) {
      return; // not in this room, skip this one
    }

    // doing before move code so it'll snap into correct tile
    iceAndShieldDetection (this);

    if(whichBrickAtPixelCoord(this.x,this.y,false) == TILE_ICE) {
      // snap to center of ice block
      this.x = Math.floor(this.x/BRICK_W) * BRICK_W + 0.5 * BRICK_W;
      this.y = Math.floor(this.y/BRICK_H) * BRICK_H + 0.5 * BRICK_H;

      // drawing here since otherwise the draw call later gets skipped too
      drawFacingLeftOption(this.myPic,this.x,this.y, this.facingLeft);
      return; // prevent any other movement
    }

    if(whichBrickAtPixelCoord(this.x,this.y,false) == TILE_SPIKES) { // ant fell on spikes
      return;
    }

	  // movement for the one hard coded enemy red ant
    this.x += this.xv;
    this.y += this.yv;

    if(this.yv ==0 &&
      isTileHereWalkOnAble(this.x,this.y + 60) == false) {
      this.y += BRICK_H; // fall
    }

    if(whichBrickAtPixelCoord(this.x+JUMPER_RADIUS*this.xv,this.y+JUMPER_RADIUS*this.yv,false) != TILE_NONE &&
    whichBrickAtPixelCoord(this.x+JUMPER_RADIUS*this.xv,this.y+JUMPER_RADIUS*this.yv,false) != TILE_PORTAL) {
      this.facingLeft = !this.facingLeft;
      this.xv = -this.xv;
      this.yv = -this.yv;
      this.x += this.xv;
      this.y += this.yv;
    } else {
      if (this.yv == 0) {
        var heightInTile = this.y % BRICK_H;
        if(heightInTile < (BRICK_H/2) + ANT_GROUND_HEIGHT_OFFSET) {
          this.y = Math.floor(this.y/BRICK_H)*BRICK_H +
                   (BRICK_H/2) + ANT_GROUND_HEIGHT_OFFSET;
        }
        if (isTileHereWalkOnAble(this.x+JUMPER_RADIUS*this.xv,this.y + 60) == false) {
              this.facingLeft = !this.facingLeft;
              this.xv = -this.xv;
              this.x += this.xv;
        }
      }
    }

    hitDetection (this.x, this.y);

    var enemyFrame = animFrame % ENEMY_FRAMES;
    if(this.xv == 0) {
      enemyFrame = 0; // no animation on fly
    }

    drawFacingLeftOption(this.myPic,this.x,this.y, this.facingLeft, enemyFrame);
  }
}
