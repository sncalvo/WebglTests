import Behaviour from '../Behaviour';

import InputManager from '../InputManager';

class CameraController extends Behaviour {
  public speed: number = 0;
  private lastMousePosition = { x: 0, y: 0 };

  constructor({ speed }: { speed: number }) {
    super();

    this.speed = speed;
  }

  public update(deltaTime: number) {
    const mouseMovement = {
      x: InputManager.mousePosition.x - this.lastMousePosition.x,
      y: InputManager.mousePosition.y - this.lastMousePosition.y,
    };

    this.lastMousePosition = { ...InputManager.mousePosition };

    // Rotate camera
    this.entityTransform?.rotate({
      y: mouseMovement.x * this.speed * deltaTime,
      x: mouseMovement.y * this.speed * deltaTime,
    });
  }
}

export default CameraController;
