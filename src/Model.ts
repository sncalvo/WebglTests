import { mat4 } from 'gl-matrix';
import { loadModel } from 'webgl-gltf';
import Light from './Light';
import Mesh from './Mesh';
import Transform from './Transform';

class Model {
  private gl: WebGLRenderingContext;

  private meshes: Mesh[] = [];

  public transform: Transform;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.transform = new Transform();
  }

  public draw(projectionMatrix: mat4, viewMatrix: mat4, light: Light, totalTime: number) {
    for (let i = 0; i < this.meshes.length; i++) {
      const mesh = this.meshes[i];

      mesh.draw(projectionMatrix, viewMatrix, this.transform, light, totalTime);
    }
  }

  public async loadModel(url: string) {
    const model = await loadModel(this.gl, url);

    for (let i = 0; i < model.meshes.length; i++) {
      const mesh = model.meshes[i];

      const newMesh = new Mesh(
        this.gl,
        mesh.positions,
        mesh.normals,
        mesh.texCoord,
        mesh.indices!,
        mesh.elementCount
      );

      this.meshes.push(newMesh);

      newMesh.loadMaterial(model.materials[mesh.material]);
    }
  }
}

export default Model;
