# Coloring

## Introducción

El daltonismo es una condición que afecta la capacidad de una persona para distinguir ciertos colores. Es una condición genética que afecta aproximadamente al 8% de los hombres y al 0,5% de las mujeres de ascendencia europea. La mayoría de las personas con daltonismo tienen dificultades para distinguir los colores rojo y verde, pero también puede afectar la capacidad de distinguir otros colores.

El daltonismo es causado por una falta o un mal funcionamiento de los conos en la retina del ojo, que son células sensibles a la luz que permiten que el ojo detecte los diferentes colores. 

A pesar de que el daltonismo no es una enfermedad grave, puede afectar la capacidad de las personas para realizar ciertas tareas, como identificar señales de tráfico o leer gráficos de colores en el lugar de trabajo. También puede tener un impacto emocional en las personas, especialmente en los niños que pueden sentirse diferentes o tener dificultades para aprender sobre los colores.



## Antecedentes

Hay cuatro tipos principales de daltonismo: 

- Deuteranopia: Es el tipo más común de daltonismo y afecta la capacidad para distinguir entre los colores verde y rojo. Las personas con deuteranomalía tienen una sensibilidad reducida al color verde.
- Protanopia: También afecta la capacidad para distinguir entre los colores verde y rojo, pero en este caso, la sensibilidad al color rojo está reducida.
- Tritanopia: Este tipo afecta la capacidad para distinguir entre los colores azul y amarillo.
- Acromatopsia: Es un tipo raro de daltonismo en el que una persona no puede ver ningún color en absoluto, sólo en blanco y negro.

Actualmente no existe cura para el daltonismo, pero existen tratamientos que pueden ayudar a las personas con daltonismo a mejorar su percepción del color, entre ellos estan:

1. Gafas especiales que filtran ciertas longitudes de onda de luz para mejorar la capacidad de la persona con daltonismo para percibir los colores. Sin embargo, su efectividad varía de persona a persona.

2. Entrenamiento de percepción del color, que consiste en actividades que estimulen la percepción del color y la capacidad para diferenciar los tonos, lo que ha ayudado a algunas personas con daltonismo a mejorar en su capacidad para distinguir ciertos colores después de un entrenamiento específico. 

3. Aplicaciones que ajustan los colores en la pantallas de dispositivos como teléfonos móviles, tabletas y computadoras, para que sean más fáciles de distinguir para las personas con daltonismo. 

Para ajustar el color de maner correcta, se han llevado a cabo varios estudios sobre la corrección de color en imágenes para personas con daltonismo. Estos estudios han explorado diferentes enfoques para corregir el color, incluyendo el ajuste de los canales de color en la imagen, la conversión de la imagen a una paleta de colores limitada que sea fácil de distinguir para las personas con daltonismo, y el uso de filtros especiales para mejorar la percepción del color.

Es importante destacar que estos tratamientos no son efectivos para todas las personas con daltonismo y que sus resultados pueden variar. 


## Metodologia y Código

Teniendo en cuenta lo encontrado en estudios previos sobre el daltonismo, se aplicara corrección de color a imágenes, para personas que tengan deuteranopia, dado que es tipo más común de daltonismo.

Desplegando la siguiente pestaña se encuentra el código completo de la aplicación realizada en p5.js.

{{< details "Código p5.js" close >}}
```java

//Variables para cargar la imagen
let img;
let input;

function setup() {
  // crear el elemento de entrada de archivo
  input = createFileInput(cargarImagen);
  input.hide(); // ocultar el elemento de entrada de archivo

  // crear el botón
  let btn = createButton("Seleccionar imagen");
  btn.mousePressed(seleccionarImagen);
  btn.position(0, 0); // establecer la posición del botón
}

function seleccionarImagen() {
  // hacer clic en el elemento de entrada de archivo
  input.elt.click();
}

function cargarImagen(file) {
  // cargar la imagen
  if (file.type === "image") {
    img = loadImage(file.data, function() {
      // la imagen se ha cargado correctamente
      console.log("Imagen cargada");

      // establecer el tamaño del canvas
      createCanvas(img.width, img.height);
      //Aplicar la correccion de color a la imagen
      corregirColor(img);
    });
  } else {
    console.log("No se ha seleccionado una imagen");
  }
}

function corregirColor(img) {
    //Cargar datos de color por pixel en un array
    img.loadPixels();
    //Iteracion por el array 
    for (let i = 0; i < img.pixels.length; i += 4) {
        let r = img.pixels[i];
        let g = img.pixels[i + 1];
        let b = img.pixels[i + 2];
        let a = img.pixels[i + 3];

        let nuevaR = r + g * 0.1 + b * 0.1; //Aumenta el color rojo
        let nuevaG = g * 0.2; //Reduce el color verde
        let nuevaB = b + g * 0.1 + r * 0.1; //Aumenta el color azul
        //Asignar nuevos calores al arreglo
        img.pixels[i] = nuevaR;
        img.pixels[i + 1] = nuevaG;
        img.pixels[i + 2] = nuevaB;
        img.pixels[i + 3] = a;
    }
    //Actualización pixeles de la imagen con los nuevos valores
    img.updatePixels();
}

function draw() {
  // dibujar la imagen si ha sido cargada
  if (img) {
    image(img, 0, 0);
  }
}



```
{{< /details >}}

El código funciona de la siguiente manera:

1. Se carga la imagen desde el almacenamiento local del equipo.

Primero se declaran dos variables **img** y **input**, para almacenar la imagen cargada. La función **setup()** es una función predefinida de p5.js, la cual se ejecutada una vez cuando el programa empieza. En esta función se le asigna a **input** el metodo **createFileInput()** que abre un elemento de entrada del sistema para elegir un archivo del almacenamiento local.

2. Una vez cargada la imagen se le aplica la corrección de color.

3. Se muestra la imagen usando con la corrección de color.

La función **corregirColor()** toma la imagen como argumento y aplica una técnica de corrección de color para mejorar su visibilidad para personas con deuteranopia. En este caso, se recorre cada píxel de la imagen y se ajusta su valor de rojo, verde y azul. Se aumenta el valor rojo proporcional al valor de verde y azul, igualmente se aumenta el valor azul proporcional al rojo y verde, y el verde se reduce un 80%. 
Luego, se actualiza la imagen con los nuevos valores de píxeles mediante la función **updatePixels()**.



## Resultados

Por favor, use el botón "Seleccionar imagen" para escoger una imagen almacenada en su equipo a la que le quiera aplicar la corrección de color.

<div align="center">
{{< p5-iframe sketch="/showcase/sketches/coloring/cargarImagen.js" width="600" height="600" >}}
</div>

## Conclusiones y trabajo futuro

## Bibliografía

- Birch J. Worldwide prevalence of red-green color deficiency. J Opt Soc Am A Opt Image Sci Vis. 2012;29(3):313-320. doi:10.1364/JOSAA.29.000313
- Carroll J, Neitz M, Neitz J. Estimates of L:M cone ratio from ERG flicker photometry and genetics. J Vis. 2002;2(8):531-542. doi:10.1167/2.8.5
- Neitz J, Neitz M. The genetics of normal and defective color vision. Vision Res. 2011;51(7):633-651. doi:10.1016/j.visres.2010.12.002
- J. J. Hidalgo, M. R. González, J. M. Rodríguez, and E. Martínez, "Correction of color images for color vision deficiency," IEEE Transactions on Visualization and Computer Graphics, vol. 20, no. 4, pp. 599-610, Apr. 2014. DOI: 10.1109/TVCG.2013.245.
- K. Komatsu, N. Shimizu, T. Kiyomitsu, and T. Koyama, "A filter for correcting color blindness in computer graphics," Optics Express, vol. 6, no. 5, pp. 163-168, Mar. 2000. DOI: 10.1364/OE.6.000163.



