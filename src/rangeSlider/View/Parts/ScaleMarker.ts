import IModelData from "rangeSlider/Data/IModelData";

import View from "../View";
import ScaleMarkHandler from "../Handlers/ScaleMarkHandler";
import { IViewPart } from "./IViewPart";

class ScaleMarker implements IViewPart {
  view: View;
  DOMRoot: HTMLDivElement | undefined;
  private id: number;
  private shiftLeft: number = 0;

  public value: number = 0;
  public clickHandler: ScaleMarkHandler;

  constructor({ view, id }: { view: View; id: number }) {
    this.view = view;
    this.id = id;
    this.clickHandler = new ScaleMarkHandler({
      view: this.view,
      scalePart: this,
    });
  }

  build = ({ DOMContainer }: { DOMContainer: HTMLDivElement }) => {
    const DOMScaleMarkContainer = document.createElement("div");
    DOMScaleMarkContainer.className = "range-slider__scale-mark-container";
    DOMScaleMarkContainer.dataset.id = `${this.id}`;

    const DOMScaleMarkSeparator = document.createElement("div");
    DOMScaleMarkSeparator.className = "range-slider__scale-mark-separator";

    const DOMScaleMarkValue = document.createElement("div");
    DOMScaleMarkValue.className = "range-slider__scale-mark-value";

    const DOMScaleMarkValueText = document.createElement("div");
    DOMScaleMarkValueText.className = "range-slider__scale-mark-value-text";
    //
    DOMContainer.insertAdjacentElement("beforeend", DOMScaleMarkContainer);
    DOMScaleMarkContainer.insertAdjacentElement(
      "beforeend",
      DOMScaleMarkSeparator
    );
    DOMScaleMarkContainer.insertAdjacentElement("beforeend", DOMScaleMarkValue);
    DOMScaleMarkValue.insertAdjacentElement("beforeend", DOMScaleMarkValueText);

    DOMContainer.insertAdjacentElement("beforeend", DOMScaleMarkContainer);
    //
    this.DOMRoot = DOMScaleMarkContainer;
  };

  calculateStyles = ({ modelData }: { modelData: IModelData }) => {
    if (modelData.scaleData && modelData.scaleData.markArray) {
      this.value = modelData.scaleData.markArray[this.id];
    }
    const DOMScaleMarkValueText = this.DOMRoot?.querySelector(
      ".range-slider__scale-mark-value-text"
    );
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
    if (!modelData.isVertical) {
      (this.DOMRoot as HTMLDivElement).setAttribute(
        "style",
        `left:${this.shiftLeft}%`
      );
    } else {
      (this.DOMRoot as HTMLDivElement).setAttribute(
        "style",
        `bottom:${this.shiftLeft}%`
      );
    }
  };

  loadContent = () => {
    const DOMScaleMarkValueText = this.DOMRoot?.querySelector(
      ".range-slider__scale-mark-value-text"
    );
    if (DOMScaleMarkValueText)
      this.clickHandler.addEvent(DOMScaleMarkValueText as HTMLDivElement);
  };
}

export default ScaleMarker;
