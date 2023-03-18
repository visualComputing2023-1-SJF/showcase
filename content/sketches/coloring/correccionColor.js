let img;
function preload() {
    img = loadImage('../../../../../showcase/sketches/coloring/Ishihara_03.jpg');
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

function setup() {
    createCanvas(img.width, img.height);
    corregirColor(img);
}

function draw() {
    background(220);
    image(img, 0, 0);
}
