import IDOMsSliderHandle from "./DOMsData/IDOMsSliderHandle";
import IDOMsScaleMark from "./DOMsData/IDOMsScaleMark";

interface IViewData {
  DOMRangeSlider?: HTMLDivElement;
  DOMSliderRoller?: HTMLDivElement;
  DOMsSliderHandles?: IDOMsSliderHandle[];
  DOMScaleContainer?: HTMLDivElement;
  DOMsScaleMarkers?: IDOMsScaleMark[];
  DOMsFillStrips?: HTMLDivElement[];
}

export default IViewData;
