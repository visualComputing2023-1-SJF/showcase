//Variables para cargar la imagen
let img;
let input;

function setup() {
  // crear el elemento de entrada de archivo
  input = createFileInput(cargarImagen);
  input.hide(); // ocultar el elemento de entrada de archivo

  // crear el botón
  let btn = createButton("Seleccionar imagen");
  btn.mousePressed(seleccionarImagen);
  btn.position(0, 0); // establecer la posición del botón
}

function seleccionarImagen() {
  // hacer clic en el elemento de entrada de archivo
  input.elt.click();
}

function cargarImagen(file) {
  // cargar la imagen
  if (file.type === "image") {
    img = loadImage(file.data, function() {
      // la imagen se ha cargado correctamente
      console.log("Imagen cargada");

      // establecer el tamaño del canvas
      createCanvas(img.width, img.height);
      //Aplicar la correccion de color a la imagen
      corregirColor(img);
    });
  } else {
    console.log("No se ha seleccionado una imagen");
  }
}

function corregirColor(img) {
    //Cargar datos de color por pixel en un array
    img.loadPixels();
    //Iteracion por el array 
    for (let i = 0; i < img.pixels.length; i += 4) {
        let r = img.pixels[i];
        let g = img.pixels[i + 1];
        let b = img.pixels[i + 2];
        let a = img.pixels[i + 3];

        let nuevaR = r + g * 0.1 + b * 0.1; //Aumenta el color rojo
        let nuevaG = g * 0.2; //Reduce el color verde
        let nuevaB = b + g * 0.1 + r * 0.1; //Aumenta el color azul
        //Asignar nuevos calores al arreglo
        img.pixels[i] = nuevaR;
        img.pixels[i + 1] = nuevaG;
        img.pixels[i + 2] = nuevaB;
        img.pixels[i + 3] = a;
    }
    //Actualización pixeles de la imagen con los nuevos valores
    img.updatePixels();
}

function draw() {
  // dibujar la imagen si ha sido cargada
  if (img) {
    image(img, 0, 0);
  }
}
