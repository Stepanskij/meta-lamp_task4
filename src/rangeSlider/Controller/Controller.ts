//импорт классов
import Model from "rangeSlider/Model/Model";
import View from "rangeSlider/View/View";
//импорт интерфейсов
import IDOMsOfSlider from "rangeSlider/Data/IDOMsOfSlider";
import IModelData from "rangeSlider/Data/IModelData";

class Controller {
  private model: Model;
  private view: View;
  private DOMsSlider: IDOMsOfSlider = {};
  modelData: IModelData;

  constructor(private DOMDiv: HTMLDivElement) {
    this.DOMDiv = DOMDiv;

    this.model = new Model();
    this.view = new View();

    this.modelData = this.model.getModelData();
  }

  makeSlider = (): void => {
    let baseElements = this.view.createBaseElements(this.DOMDiv);
    this.DOMsSlider.DOMRangeSlider = baseElements[0];
    this.DOMsSlider.DOMSliderRoller = baseElements[1];
    const DOMSliderHandles = this.modelData.handles?.map(() => {
      return this.view.createHandleElement(
        this.DOMsSlider.DOMSliderRoller as HTMLDivElement
      );
    });
    this.DOMsSlider.DOMSliderHandles = DOMSliderHandles as HTMLDivElement[][];

    console.log(this.DOMsSlider)
  };

  testFunction = (): void => {
    this.model.addHandle(12);
    this.model.addHandle(78);
    this.model.addHandle(111);
    this.model.addHandle(-9);
    this.model.addHandle(-67);
  };
}

export default Controller;
