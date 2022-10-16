import Behaviour from '../Behaviour';

class MovmentBehaviour extends Behaviour {
  private speed: number;
  private direction = { x: 0, y: 0 };

  constructor({ speed }: { speed: number }) {
    super();
    this.speed = speed;

    document.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  public update(deltaTime: number): void {
    this.entityTransform?.translate(
      this.direction.x * this.speed * deltaTime,
      this.direction.y * this.speed * deltaTime,
      0
    );

    this.direction = { x: 0, y: 0 };
  }

  private onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowUp':
        this.direction.y = 1;
        break;
      case 'ArrowDown':
        this.direction.y = -1;
        break;
      case 'ArrowLeft':
        this.direction.x = -1;
        break;
      case 'ArrowRight':
        this.direction.x = 1;
        break;
    }
  }
}

export default MovmentBehaviour;
