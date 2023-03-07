let lista_pinturas_izq = []
let lista_pinturas_der = []
let lista_suelos = []

function setup() {
  createCanvas(500, 400);
  frameRate(60)
  
}

function draw() {
  //Llamar la funcion que se encarga de redibujar el escenario
  dibujarFondo()
  
  //Cada 20 Frames generar una nueva baldosa,
  if (frameCount % 20 == 1){
    lista_suelos.push(new Suelo())
  }
  
  //Cada 60 Frames generar una nueva pintura a la izquierda y a la derecha
  if (frameCount % 60 == 1){
    lista_pinturas_izq.push(new PinturaIzquierda())
    lista_pinturas_der.push(new PinturaDerecha())
  }
  
  //Dibujar los suelos y pinturas que existen
  lista_suelos.forEach(suelo => suelo.dibujar())
  lista_pinturas_izq.forEach(pintura => pintura.dibujar())
  lista_pinturas_der.forEach(pintura => pintura.dibujar())
  
  //Mover los suelos y pinturas que existen
  lista_suelos.forEach(suelo => suelo.moverse())
  lista_pinturas_izq.forEach(pintura => pintura.moverse())
  lista_pinturas_der.forEach(pintura => pintura.moverse())
  
  //Verificar si el suelo mas antiguo ya salio del canvas y eliminarlo de la lista (Esto se puede verificar si la esquina superior izquierda del suelo tiene una posicion en x menor a 100)
  if (lista_suelos[0].x1 < 100) {
    lista_suelos.shift()
  }
  
  //Verificar si la pintura mas antigua de la izquierda ya salio del canvas y eliminarla de la lista (Esto se puede ver si la esquina superior derecha de la pintura tiene una posicion en x menor que 0) (Debe haber en todo momento al menos una pintura para que sirva)
  if (lista_pinturas_izq[0].x2 < 0) {
    lista_pinturas_izq.shift()
  }
  
  //Verificar si la pintura mas antigua de la derecha ya salio del canvas y eliminarla de la lista (Esto se puede ver si la esquina superior izquierda de la pintura tiene una posicion en x mayor que 500)(Debe haber en todo momento al menos una pintura para que sirva)
  if (lista_pinturas_der[0].x1 > 500) {
    lista_pinturas_der.shift()
  }
}

function dibujarFondo(){
  
  //Fondo blanco
  background(255)
  
  //Dibujar rectangulo negro en la posicion del punto de fuga
  fill(0)
  rect(220,0,60,50)
  
  //Dibujar linea a la izquierda del camino para la perspectiva lineal
  //De punto (220,50) a (100,400)
  line(220,50,100,400)
  
  //Dibujar otra linea para la perspectiva lineal
  //De punto (280,50) a (400,400)
  line(280,50,400,400)
  
  //Dibujar pared izquierda (CALCULAR CON PRECISION)
  fill(125, 68, 25)
  quad(0,0,220,0,220,50,0,700)
  
  //Dibujar pared derecha (CALCULAR CON PRECISION)
  fill(84, 43, 22)
  quad(280,0,500,0,500,700,280,50)
}

//Clase PinturaIzquierda, representa las pinturas de la pared izquierda que se mueven acercandose
class PinturaIzquierda {
  //La pintura es un cuadrilatero que crecera a medida que se acerque a la pantalla
  constructor() {
    //Coordenadas x1,y1
    //Valor x,y en esquina superior izq
    this.x1 = 220
    this.y1 = -25
    
    //Coordenada x2,y2
    //Valor x,y en esquina superior der
    this.x2 = 245
    this.y2 = -20
    
    //Coordenada x3,y3
    //Valor x,y en esquina inferior der
    this.x3 = 245
    this.y3 = 5
    
    //Coordenada x4,y4
    //Valor x,y en esquina inferior izq
    this.x4 = 220
    this.y4 = 10
    
    //Variables para el color:
    this.red = 0
    this.green = 0
    this.blue = 0
  }
  
  //Funcion encargada de mover los puntos de la pintura y dar la sensación de acercamiento
  moverse(){
    this.x1 = this.x1-3
    this.y1 = this.y1+2
    
    this.x2 = this.x2-2
    this.y2 = this.y2+2
    
    this.x3 = this.x3-2
    this.y3 = this.y3+3
    
    this.x4 = this.x4-3
    this.y4 = this.y4+4
    
    //Valores para cambiar el color
    this.red = this.red + 2
  }
  
  //Funcion encargada de dibujar el cuadro en cada frame
  dibujar(){
 fill(this.red,this.green,this.blue)
    quad(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3,this.x4,this.y4)
  }
}


//Clase PinturaDerecha, representa las pinturas de la pared izquierda que se mueven acercandose
class PinturaDerecha {
  //La pintura es un cuadrilatero que crecera a medida que se acerque a la pantalla
  constructor() {
    //Coordenadas x1,y1
    //Valor x,y en esquina superior izq
    this.x1 = 255
    this.y1 = -20
    
    //Coordenada x2,y2
    //Valor x,y en esquina superior der
    this.x2 = 280
    this.y2 = -25
    
    //Coordenada x3,y3
    //Valor x,y en esquina inferior der
    this.x3 = 280
    this.y3 = 5
    
    //Coordenada x4,y4
    //Valor x,y en esquina inferior izq
    this.x4 = 255
    this.y4 = 10
    
    //Variables para el color:
    this.red = 0
    this.green = 0
    this.blue = 0
  }
  
  //Funcion encargada de mover los puntos de la pintura y dar la sensación de acercamiento
  moverse(){
    this.x1 = this.x1+2
    this.y1 = this.y1+2
    
    this.x2 = this.x2+3
    this.y2 = this.y2+2
    
    this.x3 = this.x3+3
    this.y3 = this.y3+4
    
    this.x4 = this.x4+2
    this.y4 = this.y4+3
    
    //Valores para cambiar el color
    this.red = this.red + 2
  }
  
  //Funcion encargada de dibujar el cuadro en cada frame
  dibujar(){
 fill(this.red,this.green,this.blue)
    quad(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3,this.x4,this.y4)
  }
}

//Clase Suelo, cada instancia sera una baldosa del suelo que se movera. Se dibujan dos cuadros en un intento de dar un efecto de escalera
class Suelo{
  
  constructor() {
    
    //Piso
    //Coordenada x1
    //Valor x en esquina superior izq piso
    this.x1 = 240
    //Coordenada x2
    //Valor x en esquina superior der piso
    this.x2 = 260
    //Coordenada x3
    //Valor x en esquina inferior der piso
    this.x3 = 270
    //Coordenada x4
    //Valor x en esquina inferior izq piso
    this.x4 = 230
    //Valor de color inicial 
    this.escalagris = 0
    
    //Escalon
    //Coordenada x1
    //Valor x en esquina superior izq piso
    this.x1Escalon = 230
    //Coordenada x2
    //Valor x en esquina superior der piso
    this.x2Escalon = 270
    //Coordenada x3
    //Valor x en esquina inferior der piso
    this.x3Escalon = 280
    //Coordenada x4
    //Valor x en esquina inferior izq piso
    this.x4Escalon = 220
    //Valor de color inicial 
    this.escalagrisEscalon = 0
  }
  
  //Hacer efecto de movimiento del suelo modificando sus coordenadas x
  moverse(){
    //Los valores de la izquierda se les disminuye 1
    this.x1 = this.x1-1
    this.x4 = this.x4-1
    this.x1Escalon = this.x1Escalon-1
    this.x4Escalon = this.x4Escalon-1
    
    //Los valores de la derecha se les aumenta 1
    this.x2 = this.x2+1
    this.x3 = this.x3+1
    this.x2Escalon = this.x2Escalon+1
    this.x3Escalon = this.x3Escalon+1
    
    //Aumentar la escala de gris para aclararse a medida que se acerca
    this.escalagris = this.escalagris + 1
    this.escalagrisEscalon = this.escalagrisEscalon +2
  }
  
  //Funcion para calcular la coordenada y dado un valor de la coordenada x de una esquina izquierda del cuadrilatero
  yizquierda(xizquierda){
  return (-35/12)*xizquierda+(2075/3)
  }

  //Funcion para calcular la coordenada y dado un valor de la coordenada x de una esquina derecha del cuadrilatero
  yderecha(xderecha){
  return (35/12)*xderecha-(2300/3)
  }
  
  //Dibujar el suelo en pantalla, un cuadrilatero
  dibujar(){
    
 fill(this.escalagris);
    quad(this.x1,this.yizquierda(this.x1),this.x2,this.yderecha(this.x2),this.x3,this.yderecha(this.x3),this.x4,this.yizquierda(this.x4))
    
    fill(this.escalagrisEscalon);
    quad(this.x1Escalon,this.yizquierda(this.x1Escalon),this.x2Escalon,this.yderecha(this.x2Escalon),this.x3Escalon,this.yderecha(this.x3Escalon),this.x4Escalon,this.yizquierda(this.x4Escalon))
  }
}
