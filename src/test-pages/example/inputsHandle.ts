import IModelData from "rangeSlider/Data/IModelData";
import IDOMsOfInputs from "./IDOMsOfInputs";

import Controller from "rangeSlider/Controller/Controller";

class inputsHandle {
  modelData: IModelData = {};
  constructor(
    public sliderController: Controller,
    public DOMsOfInputs: IDOMsOfInputs
  ) {
    this.addAllInputsEvent(DOMsOfInputs);
  }

  private addEventToInput = (inputElement: HTMLInputElement, func: any) => {
    inputElement?.addEventListener("change", func);
  };

  addAllInputsEvent = (DOMsOfInputs: IDOMsOfInputs): void => {
    if (DOMsOfInputs.InputHandlesCanPushed) {
      //Интпут толкания рычажков.
      this.addEventToInput(DOMsOfInputs.InputHandlesCanPushed, () => {
        const handlesCanPushed = DOMsOfInputs.InputHandlesCanPushed?.checked;
        this.sliderController.remakeSlider({
          handlesCanPushed: handlesCanPushed,
        });
      });
    }
    //Интпут вертикальности.
    if (DOMsOfInputs.InputIsVertical)
      this.addEventToInput(DOMsOfInputs.InputIsVertical, () => {
        const isVertical = DOMsOfInputs.InputIsVertical?.checked;
        this.sliderController.remakeSlider({
          isVertical: isVertical,
        });
      });
    //Интпут округления чисел.
    if (DOMsOfInputs.InputNumberRounding)
      this.addEventToInput(DOMsOfInputs.InputNumberRounding, () => {
        const numberRounding = Number(DOMsOfInputs.InputNumberRounding?.value);
        this.sliderController.remakeSlider({
          numberRounding: numberRounding,
        });
      });
  };
}

export default inputsHandle;
