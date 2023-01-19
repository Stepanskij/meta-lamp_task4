import Event from "rangeSlider/Event/Event";
import EventArgs from "rangeSlider/Event/EventArgs";

import ScaleMarker from "./Parts/ScaleMarker";
import Roller from "./Parts/Roller";
import Handle from "./Parts/Handle";
import FillStrip from "./Parts/FillStrip";

import IModelData from "rangeSlider/Data/IModelData";
import IDaDHandlerArgsUpdate from "rangeSlider/Data/updateArgs/IDaDHandlerArgsUpdate";
import IRollerHandlerArgsUpdate from "rangeSlider/Data/updateArgs/IRollerHandlerArgsUpdate";
import IScaleMarkHandlerArgsUpdate from "rangeSlider/Data/updateArgs/IScaleMarkHandlerArgsUpdate";

import { IViewPart } from "./Parts/IViewPart";

class View {
  customEvents = {
    onHandleMove: new Event<IDaDHandlerArgsUpdate>(),
    onScaleClick: new Event<IScaleMarkHandlerArgsUpdate>(),
    onRollerClick: new Event<IRollerHandlerArgsUpdate>(),
  };

  public parts: IViewPart[] = [];
  DOMRoot: HTMLDivElement = document.createElement("div");

  constructor() {}

  loadContent = ({
    view,
    modelData,
  }: {
    view: View;
    modelData: IModelData;
  }) => {
    const roller = new Roller({ view });
    this.parts.push(roller);

    modelData.handles?.forEach((handleObj, id) => {
      const handle = new Handle({ view, id, sliderRoller: roller });
      this.parts.push(handle);
    });

    modelData.scaleData?.markArray?.forEach((handleObj, id) => {
      const scaleMarker = new ScaleMarker({ view, id });
      this.parts.push(scaleMarker);
    });

    modelData.idsFillStrip?.forEach((handleObj, id) => {
      const fillStrip = new FillStrip({ view, id, sliderRoller: roller });
      this.parts.push(fillStrip);
    });
  };

  build = ({ DOMContainer }: { DOMContainer: HTMLDivElement }) => {
    this.DOMRoot.className = "range-slider";
    DOMContainer.insertAdjacentElement("beforeend", this.DOMRoot);

    this.parts.forEach((part) => {
      part.build({ DOMContainer: this.DOMRoot });
      part.loadContent();
    });
  };

  calculateStyles = ({ modelData }: { modelData: IModelData }) => {
    this.parts.forEach((part) => {
      part.calculateStyles({ modelData });
    });
  };

  render = ({ modelData }: { modelData: IModelData }) => {
    this.DOMRoot.classList.toggle(
      "range-slider_vertical",
      modelData.isVertical
    );

    this.parts.forEach((part) => {
      part.render({ modelData });
    });
  };

  renderView = (modelData?: EventArgs<IModelData>) => {
    if (modelData) {
      const newModelData = { ...modelData.data };
      this.calculateStyles({ modelData: newModelData });
      this.render({ modelData: newModelData });
    }
  };
}

export default View;
