/////////////////////////////////////////////////
//
//  HEADER, todo
//
/////////////////////////////////////////////////

// Extra from baseversion:
//   Increase carLanes to 5
//   Cars in different colors
//
// background (walking lanes): 800x400
// laneSpace:                  800x300
// lane:                       800x100
// car on lane:                   x080

const MAX_TIME_BETWEEN_UPDATES_MS = 50;

const lanes = 5;
const jumpSize = 2/(lanes + 2);
const carHeight = 8/10 * jumpSize;
const keys = [];

var canvas;
var gl;
var score = 0;
var nw; // constant to "normalize width"
var lastTime = 0;

var frogv; // frog position
var frogc = vec4(0.0, 1.0, 0.0, 1.0); // frog color

class Renderable {
  constructor(name) {
    this.name = name;
  }

  render() {
    console.log('rendering: ', this.name);
  }
}

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Frog extends Renderable {
  constructor(pos) {
    super('Frog');
    this.pos = pos;
    this.height = 40;
    this.width = 40;
    this.jumpDistance = jumpSize;
    this.directions = {
      NORTH: 0,
      SOUTH: 1,
    }
    this.direction = this.directions.NORTH;
  }

  render() {
    console.log('frog.render()');
  }

  moveDown() {
    this.pos.y += frog.jumpDistance;
    this.direction = this.directions.SOUTH;
  }

  moveUp() {
    this.pos.y -= frog.jumpDistance;
    this.directions = this.directions.NORTH;
  }

  moveRight() {
    this.pos.x += frog.jumpDistance;
  }

  moveLeft() {
    this.pos.x -= frog.jumpDistance;
  }
}

///////////////// INITIALIZE GAME //////////////////////////

window.onload = function init() {
  canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height ); // define viewport width
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 ); // define background color

    nw = canvas.height/canvas.width; // ratio to normalize width of items
    initFrog();

    // Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Define buffer and load data to GPU
    bufferIdFrog = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdFrog );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(frogv), gl.DYNAMIC_DRAW );

    // Get location of shader variable vPosition
    locPosition = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( locPosition );

    // Get location of shader variable rcolor
    locColor = gl.getUniformLocation( program, "rcolor" );

    window.addEventListener("keydown", e=> {
      if (e.repeat) {
      } else {
          keys[e.key] = true;
      }
    });
    window.addEventListener("keyup", e=> {
      keys[e.key] = false;
    });

    // Start game
    main();
}

function gameFunction(du) {
  update(du);
  render();
  //render(ctx);
}

function update(du) {
  if (checkKey("ArrowLeft")) {
    // frog move left
    console.log('move frog left');
  }
  if (checkKey("ArrowRight")) {
    // frog move right
  }
  if (eatKey("ArrowUp")) {
    // frog move up
    console.log('move frog up');
  }
  if (eatKey("ArrowDown")) {
    // frog move down
  }
}

// eatKey :: Key => boolean
// Returns true if "key" was down, and disables it
// returns false otherwise
function eatKey(key) {
  if (keys[key]) {
    keys[key] = false;
    return true;
  } else {
    return false;
  }
}

// checkKey :: key => Boolean
// Returns true if "key" is down
// returns false otherwise.
function checkKey(key) {
  return keys[key];
}

running = true;
function main(time) {
  if (time === undefined) {
    time = lastTime + MAX_TIME_BETWEEN_UPDATES_MS;
  }
  if (eatKey("p")) {
    running = !running;
  }
  if (running) {
    const du = time === undefined ? MAX_TIME_BETWEEN_UPDATES_MS : Math.min(time - lastTime, MAX_TIME_BETWEEN_UPDATES_MS);
    lastTime = time;
    if(isNaN(du)) {
      gameFunction(MAX_TIME_BETWEEN_UPDATES_MS);
    } else {
      gameFunction(du);
    }
  }
  requestAnimFrame(main);
}

function initFrog() {
    // initialize frog position
    frogv = [ vec2( -1, -1 ),
    vec2( -1+nw*jumpSize, -1 ),
    vec2( -1+nw*jumpSize/2, -1+jumpSize ) ];
  }

function render() {
  gl.clear( gl.COLOR_BUFFER_BIT );

  // Draw frog
  gl.bindBuffer( gl.ARRAY_BUFFER, bufferIdFrog ); // bind buffer
  gl.vertexAttribPointer( locPosition, 2, gl.FLOAT, false, 0, 0 );
  gl.uniform4fv( locColor, flatten(frogc) );
  gl.drawArrays( gl.TRIANGLES, 0, 3 );

  window.requestAnimFrame(render);
}









