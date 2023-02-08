import IScaleData from "./IScaleData";

interface IModelData {
  numberRounding?: number;
  maxValue?: number;
  minValue?: number;
  shiftStepSize?: number;
  maxShiftSteps?: number;
  handles?: number[];
  handlesCanPushed?: boolean;
  isVertical?: boolean;
  scaleData?: IScaleData;
  idsFillStrip?: number[];
}

export default IModelData;
