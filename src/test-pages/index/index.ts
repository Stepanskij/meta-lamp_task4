import "./index.scss";

import Controller from "rangeSlider/Controller/Controller";
import IModelData from "rangeSlider/Data/IModelData";

const DOMTestSlider1: HTMLDivElement | null =
  document.querySelector(".test-div-1");

const userModelData: IModelData = {
  maxValue: 200,
  minValue: -100,
  stepSize: 12,
  handles: [{ value: -10 }, { value: 30 }],
};

const controller1 = new Controller(
  DOMTestSlider1 as HTMLDivElement,
  userModelData
);

export {};
