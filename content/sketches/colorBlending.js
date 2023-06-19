//Variables para los selectores de color
let colorPicker1;
let colorPicker2;

// Selector de Shader
let sel;

//Variables para shader
let multiply;
let normal;
let screen;
let overlay;
let dissolve;

let blendingModesObject = {
  "multiply": ()=> {
  shader(multiply)
  multiply.setUniform('uMaterial1',[colorPicker1.color().levels[0]/255,colorPicker1.color().levels[1]/255,colorPicker1.color().levels[2]/255,colorPicker1.color().levels[3]/255])
  
   multiply.setUniform('uMaterial2',[colorPicker2.color().levels[0]/255,colorPicker2.color().levels[1]/255,colorPicker2.color().levels[2]/255,colorPicker2.color().levels[3]/255])  
},
  "normal" : () => {
   
 shader(normal);   normal.setUniform('uMaterial2',[colorPicker2.color().levels[0]/255,colorPicker2.color().levels[1]/255,colorPicker2.color().levels[2]/255,colorPicker2.color().levels[3]/255])  
  },
  "screen" : () => {
    shader(screen)
  screen.setUniform('uMaterial1',[colorPicker1.color().levels[0]/255,colorPicker1.color().levels[1]/255,colorPicker1.color().levels[2]/255,colorPicker1.color().levels[3]/255])
  
   screen.setUniform('uMaterial2',[colorPicker2.color().levels[0]/255,colorPicker2.color().levels[1]/255,colorPicker2.color().levels[2]/255,colorPicker2.color().levels[3]/255])  
  },
  "overlay" : () => {
    shader(overlay);
    overlay.setUniform('uMaterial1',[colorPicker1.color().levels[0]/255,colorPicker1.color().levels[1]/255,colorPicker1.color().levels[2]/255,colorPicker1.color().levels[3]/255])
  
   overlay.setUniform('uMaterial2',[colorPicker2.color().levels[0]/255,colorPicker2.color().levels[1]/255,colorPicker2.color().levels[2]/255,colorPicker2.color().levels[3]/255])  
  },
  "dissolve" : () => {
    shader(dissolve);
    dissolve.setUniform('uMaterial1',[colorPicker1.color().levels[0]/255,colorPicker1.color().levels[1]/255,colorPicker1.color().levels[2]/255,colorPicker1.color().levels[3]/255])
  
   dissolve.setUniform('uMaterial2',[colorPicker2.color().levels[0]/255,colorPicker2.color().levels[1]/255,colorPicker2.color().levels[2]/255,colorPicker2.color().levels[3]/255])  
  }   
}

function preload() {
  //Precargar el shader
  multiply = readShader('/showcase/sketches/color_blending/multiplyBlend.frag');
  normal = readShader('/showcase/sketches/color_blending/normalBlend.frag');
  screen = readShader('/showcase/sketches/color_blending/screenBlend.frag');
  overlay = readShader('/showcase/sketches/color_blending/overlayBlend.frag');
  dissolve = readShader('/showcase/sketches/color_blending/dissolveBlend.frag');
}

function setup() {
  //Crear canvas con el render de WEBGL
  createCanvas(400, 400, WEBGL);
  
  //Definir posicion y color iniciales de los selectores de color
  colorPicker1 = createColorPicker('#CC804D');
  colorPicker1.position(25, 25)
  
  colorPicker2 = createColorPicker('#E61A66')
  colorPicker2.position(200, 25);
  
  sel = createSelect();
  sel.position(10, 350);
  sel.option('Normal');
  sel.option('Multiply');
  sel.option('Overlay');
  sel.option('Screen');
  sel.option('Dissolve');
  sel.selected('Normal');    
}

function draw() {
  
  background(0)
  
  resetShader()
  
  fill(colorPicker1.color())
  rect(-170,-170,130,130)
  
  fill(colorPicker2.color())
  rect(5,-170,130,130)

  changeShader();
  
  beginShape()
    vertex(-0.4,0)
    vertex(-0.4,-0.8)
    vertex(0.4,-0.8)
    vertex(0.4,0)
  endShape()
}

function changeShader(){
  shaderName = sel.value().toLowerCase();  
  blendingModesObject[shaderName]();  
}
