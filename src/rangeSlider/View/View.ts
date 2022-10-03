import "./sliderParts/handlerHandle";

class View {
  constructor() {}

  createHTMLelements = (DOMDiv: HTMLDivElement): void => {
    const DOMRangeSlider = document.createElement("div");
    const DOMSliderRoller = document.createElement("div");
    const DOMSliderHandle = document.createElement("button");
    DOMRangeSlider.className = "range-slider";
    DOMSliderRoller.className = "range-slider__slider-roller";
    DOMSliderHandle.className = "range-slider__slider-button";

    DOMDiv.insertAdjacentElement("beforeend", DOMRangeSlider);
    DOMRangeSlider.insertAdjacentElement("beforeend", DOMSliderRoller);
    DOMSliderRoller.insertAdjacentElement("beforeend", DOMSliderHandle);

    this.subscriptionHandleEvent(DOMSliderHandle);
  };

  subscriptionHandleEvent = (DOMHandleButton: HTMLButtonElement): void => {};
}

export default View;
