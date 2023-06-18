---
Weight: 1
---

# Texturing

## Introducción

En este ejercicio se buscó invertir una imagen tanto en el eje horizontal como en el eje vertical de dos maneras. La primera manera fue modificando la forma en que se aplica la textura sobre una figura creada dentro de un archivo de p5js. La segunda manera fue modificando las coordenadas de textura que mostraba cada píxel dentro del fragment shader.

Cabe destacar que este ejercicio fue propuesto en clase y se basa en los códigos “luma.js” y “luma.frag” de la sección [texturing](https://visualcomputing.github.io/docs/shaders/texturing/) del libro del curso.

## Marco Teórico / Antecedentes

### Invertir la imagen desde javascript con p5js:

Dentro de p5js se pueden crear figuras personalizadas con los métodos [beginShape()](https://p5js.org/es/reference/#/p5/beginShape), [endShape()](https://p5js.org/es/reference/#/p5/endShape) y [vertex()](https://p5js.org/es/reference/#/p5/vertex). Cuando se crea una figura empleando dichos métodos se puede aplicar una textura sobre ella relacionando cada vértice de la figura con una coordenada de la textura que se quiere aplicar.

Esta relación entre los vértices de la figura y las coordenadas de la textura se realiza en el método vertex(). Como se muestra en la [documentación](https://p5js.org/es/reference/#/p5/vertex), cuando se llama el método vertex(x, y, z, u, v) dentro de p5 se relaciona el vértice de la figura ubicado en la posición (x, y, z) con las coordenadas de la textura (u, v), siendo u la coordenada en el eje horizontal y v la coordenada en el eje vertical de la textura.

Cabe resaltar que p5js ofrece dos modos para aplicar la textura sobre la figura por medio del método [textureMode()](https://p5js.org/es/reference/#/p5/textureMode). El primer modo se llama IMAGE. En este modo las coordenadas de la textura en el eje horizontal pueden tener un valor desde 0 hasta el ancho de la textura en píxeles. Igualmente, las coordenadas de la textura en el eje vertical pueden tener un valor desde 0 hasta el alto de la textura en píxeles.

El segundo modo se llama NORMAL. En este modo se normalizan las coordenadas de la textura, por lo cual, sin importar el tamaño de la textura las coordenadas de la textura tanto en el eje horizontal como en el eje vertical estarán entre 0 y 1 (inclusive).

Por ejemplo, si se tiene activado el modo NORMAL en p5js, las coordenadas de textura (u, v) de una imagen pueden verse de la siguiente manera:

<div align="center">
<img src="/showcase/sketches/texturing/PrimeraImagen.jpg" alt="EscaleraPerspectivaLineal" style="height: 356px; width:469px;"/>
</div>

Como se puede observar, en la esquina superior izquierda se tienen las coordenadas (0, 0) de textura. A medida que se avanza sobre el eje horizontal la coordenada u crece hasta el valor máximo de 1 y si se avanza en el eje vertical la coordenada v crece hasta un valor máximo de 1. En los ejemplos que se realizarán en este ejercicio se utilizará el modo de textura NORMAL en p5js.

Otro aspecto importante a resaltar es que al utilizar shaders dentro de p5js con WEBGL los vértices que son visibles en pantalla son los que están dentro del NDC (Normalize Device Coordinates), el cual es un cubo que va desde la coordenada -1 hasta 1 en los ejes X, Y, Z.

<div align="center">
<img src="/showcase/sketches/texturing/InternetImagen.jpg" alt="EscaleraPerspectivaLineal" style="height: 400px; width:469px;"/>

Imagen tomada de [este sitio](https://stackoverflow.com/questions/47233771/negative-values-for-gl-position-w)
</div>

Debido a lo anterior, todo lo que se dibuja dentro de un canvas de p5js al aplicar un shader se encuentra dentro de las coordenadas -1 hasta 1 en los ejes X, Y, Z.

Por ejemplo, si queremos dibujar una figura sobre el plano z=0 que ocupe todo el canvas dentro de p5js podemos dibujar un cuadrado cuyos vértices sean (-1,-1,0), (1,-1,0), (-1,1,0) y (1,1,0).

<div align="center">
<img src="/showcase/sketches/texturing/SegundaImagen.jpg" alt="EscaleraPerspectivaLineal" style="height: 400px; width:469px;"/>
</div>

Cuando se aplique una textura sobre dicha figura, los vértices de la textura se pueden relacionar con los vértices de la figura con el metodo [vertex()](https://p5js.org/es/reference/#/p5/vertex) como se había explicado previamente.

Por ejemplo, si queremos que la textura que mostramos previamente se aplique sobre el cuadrado que tenemos dentro del NDC, entonces podemos relacionar los vértices de la siguiente manera.

<div align="center">
<img src="/showcase/sketches/texturing/TerceraImagen.jpg" alt="EscaleraPerspectivaLineal" style="height: 500px; width:550px;"/>
</div>

Al relacionar de esta forma los vértices de la figura con las coordenadas de textura entonces se mostraría en el canvas la imagen igual a la que estaba en la textura.

Pero, si modificamos la forma en que relacionamos los vértices de la figura y la textura  podemos invertir la imagen. Esto se puede lograr al hacer que cada vértice de la figura se relacione con la coordenada de textura opuesta a la que mostramos en la imagen anterior. En el siguiente diagrama se expresa esta idea.

<div align="center">
<img src="/showcase/sketches/texturing/CuartaImagen.jpg" alt="EscaleraPerspectivaLineal" style="height: 500px; width:550px;"/>
</div>

Esta es la forma en la que planteamos invertir la imagen dentro de p5js en este ejercicio.

### Invertir la imagen desde el fragment shader:

Desde el fragment shader podemos definir los colores que van a tener los píxeles que se van a dibujar por medio de la variable reservada [gl_FragColor](https://thebookofshaders.com/02/?lan=es).

Por otra parte, cuando se asigna una textura a una figura (como se realizó en el anterior ejemplo) por medio del vertex shader se puede enviar al fragment shader las coordenadas de textura que corresponden a cada uno de los píxeles de la figura, de manera que cada pixel conozca qué coordenada de textura debe dibujar en su posición para que finalmente la textura completa se muestre en pantalla.

En este proceso, para calcular el color que cada pixel se usa la función glsl [texture2D(texture, texcoords)](https://thebookofshaders.com/glossary/?search=texture2D). La cual permite conocer el color (en rgba) que tiene una textura (texture) en las coordenadas (texcoords) que se ingresen en los argumentos.

Si en este proceso cada píxel recibe las coordenadas de textura que le corresponden y muestra el color de dicha coordenada entonces se dibujara la textura completa sobre la figura.

Pero si dentro del fragment shader las coordenadas de textura que cada píxel recibe se modifican, entonces el píxel podría mostrar otras partes de la textura y finalmente harían que la figura se muestre modificada en el canvas. 

Por ejemplo, si queremos invertir la imagen que se trae desde la textura lo que se debe hacer es que cada píxel muestre el color de las coordenadas de textura inversas.

Para calcular las coordenadas de textura inversa en el eje horizontal de un píxel se debe restar a 1 el valor de la coordenada horizontal de textura. 

Por ejemplo, si la coordenada de textura horizontal del píxel era u = 0.6, si calculamos (1 - 0.6) = 0.4 obtendremos la coordenada que corresponde a la posición inversa sobre el eje horizontal. 

Igualmente, si la coordenada de textura vertical del píxel era v = 0.6, si calculamos (1 - 0.6) = 0.4 obtendremos la coordenada que corresponde a la posición inversa sobre el eje vertical.

Si le ordenamos al pixel que muestre el color asociado a las coordenadas de textura inversas que ha calculado, entonces haremos que en vez de mostrar el color de la coordenada de textura (0.6, 0.6), muestre los colores de su coordenada de textura inversa (0.4, 0.4).

<div align="center">
<img src="/showcase/sketches/texturing/QuintaImagen.jpg" alt="EscaleraPerspectivaLineal" style="height: 350px; width:450px;"/>
</div>

Realizando este procedimiento con todos los píxeles se obtendrá como resultado que la imagen quede invertida. Esta es la segunda manera en que se invertirá la imagen dentro de este ejercicio.

## Código

Para realizar este ejercicio se utilizó la librería [treegl](https://github.com/VisualComputing/p5.treegl) para facilitar la creación del vertex shader. El vertex shader generado por la librería se muestra en la consola del navegador.

A continuación se muestra el código en javascript “luma.js” y el fragment shader “luma.frag”, los cuales son códigos modificados respecto a los que se encontraban en el ejemplo original de [texturing](https://visualcomputing.github.io/docs/shaders/texturing/) del libro del curso

{{< details "Código luma.js" close >}}
```java
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
```
{{< /details >}}

{{< details "Código luma.frag" close >}}
```glsl
precision mediump float;

// Las uniform son definidas y enviadas por el sketch
uniform bool lightness;
uniform sampler2D texture;
uniform bool uv; // visualizacion uv
uniform bool invertir; //invertir imagen desde shader

// Coordenadas de texturas normalizadas e interpoladas del espacio de textura
// deben tener el mismo tipo y nombre que en el vertex shader
varying vec2 texcoords2; // (definidas en [0..1] ∈ R)

// retorna el luma de un texel dado
float luma(vec4 texel) {
  // el canal alfa (texel.a) es descartado
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}


void main() {
  // texture2D(texture, texcoords2) muestrea la textura en texcoords2
  // y retorna el color del texel normalizado
  //Verificar si se quieren invertir la imagen para calcular las coordenadas 
  //de textura inversa
  vec4 texel = invertir ? texture2D(texture, vec2(1.0-texcoords2.s, 1.0-texcoords2.t)) : texture2D(texture, texcoords2);
                                                        
  gl_FragColor = uv ? (invertir ? vec4(1.0-texcoords2.st,0.0,1.0) : vec4(texcoords2.st, 0.0, 1.0)) :
                lightness ? vec4(vec3(luma(texel)), 1.0) : texel;
}
```
{{< /details >}}

En el archivo “luma.js” dentro de la función draw se encuentra el código con los métodos [beginShape()](https://p5js.org/es/reference/#/p5/beginShape), [endShape()](https://p5js.org/es/reference/#/p5/endShape) y [vertex()](https://p5js.org/es/reference/#/p5/vertex) en donde se relacionan los vértices de la figura y las coordenadas de la textura.

Si la variable “invertirJavascript” es verdadera, entonces se relacionarán los vértices de la figura y las coordenadas de textura para que se vea invertida como se vio en el marco teórico. Si es falsa entonces se relacionarán de forma que no se vea modificación en la imagen. 

Por otra parte, en el archivo “luma.frag” dependiendo de la variable uniforme booleana “invertir” que se recibe desde el archivo “luma.js”. Si la variable es verdadera entonces el píxel tomará el color de las coordenadas de textura invertidas y finalmente se mostrará la imagen invertida. Si la variable es falsa entonces el pixel tomará el color de las coordenadas de textura que recibe desde el vertex shader.

## Resultados
La aplicación en ejecución es la siguiente:

<div align="center">
{{< p5-iframe sketch="/showcase/sketches/texturing/luma.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="719" height="530" >}}
</div>

Oprimiendo los checkbox de la interfaz se puede invertir la imagen desde Javascript o desde el Fragment Shader. Si se invierte la imagen desde Javascript y se invierte la imagen desde el Fragment Shader al tiempo entonces se verá de nuevo la imagen original, ya que la imagen se invierte dos veces.

Dentro del código también se puede activar la visualización de las coordenadas de textura u y v. Entre más rojo contenga una coordenada mayor es su valor en el eje u, y entre más verde contenga una coordenada mayor es su valor en el eje v. Cabe destacar que con esta visualización al invertir la imagen por cualquiera de los dos métodos se puede observar como se ven modificadas las coordenadas de textura que corresponden a cada píxel.

Como en el [ejemplo original](https://visualcomputing.github.io/docs/shaders/texturing/)  del curso, se puede aplicar como textura un video (Si se elige el video puede tardar un poco en cargarse y empezar a mostrar el video) o se puede visualizar la luminosidad de los pixeles calculando el luma de cada uno de ellos.

## Conclusiones y trabajo futuro

En este trabajo se pudo evidenciar que desde Javascript y desde el Fragment Shader se pueden modificar la forma en que se muestra una textura, en este caso, invirtiendo la textura recibida. Incluso, se puede aplicar un efecto desde Javascript y posteriormente aplicar otro efecto más desde el Fragment Shader, de manera que se logre alcanzar efectos más complejos.

Como trabajo futuro se podrían incluir más efectos que se puedan realizar tanto desde Javascript como desde el Fragment Shader y comparar sus rendimientos para reconocer cual es la forma más óptima de implementarlos.

## Bibliografía
