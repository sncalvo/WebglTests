import Behaviour from '../Behaviour';

class RotateBehaviour extends Behaviour {
  public speed: number = 0;

  constructor({ speed }: { speed: number }) {
    super();

    this.speed = speed;
  }

  public update(deltaTime: number) {
    this.entityTransform?.rotate({ y: this.speed * deltaTime, z: this.speed * 0.6 * deltaTime });
  }
}

export default RotateBehaviour;
