import { mat4 } from 'gl-matrix';

class Transform {
  public model: mat4;
  public normal: mat4;

  constructor() {
    this.model = mat4.create();
    this.normal = mat4.create();
  }

  public translate(x: number, y: number, z: number) {
    mat4.translate(this.model, this.model, [x, y, z]);
    this.updateNormal();
  }

  public rotate({ x, y, z }: { x?: number; y?: number; z?: number }) {
    if (x) mat4.rotate(this.model, this.model, x, [1, 0, 0]);
    if (y) mat4.rotate(this.model, this.model, y, [0, 1, 0]);
    if (z) mat4.rotate(this.model, this.model, z, [0, 0, 1]);
    this.updateNormal();
  }

  public scale(x: number, y: number, z: number) {
    mat4.scale(this.model, this.model, [x, y, z]);
    this.updateNormal();
  }

  private updateNormal() {
    mat4.invert(this.normal, this.model);
    mat4.transpose(this.normal, this.normal);
  }

  public asViewMatrix() {
    const viewMatrix = mat4.create();
    mat4.invert(viewMatrix, this.model);

    return viewMatrix;
  }
}

export default Transform;
