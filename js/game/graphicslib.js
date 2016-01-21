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
function drawFacingLeftOption(image,atX,atY,ifFlipped) {
  if(ifFlipped) {
    canvasContext.save();
    canvasContext.translate(atX, atY);
    canvasContext.scale(-1, 1);
    canvasContext.drawImage(image,-JUMPER_RADIUS,-JUMPER_RADIUS);
    canvasContext.restore();
  } else {
    canvasContext.drawImage(image,atX - JUMPER_RADIUS, atY - JUMPER_RADIUS);
  }
}