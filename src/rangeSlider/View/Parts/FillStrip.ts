import View from "../View";
import FillStripHandler from "../Handlers/FillStripHandler";
import Roller from "./Roller";

import IModelData from "rangeSlider/Data/IModelData";
import { IViewPart } from "./IViewPart";

class FillStrip implements IViewPart {
  view: View;
  DOMRoot: HTMLDivElement | undefined;
  sliderRoller: Roller;
  private id: number;
  private styleLeft: number = 0;
  private styleWidth: number = 100;
  fillStripHandler: FillStripHandler;

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
    this.fillStripHandler = new FillStripHandler({
      view,
      rollerPart: this.sliderRoller,
    });
  }

  build = ({ DOMContainer }: { DOMContainer: HTMLDivElement }) => {
    const DOMFillStrip = document.createElement("div");
    DOMFillStrip.className = "range-slider__flip-scrip";
    //
    DOMContainer.insertAdjacentElement("beforeend", DOMFillStrip);
    //
    this.DOMRoot = DOMFillStrip;
  };

  calculateStyles = ({ modelData }: { modelData: IModelData }) => {
    let styleLeftBorder = 0;
    let styleRightBorder = 100;
    const idLeftHandle = this.id - 1;
    const idRightHandle = this.id;
    //
    if (modelData.handles && modelData.maxSteps) {
      if (idLeftHandle > 0) {
        styleLeftBorder =
          ((modelData.handles[this.id - 1].step as number) /
            modelData.maxSteps) *
          100;
      }
      if (idRightHandle < modelData.handles.length) {
        styleRightBorder =
          ((modelData.handles[this.id].step as number) / modelData.maxSteps) *
          100;
      }
    }
    //

    this.styleLeft = styleLeftBorder;
    this.styleWidth = styleRightBorder - styleLeftBorder;
  };

  render = ({ modelData }: { modelData: IModelData }) => {
    if (this.DOMRoot)
      if (!modelData.isVertical) {
        this.DOMRoot.setAttribute(
          "style",
          `width:${this.styleWidth}%; left:${this.styleLeft}%`
        );
      } else {
        this.DOMRoot.setAttribute(
          "style",
          `height:${this.styleWidth}%; bottom:${this.styleLeft}%`
        );
      }
  };

  loadContent = () => {
    if (this.DOMRoot) this.fillStripHandler.addEvent(this.DOMRoot);
  };
}

export default FillStrip;
