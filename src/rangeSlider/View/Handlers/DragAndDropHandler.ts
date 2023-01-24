import View from "../View";
import EventArgs from "rangeSlider/Event/EventArgs";
import Handle from "../Parts/Handle";
import Roller from "../Parts/Roller";

import IHandleMouseMove from "rangeSlider/Data/updateArgs/IDaDHandlerArgsUpdate";

class DragAndDropHandler {
  private DaDArgs: IHandleMouseMove = {
    rollerWidth: 0,
    rollerHeight: 0,
    rollerPageX: 0,
    rollerPageY: 0,
    eventElementId: 0,
    rightShiftX: 0,
    upShiftY: 0,
  };
  view: View;
  handlePart: Handle;
  roller: Roller;
  DOMRoller: HTMLDivElement | undefined;

  constructor({
    view,
    handlePart,
    roller,
  }: {
    view: View;
    handlePart: Handle;
    roller: Roller;
  }) {
    this.view = view;
    this.handlePart = handlePart;
    this.roller = roller;
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
    //Обнуление сдвигов при клике на рычажок.
    this.DaDArgs.rightShiftX = 0;
    this.DaDArgs.upShiftY = 0;
    //Запоминание неизменных свойств при клике на рычажок.
    if (eventClick && this.roller.DOMRoot) {
      const eventElement = eventClick.target as HTMLDivElement; //view-элемент рычажка.
      this.DaDArgs.eventElementId = Number(eventElement.dataset.id); //Получение id рычажка.
      this.DaDArgs.rollerWidth =
        this.roller.DOMRoot.offsetWidth -
        this.roller.DOMRoot.clientLeft * 2; //Ширина ролика при клике, px.
      this.DaDArgs.rollerHeight =
        this.roller.DOMRoot.offsetHeight -
        this.roller.DOMRoot.clientTop * 2; //Высота ролика при клике, px.

      this.DaDArgs.rollerPageX = this.getPositionElement(
        this.roller.DOMRoot
      ).left; //Левый отступ ролика относительно страницы.
      this.DaDArgs.rollerPageY = this.getPositionElement(
        this.roller.DOMRoot
      ).top; //Верхний отступ ролика относительно страницы.
    }
    console.log(this.DaDArgs.rollerPageX)
    //
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

    this.DaDArgs.rightShiftX = pageX - this.DaDArgs.rollerPageX; //Сдвиг мыши вправо относительно начала ролика, px.
    this.DaDArgs.upShiftY = pageY - this.DaDArgs.rollerPageY; //Сдвиг мыши вверх относительно начала ролика, px.
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

    const clientTop = (this.roller.DOMRoot as HTMLDivElement).clientTop; //Ширина border сверху, px.
    const clientLeft = (this.roller.DOMRoot as HTMLDivElement).clientLeft; //Ширина border слева, px.

    const top = elementObj.top + scrollTop - clientTop;
    const left = elementObj.left + scrollLeft - clientLeft;
    
    return { top: Math.round(top), left: Math.round(left) };
  };
}

export default DragAndDropHandler;
