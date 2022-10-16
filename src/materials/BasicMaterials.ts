import fsSource from '../shaders/basic.fragment.glsl?raw';
import fsSource2 from '../shaders/basic2.fragment.glsl?raw';
import vsSource from '../shaders/basic.vertex.glsl?raw';
import vsSource2 from '../shaders/basic2.vertex.glsl?raw';

import Shader from '../Shader';
import Texture from '../Texture';
import Material from './Material';

class BasicMaterial implements Material {
  private texture: Texture[];
  protected shader: Shader;

  constructor(gl: WebGLRenderingContext, texture: Texture[]) {
    this.texture = texture;
    this.shader = new Shader(gl, vsSource, fsSource);
  }

  public setRender(data: { attributes: { [key: string]: any }; uniforms: { [key: string]: any } }) {
    this.shader.setAttributes(data.attributes);

    this.shader.use();

    this.shader.setUniforms(data.uniforms);
    for (let i = 0; i < this.texture.length; i++) {
      this.texture[i].bind();
    }
  }
}

class Basic2Material extends BasicMaterial implements Material {
  constructor(gl: WebGLRenderingContext, texture: Texture[]) {
    super(gl, texture);

    this.shader = new Shader(gl, vsSource2, fsSource2);
  }
}

export default BasicMaterial;
export { Basic2Material };
