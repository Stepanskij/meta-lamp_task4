import Model from "rangeSlider/Model/Model";
import View from "rangeSlider/View/View";
import EventArgs from "rangeSlider/Event/EventArgs";

import IModelData from "rangeSlider/Data/IModelData";
import IUserModelData from "rangeSlider/Data/IUserModelData";

class Controller {
  private model: Model;
  private view: View;

  constructor(
    private DOMDiv: HTMLDivElement,
    private userModelData?: IUserModelData
  ) {
    this.DOMDiv = DOMDiv;
    if (userModelData) {
      this.model = new Model(userModelData);
    } else this.model = new Model();
    this.view = new View();

    this.loadContent();

    this.view.makeSlider(this.DOMDiv, { ...this.model.data });
    this.view.renderView(new EventArgs({ ...this.model.data }));
  }

  loadContent = (): void => {
    this.model.loadContent();
    this.view.customEvents.onMouseMove.subscribe(this.model.DaDModelUpdate);
    this.view.customEvents.onMouseClick.subscribe(this.model.markerModelUpdate);
    this.model.customEvents.onUpdate.subscribe(this.view.renderView);
  };

  addHandle = (valueHandle?: number): void => {
    this.model.addHandle(valueHandle);
    this.remakeSlider();
  };
  removeHandle = (): void => {
    this.model.removeHandle();
    this.remakeSlider();
  };
  //Получить значение рычажка(по его номеру в массиве).
  getHandleValue = (numberHandle: number): number | undefined => {
    if (
      this.model.data.handles &&
      numberHandle < this.model.data.handles.length &&
      numberHandle >= 0
    )
      return this.model.data.handles[numberHandle].value;
  };
  //Установить новое значение рычажка(по его номеру в массиве).
  setHandleValue = (numberHandle: number, valueHandle: number): void => {
    if (
      this.model.data.handles &&
      numberHandle < this.model.data.handles.length &&
      numberHandle >= 0
    ) {
      this.model.data.handles[numberHandle].value = valueHandle;
      this.model.data.handles.forEach((handleObj, index) => {
        if (index > numberHandle) {
          if (handleObj.value < valueHandle) handleObj.value = valueHandle;
        }
        if (index < numberHandle) {
          if (handleObj.value > valueHandle) handleObj.value = valueHandle;
        }
      });
    }
    this.remakeSlider();
  };

  remakeSlider = (userModelData?: IUserModelData): void => {
    if (userModelData) {
      this.model.putUserData(userModelData);
    }
    this.view = new View();
    this.DOMDiv.innerHTML = "";
    this.loadContent();
    this.view.makeSlider(this.DOMDiv, { ...this.model.data });
    this.view.renderView(new EventArgs({ ...this.model.data }));
  };
}

export default Controller;
