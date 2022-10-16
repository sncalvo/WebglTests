import Behaviour from './Behaviour';

class Entity {
  private behaviours: Behaviour[] = [];
  public addBehaviour(behaviour: Behaviour) {
    this.behaviours.push(behaviour);
  }
  public async loadBehaviour(url: string, properties: any) {
    const behaviour = await import(`./scripts/${url}.ts`);

    if (behaviour.default) {
      const behaviourInstance = new behaviour.default(properties);

      if (behaviourInstance && behaviourInstance instanceof Behaviour) {
        this.addBehaviour(behaviourInstance);
      }
    }
  }

  public awake() {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].awake();
    }
  }

  public start() {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].start();
    }
  }

  public update(deltaTime: number) {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].update(deltaTime);
    }
  }

  public destroy() {
    for (let i = 0; i < this.behaviours.length; i++) {
      this.behaviours[i].destroy();
    }
  }
}

export default Entity;
