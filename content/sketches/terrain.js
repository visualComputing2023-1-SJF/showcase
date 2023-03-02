let cols, rows;
let scale = 20;
let w = 800;
let h = 600;
let terrainElevation = [] ;

function setup() {
  createCanvas(800, 600, WEBGL);
  cols = w / scale;
  rows = h / scale;
  for (let y = 0; y <= rows; y++) {    
    for (let x = 0; x <= cols; x++) {
      terrainElevation[x,y] = random(-10,10);      
    }    
  }
}
  
}

function draw() {
  
  
  background(0);
  // Move the origin to the top-left corner of the canvas
  rotateX(PI/3)
  translate(-width/2, -height/2, 0);
  for (let y = 0; y <= rows; y++) {
    beginShape(TRIANGLE_STRIP);
    for (let x = 0; x <= cols; x++) {
      vertex(x*scale,y*scale);
      vertex(x*scale,(y+1)*scale);
    }
    endShape();
  }
}
