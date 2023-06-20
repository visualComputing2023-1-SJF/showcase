# Museo

## Introducción

En este ejercicio se aplicaron los conceptos de iluminación de Phong, object picking y el manejo de espacios, para crear una pequeña sala de museo donde se exponen algunas piezas de arte del mundo de los videojuegos.

## Antecedentes

Para conocer acerca del concepto de iluminación de Phong, seguir este enlace dentro de [nuestra página](https://visualcomputing2023-1-sjf.github.io/showcase/docs/Ejercicios/IlusionesVisuales/MachBands/PhongReflection/)

Para conocer acerca del concepto de object picking, seguir este enlace dentro de [nuestra página](https://visualcomputing2023-1-sjf.github.io/showcase/docs/Ejercicios/Transformaciones/ObjectPicking/)

Un espacio es un sistema de referencia, respecto al cual se pueden especificar las coordenadas de un vector. En el caso de la computación gráfica, los espacios más importantes son los de modelo, mundo, vista y proyección. Los tres primeros son espacios tridimensionales que pueden ordenarse en un árbol de escena. 

<div align="center">
  <img src="/showcase/sketches/3D/scene_tree.jpg">
  <div>Imagen tomada de <a href="http://what-when-how.com/advanced-methods-in-computer-graphics/scene-graphs-advanced-methods-in-computer-graphics-part-2/"> este enlace </a> </div>
</div>

En la anterior imágen observamos como el mundo debe ser la raíz del árbol, mientras que los modelos se pueden agrupar y son las hojas del árbol. El espacio de vista es el espacio de coordenadas de la cámara, mientras que el espacio de proyección es el mapeo que se hace de la escena a la pantalla.

## Código

## Resultados
La animación generada con el código es la siguiente:

<div align="center">
{{< p5-iframe sketch="/showcase/sketches/3D/museo.js" lib1="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="740" height="600" >}}
</div>

## Conclusiones y trabajo futuro

## Bibliografía
