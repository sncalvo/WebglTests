attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uNormalMatrix;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uViewMatrix;
uniform float uTotalTime;

uniform vec3 uLightPosition;
uniform vec3 uAmbientLightColor;
uniform vec3 uDiffuseLightColor;
uniform float uLightIntensity;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;
varying highp vec3 vHighColor;

void main(void) {
  // Produce waves by modifying the vertex position
  vec3 vertexPosition = aVertexPosition;
  float timeModifier = sin(uTotalTime) + cos(uTotalTime) * cos(uTotalTime);
  vertexPosition.y += cos(vertexPosition.x * 10.0 + timeModifier * 3.0) * 0.05;
  vertexPosition.y += cos(vertexPosition.z * 10.0 + timeModifier * 3.0) * 0.05;

  // Add different directions
  vertexPosition.y += sin(vertexPosition.x * 10.0 - timeModifier * 3.0) * 0.05;
  vertexPosition.x += sin(vertexPosition.z * 10.0 - timeModifier * timeModifier * 3.0) * 0.05;
  vertexPosition.z += cos(vertexPosition.y * 10.0 - timeModifier * 3.0) * 0.1;

  // Transform the vertex position to clip space
  gl_Position = uProjectionMatrix * uViewMatrix * uModelViewMatrix * vec4(vertexPosition, 1.0);

  vTextureCoord = aTextureCoord;

  // Apply lighting effect
  highp vec3 directionalVector = normalize(uLightPosition - (uModelViewMatrix * vec4(vertexPosition, 1.0)).xyz);
  highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
  highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

  vLighting = uAmbientLightColor + (uDiffuseLightColor * directional);

  // Apply color effect base on height from center of vertex
  float height = length(vertexPosition);
  height = height * height * height * height;
  vHighColor = vec3(cos(height), sin(height) / 3.0, 1.0 / height);
}
