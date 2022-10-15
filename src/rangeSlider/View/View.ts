//импорт классов
import HandlerDragAndDrop from "./sliderParts/handlerHandle";
//импорт интерфейсов
import IDOMsOfSlider from "rangeSlider/Data/IDOMsOfSlider";
import IModelData from "rangeSlider/Data/IModelData";
import IHandles from "rangeSlider/Data/IHandles";

class View {
  constructor() {}

  //Создание HTML-элементов, что не могут измениться.
  createBaseElements = (DOMDiv: HTMLDivElement): HTMLDivElement[] => {
    const DOMRangeSlider = document.createElement("div");
    const DOMSliderRoller = document.createElement("div");
    DOMRangeSlider.className = "range-slider";
    DOMSliderRoller.className = "range-slider__slider-roller";
    DOMDiv.insertAdjacentElement("beforeend", DOMRangeSlider);
    DOMRangeSlider.insertAdjacentElement("beforeend", DOMSliderRoller);

    return [DOMRangeSlider, DOMSliderRoller];
  };

  //Создание рычажков (HTML-элементов)
  createHandleElement = (
    DOMSliderRoller: HTMLDivElement
  ): HTMLDivElement[] | undefined => {
    const DOMHandleBody = document.createElement("div");
    const DOMHandleView = document.createElement("div");
    DOMHandleBody.className = "range-slider__handle-body";
    DOMHandleView.className = "range-slider__handle-view";

    DOMSliderRoller.insertAdjacentElement("beforeend", DOMHandleBody);
    DOMHandleBody.insertAdjacentElement("beforeend", DOMHandleView);

    return [DOMHandleBody, DOMHandleView];
  };

  //Отрисовка элементов View по данным Model.
  renderView = (DOMsOfSlider: IDOMsOfSlider, modelData: IModelData): void => {

    //Постановка рычажка на своё место по шагу(step).
    modelData.handles?.forEach((handleObj, index) => {
      if (
        handleObj.step !== undefined &&
        modelData.maxSteps !== undefined &&
        DOMsOfSlider.DOMSliderHandles !== undefined
      ) {
        const styleLeft = (handleObj.step / modelData.maxSteps) * 100;
        DOMsOfSlider.DOMSliderHandles[index][0].setAttribute(
          "style",
          `left:${styleLeft}%`
        );
      }
    });
  };

  /* subscriptionHandleEvent = (
    DOMSliderHandle: HTMLButtonElement,
    DOMRangeSlider: HTMLDivElement,
    modelData: IModelData
  ): void => {
    const handlerDragAndDrop: HandlerDragAndDrop = new HandlerDragAndDrop(
      DOMSliderHandle,
      DOMRangeSlider,
      modelData
    );

    handlerDragAndDrop.addEvent();
  }; */
}

export default View;
