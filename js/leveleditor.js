// Member Variables
var m_grid = [];
var m_tileSize = 60;
var m_canvas;
var m_ctx;

// On page load -- Start();
$(function() {
    makeBlankGrid(4,4);
    m_canvas = document.getElementById("gameCanvas");
    m_ctx = m_canvas.getContext("2d");
});


function makeBlankGrid(rows, cols) {
    var num = 0;
    for( var i = 0; i < rows; i++ ) {
        for( var j = 0; j < cols; j++ ) {
            m_grid[num] = 0;
            // Create a tile grid
            m_ctx.fillRect(i*m_tileSize,i*m_tileSize,m_tileSize,m_tileSize);
            num++;
        }
    }
}