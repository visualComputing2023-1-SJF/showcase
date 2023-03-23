let cols, rows;
let scale;
//let w =  1300;
//let h = 800;
let w =  700;
let h = 500;
let lowest = -100;
let highest = 100;
let checkBoxColoring;
let solidColoring;
let checkBoxStroke;
let showPolygonEdges;
let scaleSlider;
let scaleLabel;
let flyingVelocitySlider;
let flyingLabel;
let flying = 0;


function change_coloring() {
  // Set dark color if box is checked
  if (this.checked()) {
    solidColoring = true;
  }
  // Set light color if box is unchecked
  else {
    solidColoring = false;
  }
}

function change_stroke() {
  // Set dark color if box is checked
  if (this.checked()) {
    showPolygonEdges = true;
  }
  // Set light color if box is unchecked
  else {
    showPolygonEdges = false;
  }
}



function setup() {
  let canvas = createCanvas(800, 600, WEBGL);  
  canvas.position(5,5);  
  checkBoxColoring = createCheckbox("Solid coloring" , false);
  checkBoxColoring.position(10,60);
  checkBoxColoring.changed(change_coloring);
  checkBoxColoring.style('color', '#7CFC00');
  checkBoxStroke = createCheckbox("Show polygon edges" , false);
  checkBoxStroke.position(10,80);
  checkBoxStroke.changed(change_stroke);
  checkBoxStroke.style('color', '#7CFC00');
  scaleSlider = createSlider(10,100,20,10);
  scaleSlider.style('width' , '80px');  
  scaleSlider.style('display', 'block');  
  scaleSlider.style('position', 'relative');  
  scaleSlider.style('z-index', '4');      
  scaleLabel = createDiv('Scale');
  scaleLabel.style('color', '#7CFC00');
  scaleLabel.position(105,8);  
  scaleSlider.position = (5,5);  
  flyingVelocitySlider = createSlider(0,1,0.1,0.1);
  flyingVelocitySlider.style('width' , '80px');  
  flyingVelocitySlider.style('display', 'block');  
  flyingVelocitySlider.style('position', 'relative');  
  flyingVelocitySlider.style('z-index', '4');  
  flyingLabel = createDiv('Speed');
  flyingLabel.style('color', '#7CFC00');
  flyingLabel.position(105,30);  
   
  flyingVelocitySlider.position = (5,35);  
}



function draw() {    
  frameRate(60)
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
  
  background(0);

  // Move the origin to the top-left corner of the canvas
  rotateX(PI/3.5);
  translate(-w/2, -h/2, 0);  
  
  if(!showPolygonEdges){
    noStroke();
  }else if(showPolygonEdges){
    stroke(color(44,250,31)); 
  }

  if(solidColoring){
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
  } else if(!solidColoring){
    for (let row = 0; row < rows; row++) {
      beginShape(TRIANGLE_STRIP);      
      // stroke(color(44,250,31));    
      for (let col = 0; col <= cols; col++) {   
        strokeColor = color(map(terrainElevation[row][col], lowest , highest , 0 , 255));
        fill(strokeColor)            
        //stroke(strokeColor);
        vertex(col*scale,row*scale, terrainElevation[row][col]);
        strokeColor = color(map(terrainElevation[row+1][col], lowest , highest , 0 , 255));
        fill(strokeColor)         
        vertex(col*scale,(row+1)*scale, terrainElevation[row+1][col] );      
      }
      endShape();
    }
  }
  
  
}
