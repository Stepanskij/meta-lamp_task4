import View from "../View";
import DragAndDropHandler from "../Handlers/DragAndDropHandler";
import Roller from "./Roller";

import IModelData from "rangeSlider/Data/IModelData";
import { IViewPart } from "./IViewPart";

class Handle implements IViewPart {
  view: View;
  DOMRoot: HTMLDivElement | undefined;
  private id: number;
  private roller: Roller;
  private shiftLeft: number = 0;

  public DnDHandler: DragAndDropHandler;

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
    this.DnDHandler = new DragAndDropHandler({
      view: this.view,
      handlePart: this,
      roller: this.roller,
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
    const roller = this.roller.DOMRoot as HTMLDivElement;

    if (modelData.handles && modelData.maxSteps) {
      this.shiftLeft =
        ((modelData.handles[this.id].step as number) / modelData.maxSteps) *
        100;
    }
  };

  render = ({ modelData }: { modelData: IModelData }) => {
    const DOMHandle = this.DOMRoot as HTMLDivElement;
    const DOMHandleTooltip = this.DOMRoot?.querySelector(
      ".handle__tooltip"
    ) as HTMLDivElement;
    const DOMRoller = this.roller.DOMRoot as HTMLDivElement;

    if (modelData.handles) {
      DOMHandleTooltip.innerHTML = `${
        modelData.handles[this.id].value as number
      }`;

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

      DOMHandleTooltip.innerHTML = `${
        modelData.handles[this.id].value as number
      }`;
    }
  };

  loadContent = () => {
    this.DnDHandler.addEvent(this.DOMRoot as HTMLDivElement);
  };
}

export default Handle;
