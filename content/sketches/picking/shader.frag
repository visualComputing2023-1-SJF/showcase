precision mediump float;
uniform vec3 color;

// uniforms are emitted from the sketch
// https://p5js.org/reference/#/p5.Shader/setUniform
void main() {
  gl_FragColor = vec4(color, 1.0);
}