//импорт классов
import Model from "rangeSlider/Model/Model";
import View from "rangeSlider/View/View";
//импорт интерфейсов
import IDOMsOfSlider from "rangeSlider/Data/IDOMsOfSlider";
import IModelData from "rangeSlider/Data/IModelData";
import IDOMsSliderHandle from "rangeSlider/Data/DOMsData/IDOMsSliderHandle";
import IDOMsScaleMark from "rangeSlider/Data/DOMsData/IDOMsScaleMark";

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
    if (userModelData) {
      this.model = new Model(userModelData);
    } else this.model = new Model();
    this.view = new View();

    this.modelData = this.model.getModelData();
    this.makeSlider();
    this.view.renderView(this.DOMsSlider, this.modelData);
  }

  makeSlider = (): void => {
    let baseElements = this.view.createBaseElements(this.DOMDiv); //Создаёт базовые элементы слайдера.
    //Запоминаются в DOMsSlider базовые элементы слайдера.
    this.DOMsSlider.DOMRangeSlider = baseElements[0];
    this.DOMsSlider.DOMSliderRoller = baseElements[1];
    this.DOMsSlider.DOMScaleContainer = baseElements[2];
    //Создаются элементы рычажков слайдера.
    const DOMsSliderHandles = this.modelData.handles?.map(
      (handleObj, index) => {
        return this.view.createHandleElement(
          this.DOMsSlider.DOMSliderRoller as HTMLDivElement,
          index
        );
      }
    );
    //Запоминаются в DOMsSlider массив DOM-объектов рычажков.
    this.DOMsSlider.DOMsSliderHandles = DOMsSliderHandles?.map(
      (handleDOMs): IDOMsSliderHandle => {
        return {
          DOMHandleContainer: handleDOMs[0],
          DOMHandleView: handleDOMs[1],
          DOMHandleValue: handleDOMs[2],
          DOMHandleValueText: handleDOMs[3],
        };
      }
    );
    //Подписывает каждый рычажок на событие DragAndDrop.
    this.DOMsSlider.DOMsSliderHandles?.forEach((DOMsHandleObj) => {
      if (this.DOMsSlider.DOMSliderRoller)
        this.view.subscriptionHandleEvent(
          DOMsHandleObj,
          this.DOMsSlider,
          this.modelData
        );
    });
    //Создаются элементы меток масштаба слайдера.
    const DOMsScaleMarks = this.modelData.scaleData?.markArray?.map(() => {
      return this.view.createScaleMarker(this.DOMsSlider);
    });
    //Запоминаются в DOMsSlider массив DOM-объектов меток масштаба.
    this.DOMsSlider.DOMsScaleMarkers = DOMsScaleMarks?.map(
      (scaleMarkDOMs): IDOMsScaleMark => {
        return {
          DOMScaleMarkContainer: scaleMarkDOMs[0],
          DOMScaleMarkSeparator: scaleMarkDOMs[1],
          DOMScaleMarkValue: scaleMarkDOMs[2],
          DOMScaleMarkValueText: scaleMarkDOMs[3],
        };
      }
    );
  };
}

export default Controller;
