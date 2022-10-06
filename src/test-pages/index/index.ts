import "./index.scss";

import Controller from "rangeSlider/Controller/Controller";

const DOMTestSlider1: HTMLDivElement | null =
  document.querySelector(".test-div-1");
const DOMTestSlider2: HTMLDivElement | null =
  document.querySelector(".test-div-2");

const controller1 = new Controller(DOMTestSlider1 as HTMLDivElement);
const controller2 = new Controller(DOMTestSlider2 as HTMLDivElement);

controller1.makeSlider();
controller2.makeSlider();
export {};
