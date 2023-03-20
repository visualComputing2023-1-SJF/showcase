# Depth Perception

## Introducción

En este ejercicio se buscó generar la **sensación de profundidad y movimiento en un lienzo 2D** que representa una **escalera infinita**. Para lograr el efecto deseado se utilizó un punto de fuga y se modificaron distintos atributos (tamaño, color y velocidad) de los objetos en la escena de acuerdo a qué tan cerca se encuentran al espectador.

## Antecedentes

A continuación se describirán las claves monoculares y cinéticas que se aplicaron en el ejercicio junto con pequeños ejemplos de sus usos. 

La primera clave monocular utilizada para hacer la ilusión de profundidad en el ejercicio fue la [perspectiva lineal](https://www.esdesignbarcelona.com/actualidad/ilustracion/perspectiva-dibujo-tecnico). En la perspectiva lineal las líneas convergen en puntos de fuga, las ubicaciones donde están los puntos de fuga se perciben como los lugares que se encuentran más lejanos en el dibujo. Un caso específico de la perspectiva lineal es cuando se tiene un solo punto de fuga y este suele usarse para dar profundidad a imágenes de caminos.

<div align="center">
<img src="/showcase/sketches/depth_perception/EscaleraPerspectivaLineal.jpg" alt="EscaleraPerspectivaLineal" style="height: 350px; width:250px;"/>

Imagen tomada de [este sitio](https://crispy-ghee.tumblr.com/post/42783061352/crispys-perspective-tips-the-basics-of-drawing/amp)
</div>

La segunda clave monocular usada es el [tamaño relativo](https://psych.hanover.edu/krantz/art/rel_size.html) de los objetos. El tamaño relativo nos permite saber si un objeto está más cerca respecto a otros, esto debido a que percibimos los objetos más cercanos con un mayor tamaño.

<div align="center">
<img src="/showcase/sketches/depth_perception/TamanoRelativo.jpg" alt="TamanoRelativo" style="height: 300px; width:400px;"/>

Imagen tomada de [este sitio](https://psych.hanover.edu/krantz/art/rel_size.html)
</div>

La tercera clave monocular es la [iluminación](https://educacionplasticayvisual.com/espacio-y-volumen/calves-de-profundidad/) la cual nos permiten ubicar los objetos en el entorno según cómo incide la luz proveniente de alguna fuente sobre ellos. Entre más cerca se encuentren a un foco de luz los objetos se ven más brillantes. En el siguiente ejemplo se puede ver cómo a partir de un foco de luz se puede dar profundidad a una obra.

<div align="center">
<img src="/showcase/sketches/depth_perception/LuzSombra.jpg" alt="LuzSombra" style="height: 300px; width:400px;"/>

Imagen tomada de [este sitio](https://educacionplasticayvisual.com/espacio-y-volumen/calves-de-profundidad/)
</div>

Por último para dar sensación de desplazamiento y profundidad en imágenes 2D tenemos el [movimiento relativo](https://wps.prenhall.com/wps/media/objects/803/822654/psychplace/depth/motion.html). El movimiento relativo hace referencia al fenómeno en el cual al movernos percibimos que los objetos más cercanos a nosotros se mueven a una velocidad mayor que los más alejados. A partir de ello podemos reconocer la distancia a la que estamos de diferentes objetos al movernos. 

En el minuto 29 del siguiente video se puede percibir este efecto en un tren, en el cual se percibe más rápido el movimiento de los postes a medida que nos acercamos a ellos.

<div align="center">
<iframe
    width="426"
    height="240"
    src="https://www.youtube.com/embed/gDPdm2Nv26g"
    frameborder="0"
    allow="autoplay; encrypted-media"
    allowfullscreen
>
</iframe>
</div>


Un antecedente importante y del cual nos basamos para este ejercicio es la “Escalera Infinita” que ocurría en Super Mario 64, que se puede observar en el siguiente video.

<div align="center">
<iframe
    width="426"
    height="240"
    src="https://www.youtube.com/embed/monPyqs9UFs"
    frameborder="0"
    allow="autoplay; encrypted-media"
    allowfullscreen
>
</iframe>
</div>

Aunque Super Mario 64 es un juego en 3D, esta escena nos permite ver cómo podría ser un camino infinito y cómo se modifica la escala e iluminación de los objetos al moverse a través de él.

## Código

Bajando la siguiente pestaña se encuentra el código completo de la aplicación realizada en p5.js.

{{< details "Código p5.js" close >}}
```java
//Listas para guardar instrancias de objetos
let lista_pinturas_izq = []
let lista_pinturas_der = []
let lista_suelos = []

function setup() {
  createCanvas(500, 400);
  frameRate(60)  
}

function draw() {
  //Llamar la funcion que se encarga de redibujar el escenario
  dibujarFondo()
  
  //Cada 11 Frames generar un nuevo suelo
  if (frameCount % 11 == 1){
    lista_suelos.push(new Suelo())
  }
  
  //Cada 48 Frames generar una nueva pintura a la izquierda y a la derecha del pasillo
  if (frameCount % 48 == 1){
    lista_pinturas_izq.push(new PinturaIzquierda())
    lista_pinturas_der.push(new PinturaDerecha())
  }
  
  //Dibujar los suelos y pinturas que existen
  lista_suelos.forEach(suelo => suelo.dibujar())
  lista_pinturas_izq.forEach(pintura => pintura.dibujar())
  lista_pinturas_der.forEach(pintura => pintura.dibujar())
  
  //Mover los suelos y pinturas que existen
  lista_suelos.forEach(suelo => suelo.moverse())
  lista_pinturas_izq.forEach(pintura => pintura.moverse())
  lista_pinturas_der.forEach(pintura => pintura.moverse())
  
  //Verificar si el suelo mas antiguo ya salio del canvas y eliminarlo de la lista (Esto se puede verificar si la esquina superior izquierda del suelo tiene una posicion en x menor a 100)
  if (lista_suelos[0].x1 < 100) {
    lista_suelos.shift()
  }
  
  //Verificar si la pintura mas antigua de la izquierda ya salio del canvas y eliminarla de la lista (Esto se puede ver si la esquina superior derecha de la pintura tiene una posicion en x menor que 0) (Debe haber en todo momento al menos una pintura para que no surja un error)
  if (lista_pinturas_izq[0].x2 < 0) {
    lista_pinturas_izq.shift()
  }
  
  //Verificar si la pintura mas antigua de la derecha ya salio del canvas y eliminarla de la lista (Esto se puede ver si la esquina superior izquierda de la pintura tiene una posicion en x mayor que 500)(Debe haber en todo momento al menos una pintura para que no surja un error)
  if (lista_pinturas_der[0].x1 > 500) {
    lista_pinturas_der.shift()
  }
}

//Funcion encargada de dibujar el fondo en cada frame, para poder realizar una animacion
function dibujarFondo(){
  
  //Fondo blanco
  background(255)
  
  //Dibujar rectangulo negro en la posicion del punto de fuga
  fill(0)
  rect(220,0,60,50)
  
  //Dibujar linea a la izquierda del camino
  //De punto (220,50) a (120,400)
  line(220,50,120,400)
  
  //Dibujar otra linea para delimitar las escaleras
  //De punto (280,50) a (380,400)
  line(280,50,380,400)
  
  //No tener linea limite para dibujar gradientes en las paredes
  noStroke()
  
  //Dibujar pared izquierda con un gradiente
  //Color de inicio al fondo
  let from = color(28, 15, 6)
  //Color de llegada
  let to = color(125, 68, 25)
  //Variable para guardar el color intermedio
  let inter
  //Posicion esquina superior izquierda del cuadrilatero para el gradiente
  let actual_x = 217
  //Posicion esquina superior derecha del cuadrilatero para el gradiente
  let prev_x = 220
  
  //Se generan cuadrilateros de colores desde el color inicial, hasta el color final 
  for (let i = 0; i < 1; i=i+0.01){
    inter = lerpColor(from,to,i);
    fill(inter);
    quad(actual_x,0,prev_x,0,prev_x,(-3.5)*prev_x+820,actual_x,(-3.5)*actual_x+820)
    actual_x = actual_x - 2.2
    prev_x = prev_x - 2.2
  }
  
  //Dibujar pared derecha con un gradiente
  //Color de inicio al fondo
  from = color(28, 15, 6)
  //Color de llegada
  to = color(84, 43, 22)
  //Posicion esquina superior izquierda del cuadrilatero para el gradiente
  prev_x = 280
  //Posicion esquina superior izquierda del cuadrilatero para el gradiente
  actual_x = 283
  
  //Se generan cuadrilateros de colores desde el color inicial, hasta el color final 
  for (let i = 0; i < 1; i=i+0.01){
    inter = lerpColor(from,to,i);
    fill(inter);
    quad(prev_x,0,actual_x,0,actual_x,(3.5)*actual_x-(930),prev_x,(3.5)*prev_x-(930))
    actual_x = actual_x + 2.2
    prev_x = prev_x + 2.2
  }
  
  //Modificar variable global para que se vuelvan a dibujar lineas en los bordes
  stroke(0)
}

//Clase PinturaIzquierda, representa las pinturas de la pared izquierda que se mueven acercandose
class PinturaIzquierda {
  
  //La pintura es un cuadrilatero que crecera a medida que se acerque a la pantalla
  
  constructor() {
    //Coordenadas x1,y1
    //Valor x,y en esquina superior izq
    this.x1 = 220
    this.y1 = -25
    
    //Coordenada x2,y2
    //Valor x,y en esquina superior der
    this.x2 = 245
    this.y2 = -20
    
    //Coordenada x3,y3
    //Valor x,y en esquina inferior der
    this.x3 = 245
    this.y3 = 5
    
    //Coordenada x4,y4
    //Valor x,y en esquina inferior izq
    this.x4 = 220
    this.y4 = 10
    
    //Variables para el color:
    this.red = 0
    this.green = 0
    this.blue = 0
  }
  
  //Funcion encargada de mover los puntos de la pintura y modificar su color para dar la sensación de acercamiento
  moverse(){
    
    //El movimiento de las pinturas sera mas rapido a medida que se acerquen mas a la persona
    //Esto para dar un efecto parallax
    
    this.x1 = this.x1-((250-this.x1)*0.024)
    this.y1 = this.y1+((250-this.x1)*0.016)
  
    this.x2 = this.x2-((250-this.x1)*0.016)
    this.y2 = this.y2+((250-this.x1)*0.016)
    
    this.x3 = this.x3-((250-this.x1)*0.016)
    this.y3 = this.y3+((250-this.x1)*0.024)
    
    this.x4 = this.x4-((250-this.x1)*0.024)
    this.y4 = this.y4+((250-this.x1)*0.032)
    
    //Aumentar el color rojo al moverse
    this.red = this.red + ((250-this.x1)*0.013)
  }
  
  //Funcion encargada de dibujar el cuadro en cada frame
  dibujar(){
 fill(this.red,this.green,this.blue)
    quad(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3,this.x4,this.y4)
  }
}


//Clase PinturaDerecha, representa las pinturas de la pared derecha que se mueven acercandose
class PinturaDerecha {
  //La pintura es un cuadrilatero que crecera a medida que se acerque a la pantalla
  
  constructor() {
    //Coordenadas x1,y1
    //Valor x,y en esquina superior izq
    this.x1 = 255
    this.y1 = -20
    
    //Coordenada x2,y2
    //Valor x,y en esquina superior der
    this.x2 = 280
    this.y2 = -25
    
    //Coordenada x3,y3
    //Valor x,y en esquina inferior der
    this.x3 = 280
    this.y3 = 5
    
    //Coordenada x4,y4
    //Valor x,y en esquina inferior izq
    this.x4 = 255
    this.y4 = 10
    
    //Variables para el color:
    this.red = 0
    this.green = 0
    this.blue = 0
  }
  
  //Funcion encargada de mover los puntos de la pintura y cambiar el color del cuadro para dar la sensación de acercamiento
  moverse(){
    
    //El movimiento de las pinturas sera mas rapido a medida que se acerquen mas a la persona
    //Esto para dar un efecto paralax
    
    this.x1 = this.x1+((this.x2-250)*0.016)
    this.y1 = this.y1+((this.x2-250)*0.016)
    
    this.x2 = this.x2+((this.x2-250)*0.024)
    this.y2 = this.y2+((this.x2-250)*0.016)
    
    this.x3 = this.x3+((this.x2-250)*0.024)
    this.y3 = this.y3+((this.x2-250)*0.032)
    
    this.x4 = this.x4+((this.x2-250)*0.016)
    this.y4 = this.y4+((this.x2-250)*0.024)
    
    //Valores para cambiar el color
    this.red = this.red + ((this.x2-250)*0.013)
  }
  
  //Funcion encargada de dibujar el cuadro en cada frame
  dibujar(){
 fill(this.red,this.green,this.blue)
    quad(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3,this.x4,this.y4)
  }
}

//Clase Suelo. Cada instancia de esta clase corresponde a un escalon de la escalera infinita.
class Suelo{
  
  //Se definen la posicion inicial y colores del piso (Parte plana del escalon) y el escalon (Parte vertical del escalon) que conforman una instancia del suelo.
  constructor() {
    
    //Piso
    //Coordenada x1
    //Valor x en esquina superior izq piso
    this.x1 = 235
    //Coordenada x2
    //Valor x en esquina superior der piso
    this.x2 = 265
    //Coordenada x3
    //Valor x en esquina inferior der piso
    this.x3 = 265
    //Coordenada x4
    //Valor x en esquina inferior izq piso
    this.x4 = 235
    //Valor de color inicial 
    this.escalagris = 0
    
    //Escalon
    //Coordenada x1
    //Valor x en esquina superior izq piso
    this.x1Escalon = 235
    //Coordenada x2
    //Valor x en esquina superior der piso
    this.x2Escalon = 265
    //Coordenada x3
    //Valor x en esquina inferior der piso
    this.x3Escalon = 270
    //Coordenada x4
    //Valor x en esquina inferior izq piso
    this.x4Escalon = 230
    //Valor de color inicial 
    this.escalagrisEscalon = 0
  }
  
  //Funcion encargada de mover las coordenadas del suelo para dar la sensación de movimiento. Entre mas cerca esta el suelo al usuario mas rapido se cambia la posición para dar un efecto parallax.
  moverse(){
    
    
    //Modificacion de coordenadas de los puntos a la derecha de los escalones
    this.x2 = this.x2+((250 - this.x1)*0.0141)
    this.x3 = this.x3+((250 - this.x1)*0.017)
    this.x2Escalon = this.x2Escalon+((250 - this.x1)*0.017)
    this.x3Escalon = this.x3Escalon+((250 - this.x1)*0.016)
    
        //Modificacion de coordenadas de los puntos a la izquierada de los escalones
    this.x1Escalon = this.x1Escalon-((250 - this.x1)*0.017)
    this.x4Escalon = this.x4Escalon-((250 - this.x1)*0.016)
    this.x4 = this.x4-((250 - this.x1)*0.017)
    this.x1 = this.x1-((250 - this.x1)*0.0141)

    
    //Se aumenta el valor en escala de grises del escalon para que sea mas claro al acercarse a la persona
    this.escalagris = this.escalagris + ((250 - this.x1)*0.01)
    this.escalagrisEscalon = this.escalagrisEscalon +((250 - this.x1)*0.026)
  }
  
  //La funcion yizquierda sirve para calcular el valor en el eje Y que debe tener un punto a partir de su valor en el eje X, de manera que el suelo siempre se genere siguiendo una linea recta que conecta con la pared izquierda.
  yizquierda(xizquierda){
  return (-35/12)*xizquierda+(2075/3)
  }

  //La funcion yderecha sirve para calcular el valor en el eje Y que debe tener un punto a partir de su valor en el eje X, de manera que el suelo siempre se genere siguiendo una linea recta que conecta con la pared derecha.
  yderecha(xderecha){
  return (35/12)*xderecha-(2300/3)
  }
  
  //La funcion yizquierdaEscalon sirve para calcular el valor en el eje Y que debe tener un punto a partir de su valor en el eje X, de manera que las esquinas de los escalones siempre se generen siguiendo una linea recta que conecta con la pared izquierda.
  yizquierdaEscalon(xizquierda){
  return (-3.5)*xizquierda+820
  }

  //La funcion yderechaEscalon sirve para calcular el valor en el eje Y que debe tener un punto a partir de su valor en el eje X, de manera que las esquinas de los escalones siempre se generen siguiendo una linea recta que conecta con la pared derecha.
  yderechaEscalon(xderecha){
  return (3.5)*xderecha-(930)
  }
  
  //Dibujar el suelo en pantalla, esta funcion dibuja 2 cuadrilateros, uno para la parte vertical y otro para la parte horizontal del suelo.
  dibujar(){
    
 fill(this.escalagris);
    quad(this.x1,this.yizquierdaEscalon(this.x1),this.x2,this.yderechaEscalon(this.x2),this.x3,this.yderecha(this.x3),this.x4,this.yizquierda(this.x4))
    
    fill(this.escalagrisEscalon);
    quad(this.x1Escalon,this.yizquierda(this.x1Escalon),this.x2Escalon,this.yderecha(this.x2Escalon),this.x3Escalon,this.yderechaEscalon(this.x3Escalon),this.x4Escalon,this.yizquierdaEscalon(this.x4Escalon))
  }
}
```
{{< /details >}}

Los aspectos a resaltar del código son los siguientes:

Se tiene el método **dibujarFondo()** encargado de dibujar elementos que no cambian de posición durante la animación. En este método se dibuja un fondo blanco para generar un nuevo cuadro en la animación. También se dibujan las paredes con un gradiente el cual hace más oscura la pared a medida que se acerca más al fondo del pasillo que es representado por un cuadro negro. 

Se hicieron **3 clases** para representar los elementos que tienen movimiento en la escena, estas clases son **“PinturaIzquierda”, “PinturaDerecha” y “Suelo”**. Cada cierta cantidad de frames se genera una nueva instancia de estas clases, de esta manera se logra hacer que la animación sea infinita.

En estas clases los métodos más importantes son los **constructores**, los métodos **moverse()** y **dibujar()**.

En los **constructores** se inicializan los atributos de color y coordenadas de ubicación de las pinturas y los suelos. Cada instancia se crea de manera que su escala sea pequeña y su color sea oscuro, de manera que se dé la sensación de que surgen a partir del punto más lejano en el pasillo donde se encuentra el camino infinito. 

Los **métodos moverse()** hacen que en cada frame las instancias modifiquen sus valores de color y las coordenadas en las que se ubican en el espacio de manera que se de una sensación de movimento en la escena. En general en este método se modifican los atributos de las pinturas y los suelos para que su tamaño incremente y sus colores sean más claros al acercarse a los bordes del lienzo.

Los **métodos dibujar()** hacen que cada instancia de las pinturas y los suelos en la escena se dibujen en el lienzo de acuerdo a los atributos que poseen individualmente en cada frame. 

Finalmente, cabe resaltar que las instancias de pinturas y suelos que se visualizan en la animación se encuentran en listas que se recorren para llamar los métodos moverse() y dibujar() de cada objeto en los frames de la animación.

## Resultados
La animación generada con el código es la siguiente:

<div align="center">
{{< p5-iframe sketch="/showcase/sketches/depth_perception/escalera_infinita.js" width="524" height="424" >}}
</div>

Se utilizó la **perspectiva lineal** con un punto de fuga que se encuentra al final del pasillo en donde convergen las líneas paralelas de los costados de las escaleras para dar una sensación de profundidad a la animación.

Por otra parte se usó el **tamaño relativo** de los objetos para dar una sensación de profundidad. Por ejemplo, los cuadros rojos (Pinturas) y el suelo se vuelven más grandes a medida que se acercan al final del lienzo.

También cabe resaltar que para dar una sensación de profundidad se intentó simular **iluminación** en la escena haciendo que los objetos más lejanos al espectador sean más oscuros. Por ejemplo las pinturas cuando estan cerca al punto de fuga tienen un color cercano al negro, pero a medida que se acercan adquieren un color rojo.

Finalmente, para dar una sensación de movimiento en la obra se aplica el **movimiento relativo** al hacer que los objetos que se encuentran más cercanos se muevan de manera más rápida respecto a los que se encuentran en el fondo, buscando dar al usuario la sensación de que está recorriendo dicha escalera.

## Conclusiones y trabajo futuro

Este ejercicio permitió observar que a partir de la **perspectiva lineal**, el **tamaño relativo**, **iluminación** y el **movimiento relativo** se puede dar un efecto 3D a un cuadro en 2D. Aprovechando tanto las pistas de profundidad como de movimiento se logró generar el efecto de la escalera infinita en una animación 2D que logra aproximarse al escenario 3D visto en Super Mario 64.

Viendo que es posible imitar una escena de un juego 3D por medio de las pistas de profundidad y movimiento como trabajo futuro sería interesante imitar otras escenas famosas de videojuegos por medio de un cuadro 2D.

Respecto al caso específico de este ejercicio podría ser interesante añadir movimiento a voluntad del usuario, si el usuario se mueve hacia adelante con una flecha del teclado entonces se da el efecto de avanzar. Si el usuario oprime la flecha hacia abajo entonces dar la sensación al usuario de moverse hacia atrás, esto daría a la escena 2D una sensación más viva e inmersiva.

## Bibliografia

- Puell, M. Percepción de la profundidad. Universidad Complutense Madrid. https://eprints.ucm.es/id/eprint/59143/1/Tema%2014.%20Percepci%C3%B3n%20de%20profundidad.pdf

- Pérez, A. (2022, Enero 13). Algunos tipos de perspectiva en dibujo técnico que te sorprenderán. ESDESIGN. https://www.esdesignbarcelona.com/actualidad/ilustracion/perspectiva-dibujo-tecnico

- EPVA Educación Plástica y Visual. Calves de Profundidad . https://educacionplasticayvisual.com/espacio-y-volumen/calves-de-profundidad/

- Relative Size. https://psych.hanover.edu/krantz/art/rel_size.html

- Fundación Universitaria Área Andina. Claves Monoculares. https://www.opticaprever.com/claves.html

- Pearson Education. Depth in Motion. https://wps.prenhall.com/wps/media/objects/803/822654/psychplace/depth/motion.html

- crispy-ghee. Crispy’s Perspective Tips: The basics of Drawing. https://crispy-ghee.tumblr.com/post/42783061352/crispys-perspective-tips-the-basics-of-drawing/amp

- Rail Relaxation. (2023, Marzo 11). Cab ride Bari Centrale - Taranto (Italy) train driver’s view in 4K [Video]. YouTube. https://www.youtube.com/watch?v=gDPdm2Nv26g

- Bryan Guilger. (2018, Enero 21). 1 HORA de Escadas Infinitas - Super Mario 64 [Video]. YouTube. https://www.youtube.com/watch?v=monPyqs9UFs