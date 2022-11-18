import IModelData from "rangeSlider/Data/IModelData";
import IHandles from "rangeSlider/Data/IHandles";
import IDOMsSliderHandle from "rangeSlider/Data/DOMsData/IDOMsSliderHandle";
import IDOMsOfSlider from "rangeSlider/Data/IDOMsOfSlider";
import View from "../View";

class HandleDragAndDrop {
  private rollerWidth: number = 0;
  private rollerHeight: number = 0;
  private stepWidth: number = 0;
  private stepHeight: number = 0;
  private handleObj?: IHandles;
  private rollerPageX: number = 0;
  private rollerPageY: number = 0;
  private eventElementIndex: number = 0;

  constructor(
    private DOMHandle: IDOMsSliderHandle,
    private DOMsOfSlider: IDOMsOfSlider,
    private modelData: IModelData,
    private viewMethods: View
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
      this.rollerHeight =
        this.DOMsOfSlider.DOMSliderRoller.offsetHeight -
        this.DOMsOfSlider.DOMSliderRoller.clientTop * 2; //Высота ролика при клике, px.
      this.stepWidth = this.rollerWidth / this.modelData.maxSteps; //Ширина одного шага рычажка, px.
      this.stepHeight = this.rollerHeight / this.modelData.maxSteps; //Ширина одного шага рычажка, px.
      this.handleObj = this.modelData.handles[this.eventElementIndex]; //Data-объект рычажка.

      this.rollerPageX = this._getPositionElement(
        this.DOMsOfSlider.DOMSliderRoller
      ).left; //Левый отступ ролика относительно страницы.
      this.rollerPageY = this._getPositionElement(
        this.DOMsOfSlider.DOMSliderRoller
      ).top; //Верхний отступ ролика относительно страницы.
    }
    //
    document.addEventListener("mousemove", this._handleMouseMove);
    document.addEventListener("touchmove", this._handleMouseMove);
    document.addEventListener("mouseup", this._handleMouseUp);
    document.addEventListener("touchend", this._handleMouseUp);
  };
  private _handleMouseMove = (eventMove: UIEvent): void => {
    let pageX: number = 0;
    let pageY: number = 0;
    if (eventMove instanceof TouchEvent) {
      pageX = eventMove.changedTouches[0].pageX;
      pageY = eventMove.changedTouches[0].pageY;
    } else if (eventMove instanceof MouseEvent) {
      pageX = eventMove.pageX;
      pageY = eventMove.pageY;
    }

    const rightShiftX = pageX - this.rollerPageX; //Сдвиг мыши вправо относительно начала ролика, px.
    const rightShiftY = pageY - this.rollerPageY; //Сдвиг мыши вверх относительно начала ролика, px.

    let stepNow: number = 0;
    if (!this.modelData.isVertical) {
      stepNow = Math.round(rightShiftX / this.stepWidth);
    } else if (this.modelData.maxSteps)
      stepNow =
        this.modelData.maxSteps - Math.round(rightShiftY / this.stepHeight);

    if (
      this.modelData.maxSteps &&
      this.modelData.minValue &&
      this.modelData.stepSize &&
      this.handleObj &&
      this.DOMsOfSlider.DOMsSliderHandles
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
      //Смена позиции данного рычажка.
      this.handleObj.step = stepNow;
      this.handleObj.value = Number(
        (this.modelData.minValue + stepNow * this.modelData.stepSize).toFixed(
          this.modelData.numberRounding
        )
      );
      //Возможность толкать рычажки на своём пути.
      if (this.modelData.handlesCanPushed && this.modelData.handles) {
        //Объекты рычажков слева.
        const handlesLeft = this.DOMsOfSlider.DOMsSliderHandles.slice(
          0,
          this.eventElementIndex
        );
        //Объекты рычажков справа.
        const handlesRight = this.DOMsOfSlider.DOMsSliderHandles.slice(
          this.eventElementIndex + 1
        );
        //Толкание рычажков слева.
        if (handlesLeft.length > 0) {
          handlesLeft.forEach((handleDOMsObj) => {
            //Индекс проверяемого рычажка.
            const indexHandle = Number(
              handleDOMsObj.DOMHandleView?.dataset.index
            );
            const stepHandle = (this.modelData.handles as IHandles[])[
              indexHandle
            ];
            //Переделка проверяемого рычажка.
            if ((stepHandle.step as number) > stepNow && this.handleObj) {
              stepHandle.step = stepNow;
              stepHandle.value = this.handleObj.value;
            }
          });
        }
        //Толкание рычажков справа.
        if (handlesRight.length > 0) {
          handlesRight.forEach((handleDOMsObj) => {
            //Индекс проверяемого рычажка.
            const indexHandle = Number(
              handleDOMsObj.DOMHandleView?.dataset.index
            );
            const stepHandle = (this.modelData.handles as IHandles[])[
              indexHandle
            ];
            //Переделка проверяемого рычажка.
            if ((stepHandle.step as number) < stepNow && this.handleObj) {
              stepHandle.step = stepNow;
              stepHandle.value = this.handleObj.value;
            }
          });
        }
      }
      this.viewMethods.renderViewHandles(this.DOMsOfSlider, this.modelData);
      this.viewMethods.renderFillStrips(this.DOMsOfSlider);
    }
  };
  //Снимает ивенты движения и отжатия мыши/пальца с рычажка.
  private _handleMouseUp = (): void => {
    document.removeEventListener("mousemove", this._handleMouseMove);
    document.removeEventListener("mouseup", this._handleMouseUp);
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

export default HandleDragAndDrop;
