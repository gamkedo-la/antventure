var m_grid = [];
var m_cols = 20;
var m_rows = 15;
var m_tileTypeCount = 19;
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
  "wiz-hat",
  "armor",
  "cloak",
  "ice",
  "torch"
  ];

var draggingTiles = false;

const KEY_LEFT_ARROW = 37;
const KEY_A = 65;
const KEY_UP_ARROW = 38;
const KEY_W = 87;
const KEY_RIGHT_ARROW = 39;
const KEY_D = 68;
const KEY_DOWN_ARROW = 40;
const KEY_S = 83;
document.addEventListener("keydown", keyPressed);

function keyPressed(evt) {
  if(evt.keyCode == KEY_LEFT_ARROW || evt.keyCode == KEY_A) {
      m_worldLoc.x--;
      openGrid();
  }
  if(evt.keyCode == KEY_RIGHT_ARROW || evt.keyCode == KEY_D) {
      m_worldLoc.x++;
      openGrid();
  }
  if(evt.keyCode == KEY_UP_ARROW || evt.keyCode == KEY_W) {
      m_worldLoc.y--;
      openGrid();
  }
  if(evt.keyCode == KEY_DOWN_ARROW || evt.keyCode == KEY_S) {
      m_worldLoc.y++;
      openGrid();
  }
  evt.preventDefault(); // without this, arrow keys scroll the browser!
}

var m_optionSelection = 0;
var m_name = "level4a: green";
var m_worldLoc = {x:4,y:0};

var roomsToLoadColsW = 9
var roomColors=["#a0a0a0","#808080","green","yellow","red","purple","brown","blue"];
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

function loadLevelsBesidesFirstOne() {
  for(var eachC=0;eachC<9;eachC++) {
    for(var eachR=0;eachR<9;eachR++) {
      if(eachC == m_worldLoc.x && eachR == m_worldLoc.y) {
        continue;
      }
      var roomKind = roomsToLoad[eachC + eachR*roomsToLoadColsW];
      /*if(roomKind == 0) {
        continue;
      }*/
      var imported = document.createElement('script');
      // imported.onerror = noLevelHere;
      imported.src = 'levels/'+levelCRToFilename(eachC,eachR)+".js";
      document.head.appendChild(imported);
    }
  }
}


// Start()
$(function() {
  loadLevelsBesidesFirstOne();
  linkCSS();
  createDOM();
  openGrid();
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
  $(".header").append("<canvas width='45' height='45' id='minimap' style='float:right'>");
  var worldmap = document.getElementById("minimap");
  worldmapContext = worldmap.getContext('2d');

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

  // hidden at Johhny's request -cdeleon feb 4 2016
  /*
  $(".content").append("<div class='world-up'></div>");
  $(".content").append("<div class='world-down'></div>");
  $(".content").append("<div class='world-left'></div>");
  $(".content").append("<div class='world-right'></div>");

  $(".world-up").append("<div class='arrow-up'></div>");
  $(".world-down").append("<div class='arrow-down'></div>");
  $(".world-left").append("<div class='arrow-left'></div>");
  $(".world-right").append("<div class='arrow-right'></div>");
  */

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
      var number = parseInt(cn.substring(cn.indexOf(" t") + 2));
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

    $("body").on("mousedown", ".gridspace",function() {
      draggingTiles = true;
      var index = parseInt($(this).attr("id"));
      m_grid[index] = m_optionSelection;

      var lastClass = $(this).attr('class').split(' ').pop();
      $(this).removeClass(lastClass);
      $(this).addClass("t" + m_optionSelection.toString());
    });
    $("body").on("mouseup", ".gridspace",function() {
      draggingTiles = false;
    });

    $("body").on("mouseenter", ".gridspace",function() {
      if(draggingTiles == false) {
        return;
      }
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
    /* // hidden at Johhny's request -cdeleon feb 4 2016
    $("body").on("click", ".world-up", function() {
      m_worldLoc.y--;
      openGrid();
    });

    $("body").on("click", ".world-down", function() {
      m_worldLoc.y++;
      openGrid();
    });

    $("body").on("click", ".world-left", function() {
      m_worldLoc.x--;
      openGrid();
    });

    $("body").on("click", ".world-right", function() {
      m_worldLoc.x++;
      openGrid();
    });
	*/
}

function createGrid() {
  // Create a new grid
  makeGrid(m_cols, m_rows, []);
}

function openGrid() {

  if(m_worldLoc.x < 0) {
    m_worldLoc.x = 0;
    return;
  }
  if(m_worldLoc.x > 8) {
    m_worldLoc.x = 8;
    return;
  }
  if(m_worldLoc.y < 0) {
    m_worldLoc.y = 0;
    return;
  }
  if(m_worldLoc.y > 8) {
    m_worldLoc.y = 8;
    return;
  }

  worldmapContext.fillStyle="red";
  var ts = 5;
  for(var c=0;c<9;c++) {
    for(var r=0;r<9;r++) {
      var roomHere = roomsToLoad[c + r*roomsToLoadColsW];
      worldmapContext.fillStyle = roomColors[roomHere];
      worldmapContext.fillRect(c*ts,r*ts,ts,ts);
    }
  }
  worldmapContext.beginPath();
  worldmapContext.rect(m_worldLoc.x*ts,m_worldLoc.y*ts, ts,ts);
  worldmapContext.lineWidth = 1;
  worldmapContext.strokeStyle = 'black';
  worldmapContext.stroke();
  worldmapContext.closePath();

  // Open a grid
  //$('#open-text').val()
  var loadingRoomName = levelCRToFilename(m_worldLoc.x,m_worldLoc.y);
  fromJSON = window[loadingRoomName];

  var roomKind = roomsToLoad[m_worldLoc.x + m_worldLoc.y*roomsToLoadColsW];
  $(".level-name").text(loadingRoomName+": "+roomColors[roomKind]);

  m_cols = fromJSON.cols;
  m_rows = fromJSON.rows;
  m_grid = fromJSON.gridspaces;

  makeGrid(m_cols, m_rows, m_grid);

  /*$.get("levels/"+ m_name +".js", function( data ) {
    var content = JSON.parse(data.substring(10));
    m_rows = content["rows"];
    m_cols = content["cols"];
    m_grid = content["gridspaces"];
    makeGrid(m_cols, m_rows, m_grid);
  });*/

}

function saveGrid() {
  // Save grid to file
  //m_name = $('#save-text').val();
  var json = {
    "rows": m_rows,
    "cols": m_cols,
    "gridspaces": m_grid
  };

  m_name = levelCRToFilename(m_worldLoc.x,m_worldLoc.y);
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
    for( var i = 0; i < data.gridspaces.length; i++ ) {
      if(data.gridspaces[i] == null){
        data.gridspaces[i] = 0;
      }
    }

    var json = levelCRToFilename(m_worldLoc.x,m_worldLoc.y) + " = " + JSON.stringify(data),
      blob = new Blob([json], {type: "plain/text"}),
      url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName + ".js";
    a.click();
    window.URL.revokeObjectURL(url);
  };
}());

// Code from @chris_deleon
function levelCRToFilename(someC, someR) {
  return "level"+someC+ String.fromCharCode(97+someR); // 97 = 'a'
}
