import { mat4 } from 'gl-matrix';
import Entity from './Entity';
import Transform from './Transform';

class Camera extends Entity {
  private fieldOfView: number;
  private aspect: number;
  private near: number;
  private far: number;

  public transform: Transform;

  public projectionMatrix: mat4;
  public viewMatrix: mat4;

  constructor({
    fieldOfView,
    aspect,
    near,
    far,
    position,
    rotation,
  }: {
    fieldOfView: number;
    aspect: number;
    near: number;
    far: number;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  }) {
    super();

    this.fieldOfView = (fieldOfView * Math.PI) / 180;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();

    this.transform = new Transform();

    this.transform.translate(position.x, position.y, position.z);
    this.transform.rotate(rotation);

    this.updateProjectionMatrix();
    this.updateViewMatrix();
  }

  public updateAspectRatio(aspect: number) {
    this.aspect = aspect;
    this.projectionMatrix = mat4.create();
    this.updateProjectionMatrix();
  }

  private updateProjectionMatrix() {
    mat4.perspective(this.projectionMatrix, this.fieldOfView, this.aspect, this.near, this.far);
  }

  private updateViewMatrix() {
    this.viewMatrix = this.transform.asViewMatrix();
  }
}

export default Camera;
