let myModel;
let myCamera;
let mouseCaptured = false;
let phongShader;
let shaderCheckbox;
let solidColoring;
let strokeActive = false;

function keyPressed() {
  if (keyCode === CONTROL) {
    solidColoring = !solidColoring;
  }   
  if (keyCode === LEFT_ARROW){    
    strokeActive = !strokeActive
  }
}

function preload(){
  myModel = loadModel("/showcase/sketches/mach_bands/objects/BustBaseMesh_Lowpoly.obj", true, modelLoaded , loadFailed); 
  solidPhongShader = loadShader("/showcase/sketches/mach_bands/solidShader.vert", "/showcase/sketches/mach_bands/solidShader.frag");
  smoothPhongShader = loadShader("/showcase/sketches/mach_bands/phongShader.vert", "/showcase/sketches/mach_bands/phongShader.frag");
}

const cameraSpeed = 2;
const mouseSensitivity = 0.2;

function setup() {  
  createCanvas(600, 600, WEBGL);
  _renderer.GL.getExtension('OES_standard_derivatives');
  _renderer.GL.getExtension('GL_EXT_shader_texture_lod');
  describe('Mach Band Effect'); 
  background("rgb(0.5,0.5,0.5)")
  myCamera = createCamera();
  myCamera.move(0,-20,0);
  angleMode(DEGREES);   
  noStroke();  
}

function mouseClicked() {
  if (!mouseCaptured) {
    mouseCaptured = true;
    requestPointerLock();
  }
}

function draw() {  
  
  clear();  
  rotateX(180);
  rotateY(180);  
  model(myModel);
  
  if (strokeActive){
    stroke("#2cfa1f");         
    } else{
    noStroke();
  }
  
  if (mouseCaptured) {
    // Escape to stop capturing mouse
    if (keyIsDown(27)) {
      mouseCaptured = false;
      exitPointerLock();
    }
    // Space to reset the camera
    if (keyIsDown(32)){
      myCamera.setPosition(0,-20,200);
      myCamera.lookAt(0,-20,0);
    }         
      
    myCamera.pan(-movedX * mouseSensitivity);
    myCamera.tilt(movedY * mouseSensitivity);
    myCamera.move(
    // D - right, A - left 
    (keyIsDown(68) ? cameraSpeed : 0) + (keyIsDown(65) ? -cameraSpeed : 0),
    // Q - down, E - up
    (keyIsDown(81) ? cameraSpeed : 0) + (keyIsDown(69) ? -cameraSpeed : 0),
    // S - backward, W - forward
    (keyIsDown(83) ? cameraSpeed : 0) + (keyIsDown(87) ? -cameraSpeed : 0));
  } 
      
  if(solidColoring){
    shader(solidPhongShader);
  }else{
    shader(smoothPhongShader);
  } 
}  

function modelLoaded(modelObj) {
  newModel = modelObj;
  loop();
}
 
function loadFailed(error) {
  print("The model failed to load", error);
}