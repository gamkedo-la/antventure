var m_grid = [];
var m_cols = 20;
var m_rows = 15;
var m_tileTypeCount = 15;
var m_tooltips = [
  "nothing",
  "dirt",
  "moss",
  "crumble",
  "pillar",
  "red-ant",
  "fly",
  "spikes",
  "friendlies",
  "health",
  "gate",
  "key",
  "start",
  "portal",
  "wiz-hat"
  ];
var m_optionSelection = 0;
var m_name = "level0a";
var m_worldLoc = {x:0,y:0};

// Start()
$(function() {
  linkCSS();
  createDOM();
  createGrid(m_rows, m_cols);
  $(".level-name").text(m_name);
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
  $(".wrapper").append("<div class='newWindow'></div>");
  $(".wrapper").append("<div class='saveWindow'></div>");
  $(".wrapper").append("<div class='openWindow'></div>");
  
  $(".header").append("<div class='dropdown'></div>");
  $(".dropdown").append("<div class='itemSpan'>File</div>");
  $(".dropdown").append("<div class='dropdown-content'></div>");
  $(".dropdown-content").append("<div id='new' class='dropdown-item'>New Grid...</div>");
  //$(".dropdown-content").append("<div id='open' class='dropdown-item'>Open Grid...</div>");
  $(".dropdown-content").append("<div id='save' class='dropdown-item'>Save Grid...</div>");
  //$(".dropdown-content").append("<div id='close' class='dropdown-item'>Close Editor...</div>");
  
  $(".header").append("<div class='options'></div>");
  $(".options").append("<div class='option-title'>Options: </div>");
  
  for( var i=0; i<m_tileTypeCount; i++){
    $(".options").append("<div title=" + m_tooltips[i] + " class='option t" + i + "'></div>");
  }
  $('.t0').addClass("selected");
  
  $(".content").append("<div class='grid'></div>");
  
  $(".content").append("<div class='level-name'></div>");
  
  $(".content").append("<div class='world-up'></div>");
  $(".content").append("<div class='world-down'></div>");
  $(".content").append("<div class='world-left'></div>");
  $(".content").append("<div class='world-right'></div>");
  
  $(".world-up").append("<div class='arrow-up'></div>");
  $(".world-down").append("<div class='arrow-down'></div>");
  $(".world-left").append("<div class='arrow-left'></div>");
  $(".world-right").append("<div class='arrow-right'></div>");
  
  $(".newWindow").append("<div class='new-info'>Rows:</div>");
  $(".newWindow").append("<input id='row-num' type='number' value='15'>");
  $(".newWindow").append("<div class='new-info'>Cols:</div>");
  $(".newWindow").append("<input id='col-num' type='number' value='20'>");
  $(".newWindow").append("<div id='submit-new' class='button'>Submit</div>");
  $(".newWindow").append("<div id='close-new' class='button'>Cancel</div>");
  
  $(".saveWindow").append("<div class='save-info'>Please enter a name for the file...</div>");
  $(".saveWindow").append("<input id='save-text' type='text'>");
  $(".saveWindow").append("<div id='submit-save' class='button'>Submit</div>");
  $(".saveWindow").append("<div class='button'>Cancel</div>");
  
  $(".openWindow").append("<div class='open-info'>Please enter the name of the file...</div>");
  $(".openWindow").append("<input id='open-text' type='text'>");
  $(".openWindow").append("<div id='submit-open' class='button'>Submit</div>");
  $(".openWindow").append("<div class='button'>Cancel</div>");
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
    $("body").on("click", ".dropdown-item",function() {
        if( $(this).attr("id") == "new") {
          // popupNew();
          createGrid();
        } else if( $(this).attr("id") == "open") {
          popupOpen();
        } else if( $(this).attr("id") == "save") {
          //popupSave();
          saveGrid();
        } else if( $(this).attr("id") == "close") {
          closeEditor();
        } else {
          console.log("unknown item");
        }
        $(".dropdown").removeClass("hover");
    });
    
    $("body").on("click", ".option",function() {
      var cn = "";
      cn  = $(this).attr("class");
      var number = parseInt(cn.substring(cn.lastIndexOf('t') + 1));
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
    
    $("body").on("click", ".gridspace",function() {
      var index = parseInt($(this).attr("id"));
      m_grid[index] = m_optionSelection;
      
      var lastClass = $(this).attr('class').split(' ').pop();
      $(this).removeClass(lastClass);
      $(this).addClass("t" + m_optionSelection.toString());
    });
    
    $("body").on("click", "#submit-new",function() {
      m_rows = $('#row-num').val();
      m_cols = $('#col-num').val();
      createGrid();
    });
    
    $("body").on("click", "#submit-save",function() {
      saveGrid();
    });
    
    $("body").on("click", "#submit-open",function() {
      openGrid();
    });
    
    $("body").on("click", ".button",function() {
      $('.newWindow').css("visibility", "hidden");
      $('.saveWindow').css("visibility", "hidden");
      $('.openWindow').css("visibility", "hidden");
      $('#save-text').val("level");
      $('#open-text').val("level");
    });
    
    $("body").on("click", ".world-up", function() {
      if(m_worldLoc.y > 0) {
        m_worldLoc.y--;
        m_name = levelCRToFilename(m_worldLoc.x,m_worldLoc.y);
        $(".level-name").text(m_name);
        openGrid();
      }
    });
    
    $("body").on("click", ".world-down", function() {
      if(m_worldLoc.y < 9) {
        m_worldLoc.y++;
        m_name = levelCRToFilename(m_worldLoc.x,m_worldLoc.y);
        $(".level-name").text(m_name);
        openGrid();
      }
    });
    
    $("body").on("click", ".world-left", function() {
      if(m_worldLoc.x > 0) {
        m_worldLoc.x--;
        m_name = levelCRToFilename(m_worldLoc.x,m_worldLoc.y);
        $(".level-name").text(m_name);
        openGrid();
      }
    });
    
    $("body").on("click", ".world-right", function() {
      if(m_worldLoc.x < 8) {
        m_worldLoc.x++;
        m_name = levelCRToFilename(m_worldLoc.x,m_worldLoc.y);
        $(".level-name").text(m_name);
        openGrid();
      }
    });
}

function createGrid() {
  // Create a new grid
  makeGrid(m_cols, m_rows, []);
}

function openGrid() {
  // Open a grid
  //$('#open-text').val()
  $.getJSON( "levels/"+ m_name +".json", function( data ) {
    m_rows = data["rows"];
    m_cols = data["cols"];
    m_grid = data["gridspaces"];
    makeGrid(m_cols, m_rows, m_grid);
  });
  
}

function saveGrid() {
  // Save grid to file
  //m_name = $('#save-text').val();
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

function popupNew() {
  $('.newWindow').css("visibility", "visible");
}

function popupSave() {
  $('.saveWindow').css("visibility", "visible");
}

function popupOpen() {
  $('.openWindow').css("visibility", "visible");
}

function makeGrid(w,h,arr) {
  var num = 0;
  if(arr.length <= 0) {
    m_grid = [w*h];
  }
  
  $(".grid").text("");
  $(".grid").css("width", (2*w).toString() + "rem");
  $(".grid").css("height", (2*h).toString() + "rem");
  
  for(var i=0; i<h; i++) {
    var row = document.createElement("div");
    row.className = "row";
    for(var j=0; j<w; j++){
      var gridspace = document.createElement("div");
      gridspace.id = num;
      if(arr.length <= 0) {
        gridspace.className = "gridspace t1";
        m_grid[num] = 1;
      } else {
        gridspace.className = "gridspace t" + arr[num].toString();
      }
      row.appendChild(gridspace);
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
        var json = levelCRToFilename(m_worldLoc.x,m_worldLoc.y) + " = " + JSON.stringify(data),
            blob = new Blob([json], {type: "json"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName + ".json";
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

// Code from @chris_deleon
function levelCRToFilename(someC, someR) {
  return "level"+someC+ String.fromCharCode(97+someR); // 97 = 'a'
}