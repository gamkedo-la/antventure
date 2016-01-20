// Member Variables
var m_grid = [];
var m_tileSize = 60;

// On page load -- Start();
$(function() {
    makeBlankGrid(4,4);
});


function makeBlankGrid(rows, cols) {
    var num = 0;
    for( var i = 0; i < rows; i++ ) {
        for( var j = 0; j < cols; j++ ) {
            m_grid[num] = 0;
            // Create a tile grid
            num++;
        }
    }
}