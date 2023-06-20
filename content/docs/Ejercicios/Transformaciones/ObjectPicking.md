# Object Picking

## Introducción

En este ejercicio se crea una escena con diferentes cuerpos sólidos (esferas, conos y cilindros), que rotan en torno al eje *x* y el eje *y* en el espacio y que se pueden seleccionar con el mouse. Para hacer uso del object picking, se llamó el método mousePicking de la librería P5.treegl.

## Antecedentes

El object picking es una técnica que permite seleccionar objetos de una escena 3d. La principal dificultad a la hora de implementar este concepto, es que WebGL es una librería de renderización en 3D, por defecto no posee una utilidad que permita realizar esta tarea. 

Una de las implementaciones más básicas consiste en hacer uso de dos fragment shaders. El primero de ellos colorea la escena tal y como se quiere mostrar en pantalla. El segundo de ellos consiste en un shader con una textura invisible que pinta un objeto con un color único asociado a una ID, de tal forma que al capturar el color de un pixel sobre dicho shader, se pueda saber la ID del objeto al cual pertenece.   


<div align="center">
  <img src="/showcase/sketches/picking/two_shaders.png">
  <div>Imagen tomada y adaptada de <a href="https://subscription.packtpub.com/book/game-development/9781788629690/8/ch08lvl1sec12/time-for-action-picking"> este enlace </a> </div>
</div>


El principal problema con este método, es que se hace necesario tener dos escenas idénticas, por lo que se requieren más recursos de computo. Una forma de solucionar esto, es manejar un frustum culling con un plano cercano de únicamente un pixel, de esta forma en el segundo shader no se tendrá que renderizar toda la escena, sino sólamente los pixeles que caigan sobre el rayo que forma el frustum.

<div align="center">
  <img src="/showcase/sketches/picking/frustum.jpg">
  <div>Imagen tomada de <a href="http://www.lighthouse3d.com/tutorials/view-frustum-culling/"> este enlace </a> </div>
</div>

Otro método, es hacer uso del ray casting. En este método, un rayo con origen en la cámara y dirigido hacia el puntero del mouse atraviesa la escena, y se comprueba si dicho rayo intersecta con algún objeto. Si es así, se selecciona dicho objeto. Este método es más eficiente a nivel computacional que el anterior cuando hay cientos de objetos en escena, sin embargo tiene el inconvente de ser difícil de implementar para geometrías de objetos complejas.

<div align="center">
  <img src="/showcase/sketches/picking/ray-casting.jpg">
  <div>Imagen tomada de <a href="http://away3d.com/tutorials/Introduction_to_Mouse_Picking"> este enlace </a> </div>
</div>

Una solución para el problema, es envolver al objeto con otro, que debe tener una geometría simple, como una esfera o un cubo, de esta manera es mucho más sencillo calcular la colisión del ray cast. Esta técnica es la que emplea la librería treegl. 

<div align="center">
  <img src="/showcase/sketches/picking/bounding_box.jpg">
  <div>Imagen tomada de <a href="https://www.oreilly.com/library/view/game-physics-cookbook/9781787123663/ch10s07.html"> este enlace </a> </div>
</div>

De igual forma, se puede adaptar este método para descomponer secciones de la geometría compleja y detectar colisiones para múltiples partes de esta.

<div align="center">
  <img src="/showcase/sketches/picking/bboxisect.png">
  <div>Imagen tomada de <a href="https://www.scratchapixel.com/lessons/3d-basic-rendering/introduction-acceleration-structure/bounding-volume.html  "> este enlace </a> </div>
</div>

## Código

Para este ejercicio se manejó un coloreado por medio de shaders, que se aplica medio de una textura sobre un buffer gráfico y un valor de color pasado al fragment shader mediante una uniforme. Para que el color cubra a todo el sólido se tiene que escalar por dos y restarle un uno en la posición de los vértices en el vertex shader.

{{< details "Vertex shader" close >}}
```glsl
/*
Vertex shader code to be coupled with fe21914a-6b60-4a29-bcd6-73801e7d5ff9 
Generated with treegl version 0.6.2
*/
precision mediump float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 texcoords2;
//uniform float zDepth;

void main() {
  //texcoords2 = aTexCoord;
   // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
 
  // send the vertex information on to the fragment shader
  gl_Position = positionVec4; 
} 
```
{{< /details>}}

{{< details "Fragment shader" close >}}
```glsl
precision mediump float;
uniform vec3 color;

// uniforms are emitted from the sketch
// https://p5js.org/reference/#/p5.Shader/setUniform
void main() {
  gl_FragColor = vec4(color, 1.0);
} 
```
{{< /details>}}

El método setup del sketch y el método draw se muestran a continuación:

{{< details "Sketch.js" close >}}
```javascript
let coloringShader;
let shaderTexture;
let figures = [];
let figureTypes = ["cylinder", "sphere" , "box"]
let rotations = [0.01,0.0,-0.01]
let checkbox;
let bullseye;
let scaleSlider;

function preload() {
  coloringShader = loadShader('shader.vert','shader.frag');
}

function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  checkbox = createCheckbox('Activate bullseyes', false);
  checkbox.position(10,10);
  checkbox.style('color', '#7CFC00');  
  scaleSlider = createSlider(0.5,5,1,0.5);
  scaleSlider.position(10,50);
  scaleSlider.style('width' , '80px');  
  
  shaderTexture = createGraphics(700, 500, WEBGL); 
  shaderTexture.shader(coloringShader);  
  texture(shaderTexture);  
  randomizeFigures(10); 
}

function draw() {    
  clear();
  
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);  
  background(205, 105, 94);
  
  bullseye = checkbox.checked();
  bullseyeSize = scaleSlider.value();
  console.log(bullseye)
  
  drawFigures(bullseye, bullseyeSize);   
}
``` 
{{< /details>}}

Aquí observamos dentro de la función `setup()`, como creamos un nuevo buffer gráfico al que llamamos shaderTexture y le pasamos el shader de coloreado. Dentro de esta misma función también inicializamos los objetos que se van a dibujar en pantalla por medio de la función `randomizeFigures(numberOfFigures)`.  

{{< details "randomizeFigures(numberOfFigures)" close >}}
```javascript
function randomizeFigures(numberOfFigures){
  // randomize figures
  for(let i=0; i<numberOfFigures; i++){
    let figure = {};
    let type = random(figureTypes);
    figure.type = type;
    if (type==="cylinder"){      
      figure.height = random(10,200);
      figure.radius = random(10,50);
    } else if (type==="sphere"){
      figure.radius = random(10,20);
    } else if (type === "box"){
      figure.height = random(10,100);
      figure.width = random(10,100);
      figure.depth = random(10,100);
    }
    
    figure.position = {"x":random(-width/4,width/4),"y":random(-height/4,height/4),"z":random(-width/4,width/4)}
    figure.color = [random(0,1),random(0,1),random(0,1)]
    
    figures.push(figure);         
  }  
}
``` 
{{< /details>}}


Dentro de la función `draw()` hacemos un llamado a la función `drawFigures()` que se encarga de dibujar los objetos cada Frame.

{{< details "drawFigures(bullseye, bullseyeSize)" close >}}
```javascript
function drawFigures(bullseye,bullseyeSize){
  // Draw Figures
  figures.forEach((figure) => {       
    let picked;     
       
    push();
    translate(-1*figure.position.x,-1*figure.position.y,-1*figure.position.z); 
    
    checkPickingAndColor(figure,bullseye,bullseyeSize);
    
    if (figure.type==="cylinder"){     
      
      cylinder(figure.radius,figure.height);      
    } else if (figure.type==="sphere"){     
      
      sphere(figure.radius);      
    } else if (figure.type==="box"){
      
      box(figure.width, figure.height, figure.depth);     
    }    
    translate(figure.position.x,figure.position.y,figure.position.z);    
    pop();   
  })  
}
``` 
{{< /details>}}

A su vez, dentro de esta función llamamos a la función `checkPickingAndColor(figure,bullseye,bullseyeSize)` que se encarga de verificar si el objeto está siendo seleccionado por el mouse y de colorearlo de negro en caso de que así sea o aplicarle el color que le fue asignado.

{{< details "checkPickingAndColor(figure,bullseye,bullseyeSize)" close >}}
```javascript

function checkPickingAndColor(figure , pickingSize){
  let picked = false;    
  if (figure.type === "cylinder" || figure.type === "sphere"){
    picked = mousePicking({
                     size: figure.radius * pickingSize,                     
                     shape: Tree.CIRCLE
                   });  
    
  } else if (figure.type === "box"){
    
    picked = mousePicking({
                     size: Math.min(...[figure.width,figure.height,figure.depth]) * pickingSize,
                     shape: Tree.SQUARE
                   });  
  }  
  
  // Get figure color
  if(picked){
    coloringShader.setUniform("color",[0.0,0.0,0.0]); 
  }else{
    coloringShader.setUniform("color",figure.color);          
  }
  shaderTexture.rect(0,0,width,height);
}
``` 
{{< /details>}}

También se hace un llamado a `ShowBullsEye(figure,showBullsEye, pickingSize)`, que se encarga de dibujar las dianas que corresponden a cada objeto.

{{< details "ShowBullsEye(figure,showBullsEye, pickingSize)" close >}}
```javascript

function ShowBullsEye(figure,showBullsEye, pickingSize){
  if (showBullsEye){
      push();
        strokeWeight(3);
        stroke('yellow');
        bullsEye(
            {
              size: (figure.type === "cylinder" || figure.type === "sphere")? figure.radius * pickingSize: Math.min(...[figure.width,figure.height,figure.depth]) * pickingSize ,
              shape: (figure.type === "cylinder" || figure.type === "sphere")? Tree.CIRCLE: Tree.SQUARE
            });
      pop();
  }
}
``` 
{{< /details>}}


## Resultados

A continuación se presenta el snippet con el programa en ejecución, se observa que las dianas no se están dibujando al seleccionar la opción, a pesar de que sí lo hacen en el [editor web de p5](https://editor.p5js.org/facaslo97/sketches/dtYThUdHM):  

{{< p5-iframe sketch="/showcase/sketches/objectPicking.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="720" height="525" >}} 



## Conclusiones y trabajo futuro

En este ejercicio se logró implementar el picking de objetos en 3D, usando la librería treegl de p5. Adicionalmente, se consiguió implementar un coloreado de los objetos empleando un buffer gráfico y un shader, donde se observó que se tuvieron que actualizar las coordenadas del vertex shader para poder aplicarlo como textura. Un problema que se observó, es que los bullseye no se están desplegando, a pesar de que sí lo hacen en el [p5 web editor](https://editor.p5js.org/facaslo97/sketches/dtYThUdHM).  

Como trabajo a futuro podría pensar en implementarse el object picking usando el método de color picking, implementando un segundo fragment shader y usando un frustum culling de 1 pixel.

## Bibliografía

Wright, R., & Sweetman, R. (2013). Implementing object picking using color. In OpenGL Development Cookbook (pp. 27-33). Packt Publishing.  

Whitted, T. (1980). An improved illumination model for shaded display. Communications of the ACM, 23(6),  343-349.  

Godot Engine contributors. (2021). Ray-casting. Godot Engine documentation.  

Charalambos, J. Libreria Treegl. https://github.com/VisualComputing/p5.treegl   

Mauricio Meza Burbano & Charalambos, J. Exploración de WebGL - Gráficos 3D en la Web Informe Final de Pasantía  