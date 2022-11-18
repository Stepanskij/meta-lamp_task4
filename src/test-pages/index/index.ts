import "./index.scss";

import Controller from "rangeSlider/Controller/Controller";
import IModelData from "rangeSlider/Data/IModelData";

const DOMTestSlider1: HTMLDivElement | null =
  document.querySelector(".test-div-1");

const userModelData: IModelData = {
  stepSize: 3.017,
  maxValue: 40,
  minValue: -12,
  handles: [{ value: 0 }, { value: 20 }],
  scaleData: { customMarkArray: [10, -12], numberAutoMark: 3 },
  handlesCanPushed: true,
  bordersFillStrips: [1],
  isVertical: true,
};

const controller1 = new Controller(
  DOMTestSlider1 as HTMLDivElement,
  userModelData
);

export {};
