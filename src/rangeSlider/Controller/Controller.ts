import Model from "rangeSlider/Model/Model";
import View from "rangeSlider/View/View";
import EventArgs from "rangeSlider/Event/EventArgs";

import IUserModelData from "rangeSlider/Data/IUserModelData";

class Controller {
  public model: Model;
  public view: View;

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
    this.view.render(new EventArgs({ ...this.model.data }));
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
    this.model.customEvents.onUpdate.subscribe(this.view.render);
  };

  addHandle = (valueHandle?: number) => {
    this.model.addHandle(valueHandle);
    this.model.customEvents.onUpdate.dispatch(
      new EventArgs({ ...this.model.data })
    );
  };

  removeHandle = () => {
    this.model.removeHandle();
    this.model.customEvents.onUpdate.dispatch();
    this.view.render(new EventArgs({ ...this.model.data }));
  };
}

export default Controller;
