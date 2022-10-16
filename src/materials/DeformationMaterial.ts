import Shader from '../Shader';
import Material from './Material';

import vertexDeformationSource from '../shaders/deformation.vertex.glsl?raw';
import fragmentDeformationSource from '../shaders/deformation.fragment.glsl?raw';

class DeformationMaterial implements Material {
  shader: Shader;

  constructor(gl: WebGLRenderingContext) {
    this.shader = new Shader(gl, vertexDeformationSource, fragmentDeformationSource);
  }

  public setRender(data: { attributes: { [key: string]: any }; uniforms: { [key: string]: any } }) {
    this.shader.setAttributes(data.attributes);

    this.shader.use();

    this.shader.setUniforms(data.uniforms);
  }
}

export default DeformationMaterial;
