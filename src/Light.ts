import { vec3 } from 'gl-matrix';

class Light {
  constructor(
    public readonly position: { x: number; y: number; z: number },
    public readonly diffuseColor: { r: number; g: number; b: number },
    public readonly ambientColor: { r: number; g: number; b: number },
    public readonly intensity: number
  ) {}

  public get uniforms() {
    let position = vec3.create();
    vec3.set(position, this.position.x, this.position.y, this.position.z);

    let diffuseColor = vec3.create();
    vec3.set(diffuseColor, this.diffuseColor.r, this.diffuseColor.g, this.diffuseColor.b);

    let ambientColor = vec3.create();
    vec3.set(ambientColor, this.ambientColor.r, this.ambientColor.g, this.ambientColor.b);

    return {
      uLightPosition: position,
      uAmbientLightColor: ambientColor,
      uDiffuseLightColor: diffuseColor,
      uLightIntensity: this.intensity,
    };
  }
}

export default Light;
