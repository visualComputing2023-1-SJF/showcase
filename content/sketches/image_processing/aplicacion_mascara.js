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
  
  //Pasar variables uniformes al shader
  maskShader.setUniform('texture',media_src)
  
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


  //Mandar la mascara como uniforme
  maskShader.setUniform('mask',mascaraObtenida);

  //Funcion que se encarga de actualizar los valores mostrados en la interfaz
  //de la máscara obtenida
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
  //Aproximados a 3 cifras decimales
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