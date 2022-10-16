import { mat4 } from 'gl-matrix';

import Entity from './Entity';
import Drawable from './Drawable';

import Model from './Model';
import Light from './Light';

class DrawableEntity extends Entity implements Drawable {
  constructor(private model?: Model) {
    super();
  }

  static async create(gl: WebGLRenderingContext, entity: any) {
    const promises: Promise<void>[] = [];

    const model = new Model(gl);
    model.loadModel(entity.model);

    const entityInstance = new DrawableEntity(model);

    model.transform.translate(entity.position.x, entity.position.y, entity.position.z);
    model.transform.rotate(entity.rotation);
    model.transform.scale(entity.scale.x, entity.scale.y, entity.scale.z);

    for (let j = 0; j < entity.behaviours?.length ?? 0; j++) {
      const behaviour = entity.behaviours[j];

      promises.push(entityInstance.loadBehaviour(behaviour.name, behaviour.properties));
    }

    await Promise.all(promises);

    for (let i = 0; i < entityInstance.behaviours.length; i++) {
      entityInstance.behaviours[i].transform = model.transform;
    }

    return entityInstance;
  }

  public draw(projectionMatrix: mat4, viewMatrix: mat4, light: Light, totalTime: number) {
    this.model?.draw(projectionMatrix, viewMatrix, light, totalTime);
  }
}

export default DrawableEntity;
