import IModelData from "rangeSlider/Data/IModelData";
import IHandles from "rangeSlider/Data/IHandles";
import IDOMsSliderHandle from "rangeSlider/Data/DOMsData/IDOMsSliderHandle";
import IDOMsOfSlider from "rangeSlider/Data/IDOMsOfSlider";

class HandlerDragAndDrop {
  private rollerWidth: number = 0;
  private stepWidth: number = 0;
  private handleObj?: IHandles;
  private rollerPageX: number = 0;
  private eventElementIndex: number = 0;

  constructor(
    private DOMHandle: IDOMsSliderHandle,
    private DOMsOfSlider: IDOMsOfSlider,
    private modelData: IModelData
  ) {}

  addEvent = (): void => {
    if (this.DOMHandle.DOMHandleView) {
      this.DOMHandle.DOMHandleView.addEventListener(
        "mousedown",
        this._handleMouseDown
      );
      this.DOMHandle.DOMHandleView.addEventListener(
        "touchstart",
        this._handleMouseDown
      );
    }
  };
  removeEvent = (): void => {
    if (this.DOMHandle.DOMHandleView) {
      this.DOMHandle.DOMHandleView.removeEventListener(
        "mousedown",
        this._handleMouseDown
      );
      this.DOMHandle.DOMHandleView.removeEventListener(
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
    if (
      eventClick &&
      this.modelData.handles &&
      this.modelData.maxSteps &&
      this.DOMsOfSlider.DOMSliderRoller
    ) {
      const eventElement = eventClick.target as HTMLDivElement; //view-элемент рычажка.
      this.eventElementIndex = Number(eventElement.dataset.index);
      this.rollerWidth =
        this.DOMsOfSlider.DOMSliderRoller.offsetWidth -
        this.DOMsOfSlider.DOMSliderRoller.clientLeft * 2; //Ширина ролика при клике, px.
      this.stepWidth = this.rollerWidth / this.modelData.maxSteps; //Ширина одного шага рычажка, px.
      this.handleObj = this.modelData.handles[this.eventElementIndex]; //Data-объект рычажка.

      this.rollerPageX = this._getPositionElement(
        this.DOMsOfSlider.DOMSliderRoller
      ).left; //Левый отступ ролика относительно страницы.
    }
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
      this.DOMsOfSlider.DOMsSliderHandles &&
      this.DOMHandle.DOMHandleValueText
    ) {
      //Невозможность перескочить соседние рычажки.
      if (!this.modelData.handlesCanPushed && this.modelData.handles) {
        //Невозможность перескочить правый рычажок.
        if (
          this.eventElementIndex < this.modelData.handles.length - 1 &&
          this.modelData.handles[this.eventElementIndex + 1].step !== undefined
        ) {
          if (
            stepNow >
            (this.modelData.handles[this.eventElementIndex + 1].step as number)
          ) {
            stepNow = this.modelData.handles[this.eventElementIndex + 1]
              .step as number;
          }
        }
        //Невозможность перескочить левый рычажок.
        if (
          this.eventElementIndex !== 0 &&
          this.modelData.handles[this.eventElementIndex - 1].step !== undefined
        ) {
          if (
            stepNow <
            (this.modelData.handles[this.eventElementIndex - 1].step as number)
          ) {
            stepNow = this.modelData.handles[this.eventElementIndex - 1]
              .step as number;
          }
        }
      }
      //Невозможность выйти за границы ролика.
      if (stepNow < 0) {
        stepNow = 0;
      } else if (stepNow > this.modelData.maxSteps) {
        stepNow = this.modelData.maxSteps;
      }
      //
      this.handleObj.step = stepNow;
      this.handleObj.value =
        this.modelData.minValue + stepNow * this.modelData.stepSize;
      const styleLeft = (stepNow / this.modelData.maxSteps) * 100;
      this._renderHandle(
        this.DOMsOfSlider.DOMsSliderHandles[this.eventElementIndex]
          .DOMHandleContainer as HTMLDivElement,
        styleLeft
      );
      this.DOMHandle.DOMHandleValueText.innerHTML = `${this.handleObj.value}`;
    }
  };
  //Снимает ивенты движения и отжатия мыши/пальца с рычажка.
  private _handleMouseUp = (): void => {
    document.removeEventListener("mousemove", this._handleMouseMove);
    document.removeEventListener("mouseup", this._handleMouseUp);
  };
  //Задаёт указанный сдвиг влево для рычажка.
  private _renderHandle = (
    handleDOM: HTMLDivElement,
    styleLeft: number
  ): void => {
    handleDOM.setAttribute("style", `left:${styleLeft}%`);
  };

  private _getPositionElement = (
    HTMLDivElement: HTMLDivElement
  ): { top: number; left: number } => {
    const elementObj = HTMLDivElement.getBoundingClientRect();

    const docEl = document.documentElement;

    const scrollTop = docEl.scrollTop; //Прокрученная часть страницы по вертикали, px.
    const scrollLeft = docEl.scrollLeft; //Прокрученная часть страницы по горизонтали, px.

    const clientTop = (this.DOMsOfSlider.DOMSliderRoller as HTMLDivElement)
      .clientTop; //Ширина border сверху, px.
    const clientLeft = (this.DOMsOfSlider.DOMSliderRoller as HTMLDivElement)
      .clientLeft; //Ширина border слева, px.

    const top = elementObj.top + scrollTop - clientTop;
    const left = elementObj.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  };
}

export default HandlerDragAndDrop;
