import "./index.scss";

import Controller from "rangeSlider/Controller/Controller";

const DOMTestSlider: HTMLDivElement | null =
  document.querySelector(".test-div");

const controller = new Controller(DOMTestSlider as HTMLDivElement);

controller.makeSlider();

export {};
