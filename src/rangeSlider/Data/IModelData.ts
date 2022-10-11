import IHandles from "./IHandles";

interface IModelData {
  maxValue?: number;
  minValue?: number;
  stepSize?: number;
  numberSteps?: number;
  handles?: IHandles[];
}

export default IModelData;
