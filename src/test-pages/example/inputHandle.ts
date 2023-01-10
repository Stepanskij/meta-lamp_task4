import IModelData from "rangeSlider/Data/IModelData";
import Controller from "rangeSlider/Controller/Controller";

class inputHandle {
  modelData: IModelData = {};
  constructor(public sliderController: Controller) {}

  addEventToInput = (inputElement: HTMLInputElement) => {
    inputElement?.addEventListener("change", () => {
      this.modelData.isVertical = inputElement?.checked;

      /* this.sliderController.remakeSlider(this.modelData); */
    });
  };
}

export default inputHandle;
