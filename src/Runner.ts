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
      this.draw(then);

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  private update(deltaTime: number) {
    this.scene.update(deltaTime);
  }

  private draw(totalTime: number) {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.scene.draw(totalTime);
  }
}

export default Runner;
