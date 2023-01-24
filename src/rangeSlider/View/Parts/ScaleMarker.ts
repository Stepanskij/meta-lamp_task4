import IModelData from "rangeSlider/Data/IModelData";

import View from "../View";
import ScaleMarkHandler from "../Handlers/ScaleMarkHandler";
import Roller from "./Roller";
import { IViewPart } from "./IViewPart";

class ScaleMarker implements IViewPart {
  view: View;
  DOMRoot: HTMLDivElement | undefined;
  private id: number;
  private shiftLeft: number = 0;

  public value: number = 0;
  public roller: Roller;
  public clickHandler: ScaleMarkHandler;

  constructor({
    view,
    id,
    roller,
  }: {
    view: View;
    id: number;
    roller: Roller;
  }) {
    this.view = view;
    this.id = id;
    this.roller = roller;
    this.clickHandler = new ScaleMarkHandler({
      view: this.view,
      scalePart: this,
    });
  }

  build = ({ DOMContainer }: { DOMContainer: HTMLDivElement }) => {
    const DOMScaleMarkContainer = document.createElement("div");
    DOMScaleMarkContainer.className = "scale-mark";
    DOMScaleMarkContainer.dataset.id = `${this.id}`;

    const DOMScaleMarkSeparator = document.createElement("div");
    DOMScaleMarkSeparator.className = "scale-mark__separator";

    const DOMScaleMarkValue = document.createElement("div");
    DOMScaleMarkValue.className = "scale-mark__value";
    //
    DOMContainer.insertAdjacentElement("beforeend", DOMScaleMarkContainer);
    DOMScaleMarkContainer.insertAdjacentElement(
      "beforeend",
      DOMScaleMarkSeparator
    );
    DOMScaleMarkContainer.insertAdjacentElement("beforeend", DOMScaleMarkValue);

    DOMContainer.insertAdjacentElement("beforeend", DOMScaleMarkContainer);
    //
    this.DOMRoot = DOMScaleMarkContainer;
  };

  calculateStyles = ({ modelData }: { modelData: IModelData }) => {
    if (modelData.scaleData && modelData.scaleData.markArray) {
      this.value = modelData.scaleData.markArray[this.id];
    }
    const DOMScaleMarkValueText =
      this.DOMRoot?.querySelector(".scale-mark__value");
    if (DOMScaleMarkValueText)
      DOMScaleMarkValueText.textContent = String(this.value);

    if (
      modelData.scaleData &&
      modelData.scaleData.markArray &&
      modelData.minValue &&
      modelData.maxValue
    ) {
      this.shiftLeft =
        ((modelData.scaleData.markArray[this.id] - modelData.minValue) /
          (modelData.maxValue - modelData.minValue)) *
        100;
    }
  };

  render = ({ modelData }: { modelData: IModelData }) => {
    const DOMScaleMarkContainer = this.DOMRoot as HTMLDivElement;
    const DOMRoller = this.roller.DOMRoot as HTMLDivElement;

    if (!modelData.isVertical) {
      DOMScaleMarkContainer.setAttribute(
        "style",
        `left:calc(${this.shiftLeft}% - ${
          DOMScaleMarkContainer.offsetWidth / 2
        }px); top:${DOMRoller.offsetHeight}px`
      );
    } else {
      DOMScaleMarkContainer.setAttribute(
        "style",
        `bottom:calc(${this.shiftLeft}% - ${
          DOMScaleMarkContainer.offsetHeight / 2
        }px); left:${DOMRoller.offsetWidth}px `
      );
    }
  };

  loadContent = () => {
    const DOMScaleMarkValue = this.DOMRoot?.querySelector(".scale-mark__value");
    if (DOMScaleMarkValue)
      this.clickHandler.addEvent(DOMScaleMarkValue as HTMLDivElement);
  };
}

export default ScaleMarker;
