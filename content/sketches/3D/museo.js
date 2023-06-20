let x = 0;
let cameraSpeed = 2;
let mouseSensitivity = 0.01;
let cameraPositionX, cameraPositionY, cameraPositionZ;
let sketchCenterX , sketchCenterY , sketchCenterZ; 
let mouseOprimido = false;

function preload(){
  caratulaPokemon = loadImage('../../../../../showcase/sketches/3D/Imagenes/CajaPokemonAmarillo.png');
  caratulaF1 = loadImage('../../../../../showcase/sketches/3D/Imagenes/PortadaFormula1.jpg');
  pikachu = loadModel('../../../../../showcase/sketches/3D/Modelos/Pikachu.obj');
  pikachuLowQuality = loadModel('../../../../../showcase/sketches/3D/Modelos/PikachuLowQuality.obj')
  vehiculo = loadModel('../../../../../showcase/sketches/3D/Modelos/Formula_1_mesh.obj');
  vehiculoLowQuality = loadModel('../../../../../showcase/sketches/3D/Modelos/Formula_1_meshLowQuality.obj')
  smoothPhongShader = loadShader("/showcase/sketches/mach_bands/phongShader.vert", "/showcase/sketches/mach_bands/phongShader.frag");
}

function setup() {
  createCanvas(720, 405, WEBGL);
  
  cam = createCamera();

  crearElementosInterfaz();
}

//Funciones que permiten cambiar una variable booleana que permite mover la camara solo si el mouse es oprimido
function mousePressed() {
  mouseOprimido = true;
}
  
function mouseReleased() {
  mouseOprimido = false;
}

function draw() {

  //Dejar el texto de informaci vacio al inicio, para que solo se escriba cuando se tenga seleccionada una figura o cuadro
  texto_Informacion.html("")
  
  //Dibujar fondo
  background(220);
  
  //Pared izquierda
  push()
  translate(-150,0,250)
  box(10,100,700)
  pop()
  
  //Pared derecha
  push()
  translate(150,0,250)
  box(10,100,700)
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
  translate(0,0,600)
  plane(300, 100);
  pop()
  
  //Pedestal de la escultura de pikachu
  push()
  translate(0,50,-40)
  box(30,30,30)
  pop()
  

  //Escultura del pikachu
  push()
  translate(0,35,-45)
  pickingPikachu = mousePicking({
    size: 100,
    shape: Tree.SQUARE
  })
  rotateX(PI)
  rotateY(PI)
  scale(2)
  shader(smoothPhongShader)
  noStroke()

  //Si se esta a una distancia menor a 150 unidades entonces dibujar el modelo de alta calidad
  if (dist(-35, 40, cam.eyeX, cam.eyeZ) < 150){
    model(pikachu)
  } else {
    model(pikachuLowQuality)
  }

  //Si se esta a una distancia menor a 100 unidades y se esta apuntando a la escultura de pikachu
  //mostrar informacion
  if ( (dist(-35, 40, cam.eyeX, cam.eyeZ) < 100 && pickingPikachu)){
    texto_Informacion.html("Pikachu es una de las criaturas de la franquicia Pokémon. Fue creada por la artista Atsuko Nishida mientras trabajaba como freelance para Game Freak. Pikachu hizo su primera aparición en los videojuegos Pokémon Rojo y Azul (Verde en Japón) en 1996, siendo el Pokémon número 25 de la lista de Pokémon registrada en el Pokédex nacional 12. Es un pokémon de tipo eléctrico y es la cara principal de la franquicia.")
  }

  pop()
  
  //Pintura de la caratula de pokemon
  push()
  translate(144,0,0)
  pickingCuadroPikachu = mousePicking({
    size: 64,
    shape: Tree.SQUARE
  })
  texture(caratulaPokemon)
  noStroke() //Para que no salgan lineas sobre la obra
  rotateY(HALF_PI)
  rotateY(PI)
  plane(64, 64)

  //Si se esta a una distancia menor a 100 unidades y se esta apuntando a el cuadro de pikachu
  //mostrar informacion
  if ( (dist(144, 0, cam.eyeX, cam.eyeZ) < 100 && pickingCuadroPikachu)){
    texto_Informacion.html("Pokémon Amarillo es un videojuego de rol desarrollado por Game Freak y publicado por Nintendo para la consola Game Boy en 1998. Es una versión mejorada de los juegos Pokémon Rojo y Azul, con gráficos mejorados y una trama más fiel a la serie de televisión. Pokemon amarillo vendió más de 14 millones de copias en todo el mundo.")
  }

  pop()

  //Pedestal de la escultura de carro
  push()
  translate(0,50,550)
  box(30,30,30)
  pop()

  //Escultura del F1
  push()
  translate(0, 35, 550)
  pickingF1 = mousePicking({
    size: 125,
    shape: Tree.SQUARE
  })
  scale(0.3)
  rotateX(PI)
  shader(smoothPhongShader)
  noStroke()

  //Si se esta a una distancia menor a 150 unidades entonces dibujar el modelo de alta calidad
  if (dist(0, 550, cam.eyeX, cam.eyeZ) < 150){
    model(vehiculo)
  } else {
    model(vehiculoLowQuality)
  }

  //Si se esta a una distancia menor a 100 unidades y se esta apuntando a la escultura de F1
  //mostrar informacion
  if ( (dist(0, 550, cam.eyeX, cam.eyeZ) < 100 && pickingF1)){
    texto_Informacion.html("La Fórmula 1 es una categoría de automovilismo de velocidad que se celebra en circuitos cerrados. El campeonato mundial de Fórmula 1 se celebra desde 1950 y es la competición más importante del mundo del automovilismo. Los coches de Fórmula 1 son monoplazas con cabina abierta, con alerones delanteros y traseros y un motor situado detrás del conductor.")
  }
  pop()

  //Pintura de la caratula de pokemon
  push()
  translate(-144,0,450)
  pickingCuadroF1 = mousePicking({
    size: 64,
    shape: Tree.SQUARE
  })
  texture(caratulaF1)
  noStroke() //Para que no salgan lineas sobre la obra
  rotateY(-HALF_PI)
  rotateY(PI)
  plane(64, 64)

  //Si se esta a una distancia menor a 100 unidades y se esta apuntando a el cuadro de F1
  //mostrar informacion
  if ( (dist(-144, 450, cam.eyeX, cam.eyeZ) < 100 && pickingCuadroF1)){
    texto_Informacion.html("F1 2021 es un videojuego de carreras desarrollado por Codemasters y publicado por EA Sports. Fue lanzado el 16 de julio de 2021 para Microsoft Windows, PlayStation 4, PlayStation 5, Xbox One y Xbox Series X/S. El juego presenta una nueva función llamada “Braking Point” que permite al jugador experimentar la vida de un piloto de Fórmula 1 en el mundo real")
  }

  pop()
  
  //Manejo de los angulos de la camara
  if (mouseOprimido){
    cam.pan(-movedX * mouseSensitivity);
    cam.tilt(movedY * mouseSensitivity);
  }
  
  //Control del movimiento de la camara de manera que se mueva solo en el plano X, Z
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
  cameraPositionZ = constrain(cameraPositionZ, -50, 550);
  
  keyIsDown(83) ? cam.setPosition(cameraPositionX - directionMovX * cameraSpeed, cameraPositionY, cameraPositionZ - directionMovZ * cameraSpeed) : keyIsDown(87) ? cam.setPosition(cameraPositionX + directionMovX * cameraSpeed, cameraPositionY, cameraPositionZ + directionMovZ * cameraSpeed) : cam.setPosition(cameraPositionX, cameraPositionY, cameraPositionZ);
  
}


function crearElementosInterfaz() {
  

  //Texto de Indicaciones
  texto_Indicaciones = createP('Con W puedes moverte hacia al frente en dirección de la camara y con S puedes retroceder.');
  texto_Indicaciones.style('font-size', '15px');
  texto_Indicaciones.position(9, 410);
  texto_Indicaciones.attribute('align','justify')
  texto_Indicaciones.size(700)

  //Texto de Indicaciones
  texto_Indicaciones2 = createP('Para mover la camara debes mantener oprimido el click dentro de la escena y mover el mouse.');
  texto_Indicaciones2.style('font-size', '15px');
  texto_Indicaciones2.position(9, 430);
  texto_Indicaciones2.attribute('align','justify')
  texto_Indicaciones2.size(700)

  texto_Indicaciones3 = createP('Si te acercas a una figura o cuadro y colocas tu puntero sobre ella aquí aparecerá una descripción:');
  texto_Indicaciones3.style('font-size', '15px');
  texto_Indicaciones3.position(9, 450);
  texto_Indicaciones3.attribute('align','justify')
  texto_Indicaciones3.size(700)

  //Texto información de la obra
  texto_Informacion = createP('AQUI VA EL TEXTO');
  texto_Informacion.style('font-size', '15px');
  texto_Informacion.position(9, 470);
  texto_Informacion.attribute('align','justify')
  texto_Informacion.size(700)

}