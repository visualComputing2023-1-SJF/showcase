/*
Vertex shader code to be coupled with fe21914a-6b60-4a29-bcd6-73801e7d5ff9 
Generated with treegl version 0.6.2
*/
precision mediump float;
attribute vec3 aPosition;
attribute vec2 aTexCoord;
varying vec2 texcoords2;
//uniform float zDepth;

void main() {
  //texcoords2 = aTexCoord;
   // copy the position data into a vec4, using 1.0 as the w component
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  
  // send the vertex information on to the fragment shader
  gl_Position = positionVec4; 
} 