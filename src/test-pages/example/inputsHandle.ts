import IModelData from "rangeSlider/Data/IModelData";
import IDOMsOfInputs from "./IDOMsOfInputs";

import Controller from "rangeSlider/Controller/Controller";

class inputsHandle {
  private oldStepSize: number;
  constructor(
    public sliderController: Controller,
    public DOMsOfInputs: IDOMsOfInputs
  ) {
    this.oldStepSize = Number(
      (DOMsOfInputs.InputsHandles as HTMLInputElement).value
    );
    this.addAllInputsEvent(DOMsOfInputs);
  }

  private addEventToInput = (inputElement: HTMLInputElement, func: any) => {
    inputElement?.addEventListener("change", func);
  };

  /* handleInputChange = ( e ) => {
    const currentModelData = this.sliderController.model;
    const value = e.target.value;
    this.sliderController.model.customEvents.onUpdate.dispatch({});
  }; */

  addAllInputsEvent = (DOMsOfInputs: IDOMsOfInputs) => {
    if (DOMsOfInputs.InputHandlesCanPushed) {
      //Интпут толкания рычажков.
      this.addEventToInput(DOMsOfInputs.InputHandlesCanPushed, () => {
        const handlesCanPushed = DOMsOfInputs.InputHandlesCanPushed?.checked;

        /* this.sliderController.remakeSlider({
          handlesCanPushed: handlesCanPushed,
        }); */
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
    //Интпут максимального значения.
    if (DOMsOfInputs.InputMaxValue)
      this.addEventToInput(DOMsOfInputs.InputMaxValue, () => {
        const maxValue = Number(DOMsOfInputs.InputMaxValue?.value);
        this.sliderController.remakeSlider({
          maxValue: maxValue,
        });
      });
    //Интпут минимального значения.
    if (DOMsOfInputs.InputMinValue)
      this.addEventToInput(DOMsOfInputs.InputMinValue, () => {
        const minValue = Number(DOMsOfInputs.InputMinValue?.value);
        this.sliderController.remakeSlider({
          minValue: minValue,
        });
      });
    //Интпут размера шага.
    if (DOMsOfInputs.InputStepSize)
      this.addEventToInput(DOMsOfInputs.InputStepSize, () => {
        const stepSize = Number(DOMsOfInputs.InputStepSize?.value);
        this.sliderController.remakeSlider({
          stepSize: stepSize,
        });
      });
    //Интпут размера шага.
    if (DOMsOfInputs.InputsHandles)
      this.addEventToInput(DOMsOfInputs.InputsHandles, () => {
        const newStepSize = Number(DOMsOfInputs.InputsHandles?.value);
        if (newStepSize > this.oldStepSize) {
          this.sliderController.addHandle();
          this.oldStepSize = newStepSize;
        }
        if (newStepSize < this.oldStepSize) {
          this.sliderController.removeHandle();
          this.oldStepSize = newStepSize;
        }
        this.sliderController.remakeSlider();
      });
  };
}

export default inputsHandle;
