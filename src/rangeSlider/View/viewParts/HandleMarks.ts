import View from "../View";
import EventArgs from "rangeSlider/Event/EventArgs";

import IDOMsScaleMark from "rangeSlider/Data/DOMsData/IDOMsScaleMark";
import IHandleMarksArgsUpdate from "rangeSlider/Data/updateArgs/IHandleMarksArgsUpdate";

class HandleMarks {
  private markClickArgs: IHandleMarksArgsUpdate = { markerValue: 0 };
  constructor(public view: View) {}

  addEvent = (DOMsScaleMark: IDOMsScaleMark): void => {
    if (DOMsScaleMark.DOMScaleMarkValueText) {
      DOMsScaleMark.DOMScaleMarkValueText.addEventListener(
        "mousedown",
        this.handleMouseDown
      );
      DOMsScaleMark.DOMScaleMarkValueText.addEventListener(
        "touchstart",
        this.handleMouseDown
      );
    }
  };
  removeEvent = (DOMsScaleMark: IDOMsScaleMark): void => {
    if (DOMsScaleMark.DOMScaleMarkValueText) {
      DOMsScaleMark.DOMScaleMarkValueText.removeEventListener(
        "mousedown",
        this.handleMouseDown
      );
      DOMsScaleMark.DOMScaleMarkValueText.removeEventListener(
        "touchstart",
        this.handleMouseDown
      );
    }
  };

  handleMouseDown = (eventDown: UIEvent): void => {
    //Запоминаем объект event.
    let eventClick;
    if (eventDown instanceof TouchEvent) {
      eventClick = eventDown.changedTouches[0];
    } else if (eventDown instanceof MouseEvent) {
      eventClick = eventDown;
    }
    if (eventClick) {
      const eventElement = eventClick.target as HTMLDivElement;
      this.markClickArgs.markerValue = Number(eventElement.textContent);
    }
    this.view.customEvents.onMouseClick.dispatch(
      new EventArgs({ ...this.markClickArgs })
    );
  };
}

export default HandleMarks;
