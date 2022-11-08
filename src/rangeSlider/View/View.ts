//импорт классов
import HandleDragAndDrop from "./viewParts/HandleDragAndDrop";
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
    return [
      DOMHandleContainer,
      DOMHandleView,
      DOMHandleValue,
      DOMHandleValueText,
    ];
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
  //Создание полосы заполнения.
  createFillStrip = (
    DOMsOfSlider: IDOMsOfSlider,
    leftBorderNumber: number
  ): HTMLDivElement => {
    const DOMFillStrip = document.createElement("div");
    DOMFillStrip.className = "range-slider__flip-scrip";
    DOMFillStrip.dataset.leftBorderNumber = `${leftBorderNumber}`;
    //
    if (DOMsOfSlider.DOMSliderRoller)
      DOMsOfSlider.DOMSliderRoller.insertAdjacentElement(
        "beforeend",
        DOMFillStrip
      );
    return DOMFillStrip;
  };
  //Отрисовка элементов View по данным Model.
  renderView = (DOMsOfSlider: IDOMsOfSlider, modelData: IModelData): void => {
    this.renderViewHandles(DOMsOfSlider, modelData);
    this.renderViewScaleMarkers(DOMsOfSlider, modelData);
    this.renderFillStrips(DOMsOfSlider);
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
  renderViewHandles = (
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
          DOMsOfSlider.DOMsSliderHandles[index]
            .DOMHandleContainer as HTMLDivElement
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
  renderFillStrips = (DOMsOfSlider: IDOMsOfSlider): void => {
    DOMsOfSlider.DOMsFillStrips?.forEach((DOMFillStrip) => {
      if (DOMsOfSlider.DOMsSliderHandles) {
        const leftBorderNumber = Number(DOMFillStrip.dataset.leftBorderNumber);
        let styleLeftBorder = 0;
        let styleRightBorder = 100;
        //Находим отступ левой границы от левого края ролика, %.
        if (leftBorderNumber > 0) {
          styleLeftBorder = Number(
            DOMsOfSlider.DOMsSliderHandles[
              leftBorderNumber - 1
            ].DOMHandleContainer?.style.left.replace(/[%]/g, "")
          );
        }
        //Находим отступ правой границы от левого края ролика, %.
        if (
          leftBorderNumber <
          (DOMsOfSlider.DOMsSliderHandles as IDOMsSliderHandles[]).length
        ) {
          styleRightBorder = Number(
            DOMsOfSlider.DOMsSliderHandles[
              leftBorderNumber
            ].DOMHandleContainer?.style.left.replace(/[%]/g, "")
          );
        }
        //
        const styleLeft = styleLeftBorder;
        const styleWidth = styleRightBorder - styleLeftBorder;
        DOMFillStrip.setAttribute(
          "style",
          `width:${styleWidth}%; left:${styleLeft}%`
        );
      }
    });
  };
  //Подписание рычажков на события перетаскивания.
  subscriptionHandleEvent = (
    DOMSliderHandle: IDOMsSliderHandles,
    DOMsOfSlider: IDOMsOfSlider,
    modelData: IModelData,
    viewMethods: View
  ): void => {
    const handlerDragAndDrop: HandleDragAndDrop = new HandleDragAndDrop(
      DOMSliderHandle,
      DOMsOfSlider,
      modelData,
      viewMethods
    );
    handlerDragAndDrop.addEvent();
  };
}

export default View;
