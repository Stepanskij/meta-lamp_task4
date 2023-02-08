import View from "../View";
import DragAndDropHandler from "../Handlers/DragAndDropHandler";
import Roller from "./Roller";

import IModelData from "rangeSlider/Data/IModelData";
import { IViewPart } from "./IViewPart";

class Handle implements IViewPart {
  view: View;
  DOMRoot: HTMLDivElement | undefined;
  private id: number;
  private rollerPart: Roller;
  private shiftLeft: number = 0;

  public DnDHandler: DragAndDropHandler;

  constructor({
    view,
    id,
    rollerPart,
  }: {
    view: View;
    id: number;
    rollerPart: Roller;
  }) {
    this.view = view;
    this.id = id;
    this.rollerPart = rollerPart;
    this.DnDHandler = new DragAndDropHandler({
      view: this.view,
      handlePart: this,
      rollerPart: this.rollerPart,
    });
  }

  build = ({ DOMContainer }: { DOMContainer: HTMLDivElement }) => {
    const DOMHandleContainer = document.createElement("div");
    DOMHandleContainer.className = "handle";
    DOMHandleContainer.dataset.id = `${this.id}`;

    const DOMHandleValue = document.createElement("div");
    DOMHandleValue.className = "handle__tooltip";
    //
    DOMContainer.insertAdjacentElement("beforeend", DOMHandleContainer);
    DOMHandleContainer.insertAdjacentElement("beforeend", DOMHandleValue);
    //
    this.DOMRoot = DOMHandleContainer;
  };

  calculateStyles = ({ modelData }: { modelData: IModelData }) => {
    const rollerPart = this.rollerPart.DOMRoot as HTMLDivElement;

    if (
      modelData.handles &&
      modelData.maxShiftSteps &&
      modelData.maxValue !== undefined &&
      modelData.minValue !== undefined
    ) {
      const rollerLength = modelData.maxValue - modelData.minValue;
      const handleShift = modelData.handles[this.id] - modelData.minValue;

      this.shiftLeft = Math.round((handleShift * 100) / rollerLength);
    }
  };

  render = ({ modelData }: { modelData: IModelData }) => {
    const DOMHandle = this.DOMRoot as HTMLDivElement;
    const DOMHandleTooltip = this.DOMRoot?.querySelector(
      ".handle__tooltip"
    ) as HTMLDivElement;
    const DOMRoller = this.rollerPart.DOMRoot as HTMLDivElement;

    if (modelData.handles) {
      DOMHandleTooltip.innerHTML = `${modelData.handles[this.id]}`;

      if (!modelData.isVertical) {
        DOMHandle.setAttribute(
          "style",
          `left:calc(${this.shiftLeft}% - ${
            DOMHandle.offsetWidth / 2
          }px); top:${
            DOMRoller.offsetHeight / 2 - DOMHandle.offsetHeight / 2
          }px`
        );
        //
        DOMHandleTooltip.setAttribute(
          "style",
          `left:calc(50% - ${
            DOMHandleTooltip.offsetWidth / 2
          }px); top:calc(${-DOMHandleTooltip.offsetHeight}px)`
        );
      } else {
        DOMHandle.setAttribute(
          "style",
          `bottom:calc(${this.shiftLeft}% - ${
            DOMHandle.offsetHeight / 2
          }px); left:${DOMRoller.offsetWidth / 2 - DOMHandle.offsetWidth / 2}px`
        );
        //
        DOMHandleTooltip.setAttribute(
          "style",
          `left:${-DOMHandleTooltip.offsetWidth}px; top:calc(50% - ${
            DOMHandleTooltip.offsetHeight / 2
          }px)`
        );
      }
    }
  };

  loadContent = () => {
    this.DnDHandler.addEvent(this.DOMRoot as HTMLDivElement);
  };
}

export default Handle;
