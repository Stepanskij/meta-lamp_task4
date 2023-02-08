import View from "../View";
import FillStripHandler from "../Handlers/FillStripHandler";
import Roller from "./Roller";

import IModelData from "rangeSlider/Data/IModelData";
import { IViewPart } from "./IViewPart";

class FillStrip implements IViewPart {
  view: View;
  DOMRoot: HTMLDivElement | undefined;
  roller: Roller;
  private id: number;
  private styleLeft: number = 0;
  private styleWidth: number = 100;
  fillStripHandler: FillStripHandler;

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
    this.fillStripHandler = new FillStripHandler({
      view,
      rollerPart: this.roller,
    });
  }

  build = ({ DOMContainer }: { DOMContainer: HTMLDivElement }) => {
    const DOMFillStrip = document.createElement("div");
    DOMFillStrip.className = "fill-strip";
    DOMFillStrip.dataset.id = `${this.id}`;
    //
    DOMContainer.insertAdjacentElement("beforeend", DOMFillStrip);
    //
    this.DOMRoot = DOMFillStrip;
  };

  calculateStyles = ({ modelData }: { modelData: IModelData }) => {
    let styleLeftBorder = 0;
    let styleRightBorder = 100;

    //
    if (
      modelData.handles &&
      modelData.maxShiftSteps &&
      modelData.maxValue !== undefined &&
      modelData.minValue !== undefined
    ) {
      const rollerLength = modelData.maxValue - modelData.minValue;

      if (this.id > 0 && modelData.handles[this.id - 1] !== undefined) {
        styleLeftBorder = Math.round(
          ((modelData.handles[this.id - 1] - modelData.minValue) * 100) /
            rollerLength
        );
      }
      if (
        this.id < modelData.handles.length &&
        modelData.handles[this.id ] !== undefined
      ) {
        styleRightBorder = Math.round(
          ((modelData.handles[this.id] - modelData.minValue) * 100) /
            rollerLength
        );
      }
    }
    //
    this.styleLeft = styleLeftBorder;
    this.styleWidth = styleRightBorder - styleLeftBorder;
  };

  render = ({ modelData }: { modelData: IModelData }) => {
    const DOMRoller = this.roller.DOMRoot as HTMLDivElement;

    const clientTop = DOMRoller.clientTop;
    const clientLeft = DOMRoller.clientLeft;

    if (this.DOMRoot)
      if (!modelData.isVertical) {
        this.DOMRoot.setAttribute(
          "style",
          `width:calc(${this.styleWidth}% - ${clientLeft * 2}px); left:calc(${
            this.styleLeft
          }% + ${clientLeft}px); height:${
            DOMRoller.offsetHeight - clientTop * 2
          }px; top:${clientTop}px`
        );
      } else {
        this.DOMRoot.setAttribute(
          "style",
          `height:calc(${this.styleWidth}% - ${clientTop * 2}px); bottom:calc(${
            this.styleLeft
          }% + ${clientTop}px); width:${
            DOMRoller.offsetWidth - clientLeft * 2
          }px; left:${clientLeft}px`
        );
      }
  };

  loadContent = () => {
    if (this.DOMRoot) this.fillStripHandler.addEvent(this.DOMRoot);
  };
}

export default FillStrip;
