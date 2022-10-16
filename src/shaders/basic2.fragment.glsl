varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

void main(void) {
  gl_FragColor = vec4(vec3(1.0) * vLighting, 1.0);
}
