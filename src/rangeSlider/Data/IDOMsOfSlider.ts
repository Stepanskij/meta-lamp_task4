import IDOMsSliderHandle from "./DOMsData/IDOMsSliderHandle";
import IDOMsScaleMark from "./DOMsData/IDOMsScaleMark";

interface IDOMsOfSlider {
  DOMRangeSlider?: HTMLDivElement;
  DOMSliderRoller?: HTMLDivElement;
  DOMsSliderHandles?: IDOMsSliderHandle[];
  DOMScaleContainer?: HTMLDivElement;
  DOMsScaleMarkers?: IDOMsScaleMark[];
}

export default IDOMsOfSlider;
