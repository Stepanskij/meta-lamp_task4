import Model from "rangeSlider/Model/Model";
import View from "rangeSlider/View/View";
import EventArgs from "rangeSlider/Event/EventArgs";

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
    this.view.build({ DOMContainer: this.DOMDiv });
    this.view.renderView(new EventArgs({ ...this.model.data }));
  }

  loadContent = () => {
    this.model.loadContent();
    this.view.loadContent({
      view: this.view,
      modelData: { ...this.model.data },
    });
    this.view.customEvents.onHandleMove.subscribe(this.model.DaDModelUpdate);
    this.view.customEvents.onScaleClick.subscribe(this.model.markerModelUpdate);
    this.view.customEvents.onRollerClick.subscribe(
      this.model.rollerModelUpdate
    );
    this.model.customEvents.onUpdate.subscribe(this.view.renderView);
  };

  addHandle = (valueHandle?: number) => {
    this.model.addHandle(valueHandle);
    this.remakeSlider();
  };

  removeHandle = () => {
    this.model.removeHandle();
    this.remakeSlider();
  };

  //Получить значение рычажка(по его номеру в массиве).
  getHandleValue = (numberHandle: number): number | undefined => {
    return this.model.getHandleValue(numberHandle);
  };

  //Установить новое значение рычажка(по его номеру в массиве).
  setHandleValue = (numberHandle: number, valueHandle: number) => {
    this.model.setHandleValue(numberHandle, valueHandle);
    this.remakeSlider();
  };

  remakeSlider = (userModelData?: IUserModelData) => {
    if (userModelData) {
      this.model.putUserData(userModelData);
    }

    this.DOMDiv.innerHTML = "";
    this.model.loadContent();
    /* this.view.data = {
      DOMsSliderHandles: [],
      DOMsScaleMarkers: [],
      DOMsFillStrips: [],
    }; */
    this.view.build({ DOMContainer: this.DOMDiv });
    this.view.renderView(new EventArgs({ ...this.model.data }));
  };
}

export default Controller;
