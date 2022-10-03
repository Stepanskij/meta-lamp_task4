class HandlerDragAndDrop {
  firstPosition: number = 0;

  constructor(public DOMHandleButton: HTMLButtonElement) {
    this.DOMHandleButton = DOMHandleButton;
  }

  addEvent = (): void => {
    this.DOMHandleButton.addEventListener("mousedown", this._handleMouseDown);
  };
  removeEvent = (): void => {
    this.DOMHandleButton.removeEventListener(
      "mousedown",
      this._handleMouseDown
    );
  };

  private _handleMouseDown = (eventDown: MouseEvent): void => {
    this.firstPosition = eventDown.pageX;

    document.addEventListener("mousemove", this._handleMouseMove);
    document.addEventListener("mouseup", this._handleMouseUp);
  };
  private _handleMouseMove = (eventMove: MouseEvent): void => {
    const leftShift = eventMove.pageX - this.firstPosition;
    this._renderSlider(leftShift);
  };
  private _handleMouseUp = (): void => {
    document.removeEventListener("mousemove", this._handleMouseMove);
    document.removeEventListener("mouseup", this._handleMouseUp);
  };

  private _renderSlider = (leftShift: number): void => {
    this.DOMHandleButton.setAttribute("style", `left:${leftShift}%`);
  };
}

export default HandlerDragAndDrop;
