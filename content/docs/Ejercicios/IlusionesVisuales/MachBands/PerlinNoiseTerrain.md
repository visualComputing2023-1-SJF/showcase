# PerlinNoiseTerrain
## Propuesta 
Para este ejemplo se genera un terreno usando el algoritmo de Perlin para generar alturas aleatorias sobre una malla poligonal. Se emplearan dos medios de coloreado uno por interpolación y otro plano, donde en este último se evidenciará el efecto de bandas Mach.
## Código
El código se divide en dos partes. La primera de ellas es la generación de terreno. El primer paso es determinar la escala que van a tener nuestros polígonos y en función de ello cálcular el número de vértices de alto y ancho que va a tener la malla polígonal, luego a cada punto se le calcula una altura aleatoria entre dos valores predefinidos, en base al algoritmo de Perlin (función noise en P5) de tal forma que el cambio de alturas sea suave. Se añade también una ilusión de movimiento usando un valor "flying" con la cual se calculan dos valores xoff y yoff que al pasarse a la función noise hacen que las alturas cambien de tal forma que parece que el terreno se estuviera desplazando hacia adelante (o que la cámara se estuviera moviendo hacia al frente).

{{< details "Generación de las alturas con perlin noise" close >}}
```java
scale = scaleSlider.value();
  cols = ceil(w / scale);
  rows = ceil(h / scale);   
  let terrainElevation = [] ;
  flying -= flyingVelocitySlider.value();
  let yoff = flying;
  for (let row = 0; row <= rows; row++) {    
    let terrainRow = [];
    let xoff = 0;
    for (let col = 0; col <= cols; col++) {
      terrainRow.push(map(noise(xoff,yoff),0,1, lowest , highest)); 
      xoff += 0.2;
    }    
    terrainElevation.push(terrainRow);
    yoff += 0.2;
  } 
```
{{< /details >}}

La segunda de ellas es el renderizado de la malla y la asignación de color. Para el caso del coloreado con interpolación, se empleó la figura TRIANGLE_STRIP, la cual construye una malla triangular al pasarle la sucesión de vértices,además basta con asignarle los colores a cada vértice (dados por sus alturas) para que se haga la interpolación de colores para todos los demás puntos del triángulo. El código correspondiente es el siguiente:

{{< details "Malla coloreado interpolado" close >}}
```java
for (let row = 0; row < rows; row++) {
  beginShape(TRIANGLE_STRIP);     
   
  for (let col = 0; col <= cols; col++) {   
    strokeColor = color(map(terrainElevation[row][col], lowest , highest , 0 , 255));
    fill(strokeColor)            
    
    vertex(col*scale,row*scale, terrainElevation[row][col]);
    strokeColor = color(map(terrainElevation[row+1][col], lowest , highest , 0 , 255));
    fill(strokeColor)         
    vertex(col*scale,(row+1)*scale, terrainElevation[row+1][col] );      
  }
  endShape();
}
```
{{< /details >}}

Para el coloreado plano se empleo la figura de TRIANGLES, a diferencia de triangle strip , no basta con pasarle la sucesión de vértices, sino que hay que decirle como construir cada uno de los triángulos. Esto hizo que se tuvieran que determinar tres casos: cuando la fila es par, cuando es impar y cuando es la fila cero. Esa construcción se puede evidenciar en la siguiente imagen.

![triangle form](/showcase/sketches/mach_bands/triangle_forms.png)

Finalmente, para calcular el color de toda la cara triangular, se tomó la altura del centro geométrico del triángulo, la cuál corresponde al promedio de las tres alturas de los vértices y se mapeo al color en escala de grises correspondiente para cada cara a medida de que se iba construyendo. El código fue el siguiente:

{{< details "Malla coloreado plano" close >}}
```java
for (let row = 0; row < rows; row++) {
  beginShape(TRIANGLES);      
  // stroke(color(44,250,31));    
  for (let col = 0; col <= cols; col++) {   
    //strokeColor = color(map(terrainElevation[row][col], lowest , highest , 0 , 255));
    //fill(strokeColor)    
    let height1,height2,height3,strokeColor;
    if(row === 0){
      height1 = terrainElevation[row][col]
      height2 = terrainElevation[row+1][col]
      height3 = terrainElevation[row][col+1]
      strokeColor = color(map((height1+height2+height3)/3, lowest , highest , 0 , 255));
      fill(strokeColor);
      vertex(col*scale,row*scale, terrainElevation[row][col]);            
      vertex(col*scale,(row+1)*scale, terrainElevation[row+1][col] );      
      vertex((col+1)*scale,(row)*scale, terrainElevation[row][col+1] );
    }
    
    else if (row % 2 === 1){
      height1 = terrainElevation[row][col]
      height2 = terrainElevation[row-1][col+1]
      height3 = terrainElevation[row][col+1]
      strokeColor = color(map((height1+height2+height3)/3, lowest , highest , 0 , 255));
      fill(strokeColor)
      vertex(col*scale,row*scale, terrainElevation[row][col]);            
      vertex((col+1)*scale,(row-1)*scale, terrainElevation[row-1][col+1] );      
      vertex((col+1)*scale,row*scale, terrainElevation[row][col+1] );
      height1 = terrainElevation[row][col]
      height2 = terrainElevation[row+1][col]
      height3 = terrainElevation[row][col+1]
      strokeColor = color(map((height1+height2+height3)/3, lowest , highest , 0 , 255));
      fill(strokeColor)
      vertex(col*scale,row*scale, terrainElevation[row][col]);            
      vertex(col*scale,(row+1)*scale, terrainElevation[row+1][col] );      
      vertex((col+1)*scale,(row)*scale, terrainElevation[row][col+1] );
    }      
    else if (row % 2 === 0){
      height1 = terrainElevation[row][col]
      height2 = terrainElevation[row+1][col]
      height3 = terrainElevation[row][col+1]
      strokeColor = color(map((height1+height2+height3)/3, lowest , highest , 0 , 255));
      fill(strokeColor)
      vertex(col*scale,row*scale, terrainElevation[row][col]);            
      vertex(col*scale,(row+1)*scale, terrainElevation[row+1][col] );      
      vertex((col+1)*scale,(row)*scale, terrainElevation[row][col+1] );
      height1 = terrainElevation[row][col]
      height2 = terrainElevation[row-1][col+1]
      height3 = terrainElevation[row][col+1]
      strokeColor = color(map((height1+height2+height3)/3, lowest , highest , 0 , 255));
      fill(strokeColor)
      vertex(col*scale,row*scale, terrainElevation[row][col]);            
      vertex((col+1)*scale,(row-1)*scale, terrainElevation[row-1][col+1] );      
      vertex((col+1)*scale,row*scale, terrainElevation[row][col+1] );
    }
    }
  endShape();
}
```
{{< /details >}}

## Resultados

{{< p5-iframe sketch="/showcase/sketches/perlinTerrain.js" width="600" height="600" >}} 

## Conclusiones y trabajo a futuro

Se observa que en la generación de terreno que usa el algoritmo de Perlin, se presentan transiciones de altura suaves, que con la adición dos variables: xoff y yoff, generan una ilusión de movimiento a pesar de que el terreno ni la cámara se están desplazando. Adicionalmente, se observa que esta transición suave se traduce a un gradiente de colores en escala de grises suave, cuando se usa el coloreado plano, lo que da origen a un efecto de bandas Mach.

Para una futura versión del programa, se podría implementar un movimiento de cámara dinámico que permita movimientos de traslación y rotación. El terreno tendría que responder de tal manera que se siga manteniendo la ilusión de desplazamiento.