precision mediump float;

// uniforms are emitted from the sketch
// https://p5js.org/reference/#/p5.Shader/setUniform
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;

void main() {
  float redChannel = (uMaterial1.r <= 0.5)? 2.0 * uMaterial1.r * uMaterial2.r : 1.0 - 2.0 * (1.0 - uMaterial1.r)*(1.0 - uMaterial2.r) ;
  float greenChannel = (uMaterial1.g <= 0.5)? 2.0 * uMaterial1.g * uMaterial2.g : 1.0 - 2.0 * (1.0 - uMaterial1.g)*(1.0 - uMaterial2.g) ;
  
  float blueChannel = (uMaterial1.b <= 0.5)? 2.0 * uMaterial1.b * uMaterial2.b : 1.0 - 2.0 * (1.0 - uMaterial1.b)*(1.0 - uMaterial2.b) ;
  
  gl_FragColor = vec4(redChannel,greenChannel, blueChannel, 1.0);
  
}