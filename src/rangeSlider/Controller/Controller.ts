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
    this.DOMsSlider = this.view.createHTMLelements(this.DOMDiv);
    if (this.DOMsSlider.DOMSliderHandle)
      this.view.subscriptionHandleEvent(
        this.DOMsSlider.DOMSliderHandle,
        this.DOMsSlider.DOMRangeSlider,
        this.model.getModelData()
      );
  };
}

export default Controller;
