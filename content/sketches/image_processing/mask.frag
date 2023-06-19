precision mediump float;

// las variables uniform son definidas y enviadas por el sketch
uniform bool applyMask;
uniform sampler2D texture;
uniform vec2 texOffset;

// Almacena el kernel de 5x5
uniform float mask[25];

// Coordenadas interpoladas (mismo tipo y nombre como esta en el vertex shader)
varying vec2 texcoords2;

void main() {
  // 1. Usar el offset para moverse a lo largo del espacio de la textura.
  // En este caso se usan para encontrar las coordenadas de textura de los texeles vecinos.
  vec2 tc0 = texcoords2 + vec2(-2.0 * texOffset.s, -2.0 * texOffset.t);
  vec2 tc1 = texcoords2 + vec2(-texOffset.s, -2.0 * texOffset.t);
  vec2 tc2 = texcoords2 + vec2(0.0, -2.0 * texOffset.t);
  vec2 tc3 = texcoords2 + vec2(+texOffset.s, -2.0 * texOffset.t);
  vec2 tc4 = texcoords2 + vec2(2.0 * texOffset.s, -2.0 * texOffset.t);
  vec2 tc5 = texcoords2 + vec2(-2.0 * texOffset.s, -texOffset.t);
  vec2 tc6 = texcoords2 + vec2(-texOffset.s, -texOffset.t);
  vec2 tc7 = texcoords2 + vec2(0.0, -texOffset.t);
  vec2 tc8 = texcoords2 + vec2(+texOffset.s, -texOffset.t);
  vec2 tc9 = texcoords2 + vec2(2.0 * texOffset.s, -texOffset.t);
  vec2 tc10 = texcoords2 + vec2(-2.0 * texOffset.s, 0.0);
  vec2 tc11 = texcoords2 + vec2(-texOffset.s, 0.0);
  
  // Origen (Coordenadas de textura del fragmento actual)
  vec2 tc12 = texcoords2 + vec2(0.0, 0.0);
  
  vec2 tc13 = texcoords2 + vec2(+texOffset.s, 0.0);
  vec2 tc14 = texcoords2 + vec2(2.0 * texOffset.s, 0.0);
  vec2 tc15 = texcoords2 + vec2(-2.0 * texOffset.s, +texOffset.t);
  vec2 tc16 = texcoords2 + vec2(-texOffset.s, +texOffset.t);
  vec2 tc17 = texcoords2 + vec2(0.0, +texOffset.t);
  vec2 tc18 = texcoords2 + vec2(+texOffset.s, +texOffset.t);
  vec2 tc19 = texcoords2 + vec2(2.0 * texOffset.s, +texOffset.t);
  vec2 tc20 = texcoords2 + vec2(-2.0 * texOffset.s, 2.0 * texOffset.t);
  vec2 tc21 = texcoords2 + vec2(-texOffset.s, 2.0 * texOffset.t);
  vec2 tc22 = texcoords2 + vec2(0.0, 2.0 * texOffset.t);
  vec2 tc23 = texcoords2 + vec2(+texOffset.s, 2.0 * texOffset.t);
  vec2 tc24 = texcoords2 + vec2(2.0 * texOffset.s, 2.0 * texOffset.t);

  // 2. Muestrear los texeles vecinos y almacenar los datos dentro del arreglo rgba
  vec4 rgba[25];
  rgba[0] = texture2D(texture, tc0);
  rgba[1] = texture2D(texture, tc1);
  rgba[2] = texture2D(texture, tc2);
  rgba[3] = texture2D(texture, tc3);
  rgba[4] = texture2D(texture, tc4);
  rgba[5] = texture2D(texture, tc5);
  rgba[6] = texture2D(texture, tc6);
  rgba[7] = texture2D(texture, tc7);
  rgba[8] = texture2D(texture, tc8);
  rgba[9] = texture2D(texture, tc9);
  rgba[10] = texture2D(texture, tc10);
  rgba[11] = texture2D(texture, tc11);
  rgba[12] = texture2D(texture, tc12);
  rgba[13] = texture2D(texture, tc13);
  rgba[14] = texture2D(texture, tc14);
  rgba[15] = texture2D(texture, tc15);
  rgba[16] = texture2D(texture, tc16);
  rgba[17] = texture2D(texture, tc17);
  rgba[18] = texture2D(texture, tc18);
  rgba[19] = texture2D(texture, tc19);
  rgba[20] = texture2D(texture, tc20);
  rgba[21] = texture2D(texture, tc21);
  rgba[22] = texture2D(texture, tc22);
  rgba[23] = texture2D(texture, tc23);
  rgba[24] = texture2D(texture, tc24);
  
  // 3. Aplicar el kernel de convolución
  vec4 convolution;
  for (int i = 0; i < 24; i++) {
    convolution += rgba[i]*mask[i];
  }

  // Calcular el color original del pixel para mostrarlo en caso de que el usuario no quiera aplicar la mascara
  vec4 texel = texture2D(texture, texcoords2);

  // 4. Colocar el color obtenido por la convolución
  gl_FragColor = applyMask ? vec4(convolution.rgb, 1.0) : texel; 
}