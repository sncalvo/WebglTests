import { mat4 } from 'gl-matrix';
import { GLBuffer } from 'webgl-gltf';
import Material from './materials/Material';
import DeformationMaterial from './materials/DeformationMaterial';
import Transform from './Transform';
import { Basic2Material } from './materials/BasicMaterials';

class Mesh {
  private gl: WebGLRenderingContext;
  private positionBuffer: GLBuffer;
  private normalBuffer: GLBuffer | null;
  private textureCoordinatesBuffer: GLBuffer | null;
  private indexBuffer: WebGLBuffer | null;
  private elementCount: number;
  private material?: Material;
  private transform: Transform;

  constructor(
    gl: WebGLRenderingContext,
    positionBuffer: GLBuffer,
    normalBuffer: GLBuffer | null,
    textureCoordinatesBuffer: GLBuffer | null,
    indexBuffer: WebGLBuffer,
    elementCount: number
  ) {
    this.gl = gl;

    this.positionBuffer = positionBuffer;
    this.normalBuffer = normalBuffer;
    this.textureCoordinatesBuffer = textureCoordinatesBuffer;
    this.indexBuffer = indexBuffer;
    this.elementCount = elementCount;

    this.transform = new Transform();
  }

  public draw(
    projectionMatrix: mat4,
    viewMatrix: mat4,
    parentTransform: Transform,
    totalTime: number
  ) {
    const modelMatrix = mat4.create();
    mat4.multiply(modelMatrix, parentTransform.model, this.transform.model);
    const normalMatrix = mat4.create();
    mat4.multiply(normalMatrix, this.transform.normal, parentTransform.normal);

    this.material?.setRender({
      attributes: {
        aVertexPosition: this.positionBuffer.buffer,
        aVertexNormal: this.normalBuffer?.buffer,
        aTextureCoord: this.textureCoordinatesBuffer?.buffer,
      },
      uniforms: {
        uProjectionMatrix: projectionMatrix,
        uModelViewMatrix: modelMatrix,
        uNormalMatrix: normalMatrix,
        uViewMatrix: viewMatrix,
        uTotalTime: totalTime,
      },
    });

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    const vertexCount = this.elementCount;
    const type = this.gl.UNSIGNED_SHORT;
    const offset = 0;
    this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
  }

  public loadMaterial(_material: any) {
    // TODO: Load material attributes from material
    // const material = new Basic2Material(this.gl, []);
    const material = new DeformationMaterial(this.gl);
    this.material = material;
  }
}

export default Mesh;
