class InputManager {
  public isMouseDown = false;
  public mousePosition = { x: 0, y: 0 };

  constructor() {
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onMouseDown(_event: MouseEvent) {
    this.isMouseDown = true;
  }

  private onMouseUp(_event: MouseEvent) {
    this.isMouseDown = false;
  }

  private onMouseMove(event: MouseEvent) {
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }
}

// Export singleton
export default new InputManager();
