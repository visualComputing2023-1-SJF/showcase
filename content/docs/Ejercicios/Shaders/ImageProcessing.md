---
Weight: 3
---

# Image Processing

## Introducción

En este ejercicio se construyó una aplicación que permite aplicar máscaras de 5x5 creadas por el usuario a una imagen o un vídeo.

Cabe destacar que este ejercicio se basa en el código “mask.frag” de la sección [image processing](https://visualcomputing.github.io/docs/shaders/image_processing/) del libro del curso.

## Antecedentes

Un [kernel](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29), máscara de convolución o máscara en el procesamiento de imágenes es una matriz usada para dar distintos efectos a las imágenes como puede ser difuminarlas o ayudar a resaltar los bordes que existen en ella.

Para hacer eso, se realiza una [convolución](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29#:~:text=the%20center%20element.-,Convolution,-%5Bedit%5D) entre la máscara enviada y la imagen. Es decir, para calcular el color que tendrá cada píxel en la imagen de salida se utiliza una función que tiene en cuenta el color de sus píxeles vecinos (incluyendo al propio píxel) en la imagen de entrada.

En este [enlace](https://en.wikipedia.org/wiki/File:2D_Convolution_Animation.gif) se puede encontrar una animación de esta operación con una máscara de 3x3 en el caso en que los bordes de la imagen se [extiendan](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29#:~:text=handling%20image%20edges.-,Extend,-The%20nearest%20border).

En este [enlace](https://setosa.io/ev/image-kernels/) tambien hace una explicación visual de la operación de convolución con una máscara de 3x3 con una imagen en blanco y negro en donde los bordes de la imagen son ignorados.

Para el caso de este ejercicio, la máscara tendrá un tamaño de 5x5, esto para alcanzar una mayor gama de efectos de los que se podrían alcanzar con una máscara de 3x3. Un ejemplo de esto es una aproximación al [difuminado gaussiano](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29#:~:text=Gaussian%20blur%205%20%C3%97%205%0A(approximation)) con una matriz de 5x5.

Tanto en este [enlace](https://setosa.io/ev/image-kernels/) como en este [enlace](https://en.wikipedia.org/wiki/Kernel_%28image_processing%29#:~:text=range%20of%20effects.%20.-,Operation,-Kernel%20%CF%89) se encuentran otros ejemplos de máscaras de tamaño de 3x3 y 5x5 con sus respectivos efectos.

## Código

Para realizar este ejercicio se utilizó la librería [treegl](https://github.com/VisualComputing/p5.treegl) para facilitar la creación del vertex shader. El vertex shader generado por la librería se muestra en la consola del navegador.

A continuación se muestra el código “mask.js” de la aplicación y el codigo del fragment shader “mask.frag”, el cual es un código modificado respecto a el que se encontraba en el ejemplo original de [image processing](https://visualcomputing.github.io/docs/shaders/image_processing/) del libro del curso.

{{< details "Código luma.js" close >}}
```java
function preload(){

  //Leer el fragment shader
  maskShader = readShader('/showcase/sketches/image_processing/mask.frag',{ varyings: Tree.texcoords2 })
  
  //Cargar la imagen por defecto sobre la que se aplicara la mascara
  media_src = loadImage('https://images.ctfassets.net/zma7thmmcinb/5t3XK5aD2RPFtBufctbBE3/8bd3a257d37147cb61d81075aac99dd5/how-to-grow-dahlias-pv-Nicholas.jpg');
  
}

function setup() {
  //Definir el lienzo
  createCanvas(732, 412, WEBGL);
  
  //Definir modo de textura
  textureMode(NORMAL)
  
  //Definir el Shader a aplicar
  shader(maskShader)
  
  //Llamar funcion en donde se crean elementos de la interfaz
  crearElementosInterfaz()
}

function draw() {
  
  //Pasar textura al shader
  maskShader.setUniform('texture',media_src)
  
  //Aplicar la textura
  texture(media_src)
  
  //Definir la figura para dibujar y como se asocian los vertices al espacio de la textura.
  beginShape();
  vertex(-1,-1,0,0,1);
  vertex(1,-1,0,1,1);
  vertex(1,1,0,1,0);
  vertex(-1,1,0,0,0);
  endShape();
  
  //Modificar la variable applyMask del shader si se da click al chechbox "Aplicar Máscara"
  check_Aplicar.changed(() => maskShader.setUniform('applyMask',check_Aplicar.checked())) 
  
  //Enviar el Offset de las coordenadas de la textura al fragment shader
  emitTexOffset(maskShader, media_src, uniform = 'texOffset')

  //Arreglo que almacena los valores de la máscara calculados
  //A partir del factor y la matriz
  mascaraObtenida = [input_0_0.value(),input_0_1.value(),input_0_2.value(),input_0_3.value(),input_0_4.value(),
    input_1_0.value(),input_1_1.value(),input_1_2.value(),input_1_3.value(),input_1_4.value(),
    input_2_0.value(),input_2_1.value(),input_2_2.value(),input_2_3.value(),input_2_4.value(),
    input_3_0.value(),input_3_1.value(),input_3_2.value(),input_3_3.value(),input_3_4.value(),
    input_4_0.value(),input_4_1.value(),input_4_2.value(),input_4_3.value(),input_4_4.value()].map(function(x) {return x * inputFactor.value();})


  //Mandar el arreglo que contiene la mascara como variable uniforme
  maskShader.setUniform('mask',mascaraObtenida);

  //Funcion que se encarga de actualizar los valores mostrados en la interfaz de la máscara obtenida
  actualizarValoresMascaraInterfaz();
}

//Funcion llamada cuando se sube un archivo
function manejarArchivo(file) {
  
  //Verificar si es una imagen o video
  if (file.type === 'image') {
    //Si antes estaba un video en ejecución pausarlo para que su audio se detenga
    media_src.pause();
    //Cargar la nueva imagen
    media_src = loadImage(file.data);
    
  } else if(file.type === 'video') {
    //Si antes estaba un video en ejecución pausarlo para que su audio se detenga
    media_src.pause()
    
    //Cargar el nuevo video
    media_src = createVideo(file.data, vidCargado)
  }
}

//Funcion llamada cuando carga el video
function vidCargado() {
  //Ocultar el video para que no se vea en toda la pantalla sino unicamente se vea donde se aplique la textura
  media_src.hide()
  
  //Reproducir el en bucle
  media_src.loop();
}

function crearElementosInterfaz() {
  //Texto Indicaciones
  texto_Indicaciones = createP('Multiplica un factor por una matriz para obtener una máscara de convolución que se puede aplicar sobre una imagen o video:');
  texto_Indicaciones.style('font-size', '14px');
  texto_Indicaciones.position(9, 410);

  //Texto para indicar el factor
  texto_Factor = createP('Factor');
  texto_Factor.style('font-size', '14px');
  texto_Factor.position(75, 505);

  //Crear inputs para factor de multiplicación por el kernel
  inputFactor = createInput("1", "number")
  inputFactor.position(49,535)
  inputFactor.size(85)
  
  //Texto simbolo multiplicar
  texto_Multiplicar = createP('*');
  texto_Multiplicar.style('font-size', '16px');
  texto_Multiplicar.position(149, 523);

  //Texto para indicar la matriz
  texto_Matriz = createP('Matriz');
  texto_Matriz.style('font-size', '14px');
  texto_Matriz.position(245, 445);

  //Crear inputs para matriz de valores de la mascara
  input_0_0 = createInput("0", "number")
  input_0_0.position(165,475)
  input_0_0.size(30)
  
  input_0_1 = createInput("0", "number")
  input_0_1.position(205,475)
  input_0_1.size(30)
  
  input_0_2 = createInput("0", "number")
  input_0_2.position(245,475)
  input_0_2.size(30)
  
  input_0_3 = createInput("0", "number")
  input_0_3.position(285,475)
  input_0_3.size(30)
  
  input_0_4 = createInput("0", "number")
  input_0_4.position(325,475)
  input_0_4.size(30)
  
  input_1_0 = createInput("0", "number")
  input_1_0.position(165,505)
  input_1_0.size(30)
  
  input_1_1 = createInput("-1", "number")
  input_1_1.position(205,505)
  input_1_1.size(30)
  
  input_1_2 = createInput("-1", "number")
  input_1_2.position(245,505)
  input_1_2.size(30)
  
  input_1_3 = createInput("-1", "number")
  input_1_3.position(285,505)
  input_1_3.size(30)
  
  input_1_4 = createInput("0", "number")
  input_1_4.position(325,505)
  input_1_4.size(30)
  
  input_2_0 = createInput("0", "number")
  input_2_0.position(165,535)
  input_2_0.size(30)
  
  input_2_1 = createInput("-1", "number")
  input_2_1.position(205,535)
  input_2_1.size(30)
  
  input_2_2 = createInput("8", "number")
  input_2_2.position(245,535)
  input_2_2.size(30)
  
  input_2_3 = createInput("-1", "number")
  input_2_3.position(285,535)
  input_2_3.size(30)
  
  input_2_4 = createInput("0", "number")
  input_2_4.position(325,535)
  input_2_4.size(30)
  
  input_3_0 = createInput("0", "number")
  input_3_0.position(165, 565)
  input_3_0.size(30)
  
  input_3_1 = createInput("-1", "number")
  input_3_1.position(205,565)
  input_3_1.size(30)
  
  input_3_2 = createInput("-1", "number")
  input_3_2.position(245,565)
  input_3_2.size(30)
  
  input_3_3 = createInput("-1", "number")
  input_3_3.position(285,565)
  input_3_3.size(30)
  
  input_3_4 = createInput("0", "number")
  input_3_4.position(325,565)
  input_3_4.size(30)
  
  input_4_0 = createInput("0", "number")
  input_4_0.position(165, 595)
  input_4_0.size(30)
  
  input_4_1 = createInput("0", "number")
  input_4_1.position(205,595)
  input_4_1.size(30)
  
  input_4_2 = createInput("0", "number")
  input_4_2.position(245,595)
  input_4_2.size(30)
  
  input_4_3 = createInput("0", "number")
  input_4_3.position(285,595)
  input_4_3.size(30)
  
  input_4_4 = createInput("0", "number")
  input_4_4.position(325,595)
  input_4_4.size(30)

  //Texto simbolo igual
  texto_Igual = createP('=');
  texto_Igual.style('font-size', '16px');
  texto_Igual.position(372, 521);

  //Texto Mascara Obtenida
  texto_MascaraObt = createP('Máscara Obtenida');
  texto_MascaraObt.style('font-size', '14px');
  texto_MascaraObt.position(486, 430);

  //Texto Aclaracion
  texto_Aclaracion = createP('(Se muestran los valores aproximados a 3 cifras decimales)');
  texto_Aclaracion.style('font-size', '12px');
  texto_Aclaracion.position(395, 447);

  //Crear elementos de interfaz para mostrar el kernel resultante de multiplicar
  //la matriz del usuario y el factor, se usan elementos input numericos desactivados para dar la sensación de que es una matriz.
  resultadoMatriz_0_0 = createInput("0","number")
  resultadoMatriz_0_0.position(390,475)
  resultadoMatriz_0_0.size(50)
  resultadoMatriz_0_0.attribute("disabled","disabled")

  resultadoMatriz_0_1 = createInput("0","number")
  resultadoMatriz_0_1.position(450,475)
  resultadoMatriz_0_1.size(50)
  resultadoMatriz_0_1.attribute("disabled","disabled")

  resultadoMatriz_0_2 = createInput("0","number")
  resultadoMatriz_0_2.position(510,475)
  resultadoMatriz_0_2.size(50)
  resultadoMatriz_0_2.attribute("disabled","disabled")

  resultadoMatriz_0_3 = createInput("0","number")
  resultadoMatriz_0_3.position(570,475)
  resultadoMatriz_0_3.size(50)
  resultadoMatriz_0_3.attribute("disabled","disabled")

  resultadoMatriz_0_4 = createInput("0","number")
  resultadoMatriz_0_4.position(630,475)
  resultadoMatriz_0_4.size(50)
  resultadoMatriz_0_4.attribute("disabled","disabled")

  resultadoMatriz_1_0 = createInput("0","number")
  resultadoMatriz_1_0.position(390,505)
  resultadoMatriz_1_0.size(50)
  resultadoMatriz_1_0.attribute("disabled","disabled")

  resultadoMatriz_1_1 = createInput("-1","number")
  resultadoMatriz_1_1.position(450,505)
  resultadoMatriz_1_1.size(50)
  resultadoMatriz_1_1.attribute("disabled","disabled")

  resultadoMatriz_1_2 = createInput("-1","number")
  resultadoMatriz_1_2.position(510,505)
  resultadoMatriz_1_2.size(50)
  resultadoMatriz_1_2.attribute("disabled","disabled")

  resultadoMatriz_1_3 = createInput("-1","number")
  resultadoMatriz_1_3.position(570,505)
  resultadoMatriz_1_3.size(50)
  resultadoMatriz_1_3.attribute("disabled","disabled")

  resultadoMatriz_1_4 = createInput("0","number")
  resultadoMatriz_1_4.position(630,505)
  resultadoMatriz_1_4.size(50)
  resultadoMatriz_1_4.attribute("disabled","disabled")

  resultadoMatriz_2_0 = createInput("0","number")
  resultadoMatriz_2_0.position(390,535)
  resultadoMatriz_2_0.size(50)
  resultadoMatriz_2_0.attribute("disabled","disabled")

  resultadoMatriz_2_1 = createInput("-1","number")
  resultadoMatriz_2_1.position(450,535)
  resultadoMatriz_2_1.size(50)
  resultadoMatriz_2_1.attribute("disabled","disabled")

  resultadoMatriz_2_2 = createInput("8","number")
  resultadoMatriz_2_2.position(510,535)
  resultadoMatriz_2_2.size(50)
  resultadoMatriz_2_2.attribute("disabled","disabled")

  resultadoMatriz_2_3 = createInput("-1","number")
  resultadoMatriz_2_3.position(570,535)
  resultadoMatriz_2_3.size(50)
  resultadoMatriz_2_3.attribute("disabled","disabled")

  resultadoMatriz_2_4 = createInput("0","number")
  resultadoMatriz_2_4.position(630,535)
  resultadoMatriz_2_4.size(50)
  resultadoMatriz_2_4.attribute("disabled","disabled")

  resultadoMatriz_3_0 = createInput("0","number")
  resultadoMatriz_3_0.position(390,565)
  resultadoMatriz_3_0.size(50)
  resultadoMatriz_3_0.attribute("disabled","disabled")

  resultadoMatriz_3_1 = createInput("-1","number")
  resultadoMatriz_3_1.position(450,565)
  resultadoMatriz_3_1.size(50)
  resultadoMatriz_3_1.attribute("disabled","disabled")

  resultadoMatriz_3_2 = createInput("-1","number")
  resultadoMatriz_3_2.position(510,565)
  resultadoMatriz_3_2.size(50)
  resultadoMatriz_3_2.attribute("disabled","disabled")

  resultadoMatriz_3_3 = createInput("-1","number")
  resultadoMatriz_3_3.position(570,565)
  resultadoMatriz_3_3.size(50)
  resultadoMatriz_3_3.attribute("disabled","disabled")

  resultadoMatriz_3_4 = createInput("0","number")
  resultadoMatriz_3_4.position(630,565)
  resultadoMatriz_3_4.size(50)
  resultadoMatriz_3_4.attribute("disabled","disabled")

  resultadoMatriz_4_0 = createInput("0","number")
  resultadoMatriz_4_0.position(390,595)
  resultadoMatriz_4_0.size(50)
  resultadoMatriz_4_0.attribute("disabled","disabled")

  resultadoMatriz_4_1 = createInput("0","number")
  resultadoMatriz_4_1.position(450,595)
  resultadoMatriz_4_1.size(50)
  resultadoMatriz_4_1.attribute("disabled","disabled")

  resultadoMatriz_4_2 = createInput("0","number")
  resultadoMatriz_4_2.position(510,595)
  resultadoMatriz_4_2.size(50)
  resultadoMatriz_4_2.attribute("disabled","disabled")

  resultadoMatriz_4_3 = createInput("0","number")
  resultadoMatriz_4_3.position(570,595)
  resultadoMatriz_4_3.size(50)
  resultadoMatriz_4_3.attribute("disabled","disabled")

  resultadoMatriz_4_4 = createInput("0","number")
  resultadoMatriz_4_4.position(630,595)
  resultadoMatriz_4_4.size(50)
  resultadoMatriz_4_4.attribute("disabled","disabled")

  //Crear checkbox para la mascara
  check_Aplicar = createCheckbox('Aplicar Máscara Obtenida', false);
  check_Aplicar.position(450,620)
  check_Aplicar.style('color','black')
  check_Aplicar.style('font-size', '14px');

  //Texto para indicar el boton de subir imagenes
  texto_CargarImagen = createP('Sube otra imagen o video sobre la cual aplicar la máscara obtenida:');
  texto_CargarImagen.style('font-size', '14px');
  texto_CargarImagen.position(9, 640);
    
  //Crear boton para subir imagenes
  input_subidaArchivo = createFileInput(manejarArchivo);
  input_subidaArchivo.position(388, 652);
}

function actualizarValoresMascaraInterfaz() {
  //Se actualiza el atributo value a los valores de la mascara
  //Se muestran aproximados a 3 cifras decimales
  resultadoMatriz_0_0.value(Math.round((mascaraObtenida[0] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_0_1.value(Math.round((mascaraObtenida[1] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_0_2.value(Math.round((mascaraObtenida[2] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_0_3.value(Math.round((mascaraObtenida[3] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_0_4.value(Math.round((mascaraObtenida[4] + Number.EPSILON) * 1000)/1000)
 
  resultadoMatriz_1_0.value(Math.round((mascaraObtenida[5] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_1_1.value(Math.round((mascaraObtenida[6] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_1_2.value(Math.round((mascaraObtenida[7] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_1_3.value(Math.round((mascaraObtenida[8] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_1_4.value(Math.round((mascaraObtenida[9] + Number.EPSILON) * 1000)/1000)

  resultadoMatriz_2_0.value(Math.round((mascaraObtenida[10] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_2_1.value(Math.round((mascaraObtenida[11] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_2_2.value(Math.round((mascaraObtenida[12] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_2_3.value(Math.round((mascaraObtenida[13] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_2_4.value(Math.round((mascaraObtenida[14] + Number.EPSILON) * 1000)/1000)

  resultadoMatriz_3_0.value(Math.round((mascaraObtenida[15] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_3_1.value(Math.round((mascaraObtenida[16] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_3_2.value(Math.round((mascaraObtenida[17] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_3_3.value(Math.round((mascaraObtenida[18] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_3_4.value(Math.round((mascaraObtenida[19] + Number.EPSILON) * 1000)/1000)

  resultadoMatriz_4_0.value(Math.round((mascaraObtenida[20] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_4_1.value(Math.round((mascaraObtenida[21] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_4_2.value(Math.round((mascaraObtenida[22] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_4_3.value(Math.round((mascaraObtenida[23] + Number.EPSILON) * 1000)/1000)
  resultadoMatriz_4_4.value(Math.round((mascaraObtenida[24] + Number.EPSILON) * 1000)/1000)
}
```
{{< /details >}}

{{< details "Código luma.frag" close >}}
```glsl
precision mediump float;

// las variables uniform son definidas y enviadas por el sketch
uniform bool applyMask;
uniform sampler2D texture;
uniform vec2 texOffset;

// Almacena el kernel de 5x5
uniform float mask[25];

// Coordenadas interpoladas (mismo tipo y nombre como esta en el vertex shader)
varying vec2 texcoords2;

void main() {
  // 1. Usar el offset para moverse a lo largo del espacio de la textura.
  // En este caso se usan para encontrar las coordenadas de textura de los texeles vecinos.
  vec2 tc0 = texcoords2 + vec2(-2.0 * texOffset.s, -2.0 * texOffset.t);
  vec2 tc1 = texcoords2 + vec2(-texOffset.s, -2.0 * texOffset.t);
  vec2 tc2 = texcoords2 + vec2(0.0, -2.0 * texOffset.t);
  vec2 tc3 = texcoords2 + vec2(+texOffset.s, -2.0 * texOffset.t);
  vec2 tc4 = texcoords2 + vec2(2.0 * texOffset.s, -2.0 * texOffset.t);
  vec2 tc5 = texcoords2 + vec2(-2.0 * texOffset.s, -texOffset.t);
  vec2 tc6 = texcoords2 + vec2(-texOffset.s, -texOffset.t);
  vec2 tc7 = texcoords2 + vec2(0.0, -texOffset.t);
  vec2 tc8 = texcoords2 + vec2(+texOffset.s, -texOffset.t);
  vec2 tc9 = texcoords2 + vec2(2.0 * texOffset.s, -texOffset.t);
  vec2 tc10 = texcoords2 + vec2(-2.0 * texOffset.s, 0.0);
  vec2 tc11 = texcoords2 + vec2(-texOffset.s, 0.0);
  
  // Origen (Coordenadas de textura del fragmento actual)
  vec2 tc12 = texcoords2 + vec2(0.0, 0.0);
  
  vec2 tc13 = texcoords2 + vec2(+texOffset.s, 0.0);
  vec2 tc14 = texcoords2 + vec2(2.0 * texOffset.s, 0.0);
  vec2 tc15 = texcoords2 + vec2(-2.0 * texOffset.s, +texOffset.t);
  vec2 tc16 = texcoords2 + vec2(-texOffset.s, +texOffset.t);
  vec2 tc17 = texcoords2 + vec2(0.0, +texOffset.t);
  vec2 tc18 = texcoords2 + vec2(+texOffset.s, +texOffset.t);
  vec2 tc19 = texcoords2 + vec2(2.0 * texOffset.s, +texOffset.t);
  vec2 tc20 = texcoords2 + vec2(-2.0 * texOffset.s, 2.0 * texOffset.t);
  vec2 tc21 = texcoords2 + vec2(-texOffset.s, 2.0 * texOffset.t);
  vec2 tc22 = texcoords2 + vec2(0.0, 2.0 * texOffset.t);
  vec2 tc23 = texcoords2 + vec2(+texOffset.s, 2.0 * texOffset.t);
  vec2 tc24 = texcoords2 + vec2(2.0 * texOffset.s, 2.0 * texOffset.t);

  // 2. Muestrear los texeles vecinos y almacenar los datos dentro del arreglo rgba
  vec4 rgba[25];
  rgba[0] = texture2D(texture, tc0);
  rgba[1] = texture2D(texture, tc1);
  rgba[2] = texture2D(texture, tc2);
  rgba[3] = texture2D(texture, tc3);
  rgba[4] = texture2D(texture, tc4);
  rgba[5] = texture2D(texture, tc5);
  rgba[6] = texture2D(texture, tc6);
  rgba[7] = texture2D(texture, tc7);
  rgba[8] = texture2D(texture, tc8);
  rgba[9] = texture2D(texture, tc9);
  rgba[10] = texture2D(texture, tc10);
  rgba[11] = texture2D(texture, tc11);
  rgba[12] = texture2D(texture, tc12);
  rgba[13] = texture2D(texture, tc13);
  rgba[14] = texture2D(texture, tc14);
  rgba[15] = texture2D(texture, tc15);
  rgba[16] = texture2D(texture, tc16);
  rgba[17] = texture2D(texture, tc17);
  rgba[18] = texture2D(texture, tc18);
  rgba[19] = texture2D(texture, tc19);
  rgba[20] = texture2D(texture, tc20);
  rgba[21] = texture2D(texture, tc21);
  rgba[22] = texture2D(texture, tc22);
  rgba[23] = texture2D(texture, tc23);
  rgba[24] = texture2D(texture, tc24);
  
  // 3. Aplicar el kernel de convolución
  vec4 convolution;
  for (int i = 0; i < 24; i++) {
    convolution += rgba[i]*mask[i];
  }

  // Calcular el color original del pixel para mostrarlo en caso de que el usuario no quiera aplicar la mascara
  vec4 texel = texture2D(texture, texcoords2);

  // 4. Colocar el color obtenido por la convolución
  gl_FragColor = applyMask ? vec4(convolution.rgb, 1.0) : texel; 
}
```
{{< /details >}}

En el código “mask.js” en el método draw() se envía la textura al shader y se aplica la textura sobre un cuadro que ocupa todo el canvas de p5.js. Adicionalmente, se usa el método [emitTexOffset()](https://github.com/VisualComputing/p5.treegl#macros) dado por la librería treegl para enviar el offset de las coordenadas de la textura.

El offset de la textura permite acceder fácilmente a las coordenadas de los pixeles vecinos en el fragment shader y de esta manera obtener el valor de color rgba que tiene cada uno de ellos para posteriormente hacer la operación de convolución.

Por otra parte, desde “mask.js” se envía como variable uniforme al fragment shader la máscara que ha creado el usuario con los elementos de la interfaz. Esta máscara se envía en forma de un arreglo de 25 posiciones que busca representar la matriz de 5x5 que compone la máscara.

<div align="center">
<img src="/showcase/sketches/image_processing/PrimeraImagen.jpg" alt="PrimeraImagen" style="height: 356px; width:700px;"/>
</div>

La función crearElementosInterfaz() también es importante, ya que en esta función se crean todos los cuadros de texto que posteriormente serán utilizados para recibir los valores que ingrese el usuario y crear la máscara de convolución que se enviará al fragment shader.

Dentro del archivo “mask.frag” es donde se realiza toda la operación de convolución a partir de los valores de la máscara enviados por el usuario y los colores de los píxeles vecinos.

Dentro del fragment shader calculan las coordenadas de todos los píxeles vecinos a partir de las coordenadas de textura del píxel, el offset vertical (texOffset.t) y el offset horizontal (texOffset.s). Al moverse una unidad hacia la derecha o hacia la izquierda con el offset horizontal se accede a las coordenadas de textura del píxel derecho o izquierdo respectivamente. Igualmente, al moverse una unidad hacia arriba o hacia abajo con el offset vertical se accede a las coordenadas de textura del pixel arriba o abajo respectivamente.

En el siguiente diagrama se muestran la ubicación de las coordenadas de textura de cada uno de los píxeles vecinos que se calculan en el código. tc12 es la coordenada de textura del pixel que sobre el cual actualmente se está haciendo la operación convolución.

<div align="center">
<img src="/showcase/sketches/image_processing/SegundaImagen.jpg" alt="SegundaImagen" style="height: 400px; width:600px;"/>
</div>

Una vez se tienen todas las coordenadas de textura de los vecinos, se obtiene el color de cada píxel con el método [texture2D()](https://thebookofshaders.com/glossary/?search=texture2D) y se almacena en el arreglo rgba.

Finalmente se realiza la convolución, multiplicando el valor de RGBA de cada vecino por el valor de la máscara que le corresponde. Una vez se calcula el color de salida que debe tener el píxel se asigna el color a la variable [gl_FragColor](https://thebookofshaders.com/02/?lan=es).

## Resultados
La aplicación en ejecución es la siguiente:

<div align="center">
{{< p5-iframe sketch="/showcase/sketches/image_processing/mask.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="750" height="685" >}}
</div>

Desde la interfaz gráfica el usuario puede ingresar valores a una matriz de tamaño 5x5 y también puede ingresar un factor por el cual multiplicar todos los valores de la matriz. Una vez ha ingresado los valores, en la parte derecha se ve una matriz de 5x5 que muestra los valores de la máscara obtenida al multiplicar el factor por los valores de la matriz. 

Cabe destacar que en la interfaz se muestran los valores de la máscara obtenida aproximados a 3 cifras decimales. Pero internamente en la aplicación los valores que se almacenan y utilizan en la máscara son valores exactos de la operación, no la aproximación a 3 cifras decimales.
Una vez se calcula la máscara, abajo se puede chequear el checkbox “Aplicar Máscara Obtenida” para que en la imagen de arriba se empiece a aplicar la máscara.

Si se hacen cambios en la máscara mientras el checkbox está activo estos se verán reflejados en la imagen de arriba y se obtendrán diferentes resultados.

Finalmente, si el usuario quiere aplicar la máscara sobre otra imagen o video, en la parte inferior de la aplicación hay un botón para subir el archivo. Una vez sube el archivo, este se mostrará en la parte superior de la aplicación.

En el siguiente video se hace una demostración del uso de la aplicación y se muestran algunos ejemplos de máscaras aplicadas a imágenes o videos:
<div align="center">
<iframe width="728" height="378" src="https://youtube.com/embed/yNsh4HLkemc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
</div>

## Conclusiones y trabajo futuro

Este trabajo permitió ver una implementación de las máscaras de convolución en p5js con el fragment shader. Esta es una implementación que es bastante rápida y permite al usuario fácilmente modificar la máscara y ver inmediatamente los efectos que tiene dicho cambio sobre la imagen.

Por otra parte, con la implementación del factor se puede observar que al aumentar dicho factor se pueden modificar los efectos de una máscara fácilmente.

Como trabajo futuro puede se pueden incluir tamaños de máscara más grandes o permitir a la aplicación aplicar varias máscaras de convolución para lograr otros efectos más complejos.

## Bibliografía

Charalambos, J. Masking. https://visualcomputing.github.io/docs/visual_illusions/masking/

Charalambos, J. Image Processing. https://visualcomputing.github.io/docs/shaders/image_processing/

Charalambos, J. Libreria Treegl. https://github.com/VisualComputing/p5.treegl

Gonzales, P & Lowe J. Hola mundo - The Book of Shaders. https://thebookofshaders.com/02/?lan=es

Gonzales, P & Lowe J. Texture2D - The Book of Shaders. https://thebookofshaders.com/glossary/?search=texture2D

Powell, V. Image Kernels explained visually. https://setosa.io/ev/image-kernels/

Wikipedia. Kernel (image processing). https://en.wikipedia.org/wiki/Kernel_%28image_processing%29

