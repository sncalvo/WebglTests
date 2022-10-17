precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vLighting;
varying vec4 vProjectedTexcoord;

uniform sampler2D uProjectedTexture;

void main(void) {
  vec3 projectedTexcoord = vProjectedTexcoord.xyz / vProjectedTexcoord.w;

  bool inRange =
    projectedTexcoord.x >= 0.0 &&
    projectedTexcoord.x <= 1.0 &&
    projectedTexcoord.y >= 0.0 &&
    projectedTexcoord.y <= 1.0;


  vec4 projectedTexColor = texture2D(uProjectedTexture, projectedTexcoord.xy);

  // gl_FragColor = vec4(vec3(1.0) * vLighting, 1.0);
  float projectedAmount = inRange ? 1.0 : 0.0;
  gl_FragColor = mix(vec4(vec3(1.0) * vLighting, 1.0), projectedTexColor, projectedAmount);
}
