var evilBugPic = document.createElement("img");
evilBugPic.src = "images/evilBug.png";
var evilFlyPic = document.createElement("img");
evilFlyPic.src = "images/evilFly.png";

const EVIL_BUG_SPEED = 1.0;

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

  this.enemyPlacementAnt = function(tileLoadIndex,xv,yv,myImg) {
    this.xv = xv;
    this.yv = yv;
    this.myPic = myImg;
    this.facingLeft = false;

    for(var eachCol=0; eachCol<BRICK_COLS; eachCol++) {
      for(var eachRow=0; eachRow<BRICK_ROWS; eachRow++) {

        if( whichBrickAtTileCoord(eachCol, eachRow) == tileLoadIndex) {
          this.x = eachCol * BRICK_W + BRICK_W/2;
          this.y = (eachRow * BRICK_H + BRICK_H/2) + 14;
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
    
	  // movement for the one hard coded enemy red ant
    this.x += this.xv;
    this.y += this.yv;

    if(whichBrickAtPixelCoord(this.x+JUMPER_RADIUS*this.xv,this.y+JUMPER_RADIUS*this.yv,false) != TILE_NONE &&
    whichBrickAtPixelCoord(this.x+JUMPER_RADIUS*this.xv,this.y+JUMPER_RADIUS*this.yv,false) != TILE_PORTAL) {
      this.facingLeft = !this.facingLeft;
      this.xv = -this.xv;
      this.yv = -this.yv;
      this.x += this.xv;
      this.y += this.yv;
    } else {
      if (this.yv == 0) {
        if (whichBrickAtPixelCoord(this.x+JUMPER_RADIUS*this.xv,this.y + 60,false) != TILE_DIRT &&
            whichBrickAtPixelCoord(this.x+JUMPER_RADIUS*this.xv,this.y + 60,false) != TILE_MOSS &&
            whichBrickAtPixelCoord(this.x+JUMPER_RADIUS*this.xv,this.y + 60,false) != TILE_DOOR &&
            whichBrickAtPixelCoord(this.x+JUMPER_RADIUS*this.xv,this.y + 60,false) != TILE_PILLAR &&
            whichBrickAtPixelCoord(this.x+JUMPER_RADIUS*this.xv,this.y + 60,false) != TILE_CRUMBLE) {
              this.facingLeft = !this.facingLeft;
              this.xv = -this.xv;
              this.x += this.xv;
            }
      }
    }

    hitDetection (this.x, this.y);

    iceDetection (this.x, this.Y);

    drawFacingLeftOption(this.myPic,this.x,this.y, this.facingLeft);
  }
}
