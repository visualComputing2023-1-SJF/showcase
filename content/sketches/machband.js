let humanModel;

function preload(){
  humanModel = loadModel("/showcase/sketches/mach_bands/objects/MaleLow.obj", true, modelLoaded , loadFailed);
}

function setup() {
  createCanvas(800, 600, WEBGL);
  describe('Mach Band Effect'); 
}

function draw() {
  background(200);
  scale(2); // Scaled to make model fit into canvas
  rotateY(frameCount * 0.01);
  normalMaterial(); // For effect
  model(humanModel);
}

function modelLoaded(modelObj) {
  newModel = modelObj;
  loop();
}
 
function loadFailed(error) {
  print("The model failed to load", error);
}