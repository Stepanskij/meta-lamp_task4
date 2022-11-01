import IHandles from "./IHandles";
import IScaleData from "./IScaleData";

interface IModelData {
  maxValue?: number;
  minValue?: number;
  stepSize?: number;
  maxSteps?: number;
  handles?: IHandles[];
  handlesCanPushed?: boolean;
  scaleData?: IScaleData;
}

export default IModelData;
