var m_grid = [];
var m_cols = 20;
var m_rows = 15;
var m_tileTypeCount = 12;
var m_optionSelection = 0;
var m_name = "level";

// Start()
$(function() {
  linkCSS();
  createDOM();
  createGrid(m_rows, m_cols);
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
  link.href = 'css/editorstyle.css';
  // Add the link to the head of the html
  head.appendChild(link);
}

function createDOM() {
  $(".wrapper").append("<div class='header'></div>");
  $(".wrapper").append("<div class='content'></div>");
  $(".wrapper").append("<div class='saveWindow'></div>");
  
  $(".header").append("<div class='dropdown'></div>");
  $(".dropdown").append("<div class='itemSpan'>File</div>");
  $(".dropdown").append("<div class='dropdown-content'></div>");
  $(".dropdown-content").append("<div id='new' class='dropdown-item'>New Grid...</div>");
  $(".dropdown-content").append("<div id='open' class='dropdown-item'>Open Grid...</div>");
  $(".dropdown-content").append("<div id='save' class='dropdown-item'>Save Grid...</div>");
  $(".dropdown-content").append("<div id='close' class='dropdown-item'>Close Editor...</div>");
  
  $(".header").append("<div class='options'></div>");
  $(".options").append("<div class='option-title'>Options: </div>");
  
  for( var i=0; i<m_tileTypeCount; i++){
    $(".options").append("<div class='option t" + i + "'></div>");
  }
  $('.t0').addClass("selected");
  
  $(".content").append("<div class='grid'></div>");
  
  $(".saveWindow").append("<div class='save-info'>Please enter a name for the file...</div>");
  $(".saveWindow").append("<input id='save-text' type='text' value='level'>");
  $(".saveWindow").append("<div class='button'>Submit</div>");
  $(".saveWindow").append("<div class='button'>Cancel</div>");
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
          popupSave();
        } else if( $(this).attr("id") == "close") {
          closeEditor();
        } else {
          console.log("unknown item");
        }
        $(".dropdown").removeClass("hover");
    });
    
    $(".option").click(function() {
      var cn = "";
      cn  = $(this).attr("class");
      var number = cn.substring(cn.lastIndexOf('t') + 1);
      var elements = document.getElementsByClassName("option");
      
      for( var i=0; i<elements.length; i++) {
        var cl = elements[i].classList;
        if(cl.contains("selected")){
          cl.remove("selected");
        }
      }
      
      $(this).addClass("selected");
      m_optionSelection = number;
    });
    
    $(".gridspace").click(function() {
      var index = parseInt($(this).attr("id"));
      m_grid[index] = m_optionSelection;
      
      var lastClass = $(this).attr('class').split(' ').pop();
      $(this).removeClass(lastClass);
      $(this).addClass("t" + m_optionSelection.toString());
    });
    
    $(".button").click(function() {
       if($(this).text() == "Submit") {
         saveGrid();
       }
       $('.saveWindow').css("visibility", "hidden");
       $('#save-text').val("level");
    });
}

function createGrid() {
  // Create a new grid
  makeGrid(m_cols, m_rows, []);
}

function openGrid() {
  // Open a grid
  
}

function saveGrid() {
  // Save grid to file
  m_name = $('#save-text').val();
  var json = {
    "rows": m_rows,
    "cols": m_cols,
    "gridspaces": m_grid
  };
  
  saveData(json, m_name);
}

function closeEditor() {
  // Close editor and go back to game
  
}

function popupSave() {
  $('.saveWindow').css("visibility", "visible");
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
      gridspace.className = "gridspace t1";
      row.appendChild(gridspace);
      m_grid[num] = 1;
      num++;
    }
    document.getElementsByClassName("grid")[0].appendChild(row);
  }
}

var saveData = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var json = JSON.stringify(data),
            blob = new Blob([json], {type: "json"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName + ".json";
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());