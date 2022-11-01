//импорт классов
import HandlerDragAndDrop from "./sliderParts/handlerDragAndDrop";
//импорт интерфейсов
import IDOMsOfSlider from "rangeSlider/Data/IDOMsOfSlider";
import IModelData from "rangeSlider/Data/IModelData";
import IDOMsSliderHandles from "rangeSlider/Data/DOMsData/IDOMsSliderHandle";

class View {
  constructor() {}

  //Создание HTML-элементов, что не могут измениться.
  createBaseElements = (DOMDiv: HTMLDivElement): HTMLDivElement[] => {
    const DOMRangeSlider = document.createElement("div");
    DOMRangeSlider.className = "range-slider";
    //
    const DOMSliderRoller = document.createElement("div");
    DOMSliderRoller.className = "range-slider__slider-roller";
    //
    const DOMScaleContainer = document.createElement("div");
    DOMScaleContainer.className = "range-slider__scale-container";
    //
    DOMDiv.insertAdjacentElement("beforeend", DOMRangeSlider);
    DOMRangeSlider.insertAdjacentElement("beforeend", DOMSliderRoller);
    DOMRangeSlider.insertAdjacentElement("beforeend", DOMScaleContainer);

    return [DOMRangeSlider, DOMSliderRoller, DOMScaleContainer];
  };
  //Создание рычажка.
  createHandleElement = (
    DOMSliderRoller: HTMLDivElement,
    index: number
  ): HTMLDivElement[] => {
    const DOMHandleContainer = document.createElement("div");
    DOMHandleContainer.className = "range-slider__handle-container";
    //
    const DOMHandleView = document.createElement("div");
    DOMHandleView.className = "range-slider__handle-view";
    DOMHandleView.dataset.index = `${index}`;
    //
    const DOMHandleValue = document.createElement("div");
    DOMHandleValue.className = "range-slider__handle-value";
    //
    const DOMHandleValueText = document.createElement("div");
    DOMHandleValueText.className = "range-slider__handle-value-text";
    //
    DOMSliderRoller.insertAdjacentElement("beforeend", DOMHandleContainer);
    DOMHandleContainer.insertAdjacentElement("beforeend", DOMHandleValue);
    DOMHandleValue.insertAdjacentElement("beforeend", DOMHandleValueText);
    DOMHandleContainer.insertAdjacentElement("beforeend", DOMHandleView);
    //
    return [DOMHandleContainer, DOMHandleView, DOMHandleValue, DOMHandleValueText];
  };
  //Создание метки шкалы масштаба.
  createScaleMarker = (DOMsOfSlider: IDOMsOfSlider): HTMLDivElement[] => {
    const DOMScaleMarkContainer = document.createElement("div");
    DOMScaleMarkContainer.className = "range-slider__scale-mark-container";
    //
    const DOMScaleMarkSeparator = document.createElement("div");
    DOMScaleMarkSeparator.className = "range-slider__scale-mark-separator";
    //
    const DOMScaleMarkValue = document.createElement("div");
    DOMScaleMarkValue.className = "range-slider__scale-mark-value";
    //
    const DOMScaleMarkValueText = document.createElement("div");
    DOMScaleMarkValueText.className = "range-slider__scale-mark-value-text";

    DOMScaleMarkContainer.insertAdjacentElement(
      "beforeend",
      DOMScaleMarkSeparator
    );
    DOMScaleMarkContainer.insertAdjacentElement("beforeend", DOMScaleMarkValue);
    DOMScaleMarkValue.insertAdjacentElement("beforeend", DOMScaleMarkValueText);
    if (DOMsOfSlider.DOMScaleContainer)
      DOMsOfSlider.DOMScaleContainer.insertAdjacentElement(
        "beforeend",
        DOMScaleMarkContainer
      );
    return [
      DOMScaleMarkContainer,
      DOMScaleMarkSeparator,
      DOMScaleMarkValue,
      DOMScaleMarkValueText,
    ];
  };
  //Отрисовка элементов View по данным Model.
  renderView = (DOMsOfSlider: IDOMsOfSlider, modelData: IModelData): void => {
    this.renderViewHandle(DOMsOfSlider, modelData);
    this.renderViewScaleMarkers(DOMsOfSlider, modelData);
  };
  //Отрисовка положений маркеров на шкале масштаба.
  renderViewScaleMarkers = (
    DOMsOfSlider: IDOMsOfSlider,
    modelData: IModelData
  ): void => {
    DOMsOfSlider.DOMsScaleMarkers?.forEach((DOMsScaleMarker, index) => {
      if (
        DOMsScaleMarker.DOMScaleMarkValueText &&
        DOMsScaleMarker.DOMScaleMarkContainer &&
        modelData.scaleData &&
        modelData.scaleData.markArray &&
        modelData.maxValue &&
        modelData.minValue
      ) {
        DOMsScaleMarker.DOMScaleMarkValueText.innerHTML = `${modelData.scaleData.markArray[index]}`;
        const styleLeft =
          ((modelData.scaleData.markArray[index] - modelData.minValue) /
            (modelData.maxValue - modelData.minValue)) *
          100;
        DOMsScaleMarker.DOMScaleMarkContainer.setAttribute(
          "style",
          `left:${styleLeft}%`
        );
      }
    });
  };
  //Отрисовка положений рычажков.
  renderViewHandle = (
    DOMsOfSlider: IDOMsOfSlider,
    modelData: IModelData
  ): void => {
    //Постановка рычажков на своё место по шагу(step).
    modelData.handles?.forEach((handleObj, index) => {
      if (
        handleObj.step !== undefined &&
        modelData.maxSteps !== undefined &&
        DOMsOfSlider.DOMsSliderHandles !== undefined
      ) {
        const styleLeft = (handleObj.step / modelData.maxSteps) * 100;
        (
          DOMsOfSlider.DOMsSliderHandles[index].DOMHandleContainer as HTMLDivElement
        ).setAttribute("style", `left:${styleLeft}%`);
      }
      //Перерисовка значений облачков над рычажками.
      modelData.handles?.forEach((handleObj, index) => {
        if (DOMsOfSlider.DOMsSliderHandles) {
          (
            DOMsOfSlider.DOMsSliderHandles[index]
              .DOMHandleValueText as HTMLDivElement
          ).innerHTML = `${handleObj.value}`;
        }
      });
    });
  };

  //Подписание рычажков на события перетаскивания.
  subscriptionHandleEvent = (
    DOMSliderHandle: IDOMsSliderHandles,
    DOMsOfSlider: IDOMsOfSlider,
    modelData: IModelData
  ): void => {
    const handlerDragAndDrop: HandlerDragAndDrop = new HandlerDragAndDrop(
      DOMSliderHandle,
      DOMsOfSlider,
      modelData
    );
    handlerDragAndDrop.addEvent();
  };
}

export default View;
