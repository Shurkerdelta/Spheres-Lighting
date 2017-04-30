/**
 * UBC CPSC 314, VJan2017
 * Assignment 5 Template
 */

var scene = new THREE.Scene();
var body;
var moon0;
var moon1;

var rubyAngle = 0;
var emeraldAngle1 = 0;
var emeraldAngle0 = 0;

// Setup renderer
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// Setup camera
var aspect = window.innerWidth/window.innerHeight;
var camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 10000);
camera.position.set(0, 45, 150);
camera.lookAt(scene.position); 
scene.add(camera);

// Setup orbit control of camera
var controls = new THREE.OrbitControls(camera);
controls.damping = 0.2;

// Adapt to window resize
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', resize);
resize();

// Planet texture for manual environment mapping of top cube face
var planetTexture = new THREE.ImageUtils.loadTexture('images/planet.jpg');

// Cubemap setup:
// First, prepare paths to load 2D textures for each cube face: 
// {pos x, neg x, pos y, neg y, pos z, neg z}
var path = "cube/";
var format = '.jpeg';
var urls = [
  path + 'px' + format, path + 'nx' + format,
  path + 'py' + format, path + 'ny' + format,
  path + 'pz' + format, path + 'nz' + format
];

// Next, create cubemap with loaded textures in colour format,
// use predefined cube shader libs & pass cubemap ('texturecube')
var cubemap = THREE.ImageUtils.loadTextureCube(urls); 
cubemap.format = THREE.RGBFormat;
var shader = THREE.ShaderLib['cube'];                 
shader.uniforms['tCube'].value = cubemap;             

// Skybox setup:
// First, create shader for skybox, attach shader with loaded cubemap uniform,
// set depthwrite to false to fix z-buffer, and set images to render on inside of cube
var skyBoxMaterial = new THREE.ShaderMaterial( {
  fragmentShader: shader.fragmentShader,
  vertexShader: shader.vertexShader,
  uniforms: shader.uniforms,
  depthWrite: false,                                  
  side: THREE.BackSide                                
});

// Next, create & add new skybox to scene
var skybox = new THREE.Mesh(
  new THREE.CubeGeometry(1000, 1000, 1000),
  skyBoxMaterial
);
scene.add(skybox);

// Lighting parameters for shaders
var lightColor = new THREE.Color(1,1,1);
var ambientColor = new THREE.Color(0.4,0.4,0.4);
var lightDirection = new THREE.Vector3(-0.3, 0.49, 0.49);
var lightDirectionRuby = new THREE.Vector3(-0.3, 0.49, 0.49);

// Material properties for shaders
var kAmbient = 0.4;
var kDiffuse = 0.8;
var kSpecular = 0.8;

var shininess = 10.0;

///////////////////////// Blinn-Phong Shader Material

var blinn_phong_material = new THREE.ShaderMaterial({
    // !!!!!!!!!!!!!!ATTACH REMAINING UNIFORMS HERE!!!!!!!!!!!!!!
    // Here we specify how three.js "binds" the shader uniform variables to Javascript values
    //    See the shader definition, glsl/blinn_phong.fs.glsl,
    //    for the 7 different uniform vars that you need to add.
    // Below we have already added one of these.
    // The relevant Javascript variables that you need to bind to are listed immediately above.

// examples:  
//    
//   myShaderVarUniform: {type: "c", value: myJavascriptVar},   // THREE.Color
//   myShaderVarUniform: {type: "f", value: myJavascriptVar},   // float
//   myShaderVarUniform: {type: "v3", value: myJavascriptVar},  // THREE.Vector3
//   myShaderVarUniform: {type: "v4", value: myJavascriptVar},  // THREE.Vector4

   uniforms: {
     lightColorUniform: {type: "c", value: lightColor},  

     //  add the other six required shader-uniforms-to-Javascript bindings below
     ambientColorUniform: { type: "c", value: ambientColor },
     lightDirectionUniform: { type: "v3", value: lightDirection },
     kAmbientUniform: { type: "f", value: kAmbient },
     kDiffuseUniform: { type: "f", value: kDiffuse },
     kSpecularUniform: { type: "f", value: kSpecular },
     shininessUniform: { type: "f", value: shininess },

  },
});

/////////////////////// Phong Shader Material

var phong_material = new THREE.ShaderMaterial({
   uniforms: {
    // !!!!!!!!!!!!!!ATTACH YOUR UNIFORMS HERE!!!!!!!!!!!!!!
       // see the Blinn-Phong shader for what you will need

       lightColorUniform: { type: "c", value: lightColor },
       ambientColorUniform: { type: "c", value: ambientColor },
       lightDirectionUniform: { type: "v3", value: lightDirection },
       kAmbientUniform: { type: "f", value: kAmbient },
       kDiffuseUniform: { type: "f", value: kDiffuse },
       kSpecularUniform: { type: "f", value: kSpecular },
       shininessUniform: { type: "f", value: shininess },
  },
});

//var ColorSapp = new THREE.Color(0.1, 0.1, 1.0);
var lightDirectionSapp = new THREE.Vector3(-0.25, 0.37, 0.44);

var sapphire_material = new THREE.ShaderMaterial({
    uniforms: {



        lightColorUniform: { type: "c", value: lightColor },
        ambientColorUniform: { type: "c", value: ambientColor },
        lightDirectionUniform: { type: "v3", value: lightDirectionSapp },
        kAmbientUniform: { type: "f", value: kAmbient + 0.1 },
        kDiffuseUniform: { type: "f", value: kDiffuse + 0.1 },
        kSpecularUniform: { type: "f", value: kSpecular + 0.1 },
        shininessUniform: { type: "f", value: shininess },
    },
});

var ruby_material = new THREE.ShaderMaterial({
    uniforms: {


        lightColorUniform: { type: "c", value: lightColor },
        ambientColorUniform: { type: "c", value: ambientColor },
        lightDirectionUniform: { type: "v3", value: lightDirectionRuby },
        kAmbientUniform: { type: "f", value: kAmbient },
        kDiffuseUniform: { type: "f", value: kDiffuse },
        kSpecularUniform: { type: "f", value: kSpecular },
        shininessUniform: { type: "f", value: shininess },
    },
});



// Cubemap texture and planet texture for custom shaders
var cubemapUniform = {type: "t", value: cubemap };
var textureUniform = {type: "t", value: planetTexture };

// Setup shaders and uniforms for lighting models
// Environment Map Shader Material
var reflective_material = new THREE.ShaderMaterial ({
  uniforms: {
    cubemapUniform: cubemapUniform,
    textureUniform: textureUniform,
  }
});


var emerald_material = new THREE.ShaderMaterial({
    uniforms: {
        cubemapUniform: cubemapUniform,
        textureUniform: textureUniform,
    }
});

// Load shader paths
var shaderFiles = [
  'glsl/phong.vs.glsl',
  'glsl/phong.fs.glsl',
  'glsl/blinn_phong.vs.glsl',
  'glsl/blinn_phong.fs.glsl',
  'glsl/reflective.vs.glsl',
  'glsl/reflective.fs.glsl',
  'glsl/sapphire.fs.glsl',
  'glsl/ruby.fs.glsl',
  'glsl/emerald_reflective.fs.glsl',
];

// Load & attach shaders to materials, set update flags to true
new THREE.SourceLoader().load(shaderFiles, function(shaders) {
  phong_material.vertexShader = shaders['glsl/phong.vs.glsl'];
  phong_material.fragmentShader = shaders['glsl/phong.fs.glsl'];
  blinn_phong_material.vertexShader = shaders['glsl/blinn_phong.vs.glsl'];
  blinn_phong_material.fragmentShader = shaders['glsl/blinn_phong.fs.glsl'];
  reflective_material.vertexShader = shaders['glsl/reflective.vs.glsl'];
  reflective_material.fragmentShader = shaders['glsl/reflective.fs.glsl'];

  sapphire_material.vertexShader = shaders['glsl/phong.vs.glsl'];
  sapphire_material.fragmentShader = shaders['glsl/sapphire.fs.glsl'];

  ruby_material.vertexShader = shaders['glsl/phong.vs.glsl'];
  ruby_material.fragmentShader = shaders['glsl/ruby.fs.glsl'];

  emerald_material.vertexShader = shaders['glsl/reflective.vs.glsl'];
  emerald_material.fragmentShader = shaders['glsl/emerald_reflective.fs.glsl'];

  reflective_material.needsUpdate = true;
  phong_material.needsUpdate = true;
  blinn_phong_material.needsUpdate = true;

  sapphire_material.needsUpdate = true;
  ruby_material.needsUpdate = true;
  emerald_material.needsUpdate = true;
})

// Optional: object loader for user-defined meshes
function loadOBJ(file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function(query) {
    if ( query.lengthComputable ) {
      var percentComplete = query.loaded / query.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function() {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader()
  loader.load(file, function(object) {
    object.traverse(function(child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff,yOff,zOff);
    object.rotation.x= xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale,scale,scale);
    object.parent = floor;
    scene.add(object);

  }, onProgress, onError);
}

// Setup, create & add spheres to scenes
var sphere = new THREE.SphereGeometry(8, 16, 16);

var miniSphere = new THREE.SphereGeometry(2, 16, 16);

// Blinn-Phong lighting model sphere
var gem_blinn_phong = new THREE.Mesh(sphere, blinn_phong_material);
gem_blinn_phong.position.set(0, 0, 0);
scene.add(gem_blinn_phong);

// Phong lighting model sphere
var gem_phong = new THREE.Mesh(sphere, phong_material);
gem_phong.position.set(-35, 0, 0);
scene.add(gem_phong);

// Environment mapping model sphere
// !!!!!!!!!!!!!!CHANGE SPHERE MATERIAL!!!!!!!!!!!!!!
var gem_reflective = new THREE.Mesh(sphere, reflective_material);
gem_reflective.position.set(35, 0, 0);
scene.add(gem_reflective);

// Blue Tinted Phong lighting model sphere
var gem_sapp_phong = new THREE.Mesh(sphere, sapphire_material);
gem_sapp_phong.position.set(-35, 35, 0);
scene.add(gem_sapp_phong);

// Phong lighting model sphere
var gem_ruby = new THREE.Mesh(sphere, ruby_material);
scene.add(gem_ruby);
gem_ruby.name = "body";

// Phong lighting model sphere
var gem_mini0 = new THREE.Mesh(miniSphere, emerald_material);

scene.add(gem_mini0);
gem_mini0.matrixAutoUpdate = false;

// Phong lighting model sphere
var gem_mini1 = new THREE.Mesh(miniSphere, emerald_material);
scene.add(gem_mini1);
gem_mini1.matrixAutoUpdate = false;



function setupBody(parentMatrix) {
    gem_ruby.matrix.copy(parentMatrix);
    gem_ruby.matrix.multiply(new THREE.Matrix4().makeRotationX(rubyAngle * Math.PI / 180.0));
    gem_ruby.matrix.multiply(new THREE.Matrix4().makeTranslation(0, 0, -50));
    setupMini0(gem_ruby.matrix);
    setupMini1(gem_ruby.matrix);
    body.updateMatrixWorld();

}

function setupMini0(parentMatrix) {
    gem_mini0.matrix.copy(parentMatrix);
    gem_mini0.matrix.multiply(new THREE.Matrix4().makeRotationX(-rubyAngle * Math.PI / 180.0));
    gem_mini0.matrix.multiply(new THREE.Matrix4().makeRotationZ(-45 * Math.PI / 180.0));
    gem_mini0.matrix.multiply(new THREE.Matrix4().makeRotationX(emeraldAngle0 * Math.PI / 180.0));
    
    gem_mini0.matrix.multiply(new THREE.Matrix4().makeTranslation(0, 12, 0));
    gem_mini0.updateMatrixWorld();

}

function setupMini1(parentMatrix) {
    gem_mini1.matrix.copy(parentMatrix);
    gem_mini1.matrix.multiply(new THREE.Matrix4().makeRotationX(-rubyAngle * Math.PI / 180.0));
    gem_mini1.matrix.multiply(new THREE.Matrix4().makeRotationY(emeraldAngle1 * Math.PI / 180.0));
    gem_mini1.matrix.multiply(new THREE.Matrix4().makeTranslation(-20, 0, 0));
    gem_mini1.updateMatrixWorld();

}



function updateWorld() {
    var modelMatrix = new THREE.Matrix4();
    modelMatrix.identity();
    if (body != undefined) {
        setupBody(modelMatrix);
    }
}

// Setup update & callback 
var keyboard = new THREEx.KeyboardState();

var mode;
var t = 0;

function checkKeyboard() {
    body = scene.getObjectByName('body');
    if (body != undefined) {
        body.matrixAutoUpdate = false;
    }


    for (var i = 0; i < 6; i++) {
        if (keyboard.pressed(i.toString())) {
            mode = i;
            break;
        }
    }
    switch (mode) {
        case 0:   

            break;
        case 1:

            emeraldAngle1 = emeraldAngle1 + 0.5;
            rubyAngle++;
            var Rx = 0;
            var Ry = -0.1 * Math.sin(rubyAngle * Math.PI / 180);
            var Rz = 0.1 * Math.cos(rubyAngle * Math.PI / 180);

            lightDirectionRuby = new THREE.Vector3(-0.3 + Rx, 0.49 + Ry, 0.49 + Rz);
            gem_ruby.material.uniforms.lightDirectionUniform.value = lightDirectionRuby;

            emeraldAngle0++;




            break;
        case 2:

            emeraldAngle1 = emeraldAngle1 + 0.5;
            emeraldAngle0++;




            break;

        case 3:
            
            rubyAngle++;
            var Rx = 0;
            var Ry = -0.1 * Math.sin(rubyAngle * Math.PI / 180);
            var Rz = 0.1 * Math.cos(rubyAngle * Math.PI / 180);

            lightDirectionRuby = new THREE.Vector3(-0.3 + Rx, 0.49 + Ry, 0.49 + Rz);
            gem_ruby.material.uniforms.lightDirectionUniform.value = lightDirectionRuby;
            
            
           

            break;


        default:
            break;
    }


}

var render = function () {
    checkKeyboard();
    updateWorld();
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

render();
