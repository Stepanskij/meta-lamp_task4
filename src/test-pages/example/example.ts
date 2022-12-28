import "./example.scss";

import Controller from "rangeSlider/Controller/Controller";
import IModelData from "rangeSlider/Data/IModelData";

const DOMTestSlider1: HTMLDivElement | null =
  document.querySelector(".example__slider");

const userModelData: IModelData = {};

const controller1 = new Controller(
  DOMTestSlider1 as HTMLDivElement,
  userModelData
);

const inputVertical: HTMLInputElement | null = document.querySelector(
  ".example__input-vertical"
);

inputVertical?.addEventListener("change", () => {
  userModelData.isVertical = inputVertical?.checked;
  controller1.remakeSlider(userModelData);
});

export {};
