//импорт классов
import Model from "rangeSlider/Model/Model";
import View from "rangeSlider/View/View";
//импорт интерфейсов
import IDOMsOfSlider from "rangeSlider/Data/IDOMsOfSlider";
import IModelData from "rangeSlider/Data/IModelData";

class Controller {
  model: Model;
  view: View;
  DOMsSlider?: IDOMsOfSlider;

  constructor(public DOMDiv: HTMLDivElement) {
    this.DOMDiv = DOMDiv;
    this.DOMsSlider;

    this.model = new Model();
    this.view = new View();
  }

  makeSlider = (): void => {
    let baseElements = this.view.createBaseElements(this.DOMDiv);
    let handlesElements = this.view.createHandlesElements(baseElements[0], this.model.modelData)

    console.log(handlesElements)
  };
}

export default Controller;
