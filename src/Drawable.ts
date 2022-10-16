import { mat4 } from 'gl-matrix';
import Light from './Light';

interface Drawable {
  draw(projectionMatrix: mat4, viewMatrix: mat4, light: Light, totalTime: number): void;
}

export default Drawable;
