import View from "../View";
import DragAndDropHandler from "../Handlers/DragAndDropHandler";
import Roller from "./Roller";
import FillStripHandler from "../Handlers/FillStripHandler";

import IModelData from "rangeSlider/Data/IModelData";
import { IViewPart } from "./IViewPart";

class Handle implements IViewPart {
  view: View;
  DOMRoot: HTMLDivElement | undefined;
  private id: number;
  private sliderRoller: Roller;
  private shiftLeft: number = 0;
  fillStripHandler: FillStripHandler;

  public DnDHandler: DragAndDropHandler;

  constructor({
    view,
    id,
    sliderRoller,
  }: {
    view: View;
    id: number;
    sliderRoller: Roller;
  }) {
    this.view = view;
    this.id = id;
    this.sliderRoller = sliderRoller;
    this.DnDHandler = new DragAndDropHandler({
      view: this.view,
      handlePart: this,
      sliderRoller: this.sliderRoller,
    });
    this.fillStripHandler = new FillStripHandler({
      view,
      rollerPart: this.sliderRoller,
    });
  }

  build = ({ DOMContainer }: { DOMContainer: HTMLDivElement }) => {
    const DOMHandleContainer = document.createElement("div");
    DOMHandleContainer.className = "range-slider__handle-container";

    const DOMHandleView = document.createElement("div");
    DOMHandleView.className = "range-slider__handle-view";
    DOMHandleView.dataset.id = `${this.id}`;

    const DOMHandleValue = document.createElement("div");
    DOMHandleValue.className = "range-slider__handle-value";

    const DOMHandleValueText = document.createElement("div");
    DOMHandleValueText.className = "range-slider__handle-value-text";
    //
    DOMContainer.insertAdjacentElement("beforeend", DOMHandleContainer);
    DOMHandleContainer.insertAdjacentElement("beforeend", DOMHandleValue);
    DOMHandleContainer.insertAdjacentElement("beforeend", DOMHandleView);
    DOMHandleValue.insertAdjacentElement("beforeend", DOMHandleValueText);
    //
    this.DOMRoot = DOMHandleContainer;
  };

  calculateStyles = ({ modelData }: { modelData: IModelData }) => {
    if (modelData.handles && modelData.maxSteps) {
      this.shiftLeft =
        ((modelData.handles[this.id].step as number) / modelData.maxSteps) *
        100;
    }
  };

  render = ({ modelData }: { modelData: IModelData }) => {
    if (modelData.handles) {
      const handleContainer = this.DOMRoot;
      const handleValueText = this.DOMRoot?.querySelector(
        ".range-slider__handle-value-text"
      );

      if (!modelData.isVertical) {
        (handleContainer as HTMLDivElement).setAttribute(
          "style",
          `left:${this.shiftLeft}%`
        );
      } else {
        (handleContainer as HTMLDivElement).setAttribute(
          "style",
          `bottom:${this.shiftLeft}%`
        );
      }

      (handleValueText as HTMLDivElement).innerHTML = `${
        modelData.handles[this.id].value as number
      }`;
    }
  };

  loadContent = () => {
    const DOMHandleView = this.DOMRoot?.querySelector(
      ".range-slider__handle-view"
    );
    this.DnDHandler.addEvent(DOMHandleView as HTMLDivElement);
  };
}

export default Handle;
