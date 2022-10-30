import "./index.scss";

import Controller from "rangeSlider/Controller/Controller";
import IModelData from "rangeSlider/Data/IModelData";

const DOMTestSlider1: HTMLDivElement | null =
  document.querySelector(".test-div-1");

const userModelData: IModelData = {
  stepSize: 3,
  maxValue: 40,
  scaleData: { customMarkArray: [], numberAutoMark: 3 },
};

const controller1 = new Controller(
  DOMTestSlider1 as HTMLDivElement,
  userModelData
);

export {};
