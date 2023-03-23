# Phong Reflection
## Propuesta 
Para este ejemplo se propone realizar un programa que permita evidenciar el modelo de iluminación de Phong con coloreado por interpolación y coloreado plano mediante shaders, sobre un modelo 3d en formato ".obj". En este último coloreado se evidenciará un efecto de bandas Mach.
## Código
En este código se destacan tres aspectos. 
En primer lugar la forma para cargar un modelo 3d en formato .obj , el cual contiene información de la posición de los vértices, texturas y vectores normales, entre otros. Y en tercer lugar la forma de cargar un shader en p5, el cuál se compone de dos archivos: uno .vert que contiene información de los vértices del modelo y otro .frag que le indica a WEBGL como realizar el rasterizado y colorear la imagen generada.

{{< details "Carga de modelos y shaders" close >}}
```java
function preload(){
  myModel = loadModel("/showcase/sketches/mach_bands/objects/BustBaseMesh_Lowpoly.obj", true, modelLoaded , loadFailed); 
  solidPhongShader = loadShader("/showcase/sketches/mach_bands/solidShader.vert", "/showcase/sketches/mach_bands/solidShader.frag");
  smoothPhongShader = loadShader("/showcase/sketches/mach_bands/phongShader.vert", "/showcase/sketches/mach_bands/phongShader.frag");
}
```
{{< /details>}}

El segundo lugar está la implementación de una cámara que puede desplazarse en el espacio y que responde a movimientos del teclado y del ratón. Este fragmento de código es el que permite este comportamiento:
{{< details "Movimiento dinámico de cámara" close >}}
```java
if (mouseCaptured) {
    // Escape to stop capturing mouse
    if (keyIsDown(27)) {
      mouseCaptured = false;
      exitPointerLock();
    }
    // Space to reset the camera
    if (keyIsDown(32)){
      myCamera.setPosition(0,-20,200);
      myCamera.lookAt(0,-20,0);
    }         
      
    myCamera.pan(-movedX * mouseSensitivity);
    myCamera.tilt(movedY * mouseSensitivity);
    myCamera.move(
    // D - right, A - left 
    (keyIsDown(68) ? cameraSpeed : 0) + (keyIsDown(65) ? -cameraSpeed : 0),
    // Q - down, E - up
    (keyIsDown(81) ? cameraSpeed : 0) + (keyIsDown(69) ? -cameraSpeed : 0),
    // S - backward, W - forward
    (keyIsDown(83) ? cameraSpeed : 0) + (keyIsDown(87) ? -cameraSpeed : 0));
} 
```
{{< /details>}}

En tercer lugar, la implementación del coloreado interpolado y sólido se hace mediante la implementación del modelo de iluminación de Phong, mediante el uso de shaders. Se destacan los dos shaders frag. 

El correspondiente al coloreado con interpolación, donde se puede observar como se determina cada uno de los tres componentes de la iluminación: luz ambiente, luz de difusión y luz especular, respecto a cada una de las normales de los vértices del modelo poligonal. Finalmente es WEBGL quien se encarga de realizar la interpolación con los cálculos suministrados para rasterizar los pixeles restantes.

{{< details "PhongColoring.frag" close >}}
```c
precision lowp float;

varying vec4 v_normal;

void main() {
  
  // ambient lighting (global illuminance)
  vec3 ambient = vec3(0.5,0.5,0.5); // color - grey 

  // diffuse (lambertian) lighting
  // lightColor, lightSource, normal, diffuseStrength
  vec3 normal = normalize(v_normal.xyz);
  vec3 lightColor = vec3(1.0, 1.0, 1.0); // color - white
  vec3 lightSource = vec3(1.0, 1.0, 1.0); // coord - (1, 0, 0)
  float diffuseStrength = max(0.0, dot(lightSource, normal));
  vec3 diffuse = diffuseStrength * lightColor;

  // specular light
  // lightColor, lightSource, normal, specularStrength, viewSource
  vec3 cameraSource = vec3(0.0, 0.0, 1.0);
  vec3 viewSource = normalize(cameraSource);
  vec3 reflectSource = normalize(reflect(-lightSource, normal));
  float specularStrength = max(0.0, dot(viewSource, reflectSource));
  specularStrength = pow(specularStrength, 256.0);
  vec3 specular = specularStrength * lightColor;
  

  // lighting = ambient + diffuse + specular
  vec3 lighting = vec3(0.5, 0.5, 0.5); // color - black
  // lighting = ambient;
  // lighting = ambient * 0.0 + diffuse;
  // lighting = ambient * 0.0 + diffuse * 0.0 + specular;
  lighting = ambient * 0.5 + diffuse * 0.5 + specular * 0.5;

  // color = modelColor * lighting
  vec3 modelColor = vec3(1, 1, 1);
  vec3 color = modelColor * lighting;

  gl_FragColor = vec4(color, 1.0);
}
```
{{< /details>}}

El correspondiente al coloreado plano, emplea dos funciones dfdx y dfdy para calcular dos vectores paralelos a las caras polígonales y procede a calcular el producto cruz para hallar la normal al polígono respectivo. Finalmente se hacen todos los cálculos de la iluminación de Phong, suponiendo que esa nueva normal es la misma para cada uno de los tres vértices del triángulo, el resultado de la interpolación hará que todos los pixeles que conforman a este polígono tengan el mismo color.

{{< details "solidColoring.frag" close >}}
```c
#extension GL_OES_standard_derivatives : enable
#extension GL_EXT_shader_texture_lod : enable
precision mediump float;

varying vec3 vertex_view_space;

void main() {
  
  // ambient lighting (global illuminance)
  vec3 ambient = vec3(0.5,0.5,0.5); // color - grey 

  // diffuse (lambertian) lighting
  // lightColor, lightSource, normal, diffuseStrength
  vec3 U = dFdx(vertex_view_space);                     
  vec3 V = dFdy(vertex_view_space);                 
  vec3 normal = normalize(cross(U,V));
  vec3 lightColor = vec3(1.0, 1.0, 1.0); // color - white
  vec3 lightSource = vec3(1.0, 1.0, 1.0); // coord - (1, 0, 0)
  float diffuseStrength = max(0.0, dot(lightSource, normal));
  vec3 diffuse = diffuseStrength * lightColor;

  // specular light
  // lightColor, lightSource, normal, specularStrength, viewSource
  vec3 cameraSource = vec3(0.0, 0.0, 1.0);
  vec3 viewSource = normalize(cameraSource);
  vec3 reflectSource = normalize(reflect(-lightSource, normal));
  float specularStrength = max(0.0, dot(viewSource, reflectSource));
  specularStrength = pow(specularStrength, 256.0);
  vec3 specular = specularStrength * lightColor;
  

  // lighting = ambient + diffuse + specular
  vec3 lighting = vec3(0.5, 0.5, 0.5); // color - black
  // lighting = ambient;
  // lighting = ambient * 0.0 + diffuse;
  // lighting = ambient * 0.0 + diffuse * 0.0 + specular;
  lighting = ambient * 0.5 + diffuse * 1.0 + specular * 0.0;

  // color = modelColor * lighting
  vec3 modelColor = vec3(1, 1, 1);
  vec3 color = modelColor * lighting;

  gl_FragColor = vec4(color, 1.0);
}
```
{{< /details>}}

Cabe resaltar que los shaders mostrados anteriormente, son modificaciones de los shaders presentados por [Adam Ferriss](https://github.com/aferriss/p5jsShaderExamples) y por [SubOptimal Engineer](https://github.com/SuboptimalEng/shader-tutorials)

## Resultados
{{< p5-iframe sketch="/showcase/sketches/modelShading.js" width="600" height="600" >}} 

## Conclusiones y trabajo a futuro

Se observa que el trabajo con shaders facilita la implementación de algoritmos de iluminación como el de Phong o uno de coloreado sólido. Al momento de implementar el shader de coloreado plano, se observa que la iluminación también depende de hacia donde está enfocando la cámara, debido principalmente a que las derivadas parciales se calculan en función de esta variable, por lo que convendría encontrar una implementación que no necesitara de esta.

En general se consigue que mediante shaders se consiguen resultados más óptimos a nivel de recursos y sin la necesidad de crear la geometría directamente en p5. En implementaciones futuras se podría combinar con técnicas de renderizado como z-culling para mostrar escenas más complejas.