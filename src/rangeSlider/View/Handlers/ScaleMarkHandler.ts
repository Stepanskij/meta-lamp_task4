import View from "../View";
import EventArgs from "rangeSlider/Event/EventArgs";
import ScaleMarker from "../Parts/ScaleMarker";

import IScaleMarkHandlerArgsUpdate from "rangeSlider/Data/updateArgs/IScaleMarkHandlerArgsUpdate";

class ScaleMarkHandler {
  private markClickArgs: IScaleMarkHandlerArgsUpdate = { markerValue: 0 };

  view: View;
  scalePart: ScaleMarker;

  constructor({ view, scalePart }: { view: View; scalePart: ScaleMarker }) {
    this.view = view;
    this.scalePart = scalePart;
  }

  addEvent = (DOMScaleMarkValueText: HTMLDivElement) => {
    DOMScaleMarkValueText.addEventListener("click", this.handleMouseClick);
    DOMScaleMarkValueText.addEventListener("touchstart", this.handleMouseClick);
  };

  removeEvent = (DOMScaleMarkValueText: HTMLDivElement) => {
    DOMScaleMarkValueText.removeEventListener("click", this.handleMouseClick);
    DOMScaleMarkValueText.removeEventListener(
      "touchstart",
      this.handleMouseClick
    );
  };

  handleMouseClick = (eventDown: UIEvent) => {
    let eventClick;
    if (eventDown instanceof TouchEvent) {
      eventClick = eventDown.changedTouches[0];
    } else if (eventDown instanceof MouseEvent) {
      eventClick = eventDown;
    }

    this.markClickArgs.markerValue = this.scalePart.value;
    this.view.customEvents.onScaleClick.dispatch(
      new EventArgs({ ...this.markClickArgs })
    );
  };
}

export default ScaleMarkHandler;
