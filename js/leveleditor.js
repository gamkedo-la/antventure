var m_grid = [];
var m_cols = 20;
var m_rows = 15;

// Start()
$(function() {
  linkCSS();
  createDOM();createGrid(m_rows, m_cols);
});

// Update()
window.setTimeout(function() {
  hoverCheck();
  clickCheck();
}, 1);

function linkCSS() {
  // Get the head of the html
  var head = document.getElementsByTagName('head')[0];
  // Create a link and set the information
  var link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = '../css/editorstyle.css';
  // Add the link to the head of the html
  head.appendChild(link);
}

function createDOM() {
  $(".wrapper").append("<div class='header'></div>");
  $(".wrapper").append("<div class='content'></div>");
  
  $(".header").append("<div class='dropdown'></div>");
  $(".dropdown").append("<div class='itemSpan'>File</div>");
  $(".dropdown").append("<div class='dropdown-content'></div>");
  $(".dropdown-content").append("<div id='new' class='dropdown-item'>New Grid...</div>");
  $(".dropdown-content").append("<div id='open' class='dropdown-item'>Open Grid...</div>");
  $(".dropdown-content").append("<div id='save' class='dropdown-item'>Save Grid...</div>");
  $(".dropdown-content").append("<div id='close' class='dropdown-item'>Close Editor...</div>");
  
  $(".header").append("<div class='options'></div>");
  $(".options").append("<div class='option-title'>Options: </div>");
  $(".options").append("<div class='option t0'></div>");
  $(".options").append("<div class='option t1'></div>");
  $(".options").append("<div class='option t2'></div>");
  $(".options").append("<div class='option t3'></div>");
  $(".options").append("<div class='option t4'></div>");
  $(".options").append("<div class='option t5'></div>");
  $(".options").append("<div class='option t6'></div>");
  $(".options").append("<div class='option t7'></div>");
  $(".options").append("<div class='option t8'></div>");
  
  $(".content").append("<div class='grid'></div>");
}

function hoverCheck() {
  $(".dropdown").hover(
    function() {
    $(this).addClass("hover");
  }, function() {
    $(this).removeClass("hover");
  });
}

function clickCheck() {
    $(".dropdown-item").click(function() {
        if( $(this).attr("id") == "new") {
          createGrid();
        } else if( $(this).attr("id") == "open") {
          var arr;
          openGrid(arr);
        } else if( $(this).attr("id") == "save") {
          saveGrid();
        } else if( $(this).attr("id") == "close") {
          closeEditor();
        } else {
          console.log("unknown item");
        }
        $(".dropdown").removeClass("hover");
    });
}

function createGrid() {
  // Create a new grid
  makeGrid(m_cols, m_rows, []);
  console.log("new");
}

function openGrid(arr) {
  // Open a grid
  console.log("open");
}

function saveGrid() {
  // Save grid to file
  console.log("save");
}

function closeEditor() {
  // Close editor and go back to game
  console.log("close");
}

function makeGrid(w,h,arr) {
  var num = 0;
  m_grid = [w*h];
  
  $(".grid").text("");
  $(".grid").css("width", (2*w).toString() + "rem");
  $(".grid").css("height", (2*h).toString() + "rem");
  
  for(var i=0; i<h; i++) {
    var row = document.createElement("div");
    row.className = "row";
    for(var j=0; j<w; j++){
      var gridspace = document.createElement("div");
      gridspace.id = num;
      gridspace.className = "gridspace";
      row.appendChild(gridspace);
      m_grid[num] = 0;
      num++;
    }
    document.getElementsByClassName("grid")[0].appendChild(row);
  }
  
  console.log(m_grid);
}