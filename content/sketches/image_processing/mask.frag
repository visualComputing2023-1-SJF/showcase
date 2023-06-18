precision mediump float;

// uniforms are defined and sent by the sketch
uniform bool applyMask;
uniform sampler2D texture;
uniform vec2 texOffset;


// holds the 3x3 kernel
uniform float mask[25];

// interpolated texcoord (same name and type as in vertex shader)
varying vec2 texcoords2;

void main() {
  // 1. Use offset to move along texture space.
  // In this case to find the texcoords of the texel neighbours.
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
  
  // origin (current fragment texcoords)
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

  // 2. Sample texel neighbours within the rgba array
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
  
  // 3. Apply convolution kernel
  vec4 convolution;
  for (int i = 0; i < 24; i++) {
    convolution += rgba[i]*mask[i];
  }
  
  vec4 texel = texture2D(texture, texcoords2);

  // 4. Set color from convolution
  gl_FragColor = applyMask ? vec4(convolution.rgb, 1.0) : texel; 
}