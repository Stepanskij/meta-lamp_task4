class HandlerDragAndDrop {
  private clickPageX: number = 0;
  private rollerWidth: number = 0;
  private numberSteps: number = 10;
  private handleStepPositionMax: number = 10;
  private stepWidth: number = 0;
  private handleStepPosition: number = 0;
  private handleStepPositionOnClick: number = 0;
  private styleLeft: number = 0;

  constructor(
    private DOMHandleButton: HTMLButtonElement,
    private DOMRangeSliderDiv: HTMLDivElement
  ) {
    this.DOMHandleButton = DOMHandleButton;
    this.DOMRangeSliderDiv = DOMRangeSliderDiv;
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
    this.clickPageX = eventDown.pageX; //координата X при клике, относительно страницы
    this.rollerWidth = this.DOMRangeSliderDiv.offsetWidth; //ширина ролика при клике, px
    this.stepWidth = this.rollerWidth / this.numberSteps; //ширина одного шага ручки, px
    this.handleStepPositionOnClick = this.handleStepPosition;

    document.addEventListener("mousemove", this._handleMouseMove);
    document.addEventListener("mouseup", this._handleMouseUp);
  };
  private _handleMouseMove = (eventMove: MouseEvent): void => {
    let leftShift = eventMove.pageX - this.clickPageX; //сдвиг мыши влево, px

    //
    if (
      leftShift + this.handleStepPositionOnClick * this.stepWidth >
      this.stepWidth / 2 + this.handleStepPosition * this.stepWidth
    ) {
      const stepPercent = 100 / this.numberSteps;
      this.handleStepPosition += 1;
      this.styleLeft = stepPercent * this.handleStepPosition;
      //
      if (this.styleLeft > 100) this.styleLeft = 100;
      if (this.handleStepPosition > this.handleStepPositionMax)
        this.handleStepPosition = this.handleStepPositionMax;
      this._renderSlider(this.styleLeft);
    }
    //
    if (
      leftShift + this.handleStepPositionOnClick * this.stepWidth <
      this.stepWidth / 2 + (this.handleStepPosition - 1) * this.stepWidth
    ) {
      const stepPercent = 100 / this.numberSteps;
      this.handleStepPosition -= 1;
      this.styleLeft = stepPercent * this.handleStepPosition;
      //
      if (this.styleLeft < 0) this.styleLeft = 0;
      if (this.handleStepPosition < 0) this.handleStepPosition = 0;
      this._renderSlider(this.styleLeft);
    }
  };
  private _handleMouseUp = (): void => {
    document.removeEventListener("mousemove", this._handleMouseMove);
    document.removeEventListener("mouseup", this._handleMouseUp);
  };

  private _renderSlider = (styleLeft: number): void => {
    this.DOMHandleButton.setAttribute("style", `left:${styleLeft}%`);
  };
}

export default HandlerDragAndDrop;
