let lumaShader;
let src;
let img_src;
let vidread;
let video_on;
let lightness;
let uv;
let invertirJavascript = false;

function preload() {
  lumaShader = readShader('/showcase/sketches/texturing/luma.frag',{ varyings: Tree.texcoords2 });
  
  // Cargar el video, el video fue obtenido de https://upload.wikimedia.org/wikipedia/commons/8/87/Schlossbergbahn.webm
  video_src = createVideo('../../../../../showcase/sketches/texturing/VideoTren.webm');
  video_src.hide(); // Esto para evitar que el video se muestre fuera de la textura
  
  // Cargar la imagen, la imagen fue obtenida de https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Fire_breathing_2_Luc_Viatour.jpg/1024px-Fire_breathing_2_Luc_Viatour.jpg
  img_src = loadImage('../../../../../showcase/sketches/texturing/ImagenFuego.jpg');
  src = img_src;
}

function setup() {
  //Crear el Canvas
  createCanvas(700, 500, WEBGL);
  
  //Modo de textura normal
  textureMode(NORMAL);
  
  //Aplicar el shader
  shader(lumaShader);
  
  //Llamar funcion en donde se crean elementos de la interfaz
  crearElementosInterfaz()
}

function draw() {
  //Enviar textura al shader
  lumaShader.setUniform('texture', src);
  
  //Asignar textura
  texture(src)
  
  //Verificar si se quiere invertir la imagen o video desde javascript
  if (invertirJavascript){
        /*
        Cubo NDC, las coordenadas de los vertices en x, y, z ∈ [-1..1]
        Dado que el modo de textureMode es NORMAL, las coordenadas de textura u, v  ∈ [-1..1]
                y                  (1,1)    (0,1)
                |                  *__________*___ u
        (-1,1,0)|   (1,1,0)        | Espacio  |
          *_____|_____*            | textura  |    
          |     |     |            |          |        
          |____NDC____|__x         *__________*       
          |     |     |            (1,0)     (0,0)
          *_____|_____*            |
        (-1,-1,0)   (1,-1,0)       v
        */ 
    //Mostrar imagen invertida
    beginShape();
    // El formato es: vertex(x, y, z, u, v)
    vertex(-1, -1, 0, 1, 0);
    vertex(1, -1, 0, 0, 0);
    vertex(1, 1, 0, 0, 1);
    vertex(-1, 1, 0, 1, 1);
    endShape();
  } else {
            /*
        Cubo NDC, las coordenadas de los vertices en x, y, z ∈ [-1..1]
        Dado que el modo de textureMode es NORMAL, las coordenadas de textura u, v  ∈ [-1..1]
                y                  (0,0)    (1,0)
                |                  *__________*___ u
        (-1,1,0)|   (1,1,0)        | Espacio  |
          *_____|_____*            | textura  |    
          |     |     |            |          |        
          |____NDC____|__x         *__________*       
          |     |     |            (0,1)     (1,1)
          *_____|_____*            |
        (-1,-1,0)   (1,-1,0)       v
        */ 
    //Mostrar imagen original
    beginShape();
    // El formato es: vertex(x, y, z, u, v)
    vertex(-1, -1, 0, 0, 1);
    vertex(1, -1, 0, 1, 1);
    vertex(1, 1, 0, 1, 0);
    vertex(-1, 1, 0, 0, 0);
    endShape();
  }
}


function crearElementosInterfaz(){
  
  //Checkbox para seleccionar video
  video_on = createCheckbox('Video', false);
  video_on.style('color', 'white');
  video_on.changed(() => {
    src = video_on.checked() ? video_src : img_src;
    video_on.checked() ? video_src.loop() : video_src.pause();
  });
  video_on.position(10, 10);
  
  //Checkbox para seleccionar luma
  lightness = createCheckbox('Luma', false);
  lightness.position(10, 30);
  lightness.style('color', 'white');
  lightness.input(() => lumaShader.setUniform('lightness', lightness.checked()));
  
  //Checkbox para visualizar las coordenadas de textura UV
  uv = createCheckbox('Visualización UV', false);
  uv.style('color', 'white');
  uv.changed(() => lumaShader.setUniform('uv', uv.checked()));
  uv.position(10, 50);
  
  //Checkbox para invertir la imagen desde Javascript
  check_invertirJavascript = createCheckbox('Invertir desde Javascript', false);
  check_invertirJavascript.style('color', 'white');
  check_invertirJavascript.position(10,70);
  check_invertirJavascript.changed(() => {
    invertirJavascript = !invertirJavascript
  });
  
  //Checkbox para invertir la imagen desde el Shader
  check_invertirShader = createCheckbox('Invertir desde Fragment Shader');
  check_invertirShader.style('color','white');
  check_invertirShader.position(10,90);
  check_invertirShader.changed(() => lumaShader.setUniform('invertir', check_invertirShader.checked())); 
}