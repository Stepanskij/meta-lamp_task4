import IHandles from "./IHandles";
import IScaleData from "./IScaleData";

interface IModelData {
  numberRounding?: number;
  maxValue?: number;
  minValue?: number;
  stepSize?: number;
  maxSteps?: number;
  handles?: IHandles[];
  handlesCanPushed?: boolean;
  scaleData?: IScaleData;
  bordersFillStrips?: number[];
}

export default IModelData;
