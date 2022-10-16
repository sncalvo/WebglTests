varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying highp vec3 vHighColor;

void main(void) {
  gl_FragColor = vec4(vHighColor * vLighting, 1.0);
}
