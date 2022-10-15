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

  constructor(
    private DOMDiv: HTMLDivElement,
    private userModelData?: IModelData
  ) {
    this.DOMDiv = DOMDiv;
    this.model = new Model(userModelData);
    this.view = new View();

    this.modelData = this.model.getModelData();
    this.makeSlider();

    this.view.renderView(this.DOMsSlider, this.modelData);
    //Вывод объектов модели и DOMs.
    console.log(
      "DOM-объекты                            ",
      this.DOMsSlider,
      "объект модели                          ",
      this.modelData
    );
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
  };
}

export default Controller;
