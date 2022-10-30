import IModelData from "rangeSlider/Data/IModelData";
import IHandles from "rangeSlider/Data/IHandles";
import IDOMsSliderHandles from "rangeSlider/Data/DOMsData/IDOMsSliderHandle";

class HandlerDragAndDrop {
  private rollerWidth: number = 0;
  private stepWidth: number = 0;
  private handleObj?: IHandles;
  private rollerPageX: number = 0;

  constructor(
    private DOMsHandle: IDOMsSliderHandles,
    private DOMSliderRoller: HTMLDivElement,
    private modelData: IModelData
  ) {}

  addEvent = (): void => {
    if (this.DOMsHandle.DOMHandleView) {
      this.DOMsHandle.DOMHandleView.addEventListener(
        "mousedown",
        this._handleMouseDown
      );
      this.DOMsHandle.DOMHandleView.addEventListener(
        "touchstart",
        this._handleMouseDown
      );
    }
  };
  removeEvent = (): void => {
    if (this.DOMsHandle.DOMHandleView) {
      this.DOMsHandle.DOMHandleView.removeEventListener(
        "mousedown",
        this._handleMouseDown
      );
      this.DOMsHandle.DOMHandleView.removeEventListener(
        "touchstart",
        this._handleMouseDown
      );
    }
  };

  private _handleMouseDown = (eventDown: UIEvent): void => {
    //Запоминаем объект event.
    let eventClick;
    if (eventDown instanceof TouchEvent) {
      eventClick = eventDown.changedTouches[0];
    } else if (eventDown instanceof MouseEvent) {
      eventClick = eventDown;
    }
    //Запоминание неизменных свойств при клике на рычажок.
    if (eventClick && this.modelData.handles && this.modelData.maxSteps) {
      const eventElement = eventClick.target as HTMLDivElement; //view-элемент рычажка.
      this.rollerWidth =
        this.DOMSliderRoller.offsetWidth - this.DOMSliderRoller.clientLeft * 2; //Ширина ролика при клике, px.
      this.stepWidth = this.rollerWidth / this.modelData.maxSteps; //Ширина одного шага рычажка, px.
      this.handleObj =
        this.modelData.handles[Number(eventElement.dataset.index)]; //Data-объект рычажка.
    }
    this.rollerPageX = this._getPositionElement(this.DOMSliderRoller).left; //Левый отступ ролика относительно страницы.
    //
    document.addEventListener("mousemove", this._handleMouseMove);
    document.addEventListener("touchmove", this._handleMouseMove);
    document.addEventListener("mouseup", this._handleMouseUp);
    document.addEventListener("touchend", this._handleMouseUp);
  };
  private _handleMouseMove = (eventMove: UIEvent): void => {
    let pageX: number = 0;
    if (eventMove instanceof TouchEvent) {
      pageX = eventMove.changedTouches[0].pageX;
    } else if (eventMove instanceof MouseEvent) {
      pageX = eventMove.pageX;
    }

    const rightShiftX = pageX - this.rollerPageX; //Сдвиг мыши вправо относительно начала ролика, px.

    let stepNow = Math.round(rightShiftX / this.stepWidth);
    if (
      this.modelData.maxSteps &&
      this.modelData.minValue &&
      this.modelData.stepSize &&
      this.handleObj &&
      this.DOMsHandle.DOMHandleValueText
    ) {
      if (stepNow < 0) {
        stepNow = 0;
      } else if (stepNow > this.modelData.maxSteps) {
        stepNow = this.modelData.maxSteps;
      }
      this.handleObj.step = stepNow;
      this.handleObj.value =
        this.modelData.minValue + stepNow * this.modelData.stepSize;
      const styleLeft = (stepNow / this.modelData.maxSteps) * 100;
      this._renderHandle(styleLeft);
      this.DOMsHandle.DOMHandleValueText.innerHTML = `${this.handleObj.value}`;
    }
  };
  //Снимает ивенты движения и отжатия мыши/пальца с рычажка
  private _handleMouseUp = (): void => {
    document.removeEventListener("mousemove", this._handleMouseMove);
    document.removeEventListener("mouseup", this._handleMouseUp);
  };
  //Задаёт указанный сдвиг влево для рычажка
  private _renderHandle = (styleLeft: number): void => {
    if (this.DOMsHandle.DOMHandleBody)
      this.DOMsHandle.DOMHandleBody.setAttribute("style", `left:${styleLeft}%`);
  };

  private _getPositionElement = (
    HTMLElement: HTMLElement
  ): { top: number; left: number } => {
    const elementObj = HTMLElement.getBoundingClientRect();

    const docEl = document.documentElement;

    const scrollTop = docEl.scrollTop; //Прокрученная часть страницы по вертикали, px.
    const scrollLeft = docEl.scrollLeft; //Прокрученная часть страницы по горизонтали, px.

    const clientTop = this.DOMSliderRoller.clientTop; //Ширина border сверху, px.
    const clientLeft = this.DOMSliderRoller.clientLeft; //Ширина border слева, px.

    const top = elementObj.top + scrollTop - clientTop;
    const left = elementObj.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  };
}

export default HandlerDragAndDrop;
