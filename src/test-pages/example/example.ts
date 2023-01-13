import "./example.scss";

import IDOMsOfInputs from "./IDOMsOfInputs";
import IUserModelData from "rangeSlider/Data/IUserModelData";

import Controller from "rangeSlider/Controller/Controller";
import inputsHandle from "./inputsHandle";

const userSliderData: IUserModelData = {
  maxValue: 100,
  minValue: -100,
  stepSize: 5,
  numberGaps: 3,
  isVertical: true,
  handlesCanPushed: true,
  handles: [-12, 30],
};

const DOMTestSlider1: HTMLDivElement | null =
  document.querySelector(".example__slider");
const slider1 = new Controller(
  DOMTestSlider1 as HTMLDivElement,
  userSliderData
);

const DOMsInputs: IDOMsOfInputs = {};
//Поиск всех Input-ов.
{
  DOMsInputs.InputIsVertical = document.querySelector(
    ".example__input-vertical"
  ) as HTMLInputElement;
  DOMsInputs.InputHandlesCanPushed = document.querySelector(
    ".example__input-handles-pushed"
  ) as HTMLInputElement;
  //
  DOMsInputs.InputNumberRounding = document.querySelector(
    ".example__input-number-rounding"
  ) as HTMLInputElement;
  DOMsInputs.InputMaxValue = document.querySelector(
    ".example__input-max-value"
  ) as HTMLInputElement;
  DOMsInputs.InputMinValue = document.querySelector(
    ".example__input-min-value"
  ) as HTMLInputElement;
  DOMsInputs.InputStepSize = document.querySelector(
    ".example__input-step-size"
  ) as HTMLInputElement;
  //
  DOMsInputs.InputsHandles = document.querySelector(
    ".example__input-handles"
  ) as HTMLInputElement;
}
const handleOfInputs = new inputsHandle(slider1, DOMsInputs);
//

export {};
