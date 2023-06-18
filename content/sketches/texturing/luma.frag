precision mediump float;

// Las uniform son definidas y enviadas por el sketch
uniform bool lightness;
uniform sampler2D texture;
uniform bool uv; // visualizacion uv
uniform bool invertir; //invertir imagen desde shader

// Coordenadas de texturas normalizadas e interpoladas del espacio de textura
// deben tener el mismo tipo y nombre que en el vertex shader
varying vec2 texcoords2; // (definidas en [0..1] ∈ R)

// retorna el luma de un texel dado
float luma(vec4 texel) {
  // el canal alfa (texel.a) es descartado
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}


void main() {
  // texture2D(texture, texcoords2) muestrea la textura en texcoords2
  // y retorna el color del texel normalizado
  //Verificar si se quieren invertir la imagen para calcular las coordenadas 
  //de textura inversa
  vec4 texel = invertir ? texture2D(texture, vec2(1.0-texcoords2.s, 1.0-texcoords2.t)) : texture2D(texture, texcoords2);
                                                        
  gl_FragColor = uv ? (invertir ? vec4(1.0-texcoords2.st,0.0,1.0) : vec4(texcoords2.st, 0.0, 1.0)) :
                lightness ? vec4(vec3(luma(texel)), 1.0) : texel;
}