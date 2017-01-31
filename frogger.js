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

const LEFTARROW = 37;
const UPARROW = 38;
const RIGHTARROW = 39;
const DOWNARROW = 40;

const lanes = 5;
const jumpSize = 2/(lanes + 2);
const carHeight = 8/10 * jumpSize;

var canvas;
var gl;
var score = 0;
var nw; // constant to "normalize width"
var xmove;
var ymove;
var leftarrowReleased = true;
var uparrowReleased = true;
var rightarrowReleased = true;
var downarrowReleased = true;

var frogv; // frog position

var frogc = vec4(0.0, 1.0, 0.0, 1.0); // frog color

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

    window.addEventListener("keydown", moveFrog);
    window.addEventListener("keyup", togglArrowkeyReleased);

    render();
}

function moveFrog(e) {
  xmove = 0.0;
  ymove = 0.0;
  switch ( e.keyCode ) {
    case LEFTARROW:
      if ( leftarrowReleased ) {
        leftarrowReleased = false;
        xmove = -nw*jumpSize;
        ymove = 0.0;
      }
      break;
    case RIGHTARROW:
      if ( rightarrowReleased ) {
        rightarrowReleased = false;
        xmove = nw*jumpSize;
        ymove = 0.0;
      }
      break;
    case UPARROW:
      if ( uparrowReleased ) {
        uparrowReleased = false;
        xmove = 0.0;
        ymove = jumpSize;
      }
      break;
    case DOWNARROW:
      if ( downarrowReleased ) {
        downarrowReleased = false;
        xmove = 0.0;
        ymove = -jumpSize;
      }
      break;
  }
  for(i=0; i<frogv.length; i++) {
    frogv[i][0] += xmove;
    frogv[i][1] += ymove;
  }
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(frogv));
}

function togglArrowkeyReleased(e) {
  switch ( e.keyCode ) {
    case LEFTARROW:
      leftarrowReleased = true;
    case UPARROW:
      uparrowReleased = true;
    case RIGHTARROW:
      rightarrowReleased = true;
    case DOWNARROW:
      downarrowReleased = true;
  }
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









