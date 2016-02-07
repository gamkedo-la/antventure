function colorRect(topLeftX, topLeftY, boxWidth, boxHeight, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.fillRect(topLeftX, topLeftY, boxWidth, boxHeight);
}

function colorCircle(centerX, centerY, radius, fillColor) {
  canvasContext.fillStyle = fillColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
}

// warning: currently is written assuming JUMPER_RADIUS is same for all chars
function drawFacingLeftOption(image,atX,atY,ifFlipped, frameNum) {
  var imageDim = image.height; // making assumption of square animation frames to simplify strips
  if(frameNum == undefined) {
    frameNum = 0;
  }

  if(ifFlipped) {
    canvasContext.save();
    canvasContext.translate(atX, atY);
    canvasContext.scale(-1, 1);

    canvasContext.drawImage(image,
        frameNum * imageDim, 0, // top-left corner of tile art
        imageDim, imageDim, // get full tile size from source
        -imageDim/2,-imageDim/2, // x,y top-left corner for image destination
        imageDim, imageDim); // draw full full tile size for destination

    canvasContext.restore();
  } else {
    canvasContext.drawImage(image,
        frameNum * imageDim, 0, // top-left corner of tile art
        imageDim, imageDim, // get full tile size from source
        atX-imageDim/2,atY-imageDim/2, // x,y top-left corner for image destination
        imageDim, imageDim); // draw full full tile size for destination
  }
}