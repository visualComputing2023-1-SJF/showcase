let img;
let input;

function setup() {
  // crear el botón
  let btn = createButton("Seleccionar imagen");
  btn.mousePressed(seleccionarImagen);

  // crear el elemento de entrada de archivo
  input = createFileInput(cargarImagen);
  input.hide(); // ocultar el elemento de entrada de archivo
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
      corregirColor(img);
    });
  } else {
    console.log("No se ha seleccionado una imagen");
  }
}

function corregirColor(img) {

    img.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        let r = img.pixels[i];
        let g = img.pixels[i + 1];
        let b = img.pixels[i + 2];
        let a = img.pixels[i + 3];

        let nuevaR = r + g * 0.2 + b * 0.2;
        let nuevaG = g * 0.6;
        let nuevaB = b + g * 0.2 + r * 0.2;

        img.pixels[i] = nuevaR;
        img.pixels[i + 1] = nuevaG;
        img.pixels[i + 2] = nuevaB;
        img.pixels[i + 3] = a;
    }
    img.updatePixels();
}

function draw() {
  // dibujar la imagen si ha sido cargada
  if (img) {
    image(img, 0, 0);
  }
}
