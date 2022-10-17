attribute vec3 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;

void main(void) {
  gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
}
