import Camera from './Camera';
import Entity from './Entity';
import DrawableEntity from './DrawableEntity';

import Drawable from './Drawable';

class Scene {
  private entities: Entity[] = [];
  private drawables: Drawable[] = [];
  private cameras: Camera[] = [];
  private activeCamera?: number;

  constructor() {}

  public static async createFromFile(gl: WebGLRenderingContext, file: string) {
    const scene = new Scene();

    const response = await fetch(file);
    const data = await response.json();

    const entitiesPromise: Promise<Entity>[] = [];

    for (let i = 0; i < data.cameras.length; i++) {
      const camera = data.cameras[i];
      const cameraInstance = new Camera({ ...camera, aspect: gl.canvas.width / gl.canvas.height });

      for (let j = 0; j < camera.behaviours?.length ?? 0; j++) {
        const behaviour = camera.behaviours[j];

        const entity = async () => {
          await cameraInstance.loadBehaviour(behaviour.url, behaviour.properties);
          return cameraInstance;
        };

        entitiesPromise.push(entity());
      }

      scene.addCamera(cameraInstance);
    }

    const drawablesPromise: Promise<DrawableEntity>[] = [];
    for (let i = 0; i < data.entities.length; i++) {
      const entity = data.entities[i];

      drawablesPromise.push(DrawableEntity.create(gl, entity));
    }
    const drawables = await Promise.all(drawablesPromise);

    for (let i = 0; i < drawables.length; i++) {
      scene.addEntity(drawables[i]);
      scene.addDrawable(drawables[i]);
    }

    const entities = await Promise.all(entitiesPromise);
    for (let i = 0; i < entities.length; i++) {
      scene.addEntity(entities[i]);
    }

    return scene;
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  public addDrawable(drawable: Drawable) {
    this.drawables.push(drawable);
  }

  public addCamera(camera: Camera) {
    this.cameras.push(camera);
    if (this.activeCamera === undefined) {
      this.activeCamera = 0;
    }
  }

  public setActiveCamera(index: number) {
    if (index >= this.cameras.length) {
      this.activeCamera = 0;
      return;
    }

    this.activeCamera = index;
  }

  public update(deltaTime: number) {
    for (let i = 0; i < this.entities.length; i++) {
      this.entities[i].update(deltaTime);
    }
  }

  public draw(totalTime: number) {
    if (this.activeCamera === undefined) {
      return;
    }

    const activeCamera = this.cameras[this.activeCamera];

    for (let i = 0; i < this.drawables.length; i++) {
      const drawable = this.drawables[i];

      drawable.draw(
        activeCamera.projectionMatrix,
        activeCamera.transform.asViewMatrix(),
        totalTime
      );
    }
  }
}

export default Scene;
