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
  createHandlesElements = (
    DOMSliderRoller: HTMLDivElement,
    modelData: IModelData
  ): HTMLDivElement[][] | undefined => {
    const DOMHandleBody = modelData.handles?.map((handleObj, index) => {
      const DOMHandleBody = document.createElement("div");
      const DOMHandleView = document.createElement("div");
      DOMHandleBody.className = "range-slider__handle-body";
      DOMHandleBody.dataset.index = `${index}`;
      DOMHandleView.className = "range-slider__handle-view";

      DOMSliderRoller.insertAdjacentElement("beforeend", DOMHandleBody);
      DOMHandleBody.insertAdjacentElement("beforeend", DOMHandleView);

      return [DOMHandleBody, DOMHandleView];
    });
    //Возвращается массив DOM-объектов рычажков
    return DOMHandleBody;
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
