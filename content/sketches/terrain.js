let cols, rows;
let scale = 20;
let w =  1000;
let h = 600;
let lowest = -100;
let highest = 100;

let flying = 0;

function setup() {
  createCanvas(600, 600, WEBGL);
  cols = w / scale;
  rows = h / scale;  
  
}

function draw() {    
  frameRate(30)
  let terrainElevation = [] ;
  flying -= 0.1;
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
  
  for (let row = 0; row < rows; row++) {
    beginShape(TRIANGLE_STRIP);
    noStroke();
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