---
Weight: 2
---

# Museo

## Introducción

En este ejercicio se aplicaron los conceptos de iluminación de Phong, object picking y el manejo de espacios, para crear una pequeña sala de museo donde se exponen algunas piezas de arte del mundo de los videojuegos.

## Antecedentes

Para conocer acerca del concepto de iluminación de Phong, seguir este enlace dentro de [nuestra página](https://visualcomputing2023-1-sjf.github.io/showcase/docs/Ejercicios/IlusionesVisuales/MachBands/PhongReflection/)

Para conocer acerca del concepto de object picking, seguir este enlace dentro de [nuestra página](https://visualcomputing2023-1-sjf.github.io/showcase/docs/Ejercicios/Transformaciones/ObjectPicking/)

Un espacio es un sistema de referencia, respecto al cual se pueden especificar las coordenadas de un vector. En el caso de la computación gráfica, los espacios más importantes son los de modelo, mundo, vista y proyección. Los tres primeros son espacios tridimensionales que pueden ordenarse en un árbol de escena. 

<div align="center">
  <img src="/showcase/sketches/3D/scene_tree.jpg">
  <div>Imagen tomada de <a href="http://what-when-how.com/advanced-methods-in-computer-graphics/scene-graphs-advanced-methods-in-computer-graphics-part-2/"> este enlace </a> </div>
</div>

En la anterior imágen observamos como el mundo debe ser la raíz del árbol, mientras que los modelos se pueden agrupar y son las hojas del árbol. El espacio de vista es el espacio de coordenadas de la cámara, mientras que el espacio de proyección es el mapeo que se hace de la escena a la pantalla.

## Código

El siguiente fragmento de código describe la declaración de las variables necesarias, la función `preload()` y la función `setup()`, además de dos funciones que determinan si se mueve o no la cámara.

{{< details "Variables, preload() y setup()" close >}}
```javascript
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
```
{{< /details >}}

La parte más importante de este programa, es la función draw(), donde se dibujan todos los modelos, se aplican las transformaciones necesarias, el shader de iluminación de Phong, así como el object picking.

{{< details "Función draw()" close >}}
```javascript
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
```
{{< /details>}}

Los comentarios indican qué es lo que hace cada parte del código y a grandes rasgos puede resumirse en lo siguiente: Se crean las paredes de la sala, se crean los cuadros y se crean los pedestales de las esculturas. Usando la máquina de estados de p5, se posicionan las esculturas y cuadros, a los cuales se les aplica un mousePicker de la librería treegl. Luego se hace una verificación, midiendo la distancia de la pieza al usuario y si está apuntando hacia el objeto. De cumplirse las condiciones, se actualiza el texto que se muestra en la parte inferior del iframe, con información de la pieza actual.Además de esto, en función de la distancia, se cambia el modelo de la escultura, por uno de menor cantidad de polígonos, para mejorar el rendimiento.  

Adicionalmente, se tiene un código que controla el movimiento de la cámara, permitiendo el desplazamiento con WASD y asegurándose de que la cámara no se salga de la sala, ni se despegue del suelo. Finalmente, contamos con una función que se encarga de dibujar el texto en la parte inferior del iframe, la cual se muestra a continuación:  

{{< details "Código" >}}
```javascript
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
```
{{< /details>}}

## Resultados
A continuación se muestra el programa en ejecución en un iframe de p5.js:

<div align="center">
{{< p5-iframe sketch="/showcase/sketches/3D/museo.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="740" height="600" >}}
</div>

En el siguiente video se hace una demostración del uso de la aplicación y se explican algunos detalles sobre la misma:
<div align="center">
<iframe width="728" height="378" src="https://youtube.com/embed/MC1eDe0-rD8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>


## Conclusiones y trabajo futuro

En conclusión, se logró crear una escena en 3D en la que se pudieron cargar texturas en las paredes para simular cuadros, cargar modelos de esculturas de videojuegos, a los cuales se les pudo aplicar un shader de iluminación de Phong. También se le agregó interactividad al permitir el desplazamiento por la sala y la visualización de información de las piezas, la cual se activaba por medio de Object Picking. De igual forma, se logro optimización en el rendimiento, reemplazando modelos de alta calidad de polígonos, por otros de menor calidad, dependiendo de la distancia del usuario a la pieza.

Aún hay mucho espacio para mejorar. En primer lugar, se podría ampliar la sala y la cantidad de obras en ella. También se podría mejorar la iluminación de la escena, agregando luces puntuales y luces de ambiente. Además, se podría agregar un sistema de sonido, para que al acercarse a una pieza, se reproduzca una pista de audio con información de la misma. En aspectos de rendimiento, se podría hacer la implementación de un culling de oclusión, para así solo renderizar lo que pueda ver la cámara. Esto también permitiría poder cambiar la forma del museo y tener varias salas, sin que esto afecte el rendimiento. 

## Bibliografía

Charalambos, J. P. . Space transformations. Recuperado el 19 de Julio de 2023, de https://visualcomputing.github.io/docs/space_transformations/  

Dualbox. (s.f.). Geometry Simplifier. Recuperado el 19 de Julio de 2023, de https://www.dualbox.com/apps/geometry-simplifier/production  

CGTrader. (s.f.). 00Pokemon. Recuperado el 19 de Julio de 2023, de https://www.cgtrader.com/free-3d-models/character/fantasy-character/00pokemon

Free3D. (s.f.). Ferrari Formula 1. Recuperado el 19 de Julio de 2023, de https://free3d.com/3d-model/ferrari-formula-1-72527.html