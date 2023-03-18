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
    });
  } else {
    console.log("No se ha seleccionado una imagen");
  }
}

function draw() {
  // dibujar la imagen si ha sido cargada
  if (img) {
    image(img, 0, 0);
  }
}
