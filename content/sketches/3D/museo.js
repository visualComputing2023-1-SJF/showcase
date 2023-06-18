let x = 0;
let cameraSpeed = 2;
let mouseSensitivity = 0.01;
let cameraPositionX, cameraPositionY, cameraPositionZ;
let sketchCenterX , sketchCenterY , sketchCenterZ; 
let mouseOprimido = false;

function preload(){
  nocheEstrellada = loadImage('../../../../../showcase/sketches/3D/Imagenes/nocheEstrellada128.jpg');
  arbol = loadModel('../../../../../showcase/sketches/3D/Modelos/Formula_1_mesh.obj');
}

function setup() {
  createCanvas(720, 405, WEBGL);
  
  cam = createCamera();
}


//Funciones que permiten cambiar una variable booleana que permite mover la camara solo si el mouse es oprimido
function mousePressed() {
  mouseOprimido = true;
}
  
function mouseReleased() {
  mouseOprimido = false;
}

function draw() {
  
  //Dibujar fondo
  background(220);
  
  //Pared izquierda
  push()
  translate(-150,0,200)
  box(10,100,600)
  pop()
  
  //Pared derecha
  push()
  translate(150,0,200)
  box(10,100,600)
  pop()
  
  //Pared al frente
  push()
  noStroke()
  translate(0,0,-100)
  plane(300, 100);
  pop()
  
  //Pared atras
  push()
  noStroke()
  translate(0,0,500)
  plane(300, 100);
  pop()
  
  //Pedestal de la escultura de arbol
  push()
  translate(0,50,-40)
  box(30,30,30)
  pop()
  
  //Escultura del arbol
  push()
  rotateX(PI)
  translate(0,-35,40)
  scale(0.3,0.3,0.3)
  model(arbol)
  pop()
  
  //Pintura de la noche estrellada
  push()
  texture(nocheEstrellada)
  noStroke() //Para que no salgan lineas sobre la obra
  rotateY(HALF_PI)
  translate(0,0,144)
  plane(64, 64)
  pop()
  
  //Manejo de los angulos de la camara
  if (mouseOprimido){
    cam.pan(-movedX * mouseSensitivity);
    cam.tilt(movedY * mouseSensitivity);
  }
  
  cameraPositionX = cam.eyeX;
  cameraPositionZ = cam.eyeZ;
  cameraPositionY = cam.eyeY;
  
  sketchCenterX = cam.centerX;
  sketchCenterZ = cam.centerZ;
  sketchCenterY = cam.centerY;
  
  directionMovX = sketchCenterX - cameraPositionX;
  directionMovY = sketchCenterY - cameraPositionY;
  directionMovZ = sketchCenterZ - cameraPositionZ;
  
  lengthDirectionMov = sqrt(directionMovX*directionMovX + directionMovY*directionMovY + directionMovZ * directionMovZ);
  
  directionMovX = directionMovX / lengthDirectionMov
  directionMovZ = directionMovZ / lengthDirectionMov
  
  //Limitar camara con constrain()
  cameraPositionX = constrain(cameraPositionX, -100, 100);
  cameraPositionZ = constrain(cameraPositionZ, -50, 450);
  
  keyIsDown(83) ? cam.setPosition(cameraPositionX - directionMovX * cameraSpeed, cameraPositionY, cameraPositionZ - directionMovZ * cameraSpeed) : keyIsDown(87) ? cam.setPosition(cameraPositionX + directionMovX * cameraSpeed, cameraPositionY, cameraPositionZ + directionMovZ * cameraSpeed) : cam.setPosition(cameraPositionX, cameraPositionY, cameraPositionZ);
  
  //console.log(directionMovZ)
  
  /*
  cam.move(w
    // D - Derecha, A - Izquierda 
    (keyIsDown(68) ? cameraSpeed : 0) + (keyIsDown(65) ? -cameraSpeed : 0),
    0,
    // S - Atras, W - Adelante
    (keyIsDown(83) ? cameraSpeed : 0) + (keyIsDown(87) ? -cameraSpeed : 0));
  */

  //cam.setPosition(cam.eyeX ,  cam.eyeY, (keyIsDown(83) ? cameraPositionZ - cameraSpeed * directionMovZ: (keyIsDown(87) ? cameraPositionZ + cameraSpeed * directionMovZ : cam.eyeZ)))
}
