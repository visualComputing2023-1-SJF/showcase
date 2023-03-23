---
bookCollapseSection: true
---
<style>
img{
  margin: auto;
  background-color: white;
}
</style>
# Mach bands
## Introducción
En este ejercicio se implementó un generador de terreno aleatorio usando el algoritmo de [Perlin Noise](https://adrianb.io/2014/08/09/perlinnoise.html). El terreno se colorea en escala de grises de acuerdo a su altitud. En el primer modo de coloreado, se implementa un gradiente para que la transición se haga de manera gradual. En el segundo modo de coloreado, se emplea un coloreado plano, mediante el cual se evidencia el [efecto de bandas mach](https://en.wikipedia.org/wiki/Mach_bands). Adicionalmente, se implementó otro snippet que permite comparar un coloreado plano con otro suavizado, usando el modelo de [reflexión de Phong](https://en.wikipedia.org/wiki/Phong_reflection_model). Esta última implementación se logró usando shaders. 

## Antecedentes
### Efecto de bandas Mach
El efecto de bandas mach se produce cuando hay un gradiente de colores donde el valor (luminosidad) cambia muy poco, lo que lleva a la percepción de un borde inexistente que es más oscuro del lado de menor valor y más claro del de mayor valor, como se puede evidenciar en la siguiente imágen.

<div align="center">
  <img src="/showcase/sketches/mach_bands/machband.jpg"> 
  <div>Imagen tomada de <a href="https://blog.kasson.com/the-last-word/mach-banding/"> este enlace </a> </div>
</div>

El efecto también es perceptible en imágenes a color.

<div align="center">
  <img src="/showcase/sketches/mach_bands/machbandr.jpg">
  <img src="/showcase/sketches/mach_bands/machbandg.jpg">
  <img src="/showcase/sketches/mach_bands/machbandb.jpg">
  <div>Imagenes tomadas de <a href="https://blog.kasson.com/the-last-word/mach-banding/"> este enlace </a> </div>
</div>


Sin embargo como se puede observar, este efecto se ve reducido en gradientes azules. Esto se debe a que la sensibilidad del ojo humano frente a los cambios de brillo y de color varía en función de la longitud de onda de la luz, y la longitud de onda del color azul se encuentra en una zona del espectro de luz en la que la sensibilidad del ojo es menor.

En una imagen con gradientes de color suaves, como un degradado de color, el ojo humano espera ver transiciones suaves entre los colores. Sin embargo, si la profundidad de color de la imagen es limitada, puede haber una falta de precisión en la representación de los tonos de color en la imagen, lo que puede hacer que las transiciones de color parezcan escalonadas o con bandas.

### Modelo de reflexión de Phong
El modelo de reflexión de Phong es una técnica para simular efectos de iluminación sobre una superficie 3d, por medio de una interpolación en el proceso de resterizado (proceso por el cual se convierte el modelo 3d en una imagen para proyectar sobre una pantalla). Este modelo tiene 3 componentes:

<div align="center">
  <img src="/showcase/sketches/mach_bands/Phong_components.png">
  <div>Imagen tomada de <a href="https://en.wikipedia.org/wiki/Phong_reflection_model#/media/File:Phong_components_version_4.png"> este enlace </a> </div>
</div>


En primer lugar se analiza como va a incidir la luz ambiente sobre el objeto. Hay ciertos modelos de iluminación global que tienen en cuenta aspectos como la reflexión de la luz sobre otras superficies diferentes a las del objeto. Sin embargo, estos suelen ser computacionalmente costosos. Una forma sencilla, pero efectiva de incluir este efecto es multiplicar el color e intensidad de la luz ambiente, por el color del objeto y colorear el modelo con el valor obtenido, obteniendo un color uniforme.

<div align="center">
  <img src="/showcase/sketches/mach_bands/ambient_light.png">
  <div>Imagen tomada de <a href="https://learnopengl.com/Lighting/Basic-Lighting"> este enlace </a> </div>
</div>

En segundo lugar se analiza la luz difusa, que es la luz que refleja la superficie del modelo en relación a la dirección de esta. De acuerdo al material de la superficie, la luz se puede difuminar sobre la superficie y ser reflejada en menor medida, lo que se puede observar en la siguiente imágen. 

<div align="center">
  <img src="/showcase/sketches/mach_bands/diffuse_light_material.png">
  <div>Imagen tomada de <a href="https://www.scratchapixel.com/lessons/3d-basic-rendering/phong-shader-BRDF/phong-illumination-models-brdf.html"> este enlace </a> </div>
</div>

El valor que se le asigna al color de un vértice, depende del producto punto entre su normal y la dirección de la luz. Un punto donde la normal es paralela a la dirección de la luz, es un punto donde la luz refleja directamente:

<div align="center">
  <img src="/showcase/sketches/mach_bands/diffuse_light_normal.png">
  <div>Imagen tomada de <a href="https://learnopengl.com/Lighting/Basic-Lighting"> este enlace </a> </div>
</div>

En tercer lugar se analiza la luz especular, que es la luz reflejada que llega al ojo del observador (cámara)

<div align="center">
  <img src="/showcase/sketches/mach_bands/specular_normal.png">
  <div>Imagen tomada de <a href="https://learnopengl.com/Lighting/Basic-Lighting"> este enlace </a> </div>
</div>

Finalmente, todos los efectos se suman y el color obtenido es asignado al vértice del modelo correspondiente. 

<div align="center">
  <img src="/showcase/sketches/mach_bands/phong_total.png">
  <div>Imagen tomada de <a href="https://inspirnathan.com/posts/57-shadertoy-tutorial-part-11/"> este enlace </a> </div>
</div>

Después de ello, mediante un frag shader, se hace una interpolación para hallar los colores de los demás pixeles de la imagen.

# Bibliografía

- de Vries , J. (2014). Basic lighting. LearnOpenGL. Retrieved March 22, 2023, from https://learnopengl.com/Lighting/Basic-Lighting 
- JimK. (2014, April 24). Mach banding - the last word. the last word - Photography meets digital computer technology. Photography wins -- most of the time. Retrieved March 22, 2023, from https://blog.kasson.com/the-last-word/mach-banding/ 
- Scratch A Pixel. (2022). The Phong Model, Introduction to the Concepts of Shader, Reflection Models and BRDF. The Phong model, introduction to the concepts of Shader, reflection models and BRDF. Retrieved March 22, 2023, from https://www.scratchapixel.com/lessons/3d-basic-rendering/phong-shader-BRDF/phong-illumination-models-brdf.html 
- Suboptimal Engineer. (2022, December 10). GLSL Shaders Tutorial | Intro to Phong Lighting [Video]. YouTube. https://www.youtube.com/watch?v=LKXAIuCaKAQ