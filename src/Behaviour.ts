import Transform from './Transform';

class Behaviour {
  protected entityTransform?: Transform;

  set transform(transform: Transform | undefined) {
    this.entityTransform = transform;
  }

  public awake() {}

  public start() {}

  public update(_deltaTime: number) {}

  public destroy() {}
}

export default Behaviour;
