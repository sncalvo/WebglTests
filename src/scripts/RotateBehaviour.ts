import Behaviour from '../Behaviour';
import InputManager from '../InputManager';

class RotateBehaviour extends Behaviour {
  public speed: number = 0;
  private lastMousePosition = { x: 0, y: 0 };
  private acceleration = { x: 0, y: 0 };
  private currentSpeed = { x: 0, y: 0 };
  private friction: number = 0;

  constructor({ speed, friction }: { speed: number; friction: number }) {
    super();

    this.speed = speed;
    this.friction = friction;
  }

  public update(deltaTime: number) {
    const mouseDelta = {
      x: InputManager.mousePosition.x - this.lastMousePosition.x,
      y: InputManager.mousePosition.y - this.lastMousePosition.y,
    };

    this.acceleration = this.calculateAcceleration(
      this.calculateVelocity(mouseDelta, deltaTime),
      deltaTime
    );

    this.currentSpeed.x += this.acceleration.x * deltaTime;
    this.currentSpeed.y += this.acceleration.y * deltaTime;

    if (this.currentSpeed.x > 0) {
      this.currentSpeed.x -= this.friction * deltaTime;
    } else if (this.currentSpeed.x < 0) {
      this.currentSpeed.x += this.friction * deltaTime;
    }

    if (this.currentSpeed.y > 0) {
      this.currentSpeed.y -= this.friction * deltaTime;
    } else if (this.currentSpeed.y < 0) {
      this.currentSpeed.y += this.friction * deltaTime;
    }

    const rotation = {
      x: this.currentSpeed.x * deltaTime,
      y: this.currentSpeed.y * deltaTime,
    };

    console.log(this.currentSpeed);

    this.lastMousePosition.x = InputManager.mousePosition.x;
    this.lastMousePosition.y = InputManager.mousePosition.y;

    this.entityTransform?.rotate(rotation);
  }

  private calculateVelocity(mouseDelta: { x: number; y: number }, deltaTime: number) {
    return {
      x: (mouseDelta.x * this.speed) / deltaTime,
      y: (mouseDelta.y * this.speed) / deltaTime,
    };
  }

  private calculateAcceleration(velocity: { x: number; y: number }, deltaTime: number) {
    return { x: velocity.x / deltaTime, y: velocity.y / deltaTime };
  }
}

export default RotateBehaviour;
