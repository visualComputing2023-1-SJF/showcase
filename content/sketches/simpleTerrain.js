let terrainModel;
let myCamera;
let mouseCaptured = false;
let minHeight = Infinity;
let maxHeight = -Infinity;
let limite = 100;

function preload(){
  terrainModel = loadModel("/showcase/sketches/mach_bands/objects/ORIGAMI_Chat_Free.obj", true, modelLoaded , loadFailed); 
}

const speed = 2;
const mouseSensitivity = 0.2;

function setup() {
  createCanvas(600, 600, WEBGL);
  describe('Mach Band Effect'); 
  myCamera = createCamera();
  myCamera.move(0,-20,0);
  angleMode(DEGREES); 
  
  // Find the minimum and max heights among the vertices
  for(let vertex in terrainModel.vertices){
    if(vertex.z <=  minHeight){
      minHeight = vertex.z
    } else if (vertex.z >= maxHeight){
      maxHeight = vertex.z
    }
  }
  
  console.log(Object.keys(terrainModel))
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

  
  rotateX(180)
  rotateY(180)
  background(200);
  scale(1); // Scaled to make DEGREESl fit into canvas;  
  // model(terrainModel)

  
  

  // console.log(terrainModel.faces[0])
  noStroke();
  beginShape(TRIANGLES);

   for (let i = 0; i < terrainModel.faces.length ; i++) {          
      // Get vector in which the camera is pointing and normalize it
      let cameraCenter = {"x" : myCamera.centerX , "y":myCamera.centerY, "z": myCamera.centerZ};
      let cameraVectorMagnitude = sqrt(pow(cameraCenter.x, 2)+ pow(cameraCenter.y, 2)+ pow(cameraCenter.z, 2));      
      Object.keys(cameraCenter).forEach(index => cameraCenter[index] = cameraCenter[index] / cameraVectorMagnitude);
      // Get the three vertices of each face
      let vertex1 = terrainModel.vertices[terrainModel.faces[i][0]];
      let vertex2 = terrainModel.vertices[terrainModel.faces[i][1]];
      let vertex3 = terrainModel.vertices[terrainModel.faces[i][2]];      
      
      // Get the normal vector of the vertexes      
      let vertex1Normal = terrainModel.vertexNormals[terrainModel.faces[i][0]]
      let vertex2Normal = terrainModel.vertexNormals[terrainModel.faces[i][1]]
      let vertex3Normal = terrainModel.vertexNormals[terrainModel.faces[i][2]]

      let triangleNormal = {"x": (vertex1Normal.x+vertex2Normal.x+vertex3Normal.x)/3, "y": (vertex1Normal.y+vertex2Normal.y+vertex3Normal.y)/3, "z": (vertex1Normal.z+vertex2Normal.z+vertex3Normal.z)/3}
      let triangleNormalMagnitude = sqrt(pow(triangleNormal.x, 2)+ pow(triangleNormal.y, 2)+ pow(triangleNormal.z, 2));
      Object.keys(triangleNormal).forEach(index => triangleNormal[index] = triangleNormal[index] / triangleNormalMagnitude);
      
      // Do the dot product between cameraCenter and triangleNormal and map the result to a grayscale color
      let cameraCenterVector = createVector(cameraCenter.x, cameraCenter.y, cameraCenter.z)      
      let triangleNormalVector = createVector(triangleNormal.x, triangleNormal.y, triangleNormal.z)
      let dotProduct = cameraCenterVector.dot(triangleNormalVector)
      let triangleColor = map(dotProduct < 0 ? dotProduct : 0, -1, 0, 0, 255);
      
      fill(triangleColor);
      // Plot and fill the triangles with such color
      vertex(vertex1.x, vertex1.y, vertex1.z);
      vertex(vertex2.x, vertex2.y, vertex2.z);
      vertex(vertex3.x, vertex3.y, vertex3.z);

  } 
  endShape(); 
  lights();
}
  

function modelLoaded(modelObj) {
  newModel = modelObj;
  loop();
}
 
function loadFailed(error) {
  print("The model failed to load", error);
}