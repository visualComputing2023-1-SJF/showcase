let cols, rows;
let scale = 20;
let w = 1200;
let h = 1000;

let flying = 0;

function setup() {
  createCanvas(800, 600, WEBGL);
  cols = w / scale;
  rows = h / scale;  
  
}

function draw() {  
  let terrainElevation = [] ;
  flying -= 0.1;
  let yoff = flying;
  for (let row = 0; row <= rows; row++) {    
    let terrainRow = [];
    let xoff = 0;
    for (let col = 0; col <= cols; col++) {
      terrainRow.push(map(noise(xoff,yoff),0,1,-100,100)); 
      xoff += 0.2;
    }    
    terrainElevation.push(terrainRow);
    yoff += 0.2;
  } 
  
  background(0);
  // Move the origin to the top-left corner of the canvas
  rotateX(PI/3);
  translate(-w/2, -h/2, 0);
  for (let row = 0; row < rows; row++) {
    beginShape(TRIANGLE_STRIP);
    for (let col = 0; col <= cols; col++) {
      vertex(col*scale,row*scale, terrainElevation[row][col] );
      vertex(col*scale,(row+1)*scale, terrainElevation[row+1][col]);
    }
    endShape();
  }
}