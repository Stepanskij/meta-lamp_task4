import "./index.scss";

import Controller from "rangeSlider/Controller/Controller";

const DOMTestSlider1: HTMLDivElement | null =
  document.querySelector(".test-div-1");

const controller1 = new Controller(DOMTestSlider1 as HTMLDivElement);
controller1.makeSlider()

export {};
