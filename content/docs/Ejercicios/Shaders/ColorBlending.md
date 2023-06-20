---
Weight: 1
---

# Color Blending Modes

## Introducción

En este ejercicio se construyeron cinco fragment shaders que permiten mezclar dos colores diferentes, que pueden seleccionarse a través de un picker y visualizarse en dos cuadrados en la parte superior del canvas, mientras que el color resultante puede visualizarse en otro cuadrado en la parte inferior. Los modos de Blending pueden seleccionarse a través de un dropdown.  

## Antecedentes

Los Blending Modes determinan el proceso mediante el cual se mezclan dos colores de dos capas diferentes en computación gráfica. Existen infinidad de métodos de blending diferentes, pero en nuestro caso nos enfocaremos en **cinco**:  

1. **Normal**: El color de la capa superior reemplaza al de la capa inferior.  
   f(a,b) = b  
   Donde *b* es el valor de un canal de la capa superior y *a* el de la capa inferior.
   
2. **Multiply**: Cada canal del color resultante es el producto de los canales de ambas capas.  
   
   f(a,b) = a * b  

   Donde *b* es el valor de un canal de la capa superior y *a* el de la capa inferior.  
   Si *a* y *b* son valores mayores a 0, el valor resultante de cada canal es menor que el de ambos canales originales. Por lo tanto, el color resultante es más oscuro que el de ambas capas originales.

3. **Screen**: Cada canal del color resultante es el complemento del producto de los complementos de los canales de ambas capas.  
     
   f(a,b) = 1 - (1 - a) * (1 - b)  
     
   Donde *b* es el valor de un canal de la capa superior y *a* el de la capa inferior.
   El efecto de screen es el opuesto al de multiply. Si *a* y *b* son valores mayores a 0, el valor resultante de cada canal es mayor que el de ambos canales originales. Por lo tanto, el color resultante es más claro que el de ambas capas originales.

4. **Overlay**: Si el canal de la capa inferior es menor a 0.5, el color resultante es el doble del producto de los canales de ambas capas. Si el canal de la capa inferior es mayor a 0.5, el color resultante es el complemento del doble del producto de los complementos de los canales de ambas capas.  
  
   si a < 0.5:  
   f(a,b) = 2 * a * b     
   En otro caso:  
   f(a,b) = 1 - 2 * (1 - a) * (1 - b)   
     
   Donde *b* es el valor de un canal de la capa superior y *a* el de la capa inferior.  
Este modo de mezcla combina los efectos de multiply y screen. Cuando la capa base es clara, la superior se aclara. Cuando la capa base es oscura, la superior se oscurece.

5. **Dissolve**: Cada canal del color resultante es el valor de la capa superior o el de la capa inferior, dependiendo de un valor aleatorio.  
   
   Si random() < max(a,b):  
   f(a,b) = max(a,b)   
   Si random() >= max(a,b):   
   f(a,b) = min(a,b) 

   Donde *b* es el valor de un canal de la capa superior y *a* el de la capa inferior.  
   Como resultado se obtiene una especie de efecto grano sobre el color resultante.


## Código

El jugo del programa se encuentra en los fragment shaders para cada uno de los modos de blending. En los siguientes recuadros se mostrará cada uno de ellos:  

{{< details "Normal blending" close >}}
```glsl
precision mediump float;

// uniforms are emitted from the sketch
// https://p5js.org/reference/#/p5.Shader/setUniform
uniform vec4 uMaterial2;

void main() {
  gl_FragColor = uMaterial2;
}
```
{{< /details>}}

{{< details "Multiply blending" close >}}
```glsl
precision mediump float;

// uniforms are emitted from the sketch
// https://p5js.org/reference/#/p5.Shader/setUniform
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;

void main() {
  gl_FragColor = uMaterial1 * uMaterial2;
}
```
{{< /details>}}

{{< details "Screen blending" close >}}
```glsl
precision mediump float;

// uniforms are emitted from the sketch
// https://p5js.org/reference/#/p5.Shader/setUniform
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;

void main() {
  gl_FragColor = vec4(1.0,1.0,1.0,1.0)-(vec4(1.0,1.0,1.0,1.0) - uMaterial1) * (vec4(1.0,1.0,1.0,1.0) - uMaterial2);  
}
```
{{< /details>}}

{{< details "Overlay blending" close >}}
```glsl
precision mediump float;

// uniforms are emitted from the sketch
// https://p5js.org/reference/#/p5.Shader/setUniform
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;

void main() {
  float redChannel = (uMaterial1.r <= 0.5)? 2.0 * uMaterial1.r * uMaterial2.r : 1.0 - 2.0 * (1.0 - uMaterial1.r)*(1.0 - uMaterial2.r) ;
  float greenChannel = (uMaterial1.g <= 0.5)? 2.0 * uMaterial1.g * uMaterial2.g : 1.0 - 2.0 * (1.0 - uMaterial1.g)*(1.0 - uMaterial2.g) ;
  
  float blueChannel = (uMaterial1.b <= 0.5)? 2.0 * uMaterial1.b * uMaterial2.b : 1.0 - 2.0 * (1.0 - uMaterial1.b)*(1.0 - uMaterial2.b) ;
  
  gl_FragColor = vec4(redChannel,greenChannel, blueChannel, 1.0);
  
}
```
{{< /details>}}

Como se puede observar los anteriores shaders son sencillamente el resultado de aplicar las fórmulas de blending correspondientes a cada modo.

Para el último modo de blending, dissolve, se utilizó un generador de números aleatorios en glsl tomado del [Book of Shaders](https://thebookofshaders.com/10/) de Patricio Gonzales y Jen Lowe, el cual puede generar un número aleatorio a partir de una coordenada en el espacio de la pantalla. El código del shader es el siguiente:

{{< details "Dissolve blending" close >}}
```glsl
precision mediump float;

// uniforms are emitted from the sketch
// https://p5js.org/reference/#/p5.Shader/setUniform
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
  vec2 st = gl_FragCoord.xy;
  float randomNumber =  random(st);
  vec2 rgbAverageValue = vec2((uMaterial1.r+uMaterial1.g+uMaterial1.b)/3.0, (uMaterial2.r+uMaterial2.g+uMaterial2.b)/3.0);  
  float maxRGBAverage = (rgbAverageValue[0]>=rgbAverageValue[1])?rgbAverageValue[0]:rgbAverageValue[1] ;
   bool maxIsLowerLayer = (rgbAverageValue[0]>=rgbAverageValue[1]) ? true:false ;
  gl_FragColor = (randomNumber <= maxRGBAverage) ? ((maxIsLowerLayer)?uMaterial1:uMaterial2) : ((maxIsLowerLayer)?uMaterial2:uMaterial1);
}
```
{{< /details>}}

Finalmente, el programa de p5.js que utiliza los shaders es el siguiente:

{{< details "sketch.js" close >}}
```javascript
//Variables para los selectores de color
let colorPicker1;
let colorPicker2;

// Selector de Shader
let sel;

//Variables para shader
let multiply;
let normal;
let screen;
let overlay;
let dissolve;

let blendingModesObject = {
  "multiply": ()=> {
  shader(multiply)
  multiply.setUniform('uMaterial1',[colorPicker1.color().levels[0]/255,colorPicker1.color().levels[1]/255,colorPicker1.color().levels[2]/255,colorPicker1.color().levels[3]/255])
  
   multiply.setUniform('uMaterial2',[colorPicker2.color().levels[0]/255,colorPicker2.color().levels[1]/255,colorPicker2.color().levels[2]/255,colorPicker2.color().levels[3]/255])  
},
  "normal" : () => {
   
 shader(normal);   normal.setUniform('uMaterial2',[colorPicker2.color().levels[0]/255,colorPicker2.color().levels[1]/255,colorPicker2.color().levels[2]/255,colorPicker2.color().levels[3]/255])  
  },
  "screen" : () => {
    shader(screen)
  screen.setUniform('uMaterial1',[colorPicker1.color().levels[0]/255,colorPicker1.color().levels[1]/255,colorPicker1.color().levels[2]/255,colorPicker1.color().levels[3]/255])
  
   screen.setUniform('uMaterial2',[colorPicker2.color().levels[0]/255,colorPicker2.color().levels[1]/255,colorPicker2.color().levels[2]/255,colorPicker2.color().levels[3]/255])  
  },
  "overlay" : () => {
    shader(overlay);
    overlay.setUniform('uMaterial1',[colorPicker1.color().levels[0]/255,colorPicker1.color().levels[1]/255,colorPicker1.color().levels[2]/255,colorPicker1.color().levels[3]/255])
  
   overlay.setUniform('uMaterial2',[colorPicker2.color().levels[0]/255,colorPicker2.color().levels[1]/255,colorPicker2.color().levels[2]/255,colorPicker2.color().levels[3]/255])  
  },
  "dissolve" : () => {
    shader(dissolve);
    dissolve.setUniform('uMaterial1',[colorPicker1.color().levels[0]/255,colorPicker1.color().levels[1]/255,colorPicker1.color().levels[2]/255,colorPicker1.color().levels[3]/255])
  
   dissolve.setUniform('uMaterial2',[colorPicker2.color().levels[0]/255,colorPicker2.color().levels[1]/255,colorPicker2.color().levels[2]/255,colorPicker2.color().levels[3]/255])  
  }   
}

function preload() {
  //Precargar el shader
  multiply = readShader('multiplyBlend.frag');
  normal = readShader('normalBlend.frag');
  screen = readShader('screenBlend.frag');
  overlay = readShader('overlayBlend.frag');
  dissolve = readShader('dissolveBlend.frag');
}

function setup() {
  //Crear canvas con el render de WEBGL
  createCanvas(400, 400, WEBGL);
  
  //Definir posicion y color iniciales de los selectores de color
  colorPicker1 = createColorPicker('#CC804D');
  colorPicker1.position(25, 25)
  
  colorPicker2 = createColorPicker('#E61A66')
  colorPicker2.position(200, 25);
  
  sel = createSelect();
  sel.position(10, 350);
  sel.option('Normal');
  sel.option('Multiply');
  sel.option('Overlay');
  sel.option('Screen');
  sel.option('Dissolve');
  sel.selected('Normal');    
}

function draw() {
  
  background(0)
  
  resetShader()
  
  fill(colorPicker1.color())
  rect(-170,-170,130,130)
  
  fill(colorPicker2.color())
  rect(5,-170,130,130)

  changeShader();
  
  beginShape()
    vertex(-0.4,0)
    vertex(-0.4,-0.8)
    vertex(0.4,-0.8)
    vertex(0.4,0)
  endShape()
}

function changeShader(){
  shaderName = sel.value().toLowerCase();  
  blendingModesObject[shaderName]();  
}


```
{{< /details>}}

De donde se resalta que para que el shader solo se aplique para el cuadro de mezcla y no para toda la pantalla, se utiliza la función `resetShader()` al comienzo de cada frame de dibujo. Luego, antes de dibujar el cuadro de mezcla, se llama a la función `changeShader()` que se encarga de cargar el shader seleccionado en el selector de mezcla.  

## Resultado

{{< p5-iframe sketch="/showcase/sketches/colorBlending.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="420" height="425" >}} 

## Conclusiones y trabajo futuro

Se lograron implementar satisfactoriamente cinco shaders que permiten la mezcla de colores de acuerdo a varios modos diferentes en los que solo bastaba aplicar una fórmula matemática o comparar frente a un número aleatorio.  
Una de las dificultades que se atravesó al momento de diseñar el programa fue el cómo aplicar un shader sobre una sola sección de la pantalla. Se hicieron múltiples manipulaciones en el fragment shader, pero al final se descubrió que resultaba mucho más fácil solo llamar el shader cuando se quería dibujar el cuadro de mezcla.  
A futuro podría considerarse la implementación de más modos de mezcla de colores, así como la implementación de otros tipos de mezcla como la mezcla de texturas. 

## Bibliografía

docs.krita.org. (2022). Blending Modes — Krita Manual 5.0.0 documentation. Recuperado el 19 de Julio de 2023, de https://docs.krita.org/en/reference_manual/blending_modes.html

Adobe Master transparency and blends pdf file. (s.f.). Recuperado el 19 de Julio de 2023, de https://www.adobe.com/content/dam/acom/en/devnet/pdf/pdf_reference_archive/master.pdf

GIMP and Photoshop Blending Modes visually explained and compared, parts one, two, three, and four. (s.f.). Recuperado el 19 de Julio de 2023, de https://www.gimp.org/tutorials/Blending_Modes/

JAVA demo on the image blending operator, an interactive JAVA-based image blending demo. (s.f.). Recuperado el 19 de Julio de 2023, de http://www.jhlabs.com/ip/blending/index.html

All the math behind photoshop compositing (including math for using alpha in complex compositions like softlight). (s.f.). Recuperado el 19 de Julio de 2023, de http://www.simplefilter.de/en/basics/mixmods.html

Image Blending Algorithm. (s.f.). Recuperado el 19 de Julio de 2023, de https://www.cs.cmu.edu/~ph/texfund/texfund.pdf