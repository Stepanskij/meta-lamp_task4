//импорт классов
import HandleDragAndDrop from "./viewParts/HandleDragAndDrop";
import Event from "rangeSlider/Event/Event";
import EventArgs from "rangeSlider/Event/EventArgs";
//импорт интерфейсов
import IViewData from "rangeSlider/Data/IViewData";
import IModelData from "rangeSlider/Data/IModelData";
import IDOMsSliderHandles from "rangeSlider/Data/DOMsData/IDOMsSliderHandle";
import IDOMsScaleMark from "rangeSlider/Data/DOMsData/IDOMsScaleMark";
import IHandleMouseMove from "rangeSlider/Data/IHandleMouseMove";

class View {
  data: IViewData = {
    DOMsSliderHandles: [],
    DOMsScaleMarkers: [],
    DOMsFillStrips: [],
  };

  customEvents = {
    onMouseMove: new Event<IHandleMouseMove>(),
  };
  handleDragAndDrop = new HandleDragAndDrop(this);

  constructor() {}

  loadContent = () => {};

  makeSlider = (DOMDiv: HTMLDivElement, modelData: IModelData): void => {
    this.createBaseElements(DOMDiv, modelData); //Создаёт базовые элементы слайдера.
    //Создаются элементы рычажков слайдера.
    modelData.handles?.forEach((handleObj, index) => {
      this.createHandleElement(index);
    });
    //Создаются элементы меток масштаба слайдера.
    modelData.scaleData?.markArray?.forEach(() => {
      this.createScaleMarker();
    });
    //Создание полосок заполнения рычажков.
    if (modelData.bordersFillStrips) {
      modelData.bordersFillStrips.forEach((rightBorderStrip) => {
        this.createFillStrip(rightBorderStrip);
      });
    }
    //Навешание ивентов HandleDragAndDrop на рычажки.
    modelData.handles?.forEach((handleObj, index) => {
      if (this.data.DOMsSliderHandles)
        this.handleDragAndDrop.addEvent(this.data.DOMsSliderHandles[index]);
    });
  };

  //Создание базовых HTML-элементов.
  private createBaseElements = (
    DOMDiv: HTMLDivElement,
    modelData: IModelData
  ): void => {
    const DOMRangeSlider = document.createElement("div");
    DOMRangeSlider.className = "range-slider";
    if (modelData.isVertical)
      DOMRangeSlider.classList.add("range-slider_vertical");
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

    this.data.DOMRangeSlider = DOMRangeSlider;
    this.data.DOMSliderRoller = DOMSliderRoller;
    this.data.DOMScaleContainer = DOMScaleContainer;
  };
  //Создание рычажка.
  private createHandleElement = (index: number): void => {
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
    if (this.data.DOMSliderRoller)
      this.data.DOMSliderRoller.insertAdjacentElement(
        "beforeend",
        DOMHandleContainer
      );
    DOMHandleContainer.insertAdjacentElement("beforeend", DOMHandleValue);
    DOMHandleValue.insertAdjacentElement("beforeend", DOMHandleValueText);
    DOMHandleContainer.insertAdjacentElement("beforeend", DOMHandleView);
    //
    (this.data.DOMsSliderHandles as IDOMsSliderHandles[]).push({
      DOMHandleContainer: DOMHandleContainer,
      DOMHandleView: DOMHandleView,
      DOMHandleValue: DOMHandleValue,
      DOMHandleValueText: DOMHandleValueText,
    });
  };
  //Создание метки шкалы масштаба.
  private createScaleMarker = (): void => {
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
    if (this.data.DOMScaleContainer)
      this.data.DOMScaleContainer.insertAdjacentElement(
        "beforeend",
        DOMScaleMarkContainer
      );
    (this.data.DOMsScaleMarkers as IDOMsScaleMark[]).push({
      DOMScaleMarkContainer: DOMScaleMarkContainer,
      DOMScaleMarkSeparator: DOMScaleMarkSeparator,
      DOMScaleMarkValue: DOMScaleMarkValue,
      DOMScaleMarkValueText: DOMScaleMarkValueText,
    });
  };
  //Создание полосы заполнения.
  private createFillStrip = (leftBorderNumber: number): void => {
    const DOMFillStrip = document.createElement("div");
    DOMFillStrip.className = "range-slider__flip-scrip";
    DOMFillStrip.dataset.leftBorderNumber = `${leftBorderNumber}`;
    //
    if (this.data.DOMSliderRoller)
      this.data.DOMSliderRoller.insertAdjacentElement(
        "beforeend",
        DOMFillStrip
      );
    (this.data.DOMsFillStrips as HTMLDivElement[]).push(DOMFillStrip);
  };
  //Отрисовка элементов View по данным Model.
  renderView = (modelData?: EventArgs<IModelData>): void => {
    if (modelData?.data) {
      this.renderViewHandles(modelData?.data);
      this.renderViewScaleMarkers(modelData?.data);
      this.renderFillStrips(modelData?.data);
    }
  };
  //Отрисовка положений маркеров на шкале масштаба.
  private renderViewScaleMarkers = (modelData: IModelData): void => {
    this.data.DOMsScaleMarkers?.forEach((DOMsScaleMarker, index) => {
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
        if (!modelData.isVertical) {
          DOMsScaleMarker.DOMScaleMarkContainer.setAttribute(
            "style",
            `left:${styleLeft}%`
          );
        } else {
          DOMsScaleMarker.DOMScaleMarkContainer.setAttribute(
            "style",
            `bottom:${styleLeft}%`
          );
        }
      }
    });
  };
  //Отрисовка положений рычажков.
  private renderViewHandles = (modelData: IModelData): void => {
    //Постановка рычажков на своё место по шагу(step).
    modelData.handles?.forEach((handleObj, index) => {
      if (
        handleObj.step !== undefined &&
        modelData.maxSteps !== undefined &&
        this.data.DOMsSliderHandles !== undefined
      ) {
        const styleLeft = (handleObj.step / modelData.maxSteps) * 100;
        if (!modelData.isVertical) {
          (
            this.data.DOMsSliderHandles[index]
              .DOMHandleContainer as HTMLDivElement
          ).setAttribute("style", `left:${styleLeft}%`);
        } else {
          (
            this.data.DOMsSliderHandles[index]
              .DOMHandleContainer as HTMLDivElement
          ).setAttribute("style", `bottom:${styleLeft}%`);
        }
      }
      //Перерисовка значений облачков над рычажками.
      modelData.handles?.forEach((handleObj, index) => {
        if (this.data.DOMsSliderHandles) {
          (
            this.data.DOMsSliderHandles[index]
              .DOMHandleValueText as HTMLDivElement
          ).innerHTML = `${handleObj.value}`;
        }
      });
    });
  };
  private renderFillStrips = (modelData: IModelData): void => {
    this.data.DOMsFillStrips?.forEach((DOMFillStrip) => {
      if (this.data.DOMsSliderHandles) {
        const leftBorderNumber = Number(DOMFillStrip.dataset.leftBorderNumber);
        let styleLeftBorder = 0;
        let styleRightBorder = 100;
        //Находим отступ левой границы от левого края ролика, %.
        if (leftBorderNumber > 0) {
          if (!modelData.isVertical) {
            styleLeftBorder = Number(
              this.data.DOMsSliderHandles[
                leftBorderNumber - 1
              ].DOMHandleContainer?.style.left.replace(/[%]/g, "")
            );
          } else {
            styleLeftBorder = Number(
              this.data.DOMsSliderHandles[
                leftBorderNumber - 1
              ].DOMHandleContainer?.style.bottom.replace(/[%]/g, "")
            );
          }
        }
        //Находим отступ правой границы от левого края ролика, %.
        if (
          leftBorderNumber <
          (this.data.DOMsSliderHandles as IDOMsSliderHandles[]).length
        ) {
          if (!modelData.isVertical) {
            styleRightBorder = Number(
              this.data.DOMsSliderHandles[
                leftBorderNumber
              ].DOMHandleContainer?.style.left.replace(/[%]/g, "")
            );
          } else {
            styleRightBorder = Number(
              this.data.DOMsSliderHandles[
                leftBorderNumber
              ].DOMHandleContainer?.style.bottom.replace(/[%]/g, "")
            );
          }
        }
        //
        const styleLeft = styleLeftBorder;
        const styleWidth = styleRightBorder - styleLeftBorder;
        if (!modelData.isVertical) {
          DOMFillStrip.setAttribute(
            "style",
            `width:${styleWidth}%; left:${styleLeft}%`
          );
        } else {
          DOMFillStrip.setAttribute(
            "style",
            `height:${styleWidth}%; bottom:${styleLeft}%`
          );
        }
      }
    });
  };
}

export default View;
