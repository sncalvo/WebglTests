import vertexShadow from './shaders/shadow.vertex.glsl?raw';
import fragmentShadow from './shaders/shadow.fragment.glsl?raw';

class Shader {
  private program: WebGLProgram;
  private uniforms: {
    [key: string]: { location: WebGLUniformLocation; value: any; type: string };
  } = {};
  private attributes: {
    [key: string]: {
      location: number;
      value: any;
      type: string;
      components: number;
      elementType: number;
    };
  } = {};

  private gl: WebGLRenderingContext;

  public static createShadowShader(gl: WebGLRenderingContext) {
    const shader = new Shader(gl, vertexShadow, fragmentShadow);
    return shader;
  }

  constructor(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    this.gl = gl;
    this.program = this.initShaderProgram(vertexShaderSource, fragmentShaderSource)!;
  }

  public use() {
    this.gl.useProgram(this.program);
  }

  public setUniform(name: string, value: any) {
    if (!this.uniforms[name]) {
      return;
    }

    this.uniforms[name].value = value;

    try {
      if (this.uniforms[name].type === 'float') {
        this.gl.uniform1f(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'vec2') {
        this.gl.uniform2fv(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'vec3') {
        this.gl.uniform3fv(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'vec4') {
        this.gl.uniform4fv(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'int') {
        this.gl.uniform1i(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'ivec2') {
        this.gl.uniform2iv(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'ivec3') {
        this.gl.uniform3iv(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'ivec4') {
        this.gl.uniform4iv(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'bool') {
        this.gl.uniform1i(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'bvec2') {
        this.gl.uniform2iv(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'bvec3') {
        this.gl.uniform3iv(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'bvec4') {
        this.gl.uniform4iv(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'mat2') {
        this.gl.uniformMatrix2fv(this.uniforms[name].location, false, value);
      } else if (this.uniforms[name].type === 'mat3') {
        this.gl.uniformMatrix3fv(this.uniforms[name].location, false, value);
      } else if (this.uniforms[name].type === 'mat4') {
        this.gl.uniformMatrix4fv(this.uniforms[name].location, false, value);
      } else if (this.uniforms[name].type === 'sampler2D') {
        this.gl.uniform1i(this.uniforms[name].location, value);
      } else if (this.uniforms[name].type === 'samplerCube') {
        this.gl.uniform1i(this.uniforms[name].location, value);
      } else {
        console.error(`Unknown uniform type: ${this.uniforms[name].type}`);
      }
    } catch (e) {
      console.error(`Error setting uniform ${name} to ${value}`);
      console.error(e);
    }
  }

  public setAttribute(name: string, value: any) {
    if (!this.attributes[name]) {
      return;
    }

    this.attributes[name].value = value;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.attributes[name].value);
    this.gl.vertexAttribPointer(
      this.attributes[name].location,
      this.attributes[name].components,
      this.attributes[name].elementType,
      false,
      0,
      0
    );

    this.gl.enableVertexAttribArray(this.attributes[name].location);
  }

  public setUniforms(values: { [key: string]: any }) {
    for (const key in values) {
      this.setUniform(key, values[key]);
    }
  }

  public setAttributes(values: { [key: string]: any }) {
    for (const key in values) {
      this.setAttribute(key, values[key]);
    }
  }

  private initShaderProgram(vsSource: string, fsSource: string) {
    this.program = this.gl.createProgram()!;

    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vsSource)!;
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fsSource)!;

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.program));
      return null;
    }

    this.getLocations(vsSource);
    this.getLocations(fsSource);

    return this.program;
  }

  private loadShader(type: number, source: string) {
    const shader = this.gl.createShader(type)!;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  private getLocations(source: string) {
    const uniforms = source.match(/uniform\s+\w+\s+\w+/g);
    if (uniforms) {
      for (const uniform of uniforms) {
        const [_, type, name] = uniform.split(' ');
        this.uniforms[name] = {
          location: this.gl.getUniformLocation(this.program, name)!,
          value: null,
          type,
        };
      }
    }

    // Get locations attribute from source
    const attributes = source.match(/attribute\s+\w+\s+\w+/g);
    if (attributes) {
      for (const attribute of attributes) {
        const [_, type, name] = attribute.split(' ');
        this.attributes[name] = {
          location: this.gl.getAttribLocation(this.program, name),
          value: null,
          type,
          components: type.split('vec').length > 1 ? parseInt(type.split('vec')[1]) : 1,
          elementType: this.getTypeFromString(type),
        };
      }
    }
  }

  private getTypeFromString(shaderType: string) {
    if (shaderType.includes('i')) {
      return this.gl.INT;
    } else if (shaderType.includes('b')) {
      return this.gl.BOOL;
    } else {
      return this.gl.FLOAT;
    }
  }
}

export default Shader;
