# PerlinNoiseTerrain
## Código
El código se divide en dos partes. La primera de ellas es la generación de terreno. El primer paso es determinar la escala que van a tener nuestros polígonos y en función de ello cálcular el número de vértices de alto y ancho que va a tener la malla polígonal, luego a cada punto se le calcula una altura aleatoria entre dos valores predefinidos, en base al algoritmo de Perrin de tal forma que el cambio de alturas sea suave.

{{< details "Código p5.js" close >}}
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

La segunda de ellas es el renderizado de la malla y la asignación de color. Para el caso del coloreado con interpolación, se empleó la figura TRIANGLE_STRIP, la cual construye una malla triangular al pasarle la sucesión de vértices,además basta con asignarle los colores a cada vértice (dados por sus alturas) para que se haga la interpolación de colores. El código correspondiente es el siguiente:

{{< details "Código p5.js" close >}}
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

Para el coloreado sólido se empleo la figura de TRIANGLES, a diferencia de triangle strip , no basta con pasarle la sucesión de vértices, sino que hay que decirle como construir cada uno de los triángulos. Esto hizo que se tuvieran que determinar dos casos: cuando la fila es par y cuando es impar

## Resultados

{{< p5-iframe sketch="/showcase/sketches/perlinTerrain.js" width="600" height="600" >}} 