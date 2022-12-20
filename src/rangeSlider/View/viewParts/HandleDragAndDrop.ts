import View from "../View";
import EventArgs from "rangeSlider/Event/EventArgs";

import IDOMsSliderHandle from "rangeSlider/Data/DOMsData/IDOMsSliderHandle";
import IHandleMouseMove from "rangeSlider/Data/updateArgs/IDaDArgsUpdate";

class HandleDragAndDrop {
  private DaDArgs: IHandleMouseMove = {
    rollerWidth: 0,
    rollerHeight: 0,
    rollerPageX: 0,
    rollerPageY: 0,
    eventElementIndex: 0,
    rightShiftX: 0,
    upShiftY: 0,
  };

  constructor(public view: View) {}

  addEvent = (DOMsHandle: IDOMsSliderHandle): void => {
    if (DOMsHandle.DOMHandleView) {
      DOMsHandle.DOMHandleView.addEventListener(
        "mousedown",
        this.handleMouseDown
      );
      DOMsHandle.DOMHandleView.addEventListener(
        "touchstart",
        this.handleMouseDown
      );
    }
  };
  removeEvent = (DOMsHandle: IDOMsSliderHandle): void => {
    if (DOMsHandle.DOMHandleView) {
      DOMsHandle.DOMHandleView.removeEventListener(
        "mousedown",
        this.handleMouseDown
      );
      DOMsHandle.DOMHandleView.removeEventListener(
        "touchstart",
        this.handleMouseDown
      );
    }
  };

  private handleMouseDown = (eventDown: UIEvent): void => {
    //Запоминаем объект event.
    let eventClick;
    if (eventDown instanceof TouchEvent) {
      eventClick = eventDown.changedTouches[0];
    } else if (eventDown instanceof MouseEvent) {
      eventClick = eventDown;
    }
    //Обнуление сдвигов при клике на рычажок.
    this.DaDArgs.rightShiftX = 0;
    this.DaDArgs.upShiftY = 0;
    //Запоминание неизменных свойств при клике на рычажок.
    if (eventClick && this.view.data.DOMSliderRoller) {
      const eventElement = eventClick.target as HTMLDivElement; //view-элемент рычажка.
      this.DaDArgs.eventElementIndex = Number(eventElement.dataset.index); //Получение индекса рычажка.
      this.DaDArgs.rollerWidth =
        this.view.data.DOMSliderRoller.offsetWidth -
        this.view.data.DOMSliderRoller.clientLeft * 2; //Ширина ролика при клике, px.
      this.DaDArgs.rollerHeight =
        this.view.data.DOMSliderRoller.offsetHeight -
        this.view.data.DOMSliderRoller.clientTop * 2; //Высота ролика при клике, px.

      this.DaDArgs.rollerPageX = this.getPositionElement(
        this.view.data.DOMSliderRoller
      ).left; //Левый отступ ролика относительно страницы.
      this.DaDArgs.rollerPageY = this.getPositionElement(
        this.view.data.DOMSliderRoller
      ).top; //Верхний отступ ролика относительно страницы.
    }
    //
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("touchmove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("touchend", this.handleMouseUp);
  };
  private handleMouseMove = (eventMove: UIEvent): void => {
    let pageX: number = 0;
    let pageY: number = 0;
    if (eventMove instanceof TouchEvent) {
      pageX = eventMove.changedTouches[0].pageX;
      pageY = eventMove.changedTouches[0].pageY;
    } else if (eventMove instanceof MouseEvent) {
      pageX = eventMove.pageX;
      pageY = eventMove.pageY;
    }

    this.DaDArgs.rightShiftX = pageX - this.DaDArgs.rollerPageX; //Сдвиг мыши вправо относительно начала ролика, px.
    this.DaDArgs.upShiftY = pageY - this.DaDArgs.rollerPageY; //Сдвиг мыши вверх относительно начала ролика, px.
    //Запуск методов, что выполняются при движении рычажка.
    this.view.customEvents.onMouseMove.dispatch(
      new EventArgs({ ...this.DaDArgs })
    );
  };
  //Снимает ивенты движения и отжатия мыши/пальца с рычажка.
  private handleMouseUp = (): void => {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  };

  private getPositionElement = (
    HTMLDivElement: HTMLDivElement
  ): { top: number; left: number } => {
    const elementObj = HTMLDivElement.getBoundingClientRect();

    const scrollTop = document.body.scrollTop; //Прокрученная часть страницы по вертикали, px.
    const scrollLeft = document.body.scrollLeft; //Прокрученная часть страницы по горизонтали, px.

    const clientTop = (this.view.data.DOMSliderRoller as HTMLDivElement)
      .clientTop; //Ширина border сверху, px.
    const clientLeft = (this.view.data.DOMSliderRoller as HTMLDivElement)
      .clientLeft; //Ширина border слева, px.

    const top = elementObj.top + scrollTop - clientTop;
    const left = elementObj.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  };
}

export default HandleDragAndDrop;
