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

  remakeSlider = (userModelData?: IUserModelData): void => {
    if (userModelData) {
      this.model = new Model(userModelData);
    } else this.model = new Model();
    this.view = new View();
    this.DOMDiv.innerHTML = "";
    this.loadContent();
    this.view.makeSlider(this.DOMDiv, { ...this.model.data });
    this.view.renderView(new EventArgs({ ...this.model.data }));
  };
}

export default Controller;
