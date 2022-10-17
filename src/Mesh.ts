import { mat4 } from 'gl-matrix';
import { GLBuffer } from 'webgl-gltf';
import Material, { Basic2Material, CustomMaterial } from './Material';
import Shader from './Shader';
import Transform from './Transform';

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
    lightProjectionMatrix: mat4
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
        uTextureMatrix: lightProjectionMatrix,
      },
    });

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    const vertexCount = this.elementCount;
    const type = this.gl.UNSIGNED_SHORT;
    const offset = 0;
    this.gl.drawElements(this.gl.TRIANGLES, vertexCount, type, offset);
  }

  public drawShadow(
    projectionMatrix: mat4,
    viewMatrix: mat4,
    shader: Shader,
    parentTransform: Transform
  ) {
    const modelMatrix = mat4.create();
    mat4.multiply(modelMatrix, parentTransform.model, this.transform.model);

    const material = new CustomMaterial(this.gl, shader);

    material.setRender({
      attributes: {
        aVertexPosition: this.positionBuffer.buffer,
      },
      uniforms: {
        uModelMatrix: modelMatrix,
        uViewMatrix: viewMatrix,
        uProjectionMatrix: projectionMatrix,
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
    const basicMaterial = new Basic2Material(this.gl, []);
    this.material = basicMaterial;
  }
}

export default Mesh;
