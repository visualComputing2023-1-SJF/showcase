# Depth Perception

## Introducción

En este ejercicio se busca dar la sensación de profundidad y movimiento en una imagen 2D. Para ello se utilizan tres elementos en el dibujo:

1. Se tiene un punto de fuga para dar una sensación de profundidad.

2. Se modifica la escala de algunos objetos en la escena, los objetos mas cercanos se hacen mas grandes y los más lejanos se dejan de tamaño más pequeño.

3. Los objetos a mayor distancia tienen un color mas oscuro, para dar una sensación de que los objetos mas brillantes son mas cercanos.

## Revisión de la literatura

Escribir sobre puntos de fuga.

Escribir sobre el escalamiento de objetos para profundidad.

Escribir sobre el color para dar sensación de profundidad.

## Metodologia

Para aplicar las ideas descritas en la revisión de la literatura se intentara recrear la "Escalera Infinita" que ocurria en Super Mario 64. En el siguiente video se puede ver la escena en el juego original:

<iframe
    width="530"
    height="430"
    src="https://www.youtube.com/embed/monPyqs9UFs"
    frameborder="0"
    allow="autoplay; encrypted-media"
    allowfullscreen
>
</iframe>

El juego hace que el jugador sienta que esta avanzando infinitamente por un camino. Este efecto se logra al permitir que el jugador se mueva por un pasillo y al estar cerca del final de dicho pasillo se devuelva al inicio.

La teletransportación del jugador dentro del mapa se realiza de forma que no se sienta ningun cambio y el usuario no se de cuenta que cambio de posición.

MAS EXPLICACIÓN

## Resultados
A continuación se presenta un widget de p5Js en el cual el usuario podra ejecutar el programa y percibir la ilusión de movimiento.

Este programa busca imitar la "Escalera infinita" que se logra en el juego Super Mario 64 pero en una imagen bidimensional.

¿AQUI DEBE IR EL ENLACE AL CODIGO o SE DEBE PONER DIRECTAMENTE EN LA PLANTILLA?

{{< p5-iframe sketch="/showcase/sketches/escalera_infinita.js" width="524" height="424" >}}

## Discusión

El efecto todavia le falta mejorar, mas manejo de sombras

## Conclusión


## Bibliografia

Video Super Mario 64: https://www.youtube.com/embed/monPyqs9UFs