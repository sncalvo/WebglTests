interface Material {
  setRender(data: { attributes: { [key: string]: any }; uniforms: { [key: string]: any } }): void;
}

export default Material;
