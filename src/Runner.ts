import Scene from './Scene';

class Runner {
  private gl: WebGLRenderingContext;
  private scene: Scene;

  constructor(canvas: HTMLCanvasElement, scene: Scene) {
    this.gl = canvas.getContext('webgl')!;
    this.scene = scene;
  }

  public start() {}

  public run() {
    var then = 0;

    const render = (now: number) => {
      now *= 0.001; // convert to seconds
      const deltaTime = now - then;
      then = now;

      this.update(deltaTime);

      this.drawShadows();
      this.draw();

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  private update(deltaTime: number) {
    this.scene.update(deltaTime);
  }

  private draw() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw();
  }

  private drawShadows() {
    const depthTexture = this.gl.createTexture();
    const depthTextureSize = 1024;
    this.gl.bindTexture(this.gl.TEXTURE_2D, depthTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.DEPTH_COMPONENT,
      depthTextureSize,
      depthTextureSize,
      0,
      this.gl.DEPTH_COMPONENT,
      this.gl.UNSIGNED_SHORT,
      null
    );

    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    const depthFramebuffer = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, depthFramebuffer);
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      this.gl.DEPTH_ATTACHMENT,
      this.gl.TEXTURE_2D,
      depthTexture,
      0
    );

    // create a color texture of the same size as the depth texture
    const unusedTexture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, unusedTexture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      depthTextureSize,
      depthTextureSize,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null
    );
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

    // attach it to the framebuffer
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER, // target
      this.gl.COLOR_ATTACHMENT0, // attachment point
      this.gl.TEXTURE_2D, // texture target
      unusedTexture, // texture
      0
    ); // mip level

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, depthFramebuffer);
    this.gl.viewport(0, 0, depthTextureSize, depthTextureSize);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.drawShadows();

    // now draw scene to the canvas projecting the depth texture into the scene
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  }
}

export default Runner;
