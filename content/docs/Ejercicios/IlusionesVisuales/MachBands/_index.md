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

![machband black and white](/showcase/sketches/mach_bands/machband.jpg)

El efecto también es perceptible en imágenes a color.

![machband red](/showcase/sketches/mach_bands/machbandr.jpg)
![machband green](/showcase/sketches/mach_bands/machbandg.jpg)
![machband blue](/showcase/sketches/mach_bands/machbandb.jpg)

Sin embargo como se puede observar, este efecto se ve reducido en gradientes azules. Esto se debe a que la sensibilidad del ojo humano frente a los cambios de brillo y de color varía en función de la longitud de onda de la luz, y la longitud de onda del color azul se encuentra en una zona del espectro de luz en la que la sensibilidad del ojo es menor.

En una imagen con gradientes de color suaves, como un degradado de color, el ojo humano espera ver transiciones suaves entre los colores. Sin embargo, si la profundidad de color de la imagen es limitada, puede haber una falta de precisión en la representación de los tonos de color en la imagen, lo que puede hacer que las transiciones de color parezcan escalonadas o con bandas.

### Modelo de reflexión de Phong
El modelo de reflexión de Phong es una técnica para simular efectos de iluminación sobre una superficie 3d, por medio de una interpolación en el proceso de resterizado (proceso por el cual se convierte el modelo 3d en una imagen para proyectar sobre una pantalla). Este modelo tiene 3 componentes:

![phong reflection](/showcase/sketches/mach_bands/Phong_components.png)

En primer lugar se analiza como va a incidir la luz ambiente sobre el objeto. Hay ciertos modelos de iluminación global que tienen en cuenta aspectos como la reflexión de la luz sobre otras superficies diferentes a las del objeto. Sin embargo, estos suelen ser computacionalmente costosos. Una forma sencilla, pero efectiva de incluir este efecto es multiplicar el color e intensidad de la luz ambiente, por el color del objeto y colorear el modelo con el valor obtenido, obteniendo un color uniforme.

![ambient light](/showcase/sketches/mach_bands/ambient_light.png)

En segundo lugar se analiza la luz difusa, que es la luz que refleja la superficie del modelo en relación a la dirección de esta. De acuerdo al material de la superficie, la luz se puede difuminar sobre la superficie y ser reflejada en menor medida, lo que se puede observar en la siguiente imágen. 

![diffuse light](/showcase/sketches/mach_bands/diffuse_light_material.png)

El valor que se le asigna al color de un vértice, depende del producto punto entre su normal y la dirección de la luz. Un punto donde la normal es paralela a la dirección de la luz, es un punto donde la luz refleja directamente:

![diffuse light normal](/showcase/sketches/mach_bands/diffuse_light_normal.png)

En tercer lugar se analiza la luz especular, que es la luz reflejada que llega al ojo del observador (cámara)

![specular light normal](/showcase/sketches/mach_bands/specular_normal.png)

# Bibliografía

