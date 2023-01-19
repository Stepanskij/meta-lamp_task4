import View from "../View";
import Roller from "../Parts/Roller";
import EventArgs from "rangeSlider/Event/EventArgs";

import IRollerHandlerArgsUpdate from "rangeSlider/Data/updateArgs/IRollerHandlerArgsUpdate";

class RollerHandler {
  private clickArgs: IRollerHandlerArgsUpdate = {
    rollerWidth: 0,
    rollerHeight: 0,
    rightShiftX: 0,
    upShiftY: 0,
  };
  view: View;
  rollerPart: Roller;

  constructor({ view, rollerPart }: { view: View; rollerPart: Roller }) {
    this.view = view;
    this.rollerPart = rollerPart;
  }

  addEvent = (DOMSliderRoller: HTMLDivElement) => {
    DOMSliderRoller.addEventListener("click", this.handleMouseClick);
    DOMSliderRoller.addEventListener("touchstart", this.handleMouseClick);
  };

  removeEvent = (DOMSliderRoller: HTMLDivElement) => {
    DOMSliderRoller.removeEventListener("click", this.handleMouseClick);
    DOMSliderRoller.removeEventListener("touchstart", this.handleMouseClick);
  };

  handleMouseClick = (eventDown: UIEvent) => {
    let pageX: number = 0;
    let pageY: number = 0;
    let eventClick;
    if (eventDown instanceof TouchEvent) {
      eventClick = eventDown.changedTouches[0];

      pageX = eventDown.changedTouches[0].pageX;
      pageY = eventDown.changedTouches[0].pageY;
    } else if (eventDown instanceof MouseEvent) {
      eventClick = eventDown;

      pageX = eventDown.pageX;
      pageY = eventDown.pageY;
    }

    if (this.rollerPart.DOMRoot) {
      this.clickArgs.rollerWidth =
        this.rollerPart.DOMRoot.offsetWidth -
        this.rollerPart.DOMRoot.clientLeft * 2; //Ширина ролика при клике, px.
      this.clickArgs.rollerHeight =
        this.rollerPart.DOMRoot.offsetHeight -
        this.rollerPart.DOMRoot.clientTop * 2; //Высота ролика при клике, px.}

      const rollerPageX = this.getPositionElement(this.rollerPart.DOMRoot).left; //Левый отступ ролика относительно страницы.
      const rollerPageY = this.getPositionElement(this.rollerPart.DOMRoot).top; //Верхний отступ ролика относительно страницы.

      this.clickArgs.rightShiftX = pageX - rollerPageX; //Сдвиг мыши вправо относительно начала ролика, px.
      this.clickArgs.upShiftY = pageY - rollerPageY; //Сдвиг мыши вверх относительно начала ролика, px.
    }
    
    this.view.customEvents.onRollerClick.dispatch(
      new EventArgs({ ...this.clickArgs })
    );
  };

  private getPositionElement = (
    HTMLDivElement: HTMLDivElement
  ): { top: number; left: number } => {
    const elementObj = HTMLDivElement.getBoundingClientRect();

    const scrollTop = document.body.scrollTop; //Прокрученная часть страницы по вертикали, px.
    const scrollLeft = document.body.scrollLeft; //Прокрученная часть страницы по горизонтали, px.

    const clientTop = (this.rollerPart.DOMRoot as HTMLDivElement).clientTop; //Ширина border сверху, px.
    const clientLeft = (this.rollerPart.DOMRoot as HTMLDivElement).clientLeft; //Ширина border слева, px.

    const top = elementObj.top + scrollTop - clientTop;
    const left = elementObj.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
  };
}

export default RollerHandler;
