import View from "../View";
import EventArgs from "rangeSlider/Event/EventArgs";
import Handle from "../Parts/Handle";
import Roller from "../Parts/Roller";

import IDnDArgsUpdate from "rangeSlider/Data/updateArgs/IDaDHandlerArgsUpdate";

class DragAndDropHandler {
  private DaDArgs: IDnDArgsUpdate = {
    rollerWidth: 0,
    rollerHeight: 0,
    rollerPageX: 0,
    rollerPageY: 0,
    eventElementId: 0,
    rightShiftX: 0,
    upShiftY: 0,
    mousePositionRelativeCenterHandleX: 0,
    mousePositionRelativeCenterHandleY: 0,
  };
  view: View;
  handlePart: Handle;
  rollerPart: Roller;
  DOMRoller: HTMLDivElement | undefined;

  constructor({
    view,
    handlePart,
    rollerPart,
  }: {
    view: View;
    handlePart: Handle;
    rollerPart: Roller;
  }) {
    this.view = view;
    this.handlePart = handlePart;
    this.rollerPart = rollerPart;
  }

  addEvent = (DOMHandle: HTMLDivElement) => {
    DOMHandle.addEventListener("mousedown", this.handleMouseDown);
    DOMHandle.addEventListener("touchstart", this.handleMouseDown);
  };
  removeEvent = (DOMHandle: HTMLDivElement) => {
    DOMHandle.removeEventListener("mousedown", this.handleMouseDown);
    DOMHandle.removeEventListener("touchstart", this.handleMouseDown);
  };

  private handleMouseDown = (eventDown: UIEvent) => {
    //Запоминаем объект event.
    let eventClick;
    if (eventDown instanceof TouchEvent) {
      eventClick = eventDown.changedTouches[0];
    } else if (eventDown instanceof MouseEvent) {
      eventClick = eventDown;
    }
    //Запоминание неизменных свойств при клике на рычажок.
    if (eventClick && this.rollerPart.DOMRoot) {
      const eventElement = eventClick.target as HTMLDivElement; //view-элемент рычажка.

      const handlePosition = this.getPositionElement(
        this.handlePart.DOMRoot as HTMLDivElement
      );

      this.DaDArgs.mousePositionRelativeCenterHandleX =
        eventClick.pageX -
        (handlePosition.left +
          (this.handlePart.DOMRoot as HTMLDivElement).offsetWidth / 2);
      this.DaDArgs.mousePositionRelativeCenterHandleY =
        handlePosition.top +
        (this.handlePart.DOMRoot as HTMLDivElement).offsetHeight / 2 -
        eventClick.pageY;

      this.DaDArgs.eventElementId = Number(eventElement.dataset.id); //Получение id рычажка.

      this.DaDArgs.rollerWidth =
        this.rollerPart.DOMRoot.offsetWidth -
        this.rollerPart.DOMRoot.clientLeft * 2; //Ширина ролика при клике, px.
      this.DaDArgs.rollerHeight =
        this.rollerPart.DOMRoot.offsetHeight -
        this.rollerPart.DOMRoot.clientTop * 2; //Высота ролика при клике, px.

      this.DaDArgs.rollerPageX = this.getPositionElement(
        this.rollerPart.DOMRoot
      ).left; //Левый отступ ролика относительно страницы.
      this.DaDArgs.rollerPageY = this.getPositionElement(
        this.rollerPart.DOMRoot
      ).top; //Верхний отступ ролика относительно страницы.
    }

    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("touchmove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
    document.addEventListener("touchend", this.handleMouseUp);
  };

  private handleMouseMove = (eventMove: UIEvent) => {
    let pageX: number = 0;
    let pageY: number = 0;
    if (eventMove instanceof TouchEvent) {
      pageX = eventMove.changedTouches[0].pageX;
      pageY = eventMove.changedTouches[0].pageY;
    } else if (eventMove instanceof MouseEvent) {
      pageX = eventMove.pageX;
      pageY = eventMove.pageY;
    }

    this.DaDArgs.rightShiftX =
      pageX -
      this.DaDArgs.rollerPageX -
      this.DaDArgs.mousePositionRelativeCenterHandleX; //Сдвиг мыши вправо относительно начала ролика, px.
    this.DaDArgs.upShiftY =
      this.DaDArgs.rollerHeight -
      (pageY -
        this.DaDArgs.rollerPageY -
        this.DaDArgs.mousePositionRelativeCenterHandleY); //Сдвиг мыши вверх относительно начала ролика, px.
    //Запуск методов, что выполняются при движении рычажка.
    this.view.customEvents.onHandleMove.dispatch(
      new EventArgs({ ...this.DaDArgs })
    );
  };
  //Снимает ивенты движения и отжатия мыши/пальца с рычажка.
  private handleMouseUp = () => {
    document.removeEventListener("mousemove", this.handleMouseMove);
    document.removeEventListener("mouseup", this.handleMouseUp);
  };

  private getPositionElement = (
    HTMLDivElement: HTMLDivElement
  ): { top: number; left: number } => {
    const elementObj = HTMLDivElement.getBoundingClientRect();

    const scrollTop = document.body.scrollTop; //Прокрученная часть страницы по вертикали, px.
    const scrollLeft = document.body.scrollLeft; //Прокрученная часть страницы по горизонтали, px.

    const clientTop = HTMLDivElement.clientTop; //Ширина border сверху, px.
    const clientLeft = HTMLDivElement.clientLeft; //Ширина border слева, px.

    const top = elementObj.top + scrollTop; /* - clientTop */
    const left = elementObj.left + scrollLeft; /*  - clientLeft */

    return { top: Math.round(top), left: Math.round(left) };
  };
}

export default DragAndDropHandler;
