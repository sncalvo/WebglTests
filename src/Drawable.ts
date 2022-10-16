import { mat4 } from 'gl-matrix';

interface Drawable {
  draw(projectionMatrix: mat4, viewMatrix: mat4): void;
}

export default Drawable;
