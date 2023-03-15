let terrainModel;
let myCamera;
let mouseCaptured = false;
let minHeight = Infinity;
let maxHeight = -Infinity;

function preload(){
  terrainModel = loadModel("/showcase/sketches/mach_bands/objects/Icelandic_mountain.obj", true, modelLoaded , loadFailed); 
}

const speed = 2;
const mouseSensitivity = 1;

function setup() {
  createCanvas(600, 600, WEBGL);
  describe('Mach Band Effect'); 
  myCamera = createCamera();
  myCamera.move(0,-50,0);
  angleMode(DEGREES); 
  
  // Find the minimum and max heights among the vertices
  for(let vertex in terrainModel.vertices){
    if(vertex.z <=  minHeight){
      minHeight = vertex.z
    } else if (vertex.z >= maxHeight){
      maxHeight = vertex.z
    }
  }
  
  console.log(Object.keys(terrainModel.faces))
  /* let i = 0;
  for(let face in terrainModel.faces){
    if(i == 99){
      break
    }
    console.log(face[0])    
    console.log(terrainModel.vertices[i])
    i++
  }
  ; */
}

function mouseClicked() {
  if (!mouseCaptured) {
    mouseCaptured = true;
    requestPointerLock();
  }
}

function draw() { 

  if (mouseCaptured) {
    if (keyIsDown(27)) {
      mouseCaptured = false;
      exitPointerLock();
  }

  myCamera.pan(-movedX * mouseSensitivity);
  myCamera.tilt(movedY * mouseSensitivity);
  myCamera.move(
  // D - right, A - left 
  (keyIsDown(68) ? speed : 0) + (keyIsDown(65) ? -speed : 0),
  // Q - down, E - up
  (keyIsDown(81) ? speed : 0) + (keyIsDown(69) ? -speed : 0),
  // S - backward, W - forward
  (keyIsDown(83) ? speed : 0) + (keyIsDown(87) ? -speed : 0));

  }

  

  background(200);
  scale(10); // Scaled to make DEGREESl fit into canvas;  
  

  // console.log(terrainModel.faces[0])
  
  beginShape(TRIANGLES);
   for (let i = 0; i < terrainModel.faces.length ; i++) {        
      vertex(terrainModel.vertices[terrainModel.faces[i][0]].x, terrainModel.vertices[terrainModel.faces[i][0]].y, terrainModel.vertices[terrainModel.faces[i][0]].z);
      vertex(terrainModel.vertices[terrainModel.faces[i][1]].x, terrainModel.vertices[terrainModel.faces[i][1]].y, terrainModel.vertices[terrainModel.faces[i][1]].z);
      vertex(terrainModel.vertices[terrainModel.faces[i][2]].x, terrainModel.vertices[terrainModel.faces[i][2]].y, terrainModel.vertices[terrainModel.faces[i][2]].z);
  } 
  endShape();
}
  

function modelLoaded(modelObj) {
  newModel = modelObj;
  loop();
}
 
function loadFailed(error) {
  print("The model failed to load", error);
}