import IModelData from "rangeSlider/Data/IModelData";

class HandlerDragAndDrop {
  private clickPageX: number = 0;
  private rollerWidth: number = 0;
  private maxSteps: number = 1;
  private handleStepPositionMax: number;
  private stepWidth: number = 0;
  private handleStepPosition: number = 0;
  private handleStepPositionOnClick: number = 0;
  private styleLeft: number = 0;

  constructor(
    private DOMsHandle: HTMLDivElement[],
    private DOMSliderRoller: HTMLDivElement,
    private modelData: IModelData
  ) {
    this.DOMsHandle = DOMsHandle;
    this.DOMSliderRoller = DOMSliderRoller;

    if (modelData.maxSteps) this.maxSteps = modelData.maxSteps;
    this.handleStepPositionMax = this.maxSteps;
  }

  addEvent = (): void => {
    this.DOMsHandle[1].addEventListener("mousedown", this._handleMouseDown);
    this.DOMsHandle[1].addEventListener("touchstart", this._handleMouseDown);
  };
  removeEvent = (): void => {
    this.DOMsHandle[1].removeEventListener("mousedown", this._handleMouseDown);
    this.DOMsHandle[1].removeEventListener("touchstart", this._handleMouseDown);
  };

  private _handleMouseDown = (eventDown: UIEvent): void => {
    //Запоминаем объект event.
    let eventClick;
    if (eventDown instanceof TouchEvent) {
      eventClick = eventDown.changedTouches[0];
    } else if (eventDown instanceof MouseEvent) {
      eventClick = eventDown;
    }
    //
    if (eventClick && this.modelData.handles) {
      const eventElement = eventClick.target as HTMLDivElement;
      this.clickPageX = eventClick.pageX; //Координата X при клике, относительно страницы.
      this.rollerWidth = this.DOMSliderRoller.offsetWidth; //Ширина ролика при клике, px.
      this.stepWidth = this.rollerWidth / this.maxSteps; //Ширина одного шага рычажка, px.
      //Номер шага указанного рычажка.
      this.handleStepPositionOnClick = this.modelData.handles[
        Number(eventElement.dataset.index)
      ].step as number;
    }
    document.addEventListener("mousemove", this._handleMouseMove);
    document.addEventListener("mouseup", this._handleMouseUp);
    document.addEventListener("touchmove", this._handleMouseMove);
    document.addEventListener("touchend", this._handleMouseUp);
  };
  private _handleMouseMove = (eventMove: UIEvent): void => {
    let pageX: number = 0;
    if (eventMove instanceof TouchEvent) {
      pageX = eventMove.changedTouches[0].pageX;
    } else if (eventMove instanceof MouseEvent) {
      pageX = eventMove.pageX;
    }

    const rightShiftX = pageX - this.clickPageX; //Сдвиг мыши вправо, px.
    console.log()
    //
    if (
      rightShiftX + this.handleStepPositionOnClick * this.stepWidth >
      this.stepWidth / 2 + this.handleStepPosition * this.stepWidth
    ) {
      const stepPercent = 100 / this.maxSteps;
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
      rightShiftX + this.handleStepPositionOnClick * this.stepWidth <
      this.stepWidth / 2 + (this.handleStepPosition - 1) * this.stepWidth
    ) {
      const stepPercent = 100 / this.maxSteps;
      this.handleStepPosition -= 1;
      this.styleLeft = stepPercent * this.handleStepPosition;
      //
      if (this.styleLeft < 0) this.styleLeft = 0;
      if (this.handleStepPosition < 0) this.handleStepPosition = 0;
      this._renderSlider(this.styleLeft);
    }
  };
  //Снимает ивенты движения и отжатия мыши/пальца с рычажка
  private _handleMouseUp = (): void => {
    document.removeEventListener("mousemove", this._handleMouseMove);
    document.removeEventListener("mouseup", this._handleMouseUp);
  };
  //Задаёт указанный сдвиг влево для рычажка
  private _renderSlider = (styleLeft: number): void => {
    this.DOMsHandle[0].setAttribute("style", `left:${styleLeft}%`);
  };
}

export default HandlerDragAndDrop;
