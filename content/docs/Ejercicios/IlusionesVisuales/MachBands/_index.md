---
bookCollapseSection: true
---
# Mach bands
## Introducción
En este ejercicio se implementó un generador de terreno aleatorio usando el algoritmo de [Perlin Noise](https://adrianb.io/2014/08/09/perlinnoise.html). El terreno se colorea en escala de grises de acuerdo a su altitud. En el primer modo de coloreado, se implementa un gradiente para que la transición se haga de manera gradual. En el segundo modo de coloreado, se emplea un coloreado sólido, mediante el cual se evidencia el [efecto de bandas mach](https://en.wikipedia.org/wiki/Mach_bands). Adicionalmente, se implementó otro snippet que permite evidenciar el efecto mach sobre un modelo 3d donde la cámara actúa también como un foco de luz,  haciendo una implementación simple del modelo de [reflexión de Phong](https://en.wikipedia.org/wiki/Phong_reflection_model).

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