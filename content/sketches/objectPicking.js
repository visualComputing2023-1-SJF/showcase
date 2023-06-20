let coloringShader;
let shaderTexture;
let figures = [];
let figureTypes = ["cylinder", "sphere" , "box"]
let rotations = [0.01,0.0,-0.01]
let checkbox;
let bullseye;
let scaleSlider;
let minSquareWidth = 0;

function preload() {
  coloringShader = loadShader('/showcase/sketches/picking/shader.vert', '/showcase/sketches/picking/shader.frag');
}

function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  checkbox = createCheckbox('Activate bullseyes', false);
  checkbox.position(10,10);
  checkbox.style('color', '#7CFC00');  
  scaleSlider = createSlider(0.5,5,1,0.5);
  scaleSlider.position(10,50);
  scaleSlider.style('width' , '80px');  
  
  shaderTexture = createGraphics(700, 500, WEBGL); 
  shaderTexture.shader(coloringShader);  
  texture(shaderTexture);  
  randomizeFigures(8); 
}

function draw() {    
  clear();
  
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);  
  background(205, 105, 94);
  
  showBE = checkbox.checked();
  pickingSize = scaleSlider.value();
  //console.log(bullseye)
  
  drawFigures(showBE, pickingSize);   
}


function drawFigures(showBE,pickingSize){
  // Draw Figures
  figures.forEach((figure) => {           
       
    push();
    translate(-1*figure.position.x,-1*figure.position.y,-1*figure.position.z); 
    
    checkPickingAndColor(figure,pickingSize);
    
    if (figure.type==="cylinder"){           
      cylinder(figure.radius,figure.height);      
      
    } else if (figure.type==="sphere"){           
      sphere(figure.radius);      
      
    } else if (figure.type==="box"){      
      box(figure.width, figure.height, figure.depth);     
      
    }        
    
    translate(figure.position.x,figure.position.y,figure.position.z);    
    ShowBullsEye(figure,showBE,pickingSize);
    pop();   
  })  
}

function randomizeFigures(numberOfFigures){
  // randomize figures
  for(let i=0; i<numberOfFigures; i++){
    let figure = {};
    let type = random(figureTypes);
    figure.type = type;
    if (type==="cylinder"){      
      figure.height = random(10,200);
      figure.radius = random(10,50);
    } else if (type==="sphere"){
      figure.radius = random(10,20);
    } else if (type === "box"){
      figure.height = random(10,100);
      figure.width = random(10,100);
      figure.depth = random(10,100);
    }
    
    figure.position = {"x":random(-width/4,width/4),"y":random(-height/4,height/4),"z":random(-width/4,width/4)}
    figure.color = [random(0,1),random(0,1),random(0,1)]
    
    figures.push(figure);         
  }  
}


function checkPickingAndColor(figure , pickingSize){
  let picked = false;    
  if (figure.type === "cylinder" || figure.type === "sphere"){
    picked = mousePicking({
                     size: figure.radius * pickingSize,                     
                     shape: Tree.CIRCLE
                   });  
    
  } else if (figure.type === "box"){
    minSquareWidth = Math.min(...[figure.width,figure.height,figure.depth]);
    picked = mousePicking({
                     size: minSquareWidth * pickingSize,
                     shape: Tree.SQUARE
                   });  
  }  
  
  // Get figure color
  if(picked){
    coloringShader.setUniform("color",[0.0,0.0,0.0]); 
  }else{
    coloringShader.setUniform("color",figure.color);          
  }
  shaderTexture.rect(0,0,width,height);
}

function ShowBullsEye(figure,showBE, pickingSize){
  if (showBE){    
      push();      
        strokeWeight(10);
        stroke('yellow');
        bullsEye(
            {
              size: (figure.type === "cylinder" || figure.type === "sphere")? figure.radius * pickingSize: minSquareWidth * pickingSize ,
              shape: (figure.type === "cylinder" || figure.type === "sphere")? Tree.CIRCLE: Tree.SQUARE
            });
      pop();
  }
}

