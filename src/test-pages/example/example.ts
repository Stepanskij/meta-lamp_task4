import "./example.scss";

import IDOMsOfInputs from "./IDOMsOfInputs";

import Controller from "rangeSlider/Controller/Controller";
import IModelData from "rangeSlider/Data/IModelData";

const userSliderData: IModelData = {
  maxValue: 100,
  minValue: -100.78,
  stepSize: 5,
  scaleData: {
    numberGaps: 3,
  },
  isVertical: true,
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
  DOMsInputs.InputMaxSteps = document.querySelector(
    ".example__input-max-steps"
  ) as HTMLInputElement;
  DOMsInputs.InputNumberAutoMark = document.querySelector(
    ".example__input-number-auto-mark"
  ) as HTMLInputElement;
  //
  DOMsInputs.InputsHandles = document.querySelector(
    ".example__input-handles"
  ) as HTMLInputElement;
  DOMsInputs.InputsCustomMarkArray = document.querySelector(
    ".example__input-custom-mark-array"
  ) as HTMLInputElement;
  DOMsInputs.InputsBordersFillStrips = document.querySelector(
    ".example__input-borders-fill-strips"
  ) as HTMLInputElement;
}
//

export {};
