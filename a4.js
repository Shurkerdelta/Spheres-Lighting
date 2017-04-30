// primitives.js
//   This code uses the libraries from the WebGL book,

//----------- declare globals  ------------------------------------------------------

var gl;              // GL rendering context
var gModelViewMatrix = new Matrix4();  // create new 4x4 matrix
var g_aniTime = 0;      // global elapsed time, as measured in seconds
var g_updateTime;    // time stamp of the last update() call
var canvas;          // canvas that WebGL will use to draw
var gCamera;
var gRotating = false;  // turntable rotation

var gTextureNumber = 1;

var gLight = { direction: new Vector4() };

var gCanvasWidth = 0;
var gCanvasHeight = 0;

// geometry
var gCube;
var gPlane;
var gMesh;
var gPlaneBase;

// shaders
var gMeshProg = new ShaderProgram();          // vertex shader
var gColourProg = new ShaderProgram();        // fragment shader

// textures
var gMeshTextureA = null;
var gMeshTextureB = null;
var gMeshTextureC = null;
var gMeshTextureD = null;

var gMeshTextureS = null;
var gMeshTextureM = null;
var gMeshTextureR = null;
var gMeshTextureAD = null;

var gRotTheta = 0;

//----------- main()   --------------------------------------------------------------

function main() {    
    canvas = mySetup();       // setup shaders, send vertices to the GPU
    
    // Set clear color and enable hidden surface removal
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Register the event handler to be called on key press
    document.onkeydown = function(ev){ keydown(ev); };

    animate();
}

//----------- animate()   --------------------------------------------------------------

function animate() {
  var tick = function() {                // create the callback function
    update();
    draw();
    requestAnimationFrame(tick, canvas); // Request that the browser calls tick
  };
  tick();                // now call it once. Further calls will be via the requests
}

//----------- update()   --------------------------------------------------------------

function update() {
    if (gRotating) {
      dt = (Date.now() - g_updateTime)/1000;   // dt = time elapsed since the last call to update(), converted to seconds
      g_aniTime += dt;                         // advance the animation time by this amount
      gRotTheta = g_aniTime * 40;              // compute rotation angle, in degrees, as a function of time
      gRotTheta = gRotTheta % 360;             // wrap around from 360 to zero, if needed
      g_updateTime = Date.now();               // time stamp for this update() call
    }
}

//----------- draw()   --------------------------------------------------------------

function draw() {
    // draw actual scene
    gl.viewport(0, 0, gCanvasWidth, gCanvasHeight);
    
    // Clear color and depth buffer
    gl.clearColor(0.7, 0.8, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (gMeshProg.loaded)            // be sure that vertex shader is loaded
    {
        drawScene(gMeshProg, gCamera);
    }
}

function drawScene(prog, camera)
{
    prog.Bind();

    // setup projection matrix
    var proj_matrix = camera.getProjectionMatrix();
    gl.uniformMatrix4fv(prog.uniforms.u_ProjectionMatrix, false, proj_matrix.elements);

    // Set the eye point and the viewing volume
    gModelViewMatrix = camera.getViewMatrix();


    // draw ground
    gMeshTextureA.bind(gl.TEXTURE0);
    gl.uniform1i(prog.uniforms.u_AlbedoTex, 0);
    var ground_colour = [0.0, 1.0, 0.0, 1];
    gl.uniform4f(prog.uniforms.u_FragColor, ground_colour[0], ground_colour[1], ground_colour[2], ground_colour[3]);
    gl.uniform1f(prog.uniforms.u_DistortionTime, 0.0);
    gl.uniform1f(prog.uniforms.u_DistortionAmp, 0.0);
    gPlaneBase.bindVertices(prog.attributes.a_Position);
    gPlaneBase.bindTexCoords(prog.attributes.a_TexCoord);
    drawGroundBase(prog);

      // draw ground
    gMeshTextureA.bind(gl.TEXTURE0); 
    gl.uniform1i(prog.uniforms.u_AlbedoTex, 0);
    var ground_colour = [0.8, 0.6, 0.4, 1];
    gl.uniform4f(prog.uniforms.u_FragColor, ground_colour[0], ground_colour[1], ground_colour[2], ground_colour[3]);
    gl.uniform1f(prog.uniforms.u_DistortionTime, 0.0);
    gl.uniform1f(prog.uniforms.u_DistortionAmp, 0.0);
    gPlane.bindVertices(prog.attributes.a_Position);
    gPlane.bindTexCoords(prog.attributes.a_TexCoord);
    drawGround(prog);

      // draw bunny
    if (gMesh.loaded) {           // make sure the mesh is fully loaded before drawing
          // assign texture based on the textureNumber
        switch(gTextureNumber) {
            case 0:
                gMeshTextureB.bind(gl.TEXTURE1);     // use texture B
                gMeshTextureB.bind(gl.TEXTURE3);
                gMeshTextureB.bind(gl.TEXTURE4);
                gMeshTextureB.bind(gl.TEXTURE5);
                gMeshTextureB.bind(gl.TEXTURE6);
	      break;
	    case 1:
	        gMeshTextureD.bind(gl.TEXTURE1);     // use texture D
	        gMeshTextureAD.bind(gl.TEXTURE3);
	        gMeshTextureR.bind(gl.TEXTURE4);
	        gMeshTextureM.bind(gl.TEXTURE5);
	        gMeshTextureS.bind(gl.TEXTURE6);
	      break;
            default:
                gMeshTextureB.bind(gl.TEXTURE1);
                gMeshTextureB.bind(gl.TEXTURE3);
                gMeshTextureB.bind(gl.TEXTURE4);
                gMeshTextureB.bind(gl.TEXTURE5);
                gMeshTextureB.bind(gl.TEXTURE6);
	}
        gl.uniform1i(prog.uniforms.u_AlbedoTex, 1);
        gMesh.bindVertices(prog.attributes.a_Position);
        gMesh.bindVertices(prog.attributes.a_Normal);
        gMesh.bindTexCoords(prog.attributes.a_TexCoord);
        var mesh_colour = [0.2, 0.9, 0.5, 1];
        gl.uniform4f(prog.uniforms.u_FragColor, mesh_colour[0], mesh_colour[1], mesh_colour[2], mesh_colour[3]);
	gl.uniform1f(prog.uniforms.u_DistortionTime, g_aniTime);
        gl.uniform1f(prog.uniforms.u_DistortionAmp, 0.05);
        drawMesh(prog);

        gl.uniform1i(prog.uniforms.u_AlbedoTex, 3);
        var mesh_colour = [1.0, 0.55, 0.0, 1];
        gl.uniform4f(prog.uniforms.u_FragColor, mesh_colour[0], mesh_colour[1], mesh_colour[2], mesh_colour[3]);
        gl.uniform1f(prog.uniforms.u_DistortionTime, g_aniTime);
        gl.uniform1f(prog.uniforms.u_DistortionAmp, 0.05);
        drawMesha(prog);

        gl.uniform1i(prog.uniforms.u_AlbedoTex, 4);
        var mesh_colour = [0.4, 0.0, 1.0, 1];
        gl.uniform4f(prog.uniforms.u_FragColor, mesh_colour[0], mesh_colour[1], mesh_colour[2], mesh_colour[3]);
        gl.uniform1f(prog.uniforms.u_DistortionTime, g_aniTime);
        gl.uniform1f(prog.uniforms.u_DistortionAmp, 0.05);
        drawMeshb(prog);

        gl.uniform1i(prog.uniforms.u_AlbedoTex, 5);
        var mesh_colour = [1.0, 0.2, 0.8, 1];
        gl.uniform4f(prog.uniforms.u_FragColor, mesh_colour[0], mesh_colour[1], mesh_colour[2], mesh_colour[3]);
        gl.uniform1f(prog.uniforms.u_DistortionTime, g_aniTime);
        gl.uniform1f(prog.uniforms.u_DistortionAmp, 0.05);
        drawMeshc(prog);

        gl.uniform1i(prog.uniforms.u_AlbedoTex, 6);
        var mesh_colour = [0.0, 1.0, 1.0, 1];
        gl.uniform4f(prog.uniforms.u_FragColor, mesh_colour[0], mesh_colour[1], mesh_colour[2], mesh_colour[3]);
        gl.uniform1f(prog.uniforms.u_DistortionTime, g_aniTime);
        gl.uniform1f(prog.uniforms.u_DistortionAmp, 0.05);
        drawMeshd(prog);
    }

     // draw cube
    gMeshTextureC.bind(gl.TEXTURE2);              // 
    gl.uniform1i(prog.uniforms.u_AlbedoTex, 2);
    var cube_colour = [1.0, 1.0, 1.0, 1];
    gl.uniform4f(prog.uniforms.u_FragColor, cube_colour[0], cube_colour[1], cube_colour[2], cube_colour[3]);
    gl.uniform1f(prog.uniforms.u_DistortionTime, 0.0);
    gl.uniform1f(prog.uniforms.u_DistortionAmp, 0.0);
    gCube.bindVertices(prog.attributes.a_Position);
    gCube.bindTexCoords(prog.attributes.a_TexCoord);
    drawCube(prog);

}

function drawCube(prog)
{
    var cube_size = 2;
    pushMatrix(gModelViewMatrix);

    gModelViewMatrix.translate(0, 2, 0);
    gModelViewMatrix.scale(cube_size, cube_size, cube_size);
    gl.uniformMatrix4fv(prog.uniforms.u_ModelViewMatrix, false, gModelViewMatrix.elements); // send matrix over to gpu

    gCube.draw();

    gModelViewMatrix = popMatrix();
}

function drawGround(prog)
{
    pushMatrix(gModelViewMatrix);
    gl.uniformMatrix4fv(prog.uniforms.u_ModelViewMatrix, false, gModelViewMatrix.elements); // send matrix over to gpu
    gPlane.draw();
    gModelViewMatrix = popMatrix();
}

function drawGroundBase(prog) {
    pushMatrix(gModelViewMatrix);
    gl.uniformMatrix4fv(prog.uniforms.u_ModelViewMatrix, false, gModelViewMatrix.elements); // send matrix over to gpu
    gPlaneBase.draw();
    gModelViewMatrix = popMatrix();
}

function drawMesh(prog)
{
    var mesh_scale = 50.0;
    pushMatrix(gModelViewMatrix);
    gModelViewMatrix.translate(0, 2.2, 0);
    gModelViewMatrix.scale(mesh_scale, mesh_scale, mesh_scale);
    gModelViewMatrix.rotate(gRotTheta, 0, 1, 0);
    gl.uniformMatrix4fv(prog.uniforms.u_ModelViewMatrix, false, gModelViewMatrix.elements); // send matrix over to gpu
    gMesh.draw();
    gModelViewMatrix = popMatrix();
}

function drawMesha(prog) {
    var mesh_scale = 50.0;
    pushMatrix(gModelViewMatrix);
    gModelViewMatrix.translate(8, -1, 8);
    gModelViewMatrix.scale(mesh_scale, mesh_scale, mesh_scale);
    gModelViewMatrix.rotate(gRotTheta, 0, 1, 0);
    gl.uniformMatrix4fv(prog.uniforms.u_ModelViewMatrix, false, gModelViewMatrix.elements); // send matrix over to gpu
    gMesh.draw();
    gModelViewMatrix = popMatrix();
}

function drawMeshb(prog) {
    var mesh_scale = 50.0;
    pushMatrix(gModelViewMatrix);
    gModelViewMatrix.translate(-8, -1, 8);
    gModelViewMatrix.scale(mesh_scale, mesh_scale, mesh_scale);
    gModelViewMatrix.rotate(gRotTheta, 0, 1, 0);
    gl.uniformMatrix4fv(prog.uniforms.u_ModelViewMatrix, false, gModelViewMatrix.elements); // send matrix over to gpu
    gMesh.draw();
    gModelViewMatrix = popMatrix();
}

function drawMeshc(prog) {
    var mesh_scale = 50.0;
    pushMatrix(gModelViewMatrix);
    gModelViewMatrix.translate(-8, -1, -8);
    gModelViewMatrix.scale(mesh_scale, mesh_scale, mesh_scale);
    gModelViewMatrix.rotate(gRotTheta, 0, 1, 0);
    gl.uniformMatrix4fv(prog.uniforms.u_ModelViewMatrix, false, gModelViewMatrix.elements); // send matrix over to gpu
    gMesh.draw();
    gModelViewMatrix = popMatrix();
}

function drawMeshd(prog) {
    var mesh_scale = 50.0;
    pushMatrix(gModelViewMatrix);
    gModelViewMatrix.translate(8, -1, -8);
    gModelViewMatrix.scale(mesh_scale, mesh_scale, mesh_scale);
    gModelViewMatrix.rotate(gRotTheta, 0, 1, 0);
    gl.uniformMatrix4fv(prog.uniforms.u_ModelViewMatrix, false, gModelViewMatrix.elements); // send matrix over to gpu
    gMesh.draw();
    gModelViewMatrix = popMatrix();
}

//----------- pushMatrix()   -----------------------------------------------------------

var g_matrixStack = []; // Array for storing a matrix
function pushMatrix(m) { // Store the specified matrix to the array
  var m2 = new Matrix4(m);
  g_matrixStack.push(m2);
}

//----------- popMatrix()   -----------------------------------------------------------

function popMatrix() { // Retrieve the matrix from the array
  return g_matrixStack.pop();
}

//----------- keydown()   -----------------------------------------------------------

function keydown(ev) {
    if(ev.keyCode == 65) { // 'a' key pressed
        gCamera.rotate(-10, 0, 1, 0);
    } else 
    if (ev.keyCode == 83) { // 's' key pressed
        gCamera.rotate(10, 0, 1, 0);
    } else
    if (ev.keyCode == 84) { // 't' key pressed
        gTextureNumber = (gTextureNumber + 1)%2;     // cycle through two textures for the bunny
    } else
    if (ev.keyCode == 32) { // space key pressed
        gRotating = !gRotating;   // toggle rotation
        if (gRotating)
           g_updateTime = Date.now();   // 
    } else { return; }
}

//----------- mySetup()   -----------------------------------------------------------

function mySetup() {
    var canvas = document.getElementById('webgl');
    gl = getWebGLContext(canvas);          // get rendering context 
    if (!gl) throw 'Failed to get the rendering context for WebGL';

    gCanvasWidth = canvas.width;
    gCanvasHeight = canvas.height;

    setupCamera();
    setupLight();
    buildGeometry();
    setupShaders();
    loadTextures();

    return canvas;
}

function setupCamera()
{
    var fovy = 30;
    var aspect_ratio = gCanvasWidth / gCanvasHeight;
    var near = 1;
    var far = 100;
    
    var eyeX = 8;
    var eyeY = 20;
    var eyeZ = 30;

    var centerX = 0;
    var centerY = 0;
    var centerZ = 0;

    var upX = 0;
    var upY = 1;
    var upZ = 0;

    gCamera = new Camera();
    gCamera.buildPerspectiveCam(fovy, aspect_ratio, near, far,
                                 eyeX, eyeY, eyeZ,
                                 centerX, centerY, centerZ,
                                 upX, upY, upZ);
}

function setupLight()
{
    // a directional light source
    gLight.direction.elements[0] = 25;
    gLight.direction.elements[1] = 40;
    gLight.direction.elements[2] = 15;
    gLight.direction.elements[3] = 0;
}

function setupShaders()
{
    // mesh shader
    // samples from a texture map
    gMeshProg.Build(gl, 'shaders//mesh_vs.glsl', 'shaders//mesh_fs.glsl',
        function () {
            gMeshProg.SetupUniform('u_ModelViewMatrix');
            gMeshProg.SetupUniform('u_ProjectionMatrix');
            gMeshProg.SetupUniform('u_FragColor');
            gMeshProg.SetupUniform('u_AlbedoTex');
            gMeshProg.SetupUniform('u_DistortionTime');
            gMeshProg.SetupUniform('u_DistortionAmp');

            gMeshProg.SetupAttribute('a_Position');
            gMeshProg.SetupAttribute('a_TexCoord');
    });
}

function loadTextures()
{
      //  default texture parameters, which expect 128 x 128 RGBA images
    var tex_paramsA = new TextureParams(gl);
    var tex_paramsB = new TextureParams(gl);
    var tex_paramsC = new TextureParams(gl);
    var tex_paramsD = new TextureParams(gl);

    var tex_paramsR = new TextureParams(gl);
    var tex_paramsM = new TextureParams(gl);
    var tex_paramsAD = new TextureParams(gl);
    var tex_paramsS = new TextureParams(gl);

      // modify parameters here, as desired
    tex_paramsA.wrapS = gl.REPEAT;     // one of:  REPEAT, CLAMP_TO_EDGE
    tex_paramsA.wrapT = gl.REPEAT;     // one of:  REPEAT, CLAMP_TO_EDGE
    tex_paramsA.magFilter = gl.LINEAR;        // one of:  NEAREST, LINEAR
    tex_paramsA.minFilter = gl.LINEAR_MIPMAP_LINEAR;  // one of:  NEAREST, LINEAR, LINEAR_MIPMAP_LINEAR,  NEAREST_MIPMAP_LINEAR

    tex_paramsB.wrapS = gl.REPEAT;       // one of:  REPEAT, CLAMP_TO_EDGE
    tex_paramsB.wrapT = gl.REPEAT;       // one of:  REPEAT, CLAMP_TO_EDGE
    tex_paramsB.magFilter = gl.LINEAR;  // one of:  NEAREST, LINEAR
    tex_paramsB.minFilter = gl.LINEAR_MIPMAP_LINEAR;  // one of:  NEAREST, LINEAR, LINEAR_MIPMAP_LINEAR,  NEAREST_MIPMAP_LINEAR

    tex_paramsC.wrapS = gl.REPEAT;       // one of:  REPEAT, CLAMP_TO_EDGE
    tex_paramsC.wrapT = gl.REPEAT;       // one of:  REPEAT, CLAMP_TO_EDGE
    tex_paramsC.magFilter = gl.LINEAR;  // one of:  NEAREST, LINEAR
    tex_paramsC.minFilter = gl.LINEAR_MIPMAP_LINEAR;  // one of:  NEAREST, LINEAR, LINEAR_MIPMAP_LINEAR,  NEAREST_MIPMAP_LINEAR

    tex_paramsD.wrapS = gl.REPEAT;       // one of:  REPEAT, CLAMP_TO_EDGE
    tex_paramsD.wrapT = gl.REPEAT;       // one of:  REPEAT, CLAMP_TO_EDGE
    tex_paramsD.magFilter = gl.LINEAR;  // one of:  NEAREST, LINEAR
    tex_paramsD.minFilter = gl.NEAREST;  // one of:  NEAREST, LINEAR, LINEAR_MIPMAP_LINEAR,  NEAREST_MIPMAP_LINEAR

    tex_paramsAD.wrapS = gl.REPEAT;
    tex_paramsAD.wrapT = gl.REPEAT;
    tex_paramsAD.magFilter = gl.LINEAR;
    tex_paramsAD.minFilter = gl.LINEAR_MIPMAP_LINEAR;

    tex_paramsR.wrapS = gl.REPEAT;
    tex_paramsR.wrapT = gl.REPEAT;
    tex_paramsR.magFilter = gl.LINEAR;
    tex_paramsR.minFilter = gl.LINEAR_MIPMAP_LINEAR;

    tex_paramsS.wrapS = gl.REPEAT;
    tex_paramsS.wrapT = gl.REPEAT;
    tex_paramsS.magFilter = gl.LINEAR;
    tex_paramsS.minFilter = gl.LINEAR_MIPMAP_LINEAR;

    tex_paramsM.wrapS = gl.REPEAT;
    tex_paramsM.wrapT = gl.REPEAT;
    tex_paramsM.magFilter = gl.LINEAR;
    tex_paramsM.minFilter = gl.LINEAR_MIPMAP_LINEAR;

      // now load and setup the texture maps 
    gMeshTextureA = new Texture("textures//ground.png", tex_paramsA);       // used for ground plane 
    gMeshTextureB = new Texture("textures//ubcLogo.png", tex_paramsB);      // used for bunny
    gMeshTextureC = new Texture("textures//fourImages.png", tex_paramsC);   // used for cube faces
    gMeshTextureD = new Texture("textures//Vancouver_Canucks_logo.png", tex_paramsD);      // to show the problems of "nearest" sampling

    gMeshTextureAD = new Texture("textures//Anaheim_Ducks.png", tex_paramsAD);
    gMeshTextureR = new Texture("textures//new_york_rangers.png", tex_paramsR);
    gMeshTextureS = new Texture("textures//sharks.png", tex_paramsS);
    gMeshTextureM = new Texture("textures//montreal.png", tex_paramsM);
}

// ---------------- build meshes ------------------------

function buildGeometry()
{
    buildCube();
    buildPlane();
    buildPlaneBase();
    
    gMesh = new Mesh(gl);
    gMesh.loadMesh('meshes//bunny.obj');
//    gMesh.loadMesh('meshes//teapot.obj');
}

function buildCube()
{
    // setup cube
    var cube_verts = [
         // Front face
            -1.0, -1.0, 1.0,
             1.0, -1.0, 1.0,
             1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
             1.0, 1.0, -1.0,
             1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
             1.0, 1.0, 1.0,
             1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
             1.0, -1.0, -1.0,
             1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
             1.0, -1.0, -1.0,
             1.0, 1.0, -1.0,
             1.0, 1.0, 1.0,
             1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0
    ];

    var cube_normals = [
            // Front face
             0.0, 0.0, 1.0,
             0.0, 0.0, 1.0,
             0.0, 0.0, 1.0,
             0.0, 0.0, 1.0,

             // Back face
             0.0, 0.0, -1.0,
             0.0, 0.0, -1.0,
             0.0, 0.0, -1.0,
             0.0, 0.0, -1.0,

             // Top face
             0.0, 1.0, 0.0,
             0.0, 1.0, 0.0,
             0.0, 1.0, 0.0,
             0.0, 1.0, 0.0,

             // Bottom face
             0.0, -1.0, 0.0,
             0.0, -1.0, 0.0,
             0.0, -1.0, 0.0,
             0.0, -1.0, 0.0,

             // Right face
             1.0, 0.0, 0.0,
             1.0, 0.0, 0.0,
             1.0, 0.0, 0.0,
             1.0, 0.0, 0.0,

             // Left face
             -1.0, 0.0, 0.0,
             -1.0, 0.0, 0.0,
             -1.0, 0.0, 0.0,
             -1.0, 0.0, 0.0,
    ];

    var cube_tex_coords= [
         // Front face
          0.0, 0.0,
          0.36, 0.0,
          0.36, 0.5,
          0.0, 0.5,

          // Back face
          0.95, 0.5,
          0.95, 1.0,
          0.3, 1.0,
          0.3, 0.5,

          // Top face
          0.0, 1.0,
          0.0, 0.5,
          0.35, 0.5,
          0.35, 1.0,

          // Bottom face
          1.0, 1.0,
          0.0, 1.0,
          0.0, 0.0,
          1.0, 0.0,

          // Right face
          1.0, 0.0,
          1.0, 0.5,
          0.4, 0.5,
          0.4, 0.0,

          // Left face
          0.0, 0.5,
          0.35, 0.5,
          0.35, 1.0,
          0.0, 1.0,
    ];

    var cube_indices = [       // indices 
        0, 1, 2,        0, 2, 3,    // Front face
        4, 5, 6,        4, 6, 7,    // Back face
        8, 9, 10,       8, 10, 11,  // Top face
        12, 13, 14,     12, 14, 15, // Bottom face
        16, 17, 18,     16, 18, 19, // Right face
        20, 21, 22,     20, 22, 23  // Left face
    ];

    gCube = new Mesh(gl);
    gCube.setVertices(cube_verts);
    gCube.setNormals(cube_normals);
    gCube.setTexCoords(cube_tex_coords);
    gCube.setIndices(cube_indices);
}

function buildPlane()
{
    // setup plane
    var plane_verts = [-10, 0, -10,
                        10, 0, -10,
                        10, 0, 10,
                        -10, 0, 10];

    var plane_normals = [0, 1, 0,
                         0, 1, 0,
                         0, 1, 0,
                         0, 1, 0];

    var plane_tex_coords = [0, 0,
                     4, 0,
                     4,4,
                     0, 4];

      // now define the two triangles that define the ground plane, using their vertex indices
    var plane_indices = [0, 2, 1,
                         2, 0, 3];

    gPlane = new Mesh(gl);
    gPlane.setVertices(plane_verts);
    gPlane.setNormals(plane_normals);
    gPlane.setTexCoords(plane_tex_coords);
    gPlane.setIndices(plane_indices);
}

function buildPlaneBase() {
    // setup plane
    var plane_verts = [-100, -0.1, -100,
                        100, -0.1, -100,
                        100, -0.1, 100,
                        -100, -0.1, 100];

    var plane_normals = [0, 1, 0,
                         0, 1, 0,
                         0, 1, 0,
                         0, 1, 0];

    var plane_tex_coords = [0, 0,
                     4, 0,
                     4, 4,
                     0, 4];

    // now define the two triangles that define the ground plane, using their vertex indices
    var plane_indices = [0, 2, 1,
                         2, 0, 3];

    gPlaneBase = new Mesh(gl);
    gPlaneBase.setVertices(plane_verts);
    gPlaneBase.setNormals(plane_normals);
    gPlaneBase.setTexCoords(plane_tex_coords);
    gPlaneBase.setIndices(plane_indices);
}