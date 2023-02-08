import IModelData from "rangeSlider/Data/IModelData";
import IDOMsOfInputs from "./IDOMsOfInputs";

import Controller from "rangeSlider/Controller/Controller";

class inputsHandle {
  constructor(
    public sliderController: Controller,
    public DOMsOfInputs: IDOMsOfInputs
  ) {}
}

export default inputsHandle;
