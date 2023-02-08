import "./example.scss";

import IUserModelData from "rangeSlider/Data/IUserModelData";

import Controller from "rangeSlider/Controller/Controller";

const userSliderData: IUserModelData = {
  maxValue: 100,
  minValue: -100,
  shiftStepSize: 5,
  numberGaps: 3,
  handlesCanPushed: true,
  isVertical: true,
  idsFillStrip: [0],
  handles: [-90,20],
};

const DOMTestSlider1: HTMLDivElement | null =
  document.querySelector(".example__slider");

const slider1 = new Controller(
  DOMTestSlider1 as HTMLDivElement,
  userSliderData
);

const inputsContainer = document.querySelector(".example__inputs2");
const inputs = slider1.model.data.handles?.map((handleValue, i) => {
  const input = document.createElement("input");
  input.type = "number";
  input.max = String(slider1.model.data.maxValue);
  input.min = String(slider1.model.data.minValue);
  input.value = String(handleValue);
  input.classList.add("example__input");

  inputsContainer?.append(input);

  slider1.model.customEvents.onUpdate.subscribe((e) => {
    if (e?.data.handles) {
      input.value = String(e?.data.handles[i]);
    }
  });

  input.addEventListener("change", () => {
    let inputValue = Number(input.value);
    slider1.model.updateHandle({ handleId: i, relativeValue: inputValue });
    // slider1.view.customEvents.onHandleMove.dispatch(/* значение ползунка в нужном формате */);
  });
});

/* 
const DOMsInputs: IDOMsOfInputs = {};
//

//Поиск всех Input-ов.
{
  DOMsInputs.InputIsVertical = document.querySelector(
    ".example__input-vertical"
  ) as HTMLInputElement;
  if (userSliderData.isVertical !== undefined)
    DOMsInputs.InputIsVertical.checked = userSliderData.isVertical;
  else DOMsInputs.InputIsVertical.checked = false;
  //
  DOMsInputs.InputHandlesCanPushed = document.querySelector(
    ".example__input-handles-pushed"
  ) as HTMLInputElement;
  if (userSliderData.handlesCanPushed !== undefined)
    DOMsInputs.InputHandlesCanPushed.checked = userSliderData.handlesCanPushed;
  else DOMsInputs.InputHandlesCanPushed.checked = false;
  //
  DOMsInputs.InputNumberRounding = document.querySelector(
    ".example__input-number-rounding"
  ) as HTMLInputElement;
  //
  DOMsInputs.InputMaxValue = document.querySelector(
    ".example__input-max-value"
  ) as HTMLInputElement;
  //
  DOMsInputs.InputMinValue = document.querySelector(
    ".example__input-min-value"
  ) as HTMLInputElement;
  //
  DOMsInputs.InputStepSize = document.querySelector(
    ".example__input-step-size"
  ) as HTMLInputElement;
  //
  DOMsInputs.InputsHandles = document.querySelector(
    ".example__input-handles"
  ) as HTMLInputElement;
  const numberHandle = document.querySelectorAll(
    ".range-slider__handle-view"
  ).length;
  DOMsInputs.InputsHandles.value = String(numberHandle);
}
const handleOfInputs = new inputsHandle(slider1, DOMsInputs);
//
 */
export {};
