import { mat4 } from 'gl-matrix';
import Shader from './Shader';

interface Drawable {
  drawShadow(projectionMatrix: mat4, viewMatrix: mat4, shader: Shader): void;
  draw(projectionMatrix: mat4, viewMatrix: mat4, lightProjectionMatrix: mat4): void;
}

export default Drawable;
