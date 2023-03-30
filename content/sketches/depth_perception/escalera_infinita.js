//Listas para guardar instrancias de objetos
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
  
  //Cada 11 Frames generar un nuevo suelo
  if (frameCount % 11 == 1){
    lista_suelos.push(new Suelo())
  }
  
  //Cada 48 Frames generar una nueva pintura a la izquierda y a la derecha del pasillo
  if (frameCount % 48 == 1){
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
  
  //Verificar si la pintura mas antigua de la izquierda ya salio del canvas y eliminarla de la lista (Esto se puede ver si la esquina superior derecha de la pintura tiene una posicion en x menor que 0) (Debe haber en todo momento al menos una pintura para que no surja un error)
  if (lista_pinturas_izq[0].x2 < 0) {
    lista_pinturas_izq.shift()
  }
  
  //Verificar si la pintura mas antigua de la derecha ya salio del canvas y eliminarla de la lista (Esto se puede ver si la esquina superior izquierda de la pintura tiene una posicion en x mayor que 500)(Debe haber en todo momento al menos una pintura para que no surja un error)
  if (lista_pinturas_der[0].x1 > 500) {
    lista_pinturas_der.shift()
  }
}

//Funcion encargada de dibujar el fondo en cada frame, para poder realizar una animacion
function dibujarFondo(){
  
  //Fondo blanco
  background(255)
  
  //Dibujar rectangulo negro en la posicion del punto de fuga
  fill(0)
  rect(220,0,60,50)
  
  //Dibujar linea a la izquierda del camino
  //De punto (220,50) a (120,400)
  line(220,50,120,400)
  
  //Dibujar otra linea para delimitar las escaleras
  //De punto (280,50) a (380,400)
  line(280,50,380,400)
  
  //No tener linea limite para dibujar gradientes en las paredes
  noStroke()
  
  //Dibujar pared izquierda con un gradiente
  //Color de inicio al fondo de la pared
  let from = color(28, 15, 6)
  //Color más cercano del gradiente
  let to = color(125, 68, 25)
  //Variable para guardar el color intermedio
  let inter
  //Posicion esquina superior izquierda del cuadrilatero para el gradiente
  let actual_x = 217
  //Posicion esquina superior derecha del cuadrilatero para el gradiente
  let prev_x = 220
  
  //Se generan cuadrilateros de colores desde el color inicial, hasta el color final 
  for (let i = 0; i < 1; i=i+0.01){
    inter = lerpColor(from,to,i);
    fill(inter);
    quad(actual_x,0,prev_x,0,prev_x,(-3.5)*prev_x+820,actual_x,(-3.5)*actual_x+820)
    actual_x = actual_x - 2.2
    prev_x = prev_x - 2.2
  }
  
  //Dibujar pared derecha con un gradiente
  //Color de inicio al fondo
  from = color(28, 15, 6)
  //Color más cercano del gradiente
  to = color(84, 43, 22)
  //Posicion esquina superior izquierda del cuadrilatero para el gradiente
  prev_x = 280
  //Posicion esquina superior izquierda del cuadrilatero para el gradiente
  actual_x = 283
  
  //Se generan cuadrilateros de colores desde el color inicial, hasta el color final 
  for (let i = 0; i < 1; i=i+0.01){
    inter = lerpColor(from,to,i);
    fill(inter);
    quad(prev_x,0,actual_x,0,actual_x,(3.5)*actual_x-(930),prev_x,(3.5)*prev_x-(930))
    actual_x = actual_x + 2.2
    prev_x = prev_x + 2.2
  }
  
  //Modificar variable global para que se vuelvan a dibujar lineas en los bordes
  stroke(0)
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
    
    //Variables para el color del cuadro:
    this.red = 0
    this.green = 0
    this.blue = 0
  }
  
  //Funcion encargada de mover los puntos de la pintura y modificar su color para dar la sensación de acercamiento
  moverse(){
    
    //El movimiento de las pinturas sera mas rapido a medida que se acerquen mas a los bordes del lienzo
    
    this.x1 = this.x1-((250-this.x1)*0.024)
    this.y1 = this.y1+((250-this.x1)*0.016)
  
    this.x2 = this.x2-((250-this.x1)*0.016)
    this.y2 = this.y2+((250-this.x1)*0.016)
    
    this.x3 = this.x3-((250-this.x1)*0.016)
    this.y3 = this.y3+((250-this.x1)*0.024)
    
    this.x4 = this.x4-((250-this.x1)*0.024)
    this.y4 = this.y4+((250-this.x1)*0.032)
    
    //Aumentar el color rojo al moverse
    this.red = this.red + ((250-this.x1)*0.013)
  }
  
  //Funcion encargada de dibujar la pintura en cada frame
  dibujar(){
 fill(this.red,this.green,this.blue)
    quad(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3,this.x4,this.y4)
  }
}


//Clase PinturaDerecha, representa las pinturas de la pared derecha que se mueven acercandose
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
    
    //Variables para el color del cuadro:
    this.red = 0
    this.green = 0
    this.blue = 0
  }
  
  //Funcion encargada de mover los puntos de la pintura y cambiar el color del cuadro para dar la sensación de acercamiento
  moverse(){
    
    //El movimiento de las pinturas sera mas rapido a medida que se acerquen mas a los bordes del lienzo
    this.x1 = this.x1+((this.x2-250)*0.016)
    this.y1 = this.y1+((this.x2-250)*0.016)
    
    this.x2 = this.x2+((this.x2-250)*0.024)
    this.y2 = this.y2+((this.x2-250)*0.016)
    
    this.x3 = this.x3+((this.x2-250)*0.024)
    this.y3 = this.y3+((this.x2-250)*0.032)
    
    this.x4 = this.x4+((this.x2-250)*0.016)
    this.y4 = this.y4+((this.x2-250)*0.024)
    
    //Valores para cambiar el color
    this.red = this.red + ((this.x2-250)*0.013)
  }
  
  //Funcion encargada de dibujar la pintura en cada frame
  dibujar(){
 fill(this.red,this.green,this.blue)
    quad(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3,this.x4,this.y4)
  }
}

//Clase Suelo. Cada instancia de esta clase corresponde a un escalon de la escalera infinita.
class Suelo{
  
  //Se definen la posicion inicial y colores del piso (Parte plana del escalon) y el escalon (Parte vertical del escalon) que conforman una instancia del suelo.
  constructor() {
    
    //Piso
    //Coordenada x1
    //Valor x en esquina superior izq piso
    this.x1 = 235
    //Coordenada x2
    //Valor x en esquina superior der piso
    this.x2 = 265
    //Coordenada x3
    //Valor x en esquina inferior der piso
    this.x3 = 265
    //Coordenada x4
    //Valor x en esquina inferior izq piso
    this.x4 = 235
    //Valor de color inicial 
    this.escalagris = 0
    
    //Escalon
    //Coordenada x1
    //Valor x en esquina superior izq piso
    this.x1Escalon = 235
    //Coordenada x2
    //Valor x en esquina superior der piso
    this.x2Escalon = 265
    //Coordenada x3
    //Valor x en esquina inferior der piso
    this.x3Escalon = 270
    //Coordenada x4
    //Valor x en esquina inferior izq piso
    this.x4Escalon = 230
    //Valor de color inicial 
    this.escalagrisEscalon = 0
  }
  
  //Funcion encargada de mover las coordenadas del suelo para dar la sensación de movimiento. Entre mas cerca esta el suelo o escalon al usuario mas rapido se cambia su posición.
  moverse(){
    
    
    //Modificacion de coordenadas de los puntos a la derecha de los escalones
    this.x2 = this.x2+((250 - this.x1)*0.0141)
    this.x3 = this.x3+((250 - this.x1)*0.017)
    this.x2Escalon = this.x2Escalon+((250 - this.x1)*0.017)
    this.x3Escalon = this.x3Escalon+((250 - this.x1)*0.016)
    
        //Modificacion de coordenadas de los puntos a la izquierada de los escalones
    this.x1Escalon = this.x1Escalon-((250 - this.x1)*0.017)
    this.x4Escalon = this.x4Escalon-((250 - this.x1)*0.016)
    this.x4 = this.x4-((250 - this.x1)*0.017)
    this.x1 = this.x1-((250 - this.x1)*0.0141)

    
    //Se aumenta el valor en escala de grises del escalon para que sea mas claro al acercarse a la persona
    this.escalagris = this.escalagris + ((250 - this.x1)*0.01)
    this.escalagrisEscalon = this.escalagrisEscalon +((250 - this.x1)*0.026)
  }
  
  //La funcion yizquierda sirve para calcular el valor en el eje Y que debe tener un punto a partir de su valor en el eje X, de manera que el suelo siempre se genere siguiendo una linea recta que conecta con la pared izquierda.
  yizquierda(xizquierda){
  return (-35/12)*xizquierda+(2075/3)
  }

  //La funcion yderecha sirve para calcular el valor en el eje Y que debe tener un punto a partir de su valor en el eje X, de manera que el suelo siempre se genere siguiendo una linea recta que conecta con la pared derecha.
  yderecha(xderecha){
  return (35/12)*xderecha-(2300/3)
  }
  
  //La funcion yizquierdaEscalon sirve para calcular el valor en el eje Y que debe tener un punto a partir de su valor en el eje X, de manera que las esquinas de los escalones siempre se generen siguiendo una linea recta que conecta con la pared izquierda.
  yizquierdaEscalon(xizquierda){
  return (-3.5)*xizquierda+820
  }

  //La funcion yderechaEscalon sirve para calcular el valor en el eje Y que debe tener un punto a partir de su valor en el eje X, de manera que las esquinas de los escalones siempre se generen siguiendo una linea recta que conecta con la pared derecha.
  yderechaEscalon(xderecha){
  return (3.5)*xderecha-(930)
  }
  
  //Dibujar el suelo en pantalla, esta funcion dibuja 2 cuadrilateros, uno para la parte vertical y otro para la parte horizontal del suelo.
  dibujar(){
    
 fill(this.escalagris);
    quad(this.x1,this.yizquierdaEscalon(this.x1),this.x2,this.yderechaEscalon(this.x2),this.x3,this.yderecha(this.x3),this.x4,this.yizquierda(this.x4))
    
    fill(this.escalagrisEscalon);
    quad(this.x1Escalon,this.yizquierda(this.x1Escalon),this.x2Escalon,this.yderecha(this.x2Escalon),this.x3Escalon,this.yderechaEscalon(this.x3Escalon),this.x4Escalon,this.yizquierdaEscalon(this.x4Escalon))
  }
}