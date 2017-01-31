/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Sýnir notkun hnútahnit og hnútalita fléttuð saman í sama
//     minnissvæðinu (buffers) í GPU
//
//    Hjálmtýr Hafsteinsson, janúar 2016
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var vertices = [ vec4( -0.5, -0.5, 0.0, 1.0 ), vec4( 1.0, 0.0, 0.0, 1.0 ),
                 vec4(  0.0,  0.5, 0.0, 1.0 ), vec4( 0.0, 1.0, 0.0, 1.0 ),
                 vec4(  0.5, -0.5, 0.0, 1.0 ), vec4( 0.0, 0.0, 1.0, 1.0 ) ];

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Tökum frá pláss og sendum hnútagögnin yfir
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    // Tengjum hnitin við litarabreytuna vPosition (ath. nú er "stride" 32, því það er stærð blokkarinnar)
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 4*8, 0);
    gl.enableVertexAttribArray(vPosition);
    
    // Tengjum litina við litarabreytuna vColor (ath. nú er "stride" 32 og "offset" 16 því það er stærð hnitanna)
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 4*8, 4*4 );
    gl.enableVertexAttribArray( vColor );

    render();

}


function render() {
    
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, 3 );

    window.requestAnimFrame(render);

}
