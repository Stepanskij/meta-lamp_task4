//импорт классов
import HandlerDragAndDrop from "./sliderParts/handlerHandle";
//импорт интерфейсов
import IDOMsOfSlider from "rangeSlider/Data/IDOMsOfSlider";
import IModelData from "rangeSlider/Data/IModelData";

class View {
  constructor() {}

  createHTMLelements = (DOMDiv: HTMLDivElement): IDOMsOfSlider => {
    const DOMRangeSlider = document.createElement("div");
    const DOMSliderRoller = document.createElement("div");
    const DOMSliderHandle = document.createElement("button");
    DOMRangeSlider.className = "range-slider";
    DOMSliderRoller.className = "range-slider__slider-roller";
    DOMSliderHandle.className = "range-slider__slider-handle";

    DOMDiv.insertAdjacentElement("beforeend", DOMRangeSlider);
    DOMRangeSlider.insertAdjacentElement("beforeend", DOMSliderRoller);
    DOMSliderRoller.insertAdjacentElement("beforeend", DOMSliderHandle);

    return {
      DOMRangeSlider: DOMRangeSlider,
      DOMSliderRoller: DOMSliderRoller,
      DOMSliderHandle: DOMSliderHandle,
    };
  };

  subscriptionHandleEvent = (
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
  };
}

export default View;
