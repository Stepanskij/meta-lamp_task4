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
    DOMSliderRoller: HTMLDivElement,
    index: number
  ): HTMLDivElement[] | undefined => {
    const DOMHandleBody = document.createElement("div");
    const DOMHandleView = document.createElement("div");
    const DOMHandleValue = document.createElement("div");
    const DOMHandleValueText = document.createElement("div");
    DOMHandleBody.className = "range-slider__handle-body";
    DOMHandleView.className = "range-slider__handle-view";
    DOMHandleValue.className = "range-slider__handle-value";
    DOMHandleValueText.className = "range-slider__handle-value-text";
    DOMHandleView.dataset.index = `${index}`;

    DOMSliderRoller.insertAdjacentElement("beforeend", DOMHandleBody);
    DOMHandleBody.insertAdjacentElement("beforeend", DOMHandleValue);
    DOMHandleValue.insertAdjacentElement("beforeend", DOMHandleValueText);
    DOMHandleBody.insertAdjacentElement("beforeend", DOMHandleView);

    return [DOMHandleBody, DOMHandleView, DOMHandleValue, DOMHandleValueText];
  };

  //Отрисовка элементов View по данным Model.
  renderView = (DOMsOfSlider: IDOMsOfSlider, modelData: IModelData): void => {
    //Постановка рычажков на своё место по шагу(step).
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

      modelData.handles?.forEach((handleObj, index) => {
        if (DOMsOfSlider.DOMSliderHandles) {
          DOMsOfSlider.DOMSliderHandles[
            index
          ][3].innerHTML = `${handleObj.value}`;
        }
      });
    });
  };

  subscriptionHandleEvent = (
    DOMSliderHandle: HTMLDivElement[],
    DOMSliderRoller: HTMLDivElement,
    modelData: IModelData
  ): void => {
    const handlerDragAndDrop: HandlerDragAndDrop = new HandlerDragAndDrop(
      DOMSliderHandle,
      DOMSliderRoller,
      modelData
    );

    handlerDragAndDrop.addEvent();
  };
}

export default View;
