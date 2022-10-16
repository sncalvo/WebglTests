attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform float uTotalTime;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying highp vec3 vHighColor;

void main(void) {
  // Produce waves by modifying the vertex position
  vec3 vertexPosition = aVertexPosition;
  vertexPosition.y += sin(vertexPosition.x * 10.0 + uTotalTime * 3.0) * 0.1;
  vertexPosition.y += sin(vertexPosition.z * 10.0 + uTotalTime * 3.0) * 0.1;

  // Transform the vertex position to clip space
  gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * vec4(vertexPosition, 1.0);

  vTextureCoord = aTextureCoord;

  // Apply lighting effect
  highp vec3 ambientLight = vec3(0.1, 0.1, 0.1);
  highp vec3 directionalLightColor = vec3(1, 1, 1);
  highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));
  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

  vLighting = ambientLight + (directionalLightColor * directional);

  // Apply color effect base on height from center of vertex
  float height = length(vertexPosition);
  vHighColor = vec3(height * height, 0.0, 1.0 / height);
}
