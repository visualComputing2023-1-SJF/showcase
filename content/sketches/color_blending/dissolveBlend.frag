precision mediump float;

// uniforms are emitted from the sketch
// https://p5js.org/reference/#/p5.Shader/setUniform
uniform vec4 uMaterial1;
uniform vec4 uMaterial2;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main() {
  vec2 st = gl_FragCoord.xy;
  float randomNumber =  random(st);
  vec2 rgbAverageValue = vec2((uMaterial1.r+uMaterial1.g+uMaterial1.b)/3.0, (uMaterial2.r+uMaterial2.g+uMaterial2.b)/3.0);  
  float maxRGBAverage = (rgbAverageValue[0]>=rgbAverageValue[1])?rgbAverageValue[0]:rgbAverageValue[1] ;
   bool maxIsLowerLayer = (rgbAverageValue[0]>=rgbAverageValue[1]) ? true:false ;
  gl_FragColor = (randomNumber <= maxRGBAverage) ? ((maxIsLowerLayer)?uMaterial1:uMaterial2) : ((maxIsLowerLayer)?uMaterial2:uMaterial1);
}